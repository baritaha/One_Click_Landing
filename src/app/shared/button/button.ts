import { Directive, booleanAttribute, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Buttons are pills, echoing the physical button in the hero.
 * A directive rather than a component so `<a>` and `<button>` look identical
 * without wrapping either one in an extra element.
 *
 * `tone` says what the button sits on: `light` for night backgrounds,
 * `dark` for salt and white ones.
 */
@Directive({
  selector: '[appButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class ButtonDirective {
  readonly appButton = input<ButtonVariant>('primary');
  readonly tone = input<'light' | 'dark'>('dark');
  readonly size = input<'md' | 'lg'>('md');
  readonly block = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const base =
      'group relative inline-flex items-center justify-center gap-2 rounded-full font-body font-medium ' +
      'whitespace-nowrap transition-[transform,background-color,border-color,box-shadow,color] duration-200 ' +
      'ease-[var(--ease-out-soft)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-55 ' +
      'motion-safe:hover:-translate-y-0.5';

    const size = this.size() === 'lg' ? 'h-14 px-8 text-lg' : 'h-12 px-6 text-base';
    const width = this.block() ? 'w-full' : '';
    const light = this.tone() === 'light';

    let variant: string;
    switch (this.appButton()) {
      case 'primary':
        variant =
          'bg-deadsea text-night shadow-[0_10px_30px_-14px_rgb(34_195_176/0.95)] ' +
          'hover:bg-[#2ad8c3] hover:shadow-[0_16px_38px_-14px_rgb(34_195_176/0.9)]';
        break;
      case 'secondary':
        variant = light
          ? 'border border-white/25 text-white hover:border-white/55 hover:bg-white/8'
          : 'border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/5';
        break;
      default:
        variant = light
          ? 'text-white/80 hover:text-white hover:bg-white/8'
          : 'text-basalt hover:text-ink hover:bg-ink/5';
    }

    return [base, size, width, variant].filter(Boolean).join(' ');
  });
}
