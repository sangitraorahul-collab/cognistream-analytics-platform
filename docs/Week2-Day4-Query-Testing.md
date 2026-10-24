\# Week 2 — Day 4: Time-Series Query Testing



\## 1. Objective



Test time-series retrieval and aggregation queries against the CogniStream ClickHouse event table and collect query execution statistics.



\## 2. Test Environment



\- Database: `cognistream`

\- Table: `events`

\- Engine: MergeTree

\- Sorting key: `(event\_timestamp, event\_id)`

\- Test dataset: 12 rows and 6 unique event IDs, based on the previous audit

\- Execution environment: ClickHouse running in Docker



\## 3. Queries Tested



\### Test 1: Timestamp-range retrieval



Retrieved `event\_timestamp`, `event\_id`, `event\_type`, and `source` for events between 2026-10-13 09:30:00 UTC and 2026-10-13 10:25:00 UTC.



\*\*Result:\*\* Query completed successfully. The recorded execution returned 12 rows.



\### Test 2: Hourly aggregation



Grouped events by hour using `toStartOfHour(event\_timestamp)`, calculating total rows and unique event IDs.



\*\*Purpose:\*\* Evaluate hourly event aggregation and identify differences between row counts and unique event counts.



\### Test 3: Source and event-type breakdown



Grouped events by `source` and `event\_type`, calculating total rows and unique event IDs for each group.



\*\*Purpose:\*\* Inspect event distribution and investigate repeated IDs.



\## 4. Query Performance Measurements



The ClickHouse `system.query\_log` recorded three executions of the timestamp-range query.



| Measurement | Execution 1 | Execution 2 | Execution 3 |

|---|---:|---:|---:|

| Duration | 6 ms | 4 ms | 7 ms |

| Rows read | 12 | 12 | 12 |

| Data read | 350 bytes | 350 bytes | 350 bytes |

| Result rows | 12 | 12 | 12 |

| Memory usage | 248,341 bytes | 248,341 bytes | 253,325 bytes |



\- Fastest observed execution: 4 ms

\- Slowest observed execution: 7 ms

\- Median observed execution: 6 ms



These are measurements from a very small dataset. They are useful as a functional baseline but cannot establish production-scale performance or a schema optimization improvement.



\## 5. Findings



1\. The timestamp-range query executed successfully.

2\. The query log captured execution duration, rows read, bytes read, result rows, and memory usage.

3\. All 12 table rows were read for the tested query.

4\. The table contains fewer unique event IDs than total rows, indicating repeated IDs that warrant investigation.

5\. The current dataset is too small to meaningfully evaluate large-scale query performance.



\## 6. Recommendations



1\. Retain the current sorting key until representative workload benchmarks show a need for change.

2\. Address duplicate ingestion before using event counts for reporting or analytics.

3\. Benchmark with a larger, representative dataset.

4\. Compare timestamp-only filtering with queries that filter by source or event type.

5\. Record execution times and rows read across repeated tests, and avoid drawing conclusions from a single run.

6\. Keep test data isolated from important datasets when evaluating schema changes.



\## 7. Conclusion



The initial time-series retrieval query completed successfully, and query execution statistics were collected from ClickHouse. The observed execution times were 4–7 ms for the 12-row dataset. Further testing with realistic data volumes is required to assess scalability.



\*\*Status:\*\* Initial query testing and performance logging completed. Large-scale benchmarking and duplicate-ingestion remediation remain pending.



