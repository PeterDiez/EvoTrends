'use strict';
/* vZen concept — small additions layered on top of main.js.
   main.js still drives: nav scroll shadow, mobile nav toggle, active link,
   .reveal scroll-in, [data-stagger], CTA option selector, email reveal.
   This file only adds: animated stat counters. */

/* ── Animated stat counters ─────────────────────────────────────────
   Usage: <span class="vz-stat-num" data-count-to="320" data-suffix="%">0</span>
   Counts up once, when scrolled into view. */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const animate = (el) => {
    const to     = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || '';
    const dur    = 1400;
    const start  = performance.now();
    const from   = 0;

    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const val = from + (to - from) * eased;
      const display = (to % 1 === 0) ? Math.round(val) : val.toFixed(1);
      el.textContent = display + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => io.observe(el));
})();
