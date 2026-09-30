import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';
import { isInternalUrl, navigateOnPlainClick } from './links';

/**
 * Makes links inside HTML content rendered with `[innerHTML]` (service descriptions, blog
 * articles, FAQ answers…) navigate through the Angular router instead of reloading the page.
 *
 *   <div class="service-content" appContentLinks [innerHTML]="page().content | safeHtml"></div>
 */
@Directive({
  selector: '[appContentLinks]',
  host: { '(click)': 'onClick($event)' },
})
export class ContentLinks {
  private readonly router = inject(Router);

  protected onClick(event: MouseEvent): void {
    const anchor = (event.target as Element | null)?.closest('a');
    const href = anchor?.getAttribute('href');
    if (!anchor || anchor.target === '_blank' || !isInternalUrl(href)) {
      return;
    }
    navigateOnPlainClick(event, this.router, href);
  }
}
