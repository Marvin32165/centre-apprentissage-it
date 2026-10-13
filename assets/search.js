(function () {
    /* Minuscules, sans accents, tout ce qui n'est pas lettre ou chiffre devient une espace.
       La longueur est conservée caractère par caractère : les positions trouvées dans le
       texte normalisé valent aussi dans le texte d'origine (pour la mise en évidence). */
    function norm(s) {
        var out = '';
        for (var i = 0; i < s.length; i++) {
            var c = s.charAt(i).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0);
            out += /[a-z0-9]/.test(c) ? c : ' ';
        }
        return out;
    }
    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var box = document.getElementById('site-search');
    var results = document.getElementById('site-search-results');
    if (!box || !results || !window.SEARCH_INDEX) return;

    var STOP = { de: 1, du: 1, des: 1, la: 1, le: 1, les: 1, un: 1, une: 1, et: 1, en: 1, au: 1, aux: 1, a: 1, l: 1, d: 1 };

    var index = window.SEARCH_INDEX.map(function (e) {
        return {
            e: e,
            module: norm(e.module.replace(/ — Module$/, '')),
            title: norm(e.title),
            kw: norm(e.kw || ''),
            snippet: norm(e.snippet)
        };
    });

    /* Le terme commence-t-il un mot de ce texte (ou, en repli, apparaît-il n'importe où) ? */
    function at(hay, t, loose) {
        var i = (' ' + hay).indexOf(' ' + t);
        if (i !== -1) return i;
        return loose ? hay.indexOf(t) : -1;
    }
    function exactWord(hay, t) { return (' ' + hay + ' ').indexOf(' ' + t + ' ') !== -1; }

    function score(it, terms, phrase, loose) {
        var total = 0;
        for (var i = 0; i < terms.length; i++) {
            var t = terms[i], s = 0;
            if (exactWord(it.title, t)) s = 14;
            else if (at(it.title, t, loose) !== -1) s = 9;
            else if (exactWord(it.kw, t)) s = 7;
            else if (at(it.kw, t, loose) !== -1) s = 5;
            else if (at(it.module, t, loose) !== -1) s = 4;
            else if (at(it.snippet, t, loose) !== -1) s = 2;
            else return 0;
            total += s;
        }
        if (terms.length > 1 && (' ' + it.title + ' ').indexOf(' ' + phrase + ' ') !== -1) total += 8;
        return total;
    }

    function search(q) {
        var all = norm(q).split(/\s+/).filter(Boolean);
        var terms = all.filter(function (t) { return !STOP[t]; });
        if (!terms.length) terms = all;
        var phrase = terms.join(' ');
        for (var pass = 0; pass < 2; pass++) {
            var found = [];
            index.forEach(function (it, n) {
                var s = score(it, terms, phrase, pass === 1);
                if (s > 0) found.push({ it: it, s: s, n: n });
            });
            if (found.length) {
                found.sort(function (a, b) { return b.s - a.s || a.n - b.n; });
                return { terms: terms, hits: found.slice(0, 12).map(function (x) { return x.it.e; }) };
            }
        }
        return { terms: terms, hits: [] };
    }

    /* Texte échappé, avec <mark> sur les débuts de mots qui correspondent. */
    function mark(text, terms) {
        var n = norm(text), spans = [];
        terms.forEach(function (t) {
            var from = 0, i;
            while ((i = n.indexOf(t, from)) !== -1) {
                if (i === 0 || n.charAt(i - 1) === ' ') spans.push([i, i + t.length]);
                from = i + 1;
            }
        });
        spans.sort(function (a, b) { return a[0] - b[0]; });
        var out = '', pos = 0;
        spans.forEach(function (s) {
            if (s[1] <= pos) return;
            var a = Math.max(s[0], pos);
            out += esc(text.slice(pos, a)) + '<mark>' + esc(text.slice(a, s[1])) + '</mark>';
            pos = s[1];
        });
        return out + esc(text.slice(pos));
    }

    function excerpt(snippet, terms) {
        var n = norm(snippet), best = -1;
        terms.forEach(function (t) {
            var i = (' ' + n).indexOf(' ' + t);
            if (i !== -1 && (best === -1 || i < best)) best = i;
        });
        if (best === -1) return mark(snippet.slice(0, 150), terms) + '…';
        var start = Math.max(0, best - 50);
        return (start > 0 ? '…' : '') + mark(snippet.slice(start, start + 180), terms) + '…';
    }

    var active = -1;
    function setActive(i) {
        var hits = results.querySelectorAll('.search-hit');
        if (!hits.length) return;
        active = (i + hits.length) % hits.length;
        hits.forEach(function (h, k) {
            h.classList.toggle('is-active', k === active);
            if (k === active) h.scrollIntoView({ block: 'nearest' });
        });
    }

    function render(query) {
        active = -1;
        if (norm(query).trim().length < 2) {
            results.innerHTML = '';
            results.hidden = true;
            return;
        }
        var r = search(query);
        if (!r.hits.length) {
            results.innerHTML = '<div class="search-empty">Aucun résultat pour « ' + esc(query.trim()) + ' ».</div>';
            results.hidden = false;
            return;
        }
        results.innerHTML = r.hits.map(function (m) {
            return '<a class="search-hit" href="modules/' + esc(m.file) + '#' + esc(m.anchor) + '">' +
                '<span class="search-hit__module">' + esc(m.module.replace(/ — Module$/, '')) + '</span>' +
                '<span class="search-hit__title">' + mark(m.title, r.terms) + '</span>' +
                '<span class="search-hit__snippet">' + excerpt(m.snippet, r.terms) + '</span>' +
                '</a>';
        }).join('');
        results.hidden = false;
    }

    box.addEventListener('input', function () { render(box.value); });
    box.addEventListener('focus', function () { if (norm(box.value).trim().length >= 2) render(box.value); });
    box.addEventListener('keydown', function (ev) {
        if (results.hidden) return;
        if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(active + 1); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(active < 0 ? -1 : active - 1); }
        else if (ev.key === 'Enter') {
            var hits = results.querySelectorAll('.search-hit');
            var h = hits[active < 0 ? 0 : active];
            if (h) { ev.preventDefault(); location.href = h.href; }
        } else if (ev.key === 'Escape') results.hidden = true;
    });
    document.addEventListener('click', function (ev) {
        if (!results.contains(ev.target) && ev.target !== box) results.hidden = true;
    });
})();
