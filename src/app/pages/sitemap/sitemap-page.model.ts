import { Link } from '../../core/models';
import { StaticPageContent } from '../static-shell/static-shell.model';

/** `content/pages/<locale>/sitemap.json` */
export interface SitemapContent extends StaticPageContent {
  sections: { title: string; links: Link[] }[];
}
