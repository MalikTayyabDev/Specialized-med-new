# Step 1 — Team QA Report (Netlify Preview)

**Preview base URL:** https://zesty-pothos-c8949b.netlify.app/  
**QA date:** July 21, 2026  
**Scope:** Stagegate 2 — 10 landing pages (automated + spot-check)  
**Branch (latest code):** `stagegate-2-seo-aeo-landing-pages`

---

## Overall result: **PASS with minor notes**

| Area | Result |
|------|--------|
| All 10 landing pages load (HTTP 200) | **PASS** |
| SEO (title, meta, canonical, indexable) | **PASS** |
| Direct-answer opening + H1 + body sections | **PASS** |
| FAQs present (5 each; 6 on Post-TAVR) + accordion markup | **PASS** |
| CTA sections | **PASS** |
| Pretty URLs work (`/slug/` without `.html`) | **PASS** |
| CSS + JS assets load | **PASS** |
| Cross-links between landing pages | **PASS** |
| Homepage → landing links | **PASS** |
| Services hub → 4 extra links (ambulatory, S-Patch, live ECG, practices) | **NOTE** — not on preview yet; in local repo, needs redeploy |

---

## Click-through URL list (team review)

Open each page and confirm layout, readability, and CTAs.

| # | Page | Preview URL (.html) | Pretty URL |
|---|------|---------------------|------------|
| 1 | Cardiac Monitoring Services | [Open](https://zesty-pothos-c8949b.netlify.app/cardiac-monitoring-services.html) | [/cardiac-monitoring-services/](https://zesty-pothos-c8949b.netlify.app/cardiac-monitoring-services/) |
| 2 | Mobile Cardiac Telemetry (MCT) | [Open](https://zesty-pothos-c8949b.netlify.app/mobile-cardiac-telemetry-mct.html) | [/mobile-cardiac-telemetry-mct/](https://zesty-pothos-c8949b.netlify.app/mobile-cardiac-telemetry-mct/) |
| 3 | Holter Monitoring Services | [Open](https://zesty-pothos-c8949b.netlify.app/holter-monitoring-services.html) | [/holter-monitoring-services/](https://zesty-pothos-c8949b.netlify.app/holter-monitoring-services/) |
| 4 | Long-Term Holter Monitoring | [Open](https://zesty-pothos-c8949b.netlify.app/long-term-holter-monitoring.html) | [/long-term-holter-monitoring/](https://zesty-pothos-c8949b.netlify.app/long-term-holter-monitoring/) |
| 5 | Cardiac Event Monitoring | [Open](https://zesty-pothos-c8949b.netlify.app/cardiac-event-monitoring.html) | [/cardiac-event-monitoring/](https://zesty-pothos-c8949b.netlify.app/cardiac-event-monitoring/) |
| 6 | Ambulatory Cardiac Monitoring | [Open](https://zesty-pothos-c8949b.netlify.app/ambulatory-cardiac-monitoring.html) | [/ambulatory-cardiac-monitoring/](https://zesty-pothos-c8949b.netlify.app/ambulatory-cardiac-monitoring/) |
| 7 | S-Patch Monitoring System | [Open](https://zesty-pothos-c8949b.netlify.app/s-patch-cardiac-monitoring-system.html) | [/s-patch-cardiac-monitoring-system/](https://zesty-pothos-c8949b.netlify.app/s-patch-cardiac-monitoring-system/) |
| 8 | Live ECG Monitoring | [Open](https://zesty-pothos-c8949b.netlify.app/live-ecg-monitoring.html) | [/live-ecg-monitoring/](https://zesty-pothos-c8949b.netlify.app/live-ecg-monitoring/) |
| 9 | **Post-TAVR** (priority) | [Open](https://zesty-pothos-c8949b.netlify.app/post-tavr-cardiac-monitoring.html) | [/post-tavr-cardiac-monitoring/](https://zesty-pothos-c8949b.netlify.app/post-tavr-cardiac-monitoring/) |
| 10 | Cardiology Practice Monitoring | [Open](https://zesty-pothos-c8949b.netlify.app/cardiology-practice-cardiac-monitoring.html) | [/cardiology-practice-cardiac-monitoring/](https://zesty-pothos-c8949b.netlify.app/cardiology-practice-cardiac-monitoring/) |

**Hub pages to check internal linking:**
- [Homepage](https://zesty-pothos-c8949b.netlify.app/)
- [Services](https://zesty-pothos-c8949b.netlify.app/services)

---

## Automated checks (completed)

### All 10 pages — per page

| Check | Result |
|-------|--------|
| HTTP 200 | 10/10 |
| Unique `<title>` | 10/10 |
| Meta description | 10/10 |
| `robots: index, follow` | 10/10 |
| Self-referencing canonical (`specialized-med.com/...html`) | 10/10 |
| `sm-site-base` injector (CSS/images on pretty URLs) | 10/10 |
| `css/landing.css` linked | 10/10 |
| `faq-accordion` + 5–6 FAQs | 10/10 |
| CTA section | 10/10 |
| Service + FAQPage JSON-LD | 10/10 |

### Post-TAVR page — scope spot-check

| Requirement | Result |
|-------------|--------|
| Title: `Post-TAVR Cardiac Monitoring \| Live ECG & MCT \| Specialized Medical` | **PASS** |
| H1: Post-TAVR Cardiac Monitoring with Live-Streaming ECG | **PASS** |
| Primary CTA: Discuss Post-TAVR Monitoring Support | **PASS** |
| Secondary CTAs: Request a Demo / Start a No-Risk Pilot Program | **PASS** |
| Workflow: Enroll → Hook Up → Monitor/Alert → Physician-ready report | **PASS** |
| 6 Post-TAVR FAQs | **PASS** |
| Disclaimer language (no guaranteed outcomes) | **PASS** |

### Navigation & assets

| Check | Result |
|-------|--------|
| Pretty URLs return 200 with styles | **PASS** |
| `js/main.js` loads (FAQ accordion) | **PASS** |
| `css/landing.css` returns `text/css` | **PASS** |
| MCT → Post-TAVR / Live ECG / Services / Contact links | **PASS** |
| Index → key landing pages | **PASS** |
| Services → modality cards + Post-TAVR | **PASS** |

---

## Manual review checklist (team — please tick)

Use a phone and desktop browser. Mark **OK** or **Issue** and add notes.

### Every landing page

- [ ] Hero text is **left-aligned** and readable
- [ ] H1 and opening paragraph read clearly (no awkward line breaks)
- [ ] FAQ **accordion opens/closes** when clicked (tap on mobile)
- [ ] FAQ section uses **full content width** (not narrow column)
- [ ] CTA buttons go to **Contact** page
- [ ] Header nav and footer render correctly
- [ ] No broken images or missing styles

### Post-TAVR page (extra attention)

- [ ] “Discuss Post-TAVR Monitoring Support” is the primary button
- [ ] 4-step workflow reads correctly
- [ ] Clinical language feels cautious (no over-promising)
- [ ] Related links work

### Content / compliance (clinical + billing)

- [ ] No language that **guarantees** reimbursement, profit, detection, or outcomes
- [ ] Terms match scope: Specialized Medical, S-Patch Monitoring System, Holter Monitoring, etc.
- [ ] Billing mentions are neutral (“does not guarantee reimbursement”)

### Mobile (375px width recommended)

- [ ] Hero + buttons stack cleanly
- [ ] FAQ tap targets are easy to use
- [ ] No horizontal scroll

---

## Notes for team

1. **Canonical URLs** point to `https://www.specialized-med.com/...html` — correct for production Apache; preview is for layout/content QA only.
2. **Internal links on preview** use pretty paths (`/post-tavr-cardiac-monitoring`) — works on Netlify via `_redirects`.
3. **Services page:** four hub links (Ambulatory, S-Patch, Live ECG, Cardiology Practices) were added locally after this preview was deployed. Redeploy from latest branch to see them on Netlify.
4. **Local automated QA** (250 checks): run `node scripts/qa-stagegate2.mjs` — currently **PASS** in repo.

---

## Sign-off (team)

| Reviewer | Date | Result (Approve / Changes needed) | Notes |
|----------|------|-----------------------------------|-------|
| | | | |
| | | | |

**If approved:** proceed to Step 2 (client review package) and Step 3 (production deploy).
