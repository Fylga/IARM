import os
import pytz
import json
import logging
from io import BytesIO
from datetime import datetime

import azure.functions as func
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.blob import BlobServiceClient

# Load environment
load_dotenv()

# Key Vault Configuration
key_vault_name = os.environ.get("KEY_VAULT_NAME")
kv_uri = f"https://{key_vault_name}.vault.azure.net"
credential = DefaultAzureCredential()
keyvault_client = SecretClient(vault_url=kv_uri, credential=credential)

# Azure Speech & OpenAI Config
speech_key = keyvault_client.get_secret("AZURE-SPEECH-KEY").value
speech_region = keyvault_client.get_secret("AZURE-SPEECH-REGION").value
openai_key = keyvault_client.get_secret("AZURE-OPENAI-KEY").value
openai_endpoint = keyvault_client.get_secret("AZURE-OPENAI-ENDPOINT").value
openai_model = keyvault_client.get_secret("AZURE-MODEL").value
openai_version = keyvault_client.get_secret("AZURE-OPENAI-VERSION").value

app = func.FunctionApp()


@app.blob_trigger(
    arg_name="myblob",
    path="audio-calls/{name}",
    connection="AzureWebJobsStorage"
)
def handle_calls(myblob: func.InputStream):
    logging.info(f"🔔 Processing blob: {myblob.name} ({myblob.length} bytes)")

    try:
        # Read WAV data from blob
        wav_data = myblob.read()
        wav_stream = BytesIO(wav_data)

        # Create stream for Azure Speech SDK
        push_stream = speechsdk.audio.PushAudioInputStream()
        push_stream.write(wav_stream.read())
        push_stream.close()

        audio_config = speechsdk.audio.AudioConfig(stream=push_stream)
        speech_config = speechsdk.SpeechConfig(
            subscription=speech_key,
            region=speech_region
        )
        speech_config.speech_recognition_language = "fr-FR"

        recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config,
            audio_config=audio_config
        )

        result = recognizer.recognize_once()

        # Handle recognition results
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            logging.info(f"✅ Transcribed Text: {result.text}")
            paris_tz = pytz.timezone("Europe/Paris")
            current_time_fr = datetime.now(paris_tz).strftime("%Y-%m-%d %H:%M:%S")

            openai_client = AzureOpenAI(
                api_key=openai_key,
                api_version=openai_version,
                azure_endpoint=openai_endpoint
            )

            try:
                prompt = f"""
                Tu es un Assistant de Régulation Médicale (ARM). À partir de cette transcription d’appel téléphonique, génère un résumé structuré sous forme de JSON uniquement.

                Tu dois identifier les éléments suivants au mieux même si toutes les informations ne sont pas explicites :
                - "nom": nom de l’appelant ou de la personne concernée (si mentionné).
                - "âge": âge approximatif ou mentionné.
                - "sexe": "masculin" ou "féminin".
                - "description": résumé des symptômes ou situation.
                - "localisation": lieu de l'incident (adresse ou ville si disponible).
                - "heure_appel": heure de réception de l'appel, format YYYY-MM-DD HH:MM:SS en heure française.
                - "urgence": degré d’urgence médical selon la classification ARM (P0, P1, P2, P3).
                - "niveau_soins": niveau de soins requis (R1, R2, R3, R4).
                - "bilan": pré-évaluation ARM si l’appelant est un effecteur (B0 à B3).
                - "transcription": texte brut reconnu de l’appel (reprendre intégralement).

                Voici la transcription :
                \"\"\"{result.text}\"\"\"

                L'heure d'appel est : {current_time_fr}

                Retourne uniquement un JSON. Exemple :

                {{
                  "nom": "Jean Dupont",
                  "âge": "environ 65 ans",
                  "sexe": "masculin",
                  "description": "Douleur thoracique soudaine, difficulté à respirer",
                  "localisation": "23 rue des Lilas, Bordeaux",
                  "heure_appel": "2025-04-21 14:47:00",
                  "urgence": "P1",
                  "niveau_soins": "R1",
                  "bilan": "B1",
                  "transcription": "texte complet ici"
                }}
                """

                completion = openai_client.chat.completions.create(
                    model=openai_model,
                    messages=[
                        {"role": "system", "content": "Tu es un assistant de traitement d'appels d'urgence ARM."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2,
                )

                response_text = completion.choices[0].message.content.strip()
                logging.info(f"🧠 Structured Response from OpenAI:\n{response_text}")

                response_text = response_text.strip()
                # Enlever les balises de code markdown si présentes
                if response_text.startswith("```json"):
                    response_text = response_text.replace("```json", "", 1)
                    if response_text.endswith("```"):
                        response_text = response_text[:-3]
                response_text = response_text.strip()

                try:
                    # Nettoyer et parser le contenu JSON retourné par OpenAI
                    parsed_json = ""
                    try:
                        parsed_json = json.loads(response_text)
                    except json.JSONDecodeError as e:
                        logging.error(f"❌ JSON invalide reçu d'OpenAI: {e}")
                        return

                    # Nom du blob (même que l’audio mais en .json)
                    original_name = myblob.name.split("/")[-1].rsplit(".", 1)[0]
                    json_blob_name = f"call-summary/{original_name}.json"

                    # Enregistrer dans Azure Blob Storage
                    blob_conn_str = os.environ.get("AzureWebJobsStorage")
                    blob_service = BlobServiceClient.from_connection_string(blob_conn_str)
                    container_client = blob_service.get_container_client("call-summary")

                    container_client.upload_blob(
                        name=json_blob_name,
                        data=json.dumps(parsed_json, ensure_ascii=False, indent=2),
                        overwrite=True
                    )

                    logging.info(f"✅ Résumé JSON sauvegardé dans call-summary/{json_blob_name}")

                except Exception as e:
                    logging.error(f"❌ Erreur de sauvegarde du JSON: {e}")
            except Exception as e:
                logging.error(f"❌ OpenAI request failed: {e}")
        elif result.reason == speechsdk.ResultReason.NoMatch:
            logging.warning("⚠️ No speech recognized.")
        elif result.reason == speechsdk.ResultReason.Canceled:
            details = result.cancellation_details
            logging.error(f"❌ Canceled: {details.reason}")
            if details.reason == speechsdk.CancellationReason.Error:
                logging.error(f"Details: {details.error_details}")
    except Exception as e:
        logging.exception(f"Unhandled error during processing: {e}")
