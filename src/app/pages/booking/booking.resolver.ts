import { ResolveFn } from '@angular/router';
import { Locale, PageMeta, SiteShell } from '../../core/models';
import { KSA_CITIES, SITE_NAME, SITE_URL, UAE_CITIES } from '../../core/site-seo';
import { BookingService, bookingServiceBySlug } from './booking-services';

/** Content the booking page receives from the router. */
export interface BookingPageContent {
  meta: PageMeta;
  shell: SiteShell;
  service: BookingService;
}

/** Builds the checkout page for one of the bookable services. The route only matches those slugs. */
export const bookingResolver: ResolveFn<BookingPageContent> = (route) => {
  const service = bookingServiceBySlug(route.paramMap.get('service') ?? '')!;
  const locale: Locale = route.paramMap.get('locale') === 'en-SA' ? 'en-SA' : 'en-AE';
  return {
    meta: bookingMeta(service, locale),
    shell: {
      locale,
      wrapperClass: 'funnel-page-wrapper en app-layout main-wrapper',
      navbarClass: 'navbar visitor',
      footer: { desktopOnly: true, servicesTitle: 'Services', serviceAreas: null },
    },
    service,
  };
};

function bookingMeta(service: BookingService, locale: Locale): PageMeta {
  const cities = locale === 'en-SA' ? KSA_CITIES.join(' and ') : UAE_CITIES.join(', ');
  const path = `/${locale}/${service.slug}/checkout/details`;
  const description = `Book ${service.name} with ${SITE_NAME} in ${cities}. In the city from AED 30 per hour, out of the city AED 40 per hour, and materials for AED 5.`;
  return {
    title: `${service.name} | ${SITE_NAME}`,
    description,
    keywords: `${service.name}, ${service.keywords}, ${SITE_NAME}, ${cities}`,
    robots: 'index, follow',
    canonical: `${SITE_URL}${path}`,
    ogTitle: `${service.name} | ${SITE_NAME}`,
    ogDescription: description,
    ogImage: `${SITE_URL}/brand/aljory-logo.png`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        serviceType: service.name,
        description,
        url: `${SITE_URL}${path}`,
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          name: SITE_NAME,
          url: SITE_URL,
          email: 'admin@aljorycleaning.com',
        },
        areaServed: (locale === 'en-SA' ? KSA_CITIES : UAE_CITIES).map((name) => ({
          '@type': 'City',
          name,
        })),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'AED',
          price: '30',
          unitText: 'HOUR',
          description: 'AED 30 per hour in the city, AED 40 per hour out of the city, materials AED 5',
          url: `${SITE_URL}${path}`,
        },
      },
    ],
  };
}
