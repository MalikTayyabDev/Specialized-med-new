/**
 * Generates the ten SEO landing pages per the Specialized Medical
 * SEO Content & Implementation Manual (July 2026, v2).
 * Content lives in scripts/landing-content-v2.mjs.
 * Run: node scripts/generate-stagegate2-landings.mjs
 */
import { writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderHeader, renderFooter } from "../partials/render-layout.mjs"
import { PAGES } from "./landing-content-v2.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const SITE = "https://www.specialized-med.com"
const PHONE_HREF = "tel:+18557732633"
const CSS_VERSION = "20260725f"
const WEB3FORMS_KEY = "8ec7a28a-1979-4c39-8791-18fbf60bba44"

/** Must stay in sync with scripts/patch-html-for-subfolder-base.mjs leaf map. */
const BASE_SNIPPET = `  <script>
    (function (w, d) {
      function siteRootPathname() {
        var segs = w.location.pathname.split("/").filter(Boolean)
        var ph = segs.lastIndexOf("public_html")
        if (ph !== -1) segs = segs.slice(ph + 1)
        var leaf = {
          about: 1,
          services: 1,
          faq: 1,
          contact: 1,
          "clinical-stories": 1,
          thanks: 1,
          "404": 1,
          "cardiac-monitoring-services": 1,
          "mobile-cardiac-telemetry-mct": 1,
          "holter-monitoring-services": 1,
          "long-term-holter-monitoring": 1,
          "cardiac-event-monitoring": 1,
          "ambulatory-cardiac-monitoring": 1,
          "s-patch-cardiac-monitoring-system": 1,
          "live-ecg-monitoring": 1,
          "post-tavr-cardiac-monitoring": 1,
          "cardiology-practice-cardiac-monitoring": 1
        }
        while (segs.length) {
          var last = segs[segs.length - 1]
          if (last === "equipment" && segs.length >= 2 && segs[segs.length - 2] === "services") {
            segs.length -= 2
            break
          }
          if (/\\.html$/i.test(last)) {
            segs.pop()
            continue
          }
          if (leaf[last]) {
            segs.pop()
            continue
          }
          break
        }
        return "/" + (segs.join("/") + (segs.length ? "/" : ""))
      }
      var p = siteRootPathname()
      var h = w.location.origin + (p === "/" ? "/" : p)
      var b = d.createElement("base")
      b.href = h
      var m = d.head.querySelector("meta[charset]")
      if (m && typeof m.insertAdjacentElement === "function") {
        m.insertAdjacentElement("afterend", b)
      } else if (m && m.nextSibling) {
        d.head.insertBefore(b, m.nextSibling)
      } else {
        d.head.insertBefore(b, d.head.firstChild)
      }
    })(window, document)
  </script>
  <!-- sm-site-base -->`

const CHEVRON = `<svg class="faq-item__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function stripTags(s) {
  return String(s)
    .replace(/<[^>]+>/g, "")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&middot;/g, "\u00B7")
    .replace(/&amp;/g, "&")
}

/* ------------------------------ FAQ rendering ------------------------------ */

function faqHtml(faqs, prefix) {
  const items = faqs
    .map((f, i) => {
      const tid = `faq-trigger-${prefix}-${i}`
      const pid = `faq-panel-${prefix}-${i}`
      const open = i === 0
      return `<div class="faq-item${open ? " is-open" : ""}">
      <button type="button" id="${tid}" class="faq-item__trigger" aria-expanded="${open}" aria-controls="${pid}">
        <span class="faq-item__q">${f.q}</span>
        ${CHEVRON.replace('class="faq-item__chevron"', `class="faq-item__chevron${open ? " is-open" : ""}"`)}
      </button>
      <div id="${pid}" role="region" aria-labelledby="${tid}" class="faq-item__panel"${open ? "" : " hidden"}>
        <p>${f.a}</p>
      </div>
    </div>`
    })
    .join("\n")
  return `<section class="figma-section faq-accordion landing-section landing-faq landing-section--muted" aria-labelledby="${prefix}-faq-heading">
      <div class="figma-container faq-accordion__inner">
        <h2 id="${prefix}-faq-heading" class="landing-h2">Frequently Asked <span class="landing-h2__accent">Questions</span></h2>
        <div class="faq-category">
          <div class="faq-category__list">
