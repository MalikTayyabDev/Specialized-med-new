/**
 * Extract embedded PNG from Figma SVG logo and emit compressed WebP/PNG.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = path.join(root, "images/figma-assets/Group 1261157085.svg");
const outDir = path.join(root, "images/figma-assets");

const svg = fs.readFileSync(svgPath, "utf8");
const m = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
if (!m) {
  console.error("No embedded PNG found in logo SVG");
  process.exit(1);
}

const buf = Buffer.from(m[1], "base64");
const meta = await sharp(buf).metadata();
console.log("source", meta.width, meta.height, buf.length);

await sharp(buf)
  .resize({ width: 824, withoutEnlargement: true })
  .webp({ quality: 68, effort: 6 })
  .toFile(path.join(outDir, "brand-logo.webp"));

await sharp(buf)
  .resize({ width: 824, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(outDir, "brand-logo.png"));

await sharp(buf)
  .resize({ width: 472, withoutEnlargement: true })
  .webp({ quality: 68, effort: 6 })
  .toFile(path.join(outDir, "brand-logo-472.webp"));

for (const f of ["brand-logo.webp", "brand-logo.png", "brand-logo-472.webp"]) {
  console.log(f, fs.statSync(path.join(outDir, f)).size);
}
