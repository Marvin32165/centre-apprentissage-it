/* Outils du labo : budget RAM, vérificateur d'adresse, générateur de script New-ADUser. Tout reste dans le navigateur. */
(function () {
  'use strict';
  var D = window.EURO, $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* 1. Budget RAM */
  function ram() {
    var host = +$('#ram-host').value || 0, res = +$('#ram-res').value || 0, rows = '', tot = 0;
    ['BRU', 'PAR', 'LON', 'BER'].forEach(function (s) {
      var t = D.vms.filter(function (v) { return !v.virtuel && v.site === s; }).reduce(function (a, v) { return a + (+v.ram || 0); }, 0);
      tot += t; rows += '<tr><td>' + s + '</td><td>' + t + ' Go</td></tr>';
    });
    var marge = host - res - tot;
    $('#ram-out').innerHTML = '<div class="tw"><table><thead><tr><th>Site</th><th>RAM des VM</th></tr></thead><tbody>' + rows +
      '<tr><td><b>Total VM</b></td><td><b>' + tot + ' Go</b></td></tr><tr><td>Hôte + réserve</td><td>' + res + ' Go</td></tr></tbody></table></div>' +
      '<p class="' + (marge >= 0 ? '' : 'warnline') + '"><b>Marge : ' + marge + ' Go</b> sur ' + host + ' Go. ' +
      (marge >= 0 ? 'Ça tient. Les VM à mémoire dynamique peuvent descendre en dessous de leur valeur.' : 'Ça ne tient pas : réduis une VM (Wazuh, Exchange, SharePoint sont les plus gourmandes) ou passe en mémoire dynamique.') + '</p>';
  }

  /* 2. Adresse / CIDR */
  function ip2n(s) { var p = s.trim().split('.'); if (p.length !== 4) return null; var n = 0; for (var i = 0; i < 4; i++) { var x = +p[i]; if (!/^\d+$/.test(p[i]) || x > 255) return null; n = n * 256 + x; } return n; }
  function n2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  function cidr() {
    var ip = $('#ip-in').value, out = $('#ip-out'), n = ip2n(ip);
    if (n === null) { out.innerHTML = '<p>Adresse invalide.</p>'; return; }
    var hit = null;
    Object.keys(D.plages || {}).length;
    var site = (D.sites || []).filter(function (s) { return s.lan && ip2n(s.lan.split('/')[0]) !== null && (n >>> 8) === (ip2n(s.lan.split('/')[0]) >>> 8); })[0];
    var last = n & 255, txt = '';
    if (site) {
      txt = 'Appartient au LAN de <b>' + esc(site.nom || site.id) + '</b> (' + esc(site.lan) + '). ';
      txt += last === 1 ? 'Passerelle (pare-feu).' : last >= 10 && last <= 49 ? 'Plage serveurs (.10–.49).' : last >= 50 && last <= 99 ? 'Plage adresses virtuelles / NLB (.50–.99).' : last >= 100 && last <= 199 ? 'Plage DHCP (.100–.199) : pas d\'adresse fixe ici.' : last === 250 ? 'Hôte Hyper-V.' : 'Hors plan : à justifier.';
    } else if ((n >>> 8) === (ip2n('172.17.255.0') >>> 8)) txt = 'Réseau des tunnels IPsec (172.17.255.0/24, découpé en /30).';
    else if ((n >>> 8) === (ip2n('10.10.28.0') >>> 8)) txt = 'Réseau de la salle (WAN des pare-feu).';
    else txt = 'Hors du plan EUROCORP.';
    out.innerHTML = '<p>' + txt + '</p>';
  }
  function sub() {
    var v = $('#cd-in').value.trim().split('/'), n = ip2n(v[0] || ''), m = +v[1], out = $('#cd-out');
    if (n === null || !(m >= 0 && m <= 32) || v.length !== 2) { out.innerHTML = '<p>Format attendu : 172.17.10.0/24</p>'; return; }
    var size = Math.pow(2, 32 - m), base = Math.floor(n / size) * size;
    out.innerHTML = '<div class="tw"><table><tbody><tr><td>Réseau</td><td class="mono">' + n2ip(base) + '/' + m + '</td></tr><tr><td>Diffusion</td><td class="mono">' + n2ip(base + size - 1) + '</td></tr><tr><td>Premier / dernier hôte</td><td class="mono">' + (m >= 31 ? '—' : n2ip(base + 1) + ' / ' + n2ip(base + size - 2)) + '</td></tr><tr><td>Hôtes utilisables</td><td>' + (m >= 31 ? 0 : size - 2) + '</td></tr></tbody></table></div>';
  }

  /* 3. CSV -> New-ADUser */
  function ad() {
    var dom = $('#ad-dom').value.trim(), ou = $('#ad-ou').value.trim(), lines = $('#ad-csv').value.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean), out = [];
    out.push('# Généré par l\'outil EUROCORP : à relire avant de lancer. Le mot de passe initial est demandé, jamais écrit dans le script.');
    out.push('Import-Module ActiveDirectory');
    out.push('$mdp = Read-Host "Mot de passe initial" -AsSecureString');
    lines.forEach(function (l) {
      var c = l.split(/[;,]/).map(function (x) { return x.trim(); });
      if (c.length < 3 || /^pr[eé]nom$/i.test(c[0])) return;
      var sam = (c[0].charAt(0) + c[1]).toLowerCase().replace(/[^a-z0-9]/g, '');
      out.push('New-ADUser -Name "' + c[0] + ' ' + c[1] + '" -GivenName "' + c[0] + '" -Surname "' + c[1] + '" -SamAccountName "' + sam + '" -UserPrincipalName "' + sam + '@' + dom + '" -Path "' + ou + '" -Department "' + c[2] + '" -AccountPassword $mdp -ChangePasswordAtLogon $true -Enabled $true');
    });
    $('#ad-out').textContent = out.join('\n');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!$('#ram-out')) return;
    ['ram-host', 'ram-res'].forEach(function (i) { $('#' + i).addEventListener('input', ram); }); ram();
    $('#ip-in').addEventListener('input', cidr); cidr();
    $('#cd-in').addEventListener('input', sub); sub();
    ['ad-dom', 'ad-ou', 'ad-csv'].forEach(function (i) { $('#' + i).addEventListener('input', ad); }); ad();
  });
})();
