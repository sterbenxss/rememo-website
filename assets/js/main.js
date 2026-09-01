/* ReMemo site — mobile nav + scroll reveal. No dependencies. */
(function () {
  'use strict';

  // --- mobile navigation ---------------------------------------------------
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close after tapping a link, so the menu never covers the target.
    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- scroll reveal -------------------------------------------------------
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // Without IntersectionObserver, or when the visitor asks for less motion,
  // everything is simply shown — the animation is decoration, never content.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  targets.forEach(function (el, i) {
    // A short stagger inside each group keeps a row of cards from snapping in
    // all at once.
    el.style.transitionDelay = (i % 3) * 90 + 'ms';
    observer.observe(el);
  });
})();
