import { RenderMode, type ServerRoute } from '@angular/ssr';

import { PAGE_ROUTES } from './app.routes';

/**
 * Everything is prerendered — the build writes plain HTML files and there is
 * no server to run. `outputMode: "static"` in angular.json does the rest.
 *
 * The service and case-study pages are listed from the same data as their
 * routes, so a new entry in data/pages.ts is prerendered without touching this.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'ar', renderMode: RenderMode.Prerender },
  ...PAGE_ROUTES.map(({ path }) => ({ path: path!, renderMode: RenderMode.Prerender }) as ServerRoute),
  { path: '404', renderMode: RenderMode.Prerender },
  { path: 'ar/404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
