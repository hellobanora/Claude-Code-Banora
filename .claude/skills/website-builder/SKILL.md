---
name: website-builder
description: "Website builder for Banora Chiropractic — builds a fast, professional Astro website deployed on Vercel with SEO baked in, IconPractice booking integration, and AI chatbot. Use this skill whenever the user wants to build, design, develop, or deploy the Banora Chiropractic website, create new pages, modify the site layout, add components, update styling, work on the chatbot, set up booking integration, or anything related to the website's code, design, or deployment. Also trigger when the user mentions Vercel, Astro, website performance, page speed, or web design for the practice."
---

# Website Builder — Banora Chiropractic

You are a senior web developer building a professional chiropractic practice website. The site must be fast, accessible, SEO-optimized from day one, and convey trust and professionalism. Every decision should serve the goal of converting visitors into booked patients.

## Tech Stack

- **Framework:** Astro (static site generation, zero JS by default)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Content:** Data-driven pages via `getStaticPaths()` with TypeScript data files
- **Images:** Astro `<Image>` component from `astro:assets` with automatic WebP optimization
- **Analytics:** Google Analytics 4
- **Forms:** Formspree (endpoint: mpqjeego) — plain HTML forms, no JavaScript needed

## Brand & Design System

### Color Palette

```css
:root {
  --color-navy:       #1B3A5C;   /* primary — headers, footer, nav */
  --color-mid-blue:   #2C5F8A;   /* secondary — buttons, links, accents */
  --color-light-blue: #5B9EC9;   /* tertiary — hover states, highlights */
  --color-light-grey: #F5F5F5;   /* backgrounds, alternating sections */
  --color-white:      #FFFFFF;   /* primary background */
  --color-dark-text:  #1A1A1A;   /* body text */
}
```

### Typography

- **Headings:** Montserrat (600, 700 weights) — clean, professional sans-serif
- **Body:** Open Sans (400, 600 weights) — highly readable sans-serif
- **Self-host fonts** as WOFF2 files in `/public/fonts/` for maximum performance (no external requests, no layout shift). Use `font-display: swap` and preload critical fonts.

### Design Principles

- **Clean and professional** — healthcare requires trust. No gimmicks, no busy layouts.
- **Mobile-first** — most local searches happen on phones. Design for mobile, enhance for desktop.
- **Fast** — target Lighthouse score of 90+ across all metrics. Astro's zero-JS default gives a massive head start.
- **Accessible** — WCAG 2.1 AA compliance. Proper heading hierarchy, alt text, keyboard navigation, sufficient color contrast.
- **Conversion-focused** — every page should have a clear path to booking an appointment.

### Visual Style

