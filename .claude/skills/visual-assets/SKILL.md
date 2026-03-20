---
name: visual-assets
description: "Visual and image asset creator for Banora Chiropractic — generates, sources, and optimises imagery for the website including hero banners, service icons, SVG illustrations, team photo guidance, and web-optimised images. Use this skill whenever the user needs images, icons, illustrations, banners, graphics, photos, SVGs, or any visual content for the website. Also trigger when the user mentions image optimisation, compression, WebP conversion, alt text, hero images, service icons, team photos, branding visuals, or asks about sourcing stock photography. Trigger even for casual mentions like 'we need pictures for the site' or 'what about images for the services page'."
---

# Visual & Image Assets — Banora Chiropractic

You handle everything visual for the website — from creating SVG icons and illustrations to sourcing photography, guiding team photo shoots, and optimising every image for fast loading. Every visual should feel professional, warm, and consistent with the Banora Chiropractic brand.

## Brand Visual Identity

### Colour Palette (for all generated assets)
```
Primary accent:  #feb101 (golden amber)
Dark:            #1a1a2e (headings, dark sections)
Text:            #333333 (body)
Light text:      #666666 (secondary)
Light grey:      #abb8c3 (borders, subtle elements)
Off-white:       #f8f9fa (backgrounds)
White:           #ffffff
Success green:   #00d084
Info blue:       #0693e3
```

### Visual Style
- **Clean and professional** — healthcare, not startup. No neon, no harsh contrasts.
- **Warm and approachable** — soft edges, natural tones, real-feeling imagery.
- **Consistent** — every asset should look like it belongs to the same family.
- **Uncluttered** — generous whitespace, no visual noise. Let the image breathe.

## Asset Types

### 1. Hero Banners

Full-width images that sit behind headline text on each page. They set the emotional tone instantly.

**Requirements:**
- **Dimensions:** 1920×800px (desktop), with safe zone for text overlay in centre 1200×600px
- **Format:** WebP with JPEG fallback
- **File size target:** Under 200KB after compression (critical for LCP — this is usually the largest element on the page)
- **Style:** Professional photography or high-quality stock. Slightly desaturated to sit behind text without competing. Subtle dark gradient overlay from bottom (for text readability).

**Hero image concepts by page:**

| Page | Image Concept | Mood |
|---|---|---|
| Homepage | Chiropractor adjusting patient, clinic setting visible | Trust, expertise, warmth |
| About | Wide shot of the clinic exterior or team together | Established, welcoming |
| Back Pain | Person holding lower back, transitioning to active/relieved | Empathy → hope |
| Neck Pain | Person at desk touching neck, natural light | Relatable, everyday |
| Headaches | Close-up of temples being touched, soft lighting | Calm, relief |
| Sciatica | Person struggling to stand from chair | Recognition, understanding |
| Sports Injuries | Active person (surfing, running — local feel) | Energy, aspiration |
| Pregnancy | Pregnant woman, comfortable and confident | Gentle, safe |
| Contact | Clinic entrance or Greenway Drive streetscape | Familiar, easy to find |

**Sourcing hero images:**

Use WebSearch to find appropriate stock photography from these free/paid sources:
- **Unsplash** (unsplash.com) — free, high quality
- **Pexels** (pexels.com) — free
- **Pixabay** (pixabay.com) — free
- **Shutterstock** (shutterstock.com) — paid, widest healthcare selection
- **iStock** (istockphoto.com) — paid

Search tips for chiropractic stock photos:
- "chiropractor treating patient" NOT "chiropractor cracking back" (avoid aggressive imagery)
- "back pain relief" gets better results than "chiropractic adjustment"
- "physiotherapy clinic" often returns images that work well for chiropractic too
- Filter by "landscape" orientation for hero banners
- Look for diverse ages and body types — the practice sees everyone from kids to grandparents
- Avoid obviously American settings (US-style clinics, US power outlets visible)

**Important:** Provide the user with links to specific images they can license. Never generate fake stock photo URLs or claim an image exists without verifying.

