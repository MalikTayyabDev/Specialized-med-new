/**
 * Generates Stagegate 2 SEO/AEO landing pages.
 * Run: node scripts/generate-stagegate2-landings.mjs
 */
import { writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { renderHeader, renderFooter } from "../partials/render-layout.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const SITE = "https://www.specialized-med.com"

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

function faqHtml(faqs, prefix) {
  const items = faqs
    .map((f, i) => {
      const tid = `faq-trigger-${prefix}-${i}`
      const pid = `faq-panel-${prefix}-${i}`
      const open = i === 0
      return `<div class="faq-item${open ? " is-open" : ""}">
      <button type="button" id="${tid}" class="faq-item__trigger" aria-expanded="${open}" aria-controls="${pid}">
        <span class="faq-item__q">${esc(f.q)}</span>
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

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a.replace(/<[^>]+>/g, ""),
      },
    })),
  }
}

function serviceSchema(name, description) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    provider: {
      "@type": "Organization",
      name: "Specialized Medical",
      url: `${SITE}/`,
    },
    serviceType: "Cardiac Monitoring",
    description,
  }
}

function relatedLinks(links) {
  if (!links?.length) return ""
  return `<ul class="landing-related">
${links.map((l) => `      <li><a href="${l.href}">${esc(l.label)}</a></li>`).join("\n")}
    </ul>`
}

/** Contact form deep link — pre-selects interest + service context on contact page. */
function contactHref({ interest, service }) {
  const p = new URLSearchParams()
  if (interest) p.set("interest", interest)
  if (service) p.set("service", service)
  const q = p.toString()
  return `contact.html${q ? `?${q}` : ""}#contact-form`
}

const PHONE_HREF = "tel:+18557732633"

function defaultHeroActions(page) {
  return [
    {
      className: "figma-btn figma-btn--solid",
      href: contactHref({ interest: "demo", service: page.slug }),
      label: "Request a Demo",
    },
    {
      className: "figma-btn figma-btn--outline-dark",
      href: `#${page.id}-faq-heading`,
      label: "View FAQs",
    },
  ]
}

function ctaSection(page) {
  const cta = page.cta || {}
  const heading = cta.heading || "Start Your No-Risk"
  const accent = cta.accent || "Pilot Program"
  const lead =
    cta.lead ||
    "Evaluate Specialized Medical with a small, no-obligation pilot program. If it is not the right fit, we will take everything back—no hassle."
  const primary = cta.primary || {
    label: "Start Your No-Risk Pilot Program",
    href: contactHref({ interest: "beta", service: page.slug }),
  }
  const secondary = cta.secondary || { label: "Call 1-855-SPEC-MED →", href: PHONE_HREF }
  return `<section class="figma-section figma-cta" aria-labelledby="${page.id}-cta-heading">
      <div class="figma-container">
        <div class="figma-cta__box">
          <h2 id="${page.id}-cta-heading" class="figma-h2 figma-h2--center figma-h2--narrow">
            ${esc(heading)}<br>
            <span class="figma-h2__accent">${esc(accent)}</span>
          </h2>
          <p class="figma-cta__p figma-cta__p--lead">${lead}</p>
          <div class="figma-cta__actions">
            <a class="figma-btn figma-btn--solid" href="${primary.href}">${esc(primary.label)}</a>
            <a class="figma-cta__talk" href="${secondary.href}">${esc(secondary.label)}</a>
          </div>
        </div>
      </div>
    </section>`
}

function renderPage(page) {
  const canonical = `${SITE}/${page.slug}.html`
  const schemas = [serviceSchema(page.serviceName, page.metaDescription), faqSchema(page.faqs)]
  const header = renderHeader({ base: "", active: "services" })
  const footer = renderFooter({ base: "" })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
${BASE_SNIPPET}
  <script type="application/ld+json">
${JSON.stringify(schemas[0], null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(schemas[1], null, 2)}
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.metaDescription)}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
  <link rel="stylesheet" href="css/services.css">
  <link rel="stylesheet" href="css/faq.css">
  <link rel="stylesheet" href="css/landing.css">
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
    <section class="landing-hero" aria-labelledby="${page.id}-hero-heading">
      <div class="landing-hero__plate">
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
${(page.heroActions || defaultHeroActions(page))
  .map((a) => `            <a class="${a.className}" href="${a.href}">${esc(a.label)}</a>`)
  .join("\n")}
          </div>
        </div>
      </div>
    </section>

${page.body}

${faqHtml(page.faqs, page.id)}

${ctaSection(page)}
  </main>
${footer}
  </div>
  <script src="js/analytics.js" defer></script>
  <script src="js/main.js?v=20260501" defer></script>
</body>
</html>
`
}

const PAGES = [
  {
    id: "cms",
    slug: "cardiac-monitoring-services",
    file: "cardiac-monitoring-services.html",
    title: "Cardiac Monitoring Services | Holter, Event & MCT | Specialized Medical",
    metaDescription:
      "Turnkey cardiac monitoring services from Specialized Medical: Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry with live-streaming ECG data.",
    serviceName: "Cardiac Monitoring Services",
    pill: "Cardiac Monitoring Services",
    h1Html: `Turnkey <span class="landing-hero__title-accent">Cardiac Monitoring Services</span>`,
    directAnswer:
      "Specialized Medical provides turnkey cardiac monitoring services for physician practices, covering Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry. Programs are built around the S-Patch Monitoring System with live-streaming ECG data, 24/7 monitoring support, physician-ready reporting, and a no-risk pilot program option.",
    body: `    <section class="landing-section" aria-labelledby="cms-who-heading">
      <div class="figma-container">
        <h2 id="cms-who-heading" class="landing-h2">Who These Services <span class="landing-h2__accent">Are For</span></h2>
        <p class="landing-p">Cardiology and multi-specialty practices that need ambulatory cardiac monitoring without building an in-house monitoring center. Specialized Medical supports staff workflow, equipment, patient support, arrhythmia alert routing, and physician-ready reports so your team can focus on clinical decisions.</p>
        <h2 class="landing-h2" style="margin-top:2rem">How Turnkey Monitoring <span class="landing-h2__accent">Works</span></h2>
        <p class="landing-p">Staff enroll the patient in the web portal, complete hook-up, and Specialized Medical manages active monitoring with live-streaming ECG data where applicable. Practices receive protocol-based alerts and physician-ready reports designed for efficient review and EMR workflow.</p>
        <p class="landing-p">Billing support is available through documentation and coding templates. Specialized Medical does not guarantee reimbursement, payment amounts, or financial results.</p>
      </div>
    </section>
    <section class="landing-section landing-section--muted" aria-labelledby="cms-modalities-heading">
      <div class="figma-container">
        <h2 id="cms-modalities-heading" class="landing-h2">Monitoring Modalities <span class="landing-h2__accent">We Support</span></h2>
        <div class="landing-grid landing-grid--2">
          <article class="landing-card">
            <h3 class="landing-h3"><a href="holter-monitoring-services.html">Holter Monitoring</a></h3>
            <p class="landing-card__meta">Typically 24–48 hours</p>
            <p class="landing-p">Short-duration continuous recording for symptom correlation and rhythm review.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a></h3>
            <p class="landing-card__meta">Beyond 24–48 hours</p>
            <p class="landing-p">Extended continuous monitoring when a longer window is ordered.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="cardiac-event-monitoring.html">Event Monitoring</a></h3>
            <p class="landing-card__meta">Longer ambulatory windows</p>
            <p class="landing-p">Symptom logging and rhythm-event capture over extended periods.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry (MCT)</a></h3>
            <p class="landing-card__meta">Live-streaming ECG with alerts</p>
            <p class="landing-p">Near real-time visibility with 24/7 monitoring support and arrhythmia alert workflows.</p>
          </article>
        </div>
        <h3 class="landing-h3" style="margin-top:2rem">Technology, Reporting &amp; Support</h3>
        <ul class="landing-list">
          <li><a href="s-patch-cardiac-monitoring-system.html">S-Patch Monitoring System</a> as the primary featured device</li>
          <li><a href="live-ecg-monitoring.html">Live-streaming ECG data</a> across applicable study types</li>
          <li>24/7 monitoring support and arrhythmia alert routing based on practice protocol</li>
          <li>Physician-ready reporting with digital symptom context where captured</li>
          <li>Patient-friendly monitoring designed for wearability and support</li>
          <li><a href="post-tavr-cardiac-monitoring.html">Post-TAVR Cardiac Monitoring</a> use-case support via MCT workflows</li>
        </ul>
        ${relatedLinks([
          { href: "ambulatory-cardiac-monitoring.html", label: "Ambulatory Cardiac Monitoring" },
          { href: "cardiology-practice-cardiac-monitoring.html", label: "For Cardiology Practices" },
          { href: "services/equipment.html", label: "Monitoring Equipment" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    heroActions: [
      {
        className: "figma-btn figma-btn--solid",
        href: contactHref({ interest: "demo", service: "cardiac-monitoring-services" }),
        label: "Request a Demo",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: "#cms-modalities-heading",
        label: "Explore Modalities",
      },
    ],
    faqs: [
      {
        q: "What cardiac monitoring services does Specialized Medical provide?",
        a: "Specialized Medical provides turnkey Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry, supported by the S-Patch Monitoring System, live-streaming ECG data where applicable, 24/7 monitoring support, and physician-ready reports.",
      },
      {
        q: "Is Specialized Medical a turnkey provider?",
        a: "Yes. Specialized Medical is positioned as a turnkey cardiac monitoring provider that supports enrollment workflow, equipment, monitoring, patient support, alert routing, and reporting so practices do not need to operate their own monitoring center.",
      },
      {
        q: "Does monitoring include live ECG data?",
        a: "Live-streaming ECG data is available across applicable Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and MCT studies using the S-Patch Monitoring System and cellular transmission platform.",
      },
      {
        q: "Are arrhythmia alerts guaranteed to detect every event?",
        a: "No. Alert workflows are protocol-based and designed to support timely clinician awareness of actionable findings. Specialized Medical does not guarantee detection, clinical outcomes, or speed of intervention.",
      },
      {
        q: "Can we try the program before full adoption?",
        a: "Yes. Practices can request a demo or start a no-risk pilot program to evaluate workflow fit with a small patient volume.",
      },
    ],
  },
  {
    id: "mct",
    slug: "mobile-cardiac-telemetry-mct",
    file: "mobile-cardiac-telemetry-mct.html",
    title: "Mobile Cardiac Telemetry (MCT) | Live ECG & Alerts | Specialized Medical",
    metaDescription:
      "Mobile Cardiac Telemetry (MCT) with live-streaming ECG data, 24/7 monitoring support, arrhythmia alerts, and physician-ready reports from Specialized Medical—including Post-TAVR relevance.",
    serviceName: "Mobile Cardiac Telemetry (MCT)",
    pill: "Mobile Cardiac Telemetry",
    h1Html: `Mobile Cardiac Telemetry <span class="landing-hero__title-accent">(MCT)</span>`,
    directAnswer:
      "Mobile Cardiac Telemetry (MCT) is an ambulatory cardiac monitoring modality that streams ECG data for near real-time review with 24/7 monitoring support. Specialized Medical pairs MCT with the S-Patch Monitoring System, arrhythmia alert workflows, physician-ready reports, and patient support—including relevance for Post-TAVR monitoring programs.",
    heroActions: [
      {
        className: "figma-btn figma-btn--solid",
        href: contactHref({ interest: "demo", service: "mobile-cardiac-telemetry-mct" }),
        label: "Request a Demo",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: "post-tavr-cardiac-monitoring.html",
        label: "Post-TAVR Monitoring",
      },
    ],
    body: `    <section class="landing-section" aria-labelledby="mct-what-heading">
      <div class="figma-container">
        <h2 id="mct-what-heading" class="landing-h2">What Is Mobile Cardiac <span class="landing-h2__accent">Telemetry?</span></h2>
        <p class="landing-p">MCT is ordered when clinicians need extended ambulatory monitoring with ongoing transmission of ECG data rather than waiting for a device return and manual upload. It is commonly used when intermittent arrhythmias, higher-acuity outpatient monitoring needs, or post-procedure rhythm surveillance are clinically relevant.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Live-Streaming ECG &amp; <span class="landing-h2__accent">24/7 Support</span></h2>
        <p class="landing-p">Specialized Medical MCT studies use live-streaming ECG data with 24/7 monitoring support. Arrhythmia alerts can be routed by email, text, or phone according to your practice protocol. Connectivity and outcomes are not guaranteed; multi-path cellular transmission is designed to support consistent capture, including in rural and lower-coverage environments.</p>
        <h3 class="landing-h3">Reporting, Alerts &amp; Patient Support</h3>
        <ul class="landing-list">
          <li>Protocol-based arrhythmia alert workflows</li>
          <li>Physician-ready reports for efficient review and EMR workflows</li>
          <li>Patient support through Specialized Medical’s monitoring and call-center resources</li>
          <li>Digital symptom context where symptoms are logged during the study</li>
        </ul>
        <h3 class="landing-h3">Post-TAVR Relevance</h3>
        <p class="landing-p">MCT is frequently relevant after TAVR when clinicians want continuous outpatient rhythm visibility during recovery. Learn more on our <a href="post-tavr-cardiac-monitoring.html">Post-TAVR Cardiac Monitoring</a> page.</p>
        ${relatedLinks([
          { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
          { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Monitoring System" },
          { href: "cardiac-monitoring-services.html", label: "All Cardiac Monitoring Services" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "How is MCT different from Holter Monitoring?",
        a: "Holter Monitoring is typically a shorter continuous recording window (often 24–48 hours). MCT generally covers a longer ambulatory period with ongoing ECG transmission and alert workflows designed for nearer real-time clinical awareness.",
      },
      {
        q: "Does MCT include live-streaming ECG data?",
        a: "Yes. Specialized Medical MCT is built around live-streaming ECG data with 24/7 monitoring support and protocol-based arrhythmia alerts.",
      },
      {
        q: "Is MCT used for Post-TAVR patients?",
        a: "MCT can be relevant for Post-TAVR programs when the ordering clinician wants extended outpatient rhythm monitoring with live ECG visibility. See our Post-TAVR Cardiac Monitoring page for program details.",
      },
      {
        q: "Are clinical outcomes guaranteed with MCT?",
        a: "No. Specialized Medical does not guarantee detection of every arrhythmia, clinical outcomes, reimbursement, or speed of intervention. Monitoring supports clinician decision-making within ordered protocols.",
      },
      {
        q: "How do patients get support during an MCT study?",
        a: "Patients can receive support through Specialized Medical’s monitoring and multilingual call-center resources while the practice focuses on clinical follow-up.",
      },
    ],
  },
  {
    id: "holter",
    slug: "holter-monitoring-services",
    file: "holter-monitoring-services.html",
    title: "Holter Monitoring Services (24–48 Hour) | Specialized Medical",
    metaDescription:
      "24–48 hour Holter Monitoring services from Specialized Medical with patient-friendly setup, S-Patch technology, physician-ready reports, and a no-risk pilot program option.",
    serviceName: "Holter Monitoring Services",
    pill: "Holter Monitoring",
    h1Html: `24–48 Hour <span class="landing-hero__title-accent">Holter Monitoring</span>`,
    directAnswer:
      "Holter Monitoring is a continuous ambulatory ECG study typically lasting 24–48 hours. Specialized Medical provides turnkey Holter Monitoring with straightforward office setup, patient-friendly monitoring, live-streaming ECG data where applicable, and physician-ready reports so practices can order studies without operating their own monitoring center.",
    body: `    <section class="landing-section" aria-labelledby="holter-what-heading">
      <div class="figma-container">
        <h2 id="holter-what-heading" class="landing-h2">What Is 24–48 Hour <span class="landing-h2__accent">Holter Monitoring?</span></h2>
        <p class="landing-p">Holter Monitoring continuously records ECG activity over a short ambulatory window—commonly 24 to 48 hours—to help clinicians correlate symptoms with rhythm findings and review a full disclosure period after the study.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Setup Workflow &amp; <span class="landing-h2__accent">Reporting</span></h2>
        <p class="landing-p">Office staff enroll the patient, complete hook-up, and Specialized Medical supports the monitoring and reporting process. Final reports are designed to be physician-ready, with digital symptom entries matched to ECG context when symptoms are logged during the study.</p>
        <h3 class="landing-h3">Patient Experience</h3>
        <p class="landing-p">Studies are designed to be patient-friendly, with compact monitoring options such as the S-Patch Monitoring System and support resources if patients have questions during wear. Comfort and wearability help improve study completion without guaranteeing any clinical result.</p>
        ${relatedLinks([
          { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
          { href: "cardiac-event-monitoring.html", label: "Event Monitoring" },
          { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Monitoring System" },
          { href: "cardiac-monitoring-services.html", label: "All Services" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "How long does a Holter Monitoring study last?",
        a: "Holter Monitoring typically lasts 24–48 hours, based on the physician order and clinical need.",
      },
      {
        q: "How long does office setup take?",
        a: "In most cases, enrollment and hook-up are designed to fit into normal office workflow, often under about 15 minutes, though timing can vary by practice.",
      },
      {
        q: "Will patients need a handwritten symptom diary?",
        a: "Symptoms can be entered digitally during the test and appear on the final report above corresponding ECG strips when logged, reducing reliance on a separate handwritten diary.",
      },
      {
        q: "Can we request a demo or pilot for Holter Monitoring?",
        a: "Yes. Practices can request a demo or start a no-risk pilot program to evaluate Holter Monitoring workflow with Specialized Medical.",
      },
      {
        q: "Does Holter Monitoring guarantee arrhythmia detection?",
        a: "No. Holter Monitoring provides continuous ECG data for clinical review within the ordered window. Specialized Medical does not guarantee detection, outcomes, or reimbursement.",
      },
    ],
    heroActions: [
      {
        className: "figma-btn figma-btn--solid",
        href: contactHref({ interest: "demo", service: "holter-monitoring-services" }),
        label: "Request a Demo",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: "#holter-what-heading",
        label: "How Holter Monitoring Works",
      },
    ],
    cta: {
      heading: "Request a Demo or",
      accent: "Start a No-Risk Pilot",
      lead: "See how Specialized Medical Holter Monitoring fits your practice workflow. Request a demo or start a no-risk pilot program with a small patient volume.",
      primary: { label: "Request a Demo", href: contactHref({ interest: "demo", service: "holter-monitoring-services" }) },
      secondary: { label: "Call 1-855-SPEC-MED →", href: PHONE_HREF },
    },
  },
  {
    id: "lth",
    slug: "long-term-holter-monitoring",
    file: "long-term-holter-monitoring.html",
    title: "Long-Term Holter Monitoring | Extended Wear ECG | Specialized Medical",
    metaDescription:
      "Long-Term Holter Monitoring beyond 24–48 hours from Specialized Medical, featuring the S-Patch Monitoring System, physician-ready reporting, workflow support, and a no-risk pilot option.",
    serviceName: "Long-Term Holter Monitoring",
    pill: "Long-Term Holter Monitoring",
    h1Html: `Long-Term <span class="landing-hero__title-accent">Holter Monitoring</span>`,
    directAnswer:
      "Long-Term Holter Monitoring provides continuous ambulatory ECG recording beyond the typical 24–48 hour Holter window when a longer observation period is ordered. Specialized Medical supports Long-Term Holter Monitoring with the S-Patch Monitoring System, patient-friendly wear, physician-ready reports, and turnkey workflow support.",
    body: `    <section class="landing-section" aria-labelledby="lth-what-heading">
      <div class="figma-container">
        <h2 id="lth-what-heading" class="landing-h2">Monitoring Beyond <span class="landing-h2__accent">24–48 Hours</span></h2>
        <p class="landing-p">When clinicians need continuous ECG capture for more than a short Holter window, Long-Term Holter Monitoring extends the recording period according to the physician order. Extended Holter is sometimes used as a supporting alternate phrase for related longer continuous monitoring concepts; Specialized Medical primarily uses the term Long-Term Holter Monitoring.</p>
        <h2 class="landing-h2" style="margin-top:2rem">S-Patch Comfort, Reporting &amp; <span class="landing-h2__accent">Workflow</span></h2>
        <p class="landing-p">The S-Patch Monitoring System is designed for comfortable extended wear, with live-streaming ECG data where applicable and physician-ready reporting after study completion. Practices enroll patients through the web portal; Specialized Medical supports monitoring operations and patient questions during wear.</p>
        <p class="landing-p">A no-risk pilot program is available so practices can evaluate Long-Term Holter Monitoring workflow before broader adoption.</p>
        ${relatedLinks([
          { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
          { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry" },
          { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Monitoring System" },
          { href: "cardiac-monitoring-services.html", label: "All Services" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "Do Long-Term Holter and Extended Holter refer to related monitoring concepts?",
        a: "Yes. Extended Holter is sometimes used as a supporting alternate phrase for longer continuous ambulatory ECG monitoring. Specialized Medical primarily uses Long-Term Holter Monitoring as the primary term for monitoring beyond the typical 24–48 hour Holter window.",
      },
      {
        q: "When is Long-Term Holter Monitoring ordered?",
        a: "It is typically ordered when the clinician needs continuous ECG recording for a period longer than a standard 24–48 hour Holter study, based on clinical judgment and the written order.",
      },
      {
        q: "Is the S-Patch suitable for longer wear?",
        a: "The S-Patch Monitoring System is Specialized Medical’s primary featured option and is designed for patient-friendly wear, including longer monitoring windows when ordered. Device suitability follows the physician order and clinical context.",
      },
      {
        q: "How are reports delivered?",
        a: "Physician-ready reports are prepared after study completion and are designed to support efficient review and EMR workflows. Timing can vary by study type and practice protocol.",
      },
      {
        q: "Can we pilot Long-Term Holter Monitoring?",
        a: "Yes. Practices can start a no-risk pilot program or request a demo to evaluate workflow fit.",
      },
    ],
  },
  {
    id: "event",
    slug: "cardiac-event-monitoring",
    file: "cardiac-event-monitoring.html",
    title: "Cardiac Event Monitoring | Symptom & Rhythm Capture | Specialized Medical",
    metaDescription:
      "Cardiac Event Monitoring from Specialized Medical for longer ambulatory windows with symptom logging, rhythm-event capture, alerts, physician-ready reports, and patient support.",
    serviceName: "Cardiac Event Monitoring",
    pill: "Event Monitoring",
    h1Html: `Cardiac <span class="landing-hero__title-accent">Event Monitoring</span>`,
    directAnswer:
      "Event Monitoring is an ambulatory cardiac monitoring approach used over longer windows to capture symptom-related and automatic rhythm events. Specialized Medical provides turnkey Event Monitoring with symptom logging, rhythm-event capture, protocol-based alerts, physician-ready reporting, and patient support.",
    body: `    <section class="landing-section" aria-labelledby="event-what-heading">
      <div class="figma-container">
        <h2 id="event-what-heading" class="landing-h2">Event Monitoring Over <span class="landing-h2__accent">Longer Windows</span></h2>
        <p class="landing-p">Event Monitoring is often selected when symptoms are intermittent and a longer ambulatory period is needed to capture clinically relevant rhythm events. Study length follows the physician order and practice workflow.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Symptom Logging &amp; <span class="landing-h2__accent">Rhythm-Event Capture</span></h2>
        <p class="landing-p">Patients can log symptoms digitally during monitoring. Captured rhythm events and symptom context are organized for clinician review on physician-ready reports. Alert routing and monitoring support follow practice protocols and do not guarantee detection of every event or any clinical outcome.</p>
        <h3 class="landing-h3">Alerts, Reporting &amp; Patient Support</h3>
        <ul class="landing-list">
          <li>Protocol-based arrhythmia and event notification options</li>
          <li>Physician-ready reporting for interpretation workflows</li>
          <li>Patient support resources during the monitoring period</li>
          <li>Turnkey operations so practices do not need an in-house monitoring center</li>
        </ul>
        ${relatedLinks([
          { href: "holter-monitoring-services.html", label: "Holter Monitoring" },
          { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry" },
          { href: "ambulatory-cardiac-monitoring.html", label: "Ambulatory Cardiac Monitoring" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "How does Event Monitoring differ from Holter Monitoring?",
        a: "Holter Monitoring is typically a continuous short-window recording (often 24–48 hours). Event Monitoring generally covers a longer ambulatory period focused on capturing symptom-related and automatic rhythm events over time, based on the physician order.",
      },
      {
        q: "Can patients log symptoms during Event Monitoring?",
        a: "Yes. Symptom logging is supported so clinicians can review symptom context alongside captured rhythm information on the final report when entries are made.",
      },
      {
        q: "Are alerts part of Event Monitoring?",
        a: "Protocol-based alerts and monitoring support can be part of the program. Alerting does not guarantee that every arrhythmia will be detected or that any specific clinical outcome will occur.",
      },
      {
        q: "Who provides patient support?",
        a: "Specialized Medical provides patient support resources during active monitoring so office staff are not solely responsible for day-to-day patient questions about the monitor.",
      },
      {
        q: "Is billing or reimbursement guaranteed?",
        a: "No. Specialized Medical may provide billing support materials and coordination help, but does not guarantee reimbursement, payment, or financial results.",
      },
    ],
  },
  {
    id: "amb",
    slug: "ambulatory-cardiac-monitoring",
    file: "ambulatory-cardiac-monitoring.html",
    title: "Ambulatory Cardiac Monitoring | Holter, Event & MCT | Specialized Medical",
    metaDescription:
      "Ambulatory cardiac monitoring overview from Specialized Medical covering Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry for physician practices.",
    serviceName: "Ambulatory Cardiac Monitoring",
    pill: "Ambulatory Cardiac Monitoring",
    h1Html: `Ambulatory <span class="landing-hero__title-accent">Cardiac Monitoring</span>`,
    directAnswer:
      "Ambulatory cardiac monitoring is the broader category of outpatient ECG monitoring that patients wear while continuing daily activities. Specialized Medical supports Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry as turnkey options so practices can match the modality to the physician order and workflow.",
    body: `    <section class="landing-section" aria-labelledby="amb-what-heading">
      <div class="figma-container">
        <h2 id="amb-what-heading" class="landing-h2">The Broader Monitoring <span class="landing-h2__accent">Category</span></h2>
        <p class="landing-p">Ambulatory cardiac monitoring includes several ordered modalities that differ by duration, continuity of recording, and how data is transmitted or reviewed. Choosing the right type depends on clinical questions, symptom frequency, and the written physician order—not on a one-size-fits-all product pitch.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Modalities Practices <span class="landing-h2__accent">Can Order</span></h2>
        <div class="landing-grid landing-grid--2">
          <article class="landing-card">
            <h3 class="landing-h3"><a href="holter-monitoring-services.html">Holter Monitoring</a></h3>
            <p class="landing-p">Continuous short-window ECG recording, commonly 24–48 hours.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a></h3>
            <p class="landing-p">Continuous monitoring beyond the typical short Holter window.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="cardiac-event-monitoring.html">Event Monitoring</a></h3>
            <p class="landing-p">Longer windows focused on symptom and rhythm-event capture.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry</a></h3>
            <p class="landing-p">Live-streaming ECG data with 24/7 monitoring support and alert workflows.</p>
          </article>
        </div>
        <h3 class="landing-h3" style="margin-top:2rem">Matching Modality to Order &amp; Workflow</h3>
        <p class="landing-p">Specialized Medical helps practices operationalize the ordered modality with equipment, enrollment workflow, monitoring support, and reporting. Clinical selection remains with the ordering physician. Neutral billing support materials may be provided; reimbursement is not guaranteed.</p>
        ${relatedLinks([
          { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
          { href: "cardiology-practice-cardiac-monitoring.html", label: "Cardiology Practice Monitoring" },
          { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Monitoring System" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "What is ambulatory cardiac monitoring?",
        a: "It is outpatient ECG monitoring performed while patients continue normal activities, using ordered modalities such as Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, or Mobile Cardiac Telemetry.",
      },
      {
        q: "How do practices choose the right monitoring type?",
        a: "Selection is based on the physician order, clinical question, symptom pattern, and desired monitoring window. Specialized Medical supports operational delivery of the ordered modality.",
      },
      {
        q: "Does Specialized Medical offer all major ambulatory modalities?",
        a: "Yes. Specialized Medical supports Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry as turnkey services.",
      },
      {
        q: "Is live ECG part of every ambulatory study?",
        a: "Live-streaming ECG data is available across applicable study types using Specialized Medical’s platform. Exact transmission behavior depends on the ordered modality and device workflow.",
      },
      {
        q: "Can cardiology practices pilot ambulatory monitoring?",
        a: "Yes. Practices can request a demo or start a no-risk pilot program to evaluate workflow before broader rollout.",
      },
    ],
  },
  {
    id: "spatch",
    slug: "s-patch-cardiac-monitoring-system",
    file: "s-patch-cardiac-monitoring-system.html",
    title: "S-Patch Monitoring System | Live ECG Cardiac Monitor | Specialized Medical",
    metaDescription:
      "The S-Patch Monitoring System is Specialized Medical’s primary featured cardiac monitor—compact, patient-friendly, with live ECG data support, reporting, and practice workflow integration.",
    serviceName: "S-Patch Monitoring System",
    pill: "S-Patch Monitoring System",
    h1Html: `S-Patch <span class="landing-hero__title-accent">Monitoring System</span>`,
    directAnswer:
      "The S-Patch Monitoring System is Specialized Medical’s primary featured ambulatory cardiac monitoring device. It is designed for patient comfort, live-streaming ECG data support, and physician-ready reporting across Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry workflows.",
    heroActions: [
      {
        className: "figma-btn figma-btn--solid",
        href: contactHref({ interest: "demo", service: "s-patch-cardiac-monitoring-system" }),
        label: "Request a Demo",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: "services/equipment.html",
        label: "Compare Equipment",
      },
    ],
    body: `    <section class="landing-section" aria-labelledby="spatch-what-heading">
      <div class="figma-container">
        <h2 id="spatch-what-heading" class="landing-h2">Primary Featured <span class="landing-h2__accent">Monitoring System</span></h2>
        <p class="landing-p">Specialized Medical features the S-Patch as the primary monitoring system for turnkey cardiac monitoring programs. It is intended to support high-quality ECG capture with a compact form factor patients can wear during daily activities.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Comfort, Battery &amp; <span class="landing-h2__accent">Water Resistance</span></h2>
        <p class="landing-p">The S-Patch weighs approximately 0.6 oz, is designed to run at least 10 days per battery under typical use, and is water-resistant (IP55). These specifications describe device attributes and do not imply guaranteed clinical outcomes or uninterrupted connectivity.</p>
        <ul class="landing-list">
          <li>Live-streaming ECG data support across applicable study types</li>
          <li>Patient-friendly wear experience for ambulatory monitoring</li>
          <li>Physician-ready reporting with symptom context when logged</li>
          <li>Integration with Specialized Medical’s turnkey monitoring workflow</li>
        </ul>
        <h3 class="landing-h3">S-Patch and Lead-Wire Options</h3>
        <p class="landing-p">Lead-Wire systems remain available as a secondary monitoring option where appropriate. Specs differ by device; neither option is positioned to undermine the other. Compare details on our <a href="services/equipment.html">Monitoring Equipment</a> page.</p>
        ${relatedLinks([
          { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
          { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR Cardiac Monitoring" },
          { href: "services/equipment.html", label: "Equipment Options" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "Is the S-Patch Specialized Medical’s primary system?",
        a: "Yes. The S-Patch Monitoring System is the primary featured monitoring system. Lead-Wire remains available as a secondary option where appropriate.",
      },
      {
        q: "Is the S-Patch water-resistant?",
        a: "The S-Patch is water-resistant with an IP55 rating. Patients should still follow provided wear and care instructions for their ordered study.",
      },
      {
        q: "Does the S-Patch support live ECG data?",
        a: "Yes. The S-Patch supports live-streaming ECG data as part of Specialized Medical’s monitoring platform across applicable study types.",
      },
      {
        q: "How does S-Patch compare to Lead-Wire?",
        a: "Both can support ordered cardiac monitoring. Physical specifications and wear characteristics differ. See the Monitoring Equipment page for device-specific details without assuming every monitor shares the same specs.",
      },
      {
        q: "Can practices try the S-Patch before full adoption?",
        a: "Yes. Request a demo or start a no-risk pilot program to evaluate the S-Patch Monitoring System in your workflow.",
      },
    ],
  },
  {
    id: "live",
    slug: "live-ecg-monitoring",
    file: "live-ecg-monitoring.html",
    title: "Live ECG Monitoring | Live-Streaming ECG Data | Specialized Medical",
    metaDescription:
      "Live-streaming ECG monitoring from Specialized Medical for real-time rhythm visibility, symptom logging, arrhythmia alerts, and physician-ready reports—without guaranteed connectivity claims.",
    serviceName: "Live ECG Monitoring",
    pill: "Live ECG Monitoring",
    h1Html: `Live-Streaming <span class="landing-hero__title-accent">ECG Monitoring</span>`,
    directAnswer:
      "Live-streaming ECG monitoring gives clinicians near real-time rhythm visibility during ambulatory studies instead of waiting for manual device uploads after the fact. Specialized Medical supports live ECG data with symptom logging, protocol-based arrhythmia alerts, rural and lower-coverage transmission design, and physician-ready reporting.",
    body: `    <section class="landing-section" aria-labelledby="live-what-heading">
      <div class="figma-container">
        <h2 id="live-what-heading" class="landing-h2">Real-Time Rhythm <span class="landing-h2__accent">Visibility</span></h2>
        <p class="landing-p">Live-streaming ECG data is designed to reduce delays associated with manual upload workflows. Clinicians and monitoring teams can review transmitted rhythm information during the study according to modality and protocol. Connectivity is not guaranteed in every location or moment; the platform is engineered to support consistent transmission, including multi-path cellular approaches for rural and lower-coverage environments.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Symptoms, Alerts &amp; <span class="landing-h2__accent">Fewer Upload Delays</span></h2>
        <ul class="landing-list">
          <li>Digital symptom logging tied to ECG context when patients enter symptoms</li>
          <li>Protocol-based arrhythmia alert routing by email, text, or phone</li>
          <li>Reduced reliance on end-of-study manual uploads for data visibility</li>
          <li>Physician-ready reports after study completion for interpretation workflows</li>
        </ul>
        <p class="landing-p">Specialized Medical does not claim that connectivity, detection, clinical outcomes, or speed of intervention are guaranteed.</p>
        ${relatedLinks([
          { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry" },
          { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Monitoring System" },
          { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR Cardiac Monitoring" },
          { href: "cardiac-monitoring-services.html", label: "All Services" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "What does live-streaming ECG data mean?",
        a: "It means ECG information is transmitted during the monitoring period for near real-time visibility, rather than depending only on a later manual upload after the device is returned.",
      },
      {
        q: "Does live ECG eliminate all data delays?",
        a: "Live streaming is designed to reduce manual upload delays. Transmission can still vary with coverage and device conditions. Connectivity and outcomes are not guaranteed.",
      },
      {
        q: "How are arrhythmia alerts handled?",
        a: "Alerts follow practice-defined protocols and may be delivered by email, text, or phone. Alerting supports clinical workflows and does not guarantee detection of every event.",
      },
      {
        q: "Is live ECG useful in rural areas?",
        a: "Specialized Medical’s multi-path cellular transmission approach is designed to support rural and lower-coverage environments, without guaranteeing continuous connectivity in every setting.",
      },
      {
        q: "Are reports still provided after the study?",
        a: "Yes. Physician-ready reports are prepared to support interpretation, documentation, and EMR workflows after monitoring is complete.",
      },
    ],
  },
  {
    id: "tavr",
    slug: "post-tavr-cardiac-monitoring",
    file: "post-tavr-cardiac-monitoring.html",
    title: "Post-TAVR Cardiac Monitoring | Live ECG & MCT | Specialized Medical",
    metaDescription:
      "Post-TAVR cardiac monitoring with live-streaming ECG, MCT, S-Patch technology, 24/7 monitoring support, and physician-ready reports from Specialized Medical.",
    serviceName: "Post-TAVR Cardiac Monitoring",
    pill: "Post-TAVR Cardiac Monitoring",
    h1Html: `Post-TAVR Cardiac Monitoring with <span class="landing-hero__title-accent">Live-Streaming ECG</span>`,
    directAnswer:
      "Specialized Medical supports Post-TAVR cardiac monitoring programs with Mobile Cardiac Telemetry, the S-Patch Monitoring System, live-streaming ECG data, 24/7 monitoring support, physician-ready reports, and protocol-based arrhythmia alert workflows—helping practices operationalize ordered outpatient rhythm monitoring after TAVR.",
    heroActions: [
      {
        className: "figma-btn figma-btn--solid",
        href: contactHref({ interest: "sales", service: "post-tavr-cardiac-monitoring" }),
        label: "Discuss Post-TAVR Monitoring Support",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: "#tavr-workflow-heading",
        label: "See the Monitoring Workflow",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: contactHref({ interest: "beta", service: "post-tavr-cardiac-monitoring" }),
        label: "Start a No-Risk Pilot Program",
      },
    ],
    body: `    <section class="landing-section" aria-labelledby="tavr-why-heading">
      <div class="figma-container">
        <h2 id="tavr-why-heading" class="landing-h2">Why Post-TAVR Rhythm Monitoring <span class="landing-h2__accent">Matters</span></h2>
        <p class="landing-p">After TAVR, patients may remain at elevated risk for delayed conduction abnormalities and arrhythmias during recovery. Outpatient cardiac monitoring can help clinicians review rhythm activity over an ordered window. Monitoring supports clinical awareness; it does not guarantee detection of every event, any clinical outcome, or a specific speed of intervention.</p>
        <h2 class="landing-h2" style="margin-top:2rem">Live ECG, S-Patch &amp; <span class="landing-h2__accent">Coverage Support</span></h2>
        <p class="landing-p">Specialized Medical’s Post-TAVR-relevant MCT workflows pair the S-Patch Monitoring System with live-streaming ECG data and a multi-path cellular transmission platform designed to support consistent capture, including in rural and lower-coverage environments. Connectivity is not guaranteed in every location or moment.</p>
      </div>
    </section>
    <section class="landing-section landing-section--muted" aria-labelledby="tavr-workflow-heading">
      <div class="figma-container">
        <h2 id="tavr-workflow-heading" class="landing-h2">Post-TAVR Monitoring <span class="landing-h2__accent">Workflow</span></h2>
        <ol class="landing-steps">
          <li class="landing-steps__item">
            <h3 class="landing-h3">Enroll in Web Portal</h3>
            <p class="landing-p">Staff enroll the patient and capture order details in the secure web portal.</p>
          </li>
          <li class="landing-steps__item">
            <h3 class="landing-h3">Hook Up</h3>
            <p class="landing-p">Apply the ordered monitor and confirm the patient understands wear instructions.</p>
          </li>
          <li class="landing-steps__item">
            <h3 class="landing-h3">Monitor / Alert</h3>
            <p class="landing-p">Live-streaming ECG data and 24/7 monitoring support enable protocol-based arrhythmia alert routing.</p>
          </li>
          <li class="landing-steps__item">
            <h3 class="landing-h3">Physician-Ready Report</h3>
            <p class="landing-p">Clinicians receive physician-ready reports designed for efficient review and documentation workflows.</p>
          </li>
        </ol>
        <h3 class="landing-h3" style="margin-top:2rem">Reporting &amp; Notification</h3>
        <p class="landing-p">Notifications and reports follow practice-defined protocols. Specialized Medical coordinates monitoring operations and alert delivery preferences established with your team. Language is intentionally neutral and protocol-based—no guaranteed reimbursement, profit, clinical outcome, detection, or intervention timing.</p>
        ${relatedLinks([
          { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry" },
          { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
          { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Monitoring System" },
          { href: "cardiology-practice-cardiac-monitoring.html", label: "For Cardiology Practices" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "What is Post-TAVR cardiac monitoring?",
        a: "It is outpatient cardiac rhythm monitoring ordered after TAVR to help clinicians review ECG activity during recovery. Specialized Medical supports these programs with MCT, S-Patch technology, live-streaming ECG data, and protocol-based alerts.",
      },
      {
        q: "Does Post-TAVR monitoring guarantee arrhythmia detection?",
        a: "No. Monitoring supports clinician awareness within ordered protocols. Specialized Medical does not guarantee detection, clinical outcomes, or speed of intervention.",
      },
      {
        q: "What technology is used for Post-TAVR monitoring?",
        a: "Programs commonly use Mobile Cardiac Telemetry with the S-Patch Monitoring System and live-streaming ECG data, supported by multi-path cellular transmission designed for broader coverage environments.",
      },
      {
        q: "How does the workflow work for clinic staff?",
        a: "Staff enroll the patient in the web portal, complete hook-up, and Specialized Medical supports monitor/alert operations and physician-ready reporting according to practice protocols.",
      },
      {
        q: "Can we discuss Post-TAVR monitoring support for our program?",
        a: "Yes. Use Discuss Post-TAVR Monitoring Support, Request a Demo, or Start a No-Risk Pilot Program to talk with Specialized Medical about workflow fit.",
      },
      {
        q: "Is reimbursement guaranteed for Post-TAVR monitoring?",
        a: "No. Billing support may be available, but Specialized Medical does not guarantee reimbursement, payment, or financial results.",
      },
    ],
    cta: {
      heading: "Discuss Post-TAVR",
      accent: "Monitoring Support",
      lead: "Talk with Specialized Medical about MCT, live-streaming ECG data, and turnkey workflow support for your Post-TAVR monitoring program. You can also request a demo or start a no-risk pilot program.",
      primary: {
        label: "Discuss Post-TAVR Monitoring Support",
        href: contactHref({ interest: "sales", service: "post-tavr-cardiac-monitoring" }),
      },
      secondary: {
        label: "Request a Demo →",
        href: contactHref({ interest: "demo", service: "post-tavr-cardiac-monitoring" }),
      },
    },
  },
  {
    id: "practice",
    slug: "cardiology-practice-cardiac-monitoring",
    file: "cardiology-practice-cardiac-monitoring.html",
    title: "Cardiac Monitoring for Cardiology Practices | Specialized Medical",
    metaDescription:
      "Turnkey cardiac monitoring for cardiology practices: implementation, staff workflow, equipment, physician-ready reports, patient support, and a no-risk pilot program from Specialized Medical.",
    serviceName: "Cardiology Practice Cardiac Monitoring",
    pill: "For Cardiology Practices",
    h1Html: `Cardiac Monitoring for <span class="landing-hero__title-accent">Cardiology Practices</span>`,
    directAnswer:
      "Specialized Medical provides turnkey cardiac monitoring for cardiology practices—covering implementation, staff workflow, equipment, physician-ready reports, patient support, and a no-risk pilot program—so clinics can offer Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry without building an in-house monitoring center.",
    body: `    <section class="landing-section" aria-labelledby="practice-workflow-heading">
      <div class="figma-container">
        <h2 id="practice-workflow-heading" class="landing-h2">Turnkey Workflow for <span class="landing-h2__accent">Cardiology Practices</span></h2>
        <p class="landing-p">Cardiology practices need monitoring that fits busy clinic schedules. Specialized Medical supports enrollment, hook-up, active monitoring, alert routing, reporting, and patient questions so clinical teams can focus on interpretation and care decisions.</p>
        <div class="landing-grid landing-grid--2" style="margin-top:1.5rem">
          <article class="landing-card">
            <h3 class="landing-h3">Implementation</h3>
            <p class="landing-p">Onboarding support to align alert preferences, ordering workflow, and portal access before your first monitored patients.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3">Staff Workflow</h3>
            <p class="landing-p">Simple enroll → hook-up process designed to fit normal office operations without unnecessary staff burden.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3">Equipment</h3>
            <p class="landing-p">S-Patch as the primary featured system, with Lead-Wire available where appropriate. No equipment purchase requirement for standard program models.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3">Reports &amp; Patient Support</h3>
            <p class="landing-p">Physician-ready reports for review workflows plus patient support resources during active monitoring.</p>
          </article>
        </div>
        <p class="landing-p" style="margin-top:1.25rem">Neutral billing support may include documentation templates and coordination with billing staff. Specialized Medical does not guarantee reimbursement or profit.</p>
        <h3 class="landing-h3">Explore Service Pages</h3>
        ${relatedLinks([
          { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
          { href: "holter-monitoring-services.html", label: "Holter Monitoring" },
          { href: "long-term-holter-monitoring.html", label: "Long-Term Holter" },
          { href: "cardiac-event-monitoring.html", label: "Event Monitoring" },
          { href: "mobile-cardiac-telemetry-mct.html", label: "MCT" },
          { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR" },
          { href: "contact.html", label: "Contact" },
        ])}
      </div>
    </section>`,
    faqs: [
      {
        q: "How does Specialized Medical work with cardiology practices?",
        a: "Specialized Medical operates as a turnkey partner: practices handle ordering and hook-up workflow, while Specialized Medical supports monitoring operations, patient support, alerts, and physician-ready reporting.",
      },
      {
        q: "Do we need to buy monitoring equipment?",
        a: "Standard program models provide equipment needed to support monitoring without requiring practices to purchase devices. Confirm current program terms with the Specialized Medical team.",
      },
      {
        q: "What modalities can cardiology practices offer?",
        a: "Holter Monitoring, Long-Term Holter Monitoring, Event Monitoring, and Mobile Cardiac Telemetry, including Post-TAVR-relevant MCT workflows when ordered.",
      },
      {
        q: "Is there a no-risk pilot program?",
        a: "Yes. Practices can start a no-risk pilot program or request a demo to evaluate workflow fit with a small patient volume.",
      },
      {
        q: "Who should we contact to discuss practice workflow?",
        a: "Use Request a Demo or Talk to Our Team on the Contact page to discuss implementation, staff workflow, and monitoring support for your cardiology practice.",
      },
    ],
    cta: {
      heading: "Discuss Workflow or",
      accent: "Request a Demo",
      lead: "Talk with Specialized Medical about turnkey cardiac monitoring for your cardiology practice—implementation, staff workflow, equipment, reports, and patient support.",
      primary: {
        label: "Request a Demo",
        href: contactHref({ interest: "demo", service: "cardiology-practice-cardiac-monitoring" }),
      },
      secondary: { label: "Call 1-855-SPEC-MED →", href: PHONE_HREF },
    },
    heroActions: [
      {
        className: "figma-btn figma-btn--solid",
        href: contactHref({ interest: "demo", service: "cardiology-practice-cardiac-monitoring" }),
        label: "Request a Demo",
      },
      {
        className: "figma-btn figma-btn--outline-dark",
        href: PHONE_HREF,
        label: "Call 1-855-SPEC-MED",
      },
    ],
  },
]

for (const page of PAGES) {
  const html = renderPage(page)
  const out = join(ROOT, page.file)
  writeFileSync(out, html, "utf8")
  console.log("wrote", page.file)
}

console.log(`Generated ${PAGES.length} landing pages.`)