- Full-width hero sections with professional photography
- Card-based layouts for services and team members
- Generous whitespace — let the content breathe
- Subtle animations on scroll (CSS transitions, not JS libraries)
- Navy (#1B3A5C) used for headers, footer, and hero overlays — Mid Blue (#2C5F8A) for CTAs and key highlights
- Dark footer section with practice info and quick links
- Consistent border-radius (rounded-lg / 8px) on cards and buttons

## Site Architecture

Build these pages, informed by the SEO Expert skill findings (competitors have 10-20+ pages, Banora currently has only 5):

### Core Pages
1. **Homepage** (`/`) — hero with CTA, services overview, team intro, testimonials, location map
2. **About Us** (`/about`) — practice story, mission, values, why choose us
3. **Contact** (`/contact`) — address, phone, hours, contact form, embedded Google Map, directions

### Service Pages (one per service — critical for SEO)
4. **Chiropractic Adjustments** (`/services/chiropractic-adjustments`)
5. **Posture Correction** (`/services/posture-correction`)
6. **Sports Chiropractic** (`/services/sports-chiropractic`)
7. **Pregnancy Chiropractic** (`/services/pregnancy-chiropractic`)
8. **Paediatric Chiropractic** (`/services/paediatric-chiropractic`)

### Condition Pages (one per condition — critical for SEO)
9. **Back Pain** (`/conditions/back-pain`)
10. **Neck Pain** (`/conditions/neck-pain`)
11. **Headaches & Migraines** (`/conditions/headaches-migraines`)
12. **Sciatica** (`/conditions/sciatica`)
13. **Shoulder Pain** (`/conditions/shoulder-pain`)

### Location Pages (target suburb-specific searches)
14. **Chiropractor Tweed Heads South** (`/areas/tweed-heads-south`)
15. **Chiropractor Tweed Heads** (`/areas/tweed-heads`)
16. **Chiropractor Banora Point** (`/areas/banora-point`)
17. **Chiropractor Coolangatta** (`/areas/coolangatta`)
18. **Chiropractor Palm Beach** (`/areas/palm-beach`)
19. **Chiropractor Currumbin** (`/areas/currumbin`)
20. **Chiropractor Elanora** (`/areas/elanora`)
21. **Chiropractor Bilinga** (`/areas/bilinga`)
22. **Chiropractor Tugun** (`/areas/tugun`)
23. **Chiropractor Kirra** (`/areas/kirra`)
24. **Chiropractor Burleigh Heads** (`/areas/burleigh-heads`)
25. **Chiropractor Terranora** (`/areas/terranora`)
26. **Chiropractor Chinderah** (`/areas/chinderah`)
27. **Chiropractor Kingscliff** (`/areas/kingscliff`)

### Content Pages
28. **Patient Resources** (`/patient-resources`) — links to patient hub, exercise guides, posture information

## Page Templates & Components

### Shared Layout
```
<Header>         — logo, nav, "Book Now" CTA button (sticky on scroll)
  <main>         — page content
<ChatBot>        — floating chat widget (bottom-right)
<Footer>         — practice info, hours, quick links, social, copyright
```

### Key Components to Build

**Navigation:**
- Sticky header that reduces height on scroll
- Mobile hamburger menu with smooth slide-in (vanilla JS `<script>` tag)
- "Book Now" button always visible in header (mid blue)
- Services dropdown on desktop

**Hero Section:**
- Full-width background image with navy overlay
- H1 heading + subtext + CTA button
- Each page gets a unique hero appropriate to its content

**Service Cards:**
- Icon + title + short description + "Learn More" link
- Grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)

**Team Cards:**
- Professional photo + name + qualifications + bio excerpt

**Call-to-Action Sections:**
- Reusable CTA banner: "Ready to feel better? Book your appointment today"
- Placed between content sections and at page bottom
- Navy background with white text

**Location/Map Section:**
- Embedded Google Map showing 2/44 Greenway Drive, Tweed Heads South
- Address, phone, hours displayed alongside
- "Get Directions" button

**FAQ Accordion:**
- Uses native `<details>`/`<summary>` elements — zero JavaScript
- FAQ schema markup (JSON-LD) for rich results in Google

## IconPractice Booking Integration

IconPractice is the practice management system used by Banora Chiropractic. Integration approach:

### Option 1: Direct Link (Simplest)
- "Book Now" buttons link to the IconPractice online booking URL
- Opens in a new tab
- Booking URL: `https://www.iconpractice.com/ob/7138/banorachiropractic/245386/2`

### Option 2: Iframe Embed
- Embed the IconPractice booking interface in an iframe on the contact page
- Style the surrounding page to match the site design

```astro
---
// components/integrations/BookingWidget.astro
interface Props {
  bookingUrl: string;
}

const { bookingUrl } = Astro.props;
---

<div class="relative w-full min-h-[600px]">
  <iframe
    src={bookingUrl}
    class="w-full min-h-[600px] border-0 rounded-lg"
    title="Book an appointment with Banora Chiropractic"
    loading="lazy"
    allow="payment"
  />
</div>
```

**Recommendation:** Start with Option 1 (direct link) for the "Book Now" buttons across the site, and Option 2 (iframe) for the contact page. Keep it simple.

## AI Chatbot

The chatbot is deployed separately on Netlify and loaded as an external script.

### Implementation

Load the chatbot widget script with `defer` so it doesn't block page rendering:

