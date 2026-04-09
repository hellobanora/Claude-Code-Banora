// =============================================================================
// BANORA CHIROPRACTIC — TELEGRAM WEBHOOK HANDLER
// File: api/telegram-webhook.ts  (Vercel serverless function)
// =============================================================================
//
// Receives callback_query events from the Telegram bot when James taps
// Approve / Edit / Reject on the newsletter preview message.
//
// Button callback_data format (set in generate-newsletter.ts):
//   approve:<draft_id>   →  trigger Mailchimp send
//   edit:<draft_id>      →  prompt James for a note, store it, alert you
//   reject:<draft_id>    →  mark draft rejected, notify
//
// Telegram webhook setup (one-time, run in browser or curl):
//   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<your-vercel-domain>/api/telegram-webhook
//
// Environment variables required:
//   TELEGRAM_BOT_TOKEN
//   TELEGRAM_CHAT_ID          James's chat ID (for security check)
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//   MAILCHIMP_SEND_URL        Internal URL of your send-newsletter function
//   NEWSLETTER_PREVIEW_URL    Your Vercel deployment base URL
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// ─── Types ───────────────────────────────────────────────────────────────────

type TelegramCallbackQuery = {
  id: string;
  from: { id: number; first_name: string };
  message: {
    message_id: number;
    chat: { id: number };
    text?: string;
  };
  data?: string;
};

type TelegramUpdate = {
  update_id: number;
  callback_query?: TelegramCallbackQuery;
  message?: {
    message_id: number;
    from: { id: number };
    chat: { id: number };
    text?: string;
    reply_to_message?: { message_id: number };
  };
};

type NewsletterDraft = {
  id: string;
  generated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  brief: Record<string, unknown>;
  content: Record<string, unknown>;
  raw_response: string;
  edit_note?: string;
};

// ─── Telegram helpers ─────────────────────────────────────────────────────────

const TG_BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  await fetch(`${TG_BASE}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: false }),
  });
}

async function sendMessage(chatId: number, text: string, replyMarkup?: object) {
  await fetch(`${TG_BASE}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });
}

