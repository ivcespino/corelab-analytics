## Scope

Targeted polish + content additions across Home, Tool, and shared components. No business-logic changes outside what's listed.

---

## 1. Global

### 1a. Em-dash spacing — `word— word` (no space before, single space after)
Sweep all visible text in:
- `public/content.json`
- `public/dashboard.json`
- `src/components/sections/*.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/FinaleSection.tsx`
- `src/pages/Tool.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Team.tsx`
- `src/lib/interpretations.ts`, `src/lib/glossary.ts`

Replace ` — ` (space-emdash-space) with `— ` (emdash-space). Done via a one-shot script run during the edit, then spot-checked.

### 1b. Divider TOC numbering goes column-by-column, not row-by-row
`ChapterDividerSection` (`ResearchSections.tsx` ~L370) renders the TOC as `sm:grid-cols-2`, which fills 1,2 / 3,4 / 5,6. Switch to column flow:

```text
[ 01 Background ]   [ 05 Significance ]
[ 02 Variables  ]   [ 06 RRL          ]
[ 03 RQs        ]   [ 07 Framework    ]
[ 04 Hypotheses ]
```

Use `grid-flow-col` + dynamic `grid-rows-{ceil(n/2)}` (computed via inline style `gridTemplateRows: repeat(N, minmax(0,1fr))` since Tailwind can't take a runtime value).

---

## 2. Home page

### 2a. Hero (`HeroSection.tsx` + `content.json`)
- Move the long `description` text **into the right-side descriptor box** (so the left column has only badge → heading → subheading → CTAs). The descriptor box becomes the primary explanatory surface.
- Rename primary CTA: **"Take the Survey" → "Open the Tool"** (keeps `/tool` link).
- Add a third CTA on the same row: **"Download Full PDF"** with a `Download` icon, linking to a configurable `hero.pdfHref` in `content.json` (default `/research.pdf`). User drops the file at `public/research.pdf`. Falls back to `target="_blank"` open.

### 2b. References / Sources slide (new)
New section at end of Chapter 1 (after `framework-experiential`, before `ch2-divider`) using a new `references` template:
- Lists every cited author with year + title + external link (DOI / Google Scholar search URL when no DOI is known).
- Two-column compact list, anchor links open in new tab, `text-sm`.
- TOC entry added to Chapter 1 divider.

Sources covered (from existing RRL/Framework slides): Limniou (2021), Canoy et al. (2023), Mohamed (2025), Siega (2025), Escubido et al. (2025), Vahid et al. (2023), Cadiz-Gabejan & Takenaka (2021), Sweller (1988), Piaget (1972), Vygotsky (1978), Kolb (1984).

### 2c. Reduce overflow on Participants and Sampling slides
- `participants` (SamplingFunnelSection): tighten step row to `py-3 → py-2`, value font `text-lg → text-base`, formula card padding `p-6 → p-5`, formula expression `text-2xl → text-xl`. Switch grid from `lg:grid-cols-[1.3fr_1fr]` to `lg:grid-cols-[1.4fr_1fr]` and align items start. Confirms fit at 1062×618.
- `inclusion-criteria` (TableSlideSection): reduce row padding `py-3 → py-2`, header padding too; cap "Why It Matters" column with `text-[13px]`.
- Add an optional `dense` flag to `TableSlideSection` so only the targeted tables shrink (others stay default).

### 2d. Detail Data Analysis Plan
Replace the two existing analysis slides with **three** more-detailed slides so each test gets its own explanation of *what it outputs and what it means*:

1. `analysis-overview` (methods template) — α, software, sequence.
2. `analysis-table` (existing table, kept) — the planned tests grid, expanded "Output & Interpretation" column.
3. `analysis-deepdive` (new `methodsTwoCol` variant or two stacked card rows) — per-test "What it produces" / "How to read it":
   - Descriptive Statistics → mean/SD/min/max → "characterizes spread; flags skew or outliers."
   - Cronbach's α → single coefficient → "≥ 0.70 = composite is internally consistent."
   - Pearson r → r ∈ [−1, 1] + p → "sign = direction, |r| = strength, p < .05 = unlikely by chance."
   - Linear Regression → R², F, β, p → "R² = % variance explained, β = expected change in Y per +1 X, p tests if predictor matters."

Split across **two slides** (2 tests per slide) to avoid overflow.

---

## 3. Tool page (`src/pages/Tool.tsx`)

### 3a. Five datasets per method (15 total samples)
Replace the `SAMPLES` map with a list of 5 Cronbach + 5 Pearson + 5 Regression datasets, each with a distinct theme so users can experiment and see different shapes (strong positive, weak, near-zero, negative, noisy):

- **Cronbach (5)**: classroom satisfaction, app usability (SUS-style), workplace stress, study habits, fitness motivation.
- **Pearson (5)**: study hours × score (strong+), screen time × sleep (negative), height × shoe size (strong+), coffee × productivity (weak), random noise (near-zero).
- **Regression (5)**: exam (study/sleep/gpa), house price (sqft/beds/age), salary (yrs_exp/edu/cert), plant growth (water/light/fertilizer), gym progress (sessions/sleep/protein).

Render the sample picker as a `Select` grouped by method (`SelectGroup` + `SelectLabel`) so the row doesn't overflow. Loading a sample auto-switches `method`.

### 3b. Tooltip improvements
- **Allow overflow outside containers**: `StatTooltip` already uses `<TooltipContent>` (Radix). Wrap its content in a `TooltipPrimitive.Portal` (already implicit in shadcn) and verify; if still clipped, move the `TooltipProvider` to the app root in `App.tsx` and ensure the tool's scroll containers don't have `overflow-hidden`. Add `collisionPadding={16}` and `avoidCollisions` to keep it on-screen.
- **Richer copy**: expand `GLOSSARY` entries, especially "citation-style summary" (explain what APA-style format is, why we report `r(df) = …, p = …`, and how to paste it into a paper). Also flesh out: `pearsonR`, `pValue`, `confidence`, `tail`, `cronbach`, `regression`, `intercept`, `vif`, `rSquared`, `beta`.

---

## Out of scope
- No backend, no auth.
- No new charting library.
- Not regenerating any analysis results.

## Verification checklist
- All snap sections fit at 1062×618 with no internal scroll (Home + Dashboard preview).
- Divider TOC reads top→bottom in column 1 then column 2.
- "— " spacing fixed everywhere it shows.
- PDF button opens `/research.pdf` (404 acceptable until user uploads file).
- Tool: switching sample updates method + clears stale results; tooltips render above cards/sections.
