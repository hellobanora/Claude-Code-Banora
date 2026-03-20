---
name: analytics-tracking
description: "Analytics and conversion tracking for Banora Chiropractic — sets up GA4, Vercel Analytics, Google Search Console, and conversion event tracking to measure website performance and patient acquisition. Use this skill whenever the user mentions analytics, tracking, conversions, GA4, Google Analytics, Search Console, measuring results, KPIs, bounce rate, page views, booking clicks, phone taps, form submissions, or wants to understand how the website is performing. Also trigger when the user asks 'is the website working', 'are we getting bookings', 'what's our traffic', or anything about measuring the effectiveness of SEO or marketing efforts."
---

# Analytics & Conversion Tracking — Banora Chiropractic

You set up measurement for everything that matters. A beautiful website with great SEO is worthless if you can't tell whether it's actually bringing in patients. Every tracking decision should answer one question: is this helping us book more appointments?

## What We're Measuring

Not everything that can be measured matters. Focus on these:

### Primary Metrics (Business Outcomes)
These directly indicate patient acquisition:

| Metric | What It Tells You | How We Track It |
|---|---|---|
| **Booking clicks** | Someone clicked "Book Now" or visited /book | GA4 event |
| **Phone taps** | Someone tapped the phone number on mobile | GA4 event |
| **Contact form submissions** | Someone submitted the contact form | GA4 event |
| **Chatbot booking conversions** | Chatbot conversation led to a booking click | GA4 event |

### Secondary Metrics (Leading Indicators)
These predict future bookings:

| Metric | What It Tells You | How We Track It |
|---|---|---|
| **Organic search traffic** | SEO is working | GA4 + Search Console |
| **Local pack impressions** | Showing up in Google Maps results | Search Console |
| **Service page views** | People are researching specific conditions | GA4 |
| **Time on service pages** | People are actually reading, not bouncing | GA4 |
| **Blog traffic** | Content strategy is driving visits | GA4 |
| **Returning visitors** | People came back (considering booking) | GA4 |

### Vanity Metrics (Track but Don't Obsess)
These feel good but don't directly mean patients:
- Total page views
- Social media followers
- Bounce rate (misleading for single-page visits from search)

## Google Analytics 4 (GA4) Setup

### Installation

Use the Next.js Script component for optimal loading:

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              send_page_view: true
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Important:** Use `strategy="afterInteractive"` — this loads analytics after the page is interactive, so it doesn't slow down the initial render. Never use `beforeInteractive` for analytics.

### Custom Events

Create a centralised tracking utility:

```typescript
// lib/analytics.ts

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Pre-defined events for consistency
export const analytics = {
  // Primary conversions
  bookingClick: (source: string) =>
    trackEvent('booking_click', { source, page: window.location.pathname }),

  phoneTap: (source: string) =>
    trackEvent('phone_tap', { source, page: window.location.pathname }),

  contactFormSubmit: () =>
    trackEvent('contact_form_submit', { page: window.location.pathname }),

  chatbotBooking: () =>
    trackEvent('chatbot_booking_click'),

  // Engagement events
  servicePageView: (service: string) =>
    trackEvent('service_page_view', { service }),

  locationPageView: (location: string) =>
    trackEvent('location_page_view', { location }),

  blogPostRead: (slug: string, readTimePercent: number) =>
    trackEvent('blog_post_read', { slug, read_percent: readTimePercent }),

  faqExpand: (question: string) =>
    trackEvent('faq_expand', { question }),

  chatbotOpen: () =>
    trackEvent('chatbot_open'),

  chatbotMessage: (messageCount: number) =>
    trackEvent('chatbot_message', { message_count: messageCount }),

  mapClick: () =>
    trackEvent('map_click', { page: window.location.pathname }),

  directionsClick: () =>
    trackEvent('directions_click'),
};
```

### Implementing Events in Components