### 2. Service Icons

Small, consistent icons used on service cards, navigation, and mobile menus. These should be SVG — infinitely scalable, tiny file size, and styled with CSS.

**Icon specifications:**
- **Format:** SVG (inline or component)
- **Viewbox:** 64×64 or 48×48
- **Stroke style:** 2px stroke, no fill (line icon style) — cleaner and more modern than filled icons
- **Colour:** Use `currentColor` so icons inherit text colour from CSS. Accent elements in #feb101.
- **Corners:** Rounded (stroke-linecap="round", stroke-linejoin="round")
- **Consistency:** All icons must share the same stroke weight, corner radius, and visual density

**Icons needed:**

| Service | Icon Concept | SVG Description |
|---|---|---|
| Back Pain | Spine with radiating pain indicator | Simplified spine (5-6 vertebrae), small radiating lines at lumbar region |
| Neck Pain | Head/neck profile with highlight | Side profile of head and neck, gentle curve, highlight on cervical area |
| Headaches & Migraines | Head with pulse/pressure lines | Front-facing head outline, concentric pressure lines at temples |
| Sciatica | Leg with nerve line | Simplified leg outline, dashed or highlighted line from hip to foot (sciatic nerve path) |
| Sports Injuries | Running figure with highlight | Dynamic figure mid-stride, small highlight on knee/ankle area |
| Pregnancy Chiropractic | Pregnant figure profile | Side profile silhouette, gentle curves, hand on lower back |
| Scoliosis | Spine with lateral curve | Spine showing characteristic S-curve deviation |
| Shoulder Pain | Shoulder joint with highlight | Upper body outline, radiating lines at shoulder joint |
| Joint Pain | Joint with movement arcs | Generic joint (knee or elbow), small motion arc lines |
| Family Chiropractic | Adult and child figures | Two simplified figures, one tall one small, suggesting parent and child |
| Spinal Adjustment | Hands on spine | Two hands positioned on either side of spine, suggesting manual adjustment |
| Posture Correction | Figure with alignment line | Standing figure with vertical dotted line showing ideal alignment |

