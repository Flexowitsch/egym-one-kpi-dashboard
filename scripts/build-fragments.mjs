/**
 * Builds one standalone, embeddable page per quality bar.
 *
 * Each fragment is deliberately self-contained: it carries its own token
 * stylesheet link, needs no JavaScript, and renders correctly at 320px wide.
 * That makes it embeddable anywhere a URL can go — Notion, FigJam, Confluence,
 * a deck — without dragging the rest of the dashboard along.
 *
 * Output:
 *   docs/fragments/<id>.html   one card per quality bar
 *   docs/fragments/index.html  gallery with copyable embed URLs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { cascadeField } from '../src/charts.mjs';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, 'ds-kpi-data.json'), 'utf8'));
const { fragments } = data;
const outDir = resolve(root, 'docs/fragments');
mkdirSync(outDir, { recursive: true });

const BASE = 'https://flexowitsch.github.io/egym-one-kpi-dashboard/fragments';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/* Shared styling. Every value resolves to an --eo-* token; the fragment sets a
   transparent background so it inherits whatever surface it is embedded on. */
const CSS = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;background:transparent}
body{
  font-family:var(--eo-typography-body-100-font-family);
  color:var(--eo-color-content-emphasized);
  -webkit-font-smoothing:antialiased;
}
.frag{
  background:var(--eo-color-surface-default);
  border-radius:var(--eo-dimension-border-radius-large);
  padding: var(--eo-dimension-padding-block-large);
  display:flex;flex-direction:column;gap:var(--eo-dimension-gap-default);
  min-height:100%;
  border-top:3px solid var(--eo-color-border-hinted);
}
.frag.good{border-top-color:var(--eo-color-border-utility-positive)}
.frag.bad{border-top-color:var(--eo-color-border-utility-negative)}
.frag.warn{border-top-color:var(--eo-color-border-utility-warning)}
.v{
  font-family:var(--eo-typography-headline-500-font-family);
  font-size:var(--eo-typography-headline-500-font-size);
  line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;
}
.frag.good .v{color:var(--eo-color-content-utility-positive)}
.frag.bad .v{color:var(--eo-color-content-utility-negative)}
.frag.warn .v{color:var(--eo-color-content-utility-warning)}
.l{margin:0;font-size:var(--eo-typography-body-100-font-size);font-weight:600}
.p{margin:0;font-size:var(--eo-typography-body-50-font-size);line-height:var(--eo-typography-body-50-line-height);color:var(--eo-color-content-subtle)}
.m{
  margin:auto 0 0;padding-top:var(--eo-dimension-12);
  border-top:1px solid var(--eo-color-border-subtle);
  font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-hinted);
  display:flex;flex-wrap:wrap;gap:var(--eo-dimension-gap-small) var(--eo-dimension-gap-default);justify-content:space-between;
}
`;

const page = (f) => `<!doctype html>
<html lang="en" class="brand-egym light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(f.label)} — EGYM One</title>
<link rel="stylesheet" href="../vendor/egym-one-tokens.css">
<style>${CSS}</style>
</head>
<body>
  <div class="frag ${f.tone}">
    <div class="v">${esc(f.value)}</div>
    <p class="l">${esc(f.label)}</p>
    <p class="p">${esc(f.proof)}</p>
    <p class="m"><span>${esc(f.source)}</span><span>Updated ${esc(fmt(f.date))}</span></p>
  </div>
