import json
from pathlib import Path
from jsonschema import Draft202012Validator

BASE_DIR = Path(__file__).resolve().parent.parent

SCHEMA_FILE = BASE_DIR / "schemas" / "event_schema.json"

DATA_FILES = [
    "github_events.json",
    "ide_events.json",
    "slack_messages.json",
]


def main():
    with open(SCHEMA_FILE, "r", encoding="utf-8") as file:
        schema = json.load(file)

    Draft202012Validator.check_schema(schema)
    validator = Draft202012Validator(schema)

    for filename in DATA_FILES:
        file_path = BASE_DIR / filename

        print(f"\nChecking {filename}...")

        with open(file_path, "r", encoding="utf-8") as file:
            events = json.load(file)

        if not isinstance(events, list):
            print("VALIDATION FAILED: Expected a list of events.")
            continue

        errors = []

        for index, event in enumerate(events, start=1):
            if not isinstance(event, dict):
                errors.append(f"Event {index}: Expected a JSON object.")
                continue

            for error in validator.iter_errors(event):
                errors.append(f"Event {index}: {error.message}")

        if errors:
            print("VALIDATION FAILED")
            for error in errors:
                print(f" - {error}")
        else:
            print("VALIDATION PASSED")
            print(f"Events validated: {len(events)}")


if __name__ == "__main__":
    main()