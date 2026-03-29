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
 * Letter V has symmetric arms, each 20.6° from vertical = 69.4° from horizontal.
 *
 * Rotation maths:
 *   V arms: atan(4.33529 / 1.62556) ≈ 69.4° from horizontal
 *   V rotates CCW 69.4° → left arm lands on horizontal axis (= base of logo stand)
 *
 *   Logo diagonal angle: atan((70-4)/(66-8)) = atan(66/58) ≈ 48.7° from horizontal
 *   E opening points right; rotating CW by ~41.2° tilts it to match the diagonal
 *
 * Animation sequence:
 * 0.0s  Word "EVOTRENDS" using real letter paths (E=white/blue, V=orange, rest=grey)
 * 1.4s  O,T,R,E,N,D,S fade out staggered right→left
 * 2.9s  E and V slide toward each other (converge)
 * 3.9s  E rotates CW 41.2° (C-shape → circle), V rotates CCW 69.4° (V → diagonal+base)
 * 5.0s  Cross-fade: letter layer out, globe SVG in with stroke-draw animation
 * 6.8s  Globe begins slow continuous rotation around its centre (40, 36)
 */
(function initLogoAnim() {
  const lsText = document.getElementById('lsText');
  const lsMark = document.getElementById('lsMark');
  if (!lsText || !lsMark) return; // only runs on index.html

  const FADE_IDS = ['lO','lT','lR','lE2','lN','lD','lS'];
  const g = id => document.getElementById(id);

  function move(el, transform, dur) {
    /* transform-box:fill-box + transform-origin:center are set in CSS
       so all transforms rotate around each letter's own geometric centre */
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

  /* Phase 3 — E and V converge toward each other */
  setTimeout(() => {
    move(g('lE'), 'translateX(24px)',  0.8);
    move(g('lV'), 'translateX(-16px)', 0.8);
  }, 2900);

  /* Phase 4 — E rotates CW 41.2° (→ globe circle), V rotates CCW 69.4° (→ diagonal+base) */
  setTimeout(() => {
    move(g('lE'), 'translateX(24px)  rotate(41.2deg)',  1.1);
    move(g('lV'), 'translateX(-16px) rotate(-69.4deg)', 1.1);
  }, 3900);

  /* Phase 5 — cross-fade text → globe SVG, then stroke-draw */
  setTimeout(() => {
    lsText.style.opacity = '0';

    lsMark.style.transition = 'opacity 0.65s ease';
    lsMark.style.opacity    = '1';

    /* Draw circle (E → globe sphere) */
    const c = g('lsC');
    c.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
    c.style.strokeDashoffset = '0';

    /* Draw diagonal arm of V */
    setTimeout(() => {
      const d = g('lsD');
      d.style.transition = 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)';
      d.style.strokeDashoffset = '0';
    }, 950);

    /* Draw horizontal base (stand) */
    setTimeout(() => {
      const b = g('lsB');
      b.style.transition = 'stroke-dashoffset 0.32s cubic-bezier(0.4,0,0.2,1)';
      b.style.strokeDashoffset = '0';
    }, 1550);
  }, 5000);

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
  }, 6800);
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
