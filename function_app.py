import os
import tempfile
import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient, ContainerClient
import azure.cognitiveservices.speech as speechsdk
from openai import AzureOpenAI
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

# Load environment variables
keyVaultName = os.environ.get("KEY_VAULT_NAME")
KVUri = f"https://{keyVaultName}.vault.azure.net"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=KVUri, credential=credential)

speech_key = os.environ.get("AZURE-SPEECH-KEY")
speech_region = os.environ.get("AZURE-SPEECH-REGION")
openai_key = os.environ.get("AZURE-OPENAI-KEY")
endpoint = os.environ.get("AZURE-OPENAI-ENDPOINT")
model_key = os.environ.get("AZURE-MODEL")
version = os.environ.get("AZURE-OPENAI-VERSION")

app = func.FunctionApp()

def transcribe_audio(file_path: str) -> str:
    speech_config = speechsdk.SpeechConfig(
        subscription=speech_key,
        region=speech_region
    )
    speech_config.speech_recognition_language = "fr-FR"
    audio_config = speechsdk.audio.AudioConfig(filename=file_path)
    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config,
        audio_config=audio_config
    )

    logging.info("Transcribing audio...")
    result = recognizer.recognize_once()
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        logging.info("Transcription successful.")
        return result.text
    else:
        logging.warning(f"Transcription failed: {result.reason}")
        return ""

def summarize(transcript: str) -> str:
    client = AzureOpenAI(api_version=version, azure_endpoint=endpoint, api_key=openai_key)

    prompt = f"""
        À partir de la transcription suivante d'un appel d'urgence, extraire et synthétiser les informations en JSON utiles pour un opérateur d'ARM.":
        1. Le contexte de l'accident
        2. L'état de la victime
        3. Les actions à prendre en compte dans le contexte du SAMU en France

        Transcription : {transcript}
        """

    logging.info("Summarizing transcript...")
    try:
        response = client.chat.completions.create(
            model=model_key,
            messages=[
                {"role": "system", "content": "Vous êtes un assistant médical spécialisé dans les urgences médicales en France."},
                {"role": "user", "content": prompt}
            ],
        )
        logging.info("Summarization successful.")
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Summarization failed: {e}")
        return ""

@app.blob_trigger(arg_name="myblob", path="audio-calls/{name}",
                               connection="AzureWebJobsStorage") 
def handleCalls(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob"
                f"Name: {myblob.name}"
                f"Blob Size: {myblob.length} bytes")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp:
            temp.write(myblob.read())
            temp_path = temp.name

        transcript = transcribe_audio(temp_path)
        logging.info(f"Transcript: {transcript}")

        if transcript:
            structured_data = summarize(transcript)
            logging.info(f"Structured info: {structured_data}")

            # Store back in Blob
            blob_service_client = BlobServiceClient.from_connection_string(os.environ["AzureWebJobsStorage"])
            container_client = blob_service_client.get_container_client("structured-data")

            # Create container if it doesn't exist
            try:
                container_client.create_container()
            except Exception as e:
                logging.info("Container already exists or failed to create.")

            out_blob = container_client.get_blob_client(blob=myblob.name.replace(".mp3", ".json"))
            out_blob.upload_blob(structured_data, overwrite=True)
        else:
            logging.warning("No speech recognized.")
    except Exception as e:
        logging.error(f"Error processing blob: {e}")
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)