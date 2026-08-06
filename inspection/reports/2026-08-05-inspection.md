# Design System Multi-Point Inspection — EGYM One

_Full re-inspection · 2026-08-05 · all 10 stations · Mode 3 (re-inspection)_
_Prior: 2026-07-31 (47/100\*) · 2026-08-03 (47/100)_

---

## Overall: **51/100** as shipped · **57/100** achievable by promoting work that already exists

_A conversation starter, not a grade. Fix the reds, schedule the yellows, re-run on change._

**The score is split, deliberately.** `egym-playground/egym-one-design-system` is an **experimental repo, not in main**. It is not published, not linked, and no consumer can reach it. Scoring it as part of the system would flatter the number and hide the actual finding — so it sits in its own column. The left column is what your consumers can use today. The right column is what the same evidence becomes if that work is promoted.

**Read the +4 correctly.** Between Aug 3 and today the system gained two components and merged a five-month-old PR. It did not gain four points of health. Every point of the shipped delta comes from **evidence surfaces that existed all along and had never been inspected** — two Slack CoP channels, the GitHub API, and the Notion design-system space. One point was lost on a finding that got worse under closer reading.

The August 3 report scored a system it could only see half of. This one saw the other half, and the other half is in better shape than the first.

| # | Station | Jul 31 | Aug 3 | **Aug 5 shipped** | Δ | _+ experimental_ | Why it moved |
|---:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | Coverage & gaps | 🔴 3 | 🔴 3 | 🔴 **3** | — | 3 | +2 components; the staple gap is unchanged |
| 2 | Best practices | 🟡 6 | 🟡 7 | 🟡 **7** | — | 7 | new work follows the pattern; `eo-link` still doesn't |
| 3 | Accessibility | 🟡 5 | 🟡 5 | 🟡 **5** | — | 5 | real a11y engineering; the gate is still off |
| 4 | Shared language | 🟡 6 | 🟡 6 | 🟡 **7** | **+1** | 7 | a Properties Glossary exists in Notion — never inspected |
| 5 | Testing & validation | 🟡 5 | 🟡 5 | 🟡 **4** | **−1** | 4 | branch protection requires **zero** status checks |
| 6 | Orchestration | 🟡 5 | 🟡 5 | 🟡 **5** | — | _6_ | docs still broken; the drift detector isn't in main |
| 7 | Governance | 🟡 4 | 🟡 4 | 🟡 **6** | **+2** | 6 | documented governance found in Notion; correction |
| 8 | Feedback & adoption | N/I | 🔴 3 | 🟡 **5** | **+2** | 5 | the feedback loop is alive — it just isn't Jira |
| 9 | Machine-readable docs | 🟡 4 | 🟡 5 | 🟡 **5** | — | _8_ | JSDoc 1→3 files; everything else is in the playground |
| 10 | Agent access | 🟡 4 | 🟡 4 | 🟡 **4** | — | _6_ | skills still user-level; no `CLAUDE.md` in either repo |
| | **Overall** | **47\*** | **47** | **51** | **+4** | **_57_** | |

\* July was 42/90 pro-rated.

**The six-point gap is the headline finding.** Stations 6, 9 and 10 are held down almost entirely by the fact that finished, verified, working AI-readiness infrastructure sits in a playground org nobody has been told about. Promoting it is not a build — it is a move. It is the largest single score movement available to this team and it costs less than a day.

---

## The four things that matter most

**1. Your governance is better than you think, and invisible from where the work happens.**
Notion holds a specific, well-written Release Process (two tracks, comms checklist, Thursday cadence for breaking changes), a rigorous 7-phase contribution checklist with a mandatory Phase 0 gate, a Decision Log, and a 34-entry Properties Glossary. The design side genuinely follows it — I matched release posts to the template across v0.0.14→v0.0.25, including a six-week deprecation grace period. **Neither code repo links to any of it.** Four different people have asked in Slack for processes that were already written down.

