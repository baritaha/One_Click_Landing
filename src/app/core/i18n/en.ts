/**
 * English dictionary — the source of truth for the key set.
 * `ar.ts` is typed against `Dictionary`, so a missing or misspelled key
 * there is a compile error rather than a blank space on the page.
 */
export const en = {
  // ---- document / meta -------------------------------------------------
  'meta.title': 'OneClick — Software that works from the first click',
  'meta.description':
    'OneClick is a software company in Jordan. We design and build websites, mobile apps and business systems, and we stay with you after launch.',
  'meta.notFound.title': 'Page not found — OneClick',
  'meta.notFound.description':
    'The page you are looking for does not exist on the OneClick website.',

  // ---- shared chrome ---------------------------------------------------
  'common.skip': 'Skip to content',
  'common.homeLink': 'OneClick — home',
  'common.langToggle': 'عربي',
  'common.langToggleAria': 'عربي — switch the site to Arabic',
  'common.menuOpen': 'Open menu',
  'common.menuClose': 'Close menu',
  'common.close': 'Close',
  'common.previous': 'Previous',
  'common.next': 'Next',
  'common.email': 'Email',
  'common.phone': 'Phone',
  'common.whatsapp': 'WhatsApp',
  'common.location': 'Location',
  'common.hours': 'Working hours',

  'nav.services': 'Services',
  'nav.work': 'Work',
  'nav.process': 'Process',
  'nav.about': 'About',
  'nav.faq': 'FAQ',
  'nav.contact': 'Contact',

  // ---- hero ------------------------------------------------------------
  'hero.headline': 'Software that works from the first click.',
  'hero.sub':
    'OneClick is a software company in Jordan. We design and build websites, mobile apps and business systems, and we stay with you after launch.',
  'hero.ctaPrimary': 'Start a project',
  'hero.ctaSecondary': 'See our work',
  'hero.buttonFirst': 'Click',
  'hero.buttonAgain': 'Build another',
  'hero.buttonAria': 'builds a product on the screen',
  'hero.disciplines': 'Web · Mobile · Systems',
  'hero.stageLabel': 'An illustration of a product being assembled on a screen and a phone',
  'hero.sceneAnnounce': 'Now showing: {scene}',

  // ---- tech strip ------------------------------------------------------
  'tech.heading': 'Built with',

  // ---- services --------------------------------------------------------
  'services.heading': 'What we build',
  'services.intro':
    'Six things we do well. Open any one of them to see what you actually get and what we build it with.',
  'services.whatYouGet': 'What you get',
  'services.tech': 'We build it with',

  // ---- work ------------------------------------------------------------
  'work.heading': 'Products we have shipped',
  'work.intro':
    'Products we designed, built and still run today. Both handle real orders and real money every day.',
  'work.features': 'Key features',
  'work.platforms': 'Platforms',
  'work.tech': 'Built with',
  'work.appRecording': 'The {name} mobile app',
  'work.platform.web': 'Web',
  'work.platform.ios': 'iOS',
  'work.platform.android': 'Android',

  // ---- process ---------------------------------------------------------
  'process.heading': 'How a project moves',
  'process.intro':
    'The same four steps every time, so you always know where your project is and what happens next.',
  'process.stepLabel': 'Step {number} of {total}',

  // ---- showreel --------------------------------------------------------
  'showreel.heading': 'See it in motion',
  'showreel.intro': 'A short look at the products and interfaces we have built.',
  'showreel.play': 'Play the showreel',
  'showreel.dialogTitle': 'OneClick showreel',
  'showreel.unavailable':
    'The showreel video is not available yet. Ask us for a walkthrough and we will show you the real products instead.',

  // ---- about -----------------------------------------------------------
  'about.heading': 'A small team you talk to directly',
  'about.body1':
    'We are a team of one to ten people based in Jordan. When you work with us you talk to the people who design and build your product, not to an account manager who passes messages along. OneClick was founded by software engineer Abdel-Bari Altaha and his team.',
  'about.body2':
    'We work in Arabic and English, with clients in Jordan and across the Gulf, and we build products that read correctly in both directions from the first day.',
  'about.fact.team': 'Small, senior team',
  'about.fact.country': 'Based in Jordan',
  'about.fact.languages': 'Arabic and English',
  'about.values.heading': 'How we work',
  'about.value.communication.title': 'Clear communication',
  'about.value.communication.body':
    'One point of contact, weekly updates you can read in two minutes, and a plain answer when something turns out to be harder than expected.',
  'about.value.quality.title': 'Quality you can see',
  'about.value.quality.body':
    'You click through the real product every week. Progress is something you use, not a percentage in a report.',
  'about.value.support.title': 'Long-term support',
  'about.value.support.body':
    'Launch is the middle of the project, not the end. We keep your product running, fix what breaks and add what you need next.',

  // ---- testimonials ----------------------------------------------------
  'testimonials.heading': 'What clients say',
  'testimonials.goTo': 'Show testimonial {number}',

  // ---- faq -------------------------------------------------------------
  'faq.heading': 'Questions we hear often',
  'faq.intro': 'If your question is not here, ask us directly. We reply within one working day.',

  // ---- contact ---------------------------------------------------------
  'contact.heading': 'Tell us what you want to build',
  'contact.intro':
    'Fill this in and send it through WhatsApp or email. We read every message ourselves and reply within one working day.',
  'contact.direct.heading': 'Or reach us directly',
  'contact.form.name': 'Name',
  'contact.form.namePlaceholder': 'Your full name',
  'contact.form.phone': 'Phone or WhatsApp',
  'contact.form.phonePlaceholder': '07X XXX XXXX',
  'contact.form.email': 'Email',
  'contact.form.optional': 'optional',
  'contact.form.emailPlaceholder': 'you@company.com',
  'contact.form.company': 'Company',
  'contact.form.companyPlaceholder': 'Company or project name',
  'contact.form.projectType': 'Project type',
  'contact.form.budget': 'Budget',
  'contact.form.message': 'What do you want to build?',
  'contact.form.messagePlaceholder':
    'Tell us about the product, who it is for, and any deadline you have in mind.',
  'contact.form.choose': 'Choose one',
  'contact.type.website': 'Website',
  'contact.type.mobile': 'Mobile app',
  'contact.type.ecommerce': 'E-commerce',
  'contact.type.system': 'Business system',
  'contact.type.other': 'Other',
  'contact.budget.under1000': 'Under 1,000 JOD',
  'contact.budget.1000to3000': '1,000–3,000 JOD',
  'contact.budget.3000to7000': '3,000–7,000 JOD',
  'contact.budget.over7000': '7,000+ JOD',
  'contact.budget.unsure': 'Not sure yet',
  'contact.error.name': 'Enter your name so we know who we are talking to.',
  'contact.error.phone': 'Enter a phone number with at least 9 digits.',
  'contact.error.email': 'Enter a valid email address, or leave this empty.',
  'contact.error.projectType': 'Choose the type of project.',
  'contact.error.budget': 'Choose a budget range, or pick Not sure yet.',
  'contact.error.message': 'Write at least 20 characters so we can give you a useful answer.',
  'contact.error.summary': 'Check the highlighted fields and try again.',
  'contact.sendWhatsapp': 'Send via WhatsApp',
  'contact.sendEmail': 'Send by email',
  'contact.sent.whatsapp': 'Your message is ready in WhatsApp. Press send there to reach us.',
  'contact.sent.email': 'Your message is ready in your email app. Press send there to reach us.',
  'contact.sent.posted':
    'Thank you. Your message reached us and we will reply within one working day.',
  'contact.sent.failed':
    'We could not send that. Please use the WhatsApp button, or email us directly.',
  'contact.sending': 'Sending…',
  'contact.mail.subject': 'New project enquiry from {name}',
  'contact.mail.label.name': 'Name',
  'contact.mail.label.phone': 'Phone / WhatsApp',
  'contact.mail.label.email': 'Email',
  'contact.mail.label.company': 'Company',
  'contact.mail.label.type': 'Project type',
  'contact.mail.label.budget': 'Budget',
  'contact.mail.label.message': 'Message',
  'contact.mail.intro': 'New project enquiry from the OneClick website',

  // ---- footer ----------------------------------------------------------
  'footer.tagline':
    'A software company in Jordan building websites, mobile apps and business systems.',
  'footer.sections': 'Sections',
  'footer.contact': 'Contact',
  'footer.follow': 'Follow',
  'footer.madeIn': 'Made in Jordan',
  'footer.rights': '© {year} OneClick',
  // Split around the founder's name so the name alone can become a link.
  'footer.foundedBy': 'Founded by',
  'footer.foundedTeam': 'and his team',

  // ---- 404 -------------------------------------------------------------
  'notFound.code': '404',
  'notFound.headline': 'This page does not exist',
  'notFound.body':
    'You clicked, and nothing was there. Everything else still works, so start again from the home page.',
  'notFound.cta': 'Back to home',
} satisfies Record<string, string>;

export type DictKey = keyof typeof en;
export type Dictionary = Record<DictKey, string>;
