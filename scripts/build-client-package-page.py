"""Convert a client "developer package" landing page into the site's landing template.

Usage (from the repo root):
  python3 scripts/build-client-package-page.py <package-page.html> <slug> <hero-tone light|navy>
  npm run cache-bust

The client's copy, headings, FAQs, table content and JSON-LD are kept. Their
standalone header, footer, embedded CSS and inline script are dropped; sections
are mapped onto the site's landing components (landing-mct.css + landing-pkg.css)
and the lead form is rebuilt for js/landing-lite.js (campaign capture,
sm_cta_click / sm_lead_form_submit_attempt events; sm_generate_lead fires on
thanks.html after a confirmed submission).
"""
import copy
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.specialized-med.com/"
ACCESS_KEY = "8ec7a28a-1979-4c39-8791-18fbf60bba44"  # production Web3Forms key already used site-wide
CAMPAIGN = ["page_url", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
            "gclid", "msclkid"]

# Study/service names used in client tables -> site pages
PAGE_LINKS = [
    (r"^holter\b(?!.*not live)", "holter-monitoring-services.html"),
    (r"^long-term holter", "long-term-holter-monitoring.html"),
    (r"^extended holter\b(?!.*not live)", "extended-holter-monitoring-8-14-days.html"),
    (r"^(cardiac )?event monitoring", "cardiac-event-monitoring.html"),
    (r"^(mobile cardiac telemetry|mct)\b", "mobile-cardiac-telemetry-mct.html"),
]

CHEVRON = ('<svg class="faq-item__chevron{c}" width="20" height="20" viewBox="0 0 24 24" fill="none" '
           'xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" '
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def has(el, *classes):
    return isinstance(el, Tag) and any(c in (el.get("class") or []) for c in classes)


def text(el):
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)) if el else ""


def inner(el):
    return "".join(str(c) for c in el.contents).strip() if el else ""


def local_href(href, page):
    if not href:
        return href
    href = re.sub(r"^https://www\.specialized-med\.com/", "/", href)
    if href.startswith("#"):
        return page + href
    if href.startswith("/") and href != "/":
        return href[1:]
    return href


def accent(title):
    """Wrap the last two words in the red/cyan accent span, as on the other landing pages."""
    words = title.split()
    if len(words) < 4:
        return title
    return " ".join(words[:-2]) + ' <span class="{cls}">' + " ".join(words[-2:]) + "</span>"


