# MCT Review Doc Fixes — Status | October 29, 2026

Source: `d:\Desktop\specilaized medical landing page\specilaizedmedicallandingpage.html`

| Done | Issue from review | Fix |
|------|-------------------|-----|
| [x] | Mobile banner not visible | Mobile hero scrim lightened; image opacity restored to 1; object-position shows patient; taller plate with bottom text band |
| [x] | Mobile menu / overflow / table scroll for all mobile | Table wrap already scrolls with “Swipe to compare”; CTA button stack spacing added; overflow-x hidden retained on landing page |
| [x] | Practice-workflow → Clinical Stories | Confirmed removed; link goes to `#mct-workflow-heading` |
| [x] | Alert FAQ unread / thin | FAQ + JSON-LD updated with email/text/phone + physician protocol + 911 note |
| [x] | JSON-LD parse / schema | All MCT JSON-LD blocks parse with `JSON.parse` (0 failures) |
| [x] | Post-TAVR expansion / pending text | Already cleared; reconfirmed absent |
| [x] | Post-TAVR nested MCT links broken | All MCT links are absolute `/mobile-cardiac-telemetry-mct/` |
| [x] | Post-TAVR duplicate footer / nested service links | Single footer; absolute `/about/`, `/services/`, Holter/Event URLs |
| [x] | Post-TAVR indexable while unfinished | Set `noindex, nofollow` (staging) |
| [x] | “Especially well suited” superlative | Softened to “may support selected post-TAVR pathways” |
| [x] | Disconnect / return clarity | Clarified patient removes as instructed by practice; return via practice supply workflow |
| [x] | Internal staging notes | Already removed earlier |
| [ ] | Client written confirm of 24/7 + device specs | Ops / client |
| [~] | Launch indexing flip | Leave noindex until go-live |

Pushed with mobile hero CSS cache-bust `landing-mct.css?v=20261029`.
