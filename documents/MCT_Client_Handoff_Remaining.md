# MCT Landing — Remaining Client / Stakeholder Feedback

Share this with the client. Developer-side SEO/AEO work for the MCT landing page is complete in the repo. The items below need Specialized Medical / Netlify / clinical-billing owners.

## Blockers before production indexability

1. **Password-protect Netlify staging**  
   Netlify → Site settings → Access control / password protection. Do not rely on robots.txt alone.

2. **Confirm form delivery**  
   Submit the MCT form from desktop and mobile. Confirm messages arrive in the Specialized Medical inbox, spam controls work, and success redirects to `/thanks/`.

3. **Clinical review**  
   Sign off the claim worksheet: `documents/mct-landing-claim-worksheet.md`  
   Confirm monitoring duration, connectivity wording, evidence citations, and safety statements.

4. **Billing review**  
   Approve CPT 93228 / 93229 and CMS/payer qualified language on the MCT page (Appendix A wording already in place).

5. **QA sign-off**  
   Responsive check at 320 / 375 / 390 / 768 / 1024 / 1440 / 1920  
   Keyboard-only FAQ + form pass  
   Attach PageSpeed / Lighthouse evidence for the deployed URL

## Launch steps (after gates pass)

1. Run `npm run mct:index` (flips page + headers to `index,follow`)  
2. Deploy to production  
3. Verify live source: canonical = `https://www.specialized-med.com/mobile-cardiac-telemetry-mct/`, zero Netlify staging host refs  
4. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools  
5. Assign owners for 48-hour / 7-day / 30-day monitoring

To re-contain the page: `npm run mct:noindex`

## Already done in code (for client context)

- MCT landing page with brand/trust/form/SEO/AEO/schema corrections  
- Privacy Policy page + form link  
- Pretty-URL sitemap  
- Hero WebP (~22 KB)  
- Launch flip scripts  
- Implementation checklist: `documents/MCT_Landing_Implementation_Checklist.md`
