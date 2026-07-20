# Page template and asset loading

## Required head order (existing pages)

1. Optional early `<meta charset="utf-8">`
2. **`sm-site-base` script** (injects `<base href>`) — **required for pretty URLs**
3. Optional JSON-LD
4. `js/analytics.js`
5. `<!-- sm-site-base -->` marker comment
6. viewport, title, description, canonical
7. favicon + Inter font
8. CSS: always `css/global.css` + `css/home.css`, then page CSS

## The base href rule (why CSS/images vanish)

Asset links are **relative** (`css/home.css`, `images/...`, `js/main.js`).

On `/post-tavr-cardiac-monitoring/` the browser treats the directory as the base unless `<base>` points at the site root.

Existing pages include this injector (see `contact.html`, `index.html`, `scripts/patch-html-for-subfolder-base.mjs`).

### Leaf map

The injector’s `leaf` object lists pretty-URL segments that should be stripped so `<base>` stays at site root:

```js
var leaf = { about: 1, services: 1, faq: 1, contact: 1, "clinical-stories": 1, thanks: 1, "404": 1 }
```

**Any new pretty slug must be added to `leaf`** in:

- every new page’s base script
- `scripts/patch-html-for-subfolder-base.mjs` (source of truth for re-patching)
- existing pages if they are re-patched from that script

Also special-case: `services/equipment`.

## Body skeleton

```html
<body>
  <!-- GTM noscript -->
  <div class="site-root">
    <header class="site-header site-header--figma">…</header>
    <main class="…-page …-page--figma">…sections…</main>
    <footer class="site-footer site-footer--figma">…</footer>
  </div>
  <script src="js/main.js?v=…" defer></script>
</body>
```

## CSS loading convention

| Sheet | When |
|-------|------|
| `css/global.css` | Every page |
| `css/home.css` | Every page (tokens, header/footer, buttons, CTA) |
| `css/services.css` | Services-like landings |
| `css/faq.css` | FAQ accordion |
| `css/contact.css` / `about.css` / `equipment.css` | Page-specific |

## Image / icon conventions

- Brand mark: `images/figma-assets/Group 1261157085.svg`
- Services hero art: `images/figma-services/…`
- Icons: `icons/…`
- Prefer existing assets; do not invent paid hosting or new CDN dependencies

## Scripts

| Script | Role |
|--------|------|
| `js/analytics.js` | GTM |
| `js/main.js` | Nav, FAQ accordion, footer year |
| `js/services-report-carousel.js` | Services report carousel only |

## Patch helper

```bash
node scripts/patch-html-for-subfolder-base.mjs
```

Injects/updates `sm-site-base` and normalizes root-absolute links.
