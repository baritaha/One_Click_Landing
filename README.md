# OneClick — company website

The marketing site for **OneClick** (ون كليك), a software company in Jordan.
One page, two languages, no backend, deployable to any static host.

| | |
|---|---|
| Stack | Angular 21 (standalone, signals, zoneless) + Tailwind CSS v4 + GSAP |
| Languages | English at `/`, Arabic at `/ar` — both fully supported, RTL included |
| Output | Prerendered static HTML. No server, no database |
| Contact form | Opens WhatsApp or the visitor's email app. Optionally POSTs to an endpoint |

---

## Getting started

Requires **Node 20.19+ or 22.12+** and npm.

```bash
npm install
npm start          # dev server on http://localhost:4200
```

| Command | What it does |
|---|---|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build into `dist/oneclick-landing/` |
| `npm run preview` | Serve the built site locally on port 4300 |
| `npm run logo:build` | Rebuild the logo, favicon and every app icon from `scripts/build-logo.mjs` |
| `npm run assets:generate` | Run the logo build, then rebuild the OG image, `robots.txt`, `sitemap.xml` and the inline tech-logo paths |
| `npm run showreel:build` | Re-encode the showreel from the clips in `media/showreel/` (needs ffmpeg) |

A build must finish with **zero errors and zero warnings**. If it does not,
fix that before anything else.

---

## Deploying

`npm run build` writes plain HTML, CSS, JS and images to:

```
dist/oneclick-landing/browser/
├── index.html          →  /
├── ar/index.html       →  /ar
├── 404/index.html      →  the error page
├── ar/404/index.html
├── robots.txt
├── sitemap.xml
└── assets/ …
```

Upload the contents of `browser/` to any static host — Netlify, Vercel,
Cloudflare Pages, GitHub Pages, S3, or plain nginx. There is nothing to run
server-side.

**Two things to configure on the host:**

1. **Error page** → point it at `404/index.html`.
   - Netlify: add `public/_redirects` containing `/* /404/index.html 404`
   - Vercel: `{ "routes": [{ "handle": "error" }, { "status": 404, "dest": "/404/index.html" }] }`
   - nginx: `error_page 404 /404/index.html;`
2. **Set the real domain** in `src/app/core/site.config.ts` (`siteUrl`), then run
   `npm run assets:generate` and rebuild. Canonical URLs, `hreflang`, the sitemap
   and `robots.txt` all read from that one value.

---

## Before launch

Everything below is a placeholder. The site is complete and consistent without
them, but these are what make it true.

1. **`src/app/core/site.config.ts`** — every line marked `TODO`: email, phone,
   WhatsApp number (digits only, e.g. `9627XXXXXXXX`), `siteUrl`, founding year
   and social links. A social link left empty is simply not rendered.
2. **Testimonials** — the section is switched off until there are real quotes.
   The component and `src/app/data/testimonials.ts` are still there; the note at
   the top of `pages/home.page.ts` says how to bring it back.
3. **Showreel** — the reel that ships is licensed stock footage of laptops and
   dashboards. The section promises "the products and interfaces we have built",
   so replace it with real screen recordings. See [ASSETS.md](ASSETS.md).
4. **Assets** — [ASSETS.md](ASSETS.md) lists every photo and video slot, with
   the licence and source of everything currently in the repo.

---

## Editing content

**No user-facing text lives in a template.** Everything is either a translation
key or a data file, and both languages sit side by side so they cannot drift.

### Interface text

`src/app/core/i18n/en.ts` and `ar.ts`.

`en.ts` defines the key set; `ar.ts` is typed against it, so a missing or
misspelled Arabic key is a **compile error**, not a blank space on the page.
Add a key to `en.ts` first, and the build will tell you to add it to `ar.ts`.

```ts
// en.ts
'hero.headline': 'Software that works from the first click.',
// ar.ts
'hero.headline': 'برمجيات تعمل من أول نقرة.',
```

Use it in a template with `{{ i18n.t('hero.headline') }}`, or
`{{ i18n.t('process.stepLabel', { number: 2, total: 4 }) }}` to fill in a
`{placeholder}`.

### Page content

`src/app/data/` — one file per section, all bilingual:

| File | Section |
|---|---|
| `services.ts` | What we build — six services, their points and tech tags |
| `projects.ts` | Products we've shipped |
| `process.ts` | How a project moves — the four steps |
| `faq.ts` | Questions we hear often |
| `testimonials.ts` | What clients say |
| `tech-stack.ts` | The strip under the hero |
| `hero-scenes.ts` | The three products the hero button cycles through |

Every string is an `{ en, ar }` pair, so adding a service means writing both
languages in one place:

```ts
{
  id: 'training',
  illustration: 'design',
  title:   { en: 'Team training', ar: 'تدريب الفرق' },
  summary: { en: '…',             ar: '…' },
  points:  [{ en: '…', ar: '…' }],
  tech:    ['Angular', '.NET'],
}
```

### Adding a project

Add an entry to `PROJECTS` in `projects.ts`. Pick a `scene` (`marketplace`,
`delivery` or `dashboard`) and the device frame draws that interface for you —
no screenshot needed. Add `image` later to use a real one. Entries flagged
`isPlaceholder: true` are hidden in production builds.

---

## How it is put together

```
src/app/
  core/
    site.config.ts     company details, contact info, links
    i18n/              language signal, t(), the two dictionaries
    seo.service.ts     title, meta, OG, hreflang, canonical, JSON-LD
    motion.service.ts  browser-only GSAP loader + reduced-motion signal
  data/                all page content, bilingual and typed
  shared/              logo, button, device frames, scenes, dialog, icons
  sections/            header, hero, tech-strip, services, work, process,
                       showreel, about, testimonials, faq, contact, footer
  pages/               home.page.ts, not-found.page.ts
scripts/               asset, logo and media generators
design/                brand reference artwork, never published
```

**Design tokens** live in `src/styles.css` under `@theme` — colours, fonts, the
type scale, radii, shadows and easing. Changing the brand colour is one line
there, and it propagates to Tailwind utilities (`bg-iris`), component styles
(`var(--color-iris)`) and the generated OG image alike.

Rules the code follows, if you are adding to it:

- Standalone components, `OnPush`, signals for state.
- Never touch `window`, `document`, `localStorage` or GSAP outside
  `afterNextRender` or an `isPlatformBrowser` guard — prerendering has no DOM.
- Use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`,
  `text-start`) so RTL works with no extra rules. Use `rtl:` only for things
  that must physically flip, like arrows.
- Check both `/` and `/ar` at 375, 768, 1280 and 1920 px before calling
  anything done.
- **Check `ng serve` too, not just `ng build`.** Some errors only exist in
  development — `NgOptimizedImage` runs its assertions in dev mode only, so a
  bad `sizes` attribute throws a runtime error and blanks the image on the dev
  server while the production build renders it perfectly. `sizes` must be
  purely responsive (`22vw`, `(min-width: 1024px) 45vw`); a px value in there
  throws `NG02952`.

---

## The contact form

No backend. The form validates, then builds a readable message in the visitor's
language and hands it to:

- **Send via WhatsApp** → `https://wa.me/<number>?text=…`
- **Send by email** → `mailto:` with a subject and a formatted body

To POST to a real endpoint instead, set `contactEndpoint` in `site.config.ts`.
The same form then sends JSON (all fields plus `lang`) and shows loading,
success and error states. No markup changes.

---

## Reference

- [ASSETS.md](ASSETS.md) — every image and video slot, with specs
- [DECISIONS.md](DECISIONS.md) — why the build is the way it is
