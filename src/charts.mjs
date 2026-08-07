/**
 * Hand-authored SVG charts.
 *
 * The design system has no chart, meter or progress component in code yet
 * (progress-bar is DSC-100, still sitting in the Ready-for-Development queue),
 * so these are drawn from primitives and coloured entirely through --eo-* tokens
 * via CSS classes. When a real chart component ships, these are the call sites
 * to replace.
 *
 * Everything is static markup — no runtime charting library, nothing to load.
 */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r2 = (n) => Math.round(n * 100) / 100;

/* ---------------------------------------------------------------- radar ---
   Ten stations on ten axes, scored 0–10. The dashed outer ring is a perfect
   score, so the gap between the filled shape and the ring is the work left. */
export function radar(stations, { width = 560, height = 440, max = 10 } = {}) {
  // Wider than tall so the outer labels have room — at a square viewBox the
  // left/right station names were clipping against the tile edge.
  const cx = width / 2;
  const cy = height / 2;
  const R = height * 0.31;
  const n = stations.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, v) => [cx + Math.cos(angle(i)) * R * (v / max), cy + Math.sin(angle(i)) * R * (v / max)];

  // 10 is drawn separately as the dashed "perfect score" ring, so it is omitted
  // here — otherwise a solid grid ring sits on top of it and hides the dashes.
  const rings = [2, 4, 6, 8]
    .map((v) => {
      const d = stations
        .map((_, i) => {
          const [x, y] = pt(i, v);
          return `${i ? 'L' : 'M'}${r2(x)},${r2(y)}`;
        })
        .join(' ');
      return `<path class="c-grid" d="${d}Z"/>`;
    })
    .join('');

  const spokes = stations
    .map((_, i) => {
      const [x, y] = pt(i, max);
      return `<line class="c-axis" x1="${cx}" y1="${cy}" x2="${r2(x)}" y2="${r2(y)}"/>`;
    })
    .join('');

  const shape = stations
    .map((s, i) => {
      const [x, y] = pt(i, s.score);
      return `${i ? 'L' : 'M'}${r2(x)},${r2(y)}`;
    })
    .join(' ');

  const dots = stations
    .map((s, i) => {
      const [x, y] = pt(i, s.score);
      return `<circle class="c-dot-${s.light}" cx="${r2(x)}" cy="${r2(y)}" r="4"/>`;
    })
    .join('');

  const labels = stations
    .map((s, i) => {
      const a = angle(i);
      const lx = cx + Math.cos(a) * (R + 34);
      const ly = cy + Math.sin(a) * (R + 34);
      const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
      const short = s.name.length > 24 ? s.name.replace(' & ', ' & ') : s.name;
      return `<text class="c-label" x="${r2(lx)}" y="${r2(ly)}" text-anchor="${anchor}" dominant-baseline="middle">${esc(
        short
      )}</text>
      <text class="c-value" x="${r2(lx)}" y="${r2(ly + 13)}" text-anchor="${anchor}" dominant-baseline="middle">${s.score}</text>`;
    })
    .join('');

  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img"
    aria-label="Radar of ten inspection stations scored out of ten. ${stations
      .map((s) => `${s.name} ${s.score}`)
      .join(', ')}.">
    ${rings}${spokes}
    <path class="c-shape-max" d="${stations.map((_, i) => { const [x, y] = pt(i, max); return `${i ? 'L' : 'M'}${r2(x)},${r2(y)}`; }).join(' ')}Z"/>
    <path class="c-shape-now" d="${shape}Z"/>
    ${dots}${labels}
  </svg>`;
}

/* ---------------------------------------------------------------- donut --- */
export function donut(value, max, { size = 180, label, sub, tone = '' } = {}) {
  const stroke = 16;
  const r = (size - stroke) / 2 - 2;
  const c = 2 * Math.PI * r;
  const frac = max ? Math.max(0, Math.min(1, value / max)) : 0;
  return `<svg class="chart" viewBox="0 0 ${size} ${size}" style="max-width:${size}px" role="img"
    aria-label="${esc(label ?? '')} ${value} of ${max}">
    <g transform="rotate(-90 ${size / 2} ${size / 2})">
      <circle class="c-donut-track" cx="${size / 2}" cy="${size / 2}" r="${r2(r)}" stroke-width="${stroke}"/>
      <circle class="c-donut-fill ${tone}" cx="${size / 2}" cy="${size / 2}" r="${r2(r)}" stroke-width="${stroke}"
        stroke-dasharray="${r2(c * frac)} ${r2(c)}"/>
    </g>
    <text class="c-donut-label" x="${size / 2}" y="${size / 2 - 2}" text-anchor="middle" dominant-baseline="middle"
      style="font-size:${size * 0.2}px">${esc(label ?? Math.round(frac * 100) + '%')}</text>
    ${sub ? `<text class="c-donut-sub" x="${size / 2}" y="${size / 2 + size * 0.15}" text-anchor="middle">${esc(sub)}</text>` : ''}
  </svg>`;
}

/* ----------------------------------------------------------------- trend ---
   Deliberately plain: three data points is a direction, not a time series. */
export function trend(values, { width = 260, height = 90, labels = [] } = {}) {
  if (!values || values.length < 2) return '';
  const pad = 22;
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const x = (i) => pad + (i * (width - pad * 2)) / (values.length - 1);
  const y = (v) => height - pad - ((v - min) / (max - min)) * (height - pad * 2);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${r2(x(i))},${r2(y(v))}`).join(' ');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" style="max-width:${width}px" role="img"
    aria-label="Score trend: ${values.join(' then ')}">
    <path class="c-line" d="${d}"/>
    ${values
      .map(
        (v, i) => `<circle class="c-dot-green" cx="${r2(x(i))}" cy="${r2(y(v))}" r="3.5"/>
      <text class="c-value" x="${r2(x(i))}" y="${r2(y(v) - 10)}" text-anchor="middle">${v}</text>
      ${labels[i] ? `<text class="c-label" x="${r2(x(i))}" y="${height - 4}" text-anchor="middle">${esc(labels[i])}</text>` : ''}`
      )
      .join('')}
  </svg>`;
}

/* --------------------------------------------------- station bar listing ---
   The ghost segment is the score a station would reach if work that is already
   finished were promoted into main. */
export function stationBars(stations, { max = 10 } = {}) {
  return `<div class="sbars">${stations
    .map(
      (s) => `<div class="sbar" data-token="--eo-color-surface-subtle">
        <span class="i">${String(s.n).padStart(2, '0')}</span>
        <span class="nm">${esc(s.name)}</span>
        <span class="track">
          ${s.potential ? `<span class="ghost" style="width:${(s.potential / max) * 100}%"></span>` : ''}
          <span class="${s.light}" style="width:${(s.score / max) * 100}%"></span>
        </span>
        <!-- Score only. The "6 → 7" second figure that used to sit here read as
             a range rather than a projection, and ten rows of two numbers made
             the column restless. The lighter bar behind the fill carries the
             same information calmly, and the footnote says what it means. -->
        <span class="sc">${s.score}</span>
      </div>`
    )
    .join('')}</div>`;
}

/* ------------------------------------------------- design vs code matrix ---
   Attribution of the inspection findings to the side of the system they belong
   to. Three states, so it reads at a glance from the back of a room. */
export function splitMatrix(dimensions) {
  // Each state names the token it is painted with, so the overview's cursor
  // can answer on the cells themselves rather than falling back to the card
  // they happen to sit in.
  const STATE_TOKEN = {
    'in-place': '--eo-color-content-utility-positive',
    partial: '--eo-color-content-utility-warning',
    absent: '--eo-color-content-utility-negative',
  };
  const dot = (state) =>
    `<span class="cell ${state}" role="img" data-token="${STATE_TOKEN[state] ?? '--eo-color-border-default'}" aria-label="${
      state === 'in-place' ? 'in place' : state
    }"><span></span></span>`;
  return `<div class="matrix">
    <div class="matrix-head">
      <span></span><span class="mh">Design</span><span class="mh">Code</span>
    </div>
    ${dimensions
      .map(
        (d) => `<div class="matrix-row">
          <span class="mname">${esc(d.name)}</span>
          ${dot(d.design.state)}
          ${dot(d.code.state)}
        </div>
        <div class="matrix-detail">
          <span><b>Design</b> ${esc(d.design.detail)}</span>
          <span><b>Code</b> ${esc(d.code.detail)}</span>
        </div>`
      )
      .join('')}
  </div>`;
}