**2. A contributor wrote your CONTRIBUTING guide 196 days ago and nobody reviewed it.**
PR #84, opened 2026-01-20 by Richard Ricciardelli, still open, still draft, untouched since Jan 22. Two consecutive work orders flagged "no CONTRIBUTING guide" as a finding while the fix sat in your own queue. This is the cheapest, highest-signal item in this report.

**3. The feedback channel was never empty — you were reading the wrong channel.**
The August 3 red was built on "58 of the 60 oldest DSC tickets were filed by Felix." True, and misleading. Nine external product-team engineers have merged 19 PRs; designers file component defects in `#community-design-system` weekly; there's a CoP with a topic funnel, Office Hours with bookable slots, and a usability survey. **Jira is the dead channel, not the community.** What's genuinely missing is code-side telemetry and any mechanism turning that informal stream into backlog.

**4. Six points of finished work are parked in a playground org.**
`egym-playground/egym-one-design-system` — built by Pedro Rosa over three days in late July — holds a validated 3,061-token `design.md`, 127 `component.{md,json}` pairs against a published JSON Schema, a working design↔token drift detector, and an Agent Skill wired for both Claude Code and Copilot. I ran its validators: both pass, offline, in under a second. It is experimental and not in main, so it scores nothing today. Promoting it is a move, not a build.

---

## Station records

### Station 1 — Coverage & gaps: 🔴 RED (3/10)

- **Inspected:** `packages/egym-one-design-system-web/src/components/` on `main` @ `305919d`; `components/index.md` from the playground extraction; consumer raw-`<input>` scan (carried from Aug 3).
- **Evidence level:** live (repo, extracted Figma inventory)
- Findings:
  - `[verified]` **Code now ships 15 components**, up from 13 — `eo-radio-button` and `eo-radio-group` landed 2026-08-03 when PR #100 finally merged. `eo-alert`, `eo-bottom-sheet`, `eo-button`, `eo-button-stack`, `eo-card`, `eo-checkbox`, `eo-dialog`, `eo-divider`, `eo-label`, `eo-link`, `eo-loading-skeleton`, `eo-navigation`, `eo-radio-button`, `eo-radio-group`, `eo-tooltip`.
  - `[verified]` **The Figma/code gap is now precisely quantified for the first time.** The UI Kit holds **387 components → 127 in scope** (239 internal `_bricks`, 21 deprecated). Code covers **15 of 127 — 12%**.
  - `[verified]` **The form-control hole is unchanged where it hurts.** `eo-checkbox` and `eo-radio-button` exist; **`input-text`, `input-dropdown`, `textarea`, `toggle` do not** — all four have Figma folders with full property contracts, none has code.
  - `[verified]` 36 files across 5 consumer repos hand-roll `<input>` (Aug 3 scan): qualitrain 17, operator-portal 14, gymfinder 2, membership-management 2, class-booking 1.
  - `[verified]` Distribution, token tiering and a design counterpart all exist and are healthy — this is not a missing-leg problem, it is a volume problem concentrated on the single most-used control in any system.
- **Not inspected:** whether the 21 Figma-deprecated components have consumers.
- **Why it stays red:** the yellow anchor requires "core set mostly present." A system whose consumers write 36 raw `<input>` elements does not have its core set present. The +2 is real movement, not a category change.
- **First move:** unchanged — build the form set, scoped to displace MUI rather than fill a slot. The Figma API contract for all four missing controls already exists in `components/*/component.json`; you can specify them without opening Figma.

### Station 2 — Best practices: 🟡 YELLOW (7/10)

