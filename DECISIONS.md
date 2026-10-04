# Decisions

Choices made while building this site that the brief left open, or where
reality pushed back on the brief. Each one says what was decided and why, so
the next person can disagree on purpose rather than by accident.

---

## Stack

**Angular 21, not 22.**
The brief says "latest stable Angular". Angular 22 requires Node ≥ 22.22.3 and
this machine runs Node 22.21.0, so the CLI refuses to install. Angular 21.2 is
the newest line that runs here and is fully stable: standalone components,
signals, `@if`/`@for`/`@defer`, zoneless by default. Moving to 22 later is a
Node upgrade plus `ng update` — nothing in this codebase blocks it.

**The Angular project is named `oneclick-landing`, the folder is `oneclick_landing`.**
Angular project names may not contain underscores, so the workspace was created
with `--directory=oneclick_landing`. The folder on disk is the one that was
asked for; the package name is the closest legal spelling.

**No `tailwind.config.js`.**
Tailwind v4 is configured entirely through `@theme` in `src/styles.css`, which
is what the official Angular guide now says to do. Design tokens are CSS custom
properties, so they are readable from component styles and from plain CSS too.

**Inline SVG icons rather than `lucide-angular`.**
The brief allowed either. Hand-written icons are one small file with no
dependency, one consistent stroke weight, and no unused icons in the bundle.
UI icons live in `shared/icon`, brand and product marks in `shared/brand-mark`.

**Static output, no server.**
`outputMode: "static"` in `angular.json`. The Express server and its
dependencies that `ng new --ssr` generates were deleted; SSR exists here only to
prerender. The build emits plain HTML that any static host can serve.

---

## Motion

**The hero sequence is CSS, not GSAP. GSAP drives the process section.**
GSAP with ScrollTrigger is installed and loaded dynamically in the browser, as
the brief specifies, and it does the work that genuinely needs it: pinning the
process rail and scrubbing the progress line.

The hero build sequence is pure CSS instead, driven by two custom properties —
`--i` (a block's place in the assembly order) and `--start` (when the run
begins). That buys three things GSAP could not:

1. The sequence plays inside the **prerendered HTML**, before any JavaScript
   arrives. Someone on a slow connection sees the product assemble anyway.
2. **No hydration flash.** A GSAP version would have to render the finished
   scene server-side, then hide it again once JavaScript boots.
3. `prefers-reduced-motion` switches the whole thing off in one media query.

Angular handles only what is genuinely interactive: which scene is showing, the
button label, and the screen-reader announcement.

**Scroll spy and the header state use platform APIs.**
`IntersectionObserver` for the active nav link, a passive scroll listener for
the header background. Both are a few lines and neither needs GSAP loaded to
work, so the header is correct before the animation bundle arrives.

**Clicking an open service row does not close it.**
The brief says hover, focus or tap *expands* a row, with one open at a time.
A true toggle breaks on a pointer device: the hover that precedes the click has
already opened the row, so the click would immediately shut it. One row is
always open, which also means the section is never in an empty state.

---

## Language and direction

**The wordmark stays "OneClick" in both languages.**
§6.1 of the brief specifies the wordmark. The Arabic name **ون كليك** is used
where a name is read rather than seen as a logo: the `<title>`, the meta
description, the JSON-LD `alternateName`, and the footer copyright.

**Language lives on the route, and the page component sets it synchronously.**
`/` is English, `/ar` is Arabic. `HomePage` reads `route.snapshot.data.lang` in
its constructor and calls `I18nService.setLang()` there, which sets `<html lang>`
and `<html dir>` before anything renders. That is why the prerendered HTML for
`/ar` already carries `dir="rtl"` — no flash, no hydration mismatch.

**Every link is a real document link; the router never navigates in-app.**
Both languages are prerendered documents, so letting the browser load the other
one is faster to get right than swapping the view. Three things forced this:

- `<base href="/">` makes the browser resolve a bare `#services` against the
  *site root*. On `/ar` that quietly sent every nav link, CTA, footer link and
  the skip link back to the English page. Anchors now carry the current page's
  path (`I18nService.anchor()`), so they read `/ar#services`.
- With a `routerLink` toggle, Angular swapped the view in and then looked for
  the anchor — which, with deferred sections, was still a placeholder. The
  fragment ended up in the URL and the visitor at the top of the page.
- Angular's own anchor scrolling positions the element by hand and ignores
  `scroll-padding-top`, so sections landed underneath the sticky header.

Handing all three back to the browser removed the code rather than adding to it:
`provideRouter(routes)` now has no scrolling options, and the router only
matches routes for prerendering.

