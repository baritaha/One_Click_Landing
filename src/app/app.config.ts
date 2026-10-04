import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // The router matches and prerenders the routes; it never navigates inside
    // the app. Every link is a real document link, so anchors are scrolled by
    // the browser, which honours `scroll-padding-top` and always finds its
    // target in fully rendered HTML.
    provideRouter(routes),
    // Incremental hydration: `@defer (hydrate on viewport)` blocks are still
    // rendered into the static HTML — search engines and no-JS visitors get the
    // full text — but their JavaScript only wakes up when you scroll to them.
    provideClientHydration(withIncrementalHydration()),
  ],
};