```html
<script defer src="https://thriving-conkies-08c1ca.netlify.app/banora-chatbot-widget.js"></script>
```

### Chat Widget Features
- Floating button (bottom-right corner) with chat icon
- Opens a chat panel (350px wide, 500px tall on desktop; full-screen on mobile)
- Welcome message: greeting the visitor and offering help
- Quick-reply buttons for common questions: "Book an appointment", "Our services", "Opening hours", "Where are you located?"
- Typing indicator while waiting for response
- Smooth open/close animation

### Chatbot System Prompt
The chatbot should know:
- All practice details (address, phone, hours, practitioners, services)
- Common chiropractic FAQs
- When to direct people to book (always gently guide toward booking)
- When to direct people to call (emergencies, complex questions)
- It should NOT give medical advice — redirect to "Please book a consultation so our chiropractors can assess your specific situation"

### Environment Variables Needed
```env
ANTHROPIC_API_KEY=     # For the chatbot (managed in Netlify deployment)
GA_TRACKING_ID=        # Google Analytics 4 measurement ID
```

## SEO Implementation

Every page must be optimized. The SEO Expert skill has identified key gaps — this website should fix all of them.

### Technical SEO Checklist

**Metadata (every page):**
- Unique, keyword-rich title tag (50-60 chars)
- Compelling meta description with CTA (150-160 chars)
- Canonical URL
- Open Graph tags (og:title, og:description, og:image)

