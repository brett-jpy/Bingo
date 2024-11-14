from flask import Flask, render_template, url_for, redirect, request, session, jsonify, make_response
from flask_session import Session
import os
from pymongo import MongoClient
from bson.json_util import dumps
import time
import json

"""
Bingo App - Tries to be aware of others users and notify when someone wins!!

v1: Uses janky ajax calls every second to check if theres a winner
v2: Should use flask_socketio to hopefully remove jank
"""

###########
# Flask
###########
app = Flask(__name__)

###########
# Mongo
###########
client = MongoClient("192.168.1.5:27017")
database = client["Bingo"]
coll = database["tracking"]

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
    return render_template("index.html")

# Runs the actual game
@app.route("/bingo", methods=["GET"])
def bingo():
    if session.get("username") == None:
        return redirect(url_for("index"))
    if not session["username"]:
        return redirect(url_for("index"))
    else:
        return render_template("bingo.html")

# Destroys your session, thus forcing you back to the homepage
@app.route("/logout")
def logout():
    session["username"] = None
    return redirect(url_for("index"))

###########
# Data Routes
###########
@app.route("/notify", methods=["GET", "POST"])
def notify():
    if request.method == "POST":
        data = request.get_json()["username"] # Not doing anything with this
        _id = coll.insert_one({ "result": "winner", "username": session.get("username") })
        print(_id.inserted_id)
        time.sleep(5)
        coll.delete_one({ "_id": _id.inserted_id })
        return make_response(json.dumps({"status": "Done!"}), 200)
    return make_response(json.dumps({"status": "none"}), 200)

@app.route("/polling")
def polling():
    lkup = coll.find_one({ "result": "winner" })
    if lkup == None:
        return make_response(json.dumps({"status": "none"}), 200)
    else:
        return make_response(dumps(lkup), 200)

# Should be removed before running with gunicorn
if __name__=="__main__":
    app.run(debug=True)
