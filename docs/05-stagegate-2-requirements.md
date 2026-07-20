# Stagegate 2 requirements (landing buildout)

Source: `Specialized_Medical_Stagegate_2_SEO_AEO.docx` (client requirements).

## Milestone

Build and publish **10 dedicated landing pages**, each indexable, in sitemap after live, internally linked.

## Required URLs

1. `/cardiac-monitoring-services/`
2. `/mobile-cardiac-telemetry-mct/`
3. `/holter-monitoring-services/`
4. `/long-term-holter-monitoring/`
5. `/cardiac-event-monitoring/`
6. `/ambulatory-cardiac-monitoring/`
7. `/s-patch-cardiac-monitoring-system/`
8. `/live-ecg-monitoring/`
9. `/post-tavr-cardiac-monitoring/`
10. `/cardiology-practice-cardiac-monitoring/`

## Every page must include

- Unique title + meta description
- One clear H1
- Proper H2/H3 structure
- 2–4 sentence **direct-answer** opening
- Who it’s for + how it works
- Specialized Medical as turnkey provider
- S-Patch and/or live-streaming ECG language where appropriate
- 24/7 monitoring + arrhythmia alert language where appropriate
- Physician-ready reporting + patient-friendly language
- Neutral billing wording only (no guaranteed reimbursement/profit/outcome/detection)
- 4–6 **visible** FAQ Q&As
- CTA (demo / pilot / talk / Post-TAVR discuss)
- Internal links
- Self-referencing canonical
- Indexable + sitemap entry after live

## Post-TAVR specifics

- URL: `https://www.specialized-med.com/post-tavr-cardiac-monitoring/`
- Title: `Post-TAVR Cardiac Monitoring | Live ECG & MCT | Specialized Medical`
- H1: `Post-TAVR Cardiac Monitoring with Live-Streaming ECG`
- Primary CTA: Discuss Post-TAVR Monitoring Support
- Secondary: Request a Demo or Start a No-Risk Pilot Program
- Workflow: Enroll in Web Portal → Hook Up → Monitor/Alert → Physician-ready report

## Implementation notes for this repo

- Flat HTML files at repo root + `_redirects` pretty URLs
- Must include `sm-site-base` injector + leaf map entries or **CSS/images break**
- Register pages in `scripts/apply-partials.mjs`
- Prefer modeling visual structure on `services.html` + shared CTA/FAQ classes
- Do not add paid SEO tools or new recurring vendor costs

## Acceptance proof expected by client

Live URL list, title/meta/H1 table, indexability, canonicals, AEO openings, FAQ inventory, CTA proof, internal link map, sitemap inclusion, Post-TAVR screenshots/URLs.
