import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Link } from '../../core/models';
import { AppLink } from '../../shared/app-link.directive';

/**
 * Layout shared by the FAQ, contact, legal, sitemap and help pages (the Nuxt layout-wrapper +
 * breadcrumb + content-container components): a centred column with the breadcrumb link, the page
 * title and a white card holding the projected page content.
 *
 *   <app-static-shell [title]="c.title" [crumb]="c.crumb">…card content…</app-static-shell>
 *
 * Elements marked `staticShellAfter` are projected below the card (FAQ's app downloader).
 * The class inputs default to the most common variant; pages override them with their original classes.
 */
@Component({
  selector: 'app-static-shell',
  imports: [AppLink],
  templateUrl: './static-shell.html',
  styleUrl: './static-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticShell {
  readonly title = input.required<string>();
  /** Breadcrumb link shown above the title on desktop and below it on touch devices ("Home"). */
  readonly crumb = input.required<Link>();

  readonly wrapperClass = input(
    'layout-wrapper c-bg-background-secondary full-height c-min-height-100 pb_x16',
  );
  readonly contentClass = input('full-size c-min-height-100 full-height content-wrapper');
  readonly breadcrumbClass = input(
    'breadcrumb-container mb_x6 md_mb_x0 md_pt_x4 sm_mb_x0 sm_pt_x4 sm_bg_white',
  );
  readonly containerClass = input('content-container pb_x16');
}
