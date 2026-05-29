# PostureProClinic

Web-based posture analysis app for chiropractic clinics. Take photos of patients in lateral and AP views, place anatomical landmarks, calculate postural deviations, and visualise the biomechanical load those deviations place on the body.

## Purpose

Built for Banora Chiropractic and Palm Beach Chiropractic & Remedial. Replaces manual measurement of postural deviations during initial consults and re-assessments. Inspired by PostureScreen / PostureCo workflows but tailored to the clinic's reporting style and AHPRA compliance constraints.

## Platform

Web app, runs in any modern browser (Chrome, Safari, Firefox, Edge). Works on Android, iPhone, iPad, and laptops. Installable as a PWA on Android and iOS for an app-like home-screen icon and full-screen experience.

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Deployed on Vercel
- IndexedDB (via `idb` library) for on-device patient storage
- Browser `getUserMedia` API for camera capture
- Optional later: Vercel Postgres or Upstash Redis for cross-device sync

Same architecture family as `banora-social-autopilot` — JS/TS, Vercel, no native build tooling.

## Core Workflow

1. Select or create patient
2. Capture lateral (side) photo with plumb-line overlay
3. Capture AP (front) photo with vertical guide
4. Tap to place anatomical landmarks on each photo
5. App calculates angles, deviations, and biomechanical loads
6. Generate report — photo + overlays + numeric findings + load diagram
7. Save to patient record, optionally print to PDF via browser

## Posture Analyses Included

### Lateral view
- Forward head carriage (tragus relative to acromion / C7 plumb line)
- Shoulder roll / protraction (acromion relative to plumb line)
- Pelvic tilt (ASIS to PSIS angle relative to horizontal)
- Overall plumb-line alignment (ear → shoulder → hip → knee → ankle)

### AP view
- Head tilt (eye line vs horizontal)
- Shoulder unleveling (acromion height differential)
- Pelvic unleveling (iliac crest height differential)
- Knee valgus/varus (Q angle estimate from hip, knee, ankle)
- Lateral postural sway (vertical line from suprasternal notch through pelvic midpoint)

## Biomechanical Load Model

Forward head carriage load uses the Hansraj 2014 model:
- 0° ≈ 4.5–5.5 kg (head's natural weight)
- 15° forward ≈ 12 kg effective load
- 30° ≈ 18 kg
- 45° ≈ 22 kg
- 60° ≈ 27 kg

Implemented as a continuous piecewise-linear function in `src/lib/biomechanics/cervical-load.ts` so the patient sees their exact number, not a bucketed estimate.

## Report Output

Modelled on the PostureScreen report (see reference PDF that informed the design). Three pages:

1. **Summary page** — letterhead, intro paragraph, AP and lateral thumbnails with bullet findings beside each, Posture Index boxes, and the headline "Effective Head Weight" callout
2. **Anterior view** — full-page annotated photo
3. **Lateral view** — full-page annotated photo

Annotations: yellow landmark dots, red lines between paired AP landmarks or along the lateral posture chain (tragus → acromion → trochanter → knee → ankle), green plumb line.

Voice of report copy is descriptive and AHPRA-safe — modelled on phrases like *"Your head weighs approximately 5.7 kg. It is shifted 4.73 cm forward, 12.2° off vertical. Based on physics, your head now effectively weighs 16.4 kg instead of 5.7 kg."* See `src/lib/biomechanics/narrative.ts`.

Posture Index aggregates all shifts (cm) and tilts (°) into two single numbers per view — easy to compare between sessions and a useful headline for re-assessment conversations.

Reports print via the browser's built-in Print dialog (File → Print → Save as PDF). The `report-page` CSS class plus print media queries handle A4 sizing and page breaks. No external PDF library needed.

## Compliance Notes

- This is a clinical assessment tool, not a diagnostic device. UI copy must avoid therapeutic claims.
- Patient photos are sensitive health information under the Privacy Act 1988 (Cth) and APP 11. Storage is on-device (IndexedDB) by default; any future cloud sync must be encrypted in transit and at rest.
- Reports must not contain language banned under AHPRA s133: no "cure," "fix," "best," "guaranteed," "expert," and no testimonials in reports.
- Explicit written patient consent is required before photographing. The app has a consent capture step before first photo.

## Architecture

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── page.tsx            # Landing / patient list
│   ├── patient/[id]/       # Patient detail + sessions
│   └── api/                # Future: sync endpoints
├── components/
│   ├── patients/           # Patient list, new patient form
│   ├── capture/            # Camera UI + overlay guides
│   ├── landmarks/          # Tap-to-place landmark editor
│   ├── analysis/           # Live findings panel
│   └── report/             # Final report view + print layout
├── lib/
│   ├── models/             # TypeScript types (Patient, Session, Landmark)
│   ├── biomechanics/       # Pure calculation functions, no UI imports
│   └── storage/            # Repository interface + IndexedDB impl
├── styles/                 # Tailwind globals
tests/
└── biomechanics/           # Vitest unit tests for the engine
```

## Storage Strategy

`PatientRepository` interface in `src/lib/storage/patient-repository.ts`. Two implementations to start:
- `IndexedDBPatientRepository` — on-device, default
- `MockPatientRepository` — for tests

Later options (design must not block them):
- Vercel Postgres + Upstash for cross-clinic sync
- IconPractice integration (if their API supports it)

## Build Notes

- Coordinates stored as fractions of image dimensions (0.0–1.0), not pixels, so zoom and resize don't break them
- Each landmark has a stable `LandmarkID` string literal type — never raw strings sprinkled through the code
- All angles in degrees in the UI, radians internally during math
- Biomechanics functions must be pure: input landmarks → output measurements. No DOM access, no React imports.
- The camera workflow uses `getUserMedia({ video: { facingMode: 'environment' } })` on mobile so the back camera is used by default

## Open Questions to Resolve Before V1 Ships

- Consent flow — paper form scan, or in-app signature drawing?
- Patient identifier — should we use the IconPractice patient ID as a foreign key for future linkage?
- PDF report styling — match Banora Navy/Gold palette
- Whether to support multi-clinician sync now (CloudKit equivalent on the web is custom server-side)
