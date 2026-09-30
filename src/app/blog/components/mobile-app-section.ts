import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlogData } from '../blog-data';

/** "About us" section with the phone mock-up at the bottom of every blog page. */
@Component({
  selector: 'div[appMobileAppSection]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'MobileAppSection_mobileAppSectionContainer__ixyh_' },
  template: `
    @if (data.layout()?.mobileApp; as section) {
      <div class="MobileAppSection_mobileAppSectionWrapper__HiYvt">
        <div class="MobileAppSection_mobileAppSectionTextWrapper__DmMLy">
          <p class="MobileAppSection_mobileAppSectionTitle__K78WT text-head-2">
            {{ section.title }}
          </p>
          <p class="">
            @for (line of section.lines; track $index) {
              @if (!$first) {
                <br /><br />
              }
              {{ line }}
            }
          </p>
        </div>
        <div class="MobileAppSection_mobileAppSectionImage__WwbGw">
          <img
            alt="mobile-apps"
            loading="lazy"
            width="395"
            height="450"
            decoding="async"
            class="MobileAppSection_mobileAppSectionImage__WwbGw"
            style="color:transparent;aspect-ratio:0.8777777777777778"
            [src]="section.image"
          />
        </div>
      </div>
    }
  `,
})
export class MobileAppSection {
  protected readonly data = inject(BlogData);
}
