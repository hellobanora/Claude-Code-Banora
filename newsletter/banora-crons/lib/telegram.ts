// lib/telegram.ts
// Shared Telegram messaging helper for CRON alerts

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

/**
 * TELEGRAM_ALERT_CHAT_IDS is a comma-separated list of chat IDs.
 * Example: "123456789,987654321"
 *
 * Each chiropractor (James & Paul) must DM the bot once so we can
 * capture their chat ID — see /api/telegram-get-chat-id.ts helper.
 */
const TELEGRAM_ALERT_CHAT_IDS = (process.env.TELEGRAM_ALERT_CHAT_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export async function sendTelegramAlert(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not set');
    return;
  }
  if (TELEGRAM_ALERT_CHAT_IDS.length === 0) {
    console.error('TELEGRAM_ALERT_CHAT_IDS is empty');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Send to each recipient in parallel
  await Promise.allSettled(
    TELEGRAM_ALERT_CHAT_IDS.map((chatId) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          console.error(`Telegram send failed for ${chatId}: ${errText}`);
        }
      })
    )
  );
}

/**
 * Format a timestamp in AEST for alert messages.
 */
export function aestTimestamp(): string {
  return new Date().toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
