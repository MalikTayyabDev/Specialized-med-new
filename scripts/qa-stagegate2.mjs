/**
 * Automated Stagegate 2 QA — validates landing pages against scope requirements.
 * Run: node scripts/qa-stagegate2.mjs
 */
import { readFileSync, existsSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const SITE = "https://www.specialized-med.com"

const PAGES = [
  {
    file: "cardiac-monitoring-services.html",
    slug: "cardiac-monitoring-services",
    title: "Cardiac Monitoring Services | Holter, Event & MCT | Specialized Medical",
    h1Text: "Cardiac Monitoring Services",
    faqMin: 4,
    faqMax: 6,
    mustLink: [
      "mobile-cardiac-telemetry-mct.html",
      "holter-monitoring-services.html",
      "long-term-holter-monitoring.html",
      "cardiac-event-monitoring.html",
      "s-patch-cardiac-monitoring-system.html",
      "live-ecg-monitoring.html",
      "post-tavr-cardiac-monitoring.html",
      "contact.html",
    ],
    mustContain: ["turnkey", "Holter Monitoring", "Long-Term Holter", "Event Monitoring", "Mobile Cardiac Telemetry", "S-Patch", "live-streaming ECG", "24/7", "no-risk pilot"],
  },
  {
    file: "mobile-cardiac-telemetry-mct.html",
    slug: "mobile-cardiac-telemetry-mct",
    title: "Mobile Cardiac Telemetry (MCT) | Live ECG & Alerts | Specialized Medical",
    h1Text: "Mobile Cardiac Telemetry",
    faqMin: 4,
    faqMax: 6,
    mustLink: ["post-tavr-cardiac-monitoring.html"],
    mustContain: ["Mobile Cardiac Telemetry", "live-streaming ECG", "24/7", "arrhythmia", "physician-ready", "patient support"],
  },
  {
    file: "holter-monitoring-services.html",
    slug: "holter-monitoring-services",
    title: "Holter Monitoring Services (24–48 Hour) | Specialized Medical",
    h1Text: "Holter Monitoring",
    faqMin: 4,
    faqMax: 6,
    mustContain: ["24–48 hour", "Holter Monitoring", "setup", "reporting", "patient", "no-risk pilot"],
    mustHaveCta: ["Request a Demo", "No-Risk Pilot"],
  },
  {
    file: "long-term-holter-monitoring.html",
    slug: "long-term-holter-monitoring",
    title: "Long-Term Holter Monitoring | Extended Wear ECG | Specialized Medical",
    h1Text: "Long-Term",
    faqMin: 4,
    faqMax: 6,
    mustContain: ["Long-Term Holter", "Extended Holter", "S-Patch", "no-risk pilot"],
    faqMustContain: ["Extended Holter"],
  },
  {
    file: "cardiac-event-monitoring.html",
    slug: "cardiac-event-monitoring",
    title: "Cardiac Event Monitoring | Symptom & Rhythm Capture | Specialized Medical",
    h1Text: "Event Monitoring",
    faqMin: 4,
    faqMax: 6,
    mustContain: ["Event Monitoring", "symptom", "rhythm-event", "alert", "patient support"],
    faqMustContain: ["Holter Monitoring"],
  },
  {
    file: "ambulatory-cardiac-monitoring.html",
    slug: "ambulatory-cardiac-monitoring",
    title: "Ambulatory Cardiac Monitoring | Holter, Event & MCT | Specialized Medical",
    h1Text: "Ambulatory",
    faqMin: 4,
    faqMax: 6,
    mustLink: [
      "holter-monitoring-services.html",
      "long-term-holter-monitoring.html",
      "cardiac-event-monitoring.html",
      "mobile-cardiac-telemetry-mct.html",
    ],
    mustContain: ["ambulatory cardiac monitoring", "physician order", "workflow"],
  },
  {
    file: "s-patch-cardiac-monitoring-system.html",
    slug: "s-patch-cardiac-monitoring-system",
    title: "S-Patch Monitoring System | Live ECG Cardiac Monitor | Specialized Medical",
    h1Text: "S-Patch",
    faqMin: 4,
    faqMax: 6,
    mustLink: ["live-ecg-monitoring.html", "post-tavr-cardiac-monitoring.html", "services/equipment.html", "contact.html"],
    mustContain: ["S-Patch", "IP55", "Lead-Wire", "live-streaming ECG", "patient"],
  },
  {
    file: "live-ecg-monitoring.html",
    slug: "live-ecg-monitoring",
    title: "Live ECG Monitoring | Live-Streaming ECG Data | Specialized Medical",
    h1Text: "ECG Monitoring",
    faqMin: 4,
    faqMax: 6,
    mustContain: ["live-streaming ECG", "symptom logging", "arrhythmia", "rural", "physician-ready", "not guaranteed"],
  },
  {
    file: "post-tavr-cardiac-monitoring.html",
    slug: "post-tavr-cardiac-monitoring",
    title: "Post-TAVR Cardiac Monitoring | Live ECG & MCT | Specialized Medical",
    h1Text: "Post-TAVR Cardiac Monitoring with",
    faqMin: 6,
    faqMax: 6,
    mustContain: [
      "Discuss Post-TAVR Monitoring Support",
      "Request a Demo",
      "Start a No-Risk Pilot Program",
      "Enroll in Web Portal",
      "Hook Up",
      "Monitor",
      "Physician-Ready Report",
      "Post-TAVR",
      "S-Patch",
      "live-streaming ECG",
      "24/7",
      "does not guarantee",
    ],
    canonicalNote: "Pretty URL /post-tavr-cardiac-monitoring/ served via redirects",
  },
  {
    file: "cardiology-practice-cardiac-monitoring.html",
    slug: "cardiology-practice-cardiac-monitoring",
    title: "Cardiac Monitoring for Cardiology Practices | Specialized Medical",
    h1Text: "Cardiology Practices",
    faqMin: 4,
    faqMax: 6,
    mustLink: ["contact.html"],
    mustContain: ["turnkey", "implementation", "staff workflow", "equipment", "no-risk pilot", "Request a Demo"],
  },
]

const FORBIDDEN_POSITIVE = [
  /\bguaranteed?\s+(reimbursement|profit|payment|detection|outcome|connectivity)\b/i,
  /\b100%\s+(detection|capture|connectivity)\b/i,
  /\balways\s+detect/i,
  /\bguarantee\s+clinical/i,
]

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
}

