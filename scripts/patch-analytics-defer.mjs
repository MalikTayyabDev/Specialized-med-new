/**
 * Move analytics.js out of <head> and load with defer before main.js.
 * Run: node scripts/patch-analytics-defer.mjs
 */
import { readFileSync, writeFileSync } from "fs"
import { globSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const HEAD_TAG = '<script src="js/analytics.js"></script>'
const DEFER_TAG = '  <script src="js/analytics.js" defer></script>'

const files = globSync("**/*.html", { cwd: ROOT }).filter(
  (f) => !f.startsWith("partials/") && !f.includes("faq-accordion-fragment")
)

let changed = 0
for (const rel of files) {
  const path = join(ROOT, rel)
  let html = readFileSync(path, "utf8")
  if (!html.includes(HEAD_TAG)) continue

  html = html.replace(HEAD_TAG, "")
  if (html.includes('src="js/main.js')) {
    html = html.replace(/(\s*<script src="js\/main\.js[^"]*" defer><\/script>)/, `\n${DEFER_TAG}\n$1`)
  } else {
    html = html.replace("</body>", `${DEFER_TAG}\n</body>`)
  }
  writeFileSync(path, html, "utf8")
  changed++
  console.log("patched", rel)
}

console.log(`Done. ${changed} file(s) updated.`)
