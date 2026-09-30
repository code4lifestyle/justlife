import { SitePage } from '../../core/models';
import { StaticPageContent } from '../static-shell/static-shell.model';

/** `content/pages/<locale>/contact-us.json`: the two locales use different designs. */
export type ContactContent = ContactRichContent | ContactHeroContent;

/** UAE: the static layout with a rich-text card. */
export interface ContactRichContent extends StaticPageContent {
  layout: 'content';
  html: string;
}

/** Saudi Arabia: a hero image followed by contact details. */
export interface ContactHeroContent extends SitePage {
  layout: 'hero';
  hero: { src: string; alt: string };
  blocks: ContactBlock[];
}

export type ContactBlock =
  | { kind: 'title'; tag: 'h3' | 'h4'; class: string; text: string }
  | { kind: 'text'; class: string; html: string }
  | {
      kind: 'link';
      class: string;
      textClass: string;
      text: string;
      href: string;
      newTab?: boolean;
    };
