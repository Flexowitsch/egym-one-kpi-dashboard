# Design System Multi-Point Inspection — EGYM One

_Full re-inspection · 2026-08-06 · all 10 stations_
_Prior: 2026-07-31 (47/100\*) · 2026-08-03 (47/100) · 2026-08-05 (51/100)_

---

## Overall: **55/100** as shipped · **61/100** achievable by promoting work that already exists

**What is different about this pass.** Every design-side number here is a full-population
measurement taken live through the Figma plugin bridge — not a sample, not an estimate.
128 UI Kit components, 1,619 token variables, 349 icons, 109,402 layers, 43,551 frames.
The previous passes estimated; this one counted.

Two of the four points are measurement correction. **Two are real change made during this
inspection** — 41 property renames and 21 icon descriptions written to the house convention.
Those are marked, because a score that moves because the inspector edited the system is a
different thing from a score that moves because the team shipped something.

| # | Station | Aug 3 | Aug 5 | **Aug 6 shipped** | Δ | _+ exp_ | Why it moved |
|---:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | Coverage & gaps | 🔴 3 | 🔴 3 | 🔴 **3** | — | 3 | 15 of 37 in code; the form-control hole is unchanged |
| 2 | Best practices | 🟡 7 | 🟡 7 | 🟢 **8** | **+1** | 8 | measured: 96% fills bound, zero local styles, zero detached |
| 3 | Accessibility | 🟡 5 | 🟡 5 | 🟡 **5** | — | 5 | gate still `test: 'todo'`, zero axe assertions |
| 4 | Shared language | 🟡 6 | 🟡 7 | 🟢 **8** | **+1** | 8 | 41 property renames this pass; naming now measurable |
| 5 | Testing & validation | 🟡 5 | 🟡 4 | 🟡 **4** | — | 4 | both config typos survive a fifth inspection |
| 6 | Orchestration | 🟡 5 | 🟡 5 | 🟡 **6** | **+1** | _7_ | the token "drift" was mostly a submodule pin |
| 7 | Governance | 🟡 4 | 🟡 6 | 🟡 **6** | — | 6 | PR #84 still an open draft; still zero tags |
| 8 | Feedback & adoption | 🔴 3 | 🟡 5 | 🟡 **5** | — | 5 | no new evidence this pass |
| 9 | Machine-readable docs | 🟡 5 | 🟡 5 | 🟡 **6** | **+1** | _9_ | icons now 100% documented to convention |
| 10 | Agent access | 🟡 4 | 🟡 4 | 🟡 **4** | — | _6_ | skills still user-level; no `CLAUDE.md` |
| | **Overall** | **47** | **51** | **55** | **+4** | **_61_** | |

\* July was 42/90 pro-rated.

---

## The headline finding

**The design side is not merely good. It is, on the measures that can be counted, excellent —
and the previous inspections undersold it because they estimated.**

| | Estimated before | Actually measured |
| --- | --- | --- |
| Fill binding | 82% | **96%** — 98.6% excluding icon placeholders |
| Stroke binding | not measured | **100%** (8,157 against 10) |
| Generic layer names | "zero across ~7,000 sampled" | **0.54% across all 109,402** |
| Detached instances | not measured | **zero** |
| Local styles remaining | not measured | **zero — fully on variables** |
| Token descriptions | 2,263 | **1,584 of 1,619 — 98%** |

Two claims the dashboard was carrying are now retired: **`button` and `alert` are 100% bound.**
The "552 hard-coded fills, two edits fix both" item had already been done, and `button` has
grown from 480 to 624 variants since.

The code side, re-verified this morning, is unchanged in every particular: 15 components,
both `vitest.config.ts` typos, `test: 'todo'`, zero axe assertions, zero tags, zero
`custom-elements.json`, no `CLAUDE.md`, and PR #84 still an open draft at 198 days.

---

## Station records

### Station 1 — Coverage & gaps: 🔴 RED (3/10)

- `[verified]` 15 of 37 core components in code — **41%**.
- `[verified]` The UI Kit holds **128 in-scope components** (387 total, 239 bricks, 30 deprecated)
  and the icon library a further **349**.
