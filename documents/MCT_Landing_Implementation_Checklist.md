# MCT Landing Page — Implementation Checklist

**Page:** `mobile-cardiac-telemetry-mct.html` → `/mobile-cardiac-telemetry-mct/`  
**Production target:** https://www.specialized-med.com/mobile-cardiac-telemetry-mct/  
**Source plan:** Specialized Medical MCT Landing Page SEO/AEO Developer Task List (Oct 13, 2026)  
**Status date:** October 15, 2026  

Legend: **Done** = implemented in this repo · **Handoff** = needs stakeholder / dashboard / live QA

---

## Phase A — Bring the page into the repo

| Item | Status | Where |
|------|--------|-------|
| MCT landing HTML page | Done | `mobile-cardiac-telemetry-mct.html` |
| Landing CSS | Done | `css/landing.css` |
| Hero + landing image folder | Done | `images/landing/` |
| Dated rollback backup | Done | `documents/backups/mct-landing-20261015/` |
| Rebuild script | Done | `scripts/build-mct-landing-html.mjs` (`npm run build:mct`) |
| Web3Forms key aligned with contact form | Done | Same access key as `contact.html` / `js/main.js` |

---

## Stage 0 — Contain the staging page

| Task | Status | Notes |
|------|--------|-------|
| 0.1 Password-protect staging site | **Handoff** | Netlify → Site settings → Access control |
| 0.2 `noindex, nofollow` on page | Done | `<meta name="robots">` on MCT page |
| 0.2 `X-Robots-Tag` header | Done | `netlify.toml` + `.htaccess` |
| 0.3 No staging host in discovery paths | Done | Page/schema/OG/sitemap use `www.specialized-med.com` only |
| 0.4 Versioned backup | Done | `documents/backups/mct-landing-20261015/` |

---

## Stage 1 — Brand, imagery, trust

| Task | Status | Notes |
|------|--------|-------|
| 1.1 Replace Philips hero with S-Patch hero | Done | `images/landing/mobile-cardiac-telemetry-mct-hero.webp` + `.jpg` (1430×550); approved alt text |
| 1.2 Overview graphic (high-risk claims) | Done | Section **removed** until a claims-safe graphic is supplied |
| 1.3 Remove “Compliance wording” / “Required safety statement” labels | Done | Safety copy kept as normal visitor-facing prose |
| 1.4 Fix reviewer attribution | Done | Appendix A editorial-review wording; no placeholder physician |
| 1.5 Qualify absolute claims | Done | Softened continuous/immediate-style language; claim worksheet prepared |

---

## Stage 2 — Conversion flow and lead form

| Task | Status | Notes |
|------|--------|-------|
| 2.1 CTA anchors stay on MCT page (`#cta-form`) | Done | Hero, mid-page, header; sticky offset via CSS `scroll-margin` |
| 2.2 Primary / secondary CTA hierarchy | Done | Primary: **Start a No-Risk MCT Pilot** · Secondary: **Request an MCT Demonstration** |
| 2.3 No premature thank-you | Done | Intro uses Appendix A invitation; thank-you via `/thanks/` after success |
| 2.4 Form harden + no-PHI warning | Done | Web3Forms, botcheck, privacy/PHI notice, success/error status |
| 2.5 Lead qualification fields | Done | Name, org, role, email, phone, state, interest, preferred contact, optional volume |
| 2.6 Conversion events (no PII) | Done | `js/main.js` + `documents/mct-landing-analytics-events.md` |
| Live inbox / spam / desktop+mobile form test | **Handoff** | Confirm deliveries to Specialized Medical inbox |

---

## Stage 3 — Production URL and on-page SEO

| Task | Status | Notes |
|------|--------|-------|
| 3.1 Pretty production URL + redirects | Done | `_redirects` + `.htaccess` (301 `.html` → pretty; 200 serve file) |
| 3.2 Self-referencing canonical | Done | `https://www.specialized-med.com/mobile-cardiac-telemetry-mct/` |
| 3.3 Title + meta description | Done | Appendix A copy |
| 3.4 One H1 + logical headings | Done | H1: Mobile Cardiac Telemetry Built for Modern Cardiology Practices |
| 3.5 Answer-first intro under H1 | Done | Hero lead + `.landing-answer` blocks |
| 3.6 Internal link cluster | Done | To MCT from home, services, equipment, FAQ, clinical stories, post-TAVR, footers; from MCT to related services |
| Sitemap entry | Done | `sitemap.xml` includes MCT URL once |

---

## Stage 4 — AEO content and structured data

| Task | Status | Notes |
|------|--------|-------|
| 4.1 Connected JSON-LD `@graph` | Done | MedicalWebPage, Service, Organization, WebSite, BreadcrumbList, FAQPage |
| 4.2 FAQ schema matches visible FAQ | Done | 12 accordion Q&As; same answers in schema |
| 4.3 Concise answer blocks | Done | Key H2s use `.landing-answer` openers |
| 4.4 Authorship / dates | Done | Steven M. Burns author; Last updated Oct 15, 2026; no fake `reviewedBy` |
| 4.5 OAI-SearchBot allow | Done | `robots.txt` |
| 4.6 Do not promise FAQ rich results | Done | No rich-result guarantee in page copy |

---

