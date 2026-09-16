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
 * 2.0s   E fades out too, leaving "V" alone for a beat
 * 3.2s   Cross-fade lsText → lsMark. #lsSphere transitions scale(0.1)→1 and
 *        spins down to its settled angle (1.3s); lsD/lsB's SMIL <animate>s
 *        fire at the same moment, morphing V's arms into the stand (1.3s)
 * 4.6s   Hold on the static mark (ring + stand)
 * 6.3s   Earth cross-fade pulse begins, then loops indefinitely — see
 *        startEarthPulse() below
 *
 * Fix history (see PROJECT_LOG / git log for the full story): an earlier
 * version spun the whole mark (ring + stand) as one group, which made the
 * stand sweep around like a propeller; then had the stand's base line
 * trailing off past the circle's edge instead of running under it. Both are
 * fixed here structurally — #lsSphere is the only thing that ever
 * transforms, and lsD/lsB's *final* coordinates (set as the SMIL `to`
 * value) are the already-corrected ones.
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

  /* Phase 3 — E fades too, leaving V alone (matches the source: the ring
     that appears next is a new element, not E rotating into shape) */
  setTimeout(() => fadeOut(g('lE')), 2000);

  /* Phase 4 — cross-fade text → mark; spin up the sphere and morph V's arms */
  setTimeout(() => {
    lsText.style.transition = 'opacity 0.5s ease';
    lsText.style.opacity    = '0';

    lsMark.style.transition = 'opacity 0.5s ease';
    lsMark.style.opacity    = '1';

    const sphere = g('lsSphere');
    if (sphere) {
      sphere.style.transition = 'transform 1.3s cubic-bezier(0.22,0.61,0.36,1)';
      sphere.style.transform  = 'scale(1) rotate(-121deg)'; // settles with the gap at top-left
    }

    ['lsD', 'lsB'].forEach(id => {
      const line = g(id);
      if (!line) return;
      // SMIL <animate> children declared begin="indefinite" in the markup —
      // trigger them all together so both arms morph in lock-step.
      Array.from(line.querySelectorAll('animate')).forEach(a => a.beginElement());
    });
  }, 3200);

  /* Phase 5 — hold, then start the looping Earth cross-fade pulse */
  setTimeout(startEarthPulse, 6300);

  function startEarthPulse() {
    const earth = g('lsEarth');
    if (!earth) return;
    const FADE = 1.0;   // seconds to cross-fade in/out
    const HOLD = 2.2;   // seconds to hold fully visible
    const REST = 2.6;   // seconds to hold fully hidden before repeating

    function pulse() {
      earth.style.transition = `opacity ${FADE}s ease`;
      earth.style.opacity    = '1';
      // Wait for the fade-in to finish, THEN hold for HOLD before fading out
      // (not HOLD measured from the start of the fade-in).
      setTimeout(() => {
        earth.style.transition = `opacity ${FADE}s ease`;
        earth.style.opacity    = '0';
        // Same idea: wait for the fade-out to finish, then rest, then repeat.
        setTimeout(pulse, (FADE + REST) * 1000);
      }, (FADE + HOLD) * 1000);
    }
    pulse();
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
