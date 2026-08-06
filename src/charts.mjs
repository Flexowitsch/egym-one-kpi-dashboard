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
      (s) => `<div class="sbar">
        <span class="i">${String(s.n).padStart(2, '0')}</span>
        <span class="nm">${esc(s.name)}</span>
        <span class="track">
          ${s.potential ? `<span class="ghost" style="width:${(s.potential / max) * 100}%"></span>` : ''}
          <span class="${s.light}" style="width:${(s.score / max) * 100}%"></span>
        </span>
        <span class="sc">${s.score}${s.potential ? `<span class="c-label"> → ${s.potential}</span>` : ''}</span>
      </div>`
    )
    .join('')}</div>`;
}
