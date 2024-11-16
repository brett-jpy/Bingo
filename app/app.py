from flask import Flask, render_template, url_for, redirect, request, session, jsonify, make_response
from flask_session import Session
import os
import time
import json
from flask_socketio import SocketIO, emit, send
from pymongo import MongoClient
from bson.json_util import dumps
from datetime import datetime
import uuid

"""
Bingo App - Tries to be aware of others users and notify when someone wins!!

v1: Uses janky ajax calls every second to check if theres a winner
v2: Should use flask_socketio to hopefully remove jank
   -- now usses socket io and the jank is def removed!
"""
###########
# Mongo
###########
client = MongoClient("192.168.1.5:27017")
database = client["Bingo"]
coll = database["leaderboard"]

###########
# Flask
###########
app = Flask(__name__)
app.config['SECRET_KEY'] = str(uuid.uuid4())
socketio = SocketIO(app, logger=True, engineio_logger=True, manage_session=False) # Set logger = False in prod

###########
# Session
###########
# Help: https://www.geeksforgeeks.org/how-to-use-flask-session-in-python-flask/#
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

###########
# View/User Routes
###########
@app.route("/", methods=["POST", "GET"])
def index():
  # if form is submited
    if request.method == "POST":
        # record the user name
        data = request.get_json()["username"]
        session["username"] = data
        # redirect to the main page
        return redirect(url_for("bingo"))
    elif session.get("username") != None:
        return redirect(url_for("bingo"))
    vic_data = coll.find().limit(10)
    return render_template("index.html", vic_data=vic_data)

# Runs the actual game
@app.route("/bingo", methods=["GET"])
def bingo():
    if session.get("username") == None:
        return redirect(url_for("index"))
    if not session["username"]:
        return redirect(url_for("index"))
    else:
        return render_template("bingo.html", username=session.get("username"))

# Destroys your session, thus forcing you back to the homepage
@app.route("/logout")
def logout():
    session["username"] = None
    return redirect(url_for("index"))

###########
# SocketIO Routes
###########
# Handles Auth
@socketio.on('connect')
def connect(data):
    emit('message', json.dumps({'message': 'New User Connected'}), broadcast=True)

# Handles Disconnect
@socketio.on('disconnect')
def disconnect():
    emit('disconnect')

# Handles Client Check-ins - acknowledges them with a response
@socketio.on('check_in')
def client_checkin(json):
    emit('ack_check_in', json)

# Broadcasts a message to all clients!
@socketio.on('winner')
def client_checkin(json):
    coll.insert_one({"username": json["username"]["name"], "victory_date": datetime.now().strftime("%b %d %Y")})
    emit('finalist', json["username"], broadcast=True, callback="noted")

if __name__=="__main__":
    socketio.run(app)