- **Inspected:** all 15 components on disk — stylesheet extensions, `reflect: true` counts, `<a>` usage. Figma craft metrics carried forward from the 2026-08-03 live pass.
- **Evidence level:** live (code); carried (Figma, dated Aug 3)
- Findings:
  - `[verified]` **`eo-link` is the sole structural outlier, and the numbers are stark.** Of 35 component stylesheets, **34 are `.scss` and exactly one is `.css` — `eo-link.css`.** Of 15 components, 14 use `reflect: true` (2–7 times each); **`eo-link` uses it zero times.** `<a>` appears **0 times** in `eo-link.ts`. One component, three deviations, all in the same file.
  - `[verified]` **New work follows the house pattern.** `eo-radio-button` (6 reflects) and `eo-radio-group` (2) landed with the conventions intact and with JSDoc — the first component docblocks written outside `internal/ripple/` and `eo-tooltip`.
  - `[verified]` (carried, Aug 3) Figma layer hygiene remains exceptional — **zero generic layer names across ~7,000 sampled layers**; 82% variable binding; 552 hard-coded fills concentrated as 480-in-`button` and 72-in-`alert`, a 1.0 ratio to variant count meaning one unbound element in each base component.
  - `[verified]` Conventions exist but nothing enforces them — no lint rule catches a `.css` file or a missing `reflect`.
- **Not inspected:** a fresh Figma craft pass (last measured Aug 3).
- **First move:** rewrite `eo-link` against the `eo-button` pattern. It is one file and it is shipping to 8 repos.

### Station 3 — Accessibility: 🟡 YELLOW (5/10)

