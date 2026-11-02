/* EUROCORP — comportement du site : navigation, thème, onglets, copie de code,
   et rendu des tableaux depuis window.EURO (assets/data.js, généré). */
(function () {
  'use strict';
  var D = window.EURO || { vms: [], sites: [], flux: [], dns: [], tunnels: [], plages_lan: [], etat: [], planning: [], meta: {} };

  var PAGES = [
    ['index.html', 'Accueil'],
    ['infrastructure.html', 'Infrastructure'],
    ['inventaire.html', 'Inventaire'],
    ['marche.html', 'Ma marche à suivre'],
    ['preparer.html', '1 · Préparer'],
    ['reseau.html', '2 · Réseau'],
    ['identite.html', '3 · Identité'],
    ['services.html', '4 · Services'],
    ['docker.html', '5 · Docker'],
    ['exploitation.html', '6 · Exploitation'],
    ['compose.html', 'Outil Compose'],
    ['scripts.html', 'Scripts'],
    ['outils.html', 'Autres outils'],
    ['recette.html', 'Recette'],
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
  function moi() {
    var m = ''; try { m = localStorage.getItem('euro.machine') || ''; } catch (e) { /* ignoré */ }
    if (!m) return '';
    if (/^HOTE-/.test(m)) return m.slice(5);
    var v = D.vms.filter(function (x) { return x.nom === m; })[0]; return v ? v.site : '';
  }
  function pfx(page) { if (page === 'marche.html') return ''; var m = ''; try { m = localStorage.getItem('euro.machine') || ''; } catch (e) { /* ignoré */ } return m ? m + '|' : ''; }
  function moiSite() { var m = moi(); return D.sites.filter(function (s) { return s.id === m; })[0] || null; }
  function moiSelect() {
    var h = '<option value="">Général : toutes les machines</option>' + D.sites.map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === moi() ? ' selected' : '') + '>Hôte de ' + esc(s.nom) + '</option>'; }).join('');
    return '<label class="moi"><span class="sr">Je suis</span><select id="moi" aria-label="Je suis l\'hôte de">' + h + '</select></label>';
  }
  function moiBandeau() {
    var st = moiSite(), main = $('#contenu'); if (!main) return;
    var b = document.createElement('div'); b.className = 'note moi-bandeau';
    if (!st) return;                                 // vue générale : rien à annoncer
    if (machine() && window.EURO_MACH && (window.EURO_MACH.PAGE_SECTIONS[pageNom()] || pageNom() === 'marche.html')) return;   // ces pages ont déjà leur bandeau
    var vms = D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }), ram = vms.reduce(function (a, v) { return a + (+v.ram || 0); }, 0);
    var tun = st.id === 'BRU' ? 'Hub : 3 tunnels IPsec (Paris, Londres, Berlin)' : 'Spoke : 1 tunnel IPsec vers Bruxelles';
    b.innerHTML = '<b>Site de la machine choisie : ' + esc(st.nom) + '</b>Hôte ' + esc(st.hote) + ' · WAN ' + esc(st.wan) + ' · LAN ' + esc(st.lan) + ' (passerelle ' + esc(st.gw) + ') · ' + tun + '.<br>' +
      vms.length + ' VM à héberger : ' + vms.map(function (v) { return esc(v.nom); }).join(', ') +
      '. <a href="infrastructure.html#' + st.id.toLowerCase() + '">Voir mon site</a>. Tes cases cochées sont propres à la machine choisie.';
    main.insertBefore(b, main.firstChild);
  }
  function moiSurligne() {
    var st = moiSite(); if (!st) return;
    $$('main tbody tr').forEach(function (tr) { var td = tr.firstElementChild; if (td && td.textContent.trim().indexOf(st.id + '-') === 0) tr.classList.add('moi-ligne'); });
  }


  /* --- machines : quelles rubriques et quelles étapes la concernent -------- */
  window.EURO_MACH = (function () {
  var T_VM = 'Créer les VM Windows depuis le parent';
  var SQL_ONLY = ['Le gMSA du moteur SQL', 'Sur PAR-SQL01 : prendre en compte le groupe', 'Disques de SQL', 'Dimensionnement', 'Installer SQL Server (instance nommée)', 'Écran critique : le classement (collation)', 'Comptes de service du moteur', 'Protocole et port', 'Pare-feu', 'Mémoire et parallélisme', 'Les services SQL tournent sous le gMSA', 'Classement correct'];
  var SP_ONLY = ['Comptes de service', 'Dimensionnement', 'Installer SharePoint sur PAR-SP01', 'Assistant de configuration de la ferme', 'Comptes gérés et applications de service', 'DNS et premier site', 'SQL accessible depuis SharePoint', 'SharePoint répond'];
  var AC_ONLY = ["Installer l'autorité de certification d'abord"];
  var SUP_WIN = ['Superviser avec Zabbix (agents Windows)', 'Détection avec Wazuh et Sysmon'];
  /* section commune Docker : rédigée avec l'exemple Zabbix (BRU-DOCKER01), elle suit la machine choisie */
  var T_DOCKER = 'Docker et Compose : les bases du labo', SANS_LIVRABLE = { skip: ['Copier les fichiers du livrable'] };
  var DOSSIER = { redmine: ['/opt/redmine', 'redmine'], wazuh: ['/opt/wazuh', 'wazuh'], greenbone: ['~/greenbone-community-edition', 'greenbone'] };
  function docker(t, h, v, k) {
    var d = DOSSIER[k]; if (t !== T_DOCKER || !d) return h;
    return h.replace(/sudo mkdir -p \/opt\/zabbix-lab/g, (d[0].charAt(0) === '~' ? '' : 'sudo ') + 'mkdir -p ' + d[0]).replace(/\/opt\/zabbix-lab/g, d[0])
      .replace(/05-Docker\/zabbix/g, '05-Docker/' + d[1]).replace(/172\.17\.10\.40(?![0-9])/g, v.ip);
  }
  function sectionsPour(v, k) {
    var n = v.nom, o = [];
    function add(t, opt) { o.push({ t: t, only: opt && opt.only, skip: opt && opt.skip, subst: opt && opt.subst }); }
    var win = /Windows Server/.test(v.os);
    if (k === 'fw') { add('Une VM OPNsense par site'); add('Les tunnels IPsec'); add('Les routes et le DNS à travers les tunnels'); add('Le filtrage : remplacer « tout autorisé »'); }
    else if (k === 'dc') {
      if (n === 'BRU-DC01') { add('La forêt et le premier contrôleur (BRU-DC01)'); add('Messagerie : Exchange Server et autorité de certification (BRU-EXCH01)', { only: AC_ONLY }); add('DHCP avec failover'); add("Unités d'organisation, groupes AGDLP et comptes"); }
      else { add('Les autres contrôleurs et les sites AD'); add('DHCP avec failover'); }
    }
    else if (k === 'iis') add('IIS et équilibrage de charge NLB (BRU-IIS01 / 02)', n === 'BRU-IIS02' ? { skip: ['Créer le cluster NLB', 'Contenu identique sur les deux nœuds'] } : null);
    else if (k === 'exch') add('Messagerie : Exchange Server et autorité de certification (BRU-EXCH01)', { skip: AC_ONLY });
    else if (k === 'fs') { add('Serveur de fichiers (LON-FS01)'); add("Réplication Hyper-V et reprise d'activité"); }
    else if (k === 'sql') add('SQL Server et SharePoint (PAR-SQL01 / PAR-SP01)', { only: SQL_ONLY });
    else if (k === 'sp') add('SQL Server et SharePoint (PAR-SQL01 / PAR-SP01)', { only: SP_ONLY });
    else if (k === 'zabbix') { add(T_DOCKER); add('Zabbix 7.4 (BRU-DOCKER01)'); }
    else if (k === 'redmine') { add(T_DOCKER); add('Redmine (LON-DOCKER01)'); add('Sauvegarde de Redmine'); }
    else if (k === 'wazuh') { add(T_DOCKER, SANS_LIVRABLE); add('Wazuh (BER-DOCKER01)'); }
    else if (k === 'greenbone') { add(T_DOCKER, SANS_LIVRABLE); add('Greenbone Community (BER-DOCKER02)'); }
    else if (k === 'clt') add("Recette : tester l'ensemble");
    if (win && k !== 'fw' && k !== 'clt') SUP_WIN.forEach(function (t) { add(t, { subst: true }); });
    return o;
  }
  function cle(v) {
    var n = v.nom;
    if (/-FW01$/.test(n)) return 'fw'; if (/-DC01$/.test(n)) return 'dc'; if (/-IIS0/.test(n)) return 'iis'; if (/EXCH/.test(n)) return 'exch';
    if (/SQL/.test(n)) return 'sql'; if (/-SP0/.test(n)) return 'sp'; if (/-FS0/.test(n)) return 'fs'; if (n === 'BRU-DOCKER01') return 'zabbix';
    if (n === 'LON-DOCKER01') return 'redmine'; if (n === 'BER-DOCKER01') return 'wazuh'; if (n === 'BER-DOCKER02') return 'greenbone'; if (/-CLT01$/.test(n)) return 'clt'; return '';
  }

  /* ---------- détail pas à pas propre à chaque machine ---------- */
    var PAGE_SECTIONS = {
      'preparer.html': ['Les commutateurs virtuels', "L'image parent (sysprep)", 'Généraliser avec Sysprep et ranger le parent', 'Créer les VM Windows depuis le parent', 'Créer les VM Linux (Docker)', 'Ordre de travail du jour'],
      'reseau.html': ['Une VM OPNsense par site', 'Les tunnels IPsec', 'Les routes et le DNS à travers les tunnels', 'Le filtrage : remplacer « tout autorisé »'],
      'identite.html': ['La forêt et le premier contrôleur (BRU-DC01)', 'Les autres contrôleurs et les sites AD', 'DHCP avec failover', "Unités d'organisation, groupes AGDLP et comptes"],
      'services.html': ['Serveur de fichiers (LON-FS01)', 'IIS et équilibrage de charge NLB (BRU-IIS01 / 02)', 'Messagerie : Exchange Server et autorité de certification (BRU-EXCH01)', 'SQL Server et SharePoint (PAR-SQL01 / PAR-SP01)'],
      'docker.html': ['Docker et Compose : les bases du labo', 'Zabbix 7.4 (BRU-DOCKER01)', 'Redmine (LON-DOCKER01)', 'Wazuh (BER-DOCKER01)', 'Greenbone Community (BER-DOCKER02)'],
      'exploitation.html': ['Superviser avec Zabbix (agents Windows)', 'Sauvegarde de Redmine', 'Détection avec Wazuh et Sysmon', "Réplication Hyper-V et reprise d'activité", "Recette : tester l'ensemble"]
    };
    var HOTE_SEC = ['Les commutateurs virtuels', "L'image parent (sysprep)", 'Généraliser avec Sysprep et ranger le parent'];
    return { cle: cle, sectionsPour: sectionsPour, docker: docker, PAGE_SECTIONS: PAGE_SECTIONS, HOTE_SEC: HOTE_SEC };
  })();


  /* --- « Machine » : les pages 1 à 6 ne montrent que ce qui la concerne ---------- */
  var CLE_MACH = 'euro.machine';
  function machine() { try { return localStorage.getItem(CLE_MACH) || ''; } catch (e) { return ''; } }
  function machineSelect() {
    var cur = machine(), h = '<option value="">Toutes les machines</option>' + D.sites.map(function (st) {
      return '<optgroup label="' + esc(st.nom) + '"><option value="HOTE-' + st.id + '"' + (cur === 'HOTE-' + st.id ? ' selected' : '') + '>Hôte de ' + esc(st.nom) + ' (' + D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }).length + ' machines)</option>' +
        D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }).map(function (v) {
          return '<option value="' + esc(v.nom) + '"' + (cur === v.nom ? ' selected' : '') + '>' + esc(v.nom) + '</option>'; }).join('') + '</optgroup>'; }).join('');
    return '<label class="moi mach"><span class="sr">Machine</span><select id="machine-h" aria-label="Machine">' + h + '</select></label>';
  }
  /* une page 1 à 6 est-elle utile à la machine choisie ? (sinon absente du menu) */
  function pageUtile(page) {
    var m = machine(), K = window.EURO_MACH; if (!m || !K || !K.PAGE_SECTIONS[page]) return true;
    var hote = /^HOTE-/.test(m), cibles = hote ? D.vms.filter(function (x) { return !x.virtuel && x.site === m.slice(5); }) : D.vms.filter(function (x) { return x.nom === m; });
    if (!cibles.length) return true;
    if (hote && page === 'preparer.html') return true;
    var ok = false;
    cibles.forEach(function (c) {
      K.sectionsPour(c, K.cle(c)).forEach(function (o) { if (K.PAGE_SECTIONS[page].indexOf(o.t) >= 0) ok = true; });
      if (page === 'preparer.html') ok = true;
    });
    return ok;
  }
  /* phrase d'introduction propre à une machine, pour chaque rubrique des pages 1 à 6 */
  function introMachine(t, v, st, k) {
    var n = '<b>' + esc(v.nom) + '</b>', ip = '<code>' + esc(v.ip || 'IP à définir') + '</code>', res = vm => D.vms.filter(x => x.nom === vm)[0] || {}, bru = D.sites.filter(x => x.id === 'BRU')[0] || {};
    var taille = esc(v.vcpu) + ' vCPU, ' + esc(v.ram) + ' Go, disque ' + esc(v.disque) + ' Go, mémoire statique';
    var autreDC = D.vms.filter(x => /-DC01$/.test(x.nom) && x.nom !== v.nom)[0] || {};
    var noms = D.vms.filter(x => !x.virtuel && x.site === st.id).map(x => x.nom), nf = D.flux.filter(f => noms.some(m => (f.de + ' ' + f.vers).indexOf(m) >= 0)).length;
    var T = {
      'Les commutateurs virtuels': k === 'fw' ? n + ' a deux cartes : le commutateur externe <code>WAN</code> (' + esc(st.wan) + ') et le commutateur privé de ' + esc(st.nom) + ' (LAN ' + esc(st.lan) + ', passerelle ' + ip + ').' : n + ' (' + ip + ') se branche seulement sur le commutateur privé de ' + esc(st.nom) + ' et sort par ' + esc(st.id) + '-FW01 (<code>' + esc(st.gw) + '</code>).',
      "L'image parent (sysprep)": n + ' (' + esc(v.os) + ') sera un clone de ce parent : ce que tu règles ici, elle l\'aura ; son nom, son IP et le domaine se règlent après le clonage.',
      'Généraliser avec Sysprep et ranger le parent': 'Fait une seule fois sur l\'hôte de ' + esc(st.nom) + ' : ' + n + ' ne passe pas par Sysprep, elle en hérite.',
      'Créer les VM Windows depuis le parent': n + ' : ' + ip + ', ' + taille + '. Disque différentiel sur le parent de l\'hôte ' + esc(st.hote) + '.',
      'Créer les VM Linux (Docker)': n + ' : Ubuntu depuis l\'ISO, ' + ip + ', ' + taille + '.',
      'Ordre de travail du jour': 'Pour ' + n + ' : le commutateur et le pare-feu de ' + esc(st.nom) + ' d\'abord, puis ce que demande son rôle (' + esc(v.role) + ').',
      'Une VM OPNsense par site': n + ' est le pare-feu de ' + esc(st.nom) + ' (' + esc(st.role) + ') : WAN <code>' + esc(st.wan) + '</code>, LAN ' + ip + ' sur ' + esc(st.lan) + ', ' + esc(v.vcpu) + ' vCPU, ' + esc(v.ram) + ' Go.',
      'Les tunnels IPsec': st.id === 'BRU' ? n + ' est le <b>hub</b> : il monte les 3 tunnels (Paris, Londres, Berlin).' : n + ' monte <b>un seul tunnel</b>, vers Bruxelles (WAN <code>' + esc(bru.wan) + '</code>), depuis son WAN <code>' + esc(st.wan) + '</code>.',
      'Les routes et le DNS à travers les tunnels': 'Depuis ' + esc(st.nom) + ' (' + esc(st.lan) + ') : routes vers les trois autres LAN par le tunnel, et DNS vers ' + esc(res('BRU-DC01').ip) + ' puis ' + esc(res('PAR-DC01').ip) + '.',
      'Le filtrage : remplacer « tout autorisé »': 'Pour ' + esc(st.nom) + ' : ' + nf + ' des ' + D.flux.length + ' flux de la matrice touchent les machines de ce site (' + noms.join(', ') + ').',
      'La forêt et le premier contrôleur (BRU-DC01)': n + ' (' + ip + ') crée la forêt <code>' + esc(D.meta.domaine) + '</code> et le DNS : c\'est le seul contrôleur où l\'on crée la forêt.',
      'Les autres contrôleurs et les sites AD': v.nom === 'PAR-DC01' ? n + ' (Paris, ' + ip + ') est le <b>deuxième contrôleur</b> : il rejoint <code>' + esc(D.meta.domaine) + '</code> par le tunnel de Paris, puis est promu à côté de <code>BRU-DC01</code>. Londres et Berlin n\'ont pas de contrôleur ; tu crées ensuite les quatre sites AD.' : n + ' (Bruxelles, ' + ip + ') est le <b>premier contrôleur</b>, déjà en place : il te reste à ajouter <code>PAR-DC01</code> pour la réplication, puis à créer les quatre sites AD.',
      'DHCP avec failover': n + ' (' + ip + ') sert l\'étendue de ' + esc(st.nom) + ' et, en secours, celle de ' + esc((D.sites.filter(x => x.id === autreDC.site)[0] || {}).nom) + ', en failover avec <b>' + esc(autreDC.nom) + '</b> (<code>' + esc(autreDC.ip) + '</code>).',
      "Unités d'organisation, groupes AGDLP et comptes": 'Créés depuis ' + n + ' ; ils valent pour tout le domaine, pas seulement pour ' + esc(st.nom) + '.',
      'Serveur de fichiers (LON-FS01)': n + ' (' + ip + ') héberge à ' + esc(st.nom) + ' les partages Direction, RH, Finance, IT et Commun ; ' + (v.replica ? 'réplica vers ' + esc(v.replica.replace(/^→\s*/, '')) + '.' : 'sans réplica.'),
      'IIS et équilibrage de charge NLB (BRU-IIS01 / 02)': n + ' (' + ip + ') est le <b>nœud ' + (/02$/.test(v.nom) ? '2' : '1') + '</b> de l\'intranet, derrière l\'adresse virtuelle <code>' + esc(((D.dns.filter(x => x.nom === 'intranet')[0] || {}).cible || '').replace(/\s*\(.*$/, '')) + '</code>.' + (/02$/.test(v.nom) ? ' Le cluster est créé depuis le nœud 1 : ici tu rejoins seulement.' : ''),
      'Messagerie : Exchange Server et autorité de certification (BRU-EXCH01)': k === 'dc' ? n + ' (' + ip + ') porte l\'autorité de certification (AD CS) dont Exchange utilisera les certificats.' : n + ' (' + ip + ', ' + esc(v.ram) + ' Go) héberge Exchange ; ses certificats viennent de l\'autorité sur BRU-DC01.',
      'SQL Server et SharePoint (PAR-SQL01 / PAR-SP01)': k === 'sql' ? n + ' (' + ip + ', ' + esc(v.ram) + ' Go) héberge le moteur SQL, base de SharePoint (<code>' + esc(res('PAR-SP01').ip) + '</code>).' : n + ' (' + ip + ', ' + esc(v.ram) + ' Go) héberge la ferme SharePoint ; sa base est sur PAR-SQL01 (<code>' + esc(res('PAR-SQL01').ip) + '</code>).',
      'Docker et Compose : les bases du labo': n + ' (' + ip + ', ' + esc(v.ram) + ' Go) : Docker et Compose d\'abord, puis son application (' + esc(v.role) + ').',
      'Zabbix 7.4 (BRU-DOCKER01)': n + ' héberge le <b>serveur</b> Zabbix : tous les agents du labo l\'appellent sur ' + ip + ', port 10051.',
      'Redmine (LON-DOCKER01)': n + ' (Londres, ' + ip + ') héberge le helpdesk ; ses comptes viennent de l\'AD par LDAP (' + esc(res('BRU-DC01').ip) + ').',
      'Wazuh (BER-DOCKER01)': n + ' (Berlin, ' + ip + ') héberge le <b>manager</b> Wazuh : les agents des autres machines lui envoient leurs journaux.',
      'Greenbone Community (BER-DOCKER02)': n + ' (Berlin, ' + ip + ') héberge le scanner : ses cibles sont les autres machines du labo.',
      'Superviser avec Zabbix (agents Windows)': n + ' (' + esc(v.os) + ') installe l\'agent 2 et envoie ses mesures à BRU-DOCKER01 (<code>' + esc(res('BRU-DOCKER01').ip) + '</code>).',
      'Sauvegarde de Redmine': n + ' porte les données à sauvegarder : base MariaDB et volume des pièces jointes.',
      'Détection avec Wazuh et Sysmon': n + ' : agent Wazuh vers BER-DOCKER01 (<code>' + esc(res('BER-DOCKER01').ip) + '</code>)' + (/Windows/.test(v.os) ? ', plus Sysmon.' : '.'),
      "Réplication Hyper-V et reprise d'activité": v.replica ? n + ' (' + esc(st.nom) + ') est répliquée vers ' + esc(v.replica.replace(/^→\s*/, '')) + '.' : n + ' n\'est pas répliquée dans le plan ; seule LON-FS01 l\'est.',
      "Recette : tester l'ensemble": k === 'clt' ? n + ' (' + ip + ') est le poste client de ' + esc(st.nom) + ' : les tests se jouent depuis lui.' : 'Pour ' + n + ' : les tests qui touchent ' + esc(v.role) + '.'
    };
    return T[t] || 'Cette partie concerne ' + n + ' (' + esc(v.role) + ', ' + ip + ').';
  }
  function titreSection(h2) { var c = h2.cloneNode(true), n = c.querySelector('.num'); if (n) n.remove(); return c.textContent.trim(); }
  function machineFiltre() {
    var m = machine(), page = pageNom(), K = window.EURO_MACH; if (!m || !K || !K.PAGE_SECTIONS[page]) return;
    var main = $('main'); if (!main) return;
    var hote = /^HOTE-/.test(m), v = hote ? null : D.vms.filter(function (x) { return x.nom === m; })[0];
    if (!hote && !v) return;
    var st = hote ? D.sites.filter(function (s) { return s.id === m.slice(5); })[0] : D.sites.filter(function (s) { return s.id === v.site; })[0];
    var sel = {};
    function ajoute(o) { if (K.PAGE_SECTIONS[page].indexOf(o.t) < 0) return; (sel[o.t] = sel[o.t] || []).push(o); }
    var cibles = hote ? D.vms.filter(function (x) { return !x.virtuel && x.site === st.id; }) : [v];
    if (hote && page === 'preparer.html') K.HOTE_SEC.forEach(function (t) { ajoute({ t: t, m: 'hôte' }); });
    cibles.forEach(function (c) {
      K.sectionsPour(c, K.cle(c)).forEach(function (o) { o.m = c.nom; ajoute(o); });
      if (page === 'preparer.html') ajoute({ t: /OPNsense/.test(c.os) ? 'Les commutateurs virtuels' : /Ubuntu|Debian|Linux/.test(c.os) ? 'Créer les VM Linux (Docker)' : 'Créer les VM Windows depuis le parent', m: c.nom });
    });
    var titres = $$('main h2[id^="s"]'), nbVisibles = 0;
    function masque(x) { x.hidden = true; x.setAttribute('data-masque', '1'); }
    titres.forEach(function (h2) {
      var os = sel[titreSection(h2)], grp = [h2], e = h2.nextElementSibling, o = os ? { subst: os.some(function (x) { return x.subst; }), filtre: !os.some(function (x) { return !x.only && !x.skip; }), liste: os } : null;
      while (e && e.tagName !== 'H2') { grp.push(e); e = e.nextElementSibling; }
      if (!o) { grp.forEach(masque); return; }
      nbVisibles++;
      if (o.filtre) {
        grp.forEach(function (x) {
          if (x.tagName !== 'OL') return;
          Array.prototype.forEach.call(x.children, function (li) {
            var b = li.querySelector(':scope > b'), t = b ? b.textContent.trim() : '';
            var permis = o.liste.some(function (c) { return !((c.only && c.only.indexOf(t) < 0) || (c.skip && c.skip.indexOf(t) >= 0)); });
            if (!permis) masque(li);
          });
          if (!Array.prototype.some.call(x.children, function (li) { return !li.hidden; })) { masque(x); if (x.previousElementSibling && x.previousElementSibling.classList.contains('ph')) masque(x.previousElementSibling); }
        });
      }
      function remplace(re, fn) {
        grp.forEach(function (x) {
          var w = document.createTreeWalker(x, NodeFilter.SHOW_TEXT, null), n, L = [];
          while ((n = w.nextNode())) if (re.test(n.nodeValue)) L.push(n);
          L.forEach(function (n) { n.nodeValue = fn(n.nodeValue); });
        });
      }
      if (!hote && o.subst) remplace(/BRU-DC01|172\.17\.10\.10/, function (t) { return t.replace(/BRU-DC01/g, v.nom).replace(/172\.17\.10\.10(?![0-9])/g, v.ip); });
      if (!hote) remplace(/zabbix-lab|05-Docker\/zabbix|172\.17\.10\.40/, function (t) { return K.docker(titreSection(h2), t, v, K.cle(v)); });
      remplace(/LAN-BRU/, function (t) { return t.replace(/LAN-BRU/g, 'LAN-' + st.id); });
    });
    /* numéros de section continus sur ce qui reste affiché */
    titres.filter(function (h) { return !h.hidden; }).forEach(function (h, i) { var n = h.querySelector('.num'); if (n) n.textContent = String(i + 1); });
    /* une phrase « Pour <machine> » en tête de chaque rubrique + titre sans la liste des autres machines */
    titres.forEach(function (h2) {
      if (h2.hidden) return;
      var t = titreSection(h2), os = sel[t] || [], txt;
      if (hote) {
        var ms = []; os.forEach(function (o) { if (o.m && ms.indexOf(o.m) < 0) ms.push(o.m); });
        txt = 'Sur <b>l\'hôte de ' + esc(st.nom) + '</b> (' + esc(st.hote) + ') : cette partie concerne ' + (ms.length ? ms.map(function (m) { return m === 'hôte' ? 'l\'hôte lui-même' : '<b>' + esc(m) + '</b>'; }).join(', ') : 'tout le site') + '.';
      } else { txt = introMachine(t, v, st, K.cle(v)); var tn = Array.prototype.filter.call(h2.childNodes, function (n) { return n.nodeType === 3; }).pop(); if (tn) tn.nodeValue = tn.nodeValue.replace(/\s*\([^)]*\)\s*$/, '') + ' (' + v.nom + ')'; }
      var pm = document.createElement('p'); pm.className = 'pour-moi'; pm.setAttribute('data-masque', '1'); pm.innerHTML = txt; h2.parentNode.insertBefore(pm, h2.nextSibling);
    });
    var vis = titres.filter(function (h) { return !h.hidden; }).map(function (h) { return titreSection(h).replace(/\s*\([^)]*\)\s*$/, ''); });
    var h1 = $('main h1'), lead = $('main p.lead');
    if (!hote && v) vis = vis.map(function (t) { var k = K.cle(v); return t === 'SQL Server et SharePoint' ? (k === 'sql' ? 'SQL Server' : k === 'sp' ? 'SharePoint' : t) : t; });
    if (vis.length && h1) h1.textContent = vis.join(' · ');
    if (lead) lead.innerHTML = vis.length ? (hote ? 'Ce que tu fais sur l\'hôte de <b>' + esc(st.nom) + '</b> (' + esc(st.hote) + ') pour ses ' + cibles.length + ' machines : ' + cibles.map(function (c) { return esc(c.nom); }).join(', ') + '.' : 'Ce que tu fais sur <b>' + esc(v.nom) + '</b> (' + esc(v.role) + ', <code>' + esc(v.ip) + '</code>) : seulement ce qui la concerne sur cette page.') : lead.innerHTML;
    $$('main .note.bref').forEach(function (x) { x.hidden = true; x.setAttribute('data-masque', '1'); });
    var somm = $('.somm'); if (somm) { somm.hidden = true; somm.setAttribute('data-masque', '1'); }
    var nom = hote ? 'l\'hôte de ' + esc(st.nom) : esc(v.nom), b = document.createElement('div'); b.className = 'note moi-bandeau';
    b.innerHTML = nbVisibles ? '<b>Vue de ' + nom + '</b> : seules les parties de cette page qui concernent cette machine sont affichées (' + nbVisibles + ' sur ' + titres.length + '). Choisis « Toutes les machines » en haut à gauche pour tout voir.'
      : '<b>Rien pour ' + nom + ' sur cette page.</b> Elle ne la concerne pas : ouvre « Ma marche à suivre » pour toute sa marche, ou choisis « Toutes les machines » pour tout voir.';
    main.insertBefore(b, main.firstChild);
  }

  /* --- navigation et pied de page ---------------------------------------- */
  /* Barre : la marche, deux menus (Guide, Outils) et les pages communes ; une ligne sur écran large,
     un bouton « Menu » sur téléphone. */
  var GUIDE = ['preparer.html', 'reseau.html', 'identite.html', 'services.html', 'docker.html', 'exploitation.html', 'infrastructure.html'];
  var OUTILS_P = ['compose.html', 'scripts.html', 'outils.html'];
  function buildNav() {
    var host = $('#nav'); if (!host) return;
    var here = location.pathname.split('/').pop() || 'index.html', nom = {};
    PAGES.forEach(function (p) { nom[p[0]] = p[1]; });
    function lien(f, court) {
      if (f !== here && !pageUtile(f)) return '';
      if (!pageExists(f)) return '<span class="soon" title="Page à venir">' + nom[f] + '</span>';
      return '<a href="' + f + '"' + (f === here ? ' aria-current="page"' : '') + '>' + (court || nom[f]) + '</a>';
    }
    function menu(titre, L) {
      var h = L.map(function (f) { return lien(f); }).join(''); if (!h) return '';
      var ici = L.indexOf(here) >= 0;
      return '<details class="dd' + (ici ? ' ici' : '') + '"><summary' + (ici ? ' title="Page ouverte : ' + esc(nom[here]) + '"' : '') + '>' + titre + '</summary><div class="dd-m">' + h + '</div></details>';
    }
    var liens = lien('marche.html', 'Ma marche') + menu('Guide', GUIDE) + lien('inventaire.html') + lien('recette.html') + lien('avancement.html') + menu('Outils', OUTILS_P);
    host.outerHTML = '<a class="skip" href="#contenu">Aller au contenu</a><header class="nav"><div class="nav-in">' +
      '<a class="brand" href="index.html" title="Accueil">EURO<b>CORP</b> · labo</a>' +
      '<button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav-links">Menu</button>' +
      '<nav class="nav-links" id="nav-links" aria-label="Pages">' + liens + '</nav>' +
      '<div class="nav-d">' + machineSelect() + pastilleHtml() + '<button class="theme" type="button" id="theme" title="Thème clair ou sombre">Thème</button></div></div></header>';
    lierPanneau();
    $('#machine-h').addEventListener('change', function () { try { localStorage.setItem(CLE_MACH, this.value); } catch (e) { /* ignoré */ } location.reload(); });
    $('#theme').addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark'; applyTheme(next);
      try { localStorage.setItem('eurocorp.theme', next); } catch (e) { /* ignoré */ }
    });
    var mb = $('#menu-btn'), nl = $('#nav-links');
    mb.addEventListener('click', function () {
      var o = !nl.classList.contains('ouvert'); nl.classList.toggle('ouvert', o); mb.setAttribute('aria-expanded', String(o));
      $$('.dd', nl).forEach(function (d) { d.open = o; });
    });
    $$('.dd', nl).forEach(function (d) { d.addEventListener('toggle', function () { if (d.open && !nl.classList.contains('ouvert')) $$('.dd', nl).forEach(function (x) { if (x !== d) x.open = false; }); }); });
    document.addEventListener('click', function (e) { if (!nl.classList.contains('ouvert') && !e.target.closest('.dd')) $$('.dd', nl).forEach(function (x) { x.open = false; }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('.dd', nl).forEach(function (x) { x.open = false; }); });
  }
  function buildFooter() {
    var f = $('#pied'); if (!f) return;
    f.outerHTML = '<footer>Labo final EUROCORP — groupe ' + esc(D.meta.groupe || '') + ' · domaine ' + esc(D.meta.domaine || '') +
      ' · données du ' + esc(D.meta.maj || '') + '. Site autonome ; suivi commun quand il est servi par le serveur du labo (IIS ou nginx). ' +
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
      var r = [esc(v.nom)].concat(showSite ? [v.site] : []).concat([esc(v.role) + (v.replica ? ' <span class="badge b-cdc">Replica ' + esc(v.replica) + '</span>' : ''), esc(v.ip), esc(v.os), v.vcpu, v.ram + ' Go', v.disque + ' Go', v.mem, badge(v.statut) + (v.resp ? ' <small class="resp">' + esc(v.resp) + '</small>' : '')]);
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
    el.innerHTML = table(['Tunnel', 'Trafic chiffré (child)', 'WAN hub (BRU)', 'WAN spoke'],
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
    $$('[data-inventaire]').forEach(function (el) { renderInventaire(el); });
    $$('[data-recette]').forEach(function (el) { renderRecette(el); });
  }


  /* --- suivi : navigateur seul, ou commun sur le serveur du labo -----------------
     Trois modes, choisis tout seuls :
       local      pas de serveur de suivi (GitHub Pages, fichier ouvert tel quel) : cases gardées dans ce
                  navigateur, plus les étapes du suivi publié dans data/eurocorp.json (grisées) ;
       direct     site servi par IIS ou nginx avec api/suivi (serveur/README.md) : cases, état des rubriques,
                  machines et équipe sont partagés par tout le groupe, avec qui et quand ;
       horsligne  le serveur a déjà répondu mais ne répond plus : on travaille sur la dernière copie, les
                  changements attendent dans ce navigateur et partent tout seuls dès son retour. */
  var CLE = 'euro.suivi.v1';
  function lire() { try { return JSON.parse(localStorage.getItem(CLE)) || { ok: {}, tot: {} }; } catch (e) { return { ok: {}, tot: {} }; } }
  function ecrire(d) { try { localStorage.setItem(CLE, JSON.stringify(d)); return true; } catch (e) { return false; } }
  function pageNom() { return (location.pathname.split('/').pop() || 'index.html'); }
  /* Une étape est repérée par le début de son texte, pas par son numéro : ajouter une étape ne décale pas
     les cases communes. Même texte deux fois (« OK. ») : « OK. », « OK.#2 »… */
  function cleEtape(li) {
    var c = li.cloneNode(true);
    $$('ol, ul, .dt, .dtw, input, .code, .qui', c).forEach(function (x) { x.remove(); });
    $$('.iv', c).forEach(function (x) { x.textContent = x.getAttribute('data-p'); });   // inventaire : texte du plan
    return c.textContent.replace(/\s+/g, ' ').trim().slice(0, 80);
  }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ }
    return null;
  }
  function lsJson(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }

  var VIDE = function () { return { format: 2, version: 0, cases: {}, etat: {}, vms: {}, equipe: [], inv: {}, depots: [], journal: [], en_ligne: [] }; };
  var SY = { mode: 'local', url: '', ancien: false, S: null, V: null, attente: lsJson('euro.attente', []), envoi: false, minuterie: 0, sig: '', items: [], panneauVu: false };
  /* valeurs du dépôt, pour revenir en arrière sur un changement d'état ou de machine */
  var D0 = { etat: {}, vms: {} };
  D.etat.forEach(function (e) { D0.etat[e.cle] = { statut: e.statut, note: e.note || '' }; });
  D.vms.forEach(function (v) { D0.vms[v.nom] = { statut: v.statut, resp: v.resp || '', note: '' }; });

  function moiNom() { return ls('euro.qui') || ''; }
  function partage() { return SY.mode !== 'local'; }
  function candidats() {
    var base = (ls('euro.serveur') || '').trim();
    if (base) {
      if (!/^https?:\/\//i.test(base)) base = 'http://' + base;
      base = base.replace(/\/+$/, '') + '/';
      return [base + 'api/suivi', base + 'api/suivi.ashx'];
    }
    if (!/^https?:$/.test(location.protocol) || /github\.io$/.test(location.hostname)) return [];
    return ['api/suivi', 'api/suivi.ashx'];      // nginx ou IIS (handler), puis IIS par le fichier .ashx
  }
  function entetes() { var h = { 'Content-Type': 'application/json' }, k = ls('euro.cle'); if (k) h['X-Euro-Cle'] = k; return h; }
  function appel(url, opts, ms) {
    opts = opts || {};
    var ctl = window.AbortController ? new AbortController() : null, t = ctl ? setTimeout(function () { ctl.abort(); }, ms || 8000) : 0;
    if (ctl) opts.signal = ctl.signal;
    opts.cache = 'no-store';
    return fetch(url, opts).then(function (r) {
      clearTimeout(t);
      return r.text().then(function (txt) {
        var j = null; try { j = JSON.parse(txt); } catch (e) { /* pas du JSON */ }
        var err;
        if (!r.ok) { err = new Error((j && j.erreur) || ('HTTP ' + r.status)); err.status = r.status; throw err; }
        if (!j || typeof j !== 'object' || Array.isArray(j)) { err = new Error('réponse inattendue (pas le serveur du suivi)'); err.status = 0; throw err; }
        return j;
      });
    }, function () { clearTimeout(t); var err = new Error('serveur injoignable'); err.status = -1; throw err; });
  }
  /* ancien service du labo (avant ce serveur) : {page: {total, faits: [clés]}} */
  function depuisAncien(o) {
    var S = VIDE();
    Object.keys(o).forEach(function (p) {
      var s = o[p], f = {}; if (!/\.html$/.test(p) || !s) return;
      (s.faits || []).forEach(function (c) { f[c] = { par: '', le: '' }; });
      S.cases[p] = { total: s.total || 0, faits: f };
    });
    S.version = JSON.stringify(o).length;
    return S;
  }

  /* --- état affiché = dernier état du serveur + changements encore en attente --- */
  function maintenantIso() { return new Date().toISOString().slice(0, 19) + 'Z'; }
  function appliquerOp(V, op) {
    var le = maintenantIso();
    if (op.op === 'case') {
      var p = V.cases[op.page] = V.cases[op.page] || { total: 0, faits: {} };
      if (op.total) p.total = op.total;
      if (op.fait) { if (!p.faits[op.cle]) p.faits[op.cle] = { par: op.par, le: le, attente: true }; } else delete p.faits[op.cle];
    } else if (op.op === 'etat' || op.op === 'vm') {
      var T = op.op === 'etat' ? V.etat : V.vms, k = op.op === 'etat' ? op.cle : op.nom, x = {};
      Object.keys(T[k] || {}).forEach(function (c) { x[c] = T[k][c]; });
      ['statut', 'note', 'resp'].forEach(function (c) { if (op[c] != null) x[c] = op[c]; });
      x.par = op.par; x.le = le; x.attente = true; T[k] = x;
    } else if (op.op === 'equipe') V.equipe = op.noms.slice();
    else if (op.op === 'inv') {
      V.inv = V.inv || {}; var t = V.inv[op.cible] = V.inv[op.cible] || {};
      if (op.valeur == null) { delete t[op.champ]; if (!Object.keys(t).length) delete V.inv[op.cible]; }
      else t[op.champ] = { v: op.valeur, par: op.par, le: le, attente: true };
    } else if (op.op === 'depot') { V.depots = (V.depots || []).concat([op.id]); }
  }
  function recalc() {
    var S = SY.S || VIDE();
    if (!SY.attente.length) { SY.V = S; return; }
    var V = JSON.parse(JSON.stringify(S));
    SY.attente.forEach(function (op) { appliquerOp(V, op); });
    SY.V = V;
  }
  function fusionner() {           // les rendus existants lisent D : on y verse l'état commun
    var V = SY.V || VIDE();
    D.etat.forEach(function (e) {
      var l = V.etat[e.cle] || {}, b = D0.etat[e.cle] || {};
      e.statut = l.statut || b.statut; e.note = l.note != null ? l.note : b.note; e._par = l.par || ''; e._le = l.le || ''; e._att = !!l.attente;
    });
    D.vms.forEach(function (v) {
      var l = V.vms[v.nom] || {}, b = D0.vms[v.nom] || {};
      v.statut = l.statut || b.statut; v.resp = l.resp != null ? l.resp : b.resp; v.vnote = l.note || ''; v._par = l.par || ''; v._le = l.le || ''; v._att = !!l.attente;
    });
  }

  /* --- réception, envoi, sondage --------------------------------------------- */
  function recu(j) {
    if (j.inchange) { if (SY.S) SY.S.en_ligne = j.en_ligne || []; }
    else {
      var vieux = SY.S; SY.S = j; annoncer(vieux, j);
      try { localStorage.setItem('euro.cache', JSON.stringify({ url: SY.url, S: j })); } catch (e) { /* plein : tant pis pour la copie */ }
      reprendreDepot();
    }
    var etait = SY.mode;
    SY.mode = 'direct'; recalc(); majTout();
    if (etait === 'horsligne') SY.revenu = true;
    if (SY.revenu && !SY.attente.length) { SY.revenu = false; toast('Serveur du suivi de retour : tout est enregistré.', 'ok'); }
    if (!moiNom() && !SY.panneauVu) { SY.panneauVu = true; ouvrirPanneau('Suivi commun en direct : dis qui tu es, chaque case cochée portera ton nom.'); }
  }
  function horsLigne() {
    if (SY.mode === 'local') return;
    if (SY.mode === 'direct') toast('Serveur du suivi injoignable : tes changements attendent dans ce navigateur.', 'warn');
    SY.mode = 'horsligne'; majPastille();
  }
  function connecter() {
    var L = candidats(), i = 0;
    function essai() {
      if (i >= L.length) return Promise.resolve(false);
      var u = L[i++];
      return appel(u + '?qui=' + encodeURIComponent(moiNom()), {}, 5000).then(function (j) {
        SY.url = u; SY.ancien = j.format !== 2; recu(SY.ancien ? depuisAncien(j) : j); return true;
      }, function () { return essai(); });
    }
    return essai();
  }
  function sonder() {
    clearTimeout(SY.minuterie);
    if (!SY.url) { connecter().then(function (ok) { if (!ok) horsLigne(); else vider(); planifier(); }); return; }
    var q = '?qui=' + encodeURIComponent(moiNom()) + (SY.S && !SY.ancien ? '&depuis=' + SY.S.version : '');
    appel(SY.url + q, {}, 8000).then(function (j) { recu(SY.ancien ? depuisAncien(j) : j); vider(); }, horsLigne).then(planifier);
  }
  function planifier() {
    clearTimeout(SY.minuterie);
    if (SY.mode === 'local') return;
    SY.minuterie = setTimeout(sonder, document.hidden ? 30000 : (SY.mode === 'horsligne' ? 10000 : 5000));
  }
  function envoyer(ops) {
    var me = moiNom() || 'anonyme';
    ops.forEach(function (o) { o.par = o.par || me; SY.attente.push(o); });
    ls('euro.attente', JSON.stringify(SY.attente)); recalc(); majTout(); vider();
  }
  function retirerAttente(n) { SY.attente = SY.attente.slice(n); ls('euro.attente', JSON.stringify(SY.attente)); }
  function envoiAncien(lot) {
    var dernier = null, ch = Promise.resolve(), autres = 0;
    lot.forEach(function (op) {
      if (op.op !== 'case') { autres++; return; }
      ch = ch.then(function () {
        return appel(SY.url, { method: 'POST', headers: entetes(), body: JSON.stringify({ page: op.page, cle: op.cle, fait: op.fait, total: op.total }) }, 15000).then(function (j) { dernier = j; });
      });
    });
    if (autres) toast('Ancien serveur de suivi : l\'état et les machines ne sont pas partagés. Mets à jour le serveur (serveur/README.md).', 'warn');
    return ch.then(function () { return dernier ? depuisAncien(dernier) : SY.S; });
  }
  function vider() {
    if (SY.envoi || !SY.attente.length || !SY.url) return;
    SY.envoi = true;
    var lot = SY.attente.slice(0, 500);
    var p = SY.ancien ? envoiAncien(lot) : appel(SY.url, { method: 'POST', headers: entetes(), body: JSON.stringify({ par: moiNom() || undefined, ops: lot }) }, 20000);
    p.then(function (j) {
      SY.envoi = false; retirerAttente(lot.length); recu(j); if (SY.attente.length) vider();
    }, function (e) {
      SY.envoi = false;
      if (e.status === 401) {
        var k = window.prompt('Le serveur du suivi demande la clé du groupe :', ls('euro.cle') || '');
        if (k) { ls('euro.cle', k); vider(); } else horsLigne();
      } else if (e.status === 400 || e.status === 413) {
        retirerAttente(lot.length); recalc(); majTout(); toast('Changement refusé par le serveur : ' + esc(e.message), 'err');
      } else horsLigne();
    });
  }
  /* Suivi publié dans le dépôt (data/eurocorp.json) : versé sur le serveur une fois par version du dépôt
     (marqueur « depot »). Une case qu'un membre a décochée exprès (journal) n'est pas recochée. */
  function idDepot() { var t = JSON.stringify(D.suivi || {}), h = 5381; for (var i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; return 'd' + h.toString(16) + '-' + t.length; }
  function reprendreDepot() {
    if (SY.repris || SY.ancien || !SY.S) return;
    SY.repris = true;
    var id = idDepot(); if ((SY.S.depots || []).indexOf(id) >= 0) return;
    var decoches = {}, S = D.suivi || {}, ops = [];
    (SY.S.journal || []).forEach(function (e) { if (e.op === 'case') { if (e.fait) delete decoches[e.page + '|' + e.cle]; else decoches[e.page + '|' + e.cle] = 1; } });
    Object.keys(S).forEach(function (p) {
      var f = (SY.S.cases[p] || {}).faits || {};
      (S[p].faits || []).forEach(function (c) { if (!f[c] && !decoches[p + '|' + c]) ops.push({ op: 'case', page: p, cle: c, fait: true, total: S[p].total, par: 'reprise du dépôt' }); });
    });
    ops.push({ op: 'depot', id: id, par: 'reprise du dépôt' });
    envoyer(ops);
    if (ops.length > 1) toast((SY.S.version ? 'Nouvelles étapes faites publiées dans le dépôt : ' : 'Serveur neuf : ') + (ops.length - 1) + ' étape(s) reprise(s) du dépôt.', 'ok');
  }

  /* --- textes ------------------------------------------------------------------ */
  function dateDe(le) { var d = le ? new Date(le) : null; return d && !isNaN(d) ? d : null; }
  function quand(le) {
    var d = dateDe(le); if (!d) return '';
    var h = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return d.toDateString() === new Date().toDateString() ? h : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + ' ' + h;
  }
  function court(n) { n = String(n || ''); return n.length > 14 ? n.slice(0, 13) + '…' : n; }
  function coupe(t, n) { t = String(t || '').replace(/#\d+$/, ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function nomPage(p) { var x = PAGES.filter(function (q) { return q[0] === p; })[0]; return x ? x[1] : p; }
  function nomEtat(c) { var x = D.etat.filter(function (e) { return e.cle === c; })[0]; return x ? x.nom : c; }
  function decrire(e) {
    if (e.op === 'case') return (e.fait ? 'a coché' : 'a décoché') + ' « ' + esc(coupe(e.cle, 70)) + ' » <a href="' + esc(e.page) + '">' + esc(nomPage(e.page)) + '</a>';
    if (e.op === 'etat' && /^test-/.test(e.cle)) return 'test <a href="recette.html"><b>' + esc(e.cle.slice(5).toUpperCase()) + '</b></a> : ' + (e.statut ? { fait: '<span class="badge b-fait">OK</span>', encours: '<span class="badge b-encours">KO</span>', afaire: 'remis à faire' }[e.statut] : '') + (e.note != null ? (e.statut ? ', ' : '') + 'obtenu « ' + esc(coupe(e.note, 60)) + ' »' : '');
    if (e.op === 'etat') return 'a mis <b>' + esc(nomEtat(e.cle)) + '</b>' + (e.statut ? ' en <span class="badge b-' + esc(e.statut) + '">' + ST[e.statut] + '</span>' : '') + (e.note != null ? (e.statut ? ', note modifiée' : ' : note modifiée') : '');
    if (e.op === 'vm') {
      var t = [];
      if (e.statut) t.push('<span class="badge b-' + esc(e.statut) + '">' + ST[e.statut] + '</span>');
      if (e.resp != null) t.push(e.resp ? 'responsable ' + esc(e.resp) : 'sans responsable');
      if (e.note != null) t.push('note modifiée');
      return 'machine <b>' + esc(e.nom) + '</b> : ' + t.join(', ');
    }
    if (e.op === 'equipe') return 'a défini l\'équipe : ' + esc((e.noms || []).join(', ') || '(vide)');
    if (e.op === 'inv') {
      var it = itemPlan(e.cible), qui = it ? (e.cible.indexOf('site:') === 0 ? 'site ' + it.nom : it.nom) : e.cible, ch = (CH_VM.concat(CH_SITE).filter(function (c) { return c[0] === e.champ; })[0] || [0, e.champ])[1];
      return 'inventaire, <a href="inventaire.html" data-noinv><b>' + esc(qui) + '</b></a> · ' + esc(ch) + ' : ' + (e.avant != null ? '<span class="mono">' + esc(e.avant) + '</span> → ' : '') + (e.valeur != null ? '<span class="mono">' + esc(e.valeur) + '</span>' : 'retour au ' + (it && it.reel && it.reel[e.champ] != null ? 'relevé' : 'plan'));
    }
    if (e.op === 'depot') return 'suivi du dépôt repris';
    return esc(e.op);
  }
  function inverse(e) {
    if (e.op === 'case') return { op: 'case', page: e.page, cle: e.cle, fait: !e.fait };
    var a = e.avant || {}, o;
    if (e.op === 'etat') { o = { op: 'etat', cle: e.cle }; var b = D0.etat[e.cle] || { statut: 'afaire', note: '' }; if ('statut' in a) o.statut = a.statut || b.statut; if ('note' in a) o.note = a.note || ''; return o; }
    if (e.op === 'vm') { o = { op: 'vm', nom: e.nom }; var bv = D0.vms[e.nom] || {}; if ('statut' in a) o.statut = a.statut || bv.statut; if ('resp' in a) o.resp = a.resp || ''; if ('note' in a) o.note = a.note || ''; return o; }
    if (e.op === 'equipe') return { op: 'equipe', noms: a.noms || [] };
    if (e.op === 'inv') return { op: 'inv', cible: e.cible, champ: e.champ, valeur: e.avant == null ? null : e.avant };
    return null;
  }

  /* --- messages en bas d'écran ---------------------------------------------- */
  function toast(html, genre) {
    var box = $('#toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    while (box.children.length >= 4) box.removeChild(box.firstChild);
    var t = document.createElement('div'); t.className = 'toast ' + (genre || ''); t.innerHTML = html; box.appendChild(t);
    setTimeout(function () { t.classList.add('part'); setTimeout(function () { t.remove(); }, 400); }, genre === 'err' ? 9000 : 6000);
  }
  function annoncer(vieux, neuf) {
    if (!vieux || !neuf.journal) return;
    var me = moiNom(), par = {}, ordre = [];
    neuf.journal.forEach(function (e) {
      if (e.n <= vieux.version || e.par === me || e.par === 'reprise du dépôt') return;
      if (!par[e.par]) { par[e.par] = []; ordre.push(e.par); } par[e.par].push(e);
    });
    ordre.forEach(function (p) { var l = par[p]; toast('<b>' + esc(p) + '</b> ' + (l.length === 1 ? decrire(l[0]) : ': ' + l.length + ' changements (voir <a href="avancement.html#activite">l\'activité</a>)')); });
  }

  /* --- pastille « en direct » et panneau « qui es-tu » dans la barre ------------ */
  function pastilleHtml() {
    return '<div class="sync-w"><button type="button" class="sync" id="sync" aria-expanded="false" aria-controls="sync-panel"><span class="pt" aria-hidden="true"></span><span class="sync-t">Ce navigateur</span></button>' +
      '<div class="sync-panel" id="sync-panel" hidden></div></div>';
  }
  function majPastille() {
    var b = $('#sync'); if (!b) return;
    var n = SY.attente.length, me = moiNom(), V = SY.V || VIDE(), autres = (V.en_ligne || []).filter(function (x) { return x !== me; });
    var txt = { local: 'Ce navigateur', connexion: 'Connexion…', direct: me || 'Qui es-tu ?', horsligne: 'Hors ligne' }[SY.mode];
    if (SY.mode === 'direct' && autres.length) txt += ' · +' + autres.length;
    if (n && SY.mode !== 'local') txt += ' · ' + n + ' en attente';
    b.className = 'sync m-' + SY.mode + (SY.mode === 'direct' && !me ? ' m-anonyme' : '');
    $('.sync-t', b).textContent = txt;
    b.title = { local: 'Cases gardées dans ce navigateur seulement', connexion: 'Connexion au serveur du suivi…',
      direct: 'Suivi commun en direct' + (autres.length ? ' — aussi en ligne : ' + autres.join(', ') : ''),
      horsligne: 'Serveur du suivi injoignable : les changements partent dès son retour' }[SY.mode];
    var p = $('#sync-panel'); if (p && !p.hidden && !p.contains(document.activeElement)) remplirPanneau();
  }
  function remplirPanneau(msg) {
    var p = $('#sync-panel'); if (!p) return;
    var V = SY.V || VIDE(), me = moiNom(), noms = (V.equipe || []).slice();
    if (me && noms.indexOf(me) < 0) noms.push(me);
    var h = msg ? '<p class="sp-msg">' + msg + '</p>' : '';
    h += '<p class="sp-etat"><span class="pt m-' + SY.mode + '"></span> ' + ({
      local: 'Cases gardées <b>dans ce navigateur</b> : aucun serveur de suivi n\'a répondu. Sur le serveur du labo (IIS ou nginx), tout le groupe partage les mêmes cases.',
      connexion: 'Connexion au serveur du suivi…',
      direct: 'Suivi commun <b>en direct</b>' + (V.en_ligne && V.en_ligne.length ? ' · en ligne : ' + V.en_ligne.map(esc).join(', ') : '') + '.',
      horsligne: '<b>Hors ligne</b> : le serveur du suivi ne répond pas. Tu peux continuer, tes changements partent dès son retour.'
    }[SY.mode]) + '</p>';
    if (SY.attente.length && SY.mode !== 'local') h += '<p>' + SY.attente.length + ' changement(s) en attente. <button type="button" class="btn ghost petit" data-sp="reessai">Réessayer maintenant</button></p>';
    if (partage()) {
      h += '<fieldset class="sp-qui"><legend>Je suis</legend>' + noms.map(function (n) {
        return '<button type="button" class="chip" data-qui="' + esc(n) + '" aria-pressed="' + (n === me) + '">' + esc(n) + '</button>'; }).join('') +
        '<span class="sp-autre"><input id="sp-nom" maxlength="40" placeholder="' + (noms.length ? 'Autre prénom' : 'Ton prénom') + '" aria-label="Ton prénom"><button type="button" class="btn petit" data-sp="nom">OK</button></span></fieldset>';
      if (!(V.equipe || []).length) h += '<p class="src">L\'équipe n\'est pas encore définie : <a href="avancement.html#equipe">donne les prénoms du groupe</a>, ils apparaîtront ici.</p>';
    }
    h += '<details' + (SY.mode === 'local' && ls('euro.serveur') ? ' open' : '') + '><summary>Serveur du suivi</summary>' +
      '<label>Adresse <input id="sp-url" value="' + esc(ls('euro.serveur') || '') + '" placeholder="vide = celui qui sert ces pages" spellcheck="false"></label>' +
      '<label>Clé du groupe <input id="sp-cle" type="password" value="' + esc(ls('euro.cle') || '') + '" placeholder="si le serveur en demande une" autocomplete="off"></label>' +
      '<button type="button" class="btn petit" data-sp="serveur">Enregistrer et recharger</button>' +
      (SY.url ? '<p class="src">Connecté à <code>' + esc(SY.url) + '</code>' + (SY.ancien ? ' (ancien serveur : seules les cases sont partagées)' : '') + '.</p>' : '') +
      (location.protocol === 'https:' ? '<p class="src">Page en https : un serveur en http est bloqué par le navigateur. Ouvre plutôt le site depuis le serveur du labo.</p>' : '') +
      '</details>';
    p.innerHTML = h;
  }
  function ouvrirPanneau(msg) {
    setTimeout(function () {           // après le clic qui l'ouvre (sinon « clic dehors » le referme aussitôt)
      var p = $('#sync-panel'), b = $('#sync'); if (!p) return;
      remplirPanneau(msg); p.hidden = false; b.setAttribute('aria-expanded', 'true');
      var f = $('[data-qui][aria-pressed="false"], #sp-nom', p); if (f && msg) f.focus();
    }, 0);
  }
  function fermerPanneau() { var p = $('#sync-panel'), b = $('#sync'); if (p && !p.hidden) { p.hidden = true; b.setAttribute('aria-expanded', 'false'); } }
  function choisirNom(n) {
    n = String(n || '').trim().slice(0, 40); if (!n) return;
    ls('euro.qui', n); fermerPanneau(); majPastille(); toast('Tu es <b>' + esc(n) + '</b> : tes cases porteront ce nom.', 'ok');
    $$('[data-equipe]').forEach(function (el) { if (libre(el)) renderEquipe(el); }); sonder();
  }
  function lierPanneau() {
    var b = $('#sync'), p = $('#sync-panel'); if (!b) return;
    b.addEventListener('click', function () { if (p.hidden) ouvrirPanneau(); else fermerPanneau(); });
    document.addEventListener('click', function (e) { if (!p.hidden && !e.target.closest('.sync-w')) fermerPanneau(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !p.hidden) { fermerPanneau(); b.focus(); } });
    p.addEventListener('click', function (e) {
      var q = e.target.closest('[data-qui]'); if (q) { choisirNom(q.getAttribute('data-qui')); return; }
      var a = e.target.getAttribute('data-sp');
      if (a === 'nom') choisirNom($('#sp-nom').value);
      if (a === 'reessai') { if (SY.url) vider(); sonder(); }
      if (a === 'serveur') { ls('euro.serveur', $('#sp-url').value.trim() || null); ls('euro.cle', $('#sp-cle').value || null); ls('euro.cache', null); location.reload(); }
    });
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.id === 'sp-nom') choisirNom(e.target.value); });
  }

  /* --- cases à cocher --------------------------------------------------------- */
  function cocher(cb, page, cle, total) {
    if (!moiNom()) { cb.checked = !cb.checked; ouvrirPanneau('Choisis d\'abord qui tu es : la case portera ton nom.'); return; }
    envoyer([{ op: 'case', page: page, cle: cle, fait: cb.checked, total: total }]);
  }
  function majCases() {
    var p = ((SY.V || VIDE()).cases[pageNom()] || {}).faits || {};
    $$('main ol > li > input.suivi').forEach(function (cb) {
      var c = cb.dataset.cle; if (!c) return;
      var f = p[c], li = cb.parentNode, q = li.querySelector(':scope > .qui');
      cb.checked = !!f; li.classList.toggle('fait', !!f); li.classList.toggle('commun', !!f);
      if (f && f.par && f.le && f.par !== 'reprise du dépôt') {      // étapes reprises du dépôt : cochées, sans étiquette
        if (!q) { q = document.createElement('span'); q.className = 'qui'; cb.insertAdjacentElement('afterend', q); }
        q.textContent = court(f.par) + ' · ' + quand(f.le);
        q.title = 'Coché par ' + f.par + ' le ' + dateDe(f.le).toLocaleString('fr-BE') + (f.attente ? ' (pas encore enregistré sur le serveur)' : '');
        q.classList.toggle('att', !!f.attente);
      } else if (q) q.remove();
    });
    var mh = $('#marche'); if (mh) mh.dispatchEvent(new Event('change'));
    majBarre();
  }
  /* cases cochées dans ce navigateur avant le suivi commun : proposées une fois, page par page */
  function proposerMigration(page) {
    var d = lire(), faits = ((SY.V || VIDE()).cases[page] || {}).faits || {}, cles = [], ids = [];
    Object.keys(d.ok).forEach(function (id) {
      var m = id.match(/(?:^|\|)([^|#]+\.html)#(\d+)$/); if (!m || m[1] !== page) return;
      var c = SY.items[+m[2]]; ids.push(id);
      if (c && !faits[c] && cles.indexOf(c) < 0) cles.push(c);
    });
    if (!ids.length) return;
    if (!cles.length) { ids.forEach(function (id) { delete d.ok[id]; }); ecrire(d); return; }
    var main = $('#contenu'), b = document.createElement('div'); b.className = 'note warn migr';
    b.innerHTML = '<b>Cases de ce navigateur</b><p>' + cles.length + ' étape(s) de cette page sont cochées seulement ici (avant le suivi commun). ' +
      '<button type="button" class="btn petit" data-m="oui">Les ajouter au suivi commun</button> <button type="button" class="btn ghost petit" data-m="non">Les oublier</button></p>';
    main.insertBefore(b, main.firstChild);
    b.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-m'); if (!a) return;
      if (a === 'oui' && !moiNom()) { ouvrirPanneau('Choisis d\'abord qui tu es : les cases porteront ton nom.'); return; }
      if (a === 'oui') envoyer(cles.map(function (c) { return { op: 'case', page: page, cle: c, fait: true, total: SY.items.length }; }));
      var x = lire(); ids.forEach(function (id) { delete x.ok[id]; }); ecrire(x); b.remove();
    });
  }
  function initSuivi() {
    var items = $$('main ol > li'), page = pageNom(), d = lire(), vus = {};
    var com = ((D.suivi || {})[page] || {}).faits || [];
    if (items.length) { d.tot[page] = items.length; ecrire(d); }
    SY.items = items.map(function (li) { var c = cleEtape(li); vus[c] = (vus[c] || 0) + 1; return vus[c] > 1 ? c + '#' + vus[c] : c; });
    items.forEach(function (li, i) {
      var cle = SY.items[i];
      if (li.closest('[data-masque]')) return;
      var id = pfx(page) + page + '#' + i, cb = document.createElement('input');
      cb.type = 'checkbox'; cb.className = 'suivi'; cb.setAttribute('aria-label', 'Étape faite');
      li.insertBefore(cb, li.firstChild);
      if (partage()) { cb.dataset.cle = cle; cb.addEventListener('change', function () { cocher(cb, page, cle, items.length); }); return; }
      cb.checked = !!d.ok[id];
      if (com.indexOf(cle) >= 0) {
        cb.checked = true; cb.disabled = true; cb.title = 'Fait : suivi commun du groupe';
        li.classList.add('commun');
        if (d.ok[id]) { delete d.ok[id]; ecrire(d); }   // compté une seule fois, dans le suivi commun
      }
      li.classList.toggle('fait', cb.checked);
      cb.addEventListener('change', function () {
        var x = lire(); if (cb.checked) x.ok[id] = 1; else delete x.ok[id];
        ecrire(x); li.classList.toggle('fait', cb.checked);
      });
    });
    if (partage()) { majCases(); proposerMigration(page); }
    $$('[data-suivi]').forEach(renderSuivi);
    barreEtapes(); marcheParMachine();
  }
  function demarrerSuivi() {
    var L = candidats(), cache = lsJson('euro.cache', null);
    if (!L.length) { SY.mode = 'local'; SY.decide = true; initSuivi(); majPastille(); renderPartage(); return; }
    if (cache && cache.S) {            // déjà connu : on affiche la dernière copie tout de suite, puis on se connecte
      SY.S = cache.S; SY.mode = 'connexion'; recalc(); initSuivi(); majTout();
      connecter().then(function (ok) { if (!ok) horsLigne(); else vider(); planifier(); });
    } else {
      SY.mode = 'connexion'; majPastille();
      connecter().then(function (ok) {
        if (!ok) { SY.mode = 'local'; SY.decide = true; majInventaire(); initSuivi(); majPastille(); renderPartage(); return; }
        initSuivi(); majTout(); vider(); planifier();
      });
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden && partage()) sonder(); });
    window.addEventListener('online', function () { if (partage()) sonder(); });
    window.addEventListener('storage', function (e) {      // autre onglet du même navigateur
      if (e.key === 'euro.qui') majPastille();
      if (e.key === 'euro.attente') { SY.attente = lsJson('euro.attente', []); recalc(); majTout(); }
    });
  }
  function majTout() {
    majPastille();
    if (!partage()) return;
    var V = SY.V || VIDE(), sig = V.version + ':' + SY.attente.length + ':' + JSON.stringify(SY.attente).length;
    if (sig !== SY.sig) { SY.sig = sig; majCases(); fusionner(); majInventaire(); renderPartage(); }
    else $$('[data-equipe]').forEach(function (el) { if (libre(el)) renderEquipe(el); });   // seule la présence a pu changer
  }

  /* --- rendus du suivi commun -------------------------------------------------- */
  function libre(el) { return !el.contains(document.activeElement) || document.activeElement === document.body; }
  function renderPartage() {
    $$('[data-etat]').forEach(function (el) { if (libre(el)) renderEtat(el); });
    $$('[data-render="planning"]').forEach(renderPlanning);
    $$('[data-vms]').forEach(renderVMs);
    $$('[data-svg^="site:"]').forEach(renderSite);
    $$('[data-suivi]').forEach(renderSuivi);
    $$('[data-equipe]').forEach(function (el) { if (libre(el)) renderEquipe(el); });
    $$('[data-journal]').forEach(renderJournal);
    $$('[data-machines]').forEach(function (el) { if (libre(el)) renderMachines(el); });
    renderInventaire();
    renderRecette();
    renderReprendre();
  }
  function meta(par, le, att) {
    if (!par) return '';
    return '<small class="meta">' + (att ? 'en attente · ' : '') + esc(par) + (le ? ' · ' + quand(le) : '') + '</small>';
  }
  function optStatut(v) { return Object.keys(ST).map(function (k) { return '<option value="' + k + '"' + (k === v ? ' selected' : '') + '>' + ST[k] + '</option>'; }).join(''); }
  function renderEtat(el) {
    var filtre = el.getAttribute('data-etat'), edit = partage() && !SY.ancien && !filtre;
    var l = D.etat.filter(function (e) { return !filtre || filtre.split(',').indexOf(e.cle) >= 0; });
    el.innerHTML = '<div class="prog">' + l.map(function (e) {
      if (!edit) return '<div><b>' + esc(e.nom) + '</b>' + badge(e.statut) + (e.note ? '<p>' + esc(e.note) + '</p>' : '') + meta(e._par, e._le, e._att) + '</div>';
      return '<div class="et et-' + e.statut + '" data-cle="' + esc(e.cle) + '"><b>' + esc(e.nom) + '</b>' +
        '<select data-champ="statut" aria-label="État : ' + esc(e.nom) + '">' + optStatut(e.statut) + '</select>' +
        '<textarea data-champ="note" rows="2" maxlength="2000" aria-label="Note : ' + esc(e.nom) + '" placeholder="Ce qui est fait, ce qui bloque">' + esc(e.note || '') + '</textarea>' +
        '<button type="button" class="btn petit" data-enr hidden>Enregistrer la note</button>' + meta(e._par, e._le, e._att) + '</div>';
    }).join('') + '</div>';
    if (!edit || el._lie) return;
    el._lie = true;
    el.addEventListener('change', function (e) {
      var c = e.target.closest('[data-cle]'); if (!c || e.target.getAttribute('data-champ') !== 'statut') return;
      if (!moiNom()) { renderEtat(el); ouvrirPanneau('Choisis d\'abord qui tu es.'); return; }
      envoyer([{ op: 'etat', cle: c.getAttribute('data-cle'), statut: e.target.value }]);
    });
    el.addEventListener('input', function (e) { var c = e.target.closest('[data-cle]'); if (c && e.target.tagName === 'TEXTAREA') $('[data-enr]', c).hidden = false; });
    function noter(c) {
      if (!moiNom()) { ouvrirPanneau('Choisis d\'abord qui tu es.'); return; }
      $('[data-enr]', c).hidden = true; document.activeElement.blur();
      envoyer([{ op: 'etat', cle: c.getAttribute('data-cle'), note: $('textarea', c).value }]);
    }
    el.addEventListener('click', function (e) { if (e.target.hasAttribute('data-enr')) noter(e.target.closest('[data-cle]')); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.target.tagName === 'TEXTAREA') noter(e.target.closest('[data-cle]')); });
  }
  function renderMachines(el) {
    var V = SY.V || VIDE(), edit = partage() && !SY.ancien, eq = (V.equipe || []).slice();
    var vms = D.vms.filter(function (v) { return !v.virtuel; });
    vms.forEach(function (v) { if (v.resp && eq.indexOf(v.resp) < 0) eq.push(v.resp); });
    var rows = vms.map(function (v) {
      var st = edit ? '<select data-champ="statut" aria-label="État de ' + esc(v.nom) + '">' + optStatut(v.statut) + '</select>' : badge(v.statut);
      var re = edit ? '<select data-champ="resp" aria-label="Responsable de ' + esc(v.nom) + '"><option value="">—</option>' + eq.map(function (n) { return '<option' + (n === v.resp ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select>' : esc(v.resp || '—');
      return '<tr data-nom="' + esc(v.nom) + '"' + (v.site === moi() ? ' class="moi-ligne"' : '') + '><td class="mono">' + esc(v.nom) + '</td><td>' + esc(v.site) + '</td><td>' + esc(v.role) + '</td><td>' + st + '</td><td>' + re + '</td><td>' + meta(v._par, v._le, v._att) + '</td></tr>';
    });
    var fait = vms.filter(function (v) { return v.statut === 'fait'; }).length;
    el.innerHTML = '<p>' + fait + ' machine(s) sur ' + vms.length + ' terminées' + (edit ? '. Change l\'état ou le responsable : tout le groupe le voit, le schéma de chaque site se colore.' : '.') + '</p>' +
      '<div class="tw"><table class="machines"><thead><tr><th>Machine</th><th>Site</th><th>Rôle</th><th>État</th><th>Responsable</th><th>Modifié</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>';
    if (!edit || el._lie) return;
    el._lie = true;
    el.addEventListener('change', function (e) {
      var tr = e.target.closest('tr[data-nom]'), c = e.target.getAttribute('data-champ'); if (!tr || !c) return;
      if (!moiNom()) { renderMachines(el); ouvrirPanneau('Choisis d\'abord qui tu es.'); return; }
      var op = { op: 'vm', nom: tr.getAttribute('data-nom') }; op[c] = e.target.value; envoyer([op]);
    });
  }
  function renderEquipe(el) {
    if (!partage()) {
      el.innerHTML = '<p>Le suivi d\'équipe (qui a coché quoi, qui est en ligne) apparaît quand le site est servi par le <b>serveur du labo</b> (IIS ou nginx, voir <code>serveur/README.md</code>). ' +
        'Ici, les cases restent dans ce navigateur. Si le serveur tourne ailleurs, indique son adresse : <button type="button" class="btn ghost petit" data-a="srv">Serveur du suivi</button></p>';
      if (!el._lie) { el._lie = true; el.addEventListener('click', function (e) { if (e.target.getAttribute('data-a') === 'srv') { e.stopPropagation(); ouvrirPanneau(); var d = $('#sync-panel details'); if (d) d.open = true; } }); }
      return;
    }
    var V = SY.V || VIDE(), me = moiNom(), eq = (V.equipe || []).slice(), cpt = {}, der = {};
    Object.keys(V.cases).forEach(function (p) { var f = V.cases[p].faits || {}; Object.keys(f).forEach(function (c) { var n = f[c].par; if (n) cpt[n] = (cpt[n] || 0) + 1; }); });
    (V.journal || []).forEach(function (e) { der[e.par] = e.le; });
    (V.en_ligne || []).concat(me ? [me] : []).forEach(function (n) { if (n && eq.indexOf(n) < 0) eq.push(n); });
    var cartes = eq.map(function (n) {
      var on = (V.en_ligne || []).indexOf(n) >= 0;
      return '<div class="membre' + (n === me ? ' moi' : '') + '"><span class="pt ' + (on ? 'm-direct' : 'm-off') + '" title="' + (on ? 'en ligne' : 'pas en ligne') + '"></span><b>' + esc(n) + '</b>' + (n === me ? ' <small>(toi)</small>' : '') +
        '<p>' + (cpt[n] || 0) + ' étape(s) cochée(s)' + (der[n] ? ' · dernière action ' + quand(der[n]) : '') + '</p></div>';
    });
    el.innerHTML = (cartes.length ? '<div class="equipe">' + cartes.join('') + '</div>' : '<p>Personne encore : donne les prénoms du groupe ci-dessous.</p>') +
      '<form class="eq-form"><label>Prénoms du groupe <input name="noms" value="' + esc((V.equipe || []).join(', ')) + '" placeholder="ex. trois prénoms séparés par des virgules" maxlength="300"></label> <button class="btn ghost petit">Enregistrer l\'équipe</button>' +
      (me ? ' <span class="src">Tu es <b>' + esc(me) + '</b> sur ce navigateur — <a href="#" data-a="qui">changer</a></span>' : ' <a href="#" data-a="qui">Dire qui je suis</a>') + '</form>';
    if (el._lie) return;
    el._lie = true;
    el.addEventListener('submit', function (e) {
      e.preventDefault();
      var noms = e.target.noms.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 12);
      if (!moiNom() && noms.length) ls('euro.qui', noms[0]);
      document.activeElement.blur();
      envoyer([{ op: 'equipe', noms: noms }]);
      if (!moiNom() || noms.indexOf(moiNom()) < 0) ouvrirPanneau('Équipe enregistrée : dis lequel tu es.');
    });
    el.addEventListener('click', function (e) { if (e.target.getAttribute('data-a') === 'qui') { e.preventDefault(); e.stopPropagation(); ouvrirPanneau(); } });
  }
  function renderJournal(el) {
    var V = SY.V || VIDE(), max = +el.getAttribute('data-journal') || 30, filtre = el._filtre || '';
    if (!partage() || SY.ancien) { el.hidden = !!el.hasAttribute('data-court'); if (!el.hidden) el.innerHTML = '<p>Le journal des changements apparaît avec le serveur du suivi.</p>'; return; }
    el.hidden = false;
    var tout = (V.journal || []).slice().reverse(), gens = [];
    tout.forEach(function (e) { if (gens.indexOf(e.par) < 0) gens.push(e.par); });
    var L = tout.filter(function (e) { return !filtre || e.par === filtre; }).slice(0, max);
    var court = el.hasAttribute('data-court');
    el.innerHTML = (court || gens.length < 2 ? '' : '<div class="filters" role="group" aria-label="Filtrer par personne">' + [''].concat(gens).map(function (g) {
      return '<button type="button" class="chip" data-p="' + esc(g) + '" aria-pressed="' + (g === filtre) + '">' + (g ? esc(g) : 'Tout le monde') + '</button>'; }).join('') + '</div>') +
      (L.length ? '<ul class="journal">' + L.map(function (e) {
        return '<li><time>' + quand(e.le) + '</time> <b>' + esc(e.par) + '</b> ' + decrire(e) + (court || e.op === 'depot' ? '' : ' <button type="button" class="lien" data-n="' + e.n + '" title="Remettre comme avant">annuler</button>') + '</li>'; }).join('') + '</ul>'
        : '<p>Rien encore : chaque case cochée, chaque état changé s\'inscrit ici.</p>') +
      (court && L.length ? '<p><a href="avancement.html#activite">Toute l\'activité</a></p>' : '');
    if (el._lie) return;
    el._lie = true;
    el.addEventListener('click', function (e) {
      var p = e.target.closest('[data-p]'); if (p) { el._filtre = p.getAttribute('data-p'); renderJournal(el); return; }
      var n = e.target.getAttribute('data-n'); if (!n) return;
      if (!moiNom()) { ouvrirPanneau('Choisis d\'abord qui tu es.'); return; }
      var x = (SY.V.journal || []).filter(function (j) { return String(j.n) === n; })[0], inv = x && inverse(x);
      if (inv) envoyer([inv]);
    });
  }
  function telecharger(nom, obj) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' }));
    a.download = nom; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function renderSuivi(el) {
    var d = lire(), noms = {};
    PAGES.forEach(function (p) { noms[p[0]] = p[1]; });
    if (partage()) {
      var V = SY.V || VIDE(), local = Object.keys(d.ok).length;
      var rows = PAGES.map(function (p) { return p[0]; }).filter(function (p) { return V.cases[p] || d.tot[p]; }).map(function (p) {
        var c = V.cases[p] || { faits: {} }, n = Object.keys(c.faits).length, t = Math.max(c.total || 0, d.tot[p] || 0, n);
        return '<tr><td><a href="' + p + '">' + esc(noms[p]) + '</a></td><td>' + n + ' / ' + t + '</td><td><progress max="' + t + '" value="' + n + '"></progress></td></tr>';
      });
      el.innerHTML = (rows.length ? '<div class="tw"><table><thead><tr><th>Page</th><th>Étapes faites (groupe)</th><th></th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' : '<p>Aucune étape cochée pour l\'instant.</p>') +
        '<p class="note">Suivi commun ' + (SY.mode === 'direct' ? 'en direct' : 'hors ligne (dernière copie)') + ' : chaque case cochée est enregistrée sur le serveur du labo, avec qui et quand, et visible par tout le groupe.' +
        (local ? ' Ce navigateur garde encore ' + local + ' case(s) d\'avant : ouvre la page concernée, un bandeau propose de les ajouter.' : '') + '</p>' +
        '<p><button class="btn ghost" type="button" data-a="expc">Télécharger le suivi commun (JSON)</button></p>';
      if (!el._lieC) { el._lieC = true; el.addEventListener('click', function (e) { if (e.target.getAttribute('data-a') === 'expc') telecharger('suivi-eurocorp-' + new Date().toISOString().slice(0, 10) + '.json', SY.S || VIDE()); }); }
      return;
    }
    var pages = Object.keys(d.tot), S = D.suivi || {};
    Object.keys(S).forEach(function (p) { if (pages.indexOf(p) < 0) pages.push(p); });
    var rws = pages.filter(function (p) { return noms[p]; }).map(function (p) {
      var pre = pfx(p), c = ((S[p] || {}).faits || []).length,
          n = c + Object.keys(d.ok).filter(function (k) { return k.split('#')[0] === pre + p; }).length,
          t = d.tot[p] || (S[p] && S[p].total) || n;
      return '<tr><td><a href="' + p + '">' + esc(noms[p]) + '</a></td><td>' + n + ' / ' + t +
        (c ? ' <small>(' + c + ' en commun)</small>' : '') + '</td><td><progress max="' + t + '" value="' + n + '"></progress></td></tr>';
    });
    el.innerHTML = (rws.length ? '<div class="tw"><table><thead><tr><th>Page</th><th>Étapes cochées</th><th></th></tr></thead><tbody>' + rws.join('') + '</tbody></table></div>'
      : '<p>Rien de coché pour l\'instant. Ouvre une page et coche les étapes faites : elles sont mémorisées dans ce navigateur.</p>') +
      '<p class="note">La mémoire est propre à ce navigateur et à cette adresse. Pour la passer à un autre poste : Exporter, puis Importer. Pour un suivi commun du groupe, sers le site depuis le serveur du labo (<code>serveur/README.md</code>).</p>' +
      '<p><button class="btn ghost" type="button" data-a="exp">Exporter</button> <button class="btn ghost" type="button" data-a="imp">Importer</button> <button class="btn ghost" type="button" data-a="rst">Tout décocher</button></p><textarea hidden spellcheck="false" aria-label="Données de suivi"></textarea>';
    if (el._lieL) return;
    el._lieL = true;
    el.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a'), ta = $('textarea', el); if (!a || !ta) return;
      if (a === 'exp') { ta.hidden = false; ta.value = JSON.stringify(lire()); ta.select(); }
      if (a === 'imp') {
        if (ta.hidden || !ta.value) { ta.hidden = false; ta.value = ''; ta.placeholder = 'Colle ici les données exportées puis clique de nouveau sur Importer'; return; }
        try { var o = JSON.parse(ta.value); if (o && o.ok && o.tot) { ecrire(o); renderSuivi(el); } } catch (x) { ta.value = 'Données invalides.'; }
      }
      if (a === 'rst' && window.confirm('Décocher toutes les cases gardées dans ce navigateur ?')) { var x = lire(); x.ok = {}; ecrire(x); location.reload(); }
    });
  }

  /* --- inventaire : valeurs réelles par-dessus le plan, partout dans le guide ------------------
     Trois couches, la première trouvée gagne : 1. l'équipe (serveur du suivi, ou ce navigateur sans
     serveur) ; 2. le relevé publié dans le dépôt (« reel » de data/eurocorp.json) ; 3. le plan.
     Les données (D) gardent les noms et adresses du plan : c'est le texte affiché qui est remplacé
     (pages, commandes, tableaux, schémas, menu Machine), avec « prévu : … » au survol. Les clés des
     cases restent calculées sur le texte du plan : changer une adresse ne décoche rien. */
  var PLAN = JSON.parse(JSON.stringify({ vms: D.vms, sites: D.sites }));
  var CH_VM = [['nom', 'Nom d\'hôte', 't'], ['vmhv', 'VM Hyper-V', 't'], ['ip', 'Adresse IP', 'ip'], ['vcpu', 'vCPU', 'n'], ['ram', 'RAM (Go)', 'n'], ['disque', 'Disque (Go)', 'n'], ['os', 'Système', 't'], ['mem', 'Mémoire', 't']];
  var CH_SITE = [['wan', 'WAN OPNsense', 'ip'], ['lan', 'LAN du site', 'cidr'], ['hote', 'Hôte Hyper-V (salle)', 'ip']];
  var NUM = { vcpu: 1, ram: 1, disque: 1 };
  function ipDe(t) { var m = String(t || '').match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/); return m ? m[0] : ''; }
  function itemPlan(cible) {
    var i = cible.indexOf(':'), k = cible.slice(0, i), id = cible.slice(i + 1);
    return k === 'vm' ? PLAN.vms.filter(function (v) { return v.nom === id; })[0] : PLAN.sites.filter(function (s) { return s.id === id; })[0];
  }
  function planVal(cible, f) {
    var it = itemPlan(cible); if (!it) return '';
    if (f === 'vmhv') return it.nom;
    if (f === 'hote') return ipDe(it.hote);
    return it[f] == null ? '' : String(it[f]);
  }
  function releve(cible, f) { var it = itemPlan(cible); return it && it.reel && it.reel[f] != null ? String(it.reel[f]) : null; }
  function invEquipe() {
    if (SY.mode !== 'local') return (SY.V && SY.V.inv) || {};
    var c = !SY.decide && candidats().length ? lsJson('euro.cache', null) : null;     // au démarrage : dernière copie du serveur
    return c && c.S ? c.S.inv || {} : lsJson('euro.inv', {});
  }
  function info(cible, f) {
    var l = (invEquipe()[cible] || {})[f], r = releve(cible, f), p = planVal(cible, f);
    if (l && l.v != null) return { v: String(l.v), src: 'equipe', par: l.par || '', le: l.le || '', att: !!l.attente, plan: p, releve: r };
    if (r != null) return { v: r, src: 'releve', plan: p, releve: r };
    return { v: p, src: 'plan', plan: p, releve: null };
  }
  function val(cible, f) { return info(cible, f).v; }
  /* chiffres et textes non repérables dans le texte (RAM, système…) : versés dans D pour les calculs et tableaux */
  function appliquerInvD() {
    D.vms.forEach(function (v) {
      var c = 'vm:' + v.nom;
      ['vcpu', 'ram', 'disque'].forEach(function (f) { var x = parseFloat(val(c, f)); if (!isNaN(x)) v[f] = x; });
      ['os', 'mem'].forEach(function (f) { v[f] = val(c, f); });
      v.vmhv = val(c, 'vmhv');
    });
  }
  /* Pas d'appel ici : la marche (marche.js) se dessine d'abord avec le plan, pour que les clés de ses cases
     (qui contiennent parfois une taille, « 2 vCPU, 2 Go ») ne bougent jamais ; appliquerInvD() vient après. */

  /* repérage des noms et adresses du plan dans le texte */
  var TOK = (function () {
    var m = {};
    PLAN.vms.forEach(function (v) {
      var c = 'vm:' + v.nom;
      if (!v.virtuel) { m[v.nom] = { c: c, f: 'nom' }; m[v.nom.toLowerCase()] = { c: c, f: 'nom', bas: true }; }
      if (/^\d+\.\d+\.\d+\.\d+$/.test(v.ip)) m[v.ip] = { c: c, f: 'ip' };
    });
    PLAN.sites.forEach(function (s) {
      var c = 'site:' + s.id;
      if (s.wan) m[s.wan] = { c: c, f: 'wan' };
      if (s.lan) m[s.lan] = { c: c, f: 'lan' };
      var h = ipDe(s.hote); if (h && !m[h]) m[h] = { c: c, f: 'hote' };
    });
    var cles = Object.keys(m).sort(function (a, b) { return b.length - a.length; });
    var re = null;
    try { re = new RegExp('(?<![\\w.-])(' + cles.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')(?![\\w-]|\\.\\d)', 'g'); } catch (e) { re = null; }
    return { m: m, re: re };
  })();
  function courant(t) { var d = TOK.m[t]; if (!d) return t; var v = val(d.c, d.f); return d.bas ? v.toLowerCase() : v; }
  var DIRECTS = [];                    // nœuds de texte remplacés tels quels (schémas SVG, options du menu)
  function horsInv(el) { return !el || el.closest('script, style, textarea, input, select:not(#machine-h), [data-noinv], .iv, [contenteditable]'); }
  function marquer(racine) {
    if (!TOK.re || !racine) return;
    var w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, null), n, L = [];
    while ((n = w.nextNode())) { if (n.nodeValue.length > 6 && !n._inv) L.push(n); }
    L.forEach(function (n) {
      var p = n.parentNode; if (!p || horsInv(p)) return;
      TOK.re.lastIndex = 0; if (!TOK.re.test(n.nodeValue)) return;
      if (p.closest('svg, option, title')) { n._inv = n.nodeValue; DIRECTS.push(n); n.nodeValue = n._inv.replace(TOK.re, courant); return; }
      var t = n.nodeValue, f = document.createDocumentFragment(), i = 0, mm;
      TOK.re.lastIndex = 0;
      while ((mm = TOK.re.exec(t))) {
        if (mm.index > i) f.appendChild(document.createTextNode(t.slice(i, mm.index)));
        var s = document.createElement('span'), d = TOK.m[mm[1]];
        s.className = 'iv'; s.setAttribute('data-p', mm[1]); s.setAttribute('data-c', d.c); s.setAttribute('data-f', d.f);
        s.textContent = mm[1]; f.appendChild(s); i = mm.index + mm[1].length;
      }
      if (i < t.length) f.appendChild(document.createTextNode(t.slice(i)));
      p.replaceChild(f, n);
    });
    majTokens(racine);
  }
  function majTokens(racine) {
    $$('.iv[data-c]', racine || document).forEach(function (s) {
      var p = s.getAttribute('data-p'), c = s.getAttribute('data-c'), f = s.getAttribute('data-f'), x = info(c, f),
          v = NUM[f] ? x.v : courant(p);   // tailles (marche.js) : repérées par machine, pas par leur texte
      if (NUM[f] && x.src === 'plan') v = p; // sans valeur réelle, garder le texte de l'étape (ex. « 2 vCPU » des pare-feu)
      if (s.textContent !== v) s.textContent = v;
      var mod = v !== p;
      s.classList.toggle('iv-mod', mod);
      if (mod) s.title = 'Réel : ' + v + ' — prévu au plan : ' + p + (x.src === 'equipe' && x.par ? ' (changé par ' + x.par + ')' : x.src === 'releve' ? ' (relevé sur la machine)' : '');
      else s.removeAttribute('title');
    });
    if (!racine) DIRECTS = DIRECTS.filter(function (n) { if (!n.parentNode) return false; n.nodeValue = n._inv.replace(TOK.re, courant); return true; });
  }
  var OBS = null;
  function demarrerInv() {
    marquer(document.body);
    if (!window.MutationObserver) return;
    OBS = new MutationObserver(function (ms) {
      OBS.disconnect();
      ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 3) { if (n.parentNode) marquer(n.parentNode); } else if (n.nodeType === 1 && !n.classList.contains('iv')) marquer(n); }); });
      OBS.observe(document.body, { childList: true, subtree: true });
    });
    OBS.observe(document.body, { childList: true, subtree: true });
  }
  var INV_SIG = '';
  function majInventaire() {           // appelé quand l'état commun change
    var sig = JSON.stringify(invEquipe());
    if (sig === INV_SIG) return; var avant = INV_SIG; INV_SIG = sig;
    appliquerInvD(); majTokens();
  }

  /* --- contrôles : énoncé (PDF), plan et cohérence ------------------------------------------------- */
  function ipNum(ip) { var p = String(ip).split('.'); if (p.length !== 4 || p.some(function (x) { return !/^\d{1,3}$/.test(x) || +x > 255; })) return null; return ((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + (+p[3]); }
  function dans(ip, cidr) {
    var c = String(cidr).split('/'), a = ipNum(ip.split('/')[0]), b = ipNum(c[0]), n = +c[1];
    if (a == null || b == null || isNaN(n)) return null;
    var masque = n === 0 ? 0 : (~0 << (32 - n)) >>> 0;
    return ((a & masque) >>> 0) === ((b & masque) >>> 0);
  }
  function vmsReelles() { return PLAN.vms.filter(function (v) { return !v.virtuel; }); }
  function totalSite(id, f) { return vmsReelles().filter(function (v) { return v.site === id; }).reduce(function (a, v) { var x = parseFloat(val('vm:' + v.nom, f)); return a + (isNaN(x) ? 0 : x); }, 0); }
  function controles() {
    var R = [], E = (D.enonce && D.enonce.regles) || [];
    function cibles(r) {
      var L = [];
      r.cibles.forEach(function (c) {
        if (c === 'vm:*') PLAN.vms.forEach(function (v) { if (/^\d/.test(v.ip)) L.push('vm:' + v.nom); });
        else if (c === 'site:*') PLAN.sites.forEach(function (s) { L.push('site:' + s.id); });
        else L.push(c);
      });
      return L;
    }
    E.forEach(function (r) {
      cibles(r).forEach(function (c) {
        var v = r.champ === 'ram_total' || r.champ === 'disque_total' ? totalSite(c.slice(5), r.champ.split('_')[0]) : val(c, r.champ), ok = true, att = '';
        if (r.champ === 'ip' && !/^\d/.test(v)) return;
        if (r.egal != null) { ok = v === r.egal; att = r.egal; }
        if (r.contient != null) { ok = String(v).indexOf(r.contient) >= 0; att = r.contient; }
        if (r.min != null) { ok = parseFloat(v) >= r.min; att = '≥ ' + r.min; }
        if (r.max != null) { ok = parseFloat(v) <= r.max; att = '≤ ' + r.max; }
        if (r.dans != null) { ok = dans(v, r.dans) === true; att = 'dans ' + r.dans; }
        if (r.horsde != null) { ok = dans(v, r.horsde) === false; att = 'hors de ' + r.horsde; }
        R.push({ c: c, f: r.champ, ok: ok, niveau: r.niveau || 'impose', src: 'Énoncé ' + r.ref, texte: r.texte, attendu: att, v: v, min: r.min, max: r.max });
      });
    });
    /* cohérence : adresse dans le LAN de son site, pas de doublon, passerelle = pare-feu */
    var vus = {}, noms = {};
    PLAN.vms.forEach(function (v) {
      var c = 'vm:' + v.nom, ip = val(c, 'ip'), st = 'site:' + v.site;
      if (/^\d/.test(ip)) {
        var lan = val(st, 'lan');
        if (dans(ip, lan) === false) R.push({ c: c, f: 'ip', ok: false, niveau: 'coherence', src: 'Cohérence', texte: 'Adresse hors du LAN de son site (' + lan + ')', v: ip });
        if (ipNum(ip) == null) R.push({ c: c, f: 'ip', ok: false, niveau: 'coherence', src: 'Cohérence', texte: 'Adresse IP invalide', v: ip });
        if (vus[ip]) R.push({ c: c, f: 'ip', ok: false, niveau: 'coherence', src: 'Cohérence', texte: 'Adresse déjà prise par ' + val(vus[ip], 'nom'), v: ip }); else vus[ip] = c;
      }
      if (!v.virtuel) { var n = val(c, 'nom').toUpperCase(); if (noms[n]) R.push({ c: c, f: 'nom', ok: false, niveau: 'coherence', src: 'Cohérence', texte: 'Nom déjà pris par ' + noms[n], v: n }); else noms[n] = v.nom; }
    });
    PLAN.sites.forEach(function (s) {
      var c = 'site:' + s.id, lan = val(c, 'lan');
      if (!/^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(lan)) R.push({ c: c, f: 'lan', ok: false, niveau: 'coherence', src: 'Cohérence', texte: 'Réseau à écrire sous la forme a.b.c.d/nn', v: lan });
    });
    return R;
  }
  function etiquette(r) { return r.ok ? 'ok' : r.niveau === 'impose' || r.niveau === 'coherence' ? 'ko' : 'avert'; }

  /* --- la page Inventaire ------------------------------------------------------------------------ */
  function ecrireInv(cible, f, valeur) {
    var i = info(cible, f);
    if (valeur === i.v) return;
    var nul = valeur === (i.releve != null ? i.releve : i.plan) && i.src === 'equipe';   // retour à la valeur de base
    if (partage()) {
      if (!moiNom()) { ouvrirPanneau('Choisis d\'abord qui tu es : le changement portera ton nom.'); renderInventaire(); return; }
      envoyer([{ op: 'inv', cible: cible, champ: f, valeur: nul ? null : valeur }]);
    } else {
      var L = lsJson('euro.inv', {}); L[cible] = L[cible] || {};
      if (nul) delete L[cible][f]; else L[cible][f] = { v: valeur, le: maintenantIso() };
      if (!Object.keys(L[cible]).length) delete L[cible];
      ls('euro.inv', JSON.stringify(L)); majInventaire(); renderInventaire();
    }
  }
  function valide(type, v) {
    if (type === 'ip') return v === 'DHCP' || ipNum(v) != null;
    if (type === 'cidr') return /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(v) && ipNum(v.split('/')[0]) != null && +v.split('/')[1] <= 32;
    if (type === 'n') return /^\d+(\.\d+)?$/.test(v);
    return v.length > 0 && v.length <= 120;
  }
  function cellule(cible, f, type, R) {
    var x = info(cible, f), regs = R.filter(function (r) { return r.c === cible && r.f === f; }), pire = '';
    regs.forEach(function (r) { var e = etiquette(r); if (e === 'ko' || (e === 'avert' && pire !== 'ko')) pire = e; });
    var h = '<input data-c="' + esc(cible) + '" data-f="' + f + '" data-t="' + type + '" value="' + esc(x.v) + '" aria-label="' + esc(f + ' ' + cible.slice(cible.indexOf(':') + 1)) + '" class="' + (pire ? 'c-' + pire : '') + (x.src !== 'plan' ? ' c-mod' : '') + '"' + (type === 'n' ? ' inputmode="decimal" size="4"' : '') + '>';
    if (x.src !== 'plan') {
      h += '<small class="ivp">plan : ' + esc(x.plan || '—') + (x.src === 'equipe' ? ' · ' + esc(x.par || 'ce navigateur') + (x.le ? ' ' + quand(x.le) : '') + ' <button type="button" class="lien" data-raz title="Revenir ' + (x.releve != null ? 'au relevé' : 'au plan') + '">↺</button>' : ' · relevé') + '</small>';
    }
    /* exigence précise de l'énoncé (valeur, minimum) : toujours rappelée ; règle générale : seulement si elle n'est pas tenue */
    var generales = [];
    regs.forEach(function (r) {
      var precise = r.niveau !== 'coherence' && (r.min != null || r.max != null || (r.attendu && !/^(dans|hors de) /.test(r.attendu) && r.f !== 'os'));
      if (r.ok && !precise) { generales.push(r.src + ' : ' + r.texte); return; }
      h += '<small class="ivr r-' + etiquette(r) + '" title="' + esc(r.texte) + '">' + esc(r.src.replace('Énoncé ', 'énoncé ')) + (r.niveau === 'exemple' ? ' (exemple)' : r.niveau === 'recommandé' ? ' (conseillé)' : '') +
        (r.attendu ? ' : ' + esc(r.attendu) : '') + (r.ok ? '' : ' — ' + esc(r.texte)) + '</small>';
    });
    if (generales.length) h += '<small class="ivr r-ok" title="' + esc(generales.join('\n')) + '">énoncé</small>';
    return '<td>' + h + '</td>';
  }
  function renderInventaire(el) {
    if (!el) { $$('[data-inventaire]').forEach(function (e) { if (libre(e)) renderInventaire(e); }); return; }
    var R = controles(), ko = R.filter(function (r) { return etiquette(r) === 'ko'; }), av = R.filter(function (r) { return etiquette(r) === 'avert'; });
    var h = '<p class="note ' + (partage() ? 'why' : 'warn') + '"><b>' + (partage() ? 'Commun au groupe, en direct' : 'Propre à ce navigateur') + '</b>' +
      (partage() ? 'Chaque valeur changée ici est enregistrée sur le serveur du suivi, avec ton nom, et remplace celle du plan partout dans le guide, chez tout le monde : textes, commandes, tableaux, schémas, menu Machine.'
        : 'Aucun serveur de suivi : les valeurs changées ici restent dans ce navigateur (elles s\'appliquent quand même à tout le guide, ici). Sur le serveur du labo, elles sont communes au groupe.') +
      ' Une valeur différente du plan est <span class="iv-mod">soulignée</span> dans les pages : survole-la pour voir ce qui était prévu. Noms et adresses changent partout ; les tailles (vCPU, RAM, disque) changent dans les tableaux, schémas et calculs, pas dans le texte des étapes (qui garde le plan, pour ne décocher aucune case).</p>';
    h += '<div class="inv-bilan"><span class="bil b-' + (ko.length ? 'ko' : 'ok') + '">' + ko.length + ' écart(s) bloquant(s)</span><span class="bil b-' + (av.length ? 'avert' : 'ok') + '">' + av.length + ' remarque(s)</span>' +
      '<button type="button" class="btn ghost petit" data-a="csv">Télécharger l\'inventaire (CSV)</button></div>';
    if (ko.length || av.length) h += '<ul class="inv-ctl">' + ko.concat(av).map(function (r) {
      var it = itemPlan(r.c), nom = r.c.indexOf('site:') === 0 ? 'Site ' + (it ? it.nom : r.c) : val(r.c, 'nom') || r.c.slice(3);
      return '<li class="r-' + etiquette(r) + '"><b>' + esc(nom) + '</b> · ' + esc(r.texte) + ' — <span class="mono">' + esc(String(r.v)) + '</span>' + (r.attendu ? ' (attendu ' + esc(r.attendu) + ')' : '') + ' <small>' + esc(r.src) + '</small></li>'; }).join('') + '</ul>';
    h += '<h3>Sites et hôtes</h3><div class="tw"><table class="inv"><thead><tr><th>Site</th>' + CH_SITE.map(function (c) { return '<th>' + c[1] + '</th>'; }).join('') + '<th>Passerelle</th><th>RAM allouée</th><th>Disque max</th></tr></thead><tbody>' +
      PLAN.sites.map(function (s) {
        var c = 'site:' + s.id, ram = totalSite(s.id, 'ram'), dq = totalSite(s.id, 'disque');
        return '<tr><th scope="row">' + esc(s.nom) + '<small class="ivp">' + esc(s.role) + '</small></th>' + CH_SITE.map(function (k) { return cellule(c, k[0], k[2], R); }).join('') +
          '<td class="mono">' + esc(val('vm:' + s.id + '-FW01', 'ip')) + '<small class="ivp">= ' + esc(val('vm:' + s.id + '-FW01', 'nom')) + '</small></td>' +
          '<td class="' + (ram > 64 ? 'r-ko' : '') + '">' + ram + ' / 64 Go<small class="ivp">toutes allumées</small></td><td>' + dq + ' / 1000 Go<small class="ivp">VHDX dynamiques : maximum</small></td></tr>';
      }).join('') + '</tbody></table></div>';
    PLAN.sites.forEach(function (s) {
      var L = PLAN.vms.filter(function (v) { return v.site === s.id; });
      h += '<h3 id="inv-' + s.id.toLowerCase() + '">' + esc(s.nom) + ' <small>' + L.filter(function (v) { return !v.virtuel; }).length + ' machines</small></h3><div class="tw"><table class="inv"><thead><tr><th>Machine</th>' +
        CH_VM.map(function (c) { return '<th>' + c[1] + '</th>'; }).join('') + '</tr></thead><tbody>' + L.map(function (v) {
          var c = 'vm:' + v.nom;
          if (v.virtuel) return '<tr class="virt"><th scope="row">' + esc(v.nom) + '<small class="ivp">' + esc(v.role) + '</small></th><td></td><td></td>' + cellule(c, 'ip', 'ip', R) + '<td colspan="5"></td></tr>';
          return '<tr' + (v.site === moi() ? ' class="moi-ligne"' : '') + '><th scope="row">' + esc(v.nom) + '<small class="ivp">' + esc(v.role) + '</small>' + (v.reel && v.reel._source ? '<small class="ivp" title="' + esc(v.reel._source) + '">relevé ✓</small>' : '') + '</th>' +
            CH_VM.map(function (k) { return cellule(c, k[0], k[2], R); }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    });
    var imp = (D.enonce && D.enonce.imposes) || [];
    if (imp.length) h += '<h3>Ce que l\'énoncé impose (placement)</h3><ul class="inv-imp">' + imp.map(function (x) {
      var ok = x.vms.every(function (n) { return PLAN.vms.some(function (v) { return v.nom === n; }); });
      return '<li class="r-' + (ok ? 'ok' : 'ko') + '">' + esc(x.texte) + ' : ' + x.vms.map(function (n) { return '<span class="mono">' + esc(n.charAt(0) === '(' ? n : val('vm:' + n, 'nom')) + '</span>'; }).join(', ') + ' <small>Énoncé ' + esc(x.ref) + '</small></li>'; }).join('') + '</ul>' +
      '<p class="src">Source : ' + esc(D.enonce.source) + '. Le plan (colonne de base) est la proposition du dépôt ; « relevé » = valeur constatée sur la machine ; le reste est ce que le groupe a saisi.</p>';
    el.innerHTML = h;
    if (el._lie) return;
    el._lie = true;
    el.addEventListener('change', function (e) {
      var t = e.target; if (!t.matches || !t.matches('input[data-c]')) return;
      var v = t.value.trim(); if (t.getAttribute('data-t') === 'n') v = v.replace(',', '.');
      if (!valide(t.getAttribute('data-t'), v)) { t.classList.add('c-ko'); t.setCustomValidity('Valeur invalide'); t.reportValidity(); return; }
      t.setCustomValidity(''); ecrireInv(t.getAttribute('data-c'), t.getAttribute('data-f'), v);
    });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.matches('input[data-c]')) e.target.blur(); });
    el.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-raz')) { var i = e.target.closest('td').querySelector('input'); var x = info(i.getAttribute('data-c'), i.getAttribute('data-f')); ecrireInv(i.getAttribute('data-c'), i.getAttribute('data-f'), x.releve != null ? x.releve : x.plan); }
      if (e.target.getAttribute('data-a') === 'csv') telechargerCsv();
    });
  }
  function telechargerCsv() {
    var L = [['Site', 'Machine (plan)', 'Nom d\'hôte', 'VM Hyper-V', 'Rôle', 'IP', 'Système', 'vCPU', 'RAM (Go)', 'Disque (Go)', 'Mémoire', 'Hôte Hyper-V', 'Réplication', 'État']];
    PLAN.vms.forEach(function (v) {
      var c = 'vm:' + v.nom, d = D.vms.filter(function (x) { return x.nom === v.nom; })[0] || {};
      L.push([v.site, v.nom, v.virtuel ? '' : val(c, 'nom'), v.virtuel ? '' : val(c, 'vmhv'), v.role, val(c, 'ip'), val(c, 'os'), val(c, 'vcpu'), val(c, 'ram'), val(c, 'disque'), val(c, 'mem'), val('site:' + v.site, 'hote'), v.replica || '', ST[d.statut] || '']);
    });
    var csv = '﻿' + L.map(function (r) { return r.map(function (x) { x = String(x == null ? '' : x); return /[;"\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; }).join(';'); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'inventaire-eurocorp-' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* --- recette : les tests de 09-Tests, remplis par le groupe ------------------------------------
     Sur le serveur, un résultat passe par l'opération « etat » (clé test-t01) : fait = OK, encours = KO,
     afaire = pas encore ; la note = ce qui a été obtenu. Sans serveur : ce navigateur (euro.tests).
     Sans saisie, le résultat publié dans le dépôt (data/eurocorp.json, « tests[].resultat »). */
  var T_ST = { fait: 'ok', encours: 'ko', afaire: '' }, T_SV = { ok: 'fait', ko: 'encours', '': 'afaire' };
  function resultat(t) {
    var k = 'test-' + t.id.toLowerCase(), l = partage() ? ((SY.V || VIDE()).etat || {})[k] : lsJson('euro.tests', {})[k];
    if (l) return { r: T_ST[l.statut] || '', obtenu: l.note || '', par: l.par || (partage() ? '' : 'ce navigateur'), le: l.le || '', att: !!l.attente };
    var x = t.resultat || {};
    return { r: x.statut || '', obtenu: x.obtenu || '', par: x.par || '', le: x.date || '', depot: !!t.resultat };
  }
  function codeTxt(t) { return esc(t).replace(/`([^`]+)`/g, '<code>$1</code>'); }
  function ecrireTest(id, champ, v) {
    var k = 'test-' + id.toLowerCase(), op = { op: 'etat', cle: k };
    if (champ === 'r') op.statut = T_SV[v]; else op.note = v;
    if (partage()) {
      if (!moiNom()) { ouvrirPanneau('Choisis d\'abord qui tu es : le résultat portera ton nom.'); renderRecette(); return; }
      envoyer([op]);
    } else {
      var L = lsJson('euro.tests', {}), x = L[k] || { statut: 'afaire', note: '' };
      if (op.statut) x.statut = op.statut; if (op.note != null) x.note = op.note; x.le = maintenantIso();
      L[k] = x; ls('euro.tests', JSON.stringify(L)); renderRecette();
    }
  }
  function renderRecette(el) {
    if (!el) { $$('[data-recette]').forEach(function (e) { if (libre(e)) renderRecette(e); }); return; }
    var T = D.tests || [], R = T.map(resultat), f = el._filtre || '';
    var n = { ok: 0, ko: 0, '': 0 }; R.forEach(function (x) { n[x.r]++; });
    var h = '<div class="inv-bilan"><span class="bil b-ok">' + n.ok + ' réussi(s)</span><span class="bil b-' + (n.ko ? 'ko' : 'ok') + '">' + n.ko + ' en échec</span><span class="bil">' + n[''] + ' à faire</span>' +
      '<progress max="' + T.length + '" value="' + n.ok + '"></progress> <span class="src">' + (partage() ? 'Commun au groupe : chaque résultat porte un nom et une date.' : 'Sans serveur de suivi : résultats gardés dans ce navigateur.') + '</span></div>' +
      '<div class="filters" role="group" aria-label="Filtrer les tests">' + [['', 'Tous'], ['a', 'À faire'], ['ko', 'En échec'], ['ok', 'Réussis']].map(function (c) {
        return '<button type="button" class="chip" data-tf="' + c[0] + '" aria-pressed="' + (c[0] === f) + '">' + c[1] + '</button>'; }).join('') + '</div>';
    h += '<div class="tw"><table class="recette"><thead><tr><th>N°</th><th>Test</th><th>Commande / action</th><th>Attendu</th><th>Résultat</th><th>Obtenu</th></tr></thead><tbody>' +
      T.map(function (t, i) {
        var x = R[i]; if ((f === 'a' && x.r) || (f && f !== 'a' && x.r !== f)) return '';
        return '<tr data-t="' + esc(t.id) + '" class="t-' + (x.r || 'a') + '"><td class="mono">' + esc(t.id) + '</td><td>' + esc(t.test) + (t.ref ? '<small class="ivp">énoncé ' + esc(t.ref) + '</small>' : '') + '</td><td>' + codeTxt(t.action) + '</td><td>' + codeTxt(t.attendu) + '</td>' +
          '<td><select data-champ="r" aria-label="Résultat ' + esc(t.id) + '"><option value=""' + (x.r ? '' : ' selected') + '>—</option><option value="ok"' + (x.r === 'ok' ? ' selected' : '') + '>OK</option><option value="ko"' + (x.r === 'ko' ? ' selected' : '') + '>KO</option></select></td>' +
          '<td><input data-champ="o" maxlength="300" value="' + esc(x.obtenu) + '" placeholder="ce que tu obtiens" aria-label="Obtenu ' + esc(t.id) + '">' +
          (x.par || x.le ? '<small class="ivp">' + (x.att ? 'en attente · ' : '') + esc(x.par) + (x.le ? ' · ' + (x.depot ? esc(x.le) : quand(x.le)) : '') + '</small>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    el.innerHTML = h;
    if (el._lie) return;
    el._lie = true;
    el.addEventListener('change', function (e) {
      var tr = e.target.closest('tr[data-t]'), c = e.target.getAttribute('data-champ'); if (!tr || !c) return;
      ecrireTest(tr.getAttribute('data-t'), c === 'r' ? 'r' : 'o', c === 'r' ? e.target.value : e.target.value.trim());
    });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.matches('input[data-champ]')) e.target.blur(); });
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-tf]'); if (b) { el._filtre = b.getAttribute('data-tf'); renderRecette(el); } });
  }

  /* --- lecture : moins de bruit, aller droit à ce qui reste ------------------------------------- */
  function replierEncadres() {      // « pas à pas / pourquoi / vérifier / piège » : replié, ouvert à la demande
    $$('main .dt').forEach(function (dt) {
      if (dt.parentNode.classList.contains('dtw')) return;
      var nb = dt.querySelectorAll('ol.dts > li').length, w = document.createElement('details');
      w.className = 'dtw';
      w.innerHTML = '<summary>Détail' + (nb ? ' (' + nb + ' sous-étapes)' : '') + ' : pas à pas, pourquoi, vérifier, piège</summary>';
      dt.parentNode.insertBefore(w, dt); w.appendChild(dt);
    });
  }
  function etapesPrincipales() {
    return $$('main ol > li').filter(function (li) { return !li.parentNode.closest('li') && li.querySelector(':scope > input.suivi') && !li.closest('[hidden], [data-masque]'); });
  }
  function majBarre() {
    var b = $('.barre-etapes'); if (!b) return;
    var L = etapesPrincipales(), n = L.filter(function (li) { return li.classList.contains('fait'); }).length;
    $('.be-n', b).textContent = n; $('.be-t', b).textContent = L.length;
    var pr = $('progress', b); pr.max = L.length || 1; pr.value = n;
  }
  function barreEtapes() {
    if ($('.barre-etapes')) { majBarre(); return; }
    if (etapesPrincipales().length < 5) return;
    var b = document.createElement('div'); b.className = 'barre-etapes'; b.setAttribute('role', 'toolbar'); b.setAttribute('aria-label', 'Étapes');
    b.innerHTML = '<span class="be-prog"><b class="be-n">0</b> / <span class="be-t">0</span> étapes</span><progress value="0" max="1"></progress>' +
      '<button type="button" class="btn petit" data-be="suite">Prochaine étape ↓</button>' +
      '<label class="be-m"><input type="checkbox" data-be="masquer"' + (ls('euro.masquer') ? ' checked' : '') + '> Masquer les étapes faites</label>' +
      ($('main .dtw') ? '<button type="button" class="btn ghost petit" data-be="deplier">Tout déplier</button>' : '');
    var ref = $('main p.lead') || $('main h1'); ref.parentNode.insertBefore(b, ref.nextSibling);
    document.body.classList.toggle('masque-faits', !!ls('euro.masquer'));
    b.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-be');
      if (a === 'suite') {
        var li = etapesPrincipales().filter(function (x) { return !x.classList.contains('fait'); })[0];
        if (!li) { toast('Tout est fait sur cette page.', 'ok'); return; }
        var art = li.closest('article.vm'); if (art) art.classList.remove('replie');
        li.scrollIntoView({ block: 'center', behavior: 'smooth' }); li.classList.add('flash'); setTimeout(function () { li.classList.remove('flash'); }, 1600);
      }
      if (a === 'deplier') { var ouvrir = e.target.textContent === 'Tout déplier'; $$('main .dtw').forEach(function (d) { d.open = ouvrir; }); e.target.textContent = ouvrir ? 'Tout replier' : 'Tout déplier'; }
    });
    b.addEventListener('change', function (e) {
      if (e.target.getAttribute('data-be') !== 'masquer') return;
      ls('euro.masquer', e.target.checked ? '1' : null); document.body.classList.toggle('masque-faits', e.target.checked);
    });
    document.addEventListener('change', function (e) { if (e.target.classList && e.target.classList.contains('suivi')) setTimeout(majBarre, 0); });
    majBarre();
  }
  /* Marche : sans machine choisie, une grille de choix avec l'avancement de chacune ; les fiches repliées. */
  function marcheParMachine() {
    var host = $('#marche'); if (!host || $('.mgrille, .m-retour')) return;
    var arts = $$('article.vm', host); if (!arts.length) return;
    function etat(a) { var cb = $$('li > input.suivi', a).filter(function (c) { return !c.parentNode.parentNode.closest('li'); }), n = cb.filter(function (c) { return c.checked; }).length; return [n, cb.length]; }
    var m = machine();
    if (m) {
      var r = document.createElement('p'); r.className = 'm-retour';
      r.innerHTML = '<button type="button" class="lien" data-mach="">← Toutes les machines</button>';
      host.parentNode.insertBefore(r, host);
    } else {
      var g = document.createElement('div'); g.className = 'mgrille';
      g.innerHTML = '<p class="src">Choisis ta machine : sa marche s\'affiche seule, dans l\'ordre. Ou ouvre une fiche ci-dessous.</p>' + D.sites.map(function (st) {
        return '<div class="mg-site"><h3>' + esc(st.nom) + '</h3><div class="mg-cartes">' + arts.filter(function (a) { return a.getAttribute('data-site') === st.id; }).map(function (a) {
          var v = a.getAttribute('data-vm'), e = etat(a), hote = /^HOTE-/.test(v);
          return '<button type="button" class="mg-c' + (e[1] && e[0] === e[1] ? ' fini' : '') + '" data-mach="' + esc(v) + '"><b>' + esc(hote ? 'Hôte de ' + st.nom : v) + '</b><small>' + esc(coupe((($('h3 small', a) || {}).textContent || '').split(' · ')[0], 46)) + '</small>' +
            '<progress max="' + (e[1] || 1) + '" value="' + e[0] + '"></progress><small>' + e[0] + ' / ' + e[1] + '</small></button>';
        }).join('') + '</div></div>';
      }).join('');
      host.parentNode.insertBefore(g, host);
      arts.forEach(function (a) { a.classList.add('replie'); });
      host.addEventListener('click', function (e) { var h = e.target.closest('article.vm > h3'); if (h) h.parentNode.classList.toggle('replie'); });
    }
    document.addEventListener('click', function (e) {
      var c = e.target.closest('[data-mach]'); if (!c) return;
      try { localStorage.setItem(CLE_MACH, c.getAttribute('data-mach')); } catch (x) { /* ignoré */ }
      location.reload();
    });
  }
  /* Accueil : où on en est, en quatre cartes */
  function renderReprendre(el) {
    if (!el) { $$('[data-reprendre]').forEach(function (e) { renderReprendre(e); }); return; }
    var m = machine(), nomM = m ? (/^HOTE-/.test(m) ? 'l\'hôte de ' + ((D.sites.filter(function (s) { return s.id === m.slice(5); })[0] || {}).nom || '') : val('vm:' + m, 'nom')) : '';
    var faits = 0, tot = 0, S = partage() ? (SY.V || VIDE()).cases : null, d = lire();
    PAGES.forEach(function (p) {
      var f = p[0], t;
      if (S) { var c = S[f]; if (!c) return; faits += Object.keys(c.faits).length; t = c.total; }
      else { var c2 = (D.suivi || {})[f]; faits += (c2 ? c2.faits.length : 0) + Object.keys(d.ok).filter(function (k) { return k.split('#')[0].split('|').pop() === f; }).length; t = (c2 && c2.total) || d.tot[f] || 0; }
      tot += t || 0;
    });
    var R = controles(), ko = R.filter(function (r) { return etiquette(r) === 'ko'; }).length, T = D.tests || [], ok = T.filter(function (t) { return resultat(t).r === 'ok'; }).length;
    el.innerHTML = '<div class="cartes-acc">' +
      '<a class="ca" href="marche.html"><b>' + (m ? 'Reprendre : ' + esc(nomM) : 'Ma marche à suivre') + '</b><span>' + (m ? 'Sa marche, dans l\'ordre, avec « Prochaine étape ».' : 'Choisis ta machine : tout ce qu\'elle demande, dans l\'ordre.') + '</span></a>' +
      '<a class="ca" href="avancement.html"><b>' + faits + ' cases cochées</b><progress max="' + (tot || 1) + '" value="' + faits + '"></progress><span>sur ' + tot + ' (étapes et sous-étapes) · état des rubriques et des machines</span></a>' +
      '<a class="ca' + (ko ? ' ca-ko' : '') + '" href="inventaire.html"><b>Inventaire : ' + (ko ? ko + ' écart(s) à l\'énoncé' : 'conforme à l\'énoncé') + '</b><span>Noms, adresses, tailles réels, appliqués partout.</span></a>' +
      '<a class="ca" href="recette.html"><b>Recette : ' + ok + ' / ' + T.length + ' tests réussis</b><progress max="' + (T.length || 1) + '" value="' + ok + '"></progress><span>Résultats communs, rapport des tests du livrable.</span></a></div>';
  }

  window.EURO_MOI = function () { return moiSite(); };
  document.addEventListener('DOMContentLoaded', function () {
    appliquerInvD(); replierEncadres(); buildNav(); buildFooter(); render(); gatePages(); initTabs(); initCopy(); machineFiltre(); demarrerSuivi(); moiBandeau(); moiSurligne(); demarrerInv();
    renderReprendre();
  });
})();
