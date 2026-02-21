import subprocess
from pathlib import Path
import sys
import json

# Paths for images and classifier output
image_folder = Path(__file__).parent.parent / "speciesnet-input"
output_file = Path(__file__).parent / "output.json"


def get_animal(country_code) :
    # Delete old output.json (SpeciesNet throws error otherwise)
    if output_file.exists():
        output_file.unlink()
        print(f"Deleted old file: {output_file}")
    else:
        print("No old output file to delete.")

    # Run SpeciesNet classifier
    command = [
        sys.executable,  # Use current Python interpreter
        "-m",
        "speciesnet.scripts.run_model",
        "--classifier_only", # Set to classifier only mode
        "--folders",
        str(image_folder), # 
        "--predictions_json",
        str(output_file),
        "--country",
        country_code # Classifaction based on country
    ]

    print("Running classifier...")
    subprocess.run(command, input="y\n", text=True)
    print("Classifier finished!")

    # Read classification json
    with open(str(output_file)) as json_data:
        output_json = json.load(json_data)
        json_data.close()

    print(output_json)

    # Gets the most confident animal classification data
    classification = output_json["predictions"][0]["classifications"]["classes"][0] 

    # Gets the animal predicted from classification data
    animal_predicted = classification.split(";")[-1]
    print(animal_predicted)

    return animal_predicted