function getMeta(html, name) {
  const m = html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i"))
  return m ? m[1].replace(/&amp;/g, "&") : null
}

function getTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i)
  return m ? m[1].replace(/&amp;/g, "&").trim() : null
}

function getCanonical(html) {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)
  return m ? m[1] : null
}

function countFaqs(html) {
  return (html.match(/class="faq-item__q"/g) || []).length
}

function countJsonLd(html) {
  return (html.match(/application\/ld\+json/g) || []).length
}

function checkForbiddenPositive(html) {
  const visible = stripTags(html)
  const normalized = visible
    .replace(/\b(does not|do not|don't|cannot|can't|without|not|no|never)\s+guarantee\w*\b/gi, "")
    .replace(/\bnot\s+guaranteed\b/gi, "")
    .replace(/\bno\s+guaranteed\b/gi, "")
  const hits = []
  for (const re of FORBIDDEN_POSITIVE) {
    if (re.test(normalized)) hits.push(re.source)
  }
  return hits
}

function read(path) {
  return readFileSync(join(ROOT, path), "utf8")
}

const results = { pass: [], fail: [], warn: [] }

function pass(msg) {
  results.pass.push(msg)
}
function fail(msg) {
  results.fail.push(msg)
}
function warn(msg) {
  results.warn.push(msg)
}

