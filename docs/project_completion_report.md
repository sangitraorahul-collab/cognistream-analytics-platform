\# CogniStream Analytics Platform

\## Project Completion Report — Days 1–6



\### Project Overview

CogniStream is a developer activity analytics project that collects sample events from GitHub, IDE, and Slack sources, validates the data, stores events in ClickHouse, and supports analysis using SQL.



\### Technology Stack

\- Python

\- JSON and JSON Schema

\- ClickHouse

\- Docker Desktop

\- SQL

\- Git and GitHub



\### Work Completed



\*\*Day 1 — Sample Data Preparation\*\*

\- Prepared sample GitHub, IDE, and Slack event files.

\- Used a consistent event structure across sources.



\*\*Day 2 — Schema and Validation\*\*

\- Created a JSON Schema for event validation.

\- Implemented JSON structure and schema validation scripts.



\*\*Day 3 — Database and Ingestion\*\*

\- Set up ClickHouse in Docker.

\- Created the events table.

\- Implemented a Python ingestion pipeline.

\- Successfully loaded six sample events.



\*\*Day 4 — SQL Analytics\*\*

\- Created SQL queries for event totals, source counts, event types, active users, duplicate IDs, and daily activity.

\- Verified source counts and daily event totals.



\*\*Day 5 — Automated Data Quality\*\*

\- Created `scripts/check\_data\_quality.py`.

\- Checked duplicate IDs, missing values, empty data, and default timestamps.

\- Achieved 8/8 passing checks on the current six-event dataset.



\*\*Day 6 — Final Review\*\*

\- Reviewed Python scripts, database validation, project documentation, and Git history.

\- Confirmed the Day 5 commit was synchronized with GitHub.



\### Current Data Quality Results

\- Total events: 6

\- Unique event IDs: 6

\- Duplicate event IDs: 0

\- Missing values in checked fields: 0

\- Automated checks passed: 8/8



\### Key Project Files

\- `scripts/ingest\_events.py`

\- `scripts/validate\_json.py`

\- `scripts/validate\_schema.py`

\- `scripts/check\_data\_quality.py`

\- `schemas/event\_schema.json`

\- `sql/analytics\_queries.sql`

\- `docs/database\_schema.md`

\- `docs/day3\_clickhouse\_setup.md`

\- `docs/day5\_data\_quality.md`



\### Limitations and Future Improvements

\- The current dataset contains six sample events.

\- Automated checks should be rerun whenever new events are ingested.

\- Additional improvements could include scheduled ingestion, automated test execution, larger datasets, dashboards, and monitoring.



\### Conclusion

The project demonstrates a basic end-to-end analytics workflow, from sample event preparation and validation to ClickHouse ingestion, SQL analysis, and automated data quality checks.

