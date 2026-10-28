/**
 * Lean behaviors for SEO landing pages (nav, FAQ, footer year, MCT form/analytics).
 * Avoids homepage video/carousel/contact baggage from main.js (~27KB → ~8KB).
 */
(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function getSiteRootPath() {
    var scripts = Array.prototype.slice.call(document.scripts || []);
    var script = scripts.find(function (s) {
      return (s.getAttribute("src") || "").indexOf("js/landing-lite.js") !== -1 ||
        (s.getAttribute("src") || "").indexOf("js/main.js") !== -1;
    });
    var src = script && script.src;
    if (!src) return "";
    try {
      var u = new URL(src, window.location.href);
      var p = u.pathname || "";
      var idx = p.lastIndexOf("/js/");
      return idx >= 0 ? p.slice(0, idx) : "";
    } catch (e) {
      return "";
    }
  }

  var SITE_ROOT = getSiteRootPath();

  function siteBaseUrl() {
    var r = SITE_ROOT || "";
    if (!r) return String(window.location.origin || "") + "/";
    return String(window.location.origin || "") + (r.endsWith("/") ? r : r + "/");
  }

  function normalizeRootAbsoluteHref(href) {
    if (!href || typeof href !== "string") return href;
    if (href.startsWith("//") || !href.startsWith("/")) return href;
    try {
      return String(new URL(href.slice(1) || "./", siteBaseUrl()));
    } catch (e) {
      return href;
    }
  }

  function initInternalRootLinks() {
    qsa("a[href]").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (!h.startsWith("/") || h.startsWith("//")) return;
      try {
        a.setAttribute("href", normalizeRootAbsoluteHref(h));
      } catch (_) {}
    });
  }

  function fixRelativeAnchorsToSiteRoot() {
    var root = siteBaseUrl();
    qsa("a[href]").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (!h || /^(https?:|mailto:|tel:)/i.test(h) || h.startsWith("//") || h.startsWith("/") || h.startsWith("../")) return;
      // Keep same-page hash links on the current document. A <base href="/"> would
      // otherwise send #cta-form / #main-content to the homepage.
      if (h.charAt(0) === "#") {
        try {
          a.setAttribute("href", String(window.location.pathname || "") + String(window.location.search || "") + h);
        } catch (_) {}
        return;
      }
      try {
        a.setAttribute("href", String(new URL(h, root)));
      } catch (_) {}
    });
  }

  function initNav() {
    var header = qs(".site-header");
    var toggle = qs(".nav-toggle", header);
    var overlay = qs(".nav-overlay", header);
    var inner = qs(".site-header__inner", header);
    if (!toggle || !inner) return;

    function setOpen(open) {
      inner.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (overlay) overlay.hidden = !open;
      document.documentElement.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(!inner.classList.contains("nav-open"));
    });
    if (overlay) {
      overlay.addEventListener("click", function () {
        setOpen(false);
      });
    }
    qsa("a", qs("#primary-nav")).forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function initFooterYear() {
    var el = qs("#footer-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initFaqAccordion() {
    qsa(".faq-item__trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panelId = btn.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        var item = btn.closest(".faq-item");
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (panel) {
          if (expanded) panel.setAttribute("hidden", "");
          else panel.removeAttribute("hidden");
        }
        if (item) item.classList.toggle("is-open", !expanded);
        var chev = qs(".faq-item__chevron", btn);
        if (chev) chev.classList.toggle("is-open", !expanded);
      });
    });
  }

  function pushSmEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  function initLandingAnalytics() {
    var landing = qs("[data-landing]");
    if (!landing) return;
    var slug = landing.getAttribute("data-landing") || "";
    // Scope includes header/footer chrome so CTA/portal/phone events still fire.
    var root = qs(".site-root") || document;

    qsa("[data-mct-track]", root).forEach(function (el) {
      el.addEventListener("click", function () {
        var name = el.getAttribute("data-mct-track") || "";
        if (name) pushSmEvent(name, { landing_page: slug });
      });
    });

    qsa('a[href^="tel:"]', root).forEach(function (a) {
      if (a.getAttribute("data-mct-track")) return;
      a.addEventListener("click", function () {
        pushSmEvent("phone_click", { landing_page: slug });
      });
    });

    qsa('a[href*="specialized-med-business.com"]', root).forEach(function (a) {
      if (a.getAttribute("data-mct-track")) return;
      a.addEventListener("click", function () {
        pushSmEvent("portal_click", { landing_page: slug });
      });
    });

    qsa(".landing-cta-form", landing).forEach(function (form) {
      var started = false;
      form.addEventListener(
        "focusin",
        function () {
          if (started) return;
          started = true;
          pushSmEvent("mct_form_start", { landing_page: slug });
        },
        true
      );
    });
  }

  function initLandingCtaForms() {
    qsa(".landing-cta-form").forEach(function (form) {
      var submitBtn = qs('button[type="submit"]', form);
      var statusEl = qs(".landing-cta-form__status", form);

      function setStatus(msg, isError) {
        if (!statusEl) return;
        statusEl.textContent = msg || "";
        statusEl.style.color = isError ? "#c9222f" : "rgba(35,31,30,0.7)";
      }

      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (submitBtn && submitBtn.disabled) return;
        var fd = new FormData(form);
        try {
          var redirectEl = form.querySelector('input[name="redirect"]');
          if (redirectEl && !redirectEl.value) {
            redirectEl.value = String(new URL("thanks/", siteBaseUrl()));
            fd.set("redirect", redirectEl.value);
          }
        } catch (_) {}
        if (!fd.get("access_key")) {
          fd.append("access_key", "8ec7a28a-1979-4c39-8791-18fbf60bba44");
        }

        var originalText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
          submitBtn.textContent = "Sending...";
          submitBtn.disabled = true;
        }
        setStatus("Sending…", false);

        try {
          var response = await fetch(form.getAttribute("action") || "https://api.web3forms.com/submit", {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
          var data = await response.json().catch(function () {
            return null;
          });
          if (response.ok && data && data.success === true) {
            setStatus("Success! Your request has been sent.", false);
            try {
              var landingEl = qs("[data-landing]");
              pushSmEvent("mct_form_success", {
                landing_page: landingEl ? landingEl.getAttribute("data-landing") || "" : "",
                form_interest: String(fd.get("interest") || ""),
              });
            } catch (_) {}
            var dest = String(new URL("thanks/", siteBaseUrl()));
            try {
              var rEl = form.querySelector('input[name="redirect"]');
              if (rEl && rEl.value) dest = String(rEl.value);
            } catch (_) {}
            try {
              window.sessionStorage.setItem("sm_form_submitted", "1");
            } catch (_) {}
            window.setTimeout(function () {
              window.location.assign(dest);
            }, 50);
            return;
          }
          setStatus("Error: " + ((data && data.message) || "Unable to send. Please try again."), true);
        } catch (error) {
          try {
            form.submit();
            return;
          } catch (_) {}
          setStatus("Something went wrong. Please try again.", true);
        } finally {
          if (submitBtn) {
            submitBtn.textContent = originalText || "Submit";
            submitBtn.disabled = false;
          }
        }
      });
    });
  }

  function initCtaFormScrollOffset() {
    if (!window.location.hash || window.location.hash.toLowerCase() !== "#cta-form") return;
    var target = qs("#cta-form");
    if (!target) return;
    window.setTimeout(function () {
      try {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        var first = qs("input, select, textarea, button", target);
        if (first) first.focus({ preventScroll: true });
      } catch (_) {}
    }, 50);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fixRelativeAnchorsToSiteRoot();
    initInternalRootLinks();
    initNav();
    initFooterYear();
    initFaqAccordion();
    initLandingCtaForms();
    initLandingAnalytics();
    initCtaFormScrollOffset();
  });
})();
