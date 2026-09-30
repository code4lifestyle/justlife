import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppLink } from '../../shared/app-link.directive';
import { CheckoutPageContent } from './checkout-page.model';

/** App download badges, as used in the site footer and the "Download our Super app!" sections. */
const APP_STORES = [
  {
    href: 'https://cutt.ly/JMApp-Website',
    img: 'https://deax38zvkau9d.cloudfront.net/prod/assets/static/home/appstore.png?f=webp',
    alt: 'Download iOS App',
  },
  {
    href: 'https://cutt.ly/JMApp-Website',
    img: 'https://deax38zvkau9d.cloudfront.net/prod/assets/static/home/playstore.png?f=webp',
    alt: 'Download Android App',
  },
] as const;

/**
 * Booking funnel page (`/<locale>/<service>/checkout/<step>`).
 *
 * The original funnel was a client-side app driven by Justlife's live booking API; the mirror only
 * captured its loading skeleton. This page keeps the funnel frame (fixed service header, main card,
 * sidebar, sticky card footer) and tells the visitor that booking continues in the Justlife app,
 * with links back to the service pages that lead into this funnel.
 */
@Component({
  selector: 'app-checkout-page',
  imports: [AppLink, RouterLink],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage {
  readonly content = input.required<CheckoutPageContent>();

  protected readonly checkout = computed(() => this.content().checkout);
  protected readonly locale = computed(() => this.content().shell.locale);
  protected readonly appStores = APP_STORES;
  protected readonly arrowIcon =
    'https://deax38zvkau9d.cloudfront.net/prod/assets/static/right-arrow.svg';
}
