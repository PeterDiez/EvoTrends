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
 * Uses actual brand-font letter SVG paths from LogoLetters/ folder.
 * Letter E in this font is a circular/C-shaped glyph (nearly a full ring).
 * Letter V has symmetric arms, each 20.6° from vertical.
 *
 * Animation sequence:
 * 0.0s  Word "EVOTRENDS" using real letter paths (E=white/blue, V=orange, rest=grey)
 * 1.4s  O,T,R,E,N,D,S fade out staggered right→left
 * 2.9s  E and V slide toward each other (converge) and begin rotation
 * 3.9s  E rotates CW 41.2° (C-shape → more circular); V leans CW ~20° to settle as stand
 * 4.8s  Cross-fade: letter layer fades out, globe SVG strokes draw in
 * 6.4s  Globe begins slow continuous rotation around its centre (40, 36)
 *
 * Note on V rotation:
 *   V leans CW (positive angle) — its right arm tips toward horizontal, suggesting
 *   the base of the stand. The cross-fade to the static logo mark carries the story
 *   the rest of the way: V becomes the diagonal arm + base of the globe-on-stand mark.
 *   CCW rotation was intentionally avoided: a large CCW rotation makes V appear to
 *   "fall apart to the left" rather than settle into stand position.
 */
(function initLogoAnim() {
  const lsText = document.getElementById('lsText');
  const lsMark = document.getElementById('lsMark');
  if (!lsText || !lsMark) return; // only runs on index.html

  const FADE_IDS = ['lO','lT','lR','lE2','lN','lD','lS'];
  const g = id => document.getElementById(id);

  function move(el, transform, dur) {
    /* transform-box:fill-box + transform-origin:center set in CSS → rotates
       around each letter's own geometric centre */
    el.style.transition = `transform ${dur}s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease`;
    el.style.transform  = transform;
  }

  /* Phase 2 — stagger-fade O through S, right to left */
  setTimeout(() => {
    [...FADE_IDS].reverse().forEach((id, i) => {
      setTimeout(() => {
        const el = g(id);
        if (!el) return;
        el.style.opacity   = '0';
        el.style.transform = 'translateY(-10px) scale(0.75)';
      }, i * 85);
    });
  }, 1400);

  /* Phase 3 — E and V converge; E also begins its CW rotation toward circular */
  setTimeout(() => {
    move(g('lE'), 'translateX(24px) rotate(41.2deg)', 1.4);  // E closes into circle
    move(g('lV'), 'translateX(-16px)',                 0.9);  // V slides left
  }, 2900);

  /* Phase 4 — V settles CW into stand orientation (right arm tips toward horizontal base) */
  setTimeout(() => {
    move(g('lV'), 'translateX(-16px) rotate(20deg)', 0.9);
  }, 3800);

  /* Phase 5 — cross-fade text layer → globe SVG with stroke-draw
     Starts at 4.8s (V settling animation begins at 3.8s, lasts 0.9s → settle done ~4.7s) */
  setTimeout(() => {
    lsText.style.transition = 'opacity 0.5s ease';
    lsText.style.opacity    = '0';

    lsMark.style.transition = 'opacity 0.7s ease';
    lsMark.style.opacity    = '1';

    /* Draw circle first — E letter becomes the globe sphere */
    const c = g('lsC');
    c.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)';
    c.style.strokeDashoffset = '0';

    /* Draw diagonal arm — V becomes the supporting arm through the globe */
    setTimeout(() => {
      const d = g('lsD');
      d.style.transition = 'stroke-dashoffset 0.65s cubic-bezier(0.4,0,0.2,1)';
      d.style.strokeDashoffset = '0';
    }, 900);

    /* Draw horizontal base — V's second arm becomes the stand's base */
    setTimeout(() => {
      const b = g('lsB');
      b.style.transition = 'stroke-dashoffset 0.3s cubic-bezier(0.4,0,0.2,1)';
      b.style.strokeDashoffset = '0';
    }, 1450);
  }, 4800);

  /* Phase 6 — slow globe rotation around circle centre (40, 36) */
  setTimeout(() => {
    const globe = g('lsGlobe');
    if (!globe) return;
    let t0 = null;
    function spinFrame(ts) {
      if (!t0) t0 = ts;
      const deg = ((ts - t0) / 18000) * 360; // 18 s per revolution
      globe.setAttribute('transform', `rotate(${deg.toFixed(3)},40,36)`);
      requestAnimationFrame(spinFrame);
    }
    requestAnimationFrame(spinFrame);
  }, 6400);
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
