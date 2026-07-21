/**
 * Remove stray ? or BOM before injected header/footer.
 * Run: node scripts/strip-html-bom.mjs
 */
import { readFileSync, writeFileSync } from "fs"
import { globSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const files = globSync("**/*.html", { cwd: ROOT }).filter(
  (f) => !f.startsWith("partials/") && !f.includes("faq-accordion-fragment")
)

let count = 0
for (const rel of files) {
  const path = join(ROOT, rel)
  let buf = readFileSync(path)
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    buf = buf.subarray(3)
  }
  let text = buf.toString("utf8")
  const next = text
    .replace(/\ufeff    <header/g, "    <header")
    .replace(/\ufeff    <footer/g, "    <footer")
    .replace(/\?    <header/g, "    <header")
    .replace(/\?    <footer/g, "    <footer")
  if (next !== text) {
    writeFileSync(path, next, "utf8")
    count++
    console.log("fixed", rel)
  }
}
console.log(`Done. ${count} file(s).`)
