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
import { cascadeField, scoreRing } from '../src/charts.mjs';
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

/* ---- gallery ---------------------------------------------------------------
   Two levels, not one wall. The old gallery rendered all 27 fragments as live
   iframes at once: 27 documents to lay out before anything was readable, no
   way to tell the ten stations apart at a glance, and — because the embed URL
   was printed as text rather than linked — nothing to click.

   Now the top level is a summary card per fragment, drawn from the same data
   the fragment itself is drawn from, so the overview is scannable without
   loading a single frame. Opening one mounts exactly one iframe. The detail
   is addressed by hash, so a fragment can be linked to directly and the
   browser's back button behaves. */

const TONE_OF_LIGHT = { green: 'good', yellow: 'warn', red: 'bad' };

// One catalogue for every level of the page: the cards are rendered from it at
// build time and the detail view reads it at runtime, so the two can never
// describe different sets.
const catalogue = [
  {
    group: 'Inspection stations',
    note:
      'Each of the ten stations as its own embeddable page — dial, history across the inspections, and the finding. Animated, self-contained, no JavaScript.',
    items: data.inspection.stations.map((s) => {
      const h = s.history || [];
      const delta = h.length > 1 ? s.score - h[0] : 0;
      return {
        id: 'station-' + String(s.n).padStart(2, '0'),
        eyebrow: `Station ${String(s.n).padStart(2, '0')}`,
        metric: String(s.score),
        unit: '/10',
        title: s.name,
        note: s.note,
        tone: TONE_OF_LIGHT[s.light] || 'warn',
        ring: { value: s.score, max: 10, label: s.name, sub: 'of 10' },
        history: h,
        potential: s.potential,
        h: 430,
        delta: delta > 0 ? `+${delta} since first inspection` : delta < 0 ? `${delta} since first inspection` : 'unchanged',
      };
    }),
  },
  {
    group: 'Visual',
    note: 'The four that carry a drawing rather than a number. These are the ones worth putting on a slide.',
    items: [
      { id: 'cascade', h: 340, eyebrow: 'Token system', metric: '1,619', unit: 'variables', title: 'Three tiers, two mode layers', note: 'The cascade, drawn — how one change reaches every brand and breakpoint.', tone: 'good' },
      { id: 'coverage-rings', h: 340, eyebrow: 'Coverage', metric: '100%', unit: 'design', title: 'Design is done. Code is not.', note: 'The two coverage figures side by side, which is the whole argument in one image.', tone: 'warn' },
      { id: 'stations', h: 340, eyebrow: 'Inspection', metric: String(data.inspection.shippedTotal ?? ''), unit: '/100', title: 'All ten stations at once', note: 'The full inspection strip — every station, its score and its light.', tone: 'warn' },
      { id: 'now', h: 400, eyebrow: 'Right now', metric: '', unit: '', title: 'What is moving today', note: 'Live from the Jira queue: what is ready for release and what is in development.', tone: 'good' },
    ],
  },
  {
    group: 'Measurements',
    note: 'One fragment per number. Each states the figure, what proves it, and when it was last read.',
    items: fragments.items.map((f) => ({
      id: f.id,
      eyebrow: f.source,
      metric: f.value,
      unit: '',
      title: f.label,
      note: f.proof,
      tone: f.tone,
      date: f.date,
      // A percentage is a ring; an absolute count has no denominator to draw.
      ring: /^\d+(\.\d+)?%$/.test(String(f.value))
        ? { value: f.value, max: 100, at: parseFloat(f.value), label: f.label, sub: f.source }
        : null,
      h: 230,
    })),
  },
];

/* The card is the dashboard's card, not a second visual language: a white
   surface with an accent eyebrow, a headline, and the same score ring the
   Coverage, Quality, Delivery and Governance tabs use. A fragment that looks
   nothing like the page it came from is a fragment nobody trusts is the same
   number. The ring carries the tone, so the coloured top edge is gone with it. */
const cardOf = (it) => `
  <a class="card" href="#${it.id}" data-id="${it.id}">
    <span class="c-eyebrow">${esc(it.eyebrow || '')}</span>
    <span class="c-title">${esc(it.title)}</span>
    ${it.ring
      ? scoreRing(it.ring.value, { max: it.ring.max, at: it.ring.at, label: it.ring.label, sub: it.ring.sub, tone: it.tone, size: 118 })
      : `<span class="c-metric ${it.tone}">${esc(it.metric || '')}</span>`}
    <span class="c-note">${esc(it.note || '')}</span>
    <span class="c-foot">${esc(it.delta || 'Open fragment')}<span class="c-go" aria-hidden="true">→</span></span>
  </a>`;

