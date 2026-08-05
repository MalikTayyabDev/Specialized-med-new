/**
 * Blueprint v3 Final Acceptance Checklist + PART 1/PART 2 coverage
 * for /cardiac-monitoring-services only.
 *
 * Run: node scripts/qa-cms-blueprint-v3.mjs
 */
import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const html = readFileSync(join(ROOT, "cardiac-monitoring-services.html"), "utf8")

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

console.log("\n=== Blueprint v3 — SEO metadata ===")
check(
  html.includes("<title>Cardiac Monitoring Services | LIVE Streaming ECG | Specialized Medical</title>"),
  "SEO title exact"
)
check(
  html.includes(
    'content="Compare Holter, Extended Holter, Event and Mobile Cardiac Telemetry solutions with LIVE test-status visibility, proactive patient support and physician-ready reporting."'
  ),
  "Meta description exact"
)
check(html.includes('rel="canonical" href="https://www.specialized-med.com/cardiac-monitoring-services.html"'), "Canonical URL")
check((html.match(/<h1[\s>]/g) || []).length === 1, "Exactly one H1")

console.log("\n=== Blueprint v3 — PART 1 section headings ===")
const headings = [
  "Cardiac Monitoring Services Built Around",
  "Cardiac Monitoring Built for",
  "LIVE Visibility Helps Protect the Quality of",
  "Choose &amp; Compare Specialized Medical Cardiac Monitoring",
  "One Monitoring Partner. Multiple Clinical",
  "Holter Monitoring (LIVE STREAMING)",
  "Extended / Long-Term Holter Monitoring (LIVE STREAMING)",
  "Cardiac Event Monitoring (LIVE STREAMING)",
  "Mobile Cardiac Telemetry - MCT (LIVE STREAMING)",
  "Non-LIVE Holter Options",
  "Post-TAVR Monitoring Designed for the Period After",
  "Why Specialized Medical is a strong post-TAVR monitoring partner",
  "Building or Expanding a Post-TAVR Monitoring Program?",
  "A Monitoring Workflow Built for Patients, Staff and",
  "Stay Connected Across Multiple",
  "A Patient Phone Simplified for",
  "A Simple Two-Electrode Monitoring",
  "Designed to Fit the Cardiology Practice",
  "Clear Reporting for the Ordering",
  "See How Specialized Medical Can Improve Your Monitoring",
  "Frequently Asked",
]
for (const h of headings) {
  check(html.includes(h), `Heading/copy present: ${h.replace(/<[^>]+>/g, "").slice(0, 72)}`)
}
check(
  /Frequently Asked[\s\S]{0,80}?Questions/.test(html),
  "FAQ heading: Frequently Asked Questions"
)

console.log("\n=== Blueprint v3 — PART 1 CTAs ===")
check(html.includes("Schedule a Cardiac Monitoring Demonstration"), "CTA: Schedule a Cardiac Monitoring Demonstration")
check(html.includes("Learn More About Holter Monitoring"), "CTA: Learn More About Holter Monitoring")
check(html.includes("Explore Long-Term Holter Monitoring"), "CTA: Explore Long-Term Holter Monitoring")
check(html.includes("View Cardiac Event Monitoring"), "CTA: View Cardiac Event Monitoring")
check(html.includes("Learn About Mobile Cardiac Telemetry"), "CTA: Learn About Mobile Cardiac Telemetry")
check(html.includes("Ask About Non-LIVE Holter Options"), "CTA: Ask About Non-LIVE Holter Options")
check(html.includes("Explore Post-TAVR Monitoring"), "CTA: Explore Post-TAVR Monitoring")
check(html.includes(">Schedule a Demonstration<"), "CTA: Schedule a Demonstration")

