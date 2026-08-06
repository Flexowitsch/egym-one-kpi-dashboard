/**
 * Renders docs/index.html from ds-kpi-data.json.
 *
 * Structure: a glanceable Overview, then tabs for each area of depth. Static
 * output, so GitHub Pages serves it with no runtime fetching and no secrets in
 * the browser.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { radar, donut, trend, stationBars, splitMatrix, changeList, pipeline } from '../src/charts.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, 'ds-kpi-data.json'), 'utf8'));
const css = readFileSync(resolve(root, 'src/dashboard.css'), 'utf8');
const dsInfo = existsSync(resolve(root, 'docs/vendor/ds-version.json'))
  ? JSON.parse(readFileSync(resolve(root, 'docs/vendor/ds-version.json'), 'utf8'))
  : { version: 'unvendored', tokenCount: 0, components: [] };

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
const daysSince = (iso, from) => Math.round((new Date(from) - new Date(iso)) / 86400000);

const chip = (t, intent = 'neutral') => `<eo-label intent="${intent}" size="small">${esc(t)}</eo-label>`;
// Real design system components throughout: eo-card paints every card surface,
// eo-label every chip, eo-button every tab, eo-divider every rule. The only
// hand-built things left are the charts, because the system has no chart
// component in code yet (DSC-100).
const tile = (cls, inner) => `<eo-card class="tile ${cls}"><div class="tile-in">${inner}</div></eo-card>`;
// Split a display value into a number and its surrounding text so the count-up
// animation keeps the unit: "41%" counts to 41 and still renders the percent.
const countAttrs = (v) => {
  const m = String(v).match(/^([\d]+(?:\.[\d]+)?)(.*)$/);
  if (!m) return '';
  return ` data-count="${m[1]}" data-tpl="__${esc(m[2])}"`;
};
const stat = (v, k, t = '', tone = '', small = false) =>
  `<div class="stat ${tone}"><div class="stat-in"><div class="v ${
    small ? 'small' : ''
  }"${countAttrs(v)}>${esc(v)}</div><p class="k">${esc(k)}</p>${
    t ? `<p class="t">${esc(t)}</p>` : ''
  }</div></div>`;
const facts = (rows) =>
  `<ul class="facts">${rows
    .map(([k, v, tone = '']) => `<li><span class="k">${esc(k)}</span><span class="v ${tone}">${esc(v)}</span></li>`)
    .join('')}</ul>`;
const bars = (obj, tone = 'neutral') => {
  const max = Math.max(...Object.values(obj));
  return `<div class="bars">${Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([k, v]) => `<div class="bar-row"><span class="label">${esc(k)}</span>
      <span class="bar-track ${tone}"><span style="width:${pct(v, max)}%"></span></span>
      <span class="count">${v}</span></div>`
    )
    .join('')}</div>`;
};
// Every band carries the date its numbers were taken, and whether that number
// refreshes on its own or was last read by hand.
const fmt = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const stamp = (date, live = true) =>
  `<p class="stamp"><span class="dot ${live ? 'live' : 'manual'}"></span>Updated ${esc(fmt(date))} · ${
    live ? 'refreshes automatically' : 'read by hand'
  }</p>`;

const bandHead = (eyebrow, title, sub, date, live = true) =>
  `<div class="band-head"><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${
    sub ? `<p>${sub}</p>` : ''
  }${date ? stamp(date, live) : ''}</div>`;

const { coverage, jira, bmaBuildPlan, communityVelocity, ask, kpis, roadmap, meta, inspection, designVsCode, accessibility, designOpen, provenance, timeline } = data;
const rfd = jira.readyForDevelopment;
const cv = communityVelocity;
const gap = inspection ? inspection.potentialTotal - inspection.shippedTotal : 0;
const st = (n) => inspection?.stations.find((s) => s.n === n);
const designSolid = designVsCode ? designVsCode.dimensions.filter((d) => d.design.state === 'in-place').length : 0;
const codeAbsent = designVsCode ? designVsCode.dimensions.filter((d) => d.code.state === 'absent').length : 0;
const designAbsent = designVsCode ? designVsCode.dimensions.filter((d) => d.design.state === 'absent').length : 0;
const codeComplete = designVsCode ? designVsCode.dimensions.filter((d) => d.code.state === 'in-place').length : 0;
const dimN = designVsCode ? designVsCode.dimensions.length : 0;

/* ══════════════════════════════════════════════════════════════ OVERVIEW ═══ */
const overview = `
<section class="hero">
  <p class="eyebrow">Design system health · inspection ${esc(inspection?.date ?? meta.asOf)}</p>
  <h1>The state of EGYM One,<br>on one screen</h1>
  <p class="standfirst">One number for the system, ten stations behind it, and the delivery data that explains why it sits where it does.</p>
  <div class="score-hero">
    <span class="n"${inspection ? ` data-count="${inspection.shippedTotal}" data-tpl="__"` : ''}>${
      inspection?.shippedTotal ?? '—'
    }</span><span class="d">/100</span>
  </div>
  <p class="score-sub"><b>${inspection?.reds ?? 0}</b> red · <b>${inspection?.yellows ?? 0}</b> yellow · <b>${
    inspection?.greens ?? 0
  }</b> green${gap > 0 ? ` · <b>+${gap}</b> available without new work` : ''}</p>
  <div class="pill-row">
    ${chip(`${coverage.inCode} of ${coverage.coreSetTotal} core components in code`, coverage.inCodePct >= 50 ? 'warning' : 'negative')}
    ${chip(`${rfd.count} tickets ready, unstarted`, 'negative')}
    ${chip(`${cv.gitTags} tagged releases`, 'negative')}
    ${chip(`${cv.externalContributors} external contributors`, 'positive')}
  </div>
</section>

<section class="band tight">
  <div class="stat-row">
    ${stat(`${coverage.inCodePct}%`, 'Core coverage in code', `${coverage.inCode} of ${coverage.coreSetTotal}`, coverage.inCodePct >= 50 ? 'warn' : 'bad')}
    ${stat(rfd.count, 'Ready for development', `${rfd.unassigned} unassigned`, 'bad')}
    ${stat(`${cv.openHumanPRs.medianAgeDays}d`, 'Median open PR age', `${cv.openHumanPRs.count} open`, 'bad')}
    ${stat(cv.mergedCommunityPRs, 'Community PRs merged', `${cv.externalContributors} contributors`, 'good')}
    ${stat(`${cv.medianTimeToMergeDays}d`, 'Median time to merge', 'when review happens', 'good')}
  </div>
</section>

<section class="band">
  ${bandHead('Ten stations', 'Where the system is strong, and where it is not', 'Scored against the design system multi-point inspection. The dashed ring is a perfect score — the gap between the shape and the ring is the work left.', inspection?.date)}
  <div class="bento">
    ${tile('span-7', radar(inspection?.stations ?? []))}
    ${tile(
      'span-5',
      `<p class="eyebrow">Station by station</p>
       ${stationBars(inspection?.stations ?? [])}
       <p class="tile-text">A lighter bar behind a score is where that station lands if finished work is promoted into main.</p>`
    )}
  </div>
</section>

<section class="band tight">
  <div class="bento">
    ${tile(
      'span-4',
      `<p class="eyebrow">Trend</p>
       <h3>Three inspections, four points</h3>
       ${trend(inspection?.trend ?? [], { labels: ['3 Aug', '5 Aug'] })}
       <p class="tile-text">Almost none of that movement is improvement — six stations moved because evidence surfaces were inspected for the first time.</p>`
    )}
    ${tile(
      'span-4',
      `<p class="eyebrow">Coverage</p>
       <h3>Core set built in code</h3>
       ${donut(coverage.inCode, coverage.coreSetTotal, {
         label: `${coverage.inCodePct}%`,
         sub: `${coverage.inCode} of ${coverage.coreSetTotal}`,
         tone: coverage.inCodePct >= 50 ? 'warn' : 'bad',
       })}`
    )}
    ${tile(
      'span-4',
      `<p class="eyebrow">Where the gap is</p>
       <h3>Design leads, code follows</h3>
       ${facts([
         ['Absent on the design side', `${designAbsent} of ${dimN}`, 'good'],
         ['Complete on the code side', `${codeComplete} of ${dimN}`, 'bad'],
         ['Solid on design', `${designSolid} of ${dimN}`, 'good'],
         ['Absent in code', `${codeAbsent} of ${dimN}`, 'bad'],
       ])}
       <p class="tile-text">Across eight dimensions, <b>nothing is absent on the design side and nothing is complete on the code side</b>. The specification, the governance and the craft exist. Shipping them does not.</p>`
    )}
  </div>
</section>

<section class="band">
  ${bandHead(
    'Two sides, two speeds',
    'The design system is in good shape. Getting it into code is the work.',
    'Each row attributes the inspection findings to the side of the system they belong to. Every cell rests on a measurement, not an opinion — including the two where the design side is only partial.',
    '2026-08-06'
  )}
  <div class="bento">
    ${tile(
      'span-12',
      `<div class="legend">
         <span><span class="cell in-place"><span></span></span> In place</span>
         <span><span class="cell partial"><span></span></span> Partial</span>
         <span><span class="cell absent"><span></span></span> Absent</span>
       </div>
       ${splitMatrix(designVsCode?.dimensions ?? [])}`
    )}
    ${tile(
      'span-12',
      `<p class="eyebrow">In fairness — what is open on our side</p>
       <h3>Strong, not spotless</h3>
       <p class="tile-text">${esc(designOpen?.note ?? '')}</p>
       <ul class="openlist">${(designOpen?.items ?? [])
         .map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`)
         .join('')}</ul>`
    )}
  </div>
