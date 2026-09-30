import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ContentLinks } from '../../shared/content-links.directive';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { FaqItem, WfImage } from '../cat-grooming-page.model';

/** Webflow easings used by the original interactions ("outQuad", "inQuad"). */
const OUT_QUAD = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const IN_QUAD = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
const DURATION = 200;

let nextId = 0;

/**
 * One FAQ entry. Re-implements the page's Webflow interactions "Accordion Open 2" / "Accordion Close 2"
 * (IX2, first click / second click on `.accordion-item-trigger-2`): the answer starts collapsed
 * (height 0), opens to its natural height, the chevron turns 180deg and the heading colour changes.
 * The host is the original `div.accordion-item-2` element.
 */
@Component({
  selector: 'div[appWfAccordionItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContentLinks, SafeHtmlPipe],
  templateUrl: './wf-accordion-item.html',
  styleUrl: './wf-accordion-item.css',
})
export class WfAccordionItem {
  readonly item = input.required<FaqItem>({ alias: 'appWfAccordionItem' });
  readonly icon = input.required<WfImage>();

  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly contentId = `faq-answer-${nextId++}`;
  /** 'initial' until first clicked: the heading keeps its stylesheet colour until then. */
  private readonly state = signal<'initial' | 'open' | 'closed'>('initial');
  protected readonly open = computed(() => this.state() === 'open');
  protected readonly headingColor = computed(() => {
    const state = this.state();
    return state === 'open' ? 'rgb(0, 44, 244)' : state === 'closed' ? 'rgb(0, 0, 0)' : null;
  });
  protected readonly transition = computed(
    () => `${DURATION}ms ${this.open() ? OUT_QUAD : IN_QUAD}`,
  );

  protected toggle(): void {
    const el = this.content().nativeElement;
    if (this.open()) {
      el.style.transition = 'none';
      el.style.height = `${el.scrollHeight}px`;
      void el.offsetHeight;
      el.style.transition = `height ${DURATION}ms ${IN_QUAD}`;
      el.style.height = '0px';
      this.state.set('closed');
    } else {
      el.style.transition = `height ${DURATION}ms ${OUT_QUAD}`;
      el.style.height = `${el.scrollHeight}px`;
      this.state.set('open');
    }
  }

  protected onKey(event: Event): void {
    event.preventDefault();
    this.toggle();
  }

  /** Once opened, let the answer follow its content (e.g. when the viewport is resized). */
  protected onTransitionEnd(event: TransitionEvent): void {
    const el = this.content().nativeElement;
    if (event.target === el && event.propertyName === 'height' && this.open()) {
      el.style.transition = '';
      el.style.height = 'auto';
    }
  }
}
