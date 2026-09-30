import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { ContentService } from '../core/content.service';
import { styleWorldOf } from '../core/style-world.service';
import { BlogArticleIndex, BlogLayoutData } from './blog.model';

/** Route of the blog home; posts live below it. */
export const BLOG_HOME = '/blog/en-AE';

export function blogPostUrl(slug: string): string {
  return `${BLOG_HOME}/${slug}`;
}

/** Icons the Next.js app referenced from its storyblok image base url. */
const ICON_BASE = 'https://a.storyblok.com/f/285972427025846/';
export const BLOG_ICONS = {
  chevronRight: `${ICON_BASE}7x10/bed1910ac4/chevron-right.svg`,
  arrowLeft: `${ICON_BASE}28x28/248bc0f111/arrow-left.svg`,
  arrowRight: `${ICON_BASE}28x28/65e91eee9c/arrow-right.svg`,
};

/**
 * Sized storyblok image, as the blog's image helper built it:
 * `<upload>/m/<width>x<height>/filters:format(webp)` where the height keeps the upload's aspect ratio
 * (taken from its `<W>x<H>` path segment). SVGs are served as they are.
 */
export function blogImage(src: string, width: number): string {
  if (!src || src.includes('.svg')) return src;
  const size = src.split('/').find((part) => /^\d+x\d+$/.test(part));
  let height = width;
  if (size) {
    const [w, h] = size.split('x').map(Number);
    height = Math.round((width / w) * h);
  }
  return `${src}/m/${width}x${height}/filters:format(webp)`;
}

/**
 * Blog-wide shared content (layout widgets and the article card index), loaded once and cached.
 * A file that fails does not keep the blog hidden: `ready()` only waits until both requests have been
 * answered, the pages then render without that file's widgets, and every later navigation to a blog page
 * (including a click on the current page's link) requests the failed file again.
 */
@Injectable({ providedIn: 'root' })
export class BlogData {
  private readonly content = inject(ContentService);
  private readonly layoutFile = new SharedJson<BlogLayoutData>(() =>
    this.content.json('content/blog/layout.json'),
  );
  private readonly articlesFile = new SharedJson<BlogArticleIndex>(() =>
    this.content.json('content/blog/articles.json'),
  );

  /** Header, footer and static widgets; undefined until loaded (or while the file keeps failing). */
  readonly layout = this.layoutFile.value;
  /** Card data of every post; undefined until loaded (or while the file keeps failing). */
  readonly articles = this.articlesFile.value;
  /** Both files have been answered (loaded or failed), so the blog can be shown. */
  readonly ready = computed(() => this.layoutFile.settled() && this.articlesFile.settled());

  constructor() {
    this.load();
    inject(Router)
      .events.pipe(
        filter(
          (e) =>
            (e instanceof NavigationStart || e instanceof NavigationSkipped) &&
            styleWorldOf(e.url) === 'blog',
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.load());
  }

  /** Requests the files that are neither loaded nor in flight (a failed request is sent again). */
  private load(): void {
    this.layoutFile.load();
    this.articlesFile.load();
  }
}

/** One shared JSON file: its value once loaded, and whether its first request has been answered. */
class SharedJson<T> {
  private readonly data = signal<T | undefined>(undefined);
  private readonly answered = signal(false);
  private inFlight = false;

  readonly value: Signal<T | undefined> = this.data.asReadonly();
  readonly settled: Signal<boolean> = this.answered.asReadonly();

  constructor(private readonly request: () => Observable<T>) {}

  /** Requests the file unless it is loaded or a request is in flight. */
  load(): void {
    if (this.inFlight || this.data() !== undefined) return;
    this.inFlight = true;
    const done = () => {
      this.inFlight = false;
      this.answered.set(true);
    };
    this.request().subscribe({
      next: (value) => this.data.set(value),
      error: done,
      complete: done,
    });
  }
}
