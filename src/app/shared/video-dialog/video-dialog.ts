import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Icon } from '../icon/icon';

/**
 * Accessible video player in a modal.
 *
 * Built on the native `<dialog>` element, which gives us the focus trap,
 * Escape-to-close and focus return for free — all of it better tested than
 * anything we would write by hand. Clicking the backdrop closes it too.
 *
 * If the video file has not been added yet, the dialog shows the poster and a
 * plain explanation instead of a broken player.
 */
@Component({
  selector: 'app-video-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  styles: `
    dialog {
      /* Tailwind's preflight zeroes every margin, which also kills the
         auto margin a modal dialog relies on to centre itself. */
      margin: auto;
      width: min(1100px, 92vw);
      max-height: 90vh;
      padding: 0;
      border: 0;
      background: transparent;
      overflow: visible;
    }

    dialog::backdrop {
      background: rgb(20 11 46 / 0.82);
      backdrop-filter: blur(6px);
    }

    @media (prefers-reduced-motion: no-preference) {
      dialog[open] {
        animation: dialog-in 220ms var(--ease-out-soft);
      }

      dialog[open]::backdrop {
        animation: fade-in 220ms linear;
      }
    }

    @keyframes dialog-in {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }
  `,
  template: `
    <dialog #dialog [attr.aria-label]="title()" (click)="onBackdropClick($event)" (close)="onClose()">
      <div class="relative" (click)="$event.stopPropagation()">
        <button
          type="button"
          class="absolute top-4 end-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-night/70 text-white backdrop-blur-sm transition-colors hover:bg-night"
          [attr.aria-label]="closeLabel()"
          (click)="close()"
        >
          <app-icon name="close" [size]="20" />
        </button>

        @if (unavailable()) {
          <div
            class="flex aspect-video flex-col items-center justify-center gap-4 rounded-[var(--radius-device)] bg-night-2 p-8 text-center ring-1 ring-white/12"
          >
            <span class="grid size-14 place-items-center rounded-full bg-white/8 text-iris-soft">
              <app-icon name="play" [size]="24" />
            </span>
            <p class="max-w-[46ch] text-white/75">{{ unavailableText() }}</p>
          </div>
        } @else if (requested()) {
          <!--
            Only built once the dialog has actually been opened. Left in the
            markup from the start, the browser fetches the reel's metadata for
            every visitor who never presses play.
          -->
          <video
            #player
            class="aspect-video w-full rounded-[var(--radius-device)] bg-black ring-1 ring-white/12"
            controls
            playsinline
            preload="auto"
            [poster]="poster()"
            (error)="onFail()"
          >
            @if (webm()) {
              <source [src]="webm()" type="video/webm" (error)="onSourceFail()" />
            }
            <source [src]="mp4()" type="video/mp4" (error)="onSourceFail()" />
          </video>
        } @else {
          <div
            class="aspect-video w-full rounded-[var(--radius-device)] bg-black ring-1 ring-white/12"
          ></div>
        }
      </div>
    </dialog>
  `,
})
export class VideoDialog {
  readonly open = input(false);
  readonly mp4 = input<string>('');
  readonly webm = input<string>('');
  readonly poster = input<string>('');
  readonly title = input.required<string>();
  readonly closeLabel = input.required<string>();
  readonly unavailableText = input.required<string>();

  readonly closed = output<void>();

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly playerRef = viewChild<ElementRef<HTMLVideoElement>>('player');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly failed = signal(false);
  private sourceFailures = 0;

  /** Flips the first time the dialog opens, and stays on. */
  protected readonly requested = signal(false);

  /** No file configured yet counts as unavailable, same as a file that failed. */
  protected readonly unavailable = computed(() => !this.mp4() || this.failed());

  constructor() {
    effect(() => {
      if (this.open()) {
        this.requested.set(true);
      }
    });

    // Pressing play should play it. Opening the dialog is a user gesture, so
    // the browser allows sound here — but policies vary, and the native
    // controls are right there if it refuses.
    effect(() => {
      const video = this.playerRef()?.nativeElement;
      if (this.open() && video?.paused) {
        void video.play().catch(() => undefined);
      }
    });

    effect(() => {
      const el = this.dialogRef()?.nativeElement;
      if (!this.isBrowser || !el) {
        return;
      }
      if (this.open() && !el.open) {
        el.showModal();
      } else if (!this.open() && el.open) {
        el.close();
      }
    });
  }

  close(): void {
    this.dialogRef()?.nativeElement.close();
  }

  protected onClose(): void {
    const video = this.playerRef()?.nativeElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    this.closed.emit();
  }

  /** A click that lands on the dialog itself is a click on the backdrop. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef()?.nativeElement) {
      this.close();
    }
  }

  protected onFail(): void {
    this.failed.set(true);
  }

  /** Only give up once every source has failed. */
  protected onSourceFail(): void {
    this.sourceFailures += 1;
    if (this.sourceFailures >= (this.webm() ? 2 : 1)) {
      this.failed.set(true);
    }
  }
}
