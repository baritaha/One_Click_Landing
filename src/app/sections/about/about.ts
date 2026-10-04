import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';

/**
 * Who we are, in plain facts rather than inflated numbers: two paragraphs, the
 * three facts worth stating, and how we work.
 */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'night' },
  imports: [SectionHeading, Icon],
  template: `
    <!--
      Without the team grid this is the shortest section on the page, so it takes
      one step less padding than the site rhythm — at the full 144px the two
      columns floated in an empty band. The host keeps data-surface="night", so
      the FAQ below still collapses its own top padding against this one. When
      the section above is night too (Process, while the showreel is off), this
      one drops its own top padding the same way.
    -->
    <section
      id="about"
      class="bg-night py-20 lg:py-28 [[data-surface=night]+[data-surface=night]>&]:pt-0"
      aria-labelledby="about-heading"
    >
      <div class="site-container">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <app-section-heading
              headingId="about-heading"
              tone="light"
              [heading]="i18n.t('about.heading')"
            />

            <p class="mt-6 max-w-[62ch] text-lg text-white/70">{{ i18n.t('about.body1') }}</p>
            <p class="mt-5 max-w-[62ch] text-lg text-white/70">{{ i18n.t('about.body2') }}</p>

            <ul class="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              @for (fact of facts; track fact.key) {
                <li class="flex items-center gap-2.5 text-white">
                  <span class="text-deadsea" aria-hidden="true">
                    <app-icon [name]="fact.icon" [size]="18" />
                  </span>
                  {{ i18n.t(fact.key) }}
                </li>
              }
            </ul>
          </div>

          <div>
            <h3 class="font-display text-xl font-extrabold text-white">
              {{ i18n.t('about.values.heading') }}
            </h3>

            <dl class="mt-6 grid gap-6 sm:grid-cols-3">
              @for (value of values; track value.title) {
                <div class="border-t border-white/15 pt-5">
                  <dt class="font-display text-base font-extrabold text-white">
                    {{ i18n.t(value.title) }}
                  </dt>
                  <dd class="mt-3 text-sm/6 text-white/60">{{ i18n.t(value.body) }}</dd>
                </div>
              }
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class About {
  protected readonly i18n = inject(I18nService);

  protected readonly facts = [
    { key: 'about.fact.team', icon: 'layers' },
    { key: 'about.fact.country', icon: 'pin' },
    { key: 'about.fact.languages', icon: 'sparkle' },
  ] as const;

  protected readonly values = [
    { title: 'about.value.communication.title', body: 'about.value.communication.body' },
    { title: 'about.value.quality.title', body: 'about.value.quality.body' },
    { title: 'about.value.support.title', body: 'about.value.support.body' },
  ] as const;
}