/* ----------------------------------------------------------- change list ---
   Replaces a slope chart. With ten stations on a 0-10 integer scale, slope
   lines collide constantly and their labels stack independently of where the
   lines land, so you cannot tell which series is which. A diverging bar per
   station reads instantly and makes the real finding — that most stations did
   not move — obvious rather than hidden behind crossing lines. */
export function changeList(stations, { prevLabel = '', nowLabel = '' } = {}) {
  // Labels are passed in from the inspection's own column headers. They used to
  // default to "3 Aug / 5 Aug" while the rows compared the last two columns —
  // so the headings named the wrong pair of inspections.
  const rows = stations
    .map((s) => ({ ...s, prev: s.history?.[1] }))
    .filter((s) => s.prev != null)
    .map((s) => ({ ...s, delta: s.score - s.prev }))
    .sort((a, b) => b.delta - a.delta || a.n - b.n);

  const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.delta)));

  return `<div class="changes">
    <div class="change-head"><span></span><span>${esc(prevLabel)}</span><span></span><span>${esc(nowLabel)}</span></div>
    ${rows
      .map((r) => {
        const dir = r.delta > 0 ? 'up' : r.delta < 0 ? 'down' : 'flat';
        const w = (Math.abs(r.delta) / maxAbs) * 50;
        // Unchanged stations get a neutral bar of their own rather than a dot.
        // Six of ten not moving is the finding here, so those rows need the
        // same visual weight as the ones that did — a dot read as "no data".
        const bar =
          r.delta === 0
            ? `<span class="d-bar flat" style="width:9%;left:45.5%"></span>`
            : `<span class="d-bar ${dir}" style="width:${r2(w)}%;${
                r.delta > 0 ? 'left:50%' : `right:50%`
              }"></span>`;
        return `<div class="change-row ${dir}" data-token="--eo-color-border-subtle">
          <span class="c-name">${esc(r.name)}</span>
          <span class="c-prev">${r.prev}</span>
          <span class="c-track"><span class="c-mid"></span>${bar}</span>
          <span class="c-now ${dir}">${r.score}${
            r.delta !== 0 ? ` <b>${r.delta > 0 ? '+' : ''}${r.delta}</b>` : ''
          }</span>
        </div>`;
      })
      .join('')}
  </div>`;
}

/* ------------------------------------------------------- stacked pipeline ---
   Where the core set stands: built, nearly there, and not started. */
export function pipeline(segments, { width = 520, height = 40 } = {}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let x = 0;
  const bars = segments
    .map((s) => {
      const w = (s.value / total) * width;
      const rect = `<rect class="pipe ${s.tone}" x="${r2(x)}" y="0" width="${r2(Math.max(0, w - 2))}" height="${height}" rx="4"/>`;
      x += w;
      return rect;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img"
    aria-label="${segments.map((s) => `${s.label} ${s.value}`).join(', ')} of ${total}">${bars}</svg>`;
}

