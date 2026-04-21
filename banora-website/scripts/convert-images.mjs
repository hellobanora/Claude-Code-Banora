/**
 * Image optimisation script — converts all JPG/PNG images to WebP
 * Run: node scripts/convert-images.mjs
 */

import sharp from '../node_modules/sharp/lib/index.js';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '../public/images');

// Hero/full-width images — keep large enough for Ken Burns zoom (1.15x)
const HERO_MAX_WIDTH = 1600;
// Doctor photos and smaller contextual images
const PORTRAIT_MAX_WIDTH = 900;
// Service cards, thumbnails, pexels used as section backgrounds
const DEFAULT_MAX_WIDTH = 1440;

const heroImages = new Set([
  'clinic-neck-assessment.jpg',
  'hero-all-ages.jpg',
  'clinic-spinal-adjustment.jpg',
  'hero-sports.jpg',
  'clinic-adjustment-wide.jpg',
  'hero-adjustment.jpg',
  'hero-back-neck.jpg',
  'hero-chiro-exam.jpg',
  'hero-paediatric.jpg',
  'hero-pregnancy.jpg',
  'team-both-doctors.jpg',
  'team-photo.jpg',
  'chiropractic-visit.jpg',
  'clinic-neck-assessment.jpg',
]);

const portraitImages = new Set([
  'dr-james-shipway.jpg',
  'dr-james-shipway.png',
  'dr-paul-cater.jpg',
  'dr-paul-cater.png',
]);

// Skip these — logos need transparency or specific format handling
const skipImages = new Set([
  'logo.png',
  'logo-horizontal.png',
  'logo-icon.png',
  'logo-square.png',
  'og-default.jpg', // OG image must remain JPG (some scrapers don't support WebP)
]);

async function convertImages() {
  const files = await readdir(imagesDir);
  const jpgPngFiles = files.filter(f =>
    /\.(jpg|jpeg|png)$/i.test(f) && !skipImages.has(f)
  );

  console.log(`Converting ${jpgPngFiles.length} images to WebP...`);
  let totalSaved = 0;

  for (const file of jpgPngFiles) {
    const inputPath = join(imagesDir, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = join(imagesDir, outputName);

    const ext = extname(file).toLowerCase();
    const isPortrait = portraitImages.has(file);
    const isHero = heroImages.has(file);
    const maxWidth = isPortrait ? PORTRAIT_MAX_WIDTH : isHero ? HERO_MAX_WIDTH : DEFAULT_MAX_WIDTH;

    try {
      const inputStat = await stat(inputPath);
      const inputSize = inputStat.size;

      let pipeline = sharp(inputPath).resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });

      // PNGs with transparency: use lossless WebP
      if (ext === '.png') {
        pipeline = pipeline.webp({ lossless: false, quality: 85, nearLossless: true });
      } else {
        pipeline = pipeline.webp({ quality: 82 });
      }

      await pipeline.toFile(outputPath);

      const outputStat = await stat(outputPath);
      const outputSize = outputStat.size;
      const saved = inputSize - outputSize;
      totalSaved += saved;

      const pct = Math.round((saved / inputSize) * 100);
      console.log(`  ✓ ${file} → ${outputName} (${(inputSize/1024).toFixed(0)}KB → ${(outputSize/1024).toFixed(0)}KB, -${pct}%)`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  console.log('\nDone! Now update image src references in your .astro files from .jpg/.png to .webp');
}

convertImages().catch(console.error);
