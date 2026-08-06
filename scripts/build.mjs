/**
 * Renders docs/index.html from ds-kpi-data.json.
 *
 * Static output so GitHub Pages serves it with no runtime fetching and no
 * secrets in the browser. Re-run after `npm run refresh` and
 * `node scripts/read-inspection.mjs` (the scheduled workflow does both).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const card = (inner) => `<eo-card><div class="card-body">${inner}</div></eo-card>`;
const chip = (text, intent = 'neutral', size = 'small') =>
  `<eo-label intent="${intent}" size="${size}">${esc(text)}</eo-label>`;
const meter = (value, max, tone = '') =>
  `<div class="meter ${tone}"><span style="width:${Math.max(0, Math.min(100, pct(value, max)))}%"></span></div>`;
const barRows = (obj, tone = '') => {
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
const facts = (rows) =>
  `<ul class="facts">${rows
    .map(([k, v, tone = '']) => `<li><span class="k">${esc(k)}</span><span class="v ${tone}">${esc(v)}</span></li>`)
    .join('')}</ul>`;

const { coverage, jira, bmaBuildPlan, communityVelocity, ask, kpis, roadmap, meta, inspection } = data;
const rfd = jira.readyForDevelopment;

let sectionNo = 0;
const head = (title) => {
  sectionNo += 1;
  return `<div class="section-head"><span class="num">${String(sectionNo).padStart(2, '0')}</span><h2>${esc(title)}</h2></div>`;
};

/* ----------------------------------------------------------------- hero */
const rail = inspection
  ? `<div class="rail">${inspection.stations
      .map(
        (s) => `<div class="station ${s.light}">
          <div class="n">${String(s.n).padStart(2, '0')}</div>
          <div class="s">${s.score}</div>
          <div class="t">${esc(s.name)}</div>
          ${s.potential ? `<div class="up">→ ${s.potential}</div>` : ''}
        </div>`
      )
      .join('')}</div>`
  : '';

const uplift = inspection ? inspection.potentialTotal - inspection.shippedTotal : 0;
const hero = `
<header class="hero">
  <div class="hero-top">
    <div>
      <p class="kicker">Design system health · inspection ${esc(inspection?.date ?? meta.asOf)}</p>
      <h1>EGYM One Design System</h1>
      <p class="sub">One number for the state of the system, ten stations behind it, and the delivery data that explains why it sits where it does.</p>
    </div>
    <div class="score-block">
      <div class="score-now">${inspection ? inspection.shippedTotal : '—'}<span class="of">/100</span></div>
      <div class="score-meta">
        <span class="line"><b>${inspection?.reds ?? 0}</b> red · <b>${inspection?.yellows ?? 0}</b> yellow · <b>${inspection?.greens ?? 0}</b> green</span>
        ${uplift > 0 ? `<span class="line"><b>+${uplift}</b> available by promoting work that already exists</span>` : ''}
        ${inspection?.trend?.length > 1 ? `<span class="line">Trend ${inspection.trend.join(' → ')}</span>` : ''}
        <span class="line">Design system <b>${esc(dsInfo.version)}</b> · <b>${dsInfo.tokenCount}</b> tokens</span>
      </div>
    </div>
  </div>
  ${rail}
</header>`;

