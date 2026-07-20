# Production URL rules (critical)

Live site: [https://www.specialized-med.com/](https://www.specialized-med.com/)

## What production actually does today

Probed July 2026:

| URL | Live result |
|-----|-------------|
| `/` | 200 |
| `/services.html` | 200 |
| `/about.html` | 200 |
| `/contact.html` | 200 |
| `/faq.html` | 200 |
| `/services/equipment.html` | 200 |
| `/services/` | **404** |
| `/about/` | **404** |
| `/services/equipment/` | **404** |

Production is **Apache** (`.htaccess`), not Netlify rewrite hosting.

- `_redirects` is present on the server as a static file but **does not rewrite Apache requests**.
- Live HTML nav/CTAs use **`.html` links** (`services.html`, `contact.html`, …).
- Live sitemap lists **`.html`** URLs for core pages.

## Hard rule for this project

1. **Internal links must use `.html`** (same as the live homepage/nav).
2. **Do not rely on pretty `/slug/` links alone** — they 404 on the current live server unless `.htaccess` rewrites are deployed.
3. Keep the **`sm-site-base`** injector so assets resolve under any path style.
4. Add **Apache rewrite rules** in `.htaccess` so Stagegate pretty URLs (`/post-tavr-cardiac-monitoring/`) also resolve when clients/sitemap use them.
5. Canonical + sitemap for new Stage 2 pages: prefer the URL form that is confirmed working after deploy. Until pretty rewrites are live, **`.html` is the safe primary**.

## Why last time’s URL issues happen

Common failure modes on this stack:

- Pretty links (`about/`, `contact/`) on Apache without matching `RewriteRule` → 404
- Missing `sm-site-base` leaf entry → CSS/images load from `/slug/css/...` → broken page
- Netlify `_redirects` assumed to work on Apache → they don’t
- Mixed `.html` and trailing-slash links → duplicate/broken paths

## Deploy checklist

- [ ] Upload flat `*.html` files at site root (and `services/equipment.html`)
- [ ] Upload updated `.htaccess` with pretty→html rewrites
- [ ] Confirm `https://www.specialized-med.com/post-tavr-cardiac-monitoring.html` returns 200
- [ ] Confirm `https://www.specialized-med.com/post-tavr-cardiac-monitoring/` returns 200 **after** htaccess deploy
- [ ] Click header About / Services / Contact from a new landing page — must hit `.html` pages that already work live
- [ ] Confirm CSS/images load (no `/slug/css/` 404s)
