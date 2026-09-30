import { CanMatchFn } from '@angular/router';
import { PageType } from './models';
import { pageTypeOf } from './page-registry';

/**
 * Route guard that matches only when the full URL path is a known page of one of `types`.
 * Several routes share the same shape (e.g. `:locale/:slug` is a service, city or legal page),
 * so the registry decides which component renders a URL; unknown URLs fall through to the 404 route.
 */
export function matchPage(...types: PageType[]): CanMatchFn {
  return (_route, segments) => {
    const type = pageTypeOf('/' + segments.map((s) => s.path).join('/'));
    return type !== undefined && types.includes(type);
  };
}
