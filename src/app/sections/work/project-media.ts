import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';

import { I18nService } from '../../core/i18n/i18n.service';
import { MotionService } from '../../core/motion.service';
import type { Project } from '../../data/projects';
import { BrowserFrame } from '../../shared/device-frame/browser-frame';
import { PhoneFrame } from '../../shared/device-frame/phone-frame';
import { PhoneScene } from '../../shared/scene/phone-scene';
import { ProductScene } from '../../shared/scene/product-scene';

/**
 * The device composition beside a project's copy.
 *
 * A project with a `phoneVideo` gets the browser frame plus two phones: the
 * drawn one, and beside it the real app recording — in front and larger,
 * because it is the real product. Both overlap the browser frame. Below sm
 * (640px) the drawn one is dropped so the recording can be big enough to read.
 *
 * Without a `phoneVideo` it falls back to the original layout: browser frame
 * and one small drawn phone. To give another project the same treatment, add a
 * `phoneVideo` to its entry in `data/projects.ts` — nothing here changes.
 *
 * The recording is never prerendered: it loads with `@defer (on viewport)`,
 * never plays for visitors who asked for less motion, and if both sources fail
 * the poster underneath is simply left showing.
 *
 * Autoplay is not left to the template. Angular sets `muted` as an attribute,
 * not the property, and a video that hydration or the defer swap creates can
 * come up unmuted — which browsers refuse to autoplay. So every video element
 * that appears is muted in code and `play()`ed, again on `loadeddata`, and
 * again whenever it scrolls back into view.
 */
@Component({
  selector: 'app-project-media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [BrowserFrame, PhoneFrame, ProductScene, PhoneScene, NgOptimizedImage],
  template: `
    @let p = project();
    @let video = p.phoneVideo;

    <!--
      The padding reserves the space the phones hang into. With a recording the
      browser gives up a quarter of the width, and the bottom padding is sized so
      the taller 9:20 phone always fits inside the box — nothing overflows into
      the copy below. From sm up the two phones sit side by side: the drawn one
      over the browser's end edge, the recording just past it and overlapping
      both.
    -->
    <div class="relative" [class]="video ? 'pe-[30%] pb-[28%] sm:pe-[24%] sm:pb-[14%]' : 'pe-[7%] pb-10'">
      <app-browser-frame tone="dark">
        <div class="relative aspect-[16/11] bg-white">
          @defer (on viewport) {
            @if (p.image) {
              <img
                [ngSrc]="p.image"
                [alt]="i18n.text(p.name)"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                class="object-cover"
              />
            } @else {
              <app-product-scene class="h-full" [scene]="p.scene" />
            }
          } @placeholder {
            <div class="absolute inset-0 bg-white"></div>
          }
        </div>
      </app-browser-frame>

      @if (video) {
        <!-- drawn phone: beside the recording, smaller, and only from sm up -->
        @if (hasMobile()) {
          <div class="absolute end-[26%] bottom-[8%] z-10 hidden w-[20%] sm:block">
            <app-phone-frame tone="dark">
              <div class="aspect-[9/20]">
                @defer (on viewport) {
                  <app-phone-scene class="block h-full" />
                } @placeholder {
                  <div class="h-full bg-white"></div>
                }
              </div>
            </app-phone-frame>
          </div>
        }

        <!-- the real app: in front and larger -->
        <div class="absolute end-0 bottom-0 z-20 w-[40%] sm:w-[28%]">
          <app-phone-frame tone="dark">
            <div class="relative aspect-[9/20] bg-night">
              <img
                [ngSrc]="video.poster"
                [alt]="i18n.t('work.appRecording', { name: i18n.text(p.name) })"
                fill
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 28vw, 40vw"
                class="object-cover"
              />

              @defer (on viewport) {
                @if (!motion.reducedMotion() && !videoFailed()) {
                  <video
                    #phoneVideo
                    class="absolute inset-0 size-full object-cover"
                    [poster]="video.poster"
                    muted
                    loop
                    autoplay
                    playsinline
                    preload="auto"
                    aria-hidden="true"
                    tabindex="-1"
                    (error)="videoFailed.set(true)"
                  >
                    <source [src]="video.webm" type="video/webm" (error)="onSourceFail()" />
                    <source [src]="video.mp4" type="video/mp4" (error)="onSourceFail()" />
                  </video>
                }
              } @placeholder {
                <span class="absolute inset-0"></span>
              }
            </div>
          </app-phone-frame>
        </div>
      } @else if (hasMobile()) {
        <div class="absolute -bottom-6 end-0 w-[20%] min-w-[76px] max-w-[118px]">
          <app-phone-frame tone="dark">
            <div class="aspect-[9/17]">
              @defer (on viewport) {
                <app-phone-scene class="block h-full" />
              } @placeholder {
                <div class="h-full bg-white"></div>
              }
            </div>
          </app-phone-frame>
        </div>
      }
    </div>
  `,
})
export class ProjectMedia {
  protected readonly i18n = inject(I18nService);
  protected readonly motion = inject(MotionService);

  readonly project = input.required<Project>();

  protected readonly hasMobile = computed(() =>
    this.project().platforms.some((platform) => platform !== 'web'),
  );

  protected readonly videoFailed = signal(false);

  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('phoneVideo');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private sourceFailures = 0;
  private teardown: (() => void) | null = null;

  constructor() {
    // Re-runs whenever the element behind the ref changes — the defer swap,
    // hydration, or the reduced-motion toggle bringing it back — so whichever
    // <video> is in the DOM is the one that gets set up.
    let current: HTMLVideoElement | null = null;
    afterRenderEffect(() => {
      const el = this.videoRef()?.nativeElement ?? null;
      if (!this.isBrowser || el === current) {
        return;
      }
      this.teardown?.();
      this.teardown = null;
      current = el;
      if (el) {
        this.teardown = this.startAutoplay(el);
      }
    });
    inject(DestroyRef).onDestroy(() => this.teardown?.());
  }

  /** Mutes the element as a property, plays it, and keeps retrying. */
  private startAutoplay(video: HTMLVideoElement): () => void {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const play = () => {
      if (video.paused) {
        // Rejections are expected (not loaded yet, tab hidden) — the next
        // loadeddata or intersection tries again.
        video.play().catch(() => undefined);
      }
    };

    video.addEventListener('loadeddata', play);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          play();
        } else {
          video.pause();
        }
      }
    });
    observer.observe(video);
    play();

    return () => {
      video.removeEventListener('loadeddata', play);
      observer.disconnect();
    };
  }

  /** A missing file fails per source; give up once both have. */
  protected onSourceFail(): void {
    this.sourceFailures += 1;
    if (this.sourceFailures >= 2) {
      this.videoFailed.set(true);
    }
  }
}
