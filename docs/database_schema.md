\# CogniStream Analytics Platform — Database Schema



\## 1. Objective



Design a common event schema for GitHub, Slack, and IDE activity data so events can be stored, queried, and analyzed consistently in ClickHouse.



\## 2. Common Event Table



| Column | ClickHouse Type | Description |

|---|---|---|

| event\_id | String | Event identifier |

| user\_id | String | User associated with the event |

| project\_name | String | Project associated with the event |

| event\_type | String | Activity category |

| event\_timestamp | DateTime64(3, 'UTC') | Event timestamp in UTC |

| source | LowCardinality(String) | Originating platform |

| metadata | String | JSON-encoded event-specific details |



\## 3. Data Sources



\- GitHub: repository and code activity events

\- Slack: collaboration and messaging events

\- IDE: development environment activity events



\## 4. Data Type Decisions



\- String: identifiers and descriptive values.

\- DateTime64(3, 'UTC'): timestamps with millisecond precision.

\- LowCardinality(String): repeated source labels.

\- String for metadata: flexible storage of JSON-encoded source details.



\## 5. Data Quality Rules



1\. Every event must contain event\_id, user\_id, project\_name, event\_type, event\_timestamp, and metadata.

2\. event\_id must be a non-empty string.

3\. event\_timestamp must be a valid timestamp that can be normalized to UTC.

4\. source must be one of github, slack, or ide.

5\. metadata must contain a JSON object.

6\. Duplicate event IDs must be detected and reviewed during ingestion.



\## 6. Day 3 Implementation



Create the ClickHouse database and event table using this design. Validate the final column definitions against the actual sample JSON files before loading data.

