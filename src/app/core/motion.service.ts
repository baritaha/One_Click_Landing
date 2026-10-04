import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

export interface Motion {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}

/**
 * The only place GSAP is touched. It is imported dynamically and only in the
 * browser, so prerendering never sees `window`, and the animation code stays
 * out of the initial bundle.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private loading: Promise<Motion> | null = null;

  /** Live — a visitor can flip the OS setting while the page is open. */
  readonly reducedMotion = signal(false);

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    const query = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)');
    if (!query) {
      return;
    }
    this.reducedMotion.set(query.matches);
    query.addEventListener('change', (event) => this.reducedMotion.set(event.matches));
  }

  /** Resolves to GSAP + ScrollTrigger in the browser, or `null` on the server. */
  async load(): Promise<Motion | null> {
    if (!this.isBrowser) {
      return null;
    }
    this.loading ??= (async () => {
      const [core, scroll] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      core.gsap.registerPlugin(scroll.ScrollTrigger);
      return { gsap: core.gsap, ScrollTrigger: scroll.ScrollTrigger } as Motion;
    })();
    return this.loading;
  }

  /** +1 in LTR, -1 in RTL. Multiply every horizontal offset by this. */
  axis(isRtl: boolean): 1 | -1 {
    return isRtl ? -1 : 1;
  }
}
