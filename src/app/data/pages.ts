import type { PagePaths } from '../core/i18n/i18n.service';
import type { Localized } from '../core/site.config';

/**
 * The standalone pages: one per core service, one per case study.
 *
 * This file is the single list behind the routes, the prerender config, the
 * links on the home page and the sitemap (which is built from what was
 * prerendered). Add an entry here and the page exists everywhere.
 *
 * The copy is written from what the site already says — the service points,
 * the process, the FAQ's timelines and prices, the project write-ups — so a
 * page never promises something the home page does not.
 */

export interface PageSection {
  heading: Localized;
  body: Localized;
}

export interface PageMeta {
  /** The <title>: "<what people search for> in Jordan | OneClick". */
  title: Localized;
  description: Localized;
}

export type ServiceSlug = 'web-development' | 'mobile-apps' | 'ecommerce' | 'business-systems';
export type CaseStudySlug = 'oneclick-commerce' | 'oneclick-delivery';

export interface ServicePage {
  slug: ServiceSlug;
  /** The matching entry in data/services.ts — its points, tech and illustration. */
  serviceId: 'web' | 'mobile' | 'ecommerce' | 'systems';
  meta: PageMeta;
  h1: Localized;
  intro: Localized;
  sections: readonly PageSection[];
  /** Timeline and price, from the FAQ. */
  timing: Localized;
  /** Case studies that show this service in a real project. */
  related: readonly CaseStudySlug[];
}

export interface CaseStudy {
  slug: CaseStudySlug;
  /** The matching entry in data/projects.ts — summary, features, tech, video. */
  projectId: 'commerce' | 'delivery';
  meta: PageMeta;
  h1: Localized;
  sections: readonly PageSection[];
  /** The services this project is an example of. */
  services: readonly ServiceSlug[];
}

export const servicePaths = (slug: ServiceSlug): PagePaths => ({
  en: `/services/${slug}`,
  ar: `/ar/services/${slug}`,
});

export const caseStudyPaths = (slug: CaseStudySlug): PagePaths => ({
  en: `/work/${slug}`,
  ar: `/ar/work/${slug}`,
});