</body>
</html>
`;

fragments.items.forEach((f) => writeFileSync(resolve(outDir, `${f.id}.html`), page(f)));

/* ---- gallery, with the embed URL next to each card ---- */
const card = (f) => `
  <figure class="cell">
    <iframe src="./${f.id}.html" title="${esc(f.label)}" loading="lazy"></iframe>
    <figcaption>
      <code>${BASE}/${f.id}.html</code>
    </figcaption>
  </figure>`;

const index = `<!doctype html>
<html lang="en" class="brand-egym light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EGYM One — KPI fragments</title>
<link rel="stylesheet" href="../vendor/egym-one-tokens.css">
<style>
${CSS}
body{background:var(--eo-color-surface-subtle);padding:var(--eo-dimension-40) clamp(1.25rem,4vw,4rem)}
h1{font-family:var(--eo-typography-headline-500-font-family);font-size:var(--eo-typography-headline-500-font-size);line-height:1.1;margin:0 0 var(--eo-dimension-8)}
.lede{margin:0 0 var(--eo-dimension-8);color:var(--eo-color-content-subtle);max-width:70ch}
.stamp{margin:0 0 var(--eo-dimension-40);color:var(--eo-color-content-hinted);font-size:var(--eo-typography-body-50-font-size)}
h2{font-family:var(--eo-typography-headline-300-font-family);font-size:var(--eo-typography-headline-300-font-size);margin:var(--eo-dimension-40) 0 var(--eo-dimension-16)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--eo-dimension-gap-extra-large)}
.cell{margin:0}
.cell iframe{width:100%;height:230px;}
.grid.station{grid-template-columns:repeat(auto-fill,minmax(360px,1fr))}
.grid.station .cell iframe{height:430px;border:0;display:block;background:var(--eo-color-surface-default);border-radius:var(--eo-dimension-border-radius-large)}
.grid.tall .cell iframe{height:300px;border:0;display:block;background:var(--eo-color-surface-default);border-radius:var(--eo-dimension-border-radius-large)}
figcaption{margin-top:var(--eo-dimension-8)}
figcaption code{font-size:.72rem;color:var(--eo-color-content-hinted);word-break:break-all}
</style>
</head>
<body>
  <h1>KPI fragments</h1>
  <p class="lede">${esc(fragments.note)}</p>
  <p class="stamp">Updated ${esc(fmt(fragments.updated))} · paste any URL below into Notion, FigJam or Confluence and choose Embed</p>

  <h2>Visual</h2>
  <div class="grid tall">
    ${['cascade','coverage-rings','stations','now']
      .map((id) => `<figure class="cell">
        <iframe src="./${id}.html" title="${id}" loading="lazy"></iframe>
        <figcaption><code>${BASE}/${id}.html</code></figcaption>
      </figure>`)
      .join('')}
  </div>

  <h2>One per inspection station</h2>
  <p class="lede">Each of the ten stations as its own embeddable page — dial, history across the three inspections, and the finding. Animated, self-contained, no JavaScript.</p>
  <div class="grid station">
    ${data.inspection.stations
      .map((s) => {
        const id = 'station-' + String(s.n).padStart(2, '0');
        return `<figure class="cell">
          <iframe src="./${id}.html" title="${esc(s.name)}" loading="lazy"></iframe>
          <figcaption><code>${BASE}/${id}.html</code></figcaption>
        </figure>`;
      })
      .join('')}
  </div>

  <h2>Ready — design side</h2>
  <div class="grid">${fragments.items.filter((f) => f.tone === 'good').map(card).join('')}</div>

  <h2>Lagging — code side</h2>
  <div class="grid">${fragments.items.filter((f) => f.tone !== 'good').map(card).join('')}</div>
</body>
</html>
`;
writeFileSync(resolve(outDir, 'index.html'), index);

console.log(`Built ${fragments.items.length} fragments + gallery in docs/fragments/`);
console.log(`  green: ${fragments.items.filter((f) => f.tone === 'good').length} · red: ${fragments.items.filter((f) => f.tone !== 'good').length}`);

/* ═══════════════════════════════════════════════════ visual fragments ═══
   The number cards above answer "what is the figure". These answer "what is
   going on" at a glance, and they move. Each is still self-contained: inline
   SVG, a few lines of CSS animation, no library. */

const { coverage, jira, inspection } = data;

const VIS_CSS = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;background:transparent}
body{font-family:var(--eo-typography-body-100-font-family);color:var(--eo-color-content-emphasized);-webkit-font-smoothing:antialiased}
.v-frag{background:var(--eo-color-surface-default);border-radius:var(--eo-dimension-border-radius-large);padding: var(--eo-dimension-padding-block-large);min-height:100%;display:flex;flex-direction:column;gap:var(--eo-dimension-gap-large)}
.v-eyebrow{margin:0;font-family:var(--eo-typography-action-label-100-font-family);font-size:var(--eo-typography-body-50-font-size);letter-spacing:.1em;text-transform:uppercase;color:var(--eo-color-content-accent);font-weight:700}
.v-title{margin:0;font-family:var(--eo-typography-headline-300-font-family);font-size:var(--eo-typography-headline-300-font-size);line-height:1.2}
.v-note{margin:0;font-size:var(--eo-typography-body-50-font-size);line-height:var(--eo-typography-body-50-line-height);color:var(--eo-color-content-subtle)}
.v-meta{margin:auto 0 0;padding-top:var(--eo-dimension-12);border-top:1px solid var(--eo-color-border-subtle);font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-hinted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:var(--eo-dimension-gap-small)}
svg{display:block;max-width:100%;height:auto}
/* rings draw themselves in */
.ring{fill:none;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%}
.ring.track{stroke:var(--eo-color-surface-subtle)}
.ring.fill{animation:draw 1.4s cubic-bezier(.22,1,.36,1) forwards}
@keyframes draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:var(--off)}}
.bar-fill{animation:grow 1.1s cubic-bezier(.22,1,.36,1) forwards;transform-origin:left center}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.pop{animation:pop .5s cubic-bezier(.22,1,.36,1) backwards}
@keyframes pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ring.fill,.bar-fill,.pop{animation:none}.ring.fill{stroke-dashoffset:var(--off)}.bar-fill{transform:none}}
.rows{display:grid;gap:var(--eo-dimension-gap-default);margin:0;padding:0;list-style:none}
.row{display:flex;align-items:baseline;gap:var(--eo-dimension-gap-default);font-size:var(--eo-typography-body-50-font-size)}
.row .k{font-weight:700;font-variant-numeric:tabular-nums;color:var(--eo-color-content-accent);white-space:nowrap}
.row .t{color:var(--eo-color-content-emphasized)}
.row .w{margin-left:auto;color:var(--eo-color-content-hinted);white-space:nowrap}
`;

