/**
 * Runs after `npm run build` (as `postbuild`). Two jobs, both on the publish
 * folder dist/<project>/browser:
 *
 * 1. 404.html — Netlify serves `404.html` from the publish root for any URL
 *    that matches no file. Angular prerenders the error page to
 *    `404/index.html`, so copy it up one level. The Arabic one stays at
 *    `ar/404/index.html` and is wired up by a redirect in netlify.toml.
 *
 * 2. sitemap.xml — built from `prerendered-routes.json`, Angular's own list of
 *    what it just prerendered, so every page that exists is in the sitemap and
 *    nothing else is. Each English page is paired with its `/ar` twin for the
 *    hreflang links. The domain comes from `siteUrl` in site.config.ts.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The build writes to dist/<project>/browser — read the project name rather
// than repeating it here.
const angular = JSON.parse(readFileSync(resolve(root, 'angular.json'), 'utf8'));
const project = Object.keys(angular.projects)[0];
const dist = resolve(root, 'dist', project);
const browser = resolve(dist, 'browser');

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

// ───────────────────────────── 404.html ─────────────────────────────
const notFound = resolve(browser, '404/index.html');
if (!existsSync(notFound)) {
  fail(`${notFound} not found — was the 404 route prerendered?`);
}
copyFileSync(notFound, resolve(browser, '404.html'));
console.log('  ✓ 404.html (copied from 404/index.html)');

// ──────────────────────────── sitemap.xml ───────────────────────────
const config = readFileSync(resolve(root, 'src/app/core/site.config.ts'), 'utf8');
const siteUrl = /siteUrl:\s*'([^']+)'/.exec(config)?.[1]?.replace(/\/$/, '');
if (!siteUrl) {
  fail('could not read siteUrl from src/app/core/site.config.ts');
}

const manifest = resolve(dist, 'prerendered-routes.json');
if (!existsSync(manifest)) {
  fail(`${manifest} not found`);
}
const routes = Object.keys(JSON.parse(readFileSync(manifest, 'utf8')).routes);

// English pages are the ones without the /ar prefix; error pages stay out.
const isArabic = (route) => route === '/ar' || route.startsWith('/ar/');
const isError = (route) => /(^|\/)404$/.test(route);
const toArabic = (route) => (route === '/' ? '/ar' : `/ar${route}`);

const english = routes.filter((route) => !isArabic(route) && !isError(route)).sort();
const missing = english.filter((route) => !routes.includes(toArabic(route)));
if (missing.length) {
  fail(`no Arabic version prerendered for: ${missing.join(', ')}`);
}

const priority = (route) => (route === '/' ? '1.0' : route.startsWith('/services/') ? '0.8' : '0.7');
const today = new Date().toISOString().slice(0, 10);
const NL = '\n';

const entry = (loc, en, ar, prio) =>
  [
    '  <url>',
    `    <loc>${siteUrl}${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${prio}</priority>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${siteUrl}${ar}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${en}" />`,
    '  </url>',
  ].join(NL);

const urls = english.flatMap((en) => {
  const ar = toArabic(en);
  return [entry(en, en, ar, priority(en)), entry(ar, en, ar, priority(en))];
});

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls,
  '</urlset>',
  '',
].join(NL);

writeFileSync(resolve(browser, 'sitemap.xml'), sitemap, 'utf8');
console.log(`  ✓ sitemap.xml (${urls.length} URLs from ${routes.length} prerendered routes)`);