${items}
          </div>
        </div>
      </div>
    </section>`
}

/* --------------------------------- schema --------------------------------- */

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: stripTags(f.q),
      acceptedAnswer: { "@type": "Answer", text: stripTags(f.a) },
    })),
  }
}

function serviceSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.serviceName,
    provider: {
      "@type": "Organization",
      name: "Specialized Medical",
      url: `${SITE}/`,
    },
    serviceType: "Ambulatory Cardiac Monitoring",
    areaServed: "United States",
    description: page.metaDescription,
    url: `${SITE}/${page.slug}.html`,
  }
}

function webPageSchema(page, medical) {
  return {
    "@context": "https://schema.org",
    "@type": medical ? "MedicalWebPage" : "WebPage",
    name: page.title,
    url: `${SITE}/${page.slug}.html`,
    description: page.metaDescription,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: "Specialized Medical", url: `${SITE}/` },
  }
}

function breadcrumbSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services.html` },
      { "@type": "ListItem", position: 3, name: page.serviceName, item: `${SITE}/${page.slug}.html` },
    ],
  }
}

function orgMedicalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalBusiness"],
    name: "Specialized Medical",
    url: `${SITE}/`,
    telephone: "+1-855-773-2633",
    description:
      "Specialized Medical provides turnkey ambulatory cardiac monitoring services including Holter, Long-Term Holter, Cardiac Event Monitoring, and Mobile Cardiac Telemetry.",
  }
}

function itemListSchema() {
  const items = [
    { name: "Holter Monitoring Services", slug: "holter-monitoring-services" },
    { name: "Long-Term Holter Monitoring", slug: "long-term-holter-monitoring" },
    { name: "Cardiac Event Monitoring", slug: "cardiac-event-monitoring" },
    { name: "Mobile Cardiac Telemetry (MCT)", slug: "mobile-cardiac-telemetry-mct" },
  ]
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ambulatory cardiac monitoring test types",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${SITE}/${it.slug}.html`,
    })),
  }
}

function productSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "S-Patch Cardiac Monitoring System",
    brand: { "@type": "Organization", name: "Specialized Medical" },
    description: page.metaDescription,
    image: `${SITE}/images/landing/s-patch-cardiac-monitoring-system.webp`,
    url: `${SITE}/${page.slug}.html`,
  }
}

function schemasFor(page) {
  const out = []
  const types = page.schemaTypes || []
  if (types.includes("WebPage")) out.push(webPageSchema(page, false))
  if (types.includes("MedicalWebPage")) out.push(webPageSchema(page, true))
  if (types.includes("OrganizationMedicalBusiness")) out.push(orgMedicalBusinessSchema())
  if (types.includes("ItemList")) out.push(itemListSchema())
  if (types.includes("Product")) out.push(productSchema(page))
  out.push(serviceSchema(page))
  out.push(breadcrumbSchema(page))
  out.push(faqSchema(page.faqs))
  return out
}

/* ------------------------------- components ------------------------------- */

/** Hero banner image + ALT per landing (files in images/landing/). */
const BANNERS = {
  "cardiac-monitoring-services": {
    src: "images/landing/cardiac-monitoring-services.png",
    alt: "Holter, Event Monitoring, and Mobile Cardiac Telemetry services from Specialized Medical for physician practices",
  },
  "mobile-cardiac-telemetry-mct": {
    src: "images/landing/mobile-cardiac-telemetry-mct.jpg",
    alt: "Mobile Cardiac Telemetry (MCT) with live ECG data transmitted during the prescribed ambulatory study",
  },
  "holter-monitoring-services": {
    src: "images/landing/holter-monitoring-services.jpg",
    alt: "24 to 48 hour Holter monitoring with continuous ambulatory ECG recording and LIVE test-status visibility",
  },
  "long-term-holter-monitoring": {
    src: "images/landing/long-term-holter-monitoring.jpg",
    alt: "Long-Term Holter monitoring extending continuous ambulatory ECG recording from 3 to 14 days",
  },
  "cardiac-event-monitoring": {
    src: "images/landing/cardiac-event-monitoring.webp",
    alt: "Cardiac event monitoring capturing ECG information for intermittent symptoms over up to 30 days",
  },
  "ambulatory-cardiac-monitoring": {
    src: "images/landing/ambulatory-cardiac-monitoring.jpg",
    alt: "Ambulatory cardiac monitoring category covering Holter, Long-Term Holter, Event Monitoring, and MCT",
  },
  "s-patch-cardiac-monitoring-system": {
    src: "images/landing/s-patch-cardiac-monitoring-system.webp",
    alt: "S-Patch cardiac monitoring system, Specialized Medical's primary compact two-component wearable ECG platform",
  },
  "live-ecg-monitoring": {
    src: "images/landing/live-ecg-monitoring.jpg",
    alt: "Live ECG monitoring transmitting rhythm data from a wearable monitor during the prescribed study",
  },
  "post-tavr-cardiac-monitoring": {
    src: "images/landing/post-tavr-cardiac-monitoring.jpg",
    alt: "Post-TAVR cardiac monitoring supporting rhythm surveillance after transcatheter aortic valve replacement",
  },
  "cardiology-practice-cardiac-monitoring": {
    src: "images/landing/cardiology-practice-cardiac-monitoring.jpg",
    alt: "Turnkey cardiac monitoring operational program for cardiology practices from Specialized Medical",
  },
}

