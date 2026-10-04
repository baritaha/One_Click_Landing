export type Locale = 'en' | 'ar';

/** Bilingual content shape used by every data file. */
export interface Localized {
  en: string;
  ar: string;
}

/**
 * Every real-world detail about OneClick lives here.
 * Values marked TODO are placeholders — replace them before launch.
 * Nothing else in the app hard-codes a phone number, address or URL.
 */
export const SITE: {
  name: Localized;
  country: Localized;
  countryCode: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  workingHours: Localized;
  teamSize: { min: number; max: number };
  foundedYear: number | null;
  founder: Localized;
  founderLinkedIn: string;
  social: Record<'linkedin' | 'instagram' | 'facebook' | 'github' | 'x', string>;
  contactEndpoint: string;
  siteUrl: string;
  showreel: {
    poster: string;
    preview: { mp4: string; webm: string };
    full: { mp4: string; webm: string };
  };
} = {
  name: { en: 'OneClick', ar: 'ون كليك' },
  country: { en: 'Jordan', ar: 'الأردن' },
  countryCode: 'JO',

  email: 'hello@oneclickjordan.com',
  phone: '+962 77 982 3860',
  /** The same number, digits only — the format a wa.me link takes. */
  whatsappNumber: '962779823860',

  workingHours: {
    en: 'Open 24 hours, 7 days a week',
    ar: 'على مدار الساعة، طوال أيام الأسبوع',
  },

  teamSize: { min: 1, max: 10 },
  foundedYear: null, // TODO

  founder: { en: 'Abdel-Bari Altaha', ar: 'عبد الباري الطه' },
  /**
   * The founder appears only in the JSON-LD, never on the page. When set, the
   * profile is added to the founder's `sameAs` there.
   */
  founderLinkedIn: '',

  social: {
    linkedin: '',
    instagram: '',
    facebook: '',
    github: '',
    x: '',
  },

  /** Optional POST endpoint for the contact form. Empty = WhatsApp/email only. */
  contactEndpoint: '',

  siteUrl: 'https://oneclickjordan.com', // used for canonical, hreflang, sitemap and OG

  /**
   * Showreel sources, served from our own origin — nothing is hotlinked.
   *
   * Empty for now: the stock reel was removed, and the section is switched off
   * in pages/home.page.ts until there is real product footage. Empty paths are
   * a supported state — nothing is requested and the dialog explains that the
   * video is not ready. `npm run showreel:build` writes the files below; see
   * ASSETS.md.
   */
  showreel: {
    // 'assets/images/showreel-poster.webp' — a frame from the reel itself.
    poster: '',
    // The loop behind the play button is deliberately a separate, much smaller
    // file: it autoplays for everyone who scrolls past, so it has to be cheap.
    // 'assets/videos/showreel-preview.{mp4,webm}'
    preview: { mp4: '', webm: '' },
    // The full reel, only fetched when someone presses play.
    // 'assets/videos/showreel.{mp4,webm}'
    full: { mp4: '', webm: '' },
  },
};

