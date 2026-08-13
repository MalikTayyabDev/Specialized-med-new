/**
 * MCT SEO/AEO Implementation Guide (Aug 2026) acceptance QA.
 * Run: node scripts/qa-mct-guide.mjs
 */
import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const html = readFileSync(join(ROOT, "mobile-cardiac-telemetry-mct.html"), "utf8")

let failures = 0
let passes = 0

function check(ok, label) {
  if (ok) {
    passes++
    console.log(`  PASS  ${label}`)
  } else {
    failures++
    console.log(`  FAIL  ${label}`)
  }
}

console.log("\n=== Metadata ===")
check(
  html.includes("<title>Mobile Cardiac Telemetry (MCT) With LIVE ECG | Specialized Medical</title>"),
  "Preferred title tag"
)
check(
  html.includes(
    'content="Mobile Cardiac Telemetry (MCT) provides up to 30 days of LIVE ECG streaming, attended surveillance, prescribed notifications, and physician-ready reports."'
  ),
  "Meta description exact"
)
check(html.includes('rel="canonical" href="https://www.specialized-med.com/mobile-cardiac-telemetry-mct.html"'), "Canonical")
check(html.includes('content="index, follow, max-image-preview:large"'), "Robots max-image-preview")
check(html.includes("Mobile Cardiac Telemetry (MCT) With LIVE ECG Monitoring"), "OG title / H1 phrase")
check((html.match(/<h1[\s>]/g) || []).length === 1, "Exactly one H1")
check(html.includes("LIVE ECG STREAMING. ATTENDED SURVEILLANCE. PHYSICIAN-READY INFORMATION."), "Hero eyebrow")
check(html.includes("Request an MCT Demonstration"), "Primary CTA")
check(html.includes("Start a No-Risk Pilot Program"), "Secondary CTA")

console.log("\n=== Section order / headings ===")
const headings = [
  "What Is Mobile Cardiac Telemetry",
  "Why Mobile Cardiac Telemetry Provides More Active",
  "Evidence Supporting Mobile Cardiac",
  "How MCT Differs From Holter and",
  "When Physicians May Consider Mobile Cardiac",
  "Clinically Important Rhythm Findings MCT",
  "Evaluating Treatment Response During an Active",
  "MCT for Post-Procedure and Post-TAVR",
  "LIVE MCT Monitoring Built Around the",
  "Patient Symptom Logging and",
  "A Turnkey MCT Workflow for the",
  "CPT Codes Commonly Associated With Mobile Cardiac",
  "Author, Clinical Review and",
]
let last = -1
for (const h of headings) {
  const i = html.indexOf(h)
  check(i !== -1 && i > last, `Heading in order: ${h}`)
  if (i !== -1) last = i
}

console.log("\n=== Evidence & citations ===")
check(html.includes("88%") && html.includes("75%"), "Rothman diagnostic-yield stats")
check(html.includes("41%") && html.includes("15%"), "Rothman clinically significant arrhythmia stats")
check(html.includes("7 of 21"), "Olson medication titration statistic")
check(html.includes("study-specific") || html.includes("studied population"), "Study-specific yield wording")
check(html.includes("articleId=59268") || html.includes("cms.gov"), "Citation link CMS")
check(html.includes("PMC6931745"), "Citation link ISHNE-HRS")
check(html.includes("pubmed.ncbi.nlm.nih.gov/17318994"), "Citation link Rothman")
check(html.includes("pubmed.ncbi.nlm.nih.gov/17343724"), "Citation link Olson")
check(html.includes("pubmed.ncbi.nlm.nih.gov/38388248"), "Citation link Post-TAVR MCT")

console.log("\n=== Comparison / technology / CPT ===")
check(html.includes("landing-table--mct-compare"), "Guide comparison table")
check(html.includes("Operational visibility means"), "Operational vs clinical distinction")
check(html.includes("S-Patch weight: 0.6 oz"), "Device spec weight")
check(html.includes("Minimum battery duration: 10 days"), "Device spec battery")
check(html.includes("Water resistance: IP55"), "Device spec IP55")
check(html.includes("CPT 93228") && html.includes("CPT 93229"), "CPT codes present")
check(html.includes("does not guarantee payment") || html.includes("does not guarantee payment, reimbursement"), "No payment guarantee")

