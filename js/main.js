'use strict';

/* ── Nav scroll shadow ──────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ── Mobile nav toggle ──────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const bars   = navToggle.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  }
});

/* Close mobile nav on any link click */
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => navLinks?.classList.remove('open'));
});

/* ── Active nav link ────────────────────────────────────── */
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Scroll reveal ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.07 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Staggered reveal for child items ───────────────────── */
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const children = parent.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});

/* ── CTA option selector ────────────────────────────────── */
document.querySelectorAll('.cta-opt[data-subject]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cta-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const subjectField = document.querySelector('#subject');
    if (subjectField) {
      subjectField.value = btn.dataset.subject;
    }
  });
});

/* ── Hero Logo Animation: EVOTRENDS → Globe ─────────────── */
/*
 * Reverse-engineered from the client's original Apple Motion project
 * (MOTION-Animation/OwnBrandsAnimation/EtoTrends/EtoTrends.motn + .mov —
 * see that .mov for the source choreography this reproduces). Frame-by-frame
 * analysis of the .mov (ffmpeg + pixel measurement, not guesswork) showed:
 *
 *  - The word fades down to just "V" (E fades out too — it does NOT rotate
 *    into the ring itself, unlike this file's previous version).
 *  - The ring is a SEPARATE element (matches Media/O.png / LogoLetters/E's
 *    own glyph shape — both have a small gap, not a closed circle) that
 *    grows from nothing while spinning fast, decelerating to a stop with
 *    the gap at top-left.
 *  - At the same time, V's two arms swing from a plain symmetric "V" into
 *    the final diagonal + horizontal stand (a genuine shape morph, not a
 *    rigid rotation).
 *  - Once settled, the flat ring periodically cross-fades into a
 *    photographic Earth and back (~6.3s–9.7s in the source, then implied
 *    loop) — reproduced here with images/earth-texture.jpg (re-exported
 *    from the source project's own Media/Earth.usdz texture).
 *
 * Simplification vs. the source: the source's opening 0–1.4s has a fancier
 * "multiple duplicates sweeping across" intro on the wordmark. Reproducing
 * that exactly needs a dedicated compositing effect; this version keeps the
 * simpler fade used before. Everything from "isolate down to V" onward
 * follows the source closely.
 *
 * Timeline:
 * 0.0s   Word "EVOTRENDS" (E tinted blue, V orange, rest grey), fades in
 * 1.2s   O,T,R,E2,N,D,S fade out, staggered right→left
 * 3.2s   E and V have stayed put and visible this whole time (per the
 *        client's note: viewers must still see E and V right up to the
 *        moment the transformation/rotation begins). Now: V dissolves away
 *        as its replacement (the diagonal+base stand) morphs into place in
 *        the mark; E, instead of just vanishing, rotates in place and
 *        shifts to the globe's blue while #lsSphere spins up underneath —
 *        so it visibly reads as "E itself, through rotation, becomes the
 *        ring", not "E disappears and an unrelated circle appears" (the
 *        bug reported against the previous version). E fades out only
 *        after its rotation is under way and the real sphere is already
 *        visible and spinning, so the two overlap instead of handing off
 *        abruptly. lsD/lsB's SMIL <animate>s fire at the same moment,
 *        morphing V's arms into the stand (1.3s).
 * 4.6s   Hold on the static mark (ring + stand)
 * 6.3s   Earth cross-fade pulse: fades in, holds, fades out — ONCE — then
 *        the mark rests permanently on the plain ring + stand (no earth,
 *        no further looping). See startEarthPulse() below.
 *
 * Fix history (see PROJECT_LOG / git log for the full story): an earlier
 * version spun the whole mark (ring + stand) as one group, which made the
 * stand sweep around like a propeller; then had the stand's base line
 * trailing off past the circle's edge instead of running under it. Both are
 * fixed here structurally — #lsSphere is the only thing that ever
 * transforms, and lsD/lsB's *final* coordinates (set as the SMIL `to`
 * value) are the already-corrected ones. A later round fixed two more
 * reported issues: E flatly vanishing instead of visibly becoming the ring
 * (see Phase 3/4 below), and the Earth pulse looping forever instead of
 * playing once (see startEarthPulse below).
 */
