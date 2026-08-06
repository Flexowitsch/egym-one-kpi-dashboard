/**
 * Theme console — the white-label demo.
 *
 * The point of this is not that the page can look different. It is that the
 * page can look *completely* different without a rebuild, because every colour,
 * radius, face and texture on it resolves through the token cascade. Anything
 * that does not move when a theme is applied was never on a token, so this
 * doubles as the most unforgiving audit on the dashboard.
 *
 * Two ways to derive a theme:
 *
 *   1. Locally, from the description, with no network and no key. This is what
 *      the published site uses and it is not a fallback bolted on afterwards —
 *      it is the shipping path.
 *   2. Through Claude, when scripts/theme-server.mjs is running. The key lives
 *      in that process; it never reaches the browser and never enters the repo,
 *      because this site is served from a public repo where a key in the page
 *      is a key in everyone's hands.
 *
 * Whatever produced the theme, it is solved to WCAG AA here before it is
 * allowed onto the page. A theme that cannot be read is not a theme.
 */

const PROXY = 'http://localhost:8787/api/theme';
const STYLE_ID = 'eo-theme-overrides';

/* ────────────────────────────────────────────────────────── colour maths ─── */

const hex2rgb = (h) => {
  const s = String(h).trim().replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
};
const rgb2hex = (rgb) =>
  '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

// WCAG 2.1 relative luminance
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [la, lb] = [lum(hex2rgb(a)), lum(hex2rgb(b))];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/* Walk a colour toward black or white until it clears the threshold against
   its background. Chosen over "pick a safe colour" because it preserves the
   hue the theme asked for — a brand that has to pass AA should shift in
   lightness, not become a different colour. */
const solve = (fg, bg, target = 4.5) => {
  if (contrast(fg, bg) >= target) return fg;
  const toward = lum(hex2rgb(bg)) > 0.4 ? [0, 0, 0] : [255, 255, 255];
  let rgb = hex2rgb(fg);
  for (let i = 0; i < 40; i++) {
    rgb = rgb.map((v, k) => v + (toward[k] - v) * 0.06);
    const out = rgb2hex(rgb);
    if (contrast(out, bg) >= target) return out;
  }
  return rgb2hex(toward);
};

/* ─────────────────────────────────────────────────── local derivation ─── */

/* Axes rather than presets. A description moves the dials; the theme is
   assembled from where they land. That means "brutalist newspaper" and
   "soft rounded pastel" reach different places without either being a
   hard-coded entry in a table. */
const AXES = [
  { re: /brutal|raw|harsh|concrete|swiss|industrial/, set: { sharp: 1, contrast: 1, mono: 0.6, dense: 0.2 } },
  { re: /soft|gentle|calm|pastel|friendly|round|warm/, set: { sharp: 0, contrast: -0.4, warm: 1, dense: 0.3 } },
  { re: /terminal|code|hacker|matrix|console|mono/, set: { mono: 1, sharp: 1, dark: 1, dense: 0.9 } },
  { re: /editorial|magazine|paper|print|newspaper|serif/, set: { serif: 1, sharp: 0.7, contrast: 0.6, dense: 0.1 } },
  { re: /dark|night|midnight|noir|black/, set: { dark: 1 } },
  { re: /light|bright|clean|minimal|white/, set: { dark: -1, dense: 0.1 } },
  { re: /playful|fun|pop|vivid|bold|loud/, set: { sat: 1, sharp: 0, dense: 0.8 } },
  { re: /luxury|elegant|premium|refined|quiet/, set: { serif: 1, sat: -0.5, dense: 0.15, contrast: 0.4 } },
  { re: /tech|digital|cyber|neon|futur/, set: { sat: 1, dark: 1, mono: 0.5, dense: 1 } },
  { re: /nature|organic|earth|forest|green/, set: { hue: 140, warm: 0.4, dense: 0.5 } },
  { re: /ocean|water|aqua|sea|blue|marine/, set: { hue: 195, dense: 0.6 } },
  { re: /sunset|orange|amber|fire|rust/, set: { hue: 24, warm: 1 } },
  { re: /berry|purple|violet|plum/, set: { hue: 285 } },
  { re: /rose|pink|blush/, set: { hue: 340, warm: 0.6 } },
];

const hsl2hex = (h, s, l) => {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return (l / 100 - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))) * 255;
  };
  return rgb2hex([f(0), f(8), f(4)]);
};

