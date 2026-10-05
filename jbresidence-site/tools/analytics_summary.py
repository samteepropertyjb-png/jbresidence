"""Read-only traffic summary from Google Search Console and GA4.

OAuth client and refresh token live outside this repository at:
%USERPROFILE%\\.codex\\private\\jbresidence-analytics
"""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import date, timedelta
from pathlib import Path

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


PRIVATE_DIR = Path(os.environ.get("USERPROFILE", str(Path.home()))) / ".codex" / "private" / "jbresidence-analytics"
CLIENT_FILE = PRIVATE_DIR / "client_secret.json"
TOKEN_FILE = PRIVATE_DIR / "token.json"
CONFIG_FILE = PRIVATE_DIR / "config.json"
SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/webmasters.readonly",
]


def credentials() -> Credentials:
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    if not creds or not creds.valid:
        if not CLIENT_FILE.exists():
            raise FileNotFoundError(f"OAuth client file is missing: {CLIENT_FILE}")
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_FILE, SCOPES)
        creds = flow.run_local_server(port=0, open_browser=False)
    PRIVATE_DIR.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
    return creds


def config() -> dict:
    if not CONFIG_FILE.exists():
        return {}
    return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))


def search_console_summary(service, site: str, end: date) -> dict:
    def period(start: date, finish: date) -> dict:
        response = service.searchanalytics().query(
            siteUrl=site,
            body={"startDate": start.isoformat(), "endDate": finish.isoformat()},
        ).execute()
        return response.get("rows", [{}])[0]

    current_end = end - timedelta(days=3)  # Search Console data is delayed.
    current_start = current_end - timedelta(days=27)
    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end - timedelta(days=27)
    return {
        "window": f"{current_start} to {current_end}",
        "current": period(current_start, current_end),
        "previous": period(previous_start, previous_end),
    }


def search_console_rows(service, site: str, start: date, end: date, dimensions: list[str]) -> list[dict]:
    response = service.searchanalytics().query(
        siteUrl=site,
        body={
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": dimensions,
            "rowLimit": 1_000,
        },
    ).execute()
    return [
        {
            **dict(zip(dimensions, row.get("keys", []))),
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "ctr": row.get("ctr", 0),
            "position": row.get("position", 0),
        }
        for row in response.get("rows", [])
    ]


def aeo_geo_signals(service, site: str, creds: Credentials, property_id: str, end: date) -> dict:
    period_end = end - timedelta(days=3)
    period_start = period_end - timedelta(days=27)
    queries = search_console_rows(service, site, period_start, period_end, ["query"])
    pages = search_console_rows(service, site, period_start, period_end, ["page"])
    question_pattern = re.compile(
        r"\\b(how|what|which|where|when|why|can|should|vs|versus|price|buy|new launch|subsale)\\b|"
        r"(比较|怎么样|好不好|值得|价格|买|新盘|二手)",
        re.IGNORECASE,
    )
    answer_queries = [row for row in queries if question_pattern.search(row["query"])]
    ranking_gaps = [row for row in queries if 5 <= row["position"] <= 20 and row["impressions"] >= 10]

    client = BetaAnalyticsDataClient(credentials=creds)
    source_report = client.run_report(
        RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=period_start.isoformat(), end_date=(end - timedelta(days=1)).isoformat())],
            dimensions=[Dimension(name="sessionSource")],
            metrics=[Metric(name=name) for name in ("sessions", "activeUsers", "conversions")],
            limit=1_000,
        )
    )
    sources = [
        {
            "source": row.dimension_values[0].value,
            "sessions": int(row.metric_values[0].value),
            "active_users": int(row.metric_values[1].value),
            "conversions": int(row.metric_values[2].value),
        }
        for row in source_report.rows
    ]
    ai_hosts = ("chatgpt", "perplexity", "gemini", "claude", "copilot", "you.com", "poe.com")
    ai_referrals = [row for row in sources if any(host in row["source"].lower() for host in ai_hosts)]
    return {
        "window": f"{period_start} to {period_end}",
        "top_question_or_comparison_queries": sorted(answer_queries, key=lambda row: row["impressions"], reverse=True)[:20],
        "existing_answer_page_opportunities": sorted(ranking_gaps, key=lambda row: row["impressions"], reverse=True)[:20],
        "top_organic_landing_pages": sorted(pages, key=lambda row: row["clicks"], reverse=True)[:20],
        "observed_ai_referral_sources": ai_referrals,
    }


def ga4_summary(creds: Credentials, property_id: str, end: date) -> dict:
    client = BetaAnalyticsDataClient(credentials=creds)
    current_end = end - timedelta(days=1)
    current_start = current_end - timedelta(days=27)
    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end - timedelta(days=27)
    request = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[
            DateRange(start_date=current_start.isoformat(), end_date=current_end.isoformat(), name="current"),
            DateRange(start_date=previous_start.isoformat(), end_date=previous_end.isoformat(), name="previous"),
        ],
        metrics=[Metric(name=name) for name in ("activeUsers", "sessions", "screenPageViews", "conversions")],
    )
    response = client.run_report(request)
    rows = {}
    for row in response.rows:
        rows[row.dimension_values[0].value] = {
            metric.name: value.value for metric, value in zip(request.metrics, row.metric_values)
        }
    return {"window": f"{current_start} to {current_end}", "periods": rows}


def main() -> None:
    parser = argparse.ArgumentParser(description="Read-only JB Residence traffic summary")
    parser.add_argument("--search-console-site", default="sc-domain:thejbresidence.com")
    parser.add_argument("--ga4-property", help="GA4 numeric property ID, e.g. 123456789")
    parser.add_argument("--sites", action="store_true", help="List accessible Search Console properties")
    parser.add_argument("--aeo-geo", action="store_true", help="Output article-planning signals for AEO and GEO")
    args = parser.parse_args()

    creds = credentials()
    search_console = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    if args.sites:
        print(json.dumps(search_console.sites().list().execute(), indent=2))
        return

    ga4_property = args.ga4_property or config().get("ga4_property_id")
    if args.aeo_geo:
        if not ga4_property:
            raise ValueError("GA4 property ID is required for --aeo-geo.")
        print(json.dumps(aeo_geo_signals(search_console, args.search_console_site, creds, ga4_property, date.today()), indent=2))
        return

    output = {"search_console": search_console_summary(search_console, args.search_console_site, date.today())}
    if ga4_property:
        output["ga4"] = ga4_summary(creds, ga4_property, date.today())
    else:
        output["ga4"] = "GA4 property ID required; rerun with --ga4-property <numeric-id>."
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