</section>

<section class="band tight">
  ${bandHead('Progress', 'What actually moved', 'Station scores between the last two full inspections. Six of ten did not move at all — that is the finding, not the exceptions.', inspection?.date)}
  <div class="bento">
    ${tile('span-7', changeList(inspection?.stations ?? []))}
    ${tile(
      'span-5',
      `<p class="eyebrow">Component pipeline</p>
       <h3>${coverage.coreSetTotal - coverage.inCode - coverage.readyForRelease.length - coverage.inDevelopment.length} of ${coverage.coreSetTotal} not started</h3>
       ${pipeline([
         { label: 'In code', value: coverage.inCode, tone: 'good' },
         { label: 'Ready for release', value: coverage.readyForRelease.length, tone: 'info' },
         { label: 'In development', value: coverage.inDevelopment.length, tone: 'warn' },
         {
           label: 'Not started',
           value: coverage.coreSetTotal - coverage.inCode - coverage.readyForRelease.length - coverage.inDevelopment.length,
           tone: 'absent',
         },
       ])}
       ${facts([
         ['In code', coverage.inCode, 'good'],
         ['Ready for release', coverage.readyForRelease.length, 'good'],
         ['In development', coverage.inDevelopment.length, 'warn'],
         ['Not started', coverage.coreSetTotal - coverage.inCode - coverage.readyForRelease.length - coverage.inDevelopment.length, 'bad'],
       ])}
       <p class="tile-text">Design coverage for Wellpass is at ${coverage.designCoverageWellpassPct}%. The pipeline above is the code side of the same set.</p>`
    )}
  </div>
