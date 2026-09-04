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
    var cards = Array.prototype.slice.call(document.querySelectorAll('.mod[data-file]'));
    if (cards.length && !chapters.length) {
        var started = 0;
        var scores = read(KEY_SCORES, {}) || {};

        cards.forEach(function (card) {
            var file = card.getAttribute('data-file');
            var total = parseInt(card.getAttribute('data-chapters'), 10) || 0;
            var done = doneList(file).length;
            var meta = card.querySelector('.mod__meta');

            /* Score du test de fin de module. La clé du fonds de
               questions est le nom de fichier sans son extension. */
            var rec = scores['test:' + file.replace(/\.html$/, '')];
            if (rec && meta) {
                var badge = document.createElement('span');
                badge.innerHTML = 'Test <b>' + rec.best + ' %</b>';
                badge.title = rec.passed ? 'Test validé' : 'Test non validé';
                meta.appendChild(badge);
            }

            if (!total || !done) return;
            started++;
            var pct = Math.min(100, Math.round((done / total) * 100));
            var wrap = document.createElement('div');
            wrap.className = 'mod__prog is-on';
            wrap.title = done + ' / ' + total + ' chapitres acquis';
            wrap.innerHTML = '<i style="width:' + pct + '%"></i>';
            card.appendChild(wrap);
            if (meta) {
                var span = document.createElement('span');
                span.innerHTML = '<b>' + pct + ' %</b> acquis';
                meta.appendChild(span);
            }
        });

        var last = read(KEY_LAST, null);
        var tests = Object.keys(scores).length;
        var host = document.querySelector('.resume');
        if (host && (last || started || tests)) {
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
                '<button type="button" class="resume__reset">effacer ma progression</button>';
            host.appendChild(inner);
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
})();
