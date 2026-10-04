import type { Localized } from '../core/site.config';

export interface FaqItem {
  id: string;
  question: Localized;
  answer: Localized;
}

export const FAQ: readonly FaqItem[] = [
  {
    id: 'timeline',
    question: {
      en: 'How long does a typical project take?',
      ar: 'كم يستغرق المشروع عادةً؟',
    },
    answer: {
      en: 'A marketing site takes two to four weeks. A mobile app or an online store usually takes eight to fourteen weeks. A full business system depends on how many processes it replaces, and we break it into releases so you get the first useful piece in about six weeks instead of waiting for everything.',
      ar: 'الموقع التعريفي يستغرق من أسبوعين إلى أربعة. تطبيق الجوال أو المتجر الإلكتروني يستغرق عادةً من ثمانية إلى أربعة عشر أسبوعًا. أما نظام الأعمال المتكامل فيعتمد على عدد الإجراءات التي سيحل محلها، ونقسّمه إلى إصدارات لتستلم أول جزء مفيد خلال ستة أسابيع تقريبًا بدل انتظار كل شيء.',
    },
  },
  {
    id: 'cost',
    question: {
      en: 'How much does a project cost?',
      ar: 'كم تكلفة المشروع؟',
    },
    answer: {
      en: 'A marketing site starts around 1,000 JOD. An online store or a first mobile app is usually between 3,000 and 7,000 JOD. Business systems start around 7,000 JOD and rise with the number of user roles and integrations. What moves the number is scope, how many roles need their own screens, how many external systems we connect to, and whether the design is new or already exists. We quote a fixed price after the discovery step, so the figure you approve is the figure you pay.',
      ar: 'الموقع التعريفي يبدأ من حوالي 1,000 دينار. المتجر الإلكتروني أو أول تطبيق جوال يتراوح عادةً بين 3,000 و 7,000 دينار. وأنظمة الأعمال تبدأ من حوالي 7,000 دينار وترتفع بحسب عدد أدوار المستخدمين وعمليات الربط. ما يحرّك الرقم هو حجم النطاق، وعدد الأدوار التي تحتاج شاشات خاصة بها، وعدد الأنظمة الخارجية التي نربطها، وهل التصميم جديد أم موجود مسبقًا. نعطيك سعرًا ثابتًا بعد مرحلة الفهم، فالرقم الذي تعتمده هو الرقم الذي تدفعه.',
    },
  },
  {
    id: 'rtl',
    question: {
      en: 'Do you build Arabic and RTL products?',
      ar: 'هل تبنون منتجات عربية تدعم الاتجاه من اليمين لليسار؟',
    },
    answer: {
      en: 'Yes, and we design both directions together from the start rather than mirroring an English layout at the end. That means Arabic typography with the right line height, numbers and dates that read naturally, icons that flip when they should and stay put when they should not, and forms that make sense to someone typing in Arabic. This site is a working example.',
      ar: 'نعم، ونصمّم الاتجاهين معًا من البداية بدل عكس تصميم إنجليزي في آخر المشروع. هذا يعني طباعة عربية بارتفاع أسطر مناسب، وأرقامًا وتواريخ تُقرأ بشكل طبيعي، وأيقونات تنقلب حين يجب وتبقى ثابتة حين يجب، ونماذج مفهومة لمن يكتب بالعربية. وهذا الموقع نفسه مثال عملي.',
    },
  },
  {
    id: 'ownership',
    question: {
      en: 'Who owns the code when the project is done?',
      ar: 'من يملك الشيفرة عند انتهاء المشروع؟',
    },
    answer: {
      en: 'You do. The source code, the designs, the database and the hosting accounts are all yours, handed over in your own repository from the first week — not at the end. There is no licence to keep paying and nothing locking you to us. If you ever want another team to take over, everything they need is already in your hands.',
      ar: 'أنت تملكها. الشيفرة المصدرية والتصاميم وقاعدة البيانات وحسابات الاستضافة كلها لك، وتُسلَّم في مستودعك الخاص من الأسبوع الأول لا في النهاية. لا يوجد ترخيص تستمر بدفعه ولا شيء يقيّدك بنا. وإن أردت يومًا أن يتسلّم فريق آخر العمل، فكل ما يحتاجه موجود بين يديك أصلًا.',
    },
  },
  {
    id: 'maintenance',
    question: {
      en: 'Do you offer maintenance after launch?',
      ar: 'هل تقدّمون صيانة بعد الإطلاق؟',
    },
    answer: {
      en: 'Yes. Every project includes thirty days of free fixes after launch. After that, most clients move to a monthly support agreement that covers monitoring, security updates, backups and an agreed number of hours for changes. It is optional, and you can stop it whenever you want.',
      ar: 'نعم. كل مشروع يشمل ثلاثين يومًا من الإصلاحات المجانية بعد الإطلاق. بعدها ينتقل معظم العملاء إلى اتفاقية دعم شهرية تغطي المراقبة والتحديثات الأمنية والنسخ الاحتياطي وعدد ساعات متفق عليه للتعديلات. وهي اختيارية، ويمكنك إيقافها متى شئت.',
    },
  },
  {
    id: 'outside-jordan',
    question: {
      en: 'Do you work with clients outside Jordan?',
      ar: 'هل تعملون مع عملاء خارج الأردن؟',
    },
    answer: {
      en: 'Yes. Most of our work outside Jordan is in the Gulf, and we work remotely as standard: a weekly call, a shared board you can open any time, and a working link every week. We overlap with Gulf working hours, and we invoice in JOD or USD, whichever suits your accounting.',
      ar: 'نعم. معظم عملنا خارج الأردن في دول الخليج، ونعمل عن بُعد بشكل معتاد: مكالمة أسبوعية، ولوحة مشتركة تفتحها في أي وقت، ورابط يعمل كل أسبوع. ساعات عملنا تتقاطع مع ساعات العمل في الخليج، ونصدر الفواتير بالدينار أو بالدولار، أيهما يناسب محاسبتك.',
    },
  },
];
