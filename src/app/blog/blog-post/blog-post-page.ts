import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AppLink } from '../../shared/app-link.directive';
import { ContentLinks } from '../../shared/content-links.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { BLOG_HOME, BLOG_ICONS, BlogData, blogImage, blogPostUrl } from '../blog-data';
import { BlogPostContent } from '../blog.model';
import { BookNowCard } from '../components/book-now-card';
import { FeaturedSection } from '../components/featured-section';
import { MobileAppSection } from '../components/mobile-app-section';
import { SuggestionSection } from '../components/suggestion-section';

/**
 * Blog article (`/blog/en-AE/<slug>`): breadcrumb, highlight (title, description, book-now card, image),
 * article HTML, related articles, optional suggestion slider, the "Service Areas" map and "About us".
 */
@Component({
  selector: 'app-blog-post-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AppLink,
    ContentLinks,
    SafeHtmlPipe,
    BookNowCard,
    FeaturedSection,
    MobileAppSection,
    SuggestionSection,
  ],
  templateUrl: './blog-post-page.html',
  styles: ':host { display: block; }',
})
export class BlogPostPage {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly data = inject(BlogData);
  protected readonly icons = BLOG_ICONS;
  protected readonly blogHome = BLOG_HOME;

  readonly content = input.required<BlogPostContent>();
  /** `:slug` route parameter. */
  readonly slug = input.required<string>();

  protected readonly selfUrl = computed(() => blogPostUrl(this.slug()));
  protected readonly image = computed(() => blogImage(this.content().image, 680));
  /**
   * Related articles / suggestions (omitted from the JSON when none of them is part of the app; not shown
   * while the shared article index is unavailable, as their cards would be empty).
   */
  protected readonly featured = computed(() =>
    this.data.articles() ? (this.content().featured ?? []) : [],
  );
  protected readonly suggestions = computed(() =>
    this.data.articles() ? (this.content().suggestions ?? []) : [],
  );
  /** The Google Maps embed url of the layout data (a fixed, trusted url extracted from the original). */
  protected readonly mapSrc = computed(() => {
    const src = this.data.layout()?.map.src;
    return src ? this.sanitizer.bypassSecurityTrustResourceUrl(src) : null;
  });
}
