import type { APIRoute } from 'astro';
import { clinic, practitioners, pricing } from '../data/clinic';
import { services } from '../data/services';
import { conditions } from '../data/conditions';
import { areas } from '../data/areas';
import { blogPosts } from '../data/blog';

// llms.txt (https://llmstxt.org) — a plain-Markdown summary of the clinic for AI assistants.
// Built from the same data files as the site so NAP, hours and pages never drift.

const BASE_URL = clinic.website;

const unique = <T extends { slug: string }>(items: T[]) => [...new Map(items.map((i) => [i.slug, i])).values()];
const link = (title: string, path: string, note?: string) => `- [${title}](${BASE_URL}${path})${note ? `: ${note}` : ''}`;

/** Intro, NAP, hours and fees. */
function clinicDetails(): string {
  const hours = clinic.hours
    .map((h) => `- ${h.day}: ${h.open === 'Closed' ? 'Closed' : `${h.open} – ${h.close}`}`)
    .join('\n');

  return `# ${clinic.name}

> ${clinic.name} is a chiropractic clinic at ${clinic.address.full}, Australia, run by co-owners ${practitioners.map((p) => p.name).join(' and ')} (30+ years combined experience). It serves the Tweed Coast and southern Gold Coast. No referral is needed, health fund rebates are claimed on the spot with HICAPS, and the clinic is ground level with on-site parking.

Results of chiropractic care vary between individuals. We recommend a consultation to assess each person's individual needs.

## Contact and booking

- Name: ${clinic.name}
- Address: ${clinic.address.full}
- Phone: ${clinic.phone}
- Email: ${clinic.email}
- Website: ${BASE_URL}
- Book online: ${clinic.bookingUrl}
- Location: ${clinic.landmark} on Greenway Drive. On-site parking, ground level, wheelchair accessible.

## Opening hours

${hours}

## Fees and payment

- New patient consultation: $${pricing.newPatient.price} (student/child $${pricing.newPatient.studentChild}), ${pricing.newPatient.duration.replace('-', '–')}
- Standard adjustment: $${pricing.regularAdjustment.price} (student/child $${pricing.regularAdjustment.studentChild})
- Payment: ${clinic.payment.join(', ')}
- Full fee list: ${BASE_URL}/fees
`;
}

/** Team, services, conditions, areas and page links. */
function siteSections(): string {
  const team = practitioners
    .map((p) => link(`${p.name} (${p.qualifications}, ${p.university} ${p.graduationYear})`, `/team/${p.slug}`, p.shortBio))
    .join('\n');

  const nsw = areas.filter((a) => a.state === 'NSW').map((a) => a.name).join(', ');
  const qld = areas.filter((a) => a.state === 'QLD').map((a) => a.name).join(', ');

  const posts = unique(blogPosts.filter((p) => p.status === 'published'));

  return `## Chiropractors

${team}

## Techniques

Gonstead, Sacro-Occipital Technique (SOT), Diversified, Thompson Drop-Piece, Activator, Cranial and extremity adjusting.

## Services

${unique(services).map((s) => link(s.title, `/services/${s.slug}`, s.shortDescription)).join('\n')}

## Conditions we commonly see

${unique(conditions).map((c) => link(c.title, `/conditions/${c.slug}`, c.shortDescription)).join('\n')}

## Areas served

- NSW: ${nsw}
- QLD: ${qld}
- Suburb pages: ${BASE_URL}/areas

## Key pages

${link('New patient information', '/new-patient-info', 'what to expect at the first visit, what to bring, FAQs')}
${link('Fees', '/fees')}
${link('About the clinic', '/about')}
${link('Contact', '/contact')}
${posts.length ? `\n## Articles\n\n${posts.map((p) => link(p.title, `/blog/${p.slug}`, p.excerpt)).join('\n')}\n` : ''}
## Optional

${link('Patient resources', '/patient-resources')}
${link('Our approach', '/our-approach')}
`;
}

export const GET: APIRoute = () =>
  new Response(`${clinicDetails()}\n${siteSections()}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
