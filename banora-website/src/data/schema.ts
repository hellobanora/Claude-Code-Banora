import { clinic, practitioners } from './clinic';
import { areas } from './areas';
import { services } from './services';

// Stable IDs so every page's JSON-LD points at the same clinic and practitioner entities.
export const CLINIC_ID = `${clinic.website}/#clinic`;

const uniqueServices = [...new Map(services.map((s) => [s.slug, s])).values()];

type Practitioner = (typeof practitioners)[number];

export const practitionerUrl = (p: Practitioner) => `${clinic.website}/team/${p.slug}`;
export const practitionerId = (p: Practitioner) => `${practitionerUrl(p)}#person`;

const DAY_NAMES: Record<string, string> = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: clinic.address.street,
  addressLocality: clinic.address.suburb,
  addressRegion: clinic.address.state,
  postalCode: clinic.address.postcode,
  addressCountry: 'AU',
};

const openingHours = clinic.hoursSchema.map((entry) => {
  const [day, time] = entry.split(' ');
  const [opens, closes] = time.split('-');
  return { '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_NAMES[day], opens, closes };
});

/**
 * Sitewide clinic entity — rendered on every page by BaseLayout.
 * Note: schema.org "Chiropractic" is a MedicineSystem — not a business type or a medicalSpecialty value —
 * so the clinic is a MedicalClinic (a LocalBusiness subtype) whose services use it as their medicineSystem.
 */
export const clinicSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  '@id': CLINIC_ID,
  name: clinic.name,
  url: clinic.website,
  logo: `${clinic.website}/images/logo-square.png`,
  image: `${clinic.website}/images/clinic-adjustment-wide.webp`,
  description:
    'Chiropractic clinic in Tweed Heads South NSW, serving the Tweed Coast and southern Gold Coast. No referral needed, HICAPS on-site, ground-level access with on-site parking.',
  telephone: clinic.phone,
  email: clinic.email,
  address: postalAddress,
  geo: { '@type': 'GeoCoordinates', latitude: clinic.geo.latitude, longitude: clinic.geo.longitude },
  openingHoursSpecification: openingHours,
  areaServed: areas.map((a) => ({ '@type': 'Place', name: `${a.name} ${a.state}` })),
  sameAs: [clinic.social.facebook, clinic.social.instagram, clinic.social.google],
  employee: practitioners.map((p) => ({ '@type': 'Person', '@id': practitionerId(p), name: p.name })),
  availableService: uniqueServices.map((s) => ({
    '@type': 'MedicalTherapy',
    name: s.title,
    url: `${clinic.website}/services/${s.slug}`,
    medicineSystem: 'https://schema.org/Chiropractic',
  })),
  isAcceptingNewPatients: true,
  priceRange: '$$',
  currenciesAccepted: 'AUD',
  paymentAccepted: clinic.payment.join(', '),
};

/** Person entity for a practitioner's team page. */
export function practitionerSchema(p: Practitioner) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': practitionerId(p),
    name: p.name,
    honorificPrefix: 'Dr',
    jobTitle: 'Chiropractor',
    description: p.shortBio,
    url: practitionerUrl(p),
    image: `${clinic.website}${p.photo}`,
    worksFor: { '@type': 'MedicalClinic', '@id': CLINIC_ID, name: clinic.name },
    workLocation: { '@type': 'Place', name: clinic.name, address: postalAddress },
    alumniOf: { '@type': 'CollegeOrUniversity', name: p.university },
    hasCredential: [
      { name: 'Bachelor of Science (Chiropractic)', educationalLevel: 'Bachelor degree' },
      { name: 'Master of Chiropractic', educationalLevel: 'Master degree' },
    ].map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      credentialCategory: 'degree',
      educationalLevel: c.educationalLevel,
      recognizedBy: { '@type': 'CollegeOrUniversity', name: p.university },
    })),
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Chiropractor',
      occupationLocation: { '@type': 'City', name: `${clinic.address.suburb} ${clinic.address.state}` },
    },
    knowsAbout: p.techniques,
  };
}

/** FAQPage entity. Only use where the same questions and answers are visible on the page. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
