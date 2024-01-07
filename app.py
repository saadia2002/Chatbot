from flask import Flask, render_template, request, jsonify
from werkzeug.wrappers import response

from audio_recognition import get_audio, audio_to_text, play_sound
import chat
import enChat
import dutchChat
import speech_recognition as sr
import gtts
from playsound import playsound
import os

app = Flask(__name__)

@app.get("/")
def index_get():
    return render_template("index.html")
@app.get("/about")
def about_get():
    return render_template("about.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    language=request.get_json().get("language")
    response = ""
    if language =="en":
        response = enChat.get_response(text)
    elif language =="fr":
        response = chat.get_response(text)
    elif language=="nl":
        response=dutchChat.get_response(text)
    message = {"answer": response}
    return jsonify(message)

@app.post('/play')
def play():
    text = request.get_json().get("message")
    language=request.get_json().get("language")
    play_sound(language,text.encode("windows-1252").decode("utf-8"))
    return jsonify(text)

@app.post("/audio")
def predictAudio():
    audio = get_audio()
    
    text = audio_to_text(audio)
    # response = get_response(text)
    # print(text)
    # print(response)
    # play_sound(response.encode("windows-1252").decode("utf-8"))
    # return jsonify({"question": text , "answer": response})
    return jsonify({"question": text})
    

if __name__ == "__main__":
    app.run(debug=True)
