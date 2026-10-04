import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { SERVICES } from '../../data/services';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { ServiceArt } from '../../shared/service-art/service-art';

/**
 * An editorial list rather than a grid of identical cards — the six things we
 * do are not interchangeable, and a list lets each one keep its own weight.
 *
 * One row is open at a time, the first by default. Hovering opens a row on a
 * pointer device; clicking and the keyboard work everywhere.
 */
@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'salt' },
  imports: [SectionHeading, ServiceArt, Icon],
  styles: `
    .panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 420ms var(--ease-out-soft);
    }

    .panel.is-open {
      grid-template-rows: 1fr;
    }

    .panel > div {
      overflow: hidden;
    }

    @media (prefers-reduced-motion: reduce) {
      .panel {
        transition: none;
      }
    }
  `,
  template: `
    <section
      id="services"
      class="section-pad bg-salt"
      aria-labelledby="services-heading"
    >
      <div class="site-container">
        <app-section-heading
          headingId="services-heading"
          [heading]="i18n.t('services.heading')"
          [intro]="i18n.t('services.intro')"
        />

        <ul class="mt-14 border-t border-ink/10 lg:mt-20">
          @for (service of services; track service.id) {
            <li class="border-b border-ink/10">
              <h3>
                <button
                  type="button"
                  [id]="'svc-btn-' + service.id"
                  class="group flex w-full cursor-pointer items-start gap-6 py-7 text-start transition-colors duration-200 hover:text-iris lg:py-9"
                  [class]="isOpen(service.id) ? 'text-iris' : 'text-ink'"
                  [attr.aria-expanded]="isOpen(service.id)"
                  [attr.aria-controls]="'svc-panel-' + service.id"
                  (click)="open(service.id)"
                  (mouseenter)="open(service.id)"
                  (focus)="open(service.id)"
                >
                  <span class="min-w-0 flex-1">
                    <span class="block font-display text-2xl font-extrabold text-balance lg:text-3xl">
                      {{ i18n.text(service.title) }}
                    </span>
                    <span class="mt-2 block max-w-[62ch] font-body text-base font-normal tracking-normal text-basalt">
                      {{ i18n.text(service.summary) }}
                    </span>
                  </span>

                  <span
                    class="mt-1 grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-out-soft)]"
                    [class]="
                      isOpen(service.id)
                        ? 'rotate-180 border-transparent bg-deadsea text-night'
                        : 'border-ink/15 text-basalt group-hover:border-iris/40'
                    "
                    aria-hidden="true"
                  >
                    <app-icon name="chevronDown" [size]="18" />
                  </span>
                </button>
              </h3>

              <div
                class="panel"
                [class.is-open]="isOpen(service.id)"
                [id]="'svc-panel-' + service.id"
                role="region"
                [attr.aria-labelledby]="'svc-btn-' + service.id"
                [attr.inert]="isOpen(service.id) ? null : ''"
              >
                <div>
                  <div class="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-14">
                    <div>
                      <p class="text-sm font-medium text-basalt">
                        {{ i18n.t('services.whatYouGet') }}
                      </p>
                      <ul class="mt-4 space-y-3">
                        @for (point of service.points; track point.en) {
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

                      <p class="mt-7 text-sm font-medium text-basalt">
                        {{ i18n.t('services.tech') }}
                      </p>
                      <ul class="mt-3 flex flex-wrap gap-2">
                        @for (tag of service.tech; track tag) {
                          <li
                            class="rounded-full bg-white px-3 py-1.5 text-sm text-basalt ring-1 ring-ink/8"
                            dir="ltr"
                          >
                            {{ tag }}
                          </li>
                        }
                      </ul>
                    </div>

                    <app-service-art
                      class="hidden h-40 w-full lg:block"
                      [art]="service.illustration"
                    />
                  </div>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class Services {
  protected readonly i18n = inject(I18nService);
  protected readonly services = SERVICES;

  private readonly openId = signal(SERVICES[0].id);

  protected isOpen(id: string): boolean {
    return this.openId() === id;
  }

  /**
   * Always opens, never closes. One row is open at all times, so collapsing
   * would only produce an empty state — and on a pointer device the hover that
   * precedes a click has already opened the row, so a toggle would shut it
   * again the instant you clicked it.
   */
  protected open(id: string): void {
    this.openId.set(id);
  }
}
