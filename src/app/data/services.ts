import type { Localized } from '../core/site.config';

export type ServiceIllustration = 'web' | 'mobile' | 'ecommerce' | 'systems' | 'design' | 'cloud';

export interface Service {
  id: string;
  title: Localized;
  summary: Localized;
  /** What the client actually receives. Kept short and concrete. */
  points: readonly Localized[];
  tech: readonly string[];
  illustration: ServiceIllustration;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'web',
    illustration: 'web',
    title: {
      en: 'Web platforms and websites',
      ar: 'منصات ومواقع الويب',
    },
    summary: {
      en: 'Fast, bilingual sites and web apps that hold up when your traffic grows.',
      ar: 'مواقع وتطبيقات ويب سريعة بلغتين، تصمد حين يكبر عدد زوّارك.',
    },
    points: [
      {
        en: 'A site that loads in under two seconds on a normal phone connection',
        ar: 'موقع يفتح في أقل من ثانيتين على اتصال هاتف عادي',
      },
      {
        en: 'Arabic and English side by side, each laid out the way it should read',
        ar: 'عربي وإنجليزي جنبًا إلى جنب، كلٌّ منهما مرتّب بالشكل الصحيح لقراءته',
      },
      {
        en: 'A content panel your team can use without calling us',
        ar: 'لوحة محتوى يستطيع فريقك استخدامها دون الرجوع إلينا',
      },
      {
        en: 'Search-ready pages, analytics, and a deploy pipeline you own',
        ar: 'صفحات جاهزة لمحركات البحث، وتحليلات، ونظام نشر تملكه أنت',
      },
    ],
    tech: ['Angular', 'React', 'Next.js', '.NET', 'Laravel', 'PostgreSQL'],
  },
  {
    id: 'mobile',
    illustration: 'mobile',
    title: {
      en: 'Mobile apps for iOS and Android',
      ar: 'تطبيقات الجوال لأنظمة iOS و Android',
    },
    summary: {
      en: 'One app, both stores, built to feel native on each of them.',
      ar: 'تطبيق واحد، متجران، مبني ليبدو أصيلًا على كل منهما.',
    },
    points: [
      {
        en: 'One codebase published to the App Store and Google Play',
        ar: 'شيفرة واحدة تُنشر على App Store و Google Play',
      },
      {
        en: 'Push notifications, maps, payments and camera wired in properly',
        ar: 'إشعارات وخرائط ومدفوعات وكاميرا مربوطة بالشكل الصحيح',
      },
      {
        en: 'Works offline where it matters, and syncs when the signal returns',
        ar: 'يعمل دون اتصال حين يلزم، ويزامن البيانات عند عودة الشبكة',
      },
      {
        en: 'We handle store submission, review replies and every update after that',
        ar: 'نتولى النشر في المتاجر والرد على المراجعات وكل تحديث بعدها',
      },
    ],
    tech: ['Flutter', 'React Native', 'Firebase', '.NET', 'Node.js'],
  },
  {
    id: 'ecommerce',
    illustration: 'ecommerce',
    title: {
      en: 'E-commerce and marketplaces',
      ar: 'المتاجر والأسواق الإلكترونية',
    },
    summary: {
      en: 'Selling online, from a single store to a marketplace with hundreds of vendors.',
      ar: 'بيع إلكتروني، من متجر واحد إلى سوق يضم مئات البائعين.',
    },
    points: [
      {
        en: 'Products, stock, offers and orders in one place your staff can run',
        ar: 'المنتجات والمخزون والعروض والطلبات في مكان واحد يديره موظفوك',
      },
      {
        en: 'Local and card payments, cash on delivery, and clear refund handling',
        ar: 'دفع محلي وبالبطاقة والدفع عند الاستلام، مع معالجة واضحة للاسترجاع',
      },
      {
        en: 'Multi-vendor mode: each seller manages their own store, you set the commission',
        ar: 'وضع متعدد البائعين: كل بائع يدير متجره، وأنت تحدد العمولة',
      },
      {
        en: 'Delivery, invoicing and accounting connected, not copied by hand',
        ar: 'التوصيل والفوترة والمحاسبة مرتبطة ببعضها، لا تُنقل يدويًا',
      },
    ],
    tech: ['Laravel', '.NET', 'Angular', 'PostgreSQL', 'Stripe', 'Redis'],
  },
  {
    id: 'systems',
    illustration: 'systems',
    title: {
      en: 'Custom business systems',
      ar: 'أنظمة أعمال مخصصة',
    },
    summary: {
      en: 'ERP, CRM, dashboards and the internal tools that replace a folder of spreadsheets.',
      ar: 'أنظمة ERP و CRM ولوحات تحكم وأدوات داخلية تحل محل مجلد من ملفات الإكسل.',
    },
    points: [
      {
        en: 'Your real process, modelled as it works — not bent to fit off-the-shelf software',
        ar: 'إجراءات عملك كما هي فعلًا، لا معدّلة لتناسب برنامجًا جاهزًا',
      },
      {
        en: 'Roles and permissions, so each person sees exactly what they should',
        ar: 'أدوار وصلاحيات، فيرى كل شخص ما يخصّه بالضبط',
      },
      {
        en: 'Reports and dashboards that answer the questions you ask every week',
        ar: 'تقارير ولوحات تجيب على الأسئلة التي تطرحها كل أسبوع',
      },
      {
        en: 'A full audit trail: who changed what, and when',
        ar: 'سجل تدقيق كامل: من غيّر ماذا، ومتى',
      },
    ],
    tech: ['.NET', 'Angular', 'SQL Server', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'design',
    illustration: 'design',
    title: {
      en: 'UI and UX design',
      ar: 'تصميم الواجهات وتجربة المستخدم',
    },
    summary: {
      en: 'Interfaces that make sense the first time someone opens them.',
      ar: 'واجهات تصبح مفهومة من أول مرة يفتحها فيها المستخدم.',
    },
    points: [
      {
        en: 'Flows and wireframes first, so we agree on the shape before any pixels',
        ar: 'مسارات ومخططات أولية أولًا، لنتفق على الشكل قبل أي تصميم نهائي',
      },
      {
        en: 'A design system with real components, not a folder of one-off screens',
        ar: 'نظام تصميم بمكوّنات حقيقية، لا مجلد شاشات منفصلة',
      },
      {
        en: 'Arabic and English designed together, so neither one feels translated',
        ar: 'تصميم العربية والإنجليزية معًا، فلا تبدو إحداهما مترجمة عن الأخرى',
      },
      {
        en: 'Contrast, focus states and touch targets checked against WCAG AA',
        ar: 'التباين وحالات التركيز ومساحات اللمس مفحوصة وفق معيار WCAG AA',
      },
    ],
    tech: ['Figma', 'Design systems', 'Prototyping', 'WCAG AA'],
  },
  {
    id: 'cloud',
    illustration: 'cloud',
    title: {
      en: 'Integrations, cloud and ongoing support',
      ar: 'الربط والاستضافة السحابية والدعم المستمر',
    },
    summary: {
      en: 'Connecting your product to everything else, and keeping it alive afterwards.',
      ar: 'ربط منتجك بكل ما حوله، وإبقاؤه يعمل بعد ذلك.',
    },
    points: [
      {
        en: 'Payment gateways, SMS, WhatsApp, shipping and accounting connected end to end',
        ar: 'بوابات دفع ورسائل نصية وواتساب وشحن ومحاسبة مربوطة من طرف إلى طرف',
      },
      {
        en: 'Hosting on AWS or Azure with automated deploys and nightly backups',
        ar: 'استضافة على AWS أو Azure مع نشر آلي ونسخ احتياطي ليلي',
      },
      {
        en: 'Monitoring and alerts, so we usually know before your customers do',
        ar: 'مراقبة وتنبيهات، فنعرف بالمشكلة قبل عملائك في العادة',
      },
      {
        en: 'A support agreement with a response time written down, not implied',
        ar: 'اتفاقية دعم بزمن استجابة مكتوب، لا مفهوم ضمنًا',
      },
    ],
    tech: ['AWS', 'Azure', 'Docker', 'CI/CD', 'Monitoring'],
  },
];
