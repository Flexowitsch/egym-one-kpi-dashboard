# Station 7 Re-inspection — Governance & version control

_EGYM One Design System · 2026-08-05 · single-station re-run (Mode 2)_
_Supersedes the Station 7 record in `reports/2026-08-03-inspection.md` and work-order item 7._

## Why this re-run happened

The 2026-08-03 work order listed one open access upgrade: **"Reach the support channel. Slack/Teams history was the one feedback surface not inspected."** Three evidence surfaces opened up in this session:

| Surface | Access | How verified |
|---|---|---|
| `#community-design-system` (C07SJQ0BKQU) | **live** | Full channel read, 2025-12-04 → 2026-08-05 |
| `#community-design-system-engineering` (C0AA6858ZSR) | **live** | Full channel read, 2026-01-22 (channel creation) → 2026-08-05 |
| GitHub API, all 4 team repos | **live** | `gh` authenticated; PR history, tags, releases, branch protection, file trees |
| Notion DS space | **live** | `🥇 EGYM ONE Design System` page + 6 governance sub-pages + Decision Log database |

That is the entire evidence chain this station asks for, for the first time.

## Headline: the previous score was measured on half the system

The 2026-07-31 and 2026-08-03 passes scored Station 7 a **4/10** on findings phrased as absences — *"no CONTRIBUTING.md, no PR template, no ISSUE_TEMPLATE, no changelog."* Every one of those statements is still true **of the code repository**, and every one was verified again today.

They were also scoped to the code repository, which turns out to be roughly half of where this system's governance actually lives. The other half is in Notion and Figma, it is substantial, and it is largely practised. Prior passes never looked there and never said they hadn't.

**Revised score: 🟡 6/10** (was 🟡 4/10). This is a **measurement correction, not an improvement** — nothing about the system changed between Aug 3 and Aug 5. Two of the three points come from evidence that always existed; one comes from branch protection, previously logged as "not inspected."

The honest way to read the new number is as a split:

| Surface | Score | Why |
|---|---:|---|
| Design-side governance | **8/10** | Documented release process with two tracks, a real changelog, a decision log, a 7-phase contribution gate, working rituals, comms that follow their own template |
| Code-side governance | **3/10** | No contribution doc, no versioning that can express a breaking change, no tags, no changelog, no release comms, a 31-PR open queue |

## Findings

### What exists and works — all newly verified

- `[verified]` **A real, specific, written release process exists** — Notion, *"Release Process — Design Assets."* Two tracks (patch ships on merge; breaking/new/token changes batch to **Thursdays**), four mandatory steps, a five-item comms checklist, and a rule that scheduled releases get walked through at the following Monday CoP. This is better than most teams of any size have written down.
- `[verified]` **The design side actually follows it.** Release posts in `#community-design-system` match the documented template — v0.0.14 (2025-12-19), v0.0.15, v0.0.18 (2026-04-16), v0.0.20 (2026-05-11), Token System v0.0.22 (2026-03-03) and v0.0.25 (2026-04-10) all carry version number, Added/Changed/Deprecated sections, and an action-required line. Paper matches reality here.
- `[verified]` **Breaking changes on the design side ship with migration support.** The icon removal from the token library (2026-03-09) shipped with a written step-by-step migration guide and a **grace period announced six weeks ahead** (2026-01-26, "grace period ends March 9"). That is textbook deprecation practice.
- `[verified]` **Incident communication is genuinely strong.** 2026-03-06 21:51, `@channel`: *"Do NOT accept any library update… ignore it and do not click it."* Followed by an all-clear on 2026-03-09 with instructions. Fast, unambiguous, correctly scoped.
- `[verified]` **A contribution gate exists and is rigorous** — *"Checklist for a new component"* opens with **Phase 0: Component Parking (Mandatory Intake & Governance Gate)** requiring a problem statement, 3–5 real use cases, proof no existing component can be extended, and a reject/refine/approve outcome. Seven further phases cover API naming (pointing at the Properties Glossary), a11y, and handoff.
- `[verified]` **A Decision Log exists** with schema for reasoning, stakeholders, impacted components and status.
- `[verified]` **Branch protection on `main` is properly configured** — the item both prior passes left as "not inspected." PR required, 1 approving review, **code-owner review required**, **signed commits required**, `enforce_admins: true`, force-pushes and deletions blocked. `CODEOWNERS` assigns `*` to `@egym/design-system`.
- `[verified]` **The token repo can version.** `egym-one-token-system` carries **7 tags and 7 releases**. The capability exists in the org; it just never reached the component library.
- `[verified]` **Contribution is not dead — it moved channels.** 19 of 48 merged human PRs come from **9 distinct product-team engineers** outside the DS team (Alex Wu Fan, Khadija Fathi, Eric Luong, Florian Ainadou, Berker Bugur, Mohamed Abdellaoui, Samrat Dutta, Rim Misra, Khaled Saidi). Median time-to-merge across all human PRs is **2 days** (0 days for 2026-only); 54% merge within 48 hours.

