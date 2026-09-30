import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentLinks } from '../../shared/content-links.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { StaticShell } from '../static-shell/static-shell';
import { LegalContent } from './legal-page.model';

/** Privacy policy and terms of use: a rich-text document in the static layout. */
@Component({
  selector: 'app-legal-page',
  imports: [StaticShell, ContentLinks, SafeHtmlPipe],
  template: `
    @let c = content();
    <app-static-shell [title]="c.title" [crumb]="c.crumb">
      <div class="content has-text-black87" appContentLinks [innerHTML]="c.html | safeHtml"></div>
    </app-static-shell>
  `,
  styleUrl: './legal-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPage {
  readonly content = input.required<LegalContent>();
}
