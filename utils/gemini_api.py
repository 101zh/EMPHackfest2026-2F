from flask import json
from google import genai
import dotenv
import os
import time

JSON_KEYS = [
    "endangered_status",
    "is_invasive",
    "population_count",
    "native_region",
    "fun_facts",
]

MAX_ATTEMPTS = 3


def get_species_information(species, location):
    dotenv.load_dotenv()
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = f"""
        Briefly tell me about this animal {species} found in {location} in a json format: {{{", ".join(list(f'''"{key}"''' for key in JSON_KEYS))}}}.
        Use ASCII characters and format as strings without new lines or indentation.
        Make "endangered_status" the string "None" if the species is not listed.
        Make "is_invasive" a boolean, and true if the species is classified as invasive and is in a location where it's not native.
    """

    for i in range(MAX_ATTEMPTS):
        try:
            response = client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=prompt,
            )

            response_dict = json.loads(response.text)

            for key in JSON_KEYS:
                if response_dict.get(key) == None:
                    raise ValueError(f'"{key}" does not exist in response')

            return response_dict
        except Exception as e:
            print(e)
            time.sleep(2)
            continue

    print(f"Failed attempts exceeded maximum of {MAX_ATTEMPTS}")
    return None