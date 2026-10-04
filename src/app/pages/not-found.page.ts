import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import type { Locale } from '../core/site.config';
import { ButtonDirective } from '../shared/button/button';
import { Logo } from '../shared/logo/logo';

/**
 * 404 — the button that does nothing.
 * The same click moment as the hero, caught in the instant after the press
 * when no product appears.
 */
@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, Logo],
  styles: `
    .dead-ring {
      animation: dead-press 2.6s var(--ease-out-soft) infinite;
    }

    @keyframes dead-press {
      0%,
      55%,
      100% {
        transform: scale(1);
      }
      62% {
        transform: scale(0.92);
      }
      70% {
        transform: scale(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dead-ring {
        animation: none;
        transform: scale(0.94);
      }
    }
  `,
  template: `
    <div class="dot-grid flex min-h-dvh flex-col bg-night">
      <div class="site-container flex h-16 shrink-0 items-center lg:h-20">
        <a [href]="i18n.path()" class="rounded-full" [attr.aria-label]="i18n.t('common.homeLink')">
          <app-logo surface="night" [height]="36" />
        </a>
      </div>

      <main id="main" class="site-container flex flex-1 flex-col items-center justify-center py-20">
        <div
          class="dead-ring grid size-24 place-items-center rounded-full bg-white/6 font-display text-base font-extrabold text-white/40 ring-1 ring-white/12"
          aria-hidden="true"
        >
          {{ i18n.t('notFound.code') }}
        </div>

        <h1 class="mt-10 text-center font-display text-4xl font-extrabold text-white lg:text-5xl">
          {{ i18n.t('notFound.headline') }}
        </h1>

        <p class="mt-5 max-w-[48ch] text-center text-lg text-white/65">
          {{ i18n.t('notFound.body') }}
        </p>

        <a [href]="i18n.path()" appButton="primary" size="lg" class="mt-10">
          {{ i18n.t('notFound.cta') }}
        </a>
      </main>
    </div>
  `,
})
export class NotFoundPage {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const lang = (this.route.snapshot.data['lang'] as Locale | undefined) ?? 'en';
    this.i18n.setPage(lang);
    this.seo.apply({
      title: this.i18n.t('meta.notFound.title'),
      description: this.i18n.t('meta.notFound.description'),
      path: lang === 'ar' ? '/ar/404' : '/404',
      lang,
      noindex: true,
    });
  }

}
