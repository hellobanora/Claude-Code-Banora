import type { APIRoute } from 'astro';
import { services } from '../data/services';
import { conditions } from '../data/conditions';
import { areas } from '../data/areas';
import { blogPosts } from '../data/blog';

const BASE_URL = 'https://banorachiropractic.com.au';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

function url(path: string, changefreq: SitemapURL['changefreq'], priority: string, lastmod?: string): SitemapURL {
  return { loc: `${BASE_URL}${path}`, changefreq, priority, lastmod };
}

function toXML(urls: SitemapURL[]): string {
  const entries = urls
    .map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export const GET: APIRoute = () => {
  // Deduplicate slugs (conditions.ts has a duplicate hip-pain entry)
  const uniqueServices = [...new Map(services.map(s => [s.slug, s])).values()];
  const uniqueConditions = [...new Map(conditions.map(c => [c.slug, c])).values()];
  const uniqueAreas = [...new Map(areas.map(a => [a.slug, a])).values()];
  const uniquePosts = [...new Map(blogPosts.map(p => [p.slug, p])).values()];

  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapURL[] = [
    // Core pages
    url('/', 'weekly', '1.0', today),
    url('/about', 'monthly', '0.8'),
    url('/contact', 'monthly', '0.9'),
    url('/fees', 'monthly', '0.8'),
    url('/new-patient-info', 'monthly', '0.8'),
    url('/patient-resources', 'monthly', '0.7'),
    url('/symptom-checker', 'monthly', '0.6'),

    // Team pages
    url('/team/dr-james-shipway', 'yearly', '0.7'),
    url('/team/dr-paul-cater', 'yearly', '0.7'),

    // Services
    url('/services', 'monthly', '0.9'),
    ...uniqueServices.map(s => url(`/services/${s.slug}`, 'monthly', '0.8')),

    // Conditions
    url('/conditions', 'monthly', '0.9'),
    ...uniqueConditions.map(c => url(`/conditions/${c.slug}`, 'monthly', '0.8')),

    // Areas / Location pages
    url('/areas', 'monthly', '0.8'),
    ...uniqueAreas.map(a => url(`/areas/${a.slug}`, 'monthly', '0.7')),

    // Blog
    url('/blog', 'weekly', '0.7', today),
    ...uniquePosts.map(p => url(`/blog/${p.slug}`, 'monthly', '0.6')),

    // Legal / utility
    url('/privacy-policy', 'yearly', '0.3'),
  ];

  return new Response(toXML(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
