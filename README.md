# Justlife (Angular)

An Angular 21 version of the English pages of [justlife.com](https://www.justlife.com): the main site
(home, cities, services, booking, FAQ, legal, sitemap, help), the "Cleanslate" blog and the cat grooming
landing page. It is a static single-page app: all content ships as JSON in `public/content`, images are
loaded from Justlife's CDNs.

The scope is intentionally small: **5 services** (House Cleaning, AC Cleaning, Pest Control, Women's Salon,
Women's Spa) with their booking pages, and **5 blog posts**. Links to anything else were removed, so every
link on the site stays inside the app.

## Running

```bash
npm install
npm start          # dev server on http://localhost:4200
npm run build      # production build in dist/justlife/browser
```

The production build is a plain SPA: serve `dist/justlife/browser` with a fallback to `index.html` for
unknown paths (e.g. `try_files $uri /index.html` in nginx). The three style bundles `site.css`, `blog.css`
and `webflow.css` are loaded by name and are not content-hashed, so serve them with `Cache-Control: no-cache`
(revalidate) to avoid stale styles after a deploy.

## Routes

URLs are the original justlife.com paths without `.html`:

| Page type | Example | Component |
| --- | --- | --- |
| home | `/`, `/en-AE`, `/en-SA` | `pages/home` |
| city | `/en-AE/dubai`, `/en-SA/riyadh` | `pages/home` |
| service | `/en-AE/house-cleaning` | `pages/service` |
| checkout | `/en-AE/home-cleaning/checkout/details` | `pages/checkout` |
| contact, faq, legal, sitemap, help | `/en-AE/faq`, `/en-SA/privacy`, `/en-AE/my-account/help` | `pages/*` |
| blog home / post | `/blog/en-AE`, `/blog/en-AE/how-to-deep-clean-a-kitchen` | `blog/*` |
| cat grooming | `/cat-grooming` | `cat-grooming` |

Several page types share a URL shape (`/:locale/:slug`), so `src/app/core/page-registry.json` lists every
page and its type; the `matchPage()` guard picks the component and unknown URLs render the 404 page.

## How it is put together

- `src/app/core` – page registry, route guard, `pageResolver` (loads `public/content/pages/<url>.json` and
  passes it to the page component as its `content` input), `SeoService` (title, meta, canonical, JSON-LD
  from each page's `meta`), `StyleWorldService`.
- `src/app/shared` – `appLink` (router links for URLs that come from content data), `appContentLinks`
  (router navigation for links inside `[innerHTML]` content) and the `safeHtml` pipe.
- `src/app/layout` – main-site layout: navbar (country and user menus) and footer.
- `public/content` – page content. `pages/` mirrors the URL structure; `site/`, `home/`, `service/` and
  `blog/` hold data shared by several pages. The JSON (and the ported CSS) was extracted once from the
  original site; it is now maintained by hand.

### Styles

The original site was three separate front-ends with their own global CSS, which would clash if loaded
together. Each is built as its own stylesheet bundle (see `angular.json`) and `StyleWorldService` enables
only the active one:

- `src/styles/site` – main site (Bulma-based base styles, typography and shared UI pieces)
- `src/styles/blog` – blog (Poppins fonts bundled from `src/styles/blog/media`)
- `src/styles/webflow` – cat grooming page

Page and section styles live next to their components with Angular's default view encapsulation.

### What behaves differently from justlife.com

Features that depended on Justlife's live backend cannot work in a static app:

- **Booking:** the checkout pages name the service and point to the Justlife app instead of running the
  booking flow.
- **Sign up / log in:** this opens the app download link.
- **Location search:** the input shows the site's empty-search state.
- **Help center:** the help pages show only the Terms and Privacy links.
- **City pages:** the service lists, which the live site loaded from its API, are built from the pages
  included here.

The Arabic language switch is removed.
