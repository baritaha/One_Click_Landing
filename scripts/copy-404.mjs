/**
 * Runs after `npm run build` (as `postbuild`).
 *
 * Netlify serves `404.html` from the publish root for any URL that matches no
 * file. Angular prerenders the error page to `404/index.html`, so copy it up
 * one level. The Arabic one stays at `ar/404/index.html` and is wired up by a
 * redirect in netlify.toml.
 */
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The build writes to dist/<project>/browser — read the project name rather
// than repeating it here.
const angular = JSON.parse(readFileSync(resolve(root, 'angular.json'), 'utf8'));
const project = Object.keys(angular.projects)[0];
const browser = resolve(root, 'dist', project, 'browser');

const source = resolve(browser, '404/index.html');
if (!existsSync(source)) {
  console.error(`✗ ${source} not found — was the 404 route prerendered?`);
  process.exit(1);
}

copyFileSync(source, resolve(browser, '404.html'));
console.log(`  ✓ 404.html (copied from 404/index.html)`);
