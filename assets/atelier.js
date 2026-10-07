/* ══════════════════════════════════════════════════════════════════
   ATELIER — outils interactifs. Chaque outil se dessine dans
   <div class="tool" data-tool="chmod|umask|cron|ipcalc|ports|convert|regex"></div>,
   sur atelier.html comme dans un chapitre. Aucun appel réseau, rien n'est stocké.
   ══════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';
    function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function head(box, label, title, lead) {
        box.appendChild(el('p', 'tool__label', label));
        box.appendChild(el('p', 'tool__title', title));
        if (lead) box.appendChild(el('p', 'tool__lead', lead));
    }
    function field(label, attrs) {
        var w = el('label', 'tool__field');
        w.appendChild(el('span', null, label));
        var i = el('input', 'tool__input');
        for (var k in attrs) i.setAttribute(k, attrs[k]);
        i.spellcheck = false; i.autocomplete = 'off';
        w.appendChild(i);
        return { wrap: w, input: i };
    }
    function out(cls) { var o = el('div', 'tool__out' + (cls ? ' ' + cls : '')); o.setAttribute('aria-live', 'polite'); return o; }

    var TOOLS = {};

    /* ── chmod : cases ↔ octal ↔ symbolique ── */
    TOOLS.chmod = function (box) {
        head(box, 'Calculateur', 'chmod : les permissions en clair', 'Coche les droits, ou tape une valeur octale (<code>754</code>, <code>2775</code>) ou symbolique (<code>rwxr-x---</code>) : les trois vues restent synchronisées.');
        var who = [['u', 'Propriétaire'], ['g', 'Groupe'], ['o', 'Autres']], what = [['r', 'lecture', 4], ['w', 'écriture', 2], ['x', 'exécution', 1]];
        var grid = el('div', 'chmod__grid');
        grid.appendChild(el('span'));
        what.forEach(function (w) { grid.appendChild(el('span', 'chmod__h', '<b>' + w[0] + '</b> ' + w[1] + ' <em>' + w[2] + '</em>')); });
        grid.appendChild(el('span', 'chmod__h', '<em>=</em>'));
        var cb = {}, sums = {};
        who.forEach(function (u) {
            grid.appendChild(el('span', 'chmod__who', '<b>' + u[0] + '</b> ' + u[1]));
            what.forEach(function (w) {
                var l = el('label', 'chmod__cell'), c = el('input');
                c.type = 'checkbox'; c.setAttribute('aria-label', u[1] + ' : ' + w[1]);
                cb[u[0] + w[0]] = c; l.appendChild(c); grid.appendChild(l);
            });
            sums[u[0]] = el('span', 'chmod__sum'); grid.appendChild(sums[u[0]]);
        });
        box.appendChild(grid);
        var sp = el('div', 'chmod__special');
        var spec = {};
        [['s4', 'setuid (4)', 'exécute avec les droits du propriétaire'], ['s2', 'setgid (2)', 'sur un dossier : les fichiers créés héritent du groupe'], ['s1', 'sticky (1)', 'sur un dossier : seul le propriétaire supprime ses fichiers']].forEach(function (s) {
            var l = el('label', 'chmod__sp'), c = el('input'); c.type = 'checkbox';
            spec[s[0]] = c; l.appendChild(c); l.appendChild(el('span', null, '<b>' + s[1] + '</b> — ' + s[2])); sp.appendChild(l);
        });
        box.appendChild(sp);
        var row = el('div', 'tool__row');
        var oct = field('Octal', { value: '755', inputmode: 'numeric', maxlength: '4', 'data-k': 'oct' });
        var sym = field('Symbolique (ls -l)', { value: 'rwxr-xr-x', maxlength: '10', 'data-k': 'sym' });
        row.appendChild(oct.wrap); row.appendChild(sym.wrap); box.appendChild(row);
        var o = out(); box.appendChild(o);

        function bits() {
            var v = { u: 0, g: 0, o: 0 }, s = 0;
            who.forEach(function (u) { what.forEach(function (w) { if (cb[u[0] + w[0]].checked) v[u[0]] += w[2]; }); });
            if (spec.s4.checked) s += 4; if (spec.s2.checked) s += 2; if (spec.s1.checked) s += 1;
            return { s: s, u: v.u, g: v.g, o: v.o };
        }
        function symOf(b) {
            var r = '';
            ['u', 'g', 'o'].forEach(function (k, i) {
                var n = b[k];
                r += (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-');
                var x = n & 1, sp = i === 0 ? b.s & 4 : i === 1 ? b.s & 2 : b.s & 1;
                r += sp ? (i === 2 ? (x ? 't' : 'T') : (x ? 's' : 'S')) : (x ? 'x' : '-');
            });
            return r;
        }
        function set(b) {
            who.forEach(function (u) { what.forEach(function (w) { cb[u[0] + w[0]].checked = !!(b[u[0]] & w[2]); }); });
            spec.s4.checked = !!(b.s & 4); spec.s2.checked = !!(b.s & 2); spec.s1.checked = !!(b.s & 1);
        }
        function show(from) {
            var b = bits(), o3 = '' + b.u + b.g + b.o, octal = (b.s ? b.s : '') + o3, s = symOf(b);
            who.forEach(function (u) { sums[u[0]].textContent = b[u[0]]; });
            if (from !== 'oct') oct.input.value = octal;
            if (from !== 'sym') sym.input.value = s;
            var parts = ['u=' + s.slice(0, 3).replace(/-/g, ''), 'g=' + s.slice(3, 6).replace(/-/g, ''), 'o=' + s.slice(6).replace(/-/g, '')].join(',');
            var notes = [];
            if (b.o & 2) notes.push('⚠️ <b>Tout le monde peut écrire</b> : rarement voulu (sauf dossier partagé avec sticky bit, comme <code>/tmp</code> en 1777).');
            if (b.s & 4) notes.push('setuid : le programme s\'exécute avec les droits de son propriétaire (ex. <code>/usr/bin/passwd</code>). À éviter sur un script.');
            if (b.s & 1 && !(b.o & 2)) notes.push('Le sticky bit n\'a d\'intérêt que sur un dossier où plusieurs personnes écrivent.');
            if (o3 === '644') notes.push('Valeur classique d\'un <b>fichier</b> : le propriétaire écrit, tout le monde lit.');
            if (o3 === '755') notes.push('Valeur classique d\'un <b>dossier</b> ou d\'un <b>script</b> : tout le monde peut entrer ou exécuter, seul le propriétaire modifie.');
            if (o3 === '600') notes.push('Valeur d\'une <b>clé privée SSH</b> : seul le propriétaire lit et écrit (ssh refuse une clé plus ouverte).');
            if (o3 === '640') notes.push('Lecture pour le groupe, rien pour les autres : idéal pour un fichier de configuration partagé avec un service.');
            o.innerHTML = '<p class="tool__result"><code>chmod ' + octal + ' fichier</code> <span class="tool__eq">≡</span> <code>chmod ' + parts + ' fichier</code></p>' +
                '<p class="tool__mono">ls -l → <b>-' + s + '</b> (fichier) · <b>d' + s + '</b> (dossier)</p>' +
                '<p class="tool__hint">Chaque chiffre est une somme : r = 4, w = 2, x = 1. ' + b.u + ' = ' + expl(b.u) + ' ; ' + b.g + ' = ' + expl(b.g) + ' ; ' + b.o + ' = ' + expl(b.o) + '.</p>' +
                notes.map(function (n) { return '<p class="tool__note">' + n + '</p>'; }).join('');
            oct.input.classList.remove('is-ko'); sym.input.classList.remove('is-ko');
        }
        function expl(n) { var p = []; if (n & 4) p.push('4'); if (n & 2) p.push('2'); if (n & 1) p.push('1'); return p.length ? p.join(' + ') : '0 (aucun droit)'; }
        grid.addEventListener('change', function () { show(); });
        sp.addEventListener('change', function () { show(); });
        oct.input.addEventListener('input', function () {
            var v = oct.input.value.trim();
            if (!/^[0-7]{3,4}$/.test(v)) { oct.input.classList.add('is-ko'); return; }
            if (v.length === 3) v = '0' + v;
            set({ s: +v[0], u: +v[1], g: +v[2], o: +v[3] }); show('oct');
        });
        sym.input.addEventListener('input', function () {
            var v = sym.input.value.trim();
            if (v.length === 10) v = v.slice(1);
            if (!/^[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/.test(v)) { sym.input.classList.add('is-ko'); return; }
            var b = { s: 0, u: 0, g: 0, o: 0 };
            ['u', 'g', 'o'].forEach(function (k, i) {
                var t = v.slice(i * 3, i * 3 + 3);
                b[k] = (t[0] === 'r' ? 4 : 0) + (t[1] === 'w' ? 2 : 0) + (/[xst]/.test(t[2]) ? 1 : 0);
                if (/[sStT]/.test(t[2])) b.s += [4, 2, 1][i];
            });
            set(b); show('sym');
        });
        set({ s: 0, u: 7, g: 5, o: 5 }); show();
    };

    /* ── umask ── */
    TOOLS.umask = function (box) {
        head(box, 'Calculateur', 'umask : les droits des nouveaux fichiers', 'Le umask <b>retire</b> des droits au maximum de départ : 666 pour un fichier, 777 pour un dossier.');
        var f = field('umask', { value: '022', maxlength: '4', inputmode: 'numeric' });
        var row = el('div', 'tool__row'); row.appendChild(f.wrap); box.appendChild(row);
        var o = out(); box.appendChild(o);
        function sym(n) { return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-'); }
        function show() {
            var v = f.input.value.trim().replace(/^0(?=\d{3}$)/, '');
            if (!/^[0-7]{3}$/.test(v)) { f.input.classList.add('is-ko'); return; }
            f.input.classList.remove('is-ko');
            var m = v.split('').map(Number);
            var file = [6, 6, 6].map(function (x, i) { return x & ~m[i]; }), dir = [7, 7, 7].map(function (x, i) { return x & ~m[i]; });
            o.innerHTML = '<div class="tool__table"><span>Nouveau fichier</span><code>' + file.join('') + '</code><code>-' + file.map(sym).join('') + '</code>' +
                '<span>Nouveau dossier</span><code>' + dir.join('') + '</code><code>d' + dir.map(sym).join('') + '</code></div>' +
                '<p class="tool__hint">Calcul bit à bit : on enlève les bits du umask (666 ET NON ' + v + ' ; 777 ET NON ' + v + '). Ce n\'est pas une soustraction : avec 033, un fichier donne 644, pas 633.</p>' +
                (v === '022' ? '<p class="tool__note">022 est la valeur par défaut de Debian : le groupe et les autres lisent, seul le propriétaire écrit.</p>' : '') +
                (v === '077' ? '<p class="tool__note">077 : tout ce qui est créé reste privé au propriétaire.</p>' : '');
        }
        f.input.addEventListener('input', show); show();
    };

    /* ── crontab ── */
    var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    var NAMES = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12, sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    var MACROS = { '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@hourly': '0 * * * *' };
    function cronField(s, lo, hi, isDow) {
        var set = {};
        s.toLowerCase().split(',').forEach(function (part) {
            var m = /^(\*|[a-z0-9]+(?:-[a-z0-9]+)?)(?:\/(\d+))?$/.exec(part);
            if (!m) throw new Error('« ' + part + ' » n\'est pas compris');
            var step = m[2] ? +m[2] : 1, a, b;
            if (!step) throw new Error('un pas /0 n\'a pas de sens');
            function num(x) { var n = NAMES[x] != null ? NAMES[x] : parseInt(x, 10); if (isNaN(n) || !/^[a-z]{3}$|^\d+$/.test(x)) throw new Error('« ' + x + ' » n\'est pas une valeur'); return n; }
            if (m[1] === '*') { a = lo; b = hi; }
            else if (m[1].indexOf('-') > 0) { var r = m[1].split('-'); a = num(r[0]); b = num(r[1]); }
            else { a = num(m[1]); b = m[2] ? hi : a; }
            if (isDow && b === 7) b = 7;
            if (a < lo || b > (isDow ? 7 : hi) || a > b) throw new Error('valeur hors limites (' + lo + '–' + hi + ') dans « ' + part + ' »');
            for (var v = a; v <= b; v += step) set[isDow && v === 7 ? 0 : v] = true;
        });
        return set;
    }
    function keys(set) { return Object.keys(set).map(Number).sort(function (a, b) { return a - b; }); }
    function listFr(arr) { return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' et ' + arr[arr.length - 1]; }
    function cronParse(line) {
        line = line.trim().replace(/\s+/g, ' ');
        var macro = line.split(' ')[0];
        if (macro === '@reboot') return { reboot: true, cmd: line.slice(8) };
        if (MACROS[macro]) line = MACROS[macro] + line.slice(macro.length);
        var p = line.split(' ');
        if (p.length < 5) throw new Error('il faut 5 champs : minute heure jour-du-mois mois jour-de-semaine');
        return {
            raw: p.slice(0, 5), cmd: p.slice(5).join(' '),
            min: cronField(p[0], 0, 59), hour: cronField(p[1], 0, 23), dom: cronField(p[2], 1, 31),
            mon: cronField(p[3], 1, 12), dow: cronField(p[4], 0, 6, true),
            domStar: p[2] === '*', dowStar: p[4] === '*'
        };
    }
    function cronDescribe(c) {
        if (c.reboot) return 'Au <b>démarrage</b> de la machine.';
        var r = c.raw, txt = '';
        var mins = keys(c.min), hours = keys(c.hour);
        var stepM = /^\*\/(\d+)$/.exec(r[0]), stepH = /^\*\/(\d+)$/.exec(r[1]);
        if (r[0] === '*' && r[1] === '*') txt = '<b>Chaque minute</b>';
        else if (stepM && r[1] === '*') txt = '<b>Toutes les ' + stepM[1] + ' minutes</b>';
        else if (r[1] === '*') txt = 'À la minute <b>' + listFr(mins) + '</b> de <b>chaque heure</b>';
        else if (stepH && mins.length === 1) txt = '<b>Toutes les ' + stepH[1] + ' heures</b>, à la minute ' + mins[0];
        else if (mins.length * hours.length <= 6 && r[0] !== '*' && !stepM) {
            var t = []; hours.forEach(function (h) { mins.forEach(function (m) { t.push((h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m); }); });
            txt = 'À <b>' + listFr(t) + '</b>';
        } else txt = (r[0] === '*' ? 'Chaque minute' : stepM ? 'Toutes les ' + stepM[1] + ' minutes' : 'Aux minutes ' + listFr(mins)) + ', pendant les heures <b>' + listFr(hours) + '</b>';
        var days;
        var dowTxt = (function () {
            var d = keys(c.dow);
            if (/^1-5$/.test(r[4]) || /^mon-fri$/i.test(r[4])) return 'du <b>lundi au vendredi</b>';
            if (d.length === 2 && d[0] === 0 && d[1] === 6) return 'le <b>week-end</b>';
            return 'le <b>' + listFr(d.map(function (x) { return JOURS[x]; })) + '</b>';
        })();
        var domTxt = 'le <b>' + listFr(keys(c.dom).map(function (x) { return x === 1 ? '1er' : x; })) + '</b> du mois';
        if (c.domStar && c.dowStar) days = '<b>tous les jours</b>';
        else if (c.domStar) days = dowTxt;
        else if (c.dowStar) days = domTxt;
        else days = domTxt + ' <b>ou</b> ' + dowTxt + ' (quand les deux sont fixés, l\'un <i>ou</i> l\'autre suffit)';
        var months = r[3] === '*' ? '' : ', en <b>' + listFr(keys(c.mon).map(function (x) { return MOIS[x - 1]; })) + '</b>';
        return txt + ', ' + days + months + '.';
    }
    function cronNext(c, from, n) {
        var res = [], d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
        var mins = keys(c.min), hours = keys(c.hour);
        for (var day = 0; day < 366 * 6 && res.length < n; day++, d.setDate(d.getDate() + 1)) {
            if (!c.mon[d.getMonth() + 1]) continue;
            var domOk = !!c.dom[d.getDate()], dowOk = !!c.dow[d.getDay()];
            var ok = c.domStar && c.dowStar ? true : c.domStar ? dowOk : c.dowStar ? domOk : (domOk || dowOk);
            if (!ok) continue;
            for (var i = 0; i < hours.length && res.length < n; i++) for (var j = 0; j < mins.length && res.length < n; j++) {
                var t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours[i], mins[j]);
                if (t > from) res.push(t);
            }
        }
        return res;
    }
    TOOLS.cron = function (box) {
        head(box, 'Traducteur', 'crontab : quand ma tâche tourne-t-elle ?', 'Tape une ligne de crontab : l\'outil la traduit en français et calcule les prochaines exécutions (heure de ce navigateur).');
        var legend = el('p', 'cron__legend tool__mono', '<span>minute</span><span>heure</span><span>jour du mois</span><span>mois</span><span>jour de semaine</span><span>commande</span>');
        box.appendChild(legend);
        var f = field('Ligne de crontab', { value: '30 2 * * 1-5 /usr/local/bin/sauvegarde.sh', 'class': 'tool__input tool__input--wide' });
        box.appendChild(f.wrap);
        var pre = el('div', 'tool__presets');
        [['*/15 * * * *', 'toutes les 15 min'], ['0 * * * *', 'chaque heure'], ['30 2 * * *', 'chaque nuit 2h30'], ['0 8 * * 1-5', 'jours ouvrés 8h'], ['0 0 1 * *', 'le 1er du mois'], ['0 3 * * 0', 'dimanche 3h'], ['@reboot', 'au démarrage']].forEach(function (p) {
            var b = el('button', 'srs__chip', esc(p[1])); b.type = 'button';
            b.addEventListener('click', function () { var cmd = f.input.value.trim().replace(/^(@\w+|(\S+\s+){4}\S+)\s*/, ''); f.input.value = p[0] + ' ' + (cmd || '/chemin/script.sh'); show(); });
            pre.appendChild(b);
        });
        box.appendChild(pre);
        var o = out(); box.appendChild(o);
        function show() {
            try {
                var c = cronParse(f.input.value);
                f.input.classList.remove('is-ko');
                var html = '<p class="tool__result">' + cronDescribe(c) + '</p>';
                if (c.cmd) html += '<p class="tool__mono">Commande : <b>' + esc(c.cmd) + '</b></p>';
                if (!c.reboot) {
                    var nx = cronNext(c, new Date(), 5);
                    html += '<p class="tool__sub">Prochaines exécutions</p><ul class="tool__list">' + nx.map(function (t) {
                        return '<li>' + JOURS[t.getDay()] + ' ' + t.getDate() + ' ' + MOIS[t.getMonth()] + ' ' + t.getFullYear() + ' à ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) + '</li>';
                    }).join('') + '</ul>';
                }
                html += '<p class="tool__hint">cron utilise un environnement minimal : chemins <b>absolus</b> dans la commande, et redirige la sortie (<code>&gt;&gt; /var/log/tache.log 2&gt;&amp;1</code>) pour garder une trace. Édition : <code>crontab -e</code> ; liste : <code>crontab -l</code>.</p>';
                o.innerHTML = html;
            } catch (e) {
                f.input.classList.add('is-ko');
                o.innerHTML = '<p class="tool__note">⚠️ ' + esc(e.message) + '.</p>';
            }
        }
        f.input.addEventListener('input', show); show();
    };
    TOOLS._cron = { parse: cronParse, describe: cronDescribe, next: cronNext };

    /* ── Calculateur IPv4 ── */
    function ipNum(s) {
        var p = s.split('.');
        if (p.length !== 4) return null;
        var n = 0;
        for (var i = 0; i < 4; i++) { if (!/^\d{1,3}$/.test(p[i]) || +p[i] > 255) return null; n = n * 256 + (+p[i]); }
        return n;
    }
    function ipStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
    function maskOf(p) { return p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; }
    function bin(n) { return ('00000000000000000000000000000000' + n.toString(2)).slice(-32); }
    function ipKind(n) {
        var a = n >>> 24, b = (n >>> 16) & 255;
        if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return 'privée (RFC 1918)';
        if (a === 127) return 'boucle locale (127.0.0.0/8)';
        if (a === 169 && b === 254) return 'APIPA / lien local (169.254.0.0/16) : aucun DHCP n\'a répondu';
        if (a === 100 && b >= 64 && b <= 127) return 'partagée CGNAT (100.64.0.0/10)';
        if ((a === 192 && b === 0 && ((n >>> 8) & 255) === 2) || (a === 198 && b === 51 && ((n >>> 8) & 255) === 100) || (a === 203 && b === 0 && ((n >>> 8) & 255) === 113)) return 'documentation (RFC 5737)';
        if (a >= 224 && a <= 239) return 'multicast';
        if (a >= 240) return 'réservée';
        return 'publique';
    }
    TOOLS.ipcalc = function (box) {
        head(box, 'Calculateur', 'Calculateur IPv4', 'Une adresse et son préfixe (<code>172.16.50.25/24</code>), ou une adresse et un masque (<code>10.2.10.1 255.255.255.192</code>).');
        var f = field('Adresse / préfixe', { value: '172.16.50.25/24', 'class': 'tool__input tool__input--wide', inputmode: 'decimal' });
        box.appendChild(f.wrap);
        var o = out(); box.appendChild(o);
        function show() {
            var v = f.input.value.trim(), m = /^(\d+\.\d+\.\d+\.\d+)\s*(?:\/\s*(\d{1,2})|\s+(\d+\.\d+\.\d+\.\d+))?$/.exec(v);
            var ip = m && ipNum(m[1]), p = m && m[2] != null ? +m[2] : null;
            if (m && m[3]) {
                var mk = ipNum(m[3]);
                if (mk === null || !/^1*0*$/.test(bin(mk))) { f.input.classList.add('is-ko'); o.innerHTML = '<p class="tool__note">⚠️ Ce masque n\'est pas valide : ses bits à 1 doivent être contigus (255.255.255.192 oui, 255.255.0.255 non).</p>'; return; }
                p = bin(mk).indexOf('0'); if (p < 0) p = 32;
            }
            if (m && p === null) p = (ip >>> 24) < 128 ? 8 : (ip >>> 24) < 192 ? 16 : 24;
            if (!m || ip === null || p > 32) { f.input.classList.add('is-ko'); o.innerHTML = '<p class="tool__note">⚠️ Écris une adresse comme <code>192.168.1.10/24</code>.</p>'; return; }
            f.input.classList.remove('is-ko');
            var mask = maskOf(p), net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, size = Math.pow(2, 32 - p);
            var hosts = p >= 31 ? (p === 31 ? 2 : 1) : size - 2;
            var first = p >= 31 ? net : net + 1, last = p >= 31 ? bc : bc - 1;
            var b = bin(ip), bn = b.slice(0, p), bh = b.slice(p);
            function dotted(s, off) { return s.split('').map(function (c, i) { return ((i + off) % 8 === 0 && i + off > 0 ? '.' : '') + c; }).join(''); }
            o.innerHTML = '<div class="tool__table">' +
                '<span>Masque</span><code>' + ipStr(mask) + '</code><code>/' + p + '</code>' +
                '<span>Masque générique</span><code>' + ipStr(~mask >>> 0) + '</code><code>pour les ACL et OSPF</code>' +
                '<span>Réseau</span><code><b>' + ipStr(net) + '</b></code><code>' + ipStr(net) + '/' + p + '</code>' +
                '<span>Broadcast</span><code><b>' + ipStr(bc) + '</b></code><code>' + (p >= 31 ? 'aucun' : 'dernière adresse') + '</code>' +
                '<span>Plage utilisable</span><code>' + ipStr(first) + '</code><code>→ ' + ipStr(last) + '</code>' +
                '<span>Hôtes</span><code><b>' + hosts + '</b></code><code>' + (p >= 31 ? (p === 31 ? 'liaison point à point (RFC 3021)' : 'une seule machine') : '2^' + (32 - p) + ' − 2') + '</code>' +
                '<span>Type</span><code>' + ipKind(ip) + '</code><code></code>' +
                '</div>' +
                '<p class="tool__sub">En binaire : <span class="ipbin__net">partie réseau</span> · <span class="ipbin__host">partie hôte</span></p>' +
                '<p class="ipbin"><span class="ipbin__net">' + dotted(bn, 0) + '</span><span class="ipbin__host">' + dotted(bh, p) + '</span></p>' +
                (p < 32 && p > 0 ? (function () {
                    var oc = Math.floor((p - 1) / 8) + 1, blk = Math.pow(2, 8 * oc - p);
                    return '<p class="tool__hint">Octet « intéressant » : le ' + oc + '<sup>e</sup> (masque ' + (256 - blk) + '). Pas (block size) = 256 − ' + (256 - blk) + ' = <b>' + blk + '</b> : dans cet octet, les sous-réseaux commencent à 0, ' + blk + ', ' + 2 * blk + '…</p>';
                })() : '');
        }
        f.input.addEventListener('input', show); show();
    };
    TOOLS._ip = { ipNum: ipNum, ipStr: ipStr, maskOf: maskOf };

    /* ── Ports courants ── */
    var PORTS = [
        [20, 'TCP', 'FTP (données)', 'Transfert de fichiers, canal de données en mode actif'], [21, 'TCP', 'FTP', 'Transfert de fichiers, commandes'],
        [22, 'TCP', 'SSH / SFTP / SCP', 'Shell distant chiffré, transfert de fichiers'], [23, 'TCP', 'Telnet', 'Shell distant en clair — à proscrire'],
        [25, 'TCP', 'SMTP', 'Courrier entre serveurs'], [53, 'UDP/TCP', 'DNS', 'Résolution de noms (TCP pour les grosses réponses et les transferts de zone)'],
        [67, 'UDP', 'DHCP (serveur)', 'Attribution d\'adresses'], [68, 'UDP', 'DHCP (client)', 'Attribution d\'adresses'], [69, 'UDP', 'TFTP', 'Transfert simple (images IOS, démarrage PXE)'],
        [80, 'TCP', 'HTTP', 'Web en clair'], [88, 'TCP/UDP', 'Kerberos', 'Authentification Active Directory'], [110, 'TCP', 'POP3', 'Relève du courrier'],
        [123, 'UDP', 'NTP', 'Synchronisation de l\'heure'], [135, 'TCP', 'RPC (mappeur)', 'Appels de procédure distants Windows, puis ports dynamiques 49152–65535'],
        [137, 'UDP', 'NetBIOS (noms)', 'Résolution de noms historique de Windows'], [143, 'TCP', 'IMAP', 'Accès au courrier'],
        [161, 'UDP', 'SNMP', 'Supervision des équipements'], [162, 'UDP', 'SNMP trap', 'Alertes envoyées par les équipements'],
        [389, 'TCP/UDP', 'LDAP', 'Annuaire (Active Directory)'], [443, 'TCP', 'HTTPS', 'Web chiffré (et UDP 443 pour HTTP/3)'], [445, 'TCP', 'SMB', 'Partages de fichiers Windows'],
        [464, 'TCP/UDP', 'Kerberos (mot de passe)', 'Changement de mot de passe'], [465, 'TCP', 'SMTPS', 'Soumission de courrier en TLS implicite'],
        [500, 'UDP', 'IKE', 'Négociation des VPN IPsec'], [514, 'UDP', 'Syslog', 'Envoi de journaux'], [587, 'TCP', 'SMTP (soumission)', 'Envoi de courrier par les clients'],
        [636, 'TCP', 'LDAPS', 'LDAP chiffré'], [993, 'TCP', 'IMAPS', 'IMAP chiffré'], [995, 'TCP', 'POP3S', 'POP3 chiffré'],
        [1433, 'TCP', 'SQL Server', 'Instance par défaut'], [1434, 'UDP', 'SQL Browser', 'Localise les instances nommées'],
        [1812, 'UDP', 'RADIUS', 'Authentification (Wi-Fi d\'entreprise, VPN)'], [3268, 'TCP', 'Catalogue global', 'Recherche LDAP dans toute la forêt AD'],
        [3306, 'TCP', 'MySQL / MariaDB', 'Base de données'], [3389, 'TCP/UDP', 'RDP', 'Bureau à distance'], [3391, 'UDP', 'Passerelle RD', 'Transport UDP de la passerelle Bureau à distance'],
        [5060, 'UDP/TCP', 'SIP', 'Signalisation VoIP'], [5061, 'TCP', 'SIP TLS', 'Signalisation VoIP chiffrée'], [5432, 'TCP', 'PostgreSQL', 'Base de données'],
        [5985, 'TCP', 'WinRM HTTP', 'PowerShell à distance'], [5986, 'TCP', 'WinRM HTTPS', 'PowerShell à distance sur TLS'],
        [8006, 'TCP', 'Proxmox VE', 'Interface web de Proxmox'], [8080, 'TCP', 'HTTP alternatif', 'Proxys, applications web de test'],
        [10050, 'TCP', 'Zabbix agent', 'Le serveur interroge l\'agent (vérifications passives)'], [10051, 'TCP', 'Zabbix serveur', 'L\'agent envoie ses données (vérifications actives)'],
        [51820, 'UDP', 'WireGuard', 'VPN']
    ];
    TOOLS.ports = function (box) {
        head(box, 'Référence', 'Les ports à connaître', 'Filtre par numéro, protocole ou service (« 443 », « ldap », « udp »).');
        var f = field('Filtrer', { placeholder: 'ex. 3389 ou kerberos', 'class': 'tool__input tool__input--wide' });
        box.appendChild(f.wrap);
        var o = out('tool__out--ports'); box.appendChild(o);
        function norm(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
        function show() {
            var q = norm(f.input.value.trim());
            var rows = PORTS.filter(function (p) { return !q || norm(p.join(' ')).indexOf(q) > -1; });
            o.innerHTML = rows.length ? '<div class="table-wrap"><table><thead><tr><th>Port</th><th>Protocole</th><th>Service</th><th>Usage</th></tr></thead><tbody>' +
                rows.map(function (p) { return '<tr><td><code>' + p[0] + '</code></td><td>' + p[1] + '</td><td>' + esc(p[2]) + '</td><td>' + esc(p[3]) + '</td></tr>'; }).join('') +
                '</tbody></table></div><p class="tool__hint">Vérifier un port à distance : <code>Test-NetConnection srv -Port 443</code> (Windows) ou <code>nc -zv srv 443</code> (Linux). Voir ce qui écoute : <code>netstat -ano</code> / <code>ss -tulpn</code>.</p>'
                : '<p class="tool__note">Aucun port ne correspond.</p>';
        }
        f.input.addEventListener('input', show); show();
    };

    /* ── Conversions décimal / binaire / hexadécimal ── */
    TOOLS.convert = function (box) {
        head(box, 'Convertisseur', 'Décimal, binaire, hexadécimal', 'Tape dans n\'importe quelle case (jusqu\'à 32 bits) : les autres suivent. Utile pour les masques, les MAC et les permissions.');
        var row = el('div', 'tool__row');
        var d = field('Décimal', { value: '192', inputmode: 'numeric' }), b = field('Binaire', { value: '11000000' }), h = field('Hexadécimal', { value: 'C0' });
        row.appendChild(d.wrap); row.appendChild(b.wrap); row.appendChild(h.wrap); box.appendChild(row);
        var o = out(); box.appendChild(o);
        function upd(from) {
            var n, src = { d: d, b: b, h: h }[from], v = src.input.value.trim().replace(/\s+/g, '');
            if (from === 'd') n = /^\d+$/.test(v) ? parseInt(v, 10) : NaN;
            if (from === 'b') n = /^[01]+$/.test(v) ? parseInt(v, 2) : NaN;
            if (from === 'h') n = /^(0x)?[0-9a-f]+$/i.test(v) ? parseInt(v.replace(/^0x/i, ''), 16) : NaN;
            if (isNaN(n) || n > 4294967295) { src.input.classList.add('is-ko'); return; }
            src.input.classList.remove('is-ko');
            if (from !== 'd') d.input.value = n;
            var bs = n.toString(2); if (bs.length % 8) bs = ('0000000' + bs).slice(-(Math.ceil(bs.length / 8) * 8));
            if (from !== 'b') b.input.value = bs.replace(/(\d{8})(?=\d)/g, '$1 ');
            if (from !== 'h') h.input.value = n.toString(16).toUpperCase();
            var w = [128, 64, 32, 16, 8, 4, 2, 1];
            o.innerHTML = n <= 255 ? '<p class="tool__hint">Octet : ' + w.map(function (x, i) { var on = bs.slice(-8)[i] === '1'; return '<span class="' + (on ? 'bit-on' : 'bit-off') + '">' + x + '</span>'; }).join(' ') +
                ' → ' + (w.filter(function (x, i) { return bs.slice(-8)[i] === '1'; }).join(' + ') || '0') + ' = <b>' + n + '</b></p>' : '';
        }
        d.input.addEventListener('input', function () { upd('d'); }); b.input.addEventListener('input', function () { upd('b'); }); h.input.addEventListener('input', function () { upd('h'); });
        upd('d');
    };

    /* ── Testeur d'expressions régulières ── */
    TOOLS.regex = function (box) {
        head(box, 'Testeur', 'Expressions régulières (grep, sed)', 'Un motif et quelques lignes de texte : les lignes qui correspondent ressortent, comme avec <code>grep -E</code>. Le moteur est celui du navigateur, proche des regex étendues.');
        var row = el('div', 'tool__row');
        var p = field('Motif', { value: '^(Failed|Invalid) .* from ([0-9.]+)', 'class': 'tool__input tool__input--wide' });
        var ci = el('label', 'chmod__sp'), c = el('input'); c.type = 'checkbox'; ci.appendChild(c); ci.appendChild(el('span', null, '<b>-i</b> ignorer la casse'));
        row.appendChild(p.wrap); row.appendChild(ci); box.appendChild(row);
        var t = el('textarea', 'tool__input tool__area');
        t.value = 'Failed password for root from 203.0.113.9 port 51022 ssh2\nAccepted publickey for marc from 192.0.2.14 port 50111 ssh2\nInvalid user admin from 198.51.100.77 port 40022\nServer listening on 0.0.0.0 port 22.';
        t.setAttribute('aria-label', 'Texte à tester'); t.spellcheck = false;
        box.appendChild(t);
        var o = out(); box.appendChild(o);
        function show() {
            var re;
            try { re = new RegExp(p.input.value, c.checked ? 'gi' : 'g'); p.input.classList.remove('is-ko'); }
            catch (e) { p.input.classList.add('is-ko'); o.innerHTML = '<p class="tool__note">⚠️ Motif invalide : ' + esc(e.message) + '</p>'; return; }
            var lines = t.value.split('\n'), hit = 0;
            var html = lines.map(function (l) {
                re.lastIndex = 0;
                if (!p.input.value || !re.test(l)) return '<div class="rx__line">' + esc(l) + '</div>';
                hit++; re.lastIndex = 0;
                var h = '', last = 0, m, guard = 0;
                while ((m = re.exec(l)) && guard++ < 200) {
                    h += esc(l.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
                    last = m.index + m[0].length;
                    if (!m[0].length) re.lastIndex++;
                }
                return '<div class="rx__line is-hit">' + h + esc(l.slice(last)) + '</div>';
            }).join('');
            o.innerHTML = '<p class="tool__mono">' + hit + ' ligne' + (hit > 1 ? 's' : '') + ' sur ' + lines.length + ' — comme <code>grep -E' + (c.checked ? 'i' : '') + ' \'' + esc(p.input.value) + '\'</code></p><div class="rx">' + html + '</div>' +
                '<p class="tool__hint">Rappels : <code>^</code> début de ligne, <code>$</code> fin, <code>.</code> un caractère, <code>*</code> zéro ou plus, <code>+</code> un ou plus, <code>[0-9]</code> un chiffre, <code>( | )</code> alternative. Sans <code>-E</code>, grep demande <code>\\+</code> et <code>\\|</code>.</p>';
        }
        p.input.addEventListener('input', show); t.addEventListener('input', show); c.addEventListener('change', show); show();
    };

    document.querySelectorAll('.tool[data-tool]').forEach(function (box) {
        var fn = TOOLS[box.getAttribute('data-tool')];
        if (!fn || box.getAttribute('data-ready')) return;
        box.innerHTML = '';
        box.setAttribute('data-ready', '1');
        fn(box);
    });
    window.ATELIER = { cron: TOOLS._cron, ip: TOOLS._ip };
})();
