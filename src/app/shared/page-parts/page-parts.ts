import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { SITE } from '../../core/site.config';
import { ButtonDirective } from '../button/button';
import { Icon } from '../icon/icon';

/** One rung of the breadcrumb above a page's H1. */
export interface Crumb {
  label: string;
  href: string;
}

/** A link card: title, one line of context, and where it goes. */
export interface LinkCard {
  title: string;
  summary: string;
  href: string;
}

/**
 * The opening band of a standalone page — the only H1 on it. Night, like the
 * home hero, so the transparent header reads the same everywhere.
 */
@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  host: { 'data-surface': 'night' },
  template: `
    <section class="dot-grid relative overflow-hidden bg-night pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div class="site-container">
        <nav [attr.aria-label]="i18n.t('page.breadcrumb')">
          <ol class="flex flex-wrap items-center gap-2 text-sm text-white/55">
            @for (crumb of crumbs(); track crumb.href; let last = $last) {
              <li>
                <a class="transition-colors hover:text-deadsea" [href]="crumb.href">{{ crumb.label }}</a>
              </li>
              @if (!last) {
                <li aria-hidden="true">/</li>
              }
            }
          </ol>
        </nav>

        <p class="mt-8 text-sm font-medium tracking-wide text-deadsea">{{ eyebrow() }}</p>
        <h1
          class="mt-3 max-w-[22ch] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-extrabold text-white text-balance"
        >
          {{ heading() }}
        </h1>
        <p class="mt-7 max-w-[64ch] text-lg text-white/72">{{ intro() }}</p>

        <div class="mt-10 flex flex-wrap items-center gap-3">
          <a [href]="i18n.anchor('contact')" appButton="primary" size="lg">
            {{ i18n.t('hero.ctaPrimary') }}
          </a>
          <a [href]="whatsapp" target="_blank" rel="noopener" appButton="secondary" tone="light" size="lg">
            {{ i18n.t('common.whatsappChat') }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class PageHero {
  protected readonly i18n = inject(I18nService);
  protected readonly whatsapp = `https://wa.me/${SITE.whatsappNumber}`;

  readonly crumbs = input.required<readonly Crumb[]>();
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  readonly intro = input.required<string>();
}

/** The closing call to action: back to the contact form on the home page. */
@Component({
  selector: 'app-page-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  host: { 'data-surface': 'night' },
  template: `
    <section class="dot-grid bg-night py-20 lg:py-28" aria-labelledby="page-cta-heading">
      <div class="site-container">
        <h2
          id="page-cta-heading"
          class="max-w-[24ch] font-display text-3xl font-extrabold text-white text-balance lg:text-4xl"
        >
          {{ i18n.t('contact.heading') }}
        </h2>
        <p class="mt-5 max-w-[60ch] text-lg text-white/72">{{ i18n.t('page.ctaBody') }}</p>
        <div class="mt-9 flex flex-wrap items-center gap-3">
          <a [href]="i18n.anchor('contact')" appButton="primary" size="lg">
            {{ i18n.t('hero.ctaPrimary') }}
          </a>
          <a [href]="whatsapp" target="_blank" rel="noopener" appButton="secondary" tone="light" size="lg">
            {{ i18n.t('common.whatsappChat') }}
          </a>
        </div>
      </div>
    </section>
  `,
})
export class PageCta {
  protected readonly i18n = inject(I18nService);
  protected readonly whatsapp = `https://wa.me/${SITE.whatsappNumber}`;
}

/** A titled grid of link cards — other services, related work. */
@Component({
  selector: 'app-link-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <h2 class="font-display text-2xl font-extrabold text-ink" [id]="headingId()">{{ heading() }}</h2>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" [attr.aria-labelledby]="headingId()">
      @for (card of cards(); track card.href) {
        <li>
          <a
            class="group flex h-full flex-col rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-ink/8 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
            [href]="card.href"
          >
            <span class="flex items-start justify-between gap-4 font-display text-lg font-extrabold text-ink group-hover:text-iris">
              {{ card.title }}
              <app-icon class="mt-1 shrink-0 rtl:-scale-x-100" name="arrowEnd" [size]="18" />
            </span>
            <span class="mt-2 text-sm/6 text-basalt">{{ card.summary }}</span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class LinkCards {
  readonly heading = input.required<string>();
  readonly headingId = input.required<string>();
  readonly cards = input.required<readonly LinkCard[]>();
}