class Converter:
    def __init__(self, src, slug, tone):
        self.raw = Path(src).read_text(encoding="utf8")
        self.soup = BeautifulSoup(self.raw, "html.parser")
        self.slug = slug
        self.page = slug + ".html"
        self.tone = tone
        self.form_name = (re.search(r"form_name:\s*'([^']+)'", self.raw) or
                          re.search(r'form_name:\s*"([^"]+)"', self.raw))
        self.form_name = self.form_name.group(1) if self.form_name else slug.replace("-", "_") + "_inquiry"
        self.faq_n = 0

    # ---------- head ----------
    def meta(self, attr, key):
        el = self.soup.head.find("meta", attrs={attr: key})
        return el["content"] if el else ""

    def head(self):
        h = self.soup.head
        title = h.title.get_text(strip=True)
        out = []
        for s in h.find_all("script", attrs={"type": "application/ld+json"}):
            data = json.loads(s.string)
            out.append('  <script type="application/ld+json">\n' + json.dumps(data, indent=2, ensure_ascii=False)
                       + "\n  </script>")
        out.append('  <meta name="viewport" content="width=device-width, initial-scale=1">')
        out.append(f"  <title>{title}</title>")
        for attr, key in [("name", "description"), ("name", "author"), ("property", "og:type"),
                          ("property", "og:site_name"), ("property", "og:title"), ("property", "og:description"),
                          ("property", "og:url"), ("property", "og:image"), ("property", "og:image:width"),
                          ("property", "og:image:height"), ("property", "og:image:alt"), ("name", "twitter:card"),
                          ("name", "twitter:title"), ("name", "twitter:description"), ("name", "twitter:image")]:
            v = self.meta(attr, key)
            if v:
                out.append(f'  <meta {attr}="{key}" content="{v.replace(chr(34), "&quot;")}">')
        out.append('  <meta name="robots" content="index, follow, max-image-preview:large">')
        hero = self.hero_image()
        out += [
            '  <link rel="icon" href="/favicon.svg">',
            '  <link rel="preconnect" href="https://fonts.googleapis.com">',
            '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
            '  <link rel="dns-prefetch" href="https://www.googletagmanager.com">',
            f'  <link rel="preload" as="image" type="image/webp" href="/images/landing/{hero}-960.webp" '
            f'imagesrcset="{self.srcset(hero, "webp")}" imagesizes="100vw" fetchpriority="high">',
            '  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">',
            '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'">',
            '  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>',
            '  <link rel="stylesheet" href="/css/global.css">',
            '  <link rel="stylesheet" href="/css/chrome.css">',
            '  <link rel="stylesheet" href="/css/landing-mct.css">',
            '  <link rel="stylesheet" href="/css/faq.css">',
            '  <link rel="stylesheet" href="/css/landing-pkg.css">',
            f'  <link rel="canonical" href="{h.find("link", rel="canonical")["href"]}">',
        ]
        return "\n".join(out)

    def hero_image(self):
        src = self.soup.find("main").find("img")["src"]
        return re.sub(r"-(960|1280|1920)\.(jpg|webp)$", "", src.split("/")[-1])

    @staticmethod
    def srcset(hero, ext):
        return ", ".join(f"/images/landing/{hero}-{w}.{ext} {w}w" for w in (960, 1280, 1920))

    def breadcrumb(self):
        for s in self.soup.head.find_all("script", attrs={"type": "application/ld+json"}):
            data = json.loads(s.string)
            for node in data.get("@graph", [data]):
                if node.get("@type") == "BreadcrumbList":
                    items = node["itemListElement"]
                    lis = []
                    for i, it in enumerate(items):
                        url = it["item"] if isinstance(it["item"], str) else it["item"].get("@id", "")
                        if i == len(items) - 1:
                            lis.append(f'<li><span aria-current="page">{it["name"]}</span></li>')
                        else:
                            href = "./" if url.rstrip("/") + "/" == SITE else local_href(url, self.page)
                            lis.append(f'<li><a href="{href}">{it["name"]}</a></li>')
                    return ("    <nav class=\"landing-breadcrumb\" aria-label=\"Breadcrumb\">\n      <div class=\"figma-container\">\n"
                            "        <ol class=\"landing-breadcrumb__list\">\n          " + "\n          ".join(lis) +
                            "\n        </ol>\n      </div>\n    </nav>")
        return ""

    # ---------- buttons / links ----------
    def button(self, a, primary=None):
        cls = a.get("class") or []
        if primary is None:
            primary = any(c in cls for c in ("button-primary", "btn--primary"))
        new = self.soup.new_tag("a", href=local_href(a.get("href"), self.page))
        new["class"] = ["figma-btn", "figma-btn--solid" if primary else "figma-btn--outline-dark"]
        if a.get("data-track"):
            new["data-mct-track"] = "sm_cta_click"
            new["data-track-name"] = a["data-track"]
        for c in list(a.contents):
            new.append(c)
        return new

    def fix_links(self, root):
        for a in root.find_all("a"):
            if has(a, "button", "btn"):
                a.replace_with(self.button(a))
                continue
            a["href"] = local_href(a.get("href"), self.page)
            if a.get("data-track"):
                a["data-mct-track"] = "sm_cta_click"
                a["data-track-name"] = a["data-track"]
                del a["data-track"]
            if a.get("rel") and "noopener" in a["rel"] and not a.get("target"):
                del a["rel"]

    # ---------- hero ----------
    def hero(self, sec):
        img = sec.find("img")
        hero = self.hero_image()
        eyebrow = sec.find(class_="eyebrow")
        h1 = sec.find("h1")
        lead = sec.find("p", class_=lambda c: not c or "eyebrow" not in c) if not sec.find(class_="hero__lead") \
            else sec.find(class_="hero__lead")
        acts = sec.find(class_=["hero-actions", "hero__actions"])
        points = sec.find(class_=["hero-points", "hero__proof"])
        btns = [self.button(a) for a in acts.find_all("a")] if acts else []
        pts = [text(x) for x in points.find_all(["span", "li"])] if points else []
        acc_cls = "landing-hero__title-accent"
        return f"""    <section class="landing-hero" aria-labelledby="{self.slug}-hero-heading">
      <div class="landing-hero__plate landing-hero__plate--pkg landing-hero__plate--pkg-{self.tone}">
        <picture>
          <source type="image/webp" srcset="{self.srcset(hero, 'webp')}" sizes="100vw">
          <img class="landing-hero__media" src="/images/landing/{hero}-960.jpg" srcset="{self.srcset(hero, 'jpg')}" sizes="100vw" width="1920" height="900" alt="{(img.get('alt') or '').replace('"', '&quot;')}" loading="eager" fetchpriority="high" decoding="async">
        </picture>
        <div class="landing-hero__gradient" aria-hidden="true"></div>
        <div class="landing-hero__inner figma-container">
          <p class="figma-hero__pill"><span class="figma-hero__pill-dot" aria-hidden="true"></span>{text(eyebrow).upper()}</p>
          <h1 id="{self.slug}-hero-heading" class="landing-hero__title">{accent(text(h1)).format(cls=acc_cls)}</h1>
          <p class="landing-hero__lead landing-answer">{inner(lead)}</p>
          <div class="landing-hero__actions">
            {chr(10).join('            ' + str(b) for b in btns).strip()}
          </div>
          {('<ul class="landing-hero__points" aria-label="Highlights">' + "".join(f"<li>{p}</li>" for p in pts) + "</ul>") if pts else ""}
        </div>
      </div>
    </section>"""

    # ---------- generic block conversion ----------
    def convert_block(self, el):
        """Rewrite client classes to site components in place (el is inside a section)."""
        self.fix_links(el)
        for t in el.find_all(True):
            if t.get("style") and t.name != "div" or (t.get("style") and "grid-template" not in t["style"]):
                del t["style"]
        for t in el.find_all(class_="eyebrow"):
            t.name = "p"
            t["class"] = ["landing-eyebrow"]
        for t in el.find_all("h2"):
            t["class"] = ["landing-h2"]
            title = text(t)
            t.clear()
            t.append(BeautifulSoup(accent(title).format(cls="landing-h2__accent"), "html.parser"))
        for t in el.find_all("h3"):
            t["class"] = ["landing-h3"]
        for t in el.find_all(class_="answer"):
            t["class"] = ["landing-answer-box"]
            st = t.find("strong")
            nxt = st.next_sibling if st else None
            if isinstance(nxt, NavigableString) and nxt and not nxt[0].isspace():
                nxt.replace_with(" " + str(nxt))
        for t in el.find_all(class_="quote-strip"):
            t["class"] = ["landing-answer-box"]
        for t in el.find_all(class_=["checks", "check-list"]):
            t["class"] = ["landing-checks"]
        for t in el.find_all(class_=["note", "reviewed", "editorial-note", "fine-print"]):
            t["class"] = ["landing-reviewed"]
        for t in el.find_all(class_=["icon", "card__icon"]):
            t["class"] = ["landing-card-icon"]
        for t in el.find_all(class_=["tag", "duration"]):
            t["class"] = ["landing-tag"] + (["landing-tag--muted"] if has(t, "offline") else [])
        for t in el.find_all(class_=["card", "lane", "monitor-card", "role-card", "service-card"]):
            t["class"] = ["landing-feature-card"]
            if not t.get("role") and t.parent and has(t.parent, "landing-feature-grid"):
                t["role"] = "listitem"
        for t in el.find_all(class_=["grid", "trust-grid", "monitor-grid", "benefit-grid"]):
            two = has(t, "grid-2") or has(t, "benefit-grid")
            t["class"] = ["landing-feature-grid"] + (["landing-feature-grid--2"] if two else [])
            for c in t.find_all(class_="landing-feature-card", recursive=False):
                c["role"] = "listitem"
            t["role"] = "list"
        for t in el.find_all(class_=["panel", "program-panel"]):
            t["class"] = ["landing-spec-panel"]
            for ul in t.find_all("ul"):
                ul["class"] = ["landing-checks"]
        for t in el.find_all(class_="feature-panel"):
            t["class"] = ["landing-panel"]
        for t in el.find_all(class_="stat-row"):
            t["class"] = ["landing-spec-list"]
        for t in el.find_all(class_="stat"):
            t["class"] = ["landing-stat"]
        for t in el.find_all(class_="status-grid"):
            t["class"] = ["landing-status-grid"]
        for t in el.find_all(class_="status"):
            t["class"] = ["landing-status"]
        for t in el.find_all(class_=["connect", "flow"]):
            t["class"] = ["landing-path"]
        for t in el.find_all(class_=["arrow", "flow-arrow"]):
            t["class"] = ["landing-path__arrow"]
        for t in el.find_all(class_="flow-step"):
            t["class"] = ["landing-path__step"]
        for t in el.find_all(class_="boundary"):
            t["class"] = ["landing-note", "landing-note--info"]
            for h in t.find_all("h3"):
                h.name = "p"
                h["class"] = ["landing-note__title"]
            for p in t.find_all("p"):
                if "landing-note__title" not in (p.get("class") or []):
                    p["class"] = ["landing-note__body"]
        for t in el.find_all(class_=["two-col", "definition", "split"]):
            if t.name in ("div",):
                t["class"] = ["landing-definition"]
        for t in el.find_all("p"):
            if not t.get("class"):
                t["class"] = ["landing-p"]
            elif "lede" in t["class"]:
                t["class"] = ["landing-p", "landing-lede"]
        for t in el.find_all("ul"):
            if not t.get("class") and t.parent and not has(t.parent, "landing-spec-panel"):
                t["class"] = ["landing-list"]
        # status-card phone illustration (ambulatory)
        for t in el.find_all(class_="status-card"):
            t["class"] = ["landing-phone-card"]
        for t in el.find_all(class_="status-card__phone"):
            t["class"] = ["landing-phone-card__phone"]
        for t in el.find_all(class_="status-card__screen"):
            t["class"] = ["landing-phone-card__screen"]
        for t in el.find_all(class_="phone-action"):
            t["class"] = ["landing-phone-card__action"]
        for t in el.find_all(class_="carrier-row"):
            t["class"] = ["landing-carriers"]
        self.workflows(el)
        self.tables(el)

    def workflows(self, el):
        for wf in el.find_all(class_="workflow"):
            steps = wf.find_all(class_=["step", "workflow__step"])
            ol = self.soup.new_tag("ol")
            ol["class"] = ["landing-flow", "landing-flow--pkg"]
            ol["data-steps"] = str(len(steps))
            for st in steps:
                li = self.soup.new_tag("li")
                li["class"] = ["landing-flow__step"]
                strong = self.soup.new_tag("strong")
                strong.string = text(st.find("h3"))
                span = self.soup.new_tag("span")
                p = st.find("p")
                for c in list(p.contents if p else []):
                    span.append(c)
                li.append(strong)
                li.append(span)
                ol.append(li)
            wf.replace_with(ol)

    def tables(self, el):
        for table in el.find_all("table"):
            wrap = table.find_parent(class_=["table-wrap", "paths"])
            heads = [text(th) for th in table.find("thead").find_all("th")]
            for tr in table.find("tbody").find_all("tr"):
                cells = tr.find_all(["td", "th"])
                first = cells[0]
                first.name = "th"
                first["scope"] = "row"
                for k in ("class",):
                    if first.get(k):
                        del first[k]
                if not first.find("a"):
                    name = text(first)
                    for pat, href in PAGE_LINKS:
                        if re.search(pat, name, re.I) and href != self.page:
                            a = self.soup.new_tag("a", href=href)
                            a.string = name
                            first.clear()
                            first.append(a)
                            break
                for td, h in zip(cells[1:], heads[1:]):
                    td["data-label"] = h
                    if has(td, "yes"):
                        td["class"] = ["landing-yes"]
                    elif has(td, "no"):
                        td["class"] = ["landing-no"]
            for th in table.find("thead").find_all("th"):
                th["scope"] = "col"
            table["class"] = ["landing-table", "landing-table--stack"]
            new_wrap = self.soup.new_tag("div")
            new_wrap["class"] = ["landing-table-wrap"]
            new_wrap["role"] = "region"
            new_wrap["tabindex"] = "0"
            h2 = el.find("h2")
            new_wrap["aria-label"] = text(h2) if h2 else "Comparison table"
            table.extract()
            new_wrap.append(table)
            if wrap:
                wrap.replace_with(new_wrap)
            else:
                el.append(new_wrap)

    # ---------- FAQ ----------
    def faq(self, sec):
        title_el = sec.find("h2")
        eyebrow = sec.find(class_="eyebrow")
        items = []
        for i, d in enumerate(sec.find_all("details")):
            q = text(d.find("summary"))
            d.find("summary").extract()
            a = inner(d).strip()
            fid = f"{self.slug}-{i}"
            first = i == 0
            items.append(f"""<div class="faq-item{' is-open' if first else ''}">
      <button type="button" id="faq-trigger-{fid}" class="faq-item__trigger" aria-expanded="{'true' if first else 'false'}" aria-controls="faq-panel-{fid}">
        <span class="faq-item__q">{q}</span>
        {CHEVRON.format(c=' is-open' if first else '')}
      </button>
      <div id="faq-panel-{fid}" role="region" aria-labelledby="faq-trigger-{fid}" class="faq-item__panel"{'' if first else ' hidden'}>
        {a}
      </div>
    </div>""")
        sid = sec.get("id") or "faq"
        return f"""    <section class="figma-section faq-accordion landing-section landing-faq landing-section--muted" id="{sid}" aria-labelledby="{self.slug}-faq-heading">
      <div class="figma-container faq-accordion__inner">
        {('<p class="landing-eyebrow">' + text(eyebrow) + '</p>') if eyebrow else ''}
        <h2 id="{self.slug}-faq-heading" class="landing-h2">{accent(text(title_el)).format(cls="landing-h2__accent")}</h2>
        <div class="faq-category">
          <div class="faq-category__list">
{chr(10).join(items)}
          </div>
        </div>
      </div>
    </section>"""

    # ---------- form ----------
    def form_section(self, sec):
        form = sec.find("form")
        copy_col = form.find_previous_sibling("div") or sec.find("div", class_=lambda c: c and "cta-grid" not in c)
        copy_col = copy.copy(copy_col)
        self.convert_block(copy_col)
        h2 = copy_col.find("h2")
        h2_text = text(h2)
        h2.decompose()
        eyebrow = copy_col.find(class_="landing-eyebrow")
        if eyebrow:
            eyebrow.decompose()
        subject = form.find("input", attrs={"name": "subject"})
        from_name = form.find("input", attrs={"name": "from_name"})
        submit = form.find(["button", "input"], attrs={"type": "submit"})
        notices = form.find_all(class_=["privacy", "privacy-note", "fine-print"])
        fields = []
        for f in form.find_all(class_=lambda c: c and ("field" in c.split() or "field--full" in c.split())):
            label = f.find("label")
            ctrl = f.find(["input", "select", "textarea"])
            if not label or not ctrl or ctrl.get("type") in ("hidden", "checkbox"):
                continue
            full = has(f, "full", "field--full") or ctrl.name in ("textarea",)
            fields.append((label, ctrl, full))
        if not fields:  # forms without .field wrappers: label + control pairs
            for label in form.find_all("label"):
                ctrl = form.find(id=label.get("for")) if label.get("for") else label.find(["input", "select", "textarea"])
                if ctrl and ctrl.get("type") not in ("hidden", "checkbox"):
                    fields.append((label, ctrl, ctrl.name == "textarea"))
        rows, pending = [], []

        def field_html(label, ctrl, full):
            req = ctrl.has_attr("required")
            lab_el = copy.copy(label)
            for c in lab_el.find_all(["input", "select", "textarea"]):
                c.decompose()
            lab = text(lab_el).rstrip("*").strip()
            mark = ' <abbr title="required">*</abbr>' if req else ' <span class="landing-cta-form__optional">(optional)</span>'
            if ctrl.name == "select":
                mark = "" if not req else mark
            c = copy.copy(ctrl)
            for k in ("id", "class"):
                if c.get(k):
                    del c[k]
            if c.name == "input" and not c.get("type"):
                c["type"] = "text"
            return (f'              <label class="landing-cta-form__field{" landing-cta-form__field--full" if full else ""}">\n'
                    f'                <span class="landing-cta-form__label">{lab}{mark}</span>\n'
                    f'                {c}\n              </label>')

        for label, ctrl, full in fields:
            if full:
                if pending:
                    rows.append(pending)
                    pending = []
                rows.append([(label, ctrl, True)])
            else:
                pending.append((label, ctrl, False))
                if len(pending) == 2:
                    rows.append(pending)
                    pending = []
        if pending:
            rows.append(pending)
        rows_html = "\n".join('            <div class="landing-cta-form__row">\n' + "\n".join(field_html(*f) for f in r)
                              + "\n            </div>" for r in rows)
        hidden = "\n".join(f'            <input type="hidden" name="{f}" value="">' for f in CAMPAIGN)
        priv = " ".join(inner(n) for n in notices) if notices else (
            "<strong>Do not submit protected health information (PHI).</strong> "
            "This form is for business and service inquiries only.")
        priv = re.sub(r'href="/privacy\.html"', 'href="privacy.html"', priv)
        priv = re.sub(r'href="https://www\.specialized-med\.com/privacy\.html"', 'href="privacy.html"', priv)
        label = text(submit) if submit.name == "button" else submit.get("value", "Submit")
        sid = "request-demo"
        self.form_id = sid
        return f"""    <section class="landing-section landing-cta-block" id="{sid}" aria-labelledby="{self.slug}-cta-heading">
      <div class="figma-container">
        <div class="landing-cta-block__box">
          <div class="landing-cta-block__copy">
            <h2 id="{self.slug}-cta-heading" class="landing-h2">{h2_text}</h2>
            {inner(copy_col)}
          </div>
          <form class="landing-cta-form" action="https://api.web3forms.com/submit" method="POST" data-form-name="{self.form_name}" data-track-start="demo_form_start" data-track-submit="sm_lead_form_submit_attempt" data-track-error="demo_form_error" data-track-success="none" data-success-message="Thank you. Your request has been sent to the Specialized Medical team." data-error-message="We could not confirm that your request was sent. Please try again or call 1-855-773-2633.">
            <input type="hidden" name="access_key" value="{ACCESS_KEY}">
            <input type="hidden" name="subject" value="{subject['value'] if subject else 'Website inquiry'}">
            <input type="hidden" name="from_name" value="{from_name['value'] if from_name else 'Specialized Medical website'}">
            <input type="hidden" name="from_page" value="{self.slug}">
            <input type="hidden" name="redirect" value="">
            <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
{hidden}
{rows_html}
            <p class="landing-cta-form__note">{priv}</p>
            <button type="submit" class="figma-btn figma-btn--solid landing-cta-form__submit">{label}</button>
            <p class="landing-cta-form__status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>"""

    # ---------- sections ----------
    def section(self, sec):
        if sec.find("form"):
            return self.form_section(sec)
        if sec.find("details"):
            return self.faq(sec)
        cls = sec.get("class") or []
        muted = any(c in cls for c in ("soft", "section--soft", "dark", "section--navy"))
        callout = sec.find(class_="callout")
        container = sec.find(class_="container") or sec
        head = container.find(class_="section-head", recursive=False) or sec.find(class_="section-head")
        centered = bool(head and has(head, "center"))
        two_col = container is not sec and has(container, "two-col", "definition", "split")
        self.convert_block(container)
        if head:
            for p in head.find_all("p"):
                if "landing-eyebrow" not in (p.get("class") or []):
                    p["class"] = ["landing-p", "landing-section__intro"]
            head.unwrap()
        if callout:
            callout["class"] = ["landing-callout-band"]
            for a in callout.find_all("a", class_="figma-btn"):
                a["class"] = ["figma-btn", "figma-btn--solid"]
        classes = ["landing-section"] + (["landing-section--muted"] if muted else []) + \
                  (["landing-section--center"] if centered else [])
        attrs = f' id="{sec["id"]}"' if sec.get("id") else ""
        h2 = container.find("h2")
        if h2 and not h2.get("id"):
            self.sec_n = getattr(self, "sec_n", 0) + 1
            h2["id"] = f"{self.slug}-s{self.sec_n}-heading"
        label = f' aria-labelledby="{h2["id"]}"' if h2 else (f' aria-label="{sec.get("aria-label")}"' if sec.get("aria-label") else "")
        if container.get("class"):
            container["class"] = ["figma-container"] + (["landing-definition"] if two_col else []) + \
                [c for c in container["class"] if c.startswith("landing-")]
        return f'    <section class="{" ".join(classes)}"{attrs}{label}>\n      {container}\n    </section>'

    def trustbar(self, div):
        items = [(text(i.find("strong")), text(i.find("span"))) for i in div.find_all(class_="trustitem")]
        lis = "".join(f"<li><strong>{a}</strong><span>{b}</span></li>" for a, b in items)
        return (f'    <section class="landing-section landing-section--muted landing-section--trust" aria-label="{div.get("aria-label") or "Overview"}">\n'
                f'      <div class="figma-container"><ul class="landing-trust-strip">{lis}</ul></div>\n    </section>')

    def loose_container(self, div):
        """Top-level <div class="container"> blocks (ambulatory definition/editorial note)."""
        self.convert_block(div)
        for p in div.find_all("p", class_="definition"):
            p["class"] = ["landing-answer-box"]
        for p in div.find_all("p"):
            if p.get("class") == ["landing-p"] and "definition" in str(p.get("class")):
                pass
        div["class"] = ["figma-container"]
        return f'    <section class="landing-section landing-section--intro" aria-label="Definition">\n      {div}\n    </section>'

    def main(self):
        main = self.soup.find("main")
        out = [self.breadcrumb()]
        for child in main.children:
            if not isinstance(child, Tag):
                continue
            if child.name == "section" and has(child, "hero"):
                out.append(self.hero(child))
            elif has(child, "trustbar"):
                out.append(self.trustbar(child))
            elif child.name == "section":
                out.append(self.section(child))
            elif child.name == "div" and has(child, "container"):
                out.append(self.loose_container(child))
        return "\n\n".join(out)

    def build(self):
        template = (ROOT / "post-tavr-cardiac-monitoring.html").read_text(encoding="utf8")
        lines = template.split("\n")
        i_base = next(i for i, l in enumerate(lines) if "<!-- sm-site-base -->" in l)
        i_head_end = next(i for i, l in enumerate(lines) if "</head>" in l)
        i_main = next(i for i, l in enumerate(lines) if "<main" in l)
        i_foot = next(i for i, l in enumerate(lines) if '<footer class="site-footer' in l)
        top = "\n".join(lines[: i_base + 1]).replace('<html lang="en">', '<html lang="en-US">')
        if f'"{self.slug}"' not in top:
            top = top.replace('"post-tavr-cardiac-monitoring": 1',
                              f'"post-tavr-cardiac-monitoring": 1,\n          "{self.slug}": 1')
        header = "\n".join(lines[i_head_end:i_main])
        # header CTA -> this page's form
        header = re.sub(r'href="post-tavr-cardiac-monitoring\.html#cta-form" data-mct-track="tavr_cta_demo"',
                        f'href="{self.page}#request-demo" data-mct-track="sm_cta_click" data-track-name="header_demo"',
                        header)
        header = header.replace("Request a Post-TAVR Demo", "Request a Demo")
        header = header.replace("/post-tavr-cardiac-monitoring/#main-content", f"{self.page}#main-content")
        header = header.replace("post-tavr-cardiac-monitoring.html#main-content", f"{self.page}#main-content")
        body = self.main()
        old_form = self.soup.find("main").find("form")
        old_ids = {old_form.get("id")} | {old_form.find_parent("section").get("id")} if old_form else set()
        for oid in filter(None, old_ids):
            if oid != "request-demo":
                body = body.replace(f'{self.page}#{oid}"', f'{self.page}#request-demo"')
        main_open = (f'    <main class="landing-page landing-page--pkg services-page services-page--figma" '
                     f'data-landing="{self.slug}" data-service-id="{self.slug.replace("-", "_")}" id="main-content" tabindex="-1">')
        disclaimer = self.soup.find(class_="copyright")
        disc = re.sub(r"^©\s*\d{4}\s*Specialized Medical LLC\.\s*", "", text(disclaimer)) if disclaimer else ""
        disc_html = (f'\n\n    <section class="landing-disclaimer" aria-label="Information notice">\n      <div class="figma-container">\n'
                     f'        <p class="landing-disclaimer__text">{disc}</p>\n      </div>\n    </section>') if disc else ""
        out = (top + "\n" + self.head() + "\n" + header + "\n" + main_open + "\n" + body + disc_html + "\n  </main>\n"
               + "\n".join(lines[i_foot:]))
        out = out.replace("{cls}", "")  # safety: no unformatted accent placeholders
        (ROOT / self.page).write_text(out, encoding="utf8")
        return self.page


if __name__ == "__main__":
    src, slug, tone = sys.argv[1], sys.argv[2], sys.argv[3]
    print("built", Converter(src, slug, tone).build())
