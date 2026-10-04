import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { MotionService } from '../../core/motion.service';
import { PROCESS } from '../../data/process';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { StepArt } from '../../shared/step-art/step-art';

/**
 * The one scroll moment on the page.
 *
 * On a wide screen the heading and the progress line pin to the start side
 * while the four steps pass and light up one at a time. `gsap.matchMedia()`
 * scopes all of that to large viewports with motion allowed; everywhere else
 * this is a plain vertical timeline, and it reads perfectly well without any
 * JavaScript at all.
 */
@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'night' },
  imports: [SectionHeading, StepArt],
  styles: `
    /* Full line and full contrast by default, so the section is complete
       before — or without — GSAP. The script only takes contrast away. */
    .progress {
      transform-origin: top;
    }

    .step {
      transition:
        opacity 400ms var(--ease-out-soft),
        color 400ms var(--ease-out-soft);
    }

    @media (prefers-reduced-motion: reduce) {
      .step {
        transition: none;
        opacity: 1 !important;
      }
    }
  `,
  template: `
    <section
      id="process"
      class="dot-grid relative overflow-hidden bg-night"
      aria-labelledby="process-heading"
    >
      <div #root class="site-container section-pad">
        <div class="grid gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          <!-- ── pinned side ── -->
          <div #rail class="lg:self-start">
            <app-section-heading
              headingId="process-heading"
              tone="light"
              [heading]="i18n.t('process.heading')"
              [intro]="i18n.t('process.intro')"
            />

            <div class="mt-10 hidden items-center gap-5 lg:flex">
              <div class="relative h-32 w-px shrink-0 bg-white/12">
                <span
                  #progress
                  class="progress absolute inset-0 block w-px bg-deadsea"
                  aria-hidden="true"
                ></span>
              </div>
              <p class="text-sm text-white/55">
                {{ i18n.t('process.stepLabel', { number: active() + 1, total: steps.length }) }}
              </p>
            </div>
          </div>

          <!-- ── the steps ── -->
          <ol class="relative space-y-12 lg:space-y-24">
            <!-- the line the steps hang from -->
            <span
              class="absolute inset-y-0 start-[19px] w-px bg-white/10 lg:start-[23px]"
              aria-hidden="true"
            ></span>

            @for (step of steps; track step.id; let i = $index) {
              <li #stepEl class="step relative ps-14 lg:ps-20">
                <span
                  class="absolute start-0 top-0 grid size-10 place-items-center rounded-full font-display text-sm font-extrabold ring-1 transition-colors duration-300 lg:size-12 lg:text-base"
                  [class]="
                    i <= active()
                      ? 'bg-deadsea text-night ring-transparent'
                      : 'bg-white/6 text-white/50 ring-white/12'
                  "
                  aria-hidden="true"
                >
                  {{ i + 1 }}
                </span>

                <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                  <div class="min-w-0 flex-1">
                    <h3 class="font-display text-2xl font-extrabold text-white lg:text-3xl">
                      {{ i18n.text(step.title) }}
                    </h3>
                    <p class="mt-4 max-w-[58ch] text-white/70">{{ i18n.text(step.body) }}</p>
                    <p class="mt-5 inline-flex rounded-full bg-white/6 px-4 py-2 text-sm text-iris-soft">
                      {{ i18n.text(step.deliverable) }}
                    </p>
                  </div>

                  <app-step-art class="h-20 w-28 shrink-0 opacity-80" [step]="step.id" />
                </div>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class Process {
  protected readonly i18n = inject(I18nService);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly steps = PROCESS;
  protected readonly active = signal(PROCESS.length - 1);

  private readonly rootRef = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly railRef = viewChild.required<ElementRef<HTMLElement>>('rail');
  private readonly progressRef = viewChild.required<ElementRef<HTMLElement>>('progress');
  private readonly stepRefs = viewChildren<ElementRef<HTMLElement>>('stepEl');

  constructor() {
    afterNextRender(() => void this.setupScroll());
  }

  private async setupScroll(): Promise<void> {
    const motion = await this.motion.load();
    if (!motion) {
      return;
    }
    const { gsap, ScrollTrigger } = motion;

    const media = gsap.matchMedia();

    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const steps = this.stepRefs().map((ref) => ref.nativeElement);

      // The heading and progress line hold still while the steps go past.
      ScrollTrigger.create({
        trigger: this.rootRef().nativeElement,
        start: 'top top+=104',
        end: 'bottom bottom-=160',
        pin: this.railRef().nativeElement,
        pinSpacing: false,
      });

      // The line fills in step with the scroll.
      gsap.fromTo(
        this.progressRef().nativeElement,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: steps[0],
            endTrigger: steps[steps.length - 1],
            start: 'top center',
            end: 'bottom center',
            scrub: 0.4,
          },
        },
      );

      // Only the step you are reading keeps full contrast.
      steps.forEach((element, index) => {
        gsap.set(element, { opacity: index === 0 ? 1 : 0.42 });

        ScrollTrigger.create({
          trigger: element,
          start: 'top center+=120',
          end: 'bottom center',
          onToggle: (self) => {
            gsap.to(element, { opacity: self.isActive ? 1 : 0.42, duration: 0.4 });
            if (self.isActive) {
              this.active.set(index);
            }
          },
        });
      });

      this.active.set(0);

      return () => {
        gsap.set(steps, { clearProps: 'opacity' });
        this.active.set(this.steps.length - 1);
      };
    });

    this.destroyRef.onDestroy(() => media.revert());
  }
}