export const SERVICE_PAGES: readonly ServicePage[] = [
  // ───────────────────────────── web ─────────────────────────────
  {
    slug: 'web-development',
    serviceId: 'web',
    related: ['oneclick-commerce'],
    meta: {
      title: {
        en: 'Website Development in Jordan | OneClick',
        ar: 'تصميم مواقع في الأردن | ون كليك',
      },
      description: {
        en: 'Fast Arabic and English websites and web apps, built in Jordan. A fixed price, a working link every week, and code that belongs to you.',
        ar: 'تصميم وبرمجة مواقع وتطبيقات ويب سريعة بالعربية والإنجليزية في الأردن. سعر ثابت، ورابط يعمل كل أسبوع، والشيفرة ملكك.',
      },
    },
    h1: {
      en: 'Website development in Jordan',
      ar: 'تصميم وبرمجة المواقع في الأردن',
    },
    intro: {
      en: 'OneClick designs and builds websites and web applications for companies in Jordan and across the Gulf. Every site is written in Arabic and English from the first day, stays fast on an ordinary phone connection, and comes with the code, the content panel and the hosting accounts in your name — so it stays yours long after launch.',
      ar: 'تصمّم ون كليك وتبني المواقع وتطبيقات الويب للشركات في الأردن ودول الخليج. نكتب كل موقع بالعربية والإنجليزية من اليوم الأول، ونبقيه سريعًا على اتصال هاتف عادي، ونسلّمك الشيفرة ولوحة المحتوى وحسابات الاستضافة باسمك، فيبقى الموقع ملكك بعد الإطلاق بوقت طويل.',
    },
    sections: [
      {
        heading: {
          en: 'Built for Arabic and English, not translated',
          ar: 'مبني للعربية والإنجليزية، لا مترجم',
        },
        body: {
          en: 'Most bilingual sites are an English layout flipped at the end, and it shows: numbers in the wrong order, icons pointing the wrong way, Arabic squeezed into lines meant for Latin letters. We design both directions together, with Arabic typography that has room to breathe, dates and prices that read naturally, and forms that make sense to someone typing in Arabic. Search engines get both versions as real pages, each with its own address and language tags, so people find you in the language they search in.',
          ar: 'معظم المواقع ثنائية اللغة تصميم إنجليزي يُعكس في آخر المشروع، ويظهر ذلك بوضوح: أرقام بترتيب خاطئ، وأيقونات تشير للاتجاه الخطأ، ونص عربي محشور في أسطر صُممت للحروف اللاتينية. نحن نصمّم الاتجاهين معًا، بطباعة عربية مريحة، وتواريخ وأسعار تُقرأ بشكل طبيعي، ونماذج مفهومة لمن يكتب بالعربية. وتحصل محركات البحث على النسختين كصفحات حقيقية، لكل منها عنوانها ووسوم لغتها، فيجدك الناس باللغة التي يبحثون بها.',
        },
      },
      {
        heading: {
          en: 'Fast, easy to find, and yours to run',
          ar: 'سريع، وسهل الوصول إليه، وتديره بنفسك',
        },
        body: {
          en: 'Speed is a feature: a page that takes five seconds to open on a phone loses most of the people who tapped it. We build pages that open in under two seconds on a normal mobile connection, then add what keeps a site useful — a content panel your team can update without calling us, analytics you can read, and pages structured so Google understands them. Hosting and deploys are set up in your name with automated backups, and the source code sits in your own repository from the first week.',
          ar: 'السرعة ميزة بحد ذاتها: الصفحة التي تحتاج خمس ثوانٍ لتفتح على الهاتف تخسر معظم من ضغطوا عليها. نبني صفحات تفتح في أقل من ثانيتين على اتصال جوال عادي، ثم نضيف ما يبقي الموقع مفيدًا: لوحة محتوى يحدّثها فريقك دون الرجوع إلينا، وتحليلات تستطيع قراءتها، وصفحات منظّمة يفهمها Google. نجهّز الاستضافة والنشر باسمك مع نسخ احتياطي آلي، وتبقى الشيفرة المصدرية في مستودعك الخاص من الأسبوع الأول.',
        },
      },
    ],
    timing: {
      en: 'A marketing website usually takes two to four weeks and starts around 1,000 JOD. Larger web platforms are priced on scope — how many user roles, screens and integrations they need. Either way you get a fixed price after the discovery step, and every project includes thirty days of free fixes after launch.',
      ar: 'يستغرق الموقع التعريفي عادةً من أسبوعين إلى أربعة، ويبدأ من حوالي 1,000 دينار. أما منصات الويب الأكبر فتُسعَّر بحسب النطاق: عدد أدوار المستخدمين والشاشات وعمليات الربط. وفي الحالتين تحصل على سعر ثابت بعد مرحلة الفهم، وكل مشروع يشمل ثلاثين يومًا من الإصلاحات المجانية بعد الإطلاق.',
    },
  },

  // ──────────────────────────── mobile ───────────────────────────
  {
    slug: 'mobile-apps',
    serviceId: 'mobile',
    related: ['oneclick-delivery', 'oneclick-commerce'],
    meta: {
      title: {
        en: 'Mobile App Development in Jordan | OneClick',
        ar: 'تطوير تطبيقات الجوال في الأردن | ون كليك',
      },
      description: {
        en: 'iOS and Android apps built in Jordan from one codebase, in Arabic and English. Store submission, updates and support after launch included.',
        ar: 'تطوير تطبيقات iOS و Android في الأردن من شيفرة واحدة، بالعربية والإنجليزية. مع النشر في المتاجر والتحديثات والدعم بعد الإطلاق.',
      },
    },
    h1: {
      en: 'Mobile app development in Jordan',
      ar: 'تطوير تطبيقات الجوال في الأردن',
    },
    intro: {
      en: 'OneClick builds mobile apps for iOS and Android for businesses in Jordan and the Gulf. One codebase reaches both the App Store and Google Play, designed to feel at home on each, in Arabic and English — and we stay on after launch for store reviews, updates and the next version.',
      ar: 'تبني ون كليك تطبيقات الجوال لنظامي iOS و Android للشركات في الأردن والخليج. شيفرة واحدة تصل إلى App Store و Google Play، بتصميم يبدو أصيلًا على كل منهما، بالعربية والإنجليزية، ونبقى معك بعد الإطلاق لمراجعات المتاجر والتحديثات والإصدار التالي.',
    },
    sections: [
      {
        heading: {
          en: 'One app, both stores',
          ar: 'تطبيق واحد للمتجرين',
        },
        body: {
          en: 'Building two separate native apps doubles the cost of every feature and every fix. We build one cross-platform app, so a change reaches iPhone and Android users together, while navigation, gestures and system dialogs still behave the way each platform expects. Push notifications, maps, payments and the camera are wired in properly, and the parts that matter keep working offline and sync when the signal returns — important for drivers, field staff and anyone using the app away from good coverage.',
          ar: 'بناء تطبيقين أصليين منفصلين يضاعف تكلفة كل ميزة وكل إصلاح. نحن نبني تطبيقًا واحدًا متعدد المنصات، فيصل أي تعديل إلى مستخدمي iPhone و Android معًا، بينما يبقى التنقل والإيماءات ونوافذ النظام كما يتوقعها مستخدم كل منصة. نربط الإشعارات والخرائط والمدفوعات والكاميرا بالشكل الصحيح، وتبقى الأجزاء المهمة تعمل دون اتصال ثم تزامن بياناتها عند عودة الشبكة، وهذا مهم للسائقين والفرق الميدانية وكل من يستخدم التطبيق بعيدًا عن تغطية جيدة.',
        },
      },
      {
        heading: {
          en: 'From the first build to the store, and after',
          ar: 'من أول نسخة إلى المتجر، وما بعده',
        },
        body: {
          en: 'You test the real app on your own phone every week, not screenshots in a slide deck. When it is ready we prepare the store listings, submit to Apple and Google, and answer the review teams if they come back with questions. After launch an app needs care: new OS versions, new devices and the features your users ask for. Most clients keep us on a monthly support agreement for exactly that, and the app, its code and its store accounts stay in your name throughout.',
          ar: 'تجرّب التطبيق الحقيقي على هاتفك كل أسبوع، لا صورًا في عرض تقديمي. وحين يجهز نعدّ صفحات المتاجر، ونرسله إلى Apple و Google، ونرد على فرق المراجعة إن عادت بأسئلة. وبعد الإطلاق يحتاج التطبيق إلى متابعة: إصدارات أنظمة جديدة، وأجهزة جديدة، وميزات يطلبها مستخدموك. لهذا يبقى معظم العملاء معنا باتفاقية دعم شهرية، ويبقى التطبيق وشيفرته وحسابات المتاجر باسمك طوال الوقت.',
        },
      },
    ],
    timing: {
      en: 'A first mobile app usually takes eight to fourteen weeks and typically costs between 3,000 and 7,000 JOD, depending on how many screens and user roles it needs and what it connects to. You get a fixed price after discovery, and thirty days of free fixes after launch.',
      ar: 'يستغرق أول تطبيق جوال عادةً من ثمانية إلى أربعة عشر أسبوعًا، وتتراوح تكلفته في الغالب بين 3,000 و 7,000 دينار، بحسب عدد الشاشات وأدوار المستخدمين والأنظمة التي يرتبط بها. تحصل على سعر ثابت بعد مرحلة الفهم، وعلى ثلاثين يومًا من الإصلاحات المجانية بعد الإطلاق.',
    },
  },

  // ─────────────────────────── ecommerce ─────────────────────────
  {
    slug: 'ecommerce',
    serviceId: 'ecommerce',
    related: ['oneclick-commerce', 'oneclick-delivery'],
    meta: {
      title: {
        en: 'E-commerce Website Development in Jordan | OneClick',
        ar: 'تصميم متاجر إلكترونية في الأردن | ون كليك',
      },
      description: {
        en: 'Online stores and multi-vendor marketplaces built in Jordan: local and card payments, cash on delivery, delivery and accounting connected.',
        ar: 'تصميم متاجر إلكترونية وأسواق متعددة البائعين في الأردن: دفع محلي وبالبطاقة، ودفع عند الاستلام، وتوصيل ومحاسبة مرتبطة.',
      },
    },
    h1: {
      en: 'E-commerce development in Jordan',
      ar: 'تصميم وبرمجة المتاجر الإلكترونية في الأردن',
    },
    intro: {
      en: 'OneClick builds online stores and multi-vendor marketplaces for businesses in Jordan — from a single shop selling its own products to a marketplace where hundreds of sellers run their own stores. Payments, delivery and accounting are connected from the start, in Arabic and English.',
      ar: 'تبني ون كليك المتاجر الإلكترونية والأسواق متعددة البائعين للشركات في الأردن، من متجر واحد يبيع منتجاته إلى سوق يدير فيه مئات البائعين متاجرهم. والدفع والتوصيل والمحاسبة مرتبطة ببعضها من البداية، بالعربية والإنجليزية.',
    },
    sections: [
      {
        heading: {
          en: 'A store your staff can actually run',
          ar: 'متجر يستطيع فريقك إدارته فعلًا',
        },
        body: {
          en: 'An online store is mostly back office: products, stock, offers, orders and returns. We build that side as carefully as the storefront, so your team runs everything from one place without spreadsheets on the side. Customers in Jordan expect a choice at checkout, so cards, local payment methods and cash on delivery all work, and refunds follow a clear path instead of a phone call. When an order comes in, delivery and invoicing pick it up automatically rather than having it copied by hand.',
          ar: 'المتجر الإلكتروني في معظمه عمل إداري: منتجات ومخزون وعروض وطلبات ومرتجعات. نبني هذا الجانب بنفس عناية واجهة المتجر، فيدير فريقك كل شيء من مكان واحد دون ملفات إكسل جانبية. ويتوقع العملاء في الأردن خيارات عند الدفع، لذلك يعمل الدفع بالبطاقة وطرق الدفع المحلية والدفع عند الاستلام، ويسير الاسترجاع في مسار واضح بدل مكالمة هاتفية. وحين يصل طلب، يلتقطه التوصيل والفوترة تلقائيًا بدل نقله يدويًا.',
        },
      },
      {
        heading: {
          en: 'Marketplaces with many vendors',
          ar: 'أسواق تضم بائعين كثيرين',
        },
        body: {
          en: 'A marketplace adds a second kind of customer: the sellers. Each vendor gets their own dashboard for products, stock and orders, while shoppers fill a single cart across all of them and the order is split per vendor at checkout. You set the commission rules, and payouts run on schedule with a full ledger behind them. We built exactly this for OneClick Commerce, and connected it to a delivery platform so every order can be handed to a driver.',
          ar: 'يضيف السوق الإلكتروني نوعًا ثانيًا من العملاء: البائعين. يحصل كل بائع على لوحة خاصة لمنتجاته ومخزونه وطلباته، بينما يملأ المتسوق سلة واحدة من جميع المتاجر، ويُقسَّم الطلب على البائعين عند الدفع. أنت تحدد قواعد العمولة، وتُصرف المستحقات في مواعيدها مع سجل مالي كامل خلفها. بنينا هذا تمامًا في ون كليك كوميرس، وربطناه بمنصة توصيل ليُسند كل طلب إلى سائق.',
        },
      },
    ],
    timing: {
      en: 'An online store usually takes eight to fourteen weeks and typically costs between 3,000 and 7,000 JOD; a multi-vendor marketplace sits at the top of that range or above it, depending on its rules and integrations. The price is fixed after discovery, and launch includes thirty days of free fixes.',
      ar: 'يستغرق المتجر الإلكتروني عادةً من ثمانية إلى أربعة عشر أسبوعًا، وتتراوح تكلفته في الغالب بين 3,000 و 7,000 دينار، أما السوق متعدد البائعين فيقع في أعلى هذا النطاق أو فوقه بحسب قواعده وعمليات الربط فيه. السعر ثابت بعد مرحلة الفهم، ويشمل الإطلاق ثلاثين يومًا من الإصلاحات المجانية.',
    },
  },

  // ──────────────────────────── systems ──────────────────────────
  {
    slug: 'business-systems',
    serviceId: 'systems',
    related: ['oneclick-delivery'],
    meta: {
      title: {
        en: 'Custom Business Systems, ERP and CRM in Jordan | OneClick',
        ar: 'برمجة أنظمة إدارة الأعمال في الأردن | ون كليك',
      },
      description: {
        en: 'Custom ERP, CRM and internal systems built in Jordan around how your business really works. First release in about six weeks; you own the code.',
        ar: 'برمجة أنظمة ERP و CRM وأنظمة داخلية مخصصة في الأردن حسب طريقة عمل شركتك. أول إصدار خلال ستة أسابيع تقريبًا، والشيفرة ملكك.',
      },
    },
    h1: {
      en: 'Custom business systems in Jordan',
      ar: 'أنظمة إدارة أعمال مخصصة في الأردن',
    },
    intro: {
      en: 'OneClick builds custom business systems for companies in Jordan: ERP and CRM tools, dashboards, and the internal software that replaces a folder of spreadsheets. Each one is modelled on how your business actually works, in Arabic and English, with the data and the code owned by you.',
      ar: 'تبني ون كليك أنظمة أعمال مخصصة للشركات في الأردن: أدوات ERP و CRM، ولوحات تحكم، والبرامج الداخلية التي تحل محل مجلد من ملفات الإكسل. نصمّم كل نظام على طريقة عمل شركتك الفعلية، بالعربية والإنجليزية، والبيانات والشيفرة ملك لك.',
    },
    sections: [
      {
        heading: {
          en: 'Your process, not a template',
          ar: 'إجراءات عملك، لا قالب جاهز',
        },
        body: {
          en: 'Off-the-shelf software asks you to change how you work to fit its screens. A custom system starts from the other end: we sit with the people who do the work, map what happens today and where it slows down, and build around that. Roles and permissions mean each person sees exactly what they should, from the warehouse to the finance team. Every change goes into a full audit trail — who changed what, and when — so questions get answered from the system, not from memory.',
          ar: 'البرامج الجاهزة تطلب منك تغيير طريقة عملك لتناسب شاشاتها. أما النظام المخصص فيبدأ من الطرف الآخر: نجلس مع من يقومون بالعمل فعلًا، ونرسم ما يحدث اليوم وأين يتعطّل، ونبني حول ذلك. والأدوار والصلاحيات تعني أن يرى كل شخص ما يخصّه بالضبط، من المستودع إلى الفريق المالي. ويُسجَّل كل تعديل في سجل تدقيق كامل: من غيّر ماذا، ومتى، فتأتي الإجابات من النظام لا من الذاكرة.',
        },
      },
      {
        heading: {
          en: 'Delivered in releases, not all at once',
          ar: 'يُسلَّم على إصدارات، لا دفعة واحدة',
        },
        body: {
          en: 'Big systems fail when everyone waits a year for one launch day. We split the work into releases, so the first useful piece — often the process that hurts most today — is in your team’s hands in about six weeks, and each release after that retires another spreadsheet. Reports and dashboards are built around the questions you already ask every week, and the system connects to the tools you keep: accounting, payment gateways, SMS and WhatsApp.',
          ar: 'تفشل الأنظمة الكبيرة حين ينتظر الجميع سنة كاملة ليوم إطلاق واحد. لذلك نقسّم العمل إلى إصدارات، فيصل أول جزء مفيد، وغالبًا ما يكون الإجراء الأكثر إزعاجًا اليوم، إلى يد فريقك خلال ستة أسابيع تقريبًا، ويحل كل إصدار بعده محل ملف إكسل آخر. نبني التقارير ولوحات التحكم حول الأسئلة التي تطرحها كل أسبوع أصلًا، ونربط النظام بالأدوات التي تبقى معك: المحاسبة وبوابات الدفع والرسائل النصية وواتساب.',
        },
      },
    ],
    timing: {
      en: 'Business systems start around 7,000 JOD and grow with the number of user roles and integrations. The first release usually lands in about six weeks. You get a fixed price after discovery, and thirty days of free fixes after launch.',
      ar: 'تبدأ أنظمة الأعمال من حوالي 7,000 دينار وترتفع بحسب عدد أدوار المستخدمين وعمليات الربط. ويصل الإصدار الأول عادةً خلال ستة أسابيع تقريبًا. تحصل على سعر ثابت بعد مرحلة الفهم، وعلى ثلاثين يومًا من الإصلاحات المجانية بعد الإطلاق.',
    },
  },
];

