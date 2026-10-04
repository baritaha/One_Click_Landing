import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { I18nService } from '../../core/i18n/i18n.service';
import type { DictKey } from '../../core/i18n/en';
import { SITE } from '../../core/site.config';
import { BrandMark } from '../../shared/brand-mark/brand-mark';
import { ButtonDirective } from '../../shared/button/button';
import { Icon } from '../../shared/icon/icon';
import { SectionHeading } from '../../shared/section-heading/section-heading';

type Status = 'idle' | 'sending' | 'whatsapp' | 'email' | 'posted' | 'failed';

type FieldName = 'name' | 'phone' | 'email' | 'company' | 'projectType' | 'budget' | 'message';

/** Control name -> the `id` of its input, for moving focus to the first error. */
const FIELD_IDS: Record<FieldName, string> = {
  name: 'c-name',
  phone: 'c-phone',
  email: 'c-email',
  company: 'c-company',
  projectType: 'c-type',
  budget: 'c-budget',
  message: 'c-message',
};

const PROJECT_TYPES: readonly DictKey[] = [
  'contact.type.website',
  'contact.type.mobile',
  'contact.type.ecommerce',
  'contact.type.system',
  'contact.type.other',
];

const BUDGETS: readonly DictKey[] = [
  'contact.budget.under1000',
  'contact.budget.1000to3000',
  'contact.budget.3000to7000',
  'contact.budget.over7000',
  'contact.budget.unsure',
];

/**
 * Accepts a Jordanian mobile the way people actually write it (07…, +962 7…)
 * and any international number too. Nine digits is the shortest real one.
 */
const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const raw = String(control.value ?? '').trim();
  if (!raw) {
    return { required: true };
  }
  if (!/^[+\d][\d\s()./-]*$/.test(raw)) {
    return { phone: true };
  }
  return raw.replace(/\D/g, '').length >= 9 ? null : { phone: true };
};

