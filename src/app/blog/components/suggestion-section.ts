import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { BLOG_ICONS } from '../blog-data';
import { ImageCard } from './image-card';

/**
 * "What services can we help you with?" horizontal slider (native scroll-snap). Like the Next.js
 * `SliderButtons`, the prev/next buttons only appear when the slider overflows (from 768px up; phones
 * swipe) and step one item at a time.
 * Kept as a faithful, data-driven port: the arrows render once the `suggestions` cards overflow the slider.
 */
@Component({
  selector: 'div[appSuggestionSection]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageCard],
  host: {
    class: 'SuggestionSection_suggestionContainer__m2y4U',
    '(window:resize)': 'measure()',
  },
  template: `
    <div class="g-row g-align-center g-justify-between">
      <h2 class="g-inline-block">What services can we help you with?</h2>
      @if (overflows()) {
        <div class="Slider_sliderButtonGroupContainer__w_RNU">
          <button
            id="sliderPrevButton"
            class="Button_button__VVYkM Button_outlined__rysMo IconButton_iconButtonContainer__0pPxi"
            [disabled]="atStart()"
            (click)="step(-1)"
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
          <button
            id="sliderNextButton"
            class="Button_button__VVYkM Button_outlined__rysMo IconButton_iconButtonContainer__0pPxi"
            [disabled]="atEnd()"
            (click)="step(1)"
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
        </div>
      }
    </div>
    <div class="Slider_sliderContainer__mn0vg">
      <div
        #slider
        id="suggestion-slider"
        class="Slider_sliderWrapper__KxXb7 SuggestionSection_suggestionSlider__RJOZh"
        (scroll)="measure()"
      >
        @for (slug of slugs(); track $index) {
          <div class="Slider_sliderItem__SHZvr"><a appImageCard [slug]="slug"></a></div>
        }
      </div>
    </div>
  `,
})
export class SuggestionSection {
  readonly slugs = input.required<string[]>();

  protected readonly icons = BLOG_ICONS;
  private readonly slider = viewChild.required<ElementRef<HTMLElement>>('slider');
  private readonly sizes = signal({ scrollLeft: 0, scrollWidth: 0, clientWidth: 0 });

  protected readonly overflows = computed(
    () => this.sizes().scrollWidth > this.sizes().clientWidth,
  );
  protected readonly atStart = computed(() => this.sizes().scrollLeft <= 0);
  protected readonly atEnd = computed(() => {
    const s = this.sizes();
    return s.scrollLeft + s.clientWidth >= s.scrollWidth;
  });

  constructor() {
    // Card images load lazily, so measure again once they had a chance to lay out.
    afterNextRender(() => {
      this.measure();
      setTimeout(() => this.measure(), 500);
    });
  }

  protected measure(): void {
    const el = this.slider().nativeElement;
    this.sizes.set({
      scrollLeft: el.scrollLeft,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    });
  }

  /** Scrolls to the next item whose start is past the current position, or back to the previous one. */
  protected step(direction: 1 | -1): void {
    const el = this.slider().nativeElement;
    const items = Array.from(el.children) as HTMLElement[];
    const pos = el.scrollLeft;
    let left: number;
    if (direction > 0) {
      const next = items.find((item) => item.offsetLeft > pos) ?? items[0];
      left = next ? next.offsetLeft : pos;
    } else {
      const previous = items.filter((item) => item.offsetLeft < pos).pop();
      left = previous ? previous.offsetLeft : 0;
    }
    el.scrollTo({ left });
  }
}
