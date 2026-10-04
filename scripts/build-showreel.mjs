/**
 * Builds the showreel from a set of source clips.
 *
 * Six segments, crossfaded, encoded twice: a full 1080p reel for the dialog and
 * a small 720p loop for the poster frame behind the play button. The poster is
 * lifted from the reel itself so the still and the first frame are the same
 * picture.
 *
 *   node scripts/build-showreel.mjs
 *
 * Needs ffmpeg. Either put one on your PATH, set FFMPEG_PATH, or run:
 *   npm i -D ffmpeg-static
 *
 * Source clips go in `media/showreel/` as `<name>.mp4` and are listed in CLIPS
 * below. They are NOT committed — only the encoded output under
 * `public/assets/` is. See ASSETS.md for where the current clips came from.
 *
 * To use your own footage: drop your files in `media/showreel/`, edit CLIPS
 * (each entry is a file, the second it starts at, and a note for the record),
 * and re-run. Everything downstream picks it up.
 */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, statSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const sources = resolve(root, 'media/showreel');
const videos = resolve(root, 'public/assets/videos');
const images = resolve(root, 'public/assets/images');

/** Seconds kept from each clip, and the crossfade between them. */
const SEGMENT = 4.0;
const CROSSFADE = 0.5;

const CLIPS = [
  { file: '01-writing-code.mp4', start: 3, shows: 'writing code on a laptop',       url: 'https://assets.mixkit.co/videos/29991/29991-1080.mp4' },
  { file: '02-dashboard.mp4',    start: 6, shows: 'a dashboard open on a laptop',   url: 'https://assets.mixkit.co/videos/308/308-1080.mp4' },
  { file: '03-mobile.mp4',       start: 2, shows: 'a phone beside a keyboard',      url: 'https://assets.mixkit.co/videos/41638/41638-1080.mp4' },
  { file: '04-analytics.mp4',    start: 1, shows: 'analytics screens at a desk',    url: 'https://assets.mixkit.co/videos/42664/42664-1080.mp4' },
  { file: '05-typing.mp4',       start: 4, shows: 'hands typing, close up',         url: 'https://assets.mixkit.co/videos/4907/4907-1080.mp4' },
  { file: '06-team.mp4',         start: 8, shows: 'a small team around a table',    url: 'https://assets.mixkit.co/videos/4547/4547-1080.mp4' },
];

// ── locate ffmpeg ─────────────────────────────────────────────────────
const require = createRequire(import.meta.url);
const ffmpeg = (() => {
  if (process.env['FFMPEG_PATH']) return process.env['FFMPEG_PATH'];
  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
})();

mkdirSync(sources, { recursive: true });
mkdirSync(videos, { recursive: true });
mkdirSync(images, { recursive: true });

const mb = (file) => `${(statSync(file).size / 1024 / 1024).toFixed(2)} MB`;

// Fetch anything we do not already have. The sources are ~300 MB and are not
// committed; only the encoded output under public/assets/ is.
for (const clip of CLIPS) {
  const target = resolve(sources, clip.file);
  if (existsSync(target)) {
    continue;
  }
  if (!clip.url) {
    console.error(`Missing ${clip.file}, and no url to fetch it from. See ASSETS.md.`);
    process.exit(1);
  }
  process.stdout.write(`  fetching ${clip.file} ... `);
  const res = await fetch(clip.url);
  if (!res.ok) {
    console.error(`failed (HTTP ${res.status})`);
    process.exit(1);
  }
  writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  console.log(mb(target));
}

const run = (args, what) => {
  process.stdout.write(`  ${what} ... `);
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  console.log('done');
};

// ── the crossfade chain ───────────────────────────────────────────────
const inputs = CLIPS.flatMap((c) => [
  '-ss', String(c.start),
  '-t', String(SEGMENT),
  '-i', resolve(sources, c.file),
]);

// every segment is normalised to the same size, rate and pixel format first,
// otherwise xfade refuses to join them
const prepared = CLIPS.map(
  (_, i) =>
    `[${i}:v]scale=1920:1080:force_original_aspect_ratio=increase,` +
    `crop=1920:1080,fps=30,format=yuv420p,setpts=PTS-STARTPTS[v${i}]`,
);

const fades = [];
let label = 'v0';
let length = SEGMENT;
for (let i = 1; i < CLIPS.length; i++) {
  const next = i === CLIPS.length - 1 ? 'vout' : `x${i}`;
  fades.push(
    `[${label}][v${i}]xfade=transition=fade:duration=${CROSSFADE}:offset=${(length - CROSSFADE).toFixed(3)}[${next}]`,
  );
  label = next;
  length += SEGMENT - CROSSFADE;
}

console.log(`showreel: ${CLIPS.length} clips, ${length.toFixed(1)}s`);

const full = resolve(videos, 'showreel.mp4');
const preview = resolve(videos, 'showreel-preview.mp4');

run(
  [
    ...inputs,
    '-filter_complex', [...prepared, ...fades].join(';'),
    '-map', '[vout]',
    '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    full,
  ],
  'full reel, H.264',
);

run(
  ['-i', full, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-row-mt', '1',
   '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an',
   resolve(videos, 'showreel.webm')],
  'full reel, VP9',
);

// the loop autoplays for everyone who scrolls past, so it is deliberately small
run(
  ['-i', full, '-t', '12', '-vf', 'scale=1280:720',
   '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
   '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
   preview],
  'preview loop, H.264',
);

run(
  ['-i', preview, '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1',
   '-deadline', 'good', '-cpu-used', '3', '-pix_fmt', 'yuv420p', '-an',
   resolve(videos, 'showreel-preview.webm')],
  'preview loop, VP9',
);

const still = resolve(videos, '.poster.jpg');
run(['-ss', '1.2', '-i', full, '-frames:v', '1', '-q:v', '2', still], 'poster frame');
const poster = resolve(images, 'showreel-poster.webp');
writeFileSync(poster, await sharp(readFileSync(still)).resize(1600, 900, { fit: 'cover' }).webp({ quality: 82 }).toBuffer());
rmSync(still, { force: true });

console.log('');
for (const f of [
  resolve(videos, 'showreel.mp4'),
  resolve(videos, 'showreel.webm'),
  resolve(videos, 'showreel-preview.mp4'),
  resolve(videos, 'showreel-preview.webm'),
  poster,
]) {
  console.log(`  ${f.replace(root, '.').padEnd(46)} ${mb(f)}`);
}
