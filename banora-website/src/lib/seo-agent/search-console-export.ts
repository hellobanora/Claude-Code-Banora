// Read-only Search Console export for the scheduled cloud SEO routines.
// Returns the last 28 and 90 days of query, page and query-by-page rows so
// the routine can find quick wins (high impressions / low CTR, positions
// 5-20, pages that aren't ranking) without holding Google credentials itself.

import {
  dateRange,
  queryRange,
  REPORTING_LAG_DAYS,
  type SearchAnalyticsRow,
} from "./search-console";

const ROW_LIMIT = 500;

export interface ExportRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface WindowExport {
  startDate: string;
  endDate: string;
  queries: ExportRow[];
  pages: ExportRow[];
  queryPages: ExportRow[];
}

export interface SearchConsoleExport {
  siteUrl: string;
  generatedAt: string;
  last28Days: WindowExport;
  last90Days: WindowExport;
}

function round(row: SearchAnalyticsRow): ExportRow {
  return {
    keys: row.keys,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: Math.round(row.ctr * 10000) / 10000,
    position: Math.round(row.position * 10) / 10,
  };
}

async function exportWindow(
  accessToken: string,
  siteUrl: string,
  windowDays: number
): Promise<WindowExport> {
  const range = dateRange(REPORTING_LAG_DAYS, windowDays);
  const run = (dims: string[]) =>
    queryRange(accessToken, siteUrl, range, dims, undefined, ROW_LIMIT).then((rows) =>
      rows.map(round)
    );

  const [queries, pages, queryPages] = await Promise.all([
    run(["query"]),
    run(["page"]),
    run(["query", "page"]),
  ]);

  return { ...range, queries, pages, queryPages };
}

export async function getSearchConsoleExport(
  accessToken: string,
  siteUrl: string
): Promise<SearchConsoleExport> {
  const [last28Days, last90Days] = await Promise.all([
    exportWindow(accessToken, siteUrl, 28),
    exportWindow(accessToken, siteUrl, 90),
  ]);

  return { siteUrl, generatedAt: new Date().toISOString(), last28Days, last90Days };
}
