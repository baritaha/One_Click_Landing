import type { Localized } from '../core/site.config';

export type Platform = 'web' | 'ios' | 'android';
export type SceneKey = 'marketplace' | 'delivery' | 'dashboard';

export interface Project {
  id: string;
  name: Localized;
  summary: Localized;
  features: readonly Localized[];
  platforms: readonly Platform[];
  tech: readonly string[];
  /** Which built-in SVG mockup fills the device frame. */
  scene: SceneKey;
  /** Optional real screenshot. Falls back to the SVG mockup when absent. */
  image?: string;
  /**
   * A real recording of the mobile app, 9:20 portrait. When set, the showcase
   * puts it in a second phone in front of the drawn one. The poster shows
   * until the video loads, and instead of it for reduced motion.
   */
  phoneVideo?: { mp4: string; webm: string; poster: string };
  /**
   * Hidden in production builds. Nothing is flagged right now — add a
   * half-finished case study with this set and it stays out of the live site
   * until you drop the flag.
   */
  isPlaceholder?: boolean;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'commerce',
    scene: 'marketplace',
    name: { en: 'OneClick Commerce', ar: 'ون كليك كوميرس' },
    summary: {
      en: 'A multi-vendor marketplace where each seller runs their own store while customers shop across all of them in a single cart. Vendors manage products, stock and orders themselves; the admin sets commissions and pays everyone out on schedule.',
      ar: 'سوق إلكتروني متعدد البائعين، يدير فيه كل بائع متجره بنفسه بينما يتسوق العميل من جميع المتاجر بسلة واحدة. البائعون يديرون منتجاتهم ومخزونهم وطلباتهم، والإدارة تحدد العمولات وتصرف المستحقات في مواعيدها.',
    },
    features: [
      {
        en: 'A vendor dashboard for products, stock, offers and order status',
        ar: 'لوحة للبائع لإدارة المنتجات والمخزون والعروض وحالة الطلبات',
      },
      {
        en: 'One cart across vendors, split into separate orders at checkout',
        ar: 'سلة واحدة عبر عدة بائعين، تُقسم إلى طلبات منفصلة عند الدفع',
      },
      {
        en: 'Commission rules, vendor payouts and a full ledger for the admin',
        ar: 'قواعد عمولة ومستحقات للبائعين وسجل مالي كامل للإدارة',
      },
      {
        en: 'Arabic and English storefront, both ready from day one',
        ar: 'واجهة متجر بالعربية والإنجليزية، جاهزتان من اليوم الأول',
      },
    ],
    platforms: ['web', 'ios', 'android'],
    tech: ['.NET 8', 'Angular', 'React Native (Expo)', 'SignalR', 'RabbitMQ', 'Firebase'],
    phoneVideo: {
      webm: 'assets/videos/commerce-app.webm',
      mp4: 'assets/videos/commerce-app.mp4',
      poster: 'assets/images/commerce-app-poster.jpg',
    },
  },
  {
    id: 'delivery',
    scene: 'delivery',
    name: { en: 'OneClick Delivery', ar: 'ون كليك دليفري' },
    summary: {
      en: 'A dispatch platform that turns an order into a delivery. Dispatchers assign drivers from one board, drivers get the job on their phone, and the customer watches the route move in real time. It plugs straight into the marketplace above.',
      ar: 'منصة إرسال تحوّل الطلب إلى عملية توصيل. المرسِل يوزّع السائقين من شاشة واحدة، والسائق يستلم المهمة على هاتفه، والعميل يتابع المسار لحظة بلحظة. وهي مرتبطة مباشرة بالسوق الإلكتروني أعلاه.',
    },
    features: [
      {
        en: 'Assign by hand or let the board pick the nearest free driver',
        ar: 'توزيع يدوي، أو ترك اللوحة تختار أقرب سائق متاح',
      },
      {
        en: 'A driver app with the route, proof of delivery and cash collected',
        ar: 'تطبيق للسائق يعرض المسار وإثبات التسليم والمبالغ المحصّلة',
      },
      {
        en: 'Live tracking for the customer, with an honest arrival estimate',
        ar: 'تتبع مباشر للعميل، مع وقت وصول تقديري صادق',
      },
      {
        en: 'Daily settlement per driver and per zone, exported for accounting',
        ar: 'تسوية يومية لكل سائق ولكل منطقة، تُصدَّر للمحاسبة',
      },
    ],
    platforms: ['web', 'ios', 'android'],
    tech: ['.NET 8', 'Angular', 'React Native (Expo)', 'Redis', 'SignalR', 'Firebase'],
    // 432x888 — a little wider than the 9:20 screen, so cover trims the sides.
    phoneVideo: {
      webm: 'assets/videos/delivery-app.webm',
      mp4: 'assets/videos/delivery-app.mp4',
      poster: 'assets/images/delivery-app-poster.jpg',
    },
  },
];
