# MCT Landing Conversion Events

Documented GTM/`dataLayer` event names for `/mobile-cardiac-telemetry-mct/`.  
**Never** include names, emails, phones, organizations, or other user-entered values in event payloads.

| Event name | When it fires | Params (non-PII) |
|---|---|---|
| `mct_cta_pilot` | Primary CTA click (Start a No-Risk MCT Pilot) | `landing_page` |
| `mct_cta_demo` | Secondary CTA click (Request an MCT Demonstration) | `landing_page` |
| `mct_form_start` | First focus inside the MCT lead form | `landing_page` |
| `mct_form_success` | Web3Forms returns `success: true` | `landing_page`, `form_interest` (Pilot / Demonstration / Both only) |
| `phone_click` | Click on `tel:` links on the landing page | `landing_page` |
| `portal_click` | Physician Portal outbound click | `landing_page` |

Implementation: `js/landing-lite.js` on the MCT page (`initLandingAnalytics`, `initLandingCtaForms`). Shared site pages may also use `js/main.js`.
