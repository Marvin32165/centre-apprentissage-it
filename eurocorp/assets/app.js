/* EUROCORP — comportement du site : navigation, thème, onglets, copie de code,
   et rendu des tableaux depuis window.EURO (assets/data.js, généré). */
(function () {
  'use strict';
  var D = window.EURO || { vms: [], sites: [], flux: [], dns: [], tunnels: [], plages_lan: [], etat: [], planning: [], meta: {} };

  var PAGES = [
    ['index.html', 'Accueil'],
    ['infrastructure.html', 'Infrastructure'],
    ['preparer.html', '1 · Préparer'],
    ['reseau.html', '2 · Réseau'],
    ['identite.html', '3 · Identité'],
    ['services.html', '4 · Services'],
    ['docker.html', '5 · Docker'],
    ['exploitation.html', '6 · Exploitation'],
    ['compose.html', 'Outil Compose'],
    ['outils.html', 'Autres outils'],
    ['avancement.html', 'Avancement']
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var ST = { afaire: 'à faire', encours: 'en cours', fait: 'fait' };
  var SITE = {}; D.sites.forEach(function (s) { SITE[s.id] = s; });

  /* --- thème -------------------------------------------------------------- */
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  try { applyTheme(localStorage.getItem('eurocorp.theme')); } catch (e) { /* stockage indisponible */ }

  function pageExists(f) { return !window.EURO_PAGES || window.EURO_PAGES.indexOf(f) >= 0; }
  /* Cartes ou liens marqués data-page : désactivés tant que la page n'existe pas. */
  function gatePages() {
    $$('[data-page]').forEach(function (el) {
      if (pageExists(el.getAttribute('data-page'))) return;
      el.removeAttribute('href'); el.classList.add('soon'); el.setAttribute('aria-disabled', 'true');
      el.insertAdjacentHTML('beforeend', ' <span class="badge b-afaire">à venir</span>');
    });
  }


  /* --- « Je suis l'hôte de… » : Général ou un des 4 sites ---------------------- */
  var CLE_MOI = 'euro.moi';
  function moi() { try { return localStorage.getItem(CLE_MOI) || ''; } catch (e) { return ''; } }
  function moiSite() { var m = moi(); return D.sites.filter(function (s) { return s.id === m; })[0] || null; }
  function moiSelect() {
    var h = '<option value="">Général : toutes les machines</option>' + D.sites.map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === moi() ? ' selected' : '') + '>Hôte de ' + esc(s.nom) + '</option>'; }).join('');
    return '<label class="moi"><span class="sr">Je suis</span><select id="moi" aria-label="Je suis l\'hôte de">' + h + '</select></label>';
  }
  function moiBandeau() {
    var st = moiSite(), main = $('#contenu'); if (!main) return;
    var b = document.createElement('div'); b.className = 'note moi-bandeau';
    if (!st) { b.innerHTML = '<b>Vue générale</b> : les ' + D.vms.filter(function (v) { return !v.virtuel; }).length + ' machines des 4 sites. Choisis ton hôte dans le menu en haut pour ne voir que ton site.'; main.insertBefore(b, main.firstChild); return; }
    var vms = D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }), ram = vms.reduce(function (a, v) { return a + (+v.ram || 0); }, 0);
    var tun = st.id === 'BRU' ? 'Hub : 3 tunnels IPsec (Paris, Londres, Berlin)' : 'Spoke : 1 tunnel IPsec vers Bruxelles';
    b.innerHTML = '<b>Tu es l\'hôte de ' + esc(st.nom) + '</b> · hôte ' + esc(st.hote) + ' · WAN ' + esc(st.wan) + ' · LAN ' + esc(st.lan) + ' (passerelle ' + esc(st.gw) + ') · ' + tun + '.<br>' +
      vms.length + ' VM à héberger : ' + vms.map(function (v) { return esc(v.nom); }).join(', ') +
      '. <a href="infrastructure.html#' + st.id.toLowerCase() + '">Voir mon site</a>. Tes cases cochées sont celles de cet hôte.';
    main.insertBefore(b, main.firstChild);
  }
  function moiSurligne() {
    var st = moiSite(); if (!st) return;
    $$('main tbody tr').forEach(function (tr) { var td = tr.firstElementChild; if (td && td.textContent.trim().indexOf(st.id + '-') === 0) tr.classList.add('moi-ligne'); });
  }

  /* --- navigation et pied de page ---------------------------------------- */
  function buildNav() {
    var host = $('#nav'); if (!host) return;
    var here = location.pathname.split('/').pop() || 'index.html';
    var links = PAGES.map(function (p) {
      if (!pageExists(p[0])) return '<span class="soon" title="Page à venir">' + p[1] + '</span>';
      return '<a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '>' + p[1] + '</a>';
    }).join('');
    host.outerHTML = '<a class="skip" href="#contenu">Aller au contenu</a><header class="nav"><div class="nav-in">' +
      '<a class="brand" href="index.html">EURO<b>CORP</b> · labo</a><nav class="nav-links" aria-label="Pages">' + links + '</nav>' +
      moiSelect() + '<button class="theme" type="button" id="theme">Thème</button></div></header>';
    $('#moi').addEventListener('change', function () { try { localStorage.setItem(CLE_MOI, this.value); } catch (e) { /* ignoré */ } location.reload(); });
    $('#theme').addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark'; applyTheme(next);
      try { localStorage.setItem('eurocorp.theme', next); } catch (e) { /* ignoré */ }
    });
  }
  function buildFooter() {
    var f = $('#pied'); if (!f) return;
    f.outerHTML = '<footer>Labo final EUROCORP — groupe ' + esc(D.meta.groupe || '') + ' · domaine ' + esc(D.meta.domaine || '') +
      ' · données du ' + esc(D.meta.maj || '') + '. Site autonome, rien à installer. ' +
      'Les fichiers <code>.env</code> du labo sont versionnés : valeurs jetables, propres à ce projet.</footer>';
  }

  /* --- onglets ------------------------------------------------------------ */
  function initTabs() {
    $$('[data-tabs]').forEach(function (box) {
      var tabs = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
      function show(id, push) {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('aria-controls') === id)); });
        panels.forEach(function (p) { p.hidden = p.id !== id; });
        if (push) { try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignoré */ } }
      }
      tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('aria-controls'), true); }); });
      var h = location.hash.slice(1);
      var v = moiSite(), mien = v && panels.filter(function (p) { return p.id === v.id.toLowerCase(); })[0];
      show(panels.some(function (p) { return p.id === h; }) ? h : (mien ? mien.id : panels[0].id), false);
    });
  }

  /* --- copie de code ------------------------------------------------------ */
  function initCopy() {
    $$('.code').forEach(function (c) {
      var b = $('.copy', c); if (!b) return;
      b.addEventListener('click', function () {
        var txt = $('pre', c).innerText;
        var done = function () { b.textContent = 'Copié'; setTimeout(function () { b.textContent = 'Copier'; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { });
      });
    });
  }

  /* --- rendu des données --------------------------------------------------- */
  function table(head, rows, foot) {
    return '<div class="tw"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (r._mono && r._mono.indexOf(i) >= 0 ? ' class="mono"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody>' + (foot || '') + '</table></div>';
  }
  function badge(st) { return '<span class="badge b-' + st + '">' + ST[st] + '</span>'; }
  function mono(cells, idx) { cells._mono = idx; return cells; }

  function renderVMs(el) {
    var site = el.getAttribute('data-vms');
    var list = D.vms.filter(function (v) { return !v.virtuel && (site === 'all' || v.site === site); });
    var showSite = site === 'all';
    var head = ['VM'].concat(showSite ? ['Site'] : []).concat(['Rôle', 'IP', 'OS', 'vCPU', 'RAM', 'Disque', 'Mémoire', 'État']);
    var rows = list.map(function (v) {
      var r = [esc(v.nom)].concat(showSite ? [v.site] : []).concat([esc(v.role) + (v.replica ? ' <span class="badge b-cdc">Replica ' + esc(v.replica) + '</span>' : ''), esc(v.ip), esc(v.os), v.vcpu, v.ram + ' Go', v.disque + ' Go', v.mem, badge(v.statut)]);
      return mono(r, [showSite ? 3 : 2]);
    });
    var sum = function (k) { return list.reduce(function (a, v) { return a + v[k]; }, 0); };
    var span = head.length - 5 - (showSite ? 0 : 0);
    var foot = '<tfoot><tr><td colspan="' + (head.length - 5) + '">Total (' + list.length + ' VM)</td><td>' + sum('vcpu') + '</td><td>' + sum('ram') + ' Go</td><td>' + sum('disque') + ' Go max</td><td colspan="2"></td></tr></tfoot>';
    var note = site === 'all' ? '' : '<p class="src">Hôte : 64 Go de RAM et ~1 To, à titre indicatif (toutes les VM ne sont pas allumées en même temps). Disques dynamiques : « max » = taille maximale, pas l\'espace réellement pris.</p>';
    el.innerHTML = table(head, rows, foot) + note;
  }
  function renderSites(el) {
    el.innerHTML = table(['Site', 'Rôle', 'WAN OPNsense', 'LAN', 'Passerelle', 'Hôte Hyper-V'],
      D.sites.map(function (s) { return mono([esc(s.nom), esc(s.role), s.wan, s.lan, s.gw, s.hote], [2, 3, 4, 5]); }));
  }
  function renderTunnels(el) {
    el.innerHTML = table(['Tunnel', 'Réseau de transit', 'Côté hub (BRU)', 'Côté spoke'],
      D.tunnels.map(function (t) { return mono([t.id, t.reseau, t.hub, t.spoke], [1, 2, 3]); }));
  }
  function renderPlages(el) {
    el.innerHTML = table(['Plage (dernier octet)', 'Usage'], D.plages_lan.map(function (p) { return mono([p.plage, esc(p.usage)], [0]); }));
  }
  function renderDNS(el) {
    el.innerHTML = table(['Nom', 'Type', 'Cible', 'Pour'], D.dns.map(function (r) { return mono([esc(r.nom), r.type, esc(r.cible), esc(r.pour)], [0, 2]); }));
  }
  function renderFlux(el) {
    var groupes = []; D.flux.forEach(function (f) { if (groupes.indexOf(f.groupe) < 0) groupes.push(f.groupe); });
    var active = 'Tous';
    var bar = '<div class="filters" role="group" aria-label="Filtrer par famille">' +
      ['Tous'].concat(groupes).map(function (g) { return '<button type="button" class="chip" aria-pressed="' + (g === 'Tous') + '" data-g="' + esc(g) + '">' + esc(g) + '</button>'; }).join('') + '</div>';
    var box = document.createElement('div');
    function draw() {
      var rows = D.flux.filter(function (f) { return active === 'Tous' || f.groupe === active; }).map(function (f) {
        return mono([f.id, esc(f.de), esc(f.vers), esc(f.proto), esc(f.service), esc(f.pourquoi)], [0, 3]);
      });
      box.innerHTML = table(['ID', 'De', 'Vers', 'Ports', 'Service', 'Pourquoi'], rows);
    }
    el.innerHTML = bar; el.appendChild(box); draw();
    $$('.chip', el).forEach(function (b) {
      b.addEventListener('click', function () {
        active = b.getAttribute('data-g');
        $$('.chip', el).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        draw();
      });
    });
  }
  function renderEtat(el) {
    var filtre = el.getAttribute('data-etat');
    var l = D.etat.filter(function (e) { return !filtre || filtre.split(',').indexOf(e.cle) >= 0; });
    el.innerHTML = '<div class="prog">' + l.map(function (e) {
      return '<div><b>' + esc(e.nom) + '</b>' + badge(e.statut) + (e.note ? '<p>' + esc(e.note) + '</p>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function renderPlanning(el) {
    var etat = {}; D.etat.forEach(function (e) { etat[e.cle] = e.statut; });
    el.innerHTML = table(['Jour', 'Objectif', 'État'], D.planning.map(function (p) {
      var sts = p.cles.map(function (c) { return etat[c]; }).filter(Boolean);
      var st = sts.length && sts.every(function (s) { return s === 'fait'; }) ? 'fait' : (sts.some(function (s) { return s !== 'afaire'; }) ? 'encours' : 'afaire');
      return ['J' + p.j, esc(p.titre), badge(st)];
    }));
  }
  function renderStats(el) {
    var vms = D.vms.filter(function (v) { return !v.virtuel; });
    var sum = function (k) { return vms.reduce(function (a, v) { return a + v[k]; }, 0); };
    var map = { vm: vms.length, ram: sum('ram') + ' Go', vcpu: sum('vcpu'), flux: D.flux.length };
    el.textContent = map[el.getAttribute('data-stat')];
  }


  /* --- schémas SVG générés depuis les données ----------------------------- */
  var svgCount = 0;
  function wrapText(s, n) {
    var words = String(s || '').split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > n && cur) { lines.push(cur); cur = w; } else { cur = (cur + ' ' + w).trim(); }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function tspans(x, y, lines, lh) {
    return lines.map(function (l, i) { return '<tspan x="' + x + '" y="' + (y + i * lh) + '">' + esc(l) + '</tspan>'; }).join('');
  }
  function svgOpen(w, h, label) {
    var id = 'ah' + (++svgCount);
    return { id: id, open: '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '"><defs><marker id="' + id +
      '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ahp" d="M0 0L10 5L0 10z"/></marker></defs>' };
  }

  /* Flux linéaire : data-flow='{"label":"…","nodes":[{"t":"Titre","s":"sous-titre","c":"hub|ok|wn"}],"edges":["étiquette",…]}' */
  function renderFlow(el) {
    var cfg; try { cfg = JSON.parse(el.getAttribute('data-flow')); } catch (e) { return; }
    var nodes = cfg.nodes, edges = cfg.edges || [], n = nodes.length, W = 760, pad = 6, gap = n > 4 ? 40 : 54;
    var bw = (W - 2 * pad - gap * (n - 1)) / n, maxH = 0;
    var meta = nodes.map(function (nd) {
      var tl = wrapText(nd.t, Math.floor(bw / 7.4)), sl = wrapText(nd.s, Math.floor(bw / 6.1));
      var h = 18 + tl.length * 16 + (sl.length ? 6 + sl.length * 14 : 0) + 8; if (h > maxH) maxH = h; return { tl: tl, sl: sl };
    });
    var H = maxH + 26, y0 = 18, o = svgOpen(W, H + y0, cfg.label || 'Schéma'), out = o.open;
    nodes.forEach(function (nd, i) {
      var x = pad + i * (bw + gap), m = meta[i];
      out += '<rect class="' + (nd.c || 'box') + '" x="' + x + '" y="' + y0 + '" width="' + bw + '" height="' + maxH + '" rx="5"/>';
      out += '<text class="t" text-anchor="middle">' + tspans(x + bw / 2, y0 + 22, m.tl, 16) + '</text>';
      if (m.sl.length) out += '<text class="s" text-anchor="middle">' + tspans(x + bw / 2, y0 + 22 + m.tl.length * 16 + 4, m.sl, 14) + '</text>';
      if (i < n - 1) {
        var ax = x + bw, ay = y0 + maxH / 2;
        out += '<line class="arrow" x1="' + (ax + 3) + '" y1="' + ay + '" x2="' + (ax + gap - 3) + '" y2="' + ay + '" marker-end="url(#' + o.id + ')"/>';
        if (edges[i]) out += '<text class="xs" text-anchor="middle">' + tspans(ax + gap / 2, ay - 8, wrapText(edges[i], 9), 11) + '</text>';
      }
    });
    el.innerHTML = out + '</svg>';
  }

  /* Vue globale : réseau de salle, 4 OPNsense, tunnels IPsec depuis le hub */
  function renderGlobal(el) {
    var W = 760, bw = 160, gap = (W - 12 - 4 * bw) / 3, y0 = 78, bh = 92;
    var o = svgOpen(W, 280, 'Quatre sites reliés par le réseau de salle ; tunnels IPsec depuis Bruxelles'), out = o.open;
    out += '<rect class="box" x="6" y="8" width="' + (W - 12) + '" height="34" rx="5"/><text class="t" x="' + (W / 2) + '" y="30" text-anchor="middle">Réseau de salle (WAN commun) ' + esc(D.meta.reseau_salle || '') + '</text>';
    var xs = D.sites.map(function (s, i) { return 6 + i * (bw + gap); });
    D.sites.forEach(function (s, i) {
      var x = xs[i], hub = s.id === 'BRU';
      out += '<line class="ln" x1="' + (x + bw / 2) + '" y1="42" x2="' + (x + bw / 2) + '" y2="' + y0 + '"/>';
      out += '<text class="xs" x="' + (x + bw / 2 + 6) + '" y="62">WAN ' + esc(s.wan) + '</text>';
      out += '<rect class="' + (hub ? 'hub' : 'box') + '" x="' + x + '" y="' + y0 + '" width="' + bw + '" height="' + bh + '" rx="5"/>';
      out += '<text class="t" x="' + (x + bw / 2) + '" y="' + (y0 + 22) + '" text-anchor="middle">' + esc(s.nom) + (hub ? ' · hub' : '') + '</text>';
      out += '<text class="s" x="' + (x + bw / 2) + '" y="' + (y0 + 42) + '" text-anchor="middle">OPNsense ' + esc(s.id) + '-FW01</text>';
      out += '<text class="s" x="' + (x + bw / 2) + '" y="' + (y0 + 60) + '" text-anchor="middle">LAN ' + esc(s.lan) + '</text>';
      var n = D.vms.filter(function (v) { return v.site === s.id && !v.virtuel; }).length;
      out += '<text class="xs" x="' + (x + bw / 2) + '" y="' + (y0 + 78) + '" text-anchor="middle">' + n + ' VM · 1 hôte Hyper-V</text>';
    });
    var hubX = xs[0] + bw / 2, hs = [44, 74, 104];
    D.tunnels.forEach(function (t, k) {
      var tx2 = xs[k + 1] + bw / 2, by = y0 + bh, midx = (hubX + tx2) / 2;
      out += '<path class="vpn" d="M' + hubX + ' ' + by + ' Q' + midx + ' ' + (by + hs[k] * 2) + ' ' + tx2 + ' ' + by + '"/>';
      out += '<text class="xs" x="' + midx + '" y="' + (by + hs[k] + 12) + '" text-anchor="middle">IPsec ' + esc(t.id) + ' · ' + esc(t.reseau) + '</text>';
    });
    el.innerHTML = out + '</svg>';
  }

  /* Un site : pare-feu, bus LAN, VM en grille */
  function renderSite(el) {
    var id = el.getAttribute('data-svg').split(':')[1], s = SITE[id]; if (!s) return;
    var vms = D.vms.filter(function (v) { return v.site === id && !v.virtuel && v.nom !== id + '-FW01'; });
    var W = 760, cols = 3, bw = 238, gap = (W - 12 - cols * bw) / (cols - 1), bh = 62, rows = Math.ceil(vms.length / cols);
    var top = 100, H = top + 56 + rows * (bh + 14) + 8;
    var o = svgOpen(W, H, 'Réseau du site ' + s.nom), out = o.open;
    out += '<rect class="box" x="6" y="8" width="170" height="30" rx="5"/><text class="s" x="91" y="27" text-anchor="middle">WAN ' + esc(s.wan) + '</text>';
    out += '<line class="ln" x1="176" y1="23" x2="226" y2="23"/>';
    out += '<rect class="' + (id === 'BRU' ? 'hub' : 'box') + '" x="226" y="4" width="220" height="40" rx="5"/>';
    out += '<text class="t" x="336" y="21" text-anchor="middle">' + esc(id) + '-FW01 · OPNsense</text><text class="xs" x="336" y="36" text-anchor="middle">passerelle ' + esc(s.gw) + '</text>';
    if (id !== 'BRU') out += '<path class="vpn" d="M446 24 L560 24"/><text class="xs" x="660" y="28" text-anchor="middle">tunnel IPsec vers Bruxelles</text>';
    else out += '<text class="xs" x="560" y="28" text-anchor="middle">hub : 3 tunnels IPsec (PAR, LON, BER)</text>';
    out += '<line class="ln" x1="336" y1="44" x2="336" y2="' + (top - 8) + '"/>';
    out += '<line class="ln" x1="6" y1="' + (top - 8) + '" x2="' + (W - 6) + '" y2="' + (top - 8) + '" style="stroke-width:3"/>';
    out += '<text class="xs" x="8" y="' + (top - 14) + '">LAN ' + esc(s.lan) + '</text>';
    vms.forEach(function (v, i) {
      var c = i % cols, r = Math.floor(i / cols), x = 6 + c * (bw + gap), y = top + 8 + r * (bh + 14);
      var cls = v.statut === 'fait' ? 'ok' : (v.statut === 'encours' ? 'wn' : 'box');
      out += '<line class="ln" x1="' + (x + bw / 2) + '" y1="' + (top - 8) + '" x2="' + (x + bw / 2) + '" y2="' + y + '"/>';
      out += '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="5"/>';
      out += '<text class="t" x="' + (x + 10) + '" y="' + (y + 20) + '">' + esc(v.nom) + '</text>';
      var role = wrapText(v.role.replace(/ \(VM actuelle.*\)/, ''), 36).slice(0, 2);
      out += '<text class="s">' + tspans(x + 10, y + 36, role, 13) + '</text>';
      out += '<text class="xs" x="' + (x + 10) + '" y="' + (y + bh - 5) + '">' + esc(v.ip) + ' · ' + v.vcpu + ' vCPU · ' + v.ram + ' Go</text>';
    });
    var ly = top + 8 + rows * (bh + 14) + 8;
    out += '<rect class="box" x="6" y="' + (ly - 4) + '" width="12" height="12"/><text class="xs" x="24" y="' + (ly + 6) + '">à faire</text>';
    out += '<rect class="wn" x="84" y="' + (ly - 4) + '" width="12" height="12"/><text class="xs" x="102" y="' + (ly + 6) + '">en cours</text>';
    out += '<rect class="ok" x="170" y="' + (ly - 4) + '" width="12" height="12"/><text class="xs" x="188" y="' + (ly + 6) + '">fait</text>';
    el.innerHTML = out + '</svg>';
  }
  function renderSvgs() {
    $$('[data-svg]').forEach(function (el) { var k = el.getAttribute('data-svg'); if (k === 'global') renderGlobal(el); else if (k.indexOf('site:') === 0) renderSite(el); });
    $$('[data-flow]').forEach(renderFlow);
  }

  function render() {
    renderSvgs();
    $$('[data-vms]').forEach(renderVMs);
    $$('[data-render="sites"]').forEach(renderSites);
    $$('[data-render="tunnels"]').forEach(renderTunnels);
    $$('[data-render="plages"]').forEach(renderPlages);
    $$('[data-render="dns"]').forEach(renderDNS);
    $$('[data-render="flux"]').forEach(renderFlux);
    $$('[data-etat]').forEach(renderEtat);
    $$('[data-render="planning"]').forEach(renderPlanning);
    $$('[data-stat]').forEach(renderStats);
  }


  /* --- suivi : cases à cocher mémorisées dans le navigateur ---------------- */
  var CLE = 'euro.suivi.v1';
  function lire() { try { return JSON.parse(localStorage.getItem(CLE)) || { ok: {}, tot: {} }; } catch (e) { return { ok: {}, tot: {} }; } }
  function ecrire(d) { try { localStorage.setItem(CLE, JSON.stringify(d)); return true; } catch (e) { return false; } }
  function pageNom() { return (location.pathname.split('/').pop() || 'index.html'); }
  function initSuivi() {
    var items = $$('main ol > li'), page = pageNom(), d = lire();
    if (items.length) { d.tot[page] = items.length; ecrire(d); }
    items.forEach(function (li, i) {
      var id = (moi() ? moi() + '|' : '') + page + '#' + i, cb = document.createElement('input');
      cb.type = 'checkbox'; cb.className = 'suivi'; cb.checked = !!d.ok[id];
      cb.setAttribute('aria-label', 'Étape faite');
      li.classList.toggle('fait', cb.checked);
      cb.addEventListener('change', function () {
        var x = lire(); if (cb.checked) x.ok[id] = 1; else delete x.ok[id];
        ecrire(x); li.classList.toggle('fait', cb.checked);
      });
      li.insertBefore(cb, li.firstChild);
    });
    $$('[data-suivi]').forEach(renderSuivi);
  }
  function renderSuivi(el) {
    var d = lire(), noms = {};
    PAGES.forEach(function (p) { noms[p[0]] = p[1]; });
    var rows = Object.keys(d.tot).filter(function (p) { return noms[p]; }).map(function (p) {
      var pre = moi() ? moi() + '|' : '', n = Object.keys(d.ok).filter(function (k) { return k.split('#')[0] === pre + p; }).length, t = d.tot[p];
      return '<tr><td><a href="' + p + '">' + esc(noms[p]) + '</a></td><td>' + n + ' / ' + t + '</td><td><progress max="' + t + '" value="' + n + '"></progress></td></tr>';
    });
    el.innerHTML = (rows.length ? '<div class="tw"><table><thead><tr><th>Page</th><th>Étapes cochées</th><th></th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>'
      : '<p>Rien de coché pour l\'instant. Ouvre une page et coche les étapes faites : elles sont mémorisées dans ce navigateur.</p>') +
      '<p class="note">La mémoire est propre à ce navigateur et à cette adresse. Pour la passer à un autre poste : Exporter, puis Importer.</p>' +
      '<p><button class="btn ghost" type="button" data-a="exp">Exporter</button> <button class="btn ghost" type="button" data-a="imp">Importer</button> <button class="btn ghost" type="button" data-a="rst">Tout décocher</button></p><textarea hidden spellcheck="false" aria-label="Données de suivi"></textarea>';
    var ta = $('textarea', el);
    el.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      if (a === 'exp') { ta.hidden = false; ta.value = JSON.stringify(lire()); ta.select(); }
      if (a === 'imp') {
        if (ta.hidden || !ta.value) { ta.hidden = false; ta.value = ''; ta.placeholder = 'Colle ici les données exportées puis clique de nouveau sur Importer'; return; }
        try { var o = JSON.parse(ta.value); if (o && o.ok && o.tot) { ecrire(o); renderSuivi(el); } } catch (x) { ta.value = 'Données invalides.'; }
      }
      if (a === 'rst') { var x = lire(); x.ok = {}; ecrire(x); location.reload(); }
    });
  }
  window.EURO_MOI = function () { return moiSite(); };
  document.addEventListener('DOMContentLoaded', function () {
    buildNav(); buildFooter(); render(); gatePages(); initTabs(); initCopy(); initSuivi(); moiBandeau(); moiSurligne();
  });
})();
