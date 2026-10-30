
import pandas as pd
import polars as pl
import pytest
from datetime import datetime, timedelta


# Test 1: Exactly 15 minutes should remain in the same session
def test_exactly_15_minute_gap():
    start = datetime(2026, 10, 27, 10, 0)

    df = pl.DataFrame({
        "user_id": [1, 1],
        "event_timestamp": [
            start,
            start + timedelta(minutes=15)
        ]
    })

    df = df.sort(["user_id", "event_timestamp"])
    df = df.with_columns(
        pl.col("event_timestamp").diff().over("user_id").alias("gap")
    )

    df = df.with_columns(
        (pl.col("gap").is_null() |
         (pl.col("gap") > pl.duration(minutes=15)))
        .cast(pl.Int64).alias("new_session")
    )

    df = df.with_columns(
        pl.col("new_session").cum_sum().over("user_id").alias("session_id")
    )

    assert df["session_id"].to_list() == [1, 1]


# Test 2: More than 15 minutes should start a new session
def test_gap_above_15_minutes():
    start = datetime(2026, 10, 27, 10, 0)

    df = pl.DataFrame({
        "user_id": [1, 1],
        "event_timestamp": [
            start,
            start + timedelta(minutes=16)
        ]
    })

    df = df.sort(["user_id", "event_timestamp"])
    df = df.with_columns(
        pl.col("event_timestamp").diff().over("user_id").alias("gap")
    )

    df = df.with_columns(
        (pl.col("gap").is_null() |
         (pl.col("gap") > pl.duration(minutes=15)))
        .cast(pl.Int64).alias("new_session")
    )

    df = df.with_columns(
        pl.col("new_session").cum_sum().over("user_id").alias("session_id")
    )

    assert df["session_id"].to_list() == [1, 2]


# Test 3: Missing timestamps should be detected
def test_missing_timestamp():
    values = pd.Series([
        "2026-10-27 10:00:00",
        None
    ])

    result = pd.to_datetime(values, errors="coerce")
    assert result.isna().sum() == 1


# Test 4: Invalid timestamps should be detected
def test_invalid_timestamp():
    values = pd.Series(["invalid-date"])

    result = pd.to_datetime(values, errors="coerce")
    assert result.isna().all()


# Test 5: Duplicate timestamps should be detected
def test_duplicate_timestamps():
    values = pd.Series([
        "2026-10-27 10:00:00",
        "2026-10-27 10:00:00"
    ])

    result = pd.to_datetime(values)
    assert result.duplicated().sum() == 1


# Test 6: Out-of-order timestamps should be sortable
def test_out_of_order_timestamps():
    values = pd.to_datetime(pd.Series([
        "2026-10-27 10:10:00",
        "2026-10-27 10:00:00"
    ]))

    sorted_values = values.sort_values()
    assert sorted_values.is_monotonic_increasing

# Test 7: Different users should have independent session IDs
def test_multiple_users():
    start = datetime(2026, 10, 27, 10, 0)

    df = pl.DataFrame({
        "user_id": [1, 1, 2, 2],
        "event_timestamp": [
            start,
            start + timedelta(minutes=5),
            start,
            start + timedelta(minutes=10)
        ]
    })

    df = df.sort(["user_id", "event_timestamp"])

    df = df.with_columns(
        pl.col("event_timestamp")
        .diff()
        .over("user_id")
        .alias("gap")
    )

    df = df.with_columns(
        (
            pl.col("gap").is_null()
            | (pl.col("gap") > pl.duration(minutes=15))
        ).cast(pl.Int64).alias("new_session")
    )

    df = df.with_columns(
        pl.col("new_session")
        .cum_sum()
        .over("user_id")
        .alias("session_id")
    )

    assert df["session_id"].to_list() == [1, 1, 1, 1]
    assert df["user_id"].to_list() == [1, 1, 2, 2]


# Test 8: 89 minutes should not qualify
def test_89_minute_flow():
    duration = timedelta(minutes=89)
    qualifies = duration >= timedelta(minutes=90)

    assert qualifies is False


# Test 9: Exactly 90 minutes should qualify
def test_exactly_90_minute_flow():
    duration = timedelta(minutes=90)
    qualifies = duration >= timedelta(minutes=90)

    assert qualifies is True


# Test 10: 91 minutes should qualify
def test_91_minute_flow():
    duration = timedelta(minutes=91)
    qualifies = duration >= timedelta(minutes=90)

    assert qualifies is True

