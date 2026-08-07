/**
 * Post-TAVR SEO/AEO Implementation Guide (Aug 2026) acceptance QA.
 * Run: node scripts/qa-post-tavr-guide.mjs
 */
import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const html = readFileSync(join(ROOT, "post-tavr-cardiac-monitoring.html"), "utf8")

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
  html.includes("<title>Post-TAVR Cardiac Monitoring for Delayed Heart Block | Specialized Medical</title>"),
  "Preferred title tag"
)
check(
  html.includes(
    'content="LIVE post-TAVR cardiac monitoring helps physicians identify delayed heart block, atrial fibrillation and other arrhythmias after discharge. Learn how Specialized Medical supports structural heart teams."'
  ),
  "Meta description exact"
)
check(html.includes('rel="canonical" href="https://www.specialized-med.com/post-tavr-cardiac-monitoring.html"'), "Canonical")
check(html.includes('content="index, follow, max-image-preview:large"'), "Robots max-image-preview")
check(html.includes("Post-TAVR Cardiac Monitoring With LIVE Mobile Cardiac Telemetry"), "OG title / H1 phrase")
check((html.match(/<h1[\s>]/g) || []).length === 1, "Exactly one H1")
check(
  html.includes("Post-TAVR Cardiac Monitoring With") && html.includes("LIVE Mobile Cardiac Telemetry"),
  "H1: Post-TAVR Cardiac Monitoring With LIVE Mobile Cardiac Telemetry"
)
check(html.includes("CONTINUOUS MONITORING. EARLIER INSIGHT. BETTER-INFORMED CARE."), "Hero eyebrow")
check(html.includes("Discuss a Post-TAVR Monitoring Protocol"), "Primary CTA")
check(html.includes("Request a Demonstration"), "Secondary CTA")

console.log("\n=== Section order / headings ===")
const headings = [
  "Why Cardiac Monitoring After TAVR",
  "Detecting Delayed Heart Block After",
  "Which Patients May Benefit From Outpatient",
  "LIVE Monitoring Designed for Structural Heart",
  "Clinically Important Rhythms After",
  "A Practical Post-TAVR Monitoring",
  "Clinical Evidence for Post-TAVR",
  "Follow-Up Alone vs LIVE Ambulatory",
  "Author, Medical Review and",
]
let last = -1
for (const h of headings) {
  const i = html.indexOf(h)
  check(i !== -1 && i > last, `Heading in order: ${h}`)
  if (i !== -1) last = i
}

console.log("\n=== Heart-block prominence & citations ===")
check(html.includes("HEART BLOCK CAN OCCUR AFTER DISCHARGE"), "Required heart-block callout")
check(html.includes("4.6%"), "4.6% study statistic present")
check(html.includes("pubmed.ncbi.nlm.nih.gov/34949396"), "Citation link Muntané-Carol")
check(html.includes("pubmed.ncbi.nlm.nih.gov/31833417"), "Citation link Tian")
check(html.includes("pubmed.ncbi.nlm.nih.gov/35699482"), "Citation link REdireCT")
check(html.includes("pubmed.ncbi.nlm.nih.gov/42059075"), "Citation link 2026 study")
check(html.includes("2020-ACC-Expert-Consensus-Conduction-Disturbances"), "Citation link ACC")
check(/association, not proof of causation/i.test(html), "2026 study labeled as association")

console.log("\n=== Features / workflow / comparison ===")
check(html.includes("LIVE ECG streaming"), "Feature: LIVE ECG streaming")
check(html.includes("Prescribed notifications"), "Feature: Prescribed notifications")
check(html.includes("Operational visibility"), "Feature: Operational visibility")
check(html.includes("Multi-carrier connectivity"), "Feature: Multi-carrier")
check(html.includes("Physician-ready reports"), "Feature: Physician-ready reports")
check(html.includes("Patient and office support"), "Feature: Patient and office support")
check(html.includes("Risk assessment") && html.includes("LIVE outpatient monitoring"), "5-step workflow")
check(html.includes("Follow-up without continuous ambulatory monitoring"), "Comparison table column")

console.log("\n=== FAQs (guide set) ===")
const faqQs = [
  "Why is cardiac monitoring considered after TAVR?",
  "Can heart block occur after a patient leaves the hospital?",
  "What types of heart block can monitoring identify?",
  "How long should patients be monitored after TAVR?",
  "Which post-TAVR patients may be considered for outpatient monitoring?",
  "Can monitoring identify atrial fibrillation after TAVR?",
  "What is the difference between Holter monitoring and Mobile Cardiac Telemetry after TAVR?",
  "Does Specialized Medical provide LIVE ECG streaming?",
  "Can physicians receive alerts during the monitoring period?",
  "Can post-TAVR monitoring help identify patients who may require a pacemaker?",
  "Does monitoring replace inpatient telemetry?",
  "Can patients be monitored while recovering at home?",
  "How are reports delivered?",
  "Is the system suitable for rural patients?",
  "How can a structural heart program evaluate Specialized Medical?",
]
check((html.match(/class="faq-item__trigger"/g) || []).length === faqQs.length, `${faqQs.length} visible FAQs`)
for (const q of faqQs) {
  check(html.includes(q), `FAQ: ${q.slice(0, 60)}`)
}

console.log("\n=== Internal links ===")
check(html.includes('href="mobile-cardiac-telemetry-mct.html"'), "Link MCT")
check(html.includes("LIVE Mobile Cardiac Telemetry"), "MCT anchor text")
check(html.includes('href="live-ecg-monitoring.html"'), "Link LIVE ECG")
check(html.includes('href="s-patch-cardiac-monitoring-system.html"'), "Link S-Patch")
check(html.includes('href="cardiac-monitoring-services.html"'), "Link CMS hub")
check(html.includes('href="cardiology-practice-cardiac-monitoring.html"'), "Link cardiology practice")
check(html.includes("Cardiac Monitoring Services"), "Breadcrumb parent CMS")

console.log("\n=== EEAT / form / guardrails ===")
check(html.includes("Steven M. Burns"), "Author named")
check(html.includes("Pending authorized clinical reviewer"), "Clinical reviewer placeholder")
check(html.includes("Last medically reviewed"), "Last medically reviewed")
check(html.includes("Editorial policy"), "Editorial policy")
check(html.includes('name="role"'), "Form field: role")
check(html.includes('name="preferred_contact"'), "Form field: preferred contact")
check(!/prevents? (sudden death|stroke|readmission)/i.test(html), "No prevent-outcome claims")
check(!/Every TAVR patient needs 30 days/i.test(html), "No every-patient 30-day claim")
check(!/diagnoses complete heart block/i.test(html), "No diagnose claim")
check(!/growth opportunity/i.test(html), "No internal strategy language")
check(html.includes("MedicalWebPage"), "MedicalWebPage schema")
check(html.includes("FAQPage"), "FAQPage schema")
check(
  html.includes("Older adult wearing an S-Patch cardiac monitor on the skin of the upper chest"),
  "Guide hero alt text"
)

console.log(`\n${passes} passed, ${failures} failed`)
process.exit(failures === 0 ? 0 : 1)