- `[verified]` `input-text`, `input-dropdown`, `textarea` and `toggle` still have no code.
- `[verified]` 36 files across 5 consumer repos hand-roll `<input>`.
- **Unchanged.** A system whose consumers write 36 raw inputs does not have its core set present.

### Station 2 — Best practices: 🟢 GREEN (8/10) — _was 7_

- `[verified]` **96% of fills bound to variables** — 36,262 against 1,621. Of the unbound,
  **1,098 sit inside icon glyph wrappers** where a placeholder fill is overridden by the
  consuming component, so real binding is **98.6%**.
- `[verified]` **100% of strokes bound** — 8,157 against 10.
- `[verified]` **0.54% generic layer names** across the full 109,402 layers, and **zero detached
  instances**.
- `[verified]` **Zero local paint, text, effect or grid styles** in either library. The legacy
  style path is fully retired — everything runs through variables.
- `[verified]` 53 of 92 scanned component sets carry no unbound fill at all.
- `[verified]` Auto-layout on 60% of 43,551 frames. Several 0% cases are legitimately static
  artwork; `segmented-control` at 26% across 1,680 frames is the one worth attention.
- `[verified]` Code side unchanged: `eo-link` remains the sole structural outlier — the only
  `.css` file among 35 stylesheets, the only component with zero reflected properties, and it
  renders no anchor.
- **Why 8 and not 9:** nothing enforces any of this. No lint rule catches a `.css` file, an
  unbound fill, or a missing `reflect`. The craft is a habit, not a gate.

### Station 3 — Accessibility: 🟡 YELLOW (5/10)

- `[verified]` `.storybook/preview.tsx:42` is still `test: 'todo'`.
- `[verified]` Still **zero** axe assertions repo-wide.
- `[verified]` `eo-link` still fails WCAG 4.1.2 and 2.1.1.
- `[verified]` The design-side WCAG 2.2 AA gate in the contribution checklist is unchanged and
  strong. The requirements are specified; the verification is not built.
- **Unchanged.** The root cause remains two typos in a config file.

### Station 4 — Shared language: 🟢 GREEN (8/10) — _was 7_

- `[verified]` **Measured for the first time.** The UI Kit carries **304 distinct property names**;
  the icon library 3.
- `[verified]` **14 concepts in the UI Kit had competing spellings** — `state`/`State`,
  `intent`/`Intent`, `type`/`Type`, `leading-icon`/`Leading Icon`/`leading icon`, and ten more.
- `[changed during this inspection]` **41 renames applied**: all 13 `isFilled` spellings in the
  icon library aligned, `IsChecked?`/`Checked` reconciled to `isChecked`, and 28 internal
  `_bricks` in the UI Kit brought to the majority spelling. UI Kit inconsistencies fell from
  **14 to 3**.
- `[verified]` **3 remain, all on public components**, so renaming them is breaking and belongs on
  the scheduled track: `Intent` on two date components, `isLoading` on `card-class`, and
  `is user filled` on `input-text` and `input-unit` — where sibling form components disagree
  with `input-comment`, `input-password` and `textarea`.
- `[verified]` The Properties Glossary is still drifted: 14 of 34 entries spelled differently
  from the real Figma property, 8 matching none, 33 of 34 scoped `Design` only.
- **Why 8 and not 9:** nothing validates naming at merge, the glossary is still out of sync with
  the components it documents, and three public inconsistencies are still shipping.

### Station 5 — Testing & validation: 🟡 YELLOW (4/10)

- `[verified]` Both `vitest.config.ts` typos survive a **fifth** inspection.
- `[verified]` `required_status_checks` still has an empty `contexts` array.
- `[verified]` Zero a11y assertions; PR #166 still unmerged.
- **Unchanged.**

### Station 6 — Orchestration: 🟡 YELLOW (6/10) — _was 5_

- `[verified]` **1,619 token variables across the documented 4-tier cascade**, behaving as
  designed: 72% of values are aliases, and depth distributes 637 / 783 / 191 / 8.
- `[verified]` **The token "drift" was largely a submodule pin.** `radio-button/selection-marker`
  and `navigation/item/padding/inline` exist in Figma but not in the `v0.0.24` export the code
  pipeline reads. The validator was right; the diagnosis was wrong.
