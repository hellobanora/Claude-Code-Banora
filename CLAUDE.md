# CLAUDE.md — Banora Chiropractic Website

> Read this file at the start of every session. It is the single source of truth for this project.

---

## Project Overview

**Banora Chiropractic** is a chiropractic clinic co-owned by Dr James Shipway and Dr Paul Cater, located in Tweed Heads South NSW. This is the clinic's primary website — built to attract new patients, rank locally on Google, and make booking effortless.

- **Live site**: banorachiropractic.com.au
- **Tech stack**: Astro + Tailwind CSS, deployed on Vercel
- **Booking**: IconPractice widget integration
- **Forms**: Formspree (endpoint: `mpqjeego`)
- **Analytics**: Google Analytics 4
- **Scope**: Banora Chiropractic only. Palm Beach Chiropractic is a separate future project.

---

## Skills

Read the relevant skill before starting any matching task. Skills live in `.skills/` at the project root.

| Skill | When to read it |
|-------|----------------|
| `.skills/seo/SKILL.md` | Any page copy, headings, meta tags, schema, location pages |
| `.skills/copywriting/SKILL.md` | Any patient-facing text — including buttons and alt text |
| `.skills/brand/SKILL.md` | Any visual work — colours, fonts, spacing, layout |
| `.skills/components/SKILL.md` | Any Astro component, layout, or UI element |
| `.skills/performance/SKILL.md` | Images, scripts, fonts, build config |
| `.skills/human-voice/SKILL.md` | Blog posts, social content, long-form copy |

**ECC skills** (shared, in `~/projects/claude-skills/`):

| Skill | When to read it |
|-------|----------------|
| `content-engine/SKILL.md` | Social posts, content calendars, platform copy |
| `article-writing/SKILL.md` | Newsletter content, blog posts |
| `frontend-patterns/SKILL.md` | React/component patterns, state, performance |
| `market-research/SKILL.md` | Competitor research, local SEO analysis |
| `deployment-patterns/SKILL.md` | Vercel CI/CD, environment setup, rollbacks |

---

## Clinic Details (Never Deviate From These)

### NAP — Use This Exact Format Everywhere

- **Name**: Banora Chiropractic
- **Address**: 2/44 Greenway Drive, Tweed Heads South NSW 2486
- **Phone**: (07) 5599 2322
- **Website**: banorachiropractic.com.au

### Practitioners

- **Dr James Shipway** — B.Sc.Chiro. & M.Chiro (co-owner)
- **Dr Paul Cater** — B.Sc.Chiro. & M.Chiro (co-owner)
- Combined: 30+ years experience

### Hours

| Day | Hours |
|-----|-------|
| Monday | 8:30am – 6:00pm |
| Tuesday | 8:30am – 6:00pm |
| Wednesday | 2:00pm – 6:00pm |
| Thursday | 8:30am – 6:00pm |
| Friday | 12:00pm – 2:00pm |
| Saturday | 8:00am – 12:00pm |
| Sunday | Closed |

### Key Facts

- HICAPS on-site (instant health fund rebates)
- No referral required
- Ground level, wheelchair accessible, on-site parking
- Techniques: Gonstead, SOT, Diversified, Thompson Drop, Activator, Cranial, Extremity

---

## Brand Identity

### Colours

```
Navy (primary):    #1B3A5C
Mid blue:          #2C5F8A
Light blue:        #5B9EC9
Gold (accent):     #FFD232
Dark gold:         #D4A017
White:             #FFFFFF
Off-white:         #F8F9FA
Light grey:        #E8EDF2
```

### Typography

- **Headings**: Playfair Display (serif, trustworthy, professional)
- **Body**: Inter (clean, readable, accessible)
- **Accent/callouts**: Playfair Display italic

### Voice

Warm, knowledgeable, direct. The patient is the hero — we are the guide. Never use:
- Superlatives without evidence ("the best", "world-class")
- Jargon without explanation
- Passive voice where active is possible

### Visual Feel

Clean, clinical confidence. White space is generous. Navy anchors the brand. Gold is used sparingly for emphasis and CTAs only. Photos show real people, real movement, real care — not stock.

---

## AHPRA Compliance (Critical — Non-Negotiable)

Every piece of patient-facing content must follow these rules:

### Never Write

- "We can cure…" or "We will fix…"
- "Guaranteed results" or any outcome promise
- Testimonials that imply guaranteed outcomes
- Claims that chiropractic treats specific diseases (diabetes, cancer, etc.)
- "Our chiropractors are the best in…"
- Before/after comparisons that imply guaranteed outcomes

### Always Write

- "May help with…", "Can assist in managing…", "Many patients find relief from…"
- "Results vary between individuals"
- "We recommend a consultation to assess your individual needs"
- Reference to evidence-based care where appropriate

### Red Flag Check

Before finalising any copy, mentally check:
1. Does this make a therapeutic claim? → Add "may" or "can help"
2. Does this promise a specific outcome? → Remove or soften
3. Does this use a testimonial to imply guaranteed results? → Reframe

---

## Site Architecture

### Pages (Current)

```
/                          Homepage
/about                     About the clinic & team
/services                  Services overview
/services/spinal-adjustment
/services/posture-correction
/services/sports-chiropractic
/services/dry-needling
/services/paediatric-chiropractic
/conditions                Conditions overview
/conditions/back-pain
/conditions/neck-pain
/conditions/headaches
/conditions/sciatica
/conditions/sports-injuries
/locations                 Suburb location pages index
/locations/[suburb]        Dynamic suburb pages (14+ suburbs)
/patient-resources         Resources hub
/contact                   Contact + booking
```

### Location Suburbs Covered

