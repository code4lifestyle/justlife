import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  NavigationStart,
  Router,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { filter } from 'rxjs';

import { routes } from './app.routes';
import { retryFailedPagesOnRevisit } from './core/page.resolver';
import { StyleWorldService, styleWorldOf } from './core/style-world.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    // Fetch a page's stylesheet in parallel with its code and content: the first page's right away, and
    // on each navigation the target's (a no-op for worlds already loaded). Layouts stay hidden until it applies.
    provideAppInitializer(() => {
      const styles = inject(StyleWorldService);
      styles.preload(styleWorldOf(inject(DOCUMENT).location.pathname));
      inject(Router)
        .events.pipe(filter((e) => e instanceof NavigationStart))
        .subscribe((e) => styles.preload(styleWorldOf(e.url)));
    }),
    provideAppInitializer(retryFailedPagesOnRevisit),
  ],
};