const visPage = (title, body, extraCss = '') => `<!doctype html>
<html lang="en" class="brand-egym light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — EGYM One</title>
<link rel="stylesheet" href="../vendor/egym-one-tokens.css">
<style>${VIS_CSS}${extraCss}</style>
</head>
<body>${body}</body>
</html>
`;

/* ---- two rings: design coverage against code coverage ---- */
const ringPair = () => {
  const R = 54, C = 2 * Math.PI * R;
  const ring = (pctVal, cls, delay) => {
    const off = C - (C * pctVal) / 100;
    return `<circle class="ring fill ${cls}" cx="70" cy="70" r="${R}" stroke-width="14"
      style="--len:${C.toFixed(1)};--off:${off.toFixed(1)};stroke-dasharray:${C.toFixed(1)};stroke-dashoffset:${C.toFixed(1)};animation-delay:${delay}s"/>`;
  };
  return visPage(
    'Coverage',
    `<div class="v-frag">
      <p class="v-eyebrow">Coverage</p>
      <p class="v-title">Design is done. Code is not.</p>
      <div style="display:flex;gap:var(--eo-dimension-gap-largest);flex-wrap:wrap;justify-content:center">
        <figure style="margin:0;text-align:center">
          <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="Design coverage 100 percent">
            <circle class="ring track" cx="70" cy="70" r="${R}" stroke-width="14"/>
            ${ring(100, 'design', 0.1)}
            <text x="70" y="70" text-anchor="middle" dominant-baseline="middle"
              style="font-size:26px;font-weight:700;fill:var(--eo-color-content-utility-positive)">100%</text>
          </svg>
          <figcaption class="v-note">Wellpass design</figcaption>
        </figure>
        <figure style="margin:0;text-align:center">
          <svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="Code coverage 41 percent">
            <circle class="ring track" cx="70" cy="70" r="${R}" stroke-width="14"/>
            ${ring(coverage.inCodePct, 'code', 0.35)}
            <text x="70" y="70" text-anchor="middle" dominant-baseline="middle"
              style="font-size:26px;font-weight:700;fill:var(--eo-color-content-utility-negative)">${coverage.inCodePct}%</text>
          </svg>
          <figcaption class="v-note">Core set in code</figcaption>
        </figure>
      </div>
      <p class="v-note">${coverage.inCode} of ${coverage.coreSetTotal} core components are built. Every one of the rest has a finished design waiting.</p>
      <p class="v-meta"><span>Figma + GitHub API</span><span>Updated ${esc(fmt(fragments.updated))}</span></p>
    </div>`,
    `.ring.design{stroke:var(--eo-color-surface-utility-positive)}.ring.code{stroke:var(--eo-color-surface-utility-negative)}`
  );
};

