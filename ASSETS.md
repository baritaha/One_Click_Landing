# Assets

The site ships with real media, stored locally. Nothing is hotlinked, and every
file here is either generated from SVG we wrote or licensed for commercial use.

What follows is the provenance of what is on the site today, and the list of
slots where **your own** material should replace a stand-in.

---

## Provenance and licensing

| What | Source | Licence |
|---|---|---|
| Showreel footage (6 clips) | [Mixkit](https://mixkit.co/free-stock-video/) | Mixkit Stock Video Free Licence — commercial use, no attribution required |
| Logo | Drawn for this project from `design/logo-reference.png` | Yours |
| Wordmark typeface | [Alexandria](https://fonts.google.com/specimen/Alexandria) 800, converted to outlines | SIL Open Font License 1.1 |
| Tech logos | `simple-icons` npm package | CC0 1.0 |
| Favicon, OG image, illustrations, product mockups | Drawn for this project | Yours |

The Mixkit clips were downloaded, edited into one reel and re-encoded — they are
not redistributed as stock, which the licence prohibits. Source URLs are in
`scripts/build-showreel.mjs`, so the provenance of every frame is in the repo.

---

## 0. The logo

Everything comes out of one command:

```bash
npm run logo:build
```

| File | What it is |
|---|---|
| `public/assets/logo/logo-mark.svg` | The mark on its own, 64×64 |
| `public/assets/logo/logo-light.svg` | Mark + wordmark for **light** backgrounds — numeral iris, text night |
| `public/assets/logo/logo-dark.svg` | Mark + wordmark for **dark** backgrounds — numeral iris-soft, text white |
| `public/favicon.svg` | The mark, transparent, so it reads on a light or a dark tab bar |
| `public/assets/images/favicon-16.png` | 16px, simplified |
| `public/assets/images/favicon-32.png` | 32px, simplified |
| `public/assets/images/apple-touch-icon.png` | 180px on a night plate |
| `public/assets/images/icon-512.png` | 512px on a night plate |
| `src/app/shared/logo/logo-art.ts` | The same geometry, for the Logo component to draw inline |

The geometry lives in `scripts/build-logo.mjs` — a bold numeral 1, a cursor
clicking its lower-right corner, three click lines, all flat colour on a 64×64
grid. The wordmark is **Alexandria 800 converted to outlines**, so the lockup
never waits on the webfont or renders in a fallback face. The font is fetched
once into `media/fonts/` (gitignored, re-fetched on demand).

**On the site the logo is drawn inline**, not loaded as a file — the header
logo is above the fold, so a request would mean it arrives late. The inline
version and the `.svg` files are emitted from the same definition, so they
cannot drift apart. Use the component:

```html
<app-logo surface="night" [height]="36" />   <!-- on a dark background -->
<app-logo surface="light" [height]="36" />   <!-- on a light background -->
<app-logo surface="night" [wordmark]="false" />  <!-- mark only -->
```

### Detail levels

The mark carries three shapes at full size and fewer as it shrinks, because a
2.6-unit outline is well under a pixel at 32px and three click lines merge into
one teal smear at 16px:

| Size | What is drawn |
|---|---|
| 48px and up | Numeral, cursor with outline, three click lines |
| 32px | Thinner outline, fatter click lines |
| 16px | Numeral and cursor only — the click lines are dropped |

### Changing it

Edit the constants at the top of `scripts/build-logo.mjs` — `ONE`, `CURSOR`,
`CLICKS` and the colours — then re-run. Every file above, plus the social card,
rebuilds from them. `design/logo-reference.png` is the artwork this was drawn
from; it lives outside `public/`, so it is never published with the site.

---

## 1. Showreel — **done, but it is stock**

| File | Spec | Size |
|---|---|---|
| `public/assets/videos/showreel.mp4` | 1920×1080 H.264, 21.5 s, silent | 4.85 MB |
| `public/assets/videos/showreel.webm` | 1920×1080 VP9 | 2.95 MB |
| `public/assets/videos/showreel-preview.mp4` | 1280×720 H.264, 12 s | 0.61 MB |
| `public/assets/videos/showreel-preview.webm` | 1280×720 VP9 | 0.53 MB |
| `public/assets/images/showreel-poster.webp` | 1600×900 | 55 kB |

Two files by design: the **preview** autoplays muted for everyone who scrolls
past, so it is small; the **full reel** is only fetched when someone presses
play. The poster is a frame lifted from the reel itself, so the still and the
first frame are the same picture.

### Rebuild it with your own footage

```bash
npm i -D ffmpeg-static          # or put ffmpeg on your PATH
npm run showreel:build
```

Drop your clips in `media/showreel/` and edit `CLIPS` at the top of
`scripts/build-showreel.mjs` — each entry is a file, the second it starts at,
and a note of what it shows. Re-run and every derived file is rebuilt.
`media/` is gitignored and safe to delete — it holds ~300 MB of source clips
that the script re-fetches from the URLs recorded beside them. Only the encoded
output under `public/assets/` is committed.

> **Replace this before you lean on it.** The current reel is atmospheric stock:
> laptops, dashboards, a team at a table. The section promises "the products and
> interfaces we have built", and only screen recordings of OneClick Commerce and
> OneClick Delivery can honestly deliver that. Aim for 60–120 s of real product
> footage.

**Audio:** the reel is silent. Mixkit's music licence is more restrictive than
its video licence, so no track was added rather than guess at the terms. If you
want music, add a track you hold a licence for and pass it through the build
script.

---

## 2. Project screenshots — **deliberately not stock**

The Work section draws its own interfaces (`ProductScene`) inside the device
frames: clean, abstract geometry that reads as "a product" without pretending to
be a photograph of one.

That is on purpose. A picture in this section is a factual claim — *this is the
thing we built for a client* — and no stock photo can back that claim. An
abstract mockup is honest about being a mockup; a stock screenshot is not.

To use a real screenshot, add `image` to the project in
`src/app/data/projects.ts`:

```ts
image: 'assets/images/work/commerce.webp',
```

| Slot | Path | Spec | What it should show |
|---|---|---|---|
| OneClick Commerce | `public/assets/images/work/commerce.webp` | 1440×990 (16:11), WebP | The storefront or the vendor dashboard, with real products |
| OneClick Delivery | `public/assets/images/work/delivery.webp` | 1440×990 (16:11), WebP | The dispatcher board with a live route |

Crop to exactly 16:11 — that is the aspect ratio of the frame, so anything else
will be cut. Blur or replace any real customer names and phone numbers.

---

## 3. Social card and icons

| Slot | Path | Spec | Status |
|---|---|---|---|
| Open Graph image | `public/assets/images/og-image.png` | 1200×630 PNG | Generated, on brand, safe to ship. Replace with a designed version using the real Alexandria typeface if you want it perfect |
| Favicon and app icons | see **0. The logo** above | | Built by `npm run logo:build` |

The OG image is rebuilt by `npm run assets:generate`, which runs the logo build
first and then borrows the finished dark lockup — so the social card can never
show an older logo than the site does. The artwork is SVG inside
`scripts/generate-assets.mjs`.

> The og-image is rendered by `sharp`, which uses the operating system's fonts,
> not Alexandria. The result is close but not typographically identical to the
> site. If that matters, export a 1200×630 PNG from Figma and drop it in place.

---

## 4. Placeholder **text** to replace

These are not images, but they are placeholders and they are the most visible
thing on this list.

| What | File | Notes |
|---|---|---|
| Testimonials | `src/app/data/testimonials.ts` | Three placeholder quotes. **The section is switched off** until they are real — see the note at the top of `pages/home.page.ts` for how to bring it back |
| More projects | `src/app/data/projects.ts` | Only the two real products are listed. Add entries as you ship them; set `isPlaceholder: true` on anything half-finished and it stays out of production builds |
| Contact details | `src/app/core/site.config.ts` | Every value marked `TODO`: email, phone, WhatsApp number, site URL, founding year, social links |

---

## 5. Rules for anything you add

- **No hotlinking.** Everything lives under `public/assets/`.
- **Images:** WebP or AVIF where possible, with explicit width and height.
  Anything below the fold loads lazily; `NgOptimizedImage` handles both.
- **Video:** MP4 (H.264) **and** WebM, always with a `poster`. Keep silent
  loops under 3 MB.
- **Alt text** is written in both languages, in the data file, not the template.
- After adding or changing artwork in the generator, run `npm run assets:generate`.
