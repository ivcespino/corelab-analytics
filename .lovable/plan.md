## Goal

Refine the Statistical Analysis Tool so it (1) lets users pick a confidence level and any other method-relevant parameters, (2) explains results in plain language tied to the chart, and (3) sits inside the same container width and responsive rhythm as the homepage.

---

## 1. Method parameters (confidence level + per-method options)

Add a "Parameters" sub-card under the method selector. Inputs are conditional on the method.

**Shared**
- `Confidence level` — Select with 90% / 95% / 99% (default 95%). Drives `α = 1 − conf`.

**Pearson R**
- `Tail` — Two-tailed (default) / One-tailed (positive) / One-tailed (negative). Affects p-value computation only.

**Linear Regression**
- `Confidence level` — used to compute coefficient CI bounds (`b ± t_{α/2, df} · SE`). Adds two columns (`CI Lower`, `CI Upper`) to the coefficient table.
- `Include intercept` — checkbox, default on. When off, fit through origin.

**Cronbach's Alpha**
- `Confidence level` — used for an approximate CI on α via the Feldt method:
  `1 − (1 − α) · F_{α/2}` lower, `1 − (1 − α) · F_{1−α/2}` upper, with `df1 = N−1, df2 = (N−1)(k−1)`.
- No additional parameters beyond that.

Implementation: extend `src/lib/stats.ts` signatures to accept an `options` object (`{ confidence?: number; tail?: "two"|"greater"|"less"; intercept?: boolean }`) and return the new fields. Update `ResultTables.tsx` to render CI columns when present.

---

## 2. Plain-language interpretation (replaces "AI Interpretation")

Rename the panel to **"Reading the Result"** and render a fixed, structured template. No LLM calls — deterministic strings filled from the computed numbers.

Every interpretation has four short blocks with icons:

1. **What you ran** — one sentence naming the test, variables, n, and confidence level.
   _e.g. "Pearson correlation between `study_hours` and `exam_score`, n = 12, two-tailed at 95% confidence."_
2. **What the chart shows** — describes the visualization in concrete terms.
   - Pearson: scatter of X vs Y with a fitted trend line; slope direction + tightness of points around the line.
   - Regression: observed-vs-predicted scatter; closeness to the dashed 45° line indicates fit quality.
   - Cronbach: bar chart of per-item means; flags items whose mean diverges sharply from the rest.
3. **What the numbers mean** — translates each headline statistic into a sentence:
   - Pearson: r magnitude bucket (very weak/weak/moderate/strong) + direction; p vs α verdict.
   - Regression: R² as "% of variance explained"; F-test verdict; per-coefficient verdict using p and CI (whether CI crosses 0).
   - Cronbach: α bucket (Excellent/Good/Acceptable/Questionable/Poor) + CI range.
4. **What it implies** (only when the method supports an inferential claim):
   - Pearson: "Evidence supports / does not support a linear association at the chosen confidence level. Correlation does not imply causation."
   - Regression: which predictors are statistically significant and the direction of their effect on the response, with a unit-change phrasing ("a 1-unit increase in X is associated with a B-unit change in Y").
   - Cronbach: scale recommendation ("the scale is reliable enough for research use" / "consider revising or removing low-contribution items").

Implementation: create `src/lib/interpretations.ts` exporting `buildPearsonInterp`, `buildRegressionInterp`, `buildCronbachInterp` returning `{ ran, chart, numbers, implies? }`. Replace the freeform paragraph in `Tool.tsx` with a 4-block component. Keep the existing `Sparkles` accent so it visually reads as the same panel.

---

## 3. Width + responsiveness alignment

Currently the Tool page uses `max-w-7xl` while every homepage section uses `max-w-6xl`. Make Tool match.

- Change Tool's outer container from `max-w-7xl` to `max-w-6xl`.
- Keep the two-column layout (`lg:grid-cols-[1fr_320px]`) but only at `lg` and up; below that the docs sidebar stacks under the results (already the case).
- Tighten horizontal padding to match homepage rhythm: `px-6` on mobile, no change at larger breakpoints.
- Audit responsive breakpoints:
  - Method + Run button row: stack on mobile (`grid-cols-1 sm:grid-cols-2`), Run button becomes full-width on mobile.
  - Parameter sub-card: 1 column on mobile, 2 on `sm`, 3 on `md`.
  - Result tables: already wrap with `overflow-x-auto`; verify Cell grids collapse to 2 columns on mobile (already the case).
  - Plot height: drop from 420 → 320 on mobile via a `useMediaQuery` or a simple `window.innerWidth < 640` check passed to `PlotlyChart`.
- Sticky docs sidebar: keep `lg:sticky lg:top-24`; on mobile it renders as a normal block at the bottom.

---

## 4. Other additions worth including

- **Download results** — a "Export report" button that bundles the descriptive table, statistical table, interpretation, and the Plotly figure (PNG via `Plotly.toImage`) into a single `.html` file in `/mnt/documents` style download (client-side Blob, no backend).
- **Copy citation-style summary** — one-click copy of a single APA-ish line, e.g. `r(10) = .87, p < .001`.
- **Sample datasets dropdown** — three preloaded CSVs (Likert scale for Cronbach, two-variable for Pearson, multi-predictor for Regression) so first-time users can try each method instantly.
- **Variable preview** — when a numeric column is selected, show its n / mean / SD inline next to the checkbox so users see what they're picking before running.
- **Validation hints** — surface warnings (not errors) for: n < 10 ("small sample, interpret with caution"), highly correlated predictors in regression (VIF > 5), constant columns.

---

## Technical section

Files to edit:
- `src/lib/stats.ts` — add `options` arg, CI computations, tail handling.
- `src/lib/interpretations.ts` — new file, deterministic templated text.
- `src/components/tool/ResultTables.tsx` — add CI columns when present.
- `src/components/tool/PlotlyChart.tsx` — accept `height` from caller responsively.
- `src/pages/Tool.tsx` — `max-w-6xl`, parameter sub-card, structured interpretation panel, export/copy buttons, sample dataset switcher, responsive tweaks.

No new dependencies required.

---

## How I would re-prompt myself

> Refine the `/tool` page. (1) Add a **Parameters** sub-card under the method selector with a Confidence Level select (90/95/99, default 95) plus method-specific params: Pearson gets a tail selector; Regression gets an "Include intercept" toggle and outputs coefficient CIs at the chosen level; Cronbach gets a Feldt CI on α. Pipe the new options through `src/lib/stats.ts`. (2) Replace the freeform "AI Interpretation" with a deterministic, four-block **"Reading the Result"** panel — *What you ran / What the chart shows / What the numbers mean / What it implies* — generated by a new `src/lib/interpretations.ts`. Phrasing must reference the chart and translate every headline statistic into plain English; only show *implies* when the test supports an inferential claim. (3) Match the homepage container: switch Tool's outer wrapper from `max-w-7xl` to `max-w-6xl`, keep `px-6`, verify the layout collapses cleanly at sm/md/lg, drop the Plotly height on mobile, and ensure the sticky docs sidebar only sticks at `lg+`. (4) Add export-as-HTML report, copy-citation, sample dataset switcher, inline variable previews, and small-sample/VIF warnings. Keep the existing design tokens, glass cards, Space Grotesk + Inter typography, and navy/cyan palette. No new dependencies.
