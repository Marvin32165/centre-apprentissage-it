/* ══════════════════════════════════════════════════════════════════
   FEUILLE DE ROUTE — page feuille-de-route.html (« De débutant à pro »)

   - pour chaque palier, ses modules avec leur avancement
     ([data-palier-mods]) et son bilan ([data-palier-exam]) — tout vient de
     CATALOGUE.paliers ; l'escalier ([data-stairs]) est peint par app.js ;
   - le test de positionnement ([data-diag]) : douze questions prises
     dans les fonds des tests (QUIZ_BANK), trois par palier, puis le
     palier et le module par lesquels commencer. Résultat gardé sous
     cai.diag, dans ce navigateur seulement.

   Les missions sont des labs guidés (.lab[data-lab="mission-pN"]),
   cochés par pratique.js sous cai.labs. Dépend d'app.js (window.CAI).
   ══════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var CAT = window.CATALOGUE, CAI = window.CAI, BANK = window.QUIZ_BANK;
    if (!CAT || !CAT.paliers || !CAI || !CAI.palierState) return;
    var esc = CAI.esc;
    var KEY_DIAG = 'cai.diag';

    function read(key, fallback) {
        try { var raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
        catch (e) { return fallback; }
    }
    function write(key, value) {
        try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignoré */ }
    }
    function mod(id) { return CAT.modules[id]; }
    function firstOpen(p) {
        var st = CAI.palierState(p);
        for (var i = 0; i < st.ids.length; i++) { if (!CAI.state(st.ids[i]).passed) return st.ids[i]; }
        return null;
    }

    /* ── L'escalier, les modules et le bilan de chaque palier ── */
    function paint() {
        if (CAI.paintStairs) CAI.paintStairs();   // relit aussi cai.labs
        var cur = CAI.currentPalier();
        CAT.paliers.forEach(function (p) {
            var st = CAI.palierState(p);
            var art = document.querySelector('[data-palier="' + p.id + '"]');
            if (art) {
                art.classList.toggle('is-done', st.atteint);
                art.classList.toggle('is-current', !!(cur && cur.id === p.id && !st.atteint));
            }
            var host = document.querySelector('[data-palier-mods="' + p.id + '"]');
            if (host) {
                host.innerHTML = '<ol class="pmods">' + st.ids.map(function (id) {
                    var m = mod(id);
                    return '<li class="pmod ' + CAI.stateClass(id) + '"><a href="modules/' + id + '.html">' +
                        '<span class="pmod__icon">' + esc(m.icon || '') + '</span>' +
                        '<span class="pmod__name">' + esc(m.title) + '</span>' +
                        '<span class="pmod__meta">≈ ' + esc(m.duree || '') + ' · ' + esc(CAI.stateText(id)) + '</span></a></li>';
                }).join('') + '</ol>';
            }
            var ex = document.querySelector('[data-palier-exam="' + p.id + '"]');
            if (ex) {
                var next = firstOpen(p);
                ex.innerHTML = '<span class="palier__tally"><b>' + st.passed + ' / ' + st.total + '</b> tests validés</span>' +
                    '<span class="palier__tally"><b>' + st.mission + ' / ' + st.etapes + '</b> étapes de mission</span>' +
                    (st.atteint ? '<span class="palier__done">Palier atteint</span>'
                        : (next ? '<a class="palier__next" href="modules/' + next + '.html">Prochain module : ' + esc(mod(next).short) + ' →</a>' : ''));
            }
        });
        if (CAI.paintDash) CAI.paintDash();
    }
    paint();
    /* Une étape de mission cochée (pratique.js écrit cai.labs) : on repeint. */
    document.addEventListener('change', function (e) {
        if (e.target && e.target.closest && e.target.closest('.mission')) setTimeout(paint, 0);
    });

    /* ── Test de positionnement ── */
    var host = document.querySelector('[data-diag]');
    if (!host || !BANK) return;

    var PICK = [
        ['p1', 'reseau-bases', 1], ['p1', 'subnetting', 1], ['p1', 'linux-debian', 5],
        ['p2', 'windows-server', 1], ['p2', 'powershell', 5], ['p2', 'docker', 4],
        ['p3', 'storage-clustering', 1], ['p3', 'sql-server', 1], ['p3', 'cisco-securite', 6],
        ['p4', 'azure', 1], ['p4', 'securite', 0], ['p4', 'scrum', 4]
    ];
    var QS = PICK.map(function (x) {
        var b = BANK[x[1]], q = b && b.questions && b.questions[x[2]];
        if (!q || typeof q.a !== 'number') return null;
        return { pal: x[0], mod: x[1], q: q };
    }).filter(Boolean);
    var PAL = {};
    CAT.paliers.forEach(function (p) { PAL[p.id] = p; });

    function shuffle(list) {
        var a = list.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }

    var answers = [], idx = 0;

    function intro() {
        var prev = read(KEY_DIAG, null);
        host.innerHTML =
            '<div class="diag__intro">' +
                '<ul class="diag__facts"><li><b>' + QS.length + '</b> questions</li><li><b>≈ 5</b> minutes</li><li><b>' + CAT.paliers.length + '</b> paliers testés</li></ul>' +
                (prev ? '<p class="diag__prev">Dernier passage le ' + new Date(prev.at).toLocaleDateString('fr-FR') +
                        ' : départ conseillé au <a href="#palier-' + esc(prev.reco) + '">palier ' + esc(PAL[prev.reco] ? PAL[prev.reco].num : '') + '</a>.</p>' : '') +
                '<button type="button" class="btn btn--primary diag__start">' + (prev ? 'Refaire le test' : 'Commencer le test') + '</button>' +
            '</div>';
        host.querySelector('.diag__start').addEventListener('click', function () { answers = []; idx = 0; ask(); });
    }

    function ask() {
        var item = QS[idx];
        var p = PAL[item.pal];
        var opts = shuffle(item.q.c.map(function (c, i) { return { html: c, i: i }; }));
        host.innerHTML =
            '<div class="diag__q">' +
                '<p class="diag__where"><span>Question ' + (idx + 1) + ' / ' + QS.length + '</span><span>Palier ' + p.num + ' · ' + esc(mod(item.mod).short) + '</span></p>' +
                '<div class="diag__track"><i style="width:' + (idx / QS.length * 100) + '%"></i></div>' +
                '<p class="diag__text">' + item.q.q + '</p>' +
                '<div class="diag__opts">' + opts.map(function (o) {
                    return '<button type="button" class="diag__opt" data-i="' + o.i + '">' + o.html + '</button>';
                }).join('') +
                '<button type="button" class="diag__opt diag__opt--skip" data-i="-1">Je ne sais pas</button></div>' +
            '</div>';
        var first = host.querySelector('.diag__opt');
        if (first && idx > 0) first.focus({ preventScroll: true });
        host.querySelectorAll('.diag__opt').forEach(function (b) {
            b.addEventListener('click', function () {
                answers.push(+b.getAttribute('data-i'));
                idx++;
                if (idx < QS.length) { ask(); } else { result(); }
            });
        });
    }

    function result() {
        var score = {}, total = {};
        QS.forEach(function (item, i) {
            total[item.pal] = (total[item.pal] || 0) + 1;
            score[item.pal] = (score[item.pal] || 0) + (answers[i] === item.q.a ? 1 : 0);
        });
        var reco = null;
        CAT.paliers.forEach(function (p) {
            if (!reco && (score[p.id] || 0) < (total[p.id] || 0)) reco = p.id;
        });
        var allGood = !reco;
        if (!reco) reco = CAT.paliers[CAT.paliers.length - 1].id;
        write(KEY_DIAG, { at: Date.now(), reco: reco, score: score });

        var p = PAL[reco];
        var start = firstOpen(p) || p.modules[0];
        var level = function (s, t) { return s === t ? 'solide' : (s >= t - 1 ? 'à consolider' : 'à apprendre'); };
        var missed = QS.map(function (item, i) { return { item: item, a: answers[i] }; }).filter(function (x) { return x.a !== x.item.q.a; });

        host.innerHTML =
            '<div class="diag__result">' +
                '<p class="diag__label">Ton point de départ</p>' +
                '<p class="diag__reco">' + (allGood ? 'Tout est juste : tes bases tiennent sur les quatre paliers. Va au bout avec le <b>palier 04</b> — ' + esc(p.title) + ' —, puis l’examen final.'
                    : 'Commence par le <b>palier ' + p.num + ' — ' + esc(p.title) + '</b>. ' + (reco === 'p1' ? 'C’est le socle de tout le reste : chaque module ira plus vite ensuite.' : 'Les paliers d’avant tiennent : passe leurs tests pour les valider sans tout relire.')) + '</p>' +
                '<p class="diag__actions"><a class="btn btn--primary" href="modules/' + start + '.html">Ouvrir ' + esc(mod(start).title) + ' →</a>' +
                    '<a class="btn" href="#palier-' + reco + '">Voir le palier ' + p.num + '</a>' +
                    '<button type="button" class="btn btn--ghost diag__again">Refaire le test</button></p>' +
                '<ol class="diag__bars">' + CAT.paliers.map(function (q) {
                    var s = score[q.id] || 0, t = total[q.id] || 0;
                    return '<li class="diag__bar diag__bar--' + (s === t ? 'ok' : (s >= t - 1 ? 'mid' : 'low')) + '"><span class="diag__bar-name">Palier ' + q.num + ' · ' + esc(q.title) + '</span>' +
                        '<span class="diag__bar-track"><i style="width:' + (t ? s / t * 100 : 0) + '%"></i></span>' +
                        '<span class="diag__bar-val">' + s + ' / ' + t + ' · ' + level(s, t) + '</span></li>';
                }).join('') + '</ol>' +
                (missed.length ? '<details class="reveal diag__missed"><summary>Revoir les ' + missed.length + ' question' + (missed.length > 1 ? 's' : '') + ' manquée' + (missed.length > 1 ? 's' : '') + '</summary><div class="reveal__body"><ol>' +
                    missed.map(function (x) {
                        var q = x.item.q;
                        return '<li><p class="diag__mq">' + q.q + '</p>' +
                            '<p class="diag__ma"><b>Réponse :</b> ' + q.c[q.a] + '</p>' +
                            (q.why ? '<p class="diag__mw">' + q.why + '</p>' : '') +
                            '<p class="diag__mref"><a href="modules/' + x.item.mod + '.html">' + esc(mod(x.item.mod).title) + (q.ref ? ' · ' + esc(q.ref) : '') + ' →</a></p></li>';
                    }).join('') + '</ol></div></details>' : '') +
            '</div>';
        host.querySelector('.diag__again').addEventListener('click', function () { answers = []; idx = 0; ask(); });
        paint();
        var r = host.querySelector('.diag__result');
        if (r && r.scrollIntoView) r.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    intro();
})();