/* ------------------------------------------------------------ inspection */
const inspectionSection = inspection
  ? `<section class="section">
      ${head('Inspection stations')}
      <p class="lede">Scored against the design system multi-point inspection. Red is broken or missing, yellow is drift, green is healthy. An arrow marks a station that would move if work already finished were promoted into main. Source: <code>${esc(inspection.source)}</code>.</p>
      <div class="grid two">
        ${card(`
          <p class="eyebrow">Every station, with what moved it</p>
          <div class="table-scroll"><table>
            <thead><tr><th>#</th><th>Station</th><th>Score</th><th>Why it moved</th></tr></thead>
            <tbody>${inspection.stations
              .map(
                (s) => `<tr>
                  <td class="key">${String(s.n).padStart(2, '0')}</td>
                  <td>${esc(s.name)}</td>
                  <td>${chip(String(s.score), s.light === 'red' ? 'negative' : s.light === 'green' ? 'positive' : 'warning')}${
                    s.potential ? ` ${chip('→ ' + s.potential, 'info')}` : ''
                  }</td>
                  <td>${esc(s.note)}</td>
                </tr>`
              )
              .join('')}</tbody>
          </table></div>
        `)}
        ${card(`
          <p class="eyebrow">Where the points are</p>
          ${facts([
            ['Shipped today', `${inspection.shippedTotal}/100`, inspection.shippedTotal >= 70 ? 'good' : 'warn'],
            ['Achievable now', `${inspection.potentialTotal}/100`, 'good'],
            ['Stations at red', inspection.reds, inspection.reds ? 'bad' : 'good'],
            ['Stations at green', inspection.greens, inspection.greens ? 'good' : 'bad'],
          ])}
          ${meter(inspection.shippedTotal, inspection.maxTotal, inspection.shippedTotal >= 70 ? 'is-good' : 'is-warn')}
          <p class="target">The ${uplift}-point gap is not new work. It is finished, verified AI-readiness infrastructure sitting in a playground repository that is not linked from either design system repo.</p>
          <p class="eyebrow">Lowest scoring</p>
          <ul class="chips">${[...inspection.stations]
            .sort((a, b) => a.score - b.score)
            .slice(0, 4)
            .map((s) => `<li>${chip(`${s.name} · ${s.score}`, s.light === 'red' ? 'negative' : 'warning')}</li>`)
            .join('')}</ul>
        `)}
      </div>
    </section>`
  : '';

/* ------------------------------------------------------------------ KPIs */
const kpiTone = (id) => {
  if (id === 'core-coverage') return coverage.inCodePct >= 80 ? 'is-good' : coverage.inCodePct >= 50 ? 'is-warn' : 'is-bad';
  if (id === 'ready-queue') return rfd.count === 0 ? 'is-good' : 'is-bad';
  if (id === 'time-to-merge') return 'is-bad';
  if (id === 'tagged-releases') return communityVelocity.gitTags === 0 ? 'is-bad' : 'is-good';
  return '';
};
const kpiTiles = kpis
  .map((k) => {
    const unmeasured = k.baseline === null;
    const tone = unmeasured ? 'is-unmeasured' : kpiTone(k.id);
    return card(`
      <p class="eyebrow">${esc(k.label)}</p>
      <p class="metric ${tone}">
        <span class="value">${unmeasured ? 'Not measured' : esc(k.baseline)}</span>
        ${unmeasured ? '' : `<span class="unit">${esc(k.baselineDetail ? `${k.unit} · ${k.baselineDetail}` : k.unit)}</span>`}
      </p>
      ${k.id === 'core-coverage' ? meter(coverage.inCode, coverage.coreSetTotal, tone) : ''}
      <p class="target">Target <b>${esc(k.target)}</b>${k.targetDetail ? ` · ${esc(k.targetDetail)}` : ''}</p>
      ${unmeasured ? '<p class="target">No code-side telemetry exists yet, so this cannot be reported until it is instrumented.</p>' : ''}
    `);
  })
  .join('');

/* -------------------------------------------------------------- sections */
const queueRows = rfd.tickets
  .map((t) => ({ ...t, age: daysSince(t.created, meta.asOf) }))
  .sort((a, b) => b.age - a.age)
  .map(
    (t) => `<tr>
      <td class="key">${esc(t.key)}</td>
      <td>${esc(t.title)}</td>
      <td>${chip(t.type, t.type === 'Bug' ? 'negative' : 'neutral')}</td>
      <td class="age ${t.age > 180 ? 'stale' : ''}">${t.age} d</td>
    </tr>`
  )
  .join('');

const cv = communityVelocity;
const phase = (p) => {
  const tickets = p.tickets ?? [...(p.engineer1_structureNavigation ?? []), ...(p.engineer2_contentForms ?? [])];
  return card(`
    <p class="phase-weeks">Weeks ${esc(p.weeks)}</p>
    <p class="card-title">${esc(p.title)}</p>
    <ul class="ticket-list">${tickets.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${p.extras ? `<ul class="facts">${p.extras.map((e) => `<li><span class="k">${esc(e)}</span></li>`).join('')}</ul>` : ''}
  `);
};

