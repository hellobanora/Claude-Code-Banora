// Posts one specific, human-approved review reply.
// Called by the banora-seo-agent Claude Code scheduled task AFTER the user
// explicitly approves a drafted reply in chat — never called automatically.
// Same fail-closed CRON_SECRET check as seo-agent.ts (reuses that secret
// rather than inventing a second one, since both live under /api/cron/).

import type { APIRoute } from "astro";
import { getAccessToken } from "../../../lib/seo-agent/google-token";
import { postReply } from "../../../lib/seo-agent/gbp-reviews";

export const prerender = false;

const MAX_REPLY_LENGTH = 4096;

export const POST: APIRoute = async ({ request }) => {
  const cronSecret = import.meta.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { reviewId?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { reviewId, text } = body;
  if (!reviewId || !text || text.length > MAX_REPLY_LENGTH) {
    return new Response(
      JSON.stringify({ error: "reviewId and text are required; text must be <= 4096 chars" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const accountId = import.meta.env.GBP_ACCOUNT_ID;
  const locationId = import.meta.env.GBP_LOCATION_ID;
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
    await postReply(accessToken, accountId, locationId, reviewId, text);
    console.log(`[seo-agent-reply] posted approved reply for review ${reviewId}`);
  } catch (err) {
    console.error(`[seo-agent-reply] failed to post reply for review ${reviewId}`, err);
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
