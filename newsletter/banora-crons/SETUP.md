# Banora Chiropractic — CRON Monitoring

Two scheduled Vercel serverless functions that monitor the Banora site and notify Paul & James via Telegram.

## What's included

| File | Schedule | Behaviour |
|---|---|---|
| `api/cron/daily-site-check.ts` | **7am AEST daily** | Full site check — homepage, all internal links, images, booking system, chatbot API. **Always** sends a Telegram summary (pass or fail). |
| `api/cron/hourly-booking-check.ts` | **Every hour, on the hour** | Checks IconPractice booking URL + chatbot endpoint. **Only** alerts via Telegram if something is broken. Silent when healthy. |
| `api/telegram-get-chat-id.ts` | One-off helper | Fetches Telegram chat IDs so you can wire up who gets alerts. |
| `lib/telegram.ts` | — | Shared Telegram helper. |
| `vercel.json` | — | Cron schedule config. |

---

## Setup — step by step

### 1. Drop the files into the repo

Extract the zip into the root of `hellobanora/Claude-Code-Banora` so the structure looks like:

```
Claude-Code-Banora/
├── api/
│   ├── cron/
│   │   ├── daily-site-check.ts
│   │   └── hourly-booking-check.ts
│   └── telegram-get-chat-id.ts
├── lib/
│   └── telegram.ts
├── vercel.json    ← merge with your existing vercel.json if you have one
└── ... (rest of your Astro site)
```

**If you already have a `vercel.json`**, open both files side-by-side and copy the `"crons": [...]` array into your existing file (don't overwrite anything else).

### 2. Both James and Paul: DM the Telegram bot

Telegram can't message phone numbers directly — it needs a **chat ID** per person, which only gets created after each person sends a message to the bot first.

**Paul** and **James** each need to:

1. Open Telegram
2. Search for the Banora bot (same bot used for the newsletter approval flow)
3. Send any message — `hi` is fine
4. That's it — do this **once**

### 3. Grab your chat IDs

After both of you have messaged the bot, deploy the site once so the helper endpoint is live, then visit:

```
https://www.banorachiropractic.com.au/api/telegram-get-chat-id
```

You'll see a JSON response like:

```json
{
  "chats": [
    { "id": 123456789, "name": "Paul Cater", "username": "paullyc" },
    { "id": 987654321, "name": "James Shipway" }
  ],
  "TELEGRAM_ALERT_CHAT_IDS": "123456789,987654321"
}
```

Copy the `TELEGRAM_ALERT_CHAT_IDS` value — you'll paste it in next step.

### 4. Set environment variables in Vercel

Go to your Vercel project → **Settings → Environment Variables** and add:

| Variable | Value | Notes |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | (your existing bot token) | Same one used by the newsletter system |
| `TELEGRAM_ALERT_CHAT_IDS` | `123456789,987654321` | Comma-separated — use the value from step 3 |
| `SITE_URL` | `https://www.banorachiropractic.com.au` | |
| `BOOKING_URL` | `https://iconpractice.com/ob/7138/banorachiropractic/245386/2` | |
| `CHATBOT_ENDPOINT` | `https://www.banorachiropractic.com.au/api/chat` | Adjust if your chatbot lives at a different path |
| `CRON_SECRET` | (generate a random string) | Optional but recommended — protects against random pings |

Apply to **Production, Preview, and Development**.

### 5. Deploy

```bash
git add .
git commit -m "Add daily + hourly health check crons with Telegram alerts"
git push
```

Vercel will auto-deploy. Once deployed, go to **Vercel dashboard → your project → Settings → Cron Jobs** and confirm both jobs are listed.

### 6. Test before waiting for the schedule

You can trigger both endpoints manually to confirm they work:

```bash
# Daily check — expect a Telegram message to both phones within ~30 sec
curl https://www.banorachiropractic.com.au/api/cron/daily-site-check

# Hourly check — only sends a message if something is broken
curl https://www.banorachiropractic.com.au/api/cron/hourly-booking-check
```

If you set `CRON_SECRET`, include it:

```bash
curl -H "Authorization: Bearer YOUR_SECRET" https://www.banorachiropractic.com.au/api/cron/daily-site-check
```

---

## Timing notes

- Vercel cron schedules are in **UTC**. The config file runs the daily check at **21:00 UTC = 7:00am AEST**.
- AEST is UTC+10 year-round (Queensland doesn't do daylight saving). If you want the cron to follow NSW daylight saving, you'd need to adjust the schedule in summer. Since the clinic is right on the NSW/QLD border and both clinics straddle it, **7am QLD time** is the simpler choice — which is what this is set to.
- Hourly check fires on the hour UTC, so you'll get 24 checks per day.

## What counts as "broken"

**Hourly check — triggers an alert when:**
- Booking URL returns non-2xx status
- Booking URL returns an empty/tiny response body
- Booking URL times out (15 sec)
- Chatbot endpoint returns non-2xx status
- Chatbot endpoint returns an empty body
- Chatbot endpoint times out

**Daily check — always reports, with pass/fail per category:**
- Homepage HTTP status
- All internal links (crawled from homepage HTML)
- All images on homepage
- External links (reported but don't count as failure — external sites go down constantly)
- Booking system
- Chatbot API

---

## Troubleshooting

**"I got no Telegram message from the daily cron"**
- Check Vercel → project → Logs for `/api/cron/daily-site-check`
- Confirm `TELEGRAM_ALERT_CHAT_IDS` is set and has both IDs comma-separated
- Confirm both Paul and James have sent **at least one** message to the bot

**"Chatbot health check fails but the bot works in the browser"**
- Your bot endpoint may not accept POST with `{healthcheck: true}` — adjust the check in `hourly-booking-check.ts` to match what your bot actually expects, or add an `if (body.healthcheck) return res.status(200).json({ok: true})` short-circuit to the top of your chatbot handler

**"Booking system shows as broken"**
- Visit `BOOKING_URL` directly in a browser — if it loads fine but we're flagging it, IconPractice may be doing bot detection. In that case, add a real `User-Agent` header in `hourly-booking-check.ts` to mimic a browser.

---

## Security note

The Telegram bot token was previously shared in chat. This is the same bot used for the newsletter approval flow — if you ever rotate it (recommended eventually), remember to update `TELEGRAM_BOT_TOKEN` in Vercel in both the Banora and any other Vercel projects that use it.
