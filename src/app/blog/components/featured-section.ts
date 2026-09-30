import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BlogCard } from './blog-card';
import { JustlifeCard } from './justlife-card';

/** The Justlife card comes after the fourth article card. */
const JUSTLIFE_CARD_INDEX = 4;

/**
 * "Featured Articles" grid (blog home and the related articles of a post): medium cards with the
 * Justlife download card after the fourth one, as the Next.js `FeaturedSection` rendered it (after the
 * last card when there are fewer than four).
 */
@Component({
  selector: 'div[appFeaturedSection]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogCard, JustlifeCard],
  host: { class: 'FeaturedSection_featuredContainer__8U5Xt' },
  template: `
    <h2 class="">Featured Articles</h2>
    <div class="FeaturedSection_blogCardWrapper__mrozQ">
      @for (slug of before(); track $index) {
        <a appBlogCard [slug]="slug" size="medium"></a>
      }
      <div appJustlifeCard></div>
      @for (slug of after(); track $index) {
        <a appBlogCard [slug]="slug" size="medium"></a>
      }
    </div>
  `,
})
export class FeaturedSection {
  readonly slugs = input.required<string[]>();

  protected readonly before = computed(() => this.slugs().slice(0, JUSTLIFE_CARD_INDEX));
  protected readonly after = computed(() => this.slugs().slice(JUSTLIFE_CARD_INDEX));
}
