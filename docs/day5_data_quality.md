\# CogniStream Analytics Platform

\## Day 5: Automated Data Quality Validation



\### Objective

To automate data quality checks for developer activity events stored in ClickHouse.



\### Tools Used

\- Python

\- ClickHouse

\- Docker

\- SQL

\- Git



\### Validation Checks

The Python script `scripts/check\_data\_quality.py` performs the following checks:



1\. Confirms that the database contains events.

2\. Checks for duplicate event IDs.

3\. Checks for missing event IDs.

4\. Checks for missing user IDs.

5\. Checks for missing project names.

6\. Checks for missing event types.

7\. Checks for missing source values.

8\. Checks for default timestamps.



\### Test Results



| Metric | Result |

|---|---:|

| Total events | 6 |

| Unique event IDs | 6 |

| Duplicate event IDs | 0 |

| Missing event IDs | 0 |

| Missing user IDs | 0 |

| Missing project names | 0 |

| Missing event types | 0 |

| Missing sources | 0 |

| Default timestamps | 0 |



\### Outcome

All 8 automated data quality checks passed successfully. The current dataset contains six events with unique event IDs and no missing values in the checked fields.



\### Files Created

\- `scripts/check\_data\_quality.py`

\- `docs/day5\_data\_quality.md`



\### Conclusion

Automated validation helps identify data quality issues before further analysis. The script can be rerun whenever new events are loaded into ClickHouse.

