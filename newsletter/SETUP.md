# Banora Newsletter Automation — Setup Checklist

## 1. Environment Variables (add to Vercel project settings)

```
ANTHROPIC_API_KEY=sk-ant-...
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
TELEGRAM_BOT_TOKEN=...          # from @BotFather
TELEGRAM_CHAT_ID=...            # James's personal chat ID
MAILCHIMP_API_KEY=...           # Mailchimp → Account → Extras → API Keys
MAILCHIMP_AUDIENCE_ID=...       # Mailchimp → Audience → Settings → Audience ID
MAILCHIMP_FROM_NAME=Banora Chiropractic
MAILCHIMP_FROM_EMAIL=info@banorachiropractic.com.au
NEWSLETTER_PREVIEW_URL=https://your-vercel-deployment.vercel.app
MAILCHIMP_SEND_URL=https://your-vercel-deployment.vercel.app/api/send-newsletter
```

## 2. File placement in repo

```
api/
  generate-newsletter.ts    ← Vercel cron + Claude API call
  telegram-webhook.ts       ← Approve / Edit / Reject handler
  send-newsletter.ts        ← Mailchimp campaign create & send  (next build)
  preview.ts                ← Newsletter preview page           (next build)
lib/
  newsletter/
    system-prompt.ts
    content-calendar.ts
vercel.json                 ← Cron schedule
```

## 3. Register Telegram webhook (one-time, run in browser)

Replace TOKEN and DOMAIN with your values:

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<DOMAIN>/api/telegram-webhook
```

Expected response: `{"ok":true,"result":true,"description":"Webhook was set"}`

## 4. Get James's Telegram chat ID

1. James sends any message to the bot
2. Visit: https://api.telegram.org/bot<TOKEN>/getUpdates
3. Find `message.from.id` in the response — that's TELEGRAM_CHAT_ID

## 5. Upload newsletter images to Mailchimp Content Studio

Before the first send, upload these 7 images per issue:
1. hero-seasonal     — 600×280px seasonal lifestyle photo
2. tips-sidebar      — 240×240px person stretching outdoors
3. education-diagram — 520×300px medical illustration
4. product-photo     — 196×256px Metagenics product
5. team-photo        — 200×200px Dr James & Dr Paul
6. clinic-banner     — 520×220px clinic exterior or treatment room
7. logo              — 160×40px PNG transparent background

Items 5, 6, 7 are evergreen — upload once, reuse every month.
Items 1, 3, 4 change monthly.

## 6. Telegram commands James can use

| Command     | What it does                                 |
|-------------|----------------------------------------------|
| /generate   | Manually trigger a newsletter draft          |
| /status     | Check current month's draft status           |
| /cancel     | Cancel a pending edit note                   |
| (reply)     | Send edit notes after tapping Edit button    |

## 7. Monthly flow (once automation is live)

1. Vercel cron fires last day of month at 8am AEST
2. Claude generates content → stored in Redis
3. James gets Telegram message with preview link + buttons
4. James taps ✅ Approve
5. Newsletter sends to full patient list via Mailchimp
6. James gets confirmation with recipient count

Total time for James: ~2 minutes per month to review and approve.
