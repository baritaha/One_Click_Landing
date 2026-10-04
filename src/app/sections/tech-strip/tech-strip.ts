import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { I18nService } from '../../core/i18n/i18n.service';
import { TECH_STACK } from '../../data/tech-stack';
import { BrandMark } from '../../shared/brand-mark/brand-mark';

/**
 * A thin band of the stack we build on, drifting slowly under the hero.
 * It pauses when you hover or tab into it, runs the other way in Arabic, and
 * becomes a plain wrapped row when the visitor asks for less motion.
 */
@Component({
  selector: 'app-tech-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandMark, NgTemplateOutlet],
  styles: `
    .viewport {
      mask-image: linear-gradient(
        to right,
        transparent,
        black 4rem,
        black calc(100% - 4rem),
        transparent
      );
    }

    .track {
      animation: marquee 46s linear infinite;
    }

    /*
     * In RTL the track is laid out from the right edge and overflows to the
     * left, so translating it further left — which is what simply reversing the
     * LTR keyframes amounts to — drags every logo out of the visible strip and
     * leaves it empty. It has to travel the other way instead.
     */
    :host-context([dir='rtl']) .track {
      animation-name: marquee-rtl;
    }

    .viewport:hover .track,
    .viewport:focus-within .track {
      animation-play-state: paused;
    }

    @keyframes marquee {
      to {
        transform: translate3d(-50%, 0, 0);
      }
    }

    @keyframes marquee-rtl {
      to {
        transform: translate3d(50%, 0, 0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .viewport {
        mask-image: none;
        overflow: visible;
      }

      .track {
        animation: none;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.25rem 2.5rem;
      }

      .track .copy-2 {
        display: none;
      }
    }
  `,
  template: `
    <section class="border-y border-white/8 bg-night py-7" [attr.aria-label]="i18n.t('tech.heading')">
      <div class="site-container flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
        <p class="shrink-0 text-sm text-white/55">{{ i18n.t('tech.heading') }}</p>

        <div class="viewport min-w-0 flex-1 overflow-hidden">
          <ul class="track flex w-max items-center gap-10">
            @for (item of stack; track item.name) {
              <ng-container *ngTemplateOutlet="entry; context: { $implicit: item }" />
            }
            <!--
              The loop is seamless because the track scrolls exactly -50%, which
              only works while the two halves are the same width. Both render
              from one template so they cannot drift apart; the repeat is hidden
              from assistive tech.
            -->
            @for (item of stack; track item.name) {
              <ng-container
                *ngTemplateOutlet="entry; context: { $implicit: item, repeat: true }"
              />
            }
          </ul>
        </div>

        <ng-template #entry let-item let-repeat="repeat">
          <li
            class="flex items-center gap-2.5 text-white/55"
            [class.copy-2]="repeat"
            [attr.aria-hidden]="repeat ? 'true' : null"
          >
            <app-brand-mark [mark]="item.logo" [size]="22" />
            <span
              class="text-sm whitespace-nowrap"
              dir="ltr"
              [class.sr-only]="item.markIsWordmark"
              >{{ item.name }}</span
            >
          </li>
        </ng-template>
      </div>
    </section>
  `,
})
export class TechStrip {
  protected readonly i18n = inject(I18nService);
  protected readonly stack = TECH_STACK;
}
