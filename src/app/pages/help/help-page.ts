import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { StaticShell } from '../static-shell/static-shell';
import { HelpContent } from './help-page.model';

/**
 * Help center (my-account/help). On justlife.com the card was filled from the live help-center API
 * (the original page's HTML only held its loading skeleton, and there is no help-center data), so the
 * static app shows the page frame with the support links to the terms and the privacy policy.
 * With the help-center content gone the links are the whole card, so the card pads them evenly
 * (py_x3 plus the links' own padding) instead of keeping the original's top-only spacing (pt_x6 and a
 * margin that separated them from the content above).
 */
@Component({
  selector: 'app-help-page',
  imports: [StaticShell, AppLink],
  template: `
    @let c = content();
    <app-static-shell
      [title]="c.title"
      [crumb]="c.crumb"
      wrapperClass="layout-wrapper c-bg-background-secondary pb_x16 min-h-content sm_pt_x4"
      contentClass="_column content-wrapper"
      breadcrumbClass="breadcrumb-container sm_mb_x0 mb_x6"
      containerClass="content-container py_x3"
    >
      <div class="support-small-buttons">
        @for (link of c.supportLinks; track link.href) {
          <a class="support-small-button has-text-black38" [appLink]="link.href">
            <p class="helper-text-item">{{ link.text }}</p>
          </a>
        }
      </div>
    </app-static-shell>
  `,
  styleUrl: './help-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpPage {
  readonly content = input.required<HelpContent>();
}
