import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { I18nService } from '../../core/i18n/i18n.service';
import { MotionService } from '../../core/motion.service';
import { SITE } from '../../core/site.config';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { VideoDialog } from '../../shared/video-dialog/video-dialog';

/**
 * A silent preview loop behind a large play button; sound and controls arrive
 * with the dialog. The loop only loads once the frame is on screen, never
 * autoplays when the visitor has asked for less motion, and falls back to the
 * poster the moment a file is missing — so this section is never broken, only
 * quieter.
 */
@Component({
  selector: 'app-showreel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'salt' },
  imports: [SectionHeading, Icon, VideoDialog, NgOptimizedImage],
  styles: `
    .pulse::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 999px;
      box-shadow: 0 0 0 0 rgb(34 195 176 / 0.55);
      animation: pulse 2.8s var(--ease-out-soft) infinite;
    }

    @keyframes pulse {
      70%,
      100% {
        box-shadow: 0 0 0 26px rgb(34 195 176 / 0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pulse::after {
        animation: none;
      }
    }
  `,
  template: `
    <section
      id="showreel"
      class="section-pad bg-salt"
      aria-labelledby="showreel-heading"
    >
      <div class="site-container">
        <app-section-heading
          headingId="showreel-heading"
          [heading]="i18n.t('showreel.heading')"
          [intro]="i18n.t('showreel.intro')"
        />

        <div
          class="relative mt-12 aspect-video overflow-hidden rounded-[var(--radius-device)] bg-night shadow-[var(--shadow-float)] ring-1 ring-ink/8 lg:mt-16"
        >
          @if (showreel.poster) {
            <img
              [ngSrc]="showreel.poster"
              [alt]="i18n.t('showreel.dialogTitle')"
              fill
              sizes="(min-width: 1440px) 80vw, 95vw"
              class="object-cover"
            />
          }

          @defer (on viewport) {
            @if (showreel.preview.mp4 && !previewFailed() && !motion.reducedMotion()) {
              <video
                class="absolute inset-0 size-full object-cover"
                muted
                loop
                autoplay
                playsinline
                preload="none"
                aria-hidden="true"
                tabindex="-1"
                (error)="previewFailed.set(true)"
              >
                <source [src]="showreel.preview.webm" type="video/webm" (error)="onSourceFail()" />
                <source [src]="showreel.preview.mp4" type="video/mp4" (error)="onSourceFail()" />
              </video>
            }
          } @placeholder {
            <span class="absolute inset-0"></span>
          }

          <span
            class="pointer-events-none absolute inset-0 bg-night/35"
            aria-hidden="true"
          ></span>

          <button
            type="button"
            class="pulse absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-deadsea text-night shadow-[0_18px_44px_-12px_rgb(34_195_176/0.8)] transition-transform duration-200 ease-[var(--ease-press)] hover:scale-105 active:scale-95 sm:size-24"
            [attr.aria-label]="i18n.t('showreel.play')"
            (click)="dialogOpen.set(true)"
          >
            <app-icon name="play" [size]="30" class="ms-1 rtl:ms-0 rtl:me-1 rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      <app-video-dialog
        [open]="dialogOpen()"
        [mp4]="showreel.full.mp4"
        [webm]="showreel.full.webm"
        [poster]="showreel.poster"
        [title]="i18n.t('showreel.dialogTitle')"
        [closeLabel]="i18n.t('common.close')"
        [unavailableText]="i18n.t('showreel.unavailable')"
        (closed)="dialogOpen.set(false)"
      />
    </section>
  `,
})
export class Showreel {
  protected readonly i18n = inject(I18nService);
  protected readonly motion = inject(MotionService);

  protected readonly showreel = SITE.showreel;
  protected readonly dialogOpen = signal(false);
  protected readonly previewFailed = signal(false);

  private sourceFailures = 0;

  protected onSourceFail(): void {
    this.sourceFailures += 1;
    if (this.sourceFailures >= 2) {
      this.previewFailed.set(true);
    }
  }
}
