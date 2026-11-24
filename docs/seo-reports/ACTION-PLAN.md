# SEO ranking-report action plan

Standing list maintained by the weekly SEO ranking and AI-visibility report routine (separate from `docs/seo-agent/TODO.md`, which belongs to the other routine). Items marked Done were implemented and build-verified by this routine only.

## Open

1. **Fix wrong details on third-party listings (Fresha, MapQuest, Local Business Guide)** · High · ~45 min · since 2026-11-24 · Owner: James or Sarah
   - Why: web search on 24 Nov showed one listing with the address as "244 Greenway Drive", another as "26 Minjungbal Drive" (that is Advanced Health's street), and a directory naming Dr Scott Barbary as Banora's principal chiropractor (he practises at Advanced Health). Mixed details can make AI assistants and map apps send people to the wrong clinic. Overlaps with the open directory item in `docs/seo-agent/TODO.md`; do both in one sitting.

2. **Get Banora onto "best chiropractors" lists and check Localsearch / Healthdirect profiles** · High · ~1 hr · since 2026-11-24 · Owner: James
   - Why: no ThreeBestRated or similar best-of page for Tweed Heads was found in search on 24 Nov, and Banora did not appear as a Healthdirect result for "chiropractor tweed heads south" (it listed Advanced Health). Best-of lists and Healthdirect are common sources AI assistants cite.

3. **Keep adding Google reviews (Sarah)** · High · ~5 min/day · since 2026-11-24 · Owner: Sarah
   - Why: the site shows 75 reviews at 4.9 (reviews.ts, checked 23 Nov); the other routine's note from 19 Oct had the nearest competitor on 101. No AHPRA-risky incentives or on-site quotes.

4. **Enable Search Console data for this routine** · Medium · ~10 min · since 2026-11-24 · Owner: James
   - Why: this run had no `SEO_DATA_SECRET` and the proxy blocked banorachiropractic.com.au, so every ranking is a rough web-search estimate. Set the secret and allow that host in this routine's environment for real clicks, impressions and positions.

5. **Point the llms.txt "Book online" link at the site's /book/ page** · Low · ~10 min · since 2026-11-24 · Owner: Claude Code next run
   - Why: llms.txt currently lists the raw IconPractice URL; the AI-visibility checklist expects it to match /book/. Check first that `src/pages/llms.txt.ts` and `clinic.ts` have not been touched by either routine in the last 4 weeks.

6. **Re-check ranking of the 16 Nov suburb rewrites and retitled pages after 14 Dec** · Medium · ~30 min · since 2026-11-24 · Owner: Claude Code next run (on or after 2026-12-14)
   - Why: Kingscliff, Coolangatta, Terranora and Banora Point searches on 24 Nov showed only directory pages in the results, not Banora's suburb pages. The 33 titles and 12 suburb pages were changed 16 Nov, so a fair re-test needs about 4 weeks. Only then consider FAQ or internal-link additions.

7. **Approve security-header change** · Low · see `docs/seo-agent/TODO.md` · Owner: James (tracked by the other routine; not duplicated here).

## Done

- None yet. No safe item qualified this run (2026-11-24): every page's title/meta/content was touched by one of the routines in the last 4 weeks (16 Nov retitling of 33 titles and 12 suburb pages, 10 Nov sciatica/back pain edits), so none passed the 4-week rule.
