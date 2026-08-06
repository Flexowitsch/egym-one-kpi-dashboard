# EGYM One — Design System KPI Dashboard

A glanceable, always-current view of the state of the EGYM One design system, for
management, designers and engineers alike. Published via GitHub Pages and
embeddable in Notion.

Built with the **real design system** — not a lookalike. Components come from the
published `@egym-private/egym-one-design-system-web` package, and every colour,
type step, radius and spacing value resolves to an `--eo-*` token from the
published token system.

---

## What it shows

| Section | Source | Refresh |
| --- | --- | --- |
| Inspection score and ten stations | `inspection/reports/*-inspection.md` | On every build |
| Components shipped in code | GitHub API, contents of the web package | Automatic |
| Open PR ages, dependabot backlog | GitHub API | Automatic |
| Tags and releases | GitHub API | Automatic |
| Community contributors and merge times | GitHub API | Automatic |
| Jira DSC queue | `ds-kpi-data.json` | Manual — needs an Atlassian token |
| BMA build plan | `ds-kpi-data.json` | Manual — needs a Notion token |
| Core set size, roadmap, the ask | `ds-kpi-data.json` | Manual, reviewed |

Anything not automatically refreshed is labelled as such on the page. The
dashboard does not present stale figures as live ones.

---

## The inspection is the spine

The headline number is the design system multi-point inspection score. It is not
re-typed into this repo — `scripts/read-inspection.mjs` parses the station matrix
out of the actual report markdown in `inspection/reports/`, so the dashboard
cannot drift from the inspection.

To publish a new inspection: drop the report into `inspection/reports/` using the
`YYYY-MM-DD-inspection.md` naming convention, and push. The score, the station
rail, the trend line and the per-station notes all follow.

Single-station re-inspections can live alongside; only files matching
`YYYY-MM-DD-inspection.md` are parsed, because only a full pass carries the matrix.

---

## Running it

```bash
npm install          # needs Artifactory auth in ~/.npmrc for the DS packages
npm run vendor       # bundle the design system into docs/vendor/  (local only)
npm run refresh      # pull live metrics from the GitHub API       (needs GITHUB_TOKEN)
node scripts/read-inspection.mjs ./inspection
npm run build        # render docs/index.html
npm run dev          # serve it at http://localhost:4173
```

`docs/` is the GitHub Pages root. It is committed, so Pages needs no build step
and the site keeps working even if a refresh fails.

### Why the design system is vendored

The packages live on a private Artifactory registry that GitHub Actions cannot
reach. `npm run vendor` bundles the components and copies the published token
stylesheet into `docs/vendor/`, which is committed. That means:

- the published site never needs registry access,
- the design system version is pinned and visible on the page footer,
- **bumping the design system is a deliberate local step**: change the version in
  `package.json`, run `npm install && npm run vendor`, and commit.

---

## Automation

`.github/workflows/refresh.yml` runs on weekday mornings and on push. It refreshes
the GitHub-sourced metrics, re-reads the inspection reports, rebuilds, commits any
change, and deploys to Pages.

**Required secret:** `DS_READ_TOKEN` — a PAT with read access to
`egym/lib-egym-one-design-system`. The default `GITHUB_TOKEN` cannot see that
repo, because it is in a different organisation. Without the secret the workflow
still rebuilds and deploys, using the last committed data.

---

## Embedding in Notion

Paste the Pages URL into a Notion page and choose **Embed**. The dashboard is a
plain static page with no authentication, so it renders inside the iframe.

---

## Notes on design system usage

Some deliberate deviations, all visible in the source comments:

- **Charts, meters and progress bars are hand-built from tokens.** The system has
  no chart or progress component in code yet — `progress-bar` is DSC-100, still in
  the Ready-for-Development queue. They are written so they can be swapped for the
  real component when it ships.
- **Links are native `<a>` elements, not `<eo-link>`.** The shipped `eo-link`
  renders no anchor, is not keyboard reachable and does not announce as a link
  (WCAG 4.1.2 / 2.1.1) — DSC-202. Using it here would have shipped an accessibility
  defect into a page management reads.
- **`.card-body` sets `width: 100%`.** `eo-card`'s shadow container uses
  `align-items: flex-start`, so slotted content shrinks to its own width rather
  than filling the card. Worth fixing upstream — that container wants
  `align-items: stretch`.
- **No `tabular-nums` on identifiers or version strings.** In Helvetica Now Display
  the tabular figure feature widens hyphens and periods, rendering `DSC-100` as
  `DSC - 100` and `0.1.25` as `0 . 1 . 25`.
- **Light appearance only.** The token system's `.dark` block is empty — dark mode
  is deliberate scaffolding in the token architecture, not a shipped feature.

---

## Layout

```
ds-kpi-data.json        the data the page renders from
inspection/reports/     inspection reports, parsed for station scores
src/dashboard.css       token-driven styles
scripts/
  vendor-ds.mjs         bundle the design system into docs/vendor/
  read-inspection.mjs   parse station scores out of the reports
  refresh-data.mjs      pull live metrics from the GitHub API
  build.mjs             render docs/index.html
docs/                   GitHub Pages root (committed)
```
