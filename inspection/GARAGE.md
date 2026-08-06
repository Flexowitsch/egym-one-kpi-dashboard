# GARAGE.md — EGYM One Design System
_Checked in: 2026-08-03 · Rebuilt after the 2026-07-31 intake artifacts were lost from disk_

## Vehicle
- System: **EGYM One Design System**, serving EGYM's web properties (Wellpass + EGYM brands, 6 breakpoint targets incl. Fitness Hub and Smart Strength hardware)
- Team: **~2.4 FTE** — 1 dedicated DS lead (Felix), 1 freelancer, 1 person at 40% (novice), plus a community-of-practice of engineers contributing as time allows
- Consumers: **20+ product teams** company-wide
- Age: current "One" generation supersedes a prior `lib-egym-design-system`; token system on a 4-tier cascade (Core → Brand → Appearance → Breakpoint)
- Reason for service: **AI-readiness push.** The operative question is "what do I do next," not "audit everything." Stations 9 and 10 carry the weight.

## Assets
- **Design library:** Figma — three files: `🥇 EGYM One - UI Kit` (`9KDtjmzW33gLx0XTynKDfl`), `🥇 EGYM One - Token System` (`6TZ8cwjJd2XKBl7wvla766`), `🥇 EGYM One - Icons` (`ViK07yfVO3Mq91dAOWdZsc`). Tokens authored in Figma Tokens Studio.
- **Code library:** `lib-egym-one-design-system` — npm workspaces monorepo, 3 packages:
  - `@egym-private/egym-one-design-system-web` — 13 Lit 3 web components (`eo-*`), SCSS + CSS custom props
  - `@egym-private/egym-one-design-system-react` — thin `@lit/react` wrappers
  - `@egym-private/egym-one-design-system-icons` — SVG icon library (347 icon sets in Figma)
  - Token pipeline: Style Dictionary (`tools/vite/style-dictionary/`), single registered output format `scss/custom-props`
  - Distribution: private Artifactory; Node v24 (`.nvmrc`)
- **Token source:** `egym-one-token-system` (also a submodule at `submodules/egym-one-token-system`) — DTCG-format JSON, 4-tier cascade
- **Docs:** Storybook (13/13 components have stories; 9/13 have MDX), built in CI and published to GCS bucket `egym-one-design-system-storybook-test-co-1006`. Repo docs: `README.md`, `docs/QUICK_START.md` (423 lines), `docs/DESIGN_TOKENS.md`
- **Process:** GitHub Actions (build / check / analysis / publish / cleanup), CODEOWNERS, dependabot, husky + lint-staged, SonarQube, Jira (DSC- prefix), Notion changelog
- **AI surface:** Figma Console MCP · official Figma MCP · Supernova MCP · Southleft design-systems-mcp (added 2026-08-03) · 17 EGYM-specific Claude skills (`onelint*`, `onespec*`, `egym-*`) — **all installed user-level on the DS lead's machine only**

## Evidence access map
| Asset | Access | Verified how |
|---|---|---|
| Design library | **live** | Figma Console MCP probe returned 1ms roundtrip; 3 EGYM files connected; ran node queries against the real UI Kit |
| Code library | **live** | Both repos cloned to disk 2026-08-03; read `eo-button.ts`, `package.json` export maps, Style Dictionary config |
| Token source | **live** | Read `tokens/1 Core/Mode 1.json`; counted `$value`/`$description` across the tree |
| Docs | **live** (repo) / **interview** (published Storybook) | Read README, QUICK_START, all MDX; did not load the deployed GCS Storybook |
| Process | **live** (CI/repo) / **interview** (Jira, adoption) | Read `.github/workflows/*`; Jira/Rovo MCP times out; no consumer-adoption data exists |
| Support channels | **live** (added 2026-08-05) | Full read of `#community-design-system` (C07SJQ0BKQU, 2025-12→2026-08) and `#community-design-system-engineering` (C0AA6858ZSR, 2026-01→2026-08) |
| GitHub API | **live** (added 2026-08-05) | `gh` authenticated; PR history, tags, releases, branch protection across all 4 `@egym/design-system` repos |
| Notion DS space | **live** (added 2026-08-05) | `🥇 EGYM ONE Design System` + Release Process, contribution checklist, Decision Log DB, UI Kit changelog |

### Team repos (verified 2026-08-05 via GitHub API)
`lib-egym-one-design-system` · `egym-one-token-system` (7 tags/releases) · `egym-one-figma-extensions` · `lib-egym-design-system` (legacy)

**Plus, outside the team org:** `egym-playground/egym-one-design-system` (private) — the AI-readiness
extraction built by Pedro Rosa 2026-07-29→31. Agent Skill + 8 stdlib scripts + `design.md` (3,061
tokens) + 127 × `component.{md,json}` + JSON Schema, dual-wired for Claude Code and Copilot. Both
validators verified passing offline. Not linked from any DS repo, Notion, or Slack.
Assessed in `reports/2026-08-05-stations-09-10-playground.md`.

