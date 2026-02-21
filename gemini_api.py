from google import genai
import dotenv
import os


def get_species_information(species):
    dotenv.load_dotenv()

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="""Briefly tell me about this animal: """ + species + """ in a json format: {"endangered_status", "is_invasive", "population_count", "native_region", "fun_facts"}. Stick to ASCII characters and format as strings without new lines or indentation.""",
    )

    return response.text