/**
 * Switch the whole site between staging (noindex) and production (index).
 *
 *   npm run seo:noindex   # staging: every page noindex,nofollow + X-Robots-Tag header on Tomcat
 *   npm run seo:index     # production: pages index,follow; header removed
 *   npm run seo:status    # report the current state (exit 1 if pages disagree)
 *
 * Pages: every *.html with a <head> at the root and in services/ (head-less
 * include fragments are skipped). thanks.html and 404.html are always noindex. Each page gets exactly one
 * <meta name="robots">. WEB-INF/web.xml robotsTag init-param is set to match.
 * robots.txt is NOT changed: crawlers must be able to fetch pages to see noindex.
 *
 * Run it again after regenerating any page (the page builders write "index").
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const mode = (process.argv[2] || "").toLowerCase()
if (!["index", "noindex", "status"].includes(mode)) {
  console.error("Usage: node scripts/set-indexing.mjs <noindex|index|status>")
  process.exit(1)
}

const ALWAYS_NOINDEX = new Set(["thanks.html", "404.html"])
const INDEX = "index, follow, max-image-preview:large"
const NOINDEX = "noindex, nofollow"
const ROBOTS_RE = /[ \t]*<meta\s+name=["']robots["'][^>]*>\r?\n?/gi

const pages = [
  ...fs.readdirSync(root).filter((f) => f.endsWith(".html")),
  ...fs.readdirSync(path.join(root, "services")).filter((f) => f.endsWith(".html")).map((f) => "services/" + f),
].filter((rel) => /<head[\s>]/i.test(fs.readFileSync(path.join(root, rel), "utf8")))

// Prepare every change first, then write, so a failure never leaves the site half switched.
const writes = []

const state = {}
for (const rel of pages) {
  const file = path.join(root, rel)
  let html = fs.readFileSync(file, "utf8")
  const tags = html.match(ROBOTS_RE) || []
  const current = tags.map((t) => (t.match(/content=["']([^"']*)["']/i) || [])[1] || "").join(" | ") || "(none)"
  state[rel] = current
  if (mode === "status") continue

  const want = ALWAYS_NOINDEX.has(rel) || mode === "noindex" ? (ALWAYS_NOINDEX.has(rel) ? "noindex" : NOINDEX) : INDEX
  const tag = `  <meta name="robots" content="${want}">`
  const nl = html.includes("\r\n") ? "\r\n" : "\n"
  html = html.replace(ROBOTS_RE, "")
  const anchor = html.match(/<meta\s+name=["']viewport["'][^>]*>\r?\n?/i) || html.match(/<meta\s+charset=[^>]*>\r?\n?/i)
  if (!anchor) throw new Error(`No <meta viewport/charset> to anchor robots tag in ${rel}`)
  const at = anchor.index + anchor[0].length
  const sep = anchor[0].endsWith("\n") ? "" : nl
  html = html.slice(0, at) + sep + tag + nl + html.slice(at)
  writes.push([file, html])
  state[rel] = want
}
for (const [file, html] of writes) fs.writeFileSync(file, html, "utf8")

// Tomcat header switch
const webXml = path.join(root, "WEB-INF", "web.xml")
let xml = fs.readFileSync(webXml, "utf8")
const paramRe = /(<param-name>robotsTag<\/param-name>\s*<param-value>)([^<]*)(<\/param-value>)/
if (mode !== "status") {
  if (!paramRe.test(xml)) throw new Error("robotsTag init-param not found in WEB-INF/web.xml")
  xml = xml.replace(paramRe, `$1${mode === "noindex" ? NOINDEX : ""}$3`)
  fs.writeFileSync(webXml, xml, "utf8")
}
const header = (xml.match(paramRe) || [])[2] || ""

const regular = pages.filter((p) => !ALWAYS_NOINDEX.has(p))
const indexed = regular.filter((p) => /^index\b/.test(state[p]))
const blocked = regular.filter((p) => /noindex/.test(state[p]))
console.log(`pages: ${regular.length} (+${ALWAYS_NOINDEX.size} always noindex)`)
console.log(`  noindex: ${blocked.length}   index: ${indexed.length}   other: ${regular.length - blocked.length - indexed.length}`)
console.log(`Tomcat X-Robots-Tag header: ${header || "(off)"}`)
const mixed = blocked.length && blocked.length !== regular.length
if (mixed || regular.length - blocked.length - indexed.length) {
  for (const p of regular) console.log(`  ${p}: ${state[p]}`)
}
if (mode === "status") process.exit(mixed ? 1 : 0)
console.log(mode === "noindex" ? "STAGING: site is noindex." : "PRODUCTION: site is indexable.")