**Book Now button (appears everywhere):**
```tsx
// components/ui/BookNowButton.tsx
'use client';

import { analytics } from '@/lib/analytics';

interface BookNowButtonProps {
  source: string; // 'header' | 'hero' | 'cta_banner' | 'service_page' | 'footer'
  href: string;
}

export function BookNowButton({ source, href }: BookNowButtonProps) {
  return (
    <a
      href={href}
      onClick={() => analytics.bookingClick(source)}
      className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
    >
      Book an Appointment
    </a>
  );
}
```

**Phone number link:**
```tsx
// components/PhoneLink.tsx
'use client';

import { analytics } from '@/lib/analytics';

export function PhoneLink({ source }: { source: string }) {
  return (
    <a
      href="tel:0755992322"
      onClick={() => analytics.phoneTap(source)}
      className="text-primary hover:underline"
    >
      (07) 5599 2322
    </a>
  );
}
```

**Track these events on every interactive element** — every "Book Now" button, every phone number, every form submission. Tag the `source` so you know which button/page drives the most conversions.

### GA4 Conversion Goals

In the GA4 admin panel, mark these events as conversions:
1. `booking_click`
2. `phone_tap`
3. `contact_form_submit`
4. `chatbot_booking_click`

These show up in the Conversions report and can be used for Google Ads if the practice ever runs paid campaigns.

### GA4 Audiences to Create

Set up these audiences for deeper analysis:

| Audience | Definition | Why |
|---|---|---|
| **Booking intenders** | Visited /book OR clicked booking button but didn't convert | Retargeting potential |
| **Service researchers** | Viewed 2+ service pages in one session | High-intent visitors |
| **Local visitors** | Location: Tweed Heads / Gold Coast / Northern NSW | Core target audience |
| **Blog readers** | Viewed 3+ blog posts | Content is working for engagement |
| **Returning non-bookers** | 2+ sessions, never triggered booking_click | Need a nudge |

## Vercel Analytics

Vercel Analytics provides real user monitoring (Core Web Vitals) without the complexity of GA4 for performance data.

### Setup

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### What Vercel Analytics Gives You
- **Core Web Vitals** in real user conditions (not just Lighthouse lab data)
- **LCP, FID, CLS** per page — identify which pages are slow
- **Geographic breakdown** — confirm traffic is coming from the Tweed/Gold Coast area
- **Top pages** — which pages get the most traffic
- **Speed insights** — per-route performance

### Performance Budgets

Set alerts for when pages get slow:

| Metric | Budget | Action if exceeded |
|---|---|---|
| LCP | < 2.5s | Optimise hero image, check server response time |
| FID | < 100ms | Reduce client-side JS, check third-party scripts |
| CLS | < 0.1 | Fix image dimensions, preload fonts |
| TTFB | < 800ms | Check Vercel region, API routes, database queries |

## Google Search Console

Search Console is the only tool that shows exactly how the site appears in Google search results. It's essential for monitoring the SEO skill's recommendations.

### Setup
1. Add property: `banorachiropractic.com.au`
2. Verify via DNS TXT record (most reliable) or HTML file upload to /public
3. Submit sitemap: `https://banorachiropractic.com.au/sitemap.xml`

### Key Reports to Monitor

**Performance report — check weekly:**
- **Queries:** What search terms are people using to find the site?
- **Pages:** Which pages get the most search impressions and clicks?
- **CTR:** Are title tags and meta descriptions compelling enough to click?
- **Position:** Average ranking position for target keywords

**Track these specific queries over time:**
- `chiropractor banora point` — should be position 1
- `chiropractor tweed heads` — target: top 3
- `chiropractor tweed heads south` — should be position 1
- `back pain chiropractor tweed heads` — target: top 3
- `[each service] tweed heads` — monitor all service keywords

**Coverage report — check monthly:**
- Are all pages indexed?
- Any crawl errors?
- Any pages blocked by robots.txt accidentally?

