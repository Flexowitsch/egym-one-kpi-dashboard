# Multi-Point Inspection Report — EGYM One Design System

_Inspected: 2026-08-03 · Technician: Claude Code (Opus 5) · Previous inspection: 2026-07-31 (47/100, recovered from session transcript)_
_Vehicle profile: `ds-inspection/GARAGE.md` (checked in 2026-08-03)_

## The short version

**The code has not changed since the last inspection.** Zero commits since 2026-07-24 — a week *before* the July 31 baseline. Every code-side finding from that report was re-verified this pass and every one is still present: `eo-link` still renders `<div>`s instead of `<a>`, the a11y gate is still `'todo'`, and `vitest.config.ts` still points at two paths that do not exist. Stations 3 through 7 score exactly what they scored three days ago.

What this pass added is the evidence the last two inspections could not reach, and it reframes the system's central problem. **EGYM One is not the design system these products are built with — it is the newest of several.** Five of eight consumer repos still ship the legacy `react-design-system` and `wc-design-system` alongside it; four also carry MUI. `operator-portal-frontend`, your heaviest EGYM One user, is structurally a MUI application: `@mui/material`, `@mui/icons-material`, `@mui/system`, `@mui/x-date-pickers`, `mui-tiptap`, emotion, and `react-hook-form`. Across five repos, **36 files contain raw `<input>`**. The Station 1 coverage gap is not a queue of unbuilt components — it is a gap that has already been filled by something else.

**The feedback loop is not slow; it is empty.** Of the 60 oldest open DSC tickets, **58 were filed by Felix** — two came from anyone else, across eight consuming teams. Forty-six sit in status "Neu", untriaged, with a median of 293 days since anyone touched them. That moves Station 8 to red.

The good news is real and worth naming. The Figma library's craft is **excellent** where it was previously unmeasured: across nine component sets and roughly 7,000 layers, there are **zero generic layer names** — not one "Frame 1" or "Rectangle 4" — and 82% of solid fills are bound to variables. And the unbound ones are systematic rather than scattered: `button` has exactly 480 hard-coded fills across exactly 480 variants, `alert` exactly 72 across 72. One fill per variant means one source element per component, so those large numbers are single fixes, not audits.

**Overall: 47/100** — a conversation starter, not a grade. Fix the reds, schedule the yellows, re-run on a cadence.
Identical to July, and this time the basis is complete: all ten stations inspected, where July pro-rated 42/90 with Station 8 blind. Two scores moved in opposite directions and cancelled — Station 2 up on verified design craft, Station 8 down on verified adoption reality.

## Inspection sheet

|  # | Station                         | Quality      | Light |      Score |
|---:|:--------------------------------|:-------------|:-----:|-----------:|
|  1 | Coverage & gaps                 | Complete     |  🔴   |       3/10 |
|  2 | Best practices                  | Sound        |  🟡   |       7/10 |
|  3 | Accessibility                   | Sound        |  🟡   |       5/10 |
|  4 | Shared language                 | Sound        |  🟡   |       6/10 |
|  5 | Testing & validation            | Sound        |  🟡   |       5/10 |
|  6 | Orchestration                   | Synchronized |  🟡   |       5/10 |
|  7 | Governance & version control    | Extensible   |  🟡   |       4/10 |
|  8 | Feedback & adoption             | Extensible   |  🔴   |       3/10 |
|  9 | Machine-readable docs & context | AI-Ready     |  🟡   |       5/10 |
| 10 | Agent access                    | AI-Ready     |  🟡   |       4/10 |
|    | **Overall**                     |              |       | **47/100** |

**Lights:** 🟢 0 green · 🟡 8 yellow · 🔴 2 red · 0 not inspected

**Key:** 🔴 Red (0–3) — broken or missing; the light is ON · 🟡 Yellow (4–7) — drift or gaps; schedule a fix · 🟢 Green (8–10) — healthy, no action needed · **N/I** — not inspected (no evidence access; never guessed)

## Evidence basis

