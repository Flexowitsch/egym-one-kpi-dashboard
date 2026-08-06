# Stations 9 & 10 Re-inspection — against `egym-playground/egym-one-design-system`

_EGYM One Design System · 2026-08-05 · Mode 2, two stations_
_New evidence: the AI-readiness repo built by Pedro Rosa, 2026-07-29 → 2026-07-31._

## What this repo is

`egym-playground/egym-one-design-system` (private, `master`, 531 KB, 6 commits over 3 days) extracts the design system into portable machine-readable form and ships it as a tool-agnostic Agent Skill:

```
design.md                        3,138 lines — 3,061 token rows, 10 collection/mode sets
components/                      127 folders × component.md + component.json (8,518 md lines, 1.1 MB json)
components/index.md              569 lines — component table + per-field Coverage ledger
components/component.schema.json JSON Schema for the machine contract
skills/egym-one-design-system/   SKILL.md + 8 stdlib-only Python scripts + template
token-reference/                 4 schema/taxonomy docs (826 lines)
.claude/commands/ ×5             /eods.* slash commands
.github/prompts/ ×5              Copilot mirror of the same five
.mcp.json + .vscode/mcp.json     Figma MCP wiring for both tools
CONTEXT.md                       349-line handoff briefing
```

Five flows: extract tokens (offline, from the token submodule), generate tokens into Figma, extract components from the UI Kit, sync one component, import a new one.

## Verification — I ran it rather than reading it

| Check | Result |
|---|---|
| `validate_design_md.py design.md` | `[verified]` **exit 0** — "design.md valid — 3061 tokens" |
| `validate_component_md.py components` | `[verified]` **"components/ valid — 127 component folders, 127 indexed"** — bidirectional index↔folder consistency holds |
| `validate_design_md.py` on shipped template | `[verified]` exit 0 |
| Runs offline, no submodule, no MCP, stdlib only | `[verified]` Python 3.9.6, zero install, zero network |
| Token cross-reference finds real drift | `[verified]` **10 CSS vars cited by the UI Kit resolve to no token in `design.md`** — incl. `component/avatar/notification-badge/color/border`, `component/radio-button/dimension/size/selection-marker`, `component/loading-spinner/motion/duration`, `--eo-deprecation` |

Everything the README claims about the pipeline, I confirmed by running it. That is rare and worth saying plainly.

**Note on the drift list:** three of those ten (`avatar/notification-badge/color/border`, `loading-spinner/motion/duration`, and the removed `motion/duration/skeleton`) are named in the Token System **v0.0.25** release post in Slack on 2026-04-10. The submodule here is deliberately pinned to **v0.0.24**. So part of that drift is the pin, not a genuine defect — bumping the pin is a one-line change and would shrink the list. The rest is real.

## Station 9 — Machine-readable docs: 🟡 5 → **🟢 8** _(if this lands in the real repo; the playground itself scores it)_

### What this fixes from the 2026-08-03 work order

- **Item 13, "Publish the token JSON"** — effectively solved, better than specified. The work order asked for a JSON output format from Style Dictionary so consumers could read token names, values and descriptions. `design.md` delivers 3,061 rows with a six-column contract (`Token | Value | Type | Collection | Mode | Description`), correct `(Token, Collection, Mode)` uniqueness, preserved dimension units, and mode-agnostic alias chains. Plus `component.json` × 127 against a published JSON Schema.
- **Item 11, "Finish the Figma metadata rollout"** — reframed usefully. `components/index.md`'s Coverage table *is* the worklist, per component, per field.
- **Item 12, "docblocks + `custom-elements.json`"** — partially superseded for the design side; still open for the code side (see below).

### Findings

