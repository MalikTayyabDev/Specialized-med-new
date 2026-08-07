/**
 * Landing page content per "Specialized Medical - SEO Content & Implementation Manual" (July 2026, v2).
 * The manual is the single source of truth: opening copy, comparison framework, FAQs,
 * CTA copy, disclaimers, and internal links are transcribed from it.
 */

/* ----------------------------- shared helpers ----------------------------- */

function p(html) {
  return `        <p class="landing-p">${html}</p>`
}

function sec(id, headingHtml, inner, { muted = false, wide = false, introBand = false } = {}) {
  const extras = [
    muted ? " landing-section--muted" : "",
    introBand ? " landing-section--intro-band" : "",
  ].join("")
  return `    <section class="landing-section${extras}" aria-labelledby="${id}-heading">
      <div class="figma-container${wide ? "" : ""}">
        <h2 id="${id}-heading" class="landing-h2">${headingHtml}</h2>
${inner}
      </div>
    </section>`
}

/** Split layout: H2 lives with the copy column so heading + text stay together. */
function secSplit(id, headingHtml, copyInner, mediaInner, { muted = false, after = "" } = {}) {
  return `    <section class="landing-section${muted ? " landing-section--muted" : ""}" aria-labelledby="${id}-heading">
      <div class="figma-container">
        <div class="landing-split">
          <div class="landing-split__copy">
            <h2 id="${id}-heading" class="landing-h2">${headingHtml}</h2>
${copyInner}
          </div>
          <div class="landing-split__media">
${mediaInner}
          </div>
        </div>${after ? `\n${after}` : ""}
      </div>
    </section>`
}

function flow(items, label) {
  return `        <ol class="landing-flow" aria-label="${label}">
${items.map((s) => `          <li class="landing-flow__step"><strong>${s.t}</strong>${s.d ? `<span>${s.d}</span>` : ""}</li>`).join("\n")}
        </ol>`
}

function figureImg(src, alt, caption) {
  return `        <figure class="landing-figure">
          <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
          ${caption ? `<figcaption class="landing-figure__cap">${caption}</figcaption>` : ""}
        </figure>`
}

/** Accessible HTML diagram when a dedicated image asset is not yet supplied. */
function diagramFig(label, inner, caption) {
  return `        <figure class="landing-diagram" role="group" aria-label="${label}">
          <div class="landing-diagram__frame">
${inner}
          </div>
          ${caption ? `<figcaption class="landing-figure__cap">${caption}</figcaption>` : ""}
        </figure>`
}

function phoneProximityDiagram() {
  return diagramFig(
    "Phone proximity and charging during ambulatory monitoring",
    `          <div class="landing-diagram__phone-prox">
            <div class="landing-diagram__device landing-diagram__device--patch"><span>Wearable monitor</span></div>
            <div class="landing-diagram__connector" aria-hidden="true">Bluetooth</div>
            <div class="landing-diagram__device landing-diagram__device--phone">
              <span>Connected phone</span>
              <span class="landing-diagram__badge">Charged &amp; powered on</span>
            </div>
            <p class="landing-diagram__hint">Keep the phone within the operating range stated in patient instructions.</p>
          </div>`,
    "Phone proximity and charging illustration: the connected phone must stay near the patient and powered during live-transmission studies."
  )
}

function symptomButtonDiagram() {
  return diagramFig(
    "Patient symptom button and event capture",
    `          <div class="landing-diagram__symptom-btn">
            <div class="landing-diagram__symptom-device" aria-hidden="true">
              <span class="landing-diagram__symptom-label">Symptom button</span>
              <span class="landing-diagram__symptom-action">Press / tap when instructed</span>
            </div>
            <ol class="landing-diagram__mini-steps">
              <li>Symptom occurs</li>
              <li>Patient marks the event</li>
              <li>ECG segment is stored or transmitted</li>
              <li>Event is reviewed per protocol</li>
            </ol>
          </div>`,
    "Patient symptom-button illustration: mark symptoms when instructed; urgent symptoms require emergency care rather than waiting for a monitoring call."
  )
}

function electrodeCareSteps() {
  return flow(
    [
      { t: "Site preparation", d: "Prepare skin for reliable electrode contact" },
      { t: "Placement", d: "Follow prescribed electrode sites for the monitor" },
      { t: "Rotation", d: "Change adhesive locations only when instructed" },
    ],
    "Electrode placement and rotation steps"
  )
}

function signalQualityDiagram() {
  return diagramFig(
    "ECG signal quality and artifact factors",
    `          <div class="landing-diagram__signal">
            <div class="landing-diagram__trace">
              <span class="landing-diagram__trace-label">Clean trace</span>
              <div class="landing-diagram__wave" aria-hidden="true"></div>
            </div>
            <div class="landing-diagram__trace landing-diagram__trace--artifact">
              <span class="landing-diagram__trace-label">Artifact</span>
              <div class="landing-diagram__wave landing-diagram__wave--noisy" aria-hidden="true"></div>
            </div>
            <ul class="landing-diagram__legend">
              <li>Movement</li>
              <li>Poor electrode contact</li>
              <li>Loose leads</li>
              <li>Skin preparation</li>
            </ul>
          </div>`,
    "Signal quality and artifact illustration: recording quality depends on electrode contact, adherence, and environment."
  )
}

function connectivityDiagram() {
  return diagramFig(
    "Monitor-to-phone connectivity",
    `          <div class="landing-diagram__connect">
            <div class="landing-diagram__device landing-diagram__device--patch"><span>S-Patch monitor</span></div>
            <div class="landing-diagram__connector" aria-hidden="true">Bluetooth ~30 ft*</div>
            <div class="landing-diagram__device landing-diagram__device--phone"><span>Connected phone</span></div>
            <div class="landing-diagram__connector" aria-hidden="true">Cellular / network</div>
            <div class="landing-diagram__device landing-diagram__device--cloud"><span>Monitoring platform</span></div>
            <p class="landing-diagram__hint">*Range varies with walls, body position, and interference.</p>
          </div>`,
    "Monitor-to-phone-to-cloud connectivity diagram for live-transmission workflows."
  )
}

/** Blueprint v3 — LIVE status indicators for Cardiac Monitoring Services pillar. */
function liveStatusIndicators() {
  return `        <ul class="landing-status-strip" aria-label="Status indicators that may be followed during a LIVE STREAMING study">
          <li>Monitor battery level</li>
          <li>Electrode quality and contact with the patient&rsquo;s body</li>
          <li>Monitor-to-phone Bluetooth connection</li>
          <li>Phone-to-network cellular connection</li>
          <li>Successful ECG data transmission</li>
          <li>Whether the patient appears to remain actively connected</li>
          <li>Signal quality and visible technical artifact</li>
        </ul>`
}

/** Blueprint v3 — monitor → phone → network → monitoring center (PART 2 visual only). */
function cmsNetworkPathDiagram() {
  return diagramFig(
    "Monitor to phone to network to monitoring center",
    `          <div class="landing-diagram__network">
            <div class="landing-diagram__network-chain">
              <div class="landing-diagram__device landing-diagram__device--patch"><span>Monitor</span></div>
              <div class="landing-diagram__connector landing-diagram__connector--inline" aria-hidden="true">Bluetooth</div>
              <div class="landing-diagram__device landing-diagram__device--phone"><span>Assigned phone</span></div>
              <div class="landing-diagram__connector landing-diagram__connector--inline" aria-hidden="true">Cellular</div>
              <div class="landing-diagram__device landing-diagram__device--cloud"><span>Monitoring center</span></div>
            </div>
            <div class="landing-diagram__carriers" aria-label="Cellular networks">
              <span>Verizon</span>
              <span>T-Mobile</span>
              <span>AT&amp;T</span>
            </div>
          </div>`,
    ""
  )
}

/** Blueprint v3 PART 2 — two patient screens only; caption is the only public-facing visual copy. */
function patientPhoneScreensDiagram() {
  return diagramFig(
    "Assigned patient phone with Device Status and Log Symptoms screens",
    `          <div class="landing-phone-demo" aria-hidden="true">
            <div class="landing-phone-demo__shell">
              <div class="landing-phone-demo__screen">
                <div class="landing-phone-demo__card">
                  <p class="landing-phone-demo__card-title">Device Status</p>
                </div>
                <div class="landing-phone-demo__card">
                  <p class="landing-phone-demo__card-title">Log Symptoms</p>
                </div>
                <div class="landing-phone-demo__tabs">
                  <span class="landing-phone-demo__tab landing-phone-demo__tab--active">Device Status</span>
                  <span class="landing-phone-demo__tab">Log Symptoms</span>
                </div>
              </div>
            </div>
          </div>`,
    "Only two simple screens - connection status and symptom logging."
  )
}

/** Opening copy block after H1 (PART 1 — no invented heading). */
function openingBlock(inner) {
  return `    <section class="landing-section landing-section--opening" aria-label="Cardiac monitoring services overview">
      <div class="figma-container">
${inner}
      </div>
    </section>`
}

/** PART 2: post-TAVR hospital-to-home timeline — labels only, no invented body copy. */
function postTavrTimeline() {
  return flow(
    [
      { t: "Hospital", d: "" },
      { t: "Discharge", d: "" },
      { t: "Home", d: "" },
      { t: "Physician review", d: "" },
    ],
    "Post-TAVR hospital-to-home monitoring timeline"
  )
}

/* ---------- Post-TAVR SEO/AEO Implementation Guide (Aug 2026) helpers ---------- */

const TAVR_REFS = [
  {
    n: 1,
    label: "ACC Expert Consensus Decision Pathway (2020)",
    href: "https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2020/10/20/20/59/2020-ACC-Expert-Consensus-Conduction-Disturbances",
  },
  {
    n: 2,
    label: "Tian et al., Circ Cardiovasc Interv. 2019. PMID 31833417",
    href: "https://pubmed.ncbi.nlm.nih.gov/31833417/",
  },
  {
    n: 3,
    label: "Muntané-Carol et al., JACC Cardiovasc Interv. 2021. PMID 34949396",
    href: "https://pubmed.ncbi.nlm.nih.gov/34949396/",
  },
  {
    n: 4,
    label: "REdireCT TAVI, Europace. 2022. PMID 35699482",
    href: "https://pubmed.ncbi.nlm.nih.gov/35699482/",
  },
  {
    n: 5,
    label: "Systematic AECG monitoring study, 2026. PMID 42059075",
    href: "https://pubmed.ncbi.nlm.nih.gov/42059075/",
  },
]

function cite(n) {
  const r = TAVR_REFS.find((x) => x.n === n)
  return `<sup class="landing-cite"><a href="${r.href}" target="_blank" rel="noopener noreferrer">[${n}]</a></sup>`
}

function trustStrip(items) {
  return `        <ul class="landing-trust-strip" aria-label="Post-TAVR monitoring differentiators">
${items.map((it) => `          <li><strong>${it.t}</strong><span>${it.d}</span></li>`).join("\n")}
        </ul>`
}

function featureBlocks(items) {
  return `        <div class="landing-feature-grid" role="list">
${items
  .map(
    (it) => `          <article class="landing-feature-card" role="listitem">
            <h3 class="landing-h3">${it.t}</h3>
            <p class="landing-p">${it.d}</p>
          </article>`
  )
  .join("\n")}
        </div>`
}

function evidenceCards(items) {
  return `        <div class="landing-evidence" role="list">
${items
  .map(
    (it) => `          <article class="landing-evidence__card" role="listitem">
            <h3 class="landing-h3">${it.title} ${cite(it.n)}</h3>
            <p class="landing-p">${it.summary}</p>
            <p class="landing-evidence__label">${it.label}</p>
          </article>`
  )
  .join("\n")}
        </div>`
}

function followUpCompareTable() {
  return `        <div class="landing-table-wrap" role="region" aria-label="Follow-up alone versus LIVE ambulatory monitoring" tabindex="0">
          <table class="landing-table">
            <caption class="sr-only">Comparison of follow-up without continuous ambulatory monitoring versus LIVE ambulatory monitoring after TAVR</caption>
            <thead>
              <tr>
                <th scope="col">Consideration</th>
                <th scope="col">Follow-up without continuous ambulatory monitoring</th>
                <th scope="col">LIVE ambulatory monitoring</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Rhythm visibility</th>
                <td>Intermittent office visits and symptom-driven follow-up</td>
                <td>Continuous ambulatory ECG collection during the prescribed period</td>
              </tr>
              <tr>
                <th scope="row">Delayed heart block</th>
                <td>May not be apparent during a scheduled office encounter</td>
                <td>Qualifying AV block, bradycardia or pauses may be identified during monitoring</td>
              </tr>
              <tr>
                <th scope="row">Patient symptoms</th>
                <td>Relies heavily on patient recognition and communication</td>
                <td>Patient-triggered symptoms can be correlated with ECG; auto-detected findings may also be reviewed</td>
              </tr>
              <tr>
                <th scope="row">Operational status</th>
                <td>No continuous device oversight</td>
                <td>Battery, electrode status, signal quality and connectivity can be monitored</td>
              </tr>
              <tr>
                <th scope="row">Clinical response</th>
                <td>Information may be available only after a visit or final report</td>
                <td>Qualifying findings may be presented while the study remains active, based on prescribed protocol</td>
              </tr>
            </tbody>
          </table>
        </div>`
}

function eeatBlock() {
  return `        <div class="landing-eeat">
          <div class="landing-eeat__author">
            <h3 class="landing-h3">Author</h3>
            <p class="landing-p"><strong>Steven M. Burns</strong>, President &amp; CEO, Specialized Medical LLC. Mr. Burns leads Specialized Medical&rsquo;s ambulatory cardiac monitoring operations, including LIVE STREAMING workflows, practice implementation and physician-ready reporting support for structural heart and cardiology programs.</p>
          </div>
          <div class="landing-eeat__review">
            <h3 class="landing-h3">Clinical review</h3>
            <p class="landing-p"><strong>Clinically reviewed by:</strong> Pending authorized clinical reviewer. This page will display the reviewing physician&rsquo;s name, credentials and specialty after Specialized Medical completes clinical review and receives authorization to publish the reviewer attribution.</p>
            <p class="landing-p"><strong>Last medically reviewed:</strong> Pending clinical review &middot; <strong>Last updated:</strong> August 2026</p>
          </div>
          <div class="landing-eeat__policy">
            <h3 class="landing-h3">Editorial policy</h3>
            <p class="landing-p">Specialized Medical publishes monitoring-service and technology information for healthcare professionals. Content is reviewed for clinical accuracy before publication. Corrections or questions may be directed to <a href="contact.html">Contact Specialized Medical</a> or 1-855-SPEC-MED (1-855-773-2633). Specialized Medical is a monitoring service and technology provider; it does not replace physician judgment, emergency care or institutional protocols.</p>
          </div>
          <div class="landing-eeat__refs">
            <h3 class="landing-h3">References</h3>
            <ol class="landing-refs">
${TAVR_REFS.map((r) => `              <li id="ref-${r.n}"><a href="${r.href}" target="_blank" rel="noopener noreferrer">${r.label}</a></li>`).join("\n")}
            </ol>
          </div>
        </div>`
}

