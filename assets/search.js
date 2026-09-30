(function () {
    function normalize(s) {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    var box = document.getElementById('site-search');
    var results = document.getElementById('site-search-results');
    if (!box || !results || !window.SEARCH_INDEX) return;

    var index = window.SEARCH_INDEX.map(function (e) {
        return {
            file: e.file, module: e.module, anchor: e.anchor, title: e.title, snippet: e.snippet,
            haystack: normalize(e.module + ' ' + e.title + ' ' + e.snippet)
        };
    });

    function excerpt(snippet, term) {
        var norm = normalize(snippet);
        var i = norm.indexOf(term);
        if (i === -1) return snippet.slice(0, 140) + '…';
        var start = Math.max(0, i - 50);
        return (start > 0 ? '…' : '') + snippet.slice(start, start + 180) + '…';
    }

    function render(query) {
        var q = normalize(query.trim());
        if (q.length < 2) {
            results.innerHTML = '';
            results.hidden = true;
            return;
        }
        var terms = q.split(/\s+/).filter(Boolean);
        var matches = index.filter(function (e) {
            return terms.every(function (t) { return e.haystack.indexOf(t) !== -1; });
        }).slice(0, 12);

        if (!matches.length) {
            results.innerHTML = '<div class="search-empty">Aucun résultat pour « ' + query + ' ».</div>';
            results.hidden = false;
            return;
        }

        results.innerHTML = matches.map(function (m) {
            return '<a class="search-hit" href="modules/' + m.file + '#' + m.anchor + '">' +
                '<span class="search-hit__module">' + m.module + '</span>' +
                '<span class="search-hit__title">' + m.title + '</span>' +
                '<span class="search-hit__snippet">' + excerpt(m.snippet, terms[0]) + '</span>' +
                '</a>';
        }).join('');
        results.hidden = false;
    }

    box.addEventListener('input', function () { render(box.value); });
    box.addEventListener('focus', function () { if (box.value.trim().length >= 2) render(box.value); });
    document.addEventListener('click', function (ev) {
        if (!results.contains(ev.target) && ev.target !== box) results.hidden = true;
    });
})();
