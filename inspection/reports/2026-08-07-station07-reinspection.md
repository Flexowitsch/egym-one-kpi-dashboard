# Station 7 — Governance & version control: re-inspection

_Single station · 2026-08-07 · evidence gathered live from Notion and the GitHub API_
_Prior: 2026-08-03 (4/10) · 2026-08-05 (6/10) · 2026-08-06 (6/10)_

---

## Score: 🟡 **6/10** — unchanged

Nothing shipped on either side since 6 August. What did change is the amount of
evidence: this pass read the branch protection object, the CODEOWNERS file, the
workflow set, the published version scheme and the Decision Log's actual
contents rather than inferring any of them. Two findings moved in each
direction and cancelled out.

**Newly credited.** The repo has more governance machinery than earlier passes
gave it: `CODEOWNERS`, `dependabot.yml`, eight workflows including a
`publish.yaml`, and branch protection that does require a review.

**Newly found.** The published version is not traceable to anything, the
Decision Log has been quiet for seven weeks, and nothing has merged to `main`
in fourteen days.

---

## The shape of the problem, in one line

**The design side has a release process. The code side has a publish pipeline.**
Those are not the same thing, and the gap between them is this station's score.

---

## Design side — `[verified]`, read from Notion 2026-08-07

| Process | State |
| --- | --- |
| Release Process — Design Assets | **Strong.** Two tracks (patch ships on merge, scheduled batches to Thursdays), four mandatory steps, a comms checklist, and a CoP walkthrough obligation for scheduled releases |
| Decision Log | **Real, and used** — proper schema (Date, Area, Summary, Reasoning, Impacted files, Stakeholders, Status) with 14+ substantive entries. **Newest entry 15 June — seven weeks quiet** |
| Contribution | Three routes documented: Contributing an Icon, Contributing a Component, Composability — build now, promote later |
| Token governance | Component Tokens Guideline + Token System Update Push |
| Quality gate | Code Components Quality Assurance |
| Collaboration | EGYM One Design Developer Collaboration Flow |
| Operating Principles | Present |
| Figma Branching & Merging | **Still a proposal.** Not adopted, so multi-person work on a library file has no agreed model |

This is a genuinely well-governed design practice. The release process in
particular is better than most in-house systems have — it names the two tracks,
says what qualifies for each, and attaches comms to both.

---

## Code side — `[verified]`, GitHub API 2026-08-07

| Check | Result |
| --- | --- |
| Git tags | **0** |
| GitHub releases | **0** |
| `CHANGELOG.md` | **Absent** |
| `CONTRIBUTING.md` on `main` | **Absent** — it is PR #84, still an open draft at **198 days** |
| `CODEOWNERS` | Present ✓ |
| `dependabot.yml` | Present ✓ |
| Workflows | 8, including `publish.yaml` ✓ |
| Branch protection — reviews | 1 required, strict up-to-date ✓ |
| Branch protection — status checks | **`contexts: []`** — an empty array. A red build satisfies protection |
| `package.json` version | **`0.0.0`**, published as `0.1.25` |
| Open PRs | 12; oldest non-draft 23 days; two drafts at 100 and 198 days |
| Last merge to `main` | **2026-07-24 — 14 days ago** |

### The version finding, stated plainly

`packages/egym-one-design-system-web/package.json` carries `0.0.0`. The
published artefact is `0.1.25`. The number is injected by CI, which means it is
a **build counter, not a version**. There is no tag, no release and no changelog
behind it.

The consequence is concrete: a consumer on `0.1.20` cannot answer *what changed
by moving to `0.1.25`* from any artefact this team produces. Not from the repo,
not from GitHub, not from npm. The only way to find out is to read five months
of merged pull requests.

That is also why the design side's semver rule — patch / minor / major, written
into the release process — has no counterpart that consumers can act on.

---

## What is missing — against normal practice for a system this size

Ordered by how much each one costs today, not by effort.

### 1. Release notes for code — **the biggest single gap**
No tags, no releases, no changelog. Everything the design-side release process
does well is undone at the point where the code reaches a consumer.

*Smallest viable version:* tag every publish, generate release notes from the PR
titles already merged, done in the existing `publish.yaml`.

### 2. A merge gate that gates
`required_status_checks.contexts` is empty. Protection asks for a review and
then accepts any build result. Combined with **DSC-214** — where the test run
resolves zero projects and exits green — the repository currently has two
independent reasons why a broken change can reach `main`.

*Smallest viable version:* name the build and test jobs in `contexts`. One
settings change.

### 3. Deprecation policy for code
The design side commits to a six-week deprecation grace period. There is no code
equivalent, so a renamed property or removed component has no agreed notice.

### 4. Contribution intake for code
The design side has three documented routes. The code side has a CONTRIBUTING
guide that has been a draft since 20 January.

### 5. Engineering decisions are not logged
The Decision Log covers design decisions only. Architectural choices — Lit over
React, the submodule token pipeline, the `v0.0.24` pin — live in people's heads
and in PR comments.

*Smallest viable version:* an `docs/adr/` folder in the repo. Same discipline as
the Decision Log, on the side that currently has none.

### 6. The Decision Log has gone quiet
Seven weeks without an entry, in a period that included property renames, icon
documentation work and a token architecture review. A log that stops being
written stops being trustworthy — future readers cannot tell "no decisions" from
"nobody wrote them down".

### 7. Figma branching is unadopted
Still a proposal. Until it lands, concurrent work on a library file has no
agreed model, which is a governance gap on the design side — the one place this
station is otherwise strong.

### 8. No stated response commitment
Nothing documents how quickly a request, bug or contribution gets a first
response. Consumers cannot plan around the system.

---

## What would move this station

| To reach | Requires |
| --- | --- |
| **7** | Tags on every publish, and `required_status_checks.contexts` populated |
| **8** | A changelog consumers can read, plus CONTRIBUTING merged |
| **9** | A code-side deprecation policy and engineering ADRs, both practised for a full release cycle |

Two of the four items behind a 7 are settings changes rather than projects.

---

## The honest summary

This is not a team that does not know how to govern a design system — the
Notion side proves the opposite, in detail. It is a system where the governance
that exists stops at the boundary between design and code.

The single most revealing artefact is the version number: `0.0.0` in the
repository, `0.1.25` on the registry, and nothing anywhere that connects the two
to a set of changes.

---

**Owner:** Felix · **Method:** Notion read + GitHub API, 2026-08-07 ·
**Re-inspect:** on change, not on calendar
