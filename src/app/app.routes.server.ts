import { RenderMode, type ServerRoute } from '@angular/ssr';

/**
 * Everything is prerendered — the build writes plain HTML files and there is
 * no server to run. `outputMode: "static"` in angular.json does the rest.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'ar', renderMode: RenderMode.Prerender },
  { path: '404', renderMode: RenderMode.Prerender },
  { path: 'ar/404', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