> This materially qualifies the Station 8 red. "58 of 60 oldest DSC tickets filed by Felix" is still true, but it does not mean the community is silent — it means **the community contributes in Slack and GitHub, and Jira is the channel nobody uses.** The empty tracker is a routing artifact, not proof of disengagement.

### What is broken

- `[verified]` **Someone wrote the missing CONTRIBUTING guide 196 days ago and nobody reviewed it.** PR **#84**, `docs: add contributing guidelines for the Design System`, opened by Richard Ricciardelli **2026-01-20**, still **OPEN**, still **draft**, last touched **2026-01-22**. He announced it in Slack the same day asking for early feedback. This is the single most quotable fact in this inspection: the gap the last two work orders flagged had a volunteer fix sitting in the queue the whole time.
- `[verified]` **Still zero git tags and zero GitHub releases** on `lib-egym-one-design-system`. `publish.yaml` still stamps `0.1.${{ github.run_number }}` across all three packages (lines 56, 59, 62, 68, 72, 76). No release is pinned to a commit.
- `[verified]` **Branch protection requires status checks "strictly" but requires zero of them.** `required_status_checks.contexts` and `.checks` are both **empty arrays** with `strict: true`. A PR with a failing build satisfies branch protection today. Given Station 5's finding that `npm run storybook:test` silently resolves zero projects, the two gaps compound.
- `[verified]` **The open queue is where contributions age.** 13 open human PRs, **median age 98 days**. Six are over 98 days: #84 (196d), #90 (175d, *approved* and still draft), #103 (148d), #104 (146d, changes-requested since March), #119 (133d), #133 (102d — Felix's own tooltip PR).
- `[verified]` **Dependabot is configured and unharvested.** 18 open bot PRs, **median age 135 days, oldest 288 days** (`@eslint/js`, opened 2025-10-20). Prior reports counted dependabot as a green under repo hygiene; it is configured, not operating. `egym-one-figma-extensions` adds 11 more, including two duplicate TypeScript 5.9→7.0 bumps.
- `[verified]` **The tail of the merge distribution is brutal, and it lands on community contributors.** Median is 2 days, but PR **#100** (Alex Wu Fan, radio button) took **151 days**; **#102** (checkbox) **103 days**; **#62** (bottom-sheet) **174 days**. Alex asked for review on #100 on Mar 13, Mar 24, Jun 18 (*"it's also blocking a feature ticket of new Business-Suite, required for next week"*), Jul 2, and Jul 24 before it merged Aug 3.
- `[verified]` **The process was bypassed under pressure, in writing.** Richard, 2026-04-08: *"I went ahead and merged this PR since it's been open for quite a while (Feb 12th) and was starting to block our team and others."*
- `[verified]` **A team has already routed around the system.** Alex Wu Fan, 2026-06-19: *"we decided that we will not use it for the moment… will just try to make similar component in Business-Suite, and when the design system's one is released, we will switch to it."* This is the exact "users quietly detaching" symptom this station warns about — captured verbatim.
- `[verified]` **Review fatigue is explicit, not inferred.** *"is there any kind soul able to take the previous request?"*, *"Is anyone feeling brave enough to review this PR?"*, *"I'm also looking for brave warriors"*, and Richard's *"Maybe we need a super review session meeting. 😿"*
- `[verified]` **The design changelog has stalled and its top entry is malformed.** UI Kit changelog runs cleanly from 0.0.6 to **0.0.20 (2026-05-08)** — then the newest entry is **`[0.0.0]` dated 2026-06-24**. Nothing since. Three months of UI Kit changes are undocumented.
- `[verified]` **Semver is claimed on the design side and not practised there either.** The changelog header states *"adheres to Semantic Versioning"* and the release doc defines major/minor/patch correctly — yet `0.0.15` deprecated three components and renamed `list-item-container`→`list` and `list`→`list-contained`; `0.0.13` renamed `alert snackbar`→`alert-banner`; `0.0.16` renamed `list-item-personal-information`→`list-item-input`. All shipped as patch bumps. The system has never issued a major version on either side.
- `[verified]` **A breaking change was announced as a Slack aside against an open range.** Richard, 2026-01-30: *"⚠️ Heads up. If you start using `lib-egym-one-design-system: >=0.0.24`, some icons that were previously added manually may need to be renamed."* No version signal, no migration doc, no deprecation window.
- `[verified]` **A broken release shipped and had to be reverted.** Pedro, 2026-04-16: *"this change will be reverted since there is a problem with this version of the token that removes the units for the dimensions, breaking the library!"* Confirmed by PR **#129 `Revert DSC-181`**, merged same day.
- `[verified]` **The Decision Log is an archive, not a practice.** 14 entries. **13 were bulk-created on 2026-04-30**; exactly **one** has been added since (*"Input labels live outside the input field"*, 2026-06-15), and it still sits at status *"Not started."* Three of 14 are unresolved.
- `[verified]` **Zero engineering decisions are logged, while engineering decisions are visibly being made in Slack.** Underscore prefix for private members (Eric, 2026-07-02 — *"37% of private methods use an underscore; 63% don't"*), `delegatesFocus` as the house pattern for focusable components (Florian, 2026-07-20), tooltip anchor-slot API vs. the MUI convention (Florian, 2026-06-25), "Design Props vs Technical Props" naming (Richard, 2026-02-16), and re-introducing `Plain` as an Alert type (Richard, 2026-02-27). All five are architectural, all five live only in Slack scrollback. Station 4's naming drift and Station 2's convention gaps are downstream of exactly this.
- `[verified]` **"Contributing a Component" is still flagged 🚧 Work in progress**, and its only content is a link to the checklist. "Contributing an Icon" sits beside it.
- `[verified]` **The documented processes are not discoverable from where the work happens.** People with the doc one click away ask for it instead: *"I'll need a new icon. What is the process for it?"* (Hannah, 2026-07-29); *"in which column should I put it?"* (Alex, 2026-03-02); *"I noticed a column called 'Final PR Review' that I don't recall seeing before… A bit of guidance on the current workflow would really help"* (Richard, 2026-04-08 — unanswered in channel); *"Is this the right place to ask for PR reviews?"* (Richard, 2026-01-22).
- `[verified]` **Nothing in either code repo points to any of it.** No CONTRIBUTING, no PR template, no ISSUE_TEMPLATE, no CHANGELOG, and no README link to the Notion space, the release process, or the Supernova docs. An engineer working in the repo has no path to the governance that exists.

