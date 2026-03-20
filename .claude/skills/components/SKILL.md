---
name: components
description: UI component and layout skill for the Banora Chiropractic Astro website. Use this skill whenever building, editing, or reviewing any Astro component, page layout, section, or interactive element. Trigger this for creating new pages, building reusable components, structuring layouts, adding navigation, building forms, or integrating third-party widgets. If it renders on screen, this skill applies.
---

# Components Skill — Banora Chiropractic (Astro)

## Tech Foundation

- **Framework**: Astro with TypeScript
- **Styling**: Tailwind CSS with brand colour variables
- **Images**: Astro `<Image>` from `astro:assets` or native `<img>` with lazy loading
- **Links**: Standard `<a>` tags (Astro doesn't need a special Link component)
- **Icons**: Inline SVGs or a lightweight icon set — avoid icon library JavaScript

## Tailwind Brand Config

Extend `tailwind.config.mjs` with the brand system:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B3A5C',
          blue: '#2C5F8A',
          'light-blue': '#5B9EC9',
          grey: '#F5F5F5',
        }
      }
    }
  }
}
```

Use `text-brand-navy`, `bg-brand-blue`, `hover:bg-brand-light-blue` etc. throughout all components.

## Component Architecture

### Naming Conventions

- PascalCase for components: `HeroSection.astro`, `ServiceCard.astro`
- Folder-based grouping: `components/layout/`, `components/ui/`, `components/sections/`
- Each component gets its own file

### Props Pattern

Every component receives content via props — never hardcode text:

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
}

const { title, subtitle, ctaText, ctaLink } = Astro.props;
---

<section>
  <h1>{title}</h1>
  {subtitle && <p>{subtitle}</p>}
  <a href={ctaLink}>{ctaText}</a>
</section>
```

### Slots Pattern

Use `<slot />` for flexible content and named slots for multi-region layouts:

```astro
<!-- TwoColumn.astro -->
---
interface Props {
  reversed?: boolean;
}
const { reversed = false } = Astro.props;
---

<div class={`flex flex-col md:flex-row gap-8 ${reversed ? 'md:flex-row-reverse' : ''}`}>
  <div class="md:w-1/2">
    <slot name="content" />
  </div>
  <div class="md:w-1/2">
    <slot name="media" />
  </div>
</div>
```

## Component Categories

### Layout Components (`components/layout/`)

- `Header.astro` — logo, navigation, mobile menu toggle, "Book Now" button
- `Footer.astro` — NAP details, quick links, social links, copyright
- `MobileMenu.astro` — slide-out mobile navigation (uses `<script>` for toggle)
- `Breadcrumbs.astro` — accepts breadcrumb items as props
- `PageWrapper.astro` — consistent max-width and padding via slot

### UI Components (`components/ui/`)

- `Button.astro` — primary (filled navy), secondary (outlined), CTA (filled mid-blue)
- `Card.astro` — rounded corners, subtle shadow, hover lift
- `SectionHeading.astro` — h2 with optional subtitle, consistent spacing
- `Badge.astro` — small labels for categories
- `ClickToCall.astro` — phone link with proper `tel:` href

### Section Components (`components/sections/`)

- `HeroSection.astro` — full-width hero with heading, subtext, CTA
- `ServiceGrid.astro` — 3-column grid of service cards
- `ConditionList.astro` — grid of conditions with links
- `TeamSection.astro` — practitioner cards with photo, name, credentials, bio
- `CTABanner.astro` — full-width call-to-action strip
- `FAQAccordion.astro` — expandable Q&A pairs (uses `<details>`/`<summary>` — zero JS)
- `MapSection.astro` — Google Maps embed with clinic details alongside
- `ContactSection.astro` — form + clinic details side by side

### Integration Components (`components/integrations/`)

- `BookingWidget.astro` — IconPractice link/iframe
- `ChatbotWidget.astro` — deferred script loader
- `GoogleMap.astro` — embedded map
- `Analytics.astro` — GA4 script in head
- `SchemaMarkup.astro` — JSON-LD schema injection

## Responsive Breakpoints

Follow Tailwind defaults:

- `sm`: 640px (large phones)
- `md`: 768px (tablets)
- `lg`: 1024px (small laptops)
- `xl`: 1280px (desktops)

