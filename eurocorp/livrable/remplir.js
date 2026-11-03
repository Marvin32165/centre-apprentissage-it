/* Formulaires du livrable : résultats des tests (T01 à T28) et décisions du groupe. Enregistrés dans le navigateur. */
(function () {
  'use strict';
  function init() {
  var L = window.LIVRABLE; if (!L) return;
  var C = L.S.champs;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function val(k, def) { return Object.prototype.hasOwnProperty.call(C, k) ? C[k] : def; }

  /* --- tests ---------------------------------------------------------------------- */
  var ST = [['fait', '✅ OK'], ['encours', '❌ KO'], ['partiel', '🟡 Partiel'], ['afaire', '⬜ À faire']];
  var h = '<div class="tw"><table><thead><tr><th>N°</th><th>Test</th><th>Résultat</th><th>Obtenu</th><th>Date</th><th>Par</th></tr></thead><tbody>';
  (window.TESTS || []).forEach(function (t) {
    var k = 't:' + t.id;
    var opts = ST.map(function (s) { return '<option value="' + s[0] + '"' + (val(k + ':st', t.st) === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('');
    h += '<tr data-id="' + t.id + '"><td><b>' + t.id + '</b></td><td>' + esc(t.test) + '<br><small>' + esc(t.action) + '<br>Attendu : ' + esc(t.attendu) + ' · ' + esc(t.ref) + '</small></td>' +
      '<td><select data-f="st">' + opts + '</select></td>' +
      '<td><textarea data-f="ob" rows="3" style="width:22rem;max-width:100%">' + esc(val(k + ':ob', t.ob)) + '</textarea></td>' +
      '<td><input type="date" data-f="dt" value="' + esc(val(k + ':dt', t.dt)) + '"></td>' +
      '<td><input type="text" data-f="pa" size="12" value="' + esc(val(k + ':pa', t.pa)) + '"></td></tr>';
  });
  h += '</tbody></table></div>';
  var zt = document.getElementById('tests'); if (zt) zt.innerHTML = h;
  function bilan() {
    var n = { fait: 0, encours: 0, partiel: 0, afaire: 0 };
    [].forEach.call(document.querySelectorAll('#tests tr[data-id]'), function (tr) { n[tr.querySelector('[data-f="st"]').value]++; });
    var b = document.getElementById('bilan'); if (b) b.textContent = n.fait + ' OK, ' + n.encours + ' KO, ' + n.partiel + ' partiel(s), ' + n.afaire + ' à faire sur ' + (window.TESTS || []).length;
  }
  if (zt) zt.addEventListener('input', function (e) {
    var tr = e.target.closest('tr[data-id]'); if (!tr) return;
    C['t:' + tr.getAttribute('data-id') + ':' + e.target.getAttribute('data-f')] = e.target.value; L.save(); bilan();
  });
  if (zt) zt.addEventListener('change', function (e) {
    var tr = e.target.closest('tr[data-id]'); if (!tr) return;
    C['t:' + tr.getAttribute('data-id') + ':' + e.target.getAttribute('data-f')] = e.target.value; L.save(); bilan();
  });
  bilan();
  var bc = document.getElementById('csv');
  if (bc) bc.addEventListener('click', function () {
    var rows = [['N°', 'Test', 'Résultat', 'Obtenu', 'Date', 'Par']];
    [].forEach.call(document.querySelectorAll('#tests tr[data-id]'), function (tr) {
      var id = tr.getAttribute('data-id'), t = (window.TESTS || []).filter(function (x) { return x.id === id; })[0] || {};
      var st = tr.querySelector('[data-f="st"]'); rows.push([id, t.test, st.options[st.selectedIndex].text, tr.querySelector('[data-f="ob"]').value, tr.querySelector('[data-f="dt"]').value, tr.querySelector('[data-f="pa"]').value]);
    });
    var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""').replace(/\n/g, ' ') + '"'; }).join(';'); }).join('\r\n');
    L.telecharger('rapport-tests-eurocorp.csv', csv, 'text/csv'); L.note('CSV téléchargé.');
  });

  /* --- décisions du groupe ---------------------------------------------------------- */
  var D = [
    ['d:freq', 'Fréquence de réplication Hyper-V Replica', 'select', ['30 secondes', '5 minutes', '15 minutes'], '5 minutes'],
    ['d:rpo', 'RPO retenu (données perdues au pire)', 'text', null, '≤ 5 minutes'],
    ['d:rto', 'RTO retenu (temps pour repartir)', 'text', null, '≤ 30 minutes'],
    ['d:cible', 'Hôte cible de la réplication de LON-FS01', 'select', ['Paris (2-PARIS)', 'Bruxelles (2-BRUXELL)'], 'Paris (2-PARIS)'],
    ['d:pts', 'Points de récupération conservés', 'text', null, '2'],
    ['d:nlb', 'Mode NLB retenu', 'select', ['Unicast', 'Multicast', 'IGMP multicast'], 'Unicast'],
    ['d:sp', 'Sauvegarde des bases SharePoint (méthode, fréquence)', 'area', null, ''],
    ['d:mem', 'Justification mémoire statique ou dynamique', 'area', null, 'Statique partout : charges prévisibles (AD, SQL, SharePoint, Exchange, Docker), pas de surallocation.'],
    ['d:vm', 'Renommage des VM Hyper-V (liste et date)', 'area', null, ''],
    ['d:notes', 'Notes libres pour la soutenance', 'area', null, '']
  ];
  var f = '';
  D.forEach(function (d) {
    var v = val(d[0], d[4]), c;
    if (d[2] === 'select') c = '<select data-d="' + d[0] + '">' + d[3].map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    else if (d[2] === 'area') c = '<textarea data-d="' + d[0] + '" rows="3" style="width:100%">' + esc(v) + '</textarea>';
    else c = '<input type="text" data-d="' + d[0] + '" size="30" value="' + esc(v) + '">';
    f += '<p><label><b>' + esc(d[1]) + '</b><br>' + c + '</label></p>';
  });
  var zd = document.getElementById('decisions'); if (zd) zd.innerHTML = f;
  function maj(e) { var k = e.target.getAttribute && e.target.getAttribute('data-d'); if (!k) return; C[k] = e.target.value; L.save(); }
  if (zd) { zd.addEventListener('input', maj); zd.addEventListener('change', maj); }
  }
  if (window.LIVRABLE) init(); else window.addEventListener('load', init);
})();

