# Phase 1 Prompt — Paste into Claude Code

```
TASK: SEO Migration Phase 1 — Add 301 redirects to vercel.json

Open banora-website/vercel.json and add the following redirects to the "redirects" array. If no "redirects" array exists, create one.

Add these redirect entries (both with and without trailing slash):

/about-us → /about
/contact-us → /contact
/new-patients → /patient-resources
/dr-james-shipway → /about
/dr-paul-cater → /about
/home → /

All redirects should be permanent (301). Use this format:
{ "source": "/about-us", "destination": "/about", "permanent": true }
{ "source": "/about-us/", "destination": "/about", "permanent": true }

Do both slash and non-slash versions for every entry.

ALSO: Check the existing vercel.json for any conflicting redirects or rewrites that might interfere. If you find any, flag them for me before changing anything.

After adding, show me the full updated redirects array so I can review before we move on.
```

---

# Phase 2 Prompt — Use after Phase 1 is confirmed

```
TASK: SEO Migration Phase 2a — Create /services index page

Create banora-website/src/pages/services/index.astro

Requirements:
1. Import the services data from src/data/services.ts
2. Use the existing BaseLayout component (check src/layouts/BaseLayout.astro for the pattern)
3. Meta title: "Chiropractic Services | Banora Chiropractic | Tweed Heads South"
4. Meta description: "Explore our full range of chiropractic services at Banora Chiropractic, Tweed Heads South. Adjustments, posture correction, sports, pregnancy, and paediatric chiropractic care."
5. Content: Display a grid of cards — each card shows the service title, a short description, and links to /services/{slug}
6. Match the design style and component patterns already used on other pages in the project
7. Include BreadcrumbList schema markup (check how other pages handle this)

Show me the file when done so I can review before moving to the conditions index page.
```

---

# Phase 2b Prompt — Use after services index is confirmed

```
TASK: SEO Migration Phase 2b — Create /conditions index page

Create banora-website/src/pages/conditions/index.astro

Requirements:
1. Import conditions data from src/data/conditions.ts
2. Use the existing BaseLayout component
3. Meta title: "Conditions We Help | Chiropractor Tweed Heads South | Banora Chiropractic"
4. Meta description: "Banora Chiropractic may help with back pain, neck pain, sciatica, headaches, shoulder pain and more. See all conditions we commonly assist with in Tweed Heads South."
5. Content: Grid of cards — each card shows condition title, short description, link to /conditions/{slug}
6. Match the same design pattern used for the services index page you just created
7. Include BreadcrumbList schema markup

Show me the file when done.
```

---

# Phase 3 Prompt — Fees page

```
TASK: SEO Migration Phase 3 — Create /fees page

Create banora-website/src/pages/fees.astro

Requirements:
1. First read src/data/clinic.ts and show me what pricing data is available
2. Use the existing BaseLayout component
3. Meta title: "Chiropractic Prices | Affordable Chiropractic Fees | Banora Chiropractic" (preserve this exact title — it has ranking history from the old site)
4. Meta description: "Affordable and accessible chiropractic care. View our chiropractic fees and prices. Located at Banora Point / Tweed Heads South NSW. Book online today."
5. Content should include:
   - All pricing tiers (new patient consult, regular adjustment, baby/newborn — whatever is in clinic.ts)
   - Health fund information
   - DVA/EPC note
   - A clear CTA to book online
6. Include BreadcrumbList + WebPage schema
7. Match existing site design patterns

Show me the file and flag if clinic.ts is missing any pricing data I need to provide.
```

---

# Phase 4 Prompt — Privacy policy + Thank you pages

```
TASK: SEO Migration Phase 4 — Create privacy policy and thank you pages

Create TWO pages:

1. banora-website/src/pages/privacy-policy.astro
   - Standard Australian privacy policy for a chiropractic clinic
   - Business name: Banora Chiropractic
   - Location: Tweed Heads South, NSW
   - Meta title: "Privacy Policy | Banora Chiropractic"
   - Add <meta name="robots" content="noindex"> so Google doesn't index this
   - Use BaseLayout

2. banora-website/src/pages/thank-you.astro
   - Confirmation page shown after contact form submission
   - Meta title: "Thank You | Banora Chiropractic"
   - Add <meta name="robots" content="noindex">
   - Content: Thank you message, confirmation their enquiry was received, link back to homepage
   - Optional: auto-redirect to homepage after 5 seconds
   - Use BaseLayout

Show me both files when done.
```

---

# Phase 5 Prompt — Final checks

```
TASK: SEO Migration Phase 5 — Pre-launch verification

Do these checks and report back:

1. Open src/pages/index.astro and confirm the meta title includes the keyword "Tweed Chiropractor". Show me the current title.

2. Check that the contact form (wherever it lives) redirects to /thank-you after submission. If it uses Formspree, there should be a _next hidden field pointing to /thank-you. Show me the current form action setup.

3. Verify sitemap generation — run a build and check if the sitemap includes all new pages: /services, /conditions, /fees, /privacy-policy, /thank-you

4. List any pages that are missing canonical URLs or LocalBusiness schema.

Report all findings so I can review before we deploy.
```
