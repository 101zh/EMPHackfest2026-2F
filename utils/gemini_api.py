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
    "report_link",
]

MAX_ATTEMPTS = 3


def get_species_information(species, country, state):
    dotenv.load_dotenv()
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    countryText = ("found in (as ISO 3166-1 Alpha-3) " + country + " ") if country != "" else ""
    stateText = ("in the state (as ISO 3166-2) " + state + " ") if state != "" else ""

    prompt = f"""
        Briefly tell me about this animal {species} {countryText + stateText}in a json format: {{{", ".join(list(f'''"{key}"''' for key in JSON_KEYS))}}}.
        Use ASCII characters and format as strings without new lines or indentation.
        Make "endangered_status" the string "None" if the species is not listed.
        Make "is_invasive" a boolean, and true if the species is classified as invasive and is in a location where it's not native.
        Write "fun_facts" in complete sentences{", and try to make it specific to the given location" if countryText != "" else ""}.
        Make "report_link" a url to a reporting service (e.g. https://invasivespecies.wa.gov/report-a-sighting/ for invasive species found in Washington) if the animal should reported when spotted at the given location, either because it is endangered or invasive. Leave blank if reporting is unecessary or unadvised.
    """

    print(prompt)

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