import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { navigateOnPlainClick } from '../../shared/links';
import { BlogData, blogImage, blogPostUrl } from '../blog-data';

/**
 * Article card (the Next.js `BlogCard`): medium cards (image, title, description) in the featured grids,
 * small cards (image, title) in "Trending Stories". The host is the card's `<a>` so the grid CSS applies.
 *
 *   <a appBlogCard [slug]="slug" size="medium"></a>
 */
@Component({
  selector: 'a[appBlogCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'BlogCard_blogCarContainer__4mbWt',
    '[class.BlogCard_medium__eY9iQ]': "size() === 'medium'",
    '[class.BlogCard_small___ezqI]': "size() === 'small'",
    target: '_self',
    '[attr.href]': 'href()',
    '(click)': 'onClick($event)',
  },
  template: `
    @if (article(); as a) {
      <div class="BlogCard_blogCardImageWrapper__zvIpf">
        @if (size() === 'small') {
          <img
            alt="blog-image"
            loading="lazy"
            width="303"
            height="163"
            decoding="async"
            class="BlogCard_blogImage__70GAU BlogCard_small___ezqI"
            style="color:transparent;aspect-ratio:1.8588957055214723"
            [src]="image()"
          />
        } @else {
          <img
            alt="blog-image"
            loading="lazy"
            width="408"
            height="220"
            decoding="async"
            class="BlogCard_blogImage__70GAU BlogCard_medium__eY9iQ"
            style="color:transparent;aspect-ratio:1.8545454545454545"
            [src]="image()"
          />
        }
      </div>
      @if (size() === 'small') {
        <h3 class="text-head-4">{{ a.title }}</h3>
      } @else {
        <h3 class="BlogCard_blogCardTitle__F8eRV">{{ a.title }}</h3>
        <p class="BlogCard_blogCardDescription__P9zo5">{{ a.description }}</p>
      }
    }
  `,
})
export class BlogCard {
  private readonly router = inject(Router);
  private readonly data = inject(BlogData);

  readonly slug = input.required<string>();
  readonly size = input<'medium' | 'small'>('medium');

  protected readonly article = computed(() => this.data.articles()?.[this.slug()]);
  protected readonly href = computed(() => blogPostUrl(this.slug()));
  protected readonly image = computed(() => {
    const a = this.article();
    return a ? blogImage(a.image, this.size() === 'small' ? 380 : 680) : '';
  });

  protected onClick(event: MouseEvent): void {
    navigateOnPlainClick(event, this.router, this.href());
  }
}
