# Week 3 -- Day 1: Integration, Testing & Validation Checklist

**Project:** CogniStream -- Developer Flow-State / Cognitive Load
Analytics\
**Workstream:** Integration, Testing & Validation\
**Status:** Preparation in progress\
**Note:** This document records planned validation activities. Do not
mark tests as passed until they have been executed against the actual
project code and data.

## 1. Objective

Prepare a repeatable validation approach for: - IDE coding-session
identification. - Slack message matching and interruption analysis. -
Flow-state qualification using the agreed 90-minute rule. - Data quality
and timestamp handling. - Compatibility between validated outputs and
the dashboard.

## 2. Existing team files identified

The following files were visible in the team repository: -
`session_identification.py` --- identifies coding sessions using a
15-minute inactivity threshold. - `slack_interruption_analysis.py` ---
expected to contain Slack interruption analysis; implementation still
needs review. - `timestamp_validation.py` --- expected to contain
timestamp validation; implementation still needs review. -
`Data_Inspection.py` --- inspect this script to determine which
data-quality checks are implemented. - `Data_Inspection.md` ---
currently empty in the repository screenshot, so no findings can be
taken from that Markdown file yet. - `ide_clean.csv`, `slack_clean.csv`,
`github_clean.csv` --- processed datasets to inspect as needed.

## 3. Initial understanding of session identification

The shared `session_identification.py` sample: 1. Creates synthetic IDE
activity for one user. 2. Sorts events by user and timestamp. 3.
Calculates the time gap between consecutive events. 4. Starts a new
session when the gap is greater than 15 minutes. 5. Groups events into
sessions and calculates session start, last activity, event count, and
observed span.

For the six sample timestamps provided, the expected sessions are:

  Session   Start   Last activity     Events   Observed span
  --------- ------- --------------- -------- ---------------
  1         10:00   10:12                  3      12 minutes
  2         10:50   10:55                  2       5 minutes
  3         11:30   11:30                  1       0 minutes

These are expected results derived from the supplied synthetic sample,
not a claim that the full dataset has been tested.

## 4. Validation checklist

### Session identification

-   [ ] Verify that events are sorted chronologically per user.
-   [ ] Verify that a gap below 15 minutes stays in the same session.
-   [ ] Verify that a gap of exactly 15 minutes follows the agreed
    boundary rule. Current sample code uses `> 15 minutes`, so exactly
    15 minutes stays in the same session.
-   [ ] Verify that a gap above 15 minutes starts a new session.
-   [ ] Verify that sessions for different users are kept separate.
-   [ ] Verify behavior for one-event sessions and empty inputs.
-   [ ] Compare actual session summaries with independently calculated
    expected results.

### Flow-state qualification

-   [ ] Confirm the team's precise definition of a flow state.
-   [ ] Test session spans below 90 minutes, exactly 90 minutes, and
    above 90 minutes.
-   [ ] Confirm whether qualification is based on observed session span
    or another measure.
-   [ ] Do not treat the 15-minute inactivity threshold as equivalent to
    the 90-minute flow-state threshold.

### Slack interruption analysis

-   [ ] Review how Slack messages are matched to coding sessions.
-   [ ] Confirm timestamp formats and timezone assumptions.
-   [ ] Test messages before, during, and after a session.
-   [ ] Confirm how duplicate Slack events are handled.
-   [ ] Confirm whether every Slack message counts as an interruption or
    only messages meeting the agreed criteria.

### Data quality

-   [ ] Inspect the column names and data types in the processed IDE and
    Slack datasets.
-   [ ] Check for missing timestamps and user identifiers.
-   [ ] Check for duplicate records.
-   [ ] Check for invalid or out-of-order timestamps.
-   [ ] Record any dataset assumptions and issues found.

### Dashboard integration

-   [ ] Ask the frontend/dashboard teammate for the required input
    schema.
-   [ ] Confirm required field names, types, and output format (for
    example, CSV or JSON).
-   [ ] Verify that dashboard metrics match the validated output.
-   [ ] Test empty results and missing values safely.
-   [ ] Record integration issues and their resolution.

## 5. Dependencies and questions for teammates

### Questions for the data-engineering teammate

-   Please share the processed dataset column names and a small, safe
    sample of the data.
-   Please share the actual output of the session-identification script.
-   Is the 15-minute inactivity threshold the agreed session boundary
    rule?
-   How exactly should the 90-minute flow-state threshold be applied?
-   What is the agreed definition of a Slack interruption?

### Questions for the dashboard teammate

-   Which fields does the dashboard require?
-   What input format should be supplied?
-   Which context-switching metrics are displayed, and how are they
    defined?

## 6. Planned deliverables

-   [ ] Validation test cases for session boundaries.
-   [ ] Validation test cases for Slack matching and interruption
    metrics.
-   [ ] Test results based on actual project data.
-   [ ] Bug/issue log with reproduction details.
-   [ ] Dashboard integration verification notes.
-   [ ] Final validation summary with actual pass/fail counts.

## 7. Current status

**Completed:** Reviewed the shared sample session-identification code
and derived expected session boundaries for its synthetic timestamps.

**Pending:** Inspect the repository scripts and processed datasets,
confirm team definitions, execute tests, and verify dashboard
integration.

No test-pass counts or full-dataset validation results are claimed in
this document until the checks have been run.
