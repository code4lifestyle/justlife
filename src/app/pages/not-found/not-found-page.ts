import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { NOT_FOUND_PATH } from '../../core/page.resolver';

/**
 * The site's own 404 page (Nuxt error page, scope fed701df), shown for every URL the app does not
 * have. "Return to home" leads to the home page of the country in the current URL.
 */
@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {
  private readonly location = inject(Location);

  /**
   * The wildcard route consumes the whole path, so its first segment is the locale (if any). When
   * a page's content is missing, the resolver shows this page under NOT_FOUND_PATH without changing
   * the address bar: the locale is then read from the address bar.
   */
  protected readonly home = toSignal(
    inject(ActivatedRoute).url.pipe(
      map((segments) => {
        const path = '/' + segments.map((s) => s.path).join('/');
        const url = path === NOT_FOUND_PATH ? this.location.path() : path;
        return /^\/en-SA(\/|$|\?|#)/.test(url) ? '/en-SA' : '/en-AE';
      }),
    ),
    { initialValue: '/en-AE' },
  );
}
