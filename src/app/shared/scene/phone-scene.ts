import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The phone screen next to the browser frame: an order and its status.
 * Pure geometry, same reasoning as `ProductScene`.
 */
@Component({
  selector: 'app-phone-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  styles: `
    :host {
      --bar: color-mix(in oklab, var(--color-ink) 22%, transparent);
      --bar-soft: color-mix(in oklab, var(--color-ink) 13%, transparent);
    }

    .b {
      opacity: 0;
      transform: translateY(8px);
      animation: phone-in 560ms var(--ease-press) forwards;
      animation-delay: calc(var(--start, 0ms) + var(--i, 0) * 62ms);
    }

    @keyframes phone-in {
      to {
        opacity: 1;
        transform: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .b {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
  template: `
    <div class="flex h-full flex-col gap-3 bg-white p-3 pt-6" [style.--start]="startDelay() + 'ms'">
      <div class="b flex items-center gap-2" style="--i: 2">
        <span class="size-4 rounded-md bg-iris/38"></span>
        <span class="h-1.5 w-12 rounded-full bg-[var(--bar)]"></span>
      </div>

      <!-- order progress: three stops, the middle one live -->
      <div class="b space-y-2.5 rounded-xl bg-salt p-3" style="--i: 3">
        <span class="block h-1.5 w-2/3 rounded-full bg-[var(--bar)]"></span>
        <div class="flex items-center gap-1">
          <span class="size-2 rounded-full bg-deadsea"></span>
          <span class="h-0.5 flex-1 rounded-full bg-deadsea"></span>
          <span class="size-2.5 rounded-full bg-deadsea ring-4 ring-deadsea/20"></span>
          <span class="h-0.5 flex-1 rounded-full bg-[var(--bar-soft)]"></span>
          <span class="size-2 rounded-full bg-[var(--bar-soft)]"></span>
        </div>
        <span class="block h-1.5 w-1/2 rounded-full bg-[var(--bar-soft)]"></span>
      </div>

      @for (row of [0, 1, 2]; track row) {
        <div class="b flex items-center gap-2" [style.--i]="4 + row">
          <span class="size-6 rounded-lg bg-iris/28"></span>
          <span class="flex-1 space-y-1">
            <span class="block h-1.5 w-full rounded-full bg-[var(--bar)]"></span>
            <span class="block h-1.5 w-1/2 rounded-full bg-[var(--bar-soft)]"></span>
          </span>
        </div>
      }

      <div class="b mt-auto flex items-center justify-around pt-2" style="--i: 7">
        <span class="size-4 rounded-md bg-iris/55"></span>
        <span class="size-4 rounded-md bg-[var(--bar-soft)]"></span>
        <span class="size-4 rounded-md bg-[var(--bar-soft)]"></span>
      </div>
    </div>
  `,
})
export class PhoneScene {
  readonly startDelay = input(0);
}
