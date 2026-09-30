import { SitePage } from '../../core/models';

/**
 * Content of the home pages ('/', '/en-AE', '/en-SA') and the city pages ('/en-AE/dubai', …),
 * which share one Nuxt template: `content/pages/<route>.json`.
 */
export interface HomePageContent extends SitePage {
  kind: 'home' | 'city';
  /** Hero with the location search (home pages only). */
  hero: HomeHero | null;
  /** "Leave your to-do list to us!" category cards (UAE home pages only). */
  categories: CategorySection | null;
  /** City pages only. */
  city: CityContent | null;
}

export interface HomeHero {
  title: string;
  image: string;
  imageAlt: string;
  search: LocationSearchText;
}

/** Texts and icons of the (backend-less) location search box. */
export interface LocationSearchText {
  label: string;
  placeholder: string;
  locateMe: string;
  pinIcon: string;
  locateIcon: string;
  emptyIcon: string;
  /** "We couldn't find anything for" – the typed term is appended in quotes. */
  emptyTitle: string;
  emptyHint: string;
}

export interface CategorySection {
  title: string;
  subtitle: string;
  items: CategoryCard[];
}

export interface CategoryCard {
  text: string;
  /** App route of the service page. */
  href: string;
  icon: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CityContent {
  /** Page heading of the active-services section. */
  title: string;
  /** Public path of the locale's `ServiceCatalog` JSON, null when the original site had none (KSA). */
  catalog: string | null;
}

/**
 * Static stand-in for the city pages' API-driven lists (`content/home/catalog.<locale>.json`):
 * shortcuts = the locale home page's category cards, services = the locale's service pages.
 */
export interface ServiceCatalog {
  shortcuts: CategoryCard[];
  services: ServiceCard[];
}

export interface ServiceCard {
  text: string;
  href: string;
  image: string;
}

export interface ImageRef {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Sections identical on every home and city page: `content/home/common.json`. */
export interface HomeCommon {
  features: {
    title: string;
    subtitle: string;
    items: { icon: string; alt: string; title: string; text: string }[];
  };
  promise: { logo: ImageRef; title: string; text: string };
  app: {
    badge: string;
    title: string;
    subtitle: string;
    links: { href: string; img: ImageRef }[];
    image: ImageRef;
  };
}
