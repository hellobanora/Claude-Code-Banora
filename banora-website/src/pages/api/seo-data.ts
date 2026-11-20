// Private, read-only Search Console export for the scheduled cloud SEO
// routines (see docs/seo-agent/ROUTINES.md). It never writes anything.
// Uses its own secret (SEO_DATA_SECRET), separate from CRON_SECRET, so the
// cloud routine can read data without being able to trigger the cron jobs
// that post review replies. Fails closed if the secret isn't set.

import type { APIRoute } from "astro";
import { getAccessToken } from "../../lib/seo-agent/google-token";
import { getSearchConsoleExport } from "../../lib/seo-agent/search-console-export";
import { getReviewStats, type ReviewStats } from "../../lib/seo-agent/gbp-reviews";

export const prerender = false;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const secret = import.meta.env.SEO_DATA_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  const siteUrl = import.meta.env.SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) return json({ error: "Missing SEARCH_CONSOLE_SITE_URL" }, 500);

  let accessToken: string;
  try {
    accessToken = await getAccessToken({
      clientId: import.meta.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: import.meta.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
  } catch (err) {
    console.error("[seo-data] token refresh failed", err);
    return json({ error: "Google auth failed" }, 502);
  }

  // Review stats are optional: if Business Profile access fails, the routine still gets
  // Search Console data and is told why the stats are missing.
  const reviewStats = loadReviewStats(accessToken);

  try {
    const searchConsole = await getSearchConsoleExport(accessToken, siteUrl);
    return json({ ...searchConsole, reviewStats: await reviewStats }, 200);
  } catch (err) {
    console.error("[seo-data] Search Console export failed", err);
    return json({ error: "Search Console export failed" }, 502);
  }
};

async function loadReviewStats(
  accessToken: string
): Promise<(ReviewStats & { checkedAt: string }) | { error: string }> {
  const accountId = import.meta.env.GBP_ACCOUNT_ID;
  const locationId = import.meta.env.GBP_LOCATION_ID;
  if (!accountId || !locationId) return { error: "GBP_ACCOUNT_ID / GBP_LOCATION_ID not set" };
  try {
    const stats = await getReviewStats(accessToken, accountId, locationId);
    return { ...stats, checkedAt: new Date().toISOString() };
  } catch (err) {
    console.error("[seo-data] review stats failed", err);
    return { error: String(err).slice(0, 300) };
  }
}
