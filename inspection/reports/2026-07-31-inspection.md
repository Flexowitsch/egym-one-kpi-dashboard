# Multi-Point Inspection Report — EGYM One Design System

_Inspected: 2026-07-31 · Technician: Claude Code (Opus 5) · Previous inspection: first inspection_
_Vehicle profile: `ds-inspection/GARAGE.md` (checked in 2026-07-31)_

## The short version

The foundations of this system are genuinely strong — and stronger than the score suggests. The token
architecture is real, four-tiered, multi-brand and multi-breakpoint, with a single-source pipeline from Figma
Tokens Studio through Style Dictionary into CSS custom properties. Token discipline in code is excellent:
528 token references and **zero** truly hardcoded colors. The icons pack is the best-run part of the system by
a distance.

The problem is that the three legs are wildly uneven. **114 component pages in Figma (105 marked
production-ready) are served by 13 components in code and roughly 7 documented in Supernova.** There is no
text input, dropdown, radio, toggle, tabs, list, or table in code. For 20+ consuming teams, that means every
form in the company is hand-rolled — which is where off-system UI actually comes from.

For the AI-readiness question specifically, the answer is unusually clear, and it's good news: **you have
already solved this problem once.** Every one of the 347 icons in Figma carries structured, machine-readable
metadata — `tags`, `description`, `useCase`, `category`, and real anti-patterns ("Do not use for app settings —
use settings"). That is exactly the context surface Station 9 asks for. It exists for icons and for nothing
else. The single most valuable next move is to take the icons' metadata pattern and apply it to components,
then publish it where agents can reach it.

The second AI-readiness finding is organizational, not technical: all 16 purpose-built skills (`onelint`,
`onespec`, the `egym-*` QA pipeline) live in `~/.claude/skills` on one laptop. The tooling is impressive and it
works — it is also invisible to every other person in the company.

**Overall: 47/100** — a conversation starter, not a grade. Fix the reds, schedule the yellows, re-run on a cadence.
Score is pro-rata over 9 stations (42/90) — Station 8 was not inspected for lack of evidence access.

## Inspection sheet

|  # | Station                         | Quality      | Light |      Score |
|---:|:--------------------------------|:-------------|:-----:|-----------:|
|  1 | Coverage & gaps                 | Complete     |  🔴   |       3/10 |
|  2 | Best practices                  | Sound        |  🟡   |       6/10 |
|  3 | Accessibility                   | Sound        |  🟡   |       5/10 |
|  4 | Shared language                 | Sound        |  🟡   |       6/10 |
|  5 | Testing & validation            | Sound        |  🟡   |       5/10 |
|  6 | Orchestration                   | Synchronized |  🟡   |       5/10 |
|  7 | Governance & version control    | Extensible   |  🟡   |       4/10 |
|  8 | Feedback & adoption             | Extensible   |  N/I  |        N/I |
|  9 | Machine-readable docs & context | AI-Ready     |  🟡   |       4/10 |
| 10 | Agent access                    | AI-Ready     |  🟡   |       4/10 |
|    | **Overall**                     |              |       | **47/100** |

**Lights:** 🟢 0 green · 🟡 8 yellow · 🔴 1 red · 1 not inspected

**Key:** 🔴 Red (0–3) — broken or missing; the light is ON · 🟡 Yellow (4–7) — drift or gaps; schedule a fix · 🟢 Green (8–10) — healthy, no action needed · **N/I** — not inspected (no evidence access; never guessed)

A note on the all-yellow board: this is a system with strong bones and thin connective tissue, built by ~2.4 FTE
for 20+ teams. Nothing here reads as neglect — it reads as a team that built the hard parts first and hasn't had
the capacity to close the loops. Several yellows are one config line away from green.

## Evidence basis

- **Access used this pass:** live throughout. Figma Console MCP bridge (UI Kit, Token System, Icons library),
  official Figma MCP (EGYM SE org), Supernova MCP (DS 633890), all three repos on disk with git history.
- Findings tagged `[verified]`: 31 · `[reported]`: 3
- This was an unusually well-instrumented inspection — nearly every finding was directly observed rather than
  taken on report. The one real gap is consumer-side adoption data (Station 8).

## Station records

### Station 1 — Coverage & gaps: RED (3/10)
- Inventory: **114 component pages in Figma** (105 🟢, 1 🟠, 5 🔴, 3 unmarked) · **13 components in code** ·
  **9 Storybook `.mdx`** · **~7 components documented in Supernova** · **19 deprecated Figma pages**
- Icons: **347 component sets in Figma** vs **322 filled + 322 outlined SVGs in code** (~25 not yet exported)
- Evidence level: live (design, code, docs)
- Findings:
  - `[verified]` Code is ~11% of the design library. All 13 coded components exist in Figma; the gap is entirely
    one-directional (design → code). Sampled scope: full page list of the UI Kit via `figma_execute`.
  - `[verified]` Staples entirely absent from code: text input, dropdown, textarea, radio, selection-tile,
    toggle, tabs, list/list-item, accordion, table, avatar, snackbar, progress-bar, stepper, breadcrumbs,
    empty-state, star-rating, character-counter, date-picker, calendar, and all 5 filter components.
    **Form controls are the biggest hole** — 12 `form/*` pages in Figma, 1 (`checkbox`) in code.
  - `[verified]` Token system is genuinely complete and tiered: Core (330 tokens: color, typography, easing,
    dimension, duration) → Brand (1020 tokens each for EGYM and Wellpass, incl. 23 component-level groups,
    shadow, gradient, motion) → Breakpoint (5 modes incl. smart strength 96/141ppi) → Appearance (light/dark).
    This is a strength, not a gap.
  - `[verified]` Distribution is real: three packages published to private Artifactory, Storybook deployed
    per-branch to GCS.
  - `[verified]` Icons are near-perfect: 322/322 filled/outlined parity, exactly one orphan each way
    (`genius-optimized` filled-only, `genius-compatible` outlined-only), with an automated codegen pipeline.
  - `[verified]` Only 4 of 114 Figma pages carry the 📕 marker (avatar, alert, toggle, button-stack), and 5 are
    marked 🔴 (Labels & Filters, layout/grid, information-container, tables, tooltip).
- Not inspected: per-component variant/state depth inside Figma (bulk extraction timed out after 300s);
  consumer product needs beyond the lead's report.
- Deviations noted: many of the 114 pages are product-specific compositions (20 `card/*`, 8 `genius/*`, BMA
  widgets) that legitimately do not need generic code counterparts. Even filtering to reusable primitives, code
  covers roughly a fifth of what design ships.
- First move: pick the form-control set (input-text, input-dropdown, textarea, radio-button, toggle) and build
  it as one batch — it is the highest-frequency hole and the one most likely to be hand-rolled today.

### Station 2 — Best practices: YELLOW (6/10)
- Sampled: `eo-button`, `eo-link`, `eo-checkbox`, `eo-tooltip`, `eo-dialog` end-to-end; all 33 style files;
  Supernova doc template; token JSON structure
- Evidence level: live (code, docs); design-library craft not inspected
- Findings:
  - `[verified]` **`eo-button` is exemplary** and should be the reference: real `<button>`, `delegatesFocus`,
    internal focus-ring and ripple, Lit context consumption for `intent`/`size`/`fullWidth`, reflected props,
    slots for content, `aria-label` passthrough. This matches the house conventions exactly. *(format + org)*
  - `[verified]` **`eo-link` is the outlier and violates house conventions on every axis**
    (`eo-link/eo-link.ts`): renders nested `<div>`s instead of `<a>`; takes `label` as a property instead of a
    slot; no `reflect` on any property; icons passed as **strings rendered as text content**, so
    `leadingIcon="arrow-left"` renders the literal words; the only component using plain `.css` instead of
    `.scss`; contains `padding: 0.833px`, a Figma-export artifact. *(industry + org + format)*
  - `[verified]` Token discipline is strong: 528 `var(--eo-*)` references across 33 style files and **zero**
    hardcoded colors — all 3 hex literals are legitimate `var()` fallbacks in `eo-link.css`.
  - `[verified]` True hardcoded dimensions are confined to 4 files: `eo-divider` (1px/2px rules),
    `eo-dialog` (`width: 500px`, raw `@media (min-width: 1024px)` instead of the breakpoint tier),
    `eo-tooltip` (arrow geometry — defensible), `eo-link`. Most of the 80 px literals repo-wide are `var()`
    fallbacks, which is defensive, not sloppy.
  - `[verified]` Supernova doc craft is genuinely good: a consistent 4-tab template per component
    (Guideline / Specs / Code / Status & Changelog) plus a `_Template` to clone. Foundations coverage is deep —
    Colors, Typography, Icons, Layout & Grid (Padding, Gap, Touch Target), Motion (incl. an Accessibility page),
    Border Width/Radius, Elevation, Opacity, Screen Sizes.
  - `[verified]` Housekeeping in the published docs: `{Laura's playground} Card` sits in the Documentation Root,
    and the most fundamental component is titled **"Button WIP"**.
  - `[verified]` Figma page names carry process notes and a typo: `accordion 🟢 -> stack`,
    `deprecated / navigation / navigation-rail 🟢 -> remap tokens 3. breakpoint`, and `navigaton / navigation-rail`.
- Not inspected: Figma component internals — auto-layout usage, layer naming, variable binding, detached
  instances. Bulk extraction (`GET_LOCAL_COMPONENTS`) timed out at 300s on a 143-page file.
- Deviations noted: Web Components core with thin React wrappers is deliberate and correct for a polyglot
  consumer base.
- First move: rewrite `eo-link` against the `eo-button` pattern — real `<a>`, slotted content, slotted icons,
  reflected props, `.scss`. It is one component and it is the worst one.

### Station 3 — Accessibility: YELLOW (5/10)
- Sampled: all 13 components for semantics/ARIA; contrast computed across 2 brands × 2 appearances from
  resolved token values; CI and test wiring
- Evidence level: live (code, tokens, CI)
- Findings:
  - `[verified]` **`eo-link` fails WCAG 4.1.2 (Name, Role, Value) and 2.1.1 (Keyboard) as shipped.** It renders
    `<div>`s with no `<a>`, no `href`, no `role`, and no focusable child — `delegatesFocus` has nothing to
    delegate to. It is not reachable by keyboard and is not announced as a link.
  - `[verified]` `eo-alert` renders no semantic element and no `role="alert"`/`role="status"`, so alerts are not
    announced to screen readers.
  - `[verified]` Where the team has done a11y work, it is genuinely good: `eo-checkbox` has a real
    `<input>`+`<label>` with `aria-checked`, `aria-labelledby`, `aria-describedby`, `aria-invalid`,
    `aria-disabled`; `eo-tooltip` has `role="tooltip"`, managed `aria-describedby`, keyboard handling, and a
    labelled close button; `eo-dialog` has `role="dialog"` + `aria-modal`; there are dedicated internal
    `focus-ring` and `ripple` primitives; and a `--eo-dimension-size-touch-target-default: 44px` token is applied
    with an explicit WCAG 2.5.8 comment in `eo-tooltip.scss`.
  - `[verified]` **The a11y safety net is switched off.** `.storybook/preview.tsx` sets
    `a11y: { test: 'todo' }` — with the comment directly above noting `'error'` is what fails CI. Report-only.
  - `[verified]` The Storybook a11y test project never runs at all — see Station 5, the root `vitest.config.ts`
    points at two non-existent paths.
  - `[verified]` Zero a11y assertions across all 25 unit test files (no axe, no `toHaveNoViolations`).
  - `[verified]` Light-mode contrast is essentially clean. Against `surface.default` (#ffffff) every sampled
    content token passes 4.5:1 except `utility.warning` (#97740c) at **4.36:1**, which fails AA for body text
    and is the one real light-mode fix. (`content.disabled` at 2.10:1 is exempt under WCAG 1.4.3.)
- Not inspected: screen-reader behavior in practice; keyboard tab-order through composed flows; the Figma
  library's own a11y annotations.
- Deviations noted: **Dark mode is deliberate scaffolding, not a shipped feature** — confirmed by the lead
  ("dark mode is not ready yet, it just exists bc I wanted to keep it in mind"). Recorded as an intentional
  deviation, not a warning light. One caveat worth acting on: the Appearance tier overrides only 7 tokens
  against Brand's 1020 (and 3 of those are identical in both modes, so dark flips 4 real values). Because those
  tokens ship in the published package, a consumer switching appearance today gets Wellpass-dark ratios of
  2.82:1 on the brand accent and 2.06:1 on `content.subtle`. Worth gating or labelling as unsupported rather
  than fixing now.
- First move: flip `a11y.test` from `'todo'` to `'error'` — after fixing `eo-link`, or it will fail the build
  immediately (which is itself the proof that it works).

### Station 4 — Shared language: YELLOW (6/10)
- Swept: every `@property` across all 13 components; the shared `types/` vocabulary; event patterns; token
  naming scheme
- Evidence level: live (code, tokens)
- Findings:
  - `[verified]` **A real canonical vocabulary exists** in `src/types/` — `Intent`, `Size`, `Hierarchy`,
    `Variant`, `Orientation`, `Thickness`, `Width`, `Content`, `Direction`, `BorderRadius`, `AlertType`,
    `CloseReason`, `SelectedTransform`. Shared types rather than per-component string unions is the right
    architecture and most components use it correctly.
  - `[verified]` **Four different prop names for "which visual style":** `hierarchy` (`eo-button`), `type`
    (`eo-alert`), `appearance` (`eo-tooltip`), `variant` (`eo-navigation-*-item`). Same concept, four names.
  - `[verified]` **Three different patterns for "the component closed":** `eo-bottom-sheet` dispatches the
    shared `ComponentCloseEvent`; `eo-dialog` hand-rolls `new CustomEvent('close', …)` instead of using it;
    `eo-tooltip` uses a callback property `onDismiss` and **throws a runtime `Error`** if it is absent while
    `isDismissable` is true. The callback-prop pattern is React idiom in a web-component library.
  - `[verified]` Boolean naming drift: most booleans are bare adjectives (`disabled`, `selected`, `open`,
    `checked`, `animated`, `indeterminate`, `emphasized`, `fullWidth`, `hasLabel`, `hasDivider`), but
    `isUnderlined` (`eo-link`) and `isDismissable` (`eo-tooltip`) use an `is*` prefix.
  - `[verified]` Content-as-prop vs content-as-slot is inconsistent: `eo-button` slots its label, while
    `eo-checkbox`, `eo-link`, `eo-dialog` (`headline`), and the navigation items take `label` as a string prop —
    which blocks rich content and complicates i18n.
  - `[verified]` `close-reason` and `types/events` are not re-exported from `types/index.ts`, so consumers
    can't import `CloseReason` the documented way.
  - `[verified]` Token naming is coherent and role-based throughout (`color.content.accent`,
    `dimension.gap.default`, `color.surface.accent-hovered`) — no raw-value semantic tokens. This is the
    strongest part of the station.
  - `[verified]` No naming validator or lint rule; consistency currently depends on review attention.
- Not inspected: Figma variant/property naming vs code prop naming (design-side extraction timed out).
- First move: pick one name for the visual-style axis and one pattern for close/dismiss, write both into a
  short API conventions doc, and apply to new components immediately — renaming existing props needs versioning
  the system can't currently express (Station 7).

### Station 5 — Testing & validation: YELLOW (5/10)
- Inspected: 25 test files, root and package Vitest configs, all 8 CI workflows, Storybook test setup
- Evidence level: live (code, CI)
- Findings:
  - `[verified]` CI is real and runs on every push: `build → check → analysis → publish`, with SonarQube
    analysis, coverage artifacts, Playwright cached, and per-branch Storybook deploys. This is well above
    "tests on someone's laptop."
  - `[verified]` **The root `vitest.config.ts` references two paths that do not exist** —
    `'vitest.config.storybook/ts'` (should be `.ts`, not `/ts`) and
    `'packages/eguym-one-design-system-web/vitest.config.ts'` (`eguym` → `egym`). Both verified missing on disk.
    So `npm run storybook:test` — the command documented in `QUICK_START.md` — resolves **zero** projects and
    silently passes. Every Storybook-based test, including the a11y checks, has never run.
  - `[verified]` 25 test files cover all 13 components — coverage breadth is good.
  - `[verified]` **The tests assert structure, not behavior.** `eo-link.test.ts` has 9 passing tests that check
    CSS class names and `querySelector` results — and typecasts `.eo-link` as `HTMLAnchorElement` when it is a
    `<div>`. A component that is unreachable by keyboard and invisible to screen readers has a fully green
    suite. No keyboard-interaction assertions exist anywhere.
  - `[verified]` `@chromatic-com/storybook` is a dependency, but no workflow invokes Chromatic — visual
    regression is installed, not wired.
  - `[verified]` No evals or rubric-based checks for AI-assisted output, despite heavy AI tooling in the
    workflow.
- Not inspected: actual CI run history and pass rates (would need GitHub API access).
- First move: fix the two typos in `vitest.config.ts`. It is a two-character change that switches on an entire
  test project — do this before anything else in the work order.

### Station 6 — Orchestration: YELLOW (5/10)
- Diffed: token pipeline end-to-end; Figma page inventory vs code inventory; repo docs vs actual API; Supernova
  structure vs code
- Evidence level: live (design, code, docs)
- Findings:
  - `[verified]` **The token pipeline is the system's best connective tissue.** One source (Figma Tokens Studio)
    → git submodule (`egym-one-token-system`) → Style Dictionary 5 + `@tokens-studio/sd-transforms` → SCSS
    custom properties, with `submodules: recursive` in every CI checkout. No parallel hand-maintained copies.
    `docs/DESIGN_TOKENS.md` documents this accurately.
  - `[verified]` **No design↔code bridge.** Zero `*.figma.*` Code Connect files across all three repos, and no
    Code Connect mappings registered. Design-to-code generation has nothing to land on.
  - `[verified]` The Figma traffic-light convention (🟢/🟠/🔴 on 114 pages) tracks **design** readiness only —
    105 pages are 🟢 while 13 components exist in code. Nothing in the convention signals code or docs status,
    so "green" reads as "done" to anyone browsing the library.
  - `[verified]` **Repo docs have drifted into being actively wrong.** `README.md` shows
    `import { Button, Card } from '@egym-private/egym-one-design-system-web'` — `src/index.ts` exports only
    `./types` and a style import; there are no such named exports. `QUICK_START.md` tells consumers to override
    `--eo-color-primary` and `--eo-spacing-base`; both have **0 occurrences** anywhere in the token system or
    packages (the real namespaces are `--eo-color-content-*` and `--eo-dimension-*`). It also lists only 7 of
    13 components and documents the broken `storybook:test` command.
  - `[verified]` Supernova carries per-component **Status & Changelog** tabs plus a **Components / Status
    Overview** page — a genuine sync artifact, and the reason "no changelog" is *not* a finding here. The
    changelog is design-facing and lives outside the repo.
  - `[verified]` Docs coverage is the weakest leg: ~7 components documented in Supernova (Alert, Avatar,
    Button *WIP*, Button Stack, Checkbox, Toggle, List + 12 List-Item variants) against 114 in Figma. Many pages
    are `_`-prefixed drafts.
- Not inspected: whether Supernova's Figma import is current; how a specific recent change actually travelled
  (would need an interview or PR walk-through).
- Deviations noted: docs living in Supernova rather than the repo is a deliberate platform choice, not drift.
- First move: fix `README.md` and `QUICK_START.md` against the real API. They are the first thing both a new
  engineer and an agent read, and both currently produce broken code.

### Station 7 — Governance & version control: YELLOW (4/10)
- Inspected: repo governance artifacts, CODEOWNERS, dependabot, publish workflow, git tags, Supernova
  contribution pages
- Evidence level: live (repo, CI, docs); tracker not reached
- Findings:
  - `[verified]` **Versioning cannot express a breaking change.** `publish.yaml` sets every package to
    `0.1.${{ github.run_number }}` — a CI build counter, not semver. A breaking API change and a typo fix
    produce indistinguishable version bumps for 20+ consuming teams. There is no major version, no minor
    signal, and no migration path a consumer can reason about.
  - `[verified]` Zero git tags in the repository; no release is pinned to a commit.
  - `[verified]` Package manifest versions (`web` at `0.0.0`, `react`/`icons` at `0.1.0`) are decorative — CI
    overwrites them at publish time, so the repo never states what is released.
  - `[verified]` Missing repo governance artifacts: no `CONTRIBUTING.md`, no PR template, no issue templates,
    no release process doc. `README.md` points to itself for "contribution guidelines" and contains none.
  - `[verified]` Ownership is clear and documented: `CODEOWNERS` assigns `*` to `@egym/design-system` and
    `/github/` to `@egym/sre`. Dependabot is configured.
  - `[verified]` Design-side governance is genuinely better than code-side: Supernova has a `_Contribution`
    page, a `_Component Parking` group with a "How to park a component" page, and per-component status tracking.
    The process exists — it just isn't reachable from the repo where engineers work.
- Not inspected: **tracker health** — the Jira MCP call timed out past 120s, so DSC backlog size, staleness,
  duplicate rate, and triage cadence are unmeasured. Branch protection settings also not verified.
- Deviations noted: pre-1.0 versioning is a legitimate choice for a young system; the finding is the absence of
  *any* semantic signal, not the leading zero.
- First move: move to real semver with an automated release tool (changesets or semantic-release). Until a
  breaking change can be named, no other governance artifact does much work.

### Station 8 — Feedback & adoption: N/I (not inspected)
- Measured: nothing directly
- Evidence level: none obtained
- Findings:
  - `[reported]` The lead states 20+ product teams consume the system, possibly more.
  - `[reported]` The lead states docs lag behind the rest of the system — independently confirmed at Stations 1
    and 6, so this one is corroborated.
  - `[reported]` The lead states there are fewer coded components than Figma components — confirmed and
    quantified at Station 1 (13 vs 114).
- Not inspected, and why: no consumer repositories are available locally, so no dependency or import scan was
  possible; no npm/Artifactory download statistics were reachable; the Jira MCP call for `DSC` tracker health
  timed out; no Figma library analytics were queried; no support-channel history was read. **Scoring this
  station would have meant guessing, so it is recorded as N/I and excluded from the total.**
- First move: a dependency-version scan across consumer repos — which teams are on which published version, and
  which have hand-rolled a `<input>` or `<select>`. That single scan would answer coverage-vs-adoption and
  simultaneously validate the Station 1 priority list.

### Station 9 — Machine-readable docs & context: YELLOW (4/10)
- Inventoried: token formats, type definitions, docs structure, AI-facing surfaces · **Generation test: run**
- Evidence level: live (repo, docs, design library)
- Findings:
  - `[verified]` **The icons library already does this correctly, and it is excellent.** All 347 icon component
    sets in the Figma Icons file carry structured descriptions with `tags:`, `description:`, `useCase:`, and
    `category:` fields — including explicit anti-patterns ("Do not use for the circle-plus variant — use
    circle-plus"; "Do not use for app settings — use settings"). This is precisely the component metadata this
    station asks for. **It exists for icons and for nothing else.**
  - `[verified]` Raw materials are machine-friendly: tokens in DTCG JSON, TypeScript types for the shared
    vocabulary, CSS custom properties, Figma Variables, and a consistently structured Supernova doc template
    (Guideline / Specs / Code / Status) that an agent could parse reliably.
  - `[verified]` **No AI-facing surface exists for components:** no `llms.txt`, no `llms-full.txt`, no
    `AGENTS.md` or `CLAUDE.md` in any of the three repos, no `.cursorrules`, no component metadata schema.
  - `[verified]` **No custom-elements manifest.** For a Lit web-component library, `custom-elements.json` is the
    standard machine-readable API format — it drives IDE autocomplete, Storybook prop tables, and agent
    understanding. Neither the file nor `@custom-elements-manifest/analyzer` exists.
  - `[verified]` **Generation test — failed.** Handed only the repo's own docs, an agent building a composition
    would (a) write `import { Button, Card } from '…-web'` from the README, which does not exist and will not
    resolve; (b) invent `--eo-color-primary` and `--eo-spacing-base` from QUICK_START, neither of which exists
    (0 occurrences); (c) not know that `eo-alert`, `eo-card`, `eo-checkbox`, `eo-dialog`, `eo-tooltip`, and
    `eo-button-stack` exist, since QUICK_START lists only 7 of 13. Every one of these is a verified context gap,
    not a hypothetical.
  - `[verified]` The machine-readable layer that does exist is not generated from source, so it will drift.
- Not inspected: whether Supernova's published docs expose a machine-consumable API or feed.
- First move: generate `custom-elements.json` from source and write component descriptions in the icons'
  `tags`/`description`/`useCase`/`category` shape. You already have the pattern and the tooling instinct —
  this is replication, not invention.

### Station 10 — Agent access: YELLOW (4/10)
- Surfaces mapped: Figma Console MCP, official Figma MCP, Supernova MCP, 16 local skills ·
  **Live test: partially run** (surfaces exercised from the lead's own environment during this inspection)
- Evidence level: live (all surfaces probed directly)
- Findings:
  - `[verified]` The surfaces that exist genuinely work. The Figma Console bridge answered a probe in 2ms across
    three connected files; the official Figma MCP authenticated against the EGYM SE org; the Supernova MCP
    returned live workspace and documentation structure. This inspection ran almost entirely on live evidence
    because of that tooling.
  - `[verified]` **All 16 purpose-built skills live in `~/.claude/skills` — user-scoped, on one machine.**
    `onelint` (+6 sub-skills), `onespec` (+8 sub-skills), and the `egym-*` suite (a11y audit, color/token
    compliance, auto-layout, component source check, stress test, UX QA, Lokalise l10n, changelog, component
    docs, full QA pipeline). The project's `.claude/skills/` contains only the two inspection kits. **None of
    this tooling is in the repo, and none of it is distributed to the team or to consuming teams.**
  - `[verified]` No design-system MCP exists for consumer teams to query components, tokens, or usage rules.
    The Figma and Supernova MCPs expose the *authoring* tools, not the system as a queryable product.
  - `[verified]` No Code Connect mappings, so agents doing design-to-code in Figma have no path to real
    components.
  - `[verified]` **Zero discoverability.** Nothing in `README.md`, `QUICK_START.md`, `DESIGN_TOKENS.md`, or the
    Supernova Getting Started pages mentions that any AI tooling, MCP, or skill exists. Per this station's own
    rule, tooling nobody knows about scores like no tooling.
  - `[verified]` The workflows are repeatable and well-designed (the `egym-full-qa-pipeline` chains 7 checks
    with regression gates) — but they are one person's environment, which makes them a bus-factor-1 asset rather
    than an organizational capability.
- Not inspected: output quality of an agent building real product UI through these surfaces from a *consumer
  team's* environment — the test that would confirm or deny a green.
- Deviations noted: none claimed.
- First move: move the `onelint`/`onespec`/`egym-*` skills into the design system repo under `.claude/skills/`
  and commit them. It converts a personal toolkit into a team asset in an afternoon, and it is the prerequisite
  for every other agent-access improvement.

## Next service

- Work order: `ds-inspection/work-orders/2026-07-31-work-order.md`
- Recommended cadence: deep inspection quarterly. Everyday checks to wire into CI now: **Station 3**
  (a11y via `a11y.test: 'error'`), **Station 5** (fix the Vitest config; add Chromatic), **Station 2**
  (token-compliance lint), **Station 9** (regenerate `custom-elements.json` on build).
- Re-inspect by: 2026-10-31
