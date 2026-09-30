/** Kinds of pages the app serves. Every route in `page-registry.json` maps to one of these. */
export type PageType =
  | 'home'
  | 'city'
  | 'service'
  | 'contact'
  | 'faq'
  | 'legal'
  | 'sitemap'
  | 'help'
  | 'checkout'
  | 'blog-home'
  | 'blog-post'
  | 'cat-grooming';

export type Locale = 'en-AE' | 'en-SA';

/** A link as stored in the content JSON: `href` is an app route ("/en-AE/…") or an absolute URL. */
export interface Link {
  text: string;
  href: string;
  newTab?: boolean;
}

/** `<head>` metadata extracted from the original page. */
export interface PageMeta {
  title: string;
  description?: string;
  keywords?: string;
  robots?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: unknown[];
}

/** Per-page navbar/footer settings for the main-site layout. */
export interface SiteShell {
  locale: Locale;
  /** Classes of the page wrapper below the navbar, e.g. `lg-navbar en lang-services app-layout main-wrapper`. */
  wrapperClass: string;
  /** Classes of `nav#main-navbar`, e.g. `navbar visitor is-home`. */
  navbarClass: string;
  footer: SiteShellFooter | null;
}

export interface SiteShellFooter {
  /** The footer container is hidden on touch devices (checkout and help pages). */
  desktopOnly: boolean;
  /** Title above the locale-wide services list; null when the locale has no list (Saudi Arabia). */
  servicesTitle: string | null;
  /** Page-specific link section shown before the services list (service pages' sub-pages). */
  serviceAreas: Link[] | null;
}

/** Locale-wide footer lists: `content/site/footer.<locale>.json`. */
export interface FooterData {
  services: Link[];
  cities: { title: string; links: Link[] }[];
  ksaDocs: { href: string; img: string; alt: string }[];
  appIcons: { href: string; img: string; alt: string }[];
  links: (Link & { id?: string })[];
}

/** Common shape of every main-site page JSON. */
export interface SitePage {
  meta: PageMeta;
  shell: SiteShell;
}
