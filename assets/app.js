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

    /* ── Barre de navigation du site, sur toutes les pages ── */
    (function siteNav() {
        var here = pageFile;
        var nav = document.createElement('nav');
        nav.className = 'sitenav';
        nav.setAttribute('aria-label', 'Navigation du site');
        var links = [
            ['index.html#parcours', 'Parcours'],
            ['index.html#carte', 'Carte des modules'],
            ['index.html#outils', 'Outils & supports'],
            ['examens.html', 'Examens']
        ].filter(function (l) {
            // Version publiée : ni supports ni outils (ils vivent dans le dépôt privé).
            return !(CAT.public && l[0] === 'index.html#outils');
        });
        nav.innerHTML = '<div class="sitenav__inner">' +
            '<a class="sitenav__home" href="' + SITE + 'index.html">Centre d’apprentissage IT</a>' +
            '<span class="sitenav__links">' + links.map(function (l) {
                var cur = (l[0] === 'examens.html' && here === 'examens.html');
                return '<a href="' + SITE + l[0] + '"' + (cur ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
            }).join('') + '</span></div>';
        var progressEl = document.querySelector('.progress');
        document.body.insertBefore(nav, progressEl ? progressEl.nextSibling : document.body.firstChild);
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
            var d = document.querySelector('.mod[data-file="' + id + '.html"] .mod__desc');
            return d ? d.textContent.trim() : '';
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
            var reset = resumeInner.querySelector('.resume__reset');
            resumeInner.insertBefore(s, reset);
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
})();
