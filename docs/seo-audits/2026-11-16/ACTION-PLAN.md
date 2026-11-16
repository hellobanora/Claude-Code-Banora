# Action plan: 16 November 2026 audit

Ordered by likely impact. Every patient-facing change goes through the AHPRA and brand checks in CLAUDE.md before it ships.

## Progress (updated 16 Nov 2026)

- Done: 1 (suburb pages rewritten), 2 and 3 (titles and descriptions shortened; homepage, /areas/tweed-heads/ and the forward-head-posture post kept as-is pending click data), 5 ("May Help" title), 6 (author schema linked), 8 ("THS" spelled out).
- No change needed: 7. The empty-alt logos sit next to the visible clinic name, so empty alt is correct; the header and footer logos already have alt text.
- Skipped by choice: 4 (AHPRA registration numbers).
- Open: 9, 10.

## High (next 1–2 weeks)

1. **Rewrite the 12 thin suburb pages.** Start with Banora Point, Palm Beach and Terranora, then Currumbin, Elanora, Tugun, Kirra, Bilinga, Burleigh Heads, Chinderah, Casuarina and Murwillumbah. Aim for 700+ words of genuinely local content each, matching the Tweed Heads, Coolangatta and Kingscliff pages. Files: `banora-website/src/data/areas.ts`.

## Medium (this month)

2. **Shorten the 36 long titles** to 50–60 characters, worst first (the 12 over 70). Files: page front-matter and `src/data/*.ts`.
3. **Shorten the 29 long meta descriptions** to 150–160 characters.
4. **Add AHPRA registration numbers** with register links to both team pages.
5. **Reword the blog title "How Chiropractic Helps Back Pain"** to "May Help", per the AHPRA rules.

## Low (backlog)

6. Link blog `author` schema to the practitioners' existing `Person` `@id`s.
7. Give the header logo `alt="Banora Chiropractic"`.
8. Change "THS" to "Tweed Heads South" in the booking modal (flag first: booking code).
9. Add short intros to the `/services/`, `/areas/` and `/conditions/` hub pages.
10. Add `includeSubDomains` to HSTS, and plan a Content-Security-Policy that allows GTM, IconPractice and the chatbot (flag first: tracking and booking).

## To measure next time

- Core Web Vitals: needs a Google API key for PageSpeed/CrUX, or a local Lighthouse run.
- Search Console queries, impressions and CTR: the 28- and 90-day comparison in the doc's phase 2 workflow.
- Competitor comparison for the top 3–5 clinics around Tweed Heads.
