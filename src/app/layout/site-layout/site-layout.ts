import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteShell } from '../../core/models';
import { StyleWorldService } from '../../core/style-world.service';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/** Shell of pages that have no content of their own (the 404 page), as captured on justlife.com. */
function defaultShell(url: string): SiteShell {
  return {
    locale: /^\/en-SA(\/|$|\?|#)/.test(url) ? 'en-SA' : 'en-AE',
    wrapperClass: 'en lang-all app-layout main-wrapper',
    navbarClass: 'navbar',
    footer: { desktopOnly: false, servicesTitle: 'Services', serviceAreas: null },
  };
}

/** Layout of the main site: navbar, page, footer (the Nuxt app's default layout). */
@Component({
  selector: 'app-site-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './site-layout.html',
  styleUrl: './site-layout.css',
})
export class SiteLayout {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly styles = inject(StyleWorldService);

  /** Navbar/footer settings of the current page. */
  protected readonly shell = signal<SiteShell>(this.currentShell());
  protected readonly ready = computed(() => this.styles.active() === 'site');

  constructor() {
    void this.styles.activate('site');
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.shell.set(this.currentShell()));
  }

  private currentShell(): SiteShell {
    let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const content = route.data['content'] as { shell?: SiteShell } | undefined;
    // The 404 page renders under an internal URL; its locale comes from the address bar.
    return content?.shell ?? defaultShell(this.location.path());
  }
}