async function editMessageReplyMarkup(chatId: number, messageId: number, replyMarkup: object) {
  await fetch(`${TG_BASE}/editMessageReplyMarkup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }),
  });
}

async function editMessageText(chatId: number, messageId: number, text: string) {
  await fetch(`${TG_BASE}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'Markdown' }),
  });
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // ── Handle inline button taps (callback_query) ────────────────────────────
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const fromId = cb.from.id;

    // Security: only allow James's chat
    if (String(fromId) !== String(process.env.TELEGRAM_CHAT_ID)) {
      await answerCallbackQuery(cb.id, '⛔ Unauthorised');
      return NextResponse.json({ ok: true });
    }

    const [action, draftId] = (cb.data ?? '').split(':');

    // Fetch draft from Redis
    const raw = await redis.get<string>(draftId);
    if (!raw) {
      await answerCallbackQuery(cb.id, '⚠️ Draft not found — may have expired');
      return NextResponse.json({ ok: true });
    }

    const draft: NewsletterDraft = typeof raw === 'string' ? JSON.parse(raw) : raw;

    // ── APPROVE ──────────────────────────────────────────────────────────────
    if (action === 'approve') {
      if (draft.status === 'sent') {
        await answerCallbackQuery(cb.id, 'Already sent ✓');
        return NextResponse.json({ ok: true });
      }

      await answerCallbackQuery(cb.id, '⏳ Sending to Mailchimp…');

      // Update status in Redis immediately (prevent double-send)
      draft.status = 'approved';
      await redis.set(draftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 });

      // Remove inline buttons from the original preview message
      await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });

      // Call the send-newsletter function
      try {
        const sendRes = await fetch(process.env.MAILCHIMP_SEND_URL!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft_id: draftId }),
        });

        if (!sendRes.ok) {
          throw new Error(`Send function returned ${sendRes.status}`);
        }

        const sendData = await sendRes.json();

        // Mark as sent in Redis
        draft.status = 'sent';
        await redis.set(draftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 });

        await sendMessage(
          chatId,
          `✅ *Newsletter sent!*\n\n` +
          `*Campaign:* ${sendData.campaign_name ?? draftId}\n` +
          `*Mailchimp ID:* ${sendData.campaign_id ?? '—'}\n` +
          `*Recipients:* ${sendData.recipient_count ?? '—'}\n\n` +
          `The ${draft.brief && (draft.brief as { month?: string }).month} issue is on its way to patients. 🎉`
        );
      } catch (err) {
        // Roll back status so James can retry
        draft.status = 'pending';
        await redis.set(draftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 });

        await sendMessage(
          chatId,
          `❌ *Send failed*\n\nError: ${err instanceof Error ? err.message : 'Unknown error'}\n\nThe draft is still pending — tap the button below to retry.`,
          {
            inline_keyboard: [
              [{ text: '🔄 Retry Send', callback_data: `approve:${draftId}` }],
            ],
          }
        );
      }
    }

    // ── EDIT ─────────────────────────────────────────────────────────────────
    else if (action === 'edit') {
      await answerCallbackQuery(cb.id, '✏️ Reply with your edit note');

      // Store a pending edit session in Redis (5 min TTL)
      await redis.set(`edit-session:${chatId}`, draftId, { ex: 60 * 5 });

      await sendMessage(
        chatId,
        `✏️ *Edit request*\n\nReply to this message with your notes and I'll flag them for the next generation.\n\nFor example:\n_"Make the seasonal section shorter, and update the clinic news to mention the new Saturday hours."_\n\nOr type /cancel to go back.`
      );
    }

    // ── REJECT ────────────────────────────────────────────────────────────────
    else if (action === 'reject') {
      draft.status = 'rejected';
      await redis.set(draftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 });

      // Remove inline buttons
      await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });

      await sendMessage(
        chatId,
        `🚫 *Newsletter rejected*\n\nDraft \`${draftId}\` has been rejected and won't be sent.\n\nTo generate a fresh draft, send:\n\`/generate\``,
      );
    }

    return NextResponse.json({ ok: true });
  }

  // ── Handle text replies (edit notes from James) ───────────────────────────
  if (update.message?.text) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const fromId = msg.from.id;
    const text = (msg.text ?? '').trim();

    // Security check
    if (String(fromId) !== String(process.env.TELEGRAM_CHAT_ID)) {
      return NextResponse.json({ ok: true });
    }

    // ── /generate command — manual trigger ───────────────────────────────────
    if (text === '/generate') {
      await sendMessage(chatId, '⏳ Generating newsletter draft… this takes about 30 seconds.');
      try {
        const genRes = await fetch(`${process.env.NEWSLETTER_PREVIEW_URL}/api/generate-newsletter`, {
          method: 'POST',
        });
        if (!genRes.ok) throw new Error(`Generator returned ${genRes.status}`);
        const genData = await genRes.json();
        await sendMessage(chatId, `✅ Draft generated for *${genData.month}* (Issue ${genData.issue}).\n\nCheck the preview message above to approve, edit, or reject.`);
      } catch (err) {
        await sendMessage(chatId, `❌ Generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      return NextResponse.json({ ok: true });
    }

    // ── /cancel command ───────────────────────────────────────────────────────
    if (text === '/cancel') {
      await redis.del(`edit-session:${chatId}`);
      await sendMessage(chatId, '↩️ Cancelled. The draft is still pending.');
      return NextResponse.json({ ok: true });
    }

    // ── /status command — check current draft ─────────────────────────────────
    if (text === '/status') {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const draftId = `newsletter:${yearMonth}`;
      const raw = await redis.get<string>(draftId);
      if (!raw) {
        await sendMessage(chatId, `📭 No draft found for this month yet.\n\nSend /generate to create one.`);
      } else {
        const draft: NewsletterDraft = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const month = (draft.brief as { month?: string })?.month ?? '—';
        const statusEmoji: Record<string, string> = {
          pending: '⏳', approved: '✅', rejected: '🚫', sent: '📨',
        };
        await sendMessage(
          chatId,
          `📋 *Current draft status*\n\n` +
          `*Month:* ${month}\n` +
          `*Status:* ${statusEmoji[draft.status] ?? '?'} ${draft.status}\n` +
          `*Generated:* ${new Date(draft.generated_at).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}\n` +
          `*Draft ID:* \`${draftId}\``
        );
      }
      return NextResponse.json({ ok: true });
    }

    // ── Edit note reply ───────────────────────────────────────────────────────
    const pendingDraftId = await redis.get<string>(`edit-session:${chatId}`);
    if (pendingDraftId) {
      const raw = await redis.get<string>(pendingDraftId);
      if (raw) {
        const draft: NewsletterDraft = typeof raw === 'string' ? JSON.parse(raw) : raw;
        draft.edit_note = text;
        draft.status = 'pending'; // keep pending
        await redis.set(pendingDraftId, JSON.stringify(draft), { ex: 60 * 60 * 24 * 30 });
        await redis.del(`edit-session:${chatId}`);

        await sendMessage(
          chatId,
          `📝 *Edit note saved*\n\n_"${text}"_\n\nSend /generate to regenerate with this note applied, or use the original preview message to approve the existing draft as-is.`
        );
      }
      return NextResponse.json({ ok: true });
    }
  }

  // Unhandled update type — return 200 so Telegram stops retrying
  return NextResponse.json({ ok: true });
}

// ─── GET — Telegram webhook verification ──────────────────────────────────────
// Telegram sends a GET to verify the endpoint is reachable during setup.
export async function GET() {
  return NextResponse.json({ ok: true, service: 'Banora Newsletter Telegram Webhook' });
}