- `[verified]` **This is the strongest machine-readable asset EGYM has, by a distance.** 127 components with typed properties, enumerated variants, defaults, dependency graph (`usedBy` both directions), and a JSON Schema. The Aug 3 report called the 2,263 token `$description` fields "the strongest machine-readable asset you own"; this supersedes that, and includes it.
- `[verified]` **It has a conformance check nothing else in the toolchain has.** `validate_component_md.py` cross-references every CSS var the UI Kit cites against the token source and fails on dangling references. That is a design↔token contract test, and it found real drift on first run.
- `[verified]` **Content-based `extracted_at`** — timestamps only advance when rendered content actually changes, so a single-component sync produces a scoped diff instead of rewriting all 254 files. Someone thought carefully about review ergonomics.
- `[verified]` **The tier label overstates what most files contain.** `index.md` says *"41 with Figma-authored prose (usage, anti-patterns, accessibility, …)"* and 41 rows carry `tier: documented`. Actual section counts across all 127: **Usage 13 · Anti-patterns 9 · Accessibility 16 · Behaviour 10 · Implementation 19.** The tier is assigned on the presence of *any* Figma description; most of those descriptions yield a sentence, not the advertised section set. An agent told "41 are documented" will find 13 that say when to use the thing.
- `[verified]` **Enrichment is thin, and `index.md`'s own totals say so** — of 127: **Import 12 · Props 101 · Slots 39 · Events 1 · A11y 16 · Examples 1 · Anatomy 42 · Tokens 47.** Events and Examples are effectively unpopulated (one each, both on `filter-button`, both hand-authored via the overlay escape hatch). Rate-limited Figma Dev-seat calls are the stated cause and that is credible.
- `[verified]` **CONTEXT.md's coverage numbers have already drifted from the artifacts.** It reports 60/127 anatomy trees and 32/127 geometry; I count 54 files without the "no anatomy tree fetched" fallback and 24 with a `## Geometry` section, while `index.md` totals say Anatomy 42. Three sources, three numbers. The file is honestly labelled "as of the last run," but nothing recomputes it.
- `[verified]` **This documents the Figma library, not the shipped code.** 127 Figma components; the npm library ships 13. The join exists for **12 components** carrying a real `package:` line (`@egym-private/egym-one-design-system-web/<name>`) — `checkbox`, `filter-button`, `filter-select`, `filter-tag`, `form-search-filter`, `header-app`, `loading-spinner`, `radio-button`, `segmented-control`, `tooltip-plain`, `tooltip-map`, `cluster`. Several of those are *not* among the 13 shipped web components, so the mapping is aspirational in places.
- `[verified]` **An agent reading this repo alone would still write `<eo-input>`.** `input-text`, `input-dropdown`, `textarea`, `toggle` all have folders — they exist in Figma and not in code. Nothing marks the design/code boundary. This is the same failure mode work-order item 6 flagged in `QUICK_START.md`, reproduced at 10× the surface area.

### Score: **8/10** for what exists as machine-readable design documentation; the two points withheld are the unmarked design/code boundary and the overstated tier labelling — both of which actively mislead an agent.

## Station 10 — Agent access: 🟡 4 → **🟡 6**

