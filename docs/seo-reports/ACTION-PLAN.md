# SEO ranking-report action plan

Standing list maintained by the weekly SEO ranking and AI-visibility report routine (separate from `docs/seo-agent/TODO.md`, which belongs to the other routine). Items under Done were implemented and build-verified by this routine only.

## Open

1. **Fix wrong details on third-party listings (Fresha, MapQuest, Local Business Guide, Localsearch)** · High · ~45 min · since 2026-11-24 · Who: James or Sarah
   - Why: 24 Nov searches showed Banora's address and name inconsistent across directories (MapQuest shows two Banora entries, one with a different practitioner name and one marked closed; Localsearch shows only ~2 reviews). Mixed details can send AI assistants and map apps to the wrong clinic. Overlaps with the directory item in `docs/seo-agent/TODO.md`; do both in one sitting.

2. **Get onto "best chiropractors" lists and verify the Healthdirect profile** · High · ~1 hr · since 2026-11-24 · Who: James
   - Why: no ThreeBestRated-style page for Tweed Heads was found. For "chiropractor tweed heads south" Healthdirect showed Advanced Health, not Banora. Best-of lists and Healthdirect are common AI-assistant sources.

3. **Keep adding Google reviews** · High · ~5 min/day · since 2026-11-24 · Who: Sarah
   - Why: site shows 75 at 4.9 (reviews.ts, 23 Nov; live figure not verified). Last known nearest competitor: 101. No incentives, no on-site quotes (AHPRA).

4. **Enable Search Console data for this routine** · Medium · ~10 min · since 2026-11-24 · Who: James
   - Why: on 24 Nov `https://banorachiropractic.com.au/api/seo-data/` returned an HTTP error from this sandbox (secret was set), so every ranking is a rough web-search estimate. Check the secret value and that the host is allowed in this routine's environment.

5. **Re-test rankings for the 16 Nov suburb rewrites and retitled pages** · Medium · ~30 min · since 2026-11-24 · Who: Claude Code next run on or after 2026-12-14
   - Why: Kingscliff, Coolangatta, Banora Point and Terranora searches showed only directory pages, not Banora's suburb pages. Those pages changed 16 Nov; wait ~4 weeks before adding FAQs or links.

6. **Add a Chiropractor/MedicalBusiness type alongside MedicalClinic in schema, and check pregnancy/kids wording on service pages** · Low · ~30 min · since 2026-11-24 · Who: Claude Code next run (after 2026-12-14; files changed 16 Nov)
   - Why: "pregnancy chiropractor" and "kids chiropractor tweed heads" searches surfaced Nurture and Tweed Coast Chiropractic, not Banora. Hedged, AHPRA-safe copy only.

7. **Approve security-header change** · Low · see `docs/seo-agent/TODO.md` · Who: James (tracked by the other routine).

## Done

- [x] **Point the llms.txt "Book online" link at the site's /book/ page** · 2026-11-24 · `banora-website/src/pages/llms.txt.ts`: "Book online" changed from the raw IconPractice URL to `https://banorachiropractic.com.au/book/`. `npm run build` and sitemap check passed; built llms.txt verified. (`/book/` still opens the unchanged IconPractice flow.)