function breadcrumbHtml(page) {
  return `    <nav class="landing-breadcrumb" aria-label="Breadcrumb">
      <div class="figma-container">
        <ol class="landing-breadcrumb__list">
          <li><a href="./">Home</a></li>
          <li><a href="services.html">Services</a></li>
          <li><span aria-current="page">${esc(page.serviceName)}</span></li>
        </ol>
      </div>
    </nav>`
}

function relatedLinksSection(page) {
  if (!page.links?.length) return ""
  return `    <section class="landing-section" aria-labelledby="${page.id}-related-heading">
      <div class="figma-container">
        <h2 id="${page.id}-related-heading" class="landing-h2">Related Cardiac Monitoring <span class="landing-h2__accent">Resources</span></h2>
        <ul class="landing-related">
${page.links.map((l) => `          <li><a href="${l.href}">${esc(l.label)}</a></li>`).join("\n")}
        </ul>
      </div>
    </section>`
}

const INTEREST_OPTIONS = [
  "Holter Monitoring",
  "Long-Term Holter Monitoring",
  "Cardiac Event Monitoring",
  "Mobile Cardiac Telemetry (MCT)",
  "Post-TAVR monitoring program",
  "Multiple test types / full program",
]

/** CTA block: exact manual copy + short form (name, organization, email, phone, locations, interest). */
function ctaFormSection(page) {
  const options = INTEREST_OPTIONS.map(
    (o) => `                  <option value="${esc(o)}"${o === page.interestDefault ? " selected" : ""}>${esc(o)}</option>`
  ).join("\n")
  const emergencyNote = page.ctaEmergencyNote
    ? `\n            <p class="landing-cta-form__emergency">Specialized Medical provides diagnostic ambulatory monitoring. The system is not a replacement for emergency medical services. Patients with urgent symptoms should call 911 or follow emergency instructions rather than waiting for a monitoring call.</p>`
    : ""
  return `    <section class="landing-section landing-cta-block" id="cta-form" aria-labelledby="${page.id}-cta-heading">
      <div class="figma-container">
        <div class="landing-cta-block__box">
          <div class="landing-cta-block__copy">
            <h2 id="${page.id}-cta-heading" class="landing-h2">${esc(page.ctaLabel)}</h2>
            <p class="landing-p">Specialized Medical can review the practice&rsquo;s current ambulatory cardiac monitoring workflow, explain the available service options, and demonstrate how enrollment, monitoring, reporting, and physician review can be configured.</p>
            <p class="landing-p landing-cta-block__phone">Prefer to talk? <a href="${PHONE_HREF}">Speak With a Cardiac Monitoring Specialist &mdash; 1-855-SPEC-MED (1-855-773-2633)</a></p>${emergencyNote}
          </div>
          <form class="landing-cta-form" action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="access_key" value="${WEB3FORMS_KEY}">
            <input type="hidden" name="subject" value="${esc(page.ctaLabel)} — ${esc(page.serviceName)}">
            <input type="hidden" name="from_page" value="${esc(page.slug)}">
            <input type="hidden" name="redirect" value="">
            <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none">
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Name</span>
                <input name="name" type="text" autocomplete="name" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Organization</span>
                <input name="organization" type="text" autocomplete="organization" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Email</span>
                <input name="email" type="email" autocomplete="email" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Phone</span>
                <input name="phone" type="tel" autocomplete="tel" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Number of locations</span>
                <input name="locations" type="number" min="1" inputmode="numeric" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Primary monitoring interest</span>
                <select name="interest" required>
                  <option value="" disabled>Select an option</option>
${options}
                </select>
              </label>
            </div>
            <button type="submit" class="figma-btn figma-btn--solid landing-cta-form__submit">${esc(page.ctaLabel)}</button>
            <p class="landing-cta-form__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>`
}

