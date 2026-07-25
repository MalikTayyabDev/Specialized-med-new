/**
 * Landing page content per "Specialized Medical - SEO Content & Implementation Manual" (July 2026, v2).
 * The manual is the single source of truth: opening copy, comparison framework, FAQs,
 * CTA copy, disclaimers, and internal links are transcribed from it.
 */

/* ----------------------------- shared helpers ----------------------------- */

function p(html) {
  return `        <p class="landing-p">${html}</p>`
}

function sec(id, headingHtml, inner, { muted = false, wide = false } = {}) {
  return `    <section class="landing-section${muted ? " landing-section--muted" : ""}" aria-labelledby="${id}-heading">
      <div class="figma-container${wide ? "" : ""}">
        <h2 id="${id}-heading" class="landing-h2">${headingHtml}</h2>
${inner}
      </div>
    </section>`
}

/** Split layout: H2 lives with the copy column so heading + text stay together. */
function secSplit(id, headingHtml, copyInner, mediaInner, { muted = false } = {}) {
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
        </div>
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

const COMPARISON_EXPLAINER = `Every Specialized Medical test provides <strong>LIVE test-status visibility</strong> while the study is in progress. Specialized Medical can see operational information such as battery level, electrode contact and signal quality, whether the monitor is communicating, and whether the patient appears to remain properly connected. When a parameter falls outside the expected range, Specialized Medical contacts the patient and works with the patient to correct the issue so the study has the best opportunity to be completed successfully. The distinction between test types is not whether the study is visible live; it is <strong>when clinical findings are presented</strong>. For Holter and Extended / Long-Term Holter, clinical results are presented after the final report is generated. For Event Monitoring and Mobile Cardiac Telemetry (MCT), qualifying clinical findings are presented while the test is in progress according to the prescribed notification protocol.`

const MODALITIES = [
  {
    slug: "holter-monitoring-services",
    name: "Holter Monitoring",
    duration: "24&ndash;48 hours",
    findings: "After Final Report Is Generated",
    suited: "Frequent symptoms and short-term rhythm assessment",
  },
  {
    slug: "long-term-holter-monitoring",
    name: "Extended / Long-Term Holter",
    duration: "3&ndash;14 days",
    findings: "After Final Report Is Generated",
    suited: "Intermittent symptoms requiring a longer recording window",
  },
  {
    slug: "cardiac-event-monitoring",
    name: "Cardiac Event Monitoring",
    duration: "Up to 30 days",
    findings: "During Test &mdash; According to Prescribed Notification Protocol",
    suited: "Intermittent symptoms that may require patient or automatic event capture",
  },
  {
    slug: "mobile-cardiac-telemetry-mct",
    name: "Mobile Cardiac Telemetry (MCT)",
    duration: "Up to 30 days",
    findings: "During Test &mdash; According to Prescribed Notification Protocol",
    suited: "Patients who may benefit from continuous remote rhythm surveillance",
  },
]

export function comparisonTable(currentSlug, { withExplainer = true } = {}) {
  const rows = MODALITIES.map((m) => {
    const name =
      m.slug === currentSlug
        ? `<strong>${m.name}</strong>`
        : `<a href="${m.slug}.html">${m.name}</a>`
    return `            <tr>
              <th scope="row">${name}</th>
              <td>${m.duration}</td>
              <td>Yes</td>
              <td>${m.findings}</td>
              <td>${m.suited}</td>
            </tr>`
  }).join("\n")
  const explainer = withExplainer
    ? `        <div class="landing-compare-block">
          <p class="landing-p landing-p--wide">${COMPARISON_EXPLAINER}</p>
        </div>\n`
    : ""
  return `${explainer}        <div class="landing-table-wrap" role="region" aria-label="Cardiac monitoring service comparison" tabindex="0">
          <table class="landing-table">
            <caption class="sr-only">Comparison of Specialized Medical ambulatory cardiac monitoring test types by duration, LIVE test-status visibility, clinical-findings timing, and typical use</caption>
            <thead>
              <tr>
                <th scope="col">Monitoring Type</th>
                <th scope="col">Typical Duration</th>
                <th scope="col">LIVE Test-Status Visibility</th>
                <th scope="col">Clinical Findings Presented</th>
                <th scope="col">Best Suited For</th>
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

/* --------------------------------- pages --------------------------------- */

export const PAGES = [
  /* ------------------- 1. Cardiac Monitoring Services ------------------- */
  {
    id: "cms",
    slug: "cardiac-monitoring-services",
    file: "cardiac-monitoring-services.html",
    title: "Cardiac Monitoring Services | Specialized Medical",
    metaDescription:
      "Specialized Medical provides a turnkey ambulatory cardiac monitoring program designed to help cardiology practices select, enroll, monitor, report, and follow patients.",
    serviceName: "Cardiac Monitoring Services",
    pill: "Cardiac Monitoring Services",
    h1Html: `Cardiac <span class="landing-hero__title-accent">Monitoring Services</span>`,
    directAnswer:
      "Specialized Medical provides a turnkey ambulatory cardiac monitoring program designed to help cardiology practices select, enroll, monitor, report, and follow patients through one coordinated workflow. The program supports traditional Holter monitoring, extended and long-term Holter monitoring, cardiac event monitoring, and mobile cardiac telemetry. Practices can use one partner for multiple test types while maintaining consistent staff training, patient support, reporting, and physician review processes.",
    ctaLabel: "Request a Cardiac Monitoring Program Review",
    interestDefault: "Multiple test types / full program",
    schemaTypes: ["WebPage", "OrganizationMedicalBusiness", "Service", "BreadcrumbList", "FAQPage"],
    emergency: false,
    body: [
      sec(
        "cms-partner",
        `One Cardiac Monitoring Partner for <span class="landing-h2__accent">Multiple Test Types</span>`,
        [
          p(
            `Specialized Medical helps practices avoid fragmented workflows caused by using different vendors for different test types. One coordinated program can support short-duration Holter studies, longer recording periods, event-based monitoring, and mobile cardiac telemetry with in-progress clinical findings. The goal is to make test selection easier for the ordering provider while giving office staff a consistent process for patient enrollment, device setup, support, return, reporting, and physician review.`
          ),
          p(
            `The <a href="s-patch-cardiac-monitoring-system.html">S-Patch platform</a> is positioned as the primary wearable option, with a lead-wire system available when a different configuration is clinically or operationally appropriate. The service is designed around practical office use: pre-enrollment is available, insurance information can be incorporated into the workflow when requested, and physician-ready reports can be reviewed and electronically signed through the portal.`
          ),
        ].join("\n")
      ),
      sec(
        "cms-options",
        `Cardiac Monitoring Options <span class="landing-h2__accent">Available</span>`,
        [
          `        <div class="landing-grid landing-grid--2">
          <article class="landing-card">
            <h3 class="landing-h3"><a href="holter-monitoring-services.html">Holter Monitoring</a></h3>
            <p class="landing-card__meta">24&ndash;48 hours &middot; LIVE test-status visibility</p>
            <p class="landing-p">Clinical findings are presented after the final report is generated. Typically used for frequent symptoms and short-term rhythm assessment.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="long-term-holter-monitoring.html">Long-Term Holter Monitoring</a></h3>
            <p class="landing-card__meta">3&ndash;14 days &middot; LIVE test-status visibility</p>
            <p class="landing-p">Clinical findings are presented after the final report is generated. Typically used for intermittent symptoms requiring a longer recording window.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="cardiac-event-monitoring.html">Cardiac Event Monitoring</a></h3>
            <p class="landing-card__meta">Up to 30 days &middot; LIVE test-status visibility</p>
            <p class="landing-p">Qualifying clinical findings are presented during the test according to the prescribed notification protocol. Typically used for intermittent symptoms that may require patient or automatic event capture.</p>
          </article>
          <article class="landing-card">
            <h3 class="landing-h3"><a href="mobile-cardiac-telemetry-mct.html">Mobile Cardiac Telemetry (MCT)</a></h3>
            <p class="landing-card__meta">Up to 30 days &middot; LIVE test-status visibility</p>
            <p class="landing-p">Qualifying clinical findings are presented during the test according to the prescribed notification protocol. Typically used for patients who may benefit from continuous remote rhythm surveillance.</p>
          </article>
        </div>`,
          comparisonTable("cardiac-monitoring-services"),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "cms-workflow",
        `How the Specialized Medical <span class="landing-h2__accent">Workflow Works</span>`,
        [
          p(
            `The office workflow is built around three principal steps: <strong>Hook Up</strong>, <strong>Enroll</strong>, and <strong>Disconnect</strong>. Practices may pre-enroll patients days or weeks in advance so the in-office portion can be faster when the patient arrives. During enrollment, the office confirms the prescribed test, patient information, monitoring duration, notification instructions, and other requested information. At the end of monitoring, the device is disconnected or returned according to the selected workflow, and the completed report is prepared for physician review.`
          ),
          flow(
            [
              { t: "Hook Up", d: "Device applied and verified in the office" },
              { t: "Enroll", d: "Prescribed test, duration, and notification instructions confirmed (pre-enrollment available)" },
              { t: "Monitor", d: "Study in progress with LIVE test-status visibility" },
              { t: "Report", d: "Completed report prepared for physician review and e-signature" },
            ],
            "Hook Up, Enroll, Monitor, Report workflow"
          ),
          noteBox(
            "LIVE operational visibility on every study",
            "While any test is in progress, Specialized Medical can monitor battery status, electrode contact / signal quality, device communication, and whether the patient appears connected &mdash; then contact the patient when corrective support is needed. Clinical-result timing differs: Holter and Extended / Long-Term Holter results are presented after the final report is generated, whereas qualifying Event and MCT findings are presented during the study according to protocol."
          ),
        ].join("\n")
      ),
      secSplit(
        "cms-efficiency",
        `Designed for Cardiology <span class="landing-h2__accent">Practice Efficiency</span>`,
        [
          p(
            `Specialized Medical provides staff training, implementation guidance, patient support, report delivery, and workflow assistance. The objective is not merely to supply a device. The objective is to provide a complete service that fits the practice&rsquo;s clinical and operational needs.`
          ),
          p(
            `The physician portal supports review and electronic signature of reports. Workflow details are configured to the practice, including which staff members enroll patients, how reports are routed, and how physician notification protocols are documented. See how this works for <a href="cardiology-practice-cardiac-monitoring.html">cardiology practices</a> or across the broader category of <a href="ambulatory-cardiac-monitoring.html">ambulatory cardiac monitoring</a>.`
          ),
        ].join("\n"),
        figureImg(
          REPORT_IMG,
          "De-identified physician-ready cardiac monitoring report as reviewed and electronically signed in the Specialized Medical portal",
          "Physician-ready report review with electronic signature in the portal (de-identified sample)."
        ),
        { muted: true }
      ),
      secSplit(
        "cms-why",
        `Why Practices Choose <span class="landing-h2__accent">Specialized Medical</span>`,
        [
          `        <ul class="landing-list">
          <li>Live-streaming ECG capability for MCT</li>
          <li>Multi-path cellular connectivity with support for rural and variable coverage environments</li>
          <li>Multiple monitoring modalities through one coordinated platform</li>
          <li>Physician-ready reporting with electronic signatures</li>
          <li>Responsive implementation and direct operational support</li>
        </ul>`,
          p(
            `Differentiation is evidence-based: one coordinated platform, practical workflow design, live ECG visibility where prescribed, and reporting configured for physician review.`
          ),
        ].join("\n"),
        `        <div class="landing-media-pair">
${figureImg(SPATCH_IMG, "S-Patch wearable cardiac monitor, the primary Specialized Medical wearable option", "S-Patch &mdash; primary wearable option.")}
${figureImg(LEADWIRE_IMG, "Lead-wire cardiac monitoring system available as an alternative configuration", "Lead-wire system &mdash; alternative configuration.")}
        </div>`
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What cardiac monitoring services does Specialized Medical provide?",
        a: `Specialized Medical supports Holter monitoring, extended and long-term Holter monitoring, cardiac event monitoring, and mobile cardiac telemetry through a coordinated ambulatory monitoring program.`,
      },
      {
        q: "How does a practice decide which monitoring test to order?",
        a: `The ordering provider selects the test based on the patient&rsquo;s symptoms, expected event frequency, desired monitoring duration, and whether live remote rhythm surveillance is clinically appropriate.`,
      },
      {
        q: "Does every monitoring service provide live alerts?",
        a: `All test types provide LIVE test-status visibility during the study so Specialized Medical can monitor battery level, electrode contact / signal quality, device communication, and whether the patient appears connected. The difference is the timing of clinical findings. MCT and Event Monitoring can present qualifying findings while the study is in progress according to protocol. Holter and Extended / Long-Term Holter clinical results are presented after the final report is generated.`,
      },
      {
        q: "Can patients be pre-enrolled?",
        a: `Yes. Pre-enrollment can reduce the amount of work required while the patient is physically in the office.`,
      },
      {
        q: "Can Specialized Medical support multiple office locations?",
        a: `Yes. The implementation workflow can be structured for multiple locations with consistent training, enrollment, support, and report routing.`,
      },
      {
        q: "How are reports delivered?",
        a: `Reports are made available through the physician workflow and can be reviewed and electronically signed according to the practice&rsquo;s configuration.`,
      },
      {
        q: "Does Specialized Medical replace the physician&rsquo;s clinical judgment?",
        a: `No. The service provides diagnostic monitoring data and reporting support. Diagnosis and treatment decisions remain with the ordering physician.`,
      },
      {
        q: "What happens if connectivity is temporarily interrupted?",
        a: `The system is designed to reconnect and continue transmitting when connectivity becomes available. Exact behavior depends on the prescribed test, device, phone proximity, and network conditions.`,
      },
      {
        q: "Is training provided to office staff?",
        a: `Yes. Specialized Medical provides workflow and device training tailored to the practice.`,
      },
      {
        q: "Can the workflow integrate with existing practice processes?",
        a: `Yes. Enrollment, report routing, physician review, and related administrative steps can be configured around the practice&rsquo;s current workflow.`,
      },
    ],
    links: [
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "cardiac-event-monitoring.html", label: "Cardiac Event Monitoring" },
      { href: "ambulatory-cardiac-monitoring.html", label: "Ambulatory Cardiac Monitoring" },
      { href: "cardiology-practice-cardiac-monitoring.html", label: "Cardiac Monitoring for Cardiology Practices" },
    ],
  },

  /* --------------------- 2. Mobile Cardiac Telemetry --------------------- */
  {
    id: "mct",
    slug: "mobile-cardiac-telemetry-mct",
    file: "mobile-cardiac-telemetry-mct.html",
    title: "Mobile Cardiac Telemetry (MCT) | Specialized Medical",
    metaDescription:
      "Mobile Cardiac Telemetry is an ambulatory ECG monitoring service designed to transmit rhythm data during the prescribed study rather than waiting until the monitor is returned.",
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
            `MCT is a diagnostic monitoring service. It is not an emergency response system and it does not replace instructions to call 911 or seek emergency care when a patient experiences urgent symptoms.`
          ),
        ].join("\n")
      ),
      sec(
        "mct-how",
        `How the Specialized Medical <span class="landing-h2__accent">MCT System Works</span>`,
        [
          p(
            `The signal path is straightforward: the wearable monitor connects to the smartphone by Bluetooth, and the smartphone transmits to the monitoring platform through available cellular or network connectivity. The phone should remain near the patient and powered during the study. The system is designed to reconnect when temporary interruptions occur, but successful transmission still depends on device placement, phone status, network availability, and patient adherence.`
          ),
          flow(
            [
              { t: "Wearable monitor", d: "ECG acquired on the body" },
              { t: "Bluetooth", d: "Monitor connects to the patient&rsquo;s smartphone" },
              { t: "Cellular / network", d: "Phone transmits ECG data to the monitoring platform" },
              { t: "Monitoring platform", d: "Data reviewed; qualifying events communicated per protocol" },
            ],
            "Wearable to phone to cloud transmission path"
          ),
          p(
            `Every Specialized Medical test has LIVE operational visibility, including battery status, electrode contact / signal quality, device communication, and whether the patient appears connected. The MCT distinction is that qualifying clinical findings are also presented during the study according to the prescribed notification protocol. This does not mean every beat is manually watched continuously by one person; ECG information is processed and reviewed within the monitoring workflow. Learn more about <a href="live-ecg-monitoring.html">live ECG monitoring</a> and the <a href="s-patch-cardiac-monitoring-system.html">S-Patch cardiac monitoring system</a>.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "mct-who",
        `Who May Be <span class="landing-h2__accent">Considered for MCT?</span>`,
        [
          p(
            `MCT may be considered when the ordering physician wants a longer monitoring period and live remote rhythm surveillance. Examples may include intermittent palpitations, dizziness, syncope or near-syncope evaluation, suspected paroxysmal arrhythmias, <a href="post-tavr-cardiac-monitoring.html">post-procedure monitoring</a>, or other indications determined by the treating provider.`
          ),
          p(
            `MCT is not promised to detect every arrhythmia or prevent adverse outcomes. Diagnostic yield depends on the patient&rsquo;s rhythm, recording quality, study duration, adherence, and other clinical factors.`
          ),
        ].join("\n")
      ),
      sec(
        "mct-notify",
        `Physician Notification <span class="landing-h2__accent">and Reporting</span>`,
        [
          p(
            `Notifications follow the physician&rsquo;s defined protocol and the practice&rsquo;s communication preferences. An interim notification communicates a qualifying finding while the study is in progress; the final diagnostic report organizes the monitoring findings for physician interpretation and clinical decision-making.`
          ),
          figureImg(
            REPORT_IMG,
            "De-identified MCT report sample showing event summary, rhythm strips, and physician interpretation area",
            "De-identified MCT report layout: event summary, rhythm strips, and physician interpretation area. Electronic review and signature are supported in the portal."
          ),
        ].join("\n"),
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
        a: `A physician may prescribe MCT after a procedure when ongoing rhythm surveillance is clinically appropriate.`,
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
      { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR Cardiac Monitoring" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
    ],
  },

  /* ----------------------- 3. Holter Monitoring ----------------------- */
  {
    id: "holter",
    slug: "holter-monitoring-services",
    file: "holter-monitoring-services.html",
    title: "Holter Monitoring Services | Specialized Medical",
    metaDescription:
      "Holter monitoring records the patient’s ECG continuously for a defined short period, commonly 24 to 48 hours. It is often selected when symptoms occur frequently.",
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
            "(1) LIVE test-status visibility is maintained while the Holter study is in progress, and (2) clinical results are presented After Final Reports Generated."
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
        ].join("\n")
      ),
      sec(
        "holter-report",
        `Holter Analysis and <span class="landing-h2__accent">Final Reporting</span>`,
        [
          p(
            `The ECG recording is processed after the study is complete. The final report may include rhythm overview, heart-rate information, ectopy, pauses, arrhythmia episodes, symptom correlation, representative strips, and other measurements supported by the study and reporting configuration.`
          ),
          p(
            `No specific finding or diagnosis is promised. The physician reviews the report in the context of the patient&rsquo;s history, symptoms, examination, and other testing.`
          ),
          figureImg(
            REPORT_IMG,
            "De-identified Holter final report sample showing rhythm overview and representative ECG strips",
            "De-identified final report sample."
          ),
        ].join("\n"),
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
    metaDescription:
      "Long-Term Holter monitoring extends continuous ambulatory ECG recording beyond the traditional 24- to 48-hour window. Specialized Medical supports 3- to 14-day studies.",
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
      sec(
        "lth-fulldisclosure",
        `Full-Disclosure <span class="landing-h2__accent">ECG Recording</span>`,
        [
          p(
            `Full-disclosure reporting refers to the availability of the recorded ECG data for analysis across the prescribed study, subject to device operation, electrode contact, data quality, and patient adherence. Not every second is clinically interpretable if artifact or signal loss is present.`
          ),
          flow(
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
          figureImg(
            REPORT_IMG,
            "De-identified full-disclosure Long-Term Holter report sample",
            "Full-disclosure report (de-identified sample)."
          ),
        ].join("\n"),
        { muted: true }
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
          `        <ul class="landing-list">
          <li><strong>Loose electrode:</strong> follow the replacement instructions provided with the study or contact support</li>
          <li><strong>Temporary signal loss:</strong> the system is designed to resume recording; contact support if the device indicates a problem</li>
          <li><strong>Skin irritation:</strong> contact the practice or support team for guidance; sensitive-skin options may be available</li>
          <li><strong>Uncertainty about device status:</strong> contact the support number supplied with the study</li>
        </ul>`,
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
    metaDescription:
      "Cardiac event monitoring is designed to capture ECG information associated with intermittent symptoms or automatically detected rhythm events over an extended period.",
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
          emergencyBox(),
        ].join("\n")
      ),
      sec(
        "event-reporting",
        `Reporting and Physician <span class="landing-h2__accent">Communication</span>`,
        [
          p(
            `Event reports and notifications are handled according to the prescribed monitoring protocol. Routine event documentation is distinct from findings that meet the physician&rsquo;s notification criteria.`
          ),
          figureImg(
            REPORT_IMG,
            "De-identified cardiac event report example showing symptom, time, rhythm description, representative strip, and communication status",
            "De-identified event report example: symptom, time, rhythm description, representative strip, and communication status."
          ),
        ].join("\n"),
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
    metaDescription:
      "Ambulatory cardiac monitoring records the heart’s electrical activity while the patient continues normal daily life outside the clinic or hospital. Compare all four test types.",
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
    metaDescription:
      "The S-Patch cardiac monitoring system is Specialized Medical’s primary wearable platform for ambulatory ECG monitoring, with a compact two-component design.",
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
      sec(
        "spatch-overview",
        `S-Patch System <span class="landing-h2__accent">Overview</span>`,
        [
          p(
            `The S-Patch uses a two-disk wearable configuration worn on the chest with a connected phone. Current internal specifications indicate Disk 1 is approximately 1.57 inches in diameter by 0.40 inches thick and Disk 2 is approximately 1.41 inches in diameter by 0.24 inches thick. All technical specifications are verified before publication.`
          ),
          p(
            `Exact battery performance depends on configuration and use. Specific battery-life durations are published only for validated and released product configurations.`
          ),
          `        <div class="landing-media-pair">
${figureImg(SPATCH_IMG, "S-Patch two-disk wearable cardiac monitor, front product view", "S-Patch product view.")}
${figureImg("images/landing/s-patch-cardiac-monitoring-system.webp", "S-Patch wearable cardiac monitor worn on a patient&rsquo;s chest", "S-Patch as worn on the chest.")}
        </div>`,
        ].join("\n")
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
      sec(
        "spatch-leadwire",
        `S-Patch and <span class="landing-h2__accent">Lead-Wire Options</span>`,
        [
          p(
            `The S-Patch is the primary wearable option, and a lead-wire system is available as an alternative when a different configuration is needed. Both are supported service configurations &mdash; neither is disparaged. Differences in channels, wear style, battery routines, patient comfort considerations, and use cases are compared only with verified specifications during program setup.`
          ),
          `        <div class="landing-media-pair">
${figureImg(SPATCH_IMG, "S-Patch primary wearable cardiac monitoring option", "S-Patch &mdash; primary wearable option.")}
${figureImg(LEADWIRE_IMG, "Lead-wire cardiac monitoring system alternative configuration", "Lead-wire system &mdash; alternative configuration.")}
        </div>`,
        ].join("\n")
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
    ],
  },

  /* ------------------------- 8. Live ECG Monitoring ------------------------- */
  {
    id: "live",
    slug: "live-ecg-monitoring",
    file: "live-ecg-monitoring.html",
    title: "Live ECG Monitoring | Specialized Medical",
    metaDescription:
      "Live ECG monitoring allows rhythm data to be transmitted from a wearable monitor during the prescribed ambulatory study, with qualifying events reviewed per protocol.",
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
              { t: "Bluetooth", d: "Monitor connects to the patient&rsquo;s phone" },
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
            `Every modality has LIVE operational visibility during the test. <a href="mobile-cardiac-telemetry-mct.html">MCT</a> and Event Monitoring present qualifying clinical findings during the test according to protocol, while <a href="holter-monitoring-services.html">Holter</a> and <a href="long-term-holter-monitoring.html">Long-Term Holter</a> clinical results are presented After Final Reports Generated. Each modality has an appropriate role &mdash; the ordering physician selects based on the clinical question.`
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
        a: `A physician may prescribe it after discharge when ambulatory rhythm surveillance is appropriate.`,
      },
    ],
    links: [
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "post-tavr-cardiac-monitoring.html", label: "Post-TAVR Cardiac Monitoring" },
      { href: "holter-monitoring-services.html", label: "Holter Monitoring Services" },
      { href: "long-term-holter-monitoring.html", label: "Long-Term Holter Monitoring" },
      { href: "s-patch-cardiac-monitoring-system.html", label: "S-Patch Cardiac Monitoring System" },
    ],
  },

  /* ---------------------- 9. Post-TAVR Cardiac Monitoring ---------------------- */
  {
    id: "tavr",
    slug: "post-tavr-cardiac-monitoring",
    file: "post-tavr-cardiac-monitoring.html",
    title: "Post-TAVR Cardiac Monitoring | Specialized Medical",
    metaDescription:
      "Post-TAVR cardiac monitoring supports rhythm surveillance after transcatheter aortic valve replacement when the treating team determines monitoring is appropriate.",
    serviceName: "Post-TAVR Cardiac Monitoring",
    pill: "Post-TAVR Cardiac Monitoring",
    h1Html: `Post-TAVR Cardiac <span class="landing-hero__title-accent">Monitoring</span>`,
    directAnswer:
      "Post-TAVR cardiac monitoring supports rhythm surveillance after transcatheter aortic valve replacement when the treating team determines that ambulatory monitoring is appropriate. The goal is to extend observation beyond the hospital stay and provide organized rhythm information to the treating physician during the prescribed post-discharge period. Specialized Medical can support live mobile cardiac telemetry and practice-specific workflows for post-TAVR patients.",
    ctaLabel: "Request a Post-TAVR Monitoring Workflow Review",
    interestDefault: "Post-TAVR monitoring program",
    schemaTypes: ["MedicalWebPage", "Service", "BreadcrumbList", "FAQPage"],
    emergency: true,
    body: [
      sec(
        "tavr-why",
        `Why Rhythm Surveillance May <span class="landing-h2__accent">Continue After TAVR</span>`,
        [
          p(
            `Conduction disturbances and arrhythmias may occur after TAVR, and clinical teams may prescribe ambulatory monitoring based on the patient&rsquo;s procedural findings, ECG changes, symptoms, risk factors, and institutional protocol. Specific incidence rates, guideline classes, and timing recommendations are not published here; monitoring decisions rest with the treating team.`
          ),
        ].join("\n")
      ),
      sec(
        "tavr-workflow",
        `A Practical Post-Discharge <span class="landing-h2__accent">Monitoring Workflow</span>`,
        [
          flow(
            [
              { t: "Patient identified", d: "Before discharge, per program protocol" },
              { t: "Device applied", d: "Patient trained before leaving the hospital" },
              { t: "Monitoring begins", d: "LIVE test-status visibility during the study" },
              { t: "Data transmitted", d: "When live monitoring is prescribed" },
              { t: "Qualifying findings communicated", d: "According to the configured protocol" },
              { t: "Final report delivered", d: "For physician review and interpretation" },
            ],
            "Post-TAVR post-discharge monitoring workflow"
          ),
          p(
            `Programs may establish a pre-procedure or pre-discharge rhythm baseline when that is part of the program. Not every patient requires the same pathway &mdash; the treating team defines it. The underlying technology is described on the <a href="mobile-cardiac-telemetry-mct.html">MCT</a> and <a href="live-ecg-monitoring.html">Live ECG Monitoring</a> pages.`
          ),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "tavr-criteria",
        `Physician-Defined <span class="landing-h2__accent">Notification Criteria</span>`,
        [
          p(
            `The structural heart or cardiology team defines the communication criteria, contact hierarchy, after-hours pathway, and documentation expectations. Specialized Medical follows the configured protocol rather than using one universal threshold for every program.`
          ),
          `        <div class="landing-proto" role="group" aria-label="Sample notification protocol template (non-clinical)">
          <p class="landing-note__title">Sample notification protocol template (non-clinical illustration)</p>
          <div class="landing-proto__grid">
            <span>Rhythm type</span><span>Rate</span><span>Duration</span><span>Symptoms</span>
            <span>Time of day</span><span>First contact</span><span>Backup contact</span><span>Documentation</span>
          </div>
        </div>`,
        ].join("\n")
      ),
      sec(
        "tavr-home",
        `Supporting the <span class="landing-h2__accent">Patient at Home</span>`,
        [
          p(
            `Post-discharge patients need simple instructions: keep the phone charged and nearby, maintain electrode contact, record symptoms, answer monitoring calls, and seek emergency care for urgent symptoms.`
          ),
          `        <div class="landing-checklist" role="group" aria-label="Pre-discharge caregiver and patient checklist">
          <p class="landing-note__title">Caregiver / patient checklist (review before discharge)</p>
          <ul class="landing-list">
            <li>Phone charged, powered on, and kept near the patient</li>
            <li>Electrode contact checked per instructions</li>
            <li>Symptom recording method understood</li>
            <li>Support number saved and monitoring calls answered</li>
            <li>Emergency plan understood: call 911 for urgent symptoms</li>
          </ul>
        </div>`,
          emergencyBox(),
        ].join("\n"),
        { muted: true }
      ),
      sec(
        "tavr-quality",
        `Program Reporting and <span class="landing-h2__accent">Quality Improvement</span>`,
        [
          p(
            `Reports can support physician review and internal program evaluation. Potential program metrics may include enrollment completion, wear duration, transmission continuity, notification documentation, final-report turnaround, and follow-up completion. Outcome improvements are not claimed unless measured and substantiated.`
          ),
          figureImg(
            REPORT_IMG,
            "De-identified post-TAVR ambulatory monitoring report example for physician review",
            "De-identified post-TAVR report example."
          ),
        ].join("\n")
      ),
    ].join("\n\n"),
    faqs: [
      {
        q: "What is post-TAVR cardiac monitoring?",
        a: `It is ambulatory rhythm monitoring prescribed after transcatheter aortic valve replacement to extend rhythm surveillance beyond the hospital stay.`,
      },
      {
        q: "Does every TAVR patient need ambulatory monitoring?",
        a: `No. The treating team determines whether monitoring is appropriate based on the patient and the program protocol.`,
      },
      {
        q: "What type of monitor may be used after TAVR?",
        a: `A physician may prescribe MCT or another ambulatory monitoring modality depending on the clinical objective.`,
      },
      {
        q: "How soon does monitoring begin?",
        a: `The clinical team determines timing. Some programs initiate monitoring before or at discharge.`,
      },
      {
        q: "What findings are communicated?",
        a: `Communication follows the physician-defined notification criteria and contact protocol.`,
      },
      {
        q: "Is the monitor a substitute for emergency care?",
        a: `No. Patients with urgent symptoms should call 911 or follow the discharge team&rsquo;s emergency instructions.`,
      },
      {
        q: "Can caregivers help manage the monitor?",
        a: `Yes. Caregivers can help keep the phone charged, maintain proximity, follow device-care instructions, and respond to support calls.`,
      },
      {
        q: "How long is monitoring continued?",
        a: `The prescribing team determines the duration based on the patient and program protocol.`,
      },
      {
        q: "What happens at the end of the study?",
        a: `The data are finalized and a report is prepared for physician review and interpretation.`,
      },
      {
        q: "Can Specialized Medical support a hospital-wide TAVR workflow?",
        a: `The implementation can be configured around discharge, contact, notification, reporting, and follow-up responsibilities across the program.`,
      },
    ],
    links: [
      { href: "mobile-cardiac-telemetry-mct.html", label: "Mobile Cardiac Telemetry (MCT)" },
      { href: "live-ecg-monitoring.html", label: "Live ECG Monitoring" },
      { href: "cardiac-monitoring-services.html", label: "Cardiac Monitoring Services" },
      { href: "cardiology-practice-cardiac-monitoring.html", label: "Cardiac Monitoring for Cardiology Practices" },
    ],
  },

  /* ------------- 10. Cardiac Monitoring for Cardiology Practices ------------- */
  {
    id: "practice",
    slug: "cardiology-practice-cardiac-monitoring",
    file: "cardiology-practice-cardiac-monitoring.html",
    title: "Cardiac Monitoring for Cardiology Practices | Specialized Medical",
    metaDescription:
      "Specialized Medical provides cardiology practices with more than a monitor: a complete operational program for enrollment, monitoring, reporting, and physician review.",
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
      sec(
        "practice-reporting",
        `Reporting and Physician <span class="landing-h2__accent">Electronic Signature</span>`,
        [
          p(
            `Physician-ready reports can be reviewed through the portal and electronically signed. Dictation or staff-assisted entry may be used where configured, while the physician retains responsibility for the final interpretation and signature.`
          ),
          flow(
            [
              { t: "Report ready", d: "Completed study appears in the portal" },
              { t: "Physician review", d: "Findings and strips reviewed" },
              { t: "Interpretation", d: "Entered directly or via configured assistance" },
              { t: "E-signature", d: "Report signed electronically and routed" },
            ],
            "Physician report review and e-signature steps"
          ),
          figureImg(
            REPORT_IMG,
            "De-identified portal report view showing physician review and electronic signature workflow",
            "Portal report review and e-signature (de-identified)."
          ),
        ].join("\n")
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
