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

for (const file of walk('.')) {
  const t = fs.readFileSync(file, 'utf8');
  if (t.includes('\uFFFD')) console.log('FFFD', file);
  if (t.includes('ï»¿')) console.log('mojibake', file);
  if (t.includes('\uFEFF')) console.log('FEFF', file);

  const hi = t.indexOf('site-header');
  if (hi >= 0) {
    const chunk = t.slice(hi, hi + 2500);
    const alts = [...chunk.matchAll(/alt="([^"]*)"/g)].map((m) => m[1]);
    const bad = alts.filter((a) => /[?]|\uFFFD|ï|»|¿/.test(a) || a.includes('–') || a.includes('—'));
    if (bad.length) console.log('HEADER ALT', file, bad);
  }

  const fi = t.indexOf('site-footer');
  if (fi >= 0) {
    const chunk = t.slice(fi, fi + 2000);
    if (/ï»¿|\uFFFD|Specialized Medical \?/.test(chunk)) console.log('FOOTER BAD', file);
    const m = chunk.match(/(?:©|&copy;|\?)[^\n<]{0,80}reserved[^\n<]{0,40}/);
    if (m) console.log('FOOTER LINE', file, JSON.stringify(m[0]));
  }
}
console.log('scan done');
