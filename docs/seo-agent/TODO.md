# SEO to-do list (for James)

Things that help rankings but need a person: listings on other sites, logins the routine doesn't have, and decisions only you can make. Ordered by impact, so the top item is the best use of your time.

**To tick something off:** change `- [ ]` to `- [x]` (edit this file on GitHub, or ask Claude). The weekly routine moves ticked items to "Done" and won't re-add them for 3 weeks, so listings have time to update. Unticked items carry over every week.

## Open

- [ ] **Clean up directory listings so every one says exactly "Banora Chiropractic"** · High · ~45 min · since 19 Oct 2026
  - Why: matching name, address and phone everywhere is a core local-ranking and AI-citation signal. A different business, "Banora-Tweed Family Chiropractic Centre", is still indexed, and AI tools can blend the two.
  - Steps:
    1. Check each of these for your own listing: Yelp, Localsearch, True Local, Healthshare, HealthEngine/Hotdoc, Word of Mouth, and the Chiropractic Australia / ACA "find a chiropractor" profile.
    2. Each should read exactly: Banora Chiropractic · 2/44 Greenway Drive, Tweed Heads South NSW 2486 · (07) 5599 2322 · banorachiropractic.com.au. Fix any that differ.
    3. Word of Mouth lists you under Banora Point: ask them to change the suburb to Tweed Heads South.
    4. On Yelp, leave the separate Banora-Tweed Family Chiropractic listing alone. Just make sure your own exists and is complete, so the two aren't merged.

- [ ] **Keep the Google review routine going (Sarah)** · Medium · ~5 min a day · since 19 Oct 2026
  - Why: reviews are a major map-pack factor. The nearest competitor had 101 to your 71 (19 Oct).
  - Steps:
    1. Send a same-day SMS to every patient, not only the happy ones, with the review link. Aim for about 10 new reviews a month.
    2. AHPRA: offer no incentive, and don't repost, quote or display reviews on the site, socials or ads.

- [ ] **Decide whether to keep the Google rating badge on the homepage** · Medium · ~5 min · since 19 Oct 2026
  - Why: the badge shows your star rating and links to reviews. The SEO report flagged that it could be read as using testimonials in advertising (AHPRA). This is your call; the routine won't touch it.
  - Steps: decide keep or remove, then tell Claude to make the change.

- [ ] **Move the Google sign-in for the SEO agent out of "Testing"** · Medium · ~15 min · since 10 Nov 2026
  - Why: in Testing mode the sign-in expires if the agent misses a week, which stops review checks and Search Console reports until someone re-runs the setup.
  - Steps: Google Cloud Console → APIs & Services → OAuth consent screen → Publish app. Google may ask for verification of the `business.manage` scope; follow its prompts. See `banora-website/docs/seo-agent-setup.md`.

- [ ] **Approve the security-header change (HSTS subdomains + Content-Security-Policy)** · Low · ~10 min · since 16 Nov 2026
  - Why: audit item 10. It touches tracking (GTM), booking (IconPractice) and the chatbot, so it needs your OK and a careful test.
  - Steps: reply "go ahead" to Claude and it will plan and test it on a preview deployment first.

## Done

(Ticked items move here with the date, newest first.)

- [x] **Get listed on Healthdirect (National Health Services Directory)** · done 20 Nov 2026 (added 19 Oct). Listings can take a few weeks to appear; the monthly audit should check that it ranks for "chiropractor tweed heads south".