## Stage 5 — Performance, mobile, accessibility

| Task | Status | Notes |
|------|--------|-------|
| 5.1 Hero WebP-first, sized, not lazy-loaded | Done | `preload` + `fetchpriority="high"`; JPG fallback |
| 5.2 Below-fold media | Done | Overview graphic removed; no oversized Philips asset requested |
| 5.3 Core Web Vitals lab/field proof | **Handoff** | Run PSI / Lighthouse on deployed URL and attach evidence |
| 5.4 Responsive QA (320–1920) | **Handoff** | Manual QA matrix still required |
| 5.5 Accessibility basics | Done (code) | Skip link, focus styles, semantic FAQ/form labels; manual keyboard pass still **Handoff** |

---

## Stage 6 — Medical, evidence, billing copy

| Task | Status | Notes |
|------|--------|-------|
| 6.1 Claim-to-source worksheet | Done (doc) | `documents/mct-landing-claim-worksheet.md` — clinical sign-off still **Handoff** |
| 6.2 Qualified live transmission / alert language | Done | Appendix A §6 wording on page |
| 6.3 CMS / payer framing | Done | Jurisdiction/plan variation; no coverage guarantee |
| 6.4 CPT 93228 / 93229 qualified wording | Done | Appendix A §4; no “both codes always needed” framing |
| 6.5 Emergency + medication limitations visible | Done | Near treatment/safety sections and form |
| 6.6 Authorship / dates refreshed | Done | Oct 15, 2026; editorial review wording |
| Clinical + billing approval signatures | **Handoff** | Required before `index,follow` |

---

## Stage 7 — Final QA and production launch

| Task | Status | Notes |
|------|--------|-------|
| 7.1 Pre-launch automated validation evidence | **Handoff** | HTML/schema/a11y/PSI exports |
| 7.2 Manual browser / device QA matrix | **Handoff** | Chrome, Safari, Firefox, Edge, iOS, Android |
| 7.3 Deploy without staging refs; flip indexability | **Handoff** | Remove noindex meta + `X-Robots-Tag` / netlify headers only after gates pass |
| 7.4 GSC / Bing / IndexNow | **Handoff** | Submit sitemap + request indexing |
| 7.5 Post-launch monitoring owners | **Handoff** | 48h / 7d / 30d |

---

## Key files created or updated

### Created
- `mobile-cardiac-telemetry-mct.html`
- `css/landing.css`
- `images/landing/mobile-cardiac-telemetry-mct-hero.webp`
- `images/landing/mobile-cardiac-telemetry-mct-hero.jpg`
- `netlify.toml`
- `scripts/build-mct-landing-html.mjs`
- `documents/backups/mct-landing-20261015/`
- `documents/mct-landing-analytics-events.md`
- `documents/mct-landing-claim-worksheet.md`
- `documents/mct-landing-appendix-b-checklist.md`
- `documents/MCT_Landing_Implementation_Checklist.md` (this file)

### Updated
- `_redirects`, `.htaccess`, `sitemap.xml`, `robots.txt`, `.gitignore`, `package.json`
- `js/main.js`, `js/analytics.js`
- `partials/footer.html`
- `index.html`, `services.html`, `faq.html`, `clinical-stories.html`, `services/equipment.html`, `post-tavr-cardiac-monitoring.html`, and other page footers

---

## Follow-up developer items completed (Oct 16, 2026)

- [x] Privacy Policy page (`privacy.html` → `/privacy/`) + MCT/contact form links + footer links  
- [x] Sitemap converted to pretty URLs; privacy URL added  
- [x] Hero WebP recompressed (~22 KB at 1430×550)  
- [x] Local preview QA (HTTP 200s for MCT, privacy, hero, CSS/JS; CTA/FAQ/privacy checks)  
- [x] Launch flip helpers: `npm run mct:index` / `npm run mct:noindex`  
- [x] Client handoff remaining list: `documents/MCT_Client_Handoff_Remaining.md`

## Follow-up developer items completed (Oct 20, 2026)

- [x] Restored PDF Stage 3.1 trailing-slash canonical (`/mobile-cardiac-telemetry-mct/`) + matching `.htaccess` / `_redirects`  
- [x] Stage 3.6 link cluster: Holter / LTH / Event / Live ECG / S-Patch pretty URLs + sitemap entries  
- [x] Inbound MCT links normalized across satellite pages  
- [x] Netlify security headers (nosniff, referrer, frame, permissions)  
- [x] Portal/phone analytics scoped to full chrome; footer `portal_click`  
- [x] Flip script no longer wipes `netlify.toml`  
- [x] Automated PDF acceptance QA: `npm run qa:mct` (**72/72 pass**)

## Remaining before go-live (client / stakeholder)

1. Password-protect Netlify staging  
2. Test form submissions (desktop + mobile) into the correct inbox  
3. Clinical + billing sign-off on claim worksheet / CPT wording  
4. Responsive + keyboard QA sign-off; attach Lighthouse/PSI on deployed URL  
5. Run `npm run mct:index`, deploy, then submit sitemap in Google Search Console and Bing  

Related sign-off sheet: `documents/mct-landing-appendix-b-checklist.md`  
Client-facing remaining list: `documents/MCT_Client_Handoff_Remaining.md`
