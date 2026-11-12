// Posts one specific, human-approved GBP Post.
// Called by the banora-seo-agent chat task AFTER the user explicitly
// approves (or edits) a drafted post — never called automatically.
// Same fail-closed CRON_SECRET check as the other /api/cron/* routes.

import type { APIRoute } from "astro";
import { getAccessToken } from "../../../lib/seo-agent/google-token";
import { createLocalPost, type CtaType } from "../../../lib/seo-agent/gbp-posts";

export const prerender = false;

const MAX_SUMMARY_LENGTH = 1500; // Google's own Posts summary limit

export const POST: APIRoute = async ({ request }) => {
  const cronSecret = import.meta.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { summary?: string; imageFileName?: string; ctaType?: CtaType; ctaPath?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { summary, imageFileName, ctaType, ctaPath } = body;
  if (!summary || !imageFileName || !ctaType || summary.length > MAX_SUMMARY_LENGTH) {
    return new Response(
      JSON.stringify({ error: "summary, imageFileName and ctaType are required; summary must be <= 1500 chars" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const accountId = import.meta.env.GBP_ACCOUNT_ID;
  const locationId = import.meta.env.GBP_LOCATION_ID;
  const siteUrl = import.meta.env.SITE_URL || "https://www.banorachiropractic.com.au";
  if (!accountId || !locationId) {
    return new Response(JSON.stringify({ error: "Missing GBP_ACCOUNT_ID / GBP_LOCATION_ID" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const accessToken = await getAccessToken({
      clientId: import.meta.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: import.meta.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
    await createLocalPost(accessToken, accountId, locationId, {
      summary,
      imageUrl: `${siteUrl}/images/${imageFileName}`,
      ctaType,
      ctaUrl: ctaPath ? `${siteUrl}${ctaPath}` : undefined,
    });
    console.log("[gbp-post-approve] posted approved GBP post");
  } catch (err) {
    console.error("[gbp-post-approve] failed to post", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
