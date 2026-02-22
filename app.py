import base64
import hashlib
import io
import json
from flask import Flask, jsonify, request, render_template
from utils.gemini_api import get_species_information
from utils.classifier import get_animal
from PIL import Image
import sqlite3
import os


app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def get_db():
    db_path = os.path.join(BASE_DIR, "animals.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/animal-detector/")
def animal_detector():
    return render_template("animal-detector/index.html")


@app.route("/animaldex/")
def animaldex():
    return render_template("animaldex/index.html")


@app.route("/init", methods=["GET"])
def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS animals(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        info TEXT NOT NULL,
        image BLOB NOT NULL,
        image_type TEXT NOT NULL
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()
    print("Initialized database")
    return jsonify({"message": "Initialized database"})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = get_db()
        conn.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, hashed_password),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Username already exists"}), 409
    

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Missing username or password", "success": False}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        (username, hashed_password),
    ).fetchone()
    conn.close()

    if user:
        return jsonify({"message": f"Welcome {username}!", "success": True}), 200
    else:
        return jsonify({"message": "Invalid credentials", "success": False}), 401



@app.route("/animals", methods=["GET"])
def get_animals():
    conn = get_db()
    rows = conn.execute("SELECT * FROM animals").fetchall()
    conn.close()

    animals = []
    for row in rows:
        animals.append(
            {
                "id": row["id"],
                "name": row["name"],
                "info": json.loads(row["info"]),
                "image": base64.b64encode(row["image"]).decode("utf-8"),
                "image_type": row["image_type"],
            }
        )

    return jsonify(animals)


@app.route("/identify", methods=["POST"])
def identify_animal():
    file = request.files.get("image")
    if file:
        if not os.path.exists("speciesnet-input"):
            os.makedirs("speciesnet-input")
        file.save("speciesnet-input/temp.jpg")
        print("Obtained Image!")
    else:
        print("No image obtained")
        return jsonify({"message": "No image obtained"}), 400

    file.seek(0)
    image_bytes = file.read()

    animal = get_animal()

    if animal.lower() == "blank":
        return jsonify({"message": "No animal identified"}), 400

    location = "World"
    info = get_species_information(animal, location)

    if info == None:
        return jsonify({"message": "API call failed"}), 400

    print(animal)
    print(info)

    conn = get_db()
    conn.execute(
        "INSERT INTO animals (name, info, image, image_type) VALUES (?, ?, ?, ?)",
        (animal, json.dumps(info), image_bytes, file.content_type),
    )
    conn.commit()
    conn.close()

    return (
        jsonify({"message": "Animal identified", "name": animal, "animal_data": info}),
        200,
    )


if __name__ == "__main__":
    app.static_folder = "static"
    with app.app_context():
        init_db()
    app.run(debug=True)
