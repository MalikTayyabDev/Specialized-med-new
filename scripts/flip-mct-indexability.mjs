/**
 * Flip MCT landing robots from noindex → index,follow (or reverse).
 *
 * Usage:
 *   npm run mct:index    # production launch (after Stages 0–6 gates)
 *   npm run mct:noindex  # re-contain staging / pre-gate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mode = (process.argv[2] || "").toLowerCase();

if (mode !== "index" && mode !== "noindex") {
  console.error("Usage: node scripts/flip-mct-indexability.mjs <index|noindex>");
  process.exit(1);
}

const htmlPath = path.join(root, "mobile-cardiac-telemetry-mct.html");
const netlifyPath = path.join(root, "netlify.toml");
const htaccessPath = path.join(root, ".htaccess");

let html = fs.readFileSync(htmlPath, "utf8");
if (mode === "index") {
  html = html.replace(
    /<meta name="robots" content="[^"]*">/i,
    '<meta name="robots" content="index, follow, max-image-preview:large">'
  );
} else {
  html = html.replace(
    /<meta name="robots" content="[^"]*">/i,
    '<meta name="robots" content="noindex, nofollow">'
  );
}
fs.writeFileSync(htmlPath, html, "utf8");

// Surgically toggle X-Robots-Tag blocks without wiping security / cache headers.
let netlify = fs.readFileSync(netlifyPath, "utf8");
const robotsHeaderBlock = `[[headers]]
  for = "/mobile-cardiac-telemetry-mct"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"

[[headers]]
  for = "/mobile-cardiac-telemetry-mct/"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"

[[headers]]
  for = "/mobile-cardiac-telemetry-mct.html"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
`;

// Remove any existing MCT robots header blocks
netlify = netlify.replace(
  /\[\[headers\]\]\s*\n\s*for = "\/mobile-cardiac-telemetry-mct(?:\.html|\/)?"\s*\n\s*\[headers\.values\]\s*\n\s*X-Robots-Tag = "noindex, nofollow"\s*\n*/g,
  ""
);

if (mode === "noindex") {
  // Insert after the opening comments / first blank line region
  if (/\[\[headers\]\]/.test(netlify)) {
    netlify = netlify.replace(/(\[\[headers\]\])/, `${robotsHeaderBlock}\n$1`);
  } else {
    netlify = netlify.trimEnd() + "\n\n" + robotsHeaderBlock;
  }
}
fs.writeFileSync(netlifyPath, netlify.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n", "utf8");

let ht = fs.readFileSync(htaccessPath, "utf8");
ht = ht.replace(
  /\n?# Staging \/ pre-launch: noindex MCT[\s\S]*?<\/IfModule>\s*/i,
  "\n"
);
if (mode === "noindex") {
  const block = `
# Staging / pre-launch: noindex MCT until Stage 7 gate (managed by flip-mct-indexability.mjs)
<IfModule mod_headers.c>
  <Files "mobile-cardiac-telemetry-mct.html">
    Header set X-Robots-Tag "noindex, nofollow"
  </Files>
</IfModule>
`;
  if (/ErrorDocument 404/i.test(ht)) {
    ht = ht.replace(/ErrorDocument 404 \/404\.html/, block + "\nErrorDocument 404 /404.html");
  } else {
    ht = ht.trimEnd() + "\n" + block;
  }
}
fs.writeFileSync(htaccessPath, ht.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n", "utf8");

const robotsOk =
  mode === "index"
    ? /content="index,\s*follow/i.test(fs.readFileSync(htmlPath, "utf8"))
    : /content="noindex,\s*nofollow"/i.test(fs.readFileSync(htmlPath, "utf8"));

console.log(`MCT indexability → ${mode} ${robotsOk ? "(ok)" : "(check meta manually)"}`);
if (mode === "index") {
  console.log("Next: deploy, then submit sitemap in GSC/Bing.");
}