/* ---- detail bodies ---------------------------------------------------------
   Built here, at build time, one per fragment. The detail is not a bigger copy
   of the embeddable card — that card is deliberately one number, because it has
   to survive being dropped into a Notion page at 320px. The detail is where the
   number gets its working: the arc, the run of inspections behind it, what
   moved and what it would take to move further. The embeddable card is shown at
   the bottom as the thing you actually copy. */

// A local line chart: the module's own history() is declared further down the
// file and would be in its temporal dead zone up here.
const histChart = (vals, dates, max = 10) => {
  const pts = vals.map((v, i) => [i, v]).filter(([, v]) => v != null);
  if (pts.length < 2) return '';
  const w = 300, h = 108, padX = 30, padTop = 22, padBot = 30;
  const x = (i) => padX + (i * (w - padX * 2)) / (vals.length - 1);
  const y = (v) => padTop + (1 - v / max) * (h - padTop - padBot);
  const d = pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="dhist" viewBox="0 0 ${w} ${h}" role="img"
    aria-label="Score across inspections: ${pts.map(([, v]) => v).join(', ')}">
    <line class="dhist-base" x1="${padX}" y1="${h - padBot}" x2="${w - padX}" y2="${h - padBot}"/>
    <path class="dhist-line" d="${d}"/>
    ${pts.map(([i, v]) => `<circle class="dhist-dot" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4"/>
      <text class="dhist-v" x="${x(i).toFixed(1)}" y="${(y(v) - 11).toFixed(1)}" text-anchor="middle">${v}</text>`).join('')}
    ${dates.map((dt, i) => `<text class="dhist-x" x="${x(i).toFixed(1)}" y="${h - 9}" text-anchor="middle">${esc(dt)}</text>`).join('')}
  </svg>`;
};

const DETAIL_DATES = ['3 Aug', '5 Aug', fmt(data.inspection.date).replace(/ \d{4}$/, '')];

const factRow = (k, v, tone = '') => `<div class="d-fact"><span>${esc(k)}</span><b class="${tone}">${esc(String(v))}</b></div>`;

const detailOf = (it) => {
  const ring = it.ring
    ? scoreRing(it.ring.value, { max: it.ring.max, at: it.ring.at, label: '', sub: it.ring.sub, tone: it.tone, size: 168 })
    : `<p class="d-big ${it.tone}">${esc(it.metric || '')}</p>`;

  const chart = it.history && it.history.length > 1
    ? `<figure class="d-chart">
         <figcaption>Across the inspections</figcaption>
         ${histChart(it.history, DETAIL_DATES.slice(0, it.history.length))}
       </figure>`
    : '';

  const facts = it.history && it.history.length
    ? [
        factRow('First inspection', it.history[0] + ' / 10'),
        factRow('This inspection', it.ring.value + ' / 10'),
        factRow('Movement', it.delta, it.delta && it.delta.startsWith('+') ? 'good' : ''),
        it.potential ? factRow('If finished work is promoted', it.potential + ' / 10', 'good') : '',
      ].join('')
    : [
        it.eyebrow ? factRow('Measured by', it.eyebrow) : '',
        it.date ? factRow('Last read', fmt(it.date)) : '',
      ].join('');

  return `
    <div class="d-top">
      <div class="d-ring">${ring}</div>
      <div class="d-body">
        <p class="d-finding">${esc(it.note || '')}</p>
        <div class="d-facts">${facts}</div>
      </div>
      ${chart}
    </div>`;
};

const groupOf = (g) => `
  <section class="group">
    <h2>${esc(g.group)}</h2>
    <p class="lede">${esc(g.note)}</p>
    <div class="grid">${g.items.map(cardOf).join('')}</div>
  </section>`;

const GALLERY_CSS = `
body{background:var(--eo-color-surface-subtle);padding:var(--eo-dimension-40) clamp(1.25rem,4vw,4rem);min-height:100vh}
.wrap{max-width:1240px;margin:0 auto}
h1{font-family:var(--eo-typography-headline-500-font-family);font-size:var(--eo-typography-headline-500-font-size);line-height:1.1;margin:0 0 var(--eo-dimension-8)}
.intro{margin:0 0 var(--eo-dimension-8);color:var(--eo-color-content-subtle);max-width:70ch}
.stamp{margin:0 0 var(--eo-dimension-40);color:var(--eo-color-content-hinted);font-size:var(--eo-typography-body-50-font-size)}
h2{font-family:var(--eo-typography-headline-300-font-family);font-size:var(--eo-typography-headline-300-font-size);margin:var(--eo-dimension-40) 0 var(--eo-dimension-8)}
.group .lede{margin:0 0 var(--eo-dimension-16);color:var(--eo-color-content-subtle);max-width:70ch;font-size:var(--eo-typography-body-50-font-size)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:var(--eo-dimension-gap-large)}

/* The card is the dashboard's card: white surface, accent eyebrow, headline,
   score ring. The ring carries the tone, so there is no coloured top edge —
   that stripe was the main thing making these read as a different system. */
.card{
  display:flex;flex-direction:column;gap:var(--eo-dimension-gap-small);
  background:var(--eo-color-surface-default);
  border-radius:var(--eo-dimension-border-radius-large);
  padding:var(--eo-dimension-padding-block-large) var(--eo-dimension-padding-inline-default);
  text-decoration:none;color:inherit;
  transition:transform .22s cubic-bezier(.2,.7,.3,1),box-shadow .22s cubic-bezier(.2,.7,.3,1);
}
.card:hover,.card:focus-visible{
  transform:translateY(-3px);
  box-shadow:
    var(--eo-shadow-all-around-level-1-base-x) var(--eo-shadow-all-around-level-1-base-y)
    var(--eo-shadow-all-around-level-1-base-blur) var(--eo-shadow-all-around-level-1-base-spread)
    var(--eo-shadow-all-around-level-1-base-color);
}
.card:focus-visible{outline:2px solid var(--eo-color-border-accent);outline-offset:3px}
.c-eyebrow{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--eo-color-content-accent)}
.c-title{
  font-family:var(--eo-typography-headline-300-font-family);
  font-size:var(--eo-typography-headline-300-font-size);
  line-height:1.2;letter-spacing:-.01em;
}
.c-metric{
  font-family:var(--eo-typography-headline-500-font-family);
  font-size:var(--eo-typography-headline-500-font-size);
  line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;
  margin:var(--eo-dimension-8) 0;
}
.c-metric.good{color:var(--eo-color-content-utility-positive)}
.c-metric.warn{color:var(--eo-color-content-utility-warning)}
.c-metric.bad{color:var(--eo-color-content-utility-negative)}
.c-note{font-size:var(--eo-typography-body-50-font-size);line-height:var(--eo-typography-body-50-line-height);color:var(--eo-color-content-subtle)}
.c-foot{
  margin-top:auto;padding-top:var(--eo-dimension-12);
  border-top:1px solid var(--eo-color-border-subtle);
  font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-hinted);
  display:flex;justify-content:space-between;align-items:center;gap:var(--eo-dimension-gap-small);
}
.c-go{transition:transform .22s cubic-bezier(.2,.7,.3,1)}
.card:hover .c-go{transform:translateX(4px);color:var(--eo-color-content-accent)}

