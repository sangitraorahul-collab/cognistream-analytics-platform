from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import polars as pl

app = FastAPI(
    title="CogniStream API",
    description="Developer Activity Analytics API",
    version="1.0.0"
)

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5175"
],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Processed CSV location
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "data" / "processed" / "combined_activity.csv"


# Health Check API
@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "CogniStream API is running"
    }


# Get All Activities
@app.get("/api/activities")
def get_activities():
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Processed data file not found"
        )

    df = pl.read_csv(DATA_FILE)

    return {
        "total_events": df.height,
        "activities": df.to_dicts()
    }


# Get Source-wise Summary
@app.get("/api/summary")
def get_summary():
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Processed data file not found"
        )

    df = pl.read_csv(DATA_FILE)

    summary = (
        df.group_by("source")
        .agg(
            pl.len().alias("total_events")
        )
    )

    return {
        "total_events": df.height,
        "source_summary": summary.to_dicts()
    }

from backend.realtime.router import router as realtime_router

app.include_router(realtime_router)
# Testing CogniStream automatic file-save tracking