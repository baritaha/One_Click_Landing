import type { Localized } from '../core/site.config';
import type { SceneKey } from './projects';

export interface HeroScene {
  key: SceneKey;
  name: Localized;
}

/** The three products the hero button cycles through. */
export const HERO_SCENES: readonly HeroScene[] = [
  {
    key: 'marketplace',
    name: { en: 'Marketplace', ar: 'سوق إلكتروني' },
  },
  {
    key: 'delivery',
    name: { en: 'Delivery tracking', ar: 'تتبّع التوصيل' },
  },
  {
    key: 'dashboard',
    name: { en: 'Business dashboard', ar: 'لوحة تحكم للأعمال' },
  },
];
