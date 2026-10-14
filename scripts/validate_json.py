import json
from pathlib import Path

# Project directory
BASE_DIR = Path(__file__).resolve().parent.parent

# JSON files to validate
FILES = [
    "github_events.json",
    "ide_events.json",
    "slack_messages.json",
]

# Required event fields
REQUIRED_FIELDS = {
    "event_id",
    "user_id",
    "project_name",
    "event_type",
    "event_timestamp",
    "metadata",
}


def validate_file(filename):
    file_path = BASE_DIR / filename

    print(f"\nChecking: {filename}")

    if not file_path.exists():
        print("ERROR: File not found.")
        return

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, list):
            print("ERROR: Expected a JSON list of events.")
            return

        if not data:
            print("WARNING: File contains no events.")
            return

        errors = []

        for index, event in enumerate(data, start=1):
            if not isinstance(event, dict):
                errors.append(f"Event {index} is not a JSON object.")
                continue

            missing_fields = REQUIRED_FIELDS - event.keys()

            if missing_fields:
                errors.append(
                    f"Event {index} is missing: "
                    f"{', '.join(sorted(missing_fields))}"
                )

        if errors:
            print("VALIDATION FAILED:")
            for error in errors:
                print(f" - {error}")
        else:
            print("VALIDATION PASSED")
            print(f"Events found: {len(data)}")

    except json.JSONDecodeError as error:
        print(f"INVALID JSON: {error}")

    except OSError as error:
        print(f"FILE ERROR: {error}")


if __name__ == "__main__":
    for filename in FILES:
        validate_file(filename)