</section>

<section class="band">
  ${bandHead(
    'Elapsed',
    'How long these have been true',
    'Each of these was reported in writing on the date shown. None has been closed.',
    provenance.generatedAt
  )}
  <div class="elapsed">
    ${timeline.elapsed
      .map(
        (e) => `<div class="el-item">
          <div class="el-days">${e.days}<span> days</span></div>
          <p class="el-what">${esc(e.what)}</p>
          <p class="el-since">Since ${esc(fmt(e.since))}${e.inspections ? ` · reported in ${e.inspections} inspections` : ''}${e.note ? ` · ${esc(e.note)}` : ''}</p>
        </div>`
      )
      .join('')}
  </div>
  <p class="tile-text" style="margin-top:var(--eo-dimension-24);text-align:center;max-width:70ch;margin-left:auto;margin-right:auto">
    In the ${timeline.codeSideChanges.days} days and ${timeline.codeSideChanges.inspections} inspections since the baseline: ${esc(timeline.codeSideChanges.changes)}
  </p>
</section>

<section class="band tight">
  ${bandHead('Provenance', 'Where every number on this page comes from', 'Nothing here is undated, and nothing is an estimate unless it says so.', provenance.generatedAt)}
  <div class="bento">
    ${tile(
      'span-12',
      `<div class="table-scroll"><table class="prov">
        <thead><tr><th>Measurement</th><th>Updated</th><th>How</th></tr></thead>
        <tbody>${provenance.measurements
          .map(
            (m) => `<tr><td>${esc(m.what)}</td>
              <td class="when">${esc(fmt(m.date))} ${chip(m.live ? 'auto' : 'manual', m.live ? 'positive' : 'warning')}</td>
              <td class="how">${esc(m.method)}</td></tr>`
          )
          .join('')}</tbody>
      </table></div>`
    )}
  </div>
