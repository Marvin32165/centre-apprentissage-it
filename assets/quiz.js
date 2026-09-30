/* ══════════════════════════════════════════════════════════════════
   MOTEUR D'ÉVALUATION
   Rend les tests de fin de module et les examens transversaux.

   Utilisation dans une page :
       <section class="test" id="test" data-test="subnetting"></section>
       <section class="test" data-exam="fondations"></section>

   Les questions viennent de assets/quiz-data.js :
       window.QUIZ_BANK  — un fonds de questions par module
       window.EXAM_BANK  — les examens, qui puisent dans plusieurs fonds

   Aucune dépendance. Si le stockage local est indisponible, tout
   fonctionne encore : seul l'historique des scores est perdu.
   ══════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var KEY_SCORES = 'cai.scores';
    var LETTERS = 'ABCDEFGH';

    /* ── Stockage tolérant aux pannes ── */
    function readStore(key, fallback) {
        try {
            var raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }
    function writeStore(key, value) {
        try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignoré */ }
    }

    var scores = readStore(KEY_SCORES, {}) || {};

    function saveScore(id, pct, total, passed) {
        var prev = scores[id] || {};
        scores[id] = {
            last: pct,
            best: Math.max(pct, typeof prev.best === 'number' ? prev.best : 0),
            total: total,
            passed: passed || prev.passed === true,
            at: Date.now()
        };
        writeStore(KEY_SCORES, scores);
    }

    /* API publique — utilisée par app.js pour afficher les scores ailleurs */
    window.CAI = window.CAI || {};
    window.CAI.scores = function () { return readStore(KEY_SCORES, {}) || {}; };
    window.CAI.resetScores = function () {
        try { window.localStorage.removeItem(KEY_SCORES); } catch (e) { /* ignoré */ }
    };

    /* ── Utilitaires ── */
    function shuffle(list) {
        var a = list.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    function sample(list, n) {
        return shuffle(list).slice(0, Math.min(n, list.length));
    }
    function asArray(v) { return Array.isArray(v) ? v.slice() : [v]; }
    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    }

    /* ══ Constitution du questionnaire ══════════════════════════════
       Un test de module prend toutes ses questions, dans l'ordre.
       Un examen tire au sort dans les fonds des modules qu'il couvre,
       puis ajoute ses propres questions de synthèse — celles-ci sont
       toujours posées, c'est là que se joue le lien entre modules.
       ══════════════════════════════════════════════════════════════ */
    function buildQuestions(def, kind) {
        var bank = window.QUIZ_BANK || {};
        var pool = [];

        function tag(list, source) {
            return (list || []).map(function (q, i) {
                var copy = {};
                for (var k in q) { if (Object.prototype.hasOwnProperty.call(q, k)) copy[k] = q[k]; }
                copy._src = source;
                copy._uid = source + '#' + i;
                return copy;
            });
        }

        if (kind === 'exam') {
            var own = tag(def.questions, def.id);
            (def.parts || []).forEach(function (part) {
                if (bank[part]) pool = pool.concat(tag(bank[part].questions, part));
            });
            var want = Math.max(0, (def.draw || 20) - own.length);
            return shuffle(own.concat(sample(pool, want)));
        }
        return tag(def.questions, def.id);
    }

    /* ══ Rendu ══════════════════════════════════════════════════════ */
    function moduleLink(srcId, base) {
        var bank = window.QUIZ_BANK || {};
        var mod = bank[srcId];
        if (!mod || !mod.file) return '';
        return '<a href="' + base + mod.file + '">' + mod.name + '</a>';
    }

    function mount(host, def, kind) {
        var base = host.getAttribute('data-base') || '';   // '' en module, 'modules/' au portail
        var passMark = def.pass || 70;
        var state = { questions: [], marked: false };

        var head = el('div', 'test__head');
        head.appendChild(el('p', 'test__label', def.label || (kind === 'exam' ? 'Examen' : 'Test de fin de module')));
        head.appendChild(el('h2', 'test__title', def.title || 'Test'));
        if (def.intro) head.appendChild(el('p', 'test__intro', def.intro));

        var facts = el('div', 'test__facts');
        var form = el('form', 'test__form');
        form.setAttribute('novalidate', 'novalidate');

        var actions = el('div', 'test__actions');
        var submit = el('button', 'btn', 'Corriger le test');
        submit.type = 'submit';
        var retry = el('button', 'btn btn--ghost', 'Recommencer');
        retry.type = 'button';
        retry.hidden = true;
        var count = el('span', 'test__count', '');
        actions.appendChild(submit);
        actions.appendChild(retry);
        actions.appendChild(count);

        var result = el('div', 'test__result');
        result.hidden = true;
        var best = el('p', 'test__best', '');

        host.appendChild(head);
        host.appendChild(facts);
        host.appendChild(form);
        host.appendChild(actions);
        host.appendChild(result);
        host.appendChild(best);

        /* ── Compteur de réponses données ── */
        function answered() {
            var n = 0;
            state.questions.forEach(function (q, i) {
                if (form.querySelector('[name="q' + i + '"]:checked')) n++;
            });
            return n;
        }
        function refreshCount() {
            if (state.marked) return;
            var n = answered(), t = state.questions.length;
            count.textContent = n + ' / ' + t + ' question' + (t > 1 ? 's' : '') + ' répondue' + (n > 1 ? 's' : '');
            submit.disabled = n === 0;
        }

        /* ── Construction du formulaire ── */
        function render() {
            state.questions = buildQuestions(def, kind);
            state.marked = false;
            host.classList.remove('is-marked');
            form.innerHTML = '';
            result.hidden = true;
            result.className = 'test__result';
            retry.hidden = true;
            submit.hidden = false;
            submit.disabled = true;
            submit.textContent = 'Corriger le test';

            facts.innerHTML =
                '<span><b>' + state.questions.length + '</b> questions</span>' +
                '<span>Seuil de réussite <b>' + passMark + ' %</b></span>' +
                (kind === 'exam' && def.parts
                    ? '<span><b>' + def.parts.length + '</b> modules couverts</span>'
                    : '<span>Correction <b>commentée</b></span>');

            state.questions.forEach(function (q, i) {
                var answers = asArray(q.a);
                var multi = answers.length > 1;
                var opts = q.c.map(function (text, idx) {
                    return { text: text, ok: answers.indexOf(idx) !== -1 };
                });
                opts = shuffle(opts);
                q._opts = opts;

                var block = el('div', 'q');
                block.id = 'q' + i;

                var qhead = el('div', 'q__head');
                qhead.appendChild(el('span', 'q__num', String(i + 1).replace(/^(\d)$/, '0$1')));
                qhead.appendChild(el('p', 'q__text', q.q));
                block.appendChild(qhead);

                if (multi) block.appendChild(el('p', 'q__hint', 'Plusieurs réponses attendues'));

                var list = el('ul', 'q__opts');
                opts.forEach(function (opt, oi) {
                    var li = el('li');
                    var label = el('label', 'opt');
                    var input = document.createElement('input');
                    input.type = multi ? 'checkbox' : 'radio';
                    input.name = 'q' + i;
                    input.value = String(oi);
                    label.appendChild(input);
                    label.appendChild(el('span', 'opt__key', LETTERS.charAt(oi)));
                    label.appendChild(el('span', 'opt__txt', opt.text));
                    input.addEventListener('change', function () {
                        if (state.marked) return;
                        list.querySelectorAll('.opt').forEach(function (l) {
                            var box = l.querySelector('input');
                            l.classList.toggle('is-picked', box.checked);
                        });
                        refreshCount();
                    });
                    li.appendChild(label);
                    list.appendChild(li);
                });
                block.appendChild(list);
                form.appendChild(block);
            });

            refreshCount();
        }

        /* ── Correction ── */
        function mark() {
            var good = 0;
            state.questions.forEach(function (q, i) {
                var block = form.querySelector('#q' + i);
                var labels = block.querySelectorAll('.opt');
                var ok = true;

                q._opts.forEach(function (opt, oi) {
                    var label = labels[oi];
                    var input = label.querySelector('input');
                    label.classList.remove('is-picked');
                    input.disabled = true;
                    if (opt.ok) { label.classList.add('is-right'); }
                    if (input.checked && !opt.ok) { label.classList.add('is-wrong'); ok = false; }
                    if (!input.checked && opt.ok) { ok = false; }
                });

                if (ok) good++;
                block.classList.add(ok ? 'is-ok' : 'is-ko');

                var why = el('div', 'q__why');
                why.innerHTML = '<b>' + (ok ? 'Correct.' : 'À revoir.') + '</b> ' + (q.why || '');
                var ref = [];
                if (q.ref) ref.push(q.ref);
                if (kind === 'exam' && q._src && q._src !== def.id) {
                    var link = moduleLink(q._src, base);
                    if (link) ref.push('Module ' + link);
                }
                if (ref.length) why.appendChild(el('span', 'q__ref', ref.join(' · ')));
                block.appendChild(why);
            });

            var total = state.questions.length;
            var pct = total ? Math.round((good / total) * 100) : 0;
            var passed = pct >= passMark;

            state.marked = true;
            host.classList.add('is-marked');
            submit.hidden = true;
            retry.hidden = false;
            count.textContent = good + ' / ' + total + ' bonnes réponses';

            result.className = 'test__result ' + (passed ? 'is-pass' : 'is-fail');
            result.innerHTML =
                '<div class="result__score">' + pct + '<small> %</small></div>' +
                '<div class="result__body">' +
                    '<p class="result__verdict">' + (passed ? 'Test validé' : 'Pas encore acquis') + '</p>' +
                    '<p class="result__text">' + verdictText(pct, passed, good, total) + '</p>' +
                '</div>';
            result.hidden = false;

            saveScore((kind === 'exam' ? 'exam:' : 'test:') + def.id, pct, total, passed);
            showBest();
            renderBoards();
            /* prévient la page hôte — les cartes d'examens rappellent le
               meilleur score, il doit suivre sans rechargement. */
            document.dispatchEvent(new CustomEvent('cai:score', { detail: { id: def.id, kind: kind, pct: pct } }));
            result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        function verdictText(pct, passed, good, total) {
            if (passed && pct === 100) {
                return 'Sans faute — ' + good + ' sur ' + total + '. Le sujet est acquis, tu peux passer à la suite.';
            }
            if (passed) {
                return good + ' bonnes réponses sur ' + total + ' (seuil : ' + passMark + ' %). ' +
                       'Relis quand même les questions marquées « à revoir » : les explications renvoient au chapitre concerné.';
            }
            return good + ' bonnes réponses sur ' + total + ', il en fallait ' +
                   Math.ceil(total * passMark / 100) + '. Reprends les chapitres cités sous les questions ratées, puis recommence le test.';
        }

        function showBest() {
            var rec = (window.CAI.scores() || {})[(kind === 'exam' ? 'exam:' : 'test:') + def.id];
            best.textContent = rec ? 'Meilleur score enregistré dans ce navigateur : ' + rec.best + ' %' : '';
        }

        function requestMark() {
            if (state.marked) return;
            var n = answered(), t = state.questions.length;
            if (n < t && !window.confirm('Il reste ' + (t - n) + ' question(s) sans réponse. Corriger quand même ?')) return;
            mark();
        }

        /* le bouton vit dans .test__actions, hors du <form> : les deux
           chemins (clic, touche Entrée dans le formulaire) mènent ici. */
        form.addEventListener('submit', function (ev) { ev.preventDefault(); requestMark(); });
        submit.addEventListener('click', function (ev) { ev.preventDefault(); requestMark(); });
        retry.addEventListener('click', function () {
            render();
            host.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });

        render();
        showBest();
    }

    /* ══ Amorçage ══════════════════════════════════════════════════ */
    document.querySelectorAll('.test[data-test]').forEach(function (host) {
        var id = host.getAttribute('data-test');
        var def = (window.QUIZ_BANK || {})[id];
        if (!def) { host.innerHTML = '<p class="scoreboard__empty">Test indisponible : fonds de questions « ' + id + ' » introuvable.</p>'; return; }
        def.id = id;
        mount(host, def, 'test');
    });

    document.querySelectorAll('.test[data-exam]').forEach(function (host) {
        var id = host.getAttribute('data-exam');
        var def = (window.EXAM_BANK || {})[id];
        if (!def) { host.innerHTML = '<p class="scoreboard__empty">Examen indisponible : « ' + id + ' » introuvable.</p>'; return; }
        def.id = id;
        mount(host, def, 'exam');
    });

    /* Monte un examen à la demande, sans recharger la page — c'est ce
       qui permet à examens.html de passer d'un examen à l'autre par
       simple changement d'ancre. L'appelant vide l'hôte au préalable. */
    window.CAI.mountExam = function (host, id) {
        var def = (window.EXAM_BANK || {})[id];
        if (!host || !def) return false;
        def.id = id;
        mount(host, def, 'exam');
        return true;
    };

    /* ══ Tableau de bord des résultats (page examens & portail) ══
       Rendu au chargement, puis après chaque correction : sur la page
       des examens, on passe un examen et on consulte ses résultats
       sans jamais recharger. */
    function renderBoards() {
    document.querySelectorAll('[data-scoreboard]').forEach(function (host) {
        var base = host.getAttribute('data-base') || '';
        var all = window.CAI.scores();
        var rows = [];

        Object.keys(window.QUIZ_BANK || {}).forEach(function (id) {
            var b = window.QUIZ_BANK[id];
            rows.push({ kind: 'Module', name: b.name, href: base + b.file + '#test', rec: all['test:' + id] });
        });
        /* Le portail et la page d'examens vivent tous deux à la racine :
           le lien vers un examen ne prend donc jamais le préfixe des modules. */
        Object.keys(window.EXAM_BANK || {}).forEach(function (id) {
            var e = window.EXAM_BANK[id];
            rows.push({ kind: 'Examen', name: e.short || e.title, href: 'examens.html#' + id, rec: all['exam:' + id] });
        });

        var done = rows.filter(function (r) { return r.rec; });
        if (!done.length) {
            host.innerHTML = '<div class="scoreboard__empty">Aucun test passé pour l\'instant. Les résultats s\'affichent ici, enregistrés dans ce navigateur uniquement.</div>';
            return;
        }

        var html = '<div class="scoreboard__row scoreboard__row--head">' +
                   '<span>Évaluation</span><span>Meilleur</span><span>Progression</span></div>';
        done.forEach(function (r) {
            var pct = r.rec.best;
            html += '<div class="scoreboard__row">' +
                '<span class="scoreboard__name">' + r.kind + ' · <a href="' + r.href + '">' + r.name + '</a></span>' +
                '<span class="scoreboard__val ' + (r.rec.passed ? 'is-pass' : 'is-fail') + '">' + pct + ' %</span>' +
                '<span class="scoreboard__bar"><i style="width:' + pct + '%"></i></span>' +
                '</div>';
        });
        host.innerHTML = html;
    });
    }
    renderBoards();
})();
