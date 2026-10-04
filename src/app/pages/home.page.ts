import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import type { Locale } from '../core/site.config';
import { About } from '../sections/about/about';
import { Contact } from '../sections/contact/contact';
import { Faq } from '../sections/faq/faq';
import { Footer } from '../sections/footer/footer';
import { Header } from '../sections/header/header';
import { Hero } from '../sections/hero/hero';
import { Process } from '../sections/process/process';
import { Services } from '../sections/services/services';
import { TechStrip } from '../sections/tech-strip/tech-strip';
import { Work } from '../sections/work/work';

/**
 * The whole site. The language comes from the route, and both `/` and `/ar`
 * render this same page — so the two versions can never drift apart.
 *
 * **Testimonials is switched off** until there are real quotes to show. Nothing
 * was deleted: `sections/testimonials/` and `data/testimonials.ts` are both
 * still here. To bring it back, put the real quotes in the data file, add
 * `Testimonials` to the imports below, and drop this between About and the FAQ:
 *
 * ```
 * @defer (on viewport; hydrate on viewport) {
 *   <app-testimonials />
 * } @placeholder {
 *   <div class="min-h-[28rem] bg-salt"></div>
 * }
 * ```
 *
 * It sits on salt, so putting it back also restores the light/dark alternation
 * between About and the FAQ.
 *
 * **The showreel is switched off** until there is real product footage — the
 * current reel is stock, and the section promises our own products. The
 * component and its video files are untouched. To bring it back, add `Showreel`
 * to the imports below and drop this between Process and About:
 *
 * ```
 * @defer (on viewport; hydrate on viewport) {
 *   <app-showreel />
 * } @placeholder {
 *   <div class="min-h-[40rem] bg-salt"></div>
 * }
 * ```
 */
@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Header,
    Hero,
    TechStrip,
    Services,
    Work,
    Process,
    About,
    Faq,
    Contact,
    Footer,
  ],
  template: `
    <app-header />

    <main id="main">
      <app-hero />
      <app-tech-strip />
      <app-services />

      <!--
        Everything below the fold is server-rendered into the static HTML and
        only hydrated once you scroll to it. Search engines and no-JS visitors
        get the whole page; the browser pays for it a section at a time.
      -->
      @defer (on viewport; hydrate on viewport) {
        <app-work />
      } @placeholder {
        <div class="min-h-[48rem] bg-salt"></div>
      }

      <app-process />

      @defer (on viewport; hydrate on viewport) {
        <app-about />
      } @placeholder {
        <div class="min-h-[40rem] bg-night"></div>
      }

      <!-- Testimonials belongs here — see the note above the class. -->

      @defer (on viewport; hydrate on viewport) {
        <app-faq />
      } @placeholder {
        <div class="min-h-[32rem] bg-night"></div>
      }

      @defer (on viewport; hydrate on viewport) {
        <app-contact />
      } @placeholder {
        <div class="min-h-[46rem] bg-salt"></div>
      }
    </main>

    <app-footer />
  `,
})
export class HomePage {
  private readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const lang = (this.route.snapshot.data['lang'] as Locale | undefined) ?? 'en';
    this.i18n.setLang(lang);
    this.seo.apply({
      title: this.i18n.t('meta.title'),
      description: this.i18n.t('meta.description'),
      path: lang === 'ar' ? '/ar' : '/',
      lang,
    });
  }
}