</section>

`;


/* ══════════════════════════════════════════════════════════════ COVERAGE ═══ */
const coverageTab = `
<section class="band">
  ${bandHead('Station 01 · red', 'Coverage &amp; gaps', esc(st(1)?.note ?? ''))}
  <div class="bento">
    ${tile(
      'span-5',
      `<p class="eyebrow">Built</p>
       <h3>${coverage.inCode} of ${coverage.coreSetTotal} core components</h3>
       ${donut(coverage.inCode, coverage.coreSetTotal, { label: `${coverage.inCodePct}%`, sub: 'in code', tone: 'bad' })}
       <p class="tile-text">${esc(coverage.coreSetSource)}</p>`
    )}
    ${tile(
      'span-7',
      `<p class="eyebrow">Shipped in code</p>
       <ul class="chips">${coverage.codedComponents.map((c) => `<li>${chip(c, 'positive')}</li>`).join('')}</ul>
       <p class="eyebrow" style="margin-top:var(--eo-dimension-8)">Ready for release</p>
       <ul class="chips">${coverage.readyForRelease.map((c) => `<li>${chip(c, 'info')}</li>`).join('')}</ul>
       <p class="eyebrow" style="margin-top:var(--eo-dimension-8)">In development</p>
       <ul class="chips">${coverage.inDevelopment.map((c) => `<li>${chip(c, 'warning')}</li>`).join('')}</ul>`
    )}
    ${tile(
      'span-12',
      `<p class="eyebrow">Why this stays red</p>
       <h3>The gap is concentrated on the single most-used control in any system</h3>
       <p class="tile-text">The yellow anchor requires the core set to be “mostly present”. A system whose consumers write <b>36 raw &lt;input&gt; elements</b> across five repositories does not have its core set present. <b>input-text, input-dropdown, textarea and toggle</b> all have full Figma property contracts and no code.</p>
       <p class="tile-text">The slot is not empty — it is occupied by a mature, documented, react-hook-form-compatible library. A minimal component will become the fifth option in those applications rather than replacing anything.</p>`
    )}
  </div>
</section>`;

/* ═══════════════════════════════════════════════════════════════ QUALITY ═══ */
const qualityTab = `
<section class="band">
  ${bandHead('Stations 02 · 03 · 05', 'Practices, accessibility and testing', 'Craft is good where it is enforced, and drifts where nothing checks it.')}
  <div class="stat-row">
    ${stat(st(2)?.score ?? '—', 'Best practices', 'of 10', 'warn')}
    ${stat(st(3)?.score ?? '—', 'Accessibility', 'of 10', 'warn')}
    ${stat(st(5)?.score ?? '—', 'Testing & validation', 'of 10', 'bad')}
    ${stat(st(4)?.score ?? '—', 'Shared language', 'of 10', 'warn')}
  </div>
</section>


<section class="band">
  ${bandHead(
    'Accessibility',
    'Specified, measured, and passing — on the design side',
    'The design system defines WCAG 2.2 AA, and every colour pair it governs measurably passes. The code that implements it has never run a single accessibility check.',
    accessibility.measuredAt
  )}
  <div class="stat-row">
    ${stat(`${accessibility.designSide.contrast.aaPass}/20`, 'Token pairs passing WCAG AA', 'the other two are disabled text, which WCAG exempts', 'good')}
    ${stat(`${accessibility.designSide.contrast.aaaPass}/20`, 'Reaching AAA', 'well beyond the requirement', 'good')}
    ${stat(`${accessibility.designSide.focusStates.pct}%`, 'Stateful components with a focus state', `${accessibility.designSide.focusStates.withFocusState} of ${accessibility.designSide.focusStates.statefulComponents}`, 'good')}
    ${stat(accessibility.codeSide.axeAssertions, 'Accessibility assertions in code', 'across the entire repository', 'bad')}
  </div>