/**
 * No backend. The form builds a clean, readable message and hands it to
 * WhatsApp or the visitor's email app — both of which they already trust and
 * already have open. If `contactEndpoint` is filled in later, the same form
 * posts JSON there instead, without any change to the markup.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-surface': 'salt' },
  imports: [ReactiveFormsModule, SectionHeading, ButtonDirective, Icon, BrandMark],
  styles: `
    .field {
      width: 100%;
      border-radius: var(--radius-input);
      border: 1px solid color-mix(in oklab, var(--color-ink) 14%, transparent);
      background: #fff;
      padding: 0.75rem 0.95rem;
      color: var(--color-ink);
      transition:
        border-color 180ms var(--ease-out-soft),
        box-shadow 180ms var(--ease-out-soft);
    }

    .field::placeholder {
      color: color-mix(in oklab, var(--color-basalt) 70%, transparent);
    }

    .field:hover {
      border-color: color-mix(in oklab, var(--color-ink) 26%, transparent);
    }

    .field:focus {
      outline: none;
      border-color: var(--color-deadsea);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-deadsea) 28%, transparent);
    }

    .field[aria-invalid='true'] {
      border-color: #c0392b;
    }

    select.field {
      appearance: none;
      background-image: linear-gradient(45deg, transparent 50%, var(--color-basalt) 50%),
        linear-gradient(135deg, var(--color-basalt) 50%, transparent 50%);
      background-position:
        calc(100% - 20px) calc(50% + 2px),
        calc(100% - 15px) calc(50% + 2px);
      background-size:
        5px 5px,
        5px 5px;
      background-repeat: no-repeat;
      padding-inline-end: 2.5rem;
    }

    :host-context([dir='rtl']) select.field {
      background-position:
        15px calc(50% + 2px),
        20px calc(50% + 2px);
      padding-inline-end: 2.5rem;
      padding-inline-start: 0.95rem;
    }

    textarea.field {
      min-height: 8.5rem;
      resize: vertical;
    }
  `,
  template: `
    <section
      id="contact"
      class="section-pad bg-salt"
      aria-labelledby="contact-heading"
    >
      <div class="site-container">
        <app-section-heading
          headingId="contact-heading"
          centered
          [heading]="i18n.t('contact.heading')"
          [intro]="i18n.t('contact.intro')"
        />

        <div class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14">
          <!-- ───────────────────────── form ───────────────────────── -->
          <form
            class="rounded-[var(--radius-panel)] bg-white p-6 shadow-[var(--shadow-panel)] ring-1 ring-ink/6 sm:p-9"
            [formGroup]="form"
            novalidate
            (focusout)="bump()"
            (ngSubmit)="sendWhatsapp()"
          >
            <div class="grid gap-5 sm:grid-cols-2">
              <!-- name -->
              <p class="flex flex-col gap-2">
                <label class="text-sm font-medium text-ink" for="c-name">
                  {{ i18n.t('contact.form.name') }}
                </label>
                <input
                  id="c-name"
                  class="field"
                  type="text"
                  autocomplete="name"
                  formControlName="name"
                  [placeholder]="i18n.t('contact.form.namePlaceholder')"
                  [attr.aria-invalid]="invalid('name')"
                  [attr.aria-describedby]="invalid('name') ? 'c-name-err' : null"
                />
                @if (invalid('name')) {
                  <span id="c-name-err" class="text-sm text-[#c0392b]">
                    {{ i18n.t('contact.error.name') }}
                  </span>
                }
              </p>

              <!-- phone -->
              <p class="flex flex-col gap-2">
                <label class="text-sm font-medium text-ink" for="c-phone">
                  {{ i18n.t('contact.form.phone') }}
                </label>
                <input
                  id="c-phone"
                  class="field"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  dir="ltr"
                  formControlName="phone"
                  [placeholder]="i18n.t('contact.form.phonePlaceholder')"
                  [attr.aria-invalid]="invalid('phone')"
                  [attr.aria-describedby]="invalid('phone') ? 'c-phone-err' : null"
                />
                @if (invalid('phone')) {
                  <span id="c-phone-err" class="text-sm text-[#c0392b]">
                    {{ i18n.t('contact.error.phone') }}
                  </span>
                }
              </p>

              <!-- email -->
              <p class="flex flex-col gap-2">
                <label class="flex items-center gap-2 text-sm font-medium text-ink" for="c-email">
                  {{ i18n.t('contact.form.email') }}
                  <span class="font-normal text-basalt">({{ i18n.t('contact.form.optional') }})</span>
                </label>
                <input
                  id="c-email"
                  class="field"
                  type="email"
                  autocomplete="email"
                  dir="ltr"
                  formControlName="email"
                  [placeholder]="i18n.t('contact.form.emailPlaceholder')"
                  [attr.aria-invalid]="invalid('email')"
                  [attr.aria-describedby]="invalid('email') ? 'c-email-err' : null"
                />
                @if (invalid('email')) {
                  <span id="c-email-err" class="text-sm text-[#c0392b]">
                    {{ i18n.t('contact.error.email') }}
                  </span>
                }
              </p>

              <!-- company -->
              <p class="flex flex-col gap-2">
                <label class="flex items-center gap-2 text-sm font-medium text-ink" for="c-company">
                  {{ i18n.t('contact.form.company') }}
                  <span class="font-normal text-basalt">({{ i18n.t('contact.form.optional') }})</span>
                </label>
                <input
                  id="c-company"
                  class="field"
                  type="text"
                  autocomplete="organization"
                  formControlName="company"
                  [placeholder]="i18n.t('contact.form.companyPlaceholder')"
                />
              </p>

              <!-- project type -->
              <p class="flex flex-col gap-2">
                <label class="text-sm font-medium text-ink" for="c-type">
                  {{ i18n.t('contact.form.projectType') }}
                </label>
                <select
                  id="c-type"
                  class="field"
                  formControlName="projectType"
                  [attr.aria-invalid]="invalid('projectType')"
                  [attr.aria-describedby]="invalid('projectType') ? 'c-type-err' : null"
                >
                  <option value="" disabled>{{ i18n.t('contact.form.choose') }}</option>
                  @for (key of projectTypes; track key) {
                    <option [value]="key">{{ i18n.t(key) }}</option>
                  }
                </select>
                @if (invalid('projectType')) {
                  <span id="c-type-err" class="text-sm text-[#c0392b]">
                    {{ i18n.t('contact.error.projectType') }}
                  </span>
                }
              </p>

              <!-- budget -->
              <p class="flex flex-col gap-2">
                <label class="text-sm font-medium text-ink" for="c-budget">
                  {{ i18n.t('contact.form.budget') }}
                </label>
                <select
                  id="c-budget"
                  class="field"
                  formControlName="budget"
                  [attr.aria-invalid]="invalid('budget')"
                  [attr.aria-describedby]="invalid('budget') ? 'c-budget-err' : null"
                >
                  <option value="" disabled>{{ i18n.t('contact.form.choose') }}</option>
                  @for (key of budgets; track key) {
                    <option [value]="key">{{ i18n.t(key) }}</option>
                  }
                </select>
                @if (invalid('budget')) {
                  <span id="c-budget-err" class="text-sm text-[#c0392b]">
                    {{ i18n.t('contact.error.budget') }}
                  </span>
                }
              </p>

              <!-- message -->
              <p class="flex flex-col gap-2 sm:col-span-2">
                <label class="text-sm font-medium text-ink" for="c-message">
                  {{ i18n.t('contact.form.message') }}
                </label>
                <textarea
                  id="c-message"
                  class="field"
                  rows="5"
                  formControlName="message"
                  [placeholder]="i18n.t('contact.form.messagePlaceholder')"
                  [attr.aria-invalid]="invalid('message')"
                  [attr.aria-describedby]="invalid('message') ? 'c-message-err' : null"
                ></textarea>
                @if (invalid('message')) {
                  <span id="c-message-err" class="text-sm text-[#c0392b]">
                    {{ i18n.t('contact.error.message') }}
                  </span>
                }
              </p>
            </div>

            <!-- data-fab-avoid: the floating WhatsApp button steps aside while this is on screen -->
            <div class="mt-7 flex flex-wrap gap-3" data-fab-avoid>
              <button type="submit" appButton="primary" size="lg" [disabled]="status() === 'sending'">
                {{ status() === 'sending' ? i18n.t('contact.sending') : i18n.t('contact.sendWhatsapp') }}
              </button>
              <button
                type="button"
                appButton="secondary"
                size="lg"
                [disabled]="status() === 'sending'"
                (click)="sendEmail()"
              >
                {{ i18n.t('contact.sendEmail') }}
              </button>
            </div>

            <p class="mt-5 min-h-6 text-sm" aria-live="polite" [class]="feedbackClass()">
              {{ feedback() }}
            </p>
          </form>

          <!-- ──────────────────── direct contact ──────────────────── -->
          <div>
            <h3 class="font-display text-xl font-extrabold text-ink">
              {{ i18n.t('contact.direct.heading') }}
            </h3>

            <ul class="mt-7 space-y-5">
              <li class="flex items-start gap-4">
                <span class="mt-0.5 text-iris" aria-hidden="true">
                  <app-icon name="mail" [size]="20" />
                </span>
                <span>
                  <span class="block text-sm text-basalt">{{ i18n.t('common.email') }}</span>
                  <a
                    class="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-iris hover:decoration-iris"
                    dir="ltr"
                    [href]="'mailto:' + site.email"
                    >{{ site.email }}</a
                  >
                </span>
              </li>

              <li class="flex items-start gap-4">
                <span class="mt-0.5 text-iris" aria-hidden="true">
                  <app-icon name="phone" [size]="20" />
                </span>
                <span>
                  <span class="block text-sm text-basalt">{{ i18n.t('common.phone') }}</span>
                  <a
                    class="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-iris hover:decoration-iris"
                    dir="ltr"
                    [href]="telHref"
                    >{{ site.phone }}</a
                  >
                </span>
              </li>

              <li class="flex items-start gap-4">
                <span class="mt-0.5 text-iris" aria-hidden="true">
                  <app-brand-mark mark="whatsapp" [size]="20" />
                </span>
                <span>
                  <span class="block text-sm text-basalt">{{ i18n.t('common.whatsapp') }}</span>
                  <a
                    class="text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-iris hover:decoration-iris"
                    dir="ltr"
                    rel="noopener"
                    target="_blank"
                    [href]="'https://wa.me/' + site.whatsappNumber"
                    >{{ site.phone }}</a
                  >
                </span>
              </li>

              <li class="flex items-start gap-4">
                <span class="mt-0.5 text-iris" aria-hidden="true">
                  <app-icon name="pin" [size]="20" />
                </span>
                <span>
                  <span class="block text-sm text-basalt">{{ i18n.t('common.location') }}</span>
                  <span class="text-ink">{{ i18n.text(site.country) }}</span>
                </span>
              </li>

              <li class="flex items-start gap-4">
                <span class="mt-0.5 text-iris" aria-hidden="true">
                  <app-icon name="clock" [size]="20" />
                </span>
                <span>
                  <span class="block text-sm text-basalt">{{ i18n.t('common.hours') }}</span>
                  <span class="text-ink">{{ i18n.text(site.workingHours) }}</span>
                </span>
              </li>
            </ul>

            <!--
              For someone reading on a computer: scan with the phone and the chat
              opens there. Hidden below md — on a phone the floating WhatsApp
              button does the same job in one tap.
            -->
            <figure
              class="mt-10 hidden w-fit items-center gap-5 rounded-[var(--radius-panel)] bg-white p-4 ring-1 ring-ink/8 md:flex"
            >
              <img
                src="assets/images/whatsapp-qr.webp"
                width="480"
                height="481"
                loading="lazy"
                decoding="async"
                class="size-36 rounded-xl"
                [alt]="i18n.t('contact.qr.alt')"
              />
              <figcaption class="max-w-[16ch] text-sm font-medium text-ink">
                {{ i18n.t('contact.qr.caption') }}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Contact {
  protected readonly i18n = inject(I18nService);
  private readonly document = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);

  protected readonly site = SITE;
  protected readonly projectTypes = PROJECT_TYPES;
  protected readonly budgets = BUDGETS;

  protected readonly status = signal<Status>('idle');
  private readonly submitted = signal(false);
  /** Bumped on every blur so the template re-reads control state. */
  private readonly touchTick = signal(0);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [phoneValidator]],
    email: ['', [Validators.email]],
    company: [''],
    projectType: ['', [Validators.required]],
    budget: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected readonly feedback = computed(() => {
    switch (this.status()) {
      case 'whatsapp':
        return this.i18n.t('contact.sent.whatsapp');
      case 'email':
        return this.i18n.t('contact.sent.email');
      case 'posted':
        return this.i18n.t('contact.sent.posted');
      case 'failed':
        return this.i18n.t('contact.sent.failed');
      case 'sending':
        return this.i18n.t('contact.sending');
      default:
        return this.submitted() && this.form.invalid ? this.i18n.t('contact.error.summary') : '';
    }
  });

  protected readonly feedbackClass = computed(() =>
    this.status() === 'failed' || (this.status() === 'idle' && this.submitted())
      ? 'text-[#c0392b]'
      : 'text-deadsea-deep',
  );

  /** `tel:` needs the number without spaces. */
  protected readonly telHref = `tel:${SITE.phone.replace(/\s/g, '')}`;

  constructor() {
    // Re-read validity as the visitor fixes a field they have already left.
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.bump());
  }

  /** Blur is what reveals an error — never a keystroke mid-word. */
  protected bump(): void {
    this.touchTick.update((n) => n + 1);
  }

  protected invalid(name: FieldName): boolean {
    this.touchTick();
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected sendWhatsapp(): void {
    if (!this.validate()) {
      return;
    }
    if (this.site.contactEndpoint) {
      void this.post();
      return;
    }
    const url = `https://wa.me/${this.site.whatsappNumber}?text=${encodeURIComponent(this.messageBody())}`;
    this.document.defaultView?.open(url, '_blank', 'noopener');
    this.status.set('whatsapp');
  }

  protected sendEmail(): void {
    if (!this.validate()) {
      return;
    }
    if (this.site.contactEndpoint) {
      void this.post();
      return;
    }
    const subject = this.i18n.t('contact.mail.subject', { name: this.form.controls.name.value });
    const url = `mailto:${this.site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.messageBody())}`;
    const view = this.document.defaultView;
    if (view) {
      view.location.href = url;
    }
    this.status.set('email');
  }

  private validate(): boolean {
    this.submitted.set(true);
    this.status.set('idle');
    this.form.markAllAsTouched();
    this.touchTick.update((n) => n + 1);

    if (this.form.invalid) {
      const first = (Object.keys(FIELD_IDS) as FieldName[]).find(
        (key) => this.form.controls[key].invalid,
      );
      if (first) {
        this.document.getElementById(FIELD_IDS[first])?.focus();
      }
      return false;
    }
    return true;
  }

  /** Only used when `contactEndpoint` has been filled in. */
  private async post(): Promise<void> {
    this.status.set('sending');
    try {
      const response = await fetch(this.site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...this.form.getRawValue(), lang: this.i18n.lang() }),
      });
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      this.status.set('posted');
      this.form.reset();
      this.submitted.set(false);
    } catch {
      this.status.set('failed');
    }
  }

  /** A message a human can read at a glance, in the visitor's language. */
  private messageBody(): string {
    const value = this.form.getRawValue();
    const line = (key: DictKey, text: string) => (text ? `${this.i18n.t(key)}: ${text}` : '');

    return [
      this.i18n.t('contact.mail.intro'),
      '',
      line('contact.mail.label.name', value.name),
      line('contact.mail.label.phone', value.phone),
      line('contact.mail.label.email', value.email),
      line('contact.mail.label.company', value.company),
      line('contact.mail.label.type', value.projectType ? this.i18n.t(value.projectType as DictKey) : ''),
      line('contact.mail.label.budget', value.budget ? this.i18n.t(value.budget as DictKey) : ''),
      '',
      `${this.i18n.t('contact.mail.label.message')}:`,
      value.message,
    ]
      .filter((entry) => entry !== '' || true)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
  }
}
