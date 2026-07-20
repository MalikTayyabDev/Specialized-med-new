# Stagegate 2 — Acceptance Checklist

**Project:** Specialized Medical SEO / AEO Stagegate 2  
**Source:** `Specialized_Medical_Stagegate_2_SEO_AEO.docx`  
**Repo:** [MalikTayyabDev/Specialized-med-new](https://github.com/MalikTayyabDev/Specialized-med-new) (`main`)  
**Preview (Netlify):** https://zesty-pothos-c8949b.netlify.app/  
**Production (existing site):** https://www.specialized-med.com/  
**Audit date:** 2026-07-20  

Use this checklist for internal QA and client Stage 2 acceptance. Mark **Done** when verified on the **deployed** environment you are submitting (Netlify preview and/or production).

---

## General project rules (all stages)

| Done | Requirement | Status / notes |
|:----:|-------------|----------------|
| [ ] | No full upfront payment model violated (Stage 2 deliverables documented for acceptance) | Deliverables listed below |
| [x] | All new pages use visible, crawlable HTML (not image-only SEO content) | All 10 landings are HTML with text, H1–H3, FAQs, CTAs |
| [x] | No guaranteed reimbursement, profit, clinical outcome, detection, or intervention speed | Wording uses “does not guarantee…” throughout; FAQs address this |
| [x] | Consistent terminology (Specialized Medical, S-Patch Monitoring System, Holter, Long-Term Holter, Event Monitoring, MCT, live-streaming ECG, Post-TAVR) | Used across landings |
| [x] | Unique title, meta, H1, direct-answer opening, visible FAQs, CTA, internal links, canonical, indexable | See per-page table |
| [x] | Schema matches visible content only (Service + FAQPage JSON-LD) | 2 JSON-LD blocks per landing; FAQ schema matches visible Q&As |
| [x] | No paid SEO subscriptions / plugins / recurring outside costs added | Static HTML only |
| [ ] | Deliverables proven with screenshots, live URLs, validation (verbal only not sufficient) | **Client acceptance:** capture proof from live deploy |

---

## Stage 2 — Ten required landing pages

| Done | Required URL | File | Preview link (.html) |
|:----:|--------------|------|----------------------|
| [ ] | `/cardiac-monitoring-services/` | `cardiac-monitoring-services.html` | https://zesty-pothos-c8949b.netlify.app/cardiac-monitoring-services.html |
| [ ] | `/mobile-cardiac-telemetry-mct/` | `mobile-cardiac-telemetry-mct.html` | https://zesty-pothos-c8949b.netlify.app/mobile-cardiac-telemetry-mct.html |
| [ ] | `/holter-monitoring-services/` | `holter-monitoring-services.html` | https://zesty-pothos-c8949b.netlify.app/holter-monitoring-services.html |
| [ ] | `/long-term-holter-monitoring/` | `long-term-holter-monitoring.html` | https://zesty-pothos-c8949b.netlify.app/long-term-holter-monitoring.html |
| [ ] | `/cardiac-event-monitoring/` | `cardiac-event-monitoring.html` | https://zesty-pothos-c8949b.netlify.app/cardiac-event-monitoring.html |
| [ ] | `/ambulatory-cardiac-monitoring/` | `ambulatory-cardiac-monitoring.html` | https://zesty-pothos-c8949b.netlify.app/ambulatory-cardiac-monitoring.html |
| [ ] | `/s-patch-cardiac-monitoring-system/` | `s-patch-cardiac-monitoring-system.html` | https://zesty-pothos-c8949b.netlify.app/s-patch-cardiac-monitoring-system.html |
| [ ] | `/live-ecg-monitoring/` | `live-ecg-monitoring.html` | https://zesty-pothos-c8949b.netlify.app/live-ecg-monitoring.html |
| [ ] | `/post-tavr-cardiac-monitoring/` | `post-tavr-cardiac-monitoring.html` | https://zesty-pothos-c8949b.netlify.app/post-tavr-cardiac-monitoring.html |
| [ ] | `/cardiology-practice-cardiac-monitoring/` | `cardiology-practice-cardiac-monitoring.html` | https://zesty-pothos-c8949b.netlify.app/cardiology-practice-cardiac-monitoring.html |

**Pretty URLs** also configured via `_redirects` (Netlify) and `.htaccess` (Apache production), e.g. `/post-tavr-cardiac-monitoring/`.

---

## Every landing page — universal requirements

| Done | Requirement | Implementation |
|:----:|-------------|----------------|
| [x] | Unique `<title>` | All 10 pages |
| [x] | Unique meta description | All 10 pages |
| [x] | One clear H1 | All 10 pages |
| [x] | H2/H3 subheadings | Body sections on all pages |
| [x] | 2–4 sentence direct-answer opening (`landing-hero__lead`) | All 10 pages |
| [x] | Who the service/page is for | Section copy on all pages |
| [x] | How the service works | Section copy on all pages |
| [x] | Turnkey provider positioning | All pages |
| [x] | S-Patch / live-streaming ECG where appropriate | All pages (contextual) |
| [x] | 24/7 monitoring & arrhythmia alert language where appropriate | MCT, overview, Post-TAVR, live ECG, etc. |
| [x] | Physician-ready reporting language | All pages |
| [x] | Patient-friendly monitoring language | Holter, S-Patch, event, practice pages |
| [x] | Neutral billing wording only | All pages |
| [x] | 4–6 visible FAQ Q&As | 5 FAQs × 9 pages; **6 FAQs** on Post-TAVR |
| [x] | FAQ accordion opens/closes | Fixed: `faq-accordion` class + `main.js` |
| [x] | CTA section | All pages (`figma-cta` → contact) |
| [x] | Internal links to related pages | Related links + cross-links in body |
| [x] | Self-referencing canonical | All pages (`.html` form — see note below) |
| [x] | `meta robots` indexable | `index, follow` on all landings |
| [x] | In XML sitemap | All 10 in `sitemap.xml` |
| [x] | `sm-site-base` injector (assets load on pretty URLs) | All 10 pages |
| [x] | Hero text left-aligned (layout) | `css/landing.css` |

**Canonical note:** Doc examples use trailing-slash pretty URLs (`/post-tavr-cardiac-monitoring/`). Current canonicals use **`.html`** to match live Apache production at [specialized-med.com](https://www.specialized-med.com/). Pretty URLs still work via `_redirects` / `.htaccess`. Confirm with client which canonical form they want for final acceptance.

---

## Title / meta / H1 reference table

| Page | Title tag | H1 |
|------|-----------|-----|
| Cardiac monitoring services | Cardiac Monitoring Services \| Holter, Event & MCT \| Specialized Medical | Turnkey **Cardiac Monitoring Services** |
| MCT | Mobile Cardiac Telemetry (MCT) \| Live ECG & Alerts \| Specialized Medical | Mobile Cardiac Telemetry **(MCT)** |
| Holter | Holter Monitoring Services (24–48 Hour) \| Specialized Medical | 24–48 Hour **Holter Monitoring** |
| Long-term Holter | Long-Term Holter Monitoring \| Extended Wear ECG \| Specialized Medical | Long-Term **Holter Monitoring** |
| Event monitoring | Cardiac Event Monitoring \| Symptom & Rhythm Capture \| Specialized Medical | Cardiac **Event Monitoring** |
| Ambulatory | Ambulatory Cardiac Monitoring \| Holter, Event & MCT \| Specialized Medical | Ambulatory **Cardiac Monitoring** |
| S-Patch | S-Patch Monitoring System \| Live ECG Cardiac Monitor \| Specialized Medical | S-Patch **Monitoring System** |
| Live ECG | Live ECG Monitoring \| Live-Streaming ECG Data \| Specialized Medical | Live-Streaming **ECG Monitoring** |
| Post-TAVR | Post-TAVR Cardiac Monitoring \| Live ECG & MCT \| Specialized Medical | Post-TAVR Cardiac Monitoring with **Live-Streaming ECG** |
| Cardiology practice | Cardiac Monitoring for Cardiology Practices \| Specialized Medical | Cardiac Monitoring for **Cardiology Practices** |

---

## Page-specific requirements

### `/cardiac-monitoring-services/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | Turnkey cardiac monitoring overview | Done |
| [x] | Holter, Long-Term Holter, Event, MCT covered | Modality cards + copy |
| [x] | Live ECG, 24/7 support, S-Patch, reporting, workflow, no-risk pilot | Body + list |
| [x] | Links to MCT, Holter, Long-Term Holter, Event, S-Patch, Live ECG, Post-TAVR, Contact | Related links + cards |

### `/mobile-cardiac-telemetry-mct/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | What MCT is | Section |
| [x] | Live-streaming ECG + 24/7 support | Section |
| [x] | Alerts, physician-ready reports, patient support | Section |
| [x] | Post-TAVR relevance + link to Post-TAVR page | Body + link |

### `/holter-monitoring-services/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | 24–48 hour Holter explained | Done |
| [x] | Setup workflow + reporting | Section |
| [x] | Symptom support + patient experience | Section |
| [x] | CTA: demo or no-risk pilot | Custom CTA on page |

### `/long-term-holter-monitoring/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | Beyond 24–48 hours explained | Done |
| [x] | “Extended Holter” as supporting phrase only | Body + FAQ |
| [x] | S-Patch comfort, reporting, workflow, pilot | Section |
| [x] | FAQ: Long-Term Holter vs Extended Holter | FAQ #1 |

### `/cardiac-event-monitoring/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | Event monitoring + longer windows | Done |
| [x] | Symptom logging + rhythm-event capture | Section |
| [x] | Alerts, reporting, patient support | Section |
| [x] | FAQ: Event vs Holter | FAQ #1 |

### `/ambulatory-cardiac-monitoring/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | Broader category explained | Done |
| [x] | Covers Holter, Long-Term Holter, Event, MCT | Cards |
| [x] | Links to each modality page | Cards |
| [x] | Choosing modality by physician order/workflow | Section |

### `/s-patch-cardiac-monitoring-system/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | S-Patch as primary featured system | Done |
| [x] | Comfort, battery, water resistance (IP55), live ECG, patient experience, reporting | Section |
| [x] | Lead-Wire comparison without undermining either | Section + equipment link |
| [x] | Links to Live ECG, Post-TAVR, Equipment, Contact | Related links |

### `/live-ecg-monitoring/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | Live-streaming ECG + real-time visibility | Done |
| [x] | Symptom logging, alerts, reduced upload delays | Section |
| [x] | Rural/lower-coverage + physician-ready reporting | Section |
| [x] | No guaranteed connectivity/outcomes | Explicit disclaimers |

### `/post-tavr-cardiac-monitoring/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | URL path `post-tavr-cardiac-monitoring` | File + redirects |
| [x] | SEO title (exact) | Post-TAVR Cardiac Monitoring \| Live ECG & MCT \| Specialized Medical |
| [x] | H1 (exact) | Post-TAVR Cardiac Monitoring with Live-Streaming ECG |
| [x] | Primary CTA: Discuss Post-TAVR Monitoring Support | Hero + bottom CTA |
| [x] | Secondary: Request a Demo / Start a No-Risk Pilot | Hero buttons |
| [x] | Direct-answer paragraph (MCT, S-Patch, live ECG, 24/7, reports, alerts) | Hero lead |
| [x] | Why Post-TAVR rhythm monitoring matters | Section |
| [x] | Live ECG, S-Patch, cellular, rural support | Section |
| [x] | Workflow: Enroll → Hook Up → Monitor/Alert → Physician-ready report | 4-step list |
| [x] | Reporting & notification (neutral, protocol-based) | Section |
| [x] | Post-TAVR-specific FAQs (6) | Done |
| [x] | No guaranteed detection/outcome/reimbursement language | Disclaimers throughout |

### `/cardiology-practice-cardiac-monitoring/`

| Done | Requirement | Status |
|:----:|-------------|--------|
| [x] | Turnkey workflow for cardiology practices | Done |
| [x] | Implementation, staff workflow, equipment, reports, patient support, pilot | Cards |
| [x] | Links to service pages + Contact | Related links |
| [x] | Direct CTA: discuss workflow / request demo | Hero + CTA |

---

## Internal linking map (implemented)

| From | Links to new landings |
|------|------------------------|
| `index.html` | Service summary cards → all modalities + Post-TAVR; TAVR card → Post-TAVR; footer triple |
| `services.html` | Breakdown cards → all modalities; Post-TAVR band → 3 links |
| Each landing page | Related modality pages + `contact.html` |
| `partials/footer.html` | MCT, Holter, Event → landing pages |
| **Not linked** | Top nav still points to `services.html` only (not required by Stage 2 doc) |

---

## Technical / deploy checklist

| Done | Item | Status |
|:----:|------|--------|
| [x] | 10 HTML files at repo root | Done |
| [x] | `_redirects` pretty URL rules (Netlify) | Done |
| [x] | `.htaccess` pretty URL rules (Apache production) | Done |
| [x] | `sitemap.xml` includes all 10 pages | Done |
| [x] | `scripts/apply-partials.mjs` registers landings | Done |
| [x] | `netlify.toml` publish = `.` | Done |
| [x] | Layout fixes pushed to `main` | Commit `2eca7fc` |
| [ ] | Deployed to **production** specialized-med.com | **Pending** — currently on Netlify preview only |
| [ ] | Client acceptance sign-off | **Pending** |

---

## Stage 2 acceptance proof pack (submit to client)

Collect these after final production deploy:

| Done | Proof item |
|:----:|------------|
| [ ] | Live URL list (all 10 pages) |
| [ ] | Title / meta / H1 table (copy from section above or export) |
| [ ] | Indexability confirmation (`index, follow`, no `noindex`) |
| [ ] | Canonical screenshot or view-source per page |
| [ ] | Direct-answer opening inventory (screenshot or URL list) |
| [ ] | FAQ inventory (screenshot showing visible Q&As open) |
| [ ] | CTA screenshots |
| [ ] | Internal link map (or this document) |
| [ ] | Sitemap screenshot or `sitemap.xml` export |
| [ ] | Post-TAVR page live URL + screenshot |

---

## Known gaps / decisions for client

1. **Production deploy** — Code is on GitHub `main` and Netlify preview; not yet merged to live [specialized-med.com](https://www.specialized-med.com/) Apache hosting.
2. **Canonical format** — `.html` canonicals vs doc’s trailing-slash URLs; both URL forms work via redirects.
3. **Nav menu** — Does not list individual landings (only Services); add only if client wants.
4. **Homepage / services** — Now link into landings; nav unchanged by design.

---

## Quick QA steps (5 minutes)

1. Open Post-TAVR page → confirm left-aligned hero, FAQs open, full-width FAQ block.
2. Click footer “Holter Monitoring” → lands on holter page.
3. From `services.html` → click MCT card → MCT landing loads with styles.
4. View page source → confirm canonical + FAQPage JSON-LD present.
5. Open `sitemap.xml` on deploy → confirm all 10 `.html` URLs listed.

---

*Generated from codebase audit on branch `main` (commit `2eca7fc`). Update checkboxes as you verify on Netlify and production.*
