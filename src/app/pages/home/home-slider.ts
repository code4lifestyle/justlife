import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Horizontal slider of the Nuxt site's "ServiceCardSlider": a scrollable row with round
 * previous/next buttons on desktop that appear only while there is more content in that direction.
 *
 *   <app-home-slider><div class="shortcuts">…</div></app-home-slider>
 */
@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.html',
  styleUrl: './home-slider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSlider {
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly chevron =
    'https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/chevron-gray-right.svg';
  protected readonly canScrollBack = signal(false);
  protected readonly canScrollNext = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.content().nativeElement;
      this.updateArrows();
      // Re-check on resize and when the projected items change (the original used a MutationObserver).
      const resize = new ResizeObserver(() => this.updateArrows());
      resize.observe(el);
      const mutation = new MutationObserver(() => this.updateArrows());
      mutation.observe(el, { childList: true, subtree: true });
      destroyRef.onDestroy(() => {
        resize.disconnect();
        mutation.disconnect();
      });
    });
  }

  protected updateArrows(): void {
    const el = this.content().nativeElement;
    this.canScrollBack.set(el.scrollLeft > 1);
    this.canScrollNext.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  /** Scrolls by one visible width, like the original. */
  protected move(next: boolean): void {
    const el = this.content().nativeElement;
    el.scrollLeft += (next ? 1 : -1) * el.clientWidth;
  }
}
