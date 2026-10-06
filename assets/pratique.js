/* ══════════════════════════════════════════════════════════════════
   PRATIQUE — les composants qui font faire, pas seulement lire.

     .lab       Lab guidé : chaque étape (.lab__steps > li) reçoit une
                case « fait », mémorisée sous cai.labs.
                <div class="lab" data-lab="cle-unique"> … </div>
     .cmdex     À toi de taper : un champ, une correction tolérante.
                data-accept = expressions régulières séparées par « ;; »
                (comparées sans tenir compte de la casse ni des espaces
                en trop), data-hint = indice après deux essais ratés.
                La solution est dans un <details class="reveal">.
     .scenario  Scénario de panne : des étapes (.scenario__step) avec
                des boutons (.scenario__opt, data-ok sur les bons,
                data-why = pourquoi un mauvais choix l'est). Une étape
                ne s'ouvre qu'une fois la précédente résolue.

   Sans JavaScript, tout reste lisible : les étapes, les énoncés et
   les explications sont dans le HTML. Le stockage local est lu et
   écrit dans des try/catch : sans lui, seules les cases sont perdues.
   ══════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var KEY_LABS = 'cai.labs';

    function read(key, fallback) {
        try {
            var raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }
    function write(key, value) {
        try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignoré */ }
    }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }

    /* ── Labs guidés ── */
    var labs = read(KEY_LABS, {}) || {};
    document.querySelectorAll('.lab[data-lab]').forEach(function (lab) {
        var id = lab.getAttribute('data-lab');
        var steps = lab.querySelectorAll('.lab__steps > li');
        if (!steps.length) return;
        var done = Array.isArray(labs[id]) ? labs[id] : [];
        var count = el('p', 'lab__count');
        function refresh() {
            var n = lab.querySelectorAll('.lab__steps > li.is-done').length;
            count.textContent = n + ' / ' + steps.length + ' étapes faites' + (n === steps.length ? ' — lab terminé ✓' : '');
        }
        steps.forEach(function (li, i) {
            var label = el('label', 'lab__check');
            var box = document.createElement('input');
            box.type = 'checkbox';
            box.checked = done.indexOf(i) > -1;
            li.classList.toggle('is-done', box.checked);
            label.appendChild(box);
            label.appendChild(document.createTextNode('étape faite'));
            li.appendChild(label);
            box.addEventListener('change', function () {
                li.classList.toggle('is-done', box.checked);
                var list = [];
                steps.forEach(function (s, j) { if (s.classList.contains('is-done')) list.push(j); });
                labs[id] = list;
                write(KEY_LABS, labs);
                refresh();
            });
        });
        lab.appendChild(count);
        refresh();
    });

    /* ── À toi de taper ── */
    function normalise(s) {
        return String(s).replace(/[‘’]/g, "'").replace(/[“”«»]/g, '"')
            .replace(/\s+/g, ' ').replace(/\s*;\s*$/, '').trim();
    }
    document.querySelectorAll('.cmdex[data-accept]').forEach(function (box, n) {
        var accept = box.getAttribute('data-accept').split(';;').map(function (r) {
            try { return new RegExp('^(?:' + r.trim() + ')$', box.hasAttribute('data-case') ? '' : 'i'); }
            catch (e) { return null; }
        }).filter(Boolean);
        if (!accept.length) return;
        var hint = box.getAttribute('data-hint');
        var sol = box.querySelector('details.reveal');
        var form = el('form', 'cmdex__form');
        form.setAttribute('autocomplete', 'off');
        var input = el('input', 'cmdex__input');
        input.type = 'text';
        input.spellcheck = false;
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('aria-label', 'Ta commande');
        input.placeholder = 'tape ta commande ici';
        input.id = 'cmdex-' + n;
        var btn = el('button', 'cmdex__btn', 'Vérifier');
        btn.type = 'submit';
        var fb = el('p', 'cmdex__fb');
        fb.setAttribute('aria-live', 'polite');
        form.appendChild(input);
        form.appendChild(btn);
        var tries = 0;
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var v = normalise(input.value);
            if (!v) { fb.className = 'cmdex__fb'; fb.textContent = 'Tape une commande d\'abord.'; return; }
            var ok = accept.some(function (re) { return re.test(v); });
            tries++;
            if (ok) {
                fb.className = 'cmdex__fb is-ok';
                fb.textContent = 'Juste. Compare quand même avec la correction : elle dit pourquoi.';
                box.classList.add('is-solved');
                if (sol) sol.open = true;
            } else {
                fb.className = 'cmdex__fb is-ko';
                fb.textContent = 'Pas encore.' + (tries >= 2 && hint ? ' Indice : ' + hint : ' Réessaie — la syntaxe exacte compte.');
            }
        });
        if (sol) { box.insertBefore(form, sol); box.insertBefore(fb, sol); }
        else { box.appendChild(form); box.appendChild(fb); }
    });

    /* ── Scénarios de panne ── */
    document.querySelectorAll('.scenario').forEach(function (sc) {
        var steps = Array.prototype.slice.call(sc.querySelectorAll('.scenario__step'));
        var end = sc.querySelector('.scenario__end');
        if (!steps.length) return;
        steps.forEach(function (st, i) {
            var why = st.querySelector('.scenario__why');
            if (why) why.hidden = true;
            if (i > 0) st.hidden = true;
            var fb = el('p', 'cmdex__fb');
            fb.setAttribute('aria-live', 'polite');
            var opts = st.querySelector('.scenario__opts');
            if (opts) {
                opts.parentNode.insertBefore(fb, opts.nextSibling);
                /* Mélange des choix : la bonne réponse n'est pas toujours la première. */
                var list = Array.prototype.slice.call(opts.children);
                for (var k = list.length - 1; k > 0; k--) {
                    var j = Math.floor(Math.random() * (k + 1));
                    var t = list[k]; list[k] = list[j]; list[j] = t;
                }
                list.forEach(function (o) { opts.appendChild(o); });
            }
            st.querySelectorAll('.scenario__opt').forEach(function (b) {
                b.type = 'button';
                b.addEventListener('click', function () {
                    if (b.hasAttribute('data-ok')) {
                        b.classList.add('is-ok');
                        st.querySelectorAll('.scenario__opt').forEach(function (o) { o.disabled = true; });
                        fb.className = 'cmdex__fb is-ok';
                        fb.textContent = 'Bon réflexe.';
                        if (why) why.hidden = false;
                        if (steps[i + 1]) steps[i + 1].hidden = false;
                        else if (end) end.hidden = false;
                    } else {
                        b.classList.add('is-ko');
                        b.disabled = true;
                        fb.className = 'cmdex__fb is-ko';
                        fb.textContent = b.getAttribute('data-why') || 'Pas le meilleur choix ici — essaie autre chose.';
                    }
                });
            });
        });
        if (end) end.hidden = true;
    });

    /* ── Entraînement illimité au subnetting (.subgen[data-mode]) ──
       situer   : réseau, broadcast, plage et nombre d'hôtes d'une adresse /n
       taille   : plus petit préfixe pour N hôtes
       wildcard : masque générique d'un préfixe                        */
    function ipStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
    function maskOf(p) { return p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; }
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function randomIp() {
        var r = rnd(0, 2);
        if (r === 0) return ((10 << 24) | (rnd(0, 255) << 16) | (rnd(0, 255) << 8) | rnd(1, 254)) >>> 0;
        if (r === 1) return ((172 << 24) | (rnd(16, 31) << 16) | (rnd(0, 255) << 8) | rnd(1, 254)) >>> 0;
        return ((192 << 24) | (168 << 16) | (rnd(0, 255) << 8) | rnd(1, 254)) >>> 0;
    }
    function blockInfo(p) {
        var octet = p <= 8 ? 1 : p <= 16 ? 2 : p <= 24 ? 3 : 4;
        var bits = octet * 8 - p;
        return { octet: octet, size: Math.pow(2, bits), maskOctet: 256 - Math.pow(2, bits) };
    }
    var GEN = {
        situer: function () {
            var p = rnd(17, 30), ip = randomIp(), m = maskOf(p);
            var net = (ip & m) >>> 0, bc = (net | (~m >>> 0)) >>> 0;
            var hosts = Math.pow(2, 32 - p) - 2, b = blockInfo(p);
            return {
                text: 'Adresse <code>' + ipStr(ip) + '/' + p + '</code> (masque <code>' + ipStr(m) + '</code>)',
                fields: [['Adresse réseau', ipStr(net)], ['Broadcast', ipStr(bc)], ['Premier hôte', ipStr(net + 1)], ['Dernier hôte', ipStr(bc - 1)], ['Nombre d\'hôtes', String(hosts)]],
                explain: '/' + p + ' : l\'octet « intéressant » est le ' + b.octet + '<sup>e</sup> (masque ' + b.maskOctet + '), block size = 256 − ' + b.maskOctet + ' = <b>' + b.size + '</b>. ' +
                    'Dans cet octet, l\'adresse vaut ' + ((ip >>> (8 * (4 - b.octet))) & 255) + ' : le multiple de ' + b.size + ' juste en dessous (' + ((net >>> (8 * (4 - b.octet))) & 255) + ') donne le réseau <b>' + ipStr(net) + '</b> ; le multiple suivant moins 1 donne le broadcast <b>' + ipStr(bc) + '</b>. ' +
                    'Hôtes : 2<sup>' + (32 - p) + '</sup> − 2 = <b>' + hosts + '</b>.'
            };
        },
        taille: function () {
            var need = [rnd(3, 30), rnd(31, 250), rnd(251, 4000), rnd(4001, 30000)][rnd(0, 3)];
            var bits = 2; while (Math.pow(2, bits) - 2 < need) bits++;
            var p = 32 - bits;
            return {
                text: 'Un réseau doit accueillir <b>' + need + '</b> hôtes. Quel est le plus petit sous-réseau qui convient ?',
                fields: [['Préfixe (ex. /24)', '/' + p], ['Masque décimal', ipStr(maskOf(p))], ['Hôtes utilisables', String(Math.pow(2, bits) - 2)]],
                explain: 'Il faut h bits d\'hôte tels que 2<sup>h</sup> − 2 ≥ ' + need + ' : h = <b>' + bits + '</b> (2<sup>' + bits + '</sup> − 2 = ' + (Math.pow(2, bits) - 2) +
                    (bits > 2 ? ', alors que 2<sup>' + (bits - 1) + '</sup> − 2 = ' + (Math.pow(2, bits - 1) - 2) + ' ne suffit pas' : '') + '). Préfixe = 32 − ' + bits + ' = <b>/' + p + '</b>.'
            };
        },
        wildcard: function () {
            var p = rnd(8, 30), m = maskOf(p);
            return {
                text: 'Quel est le masque générique (wildcard) du préfixe <code>/' + p + '</code> (masque <code>' + ipStr(m) + '</code>) ?',
                fields: [['Masque générique', ipStr(~m >>> 0)]],
                explain: 'Chaque octet : 255 − l\'octet du masque. ' + ipStr(m) + ' → <b>' + ipStr(~m >>> 0) + '</b>.'
            };
        }
    };
    function clean(v) { return String(v).replace(/\s+/g, '').replace(/^\/?/, function (x) { return x; }).toLowerCase(); }
    document.querySelectorAll('.subgen[data-mode]').forEach(function (box) {
        var gen = GEN[box.getAttribute('data-mode')];
        if (!gen) return;
        var score = { ok: 0, total: 0 };
        var q = el('p', 'subgen__q');
        var form = el('form', 'subgen__form');
        form.setAttribute('autocomplete', 'off');
        var fb = el('div', 'subgen__fb');
        fb.setAttribute('aria-live', 'polite');
        var bar = el('div', 'subgen__bar');
        var check = el('button', 'cmdex__btn', 'Vérifier'); check.type = 'submit';
        var next = el('button', 'cmdex__btn cmdex__btn--ghost', 'Nouvelle question'); next.type = 'button';
        var show = el('button', 'cmdex__btn cmdex__btn--ghost', 'Voir la correction'); show.type = 'button';
        var sc = el('span', 'subgen__score');
        bar.appendChild(check); bar.appendChild(show); bar.appendChild(next); bar.appendChild(sc);
        box.appendChild(q); box.appendChild(form); box.appendChild(bar); box.appendChild(fb);
        var cur, inputs, counted;
        function draw(userAsked) {
            cur = gen(); counted = false;
            q.innerHTML = cur.text;
            form.innerHTML = ''; inputs = [];
            cur.fields.forEach(function (f, i) {
                var lab = el('label', 'subgen__field');
                lab.appendChild(el('span', null, f[0]));
                var inp = el('input', 'cmdex__input');
                inp.type = 'text'; inp.spellcheck = false; inp.setAttribute('inputmode', 'decimal');
                lab.appendChild(inp); form.appendChild(lab); inputs.push(inp);
            });
            fb.innerHTML = '';
            // Le focus seulement sur « Nouvelle question » : au chargement, il volerait le clavier à la page.
            if (userAsked === true && inputs[0]) inputs[0].focus({ preventScroll: true });
        }
        function verdict(reveal) {
            var all = true;
            cur.fields.forEach(function (f, i) {
                var good = clean(inputs[i].value) === clean(f[1]) || ('/' + clean(inputs[i].value)) === clean(f[1]);
                inputs[i].classList.toggle('is-ok', good);
                inputs[i].classList.toggle('is-ko', !good && !reveal);
                if (reveal && !good) inputs[i].value = f[1];
                if (!good) all = false;
            });
            return all;
        }
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var all = verdict(false);
            if (!counted) { score.total++; if (all) score.ok++; counted = true; }
            sc.textContent = score.ok + ' / ' + score.total + ' juste' + (score.ok > 1 ? 's' : '') + ' du premier coup';
            fb.innerHTML = all ? '<p class="cmdex__fb is-ok">Tout est juste.</p><p>' + cur.explain + '</p>' : '<p class="cmdex__fb is-ko">Les cases en rouge sont fausses. Corrige, ou affiche la correction.</p>';
        });
        form.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); form.requestSubmit ? form.requestSubmit() : check.click(); } });
        show.addEventListener('click', function () {
            verdict(true);
            if (!counted) { score.total++; counted = true; sc.textContent = score.ok + ' / ' + score.total + ' juste' + (score.ok > 1 ? 's' : '') + ' du premier coup'; }
            fb.innerHTML = '<p>' + cur.explain + '</p>';
        });
        next.addEventListener('click', function () { draw(true); });
        draw();
    });
})();
