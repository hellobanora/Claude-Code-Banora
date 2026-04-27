// api/telegram-get-chat-id.ts
// One-off helper: visit this endpoint after James and Paul have each sent
// a message to the bot on Telegram. It returns the most recent chat IDs
// so you can paste them into the TELEGRAM_ALERT_CHAT_IDS env var.
//
// USAGE:
// 1. Paul and James each open Telegram, search for the bot, and send any message (e.g. "hi")
// 2. Visit: https://www.banorachiropractic.com.au/api/telegram-get-chat-id
// 3. Copy the chat IDs shown, set TELEGRAM_ALERT_CHAT_IDS="id1,id2" in Vercel
// 4. Delete this file (or leave it — it's harmless, just read-only)

import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not set' });
  }

  try {
    const r = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
    );
    const data = (await r.json()) as any;

    if (!data.ok) {
      return res.status(500).json({ error: 'Telegram API error', data });
    }

    // Extract unique chats from updates
    const chatMap = new Map<number, { id: number; name: string; username?: string }>();
    for (const update of data.result || []) {
      const msg = update.message || update.edited_message;
      if (!msg || !msg.chat) continue;
      const chat = msg.chat;
      const name = [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.title || '(unknown)';
      chatMap.set(chat.id, { id: chat.id, name, username: chat.username });
    }

    const chats = [...chatMap.values()];
    const envVarValue = chats.map((c) => c.id).join(',');

    return res.status(200).json({
      instructions:
        'Copy the value below into Vercel env var TELEGRAM_ALERT_CHAT_IDS. If someone is missing, ask them to DM the bot first, then refresh.',
      chats,
      TELEGRAM_ALERT_CHAT_IDS: envVarValue,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'failed' });
  }
}
