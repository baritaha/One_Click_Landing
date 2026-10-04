import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { TESTIMONIALS } from '../../data/testimonials';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';

/**
 * One quote at a time, moved only by the reader. Nothing rotates on its own —
 * a quote that slides away mid-sentence is a quote nobody finishes.
 */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'salt' },
  imports: [SectionHeading, Icon],
  styles: `
    .quote {
      animation: quote-in 320ms var(--ease-out-soft);
    }

    @keyframes quote-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .quote {
        animation: quote-fade 200ms linear;
      }

      @keyframes quote-fade {
        from {
          opacity: 0;
        }
      }
    }
  `,
  template: `
    <section
      id="testimonials"
      class="section-pad bg-salt"
      aria-labelledby="testimonials-heading"
    >
      <div class="site-container">
        <app-section-heading
          headingId="testimonials-heading"
          [heading]="i18n.t('testimonials.heading')"
        />

        <div
          class="mt-12 rounded-[var(--radius-panel)] bg-white p-8 shadow-[var(--shadow-panel)] ring-1 ring-ink/6 sm:p-12 lg:mt-16 lg:p-16"
          role="group"
          aria-roledescription="carousel"
          [attr.aria-label]="i18n.t('testimonials.heading')"
        >
          @for (key of [index()]; track key) {
            <figure class="quote">
              <span class="block font-display text-5xl leading-none text-iris/25" aria-hidden="true"
                >&ldquo;</span
              >
              <blockquote
                class="mt-4 max-w-[46ch] font-display text-2xl font-semibold text-balance text-ink lg:text-3xl"
              >
                {{ i18n.text(current().quote) }}
              </blockquote>
              <figcaption class="mt-8 text-basalt">
                <span class="font-medium text-ink">{{ i18n.text(current().name) }}</span>
                <span class="mx-2" aria-hidden="true">·</span>
                {{ i18n.text(current().role) }}, {{ i18n.text(current().company) }}
              </figcaption>
            </figure>
          }

          <div class="mt-10 flex items-center gap-4">
            <button
              type="button"
              class="grid size-11 cursor-pointer place-items-center rounded-full border border-ink/15 text-basalt transition-colors duration-200 hover:border-iris/45 hover:text-iris"
              [attr.aria-label]="i18n.t('common.previous')"
              (click)="previous()"
            >
              <app-icon name="arrowStart" [size]="18" class="rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              class="grid size-11 cursor-pointer place-items-center rounded-full border border-ink/15 text-basalt transition-colors duration-200 hover:border-iris/45 hover:text-iris"
              [attr.aria-label]="i18n.t('common.next')"
              (click)="next()"
            >
              <app-icon name="arrowEnd" [size]="18" class="rtl:-scale-x-100" />
            </button>

            <ul class="ms-auto flex items-center gap-1">
              @for (item of testimonials; track item.id; let i = $index) {
                <li>
                  <button
                    type="button"
                    class="flex h-6 cursor-pointer items-center px-2"
                    [attr.aria-label]="i18n.t('testimonials.goTo', { number: i + 1 })"
                    [attr.aria-current]="i === index() ? 'true' : null"
                    (click)="go(i)"
                  >
                    <span
                      class="block h-2 rounded-full transition-all duration-300 ease-[var(--ease-out-soft)]"
                      [class]="i === index() ? 'w-7 bg-deadsea' : 'w-2 bg-ink/15 hover:bg-ink/30'"
                    ></span>
                  </button>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Testimonials {
  protected readonly i18n = inject(I18nService);
  protected readonly testimonials = TESTIMONIALS;

  protected readonly index = signal(0);
  protected readonly current = computed(() => this.testimonials[this.index()]);

  protected previous(): void {
    this.index.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  protected next(): void {
    this.index.update((i) => (i + 1) % this.testimonials.length);
  }

  protected go(index: number): void {
    this.index.set(index);
  }
}