**Smooth scrolling is switched on after the page has landed.**
`scroll-behavior: smooth` on `html` turns the browser's initial jump to
`#section` into an animation, and an animation that starts while the page is
still laying out gets cancelled — so a deep link silently dropped the visitor at
the top. The rule is now on `html[data-smooth-scroll]`, an attribute the app
adds once it has landed. Deep links land exactly, **with or without
JavaScript**, and clicks still glide. `App` also re-lands the anchor after
`document.fonts.ready`, because webfont metrics move everything underneath it.

**Latin text inside Arabic is isolated.**
The Arabic bidi algorithm reorders neutral characters at the edges of a Latin
run, which turned `.NET` into `NET.` and `9:00–17:00` into `17:00-9:00`. Tech
tags carry `dir="ltr"`; the working-hours string carries explicit bidi isolate
characters (U+2066 … U+2069) in `site.config.ts`.

**Arabic gets its own line height and letter-spacing.**
`--line-tight` and `--line-body` are redefined under `[dir="rtl"]`, and the
negative tracking on headings is reset to zero — Arabic letterforms lose their
shape when tracked in. Body size is nudged up 4%, because Arabic reads small
next to Latin at the same pixel size.

---

## Content and data

**The device frames contain geometry, not text.**
Every mockup — hero scenes, work showcases, the phone — is made of shapes with
no copy in it. At that size real text is unreadable noise, and shapes mean the
same scene works unchanged in both languages with no strings to translate and
no RTL work. The scenes are `aria-hidden`; the surrounding section describes
them.

**AWS, Azure and SQL Server use neutral glyphs.**
Simple Icons no longer carries those three marks. Rather than draw an imitation
of a trademarked logo, the strip shows a cloud, a chevron and a database
cylinder — and every item in the strip carries its product name beside the
mark, so nothing depends on recognising a glyph. `.NET` is the one mark that is
already a wordmark, so its name is there for screen readers only.

**The logo is generated, not hand-edited SVG.**
`scripts/build-logo.mjs` holds the geometry — the numeral as a rounded polygon,
the cursor as a classic arrow scaled and tilted into place, three click lines —
and emits the mark, both wordmark lockups, the favicon, four raster icons and
the inline version the Logo component draws. One definition, nine outputs, so
they cannot disagree with each other.

Two details worth keeping:

- The cursor outline uses `paint-order="stroke"`, so the stroke paints behind
  the fill and reads as an outline *around* the white rather than eating into
  it. Without it the cursor looks thin and grey at small sizes.
- The mark sheds detail as it shrinks. At 32px the outline is under a pixel and
  at 16px the three click lines land inside two pixels and merge into a teal
  smear, so 32px gets a thinner outline and fatter lines and 16px drops the
  lines entirely. Rendering the full mark at every size looks worse, not more
  faithful.

The wordmark is **Alexandria 800 converted to outlines** rather than live text.
A logo that re-flows when a webfont fails is not a logo.

**Tech logo paths are generated, not typed by hand.**
`npm run assets:generate` pulls them from the `simple-icons` package into
`src/app/data/logo-paths.ts`. Hand-copied path data goes stale and is impossible
to review.

**Placeholder projects are hidden in production.**
`isDevMode()` filters them, so `ng serve` shows the two extra slots and a
production build does not.

---

## Performance and accessibility

**Everything below the fold uses `@defer (hydrate on viewport)`.**
Work, showreel, about, testimonials, FAQ and contact are all deferred; hero,
tech strip, services and process load eagerly.

Plain `@defer` would put a *placeholder* in the prerendered HTML, which would
cost us the FAQ answers and the service copy in search results — the opposite of
what §10 asks for. Incremental hydration
(`withIncrementalHydration()` in `app.config.ts`) renders the real content into
the static HTML and defers only the JavaScript, so a crawler and a visitor
without JavaScript still get the whole page. Both triggers are given
(`on viewport; hydrate on viewport`) so the blocks also work after a client-side
language switch, when there is no server-rendered content to hydrate.

It moved the initial bundle from 633 kB to 547 kB raw (146 kB over the wire) and
took the contact form's reactive-forms code off the critical path entirely.
Every placeholder has a `min-h-*` close to the real section height, which is why
cumulative layout shift stays at 0.

**Native `<dialog>` for both the video player and the mobile menu.**
Focus trap, Escape to close, scroll lock and focus return, all from the
platform and all better tested than a hand-written version.
One catch worth knowing: Tailwind's preflight zeroes every margin, which also
kills the `auto` margin a modal dialog uses to centre itself. Both dialogs set
their margin explicitly.

**`<details>` for the FAQ.**
Find-in-page works, it opens before JavaScript loads, and the keyboard
behaviour is already right. The smooth height animation uses
`::details-content` with `interpolate-size: allow-keywords`; where a browser
does not support that yet, the panel simply opens instantly and the answer
fades in.

