import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { BlogData, blogImage, blogPostUrl } from '../blog-data';
import { BlogHomeContent } from '../blog.model';
import { BlogCard } from '../components/blog-card';
import { FeaturedSection } from '../components/featured-section';
import { MobileAppSection } from '../components/mobile-app-section';
import { BlogPagination } from '../components/pagination';
import { SuggestionSection } from '../components/suggestion-section';

/**
 * Blog home (`/blog/en-AE`, `?page=n`): banner article, featured articles, trending stories, the
 * paginated article grid (9 per page; with the reduced set of posts it is a single page, and any other
 * `?page` value shows page 1), the suggestion slider and the "About us" section. Sections whose posts are
 * all outside the app are not in the JSON and are not rendered; the card sections are also left out while
 * the shared article index is unavailable.
 */
@Component({
  selector: 'app-blog-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppLink,
    BlogCard,
    FeaturedSection,
    MobileAppSection,
    BlogPagination,
    SuggestionSection,
  ],
  templateUrl: './blog-home-page.html',
  styleUrl: './blog-home-page.css',
})
export class BlogHomePage {
  protected readonly data = inject(BlogData);

  readonly content = input.required<BlogHomeContent>();
  /** `?page=n` query parameter. */
  readonly page = input<string>();

  protected readonly total = computed(() => this.content().pages.length);
  /** Current grid page; anything that is not a valid page number shows the first page. */
  protected readonly current = computed(() => {
    const n = Number(this.page() ?? 1);
    return Number.isInteger(n) && n >= 1 && n <= this.total() ? n : 1;
  });
  protected readonly grid = computed(() => this.cards(this.content().pages[this.current() - 1]));
  protected readonly featured = computed(() => this.cards(this.content().featured));
  protected readonly trending = computed(() => this.cards(this.content().trending));
  protected readonly suggestions = computed(() => this.cards(this.content().suggestions));
  protected readonly banner = computed(() => {
    const slug = this.content().banner;
    const article = slug ? this.data.articles()?.[slug] : undefined;
    return slug && article
      ? { href: blogPostUrl(slug), title: article.title, image: blogImage(article.image, 680) }
      : undefined;
  });

  /** Slugs of a card section; none while the article index is unavailable (its cards would be empty). */
  private cards(slugs: string[] | undefined): string[] {
    return this.data.articles() ? (slugs ?? []) : [];
  }
}