/* The score ring, lifted verbatim from the dashboard stylesheet so the two
   cannot drift apart. */
.c-donut-track{fill:none;stroke:var(--eo-color-surface-subtle)}
.c-donut-fill{fill:none;stroke:var(--eo-color-surface-accent);stroke-linecap:round}
.c-donut-fill.good{stroke:var(--eo-color-surface-utility-positive)}
.c-donut-fill.warn{stroke:var(--eo-color-surface-utility-warning)}
.c-donut-fill.bad{stroke:var(--eo-color-surface-utility-negative)}
.sring{text-align:center;display:grid;justify-items:center;gap:var(--eo-dimension-gap-small);margin:var(--eo-dimension-8) 0}
.sring .chart{width:100%}
.sring-n{font-family:var(--eo-typography-headline-500-font-family);font-size:38px;font-weight:700;fill:var(--eo-color-content-emphasized)}
.sring.good .sring-n{fill:var(--eo-color-content-utility-positive)}
.sring.warn .sring-n{fill:var(--eo-color-content-utility-warning)}
.sring.bad .sring-n{fill:var(--eo-color-content-utility-negative)}
.sring-k{margin:0;font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-default);font-weight:600;text-wrap:balance}
.sring-t{margin:0;font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-hinted)}
/* The card already names the station above the ring; the ring's own label
   would say it a second time. */
.card .sring-k{display:none}

/* ---- detail ---- */
.detail{display:none}
body.is-detail .overview{display:none}
body.is-detail .detail{display:block}
.back{
  display:inline-flex;align-items:center;gap:.4rem;
  margin:0 0 var(--eo-dimension-16);
  font-size:var(--eo-typography-body-50-font-size);
  color:var(--eo-color-content-subtle);text-decoration:none;
}
.back:hover{color:var(--eo-color-content-accent)}
.d-head{margin:0 0 var(--eo-dimension-16)}
.d-head h2{margin:0}
.d-eyebrow{margin:0 0 var(--eo-dimension-4);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--eo-color-content-accent)}
.d-sub{
  font-family:var(--eo-typography-headline-300-font-family);
  font-size:var(--eo-typography-headline-300-font-size);
  margin:var(--eo-dimension-40) 0 var(--eo-dimension-12);
}

