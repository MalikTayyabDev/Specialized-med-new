# SEO / AEO patterns (existing site)

## Per-page tags (hand-authored)

Every public page should have:

- Unique `<title>`
- Unique `<meta name="description">`
- Self-referencing `<link rel="canonical" href="…">`
- Crawlable HTML body text (not image-only content)

### Canonical URL style today

Existing core pages often canonical to **`.html`** forms, e.g.:

`https://www.specialized-med.com/services.html`

Pretty URLs still work via redirects. For Stagegate 2, requirements call for pretty trailing-slash URLs such as:

`https://www.specialized-med.com/post-tavr-cardiac-monitoring/`

Be consistent **within** a new page set and document the choice in the PR.

## Schema (JSON-LD)

| Page | Schema used |
|------|-------------|
| Home | `MedicalBusiness`, `Organization` |
| Services | `Service` + offer catalog |
| FAQ | `FAQPage` matching visible Q&As |
| Others | Often none |

Rules from Stagegate / site practice:

- Schema must match **visible** content.
- Do not invent credentials, outcomes, or hidden FAQ schema.
- If FAQ schema is used, FAQs must be visible on the page.

## Open Graph / Twitter

Present on `index.html` only. Inner pages generally omit OG/Twitter tags unless explicitly requested.

## Sitemap

File: `sitemap.xml`

- Add a page only after it is live, canonical, and indexable.
- `robots.txt` already points to the sitemap.

## Internal linking

Existing patterns:

- Home ↔ services / equipment / clinical stories / FAQ hashes
- Services → equipment, clinical stories
- FAQ answers → equipment
- CTAs → `contact/` or `contact.html`

New landings should cross-link related modality pages + Contact.

## Content language constraints

Use consistent terms:

- Specialized Medical
- S-Patch Monitoring System
- Holter Monitoring
- Long-Term Holter Monitoring
- Event Monitoring
- Mobile Cardiac Telemetry
- live-streaming ECG data
- Post-TAVR Cardiac Monitoring

Avoid:

- Guaranteed reimbursement / profit
- Guaranteed clinical outcome
- Guaranteed detection
- Guaranteed speed of intervention
- Paid SEO plugins / directories / recurring tools unless approved in writing