export const CASE_STUDIES: readonly CaseStudy[] = [
  // ─────────────────────────── commerce ──────────────────────────
  {
    slug: 'oneclick-commerce',
    projectId: 'commerce',
    services: ['ecommerce', 'mobile-apps', 'web-development'],
    meta: {
      title: {
        en: 'OneClick Commerce: Multi-Vendor Marketplace Case Study | OneClick',
        ar: 'ون كليك كوميرس: دراسة حالة سوق إلكتروني متعدد البائعين | ون كليك',
      },
      description: {
        en: 'How OneClick built a multi-vendor marketplace in Jordan: one cart across sellers, vendor dashboards, commissions and payouts, on web, iOS and Android.',
        ar: 'كيف بنت ون كليك سوقًا إلكترونيًا متعدد البائعين في الأردن: سلة واحدة لعدة بائعين، ولوحات للبائعين، وعمولات ومستحقات، على الويب و iOS و Android.',
      },
    },
    h1: {
      en: 'OneClick Commerce: a multi-vendor marketplace',
      ar: 'ون كليك كوميرس: سوق إلكتروني متعدد البائعين',
    },
    sections: [
      {
        heading: { en: 'Two kinds of customer', ar: 'نوعان من العملاء' },
        body: {
          en: 'A marketplace serves two groups at once. Sellers need to run their own store — products, stock, offers and orders — without waiting on anyone. Shoppers want to buy from several shops in one go, with one cart and one checkout. OneClick Commerce is built around both, with an admin in the middle who sets the rules and makes sure everyone is paid.',
          ar: 'يخدم السوق الإلكتروني فئتين في الوقت نفسه. البائعون يحتاجون إلى إدارة متاجرهم، من منتجات ومخزون وعروض وطلبات، دون انتظار أحد. والمتسوقون يريدون الشراء من عدة متاجر دفعة واحدة، بسلة واحدة وعملية دفع واحدة. بُني ون كليك كوميرس حول الطرفين، مع إدارة في المنتصف تضع القواعد وتضمن أن يحصل الجميع على مستحقاتهم.',
        },
      },
      {
        heading: { en: 'How it works', ar: 'كيف يعمل' },
        body: {
          en: 'Each vendor works from their own dashboard and updates products, stock, offers and order status themselves. Shoppers browse every store on the web or in the mobile app and keep a single cart; at checkout it is split into separate orders, one per vendor, so each seller only sees and fulfils their own. The admin sets commission rules, and payouts are calculated on schedule with a full ledger behind every amount. Orders can then go straight to OneClick Delivery to be dispatched.',
          ar: 'يعمل كل بائع من لوحته الخاصة، ويحدّث منتجاته ومخزونه وعروضه وحالة طلباته بنفسه. ويتصفح المتسوق جميع المتاجر من الموقع أو تطبيق الجوال ويحتفظ بسلة واحدة، وعند الدفع تُقسَّم السلة إلى طلبات منفصلة لكل بائع، فلا يرى كل بائع ولا ينفّذ إلا طلباته. وتحدد الإدارة قواعد العمولة، وتُحسب المستحقات في مواعيدها مع سجل مالي كامل خلف كل مبلغ. ثم يمكن إرسال الطلبات مباشرة إلى ون كليك دليفري لإسنادها إلى سائق.',
        },
      },
      {
        heading: { en: 'Arabic and English from day one', ar: 'العربية والإنجليزية من اليوم الأول' },
        body: {
          en: 'Shoppers and sellers in Jordan move between Arabic and English all the time, so the storefront was designed in both directions together rather than translated at the end. Product names, prices, carts and order statuses read correctly either way, on the web and in the app, and nobody has to settle for the language the software happened to be built in.',
          ar: 'ينتقل المتسوقون والبائعون في الأردن بين العربية والإنجليزية طوال الوقت، لذلك صُممت واجهة المتجر بالاتجاهين معًا بدل ترجمتها في آخر المشروع. أسماء المنتجات والأسعار والسلة وحالات الطلب تُقرأ بشكل صحيح في الحالتين، على الموقع وفي التطبيق، ولا يضطر أحد للتعامل مع اللغة التي صادف أن بُني بها البرنامج.',
        },
      },
      {
        heading: { en: 'How it is built', ar: 'كيف بُني' },
        body: {
          en: 'The backend runs on .NET 8, with an Angular web app for shoppers, vendors and the admin, and a React Native (Expo) app for iOS and Android. SignalR pushes order updates to open screens as they happen, RabbitMQ carries work between services so a slow step never holds up checkout, and Firebase delivers push notifications. The whole storefront works in Arabic and English from day one.',
          ar: 'يعمل الخادم على .NET 8، مع تطبيق ويب بـ Angular للمتسوقين والبائعين والإدارة، وتطبيق React Native (Expo) لنظامي iOS و Android. ينقل SignalR تحديثات الطلبات إلى الشاشات المفتوحة لحظة حدوثها، ويحمل RabbitMQ المهام بين الخدمات فلا تؤخر خطوة بطيئة عملية الدفع، ويرسل Firebase الإشعارات. وواجهة المتجر كلها تعمل بالعربية والإنجليزية من اليوم الأول.',
        },
      },
    ],
  },

  // ─────────────────────────── delivery ──────────────────────────
  {
    slug: 'oneclick-delivery',
    projectId: 'delivery',
    services: ['mobile-apps', 'business-systems', 'ecommerce'],
    meta: {
      title: {
        en: 'OneClick Delivery: Delivery Dispatch App Case Study | OneClick',
        ar: 'ون كليك دليفري: دراسة حالة منصة توصيل | ون كليك',
      },
      description: {
        en: 'How OneClick built a delivery dispatch platform in Jordan: a dispatcher board, a driver app with proof of delivery, live tracking and daily settlement.',
        ar: 'كيف بنت ون كليك منصة لإدارة التوصيل في الأردن: لوحة توزيع، وتطبيق للسائق مع إثبات التسليم، وتتبع مباشر، وتسوية يومية.',
      },
    },
    h1: {
      en: 'OneClick Delivery: a delivery dispatch platform',
      ar: 'ون كليك دليفري: منصة لإدارة التوصيل',
    },
    sections: [
      {
        heading: { en: 'Three people, one order', ar: 'ثلاثة أشخاص، طلب واحد' },
        body: {
          en: 'Every delivery involves three people who need different things. The dispatcher needs every order and every free driver on one board. The driver needs the job, the route and a way to prove the delivery happened. The customer needs to know where the order is without calling anyone. OneClick Delivery gives each of them their own screen, all fed by the same live data.',
          ar: 'كل عملية توصيل تجمع ثلاثة أشخاص يحتاج كل منهم شيئًا مختلفًا. المرسِل يحتاج إلى رؤية كل الطلبات وكل السائقين المتاحين على شاشة واحدة. والسائق يحتاج إلى المهمة والمسار ووسيلة يثبت بها أن التسليم تم. والعميل يريد أن يعرف أين طلبه دون أن يتصل بأحد. يمنح ون كليك دليفري كلًّا منهم شاشته الخاصة، وكلها تعمل من البيانات المباشرة نفسها.',
        },
      },
      {
        heading: { en: 'How it works', ar: 'كيف يعمل' },
        body: {
          en: 'Dispatchers assign orders by hand or let the board pick the nearest free driver. The driver gets the job on their phone with the route, records proof of delivery and any cash collected, and moves on to the next one. Customers follow the route live, with an arrival estimate that stays honest as the driver moves. At the end of the day the platform settles accounts per driver and per zone and exports them for accounting — and because it plugs into OneClick Commerce, marketplace orders arrive ready to dispatch.',
          ar: 'يوزّع المرسِل الطلبات يدويًا أو يترك اللوحة تختار أقرب سائق متاح. ويستلم السائق المهمة على هاتفه مع المسار، ويسجّل إثبات التسليم والمبالغ المحصّلة، ثم ينتقل إلى المهمة التالية. ويتابع العميل المسار مباشرة مع وقت وصول تقديري يبقى صادقًا مع تحرك السائق. وفي نهاية اليوم تُجري المنصة التسوية لكل سائق ولكل منطقة وتصدّرها للمحاسبة، ولأنها مرتبطة بون كليك كوميرس تصل طلبات السوق جاهزة للإسناد.',
        },
      },
      {
        heading: { en: 'Closing the day', ar: 'إغلاق اليوم' },
        body: {
          en: 'Cash on delivery means money passes through drivers’ hands every day. Because each driver records the cash collected against each delivery, the settlement per driver and per zone is ready when the shift ends, and the export goes straight to accounting instead of being rebuilt from paper slips and phone calls the next morning.',
          ar: 'الدفع عند الاستلام يعني أن المال يمر بأيدي السائقين كل يوم. ولأن كل سائق يسجّل المبلغ المحصّل مقابل كل عملية تسليم، تكون التسوية لكل سائق ولكل منطقة جاهزة عند نهاية الوردية، ويذهب الملف المُصدَّر مباشرة إلى المحاسبة بدل إعادة بنائه من الإيصالات الورقية والمكالمات صباح اليوم التالي.',
        },
      },
      {
        heading: { en: 'How it is built', ar: 'كيف بُني' },
        body: {
          en: 'The backend runs on .NET 8, with an Angular dispatcher board and a React Native (Expo) driver app for iOS and Android. SignalR streams driver positions and job updates to every open screen in real time, Redis keeps live locations and job state quick to read, and Firebase sends the push notification that tells a driver a new job is waiting.',
          ar: 'يعمل الخادم على .NET 8، مع لوحة توزيع بـ Angular وتطبيق للسائق بـ React Native (Expo) لنظامي iOS و Android. يبث SignalR مواقع السائقين وتحديثات المهام إلى كل شاشة مفتوحة لحظة بلحظة، ويحفظ Redis المواقع المباشرة وحالة المهام لتُقرأ بسرعة، ويرسل Firebase الإشعار الذي يخبر السائق بوجود مهمة جديدة.',
        },
      },
    ],
  },
];

export const servicePageFor = (serviceId: string): ServicePage | undefined =>
  SERVICE_PAGES.find((page) => page.serviceId === serviceId);

export const caseStudyFor = (projectId: string): CaseStudy | undefined =>
  CASE_STUDIES.find((study) => study.projectId === projectId);