/* The worked-out view: the arc, the finding and the run of inspections behind
   the number, side by side. The embeddable card is one number by design; this
   is where that number shows what it rests on. */
.d-work{
  background:var(--eo-color-surface-default);
  border-radius:var(--eo-dimension-border-radius-large);
  padding:var(--eo-dimension-padding-block-large) var(--eo-dimension-padding-inline-default);
  margin-top:var(--eo-dimension-16);
}
.d-top{display:grid;grid-template-columns:minmax(170px,200px) minmax(260px,1fr) auto;gap:var(--eo-dimension-gap-largest);align-items:start}
@media (max-width:900px){.d-top{grid-template-columns:1fr}}
.d-ring{min-width:0}
.d-big{
  font-family:var(--eo-typography-headline-500-font-family);
  font-size:var(--eo-typography-headline-500-font-size);
  margin:0;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;
}
.d-big.good{color:var(--eo-color-content-utility-positive)}
.d-big.warn{color:var(--eo-color-content-utility-warning)}
.d-big.bad{color:var(--eo-color-content-utility-negative)}
.d-finding{margin:0 0 var(--eo-dimension-16);color:var(--eo-color-content-default);max-width:60ch}
.d-facts{display:grid;gap:0}
.d-fact{
  display:flex;justify-content:space-between;gap:var(--eo-dimension-gap-default);
  padding:var(--eo-dimension-8) 0;
  border-bottom:1px solid var(--eo-color-border-subtle);
  font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-subtle);
}
.d-fact:last-child{border-bottom:0}
.d-fact b{color:var(--eo-color-content-emphasized);font-variant-numeric:tabular-nums}
.d-fact b.good{color:var(--eo-color-content-utility-positive)}
.d-chart{margin:0;min-width:0}
.d-chart figcaption{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--eo-color-content-hinted);margin-bottom:var(--eo-dimension-8)}
.dhist{width:100%;max-width:300px;height:auto;overflow:visible}
.dhist-base{stroke:var(--eo-color-border-subtle);stroke-width:1}
.dhist-line{fill:none;stroke:var(--eo-color-content-accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dhist-dot{fill:var(--eo-color-content-accent)}
.dhist-v{font-size:12px;font-weight:700;fill:var(--eo-color-content-emphasized);font-variant-numeric:tabular-nums}
.dhist-x{font-size:10px;fill:var(--eo-color-content-hinted)}
.stage{
  background:var(--eo-color-surface-default);
  border-radius:var(--eo-dimension-border-radius-large);
  border:1px solid var(--eo-color-border-subtle);
  overflow:hidden;
}
.stage iframe{width:100%;height:380px;border:0;display:block;background:var(--eo-color-surface-default)}
.embed{
  margin-top:var(--eo-dimension-16);
  display:flex;flex-wrap:wrap;align-items:center;gap:var(--eo-dimension-gap-default);
}
.embed code{
  flex:1 1 22rem;min-width:0;
  font-size:.72rem;word-break:break-all;color:var(--eo-color-content-subtle);
  background:var(--eo-color-surface-default);
  border:1px solid var(--eo-color-border-subtle);
  border-radius:var(--eo-dimension-border-radius-default);
  padding:var(--eo-dimension-8) var(--eo-dimension-12);
}
.embed button,.embed a.open{
  font:inherit;font-size:var(--eo-typography-body-50-font-size);
  padding:var(--eo-dimension-8) var(--eo-dimension-16);
  border-radius:var(--eo-dimension-border-radius-round);
  border:1px solid var(--eo-color-border-emphasized);
  background:var(--eo-color-surface-transparent);
  color:var(--eo-color-content-emphasized);
  cursor:pointer;text-decoration:none;white-space:nowrap;
}
.embed button:hover,.embed a.open:hover{background:var(--eo-color-surface-hovered)}
.hint{margin:var(--eo-dimension-8) 0 0;font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-hinted)}
.d-nav{display:flex;justify-content:space-between;gap:var(--eo-dimension-gap-default);margin-top:var(--eo-dimension-24)}
.d-nav a{font-size:var(--eo-typography-body-50-font-size);color:var(--eo-color-content-subtle);text-decoration:none}
.d-nav a:hover{color:var(--eo-color-content-accent)}
@media (prefers-reduced-motion:reduce){.card,.c-go{transition:none}.card:hover{transform:none}}
`;

const index = `<!doctype html>
<html lang="en" class="brand-egym light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EGYM One — KPI fragments</title>
<link rel="stylesheet" href="../vendor/egym-one-tokens.css">
<style>
${CSS}
${GALLERY_CSS}
</style>
</head>
<body>
<div class="wrap">
  <h1>KPI fragments</h1>
  <p class="intro">${esc(fragments.note)}</p>
  <p class="stamp">Updated ${esc(fmt(fragments.updated))} · open any fragment for its embed URL, then paste that into Notion, FigJam or Confluence and choose Embed</p>

  <div class="overview">
    ${catalogue.map(groupOf).join('')}
  </div>

  <div class="detail" id="detail">
    <a class="back" href="#" id="back">← All fragments</a>
    <div class="d-head">
      <p class="d-eyebrow" id="d-eyebrow"></p>
      <h2 id="d-title"></h2>
    </div>
    <div class="d-work" id="d-work"></div>
    <h3 class="d-sub">The embeddable card</h3>
    <div class="stage"><iframe id="d-frame" title="Fragment preview"></iframe></div>
    <div class="embed">
      <code id="d-url"></code>
      <button type="button" id="d-copy">Copy embed URL</button>
      <a class="open" id="d-open" target="_blank" rel="noopener">Open standalone</a>
    </div>
    <p class="hint">The URL above is the published one. It works as an embed once this build is on GitHub Pages.</p>
    <div class="d-nav">
      <a href="#" id="d-prev"></a>
      <a href="#" id="d-next"></a>
    </div>
  </div>
</div>

<script>
/* The catalogue is emitted once and used by both levels, so the detail view
   can never describe a fragment the overview does not list. */
const BASE = ${JSON.stringify(BASE)};
const ITEMS = ${JSON.stringify(
  catalogue.flatMap((g) =>
    g.items.map((it) => ({ id: it.id, title: it.title, eyebrow: it.eyebrow || '', h: it.h, body: detailOf(it) }))
  )
)};
const byId = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

const $ = (s) => document.querySelector(s);
const frame = $('#d-frame');

function render() {
  const id = location.hash.replace(/^#/, '');
  const it = byId[id];
  if (!it) {
    document.body.classList.remove('is-detail');
    // Unmount the frame so a closed fragment stops running.
    frame.removeAttribute('src');
    document.title = 'EGYM One — KPI fragments';
    return;
  }
  const i = ITEMS.findIndex((x) => x.id === id);
  $('#d-title').textContent = it.title;
  $('#d-eyebrow').textContent = it.eyebrow;
  $('#d-work').innerHTML = it.body;
  const url = BASE + '/' + id + '.html';
  $('#d-url').textContent = url;
  $('#d-open').href = './' + id + '.html';
  // Each fragment is drawn for its own height; a shared stage left the
  // one-number cards floating in half a screen of nothing.
  frame.style.height = (it.h || 380) + 'px';
  frame.src = './' + id + '.html';
  document.body.classList.add('is-detail');
  document.title = it.title + ' — KPI fragments';

  const prev = ITEMS[(i - 1 + ITEMS.length) % ITEMS.length];
  const next = ITEMS[(i + 1) % ITEMS.length];
  $('#d-prev').textContent = '← ' + prev.title;
  $('#d-prev').href = '#' + prev.id;
  $('#d-next').textContent = next.title + ' →';
  $('#d-next').href = '#' + next.id;
  window.scrollTo(0, 0);
}

$('#d-copy').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText($('#d-url').textContent);
    btn.textContent = 'Copied';
  } catch {
    // Clipboard is permission-gated; selecting the text is the honest fallback.
    const r = document.createRange();
    r.selectNodeContents($('#d-url'));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    btn.textContent = 'Selected — press ⌘C';
  }
  setTimeout(() => { btn.textContent = 'Copy embed URL'; }, 2000);
});

// Escape closes the detail, which is what every reader tries first.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('is-detail')) location.hash = '';
});

addEventListener('hashchange', render);
render();
</script>
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
       <p class="v-title">${data.tokenAudit.variables.toLocaleString('en-GB')} variables, three tiers</p>
       <p class="v-note">Core → Brand (semantic) → Component, with Breakpoint and Appearance as mode layers across them. ${data.tokenAudit.aliasPct}% of values resolve through an alias rather than a literal, which is what lets one change reach every brand and breakpoint at once.</p>
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
      resolution order. No JS: this fragment is an iframe
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
