import type { Localized } from '../core/site.config';

export type StepIllustration = 'discover' | 'design' | 'build' | 'launch';

export interface ProcessStep {
  id: StepIllustration;
  title: Localized;
  body: Localized;
  /** The concrete thing you hold at the end of the step. */
  deliverable: Localized;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    id: 'discover',
    title: { en: 'Discover', ar: 'الفهم' },
    body: {
      en: 'We sit with you and learn the business: who uses this, what slows them down today, and what has to be true for the project to be worth doing. Then we agree on scope, timeline and price before anyone writes code.',
      ar: 'نجلس معك ونفهم طبيعة العمل: من سيستخدم المنتج، وما الذي يعطّلهم اليوم، وما الذي يجب أن يتحقق ليستحق المشروع التنفيذ. بعدها نتفق على النطاق والجدول الزمني والسعر قبل كتابة أي شيفرة.',
    },
    deliverable: {
      en: 'A written scope, a timeline and a fixed price',
      ar: 'نطاق مكتوب وجدول زمني وسعر ثابت',
    },
  },
  {
    id: 'design',
    title: { en: 'Design', ar: 'التصميم' },
    body: {
      en: 'Flows first, then wireframes, then the real interface in both Arabic and English. You approve the screens before we build them, so nothing expensive gets discovered late.',
      ar: 'المسارات أولًا، ثم المخططات الأولية، ثم الواجهة النهائية بالعربية والإنجليزية. تعتمد الشاشات قبل أن نبنيها، فلا نكتشف شيئًا مكلفًا في وقت متأخر.',
    },
    deliverable: {
      en: 'Approved screens you can click through',
      ar: 'شاشات معتمدة تستطيع تجربتها بنفسك',
    },
  },
  {
    id: 'build',
    title: { en: 'Build', ar: 'التنفيذ' },
    body: {
      en: 'We build in weekly cycles. Every week you get a working link, not a status report — you open it, click around, and tell us what to change while changing it is still cheap.',
      ar: 'ننفّذ على دورات أسبوعية. كل أسبوع تستلم رابطًا يعمل، لا تقرير حالة: تفتحه وتجرّبه وتخبرنا بما تريد تعديله وهو ما زال سهل التعديل.',
    },
    deliverable: {
      en: 'A working build every week',
      ar: 'نسخة تعمل كل أسبوع',
    },
  },
  {
    id: 'launch',
    title: { en: 'Launch and support', ar: 'الإطلاق والدعم' },
    body: {
      en: 'We deploy, move your data across, and train your team on the parts they will use daily. After that we stay on: monitoring, fixes, and the next round of improvements.',
      ar: 'ننشر المنتج وننقل بياناتك وندرّب فريقك على الأجزاء التي سيستخدمها يوميًا. وبعدها نبقى معك: مراقبة وإصلاحات وجولة التحسينات التالية.',
    },
    deliverable: {
      en: 'A live product and a support agreement',
      ar: 'منتج يعمل واتفاقية دعم',
    },
  },
];
