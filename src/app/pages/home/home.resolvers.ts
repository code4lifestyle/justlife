import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { ContentService } from '../../core/content.service';
import { HomeCommon, HomePageContent, ServiceCatalog } from './home-page.model';

/*
 * The home and city routes resolve these next to their page content, so HomePage renders complete
 * (the original's server-rendered markup had these sections, or skeletons of their size, from the
 * start); loading them after the page had rendered pushed the page down when they arrived. A failed
 * request only leaves its sections out; ContentService caches both files for the next page.
 */

/** Sections shared by every home and city page. */
const COMMON_PATH = 'content/home/common.json';

/** Reasons, Justlife Promise and app sections (`common` input of HomePage). */
export const homeCommonResolver: ResolveFn<HomeCommon | null> = () =>
  inject(ContentService)
    .json<HomeCommon>(COMMON_PATH)
    .pipe(catchError(() => of(null)));

/**
 * The city page's shortcut and service lists (`catalog` input of HomePage); null on home pages and
 * on city pages without a catalog. Reads the page JSON through the same cached request as
 * `pageResolver`, so the page is still fetched once.
 */
export const cityCatalogResolver: ResolveFn<ServiceCatalog | null> = (_route, state) => {
  const contentService = inject(ContentService);
  return contentService.page<HomePageContent>(state.url).pipe(
    map((page) => page.city?.catalog ?? null),
    switchMap((path) => (path ? contentService.json<ServiceCatalog>(path) : of(null))),
    catchError(() => of(null)),
  );
};
