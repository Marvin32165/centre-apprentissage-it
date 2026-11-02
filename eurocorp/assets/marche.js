/* Marche à suivre par machine : préparation, installation, configuration, vérifications.
   Chaque étape a un détail (comment, pourquoi, vérifier). Les cases sont gérées par app.js. */
(function () {
  'use strict';
  var D = window.EURO;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ip(n) { var v = D.vms.filter(function (x) { return x.nom === n; })[0]; return v ? v.ip : ''; }
  var DOM = D.meta.domaine, NB = D.meta.netbios;
  function pre(s) { return '<pre class="mini">' + esc(s) + '</pre>'; }
  function src(s) { return '<p class="srcl">Ton cours : ' + s + '</p>'; }
  function P() { return Array.prototype.slice.call(arguments).join(''); }
  function S(t, d) { return [t, d]; }
  /* taille d'une VM (vCPU, RAM, disque) repérée pour l'inventaire : la page affiche la valeur réelle, la clé de la case garde data-p (le plan) */
  function T(v, f, p) { p = p == null ? v[f] : p; return '<span class="iv" data-c="vm:' + esc(v.nom) + '" data-f="' + f + '" data-p="' + esc(p) + '">' + esc(p) + '</span>'; }
  function scr(n, cmd) { var sh = /\.sh/.test(cmd); return '<p class="srcl">Script : <a href="scripts.html#sc' + n + '"><code>' + (sh ? 'sudo ./' : '.\\') + cmd + '</code></a>' + (sh ? '' : ' (lance d\'abord avec <code>-WhatIf</code>)') + '</p>'; }

  /* ---------- étapes communes ---------- */
  function creerVM(v, st) {
    return S('Créer la VM depuis le disque parent', P(
      '<p><b>Comment.</b> Hyper-V Manager → New → Virtual Machine : génération 2, démarrage ' + T(v, 'ram') + ' Go, <b>mémoire dynamique décochée</b>, réseau = commutateur privé du site (LAN-' + st.id + '), « attacher un disque dur virtuel ultérieurement ». Ensuite Settings → Processor : ' + T(v, 'vcpu') + ' ; SCSI → Hard Drive → Add → New → type <b>Differencing</b>, parent = <code>C:\\PARENT\\TEST-SYSPREP.vhdx</code>. Plus rapide : l\'outil « Script Hyper-V » de la page Outils.</p>',
      '<p><b>Pourquoi.</b> Le différentiel ne copie rien du parent : la VM démarre en quelques minutes et le parent reste intact.</p>',
      '<p><b>Vérifier.</b> La VM démarre sur l\'écran de première configuration (mot de passe administrateur).</p>', src('<code>hyperv</code> §1 et §4, <code>windows-serveur</code> §7'), scr('01', '01-New-EuroCorpVMs.ps1 -Site ' + st.id + ' -Seulement ' + v.nom)));
  }
  function ipFixe(v, st, dns) {
    return S('IP fixe, puis renommer la machine (en dernier)', P(
      '<p><b>Comment.</b> <code>ncpa.cpl</code> → IPv4 : <b>' + v.ip + '</b> / 255.255.255.0, passerelle <b>' + st.gw + '</b>, DNS <b>' + dns + '</b> ; décocher IPv6. Puis Local Server → Computer name → <b>' + v.nom + '</b> (redémarre).</p>',
      '<p><b>Pourquoi.</b> Un serveur ne doit pas changer d\'adresse (DNS, règles du pare-feu). Renommer en dernier, car ça redémarre.</p>',
      '<p><b>Vérifier.</b> <code>ipconfig /all</code> montre l\'adresse et le nom ; <code>ping ' + st.gw + '</code> répond.</p>', src('<code>hyperv</code> §2'), scr('02', '02-Initialize-EuroCorpServer.ps1 -Nom ' + v.nom)));
  }
  function joindre(v) {
    return S('Joindre le domaine ' + DOM, P(
      '<p><b>Comment.</b> Le DNS de la carte doit pointer vers un contrôleur (' + ip('BRU-DC01') + '). Puis <code>sysdm.cpl</code> → Change → Domain : <code>' + DOM + '</code>, compte administrateur du domaine, redémarrer. En PowerShell : <code>Add-Computer -DomainName ' + DOM + ' -Restart</code>.</p>',
      '<p><b>Pourquoi.</b> Sans domaine, pas de comptes AD, de GPO ni de gMSA.</p>',
      '<p><b>Vérifier.</b> <code>(Get-CimInstance Win32_ComputerSystem).Domain</code> renvoie <code>' + DOM + '</code> ; la machine apparaît dans Active Directory Users and Computers.</p>', scr('03', '03-Join-EuroCorpDomain.ps1')));
  }
  function creerLinux(v, st) {
    return S('Créer la VM Ubuntu Server 24.04', P(
      '<p><b>Comment.</b> Hyper-V → New VM : génération 2, ' + T(v, 'ram') + ' Go fixes, ' + T(v, 'vcpu') + ' vCPU, réseau LAN-' + st.id + ', ISO Ubuntu Server 24.04. Dans Settings → Security : décocher <b>Secure Boot</b> pour l\'installation. Installer avec OpenSSH Server.</p>',
      '<p><b>Pourquoi.</b> Pas de disque parent Windows pour Linux : installation classique depuis l\'ISO. SSH permet de travailler à distance.</p>',
      '<p><b>Vérifier.</b> La VM redémarre sur Ubuntu et on se connecte en SSH.</p>', src('<code>hyperv</code> §1 (Secure Boot et Linux)'), scr('01', '01-New-EuroCorpVMs.ps1 -Site ' + st.id + ' -Seulement ' + v.nom + ' -LinuxIso <chemin-iso>')));
  }
  function ipLinux(v, st) {
    return S('IP fixe sous Ubuntu', P(
      '<p><b>Comment.</b> Éditer le fichier de <code>/etc/netplan/</code> :</p>', pre('network:\n  version: 2\n  ethernets:\n    eth0:            # nom réel : ip a\n      addresses: [' + v.ip + '/24]\n      routes:\n        - to: default\n          via: ' + st.gw + '\n      nameservers:\n        addresses: [' + ip('BRU-DC01') + ', ' + ip('PAR-DC01') + ']\n        search: [' + DOM + ']'),
      '<p>puis <code>sudo netplan apply</code>, <code>sudo hostnamectl set-hostname ' + v.nom.toLowerCase() + '</code> et <code>sudo timedatectl set-timezone Europe/Paris</code>.</p>',
      '<p><b>Pourquoi.</b> Deux contrôleurs en DNS : si Bruxelles tombe, Paris répond encore. Le fuseau aligne l\'heure des journaux sur celle des serveurs Windows.</p>',
      '<p><b>Vérifier.</b> <code>ip a</code>, <code>ping ' + st.gw + '</code>, <code>ping ' + ip('BRU-DC01') + '</code>, <code>timedatectl</code> (fuseau Europe/Paris, horloge synchronisée).</p>', scr('20', '20-set-linux-network.sh ' + v.nom)));
  }
  function docker() {
    return S('Installer Docker et le plugin Compose', P(
      '<p><b>Comment.</b> Ajouter le dépôt officiel Docker, puis :</p>', pre('sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin'),
      '<p><b>Pourquoi.</b> Le plugin <code>docker-compose-plugin</code> fournit la commande <code>docker compose</code> utilisée partout dans le labo.</p>',
      '<p><b>Vérifier.</b> <code>docker --version</code>, <code>docker compose version</code>, <code>sudo docker run hello-world</code>.</p>', src('<code>docker</code> §3'), scr('21', '21-install-docker.sh <utilisateur>')));
  }
  function dnsA(v) {
    return S('Enregistrement DNS de la machine', P(
      '<p><b>Comment.</b> Sur un DC : DNS Manager → zone <code>' + DOM + '</code> → New Host (A) : <code>' + v.nom.toLowerCase() + '</code> → <code>' + v.ip + '</code>. Ou l\'outil « DNS » de la page Outils.</p>',
      '<p><b>Pourquoi.</b> Les autres machines et les agents joignent les serveurs par leur nom.</p>',
      '<p><b>Vérifier.</b> <code>nslookup ' + v.nom.toLowerCase() + '.' + DOM + '</code> depuis un autre site.</p>', src('<code>windows-serveur</code> §9')));
  }
  /* une étape d'une section des pages 1 à 6 (sections.js), reprise telle quelle (même clé de case) ;
     plus : un complément dans un encadré « Détail », qui n'entre pas dans la clé */
  function secEtape(titre, nom, plus) {
    var sec = (window.EURO_SEC || {})[titre] || {}, r = null;
    ['prep', 'inst', 'conf', 'verif'].forEach(function (p) { (sec[p] || []).forEach(function (x) { if (x[0] === nom) r = S('Détail · ' + nom, x[1] + (plus ? dt(plus) : '')); }); });
    return r;
  }
  function secDocker(nom) { return secEtape('Docker et Compose : les bases du labo', nom); }
  function dt(h) { return '<div class="dt"><div class="dt-b">' + h + '</div></div>'; }
  function plus(s, h) { return s ? S(s[0], s[1] + dt(h)) : s; }       // complément sans changer la clé de l'étape
  var AV = ' <span class="badge b-ref">À valider</span>';
  var FIN = S('Machine terminée', '<p>Reporter les tests dans <code>09-Tests</code> (attendu / obtenu / date), noter ce qui a été fait dans <code>Infos.md</code> et dans <code>04-Windows</code>. Cocher seulement si les vérifications ci-dessus passent.</p>');


  /* ---------- ce qui change d'un site à l'autre ---------- */
  function vmsSite(st) { return D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }); }
  function fluxSite(st) {
    return D.flux.filter(function (f) { var re = new RegExp('\\b' + st.id + '-'); return re.test(f.vers) || re.test(f.de); });
  }
  function tableFlux(st) {
    var l = fluxSite(st); if (!l.length) return '';
    return '<table><thead><tr><th>ID</th><th>De</th><th>Vers</th><th>Ports</th><th>Service</th></tr></thead><tbody>' + l.map(function (f) {
      return '<tr><td>' + esc(f.id) + '</td><td>' + esc(f.de) + '</td><td>' + esc(f.vers) + '</td><td>' + esc(f.proto) + '</td><td>' + esc(f.service) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function tunnelsSite(st) {
    var hub = st.id === 'BRU';
    var l = D.tunnels.filter(function (x) { return hub || x.id === 'BRU-' + st.id; });
    return '<table><thead><tr><th>Tunnel</th><th>Réseau /30</th><th>' + (hub ? 'IP hub (ici)' : 'IP hub (en face)') + '</th><th>' + (hub ? 'IP spoke (en face)' : 'IP spoke (ici)') + '</th></tr></thead><tbody>' + l.map(function (x) {
      return '<tr><td>' + esc(x.id) + '</td><td>' + esc(x.reseau) + '</td><td>' + esc(x.hub) + '</td><td>' + esc(x.spoke) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function autresSites(st) { return D.sites.filter(function (s) { return s.id !== st.id; }); }
  function premierServeur(s) { var l = vmsSite(s).filter(function (v) { return !/-FW|-CLT/.test(v.nom); }); return l.length ? l[0] : null; }
  function stepsHote(st) {
    var H = window.EURO_HOTE || { prep: [], inst: [], conf: [], verif: [] }, o = {};
    ['prep', 'inst', 'conf', 'verif'].forEach(function (k) {
      o[k] = H[k].map(function (x) {
        var h = x[1].replace(/LAN-BRU/g, 'LAN-' + st.id);
        return S(x[0], h);
      });
    });
    return o;
  }

  /* ---------- par machine ---------- */
  var M = {
    fw: function (v, st) {
      var hub = st.id === 'BRU';
      return {
        prep: [S('Préparer les commutateurs', P('<p><b>Comment.</b> Un commutateur <b>externe</b> (WAN, salle ' + D.meta.reseau_salle + ') et un commutateur <b>privé</b> par site (LAN-' + st.id + '). La VM OPNsense a deux cartes, une sur chacun.</p>', '<p><b>Pourquoi.</b> Le pare-feu est le seul point de passage entre le LAN du site et l\'extérieur.</p>', '<p><b>Vérifier.</b> Dans Settings de la VM, les deux cartes sont sur les bons commutateurs.</p>', src('<code>hyperv</code> §5'))),
          S('Créer la VM OPNsense', '<p><b>Comment.</b> ' + T(v, 'vcpu', 2) + ' vCPU, ' + T(v, 'ram') + ' Go, disque ' + T(v, 'disque') + ' Go, deux cartes réseau. Monter l\'ISO OPNsense. Si la VM ne démarre pas en génération 2, désactiver Secure Boot (Settings → Security) ou prendre la génération 1.</p><p><b>Vérifier.</b> La VM démarre sur l\'ISO.</p>')],
        inst: [S('Installer OPNsense', '<p><b>Comment.</b> Lancer l\'installation depuis l\'ISO, choisir le disque, redémarrer sans l\'ISO.</p><p><b>Vérifier.</b> La console affiche le menu OPNsense (interfaces WAN et LAN).</p>')],
        conf: [
          S('Interfaces et adresses', '<p><b>Comment.</b> Console → <i>Assign interfaces</i> (WAN = carte externe, LAN = carte privée), puis <i>Set interface IP address</i> : WAN <b>' + st.wan + '</b>/24 passerelle ' + D.meta.passerelle_salle + ', LAN <b>' + st.gw + '</b>/24.</p><p><b>Vérifier.</b> Depuis un serveur du LAN, <code>ping ' + st.gw + '</code> répond et l\'interface web s\'ouvre sur <code>https://' + st.gw + '</code>.</p>'),
          S('Sécuriser l\'accès', '<p><b>Comment.</b> Changer tout de suite le mot de passe par défaut de l\'interface web ; le noter dans <code>Infos.md</code> (seul endroit autorisé).</p>'),
          S('WAN : autoriser le réseau privé de la salle', '<p><b>Comment.</b> Interfaces → WAN : décocher <i>Block private networks</i> (et <i>Block bogon networks</i> si besoin).</p><p><b>Pourquoi.</b> La salle est en 10.10.28.0/24, une plage privée : par défaut OPNsense la bloque sur le WAN et le tunnel ne monte pas.</p>'),
          S(hub ? 'IPsec : trois tunnels côté hub' : 'IPsec : un tunnel vers Bruxelles', P('<p><b>Comment.</b> VPN → IPsec. <b>Phase 1</b> : passerelle distante = ' + (hub ? 'WAN du spoke (Paris ' + D.sites[1].wan + ', Londres ' + D.sites[2].wan + ', Berlin ' + D.sites[3].wan + ')' : 'WAN de Bruxelles (' + D.sites[0].wan + ')') + ', authentification par clé partagée (même clé des deux côtés), identifiants cohérents. <b>Phase 2</b> : réseau local = ' + st.lan + ', réseau distant = LAN de l\'autre site' + (hub ? ' (un par tunnel)' : ' (Bruxelles)') + '. Réseau de tunnel : un /30 pris dans 172.17.255.0/24 (voir Réseau).</p>', '<p><b>Pourquoi.</b> La phase 1 authentifie les deux pare-feu, la phase 2 dit quels réseaux passent. Local et distant inversés = tunnel « établi » mais rien ne passe.</p>', '<p><b>Vérifier.</b> VPN → IPsec → état : tunnel établi des deux côtés.</p>')),
          S('Les tunnels de ' + st.nom + ' et leurs adresses', '<p><b>Comment.</b> Voici les tunnels de ce pare-feu, avec le réseau /30 de transit (pris dans 172.17.255.0/24) :</p>' + tunnelsSite(st) + '<p>' + (hub ? 'Trois connexions distinctes sur le hub, une par spoke ; les réseaux distants à déclarer sont ' + autresSites(st).map(function (s) { return s.lan; }).join(', ') + '.' : 'Une seule connexion vers Bruxelles. Réseau local ' + st.lan + ', réseau distant : ' + D.sites[0].lan + ' et, pour joindre les autres sites par le hub, ' + autresSites(st).filter(function (s) { return s.id !== 'BRU'; }).map(function (s) { return s.lan; }).join(' et ') + '.') + '</p><p><b>Vérifier.</b> VPN → IPsec → Status : la connexion est <i>Established</i>, et <code>ping ' + (hub ? D.tunnels[0].spoke : D.tunnels.filter(function (x) { return x.id === 'BRU-' + st.id; })[0].hub) + '</code> répond depuis la console.</p>'),
          S('Les flux à ouvrir pour les serveurs de ' + st.nom, '<p><b>Comment.</b> Parmi les 28 flux de la matrice, ceux qui entrent ou sortent chez toi (' + vmsSite(st).filter(function (v) { return !/-CLT/.test(v.nom); }).map(function (v) { return esc(v.nom); }).join(', ') + ') :</p>' + tableFlux(st) + '<p>Les règles se mettent sur l\'interface IPsec (trafic des autres sites) et sur le LAN (trafic sortant), avec « Log » le temps des tests.</p>'),
          S('Règles : d\'abord « tout autorisé », puis la matrice', '<p><b>Comment.</b> Pendant le montage, une règle large sur l\'interface IPsec. Une fois les pings OK, remplacer par les 28 flux de la matrice (page Réseau), flux par flux : une règle = interface, protocole, source, destination, ports. Créer des alias pour les groupes de machines.</p><p><b>Pourquoi.</b> Les règles se lisent de haut en bas, la première qui correspond gagne : l\'ordre compte, et la règle « tout » se supprime en dernier.</p>' + src('<code>cisco-securite</code> §6 : même logique que les ACL')),
          hub ? S('Relais DHCP', '<p><b>Comment.</b> Services → DHCP Relay : interface LAN, serveur de destination = DHCP de Bruxelles/Paris. Désactiver le serveur DHCP d\'OPNsense sur ce LAN.</p>' + src('<code>windows-serveur</code> §8')) : S('Relais DHCP vers le serveur du plan', '<p><b>Comment.</b> Services → DHCP Relay : interface LAN, destination ' + ip('BRU-DC01') + ' (et ' + ip('PAR-DC01') + '). Désactiver le DHCP natif d\'OPNsense sur ce LAN.</p><p><b>Pourquoi.</b> Les clients de ce site n\'ont pas de serveur DHCP local : le relais transmet leurs DISCOVER au serveur distant à travers le tunnel.</p>' + src('<code>windows-serveur</code> §8'))],
        verif: [S('Pings LAN à LAN', '<p><b>Comment.</b> Depuis un serveur de ' + st.nom + ' : ' + autresSites(st).map(function (s) { var p = premierServeur(s); return '<code>ping ' + s.gw + '</code>' + (p ? ' puis <code>ping ' + p.ip + '</code> (' + esc(p.nom) + ')' : ''); }).join(' ; ') + ' (tests T01 à T04).</p><p><b>Si ça échoue.</b> Phase 2 inversée, règle manquante sur l\'interface IPsec, pare-feu Windows de la cible.</p>'),
          S('Un flux autorisé, un flux bloqué', '<p><b>Comment.</b> <code>Test-NetConnection &lt;cible&gt; -Port 389</code> (flux F04) doit réussir, un port hors matrice doit échouer (T05, T06). Journaux : Firewall → Log Files → Live View.</p>'), FIN]
      };
    },
    dc: function (v, st) {
      var premier = v.nom === 'BRU-DC01';
      return {
        prep: [creerVM(v, st), ipFixe(v, st, premier ? v.ip : ip('BRU-DC01'))],
        inst: [premier ? S('Installer AD DS et DNS, créer la forêt', P('<p><b>Comment.</b> Server Manager → Add roles → Active Directory Domain Services (+ DNS), puis « Promote this server » → <b>Add a new forest</b>, domaine racine <code>' + DOM + '</code>, NetBIOS ' + NB + '. En commande : <code>Install-ADDSForest -DomainName "' + DOM + '" -DomainNetbiosName "' + NB + '" -InstallDns</code>. Mot de passe DSRM demandé.</p>', '<p><b>Pourquoi.</b> Le premier DC crée la forêt et le DNS dont tout le reste dépend. <b>Jour 1 :</b> domaine créé, DC01 à terminer.</p>', '<p><b>Vérifier.</b> <code>Get-ADDomain</code> ; <code>dcdiag</code> sans erreur.</p>', src('<code>rds</code> (Install-ADDSForest), <code>sharepoint</code> (AD-Domain-Services)'))) :
          S('Joindre le domaine puis promouvoir en contrôleur', P('<p><b>Comment.</b> DNS = ' + ip('BRU-DC01') + ', joindre le domaine, puis <code>Install-WindowsFeature AD-Domain-Services, DNS -IncludeManagementTools</code> et « Promote this server » → <b>Add a domain controller to an existing domain</b> (même résultat en PowerShell avec <code>Install-ADDSDomainController -DomainName ' + DOM + ' -InstallDns -Credential (Get-Credential)</code>).</p>', '<p><b>Pourquoi.</b> Un second DC évite la panne complète de l\'annuaire et porte le DHCP en failover.</p>', '<p><b>Vérifier.</b> <code>repadmin /replsummary</code> : réplication sans échec.</p>', src('<code>sharepoint</code> §1 pour <code>Install-WindowsFeature</code>')))],
        conf: [
          S('Sites et sous-réseaux AD', '<p><b>Comment.</b> Active Directory Sites and Services : créer le site <b>' + st.id + '</b>, y ajouter le sous-réseau <b>' + st.lan + '</b>, déplacer ce DC dans son site. Liens de sites entre BRU et les autres, coût 100, fréquence 15 min (outil « Sites AD »).</p><p><b>Pourquoi.</b> Les clients choisissent le DC de leur site et la réplication suit la topologie réelle (étoile).</p><p><b>Vérifier.</b> Le DC apparaît sous son site.</p>'),
          S('DHCP : rôle, autorisation, étendue', P('<p><b>Comment.</b> Add roles → DHCP Server, puis « Complete DHCP configuration » (autorise le serveur dans l\'AD). Nouvelle étendue IPv4 « LAN ' + st.nom + ' » : <b>' + st.lan.split('/')[0].split('.').slice(0, 3).join('.') + '.100 → .199</b>, masque 255.255.255.0, routeur <b>' + st.gw + '</b>, DNS ' + ip('BRU-DC01') + ', domaine <code>' + DOM + '</code>, bail 8 jours (valeur de ton TP), puis activer l\'étendue.</p>', '<p><b>Pourquoi.</b> Un serveur DHCP non autorisé dans l\'AD ne distribue rien.</p>', '<p><b>Vérifier.</b> Un client obtient une adresse de la plage (T09).</p>', src('<code>windows-serveur</code> §8'))),
          S('Failover DHCP avec ' + (premier ? 'PAR-DC01' : 'BRU-DC01'), '<p><b>Comment.</b> Console DHCP → clic droit sur l\'étendue → <i>Configure Failover</i> : serveur partenaire, mode <b>équilibré 50/50</b>, secret partagé, et ajouter les étendues des autres sites si besoin. Ou l\'outil « DHCP » de la page Outils (le secret est demandé par <code>Read-Host</code>).</p><p><b>Pourquoi.</b> Si un des deux DC tombe, l\'autre continue à distribuer les adresses. Les deux serveurs se parlent en TCP 647 (flux F08).</p><p><b>Vérifier.</b> État « Normal » des deux côtés.</p>'),
          S('DNS : zones et enregistrements', '<p><b>Comment.</b> Zone directe <code>' + DOM + '</code> intégrée à l\'AD, zone inverse pour chaque LAN (ID réseau sans le dernier octet), enregistrements A du plan et CNAME (<code>intranet</code>, <code>helpdesk</code>) : outil « DNS ».</p>' + src('<code>windows-serveur</code> §9'))],
        verif: [S('DNS, réplication, DHCP', '<p><b>Comment.</b> <code>nslookup bru-dc01.' + DOM + '</code> depuis chaque site (T07) ; <code>.\\Test-EuroCorpAD.ps1</code> (T08) ; client en DHCP puis arrêt du DHCP principal (T09, T10).</p>'), FIN]
      };
    },
    iis: function (v, st) {
      var un = v.nom === 'BRU-IIS01';
      return {
        prep: [creerVM(v, st), ipFixe(v, st, ip('BRU-DC01')), joindre(v)],
        inst: [S('Installer le rôle Web Server (IIS)', '<p><b>Comment.</b> Add roles → Web Server (IIS) ; en PowerShell : <code>Install-WindowsFeature Web-Server -IncludeManagementTools</code>.</p><p><b>Vérifier.</b> <code>http://localhost</code> affiche la page IIS.</p>' + src('<code>iis</code> §4')),
          S('Installer la fonctionnalité NLB', '<p><b>Comment.</b> <code>Install-WindowsFeature NLB -IncludeManagementTools</code>.</p>')],
        conf: [S('Site avec son propre nom', '<p><b>Comment.</b> IIS Manager → Sites → Add Website : nom <code>intranet</code>, dossier <code>C:\\inetpub\\intranet</code>, liaison avec le nom d\'hôte <code>intranet.' + DOM + '</code>. Une page d\'accueil qui affiche le <b>nom du nœud</b>.</p><p><b>Pourquoi.</b> Afficher le nom du nœud permet de voir quel serveur répond pendant le test.</p>' + src('<code>iis</code> §8')),
          S('MAC spoofing pour le NLB unicast', '<p><b>Comment.</b> Si tu choisis le mode <b>unicast</b> : Settings de la VM → Network Adapter → Advanced Features → <i>Enable MAC address spoofing</i>.</p><p><b>Pourquoi.</b> En unicast tous les nœuds prennent la même MAC ; sans cette option Hyper-V la bloque. En multicast chaque nœud garde sa MAC mais le réseau doit gérer le multicast.</p>'),
          un ? S('Créer le cluster NLB et l\'adresse virtuelle', '<p><b>Comment.</b> Network Load Balancing Manager → New Cluster : hôte BRU-IIS01, interface du LAN, adresse virtuelle de la plage .50–.99 de Bruxelles (ex. 172.17.10.50), mode unicast ou multicast (ton choix). Puis un enregistrement DNS <code>intranet</code> → cette adresse.</p><p><b>Vérifier.</b> Le cluster est « Converged ».</p>') : S('Ajouter ce nœud au cluster', '<p><b>Comment.</b> NLB Manager → clic droit sur le cluster → Add Host To Cluster : ' + v.nom + '.</p><p><b>Vérifier.</b> Les deux nœuds sont « Converged ».</p>')],
        verif: [S('Test de bascule', '<p><b>Comment.</b> <code>http://intranet.' + DOM + '</code> depuis un client ; arrêter un nœud, recharger : le site répond encore (T12).</p>'), FIN]
      };
    },
    exch: function (v, st) {
      return {
        prep: [creerVM(v, st), ipFixe(v, st, ip('BRU-DC01')), joindre(v),
          S('Préparer le schéma AD et les prérequis', '<p><b>Comment.</b> Installer les prérequis de la version d\'Exchange (liste de l\'éditeur) puis, avec le média Exchange : <code>Setup.exe /PrepareSchema</code> et <code>/PrepareAD /OrganizationName:EUROCORP</code> avec l\'option d\'acceptation de licence demandée par Setup, avec un compte membre de Schema Admins et Enterprise Admins.</p><p><b>Pourquoi.</b> Exchange étend le schéma AD ; à faire une fois pour la forêt.</p><p><b>Vérifier.</b> Setup termine sans erreur.</p>')],
        inst: [S('PKI : installer AD CS (autorité interne)', '<p><b>Comment.</b> Add roles → Active Directory Certificate Services → Certification Authority, <i>Enterprise Root CA</i>. Suivre ton cours.</p><p><b>Pourquoi.</b> Les certificats d\'Exchange sont délivrés par ta CA et reconnus dans le domaine.</p>' + src('<code>exchange</code> §7 à §10')),
          S('Installer Exchange Server', '<p><b>Comment.</b> Assistant Setup, rôles Mailbox, redémarrage à la fin.</p><p><b>Vérifier.</b> L\'Exchange Admin Center s\'ouvre (<code>https://' + v.nom.toLowerCase() + '/ecp</code>).</p>')],
        conf: [S('Bases et boîtes aux lettres', '<p><b>Comment.</b> EAC → Mailboxes : une boîte par service (Direction, RH, Finance, IT) ; bases dans le dossier prévu.</p>' + src('<code>exchange</code> §2 et §4')),
          S('Connecteurs et transport', '<p><b>Comment.</b> Send/Receive connectors selon ton cours.</p>' + src('<code>exchange</code> §5 et §6')),
          S('Certificat de la CA interne', '<p><b>Comment.</b> Demander un certificat à ta CA et l\'affecter aux services IIS/SMTP.</p>' + src('<code>exchange</code> §9 et §10'))],
        verif: [S('Courrier entre deux boîtes', '<p><b>Comment.</b> Se connecter à deux boîtes (OWA ou client de test), envoyer, recevoir (T13).</p>'), FIN]
      };
    },
    sql: function (v, st) {
      return {
        prep: [creerVM(v, st), ipFixe(v, st, ip('BRU-DC01')), joindre(v),
          S('Préparer le compte de service (gMSA) sur l\'AD', P('<p><b>Comment.</b> Sur un DC :</p>', pre('Add-KdsRootKey -EffectiveTime ((Get-Date).AddHours(-10))   # une seule fois\nNew-ADOrganizationalUnit -Name GMSA -Path "DC=eurocorp,DC=lan"\nNew-ADGroup -Name GS_GMSA_SQL -GroupScope Global -Path "OU=GMSA,DC=eurocorp,DC=lan"\nAdd-ADGroupMember GS_GMSA_SQL -Members (Get-ADComputer PAR-SQL01)\nNew-ADServiceAccount GMSA_SQL -DNSHostName gmsa_sql.' + DOM + ' -PrincipalsAllowedToRetrieveManagedPassword GS_GMSA_SQL'), '<p><b>Pourquoi.</b> Le mot de passe du compte est géré par l\'AD : rien à stocker ni à changer à la main.</p>', src('<code>sharepoint</code> §3')))],
        inst: [S('Installer SQL Server avec le bon classement', '<p><b>Comment.</b> Setup SQL Server → Database Engine ; à l\'étape <i>Server Configuration → Collation</i> : <code>Latin1_General_CI_AS_KS_WS</code>.</p><p><b>Pourquoi.</b> SharePoint exige ce classement ; il ne se change pas facilement après coup.</p><p><b>Vérifier.</b> <code>SELECT SERVERPROPERTY(\'Collation\')</code>.</p>' + src('<code>sharepoint</code> §2')),
          S('Service SQL Server Browser en automatique', '<p><b>Comment.</b> <code>services.msc</code> → SQL Server Browser → Démarrage automatique, démarrer.</p>' + src('<code>sharepoint</code> §2'))],
        conf: [S('Donner le gMSA aux services SQL', '<p><b>Comment.</b> Sur PAR-SQL01, <code>Install-ADServiceAccount GMSA_SQL</code>, puis SQL Server Configuration Manager : les <b>trois services sauf Browser</b> → compte <code>' + NB + '\\GMSA_SQL$</code> (le <code>$</code> final est en général exigé), mot de passe vide → Apply.</p>' + src('<code>sharepoint</code> §3')),
          S('Ouvrir SQL sur le réseau', '<p><b>Comment.</b> Port TCP 1433 (ou port fixe) autorisé dans le pare-feu Windows ; Browser en UDP 1434.</p>')],
        verif: [S('Connexion depuis le futur serveur SharePoint', '<p><b>Comment.</b> Depuis PAR-SP01 : <code>Test-NetConnection PAR-SQL01 -Port 1433</code> ; connexion SSMS réussie.</p>'), FIN]
      };
    },
    /* SharePoint : marche complète écrite ici. Les étapes « Détail » viennent de la page Services (mêmes clés
       de case qu'avant), dans l'ordre préparation → installation → configuration → vérifications. */
    sp: function (v, st) {
      var SQ = 'SQL Server et SharePoint (PAR-SQL01 / PAR-SP01)', sql = ip('PAR-SQL01');
      return {
        prep: [creerVM(v, st), ipFixe(v, st, ip('PAR-DC01') + ' puis ' + ip('BRU-DC01')), joindre(v),
          secEtape(SQ, 'Comptes de service', '<p>Fait le 02/11 : les quatre comptes sont dans l\'OU <code>EuroCorp\\User</code>, mots de passe dans la page <a href="acces.html">Accès</a>.</p>'),
          secEtape(SQ, 'Dimensionnement'),
          S('Prérequis côté SQL (PAR-SQL01)', P('<p><b>Comment.</b> Sur PAR-SQL01 : classement <code>Latin1_General_CI_AS_KS_WS</code>, <b>MAXDOP = 1</b>, connexions <code>' + NB + '\\sp_farm</code> et <code>' + NB + '\\sp_setup</code> avec les rôles <code>dbcreator</code> et <code>securityadmin</code>, TCP 1433 à l\'écoute. Contrôle sur PAR-SQL01 :</p>',
            pre("sqlcmd -S .\\SHAREPOINT -E -Q \"SELECT SERVERPROPERTY('Collation'); SELECT value_in_use FROM sys.configurations WHERE name = 'max degree of parallelism'\""),
            '<p>puis depuis PAR-SP01 :</p>', pre('Test-NetConnection ' + sql + ' -Port 1433'),
            '<p><b>Pourquoi.</b> L\'assistant de la ferme crée ses bases sur PAR-SQL01 avec ces comptes : un seul point manquant (MAXDOP différent de 1, rôle absent, port fermé) et la création échoue.</p>',
            '<p><b>Vérifier.</b> <code>Latin1_General_CI_AS_KS_WS</code>, <code>1</code>, puis <code>TcpTestSucceeded : True</code>.</p>'))],
        inst: [plus(secEtape(SQ, 'Installer SharePoint sur PAR-SP01'), '<p>' + AV + ' Avant de lancer les prérequis, vérifie que ta version de SharePoint Server SE prend en charge Windows Server 2025. Les prérequis téléchargent des composants : PAR-SP01 doit sortir sur Internet.</p>')],
        conf: [plus(secEtape(SQ, 'Assistant de configuration de la ferme'), '<p>Comptes sous la forme <code>' + NB + '\\sp_farm</code>. La phrase secrète va dans la page <a href="acces.html">Accès</a> : sans elle, impossible d\'ajouter un serveur à la ferme.</p>'),
          secEtape(SQ, 'Comptes gérés et applications de service'),
          secEtape(SQ, 'DNS et premier site')],
        verif: [secEtape(SQ, 'SharePoint répond'),
          S('Le site répond depuis les autres sites (F13)', P('<p><b>Comment.</b> Depuis un poste ou un serveur d\'un autre site :</p>', pre('Test-NetConnection sharepoint.' + DOM + ' -Port 80'),
            '<p>puis ouvrir <code>http://sharepoint.' + DOM + '</code> avec un compte du domaine. La règle F13 (IPsec, tous les LAN → PAR-SP01, TCP 80 et 443) est sur PAR-FW01 ; le trafic de Londres et de Berlin traverse le hub de Bruxelles, dont le pare-feu doit aussi le laisser passer.</p>',
            '<p><b>Vérifier.</b> <code>TcpTestSucceeded : True</code> et le site s\'ouvre depuis chaque site (T14, page <a href="recette.html">Recette</a>).</p>')), FIN]
      };
    },
    fs: function (v, st) {
      return {
        prep: [creerVM(v, st), ipFixe(v, st, ip('BRU-DC01')), joindre(v),
          S('Créer les groupes (AGDLP)', '<p><b>Comment.</b> Pour chaque service (Direction, RH, Finance, IT) : un groupe <b>global</b> qui contient les comptes ; un groupe <b>local de domaine</b> par droit (ex. <code>FS_Finance_Modifier</code>) qui contient le groupe global.</p><p><b>Pourquoi.</b> Les permissions ne vont qu\'aux groupes locaux : quand quelqu\'un change de service, on change un seul groupe.</p>' + src('<code>storage-clustering</code> §4 : privilégier les groupes'))],
        inst: [S('Installer le rôle serveur de fichiers', '<p><b>Comment.</b> Add roles → File and Storage Services → File Server (DFS Namespaces en option).</p>' + src('<code>windows-serveur</code> §10'))],
        conf: [S('Dossiers et permissions NTFS', '<p><b>Comment.</b> Un dossier par service + Commun. Propriétés → Security : retirer l\'héritage superflu, donner le droit au <b>groupe local</b> uniquement. Un refus explicite prime sur une autorisation.</p>' + src('<code>storage-clustering</code> §4')),
          S('Partages', '<p><b>Comment.</b> Partager chaque dossier (permission de partage large, la sécurité est portée par NTFS) ; <code>net share</code> pour lister.</p>' + src('<code>storage-clustering</code> §5')),
          S('Hyper-V Replica vers Paris', '<p><b>Comment.</b> Voir <code>07-Sauvegarde-PRA</code> : accepter la réplication sur l\'hôte de Paris, activer la réplication de ' + v.nom + ', réplication initiale.</p><p><b>Vérifier.</b> <code>Get-VMReplication</code> : état Replicating, santé Normal.</p>')],
        verif: [S('Droits par service et basculement', '<p><b>Comment.</b> Un utilisateur par service ouvre ses dossiers (T11) ; test de basculement du Replica (T21).</p>'), FIN]
      };
    },
    zabbix: function (v, st) {
      return {
        prep: [creerLinux(v, st), ipLinux(v, st), dnsA(v), docker(),
          S('Préparer le dossier du projet', P('<p><b>Comment.</b></p>', pre('sudo mkdir -p /opt/zabbix-lab && cd /opt/zabbix-lab'), '<p>Y copier <code>05-Docker/zabbix/docker-compose.yml</code> et <code>.env</code>.</p>', src('<code>zabbix</code> §1')))],
        inst: [S('Démarrer la pile', P('<p><b>Comment.</b></p>', pre('sudo chmod 600 .env\nsudo docker compose config -q\nsudo docker compose up -d'), '<p><b>Vérifier.</b> <code>docker ps</code> : base, serveur, web « Up » ; <code>docker logs</code> du serveur sans erreur.</p>', src('<code>zabbix</code> §2')))],
        conf: [S('Interface web', '<p><b>Comment.</b> <code>http://' + v.nom.toLowerCase() + '.' + DOM + '</code>, assistant de première connexion, changer le mot de passe du compte par défaut.</p>'),
          S('Agent 2 + PSK sur chaque machine surveillée', P('<p><b>Comment.</b> Installer le MSI « Zabbix agent 2 » (même version que le serveur), nom d\'hôte exact, serveur <code>' + v.nom.toLowerCase() + '.' + DOM + '</code>, port 10050. Puis, dans PowerShell 7, le script <code>08-Supervision-Securite/Configure-ZabbixAgent2-PSK.ps1</code> avec <code>-ZabbixServer</code>, <code>-HostName</code>, <code>-PskIdentity</code> : il génère une PSK, règle les lignes TLS de <code>zabbix_agent2.conf</code> et redémarre le service.</p>', '<p><b>Pourquoi.</b> La PSK chiffre et authentifie les échanges agent ↔ serveur. L\'identité et la valeur affichées vont dans l\'onglet Encryption de l\'hôte.</p>', src('<code>system-center/zabbix</code> §3'))),
          S('Créer les hôtes', '<p><b>Comment.</b> Data collection → Hosts → Create host : nom = nom d\'hôte de l\'agent, template « Windows by Zabbix agent active », groupes « Windows servers » et « Virtual machines », onglet Encryption : PSK (identité + valeur).</p>' + src('<code>system-center/zabbix</code> §3.3'))],
        verif: [S('Données reçues', '<p><b>Comment.</b> Chaque hôte passe au vert dans Monitoring → Hosts, des valeurs récentes apparaissent (T15).</p>'), FIN]
      };
    },
    redmine: function (v, st) {
      return {
        prep: [creerLinux(v, st), ipLinux(v, st), dnsA(v), docker(),
          S('Dossier de déploiement', P('<p><b>Comment.</b></p>', pre('sudo mkdir -p /opt/redmine'), '<p>Y copier tout <code>05-Docker/redmine/</code> (compose, <code>.env</code>, <code>nginx/</code>, <code>backup-redmine.sh</code>).</p>', src('<code>system-center/redmine</code> §3')))],
        inst: [S('Lancer Redmine, MariaDB et nginx', P('<p><b>Comment.</b></p>', pre('cd /opt/redmine\nsudo chmod 600 .env\nsudo docker compose config -q\nsudo docker compose up -d\nsudo docker ps'), '<p><b>Vérifier.</b> Trois conteneurs : redmine-db, redmine-app, redmine-nginx. Au premier démarrage Redmine crée ses tables.</p>', src('<code>system-center/redmine</code> §3 et §8')))],
        conf: [S('Premier accès et configuration par défaut', '<p><b>Comment.</b> <code>https://helpdesk.' + DOM + '</code> (certificat auto-signé : avertissement normal). Se connecter avec le compte administrateur par défaut, <b>changer le mot de passe</b> immédiatement, puis Administration → « Load the default configuration » : trackers Bug / Feature / Support, rôles, statuts.</p>' + src('<code>system-center/redmine</code> §3.3')),
          S('Activer l\'API', '<p><b>Comment.</b> Administration → Settings → Integration : activer le service REST ; la clé API se lit dans My account.</p>' + src('<code>system-center/redmine</code> §3.4')),
          S('Authentification LDAP sur l\'AD', P('<p><b>Comment.</b> Administration → LDAP authentication → New : hôte <code>bru-dc01.' + DOM + '</code>, port 389, compte de service en lecture (pas Administrator en production), Base DN <code>DC=eurocorp,DC=lan</code>, création à la volée cochée, attributs <code>sAMAccountName</code>, <code>givenName</code>, <code>sN</code>, <code>mail</code>. Bouton <i>Test</i>.</p>', '<p><b>Si « Invalid LDAP Account/Password ».</b> Le DC refuse peut-être le LDAP non signé : voir la stratégie « LDAP server signing requirements » des contrôleurs de domaine (réglage de lab uniquement).</p>', src('<code>system-center/redmine</code> §4'))),
          S('Sauvegarde planifiée', '<p><b>Comment.</b> <code>sudo crontab -e</code> : <code>0 2 * * * /opt/redmine/backup-redmine.sh</code>. Détails et restauration : <code>07-Sauvegarde-PRA</code>.</p>' + src('<code>system-center/redmine</code> §7'))],
        verif: [S('Connexion, ticket, sauvegarde', '<p><b>Comment.</b> Connexion avec un compte du domaine, création d\'un ticket (T16), exécution de <code>backup-redmine.sh</code> : trois fichiers non vides (T17), restauration sur une copie (T18).</p>'), FIN]
      };
    },
    /* Wazuh : marche complète et propre (Docker single-node, cahier des charges). La section générique
       « Docker et Compose » (pensée pour Zabbix/Redmine : .env, outil Compose…) n'y est pas reprise. */
    wazuh: function (v, st) {
      var dos = '/opt/wazuh/wazuh-docker/single-node', fq = 'wazuh.' + DOM, tag = 'v4.14.9', img = 'wazuh/wazuh-indexer:' + tag.slice(1);
      var AV = ' <span class="badge b-ref">À valider</span>', DOC = src('documentation Wazuh, « Wazuh Docker deployment » (non rejoué en cours)' + AV);
      return {
        prep: [creerLinux(v, st), ipLinux(v, st), dnsA(v),
          S('Nom de service ' + fq, P('<p><b>Comment.</b> Sur un DC :</p>', pre('Add-DnsServerResourceRecordA -ZoneName ' + DOM + ' -Name wazuh -IPv4Address ' + v.ip + ' -CreatePtr'),
            '<p><b>Pourquoi.</b> Les agents et le navigateur visent <code>' + fq + '</code> : si le service change de machine, seul cet enregistrement bouge.</p>',
            '<p><b>Vérifier.</b> <code>nslookup ' + fq + '</code> renvoie <code>' + v.ip + '</code>, depuis un autre site aussi.</p>')),
          docker(), secDocker('Docker est installé sur la VM'),
          S('Réglage du noyau pour l\'indexer', P('<p><b>Comment.</b></p>', pre('sudo sysctl -w vm.max_map_count=262144\necho "vm.max_map_count=262144" | sudo tee /etc/sysctl.d/99-wazuh.conf'),
            '<p><b>Pourquoi.</b> L\'indexer (OpenSearch) refuse de démarrer si cette limite du noyau est trop basse. Le fichier de <code>sysctl.d</code> la garde après un redémarrage.</p>',
            '<p><b>Vérifier.</b> <code>sysctl vm.max_map_count</code> renvoie <code>262144</code>, aussi après <code>sudo reboot</code>.</p>'))],
        inst: [S('Récupérer le déploiement officiel (single-node)', P('<p><b>Comment.</b></p>', pre('sudo mkdir -p /opt/wazuh && cd /opt/wazuh\ngit ls-remote --tags https://github.com/wazuh/wazuh-docker.git | grep ' + tag + '   # le tag existe ?\nsudo git clone https://github.com/wazuh/wazuh-docker.git -b ' + tag + ' --depth=1\ncd wazuh-docker/single-node'),
            '<p><b>Pourquoi.</b> Le cahier des charges impose Docker : on prend le compose maintenu par l\'éditeur. <b>Le dossier du projet est <code>' + dos + '</code></b> : toutes les commandes <code>docker compose</code> se lancent de là (Compose nomme conteneurs et volumes d\'après lui, ne pas le renommer).</p>',
            '<p><b>Vérifier.</b> <code>ls</code> montre <code>docker-compose.yml</code>, <code>generate-indexer-certs.yml</code> et <code>config/</code>. Pas de <code>.env</code> ici : les réglages sont dans ces fichiers.</p>',
            '<p><b>Piège.</b> La version du dépôt fixe celle du manager ; les agents devront être de la même version ou plus anciens.</p>',
            '<p><b>Si tu suis ton cours (sans Docker).</b> <code>curl -sO https://packages.wazuh.com/4.14/wazuh-install.sh</code> puis <code>sudo bash ./wazuh-install.sh -a</code> installe tout sur la VM et affiche une seule fois le mot de passe <code>admin</code>. Hors cahier des charges : dans ce cas, les étapes Docker ci-dessous ne s\'appliquent pas.</p>',
            src('<code>system-center/XDR - SIEM</code> §3 (variante du cours)'), DOC)),
          S('Générer les certificats internes', P('<p><b>Comment.</b> Dans <code>' + dos + '</code> :</p>', pre('sudo docker compose -f generate-indexer-certs.yml run --rm generator'),
            '<p><b>Pourquoi.</b> Indexer, manager et dashboard se parlent en TLS : ces certificats les authentifient entre eux.</p>',
            '<p><b>Vérifier.</b> <code>ls config/wazuh_indexer_ssl_certs/</code> liste <code>root-ca.pem</code>, <code>admin.pem</code> et un certificat par composant.</p>', DOC)),
          S('Changer les mots de passe par défaut (avant le premier démarrage)', P(
            '<p><b>Comment.</b> Trois comptes ont un mot de passe connu de tous : <code>admin</code> (indexer et connexion au dashboard), <code>kibanaserver</code> (dashboard → indexer), <code>wazuh-wui</code> (dashboard → API du manager).</p>',
            '<ol><li>Pour <code>admin</code> et <code>kibanaserver</code>, générer un hash par mot de passe :' + pre('sudo docker run --rm -ti ' + img + ' bash /usr/share/wazuh-indexer/plugins/opensearch-security/tools/hash.sh') + '</li>',
            '<li>Dans <code>config/wazuh_indexer/internal_users.yml</code>, remplacer le <code>hash</code> de <code>admin</code> et de <code>kibanaserver</code>.</li>',
            '<li>Dans <code>docker-compose.yml</code>, partout où elles apparaissent (services manager et dashboard) : <code>INDEXER_PASSWORD</code> = mot de passe de <code>admin</code>, <code>DASHBOARD_PASSWORD</code> = celui de <code>kibanaserver</code>, <code>API_PASSWORD</code> = celui de <code>wazuh-wui</code>. Un <code>$</code> s\'écrit <code>$$</code>.</li>',
            '<li>Les comptes de démonstration <code>kibanaro</code>, <code>logstash</code>, <code>readall</code>, <code>snapshotrestore</code> ont eux aussi un mot de passe public (<code>readall</code> lit toutes les alertes) : leur mettre un hash d\'un mot de passe aléatoire qu\'on ne garde pas.</li>',
            '<li>Ne pas publier l\'indexer ni l\'API : dans <code>docker-compose.yml</code>, mettre en commentaire les ports <code>9200:9200</code> et <code>55000:55000</code>. Les trois conteneurs se parlent par le réseau interne ; seuls 443 (F22), 1514 et 1515 (F21) restent ouverts.</li>',
            '<li><code>sudo chmod 600 docker-compose.yml</code>, puis noter les trois mots de passe dans <code>Infos.md</code> (jamais dans le livrable). <code>sudo git diff</code> montre tout ce qui a changé par rapport au dépôt officiel.</li></ol>',
            '<p><b>Pourquoi.</b> Fait avant le premier démarrage, l\'indexer charge directement les nouveaux comptes : rien d\'autre à faire.</p>',
            '<p><b>Piège.</b> <code>API_PASSWORD</code> : 8 caractères au moins, avec majuscule, minuscule, chiffre et symbole, sinon l\'API refuse de démarrer. Changement <b>après</b> un premier démarrage : voir l\'étape suivante.</p>', DOC)),
          S('Démarrer la pile', P('<p><b>Comment.</b> Dans <code>' + dos + '</code> :</p>', pre('sudo docker compose up -d\nsudo docker compose ps'),
            '<p><b>Vérifier.</b> Trois conteneurs <code>Up</code> : <code>single-node-wazuh.indexer-1</code>, <code>…manager-1</code>, <code>…dashboard-1</code>. L\'indexer met une à deux minutes à répondre.</p>',
            '<p><b>Mots de passe changés après un premier démarrage.</b> L\'indexer garde les anciens : <code>sudo docker compose down</code>, <code>up -d</code>, puis appliquer la configuration de sécurité :</p>',
            pre('sudo docker exec -it single-node-wazuh.indexer-1 bash\nexport INSTALLATION_DIR=/usr/share/wazuh-indexer JAVA_HOME=/usr/share/wazuh-indexer/jdk\nC=$INSTALLATION_DIR/certs\nbash $INSTALLATION_DIR/plugins/opensearch-security/tools/securityadmin.sh -cd $INSTALLATION_DIR/opensearch-security/ -nhnv -cacert $C/root-ca.pem -cert $C/admin.pem -key $C/admin-key.pem -p 9200 -icl'), DOC))],
        conf: [S('Première connexion au dashboard', P('<p><b>Comment.</b> <code>https://' + fq + '</code> (certificat auto-signé : avertissement normal), compte <code>admin</code> avec le <b>nouveau</b> mot de passe.</p>',
            '<p><b>Vérifier.</b> La connexion passe ; l\'ancien mot de passe par défaut est refusé. Sans agent, le tableau de bord ne montre que le manager lui-même.</p>')),
          S('Premier agent, puis Sysmon', P('<p><b>Comment.</b> Dashboard → Endpoints → <i>Deploy new agent</i> : système, adresse du manager <code>' + fq + '</code>, nom d\'agent vide (nom de la machine). Lancer la commande affichée en administrateur sur la machine cible. Sur un Windows : Sysmon et le bloc <code>&lt;localfile&gt;</code> de son journal, page <a href="exploitation.html">Exploitation</a>, « Détection avec Wazuh et Sysmon ».</p>',
            '<p><b>Vérifier.</b> L\'agent est <b>active</b> dans Endpoints.</p>',
            '<p><b>Piège.</b> Un agent plus récent que le manager est refusé : prendre la version de l\'étape « Récupérer le déploiement officiel » ou plus ancienne.</p>', src('<code>system-center/XDR - SIEM</code> §5 et §6')))],
        verif: [S('Les trois conteneurs tournent', P('<p><b>Comment.</b></p>', pre('cd ' + dos + '\nsudo docker compose ps\nsudo docker compose logs --tail 50 wazuh.indexer'),
            '<p><b>Vérifier.</b> Trois conteneurs <code>Up</code>, aucune erreur répétée dans les journaux. Ils redémarrent seuls après un <code>sudo reboot</code> de la VM.</p>')),
          S('Le dashboard répond', P('<p><b>Comment.</b></p>', pre('curl -kI https://' + v.ip), '<p><b>Vérifier.</b> HTTP 200 ou 302 vers la page de connexion.</p>')),
          S('Les agents des autres sites passent (F21, F22)', P('<p><b>Comment.</b> Sur BER-FW01, règles IPsec : TCP 1514 (événements) et 1515 (enrôlement) depuis tous les LAN vers <code>' + v.ip + '</code> (F21), TCP 443 depuis les postes d\'administration (F22). Puis, depuis un Windows d\'un autre site :</p>',
            pre('Test-NetConnection ' + fq + ' -Port 1514\nTest-NetConnection ' + fq + ' -Port 1515'), '<p><b>Vérifier.</b> <code>TcpTestSucceeded : True</code> sur les deux ports.</p>')),
          S('Un événement remonte (T19)', '<p><b>Comment.</b> Sur une machine qui a l\'agent, provoquer un événement (lancer un processus, créer un fichier surveillé, échec de connexion) et le retrouver dans le dashboard (Threat Hunting).</p><p><b>Vérifier.</b> L\'événement apparaît avec le nom de la machine et l\'heure exacte. Reporter le test dans <code>09-Tests</code>.</p>'),
          S('Machine terminée', '<p>Reporter les tests dans <code>09-Tests</code> (attendu / obtenu / date), noter ce qui a été fait dans <code>Infos.md</code> et dans <code>05-Docker</code> et <code>08-Supervision-Securite</code> (comptes sans mot de passe). Cocher seulement si les vérifications ci-dessus passent.</p>')]
      };
    },
    greenbone: function (v, st) {
      return {
        prep: [creerLinux(v, st), ipLinux(v, st), dnsA(v), docker(),
          S('Dossier et fichier compose', P('<p><b>Comment.</b></p>', pre('mkdir -p ~/greenbone-community-edition && cd ~/greenbone-community-edition'), '<p>Récupérer le compose officiel avec <code>05-Docker/greenbone/fetch-compose.sh</code> (ou <code>curl -f -O -L https://greenbone.github.io/docs/latest/_static/compose.yaml</code>).</p>', src('<code>system-center/openvas</code> §2.1')))],
        inst: [S('Publier l\'interface et démarrer', P('<p><b>Comment.</b> Dans le compose, les ports de nginx sont liés à <code>127.0.0.1</code> : les passer en <code>443:443</code> et <code>9392:9392</code> pour joindre l\'interface depuis un autre poste (lab uniquement). Puis :</p>', pre('sudo docker compose pull\nsudo docker compose up -d\nsudo docker compose ps'), '<p><b>Vérifier.</b> Les conteneurs sont « Up » ; la synchronisation des flux de vulnérabilités peut durer longtemps avant le premier scan.</p>', src('<code>system-center/openvas</code> §2.2 et §2.3')))],
        conf: [S('Se connecter et changer le mot de passe', '<p><b>Comment.</b> <code>https://' + v.nom.toLowerCase() + '.' + DOM + '/</code> ; compte administrateur par défaut, <b>à changer</b> tout de suite.</p>' + src('<code>system-center/openvas</code> §2.4')),
          S('Cible et tâche', '<p><b>Comment.</b> Scans → Tasks → New Task : créer une cible (hôte unique au début, liste de ports « All IANA assigned TCP »), tâche avec la config <b>Host Discovery</b> pour un premier passage (détecte les machines, aucune vulnérabilité), puis <b>Full and fast</b>.</p>' + src('<code>system-center/openvas</code> §3 et §4'))],
        verif: [S('Premier rapport', '<p><b>Comment.</b> Lancer la tâche sur <b>une seule cible</b>, lire le rapport (onglets Results, Hosts) (T20). Un rapport « vide » après Host Discovery est normal : le filtre masque les résultats sans gravité.</p>' + src('<code>system-center/openvas</code> §3.4')), FIN]
      };
    },
    /* poste client : marche complète écrite ici (la recette globale reste sur la page Recette). Les débuts
       de texte des étapes déjà existantes ne changent pas : leurs cases restent cochées. */
    clt: function (v, st) {
      var reseau = st.lan.split('/')[0].split('.').slice(0, 3).join('.'), dc = ip('BRU-DC01') + ', ' + ip('PAR-DC01');
      var SV = [['Annuaire et DNS', '<code>nltest /dsgetdc:' + DOM + '</code> · <code>nslookup ' + DOM + '</code>', 'T07'],
        ['Partages (LON-FS01)', '<code>\\\\lon-fs01\\Commun</code>, puis le partage de ton service', 'T11'],
        ['Intranet IIS (NLB)', '<code>http://intranet.' + DOM + '</code>', 'T12'],
        ['SharePoint', '<code>http://sharepoint.' + DOM + '</code>', 'T14'],
        ['Messagerie (OWA)', '<code>https://mail.' + DOM + '/owa</code>', 'T13, T24'],
        ['Redmine', '<code>https://helpdesk.' + DOM + '</code>', 'T16'],
        ['Zabbix (administration)', '<code>http://zabbix.' + DOM + '</code>', 'T15'],
        ['Wazuh (administration)', '<code>https://wazuh.' + DOM + '</code>', 'T19']];
      return {
        prep: [S('Créer la VM depuis le disque parent', P('<p><b>Comment.</b> Hyper-V Manager → New → Virtual Machine : génération 2, ' + T(v, 'ram') + ' Go fixes (mémoire dynamique décochée), ' + T(v, 'vcpu') + ' vCPU, réseau LAN-' + st.id + '. Disque : <b>pas le parent des serveurs</b> (<code>C:\\PARENT\\TEST-SYSPREP.vhdx</code>, Windows Server) ; un parent Windows 11 généralisé si le groupe en a préparé un, sinon un disque dynamique neuf d\'au moins <b>64 Go</b> et l\'ISO Windows 11. Settings → Security : <b>Enable Trusted Platform Module</b>, Secure Boot avec le modèle <i>Microsoft Windows</i>.</p>',
            '<p><b>Pourquoi.</b> Windows 11 refuse de s\'installer sans TPM 2.0, Secure Boot et 64 Go de disque. Un poste client ne se clone pas depuis le parent des serveurs.</p>',
            (+v.disque < 64 ? '<p class="srcl">Le plan prévoit ' + esc(v.disque) + ' Go : c\'est sous le minimum de Windows 11.</p>' : ''),
            '<p><b>Vérifier.</b> La VM démarre sur l\'installation de Windows 11 (ou sur son premier écran de configuration).</p>')),
          plus(S('Réseau en DHCP', '<p><b>Comment.</b> Laisser la carte en DHCP : c\'est le but de ce poste.</p>'),
            '<p>Rien à saisir sur la carte : adresse (' + reseau + '.100 – .199), passerelle (' + st.gw + ') et DNS (' + dc + ') viennent de l\'étendue du site. Vérifie seulement que la carte est sur le commutateur LAN-' + st.id + '.</p>')],
        inst: [S('Installer Windows 11', P('<p><b>Comment.</b> Installation standard depuis l\'ISO (TPM et Secure Boot virtuels activés dans Settings → Security). Édition <b>Professionnelle</b> ou Entreprise : la Famille ne peut pas rejoindre un domaine. Sans clé : « Je n\'ai pas de clé de produit ».</p>',
            '<p>' + AV + ' Si l\'assistant de premier démarrage exige un compte Microsoft, cherche l\'option de compte local ou de jonction à un domaine (son nom change selon la version de Windows 11).</p>',
            '<p><b>Vérifier.</b> <code>winver</code> ; Paramètres → Système → Informations : édition Professionnelle.</p>'))],
        conf: [plus(joindre(v), '<p>Ici, le DNS vient du DHCP : vérifie avec <code>ipconfig /all</code> qu\'il pointe bien vers les contrôleurs (' + dc + ') avant de joindre. Nom et jonction en une fois : <code>Add-Computer -DomainName ' + DOM + ' -NewName ' + esc(v.nom) + ' -Restart</code>.</p>'),
          plus(S('Session de test', '<p><b>Comment.</b> Ouvrir une session avec un compte du domaine de chaque service.</p>'),
            '<p>Les comptes de test sont dans l\'OU <code>EuroCorp\\User</code>. Pour le test des partages (T11), chaque compte doit être membre du groupe de son service (GP-Direction, GP-RH, GP-Finance, GP-IT : chaîne AGDLP de la page Identité).</p>')],
        verif: [S('Adresse reçue de ' + st.nom, '<p><b>Comment.</b> <code>ipconfig /renew</code> puis <code>ipconfig /all</code> : adresse dans <b>' + reseau + '.100 – .199</b>, passerelle <b>' + st.gw + '</b>, DNS = contrôleur(s) du plan. ' + (st.id === 'BRU' || st.id === 'PAR' ? 'Le serveur DHCP est dans ton site (' + st.id + '-DC01), avec son failover.' : 'Pas de serveur DHCP dans ton site : l\'adresse vient de BRU-DC01 ou PAR-DC01 par le relais d\'OPNsense, à travers le tunnel.') + ' (T09)</p>'),
          S('Failover DHCP (T10)', P('<p><b>Comment.</b> Repère le serveur qui a donné l\'adresse (« Serveur DHCP » dans <code>ipconfig /all</code>). Sur ce serveur : <code>Stop-Service DHCPServer</code>. Sur ce poste :</p>', pre('ipconfig /release\nipconfig /renew\nipconfig /all'),
            '<p>Puis relance le service : <code>Start-Service DHCPServer</code>.</p>',
            '<p><b>Vérifier.</b> Le poste a une adresse de la plage et le « Serveur DHCP » indiqué est le partenaire (l\'autre contrôleur). Note le résultat dans la page <a href="recette.html">Recette</a>.</p>')),
          S('Les services accessibles depuis ' + st.nom, '<p><b>Comment.</b> Depuis ce poste, ouvre ou teste chaque service du labo :</p><div class="tw"><table><thead><tr><th>Service</th><th>À ouvrir ou lancer</th><th>Test</th></tr></thead><tbody>' +
            SV.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td><td class="mono">' + x[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
            '<p>Chaque service qui répond depuis ' + st.nom + ' prouve le tunnel, le DNS et la règle de pare-feu correspondants. Zabbix et Wazuh ne sont ouverts qu\'aux postes d\'administration : un refus depuis un simple poste est normal. Résultats dans la page <a href="recette.html">Recette</a>.</p>'), FIN]
      };
    }
  };
  function cle(v) { return window.EURO_MACH.cle(v); }
  function sectionsPour(v, k) { return window.EURO_MACH.sectionsPour(v, k); }
  var DEP = {
    fw: 'Commutateurs <code>WAN</code> et <code>LAN-xx</code> créés sur l\'hôte. Pour monter un tunnel, le pare-feu de l\'autre extrémité doit être installé.',
    dc: 'BRU-DC01 : aucune, c\'est le premier serveur du domaine (après le pare-feu et le tunnel). PAR-DC01 : BRU-DC01 en ligne et tunnel Bruxelles–Paris validé.',
    iis: 'BRU-DC01 (domaine et DNS). BRU-IIS02 : BRU-IIS01 doit exister avant la création du cluster NLB.',
    exch: 'BRU-DC01 (annuaire et autorité de certification), 16 Go de RAM libres sur l\'hôte, disques pour bases et journaux.',
    sql: 'BRU-DC01 (domaine, clé racine KDS pour le gMSA) et tunnel Bruxelles–Paris pour joindre le domaine.',
    sp: 'PAR-SQL01 installé avec la bonne collation, domaine, comptes de service créés.',
    fs: 'BRU-DC01 (domaine), groupes AGDLP créés (page Identité), tunnel Bruxelles–Londres.',
    zabbix: 'DNS <code>zabbix.eurocorp.lan</code> ; tunnels et flux F16/F18 pour recevoir les agents des autres sites.',
    redmine: 'Active Directory (LDAP) joignable, tunnel Bruxelles–Londres, flux F19/F20.',
    wazuh: 'Réglage noyau <code>vm.max_map_count</code>, 8 Go de RAM, DNS <code>wazuh.eurocorp.lan</code>, flux F21/F22.',
    greenbone: 'Accès Internet pour les flux de données (F28), cibles à scanner et accord du formateur.',
    clt: 'Domaine, DHCP (BRU-DC01 ou PAR-DC01) et services du labo à tester.'
  };
  function fluxMachine(v) {
    var re = new RegExp(v.nom.replace(/[-]/g, '\\-')), l = D.flux.filter(function (f) { return re.test(f.de) || re.test(f.vers); });
    if (!l.length) return '<p>Aucun flux nominatif : la machine utilise les flux généraux (DNS, Kerberos, relais DHCP) des postes du LAN.</p>';
    return '<table><thead><tr><th>ID</th><th>De</th><th>Vers</th><th>Ports</th><th>Service</th></tr></thead><tbody>' + l.map(function (f) {
      return '<tr><td>' + esc(f.id) + '</td><td>' + esc(f.de) + '</td><td>' + esc(f.vers) + '</td><td>' + esc(f.proto) + '</td><td>' + esc(f.service) + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  function fiche(v, st, k) {
    var dns = v.nom === 'BRU-DC01' ? 'lui-même (127.0.0.1)' : (/^PAR-DC01$/.test(v.nom) ? ip('BRU-DC01') + ' puis lui-même' : ip('BRU-DC01') + ' puis ' + ip('PAR-DC01'));
    var l = [['Rôle', esc(v.role)], ['Système', esc(v.os)], ['Adresse IP', '<code>' + esc(v.ip) + '</code> /24'], ['Passerelle', '<code>' + esc(st.gw) + '</code> (OPNsense de ' + esc(st.nom) + ')'],
      ['DNS', /Ubuntu|OPNsense/.test(v.os) ? (/OPNsense/.test(v.os) ? 'les deux contrôleurs' : esc(ip('BRU-DC01')) + ' puis ' + esc(ip('PAR-DC01'))) : dns], ['Dimensions', T(v, 'vcpu') + ' vCPU · ' + T(v, 'ram') + ' Go de RAM fixes · disque ' + T(v, 'disque') + ' Go'],
      ['Commutateur', /OPNsense/.test(v.os) ? '<code>WAN</code> (carte 1) puis <code>LAN-' + st.id + '</code> (carte 2)' : '<code>LAN-' + st.id + '</code>'], ['À avoir avant', DEP[k] || '—']];
    return S('Fiche de ' + v.nom, '<table><tbody>' + l.map(function (x) { return '<tr><th scope="row">' + x[0] + '</th><td>' + x[1] + '</td></tr>'; }).join('') + '</tbody></table><p><b>Flux qui concernent cette machine</b> (matrice de ' + D.flux.length + ' flux) :</p>' + fluxMachine(v) + '<p>Les étapes ci-dessous sont dans l\'ordre ; « Détail » reprend le pas à pas des pages 1 à 6 pour cette machine.</p>');
  }
  function enrichir(plan, v, st, k) {
    var SEC = window.EURO_SEC || {}, out = { prep: [], inst: [], conf: [], verif: [], sup: [] };
    PH.forEach(function (p) { out[p[0]] = (plan && plan[p[0]] ? plan[p[0]].filter(Boolean) : []); });
    if (k === 'wazuh') { out.prep.unshift(fiche(v, st, k)); return out; }   // marche complète, sans les sections génériques
    var propre = k === 'sp' || k === 'clt';     // marche écrite en entier : des sections, seules supervision et sécurité
    if (['iis', 'exch', 'fs', 'sql', 'zabbix', 'redmine', 'wazuh', 'greenbone'].indexOf(k) >= 0) {
      PH.forEach(function (p) { out[p[0]] = out[p[0]].filter(function (s) { return /^(Créer la VM|IP fixe|Joindre le domaine|Installer Docker et le plugin|Enregistrement DNS|Ajouter ce nœud|Machine terminée)/.test(s[0]); }); });
    }
    var fin = null;
    PH.forEach(function (p) { var l = out[p[0]]; if (l.length && l[l.length - 1][0] === 'Machine terminée') { fin = l.pop(); } });
    out.prep.unshift(fiche(v, st, k));
    sectionsPour(v, k).forEach(function (s) {
      var sec = SEC[s.t]; if (!sec || (propre && !s.subst)) return;
      PH.forEach(function (p) {
        (sec[p[0]] || []).forEach(function (x) {
          if (s.only && s.only.indexOf(x[0]) < 0) return;
          if (s.skip && s.skip.indexOf(x[0]) >= 0) return;
          var h = window.EURO_MACH.docker(s.t, x[1], v, k);
          if (s.subst) { h = h.replace(/BRU-DC01/g, v.nom).replace(/172\.17\.10\.10(?!\d)/g, v.ip); }
          h = h.replace(/LAN-BRU/g, 'LAN-' + st.id);
          if (s.subst) { if (/^(Répéter pour chaque serveur|Aller plus loin|Faire pareil sur les autres machines|Wazuh ne lit pas le réseau)/.test(x[0])) return; out.sup.push(S('Détail · ' + x[0], h)); }
          else out[p[0]].push(S('Détail · ' + x[0], h));
        });
      });
    });
    if (fin) (out.sup.length ? out.sup : out.verif).push(fin);
    return out;
  }

  var PH = [['prep', 'Préparation'], ['inst', 'Installation'], ['conf', 'Configuration'], ['verif', 'Vérifications'], ['sup', 'Ensuite : supervision et sécurité']];
  document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('marche'); if (!host) return;
    var html = '';
    D.sites.forEach(function (st) {
      html += '<section class="msite" data-site="' + st.id + '"><h2>' + esc(st.nom) + '</h2>';
      (function () {
        var hp = stepsHote(st);
        html += '<article class="vm" data-site="' + st.id + '" data-vm="HOTE-' + st.id + '"><h3>Hôte de ' + esc(st.nom) + ' <small>commutateurs, modèle Sysprep, parent <code>C:\\PARENT\\TEST-SYSPREP.vhdx</code> · à faire en premier</small></h3>';
        var n0 = 0;
        PH.forEach(function (p) {
          if (!hp[p[0]] || !hp[p[0]].length) return;
          html += '<h4>' + p[1] + '</h4><ol style="counter-reset:n ' + n0 + '">' + (n0 += hp[p[0]].length, hp[p[0]]).map(function (s) { return '<li><div class="st"><details><summary>' + s[0] + '</summary><div class="det">' + s[1] + '</div></details></div></li>'; }).join('') + '</ol>';
        });
        html += '</article>';
      })();
      D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }).forEach(function (v) {
        var k = cle(v), plan = k ? enrichir(M[k](v, st), v, st, k) : null;
        html += '<article class="vm" data-site="' + st.id + '" data-vm="' + esc(v.nom) + '"><h3>' + esc(v.nom) + ' <small>' + esc(v.role) + ' · ' + esc(v.ip) + ' · ' + T(v, 'vcpu') + ' vCPU, ' + T(v, 'ram') + ' Go</small></h3>';
        var n0 = 0;
        PH.forEach(function (p) {
          if (!plan || !plan[p[0]] || !plan[p[0]].length) return;
          html += '<h4>' + p[1] + '</h4><ol style="counter-reset:n ' + n0 + '">' + (n0 += plan[p[0]].length, plan[p[0]]).map(function (s) { return '<li><div class="st"><details><summary>' + s[0] + '</summary><div class="det">' + s[1] + '</div></details></div></li>'; }).join('') + '</ol>';
        });
        html += '</article>';
      });
      html += '</section>';
    });
    host.innerHTML = html;
    var sel = { value: '' };
    try { sel.value = localStorage.getItem('euro.machine') || ''; } catch (e) { /* ignoré */ }
    function filtre() {
      var m = sel.value;
      Array.prototype.forEach.call(host.querySelectorAll('.msite'), function (s) {
        var vis = 0;
        Array.prototype.forEach.call(s.querySelectorAll('article.vm'), function (a) {
          var ok = !m || a.getAttribute('data-vm') === m || (/^HOTE-/.test(m) && a.getAttribute('data-site') === m.slice(5)); a.hidden = !ok; if (ok) vis++; });
        s.hidden = !vis;
      });
    }
    filtre();
    function avancement() {
      Array.prototype.forEach.call(host.querySelectorAll('article.vm'), function (a) {
        var cb = Array.prototype.filter.call(a.querySelectorAll('li > input.suivi'), function (c) { return !c.parentNode.parentNode.closest('li'); }), n = 0;   // étapes principales (pas les sous-étapes)
        cb.forEach(function (c) { if (c.checked) n++; });
        var h = a.querySelector('h3'), p = a.querySelector('.avance');
        if (!p) { p = document.createElement('span'); p.className = 'avance'; h.appendChild(p); }
        p.textContent = n + ' / ' + cb.length + ' étapes';
        p.classList.toggle('fini', cb.length > 0 && n === cb.length);
      });
    }
    host.addEventListener('change', avancement);
    setTimeout(avancement, 0);
    window.addEventListener('load', avancement);
    setTimeout(avancement, 500);
  });
})();