function calloutBand(title, bodyHtml) {
  return `        <aside class="landing-callout" role="note">
          <p class="landing-callout__title">${title}</p>
          <p class="landing-callout__body">${bodyHtml}</p>
        </aside>`
}

function noteBox(title, html, kind = "info") {
  return `        <div class="landing-note landing-note--${kind}" role="note">
          ${title ? `<p class="landing-note__title">${title}</p>` : ""}
          <p class="landing-note__body">${html}</p>
        </div>`
}

export function emergencyBox() {
  return noteBox(
    "Emergency symptoms",
    "Patients with chest pain, severe shortness of breath, fainting, stroke symptoms, or other urgent symptoms should follow their physician&rsquo;s instructions and seek emergency assistance &mdash; call 911 &mdash; rather than waiting for a monitoring call.",
    "alert"
  )
}

function liveEcgDisclaimer() {
  return noteBox(
    "Live monitoring is not emergency response",
    "Specialized Medical provides diagnostic ambulatory monitoring. The system is not a replacement for emergency medical services. Patients with urgent symptoms should call 911 or follow emergency instructions rather than waiting for a monitoring call.",
    "alert"
  )
}

/* --------------- Required Global Comparison Language + table --------------- */

const COMPARISON_EXPLAINER = `Specialized Medical <strong>LIVE STREAMING</strong> configurations provide <strong>LIVE test-status visibility</strong> while the study is in progress. Specialized Medical can see operational information such as battery level, electrode contact and signal quality, whether the monitor is communicating, and whether the patient appears to remain properly connected. When a parameter falls outside the expected range, Specialized Medical contacts the patient and works with the patient to correct the issue so the study has the best opportunity to be completed successfully. For Holter and Extended / Long-Term Holter LIVE STREAMING studies, clinical results are presented after the final report is generated. For Event Monitoring and Mobile Cardiac Telemetry (MCT), qualifying clinical findings are presented while the test is in progress according to the prescribed notification protocol. Traditional <strong>NOT LIVE STREAMING</strong> Holter configurations do not provide LIVE test-status visibility during the study.`

/** Client-approved comparison rows (LIVE STREAMING vs NOT LIVE STREAMING). */
const COMPARISON_ROWS = [
  {
    slug: "holter-monitoring-services",
    name: "Holter Monitoring (LIVE STREAMING)",
    duration: "24&ndash;48 hours",
    live: "Yes",
    findings: "After Final Report Is Generated",
    linkable: true,
  },
  {
    slug: "long-term-holter-monitoring",
    name: "Extended / Long-Term Holter (LIVE STREAMING)",
    duration: "3&ndash;14 days",
    live: "Yes",
    findings: "After Final Report Is Generated",
    linkable: true,
  },
  {
    slug: "cardiac-event-monitoring",
    name: "Cardiac Event Monitoring (LIVE STREAMING)",
    duration: "Up to 30 days",
    live: "Yes",
    findings: "During Test &mdash; According to Prescribed Notification Protocol",
    linkable: true,
  },
  {
    slug: "mobile-cardiac-telemetry-mct",
    name: "Mobile Cardiac Telemetry (MCT) (LIVE STREAMING)",
    duration: "Up to 30 days",
    live: "Yes",
    findings: "During Test &mdash; According to Prescribed Notification Protocol",
    linkable: true,
  },
  {
    slug: null,
    name: "Holter Monitoring (NOT LIVE STREAMING VERSION)",
    duration: "24&ndash;48 hours",
    live: '<span class="landing-table__no">NO</span>',
    findings: "After Final Report Is Generated",
    linkable: false,
  },
  {
    slug: null,
    name: "Extended Holter (NOT LIVE STREAMING VERSION)",
    duration: "3&ndash;7 days",
    live: '<span class="landing-table__no">NO</span>',
    findings: "After Final Report Is Generated",
    linkable: false,
  },
]

export function comparisonTable(currentSlug, { withExplainer = true } = {}) {
  const rows = COMPARISON_ROWS.map((m) => {
    let name
    if (!m.linkable || !m.slug) {
      name = m.name
    } else if (m.slug === currentSlug) {
      name = `<strong>${m.name}</strong>`
    } else {
      name = `<a href="${m.slug}.html">${m.name}</a>`
    }
    return `            <tr>
              <th scope="row">${name}</th>
              <td>${m.duration}</td>
              <td>${m.live}</td>
              <td>${m.findings}</td>
            </tr>`
  }).join("\n")
  const explainer = withExplainer
    ? `        <div class="landing-compare-block">
          <p class="landing-p landing-p--wide">${COMPARISON_EXPLAINER}</p>
        </div>\n`
    : ""
  return `${explainer}        <div class="landing-table-wrap" role="region" aria-label="Cardiac monitoring service comparison" tabindex="0">
          <table class="landing-table">
            <caption class="sr-only">Comparison of live-streaming and non-live Holter, Event, and MCT monitoring by duration, LIVE test-status visibility, and clinical-findings timing</caption>
            <thead>
              <tr>
                <th scope="col">Monitoring Type</th>
                <th scope="col">Typical Duration</th>
                <th scope="col">LIVE Test-Status Visibility</th>
                <th scope="col">Clinical Findings Presented</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>`
}

const REPORT_IMG = "images/figma-services/report-sample.jpg"
const SPATCH_IMG = "images/figma-services/s-patch.jpg"
const LEADWIRE_IMG = "images/figma-services/lead-wire.jpg"

/** Meta descriptions: PDF field text completed only with the next words from Publication-Ready Opening Copy where the manual uses ellipsis. */
export const PDF_META = {
  "cardiac-monitoring-services":
    "Compare Holter, Extended Holter, Event and Mobile Cardiac Telemetry solutions with LIVE test-status visibility, proactive patient support and physician-ready reporting.",
  "mobile-cardiac-telemetry-mct":
    "Mobile Cardiac Telemetry is an ambulatory ECG monitoring service designed to transmit rhythm data during the prescribed study rather than waiting until the monitor is returned.",
  "holter-monitoring-services":
    "Holter monitoring records the patient\u2019s ECG continuously for a defined short period, commonly 24 to 48 hours. It is often selected when symptoms occur frequently enough that a short recording window may capture the relevant rhythm.",
  "long-term-holter-monitoring":
    "Long-Term Holter monitoring extends continuous ambulatory ECG recording beyond the traditional 24- to 48-hour window. Specialized Medical maintains LIVE test-status visibility throughout the study.",
  "cardiac-event-monitoring":
    "Cardiac event monitoring is designed to capture ECG information associated with intermittent symptoms or automatically detected rhythm events over an extended monitoring period.",
  "ambulatory-cardiac-monitoring":
    "Ambulatory cardiac monitoring records the heart\u2019s electrical activity while the patient continues normal daily life outside the clinic or hospital. The category includes Holter monitoring, extended Holter monitoring, cardiac event monitoring, and mobile cardiac telemetry.",
  "s-patch-cardiac-monitoring-system":
    "The S-Patch cardiac monitoring system is Specialized Medical\u2019s primary wearable platform for ambulatory ECG monitoring. Its compact two-component design is intended to provide a practical alternative to traditional multi-lead systems while supporting several prescribed monitoring services.",
  "live-ecg-monitoring":
    "Live ECG monitoring allows rhythm data to be transmitted from a wearable monitor during the prescribed ambulatory study. In the Specialized Medical workflow, the wearable communicates with a connected smartphone, and the phone transmits ECG information to the monitoring platform when connectivity is available.",
  "post-tavr-cardiac-monitoring":
    "LIVE post-TAVR cardiac monitoring helps physicians identify delayed heart block, atrial fibrillation and other arrhythmias after discharge. Learn how Specialized Medical supports structural heart teams.",
  "cardiology-practice-cardiac-monitoring":
    "Specialized Medical provides cardiology practices with more than a monitor. The service is designed as a complete operational program that supports patient enrollment, device hookup, monitoring, notifications, report delivery, physician review, electronic signature, staff training, and ongoing account support.",
}

/* --------------------------------- pages --------------------------------- */