- Access used this pass: **live** throughout — Figma Console MCP (1ms probe, three files, direct node queries), both repos on disk, GitHub API for org-wide consumer scanning and manifest retrieval, Atlassian Rovo for tracker health, CI configs, token source.
- Findings tagged `[verified]`: 42 · `[reported]`: 1
- **Method disclosure:** this was not a blind re-inspection. The July report was recovered from the session transcript and read before evidence gathering. Since `git log` shows zero commits since 2026-07-24, blind re-derivation of the code stations would have been theatre — each prior finding was instead re-tested against the working tree and confirmed individually. Stations 1, 2 (design side), 8, 9, and 10 were derived from fresh evidence.
- **Jira analysis method:** the DSC query returned 247KB, past the readable limit. It was analyzed by `jq`/Node aggregation over the complete JSON file — counts, status/type/reporter distributions, and age percentiles across all 60 fetched issues. Individual ticket prose was not read. The aggregate covers the 60 oldest of 116 open issues.
- **Still unavailable:** Southleft's `design-systems-mcp` (registered, needs a restart), so Station 1's industry benchmark comes from my own knowledge rather than the knowledge server.

## Station records

### Station 1 — Coverage & gaps: RED (3/10)
- Inventory: **144 pages in the UI Kit** (106 🟢, 1 🟠, 5 🔴, 4 📕, 20 deprecated, 32 structural) · **108 public component sets** · **13 components in code** · 13 React wrappers · 9 Storybook MDX
- Evidence level: live (design, code, consumer repos); industry benchmark from own knowledge
- Findings:
  - `[verified]` **Coverage is unchanged since July.** 106 green pages against 13 coded components; the ratio moved by one page.
  - `[verified]` **The gap is already filled by other libraries — this is the finding that changes the priority.** 12 `form/*` pages exist in Figma and exactly one (`checkbox`) exists in code. Meanwhile `operator-portal-frontend` carries `@mui/material`, `@mui/x-date-pickers` and `react-hook-form`; `qualitrain-user-frontend` carries MUI 7 *and* Bootstrap 5.3.8 *and* `react-hook-form`; and 36 files across five repos contain raw `<input>`. Teams did not wait.
  - `[verified]` Staples still absent from code: text input, dropdown, textarea, radio, toggle, tabs, list/list-item, accordion, table, avatar, snackbar, progress-bar, stepper, breadcrumbs, empty-state, star-rating, date-picker, calendar, and all 5 filter components.
  - `[verified]` React wrapper parity is complete — all 13 web components have an `Eo*` wrapper. No gap on that axis.
  - `[verified]` Token system remains complete and tiered. Still a strength.
  - `[verified]` Only 4 pages carry 📕; 5 remain 🔴 (Labels & Filters, layout/grid, information-container, tables, tooltip).
- Not inspected: industry coverage benchmark via knowledge MCP (not loadable this pass).
- Deviations noted: many pages are product-specific compositions (20 `card/*`, 8 `genius/*`, BMA widgets) that need no generic code counterpart.
- First move: build `input-text`, `input-dropdown`, `textarea`, `radio-button`, `toggle` as one batch — but scope them to *beat MUI*, not merely to exist. The bar is no longer an empty slot.

### Station 2 — Best practices: YELLOW (7/10) — _was 6_
- Sampled: all 13 components re-verified in code; **9 Figma component sets inspected internally** (~7,000 layers) — the gap both prior inspections left open
- Evidence level: live (code, design)
- Findings:
  - `[verified]` **The point gained: Figma craft is excellent, and it was previously unmeasured.** Across `avatar`, `alert`, `snackbar`, `button`, `divider`, `dialog`, `checkbox`, `label`, and `tooltip-rich` — **zero generic layer names**. Not one `Frame 1`, `Rectangle 4`, or `Group 12` in roughly 7,000 layers. Most design systems cannot claim this.
  - `[verified]` **82% of solid fills are bound to variables** (3,053 bound / 659 hard-coded). Fully bound: `avatar` 198/198, `label` 208/208, `divider` (no fills), `checkbox` 114/115.
  - `[verified]` **The hard-coded fills are systematic, not scattered — which makes them cheap.** `button`: exactly 480 hard-coded fills across exactly 480 variants. `alert`: exactly 72 across 72. A ratio of precisely 1.0 means a single element in the base component carries an unbound fill and propagates. Two fixes, not 552. `tooltip-rich` (74 across 24 variants) and `dialog` (11 across 2) are the genuinely messy ones.
  - `[verified]` **`eo-link` is still broken on every axis July recorded.** Current tree: 0 occurrences of `<a `, 0 of `reflect`, `label`/`leadingIcon` as string props (`eo-link.ts:23,29`), icon rendered as text inside `<div class="eo-link-icon">` (line 38), `padding: 0.833px`, and the only component on plain `.css`.
  - `[verified]` `eo-button` remains the house exemplar; token discipline shows no regression.
