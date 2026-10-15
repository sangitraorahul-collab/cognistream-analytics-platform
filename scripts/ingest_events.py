
import json
import sys
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# --------------------------------------------------
# CogniStream - ClickHouse Configuration
# --------------------------------------------------

CLICKHOUSE_URL = "http://localhost:8123/"
CLICKHOUSE_USER = "admin"
CLICKHOUSE_PASSWORD = "CogniStream@2026"
DATABASE = "cognistream"
TABLE = "events"

# Find the project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Input JSON files and their corresponding source labels
EVENT_FILES = {
    "github": PROJECT_ROOT / "github_events.json",
    "ide": PROJECT_ROOT / "ide_events.json",
    "slack": PROJECT_ROOT / "slack_messages.json",
}


# --------------------------------------------------
# Read and Prepare Events
# --------------------------------------------------

def load_events(file_path, source):
    """Read a JSON file and prepare its events for ClickHouse."""

    if not file_path.exists():
        raise FileNotFoundError(f"Input file not found: {file_path}")

    with file_path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError(
            f"{file_path.name} must contain a JSON array of events."
        )

    rows = []

    for event in data:
        required_fields = [
            "event_id",
            "user_id",
            "project_name",
            "event_type",
            "event_timestamp",
        ]

        missing_fields = [
            field for field in required_fields if field not in event
        ]

        if missing_fields:
            raise ValueError(
                f"Event in {file_path.name} is missing fields: "
                f"{', '.join(missing_fields)}"
            )

        # ClickHouse DateTime64 accepts timestamps with ISO format.
        # Convert ISO UTC suffix Z to +00:00 for consistent parsing.
        timestamp = str(event["event_timestamp"])

        if timestamp.endswith("Z"):
            timestamp = timestamp[:-1] + "+00:00"

        row = {
            "event_id": str(event["event_id"]),
            "user_id": str(event["user_id"]),
            "project_name": str(event["project_name"]),
            "event_type": str(event["event_type"]),
            "event_timestamp": timestamp,
            "source": source,
            "metadata": json.dumps(
                event.get("metadata", {}),
                ensure_ascii=False
            ),
        }

        rows.append(row)

    return rows


# --------------------------------------------------
# Insert Events into ClickHouse
# --------------------------------------------------

def insert_events(rows):
    """Insert prepared event records using ClickHouse HTTP."""

    if not rows:
        print("No events to insert.")
        return

    query = (
        f"INSERT INTO {DATABASE}.{TABLE} "
        "(event_id, user_id, project_name, event_type, "
        "event_timestamp, source, metadata) "
        "FORMAT JSONEachRow"
    )

    # ClickHouse JSONEachRow requires one JSON object per line.
    payload = "\n".join(
        json.dumps(row, ensure_ascii=False) for row in rows
    ) + "\n"

    url = CLICKHOUSE_URL + "?" + urlencode({"query": query})

    request = Request(
        url,
        data=payload.encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-ClickHouse-User": CLICKHOUSE_USER,
            "X-ClickHouse-Key": CLICKHOUSE_PASSWORD,
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=30) as response:
            response_body = response.read().decode("utf-8").strip()

            if response.status not in (200, 201):
                raise RuntimeError(
                    f"ClickHouse returned HTTP {response.status}: "
                    f"{response_body}"
                )

            print(f"Successfully inserted {len(rows)} events.")

            if response_body:
                print(response_body)

    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        print(f"ClickHouse HTTP error ({error.code}):")
        print(details)
        sys.exit(1)

    except URLError as error:
        print("Could not connect to ClickHouse.")
        print(f"Details: {error.reason}")
        print("Check that the cognistream-clickhouse container is running.")
        sys.exit(1)

    except TimeoutError:
        print("ClickHouse request timed out.")
        sys.exit(1)


# --------------------------------------------------
# Main Pipeline
# --------------------------------------------------

def main():
    print("=" * 55)
    print("CogniStream Event Ingestion Pipeline")
    print("=" * 55)

    all_events = []

    try:
        for source, file_path in EVENT_FILES.items():
            events = load_events(file_path, source)
            all_events.extend(events)

            print(
                f"Loaded {len(events)} events from "
                f"{file_path.name} (source={source})"
            )

        print(f"\nTotal events prepared: {len(all_events)}")
        print("Connecting to ClickHouse...")

        insert_events(all_events)

        print("\nIngestion process completed.")

    except (FileNotFoundError, json.JSONDecodeError, ValueError) as error:
        print(f"\nData preparation error: {error}")
        sys.exit(1)


if __name__ == "__main__":
    main()
