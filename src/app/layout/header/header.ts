import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { Locale, PageType } from '../../core/models';
import { hasPage, pageTypeOf, routeKey } from '../../core/page-registry';

const STATIC = 'https://deax38zvkau9d.cloudfront.net/prod/assets/static/';

/** The Justlife app (sign-up / log-in only works there: the website's login needs the live backend). */
const APP_URL = 'https://cutt.ly/JMApp-Website';

interface Country {
  locale: Locale;
  id: string;
  name: string;
  flag: string;
}

const COUNTRIES: readonly Country[] = [
  {
    locale: 'en-AE',
    id: 'dropdown-country-ae',
    name: 'United Arab Emirates',
    flag: `${STATIC}ae.svg`,
  },
  { locale: 'en-SA', id: 'dropdown-country-sa', name: 'Saudi Arabia', flag: `${STATIC}sa.svg` },
];

/**
 * Pages whose country switch leads to the same page of the other country (as on justlife.com);
 * everywhere else it leads to the country's home page.
 */
const SAME_PAGE_TYPES: ReadonlySet<PageType> = new Set<PageType>([
  'contact',
  'faq',
  'legal',
  'sitemap',
  'help',
  'checkout',
]);

/**
 * `nav#main-navbar` of the main site (Nuxt navbar, scopes becff996 country dropdown and d44d51ff
 * user dropdown; the navbar's own rules are global in navbar.css). The Arabic language switch of
 * the original is intentionally not rendered (English-only build).
 *
 * The dropdowns close on an outside click, on Escape, on navigation and when keyboard focus
 * leaves them. The location search of the city pages needed Google Maps and Justlife's backend:
 * like the home page's search, typing shows the original "nothing found" state.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeDropdowns()',
  },
})
export class Header {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  readonly locale = input.required<Locale>();
  readonly navbarClass = input.required<string>();

  protected readonly countries = COUNTRIES;
  protected readonly logo = `${STATIC}svgs/jl-logo.svg`;
  protected readonly personIcon = `${STATIC}svgs/person.svg`;
  protected readonly hamburgerIcon = `${STATIC}svgs/hamburger-menu.svg`;
  protected readonly helpIcon = `${STATIC}svgs/question-mark-outlined.svg`;
  protected readonly appUrl = APP_URL;
  protected readonly androidBadge = `${STATIC}download-app-android%402x.jpg?f=webp`;
  protected readonly iosBadge = `${STATIC}download-app-ios%402x.jpg?f=webp`;
  protected readonly locationPin = `${STATIC}location-pin-blue.svg`;
  protected readonly locateMe = `${STATIC}LocateMe.svg`;
  protected readonly searchEmpty = `${STATIC}SearchEmptyState.svg`;

  protected readonly countryOpen = signal(false);
  protected readonly userOpen = signal(false);

  /** Typed location search term (city pages); cleared on every navigation. */
  protected readonly searchTerm = signal('');
  protected readonly searchFocused = signal(false);
  protected readonly showSearchResults = computed(
    () => this.searchFocused() && this.searchTerm().trim().length > 0,
  );

  private readonly countryWrapper = viewChild.required<ElementRef<HTMLElement>>('countryWrapper');
  private readonly userWrapper = viewChild.required<ElementRef<HTMLElement>>('userWrapper');

  /** Current router URL without query/fragment. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => routeKey(e.urlAfterRedirects)),
    ),
    { initialValue: routeKey(this.router.url) },
  );

  protected readonly home = computed(() => `/${this.locale()}`);
  protected readonly helpLink = computed(() => `/${this.locale()}/my-account/help`);
  protected readonly currentCountry = computed(
    () => COUNTRIES.find((c) => c.locale === this.locale()) ?? COUNTRIES[0],
  );

  /** Home-like pages have a centre slot; city pages show the location and service search in it. */
  protected readonly hasCenter = computed(() =>
    this.navbarClass().split(/\s+/).includes('is-home'),
  );
  protected readonly hasSearch = computed(
    () => this.hasCenter() && pageTypeOf(this.url()) === 'city',
  );

  /** Target of each country item for the current page. */
  protected readonly countryLinks = computed<Record<Locale, string>>(() => {
    const url = this.url();
    const type = pageTypeOf(url);
    const link = (target: Locale) => {
      if (type && SAME_PAGE_TYPES.has(type)) {
        const same = url.replace(/^\/en-(AE|SA)(?=\/|$)/, `/${target}`);
        if (hasPage(same)) return same;
      }
      return `/${target}`;
    };
    return { 'en-AE': link('en-AE'), 'en-SA': link('en-SA') };
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.closeDropdowns();
        // The header stays mounted from one city page to the next: start each page with an empty
        // search. (`searchFocused` follows the input's own focus/blur events, e.g. across Back.)
        this.searchTerm.set('');
      });
  }

  protected toggleCountry(): void {
    this.userOpen.set(false);
    this.countryOpen.update((open) => !open);
  }

  protected toggleUser(): void {
    this.countryOpen.set(false);
    this.userOpen.update((open) => !open);
  }

  protected closeDropdowns(): void {
    this.countryOpen.set(false);
    this.userOpen.set(false);
  }

  /** Keyboard focus moved out of a dropdown (Tab / Shift+Tab): close it. */
  protected onFocusOut(
    event: FocusEvent,
    wrapper: HTMLElement,
    open: WritableSignal<boolean>,
  ): void {
    // `relatedTarget` is null when a click lands on something that cannot take focus: the
    // document click handler decides about those.
    const next = event.relatedTarget as Node | null;
    if (next && !wrapper.contains(next)) open.set(false);
  }

  protected clearSearch(input: HTMLInputElement): void {
    this.searchTerm.set('');
    input.value = '';
    input.focus();
  }

  /** "Sign up or Log in": accounts live in the Justlife app. */
  protected openApp(): void {
    this.closeDropdowns();
    this.document.defaultView?.open(APP_URL, '_blank', 'noopener');
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.countryOpen() && !this.countryWrapper().nativeElement.contains(target)) {
      this.countryOpen.set(false);
    }
    if (this.userOpen() && !this.userWrapper().nativeElement.contains(target)) {
      this.userOpen.set(false);
    }
  }
}
