// api/cron/hourly-booking-check.ts
// Runs every hour. Checks IconPractice booking system + AI chatbot.
// Sends Telegram ONLY if something is broken — silent when healthy.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendTelegramAlert, aestTimestamp } from '../../lib/telegram';

const BOOKING_URL =
  process.env.BOOKING_URL ||
  'https://iconpractice.com/ob/7138/banorachiropractic/245386/2';
const CHATBOT_ENDPOINT =
  process.env.CHATBOT_ENDPOINT ||
  'https://www.banorachiropractic.com.au/api/chat';

const REQUEST_TIMEOUT_MS = 15_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'BanoraHealthCheck/1.0',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(t);
  }
}

async function checkBooking(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetchWithTimeout(BOOKING_URL, { method: 'GET' });
    if (!res.ok) {
      return { ok: false, detail: `HTTP ${res.status}` };
    }
    // Lightweight content sanity check — IconPractice booking pages should
    // return HTML containing something recognisable. If the page is reachable
    // but empty/blank, treat as broken.
    const text = await res.text();
    if (text.length < 200) {
      return { ok: false, detail: `suspiciously small response (${text.length} bytes)` };
    }
    return { ok: true, detail: `HTTP ${res.status}` };
  } catch (err: any) {
    return { ok: false, detail: err?.message || 'fetch failed' };
  }
}

async function checkChatbot(): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetchWithTimeout(CHATBOT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'healthcheck ping', healthcheck: true }),
    });
    if (!res.ok) {
      return { ok: false, detail: `HTTP ${res.status}` };
    }
    // Verify the bot returns a usable body (JSON or text)
    const text = await res.text();
    if (!text || text.length < 2) {
      return { ok: false, detail: 'empty response body' };
    }
    return { ok: true, detail: `HTTP ${res.status}` };
  } catch (err: any) {
    return { ok: false, detail: err?.message || 'fetch failed' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Guard: only allow Vercel cron or explicit secret
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const [booking, chatbot] = await Promise.all([checkBooking(), checkChatbot()]);

  const problems: string[] = [];
  if (!booking.ok) problems.push(`📅 Booking system DOWN — ${booking.detail}`);
  if (!chatbot.ok) problems.push(`🤖 Chatbot DOWN — ${chatbot.detail}`);

  // Only alert if something is actually broken.
  if (problems.length > 0) {
    const message = [
      `🚨 <b>Banora — Service Issue Detected</b>`,
      `<i>${aestTimestamp()} AEST</i>`,
      '',
      ...problems,
      '',
      `<b>URLs tested:</b>`,
      `Booking: ${BOOKING_URL}`,
      `Chatbot: ${CHATBOT_ENDPOINT}`,
    ].join('\n');

    await sendTelegramAlert(message);
  }

  return res.status(200).json({
    ok: booking.ok && chatbot.ok,
    alerted: problems.length > 0,
    booking,
    chatbot,
  });
}
