import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageMeta } from './models';

const DEFAULT_META: PageMeta = { title: 'Justlife' };

/** Applies a page's title, meta tags, canonical link and JSON-LD to the document head. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(page: PageMeta | undefined): void {
    const m = page ?? DEFAULT_META;
    this.title.setTitle(m.title);
    this.setName('description', m.description);
    this.setName('keywords', m.keywords);
    this.setName('robots', m.robots);
    this.setProperty('og:title', m.ogTitle ?? m.title);
    this.setProperty('og:description', m.ogDescription ?? m.description);
    this.setProperty('og:image', m.ogImage);
    this.setCanonical(m.canonical);
    this.setJsonLd(m.jsonLd);
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
