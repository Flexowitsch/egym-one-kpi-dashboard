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
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine)').matches;
const onOverview = () => document.body.dataset.tabState === 'overview';

// One easing curve for the whole page, matching --ease-out in the stylesheet.
// Registered as a named GSAP ease so every tween below reads the same.
gsap.registerEase('siteOut', (p) => {
  // cubic-bezier(0.22, 1, 0.36, 1) approximated for GSAP's 0..1 progress
  return 1 - Math.pow(1 - p, 3.2);
});

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
    el.dataset.w = to;
    if (reduce) return;
    gsap.fromTo(
      el,
      { width: 0 },
      {
        width: to,
        duration: 0.9,
        ease: 'siteOut',
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
    tl.fromTo(shape, { scale: 0.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: 'siteOut' })
      .fromTo(dots, { scale: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' }, '-=0.55');
  });

  // Change bars grow out from the centre line, so the direction of each move is
  // what the eye picks up first. Stations that did not move get their dot
  // popped in, because "no change" is the finding here.
  $$('.d-bar').forEach((bar, i) => {
    const to = bar.style.width;
    bar.dataset.w = to;
    if (reduce) return;
    gsap.fromTo(bar, { width: 0 }, {
      width: to, duration: 0.6, ease: 'siteOut', delay: i * 0.06,
      scrollTrigger: { trigger: bar.closest('eo-card') || bar, start: 'top 85%', once: true },
    });
  });
  $$('.d-zero').forEach((d, i) => {
    if (reduce) return;
    gsap.fromTo(d, { scale: 0 }, {
      scale: 1, duration: 0.35, delay: i * 0.04, ease: 'back.out(2)',
      scrollTrigger: { trigger: d.closest('eo-card') || d, start: 'top 85%', once: true },
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
        ease: 'siteOut',
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
      { opacity: 1, y: 0, duration: 0.8, ease: 'siteOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
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
        ease: 'siteOut',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      }
    );
  });
}

/* ------------------------------------------------ smooth scroll (Lenis) --- */
// Lenis is what makes the scroll feel like a landing page rather than a
// document. Fine pointers only — on touch, native momentum is already better
// than anything we would emulate — and never under reduced motion.
function smoothScroll() {
  if (reduce || !fine) return;
  const lenis = new Lenis({ lerp: 0.105, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Tab switches jump to the top; Lenis owns scroll position, so tell it.
  window.__dashScrollTop = () => lenis.scrollTo(0, { immediate: true });
}

/* ---------------------------------------------------- the token cascade ---
   The field is three viewports of repeating Core → Brand → Breakpoint →
   Appearance, fixed behind the page. Scrolling slides it up, so the reader
   travels down through the cascade — always looking at a complete, drawn slice
   rather than a half-finished one. It moves at two thirds of page speed, and
   that difference is where the depth comes from.

   The strokes draw themselves in once on load. Their resting CSS state is
   "drawn", so a blocked bundle leaves a static field rather than an empty
   background. */
function cascade() {
  const field = $('.cascade-field');
  if (!field || reduce) return;
  const links = $$('.cf-link', field);
  const nodes = $$('.cf-node', field);
  const track = $('.cascade-track', field);
  if (!links.length) return;

  links.forEach((p) => {
    const len = p.getTotalLength ? p.getTotalLength() : 600;
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.15 });
  });
  gsap.set(nodes, { opacity: 0, transformOrigin: '50% 50%', scale: 0.4 });

  // Drawn in tier order, so the cascade resolves the way the token system does
  // rather than in document order.
  const byTier = (els) => [...els].sort((a, b) => a.dataset.tier - b.dataset.tier);
  gsap
    .timeline({ delay: 0.2 })
    .to(byTier(links), {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power2.out',
      stagger: { each: 0.004, from: 'start' },
    })
    .to(byTier(nodes), { opacity: 0.28, scale: 1, duration: 0.5, stagger: 0.004 }, '-=1.5');

  // The travel. Two thirds of the track is off-screen; scrolling the document
  // walks the whole way down it.
  gsap.to(track, {
    yPercent: -66.6,
    ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'max', scrub: 0.6, invalidateOnRefresh: true },
  });
}

/* -------------------------------------------------------- word-by-word --- */
// The manifesto is the one sentence on the page that argues. Splitting it into
// words and scrubbing their opacity against scroll makes it read at the pace of
// scrolling rather than all at once. Split happens in JS, so with JS off the
// sentence renders normally at full contrast.
function manifesto() {
  const el = $('[data-scrub-text]');
  if (!el || reduce) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((tn) => {
    const frag = document.createDocumentFragment();
    tn.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(' '));
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = part;
      frag.appendChild(s);
    });
    tn.parentNode.replaceChild(frag, tn);
  });
  const words = $$('.w', el);
  gsap.set(words, { opacity: 0.14 });
  gsap.to(words, {
    opacity: 1,
    ease: 'none',
    stagger: 0.06,
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
  });
}

