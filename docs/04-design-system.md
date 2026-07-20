# Design system patterns to reuse

## Tokens (from `css/home.css`)

- Brand red: `--color-red: #c9222f`
- Text: `--color-text: #231f1e`
- Soft CTA background: `#fcf4f5`
- Font: Inter (loaded in page head)
- Container max width via `--container` / `.figma-container`
- Horizontal inset: `--figma-inline`

## Layout building blocks

| Class | Use |
|-------|-----|
| `.figma-container` | Content width wrapper |
| `.figma-section` | Vertical section spacing |
| `.figma-h2` / `.figma-h2__accent` | Section headings |
| `.figma-hero__pill` | Small hero label |
| `.figma-btn--solid` / `.figma-btn--outline-dark` | Primary / secondary buttons |
| `.figma-cta` / `.figma-cta__box` | Bottom pilot / contact CTA band |

## Services page patterns (`css/services.css`)

- `.svc-hero` + plate/gradient hero
- `.svc-breakdown` modality cards
- `.svc-split` image/copy splits
- `.svc-tavr` Post-TAVR band
- End with shared `.figma-cta` → Contact

## FAQ accordion (`css/faq.css` + `js/main.js`)

Structure:

```html
<section class="figma-section faq-accordion">
  <div class="faq-category">
    <div class="faq-category__list">
      <div class="faq-item is-open">
        <button class="faq-item__trigger" aria-expanded="true" …>
          <span class="faq-item__q">Question</span>
          <!-- chevron svg -->
        </button>
        <div class="faq-item__panel">…</div>
      </div>
    </div>
  </div>
</section>
```

`initFaqAccordion()` in `main.js` handles single-open behavior and hash deep-links.

## CTA copy patterns already on site

Common actions:

- Request a Demo
- Start Your No-Risk Pilot Program
- Talk to our team →

Contact target: `contact/` (partials prefer trailing slash).

## Do not invent a parallel UI

Match Figma-derived classes already in `home.css` / `services.css`. Prefer extending existing patterns over new card systems or purple/glow aesthetics.