### Paper vs. reality, summarized

| Documented | Reality |
|---|---|
| Two release tracks, Thursdays for breaking changes | Holds for Figma assets. Code publishes on every merge to `main` with a build-counter version. |
| Bump per semver: major = breaking | Never done on either side. Renames and deprecations ship as `0.0.x` / `0.1.x`. |
| Changelog updated before every release | Design: stalled at 0.0.20 + a malformed `[0.0.0]`. Code: no changelog exists. |
| Announce every release in Slack | Design: consistent and well-formatted. Code: occasional and informal — *"fyi, the Radio Button is released."* |
| Phase 0 governance gate before any new component | No parking record found for any 2026 component; PRs arrive with a Jira key and a Figma link. |
| Decision Log for key decisions with reasoning + stakeholders | One entry added in 4 months; zero engineering decisions, while ≥5 were made in Slack. |

## Score

**🟡 6/10** — up from 4/10 on corrected measurement, not on change.

Against this station's own anchors: *"Process exists and is mostly real, but hygiene slips — changelog gaps, stale issues accumulating, cadence wobbly, contribution path documented but rarely walked."* That is an exact description, with the qualification that the contribution path is documented **for designers** and does not exist **for engineers**.

It is not green because the system still cannot name a breaking change, its release artifacts are untagged, its documented cadence does not govern code, and a 196-day-old draft PR containing the fix for its most-cited gap has never been reviewed.

It is no longer a 4 because the team demonstrably knows how to do this — they have done it well on the design side, in writing, for a year.

- **Not inspected:** the Supernova documentation site (linked as source of truth, not opened); Google Sheets QA matrix behind the Code Components QA page; `lib-egym-design-system` (legacy) governance; whether Phase 0 parking records exist somewhere unlinked.
- **Deviations noted:** none claimed by the team for this station.

## First move — replaces work-order item 7

Item 7 said *"real semver via changesets or semantic-release."* That is still correct and still the highest-value engineering change here. But it is no longer the **first** move, because a cheaper one now has evidence behind it.

**1. Review PR #84 this week.** A contributor wrote your CONTRIBUTING guide 196 days ago and has been waiting since January. Merging it — even imperfect, even needing follow-ups — closes the gap two work orders have flagged, costs an hour, and sends the one signal this channel needs. Do this before writing any new governance doc, and do not write your own version of a document that already exists in your queue.

