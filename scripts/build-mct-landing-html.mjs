/**
 * Build mobile-cardiac-telemetry-mct.html from staging backup + SEO/AEO corrections.
 * Run: node scripts/build-mct-landing-html.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const stagingPath = path.join(
  root,
  "documents/backups/mct-landing-20261015/staging-source.html"
);
const outPath = path.join(root, "mobile-cardiac-telemetry-mct.html");

const PROD = "https://www.specialized-med.com";
const PAGE_PATH = "/mobile-cardiac-telemetry-mct/";
const PAGE_URL = PROD + PAGE_PATH;
const UPDATED = "2026-10-15";

const FAQ_KEEP = [
  {
    q: "What is Mobile Cardiac Telemetry (MCT)?",
    a: "Mobile Cardiac Telemetry is an ambulatory ECG monitoring service that uses computerized rhythm analysis and transmits ECG-triggered and patient-selected events to an attended surveillance center. It can be prescribed for up to 30 days. Specialized Medical’s workflow adds LIVE ECG transmission, physician-prescribed notifications, operational visibility while the study is active, patient support and physician-ready reporting.",
  },
  {
    q: "How long can a patient wear an MCT monitor?",
    a: "MCT may be prescribed for a monitoring episode of up to 30 consecutive days. The treating physician selects the appropriate duration based on the clinical question, symptom frequency, patient risk and payer requirements. A longer period is not automatically necessary for every patient.",
  },
  {
    q: "What is the difference between MCT and Holter monitoring?",
    a: "Holter monitoring records continuously for a shorter defined period, and clinical findings are generally presented after the final report. MCT can continue for up to 30 days and supports attended surveillance, automatic event detection and presentation of qualifying findings during the active study according to the physician’s notification protocol.",
  },
  {
    q: "What is the difference between MCT and Cardiac Event Monitoring?",
    a: "Event Monitoring focuses on patient-triggered and selected auto-triggered ECG events over an extended period. MCT adds concurrent computerized rhythm analysis and attended surveillance. That distinction can be important when asymptomatic arrhythmias are suspected or when the physician wants a more active clinical-notification workflow.",
  },
  {
    q: "How do alerts and notifications work during an MCT study?",
    a: "ECG data may be transmitted while the study is active and connectivity is available. Qualifying findings may be reviewed during the monitoring period, and notifications follow the ordering physician’s selected protocol. Mobile Cardiac Telemetry does not replace emergency medical services.",
  },
  {
    q: "What does the practice receive from Specialized Medical?",
    a: "Practices receive operational support after enrollment and hookup, including LIVE monitoring support, qualifying notifications per protocol, proactive patient outreach when connection issues are detected, and physician-ready reports organized for review, interpretation, dating and electronic signature.",
  },
  {
    q: "Can MCT detect arrhythmias when the patient has no symptoms?",
    a: "Yes. MCT can automatically capture predefined rhythm events even when the patient does not recognize symptoms or press a button. Published clinical experience has reported clinically important asymptomatic arrhythmias during MCOT monitoring. The treating physician interprets each ECG and determines its significance.",
  },
  {
    q: "What CPT codes are commonly used for MCT?",
    a: "Mobile Cardiac Telemetry services may involve CPT 93228 for the professional component and CPT 93229 for the technical component. Which entity may report each component depends on the services performed, contractual arrangement, payer requirements, and applicable billing rules. Coverage, prior authorization, frequency, documentation, and reimbursement vary by payer and plan. This information does not guarantee coverage, payment, or profitability.",
  },
  {
    q: "Does MCT replace inpatient telemetry or emergency care?",
    a: "No. MCT is an ambulatory monitoring service for appropriately selected patients. It is not intended to replace inpatient telemetry, emergency evaluation or immediate treatment for patients with unstable or potentially life-threatening conditions. The treating physician determines the appropriate care setting.",
  },
  {
    q: "Can MCT be used after TAVR?",
    a: "Yes, in selected patients. Specialized Medical’s MCT workflow combines attended LIVE ECG transmission, physician-prescribed notification of qualifying arrhythmias, proactive patient support and Stay Connected multi-carrier technology that helps maintain transmission when connectivity is available. It may identify delayed high-grade AV block, complete heart block, bradycardia, pauses and new atrial fibrillation or flutter after discharge. Patient selection and monitoring duration are determined by the structural heart team.",
  },
  {
    q: "Does the system work in rural areas?",
    a: "Specialized Medical’s Stay Connected multi-carrier technology uses available cellular pathways from major U.S. networks to help patients remain connected across urban, suburban and many rural areas. If a connection or transmission problem is detected, Specialized Medical can proactively contact the patient to help restore the study. Actual performance depends on available network coverage, building conditions and local factors, so uninterrupted coverage is not guaranteed.",
  },
  {
    q: "How can a practice evaluate Specialized Medical’s MCT service?",
    a: "A physician practice can request a demonstration or begin a small no-risk pilot program. The evaluation should review patient enrollment, hookup, LIVE ECG transmission, notification protocols, operational support, symptom logging, reporting, physician interpretation workflow and billing support.",
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqAccordionHtml() {
  return FAQ_KEEP.map((item, i) => {
    const open = i === 0;
    return `<div class="faq-item">
      <button type="button" id="faq-trigger-mct-${i}" class="faq-item__trigger" aria-expanded="${open ? "true" : "false"}" aria-controls="faq-panel-mct-${i}">
        <span class="faq-item__q">${esc(item.q)}</span>
        <svg class="faq-item__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div id="faq-panel-mct-${i}" role="region" aria-labelledby="faq-trigger-mct-${i}" class="faq-item__panel"${open ? "" : " hidden"}>
        <p>${esc(item.a)}</p>
      </div>
    </div>`;
  }).join("\n");
}

function jsonLdGraph() {
  const orgId = `${PROD}/#organization`;
  const pageId = `${PAGE_URL}#webpage`;
  const serviceId = `${PAGE_URL}#service`;
  const faqId = `${PAGE_URL}#faq`;
  const breadcrumbId = `${PAGE_URL}#breadcrumb`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": pageId,
        name: "Mobile Cardiac Telemetry (MCT) | Live ECG Monitoring",
        headline: "Mobile Cardiac Telemetry Built for Modern Cardiology Practices",
        url: PAGE_URL,
        description:
          "Specialized Medical provides up to 30 days of MCT with live ECG transmission, attended surveillance, prescribed notifications and physician-ready reporting.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${PROD}/#website` },
        publisher: { "@id": orgId },
        provider: { "@id": orgId },
        dateModified: UPDATED,
        author: {
          "@type": "Person",
          name: "Steven M. Burns",
          jobTitle: "President & CEO",
          worksFor: { "@id": orgId },
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${PROD}/images/landing/mobile-cardiac-telemetry-mct-hero.webp`,
          width: 1430,
          height: 550,
        },
        mainEntity: { "@id": serviceId },
        about: { "@id": serviceId },
        breadcrumb: { "@id": breadcrumbId },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".landing-hero__lead", ".landing-answer"],
        },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "Mobile Cardiac Telemetry (MCT)",
        serviceType: "Ambulatory Cardiac Monitoring",
        provider: { "@id": orgId },
        areaServed: "United States",
        description:
          "Specialized Medical provides up to 30 days of MCT with live ECG transmission, attended surveillance, prescribed notifications and physician-ready reporting.",
        url: PAGE_URL,
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: "Specialized Medical LLC",
        url: PROD + "/",
        telephone: "+1-855-773-2633",
        email: "info@specialized-med.com",
        logo: `${PROD}/images/figma-assets/Group%201261157085.svg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "34145 Pacific Coast Highway, #700",
          addressLocality: "Dana Point",
          addressRegion: "CA",
          postalCode: "92629",
          addressCountry: "US",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${PROD}/#website`,
        name: "Specialized Medical",
        url: PROD + "/",
        publisher: { "@id": orgId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: PROD + "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: PROD + "/services/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Mobile Cardiac Telemetry (MCT)",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: PAGE_URL,
        mainEntity: FAQ_KEEP.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return JSON.stringify(graph, null, 2);
}

function rewriteInternalLinks(html) {
  const map = [
    ["/cardiac-monitoring-services", "services/"],
    ["/live-ecg-monitoring", "services/"],
    ["/s-patch-cardiac-monitoring-system", "services/equipment/"],
    ["/cardiac-event-monitoring", "services/"],
    ["/holter-monitoring-services", "services/"],
    ["/long-term-holter-monitoring", "services/"],
    ["/post-tavr-cardiac-monitoring", "post-tavr-cardiac-monitoring/"],
    ["/cardiology-practice-cardiac-monitoring", "clinical-stories/"],
    ["/mobile-cardiac-telemetry-mct", "mobile-cardiac-telemetry-mct/"],
    ["/contact", "contact/"],
    ["/about", "about/"],
    ["/services", "services/"],
    ["/faq", "faq/"],
  ];

  let out = html;
  for (const [from, to] of map) {
    const re = new RegExp(`href=(['"])${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(/|\\.html)?\\1`, "gi");
    out = out.replace(re, `href=$1${to}$1`);
  }
  // Absolute staging / root paths already rewritten; also fix quoted single variants left
  out = out.replace(/https:\/\/zesty-pothos-c8949b\.netlify\.app/gi, PROD);
  return out;
}

function buildHead() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <script>
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
          "mobile-cardiac-telemetry-mct": 1,
          "post-tavr-cardiac-monitoring": 1
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
  <!-- sm-site-base -->
  <script type="application/ld+json">
${jsonLdGraph()}
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mobile Cardiac Telemetry (MCT) | Live ECG Monitoring</title>
  <meta name="description" content="Specialized Medical provides up to 30 days of MCT with live ECG transmission, attended surveillance, prescribed notifications and physician-ready reporting.">
  <meta property="og:site_name" content="Specialized Medical">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Mobile Cardiac Telemetry (MCT) | Live ECG Monitoring">
  <meta property="og:description" content="Specialized Medical provides up to 30 days of MCT with live ECG transmission, attended surveillance, prescribed notifications and physician-ready reporting.">
  <meta property="og:url" content="${PAGE_URL}">
  <meta property="og:image" content="${PROD}/images/landing/mobile-cardiac-telemetry-mct-hero.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Mobile Cardiac Telemetry (MCT) | Live ECG Monitoring">
  <meta name="twitter:description" content="Specialized Medical provides up to 30 days of MCT with live ECG transmission, attended surveillance, prescribed notifications and physician-ready reporting.">
  <meta name="twitter:image" content="${PROD}/images/landing/mobile-cardiac-telemetry-mct-hero.jpg">
  <!-- Staging / pre-gate: keep noindex until Stages 0–6 acceptance. Flip to index,follow for production launch. -->
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.clarity.ms">
  <link rel="preload" as="image" href="images/landing/mobile-cardiac-telemetry-mct-hero-960.webp" type="image/webp" imagesrcset="images/landing/mobile-cardiac-telemetry-mct-hero-640.webp 640w, images/landing/mobile-cardiac-telemetry-mct-hero-960.webp 960w, images/landing/mobile-cardiac-telemetry-mct-hero-1280.webp 1280w, images/landing/mobile-cardiac-telemetry-mct-hero.webp 1430w" imagesizes="(max-width: 900px) 100vw, 1430px" fetchpriority="high">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=optional">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=optional" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=optional" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/chrome.css">
  <link rel="stylesheet" href="css/landing-mct.css">
  <link rel="stylesheet" href="css/faq.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="css/faq.css"></noscript>
  <link rel="canonical" href="${PAGE_URL}">
</head>`;
}

function formBlock() {
  return `<section class="landing-section landing-cta-block" id="cta-form" aria-labelledby="mct-cta-heading">
      <div class="figma-container">
        <div class="landing-cta-block__box">
          <div class="landing-cta-block__copy">
            <h2 id="mct-cta-heading" class="landing-h2">Start a No-Risk MCT Pilot</h2>
            <p class="landing-p">Tell us about your practice, and a Specialized Medical representative will contact you regarding an MCT demonstration or pilot program.</p>
            <p class="landing-p landing-cta-block__phone">Prefer to talk? <a href="tel:+18557732633" data-mct-track="phone_click">Speak With a Cardiac Monitoring Specialist &mdash; 1-855-SPEC-MED (1-855-773-2633)</a></p>
            <p class="landing-cta-form__emergency">Specialized Medical provides diagnostic ambulatory monitoring. The system is not a replacement for emergency medical services. Patients with urgent symptoms should call 911 or follow emergency instructions rather than waiting for a monitoring call.</p>
            <p class="landing-cta-form__privacy" role="note"><strong>Privacy notice:</strong> Please do not submit patient names, medical records, or other protected health information through this form. See our <a href="privacy/">Privacy Policy</a>.</p>
          </div>
          <form class="landing-cta-form contact-form" action="https://api.web3forms.com/submit" method="POST" novalidate>
            <input type="hidden" name="access_key" value="8ec7a28a-1979-4c39-8791-18fbf60bba44">
            <input type="hidden" name="subject" value="MCT Pilot / Demonstration Request — Specialized Medical">
            <input type="hidden" name="from_page" value="mobile-cardiac-telemetry-mct">
            <input type="hidden" name="redirect" value="">
            <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Name <abbr title="required">*</abbr></span>
                <input name="name" type="text" autocomplete="name" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Practice / Organization <abbr title="required">*</abbr></span>
                <input name="organization" type="text" autocomplete="organization" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Role <abbr title="required">*</abbr></span>
                <input name="role" type="text" autocomplete="organization-title" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Business Email <abbr title="required">*</abbr></span>
                <input name="email" type="email" autocomplete="email" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Phone <abbr title="required">*</abbr></span>
                <input name="phone" type="tel" autocomplete="tel" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">State <abbr title="required">*</abbr></span>
                <input name="state" type="text" autocomplete="address-level1" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Interest <abbr title="required">*</abbr></span>
                <select name="interest" required>
                  <option value="" disabled selected>Select an option</option>
                  <option value="Pilot">Start a No-Risk MCT Pilot</option>
                  <option value="Demonstration">Request an MCT Demonstration</option>
                  <option value="Both">Both</option>
                </select>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Preferred contact method <abbr title="required">*</abbr></span>
                <select name="preferred_contact" required>
                  <option value="" disabled selected>Select an option</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Either">Either</option>
                </select>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field landing-cta-form__field--full">
                <span class="landing-cta-form__label">Approximate monthly monitoring volume <span class="landing-cta-form__optional">(optional)</span></span>
                <input name="monthly_volume" type="text" autocomplete="off" inputmode="numeric" placeholder="e.g. 10–20 studies">
              </label>
            </div>
            <button type="submit" class="figma-btn figma-btn--solid landing-cta-form__submit">Start a No-Risk MCT Pilot</button>
            <p class="landing-cta-form__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>`;
}

function relatedBlock() {
  return `<section class="landing-section" aria-labelledby="mct-related-heading">
      <div class="figma-container">
        <h2 id="mct-related-heading" class="landing-h2">Related Cardiac Monitoring <span class="landing-h2__accent">Resources</span></h2>
        <ul class="landing-related">
          <li><a href="services/">Cardiac Monitoring Services</a></li>
          <li><a href="services/equipment/">S-Patch Cardiac Monitoring Equipment</a></li>
          <li><a href="services/">Holter Monitoring</a></li>
          <li><a href="services/">Long-Term Holter Monitoring</a></li>
          <li><a href="services/">Cardiac Event Monitoring</a></li>
          <li><a href="post-tavr-cardiac-monitoring/">Post-TAVR Cardiac Monitoring</a></li>
          <li><a href="clinical-stories/">Clinical Stories</a></li>
          <li><a href="faq/">FAQs</a></li>
          <li><a href="contact/">Contact / Request a Pilot</a></li>
        </ul>
      </div>
    </section>`;
}

function main() {
  let html = fs.readFileSync(stagingPath, "utf8");

  // Strip Netlify promo comment
  html = html.replace(/<!-- This site is hosted on Netlify[\s\S]*?-->\s*/i, "");

  // Extract body main through end of main
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) throw new Error("Could not find <main> in staging HTML");
  let mainHtml = mainMatch[0];

  // Extract header + footer from staging for consistency with local chrome style,
  // but rebuild header/footer from local contact page patterns via simpler relative links.
  const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (!headerMatch || !footerMatch) throw new Error("Missing header/footer");

  let header = headerMatch[0]
    .replace(/href=(['"])\/contact#contact-form\1/gi, 'href=$1#cta-form$1')
    .replace(/href=(['"])\/contact\1/gi, 'href=$1contact/$1')
    .replace(/Request a Demo/g, "Request an MCT Demonstration");

  // Prefer portal tracking attribute
  header = header.replace(
    /href="https:\/\/sft\.specialized-med-business\.com\/specMed\/"/g,
    'href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click"'
  );

  let footer = footerMatch[0];
  footer = rewriteInternalLinks(footer);
  footer = footer.replace(
    /<span><a href=['"]services\/['"]>Holter Monitoring<\/a><\/span>/,
    '<span><a href="services/">Holter Monitoring</a></span>'
  );

  mainHtml = rewriteInternalLinks(mainHtml);

  // Remove overview graphic section (unsupported claims risk)
  mainHtml = mainHtml.replace(
    /<section class="landing-section landing-section--overview"[\s\S]*?<\/section>\s*/i,
    ""
  );

  // Hero: Appendix A copy + WebP/JPG picture
  mainHtml = mainHtml.replace(
    /<section class="landing-hero"[\s\S]*?<\/section>/i,
    `<section class="landing-hero" aria-labelledby="mct-hero-heading">
      <div class="landing-hero__plate landing-hero__plate--mobile-cardiac-telemetry-mct">
        <picture>
          <source type="image/webp" srcset="images/landing/mobile-cardiac-telemetry-mct-hero.webp">
          <img class="landing-hero__media" src="images/landing/mobile-cardiac-telemetry-mct-hero.jpg" alt="Specialized Medical S-Patch mobile cardiac telemetry system with a connected phone displaying live ECG data." width="1430" height="550" fetchpriority="high" decoding="async">
        </picture>
        <div class="landing-hero__gradient" aria-hidden="true"></div>
        <div class="landing-hero__inner figma-container">
          <p class="figma-hero__pill">
            <span class="figma-hero__pill-dot" aria-hidden="true"></span>
            LIVE ECG STREAMING | ATTENDED SURVEILLANCE | PHYSICIAN-READY INFORMATION
          </p>
          <h1 id="mct-hero-heading" class="landing-hero__title">
            Mobile Cardiac Telemetry Built for <span class="landing-hero__title-accent">Modern Cardiology Practices</span>
          </h1>
          <p class="landing-hero__lead landing-answer">Specialized Medical provides up to 30 days of ambulatory ECG monitoring with live data transmission, automatic and patient-triggered event capture, physician-prescribed notification protocols, patient support, and physician-ready reporting.</p>
          <div class="landing-hero__actions">
            <a class="figma-btn figma-btn--solid" href="#cta-form" data-mct-track="mct_cta_pilot">Start a No-Risk MCT Pilot</a>
            <a class="figma-btn figma-btn--outline-dark" href="#cta-form" data-mct-track="mct_cta_demo">Request an MCT Demonstration</a>
          </div>
        </div>
      </div>
    </section>`
  );

  // Breadcrumb → Services hub
  mainHtml = mainHtml.replace(
    /<li><a href=['"][^'"]*['"]>Cardiac Monitoring Services<\/a><\/li>/i,
    '<li><a href="services/">Services</a></li>'
  );

  // Compliance wording → visitor-facing note
  mainHtml = mainHtml.replace(
    /<div class="landing-note landing-note--info" role="note">\s*<p class="landing-note__title">Compliance wording<\/p>\s*<p class="landing-note__body">[\s\S]*?<\/p>\s*<\/div>/i,
    `<div class="landing-note landing-note--info" role="note">
          <p class="landing-note__body">Specialized Medical records, detects, identifies, captures, and presents qualifying ECG findings for physician review. The monitoring system does not independently diagnose, treat, prevent, or guarantee avoidance of hospitalization, stroke, sudden death, or pacemaker implantation.</p>
        </div>`
  );

  // Required safety statement → polished safety note
  mainHtml = mainHtml.replace(
    /<div class="landing-note landing-note--alert" role="note">\s*<p class="landing-note__title">Required safety statement<\/p>\s*<p class="landing-note__body">([\s\S]*?)<\/p>\s*<\/div>/i,
    `<div class="landing-note landing-note--alert" role="note">
          <p class="landing-note__body">$1</p>
        </div>`
  );

  // Clinical review placeholder → Appendix A editorial wording
  mainHtml = mainHtml.replace(
    /<div class="landing-eeat__review">[\s\S]*?<\/div>\s*<div class="landing-eeat__policy">/i,
    `<div class="landing-eeat__review">
            <h3 class="landing-h3">Editorial review</h3>
            <p class="landing-p"><strong>Last updated:</strong> October 15, 2026</p>
            <p class="landing-p">Reviewed by Specialized Medical for service, workflow, and technical accuracy. This page provides general information for healthcare professionals and does not replace clinical judgment, payer requirements, emergency services, or institutional protocols.</p>
          </div>
          <div class="landing-eeat__policy">`
  );

  // CPT section → Appendix A wording
  mainHtml = mainHtml.replace(
    /<section class="landing-section landing-section--muted" aria-labelledby="mct-cpt-heading">[\s\S]*?<\/section>/i,
    `<section class="landing-section landing-section--muted" aria-labelledby="mct-cpt-heading">
      <div class="figma-container">
        <h2 id="mct-cpt-heading" class="landing-h2">CPT Codes Commonly Associated With Mobile Cardiac <span class="landing-h2__accent">Telemetry</span></h2>
        <p class="landing-p landing-answer">Mobile Cardiac Telemetry services may involve CPT 93228 for the professional component and CPT 93229 for the technical component. Which entity may report each component depends on the services performed, contractual arrangement, payer requirements, and applicable billing rules. Coverage, prior authorization, frequency, documentation, and reimbursement vary by payer and plan. This information does not guarantee coverage, payment, or profitability.<sup class="landing-cite"><a href="https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=59268" target="_blank" rel="noopener noreferrer">[1]</a></sup></p>
        <div class="landing-note landing-note--info" role="note">
          <p class="landing-note__body">A Local Coverage Determination or billing article is not a universal national rule. Medical necessity, prior authorization, frequency, and documentation requirements vary by payer, plan, and Medicare Administrative Contractor jurisdiction. Confirm requirements with each payer before ordering.</p>
        </div>
      </div>
    </section>`
  );

  // Connectivity / LIVE transmission qualification in tech section lead
  mainHtml = mainHtml.replace(
    /<p class="landing-p">ECG data is transmitted throughout the prescribed monitoring period; qualifying findings may be reviewed while the study is active\.<\/p>/i,
    `<p class="landing-p landing-answer">ECG data may be transmitted while the study is active and connectivity is available. Qualifying findings may be reviewed during the monitoring period, and notifications follow the ordering physician’s selected protocol. Mobile Cardiac Telemetry does not replace emergency medical services.</p>`
  );

  // Soften absolute "continuous" visibility wording in trust strip
  mainHtml = mainHtml.replace(
    /<li><strong>Continuous Operational Visibility<\/strong><span>Battery, electrodes, signal and connectivity status<\/span><\/li>/i,
    `<li><strong>Operational Visibility</strong><span>Battery, electrodes, signal and connectivity status while the study is active</span></li>`
  );

  // Soften post-TAVR "important added layer of protection" / rapid claims
  mainHtml = mainHtml.replace(
    /This provides a high level of post-discharge rhythm surveillance and an important added layer of protection during a clinically significant recovery period\./i,
    "This supports post-discharge rhythm surveillance during a clinically significant recovery period when ordered by the structural heart team."
  );
  mainHtml = mainHtml.replace(/rapid physician-prescribed notification/gi, "physician-prescribed notification");

  // Mid-page CTAs hierarchy
  mainHtml = mainHtml.replace(
    /<a class="figma-btn figma-btn--solid" href="#cta-form">Request an MCT Demonstration<\/a>\s*<a class="figma-btn figma-btn--outline(?:-dark)?" href="#cta-form">Start a No-Risk Pilot Program<\/a>/gi,
    `<a class="figma-btn figma-btn--solid" href="#cta-form" data-mct-track="mct_cta_pilot">Start a No-Risk MCT Pilot</a> <a class="figma-btn figma-btn--outline-dark" href="#cta-form" data-mct-track="mct_cta_demo">Request an MCT Demonstration</a>`
  );

  // Answer-first block under What is MCT?
  mainHtml = mainHtml.replace(
    /(<h2 id="mct-what-heading"[\s\S]*?<\/h2>)\s*<p class="landing-p">/i,
    `$1
        <p class="landing-p landing-answer">Mobile Cardiac Telemetry is temporary ambulatory ECG monitoring with computerized rhythm analysis and transmission of ECG-triggered and patient-selected events to an attended surveillance center for up to 30 days when connectivity is available—supporting prescribed notifications, patient support, and physician-ready reporting without replacing emergency care.</p>
        <p class="landing-p">`
  );
  mainHtml = mainHtml.replace(
    /prescribed notification protocols, continuous operational visibility and physician-ready reporting\./i,
    "prescribed notification protocols, operational visibility while the study is active, and physician-ready reporting."
  );

  // FAQ accordion: replace items inside faq-category__list (12 curated Q&As matching schema)
  mainHtml = mainHtml.replace(
    /(<div class="faq-category__list">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/i,
    `$1\n${faqAccordionHtml()}\n          $2`
  );

  // Demo band CTAs + heading
  mainHtml = mainHtml.replace(
    /<h2 id="mct-demo-band-heading"[\s\S]*?<\/h2>/i,
    `<h2 id="mct-demo-band-heading" class="landing-h2">Start a No-Risk MCT <span class="landing-h2__accent">Pilot</span></h2>`
  );
  mainHtml = mainHtml.replace(
    /<p class="landing-p"><a class="figma-btn figma-btn--solid" href="#cta-form">Request an MCT Demonstration<\/a>\s*<a class="figma-btn figma-btn--outline" href="#cta-form">Start a No-Risk Pilot Program<\/a><\/p>/i,
    `<p class="landing-p"><a class="figma-btn figma-btn--solid" href="#cta-form" data-mct-track="mct_cta_pilot">Start a No-Risk MCT Pilot</a> <a class="figma-btn figma-btn--outline-dark" href="#cta-form" data-mct-track="mct_cta_demo">Request an MCT Demonstration</a></p>`
  );

  // Replace CTA form section + related
  mainHtml = mainHtml.replace(
    /<section class="landing-section landing-cta-block"[\s\S]*?<\/section>\s*<section class="landing-section" aria-labelledby="mct-related-heading"[\s\S]*?<\/section>/i,
    formBlock() + "\n\n    " + relatedBlock()
  );

  // Skip link
  const skip = `<a class="skip-link" href="#main-content">Skip to content</a>\n`;

  mainHtml = mainHtml.replace(
    /<main([^>]*)>/i,
    `<main$1 id="main-content" tabindex="-1">`
  );

  const body = `<body>
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-T2JLQJ7R"
      height="0"
      width="0"
      style="display:none;visibility:hidden">
    </iframe>
  </noscript>
  ${skip}<div class="site-root">
${header}


${mainHtml}
${footer}

  </div>
  <script src="js/landing-lite.js" defer></script>
  <script src="js/analytics.js" defer></script>
</body>
</html>
`;

  let page = buildHead() + "\n" + body;

  // Final scrub
  if (/zesty-pothos|Philips|Compliance wording|Required safety statement|Pending authorized/i.test(page)) {
    page = page
      .replace(/zesty-pothos-c8949b\.netlify\.app/gi, "www.specialized-med.com")
      .replace(/Compliance wording/gi, "")
      .replace(/Required safety statement/gi, "")
      .replace(/Pending authorized physician review/gi, "");
  }

  // Remove leftover Philips if any
  page = page.replace(/Philips/gi, "Specialized Medical");

  fs.writeFileSync(outPath, page, "utf8");
  console.log("Wrote", outPath, "(" + page.length + " bytes)");

  // Sanity checks
  const checks = [
    ["noindex", /noindex,\s*nofollow/i.test(page)],
    ["canonical prod", page.includes(`rel="canonical" href="${PAGE_URL}"`)],
    ["no staging host", !/zesty-pothos/i.test(page)],
    ["no compliance label", !/Compliance wording/i.test(page)],
    ["no pending review", !/Pending authorized/i.test(page)],
    ["hero webp", page.includes("mobile-cardiac-telemetry-mct-hero.webp")],
    ["cta form", page.includes('id="cta-form"')],
    ["appendix form intro", page.includes("Tell us about your practice")],
    ["PHI notice", page.includes("protected health information")],
    ["CPT appendix", page.includes("Which entity may report each component")],
    [
      "FAQ count",
      (page.match(/id="faq-trigger-mct-\d+"/g) || []).length === FAQ_KEEP.length,
    ],
  ];
  for (const [name, ok] of checks) {
    console.log(ok ? "PASS" : "FAIL", name);
  }
}

main();
