import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { filterPlaces, locateNearestCity, Place } from '../../core/location-search';
import { Locale } from '../../core/models';
import { matchesQuery, SiteSearch } from '../../core/site-search';
import { AppLink } from '../../shared/app-link.directive';
import { HomeCommon, HomePageContent, ServiceCatalog } from './home-page.model';
import { HomeSlider } from './home-slider';

/**
 * Home page ('/', '/en-AE', '/en-SA') and city pages ('/en-AE/dubai', …): the Nuxt "index"
 * template (scope 4a952506).
 *
 * The location search matches the areas of the cities this app has pages for and opens that
 * city. City pages' service lists came from the live API (the saved pages only have skeletons);
 * they are rendered from the static catalog, and the navbar service search filters that list.
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
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class HomePage {
  private readonly router = inject(Router);
  private readonly siteSearch = inject(SiteSearch);

  readonly content = input.required<HomePageContent>();
  /** Sections shared by all home and city pages; null when they could not be loaded. */
  readonly common = input<HomeCommon | null>(null);
  /** City pages' shortcut and service lists; null on home pages. */
  readonly catalog = input<ServiceCatalog | null>(null);

  // ---- location search ----

  /** Typed search term; cleared when another home/city page is shown. */
  protected readonly searchTerm = linkedSignal<HomePageContent, string>({
    source: this.content,
    computation: () => '',
  });
  /** Plain signal: a linked one reset whenever the page input was re-read, which hid the list. */
  protected readonly searchFocused = signal(false);
  private readonly locationBox = viewChild<ElementRef<HTMLElement>>('locationBox');
  /** Set when "Set my location" cannot read the browser location. */
  protected readonly locateError = signal(false);
  protected readonly showSearchResults = computed(
    () => this.searchFocused() && (this.searchTerm().trim().length > 0 || this.locateError()),
  );
  protected readonly locationResults = computed(() =>
    filterPlaces(this.searchTerm(), this.locale()),
  );

  /** Navbar service query; filters the city page's shortcut row and service cards. */
  protected readonly serviceQuery = this.siteSearch.serviceQuery;
  protected readonly shortcuts = computed(() =>
    (this.catalog()?.shortcuts ?? []).filter((item) => matchesQuery(item.text, this.serviceQuery())),
  );
  protected readonly services = computed(() =>
    (this.catalog()?.services ?? []).filter((item) => matchesQuery(item.text, this.serviceQuery())),
  );
  protected readonly serviceSearchMiss = computed(
    () =>
      this.serviceQuery().trim().length > 0 &&
      this.shortcuts().length === 0 &&
      this.services().length === 0 &&
      (this.catalog()?.services.length ?? 0) > 0,
  );

  /** UAE home (`/` and `/en-AE`) searches UAE areas; the KSA home searches KSA areas. */
  private locale(): Locale {
    return this.router.url.startsWith('/en-SA') ? 'en-SA' : 'en-AE';
  }

  protected onSearchInput(value: string): void {
    this.locateError.set(false);
    this.searchFocused.set(true);
    this.searchTerm.set(value);
  }

  /** Close the list when the click lands outside the search box. */
  protected onDocumentClick(event: MouseEvent): void {
    const box = this.locationBox()?.nativeElement;
    const target = event.target as Node | null;
    if (box && target && !box.contains(target)) this.searchFocused.set(false);
  }

  protected clearSearch(input: HTMLInputElement): void {
    this.locateError.set(false);
    this.searchTerm.set('');
    input.value = '';
    input.focus();
  }

  protected openPlace(event: MouseEvent, place: Place): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.searchFocused.set(false);
    void this.router.navigateByUrl(place.href);
  }

  protected openFirstPlace(): void {
    const place = this.locationResults()[0];
    if (place) void this.router.navigateByUrl(place.href);
  }

  protected async locate(): Promise<void> {
    this.locateError.set(false);
    this.searchFocused.set(true);
    const place = await locateNearestCity(this.locale());
    if (!place) {
      this.locateError.set(true);
      return;
    }
    void this.router.navigateByUrl(place.href);
  }
}
