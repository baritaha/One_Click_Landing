import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LOGO_PATHS, type LogoKey } from '../../data/logo-paths';

/**
 * Filled brand and product marks (tech stack, social links).
 * Always monochrome — it takes the surrounding text colour.
 */
@Component({
  selector: 'app-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
})
export class BrandMark {
  readonly mark = input.required<LogoKey>();
  readonly size = input(22);

  protected readonly path = computed(() => LOGO_PATHS[this.mark()]);
}
