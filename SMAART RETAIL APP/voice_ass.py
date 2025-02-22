import speech_recognition as sr
import pyttsx3

def speak(text):
    """Converts text to speech"""
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def recognize_speech():
    """Recognizes speech from the microphone"""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
            print("Processing...")
            command = recognizer.recognize_google(audio)
            print(f"You said: {command}")
            return command.lower()
        except sr.UnknownValueError:
            print("Sorry, I didn't catch that.")
            speak("Sorry, I didn't catch that.")
            return None
        except sr.RequestError:
            print("Could not request results; check your internet connection.")
            speak("Could not request results; check your internet connection.")
            return None

def process_command(command):
    """Processes user commands and executes appropriate actions"""
    if not command:
        return

    if "add" in command and "to inventory" in command:
        try:
            words = command.split()
            quantity = int(words[words.index("add") + 1])
            product = " ".join(words[words.index("to") + 2:])
            print(f"Adding {quantity} units of {product} to inventory.")
            speak(f"Added {quantity} units of {product} to inventory.")
            # Here, add logic to update your app's database
        except ValueError:
            print("Invalid command format.")
            speak("Invalid command format. Please try again.")

    elif "show products in" in command:
        category = command.split("in")[-1].strip()
        print(f"Fetching products in category: {category}.")
        speak(f"Here are the products in the {category} category.")
        # Fetch and display products from your database

    else:
        print("Command not recognized.")
        speak("Command not recognized. Please try again.")

if __name__ == "__main__":
    speak("Welcome to the Smart Retail Assistant.")
    while True:
        user_command = recognize_speech()
        if user_command in ["exit", "quit", "stop"]:
            speak("Goodbye!")
            break
        process_command(user_command)
