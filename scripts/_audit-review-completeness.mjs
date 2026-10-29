/**
 * Exhaustive audit of the Oct 29 review doc vs current MCT / Post-TAVR pages.
 */
import fs from 'fs';

const mct = fs.readFileSync('mobile-cardiac-telemetry-mct.html', 'utf8');
const tavr = fs.readFileSync('post-tavr-cardiac-monitoring.html', 'utf8');
const css = fs.readFileSync('css/landing-mct.css', 'utf8');
const js = fs.readFileSync('js/landing-lite.js', 'utf8');

const results = [];
function check(id, pass, detail) {
  results.push({ id, pass: !!pass, detail });
}

// --- From review doc bullets ---

// 1. Mobile menu / overflow / comparison table scroll (all mobile)
check(
  'mobile-overflow-hidden',
  /\.landing-page\s*\{[^}]*overflow-x:\s*hidden/.test(css),
  'landing-page overflow-x:hidden'
);
check(
  'table-scroll-wrap',
  /\.landing-table-wrap\s*\{[^}]*overflow-x:\s*auto/.test(css),
  'comparison table overflow-x:auto'
);
check(
  'swipe-hint-mobile',
  /Swipe to compare/.test(css) && /max-width:\s*900px[\s\S]*landing-table-wrap--hint::after[\s\S]*display:\s*block/.test(css),
  'swipe hint shown under 900px'
);
check(
  'table-has-hint-class',
  /landing-table-wrap--hint/.test(mct),
  'MCT table wrap uses --hint class'
);

