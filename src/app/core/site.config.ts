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

  email: 'baritaha4@gmail.com',
  phone: '+962 79 584 1006',
  /** The same number, digits only — the format a wa.me link takes. */
  whatsappNumber: '962795841006',

  workingHours: {
    en: 'Sunday–Thursday, 9:00–17:00',
    // The time range is wrapped in a bidi isolate so Arabic does not reorder
    // it into 17:00-9:00.
    ar: 'الأحد–الخميس، ⁦9:00–17:00⁩',
  },

  teamSize: { min: 1, max: 10 },
  foundedYear: null, // TODO

  founder: { en: 'Abdel-Bari Altaha', ar: 'عبد الباري الطه' },
  /** Empty = the founder's name in the footer is plain text, not a link. */
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

  siteUrl: 'https://example.com', // TODO — used for canonical, hreflang, sitemap and OG

  /**
   * Showreel sources, served from our own origin — nothing is hotlinked.
   * The poster is a frame from the reel itself, so the still and the first
   * frame are the same picture.
   *
   * Setting either path back to an empty string is a supported state: nothing
   * is requested, the poster still shows, and the dialog explains that the
   * video is not ready. See ASSETS.md for how the reel was built.
   */
  showreel: {
    poster: 'assets/images/showreel-poster.webp',
    // The loop behind the play button is deliberately a separate, much smaller
    // file: it autoplays for everyone who scrolls past, so it has to be cheap.
    preview: {
      mp4: 'assets/videos/showreel-preview.mp4',
      webm: 'assets/videos/showreel-preview.webm',
    },
    // The full reel, only fetched when someone presses play.
    full: {
      mp4: 'assets/videos/showreel.mp4',
      webm: 'assets/videos/showreel.webm',
    },
  },
};

