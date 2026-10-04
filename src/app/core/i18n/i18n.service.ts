import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

import type { Locale, Localized } from '../site.config';
import { ar } from './ar';
import { en, type DictKey, type Dictionary } from './en';

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

/** One page's path in each language, e.g. `/services/ecommerce` and `/ar/services/ecommerce`. */
export type PagePaths = Record<Locale, string>;

const HOME: PagePaths = { en: '/', ar: '/ar' };

/**
 * Holds the active language, translates keys, and keeps `<html lang>` and
 * `<html dir>` in sync. The language comes from the route (`/` = English,
 * `/ar` = Arabic), so both versions prerender to real static HTML.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);

  private readonly current = signal<Locale>('en');
  private readonly page = signal<PagePaths>(HOME);

  readonly lang = this.current.asReadonly();
  readonly dir = computed<'ltr' | 'rtl'>(() => (this.current() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this.current() === 'ar');
  readonly otherLang = computed<Locale>(() => (this.current() === 'ar' ? 'en' : 'ar'));

  /** This page in the other language, e.g. `/ar/services/ecommerce`. */
  readonly otherLangPath = computed(() => this.page()[this.otherLang()]);

  /** The home page in the current language — where the sections live. */
  readonly path = computed(() => HOME[this.current()]);

  /** The page we are on, in the current language. */
  readonly pagePath = computed(() => this.page()[this.current()]);

  /**
   * Href for a home page section link (Services, Work, Contact…).
   *
   * A bare `#services` looks like it stays put, but `<base href="/">` makes the
   * browser resolve it against the site root — so on `/ar` every anchor on the
   * page quietly jumped the visitor back to the English version. Anchors have
   * to carry the current page's path.
   */
  anchor(id: string): string {
    return `${this.path()}#${id}`;
  }

  /** Href for a spot on the current page — the skip link, say. */
  here(id: string): string {
    return `${this.pagePath()}#${id}`;
  }

  /**
   * Language plus this page's path in both languages, so the language switch
   * lands on the same page instead of the other home page. Defaults to home.
   */
  setPage(lang: Locale, paths: PagePaths = HOME): void {
    this.page.set(paths);
    this.setLang(lang);
  }

  /**
   * Set synchronously from the routed page's constructor so the attributes are
   * already correct in the prerendered HTML — no flash, no hydration mismatch.
   */
  setLang(lang: Locale): void {
    this.current.set(lang);
    const root = this.document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  /** Translate a key, optionally replacing `{placeholders}`. */
  t(key: DictKey, params?: Record<string, string | number>): string {
    const value = DICTIONARIES[this.current()][key];
    if (!params) {
      return value;
    }
    return Object.entries(params).reduce<string>(
      (text, [name, replacement]) => text.split(`{${name}}`).join(String(replacement)),
      value,
    );
  }

  /** Pick the right side of a bilingual value coming from a data file. */
  text(value: Localized): string {
    return value[this.current()];
  }

  /** Same, for an optional bilingual value. */
  textOrEmpty(value: Localized | undefined): string {
    return value ? value[this.current()] : '';
  }
}
