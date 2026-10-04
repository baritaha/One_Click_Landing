import type { Localized } from '../core/site.config';

export interface Testimonial {
  id: string;
  quote: Localized;
  name: Localized;
  role: Localized;
  company: Localized;
  /** Placeholder quotes are listed in ASSETS.md as content to replace. */
  isPlaceholder?: boolean;
}

/**
 * All three entries are placeholders written in the right voice and length,
 * so the section looks finished while you collect the real quotes.
 * Replace the text, names and companies before launch — see ASSETS.md.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'placeholder-1',
    isPlaceholder: true,
    quote: {
      en: 'We had been running the whole operation on spreadsheets and phone calls. Six weeks in we had a system our staff actually preferred using, and the orders stopped getting lost.',
      ar: 'كنا ندير العمل كله على ملفات إكسل ومكالمات هاتفية. بعد ستة أسابيع صار لدينا نظام يفضّل موظفونا استخدامه فعلًا، وتوقفت الطلبات عن الضياع.',
    },
    name: { en: 'Client name', ar: 'اسم العميل' },
    role: { en: 'Operations manager', ar: 'مدير العمليات' },
    company: { en: 'Company name', ar: 'اسم الشركة' },
  },
  {
    id: 'placeholder-2',
    isPlaceholder: true,
    quote: {
      en: 'What stood out was how normal the updates were. Every week there was a link we could open and use, so we never had to take anyone at their word.',
      ar: 'ما لفت انتباهنا هو بساطة التحديثات. كل أسبوع كان هناك رابط نفتحه ونستخدمه، فلم نضطر يومًا لتصديق كلام دون دليل.',
    },
    name: { en: 'Client name', ar: 'اسم العميل' },
    role: { en: 'Founder', ar: 'مؤسس' },
    company: { en: 'Company name', ar: 'اسم الشركة' },
  },
  {
    id: 'placeholder-3',
    isPlaceholder: true,
    quote: {
      en: 'The Arabic version was not an afterthought. It reads the way our customers write, and that is the first thing they noticed about the app.',
      ar: 'النسخة العربية لم تكن إضافة متأخرة. إنها مكتوبة بالطريقة التي يكتب بها عملاؤنا، وهذا أول ما لاحظوه في التطبيق.',
    },
    name: { en: 'Client name', ar: 'اسم العميل' },
    role: { en: 'Marketing lead', ar: 'مسؤول التسويق' },
    company: { en: 'Company name', ar: 'اسم الشركة' },
  },
];
