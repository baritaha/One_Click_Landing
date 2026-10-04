import { ChangeDetectionStrategy, Component, computed, inject, isDevMode } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { caseStudyFor, caseStudyPaths } from '../../data/pages';
import { PROJECTS, type Platform, type Project } from '../../data/projects';
import type { DictKey } from '../../core/i18n/en';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { ProjectMedia } from './project-media';

const PLATFORM_KEYS: Record<Platform, DictKey> = {
  web: 'work.platform.web',
  ios: 'work.platform.ios',
  android: 'work.platform.android',
};

/**
 * Large alternating showcases. The media side swaps every row, and because the
 * layout is written with logical order it swaps again in Arabic without a
 * single extra rule.
 *
 * The devices live in `ProjectMedia`. Each frame's contents load with `@defer (on viewport)`, so nothing below the
 * fold costs anything until it is nearly on screen — and the scene's assembly
 * animation starts exactly when you arrive at it.
 */
@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'salt' },
  imports: [SectionHeading, ProjectMedia, Icon],
  template: `
    <section id="work" class="section-pad bg-salt" aria-labelledby="work-heading">
      <div class="site-container">
        <app-section-heading
          headingId="work-heading"
          [heading]="i18n.t('work.heading')"
          [intro]="i18n.t('work.intro')"
        />

        <div class="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
          @for (project of projects(); track project.id; let i = $index) {
            <article
              class="grid items-center gap-12 lg:gap-12"
              [class]="
                i % 2 === 1
                  ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]'
                  : 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'
              "
            >
              <!-- ── media ── -->
              <div [class]="i % 2 === 1 ? 'lg:order-2' : ''">
                <app-project-media [project]="project" />
              </div>

              <!-- ── copy ── -->
              <div>
                <h3 class="font-display text-2xl font-extrabold text-ink lg:text-3xl">
                  {{ i18n.text(project.name) }}
                </h3>

                <p class="mt-5 max-w-[62ch] text-basalt">{{ i18n.text(project.summary) }}</p>

                <p class="mt-8 text-sm font-medium text-basalt">{{ i18n.t('work.features') }}</p>
                <ul class="mt-3 space-y-2.5">
                  @for (feature of project.features; track feature.en) {
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

                <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
                  <div>
                    <p class="text-sm font-medium text-basalt">{{ i18n.t('work.platforms') }}</p>
                    <p class="mt-2 text-ink">{{ platformList(project) }}</p>
                  </div>
                </div>

                <p class="mt-7 text-sm font-medium text-basalt">{{ i18n.t('work.tech') }}</p>
                <ul class="mt-3 flex flex-wrap gap-2">
                  @for (tag of project.tech; track tag) {
                    <li
                      class="rounded-full bg-white px-3 py-1.5 text-sm text-basalt ring-1 ring-ink/8"
                      dir="ltr"
                    >
                      {{ tag }}
                    </li>
                  }
                </ul>

                @if (caseStudyHref(project); as href) {
                  <a
                    class="mt-8 inline-flex items-center gap-2 font-medium text-iris underline decoration-iris/30 underline-offset-4 transition-colors hover:decoration-iris"
                    [href]="href"
                  >
                    {{ i18n.t('page.readCaseStudy') }}
                    <span class="sr-only">: {{ i18n.text(project.name) }}</span>
                    <app-icon class="rtl:-scale-x-100" name="arrowEnd" [size]="16" />
                  </a>
                }
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Work {
  protected readonly i18n = inject(I18nService);

  /** Placeholder projects only show while developing. */
  protected readonly projects = computed(() =>
    PROJECTS.filter((project) => isDevMode() || !project.isPlaceholder),
  );

  protected caseStudyHref(project: Project): string | null {
    const study = caseStudyFor(project.id);
    return study ? caseStudyPaths(study.slug)[this.i18n.lang()] : null;
  }

  protected platformList(project: Project): string {
    const separator = this.i18n.lang() === 'ar' ? '، ' : ' · ';
    return project.platforms.map((platform) => this.i18n.t(PLATFORM_KEYS[platform])).join(separator);
  }
}