**Enhancements report:**
- Structured data (schema markup) — are rich results appearing?
- Mobile usability — any issues?
- Core Web Vitals — any pages failing?

### Search Console + GA4 Integration

Link Search Console to GA4 for combined reporting:
GA4 Admin → Product Links → Search Console → Link

This lets you see search query data alongside on-site behaviour — which keywords lead to bookings, not just clicks.

## Dashboard & Reporting

### Weekly Check (5 minutes)

Look at these numbers every Monday:

1. **Total sessions** this week vs last week
2. **Organic search sessions** — is SEO traffic growing?
3. **Total conversions** (booking clicks + phone taps + form submissions)
4. **Top landing pages** — which pages bring people in?
5. **Top search queries** in Search Console — any new keywords appearing?

### Monthly Review (30 minutes)

Deeper analysis:

1. **Conversion rate by page** — which service pages convert best?
2. **Search position changes** — are target keywords improving?
3. **New vs returning visitors** — healthy ratio is roughly 70/30
4. **Competitor comparison** — run the SEO Expert skill to check for ranking changes
5. **Content performance** — which blog posts drive the most traffic?
6. **Core Web Vitals trends** — is the site staying fast?

### Reporting Template

```markdown
# Banora Chiropractic — Monthly Digital Report

## Summary
- Sessions: [X] ([+/-X%] vs last month)
- Organic traffic: [X] ([+/-X%])
- Conversions: [X] booking clicks, [X] phone taps, [X] form submissions
- Conversion rate: [X%]

## Search Performance
- Average position for "chiropractor tweed heads": [X]
- Average position for "chiropractor banora point": [X]
- New keywords ranking in top 10: [list]
- Pages indexed: [X]

## Top Performing Pages
| Page | Sessions | Conversions | Conv. Rate |
|---|---|---|---|

## Actions for Next Month
1. [specific action based on data]
2. [specific action based on data]
3. [specific action based on data]
```

## Implementation Checklist

When setting up analytics for the first time:

- [ ] Create GA4 property and get measurement ID
- [ ] Add GA4 script to layout.tsx
- [ ] Create lib/analytics.ts with all event definitions
- [ ] Add tracking to every BookNow button (with source tags)
- [ ] Add tracking to every phone number link
- [ ] Add tracking to contact form submission
- [ ] Add tracking to chatbot interactions
- [ ] Set up conversion goals in GA4 admin
- [ ] Install Vercel Analytics
- [ ] Set up Google Search Console
- [ ] Verify site in Search Console
- [ ] Submit sitemap
- [ ] Link Search Console to GA4
- [ ] Create GA4 audiences
- [ ] Set up weekly check reminder
- [ ] Bookmark GA4 and Search Console dashboards

## Privacy & Compliance

### Cookie Consent

Australian privacy law (Privacy Act 1988) requires informing users about data collection. Implement a simple cookie consent banner:

```tsx
// components/CookieConsent.tsx
```

**Requirements:**
- Show on first visit
- Allow accepting or declining analytics cookies
- If declined, don't load GA4 script
- Store preference in localStorage
- Link to privacy policy page
- Don't block page content — use a non-intrusive bottom banner

**Important:** Only load GA4 after consent is given. Vercel Analytics uses privacy-friendly, cookieless tracking and doesn't require consent.

### Privacy Policy

The privacy policy page must mention:
- What data is collected (analytics, cookies, form submissions)
- How it's used (improving the website, not sold to third parties)
- Google Analytics specifically (link to Google's privacy policy)
- How to opt out (browser settings, cookie consent)
- Contact details for privacy questions

## Working With Other Skills

- **SEO Expert** — Search Console data validates whether SEO recommendations are working. Run monthly comparisons.
- **Website Builder** — provides the component architecture where tracking code lives. Coordinate event naming.
- **Content Writer** — blog post performance data guides future content topics. Write more of what works.
- **Chatbot Personality** — chatbot analytics reveal what patients actually ask, informing both chatbot improvements and website content gaps.
