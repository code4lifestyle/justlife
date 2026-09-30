import { Link, SitePage } from '../../core/models';

/**
 * Per-route data of a booking funnel page (`/<locale>/<service>/checkout/<step>`), derived from the
 * mirror: the service name (checkout capture's <title>, else the service page that books into the
 * route), that service page's image, and the pages linking into the funnel.
 */
export interface CheckoutInfo {
  /** Service the funnel books, e.g. "Home Cleaning", "Beauty for Her". */
  serviceName: string;
  /** Hero image of the related service page (CDN url), null when no service page books here. */
  image: string | null;
  /** Where "back" leads: the related service page (or the article / home page that links here). */
  backLink: Link;
  /**
   * Other service pages whose "Book Now" leads to this funnel, most relevant first (the back-link
   * target is not repeated here). May be empty; the block is then omitted.
   */
  related: Link[];
  /** Blog posts whose "Book now" leads into this funnel (only when few service pages do). May be empty. */
  articles: Link[];
}

/** `content/pages/<locale>/<service>/checkout/<step>.json` */
export interface CheckoutPageContent extends SitePage {
  checkout: CheckoutInfo;
}
