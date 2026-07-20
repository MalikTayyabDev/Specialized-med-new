# Dev checklist (before changing or shipping)

## Before coding

- [ ] Read `docs/00-read-me-first.md` through `04-design-system.md`
- [ ] Open model pages: `services.html`, `faq.html`, `services/equipment.html`
- [ ] Confirm Stagegate requirements in `05-stagegate-2-requirements.md`
- [ ] Agree branch + review plan with the human (do not push unless asked)

## For every new HTML page

- [ ] Unique title, meta description, H1
- [ ] Direct-answer opening paragraph
- [ ] Visible FAQs (if Stagegate landing)
- [ ] CTA to Contact
- [ ] Internal links to related pages using **`.html`** (matches live production)
- [ ] Canonical URL (`.html` form, matching live sitemap style)
- [ ] **`sm-site-base` script + leaf entry for the slug**
- [ ] Load `global.css` + `home.css` (+ page CSS / `faq.css` if needed)
- [ ] Header/footer via partials (or matching markup) with `.html` nav links
- [ ] Add to `scripts/apply-partials.mjs` `PAGES`
- [ ] Add Apache `.htaccess` rewrite for optional pretty URL
- [ ] Add `_redirects` entries if Netlify is also used
- [ ] Add to `sitemap.xml` only when ready to publish (`.html` loc)
- [ ] Preview at **http://localhost:5173/slug.html** and confirm CSS + images + nav links
- [ ] Confirm nav does **not** point at `/about/` style paths that 404 on live Apache

## Local preview

```bash
npm run dev
```

Use `http://localhost:5173/` — not `https://`.

If styles are missing on a pretty URL, the base injector / leaf map is wrong.

## Git / GitHub

- [ ] Commit only when the user asks
- [ ] Push only when the user asks
- [ ] PR only when the user asks
- [ ] Never force-push `main`

## Content safety pass

- [ ] No guaranteed reimbursement / profit / outcome / detection / intervention speed
- [ ] Consistent Specialized Medical terminology
- [ ] Schema matches visible content only
