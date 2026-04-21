// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://banorachiropractic.com.au',
  output: 'static',
  adapter: vercel(),
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacy-policy') &&
        !page.includes('/thank-you'),
      serialize(item) {
        // Homepage
        if (item.url === 'https://banorachiropractic.com.au/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // Services, conditions, areas — high-value SEO pages
        if (
          item.url.includes('/services/') ||
          item.url.includes('/conditions/') ||
          item.url.includes('/areas/')
        ) {
          return { ...item, priority: 0.9, changefreq: 'monthly' };
        }
        // Section index pages and key pages
        if (
          item.url.includes('/about') ||
          item.url.includes('/contact') ||
          item.url.includes('/services') ||
          item.url.includes('/conditions') ||
          item.url.includes('/areas') ||
          item.url.includes('/team/')
        ) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        // Blog
        if (item.url.includes('/blog')) {
          return { ...item, priority: 0.6, changefreq: 'monthly' };
        }
        // Everything else
        return { ...item, priority: 0.5, changefreq: 'monthly' };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