export function deriveLocally(prompt) {
  const p = String(prompt || '').toLowerCase();
  const d = { sharp: 0.5, contrast: 0, mono: 0, serif: 0, dark: 0, sat: 0, warm: 0, hue: null, dense: 0.45 };
  let matched = 0;
  for (const a of AXES) {
    if (a.re.test(p)) {
      matched++;
      Object.assign(d, a.set);
    }
  }
  // Nothing recognised: rotate the hue off the prompt's own characters so the
  // same words always give the same theme, and different words give a
  // different one. Deterministic, not random — a shared URL has to reproduce.
  if (d.hue === null) {
    let h = 0;
    for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) % 360;
    d.hue = matched ? h : h;
  }

  const dark = d.dark > 0;
  const sat = Math.round(Math.max(18, Math.min(92, 58 + d.sat * 26)));
  const accentL = dark ? 62 : 38 - d.contrast * 6;

  const surface = dark ? hsl2hex(d.hue, 12, 8) : hsl2hex(d.hue, d.warm > 0 ? 26 : 14, 97);
  const surfaceSubtle = dark ? hsl2hex(d.hue, 12, 11) : hsl2hex(d.hue, d.warm > 0 ? 22 : 12, 94);
  const surfaceEmphasized = dark ? hsl2hex(d.hue, 16, 15) : hsl2hex(d.hue, 18, 12);
  const contentRaw = dark ? hsl2hex(d.hue, 8, 92) : hsl2hex(d.hue, 20, 12 - d.contrast * 4);
  const accentRaw = hsl2hex(d.hue, sat, accentL);

  const radius = d.sharp > 0.8 ? '0px' : d.sharp > 0.4 ? '4px' : '14px';
  const radiusL = d.sharp > 0.8 ? '0px' : d.sharp > 0.4 ? '8px' : '26px';

  const display =
    d.mono > 0.5 ? 'ui-monospace, Menlo, "Courier New", monospace'
    : d.serif > 0.5 ? 'Georgia, "Times New Roman", serif'
    : 'system-ui, "Helvetica Neue", Arial, sans-serif';
  const body =
    d.mono > 0.7 ? 'ui-monospace, Menlo, "Courier New", monospace'
    : d.serif > 0.5 ? 'Georgia, "Times New Roman", serif'
    : 'system-ui, "Helvetica Neue", Arial, sans-serif';

  return {
    name: prompt ? prompt.slice(0, 48) : 'Derived',
    surface, surfaceSubtle, surfaceEmphasized,
    content: contentRaw,
    contentSubtle: dark ? hsl2hex(d.hue, 8, 66) : hsl2hex(d.hue, 12, 42),
    contentOnEmphasized: '#ffffff',
    accent: accentRaw,
    accentContent: accentRaw,
    border: dark ? hsl2hex(d.hue, 12, 24) : hsl2hex(d.hue, 14, 86),
    radiusSmall: radius, radiusDefault: radius, radiusLarge: radiusL,
    radiusRound: d.sharp > 0.8 ? '0px' : '999px',
    fontDisplay: display, fontBody: body,
    fontMono: 'ui-monospace, Menlo, "Courier New", monospace',
    letterSpacingDisplay: d.mono > 0.5 ? '0.02em' : d.serif > 0.5 ? '-0.01em' : '-0.03em',
    strandDensity: d.dense,
    strandOpacity: dark ? 0.5 : 0.32,
  };
}

/* ───────────────────────────────────────────────────────────── applying ─── */

/* Solved here, not at the source, so a theme from the model and a theme from
   the local derivation are held to exactly the same bar. */
export function solveTheme(t) {
  const s = { ...t };
  s.surface ||= '#f2f2f0';
  s.surfaceSubtle ||= s.surface;
  s.surfaceEmphasized ||= '#1a1a1a';
  s.content = solve(s.content || '#161616', s.surface, 4.5);
  s.contentSubtle = solve(s.contentSubtle || s.content, s.surface, 4.5);
  s.accentContent = solve(s.accentContent || s.accent || '#b34700', s.surface, 4.5);
  s.contentOnEmphasized = solve(s.contentOnEmphasized || '#ffffff', s.surfaceEmphasized, 4.5);
  s.accent ||= s.accentContent;
  s.border ||= s.contentSubtle;
  return s;
}