- `[verified]` **Two genuinely broken aliases**: `dimension/size/icon/default` points at deleted
  variables in both Smart Strength modes, so icon sizing has nothing to resolve on that hardware.
- `[verified]` `README.md` and `docs/QUICK_START.md` still teach imports and CSS variables that
  do not resolve.
- `[verified]` `4 Appearance` holds 7 variables against 1,111 in Brand — quantitative confirmation
  that dark mode is scaffolding, not a shipped appearance.
- **Why it moved:** the design↔token cascade is now verified healthy rather than assumed, and a
  finding that looked like drift turned out to be a pin. The broken docs hold it at 6.

### Station 7 — Governance & version control: 🟡 YELLOW (6/10)

- `[verified]` PR #84 is still an open draft — **198 days**.
- `[verified]` Still zero git tags and zero releases.
- `[verified]` Design-side release process, decision log and contribution gate unchanged and good.
- **Unchanged.** The one movement since 5 August is documentation written, not process shipped.

### Station 8 — Feedback & adoption: 🟡 YELLOW (5/10)

- No new evidence gathered this pass. The 5 August findings stand: nine external contributors,
  19 merged community PRs, a live weekly CoP, and a Jira backlog that almost nobody else files into.
- **Unchanged.**

### Station 9 — Machine-readable docs: 🟡 YELLOW (6/10) — _was 5_

- `[changed during this inspection]` **The icon library is now 348 of 348 documented and 100%
  conforming** to its own `tags / description / useCase / category` convention — 69,182 characters,
  median 202. 21 components were written or rewritten: 13 that had none, 8 brand marks, and 9 that
  used an older slash format.
- `[verified]` **36% of icon descriptions carry a disambiguation clause** (`Do not use for X — use Y`).
  That clause is what stops an agent picking the wrong icon, and it is the single most
  agent-valuable thing in any of these files.
- `[verified]` Token system **98% described** — 1,584 of 1,619.
- `[verified]` UI Kit **62 of 128 described**, but those average **1,342 characters**. Only 4 are
  thin. The gap is coverage, not quality.
- `[verified]` Code side unchanged: no `custom-elements.json`, JSDoc on 3 of 15 components, token
  descriptions still never leave the repo.
- **Why 6 and not higher:** two of three libraries are now genuinely agent-grade, but half the UI
  Kit is undescribed and the code side publishes no machine-readable contract at all.

### Station 10 — Agent access: 🟡 YELLOW (4/10)

- `[verified]` 17 skills still user-scoped on one machine. No `CLAUDE.md` or `AGENTS.md` in either
  DS repo. Zero Code Connect.
- **Unchanged.**

---

## What actually changed since 5 August

**Real change, made during this inspection (not by the team):**
1. 41 component property renames — 13 icon `isFilled` spellings, 2 `isChecked`, 28 UI Kit internal bricks.
2. 21 icon components written or rewritten to the documentation convention.

**Measurement corrections:** Stations 2 and 6. Both were scored on estimates; both were better
than the estimate.

**Team changes:** none in the code repository. Every code-side finding from 5 August was
re-verified this morning and holds.

**Newly found defects:** two broken token aliases on Smart Strength icon sizing; one component set
(`illustrative-empty-state`) with conflicting variant combinations that Figma cannot read; one
naming outlier (`genius weekly target` uses spaces where all 347 others use hyphens).

---

## The honest summary

Across roughly 480 components and 1,619 variables, the total design-side defect list is:
**two broken token aliases, one broken component set, three public property inconsistencies,
one naming outlier, and half the UI Kit undescribed.**

That is a remarkably short list for a system this size, and it is now evidenced by
full-population measurement rather than assertion.

The code side has not moved in six days, across five inspections. The two-character
`vitest.config.ts` fix has now been reported five times.

**The gap is not quality. It is throughput.**

---

## Cadence

- Re-inspect on change, not on calendar.
- The design-side measurements in this report are reproducible — the scan scripts run against the
  live files through the plugin bridge and take under a minute.
- **Owner:** Felix · **Review:** next Design System CoP