### Mobile-First Rules

1. Default styles = mobile
2. Add complexity with `md:` and `lg:` prefixes
3. Navigation: hamburger menu below `lg`, full nav at `lg` and above
4. Grids: 1 column mobile → 2 columns tablet → 3 columns desktop
5. Hero text: smaller on mobile, scale up with breakpoints
6. Touch targets: minimum 44x44px on all interactive elements
7. No hover-only interactions — everything must work on touch

## Page Templates

### Standard Page Layout

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/sections/HeroSection.astro';
import CTABanner from '../components/sections/CTABanner.astro';
---

<BaseLayout title="Page Title | Banora Chiropractic" description="Meta description here">
  <Hero title="Page Title" ctaText="Book a Visit" ctaLink="/contact" />

  <!-- Content sections here -->

  <CTABanner />
</BaseLayout>
```

### Dynamic Route Pattern (Services, Conditions, Areas)

```astro
---
// src/pages/services/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/sections/HeroSection.astro';
import CTABanner from '../../components/sections/CTABanner.astro';
import { services } from '../../data/services';

export function getStaticPaths() {
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
}

const { service } = Astro.props;
---

<BaseLayout title={service.metaTitle} description={service.metaDescription} schema={service.schema}>
  <Hero title={service.title} subtitle={service.subtitle} />

  <section class="py-16 px-4 max-w-4xl mx-auto">
    <!-- service content -->
  </section>

  <CTABanner />
</BaseLayout>
```

All pages are statically generated at build time. No server-side rendering at request time.

## Handling Interactivity (The Astro Way)

### Zero-JS Solutions (Prefer These)

Many "interactive" elements don't actually need JavaScript:

**FAQ Accordion** — use native HTML:
```html
<details class="border-b border-gray-200 py-4">
  <summary class="cursor-pointer font-semibold text-brand-navy">
    {question}
  </summary>
  <p class="mt-3 text-gray-700">{answer}</p>
</details>
```

**Hover effects** — pure CSS via Tailwind:
```html
<div class="hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
```

### Lightweight JS (When Needed)

For things like mobile menu toggle, use a `<script>` tag:

```astro
<button id="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
  <svg><!-- hamburger icon --></svg>
</button>
<nav id="mobile-menu" class="hidden" aria-hidden="true">
  <!-- nav links -->
</nav>

<script>
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu?.setAttribute('aria-hidden', String(isOpen));
  });
</script>
```

### When to Use Framework Islands

Almost never for this project. The site is content-driven with minimal interactivity. If you find yourself reaching for React or Preact, stop and ask: can this be done with a `<script>` tag or native HTML? The answer is almost always yes.

## Forms (No JavaScript Required)

Formspree works with plain HTML forms:

```html
<form action="https://formspree.io/f/mpqjeego" method="POST">
  <input type="text" name="_gotcha" style="display:none" />  <!-- honeypot -->

  <label for="name">Name</label>
  <input type="text" id="name" name="name" required />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="phone">Phone</label>
  <input type="tel" id="phone" name="phone" />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Send Message</button>
</form>
```

No JavaScript, no state management, no form libraries. It just works.

## Accessibility Requirements

- All images have descriptive `alt` text
- Form inputs have associated `<label>` elements (use `for` attribute)
- Buttons have clear text or `aria-label`
- Focus states are visible: `focus:ring-2 focus:ring-brand-blue focus:outline-none`
- Colour contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text)
- Skip-to-main-content link as first focusable element in BaseLayout
- Semantic HTML throughout: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Mobile menu uses `aria-expanded` and `aria-hidden`
- `<details>`/`<summary>` for accordions (built-in accessibility)

## Animation Guidelines

Keep animations subtle and purposeful:

- Cards: slight lift on hover (`hover:-translate-y-1 hover:shadow-lg transition-all duration-200`)
- Buttons: subtle scale on hover (`hover:scale-105 transition-transform`)
- Mobile menu: CSS transition for slide-in
- Scroll animations: use CSS `@keyframes` with Intersection Observer in a `<script>` tag — not a library
- Respect `prefers-reduced-motion`: wrap animations in `@media (prefers-reduced-motion: no-preference)`
- No animations that delay content visibility — content should be immediately readable
