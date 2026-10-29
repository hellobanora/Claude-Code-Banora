// Post-build check: sitemap.xml must list every indexable page, and nothing else.
// Fails the build if an indexable page is missing, or a noindex/missing page is listed.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const BASE_URL = 'https://banorachiropractic.com.au';
const OUTPUT_DIRS = ['.vercel/output/static', 'dist/client', 'dist'];
// Paths robots.txt disallows, plus error pages — never expected in the sitemap.
const IGNORED_PREFIXES = ['/thank-you/', '/drafts/', '/api/', '/forms/', '/404/'];

function findOutputDir() {
  const dir = OUTPUT_DIRS.find((d) => existsSync(join(d, 'sitemap.xml')));
  if (!dir) throw new Error(`sitemap.xml not found in any of: ${OUTPUT_DIRS.join(', ')}`);
  return dir;
}

function listHtmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listHtmlFiles(full);
    return name.endsWith('.html') ? [full] : [];
  });
}

function toPath(outputDir, file) {
  const rel = relative(outputDir, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html$/, '')}/`;
}

function isNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function main() {
  const outputDir = findOutputDir();
  const sitemap = readFileSync(join(outputDir, 'sitemap.xml'), 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE_URL, '')));

  const pages = new Map();
  for (const file of listHtmlFiles(outputDir)) {
    const path = toPath(outputDir, file);
    if (IGNORED_PREFIXES.some((p) => path.startsWith(p))) continue;
    pages.set(path, isNoindex(readFileSync(file, 'utf8')));
  }

  const errors = [];
  for (const [path, noindex] of pages) {
    if (!noindex && !listed.has(path)) errors.push(`Indexable page missing from sitemap: ${path}`);
    if (noindex && listed.has(path)) errors.push(`Noindex page listed in sitemap: ${path}`);
  }
  for (const path of listed) {
    if (!pages.has(path)) errors.push(`Sitemap lists a page that was not built: ${path}`);
  }

  if (errors.length > 0) {
    console.error(`Sitemap check failed (${errors.length}):\n  ${errors.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`Sitemap check passed: ${listed.size} URLs, ${pages.size - listed.size} noindex pages excluded.`);
}

try {
  main();
} catch (err) {
  console.error(`Sitemap check error: ${err.message}`);
  process.exit(1);
}