/* ---- what is actually moving right now ---- */
const nowPage = () => {
  const inDev = jira.inDevelopment || [];
  const ready = coverage.readyForRelease || [];
  return visPage(
    'In progress',
    `<div class="v-frag">
      <p class="v-eyebrow">Right now</p>
      <p class="v-title">${inDev.length + ready.length} things are moving</p>
      <p class="v-note" style="margin-top:calc(var(--eo-dimension-4) * -1)">Ready for release</p>
      <ul class="rows">
        ${ready
          .map((r, i) => {
            const m = String(r).match(/^(.*?)\s*\((DSC-\d+)\)$/);
            return `<li class="row pop" style="animation-delay:${0.05 * i}s">
              <span class="k">${esc(m ? m[2] : '')}</span><span class="t">${esc(m ? m[1] : r)}</span>
              <span class="w">shipping</span></li>`;
          })
          .join('')}
      </ul>
      <p class="v-note">In development</p>
      <ul class="rows">
        ${inDev
          .map(
            (t, i) => `<li class="row pop" style="animation-delay:${0.05 * (i + ready.length)}s">
              <span class="k">${esc(t.key)}</span><span class="t">${esc(t.title)}</span>
              <span class="w">${esc(t.assignee || 'unassigned')}</span></li>`
          )
          .join('')}
      </ul>
      <p class="v-meta"><span>Jira DSC board</span><span>Updated ${esc(fmt(fragments.updated))}</span></p>
    </div>`
  );
};

/* ---- the ten stations, as a compact strip ---- */
const stationStrip = () => {
  const st = inspection?.stations ?? [];
  const cells = st
    .map(
      (s, i) => `<div class="cell pop" style="animation-delay:${0.04 * i}s">
        <div class="sc ${s.light}">${s.score}</div>
        <div class="nm">${esc(s.name)}</div>
      </div>`
    )
    .join('');
  return visPage(
    'Stations',
    `<div class="v-frag">
      <p class="v-eyebrow">Inspection ${esc(fmt(inspection?.date ?? fragments.updated))}</p>
      <p class="v-title">${inspection?.shippedTotal ?? '—'}<span style="font-size:.5em;color:var(--eo-color-content-hinted)">/100</span> · ten stations</p>
      <div class="strip">${cells}</div>
      <p class="v-note">${inspection?.reds ?? 0} red · ${inspection?.yellows ?? 0} yellow · ${inspection?.greens ?? 0} green</p>
      <p class="v-meta"><span>Design system inspection</span><span>Updated ${esc(fmt(inspection?.date ?? fragments.updated))}</span></p>
    </div>`,
    `.strip{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--eo-dimension-gap-default)}
     @media(min-width:560px){.strip{grid-template-columns:repeat(10,1fr)}}
     .cell{text-align:center}
     .sc{font-family:var(--eo-typography-headline-300-font-family);font-size:var(--eo-typography-headline-300-font-size);line-height:1.1;font-variant-numeric:tabular-nums}
     .sc.red{color:var(--eo-color-content-utility-negative)}
     .sc.yellow{color:var(--eo-color-content-utility-warning)}
     .sc.green{color:var(--eo-color-content-utility-positive)}
     .nm{font-size:.68rem;line-height:1.2;color:var(--eo-color-content-subtle);overflow-wrap:break-word}`
  );
};

writeFileSync(resolve(outDir, 'coverage-rings.html'), ringPair());
writeFileSync(resolve(outDir, 'now.html'), nowPage());
writeFileSync(resolve(outDir, 'stations.html'), stationStrip());
console.log('  visual: coverage-rings, now, stations');

