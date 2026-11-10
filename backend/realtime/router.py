from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from .storage import (
    initialize_database,
    save_event,
    get_recent_events
)

router = APIRouter()

# Initialize the SQLite database
initialize_database()


class IDEActivity(BaseModel):
    source: Literal["IDE"]
    tool: Literal["VS Code"]
    event_type: Literal["file_opened", "file_saved"]
    timestamp: datetime
    file_extension: str = Field(default="", max_length=20)
    workspace_name: str = Field(default="Unknown", max_length=255)


@router.post("/api/events")
def receive_event(event: IDEActivity):
    if event.timestamp.tzinfo is None:
        raise HTTPException(
            status_code=400,
            detail="Timestamp must include timezone information"
        )

    utc_timestamp = (
        event.timestamp
        .astimezone(timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )

    activity = {
        "event_id": str(uuid4()),
        "source": event.source,
        "tool": event.tool,
        "event_type": event.event_type,
        "timestamp": utc_timestamp,
        "file_extension": event.file_extension,
        "workspace_name": event.workspace_name
    }

    try:
        save_event(activity)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Could not save activity event"
        ) from error

    return {
        "status": "success",
        "message": "Activity event saved",
        "event": activity
    }


@router.get("/api/realtime/activities")
def get_realtime_activities(
    limit: int = Query(default=100, ge=1, le=500)
):
    try:
        activities = get_recent_events(limit)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve activity events"
        ) from error

    return {
        "total_events": len(activities),
        "activities": activities
    }
