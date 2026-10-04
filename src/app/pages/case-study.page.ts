import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import type { DictKey } from '../core/i18n/en';
import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import { SITE, type Locale } from '../core/site.config';
import {
  CASE_STUDIES,
  SERVICE_PAGES,
  caseStudyPaths,
  servicePaths,
  type CaseStudySlug,
} from '../data/pages';
import { PROJECTS, type Platform } from '../data/projects';
import { SERVICES } from '../data/services';
import { Footer } from '../sections/footer/footer';
import { Header } from '../sections/header/header';
import { ProjectMedia } from '../sections/work/project-media';
import { Icon } from '../shared/icon/icon';
import { LinkCards, PageCta, PageHero, type LinkCard } from '../shared/page-parts/page-parts';
import { breadcrumb } from './service.page';

const PLATFORM_KEYS: Record<Platform, DictKey> = {
  web: 'work.platform.web',
  ios: 'work.platform.ios',
  android: 'work.platform.android',
};

/**
 * One page per shipped product (`/work/<slug>`, `/ar/work/<slug>`). The devices
 * and the real app recording are the same ProjectMedia the home page uses, so
 * the video behaves identically — muted autoplay, poster for reduced motion.
 */
@Component({
  selector: 'app-case-study-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Footer, PageHero, PageCta, LinkCards, ProjectMedia, Icon],
  template: `
    <app-header />

    <main id="main">
      <app-page-hero
        [crumbs]="crumbs()"
        [eyebrow]="i18n.t('page.caseStudy')"
        [heading]="i18n.text(study().h1)"
        [intro]="i18n.text(project().summary)"
      />

      <section class="section-pad bg-salt">
        <div class="site-container">
          <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
            <app-project-media [project]="project()" />

            <div>
              <h2 class="font-display text-2xl font-extrabold text-ink">{{ i18n.t('work.features') }}</h2>
              <ul class="mt-5 space-y-3">
                @for (feature of project().features; track feature.en) {
                  <li class="flex items-start gap-3">
                    <span
                      class="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-deadsea/18 text-deadsea-deep"
                      aria-hidden="true"
                    >
                      <app-icon name="check" [size]="13" />
                    </span>
                    <span class="text-ink/85">{{ i18n.text(feature) }}</span>
                  </li>
                }
              </ul>

              <h2 class="mt-8 text-sm font-medium text-basalt">{{ i18n.t('work.platforms') }}</h2>
              <p class="mt-2 text-ink">{{ platforms() }}</p>

              <h2 class="mt-7 text-sm font-medium text-basalt">{{ i18n.t('work.tech') }}</h2>
              <ul class="mt-3 flex flex-wrap gap-2">
                @for (tag of project().tech; track tag) {
                  <li class="rounded-full bg-white px-3 py-1.5 text-sm text-basalt ring-1 ring-ink/8" dir="ltr">
                    {{ tag }}
                  </li>
                }
              </ul>
            </div>
          </div>

          <article class="mt-20 max-w-[68ch] lg:mt-28">
            @for (section of study().sections; track section.heading.en) {
              <h2 class="font-display text-2xl font-extrabold text-ink [&:not(:first-child)]:mt-12 lg:text-3xl">
                {{ i18n.text(section.heading) }}
              </h2>
              <p class="mt-4 text-lg/8 text-ink/80">{{ i18n.text(section.body) }}</p>
            }
          </article>
        </div>
      </section>

      <app-page-cta />

      <section class="section-pad bg-salt">
        <div class="site-container space-y-16">
          <app-link-cards headingId="study-services" [heading]="i18n.t('page.ourServices')" [cards]="services()" />
          <app-link-cards headingId="more-work" [heading]="i18n.t('page.moreWork')" [cards]="otherWork()" />
        </div>
      </section>
    </main>

    <app-footer />
  `,
})
export class CaseStudyPage {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  private readonly lang = (this.route.snapshot.data['lang'] as Locale | undefined) ?? 'en';
  private readonly slug = this.route.snapshot.data['slug'] as CaseStudySlug;

  protected readonly study = computed(() => CASE_STUDIES.find((c) => c.slug === this.slug)!);
  protected readonly project = computed(() => PROJECTS.find((p) => p.id === this.study().projectId)!);

  protected readonly crumbs = computed(() => [
    { label: this.i18n.t('page.home'), href: this.i18n.path() },
    { label: this.i18n.t('nav.work'), href: this.i18n.anchor('work') },
    { label: this.i18n.text(this.project().name), href: this.i18n.pagePath() },
  ]);

  protected readonly platforms = computed(() => {
    const separator = this.i18n.lang() === 'ar' ? '، ' : ' · ';
    return this.project()
      .platforms.map((platform) => this.i18n.t(PLATFORM_KEYS[platform]))
      .join(separator);
  });

  /** Every service page — the ones this project shows first. */
  protected readonly services = computed<LinkCard[]>(() => {
    const first = this.study().services;
    const ordered = [
      ...first.map((slug) => SERVICE_PAGES.find((p) => p.slug === slug)!),
      ...SERVICE_PAGES.filter((p) => !first.includes(p.slug)),
    ];
    return ordered.map((p) => {
      const service = SERVICES.find((s) => s.id === p.serviceId)!;
      return {
        title: this.i18n.text(service.title),
        summary: this.i18n.text(service.summary),
        href: servicePaths(p.slug)[this.i18n.lang()],
      };
    });
  });

  protected readonly otherWork = computed<LinkCard[]>(() =>
    CASE_STUDIES.filter((c) => c.slug !== this.slug).map((c) => {
      const project = PROJECTS.find((p) => p.id === c.projectId)!;
      return {
        title: this.i18n.text(project.name),
        summary: this.i18n.text(project.summary),
        href: caseStudyPaths(c.slug)[this.i18n.lang()],
      };
    }),
  );

  constructor() {
    const paths = caseStudyPaths(this.slug);
    this.i18n.setPage(this.lang, paths);

    const study = this.study();
    const base = SITE.siteUrl.replace(/\/$/, '');
    this.seo.apply({
      title: this.i18n.text(study.meta.title),
      description: this.i18n.text(study.meta.description),
      path: paths[this.lang],
      lang: this.lang,
      alternates: paths,
      jsonLd: breadcrumb(base, [
        [this.i18n.t('page.home'), this.i18n.path()],
        [this.i18n.t('nav.work'), this.i18n.anchor('work')],
        [this.i18n.text(this.project().name), paths[this.lang]],
      ]),
    });
  }
}