/** Global Diagnostic Service Disclaimer — required on every page. */
function diagnosticDisclaimer() {
  return `    <section class="landing-disclaimer" aria-label="Diagnostic service disclaimer">
      <div class="figma-container">
        <p class="landing-disclaimer__text"><strong>Diagnostic Service Disclaimer:</strong> Specialized Medical provides ambulatory cardiac monitoring services and diagnostic information for review by qualified healthcare providers. The service does not replace physician judgment, emergency medical services, or instructions to call 911 when urgent symptoms occur.</p>
      </div>
    </section>`
}

/* -------------------------------- rendering -------------------------------- */

function renderPage(page) {
  const canonical = `${SITE}/${page.slug}.html`
  const banner = BANNERS[page.slug]
  if (!banner) throw new Error(`Missing banner for ${page.slug}`)
  const ogImage = `${SITE}/${banner.src}`
  const schemas = schemasFor(page)
  const header = renderHeader({ base: "", active: "services" })
  const footer = renderFooter({ base: "" })
  const schemaBlocks = schemas
    .map((s) => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`)
    .join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
${BASE_SNIPPET}
${schemaBlocks}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.metaDescription)}">
  <!-- Social sharing (iMessage/WhatsApp/Facebook/Twitter) -->
  <meta property="og:site_name" content="Specialized Medical">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.metaDescription)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="image" href="${esc(banner.src)}" fetchpriority="high">
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
  <link rel="stylesheet" href="css/services.css">
  <link rel="stylesheet" href="css/faq.css">
  <link rel="stylesheet" href="css/landing.css?v=${CSS_VERSION}">
  <link rel="canonical" href="${canonical}">
</head>
<body>
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-T2JLQJ7R"
      height="0"
      width="0"
      style="display:none;visibility:hidden">
    </iframe>
  </noscript>
  <div class="site-root">
${header}
<main class="landing-page services-page services-page--figma" data-landing="${page.slug}">
${breadcrumbHtml(page)}
    <section class="landing-hero" aria-labelledby="${page.id}-hero-heading">
      <div class="landing-hero__plate landing-hero__plate--${page.slug}">
        <img class="landing-hero__media" src="${esc(banner.src)}" alt="${esc(banner.alt)}" width="1430" height="550" fetchpriority="high" decoding="async">
        <div class="landing-hero__gradient" aria-hidden="true"></div>
        <div class="landing-hero__inner figma-container">
          <p class="figma-hero__pill">
            <span class="figma-hero__pill-dot" aria-hidden="true"></span>
            ${esc(page.pill)}
          </p>
          <h1 id="${page.id}-hero-heading" class="landing-hero__title">
            ${page.h1Html}
          </h1>
          <p class="landing-hero__lead">${page.directAnswer}</p>
          <div class="landing-hero__actions">
            <a class="figma-btn figma-btn--solid" href="#cta-form">${esc(page.ctaLabel)}</a>
            <a class="figma-btn figma-btn--outline-dark" href="${PHONE_HREF}">Speak With a Cardiac Monitoring Specialist</a>
          </div>
        </div>
      </div>
    </section>

${page.body}

${faqHtml(page.faqs, page.id)}

${ctaFormSection(page)}

${relatedLinksSection(page)}

${diagnosticDisclaimer()}
  </main>
${footer}
  </div>
  <script src="js/analytics.js" defer></script>
  <script src="js/main.js?v=${CSS_VERSION}" defer></script>
</body>
</html>
`
}

for (const page of PAGES) {
  const html = renderPage(page)
  const out = join(ROOT, page.file)
  writeFileSync(out, html, "utf8")
  console.log("wrote", page.file)
}
console.log(`Generated ${PAGES.length} landing pages.`)
