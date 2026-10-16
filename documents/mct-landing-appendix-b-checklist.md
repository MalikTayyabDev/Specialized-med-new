# Appendix B — MCT Landing Final Approval Checklist

Production URL: `https://www.specialized-med.com/mobile-cardiac-telemetry-mct/`  
Rollback backup: `documents/backups/mct-landing-20261015/`

## Developer / SEO completed in repo

- [x] Staging page imported; dated rollback backup exists
- [x] Page carries `noindex, nofollow` meta + Netlify/`X-Robots-Tag` headers (pre-launch)
- [x] Zero staging-host URLs in production page source / sitemap / schema / OG
- [x] Philips-era hero removed; S-Patch hero WebP+JPG installed (`images/landing/mobile-cardiac-telemetry-mct-hero.*`)
- [x] Overview graphic removed until claims-safe redesign
- [x] No internal labels (“Compliance wording”, “Required safety statement”)
- [x] Editorial-review wording (no placeholder physician review)
- [x] CTA anchors stay on MCT page (`#cta-form`); primary/secondary CTA hierarchy
- [x] Thank-you only after successful submission (redirect to `/thanks/`)
- [x] Form includes no-PHI warning; interest / preferred contact / optional volume
- [x] Conversion events documented (`documents/mct-landing-analytics-events.md`)
- [x] Pretty URL redirects in `_redirects` + `.htaccess`
- [x] Canonical / OG / Twitter / JSON-LD use `www.specialized-med.com` pretty URL
- [x] One H1; title + meta description per Appendix A
- [x] MedicalWebPage + Service + BreadcrumbList + FAQPage connected `@graph`
- [x] Visible FAQ (12) matches FAQ schema
- [x] `OAI-SearchBot` Allow in `robots.txt`
- [x] Hero WebP-first, 1430×550, preload / fetchpriority, not lazy-loaded
- [x] Skip link, focus styles, scroll-margin on `#cta-form`
- [x] CPT / connectivity / safety wording per Appendix A
- [x] Internal link cluster to/from MCT
- [x] Sitemap includes MCT URL once

## Stakeholder / launch gates (not completed in code)

- [ ] Netlify password / access control on staging site (Stage 0.1)
- [ ] Form inbox test from desktop + mobile (Web3Forms delivery)
- [ ] Clinical claim worksheet sign-off (`documents/mct-landing-claim-worksheet.md`)
- [ ] Billing reviewer sign-off on CPT / payer wording
- [ ] Responsive QA matrix (320–1920) + keyboard pass signed
- [ ] Lighthouse / PSI evidence attached
- [ ] Flip meta robots + remove `X-Robots-Tag` / netlify.toml noindex headers
- [ ] Google Search Console + Bing sitemap / URL submission
- [ ] Assign 48h / 7d / 30d monitoring owners

## Approval area

| Role | Name | Date | Evidence |
|---|---|---|---|
| Web Development | | | |
| SEO/AEO | | | |
| Clinical / Billing | | | |
| Analytics / QA | | | |
| Specialized Medical Final | | | |
