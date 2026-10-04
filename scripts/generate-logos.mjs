/**
 * Generates `src/app/data/logo-paths.ts` — the inline SVG path data for the
 * tech strip. Paths come from the `simple-icons` package so the marks are
 * accurate and stored locally; nothing is fetched at runtime.
 *
 * A few products (AWS, Azure, SQL Server) are not in Simple Icons, so they use
 * neutral generic glyphs instead of an imitation of a trademarked logo. The
 * product name sits next to every glyph, so nothing is ambiguous.
 *
 * Run: npm run assets:generate
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as simpleIcons from 'simple-icons';

const here = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(here, '../src/app/data/logo-paths.ts');

/** key in our data files -> Simple Icons slug */
const FROM_SIMPLE_ICONS = {
  angular: 'angular',
  dotnet: 'dotnet',
  react: 'react',
  laravel: 'laravel',
  node: 'nodedotjs',
  flutter: 'flutter',
  postgresql: 'postgresql',
  docker: 'docker',
  typescript: 'typescript',
  figma: 'figma',
  tailwind: 'tailwindcss',
  nextjs: 'nextdotjs',
  stripe: 'stripe',
  redis: 'redis',
  mysql: 'mysql',
  firebase: 'firebase',
  whatsapp: 'whatsapp',
  instagram: 'instagram',
  facebook: 'facebook',
  github: 'github',
  x: 'x',
};

/** Neutral glyphs for products Simple Icons does not carry. */
const CUSTOM = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  cloud:
    'M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
  cloudChevron:
    'M12.4 2.8 5.2 21.2H0L8.4 2.8zM13.8 6.3 18.6 18l-9.5 1.8-.3 1.4H24z',
  database:
    'M12 2c-4.42 0-8 1.34-8 3v2c0 1.66 3.58 3 8 3s8-1.34 8-3V5c0-1.66-3.58-3-8-3z' +
    'M20 9.5c0 1.66-3.58 3-8 3s-8-1.34-8-3V13c0 1.66 3.58 3 8 3s8-1.34 8-3z' +
    'M20 16.5c0 1.66-3.58 3-8 3s-8-1.34-8-3V20c0 1.66 3.58 3 8 3s8-1.34 8-3z',
};

const entries = [];
const missing = [];

for (const [key, slug] of Object.entries(FROM_SIMPLE_ICONS)) {
  const iconKey = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  const icon = simpleIcons[iconKey];
  if (!icon) {
    missing.push(`${key} (${slug})`);
    continue;
  }
  entries.push([key, icon.path]);
}

for (const [key, path] of Object.entries(CUSTOM)) {
  entries.push([key, path]);
}

if (missing.length) {
  console.warn('  ! simple-icons is missing:', missing.join(', '));
}

const body = entries
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, path]) => `  ${key}: '${path.replace(/'/g, "\\'")}',`)
  .join('\n');

const file = `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`npm run assets:generate\` to rebuild it.
 *
 * Inline SVG path data for tech logos, all on a 24x24 viewBox.
 * Product marks come from the \`simple-icons\` package; \`cloud\`,
 * \`cloudChevron\` and \`database\` are neutral glyphs we drew ourselves.
 */
export const LOGO_PATHS = {
${body}
} as const;

export type LogoKey = keyof typeof LOGO_PATHS;
`;

writeFileSync(outFile, file, 'utf8');
console.log(`  ✓ logo-paths.ts — ${entries.length} marks`);
