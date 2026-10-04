import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { HERO_SCENES } from '../../data/hero-scenes';
import { ButtonDirective } from '../../shared/button/button';
import { BrowserFrame } from '../../shared/device-frame/browser-frame';
import { PhoneFrame } from '../../shared/device-frame/phone-frame';
import { PhoneScene } from '../../shared/scene/phone-scene';
import { ProductScene } from '../../shared/scene/product-scene';

/** When the first, automatic build sequence finishes, in ms. */
const INTRO_DELAY = 1150;

/**
 * The hero — the one bold moment on the page.
 *
 * A cursor glides in, presses the OneClick button, and a real-looking product
 * assembles itself. Every click after that builds the next product.
 *
 * The whole sequence is CSS, driven by `--i` (a block's place in the assembly
 * order) and `--start` (when the run begins). That means it plays in the
 * prerendered HTML before any JavaScript arrives, there is no hydration flash,
 * and `prefers-reduced-motion` switches it off in one media query.
 * Angular only handles the clicking: which scene is showing, the button label,
 * and the announcement for screen readers.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, BrowserFrame, PhoneFrame, ProductScene, PhoneScene],
  styles: `
    /* ── the one glow allowed on the page ──────────────────────────── */
    .glow {
      position: absolute;
      inset-block-start: -18%;
      inset-inline-end: -10%;
      width: min(760px, 95vw);
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle, rgb(91 43 209 / 0.5) 0%, rgb(91 43 209 / 0) 68%);
      filter: blur(20px);
      animation: drift 26s ease-in-out infinite alternate;
    }

    @keyframes drift {
      to {
        transform: translate3d(-5%, 6%, 0) scale(1.08);
      }
    }

    /* ── the wireframe that the product replaces ───────────────────── */
    .wire {
      animation: wire-out 320ms var(--ease-out-soft) 1000ms forwards;
    }

    @keyframes wire-out {
      to {
        opacity: 0;
        visibility: hidden;
      }
    }

    /* ── the cursor: glides in, presses once, leaves ───────────────── */
    .cursor {
      animation: cursor-in 1150ms var(--ease-out-soft) 150ms both;
    }

    @keyframes cursor-in {
      0% {
        opacity: 0;
        transform: translate3d(calc(var(--dir, 1) * 132px), 92px, 0) scale(1.15);
      }
      18% {
        opacity: 1;
      }
      68% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
      76% {
        transform: translate3d(0, 3px, 0) scale(0.86);
      }
      86% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate3d(calc(var(--dir, 1) * 26px), 26px, 0) scale(1);
      }
    }

    /* ── the button press, timed to meet the cursor ────────────────── */
    .press {
      animation: press 420ms var(--ease-press) 940ms both;
    }

    @keyframes press {
      0%,
      100% {
        transform: scale(1);
      }
      30% {
        transform: scale(0.92);
      }
    }

    /* ── the deadsea ripple leaving the button ─────────────────────── */
    .ripple {
      animation: ripple 900ms var(--ease-out-soft) var(--ripple-delay, 0ms) both;
    }

    @keyframes ripple {
      from {
        opacity: 0.85;
        transform: scale(0.35);
      }
      to {
        opacity: 0;
        transform: scale(3.6);
      }
    }

    .scene-wrap {
      animation: scene-in 260ms linear both;
    }

    @keyframes scene-in {
      from {
        opacity: 0;
      }
    }

    /* ── reduced motion: end states only, nothing moves on its own ─── */
    @media (prefers-reduced-motion: reduce) {
      .glow {
        animation: none;
      }

      .wire {
        display: none;
      }

      .cursor {
        display: none;
      }

      .press,
      .ripple {
        animation: none;
      }

      .ripple {
        display: none;
      }

      .scene-wrap {
        animation: scene-in 200ms linear both;
      }
    }
  `,
  template: `
    <section
      id="hero"
      class="dot-grid relative overflow-hidden bg-night pt-28 pb-24 lg:pt-36 lg:pb-32"
    >
      <span class="glow pointer-events-none" aria-hidden="true"></span>

      <div
        class="site-container relative grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14"
      >
        <!-- ───────────────────────── copy ───────────────────────── -->
        <div>
          <h1
            class="font-display text-[clamp(2.5rem,5.6vw,5.5rem)] font-extrabold text-white text-balance"
          >
            {{ i18n.t('hero.headline') }}
          </h1>

          <p class="mt-7 max-w-[54ch] text-lg text-white/72">
            {{ i18n.t('hero.sub') }}
          </p>

          <div class="mt-10 flex flex-wrap items-center gap-3">
            <a [href]="i18n.anchor('contact')" appButton="primary" size="lg">
              {{ i18n.t('hero.ctaPrimary') }}
            </a>
            <a [href]="i18n.anchor('work')" appButton="secondary" tone="light" size="lg">
              {{ i18n.t('hero.ctaSecondary') }}
            </a>
          </div>

          <p class="mt-10 text-sm tracking-wide text-white/55">
            {{ i18n.t('hero.disciplines') }}
          </p>
        </div>

        <!-- ───────────────────────── stage ──────────────────────── -->
        <div
          class="relative mx-auto w-full max-w-[560px] pb-20 pe-[16%] lg:max-w-none lg:pb-24"
          [style.--dir]="i18n.isRtl() ? -1 : 1"
        >
          <div class="relative">
            <app-browser-frame tone="light">
              <div class="relative aspect-[16/11]">
                <!-- finished product -->
                @for (key of [runKey()]; track key) {
                  <div class="scene-wrap absolute inset-0">
                    <app-product-scene
                      class="h-full"
                      [scene]="currentScene().key"
                      [startDelay]="run() === 0 ? introDelay : 0"
                    />
                  </div>
                }

                <!-- the empty state it replaces -->
                @if (run() === 0) {
                  <div class="wire dot-grid absolute inset-0 bg-white p-4 sm:p-5" aria-hidden="true">
                    <div class="flex h-full flex-col gap-3">
                      <span class="block h-6 rounded-lg border border-dashed border-ink/15"></span>
                      <span class="block h-20 rounded-xl border border-dashed border-ink/15"></span>
                      <div class="grid flex-1 grid-cols-3 gap-3">
                        <span class="rounded-xl border border-dashed border-ink/15"></span>
                        <span class="rounded-xl border border-dashed border-ink/15"></span>
                        <span class="rounded-xl border border-dashed border-ink/15"></span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </app-browser-frame>

            <!-- ── the OneClick button, on the edge of the frame ── -->
            <div class="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
              <!-- scale lives on its own element so it never fights the centring transform -->
              <div class="relative" [class.press]="run() === 0">
                <!-- the ripple, re-created on every press so it replays -->
                @for (key of [runKey()]; track key) {
                  <span
                    class="ripple pointer-events-none absolute inset-0 rounded-full ring-2 ring-deadsea"
                    [style.--ripple-delay]="run() === 0 ? introDelay - 150 + 'ms' : '0ms'"
                    aria-hidden="true"
                  ></span>
                }

                <button
                  type="button"
                  class="relative grid h-[4.5rem] min-w-[4.5rem] cursor-pointer place-items-center whitespace-nowrap rounded-full bg-deadsea px-6 font-display text-sm font-extrabold text-night shadow-[0_14px_36px_-10px_rgb(34_195_176/0.85)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-press)] hover:scale-105 active:scale-[0.92] sm:h-20 sm:min-w-20 sm:px-7 sm:text-base"
                  [attr.aria-label]="buttonLabel() + ' — ' + i18n.t('hero.buttonAria')"
                  (click)="build()"
                >
                  {{ buttonLabel() }}
                </button>
              </div>

              <!-- the animated pointer that presses it the first time -->
              @if (run() === 0) {
                <svg
                  class="cursor pointer-events-none absolute start-[58%] top-[58%] z-10 drop-shadow-[0_6px_12px_rgb(20_11_46/0.45)]"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M6 3.2 19 11.4l-5.7 1.5-2.4 5.9z"
                    fill="#ffffff"
                    stroke="var(--color-night)"
                    stroke-width="1.1"
                    stroke-linejoin="round"
                  />
                </svg>
              }
            </div>

            <!-- ── the phone, overlapping the frame ── -->
            <div class="absolute -bottom-12 end-[-14%] z-10 w-[27%] min-w-[88px] max-w-[150px]">
              <app-phone-frame tone="dark">
                <div class="aspect-[9/17]">
                  @for (key of [runKey()]; track key) {
                    <app-phone-scene
                      class="block h-full"
                      [startDelay]="run() === 0 ? introDelay + 120 : 120"
                    />
                  }
                </div>
              </app-phone-frame>
            </div>
          </div>

          <p class="sr-only">{{ i18n.t('hero.stageLabel') }}</p>

          <!-- what changed, for people who cannot see it change -->
          <p class="sr-only" aria-live="polite">{{ announcement() }}</p>
        </div>
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly i18n = inject(I18nService);
  protected readonly introDelay = INTRO_DELAY;

  /** How many times the button has been pressed. 0 = the automatic first run. */
  protected readonly run = signal(0);
  /** Changing this key re-creates the scene so its CSS animation replays. */
  protected readonly runKey = computed(() => `run-${this.run()}`);

  protected readonly currentScene = computed(() => HERO_SCENES[this.run() % HERO_SCENES.length]);

  /** Stays "Click" until the first build has actually finished. */
  private readonly introDone = signal(false);
  protected readonly buttonLabel = computed(() =>
    this.introDone() || this.run() > 0
      ? this.i18n.t('hero.buttonAgain')
      : this.i18n.t('hero.buttonFirst'),
  );

  /** Empty until something changes, so nothing is announced on page load. */
  protected readonly announcement = computed(() =>
    this.run() === 0
      ? ''
      : this.i18n.t('hero.sceneAnnounce', { scene: this.i18n.text(this.currentScene().name) }),
  );

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.introDone.set(true), INTRO_DELAY);
    });
  }

  protected build(): void {
    this.run.update((value) => value + 1);
  }
}