console.log("\n=== FAQs ===")
const faqCount = (html.match(/class="faq-item__trigger"/g) || []).length
check(faqCount === 18, `18 visible FAQs (found ${faqCount})`)
const faqQs = [
  "What is Mobile Cardiac Telemetry (MCT)?",
  "How long can a patient wear an MCT monitor?",
  "What is the difference between MCT and Holter monitoring?",
  "What is the difference between MCT and Cardiac Event Monitoring?",
  "Does MCT have a higher diagnostic yield than a standard loop event monitor?",
  "Can MCT detect arrhythmias when the patient has no symptoms?",
  "What rhythm findings may be captured by MCT?",
  "Can physicians receive notifications during an MCT study?",
  "Can MCT help evaluate a medication change?",
  "Can MCT be used after TAVR?",
  "Can MCT be used after an ablation or other arrhythmia procedure?",
  "How does Specialized Medical monitor whether the test is working?",
  "How are patient symptoms documented?",
  "Does the system work in rural areas?",
  "What CPT codes are commonly used for MCT?",
  "Does MCT replace inpatient telemetry or emergency care?",
  "Who interprets the MCT findings?",
]
for (const q of faqQs) {
  check(html.includes(q), `FAQ: ${q.slice(0, 60)}`)
}
check(html.includes("How can a practice evaluate Specialized Medical"), "FAQ: practice evaluation")

console.log("\n=== Links / form / EEAT / guardrails ===")
check(html.includes('href="cardiac-monitoring-services.html"'), "Link CMS")
check(html.includes('href="live-ecg-monitoring.html"'), "Link LIVE ECG")
check(html.includes('href="s-patch-cardiac-monitoring-system.html"'), "Link S-Patch")
check(html.includes('href="cardiac-event-monitoring.html"'), "Link Event")
check(html.includes('href="holter-monitoring-services.html"'), "Link Holter")
check(html.includes('href="long-term-holter-monitoring.html"'), "Link LTH")
check(html.includes('href="post-tavr-cardiac-monitoring.html"'), "Link Post-TAVR")
check(html.includes('href="cardiology-practice-cardiac-monitoring.html"'), "Link practice")
check(html.includes('href="services/equipment.html"'), "Link equipment")
check(html.includes('href="contact.html"'), "Link contact")
check(html.includes("Cardiac Monitoring Services</a>") || html.includes(">Cardiac Monitoring Services<"), "Breadcrumb parent CMS")
check(html.includes("Steven M. Burns"), "Author named")
check(!/Clinically reviewed by:\s*Dr\./i.test(html), "No invented physician reviewer")
check(html.includes('name="role"'), "Form field: role")
check(html.includes('name="state"'), "Form field: state")
check(html.includes('name="preferred_contact"'), "Form field: preferred contact")
check(!/"@type":\s*"FAQPage"/.test(html), "No FAQPage JSON-LD")
check(/"@type":\s*"MedicalWebPage"/.test(html), "MedicalWebPage schema")
check(!/never miss what matters/i.test(html), "No banned marketing claim")
check(!/guarantees? immediate alerts/i.test(html), "No immediate-alerts guarantee")
check(!/prevents? stroke/i.test(html), "No prevent-stroke claim")
check(!/uninterrupted coverage is guaranteed/i.test(html), "No uninterrupted coverage guarantee")
check(
  html.includes(
    "Adult wearing an S-Patch cardiac monitor directly on the skin of the upper chest beside a LIVE ECG display for Mobile Cardiac Telemetry."
  ),
  "Guide hero alt text"
)
check(html.includes("mobile cardiac outpatient telemetry (MCOT)"), "MCOT synonym introduced once")

console.log(`\n${passes} passed, ${failures} failed`)
process.exit(failures === 0 ? 0 : 1)
