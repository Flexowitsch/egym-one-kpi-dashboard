/**
 * Local dev proxy for the theme console.
 *
 * WHY THIS EXISTS
 * The dashboard is a static site served from a public repo through GitHub
 * Pages. There is no server, so there is nowhere to keep a secret: any API key
 * the page used to derive a theme would have to be in the page, which on a
 * public domain means it is everyone's key within minutes.
 *
 * So the key never goes near the browser and never goes near this repo. It is
 * read from the environment, this process holds it, and the page talks to this
 * process instead of to Anthropic.
 *
 *   export ANTHROPIC_API_KEY=sk-ant-...      (or put it in .env — gitignored)
 *   npm run theme-server
 *
 * The published site has no access to this and falls back to the local
 * derivation in src/theme-console.js, which needs no key at all. That fallback
 * is not a degraded mode bolted on afterwards — it is what ships, and the
 * model is the upgrade you get while demoing from a laptop.
 *
 * For a permanently prompt-capable published site, the same handler moves to a
 * Cloudflare Worker or Netlify Function with the key as a platform secret; the
 * browser contract below does not change.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// .env is gitignored. Parsed here rather than pulling in a dependency.
if (existsSync(resolve(root, '.env'))) {
  for (const line of readFileSync(resolve(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const KEY = process.env.ANTHROPIC_API_KEY;
const PORT = Number(process.env.THEME_PORT || 8787);

if (!KEY) {
  console.error('ANTHROPIC_API_KEY is not set.');
  console.error('  export ANTHROPIC_API_KEY=sk-ant-...   or put it in .env (gitignored)');
  process.exit(1);
}

/* The model returns a theme, not prose. Constraining it to a fixed set of
   token names is what makes the output safe to apply directly: anything it
   invents outside this list is dropped by the browser rather than injected
   into the page. */
const TOKENS = [
  'accent', 'accentContent', 'surface', 'surfaceSubtle', 'surfaceEmphasized',
  'content', 'contentSubtle', 'contentOnEmphasized', 'border',
  'radiusSmall', 'radiusDefault', 'radiusLarge', 'radiusRound',
  'fontDisplay', 'fontBody', 'fontMono',
  'letterSpacingDisplay', 'strandDensity', 'strandOpacity',
];

const SYSTEM = `You derive design-system themes. You are given a short description of a look and you return one JSON object, nothing else.

Keys you may use (omit any you do not want to change):
  Colours, as #rrggbb: accent, accentContent, surface, surfaceSubtle, surfaceEmphasized, content, contentSubtle, contentOnEmphasized, border
  Radii, as a CSS length: radiusSmall, radiusDefault, radiusLarge, radiusRound
  Type, as a CSS font-family list: fontDisplay, fontBody, fontMono
  letterSpacingDisplay, as a CSS length (e.g. "-0.03em")
  strandDensity, a number 0-1 — how busy the background pattern is
  strandOpacity, a number 0-1 — how present the background pattern is
  name, a two or three word label for the theme

Hard requirements:
- content on surface must reach WCAG AA (4.5:1). accentContent on surface must reach 4.5:1. contentOnEmphasized on surfaceEmphasized must reach 4.5:1. Compute this and adjust before answering.
- Only use font families that are on a normal machine or are generic (system-ui, Georgia, "Times New Roman", Menlo, ui-monospace, Courier New, Impact, Verdana, Helvetica, Arial, serif, sans-serif, monospace, cursive). No web fonts — the page cannot load them.
- Return raw JSON. No markdown fence, no commentary.`;

const json = (res, code, body) => {
  res.writeHead(code, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
  });
  res.end(JSON.stringify(body));
};

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method !== 'POST' || !req.url.startsWith('/api/theme')) return json(res, 404, { error: 'not found' });

  let raw = '';
  req.on('data', (c) => {
    raw += c;
    if (raw.length > 4000) req.destroy(); // a vibe is a sentence, not a payload
  });
  req.on('end', async () => {
    let prompt = '';
    try { prompt = String(JSON.parse(raw).prompt || '').slice(0, 500); } catch { /* fall through */ }
    if (!prompt) return json(res, 400, { error: 'no prompt' });

    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          max_tokens: 1200,
          system: SYSTEM,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!r.ok) {
        const detail = await r.text();
        console.error(`Anthropic ${r.status}: ${detail.slice(0, 300)}`);
        return json(res, 502, { error: `model returned ${r.status}` });
      }
      const body = await r.json();
      const text = (body.content || []).map((c) => c.text || '').join('').trim();
      // Strip a fence if the model added one despite being asked not to.
      const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
      let theme;
      try {
        theme = JSON.parse(cleaned);
      } catch {
        console.error('Unparseable model output:', text.slice(0, 300));
        return json(res, 502, { error: 'model did not return JSON' });
      }
      // Drop anything not on the allow-list before it reaches the browser.
      const safe = { name: String(theme.name || prompt).slice(0, 60) };
      for (const k of TOKENS) if (theme[k] != null) safe[k] = theme[k];
      json(res, 200, { theme: safe, source: 'claude' });
    } catch (err) {
      console.error(err);
      json(res, 502, { error: 'request failed' });
    }
  });
}).listen(PORT, () => {
  console.log(`Theme console proxy on http://localhost:${PORT}/api/theme`);
  console.log('The key stays in this process. It is never sent to the browser.');
});
