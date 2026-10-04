import type { Dictionary } from './en';

/**
 * Arabic dictionary — Modern Standard Arabic, written to sound natural
 * rather than translated word for word. Western digits (0–9) throughout.
 * Typed as `Dictionary`, so any missing key breaks the build.
 */
export const ar: Dictionary = {
  // ---- document / meta -------------------------------------------------
  'meta.title': 'ون كليك — برمجيات تعمل من أول نقرة',
  'meta.description':
    'ون كليك شركة برمجيات في الأردن. نصمّم ونبني المواقع وتطبيقات الجوال والأنظمة للشركات، ونبقى معك بعد الإطلاق.',
  'meta.notFound.title': 'الصفحة غير موجودة — ون كليك',
  'meta.notFound.description': 'الصفحة التي تبحث عنها غير موجودة في موقع ون كليك.',

  // ---- shared chrome ---------------------------------------------------
  'common.skip': 'انتقل إلى المحتوى',
  'common.homeLink': 'OneClick — الصفحة الرئيسية',
  'common.langToggle': 'English',
  'common.langToggleAria': 'English — تحويل الموقع إلى الإنجليزية',
  'common.menuOpen': 'فتح القائمة',
  'common.menuClose': 'إغلاق القائمة',
  'common.close': 'إغلاق',
  'common.previous': 'السابق',
  'common.next': 'التالي',
  'common.email': 'البريد الإلكتروني',
  'common.phone': 'الهاتف',
  'common.whatsapp': 'واتساب',
  'common.whatsappChat': 'تواصل عبر واتساب',
  'common.location': 'الموقع',
  'common.hours': 'ساعات العمل',

  'nav.services': 'خدماتنا',
  'nav.work': 'أعمالنا',
  'nav.process': 'كيف نعمل',
  'nav.about': 'عن الشركة',
  'nav.faq': 'الأسئلة',
  'nav.contact': 'تواصل معنا',

  // ---- hero ------------------------------------------------------------
  'hero.headline': 'برمجيات تعمل من أول نقرة.',
  'hero.sub':
    'ون كليك شركة برمجيات في الأردن. نصمّم ونبني المواقع وتطبيقات الجوال والأنظمة للشركات، ونبقى معك بعد الإطلاق.',
  'hero.ctaPrimary': 'ابدأ مشروعك',
  'hero.ctaSecondary': 'شاهد أعمالنا',
  'hero.buttonFirst': 'انقر',
  'hero.buttonAgain': 'ابنِ غيره',
  'hero.buttonAria': 'يبني منتجًا على الشاشة',
  'hero.disciplines': 'ويب · تطبيقات · أنظمة',
  'hero.stageLabel': 'رسم توضيحي لمنتج يُبنى على شاشة وهاتف',
  'hero.sceneAnnounce': 'المعروض الآن: {scene}',

  // ---- tech strip ------------------------------------------------------
  'tech.heading': 'نبني بـ',

  // ---- services --------------------------------------------------------
  'services.heading': 'ماذا نبني',
  'services.intro': 'ستة أشياء نتقنها. افتح أيًّا منها لترى ما تحصل عليه فعليًا وبأي تقنيات نبنيه.',
  'services.whatYouGet': 'ما الذي تحصل عليه',
  'services.tech': 'نبنيه بـ',

  // ---- work ------------------------------------------------------------
  'work.heading': 'منتجات أطلقناها',
  'work.intro':
    'منتجات صمّمناها وبنيناها وما زلنا ندير تشغيلها اليوم. كلاهما يتعامل مع طلبات حقيقية وأموال حقيقية كل يوم.',
  'work.features': 'أبرز المزايا',
  'work.platforms': 'المنصات',
  'work.tech': 'مبني بـ',
  'work.appRecording': 'تطبيق {name} على الجوال',
  'work.platform.web': 'ويب',
  'work.platform.ios': 'آيفون',
  'work.platform.android': 'أندرويد',

  // ---- process ---------------------------------------------------------
  'process.heading': 'كيف يسير المشروع',
  'process.intro':
    'أربع خطوات ثابتة في كل مشروع، لتعرف دائمًا أين وصل مشروعك وما الذي سيحدث بعد ذلك.',
  'process.stepLabel': 'الخطوة {number} من {total}',

  // ---- showreel --------------------------------------------------------
  'showreel.heading': 'شاهد أعمالنا بالحركة',
  'showreel.intro': 'جولة قصيرة داخل المنتجات والواجهات التي بنيناها.',
  'showreel.play': 'تشغيل الفيديو',
  'showreel.dialogTitle': 'فيديو أعمال ون كليك',
  'showreel.unavailable':
    'الفيديو غير متاح بعد. اطلب منا جولة مباشرة وسنعرض عليك المنتجات الحقيقية بدلًا منه.',

  // ---- about -----------------------------------------------------------
  'about.heading': 'فريق صغير تتواصل معه مباشرة',
  'about.body1':
    'نحن فريق من 1 إلى 10 أشخاص مقره الأردن. حين تعمل معنا فأنت تتحدث مع من يصمّم ويبني منتجك، لا مع موظف حسابات ينقل الرسائل.',
  'about.body2':
    'نعمل بالعربية والإنجليزية مع عملاء في الأردن ودول الخليج، ونبني منتجات تُقرأ بشكل صحيح في الاتجاهين من اليوم الأول.',
  'about.fact.team': 'فريق صغير وخبير',
  'about.fact.country': 'مقرنا الأردن',
  'about.fact.languages': 'عربي وإنجليزي',
  'about.values.heading': 'كيف نعمل',
  'about.value.communication.title': 'تواصل واضح',
  'about.value.communication.body':
    'شخص واحد للتواصل، تحديث أسبوعي تقرأه في دقيقتين، وجواب صريح حين يكون الأمر أصعب مما توقعنا.',
  'about.value.quality.title': 'جودة تراها بنفسك',
  'about.value.quality.body':
    'تجرّب المنتج الحقيقي كل أسبوع. التقدّم شيء تستخدمه بيدك، لا نسبة مئوية في تقرير.',
  'about.value.support.title': 'دعم طويل المدى',
  'about.value.support.body':
    'الإطلاق منتصف المشروع وليس نهايته. نبقي منتجك يعمل، ونصلح ما يتعطل، ونضيف ما تحتاجه لاحقًا.',

  // ---- testimonials ----------------------------------------------------
  'testimonials.heading': 'ماذا يقول عملاؤنا',
  'testimonials.goTo': 'عرض الرأي رقم {number}',

  // ---- faq -------------------------------------------------------------
  'faq.heading': 'أسئلة نسمعها كثيرًا',
  'faq.intro': 'إن لم يكن سؤالك هنا فاسألنا مباشرة، ونرد خلال يوم عمل واحد.',

  // ---- contact ---------------------------------------------------------
  'contact.heading': 'أخبرنا ماذا تريد أن تبني',
  'contact.intro':
    'املأ هذه الحقول وأرسلها عبر واتساب أو البريد. نقرأ كل رسالة بأنفسنا ونرد خلال يوم عمل واحد.',
  'contact.direct.heading': 'أو تواصل معنا مباشرة',
  'contact.qr.caption': 'امسح الرمز للتواصل عبر واتساب',
  'contact.qr.alt': 'رمز QR لواتساب ون كليك',
  'contact.form.name': 'الاسم',
  'contact.form.namePlaceholder': 'اسمك الكامل',
  'contact.form.phone': 'الهاتف أو واتساب',
  'contact.form.phonePlaceholder': '07X XXX XXXX',
  'contact.form.email': 'البريد الإلكتروني',
  'contact.form.optional': 'اختياري',
  'contact.form.emailPlaceholder': 'you@company.com',
  'contact.form.company': 'الشركة',
  'contact.form.companyPlaceholder': 'اسم الشركة أو المشروع',
  'contact.form.projectType': 'نوع المشروع',
  'contact.form.budget': 'الميزانية',
  'contact.form.message': 'ماذا تريد أن تبني؟',
  'contact.form.messagePlaceholder': 'حدّثنا عن المنتج ولمن هو، وأي موعد نهائي تفكر فيه.',
  'contact.form.choose': 'اختر واحدًا',
  'contact.type.website': 'موقع إلكتروني',
  'contact.type.mobile': 'تطبيق جوال',
  'contact.type.ecommerce': 'متجر إلكتروني',
  'contact.type.system': 'نظام لإدارة الأعمال',
  'contact.type.other': 'شيء آخر',
  'contact.budget.under1000': 'أقل من 1,000 دينار',
  'contact.budget.1000to3000': '1,000–3,000 دينار',
  'contact.budget.3000to7000': '3,000–7,000 دينار',
  'contact.budget.over7000': '7,000 دينار فأكثر',
  'contact.budget.unsure': 'لم أحدد بعد',
  'contact.error.name': 'اكتب اسمك لنعرف مع من نتحدث.',
  'contact.error.phone': 'اكتب رقم هاتف لا يقل عن 9 أرقام.',
  'contact.error.email': 'اكتب بريدًا إلكترونيًا صحيحًا، أو اترك الحقل فارغًا.',
  'contact.error.projectType': 'اختر نوع المشروع.',
  'contact.error.budget': 'اختر نطاق الميزانية، أو اختر لم أحدد بعد.',
  'contact.error.message': 'اكتب 20 حرفًا على الأقل لنتمكن من إعطائك جوابًا مفيدًا.',
  'contact.error.summary': 'راجع الحقول المحددة ثم أعد المحاولة.',
  'contact.sendWhatsapp': 'أرسل عبر واتساب',
  'contact.sendEmail': 'أرسل بالبريد',
  'contact.sent.whatsapp': 'رسالتك جاهزة في واتساب. اضغط إرسال هناك لتصلنا.',
  'contact.sent.email': 'رسالتك جاهزة في تطبيق البريد. اضغط إرسال هناك لتصلنا.',
  'contact.sent.posted': 'شكرًا لك. وصلتنا رسالتك وسنرد خلال يوم عمل واحد.',
  'contact.sent.failed': 'تعذّر الإرسال. استخدم زر واتساب، أو راسلنا على البريد مباشرة.',
  'contact.sending': 'جارٍ الإرسال…',
  'contact.mail.subject': 'طلب مشروع جديد من {name}',
  'contact.mail.label.name': 'الاسم',
  'contact.mail.label.phone': 'الهاتف / واتساب',
  'contact.mail.label.email': 'البريد الإلكتروني',
  'contact.mail.label.company': 'الشركة',
  'contact.mail.label.type': 'نوع المشروع',
  'contact.mail.label.budget': 'الميزانية',
  'contact.mail.label.message': 'الرسالة',
  'contact.mail.intro': 'طلب مشروع جديد من موقع ون كليك',

  // ---- footer ----------------------------------------------------------
  'footer.tagline': 'شركة برمجيات في الأردن تبني المواقع وتطبيقات الجوال وأنظمة الشركات.',
  'footer.sections': 'أقسام الموقع',
  'footer.contact': 'تواصل',
  'footer.follow': 'تابعنا',
  'footer.madeIn': 'صُنع في الأردن',
  'footer.rights': '© {year} ون كليك',
  'footer.builtBy': 'بُني بأيدي فريق ون كليك',

  // ---- 404 -------------------------------------------------------------
  'notFound.code': '404',
  'notFound.headline': 'هذه الصفحة غير موجودة',
  'notFound.body': 'نقرت ولم يكن هناك شيء. بقية الموقع تعمل، فابدأ من الصفحة الرئيسية.',
  'notFound.cta': 'العودة للرئيسية',
};
