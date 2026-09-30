import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { NavigationEnd, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, filter, of } from 'rxjs';
import { ContentService } from './content.service';

/** Internal (unregistered) URL that renders the 404 page; the address bar keeps the requested URL. */
export const NOT_FOUND_PATH = '/page-not-found';

/**
 * Resolves the JSON content of the page being navigated to. Routes register it under the
 * `content` key, so page components receive it as `readonly content = input.required<T>()`
 * (router component input binding). Missing content renders the 404 page at the requested URL.
 */
export const pageResolver: ResolveFn<unknown> = (_route, state) => {
  const router = inject(Router);
  return inject(ContentService)
    .page<unknown>(state.url)
    .pipe(
      catchError(() =>
        of(
          new RedirectCommand(router.parseUrl(NOT_FOUND_PATH), {
            browserUrl: state.url,
            // Back/Forward from one such 404 to another has the same router URL and address: still
            // navigate, so the layout picks up the new address (its locale).
            onSameUrlNavigation: 'reload',
          }),
        ),
      ),
    );
};

/**
 * With `browserUrl`, the router records its internal URL in the history entry (`ɵrouterUrl` in
 * history.state) and goes straight back to it on reload and Back/Forward, so a page whose content
 * failed once (e.g. while offline) would stay a 404 in that entry for good. After each 404 navigation
 * this drops that record: reloading or revisiting the entry requests the page's content again.
 * Runs from an app initializer.
 */
export function retryFailedPagesOnRevisit(): void {
  const router = inject(Router);
  const location = inject(Location);
  router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
    if (router.url !== NOT_FOUND_PATH) return;
    const state = location.getState();
    if (!state || typeof state !== 'object' || !('ɵrouterUrl' in state)) return;
    const { ɵrouterUrl: _internalUrl, ...rest } = state as Record<string, unknown>;
    location.replaceState(location.path(true), '', rest);
  });
}
