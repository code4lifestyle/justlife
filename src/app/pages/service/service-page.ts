import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ContentService } from '../../core/content.service';
import { AppLink } from '../../shared/app-link.directive';
import { ContentLinks } from '../../shared/content-links.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { OtherService, ServicePageContent } from './service-page.model';

/** Cards of the "What other services can we help you with?" section (shared by all service pages). */
const OTHER_SERVICES_URL = 'content/service/other-services.json';
const CDN_STATIC = 'https://deax38zvkau9d.cloudfront.net/prod/assets/static/';

/**
 * Service landing page (e.g. /en-AE/house-cleaning, /en-AE/pest-control): breadcrumb, hero with
 * "Book Now", rich description, other services and the app download banner.
 */
@Component({
  selector: 'app-service-page',
  imports: [AppLink, ContentLinks, SafeHtmlPipe],
  templateUrl: './service-page.html',
  styleUrl: './service-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The host plays the role of the Nuxt page root (`<div class="h-100">`).
  host: { class: 'h-100', '(window:resize)': 'updateArrows()' },
})
export class ServicePage {
  readonly content = input.required<ServicePageContent>();

  protected readonly cdn = CDN_STATIC;
  protected readonly rightArrow = CDN_STATIC + 'right-arrow.svg';
  protected readonly leftArrow = CDN_STATIC + 'left-arrow.svg';

  /** `undefined` while the shared list is loading. */
  private readonly allServices = toSignal(
    inject(ContentService)
      .json<OtherService[]>(OTHER_SERVICES_URL)
      .pipe(catchError(() => of<OtherService[]>([]))),
  );

  /** Every service of the app except the one this page belongs to (any service in its breadcrumb). */
  protected readonly otherServices = computed(() => {
    const own = new Set(this.content().breadcrumbs.map((item) => item.href));
    return (this.allServices() ?? []).filter((service) => !own.has(service.href));
  });

  /** The section is kept while the list loads (no layout jump) and omitted only when there is nothing to show. */
  protected readonly showOtherServices = computed(
    () => this.allServices() === undefined || this.otherServices().length > 0,
  );

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  protected readonly canScrollBack = signal(false);
  protected readonly canScrollForward = signal(false);

  constructor() {
    // Whenever the cards change (loaded, or another service page reusing this component): start at the first
    // card, then measure which arrows apply. The read phase re-runs because the write phase returns the new list.
    afterRenderEffect({
      write: () => {
        const services = this.otherServices();
        const el = this.scroller()?.nativeElement;
        if (el) el.scrollLeft = 0;
        return services;
      },
      read: (services) => {
        services();
        this.updateArrows();
      },
    });
  }

  protected updateArrows(): void {
    const el = this.scroller()?.nativeElement;
    if (!el) {
      this.canScrollBack.set(false);
      this.canScrollForward.set(false);
      return;
    }
    this.canScrollBack.set(el.scrollLeft > 1);
    this.canScrollForward.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  /** Scrolls the card row by the number of fully visible cards. */
  protected scrollCards(direction: 1 | -1): void {
    const el = this.scroller()?.nativeElement;
    const card = el?.querySelector<HTMLElement>('.service-card');
    if (!el || !card) return;
    const margins = getComputedStyle(card);
    // card + horizontal margins (12px each side, 6px at 780px and below)
    const step =
      card.offsetWidth + parseFloat(margins.marginLeft) + parseFloat(margins.marginRight);
    const visible = Math.max(1, Math.floor(el.clientWidth / step));
    el.scrollBy({ left: direction * visible * step, behavior: 'smooth' });
  }
}
