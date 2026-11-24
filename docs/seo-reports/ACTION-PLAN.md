# SEO ranking-report action plan

Standing list kept by the weekly SEO ranking and AI-visibility report routine (separate from `docs/seo-agent/TODO.md`, which belongs to the other routine). Done items were implemented and build-verified by this routine only. Three earlier unmerged same-day branches (`...2026-11-24`, `-2`, `-3`) hold similar lists; this file supersedes them if merged.

## Open

1. **Fix directory listings so all say "Banora Chiropractic · 2/44 Greenway Drive, Tweed Heads South NSW 2486 · (07) 5599 2322"** · High · ~45 min · since 2026-11-24 · Who: James or Sarah
   - Why: 24 Nov searches show MapQuest with two Banora entries (one under another practitioner's name), Fresha, Local Business Guide and Localsearch with varying details. Another clinic at 26 Minjungbal Dr appears in results labelled "Banora Chiropractic". Mixed details can send AI assistants to the wrong clinic. Overlaps `docs/seo-agent/TODO.md`; do both together.

2. **Get onto "best chiropractors" lists (Localsearch Tweed Heads South page, ThreeBestRated) and check the Healthdirect profile** · High · ~1 hr · since 2026-11-24 · Who: James
   - Why: no ThreeBestRated page for Tweed Heads found; Localsearch "best" pages list Nurture and others, not Banora. Healthdirect results for "chiropractor tweed heads" show Advanced Health and others, not Banora.

3. **Keep asking every patient for a Google review** · High · ~5 min/day · since 2026-11-24 · Who: Sarah
   - Why: Google shows 75 at 4.9 (Search Console `reviewStats`, 24 Nov). Last known nearest competitor: 101 (19 Oct). No incentives, no on-site quotes (AHPRA).

4. **Improve head-term ranking: "chiropractor tweed heads" averages position 21.7 (253 impressions, 4 clicks), homepage ~12.9, /areas/tweed-heads-south/ ~10.9** · High · ~1 hr · since 2026-11-24 · Who: Claude Code next run on/after 2026-12-14 (homepage title is protected; areas page edited 16 Nov)
   - Why: both pages sit just off page one. Re-measure after the 16 Nov retitling settles, then add a short local section/FAQ and internal links to /areas/tweed-heads-south/ from service pages.

5. **Pregnancy and kids searches: ~85 impressions each for "chiropractic care during pregnancy" (pos 9.7) and "chiropractic care for kids" (pos 14.6), 0 clicks** · Medium · ~45 min · since 2026-11-24 · Who: Claude Code next run on/after 2026-12-14 (service/blog pages changed 16 Nov)
   - Why: queries already rank near page one; sharper hedged, AHPRA-safe FAQ answers on the pregnancy and paediatric pages may lift CTR. Competitors Nurture and Tweed Coast Chiropractic own the local versions.

6. **Sciatica post search CTR: 315 clicks on 29,790 impressions (1.1%), position 8.2** · Medium · ~30 min · since 2026-11-24 · Who: Claude Code next run on/after 2026-12-14 (title/meta edited 10 and 16 Nov)
   - Why: by far the biggest traffic page, but 1.1% CTR. The internal-link half of this item is done (see Done); the title/meta half waits for the 14 Dec re-check.

7. **Re-test Kingscliff (pos 17.3), Murwillumbah (pos 28.8) and Coolangatta (7.3) suburb pages** · Medium · ~30 min · since 2026-11-24 · Who: Claude Code next run on/after 2026-12-14
   - Why: suburb pages were rewritten 16 Nov; wait ~4 weeks before changing again.

8. **Approve the security-header change** · Low · see `docs/seo-agent/TODO.md` · Who: James (tracked by the other routine).

## Done

- [x] **Send sciatica-post readers to local pages** · 2026-11-24, by hand (not this routine) · `banora-website/src/data/blog.ts`, body only: early link to /conditions/sciatica/ in the intro; closing CTA changed from /about/ to /book/ plus phone. Title and meta untouched. Logged in `docs/seo-agent/CHANGELOG.md`.
- [x] **Point the llms.txt "Book online" link at the site's /book/ page** · 2026-11-24 · `banora-website/src/pages/llms.txt.ts`: "Book online" changed from the raw IconPractice URL (`clinic.bookingUrl`) to `https://banorachiropractic.com.au/book/`. `npm run build` and sitemap check passed (66 URLs); built llms.txt line verified. (`/book/` still opens the unchanged IconPractice flow.)
