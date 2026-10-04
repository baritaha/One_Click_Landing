import { ChangeDetectionStrategy, Component, DOCUMENT, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  private readonly document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => void this.landOnOpeningAnchor());
  }

  /**
   * Arriving at `/ar#process` should put you at that section.
   *
   * The browser does this itself, and `scroll-behavior` is left on `auto` until
   * we are done so nothing animates over the top of it. All this adds is a
   * second landing after the webfonts arrive and change the metrics underneath
   * us — without it you end up a few lines off.
   *
   * Smooth scrolling is only switched on afterwards, so clicks inside the page
   * still glide while deep links land instantly and accurately.
   */
  private async landOnOpeningAnchor(): Promise<void> {
    const view = this.document.defaultView;
    const root = this.document.documentElement;
    const enableSmoothScrolling = () => root.setAttribute('data-smooth-scroll', '');

    const id = decodeURIComponent(view?.location.hash.slice(1) ?? '');
    if (!view || !id) {
      enableSmoothScrolling();
      return;
    }

    const jump = () => {
      const target = this.document.getElementById(id);
      if (!target) {
        return;
      }
      target.scrollIntoView({ block: 'start' });
    };

    jump();
    await this.document.fonts?.ready;
    jump();
    enableSmoothScrolling();
  }
}