const html = `<!doctype html>
<html lang="en" class="brand-egym light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="Live state of the EGYM One design system: inspection score, coverage, delivery queue, community velocity and release governance.">
<link rel="stylesheet" href="./vendor/egym-one-tokens.css">
<style>${css}</style>
</head>
<body>
<div class="wrap">

${hero}

<eo-alert intent="warning" size="default">
  ${coverage.coreSetTotal - coverage.inCode} of ${coverage.coreSetTotal} core components are still unbuilt, and ${rfd.count} specified tickets sit unstarted with ${rfd.unassigned} of them unassigned. The ask is ${ask.engineers} engineers for ${ask.durationWeeks} weeks.
</eo-alert>

${inspectionSection}

<section class="section">
  ${head('Headline KPIs')}
  <p class="lede">Baseline is today. Target is the state after the ${ask.durationWeeks}-week engagement.</p>
  <div class="grid kpi">${kpiTiles}</div>
</section>

<section class="section">
  ${head('Coverage')}
  <p class="lede">The core set is extrapolated from a year of library usage against the last 90 days, so it reflects what products actually place — not the full Figma inventory.</p>
  <div class="grid two">
    ${card(`
      <p class="eyebrow">Core set built in code</p>
      <p class="metric ${coverage.inCodePct >= 50 ? 'is-warn' : 'is-bad'}">
        <span class="value">${coverage.inCode}<span class="unit"> / ${coverage.coreSetTotal}</span></span>
        <span class="unit">${coverage.inCodePct}%</span>
      </p>
      ${meter(coverage.inCode, coverage.coreSetTotal, coverage.inCodePct >= 50 ? 'is-warn' : 'is-bad')}
      <p class="target">${esc(coverage.coreSetSource)}</p>
      <ul class="chips">${coverage.codedComponents.map((c) => `<li>${chip(c, 'positive')}</li>`).join('')}</ul>
    `)}
    ${card(`
      <p class="eyebrow">Moving through the pipeline</p>
      ${facts([
        ['Ready for release', coverage.readyForRelease.length, 'good'],
        ['In development', coverage.inDevelopment.length],
        ['Design coverage, Wellpass', `${coverage.designCoverageWellpassPct}%`, 'good'],
        ['Still to build', coverage.coreSetTotal - coverage.inCode, 'bad'],
      ])}
      <p class="eyebrow">Ready for release</p>
      <ul class="chips">${coverage.readyForRelease.map((c) => `<li>${chip(c, 'info')}</li>`).join('')}</ul>
      <p class="eyebrow">In development</p>
      <ul class="chips">${coverage.inDevelopment.map((c) => `<li>${chip(c, 'warning')}</li>`).join('')}</ul>
    `)}
  </div>
</section>

<section class="section">
  ${head('Delivery pipeline')}
  <p class="lede">Everything in “Ready for Development” has a spec and a priority. It is waiting on capacity, not on decisions.</p>
  <div class="grid two">
    ${card(`
      <p class="eyebrow">All open DSC issues</p>
      <p class="metric"><span class="value">${jira.openIssuesTotal}</span><span class="unit">open</span></p>
      ${barRows(jira.byStatus, 'neutral')}
    `)}
    ${card(`
      <p class="eyebrow">The queue that engineers would drain</p>
      <p class="metric is-bad"><span class="value">${rfd.count}</span><span class="unit">ready for development</span></p>
      ${facts([
        ['Unassigned', `${rfd.unassigned} of ${rfd.count}`, 'bad'],
        ['Waiting since Oct 2025', rfd.waitingSinceOct2025, 'bad'],
        ['Currently in development', jira.byStatus['In Development'] ?? 0],
      ])}
      <p class="target">Specified, prioritised, and nobody is on them. This is the single number the ask is built on.</p>
    `)}
  </div>
</section>

<section class="section">
  ${head('The Ready-for-Development queue')}
  <p class="lede">Oldest first. Age counts days since the ticket was created; anything past 180 days is flagged.</p>
  ${card(`<div class="table-scroll"><table>
    <thead><tr><th>Key</th><th>Title</th><th>Type</th><th>Age</th></tr></thead>
    <tbody>${queueRows}</tbody>
  </table></div>`)}
</section>

<section class="section">
  ${head('BMA build plan')}
  <p class="lede">${esc(bmaBuildPlan.backlogNote)}</p>
  <div class="grid two">
    ${card(`
      <p class="eyebrow">Items by status</p>
      <p class="metric"><span class="value">${bmaBuildPlan.itemsTotal}</span><span class="unit">items</span></p>
      ${barRows(bmaBuildPlan.byStatus, 'neutral')}
    `)}
    ${card(`
      <p class="eyebrow">Remaining backlog, by impact</p>
      ${barRows(bmaBuildPlan.backlogImpact, 'positive')}
      <p class="target">${esc(bmaBuildPlan.note)}</p>
    `)}
  </div>
</section>

<section class="section">
  ${head('Community &amp; release governance')}
  <p class="lede">Measured from live Slack and GitHub evidence in the ${esc(inspection?.date ?? '')} governance re-inspection.</p>
  <div class="grid three">
    ${card(`
      <p class="eyebrow">The community is contributing</p>
      ${facts([
        ['External contributors', cv.externalContributors, 'good'],
        ['Merged community PRs', cv.mergedCommunityPRs, 'good'],
        ['Median time to merge', `${cv.medianTimeToMergeDays} days`, 'good'],
      ])}
      <p class="target">Contribution is not the bottleneck. Review capacity is.</p>
    `)}
    ${card(`
      <p class="eyebrow">…but the tail is where it fails</p>
      ${facts([
        ['Worst merges', `${cv.timeToMergeTailDays.join(', ')} d`, 'bad'],
        ['Open human PRs', `${cv.openHumanPRs.count} · median ${cv.openHumanPRs.medianAgeDays} d`, 'bad'],
        ['Dependabot PRs', `${cv.dependabotPRs.count} · oldest ${cv.dependabotPRs.oldestDays} d`, 'bad'],
        ['CONTRIBUTING draft age', `${cv.contributingPRDraftAgeDays} d`, 'bad'],
      ])}
    `)}
    ${card(`
      <p class="eyebrow">Release governance</p>
      ${facts([
        ['Git tags', cv.gitTags, 'bad'],
        ['GitHub releases', cv.gitHubReleases, 'bad'],
      ])}
      <p class="target">Without tags and semver the system cannot express a breaking change, so no migration can be announced.</p>
      <p class="target">${esc(cv.evidence.teamRoutedAround)}</p>
    `)}
  </div>
</section>

<section class="section">
  ${head('The ask')}
  <div class="grid two">
    ${card(`
      <p class="eyebrow">Resourcing</p>
      <p class="metric"><span class="value">${ask.engineers} × ${ask.durationWeeks}</span><span class="unit">engineers × weeks</span></p>
      ${facts([
        ['Check-in', `week ${ask.checkInWeek}`],
        ['Final review', `week ${ask.finalReviewWeek}`],
      ])}
      <p class="target">${esc(ask.velocityAssumption)}</p>
    `)}
    ${card(`
      <p class="eyebrow">Why rotation, not permanent headcount</p>
      <p class="target">${esc(ask.rotationModel)}</p>
    `)}
  </div>
</section>

<section class="section">
  ${head('12-week roadmap')}
  <div class="phases">
    ${phase(roadmap.phase1)}
    ${phase(roadmap.phase2)}
    ${phase(roadmap.phase3)}
  </div>
</section>

<footer>
  <p><strong>Sources.</strong> ${Object.entries(meta.sources)
    .map(([k, v]) => (String(v).startsWith('http') ? `<a href="${esc(v)}" rel="noreferrer">${esc(k)}</a>` : esc(k)))
    .join(' · ')}</p>
  <p>Built with the real design system: <code>@egym-private/egym-one-design-system-web@${esc(dsInfo.version)}</code> — components ${esc(dsInfo.components.join(', '))}, styled entirely from the ${dsInfo.tokenCount} published <code>--eo-*</code> tokens.</p>
  <p>Charts and meters are hand-built from tokens because the system has no chart or progress component in code yet (DSC-100). Links are native anchors rather than <code>eo-link</code>, which currently renders no anchor element and is not keyboard reachable (DSC-202).</p>
  <p>Station scores are read directly from <code>${esc(inspection?.source ?? 'the inspection reports')}</code>, so this dashboard cannot drift from the inspection. Generated ${new Date().toISOString().slice(0, 10)}.</p>
</footer>

</div>
<script type="module" src="./vendor/egym-one-ds.js"></script>
</body>
</html>
`;

mkdirSync(resolve(root, 'docs'), { recursive: true });
writeFileSync(resolve(root, 'docs/index.html'), html);
writeFileSync(resolve(root, 'docs/ds-kpi-data.json'), JSON.stringify(data, null, 2));
console.log(`Built docs/index.html (${(html.length / 1024).toFixed(1)} KB) — inspection ${inspection?.shippedTotal ?? '?'}/100, data as of ${meta.asOf}`);
