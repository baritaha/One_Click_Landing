import type { Routes } from '@angular/router';

import { HomePage } from './pages/home.page';
import { NotFoundPage } from './pages/not-found.page';

/**
 * `/` is English, `/ar` is Arabic. The language lives on the route, so both
 * versions prerender to their own static HTML with the right `lang` and `dir`
 * already in the markup.
 *
 * `/404` exists so a static host can point its error page at real, designed
 * HTML; `**` covers anything else reached by client-side navigation.
 */
export const routes: Routes = [
  { path: '', component: HomePage, data: { lang: 'en' } },
  { path: 'ar', component: HomePage, data: { lang: 'ar' } },
  { path: '404', component: NotFoundPage, data: { lang: 'en' } },
  { path: 'ar/404', component: NotFoundPage, data: { lang: 'ar' } },
  { path: '**', component: NotFoundPage, data: { lang: 'en' } },
];