**Example SVG template:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Icon paths here -->
</svg>
```

When generating SVGs, write the actual SVG code — not a description of what it should look like. Make it clean, minimal, and recognisable at 48px display size. Test that the icon reads clearly at small sizes by keeping detail minimal.

### 3. SVG Illustrations

Larger illustrations used for empty states, feature sections, or decorative elements. More detailed than icons but still vector-based.

**Illustration specifications:**
- **Format:** SVG
- **Style:** Flat illustration with subtle depth. Use the brand colour palette. Friendly and modern, not cartoonish.
- **Dimensions:** Flexible viewbox, typically 400×300 or similar
- **Complexity:** Medium — enough detail to be interesting, simple enough to load instantly

**Illustration concepts:**

| Use | Concept | Description |
|---|---|---|
| 404 page | Misaligned spine | Humorous — spine with one vertebra out of place, "something's not quite right" |
| Loading state | Spine alignment animation | Simple spine that aligns vertebra by vertebra (CSS animated) |
| Contact page | Map pin on clinic | Stylised map fragment with golden pin on Greenway Drive |
| How it works | 3-step process | Three connected illustrations: assess → treat → maintain |
| Testimonials bg | Abstract spine curve | Decorative curved line suggesting a healthy spine, brand colours |

### 4. Team Photo Guidance

The practice will need professional photos of Dr James and Dr Paul. Provide a complete brief they can hand to a photographer.

**Photo shoot brief:**

**Shots needed:**
1. **Individual headshots** (for team page, Google Business Profile, directory listings)
   - Head and shoulders, looking at camera
   - Genuine smile — not forced, not too serious
   - Neutral or clinic background (slightly blurred)
   - Good lighting on face, no harsh shadows
   - Wearing clinic polo/uniform or smart-casual (no white coat unless that's what they actually wear)

2. **Treatment shots** (for homepage, service pages, hero banners)
   - Chiropractor performing adjustment on a patient
   - Patient should look comfortable, not in pain
   - Show hands-on technique — this is what differentiates chiro from other health services
   - Multiple angles: side-on, over-the-shoulder, wide establishing shot
   - Include shots of both manual adjustment and gentler techniques (Activator)

3. **Clinic shots** (for about page, Google Business Profile, location pages)
   - Reception/waiting area — clean, welcoming
   - Treatment room — professional, well-equipped
   - Exterior/entrance — shows accessibility (ground floor, parking)
   - Signage

4. **Lifestyle/candid shots** (for homepage, social media)
   - Practitioners chatting with a patient (not during treatment)
   - Team together, relaxed and natural
   - Walking through the clinic

**Technical requirements for photographer:**
- Minimum resolution: 3000px on longest edge
- Shoot in RAW + JPEG
- Landscape orientation for hero/banner use, portrait for headshots
- Colour-corrected, consistent white balance across the set
- Deliver: 30-50 edited images, full resolution

**Styling notes:**
- Clinic should be tidy but not sterile — a plant, some warmth
- Remove any clutter, old posters, or dated equipment from frame
- Natural light where possible, supplement with soft artificial
- Patient models: diverse ages if possible (young adult, middle-aged, older). Get signed model release forms.

**Budget guidance:** A local photographer in the Tweed area will typically charge $300-800 for a 1-2 hour shoot with edited images. Search for "commercial photographer tweed heads" or "business photography gold coast" to find local options.

### 5. Favicon & Brand Marks

**Favicon set needed:**
- `favicon.ico` — 32×32 and 16×16 (multi-size ICO)
- `apple-touch-icon.png` — 180×180
- `favicon-32x32.png` — 32×32
- `favicon-16x16.png` — 16×16
- `android-chrome-192x192.png` — 192×192
- `android-chrome-512x512.png` — 512×512

**Design:** Simplified version of the practice logo that reads clearly at 16px. If the current logo is too detailed for small sizes, create a lettermark ("BC" in Merriweather, with the golden amber accent).

**Open Graph image:**
- `og-image.jpg` — 1200×630px
- Used when the site is shared on Facebook, LinkedIn, messaging apps
- Include: logo, practice name, tagline, contact number
- Brand colours, clean layout
- Must look good as a small thumbnail

## Image Optimisation

Every image on the site must be optimised. This directly affects page speed, Core Web Vitals, and search rankings.

### Optimisation Pipeline

**Step 1: Right format**

| Content | Format | Why |
|---|---|---|
| Icons, illustrations, logos | SVG | Infinitely scalable, tiny size, style with CSS |
| Photos (hero, team, blog) | WebP (primary), JPEG (fallback) | WebP is 25-35% smaller than JPEG at same quality |
| Transparent images | WebP or PNG | WebP preferred, PNG fallback for older browsers |
| Animated elements | CSS animation on SVG | Never use GIF — enormous file sizes |

**Step 2: Right dimensions**

Don't serve a 4000px image to a phone screen. Use Next.js Image component which handles responsive sizing automatically, but source images should be prepared at sensible maximum dimensions:

| Usage | Max Width | Aspect Ratio |
|---|---|---|
| Hero banner | 1920px | 2.4:1 (1920×800) |
| Service card image | 800px | 4:3 or 3:2 |
| Team headshot | 600px | 3:4 (portrait) |
| Blog post image | 1200px | 16:9 or 3:2 |
| Thumbnail | 400px | 1:1 or 4:3 |
| OG image | 1200px | 1200×630 (fixed) |

**Step 3: Compression**

Target file sizes:

| Asset Type | Target Size |
|---|---|
| Hero banner (WebP) | Under 200KB |
| Service/blog image (WebP) | Under 100KB |
| Team headshot (WebP) | Under 80KB |
| Thumbnail (WebP) | Under 30KB |
| SVG icon | Under 2KB |
| SVG illustration | Under 10KB |

**Compression tools (command line):**
```bash
# Convert to WebP (requires cwebp)
cwebp -q 80 input.jpg -o output.webp

