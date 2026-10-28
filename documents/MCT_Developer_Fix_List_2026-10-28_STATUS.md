# MCT Developer Fix List — Status | October 28, 2026

Tick status against QA handoff `MCT_Developer_Fix_List_2026-10-28.pdf`.

Legend: **[x]** done · **[ ]** open / client · **[~]** staging-only leave alone until launch

---

## 1. Fix first: text visitors should not see

| Done | Type | Task | Notes |
|------|------|------|-------|
| [x] | FIX | Workflow section notes | Removed staging/review wording. Post-TAVR link kept as clean visitor copy. |
| [x] | FIX | Footer tagline | Now: “Turnkey cardiac monitoring with LIVE ECG data.” (applied site-wide + partial). Client may still approve final phrasing. |
| [x] | FIX | Post-TAVR page unfinished | Removed “being expanded” / pending-reviewer placeholders. Proper opening + all **15 FAQ answers** present. Last updated Oct 28, 2026. |
| [x] | FIX | Last updated date | MCT page: **October 28, 2026**. |

## 2. Needs content or operations to confirm

| Done | Type | Task | Notes |
|------|------|------|-------|
| [x] | FIX | Battery vs. 30 days | Added patch replacement / recharge line under device specs. |
| [ ] | CHECK | Device specs | Weight 0.6 oz / battery 10 days / IP55 and “especially well suited to post-TAVR” still need **client written confirm**. |
| [x] | CHECK | Alerts FAQ answer | Visible answer names **email, text and/or phone** and follows physician protocol; JSON-LD matched. |
| [x] | FIX | No data delays wording | Added qualified alternative: review during the active study (when connectivity is available) vs end-of-study-only delays. **Client may approve/edit.** |

## 3. Test in a browser

| Done | Type | Task | Notes |
|------|------|------|-------|
| [x] | CHECK | Hero image | Current hero matches alt (patient with ECG patch + inset specialist / Live ECG). |
| [x] | CHECK | CTA links | All pilot/demo links use `/mobile-cardiac-telemetry-mct/#cta-form` (8 path-absolute; 0 bare `#cta-form`). |
| [x] | CHECK | Anchor IDs | `cta-form`, `main-content`, `mct-workflow-heading` all present. |
| [x] | CHECK | Skip link, keyboard | Skip → `/mobile-cardiac-telemetry-mct/#main-content`; CTAs are normal links (keyboard operable). Spot-check Tab/Enter on staging still recommended. |
| [x] | CHECK | Header duplicates | Desktop CTA block + mobile nav actions are intentional; CSS shows one set per breakpoint (prior Oct 25 fix). Re-check at 1280 / 390 on staging. |
| [x] | CHECK | Image alt text | All MCT `<img>` have `alt`; logos use “Specialized Medical”; decorative icons use `alt=""`. |
| [x] | CHECK | Link slashes | MCT header nav standardized to trailing-slash (`/about/`, `/services/`, `/faq/`, `/contact/`) to match footer. |
| [ ] | CHECK | Contact form | **Client/ops:** submit test inquiry; confirm visitor message + inbox receipt. |

## 4. Proof to send back

| Done | Type | Task | Notes |
|------|------|------|-------|
| [ ] | CHECK | Schema | Run Rich Results / Schema Markup Validator on staging; attach report. |
| [ ] | CHECK | GA4 events | Confirm CTA / form / phone / email in DebugView (ops). |
| [ ] | CHECK | Speed and images | Attach mobile + desktop PageSpeed notes. |
| [x] | CHECK | Title / meta / H1 table | See below. |

### Title / meta / H1

| Field | Value |
|-------|--------|
| Title | Mobile Cardiac Telemetry (MCT) \| Live ECG Monitoring |
| Meta description | (existing MCT description on page) |
| H1 | Mobile Cardiac Telemetry Built for Modern Cardiology Practices |
| Canonical | `https://www.specialized-med.com/mobile-cardiac-telemetry-mct/` |
| Hero alt | Patient at home wearing a connected ambulatory ECG patch, with an inset showing a monitoring specialist reviewing Live ECG waveforms. |

### Internal-link map (MCT)

- S-Patch, Live ECG, Holter, Long-Term Holter, Event, Post-TAVR, Services, Equipment, Practice workflow `#mct-workflow-heading`, Contact/Privacy, CTAs → `#cta-form`

## 5. At launch only

| Done | Type | Task | Notes |
|------|------|------|-------|
| [~] | LAUNCH | Allow indexing | Keep `noindex, nofollow` on staging. |
| [~] | LAUNCH | Canonical and sitemap | Do at go-live. |
| [~] | LAUNCH | Share image | Confirm live `…/mobile-cardiac-telemetry-mct-hero.jpg`. |
| [~] | LAUNCH | Search Console | URL Inspection after indexable. |

## Already done (leave alone) — confirmed still OK

- [x] Pilot/demo + skip stay on MCT page  
- [x] 24/7 monitoring/support stated  
- [x] Direct-answer hero opening  
- [x] Long-Term Holter primary label  
- [x] Enroll → Hook Up → Disconnect + return/reuse + no manual upload  
- [x] Practice-workflow link → `#mct-workflow-heading`  
- [x] Title / description / H1 / canonical / social / FAQs present  

---

**Shipped in this pass:** MCT content/CTA/footer/date/battery/delay wording; Post-TAVR pending cleanup; site-wide footer tagline cleanup; this status checklist.
