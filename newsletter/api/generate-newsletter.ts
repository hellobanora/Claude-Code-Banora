// =============================================================================
// BANORA CHIROPRACTIC — NEWSLETTER GENERATION FUNCTION
// File: api/generate-newsletter.ts  (Vercel serverless function)
// =============================================================================
//
// Trigger: Vercel cron job (vercel.json) OR manual POST
// Flow:
//   1. Determine current month's content brief
//   2. Call Claude API with system prompt + monthly brief
//   3. Parse and validate JSON response
//   4. Store draft in Upstash Redis
//   5. Send Telegram preview to James for approval
//
// Environment variables required:
//   ANTHROPIC_API_KEY
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//   TELEGRAM_BOT_TOKEN
//   TELEGRAM_CHAT_ID         (James's Telegram chat ID)
//   NEWSLETTER_PREVIEW_URL   (your Vercel deployment URL)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';

import { buildSystemPrompt } from '@/lib/newsletter/system-prompt';
import { getBriefForMonth, buildUserPrompt, MonthlyBrief } from '@/lib/newsletter/content-calendar';

// ─── Types ───────────────────────────────────────────────────────────────────

type NewsletterDraft = {
  id: string;           // e.g. "newsletter:2026-07"
  generated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  brief: MonthlyBrief;
  content: Record<string, unknown>;   // Parsed Claude JSON response
  raw_response: string;               // Original Claude output (for debugging)
};

// ─── Vercel cron handler ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Allow manual POST with ?month=July override, otherwise use current month
  const url = new URL(req.url);
  const monthOverride = url.searchParams.get('month');
  const now = new Date();
  const monthName = monthOverride ?? now.toLocaleString('en-AU', { month: 'long', timeZone: 'Australia/Brisbane' });
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 1. Get content brief ──────────────────────────────────────────────────────
  const brief = getBriefForMonth(monthName);
  if (!brief) {
    return NextResponse.json({ error: `No content brief found for month: ${monthName}` }, { status: 400 });
  }

  // 2. Call Claude API ────────────────────────────────────────────────────────
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let rawResponse: string;
  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: buildSystemPrompt(),
      messages: [
        { role: 'user', content: buildUserPrompt(brief) }
      ],
    });

    rawResponse = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('');
  } catch (err) {
    console.error('Claude API error:', err);
    return NextResponse.json({ error: 'Failed to generate content from Claude API' }, { status: 500 });
  }

  // 3. Parse JSON response ────────────────────────────────────────────────────
  let content: Record<string, unknown>;
  try {
    // Strip any accidental markdown fences
    const clean = rawResponse.replace(/```json\n?|```\n?/g, '').trim();
    content = JSON.parse(clean);
  } catch (err) {
    console.error('JSON parse error. Raw response:', rawResponse.slice(0, 500));
    return NextResponse.json({ error: 'Failed to parse Claude response as JSON', raw: rawResponse.slice(0, 500) }, { status: 500 });
  }

  // 4. Store in Upstash Redis ─────────────────────────────────────────────────
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const draftId = `newsletter:${yearMonth}`;
  const draft: NewsletterDraft = {
    id: draftId,
    generated_at: new Date().toISOString(),
    status: 'pending',
    brief,
    content,
    raw_response: rawResponse,
  };

  await redis.set(draftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 }); // 30-day TTL

  // 5. Send Telegram preview ──────────────────────────────────────────────────
  const previewUrl = `${process.env.NEWSLETTER_PREVIEW_URL}/api/preview?id=${draftId}`;

  const telegramMessage = [
    `📧 *Newsletter Draft Ready — ${brief.month} Issue ${brief.issue}*`,
    ``,
    `*Subject:* ${content.subject_line ?? 'See preview'}`,
    `*Preview text:* ${content.preview_text ?? '—'}`,
    ``,
    `👉 [View full preview](${previewUrl})`,
    ``,
    `Use the buttons below to approve or request changes.`,
  ].join('\n');

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Approve & Send', callback_data: `approve:${draftId}` },
              { text: '✏️ Edit Note', callback_data: `edit:${draftId}` },
            ],
            [
              { text: '❌ Reject', callback_data: `reject:${draftId}` },
            ],
          ],
        },
      }),
    }
  );

  if (!telegramRes.ok) {
    console.error('Telegram send failed:', await telegramRes.text());
  }

  return NextResponse.json({
    success: true,
    draft_id: draftId,
    month: brief.month,
    issue: brief.issue,
    preview_url: previewUrl,
  });
}

// ─── Vercel cron config (add to vercel.json) ─────────────────────────────────
//
// {
//   "crons": [
//     {
//       "path": "/api/generate-newsletter",
//       "schedule": "0 8 1 * *"   <-- 8am on the 1st of every month (UTC)
//     }
//   ]
// }
//
// Note: Vercel cron runs in UTC. AEST is UTC+10, AEDT is UTC+11.
// To trigger at 8am Brisbane time, use "0 22 28-31 * *" for last day,
// or adjust schedule to match your preferred day.
