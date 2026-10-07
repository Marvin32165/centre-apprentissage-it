/* Page glossaire : filtre par texte et par domaine, index A–Z, liens vers
   les chapitres. Les données viennent de assets/glossaire.js (généré). */
(function () {
    'use strict';
    var G = window.GLOSSAIRE;
    var list = document.querySelector('.glo__list');
    if (!G || !list) return;
    var input = document.querySelector('.glo__search');
    var doms = document.querySelector('.glo__doms');
    var az = document.querySelector('.glo__az');
    var count = document.querySelector('.glo__count');
    var dom = '';

    function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function letter(t) { var c = norm(t).replace(/[^a-z0-9]/g, '').charAt(0); return /[a-z]/.test(c) ? c.toUpperCase() : '#'; }

    G.termes.forEach(function (e) { e.hay = norm(e.t + ' ' + e.x + ' ' + e.d); e.L = letter(e.t); });

    var facts = document.querySelector('[data-glo-facts]');
    if (facts) {
        var mods = {};
        G.termes.forEach(function (e) { e.l.forEach(function (l) { mods[l[0]] = 1; }); });
        facts.innerHTML = '<span class="fact"><b>Termes</b> ' + G.termes.length + '</span>' +
            '<span class="fact"><b>Domaines</b> ' + G.domaines.length + '</span>' +
            '<span class="fact"><b>Modules reliés</b> ' + Object.keys(mods).length + '</span>';
    }

    doms.innerHTML = ['Tout'].concat(G.domaines).map(function (d, i) {
        return '<button type="button" class="srs__chip" aria-pressed="' + (i ? 'false' : 'true') + '" data-dom="' + (i ? esc(d) : '') + '">' + esc(d) + '</button>';
    }).join('');
    doms.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-dom]');
        if (!b) return;
        dom = b.getAttribute('data-dom');
        Array.prototype.forEach.call(doms.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        render();
    });

    function render() {
        var q = norm(input.value.trim());
        var words = q.split(/\s+/).filter(Boolean);
        var shown = G.termes.filter(function (e) {
            if (dom && e.dom !== dom) return false;
            return words.every(function (w) { return e.hay.indexOf(w) > -1; });
        });
        if (q) {
            shown.sort(function (a, b) {
                var at = norm(a.t), bt = norm(b.t);
                var sa = at === q ? 0 : at.indexOf(q) === 0 ? 1 : at.indexOf(q) > -1 ? 2 : 3;
                var sb = bt === q ? 0 : bt.indexOf(q) === 0 ? 1 : bt.indexOf(q) > -1 ? 2 : 3;
                return sa - sb;
            });
        }
        count.textContent = shown.length + ' terme' + (shown.length > 1 ? 's' : '') + (q || dom ? ' sur ' + G.termes.length : '');
        var html = '', cur = '';
        var letters = {};
        shown.forEach(function (e) {
            if (!q && e.L !== cur) { cur = e.L; html += '<h2 class="glo__letter" id="lettre-' + cur + '">' + cur + '</h2>'; }
            letters[e.L] = 1;
            html += '<article class="glo__item" id="t-' + e.id + '">' +
                '<h3 class="glo__term">' + esc(e.t) + (e.x ? ' <span class="glo__x">' + esc(e.x) + '</span>' : '') + '</h3>' +
                '<p class="glo__def">' + esc(e.d) + '</p>' +
                (e.l.length ? '<p class="glo__links"><span class="glo__where">Expliqué dans</span>' + e.l.map(function (l) {
                    return '<a href="modules/' + l[0] + '.html#' + l[1] + '"><b>' + esc(l[3]) + '</b> ' + esc(l[2]) + '</a>';
                }).join('') + '</p>' : '') +
                '<p class="glo__dom">' + esc(e.dom) + '</p></article>';
        });
        list.innerHTML = html || '<p class="glo__empty">Aucun terme ne correspond. Essaie un autre mot, ou la recherche globale (<kbd>Ctrl</kbd> <kbd>K</kbd>).</p>';
        az.innerHTML = q ? '' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (l) {
            return letters[l] ? '<a href="#lettre-' + l + '">' + l + '</a>' : '<span>' + l + '</span>';
        }).join('');
    }
    input.addEventListener('input', render);
    render();

    /* Arrivée sur #t-terme : le surligner. */
    function focusHash() {
        var h = decodeURIComponent(location.hash.slice(1));
        if (h.indexOf('t-') !== 0) return;
        var el = document.getElementById(h);
        if (!el) { input.value = ''; dom = ''; render(); el = document.getElementById(h); }
        if (el) {
            el.classList.add('is-target');
            /* Après le chargement des polices : la mise en page ne bouge plus. */
            var go = function () { el.scrollIntoView({ block: 'start', behavior: 'instant' }); };
            go();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
            setTimeout(function () { el.classList.remove('is-target'); }, 2600);
        }
    }
    window.addEventListener('hashchange', focusHash);
    focusHash();
})();
