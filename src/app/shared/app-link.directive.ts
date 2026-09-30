import { Directive, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { isInternalUrl, navigateOnPlainClick } from './links';

/**
 * Link for URLs that come from content data: app routes ("/en-AE/faq?x=1") navigate with the
 * router (like `routerLink`, but accepting a full URL string incl. query/fragment), anything else
 * is a normal external link.
 *
 *   <a [appLink]="link.href" [newTab]="link.newTab">…</a>
 */
@Directive({
  selector: 'a[appLink]',
  host: {
    '[attr.href]': 'appLink()',
    '[attr.target]': 'newTab() ? "_blank" : null',
    '[attr.rel]': 'newTab() && !internal() ? "noopener noreferrer" : null',
    '(click)': 'onClick($event)',
  },
})
export class AppLink {
  private readonly router = inject(Router);

  readonly appLink = input.required<string>();
  readonly newTab = input(false, { transform: (v: boolean | undefined | null) => !!v });

  protected readonly internal = computed(() => isInternalUrl(this.appLink()));

  protected onClick(event: MouseEvent): void {
    if (this.internal() && !this.newTab()) {
      navigateOnPlainClick(event, this.router, this.appLink());
    }
  }
}