- Why 7 and not 8: the design library's craft is green-tier, but a component that renders literal text where an icon belongs is shipping to eight repos. One broken public component caps this station.
- First move: rewrite `eo-link`; separately, chase the single unbound fill in `button` and `alert` — two edits that move 552 hard-coded values.

### Station 3 — Accessibility: YELLOW (5/10)
- Re-verified: the a11y gate, component semantics, test assertions
- Evidence level: live (code, CI)
- Findings:
  - `[verified]` **The safety net is still off.** `.storybook/preview.tsx:42` reads `test: 'todo'`, with the comment two lines above still documenting that `'error'` is what fails CI.
  - `[verified]` `eo-link` still fails WCAG 4.1.2 and 2.1.1 — no `<a>`, no `href`, no `role`, nothing focusable to delegate to. Now known to ship in 8 repos.
  - `[verified]` `eo-alert` still renders 0 `role=` attributes; alerts remain unannounced.
  - `[verified]` **Still zero a11y assertions** — 0 matches for `axe` or `toHaveNoViolations` across the packages tree.
  - `[verified]` Where a11y work was done it remains good: `eo-checkbox`, `eo-tooltip`, `eo-dialog`, the focus-ring/ripple primitives, the 44px touch-target token.
- Deviations noted: **dark mode is deliberate scaffolding** — excluded per GARAGE.md.
- First move: fix `eo-link`, then flip `a11y.test` to `'error'`. In that order.

### Station 4 — Shared language: YELLOW (6/10)
- Re-verified: full property sweep and event patterns
- Evidence level: live (code)
- Findings:
  - `[verified]` **Four names for the visual-style axis:** `hierarchy` (`eo-button:37`), `type` (`eo-alert:15`), `appearance` (`eo-tooltip:89`), `variant` (`eo-navigation-drawer-item:35`, `eo-navigation-rail-item:30`).
  - `[verified]` **Three close/dismiss patterns:** `eo-bottom-sheet` dispatches the shared `ComponentCloseEvent`; `eo-dialog` hand-rolls `new CustomEvent('close')`; `eo-tooltip` uses an `onDismiss` callback — React idiom in a web-component library.
  - `[verified]` `types/index.ts` still does not re-export `close-reason` or `events`, so `CloseReason` remains unimportable the documented way.
  - `[verified]` Label-as-prop persists in 5 components against `eo-button`'s slot.
  - `[verified]` The shared `types/` vocabulary and role-based token naming remain the station's strength.
- First move: pick one name for the visual-style axis and one close pattern, write both into an API conventions doc, apply to new components only — renaming existing props needs versioning the system cannot express (Station 7).

### Station 5 — Testing & validation: YELLOW (5/10)
- Re-verified: the config typos, on disk, this pass
- Evidence level: live (code, CI)
- Findings:
  - `[verified]` **Both `vitest.config.ts` typos are still there, and the correctly-named targets exist.** The config references `'vitest.config.storybook/ts'` (MISSING) while `vitest.config.storybook.ts` EXISTS; and `'packages/eguym-one-design-system-web/vitest.config.ts'` (MISSING — `eguym`) while `packages/egym-one-design-system-web/vitest.config.ts` EXISTS. `npm run storybook:test` still resolves zero projects and passes silently. Every Storybook test, including all a11y checks, has still never run.
  - `[verified]` Tests still assert structure over behavior; no keyboard-interaction assertions anywhere.
  - `[verified]` CI itself remains genuinely good — build → check → analysis → publish, SonarQube, coverage artifacts, per-branch Storybook deploys.
