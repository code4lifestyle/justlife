import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { BLOG_HOME, BLOG_ICONS } from '../blog-data';

const MAX_ITEMS = 5;
const MOBILE_MAX_ITEMS = 3;
const SHOW_ALL_PAGES_LIMIT = 7;
/** Space (rem) left above the grid when a page change scrolls back to it. */
const SCROLL_OFFSET = { mobile: 3.75, tablet: 4.375, desktop: 5 };

/**
 * Page links of the blog home grid, re-implementing the Next.js `Pagination`: up to 7 pages it lists every
 * page; beyond that a window of 5 pages (3 on phones) around the current one, "...", the last page, and
 * prev/next arrow buttons. Changing the page keeps the scroll position and smoothly scrolls back to the grid.
 * Kept as a faithful, data-driven port: the window/arrow branch renders once `pages` has over 7 pages.
 */
@Component({
  selector: 'div[appBlogPagination]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'Pagination_paginationContainer__xQnC8' },
  template: `
    @if (total() <= showAllLimit) {
      <div class="Pagination_paginationClickableItemWrapper__fQjuP">
        @for (n of allPages(); track n) {
          <a
            class="Pagination_paginationClickableItem__BCXP6"
            [class.Pagination_selected__BS0md]="n === current()"
            target="_self"
            [attr.href]="pageUrl(n)"
            (click)="onLink($event, n)"
            >{{ n }}</a
          >
        }
      </div>
    } @else {
      <button
        id="sliderPrevButton"
        class="Button_button__VVYkM Button_outlined__rysMo IconButton_iconButtonContainer__0pPxi Pagination_paginationButton__QyCcJ"
        [disabled]="current() <= 1"
        (click)="go(current() - 1)"
      >
        <img
          alt="arrow-prev"
          loading="lazy"
          width="27"
          height="27"
          decoding="async"
          class="IconButton_buttonIcon__QLWPh rtl-flip"
          style="color:transparent;aspect-ratio:1"
          [src]="icons.arrowLeft"
        />
      </button>
      <div class="Pagination_paginationClickableItemWrapper__fQjuP">
        @for (n of range(); track $index) {
          <a
            class="Pagination_paginationClickableItem__BCXP6"
            [class.Pagination_selected__BS0md]="n === current()"
            target="_self"
            [attr.href]="pageUrl(n)"
            (click)="onLink($event, n)"
            >{{ n }}</a
          >
        }
        <p class="Pagination_paginationEllipsis__Uvh_x text-head-4">...</p>
        <a
          class="Pagination_paginationClickableItem__BCXP6 Pagination_longItem__rjcrT"
          [class.Pagination_selected__BS0md]="total() === current()"
          target="_self"
          [attr.href]="pageUrl(total())"
          (click)="onLink($event, total())"
          >{{ total() }}</a
        >
      </div>
      <button
        id="sliderNextButton"
        class="Button_button__VVYkM Button_outlined__rysMo IconButton_iconButtonContainer__0pPxi Pagination_paginationButton__QyCcJ"
        [disabled]="current() >= total()"
        (click)="go(current() + 1)"
      >
        <img
          alt="arrow-next"
          loading="lazy"
          width="27"
          height="27"
          decoding="async"
          class="IconButton_buttonIcon__QLWPh rtl-flip"
          style="color:transparent;aspect-ratio:1"
          [src]="icons.arrowRight"
        />
      </button>
    }
  `,
})
export class BlogPagination {
  private readonly router = inject(Router);

  readonly current = input.required<number>();
  readonly total = input.required<number>();
  /** id of the grid element to scroll back to when the page changes. */
  readonly wrapperId = input.required<string>();

  protected readonly icons = BLOG_ICONS;
  protected readonly showAllLimit = SHOW_ALL_PAGES_LIMIT;
  private readonly viewport = signal(viewportKind());

  protected readonly allPages = computed(() =>
    Array.from({ length: this.total() }, (_, i) => i + 1),
  );
  /** Pages shown before the "..." (the last page is always shown after it). */
  protected readonly range = computed(() =>
    pageRange(
      this.current(),
      this.viewport() === 'mobile' ? MOBILE_MAX_ITEMS : MAX_ITEMS,
      this.total(),
    ),
  );

  constructor() {
    const queries = ['(max-width: 767px)', '(min-width: 1024px)'].map((q) => window.matchMedia(q));
    const update = () => this.viewport.set(viewportKind());
    queries.forEach((q) => q.addEventListener('change', update));
    inject(DestroyRef).onDestroy(() =>
      queries.forEach((q) => q.removeEventListener('change', update)),
    );

    // Scroll back to the grid when this pagination switches pages (not on the first render).
    let shown: number | undefined;
    afterRenderEffect(() => {
      const page = this.current();
      if (shown !== undefined && shown !== page) this.scrollToGrid();
      shown = page;
    });
  }

  protected pageUrl(page: number): string {
    return page > 1 ? `${BLOG_HOME}?page=${page}` : BLOG_HOME;
  }

  protected onLink(event: MouseEvent, page: number): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    this.go(page);
  }

  protected go(page: number): void {
    // (An out-of-range `?page=n` shows page 1: its "1" link still leads to the plain blog url.)
    if (page < 1 || page > this.total() || this.router.url === this.pageUrl(page)) return;
    // 'manual': the router must not jump to the top, the grid scroll below takes care of it.
    void this.router.navigateByUrl(this.pageUrl(page), { scroll: 'manual' });
  }

  private scrollToGrid(): void {
    const grid = document.getElementById(this.wrapperId());
    if (!grid) return;
    const offset = SCROLL_OFFSET[this.viewport()] * 16;
    window.scrollTo({
      top: grid.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  }
}

function viewportKind(): 'mobile' | 'tablet' | 'desktop' {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  return window.matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'tablet';
}

/** `maxItems` consecutive pages around `current`, kept within 1..total-1. */
function pageRange(current: number, maxItems: number, total: number): number[] {
  const last = total - 1;
  if (last < 1) return [];
  let start = current - Math.floor(maxItems / 2);
  let end = start + maxItems - 1;
  if (end > last) {
    end = last;
    start = end - maxItems + 1;
  }
  if (start < 1) {
    start = 1;
    end = Math.min(last, start + maxItems - 1);
  }
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}
