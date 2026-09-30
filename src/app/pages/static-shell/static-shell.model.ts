import { Link, SitePage } from '../../core/models';

/**
 * Common content of the pages drawn in the static layout (FAQ, contact, legal, sitemap, help):
 * the breadcrumb link above the page title and the title itself (the page's h1).
 */
export interface StaticPageContent extends SitePage {
  title: string;
  crumb: Link;
}
