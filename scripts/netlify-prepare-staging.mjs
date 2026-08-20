/**
 * Netlify-only: make staging self-referencing so AI/AEO tools that follow
 * canonical analyze this deploy instead of production specialized-med.com.
 *
 * Runs only when NETLIFY=true (set automatically by Netlify CI).
 * Local / Apache production copies keep production canonicals unchanged.
 *
 * Usage (via netlify.toml): node scripts/netlify-prepare-staging.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs"
import { join, extname, dirname } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PROD = "https://www.specialized-med.com"

function siteOrigin() {
  const raw =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.DEPLOY_URL ||
    "https://zesty-pothos-c8949b.netlify.app"
  return String(raw).replace(/\/$/, "")
}

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === ".tmp-screenshots") continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walkHtml(p, out)
    else if (extname(name).toLowerCase() === ".html") out.push(p)
  }
  return out
}

function rewriteHtml(html, origin) {
  let next = html
  // Canonical + Open Graph / Twitter absolute URLs → this Netlify origin
  next = next.replaceAll(`${PROD}/`, `${origin}/`)
  next = next.replaceAll(PROD, origin)
  // Ensure pages stay indexable for tools that check robots meta
  next = next.replace(
    /<meta\s+name="robots"\s+content="noindex"[^>]*>/gi,
    '<meta name="robots" content="index, follow">'
  )
  return next
}

function rewriteRobots(origin) {
  return `User-agent: *
Allow: /

# Explicit allow for common AI / answer-engine crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Block admin or sensitive areas if they exist
Disallow: /cgi-bin/
Disallow: /admin/
Disallow: /login/
Disallow: /tmp/
Disallow: /*.jsp

# Allow important assets
Allow: /*.css$
Allow: /*.js$

# Sitemap for this Netlify deploy
Sitemap: ${origin}/sitemap.xml
`
}

function rewriteSitemap(xml, origin) {
  return xml.replaceAll(`${PROD}/`, `${origin}/`).replaceAll(PROD, origin)
}

function main() {
  if (process.env.NETLIFY !== "true") {
    console.log("Skipping netlify-prepare-staging (NETLIFY != true). Production files unchanged.")
    return
  }

  const origin = siteOrigin()
  console.log(`Preparing Netlify staging for AI/tool fetchability at ${origin}`)

  let htmlCount = 0
  for (const file of walkHtml(ROOT)) {
    const before = readFileSync(file, "utf8")
    const after = rewriteHtml(before, origin)
    if (after !== before) {
      writeFileSync(file, after)
      htmlCount++
    }
  }

  writeFileSync(join(ROOT, "robots.txt"), rewriteRobots(origin))

  const sitemapPath = join(ROOT, "sitemap.xml")
  try {
    const sm = readFileSync(sitemapPath, "utf8")
    writeFileSync(sitemapPath, rewriteSitemap(sm, origin))
  } catch {
    console.warn("sitemap.xml not found; skipped")
  }

  console.log(`Updated ${htmlCount} HTML file(s), robots.txt, and sitemap for ${origin}`)
}

main()