/* ------------------------------------------------------------ preloader ---
   Plays once per session. Three hard rules, because this is a page people open
   every morning and a loading animation that goes wrong is a page that is gone:
     · it removes itself after 2.4s no matter what the timeline is doing
     · a returning visit in the same session skips it entirely
     · reduced motion never sees it at all
   Takes the hero's reveal as a callback and fires it from inside its own
   timeline, so the two read as one move. Returns true if it is playing. */
function preloader(reveal) {
  const el = $('#preloader');
  if (!el) return false;
  if (reduce) { el.remove(); return false; }

  let seen = false;
  try {
    seen = sessionStorage.getItem('eo-dash-intro') === '1';
    sessionStorage.setItem('eo-dash-intro', '1');
  } catch { /* storage blocked — play it */ }
  if (seen) { el.remove(); return false; }

  let revealed = false;
  const once = () => { if (!revealed) { revealed = true; reveal(); } };
  const kill = () => { once(); if (el.isConnected) el.remove(); };
  // Hard stop. Whatever the timeline is doing, the page is not held past this.
  setTimeout(kill, 2400);

  const counter = { v: 0 };
  const n = $('.pre-count-n', el);
  const score = Number($('.score-hero .n')?.dataset.count) || 100;

  return gsap
    .timeline({ defaults: { ease: 'power4.out' }, onComplete: kill })
    .fromTo('.pre-word span', { yPercent: 120 }, { yPercent: 0, duration: 0.7, stagger: 0.04 })
    .to('.pre-meta', { opacity: 1, duration: 0.3 }, '-=0.4')
    // The bar and the counter run to the real inspection score, not to 100 —
    // the loading sequence is the first time the page states its number.
    .to('.pre-bar span', { scaleX: score / 100, duration: 0.9, ease: 'power2.inOut' }, '-=0.2')
    .to(counter, {
      v: score,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => { if (n) n.textContent = Math.round(counter.v); },
    }, '<')
    .to('.pre-word span', { yPercent: -120, duration: 0.45, stagger: 0.025, ease: 'power3.in' }, '+=0.15')
    .to('.pre-meta, .pre-bar', { opacity: 0, duration: 0.25 }, '<')
    .to(el, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.1')
    // The hero starts while the curtain is still lifting, so the two overlap
    // rather than queue. Added inside the timeline, not bolted on afterwards.
    .call(once, null, '-=0.45') && true;
}

/* --------------------------------------------------------- token cursor ---
   A cursor that names the design system. The ring is the accent token; over
   anything carrying data-token it shows which token paints it, so reading the
   overview also reads the system. Fine pointers only. */
function cursor() {
  const root = $('.cursor');
  if (!root || reduce || !fine) return;
  const dot = $('.cursor-dot', root);
  const ring = $('.cursor-ring', root);
  const label = $('.cursor-label', root);
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };

  document.body.classList.add('cursor-on');

  addEventListener('mousemove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    if (!root.classList.contains('is-active')) {
      ringPos.x = pos.x; ringPos.y = pos.y;
      root.classList.add('is-active');
    }
  });
  addEventListener('mousedown', () => root.classList.add('is-down'));
  addEventListener('mouseup', () => root.classList.remove('is-down'));
  // Leaving the window should take the cursor with it.
  document.addEventListener('mouseleave', () => root.classList.remove('is-active'));

  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
  });

  // One delegated listener rather than per-element handlers, so it keeps
  // working for anything rendered later.
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest?.('[data-token]');
    const hot = e.target.closest?.('a, button, eo-button, eo-card, .tab');
    root.classList.toggle('is-hover', Boolean(hot || t));
    root.classList.toggle('has-token', Boolean(t));
    if (t && label) label.textContent = t.dataset.token;
  });
}

