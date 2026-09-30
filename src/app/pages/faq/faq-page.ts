import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ContentLinks } from '../../shared/content-links.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { AppDownloader } from '../static-shell/app-downloader';
import { StaticShell } from '../static-shell/static-shell';
import { FaqContent } from './faq-page.model';

const TAB_SELECTED =
  'f-link1 is-selected c-text-link-success-text-default c-border-border-success-high-emphasize category-title';
const TAB = 'f-subtitle1 has-text-black38 c-text-text-tertiary category-title';

/** "Doctor at Home" -> "doctor-at-home": element ids referenced from ARIA attributes cannot contain spaces. */
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * FAQ page: category tabs (a horizontal slider with arrow buttons when the tabs overflow) switch
 * between lists of accordions; clicking a question toggles its answer.
 *
 * Keyboard: the tabs follow the ARIA tabs pattern (only the selected tab is in the Tab order; the
 * arrow keys, Home and End move between tabs and select them; Enter and Space select too). The
 * slider arrows and the questions are buttons that respond to Enter and Space.
 */
@Component({
  selector: 'app-faq-page',
  imports: [StaticShell, AppDownloader, ContentLinks, SafeHtmlPipe],
  templateUrl: './faq-page.html',
  styleUrl: './faq-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqPage {
  readonly content = input.required<FaqContent>();

  // The component is reused when navigating to the other locale's FAQ: new content starts again on
  // the first category with every answer closed.
  /** Index of the category whose questions are shown. */
  protected readonly selected = linkedSignal<FaqContent, number>({
    source: this.content,
    computation: () => 0,
  });
  /** Open accordions, keyed "<category>:<question>". */
  protected readonly open = linkedSignal<FaqContent, ReadonlySet<string>>({
    source: this.content,
    computation: () => new Set(),
  });
  protected readonly canScrollLeft = signal(false);
  protected readonly canScrollRight = signal(false);

  /** Space-free id stem per category, used for the tab, panel and answer ids. */
  protected readonly slugs = computed(() =>
    this.content().categories.map((c, i) => slugify(c.name) || `category-${i}`),
  );

  protected readonly tabClass = (index: number) => (index === this.selected() ? TAB_SELECTED : TAB);

  private readonly slider = viewChild<ElementRef<HTMLElement>>('slider');
  private readonly tabs = viewChildren<ElementRef<HTMLElement>>('tab');
  private readonly leftArrow = viewChild<ElementRef<HTMLElement>>('leftArrow');
  private readonly rightArrow = viewChild<ElementRef<HTMLElement>>('rightArrow');
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  constructor() {
    // Re-measure whenever the slider or the tab row changes size (viewport resize, the site
    // stylesheet or web fonts finishing loading, other locale's tabs).
    afterNextRender(() => {
      const el = this.slider()?.nativeElement;
      if (!el) return;
      this.updateArrows();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.updateArrows());
      observer.observe(el);
      if (el.firstElementChild) observer.observe(el.firstElementChild);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected select(index: number): void {
    this.selected.set(index);
  }

  /** Enter/Space select the focused tab; the arrow keys, Home and End move to another tab and select it. */
  protected onTabKey(event: KeyboardEvent, index: number): void {
    const count = this.content().categories.length;
    let next: number;
    switch (event.key) {
      case 'Enter':
      case ' ':
        next = index;
        break;
      case 'ArrowRight':
        next = (index + 1) % count;
        break;
      case 'ArrowLeft':
        next = (index - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(next);
    if (next === index) return;
    const tab = this.tabs()[next]?.nativeElement;
    if (!tab) return;
    // Centre the tab in the slider: focus() alone leaves a partly visible tab where it is, under the
    // edge fade.
    tab.focus({ preventScroll: true });
    tab.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  protected isOpen(category: number, item: number): boolean {
    return this.open().has(`${category}:${item}`);
  }

  protected toggle(category: number, item: number): void {
    const key = `${category}:${item}`;
    this.open.update((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  }

  /** Enter/Space on a question (preventDefault keeps Space from scrolling the page). */
  protected onHeaderKey(event: Event, category: number, item: number): void {
    event.preventDefault();
    this.toggle(category, item);
  }

  /** Scrolls the category tabs by half their visible width (smooth scrolling comes from the CSS). */
  protected scrollTabs(direction: -1 | 1): void {
    const el = this.slider()?.nativeElement;
    el?.scrollBy({ left: direction * Math.max(el.clientWidth / 2, 100) });
  }

  /** Enter/Space on a slider arrow. */
  protected onArrowKey(event: Event, direction: -1 | 1): void {
    event.preventDefault();
    this.scrollTabs(direction);
  }

  /** Shows an arrow on each side where the tabs overflow the slider. */
  protected updateArrows(): void {
    const el = this.slider()?.nativeElement;
    if (!el) return;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    // An arrow that is about to disappear (the row reached that end) must not take the keyboard
    // focus with it: hand it to the other arrow, or to the selected tab when neither stays.
    const focused = el.ownerDocument.activeElement;
    const leaving =
      (!left && this.leftArrow()?.nativeElement === focused) ||
      (!right && this.rightArrow()?.nativeElement === focused);
    this.canScrollLeft.set(left);
    this.canScrollRight.set(right);
    if (leaving) {
      // After the render, so that the other arrow is displayed again if it was hidden.
      afterNextRender(
        () => {
          const other = left ? this.leftArrow() : right ? this.rightArrow() : undefined;
          (other ?? this.tabs()[this.selected()])?.nativeElement.focus({ preventScroll: true });
        },
        { injector: this.injector },
      );
    }
  }
}
