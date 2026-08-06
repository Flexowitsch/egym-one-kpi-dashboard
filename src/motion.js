/**
 * Dashboard motion — GSAP + ScrollTrigger.
 *
 * Deliberately a different register to a marketing landing page. This is a
 * page people open every morning, so there is no preloader, no custom cursor
 * and no magnetic buttons. Motion here does one of three jobs or it does not
 * ship:
 *
 *   1. Draw attention to a number that changed.
 *   2. Make a chart legible by building it in the order it should be read.
 *   3. Narrate the argument — the design/code matrix reveals design first,
 *      then code, because that sequence *is* the finding.
 *
 * Every hidden state is set from JavaScript, so the dashboard is fully
 * readable with JS disabled or blocked. prefers-reduced-motion skips
 * everything and jumps to the final state.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------- counters --- */
// data-count holds the target; data-tpl holds the surrounding text with __ as
// the placeholder, so "100d" and "41%" animate without losing their unit.
function countUp(el, trigger = el) {
  const target = parseFloat(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const tpl = el.dataset.tpl || '__';
  const dec = (el.dataset.count.split('.')[1] || '').length;
  const write = (v) => {
    el.textContent = tpl.replace('__', dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-GB'));
  };
  if (reduce) return write(target);

  // The real value stays on screen until the animation is actually about to
  // run. Zeroing it up front would leave the dashboard reading "0%" for anyone
  // whose tab is backgrounded (rAF throttled), or if GSAP fails to tick at all
  // — and a KPI page showing a wrong zero is worse than one that never animates.
  const obj = { v: 0 };
  let settled = false;
  const finish = () => {
    settled = true;
    write(target);
  };

  ScrollTrigger.create({
    trigger,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      write(0);
      gsap.to(obj, {
        v: target,
        duration: target > 60 ? 1.5 : 1.05,
        ease: 'power2.out',
        onUpdate: () => { if (!settled) write(obj.v); },
        onComplete: finish,
      });
      // Belt and braces: if the tween never completes (throttled tab, tween
      // killed), snap to the true value rather than leaving a zero on screen.
      setTimeout(() => { if (!settled) finish(); }, 4000);
    },
  });
}

/* ---------------------------------------------------------------- charts --- */
function drawCharts() {
  // Bars, meters and station tracks grow from zero. Their final width is inline,
  // so it is captured first and replayed rather than hard-coded here.
  const grows = [
    ...$$('.bar-track > span'),
    ...$$('.meter > span'),
    ...$$('.sbar .track > span'),
  ];
  grows.forEach((el) => {
    const to = el.style.width || '0%';
    if (reduce) return;
    gsap.fromTo(
      el,
      { width: 0 },
      {
        width: to,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el.closest('eo-card, .tile, .sbars') || el, start: 'top 88%', once: true },
      }
    );
  });

  // Donut: sweep the arc round rather than popping it in.
  $$('.c-donut-fill').forEach((el) => {
    const dash = el.getAttribute('stroke-dasharray');
    if (!dash || reduce) return;
    const [len, total] = dash.split(' ').map(Number);
    gsap.fromTo(
      el,
      { attr: { 'stroke-dasharray': `0 ${total}` } },
      {
        attr: { 'stroke-dasharray': `${len} ${total}` },
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: el.closest('eo-card') || el, start: 'top 85%', once: true },
      }
    );
  });

  // Radar: grow the measured shape out of the centre, then drop the dots on.
  $$('.c-shape-now').forEach((shape) => {
    const svg = shape.closest('svg');
    const dots = $$('[class^="c-dot-"]', svg);
    if (reduce) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: svg.closest('eo-card') || svg, start: 'top 80%', once: true },
    });
    gsap.set(shape, { transformOrigin: '50% 50%' });
    gsap.set(dots, { opacity: 0, transformOrigin: '50% 50%' });
    tl.fromTo(shape, { scale: 0.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' })
      .fromTo(dots, { scale: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' }, '-=0.55');
  });

  // Slope lines draw left to right, so the eye follows the direction of change.
  $$('svg .sl').forEach((line, i) => {
    if (reduce) return;
    const len = 600;
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      delay: i * 0.05,
      scrollTrigger: { trigger: line.closest('eo-card') || line, start: 'top 82%', once: true },
    });
  });

  // Pipeline segments wipe in left to right, in pipeline order.
  $$('svg .pipe').forEach((rect, i) => {
    if (reduce) return;
    const w = rect.getAttribute('width');
    gsap.fromTo(
      rect,
      { attr: { width: 0 } },
      {
        attr: { width: w },
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.09,
        scrollTrigger: { trigger: rect.closest('eo-card') || rect, start: 'top 85%', once: true },
      }
    );
  });

  // Trend line draws, then its point labels appear.
  $$('svg .c-line').forEach((line) => {
    if (reduce) return;
    const len = line.getTotalLength ? line.getTotalLength() : 400;
    const svg = line.closest('svg');
    const marks = $$('circle, text', svg);
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap
      .timeline({ scrollTrigger: { trigger: svg.closest('eo-card') || svg, start: 'top 85%', once: true } })
      .to(line, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' })
      .fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.08 }, '-=0.4');
  });
}

/* ------------------------------------------------- the matrix, as a story --- */
// Design column fills in first, then code. The pause between them is the point.
function matrixReveal() {
  const rows = $$('.matrix-row');
  if (!rows.length) return;
  const design = rows.map((r) => $$('.cell', r)[0]).filter(Boolean);
  const code = rows.map((r) => $$('.cell', r)[1]).filter(Boolean);
  if (reduce) return;
  gsap.set([...design, ...code], { scale: 0, transformOrigin: '50% 50%' });
  gsap
    .timeline({ scrollTrigger: { trigger: $('.matrix'), start: 'top 78%', once: true } })
    .to(design, { scale: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(2.2)' })
    .to(code, { scale: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(2.2)' }, '+=0.25');
}

/* --------------------------------------------------------------- reveals --- */
function reveals() {
  if (reduce) return;
  $$('.band-head').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });
  // Cards rise together per row rather than one long chain down the page.
  $$('.bento, .stat-row').forEach((group) => {
    const cards = $$(':scope > eo-card, :scope > .tile, :scope > .stat', group);
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      }
    );
  });
}

/* ------------------------------------------------------------------ hero --- */
function hero() {
  const score = $('.score-hero .n');
  if (score) countUp(score, '.hero');
  if (reduce) return;
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.hero .eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.hero h1', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.35')
    .fromTo('.hero .standfirst', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
    .fromTo('.score-hero', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power4.out' }, '-=0.45')
    .fromTo('.score-sub', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.35')
    .fromTo('.pill-row > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, '-=0.3');
}

/* -------------------------------------------------------- tab transition --- */
// Exposed so the inline tab handler can call it after swapping panels.
window.__dashTabIn = (panel) => {
  if (reduce || !panel) return;
  gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
  ScrollTrigger.refresh();
};

/* ------------------------------------------------------------------ init --- */
function init() {
  $$('[data-count]').forEach((el) => countUp(el, el.closest('eo-card') || el));
  drawCharts();
  matrixReveal();
  reveals();
  hero();
  // Charts and web components settle after fonts and custom elements upgrade.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  customElements.whenDefined('eo-card').then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
