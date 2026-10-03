import { Injectable, signal } from '@angular/core';

/** Services the city-page search can match. Names match `content/home/catalog.en-AE.json`. */
export const SEARCH_SERVICES: readonly string[] = [
  'Buildings Cleaning Services',
  'Floor & Wall Tiling Works',
  'Plumbing & Sanitary Installation',
  'False Ceiling & Light Partitions Installation',
  'Air-Conditioning, Ventilations & Air Filtration Systems Installation & Maintenance',
  'Carpentry & wood Flooring Works',
  'Wallpaper Fixing Works',
  'Plaster Works',
  'Painting Contracting',
  'Electrical Fittings & Fixtures Repairing & Maintenance',
  'Electromechanical Equipment Installation and Maintenance',
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** True when `query` is empty or appears in `text`. */
export function matchesQuery(text: string, query: string): boolean {
  const q = normalize(query);
  return !q || normalize(text).includes(q);
}

/** Service names that contain `query`. Empty when there is nothing to search for. */
export function filterServices(query: string): string[] {
  const q = normalize(query);
  if (!q) return [];
  return SEARCH_SERVICES.filter((name) => normalize(name).includes(q));
}

/** The city navbar's service query, shared with the page that renders the service cards. */
@Injectable({ providedIn: 'root' })
export class SiteSearch {
  readonly serviceQuery = signal('');
}
