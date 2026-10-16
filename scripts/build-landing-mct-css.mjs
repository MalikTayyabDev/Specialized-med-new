import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let css = fs.readFileSync(path.join(root, "css/landing.css"), "utf8");

// Drop background-image plates for other landings (keeps CSS smaller; only MCT plate kept).
css = css.replace(
  /\.landing-hero__plate--(?!mobile-cardiac-telemetry-mct)[a-z0-9-]+\s*\{[\s\S]*?\}\s*/gi,
  ""
);

// Critical: do not CSS-background the 232KB MCT JPG when <picture> already paints the hero.
css = css.replace(
  /\.landing-hero__plate--mobile-cardiac-telemetry-mct\s*\{[\s\S]*?\}/i,
  `.landing-hero__plate--mobile-cardiac-telemetry-mct {
  /* Photo via <picture>/<img> only — avoid duplicate CSS background download */
  background-image: none;
}`
);

css += `
/* Mobile: fixed hero height to avoid CLS (absolute media needs explicit plate size) */
@media (max-width: 900px) {
  .landing-hero__plate {
    height: 480px;
    min-height: 480px;
  }
  .landing-hero__inner {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  .landing-hero__title {
    font-size: clamp(1.6rem, 7vw, 2.2rem) !important;
  }
}
`;

const out = path.join(root, "css/landing-mct.css");
fs.writeFileSync(out, "/* Auto-built by scripts/build-landing-mct-css.mjs */\n" + css);
console.log("landing.css", fs.statSync(path.join(root, "css/landing.css")).size);
console.log("landing-mct.css", fs.statSync(out).size);
