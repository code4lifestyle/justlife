import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';

/** "Download our Super app" banner content (FAQ pages). */
export interface AppDownloaderContent {
  badge: string;
  title: string;
  subtitle: string;
  apps: { href: string; img: string; alt: string }[];
  image: { src: string; alt: string };
}

/**
 * The mobile-app-downloader section shown below the FAQ card. Its styles are the global atoms
 * (`.mobile-app-downloader`, `.section-title-wrapper`); the host element is the section itself.
 * The phone image loads eagerly: on a short FAQ (en-SA) the section is in the first viewport and that
 * image is the page's largest contentful paint, which lazy loading would delay.
 */
@Component({
  selector: 'div[appAppDownloader]',
  imports: [AppLink],
  host: { class: 'mobile-app-downloader container en sm_bg_white' },
  template: `
    <div class="left-content">
      <div class="section-title-wrapper dark left">
        <span class="section-badge-text">{{ data().badge }}</span>
        <p class="dark section-title">{{ data().title }}</p>
        <p class="section-subtitle">{{ data().subtitle }}</p>
      </div>
      <div class="app-icons">
        @for (app of data().apps; track $index) {
          <a [appLink]="app.href"
            ><img [alt]="app.alt" height="40" loading="lazy" [src]="app.img" width="125"
          /></a>
        }
      </div>
    </div>
    <div class="right-content">
      <img [alt]="data().image.alt" height="332" [src]="data().image.src" width="395" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDownloader {
  readonly data = input.required<AppDownloaderContent>({ alias: 'appAppDownloader' });
}
