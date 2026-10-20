/**
 * MCT Landing Page SEO/AEO Developer Task List (Oct 13, 2026) — developer acceptance QA.
 * Run: npm run qa:mct
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(ROOT, "mobile-cardiac-telemetry-mct.html"), "utf8");
const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
const redirects = readFileSync(join(ROOT, "_redirects"), "utf8");
const htaccess = readFileSync(join(ROOT, ".htaccess"), "utf8");
const netlify = readFileSync(join(ROOT, "netlify.toml"), "utf8");

let failures = 0;
let passes = 0;

function check(ok, label) {
  if (ok) {
    passes++;
    console.log(`  PASS  ${label}`);
  } else {
    failures++;
    console.log(`  FAIL  ${label}`);
  }
}

console.log("\n=== Stage 0 — Staging containment ===");
check(/noindex,\s*nofollow/i.test(html), "Page robots noindex,nofollow (pre-launch)");
check(/X-Robots-Tag = "noindex, nofollow"/.test(netlify), "netlify.toml X-Robots-Tag");
check(/X-Robots-Tag "noindex, nofollow"/.test(htaccess), ".htaccess X-Robots-Tag");
check(!/zesty-pothos-c8949b\.netlify\.app/.test(html + sitemap), "No Netlify host in page/sitemap");
check(existsSync(join(ROOT, "documents/backups/mct-landing-20261015")), "Rollback backup folder exists");

console.log("\n=== Stage 1 — Brand / trust ===");
check(!/Philips/i.test(html), "No Philips references");
check(!/Compliance wording/i.test(html), "No Compliance wording label");
check(!/Required safety statement/i.test(html), "No Required safety statement label");
check(!/Pending authorized physician/i.test(html), "No placeholder physician review");
check(
  html.includes(
    'alt="Specialized Medical S-Patch mobile cardiac telemetry system with a connected phone displaying live ECG data."'
  ),
  "Approved hero alt text"
);
check(existsSync(join(ROOT, "images/landing/mobile-cardiac-telemetry-mct-hero.webp")), "Hero WebP exists");
check(existsSync(join(ROOT, "images/landing/mobile-cardiac-telemetry-mct-hero.jpg")), "Hero JPG fallback exists");

console.log("\n=== Stage 2 — Conversion / form ===");
check(html.includes('id="cta-form"'), "CTA form anchor present");
check((html.match(/href="#cta-form"/g) || []).length >= 4, "Multiple same-page #cta-form CTAs");
check(html.includes("Start a No-Risk MCT Pilot"), "Primary CTA label");
check(html.includes("Request an MCT Demonstration"), "Secondary CTA label");
check(!/Thank you for/i.test(html.split('id="cta-form"')[1]?.slice(0, 800) || ""), "No premature thank-you in form intro");
check(/Privacy notice:[\s\S]*protected health information/i.test(html), "No-PHI privacy notice");
check(/href="privacy\/?"/.test(html), "Privacy Policy link");
check(/name="botcheck"/.test(html), "Spam botcheck field");
check(/name="name"/.test(html) && /name="organization"/.test(html), "Name + organization fields");
check(/name="role"/.test(html) && /name="email"/.test(html) && /name="phone"/.test(html), "Role/email/phone fields");
check(/name="state"/.test(html) && /name="interest"/.test(html) && /name="preferred_contact"/.test(html), "State/interest/preferred contact");
check(/name="monthly_volume"/.test(html), "Optional volume field");
check(/data-mct-track="mct_cta_pilot"/.test(html), "Pilot CTA tracking attr");
check(/data-mct-track="mct_cta_demo"/.test(html), "Demo CTA tracking attr");
check(/data-mct-track="portal_click"/.test(html), "Portal click tracking attr");
check(/data-mct-track="phone_click"/.test(html), "Phone click tracking attr");

console.log("\n=== Stage 3 — Production URL / on-page SEO ===");
check(
  html.includes('rel="canonical" href="https://www.specialized-med.com/mobile-cardiac-telemetry-mct/"'),
  "Self-referencing canonical (trailing slash)"
);
check(
  html.includes("<title>Mobile Cardiac Telemetry (MCT) | Live ECG Monitoring</title>"),
  "Appendix A title"
);
check(
  html.includes(
    'content="Specialized Medical provides up to 30 days of MCT with live ECG transmission, attended surveillance, prescribed notifications and physician-ready reporting."'
  ),
  "Appendix A meta description"
);
check((html.match(/<h1[\s>]/gi) || []).length === 1, "Exactly one H1");
check(/Mobile Cardiac Telemetry Built for/.test(html), "Appendix A H1");
check(/LIVE ECG STREAMING \| ATTENDED SURVEILLANCE \| PHYSICIAN-READY INFORMATION/.test(html), "Appendix A eyebrow");
check(sitemap.includes("https://www.specialized-med.com/mobile-cardiac-telemetry-mct/"), "Sitemap includes MCT canonical");
check(/mobile-cardiac-telemetry-mct\.html \/mobile-cardiac-telemetry-mct\/ 301/.test(redirects), "_redirects .html → pretty");
check(/mobile-cardiac-telemetry-mct\\.html\$ \/mobile-cardiac-telemetry-mct\//.test(htaccess), ".htaccess .html → pretty");

console.log("\n=== Stage 3.6 — Internal link cluster ===");
const outbound = [
  "holter-monitoring-services/",
  "long-term-holter-monitoring/",
  "cardiac-event-monitoring/",
  "live-ecg-monitoring/",
  "s-patch-cardiac-monitoring-system/",
  "post-tavr-cardiac-monitoring/",
  "services/",
  "contact/",
];
for (const path of outbound) {
  check(html.includes(`href="${path}"`) || html.includes(`href='${path}'`), `Outbound link: ${path}`);
}

console.log("\n=== Stage 4 — AEO / schema ===");
check(/"@type":\s*"MedicalWebPage"/.test(html), "MedicalWebPage schema");
check(/"@type":\s*"Service"/.test(html), "Service schema");
check(/"@type":\s*"BreadcrumbList"/.test(html), "BreadcrumbList schema");
check(/"@type":\s*"FAQPage"/.test(html), "FAQPage schema");
check(/Steven M\. Burns/.test(html), "Author named");
check(/Reviewed by Specialized Medical for service, workflow, and technical accuracy/.test(html), "Editorial review wording");
check(/User-agent:\s*OAI-SearchBot/.test(robots) && /Allow:\s*\//.test(robots), "OAI-SearchBot allowed");

const faqCount = (html.match(/class="faq-item__trigger"/g) || []).length;
check(faqCount >= 8 && faqCount <= 12, `FAQ count 8–12 (found ${faqCount})`);
const faqQs = [
  "What is Mobile Cardiac Telemetry (MCT)?",
  "How long can a patient wear an MCT monitor?",
  "What is the difference between MCT and Holter monitoring?",
  "What is the difference between MCT and Cardiac Event Monitoring?",
  "How do alerts and notifications work during an MCT study?",
  "What does the practice receive from Specialized Medical?",
  "What CPT codes are commonly used for MCT?",
  "Does MCT replace inpatient telemetry or emergency care?",
];
for (const q of faqQs) check(html.includes(q), `Visible FAQ: ${q.slice(0, 48)}`);

console.log("\n=== Stage 5 — Performance / a11y basics ===");
check(/fetchpriority="high"/.test(html), "Hero fetchpriority=high");
check(!/loading="lazy"[\s\S]{0,80}landing-hero__media|landing-hero__media[\s\S]{0,120}loading="lazy"/.test(html), "Hero not lazy-loaded");
check(/class="skip-link"/.test(html), "Skip link present");
check(/scroll-margin-top/.test(readFileSync(join(ROOT, "css/landing-mct.css"), "utf8")), "CTA scroll-margin CSS");
check(/X-Content-Type-Options = "nosniff"/.test(netlify), "Security header: nosniff");
check(/Referrer-Policy = "strict-origin-when-cross-origin"/.test(netlify), "Security header: referrer");

console.log("\n=== Stage 6 — Clinical / billing copy present ===");
check(/CPT 93228/.test(html) && /CPT 93229/.test(html), "CPT 93228 / 93229 present");
check(/does not guarantee coverage, payment, or profitability/i.test(html), "No payment guarantee");
check(/while the study is active and connectivity is available/i.test(html), "Qualified connectivity wording");
check(/does not replace emergency medical services/i.test(html), "Emergency limitation visible");
check(existsSync(join(ROOT, "documents/mct-landing-claim-worksheet.md")), "Claim worksheet exists");

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