</section>

<section class="band tight">
  <div class="bento">
    ${tile(
      'span-7',
      `<p class="eyebrow">Design side · measured</p>
       <h3>Every governed colour pair passes</h3>
       <div class="table-scroll"><table>
         <thead><tr><th>Pair</th><th>Ratio</th><th>Level</th></tr></thead>
         <tbody>${accessibility.designSide.contrast.highlights
           .map(([pair, r, level]) => `<tr><td>${esc(pair)}</td><td class="key">${esc(r)}</td><td>${chip(level, level === 'AAA' ? 'positive' : 'info')}</td></tr>`)
           .join('')}</tbody>
       </table></div>
       <p class="tile-text">${esc(accessibility.designSide.contrast.exemptNote)}</p>
       <p class="tile-text"><b>One caveat, stated plainly.</b> ${esc(accessibility.designSide.contrast.caveat)}</p>`
    )}
    ${tile(
      'span-5',
      `<p class="eyebrow">Code side · unverified</p>
       <h3>Nothing has ever been checked</h3>
       ${facts([
         ['axe assertions', accessibility.codeSide.axeAssertions, 'bad'],
         ['a11y gate', "test: 'todo'", 'bad'],
         ['Storybook a11y tests ever run', 'No', 'bad'],
         ['Components failing WCAG', accessibility.codeSide.componentsFailingWcag, 'bad'],
       ])}
       <p class="tile-text">${esc(accessibility.codeSide.rootCause)}</p>`
    )}
    ${tile(
      'span-7',
      `<p class="eyebrow">The gate that produced those numbers</p>
       <h3>Accessibility is a required phase, not a review note</h3>
       <p class="tile-text">${esc(accessibility.designSide.gate)}</p>
       <p class="tile-text"><b>Already moving on the code side.</b> ${esc(accessibility.codeSide.inProgress)}</p>`
    )}
    ${tile(
      'span-5',
      `<p class="eyebrow">In fairness</p>
       <h3>One item is ours</h3>
       <p class="tile-text">${esc(accessibility.designSide.open)}</p>
       <p class="tile-text">${esc(accessibility.designSide.focusStates.note)}</p>`
    )}
  </div>
</section>
<section class="band tight">
  <div class="bento">
    ${tile(
      'span-6',
      `<p class="eyebrow">Station 02 · best practices</p>
       <h3>One component is the whole problem</h3>
       <p class="tile-text">Of 35 component stylesheets, <b>34 are .scss and exactly one is .css</b>. Of 15 components, 14 use reflected properties — <b>eo-link uses none</b>, and renders no anchor element at all.</p>
       <p class="tile-text">Figma craft is the counterweight, and it is now measured across the full population rather than sampled: <b>0.54% generic layer names across all 109,402 layers</b>, <b>zero detached instances</b>, <b>96% of fills and 100% of strokes bound</b>, and <b>zero local styles</b> left anywhere. The conventions exist. Nothing enforces them in code.</p>`
    )}
    ${tile(
      'span-6',
      `<p class="eyebrow">Station 03 · accessibility</p>
       <h3>Real engineering, gate still off</h3>
       ${facts([
         ['axe assertions in the repo', 0, 'bad'],
         ['a11y gate', "test: 'todo'", 'bad'],
         ['Open contrast reports', '1 unanswered', 'bad'],
       ])}
       <p class="tile-text">delegatesFocus is now the house pattern, the tooltip enforces focusable anchors, and PR #166 adds the first behavioural focus-ring test — approved, unmerged. Meanwhile a reported brand-on-dark AA contrast failure has sat unanswered since 31 July.</p>`
    )}
    ${tile(
      'span-12',
      `<p class="eyebrow">Station 05 · testing</p>
       <h3>Two characters, and a branch protection setting</h3>
       <p class="tile-text">vitest.config.ts points at <b>two paths that do not exist</b> — <code>vitest.config.storybook/ts</code> and <code>packages/eguym-…</code>. The correctly named files are right there. <code>npm run storybook:test</code> resolves zero projects and passes silently, so every Storybook test, including every accessibility check, has never run. Found in four consecutive inspections.</p>
       <p class="tile-text">Branch protection compounds it: <code>required_status_checks</code> is strict with an <b>empty contexts array</b>, so a pull request with a red build satisfies protection today.</p>`
    )}
  </div>