// 2. Banner visible on mobile
const mobileHeroBlock = css.match(/@media \(max-width: 900px\)\s*\{[\s\S]*?landing-hero__plate--mobile-cardiac-telemetry-mct[\s\S]*?(?=@media|\n\/\* ----------|$)/);
const mobileCss = css.includes('landing-hero__plate--mobile-cardiac-telemetry-mct') &&
  /opacity:\s*1/.test(css) &&
  !/opacity:\s*0\.\d+/.test(
    (css.match(/@media \(max-width: 900px\)[\s\S]*?landing-hero__plate--mobile-cardiac-telemetry-mct[\s\S]*?opacity:\s*([0-9.]+)/) || [])[0] || 'opacity: 1'
  );
const opacityMatch = css.match(
  /\.landing-hero__plate--mobile-cardiac-telemetry-mct \.landing-hero__media\s*\{[^}]*opacity:\s*([0-9.]+)/
);
const mobileOpacityMatch = [...css.matchAll(/@media \(max-width: 900px\)\s*\{([\s\S]*?)\n\}/g)]
  .map((m) => m[1])
  .find((b) => b.includes('landing-hero__plate--mobile-cardiac-telemetry-mct') && b.includes('opacity'));
const mobileOpacity = mobileOpacityMatch?.match(/opacity:\s*([0-9.]+)/)?.[1];
check(
  'mobile-hero-opacity-full',
  mobileOpacity === '1' || mobileOpacity === undefined,
  `mobile MCT hero opacity=${mobileOpacity ?? 'inherit (no fade)'}`
);
check(
  'mobile-hero-not-washed',
  !/rgba\(255,\s*255,\s*255,\s*0\.9[0-9]?\)/.test(mobileOpacityMatch || '') ||
    /0\.78|0\.2|0\.08/.test(mobileOpacityMatch || ''),
  'mobile gradient should not be near-opaque white over image'
);
check(
  'hero-img-present',
  /mobile-cardiac-telemetry-mct-hero/.test(mct) && /alt="Patient at home/.test(mct),
  'hero picture + matching alt present'
);

// 3. JSON parses
const ldBlocks = [...mct.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
let jsonOk = true;
let jsonDetail = `${ldBlocks.length} blocks`;
for (const [, raw] of ldBlocks) {
  try {
    JSON.parse(raw);
  } catch (e) {
    jsonOk = false;
    jsonDetail = e.message;
  }
}
check('json-ld-parses', jsonOk && ldBlocks.length > 0, jsonDetail);

// FAQ answers match FAQPage (whitespace-normalized)
const faqPage = ldBlocks.map(([, r]) => {
  try {
    return JSON.parse(r);
  } catch {
    return null;
  }
}).find((j) => j && (j['@type'] === 'FAQPage' || j['@graph']?.some?.((x) => x['@type'] === 'FAQPage')));

function normalize(s) {
  return String(s || '')
    .replace(/\\u2019/g, "'")
    .replace(/&rsquo;|&#8217;|’/g, "'")
    .replace(/&mdash;|—/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

let faqEntity = faqPage;
if (faqPage?.['@graph']) faqEntity = faqPage['@graph'].find((x) => x['@type'] === 'FAQPage') || faqPage;
const schemaQs = faqEntity?.mainEntity || [];
const htmlFaqs = [...mct.matchAll(/faq-item__q">([^<]+)<[\s\S]*?faq-item__panel[^>]*>\s*<p>([\s\S]*?)<\/p>/g)].map(
  (m) => ({ q: normalize(m[1]), a: normalize(m[2].replace(/<[^>]+>/g, '')) })
);
let faqMatch = 0;
let faqMismatch = [];
for (const s of schemaQs) {
  const q = normalize(s.name);
  const a = normalize(s.acceptedAnswer?.text);
  const h = htmlFaqs.find((x) => x.q === q);
  if (h && h.a === a) faqMatch++;
  else faqMismatch.push(q.slice(0, 60));
}
check(
  'faq-schema-html-match',
  schemaQs.length > 0 && faqMismatch.length === 0,
  `${faqMatch}/${schemaQs.length} match; mismatches=${faqMismatch.length}`
);

// 4. Practice workflow not Clinical Stories
check(
  'no-clinical-stories-link',
  !/href=["'][^"']*clinical-stories/.test(mct),
  'no clinical-stories href on MCT'
);
check(
  'workflow-anchor-link',
  /#mct-workflow-heading/.test(mct) && /id="mct-workflow-heading"/.test(mct),
  'practice workflow section + link'
);

// 5. Post-TAVR unfinished text
check(
  'tavr-no-expansion-notice',
  !/being expanded|Pending authorized clinical|Pending clinical review/i.test(tavr),
  'no expansion/pending reviewer copy'
);
check(
  'tavr-no-nested-mct',
  !/href=["']mobile-cardiac-telemetry-mct\//.test(tavr),
  'no relative nested MCT links'
);
check(
  'tavr-absolute-mct',
  (tavr.match(/href=["']\/mobile-cardiac-telemetry-mct\//g) || []).length >= 3,
  'absolute /mobile-cardiac-telemetry-mct/ links present'
);
check('tavr-single-footer', (tavr.match(/<footer\b/g) || []).length === 1, 'exactly one footer');
check('tavr-noindex', /noindex/.test(tavr), 'post-tavr robots noindex');
check(
  'tavr-faq-answers',
  (tavr.match(/faq-panel-tavr-\d+[\s\S]*?<p>[^<]{20,}<\/p>/g) || []).length >= 14,
  'most TAVR FAQs have answer paragraphs'
);

// 6. Six revision points leftovers
check('has-24-7', (mct.match(/24\/7/g) || []).length >= 4, `24/7 count=${(mct.match(/24\/7/g) || []).length}`);
check(
  'alert-faq-channels',
  /How do alerts[\s\S]{0,800}email, text and\/or phone/.test(mct) &&
    /thresholds, recipients and escalation/.test(mct),
  'alert FAQ names channels + protocol'
);
check(
  'direct-answer-opening',
  /landing-hero__lead[\s\S]{0,80}Mobile Cardiac Telemetry \(MCT\) is ambulatory/.test(mct),
  'hero direct-answer opening'
);
check(
  'enroll-hookup-disconnect',
  /Enroll in Web Portal/.test(mct) && /Hook Up/.test(mct) && /Disconnect/.test(mct),
  '3-step workflow summary'
);
check('no-manual-upload', /no manual upload/.test(mct), 'no manual upload wording');
check('device-return', /returned|return/.test(mct) && /reuse/.test(mct), 'device return/reuse');
check(
  'no-internal-notes',
  !/practice workflow destination|interim link retained|destination still pending/i.test(mct),
  'no staging/internal notes'
);
check(
  'long-term-holter-primary',
  /Long-Term Holter/.test(mct) && !/Extended Holter/.test(mct),
  'Long-Term Holter primary; no Extended Holter'
);
check(
  'extended-as-synonym',
  /also called extended Holter/.test(mct),
  'extended Holter only as synonym'
);

// CTA / base-tag safety
check(
  'cta-path-absolute',
  (mct.match(/\/mobile-cardiac-telemetry-mct\/#cta-form/g) || []).length >= 6 &&
    !(mct.match(/href=["']#cta-form["']/) || []).length,
  'CTAs path-absolute, no bare #cta-form'
);
check('skip-path-absolute', /#main-content/.test(mct) && /id="main-content"/.test(mct), 'skip + main-content');
check(
  'js-hash-fix',
  /h\.charAt\(0\) === "#"/.test(js),
  'landing-lite keeps hash links on current path'
);

// Other cleanup from review
check('mct-noindex', /noindex/.test(mct), 'MCT still noindex for staging');
check(
  'no-especially-well-suited',
  !/especially well suited/.test(mct),
  'superlative softened'
);
check(
  'battery-30-day-note',
  /patch replacement|recharge/.test(mct),
  '30-day vs battery explanation'
);
check(
  'footer-visitor-tagline',
  /Turnkey cardiac monitoring with LIVE ECG data/.test(mct) &&
    !/S-Patch as the primary featured system/.test(mct),
  'visitor-facing footer tagline'
);
check('last-updated-current', /Last updated:<\/strong> October 2[89], 2026/.test(mct), 'last updated date');
check(
  'logo-alts',
  (mct.match(/alt="Specialized Medical"/g) || []).length >= 2,
  'logo alts named'
);
check(
  'header-trailing-slash',
  /href=['"]\/about\/['"]/.test(mct) && /href=['"]\/services\/['"]/.test(mct),
  'header nav trailing slashes'
);

// Images exist for hero sizes referenced
const needed = [
  'images/landing/mobile-cardiac-telemetry-mct-hero.webp',
  'images/landing/mobile-cardiac-telemetry-mct-hero.jpg',
  'images/landing/mobile-cardiac-telemetry-mct-hero-960.webp',
  'images/landing/mobile-cardiac-telemetry-mct-hero-750.webp',
  'images/landing/mobile-cardiac-telemetry-mct-hero-1280.webp',
];
for (const f of needed) {
  check(`asset-${f.split('/').pop()}`, fs.existsSync(f), f);
}

// Print report
const failed = results.filter((r) => !r.pass);
const passed = results.filter((r) => r.pass);
console.log(`PASS ${passed.length} / FAIL ${failed.length} / TOTAL ${results.length}`);
console.log('\n--- FAILURES ---');
for (const f of failed) console.log(`FAIL  ${f.id}: ${f.detail}`);
console.log('\n--- PASSES ---');
for (const p of passed) console.log(`PASS  ${p.id}: ${p.detail}`);

fs.writeFileSync(
  'documents/MCT_AUDIT_2026-10-29.json',
  JSON.stringify({ generated: new Date().toISOString(), passed: passed.length, failed: failed.length, results }, null, 2)
);
process.exit(failed.length ? 1 : 0);
