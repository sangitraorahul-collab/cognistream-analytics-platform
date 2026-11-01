# CogniStream Analytics Platform
## Day 4 – SQL Analytics Testing Report

### Objective
Execute and validate the SQL analytics queries against the ClickHouse `cognistream.events` table.

### Queries covered

1. **Total number of events** – Counts all records in the events table.
2. **Events by source** – Groups records by GitHub, IDE, and Slack.
3. **Events by event type** – Counts each type of developer activity.
4. **Most active users** – Lists users ordered by event count.
5. **Duplicate event IDs** – Checks for event IDs appearing more than once.
6. **Daily event activity** – Groups events by calendar date.

### Dataset
The existing sample dataset contains six events:
- GitHub: 2
- IDE: 2
- Slack: 2
- Total: 6

### Daily activity query – Verified result

| Event date | Total events |
|---|---:|
| 2026-10-13 | 6 |

The daily activity query executed successfully and returned one row.

### Expected validation results

| Check | Expected result |
|---|---|
| Total events | 6 |
| Events by source | 2 GitHub, 2 IDE, 2 Slack |
| Events by event type | 2 messages; 1 each for file_edit, file_save, pull_request, push |
| Most active users | dev_101: 3, dev_102: 3 |
| Duplicate event IDs | 0 duplicate rows |
| Daily activity | 6 events on 2026-10-13 |

### Notes
The expected results above are based on the existing six-event sample dataset. The daily activity result was directly verified during Day 4 testing.

### Conclusion
The Day 4 SQL analytics queries are documented. The daily activity query was successfully executed against ClickHouse. The remaining query outputs should be retained as execution evidence if required by the project reviewer.
