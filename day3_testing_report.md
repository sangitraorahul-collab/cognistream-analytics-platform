# Day 3 Testing Report – ClickHouse Setup and Ingestion

## 1. Objective
Configure ClickHouse using Docker and validate ingestion of developer activity events from GitHub, IDE, and Slack JSON files.

## 2. Environment
- Database: cognistream
- Table: events
- Container: cognistream-clickhouse
- Database engine: ClickHouse
- Storage engine: MergeTree (as specified in the assignment)
- HTTP port: 8123
- Native client port: 9000

## 3. Table Schema Validation

The active events table contains seven columns:

| Column | Data Type |
|---|---|
| event_id | String |
| user_id | String |
| project_name | String |
| event_type | String |
| event_timestamp | DateTime64(3, 'UTC') |
| source | LowCardinality(String) |
| metadata | String |

Result: PASS

## 4. Event Count Validation

Total records: 6

| Source | Expected | Actual | Result |
|---|---:|---:|---|
| GitHub | 2 | 2 | PASS |
| IDE | 2 | 2 | PASS |
| Slack | 2 | 2 | PASS |

## 5. Data Quality Validation

| Validation | Actual Result | Status |
|---|---:|---|
| Missing required fields (empty strings) | 0 | PASS |
| Zero timestamps | 0 | PASS |
| Duplicate event IDs | 0 | PASS |

## 6. Timestamp Inspection

- Earliest event: 2026-10-13 09:30:00 UTC
- Latest event: 2026-10-13 10:25:00 UTC
- Timestamp column uses DateTime64(3, 'UTC').

The zero-timestamp check passed. This check does not cover every possible timestamp-format or timezone issue.

## 7. Event Inspection

Six records were inspected in chronological order:
- gh_001 – GitHub push
- sl_001 – Slack message
- ide_001 – IDE file_save
- gh_002 – GitHub pull_request
- sl_002 – Slack message
- ide_002 – IDE file_edit

## 8. Limitations and Notes

- The active events table passed the duplicate-ID check.
- The ingestion script can insert duplicate records if executed repeatedly.
- The ingestion process should be made idempotent before repeated production use.
- The events_before_cleanup table was not included in the active-table validation.

## 9. Final Outcome

Day 3 ClickHouse setup and ingestion validation completed successfully against the expected six-event sample dataset.

The database connection, table schema, source-wise counts, required-field checks, zero-timestamp check, and duplicate event-ID check all passed.
