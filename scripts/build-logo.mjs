/**
 * Builds the OneClick logo: the mark, the two wordmark lockups, the favicon and
 * every raster icon, all from the geometry defined here.
 *
 *   npm run logo:build
 *
 * The mark is a bold numeral 1, a mouse cursor clicking its lower-right corner,
 * and three click lines. Flat colour only — no gradients, no glows, no shine.
 * Everything is drawn on a 64x64 grid so the shapes land on whole pixels at
 * 16, 32, 64, 128 and 512.
 *
 * The wordmark is Alexandria 800 converted to outlines, so the lockup does not
 * depend on the webfont having loaded (or on the visitor having it at all).
 *
 * Output:
 *   public/assets/logo/logo-mark.svg      the mark on its own
 *   public/assets/logo/logo-light.svg     mark + wordmark, for light backgrounds
 *   public/assets/logo/logo-dark.svg      mark + wordmark, for dark backgrounds
 *   public/favicon.svg                    the mark, transparent
 *   public/assets/images/favicon-16.png   simplified mark
 *   public/assets/images/favicon-32.png   simplified mark
 *   public/assets/images/apple-touch-icon.png   180, on night
 *   public/assets/images/icon-512.png     512, on night
 *   src/app/shared/logo/logo-art.ts       the same geometry for inline rendering
 *
 * Reference artwork: design/logo-reference.png (not published with the site).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import opentype from 'opentype.js';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const logoDir = resolve(root, 'public/assets/logo');
const imageDir = resolve(root, 'public/assets/images');
const fontDir = resolve(root, 'media/fonts');

mkdirSync(logoDir, { recursive: true });
mkdirSync(imageDir, { recursive: true });
mkdirSync(fontDir, { recursive: true });

// ─────────────────────────────── palette ───────────────────────────────
const IRIS = '#5B2BD1';
const IRIS_SOFT = '#9C7BF5';
const NIGHT = '#140B2E';
const DEADSEA = '#22C3B0';
const WHITE = '#FFFFFF';

// ─────────────────────────── geometry, 64x64 ───────────────────────────
const SIZE = 64;

/** The numeral, clockwise from the top-right. `D` is the notch under the flag. */
const ONE = [
  [37.5, 4], // top of the stem
  [37.5, 60], // bottom right
  [19, 60], // bottom left
  [19, 25], // the notch, where the flag meets the stem
  [5, 31.5], // bottom of the flag
  [5, 17.5], // top of the flag
];
const ONE_RADIUS = 2.4;
/** Height of the numeral itself — the wordmark is sized against this, not the
 *  viewBox, which also has to hold the cursor and the click lines. */
const ONE_HEIGHT = ONE[1][1] - ONE[0][1];

/**
 * Classic arrow pointer, tip at the origin, before it is placed. Wider than a
 * system cursor: at logo size a slim arrow reads as a splinter.
 */
const CURSOR = [
  [0, 0], // tip
  [0, 17.6], // heel
  [5.44, 13.5], // inner notch
  [9.06, 19.6], // tail, outer corner
  [12.56, 18.4], // tail, inner corner
  [8.94, 12.4], // notch under the wing
  [15.38, 12.4], // wing tip
];
const CURSOR_SCALE = 1;
// Negative tilts it anticlockwise on screen, so the shaft leans right on the
// way down — the way the reference cursor sits against the numeral.
const CURSOR_TILT = -15;
const CURSOR_AT = [30.8, 34.6];
const CURSOR_STROKE = 2.6;

/** Three lines flicking off the click, outermost first. */
const CLICKS = [
  [46.2, 23.6, 42.4, 33.2],
  [54.4, 28.2, 47.2, 35.8],
  [58.4, 39.3, 49.4, 39.3],
];
const CLICK_WIDTH = 3;

// ──────────────────────────── path helpers ─────────────────────────────
const n = (v) => {
  const r = Math.round(v * 100) / 100;
  return String(r);
};

/** Rounds every corner of a closed polygon with quadratic curves. */
const roundedPolygon = (points, radius) => {
  const len = points.length;
  const parts = [];

  for (let i = 0; i < len; i++) {
    const prev = points[(i - 1 + len) % len];
    const curr = points[i];
    const next = points[(i + 1) % len];

    const toPrev = [prev[0] - curr[0], prev[1] - curr[1]];
    const toNext = [next[0] - curr[0], next[1] - curr[1]];
    const lenPrev = Math.hypot(...toPrev);
    const lenNext = Math.hypot(...toNext);
    const cut = Math.min(radius, lenPrev / 2, lenNext / 2);

    const start = [curr[0] + (toPrev[0] / lenPrev) * cut, curr[1] + (toPrev[1] / lenPrev) * cut];
    const end = [curr[0] + (toNext[0] / lenNext) * cut, curr[1] + (toNext[1] / lenNext) * cut];

    parts.push(`${i === 0 ? 'M' : 'L'}${n(start[0])} ${n(start[1])}`);
    parts.push(`Q${n(curr[0])} ${n(curr[1])} ${n(end[0])} ${n(end[1])}`);
  }

  return `${parts.join('')}Z`;
};

