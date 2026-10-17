
import json
import urllib.request
import urllib.error

CLICKHOUSE_URL = "http://localhost:8123/"
CLICKHOUSE_USER = "admin"
CLICKHOUSE_PASSWORD = "CogniStream@2026"

QUERY = """
SELECT
    count() AS total_rows,
    uniqExact(event_id) AS unique_event_ids,
    countIf(event_id = '') AS missing_event_ids,
    countIf(user_id = '') AS missing_user_ids,
    countIf(project_name = '') AS missing_project_names,
    countIf(event_type = '') AS missing_event_types,
    countIf(source = '') AS missing_sources,
    countIf(event_timestamp = toDateTime64(0, 3, 'UTC')) AS default_timestamps
FROM cognistream.events
FORMAT JSONEachRow
"""

def run_query(query):
    request = urllib.request.Request(
        CLICKHOUSE_URL,
        data=query.encode("utf-8"),
        headers={
            "X-ClickHouse-User": CLICKHOUSE_USER,
            "X-ClickHouse-Key": CLICKHOUSE_PASSWORD,
            "Content-Type": "text/plain"
        },
        method="POST"
    )

    with urllib.request.urlopen(request, timeout=10) as response:
        result = response.read().decode("utf-8").strip()

    return json.loads(result) if result else {}

def main():
    print("CogniStream Data Quality Report")
    print("-" * 35)

    try:
        data = run_query(QUERY)
    except (urllib.error.URLError, TimeoutError) as error:
        print(f"FAILED: Could not connect to ClickHouse: {error}")
        return

    total = int(data["total_rows"])
    unique_ids = int(data["unique_event_ids"])

    checks = {
        "At least one event exists": total > 0,
        "No duplicate event IDs": total == unique_ids,
        "No missing event IDs": int(data["missing_event_ids"]) == 0,
        "No missing user IDs": int(data["missing_user_ids"]) == 0,
        "No missing project names": int(data["missing_project_names"]) == 0,
        "No missing event types": int(data["missing_event_types"]) == 0,
        "No missing sources": int(data["missing_sources"]) == 0,
        "No default timestamps": int(data["default_timestamps"]) == 0,
    }

    print(f"Total events: {total}")
    print(f"Unique event IDs: {unique_ids}")
    print()

    for name, passed in checks.items():
        print(f"[{'PASS' if passed else 'FAIL'}] {name}")

    failed = sum(not passed for passed in checks.values())
    print()
    print(f"Summary: {len(checks) - failed}/{len(checks)} checks passed")

    if failed:
        raise SystemExit(1)

    print("Data quality validation completed successfully.")

if __name__ == "__main__":
    main()
