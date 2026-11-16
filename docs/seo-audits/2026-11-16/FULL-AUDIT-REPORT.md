# SEO audit: banorachiropractic.com.au

**Date:** 16 November 2026 · **Tool:** Claude SEO skill pack v2.6.2, run by hand · **Pages crawled:** 66 of 66 in the sitemap, 0 errors

## Summary

**SEO health score: 82 / 100** (performance not measured, so its 10% weight is left out and the rest rescaled).

The site is in good technical shape. Every page is indexable, has one H1, a self-referencing canonical, a unique title and description, valid structured data, and correct NAP. The two problems that matter are content problems, not technical ones:

1. **12 suburb pages are thin and near-identical** (about 350 words each, 68% the same wording). Google can treat this pattern as doorway pages.
2. **Titles and descriptions are too long on about half the site** (36 titles over 60 characters, 29 descriptions over 160), so Google cuts them off or rewrites them.

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 90 |
| Content quality | 23% | 72 |
| On-page SEO | 20% | 78 |
| Schema / structured data | 10% | 88 |
| Performance (Core Web Vitals) | 10% | not measured |
| AI search readiness | 10% | 85 |
| Images | 5% | 85 |

**Business type:** local service, single brick-and-mortar location (health practice).

**Not covered by this run:** page speed (Google's free PageSpeed quota was exhausted and the local Lighthouse download was blocked), Search Console data (the Google credentials live in Vercel, not on this computer), and the competitor comparison (planned for the monthly run in phase 2).

## Technical SEO: 90

What works:
- `robots.txt` allows all crawlers, blocks only `/thank-you`, `/drafts`, `/api/` and `/forms/`, and declares the sitemap.
- `sitemap.xml` is valid and lists 66 URLs. All 66 return 200.
- HTTP redirects to HTTPS (308). Unknown URLs return a real 404.
- No `noindex` on any sitemap page. All canonicals point to themselves.
- No client-side rendering gap: the pages are static HTML.

Findings:

| Severity | Finding | Fix |
|---|---|---|
| Low | No Content-Security-Policy header | Add a CSP in `vercel.json`. Test carefully: GTM, IconPractice and the chatbot all load third-party scripts. |
| Low | HSTS is `max-age=63072000` with no `includeSubDomains` | Add `includeSubDomains` once every subdomain is HTTPS. |
| Info | No Permissions-Policy header | Optional. |

## Content quality: 72

What works:
- Condition and service pages run 800–1,670 words, with FAQs, related links and AHPRA-style hedging.
- Both team pages give the degree, university and graduation year, with matching `Person` schema.
- 21 blog posts, each with a named practitioner as author.

Findings:

| Severity | Finding | Fix |
|---|---|---|
| High | 12 suburb pages are thin (335–405 words) and 68% identical: Banora Point, Palm Beach, Currumbin, Elanora, Bilinga, Tugun, Kirra, Burleigh Heads, Terranora, Chinderah, Casuarina, Murwillumbah. Only the suburb name, distance and one local line change. | Bring each up to the standard of the Tweed Heads, Coolangatta and Kingscliff pages (775–920 words): real driving route and landmarks, local activities and the problems they bring, a local FAQ. Start with Banora Point, Palm Beach and Terranora, the closest and most searched. |
| Medium | No AHPRA registration number shown on the team pages | Add each practitioner's registration number, with a link to the AHPRA public register. This is a strong trust signal for a health site. |
| Medium | Blog title "How Chiropractic Helps Back Pain" reads as a direct therapeutic claim | Reword to "How Chiropractic May Help Back Pain" to match the AHPRA rules in CLAUDE.md. |
| Low | `/services/` (252 words), `/areas/` (235) and `/conditions/` (440) hub pages are short | Add a short intro paragraph to each. |

## On-page SEO: 78

What works:
- One H1 per page, no duplicate titles or descriptions.
- At least 63 internal links on every page.
- Open Graph and Twitter card tags on every page.

Findings:

| Severity | Finding | Fix |
|---|---|---|
| Medium | 36 of 66 titles are over 60 characters. The 12 worst are over 70, for example `/fees/` (72), `/services/posture-correction/` (76), `/areas/` (76) and `/blog/understanding-back-pain/` (78). | Trim to 50–60 characters. Keep the `| Banora Chiropractic` suffix, but drop the doubled location phrases. Full list in `raw/crawl.json`. |
| Medium | 29 descriptions are over 160 characters (up to 205 on the team pages) | Trim to 150–160, per the SEO rules in CLAUDE.md. |

## Schema / structured data: 88

What works:
- Every page has a full `MedicalClinic` block: address, geo coordinates, hours (Saturday correctly 8:00–11:30), 16 `areaServed` suburbs, `sameAs` links to Facebook, Instagram and Google Maps, and both practitioners.
- Condition pages add `MedicalWebPage` + `FAQPage`. Inner pages carry `BreadcrumbList`. No invalid blocks.

Findings:

| Severity | Finding | Fix |
|---|---|---|
| Low | Blog `author` is a bare `Person` with no link to the team page | Add `"@id": ".../team/dr-paul-cater/#person"` and `url`, so it ties to the existing practitioner schema. |
| Info | Google no longer shows FAQ rich results for clinics | Keep the FAQ markup: AI answer engines still read it. Just don't expect FAQ snippets in Google results. |

## AI search readiness: 85

What works:
- `llms.txt` is live, with NAP, booking link, practitioners and AHPRA wording.
- No AI crawler is blocked.
- Condition pages use question-style headings and FAQs, which answer engines quote easily.

Findings:

| Severity | Finding | Fix |
|---|---|---|
| Medium | The thin suburb pages give AI answers little to quote for "chiropractor near [suburb]" | Same fix as the suburb content finding above. |

## Images: 85

| Severity | Finding | Fix |
|---|---|---|
| Low | The header and footer logos (`logo-horizontal.png`, `logo-square.png`) have empty alt text on every page | Set `alt="Banora Chiropractic"` on the header logo. The footer logo can stay empty if it sits next to the clinic name. |
| Info | Other empty-alt images are correctly marked decorative | None needed. |

## Local SEO

- NAP is consistent: `(07) 5599 2322` appears 474 times in one format, and no page uses a wrong address.
- One informal variant, "2/44 Greenway Drive, THS", is in the booking modal (`BookingModal.astro:56`). It's in a pop-up, so the risk is low, but spelling out "Tweed Heads South" keeps every mention identical.
- Every page links to the Google Business Profile, and the contact page embeds the map.
- The Google Business Profile itself was not audited. The SEO agent's review and post checks cover it once its Google login is renewed.
