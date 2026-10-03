/** A bookable service. Each one opens the same checkout screen as Justlife step 1. */
export interface BookingService {
  slug: string;
  name: string;
  /** Phrases search engines should associate with this service. */
  keywords: string;
  /** Question above the materials choice. Cleaning uses the live site's wording. */
  materialsQuestion: string;
}

export const BOOKING_SERVICES: readonly BookingService[] = [
  {
    slug: 'buildings-cleaning',
    name: 'Buildings Cleaning Services',
    keywords: 'building cleaning services, building cleaning company, commercial cleaning',
    materialsQuestion: 'Need cleaning materials?',
  },
  {
    slug: 'floor-wall-tiling',
    name: 'Floor & Wall Tiling Works',
    keywords: 'floor and wall tiling works, tiling contractor, wall tiling, floor tiling',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'plumbing-sanitary',
    name: 'Plumbing & Sanitary Installation',
    keywords: 'plumbing and sanitary installation, plumber, sanitary fittings',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'false-ceiling',
    name: 'False Ceiling & Light Partitions Installation',
    keywords: 'false ceiling installation, light partitions, gypsum ceiling',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'air-conditioning',
    name: 'Air-Conditioning, Ventilations & Air Filtration Systems Installation & Maintenance',
    keywords: 'air conditioning installation and maintenance, AC repair, ventilation, air filtration',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'carpentry-flooring',
    name: 'Carpentry & wood Flooring Works',
    keywords: 'carpentry and wood flooring, carpenter, wooden floor installation',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'wallpaper-fixing',
    name: 'Wallpaper Fixing Works',
    keywords: 'wallpaper fixing works, wallpaper installation',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'plaster-works',
    name: 'Plaster Works',
    keywords: 'plaster works, plastering contractor',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'painting-contracting',
    name: 'Painting Contracting',
    keywords: 'painting contracting, painting contractor, interior painting',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'electrical-fittings',
    name: 'Electrical Fittings & Fixtures Repairing & Maintenance',
    keywords: 'electrical fittings repair and maintenance, electrical fixtures, electrician',
    materialsQuestion: 'Need materials?',
  },
  {
    slug: 'electromechanical',
    name: 'Electromechanical Equipment Installation and Maintenance',
    keywords: 'electromechanical equipment installation and maintenance',
    materialsQuestion: 'Need materials?',
  },
];

const BY_SLUG = new Map(BOOKING_SERVICES.map((service) => [service.slug, service]));
const BY_NAME = new Map(BOOKING_SERVICES.map((service) => [service.name, service]));

export function bookingServiceBySlug(slug: string | undefined): BookingService | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}

/** Checkout URL for a service name, used by the service cards and the service search. */
export function bookingHref(name: string): string | null {
  const service = BY_NAME.get(name);
  return service ? `/en-AE/${service.slug}/checkout/details` : null;
}
