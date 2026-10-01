import { Locale } from './models';

/** An area the location search can match. Selecting it opens that city's page. */
export interface Place {
  name: string;
  /** City shown under the area name. */
  city: string;
  href: string;
  locale: Locale;
  /** Extra words that should match, e.g. "jlt" for Jumeirah Lake Towers. */
  aliases?: readonly string[];
  lat: number;
  lng: number;
}

const DUBAI = { city: 'Dubai', href: '/en-AE/dubai', locale: 'en-AE' as const };
const ABU_DHABI = { city: 'Abu Dhabi', href: '/en-AE/abu-dhabi', locale: 'en-AE' as const };
const SHARJAH = { city: 'Sharjah', href: '/en-AE/sharjah', locale: 'en-AE' as const };
const AJMAN = { city: 'Ajman', href: '/en-AE/ajman', locale: 'en-AE' as const };
const JEDDAH = { city: 'Jeddah', href: '/en-SA/jeddah', locale: 'en-SA' as const };
const RIYADH = { city: 'Riyadh', href: '/en-SA/riyadh', locale: 'en-SA' as const };

/** Areas of the cities this app already has pages for. */
export const PLACES: readonly Place[] = [
  { ...DUBAI, name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { ...DUBAI, name: 'Dubai Marina', lat: 25.0805, lng: 55.1403, aliases: ['marina'] },
  { ...DUBAI, name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, aliases: ['burj khalifa', 'downtown'] },
  { ...DUBAI, name: 'Jumeirah', lat: 25.2048, lng: 55.239, aliases: ['jumeira'] },
  { ...DUBAI, name: 'Business Bay', lat: 25.185, lng: 55.263 },
  { ...DUBAI, name: 'Deira', lat: 25.2697, lng: 55.3095 },
  { ...DUBAI, name: 'Bur Dubai', lat: 25.2532, lng: 55.2962 },
  { ...DUBAI, name: 'Al Barsha', lat: 25.1107, lng: 55.2005, aliases: ['barsha', 'mall of the emirates'] },
  { ...DUBAI, name: 'Jumeirah Lake Towers', lat: 25.0693, lng: 55.1416, aliases: ['jlt'] },
  { ...DUBAI, name: 'Palm Jumeirah', lat: 25.1124, lng: 55.139, aliases: ['palm'] },
  { ...DUBAI, name: 'Dubai Hills', lat: 25.104, lng: 55.245 },
  { ...DUBAI, name: 'Dubai Silicon Oasis', lat: 25.1242, lng: 55.3773, aliases: ['dso', 'silicon oasis'] },
  { ...DUBAI, name: 'International City', lat: 25.164, lng: 55.411 },
  { ...DUBAI, name: 'Jumeirah Village Circle', lat: 25.0602, lng: 55.2094, aliases: ['jvc'] },
  { ...DUBAI, name: 'Mirdif', lat: 25.2205, lng: 55.4211 },
  { ...DUBAI, name: 'Al Quoz', lat: 25.143, lng: 55.228, aliases: ['quoz'] },
  { ...DUBAI, name: 'DIFC', lat: 25.211, lng: 55.2803, aliases: ['dubai international financial centre'] },
  { ...DUBAI, name: 'Motor City', lat: 25.046, lng: 55.239 },

  { ...ABU_DHABI, name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
  { ...ABU_DHABI, name: 'Al Reem Island', lat: 24.493, lng: 54.407, aliases: ['reem'] },
  { ...ABU_DHABI, name: 'Khalifa City', lat: 24.4206, lng: 54.576 },
  { ...ABU_DHABI, name: 'Yas Island', lat: 24.488, lng: 54.608, aliases: ['yas'] },
  { ...ABU_DHABI, name: 'Saadiyat Island', lat: 24.546, lng: 54.434, aliases: ['saadiyat'] },
  { ...ABU_DHABI, name: 'Al Khalidiyah', lat: 24.473, lng: 54.345, aliases: ['khalidiyah'] },
  { ...ABU_DHABI, name: 'Corniche', lat: 24.476, lng: 54.332 },
  { ...ABU_DHABI, name: 'Al Raha Beach', lat: 24.443, lng: 54.576, aliases: ['raha'] },
  { ...ABU_DHABI, name: 'Mussafah', lat: 24.35, lng: 54.508 },

  { ...SHARJAH, name: 'Sharjah', lat: 25.3463, lng: 55.4209 },
  { ...SHARJAH, name: 'Al Majaz', lat: 25.324, lng: 55.386, aliases: ['majaz'] },
  { ...SHARJAH, name: 'Al Nahda', lat: 25.303, lng: 55.373, aliases: ['nahda'] },
  { ...SHARJAH, name: 'Al Khan', lat: 25.331, lng: 55.36, aliases: ['khan'] },
  { ...SHARJAH, name: 'Muwaileh', lat: 25.307, lng: 55.447 },
  { ...SHARJAH, name: 'Al Taawun', lat: 25.317, lng: 55.372, aliases: ['taawun'] },

  { ...AJMAN, name: 'Ajman', lat: 25.4052, lng: 55.5136 },
  { ...AJMAN, name: 'Al Nuaimiya', lat: 25.392, lng: 55.456, aliases: ['nuaimiya'] },
  { ...AJMAN, name: 'Ajman Corniche', lat: 25.417, lng: 55.443 },
  { ...AJMAN, name: 'Al Rashidiya', lat: 25.388, lng: 55.47, aliases: ['rashidiya'] },

  { ...JEDDAH, name: 'Jeddah', lat: 21.4858, lng: 39.1925 },
  { ...JEDDAH, name: 'Al Hamra', lat: 21.52, lng: 39.164, aliases: ['hamra'] },
  { ...JEDDAH, name: 'Al Zahra', lat: 21.589, lng: 39.132, aliases: ['zahra'] },
  { ...JEDDAH, name: 'Obhur', lat: 21.74, lng: 39.12 },
  { ...JEDDAH, name: 'Al Balad', lat: 21.485, lng: 39.192, aliases: ['balad'] },
  { ...JEDDAH, name: 'Al Salamah', lat: 21.591, lng: 39.156, aliases: ['salamah'] },

  { ...RIYADH, name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { ...RIYADH, name: 'Al Olaya', lat: 24.691, lng: 46.685, aliases: ['olaya'] },
  { ...RIYADH, name: 'Al Malaz', lat: 24.662, lng: 46.728, aliases: ['malaz'] },
  { ...RIYADH, name: 'Al Nakheel', lat: 24.766, lng: 46.645, aliases: ['nakheel'] },
  { ...RIYADH, name: 'Diplomatic Quarter', lat: 24.687, lng: 46.623, aliases: ['dq'] },
  { ...RIYADH, name: 'Al Murabba', lat: 24.65, lng: 46.71, aliases: ['murabba'] },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Areas in `locale` whose name, city, or alias contains `query`. Closest name matches come first. */
export function filterPlaces(query: string, locale: Locale): Place[] {
  const q = normalize(query);
  if (!q) return [];
  return PLACES.filter((place) => place.locale === locale)
    .map((place) => {
      const name = normalize(place.name);
      const city = normalize(place.city);
      const alias = (place.aliases ?? []).find((item) => normalize(item).includes(q));
      if (!name.includes(q) && !city.includes(q) && !alias) return null;
      const score = name.startsWith(q) ? 0 : alias && normalize(alias).startsWith(q) ? 1 : name.includes(q) ? 2 : 3;
      return { place, score };
    })
    .filter((hit): hit is { place: Place; score: number } => hit !== null)
    .sort((a, b) => a.score - b.score || a.place.name.localeCompare(b.place.name))
    .slice(0, 8)
    .map((hit) => hit.place);
}

/** City centre nearest to a coordinate, used by "Set my location". Stays inside `locale` when given. */
export function nearestCity(lat: number, lng: number, locale?: Locale): Place {
  const cities = PLACES.filter(
    (place) => place.name === place.city && (!locale || place.locale === locale),
  );
  return cities.reduce((best, place) =>
    distance(lat, lng, place.lat, place.lng) < distance(lat, lng, best.lat, best.lng) ? place : best,
  );
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Resolves the nearest city, or null when the browser cannot provide a location. */
export function locateNearestCity(locale?: Locale): Promise<Place | null> {
  const geo = navigator.geolocation;
  if (!geo) return Promise.resolve(null);
  return new Promise((resolve) => {
    geo.getCurrentPosition(
      (position) =>
        resolve(nearestCity(position.coords.latitude, position.coords.longitude, locale)),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  });
}