- First move: fix the two typos. Cheapest high-value change in the work order, now surviving three inspections.

### Station 6 — Orchestration: YELLOW (5/10)
- Re-verified: token pipeline, docs accuracy, design↔code bridge
- Evidence level: live (design, code, docs)
- Findings:
  - `[verified]` The token pipeline remains the system's best connective tissue — single source, submodule, Style Dictionary, `submodules: recursive` in CI, no hand-maintained copies.
  - `[verified]` **The phantom CSS variables are still phantom.** `--eo-color-primary` and `--eo-spacing-base`: **0 occurrences** across the token system, all packages, and docs — while `QUICK_START.md` still instructs consumers to override them.
  - `[verified]` The README's broken import is still present (`README.md:18`).
  - `[verified]` Still zero Code Connect files across both repos.
  - `[verified]` The traffic-light convention still tracks design readiness only; `navigaton / navigation-rail` still carries the typo.
- First move: fix `README.md` and `QUICK_START.md` against the real API.

### Station 7 — Governance & version control: YELLOW (4/10)
- Inspected: versioning, tags, governance artifacts, **and the DSC tracker — the gap both prior passes left open**
- Evidence level: live (repo, CI, Jira via Rovo)
- Findings:
  - `[verified]` **Versioning still cannot express a breaking change.** `publish.yaml` sets every package to `0.1.${{ github.run_number }}` (lines 56, 59, 62, 68, 72).
  - `[verified]` **Still zero git tags.** No release is pinned to a commit.
  - `[verified]` Still no `CONTRIBUTING.md`, no PR template, no `ISSUE_TEMPLATE/` — all confirmed missing this pass.
  - `[verified]` **Tracker health, measured for the first time: 116 open issues, and the backlog is not being triaged.** Of the 60 oldest, 46 sit in status "Neu" and 48 have gone untouched for more than 180 days. Median staleness is 293 days.
  - `[verified]` **The legacy system looks more trustworthy than yours by version number alone.** Consumers pin `@egym-private/react-design-system` at `18.2.75`–`18.2.91` — a mature semver line still shipping releases — while EGYM One offers `0.1.x` build counters. A product engineer choosing between them reads that difference immediately.
  - `[verified]` The downstream cost is measurable: consumers spread across `0.0.23`, `0.1.5`, `0.1.15`, `0.1.20`, `0.1.22`, `0.1.23`. `mwa-bma-features` on `^0.0.23` is frozen — npm resolves `^0.0.x` to that exact patch.
  - `[verified]` `CODEOWNERS` and dependabot remain configured; Supernova's design-side governance remains better than code-side.
- Not inspected: branch protection settings.
- First move: real semver via changesets or semantic-release. Until a breaking change can be named, no other governance artifact does much work — and the version number is currently an argument *against* adopting your system.

