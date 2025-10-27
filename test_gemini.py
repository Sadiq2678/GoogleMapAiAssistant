import os
from google import genai

# --- 🔑 API Key ---
GEMINI_API_KEY = "AIzaSyACrunX4U_AAqKNIDeQT9lNCwTJGtb0TCE"

# --- 🤖 Gemini Model to Use ---
MODEL_NAME = "gemini-2.5-flash-preview-05-20"

# --- Initialize Gemini Client ---
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
    print(f"✅ Gemini Client initialized successfully.")
except Exception as e:
    print(f"❌ Error initializing Gemini Client: {e}")
    exit()

# --- Create Chat Session ---
try:
    chat = client.chats.create(model=MODEL_NAME)
    print(f"🤖 Gemini Chat initialized using model: {MODEL_NAME}")
    print("Type 'exit' or 'quit' to end the chat.\n")
except Exception as e:
    print(f"❌ Failed to create chat session for model '{MODEL_NAME}': {e}")
    exit()

# --- Chat Loop ---
def run_chat(chat_session):
    while True:
        try:
            user_input = input("You: ").strip()
            if user_input.lower() in ["exit", "quit"]:
                print("\n👋 Chat ended. Goodbye!")
                break

            response = chat_session.send_message(user_input)
            print(f"Gemini: {response.text}\n")

        except Exception as e:
            print(f"⚠️ Error: {e}")
            print("Trying to continue...\n")

if __name__ == "__main__":
    run_chat(chat)
