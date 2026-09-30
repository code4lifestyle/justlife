import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

/**
 * The original site was three separate front-ends, each with its own global CSS resets:
 *  - `site`    the main Nuxt app (Bulma based)
 *  - `blog`    the Next.js blog ("Cleanslate")
 *  - `webflow` the Webflow cat-grooming landing page
 * Loading them together would make their global rules fight, so each is built as a separate,
 * non-injected style bundle (see angular.json) and only the active world's stylesheet applies.
 *
 * Inactive sheets are switched off with `media="not all"` rather than `disabled`: the browser keeps
 * the parsed sheet, so switching back is instant and never re-downloads the file.
 */
export type StyleWorld = 'site' | 'blog' | 'webflow';

const WORLDS: StyleWorld[] = ['site', 'blog', 'webflow'];

/** Viewport of each world, as the original pages declared it (only the Nuxt app disabled zooming). */
const VIEWPORT: Record<StyleWorld, string> = {
  site: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  blog: 'width=device-width, initial-scale=1',
  webflow: 'width=device-width, initial-scale=1',
};

/** Style world of a URL (path, optionally with query/fragment), used to start downloading its sheet early. */
export function styleWorldOf(url: string): StyleWorld {
  const path = url.split(/[?#]/)[0];
  if (path === '/blog' || path.startsWith('/blog/')) return 'blog';
  if (path === '/cat-grooming' || path.startsWith('/cat-grooming/')) return 'webflow';
  return 'site';
}

@Injectable({ providedIn: 'root' })
export class StyleWorldService {
  private readonly document = inject(DOCUMENT);
  private readonly loaded = new Map<StyleWorld, Promise<void>>();
  /** The most recently requested world; activations that finish after a newer request are ignored. */
  private requested: StyleWorld | null = null;

  /** The world whose stylesheet is active and fully loaded (null until the first one loads). */
  readonly active = signal<StyleWorld | null>(null);

  /** Starts downloading a world's stylesheet without applying it. */
  preload(world: StyleWorld): void {
    void this.load(world);
  }

  /** Applies the stylesheet of `world` (once loaded) and switches the others off. */
  activate(world: StyleWorld): Promise<void> {
    this.requested = world;
    return this.load(world).then(() => {
      if (this.requested !== world) return; // a newer activate() won
      for (const other of WORLDS) {
        const link = this.link(other);
        if (link) link.media = other === world ? 'all' : 'not all';
      }
      this.setViewport(VIEWPORT[world]);
      this.active.set(world);
    });
  }

  private load(world: StyleWorld): Promise<void> {
    let promise = this.loaded.get(world);
    if (!promise) {
      promise = new Promise<void>((resolve) => {
        const link = this.document.createElement('link');
        link.rel = 'stylesheet';
        link.media = 'not all'; // downloaded, but not applied until activated
        // A non-matching media would make it a very-low-priority fetch, but the page waits for it.
        link.fetchPriority = 'high';
        link.href = `${world}.css`;
        link.setAttribute('data-style-world', world);
        link.onload = () => resolve();
        link.onerror = () => {
          // Show the page unstyled rather than hidden, and let the next activation retry the download.
          link.remove();
          this.loaded.delete(world);
          resolve();
        };
        this.document.head.appendChild(link);
      });
      this.loaded.set(world, promise);
    }
    return promise;
  }

  private link(world: StyleWorld): HTMLLinkElement | null {
    return this.document.head.querySelector<HTMLLinkElement>(`link[data-style-world="${world}"]`);
  }

  private setViewport(content: string): void {
    this.document.head.querySelector('meta[name="viewport"]')?.setAttribute('content', content);
  }
}
