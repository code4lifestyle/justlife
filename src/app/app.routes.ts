import { Routes } from '@angular/router';
import { matchPage } from './core/page-match';
import { pageResolver } from './core/page.resolver';
import { SiteLayout } from './layout/site-layout/site-layout';
import { bookingResolver } from './pages/booking/booking.resolver';
import { bookingServiceBySlug } from './pages/booking/booking-services';
import { cityCatalogResolver, homeCommonResolver } from './pages/home/home.resolvers';

const content = { content: pageResolver };

/**
 * URLs are the original justlife.com paths without ".html". Many routes share a shape
 * (`:locale/:slug` is a service, city or legal page), so `matchPage` consults the page registry to
 * pick the component; URLs that are not in the registry end at the 404 page.
 */
export const routes: Routes = [
  // Blog ("Cleanslate by Justlife", originally a separate Next.js app)
  {
    path: '',
    canMatch: [matchPage('blog-home', 'blog-post')],
    loadComponent: () => import('./blog/blog-layout/blog-layout').then((m) => m.BlogLayout),
    children: [
      {
        path: 'blog/:locale',
        loadComponent: () => import('./blog/blog-home/blog-home-page').then((m) => m.BlogHomePage),
        resolve: content,
      },
      {
        path: 'blog/:locale/:slug',
        loadComponent: () => import('./blog/blog-post/blog-post-page').then((m) => m.BlogPostPage),
        resolve: content,
      },
    ],
  },

  // Cat grooming landing page (originally a standalone Webflow page)
  {
    path: 'cat-grooming',
    canMatch: [matchPage('cat-grooming')],
    loadComponent: () => import('./cat-grooming/cat-grooming-page').then((m) => m.CatGroomingPage),
    resolve: content,
  },

  // Main site
  {
    path: '',
    component: SiteLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canMatch: [matchPage('home')],
        loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
        resolve: { ...content, common: homeCommonResolver, catalog: cityCatalogResolver },
      },
      {
        path: ':locale',
        canMatch: [matchPage('home')],
        loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
        resolve: { ...content, common: homeCommonResolver, catalog: cityCatalogResolver },
      },
      {
        path: ':locale/:slug',
        canMatch: [matchPage('city')],
        loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
        resolve: { ...content, common: homeCommonResolver, catalog: cityCatalogResolver },
      },
      {
        path: ':locale/:slug',
        canMatch: [matchPage('service')],
        loadComponent: () => import('./pages/service/service-page').then((m) => m.ServicePage),
        resolve: content,
      },
      {
        path: ':locale/contact-us',
        canMatch: [matchPage('contact')],
        loadComponent: () => import('./pages/contact/contact-page').then((m) => m.ContactPage),
        resolve: content,
      },
      {
        path: ':locale/faq',
        canMatch: [matchPage('faq')],
        loadComponent: () => import('./pages/faq/faq-page').then((m) => m.FaqPage),
        resolve: content,
      },
      {
        path: ':locale/:slug',
        canMatch: [matchPage('legal')],
        loadComponent: () => import('./pages/legal/legal-page').then((m) => m.LegalPage),
        resolve: content,
      },
      {
        path: ':locale/sitemap',
        canMatch: [matchPage('sitemap')],
        loadComponent: () => import('./pages/sitemap/sitemap-page').then((m) => m.SitemapPage),
        resolve: content,
      },
      {
        path: ':locale/my-account/help',
        canMatch: [matchPage('help')],
        loadComponent: () => import('./pages/help/help-page').then((m) => m.HelpPage),
        resolve: content,
      },
      {
        path: ':locale/:service/checkout/details',
        canMatch: [(_route, segments) => !!bookingServiceBySlug(segments[1]?.path)],
        loadComponent: () => import('./pages/booking/booking-page').then((m) => m.BookingPage),
        resolve: { content: bookingResolver },
      },
      {
        path: ':locale/:service/checkout/:step',
        canMatch: [matchPage('checkout')],
        loadComponent: () => import('./pages/checkout/checkout-page').then((m) => m.CheckoutPage),
        resolve: content,
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