/** Scale, rotate and move the cursor into place, baking the numbers in. */
const placedCursor = () => {
  const rad = (CURSOR_TILT * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return CURSOR.map(([x, y]) => {
    const sx = x * CURSOR_SCALE;
    const sy = y * CURSOR_SCALE;
    return [CURSOR_AT[0] + sx * cos - sy * sin, CURSOR_AT[1] + sx * sin + sy * cos];
  });
};

const polygonPath = (points) =>
  `${points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n(x)} ${n(y)}`).join('')}Z`;

// ────────────────────────────── the mark ───────────────────────────────
const onePath = roundedPolygon(ONE, ONE_RADIUS);
const cursorPath = polygonPath(placedCursor());

/**
 * Detail levels. A 2.6-unit outline is well under a pixel at 32px, and three
 * click lines land inside two pixels at 16px and smear into one teal blob — so
 * each size is given only the detail it can actually hold.
 *
 *   full    everything. 48px and up
 *   simple  thinner outline, fatter click lines. 32px
 *   tiny    numeral and cursor only. 16px
 */
const markBody = ({ one, clicks, detail = 'full' }) => {
  const parts = [`  <path d="${onePath}" fill="${one}" />`];

  if (detail !== 'tiny') {
    const width = detail === 'simple' ? CLICK_WIDTH * 1.6 : CLICK_WIDTH;
    parts.push(
      CLICKS.map(
        ([x1, y1, x2, y2]) =>
          `  <path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${clicks}" stroke-width="${n(width)}" stroke-linecap="round" />`,
      ).join('\n'),
    );
  }

  // paint-order puts the stroke behind the fill, so the outline sits outside
  // the cursor instead of eating into the white.
  //
  // `simple` thins the outline because the fattened click lines are already
  // carrying weight beside it. `tiny` keeps it full: with the lines gone the
  // outline is the only thing separating a white cursor from a white tab bar.
  const outline = detail === 'simple' ? 2 : CURSOR_STROKE;
  parts.push(
    `  <path d="${cursorPath}" fill="${WHITE}" stroke="${NIGHT}" stroke-width="${outline}" stroke-linejoin="round" paint-order="stroke" />`,
  );

  return parts.join('\n');
};