**The showreel is licensed stock, edited locally, served from our own origin.**
Six clips from Mixkit (free licence: commercial use, no attribution) were
downloaded, cut to four seconds each, crossfaded into one 21.5 s reel and
encoded to H.264 and VP9. Nothing is hotlinked and nothing is embedded from a
third party. `scripts/build-showreel.mjs` holds the source URLs and rebuilds
every derived file, so the provenance of every frame is in the repo and the reel
can be rebuilt from the client's own footage with one command.

It ships as **two** pairs of files. The loop behind the play button autoplays for
everyone who scrolls past, so it is 720p and 12 seconds (0.53 MB as VP9); the
full 1080p reel is only fetched when someone presses play. One file doing both
jobs would mean either a heavy autoplay or a soft fullscreen.

The reel is **silent**. Mixkit's music licence has conditions its video licence
does not, and rather than guess at them no track was added.

**The About section has no team block.**
It was built twice — a founder lockup, then a four-across portrait grid — and
both are gone. The section is now two paragraphs, three facts and how we work,
and nothing on the page names or pictures an individual.

That closes a problem rather than leaving it open. A team grid wants four faces
and only one was real, and the stand-ins tried both ways out: three
AI-generated faces from `thispersondoesnotexist.com` (StyleGAN2), which depict
nobody so nobody is misrepresented, and monogram circles, which are honest but
read as three people missing. Neither is a team. Removing the block is the only
version that claims exactly what is true — no licence question, no invented
colleagues, no empty slots waiting to be explained.

Removed with it: `src/app/data/team.ts`, the `about.team.heading` strings in
both dictionaries, `public/assets/images/team/`, `scripts/prepare-portraits.mjs`
and the `portraits:prepare` script in `package.json`. Nothing in the codebase
grades or ships a portrait any more. The About section takes one step less
padding than the site rhythm, because without the grid it is the shortest
section on the page.

The size claim stays where it belongs: "Small, senior team" in the facts row,
and `teamSize` in `site.config.ts` feeding `numberOfEmployees` in the
`Organization` schema. Those describe the company, not named people.

**No stock screenshots, though.**
The Work section keeps its drawn mockups. That slot makes a factual claim —
*we built this* — and nothing but a real screen capture can back it. An abstract
mockup is honest about being a mockup; a stock screenshot is not. It is a
one-line change in `projects.ts` once the real captures exist.

**Contrast was measured, not eyeballed.**
Every text/background pair meets WCAG AA. `text-white/40` on night measured
3.8:1 and was raised; `text-white/45` measured 4.59:1 and was raised anyway for
margin.

**Measured Lighthouse results (mobile, simulated throttling).**

| | `/` | `/ar` | Target |
|---|---|---|---|
| Performance | 83–94, median ≈ 88 | 87–89 | ≥ 90 |
| Accessibility | 100 | 100 | ≥ 95 |
| Best practices | 100 | 100 | ≥ 95 |
| SEO | 100 | 100 | 100 |

Three of the four targets are met with room to spare. **Performance straddles
the line**, and it is worth being precise about why:

- CLS is 0 and unthrottled first paint is 386 ms. The score is set by the
  *simulated* FCP, which models a slow 4G connection against a 231 kB
  prerendered document.
- Eight runs of the **same build** on the same machine scored 83, 86, 86, 88,
  88, 88, 90 and 94, with total blocking time swinging between 90 ms and
  390 ms. That spread is measurement noise on a developer machine, not a
  difference in the build. Re-measure on the real host before treating any
  single number as the answer.
- The measurement used a local Node server with gzip and cache headers. A real
  host adds HTTP/2 and brotli, which should move it up rather than down.

**The one remaining lever is self-hosting the fonts.** Three font files
(~85 kB) are fetched from `fonts.gstatic.com`, a third-party origin with its own
DNS and TLS handshake. Serving them from our own origin and preloading them
would take a few hundred milliseconds off. It was not done because §4.3 and §10
of the brief both specify Google Fonts, and `display=swap` already keeps the
fonts off the critical rendering path. If the score needs headroom, that is the
change to make — both families are OFL-licensed, so self-hosting is permitted.

**Bundle budgets raised to 650 kB / 1 MB.**
An Angular app with router, reactive forms and hydration starts around 620 kB
raw — about 158 kB over the wire. GSAP, the FAQ and the testimonials are all in
lazy chunks.

---

## Things deliberately not done

- **No FAQ JSON-LD.** §10 specifies `Organization` schema, and that is what
  ships. `FAQPage` markup would be easy to add later in `SeoService`.
- **No analytics, no cookie banner.** Nothing was asked for, and nothing is
  tracked, so there is nothing to consent to.
- **No tests.** The brief describes a marketing site and lists no testing
  requirement, so the workspace was created with `--skip-tests`. Vitest is still
  the configured runner if that changes.
