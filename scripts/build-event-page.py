"""Build cardiac-event-monitoring.html from the Nov 20, 2026 Event Monitoring SEO/AEO brief.

Run from the repo root:   python3 scripts/build-event-page.py && npm run cache-bust

The shared <head> base script, footer and scripts are copied from
post-tavr-cardiac-monitoring.html so all landing pages stay in sync.
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.specialized-med.com/"
PAGE = "cardiac-event-monitoring.html"
CANON = SITE + PAGE
TITLE = "Cardiac Event Monitoring (1-30 Days) | Specialized Medical"
DESC = ("Cardiac event monitoring for up to 30 days, with symptom logging, live test-status visibility when "
        "connected, and physician-directed reporting.")
H1 = "Cardiac Event Monitoring for Physician Practices"
CTA = "Request an Event Monitoring Demo"
ALT = ("Young adult woman holding an assigned phone while wearing a two-component S-Patch cardiac event "
       "monitor at home.")
IMG = "cardiac-event-monitoring-hero"
IMG_URL = SITE + "images/landing/" + IMG + ".jpg"
DEMO = PAGE + "#request-event-demo"
UPDATED_TEXT = "November 23, 2026"

ISHNE = "https://pmc.ncbi.nlm.nih.gov/articles/PMC6931745/"
AHA = ("https://www.heart.org/en/health-topics/arrhythmia/symptoms-diagnosis--monitoring-of-arrhythmia/"
       "cardiac-event-recorder")


def cite(*nums):
    urls = {1: ISHNE, 2: AHA}
    return "".join(f'<sup class="landing-cite"><a href="{urls[n]}" target="_blank" rel="noopener noreferrer">'
                   f'[{n}]</a></sup>' for n in nums)


def demo_link(placement, cls="figma-btn figma-btn--solid", label=CTA):
    return (f'<a class="{cls}" href="{DEMO}" data-mct-track="event_demo_cta_click" '
            f'data-track-placement="{placement}">{label}</a>')


def phone_link(placement, cls, label):
    return (f'<a class="{cls}" href="tel:+18557732633" data-mct-track="phone_click" '
            f'data-track-placement="{placement}">{label}</a>')


FAQS = [
    ("What is a cardiac event monitor?",
     "It is an ambulatory ECG system used to capture rhythm information during intermittent symptoms or selected "
     "automatically detected events. The physician uses the recorded ECG and symptom context to evaluate the "
     "clinical question." + cite(1, 2)),
    ("How long is Event Monitoring prescribed?",
     "Specialized Medical supports prescribed Event Monitoring studies of up to 30 days. The ordering clinician "
     "chooses the duration; patients should follow that prescription rather than assume every study lasts a full "
     "month."),
    ("When might Event Monitoring help more than a short Holter?",
     "A longer event-monitoring window may be useful when relevant symptoms are not expected within 24-48 hours. "
     "Symptom frequency, the clinical question and the patient's ability to use the system guide the physician's "
     "choice." + cite(1, 2)),
    ("Is Event Monitoring the same as MCT?",
     "No. Event Monitoring emphasizes event capture and symptom correlation. MCT is a different service involving "
     "concurrent computerized analysis and attended surveillance. Both can present qualifying findings during "
     "testing, but the prescribed review and notification workflows differ." + cite(1)),
    ("Does the patient need to press a symptom button?",
     "Patients should use Log Symptoms on the assigned phone as instructed. Automatic detection may capture selected "
     "events when enabled, but it does not replace symptom logging or ensure that every episode will be captured."),
    ("Can events be captured without symptoms?",
     "Selected rhythm events can be captured automatically when that feature is enabled in the prescribed "
     "configuration. The physician interprets their significance. Automatic capture does not mean all asymptomatic "
     "arrhythmias will be identified." + cite(1)),
    ("Does the patient need a personal smartphone?",
     "The connected Specialized Medical workflow uses an assigned, preconfigured phone. Its two patient screens are "
     "Device Status and Log Symptoms. The practice explains how to keep that phone with the monitor during the "
     "study."),
    ("What happens if the monitor or phone loses connection?",
     "Loss of connectivity can interrupt live transmission and visibility. Specialized Medical can identify "
     "technical-status problems and help the patient troubleshoot. Patients should follow the supplied instructions "
     "and contact support; available study data depend on the equipment and circumstances."),
    ("Will the practice receive a notification for every event?",
     "No. Qualifying findings are communicated according to the physician's notification criteria and agreed contact "
     "pathway. Routine event documentation and a finding requiring clinical notification are different parts of the "
     "workflow."),
    ("What appears in the final report?",
     "The report organizes captured ECG findings, representative strips and available symptom correlations. Digital "
     "symptom entries provide context alongside the corresponding ECG information. The ordering physician reviews, "
     "interprets and signs the report through the portal workflow."),
    ("Does the practice have to purchase monitoring equipment?",
     "No capital equipment purchase is required for the program. Specialized Medical provides equipment, supplies and "
     "support under the practice agreement. Per-test fees and any other applicable contractual charges remain "
     "separate from equipment purchase."),
    ("What should the patient do during urgent symptoms?",
     "Call 911 for urgent symptoms such as chest pain, severe shortness of breath, fainting or stroke symptoms. Do not "
     "wait for a monitoring call or rely on a symptom entry to obtain emergency assistance."),
]

COMPARE = [
    ("holter-monitoring-services.html", "24–48 Hour Holter Monitoring", "24–48 hours",
     "Continuous ECG recording", "After the final report is generated"),
    ("long-term-holter-monitoring.html", "Extended Holter Through 7 Days", "More than 48 hours through 7 days",
     "Longer continuous ECG recording", "After the final report is generated"),
    ("extended-holter-monitoring-8-14-days.html", "8–14 Day Extended Holter", "8–14 days",
     "Longer continuous ECG recording", "After the final report is generated"),
    (PAGE, "Cardiac Event Monitoring", "Up to 30 days",
     "Patient-triggered and selected automatic events, when enabled",
     "Qualifying findings during the study per protocol; final report"),
    ("mobile-cardiac-telemetry-mct.html", "Mobile Cardiac Telemetry (MCT)", "Up to 30 days",
     "Concurrent computerized analysis and attended surveillance",
     "Qualifying findings during the study per protocol; final report"),
]

INTEREST = ["Cardiac Event Monitoring", "24–48 Hour Holter", "Extended Holter Through 7 Days",
            "8–14 Day Extended Holter", "Mobile Cardiac Telemetry (MCT)", "Multiple test types / full program"]

CHEVRON = ('<svg class="faq-item__chevron{c}" width="20" height="20" viewBox="0 0 24 24" fill="none" '
           'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" '
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def jsonld():
    org = {"@id": SITE + "#organization"}
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "Organization", "@id": SITE + "#organization", "name": "Specialized Medical, LLC",
             "url": SITE, "telephone": "+1-855-773-2633",
             "logo": SITE + "images/figma-assets/brand-logo.webp"},
            {"@type": "WebSite", "@id": SITE + "#website", "url": SITE, "name": "Specialized Medical",
             "publisher": org, "inLanguage": "en-US"},
            {"@type": "Person", "@id": CANON + "#author", "name": "Steven M. Burns", "jobTitle": "President & CEO",
             "worksFor": org},
            {"@type": "ImageObject", "@id": CANON + "#primaryimage", "url": IMG_URL, "contentUrl": IMG_URL,
             "name": "Cardiac event monitoring", "width": 1920, "height": 900, "caption": ALT},
            {"@type": "MedicalWebPage", "@id": CANON + "#webpage", "url": CANON, "name": TITLE, "headline": H1,
             "description": DESC, "inLanguage": "en-US", "isPartOf": {"@id": SITE + "#website"},
             "publisher": org, "author": {"@id": CANON + "#author"},
             "mainEntity": {"@id": CANON + "#service"}, "primaryImageOfPage": {"@id": CANON + "#primaryimage"},
             "breadcrumb": {"@id": CANON + "#breadcrumb"}},
            {"@type": "Service", "@id": CANON + "#service", "name": "Cardiac Event Monitoring",
             "serviceType": "Ambulatory cardiac event monitoring", "url": CANON, "provider": org,
             "areaServed": {"@type": "Country", "name": "United States"},
             "description": "Cardiac event monitoring for up to 30 days, as prescribed. Connected studies support "
                            "symptom logging and live test-status visibility. Qualifying clinical findings are "
                            "communicated during the study under the prescribed notification protocol, with a final "
                            "report for physician review.",
             "image": {"@id": CANON + "#primaryimage"}, "mainEntityOfPage": {"@id": CANON + "#webpage"}},
            {"@type": "BreadcrumbList", "@id": CANON + "#breadcrumb", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE},
                {"@type": "ListItem", "position": 2, "name": "Cardiac Monitoring Services",
                 "item": SITE + "cardiac-monitoring-services.html"},
                {"@type": "ListItem", "position": 3, "name": "Cardiac Event Monitoring", "item": CANON}]},
        ],
    }
    return json.dumps(graph, indent=2, ensure_ascii=False)


def body():
    e = html.escape

    rows = []
    for href, name, window, focus, findings in COMPARE:
        if href == PAGE:
            tr, th = ('<tr aria-current="page">',
                      f'<th scope="row">{name}<span class="landing-table__current">(this page)</span></th>')
        else:
            tr, th = "<tr>", f'<th scope="row"><a href="{href}">{name}</a></th>'
        rows.append(f"""              {tr}
                {th}
                <td data-label="Prescribed window">{window}</td>
                <td data-label="Focus">{focus}</td>
                <td data-label="Clinical findings">{findings}</td>
              </tr>""")

    faq_items = []
    for i, (q, a) in enumerate(FAQS):
        first = i == 0
        faq_items.append(f"""<div class="faq-item{' is-open' if first else ''}">
      <button type="button" id="faq-trigger-event-{i}" class="faq-item__trigger" aria-expanded="{'true' if first else 'false'}" aria-controls="faq-panel-event-{i}">
        <span class="faq-item__q">{i + 1}. {e(q, quote=False)}</span>
        {CHEVRON.format(c=' is-open' if first else '')}
      </button>
      <div id="faq-panel-event-{i}" role="region" aria-labelledby="faq-trigger-event-{i}" class="faq-item__panel"{'' if first else ' hidden'}>
        <p>{a}</p>
      </div>
    </div>""")

    options = "\n".join(f'                  <option value="{e(o)}"{" selected" if i == 0 else ""}>{e(o)}</option>'
                        for i, o in enumerate(INTEREST))

    webp = (f"/images/landing/{IMG}-960.webp 960w, /images/landing/{IMG}-1280.webp 1280w, "
            f"/images/landing/{IMG}.webp 1920w")
    jpg = (f"/images/landing/{IMG}-960.jpg 960w, /images/landing/{IMG}-1280.jpg 1280w, "
           f"/images/landing/{IMG}.jpg 1920w")
    sizes = "(min-width: 1462px) 1430px, calc(100vw - 32px)"

    return f"""  <script type="application/ld+json">
{jsonld()}
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{TITLE}</title>
  <meta name="description" content="{e(DESC)}">
  <meta property="og:site_name" content="Specialized Medical">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{e(TITLE)}">
  <meta property="og:description" content="{e(DESC)}">
  <meta property="og:url" content="{CANON}">
  <meta property="og:image" content="{IMG_URL}">
  <meta property="og:image:width" content="1920">
  <meta property="og:image:height" content="900">
  <meta property="og:image:alt" content="{e(ALT)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(TITLE)}">
  <meta name="twitter:description" content="{e(DESC)}">
  <meta name="twitter:image" content="{IMG_URL}">
  <meta name="twitter:image:alt" content="{e(ALT)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="preload" as="image" type="image/webp" href="/images/landing/{IMG}-960.webp" imagesrcset="{webp}" imagesizes="{sizes}" fetchpriority="high">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="/css/global.css">
  <link rel="stylesheet" href="/css/chrome.css">
  <link rel="stylesheet" href="/css/landing-mct.css">
  <link rel="stylesheet" href="/css/faq.css">
  <link rel="stylesheet" href="/css/landing-event.css">
  <link rel="canonical" href="{CANON}">
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
  <a class="skip-link" href="{PAGE}#main-content">Skip to content</a>
  <div class="site-root">
    <header class="site-header site-header--figma">
      <div class="figma-container figma-header__inner site-header__inner">
        <a href="./" class="figma-brand" aria-label="Specialized Medical home">
          <img class="figma-brand__mark" src="/images/figma-assets/brand-logo-472.webp" alt="Specialized Medical" width="236" fetchpriority="low" height="52" decoding="async">
        </a>
        <button type="button" class="nav-toggle nav-toggle--figma" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
          <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
        <button type="button" class="nav-overlay" aria-label="Close menu" hidden></button>
        <nav id="primary-nav" class="figma-nav" aria-label="Primary">
          <a class="figma-nav__link" href="./">Home</a>
          <a class="figma-nav__link" href="about.html">About Us</a>
          <a class="figma-nav__link is-active" href="services.html">Services</a>
          <a class="figma-nav__link" href="faq.html">FAQs</a>
          <a class="figma-nav__link" href="contact.html">Contact</a>
          <div class="figma-nav__mobile">
            {phone_link("mobile_nav", "figma-nav__phone", "Call: 1-855-773-2633")}
            <div class="figma-nav__actions">
              {demo_link("mobile_nav", "figma-btn figma-btn--outline-dark", "Request an Event Demo")}
              <a class="figma-btn figma-btn--solid" href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click" target="_blank" rel="noopener noreferrer">Physician Portal</a>
            </div>
          </div>
        </nav>
        <div class="figma-header__cta">
          <a class="figma-phone" href="tel:+18557732633" data-mct-track="phone_click" data-track-placement="header">
            <img class="figma-phone__icon" src="/icons/vector3527-jgyk.svg" alt="" width="14" height="14" decoding="async">
            <span class="figma-phone__num">1-855-773-2633</span>
          </a>
          {demo_link("header", "figma-btn figma-btn--outline-dark figma-btn--event-demo", "Request an Event Demo")}
          <a class="figma-header__portal" href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click" target="_blank" rel="noopener noreferrer">Physician Portal</a>
        </div>
      </div>
    </header>

    <main class="landing-page landing-page--event services-page services-page--figma" data-landing="cardiac-event-monitoring" data-service-id="event_monitoring" id="main-content" tabindex="-1">
    <nav class="landing-breadcrumb" aria-label="Breadcrumb">
      <div class="figma-container">
        <ol class="landing-breadcrumb__list">
          <li><a href="./">Home</a></li>
          <li><a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a></li>
          <li><span aria-current="page">Cardiac Event Monitoring</span></li>
        </ol>
      </div>
    </nav>

    <!-- 01 Hero -->
    <section class="landing-hero" aria-labelledby="event-hero-heading">
      <div class="landing-hero__plate landing-hero__plate--event">
        <picture>
          <source
            type="image/webp"
            srcset="{webp}"
            sizes="{sizes}">
          <img
            class="landing-hero__media"
            src="/images/landing/{IMG}-960.jpg"
            srcset="{jpg}"
            sizes="{sizes}"
            width="1920"
            height="900"
            alt="{e(ALT)}"
            loading="eager"
            decoding="async"
            fetchpriority="high">
        </picture>
        <div class="landing-hero__gradient" aria-hidden="true"></div>
        <div class="landing-hero__inner figma-container">
          <p class="figma-hero__pill">
            <span class="figma-hero__pill-dot" aria-hidden="true"></span>
            INTERMITTENT SYMPTOMS | LIVE TEST STATUS | PHYSICIAN-DIRECTED NOTIFICATIONS
          </p>
          <h1 id="event-hero-heading" class="landing-hero__title">Cardiac Event Monitoring for <span class="landing-hero__title-accent">Physician Practices</span></h1>
          <p class="landing-hero__lead landing-answer">Cardiac event monitoring captures ECG information associated with intermittent symptoms or selected automatically detected rhythm events over a prescribed period of up to 30 days. It helps the ordering clinician evaluate symptoms that may not occur during a short Holter study.{cite(1, 2)}</p>
          <p class="landing-hero__lead">Specialized Medical combines connected monitoring, a simple patient symptom logger, LIVE technical-status visibility and patient support. Qualifying findings are presented during the study according to the ordering physician&rsquo;s notification protocol, followed by a physician-ready final report.</p>
          <div class="landing-hero__actions">
            {demo_link("hero")}
            {phone_link("hero", "figma-btn figma-btn--outline-dark", "Call 1-855-773-2633")}
          </div>
        </div>
      </div>
    </section>

    <!-- 02 Program benefits -->
    <section class="landing-section landing-section--muted" aria-labelledby="event-program-heading">
      <div class="figma-container">
        <h2 id="event-program-heading" class="landing-h2">A Complete Event Monitoring Program for <span class="landing-h2__accent">Your Practice</span></h2>
        <div class="landing-feature-grid landing-benefits" role="list">
          <article class="landing-feature-card" role="listitem">
            <h3 class="landing-h3">Symptoms with ECG context</h3>
            <p class="landing-p">Digital symptom entries are matched with corresponding ECG information, helping the clinician distinguish symptomatic from asymptomatic findings.</p>
          </article>
          <article class="landing-feature-card" role="listitem">
            <h3 class="landing-h3">Support while the study is active</h3>
            <p class="landing-p">LIVE visibility into battery, electrode contact and connectivity helps our team identify technical problems and assist the patient during wear.</p>
          </article>
          <article class="landing-feature-card" role="listitem">
            <h3 class="landing-h3">Equipment and workflow included</h3>
            <p class="landing-p">Monitoring equipment, patient supplies, enrollment support and reporting are provided without a capital equipment purchase.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 03 Clinical purpose -->
    <section class="landing-section" aria-labelledby="event-when-heading">
      <div class="figma-container">
        <h2 id="event-when-heading" class="landing-h2">When May a Physician Choose <span class="landing-h2__accent">Event Monitoring?</span></h2>
        <p class="landing-p landing-answer">Event monitoring may help when palpitations, dizziness or other episodes suggest a possible rhythm problem but are not expected to occur during a one- or two-day recording. The physician considers symptom frequency, the clinical question and the patient&rsquo;s ability to use the prescribed system.{cite(1, 2)}</p>
        <p class="landing-p">The monitoring period is selected for the individual patient. Up to 30 days creates a longer opportunity to capture relevant events; it is not a requirement that every patient complete 30 days.</p>
        <ul class="landing-list">
          <li>Intermittent symptoms that may fall outside a <a href="holter-monitoring-services.html">24&ndash;48-hour Holter</a> window.</li>
          <li>A need to compare reported symptom times with available ECG information.</li>
          <li>Selected automatically detected events when that capability is enabled in the prescribed configuration.</li>
        </ul>
      </div>
    </section>

    <!-- 04 How it works -->
    <section class="landing-section landing-section--muted" aria-labelledby="event-how-heading">
      <div class="figma-container">
        <h2 id="event-how-heading" class="landing-h2">How Event Monitoring Works &ndash; and <span class="landing-h2__accent">How It Differs</span></h2>
        <p class="landing-p landing-answer">The patient wears the prescribed monitor and uses the assigned phone to record symptoms. Patient-marked events and selected automatically detected events, when enabled, enter the Event Monitoring review and communication workflow.</p>
        <ol class="landing-flow landing-flow--event" aria-label="Four-step Event Monitoring process">
          <li class="landing-flow__step"><strong>Prescribe</strong><span>Prescribe the study and agree on notification criteria.</span></li>
          <li class="landing-flow__step"><strong>Set up</strong><span>Set up the monitor and assigned phone; teach symptom logging.</span></li>
          <li class="landing-flow__step"><strong>Capture and review</strong><span>Capture and review events under the prescribed workflow.</span></li>
          <li class="landing-flow__step"><strong>Findings and final report</strong><span>Present qualifying findings during the study and deliver the final report.</span></li>
        </ol>
        <p class="landing-p">Event Monitoring focuses on event capture and symptom correlation. Holter and Long-Term Holter provide continuous recording with clinical findings presented after the final report. <a href="mobile-cardiac-telemetry-mct.html">MCT</a> adds a distinct service involving concurrent computerized rhythm analysis and attended surveillance. The ordering physician selects the service that fits the clinical need.{cite(1)}</p>
        <p class="landing-p">Using a connected monitor does not make every test MCT. The prescribed service determines which findings are reviewed, how they are presented and when the practice is contacted. All prescribed services are described on <a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a>.</p>
      </div>
    </section>

    <!-- 05 Symptoms and automatic events -->
    <section class="landing-section" aria-labelledby="event-symptoms-heading">
      <div class="figma-container">
        <h2 id="event-symptoms-heading" class="landing-h2">Patient-Marked Symptoms and <span class="landing-h2__accent">Automatic Events</span></h2>
        <p class="landing-p landing-answer">Patient-triggered entries add the patient&rsquo;s experience to the ECG record. The patient uses Log Symptoms on the assigned phone, following the study instructions. The recorded time helps the clinician compare symptoms with the available ECG.</p>
        <p class="landing-p">Automatic detection, when enabled, can capture selected rhythm events without a patient entry. It complements symptom logging; it does not capture every possible event or replace the patient&rsquo;s instructions.{cite(1)}</p>
        <p class="landing-p">Symptoms do not always correspond to an arrhythmia. A symptom entry alongside the recorded rhythm can still help the physician evaluate the episode.{cite(1)}</p>
      </div>
    </section>

    <!-- 06 LIVE test status -->
    <section class="landing-section landing-section--muted" aria-labelledby="event-live-heading">
      <div class="figma-container">
        <h2 id="event-live-heading" class="landing-h2">LIVE Test-Status Visibility and Help <span class="landing-h2__accent">During Wear</span></h2>
        <p class="landing-p landing-answer">Specialized Medical can follow the technical condition of a connected study: battery status, electrode contact, signal quality, Bluetooth communication, cellular connectivity and whether ECG data is being received. When an issue is identified, our team can contact the patient to help restore the study.</p>
        <p class="landing-p">The <a href="s-patch-cardiac-monitoring-system.html">S-Patch cardiac monitoring system</a> communicates with the assigned phone by Bluetooth. The phone transmits through available cellular service, using the program&rsquo;s multi-carrier connectivity approach. Live visibility and transmission depend on connectivity at the patient&rsquo;s location.</p>
        <div class="landing-phone-screens" role="list">
          <article class="landing-feature-card" role="listitem">
            <h3 class="landing-h3">Device Status</h3>
            <p class="landing-p">Keeps connection information visible on the assigned, preconfigured phone.</p>
          </article>
          <article class="landing-feature-card" role="listitem">
            <h3 class="landing-h3">Log Symptoms</h3>
            <p class="landing-p">Lets the patient record a symptom so its time can be compared with the ECG.</p>
          </article>
        </div>
        <p class="landing-p">The patient phone has two essential screens: Device Status and Log Symptoms. It is preconfigured for the study, keeping connection information and symptom entry accessible without unrelated smartphone functions. If it is misplaced, support can help locate or ring it when it is powered on and connected.</p>
        <p class="landing-p">Technical-status support is distinct from clinical notification. Event findings that meet the physician&rsquo;s criteria are presented according to the prescribed protocol. Device specifications are on the <a href="services/equipment.html">cardiac monitoring equipment options</a> page.</p>
      </div>
    </section>

    <!-- 07 Turnkey program -->
    <section class="landing-section" aria-labelledby="event-turnkey-heading">
      <div class="figma-container">
        <h2 id="event-turnkey-heading" class="landing-h2">A Turnkey Program for <span class="landing-h2__accent">Staff and Patients</span></h2>
        <p class="landing-p landing-answer">Your practice uses the established Hook Up &gt; Enroll &gt; Disconnect workflow. Patients can be pre-enrolled before their appointment, allowing staff to prepare the record and focus the visit on the prescribed setup and patient education.</p>
        <p class="landing-p">Specialized Medical supplies the monitoring equipment and patient supplies, helps staff implement the program, and provides 24/7 patient and technical support. The patient learns how to carry the assigned phone, log symptoms and reach support using the instructions supplied with the study.</p>
        <p class="landing-p">Practices also receive physician-ready reports, portal review and electronic signature capabilities, plus billing templates and administrative support for the practice&rsquo;s global billing workflow. See how this fits into <a href="cardiology-practice-cardiac-monitoring.html">cardiac monitoring for cardiology practices</a>.</p>
        <div class="landing-note landing-note--info" role="note">
          <p class="landing-note__body">No capital equipment purchase is required. Per-test fees and other applicable charges follow the practice agreement.</p>
        </div>
      </div>
    </section>

    <!-- 08 Findings and report -->
    <section class="landing-section landing-section--muted" aria-labelledby="event-findings-heading">
      <div class="figma-container">
        <h2 id="event-findings-heading" class="landing-h2">Findings During the Study. <span class="landing-h2__accent">A Clear Final Report.</span></h2>
        <p class="landing-p landing-answer">Qualifying Event Monitoring findings are presented while the study is active according to the ordering physician&rsquo;s notification protocol. The protocol sets the criteria, recipients and communication methods, which may include email, text and phone. Routine event documentation does not necessarily trigger a clinical notification.</p>
        <p class="landing-p">Digital symptoms appear with the corresponding ECG information so the physician can see the reported symptom context. The final report organizes captured findings, representative ECG strips and available symptom correlations for review, interpretation and signature.</p>
        <p class="landing-p">Delivery timing depends on the protocol, signal quality and connectivity. The treating clinician interprets the findings and determines the next step.</p>
        <!-- Optional report example (brief s.5): only a genuine, approved, de-identified Specialized Medical Event report. -->
      </div>
    </section>

    <!-- 09 Comparison -->
    <section class="landing-section" id="compare-event" aria-labelledby="event-compare-heading">
      <div class="figma-container">
        <h2 id="event-compare-heading" class="landing-h2">Compare Event Monitoring, <span class="landing-h2__accent">Holter and MCT</span></h2>
        <p class="landing-p">Select the test for the clinical question and the required timing of findings. These are Specialized Medical service descriptions; the physician determines the appropriate prescription.</p>
        <div class="landing-table-wrap" role="region" aria-label="Event Monitoring compared with Holter and MCT" tabindex="0">
          <table class="landing-table landing-table--stack">
            <caption class="landing-table__caption">Specialized Medical monitoring services by prescribed window, focus and timing of clinical findings</caption>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Prescribed window</th>
                <th scope="col">Focus</th>
                <th scope="col">Clinical findings</th>
              </tr>
            </thead>
            <tbody>
{chr(10).join(rows)}
            </tbody>
          </table>
        </div>
        <p class="landing-p">LIVE technical-status visibility is available with connected studies. Recording-only Holter options do not provide this live visibility.</p>
        <p class="landing-p landing-p--actions">{demo_link("mid_page")}</p>
      </div>
    </section>

    <!-- 10 FAQs -->
    <section class="figma-section faq-accordion landing-section landing-faq landing-section--muted" aria-labelledby="event-faq-heading">
      <div class="figma-container faq-accordion__inner">
        <h2 id="event-faq-heading" class="landing-h2">Cardiac Event Monitoring: Frequently Asked <span class="landing-h2__accent">Questions</span></h2>
        <div class="faq-category">
          <div class="faq-category__list">
{chr(10).join(faq_items)}
          </div>
        </div>
      </div>
    </section>

    <!-- 11 Demo request -->
    <section class="landing-section landing-cta-block" id="request-event-demo" aria-labelledby="event-cta-heading">
      <div class="figma-container">
        <div class="landing-cta-block__box">
          <div class="landing-cta-block__copy">
            <h2 id="event-cta-heading" class="landing-h2">See Event Monitoring in Your Practice&rsquo;s Workflow</h2>
            <p class="landing-p">Request a demonstration of the S-Patch, assigned phone, digital symptom logging, LIVE technical-status view, notification process and physician reporting portal. Tell us about your current monitoring workflow and the patients your practice serves.</p>
            <p class="landing-p landing-cta-block__phone">Call: {phone_link("form", "", "1-855-SPEC-MED (1-855-773-2633)").replace('class="" ', '')}</p>
            <p class="landing-p landing-cta-block__support"><strong>Patients:</strong> for monitor or setup questions, use the support number supplied with your study. For urgent symptoms, call 911.</p>
          </div>
          <form class="landing-cta-form" action="https://api.web3forms.com/submit" method="POST" data-track-start="demo_form_start" data-track-success="generate_lead" data-track-error="demo_form_error" data-success-message="Thank you. Your Event Monitoring demo request has been sent to the Specialized Medical team." data-error-message="We could not confirm that your request was sent. Please try again or call 1-855-773-2633.">
            <input type="hidden" name="access_key" value="8ec7a28a-1979-4c39-8791-18fbf60bba44">
            <input type="hidden" name="subject" value="Event Monitoring Demo Request">
            <input type="hidden" name="from_page" value="cardiac-event-monitoring">
            <input type="hidden" name="originating_service" value="event_monitoring">
            <input type="hidden" name="redirect" value="">
            <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Full name <abbr title="required">*</abbr></span>
                <input name="name" type="text" autocomplete="name" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Organization <abbr title="required">*</abbr></span>
                <input name="organization" type="text" autocomplete="organization" required>
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Work email <abbr title="required">*</abbr></span>
                <input name="email" type="email" autocomplete="work email" inputmode="email" required>
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Phone <span class="landing-cta-form__optional">(optional)</span></span>
                <input name="phone" type="tel" autocomplete="work tel" inputmode="tel">
              </label>
            </div>
            <div class="landing-cta-form__row">
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Number of locations <span class="landing-cta-form__optional">(optional)</span></span>
                <input name="locations" type="number" min="1" inputmode="numeric">
              </label>
              <label class="landing-cta-form__field">
                <span class="landing-cta-form__label">Primary monitoring interest <span class="landing-cta-form__optional">(optional)</span></span>
                <select name="interest">
{options}
                </select>
              </label>
            </div>
            <button type="submit" class="figma-btn figma-btn--solid landing-cta-form__submit">{CTA}</button>
            <p class="landing-cta-form__note">For practice inquiries. Please do not include patient names, dates of birth, medical records or other patient information in this form. See our <a href="privacy.html">Privacy Policy</a>.</p>
            <p class="landing-cta-form__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>

    <!-- 12 Author, review, references -->
    <section class="landing-section" aria-labelledby="event-eeat-heading">
      <div class="figma-container">
        <h2 id="event-eeat-heading" class="landing-h2">Author, Clinical Review and <span class="landing-h2__accent">References</span></h2>
        <div class="landing-eeat">
          <div class="landing-eeat__author">
            <h3 class="landing-h3">Author</h3>
            <p class="landing-p"><strong>Steven M. Burns</strong>, President &amp; CEO, Specialized Medical LLC. Service content reflects Specialized Medical&rsquo;s ambulatory monitoring workflow and practice support.</p>
          </div>
          <div class="landing-eeat__review">
            <h3 class="landing-h3">Clinical review</h3>
            <p class="landing-p"><strong>Last updated:</strong> {UPDATED_TEXT}</p>
            <!-- TODO before publication (brief s.8): enter the actual clinical reviewer's name, credentials, specialty and review date; then add reviewedBy/lastReviewed to the JSON-LD. -->
            <p class="landing-p">Reviewed by Specialized Medical for service, workflow, and technical accuracy. This page provides general information for healthcare professionals and does not replace clinical judgment, payer requirements, emergency services, or institutional protocols.</p>
          </div>
          <div class="landing-eeat__policy">
            <h3 class="landing-h3">Questions and corrections</h3>
            <p class="landing-p">Contact <a href="contact.html">Specialized Medical</a> or call 1-855-773-2633.</p>
          </div>
          <div class="landing-eeat__refs">
            <h3 class="landing-h3">References</h3>
            <ol class="landing-refs">
              <li><a href="{ISHNE}" target="_blank" rel="noopener noreferrer">Steinberg JS, et al. 2017 ISHNE-HRS expert consensus statement on ambulatory ECG and external cardiac monitoring/telemetry. Ann Noninvasive Electrocardiol. 2017;22:e12447. PMCID: PMC6931745</a></li>
              <li><a href="{AHA}" target="_blank" rel="noopener noreferrer">American Heart Association. Cardiac Event Recorder. Reviewed October 10, 2024.</a></li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-disclaimer" aria-label="Diagnostic service disclaimer">
      <div class="figma-container">
        <p class="landing-disclaimer__text"><strong>Diagnostic Service Disclaimer:</strong> Specialized Medical provides ambulatory cardiac monitoring services and diagnostic information for review by qualified healthcare providers. The service does not replace physician judgment, emergency medical services, or instructions to call 911 when urgent symptoms occur.</p>
      </div>
    </section>
  </main>
"""


def main():
    template = (ROOT / "post-tavr-cardiac-monitoring.html").read_text(encoding="utf8")
    lines = template.split("\n")
    i_base = next(i for i, l in enumerate(lines) if "<!-- sm-site-base -->" in l)
    i_foot = next(i for i, l in enumerate(lines) if '<footer class="site-footer' in l)
    top = "\n".join(lines[: i_base + 1]).replace('<html lang="en">', '<html lang="en-US">')
    if '"cardiac-event-monitoring"' not in top:
        top = top.replace('"post-tavr-cardiac-monitoring": 1',
                          '"post-tavr-cardiac-monitoring": 1,\n          "cardiac-event-monitoring": 1')
    out = top + "\n" + body().rstrip("\n") + "\n" + "\n".join(lines[i_foot:])
    (ROOT / PAGE).write_text(out, encoding="utf8")
    print("built", PAGE)


if __name__ == "__main__":
    main()
