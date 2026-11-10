
import polars as pl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

github = pl.read_csv(BASE_DIR / "data" / "raw" / "github_commits.csv")
slack = pl.read_csv(BASE_DIR / "data" / "raw" / "slack_data.csv")
ide = pl.read_csv(BASE_DIR / "data" / "raw" / "ide_activity.csv")

# GitHub: preserve the actual commit author timestamp
github_data = github.select(
    pl.col("sha").alias("event_id"),
    pl.col("commit.message").alias("activity"),
    pl.lit("GitHub").alias("source"),
    pl.col("commit.author.date").alias("timestamp")
)

# Slack: timestamps are unavailable in the supplied CSV
slack_data = slack.select(
    pl.col("id").cast(pl.String).alias("event_id"),
    pl.col("title").alias("activity"),
    pl.lit("Slack").alias("source"),
    pl.lit(None, dtype=pl.String).alias("timestamp")
)

# IDE: timestamps are unavailable in the supplied CSV
ide_data = ide.select(
    pl.col("id").cast(pl.String).alias("event_id"),
    pl.col("title").alias("activity"),
    pl.lit("IDE").alias("source"),
    pl.lit(None, dtype=pl.String).alias("timestamp")
)

# Combine all sources
combined = pl.concat(
    [github_data, slack_data, ide_data]
)

# Source-wise analytics
source_summary = (
    combined
    .group_by("source")
    .agg(pl.len().alias("total_events"))
    .sort("total_events", descending=True)
)

print("\n===== COMBINED ACTIVITY DATA =====")
print("Total Events:", combined.height)
print(source_summary)
print("\n===== SAMPLE RECORDS =====")
print(combined.head(10))

# Save processed data
output_dir = BASE_DIR / "data" / "processed"
output_dir.mkdir(parents=True, exist_ok=True)

output_file = output_dir / "combined_activity.csv"
combined.write_csv(output_file)

print("\n===== DATA EXPORTED SUCCESSFULLY =====")
print("Saved at:", output_file)
