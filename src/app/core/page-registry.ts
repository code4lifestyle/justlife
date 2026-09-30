import registry from './page-registry.json';
import { PageType } from './models';

const pages = registry as Record<string, PageType>;

/** Normalises a router URL ("/en-AE/x/?a=1#b") to a registry key ("/en-AE/x"). */
export function routeKey(url: string): string {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

/** Page type served at `url`, or undefined when the app has no such page. */
export function pageTypeOf(url: string): PageType | undefined {
  return pages[routeKey(url)];
}

/** Public path of the JSON content file for a page, relative to the app base href. */
export function contentUrl(url: string): string {
  const key = routeKey(url);
  return `content/pages/${key === '/' ? 'index' : key.slice(1)}.json`;
}

export function hasPage(url: string): boolean {
  return pageTypeOf(url) !== undefined;
}
