/* Barre de progression au scroll + surlignage du sommaire actif.
   Partagé par toutes les pages — aucune dépendance externe. */
(function () {
    var bar = document.getElementById('progressBar');
    var doc = document.documentElement;

    if (bar) {
        var onScroll = function () {
            var max = doc.scrollHeight - doc.clientHeight;
            bar.style.transform = 'scaleX(' + (max > 0 ? doc.scrollTop / max : 0) + ')';
        };
        document.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('.toc__link'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
            var link = map[e.target.id];
            if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('.chapter').forEach(function (s) { observer.observe(s); });
})();
