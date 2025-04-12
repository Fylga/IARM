import os
import wave
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

# Charger les variables d'environnement
load_dotenv()
speech_key = os.getenv("AZURE_SPEECH_KEY")
speech_region = os.getenv("AZURE_SPEECH_REGION")
language_key = os.getenv("AZURE_LANGUAGE_KEY")
language_endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT")

# Vérification du format WAV
def check_wav(file_path):
    try:
        with wave.open(file_path, 'rb') as wav:
            print("🔍 Format audio WAV :")
            print("  - Channels     :", wav.getnchannels())
            print("  - Sample rate  :", wav.getframerate())
            print("  - Sample width :", wav.getsampwidth(), "bytes")
    except Exception as e:
        print(f"❌ Erreur lors de l'ouverture du fichier WAV : {e}")

# Transcription audio avec Azure Speech
def transcribe_audio(file_path):
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    speech_config.speech_recognition_language = "fr-FR"

    audio_input = speechsdk.AudioConfig(filename=file_path)
    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

    print("🎙️ Transcription de l'audio...")
    result = recognizer.recognize_once()
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("✅ Transcription : ", result.text)
    else:
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

    return ""

# Analyse de sentiment et extraction de mots-clés
def analyze_text(text):
    client = TextAnalyticsClient(endpoint=language_endpoint, credential=AzureKeyCredential(language_key))
    
    documents = [text]

    # Analyse de sentiment
    sentiment = client.analyze_sentiment(documents=documents)[0]
    print(f"🧠 Sentiment général : {sentiment.sentiment}")
    print("📊 Détail par phrase :")
    for sentence in sentiment.sentences:
        print(f"  - {sentence.text} → {sentence.sentiment} "
              f"(pos={sentence.confidence_scores.positive:.2f}, neg={sentence.confidence_scores.negative:.2f})")
    
    # Extraction de mots-clés
    key_phrases = client.extract_key_phrases(documents=documents)[0].key_phrases
    print("🔑 Mots-clés extraits : ", key_phrases)

# Lancer le pipeline
if __name__ == "__main__":
    audio_file = "audio/output.wav"
    check_wav(audio_file)
    texte_transcrit = transcribe_audio(audio_file)
    if texte_transcrit:
        analyze_text(texte_transcrit)
