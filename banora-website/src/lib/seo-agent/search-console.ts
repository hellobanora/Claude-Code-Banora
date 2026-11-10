// Pulls week-over-week Search Console performance for the tracked target
// queries (see .claude/skills/analytics-tracking/SKILL.md) plus top pages.
// Uses Search Console's own date-range queries — no stored state needed.

const TRACKED_QUERIES = [
  "chiropractor banora point",
  "chiropractor tweed heads",
  "chiropractor tweed heads south",
  "back pain chiropractor tweed heads",
];

// Search Console data has a reporting lag — querying up to "yesterday" often
// returns incomplete rows for the last 1-3 days, so end each window a few
// days back.
const REPORTING_LAG_DAYS = 3;
const WINDOW_DAYS = 7;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dateRange(endOffsetDays: number, windowDays: number) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - endOffsetDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (windowDays - 1));
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function queryRange(
  accessToken: string,
  siteUrl: string,
  range: { startDate: string; endDate: string },
  dimensions: string[],
  queryFilter?: string
): Promise<SearchAnalyticsRow[]> {
  const body: Record<string, unknown> = {
    startDate: range.startDate,
    endDate: range.endDate,
    dimensions,
    rowLimit: 25,
  };

  if (queryFilter) {
    body.dimensionFilterGroups = [
      {
        filters: [
          { dimension: "query", operator: "includingRegex", expression: queryFilter },
        ],
      },
    ];
  }

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Search Console query failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { rows?: SearchAnalyticsRow[] };
  return data.rows ?? [];
}

export interface TrackedQueryDelta {
  query: string;
  thisWeek: { clicks: number; impressions: number; position: number };
  lastWeek: { clicks: number; impressions: number; position: number };
}

export interface TopPage {
  page: string;
  clicks: number;
  impressions: number;
}

export interface SearchConsoleReport {
  trackedQueries: TrackedQueryDelta[];
  topPages: TopPage[];
}

function findRow(rows: SearchAnalyticsRow[], key: string): SearchAnalyticsRow | undefined {
  return rows.find((r) => r.keys[0]?.toLowerCase() === key.toLowerCase());
}

function toMetrics(row: SearchAnalyticsRow | undefined) {
  return {
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    position: row ? Math.round(row.position * 10) / 10 : 0,
  };
}

export async function getSearchConsoleReport(
  accessToken: string,
  siteUrl: string
): Promise<SearchConsoleReport> {
  const thisWeekRange = dateRange(REPORTING_LAG_DAYS, WINDOW_DAYS);
  const lastWeekRange = dateRange(REPORTING_LAG_DAYS + WINDOW_DAYS, WINDOW_DAYS);
  const queryFilter = TRACKED_QUERIES.map((q) => q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

  const [thisWeekRows, lastWeekRows, topPageRows] = await Promise.all([
    queryRange(accessToken, siteUrl, thisWeekRange, ["query"], queryFilter),
    queryRange(accessToken, siteUrl, lastWeekRange, ["query"], queryFilter),
    queryRange(accessToken, siteUrl, thisWeekRange, ["page"]),
  ]);

  const trackedQueries: TrackedQueryDelta[] = TRACKED_QUERIES.map((query) => ({
    query,
    thisWeek: toMetrics(findRow(thisWeekRows, query)),
    lastWeek: toMetrics(findRow(lastWeekRows, query)),
  }));

  const topPages: TopPage[] = topPageRows
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
    .map((r) => ({ page: r.keys[0], clicks: r.clicks, impressions: r.impressions }));

  return { trackedQueries, topPages };
}
