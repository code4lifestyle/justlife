import { Link, SitePage } from '../../core/models';

/** Content of a service page (`content/pages/en-AE/<slug>.json`), e.g. /en-AE/house-cleaning. */
export interface ServicePageContent extends SitePage {
  /** Desktop breadcrumb: Home > root service > … > this page (last item = current page). */
  breadcrumbs: Link[];
  /** Mobile breadcrumb: back link to the parent page. */
  back: Link;
  /** Hero image (absolute CDN URL). */
  image: string;
  /** Hero heading (h1). */
  title: string;
  /** Hero subtitle below the heading. */
  subtitle: string;
  /** Target of the "Book Now" button (checkout route of the service). */
  bookNow: string;
  /** Rich description of the service (cleaned HTML, internal links are app routes). */
  html: string;
}

/** A card of the "What other services can we help you with?" section (`content/service/other-services.json`). */
export interface OtherService {
  title: string;
  href: string;
  image: string;
}
