package com.specializedmedical.web;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Permanent (301) redirects from former published addresses to the current
 * .html pages on Tomcat 9, which does not read .htaccess.
 *
 * Covers the legacy .jsp pages and the trailing-slash / extensionless forms
 * of every page (these were listed in the old sitemap and may still be
 * bookmarked or linked). Matching ignores case. The query string, such as
 * campaign tags, is kept. Each redirect is a single hop to the final page.
 *
 * Optional init-param "canonicalOrigin" (e.g. https://www.specialized-med.com)
 * makes every redirect target that origin; without it the request's own
 * scheme and host are used.
 */
public class LegacyUrlRedirectFilter implements Filter {

    private static final String[] PAGES = {
        "about", "services", "services/equipment", "faq", "contact", "clinical-stories",
        "privacy", "thanks",
        "mobile-cardiac-telemetry-mct", "post-tavr-cardiac-monitoring",
        "holter-monitoring-services", "long-term-holter-monitoring",
        "extended-holter-monitoring-8-14-days",
        "cardiac-event-monitoring", "live-ecg-monitoring", "s-patch-cardiac-monitoring-system",
        "cardiac-monitoring-services", "ambulatory-cardiac-monitoring",
        "cardiology-practice-cardiac-monitoring",
    };

    static final Map<String, String> REDIRECTS;

    static {
        Map<String, String> m = new HashMap<>();
        m.put("/index.html", "/");
        m.put("/index.jsp", "/");
        m.put("/about.jsp", "/about.html");
        m.put("/services.jsp", "/services.html");
        m.put("/faq.jsp", "/faq.html");
        m.put("/contact.jsp", "/contact.html");
        for (String page : PAGES) {
            m.put("/" + page, "/" + page + ".html");
            m.put("/" + page + "/", "/" + page + ".html");
        }
        REDIRECTS = Collections.unmodifiableMap(m);
    }

    private String canonicalOrigin;

    @Override
    public void init(FilterConfig filterConfig) {
        String origin = filterConfig.getInitParameter("canonicalOrigin");
        if (origin != null && !origin.trim().isEmpty()) {
            canonicalOrigin = origin.trim().replaceAll("/+$", "");
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI().substring(req.getContextPath().length());
        String target = REDIRECTS.get(path.toLowerCase(Locale.ROOT));

        if (target == null) {
            chain.doFilter(request, response);
            return;
        }

        String origin = canonicalOrigin != null ? canonicalOrigin : requestOrigin(req);
        String location = origin + req.getContextPath() + target;
        String query = req.getQueryString();
        if (query != null && !query.isEmpty()) {
            location += "?" + query;
        }

        res.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
        res.setHeader("Location", location);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setContentLength(0);
    }

    private static String requestOrigin(HttpServletRequest req) {
        String scheme = req.getScheme();
        int port = req.getServerPort();
        boolean defaultPort = ("http".equals(scheme) && port == 80) || ("https".equals(scheme) && port == 443);
        return scheme + "://" + req.getServerName() + (defaultPort ? "" : ":" + port);
    }

    @Override
    public void destroy() {
    }
}
