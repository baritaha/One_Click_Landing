import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

import type { Locale, Localized } from '../site.config';
import { ar } from './ar';
import { en, type DictKey, type Dictionary } from './en';

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

/**
 * Holds the active language, translates keys, and keeps `<html lang>` and
 * `<html dir>` in sync. The language comes from the route (`/` = English,
 * `/ar` = Arabic), so both versions prerender to real static HTML.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);

  private readonly current = signal<Locale>('en');

  readonly lang = this.current.asReadonly();
  readonly dir = computed<'ltr' | 'rtl'>(() => (this.current() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this.current() === 'ar');
  readonly otherLang = computed<Locale>(() => (this.current() === 'ar' ? 'en' : 'ar'));

  /** Route path for the other language, e.g. `/ar` or `/`. */
  readonly otherLangPath = computed(() => (this.current() === 'ar' ? '/' : '/ar'));

  /** Route path for the page we are on. */
  readonly path = computed(() => (this.current() === 'ar' ? '/ar' : '/'));

  /**
   * Href for an in-page section link.
   *
   * A bare `#services` looks like it stays put, but `<base href="/">` makes the
   * browser resolve it against the site root — so on `/ar` every anchor on the
   * page quietly jumped the visitor back to the English version. Anchors have
   * to carry the current page's path.
   */
  anchor(id: string): string {
    return `${this.path()}#${id}`;
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
