\# Week 2 — Day 6: CogniStream Validation Report



\## 1. Objective



Validate the CogniStream dashboard, inspect ClickHouse event data, execute analytical SQL queries, and review query execution plans.



\## 2. Environment



\- Project: CogniStream

\- Dashboard: React / Vite

\- Database: ClickHouse

\- Deployment environment: Docker

\- Database: `cognistream`

\- Table: `events`



\## 3. Database Validation



The ClickHouse container was confirmed running using `docker ps`.



The following checks were executed:



\- Database and table inspection

\- Table schema inspection

\- Total event count and unique event ID count

\- Event type aggregation

\- Earliest and latest event timestamp inspection



Actual query results should be recorded separately.



\## 4. Query Performance Inspection



An `EXPLAIN indexes = 1` query was executed to inspect the execution plan for a timestamp-ordered event query.



The execution plan should be reviewed to determine how ClickHouse uses its sorting and index structures.



No performance improvement is claimed without measured evidence.



\## 5. Dashboard Validation



Record the production build result and verify the dashboard's charts, KPI cards, search, filters, and event table.



The dashboard uses static sample data unless a live database connection has been implemented and verified.



\## 6. Findings and Limitations



\- Record any repeated event IDs identified by the SQL checks.

\- Distinguish repeated IDs from genuinely duplicated records.

\- Record any schema, timestamp, or query execution issues.

\- Document any outstanding dashboard-to-database integration work.



\## 7. Conclusion



The Day 6 validation commands were executed against the ClickHouse environment. Final findings and numerical results should be added from the actual outputs before presenting the validation as fully verified.

