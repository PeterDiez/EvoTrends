/* ============================================================
   EvoTrends — language detection, auto-redirect & manual switch
   - English pages live at the site root (index.html, services.html, ...)
   - Spanish pages live under /es/ (same filenames)
   - On first visit to an English page, if the browser's language is
     Spanish or Catalan, redirect to the Spanish equivalent — unless
     the visitor has already picked a language manually (stored in
     localStorage), in which case their choice always wins.
   - This script must load early in <head> (before render) to avoid
     a visible flash of the wrong language.
   ============================================================ */
(function () {
  'use strict';

  function currentFile() {
    var path = window.location.pathname;
    var parts = path.split('/').filter(Boolean);
    var last = parts[parts.length - 1] || 'index.html';
    if (last.indexOf('.') === -1) last = 'index.html';
    return last;
  }

  function isSpanishPath() {
    return window.location.pathname.indexOf('/es/') === 0;
  }

  function getOverride() {
    try { return localStorage.getItem('evo_lang'); } catch (e) { return null; }
  }

  function setOverride(lang) {
    try { localStorage.setItem('evo_lang', lang); } catch (e) { /* ignore */ }
  }

  // ---- Auto-redirect (English pages only) ----
  try {
    if (!isSpanishPath() && getOverride() !== 'en') {
      var langs = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || ''];

      var wantsSpanish = langs.some(function (l) {
        l = (l || '').toLowerCase();
        return l.indexOf('es') === 0 || l.indexOf('ca') === 0;
      });

      if (wantsSpanish) {
        var target = '/es/' + currentFile() + window.location.search + window.location.hash;
        window.location.replace(target);
      }
    }
  } catch (e) { /* fail silently — worst case, visitor stays on English */ }

  // ---- Manual language switcher ----
  function wireSwitchLinks() {
    var els = document.querySelectorAll('[data-lang-switch]');
    if (!els.length) return;
    var onES = isSpanishPath();
    var file = currentFile();
    els.forEach(function (el) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (onES) {
          setOverride('en');
          window.location.href = '/' + file;
        } else {
          setOverride('es');
          window.location.href = '/es/' + file;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireSwitchLinks);
  } else {
    wireSwitchLinks();
  }
})();