/* ---------------------------------------------------- the token cascade ---
   A background field that draws the thing this dashboard is about: the
   four-tier token cascade. Node counts per column are proportional to the real
   collections — 335 Core, 1,111 Brand, 165 Breakpoint, 7 Appearance — and the
   connecting lines are alias references.

   Deterministic: positions come from a seeded generator, so the same build
   produces the same field and diffs stay clean. Drawn once with
   stroke-dashoffset, then it breathes very slowly. Sits far back, at low
   opacity, in a colour taken from the system. */
export function cascadeField({ width = 1440, height = 2700, seed = 7, cycles = 2 } = {}) {
  // small deterministic PRNG — Math.random is unavailable and would churn diffs
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);

  // Tiers run top to bottom, not left to right, so scrolling the page is
  // literally descending through the cascade. The canvas is several viewports
  // tall and the whole cascade repeats down it, so there is always a full,
  // fully-drawn slice on screen rather than a partly-drawn one.
  const TIERS = [
    { n: 22, r: 2.6 }, // Core
    { n: 34, r: 2.0 }, // Brand
    { n: 24, r: 2.4 }, // Breakpoint
    { n: 11, r: 3.2 }, // Appearance
  ];
  const total = TIERS.length * cycles + 1;
  const rows = Array.from({ length: total }, (_, i) => ({
    ...TIERS[i % TIERS.length],
    y: 0.02 + (0.96 * i) / (total - 1),
  }));

  // t is each node's normalised position along its row. Keeping it on the node
  // is what makes the field read as a cascade rather than a hairball: a link
  // may only reach a node at a similar t, so the strands stay roughly parallel
  // and cross a little instead of a lot. An alias in the real system resolves
  // into its neighbouring tier, not to an arbitrary variable, so this is also
  // the truer picture.
  const nodes = rows.map((c) =>
    Array.from({ length: c.n }, (_, i) => {
      const t = (i + 0.5) / c.n;
      return {
        t,
        x: width * (0.02 + 0.96 * t) + (rnd() - 0.5) * width * 0.03,
        y: c.y * height + (rnd() - 0.5) * height * 0.012,
        r: c.r,
      };
    })
  );

  const links = [];
  for (let c = 0; c < nodes.length - 1; c++) {
    const next = nodes[c + 1];
    nodes[c].forEach((a) => {
      // candidates within a band of a's own position, nearest first
      const near = next
        .map((b) => ({ b, dist: Math.abs(b.t - a.t) }))
        .sort((p, q) => p.dist - q.dist)
        .slice(0, 3);
      const count = rnd() > 0.62 ? 2 : 1;
      for (let k = 0; k < count && k < near.length; k++) {
        const b = near[k === 0 ? 0 : 1 + Math.floor(rnd() * (near.length - 1))].b;
        // gentle S-curve: control points at 42% and 58% of the drop, so lines
        // leave and arrive vertically and never kink
        const dy = b.y - a.y;
        links.push({
          d:
            `M${a.x.toFixed(1)},${a.y.toFixed(1)} ` +
            `C${a.x.toFixed(1)},${(a.y + dy * 0.42).toFixed(1)} ` +
            `${b.x.toFixed(1)},${(a.y + dy * 0.58).toFixed(1)} ` +
            `${b.x.toFixed(1)},${b.y.toFixed(1)}`,
          tier: c,
          t: (a.t + b.t) / 2,
        });
      }
    });
  }

  // Tier index rides along on each element so the draw can resolve in tier
  // order: Core first, Appearance last. --p is a per-element phase offset, so
  // the ambient pulse never beats in unison — that is what stops the field
  // reading as a repeating pattern.
  //
  // Everything is then filed into vertical bands by horizontal position. Each
  // band is a <g> that sways on its own phase, which is what gives the strands
  // movement relative to each other rather than the whole field sliding as one
  // sheet. Links sit in the band of their midpoint; because a link only ever
  // reaches a node at a similar position, its two ends stay within a band or
  // one either side, and at these amplitudes the couple of pixels of drift
  // between a strand and its node reads as slack in the line, not as a break.
  const BANDS = 9;
  const bandOf = (t) => Math.min(BANDS - 1, Math.max(0, Math.floor(t * BANDS)));

  // Flat-sampled cubic length. Exact enough to time a travelling dash, and it
  // has to be known at build time because the pulse below is pure CSS.
  const curveLen = (d) => {
    const p = d.match(/-?[\d.]+/g).map(Number);
    const [x0, y0, x1, y1, x2, y2, x3, y3] = p;
    const at = (t, a, b, c, dd) => {
      const u = 1 - t;
      return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * dd;
    };
    let len = 0, px = x0, py = y0;
    for (let i = 1; i <= 16; i++) {
      const t = i / 16;
      const x = at(t, x0, x1, x2, x3);
      const y = at(t, y0, y1, y2, y3);
      len += Math.hypot(x - px, y - py);
      px = x; py = y;
    }
    return len;
  };

  const linkBands = Array.from({ length: BANDS }, () => []);
  links.forEach((l, i) => {
    const band = bandOf(l.t);
    linkBands[band].push(
      `<path class="cf-link" data-tier="${l.tier}" style="--p:${(-(i % 37) * 0.31).toFixed(2)}s" d="${l.d}"/>`
    );
    // Every fourth strand carries a pulse that travels its length — data moving
    // through the cascade. Every strand at once would be a light show; sparse
    // traffic on a few of them reads as a system doing work.
    if (i % 4 === 0) {
      const len = curveLen(l.d);
      const DASH = 16;
      linkBands[band].push(
        `<path class="cf-flow" style="--len:${len.toFixed(1)};--sweep:${(-(len + DASH)).toFixed(
          1
        )};--fd:${(len / 42 + 1.5).toFixed(2)}s;--fp:${(1.8 + ((i * 0.7) % 11)).toFixed(2)}s" d="${l.d}"/>`
      );
    }
  });

  const nodeBands = Array.from({ length: BANDS }, () => []);
  nodes.forEach((row, c) =>
    row.forEach((n, i) => {
      nodeBands[bandOf(n.t)].push(
        `<circle class="cf-node" data-tier="${c}" style="--p:${(-((i * 3 + c * 5) % 29) * 0.29).toFixed(
          2
        )}s" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r}"/>`
      );
    })
  );

  const bands = Array.from(
    { length: BANDS },
    (_, i) => `<g class="cf-band" data-band="${i}">${linkBands[i].join('')}${nodeBands[i].join('')}</g>`
  ).join('');

  return `<svg class="cascade" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"
    aria-hidden="true" focusable="false">${bands}</svg>`;
}