const svg = (body, { width, height, viewBox, title }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none" role="img" aria-label="${title}">\n${body}\n</svg>\n`;

// ───────────────────────────── the wordmark ────────────────────────────
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Alexandria:wght@800';
const fontFile = resolve(fontDir, 'Alexandria-800.ttf');

if (!existsSync(fontFile)) {
  process.stdout.write('  fetching Alexandria 800 ... ');
  // an old user agent makes Google Fonts serve a static TTF instead of woff2
  const css = await (await fetch(FONT_CSS, { headers: { 'User-Agent': 'Mozilla/4.0' } })).text();
  const url = /src:\s*url\((https:[^)]+\.ttf)\)/.exec(css)?.[1];
  if (!url) {
    console.error('could not find a TTF in the Google Fonts response');
    process.exit(1);
  }
  writeFileSync(fontFile, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log('done');
}

const font = opentype.parse(readFileSync(fontFile).buffer);

/** "OneClick" as outlines, sized and positioned against a 64-tall mark. */
const wordmark = () => {
  const TEXT = 'OneClick';
  // Measured off the reference lockup: the text stands 0.542 of the numeral's
  // height, and clears the click lines by 0.127 of it.
  const CAP_RATIO = 0.542;
  const GAP = ONE_HEIGHT * 0.127;

  const probe = font.getPath(TEXT, 0, 0, 100).getBoundingBox();
  const visualHeight = probe.y2 - probe.y1;
  const fontSize = (ONE_HEIGHT * CAP_RATIO * 100) / visualHeight;

  const markRight = 59.4; // the click lines are the rightmost thing in the mark
  const path = font.getPath(TEXT, 0, 0, fontSize);
  const box = path.getBoundingBox();

  // sit the text's optical centre on the mark's centre
  const dx = markRight + GAP - box.x1;
  const dy = SIZE / 2 - (box.y1 + box.y2) / 2;

  const placed = font.getPath(TEXT, dx, dy, fontSize);
  const placedBox = placed.getBoundingBox();

  return { d: placed.toPathData(2), width: placedBox.x2 };
};

const word = wordmark();
const LOCKUP_W = Math.ceil(word.width + 1);

// ──────────────────────────────── write ────────────────────────────────
const files = [];

files.push([
  resolve(logoDir, 'logo-mark.svg'),
  svg(markBody({ one: IRIS, clicks: DEADSEA }), {
    width: 64,
    height: 64,
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    title: 'OneClick',
  }),
]);

for (const [name, oneColor, textColor] of [
  ['logo-light.svg', IRIS, NIGHT],
  ['logo-dark.svg', IRIS_SOFT, WHITE],
]) {
  const body = [
    markBody({ one: oneColor, clicks: DEADSEA }),
    `  <path d="${word.d}" fill="${textColor}" />`,
  ].join('\n');
  files.push([
    resolve(logoDir, name),
    svg(body, {
      width: LOCKUP_W,
      height: SIZE,
      viewBox: `0 0 ${LOCKUP_W} ${SIZE}`,
      title: 'OneClick',
    }),
  ]);
}

// the favicon fills more of its canvas — icons have no room for polite margins
const FAVICON_PAD = 2;
const faviconViewBox = `${FAVICON_PAD} ${FAVICON_PAD} ${SIZE - FAVICON_PAD * 2} ${SIZE - FAVICON_PAD * 2}`;
files.push([
  resolve(root, 'public/favicon.svg'),
  svg(markBody({ one: IRIS, clicks: DEADSEA }), {
    width: 64,
    height: 64,
    viewBox: faviconViewBox,
    title: 'OneClick',
  }),
]);

for (const [file, contents] of files) {
  writeFileSync(file, contents, 'utf8');
  console.log(`  ✓ ${file.replace(root, '.')}  ${(contents.length / 1024).toFixed(1)} kB`);
}

// ───────────────────────────── raster icons ────────────────────────────
// A home-screen icon needs room to breathe inside its rounded mask; a 16px tab
// favicon needs every pixel it can get.
const PLATE = 9;
const plateViewBox = `${-PLATE} ${-PLATE} ${SIZE + PLATE * 2} ${SIZE + PLATE * 2}`;

const rasterSvg = (detail, background) => {
  const inner = markBody({ one: IRIS, clicks: DEADSEA, detail });
  const plate = background
    ? `  <rect x="${-PLATE}" y="${-PLATE}" width="${SIZE + PLATE * 2}" height="${SIZE + PLATE * 2}" fill="${background}" />\n`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="${background ? plateViewBox : faviconViewBox}" fill="none">\n${plate}${inner}\n</svg>\n`;
};

const icons = [
  ['favicon-16.png', 16, 'tiny', null],
  ['favicon-32.png', 32, 'simple', null],
  ['apple-touch-icon.png', 180, 'full', NIGHT],
  ['icon-512.png', 512, 'full', NIGHT],
];

for (const [name, px, detail, background] of icons) {
  const buffer = await sharp(Buffer.from(rasterSvg(detail, background)), { density: 512 })
    .resize(px, px)
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(resolve(imageDir, name), buffer);
  console.log(`  ✓ ./public/assets/images/${name}  ${px}x${px}  ${(buffer.length / 1024).toFixed(1)} kB`);
}

// ─────────────── the same geometry, for inline rendering ───────────────
const art = `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`npm run logo:build\` to rebuild it from scripts/build-logo.mjs.
 *
 * The logo drawn inline by the Logo component. It is the same geometry as
 * public/assets/logo/*.svg, emitted from one definition so the two can never
 * drift apart — inline because the header logo is above the fold and should
 * not cost a request or flash in late.
 */
export const LOGO_ART = {
  /** viewBox of the mark on its own. */
  viewBox: '0 0 ${SIZE} ${SIZE}',
  /** Width of the full lockup at a height of ${SIZE}. */
  lockupWidth: ${LOCKUP_W},
  one: '${onePath}',
  cursor: '${cursorPath}',
  cursorStroke: ${CURSOR_STROKE},
  clicks: [
${CLICKS.map(([x1, y1, x2, y2]) => `    'M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}',`).join('\n')}
  ],
  clickWidth: ${CLICK_WIDTH},
  wordmark: '${word.d}',
} as const;
`;
const artFile = resolve(root, 'src/app/shared/logo/logo-art.ts');
writeFileSync(artFile, art, 'utf8');
console.log(`  ✓ ./src/app/shared/logo/logo-art.ts  ${(art.length / 1024).toFixed(1)} kB`);
