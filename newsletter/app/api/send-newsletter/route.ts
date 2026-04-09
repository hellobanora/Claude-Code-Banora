// =============================================================================
// BANORA CHIROPRACTIC — MAILCHIMP SEND FUNCTION
// File: api/send-newsletter.ts  (Vercel serverless function)
// =============================================================================
//
// Called by telegram-webhook.ts when James taps ✅ Approve.
// Flow:
//   1. Fetch approved draft from Upstash Redis
//   2. Render full HTML email from newsletter JSON
//   3. Get recipient count from Mailchimp audience
//   4. Create Mailchimp campaign
//   5. Set campaign HTML content
//   6. Send campaign
//   7. Mark draft as 'sent' in Redis
//   8. Return campaign_id, campaign_name, recipient_count
//
// Environment variables required:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//   MAILCHIMP_API_KEY          (format: xxxxxxxx-usN, datacenter in suffix)
//   MAILCHIMP_AUDIENCE_ID
//   MAILCHIMP_FROM_NAME        (default: "Banora Chiropractic")
//   MAILCHIMP_FROM_EMAIL       (default: "info@banorachiropractic.com.au")
//   NEWSLETTER_PREVIEW_URL     (used for campaign tracking URL)
//
// Optional image URL overrides (falls back to placeholders if not set):
//   IMG_LOGO_URL
//   IMG_TEAM_URL
//   IMG_CLINIC_BANNER_URL
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { renderNewsletterHtml, type NewsletterContent } from '@/lib/newsletter/render-html';

// ─── Types ───────────────────────────────────────────────────────────────────

type NewsletterDraft = {
  id: string;
  generated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  brief: Record<string, unknown>;
  content: NewsletterContent;
  raw_response: string;
};

type MailchimpCampaign = {
  id: string;
  status: string;
  settings: { title: string };
  recipients: { recipient_count?: number };
};

// ─── Mailchimp helpers ────────────────────────────────────────────────────────

function getMailchimpBase(): string {
  const apiKey = process.env.MAILCHIMP_API_KEY!;
  const dc = apiKey.split('-').pop(); // e.g. "us1" from "abc123-us1"
  if (!dc) throw new Error('MAILCHIMP_API_KEY is missing datacenter suffix (e.g. abc123-us1)');
  return `https://${dc}.api.mailchimp.com/3.0`;
}

function mailchimpAuth(): string {
  return 'Basic ' + Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64');
}

async function mailchimpFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getMailchimpBase();
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': mailchimpAuth(),
      ...options.headers,
    },
  });

  const data = await res.json() as T & { title?: string; detail?: string };

  if (!res.ok) {
    throw new Error(`Mailchimp ${options.method ?? 'GET'} ${path} failed: ${data.title ?? res.status} — ${data.detail ?? ''}`);
  }

  return data as T;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Parse request body
  let draftId: string;
  try {
    const body = await req.json() as { draft_id?: string };
    if (!body.draft_id) throw new Error('Missing draft_id');
    draftId = body.draft_id;
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid request: ${err instanceof Error ? err.message : 'Bad JSON'}` },
      { status: 400 }
    );
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // 1. Fetch draft ─────────────────────────────────────────────────────────────
  const raw = await redis.get<string>(draftId);
  if (!raw) {
    return NextResponse.json({ error: `Draft not found: ${draftId}` }, { status: 404 });
  }

  const draft: NewsletterDraft = typeof raw === 'string' ? JSON.parse(raw) : raw;

  if (draft.status === 'sent') {
    return NextResponse.json({ error: 'Draft has already been sent' }, { status: 409 });
  }

  if (!draft.content) {
    return NextResponse.json({ error: 'Draft has no content to send' }, { status: 422 });
  }

  // 2. Render HTML ─────────────────────────────────────────────────────────────
  let html: string;
  try {
    html = renderNewsletterHtml(draft.content);
  } catch (err) {
    return NextResponse.json(
      { error: `HTML render failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }

  // 3. Get audience member count ────────────────────────────────────────────────
  let recipientCount = 0;
  try {
    const audience = await mailchimpFetch<{ stats: { member_count: number } }>(
      `/lists/${process.env.MAILCHIMP_AUDIENCE_ID}`
    );
    recipientCount = audience.stats?.member_count ?? 0;
  } catch (err) {
    // Non-fatal — continue with send, report count as 0
    console.warn('Could not fetch audience member count:', err);
  }

  // 4. Create Mailchimp campaign ────────────────────────────────────────────────
  const campaignName = `${draft.content.month} Newsletter — Issue ${String(draft.content.issue_number).padStart(2, '0')}`;

  let campaign: MailchimpCampaign;
  try {
    campaign = await mailchimpFetch<MailchimpCampaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        type: 'regular',
        recipients: {
          list_id: process.env.MAILCHIMP_AUDIENCE_ID,
        },
        settings: {
          title: campaignName,
          subject_line: draft.content.subject_line,
          preview_text: draft.content.preview_text,
          from_name: process.env.MAILCHIMP_FROM_NAME ?? 'Banora Chiropractic',
          reply_to: process.env.MAILCHIMP_FROM_EMAIL ?? 'info@banorachiropractic.com.au',
        },
        tracking: {
          opens: true,
          html_clicks: true,
          text_clicks: false,
        },
      }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to create Mailchimp campaign: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 502 }
    );
  }

  // 5. Set campaign HTML content ────────────────────────────────────────────────
  try {
    await mailchimpFetch(`/campaigns/${campaign.id}/content`, {
      method: 'PUT',
      body: JSON.stringify({ html }),
    });
  } catch (err) {
    // Attempt to clean up the orphaned campaign
    try {
      await mailchimpFetch(`/campaigns/${campaign.id}`, { method: 'DELETE' });
    } catch {
      // Best effort cleanup
    }
    return NextResponse.json(
      { error: `Failed to set campaign content: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 502 }
    );
  }

  // 6. Send campaign ────────────────────────────────────────────────────────────
  try {
    await mailchimpFetch(`/campaigns/${campaign.id}/actions/send`, {
      method: 'POST',
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to send campaign: ${err instanceof Error ? err.message : 'Unknown error'}`, campaign_id: campaign.id },
      { status: 502 }
    );
  }

  // 7. Mark draft as sent in Redis ──────────────────────────────────────────────
  draft.status = 'sent';
  await redis.set(draftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 });

  // 8. Return success ───────────────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    campaign_id: campaign.id,
    campaign_name: campaignName,
    recipient_count: recipientCount,
    draft_id: draftId,
    month: draft.content.month,
  });
}