## Known symptoms
- No AI-facing context layer anywhere in the repos — agents opening the codebase start cold
- Component metadata rollout in Figma is **partially complete** and stalled mid-way
- The 17 EGYM skills are powerful but live on one machine; consuming teams can't run them
- No design→code bridge (Code Connect) at all

## Probable greens
- Token system: DTCG-conformant, densely described, brand/breakpoint cascade working
- CI/CD and repo hygiene (linting, SonarQube, CODEOWNERS, dependabot, husky)
- Storybook coverage of the 13 shipped components

## Intentional deviations
- **Dark mode is deliberate scaffolding, not a shipped feature.** Felix keeps it in the token system to hold the shape. Its contrast ratios must NOT be reported as accessibility failures.
- Component library is intentionally small (13 components) relative to the Figma UI Kit (108 public component sets) — code follows demand, not parity.

## Scope & frame
- Stations this pass: **all 10** (full re-inspection, 2026-08-03)
- Scoring frame: **small team** (~2.4 FTE serving 20+ teams) — prefer switch-on-what-exists over new projects
- Out of scope: product inspection (run `/product-inspection` from inside a consumer repo — `operator-portal-frontend` is the heaviest user and the natural first candidate)

## Consumer repositories (verified 2026-08-03, GitHub org scan)
| Repo | DS version | Notes |
|---|---|---|
| `operator-portal-frontend` | `^0.1.22` | heaviest user (39 code hits) |
| `qualitrain-user-frontend` | `^0.1.5` | icons pinned exact `0.0.13`; has `AGENTS.md` |
| `class-booking-mwa` | `^0.1.20` | **also ships legacy `react-design-system` + `wc-design-system`**; has `AGENTS.md` |
| `gymfinder-frontend` | `^0.1.23` | newest |
| `membership-management-mwa` | `^0.1.22` | |
| `wellpass-checkin-mwa` | `^v0.1.15` | malformed `^v` prefix |
| `mwa-bma-features` | `^0.0.23` | **frozen** — npm resolves `^0.0.x` to that exact patch |
| `egym-ai-toolkit` | — | 2 references |

## Prior inspections
- 2026-07-31 baseline: **47/100** (42/90 pro-rated; Station 8 N/I). S1 🔴3 · S2 🟡6 · S3 🟡5 · S4 🟡6 · S5 🟡5 · S6 🟡5 · S7 🟡4 · S8 N/I · S9 🟡4 · S10 🟡4.
- 2026-08-03 full re-run: **47/100**. S1 🔴3 · S2 🟡7 · S3 🟡5 · S4 🟡6 · S5 🟡5 · S6 🟡5 · S7 🟡4 · S8 🔴3 · S9 🟡5 · S10 🟡4.
- 2026-08-05 full re-run: **51/100 shipped** (57 with the experimental repo promoted).
  S1 🔴3 · S2 🟡7 · S3 🟡5 · S4 🟡7 · S5 🟡4 · S6 🟡5 · S7 🟡6 · S8 🟡5 · S9 🟡5 · S10 🟡4.
  **Six of ten stations moved on measurement, not change** — Slack, GitHub API and Notion had never been
  inspected, and neither prior pass recorded that they hadn't. Scoring rule adopted: the experimental
  repo `egym-playground/egym-one-design-system` is **not in main** and scores nothing; its contribution
  (S6 +1, S9 +3, S10 +2) is tracked separately as available upside.

The July artifacts were lost from disk (this workspace is not a git repo) and **recovered on 2026-08-03 from the session transcript** at `~/.claude/projects/-Users-felixpfahlert-03-Code-01-EGYM-One-Code/4a945833-….jsonl`. They now live at `reports/2026-07-31-inspection.md`, `work-orders/2026-07-31-work-order.md`, and `archive/2026-07-31-GARAGE.md`. Recovery was luck, not backup — get this folder into version control.

## Consumer stack reality (verified 2026-08-03)
EGYM One is **additive, not substitutive** — no consumer has retired anything.

- **Legacy DS still shipping in 5 of 8:** `qualitrain-user-frontend`, `class-booking-mwa`, `gymfinder-frontend`,
  `membership-management-mwa`, `wellpass-checkin-mwa` all carry `react-design-system@18.2.x` + `wc-design-system@0.0.x`
- **MUI in 4:** `operator-portal-frontend` (material, icons, system, x-date-pickers, mui-tiptap, emotion, react-hook-form),
  `qualitrain-user-frontend` (MUI 7 + Bootstrap 5.3.8), `gymfinder-frontend`, plus `react-hook-form` in `mwa-bma-features`
- **Raw `<input>` files:** qualitrain 17 · operator-portal 14 · gymfinder 2 · membership-management 2 · class-booking 1

## Tracker health (DSC, verified 2026-08-03 via Rovo)
116 open. Of the 60 oldest: **58 filed by Felix**, 1 by Pedro Rosa, 1 by Sebastian Proll. 46 in status "Neu"
(untriaged), 48 untouched >180 days, median staleness 293 days. The feedback channel exists and is empty.
