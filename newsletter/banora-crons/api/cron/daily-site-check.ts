// api/cron/daily-site-check.ts
// Runs daily at 7am AEST. Checks homepage, all internal links, images, and APIs.
// ALWAYS sends a Telegram summary (pass or fail).

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendTelegramAlert, aestTimestamp } from '../../lib/telegram';

const SITE_URL = process.env.SITE_URL || 'https://www.banorachiropractic.com.au';
const BOOKING_URL =
  process.env.BOOKING_URL ||
  'https://iconpractice.com/ob/7138/banorachiropractic/245386/2';
const CHATBOT_ENDPOINT = process.env.CHATBOT_ENDPOINT || `${SITE_URL}/api/chat`;

// Reasonable request timeout per resource
const REQUEST_TIMEOUT_MS = 10_000;
// How many links/images to check in parallel
const CONCURRENCY = 10;

type CheckResult = {
  url: string;
  status: number | null;
  ok: boolean;
  error?: string;
};

// --- Utilities ---------------------------------------------------------------

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
        'User-Agent': 'BanoraHealthCheck/1.0 (+https://banorachiropractic.com.au)',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(t);
  }
}

async function checkUrl(url: string, method: 'GET' | 'HEAD' = 'HEAD'): Promise<CheckResult> {
  try {
    let res = await fetchWithTimeout(url, { method });
    // Some servers reject HEAD — retry GET if we get 405/403/501
    if ([403, 405, 501].includes(res.status) && method === 'HEAD') {
      res = await fetchWithTimeout(url, { method: 'GET' });
    }
    return { url, status: res.status, ok: res.ok };
  } catch (err: any) {
    return { url, status: null, ok: false, error: err?.message || 'fetch failed' };
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  });
  await Promise.all(runners);
  return results;
}

// --- Link & image extraction -------------------------------------------------

function absoluteUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function extractLinksAndImages(html: string, baseUrl: string) {
  const origin = new URL(baseUrl).origin;

  const hrefMatches = Array.from(html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi));
  const imgMatches = Array.from(html.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/gi));

  const internalLinks = new Set<string>();
  const externalLinks = new Set<string>();
  const images = new Set<string>();

  for (const m of hrefMatches) {
    const raw = m[1];
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
    const abs = absoluteUrl(raw, baseUrl);
    if (!abs) continue;
    if (abs.startsWith(origin)) internalLinks.add(abs);
    else if (abs.startsWith('http')) externalLinks.add(abs);
  }

  for (const m of imgMatches) {
    const raw = m[1];
    if (!raw || raw.startsWith('data:')) continue;
    const abs = absoluteUrl(raw, baseUrl);
    if (abs) images.add(abs);
  }

  return {
    internalLinks: [...internalLinks],
    externalLinks: [...externalLinks],
    images: [...images],
  };
}

// --- API / endpoint checks ---------------------------------------------------

async function checkBookingSystem(): Promise<CheckResult> {
  return checkUrl(BOOKING_URL, 'GET');
}

async function checkChatbot(): Promise<CheckResult> {
  try {
    const res = await fetchWithTimeout(CHATBOT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'healthcheck ping', healthcheck: true }),
    });
    return { url: CHATBOT_ENDPOINT, status: res.status, ok: res.ok };
  } catch (err: any) {
    return {
      url: CHATBOT_ENDPOINT,
      status: null,
      ok: false,
      error: err?.message || 'fetch failed',
    };
  }
}