// --- Run checks ---
for (const page of PAGES) {
  const path = page.file
  if (!existsSync(join(ROOT, path))) {
    fail(`MISSING FILE: ${path}`)
    continue
  }
  const html = read(path)

  if (getTitle(html) !== page.title) {
    fail(`${path}: title mismatch — got "${getTitle(html)}"`)
  } else pass(`${path}: title OK`)

  if (!getMeta(html, "description")?.length) fail(`${path}: missing meta description`)
  else pass(`${path}: meta description OK`)

  if (getMeta(html, "robots") !== "index, follow") fail(`${path}: robots not index,follow`)
  else pass(`${path}: indexable OK`)

  const expectedCanonical = `${SITE}/${page.slug}.html`
  if (getCanonical(html) !== expectedCanonical) {
    fail(`${path}: canonical expected ${expectedCanonical}, got ${getCanonical(html)}`)
  } else pass(`${path}: canonical OK`)

  if (!html.includes("landing-hero__lead")) fail(`${path}: missing direct-answer lead`)
  else pass(`${path}: direct-answer lead OK`)

  if (!html.includes("<h1")) fail(`${path}: missing H1`)
  else if (page.h1Text && !stripTags(html).includes(page.h1Text)) fail(`${path}: H1 missing text "${page.h1Text}"`)
  else pass(`${path}: H1 OK`)

  if (!html.match(/<h2[^>]*>/i)) fail(`${path}: missing H2 headings`)
  else pass(`${path}: H2 subheadings OK`)

  const faqCount = countFaqs(html)
  if (faqCount < page.faqMin || faqCount > page.faqMax) {
    fail(`${path}: FAQ count ${faqCount} (expected ${page.faqMin}-${page.faqMax})`)
  } else pass(`${path}: FAQ count ${faqCount} OK`)

  if (!html.includes("faq-accordion")) fail(`${path}: missing faq-accordion class`)
  else pass(`${path}: FAQ accordion OK`)

  if (!html.includes("sm-site-base")) fail(`${path}: missing sm-site-base injector`)
  else pass(`${path}: sm-site-base OK`)

  if (!html.includes("css/landing.css")) fail(`${path}: missing landing.css`)
  else pass(`${path}: landing.css OK`)

  if (countJsonLd(html) < 2) fail(`${path}: expected 2 JSON-LD blocks, got ${countJsonLd(html)}`)
  else pass(`${path}: JSON-LD schema OK`)

  if (!html.includes("figma-cta")) fail(`${path}: missing CTA section`)
  else pass(`${path}: CTA section OK`)

  for (const link of page.mustLink || []) {
    if (!html.includes(`href="${link}"`)) fail(`${path}: missing internal link to ${link}`)
    else pass(`${path}: links to ${link}`)
  }

  for (const text of page.mustContain || []) {
    if (!html.includes(text)) fail(`${path}: missing required content "${text}"`)
    else pass(`${path}: contains "${text}"`)
  }

  if (page.mustHaveCta) {
    for (const cta of page.mustHaveCta) {
      if (!html.includes(cta)) fail(`${path}: missing CTA text "${cta}"`)
    }
  }

  if (page.faqMustContain) {
    for (const text of page.faqMustContain) {
      if (!html.includes(text)) fail(`${path}: FAQ missing "${text}"`)
    }
  }

  const forbidden = checkForbiddenPositive(html)
  if (forbidden.length) fail(`${path}: possible forbidden guarantee language: ${forbidden.join(", ")}`)
  else pass(`${path}: no forbidden guarantee claims`)
}

// Sitemap
const sitemap = read("sitemap.xml")
for (const page of PAGES) {
  const url = `${SITE}/${page.slug}.html`
  if (!sitemap.includes(url)) fail(`sitemap.xml: missing ${url}`)
  else pass(`sitemap.xml: includes ${page.slug}`)
}

// Redirects + htaccess
const redirects = read("_redirects")
const htaccess = read(".htaccess")
for (const page of PAGES) {
  const pretty = `/${page.slug}/`
  if (!redirects.includes(pretty)) fail(`_redirects: missing pretty URL ${pretty}`)
  else pass(`_redirects: ${page.slug} OK`)
  if (!htaccess.includes(page.slug)) fail(`.htaccess: missing rewrite for ${page.slug}`)
  else pass(`.htaccess: ${page.slug} OK`)
}

// Site-wide internal links
const services = read("services.html")
const index = read("index.html")
for (const slug of ["cardiac-monitoring-services", "post-tavr-cardiac-monitoring", "mobile-cardiac-telemetry-mct"]) {
  if (!services.includes(`${slug}.html`)) warn(`services.html: no link to ${slug} (optional hub link)`)
  if (!index.includes(`${slug}.html`)) warn(`index.html: no link to ${slug}`)
}

// Output
const reportPath = join(ROOT, "docs", "09-stagegate-2-qa-report.json")
writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        passed: results.pass.length,
        failed: results.fail.length,
        warnings: results.warn.length,
        status: results.fail.length === 0 ? "PASS" : "FAIL",
      },
      failures: results.fail,
      warnings: results.warn,
    },
    null,
    2
  )
)

console.log("\n=== Stagegate 2 Automated QA ===\n")
console.log(`PASS: ${results.pass.length}`)
console.log(`FAIL: ${results.fail.length}`)
console.log(`WARN: ${results.warn.length}`)
console.log(`STATUS: ${results.fail.length === 0 ? "PASS ✓" : "FAIL ✗"}\n`)

if (results.fail.length) {
  console.log("--- FAILURES ---")
  results.fail.forEach((f) => console.log("  ✗", f))
}
if (results.warn.length) {
  console.log("\n--- WARNINGS ---")
  results.warn.forEach((w) => console.log("  !", w))
}

console.log(`\nReport: docs/09-stagegate-2-qa-report.json`)
process.exit(results.fail.length ? 1 : 0)
