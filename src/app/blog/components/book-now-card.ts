import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { BlogData } from '../blog-data';

/** "Need things sorted fast? … Book now" card of the post pages (opens the service checkout in a new tab). */
@Component({
  selector: 'div[appBookNowCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLink],
  host: { class: 'BookNowCard_bookNowCardContainer__P7nfG' },
  styles: `
    .BookNowCard_bookNowLogo__onpra {
      height: auto;
      object-fit: contain;
      width: 8.75rem;
    }
  `,
  template: `
    @if (data.layout()?.bookNowCard; as card) {
      <div class="BookNowCard_bookNowCardLogoWrapper__xLuMU">
        <img
          alt="Aljory Cleaning Services"
          loading="lazy"
          width="140"
          height="79"
          decoding="async"
          class="BookNowCard_bookNowLogo__onpra"
          style="color:transparent;aspect-ratio:1.776;object-fit:contain;height:auto"
          [src]="card.logo"
        />
      </div>
      <div class="BookNowCard_bookNowCardDescriptionWrapper__oTOKg">
        <p class="">{{ card.text }}</p>
      </div>
      <div class="BookNowCard_bookNowCardButtonWrapper__FmEn6">
        <a
          class="BookNowCard_bookNowButton__UxmTi text-body-1"
          [appLink]="href()"
          [newTab]="true"
          >{{ card.button }}</a
        >
      </div>
    }
  `,
})
export class BookNowCard {
  protected readonly data = inject(BlogData);

  /** Checkout route of the service the post is about (keeps its utm query). */
  readonly href = input.required<string>();
}
