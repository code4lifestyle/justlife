import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { BlogData } from '../blog-data';

/** Blue "Tired of juggling home tasks? / Download Justlife" card inside the featured article grids. */
@Component({
  selector: 'div[appJustlifeCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLink],
  host: { class: 'JustlifeCard_justlifeCardContainer__MmFeH' },
  styles: `
    .JustlifeCard_justlifeCardImage__2Io8d {
      height: auto;
      object-fit: contain;
      width: 10rem;
    }
  `,
  template: `
    @if (data.layout()?.justlifeCard; as card) {
      <img
        alt="Aljory Cleaning Services"
        loading="lazy"
        width="160"
        height="90"
        decoding="async"
        class="JustlifeCard_justlifeCardImage__2Io8d"
        style="color:transparent;aspect-ratio:1.776;object-fit:contain;height:auto"
        [src]="card.logo"
      />
      <p class="JustlifeCard_justlifeCardTitle__5GtrP text-head-2">{{ card.title }}</p>
      <a class="JustlifeCard_justlifeCardButton__K6SRM" [appLink]="card.href"
        ><p class="text-white g-inline-block">{{ card.button }}</p></a
      >
      <p class="text-subtitle-1">{{ card.subtitle }}</p>
    }
  `,
})
export class JustlifeCard {
  protected readonly data = inject(BlogData);
}
