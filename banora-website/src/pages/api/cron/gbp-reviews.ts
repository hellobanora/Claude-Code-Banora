// Vercel Cron endpoint — runs every 2-3 days (see vercel.json), separate
// from the weekly seo-agent report so new reviews don't sit unanswered for
// up to a week. Auto-replies to low-risk reviews only; emails ONLY when a
// review needs a human reply or the check itself failed, to avoid alert
// fatigue from a routine "nothing to do" email every couple of days.

import type { APIRoute } from "astro";
import { getAccessToken } from "../../../lib/seo-agent/google-token";
import { runReviewCheck } from "../../../lib/seo-agent/review-check";
import { buildReviewAlertHtml, sendReportEmail } from "../../../lib/seo-agent/report-email";

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

  console.log(`[gbp-reviews] Starting at ${new Date().toISOString()}`);

  let accessToken: string;
  try {
    accessToken = await getAccessToken({
      clientId: import.meta.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: import.meta.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
  } catch (err) {
    console.error("[gbp-reviews] token refresh failed", err);
    return new Response(JSON.stringify({ error: "Google auth failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { autoReplied, needsReply, checked, error } = await runReviewCheck(
    { accessToken, accountId, locationId },
    "[gbp-reviews]"
  );

  let emailSent = false;
  const needsAttention = error || needsReply.length > 0;
  if (needsAttention) {
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const reportEmail = import.meta.env.SEO_REPORT_EMAIL;
    if (resendApiKey && reportEmail) {
      const html = buildReviewAlertHtml(needsReply, error);
      const subject = error
        ? "Banora — Review check failed"
        : `Banora — ${needsReply.length} review${needsReply.length === 1 ? "" : "s"} need your reply`;
      emailSent = await sendReportEmail(resendApiKey, reportEmail, html, subject);
    } else {
      console.warn("[gbp-reviews] email skipped: missing RESEND_API_KEY or SEO_REPORT_EMAIL");
    }
  }

  const response = {
    timestamp: new Date().toISOString(),
    reviews: { autoReplied, needsReply, checked, error },
    emailSent,
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
