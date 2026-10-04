import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { SITE } from '../../core/site.config';
import type { LogoKey } from '../../data/logo-paths';
import { BrandMark } from '../../shared/brand-mark/brand-mark';
import { Logo } from '../../shared/logo/logo';
import { NAV_ITEMS } from '../header/header';

interface SocialLink {
  mark: LogoKey;
  label: string;
  url: string;
}

const SOCIAL_MARKS: readonly { key: keyof typeof SITE.social; mark: LogoKey; label: string }[] = [
  { key: 'linkedin', mark: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', mark: 'instagram', label: 'Instagram' },
  { key: 'facebook', mark: 'facebook', label: 'Facebook' },
  { key: 'github', mark: 'github', label: 'GitHub' },
  { key: 'x', mark: 'x', label: 'X' },
];

/** Closes the page on night, the same surface it opened on. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, BrandMark],
  template: `
    <!-- data-fab-avoid: the floating WhatsApp button steps aside while this is on screen -->
    <footer class="border-t border-white/10 bg-night pt-16 pb-10" data-fab-avoid>
      <div class="site-container">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <app-logo surface="night" [height]="40" />
            <p class="mt-6 max-w-[42ch] text-white/60">{{ i18n.t('footer.tagline') }}</p>

            @if (socials().length) {
              <ul class="mt-8 flex flex-wrap gap-2.5" [attr.aria-label]="i18n.t('footer.follow')">
                @for (social of socials(); track social.label) {
                  <li>
                    <a
                      class="grid size-11 place-items-center rounded-full bg-white/6 text-white/70 transition-colors duration-200 hover:bg-white/12 hover:text-white"
                      [href]="social.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      [attr.aria-label]="social.label"
                    >
                      <app-brand-mark [mark]="social.mark" [size]="19" />
                    </a>
                  </li>
                }
              </ul>
            }
          </div>

          <nav [attr.aria-label]="i18n.t('footer.sections')">
            <h2 class="font-display text-sm font-extrabold text-white">
              {{ i18n.t('footer.sections') }}
            </h2>
            <ul class="mt-5 space-y-3">
              @for (item of navItems; track item.id) {
                <li>
                  <a
                    class="text-white/60 transition-colors duration-200 hover:text-deadsea"
                    [href]="i18n.anchor(item.id)"
                    >{{ i18n.t(item.key) }}</a
                  >
                </li>
              }
              <li>
                <a
                  class="text-white/60 transition-colors duration-200 hover:text-deadsea"
                  [href]="i18n.anchor('contact')"
                >
                  {{ i18n.t('nav.contact') }}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 class="font-display text-sm font-extrabold text-white">
              {{ i18n.t('footer.contact') }}
            </h2>
            <ul class="mt-5 space-y-3">
              <li>
                <a
                  class="text-white/60 transition-colors duration-200 hover:text-deadsea"
                  dir="ltr"
                  [href]="'mailto:' + site.email"
                  >{{ site.email }}</a
                >
              </li>
              <li>
                <a
                  class="text-white/60 transition-colors duration-200 hover:text-deadsea"
                  dir="ltr"
                  [href]="telHref"
                  >{{ site.phone }}</a
                >
              </li>
              <li class="text-white/60">{{ i18n.text(site.country) }}</li>
              <li class="text-white/60">{{ i18n.text(site.workingHours) }}</li>
            </ul>
          </div>
        </div>

        <div
          class="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{{ i18n.t('footer.rights', { year: year }) }}</p>
          <p>{{ i18n.t('footer.builtBy') }}</p>
          <p>{{ i18n.t('footer.madeIn') }}</p>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly i18n = inject(I18nService);

  protected readonly site = SITE;
  protected readonly navItems = NAV_ITEMS;
  protected readonly year = new Date().getFullYear();
  protected readonly telHref = `tel:${SITE.phone.replace(/\s/g, '')}`;

  /** Only the networks that have actually been filled in show up. */
  protected readonly socials = computed<readonly SocialLink[]>(() =>
    SOCIAL_MARKS.filter((entry) => SITE.social[entry.key].length > 0).map((entry) => ({
      mark: entry.mark,
      label: entry.label,
      url: SITE.social[entry.key],
    })),
  );
}
