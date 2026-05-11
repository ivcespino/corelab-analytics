## Quick answer on the team PNGs

For these portraits, **`public/team/`** is the right call (not `src/assets`).

- They're data-driven from `public/team.json` (`"image": "/team/Espino.png"`), referenced by URL string at runtime — not imported as ES modules. `src/assets` only earns its keep when files are statically `import`ed so Vite can hash and tree-shake them.
- Putting them in `public/team/` means the existing JSON paths work unchanged, and you (or a teammate) can swap a portrait by dropping a new PNG with the same filename — no code edit, no rebuild reasoning needed.
- Bundle size: identical either way for this case (7 portraits, served on demand). The `src/assets` advantages (hashing, optimization, type-safety) don't apply when the path is a runtime string.

So: create `public/team/` and drop the six uploaded PNGs there as `Espino.png`, `Bolacja.png`, `Lopez.png`, `Diaz.png`, `Reyes.png`, `Velasco.png`. (Azada is still missing — initials fallback will cover it.) I'll do the copy in build mode.

---

## 1. Home — References slide: column-major order

`ReferencesSection` (`src/components/sections/ResearchSections.tsx`, ~L545) currently uses CSS Grid with `grid-cols-3`, which fills **row by row** (1-2-3 across the top). You want **column by column** (1-2-3-4 down the first column, then 5-6-7-8 down the second).

Fix: switch the `<ol>` to CSS multi-column layout — `columns-1 md:columns-2 lg:columns-3` with `[column-fill:balance]`. Each `<li>` stays a block with `break-inside-avoid` so entries never split mid-row. Numbering stays correct because it's pulled from the array index, not CSS counters. Three-column layout preserved; reading order becomes top-to-bottom, left-to-right.

## 2. Home — Make the whole reference row the link

Currently only "Author (Year)" is the anchor; the title text is plain. Change each `<li>` so the entire card is one `<a>` (or wrap with `<a className="block …">`), keeping the visible "Author (Year)" emphasis but making the title, number badge, and hover region all part of the same clickable link. Hover state moves to the whole row (cyan accent + subtle bg).

## 3. Home — Author/theorist names link out from the predecessor slide

The "predecessor slide" is the Theoretical Framework block in `public/content.json` (~L206–L240) where each theory carries a `subtitle` like `"Sweller (1988)"`, `"Piaget (1972) & Vygotsky (1978)"`, `"Kolb (1984)"`. Right now those names are plain text.

Plan:
- Find the component that renders `kind: "theory"` items and locate where `subtitle` is printed.
- Wrap each author-year token inside the subtitle in an `<a target="_blank">` pointing to the matching `href` already defined in the References list (Sweller → DOI, Piaget/Vygotsky/Kolb → Scholar links).
- Implementation detail: add an optional `links: [{ match: "Sweller (1988)", href: "…" }, …]` field to those theory entries in `content.json`, then split the subtitle on those tokens at render. Cleaner than regex-detecting names from the references array.
- Style: same hover treatment as the References links (accent underline). With this in place, the References list items also being whole-row links (item 2) closes the loop.

## 4. Dashboard — Summary of Findings rewritten to match the paper

Replace the current 9-item array in `SummaryFindings` (`src/pages/Dashboard.tsx` L920–L944) with a faithful, condensed version of the Revision-10 wording. Keeping 9 cards, 3-col grid, but restructured so each card maps to one paragraph of the source text:

```
01  Sample            86 valid BSIT respondents at STI College Malolos with complete paired Prelim–Midterm grades.
02  Usage profile     Mean 4.31 weekly lab hours; mean Composite Behavioral Score 16.23.
03  Grade movement    Prelim 87.32 → Midterm 88.64 (Performance Change +1.30): a slight average gain.
04  Reliability       Cronbach's α = 0.70 — acceptable internal consistency for the Composite Behavioral Score.
05  Pearson r         Intensity (Composite) is significantly related to both Prelim and Midterm grades.
06  Pearson r         Frequency (Weekly Hours) is not significant at Prelim, but becomes significant at Midterm.
07  Regression        In the multiple model, Frequency is the only statistically significant individual predictor of Performance Change.
08  Model fit         Multiple regression significant overall (p = 0.0424) — H₀ rejected.
09  Variance          R² = 0.0733 — lab usage explains 7.33% of the variance in performance change; most variation comes from factors outside the model.
```

A short closing line (one muted paragraph below the grid) captures the overall takeaway: *"Intensity tracks absolute grades; Frequency drives the change between them."*

No chart/regression numbers elsewhere in the dashboard are touched — just this one component's `items` array and a small caption added beneath the grid.

---

## Files I'll touch in build mode

- `public/team/*.png` — new folder, six PNGs copied from uploads.
- `public/content.json` — add `links` arrays to the three theory entries (Sweller, Piaget/Vygotsky, Kolb).
- `src/components/sections/ResearchSections.tsx` — `ReferencesSection`: column-major layout + whole-row link. Theory subtitle render: tokenized author links.
- `src/pages/Dashboard.tsx` — `SummaryFindings`: new 9-item content + closing caption.

## Out of scope

- No changes to dashboard charts, regression numbers, or other Home sections.
- Azada portrait: not provided; initials fallback stays.
