/**
 * QA audit for the ten landing pages against the Implementation Manual v2.
 * Run: node scripts/qa-landings-v2.mjs
 */
import { readFileSync, existsSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const REQUIRED_LINKS = {
  "cardiac-monitoring-services": [
    "mobile-cardiac-telemetry-mct",
    "holter-monitoring-services",
    "long-term-holter-monitoring",
    "cardiac-event-monitoring",
    "ambulatory-cardiac-monitoring",
    "s-patch-cardiac-monitoring-system",
    "live-ecg-monitoring",
    "post-tavr-cardiac-monitoring",
    "cardiology-practice-cardiac-monitoring",
  ],
  "mobile-cardiac-telemetry-mct": [
    "cardiac-monitoring-services",
    "live-ecg-monitoring",
    "cardiac-event-monitoring",
    "holter-monitoring-services",
    "post-tavr-cardiac-monitoring",
    "s-patch-cardiac-monitoring-system",
  ],
  "holter-monitoring-services": [
    "cardiac-monitoring-services",
    "long-term-holter-monitoring",
    "mobile-cardiac-telemetry-mct",
    "cardiac-event-monitoring",
    "s-patch-cardiac-monitoring-system",
  ],
  "long-term-holter-monitoring": [
    "holter-monitoring-services",
    "mobile-cardiac-telemetry-mct",
    "cardiac-event-monitoring",
    "cardiac-monitoring-services",
    "s-patch-cardiac-monitoring-system",
  ],
  "cardiac-event-monitoring": [
    "mobile-cardiac-telemetry-mct",
    "holter-monitoring-services",
    "long-term-holter-monitoring",
    "cardiac-monitoring-services",
    "live-ecg-monitoring",
  ],
  "ambulatory-cardiac-monitoring": [
    "cardiac-monitoring-services",
    "holter-monitoring-services",
    "long-term-holter-monitoring",
    "cardiac-event-monitoring",
    "mobile-cardiac-telemetry-mct",
  ],
  "s-patch-cardiac-monitoring-system": [
    "mobile-cardiac-telemetry-mct",
    "holter-monitoring-services",
    "long-term-holter-monitoring",
    "cardiac-event-monitoring",
    "live-ecg-monitoring",
    "post-tavr-cardiac-monitoring",
  ],
  "live-ecg-monitoring": [
    "mobile-cardiac-telemetry-mct",
    "post-tavr-cardiac-monitoring",
    "holter-monitoring-services",
    "long-term-holter-monitoring",
    "s-patch-cardiac-monitoring-system",
  ],
  "post-tavr-cardiac-monitoring": [
    "mobile-cardiac-telemetry-mct",
    "live-ecg-monitoring",
    "cardiac-monitoring-services",
    "cardiology-practice-cardiac-monitoring",
    "s-patch-cardiac-monitoring-system",
  ],
  "cardiology-practice-cardiac-monitoring": [
    "cardiac-monitoring-services",
    "ambulatory-cardiac-monitoring",
    "mobile-cardiac-telemetry-mct",
    "s-patch-cardiac-monitoring-system",
    "post-tavr-cardiac-monitoring",
  ],
}

const REQUIRED_SCHEMA = {
  "cardiac-monitoring-services": ["WebPage", "Organization", "MedicalBusiness", "Service", "BreadcrumbList", "FAQPage"],
  "mobile-cardiac-telemetry-mct": ["Service", "MedicalWebPage", "BreadcrumbList", "FAQPage"],
  "holter-monitoring-services": ["Service", "MedicalWebPage", "BreadcrumbList", "FAQPage"],
  "long-term-holter-monitoring": ["Service", "MedicalWebPage", "BreadcrumbList", "FAQPage"],
  "cardiac-event-monitoring": ["Service", "MedicalWebPage", "BreadcrumbList", "FAQPage"],
  "ambulatory-cardiac-monitoring": ["MedicalWebPage", "ItemList", "Service", "BreadcrumbList", "FAQPage"],
  "s-patch-cardiac-monitoring-system": ["Product", "Service", "BreadcrumbList", "FAQPage"],
  "live-ecg-monitoring": ["Service", "MedicalWebPage", "BreadcrumbList", "FAQPage"],
  "post-tavr-cardiac-monitoring": ["Service", "MedicalWebPage", "BreadcrumbList", "FAQPage"],
  "cardiology-practice-cardiac-monitoring": ["Service", "MedicalBusiness", "Organization", "BreadcrumbList", "FAQPage"],
}

/** Pages containing the standard comparison table per the manual. */
const NEEDS_TABLE = [
  "cardiac-monitoring-services",
  "mobile-cardiac-telemetry-mct",
  "holter-monitoring-services",
  "long-term-holter-monitoring",
  "cardiac-event-monitoring",
  "ambulatory-cardiac-monitoring",
  "live-ecg-monitoring",
]

/** Pages with patient-facing urgent-guidance content -> emergency disclaimer required. */
const NEEDS_EMERGENCY = [
  "mobile-cardiac-telemetry-mct",
  "holter-monitoring-services",
  "long-term-holter-monitoring",
  "cardiac-event-monitoring",
  "ambulatory-cardiac-monitoring",
  "live-ecg-monitoring",
  "post-tavr-cardiac-monitoring",
  "s-patch-cardiac-monitoring-system",
]

const EXPECT_TITLE = {
  "cardiac-monitoring-services": "Cardiac Monitoring Services | LIVE Streaming ECG | Specialized Medical",
  "mobile-cardiac-telemetry-mct": "Mobile Cardiac Telemetry (MCT) | Specialized Medical",
  "holter-monitoring-services": "Holter Monitoring Services | Specialized Medical",
  "long-term-holter-monitoring": "Long-Term Holter Monitoring | Specialized Medical",
  "cardiac-event-monitoring": "Cardiac Event Monitoring | Specialized Medical",
  "ambulatory-cardiac-monitoring": "Ambulatory Cardiac Monitoring | Specialized Medical",
  "s-patch-cardiac-monitoring-system": "S-Patch Cardiac Monitoring System | Specialized Medical",
  "live-ecg-monitoring": "Live ECG Monitoring | Specialized Medical",
  "post-tavr-cardiac-monitoring": "Post-TAVR Cardiac Monitoring for Delayed Heart Block | Specialized Medical",
  "cardiology-practice-cardiac-monitoring": "Cardiac Monitoring for Cardiology Practices | Specialized Medical",
}

const CTA_LABEL = {
  "cardiac-monitoring-services": "Schedule a Cardiac Monitoring Demonstration",
  "mobile-cardiac-telemetry-mct": "Request an MCT Workflow Demonstration",
  "holter-monitoring-services": "Request Holter Monitoring Information",
  "long-term-holter-monitoring": "Request Long-Term Holter Program Details",
  "cardiac-event-monitoring": "Request Event Monitoring Information",
  "ambulatory-cardiac-monitoring": "Request an Ambulatory Monitoring Program Consultation",
  "s-patch-cardiac-monitoring-system": "Request an S-Patch Demonstration",
  "live-ecg-monitoring": "Request a Live ECG Monitoring Demonstration",
  "post-tavr-cardiac-monitoring": "Discuss a Post-TAVR Monitoring Protocol",
  "cardiology-practice-cardiac-monitoring": "Request a Practice Workflow Demonstration",
}

let failures = 0
const titles = new Set()
const descs = new Set()

function check(slug, ok, label) {
  if (!ok) {
    failures++
    console.log(`  FAIL [${slug}] ${label}`)
  }
}

for (const slug of Object.keys(REQUIRED_LINKS)) {
  const file = join(ROOT, `${slug}.html`)
  const html = readFileSync(file, "utf8")
  console.log(`\n== ${slug} ==`)

  // Metadata
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1]
  check(slug, title === EXPECT_TITLE[slug], `title tag ("${title}")`)
  check(slug, !titles.has(title), "title unique")
  titles.add(title)
  const desc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1]
  check(slug, !!desc && desc.length >= 100 && desc.length <= 320, `meta description length (${desc ? desc.length : 0})`)
  check(slug, !descs.has(desc), "meta description unique")
  descs.add(desc)
  check(slug, html.includes(`<link rel="canonical" href="https://www.specialized-med.com/${slug}.html">`), "canonical")
  check(slug, /content="index, follow/.test(html), "indexable")
  check(slug, html.includes('property="og:image"') && html.includes('name="twitter:card"'), "social meta")

  // Structure
  const h1s = html.match(/<h1[\s>]/g) || []
  check(slug, h1s.length === 1, `exactly one H1 (found ${h1s.length})`)
  check(slug, /class="landing-breadcrumb"/.test(html), "visible breadcrumb")
  check(slug, /aria-current="page"/.test(html), "breadcrumb current page")

  // FAQs visible
  const faqCount = (html.match(/class="faq-item__trigger"/g) || []).length
  const expectedFaqs = slug === "cardiac-monitoring-services" ? 17 : slug === "post-tavr-cardiac-monitoring" ? 15 : 10
  check(slug, faqCount === expectedFaqs, `${expectedFaqs} visible FAQs (found ${faqCount})`)

  // Comparison table (client-approved LIVE STREAMING vs NOT LIVE STREAMING)
  if (NEEDS_TABLE.includes(slug)) {
    check(slug, html.includes("LIVE Test-Status Visibility"), "comparison table header")
    check(slug, html.includes("LIVE STREAMING"), "LIVE STREAMING rows present")
    check(slug, html.includes("NOT LIVE STREAMING VERSION"), "NOT LIVE STREAMING rows present")
    check(slug, (html.match(/After Final Report Is Generated/g) || []).length >= 4, "Holter findings wording")
    check(
      slug,
      (html.match(/During Test &mdash; According to Prescribed Notification Protocol|During Test — According to Prescribed Notification Protocol/g) || []).length >= 2,
      "Event/MCT findings wording"
    )
    check(slug, (html.match(/landing-table__no|>NO<|>NO<\/strong>/g) || []).length >= 2 || (html.match(/<strong>NO<\/strong>/g) || []).length >= 2, "NO visibility on non-live rows")
  }

  // Disclaimers
  if (slug !== "cardiac-monitoring-services") {
    check(slug, html.includes("Diagnostic Service Disclaimer"), "global diagnostic disclaimer")
  }
  if (NEEDS_EMERGENCY.includes(slug)) {
    check(slug, /call 911/i.test(html), "emergency 911 language")
    check(slug, /landing-note--alert|landing-cta-form__emergency/.test(html), "prominent emergency block")
  }

  // CTA
  check(slug, html.includes(CTA_LABEL[slug]), "primary CTA label")
  check(slug, html.includes('href="#cta-form"'), "above-the-fold CTA anchor")
  check(slug, /class="landing-cta-form"/.test(html), "CTA short form present")
  if (slug === "post-tavr-cardiac-monitoring") {
    for (const f of ["name", "organization", "role", "email", "phone", "preferred_contact"]) {
      check(slug, new RegExp(`name="${f}"`).test(html), `form field: ${f}`)
    }
  } else {
    for (const f of ["name", "organization", "email", "phone", "locations", "interest"]) {
      check(slug, new RegExp(`name="${f}"`).test(html), `form field: ${f}`)
    }
  }
  check(slug, html.includes("Speak With a Cardiac Monitoring Specialist"), "secondary CTA (specialist)")

  // Internal links
  for (const target of REQUIRED_LINKS[slug]) {
    check(slug, html.includes(`href="${target}.html"`), `internal link -> /${target}`)
  }
  check(slug, !/click here/i.test(html), "no 'click here' anchors")

  // Schema: JSON validity + required types
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  const types = []
  for (const b of blocks) {
    try {
      const o = JSON.parse(b)
      const t = o["@type"]
      if (Array.isArray(t)) types.push(...t)
      else types.push(t)
    } catch (e) {
      check(slug, false, `JSON-LD parse error: ${e.message}`)
    }
  }
  for (const t of REQUIRED_SCHEMA[slug]) {
    check(slug, types.includes(t), `schema type: ${t}`)
  }
  check(slug, !types.includes("VideoObject"), "no VideoObject without video")

  // Images: every src exists on disk; content images (banner/figures) need
  // descriptive alt; decorative header/footer icons may use alt="" (they sit
  // inside links with aria-label).
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  for (const tag of imgs) {
    const src = (tag.match(/src="([^"]+)"/) || [])[1]
    const alt = tag.match(/alt="([^"]*)"/)
    if (src && !/^https?:/.test(src)) {
      check(slug, existsSync(join(ROOT, src.replace(/&amp;/g, "&"))), `image exists: ${src}`)
    }
    check(slug, !!alt, `alt attribute present on ${src}`)
    const isContent = /images\/(landing|figma-services)\//.test(src || "")
    if (isContent) {
      check(slug, alt && alt[1].trim().length > 10, `descriptive alt on ${src}`)
    }
  }
  const lazyCount = (html.match(/loading="lazy"/g) || []).length
  check(slug, lazyCount >= 1, "below-fold images lazy-loaded")

  // Answer-first: opening copy (CMS Blueprint v3 keeps PART 1 opening below H1)
  if (slug === "cardiac-monitoring-services") {
    check(slug, /landing-section--opening/.test(html), "PART 1 opening copy below hero")
    check(slug, !/landing-hero__lead/.test(html), "no invented hero teaser")
  } else {
    check(slug, /landing-hero__lead/.test(html), "opening answer in hero")
  }

  // Manual-required diagrams / swimlanes
  if (slug === "cardiac-monitoring-services") {
    check(slug, /Choose &amp; Compare Specialized Medical Cardiac Monitoring/.test(html), "comparison section heading")
    check(slug, /landing-status-strip/.test(html), "LIVE status indicator strip")
    check(slug, /landing-phone-demo|landing-phone-screens/.test(html), "patient phone two-screen visual")
    check(slug, !/Related Cardiac Monitoring/.test(html), "no Related Resources block (not in PART 1)")
    check(slug, !/See how this works for/.test(html), "no invented practice cross-link sentence")
    check(slug, /Only two simple screens - connection status and symptom logging/.test(html), "phone caption matches PART 2")
    check(slug, !/Diagnostic Service Disclaimer/.test(html), "no non-PDF disclaimer on CMS pillar")
    check(slug, /cms-post-tavr|Post-TAVR Monitoring Designed/.test(html), "Post-TAVR section present")
    check(slug, /href="post-tavr-cardiac-monitoring\.html"/.test(html), "Post-TAVR dedicated link")
    check(slug, /Order and pre-enroll/.test(html) && /Deliver the final report/.test(html), "six-step workflow")
    check(slug, !/growth opportunity/i.test(html), "no internal strategy language")
  }
  if (slug === "mobile-cardiac-telemetry-mct") {
    check(slug, /landing-diagram__phone-prox/.test(html), "phone proximity diagram")
  }
  if (slug === "cardiac-event-monitoring") {
    check(slug, /landing-diagram__symptom-btn/.test(html), "symptom button diagram")
  }
  if (slug === "long-term-holter-monitoring") {
    check(slug, /Site preparation/.test(html) && /landing-flow/.test(html), "electrode placement steps")
  }
  if (slug === "ambulatory-cardiac-monitoring") {
    check(slug, /landing-diagram__signal/.test(html), "signal quality diagram")
    check(slug, /landing-swimlane/.test(html), "patient/practice/monitoring swimlane")
  }
  if (slug === "s-patch-cardiac-monitoring-system") {
    check(slug, /landing-diagram__connect/.test(html), "connectivity diagram")
  }
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
