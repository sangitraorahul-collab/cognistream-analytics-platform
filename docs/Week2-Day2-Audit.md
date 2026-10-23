\# Week 2 — Day 2 Airflow and Workflow Audit



\## 1. Objective



Audit the existing CogniStream data workflow, validate input files, inspect ingestion behavior, and determine whether Airflow orchestration is configured.



\## 2. Environment



\- Project: CogniStream Analytics Platform

\- Operating system: Windows

\- Database: ClickHouse

\- Container: `cognistream-clickhouse`

\- Database table: `cognistream.events`



\## 3. Validation Results



\### JSON Validation



The following files passed JSON validation:



\- `github\_events.json`: 2 events

\- `ide\_events.json`: 2 events

\- `slack\_messages.json`: 2 events



\### Schema Validation



All three input files passed validation against `schemas/event\_schema.json`.



Total events validated: 6.



\### Data Quality



The data quality script reported 8 out of 8 checks passed, including checks for event IDs, user IDs, project names, event types, sources, and timestamps.



These checks were performed before the second ingestion run.



\## 4. Ingestion Audit



The script `scripts/ingest\_events.py` successfully reported insertion of six events into ClickHouse.



Before ingestion, the table contained 6 rows and 6 unique event IDs.



After ingestion, the table contained:



\- Total rows: 12

\- Unique event IDs: 6

\- Duplicate event IDs: 6

\- Occurrences per event ID: 2



Source breakdown:



| Source | Total rows | Unique IDs |

|---|---:|---:|

| GitHub | 4 | 2 |

| IDE | 4 | 2 |

| Slack | 4 | 2 |

| Total | 12 | 6 |



\### Finding



The ingestion script is not idempotent. Running it again inserted duplicate copies of the existing events.



\### Recommendation



Implement a safe deduplication strategy before inserting records. Test repeat-run behavior using a disposable test table or dataset. Do not assume that the MergeTree engine enforces uniqueness on `event\_id`.



\## 5. Airflow Audit



Repository inspection found no obvious Airflow DAG files, Airflow configuration, or Docker Compose configuration.



Airflow DAG parsing, scheduling, task execution, and task logs could not be verified because an Airflow setup has not been identified in the repository.



\## 6. Day 2 Status



\- JSON validation: Passed

\- Schema validation: Passed

\- Data quality checks: Passed (8/8)

\- Ingestion execution: Successful

\- Repeat-run safety: Failed; duplicate records identified

\- Airflow DAG execution: Not verified

\- Remediation: Pending



\## 7. Evidence Collected



\- Python JSON validation output

\- Python schema validation output

\- Data quality report

\- ClickHouse row and unique-ID counts

\- Duplicate event ID query results

\- Source-level row counts



\## 8. Conclusion



The existing data validation scripts pass on the provided input files. However, repeated ingestion creates duplicate records. Airflow orchestration remains unverified because no existing DAG or Airflow configuration was located. Further work should address ingestion idempotency and establish whether Airflow is required for the project deliverable.

