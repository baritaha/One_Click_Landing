import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import { SITE, type Locale } from '../core/site.config';
import {
  CASE_STUDIES,
  SERVICE_PAGES,
  caseStudyPaths,
  servicePaths,
  type ServiceSlug,
} from '../data/pages';
import { PROCESS } from '../data/process';
import { PROJECTS } from '../data/projects';
import { SERVICES } from '../data/services';
import { Footer } from '../sections/footer/footer';
import { Header } from '../sections/header/header';
import { Icon } from '../shared/icon/icon';
import { LinkCards, PageCta, PageHero, type LinkCard } from '../shared/page-parts/page-parts';
import { ServiceArt } from '../shared/service-art/service-art';

/**
 * One page per core service (`/services/<slug>`, `/ar/services/<slug>`).
 * Everything on it comes from data/pages.ts and data/services.ts; the route
 * carries only the language and the slug.
 */
@Component({
  selector: 'app-service-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Footer, PageHero, PageCta, LinkCards, Icon, ServiceArt],
  template: `
    <app-header />

    <main id="main">
      <app-page-hero
        [crumbs]="crumbs()"
        [eyebrow]="i18n.t('nav.services')"
        [heading]="i18n.text(page().h1)"
        [intro]="i18n.text(page().intro)"
      />

      <section class="section-pad bg-salt">
        <div class="site-container grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
          <!-- ── the article ── -->
          <article class="max-w-[68ch]">
            @for (section of page().sections; track section.heading.en) {
              <h2 class="font-display text-2xl font-extrabold text-ink [&:not(:first-child)]:mt-12 lg:text-3xl">
                {{ i18n.text(section.heading) }}
              </h2>
              <p class="mt-4 text-lg/8 text-ink/80">{{ i18n.text(section.body) }}</p>
            }

            <h2 class="mt-12 font-display text-2xl font-extrabold text-ink lg:text-3xl">
              {{ i18n.t('page.process') }}
            </h2>
            <ol class="mt-6 space-y-6">
              @for (step of process; track step.id; let i = $index) {
                <li class="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4">
                  <span
                    class="grid size-9 place-items-center rounded-full bg-iris/12 font-display text-sm font-extrabold text-iris"
                    aria-hidden="true"
                    >{{ i + 1 }}</span
                  >
                  <div>
                    <h3 class="font-display text-lg font-extrabold text-ink">{{ i18n.text(step.title) }}</h3>
                    <p class="mt-1.5 text-ink/80">{{ i18n.text(step.body) }}</p>
                  </div>
                </li>
              }
            </ol>

            <h2 class="mt-12 font-display text-2xl font-extrabold text-ink lg:text-3xl">
              {{ i18n.t('page.timing') }}
            </h2>
            <p class="mt-4 text-lg/8 text-ink/80">{{ i18n.text(page().timing) }}</p>
          </article>

          <!-- ── at a glance ── -->
          <aside class="lg:sticky lg:top-28 lg:self-start">
            <div class="rounded-[var(--radius-panel)] bg-white p-6 ring-1 ring-ink/8">
              <app-service-art class="mb-6 hidden h-32 w-full lg:block" [art]="service().illustration" />

              <h2 class="text-sm font-medium text-basalt">{{ i18n.t('services.whatYouGet') }}</h2>
              <ul class="mt-4 space-y-3">
                @for (point of service().points; track point.en) {
                  <li class="flex items-start gap-3">
                    <span
                      class="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-deadsea/18 text-deadsea-deep"
                      aria-hidden="true"
                    >
                      <app-icon name="check" [size]="13" />
                    </span>
                    <span class="text-ink/85">{{ i18n.text(point) }}</span>
                  </li>
                }
              </ul>

              <h2 class="mt-7 text-sm font-medium text-basalt">{{ i18n.t('services.tech') }}</h2>
              <ul class="mt-3 flex flex-wrap gap-2">
                @for (tag of service().tech; track tag) {
                  <li class="rounded-full bg-salt px-3 py-1.5 text-sm text-basalt ring-1 ring-ink/8" dir="ltr">
                    {{ tag }}
                  </li>
                }
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <app-page-cta />

      <section class="section-pad bg-salt">
        <div class="site-container space-y-16">
          @if (relatedWork().length) {
            <app-link-cards
              headingId="related-work"
              [heading]="i18n.t('page.relatedWork')"
              [cards]="relatedWork()"
            />
          }
          <app-link-cards
            headingId="other-services"
            [heading]="i18n.t('page.otherServices')"
            [cards]="otherServices()"
          />
        </div>
      </section>
    </main>

    <app-footer />
  `,
})
export class ServicePage {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  private readonly lang = (this.route.snapshot.data['lang'] as Locale | undefined) ?? 'en';
  private readonly slug = this.route.snapshot.data['slug'] as ServiceSlug;

  protected readonly process = PROCESS;
  protected readonly page = computed(() => SERVICE_PAGES.find((p) => p.slug === this.slug)!);
  protected readonly service = computed(() => SERVICES.find((s) => s.id === this.page().serviceId)!);

  protected readonly crumbs = computed(() => [
    { label: this.i18n.t('page.home'), href: this.i18n.path() },
    { label: this.i18n.t('nav.services'), href: this.i18n.anchor('services') },
    { label: this.i18n.text(this.service().title), href: this.i18n.pagePath() },
  ]);

  protected readonly otherServices = computed<LinkCard[]>(() =>
    SERVICE_PAGES.filter((p) => p.slug !== this.slug).map((p) => {
      const service = SERVICES.find((s) => s.id === p.serviceId)!;
      return {
        title: this.i18n.text(service.title),
        summary: this.i18n.text(service.summary),
        href: servicePaths(p.slug)[this.i18n.lang()],
      };
    }),
  );

  protected readonly relatedWork = computed<LinkCard[]>(() =>
    this.page().related.map((slug) => {
      const study = CASE_STUDIES.find((c) => c.slug === slug)!;
      const project = PROJECTS.find((p) => p.id === study.projectId)!;
      return {
        title: this.i18n.text(project.name),
        summary: this.i18n.t('page.readCaseStudy'),
        href: caseStudyPaths(slug)[this.i18n.lang()],
      };
    }),
  );

  constructor() {
    const paths = servicePaths(this.slug);
    this.i18n.setPage(this.lang, paths);

    const page = this.page();
    const base = SITE.siteUrl.replace(/\/$/, '');
    this.seo.apply({
      title: this.i18n.text(page.meta.title),
      description: this.i18n.text(page.meta.description),
      path: paths[this.lang],
      lang: this.lang,
      alternates: paths,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: this.i18n.text(page.h1),
          description: this.i18n.text(page.meta.description),
          serviceType: this.i18n.text(this.service().title),
          provider: { '@type': 'Organization', name: SITE.name.en, url: `${base}/` },
          areaServed: { '@type': 'Country', name: 'Jordan' },
          availableLanguage: ['Arabic', 'English'],
          url: `${base}${paths[this.lang]}`,
        },
        breadcrumb(base, [
          [this.i18n.t('page.home'), this.i18n.path()],
          [this.i18n.t('nav.services'), this.i18n.anchor('services')],
          [this.i18n.text(this.service().title), paths[this.lang]],
        ]),
      ],
    });
  }
}

/** BreadcrumbList JSON-LD from [label, path] pairs. */
export function breadcrumb(base: string, items: readonly (readonly [string, string])[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${base}${path}`,
    })),
  };
}
