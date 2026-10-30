/* Marche à suivre par machine : étapes dans l'ordre, selon le rôle de chaque VM. Les cases sont gérées par app.js (suivi). */
(function () {
  'use strict';
  var D = window.EURO;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var VM_BASE = ['Créer la VM depuis le disque parent (disque différentiel, génération 2, mémoire statique) : <a href="preparer.html">Préparer</a>', 'IP fixe, renommer la machine en dernier (redémarrage)'];
  var FIN = 'Machine terminée : tests passés, noter le résultat dans <code>09-Tests</code> et <code>Infos.md</code>';
  function site(id) { return D.sites.filter(function (s) { return s.id === id; })[0]; }
  var ETAPES = {
    fw: function (v, st) {
      var hub = st.id === 'BRU';
      return ['Créer la VM OPNsense avec deux cartes : WAN (commutateur externe) et LAN (commutateur privé du site)',
        'Installer OPNsense ; WAN ' + st.wan + ' (passerelle de la salle ' + D.meta.passerelle_salle + '), LAN ' + st.gw + '/24',
        'Ouvrir l\'interface web depuis le LAN, changer le mot de passe par défaut (à noter dans <code>Infos.md</code>)',
        hub ? 'Monter les 3 tunnels IPsec côté hub (Paris, Londres, Berlin), un /30 chacun : <a href="reseau.html">Réseau</a>' : 'Monter le tunnel IPsec vers Bruxelles (côté spoke), mêmes clés et réseaux inversés : <a href="reseau.html">Réseau</a>',
        'Vérifier un ping LAN à LAN dans chaque tunnel (tests T01 à T04)',
        'Remplacer « tout autorisé » par les règles de la matrice (28 flux) : <a href="reseau.html">Réseau</a>',
        hub ? 'Prévoir le relais DHCP pour les sites sans serveur DHCP' : 'Relais DHCP vers le serveur DHCP du plan, si ce site n\'a pas de serveur DHCP', FIN];
    },
    dc: function (v, st) {
      var premier = v.nom === 'BRU-DC01';
      return VM_BASE.concat([
        premier ? 'Installer AD DS + DNS, créer la forêt <code>' + D.meta.domaine + '</code> (jour 1 : fait, à terminer)' : 'DNS = BRU-DC01, joindre le domaine, puis promouvoir en contrôleur de domaine',
        'Sites AD : créer le site ' + st.id + ' et son sous-réseau ' + st.lan + ' (outil « Sites AD »)',
        'DHCP : installer le rôle, autoriser le serveur dans l\'AD, étendue .100–.199, routeur ' + st.gw,
        premier ? 'Failover DHCP avec PAR-DC01 (outil « DHCP »)' : 'Failover DHCP avec BRU-DC01 (outil « DHCP »)',
        'Tests : DNS (T07), réplication AD (T08), DHCP (T09, T10)', FIN]);
    },
    iis: function (v) {
      return VM_BASE.concat(['Joindre le domaine', 'Installer le rôle Web Server (IIS) : voir tes notes <code>iis</code>', 'Créer le site et la page de test (même contenu sur les deux nœuds)',
        v.nom === 'BRU-IIS01' ? 'Décider unicast ou multicast, créer le cluster NLB et l\'adresse virtuelle (' + (D.dns.filter(function (r) { return /intranet/.test(r.nom); })[0] || { nom: 'intranet' }).nom + ')' : 'Ajouter ce nœud au cluster NLB',
        'Test : arrêter un nœud, recharger la page (T12)', FIN]);
    },
    exch: function () {
      return VM_BASE.concat(['Joindre le domaine ; vérifier que le schéma AD est prêt', 'PKI : installer AD CS (autorité interne) : voir <code>exchange</code> §7 à §10', 'Installer Exchange Server SE', 'Créer les bases et quelques boîtes (Direction, RH, Finance, IT)', 'Certificat d\'Exchange délivré par la CA interne', 'Test : courrier entre deux boîtes (T13)', FIN]);
    },
    sql: function () {
      return VM_BASE.concat(['Joindre le domaine', 'Installer SQL Server ; collation <code>Latin1_General_CI_AS_KS_WS</code> et SQL Server Browser en automatique', 'Sur l\'AD : clé KDS, OU GMSA, groupe, compte gMSA (voir <a href="services.html">Services</a>)', 'Donner le gMSA aux services SQL (sauf Browser)', FIN]);
    },
    sp: function () {
      return VM_BASE.concat(['Joindre le domaine', 'Installer les prérequis SharePoint puis SharePoint Server SE (tes notes s\'arrêtent avant)', 'Créer la ferme (base sur PAR-SQL01), comptes de service gMSA', 'Créer le site, test d\'ouverture (T14)', FIN]);
    },
    fs: function () {
      return VM_BASE.concat(['Joindre le domaine', 'Rôle serveur de fichiers ; dossiers Direction, RH, Finance, IT, Commun', 'Groupes AGDLP (globaux par service → locaux de domaine → permissions NTFS) : <a href="services.html">Services</a>', 'Partages + permissions NTFS, tester avec un utilisateur de chaque service (T11)', 'Hyper-V Replica vers Paris : voir <code>07-Sauvegarde-PRA</code> (T21)', FIN]);
    },
    zabbix: function () {
      return ['Créer la VM Ubuntu Server 24.04 (IP fixe)', 'Installer Docker et le plugin Compose (tes notes <code>docker</code> §3)', 'Copier <code>05-Docker/zabbix/</code>, <code>chmod 600 .env</code>', '<code>docker compose config -q</code> puis <code>docker compose up -d</code> : <a href="docker.html">Docker</a>', 'Installer l\'agent 2 avec PSK sur les autres machines (script <code>08-Supervision-Securite</code>), créer les hôtes', 'Test : valeurs reçues pour chaque site (T15)', FIN];
    },
    redmine: function () {
      return ['Créer la VM Ubuntu Server 24.04 (IP fixe)', 'Installer Docker et le plugin Compose', 'Copier <code>05-Docker/redmine/</code> dans <code>/opt/redmine</code>, <code>chmod 600 .env</code>', 'Lancer la pile, ouvrir <code>https://helpdesk.eurocorp.lan</code> (certificat auto-signé)', 'Authentification LDAP sur l\'AD, créer les trackers', 'Planifier <code>backup-redmine.sh</code> et tester la restauration (T16 à T18) : <code>07-Sauvegarde-PRA</code>', FIN];
    },
    wazuh: function () {
      return ['Créer la VM Ubuntu Server 24.04 (IP fixe)', 'Installer Docker et Compose', 'Déployer Wazuh : <code>05-Docker/wazuh/README.md</code> (choix Docker ou tout-en-un à trancher)', 'Installer Sysmon (<code>08-Supervision-Securite/sysmonconfig.xml</code>) et l\'agent Wazuh sur des Windows ; lire le journal <code>Microsoft-Windows-Sysmon/Operational</code>', 'Test : provoquer un événement, le retrouver dans Wazuh (T19)', FIN];
    },
    greenbone: function () {
      return ['Créer la VM Ubuntu Server 24.04 (IP fixe)', 'Installer Docker et Compose', 'Récupérer le compose officiel : <code>05-Docker/greenbone/fetch-compose.sh</code>', 'Lancer, attendre la synchronisation des flux, ouvrir l\'interface (443 / 9392)', 'Premier scan sur une seule cible (T20)', FIN];
    },
    clt: function () {
      return ['Créer la VM Windows 11 (optionnelle)', 'Joindre le domaine, ouvrir une session avec un compte de test', 'Servir de poste de test : DHCP, partages, intranet, Redmine (T09, T11, T12, T16)', FIN];
    }
  };
  function cle(v) {
    var n = v.nom;
    if (/-FW01$/.test(n)) return 'fw'; if (/-DC01$/.test(n)) return 'dc'; if (/-IIS0/.test(n)) return 'iis'; if (/EXCH/.test(n)) return 'exch';
    if (/SQL/.test(n)) return 'sql'; if (/-SP0/.test(n)) return 'sp'; if (/-FS0/.test(n)) return 'fs'; if (n === 'BRU-DOCKER01') return 'zabbix';
    if (n === 'LON-DOCKER01') return 'redmine'; if (n === 'BER-DOCKER01') return 'wazuh'; if (n === 'BER-DOCKER02') return 'greenbone'; if (/-CLT01$/.test(n)) return 'clt'; return '';
  }
  document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('marche'); if (!host) return;
    var html = '';
    D.sites.forEach(function (st) {
      html += '<section class="msite" data-site="' + st.id + '"><h2>' + esc(st.nom) + '</h2>';
      D.vms.filter(function (v) { return !v.virtuel && v.site === st.id; }).forEach(function (v) {
        var k = cle(v), steps = k ? ETAPES[k](v, st) : ['Étapes à définir pour cette machine'];
        html += '<article class="vm"><h3>' + esc(v.nom) + ' <small>' + esc(v.role) + ' · ' + esc(v.ip) + ' · ' + v.vcpu + ' vCPU, ' + v.ram + ' Go</small></h3><ol>' +
          steps.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol></article>';
      });
      html += '</section>';
    });
    host.innerHTML = html;
    var me = window.EURO_MOI && window.EURO_MOI();
    Array.prototype.forEach.call(host.querySelectorAll('.msite'), function (s) { s.hidden = !!me && s.getAttribute('data-site') !== me.id; });
  });
})();