// --- Main handler ------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Guard: only allow Vercel cron or an explicit secret
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startedAt = Date.now();
  const timestamp = aestTimestamp();

  // 1. Fetch homepage
  const homepage = await (async (): Promise<{
    ok: boolean;
    status: number | null;
    html?: string;
    error?: string;
  }> => {
    try {
      const r = await fetchWithTimeout(SITE_URL, { method: 'GET' });
      const html = await r.text();
      return { ok: r.ok, status: r.status, html };
    } catch (err: any) {
      return { ok: false, status: null, error: err?.message || 'fetch failed' };
    }
  })();

  // 2. Extract and check links + images
  let internalResults: CheckResult[] = [];
  let externalResults: CheckResult[] = [];
  let imageResults: CheckResult[] = [];

  if (homepage.ok && homepage.html) {
    const { internalLinks, externalLinks, images } = extractLinksAndImages(
      homepage.html,
      SITE_URL
    );

    internalResults = await runWithConcurrency(internalLinks, CONCURRENCY, (u) =>
      checkUrl(u, 'HEAD')
    );
    externalResults = await runWithConcurrency(externalLinks, CONCURRENCY, (u) =>
      checkUrl(u, 'HEAD')
    );
    imageResults = await runWithConcurrency(images, CONCURRENCY, (u) => checkUrl(u, 'HEAD'));
  }

  // 3. API checks
  const [bookingResult, chatbotResult] = await Promise.all([
    checkBookingSystem(),
    checkChatbot(),
  ]);

  // 4. Summarise
  const failedInternal = internalResults.filter((r) => !r.ok);
  const failedExternal = externalResults.filter((r) => !r.ok);
  const failedImages = imageResults.filter((r) => !r.ok);

  const overallOk =
    homepage.ok &&
    failedInternal.length === 0 &&
    failedImages.length === 0 &&
    bookingResult.ok &&
    chatbotResult.ok;

  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);

  // 5. Build Telegram message
  const icon = overallOk ? '✅' : '⚠️';
  const header = overallOk
    ? `${icon} <b>Banora Daily Check — All Good</b>`
    : `${icon} <b>Banora Daily Check — Issues Found</b>`;

  const lines: string[] = [
    header,
    `<i>${timestamp} AEST</i>`,
    '',
    `🌐 Homepage: ${homepage.ok ? '✅' : '❌'} (${homepage.status ?? 'no response'})`,
    `🔗 Internal links: ${failedInternal.length === 0 ? '✅' : '❌'} ${internalResults.length - failedInternal.length}/${internalResults.length} ok`,
    `🌍 External links: ${failedExternal.length === 0 ? '✅' : '⚠️'} ${externalResults.length - failedExternal.length}/${externalResults.length} ok`,
    `🖼️ Images: ${failedImages.length === 0 ? '✅' : '❌'} ${imageResults.length - failedImages.length}/${imageResults.length} ok`,
    `📅 Booking system: ${bookingResult.ok ? '✅' : '❌'} (${bookingResult.status ?? 'no response'})`,
    `🤖 Chatbot API: ${chatbotResult.ok ? '✅' : '❌'} (${chatbotResult.status ?? 'no response'})`,
    '',
    `⏱️ Checked in ${durationSec}s`,
  ];

  // Append details of any failures (trimmed to avoid Telegram 4096-char limit)
  const failureDetails: string[] = [];
  if (!homepage.ok) {
    failureDetails.push(`• Homepage: ${homepage.status ?? homepage.error}`);
  }
  for (const r of failedInternal.slice(0, 10)) {
    failureDetails.push(`• Link ${r.status ?? r.error}: ${r.url}`);
  }
  for (const r of failedImages.slice(0, 10)) {
    failureDetails.push(`• Image ${r.status ?? r.error}: ${r.url}`);
  }
  if (!bookingResult.ok) {
    failureDetails.push(`• Booking: ${bookingResult.status ?? bookingResult.error}`);
  }
  if (!chatbotResult.ok) {
    failureDetails.push(`• Chatbot: ${chatbotResult.status ?? chatbotResult.error}`);
  }
  // External link failures shown but not weighted into overall pass/fail
  for (const r of failedExternal.slice(0, 5)) {
    failureDetails.push(`• External ${r.status ?? r.error}: ${r.url}`);
  }

  if (failureDetails.length > 0) {
    lines.push('', '<b>Details:</b>', ...failureDetails);
  }

  await sendTelegramAlert(lines.join('\n'));

  return res.status(200).json({
    ok: overallOk,
    timestamp,
    durationSec,
    homepage: { ok: homepage.ok, status: homepage.status },
    internal: { total: internalResults.length, failed: failedInternal.length },
    external: { total: externalResults.length, failed: failedExternal.length },
    images: { total: imageResults.length, failed: failedImages.length },
    booking: bookingResult,
    chatbot: chatbotResult,
  });
}