</section>`;

/* ══════════════════════════════════════════════════════════════ DELIVERY ═══ */
const queueRows = rfd.tickets
  .map((t) => ({ ...t, age: daysSince(t.created, meta.asOf) }))
  .sort((a, b) => b.age - a.age)
  .map(
    (t) => `<tr><td class="key">${esc(t.key)}</td><td>${esc(t.title)}</td>
      <td>${chip(t.type, t.type === 'Bug' ? 'negative' : 'neutral')}</td>
      <td class="age ${t.age > 180 ? 'stale' : ''}">${t.age} d</td></tr>`
  )
  .join('');

const deliveryTab = `
<section class="band">
  ${bandHead('Delivery', 'A queue waiting on capacity, not decisions', 'Everything in “Ready for Development” already has a spec and a priority.', meta.asOf, false)}
  <div class="bento">
    ${tile('span-6', `<p class="eyebrow">All open DSC issues</p><h3>${jira.openIssuesTotal} open</h3>${bars(jira.byStatus)}`)}
    ${tile(
      'span-6',
      `<p class="eyebrow">The queue engineers would drain</p>
       <h3>${rfd.count} ready, ${rfd.unassigned} unassigned</h3>
       ${facts([
         ['Waiting since Oct 2025', rfd.waitingSinceOct2025, 'bad'],
         ['Currently in development', jira.byStatus['In Development'] ?? 0],
       ])}
       <p class="tile-text">This is the single number the ask is built on.</p>`
    )}
    ${tile('span-12', `<p class="eyebrow">Oldest first · flagged past 180 days</p>
      <div class="table-scroll"><table>
        <thead><tr><th>Key</th><th>Title</th><th>Type</th><th>Age</th></tr></thead>
        <tbody>${queueRows}</tbody></table></div>`)}
    ${tile('span-6', `<p class="eyebrow">BMA build plan</p><h3>${bmaBuildPlan.itemsTotal} items</h3>${bars(bmaBuildPlan.byStatus)}`)}
    ${tile(
      'span-6',
      `<p class="eyebrow">Remaining backlog by impact</p>
       ${bars(bmaBuildPlan.backlogImpact, 'positive')}
       <p class="tile-text">${esc(bmaBuildPlan.backlogNote)}</p>`
    )}
  </div>
</section>`;

/* ════════════════════════════════════════════════════════════ GOVERNANCE ═══ */
const governanceTab = `
<section class="band">
  ${bandHead('Stations 06 · 07 · 09 · 10', 'Governance, orchestration and agent readiness', 'The written governance is good. Most of it is invisible from where engineers work.')}
  <div class="stat-row">
    ${stat(st(7)?.score ?? '—', 'Governance', 'of 10', 'warn')}
    ${stat(st(6)?.score ?? '—', 'Orchestration', `→ ${st(6)?.potential ?? '—'} if promoted`, 'warn')}
    ${stat(st(9)?.score ?? '—', 'Machine-readable docs', `→ ${st(9)?.potential ?? '—'} if promoted`, 'warn')}
    ${stat(st(10)?.score ?? '—', 'Agent access', `→ ${st(10)?.potential ?? '—'} if promoted`, 'bad')}
  </div>
</section>