### Station 8 — Feedback & adoption: RED (3/10) — _was N/I in July; scored 4 earlier in this same pass and revised down_
- Measured: org-wide GitHub code search across `egym`; dependency manifests from 8 consumer repos; raw-`<input>` scan across 5; DSC tracker aggregate over 60 issues
- Evidence level: live (GitHub API, Jira via Rovo)
- **Score revision, stated plainly:** earlier in this inspection I scored this station 4/10 on the reasoning that eight consuming repos is good breadth for a 2.4-FTE team. Two further scans overturned that. Adoption is additive rather than substitutive, and the feedback channel is effectively dead. Against this station's own anchors — *"No idea who uses what. No live feedback path. System team detached from product reality"* — the honest score is red.
- Findings:
  - `[verified]` **Adoption is real but additive: 8 consumer repos** — `operator-portal-frontend` (39 hits), `qualitrain-user-frontend` (14), `class-booking-mwa` (11), `gymfinder-frontend` (9), `membership-management-mwa` (5), `egym-ai-toolkit` (2), `wellpass-checkin-mwa` (1), `mwa-bma-features` (1).
  - `[verified]` **Five of eight still ship the legacy design systems alongside EGYM One:** `qualitrain-user-frontend` (`react-design-system@18.2.91` + `wc-design-system@0.0.91`), `class-booking-mwa` (`18.2.80` + `0.0.80` + `wc-egym-icons@0.0.80`), `gymfinder-frontend` (`18.2.75` + `0.0.75`), `membership-management-mwa` (`18.2.89` + `0.0.89` + `wc-egym-icons`), `wellpass-checkin-mwa` (`18.2.76` + `0.0.76`). Nothing has been retired.
  - `[verified]` **Four also carry MUI, and one carries Bootstrap.** `operator-portal-frontend` — the heaviest EGYM One user — runs `@mui/material@^6.4.1`, `@mui/icons-material`, `@mui/system`, `@mui/x-date-pickers`, `mui-tiptap`, emotion and `react-hook-form`. `qualitrain-user-frontend` runs MUI 7, Bootstrap 5.3.8, and `react-hook-form` **on top of** EGYM One and both legacy systems — four UI libraries in one application.
  - `[verified]` **36 files across 5 repos contain raw `<input>`:** `qualitrain-user-frontend` 17, `operator-portal-frontend` 14, `gymfinder-frontend` 2, `membership-management-mwa` 2, `class-booking-mwa` 1. The form-control gap is being papered over in product code.
  - `[verified]` **The feedback channel exists and is empty. 58 of the 60 oldest open DSC issues were filed by Felix** — one each from Pedro Rosa and Sebastian Proll. Eight consuming teams have contributed two tickets between them. Per this station's own rule, an empty channel is not success; it means people stopped bothering.
  - `[verified]` **The backlog is not triaged:** 46 of 60 in status "Neu"; 48 untouched >180 days; median staleness 293 days. 116 open in total.
  - `[verified]` **`mwa-bma-features` is frozen** on `^0.0.23` and cannot receive updates through its declared range.
  - `[verified]` **Correction (added after reviewing the team's AI-Readiness Plan): design-side telemetry exists and is good.** The plan's tasks cite Figma library analytics throughout — `label` at 22% detach / 2,544 uses per year, `button` at 49k uses with 1,608 detaches, `filter-tag` at 9,499 uses, `focus-outline` at 2,912 inserts. That is better instrumentation than most teams have. **Code-side telemetry does not exist** — every consumer figure above was reverse-engineered during this inspection.
  - `[verified]` **That asymmetry is itself a prioritization risk.** Because only design-side data exists, the Build Plan waves are sequenced on Figma insert counts — what designers *place* — rather than on what engineers *ship*. `filter-tag` is prioritized on 9,499 Figma uses, while the fact that four consumer repos build forms with `@mui/material` + `react-hook-form` is invisible to the plan.
- Not inspected: Figma library analytics and detach rates; support-channel history (Slack/Teams) — the one remaining feedback surface not reached.
- Deviations noted: none.
- First move: this station's own advice — *"a dependency-version scan across consumer repos this week beats an analytics platform next year."* That scan now exists in this report. Turn it into a standing job, then take its findings **to** the five teams running three design systems, because they are demonstrably not coming to you.

### Station 9 — Machine-readable docs & context: YELLOW (5/10) — _was 4_
- Inventoried: DTCG token JSON · TypeScript types · Figma component descriptions · Storybook MDX · Style Dictionary output. **Generation test: run — failed.**
- Evidence level: live (repo, tokens, Figma)
- Findings:
  - `[verified]` **Generation test, documented-path trace: an agent asked to build a settings form from the docs alone cannot succeed.** Traced step by step: (a) `README.md:18` gives `import { Button, Card } from '@egym-private/egym-one-design-system-web'` — the `exports` map has no `"."` entry and the class is `EoButton`, so it does not resolve; (b) `QUICK_START.md` names only **7 of the 13** components that exist — `eo-alert`, `eo-button-stack`, `eo-card`, `eo-checkbox`, `eo-dialog`, and `eo-tooltip` are invisible to a doc-reading agent, so it will hand-roll a checkbox that already exists; (c) a settings form needs a text input, a dropdown, and a toggle, none of which exist in code and none of which the docs mark as missing — so the agent invents `<eo-input>`, `<eo-select>`, `<eo-toggle>`; (d) styling it from `QUICK_START.md` means `--eo-color-primary` and `--eo-spacing-base`, both with **0 occurrences** anywhere. Four independent failures on one small composition.
  - `[verified]` **The generation failure and the real consumer behavior are the same failure.** An agent following the docs invents form controls; the eight real teams reached for MUI and raw `<input>`. The context gap and the coverage gap produce identical outcomes.
  - `[verified]` **The point gained: Figma component metadata is 58% rolled out.** 63 of 108 public component sets carry descriptions averaging 1,167 characters, documenting variant axes explicitly. July recorded structured metadata as existing for icons "and nothing else." 45 public sets remain bare, including `dialog`, `label`, `tooltip-rich`, `accordion`, `calendar`, `input-dropdown`, `input-password`, `textarea`, `navigation-item`, `coachmark`, `stepper-progress`.
  - `[verified]` **Tokens remain the strongest machine-readable asset.** 3,275 `$value` entries against 2 legacy `value` keys — fully DTCG-conformant — with 2,263 `$description` fields and `com.figma.codeSyntax` mapping to `--eo-*`.
  - `[verified]` **The code side has not moved.** 10 JSDoc blocks across 50 `.ts` files, all but one in `internal/ripple/`. No `custom-elements.json`, no analyzer, zero `@slot`/`@csspart`/`@fires`/`@cssprop`.
  - `[verified]` Union types remain semantically opaque: `Content = 'label-icon' | 'icon' | 'text' | 'text-action' | 'text-long-action'` with no comment.
  - `[verified]` Tokens ship compiled-only — one registered format, `scss/custom-props` (`config.ts:59`). The 2,263 descriptions never reach consumers.
  - `[verified]` Still no `llms.txt`, `CLAUDE.md`, `AGENTS.md`, or `.cursorrules` in either repo.
  - `[verified]` `eo-tooltip.ts` remains the in-house code exemplar — purpose, enforced anti-pattern, `@example`.
  - `[reported]` **Dating the Figma metadata gain remains unresolved.** Either it was authored in the last three days, or July's extraction (which timed out at 300s on this file) never reached component-set descriptions. Figma version history was not queried; one sentence from the team settles it.
- Why still 5 and not lower despite the failed test: the raw materials genuinely are machine-first, and the Figma layer is past halfway. The failure is concentrated in two documents and one absent annotation layer — all cheap to fix.
- First move: fix `README.md` and `QUICK_START.md`, then port the `eo-tooltip` docblock pattern to the other 12 components.

### Station 10 — Agent access: YELLOW (4/10)
- Surfaces mapped: Figma Console MCP · official Figma MCP · Supernova MCP · Atlassian Rovo · Southleft `design-systems-mcp` (registered, pending restart) · 17 EGYM skills · Storybook on GCS. **Live test: not run from a consumer environment.**
- Evidence level: live (MCP probes, skills directory, CI, consumer repos)
- Findings:
  - `[verified]` **Your consumers are more AI-ready than your design system.** `class-booking-mwa` and `qualitrain-user-frontend` both ship an `AGENTS.md` at repo root; `class-booking-mwa`'s names the design system packages under a "Design systems" heading. Neither DS repo has any agent rules file. The teams consuming the system told their agents it exists; the system did not.
  - `[verified]` Design-tool access is excellent — 1ms probe across three connected Figma files; 288 component sets and ~7,000 layers queried live during this inspection.
  - `[verified]` **Atlassian Rovo is usable, with caveats — the July "times out" finding is largely resolved.** It answered the DSC backlog query that produced Station 7's tracker numbers, and reads and writes against existing issues succeeded repeatedly (`getJiraIssue`, `editJiraIssue` on DSC-214 and DSC-216). Two call types did time out at 300s in this session: `createJiraIssue`, and `searchJiraIssuesUsingJql` with a date filter. Separately, **`editJiraIssue` against a non-existent issue key hangs for 300s instead of erroring**, while `getJiraIssue` on the same key returns a clean "does not exist" immediately — so a hanging write is more likely a bad key than a dead service. Verify the key with a read before writing.
  - `[verified]` **17 EGYM skills still live only in `~/.claude/skills/`** — the `onelint` suite, the `onespec` suite, and the `egym-*` QA skills including a 7-check pipeline with regression gates. User-scoped, one machine, invisible to all eight consumer repos. Bus-factor-1 on the strongest tooling asset here.
  - `[verified]` Still no Code Connect and no DS-specific queryable surface.
  - `[verified]` Still zero discoverability — nothing in either repo's docs mentions any MCP, skill, or AI workflow.
  - `[verified]` Storybook still builds and publishes to GCS via `.github/workflows/upload.yaml`.
- Not inspected: output quality from a consumer team's environment — the test that would move this station.
- First move: commit a `CLAUDE.md` to the DS repo and move the consumer-facing skills into a committed `.claude/skills/`. Your consumers have already shown you the pattern.

## What changed since last inspection

| # | Station | Jul 31 | Aug 3 | Δ |
|---:|:---|:---:|:---:|:---:|
| 1 | Coverage & gaps | 🔴 3 | 🔴 3 | — |
| 2 | Best practices | 🟡 6 | 🟡 7 | **+1** |
| 3 | Accessibility | 🟡 5 | 🟡 5 | — |
| 4 | Shared language | 🟡 6 | 🟡 6 | — |
| 5 | Testing & validation | 🟡 5 | 🟡 5 | — |
| 6 | Orchestration | 🟡 5 | 🟡 5 | — |
| 7 | Governance | 🟡 4 | 🟡 4 | — |
| 8 | Feedback & adoption | N/I | 🔴 3 | **newly measured** |
| 9 | Machine-readable docs | 🟡 4 | 🟡 5 | **+1** |
| 10 | Agent access | 🟡 4 | 🟡 4 | — |
| | **Overall** | **47/100\*** | **47/100** | — |

\* July was 42/90 pro-rated. August is a true /100 across all ten stations.

**Lights turned off:** none. **New lights:** Station 8 (previously unmeasured, now red). **July work-order items completed:** none — consistent with zero commits.

**What actually moved:**
1. **Station 8 stopped being a blind spot, and the answer is worse than assumed.** The July work order's first move for this station — a dependency scan across consumer repos — was executed. It found that adoption is additive rather than substitutive, that five of eight consumers still run the legacy systems, that four run MUI, that 36 files hand-roll `<input>`, and that the ticket queue is 97% self-reported.
2. **Station 2 gained a point** on Figma craft that both prior inspections left unmeasured: zero generic layer names across ~7,000 layers and 82% variable binding.
3. **Station 9 gained a point** on Figma metadata coverage, and its generation test now has a definitive result: four independent failures on one small composition.
4. **Two access gaps closed:** Rovo now answers, and the consumer-repo scan is repeatable.
5. The inspection artifacts were recovered from the 2026-07-31 session transcript and this workspace is now a git repo, so the next inspection will have a real history to diff against.

**The honest read:** the score did not move because the code did not move. What moved is the diagnosis. Three days ago this looked like a young system with a component backlog. It is actually a system competing for space in applications that already have two or three others, with no telemetry to see it happening and a feedback channel nobody uses. That is a positioning problem before it is an engineering one, and the work order is re-ordered accordingly.

## Next service

- Work order: `ds-inspection/work-orders/2026-08-03-work-order.md`
- Recommended cadence: re-inspect **on change, not on calendar**, until the reds move. A quarterly deep pass resumes once items 1–4 have shipped.
- Everyday checks to wire into CI now: `vitest.config.ts` path validity (S5), documented-import validation against the `exports` map (S6/S9), token-description presence (S9), and the consumer version-and-legacy-dependency scan (S8).
- Re-inspect by: **2026-10-31**, or sooner once the first work-order batch ships.
