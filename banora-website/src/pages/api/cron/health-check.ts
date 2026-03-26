// Vercel cron endpoint — runs daily at 6am AEST
// Checks website, booking system, and chatbot health
// Sends email + Telegram alerts on failure

import type { APIRoute } from "astro";
import { runAllChecks } from "../../../lib/health-checks";
import { sendAlerts } from "../../../lib/alerts";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Verify the request is from Vercel Cron (production) or has the right header
  const authHeader = request.headers.get("authorization");
  const cronSecret = import.meta.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const siteUrl = import.meta.env.SITE_URL || "https://banorachiropractic.com.au";

  console.log(`[Health Check] Starting at ${new Date().toISOString()}`);

  const results = await runAllChecks(siteUrl);
  const failures = results.filter((r) => r.status === "fail");
  const allPassed = failures.length === 0;

  // Log all results
  for (const r of results) {
    const icon = r.status === "pass" ? "✅" : "❌";
    console.log(
      `[Health Check] ${icon} ${r.name}: ${r.status} (${r.responseTime}ms)${r.error ? ` — ${r.error}` : ""}`
    );
  }

  // Send alerts if any check failed
  let alertResults = { email: false, telegram: false };
  if (!allPassed) {
    console.log(
      `[Health Check] ${failures.length} check(s) failed — sending alerts`
    );

    alertResults = await sendAlerts(failures, {
      resendApiKey: import.meta.env.RESEND_API_KEY,
      alertEmail: import.meta.env.ALERT_EMAIL,
      telegramBotToken: import.meta.env.TELEGRAM_BOT_TOKEN,
      telegramChatId: import.meta.env.TELEGRAM_CHAT_ID,
    });

    console.log(
      `[Health Check] Alert results — Email: ${alertResults.email ? "sent" : "failed"}, Telegram: ${alertResults.telegram ? "sent" : "failed"}`
    );
  }

  const response = {
    timestamp: new Date().toISOString(),
    status: allPassed ? "healthy" : "degraded",
    checks: results,
    alerts: allPassed
      ? null
      : {
          triggered: true,
          email: alertResults.email,
          telegram: alertResults.telegram,
        },
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: allPassed ? 200 : 503,
    headers: { "Content-Type": "application/json" },
  });
};
