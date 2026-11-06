/* v2: comportament de capçalera, menú, idioma, rellotge, salutació i temperatura.
   Scroll: només IntersectionObserver, sense escoltes contínues. */
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('main-nav');
  var menuBtn = document.querySelector('[data-menu]');
  var langBtn = document.getElementById('lang-switch');
  var clockEl = document.getElementById('clock');
  var greetEl = document.querySelector('[data-greeting]');
  var tempEl = document.getElementById('temp');
  var MADRID = 'Europe/Madrid';

  // ---------- Idioma (per defecte català) ----------
  var STORAGE_KEY = 'v2-lang';

  function readStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* sense emmagatzematge: no passa res */ }
  }

  function setLang(lang) {
    doc.lang = lang;
    document.querySelectorAll('[data-ca][data-es]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text !== null) el.textContent = text;
    });
    if (langBtn) langBtn.setAttribute('aria-checked', lang === 'ca' ? 'true' : 'false');
    updateGreeting();
    updateClock();
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var next = doc.lang === 'ca' ? 'es' : 'ca';
      storeLang(next);
      setLang(next);
    });
  }

  var saved = readStoredLang();
  if (saved === 'es') setLang('es');

  // ---------- Menú ----------
  function setMenu(open) {
    if (!header || !menuBtn) return;
    header.classList.toggle('is-menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!header.classList.contains('is-menu-open'));
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ---------- Data, hora i salutació (zona horària de Madrid) ----------
  function madridHour() {
    var h = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: MADRID }).format(new Date());
    return parseInt(h, 10) % 24;
  }

  function updateGreeting() {
    if (!greetEl) return;
    var h = madridHour();
    var isCa = doc.lang !== 'es';
    var text;
    if (h >= 5 && h < 12) text = isCa ? 'Bon dia' : 'Buenos días';
    else if (h >= 12 && h < 20) text = isCa ? 'Bona tarda' : 'Buenas tardes';
    else text = isCa ? 'Bona nit' : 'Buenas noches';
    greetEl.textContent = text;
  }

  function updateClock() {
    if (!clockEl) return;
    var now = new Date();
    var time = new Intl.DateTimeFormat(doc.lang === 'es' ? 'es-ES' : 'ca-ES', {
      hour: '2-digit', minute: '2-digit', timeZone: MADRID
    }).format(now);
    clockEl.textContent = time;
    clockEl.setAttribute('datetime', now.toISOString());
  }

  updateGreeting();
  updateClock();
  // Cada 30 s n'hi ha prou: el rellotge mostra minuts.
  setInterval(function () { updateClock(); updateGreeting(); }, 30000);

  // ---------- Temperatura actual de Vilanova i la Geltrú ----------
  function hideTemp() {
    if (!tempEl) return;
    tempEl.hidden = true;
    if (tempEl.previousElementSibling) tempEl.previousElementSibling.hidden = true;
  }

  if (tempEl && 'fetch' in window) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=41.2216&longitude=1.7258' +
      '&current=temperature_2m&timezone=Europe%2FMadrid';
    fetch(url, { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var t = data && data.current && data.current.temperature_2m;
        if (typeof t !== 'number') throw new Error('sense dades');
        tempEl.textContent = Math.round(t) + 'º';
      })
      .catch(hideTemp);
  } else {
    hideTemp();
  }

  // ---------- Capçalera compacta quan el hero ja no és visible ----------
  if (!header || !nav || !('IntersectionObserver' in window)) return;

  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);

  new IntersectionObserver(function (entries) {
    header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
  }).observe(sentinel);

  // ---------- Enllaç seleccionat: la secció al centre de la pantalla ----------
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var linkById = {};
  links.forEach(function (a) { linkById[a.getAttribute('href').slice(1)] = a; });

  var sections = Object.keys(linkById)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      var link = linkById[entry.target.id];
      if (link) link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(function (s) { sectionObserver.observe(s); });
})();
