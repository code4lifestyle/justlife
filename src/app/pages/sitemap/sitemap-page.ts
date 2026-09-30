import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { StaticShell } from '../static-shell/static-shell';
import { SitemapContent } from './sitemap-page.model';

/**
 * Sitemap: titled two-column lists of links to the blog articles and service pages. The content JSON
 * lists only pages the app has; a section without links is not drawn.
 */
@Component({
  selector: 'app-sitemap-page',
  imports: [StaticShell, AppLink],
  template: `
    @let c = content();
    <app-static-shell
      [title]="c.title"
      [crumb]="c.crumb"
      containerClass="content-container px_x6 pt_x4 pb_x16"
    >
      @for (section of c.sections; track section.title) {
        @if (section.links.length) {
          <div>
            <h3 class="list-item-title">{{ section.title }}</h3>
            <ul class="list-items">
              @for (link of section.links; track $index) {
                <li>
                  <a [appLink]="link.href" [newTab]="link.newTab">{{ link.text }}</a>
                </li>
              }
            </ul>
          </div>
        }
      }
    </app-static-shell>
  `,
  styleUrl: './sitemap-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SitemapPage {
  readonly content = input.required<SitemapContent>();
}
