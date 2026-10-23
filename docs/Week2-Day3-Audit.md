\# Week 2 — Day 3: ClickHouse Schema Optimization Audit



\## 1. Objective



Inspect the existing ClickHouse `cognistream.events` table, evaluate its schema for time-series analytics, and identify optimization opportunities without modifying production data.



\## 2. Environment and Inspection



\- Database: `cognistream`

\- Table: `events`

\- Storage engine: `MergeTree`

\- Index granularity: 8192

\- Inspection method: ClickHouse SQL queries executed through Docker

\- Scope: Read-only schema and data inspection



\## 3. Existing Schema



| Column | Data Type |

|---|---|

| event\_id | String |

| user\_id | String |

| project\_name | String |

| event\_type | String |

| event\_timestamp | DateTime64(3, 'UTC') |

| source | LowCardinality(String) |

| metadata | String |



\*\*Sorting key:\*\* `(event\_timestamp, event\_id)`



\*\*Primary key:\*\* `event\_timestamp, event\_id`



\*\*Partition key:\*\* None configured



\## 4. Data Inspection Results



\- Total rows: 12

\- Unique event IDs: 6

\- Earliest event timestamp: 2026-10-13 09:30:00 UTC

\- Latest event timestamp: 2026-10-13 10:25:00 UTC



The difference between total rows and unique event IDs indicates repeated IDs in the current dataset. Earlier ingestion testing showed that rerunning the ingestion script inserted the same six event IDs again.



\## 5. Findings



\### Positive observations



1\. The MergeTree engine is suitable for analytical event workloads.

2\. DateTime64 with millisecond precision and UTC timezone is appropriate for timestamped events.

3\. The current sorting key supports efficient filtering over timestamp ranges.

4\. LowCardinality(String) is appropriate for a source column with a limited set of repeated values.



\### Issues and limitations



1\. The ingestion process is not idempotent; repeated execution can insert duplicate event records.

2\. The table has no partitioning configured. This is acceptable for the current small dataset, but future requirements should be assessed as data volume grows.

3\. Performance has not yet been benchmarked using representative data volumes or query workloads.

4\. The sorting key does not enforce event ID uniqueness.



\## 6. Recommendations



1\. Improve ingestion so repeated runs do not unintentionally duplicate existing events.

2\. Keep the existing sorting key until representative queries demonstrate a need for change.

3\. Benchmark timestamp-range queries and queries filtering by source or event type.

4\. Evaluate monthly partitioning only when data volume, retention, and query patterns justify it.

5\. Preserve the current data and test schema changes on a separate test table before considering deployment.



\## 7. Conclusion



The current ClickHouse schema is a reasonable starting point for time-series event analytics. The primary issue identified is duplicate ingestion rather than a demonstrated schema-performance problem. Further optimization should be guided by query benchmarks and expected data growth.



\*\*Status:\*\* Schema inspection completed. Performance benchmarking and ingestion idempotency improvements remain pending.



