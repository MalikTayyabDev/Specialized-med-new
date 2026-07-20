# Site architecture

## Stack

- **Static HTML** site (not Next.js / WordPress / React app).
- Plain CSS under `css/`.
- Vanilla JS under `js/` (`main.js`, `analytics.js`, page-specific scripts).
- Shared header/footer in `partials/` applied by `scripts/apply-partials.mjs`.
- Hosting: Netlify-style `_redirects` and/or Apache `.htaccess`.
- Contact form: PHP (`contact-submit.php`, `api/contact-submit.php`).

Domain: `https://www.specialized-med.com/`

## Important folders

| Path | Role |
|------|------|
| `*.html` (repo root) | Main pages |
| `services/equipment.html` | Nested equipment page |
| `css/` | Global + page styles |
| `js/` | Behavior + GTM analytics |
| `images/`, `icons/`, `video/` | Assets |
| `partials/` | Header/footer templates + renderer |
| `scripts/` | Dev server, partials, FAQ merge, base patch |
| `_redirects` | Pretty URL rewrites + `.html` → trailing-slash 301s |
| `sitemap.xml` | Crawl index |
| `robots.txt` | Points to sitemap |

## Existing routes (before Stage 2 landings)

| Pretty URL | File |
|------------|------|
| `/` | `index.html` |
| `/about/` | `about.html` |
| `/services/` | `services.html` |
| `/services/equipment/` | `services/equipment.html` |
| `/faq/` | `faq.html` |
| `/contact/` | `contact.html` |
| `/clinical-stories/` | `clinical-stories.html` |
| `/thanks/` | `thanks.html` |

## How pretty URLs work

1. `_redirects` maps `/slug/` → `slug.html` (200 rewrite).
2. `.html` URLs 301 to trailing-slash pretty URLs.
3. Local `npm run dev` resolves `/slug/` → `slug.html` the same way.

Pages still live as **flat root HTML files**. There are no required `slug/index.html` folders for production.

## Shared chrome

- Edit `partials/header.html` and `partials/footer.html`.
- Run `node scripts/apply-partials.mjs` to inject into registered pages.
- New pages must be listed in the `PAGES` array inside `scripts/apply-partials.mjs`.
- Portal URL comes from `partials/site-config.mjs`.

## Best model pages

1. **`services.html`** — full marketing/SEO service landing (hero, sections, CTA).
2. **`services/equipment.html`** — focused product page + nested path pattern.
3. **`faq.html`** — accordion FAQ + FAQPage schema.
4. **`clinical-stories.html`** — simpler secondary landing.

Do **not** model new work on incomplete stubs.
