## Scope

Three areas: **Home**, **Tool**, **Dashboard**. All changes keep existing design language (navy + cyan, Space Grotesk + Inter, snap-section layout, semantic tokens).

---

## 1. Home page (`public/content.json`, `src/components/sections/ResearchSections.tsx`, `src/pages/Index.tsx`)

### 1a. Split Research Questions slide → isolate Hypotheses
- Current `research-questions` slide carries Central RQ, 3 sub-RQs, **and** H₁/H₀₁ — too dense.
- Split into two snap sections:
  - `research-questions` (template `rq`) — keeps Central + Sub-RQs only.
  - `hypotheses` (new template `hypotheses`) — full slide for H₁ and H₀₁ with bigger typographic treatment, alt vs null contrast, and a one-line explainer of the α = 0.05 decision rule.
- Update the `rq` component to drop the hypotheses block; add a new `HypothesesSection` component.
- Add the new entry to the Chapter 1 TOC.

### 1b. Redesign "Significance of the Study" so it fits one screen
- Current `significance` slide stacks: chapter chip + title + General Objective callout + 5 specific objective cards. On 1062×618 (current viewport) this scrolls.
- Redesign to a balanced two-column layout:
  - **Left**: the General Objective in a single emphasized card (large display type, no body wall).
  - **Right**: 5 specific objectives as a compact numbered list (small icon + one-line text, not full cards). Tighter line-height, `text-sm`, no per-item card chrome.
- Drop the `text-base` body padding inside cards, reduce card padding from `p-6` → `p-4`, and switch the objectives container from grid-of-cards to a single bordered list with subtle separators.
- Verify at 1062×618 and at smaller viewports — content should fit without internal scroll.

---

## 2. Tool page (`src/pages/Tool.tsx`)

### Clear predictors when Response (Y) changes
- Current behavior: changing `regResponse` keeps `regPredictors` intact, which can leave a stale predictor selected (and is hidden from the list, since we filter `h !== regResponse`).
- Fix: replace the inline `setRegResponse` with a wrapper that also resets `setRegPredictors([])`. Apply on the regression `<Select onValueChange>` only — Pearson Y is unaffected.

---

## 3. Dashboard page (`src/pages/Dashboard.tsx`, possibly `public/dashboard.json`)

### 3a. Fix "Respondents by Subject" chart
- Dataset has 5 subjects; the hero tile uses a horizontal Plotly bar at 170px height with `margin: { l: 160 }` and y-labels truncated to 22 chars. At small heights the categorical y-axis collapses, which is why it visually reads as "one subject".
- Replace with a clean vertical bar chart (short labels: "CP1", "CP2", "EDP", "SAM", "ITC") and a tooltip carrying the full subject name. Keep cyan accent. Apply the same fix to the Respondents slide so it has its own per-subject chart next to the table.

### 3b. Add Chapter 3 / Chapter 4 divider slides
- Mirror the home page `ChapterDividerSection` — full-bleed intro slide with chapter number, title, lead, mini-TOC.
- Two new slides:
  - `ch3-divider` — "Chapter 3 · Results" before Respondents.
  - `ch4-divider` — "Chapter 4 · Discussion" before Usage & Grades.
- Either import the existing `ChapterDividerSection` from `src/components/sections/ResearchSections.tsx`, or extract it to a shared file. Prefer importing to keep one source of truth.
- Add both to the dashboard TOC, scoped to their respective chapter group.

### 3c. Deep-dive slides per statistical analysis

**Correlation (currently one slide with table + 1 scatter)**
Restructure into:
- `correlation` — keep the full r/p table as the **summary** slide (no chart, full-width readable table + 2 short interpretation callouts).
- `correlation-pr1` — Frequency × Preliminary (scatter + r, p, sig badge + plain-English read).
- `correlation-pr2` — Intensity × Preliminary.
- `correlation-pr3` — Frequency × Midterm.
- `correlation-pr4` — Intensity × Midterm.
- Build one reusable `<PearsonDeepDive>` component (props: title, x/y arrays, x/y labels, r, p, sig, narrative) so all four are uniform.

**Regression (currently 2 slides: model summary + coefficients)**
Restructure into:
- `regression` — keep table of Models A/B/C as the **summary** slide (no chart).
- `regression-model-a` — Frequency-only: scatter of Hours vs Performance Δ + trend line, R²/F/p tile, β/SE/t/p tile, plain-English interpretation.
- `regression-model-b` — Intensity-only: scatter of Intensity vs Performance Δ + trend line, same tiles.
- `regression-model-c` — Combined: residuals or observed-vs-predicted plot + per-coefficient bars showing significance, predictive formula, plain-English read.
- `regression-coef` — keep the existing coefficients table slide, retitled to act as the consolidated reference.
- Build one reusable `<RegressionDeepDive>` component.