/* the cascade, as its own embeddable piece */
const cascadeFragment = () => visPage(
  'Token cascade',
  `<div class="v-frag" style="position:relative;overflow:hidden;min-height:280px">
     <div class="cf-bg">${cascadeField({ width: 900, height: 420, seed: 11, cycles: 1 })}</div>
     <div style="position:relative;z-index:1">
       <p class="v-eyebrow">Token system</p>
       <p class="v-title">${data.tokenAudit.variables.toLocaleString('en-GB')} variables, four tiers</p>
       <p class="v-note">Core → Brand → Breakpoint → Appearance. ${data.tokenAudit.aliasPct}% of values resolve through an alias rather than a literal, which is what lets one change reach every brand and breakpoint at once.</p>
     </div>
     <p class="v-meta" style="position:relative;z-index:1"><span>Full read of the token system</span><span>Updated ${esc(fmt(fragments.updated))}</span></p>
   </div>`,
  /* The text sits left, so the field is masked away there and carries the right
     half of the card. Same idea as the dashboard: the cascade frames the
     reading area rather than running under it. */
  `.cf-bg{position:absolute;inset:0;pointer-events:none;
    -webkit-mask-image:linear-gradient(to right,transparent 0,transparent 38%,#000 78%,#000 100%);
            mask-image:linear-gradient(to right,transparent 0,transparent 38%,#000 78%,#000 100%)}
   .cf-bg svg{width:100%;height:100%;display:block}
   /* Delay comes off the tier the element belongs to, so the cascade resolves
      Core → Brand → Breakpoint → Appearance. No JS: this fragment is an iframe
      in Notion and has to animate on its own. */
   .cf-link{fill:none;stroke:var(--eo-color-content-accent);stroke-width:1;opacity:.16;
     stroke-dasharray:1400;stroke-dashoffset:1400;
     animation:cf-draw 1.8s cubic-bezier(.22,1,.36,1) var(--d,0s) forwards,
               cf-breathe 3.4s ease-in-out calc(var(--d,0s) + 1.8s) infinite}
   .cf-node{fill:var(--eo-color-content-accent);opacity:0;
     animation:cf-in .9s cubic-bezier(.22,1,.36,1) var(--d,0s) forwards}
   /* the travelling pulse — same effect as the dashboard, and it works here
      because the path length is measured at build time, so no JS is needed */
   .cf-flow{fill:none;stroke:var(--eo-color-content-accent);stroke-width:1.4;
     stroke-linecap:round;opacity:.5;
     stroke-dasharray:16 var(--len);
     animation:cf-flow var(--fd,6s) linear var(--fp,0s) infinite}
   @keyframes cf-flow{to{stroke-dashoffset:var(--sweep)}}
   [data-tier="0"]{--d:.15s}
   [data-tier="1"]{--d:.75s}
   [data-tier="2"]{--d:1.35s}
   [data-tier="3"]{--d:1.95s}
   @keyframes cf-draw{to{stroke-dashoffset:0}}
   @keyframes cf-in{to{opacity:.30}}
   @keyframes cf-breathe{0%,100%{opacity:.10}50%{opacity:.24}}
   @media(prefers-reduced-motion:reduce){
     .cf-link{animation:none;stroke-dashoffset:0;opacity:.14}
     .cf-node{animation:none;opacity:.26}}`
);
writeFileSync(resolve(outDir, 'cascade.html'), cascadeFragment());
console.log('  visual: cascade');

/* ═══════════════════════════════════════════════════ station fragments ═══
   One standalone page per inspection station — ten of them, each carrying the
   same weight of craft as the overview but isolated, so it can be dropped into
   a Notion board on its own and worked against.

   Everything animates on load and everything is CSS. These render inside an
   iframe on a third-party page, where no script of ours will run and no
   scroll position of ours is observable, so a scroll-triggered or JS-driven
   build would simply never play. The constraint is what shapes the design:
   a dial that fills segment by segment, a history line that draws itself, and
   a tone-tinted strand field behind it, all on animation-delay. */

const TONE = { green: 'good', yellow: 'warn', red: 'bad' };

/* A ten-segment dial. Each segment is a separate arc so it can light up on its
   own delay — a single arc sweeping to the score reads as a percentage, and
   these are scores out of ten, which is a different thing. */
const dial = (score, light, max = 10) => {
  const cx = 130, cy = 126, r = 92, sw = 12;
  // SVG angles: 0° is 3 o'clock and y grows downward, so 135° is bottom-left.
  // Sweeping +270° from there runs left, over the top, to bottom-right and
  // leaves the gap at the base where a dial's gap belongs.
  const START = 135, SWEEP = 270;
  const per = SWEEP / max;
  // 7° of air, and butt caps. With round caps a 13px stroke adds 6.5px of cap
  // at each end — more than the gap itself — so all ten ticks merged into one
  // continuous arc and the dial read as a percentage rather than a score.
  const gap = 7;
  const rad = (d) => (d * Math.PI) / 180;
  const arc = (a0, a1) => {
    const [x0, y0] = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))];
    const [x1, y1] = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
  };
  const segs = Array.from({ length: max }, (_, i) => {
    const a0 = START + i * per + gap / 2;
    const a1 = START + (i + 1) * per - gap / 2;
    const on = i < score;
    return `<path class="seg ${on ? 'on ' + TONE[light] : 'off'}" d="${arc(a0, a1)}"
      stroke-width="${sw}" style="animation-delay:${(0.35 + i * 0.075).toFixed(2)}s"/>`;
  }).join('');

  return `<svg class="dial" viewBox="0 0 260 244" role="img"
    aria-label="Score ${score} out of ${max}">
    ${segs}
    <text class="dial-n ${TONE[light]}" x="${cx}" y="${cy + 6}" text-anchor="middle"
      dominant-baseline="middle">${score}</text>
    <text class="dial-d" x="${cx}" y="${cy + 46}" text-anchor="middle">of ${max}</text>
  </svg>`;
};