/* ------------------------------------------------------------------ hero --- */
function hero() {
  const score = $('.score-hero .n');
  if (score) countUp(score, '.hero');
  if (reduce) return null;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'siteOut' } });
  tl.fromTo('.hero .eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.hero h1', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.35')
    .fromTo('.hero .standfirst', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
    .fromTo('.score-hero', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9 }, '-=0.45')
    .fromTo('.score-sub', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.35')
    .fromTo('.pill-row > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, '-=0.3')
    .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

  // Parallax: the hero drifts up and dissolves as the page scrolls under it.
  gsap.to('.hero-inner', {
    yPercent: -14,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true },
  });
  gsap.to('.scroll-cue', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '30% top', scrub: true },
  });
  return tl;
}

/* --------------------------------------------------------- velocity skew ---
   The stat row leans very slightly into the direction of travel. Small enough
   that it registers as weight rather than as an effect. */
function velocity() {
  if (reduce) return;
  $$('.stat-row').forEach((row) => {
    const skew = gsap.quickTo(row, 'skewY', { duration: 0.5, ease: 'power2.out' });
    ScrollTrigger.create({
      trigger: row,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => skew(gsap.utils.clamp(-1.6, 1.6, self.getVelocity() / -900)),
    });
  });
}

/* -------------------------------------------------------- tab transition --- */
// Exposed so the inline tab handler can call it after swapping panels.
window.__dashTabIn = (panel) => {
  // Lenis owns the scroll position, so window.scrollTo alone leaves it out of
  // sync with the page it is animating.
  window.__dashScrollTop?.();
  if (reduce || !panel) return;
  gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
  ScrollTrigger.refresh();
};

/* -------------------------------------------------------------- failsafe ---
   Nothing here may leave content invisible. Reveals work by tweening from
   opacity 0, so if GSAP never ticks — a backgrounded tab throttling rAF, a
   blocked bundle, a thrown error mid-timeline — the dashboard would render
   blank. For a page management opens every morning that is the worst possible
   failure, and it is silent.

   So: a few seconds after load, anything still fully transparent that should
   be visible gets forced back. Costs nothing when the animation works. */
function failsafe() {
  const SELECTOR =
    '.band-head, .bento > eo-card, .stat-row > eo-card, .tile, .stat, .panel, .hero-inner > *, .manifesto-text';
  const clear = () => {
    $$(SELECTOR).forEach((el) => {
      if (el.closest('.panel[hidden]')) return; // genuinely hidden tabs stay hidden
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.05) {
        gsap.set(el, { clearProps: 'opacity,transform,y,scale' });
        el.style.opacity = '';
        el.style.transform = '';
      }
    });
    // charts too — a zero-width bar reads as a real zero, which is a lie
    $$('.d-bar, .bar-track > span, .meter > span, .sbar .track > span').forEach((el) => {
      if (el.getBoundingClientRect().width < 0.5 && el.dataset.w) el.style.width = el.dataset.w;
    });
    // manifesto words rest at 0.14 waiting for the scrub; if the scrub never
    // arrives that sentence is unreadable, so it goes back to full contrast
    const words = $$('.manifesto-text .w');
    if (words.length && parseFloat(getComputedStyle(words[words.length - 1]).opacity) < 0.2) {
      const st = ScrollTrigger.getAll().some((t) => t.trigger === $('.manifesto-text'));
      if (!st) gsap.set(words, { opacity: 1 });
    }
  };
  setTimeout(clear, 3500);
  // and again once everything has settled, in case a late refresh re-hid things
  window.addEventListener('load', () => setTimeout(clear, 1500));
}

/* ------------------------------------------------------------------ init --- */
function init() {
  smoothScroll();
  $$('[data-count]').forEach((el) => countUp(el, el.closest('eo-card') || el));
  drawCharts();
  matrixReveal();
  reveals();
  const heroTl = hero();
  // The loading sequence owns when the hero reveals. If it does not play — a
  // returning visit, reduced motion, no preloader in the markup — the hero
  // reveals immediately.
  if (!preloader(() => heroTl?.play())) heroTl?.play();
  cascade();
  manifesto();
  cursor();
  velocity();
  failsafe();
  // Charts and web components settle after fonts and custom elements upgrade.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  customElements.whenDefined('eo-card').then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
