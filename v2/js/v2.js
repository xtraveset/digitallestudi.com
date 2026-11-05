/* v2: comportament mínim de capçalera i navegació activa.
   Sense escoltes contínues de scroll: només IntersectionObserver. */
(function () {
  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.main-nav');
  if (!header || !nav || !('IntersectionObserver' in window)) return;

  // 1. Capçalera compacta quan el hero ja no és visible.
  //    Un marcador invisible al principi de la pàgina decideix l'estat.
  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);

  new IntersectionObserver(function (entries) {
    header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
  }).observe(sentinel);

  // 2. Enllaç seleccionat: la secció que ocupa el centre de la pantalla.
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
