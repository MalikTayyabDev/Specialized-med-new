# Specialized Medical — Agent Training Docs

Read these **before** changing pages. They document how the live static site actually works.

| Order | File | Purpose |
|------:|------|---------|
| 1 | [01-site-architecture.md](./01-site-architecture.md) | Stack, folders, routing, hosting |
| 2 | [02-page-template-and-assets.md](./02-page-template-and-assets.md) | HTML skeleton, **base href**, CSS/JS/images |
| 3 | [03-seo-aeo-patterns.md](./03-seo-aeo-patterns.md) | Titles, meta, canonical, schema, sitemap |
| 4 | [04-design-system.md](./04-design-system.md) | Classes, CTAs, FAQ accordion, heroes |
| 5 | [05-stagegate-2-requirements.md](./05-stagegate-2-requirements.md) | Stage 2 landing-page checklist |
| 6 | [06-dev-checklist.md](./06-dev-checklist.md) | Do / don’t before commit or push |
| 7 | [07-production-urls.md](./07-production-urls.md) | Live Apache URL rules (no broken links) |

## Critical lesson (styles/images)

Pretty URLs like `/about/` or `/post-tavr-cardiac-monitoring/` break relative asset paths unless the page includes the **`sm-site-base`** `<base href>` injector used on existing pages.

Without it, the browser requests:

- `/post-tavr-cardiac-monitoring/css/home.css` → 404
- `/post-tavr-cardiac-monitoring/images/...` → 404

With it, assets resolve from site root:

- `/css/home.css`
- `/images/...`

## Critical lesson (production URLs)

Live site [specialized-med.com](https://www.specialized-med.com/) serves **`.html` URLs** on Apache. Pretty paths like `/services/` currently **404** unless `.htaccess` rewrites are deployed.

Read **[07-production-urls.md](./07-production-urls.md)** before shipping any link changes.

## Local preview

```bash
npm run dev
```

Open **http://localhost:5173/** (HTTP only — not HTTPS).

Prefer checking pages as `.html` first (matches live):

`http://localhost:5173/post-tavr-cardiac-monitoring.html`

## Workflow expectation

1. Read existing pages (`services.html`, `index.html`, `faq.html`, `services/equipment.html`).
2. Use these MD files as the contract.
3. Implement on a feature branch.
4. Preview locally.
5. Commit / push / PR **only when asked**.
