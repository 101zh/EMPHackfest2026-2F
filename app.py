import io
from flask import Flask, jsonify, request
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
    file = request.files.get('image')
    if file:
        file.save("speciesnet-input/temp.jpg")
        print("Obtained Image!")
    else:
        print("No image obtained")
        return jsonify({"message": "No image obtained"}), 400

    return jsonify({"message": "Work in Progress", "animal": "", "animal_data": ""}), 200


if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(debug=True)