/* Three inspections is a direction, not a time series — so it is drawn small,
   under the dial, and labelled with the dates rather than gridded. */
const history = (vals, dates, max = 10) => {
  const pts = vals.map((v, i) => [i, v]).filter(([, v]) => v !== null);
  if (pts.length < 2) return '';
  const w = 260, h = 74, padX = 26, padTop = 14, padBot = 26;
  const x = (i) => padX + (i * (w - padX * 2)) / (vals.length - 1);
  const y = (v) => padTop + (1 - v / max) * (h - padTop - padBot);
  const d = pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="hist" viewBox="0 0 ${w} ${h}" role="img"
    aria-label="Score across inspections: ${pts.map(([, v]) => v).join(', ')}">
    <path class="hist-line" d="${d}"/>
    ${pts
      .map(
        ([i, v], k) => `<circle class="hist-dot" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.4"
          style="animation-delay:${(1.15 + k * 0.12).toFixed(2)}s"/>
        <text class="hist-v" x="${x(i).toFixed(1)}" y="${(y(v) - 9).toFixed(1)}" text-anchor="middle"
          style="animation-delay:${(1.2 + k * 0.12).toFixed(2)}s">${v}</text>`
      )
      .join('')}
    ${dates
      .map(
        (dt, i) =>
          `<text class="hist-x" x="${x(i).toFixed(1)}" y="${h - 6}" text-anchor="middle">${esc(dt)}</text>`
      )
      .join('')}
  </svg>`;
};

const stationId = (n) => 'station-' + String(n).padStart(2, '0');

const stationPage = (s, dates, all) => {
  const tone = TONE[s.light];
  const delta = s.history.filter((v) => v !== null);
  const moved = delta.length > 1 ? delta[delta.length - 1] - delta[0] : 0;
  const i = all.findIndex((x) => x.n === s.n);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const nn = String(s.n).padStart(2, '0');

  return visPage(
    `Station ${nn} · ${s.name}`,
    `<div class="v-frag st ${tone}">
       <div class="st-bg" aria-hidden="true">${cascadeField({ width: 520, height: 340, seed: 3 + s.n, cycles: 1 })}</div>
       <!-- The station number, oversized and outlined. It is the one thing that
            has to read from across a room when this is a tile on a board. -->
       <span class="st-ghost" aria-hidden="true">${nn}</span>
       <div class="st-in">
         <p class="v-eyebrow pop" style="animation-delay:.05s">Station ${nn} · ${esc(s.light)}</p>
         <h1 class="st-name pop" style="animation-delay:.12s">${esc(s.name)}</h1>
         <div class="st-viz">
           ${dial(s.score, s.light)}
           ${history(s.history, dates)}
         </div>
         <p class="v-note pop" style="animation-delay:1.35s">${esc(s.note)}</p>
         <p class="st-move pop" style="animation-delay:1.45s">
           ${
             moved > 0
               ? `<span class="up">▲ +${moved}</span> since the first of these inspections`
               : moved < 0
               ? `<span class="down">▼ ${moved}</span> since the first of these inspections`
               : `<span class="flat">Unchanged</span> across all three inspections`
           }${s.potential ? ` · <span class="pot">${s.potential}</span> if finished work is promoted` : ''}
         </p>
         <!-- Walking the set. target=_top so a click inside a Notion embed
              takes the whole page rather than nesting the gallery inside the
              iframe it was launched from. -->
         <nav class="st-nav pop" style="animation-delay:1.55s" aria-label="Stations">
           <a href="./${stationId(prev.n)}.html" target="_top" rel="prev">
             <span aria-hidden="true">←</span> ${esc(prev.name)}
           </a>
           <a class="st-all" href="./index.html" target="_top">All ten</a>
           <a href="./${stationId(next.n)}.html" target="_top" rel="next">
             ${esc(next.name)} <span aria-hidden="true">→</span>
           </a>
         </nav>
         <p class="v-meta"><span>Design system multi-point inspection</span><span>Updated ${esc(
           fmt(inspection.date)
         )}</span></p>
       </div>
     </div>`,
    STATION_CSS
  );
};

const STATION_CSS = `
/* The card has to fill whatever height the embed is given. Without a height on
   the root elements, min-height:100% resolves against auto and the card stops
   at its content, leaving a white band under it inside the iframe. */
html,body{height:100%}
/* Flex column, so the inner block actually stretches. A percentage min-height
   on .st-in resolved against a parent that only had min-height itself, so it
   computed to auto — the content sat in the top third of every embed and the
   footer never reached the bottom. */
.st{position:relative;overflow:hidden;min-height:100%;padding:0;
  display:flex;flex-direction:column;
  border-top:3px solid var(--eo-color-border-hinted)}
.st.good{border-top-color:var(--eo-color-border-utility-positive)}
.st.warn{border-top-color:var(--eo-color-border-utility-warning)}
.st.bad{border-top-color:var(--eo-color-border-utility-negative)}
/* the strand field, masked away from the reading column exactly as on the
   dashboard, so the card frames its own content */
.st-bg{position:absolute;inset:0;pointer-events:none;opacity:.38;
  -webkit-mask-image:linear-gradient(to right,transparent 0,transparent 62%,#000 100%);
          mask-image:linear-gradient(to right,transparent 0,transparent 62%,#000 100%)}
.st-bg svg{width:100%;height:100%}
/* A hard ceiling on the reading column. These are embedded in Notion, where
   the person placing the block chooses the width — without a cap, a full-width
   embed stretched the history SVG (and with it its type) to three times the
   size of the dial next to it. */
.st-in{position:relative;z-index:1;flex:1;
  padding:var(--eo-dimension-padding-block-large);
  display:flex;flex-direction:column;gap:var(--eo-dimension-gap-small);
  max-width:760px}
/* Display scale, not card scale. These are read as a tile on a board, often
   at half size, so the name carries at the size a headline would. */
.st-name{margin:0;font-family:var(--eo-typography-headline-600-font-family,var(--eo-typography-headline-500-font-family));
  font-size:clamp(2rem,5.2vw,3.25rem);line-height:1.05;
  letter-spacing:-.025em;text-wrap:balance}
/* The outlined station number. Sits behind everything, bleeds off the bottom
   right corner, and is the marker you read first at a distance. */
/* Bottom-right, tucked into the space the reading column leaves free. It used
   to sit at -0.3em of a 20rem type size, which put nearly a third of it below
   the card's own overflow:hidden — the marker was there and simply cut off. */
.st-ghost{position:absolute;right:.04em;bottom:-.08em;z-index:0;
  font-family:var(--eo-typography-headline-800-font-family);
  font-size:clamp(7rem,20vw,13rem);line-height:.82;color:transparent;
  -webkit-text-stroke:1.5px var(--eo-color-border-subtle);
  user-select:none;pointer-events:none}
.st.good .st-ghost{-webkit-text-stroke-color:var(--eo-color-border-utility-positive);opacity:.28}
.st.warn .st-ghost{-webkit-text-stroke-color:var(--eo-color-border-utility-warning);opacity:.3}
.st.bad  .st-ghost{-webkit-text-stroke-color:var(--eo-color-border-utility-negative);opacity:.26}

/* Walking the set */
.st-nav{display:flex;align-items:baseline;gap:var(--eo-dimension-gap-default);
  flex-wrap:wrap;margin:var(--eo-dimension-8) 0 0;
  font-family:var(--eo-typography-action-label-100-font-family);
  font-size:var(--eo-typography-body-50-font-size)}
.st-nav a{color:var(--eo-color-content-subtle);text-decoration:none;
  padding:var(--eo-dimension-4) 0;border-bottom:1px solid transparent}
.st-nav a:hover{color:var(--eo-color-content-accent);border-bottom-color:var(--eo-color-border-accent)}
.st-nav a:focus-visible{outline:2px solid var(--eo-color-border-accent);outline-offset:3px;border-radius:2px}
.st-nav .st-all{margin-left:auto;color:var(--eo-color-content-accent);font-weight:700}
.st-viz{display:flex;align-items:center;gap:var(--eo-dimension-gap-largest);
  flex-wrap:wrap;margin:0}
.dial{width:230px;max-width:48%;flex:0 0 auto}
.hist{width:240px;max-width:52%;flex:0 0 auto}

/* Each segment draws itself along its own arc, so the dial fills tick by tick
   rather than sweeping. --l is set generously; a dash longer than the arc
   simply means the whole arc is hidden until the offset unwinds. */
.seg{fill:none;stroke-linecap:butt;stroke-dasharray:60;stroke-dashoffset:60;
  animation:seg .5s cubic-bezier(.22,1,.36,1) forwards}
@keyframes seg{to{stroke-dashoffset:0}}
.seg.off{stroke:var(--eo-color-surface-subtle)}
.seg.on.good{stroke:var(--eo-color-content-utility-positive)}
.seg.on.warn{stroke:var(--eo-color-content-utility-warning)}
.seg.on.bad{stroke:var(--eo-color-content-utility-negative)}
.dial-n{font-family:var(--eo-typography-headline-800-font-family);font-size:80px;
  letter-spacing:-.04em;animation:pop .6s cubic-bezier(.22,1,.36,1) 1.1s backwards}
.dial-n.good{fill:var(--eo-color-content-utility-positive)}
.dial-n.warn{fill:var(--eo-color-content-utility-warning)}
.dial-n.bad{fill:var(--eo-color-content-utility-negative)}
.dial-d{font-family:var(--eo-typography-action-label-100-font-family);font-size:13px;
  letter-spacing:.14em;text-transform:uppercase;fill:var(--eo-color-content-hinted);
  animation:pop .5s cubic-bezier(.22,1,.36,1) 1.2s backwards}

.hist-line{fill:none;stroke:var(--eo-color-content-subtle);stroke-width:1.5;
  stroke-linecap:round;stroke-dasharray:400;stroke-dashoffset:400;
  animation:seg 1s cubic-bezier(.22,1,.36,1) .95s forwards}
.hist-dot{fill:var(--eo-color-content-accent);animation:pop .4s cubic-bezier(.22,1,.36,1) backwards}
.hist-v{font-size:12px;font-weight:700;fill:var(--eo-color-content-emphasized);
  animation:pop .4s cubic-bezier(.22,1,.36,1) backwards}
.hist-x{font-size:10px;letter-spacing:.06em;fill:var(--eo-color-content-hinted)}

.st-move{margin:0;font-size:var(--eo-typography-body-50-font-size);
  color:var(--eo-color-content-hinted)}
.st-move .up{color:var(--eo-color-content-utility-positive);font-weight:700}
.st-move .down{color:var(--eo-color-content-utility-negative);font-weight:700}
.st-move .flat{color:var(--eo-color-content-subtle);font-weight:700}
.st-move .pot{color:var(--eo-color-content-accent);font-weight:700}
.st .v-meta{margin-top:auto}

/* the strand pulse, same as the cascade fragment */
.cf-link{fill:none;stroke:var(--eo-color-content-accent);stroke-width:1;
  stroke-linecap:round;opacity:.14;stroke-dasharray:900;stroke-dashoffset:900;
  animation:seg 1.6s cubic-bezier(.22,1,.36,1) var(--d,0s) forwards}
.cf-node{fill:var(--eo-color-content-accent);opacity:0;
  animation:pop .8s cubic-bezier(.22,1,.36,1) var(--d,0s) forwards}
/* the field is stretched to fill, which fattens the node circles; scaling the
   whole group back keeps them the size they were drawn at */
.st-bg .cascade{transform:scale(1)}
.cf-flow{fill:none;stroke:var(--eo-color-content-accent);stroke-width:1.4;
  stroke-linecap:round;opacity:.45;stroke-dasharray:16 var(--len);
  animation:cf-flow var(--fd,6s) linear var(--fp,0s) infinite}
@keyframes cf-flow{to{stroke-dashoffset:var(--sweep)}}
[data-tier="0"]{--d:.2s}[data-tier="1"]{--d:.5s}
[data-tier="2"]{--d:.8s}[data-tier="3"]{--d:1.1s}
@media(prefers-reduced-motion:reduce){
  .seg,.dial-n,.dial-d,.hist-line,.hist-dot,.hist-v,.cf-link,.cf-node{animation:none}
  .seg,.hist-line{stroke-dashoffset:0}
  .cf-link{opacity:.12}.cf-node{opacity:.26}.cf-flow{display:none}
}
@media(max-width:440px){
  .dial,.hist{width:100%;max-width:100%}
  .st-bg{opacity:.2}
  .st-ghost{font-size:6rem;opacity:.5}
  .st-nav{font-size:.7rem}
}
`;

// The two prior inspections plus this one. Dates come off the report set, not
// hard-coded, so a fourth inspection relabels these on its own.
const HIST_DATES = ['3 Aug', '5 Aug', fmt(inspection.date).replace(/ \d{4}$/, '')];

inspection.stations.forEach((s) =>
  writeFileSync(resolve(outDir, `${stationId(s.n)}.html`), stationPage(s, HIST_DATES, inspection.stations))
);
console.log(`  stations: ${inspection.stations.length} fragments (station-01 … station-${String(inspection.stations.length).padStart(2, '0')})`);
