import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StyleWorldService } from '../../core/style-world.service';
import { AppLink } from '../../shared/app-link.directive';
import { BLOG_HOME, BlogData } from '../blog-data';

/**
 * Layout of the blog ("Cleanslate by Justlife"): black header with the logo, the page, and the blog
 * footer. It switches the app to the blog's global stylesheet and stays invisible until that sheet is loaded
 * and the shared blog data has been answered (a file that failed only drops its widgets; `BlogData` retries
 * it on the next blog navigation). (The original header's Arabic language chip is intentionally removed.)
 */
@Component({
  selector: 'app-blog-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, AppLink],
  templateUrl: './blog-layout.html',
  styles: ':host { display: block; }',
})
export class BlogLayout {
  private readonly styles = inject(StyleWorldService);
  protected readonly data = inject(BlogData);
  protected readonly home = BLOG_HOME;

  /** The blog's CSS is applied and its shared content answered: show the page. */
  protected readonly ready = computed(() => this.styles.active() === 'blog' && this.data.ready());

  constructor() {
    void this.styles.activate('blog');
  }
}
