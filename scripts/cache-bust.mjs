/**
 * Content-hash cache busting for local CSS, JS, images, fonts and video.
 *
 * Run before every deploy:   npm run cache-bust
 *
 * Every local asset reference in the site's HTML (href, src, srcset,
 * imagesrcset), in the header/footer partials and in css/*.css url(...)
 * gets ?v=<first 10 hex chars of the file's SHA-256>. The version changes
 * only when the file's content changes, so unchanged assets keep their URL
 * and stay cached (HtmlCacheFilter caches ?v= assets for a year), while an
 * updated file gets a new URL that browsers must fetch.
 *
 * Safe to run repeatedly: it rewrites existing ?v= values and leaves other
 * query parameters alone.
 */
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const ASSET_EXT = /\.(css|js|mjs|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm)$/i
const SKIP = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i // http:, https:, data:, mailto:, tel:, //host, #hash
const checkOnly = process.argv.includes("--check")

const hashCache = new Map()
function versionOf(file) {
  if (!hashCache.has(file)) {
    const digest = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")
    hashCache.set(file, digest.slice(0, 10))
  }
  return hashCache.get(file)
}

const missing = new Set()

/** Return url with ?v=<hash>, or the url unchanged if it is not a local asset. */
function bust(url, baseDir) {
  const raw = url.trim()
  if (!raw || SKIP.test(raw)) return url

  let prefix = ""
  let rest = raw
  const tpl = rest.match(/^\{\{BASE\}\}/)
  if (tpl) {
    prefix = tpl[0]
    rest = rest.slice(prefix.length)
  } else if (rest.includes("{{")) {
    return url
  }

  const hashIdx = rest.indexOf("#")
  const fragment = hashIdx >= 0 ? rest.slice(hashIdx) : ""
  if (hashIdx >= 0) rest = rest.slice(0, hashIdx)
  const qIdx = rest.indexOf("?")
  const pathname = qIdx >= 0 ? rest.slice(0, qIdx) : rest
  const query = qIdx >= 0 ? rest.slice(qIdx + 1) : ""
  if (!ASSET_EXT.test(pathname)) return url

  // Pages inject <base href="/"> (sm-site-base), so relative refs resolve from the site root.
  let file
  if (prefix || pathname.startsWith("/")) file = path.join(root, pathname.replace(/^\/+/, ""))
  else file = path.resolve(baseDir, decodeURIComponent(pathname))
  if (prefix || pathname.startsWith("/")) file = decodeURIComponent(file)

  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    missing.add(`${pathname}`)
    return url
  }

  const params = query.split("&").filter((p) => p && !/^v=/.test(p))
  params.push(`v=${versionOf(file)}`)
  const lead = url.match(/^\s*/)[0]
  const trail = url.match(/\s*$/)[0]
  return `${lead}${prefix}${pathname}?${params.join("&")}${fragment}${trail}`
}

function bustSrcset(value, baseDir) {
  return value
    .split(",")
    .map((candidate) => {
      const m = candidate.match(/^(\s*)(\S+)(.*)$/s)
      return m ? m[1] + bust(m[2], baseDir) + m[3] : candidate
    })
    .join(",")
}

function listFiles(dir, ext) {
  const abs = path.join(root, dir)
  if (!fs.existsSync(abs)) return []
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(ext))
    .map((f) => path.join(abs, f))
}

let changed = 0
function rewrite(file, transform) {
  const before = fs.readFileSync(file, "utf8")
  const after = transform(before)
  if (after !== before) {
    changed++
    if (checkOnly) console.log(`out of date: ${path.relative(root, file)}`)
    else fs.writeFileSync(file, after, "utf8")
  }
}

// 1) Stylesheets first, so each CSS file's own hash reflects its updated url() references.
for (const css of listFiles("css", ".css")) {
  rewrite(css, (text) =>
    text.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (whole, q, u) =>
      `url(${q}${bust(u, path.dirname(css))}${q})`
    )
  )
}
if (checkOnly) hashCache.clear()

// 2) HTML pages and the header/footer partials.
const htmlFiles = [...listFiles(".", ".html"), ...listFiles("services", ".html"), ...listFiles("partials", ".html")]
for (const html of htmlFiles) {
  rewrite(html, (text) =>
    text.replace(/\b(href|src|srcset|imagesrcset)=(["'])([^"']*)\2/gi, (whole, attr, q, value) => {
      const v = /srcset$/i.test(attr) ? bustSrcset(value, root) : bust(value, root)
      return `${attr}=${q}${v}${q}`
    })
  )
}

if (missing.size) {
  console.warn(`Referenced asset files not found (left unversioned):\n  ${[...missing].sort().join("\n  ")}`)
}
if (checkOnly) {
  console.log(changed ? `${changed} file(s) need npm run cache-bust` : "All asset versions are current.")
  process.exit(changed ? 1 : 0)
}
console.log(`cache-bust: updated ${changed} file(s).`)
