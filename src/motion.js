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
  if (!rows.length || reduce) return;

  // Per row, against that row's own scroll position. The card is nine rows and
  // several viewports tall, so a single timeline on the card meant everything
  // below the first screen had already played somewhere above the fold and
  // arrived static — the reveal was only ever seen for the top two rows.
  rows.forEach((row) => {
    const cells = $$('.cell', row);
    const name = $('.mname', row);
    const detail = row.nextElementSibling?.classList.contains('matrix-detail')
      ? row.nextElementSibling
      : null;

    gsap.set(cells, { scale: 0, transformOrigin: '50% 50%' });

    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
    if (name) tl.fromTo(name, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.45, ease: 'siteOut' }, 0);
    // Design lands first, then code. The pause between them is the finding, so
    // it survives the move to per-row timing.
    if (cells[0]) tl.to(cells[0], { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.12);
    if (cells[1]) tl.to(cells[1], { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.42);
    if (detail) {
      tl.fromTo(
        $$('span', detail),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.09, ease: 'siteOut' },
        0.2
      );
    }
  });
}

/* ------------------------------------------------------- what actually moved --- */
// Rows arrive one at a time and their bars grow out of the centre line, so the
// direction of each move is the first thing read. The unchanged rows animate
// too — six of ten not moving is the finding, and a row that stays still while
// its neighbours build reads as missing rather than as flat.
function changeReveal() {
  const list = $('.changes');
  if (!list || reduce) return;
  const rows = $$('.change-row', list);
  if (!rows.length) return;

  gsap.fromTo(
    rows,
    { opacity: 0, x: -16 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: 'siteOut',
      scrollTrigger: { trigger: list, start: 'top 85%', once: true },
    }
  );
  $$('.c-prev, .c-now', list).forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        delay: 0.25 + Math.floor(i / 2) * 0.07,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
      }
    );
  });
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
  // Cards build rather than fade. Each one wipes up from its own bottom edge
  // while rising and settling from a fraction under size — the clip is what
  // makes it read as being drawn rather than switched on. GSAP's grid-aware
  // stagger orders them along the diagonal, so a 3-across row arrives as a
  // sweep instead of three simultaneous pops.
  $$('.bento, .stat-row').forEach((group) => {
    const cards = $$(':scope > eo-card, :scope > .tile, :scope > .stat', group);
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 46, scale: 0.965, clipPath: 'inset(0% 0% 100% 0%)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.05,
        ease: 'siteOut',
        stagger: { grid: 'auto', from: 'start', each: 0.075 },
        scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        // clip-path is expensive to keep composited; drop it once it is done
        onComplete() { gsap.set(cards, { clearProps: 'clipPath' }); },
      }
    );

    // The contents arrive just behind their own card, so the card reads as a
    // container that fills rather than a picture that appears.
    cards.forEach((card, i) => {
      const inner = $$(':scope .tile-in > *, :scope .stat-in > *', card);
      if (inner.length < 2) return;
      gsap.fromTo(
        inner,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'siteOut',
          stagger: 0.05,
          delay: 0.18 + i * 0.075,
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        }
      );
    });
  });

  // Every repeating run of rows on every tab, not just the ones on the
  // overview. Delivery is almost entirely tables and bar rows, so without
  // this it was the one tab that arrived fully formed with nothing to watch.
  $$('.bars, .tbl tbody, .keys, .legend, .pill-row').forEach((group) => {
    const rows = $$(':scope > .bar-row, :scope > tr, :scope > li, :scope > *', group);
    if (rows.length < 2) return;
    gsap.fromTo(
      rows,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'siteOut',
        scrollTrigger: { trigger: group, start: 'top 90%', once: true },
      }
    );
  });

  // Lists inside a card build row by row against their own scroll position,
  // not the card's. On the long cards — the design/code matrix, the open-items
  // list, the fact tables — the card enters the viewport long before its last
  // row does, so tying the rows to the card meant the bottom half had already
  // animated somewhere above the fold and arrived static.
  $$('.openlist, .facts, .prov tbody, .rows').forEach((list) => {
    const rows = $$(':scope > li, :scope > tr', list);
    if (rows.length < 2) return;
    gsap.fromTo(
      rows,
      { opacity: 0, x: -14 },
      {
        opacity: 1,
        x: 0,
        duration: 0.55,
        ease: 'siteOut',
        stagger: 0.06,
        scrollTrigger: { trigger: list, start: 'top 88%', once: true },
      }
    );
  });

  // The matrix detail rows reveal on their own row, so scrolling the card
  // walks down the argument a dimension at a time.
  $$('.matrix-detail').forEach((row) => {
    gsap.fromTo(
      row,
      { opacity: 0, y: 8 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: 'siteOut',
        scrollTrigger: { trigger: row, start: 'top 92%', once: true },
      }
    );
  });

  // Tall cards build as you travel down them. These are several viewports
  // long, so a single reveal on the card is over before most of it is on
  // screen — each row has to answer to its own position instead. Rows rise a
  // little and settle, which is what makes a long table feel assembled rather
  // than pasted.
  $$('.prov tbody, .matrix, .sbars').forEach((body) => {
    const rows = $$(':scope > tr, :scope > .matrix-row, :scope > .sbar', body);
    if (rows.length < 3) return;
    rows.forEach((row) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'siteOut',
          scrollTrigger: { trigger: row, start: 'top 94%', once: true },
        }
      );
    });
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

  // Only the dash offset is animated from here. Opacity and the node pulse are
  // CSS keyframes that run forever — and a CSS animation outranks an inline
  // style, so anything GSAP wrote to opacity would be overridden on the next
  // frame anyway. Splitting it this way means the two never fight: JS draws,
  // CSS breathes.
  links.forEach((p) => {
    const len = p.getTotalLength ? p.getTotalLength() : 600;
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });

  // Drawn in tier order, so the cascade resolves the way the token system does
  // rather than in document order.
  const byTier = (els) => [...els].sort((a, b) => a.dataset.tier - b.dataset.tier);
  gsap.to(byTier(links), {
    strokeDashoffset: 0,
    duration: 1.4,
    delay: 0.2,
    ease: 'power2.out',
    stagger: { each: 0.004, from: 'start' },
  });
  // Once the strands are drawn, the field starts moving. Each vertical band
  // sways on its own period and phase, so the connections drift against each
  // other rather than the whole picture sliding as one sheet — that relative
  // motion is what makes it read as something live rather than a texture on a
  // slow pan. Amplitudes are a fraction of a percent; any more and the eye
  // starts tracking the background instead of the page.
  const bands = $$('.cf-band', field);
  const drawnAfter = 0.2 + 1.4 + links.length * 0.004;
  bands.forEach((band, i) => {
    const dir = i % 2 ? 1 : -1;
    gsap.to(band, {
      xPercent: dir * (0.22 + (i % 3) * 0.16),
      yPercent: dir * 0.12,
      duration: 9 + (i % 4) * 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: drawnAfter + i * 0.35,
    });
  });

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

  gsap.set('.pre-l > span', { yPercent: 115 });
  gsap.set('.pre-bar span', { scaleX: 0 });

  return gsap
    .timeline({ defaults: { ease: 'power4.out' }, onComplete: kill })
    // Letters rise out of their own boxes, slightly overlapping, so the word
    // assembles rather than appearing.
    .to('.pre-l > span', { yPercent: 0, duration: 0.85, stagger: 0.045 })
    .to('.pre-meta', { opacity: 1, duration: 0.3 }, '-=0.5')
    // The bar and the counter run to the real inspection score, not to 100 —
    // the loading sequence is the first time the page states its number, and
    // a bar that always fills to the end would be theatre.
    .to('.pre-bar span', { scaleX: score / 100, duration: 1, ease: 'power2.inOut' }, '-=0.25')
    .to(counter, {
      v: score,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => { if (n) n.textContent = Math.round(counter.v); },
    }, '<')
    // Exit: the panel wipes upward off its own bottom edge while its contents
    // leave faster than the wipe. That difference is what makes it read as a
    // curtain lifting rather than a block sliding away.
    .to('.pre-inner', { yPercent: -18, opacity: 0, duration: 0.7, ease: 'power3.in' }, '+=0.25')
    .to(
      el,
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.9,
        ease: 'expo.inOut',
      },
      '-=0.5'
    )
    // The hero starts while the curtain is still lifting, so the two overlap
    // rather than queue. Added inside the timeline, not bolted on afterwards.
    .call(once, null, '-=0.6') && true;
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
    const hot = e.target.closest?.('a, button, eo-button, eo-card, .tab');
    // The token labels are the marketing half of this: they belong on the
    // overview, where the page is arguing for the system. On the working tabs
    // the cursor stays — it is part of the product now — but it stops
    // annotating, because a label popping over every number gets in the way of
    // reading them.
    const t = onOverview() ? e.target.closest?.('[data-token]') : null;
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

