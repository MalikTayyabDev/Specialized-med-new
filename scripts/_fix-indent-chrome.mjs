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

let n = 0;
for (const file of walk('.')) {
  let t = fs.readFileSync(file, 'utf8');
  const before = t;
  t = t.replace(/(<div class="site-root">)\r?\n<header\b/g, '$1\n    <header');
  t = t.replace(/(<\/main>)\r?\n<footer\b/g, '$1\n    <footer');
  if (t !== before) {
    fs.writeFileSync(file, t, 'utf8');
    n++;
    console.log('indent', file);
  }
}
console.log({ n });