// Maps a theme onto the real token names. Everything the dashboard paints with
// resolves through one of these, which is why one <style> block is enough.
const CSS_MAP = {
  accentContent: ['--eo-color-content-accent', '--eo-color-border-accent'],
  accent: ['--eo-color-surface-accent'],
  surface: ['--eo-color-surface-default'],
  surfaceSubtle: ['--eo-color-surface-subtle'],
  surfaceEmphasized: ['--eo-color-surface-emphasized'],
  content: ['--eo-color-content-emphasized', '--eo-color-content-default'],
  contentSubtle: ['--eo-color-content-subtle', '--eo-color-content-hinted'],
  contentOnEmphasized: ['--eo-color-content-on-emphasized'],
  border: ['--eo-color-border-default', '--eo-color-border-subtle', '--eo-color-border-hinted'],
  radiusSmall: ['--eo-dimension-border-radius-small'],
  radiusDefault: ['--eo-dimension-border-radius-default'],
  radiusLarge: ['--eo-dimension-border-radius-large'],
  radiusRound: ['--eo-dimension-border-radius-round'],
  fontDisplay: [
    '--eo-typography-headline-800-font-family', '--eo-typography-headline-700-font-family',
    '--eo-typography-headline-500-font-family', '--eo-typography-headline-400-font-family',
    '--eo-typography-headline-300-font-family', '--eo-typography-headline-200-font-family',
  ],
  fontBody: ['--eo-typography-body-100-font-family', '--eo-typography-body-50-font-family'],
  fontMono: ['--eo-typography-code-100-font-family'],
  letterSpacingDisplay: [],
};

export function applyTheme(theme) {
  const t = solveTheme(theme);
  const decls = [];
  for (const [key, vars] of Object.entries(CSS_MAP)) {
    if (t[key] == null) continue;
    for (const v of vars) decls.push(`  ${v}: ${t[key]};`);
  }
  // Action labels follow the body face unless the theme names a mono voice.
  if (t.fontBody) decls.push(`  --eo-typography-action-label-100-font-family: ${t.fontBody};`);

  let extra = '';
  if (t.letterSpacingDisplay) {
    extra += `\n.hero h1, .band-head h2, .kpi-value, .manifesto-text { letter-spacing: ${t.letterSpacingDisplay}; }`;
  }
  if (t.strandOpacity != null) {
    extra += `\nbody[data-tab-state="overview"] .cascade-field { opacity: ${t.strandOpacity}; }`;
  }
  if (t.strandDensity != null) {
    // Thinning the field is done by hiding whole bands, so the strands that
    // remain keep their sway and their flow rather than becoming a static
    // subset with gaps in the animation.
    const keep = Math.max(2, Math.round(2 + t.strandDensity * 7));
    extra += `\n.cf-band:nth-child(n+${keep + 1}) { display: none; }`;
  }

  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = `:root {\n${decls.join('\n')}\n}${extra}\n`;
  document.body.dataset.themed = 'custom';
  return t;
}

export function resetTheme() {
  document.getElementById(STYLE_ID)?.remove();
  delete document.body.dataset.themed;
}

/* DTCG, because that is the format this design system authors in — so what
   comes out of the console can go straight back into Tokens Studio. */
export function toDTCG(t) {
  const grp = (o) => ({ ...o });
  return JSON.stringify(
    {
      $description: `Derived theme: ${t.name || 'untitled'}`,
      color: grp({
        accent: { $type: 'color', $value: t.accentContent },
        surface: { $type: 'color', $value: t.surface },
        'surface-subtle': { $type: 'color', $value: t.surfaceSubtle },
        'surface-emphasized': { $type: 'color', $value: t.surfaceEmphasized },
        content: { $type: 'color', $value: t.content },
        'content-subtle': { $type: 'color', $value: t.contentSubtle },
        'content-on-emphasized': { $type: 'color', $value: t.contentOnEmphasized },
        border: { $type: 'color', $value: t.border },
      }),
      dimension: grp({
        'radius-small': { $type: 'dimension', $value: t.radiusSmall },
        'radius-default': { $type: 'dimension', $value: t.radiusDefault },
        'radius-large': { $type: 'dimension', $value: t.radiusLarge },
      }),
      typography: grp({
        display: { $type: 'fontFamily', $value: t.fontDisplay },
        body: { $type: 'fontFamily', $value: t.fontBody },
      }),
    },
    null,
    2
  );
}

/* ─────────────────────────────────────────────────────────── derivation ─── */

export async function derive(prompt) {
  // Try the proxy first, but never wait long for it: on the published site it
  // is not there at all, and the console must not feel broken because of that.
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    const r = await fetch(PROXY, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (r.ok) {
      const { theme } = await r.json();
      if (theme) return { theme, source: 'claude' };
    }
  } catch {
    /* no proxy reachable — that is the normal published case */
  }
  return { theme: deriveLocally(prompt), source: 'local' };
}
