// Alert system for Banora Chiropractic health checks
// Sends email via Resend and messages via Telegram Bot API

import type { HealthCheckResult } from "./health-checks";

function formatAlertMessage(failures: HealthCheckResult[]): string {
  const time = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
  });

  const lines = failures.map(
    (f) =>
      `- ${f.name}: FAILED (${f.error ?? "unknown error"}, response time: ${f.responseTime}ms)`
  );

  return [
    `⚠️ Banora Chiropractic — Health Check Alert`,
    ``,
    `Time: ${time} AEST`,
    ``,
    `The following checks failed:`,
    ...lines,
    ``,
    `Action required: investigate and restore service.`,
  ].join("\n");
}

export async function sendEmailAlert(
  failures: HealthCheckResult[],
  resendApiKey: string,
  alertEmail: string
): Promise<boolean> {
  const message = formatAlertMessage(failures);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Banora Site Monitor <onboarding@resend.dev>",
        to: [alertEmail],
        subject: `🚨 Health Check Failed — Banora Chiropractic`,
        text: message,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to send email alert:", err);
    return false;
  }
}

export async function sendTelegramAlert(
  failures: HealthCheckResult[],
  botToken: string,
  chatId: string
): Promise<boolean> {
  const message = formatAlertMessage(failures);

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to send Telegram alert:", err);
    return false;
  }
}

export async function sendAlerts(
  failures: HealthCheckResult[],
  env: {
    resendApiKey?: string;
    alertEmail?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
  }
): Promise<{ email: boolean; telegram: boolean }> {
  const results = { email: false, telegram: false };

  if (env.resendApiKey && env.alertEmail) {
    results.email = await sendEmailAlert(
      failures,
      env.resendApiKey,
      env.alertEmail
    );
  } else {
    console.warn("Email alert skipped: missing RESEND_API_KEY or ALERT_EMAIL");
  }

  if (env.telegramBotToken && env.telegramChatId) {
    results.telegram = await sendTelegramAlert(
      failures,
      env.telegramBotToken,
      env.telegramChatId
    );
  } else {
    console.warn(
      "Telegram alert skipped: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID"
    );
  }

  return results;
}