<section class="band tight">
  <div class="bento">
    ${tile(
      'span-6',
      `<p class="eyebrow">Community</p>
       <h3>Contribution is not the bottleneck</h3>
       ${facts([
         ['External contributors', cv.externalContributors, 'good'],
         ['Merged community PRs', cv.mergedCommunityPRs, 'good'],
         ['Median time to merge', `${cv.medianTimeToMergeDays} d`, 'good'],
       ])}
       <p class="tile-text">Nine engineers outside the design system team have landed code. The channel is alive — Jira is the dead one.</p>`
    )}
    ${tile(
      'span-6',
      `<p class="eyebrow">…but the tail is</p>
       <h3>Review capacity is</h3>
       ${facts([
         ['Worst merges', `${cv.timeToMergeTailDays.join(', ')} d`, 'bad'],
         ['Open human PRs', `${cv.openHumanPRs.count} · median ${cv.openHumanPRs.medianAgeDays} d`, 'bad'],
         ['Dependabot backlog', `${cv.dependabotPRs.count} · oldest ${cv.dependabotPRs.oldestDays} d`, 'bad'],
         ['CONTRIBUTING draft', `${cv.contributingPRDraftAgeDays} d open`, 'bad'],
       ])}`
    )}
    ${tile(
      'span-12',
      `<p class="eyebrow">Release governance</p>
       <h3>${cv.gitTags} tags. ${cv.gitHubReleases} releases. No changelog.</h3>
       <p class="tile-text">The publish workflow stamps a CI build counter as the version, so the system <b>cannot express a breaking change</b> — which means no migration can be announced. The token system repository, same team and same org, already tags and releases properly.</p>
       <p class="tile-text">${esc(cv.evidence.teamRoutedAround)} — ${esc(cv.evidence.processBypassed)}</p>`
    )}
    ${tile(
      'span-12',
      `<p class="eyebrow">The ${gap}-point gap</p>
       <h3>Finished work nobody can reach</h3>
       <p class="tile-text">Stations 06, 09 and 10 are held down almost entirely by an AI-readiness repository sitting in a playground organisation that is not linked from either design system repo, from Notion, or from Slack. It holds a validated 3,061-token <code>design.md</code>, 127 machine-readable component contracts against a published JSON Schema, a working design-to-token drift detector, and an agent skill wired for both Claude Code and Copilot. Both of its validators pass, offline, in under a second.</p>
       <p class="tile-text">Promoting it is a move, not a build. It is the largest single score movement available.</p>`
    )}
  </div>
