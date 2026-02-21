import io
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


@app.route("/mission/")
def mission():
    return render_template("mission/index.html")


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
        name TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()
    print("Initialized database")
    return jsonify({"message": "Initialized database"})


@app.route("/animals", methods=["GET"])
def get_animals():
    conn = get_db()
    rows = conn.execute("SELECT * FROM animals").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


@app.route("/animals", methods=["POST"])
def add_animal():
    animal = request.get_json().get("animal")
    conn = get_db()
    conn.execute("INSERT INTO animals (name) VALUES (?)", (animal,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Added animal to database", "name": animal}), 201


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


    animal = get_animal()
    location = "World"
    info = get_species_information(animal, location)

    print(animal)
    print(info)

    return (
        jsonify({"message": "Animal identified", "animal": animal, "animal_data": info}),
        200,
    )


if __name__ == "__main__":
    app.static_folder = "static"
    with app.app_context():
        init_db()
    app.run(debug=True)