- **Inspected:** `.storybook/preview.tsx`, repo-wide axe/violation assertions, `eo-link` semantics; both Slack channels for a11y traffic.
- **Evidence level:** live (code, Slack)
- Findings:
  - `[verified]` **The a11y gate is still off.** `.storybook/preview.tsx:42` is `test: 'todo'`, with `'error' - fail CI on a11y violations` sitting commented on the line above. Third inspection, unchanged.
  - `[verified]` **Zero `axe` / `toHaveNoViolations` assertions** anywhere in `packages/` or `stories/`.
  - `[verified]` **`eo-link` still fails WCAG 4.1.2 and 2.1.1** — no `<a>`, no `href`, not keyboard-reachable, does not announce as a link.
  - `[verified]` **Real accessibility engineering is happening, in the open.** Florian established `delegatesFocus` as the house pattern for focusable web components with a written rationale and links (2026-07-20); the tooltip PR (#155) enforced focusable anchors; Eric raised checkbox focusability; PR **#166 adds a focus-ring visibility test for keyboard navigation** and is **APPROVED** — the first behavioural a11y test in the repo.
  - `[verified]` **A reported contrast failure is sitting unanswered.** Patrick Kettner, 2026-07-31, `#community-design-system`: *"brand color on dark doesn't meet AA contrast requirements (free & secondary buttons)."* No reply in channel, no ticket found.
  - `[verified]` The a11y checklist in the Notion component contribution guide is strong — WCAG 2.2 AA, ARIA APG, keyboard, contrast ratios, 44×44 targets, reduced motion, screen-reader testing. It is a gate on new components, not a test on existing ones.
- **Deviations noted:** dark-mode contrast in the token system is deliberate scaffolding and is **not** counted as a failure (per GARAGE.md). Patrick's report is about shipped brand-on-dark button styles, which is a different thing.
- **First move:** merge PR #166, then flip the gate to `'error'` — after `eo-link` and the vitest paths are fixed, or it fails the build immediately.

### Station 4 — Shared language: 🟡 YELLOW (7/10) — _was 6_

- **Inspected:** Notion Properties Glossary (34 entries) cross-referenced against 161 real Figma property names extracted from 127 `component.json` files.
- **Evidence level:** live (Notion, extracted Figma API)
- Findings:
  - `[verified]` **A documented naming scheme exists and is good — the prior passes never saw it.** The Properties Glossary carries 34 system-wide properties with data type, supported values, default, description, and "used in components." `intent`, `hierarchy`, `state`, `onSurface`, `placement`, `size`, `width`, `direction`, `justify` are all defined with real semantics — `placement` even documents the 12-position Floating UI model and names it.
  - `[verified]` **The same property has three spellings across three artifacts.** Glossary `has leadingIcon` · Figma `has leading-icon` · `component.json` canonical `hasLeadingIcon`. This holds for **14 of the glossary's 34 entries** (`has headerContent`/`hasHeaderContent`, `is open`/`isOpen`, `is selected`/`isSelected`, `is user filled`/`isUserFilled`, and 10 more).
  - `[verified]` **8 glossary entries match no Figma property at all** — `icon`, `leadingIcon`, `trailingIcon`, `headerContent`, `bodyContent`, `footerContent`, `number of items`, `justify`.
  - `[verified]` **The glossary is design-scoped by its own admission.** Of 34 entries, **33 have `Scope: ["Design"]`**; exactly one (`has footerContent`) is marked `["Design","Code"]`. It is a Figma-property glossary presented as a system-wide one.
  - `[verified]` **The canonical mapping now exists and nothing uses it.** `component.json` stores both `name` (camelCase, code-facing) and `figmaName` (raw) per property — e.g. `{"name": "hasLeadingIcon", "figmaName": "has leading-icon"}`. That is precisely the lookup table a validator would need.
  - `[verified]` `navigaton / navigation-rail` typo persists in Figma (carried, Aug 3).
- **First move:** reconcile the glossary against the extracted `figmaName`/`name` pairs — this is a diff you can now generate, not a manual audit.

### Station 5 — Testing & validation: 🟡 YELLOW (4/10) — _was 5, revised down_

- **Inspected:** `vitest.config.ts` and its referenced paths, a11y assertions, branch protection API, story/MDX counts.
- **Evidence level:** live (code, CI, GitHub API)
- **Why it dropped:** not new decay — a new fact. Branch protection turns out not to require any status check, which means the shallow-coverage problem is worse than "tests are thin": nothing tests-related blocks a merge at all.
- Findings:
  - `[verified]` **Both `vitest.config.ts` typos survive a fourth inspection.** The config lists `'vitest.config.storybook/ts'` (missing — `vitest.config.storybook.ts` **exists**) and `'packages/eguym-one-design-system-web/vitest.config.ts'` (missing — `egym` **exists**). `npm run storybook:test` resolves zero projects and passes silently. Every Storybook test, including every a11y check, has still never run.
  - `[verified]` **Branch protection requires zero status checks.** `required_status_checks` has `strict: true` with **`contexts: []` and `checks: []`**. A PR with a red build satisfies protection today.
  - `[verified]` Zero a11y assertions repo-wide; PR #166 (approved, unmerged) would be the first behavioural test.
  - `[verified]` 13 MDX docs and 14 story folders against 15 components — coverage slipped by one when radio-group landed.
  - `[verified]` CI itself remains genuinely good — build → check → analysis → publish, SonarQube, coverage artifacts, per-branch Storybook deploys to GCS. The pipeline is not the problem; nothing is wired to gate on it.
  - `[verified]` No visual regression testing; no evals for AI-assisted work.
  - `[verified]` **A validation capability exists and is not wired in** — the playground's `validate_component_md.py` and `validate_design_md.py` run offline in under a second and both exit 0. Its own README names a CI guardrail as the next step; no workflow was ever added.
- **First move:** two characters, then two settings. `/ts`→`.ts`, `eguym`→`egym`; then put the build check into `required_status_checks`.

### Station 6 — Orchestration: 🟡 YELLOW (5/10 shipped · 6/10 with the experimental repo promoted)

- **Inspected:** README/QUICK_START against the real API; Code Connect presence; token pipeline; the playground extraction as a bridge.
- **Evidence level:** live (code, docs, playground)
- Findings:
  - `[verified]` **Both documentation defects are still on disk.** `README.md:18` teaches `import { Button, Card } from '@egym-private/egym-one-design-system-web'` — a barrel import that does not resolve against the package's `exports` map. `docs/QUICK_START.md:225–226` still instructs consumers to override `--eo-color-primary` and `--eo-spacing-base`, which have **1 occurrence each in the entire repo — those two lines.**
  - `[verified]` **Still zero Code Connect files** across both DS repos.
  - `[verified]` _(experimental repo — not in main, scores nothing today)_ **Something automated now notices drift — it just isn't running anywhere.** `validate_component_md.py` cross-references every CSS variable the UI Kit cites against the token source and found **10 dangling references**, including `component/radio-button/dimension/size/selection-marker` and `component/avatar/notification-badge/color/border`. Roughly three are artifacts of the deliberate `v0.0.24` submodule pin; the rest are real.
  - `[verified]` _(experimental repo — not in main)_ **A partial design→code join now exists.** `component.json` carries `tag`, `react`, and `imports` per component; **12 of 127** have a real package path (`@egym-private/egym-one-design-system-web/<name>` — checkbox, filter-button, filter-select, filter-tag, form-search-filter, header-app, loading-spinner, radio-button, segmented-control, tooltip-plain, tooltip-map, cluster). Not Code Connect, but a real join with a generalisable mechanism.
  - `[verified]` The token pipeline remains the system's best connective tissue — single source, submodule, Style Dictionary, `submodules: recursive` in CI, no hand-maintained copies.
- **First move:** fix `README.md` and `QUICK_START.md` against the real API — 20 minutes, and they are currently teaching agents to write broken code.

### Station 7 — Governance & version control: 🟡 YELLOW (6/10) — _was 4_

Full record in `reports/2026-08-05-station-07-reinspection.md`. Summary:

- `[verified]` Substantial documented design-side governance exists and is largely practised — two-track release process, migration guides with grace periods, Decision Log, Phase 0 contribution gate, CoP + Office Hours rituals, template-conforming release comms, well-handled Mar 6 library incident.
- `[verified]` Branch protection properly configured (PR + 1 review + code-owner + signed commits + `enforce_admins`) — **but zero required status checks.**
- `[verified]` **PR #84 "add contributing guidelines" — open as a draft for 196 days**, untouched since 2026-01-22.
- `[verified]` Zero git tags, zero releases; `publish.yaml` stamps `0.1.${{ github.run_number }}`. The token repo, by contrast, carries 7 tags and 7 releases.
- `[verified]` 13 open human PRs, median age **98 days**; 18 dependabot PRs, median **135 days**, oldest **288**.
- `[verified]` Median merge is 2 days, but the tail falls on community contributors — PR #100 took **151 days and five reminders** while blocking a Business-Suite ticket.
- `[verified]` Documented semver never practised on either side; the UI Kit changelog stalled at 0.0.20 (2026-05-08) with a malformed `[0.0.0]` entry on top.
- `[verified]` Decision Log: 13 of 14 entries bulk-created on one day, one added since; **zero engineering decisions logged** while at least five architectural ones were made in Slack.
- `[verified]` Process bypassed under pressure (self-merge, 2026-04-08) and routed around by a team building a local copy in Business-Suite (2026-06-19).
- **First move:** review and merge PR #84 this week.

### Station 8 — Feedback & adoption: 🟡 YELLOW (5/10) — _was 🔴 3_

- **Inspected:** both Slack CoP channels in full; GitHub contributor analysis; Notion CoP/Office Hours/survey artifacts. Consumer dependency data carried from Aug 3.
- **Evidence level:** live (Slack, GitHub, Notion); carried (consumer manifests)
- **Score revision, stated plainly:** the Aug 3 red rested on one measurement — Jira ticket authorship — and the report itself listed "support-channel history" as the one feedback surface not reached. Reaching it overturns the central claim. Against this station's red anchor — *"No idea who uses what. No live feedback path. System team detached from product reality"* — every clause is now false. The adoption findings, however, all stand.
- Findings:
  - `[verified]` **The feedback loop is alive and weekly.** A Design System CoP with a Notion topic-submission funnel and a recurring Slackbot reminder; **Office Hours with bookable slots**; a **System Usability Survey** run Feb–Mar 2026 (chased publicly — *"we currently only have 6 responses"*); a decision to move all DS meetings onto a shared calendar.
  - `[verified]` **Designers file component defects in-channel, continuously.** Patrick Kettner alone reported dialog token bindings (headline untokenised, body on a Wellpass token), tooltip/coachmark tip inconsistency, brand-on-dark contrast, a tabs underline bug, and a dropdown disabled-state question — across five separate posts. Aditya, Riccardo, Hannah, Sandra, Marco, Laura and Chiara all filed similar.
  - `[verified]` **Nine external product-team engineers have merged 19 PRs** — Alex Wu Fan, Khadija Fathi, Eric Luong, Florian Ainadou, Berker Bugur, Mohamed Abdellaoui, Samrat Dutta, Rim Misra, Khaled Saidi.
  - `[verified]` **What's missing is not the channel — it's the conversion.** Almost none of that feedback becomes a tracked item. The DSC backlog is 116 open, 46 of the 60 oldest untriaged, median staleness 293 days, 58 of 60 self-filed. Patrick's contrast report has no ticket. The loop is: feedback arrives → scrolls away.
  - `[verified]` **Adoption is additive, not substitutive — unchanged and still the core problem.** 8 consumer repos; **5 of 8 still ship `react-design-system@18.2.x` + `wc-design-system@0.0.x`**; 4 also ship MUI; `qualitrain-user-frontend` runs four UI libraries at once. Nothing has been retired.
  - `[verified]` **A team stated the drift out loud.** Alex Wu Fan, 2026-06-19: *"we decided that we will not use it for the moment… will just try to make similar component in Business-Suite, and when the design system's one is released, we will switch to it."*
  - `[verified]` **Design-side telemetry is good; code-side telemetry does not exist.** Figma library analytics are cited throughout the team's AI-Readiness plan (`label` 22% detach / 2,544 uses; `button` 49k uses / 1,608 detaches; `filter-tag` 9,499 uses). Every code-side adoption figure in this report was reverse-engineered during an inspection.
  - `[verified]` **That asymmetry is a live prioritisation risk.** Build-plan waves are sequenced on Figma insert counts — what designers *place* — while the fact that four repos build forms with `@mui/material` + `react-hook-form` is invisible to the plan.
  - `[verified]` `mwa-bma-features` remains frozen on `^0.0.23` and cannot receive updates through its declared range.
- **Why yellow, not green:** *"Some numbers but not the story behind them; feedback arrives informally and irregularly shapes the roadmap"* is exactly this. No coverage-vs-adoption tracking, no at-risk-team view, nothing systematically converting the Slack stream into backlog.
- **First move:** a weekly triage of the two Slack channels into DSC, starting with Patrick's five open reports.

### Station 9 — Machine-readable docs: 🟡 YELLOW (5/10 shipped · 🟢 8/10 with the experimental repo promoted)

**Shipped state, unchanged from Aug 3 apart from one gain:** no `custom-elements.json`; JSDoc now on **3 of 15** component files (`eo-tooltip`, `eo-radio-button`, `eo-radio-group` — up from 1); Style Dictionary still registers only `scss/custom-props` (`config.ts:59`), so **2,263 token `$description` fields still never leave the repo**; `types/*.ts` union members still carry no inline comments. A consumer's agent installing the package today gets no machine-readable contract at all.

**Everything below is in the experimental repo and reachable by nobody.** Full record in `reports/2026-08-05-stations-09-10-playground.md`. Summary:

- `[verified]` **Both validators run clean offline**, stdlib-only, no MCP, no submodule: `design.md valid — 3061 tokens`; `components/ valid — 127 component folders, 127 indexed`.
- `[verified]` 127 components with typed properties, enumerated variants, defaults, a bidirectional `usedBy` graph and a published JSON Schema. This supersedes the 2,263 token `$description` fields as the strongest machine-readable asset here — and includes them.
- `[verified]` **A `status` field already exists in the schema and is 91% empty** — `null` for 114 of 127, `"Production"` for 10, `"production"` for 3. Two spellings, and the schema constrains it only to `["string","null"]` with no enum.
- `[verified]` **The tier label overstates.** `index.md` advertises "41 with Figma-authored prose (usage, anti-patterns, accessibility…)"; actual counts across all 127 are **Usage 13 · Anti-patterns 9 · Accessibility 16 · Behaviour 10 · Implementation 19.**
- `[verified]` `index.md`'s own Coverage totals of 127: **Import 12 · Props 101 · Slots 39 · Events 1 · A11y 16 · Examples 1 · Anatomy 42 · Tokens 47.**
- `[verified]` **`component.md` is a lossy rendering of `component.json`.** The JSON stores canonical `name: "hasLeadingIcon"` alongside `figmaName: "has leading-icon"`; the Markdown renders only the Figma name. An agent reading the file humans are pointed at gets the non-code-facing spelling.
- `[verified]` Code-side unchanged: still no `custom-elements.json`; JSDoc now on 3 component files (`eo-tooltip`, `eo-radio-button`, `eo-radio-group`) of 15; Style Dictionary still emits only `scss/custom-props`.
- **First move:** populate and constrain the `status` field — it is the design/code boundary marker, and it already exists.

### Station 10 — Agent access: 🟡 YELLOW (4/10 shipped · 6/10 with the experimental repo promoted)

**Shipped state, unchanged from Aug 3:** the 17 EGYM Claude skills still live only in `~/.claude/skills/` on one machine — user-scoped, invisible to all 8 consumer repos, bus-factor-1 on the strongest tooling asset here. Neither DS repo has a `CLAUDE.md`, `AGENTS.md` or `CONTEXT.md`, while two consumer repos (`class-booking-mwa`, `qualitrain-user-frontend`) already ship `AGENTS.md`. Zero Code Connect. Zero discoverability — nothing in either repo's docs mentions any MCP, skill, or AI workflow. Storybook still builds and publishes to GCS.

**Everything below is in the experimental repo and reachable by nobody.** Full record in `reports/2026-08-05-stations-09-10-playground.md`. Summary:

- `[verified]` Skill + 8 stdlib scripts + 5 slash commands committed — solves the bus-factor-1 problem independently of work-order item 10.
- `[verified]` Dual toolchain, five-for-five mirrored (`.claude/commands/` ↔ `.github/prompts/`), `eods.` namespaced by documented convention. Copilot support is justified — engineers here visibly use it.
- `[verified]` `CONTEXT.md` is strong agent onboarding, including an explicitly marked correction of a wrong earlier assumption and a pivot history that stops an agent repeating a dead end.
- `[verified]` **Private playground org, zero inbound links** from either DS repo, Notion, or Slack.
- `[verified]` **No `.github/workflows/` at all** — its own roadmap names the CI guardrail; it was never added.
- `[verified]` 6 commits over 3 days (2026-07-29→31), nothing since; submodule pinned to `v0.0.24` while main is at `v0.0.25-1`.
- `[verified]` The 17 EGYM Claude skills still live only in `~/.claude/skills/` on one machine; neither DS repo has a `CLAUDE.md` or `AGENTS.md`, while two consumer repos ship `AGENTS.md`.
- **First move:** move it into, or link it from, `lib-egym-one-design-system`.

---

## What actually changed since Aug 3

**System changes (2 days):**
1. PR #100 merged after 151 days — `eo-radio-button` + `eo-radio-group` shipped, with JSDoc and correct conventions.
2. PR #166 (first behavioural a11y test) opened and approved.
3. Icons package PR #164 opened.

**Work-order items completed:** none.

**Lights turned off:** none. **New lights:** Station 5's empty `required_status_checks`.

**Measurement corrections:** Stations 4, 6, 7, 8, 9, 10 — six of ten stations were scored on incomplete evidence in both prior passes, and neither pass said which surfaces it hadn't reached. That is the process failure this inspection fixes; it is now recorded in GARAGE.md's access map.

---

## Cadence

- **Re-inspect on change, not on calendar**, until Station 1 moves. This is the third inspection in six days and the third to find the same two-character typo.
- **Wire into CI now:** `vitest.config.ts` path validity · documented imports validated against the `exports` map · token-description presence · `validate_design_md.py` + `validate_component_md.py` · the consumer adoption scan.
- **Owner:** Felix · **Review:** next Design System CoP (Monday)
