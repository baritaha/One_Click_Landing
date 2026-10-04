import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A browser window to put a screen inside. Purely decorative chrome — the
 * whole frame is hidden from assistive tech, so what matters is the content
 * projected into it.
 */
@Component({
  selector: 'app-browser-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="overflow-hidden rounded-[var(--radius-device)] shadow-[var(--shadow-float)] ring-1"
      [class]="tone() === 'light' ? 'bg-night-2 ring-white/12' : 'bg-white ring-ink/8'"
    >
      <div
        class="flex h-9 items-center gap-2 px-4"
        [class]="tone() === 'light' ? 'bg-white/6' : 'bg-salt'"
        aria-hidden="true"
      >
        <span class="flex gap-1.5">
          <i class="block size-2.5 rounded-full" [class]="dotClass()"></i>
          <i class="block size-2.5 rounded-full" [class]="dotClass()"></i>
          <i class="block size-2.5 rounded-full" [class]="dotClass()"></i>
        </span>
        <span
          class="ms-2 h-4 w-32 rounded-full sm:w-44"
          [class]="tone() === 'light' ? 'bg-white/10' : 'bg-ink/8'"
        ></span>
      </div>

      <div class="relative">
        <ng-content />
      </div>
    </div>
  `,
})
export class BrowserFrame {
  readonly tone = input<'light' | 'dark'>('light');

  protected dotClass(): string {
    return this.tone() === 'light' ? 'bg-white/20' : 'bg-ink/12';
  }
}
