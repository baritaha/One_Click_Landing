import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { FAQ } from '../../data/faq';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';

/**
 * Native `<details>` elements: they are searchable with the browser's own
 * find-in-page, they work before JavaScript loads, and the keyboard support is
 * already correct. The animation is layered on top with `::details-content`
 * where the browser supports it, and nothing breaks where it does not.
 */
@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'night' },
  imports: [SectionHeading, Icon],
  styles: `
    details::details-content {
      block-size: 0;
      overflow: hidden;
      transition:
        block-size 380ms var(--ease-out-soft),
        content-visibility 380ms allow-discrete;
    }

    details[open]::details-content {
      block-size: auto;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary {
      list-style: none;
    }

    /* Works even where ::details-content does not. */
    details[open] .answer {
      animation: answer-in 380ms var(--ease-out-soft);
    }

    @keyframes answer-in {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      details::details-content {
        transition: none;
      }

      details[open] .answer {
        animation: none;
      }
    }
  `,
  template: `
    <section id="faq" class="section-pad bg-night" aria-labelledby="faq-heading">
      <div class="site-container">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
          <app-section-heading
            headingId="faq-heading"
            tone="light"
            class="lg:sticky lg:top-28 lg:self-start"
            [heading]="i18n.t('faq.heading')"
            [intro]="i18n.t('faq.intro')"
          />

          <div class="border-t border-white/12">
            @for (item of faq; track item.id) {
              <details class="group border-b border-white/12">
                <summary
                  class="flex cursor-pointer items-start gap-5 py-6 text-start font-display text-lg font-semibold text-white transition-colors duration-200 hover:text-deadsea lg:text-xl"
                >
                  <span class="min-w-0 flex-1">{{ i18n.text(item.question) }}</span>
                  <span
                    class="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white/8 text-white/70 transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:rotate-180 group-open:bg-deadsea group-open:text-night"
                    aria-hidden="true"
                  >
                    <app-icon name="chevronDown" [size]="17" />
                  </span>
                </summary>

                <p class="answer max-w-[68ch] pb-7 text-white/65">{{ i18n.text(item.answer) }}</p>
              </details>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Faq {
  protected readonly i18n = inject(I18nService);
  protected readonly faq = FAQ;
}