**Schema Markup (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "Chiropractor",
  "name": "Banora Chiropractic",
  "description": "Expert chiropractors in Tweed Heads South with over 30 years combined experience. Serving Banora Point, Tweed Heads, and the Gold Coast border region.",
  "url": "https://banorachiropractic.com.au",
  "telephone": "(07) 5599 2322",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2/44 Greenway Drive",
    "addressLocality": "Tweed Heads South",
    "addressRegion": "NSW",
    "postalCode": "2486",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -28.1894,
    "longitude": 153.5363
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "08:30", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "08:30", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "14:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "08:30", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "12:00", "closes": "14:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "12:00" }
  ],
  "priceRange": "$$",
  "image": "https://banorachiropractic.com.au/og-image.jpg",
  "sameAs": [
    "https://www.facebook.com/banorachiro/"
  ]
}
```

**Additional schema for specific pages:**
- Service pages: `MedicalCondition` or `MedicalTherapy` schema
- FAQ sections: `FAQPage` schema
- About page: `Person` schema for each practitioner

**Performance targets:**
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 100
- Core Web Vitals: all green (LCP < 2.5s, FID < 100ms, CLS < 0.1)

**Technical requirements:**
- `sitemap.xml` auto-generated (use `@astrojs/sitemap` integration)
- `robots.txt` allowing all crawlers
- Proper canonical URLs
- Internal linking between related service pages
- Breadcrumb navigation with BreadcrumbList schema
- Image alt text on every image
- Lazy loading for below-fold images
- Preload critical fonts

### Page-Level SEO Templates

**Service page title formula:**
`{Service Name} | Banora Chiropractic Tweed Heads South`

**Service page meta description formula:**
`Expert {service} at Banora Chiropractic, Tweed Heads South. [Unique benefit]. Book your appointment today — (07) 5599 2322.`

**Location page title formula:**
`Chiropractor {Suburb} | Banora Chiropractic Near You`

**Location page meta description formula:**
`Looking for a chiropractor near {Suburb}? Banora Chiropractic is [X] minutes away in Tweed Heads South. Over 30 years combined experience. Book today.`

## Project Structure

```
banora-website/
├── CLAUDE.md                    # Project instructions
├── .skills/                     # Claude Code skills
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro     # Root layout — head, nav, footer, analytics
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── about.astro
│   │   ├── services/
│   │   │   └── [slug].astro     # Dynamic service pages
│   │   ├── conditions/
│   │   │   └── [slug].astro     # Dynamic condition pages
│   │   ├── areas/
│   │   │   └── [slug].astro     # Dynamic location pages
│   │   ├── patient-resources.astro
│   │   └── contact.astro
│   ├── components/
│   │   ├── layout/              # Header.astro, Footer.astro, MobileMenu.astro
│   │   ├── ui/                  # Button.astro, Card.astro, Badge.astro
│   │   ├── forms/               # ContactForm.astro, BookingCTA.astro
│   │   ├── sections/            # Hero.astro, ServiceGrid.astro, CTABanner.astro, FAQAccordion.astro
│   │   └── integrations/        # ChatbotWidget.astro, BookingWidget.astro, GoogleMap.astro
│   ├── data/
│   │   ├── clinic.ts            # Practice info — name, address, phone, hours, practitioners
│   │   ├── services.ts          # Service definitions for dynamic routes
│   │   ├── conditions.ts        # Condition definitions for dynamic routes
│   │   └── areas.ts             # Suburb data for location pages
│   ├── utils/
│   │   └── helpers.ts           # Shared utilities
│   └── styles/
│       └── global.css           # Tailwind base + custom CSS variables
├── public/
│   ├── images/
│   ├── fonts/                   # Self-hosted WOFF2 font files
│   ├── favicon.ico
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── vercel.json
```

## Development Workflow

1. **Initialize:** `npm create astro@latest banora-website -- --template minimal --typescript`
2. **Add integrations:** `npx astro add tailwind` and `npx astro add vercel` and `npx astro add sitemap`
3. **Configure Tailwind** with the brand colors and typography
4. **Build layout first** — BaseLayout, header, footer, navigation
5. **Homepage** — hero, services overview, team, CTA
6. **Service pages** — use `[slug].astro` template with data from `services.ts`
7. **Condition pages** — use `[slug].astro` template with data from `conditions.ts`
8. **Location pages** — use `[slug].astro` template with data from `areas.ts`
9. **Contact page** — Formspree form, Google Map, booking widget
10. **Chatbot** — load external widget script with `defer`
11. **SEO audit** — run Lighthouse, validate schema, test all meta tags
12. **Deploy to Vercel** — connect GitHub repo, configure domain

## Performance Optimization

- Use Astro's `<Image>` component from `astro:assets` for automatic WebP conversion, lazy loading, and sizing
- Self-host fonts as WOFF2 in `/public/fonts/` with `font-display: swap` and preload critical fonts
- Astro ships zero JavaScript by default — keep it that way for content pages
- Use `<script>` tags for simple interactivity (mobile menu, scroll effects) — not framework components
- Keep `output: 'static'` in `astro.config.mjs` — every page is pre-built HTML served from Vercel's CDN
- Use `compressHTML: true` in Astro config
- Tailwind purges unused classes automatically in production
- Load chatbot with `defer`, analytics with `async`
- Keep bundle size small — avoid heavy dependencies

## Deployment

### Vercel Configuration
- Connect GitHub repository
- Configure custom domain: `banorachiropractic.com.au`
- Set environment variables (GA tracking ID)
- Configure redirects from old site URLs if needed

### Domain Setup
- Point DNS A record to Vercel's IP
- Configure CNAME for www subdomain
- Vercel handles SSL automatically
- Set up redirect: www → non-www (or vice versa, match current setup)

## Important Guidelines

- **Never hardcode practice details** — store in `src/data/clinic.ts` so changes propagate everywhere
- **Every page needs a "Book Now" path** — header CTA is always there, plus contextual CTAs in content
- **Test on real phones** — not just browser DevTools responsive mode
- **Optimize images before committing** — use WebP format, appropriate dimensions
- **Write semantic HTML** — proper heading levels, landmark elements, ARIA labels where needed
- **Keep the chatbot lightweight** — load with `defer`, don't impact initial page load
- **Content should be genuine and helpful** — not keyword-stuffed. Write for patients first, search engines second
- **Use Astro components (.astro files)** — only reach for framework islands (React/Preact) if the interactivity is genuinely complex
- **Multi-clinic ready** — all clinic-specific data lives in `src/data/clinic.ts` for future Palm Beach expansion
