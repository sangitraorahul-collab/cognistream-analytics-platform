# Day 3: ClickHouse Setup and Ingestion

## Objective
Configure ClickHouse using Docker and ingest sample developer activity events for the CogniStream Analytics Platform.

## Technologies
- Docker Desktop
- ClickHouse
- Python
- JSON
- SQL
- Git

## Database Configuration
- Container: `cognistream-clickhouse`
- Database: `cognistream`
- Table: `events`
- HTTP port: `8123`
- Native client port: `9000`
- Storage engine: `MergeTree`

## Source Data
The ingestion script reads three JSON files:
- `github_events.json`
- `ide_events.json`
- `slack_messages.json`

## Ingestion Process
The Python script `scripts/ingest_events.py` reads the JSON records, prepares the event fields, serializes metadata, and inserts events into ClickHouse.

Run from the project root:

`python scripts/ingest_events.py`

## Expected Validation Results
The original sample dataset contains six events:
- GitHub: 2 events
- IDE: 2 events
- Slack: 2 events

The database should be checked for duplicate event IDs and missing required fields before the ingestion task is considered fully validated.

## Outcome
Docker and ClickHouse have been installed, and source-wise database queries have returned two GitHub events, two IDE events, and two Slack events. Final data-quality checks should be recorded after execution.