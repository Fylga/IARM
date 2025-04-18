import os
import wave
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
from openai import AzureOpenAI

load_dotenv()

speech_key = os.getenv("AZURE-SPEECH-KEY")
speech_region = os.getenv("AZURE-SPEECH-REGION")
openai_key = os.getenv("AZURE-OPENAI-KEY")
endpoint = os.getenv("AZURE-OPENAI-ENDPOINT")
model_key = os.getenv("AZURE-MODEL")
version = os.getenv("AZURE-OPENAI-VERSION")

def transcribe_audio(file_path):
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    speech_config.speech_recognition_language = "fr-FR"

    audio_input = speechsdk.AudioConfig(filename=file_path)
    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)
    result = recognizer.recognize_once()

    if result.reason != speechsdk.ResultReason.RecognizedSpeech:
        print("❌ Erreur : ", result.reason)

    if result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("🔍 Détails de l'erreur : ", cancellation_details.error_details)


    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("✅ Transcription : ", result.text)
        return result.text

    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("❌ Reconnaissance annulée :", cancellation_details.reason)
        print("🔍 Détails de l'erreur :", cancellation_details.error_details)


def summarize(text: str):
    client = AzureOpenAI(api_version=version, azure_endpoint=endpoint, api_key=openai_key)

    prompt = f"""
        À partir de la transcription suivante d'un appel d'urgence, extraire et synthétiser :
        1. Le contexte de l'accident
        2. L'état de la victime
        3. Les actions à prendre en compte dans le contexte du SAMU en France

        Transcription : {text}
        """

    response = client.chat.completions.create(
        model=model_key,
        messages=[
            {"role": "system", "content": "Vous êtes un assistant médical spécialisé dans les urgences médicales en France."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=500
    )

    result = response.choices[0].message.content
    print(result)




if __name__ == "__main__":
    audio_file = "audio/output.wav"
    texte_transcrit = transcribe_audio(audio_file)
    summarize(texte_transcrit)