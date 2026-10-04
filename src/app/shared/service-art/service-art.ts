import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { ServiceIllustration } from '../../data/services';

/**
 * Small line drawings for the services list. Iris outlines with one deadsea
 * accent each, so the six read as one set. Decorative — always `aria-hidden`.
 */
@Component({
  selector: 'app-service-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 200 150"
      fill="none"
      stroke="var(--color-iris)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-full"
      focusable="false"
    >
      @switch (art()) {
        @case ('web') {
          <rect x="16" y="24" width="140" height="96" rx="10" />
          <path d="M16 46h140" />
          <circle cx="30" cy="35" r="2.5" fill="var(--color-iris)" stroke="none" />
          <circle cx="40" cy="35" r="2.5" fill="var(--color-iris)" stroke="none" />
          <path d="M32 62h48M32 76h34" />
          <rect x="32" y="92" width="38" height="14" rx="7" fill="var(--color-deadsea)" stroke="none" />
          <rect
            x="104"
            y="62"
            width="68"
            height="58"
            rx="10"
            fill="#fff"
            stroke="var(--color-deadsea)"
          />
          <path d="M118 84h40M118 96h26" stroke="var(--color-deadsea)" />
        }

        @case ('mobile') {
          <rect x="26" y="16" width="62" height="118" rx="14" />
          <path d="M44 27h26" />
          <path d="M40 52h34M40 66h24M40 80h30" />
          <rect x="40" y="98" width="34" height="12" rx="6" fill="var(--color-deadsea)" stroke="none" />
          <rect x="104" y="34" width="62" height="100" rx="14" stroke="var(--color-deadsea)" />
          <circle cx="135" cy="72" r="16" stroke="var(--color-deadsea)" />
          <path d="M129 72l4 4 8-8" stroke="var(--color-deadsea)" />
          <path d="M118 104h34" stroke="var(--color-deadsea)" />
        }

        @case ('ecommerce') {
          <path d="M40 48h84l-8 74a8 8 0 0 1-8 7H56a8 8 0 0 1-8-7z" />
          <path d="M70 62V42a12 12 0 0 1 24 0v20" />
          <circle cx="146" cy="44" r="18" fill="var(--color-deadsea)" stroke="none" />
          <path d="M140 44l4 4 8-9" stroke="#fff" stroke-width="2.4" />
          <path d="M64 88h36M64 102h22" />
        }

        @case ('systems') {
          <rect x="18" y="20" width="60" height="38" rx="8" />
          <rect x="112" y="20" width="60" height="38" rx="8" />
          <rect x="66" y="94" width="60" height="38" rx="8" stroke="var(--color-deadsea)" />
          <path d="M48 58v18h48v18M144 58v18H96v18" />
          <path d="M32 34h22M32 44h32M126 34h22M126 44h32" />
          <path d="M80 108h32M80 118h20" stroke="var(--color-deadsea)" />
        }

        @case ('design') {
          <rect x="20" y="26" width="86" height="78" rx="10" />
          <path d="M20 48h86" />
          <rect
            x="78"
            y="56"
            width="86"
            height="72"
            rx="10"
            fill="#fff"
            stroke="var(--color-deadsea)"
          />
          <circle cx="104" cy="82" r="10" stroke="var(--color-deadsea)" />
          <path d="M122 76h28M122 90h18M96 106h54" stroke="var(--color-deadsea)" />
          <path
            d="M150 26l16 10-7 2-3 7z"
            fill="var(--color-iris)"
            stroke="var(--color-iris)"
          />
        }

        @default {
          <path
            d="M62 78a22 22 0 0 1 3-43 30 30 0 0 1 57-6 20 20 0 0 1-3 49z"
            stroke="var(--color-iris)"
          />
          <path d="M100 82v22M62 104h76M62 104v14M100 104v14M138 104v14" />
          <rect x="46" y="118" width="32" height="20" rx="6" />
          <rect x="84" y="118" width="32" height="20" rx="6" stroke="var(--color-deadsea)" />
          <rect x="122" y="118" width="32" height="20" rx="6" />
          <circle cx="100" cy="128" r="3" fill="var(--color-deadsea)" stroke="none" />
        }
      }
    </svg>
  `,
})
export class ServiceArt {
  readonly art = input.required<ServiceIllustration>();
}
