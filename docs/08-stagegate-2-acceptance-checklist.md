# Specialized Medical SEO / AEO — Stagegate 2 Checklist

**Prepared for:** Specialized Medical, LLC  
**Prepared by:** Development team  
**Date:** July 20, 2026  
**Source:** `Specialized_Medical_Stagegate_2_SEO_AEO.docx`  
**Branch:** `stagegate-2-seo-aeo-landing-pages`  
**Repo:** [Nauman440/specialzed-med](https://github.com/Nauman440/specialzed-med)

**Legend**
- `[x]` = Done in code (developer side)
- `[ ]` = Pending client acceptance / live production proof

---

## General Project Rules — Required for All Stages

| Done | Task / Requirement | Acceptance proof / Notes |
|:----:|-------------------|-------------------------|
| [ ] | No full upfront payment. Each stage paid only after deliverables completed, documented, reviewed, and accepted. | Payment terms |
| [x] | All new pages use visible, crawlable HTML content (not images/screenshots/hidden text for SEO). | Live page review |
| [x] | All claims cautious and accurate. No guaranteed reimbursement, profit, clinical outcome, detection, or speed of intervention. | Content review |
| [x] | Consistent terms: Specialized Medical, S-Patch Monitoring System, Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, Mobile Cardiac Telemetry, live-streaming ECG data, Post-TAVR Cardiac Monitoring. | Content review |
| [x] | Each page: unique title, meta description, H1, direct-answer opening, visible FAQ-style Q&As, CTA, internal links, self-referencing canonical, sitemap inclusion. | URL/title/meta table below |
| [x] | Schema matches visible page content. No hidden FAQ schema. No invented credentials/outcomes. | Schema validation |
| [x] | No paid SEO subscriptions, backlink services, directories, reporting platforms, plugins, call-tracking, or recurring outside costs added. | Written confirmation |
| [ ] | Deliverables proven with screenshots, live URLs, validation results, lists, or reports. | Closeout proof — **client to verify on live deploy** |

---

## Stage 2 — Dedicated Landing Page Buildout and Core SEO/AEO Content

**Milestone:** Dedicated landing page buildout and core SEO/AEO content  
**Payment trigger:** Payment due after all ten service landing pages are live, indexable, internally linked, documented, and accepted.

### Required landing pages to publish

| Done | Required landing page | Proof / Notes |
|:----:|----------------------|---------------|
| [x] | Build and publish `/cardiac-monitoring-services/` | File: `cardiac-monitoring-services.html` · `_redirects` + `.htaccess` |
| [x] | Build and publish `/mobile-cardiac-telemetry-mct/` | File: `mobile-cardiac-telemetry-mct.html` |
| [x] | Build and publish `/holter-monitoring-services/` | File: `holter-monitoring-services.html` |
| [x] | Build and publish `/long-term-holter-monitoring/` | File: `long-term-holter-monitoring.html` |
| [x] | Build and publish `/cardiac-event-monitoring/` | File: `cardiac-event-monitoring.html` |
| [x] | Build and publish `/ambulatory-cardiac-monitoring/` | File: `ambulatory-cardiac-monitoring.html` |
| [x] | Build and publish `/s-patch-cardiac-monitoring-system/` | File: `s-patch-cardiac-monitoring-system.html` |
| [x] | Build and publish `/live-ecg-monitoring/` | File: `live-ecg-monitoring.html` |
| [x] | Build and publish `/post-tavr-cardiac-monitoring/` | File: `post-tavr-cardiac-monitoring.html` |
| [x] | Build and publish `/cardiology-practice-cardiac-monitoring/` | File: `cardiology-practice-cardiac-monitoring.html` |
| [ ] | **Live URL proof on production** specialized-med.com | Pending production deploy |

---

## Stage 2 Requirements — Every Landing Page

| Done | Every landing page must include | Proof / Notes |
|:----:|--------------------------------|---------------|
| [x] | Unique SEO title tag | See title table below |
| [x] | Unique meta description | See title table below |
| [x] | One clear H1 heading | All 10 pages |
| [x] | Proper H2/H3 subheadings | Body sections on all pages |
| [x] | 2–4 sentence direct-answer opening paragraph at top | `landing-hero__lead` on all pages |
| [x] | Clear explanation of who the service/page is for | Body copy |
| [x] | Clear explanation of how the service works | Body copy |
| [x] | Specialized Medical positioned as turnkey cardiac monitoring provider | All pages |
| [x] | S-Patch and/or live-streaming ECG language where appropriate | All pages |
| [x] | 24/7 monitoring and arrhythmia alert language where appropriate | MCT, overview, Post-TAVR, Live ECG, etc. |
| [x] | Physician-ready reporting language | All pages |
| [x] | Patient-friendly monitoring language | Holter, S-Patch, Event, practice pages |
| [x] | Neutral billing/support wording only | All pages |
| [x] | No guaranteed reimbursement, profit, clinical outcome, or detection language | Disclaimers + FAQ answers |
| [x] | 4–6 visible FAQ-style questions and answers | 5 FAQs × 9 pages; 6 on Post-TAVR |
| [x] | FAQ accordion functional (open/close) | Fixed: `faq-accordion` class + `main.js` |
| [x] | CTA section (Demo / Pilot / Talk / Post-TAVR discuss) | `figma-cta` → contact on all pages |
| [x] | Internal links to related pages | Cross-links + services/index/footer |
| [x] | Self-referencing canonical URL | All pages (`.html` form; pretty URLs via redirects) |
| [x] | Page indexable (`index, follow`) | All landings |
| [x] | Page in XML sitemap | `sitemap.xml` — all 10 URLs |
| [x] | Hero banner left-aligned (layout QA) | `css/landing.css` |
| [x] | FAQ section full content width (layout QA) | `css/landing.css` |

---

## Title / Meta / H1 Table

| Page | Title tag | Meta description | H1 |
|------|-----------|------------------|-----|
| Cardiac monitoring services | Cardiac Monitoring Services \| Holter, Event & MCT \| Specialized Medical | Turnkey cardiac monitoring services from Specialized Medical: Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry with live-streaming ECG data. | Turnkey **Cardiac Monitoring Services** |
| MCT | Mobile Cardiac Telemetry (MCT) \| Live ECG & Alerts \| Specialized Medical | Mobile Cardiac Telemetry (MCT) with live-streaming ECG data, 24/7 monitoring support, arrhythmia alerts, and physician-ready reports from Specialized Medical—including Post-TAVR relevance. | Mobile Cardiac Telemetry **(MCT)** |
| Holter | Holter Monitoring Services (24–48 Hour) \| Specialized Medical | 24–48 hour Holter Monitoring services from Specialized Medical with patient-friendly setup, S-Patch technology, physician-ready reports, and a no-risk pilot program option. | 24–48 Hour **Holter Monitoring** |
| Long-term Holter | Long-Term Holter Monitoring \| Extended Wear ECG \| Specialized Medical | Long-Term Holter Monitoring beyond 24–48 hours from Specialized Medical, featuring the S-Patch Monitoring System, physician-ready reporting, workflow support, and a no-risk pilot option. | Long-Term **Holter Monitoring** |
| Event monitoring | Cardiac Event Monitoring \| Symptom & Rhythm Capture \| Specialized Medical | Cardiac Event Monitoring from Specialized Medical for longer ambulatory windows with symptom logging, rhythm-event capture, alerts, physician-ready reports, and patient support. | Cardiac **Event Monitoring** |
| Ambulatory | Ambulatory Cardiac Monitoring \| Holter, Event & MCT \| Specialized Medical | Ambulatory cardiac monitoring overview from Specialized Medical covering Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry for physician practices. | Ambulatory **Cardiac Monitoring** |
| S-Patch | S-Patch Monitoring System \| Live ECG Cardiac Monitor \| Specialized Medical | The S-Patch Monitoring System is Specialized Medical’s primary featured cardiac monitor—compact, patient-friendly, with live ECG data support, reporting, and practice workflow integration. | S-Patch **Monitoring System** |
| Live ECG | Live ECG Monitoring \| Live-Streaming ECG Data \| Specialized Medical | Live-streaming ECG monitoring from Specialized Medical for real-time rhythm visibility, symptom logging, arrhythmia alerts, and physician-ready reports—without guaranteed connectivity claims. | Live-Streaming **ECG Monitoring** |
| Post-TAVR | Post-TAVR Cardiac Monitoring \| Live ECG & MCT \| Specialized Medical | Post-TAVR cardiac monitoring with live-streaming ECG, MCT, S-Patch technology, 24/7 monitoring support, and physician-ready reports from Specialized Medical. | Post-TAVR Cardiac Monitoring with **Live-Streaming ECG** |
| Cardiology practice | Cardiac Monitoring for Cardiology Practices \| Specialized Medical | Turnkey cardiac monitoring for cardiology practices: implementation, staff workflow, equipment, physician-ready reports, patient support, and a no-risk pilot program from Specialized Medical. | Cardiac Monitoring for **Cardiology Practices** |

---

## Page-Specific Checklists

### `/cardiac-monitoring-services/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Explain turnkey cardiac monitoring services | Body section |
| [x] | Include Holter, Long-Term Holter, Event Monitoring, MCT | Modality cards |
| [x] | Live ECG, 24/7 support, S-Patch, reporting, workflow, no-risk pilot | Body + list |
| [x] | Link to MCT, Holter, Long-Term Holter, Event, S-Patch, Live ECG, Post-TAVR, Contact | Related links |

### `/mobile-cardiac-telemetry-mct/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Explain what Mobile Cardiac Telemetry is | Section |
| [x] | Live-streaming ECG + 24/7 monitoring support | Section |
| [x] | Arrhythmia alerts, physician-ready reports, patient support | Section |
| [x] | Post-TAVR use-case + link to Post-TAVR page | Body + link |

### `/holter-monitoring-services/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Explain 24–48 hour Holter Monitoring | Section |
| [x] | Setup workflow and reporting process | Section |
| [x] | Symptom support and patient experience | Section |
| [x] | CTA: request demo or start no-risk pilot | Custom CTA |

### `/long-term-holter-monitoring/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Explain Long-Term Holter beyond 24–48 hours | Section |
| [x] | “Extended Holter” only as supporting phrase | Body + FAQ |
| [x] | S-Patch comfort, reporting, workflow, no-risk pilot | Section |
| [x] | FAQ: Long-Term Holter vs Extended Holter | FAQ #1 |

### `/cardiac-event-monitoring/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Event Monitoring and longer windows | Section |
| [x] | Symptom logging and rhythm-event capture | Section |
| [x] | Alerts, reporting, patient support | Section |
| [x] | FAQ: Event vs Holter Monitoring | FAQ #1 |

### `/ambulatory-cardiac-monitoring/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Ambulatory cardiac monitoring as broader category | Section |
| [x] | Cover Holter, Long-Term Holter, Event, MCT | Cards |
| [x] | Link to each modality page | Cards |
| [x] | Choosing monitoring type by physician order/workflow | Section |

### `/s-patch-cardiac-monitoring-system/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | S-Patch as primary featured monitoring system | Section |
| [x] | Comfort, battery, water resistance (IP55), live ECG, patient experience, reporting | Section |
| [x] | Lead-Wire comparison without undermining either | Section + equipment link |
| [x] | Link to Live ECG, Post-TAVR, Equipment, Contact | Related links |

### `/live-ecg-monitoring/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Live-streaming ECG + real-time rhythm visibility | Section |
| [x] | Symptom logging, arrhythmia alerts, reduced upload delays | Section |
| [x] | Rural/lower-coverage support + physician-ready reporting | Section |
| [x] | No guaranteed connectivity or outcomes | Explicit disclaimers |

### `/post-tavr-cardiac-monitoring/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | URL: `https://www.specialized-med.com/post-tavr-cardiac-monitoring/` | Redirects + `.htaccess` |
| [x] | SEO title: Post-TAVR Cardiac Monitoring \| Live ECG & MCT \| Specialized Medical | Exact match |
| [x] | H1: Post-TAVR Cardiac Monitoring with Live-Streaming ECG | Exact match |
| [x] | Primary CTA: Discuss Post-TAVR Monitoring Support | Hero + bottom CTA |
| [x] | Secondary CTA: Request a Demo / Start a No-Risk Pilot Program | Hero buttons |
| [x] | Direct-answer: MCT, S-Patch, live ECG, 24/7 support, reports, alerts | Hero lead |
| [x] | Why Post-TAVR rhythm monitoring matters | Section |
| [x] | Live ECG, S-Patch, cellular transmission, rural support | Section |
| [x] | Workflow: Enroll → Hook Up → Monitor/Alert → Physician-ready report | 4-step list |
| [x] | Reporting & notification (neutral, protocol-based) | Section |
| [x] | Post-TAVR-specific FAQs (6) | FAQ section |
| [x] | No guaranteed detection/outcome/reimbursement language | Disclaimers |

### `/cardiology-practice-cardiac-monitoring/`

| Done | Specific requirement | Proof / Notes |
|:----:|---------------------|---------------|
| [x] | Turnkey monitoring workflow for cardiology practices | Section |
| [x] | Implementation, staff workflow, equipment, reports, patient support, pilot | Cards |
| [x] | Link to service pages and Contact | Related links |
| [x] | Direct CTA: discuss workflow or request demo | Hero + CTA |

---

## Internal Linking (developer complete)

| Done | Link source | Links to new landings |
|:----:|-------------|----------------------|
| [x] | `services.html` | All modality cards + Post-TAVR band + hub links (ambulatory, S-Patch, live ECG, practices) |
| [x] | `index.html` | Service summary cards + TAVR card + footer |
| [x] | Each landing page | Related pages + contact |
| [x] | `partials/footer.html` | MCT, Holter, Event landings |
| [ ] | Top nav → individual landings | Not required by scope; nav still → Services |

---

## Stage 2 Acceptance Proof Required (client sign-off)

| Done | Stage 2 acceptance proof required | Proof / Notes |
|:----:|----------------------------------|---------------|
| [ ] | Live URL list for all ten pages | URL list |
| [ ] | Title tag, meta description, H1 for each page | This document / view-source |
| [ ] | Each page confirmed indexable | Indexability proof |
| [ ] | Each page has self-referencing canonical | Source/code proof |
| [ ] | Each page has direct-answer content | AEO inventory |
| [ ] | Each page has visible FAQ content | FAQ inventory + screenshots |
| [ ] | Each page has CTA section | CTA screenshots |
| [ ] | Each page has internal links | Internal link map |
| [ ] | Sitemap inclusion for each live page | Sitemap screenshot/export |
| [ ] | Post-TAVR page live URL + screenshot | Post-TAVR proof |

**Stage 2 accepted by Specialized Medical:** Date: _______________

---

## Developer notes (not blockers for code complete)

1. **Canonical format:** Pages use `.html` canonicals to match live Apache at [specialized-med.com](https://www.specialized-med.com/). Pretty trailing-slash URLs work via `_redirects` (Netlify) and `.htaccess` (production).
2. **Production deploy:** Code complete on branch; live specialized-med.com deploy pending.
3. **Preview:** Netlify preview available for QA before production merge.
4. **Automated QA:** Run `node scripts/qa-stagegate2.mjs` — see `docs/09-stagegate-2-qa-report.json`.
