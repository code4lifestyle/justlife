import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { StyleWorldService } from '../core/style-world.service';
import { AppLink } from '../shared/app-link.directive';
import { ContentLinks } from '../shared/content-links.directive';
import { SafeHtmlPipe } from '../shared/safe-html.pipe';
import { CatGroomingContent } from './cat-grooming-page.model';
import { WfAccordionItem } from './wf-accordion-item/wf-accordion-item';
import { WfSlider } from './wf-slider/wf-slider';

/** Class of the original `<body class="body">`: the page's gradient background is set on it. */
const BODY_CLASS = 'body';

/**
 * justlife.com/cat-grooming: a standalone Webflow landing page with its own global CSS (the "webflow"
 * style world, src/styles/webflow). The page stays invisible until that stylesheet is active.
 * Webflow's JS features are re-implemented without jQuery: the FAQ accordion (WfAccordionItem) and
 * the "other services" slider (WfSlider).
 */
@Component({
  selector: 'app-cat-grooming-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppLink, ContentLinks, SafeHtmlPipe, WfAccordionItem, WfSlider],
  templateUrl: './cat-grooming-page.html',
  styleUrl: './cat-grooming-page.css',
  host: {
    '[style.visibility]': 'ready() ? null : "hidden"',
  },
})
export class CatGroomingPage {
  private readonly styles = inject(StyleWorldService);

  readonly content = input.required<CatGroomingContent>();

  protected readonly ready = computed(() => this.styles.active() === 'webflow');

  constructor() {
    void this.styles.activate('webflow');

    const document = inject(DOCUMENT);
    const body = document.body;
    body.classList.add(BODY_CLASS);
    inject(DestroyRef).onDestroy(() => body.classList.remove(BODY_CLASS));

    // The page's web fonts, loaded asynchronously like the original WebFont loader did. The sheet is
    // switched off with `media` when leaving the page (the blog defines its own "Poppins"); unlike
    // `disabled`, that keeps the parsed sheet, so coming back does not download it again.
    effect((onCleanup) => {
      const link = webFontsLink(document, this.content().fontsHref);
      link.media = 'all';
      onCleanup(() => (link.media = 'not all'));
    });

    // og:type / twitter:* tags of the original head (title, description, og:title... are set by SeoService).
    const meta = inject(Meta);
    effect((onCleanup) => {
      const tags = this.content().extraMeta;
      for (const tag of tags) meta.updateTag(tag, metaSelector(tag));
      onCleanup(() => tags.forEach((tag) => meta.removeTag(metaSelector(tag))));
    });
  }
}

function webFontsLink(document: Document, href: string): HTMLLinkElement {
  const existing = document.head.querySelector<HTMLLinkElement>('link[data-web-fonts]');
  if (existing?.getAttribute('href') === href) return existing;
  existing?.remove();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-web-fonts', '');
  document.head.appendChild(link);
  return link;
}

function metaSelector(tag: MetaDefinition): string {
  return tag.name ? `name="${tag.name}"` : `property="${tag.property}"`;
}
