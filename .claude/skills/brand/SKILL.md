---
name: brand
description: Brand consistency skill for Banora Chiropractic website. Use this skill whenever making visual decisions — choosing colours, styling components, selecting fonts, sizing elements, placing logos, or ensuring visual consistency across pages. Trigger this for any design or styling task, even small ones like choosing a background colour or button style. If it affects how the site looks, this skill applies.
---

# Brand Skill — Banora Chiropractic

## Colour System

### Primary Palette

| Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| Navy | #1B3A5C | `brand-navy` | Headers, footer, nav, primary text |
| Mid Blue | #2C5F8A | `brand-blue` | Buttons, links, accents, CTAs |
| Light Blue | #5B9EC9 | `brand-light-blue` | Hover states, highlights, secondary CTA |
| Light Grey | #F5F5F5 | `brand-grey` | Section backgrounds, alternating rows |
| White | #FFFFFF | `white` | Primary background |
| Dark Text | #1A1A1A | `gray-900` | Body text |

### Colour Usage Rules

- **Navy** is dominant — used for header, footer, and primary headings
- **Mid Blue** is the action colour — buttons, links, interactive elements
- **Light Blue** is for hover/active states and subtle highlights
- **Light Grey** alternates with white for section backgrounds (creates visual rhythm)
- Never use more than 3 brand colours on a single section
- Text on navy/blue backgrounds must be white for contrast
- Links in body text use mid blue with underline on hover

### Colour Combinations (Approved)

- Navy background + white text (header, footer, hero overlays)
- White background + navy headings + dark text body
- Light grey background + navy headings + dark text body
- Mid blue button + white text
- Light blue button + navy text (secondary actions)

### Colour Combinations (Avoid)

- Light blue text on white background (poor contrast)
- Navy text on mid blue background (poor contrast)
- Multiple bright colours competing in one section

## Typography

### Font Stack

- **Headings**: Montserrat (600, 700 weights) — or equivalent clean, professional sans-serif
- **Body**: Open Sans (400, 600 weights) — or equivalent highly readable sans-serif

### Type Scale

| Element | Mobile | Desktop | Weight | Colour |
|---|---|---|---|---|
| H1 | 28px | 42px | 700 | brand-navy |
| H2 | 24px | 32px | 600 | brand-navy |
| H3 | 20px | 24px | 600 | brand-navy |
| Body | 16px | 18px | 400 | dark text |
| Small | 14px | 14px | 400 | gray-600 |
| Button | 16px | 16px | 600 | white |

### Typography Rules

- Line height: 1.6 for body, 1.2 for headings
- Maximum line length: 75 characters (use `max-w-prose` in Tailwind)
- Heading spacing: generous margin-top (2-3x body spacing), tighter margin-bottom
- Never use all-caps for body text — acceptable for short labels and buttons

## Spacing System

Use Tailwind's default spacing scale consistently:

- **Section padding**: `py-16 md:py-24` (vertical), `px-4 md:px-8` (horizontal)
- **Between sections**: no extra margin — section padding handles it
- **Card padding**: `p-6 md:p-8`
- **Between cards**: `gap-6 md:gap-8`
- **Content max width**: `max-w-7xl mx-auto`
- **Text content max width**: `max-w-prose` (65ch)

## Component Styles

### Buttons

```
Primary:   bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold
           hover:bg-brand-navy transition-colors
Secondary: border-2 border-brand-blue text-brand-blue px-6 py-3 rounded-lg font-semibold
           hover:bg-brand-blue hover:text-white transition-colors
CTA:       bg-brand-blue text-white px-8 py-4 rounded-lg font-semibold text-lg
           hover:bg-brand-navy transition-colors shadow-md
```

### Cards

```
bg-white rounded-lg shadow-sm p-6 md:p-8
hover:shadow-md hover:-translate-y-1 transition-all duration-200
```

### Section Alternating Pattern

```
Section 1: bg-white
Section 2: bg-brand-grey
Section 3: bg-white
Section 4: bg-brand-grey
(or: hero with navy overlay → white → grey → white → CTA banner in navy)
```

## Logo Usage

- Full logo in header (left-aligned)
- Minimum clear space around logo: equal to the height of the logo text
- On navy backgrounds: use white version of logo
- On white/grey backgrounds: use navy version of logo
- Never stretch, rotate, or alter the logo proportions
- Favicon: simplified logo mark or initials

## Photography & Imagery

- Warm, natural lighting preferred
- Show real people where possible (team photos, clinic environment)
- Avoid generic stock photos of spines and skeletons
- Use images that convey trust, warmth, and professionalism
- Image treatment: slight rounded corners (8px) when in cards
- Hero images: can use a navy overlay at 60-70% opacity with white text on top

## Visual Hierarchy (Every Page)

1. **Hero** — largest text, biggest visual impact, primary CTA
2. **Section headings** — clearly separated, navy colour, generous spacing
3. **Body content** — readable, well-spaced, scannable
4. **Cards/features** — consistent sizing, clear labels
5. **CTA banner** — stands out from content sections (navy background)
6. **Footer** — quieter, informational, navy background

The eye should flow naturally from top to bottom, with clear visual breaks between sections and obvious next actions (CTAs) at key decision points.
