---
name: performance
description: Performance optimisation skill for the Banora Chiropractic Astro website. Use this skill when building pages, adding images, loading third-party scripts, reviewing Lighthouse scores, or debugging slow load times. Trigger this whenever performance, page speed, Core Web Vitals, Lighthouse, loading time, or optimisation is mentioned. Also use when adding any new script, image, font, or external resource to the site.
---

# Performance Skill — Banora Chiropractic (Astro)

## Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 100 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Total page weight | < 500KB |

## Astro's Performance Advantage

Astro ships zero JavaScript by default. Every `.astro` component renders to pure HTML at build time. This means our baseline is already incredibly fast. The main job of this skill is to make sure we don't accidentally add weight back in.

## Image Optimisation

### Using Astro's Image Component

For images in `src/assets/`:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image src={heroImage} alt="Banora Chiropractic clinic entrance" width={1200} height={600} />
```

Astro will automatically optimise, resize, and convert to WebP.

### For Images in `/public/`

Use native `<img>` with explicit dimensions:

```html
<img src="/images/service.webp" alt="Chiropractic adjustment" width="400" height="300" loading="lazy" decoding="async" />
```

### Image Rules

1. Always set `width` and `height` to prevent layout shift (CLS)
2. Above-the-fold hero images: use `loading="eager"` (or Astro's `<Image>` with `loading="eager"`)
3. Everything else: `loading="lazy"` (default behaviour)
4. Use WebP format for all images
5. Size images appropriately — don't serve 2000px for a 400px card
6. Compress all source images before adding to the project
7. Use `decoding="async"` on all images

## Font Loading

### Self-Hosted Fonts (Preferred)

Download font files and serve from `/public/fonts/` for maximum performance:

```css
/* src/styles/global.css */
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat-600.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/open-sans-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### Font Rules

1. Use WOFF2 format (smallest file size, best browser support)
2. Limit to 2 font families (heading + body)
3. Only load the weights you actually use
4. Always use `font-display: swap` to prevent invisible text
5. Preload critical fonts in BaseLayout `<head>`:

```html
<link rel="preload" href="/fonts/montserrat-600.woff2" as="font" type="font/woff2" crossorigin />
```

## JavaScript Budget

Astro ships zero JS by default. Keep it that way for most pages.

### Acceptable JavaScript

- Mobile menu toggle (`<script>` tag, ~20 lines)
- Scroll-triggered animations via Intersection Observer (`<script>` tag, ~30 lines)
- Chatbot widget (external script, loaded with `defer`)
- Google Analytics (external script, loaded with `async`)
- Form validation if needed (`<script>` tag, lightweight)

### Not Acceptable

- React, Vue, or any framework for simple interactivity
- Animation libraries (GSAP, Framer Motion) — use CSS transitions
- jQuery or any utility library
- Heavy polyfills
- Multiple third-party scripts loading synchronously

## Script Loading Strategy

```html
<!-- Critical: in <head> -->
<link rel="preload" href="/fonts/montserrat-600.woff2" as="font" type="font/woff2" crossorigin />

<!-- Analytics: async, non-blocking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>

<!-- Chatbot: deferred, loads after page -->
<script defer src="https://thriving-conkies-08c1ca.netlify.app/banora-chatbot-widget.js"></script>

<!-- Component scripts: bundled by Astro, only where needed -->
<script>
  // inline component JS — Astro handles bundling
</script>
```

### Third-Party Script Loading Order

**Priority** (load first):
1. Critical CSS (inlined by Astro automatically)
2. Preloaded fonts
3. Hero image (`loading="eager"`)

**After page renders:**
4. Google Analytics (`async`)
5. Google Maps iframe (only on contact page)

**Deferred / on demand:**
6. Chatbot widget (`defer`)
7. Any non-critical scripts

## Static Site Generation

Every page is built to static HTML at build time via `getStaticPaths()`:

```astro
---
export function getStaticPaths() {
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
}
---
```

This means:
- Zero server-side processing at request time
- Pages served directly from Vercel's CDN edge
- Fastest possible time to first byte (TTFB)
- Works even if a server goes down

**Never use SSR for this project.** Keep `output: 'static'` in `astro.config.mjs`.

### Astro Config for Performance

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
```

## CSS Optimisation

- Tailwind purges unused classes automatically in production builds
- Astro inlines critical CSS by default — don't fight it
- Avoid large custom CSS files — use Tailwind utilities
- If using custom CSS, keep it in `global.css` and limit to variables, font-faces, and base resets

## Performance Checklist

Before deploying any page:

- [ ] All images have explicit `width` and `height` attributes
- [ ] Hero image uses `loading="eager"`; all others use `loading="lazy"`
- [ ] No unnecessary `<script>` tags — is there a CSS-only or HTML-native alternative?
- [ ] Third-party scripts use `async` or `defer`
- [ ] Fonts self-hosted as WOFF2 with `font-display: swap`
- [ ] Critical fonts preloaded in `<head>`
- [ ] `astro.config.mjs` has `output: 'static'` and `compressHTML: true`
- [ ] Run Lighthouse audit — all scores meet targets
- [ ] No layout shift on load (check CLS with DevTools)
- [ ] Total page weight under 500KB (check Network tab)
- [ ] No render-blocking resources in `<head>`
