/* Comportements partagés par toutes les pages du centre d'apprentissage.
   Aucune dépendance externe, tout est dégradable : si le stockage local
   est indisponible, la page reste parfaitement utilisable.

   1. Barre de progression au scroll
   2. Surlignage du chapitre actif dans le sommaire
   3. Sommaire repliable sur mobile + compteur de progression
   4. Case « chapitre acquis » (mémorisée dans le navigateur)
   5. Bouton « copier » sur les blocs de commandes
   6. Retour en haut de page
   7. Côté portail : avancement par module, score du test, bandeau de reprise
   8. Liens entre modules, à partir de assets/catalogue.js : barre de
      navigation, fil d'Ariane, précédent / suivant, prérequis et suites,
      supports du cours ; au portail, carte interactive, suggestion du
      prochain module, boîte à outils et dossiers des cours
   9. Thème clair / sombre et palette de recherche (Ctrl+K ou « / »)
  10. De débutant à pro : paliers du catalogue, tableau de bord (portail et
      feuille de route), fiche du module dans le héro, infobulles du glossaire
      sur les sigles des chapitres

   Les scores des tests sont écrits par assets/quiz.js sous la clé
   cai.scores ; ici on ne fait que les relire pour les afficher.
*/
(function () {
    'use strict';

    var KEY_PROGRESS = 'cai.progress';
    var KEY_LAST = 'cai.last';
    var KEY_SCORES = 'cai.scores';

    /* ── Stockage tolérant aux pannes (navigation privée, cookies bloqués) ── */
    function read(key, fallback) {
        try {
            var raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }
    function write(key, value) {
        try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignoré */ }
    }

    var progress = read(KEY_PROGRESS, {}) || {};
    var pageFile = (location.pathname.split('/').pop() || 'index.html');

    function doneList(file) {
        return Array.isArray(progress[file]) ? progress[file] : [];
    }

    /* ══ 1. Barre de progression au scroll ══ */
    var bar = document.getElementById('progressBar');
    var doc = document.documentElement;
    if (bar) {
        var onScrollBar = function () {
            var max = doc.scrollHeight - doc.clientHeight;
            bar.style.transform = 'scaleX(' + (max > 0 ? doc.scrollTop / max : 0) + ')';
        };
        document.addEventListener('scroll', onScrollBar, { passive: true });
        onScrollBar();
    }

    /* ══ 6. Retour en haut ══ */
    (function backToTop() {
        var btn = document.createElement('button');
        btn.className = 'totop';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Revenir en haut de la page');
        btn.innerHTML = '↑';
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(btn);
        var toggle = function () {
            btn.classList.toggle('is-visible', doc.scrollTop > 600);
        };
        document.addEventListener('scroll', toggle, { passive: true });
        toggle();
    })();

    /* ══ 5. Bouton « copier » sur les blocs de commandes ══ */
    (function copyButtons() {
        if (!navigator.clipboard) return;
        document.querySelectorAll('.terminal').forEach(function (term) {
            var code = term.querySelector('.terminal__code');
            if (!code) return;
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'terminal__copy';
            btn.textContent = 'copier';
            btn.setAttribute('aria-label', 'Copier ces commandes');
            btn.addEventListener('click', function () {
                navigator.clipboard.writeText(code.innerText).then(function () {
                    btn.textContent = 'copié';
                    btn.classList.add('is-done');
                    setTimeout(function () {
                        btn.textContent = 'copier';
                        btn.classList.remove('is-done');
                    }, 1600);
                });
            });
            term.appendChild(btn);
        });
    })();

    /* Un bloc qui défile horizontalement (code, tableau) doit pouvoir
       recevoir le focus, sinon le clavier ne peut pas le faire défiler. */
    function focusScrollers() {
        document.querySelectorAll('.terminal__code, .table-wrap').forEach(function (el) {
            if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
                if (!el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '0'); el.setAttribute('data-scrollfocus', ''); }
            } else if (el.hasAttribute('data-scrollfocus')) { el.removeAttribute('tabindex'); el.removeAttribute('data-scrollfocus'); }
        });
    }
    window.addEventListener('load', function () {
        focusScrollers();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(focusScrollers);
        setTimeout(focusScrollers, 1500);
    });
    // L'atelier réécrit ses tableaux à chaque saisie.
    document.addEventListener('input', function () { clearTimeout(focusScrollers.u); focusScrollers.u = setTimeout(focusScrollers, 300); });
    window.addEventListener('resize', function () { clearTimeout(focusScrollers.t); focusScrollers.t = setTimeout(focusScrollers, 200); });

    var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc__link'));

    /* ══════════════ PAGE DE MODULE ══════════════ */
    if (chapters.length) {

        var linkById = {};
        tocLinks.forEach(function (l) { linkById[l.getAttribute('href').slice(1)] = l; });

        /* ── 2. Chapitre actif dans le sommaire ── */
        if (tocLinks.length && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (!e.isIntersecting) return;
                    tocLinks.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
                    var link = linkById[e.target.id];
                    if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            chapters.forEach(function (s) { observer.observe(s); });
        }

        /* ── 3 + 4. Suivi de progression ── */
        var toc = document.querySelector('.toc');
        var meter = null;
        var trackable = chapters.filter(function (c) { return c.id && !c.classList.contains('chapter--quiz'); });

        if (toc && trackable.length) {
            meter = document.createElement('div');
            meter.className = 'toc__meter';
            meter.innerHTML = '<b></b><div class="bar"><i></i></div>';
            // insertBefore exige un enfant direct : on remonte jusqu'à celui-ci
            // (le module SharePoint imbrique ses listes dans des .toc__group).
            var list = toc.querySelector('.toc__list');
            while (list && list.parentNode !== toc) { list = list.parentNode; }
            if (list) { toc.insertBefore(meter, list); } else { toc.appendChild(meter); }
        }

        function refreshMeter() {
            var done = doneList(pageFile).length;
            if (meter) {
                meter.querySelector('b').textContent = done + ' / ' + trackable.length + ' chapitres acquis';
                meter.querySelector('.bar i').style.width = (trackable.length ? (done / trackable.length) * 100 : 0) + '%';
            }
        }

        trackable.forEach(function (chap) {
            var label = document.createElement('label');
            label.className = 'chapdone';
            var box = document.createElement('input');
            box.type = 'checkbox';
            var text = document.createElement('span');
            label.appendChild(box);
            label.appendChild(text);

            var apply = function (checked) {
                box.checked = checked;
                label.classList.toggle('is-done', checked);
                text.textContent = checked ? 'Chapitre acquis' : 'Marquer comme acquis';
                var link = linkById[chap.id];
                if (link) link.classList.toggle('is-done', checked);
            };

            apply(doneList(pageFile).indexOf(chap.id) !== -1);

            box.addEventListener('change', function () {
                var list = doneList(pageFile).slice();
                var i = list.indexOf(chap.id);
                if (box.checked && i === -1) { list.push(chap.id); }
                if (!box.checked && i !== -1) { list.splice(i, 1); }
                progress[pageFile] = list;
                write(KEY_PROGRESS, progress);
                apply(box.checked);
                refreshMeter();
                try { document.dispatchEvent(new CustomEvent('cai:progress')); } catch (e) { /* ignoré */ }
            });

            chap.appendChild(label);
        });
        refreshMeter();

        /* ── 3. Sommaire repliable sur mobile ── */
        if (toc && tocLinks.length > 6) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'toc__toggle';
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'Sommaire — ' + tocLinks.length + ' chapitres';
            var back = toc.querySelector('.toc__back');
            toc.insertBefore(btn, back ? back.nextSibling : toc.firstChild);

            var small = window.matchMedia('(max-width: 900px)');
            var sync = function () {
                if (small.matches) {
                    toc.classList.add('is-collapsed');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    toc.classList.remove('is-collapsed');
                }
            };
            btn.addEventListener('click', function () {
                var collapsed = toc.classList.toggle('is-collapsed');
                btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            });
            tocLinks.forEach(function (l) {
                l.addEventListener('click', function () {
                    if (small.matches) { toc.classList.add('is-collapsed'); btn.setAttribute('aria-expanded', 'false'); }
                });
            });
            if (small.addEventListener) { small.addEventListener('change', sync); }
            sync();
        }

        /* ── Mémoriser la dernière page lue, pour le bandeau de reprise ── */
        var moduleName = document.querySelector('.toc__label');
        write(KEY_LAST, {
            file: pageFile,
            name: moduleName ? moduleName.textContent.trim() : document.title
        });
    }

    /* ══════════════ PORTAIL ══════════════ */
    if (document.querySelector('.resume') && !chapters.length) {
        var started = Object.keys(progress).filter(function (k) { return Array.isArray(progress[k]) && progress[k].length; }).length;
        var scores = read(KEY_SCORES, {}) || {};


        var last = read(KEY_LAST, null);
        var tests = Object.keys(scores).length;
        var srs = read('cai.srs', {}) || {};
        var srsKeys = Object.keys(srs);
        var srsDue = srsKeys.filter(function (k) { return srs[k] && srs[k].d <= Date.now(); }).length;
        var host = document.querySelector('.resume');
        if (host && (last || started || tests || srsKeys.length)) {
            var inner = document.createElement('div');
            inner.className = 'resume__inner';
            var bits = [];
            if (started) bits.push(started + ' module' + (started > 1 ? 's' : '') + ' commencé' + (started > 1 ? 's' : ''));
            if (tests) bits.push(tests + ' évaluation' + (tests > 1 ? 's' : '') + ' passée' + (tests > 1 ? 's' : ''));
            var txt = (last ? 'Dernier module ouvert : <b>' + last.name + '</b>' : 'Reprise de la progression') +
                      (bits.length ? ' · ' + bits.join(' · ') : '');
            inner.innerHTML =
                '<span class="resume__label">Reprendre</span>' +
                '<span class="resume__text">' + txt + '</span>' +
                (last ? '<a class="resume__go" href="modules/' + last.file + '">Rouvrir le module →</a>' : '') +
                '<a class="resume__go resume__srs" href="revision.html">' + (srsDue ? srsDue + ' carte' + (srsDue > 1 ? 's' : '') + ' à réviser →' : 'Révision du jour →') + '</a>' +
                '<span class="resume__tools">' +
                    '<button type="button" class="resume__export">exporter ma progression</button>' +
                    '<label class="resume__import">importer<input type="file" accept="application/json,.json" hidden></label>' +
                    '<button type="button" class="resume__reset">effacer ma progression</button>' +
                '</span>';
            host.appendChild(inner);

            /* Export / import : un fichier JSON qui contient toutes les clés cai.*,
               pour passer d'un poste à l'autre. Rien ne quitte le navigateur
               sans action de l'utilisateur. */
            inner.querySelector('.resume__export').addEventListener('click', function () {
                var data = { format: 'cai-progression', version: 1, exporte: new Date().toISOString(), cles: {} };
                try {
                    for (var i = 0; i < window.localStorage.length; i++) {
                        var k = window.localStorage.key(i);
                        if (k && k.indexOf('cai.') === 0) data.cles[k] = window.localStorage.getItem(k);
                    }
                } catch (e) { /* ignoré */ }
                var blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'progression-centre-it-' + new Date().toISOString().slice(0, 10) + '.json';
                document.body.appendChild(a); a.click(); a.remove();
                setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
            });
            inner.querySelector('.resume__import input').addEventListener('change', function () {
                var f = this.files && this.files[0];
                if (!f) return;
                var reader = new FileReader();
                reader.onload = function () {
                    var data;
                    try { data = JSON.parse(reader.result); } catch (e) { data = null; }
                    if (!data || data.format !== 'cai-progression' || !data.cles) { window.alert('Ce fichier n\'est pas un export de progression du centre.'); return; }
                    if (!window.confirm('Remplacer la progression de ce navigateur par celle du fichier (' + Object.keys(data.cles).length + ' éléments) ?')) return;
                    try {
                        Object.keys(data.cles).forEach(function (k) { if (k.indexOf('cai.') === 0) window.localStorage.setItem(k, data.cles[k]); });
                    } catch (e) { /* ignoré */ }
                    location.reload();
                };
                reader.readAsText(f);
            });
            inner.querySelector('.resume__reset').addEventListener('click', function () {
                if (!window.confirm('Effacer la progression et les résultats de tests enregistrés dans ce navigateur ?')) return;
                try {
                    window.localStorage.removeItem(KEY_PROGRESS);
                    window.localStorage.removeItem(KEY_LAST);
                    window.localStorage.removeItem(KEY_SCORES);
                } catch (e) { /* ignoré */ }
                location.reload();
            });
        }
    }

    /* ══════════════════════════════════════════════════════════════
       8. LIENS ENTRE MODULES — tout vient de assets/catalogue.js
       Fil d'Ariane, barre de navigation du site, précédent / suivant,
       prérequis et suites, supports du cours ; côté portail, carte
       interactive, suggestion du prochain module et boîte à outils.
       Sans catalogue (fichier absent), rien de tout cela ne s'affiche
       et la page reste celle écrite en HTML.
       ══════════════════════════════════════════════════════════════ */
    var CAT = window.CATALOGUE;
    if (!CAT || !CAT.modules || !CAT.parcours) return;

    var scoresAll = read(KEY_SCORES, {}) || {};

    /* Où sommes-nous ? Le lien vers app.js le dit : '../assets/app.js'
       dans un module, 'assets/app.js' au portail et aux examens. */
    var me = document.querySelector('script[src*="assets/app.js"]');
    var SITE = me ? me.getAttribute('src').replace(/assets\/app\.js.*$/, '') : '';
    var MODS = SITE + 'modules/';
    var REPO = SITE + '../';          // racine du dépôt cours, où vivent les supports

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function repoHref(path) { return REPO + encodeURI(path); }

    var ORDER = [];                   // modules disponibles, dans l'ordre des parcours
    var PARCOURS_OF = {};
    CAT.parcours.forEach(function (p) {
        p.modules.forEach(function (id, i) {
            if (!CAT.modules[id]) return;
            ORDER.push(id);
            PARCOURS_OF[id] = { p: p, pos: i + 1, total: p.modules.length };
        });
        (p.soon || []).forEach(function (id) { PARCOURS_OF[id] = { p: p, soon: true }; });
    });

    function mod(id) { return CAT.modules[id]; }
    function available(id) { return !!(mod(id) && !mod(id).soon); }

    function state(id) {
        var m = mod(id) || {};
        var done = doneList(id + '.html').length;
        var total = m.chapters || 0;
        var rec = scoresAll['test:' + id] || null;
        return {
            pct: total ? Math.min(100, Math.round((done / total) * 100)) : 0,
            test: rec,
            passed: !!(rec && rec.passed)
        };
    }
    function stateText(id) {
        if (!available(id)) return 'à venir';
        var st = state(id);
        if (st.passed) return 'test validé · ' + st.test.best + ' %';
        if (st.test) return 'test ' + st.test.best + ' % · ' + st.pct + ' % acquis';
        return st.pct ? st.pct + ' % acquis' : 'pas commencé';
    }
    function stateClass(id) {
        if (!available(id)) return 'is-soon';
        var st = state(id);
        return st.passed ? 'is-passed' : (st.pct || st.test ? 'is-started' : '');
    }

    /* Ceux qui s'appuient sur un module : calculés, jamais saisis. */
    function dependents(id) {
        return Object.keys(CAT.modules).filter(function (k) {
            var m = CAT.modules[k];
            return (m.prereq || []).indexOf(id) !== -1 || (m.utile || []).indexOf(id) !== -1;
        });
    }

    /* Le prochain module conseillé : le premier non validé dans l'ordre
       des parcours, en remontant à ses prérequis s'ils ne le sont pas. */
    function suggestion() {
        function firstOpen(id, seen) {
            if (seen[id]) return id;
            seen[id] = true;
            var pre = (mod(id).prereq || []).filter(function (k) { return available(k) && !state(k).passed; });
            return pre.length ? firstOpen(pre[0], seen) : id;
        }
        for (var i = 0; i < ORDER.length; i++) {
            if (!state(ORDER[i]).passed) return firstOpen(ORDER[i], {});
        }
        return null;
    }

    /* La suite logique du site : chaque parcours, puis son examen. */
    function sequence() {
        var seq = [];
        CAT.parcours.forEach(function (p) {
            p.modules.forEach(function (id) { if (available(id)) seq.push({ id: id, p: p }); });
            if (p.exam) seq.push({ exam: p.exam, p: p });
        });
        return seq;
    }

    var ICONS = {
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
        moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
        sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    };

    /* ── Thème clair / sombre ──
       Par défaut, celui du système. Un clic fixe l'autre et le mémorise
       (cai.theme) ; un script en tête de chaque page l'applique avant
       l'affichage, pour éviter un flash de la mauvaise couleur. */
    function themeButton(btn) {
        var root = document.documentElement;
        var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        function current() { return root.dataset.theme || (media && media.matches ? 'dark' : 'light'); }
        function paint() {
            var dark = current() === 'dark';
            btn.innerHTML = dark ? ICONS.sun : ICONS.moon;
            btn.setAttribute('aria-label', dark ? 'Passer au thème clair' : 'Passer au thème sombre');
            btn.title = btn.getAttribute('aria-label');
        }
        btn.addEventListener('click', function () {
            var next = current() === 'dark' ? 'light' : 'dark';
            root.dataset.theme = next;
            try { window.localStorage.setItem('cai.theme', next); } catch (e) { /* ignoré */ }
            paint();
        });
        if (media && media.addEventListener) media.addEventListener('change', paint);
        paint();
    }

    /* ── Palette de recherche (Ctrl+K ou « / ») ──
       Pages, modules du catalogue et chapitres de l'index de recherche,
       chargé à la première ouverture s'il n'est pas déjà dans la page. */
    var palette = (function () {
        var el, input, list, items = [], active = 0, lastFocus = null, indexState = 'none';
        function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

        function pages() {
            var p = [
                ['index.html', 'Portail', 'Parcours, carte des modules, reprise', '⌂'],
                ['index.html#carte', 'Carte des modules', 'Prérequis et suites de chaque module', '◇'],
                ['atelier.html', 'Atelier', 'Outils interactifs : chmod, crontab, calculateur IP…', '⚙'],
                ['glossaire.html', 'Glossaire', 'Tous les termes, avec les chapitres qui les expliquent', 'A–Z'],
                ['labo.html', 'Lab Orion', 'Plan d’adressage et ordre de construction', 'LAB'],
                ['revision.html', 'Révision du jour', 'Cartes à revoir aujourd’hui', 'REV'],
                ['examens.html', 'Examens', 'Examens de parcours et examen final', 'EX']
            ];
            return p.map(function (x) { return { href: SITE + x[0], title: x[1], sub: x[2], icon: x[3], group: 'Pages', hay: norm(x[1] + ' ' + x[2]) }; });
        }
        function modules() {
            return ORDER.map(function (id) {
                var m = mod(id), w = PARCOURS_OF[id];
                return {
                    href: MODS + id + '.html', title: m.title, icon: m.icon || '·', group: 'Modules',
                    sub: (w ? 'Parcours ' + w.p.num + ' · ' + w.p.title + ' · ' : '') + stateText(id),
                    hay: norm(m.title + ' ' + (m.short || '') + ' ' + id)
                };
            });
        }
        function glossary() {
            return ((window.GLOSSAIRE && window.GLOSSAIRE.termes) || []).map(function (e) {
                return {
                    href: SITE + 'glossaire.html#t-' + e.id, title: e.t + (e.x ? ' — ' + e.x : ''), icon: 'Aa', group: 'Glossaire',
                    sub: e.d, hay: norm(e.t + ' ' + e.x), body: norm(e.d)
                };
            });
        }
        function chapters() {
            return (window.SEARCH_INDEX || []).map(function (e) {
                return {
                    href: MODS + e.file + '#' + e.anchor, title: e.title, icon: '§', group: 'Chapitres',
                    sub: e.module.replace(/ — Module$/, ''), hay: norm(e.title), body: norm(e.module + ' ' + e.snippet)
                };
            });
        }
        function loadIndex() {
            if (indexState !== 'none') return;
            indexState = 'loading';
            var todo = [];
            if (!window.SEARCH_INDEX) todo.push('assets/search-index.js');
            if (!window.GLOSSAIRE) todo.push('assets/glossaire.js');
            var left = todo.length;
            if (!left) { indexState = 'done'; return; }
            todo.forEach(function (src) {
                var sc = document.createElement('script');
                sc.src = SITE + src;
                sc.onload = sc.onerror = function () { if (--left === 0) { indexState = 'done'; if (el && !el.hidden) render(); } };
                document.head.appendChild(sc);
            });
        }

        function search(q) {
            var all = pages().concat(modules());
            if (!q) return all;
            var words = norm(q).split(/\s+/).filter(Boolean);
            function score(it) {
                var s = 0;
                for (var i = 0; i < words.length; i++) {
                    var w = words[i];
                    if (it.hay.indexOf(w) === 0) s += 6;
                    else if (it.hay.indexOf(' ' + w) > -1) s += 4;
                    else if (it.hay.indexOf(w) > -1) s += 3;
                    else if (it.body && it.body.indexOf(w) > -1) s += 1;
                    else return 0;
                }
                return s;
            }
            var found = all.concat(glossary(), chapters()).map(function (it) { return { it: it, s: score(it) }; })
                .filter(function (x) { return x.s > 0; })
                .sort(function (a, b) { return b.s - a.s; });
            var out = [], perGroup = { Pages: 0, Modules: 0, Glossaire: 0, Chapitres: 0 };
            found.forEach(function (x) {
                var cap = x.it.group === 'Chapitres' ? 12 : x.it.group === 'Glossaire' ? 5 : 8;
                if (perGroup[x.it.group]++ < cap) out.push(x.it);
            });
            var order = { Pages: 0, Modules: 1, Glossaire: 2, Chapitres: 3 };
            return out.sort(function (a, b) { return order[a.group] - order[b.group]; });
        }

        function render() {
            var q = input.value.trim();
            items = search(q);
            active = Math.min(active, Math.max(items.length - 1, 0));
            if (!items.length) {
                list.innerHTML = '<p class="palette__empty">' + (indexState === 'loading' ? 'Chargement de l’index…' : 'Rien ne correspond à « ' + esc(q) + ' ».') + '</p>';
                return;
            }
            var html = '', group = '';
            items.forEach(function (it, i) {
                if (it.group !== group) { group = it.group; html += '<p class="palette__group">' + group + '</p>'; }
                html += '<a class="palette__item' + (i === active ? ' is-active' : '') + '" href="' + it.href + '" data-i="' + i + '" role="option"' + (i === active ? ' aria-selected="true"' : '') + '>' +
                    '<span class="palette__icon">' + esc(it.icon) + '</span>' +
                    '<span class="palette__title">' + esc(it.title) + '</span>' +
                    '<span class="palette__sub">' + esc(it.sub) + '</span></a>';
            });
            list.innerHTML = html;
        }
        function move(d) {
            if (!items.length) return;
            active = (active + d + items.length) % items.length;
            var nodes = list.querySelectorAll('.palette__item');
            nodes.forEach(function (n, i) {
                n.classList.toggle('is-active', i === active);
                if (i === active) { n.setAttribute('aria-selected', 'true'); n.scrollIntoView({ block: 'nearest' }); }
                else n.removeAttribute('aria-selected');
            });
        }
        function build() {
            el = document.createElement('div');
            el.className = 'palette';
            el.hidden = true;
            el.innerHTML = '<div class="palette__box" role="dialog" aria-modal="true" aria-label="Rechercher dans le centre">' +
                '<input class="palette__input" type="text" placeholder="Un module, un chapitre, une notion…" aria-label="Rechercher" autocomplete="off" spellcheck="false">' +
                '<div class="palette__list" role="listbox"></div>' +
                '<div class="palette__foot"><span><kbd>↑</kbd> <kbd>↓</kbd> naviguer</span><span><kbd>Entrée</kbd> ouvrir</span><span><kbd>Échap</kbd> fermer</span></div></div>';
            document.body.appendChild(el);
            input = el.querySelector('.palette__input');
            list = el.querySelector('.palette__list');
            input.addEventListener('input', function () { active = 0; render(); });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
                else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (items[active]) { close(); location.href = items[active].href; }
                }
            });
            list.addEventListener('mousemove', function (e) {
                var a = e.target.closest('.palette__item');
                if (a && +a.dataset.i !== active) { move(+a.dataset.i - active); }
            });
            list.addEventListener('click', function () { close(); });
            el.addEventListener('mousedown', function (e) { if (e.target === el) close(); });
        }
        function open() {
            if (!el) build();
            loadIndex();
            lastFocus = document.activeElement;
            el.hidden = false;
            document.documentElement.style.overflow = 'hidden';
            input.value = '';
            active = 0;
            render();
            input.focus();
        }
        function close() {
            if (!el || el.hidden) return;
            el.hidden = true;
            document.documentElement.style.overflow = '';
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
        document.addEventListener('keydown', function (e) {
            var k = e.key && e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); if (el && !el.hidden) close(); else open(); return; }
            if (e.key === 'Escape' && el && !el.hidden) { e.preventDefault(); close(); return; }
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                var t = e.target, tag = t && t.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
                e.preventDefault(); open();
            }
        });
        return { open: open, close: close };
    })();

    /* ── Barre de navigation du site, sur toutes les pages ── */
    (function siteNav() {
        var here = pageFile;
        var nav = document.createElement('nav');
        nav.className = 'sitenav';
        nav.setAttribute('aria-label', 'Navigation du site');
        var links = [
            ['index.html#parcours', 'Parcours'],
            ['feuille-de-route.html', 'Débutant → pro'],
            ['atelier.html', 'Atelier'],
            ['glossaire.html', 'Glossaire'],
            ['labo.html', 'Lab Orion'],
            ['revision.html', 'Révision'],
            ['examens.html', 'Examens'],
            ['index.html#outils', 'Supports']
        ].filter(function (l) {
            // Version publiée : ni supports ni outils (ils vivent dans le dépôt privé).
            return !(CAT.public && l[0] === 'index.html#outils');
        });
        nav.innerHTML = '<div class="sitenav__inner">' +
            '<a class="sitenav__home" href="' + SITE + 'index.html">Centre d’apprentissage IT</a>' +
            '<span class="sitenav__links">' + links.map(function (l) {
                var cur = (l[0].indexOf('#') < 0 && l[0] === here);
                return '<a href="' + SITE + l[0] + '"' + (cur ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
            }).join('') + '</span>' +
            '<span class="sitenav__tools">' +
                '<button type="button" class="sitenav__btn sitenav__find" aria-label="Rechercher (Ctrl+K)">' + ICONS.search +
                    '<span class="sitenav__btn-label">Rechercher</span><kbd>Ctrl K</kbd></button>' +
                '<button type="button" class="sitenav__btn sitenav__theme" aria-label="Changer de thème">' + ICONS.moon + '</button>' +
            '</span></div>';
        var progressEl = document.querySelector('.progress');
        document.body.insertBefore(nav, progressEl ? progressEl.nextSibling : document.body.firstChild);
        nav.querySelector('.sitenav__find').addEventListener('click', function () { palette.open(); });
        themeButton(nav.querySelector('.sitenav__theme'));
    })();

    /* ══ PAGE DE MODULE ══ */
    var curId = pageFile.replace(/\.html$/, '');
    if (chapters.length && available(curId) && PARCOURS_OF[curId]) {
        var cur = mod(curId);
        var where = PARCOURS_OF[curId];

        /* Fil d'Ariane recalculé : la position suit le catalogue. */
        var eyebrow = document.querySelector('.hero .eyebrow');
        if (eyebrow) {
            eyebrow.innerHTML = '<a href="' + SITE + 'index.html">← Portail</a> · ' +
                '<a href="' + SITE + 'index.html#parcours-' + where.p.id + '">Parcours ' + where.p.num + ' · ' + esc(where.p.title) + '</a> · ' +
                where.pos + ' / ' + where.total;
        }

        /* Le parcours dans le sommaire, module courant en évidence. */
        var tocEl = document.querySelector('.toc');
        if (tocEl) {
            var box = document.createElement('div');
            box.className = 'toc__path';
            box.innerHTML = '<p class="toc__path-label">Parcours ' + where.p.num + ' · ' + esc(where.p.title) + '</p><ol>' +
                where.p.modules.map(function (id) {
                    if (!available(id)) return '';
                    var cls = stateClass(id) + (id === curId ? ' is-current' : '');
                    return '<li class="' + cls + '">' + (id === curId
                        ? '<span aria-current="page">' + esc(mod(id).short) + '</span>'
                        : '<a href="' + MODS + id + '.html">' + esc(mod(id).short) + '</a>') + '</li>';
                }).join('') +
                (where.p.exam ? '<li class="toc__path-exam"><a href="' + SITE + 'examens.html#' + where.p.exam + '">Examen du parcours</a></li>' : '') +
                '</ol>';
            tocEl.appendChild(box);
        }

        /* Bloc « Continuer » en bas de page. */
        var main = document.querySelector('main.content');
        if (main) {
            var seq = sequence();
            var idx = -1;
            seq.forEach(function (s, i) { if (s.id === curId) idx = i; });
            var prev = idx > 0 ? seq[idx - 1] : null;
            var next = idx > -1 && idx < seq.length - 1 ? seq[idx + 1] : null;

            var stepCard = function (s, dir) {
                if (!s) return '<span class="pnav__item pnav__item--empty"></span>';
                var href, title, meta;
                if (s.exam) {
                    href = SITE + 'examens.html#' + s.exam;
                    title = 'Examen du parcours ' + s.p.num;
                    meta = esc(s.p.title);
                } else {
                    href = MODS + s.id + '.html';
                    title = esc(mod(s.id).title);
                    meta = 'Parcours ' + s.p.num + ' · ' + stateText(s.id);
                }
                return '<a class="pnav__item pnav__item--' + dir + '" href="' + href + '">' +
                    '<span class="pnav__dir">' + (dir === 'prev' ? '← Précédent' : 'Suivant →') + '</span>' +
                    '<span class="pnav__title">' + title + '</span>' +
                    '<span class="pnav__meta">' + meta + '</span></a>';
            };

            var item = function (id, note) {
                if (!mod(id)) return '';
                var label = esc(mod(id).title) + (note ? ' <em>(' + note + ')</em>' : '');
                var link = available(id) ? '<a href="' + MODS + id + '.html">' + label + '</a>' : '<span>' + label + '</span>';
                return '<li class="' + stateClass(id) + '">' + link + '<span class="rel__state">' + stateText(id) + '</span></li>';
            };
            var group = function (label, items) {
                if (!items.length) return '';
                return '<div class="rel__group"><p class="rel__label">' + label + '</p><ul class="rel__list">' + items.join('') + '</ul></div>';
            };

            var before = (cur.prereq || []).map(function (id) { return item(id); })
                .concat((cur.utile || []).map(function (id) { return item(id, 'conseillé'); }));
            var after = dependents(curId).map(function (id) { return item(id); });
            var seeAlso = (cur.related || []).filter(function (id) {
                return (cur.prereq || []).indexOf(id) === -1 && (cur.utile || []).indexOf(id) === -1 && dependents(curId).indexOf(id) === -1;
            }).map(function (id) { return item(id); });

            var KIND = { guide: 'Guide', outil: 'Outil', notes: 'Notes', exercices: 'Exercices', scripts: 'Scripts', ressources: 'Supports' };
            var sups = (cur.supports || []).map(function (s) {
                return '<li><a href="' + repoHref(s.path) + '"><span class="sup__kind">' + (KIND[s.kind] || 'Lien') + '</span>' + esc(s.label) + '</a></li>';
            });

            var sec = document.createElement('section');
            sec.className = 'next';
            sec.setAttribute('aria-label', 'Continuer');
            sec.innerHTML =
                '<p class="next__label">Continuer</p>' +
                '<div class="pnav">' + stepCard(prev, 'prev') + stepCard(next, 'next') + '</div>' +
                '<div class="rel">' +
                    group('À connaître avant', before) +
                    group('S’appuient sur ce module', after) +
                    group('Voir aussi', seeAlso) +
                '</div>' +
                (sups.length ?
                    '<div class="sup"><p class="rel__label">Supports du cours' + (cur.cours ? ' · <code>' + esc(cur.cours) + '/</code>' : '') + '</p>' +
                    '<ul class="sup__list">' + sups.join('') + '</ul>' +
                    '<p class="note">Notes, exercices et guides d’origine, rangés à côté du site dans le dépôt cours.</p></div>' : '');
            main.appendChild(sec);
        }
    }

    /* ══ PORTAIL ══ */
    var mapHost = document.querySelector('[data-map]');
    if (mapHost) {
        var descOf = function (id) {
            return (CAT.modules[id] && CAT.modules[id].desc) || '';
        };
        var cols = CAT.parcours.map(function (p) {
            var ids = p.modules.concat(p.soon || []);
            return '<div class="map__col"><p class="map__col-title"><span>' + p.num + '</span> ' + esc(p.title) + '</p>' +
                ids.map(function (id) {
                    if (!mod(id)) return '';
                    var st = available(id) ? state(id) : null;
                    return '<button type="button" class="map__node ' + stateClass(id) + '" data-id="' + id + '" aria-pressed="false">' +
                        '<span class="map__icon">' + esc(mod(id).icon || '') + '</span>' +
                        '<span class="map__name">' + esc(mod(id).short) + '</span>' +
                        (st ? '<span class="map__bar"><i style="width:' + (st.passed ? 100 : st.pct) + '%"></i></span>' : '<span class="map__soon">à venir</span>') +
                        '</button>';
                }).join('') + '</div>';
        }).join('');
        mapHost.innerHTML =
            '<div class="map__legend"><span class="lg lg--before">à connaître avant</span><span class="lg lg--after">s’appuie dessus</span><span class="lg lg--related">voir aussi</span><span class="lg lg--passed">test validé</span></div>' +
            '<div class="map__board">' + cols + '</div>' +
            '<div class="map__detail" aria-live="polite"></div>';

        var nodes = Array.prototype.slice.call(mapHost.querySelectorAll('.map__node'));
        var detail = mapHost.querySelector('.map__detail');

        var select = function (id) {
            var m = mod(id);
            if (!m) return;
            var before = (m.prereq || []).concat(m.utile || []);
            var after = dependents(id);
            var rel = (m.related || []).concat(Object.keys(CAT.modules).filter(function (k) {
                return (CAT.modules[k].related || []).indexOf(id) !== -1;
            }));
            mapHost.classList.add('has-selection');
            nodes.forEach(function (n) {
                var k = n.getAttribute('data-id');
                n.classList.toggle('is-selected', k === id);
                n.setAttribute('aria-pressed', k === id ? 'true' : 'false');
                n.classList.toggle('is-before', before.indexOf(k) !== -1);
                n.classList.toggle('is-after', after.indexOf(k) !== -1);
                n.classList.toggle('is-related', k !== id && rel.indexOf(k) !== -1 && before.indexOf(k) === -1 && after.indexOf(k) === -1);
            });
            var w = PARCOURS_OF[id];
            var chips = function (ids) {
                var uniq = ids.filter(function (k, i) { return mod(k) && ids.indexOf(k) === i && k !== id; });
                return uniq.length ? uniq.map(function (k) {
                    return '<button type="button" class="map__chip ' + stateClass(k) + '" data-go="' + k + '">' + esc(mod(k).short) + '</button>';
                }).join('') : '<span class="map__none">aucun</span>';
            };
            detail.innerHTML =
                '<p class="map__where">Parcours ' + w.p.num + ' · ' + esc(w.p.title) + (w.soon ? ' · à venir' : ' · ' + w.pos + ' / ' + w.total) + '</p>' +
                '<p class="map__title">' + esc(m.title) + '</p>' +
                '<p class="map__desc">' + esc(descOf(id) || (m.soon ? 'Module en préparation : le cours est commencé, sa synthèse viendra ensuite.' : '')) + '</p>' +
                '<p class="map__state">' + (m.soon ? 'Pas encore de page de module' : esc(stateText(id)) + (m.duree ? ' · ≈ ' + esc(m.duree) : '') + (m.chapters ? ' · ' + m.chapters + ' chapitres' : '')) + '</p>' +
                '<dl class="map__links">' +
                    '<dt>À connaître avant</dt><dd>' + chips(before) + '</dd>' +
                    '<dt>S’appuient dessus</dt><dd>' + chips(after) + '</dd>' +
                    '<dt>Voir aussi</dt><dd>' + chips(rel) + '</dd>' +
                '</dl>' +
                '<p class="map__actions">' +
                    (available(id) ? '<a class="map__open" href="' + MODS + id + '.html">Ouvrir le module →</a>' : '') +
                    (m.cours ? '<a class="map__folder" href="' + repoHref(m.cours + '/') + '">Dossier du cours <code>' + esc(m.cours) + '/</code></a>' : '') +
                '</p>';
        };

        mapHost.addEventListener('click', function (e) {
            var t = e.target.closest ? e.target.closest('[data-id], [data-go]') : null;
            if (!t) return;
            var id = t.getAttribute('data-id') || t.getAttribute('data-go');
            select(id);
            if (t.hasAttribute('data-go')) {
                var n = mapHost.querySelector('.map__node[data-id="' + id + '"]');
                if (n) n.focus();
            }
        });

        var lastRead = read(KEY_LAST, null);
        var start = (lastRead && mod(String(lastRead.file || '').replace(/\.html$/, ''))) ?
            String(lastRead.file).replace(/\.html$/, '') : (suggestion() || ORDER[0]);
        select(start);
    }

    /* Suggestion du prochain module dans le bandeau de reprise. */
    var resumeInner = document.querySelector('.resume__inner');
    if (resumeInner) {
        var sug = suggestion();
        if (sug) {
            var s = document.createElement('a');
            s.className = 'resume__go resume__go--next';
            s.href = MODS + sug + '.html';
            s.textContent = 'Suggestion : ' + mod(sug).short + ' →';
            // avant la révision et les outils (export, import, effacer)
            var anchor = resumeInner.querySelector('.resume__srs') || resumeInner.querySelector('.resume__tools');
            resumeInner.insertBefore(s, anchor);
        }
    }

    /* Boîte à outils et dossiers des cours. */
    var toolsHost = document.querySelector('[data-outils]');
    if (toolsHost && CAT.outils) {
        toolsHost.innerHTML = CAT.outils.map(function (o) {
            var m = mod(o.module);
            return '<a class="res" href="' + repoHref(o.path) + '">' +
                '<div class="res__top"><span class="res__badge res__badge--local">' + esc(m ? m.short : 'Cours') + '</span><span class="res__name">' + esc(o.title) + '</span></div>' +
                '<p class="res__desc">' + esc(o.desc) + '</p>' +
                '<span class="res__url">' + esc(o.path) + '</span></a>';
        }).join('');
    }
    var foldersHost = document.querySelector('[data-cours]');
    if (foldersHost) {
        var byCours = {};
        Object.keys(CAT.modules).forEach(function (id) {
            var c = CAT.modules[id].cours;
            if (!c) return;
            (byCours[c] = byCours[c] || []).push(id);
        });
        foldersHost.innerHTML = Object.keys(byCours).sort().map(function (c) {
            return '<li><a href="' + repoHref(c + '/') + '"><code>' + esc(c) + '/</code></a><span>' +
                byCours[c].map(function (id) {
                    return available(id) ? '<a href="' + MODS + id + '.html">' + esc(mod(id).short) + '</a>' : esc(mod(id).short) + ' (à venir)';
                }).join(' · ') + '</span></li>';
        }).join('');
    }

    /* ══════════════════════════════════════════════════════════════
       10. DE DÉBUTANT À PRO
       Les paliers du catalogue (CAT.paliers) relus avec la progression
       locale : tableau de bord ([data-dash], au portail et sur la
       feuille de route), fiche du module dans le héro de chaque module,
       et infobulles du glossaire sur les sigles des chapitres.
       ══════════════════════════════════════════════════════════════ */
    var PALIERS = CAT.paliers || [];
    var labsAll = read('cai.labs', {}) || {};
    var V = (me && (me.getAttribute('src').match(/\?v=[\w.]+/) || [''])[0]) || '';

    function palierState(p) {
        var ids = p.modules.filter(available);
        var passed = ids.filter(function (id) { return state(id).passed; }).length;
        var pct = ids.length ? Math.round(ids.reduce(function (sum, id) {
            var st = state(id); return sum + (st.passed ? 100 : st.pct);
        }, 0) / ids.length) : 0;
        var etapes = (p.mission && p.mission.etapes) || 0;
        var faites = Array.isArray(labsAll['mission-' + p.id]) ? labsAll['mission-' + p.id].length : 0;
        return {
            ids: ids, passed: passed, total: ids.length, pct: pct,
            mission: Math.min(faites, etapes), etapes: etapes,
            atteint: ids.length > 0 && passed === ids.length && etapes > 0 && faites >= etapes
        };
    }
    function palierOf(id) {
        for (var i = 0; i < PALIERS.length; i++) { if (PALIERS[i].modules.indexOf(id) !== -1) return PALIERS[i]; }
        return null;
    }
    function currentPalier() {
        for (var i = 0; i < PALIERS.length; i++) { if (!palierState(PALIERS[i]).atteint) return PALIERS[i]; }
        return PALIERS[PALIERS.length - 1] || null;
    }
    /* Un anneau de progression, en variables du thème (couleurs dans theme.css). */
    function ring(pct, cls) {
        var c = 2 * Math.PI * 26;
        return '<svg class="ring' + (cls ? ' ' + cls : '') + '" viewBox="0 0 64 64" aria-hidden="true">' +
            '<circle class="ring__track" cx="32" cy="32" r="26"/>' +
            '<circle class="ring__val" cx="32" cy="32" r="26" stroke-dasharray="' + c.toFixed(1) +
            '" stroke-dashoffset="' + (c * (1 - Math.max(0, Math.min(100, pct)) / 100)).toFixed(1) + '"/></svg>';
    }

    /* API pour les autres scripts de page (feuille de route). */
    window.CAI = window.CAI || {};
    window.CAI.state = state;
    window.CAI.stateText = stateText;
    window.CAI.stateClass = stateClass;
    window.CAI.available = available;
    window.CAI.suggestion = suggestion;
    window.CAI.palierState = palierState;
    window.CAI.currentPalier = currentPalier;
    window.CAI.ring = ring;
    window.CAI.esc = esc;
    window.CAI.site = SITE;

    /* ── L'escalier des paliers ([data-stairs], au portail et sur la feuille de route) ── */
    function heuresDe(ids) {
        var min = 0;
        ids.forEach(function (id) {
            var d = (mod(id) && mod(id).duree) || '';
            var h = d.match(/(\d+)\s*h/), m = d.match(/h\s*(\d+)/);
            min += (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
        });
        return Math.round(min / 60);
    }
    function paintStairs() {
        labsAll = read('cai.labs', {}) || {};
        var cur = currentPalier();
        var F = (pageFile === 'feuille-de-route.html') ? '' : SITE + 'feuille-de-route.html';
        document.querySelectorAll('[data-stairs]').forEach(function (host) {
            host.innerHTML = PALIERS.map(function (p) {
                var st = palierState(p);
                var cls = st.atteint ? 'is-done' : (cur && cur.id === p.id ? 'is-current' : '');
                return '<li class="stair ' + cls + '"><a href="' + F + '#palier-' + p.id + '">' +
                    '<span class="stair__num">Palier ' + p.num + (st.atteint ? ' · atteint' : (cls ? ' · tu es ici' : '')) + '</span>' +
                    '<span class="stair__title">' + esc(p.title) + '</span>' +
                    '<span class="stair__job">' + esc(p.poste) + '</span>' +
                    '<span class="stair__bar"><i style="width:' + st.pct + '%"></i></span>' +
                    '<span class="stair__meta">' + st.total + ' modules · ≈ ' + heuresDe(st.ids) + ' h</span></a></li>';
            }).join('');
        });
    }
    if (PALIERS.length) paintStairs();
    window.CAI.paintStairs = paintStairs;

    /* ── Avancement de chaque parcours, sur ses cartes du portail ── */
    CAT.parcours.forEach(function (p) {
        var card = document.getElementById('parcours-' + p.id);
        if (!card || !card.classList.contains('path')) return;
        var ids = p.modules.filter(available);
        var passed = ids.filter(function (id) { return state(id).passed; }).length;
        var pct = ids.length ? Math.round(ids.reduce(function (sum, id) { var st = state(id); return sum + (st.passed ? 100 : st.pct); }, 0) / ids.length) : 0;
        if (!pct && !passed) return;
        var box = document.createElement('div');
        box.className = 'path__progress';
        box.innerHTML = '<p>' + pct + ' % parcouru · ' + passed + ' / ' + ids.length + ' tests validés</p><span class="dash__bar"><i style="width:' + pct + '%"></i></span>';
        var desc = card.querySelector('.path__desc');
        card.insertBefore(box, desc ? desc.nextSibling : card.firstChild);
    });

    /* ── Tableau de bord ── */
    var dashHost = document.querySelector('[data-dash]');
    if (dashHost && PALIERS.length) {
        var paintDash = function () {
            labsAll = read('cai.labs', {}) || {};
            scoresAll = read(KEY_SCORES, {}) || {};
            progress = read(KEY_PROGRESS, {}) || {};
            var avail = ORDER.filter(available);
            var chTotal = 0, chDone = 0, passedN = 0;
            avail.forEach(function (id) {
                var n = mod(id).chapters || 0;
                chTotal += n;
                chDone += Math.min(n, doneList(id + '.html').length);
                if (state(id).passed) passedN++;
            });
            var srsMap = read('cai.srs', {}) || {};
            var due = Object.keys(srsMap).filter(function (k) { return srsMap[k] && srsMap[k].d <= Date.now(); }).length;
            var diag = read('cai.diag', null);
            var missions = PALIERS.filter(function (p) { return palierState(p).mission >= ((p.mission && p.mission.etapes) || 1); }).length;
            var fresh = !chDone && !Object.keys(scoresAll).length && !diag && !Object.keys(labsAll).length && !read(KEY_LAST, null);
            var F = SITE + 'feuille-de-route.html';

            if (fresh) {
                dashHost.className = 'dash dash--welcome';
                dashHost.innerHTML =
                    '<p class="dash__label">Tu débutes ?</p>' +
                    '<p class="dash__title">Trois façons de commencer</p>' +
                    '<ol class="dash__starts">' +
                        '<li><a href="' + F + '#diagnostic"><b>Faire le test de positionnement</b><span>Douze questions, cinq minutes : il dit par où commencer.</span></a></li>' +
                        '<li><a href="' + MODS + ORDER[0] + '.html"><b>Partir de zéro</b><span>' + esc(mod(ORDER[0]).title) + ', le premier module du parcours 01.</span></a></li>' +
                        '<li><a href="' + F + '#paliers"><b>Voir le chemin jusqu’au métier</b><span>Quatre paliers, de technicien·ne support à ingénieur·e.</span></a></li>' +
                    '</ol>' +
                    '<p class="dash__note">Ta progression reste dans ce navigateur, nulle part ailleurs.</p>';
                return;
            }
            var pal = currentPalier();
            var ps = pal ? palierState(pal) : null;
            var sug = suggestion();
            var pct = chTotal ? Math.round(chDone / chTotal * 100) : 0;
            dashHost.className = 'dash';
            dashHost.innerHTML =
                '<p class="dash__label">Ta progression</p>' +
                '<div class="dash__top">' + ring(pct, 'ring--lg') +
                    '<div><p class="dash__big">' + pct + '<small> %</small></p>' +
                    '<p class="dash__sub">' + chDone + ' / ' + chTotal + ' chapitres acquis</p></div></div>' +
                (pal ? '<a class="dash__palier" href="' + F + '#palier-' + pal.id + '">' +
                    '<span class="dash__palier-num">Palier ' + pal.num + (ps.atteint ? ' · atteint' : ' · en cours') + '</span>' +
                    '<span class="dash__palier-title">' + esc(pal.title) + '</span>' +
                    '<span class="dash__palier-job">' + esc(pal.poste) + '</span>' +
                    '<span class="dash__bar"><i style="width:' + ps.pct + '%"></i></span>' +
                    '<span class="dash__palier-meta">' + ps.passed + ' / ' + ps.total + ' tests validés · mission ' + ps.mission + ' / ' + ps.etapes + '</span></a>' : '') +
                (sug ? '<a class="btn btn--primary dash__go" href="' + MODS + sug + '.html">Continuer : ' + esc(mod(sug).short) + ' →</a>' : '') +
                '<dl class="dash__stats">' +
                    '<div><dt>Tests validés</dt><dd>' + passedN + ' / ' + avail.length + '</dd></div>' +
                    '<div><dt>À réviser</dt><dd><a href="' + SITE + 'revision.html">' + due + ' carte' + (due > 1 ? 's' : '') + '</a></dd></div>' +
                    '<div><dt>Missions</dt><dd>' + missions + ' / ' + PALIERS.length + '</dd></div>' +
                '</dl>';
        };
        paintDash();
        document.addEventListener('cai:progress', paintDash);
        window.addEventListener('storage', paintDash);
        window.CAI.paintDash = paintDash;
    }

    /* ── Fiche du module, dans le héro ── */
    if (chapters.length && available(curId)) {
        var heroInner = document.querySelector('.hero .hero__inner');
        var trackCh = chapters.filter(function (c) { return c.id && !c.classList.contains('chapter--quiz'); });
        if (heroInner && trackCh.length) {
            var card = document.createElement('div');
            card.className = 'modcard';
            card.setAttribute('role', 'region');
            card.setAttribute('aria-label', 'Ton avancement dans ce module');
            heroInner.classList.add('has-aside');
            heroInner.appendChild(card);
            var paintCard = function () {
                progress = read(KEY_PROGRESS, {}) || {};
                var done = doneList(pageFile);
                var n = trackCh.length;
                var k = trackCh.filter(function (c) { return done.indexOf(c.id) !== -1; }).length;
                var pct = Math.round(k / n * 100);
                var nextCh = null;
                for (var i = 0; i < trackCh.length; i++) { if (done.indexOf(trackCh[i].id) === -1) { nextCh = trackCh[i]; break; } }
                var h = nextCh && nextCh.querySelector('h2');
                var rec = (read(KEY_SCORES, {}) || {})['test:' + curId];
                var pal = palierOf(curId);
                var hasTest = !!document.querySelector('.test[data-test]');
                card.innerHTML =
                    '<div class="modcard__top">' + ring(pct) +
                        '<div><p class="modcard__pct">' + pct + '<small> %</small></p>' +
                        '<p class="modcard__sub">' + k + ' / ' + n + ' chapitres acquis</p></div></div>' +
                    '<p class="modcard__test">' + (rec ? (rec.passed ? '<span class="modcard__ok">Test validé</span> · meilleur score ' + rec.best + ' %' : 'Test : meilleur score ' + rec.best + ' %, pas encore validé') : 'Test pas encore passé') + '</p>' +
                    (nextCh ? '<a class="btn btn--primary modcard__go" href="#' + nextCh.id + '">' + (k ? 'Reprendre' : 'Commencer') + ' : ' + esc(h ? h.textContent.trim() : 'chapitre suivant') + '</a>'
                            : (hasTest ? '<a class="btn btn--primary modcard__go" href="#test">Tous les chapitres sont acquis : passer le test</a>' : '')) +
                    (nextCh && hasTest ? '<a class="modcard__link" href="#test">Aller directement au test →</a>' : '') +
                    (pal ? '<a class="modcard__palier" href="' + SITE + 'feuille-de-route.html#palier-' + pal.id + '"><b>Palier ' + pal.num + '</b> ' + esc(pal.title) + '<span>' + esc(pal.poste) + '</span></a>' : '');
            };
            paintCard();
            document.addEventListener('cai:progress', paintCard);
        }

        /* ── Infobulles du glossaire : la première occurrence de chaque sigle
           dans un chapitre s'explique au survol, au focus ou au toucher.
           Le glossaire (≈ 100 Ko) n'est chargé qu'une fois la page affichée. ── */
        var loadGloss = function () {
            if (window.GLOSSAIRE) { buildTips(); return; }
            var sc = document.createElement('script');
            sc.src = SITE + 'assets/glossaire.js' + V;
            sc.onload = buildTips;
            document.head.appendChild(sc);
        };
        var buildTips = function () {
            var G = window.GLOSSAIRE;
            if (!G || !G.termes) return;
            var byKey = {};
            var keys = [];
            G.termes.forEach(function (t) {
                var w = t.t;
                // seulement les sigles : au moins deux majuscules, pas d'espace
                if (!/^[A-Za-z0-9][A-Za-z0-9.+\-\/]{1,9}$/.test(w) || (w.match(/[A-Z]/g) || []).length < 2) return;
                if (byKey[w]) return;
                byKey[w] = t; keys.push(w);
            });
            if (!keys.length) return;
            keys.sort(function (a, b) { return b.length - a.length; });
            var re = new RegExp('(^|[^\\w./\\-])(' + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); }).join('|') + ')(?![\\w\\-\\/])', 'g');
            var SKIP = 'code, pre, kbd, a, button, label, summary, h1, h2, h3, h4, .terminal, .gloss, .gl, .cmdex, .scenario__opts, .scenario__opt, .lsline, .frame, .hero, .toc, script, style, svg';
            chapters.forEach(function (chap) {
                var seen = {}, count = 0;
                var walker = document.createTreeWalker(chap, NodeFilter.SHOW_TEXT, {
                    acceptNode: function (n) {
                        if (!n.nodeValue || !/[A-Z]{2}/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
                        var el = n.parentElement;
                        return el && !el.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                });
                var nodes = [];
                while (walker.nextNode()) nodes.push(walker.currentNode);
                nodes.forEach(function (node) {
                    if (count >= 10) return;
                    var text = node.nodeValue, m, last = 0, frag = null;
                    re.lastIndex = 0;
                    while ((m = re.exec(text)) && count < 10) {
                        var w = m[2];
                        if (seen[w]) continue;
                        seen[w] = true; count++;
                        if (!frag) frag = document.createDocumentFragment();
                        var start = m.index + m[1].length;
                        frag.appendChild(document.createTextNode(text.slice(last, start)));
                        var b = document.createElement('button');
                        b.type = 'button';
                        b.className = 'gt';
                        b.setAttribute('data-g', byKey[w].id);
                        b.textContent = w;
                        frag.appendChild(b);
                        last = start + w.length;
                    }
                    if (frag) {
                        frag.appendChild(document.createTextNode(text.slice(last)));
                        node.parentNode.replaceChild(frag, node);
                    }
                });
            });
            var byId = {};
            G.termes.forEach(function (t) { byId[t.id] = t; });
            var pop = document.createElement('div');
            pop.className = 'gt-pop';
            pop.id = 'gt-pop';
            pop.setAttribute('role', 'tooltip');
            pop.hidden = true;
            document.body.appendChild(pop);
            var cur = null, timer = null;
            var show = function (b) {
                var t = byId[b.getAttribute('data-g')];
                if (!t) return;
                clearTimeout(timer);
                if (cur && cur !== b) cur.removeAttribute('aria-describedby');
                cur = b;
                b.setAttribute('aria-describedby', 'gt-pop');
                pop.innerHTML = '<p class="gt-pop__term"><b>' + esc(t.t) + '</b>' + (t.x ? ' <span>' + esc(t.x) + '</span>' : '') + '</p>' +
                    '<p class="gt-pop__def">' + esc(t.d) + '</p>' +
                    '<a class="gt-pop__more" href="' + SITE + 'glossaire.html#t-' + encodeURIComponent(t.id) + '">Dans le glossaire →</a>';
                pop.hidden = false;
                var r = b.getBoundingClientRect();
                var W = document.documentElement.clientWidth;
                var pw = Math.min(320, W - 24);
                pop.style.width = pw + 'px';
                var left = Math.max(12, Math.min(r.left + window.pageXOffset, W - pw - 12 + window.pageXOffset));
                var top = r.bottom + window.pageYOffset + 8;
                if (r.bottom + pop.offsetHeight + 16 > window.innerHeight && r.top > pop.offsetHeight + 16) {
                    top = r.top + window.pageYOffset - pop.offsetHeight - 8;
                }
                pop.style.left = left + 'px';
                pop.style.top = top + 'px';
            };
            var hide = function (now) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    pop.hidden = true;
                    if (cur) { cur.removeAttribute('aria-describedby'); cur = null; }
                }, now ? 0 : 180);
            };
            document.addEventListener('mouseover', function (e) {
                var b = e.target.closest && e.target.closest('.gt');
                if (b) { show(b); return; }
                if (e.target.closest && e.target.closest('.gt-pop')) { clearTimeout(timer); return; }
                if (!pop.hidden) hide();
            });
            document.addEventListener('focusin', function (e) {
                var b = e.target.closest && e.target.closest('.gt');
                if (b) show(b); else if (!(e.target.closest && e.target.closest('.gt-pop'))) hide(true);
            });
            document.addEventListener('click', function (e) {
                var b = e.target.closest && e.target.closest('.gt');
                if (b) { if (cur === b && !pop.hidden) hide(true); else show(b); return; }
                if (!(e.target.closest && e.target.closest('.gt-pop'))) hide(true);
            });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) { hide(true); } });
            window.addEventListener('resize', function () { hide(true); });
        };
        if ('requestIdleCallback' in window) { window.requestIdleCallback(loadGloss, { timeout: 2500 }); }
        else { setTimeout(loadGloss, 1200); }
    }
})();
