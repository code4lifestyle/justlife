import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { AppLink } from '../../shared/app-link.directive';
import { HomeCommon, HomePageContent, ServiceCatalog } from './home-page.model';
import { HomeSlider } from './home-slider';

/**
 * Home page ('/', '/en-AE', '/en-SA') and city pages ('/en-AE/dubai', …): the Nuxt "index"
 * template (scope 4a952506).
 *
 * The location search needed Google Maps and Justlife's backend: its box is kept as in the
 * original and behaves like a search without results (the original's empty state). The city
 * pages' service lists came from the live API (the saved pages only have skeletons); they are
 * rendered from the static catalog of the locale's service pages instead.
 *
 * `common` and `catalog` are resolved with the page content (home.resolvers.ts), so every section
 * is there on the first render.
 */
@Component({
  selector: 'app-home-page',
  imports: [AppLink, HomeSlider],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  readonly content = input.required<HomePageContent>();
  /** Sections shared by all home and city pages; null when they could not be loaded. */
  readonly common = input<HomeCommon | null>(null);
  /** City pages' shortcut and service lists; null on home pages. */
  readonly catalog = input<ServiceCatalog | null>(null);

  // ---- location search (no backend: typing shows the original "nothing found" state) ----

  /** Typed search term; cleared when another home/city page is shown. */
  protected readonly searchTerm = linkedSignal<HomePageContent, string>({
    source: this.content,
    computation: () => '',
  });
  protected readonly searchFocused = linkedSignal<HomePageContent, boolean>({
    source: this.content,
    computation: () => false,
  });
  protected readonly showSearchResults = computed(
    () => this.searchFocused() && this.searchTerm().trim().length > 0,
  );

  protected clearSearch(input: HTMLInputElement): void {
    this.searchTerm.set('');
    input.value = '';
    input.focus();
  }
}
