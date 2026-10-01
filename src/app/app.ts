import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { PageMeta } from './core/models';
import { SeoService } from './core/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    const router = inject(Router);
    const seo = inject(SeoService);
    // Every page's resolved content carries its original <head> metadata.
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        let route: ActivatedRouteSnapshot = router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        const content = route.data['content'] as
          | { meta?: PageMeta; shell?: { locale?: string } }
          | undefined;
        seo.apply(content?.meta, content?.shell?.locale);
      });
  }
}