- `[verified]` **The bus-factor-1 problem is solved in principle.** The Aug 3 finding was "17 EGYM skills live only in `~/.claude/skills/` on one machine." This repo commits its skill, its scripts, its commands and its MCP config — anyone who clones it gets the capability. That is exactly the pattern work-order item 10 asked for, built independently.
- `[verified]` **Two toolchains, one brain.** `skills/` holds the logic; `.claude/commands/` and `.github/prompts/` are five-for-five mirrors. Copilot gets an always-on `copilot-instructions.md` pointer. Given the Slack evidence that engineers here use Copilot (`:copilot:` in Richard's PR #166 message), supporting both is the right call, not gold-plating.
- `[verified]` **Namespacing was done deliberately** — every command carries the `eods.` prefix, documented as a standing rule with the rationale (palette grouping, collision avoidance). The five were renamed into the scheme after being written unprefixed.
- `[verified]` **`CONTEXT.md` is a genuinely good agent-onboarding document** — and contains something rare: an explicit, marked **correction** of a wrong earlier assumption (that `component.*` tokens were a component inventory) with the evidence that overturned it, plus a "pivot history" explaining why Figma-MCP token extraction was abandoned. An agent resuming cold does not repeat the dead end.
- `[verified]` **It is in the wrong org and nobody can reach it.** `egym-playground/…`, private, not linked from `lib-egym-one-design-system`, `egym-one-token-system`, the Notion DS space, or either Slack channel. Discoverability is zero — the identical finding the Aug 3 report made about the user-level skills, relocated.
- `[verified]` **No CI, at all.** No `.github/workflows/`. Its own README roadmap names the guardrail — "a CI guardrail running `validate_design_md.py` on every PR" — and it was never added. Both validators run offline in under a second; this is the cheapest open item in either repo.
- `[verified]` **Development stopped after three days.** Six commits, 2026-07-29 → 2026-07-31, nothing since. Not abandoned-looking so much as parked — but the token pin (`v0.0.24`, while the submodule's main is at `v0.0.25-1`) will keep drifting, and the drift list will keep growing.
- `[verified]` **The submodule needs SSH to `git@github.com:egym/egym-one-token-system.git`**, called out in CONTEXT.md as a gotcha. A CI runner or a fresh clone without keys fails `git submodule update --init`. Both validators still run offline against committed outputs, which is the saving grace.

### Score: **6/10.** The capability is real, committed, dual-toolchain and verified working. It is invisible, ungated by CI, and parked.

## Iterating on it — ranked by payoff per hour

1. **Move it, or link it.** It belongs in `lib-egym-one-design-system` (as `.claude/` + `components/` + `design.md`) or, if it stays separate, it needs a README pointer from both DS repos and a post in `#community-design-system-engineering`. Right now the highest-value AI-readiness artifact EGYM owns is in a playground org that nobody has been told about. This is a 20-minute fix and it gates everything else.
2. **Add the CI guardrail its own README asks for.** Both validators exit 0 offline against committed outputs. A workflow running them on every PR costs one file and makes the drift check permanent. Pair it with `validate_component_md.py`'s drift output as a *warning* job so token/UI-Kit divergence becomes visible instead of discovered.
3. **Mark the design/code boundary — the single highest-value content change.** Add a `status:` field to `component.json` (`in-code` / `figma-only` / `deprecated`) and render it in both `component.md` and `index.md`. Today an agent reading `input-text/component.md` has no way to know it cannot import it. This turns the repo from "what the UI Kit contains" into "what you can actually build with," and it directly closes work-order item 6's root cause at 127-component scale.
4. **Fix the tier labelling.** Either rename `documented` to `has-figma-description`, or promote on the presence of actual Usage/Anti-pattern sections. Then `index.md`'s prose gap becomes an honest worklist — and it is the same worklist as work-order item 11.
5. **Bump the submodule pin to `v0.0.25-1` and re-run.** Three of the ten drift entries are v0.0.25 tokens the pin cannot see. Re-running shows how much of the drift is real.
6. **Recompute the coverage numbers in `CONTEXT.md` from the artifacts**, or delete them and point at `index.md`'s Coverage table as the one source. Three different anatomy counts across three files is exactly the drift this repo was built to prevent.
7. **Then chase Events/Examples via the overlay.** 1 of 127 each. `filter-button.overlay.json` proves the escape hatch works; the shipped code components are the obvious first twelve, since their real events and usage examples exist in Storybook already.

## Cross-station effects

- **Station 6 (Orchestration, 🟡 5):** this is the design→code bridge the Aug 3 report said was entirely missing ("still zero Code Connect files"). It is not Code Connect, but for 12 components it is a real design↔package join, and the mechanism generalises.
- **Station 1 (Coverage, 🔴 3):** `components/index.md` now quantifies the gap precisely — 127 in Figma, 13 in code. Work-order item 2's form-control scope (`input-text`, `input-dropdown`, `textarea`, `radio-button`, `toggle`) can be specified straight from these files; the Figma API contract for all five already exists here.
- **Station 7 (Governance, 🟡 6 as of today):** this repo has no CONTRIBUTING, no PR template and no CI either — but it is a 3-day-old prototype, so that is scope, not neglect. Worth noting only because moving it into the main repo inherits the main repo's governance gaps.

## Station records

```markdown
### Station 9 — Machine-readable docs: GREEN (8/10) — was 🟡 5
- Inspected: egym-playground/egym-one-design-system @ 8bbcc41; ran both validators offline
- Evidence level: live (cloned repo, executed scripts)
- Findings:
  - [verified] design.md validates at 3,061 tokens; components/ validates at 127 folders, 127 indexed
  - [verified] token cross-reference found real drift (10 dangling CSS vars); ~3 attributable to the
    deliberate v0.0.24 pin, rest genuine
  - [verified] 127 components with typed props, variants, defaults, bidirectional dependency graph,
    JSON Schema — supersedes the token $description corpus as the strongest MR asset
  - [verified] tier label overstates: 41 "documented" but Usage 13, Anti-patterns 9, A11y 16
  - [verified] index.md's own totals of 127: Import 12, Props 101, Slots 39, Events 1, A11y 16,
    Examples 1, Anatomy 42, Tokens 47
  - [verified] CONTEXT.md coverage figures already drifted from the artifacts (3 anatomy counts)
  - [verified] documents 127 Figma components; code ships 13; no design/code boundary marked —
    an agent reading this still invents <eo-input>
- Not inspected: Flow 2 write path (needs Full seat); submodule contents (SSH-gated)
- First move: mark the design/code boundary with a status field

### Station 10 — Agent access: YELLOW (6/10) — was 🟡 4
- Inspected: same repo; skill/commands/prompts/MCP wiring, git history
- Evidence level: live
- Findings:
  - [verified] skill + 8 stdlib scripts + 5 commands committed — solves the bus-factor-1 problem
    the Aug 3 report raised, independently of work-order item 10
  - [verified] dual toolchain (Claude Code + Copilot), five-for-five mirrored, eods. namespaced
  - [verified] CONTEXT.md is strong agent onboarding, incl. an explicit marked correction and
    pivot history that stops an agent repeating a dead end
  - [verified] private playground org, zero inbound links from either DS repo, Notion, or Slack
  - [verified] no .github/workflows — its own roadmap's CI guardrail was never added
  - [verified] 6 commits over 3 days (2026-07-29→31), nothing since; token pin v0.0.24 vs main v0.0.25-1
- Not inspected: whether any consumer team has run it
- First move: move it into (or link it from) lib-egym-one-design-system, then add the CI guardrail
```
