import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DATABASE_DIR = BASE_DIR / "data" / "realtime"
DATABASE_FILE = DATABASE_DIR / "activity_events.sqlite3"


def get_connection():
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_FILE)
    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS activity_events (
                event_id TEXT PRIMARY KEY,
                source TEXT NOT NULL,
                tool TEXT NOT NULL,
                event_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                file_extension TEXT,
                workspace_name TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_event(event):
    with get_connection() as connection:
        connection.execute("""
            INSERT INTO activity_events (
                event_id,
                source,
                tool,
                event_type,
                timestamp,
                file_extension,
                workspace_name
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            event["event_id"],
            event["source"],
            event["tool"],
            event["event_type"],
            event["timestamp"],
            event.get("file_extension"),
            event.get("workspace_name")
        ))


def get_recent_events(limit=100):
    with get_connection() as connection:
        rows = connection.execute("""
            SELECT *
            FROM activity_events
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,)).fetchall()

        return [dict(row) for row in rows]