export const PAGES = [
  /* ------------------- 1. Cardiac Monitoring Services (Blueprint v3) ------------------- */
  {
    id: "cms",
    slug: "cardiac-monitoring-services",
    file: "cardiac-monitoring-services.html",
    title: "Cardiac Monitoring Services | LIVE Streaming ECG | Specialized Medical",
    metaDescription: PDF_META["cardiac-monitoring-services"],
    serviceName: "Cardiac Monitoring Services",
    pill: "Cardiac Monitoring Services",
    h1Html: `Cardiac Monitoring Services Built Around <span class="landing-hero__title-accent">LIVE Visibility</span> and Patient Support`,
    // PART 1 puts opening paragraphs after H1 — no invented hero teaser
    directAnswer: "",
    ctaLabel: "Schedule a Cardiac Monitoring Demonstration",
    interestDefault: "Multiple test types / full program",
    schemaTypes: ["WebPage", "OrganizationMedicalBusiness", "Service", "BreadcrumbList", "FAQPage"],
    emergency: false,
    showRelated: false,
    showSecondaryCta: false,
    showDisclaimer: false,
    body: [
      openingBlock(
        [
          p(
            `Specialized Medical provides a complete range of <a href="ambulatory-cardiac-monitoring.html">ambulatory cardiac monitoring</a> solutions designed to help healthcare organizations obtain dependable ECG data, maintain visibility into active studies and receive clear, physician-ready reporting. Our platform supports Holter Monitoring, Extended and Long-Term Holter Monitoring, Cardiac Event Monitoring and Mobile Cardiac Telemetry (MCT), with flexible device options for a wide range of clinical and patient needs.`
          ),
          p(
            `Unlike monitoring workflows that may not reveal a technical problem until a study has ended, our LIVE STREAMING solutions allow our team to follow key test-status indicators while monitoring is in progress. We can see battery status, electrode quality and contact with the body, device and phone connectivity, cellular communication and whether ECG data is being received. When a parameter falls outside the expected range, our team contacts the patient and works with them to correct the issue before valuable monitoring time is lost.`
          ),
          p(
            `Every monitoring type has a different clinical purpose. The key distinction is not simply whether the device records ECG data. It is whether the study provides LIVE test-status visibility and when clinical findings are presented to the ordering provider.`
          ),
        ].join("\n")
      ),
      sec(
        "cms-better-visibility",
        `Cardiac Monitoring Built for <span class="landing-h2__accent">Better Visibility</span>`,
        [
          p(
            `See how Specialized Medical combines LIVE test-status visibility, proactive patient support and physician-ready reporting.`
          ),
          `        <p class="landing-p"><a class="figma-btn figma-btn--solid" href="#cta-form">Schedule a Cardiac Monitoring Demonstration</a></p>`,
        ].join("\n"),
        { muted: true, introBand: true }
      ),
      sec(
        "cms-live-visibility",
        `LIVE Visibility Helps Protect the Quality of <span class="landing-h2__accent">Every Study</span>`,
        [
          p(
            `A cardiac monitor can only provide useful information when it remains powered, properly attached, connected and successfully transmitting data. Specialized Medical does not treat monitoring as a passive process. For our LIVE STREAMING studies, our team has ongoing visibility into the operational health of the test while it is underway.`
          ),
          p(
            `This visibility helps us identify many technical issues that can reduce the quality or completeness of a study, including a low battery, poor electrode contact, interrupted Bluetooth communication, loss of cellular connection, a monitor that has been removed or a study that is no longer transmitting as expected.`
          ),
          p(
            `When an issue is detected, our team contacts the patient and works with them to correct it. The goal is to restore the study quickly, preserve monitoring time and reduce the likelihood that the physician receives an incomplete or unusable test.`
          ),
          `        <h3 class="landing-h3">Status indicators that may be followed during a LIVE STREAMING study</h3>`,
          liveStatusIndicators(),
        ].join("\n")
      ),
      sec(
        "cms-compare",
        `Choose &amp; Compare Specialized Medical Cardiac Monitoring <span class="landing-h2__accent">Solutions</span>`,
        [
          p(
            `<strong>LIVE Test-Status Visibility</strong> means Specialized Medical can follow the operational condition of a LIVE STREAMING study while it is underway. This includes battery level, electrode contact and quality, monitor-to-phone connection, cellular connectivity and successful data transmission. If a parameter falls out of range, our team can contact the patient and help correct the issue.`
          ),
          p(
            `<strong>Clinical Findings Presented</strong> describes when diagnostic findings are delivered to the ordering provider. For Holter and Extended/Long-Term Holter studies, findings are presented after the final report is generated. For Cardiac Event Monitoring and Mobile Cardiac Telemetry, qualifying findings are presented during the study according to the prescribed notification protocol.`
          ),
          p(
            `The two NOT LIVE STREAMING Holter options are intended for patients who refuse to carry the additional cellular phone. These studies are recorded for later analysis and do not provide LIVE test-status visibility during the wear period.`
          ),
          comparisonTable("cardiac-monitoring-services", { withExplainer: false }),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "cms-partner",
        `One Monitoring Partner. Multiple Clinical <span class="landing-h2__accent">Options.</span>`,
        [
          p(
            `Specialized Medical helps practices select and operate the monitoring workflow that fits the prescribed test, the patient&rsquo;s condition and the desired timing of clinical information.`
          ),
          `        <div class="landing-grid landing-grid--2">
          <article class="landing-card">
            <h3 class="landing-h3"><a href="holter-monitoring-services.html">Holter Monitoring (LIVE STREAMING)</a></h3>
            <p class="landing-p">Holter Monitoring is commonly prescribed for 24 to 48 hours when continuous ECG recording is needed over a defined period. With the Specialized Medical LIVE STREAMING version, our team can see test-status information as the study progresses and assist the patient if the battery, electrodes or connection require attention. Clinical findings are presented after the final report is generated.</p>
            <p class="landing-p"><a href="holter-monitoring-services.html">Learn More About Holter Monitoring</a></p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="long-term-holter-monitoring.html">Extended / Long-Term Holter Monitoring (LIVE STREAMING)</a></h3>
            <p class="landing-p">Extended or Long-Term Holter Monitoring expands continuous ECG recording beyond the traditional Holter period, generally from 3 to 14 days. LIVE test-status visibility helps our team support the patient and protect study quality throughout the longer wear period. Clinical findings are presented after the final report is generated.</p>
            <p class="landing-p"><a href="long-term-holter-monitoring.html">Explore Long-Term Holter Monitoring</a></p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="cardiac-event-monitoring.html">Cardiac Event Monitoring (LIVE STREAMING)</a></h3>
            <p class="landing-p">Cardiac Event Monitoring may be used for intermittent symptoms or rhythm events that may not occur during a shorter study. Qualifying clinical findings can be presented while the test is in progress according to the physician&rsquo;s prescribed notification protocol, while the monitoring team also maintains LIVE operational visibility.</p>
            <p class="landing-p"><a href="cardiac-event-monitoring.html">View Cardiac Event Monitoring</a></p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry - MCT (LIVE STREAMING)</a></h3>
            <p class="landing-p">MCT provides continuous rhythm surveillance with qualifying clinical findings presented during the monitoring period according to the prescribed notification protocol. It is well suited to patients who require closer rhythm oversight, including selected patients following procedures such as TAVR.</p>
            <p class="landing-p"><a href="mobile-cardiac-telemetry-mct.html">Learn About Mobile Cardiac Telemetry</a></p>
          </article>
        </div>`,
          `        <h3 class="landing-h3">Non-LIVE Holter Options</h3>`,
          p(
            `For patients who refuse to carry the additional cellular phone, Specialized Medical also offers a 24-48 hour Holter and a 3-7 day Extended Holter in a NOT LIVE STREAMING configuration. These studies do not provide LIVE test-status visibility, and findings are presented after the final report is generated.`
          ),
          `        <p class="landing-p"><a class="figma-btn figma-btn--outline" href="#cta-form">Ask About Non-LIVE Holter Options</a></p>`,
        ].join("\n")
      ),
      sec(
        "cms-post-tavr",
        `Post-TAVR Monitoring Designed for the Period After <span class="landing-h2__accent">Discharge</span>`,
        [
          p(
            `Patients may leave the hospital before every conduction disturbance becomes apparent. Ambulatory ECG monitoring can help the heart team maintain rhythm surveillance during the post-discharge period, when delayed high-grade atrioventricular block and other rhythm changes may occur in selected patients.`
          ),
          p(
            `Specialized Medical is especially well suited to post-TAVR monitoring because our LIVE STREAMING workflow combines continuous ECG transmission, multi-carrier cellular connectivity, LIVE test-status visibility and active patient support. The heart team receives a monitoring solution designed to remain connected while the patient returns home, rather than a passive recorder that may not reveal technical problems until the study is over.`
          ),
          `        <h3 class="landing-h3">Why Specialized Medical is a strong post-TAVR monitoring partner</h3>`,
          `        <ul class="landing-list">
          <li><a href="live-ecg-monitoring.html">LIVE ECG transmission</a> throughout the prescribed monitoring period</li>
          <li>Qualifying clinical findings presented during MCT according to the prescribed notification protocol</li>
          <li>Visibility into battery, electrodes, connectivity and successful data transmission</li>
          <li>Proactive contact with the patient when a technical issue is identified</li>
          <li>Multi-carrier cellular connectivity using Verizon, T-Mobile and AT&amp;T</li>
          <li>Single-wire, two-electrode <a href="s-patch-cardiac-monitoring-system.html">S-Patch</a> configuration designed for patient mobility and repositioning</li>
          <li>Physician-ready reporting and electronic signature workflow</li>
          <li>A dedicated monitoring process that can be aligned with the heart team&rsquo;s post-TAVR protocol</li>
        </ul>`,
          postTavrTimeline(),
          noteBox(
            "Building or Expanding a Post-TAVR Monitoring Program?",
            "Learn how Specialized Medical can support post-discharge rhythm surveillance with LIVE ECG transmission, multi-carrier connectivity, proactive patient support and a workflow designed around the heart team&rsquo;s protocol."
          ),
          `        <p class="landing-p"><a class="figma-btn figma-btn--solid" href="post-tavr-cardiac-monitoring.html">Explore delayed heart-block monitoring after TAVR</a></p>`,
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "cms-workflow",
        `A Monitoring Workflow Built for Patients, Staff and <span class="landing-h2__accent">Physicians</span>`,
        [
          flow(
            [
              {
                t: "Order and pre-enroll",
                d: "The practice selects the prescribed test and may pre-enroll the patient days, weeks or months before hookup.",
              },
              {
                t: "Apply and connect",
                d: "Staff applies the monitor, assigns the cellular phone when using a LIVE STREAMING option and confirms the connection.",
              },
              {
                t: "Verify LIVE status",
                d: "Specialized Medical confirms that the monitor, phone, network and ECG transmission are functioning.",
              },
              {
                t: "Support the patient",
                d: "If battery, electrode quality, connectivity or transmission falls out of range, our team contacts the patient and works with them to correct the issue.",
              },
              {
                t: "Review and present findings",
                d: "Holter findings are presented after the final report is generated. Event and MCT qualifying findings are presented during the study according to the prescribed notification protocol.",
              },
              {
                t: "Deliver the final report",
                d: "The physician receives a clear final report and can complete the electronic signature workflow.",
              },
            ],
            "Six-step Specialized Medical monitoring workflow"
          ),
        ].join("\n")
      ),
      sec(
        "cms-networks",
        `Stay Connected Across Multiple <span class="landing-h2__accent">Cellular Networks</span>`,
        [
          p(
            `A monitoring system is only useful when it can remain connected in the patient&rsquo;s real environment. Specialized Medical uses a cellular phone gateway designed to connect through Verizon, T-Mobile and AT&amp;T, helping the system maintain service across a broad range of locations, including many rural areas where relying on a single carrier may be limiting.`
          ),
          p(
            `The monitor communicates with the assigned phone by Bluetooth, and the phone transmits ECG data through the available cellular network. When connectivity is interrupted, the system is designed to reconnect automatically when service becomes available. LIVE test-status visibility allows our team to recognize when communication has been interrupted and assist the patient when necessary.`
          ),
          cmsNetworkPathDiagram(),
        ].join("\n")
      ),
      secSplit(
        "cms-patient-phone",
        `A Patient Phone Simplified for <span class="landing-h2__accent">Cardiac Monitoring</span>`,
        [
          p(
            `The assigned cellular phone is configured as a dedicated cardiac monitoring device, not as a general-purpose smartphone. It is locked down to only two essential patient screens: Device Status and Log Symptoms. This simplified design helps patients remain connected without having to navigate apps, messages, settings or other smartphone functions.`
          ),
          p(
            `The Device Status screen gives the patient a simple view of the monitoring connection. The Log Symptoms screen allows the patient to record symptoms during the study so the physician can compare the reported symptom time with the transmitted ECG data. If the assigned phone is misplaced, Specialized Medical can help locate it using geolocation and can remotely activate an audible ring to make it easier for the patient to find, provided the phone is powered on and connected.`
          ),
          `        <ul class="landing-list">
          <li>Dedicated exclusively to the prescribed cardiac monitoring study</li>
          <li>Only two patient-facing screens: Device Status and Log Symptoms</li>
          <li>No web browsing, email, social media, games or unnecessary applications</li>
          <li>No complex menus or settings for the patient to manage</li>
          <li>Preconfigured and ready for the monitoring study</li>
          <li>Automatic Bluetooth communication with the cardiac monitor</li>
          <li>Automatic ECG transmission through the available cellular network</li>
          <li>Simple symptom logging during the prescribed monitoring period</li>
          <li>Remote geolocation and audible ring assistance if the assigned phone is misplaced</li>
          <li>LIVE visibility that allows Specialized Medical to identify communication interruptions and assist the patient when needed</li>
        </ul>`,
        ].join("\n"),
        patientPhoneScreensDiagram(),
        { muted: true }
      ),
      secSplit(
        "cms-spatch",
        `A Simple Two-Electrode Monitoring <span class="landing-h2__accent">Configuration</span>`,
        [
          p(
            `The S-Patch uses a single wire with two electrodes, allowing the electrode positions to be changed on the skin as directed. This can help reduce repeated stress on the same skin location while maintaining strong P-wave clarity and reliable ECG acquisition. The compact configuration is designed to support everyday movement while the patient remains connected to the assigned phone.`
          ),
        ].join("\n"),
        figureImg(
          SPATCH_IMG,
          "Specialized Medical S-Patch single-wire two-electrode wearable cardiac monitor",
          ""
        )
      ),
      sec(
        "cms-practice",
        `Designed to Fit the Cardiology Practice <span class="landing-h2__accent">Workflow</span>`,
        [
          p(
            `Specialized Medical provides more than a monitor. The service is designed to support the complete <a href="cardiology-practice-cardiac-monitoring.html">practice</a> workflow, including patient enrollment, pre-enrollment, device hookup, technical support, physician-ready reporting, electronic signature and billing-support information. The goal is to make monitoring easier for the practice while keeping the physician in control of the prescribed test and notification parameters.`
          ),
          `        <ul class="landing-list">
          <li>Pre-enroll patients before the appointment</li>
          <li>Complete hookup, enrollment and disconnection through a streamlined workflow</li>
          <li>Use billing templates and supporting information designed for the practice&rsquo;s billing team</li>
          <li>Receive physician-ready reports</li>
          <li>Complete electronic signatures from the portal</li>
          <li>Access monitoring options from a single service partner</li>
        </ul>`,
        ].join("\n"),
        { muted: true }
      ),
      secSplit(
        "cms-reporting",
        `Clear Reporting for the Ordering <span class="landing-h2__accent">Physician</span>`,
        [
          p(
            `The final report should help the physician review the study efficiently. Specialized Medical provides physician-ready reporting designed to summarize the monitoring period while preserving the supporting ECG information needed for clinical review. Report availability and the timing of clinical findings depend on the prescribed monitoring type.`
          ),
          `        <ul class="landing-list">
          <li>Holter and Extended/Long-Term Holter: findings are presented after the final report is generated.</li>
          <li>Event Monitoring and MCT: qualifying clinical findings are presented during the study according to the prescribed notification protocol, followed by the final report.</li>
          <li>Electronic signature workflow allows the physician to complete and return the signed report through the portal.</li>
        </ul>`,
        ].join("\n"),
        figureImg(
          REPORT_IMG,
          "De-identified physician-ready cardiac monitoring report with electronic signature workflow",
          ""
        )
      ),
      sec(
        "cms-demo-band",
        `See How Specialized Medical Can Improve Your Monitoring <span class="landing-h2__accent">Workflow</span>`,
        [
          p(
            `Schedule a demonstration to see the S-Patch, LIVE test-status visibility, patient-support workflow, clinical notification process and physician reporting platform.`
          ),
          `        <p class="landing-p"><a class="figma-btn figma-btn--solid" href="#cta-form">Schedule a Demonstration</a></p>`,
        ].join("\n"),
        { muted: true }
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What types of cardiac monitoring does Specialized Medical offer?",
        a: `Specialized Medical offers Holter Monitoring, Extended and Long-Term Holter Monitoring, Cardiac Event Monitoring and Mobile Cardiac Telemetry. LIVE STREAMING and selected NOT LIVE STREAMING Holter configurations are available.`,
      },
      {
        q: "Are all Specialized Medical tests LIVE STREAMING?",
        a: `The four primary options shown in the comparison table are LIVE STREAMING. Specialized Medical also offers two NOT LIVE STREAMING Holter options for patients who refuse to carry the additional cellular phone.`,
      },
      {
        q: "What does LIVE test-status visibility mean?",
        a: `It means Specialized Medical can follow operational indicators such as battery status, electrode contact and quality, Bluetooth connection, cellular connectivity and successful ECG data transmission while the study is underway.`,
      },
      {
        q: "What happens if an electrode loses contact?",
        a: `When the system indicates that electrode quality or contact has fallen out of the expected range, Specialized Medical can contact the patient and help them correct the issue.`,
      },
      {
        q: "Can Specialized Medical tell whether the patient is connected?",
        a: `For LIVE STREAMING tests, the team can see whether the monitor and phone are communicating and whether ECG data is being received, helping identify when the patient may no longer be properly connected.`,
      },
      {
        q: "When are Holter findings presented?",
        a: `For Holter and Extended/Long-Term Holter studies, clinical findings are presented after the final report is generated.`,
      },
      {
        q: "When are Event and MCT findings presented?",
        a: `Qualifying findings from Cardiac Event Monitoring and MCT are presented while the test is in progress according to the physician&rsquo;s prescribed notification protocol.`,
      },
      {
        q: "Why would a patient use a NOT LIVE STREAMING Holter?",
        a: `This option is available when a patient refuses to carry the additional cellular phone. It records ECG data for later analysis but does not provide LIVE test-status visibility during the wear period.`,
      },
      {
        q: "How does the monitor transmit ECG data?",
        a: `The monitor communicates with the assigned phone by Bluetooth. The phone then transmits ECG data through available cellular service. The phone is locked down to two essential patient screens - Device Status and Log Symptoms - to reduce complexity and help the patient remain connected.`,
      },
      {
        q: "How does the patient record symptoms?",
        a: `The patient uses the dedicated Log Symptoms screen on the assigned phone. The simplified interface allows the patient to document symptoms during the study without navigating unrelated smartphone functions. The reported symptom time can then be compared with the transmitted ECG data.`,
      },
      {
        q: "What happens if the assigned phone is misplaced?",
        a: `Specialized Medical can help locate the assigned phone using geolocation and can remotely activate an audible ring to make the phone easier to find, provided it is powered on and connected. This added support helps reduce disruption to the monitoring study.`,
      },
      {
        q: "Which cellular networks are used?",
        a: `The Specialized Medical connectivity approach uses Verizon, T-Mobile and AT&amp;T to help maintain service across a broad range of locations.`,
      },
      {
        q: "Can patients be pre-enrolled?",
        a: `Yes. Practices may pre-enroll patients in advance so the final enrollment and hookup process is faster when the patient arrives.`,
      },
      {
        q: "Does Specialized Medical support post-TAVR monitoring?",
        a: `Yes. Specialized Medical provides LIVE STREAMING monitoring options that can support post-discharge rhythm surveillance when prescribed by the treating heart team.`,
      },
      {
        q: "How long should a patient be monitored after TAVR?",
        a: `The treating heart team determines the appropriate patient selection, test type and monitoring duration based on the patient&rsquo;s clinical status and the program&rsquo;s protocol.`,
      },
      {
        q: "Does Specialized Medical replace the physician&rsquo;s clinical judgment?",
        a: `No. Specialized Medical provides monitoring technology, review workflows and communication support. Clinical decisions remain with the treating physician and healthcare organization.`,
      },
      {
        q: "How are final reports signed?",
        a: `Physicians can review and complete the electronic signature workflow through the Specialized Medical portal.`,
      },
    ],
    links: [],
  },

  /* --------------------- 2. Mobile Cardiac Telemetry --------------------- */
  {
    id: "mct",
    slug: "mobile-cardiac-telemetry-mct",
    file: "mobile-cardiac-telemetry-mct.html",
    title: "Mobile Cardiac Telemetry (MCT) | Specialized Medical",
    metaDescription: PDF_META["mobile-cardiac-telemetry-mct"],
    serviceName: "Mobile Cardiac Telemetry (MCT)",
    pill: "Mobile Cardiac Telemetry",
    h1Html: `Mobile Cardiac Telemetry <span class="landing-hero__title-accent">(MCT)</span>`,
    directAnswer:
      "Mobile Cardiac Telemetry is an ambulatory ECG monitoring service designed to transmit rhythm data during the prescribed study rather than waiting until the monitor is returned. Specialized Medical’s MCT workflow uses a wearable monitor and connected smartphone to send ECG information to the monitoring platform. Rhythm events are reviewed and communicated according to the ordering physician’s notification protocol.",
    ctaLabel: "Request an MCT Workflow Demonstration",
    interestDefault: "Mobile Cardiac Telemetry (MCT)",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      sec(
        "mct-what",
        `What Is Mobile <span class="landing-h2__accent">Cardiac Telemetry?</span>`,
        [
          p(
            `Mobile Cardiac Telemetry, commonly called MCT, is used when a physician wants an extended period of ambulatory rhythm monitoring with live remote data transmission. The patient wears the prescribed monitor during normal daily activities while the system sends ECG data through the connected phone. The monitoring service reviews incoming information and follows the physician-defined notification process for qualifying events.`
          ),
          p(
            `MCT should be described accurately as a diagnostic monitoring service. It is not an emergency response system and it does not replace instructions to call 911 or seek emergency care when a patient experiences urgent symptoms.`
          ),
        ].join("\n")
      ),
      sec(
        "mct-how",
        `How the Specialized Medical <span class="landing-h2__accent">MCT System Works</span>`,
        [
          p(
            `Wearable monitor to smartphone by Bluetooth, then smartphone to the monitoring platform through available cellular or network connectivity. The phone should remain near the patient and powered during the study. The system is designed to reconnect when temporary interruptions occur, but successful transmission still depends on device placement, phone status, network availability, and patient adherence.`
          ),
          flow(
            [
              { t: "Wearable monitor", d: "ECG acquired on the body" },
              { t: "Bluetooth", d: "Monitor connects to the provided smartphone" },
              { t: "Cellular / network", d: "Phone transmits ECG data to the monitoring platform" },
              { t: "Monitoring platform", d: "Data reviewed; qualifying events communicated per protocol" },
            ],
            "Wearable to phone to cloud transmission path"
          ),
          p(
            `Every Specialized Medical test has LIVE operational visibility, including battery status, electrode contact / signal quality, device communication, and whether the patient appears connected. The MCT distinction is that qualifying clinical findings are also presented during the study according to the prescribed notification protocol. Do not imply that every beat is manually watched continuously by one person.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "mct-who",
        `Who May Be <span class="landing-h2__accent">Considered for MCT?</span>`,
        [
          p(
            `MCT may be considered when the ordering physician wants a longer monitoring period and live remote rhythm surveillance. Examples may include intermittent palpitations, dizziness, syncope or near-syncope evaluation, suspected paroxysmal arrhythmias, post-procedure monitoring, or other indications determined by the treating provider.`
          ),
          p(
            `Do not promise that MCT will detect every arrhythmia or prevent adverse outcomes. State that diagnostic yield depends on the patient&rsquo;s rhythm, recording quality, study duration, adherence, and other clinical factors.`
          ),
        ].join("\n")
      ),
      secSplit(
        "mct-notify",
        `Physician Notification <span class="landing-h2__accent">and Reporting</span>`,
        p(
          `Notifications follow the physician&rsquo;s defined protocol and the practice&rsquo;s communication preferences. An interim notification communicates a qualifying finding while the study is in progress; the final diagnostic report organizes the monitoring findings for physician interpretation and clinical decision-making.`
        ),
        figureImg(
          REPORT_IMG,
          "De-identified MCT report sample showing event summary, rhythm strips, and physician interpretation area",
          "De-identified MCT report layout: event summary, rhythm strips, and physician interpretation area. Electronic review and signature are supported in the portal."
        ),
        { muted: true }
      ),
      sec(
        "mct-compare",
        `MCT Compared With <span class="landing-h2__accent">Event and Holter Monitoring</span>`,
        [
          comparisonTable("mobile-cardiac-telemetry-mct"),
          p(
            `MCT is not automatically the best test for every patient. A short <a href="holter-monitoring-services.html">Holter study</a> may be appropriate when symptoms are frequent. <a href="long-term-holter-monitoring.html">Long-Term Holter</a> may be appropriate when extended full-disclosure recording is desired and clinical results can be presented after the final report. <a href="cardiac-event-monitoring.html">Event Monitoring</a> may be appropriate when episodic capture and in-progress presentation of qualifying findings are desired.`
          ),
        ].join("\n")
      ),
      sec(
        "mct-patient",
        `Patient Responsibilities <span class="landing-h2__accent">During an MCT Study</span>`,
        [
          `        <ul class="landing-list">
          <li>Keep the phone charged, powered on, and near the body</li>
          <li>Follow the device placement instructions</li>
          <li>Record symptoms when directed</li>
          <li>Avoid changing settings on the monitor or phone</li>
          <li>Contact support when the system indicates a problem</li>
        </ul>`,
          p(
            `Follow the bathing instructions that match the prescribed equipment. The system should not be treated as waterproof unless the exact configuration is verified for that use.`
          ),
          noteBox(
            "Phone proximity and charging",
            "The connected phone is the transmission gateway. Keep it powered, charged, and within the operating range stated in the patient instructions &mdash; walls, distance, device placement, and interference can affect the connection."
          ),
          phoneProximityDiagram(),
          emergencyBox(),
        ].join("\n"),
        { muted: true }
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What is the difference between MCT and a Holter monitor?",
        a: `Both MCT and Holter provide LIVE operational visibility during the study so Specialized Medical can monitor battery status, electrode contact / signal quality, device communication, and whether the patient appears connected. MCT can present qualifying clinical findings while the study is in progress according to protocol. Holter clinical results are presented after the final report is generated.`,
      },
      {
        q: "How long is MCT worn?",
        a: `The ordering physician determines the prescribed duration, which may extend up to 30 days depending on the clinical need and program configuration.`,
      },
      {
        q: "Does the patient need to carry a phone?",
        a: `Yes. In the Specialized Medical workflow, the connected phone serves as the gateway that transmits ECG information to the monitoring platform.`,
      },
      {
        q: "How close must the phone remain to the monitor?",
        a: `The phone should remain near the patient and within the operating range specified in the patient instructions. Walls, distance, device placement, and interference can affect the connection.`,
      },
      {
        q: "Will the physician be called for every rhythm change?",
        a: `No. Notifications are made according to the prescribed criteria and practice protocol, not for every normal variation or automatically detected event.`,
      },
      {
        q: "Is MCT an emergency service?",
        a: `No. MCT is a diagnostic monitoring service and is not a substitute for calling 911 or seeking emergency care.`,
      },
      {
        q: "Can MCT be used after a cardiac procedure?",
        a: `A physician may prescribe MCT after a procedure when ongoing rhythm surveillance is clinically appropriate, including selected <a href="post-tavr-cardiac-monitoring.html">post-TAVR monitoring</a> pathways.`,
      },
      {
        q: "What happens if the phone loses cellular service?",
        a: `The system is designed to reconnect and transmit when service becomes available, but the exact result depends on the device, phone status, stored data, and network conditions.`,
      },
      {
        q: "Can patients shower while wearing the monitor?",
        a: `Patients must follow the bathing instructions provided for the specific monitor and electrode configuration.`,
      },
      {
        q: "What is included in the final MCT report?",
        a: `The report may include rhythm summaries, event information, representative ECG strips, burden measurements where applicable, and a physician interpretation area.`,
      },
    ],
    links: [
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
      { href: "cardiac-event-monitoring.html", label: "Cardiac Event Monitoring" },
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "post-tavr-cardiac-monitoring.html", label: "LIVE post-TAVR Mobile Cardiac Telemetry" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
    ],
  },

  /* ----------------------- 3. Holter Monitoring ----------------------- */
  {
    id: "holter",
    slug: "holter-monitoring-services",
    file: "holter-monitoring-services.html",
    title: "Holter Monitoring Services | Specialized Medical",
    metaDescription: PDF_META["holter-monitoring-services"],
    serviceName: "Holter Monitoring Services",
    pill: "Holter Monitoring",
    h1Html: `Holter Monitoring <span class="landing-hero__title-accent">Services</span>`,
    directAnswer:
      "Holter monitoring records the patient’s ECG continuously for a defined short period, commonly 24 to 48 hours. It is often selected when symptoms occur frequently enough that a short recording window may capture the relevant rhythm. Specialized Medical supports the practice from enrollment and hookup through recording, data review, final report generation, and physician review.",
    ctaLabel: "Request Holter Monitoring Information",
    interestDefault: "Holter Monitoring",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      sec(
        "holter-what",
        `What Is <span class="landing-h2__accent">Holter Monitoring?</span>`,
        [
          p(
            `A Holter monitor is a wearable ambulatory ECG recorder used during normal daily activity. Specialized Medical maintains LIVE test-status visibility throughout the study, including battery level, electrode contact / signal quality, device communication, and whether the patient appears connected. If a parameter falls outside the expected range, Specialized Medical contacts the patient and works with the patient to correct the issue. Unlike <a href="mobile-cardiac-telemetry-mct.html">MCT</a> and <a href="cardiac-event-monitoring.html">Event Monitoring</a>, Holter clinical findings are presented after the final report is generated rather than while the study is in progress.`
          ),
          noteBox(
            "Two points to remember",
            "(1) LIVE test-status visibility is maintained while the Holter study is in progress, and (2) clinical results are presented after the final report is generated."
          ),
        ].join("\n")
      ),
      sec(
        "holter-when",
        `When a Holter Study <span class="landing-h2__accent">May Be Ordered</span>`,
        [
          p(
            `Non-prescriptive examples include frequent palpitations, dizziness, suspected ectopy, rhythm correlation with symptoms, rate assessment, or follow-up when a short recording period is clinically appropriate. The ordering provider determines the appropriate modality and duration &mdash; patients should not choose the test themselves.`
          ),
          p(
            `A Holter may be less likely to capture infrequent symptoms. In those cases, the physician may consider a longer monitoring option such as <a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a>.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "holter-expect",
        `What the Patient <span class="landing-h2__accent">Should Expect</span>`,
        [
          flow(
            [
              { t: "Enrollment", d: "Confirmed in the office, or pre-enrolled in advance" },
              { t: "Skin preparation", d: "Site prepared for reliable electrode contact" },
              { t: "Device placement", d: "Patch or lead-wire configuration applied per instructions" },
              { t: "Recording", d: "Normal activity with symptom documentation and bathing restrictions" },
              { t: "Return / disconnect", d: "Device returned or disconnected in the office" },
            ],
            "Patient hookup and study sequence"
          ),
          p(
            `Separate instructions apply for patch and lead-wire configurations where necessary. Patients should not attach the monitor incorrectly, should not power off the connected equipment unless instructed, and should contact support if the monitor becomes detached or the device indicates a problem.`
          ),
          `        <div class="landing-media-pair">
${figureImg(SPATCH_IMG, "S-Patch wearable patch Holter monitor used for short-duration ambulatory ECG studies", "Patch configuration &mdash; S-Patch.")}
${figureImg(LEADWIRE_IMG, "Lead-wire Holter monitor configuration with electrodes and leads", "Lead-wire configuration.")}
        </div>`,
          emergencyBox(),
        ].join("\n")
      ),
      secSplit(
        "holter-report",
        `Holter Analysis and <span class="landing-h2__accent">Final Reporting</span>`,
        [
          p(
            `The ECG recording is processed after the study is complete. The final report may include rhythm overview, heart-rate information, ectopy, pauses, arrhythmia episodes, symptom correlation, representative strips, and other measurements supported by the study and reporting configuration.`
          ),
          p(
            `No specific finding or diagnosis is promised. The physician reviews the report in the context of the patient&rsquo;s history, symptoms, examination, and other testing.`
          ),
        ].join("\n"),
        figureImg(
          REPORT_IMG,
          "De-identified Holter final report sample showing rhythm overview and representative ECG strips",
          "De-identified final report sample."
        ),
        { muted: true }
      ),
      sec(
        "holter-compare",
        `Holter Versus <span class="landing-h2__accent">Extended Holter and MCT</span>`,
        [
          comparisonTable("holter-monitoring-services"),
          p(
            `Holter is generally best suited to a short period when symptoms are frequent. For a full-program view, see <a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a>.`
          ),
          p(
            `Extended Holter provides a longer recording window. Read more about <a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a>.`
          ),
          p(
            `Event Monitoring and MCT can present qualifying findings during the study according to protocol. Read more about <a href="cardiac-event-monitoring.html">Cardiac Event Monitoring</a> and <a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry (MCT)</a>.`
          ),
        ].join("\n")
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "How long is a Holter monitor worn?",
        a: `The prescribed period is commonly 24 to 48 hours, but the ordering physician determines the exact duration.`,
      },
      {
        q: "Does a Holter monitor send live alerts?",
        a: `Yes, Specialized Medical has LIVE operational visibility during the Holter study, including battery status, electrode contact / signal quality, device communication, and whether the patient appears connected. However, Holter clinical results are presented after the final report is generated.`,
      },
      {
        q: "Can a Holter monitor record every heartbeat?",
        a: `A Holter study is designed to record continuous ECG data during the prescribed period, subject to signal quality, electrode contact, device operation, and patient adherence.`,
      },
      {
        q: "Can I exercise while wearing a Holter monitor?",
        a: `Patients should follow the activity instructions provided by the ordering practice and Specialized Medical.`,
      },
      {
        q: "Can I shower with the monitor?",
        a: `Follow the device-specific bathing instructions. Some components must be removed or protected before bathing.`,
      },
      {
        q: "What should I do if an electrode comes loose?",
        a: `Follow the replacement instructions provided with the study or contact the support number supplied by the practice.`,
      },
      {
        q: "How quickly is the report available?",
        a: `Report timing depends on data availability, study completion, and the service workflow. Practice-specific expected turnaround is confirmed with the practice before it is published.`,
      },
      {
        q: "Who interprets the Holter report?",
        a: `The ordering physician or other qualified treating provider is responsible for clinical interpretation and treatment decisions.`,
      },
      {
        q: "What if my symptoms do not occur during the study?",
        a: `The physician may determine that a longer monitoring period or a different test is appropriate.`,
      },
      {
        q: "Is Holter monitoring painful?",
        a: `The recording itself is noninvasive, although some patients may experience temporary skin irritation from adhesive electrodes.`,
      },
    ],
    links: [
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "cardiac-event-monitoring.html", label: "Cardiac Event Monitoring" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
    ],
  },

  /* -------------------- 4. Long-Term Holter Monitoring -------------------- */
  {
    id: "lth",
    slug: "long-term-holter-monitoring",
    file: "long-term-holter-monitoring.html",
    title: "Long-Term Holter Monitoring | Specialized Medical",
    metaDescription: PDF_META["long-term-holter-monitoring"],
    serviceName: "Long-Term Holter Monitoring",
    pill: "Long-Term Holter Monitoring",
    h1Html: `Long-Term <span class="landing-hero__title-accent">Holter Monitoring</span>`,
    directAnswer:
      "Long-Term Holter monitoring extends continuous ambulatory ECG recording beyond the traditional 24- to 48-hour window. Specialized Medical maintains LIVE test-status visibility throughout the study, including battery level, electrode contact / signal quality, device communication, and whether the patient appears connected. If a parameter falls outside the expected range, Specialized Medical contacts the patient and works with the patient to correct the issue. Clinical results are presented after the final report is generated.",
    ctaLabel: "Request Long-Term Holter Program Details",
    interestDefault: "Long-Term Holter Monitoring",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      sec(
        "lth-why",
        `Why Extend the Holter <span class="landing-h2__accent">Recording Period?</span>`,
        [
          p(
            `Intermittent symptoms may not occur during a short 24- or 48-hour study. A longer recording window can give the physician more ECG information and a greater opportunity to correlate symptoms with rhythm findings. The ordering provider determines whether a longer Holter study, an <a href="cardiac-event-monitoring.html">event monitor</a>, or <a href="mobile-cardiac-telemetry-mct.html">MCT</a> is most appropriate.`
          ),
          p(
            `&ldquo;Long-term&rdquo; and &ldquo;extended&rdquo; Holter refer to the same idea: continuous ambulatory ECG recording carried out over a longer prescribed window, commonly 3 to 14 days.`
          ),
        ].join("\n")
      ),
      secSplit(
        "lth-fulldisclosure",
        `Full-Disclosure <span class="landing-h2__accent">ECG Recording</span>`,
        p(
          `Full-disclosure reporting refers to the availability of the recorded ECG data for analysis across the prescribed study, subject to device operation, electrode contact, data quality, and patient adherence. Not every second is clinically interpretable if artifact or signal loss is present.`
        ),
        figureImg(
          REPORT_IMG,
          "De-identified full-disclosure Long-Term Holter report sample",
          "Full-disclosure report (de-identified sample)."
        ),
        {
          muted: true,
          after: flow(
            [
              { t: "Study start", d: "Enrollment and hookup" },
              { t: "Multi-day recording", d: "Continuous ECG with LIVE test-status visibility" },
              { t: "Symptom entries", d: "Patient documents symptoms as instructed" },
              { t: "Return / reconnect", d: "Device returned per the selected workflow" },
              { t: "Data processing", d: "Recording analyzed after study completion" },
              { t: "Final report", d: "Generated and delivered for physician review" },
            ],
            "Multi-day Long-Term Holter recording timeline"
          ),
        }
      ),
      sec(
        "lth-timing",
        `Physician <span class="landing-h2__accent">Notification Timing</span>`,
        [
          noteBox(
            "Notification timing",
            "Specialized Medical maintains LIVE test-status visibility throughout a Long-Term Holter study so battery level, electrode contact / signal quality, device communication, and patient connection can be monitored and corrected when needed. Clinical results are presented after the final report is generated."
          ),
          p(
            `This service is not real-time clinical monitoring, continuous human observation, or immediate emergency notification.`
          ),
        ].join("\n")
      ),
      sec(
        "lth-patient",
        `Patient Experience During a <span class="landing-h2__accent">Multi-Day Study</span>`,
        [
          p(
            `Longer studies create additional adherence challenges, so instructions are practical and specific: skin preparation, electrode rotation when instructed, adhesive sensitivity options, charging or battery procedures if applicable, symptom documentation, bathing restrictions, and support contact information.`
          ),
          noteBox(
            "Electrode placement and rotation",
            "Follow the electrode placement and rotation instructions provided for the specific monitor. If adhesive causes significant irritation, contact the practice or support team before continuing use."
          ),
          electrodeCareSteps(),
          `        <ul class="landing-list">
          <li><strong>Loose electrode:</strong> follow the replacement instructions provided with the study or contact support</li>
          <li><strong>Temporary signal loss:</strong> the system is designed to resume recording; contact support if the device indicates a problem</li>
          <li><strong>Skin irritation:</strong> contact the practice or support team for guidance; sensitive-skin options may be available</li>
          <li><strong>Uncertainty about device status:</strong> contact the support number supplied with the study</li>
        </ul>`,
          emergencyBox(),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "lth-compare",
        `Long-Term Holter <span class="landing-h2__accent">Compared With MCT</span>`,
        [
          p(
            `Long-Term Holter and MCT both provide LIVE operational visibility while the study is in progress. Long-Term Holter provides an extended recording window with clinical results presented after the final report. MCT presents qualifying clinical findings during the study according to the prescribed notification protocol. Neither modality is universally superior &mdash; the ordering physician selects based on the clinical question. Compare <a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry (MCT)</a> and <a href="holter-monitoring-services.html">Holter Monitoring</a>.`
          ),
          comparisonTable("long-term-holter-monitoring"),
        ].join("\n")
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What is Long-Term Holter monitoring?",
        a: `It is continuous ambulatory ECG recording performed for a longer period than a traditional 24- or 48-hour Holter study.`,
      },
      {
        q: "Does Long-Term Holter provide live alerts?",
        a: `No. The study is reviewed after completion, and the physician is alerted after final reports are generated.`,
      },
      {
        q: "How long can the monitor be worn?",
        a: `The prescribed duration depends on the physician&rsquo;s order and the monitoring configuration, commonly several days and potentially up to 14 days.`,
      },
      {
        q: "Why would a physician choose a longer Holter study?",
        a: `A longer recording period may be useful when symptoms are intermittent and may not occur during a short Holter study.`,
      },
      {
        q: "Is Long-Term Holter the same as MCT?",
        a: `No. Both provide LIVE operational visibility during the study. Long-Term Holter clinical results are presented after the final report is generated, while MCT can present qualifying clinical findings during the study according to the prescribed notification protocol.`,
      },
      {
        q: "What is full disclosure?",
        a: `Full disclosure refers to the availability of recorded ECG data across the prescribed study for analysis, subject to recording quality and system operation.`,
      },
      {
        q: "Can adhesive locations be changed?",
        a: `Patients should follow the electrode placement and rotation instructions provided for their specific monitor.`,
      },
      {
        q: "What should a patient do if skin becomes irritated?",
        a: `The patient should contact the practice or support team for instructions and should not continue using an adhesive that causes significant irritation without guidance.`,
      },
      {
        q: "How are symptoms recorded?",
        a: `Patients may use the symptom feature or diary provided with their monitoring instructions.`,
      },
      {
        q: "When does the physician receive the report?",
        a: `The report is generated after the study data are returned or made available and processed through the reporting workflow.`,
      },
    ],
    links: [
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "cardiac-event-monitoring.html", label: "Cardiac Event Monitoring" },
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
    ],
  },

  /* ---------------------- 5. Cardiac Event Monitoring ---------------------- */
  {
    id: "event",
    slug: "cardiac-event-monitoring",
    file: "cardiac-event-monitoring.html",
    title: "Cardiac Event Monitoring | Specialized Medical",
    metaDescription: PDF_META["cardiac-event-monitoring"],
    serviceName: "Cardiac Event Monitoring",
    pill: "Cardiac Event Monitoring",
    h1Html: `Cardiac <span class="landing-hero__title-accent">Event Monitoring</span>`,
    directAnswer:
      "Cardiac event monitoring is designed to capture ECG information associated with intermittent symptoms or automatically detected rhythm events over an extended monitoring period. Depending on the prescribed configuration, an event may be initiated by the patient, detected by the device, or both. The resulting ECG information supports physician evaluation of symptoms that may not occur during a short Holter study.",
    ctaLabel: "Request Event Monitoring Information",
    interestDefault: "Cardiac Event Monitoring",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      sec(
        "event-how",
        `How Event <span class="landing-h2__accent">Monitoring Works</span>`,
        [
          p(
            `Event monitoring configurations may use continuous recording, loop memory, patient-triggered events, automatically detected events, or a combination. The exact behavior depends on the prescribed device and service setup &mdash; not every feature is enabled in every configuration.`
          ),
          flow(
            [
              { t: "Symptom occurs", d: "Patient notices palpitations, dizziness, or other symptoms" },
              { t: "Event marked", d: "Patient marks the event when instructed" },
              { t: "ECG captured", d: "Segment is stored or transmitted" },
              { t: "Event reviewed", d: "Reviewed within the monitoring workflow" },
              { t: "Report / notification", d: "Follows the prescribed workflow" },
            ],
            "Symptom-to-event capture workflow"
          ),
        ].join("\n")
      ),
      sec(
        "event-when",
        `When Event Monitoring <span class="landing-h2__accent">May Be Considered</span>`,
        [
          p(
            `Examples may include intermittent palpitations, dizziness, brief symptoms, or suspected rhythm events that are not expected every day. The physician determines whether event monitoring, <a href="long-term-holter-monitoring.html">Long-Term Holter</a>, or <a href="mobile-cardiac-telemetry-mct.html">MCT</a> is the appropriate test.`
          ),
          p(
            `Event monitoring depends in part on correct device use and timely symptom marking when patient activation is part of the prescription.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "event-triggers",
        `Patient-Triggered and <span class="landing-h2__accent">Automatic Events</span>`,
        [
          p(
            `Patient-triggered events help correlate symptoms with the ECG at that time. Automatic detection can capture selected rhythm patterns even when the patient does not press the symptom button. Automatic detection is not perfect and not every event is guaranteed to be recognized.`
          ),
          noteBox(
            "Marking symptoms",
            "Mark symptoms as soon as practical after they begin, record what was felt and what you were doing, and follow the study instructions for confirming the event was captured."
          ),
          symptomButtonDiagram(),
          emergencyBox(),
        ].join("\n")
      ),
      secSplit(
        "event-reporting",
        `Reporting and Physician <span class="landing-h2__accent">Communication</span>`,
        p(
          `Event reports and notifications are handled according to the prescribed monitoring protocol. Routine event documentation is distinct from findings that meet the physician&rsquo;s notification criteria.`
        ),
        figureImg(
          REPORT_IMG,
          "De-identified cardiac event report example showing symptom, time, rhythm description, representative strip, and communication status",
          "De-identified event report example: symptom, time, rhythm description, representative strip, and communication status."
        ),
        { muted: true }
      ),
      sec(
        "event-compare",
        `Event Monitoring Compared With <span class="landing-h2__accent">MCT and Holter</span>`,
        [
          p(
            `All four test types provide LIVE operational visibility while the study is in progress. Event Monitoring emphasizes episodic capture and can present qualifying findings during the test. <a href="mobile-cardiac-telemetry-mct.html">MCT</a> provides broader in-progress clinical surveillance and protocol-based presentation of qualifying findings. <a href="holter-monitoring-services.html">Holter</a> and <a href="long-term-holter-monitoring.html">Long-Term Holter</a> provide continuous recording, but clinical results are presented after the final report is generated.`
          ),
          comparisonTable("cardiac-event-monitoring"),
        ].join("\n")
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What is a cardiac event monitor?",
        a: `It is an ambulatory ECG monitor designed to capture rhythm information associated with intermittent symptoms or selected automatically detected events.`,
      },
      {
        q: "How long is an event monitor worn?",
        a: `The prescribed period may extend up to 30 days, depending on the physician&rsquo;s order and monitoring setup.`,
      },
      {
        q: "Does the patient press a button when symptoms occur?",
        a: `In many event-monitoring workflows, the patient marks symptoms as instructed. Some configurations may also detect selected events automatically.`,
      },
      {
        q: "What if the patient forgets to mark a symptom?",
        a: `Automatic detection may capture some rhythm events, but patients should follow the symptom-marking instructions whenever possible.`,
      },
      {
        q: "Is an event monitor the same as MCT?",
        a: `No. Both MCT and Event Monitoring have LIVE operational visibility and can present qualifying clinical findings during the test. MCT generally provides broader continuous remote clinical surveillance, while Event Monitoring emphasizes episodic recordings and may use a different notification workflow.`,
      },
      {
        q: "Will the practice be contacted for every event?",
        a: `No. Communication depends on the prescribed criteria and practice protocol.`,
      },
      {
        q: "Can an event monitor detect symptoms that are not caused by an arrhythmia?",
        a: `The monitor records ECG information. The physician determines whether the rhythm correlates with the patient&rsquo;s symptoms.`,
      },
      {
        q: "What should a patient do during severe symptoms?",
        a: `Follow emergency instructions and call 911 when appropriate. Do not wait for a monitoring-center call.`,
      },
      {
        q: "Can the patient continue normal activities?",
        a: `Patients should follow the activity and device-care instructions provided for the prescribed monitor.`,
      },
      {
        q: "What is included in the final report?",
        a: `The final report may summarize captured events, rhythm findings, symptom correlations, representative strips, and other study measurements.`,
      },
    ],
    links: [
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
    ],
  },

  /* -------------------- 6. Ambulatory Cardiac Monitoring -------------------- */
  {
    id: "amb",
    slug: "ambulatory-cardiac-monitoring",
    file: "ambulatory-cardiac-monitoring.html",
    title: "Ambulatory Cardiac Monitoring | Specialized Medical",
    metaDescription: PDF_META["ambulatory-cardiac-monitoring"],
    serviceName: "Ambulatory Cardiac Monitoring",
    pill: "Ambulatory Cardiac Monitoring",
    h1Html: `Ambulatory <span class="landing-hero__title-accent">Cardiac Monitoring</span>`,
    directAnswer:
      "Ambulatory cardiac monitoring records the heart’s electrical activity while the patient continues normal daily life outside the clinic or hospital. The category includes Holter monitoring, extended Holter monitoring, cardiac event monitoring, and mobile cardiac telemetry. Each test provides a different balance of monitoring duration, data transmission, event capture, notification timing, patient involvement, and reporting.",
    ctaLabel: "Request an Ambulatory Monitoring Program Consultation",
    interestDefault: "Multiple test types / full program",
    schemaTypes: ["MedicalWebPage", "ItemList", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      sec(
        "amb-why",
        `Why Ambulatory ECG <span class="landing-h2__accent">Monitoring Is Used</span>`,
        [
          p(
            `An ECG performed in the office captures only a brief period. Ambulatory monitoring extends the observation window and may help the physician evaluate intermittent symptoms or rhythm patterns that are not present during a standard ECG. The ordering provider selects the modality based on the clinical question and expected event frequency.`
          ),
        ].join("\n")
      ),
      sec(
        "amb-four",
        `The Four Main <span class="landing-h2__accent">Monitoring Approaches</span>`,
        [
          `        <div class="landing-grid landing-grid--2">
          <article class="landing-card">
            <h3 class="landing-h3"><a href="holter-monitoring-services.html">Holter Monitoring</a></h3>
            <p class="landing-card__meta">24&ndash;48 hours &middot; LIVE test-status visibility</p>
            <p class="landing-p">Continuous short-window recording. Clinical results after the final report is generated. Minimal patient interaction beyond symptom documentation.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a></h3>
            <p class="landing-card__meta">3&ndash;14 days &middot; LIVE test-status visibility</p>
            <p class="landing-p">Extended continuous recording for intermittent symptoms. Clinical results after the final report is generated. Adherence and electrode care matter more over multiple days.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="cardiac-event-monitoring.html">Cardiac Event Monitoring</a></h3>
            <p class="landing-card__meta">Up to 30 days &middot; LIVE test-status visibility</p>
            <p class="landing-p">Episodic capture triggered by the patient, the device, or both. Qualifying findings presented during the test according to the prescribed notification protocol.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry (MCT)</a></h3>
            <p class="landing-card__meta">Up to 30 days &middot; LIVE test-status visibility</p>
            <p class="landing-p">Continuous remote rhythm surveillance with in-progress presentation of qualifying findings according to protocol. Requires the connected phone near the patient.</p>
          </article>
        </div>`,
          comparisonTable("ambulatory-cardiac-monitoring"),
          `        <h3 class="landing-h3" style="margin-top:1.5rem">Which page should I visit?</h3>
        <ul class="landing-list">
          <li>Symptoms most days and a short study is planned &mdash; see <a href="holter-monitoring-services.html">Holter Monitoring Services</a></li>
          <li>Symptoms every week or two and a longer recording window is planned &mdash; see <a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a></li>
          <li>Occasional symptoms where episodic capture is planned &mdash; see <a href="cardiac-event-monitoring.html">Cardiac Event Monitoring</a></li>
          <li>Live remote rhythm surveillance is prescribed &mdash; see <a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry (MCT)</a></li>
          <li>Comparing the full program &mdash; see <a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a></li>
        </ul>
        <p class="landing-p"><em>This guide helps you find the right page; it is not a diagnostic questionnaire. The ordering provider selects the test.</em></p>`,
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "amb-record",
        `What Ambulatory Monitoring <span class="landing-h2__accent">Can Record</span>`,
        [
          p(
            `In general terms, ambulatory monitoring can support evaluation of heart rate, rhythm, pauses, ectopy, tachyarrhythmias, bradyarrhythmias, symptom correlation, and rhythm burden. Not every monitor or report contains every measurement &mdash; content depends on the prescribed study and reporting configuration.`
          ),
          noteBox(
            "Why recording quality matters",
            "Movement, poor electrode contact, skin preparation, loose leads, and environmental factors can produce artifact and affect signal quality. Good adherence and electrode care give the study the best opportunity to produce interpretable data."
          ),
          signalQualityDiagram(),
        ].join("\n")
      ),
      sec(
        "amb-swimlane",
        `Patient, Practice, and <span class="landing-h2__accent">Monitoring-Center Workflow</span>`,
        [
          `        <div class="landing-swimlane" role="group" aria-label="Responsibilities of patient, practice, and Specialized Medical">
          <div class="landing-swimlane__lane">
            <h3 class="landing-h3">Patient</h3>
            <ul class="landing-list">
              <li>Wear the device as instructed</li>
              <li>Maintain phone proximity where required</li>
              <li>Mark symptoms</li>
              <li>Follow care instructions</li>
            </ul>
          </div>
          <div class="landing-swimlane__lane">
            <h3 class="landing-h3">Practice</h3>
            <ul class="landing-list">
              <li>Prescribe the test</li>
              <li>Enroll the patient</li>
              <li>Apply the device</li>
              <li>Set notification protocols</li>
              <li>Review reports</li>
            </ul>
          </div>
          <div class="landing-swimlane__lane">
            <h3 class="landing-h3">Specialized Medical</h3>
            <ul class="landing-list">
              <li>Support implementation</li>
              <li>Receive data</li>
              <li>Process recordings</li>
              <li>Communicate according to protocol</li>
              <li>Prepare reports</li>
            </ul>
          </div>
        </div>`,
          p(
            `The physician remains responsible for diagnosis, interpretation, and treatment decisions.`
          ),
          emergencyBox(),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "amb-partner",
        `Choosing a <span class="landing-h2__accent">Monitoring Partner</span>`,
        [
          p(
            `Evaluation factors include supported modalities, connectivity, patient support, report quality, workflow fit, physician access, electronic signature, implementation support, turnaround, and escalation procedures.`
          ),
          p(
            `Specialized Medical supports all four modalities through one coordinated program with practical workflow design and physician-ready reporting. Practices can start with a <a href="cardiac-monitoring-services.html">program review</a> or see how implementation works for <a href="cardiology-practice-cardiac-monitoring.html">cardiology practices</a>.`
          ),
        ].join("\n")
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What does ambulatory cardiac monitoring mean?",
        a: `It means recording ECG information while the patient is outside the hospital or clinic and continuing normal daily activities.`,
      },
      {
        q: "What types of ambulatory monitors are available?",
        a: `Common options include Holter monitors, extended Holter monitors, event monitors, and mobile cardiac telemetry.`,
      },
      {
        q: "Which monitor is best?",
        a: `There is no single best monitor for every patient. The ordering provider selects the test based on symptoms, event frequency, duration, and the need for live transmission.`,
      },
      {
        q: "Can ambulatory monitoring diagnose every heart rhythm problem?",
        a: `No. Diagnostic yield depends on whether the rhythm occurs during the study, recording quality, adherence, and other clinical factors.`,
      },
      {
        q: "Does every monitor transmit data live?",
        a: `All modalities provide LIVE operational visibility while the study is in progress. MCT and Event Monitoring can present qualifying clinical findings during the test according to protocol. Traditional and Long-Term Holter clinical results are presented after the final report is generated.`,
      },
      {
        q: "What is symptom correlation?",
        a: `It is the comparison of the patient&rsquo;s recorded symptoms with the ECG rhythm at the same time.`,
      },
      {
        q: "Can a patient travel during monitoring?",
        a: `Travel should be discussed with the ordering practice because connectivity, device care, charging, and return logistics may be affected.`,
      },
      {
        q: "What causes ECG artifact?",
        a: `Movement, poor electrode contact, skin preparation, loose leads, and environmental factors can affect signal quality.`,
      },
      {
        q: "How does the physician receive results?",
        a: `Results are delivered through the configured reporting workflow for physician review and interpretation.`,
      },
      {
        q: "Is ambulatory monitoring an emergency service?",
        a: `No. Patients with urgent symptoms should seek emergency care according to their physician&rsquo;s instructions.`,
      },
    ],
    links: [
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "cardiac-event-monitoring.html", label: "Cardiac Event Monitoring" },
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
    ],
  },

  /* ------------------ 7. S-Patch Cardiac Monitoring System ------------------ */
  {
    id: "spatch",
    slug: "s-patch-cardiac-monitoring-system",
    file: "s-patch-cardiac-monitoring-system.html",
    title: "S-Patch Cardiac Monitoring System | Specialized Medical",
    metaDescription: PDF_META["s-patch-cardiac-monitoring-system"],
    serviceName: "S-Patch Cardiac Monitoring System",
    pill: "S-Patch Monitoring System",
    h1Html: `S-Patch Cardiac <span class="landing-hero__title-accent">Monitoring System</span>`,
    directAnswer:
      "The S-Patch cardiac monitoring system is Specialized Medical’s primary wearable platform for ambulatory ECG monitoring. Its compact two-component design is intended to provide a practical alternative to traditional multi-lead systems while supporting several prescribed monitoring services. The monitor communicates with a connected smartphone, which serves as the gateway for data transmission when live connectivity is part of the study.",
    ctaLabel: "Request an S-Patch Demonstration",
    interestDefault: "Multiple test types / full program",
    schemaTypes: ["Product", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      secSplit(
        "spatch-overview",
        `S-Patch System <span class="landing-h2__accent">Overview</span>`,
        [
          p(
            `The S-Patch uses a two-disk wearable configuration worn on the chest with a connected phone. Current internal specifications indicate Disk 1 is approximately 1.57 inches in diameter by 0.40 inches thick and Disk 2 is approximately 1.41 inches in diameter by 0.24 inches thick. All technical specifications are verified before publication.`
          ),
          p(
            `Exact battery performance depends on configuration and use. Specific battery-life durations are published only for validated and released product configurations.`
          ),
        ].join("\n"),
        `        <div class="landing-media-pair">
${figureImg(SPATCH_IMG, "S-Patch two-disk wearable cardiac monitor, front product view", "S-Patch product view.")}
${figureImg("images/landing/s-patch-cardiac-monitoring-system.webp", "S-Patch wearable cardiac monitor worn on a patient&rsquo;s chest", "S-Patch as worn on the chest.")}
        </div>`
      ),
      sec(
        "spatch-services",
        `Monitoring Services <span class="landing-h2__accent">Supported</span>`,
        [
          p(
            `The platform can be used within <a href="holter-monitoring-services.html">Holter</a>, <a href="long-term-holter-monitoring.html">Extended Holter</a>, <a href="cardiac-event-monitoring.html">Event</a>, and <a href="mobile-cardiac-telemetry-mct.html">MCT</a> workflows depending on the prescribed configuration. A single study does not simultaneously function as all four tests &mdash; the prescription determines the configuration.`
          ),
          p(
            `The workflow changes between live and non-live studies: when live connectivity is prescribed (for example, <a href="live-ecg-monitoring.html">live ECG monitoring</a> within MCT), the connected phone transmits during the study. For Holter-type studies, the recording is analyzed after completion, with clinical results presented after the final report is generated. Every configuration retains LIVE test-status visibility while the study is in progress.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "spatch-connectivity",
        `Connectivity and <span class="landing-h2__accent">Phone Requirements</span>`,
        [
          p(
            `The monitor connects to the phone by Bluetooth, with an operating distance of approximately 30 feet under favorable conditions. Patients should keep the phone close, powered, and charged. Absolute range is not guaranteed because walls, body position, interference, and environment can affect performance.`
          ),
          p(
            `Multi-path cellular connectivity means the phone uses available network pathways to transmit when possible, helping support use across varied coverage environments.`
          ),
          flow(
            [
              { t: "S-Patch monitor", d: "ECG acquired on the chest" },
              { t: "Bluetooth (~30 ft under favorable conditions)", d: "Monitor pairs with the connected phone" },
              { t: "Multi-path cellular / network", d: "Phone transmits when connectivity is available" },
              { t: "Monitoring platform", d: "Data received and processed" },
            ],
            "Monitor to phone connectivity path"
          ),
          connectivityDiagram(),
        ].join("\n")
      ),
      sec(
        "spatch-care",
        `Device Care and <span class="landing-h2__accent">Patient Use</span>`,
        [
          `        <ul class="landing-list">
          <li>Follow the exact bathing instructions supplied with the monitor &mdash; do not treat the system as waterproof unless the configuration is verified for that use</li>
          <li>Follow adhesive-care instructions and report significant skin irritation</li>
          <li>Keep the phone charged and follow any device charging procedures for the study</li>
          <li>Record symptoms through the connected phone or other provided method when the workflow includes symptom recording</li>
          <li>If the monitor or phone disconnects, bring them near each other, confirm the phone is powered, and follow the troubleshooting instructions or contact support</li>
          <li>Do not attach the device directly to skin electrodes unless the approved setup specifically requires it</li>
          <li>Avoid long power-button presses that may turn off the phone</li>
        </ul>`,
          `        <div class="landing-table-wrap" role="region" aria-label="S-Patch troubleshooting" tabindex="0">
          <table class="landing-table">
            <caption class="sr-only">S-Patch troubleshooting: common issues and what to do</caption>
            <thead>
              <tr><th scope="col">Issue</th><th scope="col">What to do</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Phone not charging</th><td>Check the charger and cable, use a working outlet, and keep the phone powered; contact support if charging does not resume.</td></tr>
              <tr><th scope="row">Bluetooth disconnected</th><td>Bring the phone near the monitor, confirm the phone is powered on, and follow the reconnection instructions.</td></tr>
              <tr><th scope="row">Network disconnected</th><td>Transmission resumes when connectivity returns; move to an area with coverage when practical.</td></tr>
              <tr><th scope="row">Monitor detached</th><td>Follow the reattachment or replacement instructions provided with the study, or contact support.</td></tr>
              <tr><th scope="row">Skin irritation</th><td>Contact the practice or support team; sensitive-skin options or electrode rotation may be available depending on configuration.</td></tr>
              <tr><th scope="row">Missing ECG trace</th><td>Check device placement and phone connection, then contact support if the trace does not return.</td></tr>
              <tr><th scope="row">Unsure about study status</th><td>Contact the support number in the patient instructions; Specialized Medical maintains LIVE test-status visibility and may also reach out.</td></tr>
            </tbody>
          </table>
        </div>`,
          emergencyBox(),
        ].join("\n"),
        { muted: true }
      ),
      secSplit(
        "spatch-leadwire",
        `S-Patch and <span class="landing-h2__accent">Lead-Wire Options</span>`,
        p(
          `The S-Patch is the primary wearable option, and a lead-wire system is available as an alternative when a different configuration is needed. Both are supported service configurations &mdash; neither is disparaged. Differences in channels, wear style, battery routines, patient comfort considerations, and use cases are compared only with verified specifications during program setup.`
        ),
        `        <div class="landing-media-pair">
${figureImg(SPATCH_IMG, "S-Patch primary wearable cardiac monitoring option", "S-Patch &mdash; primary wearable option.")}
${figureImg(LEADWIRE_IMG, "Lead-wire cardiac monitoring system alternative configuration", "Lead-wire system &mdash; alternative configuration.")}
        </div>`
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What is the S-Patch?",
        a: `It is Specialized Medical&rsquo;s primary wearable ambulatory ECG platform used within selected Holter, Event, and MCT workflows.`,
      },
      {
        q: "Does the S-Patch require a phone?",
        a: `A connected phone is used as the transmission gateway when the prescribed workflow requires data transmission.`,
      },
      {
        q: "How close should the phone remain?",
        a: `The phone should remain near the patient and within the range stated in the patient instructions. Approximately 30 feet may be possible under favorable conditions, but range varies.`,
      },
      {
        q: "Is the S-Patch waterproof?",
        a: `Patients should follow the exact bathing instructions supplied with their monitor. The system should not be treated as waterproof unless the specific configuration is verified for that use.`,
      },
      {
        q: "How long does the battery last?",
        a: `Battery performance depends on the study configuration, transmission demands, and operating conditions. Only verified duration claims are published.`,
      },
      {
        q: "Can the S-Patch be used for MCT?",
        a: `Yes, when configured as part of the prescribed MCT service.`,
      },
      {
        q: "What should a patient do if the phone says Bluetooth disconnected?",
        a: `Bring the phone near the monitor, confirm the phone is powered, and follow the troubleshooting instructions or contact support.`,
      },
      {
        q: "What if the adhesive irritates the skin?",
        a: `Contact the practice or support team for instructions. Sensitive-skin options or electrode rotation may be available depending on the configuration.`,
      },
      {
        q: "Can patients mark symptoms?",
        a: `Yes, when the prescribed workflow includes symptom recording through the connected phone or other provided method.`,
      },
      {
        q: "Who should a patient call for help?",
        a: `Use the support contact provided by the ordering practice or in the patient instructions.`,
      },
    ],
    links: [
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "cardiac-event-monitoring.html", label: "Cardiac Event Monitoring" },
      { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
      { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR ambulatory monitoring with the S-Patch" },
    ],
  },

  /* ------------------------- 8. Live ECG Monitoring ------------------------- */
  {
    id: "live",
    slug: "live-ecg-monitoring",
    file: "live-ecg-monitoring.html",
    title: "Live ECG Monitoring | Specialized Medical",
    metaDescription: PDF_META["live-ecg-monitoring"],
    serviceName: "Live ECG Monitoring",
    pill: "Live ECG Monitoring",
    h1Html: `Live ECG <span class="landing-hero__title-accent">Monitoring</span>`,
    directAnswer:
      "Live ECG monitoring allows rhythm data to be transmitted from a wearable monitor during the prescribed ambulatory study. In the Specialized Medical workflow, the wearable communicates with a connected smartphone, and the phone transmits ECG information to the monitoring platform when connectivity is available. This makes it possible to review qualifying events and communicate according to the physician’s notification protocol before the final study is complete.",
    ctaLabel: "Request a Live ECG Monitoring Demonstration",
    interestDefault: "Mobile Cardiac Telemetry (MCT)",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    ctaEmergencyNote: true,
    body: [
      sec(
        "live-what",
        `What &ldquo;Live&rdquo; Means in <span class="landing-h2__accent">Ambulatory ECG Monitoring</span>`,
        [
          p(
            `Live means ECG information is transmitted during the study rather than waiting for the device to be returned. It does not mean that every beat is watched continuously by a dedicated technician or that communication is instantaneous under all conditions.`
          ),
          p(
            `Transmission depends on monitor operation, Bluetooth connection, phone status, network availability, and successful data receipt.`
          ),
        ].join("\n")
      ),
      sec(
        "live-path",
        `From Patient to <span class="landing-h2__accent">Monitoring Platform</span>`,
        [
          flow(
            [
              { t: "ECG acquired", d: "Wearable monitor records the rhythm" },
              { t: "Bluetooth", d: "Monitor connects to the provided smartphone" },
              { t: "Network transmission", d: "Phone transmits through available network" },
              { t: "Monitoring workflow", d: "Data enters the monitoring platform" },
              { t: "Protocol communication", d: "Qualifying findings communicated according to protocol" },
            ],
            "Five-step live ECG data flow"
          ),
          noteBox(
            "Reconnection after interruption",
            "The system is designed to reconnect automatically after temporary interruption. This is not an absolute guarantee that no data or transmission delay can ever occur."
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "live-benefits",
        `Clinical and <span class="landing-h2__accent">Operational Benefits</span>`,
        [
          p(
            `Live transmission may help provide earlier visibility into rhythm information, remote oversight during the study, documented physician notification pathways, patient support, and organized final reporting.`
          ),
          `        <ul class="landing-list">
          <li>Fewer disconnected systems across test types</li>
          <li>Clearer notification protocols</li>
          <li>Accessible reports</li>
          <li>Physician electronic signature</li>
        </ul>`,
        ].join("\n")
      ),
      sec(
        "live-disclaimer",
        `Live Monitoring Is <span class="landing-h2__accent">Not Emergency Response</span>`,
        [liveEcgDisclaimer()].join("\n"),
        { muted: true }
      ),
      sec(
        "live-compare",
        `Live ECG Versus <span class="landing-h2__accent">Post-Study Review</span>`,
        [
          p(
            `Every modality has LIVE operational visibility during the test. MCT and Event Monitoring present qualifying clinical findings during the test according to protocol, while Holter and Long-Term Holter clinical results are presented after the final report is generated. Each modality has an appropriate role &mdash; the ordering physician selects based on the clinical question.`
          ),
          comparisonTable("live-ecg-monitoring"),
        ].join("\n")
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What is live ECG monitoring?",
        a: `It is ambulatory ECG monitoring in which rhythm information is transmitted during the prescribed study rather than waiting until the recording is complete.`,
      },
      {
        q: "Is live ECG monitoring the same as MCT?",
        a: `MCT is a principal form of live ambulatory ECG monitoring. Exact features depend on the prescribed service and configuration.`,
      },
      {
        q: "Is someone watching every heartbeat at all times?",
        a: `The service processes and reviews ECG information within the monitoring workflow. It should not be described as one person manually watching every beat continuously.`,
      },
      {
        q: "How quickly is a physician notified?",
        a: `Communication timing depends on successful transmission, review, the prescribed criteria, and the practice&rsquo;s notification protocol.`,
      },
      {
        q: "What happens without cellular coverage?",
        a: `Transmission may be delayed until connectivity returns. The system is designed to reconnect when possible.`,
      },
      {
        q: "Does the phone have to stay with the patient?",
        a: `Yes. In this workflow the phone is the data gateway and should remain powered, charged, and near the patient.`,
      },
      {
        q: "Can live monitoring prevent a cardiac emergency?",
        a: `No such guarantee is made. It is a diagnostic service that may provide earlier visibility into qualifying rhythm events.`,
      },
      {
        q: "Should patients call the monitoring company during chest pain?",
        a: `Patients with urgent symptoms should call 911 or follow their physician&rsquo;s emergency instructions.`,
      },
      {
        q: "What is included in the final report?",
        a: `The report summarizes the study and provides representative ECG information for physician review and interpretation.`,
      },
      {
        q: "Can live ECG monitoring be used after discharge?",
        a: `A physician may prescribe it after discharge when ambulatory rhythm surveillance is appropriate, including selected <a href="post-tavr-cardiac-monitoring.html">delayed heart-block surveillance after TAVR</a>.`,
      },
    ],
    links: [
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "post-tavr-cardiac-monitoring.html", label: "Outpatient monitoring after TAVR" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
    ],
  },

  /* ---------------------- 9. Post-TAVR Cardiac Monitoring (Aug 2026 Guide) ---------------------- */
  {
    id: "tavr",
    slug: "post-tavr-cardiac-monitoring",
    file: "post-tavr-cardiac-monitoring.html",
    title: "Post-TAVR Cardiac Monitoring for Delayed Heart Block | Specialized Medical",
    metaDescription: PDF_META["post-tavr-cardiac-monitoring"],
    ogTitle: "Post-TAVR Cardiac Monitoring With LIVE Mobile Cardiac Telemetry",
    ogDescription:
      "Continuous outpatient ECG monitoring designed to help structural heart teams identify delayed conduction disturbances and clinically important arrhythmias after TAVR.",
    serviceName: "Post-TAVR Cardiac Monitoring",
    pill: "CONTINUOUS MONITORING. EARLIER INSIGHT. BETTER-INFORMED CARE.",
    h1Html: `Post-TAVR Cardiac Monitoring With <span class="landing-hero__title-accent">LIVE Mobile Cardiac Telemetry</span>`,
    directAnswer:
      "Delayed heart block and other conduction disturbances can occur after transcatheter aortic valve replacement, including after hospital discharge. Specialized Medical provides LIVE STREAMING outpatient cardiac monitoring designed to help structural heart teams identify qualifying rhythm findings, maintain continuous operational visibility and receive physician-ready reports.",
    ctaLabel: "Discuss a Post-TAVR Monitoring Protocol",
    secondaryCtaLabel: "Request a Demonstration",
    secondaryCtaHref: "#cta-form",
    interestDefault: "Post-TAVR monitoring program",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    formVariant: "postTavr",
    breadcrumbParent: {
      name: "Cardiac Monitoring Services",
      href: "cardiac-monitoring-services.html",
    },
    robots: "index, follow, max-image-preview:large",
    showRelated: false,
    author: {
      name: "Steven M. Burns",
      jobTitle: "President & CEO",
      worksFor: "Specialized Medical LLC",
    },
    dateModified: "2026-08-05",
    body: [
      sec(
        "tavr-trust",
        `LIVE Differentiation for <span class="landing-h2__accent">Structural Heart Teams</span>`,
        trustStrip([
          { t: "LIVE ECG streaming", d: "ECG data transmitted during the monitoring period" },
          { t: "Prescribed alerts", d: "Notification thresholds follow the ordering physician&rsquo;s protocol" },
          { t: "Multi-carrier connectivity", d: "Available cellular pathways for urban and rural recovery" },
          { t: "Physician-ready reports", d: "Organized ECG findings for clinical review" },
        ]),
        { muted: true }
      ),
      sec(
        "tavr-why",
        `Why Cardiac Monitoring After TAVR <span class="landing-h2__accent">Matters</span>`,
        [
          p(
            `TAVR can affect the heart&rsquo;s electrical conduction system. Although many conduction disturbances are recognized before discharge, clinically important abnormalities may also appear later. Published studies have identified delayed high-grade atrioventricular block and complete heart block during ambulatory monitoring after TAVR, sometimes leading to permanent pacemaker implantation. For selected patients, outpatient ECG monitoring can extend rhythm surveillance beyond the hospital stay and provide the treating team with clinically relevant information during recovery.`
          ),
          p(
            `Specialized Medical&rsquo;s <a href="mobile-cardiac-telemetry-mct.html">LIVE Mobile Cardiac Telemetry</a> workflow helps physicians identify concerning rhythms while the study is still underway.`
          ),
        ].join("\n")
      ),
      sec(
        "tavr-heart-block",
        `Detecting Delayed Heart Block After <span class="landing-h2__accent">TAVR</span>`,
        [
          p(
            `One of the most important reasons to consider ambulatory monitoring after TAVR is the possibility of delayed atrioventricular conduction disease. Monitoring may identify Mobitz II second-degree AV block, high-grade AV block, complete heart block, significant bradycardia and pauses that were not apparent at the time of discharge. Specialized Medical&rsquo;s LIVE STREAMING platform can present qualifying ECG findings according to the physician&rsquo;s prescribed notification protocol, allowing the clinical team to review the information while monitoring is still underway. The treating physician remains responsible for diagnosis and treatment decisions.`
          ),
          calloutBand(
            "HEART BLOCK CAN OCCUR AFTER DISCHARGE",
            `In a prospective multicenter study using 14 days of ambulatory ECG monitoring, delayed high-grade AV block or complete heart block occurred in 4.6% of monitored patients, with a median occurrence five days after TAVR.${cite(3)} In another prospective study, 30-day continuous monitoring identified additional patients who developed late symptomatic bradycardia or advanced AV block and required permanent pacing.${cite(2)}`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "tavr-who",
        `Which Patients May Benefit From Outpatient <span class="landing-h2__accent">Monitoring?</span>`,
        [
          p(
            `Patient selection and monitoring duration should be determined by the treating heart team. ACC expert consensus identifies post-procedure conduction changes that may warrant continued telemetry and outpatient monitoring, including new or progressive AV block, new bundle branch block, and progression of baseline conduction disease.${cite(1)} Baseline right bundle branch block, PR prolongation, QRS changes, new left bundle branch block and transient heart block are clinically relevant considerations.`
          ),
          `        <ul class="landing-list">
          <li>New left bundle branch block after TAVR</li>
          <li>Baseline right bundle branch block or other pre-existing conduction disease</li>
          <li>New or progressive first- or second-degree AV block</li>
          <li>PR or QRS prolongation after the procedure</li>
          <li>Transient intraprocedural or post-procedural heart block</li>
          <li>Unexplained dizziness, presyncope, syncope, palpitations or bradycardia</li>
          <li>Patients selected by the structural heart or electrophysiology team for extended surveillance</li>
        </ul>`,
        ].join("\n")
      ),
      sec(
        "tavr-tech",
        `LIVE Monitoring Designed for Structural Heart <span class="landing-h2__accent">Teams</span>`,
        [
          p(
            `Specialized Medical combines <a href="live-ecg-monitoring.html">LIVE ECG monitoring</a> streaming with continuous operational monitoring of device status, battery level, electrode connection, signal quality, cellular connectivity and patient connection status. Qualifying rhythm findings can be presented according to the physician&rsquo;s prescribed notification protocol, while final reports are prepared for physician review. Multi-carrier connectivity using available nationwide networks helps the system remain connected as patients recover at home and resume normal daily activities.`
          ),
          featureBlocks([
            {
              t: "LIVE ECG streaming",
              d: "ECG data is transmitted during the monitoring period, supporting review of qualifying events while the study is active.",
            },
            {
              t: "Prescribed notifications",
              d: "Notification thresholds and escalation procedures follow the ordering physician&rsquo;s selected protocol.",
            },
            {
              t: "Operational visibility",
              d: "Specialized Medical monitors device status, battery, electrodes, signal quality, connectivity and patient connection.",
            },
            {
              t: "Multi-carrier connectivity",
              d: "The monitoring system uses available cellular pathways to support connectivity across urban and rural areas.",
            },
            {
              t: "Physician-ready reports",
              d: "Reports organize clinically relevant ECG findings for physician review and interpretation.",
            },
            {
              t: "Patient and office support",
              d: "Specialized Medical helps manage enrollment, monitoring workflow, technical support and reporting.",
            },
          ]),
          p(
            `The wearable platform is the <a href="s-patch-cardiac-monitoring-system.html">S-Patch cardiac monitoring system</a>, configured for the prescribed post-TAVR ambulatory study.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "tavr-detect",
        `Clinically Important Rhythms After <span class="landing-h2__accent">TAVR</span>`,
        [
          p(
            `Post-TAVR monitoring is not limited to atrial fibrillation. Depending on the patient and prescribed monitoring protocol, clinically important findings may include:`
          ),
          `        <ul class="landing-list">
          <li>High-grade atrioventricular block</li>
          <li>Complete heart block</li>
          <li>Mobitz II second-degree AV block</li>
          <li>Progressive bradycardia and significant pauses</li>
          <li>New atrial fibrillation or atrial flutter</li>
          <li>Supraventricular tachycardia</li>
          <li>Ventricular tachycardia or wide-complex tachycardia</li>
          <li>Changes in conduction intervals or rhythm patterns that warrant physician review</li>
        </ul>`,
          noteBox(
            "Compliance wording",
            "Specialized Medical detects, records, identifies ECG findings and presents qualifying findings. The system does not diagnose, treat, prevent or guarantee avoidance of hospitalization, stroke, sudden death or pacemaker implantation."
          ),
        ].join("\n")
      ),
      sec(
        "tavr-workflow",
        `A Practical Post-TAVR Monitoring <span class="landing-h2__accent">Workflow</span>`,
        [
          flow(
            [
              {
                t: "Risk assessment",
                d: "Review baseline ECG, conduction history and procedural factors.",
              },
              {
                t: "TAVR and inpatient observation",
                d: "Monitor for new AV block, bundle branch block, PR/QRS changes and transient heart block.",
              },
              {
                t: "Physician-directed discharge plan",
                d: "Select appropriate patients and monitoring duration based on clinical findings and institutional protocol.",
              },
              {
                t: "LIVE outpatient monitoring",
                d: "Begin monitoring promptly after discharge; maintain operational visibility and apply prescribed notification thresholds.",
              },
              {
                t: "Clinical review and final reporting",
                d: "Review qualifying findings during the study and the final report at completion; determine any treatment or follow-up.",
              },
            ],
            "Five-step post-TAVR monitoring workflow"
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "tavr-evidence",
        `Clinical Evidence for Post-TAVR <span class="landing-h2__accent">Monitoring</span>`,
        [
          p(
            `The following summaries reflect published guideline and peer-reviewed evidence. Citations link to primary ACC or PubMed records. Specialized Medical did not claim proprietary authorship of these study results.`
          ),
          evidenceCards([
            {
              n: 1,
              title: "ACC Expert Consensus Decision Pathway (2020)",
              label: "ACC Key Points / JACC consensus",
              summary:
                "Patients with new or progressive conduction disturbances may require continued inpatient telemetry and outpatient monitoring for at least 14 days. The pathway identifies new AV block, new bundle branch block and progression of baseline conduction disease as important post-TAVR considerations.",
            },
            {
              n: 2,
              title: "Tian et al., 2019 — 30-day monitoring",
              label: "Circ Cardiovasc Interv. PMID 31833417",
              summary:
                "In a prospective TAVR cohort, 30-day continuous ambulatory monitoring identified late symptomatic bradycardia and advanced AV block. Among monitored patients without a pacemaker at discharge, 8.6% required a pacemaker within 30 days; the authors concluded monitoring identified additional patients requiring permanent pacing.",
            },
            {
              n: 3,
              title: "Muntané-Carol et al., 2021 — 14-day monitoring",
              label: "JACC Cardiovasc Interv. PMID 34949396",
              summary:
                "In 459 patients monitored for 14 days after TAVR, delayed high-grade AV block or complete heart block occurred in 4.6%, at a median of five days after the procedure; 81% of those patients received a permanent pacemaker.",
            },
            {
              n: 4,
              title: "REdireCT TAVI, 2022",
              label: "Europace. PMID 35699482",
              summary:
                "Two-week remote monitoring before and after TAVI was feasible and generated notifications for AV block, pauses and ventricular tachycardia; monitoring frequently led to planned pacemaker implantation.",
            },
            {
              n: 5,
              title: "Systematic AECG monitoring study, 2026",
              label: "PubMed PMID 42059075",
              summary:
                "A large observational analysis found systematic 14-day ambulatory ECG monitoring after TAVR was associated with earlier detection of severe arrhythmias and fewer life-threatening cardiovascular events at one year. Because the study was observational, this is reported as an association, not proof of causation.",
            },
          ]),
        ].join("\n")
      ),
      sec(
        "tavr-compare",
        `Follow-Up Alone vs LIVE Ambulatory <span class="landing-h2__accent">Monitoring</span>`,
        followUpCompareTable(),
        { muted: true }
      ),
      sec(
        "tavr-eeat",
        `Author, Medical Review and <span class="landing-h2__accent">References</span>`,
        [
          eeatBlock(),
          p(
            `For the full Specialized Medical program overview, see <a href="cardiac-monitoring-services.html">cardiac monitoring services</a>. Practices evaluating operational fit can also review the <a href="cardiology-practice-cardiac-monitoring.html">cardiology practice monitoring workflow</a>.`
          ),
          emergencyBox(),
        ].join("\n")
      ),
      sec(
        "tavr-demo-band",
        `Discuss a Post-TAVR Monitoring <span class="landing-h2__accent">Protocol</span>`,
        [
          p(
            `Request a demonstration to review patient selection, notification protocols, LIVE STREAMING workflow, reporting and implementation requirements with Specialized Medical.`
          ),
          `        <p class="landing-p"><a class="figma-btn figma-btn--solid" href="#cta-form">Discuss a Post-TAVR Monitoring Protocol</a> <a class="figma-btn figma-btn--outline" href="#cta-form">Request a Demonstration</a></p>`,
        ].join("\n"),
        { muted: true }
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "Why is cardiac monitoring considered after TAVR?",
        a: `TAVR can affect the cardiac conduction system. Some conduction disturbances are recognized in the hospital, while others may develop after discharge. Ambulatory monitoring extends rhythm surveillance into the recovery period for patients selected by the treating heart team.`,
      },
      {
        q: "Can heart block occur after a patient leaves the hospital?",
        a: `Yes. Published studies have identified delayed high-grade AV block and complete heart block during ambulatory monitoring after discharge. In a multicenter 14-day study, delayed high-grade AV block or complete heart block occurred at a median of five days after TAVR.`,
      },
      {
        q: "What types of heart block can monitoring identify?",
        a: `Monitoring may record Mobitz II second-degree AV block, high-grade AV block, complete heart block, progressive bradycardia and significant pauses. The treating physician interprets the findings and determines diagnosis and treatment.`,
      },
      {
        q: "How long should patients be monitored after TAVR?",
        a: `Monitoring duration is determined by the treating physician and institutional protocol. ACC expert consensus recommends outpatient monitoring for at least 14 days in certain patients with new or progressive conduction disturbances. Some clinical studies have evaluated 14-day or 30-day strategies.`,
      },
      {
        q: "Which post-TAVR patients may be considered for outpatient monitoring?",
        a: `Patients with new or progressive conduction changes may be considered, including those with new bundle branch block, AV block, PR or QRS prolongation, transient heart block, baseline right bundle branch block, or concerning symptoms. Patient selection remains a physician decision.`,
      },
      {
        q: "Can monitoring identify atrial fibrillation after TAVR?",
        a: `Yes. Ambulatory monitoring may identify new or recurrent atrial fibrillation or atrial flutter, including asymptomatic episodes, depending on the monitoring technology and prescribed protocol.`,
      },
      {
        q: "What is the difference between Holter monitoring and Mobile Cardiac Telemetry after TAVR?",
        a: `Holter monitoring provides continuous recording with findings generally presented after the final report. Mobile Cardiac Telemetry can support presentation of qualifying findings during the active monitoring period according to the physician&rsquo;s prescribed notification protocol.`,
      },
      {
        q: "Does Specialized Medical provide LIVE ECG streaming?",
        a: `Yes. Specialized Medical&rsquo;s platform supports LIVE ECG transmission and continuous operational visibility, including device status, battery, electrodes, signal quality, connectivity and patient connection status.`,
      },
      {
        q: "Can physicians receive alerts during the monitoring period?",
        a: `Qualifying findings can be presented according to the physician&rsquo;s prescribed notification thresholds and escalation protocol. Notification does not replace physician interpretation or emergency clinical evaluation.`,
      },
      {
        q: "Can post-TAVR monitoring help identify patients who may require a pacemaker?",
        a: `Ambulatory monitoring can identify advanced conduction abnormalities that may prompt physician evaluation for pacing. Published studies have reported permanent pacemaker implantation following detection of delayed high-grade AV block, complete heart block or symptomatic bradycardia.`,
      },
      {
        q: "Does monitoring replace inpatient telemetry?",
        a: `No. Outpatient monitoring complements, but does not replace, appropriate inpatient observation, telemetry, electrophysiology evaluation or pacemaker management. Discharge and monitoring decisions are made by the heart team.`,
      },
      {
        q: "Can patients be monitored while recovering at home?",
        a: `Yes. Ambulatory monitoring is designed for use during normal daily activities. Specialized Medical also monitors operational status and provides technical support during the prescribed study.`,
      },
      {
        q: "How are reports delivered?",
        a: `Specialized Medical prepares physician-ready reports for clinical review. Workflow options may include portal access, electronic signature and integration with the practice&rsquo;s reporting process.`,
      },
      {
        q: "Is the system suitable for rural patients?",
        a: `The platform uses multi-carrier connectivity to access available cellular pathways. Actual coverage varies by location, network availability, building conditions and other factors, so uninterrupted coverage is not guaranteed.`,
      },
      {
        q: "How can a structural heart program evaluate Specialized Medical?",
        a: `The program can request a demonstration and discuss patient selection, notification protocols, workflow, reporting and implementation requirements with Specialized Medical.`,
      },
    ],
    links: [],
  },

  /* ------------- 10. Cardiac Monitoring for Cardiology Practices ------------- */
  {
    id: "practice",
    slug: "cardiology-practice-cardiac-monitoring",
    file: "cardiology-practice-cardiac-monitoring.html",
    title: "Cardiac Monitoring for Cardiology Practices | Specialized Medical",
    metaDescription: PDF_META["cardiology-practice-cardiac-monitoring"],
    serviceName: "Cardiac Monitoring for Cardiology Practices",
    pill: "For Cardiology Practices",
    h1Html: `Cardiac Monitoring for <span class="landing-hero__title-accent">Cardiology Practices</span>`,
    directAnswer:
      "Specialized Medical provides cardiology practices with more than a monitor. The service is designed as a complete operational program that supports patient enrollment, device hookup, monitoring, notifications, report delivery, physician review, electronic signature, staff training, and ongoing account support. The objective is to make ambulatory cardiac monitoring easier to operate consistently across one or multiple office locations.",
    ctaLabel: "Request a Practice Workflow Demonstration",
    interestDefault: "Multiple test types / full program",
    schemaTypes: ["MedicalWebPage", "OrganizationMedicalBusiness", "Service", "BreadcrumbList", "FAQPage"],
    emergency: false,
    body: [
      sec(
        "practice-turnkey",
        `A Turnkey <span class="landing-h2__accent">Practice Workflow</span>`,
        [
          p(
            `The three core office steps are <strong>Hook Up</strong>, <strong>Enroll</strong>, and <strong>Disconnect</strong>. Patients can be pre-enrolled days, weeks, or longer in advance when appropriate, allowing the appointment-day workflow to move faster.`
          ),
          flow(
            [
              { t: "Pre-enroll", d: "Days or weeks in advance, when appropriate" },
              { t: "Hook Up", d: "Fast in-office application on appointment day" },
              { t: "Enroll", d: "Confirm test, duration, notification instructions" },
              { t: "Disconnect", d: "Device returned or disconnected per selected workflow" },
            ],
            "Pre-enrollment to hookup process"
          ),
          p(
            `Insurance and billing-related information can be included in the enrollment process when the practice chooses that workflow. Guaranteed reimbursement or billing compliance is not claimed.`
          ),
        ].join("\n")
      ),
      sec(
        "practice-implementation",
        `Implementation and <span class="landing-h2__accent">Staff Training</span>`,
        [
          p(
            `Implementation covers kickoff, workflow mapping, user setup, device training, practice-specific notification protocols, report routing, testing, go-live support, and follow-up. Specialized Medical works directly with the practice rather than simply shipping equipment and leaving the staff to determine the process.`
          ),
          `        <div class="landing-swimlane" role="group" aria-label="Practice role responsibilities">
          <div class="landing-swimlane__lane">
            <h3 class="landing-h3">Front office</h3>
            <ul class="landing-list"><li>Scheduling and pre-enrollment</li><li>Patient intake information</li></ul>
          </div>
          <div class="landing-swimlane__lane">
            <h3 class="landing-h3">Medical assistants / nursing</h3>
            <ul class="landing-list"><li>Hookup and device training</li><li>Patient instructions and support handoff</li></ul>
          </div>
          <div class="landing-swimlane__lane">
            <h3 class="landing-h3">Physicians / administrators</h3>
            <ul class="landing-list"><li>Notification protocols</li><li>Report review and e-signature</li><li>Program oversight</li></ul>
          </div>
        </div>`,
        ].join("\n"),
        { muted: true }
      ),
      secSplit(
        "practice-reporting",
        `Reporting and Physician <span class="landing-h2__accent">Electronic Signature</span>`,
        p(
          `Physician-ready reports can be reviewed through the portal and electronically signed. Dictation or staff-assisted entry may be used where configured, while the physician retains responsibility for the final interpretation and signature.`
        ),
        figureImg(
          REPORT_IMG,
          "De-identified portal report view showing physician review and electronic signature workflow",
          "Portal report review and e-signature (de-identified)."
        ),
        {
          after: flow(
            [
              { t: "Report ready", d: "Completed study appears in the portal" },
              { t: "Physician review", d: "Findings and strips reviewed" },
              { t: "Interpretation", d: "Entered directly or via configured assistance" },
              { t: "E-signature", d: "Report signed electronically and routed" },
            ],
            "Physician report review and e-signature steps"
          ),
        }
      ),
      sec(
        "practice-locations",
        `Monitoring Across <span class="landing-h2__accent">Multiple Locations</span>`,
        [
          p(
            `Programs can use centralized or location-specific inventory, staff permissions, patient enrollment, support, report routing, and utilization review. Assigning monitors, tracking unused inventory, and maintaining clear return and replacement procedures keeps multi-site programs running consistently.`
          ),
          flow(
            [
              { t: "Central program", d: "Shared protocols, training, and reporting standards" },
              { t: "Location A", d: "Local inventory, enrollment, and staff permissions" },
              { t: "Location B", d: "Local inventory, enrollment, and staff permissions" },
              { t: "Unified review", d: "Consistent report routing and utilization review" },
            ],
            "Multi-location implementation structure"
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "practice-billing",
        `Billing and <span class="landing-h2__accent">Administrative Support</span>`,
        [
          p(
            `Specialized Medical can provide documentation support, workflow templates, and information needed by the practice&rsquo;s billing team. Specialized Medical does not guarantee payment, determine coding, or replace the practice&rsquo;s compliance responsibility. Detailed CPT, pricing, and payer specifics are reviewed with the practice directly because reimbursement policies can change.`
          ),
        ].join("\n")
      ),
      sec(
        "practice-why",
        `Why <span class="landing-h2__accent">Specialized Medical</span>`,
        [
          `        <ul class="landing-list">
          <li>Multiple test types through one program &mdash; <a href="cardiac-monitoring-services.html">see all cardiac monitoring services</a></li>
          <li>Live ECG capability for MCT with multi-path connectivity</li>
          <li><a href="s-patch-cardiac-monitoring-system.html">S-Patch</a> and lead-wire options</li>
          <li>Implementation support and patient support</li>
          <li>Physician-ready reporting with electronic signature</li>
          <li>Direct account involvement and workflows designed for real cardiology practices, including <a href="post-tavr-cardiac-monitoring.html">post-TAVR programs</a> and the full range of <a href="ambulatory-cardiac-monitoring.html">ambulatory cardiac monitoring</a></li>
        </ul>`,
        ].join("\n"),
        { muted: true }
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What does &ldquo;turnkey cardiac monitoring&rdquo; mean?",
        a: `It means the service supports the complete workflow, including implementation, enrollment, monitoring, support, reporting, and physician review rather than providing only hardware.`,
      },
      {
        q: "Can patients be enrolled before their appointment?",
        a: `Yes. Pre-enrollment can reduce the time required during the in-office hookup.`,
      },
      {
        q: "Can one program support multiple test types?",
        a: `Yes. Specialized Medical supports Holter, Long-Term Holter, Event, and MCT workflows.`,
      },
      {
        q: "Is staff training included?",
        a: `Yes. Training can be tailored to the roles and workflow of the practice.`,
      },
      {
        q: "Can physicians sign reports electronically?",
        a: `Yes, when the electronic-signature workflow is enabled for the practice.`,
      },
      {
        q: "Can the service support multiple office locations?",
        a: `Yes. User access, inventory, enrollment, report routing, and training can be organized across multiple locations.`,
      },
      {
        q: "Does Specialized Medical handle billing for the practice?",
        a: `The service can provide workflow and documentation support, but the practice remains responsible for coding, billing, compliance, and payer requirements unless a separate written arrangement states otherwise.`,
      },
      {
        q: "How are urgent findings communicated?",
        a: `For live services, communication follows the physician-defined notification protocol and contact hierarchy.`,
      },
      {
        q: "Can Specialized Medical integrate with an EMR?",
        a: `Integration and report-delivery options depend on the practice&rsquo;s systems and the available implementation configuration.`,
      },
      {
        q: "What happens during implementation?",
        a: `The team maps workflow, configures users and protocols, trains staff, tests the process, and supports go-live.`,
      },
    ],
    links: [
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "ambulatory-cardiac-monitoring.html", label: "Ambulatory Cardiac Monitoring" },
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
      { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR Cardiac Monitoring" },
    ],
  },
]
