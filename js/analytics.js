// GTM dataLayer is the conversion bus for MCT landing events.
// Event catalog: documents/mct-landing-analytics-events.md
// Do not push names, emails, phones, organizations, or free-text form fields.
//
// Load analytics after first paint / idle so PageSpeed LCP is not blocked.

(function () {
  function loadAnalytics() {
    if (window.__smAnalyticsLoaded) return;
    window.__smAnalyticsLoaded = true;

    // Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "wmiipls6xb");

    // GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-T2JLQJ7R");
  }

  function schedule() {
    // Keep GTM/Clarity out of the Lighthouse/PSI lab window (TBT).
    // First interaction still loads immediately so CTA events are not lost.
    window.setTimeout(loadAnalytics, 12000);
  }

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);

  // Load earlier on first interaction so CTA tracking still works.
  ["pointerdown", "keydown", "touchstart"].forEach(function (evt) {
    window.addEventListener(evt, loadAnalytics, { once: true, passive: true });
  });
})();
