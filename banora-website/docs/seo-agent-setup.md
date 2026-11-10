# Banora SEO Agent — Setup

Weekly automation: pulls Search Console performance for the tracked keywords, checks Google Business Profile reviews, auto-replies to low-risk ones (4-5 stars, short, no flagged keywords), drafts the rest for manual approval, and emails a summary.

## 1. Google Cloud Console (already done)

APIs enabled, OAuth consent screen configured (External, Testing mode, scopes `webmasters.readonly` + `business.manage`), Desktop OAuth client downloaded. Nothing further needed here for now.

**Testing-mode limit:** a refresh token issued while the consent screen is in Testing mode expires if unused for 7 days. The weekly cron keeps it alive on its own; if the agent is ever paused for longer than a week, re-run the setup script below. Moving the consent screen to Production removes this limit but requires Google's verification review for sensitive scopes — a future follow-up, not needed now.

## 2. Get a refresh token + your GBP account/location IDs

Run once, locally:

```bash
node scripts/gbp-oauth-setup.mjs "<path to the downloaded client_secret_*.json>"
```

Follow the printed URL in a browser, approve access, then copy every printed `KEY=value` line. The same values are also saved to `scripts/.gbp-oauth-output.json` (gitignored) — delete that file once you've copied the values into Vercel.

## 3. Set Vercel environment variables

Vercel dashboard → Project → Settings → Environment Variables → add every var listed in `.env.example`'s "New — Banora SEO agent" section. Confirm the existing vars (`RESEND_API_KEY`, `CRON_SECRET`, etc.) are already set too — the new routes reuse them. Set for Production; be careful testing against Preview, since a correct GBP token posts real, live replies to the real listing regardless of which Vercel environment calls it.

## 4. Verify

```bash
curl -i -H "Authorization: Bearer <CRON_SECRET>" https://banorachiropractic.com.au/api/cron/seo-agent
```

Should return `200` with a JSON summary. A missing/incorrect header should return `401`.

## 5. Weekly chat check-in

The `banora-seo-agent` Claude Code scheduled task fetches the above result and walks you through any reviews that need your approval before anything gets posted. See `C:\Users\User\.claude\scheduled-tasks\banora-seo-agent\SKILL.md`.

## 6. Adjusting the rules later

- Low-risk thresholds and keyword list: `src/lib/seo-agent/review-classifier.ts`
- Reply templates (both auto-reply and draft): same file
- Tracked Search Console queries: `src/lib/seo-agent/search-console.ts`
