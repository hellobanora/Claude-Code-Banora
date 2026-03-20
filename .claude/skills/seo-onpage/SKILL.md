---
name: seo-onpage
description: On-page SEO implementation skill for Banora Chiropractic website. Use this skill whenever creating or editing any page, writing meta tags, adding schema markup, building location/suburb pages, optimising headings, or working on internal linking. Trigger this for ANY content that will appear on the website — every page needs SEO consideration, not just pages explicitly about SEO.
---

# On-Page SEO Skill — Banora Chiropractic

## Core Principle

Every page on this site exists to rank for local search queries in the Tweed Heads / Southern Gold Coast region. SEO is not an afterthought — it drives the entire content and page structure.

## Target Keywords by Page Type

### Homepage
- Primary: "chiropractor tweed heads", "chiropractor tweed heads south"
- Secondary: "chiropractic clinic near me", "back pain tweed heads"

### Service Pages
- Pattern: "{service} tweed heads south", "{service} chiropractor gold coast"
- Example: "posture correction tweed heads south", "sports chiropractor gold coast"

### Condition Pages
- Pattern: "{condition} treatment tweed heads", "{condition} chiropractor near me"
- Example: "sciatica treatment tweed heads", "neck pain chiropractor near me"

### Location/Suburb Pages
- Pattern: "chiropractor {suburb}", "chiropractic {suburb}"
- Example: "chiropractor banora point", "chiropractic coolangatta"

## Meta Tag Formulas

### Title Tag (50-60 characters)

- **Homepage**: `Chiropractor Tweed Heads South | Banora Chiropractic`
- **Service**: `{Service Name} | Banora Chiropractic Tweed Heads South`
- **Condition**: `{Condition} Treatment Tweed Heads | Banora Chiropractic`
- **Area**: `Chiropractor {Suburb} | Banora Chiropractic Near You`

### Meta Description (150-160 characters)

Include: primary keyword + location + benefit + call to action.
Example: "Expert chiropractic care in Tweed Heads South. Gentle, effective treatment for back pain, neck pain & headaches. Book your appointment today."

## Schema Markup (JSON-LD)

Every page must include LocalBusiness schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Chiropractor",
  "name": "Banora Chiropractic",
  "image": "[clinic-image-url]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2/44 Greenway Drive",
    "addressLocality": "Tweed Heads South",
    "addressRegion": "NSW",
    "postalCode": "2486",
    "addressCountry": "AU"
  },
  "telephone": "+61755992322",
  "url": "https://banorachiropractic.com.au",
  "openingHoursSpecification": [],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -28.1894,
    "longitude": 153.5363
  },
  "areaServed": [
    "Tweed Heads South", "Tweed Heads", "Banora Point", "Coolangatta",
    "Palm Beach", "Currumbin", "Elanora", "Bilinga", "Tugun",
    "Kirra", "Burleigh Heads", "Terranora", "Chinderah", "Kingscliff"
  ]
}
```

Service pages add `Service` schema. Condition pages add `MedicalCondition` schema where appropriate.

## Heading Hierarchy

Every page follows this structure:

- One `<h1>` — contains primary keyword naturally
- `<h2>` — major sections (2-5 per page)
- `<h3>` — subsections within h2 blocks
- Never skip heading levels (no h1 → h3)

## Internal Linking Rules

1. Every service page links to 2-3 related condition pages
2. Every condition page links to relevant service pages
3. Every location page links to the homepage, services, and conditions
4. Footer contains links to all major sections
5. Use descriptive anchor text (not "click here") — include keywords naturally
6. Breadcrumbs on all inner pages with BreadcrumbList schema

## NAP Consistency (Critical)

ALWAYS use this exact format — never deviate:

- **Name**: Banora Chiropractic
- **Address**: 2/44 Greenway Drive, Tweed Heads South NSW 2486
- **Phone**: (07) 5599 2322

## Location Page Template

Each suburb page must include:

1. H1: "Chiropractor in {Suburb} — Banora Chiropractic"
2. Opening paragraph: mention suburb name, distance/proximity to clinic, and primary service
3. Why patients from {suburb} choose us
4. Services available (link to service pages)
5. Conditions we treat (link to condition pages)
6. How to get here from {suburb} (driving directions, landmarks)
7. Embedded Google Map
8. Booking CTA
9. Full NAP details
10. LocalBusiness + areaServed schema

## Image SEO

- File names: descriptive with hyphens (`chiropractor-tweed-heads-adjustment.jpg`)
- Alt text: descriptive, include keyword where natural (`Dr James performing spinal adjustment at Banora Chiropractic`)
- Use Astro's `<Image>` from `astro:assets` for automatic WebP conversion, or native `<img>` with `loading="lazy"`
- Always include `width` and `height` to prevent layout shift

## Page Speed SEO

- Astro ships zero JavaScript by default — keep it that way for content pages
- Use Astro's `<Image>` component or optimised native `<img>` tags
- Self-host fonts as WOFF2 and preload critical fonts
- Use `getStaticPaths()` to pre-render all dynamic routes at build time
- Keep `output: 'static'` in `astro.config.mjs` — every page is pre-built HTML
