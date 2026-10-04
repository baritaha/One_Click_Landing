import type { Routes } from '@angular/router';

import { CASE_STUDIES, SERVICE_PAGES } from './data/pages';
import { HomePage } from './pages/home.page';
import { NotFoundPage } from './pages/not-found.page';

/**
 * `/` is English, `/ar` is Arabic. The language lives on the route, so both
 * versions prerender to their own static HTML with the right `lang` and `dir`
 * already in the markup.
 *
 * The service and case-study pages come from data/pages.ts — one English and
 * one Arabic route per entry. They load lazily, so the home page bundle does
 * not carry them.
 *
 * `/404` exists so a static host can point its error page at real, designed
 * HTML; `**` covers anything else reached by client-side navigation.
 */
const loadServicePage = () => import('./pages/service.page').then((m) => m.ServicePage);
const loadCaseStudyPage = () => import('./pages/case-study.page').then((m) => m.CaseStudyPage);

/** Every standalone page's path (without the leading slash) — shared with the prerender config. */
export const PAGE_ROUTES: Routes = [
  ...SERVICE_PAGES.flatMap(({ slug }) => [
    { path: `services/${slug}`, loadComponent: loadServicePage, data: { lang: 'en', slug } },
    { path: `ar/services/${slug}`, loadComponent: loadServicePage, data: { lang: 'ar', slug } },
  ]),
  ...CASE_STUDIES.flatMap(({ slug }) => [
    { path: `work/${slug}`, loadComponent: loadCaseStudyPage, data: { lang: 'en', slug } },
    { path: `ar/work/${slug}`, loadComponent: loadCaseStudyPage, data: { lang: 'ar', slug } },
  ]),
];

export const routes: Routes = [
  { path: '', component: HomePage, data: { lang: 'en' } },
  { path: 'ar', component: HomePage, data: { lang: 'ar' } },
  ...PAGE_ROUTES,
  { path: '404', component: NotFoundPage, data: { lang: 'en' } },
  { path: 'ar/404', component: NotFoundPage, data: { lang: 'ar' } },
  { path: '**', component: NotFoundPage, data: { lang: 'en' } },
];
