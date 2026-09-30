import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { FooterData, Locale } from './models';
import { contentUrl } from './page-registry';

/** Loads the static JSON content extracted from the original site (served from `public/content`). */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<unknown>>();

  /** Content of the page served at `url` (a router URL such as "/en-AE/house-cleaning"). */
  page<T>(url: string): Observable<T> {
    return this.json<T>(contentUrl(url));
  }

  /** Locale-wide footer lists of the main site. */
  footer(locale: Locale): Observable<FooterData> {
    return this.json<FooterData>(`content/site/footer.${locale}.json`);
  }

  /** Any JSON file below `public/`, cached for the lifetime of the app. */
  json<T>(path: string): Observable<T> {
    let request = this.cache.get(path);
    if (!request) {
      request = this.http.get<T>(path).pipe(shareReplay(1));
      this.cache.set(path, request);
    }
    return request as Observable<T>;
  }
}
