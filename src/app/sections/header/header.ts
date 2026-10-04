import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { I18nService } from '../../core/i18n/i18n.service';
import type { DictKey } from '../../core/i18n/en';
import { ButtonDirective } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';
import { Logo } from '../../shared/logo/logo';

interface NavItem {
  id: string;
  key: DictKey;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'services', key: 'nav.services' },
  { id: 'work', key: 'nav.work' },
  { id: 'process', key: 'nav.process' },
  { id: 'about', key: 'nav.about' },
  { id: 'faq', key: 'nav.faq' },
];

/**
 * Sticky header. Transparent while the hero is behind it, then solid night
 * with a blur and a shadow once the page has moved 24px.
 *
 * The mobile menu is a native `<dialog>`, which brings the focus trap,
 * Escape-to-close, scroll lock and focus return with it.
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon, ButtonDirective],
  host: { class: 'contents' },
  styles: `
    dialog.sheet {
      width: 100vw;
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      margin: 0;
      padding: 0;
      border: 0;
      background: var(--color-night);
    }

    dialog.sheet::backdrop {
      background: var(--color-night);
    }

    @media (prefers-reduced-motion: no-preference) {
      dialog.sheet[open] {
        animation: sheet-in 260ms var(--ease-out-soft);
      }

      dialog.sheet[open] a,
      dialog.sheet[open] .sheet-item {
        animation: sheet-item-in 320ms var(--ease-out-soft) backwards;
        animation-delay: calc(80ms + var(--i, 0) * 45ms);
      }
    }

    @keyframes sheet-in {
      from {
        opacity: 0;
      }
    }

    @keyframes sheet-item-in {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
    }
  `,
  template: `
    <a class="skip-link" [href]="i18n.anchor('main')">{{ i18n.t('common.skip') }}</a>

    <header
      class="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300"
      [class]="
        scrolled()
          ? 'bg-night/92 shadow-[var(--shadow-header)] backdrop-blur-md'
          : 'bg-transparent'
      "
    >
      <div class="site-container flex h-16 items-center gap-6 lg:h-20">
        <a
          [href]="i18n.path()"
          class="group -m-2 rounded-full p-2"
          [attr.aria-label]="i18n.t('common.homeLink')"
        >
          <app-logo surface="night" [height]="36" />
        </a>

        <nav class="ms-auto hidden items-center gap-1 lg:flex" [attr.aria-label]="navLabel()">
          @for (item of navItems; track item.id) {
            <a
              [href]="i18n.anchor(item.id)"
              class="relative rounded-full px-3.5 py-2 text-[0.95rem] text-white/72 transition-colors duration-200 hover:text-white"
              [class.text-white]="active() === item.id"
              [attr.aria-current]="active() === item.id ? 'true' : null"
            >
              {{ i18n.t(item.key) }}
              <span
                class="absolute inset-x-3.5 -bottom-0.5 block h-0.5 rounded-full bg-deadsea transition-transform duration-300 ease-[var(--ease-out-soft)]"
                [class]="active() === item.id ? 'scale-x-100' : 'scale-x-0'"
                aria-hidden="true"
              ></span>
            </a>
          }
        </nav>

        <div class="ms-auto flex items-center gap-2 lg:ms-0">
          <a
            [href]="otherLangHref()"
            appButton="ghost"
            tone="light"
            class="h-10! px-4! text-sm!"
            [attr.aria-label]="i18n.t('common.langToggleAria')"
            [attr.lang]="i18n.otherLang()"
          >
            {{ i18n.t('common.langToggle') }}
          </a>

          <a
            [href]="i18n.anchor('contact')"
            appButton="primary"
            class="hidden! h-10! px-5! text-sm! sm:inline-flex!"
          >
            {{ i18n.t('hero.ctaPrimary') }}
          </a>

          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            [attr.aria-label]="i18n.t('common.menuOpen')"
            (click)="openMenu()"
          >
            <app-icon name="menu" [size]="24" />
          </button>
        </div>
      </div>
    </header>

    <!-- ───────────────────────── mobile sheet ───────────────────────── -->
    <dialog #sheet class="sheet" [attr.aria-label]="navLabel()" (close)="menuOpen.set(false)">
      <div class="flex h-full flex-col">
        <div class="site-container flex h-16 shrink-0 items-center">
          <app-logo surface="night" [height]="32" />
          <button
            type="button"
            class="sheet-item ms-auto inline-flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            [attr.aria-label]="i18n.t('common.menuClose')"
            (click)="closeMenu()"
          >
            <app-icon name="close" [size]="24" />
          </button>
        </div>

        <nav class="site-container flex flex-1 flex-col justify-center gap-1 pb-16">
          @for (item of navItems; track item.id; let i = $index) {
            <a
              [href]="i18n.anchor(item.id)"
              class="rounded-panel py-3 font-display text-3xl font-extrabold text-white/90 transition-colors hover:text-deadsea"
              [style.--i]="i"
              (click)="closeMenu()"
            >
              {{ i18n.t(item.key) }}
            </a>
          }
          <a
            [href]="i18n.anchor('contact')"
            class="rounded-panel py-3 font-display text-3xl font-extrabold text-white/90 transition-colors hover:text-deadsea"
            [style.--i]="navItems.length"
            (click)="closeMenu()"
          >
            {{ i18n.t('nav.contact') }}
          </a>

          <div class="sheet-item mt-8 flex flex-wrap items-center gap-3" [style.--i]="navItems.length + 1">
            <a [href]="i18n.anchor('contact')" appButton="primary" size="lg" (click)="closeMenu()">
              {{ i18n.t('hero.ctaPrimary') }}
            </a>
            <a
              [href]="otherLangHref()"
              appButton="secondary"
              tone="light"
              size="lg"
              [attr.lang]="i18n.otherLang()"
              (click)="closeMenu()"
            >
              {{ i18n.t('common.langToggle') }}
            </a>
          </div>
        </nav>
      </div>
    </dialog>
  `,
})
export class Header {
  protected readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly navItems = NAV_ITEMS;
  protected readonly scrolled = signal(false);
  protected readonly active = signal('');
  protected readonly menuOpen = signal(false);

  private readonly sheetRef = viewChild<ElementRef<HTMLDialogElement>>('sheet');

  protected readonly navLabel = computed(() =>
    this.i18n.lang() === 'ar' ? 'التنقل في الموقع' : 'Site navigation',
  );

  /**
   * The other language, carrying whichever section you are reading.
   *
   * A plain link, not a `routerLink`: both languages are prerendered documents,
   * so letting the browser load the other one is both faster to get right and
   * more correct. The router would swap the view in first and only then try to
   * find the anchor — which, with deferred sections, may not exist yet.
   */
  protected readonly otherLangHref = computed(() => {
    const section = this.active();
    return this.i18n.otherLangPath() + (section ? `#${section}` : '');
  });

  constructor() {
    afterNextRender(() => {
      this.watchScroll();
      this.watchSections();
    });

    effect(() => {
      const el = this.sheetRef()?.nativeElement;
      if (!this.isBrowser || !el) {
        return;
      }
      if (this.menuOpen() && !el.open) {
        el.showModal();
      } else if (!this.menuOpen() && el.open) {
        el.close();
      }
    });
  }

  protected openMenu(): void {
    this.menuOpen.set(true);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Solid header once the page has moved past the first 24 pixels. */
  private watchScroll(): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }
    const update = () => this.scrolled.set(view.scrollY > 24);
    update();
    view.addEventListener('scroll', update, { passive: true });
  }

  /** Scroll spy: the section crossing the middle of the viewport wins. */
  private watchSections(): void {
    const view = this.document.defaultView;
    if (!view || !('IntersectionObserver' in view)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.active.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    for (const item of this.navItems) {
      const el = this.document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    }
  }
}
