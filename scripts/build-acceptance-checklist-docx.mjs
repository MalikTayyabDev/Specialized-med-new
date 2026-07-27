/**
 * Builds the Implementation Manual v2 acceptance checklist as a Word document.
 * Run: node scripts/build-acceptance-checklist-docx.mjs
 */
import { execSync } from "child_process"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
execSync("python scripts/build_acceptance_checklist_docx.py", { cwd: ROOT, stdio: "inherit" })