console.log("\n=== Blueprint v3 — Final Acceptance Checklist ===")
check(
  (() => {
    const h = html.indexOf("Choose &amp; Compare Specialized Medical Cardiac Monitoring")
    const t = html.indexOf('class="landing-table"')
    return h !== -1 && t !== -1 && h < t && t - h < 3500
  })(),
  "Exact comparison-table heading appears above the table (PART 1 definitions may sit between)"
)
check(html.includes("Holter Monitoring (LIVE STREAMING)"), "Option 1: Holter LIVE STREAMING")
check(html.includes("Extended / Long-Term Holter (LIVE STREAMING)"), "Option 2: Extended/LTH LIVE STREAMING")
check(html.includes("Cardiac Event Monitoring (LIVE STREAMING)"), "Option 3: Event LIVE STREAMING")
check(html.includes("Mobile Cardiac Telemetry (MCT) (LIVE STREAMING)"), "Option 4: MCT LIVE STREAMING")
check(html.includes("Holter Monitoring (NOT LIVE STREAMING VERSION)"), "Option 5: Holter NOT LIVE")
check(html.includes("Extended Holter (NOT LIVE STREAMING VERSION)"), "Option 6: Extended Holter NOT LIVE")
check((html.match(/landing-table__no|>NO</g) || []).length >= 2, "NOT LIVE rows show NO visibility")
check(
  html.includes("LIVE Test-Status Visibility") && html.includes("Clinical Findings Presented"),
  "Separates LIVE operational visibility from timing of clinical findings"
)
check(
  html.includes("Monitor battery level") &&
    html.includes("Electrode quality and contact") &&
    html.includes("Successful ECG data transmission"),
  "Battery, electrode quality/body contact, connectivity and data receipt described"
)
check(
  /contacts the patient and works with them to correct/i.test(html),
  "Proactive patient contact is explained"
)
check(
  /Holter[\s\S]{0,120}after the final report is generated/i.test(html),
  "Holter findings after final report"
)
check(
  /prescribed notification protocol/i.test(html) &&
    /Event Monitoring and MCT|Cardiac Event Monitoring and MCT/i.test(html),
  "Event/MCT findings during study per notification protocol"
)
check(
  /cms-post-tavr|Post-TAVR Monitoring Designed/.test(html) && html.includes('href="post-tavr-cardiac-monitoring.html"'),
  "Post-TAVR section prominent and links to dedicated page"
)

const nine = [
  "mobile-cardiac-telemetry-mct",
  "holter-monitoring-services",
  "long-term-holter-monitoring",
  "cardiac-event-monitoring",
  "ambulatory-cardiac-monitoring",
  "s-patch-cardiac-monitoring-system",
  "live-ecg-monitoring",
  "post-tavr-cardiac-monitoring",
  "cardiology-practice-cardiac-monitoring",
]
for (const slug of nine) {
  check(html.includes(`href="${slug}.html"`), `Contextual link -> /${slug}`)
}

console.log("\n=== Blueprint v3 — PART 2 design / visuals (required) ===")
check(html.includes("landing-status-strip"), "LIVE status indicator strip")
check(html.includes("landing-diagram__network") || html.includes("landing-diagram__connect"), "Monitor-to-phone-to-network diagram")
check(html.includes("landing-phone-demo") || html.includes("landing-phone-screens"), "Patient phone two-screen visual")
check(
  html.includes("Only two simple screens - connection status and symptom logging."),
  "Phone visual public caption exact"
)
check(
  html.includes("Order and pre-enroll") && html.includes("Deliver the final report"),
  "Six-step workflow graphic/content"
)
check(html.includes("Post-TAVR hospital-to-home monitoring timeline") || /Hospital[\s\S]*Discharge[\s\S]*Home/.test(html), "Post-TAVR hospital-to-home timeline")
check(/images\/figma-services\/s-patch\.jpg/.test(html), "S-Patch authentic imagery")
check(/images\/(landing|figma-services)\//.test(html) && /report|electronic|signature|physician/i.test(html), "Report / e-signature visual present")
check(
  /cms-post-tavr[\s\S]*cms-workflow|Post-TAVR Monitoring Designed[\s\S]*A Monitoring Workflow Built/.test(html),
  "Post-TAVR section appears before general workflow"
)

console.log("\n=== Blueprint v3 — guardrails / no extras ===")
check(!/growth opportunity/i.test(html), "No internal strategy language published")
check(!/Related Cardiac Monitoring/.test(html), "No Related Resources block")
check(!/See how this works for/.test(html), "No invented practice cross-link sentence")
check(!/landing-hero__lead/.test(html), "No invented hero teaser")
check(!/Diagnostic Service Disclaimer/.test(html), "No non-PDF diagnostic disclaimer")
check((html.match(/class="faq-item__trigger"/g) || []).length === 17, "17 PART 1 FAQs visible")
check(html.includes("FAQPage"), "FAQPage schema present")
check(html.includes("BreadcrumbList"), "BreadcrumbList schema present")
check(html.includes('scope="col"') && html.includes('scope="row"'), "Accessible table header cells")

console.log(`\n${passes} passed, ${failures} failed`)
process.exit(failures === 0 ? 0 : 1)
