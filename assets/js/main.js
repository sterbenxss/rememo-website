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

/* ---------------------------------------------------------------------------
 * The hero's cursor light.
 *
 * Only this one section has it. The pointer's position is eased toward rather
 * than written straight through, so the light trails the cursor slightly the
 * way the reference does, and it is written as CSS custom properties so the
 * gradient itself stays in the stylesheet.
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var glow = hero && hero.querySelector('.hero__glow');
  if (!glow) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Pointer light on a touch screen would only ever be a stuck blob.
  if (!window.matchMedia('(hover: hover)').matches) return;

  var targetX = 50, targetY = 40;   // percentages
  var x = 50, y = 40;
  var running = false;

  function frame() {
    x += (targetX - x) * 0.14;
    y += (targetY - y) * 0.14;
    glow.style.setProperty('--glow-x', x.toFixed(2) + '%');
    glow.style.setProperty('--glow-y', y.toFixed(2) + '%');
    if (Math.abs(targetX - x) > 0.05 || Math.abs(targetY - y) > 0.05) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  hero.addEventListener('mousemove', function (event) {
    var box = hero.getBoundingClientRect();
    targetX = ((event.clientX - box.left) / box.width) * 100;
    targetY = ((event.clientY - box.top) / box.height) * 100;
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  });
})();
