import { Link, PageMeta } from '../core/models';

/**
 * Content of the blog ("Cleanslate by Justlife", originally a separate Next.js app). The data was extracted
 * from the original site and is now maintained by hand:
 *  - `content/blog/articles.json`  slug -> card data, shared by every blog page (cards reference slugs)
 *  - `content/blog/layout.json`    header, footer and the static widgets (identical on every blog page)
 *  - `content/pages/blog/en-AE.json` / `content/pages/blog/en-AE/<slug>.json` per-page content
 */

/** Card data of one post (the cards' own title / short description, not the post's h1). */
export interface BlogArticle {
  title: string;
  description: string;
  /** Original storyblok upload; sized variants are derived with `blogImage()`. */
  image: string;
}

export type BlogArticleIndex = Record<string, BlogArticle>;

export interface BlogAppButton {
  href: string;
  img: string;
  alt: string;
  width: number;
  height: number;
  /** The first (App Store) button has a white background (`Footer_appDownloadButton`). */
  highlight: boolean;
  newTab: boolean;
}

export interface BlogFooter {
  servicesTitle: string;
  services: Link[];
  countries: { title: string; cities: Link[] }[];
  appButtons: BlogAppButton[];
  social: { href: string; img: string; newTab: boolean }[];
  links: Link[];
}

export interface BlogLayoutData {
  header: { logo: string; brand: string };
  footer: BlogFooter;
  /** Blue "Download Justlife" card shown inside the featured article grids. */
  justlifeCard: { logo: string; title: string; button: string; href: string; subtitle: string };
  /** "About us" section at the bottom of every blog page; `lines` are separated by blank lines. */
  mobileApp: { title: string; lines: string[]; image: string };
  /** "Book now" card of the post pages (the link is per post). */
  bookNowCard: { logo: string; text: string; button: string };
  /** "Service Areas" Google Maps embed of the post pages. */
  map: { title: string; src: string };
}

/**
 * `content/pages/blog/en-AE.json`: the blog home. Only posts the app has are referenced; a section whose
 * posts were all removed from the app is omitted from the JSON (and not rendered).
 */
export interface BlogHomeContent {
  meta: PageMeta;
  banner?: string;
  featured?: string[];
  trending?: string[];
  suggestions?: string[];
  /** Article slugs of every page of the paginated grid (9 per page, as the original; `?page=n`). */
  pages: string[][];
}

/** `content/pages/blog/en-AE/<slug>.json` */
export interface BlogPostContent {
  meta: PageMeta;
  title: string;
  description: string;
  image: string;
  /** Checkout route (with its utm query) of the "Book now" buttons. */
  bookNow: string;
  /** Cleaned article HTML. */
  content: string;
  /** Related articles ("Featured Articles"); omitted when none of them is part of the app. */
  featured?: string[];
  suggestions?: string[];
}
