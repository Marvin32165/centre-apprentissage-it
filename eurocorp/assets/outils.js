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
      (marge >= 0 ? 'Ça tient (mémoire statique, sans mémoire dynamique).' : 'Ça ne tient pas, et la mémoire dynamique est exclue : réduis la RAM d\'une VM, regroupe des rôles ou reporte des VM (Wazuh, Exchange, SharePoint sont les plus gourmandes).') + '</p>';
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


  /* 4. Et si on retirait des VM ? */
  var wi = null;
  function whatif() {
    var host = +$('#ram-host').value || 0, res = +$('#ram-res').value || 0, tot = 0, n = 0;
    wi.forEach(function (r) { if (r.cb.checked) { tot += +r.in.value || 0; n++; } });
    var m = host - res - tot;
    $('#wi-out').innerHTML = '<p><b>' + n + ' VM gardées, ' + tot + ' Go. Marge : ' + m + ' Go.</b> ' + (m >= 0 ? 'Ça tient.' : 'Il manque ' + (-m) + ' Go.') + '</p>';
  }
  function whatifInit() {
    var tb = $('#wi-rows'); wi = [];
    D.vms.filter(function (v) { return !v.virtuel; }).forEach(function (v) {
      var tr = document.createElement('tr'), cb = document.createElement('input'), inp = document.createElement('input');
      cb.type = 'checkbox'; cb.checked = true; cb.setAttribute('aria-label', 'Garder ' + v.nom); inp.type = 'number'; inp.value = v.ram; inp.min = 0; inp.style.width = '70px'; inp.setAttribute('aria-label', 'RAM de ' + v.nom);
      [cb, document.createTextNode(v.nom), document.createTextNode(v.role), inp].forEach(function (x) { var td = document.createElement('td'); td.appendChild(x); tr.appendChild(td); });
      tb.appendChild(tr); wi.push({ cb: cb, in: inp }); cb.addEventListener('change', whatif); inp.addEventListener('input', whatif);
    });
    ['ram-host', 'ram-res'].forEach(function (i) { $('#' + i).addEventListener('input', whatif); }); whatif();
  }

  /* 5. Hyper-V */
  function hv() {
    var site = $('#hv-site').value, par = $('#hv-parent').value.trim(), dir = $('#hv-dir').value.trim().replace(/\\$/, ''), o = [];
    o.push('# Généré par l\'outil EUROCORP — à relire. Le disque parent n\'est jamais modifié (différentiels).');
    o.push('$parent = "' + par + '"', '$dir = "' + dir + '"', '$sw = "LAN-' + site + '"   # commutateur privé du site (hypothèse)', '');
    D.vms.filter(function (v) { return !v.virtuel && v.site === site && /windows/i.test(v.os); }).forEach(function (v) {
      o.push('# ' + v.nom + ' — ' + v.role + ' (' + v.vcpu + ' vCPU, ' + v.ram + ' Go, mémoire statique)');
      o.push('New-VHD -Path "$dir\\' + v.nom + '\\' + v.nom + '.vhdx" -ParentPath $parent -Differencing | Out-Null');
      o.push('New-VM -Name "' + v.nom + '" -Generation 2 -MemoryStartupBytes ' + v.ram + 'GB -VHDPath "$dir\\' + v.nom + '\\' + v.nom + '.vhdx" -Path "$dir" -SwitchName $sw | Out-Null');
      o.push('Set-VMProcessor -VMName "' + v.nom + '" -Count ' + v.vcpu);
      o.push('Set-VMMemory -VMName "' + v.nom + '" -DynamicMemoryEnabled $false', '');
    });
    if (o.length < 6) o.push('# Aucune VM Windows pour ce site.');
    $('#hv-out').textContent = o.join('\n');
  }

  /* 6. DNS */
  function dnsGen() {
    var z = (D.meta && D.meta.domaine) || 'eurocorp.lan', o = ['# Enregistrements du plan dans la zone ' + z + ' — à lancer sur un DC, après relecture.'];
    D.vms.filter(function (v) { return !v.virtuel && v.ip && /^\d+\.\d+\.\d+\.\d+$/.test(v.ip); }).forEach(function (v) {
      o.push('Add-DnsServerResourceRecordA -ZoneName "' + z + '" -Name "' + v.nom.toLowerCase() + '" -IPv4Address "' + v.ip + '"');
    });
    (D.dns || []).filter(function (r) { return r.type === 'CNAME'; }).forEach(function (r) {
      o.push('Add-DnsServerResourceRecordCName -ZoneName "' + z + '" -Name "' + r.nom + '" -HostNameAlias "' + r.cible + '."');
    });
    $('#dns-out').textContent = o.join('\n');
  }


  /* 7. flux */
  function fluxInit() {
    var sel = $('#fx-id');
    D.flux.forEach(function (f) { var o = document.createElement('option'); o.value = f.id; o.textContent = f.id + ' — ' + f.service + ' (' + f.proto + ')'; sel.appendChild(o); });
    sel.addEventListener('input', flux); $('#fx-cible').addEventListener('input', flux); flux();
  }
  function flux() {
    var f = D.flux.filter(function (x) { return x.id === $('#fx-id').value; })[0], cible = $('#fx-cible').value.trim(), o = [];
    if (!f) return;
    o.push('# ' + f.id + ' — ' + f.service + ' : ' + f.de + ' -> ' + f.vers + ' (' + f.proto + ')');
    var re = /TCP\s+([\d,\s]+)/g, m, ports = [];
    var txt = f.proto.replace(/TCP\/UDP/g, 'TCP');
    while ((m = re.exec(txt))) m[1].split(',').forEach(function (p) { p = p.trim(); if (/^\d+$/.test(p) && ports.indexOf(p) < 0) ports.push(p); });
    ports.forEach(function (p) { o.push('Test-NetConnection -ComputerName ' + cible + ' -Port ' + p + ' | Select-Object ComputerName, RemotePort, TcpTestSucceeded'); });
    if (/UDP/.test(f.proto)) o.push('# UDP : Test-NetConnection ne teste pas l\'UDP. Vérifier par le service (ex. nslookup pour le DNS) ou par les journaux du pare-feu.');
    if (/ICMP/i.test(f.proto)) o.push('Test-Connection -ComputerName ' + cible + ' -Count 2');
    if (!ports.length && !/ICMP/i.test(f.proto)) o.push('# Pas de port TCP à tester pour ce flux : voir le protocole.');
    o.push('# Si ça échoue : journaux du pare-feu (Firewall > Log Files > Live View) et route/tunnel IPsec.');
    $('#fx-out').textContent = o.join('\n');
  }

  /* 8. secrets */
  function rnd(n, set) { var a = new Uint32Array(n), s = ''; (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < n; i++) s += set.charAt(a[i] % set.length); return s; }
  function secrets() {
    var AN = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789', HEX = '0123456789abcdef';
    var rows = [['Mot de passe de labo (24 car.)', rnd(24, AN)], ['Clé IPsec partagée (40 car.)', rnd(40, AN)], ['PSK Zabbix (64 hex = 32 octets)', rnd(64, HEX)], ['Clé de session Redmine (64 hex)', rnd(64, HEX)], ['Secret partagé DHCP failover (20 car.)', rnd(20, AN)]];
    $('#sec-rows').innerHTML = rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td class="mono" style="word-break:break-all">' + esc(r[1]) + '</td></tr>'; }).join('');
  }

  /* 9. DHCP */
  function ipOf(nom) { var v = D.vms.filter(function (x) { return x.nom === nom; })[0]; return v ? v.ip : ''; }
  function dhcp() {
    var o = ['# Généré par l\'outil EUROCORP — à relire. Serveur principal : BRU-DC01.'], dns = [ipOf('BRU-DC01'), ipOf('PAR-DC01')].filter(Boolean).join(',');
    o.push('Add-DhcpServerInDC   # autorise le serveur dans l\'AD', '');
    D.sites.forEach(function (s) {
      var b = s.lan.split('/')[0].split('.').slice(0, 3).join('.');
      o.push('Add-DhcpServerv4Scope -Name "LAN ' + s.nom + '" -StartRange ' + b + '.100 -EndRange ' + b + '.199 -SubnetMask 255.255.255.0 -State Active');
      o.push('Set-DhcpServerv4OptionValue -ScopeId ' + b + '.0 -Router ' + s.gw + ' -DnsServer ' + dns + ' -DnsDomain ' + D.meta.domaine);
    });
    o.push('', '$secret = Read-Host "Secret partagé du failover"');
    o.push('Add-DhcpServerv4Failover -Name "BRU-PAR" -PartnerServer "' + $('#dh-par').value.trim() + '" -ScopeId ' + D.sites.map(function (s) { return s.lan.split('/')[0]; }).join(',') + ' -LoadBalancePercent 50 -SharedSecret $secret');
    $('#dh-out').textContent = o.join('\n');
  }

  /* 10. sites AD */
  function adSites() {
    var o = ['# Généré par l\'outil EUROCORP — à relire. À lancer sur un contrôleur de domaine.'];
    D.sites.forEach(function (s) {
      o.push('New-ADReplicationSite -Name "' + s.id + '"');
      o.push('New-ADReplicationSubnet -Name "' + s.lan + '" -Site "' + s.id + '"');
    });
    D.sites.filter(function (s) { return s.id !== 'BRU'; }).forEach(function (s) {
      o.push('New-ADReplicationSiteLink -Name "BRU-' + s.id + '" -SitesIncluded "BRU","' + s.id + '" -Cost 100 -ReplicationFrequencyInMinutes 15 -InterSiteTransportProtocol IP');
    });
    o.push('# Déplacer ensuite chaque DC dans son site : Move-ADDirectoryServer -Identity "<DC>" -Site "<SITE>"');
    $('#as-out').textContent = o.join('\n');
  }

  /* 11. Replica */
  function replica() {
    var hote = $('#rp-hote').value.trim(), f = $('#rp-freq').value, o = ['# Généré par l\'outil EUROCORP — à relire.', '# 1) Sur l\'hôte cible (' + hote + ') : accepter les réplications (Kerberos, port 80).', 'Set-VMReplicationServer -ReplicationEnabled $true -AllowedAuthenticationType Kerberos -ReplicationAllowedFromAnyServer $true -DefaultStorageLocation "D:\\Replica"', 'Enable-NetFirewallRule -DisplayName "Hyper-V Replica HTTP Listener (TCP-In)"', '', '# 2) Sur l\'hôte source : activer la réplication des VM prévues.'];
    var list = D.vms.filter(function (v) { return !v.virtuel && v.replica; });
    list.forEach(function (v) {
      o.push('Enable-VMReplication -VMName "' + v.nom + '" -ReplicaServerName "' + hote + '" -ReplicaServerPort 80 -AuthenticationType Kerberos -ReplicationFrequencySec ' + f);
      o.push('Start-VMInitialReplication -VMName "' + v.nom + '"');
    });
    if (!list.length) o.push('# Aucune VM avec réplica dans le plan.');
    o.push('', '# 3) Suivi : Get-VMReplication | Select Name, State, Health, LastReplicationTime');
    $('#rp-out').textContent = o.join('\n');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!$('#ram-out')) return;
    ['ram-host', 'ram-res'].forEach(function (i) { $('#' + i).addEventListener('input', ram); }); ram();
    $('#ip-in').addEventListener('input', cidr); cidr();
    $('#cd-in').addEventListener('input', sub); sub();
    ['ad-dom', 'ad-ou', 'ad-csv'].forEach(function (i) { $('#' + i).addEventListener('input', ad); }); ad();
    whatifInit(); ['hv-site', 'hv-parent', 'hv-dir'].forEach(function (i) { $('#' + i).addEventListener('input', hv); }); hv(); dnsGen();
    fluxInit(); secrets(); $('#sec-go').addEventListener('click', secrets); dhcp(); $('#dh-par').addEventListener('input', dhcp); adSites(); replica(); ['rp-hote', 'rp-freq'].forEach(function (i) { $('#' + i).addEventListener('input', replica); });
  });
})();
