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
<title>Quality fragments — EGYM One</title>
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
.grid.tall .cell iframe{height:300px;border:0;display:block;background:var(--eo-color-surface-default);border-radius:var(--eo-dimension-border-radius-large)}
figcaption{margin-top:var(--eo-dimension-8)}
figcaption code{font-size:.72rem;color:var(--eo-color-content-hinted);word-break:break-all}
</style>
</head>
<body>
  <h1>Quality fragments</h1>
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
