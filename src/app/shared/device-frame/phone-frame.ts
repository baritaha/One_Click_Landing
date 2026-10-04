import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A phone shell to put a screen inside. Decorative only — the projected
 * content carries the meaning.
 */
@Component({
  selector: 'app-phone-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="relative rounded-[2.25rem] p-[6px] shadow-[var(--shadow-float)] ring-1"
      [class]="tone() === 'light' ? 'bg-night-2 ring-white/14' : 'bg-ink ring-ink/20'"
    >
      <div
        class="relative overflow-hidden rounded-[1.85rem]"
        [class]="tone() === 'light' ? 'bg-night' : 'bg-white'"
      >
        <span
          class="absolute inset-x-0 top-0 z-10 mx-auto mt-2 block h-1.5 w-16 rounded-full"
          [class]="tone() === 'light' ? 'bg-white/20' : 'bg-ink/15'"
          aria-hidden="true"
        ></span>
        <ng-content />
      </div>
    </div>
  `,
})
export class PhoneFrame {
  readonly tone = input<'light' | 'dark'>('light');
}
