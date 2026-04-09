// =============================================================================
// BANORA CHIROPRACTIC — NEWSLETTER PREVIEW ENDPOINT
// File: api/preview.ts  (Vercel serverless function)
// =============================================================================
//
// Renders the newsletter draft as a browser-viewable HTML page.
// James clicks this link in the Telegram message to review before approving.
//
// Usage:
//   GET /api/preview?id=newsletter:2026-07
//   GET /api/preview?id=newsletter:2026-07&plain=1   (no preview banner)
//
// Returns:
//   200 text/html — the rendered newsletter
//   404 JSON      — draft not found or expired
//   400 JSON      — missing id param
//
// Environment variables required:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { renderNewsletterHtml, type NewsletterContent } from '@/lib/newsletter/render-html';

type NewsletterDraft = {
  id: string;
  generated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  brief: Record<string, unknown>;
  content: NewsletterContent;
  raw_response: string;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const plain = url.searchParams.get('plain') === '1';

  if (!id) {
    return NextResponse.json({ error: 'Missing ?id= parameter' }, { status: 400 });
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const raw = await redis.get<string>(id);

  if (!raw) {
    return NextResponse.json(
      { error: `Draft not found: ${id}. It may have expired (30-day TTL) or not been generated yet.` },
      { status: 404 }
    );
  }

  const draft: NewsletterDraft = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (!draft.content) {
    return NextResponse.json({ error: 'Draft exists but has no rendered content' }, { status: 422 });
  }

  const html = renderNewsletterHtml(draft.content, { isPreview: !plain });

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Prevent search engines indexing the preview
      'X-Robots-Tag': 'noindex, nofollow',
      // Cache briefly so repeated Telegram taps are fast
      'Cache-Control': 'private, max-age=60',
    },
  });
}
