/**
 * Website translation.
 *
 * The markup carries the structure and a data-i18n key per translatable
 * element; assets/js/i18n-data.js carries the words. Switching language
 * rewrites those elements, flips <html lang> and, for Arabic, <html dir>.
 *
 * The choice is remembered per visitor. A first-time visitor gets whatever
 * their browser asks for, if the app speaks it, and English otherwise.
 */
(function () {
  'use strict';

  var DICT = window.REMEMO_I18N;
  if (!DICT) return;

  var LANGS = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'pt', label: 'Português', short: 'PT' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'zh', label: '中文', short: '中文' },
    { code: 'ar', label: 'العربية', short: 'AR' },
  ];
  var STORE_KEY = 'rememo-lang';
  var RTL = { ar: true };

  function supported(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return true;
    return false;
  }

  function remembered() {
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved && supported(saved)) return saved;
    } catch (e) {
      // Private windows and blocked storage: fall through to the browser's.
    }
    var wanted = (navigator.languages || [navigator.language || 'en']).slice();
    for (var i = 0; i < wanted.length; i++) {
      var base = String(wanted[i]).toLowerCase().split('-')[0];
      if (base === 'pt') return 'pt';
      if (supported(base)) return base;
    }
    return 'en';
  }

  function apply(code) {
    var table = DICT[code] || DICT.en;
    var fallback = DICT.en;

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      var value = table[key] !== undefined ? table[key] : fallback[key];
      if (value !== undefined) nodes[i].innerHTML = value;
    }

    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', RTL[code] ? 'rtl' : 'ltr');

    // The <title> is not an element anyone sees in the page, so it is keyed
    // separately: the page tells us which title belongs to it.
    var titleKey = document.documentElement.getAttribute('data-title-key');
    if (titleKey && (table[titleKey] || fallback[titleKey])) {
      document.title = (table[titleKey] || fallback[titleKey]).replace(/<[^>]+>/g, '') + ' | ReMemo';
    }

    try {
      localStorage.setItem(STORE_KEY, code);
    } catch (e) {
      // Not being able to remember the choice is not a reason to refuse it.
    }

    var current = document.querySelector('.lang-switch__current');
    for (var j = 0; j < LANGS.length; j++) {
      if (LANGS[j].code === code && current) current.textContent = LANGS[j].short;
    }
    var options = document.querySelectorAll('.lang-switch__menu button');
    for (var k = 0; k < options.length; k++) {
      options[k].setAttribute(
        'aria-current',
        options[k].getAttribute('data-lang') === code ? 'true' : 'false'
      );
    }
  }

  function buildSwitcher() {
    var host = document.querySelector('.nav__inner');
    if (!host) return;

    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switch__button';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Language');
    button.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>' +
      '<span class="lang-switch__current">EN</span>';

    var menu = document.createElement('div');
    menu.className = 'lang-switch__menu';
    LANGS.forEach(function (lang) {
      var option = document.createElement('button');
      option.type = 'button';
      option.setAttribute('data-lang', lang.code);
      option.setAttribute('lang', lang.code);
      option.textContent = lang.label;
      option.addEventListener('click', function () {
        apply(lang.code);
        close();
      });
      menu.appendChild(option);
    });

    function close() {
      wrap.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = wrap.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', close);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });

    wrap.appendChild(button);
    wrap.appendChild(menu);

    // Before the Download button, so the row reads: brand, links, language,
    // action.
    var cta = host.querySelector('.nav__cta');
    if (cta) host.insertBefore(wrap, cta);
    else host.appendChild(wrap);
  }

  buildSwitcher();
  apply(remembered());
})();
