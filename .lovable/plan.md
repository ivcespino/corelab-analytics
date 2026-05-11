## Scope

Continue the previously approved-direction work + one new copy tweak. No backend changes.

---

## 1. Copy: "Practical Research" → "Research"

- `public/content.json` hero badge: `"Practical Research • A.Y. 2025–2026"` → `"Research • A.Y. 2025–2026"`.
- `public/team.json` adviser title: leave as **"Practical Research Adviser"** (it's the adviser's actual role title on the Team page, not Home). Confirm with user if they want this renamed too.
- Sweep `src/` + `public/*.json` for any other "Practical Research" strings — currently only the two above.

---

## 2. Global: orientation / small-screen notice

- New `src/components/OrientationNotice.tsx`, mounted once in `src/App.tsx`.
- Shows a centered modal/toast when `window.innerWidth < 900` **or** portrait with width < 1100, on routes that use snap (`/` and `/dashboard`).
- Copy: "CoreLab Analytics works best on a landscape tablet or desktop — the experience uses full-page slides." + Dismiss button.
- Dismissal stored in `sessionStorage` so it doesn't nag on every nav; re-evaluates on `resize` / `orientationchange`.
- Styled with existing tokens (navy/cyan, Space Grotesk heading, Inter body).

---

## 3. Chapter divider TOC → clickable anchors

- `ChapterDividerSection` in `src/components/sections/ResearchSections.tsx`: each TOC entry becomes a `<button>` that calls `document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })`.
- TOC entries in `content.json` get an optional `id` field (e.g. `{ "label": "Background", "id": "background-context" }`); falls back to slugified label.
- Same treatment for Dashboard chapter dividers in `src/pages/Dashboard.tsx`.
- Adds hover affordance (cyan underline + chevron).

---

## 4. Home: compact References slide

- `ReferencesSection`: switch to a tight 3-col grid (`lg:grid-cols-3`, `md:grid-cols-2`, single col on mobile), `text-[12px]`, `leading-snug`, hairline dividers, numbered list, no trailing arrow icon — fits in one snap page.
- The **author + (year)** is the link (opens DOI / Scholar in new tab); title text becomes plain foreground.

---

## 5. Dashboard

### 5a. Fix the grey scatter points
In `PearsonDeepDive` and `RegressionDeepDive` (`src/pages/Dashboard.tsx`), markers are colored grey when not significant. Change to:
- All markers cyan (`hsl(188 100% 42%)`).
- Encode significance via the **trend line**: solid navy when significant, dashed muted-foreground when not.
- Add a "Not significant — α = 0.05" badge above the chart when applicable, plus a small legend caption.

### 5b. Summary of Findings → 9 items
Update `SummaryFindings` in `src/pages/Dashboard.tsx` to list the 9 findings from the paper:
1. Frequency of use predicts exposure-driven gains.
2. Intensity is the strongest single predictor.
3. Cronbach's α confirms scale reliability.
4. Model A (frequency-only) significant.
5. Model B (intensity-only) significant.
6. Combined model shows ceiling effect / multicollinearity.
7. Pearson r between usage and grade change is positive but moderate.
8. H₀₁ rejected for the primary RQ.
9. Divergent finding noted: heavy users without intentional study habits show no gain.

(Will pull exact wording from current paper text in `content.json` / `dashboard.json` while editing — placeholder list above for plan visibility only.)

---

## 6. Team: portrait placeholders

- Update `public/team.json` so each member has `"image": "/team/<Lastname>.png"` (Espino, Bolacja, etc.).
- User drops PNGs into `public/team/`. Missing files degrade to existing initials via `onError`.
- `PersonCard` / `LeadCard` in `src/pages/Team.tsx` render `<img>` with `bg-white`, `object-contain`, rounded corners, and `onError` fallback to the initials block.

---

## Verification
- 1062×618 preview: no internal scroll on References, Participants, Analysis Plan slides.
- TOC entries on every chapter divider scroll-jump to the right slide on Home + Dashboard.
- Resize browser to portrait < 900px → notice appears once per session.
- Dashboard scatter: no grey markers; trend line dashes when not significant; badge visible.
- Team page: missing PNGs fall back to initials without console errors.

## Out of scope
- No new datasets, no chart library changes, no backend.
- Adviser title on Team page (kept as "Practical Research Adviser" unless user says otherwise).
