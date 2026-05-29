# PostureProClinic

Web-based posture analysis tool for chiropractic clinics. Capture, mark, measure, report — on any device with a camera and a browser.

## Status

Scaffold. The biomechanics engine and data models are real working code with tests. UI components are stubs with TODOs for Claude Code to flesh out.

## Requirements

- Node.js 20+
- A modern browser (Chrome, Safari, Firefox, Edge)
- Camera access permission

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your laptop or, for camera testing, on your phone over the same Wi-Fi.

For camera access on a phone you'll need HTTPS — `npm run dev` works on `localhost`, and Vercel preview deployments give you HTTPS automatically.

## Running tests

```bash
npm test
```

## Project layout

See `CLAUDE.md`.

## Key references

- Hansraj, K. K. (2014). Assessment of stresses in the cervical spine caused by posture and position of the head. *Surgical Technology International*, 25, 277–279.
- Kendall, F. P. et al. *Muscles: Testing and Function with Posture and Pain*.

## License

Private. Banora Chiropractic / Palm Beach Chiropractic & Remedial.
