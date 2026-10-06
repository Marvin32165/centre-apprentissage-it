/* ══════════════════════════════════════════════════════════════════
   RÉVISION DU JOUR — répétition espacée (système de Leitner à 5 boîtes)

   Les cartes viennent de deux sources :
     - window.QUIZ_BANK (quiz-data.js) : chaque question de test devient
       une carte (recto : la question ; verso : la bonne réponse et sa
       correction commentée) ;
     - window.CARTES (cartes.js) : cartes écrites pour la révision
       (ports, commandes, réflexes).

   Une carte sue monte d'une boîte ; une carte ratée retourne en boîte 1
   et revient en fin de séance. Délai avant de la revoir, selon la boîte :
   1 j, 3 j, 7 j, 16 j, 35 j. Au plus 15 cartes nouvelles par jour.

   État : localStorage « cai.srs » = { id: { b: boîte, d: échéance (ms) } }
   et « cai.srs.jour » = { date, nouvelles }. Tout est lu et écrit dans
   des try/catch : sans stockage, la page marche, sans mémoire.
   ══════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var KEY = 'cai.srs', KEY_DAY = 'cai.srs.jour', KEY_FILTER = 'cai.srs.filtre';
    var DAYS = [0, 1, 3, 7, 16, 35];
    var NEW_PER_DAY = 15;
    var DAY = 86400000;

    function read(k, f) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch (e) { return f; } }
    function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignoré */ } }
    function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

    var host = document.getElementById('srs');
    if (!host) return;

    var CAT = window.CATALOGUE || { modules: {}, parcours: [] };
    var cards = [];
    var bank = window.QUIZ_BANK || {};
    Object.keys(bank).forEach(function (key) {
        (bank[key].questions || []).forEach(function (q) {
            var good = (Array.isArray(q.a) ? q.a : [q.a]).map(function (i) { return q.c[i]; });
            cards.push({
                id: 'q:' + key + ':' + hash(q.q), m: key, front: q.q,
                back: (good.length > 1 ? '<ul>' + good.map(function (g) { return '<li>' + g + '</li>'; }).join('') + '</ul>' : '<p><strong>' + good[0] + '</strong></p>') +
                      (q.why ? '<p class="srs__why">' + q.why + '</p>' : '') +
                      (q.ref ? '<p class="srs__why">À relire : <a href="modules/' + esc(bank[key].file) + '">' + esc(bank[key].name) + '</a>, ' + esc(q.ref) + '</p>' : '')
            });
        });
    });
    (window.CARTES || []).forEach(function (c) {
        cards.push({ id: 'c:' + c.m + ':' + hash(c.f), m: c.m, front: c.f, back: '<p><strong>' + c.b + '</strong></p>' });
    });

    var state = read(KEY, {}) || {};
    var day = read(KEY_DAY, null);
    if (!day || day.date !== today()) day = { date: today(), nouvelles: 0 };

    /* ── Filtres par parcours ── */
    var parcoursOf = {};
    (CAT.parcours || []).forEach(function (p) { (p.modules || []).forEach(function (m) { parcoursOf[m] = p.id; }); });
    var filter = read(KEY_FILTER, 'tout');
    var filtersEl = host.querySelector('.srs__filters');
    var chips = [['tout', 'Tout']].concat((CAT.parcours || []).map(function (p) { return [p.id, p.num + ' · ' + p.title]; }));
    chips.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'srs__chip'; b.textContent = c[1];
        b.setAttribute('aria-pressed', String(filter === c[0]));
        b.addEventListener('click', function () {
            filter = c[0]; write(KEY_FILTER, filter);
            filtersEl.querySelectorAll('.srs__chip').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            b.setAttribute('aria-pressed', 'true');
            build(); show();
        });
        filtersEl.appendChild(b);
    });

    var queue = [], current = null, revealed = false, done = 0;
    function inFilter(c) { return filter === 'tout' || parcoursOf[c.m] === filter; }
    function build() {
        var now = Date.now();
        var pool = cards.filter(inFilter);
        var due = pool.filter(function (c) { return state[c.id] && state[c.id].d <= now; });
        due.sort(function (a, b) { return state[a.id].b - state[b.id].b; });
        var fresh = pool.filter(function (c) { return !state[c.id]; });
        // Les nouvelles cartes arrivent mélangées, pour ne pas réviser un module d'un bloc.
        fresh.sort(function () { return Math.random() - 0.5; });
        var room = Math.max(0, NEW_PER_DAY - day.nouvelles);
        queue = due.concat(fresh.slice(0, room));
        stats(pool);
    }
    function stats(pool) {
        pool = pool || cards.filter(inFilter);
        var now = Date.now();
        var seen = pool.filter(function (c) { return state[c.id]; });
        var mastered = seen.filter(function (c) { return state[c.id].b >= 4; }).length;
        var dueN = seen.filter(function (c) { return state[c.id].d <= now; }).length;
        host.querySelector('.srs__stats').innerHTML =
            '<span><b>' + queue.length + '</b> à faire maintenant</span>' +
            '<span><b>' + dueN + '</b> à revoir</span>' +
            '<span><b>' + Math.max(0, NEW_PER_DAY - day.nouvelles) + '</b> nouvelles possibles aujourd\'hui</span>' +
            '<span><b>' + mastered + '</b> / ' + pool.length + ' maîtrisées</span>';
    }

    var cardEl = host.querySelector('.srs__card');
    function show() {
        revealed = false;
        current = queue.shift() || null;
        if (!current) {
            var next = Object.keys(state).map(function (k) { return state[k].d; }).filter(function (d) { return d > Date.now(); }).sort()[0];
            cardEl.innerHTML = '<div class="srs__empty"><p><strong>Rien à revoir pour l\'instant' + (done ? ' — ' + done + ' carte' + (done > 1 ? 's' : '') + ' révisée' + (done > 1 ? 's' : '') + ' dans cette séance.' : '.') + '</strong></p>' +
                (next ? '<p>Prochaines cartes le ' + new Date(next).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' }) + '.</p>' : '') +
                '<p>Envie de plus ? Choisis un autre parcours ci-dessus, ou repasse un <a href="examens.html">examen</a>.</p></div>';
            stats();
            return;
        }
        var mod = (CAT.modules || {})[current.m];
        var st = state[current.id];
        cardEl.innerHTML =
            '<p class="srs__mod">' + esc(mod ? mod.title : current.m) + (st ? '' : ' · nouvelle') + '</p>' +
            '<div class="srs__front">' + current.front + '</div>' +
            '<div class="srs__back" hidden>' + current.back + '</div>' +
            '<div class="srs__actions">' +
                '<button type="button" class="cmdex__btn" data-act="voir">Voir la réponse <kbd>Espace</kbd></button>' +
                '<button type="button" class="cmdex__btn cmdex__btn--ghost" data-act="non" hidden>Je ne savais pas <kbd>1</kbd></button>' +
                '<button type="button" class="cmdex__btn" data-act="oui" hidden>Je savais <kbd>2</kbd></button>' +
            '</div>' +
            '<div class="srs__box" title="Boîte ' + (st ? st.b : 0) + ' sur 5">' + [1, 2, 3, 4, 5].map(function (i) { return '<span' + (st && st.b >= i ? ' class="is-on"' : '') + '></span>'; }).join('') + '</div>';
        stats();
    }
    function reveal() {
        if (!current || revealed) return;
        revealed = true;
        cardEl.querySelector('.srs__back').hidden = false;
        cardEl.querySelector('[data-act="voir"]').hidden = true;
        cardEl.querySelector('[data-act="non"]').hidden = false;
        cardEl.querySelector('[data-act="oui"]').hidden = false;
        cardEl.querySelector('[data-act="oui"]').focus({ preventScroll: true });
    }
    function answer(ok) {
        if (!current || !revealed) return;
        var st = state[current.id];
        if (!st) { day.nouvelles++; write(KEY_DAY, day); }
        var b = ok ? Math.min(5, (st ? st.b : 0) + 1) : 1;
        state[current.id] = { b: b, d: Date.now() + DAYS[b] * DAY };
        write(KEY, state);
        if (!ok) queue.push(current);   // revient en fin de séance
        done++;
        show();
    }
    cardEl.addEventListener('click', function (e) {
        var a = e.target.closest('[data-act]');
        if (!a) return;
        if (a.getAttribute('data-act') === 'voir') reveal();
        else answer(a.getAttribute('data-act') === 'oui');
    });
    document.addEventListener('keydown', function (e) {
        if (e.target.closest('input, textarea, a, button.srs__chip')) return;
        if ((e.key === ' ' || e.key === 'Enter') && !revealed) { e.preventDefault(); reveal(); }
        else if (e.key === '1' && revealed) answer(false);
        else if (e.key === '2' && revealed) answer(true);
    });

    build();
    show();
})();