**2. Then item 7 as written** — changesets or semantic-release, tag releases, unfreeze `mwa-bma-features` off `^0.0.23`. Copy the pattern from `egym-one-token-system`, which already tags and releases properly.

**3. Put required status checks into branch protection.** `contexts` is empty; `strict: true` currently enforces nothing. One settings change, and it is a precondition for work-order items 4 and 5 mattering.

**4. Clear or close the dependabot queue.** 18 PRs, median 135 days, oldest 288. Either batch-merge them or reduce dependabot's scope — a permanently ignored 18-PR queue trains everyone to ignore the PR list, which is where the community contributions are also waiting.

**5. Make the Notion governance reachable from the repo.** A README section linking Release Process, Contributing a Component/Icon, the Decision Log and the Supernova docs. The material exists and engineers cannot find it; four people asked in Slack for processes that were already written.

**6. Log engineering decisions in the Decision Log.** Backfill the five sitting in Slack scrollback (underscore convention, `delegatesFocus`, tooltip slot API, Design vs Technical Props, Alert `Plain`). The database and schema already exist. This is the cheapest fix on the list and it feeds Stations 2, 4 and 9.

**7. Name the review bottleneck as a ritual, not a virtue.** Richard proposed it himself in April — *"Maybe we need a super review session meeting."* Median merge is 2 days; the failure is entirely in the tail, and the tail falls on the product-team engineers whose contributions you most need. A standing 30-minute weekly review slot would have prevented #100's five-month, five-reminder journey.

## Effect on other stations

- **Station 8 (Feedback & adoption, 🔴 3):** should be re-run. Its central evidence — "the feedback channel exists and is empty" — was measured on Jira alone. Nine external contributors, two active Slack channels, a components survey, office hours, and a CoP with a topic-submission funnel are all live feedback surfaces that pass did not see. The adoption findings (legacy systems still shipping, MUI, raw `<input>`) stand unchanged.
- **Station 4 (Shared language, 🟡 6):** the unlogged Slack API decisions are a direct cause of the naming drift recorded there.
- **Station 5 (Testing, 🟡 5):** empty `required_status_checks` means the two config typos are not merely invisible — nothing would block a merge even once they are fixed. Fix both together.

## Station record

```markdown
### Station 7 — Governance & version control: YELLOW (6/10) — was 4/10, corrected on new evidence
- Inspected: both Slack CoP channels in full; GitHub API across 4 team repos (PRs, tags, releases,
  branch protection, file trees); Notion DS space incl. Release Process, contribution checklist,
  Decision Log database, UI Kit changelog
- Evidence level: live (Slack, GitHub, Notion, repo, CI)
- Score change is a measurement correction, not system change: prior passes scored repo-only and
  did not state that Notion/Slack were uninspected.
- Findings:
  - [verified] Substantial documented design-side governance exists and is largely practised:
    two-track release process, migration guides with grace periods, decision log, Phase 0
    contribution gate, CoP + office-hours rituals, template-conforming release comms
  - [verified] Branch protection properly configured (PR + 1 review + code-owner + signed commits
    + enforce_admins) — BUT required_status_checks.contexts is empty; failing CI does not block merge
  - [verified] PR #84 "add contributing guidelines" open as a DRAFT for 196 days, untouched since Jan 22
  - [verified] Zero tags, zero releases; publish.yaml still stamps 0.1.${{ github.run_number }}
  - [verified] 13 open human PRs, median age 98d; 18 dependabot PRs, median 135d, oldest 288d
  - [verified] Median merge 2d but tail is severe and falls on community contributors (#100: 151d,
    5 reminders; #102: 103d; #62: 174d)
  - [verified] Contribution is alive but routed around Jira: 9 external engineers, 19 merged PRs
  - [verified] Documented semver never practised on either side; renames/deprecations ship as patches
  - [verified] UI Kit changelog stalled at 0.0.20 (2026-05-08) with a malformed [0.0.0] entry on top
  - [verified] Decision Log: 13 of 14 entries bulk-created 2026-04-30, 1 added since; zero engineering
    decisions logged while ≥5 architectural decisions were made in Slack
  - [verified] Process bypassed under pressure (self-merge, 2026-04-08) and routed around by a team
    building a local copy in Business-Suite (2026-06-19)
  - [verified] Neither code repo links to any of the governance that exists
- Not inspected: Supernova docs site; QA spreadsheet; legacy repo governance; whether Phase 0
  parking records exist
- Deviations noted: none
- First move: review and merge PR #84 this week — the fix has been in your own queue since January.
```
