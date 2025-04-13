import requests
import os

# Clé API Groq
api_key = os.getenv("GROQ_API_KEY")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

# Contexte initial
context = """
Tu es un ARM du SAMU. Tu ne réponds qu'à UNE question à la fois puis tu poses UNE question.
Sois très direct, professionnel, précis.

Voici le début de l'appel :

Témoin : Bonjour, je m'appelle Yvan. Je suis devant une personne inconsciente, je ne suis pas sûr si elle respire, mais envoyez vite de l'aide s'il vous plaît.

ARM :
"""

def poser_question(user_input, context_history):
    data = {
        "model": "llama3-70b-8192",  # nom exact du modèle selon Groq
        "messages": context_history + [
            {"role": "user", "content": user_input}
        ],
        "temperature": 0.7
    }

    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)

    if response.ok:
        result = response.json()
        content = result['choices'][0]['message']['content']
        return content
    else:
        print("❌ Erreur :", response.status_code)
        print(response.text)
        return None

# Historique de conversation (init avec le contexte)
conversation = [
    {"role": "system", "content": context}
]

print("🩺 Simulation SAMU démarrée. Tape 'exit' pour quitter.\n")

while True:
    user_input = input("👤 Témoin : ")
    if user_input.lower() in ["exit", "quit"]:
        break

    response = poser_question(user_input, conversation)
    if response:
        print(f"\n🤖 ARM : {response}\n")
        conversation.append({"role": "user", "content": user_input})
        conversation.append({"role": "assistant", "content": response})
