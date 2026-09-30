import { MetaDefinition } from '@angular/platform-browser';
import { Link, PageMeta } from '../core/models';

/**
 * Content of the cat-grooming landing page (`public/content/pages/cat-grooming.json`, taken from the
 * original Webflow page and maintained by hand). Fields ending in `Html` hold small trusted HTML
 * fragments of the original (`<br>`, `<strong>`, links already mapped to app routes). Local image
 * paths are relative to the document base (`assets/cat-grooming/images/...`, no leading slash).
 */
export interface CatGroomingContent {
  meta: PageMeta;
  /** Head tags the shared SeoService does not handle (og:type, twitter:*), exactly as in the original. */
  extraMeta: MetaDefinition[];
  /** Google Fonts stylesheet of the original WebFont loader config (Montserrat, Poppins). */
  fontsHref: string;
  navbar: {
    /** "Home > " – links to /en-AE. */
    homeText: string;
    /** "Cat Grooming" – links to this page. */
    currentText: string;
    logo: WfImage;
  };
  hero: {
    title: string;
    /** "Now" */
    lead: string;
    cta: Link;
    /** "Cat Grooming Service at Home" */
    ctaText: string;
    tagline: string;
    image: WfImage;
  };
  intro: { titleHtml: string; textHtml: string };
  /** "What Is a Cat Grooming Service?" block with image. */
  feature: { title: string; text: string; cta: Link; image: WfImage };
  services: TextSection;
  /** Wavy line between the text sections. */
  separator: WfImage;
  whyChoose: TextSection;
  booking: { titleHtml: string; intro: string; stepsHtml: string[] };
  /** Blue wave above the FAQ. */
  faqDivider: WfImage;
  faq: { title: string; icon: WfImage; items: FaqItem[] };
  /** Omitted when none of its cards' services is part of the app any more. */
  otherServices?: OtherServices;
  app: { cta: Link; titleHtml: string; text: string; image: WfImage };
  footer: {
    logo: WfImage;
    /** Service links, reduced to the services the app has (empty columns omitted). */
    columns: HtmlLink[][];
    copyright: string;
    social: { href: string; image: WfImage; imageClass: string }[];
  };
}

export interface WfImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcset?: string;
  sizes?: string;
}

/** Link whose label is an HTML fragment. */
export interface HtmlLink {
  html: string;
  href: string;
}

export interface TextSection {
  titleHtml: string;
  intro: string;
  items: TextItem[];
}

export interface TextItem {
  title: string;
  /** Webflow class of the `<strong>` in the heading (bold-text-N). */
  boldClass: string;
  textHtml: string;
}

export interface FaqItem {
  question: string;
  answerHtml: string;
}

/** "What other services can we help you with?" – a Webflow slider of service cards. */
export interface OtherServices {
  title: string;
  boldClass: string;
  subtitle: string;
  /** Only the cards whose "Book now" target is a page of the app (2 of the original 4). */
  cards: ServiceCard[];
  prevArrow: WfImage;
  nextArrow: WfImage;
  /** Slide animation duration in ms (data-duration). */
  duration: number;
  /** Wrap around past the last/first page (data-infinite). */
  infinite: boolean;
  /** Hide the left arrow on the first page and the right arrow on the last (data-hide-arrows). */
  hideArrows: boolean;
}

export interface ServiceCard {
  icon: WfImage;
  titleHtml: string;
  text: string;
  cta: Link;
}
