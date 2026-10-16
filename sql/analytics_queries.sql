
-- CogniStream Analytics Platform
-- Day 4: SQL Analytics Queries

-- 1. Total number of events
SELECT count() AS total_events
FROM cognistream.events;

-- 2. Events by source
SELECT
    source,
    count() AS total_events
FROM cognistream.events
GROUP BY source
ORDER BY source;

-- 3. Events by event type
SELECT
    event_type,
    count() AS total_events
FROM cognistream.events
GROUP BY event_type
ORDER BY total_events DESC;

-- 4. Most active users
SELECT
    user_id,
    count() AS total_events
FROM cognistream.events
GROUP BY user_id
ORDER BY total_events DESC
LIMIT 10;

-- 5. Check for duplicate event IDs
SELECT
    event_id,
    count() AS occurrences
FROM cognistream.events
GROUP BY event_id
HAVING count() > 1;

-- 6. Daily event activity
SELECT
    toDate(event_timestamp) AS event_date,
    count() AS total_events
FROM cognistream.events
GROUP BY event_date
ORDER BY event_date;
