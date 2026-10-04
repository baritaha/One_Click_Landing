import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { I18nService } from '../../core/i18n/i18n.service';
import { SITE } from '../../core/site.config';
import { BrandMark } from '../brand-mark/brand-mark';

/**
 * The floating WhatsApp button, on every page.
 *
 * It sits in the inline-end corner — bottom-right in English, bottom-left in
 * Arabic — clear of the notch and home indicator via the safe-area insets.
 *
 * So it never sits on top of something you need to tap or read, it steps aside
 * while any element marked `data-fab-avoid` is on screen: the footer, and the
 * contact form's send buttons (which offer WhatsApp themselves).
 */
@Component({
  selector: 'app-whatsapp-fab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandMark],
  template: `
    <a
      class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-[calc(1rem+env(safe-area-inset-right))] z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_32px_-8px_rgb(37_211_102/0.65)] transition-[opacity,transform,translate] duration-300 ease-[var(--ease-out-soft)] hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-deadsea active:scale-95 rtl:end-[calc(1rem+env(safe-area-inset-left))] lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] lg:end-[calc(1.5rem+env(safe-area-inset-right))] lg:rtl:end-[calc(1.5rem+env(safe-area-inset-left))]"
      [class.pointer-events-none]="hidden()"
      [class.opacity-0]="hidden()"
      [class.translate-y-4]="hidden()"
      [attr.aria-hidden]="hidden() ? 'true' : null"
      [attr.tabindex]="hidden() ? -1 : null"
      [href]="href"
      target="_blank"
      rel="noopener"
      [attr.aria-label]="i18n.t('common.whatsappChat')"
    >
      <app-brand-mark mark="whatsapp" [size]="28" />
    </a>
  `,
})
export class WhatsappFab {
  protected readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected readonly href = `https://wa.me/${SITE.whatsappNumber}`;
  protected readonly hidden = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const visible = new Set<Element>();
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target);
          } else {
            visible.delete(entry.target);
          }
        }
        this.hidden.set(visible.size > 0);
      });

      // Pages are swapped by the router, so look for the markers again after
      // every navigation.
      const watch = () => {
        observer.disconnect();
        visible.clear();
        this.hidden.set(false);
        this.document.querySelectorAll('[data-fab-avoid]').forEach((el) => observer.observe(el));
      };
      watch();
      const navigations = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => setTimeout(watch));

      destroyRef.onDestroy(() => {
        observer.disconnect();
        navigations.unsubscribe();
      });
    });
  }
}
