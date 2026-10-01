import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageMeta } from './models';
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from './site-seo';

const DEFAULT_META: PageMeta = {
  title: `${SITE_NAME} | Building Cleaning, Tiling and Maintenance in the UAE`,
  description:
    'Aljory Cleaning Services books floor and wall tiling, plumbing, false ceilings, air conditioning, carpentry, wallpaper, plaster, painting, building cleaning, electrical fittings and electromechanical work across Dubai, Abu Dhabi, Sharjah and Ajman.',
  keywords: SITE_KEYWORDS,
  robots: 'index, follow',
  canonical: `${SITE_URL}/en-AE`,
  ogImage: `${SITE_URL}/brand/aljory-logo.png`,
};

/** Applies a page's title, meta tags, canonical link and JSON-LD to the document head. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(page: PageMeta | undefined, locale?: string): void {
    const m = page ?? DEFAULT_META;
    const canonical = this.absolute(m.canonical);
    const image = this.absolute(m.ogImage ?? DEFAULT_META.ogImage);
    this.title.setTitle(m.title);
    this.setName('description', m.description ?? DEFAULT_META.description);
    this.setName('keywords', m.keywords ?? SITE_KEYWORDS);
    this.setName('robots', m.robots ?? 'index, follow');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:type', 'website');
    this.setProperty('og:locale', locale === 'en-SA' ? 'en_SA' : 'en_AE');
    this.setProperty('og:url', canonical);
    this.setProperty('og:title', m.ogTitle ?? m.title);
    this.setProperty('og:description', m.ogDescription ?? m.description ?? DEFAULT_META.description);
    this.setProperty('og:image', image);
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', m.ogTitle ?? m.title);
    this.setName('twitter:description', m.ogDescription ?? m.description ?? DEFAULT_META.description);
    this.setName('twitter:image', image);
    this.setCanonical(canonical);
    this.setJsonLd(m.jsonLd);
    if (locale) this.document.documentElement.lang = locale;
  }

  /** Turns a site path or a leftover justlife.com URL into this site's absolute URL. */
  private absolute(value: string | undefined): string | undefined {
    if (!value) return value;
    const rewritten = value
      .replace('https://www.justlife.com', SITE_URL)
      .replace('https://justlife.com', SITE_URL);
    if (rewritten.startsWith('/')) return `${SITE_URL}${rewritten}`;
    return rewritten;
  }

  private setName(name: string, content: string | undefined): void {
    if (content) this.meta.updateTag({ name, content });
    else this.meta.removeTag(`name="${name}"`);
  }

  private setProperty(property: string, content: string | undefined): void {
    if (content) this.meta.updateTag({ property, content });
    else this.meta.removeTag(`property="${property}"`);
  }

  private setCanonical(href: string | undefined): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private setJsonLd(data: unknown[] | undefined): void {
    this.document.head.querySelectorAll('script[data-page-jsonld]').forEach((s) => s.remove());
    for (const item of data ?? []) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-jsonld', '');
      script.textContent = JSON.stringify(item);
      this.document.head.appendChild(script);
    }
  }
}
