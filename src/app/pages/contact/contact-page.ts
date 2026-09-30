import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { ContentLinks } from '../../shared/content-links.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { StaticShell } from '../static-shell/static-shell';
import { ContactContent } from './contact-page.model';

/** Contact page: rich text in the static layout (UAE) or hero image + contact details (KSA). */
@Component({
  selector: 'app-contact-page',
  imports: [StaticShell, AppLink, ContentLinks, SafeHtmlPipe],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  readonly content = input.required<ContactContent>();

  protected readonly rich = computed(() => {
    const c = this.content();
    return c.layout === 'content' ? c : null;
  });
  protected readonly hero = computed(() => {
    const c = this.content();
    return c.layout === 'hero' ? c : null;
  });
}
