import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { StepIllustration } from '../../data/process';

/**
 * Four small drawings for the process steps, on night backgrounds.
 * Iris-soft outlines with a single deadsea accent each. Decorative.
 */
@Component({
  selector: 'app-step-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 120 96"
      fill="none"
      stroke="var(--color-iris-soft)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-full"
      focusable="false"
    >
      @switch (step()) {
        @case ('discover') {
          <circle cx="50" cy="44" r="24" />
          <path d="M68 62l18 18" stroke="var(--color-deadsea)" stroke-width="3" />
          <path d="M40 40h20M40 50h12" />
        }

        @case ('design') {
          <rect x="16" y="16" width="52" height="64" rx="8" />
          <path d="M16 34h52M28 48h28M28 60h18" />
          <rect x="62" y="40" width="42" height="40" rx="8" stroke="var(--color-deadsea)" />
          <path d="M74 56h18M74 66h10" stroke="var(--color-deadsea)" />
        }

        @case ('build') {
          <rect x="14" y="20" width="92" height="56" rx="8" />
          <path d="M14 34h92" />
          <path d="M44 48l-10 10 10 10" stroke="var(--color-deadsea)" stroke-width="2.6" />
          <path d="M60 68l8-28" />
          <path d="M76 48l10 10-10 10" stroke="var(--color-deadsea)" stroke-width="2.6" />
        }

        @default {
          <path d="M60 14c14 10 20 24 20 40l-10 12H50L40 54c0-16 6-30 20-40z" />
          <circle cx="60" cy="42" r="8" stroke="var(--color-deadsea)" />
          <path d="M50 78l-8 10M70 78l8 10M60 80v12" stroke="var(--color-deadsea)" />
        }
      }
    </svg>
  `,
})
export class StepArt {
  readonly step = input.required<StepIllustration>();
}
