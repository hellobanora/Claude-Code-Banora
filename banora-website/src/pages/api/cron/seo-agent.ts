// Vercel Cron endpoint — runs weekly (see vercel.json).
// Pulls Search Console performance, checks GBP reviews, auto-replies to
// low-risk reviews only, drafts the rest, and emails a weekly summary.
// This route has real side effects (posts live replies to Google), so unlike
// health-check.ts it fails closed: a request without the correct CRON_SECRET
// is always rejected, even if CRON_SECRET somehow isn't set.

import type { APIRoute } from "astro";
import { getAccessToken } from "../../../lib/seo-agent/google-token";
import { getSearchConsoleReport } from "../../../lib/seo-agent/search-console";
import { runReviewCheck } from "../../../lib/seo-agent/review-check";
import { buildReportHtml, sendReportEmail } from "../../../lib/seo-agent/report-email";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const cronSecret = import.meta.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const accountId = import.meta.env.GBP_ACCOUNT_ID;
  const locationId = import.meta.env.GBP_LOCATION_ID;
  const siteUrl = import.meta.env.SEARCH_CONSOLE_SITE_URL;

  if (!siteUrl) {
    return new Response(JSON.stringify({ error: "Missing SEARCH_CONSOLE_SITE_URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[seo-agent] Starting at ${new Date().toISOString()}`);

  let accessToken: string;
  try {
    accessToken = await getAccessToken({
      clientId: import.meta.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: import.meta.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
  } catch (err) {
    console.error("[seo-agent] token refresh failed", err);
    return new Response(JSON.stringify({ error: "Google auth failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [searchConsole, reviewResult] = await Promise.all([
    getSearchConsoleReport(accessToken, siteUrl).catch((err) => {
      console.error("[seo-agent] Search Console query failed", err);
      return { trackedQueries: [], topPages: [] };
    }),
    runReviewCheck({ accessToken, accountId, locationId }, "[seo-agent]"),
  ]);

  const { autoReplied, needsReply, checked, error } = reviewResult;

  let emailSent = false;
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const reportEmail = import.meta.env.SEO_REPORT_EMAIL;
  if (resendApiKey && reportEmail) {
    const html = buildReportHtml(searchConsole, autoReplied, needsReply, checked, error);
    emailSent = await sendReportEmail(resendApiKey, reportEmail, html);
  } else {
    console.warn("[seo-agent] email skipped: missing RESEND_API_KEY or SEO_REPORT_EMAIL");
  }

  const response = {
    timestamp: new Date().toISOString(),
    searchConsole,
    reviews: { autoReplied, needsReply, checked, error },
    emailSent,
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
