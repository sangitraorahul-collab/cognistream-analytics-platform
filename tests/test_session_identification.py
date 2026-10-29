from datetime import datetime, timedelta


def starts_new_session(previous, current):
    if previous is None:
        return True

    return current - previous > timedelta(minutes=15)


def test_first_event_starts_session():
    assert starts_new_session(
        None, datetime(2026, 10, 27, 10, 0)
    )


def test_gap_below_15_minutes():
    assert not starts_new_session(
        datetime(2026, 10, 27, 10, 0),
        datetime(2026, 10, 27, 10, 10),
    )


def test_gap_exactly_15_minutes():
    assert not starts_new_session(
        datetime(2026, 10, 27, 10, 0),
        datetime(2026, 10, 27, 10, 15),
    )


def test_gap_above_15_minutes():
    assert starts_new_session(
        datetime(2026, 10, 27, 10, 0),
        datetime(2026, 10, 27, 10, 16),
    )
