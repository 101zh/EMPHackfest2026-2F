import subprocess
from pathlib import Path
import sys

# Paths for images and classifier output
image_folder = Path(r"..\speciesnet-input")
output_file = Path(r".\\output.json")

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
]

print("Running classifier...")
subprocess.run(command, input="y\n", text=True)
print("Classifier finished!")


