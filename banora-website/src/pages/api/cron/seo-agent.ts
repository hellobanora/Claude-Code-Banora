// Vercel Cron endpoint — runs weekly (see vercel.json).
// Pulls Search Console performance, checks GBP reviews, auto-replies to
// low-risk reviews only, drafts the rest, and emails a weekly summary.
// This route has real side effects (posts live replies to Google), so unlike
// health-check.ts it fails closed: a request without the correct CRON_SECRET
// is always rejected, even if CRON_SECRET somehow isn't set.

import type { APIRoute } from "astro";
import { getAccessToken } from "../../../lib/seo-agent/google-token";
import { getSearchConsoleReport } from "../../../lib/seo-agent/search-console";
import { listUnrepliedReviews, postReply } from "../../../lib/seo-agent/gbp-reviews";
import { classifyReviews } from "../../../lib/seo-agent/review-classifier";
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
  // GBP_ACCOUNT_ID/GBP_LOCATION_ID can be unset while Google's Business
  // Profile API quota increase is still pending — reviews are skipped, not
  // fatal, so Search Console reporting keeps working either way.
  const gbpConfigured = Boolean(accountId && locationId);

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

  let reviewCheckError: string | null = null;

  const [searchConsole, unrepliedReviews] = await Promise.all([
    getSearchConsoleReport(accessToken, siteUrl).catch((err) => {
      console.error("[seo-agent] Search Console query failed", err);
      return { trackedQueries: [], topPages: [] };
    }),
    gbpConfigured
      ? listUnrepliedReviews(accessToken, accountId, locationId).catch((err) => {
          console.error("[seo-agent] GBP review list failed", err);
          reviewCheckError = err instanceof Error ? err.message : String(err);
          return [];
        })
      : Promise.resolve([]),
  ]);

  if (!gbpConfigured) {
    console.warn(
      "[seo-agent] GBP_ACCOUNT_ID/GBP_LOCATION_ID not set — skipping review checks " +
        "(likely still waiting on Google's Business Profile API quota increase)"
    );
  }

  // "checked" means we actually got a successful review list back, not just
  // that the env vars were present — a thrown error must never be silently
  // reported as "nothing needs attention".
  const reviewsChecked = gbpConfigured && !reviewCheckError;

  const classified = classifyReviews(unrepliedReviews);
  const autoReplied = classified.filter((r) => r.kind === "auto_replied");
  const needsReply = classified.filter((r) => r.kind === "draft");

  if (reviewsChecked) {
    for (const review of autoReplied) {
      if (review.kind !== "auto_replied") continue;
      try {
        await postReply(accessToken, accountId, locationId, review.reviewId, review.replyText);
        console.log(`[seo-agent] auto-replied to review ${review.reviewId}`);
      } catch (err) {
        console.error(`[seo-agent] failed to post reply for review ${review.reviewId}`, err);
      }
    }
  }

  let emailSent = false;
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const reportEmail = import.meta.env.SEO_REPORT_EMAIL;
  if (resendApiKey && reportEmail) {
    const html = buildReportHtml(searchConsole, autoReplied, needsReply, reviewsChecked, reviewCheckError);
    emailSent = await sendReportEmail(resendApiKey, reportEmail, html);
  } else {
    console.warn("[seo-agent] email skipped: missing RESEND_API_KEY or SEO_REPORT_EMAIL");
  }

  const response = {
    timestamp: new Date().toISOString(),
    searchConsole,
    reviews: { autoReplied, needsReply, checked: reviewsChecked, error: reviewCheckError },
    emailSent,
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
