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
  padding:var(--eo-dimension-24);
  display:flex;flex-direction:column;gap:var(--eo-dimension-8);
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
  display:flex;flex-wrap:wrap;gap:var(--eo-dimension-4) var(--eo-dimension-8);justify-content:space-between;
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
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--eo-dimension-16)}
.cell{margin:0}
.cell iframe{width:100%;height:230px;border:0;display:block;background:var(--eo-color-surface-default);border-radius:var(--eo-dimension-border-radius-large)}
figcaption{margin-top:var(--eo-dimension-8)}
figcaption code{font-size:.72rem;color:var(--eo-color-content-hinted);word-break:break-all}
</style>
</head>
<body>
  <h1>Quality fragments</h1>
  <p class="lede">${esc(fragments.note)}</p>
  <p class="stamp">Updated ${esc(fmt(fragments.updated))} · paste any URL below into Notion, FigJam or Confluence and choose Embed</p>

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
