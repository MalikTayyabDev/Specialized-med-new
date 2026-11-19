package com.specializedmedical.web;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.regex.Pattern;

/**
 * Cache policy for the Specialized Medical site on Tomcat 9.
 *
 * HTML pages (/, *.html, *.htm, *.jsp, and extensionless or trailing-slash
 * routes) get "no-cache, max-age=0, must-revalidate", so browsers check with
 * the server before reusing a cached page. Tomcat's DefaultServlet answers
 * that check with 304 Not Modified when the file is unchanged, so repeat
 * visits stay fast.
 *
 * Static assets requested with a ?v= version (added by
 * scripts/cache-bust.mjs, which changes the version whenever the file's
 * content changes) are cached for a year, because any update produces a new
 * URL. All other responses are left untouched.
 */
public class HtmlCacheFilter implements Filter {

    static final String HTML_POLICY = "no-cache, max-age=0, must-revalidate";
    static final String VERSIONED_ASSET_POLICY = "public, max-age=31536000, immutable";

    private static final Pattern VERSION_PARAM = Pattern.compile("(^|&)v=[^&]+");
    private static final Pattern ASSET_EXTENSION = Pattern.compile(
        "\\.(css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm)$",
        Pattern.CASE_INSENSITIVE);

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI().substring(req.getContextPath().length());

        if (isHtmlRoute(path)) {
            res.setHeader("Cache-Control", HTML_POLICY);
        } else if (isVersionedAsset(path, req.getQueryString())) {
            res.setHeader("Cache-Control", VERSIONED_ASSET_POLICY);
        }

        chain.doFilter(request, response);
    }

    static boolean isHtmlRoute(String path) {
        String lower = path.toLowerCase();
        if (lower.isEmpty() || lower.endsWith("/")) {
            return true;
        }
        if (lower.endsWith(".html") || lower.endsWith(".htm") || lower.endsWith(".jsp")) {
            return true;
        }
        // Extensionless routes such as /about (no dot in the last path segment)
        String lastSegment = lower.substring(lower.lastIndexOf('/') + 1);
        return !lastSegment.contains(".");
    }

    static boolean isVersionedAsset(String path, String query) {
        return query != null
            && VERSION_PARAM.matcher(query).find()
            && ASSET_EXTENSION.matcher(path).find();
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
