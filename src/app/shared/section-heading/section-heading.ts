import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * One heading treatment for the whole page: no eyebrow labels, no highlighted
 * word, start-aligned unless a section has a reason to centre.
 */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div [class]="centered() ? 'mx-auto max-w-[62ch] text-center' : 'max-w-[62ch]'">
      <h2
        [id]="headingId()"
        class="font-display text-3xl font-extrabold text-balance lg:text-4xl"
        [class]="tone() === 'light' ? 'text-white' : 'text-ink'"
      >
        {{ heading() }}
      </h2>

      @if (intro()) {
        <p
          class="mt-5 text-lg"
          [class]="tone() === 'light' ? 'text-white/70' : 'text-basalt'"
        >
          {{ intro() }}
        </p>
      }
    </div>
  `,
})
export class SectionHeading {
  readonly heading = input.required<string>();
  readonly intro = input<string>('');
  readonly headingId = input<string>('');
  readonly tone = input<'light' | 'dark'>('dark');
  readonly centered = input(false, { transform: booleanAttribute });
}
