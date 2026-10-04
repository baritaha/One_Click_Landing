import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Hand-drawn stroke icons on a 24x24 grid. Everything is one consistent
 * weight, so the set reads as one family. Brand marks live in `BrandMark`.
 */
const ICONS = {
  menu: ['M3 6.5h18', 'M3 12h18', 'M3 17.5h18'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  chevronDown: ['m6 9.5 6 6 6-6'],
  arrowEnd: ['M4 12h15', 'm13 6 6 6-6 6'],
  arrowStart: ['M20 12H5', 'm11 18-6-6 6-6'],
  check: ['m5 12.5 4.5 4.5L19 7'],
  mail: ['M3.5 6h17a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z', 'm3 7 9 6 9-6'],
  phone: [
    'M15.5 21A13.5 13.5 0 0 1 3 8.5 2 2 0 0 1 5 6.4h2.6a1 1 0 0 1 1 .8l.7 2.9a1 1 0 0 1-.5 1.1l-1.4.8a11 11 0 0 0 4.6 4.6l.8-1.4a1 1 0 0 1 1.1-.5l2.9.7a1 1 0 0 1 .8 1v2.6A2 2 0 0 1 15.5 21z',
  ],
  pin: ['M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z', 'M12 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z'],
  clock: ['M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z', 'M12 7.5V12l3 1.8'],
  play: ['M8 5.6a.6.6 0 0 1 .9-.5l9.2 5.9a.6.6 0 0 1 0 1l-9.2 5.9a.6.6 0 0 1-.9-.5z'],
  cursor: ['M6 3.5 18.5 11 13 12.5 10.5 18.5z'],
  plus: ['M12 5.5v13', 'M5.5 12h13'],
  sparkle: ['M12 4.5 13.6 9.3 18.5 11 13.6 12.7 12 17.5 10.4 12.7 5.5 11l4.9-1.7z'],
  layers: ['m3.5 12 8.5 4.5 8.5-4.5', 'm3.5 16.5 8.5 4.5 8.5-4.5', 'M12 3 3.5 7.5 12 12l8.5-4.5z'],
} satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (d of paths(); track d) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  /** In px. Icons sit on the 8px grid: 16, 20, 24. */
  readonly size = input(20);

  protected readonly paths = computed<readonly string[]>(() => ICONS[this.name()]);
}
