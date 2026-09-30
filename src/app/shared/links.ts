import { Router } from '@angular/router';

/** App routes are root-relative ("/en-AE/…"); everything else (https:, mailto:, tel:) is external. */
export function isInternalUrl(url: string | null | undefined): url is string {
  return !!url && url.startsWith('/') && !url.startsWith('//');
}

/**
 * Router-navigates to `url` for an unmodified primary click, leaving ctrl/cmd/shift/middle clicks
 * to the browser (open in new tab etc.), exactly like `routerLink`.
 */
export function navigateOnPlainClick(event: MouseEvent, router: Router, url: string): void {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  void router.navigateByUrl(url);
}