# Optimise JPEG (requires jpegoptim)
jpegoptim --max=85 --strip-all image.jpg

# Optimise PNG (requires pngquant)
pngquant --quality=65-80 --force --output output.png input.png

# Optimise SVG (requires svgo)
svgo input.svg -o output.svg

# Batch convert all JPEGs in a directory to WebP
for f in *.jpg; do cwebp -q 80 "$f" -o "${f%.jpg}.webp"; done
```

**Using Sharp in the build pipeline (Node.js):**
```typescript
// scripts/optimise-images.ts
import sharp from 'sharp';

async function optimiseImage(input: string, output: string) {
  await sharp(input)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
}
```

**Step 4: Next.js Image Component**

Always use `next/image` — it handles lazy loading, responsive srcset, format negotiation (WebP/AVIF), and blur placeholder automatically.

```tsx
import Image from 'next/image';

<Image
  src="/images/hero-homepage.webp"
  alt="Dr James performing a chiropractic adjustment at Banora Chiropractic"
  width={1920}
  height={800}
  priority  // Only for above-fold hero images
  className="object-cover"
  sizes="100vw"
/>
```

**Priority loading rules:**
- `priority` on hero images (above the fold) — prevents lazy loading, improves LCP
- Everything below the fold: let Next.js lazy load automatically
- Use `placeholder="blur"` with `blurDataURL` for a smooth loading experience

### Alt Text Guidelines

Every image needs descriptive alt text. This matters for accessibility and SEO.

**Rules:**
- Describe what's IN the image, not what the image IS FOR
- Include relevant keywords naturally, don't stuff
- Keep under 125 characters
- Don't start with "Image of" or "Photo of" — screen readers already announce it as an image

**Examples:**

| Bad | Good |
|---|---|
| "back pain" | "Woman holding her lower back while standing up from a desk chair" |
| "team photo" | "Dr James Shipway and Dr Paul Cater in the Banora Chiropractic clinic" |
| "Image of chiropractic adjustment" | "Chiropractor performing a gentle spinal adjustment on a patient" |
| "hero banner" | "Banora Chiropractic clinic entrance on Greenway Drive, Tweed Heads South" |
| "" (empty) | Never leave alt text empty unless the image is purely decorative |

For purely decorative images (background patterns, dividers), use `alt=""` and `aria-hidden="true"`.

## File Organisation

```
public/
├── images/
│   ├── hero/
│   │   ├── homepage.webp
│   │   ├── about.webp
│   │   ├── back-pain.webp
│   │   └── ...
│   ├── team/
│   │   ├── dr-james-shipway.webp
│   │   ├── dr-paul-cater.webp
│   │   └── team-group.webp
│   ├── services/
│   │   ├── back-pain.webp
│   │   ├── neck-pain.webp
│   │   └── ...
│   ├── blog/
│   │   └── [post-slug].webp
│   ├── clinic/
│   │   ├── exterior.webp
│   │   ├── reception.webp
│   │   └── treatment-room.webp
│   └── og-image.jpg
├── icons/
│   ├── back-pain.svg
│   ├── neck-pain.svg
│   ├── headaches.svg
│   └── ...
├── illustrations/
│   ├── 404-spine.svg
│   ├── process-steps.svg
│   └── ...
├── favicon.ico
├── apple-touch-icon.png
└── site.webmanifest
```

**Naming convention:** Lowercase, hyphen-separated, descriptive. `dr-james-shipway-headshot.webp` not `IMG_4521.jpg`.

## Working With Other Skills

- **Website Builder** provides the component structure — this skill provides the visual assets that go into those components.
- **Content Writer** provides alt text context — coordinate so alt text matches the content's message.
- **SEO Expert** identifies which pages need hero images and what keywords to include in alt text.

When generating or sourcing images, always consider the page context and what the other skills need. A service page hero image should complement the service page copy, not contradict it.
