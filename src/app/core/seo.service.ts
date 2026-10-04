import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE, type Locale } from './site.config';

export interface SeoInput {
  title: string;
  description: string;
  /** Path of this page, always starting with a slash. */
  path: string;
  lang: Locale;
  /** `noindex` for pages that should stay out of search results (404). */
  noindex?: boolean;
}

const OG_IMAGE = 'assets/images/og-image.png';

/**
 * Writes every head tag the site needs. Runs during prerender too, so the
 * static HTML that search engines and social crawlers fetch is already
 * complete — nothing depends on JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(input: SeoInput): void {
    const base = SITE.siteUrl.replace(/\/$/, '');
    const url = `${base}${input.path}`;
    const image = `${base}/${OG_IMAGE}`;

    this.title.setTitle(input.title);

    this.setMeta('name', 'description', input.description);
    this.setMeta('name', 'robots', input.noindex ? 'noindex, follow' : 'index, follow');

    this.setMeta('property', 'og:type', 'website');
    this.setMeta('property', 'og:site_name', SITE.name.en);
    this.setMeta('property', 'og:title', input.title);
    this.setMeta('property', 'og:description', input.description);
    this.setMeta('property', 'og:url', url);
    this.setMeta('property', 'og:image', image);
    this.setMeta('property', 'og:image:width', '1200');
    this.setMeta('property', 'og:image:height', '630');
    this.setMeta('property', 'og:locale', input.lang === 'ar' ? 'ar_JO' : 'en_US');
    this.setMeta('property', 'og:locale:alternate', input.lang === 'ar' ? 'en_US' : 'ar_JO');

    this.setMeta('name', 'twitter:card', 'summary_large_image');
    this.setMeta('name', 'twitter:title', input.title);
    this.setMeta('name', 'twitter:description', input.description);
    this.setMeta('name', 'twitter:image', image);

    this.setLink('canonical', url);
    this.setAlternate('en', `${base}/`);
    this.setAlternate('ar', `${base}/ar`);
    this.setAlternate('x-default', `${base}/`);

    this.setOrganizationJsonLd();
  }

  private setMeta(kind: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [kind]: key, content }, `${kind}="${key}"`);
  }

  private setLink(rel: string, href: string): void {
    const head = this.document.head;
    let el = head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]:not([hreflang])`);
    if (!el) {
      el = this.document.createElement('link');
      el.setAttribute('rel', rel);
      head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private setAlternate(hreflang: string, href: string): void {
    const head = this.document.head;
    let el = head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (!el) {
      el = this.document.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('hreflang', hreflang);
      head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  /** Organization schema — tells search engines who OneClick is and where. */
  private setOrganizationJsonLd(): void {
    const base = SITE.siteUrl.replace(/\/$/, '');
    const socials = Object.values(SITE.social).filter((url) => url.length > 0);

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name.en,
      alternateName: SITE.name.ar,
      url: `${base}/`,
      logo: `${base}/favicon.svg`,
      image: `${base}/${OG_IMAGE}`,
      description: 'Software company in Jordan building websites, mobile apps and business systems.',
      address: { '@type': 'PostalAddress', addressCountry: SITE.countryCode },
      areaServed: [
        { '@type': 'Country', name: 'Jordan' },
        { '@type': 'Country', name: 'Saudi Arabia' },
        { '@type': 'Country', name: 'United Arab Emirates' },
        { '@type': 'Country', name: 'Qatar' },
        { '@type': 'Country', name: 'Kuwait' },
      ],
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: SITE.teamSize.min,
        maxValue: SITE.teamSize.max,
      },
      knowsLanguage: ['ar', 'en'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: SITE.email,
        telephone: SITE.phone,
        areaServed: SITE.countryCode,
        availableLanguage: ['Arabic', 'English'],
        // Open around the clock, every day — matches SITE.workingHours.
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      },
      founder: {
        '@type': 'Person',
        name: SITE.founder.en,
        jobTitle: 'Software Engineer',
        ...(SITE.founderLinkedIn ? { sameAs: [SITE.founderLinkedIn] } : {}),
      },
    };

    if (SITE.foundedYear) {
      data['foundingDate'] = String(SITE.foundedYear);
    }
    if (socials.length) {
      data['sameAs'] = socials;
    }

    const id = 'ld-organization';
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