Tweed Heads, Tweed Heads South, Banora Point, Terranora, Bilambil Heights, Cobaki, Cobaki Lakes, Piggabeen, Casuarina, Kingscliff, Murwillumbah, Coolangatta, Kirra, Palm Beach (QLD)

---

## Integrations

### IconPractice (Booking)

Embed the booking widget on `/contact` and in the site header CTA. Use the standard IconPractice embed code. Never hardcode appointment logic — all booking flows through IconPractice.

### AI Chatbot

AHPRA-compliant chatbot widget deployed via Netlify serverless proxy to Claude API. System prompt enforces compliance rules and clinic info. Widget sits bottom-right on all pages. Do not modify chatbot logic without reviewing AHPRA rules above.

### Formspree

Contact form endpoint: `mpqjeego`
Usage: `action="https://formspree.io/f/mpqjeego"` — plain HTML POST, no JavaScript required.

### Google Analytics 4

GA4 tag loads in `<head>` on all pages. Never block or delay the GA4 script. Use `data-astro-rerun` attribute if needed for Astro view transitions.

### Google Maps

Embed for clinic location on `/contact` page. Use standard iframe embed — do not use Maps JavaScript API (unnecessary complexity).

### Social Media

Links in footer and header. Instagram and Facebook are primary channels. Social content is managed separately via the `banora-social-autopilot` project.

---

## Development Standards

### Workflow — Always Follow This Order

1. **Plan first** — For any feature touching 3+ files, run `/plan` before writing code
2. **Read the skill** — Check relevant skills before starting
3. **Build** — Write code following skill and brand guidelines
4. **Review** — Run `/code-review` before committing
5. **Verify** — Run `/verify` to check build, types, lint
6. **Commit** — Use conventional commit format (see below)
7. **Save session** — Run `/save-session` before closing

### Commit Format

```
<type>: <short description>

Types: feat, fix, refactor, docs, style, perf, chore
Examples:
  feat: add sciatica condition page with schema markup
  fix: correct NAP address on contact page
  perf: compress hero images to WebP
  docs: update CLAUDE.md with new suburb list
```

### Code Quality Rules (from ECC)

- Functions: under 50 lines
- Files: under 800 lines — split by feature if larger
- No nesting deeper than 4 levels
- No hardcoded secrets — all tokens/keys in `.env`
- Handle errors at every level — never silently swallow
- Validate all user inputs at system boundaries

### Security Checklist (Before Every Commit)

- [ ] No API keys or tokens in source code
- [ ] Formspree endpoint is not exposing sensitive data
- [ ] Chatbot proxy does not log patient queries
- [ ] Environment variables validated at startup

---

## SEO Rules

### Page Titles

Format: `[Primary Keyword] | Banora Chiropractic`
Example: `Chiropractor Tweed Heads South | Banora Chiropractic`

### Meta Descriptions

- 150–160 characters
- Include primary keyword and a clear benefit
- End with a soft CTA where natural

### Schema Markup

Every page includes `LocalBusiness` schema at minimum:

```json
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "Banora Chiropractic",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2/44 Greenway Drive",
    "addressLocality": "Tweed Heads South",
    "addressRegion": "NSW",
    "postalCode": "2486",
    "addressCountry": "AU"
  },
  "telephone": "(07) 5599 2322",
  "url": "https://banorachiropractic.com.au"
}
```

Service pages add `MedicalBusiness` / `Service` schema. Condition pages add `MedicalCondition` schema. Location pages add `areaServed`.

### Internal Linking Rules

1. Every service page → links to 2–3 related condition pages
2. Every condition page → links back to relevant services
3. Every location page → links to homepage, services, conditions
4. Breadcrumbs on all inner pages with `BreadcrumbList` schema
5. Use descriptive anchor text with keywords — never "click here"

---

## File Structure

```
/
├── CLAUDE.md                  ← This file
├── .skills/
│   ├── seo/SKILL.md
│   ├── copywriting/SKILL.md
│   ├── brand/SKILL.md
│   ├── components/SKILL.md
│   ├── performance/SKILL.md
│   └── human-voice/SKILL.md
├── src/
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Page.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── services/
│   │   ├── conditions/
│   │   ├── locations/
│   │   │   └── [suburb].astro
│   │   └── patient-resources/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BookingCTA.astro
│   │   ├── ChatbotWidget.astro
│   │   └── ...
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   └── fonts/
├── astro.config.mjs
├── tailwind.config.mjs
└── .env.example
```

---

## Session Management

### Starting a Session

If a `.claude/sessions/` file exists from a previous session, run `/resume-session` before anything else.

### Ending a Session

Always run `/save-session` before closing. Capture:
- What was built and confirmed working
- What was attempted and failed (and why)
- Exact next step for next session
- Any open questions or blockers

### Mid-Session Checkpoints

For large features, run `/checkpoint create <name>` after each phase completes. This gives a rollback point without needing a full commit.

---

## Future Expansion (Do Not Build Yet)

- **Palm Beach Chiropractic & Remedial** — separate project, separate repo, separate domain
- **Lennox Head "Shore" clinic** — brand identity TBD, expansion under evaluation
- **Patient mobile app** — React Native/Expo, exercise library, care guides, booking
- **E-commerce** — wellness products (massage guns, posture products, digital courses)

Do not add Palm Beach or Shore branding, pages, or references to this project.

---

## Common Mistakes to Avoid

1. **Wrong address** — It's `2/44 Greenway Drive`, NOT Leisure Drive or Banora Point
2. **AHPRA violations** — Never promise outcomes; always hedge with "may help" language
3. **Breaking the booking flow** — IconPractice handles all booking; don't add custom logic
4. **Inconsistent NAP** — Phone, address, and name must match exactly across every page
5. **Adding Palm Beach content** — This site is Banora only
6. **Hardcoding secrets** — All API keys go in `.env`, never in source