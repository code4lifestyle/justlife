import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ContentService } from '../../core/content.service';
import { Locale, SiteShellFooter } from '../../core/models';
import { AppLink } from '../../shared/app-link.directive';

/**
 * `div.footer-wrapper` of the main site (Nuxt footer, scope 2c82c13e). The locale-wide lists come
 * from `content/site/footer.<locale>.json`; the per-page variations (service-area links, title of
 * the services list, desktop-only) from the page's shell settings.
 */
@Component({
  selector: 'app-footer',
  imports: [AppLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly contentService = inject(ContentService);

  readonly locale = input.required<Locale>();
  readonly settings = input.required<SiteShellFooter>();

  protected readonly data = toSignal(
    toObservable(this.locale).pipe(
      switchMap((locale) =>
        this.contentService.footer(locale).pipe(catchError(() => of(undefined))),
      ),
    ),
  );

  /** Page-specific links; the section (with its title) is omitted when none are left. */
  protected readonly serviceAreas = computed(() => this.settings().serviceAreas ?? []);
}