(function initLogoAnim() {
  const lsText = document.getElementById('lsText');
  const lsMark = document.getElementById('lsMark');
  if (!lsText || !lsMark) return; // only runs on index.html

  const FADE_IDS = ['lO','lT','lR','lE2','lN','lD','lS'];
  const g = id => document.getElementById(id);
  const fadeOut = (el) => {
    if (!el) return;
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.opacity     = '0';
    el.style.transform   = 'translateY(-10px) scale(0.75)';
  };

  /* Phase 2 — stagger-fade O through S, right to left */
  setTimeout(() => {
    [...FADE_IDS].reverse().forEach((id, i) => setTimeout(() => fadeOut(g(id)), i * 85));
  }, 1200);

  /* Phase 3 — nothing happens here any more: E and V both stay fully
     visible and untouched until Phase 4, so viewers still see them right
     up to the moment the transformation/rotation begins (client note). */

  /* Phase 4 — V dissolves away (its replacement morphs into shape in the
     mark); E rotates in place and tints toward the globe's blue instead of
     just fading flat, so it visibly reads as "E becomes the ring" rather
     than vanishing while an unrelated circle appears. lsText's own opacity
     is left alone (not animated) so E's rotation/fade are on their own,
     independent timeline instead of being dragged down by a parent fade. */
  setTimeout(() => {
    fadeOut(g('lV'));

    const eLetter = g('lE');
    if (eLetter) {
      // E doesn't just spin in place at its own tiny letter size (which
      // left it stranded off to the side while the much bigger ring formed
      // elsewhere — two disconnected shapes on screen, not "E becoming the
      // globe"). Instead, compute where the ring actually lands and fly/
      // grow E to that exact spot while it rotates, so it visibly arrives
      // at, and becomes, the ring. Measured live (not hard-coded) so it
      // still lines up if the layout ever changes.
      const eRect  = eLetter.getBoundingClientRect();
      const markSvg = lsMark.querySelector('.ls-svg');
      let dx = 0, dy = 0, scale = 3;
      if (markSvg) {
        const svgRect = markSvg.getBoundingClientRect();
        // viewBox is "0 0 110 90"; the ring is cx=40 cy=36 r=27 in that
        // space — convert to on-screen coordinates via the svg's own
        // rendered box (this works even while #lsSphere inside is still
        // scaled down, since the outer <svg> itself is never transformed).
        const ringCenterX = svgRect.left + (40 / 110) * svgRect.width;
        const ringCenterY = svgRect.top  + (36 / 90)  * svgRect.height;
        const ringDiameter = (54 / 110) * svgRect.width;
        const eCenterX = eRect.left + eRect.width / 2;
        const eCenterY = eRect.top + eRect.height / 2;
        dx    = ringCenterX - eCenterX;
        dy    = ringCenterY - eCenterY;
        scale = ringDiameter / eRect.width;
      }

      // Rotate + grow + fly to the ring's position over 0.9s while still
      // fully opaque (this is the "E becomes the globe" beat); only start
      // fading E out 0.5s in, once the real spinning sphere is already
      // visible at that same spot, so the two overlap and hand off smoothly
      // instead of E vanishing and an unrelated circle appearing.
      eLetter.style.transition =
        'transform 0.9s cubic-bezier(0.22,0.61,0.36,1), ' +
        'color 0.9s ease, ' +
        'opacity 0.5s ease 0.5s';
      eLetter.style.transform = `translate(${dx}px, ${dy}px) rotate(-135deg) scale(${scale})`;
      eLetter.style.color     = '#4A78C4'; // matches the ring's stroke color
      eLetter.style.opacity   = '0';
    }

    lsMark.style.transition = 'opacity 0.5s ease';
    lsMark.style.opacity    = '1';

    // #lsSphere (the ring) and #lsEarthGroup (the earth photo, kept as a
    // separate, later-painted sibling so it renders above the stand lines —
    // see index.html) must move in perfect lock-step, so both get the exact
    // same transition/transform.
    ['lsSphere', 'lsEarthGroup'].forEach(id => {
      const el = g(id);
      if (!el) return;
      el.style.transition = 'transform 1.3s cubic-bezier(0.22,0.61,0.36,1)';
      el.style.transform  = 'scale(1) rotate(-121deg)'; // settles with the gap at top-left
    });

    ['lsD', 'lsB'].forEach(id => {
      const line = g(id);
      if (!line) return;
      // SMIL <animate> children declared begin="indefinite" in the markup —
      // trigger them all together so both arms morph in lock-step.
      Array.from(line.querySelectorAll('animate')).forEach(a => a.beginElement());
    });
  }, 3200);

  /* Phase 5 — hold, then play the Earth cross-fade pulse exactly ONCE.
     After it fades back out, the mark rests permanently on the plain ring
     + stand — no further looping (client note: the repeating loop read as
     unserious/unprofessional). */
  setTimeout(startEarthPulse, 6300);

  function startEarthPulse() {
    const earth = g('lsEarth');
    if (!earth) return;
    const FADE = 1.0;   // seconds to cross-fade in/out
    const HOLD = 2.2;   // seconds to hold fully visible

    earth.style.transition = `opacity ${FADE}s ease`;
    earth.style.opacity    = '1';
    // Wait for the fade-in to finish, THEN hold for HOLD before fading out
    // (not HOLD measured from the start of the fade-in). No repeat: once
    // this single fade-out completes, only the plain ring is left on screen.
    setTimeout(() => {
      earth.style.transition = `opacity ${FADE}s ease`;
      earth.style.opacity    = '0';
    }, (FADE + HOLD) * 1000);
  }
})();

/* ── Contact form pre-fill from URL params ──────────────── */
const params  = new URLSearchParams(location.search);
const subject = params.get('s');
if (subject) {
  const map = {
    consortium: 'Build a Consortium',
    tech:       'Commercialize Technology',
    market:     'Enter EU Market',
    funding:    'Raise Funding',
  };
  const subjectField = document.querySelector('#subject');
  if (subjectField && map[subject]) {
    subjectField.value = map[subject];
  }
}