### 3d. Summary of Findings — match Revision 10
- Current slide shows 3 items. Revision 10 (already encoded throughout the dashboard) supports a fuller list. Expand to **6 findings**:
  1. Intensity is the strongest correlate of absolute grade level at both Preliminary and Midterm.
  2. Frequency is not significant at Preliminary but becomes significant by Midterm — exposure-effect pattern.
  3. Cronbach's α = 0.70 confirms acceptable internal consistency of the Intensity composite.
  4. Frequency is the **sole** significant predictor of Performance Change in the combined regression (β = 0.4339, p = 0.0251).
  5. Intensity loses predictive power for *change* once Frequency is controlled (ceiling effect on already-engaged students).
  6. The combined model is significant (R² = 0.0733, F = 3.28, p = 0.0424) → H₀₁ is rejected; lab usage predicts measurable academic progress.
- Switch grid from `md:grid-cols-3` to a denser `md:grid-cols-2 lg:grid-cols-3` with smaller cards so all six fit one screen.

### 3e. Expand Chapter 4 Discussion slides
Add depth (cite the data, not just claims) to:

- **`usage-grades` (Relationship Between Usage Metrics and Absolute Grades)** — add a third panel under the two period cards: an "Interpretation" strip explaining *why* quality-of-engagement leads quantity at Preliminary (selection effect: students who engage actively bring prior preparation), and *why* Frequency closes the gap by Midterm (exposure accumulation). Reference Vahid et al. and Limniou inline.

- **`predictors` (Predictors of Academic Performance Change)** — keep the 5 stat tiles, then add a two-column "Reading the regression" block:
  - Left: what each significant β means in plain language ("an extra hour per week predicts +0.43 grade points of improvement"), with a worked numeric example (4 hrs → 7 hrs ⇒ predicted +1.30 Δ).
  - Right: what *not* to read into it (R² = 7.33% means 92.67% of variance is unexplained by lab usage alone; correlation ≠ causation; sampling caveat).

- **`divergence` (Interpretation of Divergent Findings — main)** — keep the two-card Intensity/Frequency contrast, add a third row directly under it:
  - "Why the divergence makes sense" — short paragraph linking Intensity ↔ Constructivist Theory (knowledge built through active engagement, hence high *level*) and Frequency ↔ Experiential Learning (iterative cycle, hence *change*).

- **`divergence-ctx` (Contextual Considerations)** — add two more context cards beyond the existing two:
  - "Self-report limitation" — Frequency and Intensity are self-reported; potential recall and social-desirability bias.
  - "Cross-sectional grade pairing" — the Δ uses Prelim/Midterm pairs from possibly different semesters; the finding describes a general intra-term pattern, not a longitudinal trajectory.

---

## Technical section

**Files to edit:**
- `public/content.json` — split `research-questions`, add `hypotheses` entry, restructure `significance` content if needed.
- `src/components/sections/ResearchSections.tsx` — add `HypothesesSection`, redesign `SignificanceSection` layout, trim `ResearchQuestionsSection` to drop hypothesis block. Export `ChapterDividerSection` for dashboard reuse (already exported).
- `src/pages/Index.tsx` — register `hypotheses` template case.
- `src/pages/Tool.tsx` — wrap `setRegResponse` to also clear `regPredictors`.
- `src/pages/Dashboard.tsx`:
  - Add Ch3/Ch4 divider sections (import `ChapterDividerSection`).
  - Replace subject horizontal bar with vertical bar (short labels + hover full name) in `DashboardHero` and add a per-subject chart inside `Respondents`.
  - Split `Correlation` into 1 summary + 4 deep-dive sections via a new `PearsonDeepDive` helper.
  - Split `RegressionSummary` into 1 summary + 3 model deep-dive sections via a new `RegressionDeepDive` helper; keep `RegressionCoefficients` as consolidated table.
  - Expand `SummaryFindings` from 3 → 6 items, adjust grid.
  - Extend `UsageGrades`, `Predictors`, `DivergenceMain`, `DivergenceContext` with the additional cards/blocks listed above.
  - Update `tocItems` array to include new section IDs in correct chapter groups.

**Verification approach:**
- After edits, type-check.
- Open preview at the current viewport (1062×618) and snap through every new/changed slide on Home and Dashboard to confirm zero internal scrolling.
- Verify Tool: change Response (Y) and confirm predictor checkboxes reset to empty.
- Verify Dashboard subject chart shows all 5 subjects at the hero tile height.

No new dependencies. No data file changes — `responses.json` already supports all charts.
