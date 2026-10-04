import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { SceneKey } from '../../data/projects';

/**
 * The interfaces that assemble inside the device frames.
 *
 * Deliberately made of pure geometry — no text. At this size real copy is
 * unreadable noise, and shapes let the same scene work in Arabic and English
 * without a single string. Every block carries `--i`, its position in the
 * assembly order, which the CSS stagger reads.
 *
 * The whole thing is `aria-hidden`; the section around it carries the
 * description for screen readers.
 */
@Component({
  selector: 'app-product-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', 'aria-hidden': 'true' },
  styles: `
    :host {
      /* The bars carry the whole mockup, so they have to read as content,
         not as a faint suggestion of it. */
      --bar: color-mix(in oklab, var(--color-ink) 22%, transparent);
      --bar-soft: color-mix(in oklab, var(--color-ink) 13%, transparent);
    }

    .b {
      opacity: 0;
      transform: translateY(10px) scale(0.965);
      animation: block-in 620ms var(--ease-press) forwards;
      animation-delay: calc(var(--start, 0ms) + var(--i, 0) * 62ms);
    }

    @keyframes block-in {
      to {
        opacity: 1;
        transform: none;
      }
    }

    .draw {
      stroke-dasharray: var(--len, 300);
      stroke-dashoffset: var(--len, 300);
      animation: draw 900ms var(--ease-out-soft) forwards;
      animation-delay: calc(var(--start, 0ms) + var(--i, 0) * 62ms);
    }

    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }

    /* Everything lands instantly and stays put. */
    @media (prefers-reduced-motion: reduce) {
      .b,
      .draw {
        animation: none;
        opacity: 1;
        transform: none;
        stroke-dashoffset: 0;
      }
    }
  `,
  template: `
    <div class="relative h-full bg-white" [style.--start]="startDelay() + 'ms'">
      @switch (scene()) {
        <!-- ─────────────────────────── Marketplace ─────────────────────── -->
        @case ('marketplace') {
          <div class="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-5">
            <div class="b flex items-center gap-2" style="--i: 0">
              <span class="size-5 rounded-full bg-iris"></span>
              <span class="h-2 w-12 rounded-full bg-[var(--bar)]"></span>
              <span class="ms-auto flex gap-1.5">
                <span class="h-2 w-8 rounded-full bg-[var(--bar-soft)]"></span>
                <span class="h-2 w-8 rounded-full bg-[var(--bar-soft)]"></span>
                <span class="size-5 rounded-full bg-deadsea/38"></span>
              </span>
            </div>

            <div
              class="b flex items-center gap-3 rounded-[var(--radius-panel)] bg-iris/14 p-3 sm:p-4"
              style="--i: 1"
            >
              <div class="flex-1 space-y-2">
                <span class="block h-2.5 w-3/5 rounded-full bg-iris/60"></span>
                <span class="block h-2 w-4/5 rounded-full bg-[var(--bar)]"></span>
                <span class="mt-1 block h-5 w-20 rounded-full bg-deadsea"></span>
              </div>
              <span class="hidden h-16 w-20 rounded-xl bg-iris/32 sm:block"></span>
            </div>

            <div class="grid flex-1 grid-cols-3 gap-2.5 sm:gap-3">
              @for (card of [0, 1, 2]; track card) {
                <div
                  class="b flex flex-col gap-2 rounded-xl bg-salt p-2 sm:p-2.5"
                  [style.--i]="2 + card"
                >
                  <span
                    class="block min-h-10 flex-1 rounded-lg"
                    [class]="card === 1 ? 'bg-deadsea/38' : 'bg-iris/32'"
                  ></span>
                  <span class="block h-1.5 w-full rounded-full bg-[var(--bar)]"></span>
                  <span class="block h-1.5 w-2/3 rounded-full bg-[var(--bar-soft)]"></span>
                </div>
              }
            </div>

            <div class="b mt-auto flex items-center gap-2 rounded-xl bg-salt p-2.5" style="--i: 5">
              <span class="size-6 rounded-lg bg-iris/32"></span>
              <span class="h-2 w-16 rounded-full bg-[var(--bar)]"></span>
              <span class="ms-auto h-5 w-14 rounded-full bg-deadsea"></span>
            </div>
          </div>
        }

        <!-- ──────────────────────────── Delivery ───────────────────────── -->
        @case ('delivery') {
          <div class="flex h-full flex-col gap-3 p-4 sm:p-5">
            <div class="b flex items-center gap-2" style="--i: 0">
              <span class="size-5 rounded-full bg-iris"></span>
              <span class="h-2 w-16 rounded-full bg-[var(--bar)]"></span>
              <span class="ms-auto h-5 w-12 rounded-full bg-deadsea/38"></span>
            </div>

            <div
              class="b dot-grid relative flex-1 overflow-hidden rounded-[var(--radius-panel)] bg-salt"
              style="--i: 1"
            >
              <svg
                viewBox="0 0 300 150"
                class="absolute inset-0 size-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M24 126 C 70 126, 78 74, 122 74 S 190 96, 214 60 S 252 30, 278 30"
                  fill="none"
                  stroke="var(--color-deadsea)"
                  stroke-width="3"
                  stroke-linecap="round"
                  class="draw"
                  style="--len: 340; --i: 2"
                />
                <circle cx="24" cy="126" r="6" fill="var(--color-iris)" class="b" style="--i: 3" />
                <circle
                  cx="278"
                  cy="30"
                  r="6"
                  fill="var(--color-night)"
                  class="b"
                  style="--i: 5"
                />
                <circle
                  cx="214"
                  cy="60"
                  r="9"
                  fill="var(--color-deadsea)"
                  class="b"
                  style="--i: 4"
                />
              </svg>

              <div
                class="b absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl bg-white/95 p-2 shadow-[var(--shadow-panel)] backdrop-blur-sm"
                style="--i: 6"
              >
                <span class="size-7 rounded-full bg-iris/38"></span>
                <span class="space-y-1.5">
                  <span class="block h-1.5 w-16 rounded-full bg-[var(--bar)]"></span>
                  <span class="block h-1.5 w-10 rounded-full bg-[var(--bar-soft)]"></span>
                </span>
                <span class="ms-auto h-4 w-14 rounded-full bg-deadsea"></span>
              </div>
            </div>

            <div class="space-y-2">
              @for (row of [0, 1]; track row) {
                <div
                  class="b flex items-center gap-2 rounded-lg bg-salt p-2"
                  [style.--i]="7 + row"
                >
                  <span
                    class="size-2 rounded-full"
                    [class]="row === 0 ? 'bg-deadsea' : 'bg-sandstone'"
                  ></span>
                  <span class="h-1.5 w-20 rounded-full bg-[var(--bar)]"></span>
                  <span class="ms-auto h-1.5 w-10 rounded-full bg-[var(--bar-soft)]"></span>
                </div>
              }
            </div>
          </div>
        }

        <!-- ─────────────────────────── Dashboard ───────────────────────── -->
        @default {
          <div class="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-5">
            <div class="b flex items-center gap-2" style="--i: 0">
              <span class="size-5 rounded-full bg-iris"></span>
              <span class="h-2 w-14 rounded-full bg-[var(--bar)]"></span>
              <span class="ms-auto h-5 w-5 rounded-full bg-[var(--bar-soft)]"></span>
            </div>

            <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
              @for (tile of [0, 1, 2]; track tile) {
                <div
                  class="b space-y-2 rounded-xl bg-salt p-2.5"
                  [style.--i]="1 + tile"
                >
                  <span class="block h-1.5 w-2/3 rounded-full bg-[var(--bar-soft)]"></span>
                  <span
                    class="block h-3 w-3/4 rounded-full"
                    [class]="tile === 0 ? 'bg-iris/70' : 'bg-[var(--bar)]'"
                  ></span>
                  <span
                    class="block h-1.5 w-1/2 rounded-full"
                    [class]="tile === 2 ? 'bg-sandstone' : 'bg-deadsea/75'"
                  ></span>
                </div>
              }
            </div>

            <div
              class="b relative min-h-24 flex-1 overflow-hidden rounded-[var(--radius-panel)] bg-salt p-3"
              style="--i: 4"
            >
              <svg
                viewBox="0 0 300 90"
                class="absolute inset-x-3 bottom-3 top-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 72 L40 58 L80 64 L120 38 L160 46 L200 22 L240 30 L300 8"
                  fill="none"
                  stroke="var(--color-iris)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="draw"
                  style="--len: 360; --i: 5"
                />
                <path
                  d="M0 72 L40 58 L80 64 L120 38 L160 46 L200 22 L240 30 L300 8 L300 90 L0 90 Z"
                  fill="var(--color-iris)"
                  opacity="0.14"
                  class="b"
                  style="--i: 6"
                />
              </svg>
            </div>

            <div class="mt-auto space-y-2">
              @for (row of [0, 1, 2]; track row) {
                <div class="b flex items-center gap-2" [style.--i]="7 + row">
                  <span class="size-4 rounded-md bg-[var(--bar-soft)]"></span>
                  <span class="h-1.5 flex-1 rounded-full bg-[var(--bar)]"></span>
                  <span
                    class="h-3.5 w-10 rounded-full"
                    [class]="row === 1 ? 'bg-deadsea/85' : 'bg-[var(--bar-soft)]'"
                  ></span>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class ProductScene {
  readonly scene = input.required<SceneKey>();
  /** Milliseconds before the first block lands. */
  readonly startDelay = input(0);
}
