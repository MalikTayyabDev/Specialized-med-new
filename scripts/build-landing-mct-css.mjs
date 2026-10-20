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

// Critical: do not CSS-background the large MCT JPG when <picture> already paints the hero.
css = css.replace(
  /\.landing-hero__plate--mobile-cardiac-telemetry-mct\s*\{[\s\S]*?\}/i,
  `.landing-hero__plate--mobile-cardiac-telemetry-mct {
  /* Photo via <picture>/<img> only — avoid duplicate CSS background download */
  background-image: none;
}`
);

css += `
/* Mobile: fixed hero plate height so absolute media does not collapse the banner */
@media (max-width: 900px) {
  .landing-hero__plate {
    height: 520px;
    min-height: 520px;
  }
  .landing-hero__inner {
    padding-top: 1.75rem !important;
    padding-bottom: 1.75rem !important;
  }
  .landing-hero__title {
    font-size: clamp(1.55rem, 6.5vw, 2.05rem) !important;
    line-height: 1.2 !important;
  }
  .landing-hero__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 22rem;
  }
  .landing-hero__actions .figma-btn {
    width: 100%;
    justify-content: center;
  }
}
`;

const out = path.join(root, "css/landing-mct.css");
fs.writeFileSync(out, "/* Auto-built by scripts/build-landing-mct-css.mjs */\n" + css);
console.log("landing.css", fs.statSync(path.join(root, "css/landing.css")).size);
console.log("landing-mct.css", fs.statSync(out).size);
