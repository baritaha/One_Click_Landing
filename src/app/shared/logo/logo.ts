import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

import { LOGO_ART } from './logo-art';

/**
 * The OneClick logo: a bold numeral 1 with a cursor clicking its corner.
 *
 * Drawn inline rather than loaded from `public/assets/logo/*.svg` — the header
 * logo is above the fold, so an extra request would mean it arrives late. Both
 * come out of `npm run logo:build`, so they cannot drift apart.
 *
 * The wordmark is outlines, not live text, so it never waits on the webfont and
 * never renders in a fallback face.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
  template: `
    <svg
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
      fill="none"
      role="img"
      [attr.aria-label]="label()"
    >
      <path [attr.d]="art.one" [attr.fill]="numeral()" />

      @for (line of art.clicks; track line) {
        <path
          [attr.d]="line"
          stroke="var(--color-deadsea)"
          [attr.stroke-width]="art.clickWidth"
          stroke-linecap="round"
        />
      }

      <!-- paint-order keeps the outline outside the white, not eating into it -->
      <path
        [attr.d]="art.cursor"
        fill="#FFFFFF"
        stroke="var(--color-night)"
        [attr.stroke-width]="art.cursorStroke"
        stroke-linejoin="round"
        paint-order="stroke"
      />

      @if (wordmark()) {
        <path [attr.d]="art.wordmark" [attr.fill]="text()" />
      }
    </svg>
  `,
})
export class Logo {
  /** Which background it sits on, not what colour it is. */
  readonly surface = input<'night' | 'light'>('night');
  /** Set false for the mark on its own. */
  readonly wordmark = input(true, { transform: booleanAttribute });
  /** Rendered height in px; the width follows the artwork. */
  readonly height = input(32);
  readonly label = input('OneClick');

  protected readonly art = LOGO_ART;

  private readonly artWidth = computed(() => (this.wordmark() ? LOGO_ART.lockupWidth : 64));

  protected readonly viewBox = computed(() => `0 0 ${this.artWidth()} 64`);
  protected readonly width = computed(() => Math.round((this.artWidth() * this.height()) / 64));

  /** On night the numeral lifts to iris-soft so it does not sink into the page. */
  protected readonly numeral = computed(() =>
    this.surface() === 'night' ? 'var(--color-iris-soft)' : 'var(--color-iris)',
  );

  protected readonly text = computed(() =>
    this.surface() === 'night' ? '#FFFFFF' : 'var(--color-night)',
  );
}
