import fs from 'fs';
import path from 'path';

const skipDirs = new Set(['documents', 'node_modules', '.git']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(html|css|js|mjs)$/i.test(name)) out.push(full);
  }
  return out;
}

const literalBom = '';
let changed = 0;

for (const file of walk('.')) {
  let buf = fs.readFileSync(file);
  let changedFile = false;

  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    buf = buf.subarray(3);
    changedFile = true;
  }

  let text = buf.toString('utf8');
  const before = text;

  if (text.includes(literalBom)) text = text.split(literalBom).join('');
  if (text.includes('\uFEFF')) text = text.replace(/\uFEFF/g, '');

  // Safer header/footer alts: HTML entities instead of Unicode en-dash
  text = text.replace(/Specialized Medical &ndash; Cardiac/g, 'Specialized Medical &ndash; Cardiac');
  text = text.replace(/Specialized Medical &ndash; Expert/g, 'Specialized Medical &ndash; Expert');

  // Raw copyright symbol in footers -> entity
  text = text.replace(/>&copy; </g, '>&copy; <');
  text = text.replace(/>&copy;</g, '>&copy;<');
  // Raw middle-dot between reserved and privacy
  text = text.replace(/All rights reserved\. · /g, 'All rights reserved. &middot; ');

  if (text !== before || changedFile) {
    fs.writeFileSync(file, text, 'utf8');
    changed++;
    console.log('cleaned', file);
  }
}

console.log({ changed });

for (const file of walk('.')) {
  const t = fs.readFileSync(file, 'utf8');
  const b = fs.readFileSync(file);
  const hasBomBytes = b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf;
  if (t.includes(literalBom) || t.includes('\uFEFF') || hasBomBytes) {
    console.log('STILL', file);
  }
  // Visible BOM before header?
  if (/site-root">\s*\s*<header/.test(t) || /site-root">\s*\uFEFF\s*<header/.test(t)) {
    console.log('HEADER BOM', file);
  }
}
console.log('scan done');
