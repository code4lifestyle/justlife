import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { navigateOnPlainClick } from '../../shared/links';
import { BlogData, blogImage, blogPostUrl } from '../blog-data';

/** Image card with the title over the picture (the Next.js `ImageCard`, used by the suggestion slider). */
@Component({
  selector: 'a[appImageCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ImageCard_imageCardContainer__LnRGP',
    target: '_self',
    '[attr.href]': 'href()',
    '(click)': 'onClick($event)',
  },
  template: `
    @if (article(); as a) {
      <img
        alt="image-card"
        loading="lazy"
        width="302"
        height="200"
        decoding="async"
        style="color:transparent;aspect-ratio:1.51"
        [src]="image()"
      />
      <p class="ImageCard_imageCardTitle__TLc7A text-head-3">{{ a.title }}</p>
    }
  `,
})
export class ImageCard {
  private readonly router = inject(Router);
  private readonly data = inject(BlogData);

  readonly slug = input.required<string>();

  protected readonly article = computed(() => this.data.articles()?.[this.slug()]);
  protected readonly href = computed(() => blogPostUrl(this.slug()));
  protected readonly image = computed(() => {
    const a = this.article();
    return a ? blogImage(a.image, 380) : '';
  });

  protected onClick(event: MouseEvent): void {
    navigateOnPlainClick(event, this.router, this.href());
  }
}