</section>`;

/* ═══════════════════════════════════════════════════════════════ ROADMAP ═══ */
const phase = (p, span) => {
  const tickets = p.tickets ?? [...(p.engineer1_structureNavigation ?? []), ...(p.engineer2_contentForms ?? [])];
  return tile(
    span,
    `<p class="eyebrow">Weeks ${esc(p.weeks)}</p>
     <h3>${esc(p.title)}</h3>
     <ul class="ticket-list">${tickets.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
     ${p.extras ? `<p class="tile-text">${p.extras.map(esc).join(' · ')}</p>` : ''}`
  );
};

const roadmapTab = `
<section class="band">
  ${bandHead('Twelve weeks', 'What two engineers would do', esc(ask.rotationModel))}
  <div class="bento">
    ${phase(roadmap.phase1, 'span-4')}
    ${phase(roadmap.phase2, 'span-4')}
    ${phase(roadmap.phase3, 'span-4')}
  </div>
</section>

<section class="band tight">
  ${bandHead('Targets', 'How we would know it worked')}
  <div class="stat-row">
    ${kpis
      .map((k) =>
        stat(
          k.baseline === null ? '—' : String(k.baseline),
          k.label,
          `→ ${k.target}${k.targetDetail ? ` · ${k.targetDetail}` : ''}`,
          k.id === 'core-coverage' ? 'bad' : k.id === 'ready-queue' ? 'bad' : '',
          String(k.baseline).length > 3
        )
      )
      .join('')}
  </div>
</section>`;

/* ══════════════════════════════════════════════════════════════ DOCUMENT ═══ */
const TABS = [
  ['overview', 'Overview', overview],
  ['coverage', 'Coverage', coverageTab],
  ['quality', 'Quality', qualityTab],
  ['delivery', 'Delivery', deliveryTab],
  ['governance', 'Governance', governanceTab],
  ['roadmap', 'Roadmap', roadmapTab],
];

const html = `<!doctype html>
<html lang="en" class="brand-egym light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="Live state of the EGYM One design system: inspection score, coverage, delivery queue, governance and community health.">
<link rel="stylesheet" href="./vendor/egym-one-tokens.css">
<style>${css}</style>
</head>
<body>

<nav class="nav">
  <div class="nav-inner">
    <div class="wordmark">EGYM<span>One</span></div>
    <div class="tabs" role="tablist" aria-label="Dashboard sections">
      ${TABS.map(
        ([id, label], i) =>
          `<eo-button class="tab" role="tab" id="tab-${id}" aria-controls="panel-${id}"
             aria-selected="${i === 0}" data-tab="${id}" size="small"
             hierarchy="${i === 0 ? 'primary' : 'free'}">${esc(label)}</eo-button>`
      ).join('')}
    </div>
  </div>
</nav>

<main class="shell">
  ${TABS.map(
    ([id, , content], i) =>
      `<div class="panel ${i === 0 ? 'is-active' : ''}" id="panel-${id}" role="tabpanel" aria-labelledby="tab-${id}" ${
        i === 0 ? '' : 'hidden'
      }>${content}</div>`
  ).join('')}
</main>

<footer class="closer">
  <div class="closer-inner">
    <h2>Where these numbers come from</h2>
    <p>Station scores are parsed directly out of <code>${esc(inspection?.source ?? 'the inspection reports')}</code>, so this dashboard cannot drift from the inspection. Component counts, pull request ages, tags, releases and contributor counts refresh automatically from the GitHub API.</p>
    <p>Jira and Notion figures are as last reviewed — they need tokens this build does not have, and are not presented as live.</p>
    <p>Built with the real design system: <code>@egym-private/egym-one-design-system-web@${esc(
      dsInfo.version
    )}</code> — ${esc(dsInfo.components.join(', '))} — styled entirely from the ${dsInfo.tokenCount} published <code>--eo-*</code> tokens. Charts are hand-built from those tokens because the system has no chart or progress component in code yet (DSC-100).</p>
    <p><strong>Sources.</strong> ${Object.entries(meta.sources)
      .map(([k, v]) => (String(v).startsWith('http') ? `<a href="${esc(v)}" rel="noreferrer">${esc(k)}</a>` : esc(k)))
      .join(' · ')}</p>
    <p>Data as of ${esc(fmt(meta.asOf))} · page generated ${esc(fmt(provenance.generatedAt))} · inspection ${esc(fmt(inspection?.date ?? meta.asOf))}</p>
  </div>
  <div class="ghost-mark" aria-hidden="true">EGYM One</div>
</footer>

<script type="module" src="./vendor/egym-one-ds.js"></script>
<script type="module" src="./vendor/motion.js"></script>
<script>
  const tabs = [...document.querySelectorAll('.tab')];
  const show = (id, push) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute('aria-selected', String(on));
      // eo-button carries its selected state through hierarchy, so drive that
      // rather than layering a CSS class over a design system component
      t.setAttribute('hierarchy', on ? 'primary' : 'free');
    });
    document.querySelectorAll('.panel').forEach((p) => {
      const on = p.id === 'panel-' + id;
      p.classList.toggle('is-active', on);
      p.toggleAttribute('hidden', !on);
    });
    if (push) history.replaceState(null, '', '#' + id);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.__dashTabIn && window.__dashTabIn(document.getElementById('panel-' + id));
  };
  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.tab, true)));
  // keyboard support: arrow keys move between tabs, per the ARIA tabs pattern
  document.querySelector('.tabs').addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t === document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    tabs[n].focus();
    show(tabs[n].dataset.tab, true);
  });
  const initial = location.hash.slice(1);
  if (initial && tabs.some((t) => t.dataset.tab === initial)) show(initial, false);
</script>
</body>
</html>
`;

mkdirSync(resolve(root, 'docs'), { recursive: true });
writeFileSync(resolve(root, 'docs/index.html'), html);
writeFileSync(resolve(root, 'docs/ds-kpi-data.json'), JSON.stringify(data, null, 2));
console.log(
  `Built docs/index.html (${(html.length / 1024).toFixed(1)} KB) — ${TABS.length} tabs, inspection ${
    inspection?.shippedTotal ?? '?'
  }/100, data as of ${meta.asOf}`
);
