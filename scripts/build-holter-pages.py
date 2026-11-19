"""Build the three Holter landing pages from the Nov 2026 Holter SEO/AEO guide.

Run from the repo root:   python3 scripts/build-holter-pages.py && npm run cache-bust

Pages:
  holter-monitoring-services.html             24-48 hours
  long-term-holter-monitoring.html            more than 48 hours through 7 days
  extended-holter-monitoring-8-14-days.html   8-14 days

The shared <head> base script, footer and scripts are copied from
post-tavr-cardiac-monitoring.html so all landing pages stay in sync.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.specialized-med.com/"
HUB = SITE + "cardiac-monitoring-services.html"
TODAY_ISO = "2026-11-19"
TODAY_TEXT = "November 19, 2026"

ISHNE = "https://pmc.ncbi.nlm.nih.gov/articles/PMC6931745/"
CMS_ARTICLE = "https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=60292"
CMS_NCD = "https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?NCDId=179"
BARRETT = "https://pubmed.ncbi.nlm.nih.gov/24384108/"

LIVE_FAQ = (
    "What does LIVE TEST STATUS VISIBILITY mean during a Holter study?",
    "It lets Specialized Medical check how a connected study is running and help the patient resolve "
    "technical issues during wear. The ordering clinician receives clinical findings in the final report "
    "after the study and analysis are complete.",
)


def cite(n, url):
    return (f'<sup class="landing-cite"><a href="{url}" target="_blank" rel="noopener noreferrer">'
            f'[{n}]</a></sup>')


PAGES = [
    {
        "file": "holter-monitoring-services.html",
        "slug": "holter-monitoring-services",
        "service_id": "holter_24_48h",
        "title": "24–48 Hour Holter Monitoring | Specialized Medical",
        "description": "24–48 hour Holter with continuous ECG recording, LIVE TEST STATUS VISIBILITY on "
                       "connected studies, and clinical findings in the final report.",
        "crumb": "24–48 Hour Holter",
        "h1": "24–48 Hour Holter Monitoring",
        "h1_html": '24–48 Hour <span class="landing-hero__title-accent">Holter Monitoring</span>',
        "image": "holter-24-48-hour-hero",
        "image_size": (1816, 866),
        "focus": "69% 48%",
        "focus_mobile": "69% 46%",
        "tone": "light",
        "alt": "Patient wearing a two-disc S-Patch ECG monitor during an office visit.",
        "lead": "A 24–48-hour Holter monitor continuously records the patient’s electrocardiogram (ECG) over one "
                "to two days. With LIVE TEST STATUS VISIBILITY on connected studies, Specialized Medical can "
                "spot and help resolve technical issues while the patient wears the monitor. Clinical findings "
                "are presented in the final report after the study and analysis are complete.",
        "cta": "Request a 24–48 Hour Holter Demo",
        "interest": "24–48 Hour Holter",
        "fit_h2": 'When a Short Holter Study <span class="landing-h2__accent">May Help</span>',
        "fit_id": "holter-24-48-when-heading",
        "fit": [
            "A clinician may order short-duration Holter monitoring when symptoms such as frequent palpitations "
            "are expected within the recording window. The recording can help the clinician compare reported "
            "symptom times with the heart’s rhythm and assess rhythm patterns over the prescribed period. The "
            "clinician selects the test based on the history, symptoms and question the study needs to answer."
            + cite(1, ISHNE),
        ],
        "flow_h2": 'What Happens During the <span class="landing-h2__accent">First 48 Hours?</span>',
        "flow_id": "holter-24-48-workflow-heading",
        "flow": [
            "The practice enrolls the patient, applies the wearable and explains how to record symptoms and whom "
            "to call for help. For a LIVE STREAMING study, the S-Patch connects by Bluetooth to an assigned "
            "phone, which sends ECG data when cellular connectivity is available. Specialized Medical can check "
            "indicators such as battery status, electrode contact and whether ECG data is being received. If the "
            "team detects a technical issue, it can contact the patient to help resolve it while there is still "
            "time to preserve part of the short recording window.",
        ],
        "report_h2": 'What the Clinician Gets <span class="landing-h2__accent">After the Study</span>',
        "report_id": "holter-24-48-report-heading",
        "report": [
            "The final report summarizes available ECG findings for the ordering clinician. It may include "
            "heart-rate and rhythm information, ectopy, representative ECG strips and any available "
            "symptom-to-rhythm correlations. The clinician reviews the report alongside the patient’s history "
            "and other findings.",
        ],
        "evidence": None,
        "codes": ("Up to and including 48 hours", "93224", "93225", "93226", "93227"),
        "code_note": None,
        "faq_h2": 'Questions About 24–48 Hour <span class="landing-h2__accent">Holter Monitoring</span>',
        "faqs": [
            ("Is a 48-hour Holter a short or extended Holter?",
             "A study lasting exactly 48 hours falls within the short Holter duration band. The first extended "
             "continuous ECG coding band begins after 48 hours."),
            ("When is a 24–48-hour Holter commonly considered?",
             "A clinician may select it when symptoms occur frequently or can be reliably reproduced within a day "
             "or two. The clinician chooses the monitoring window based on the individual evaluation."),
            ("What if symptoms do not happen during the study?",
             "The report still shows available rhythm data from the study. The clinician can decide whether a "
             'longer recording window, such as an <a href="long-term-holter-monitoring.html">up to 7-day extended '
             "Holter</a>, or another monitoring approach would help answer the question."),
            ("Can I wear a Holter without carrying the assigned phone?",
             "Specialized Medical offers a recording-only 24–48-hour option for selected patients. The recording "
             "is analyzed after the study. During wear, LIVE TEST STATUS VISIBILITY is available with the "
             "connected option."),
            ("When will my clinician get the findings?",
             "Specialized Medical presents clinical findings in the final report after the study and analysis are "
             "complete. Ask the ordering practice how it will share and discuss the results with you."),
            ("What should I do if an electrode comes loose?",
             "Follow the instructions provided with your monitor and call the support number supplied with your "
             "study if you need help."),
        ],
        "form_intro": "See how your practice can enroll patients, verify setup, and review a completed "
                      "short-duration Holter report.",
    },
    {
        "file": "long-term-holter-monitoring.html",
        "slug": "long-term-holter-monitoring",
        "service_id": "holter_over_48h_to_7d",
        "title": "Up to 7-Day Extended Holter Monitoring | Specialized Medical",
        "description": "Extended Holter for more than 48 hours through 7 days, with LIVE TEST STATUS VISIBILITY on "
                       "connected studies and clinical findings in the final report.",
        "crumb": "Extended Holter Through 7 Days",
        "h1": "Extended Holter Monitoring Through 7 Days",
        "h1_html": 'Extended Holter Monitoring <span class="landing-hero__title-accent">Through 7 Days</span>',
        "image": "holter-over-48-hours-to-7-days-hero",
        "image_size": (1817, 866),
        "focus": "66% 46%",
        "focus_mobile": "66% 44%",
        "tone": "light",
        "alt": "Patient at home wearing an S-Patch ECG monitor with two connected electrode discs.",
        "lead": "This extended Holter service continuously records the patient’s ECG for more than 48 hours and up "
                "to 7 days. With LIVE TEST STATUS VISIBILITY on connected studies, Specialized Medical can help "
                "address electrode or connection problems before more recording time is lost. Clinical findings "
                "are presented in the final report after the study and analysis are complete.",
        "cta": "Request a 7-Day Holter Demo",
        "interest": "Extended Holter Through 7 Days",
        "fit_h2": 'Why Record for More Than <span class="landing-h2__accent">48 Hours?</span>',
        "fit_id": "holter-7-day-why-heading",
        "fit": [
            "A clinician may choose a multi-day recording when a 24–48-hour window may be too short to answer the "
            "clinical question. The longer window gives the clinician more opportunity to match reported symptoms "
            "with available ECG data and review rhythm patterns across several days. The prescription determines "
            "the recording period and monitoring type." + cite(1, ISHNE),
            'When a longer continuous recording is needed, Specialized Medical also offers an '
            '<a href="extended-holter-monitoring-8-14-days.html">8–14 day extended Holter</a>.',
        ],
        "flow_h2": 'Keeping a Multi-Day Holter Study <span class="landing-h2__accent">Connected</span>',
        "flow_id": "holter-7-day-workflow-heading",
        "flow": [
            "The practice confirms the prescribed duration and reviews the instructions for the wearable, assigned "
            "phone and symptom logging at setup. With the LIVE STREAMING option, Specialized Medical can follow "
            "battery status, electrode contact, connectivity and data receipt while the study is underway. The "
            "support team can help troubleshoot technical issues it identifies so the patient can continue the "
            "prescribed study and preserve as much usable recording time as possible. Follow the study "
            "instructions for skin care, water exposure and equipment return.",
        ],
        "report_h2": 'How the Practice Reviews a <span class="landing-h2__accent">Seven-Day Study</span>',
        "report_id": "holter-7-day-report-heading",
        "report": [
            "The ordering clinician receives a final report for review. The report may show rhythm patterns over "
            "the available recording period, representative ECG strips and the times of symptoms the patient "
            "recorded. Electrode contact, artifact and interruptions can affect the amount of interpretable data.",
        ],
        "evidence": None,
        "codes": ("More than 48 hours through 7 days", "93241", "93242", "93243", "93244"),
        "code_note": None,
        "faq_h2": 'Questions About Extended Holter Monitoring <span class="landing-h2__accent">Through 7 Days</span>',
        "faqs": [
            ("How long does this extended Holter last?",
             "It records ECG continuously for more than 48 hours through 7 days, as prescribed. Exactly 7 days is "
             "the upper boundary of this service window."),
            ("Why might a clinician order seven days instead of 48 hours?",
             "Several days of recording can offer more opportunities to assess symptoms or rhythm changes that may "
             "fall outside a one- or two-day window. The clinician chooses the duration based on the question "
             "being evaluated."),
            ("Is seven-day Holter monitoring the same as mobile cardiac telemetry?",
             "No. Connected Holter studies provide LIVE TEST STATUS VISIBILITY during wear, and clinical findings "
             "are presented in the final report after the study and analysis are complete. With "
             '<a href="mobile-cardiac-telemetry-mct.html">MCT</a>, qualifying findings may be communicated during '
             "the study under the prescribed notification protocol."),
            ("How do I log a symptom during a connected study?",
             "Use the Log Symptoms screen on the assigned phone as instructed. The symptom time can be compared "
             "with the available ECG recording."),
            ("Is a recording-only option available?",
             "Specialized Medical lists a recording-only extended Holter option for 3–7 days for selected "
             "patients. It records ECG for later analysis. LIVE TEST STATUS VISIBILITY is available with the "
             "connected option."),
            ("Can I shower or change the electrodes during the study?",
             "Follow the instructions for the equipment supplied with your study. Ask the support team about water "
             "exposure and contact them if an electrode loosens or your skin becomes irritated."),
        ],
        "form_intro": "Review multi-day setup, patient support, symptom logging and final reporting for your practice.",
    },
    {
        "file": "extended-holter-monitoring-8-14-days.html",
        "slug": "extended-holter-monitoring-8-14-days",
        "service_id": "holter_8_14d",
        "title": "8–14 Day Extended Holter Monitoring | Specialized Medical",
        "description": "8–14 day extended Holter with continuous ECG recording, LIVE TEST STATUS VISIBILITY on "
                       "connected studies, and clinical findings in the final report.",
        "crumb": "8–14 Day Extended Holter",
        "h1": "8–14 Day Extended Holter Monitoring",
        "h1_html": '8–14 Day Extended <span class="landing-hero__title-accent">Holter Monitoring</span>',
        "image": "holter-8-14-days-hero",
        "image_size": (1817, 866),
        "focus": "74% 47%",
        "focus_mobile": "72% 45%",
        "tone": "navy",
        "alt": "Patient reading at home while wearing a two-disc S-Patch ECG monitor.",
        "lead": "An 8–14-day extended Holter continuously records the patient’s ECG across a longer prescribed "
                "window. With LIVE TEST STATUS VISIBILITY on connected studies, Specialized Medical can help keep a "
                "longer recording on track by spotting and addressing technical problems as they arise. Clinical "
                "findings are presented in the final report after the study and analysis are complete.",
        "cta": "Request an 8–14 Day Holter Demo",
        "interest": "8–14 Day Extended Holter",
        "fit_h2": 'When More Than Seven Days of Recording <span class="landing-h2__accent">May Help</span>',
        "fit_id": "holter-8-14-when-heading",
        "fit": [
            "The ordering clinician may want a longer continuous recording to review rhythm patterns across more "
            "days, compare symptoms with the recorded rhythm or estimate how often certain rhythms occurred during "
            "the study. The choice depends on the clinical question, symptom frequency, and whether the clinician "
            "needs to receive qualifying findings while monitoring is underway. Very infrequent symptoms may "
            "warrant a different monitoring strategy." + cite(1, ISHNE),
            'When qualifying findings need to be communicated during the study, the clinician may consider '
            '<a href="mobile-cardiac-telemetry-mct.html">mobile cardiac telemetry</a> instead.',
        ],
        "flow_h2": 'What to Plan for During a <span class="landing-h2__accent">Longer Study</span>',
        "flow_id": "holter-8-14-workflow-heading",
        "flow": [
            "At enrollment, the practice can review how to wear the S-Patch, keep the assigned phone available, "
            "log symptoms, and contact technical support. On connected studies, LIVE TEST STATUS VISIBILITY lets "
            "Specialized Medical check electrode contact, battery status, connectivity and ECG data receipt during "
            "wear. The team can contact the patient to help address an issue and keep the longer study on track. "
            "Follow the instructions supplied for the specific monitor, including any prescribed electrode or "
            "battery changes and return steps.",
        ],
        "report_h2": 'Reviewing the <span class="landing-h2__accent">Longer Recording</span>',
        "report_id": "holter-8-14-report-heading",
        "report": [
            "The final report may summarize rate and rhythm patterns across the interpretable recording, the "
            "frequency or burden of selected rhythms when available, recorded symptom times, and representative "
            "ECG strips. The ordering clinician interprets the report alongside other clinical information.",
        ],
        "evidence": "In a study of 146 referred patients, a separate adhesive ECG patch worn for up to 14 days "
                    "detected more prespecified arrhythmia events over total wear time than a 24-hour Holter. The "
                    "study compared different devices and recording windows. It did not evaluate Specialized "
                    "Medical’s S-Patch.",
        "codes": ("More than 7 days through 15 days", "93245", "93246", "93247", "93248"),
        "code_note": "Specialized Medical’s service window on this page is 8–14 days. The corresponding CPT family "
                     "extends through 15 days.",
        "faq_h2": 'Questions About 8–14 Day Extended <span class="landing-h2__accent">Holter Monitoring</span>',
        "faqs": [
            ("Does an 8–14-day Holter record only when I feel a symptom?",
             "No. It is designed for continuous ECG recording during prescribed wear. Symptom entries add timing "
             "and context to the ECG data available for review."),
            ("Does 14 days mean I will have to change the battery or electrodes?",
             "Follow the instructions provided with the specific device and supplies. The practice or support team "
             "can explain what to do during your study."),
            ("When does the clinician receive the findings from a 14-day Holter?",
             "Specialized Medical presents clinical findings in the final report after the study and analysis are "
             "complete. The ordering clinician reviews the report and determines the next steps."),
            ("What if the assigned phone loses its connection?",
             "Follow the instructions supplied at setup and contact study support if the connection problem "
             "persists or the equipment displays a problem. The support team can explain which data are available "
             "for the study."),
            ("What does rhythm burden mean in an extended Holter report?",
             "Rhythm burden describes how much of the interpretable recording a specified rhythm occupied, "
             "typically expressed as a percentage. The clinician interprets it together with other findings and "
             "the clinical history."),
            ("Can the study continue beyond 14 days?",
             "The service described on this page covers 8–14 days. Contact the ordering clinician if a different "
             "monitoring duration is needed."),
        ],
        "form_intro": "See how to set up longer continuous ECG studies and review their final reports in your practice.",
    },
]

COMPARE_ROWS = [
    ("holter-monitoring-services.html", "24–48 Hour Holter", "24–48 hours",
     "LIVE TEST STATUS VISIBILITY on connected studies", "In the final report after the study and analysis are complete"),
    ("long-term-holter-monitoring.html", "Extended Holter Through 7 Days", "More than 48 hours through 7 days",
     "LIVE TEST STATUS VISIBILITY on connected studies", "In the final report after the study and analysis are complete"),
    ("extended-holter-monitoring-8-14-days.html", "8–14 Day Extended Holter", "8–14 days",
     "LIVE TEST STATUS VISIBILITY on connected studies", "In the final report after the study and analysis are complete"),
    ("mobile-cardiac-telemetry-mct.html", "Mobile Cardiac Telemetry (MCT)", "Up to 30 days, as prescribed",
     "Attended surveillance and LIVE technical status when connected",
     "Qualifying findings during study per notification protocol, plus a final report"),
]

INTEREST_OPTIONS = ["24–48 Hour Holter", "Extended Holter Through 7 Days", "8–14 Day Extended Holter",
                    "Mobile Cardiac Telemetry (MCT)", "Cardiac Event Monitoring", "Multiple test types / full program"]

CHEVRON = ('<svg class="faq-item__chevron{c}" width="20" height="20" viewBox="0 0 24 24" fill="none" '
           'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" '
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s))


def img_set(base, ext, widths, full_w):
    parts = [f"/images/landing/{base}-{w}.{ext} {w}w" for w in widths]
    parts.append(f"/images/landing/{base}.{ext} {full_w}w")
    return ", ".join(parts)


def jsonld(p):
    canonical = SITE + p["file"]
    image = SITE + "images/landing/" + p["image"] + ".jpg"
    org = {"@id": SITE + "#organization"}
    cites = [ISHNE, CMS_ARTICLE, CMS_NCD] + ([BARRETT] if p["evidence"] else [])
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "MedicalWebPage",
                "@id": canonical + "#webpage",
                "url": canonical,
                "name": p["h1"],
                "description": p["description"],
                "inLanguage": "en-US",
                "isPartOf": {"@id": SITE + "#website"},
                "publisher": org,
                "mainEntity": {"@id": canonical + "#service"},
                "breadcrumb": {"@id": canonical + "#breadcrumb"},
                "primaryImageOfPage": {"@type": "ImageObject", "contentUrl": image,
                                       "width": p["image_size"][0], "height": p["image_size"][1]},
                "dateModified": TODAY_ISO,
                "author": {"@type": "Person", "name": "Steven M. Burns", "jobTitle": "President & CEO",
                           "worksFor": org},
                "citation": cites,
            },
            {
                "@type": "Service",
                "@id": canonical + "#service",
                "url": canonical,
                "name": p["h1"],
                "serviceType": "Continuous external ambulatory electrocardiographic monitoring",
                "provider": org,
                "image": image,
            },
            {
                "@type": "BreadcrumbList",
                "@id": canonical + "#breadcrumb",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE},
                    {"@type": "ListItem", "position": 2, "name": "Cardiac Monitoring Services", "item": HUB},
                    {"@type": "ListItem", "position": 3, "name": p["crumb"], "item": canonical},
                ],
            },
            {
                "@type": "Organization", "@id": SITE + "#organization", "name": "Specialized Medical LLC",
                "url": SITE, "telephone": "+1-855-773-2633", "email": "info@specialized-med.com",
                "logo": SITE + "images/figma-assets/brand-logo.webp",
                "address": {"@type": "PostalAddress", "streetAddress": "34145 Pacific Coast Highway, #700",
                            "addressLocality": "Dana Point", "addressRegion": "CA", "postalCode": "92629",
                            "addressCountry": "US"},
            },
            {"@type": "WebSite", "@id": SITE + "#website", "name": "Specialized Medical", "url": SITE,
             "publisher": org},
        ],
    }
    return json.dumps(graph, indent=2, ensure_ascii=False)


def page_body(p):
    e = html.escape
    canonical = SITE + p["file"]
    img = p["image"]
    w, h = p["image_size"]
    og_image = SITE + "images/landing/" + img + ".jpg"
    sid = p["service_id"]
    tone = p["tone"]

    def demo_link(placement, cls="figma-btn figma-btn--solid", label=None):
        return (f'<a class="{cls}" href="{p["file"]}#cta-form" data-mct-track="demo_cta_click" '
                f'data-track-placement="{placement}">{label or p["cta"]}</a>')

    rows = []
    for href, name, dur, during, when in COMPARE_ROWS:
        if href == p["file"]:
            head = f'<th scope="row" aria-current="page">{name}<span class="landing-table__current">(this page)</span></th>'
            tr = '<tr aria-current="page">'
        else:
            head = f'<th scope="row"><a href="{href}">{name}</a></th>'
            tr = "<tr>"
        rows.append(f"""              {tr}
                {head}
                <td data-label="Prescribed duration">{dur}</td>
                <td data-label="During the study">{during}</td>
                <td data-label="When clinical findings are presented">{when}</td>
              </tr>""")

    faqs = list(p["faqs"]) + [LIVE_FAQ]
    faq_items = []
    for i, (q, a) in enumerate(faqs):
        first = i == 0
        fid = f"{sid}-{i}"
        faq_items.append(f"""<div class="faq-item{' is-open' if first else ''}">
      <button type="button" id="faq-trigger-{fid}" class="faq-item__trigger" aria-expanded="{'true' if first else 'false'}" aria-controls="faq-panel-{fid}">
        <span class="faq-item__q">{e(q, quote=False)}</span>
        {CHEVRON.format(c=' is-open' if first else '')}
      </button>
      <div id="faq-panel-{fid}" role="region" aria-labelledby="faq-trigger-{fid}" class="faq-item__panel"{'' if first else ' hidden'}>
        <p>{a}</p>
      </div>
    </div>""")

    options = "\n".join(
        f'                  <option value="{e(o)}"{" selected" if o == p["interest"] else ""}>{e(o)}</option>'
        for o in INTEREST_OPTIONS)

    code_range, g, rc, sa, pi = p["codes"]
    evidence = ""
    if p["evidence"]:
        evidence = f"""
        <aside class="landing-callout" role="note">
          <p class="landing-callout__title">CLINICAL EVIDENCE</p>
          <p class="landing-callout__body">{p["evidence"]}{cite(4, BARRETT)}</p>
        </aside>"""
    code_note = f'\n        <p class="landing-p"><strong>Note:</strong> {p["code_note"]}</p>' if p["code_note"] else ""
    barrett_ref = (f'\n              <li><a href="{BARRETT}" target="_blank" rel="noopener noreferrer">Barrett PM, et al. '
                   'Comparison of 24-hour Holter monitoring with 14-day novel adhesive patch electrocardiographic '
                   'monitoring. Am J Med. 2014;127(1):95.e11-7. PMID: 24384108</a></li>') if p["evidence"] else ""

    head = f"""  <script type="application/ld+json">
{jsonld(p)}
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(p["title"], quote=False)}</title>
  <meta name="description" content="{e(p["description"])}">
  <meta property="og:site_name" content="Specialized Medical">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{e(p["title"])}">
  <meta property="og:description" content="{e(p["description"])}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{og_image}">
  <meta property="og:image:width" content="{w}">
  <meta property="og:image:height" content="{h}">
  <meta property="og:image:alt" content="{e(p["alt"])}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{e(p["title"])}">
  <meta name="twitter:description" content="{e(p["description"])}">
  <meta name="twitter:image" content="{og_image}">
  <meta name="twitter:image:alt" content="{e(p["alt"])}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="preload" as="image" type="image/webp" href="/images/landing/{img}-960.webp" imagesrcset="{img_set(img, 'webp', (750, 960, 1280), w)}" imagesizes="(max-width: 900px) 100vw, min(1430px, 100vw)" fetchpriority="high">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="/css/global.css">
  <link rel="stylesheet" href="/css/chrome.css">
  <link rel="stylesheet" href="/css/landing-mct.css">
  <link rel="stylesheet" href="/css/faq.css">
  <link rel="stylesheet" href="/css/landing-holter.css">
  <link rel="canonical" href="{canonical}">
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
  <a class="skip-link" href="{p["file"]}#main-content">Skip to content</a>
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
            <a class="figma-nav__phone" href="tel:+18557732633" data-mct-track="specialist_phone_click" data-track-placement="mobile_nav">Call: 1-855-773-2633</a>
            <div class="figma-nav__actions">
              {demo_link("mobile_nav", "figma-btn figma-btn--outline-dark", "Request a Holter Demo")}
              <a class="figma-btn figma-btn--solid" href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click" target="_blank" rel="noopener noreferrer">Physician Portal</a>
            </div>
          </div>
        </nav>
        <div class="figma-header__cta">
          <a class="figma-phone" href="tel:+18557732633" data-mct-track="specialist_phone_click" data-track-placement="header">
            <img class="figma-phone__icon" src="/icons/vector3527-jgyk.svg" alt="" width="14" height="14" decoding="async">
            <span class="figma-phone__num">1-855-773-2633</span>
          </a>
          {demo_link("header", "figma-btn figma-btn--outline-dark figma-btn--holter-demo", "Request a Holter Demo")}
          <a class="figma-header__portal" href="https://sft.specialized-med-business.com/specMed/" data-mct-track="portal_click" target="_blank" rel="noopener noreferrer">Physician Portal</a>
        </div>
      </div>
    </header>

    <main class="landing-page landing-page--holter services-page services-page--figma" data-landing="{p["slug"]}" data-service-id="{sid}" id="main-content" tabindex="-1">
    <nav class="landing-breadcrumb" aria-label="Breadcrumb">
      <div class="figma-container">
        <ol class="landing-breadcrumb__list">
          <li><a href="./">Home</a></li>
          <li><a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a></li>
          <li><span aria-current="page">{p["crumb"]}</span></li>
        </ol>
      </div>
    </nav>

    <section class="landing-hero" aria-labelledby="{sid}-hero-heading">
      <div class="landing-hero__plate landing-hero__plate--holter landing-hero__plate--holter-{tone}" style="--hero-focus: {p["focus"]}; --hero-focus-mobile: {p["focus_mobile"]};">
        <picture>
          <source
            type="image/webp"
            srcset="{img_set(img, 'webp', (750, 960, 1280), w)}"
            sizes="(max-width: 900px) 100vw, min(1430px, 100vw)">
          <img
            class="landing-hero__media"
            src="/images/landing/{img}-960.jpg"
            srcset="{img_set(img, 'jpg', (960, 1280), w)}"
            sizes="(max-width: 900px) 100vw, min(1430px, 100vw)"
            alt="{e(p["alt"])}"
            width="{w}"
            height="{h}"
            fetchpriority="high"
            loading="eager"
            decoding="async">
        </picture>
        <div class="landing-hero__gradient" aria-hidden="true"></div>
        <div class="landing-hero__inner figma-container">
          <p class="figma-hero__pill">
            <span class="figma-hero__pill-dot" aria-hidden="true"></span>
            CONTINUOUS ECG RECORDING | LIVE TEST STATUS VISIBILITY | FINAL REPORT
          </p>
          <h1 id="{sid}-hero-heading" class="landing-hero__title">{p["h1_html"]}</h1>
          <p class="landing-hero__lead landing-answer">{p["lead"]}</p>
          <div class="landing-hero__actions">
            {demo_link("hero")}
            <a class="figma-btn figma-btn--outline-dark" href="{p["file"]}#compare-holter">Compare Holter durations</a>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--muted" aria-labelledby="{sid}-live-heading">
      <div class="figma-container">
        <h2 id="{sid}-live-heading" class="landing-h2">How LIVE TEST STATUS VISIBILITY Helps Keep a Holter Study <span class="landing-h2__accent">on Track</span></h2>
        <div class="landing-live-status">
          <p class="landing-p landing-answer">During a connected Holter study, Specialized Medical can see whether the battery, electrodes and connection are working as expected and whether ECG data is being received. If the team identifies an issue, it can contact the patient and help correct it during wear. Addressing these issues while the study is active helps preserve usable ECG data and improves the likelihood of completing the prescribed recording. Clinical findings are presented to the ordering clinician in the final report after the study and analysis are complete.</p>
        </div>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="{p["fit_id"]}">
      <div class="figma-container">
        <h2 id="{p["fit_id"]}" class="landing-h2">{p["fit_h2"]}</h2>
{chr(10).join('        <p class="landing-p">' + t + '</p>' for t in p["fit"])}
      </div>
    </section>

    <section class="landing-section landing-section--muted" aria-labelledby="{p["flow_id"]}">
      <div class="figma-container">
        <h2 id="{p["flow_id"]}" class="landing-h2">{p["flow_h2"]}</h2>
{chr(10).join('        <p class="landing-p">' + t + '</p>' for t in p["flow"])}
        <ol class="landing-flow landing-flow--holter" aria-label="Holter study steps">
          <li class="landing-flow__step"><strong>Enroll and prescribe</strong><span>The practice enrolls the patient and confirms the prescribed recording window.</span></li>
          <li class="landing-flow__step"><strong>Apply and instruct</strong><span>The S-Patch is applied, and the patient learns how to log symptoms and whom to call.</span></li>
          <li class="landing-flow__step"><strong>Wear with LIVE TEST STATUS VISIBILITY</strong><span>On connected studies, Specialized Medical follows battery, electrode contact, connectivity and data receipt.</span></li>
          <li class="landing-flow__step"><strong>Final report</strong><span>After the study and analysis are complete, the ordering clinician receives the final report.</span></li>
        </ol>
        <p class="landing-p">Equipment details and wear instructions are on the <a href="s-patch-cardiac-monitoring-system.html">S-Patch cardiac monitoring system</a> and <a href="services/equipment.html">cardiac monitoring equipment</a> pages.</p>
        <div class="landing-note landing-note--alert" role="note">
          <p class="landing-note__title">Urgent symptoms</p>
          <p class="landing-note__body">For urgent symptoms such as chest pain, severe shortness of breath or stroke symptoms, call 911. For device or setup questions, use the support number supplied with your study.</p>
        </div>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="{p["report_id"]}">
      <div class="figma-container">
        <h2 id="{p["report_id"]}" class="landing-h2">{p["report_h2"]}</h2>
{chr(10).join('        <p class="landing-p">' + t + '</p>' for t in p["report"])}
        <!-- TODO before launch (guide p.14): add a de-identified, authorized Holter final-report excerpt here. -->{evidence}
      </div>
    </section>

    <section class="landing-section landing-section--muted" id="compare-holter" aria-labelledby="{sid}-compare-heading">
      <div class="figma-container">
        <h2 id="{sid}-compare-heading" class="landing-h2">Compare Holter Durations and <span class="landing-h2__accent">MCT</span></h2>
        <div class="landing-table-wrap" role="region" aria-label="Holter durations compared with mobile cardiac telemetry" tabindex="0">
          <table class="landing-table landing-table--stack">
            <caption class="landing-table__caption">Holter monitoring options compared with mobile cardiac telemetry. Durations are prescribed windows.</caption>
            <thead>
              <tr>
                <th scope="col">Monitoring option</th>
                <th scope="col">Prescribed duration</th>
                <th scope="col">During the study</th>
                <th scope="col">When clinical findings are presented</th>
              </tr>
            </thead>
            <tbody>
{chr(10).join(rows)}
            </tbody>
          </table>
        </div>
        <p class="landing-p">Holter studies record ECG continuously for the prescribed window. <a href="cardiac-event-monitoring.html">Cardiac event monitoring</a> instead captures patient-triggered and auto-triggered events over a longer period, with qualifying findings communicated under the prescribed protocol. The full program is described on <a href="cardiac-monitoring-services.html">Cardiac Monitoring Services</a>.</p>
        <p class="landing-p landing-p--actions">{demo_link("mid_page")}</p>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="{sid}-coding-heading">
      <div class="figma-container">
        <h2 id="{sid}-coding-heading" class="landing-h2">CPT Codes for This <span class="landing-h2__accent">Holter Window</span></h2>
        <div class="landing-table-wrap" role="region" aria-label="CPT codes for this Holter duration" tabindex="0">
          <table class="landing-table landing-table--codes landing-table--stack">
            <caption class="landing-table__caption">Continuous external ECG recording codes for this duration</caption>
            <thead>
              <tr>
                <th scope="col">CPT recording threshold</th>
                <th scope="col">Global</th>
                <th scope="col">Recording component</th>
                <th scope="col">Scanning analysis and report</th>
                <th scope="col">Professional review and interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{code_range}</th>
                <td data-label="Global">{g}</td>
                <td data-label="Recording component">{rc}</td>
                <td data-label="Scanning analysis and report">{sa}</td>
                <td data-label="Professional review and interpretation">{pi}</td>
              </tr>
            </tbody>
          </table>
        </div>{code_note}
        <div class="landing-note landing-note--info" role="note">
          <p class="landing-note__body">The codes above describe continuous external ECG recording and related service components. Verify the documented recording duration, components furnished, medical necessity, documentation, and current payer or Medicare contractor rules before submitting a claim. Coverage and payment depend on the payer and circumstances.{cite(2, CMS_ARTICLE)}{cite(3, CMS_NCD)}</p>
        </div>
      </div>
    </section>

    <section class="figma-section faq-accordion landing-section landing-faq landing-section--muted" aria-labelledby="{sid}-faq-heading">
      <div class="figma-container faq-accordion__inner">
        <h2 id="{sid}-faq-heading" class="landing-h2">{p["faq_h2"]}</h2>
        <div class="faq-category">
          <div class="faq-category__list">
{chr(10).join(faq_items)}
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="{sid}-eeat-heading">
      <div class="figma-container">
        <h2 id="{sid}-eeat-heading" class="landing-h2">Author, Clinical Review and <span class="landing-h2__accent">References</span></h2>
        <div class="landing-eeat">
          <div class="landing-eeat__author">
            <h3 class="landing-h3">Author</h3>
            <p class="landing-p"><strong>Steven M. Burns</strong>, President &amp; CEO, Specialized Medical LLC. Mr. Burns leads Specialized Medical&rsquo;s ambulatory cardiac monitoring operations, including LIVE STREAMING Holter workflows, practice implementation and final-report delivery for cardiology practices.</p>
          </div>
          <div class="landing-eeat__review">
            <h3 class="landing-h3">Clinical review</h3>
            <p class="landing-p"><strong>Last updated:</strong> {TODAY_TEXT}</p>
            <!-- TODO before launch (guide p.8): add the named clinical reviewer, credentials and actual review date; route coding copy through billing. -->
            <p class="landing-p">Reviewed by Specialized Medical for service, workflow, and technical accuracy. This page provides general information for healthcare professionals and patients and does not replace clinical judgment, payer requirements, emergency services, or institutional protocols.</p>
          </div>
          <div class="landing-eeat__policy">
            <h3 class="landing-h3">Editorial policy</h3>
            <p class="landing-p">Specialized Medical publishes monitoring-service and technology information. Content is reviewed for clinical accuracy before publication. Corrections or questions may be directed to <a href="contact.html">Contact Specialized Medical</a> or 1-855-SPEC-MED (1-855-773-2633).</p>
          </div>
          <div class="landing-eeat__refs">
            <h3 class="landing-h3">References</h3>
            <ol class="landing-refs">
              <li><a href="{ISHNE}" target="_blank" rel="noopener noreferrer">Steinberg JS, et al. 2017 ISHNE-HRS expert consensus statement on ambulatory ECG and external cardiac monitoring/telemetry. Ann Noninvasive Electrocardiol. 2017;22:e12447. PMCID: PMC6931745</a></li>
              <li><a href="{CMS_ARTICLE}" target="_blank" rel="noopener noreferrer">CMS Billing and Coding: External Ambulatory Electrocardiographic Monitoring, Article A60292</a></li>
              <li><a href="{CMS_NCD}" target="_blank" rel="noopener noreferrer">CMS National Coverage Determination 20.15: Electrocardiographic Services</a></li>{barrett_ref}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-cta-block" id="cta-form" aria-labelledby="{sid}-cta-heading">
      <div class="figma-container">
        <div class="landing-cta-block__box">
          <div class="landing-cta-block__copy">
            <h2 id="{sid}-cta-heading" class="landing-h2">{p["cta"]}</h2>
            <p class="landing-p">{p["form_intro"]}</p>
            <p class="landing-p landing-cta-block__phone">Prefer to talk? <a href="tel:+18557732633" data-mct-track="specialist_phone_click" data-track-placement="form">Speak With a Cardiac Monitoring Specialist &mdash; 1-855-SPEC-MED (1-855-773-2633)</a></p>
            <p class="landing-p">See how practices run Holter studies in the <a href="cardiology-practice-cardiac-monitoring.html">cardiology practice monitoring workflow</a>.</p>
            <p class="landing-p landing-cta-block__support"><strong>Patients:</strong> for device or setup questions, use the support number supplied with your study. For urgent symptoms, call 911.</p>
          </div>
          <form class="landing-cta-form" action="https://api.web3forms.com/submit" method="POST" data-track-start="demo_form_start" data-track-success="generate_lead" data-success-message="Thank you. Your request was sent to the Specialized Medical team." data-error-message="Your request could not be sent. Please try again or call 1-855-773-2633.">
            <input type="hidden" name="access_key" value="8ec7a28a-1979-4c39-8791-18fbf60bba44">
            <input type="hidden" name="subject" value="{e(p["cta"])} — Specialized Medical">
            <input type="hidden" name="from_page" value="{p["slug"]}">
            <input type="hidden" name="originating_service" value="{sid}">
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
                <span class="landing-cta-form__label">Primary monitoring interest</span>
                <select name="interest">
{options}
                </select>
              </label>
            </div>
            <button type="submit" class="figma-btn figma-btn--solid landing-cta-form__submit">{p["cta"]}</button>
            <p class="landing-cta-form__note">For practice inquiries. Please keep patient names, medical information, and records out of this form. See our <a href="privacy.html">Privacy Policy</a>.</p>
            <p class="landing-cta-form__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>

    <section class="landing-section landing-section--muted" aria-labelledby="{sid}-related-heading">
      <div class="figma-container">
        <h2 id="{sid}-related-heading" class="landing-h2">Related Cardiac Monitoring <span class="landing-h2__accent">Resources</span></h2>
        <ul class="landing-related">
{chr(10).join(f'          <li><a href="{href}">{name}</a></li>' for href, name in [
    ("cardiac-monitoring-services.html", "Cardiac Monitoring Services"),
    ("holter-monitoring-services.html", "24–48 Hour Holter"),
    ("long-term-holter-monitoring.html", "Extended Holter Through 7 Days"),
    ("extended-holter-monitoring-8-14-days.html", "8–14 Day Extended Holter"),
    ("mobile-cardiac-telemetry-mct.html", "Mobile Cardiac Telemetry (MCT)"),
    ("cardiac-event-monitoring.html", "Cardiac Event Monitoring"),
    ("s-patch-cardiac-monitoring-system.html", "S-Patch Cardiac Monitoring System"),
    ("cardiology-practice-cardiac-monitoring.html", "Cardiology Practice Monitoring"),
] if href != p["file"])}
        </ul>
      </div>
    </section>

    <section class="landing-disclaimer" aria-label="Diagnostic service disclaimer">
      <div class="figma-container">
        <p class="landing-disclaimer__text"><strong>Diagnostic Service Disclaimer:</strong> Specialized Medical provides ambulatory cardiac monitoring services and diagnostic information for review by qualified healthcare providers. The service does not replace physician judgment, emergency medical services, or instructions to call 911 when urgent symptoms occur.</p>
      </div>
    </section>
  </main>
"""
    return head


def main():
    template = (ROOT / "post-tavr-cardiac-monitoring.html").read_text(encoding="utf8")
    lines = template.split("\n")
    i_base = next(i for i, l in enumerate(lines) if "<!-- sm-site-base -->" in l)
    i_foot = next(i for i, l in enumerate(lines) if '<footer class="site-footer' in l)
    top = "\n".join(lines[: i_base + 1]).replace('<html lang="en">', '<html lang="en-US">')
    bottom = "\n".join(lines[i_foot:])
    for p in PAGES:
        # sm-site-base: make sure the new slug is a known leaf so assets resolve under /slug/ too
        page_top = top
        if f'"{p["slug"]}"' not in page_top:
            page_top = page_top.replace('"post-tavr-cardiac-monitoring": 1',
                                        f'"post-tavr-cardiac-monitoring": 1,\n          "{p["slug"]}": 1')
        out = page_top + "\n" + page_body(p).rstrip("\n") + "\n" + bottom
        (ROOT / p["file"]).write_text(out, encoding="utf8")
        print("built", p["file"])


if __name__ == "__main__":
    main()
