import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { StyleWorldService } from '../../core/style-world.service';
import { AppLink } from '../../shared/app-link.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { OtherServices } from '../cat-grooming-page.model';

/** A page of the slider: the slides it shows and where it starts on the slide strip. */
interface Anchor {
  els: number[];
  x: number;
  width: number;
}

let nextId = 0;

/**
 * Port of Webflow's slider (`webflow-slider.js`, "slide" animation, no autoplay) for the "What other
 * services" cards. Slides stay inline-blocks in a `nowrap` mask and every slide is shifted with
 * `translateX`; pages are computed like Webflow does (a new page starts once the slides overflow the
 * mask width minus the arrow "edge"), so desktop shows up to 3 cards per page, mobile one.
 * The host is the original `div.w-slider` element. With the reduced site only 2 cards are left: on
 * desktop they fit on one page (arrows hidden by data-hide-arrows) and the inherited text-align:center
 * centers them; the last slide gets no margin-right (4% gutter) so that the pair is centered exactly.
 */
@Component({
  selector: 'div[appWfSlider]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLink, SafeHtmlPipe],
  templateUrl: './wf-slider.html',
  host: {
    role: 'region',
    'aria-label': 'carousel',
    '(touchstart)': 'swipeStart($event)',
    '(mousedown)': 'swipeStart($event)',
    '(touchmove)': 'swipeMove($event)',
    '(mousemove)': 'swipeMove($event)',
    '(touchend)': 'swipeEnd($event)',
    '(mouseup)': 'swipeEnd($event)',
    '(touchcancel)': 'swiping = false',
    '(mouseout)': 'swiping = false',
    '(mouseenter)': 'hover.set(true)',
    '(mouseleave)': 'hover.set(false)',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class WfSlider {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly styles = inject(StyleWorldService);

  readonly slider = input.required<OtherServices>({ alias: 'appWfSlider' });

  private readonly mask = viewChild.required<ElementRef<HTMLElement>>('mask');
  private readonly rightArrow = viewChild.required<ElementRef<HTMLElement>>('right');
  private readonly slides = viewChildren<ElementRef<HTMLElement>>('slide');

  protected readonly maskId = `w-slider-mask-${nextId++}`;
  /** Current page. */
  protected readonly index = signal(0);
  /** Number of pages; 0 until the first styled layout (both arrows are shown until then). */
  protected readonly pages = signal(0);
  /** Slides of the current page (the others are aria-hidden and not focusable); null before layout. */
  private readonly shown = signal<ReadonlySet<number> | null>(null);
  protected readonly liveText = signal('');
  protected readonly hover = signal(false);
  protected readonly focused = signal(false);
  protected readonly live = computed(() => (this.hover() || this.focused() ? 'polite' : 'off'));
  protected readonly hideLeft = computed(() => this.slider().hideArrows && this.index() === 0);
  protected readonly hideRight = computed(
    () => this.slider().hideArrows && this.index() === this.pages() - 1,
  );

  private anchors: Anchor[] = [];
  private endX = 0;
  private offsetX = 0;
  private current = 0;
  private shifted: ReadonlySet<number> | null = null;
  /** Measurements the current pages were computed from (mask width, edge, slide widths). */
  private measured = '';

  protected swiping = false;
  private usedTouch = false;
  private lastX = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    let observer: ResizeObserver | null = null;
    destroyRef.onDestroy(() => observer?.disconnect());
    // Pages depend on the styled sizes of the mask, the slides and the right arrow, so the slider is
    // laid out when the page's style world becomes active and whenever one of those boxes changes
    // size: a window resize (Webflow re-lays out on resize), web fonts arriving, or the stylesheet
    // actually applying. layout() itself only measures once the Webflow CSS applies (isStyled()).
    afterRenderEffect(() => {
      this.styles.active();
      const slides = this.slides();
      untracked(() => {
        observer ??= new ResizeObserver(() => this.layout());
        observer.disconnect();
        observer.observe(this.mask().nativeElement);
        observer.observe(this.rightArrow().nativeElement);
        for (const slide of slides) observer.observe(slide.nativeElement);
        this.layout();
      });
    });
  }

  protected prev(): void {
    this.goTo(this.current - 1);
  }

  protected next(): void {
    this.goTo(this.current + 1);
  }

  /** Enter / Space on an arrow (Webflow makes the arrows keyboard buttons). */
  protected onArrowKey(event: Event, step: -1 | 1): void {
    event.preventDefault();
    event.stopPropagation();
    this.goTo(this.current + step);
  }

  protected isShown(slide: number): boolean {
    const shown = this.shown();
    return !shown || shown.has(slide);
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null))
      this.focused.set(false);
  }

  // --- swipe (Webflow's touch module: a single move of more than 4% of the viewport, max 40px) ---

  protected swipeStart(event: TouchEvent | MouseEvent): void {
    const touches = 'touches' in event ? event.touches : null;
    if (touches && touches.length > 1) return;
    this.swiping = true;
    if (touches) this.usedTouch = true;
    this.lastX = touches ? touches[0].clientX : (event as MouseEvent).clientX;
  }

  protected swipeMove(event: TouchEvent | MouseEvent): void {
    if (!this.swiping) return;
    if (this.usedTouch && event.type === 'mousemove') return;
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const delta = x - this.lastX;
    this.lastX = x;
    const threshold = Math.min(Math.round(0.04 * window.innerWidth), 40);
    if (Math.abs(delta) > threshold && String(window.getSelection() ?? '') === '') {
      this.swiping = false;
      if (delta > 0) this.prev();
      else this.next();
    }
  }

  protected swipeEnd(event: TouchEvent | MouseEvent): void {
    this.swiping = false;
    if (this.usedTouch && event.type === 'mouseup') this.usedTouch = false;
  }

  // --- layout / navigation (webflow-slider.js N() and C()) ---

  private layout(): void {
    const slides = this.slides().map((s) => s.nativeElement);
    const mask = this.mask().nativeElement;
    const arrow = this.rightArrow().nativeElement;
    // Never compute pages from an unstyled page (e.g. a frame where the webflow sheet is not applied
    // yet): the full-width static arrow and slides would give one slide per page. The ResizeObserver
    // calls layout() again as soon as the styled sizes are in place.
    if (!slides.length || !isStyled(mask, arrow)) return;
    const maskWidth = mask.getBoundingClientRect().width;
    const edge = edgeOf(arrow);
    const widths = slides.map((el) => {
      const style = getComputedStyle(el);
      return (
        el.getBoundingClientRect().width +
        parseFloat(style.marginLeft) +
        parseFloat(style.marginRight)
      );
    });
    const measured = [maskWidth, edge, ...widths].join();
    if (measured === this.measured) return; // nothing changed: keep the current page and animation
    this.measured = measured;

    const limit = Math.max(0, maskWidth - edge);
    const anchors: Anchor[] = [{ els: [], x: 0, width: 0 }];
    let pageStart = 0;
    let total = 0;
    widths.forEach((width, i) => {
      if (total - pageStart > limit) {
        pageStart += maskWidth;
        anchors.push({ els: [], x: total, width: 0 });
      }
      total += width;
      const page = anchors[anchors.length - 1];
      page.width += width;
      page.els.push(i);
    });
    this.anchors = anchors;
    this.endX = total;
    this.pages.set(anchors.length);
    this.goTo(Math.min(this.current, anchors.length - 1), true);
  }

  private goTo(target: number, immediate = false): void {
    const anchors = this.anchors;
    if (!anchors.length) return;
    const { infinite, duration } = this.slider();
    const previous = this.current;
    let index = target;
    let wrap: { x: number; from: number; to: number } | null = null;
    if (index < 0) {
      index = anchors.length - 1;
      if (infinite) wrap = { x: -this.endX, from: 0, to: anchors[0].width };
    } else if (index >= anchors.length) {
      index = 0;
      const last = anchors[anchors.length - 1];
      if (infinite) wrap = { x: last.width, from: -last.x, to: -last.x - last.width };
    }
    this.current = index;
    this.index.set(index);
    this.shown.set(new Set(anchors[index].els));

    const slides = this.slides().map((s) => s.nativeElement);
    const from = this.offsetX;
    const to = (this.offsetX = -anchors[index].x);
    const place = (el: HTMLElement, x: number) => {
      el.style.transition = '';
      el.style.transform = `translateX(${x}px)`;
    };
    const move = (el: HTMLElement, x: number) => {
      el.style.transition = `transform ${duration}ms ease`;
      el.style.transform = `translateX(${x}px)`;
    };
    const reflow = () => void this.mask().nativeElement.offsetWidth;

    if (immediate) {
      slides.forEach((el) => place(el, to));
      return;
    }
    if (index === previous) return;
    this.liveText.set(`Slide ${index + 1} of ${anchors.length}.`);
    if (infinite && wrap?.x) {
      // Wrapping around: the rest of the strip jumps to the other side and slides in, while the
      // slides of the page being left slide out.
      const leaving = new Set(anchors[previous]?.els ?? []);
      slides.forEach((el, i) => place(el, leaving.has(i) ? wrap.from : wrap.x));
      reflow();
      slides.forEach((el, i) => move(el, leaving.has(i) ? wrap.to : to));
      this.shifted = leaving;
      return;
    }
    if (infinite && this.shifted) {
      const shifted = this.shifted;
      slides.forEach((el, i) => shifted.has(i) && place(el, from));
      this.shifted = null;
      reflow();
    }
    slides.forEach((el) => move(el, to));
  }
}

/**
 * True once the Webflow framework CSS applies to the slider: it makes the mask `nowrap` and the
 * arrows absolutely positioned. Without it every measurement would be of the unstyled page.
 */
function isStyled(mask: HTMLElement, arrow: HTMLElement): boolean {
  return (
    getComputedStyle(mask).whiteSpace === 'nowrap' &&
    getComputedStyle(arrow).position === 'absolute'
  );
}

/**
 * Webflow's `config.edge`: right arrow width + 40px (100 without an arrow width). Read from the
 * computed style, which gives the CSS width (40px) even while the arrow is hidden on the last page,
 * like jQuery's `.width()` that Webflow uses; the element box would be 0 then.
 */
function edgeOf(arrow: HTMLElement): number {
  const width = parseFloat(getComputedStyle(arrow).width) || arrow.getBoundingClientRect().width;
  return width ? width + 40 : 100;
}
