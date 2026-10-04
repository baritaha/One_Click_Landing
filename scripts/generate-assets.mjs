/**
 * Builds every file the site ships that is not source code, from SVG and
 * strings we write here. Nothing is downloaded and nothing is hotlinked.
 *
 * Run: npm run assets:generate
 *
 * Output:
 *   public/assets/images/og-image.png   1200x630, for social cards
 *   public/robots.txt
 *   src/app/data/logo-paths.ts                (via generate-logos.mjs)
 *
 * The logo, the favicon and every app icon come from scripts/build-logo.mjs;
 * this script only borrows the finished lockup for the social card. The
 * showreel poster is a real frame lifted from the reel itself. See ASSETS.md.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const images = resolve(root, 'public/assets/images');

mkdirSync(images, { recursive: true });

const NIGHT = '#140B2E';
const IRIS = '#5B2BD1';
const IRIS_SOFT = '#9C7BF5';
const DEADSEA = '#22C3B0';
const SANS = 'Segoe UI, Noto Sans, DejaVu Sans, Arial, sans-serif';

/** The faint dot grid and the single iris glow, shared by both artworks. */
const backdrop = (w, h) => `
  <defs>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="${IRIS_SOFT}" fill-opacity="0.17" />
    </pattern>
    <radialGradient id="glow">
      <stop offset="0%" stop-color="${IRIS}" stop-opacity="0.62" />
      <stop offset="100%" stop-color="${IRIS}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${NIGHT}" />
  <rect width="${w}" height="${h}" fill="url(#dots)" />
  <circle cx="${w * 0.82}" cy="${h * 0.16}" r="${h * 0.72}" fill="url(#glow)" />
`;

/**
 * The real lockup, lifted straight out of the logo build, so the social card can
 * never end up showing an older logo than the site does.
 */
const LOGO_DARK = resolve(root, 'public/assets/logo/logo-dark.svg');
if (!existsSync(LOGO_DARK)) {
  console.error('public/assets/logo/logo-dark.svg is missing. Run `npm run logo:build` first.');
  process.exit(1);
}
const logoInner = readFileSync(LOGO_DARK, 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

/** The lockup is drawn on a 64-tall grid; `height` is what it becomes here. */
const lockup = (x, y, height) => `
  <g transform="translate(${x} ${y}) scale(${(height / 64).toFixed(4)})">${logoInner}</g>
`;

const rects = (list) =>
  list
    .map(
      (b) => `
  <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${b.h > 60 ? 14 : 7}" fill="${b.fill ?? '#FFFFFF'}" fill-opacity="${b.o}" />`,
    )
    .join('');

// ────────────────────────────── og-image ──────────────────────────────
const ogImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${backdrop(1200, 630)}
  ${lockup(80, 66, 56)}

  <text x="80" y="300" font-family="${SANS}" font-size="72" font-weight="700" fill="#FFFFFF">Software that works</text>
  <text x="80" y="386" font-family="${SANS}" font-size="72" font-weight="700" fill="#FFFFFF">from the first click.</text>

  <text x="80" y="470" font-family="${SANS}" font-size="27" fill="#FFFFFF" fill-opacity="0.62">A software company in Jordan</text>
  <text x="80" y="512" font-family="${SANS}" font-size="27" fill="#FFFFFF" fill-opacity="0.62">Web &#183; Mobile &#183; Systems</text>

  <!-- the click moment, as a mark -->
  <circle cx="985" cy="405" r="128" fill="none" stroke="${DEADSEA}" stroke-opacity="0.16" stroke-width="2" />
  <circle cx="985" cy="405" r="96" fill="none" stroke="${DEADSEA}" stroke-opacity="0.3" stroke-width="2" />
  <circle cx="985" cy="405" r="66" fill="${DEADSEA}" />
  <path d="M968 378 1014 408l-20.5 5.4-8.5 21z" fill="${NIGHT}" />
</svg>`;

// ─────────────────────────────── images ───────────────────────────────
const png = (svg, width, height) =>
  sharp(Buffer.isBuffer(svg) ? svg : Buffer.from(svg), { density: 384 })
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

// The icons belong to scripts/build-logo.mjs — it knows which detail level each
// size can carry. Everything here would do is flatten the same SVG four times.
const targets = [['og-image.png', ogImage, 1200, 630]];

for (const [name, source, width, height] of targets) {
  const buffer = await png(source, width, height);
  writeFileSync(resolve(images, name), buffer);
  console.log(`  ✓ ${name} — ${width}x${height}, ${(buffer.length / 1024).toFixed(1)} kB`);
}

// ──────────────────────────── robots.txt ────────────────────────────
// Reads `siteUrl` straight out of site.config.ts, so changing the domain in
// one place is enough — re-run this script and it follows.
const config = readFileSync(resolve(root, 'src/app/core/site.config.ts'), 'utf8');
const match = /siteUrl:\s*'([^']+)'/.exec(config);
const siteUrl = (match ? match[1] : 'https://example.com').replace(/\/$/, '');

const NL = String.fromCharCode(10);

const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /404',
  'Disallow: /ar/404',
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
].join(NL);

writeFileSync(resolve(root, 'public/robots.txt'), robots, 'utf8');
console.log('  ✓ robots.txt');

// sitemap.xml is not made here: scripts/postbuild.mjs writes it after every
// build, from the list of pages Angular actually prerendered.

// Keep the inline tech marks in step with the same command.
execFileSync(process.execPath, [resolve(here, 'generate-logos.mjs')], { stdio: 'inherit' });
