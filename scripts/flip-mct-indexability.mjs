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

const netlifyContained = `# Netlify: MCT landing staging containment + pretty URLs.
# Stage 0.1: also enable Site settings → Access control (password) on staging deploys.
# Stage 0.2: X-Robots-Tag until production launch gate passes.
# Managed by: npm run mct:index / npm run mct:noindex

[[headers]]
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

const netlifyLive = `# Netlify: MCT landing is indexable on production.
# Re-contain with: npm run mct:noindex
# Managed by: scripts/flip-mct-indexability.mjs
`;

fs.writeFileSync(
  netlifyPath,
  mode === "noindex" ? netlifyContained : netlifyLive,
  "utf8"
);

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