/* ------------------------------------------------------- the KPI run ---
   Five full-viewport panels driven sideways while the section is pinned, so
   vertical scrolling reads as travelling along a sequence. Two details do the
   work: the pin distance is derived from viewport width rather than hard-coded,
   so the panels always move at the same rate whatever the screen; and each
   panel's body counter-parallaxes against the track through containerAnimation,
   which is what stops the run feeling like a slideshow of flat cards.

   Pinned only above 900px. On a phone a horizontal track fights the browser's
   own gesture, so the panels stack and reveal one at a time instead. */
function kpiRail() {
  const pin = $('.kpi-pin');
  if (!pin || reduce) return;
  const mm = gsap.matchMedia();

  mm.add('(min-width: 901px)', () => {
    const track = $('.kpi-track');
    const panels = $$('.kpi-panel');
    const progress = $('.kpi-progress span');
    if (!track || panels.length < 2) return;

    const tween = gsap.to(track, {
      xPercent: (-100 * (panels.length - 1)) / panels.length,
      ease: 'none',
      scrollTrigger: {
        trigger: '.kpi-rail',
        start: 'top top',
        end: () => '+=' + window.innerWidth * (panels.length - 1) * 0.85,
        pin: '.kpi-pin',
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progress) progress.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    panels.forEach((panel) => {
      // containerAnimation lets a ScrollTrigger read horizontal position inside
      // the pinned track, so each body can drift against its own panel.
      gsap.fromTo(
        $('.kpi-body', panel),
        { x: 70 },
        {
          x: -70,
          ease: 'none',
          scrollTrigger: { containerAnimation: tween, trigger: panel, start: 'left right', end: 'right left', scrub: true },
        }
      );
      gsap.fromTo(
        $('.kpi-ghost', panel),
        { x: -50 },
        {
          x: 50,
          ease: 'none',
          scrollTrigger: { containerAnimation: tween, trigger: panel, start: 'left right', end: 'right left', scrub: true },
        }
      );
      // The number counts as its panel arrives, not on page load.
      const v = $('.kpi-value', panel);
      if (v) {
        ScrollTrigger.create({
          containerAnimation: tween,
          trigger: panel,
          start: 'left 70%',
          once: true,
          onEnter: () => countUp(v, panel),
        });
      }
    });
  });

  mm.add('(max-width: 900px)', () => {
    $$('.kpi-panel').forEach((panel) => {
      gsap.fromTo(
        $('.kpi-body', panel),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'siteOut',
          scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
        }
      );
      const v = $('.kpi-value', panel);
      if (v) countUp(v, panel);
    });
  });
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
    '.band-head, .bento > eo-card, .stat-row > eo-card, .tile, .stat, .panel, .hero-inner > *, ' +
    '.manifesto-text, .tile-in > *, .stat-in > *, .openlist li, .facts li, .matrix-detail, ' +
    '.prov tbody tr, .change-row, .matrix-row .mname, .matrix-detail span, ' +
    '.bars .bar-row, .tbl tbody tr, .keys > *, .legend > *, .pill-row > *, ' +
    '.prov tbody tr, .matrix-row, .sbar';
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

  // ORDER MATTERS, and getting it wrong is why several sections looked
  // un-animated. Pinning the KPI rail adds roughly four viewport heights to
  // the document. Every ScrollTrigger created before it computed its start
  // against the shorter page; the pin then invalidated all of those positions,
  // and on the next refresh they were already "past" their start, so instead
  // of animating they snapped straight to the end state. The reveal was set up
  // correctly and simply never got to play.
  //
  // So: the pinned trigger is created first, everything else measures against
  // the final layout, and the sort below puts them in scroll order regardless.
  kpiRail();

  $$('[data-count]').forEach((el) => countUp(el, el.closest('eo-card') || el));
  drawCharts();
  matrixReveal();
  changeReveal();
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

  // Pinned triggers have to be evaluated before the ones that sit after them,
  // or a later refresh reintroduces exactly the problem above.
  const settle = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
  settle();
  window.addEventListener('load', settle);
  if (document.fonts?.ready) document.fonts.ready.then(settle);
  customElements.whenDefined('eo-card').then(settle);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
