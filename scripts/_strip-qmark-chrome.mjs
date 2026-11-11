import fs from 'fs';
import path from 'path';

const skip = new Set(['documents', 'node_modules', '.git']);

function walk(dir, out = []) {
  for (const n of fs.readdirSync(dir)) {
    if (skip.has(n)) continue;
    const f = path.join(dir, n);
    const s = fs.statSync(f);
    if (s.isDirectory()) walk(f, out);
    else if (/\.html$/i.test(n)) out.push(f);
  }
  return out;
}

let changed = 0;
for (const file of walk('.')) {
  let t = fs.readFileSync(file, 'utf8');
  const before = t;
  // Stray "?" left when BOM / replacement chars were "fixed" into ASCII
  t = t.replace(/\?[ \t]*(<header\b)/g, '$1');
  t = t.replace(/\?[ \t]*(<footer\b)/g, '$1');
  // Also catch between closing tags and chrome
  t = t.replace(/(<\/main>)\s*\?\s*(<footer\b)/g, '$1\n    $2');
  t = t.replace(/(<div class="site-root">)\s*\?\s*(<header\b)/g, '$1\n    $2');
  if (t !== before) {
    fs.writeFileSync(file, t, 'utf8');
    changed++;
    console.log('fixed', file);
  }
}
console.log({ changed });

for (const file of walk('.')) {
  const t = fs.readFileSync(file, 'utf8');
  if (/\?[ \t]*<(header|footer)\b/.test(t)) console.log('STILL', file);
}
console.log('done');
