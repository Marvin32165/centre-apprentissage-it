/* Livrable EUROCORP : pages modifiables, cases à cocher, enregistrement local (navigateur), export/import JSON.
   Aucune donnée n'est envoyée nulle part : tout reste dans le localStorage de ce navigateur. */
(function () {
  'use strict';
  var PAGE = (location.pathname.split('/').pop() || 'index.html');
  var KEY = 'euro.livrable.v1';
  var corps = document.getElementById('corps');
  if (!corps) return;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { note('Enregistrement impossible dans ce navigateur (stockage bloqué).'); return false; } }
  var S = load(); S.pages = S.pages || {}; S.coches = S.coches || {}; S.champs = S.champs || {};
  window.LIVRABLE = { S: S, save: save, note: note, telecharger: telecharger };

  /* --- message discret ---------------------------------------------------- */
  var msg = document.createElement('div');
  msg.setAttribute('role', 'status');
  msg.style.cssText = 'position:fixed;right:12px;bottom:12px;background:#2b2118;color:#fff;padding:.5rem .8rem;border-radius:6px;font-size:.9rem;opacity:0;transition:opacity .2s;z-index:50;max-width:80vw';
  document.body.appendChild(msg);
  var tm = 0;
  function note(t) { msg.textContent = t; msg.style.opacity = '1'; clearTimeout(tm); tm = setTimeout(function () { msg.style.opacity = '0'; }, 2600); }

  function telecharger(nom, texte, type) {
    var b = new Blob([texte], { type: type || 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = nom; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* --- restaurer le contenu modifié de cette page -------------------------- */
  if (S.pages[PAGE]) corps.innerHTML = S.pages[PAGE];

  /* --- cases à cocher sur les listes (sauf l'index) --------------------------- */
  function cle(li) { return PAGE + '|' + (li.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70); }
  function poserCases() {
    if (PAGE === 'index.html' || PAGE === 'remplir.html') return;
    [].forEach.call(corps.querySelectorAll('li'), function (li) {
      if (li.querySelector(':scope > input.coche')) return;
      var cb = document.createElement('input');
      cb.type = 'checkbox'; cb.className = 'coche'; cb.setAttribute('aria-label', 'Fait'); cb.style.marginRight = '.45rem';
      li.insertBefore(cb, li.firstChild);
      li.style.listStyle = 'none';
    });
    [].forEach.call(corps.querySelectorAll('input.coche'), function (cb) { cb.checked = !!S.coches[cle(cb.parentNode)]; majLigne(cb); });
    compter();
  }
  function majLigne(cb) { cb.parentNode.style.opacity = cb.checked ? '.55' : '1'; cb.parentNode.style.textDecoration = cb.checked ? 'line-through' : 'none'; }
  function compter() {
    var t = corps.querySelectorAll('input.coche'), n = [].filter.call(t, function (c) { return c.checked; }).length, el = document.getElementById('livrable-compte');
    if (el) el.textContent = t.length ? n + ' / ' + t.length + ' cochés' : '';
  }
  corps.addEventListener('change', function (e) {
    var cb = e.target; if (!cb.classList || !cb.classList.contains('coche')) return;
    var k = cle(cb.parentNode); if (cb.checked) S.coches[k] = new Date().toISOString().slice(0, 16); else delete S.coches[k];
    majLigne(cb); compter(); save();
  });

  /* --- barre d'outils ----------------------------------------------------------- */
  var bar = document.createElement('div');
  bar.id = 'livrable-barre';
  bar.style.cssText = 'position:sticky;top:0;z-index:40;background:#efe6d3;border-bottom:1px solid #c9b99a;padding:.4rem .6rem;display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;font-size:.9rem';
  bar.innerHTML = '<button type="button" data-a="edit">✏️ Modifier la page</button>' +
    '<button type="button" data-a="reset">↩ Rétablir l\'original</button>' +
    '<button type="button" data-a="export">⬇ Exporter tout (JSON)</button>' +
    '<label style="cursor:pointer"><span style="border:1px solid #888;border-radius:4px;padding:.15rem .5rem;background:#fff">⬆ Importer</span><input type="file" accept="application/json,.json" data-a="import" hidden></label>' +
    '<button type="button" data-a="page">💾 Télécharger cette page</button>' +
    '<button type="button" data-a="print">🖨 Imprimer / PDF</button>' +
    '<span id="livrable-compte" style="margin-left:auto"></span>' +
    '<span style="color:#6b5a45">Enregistré dans ce navigateur</span>';
  corps.parentNode.insertBefore(bar, corps);
  var edition = false;
  function majEdition() {
    corps.contentEditable = edition ? 'true' : 'false';
    corps.style.outline = edition ? '2px dashed #b4552d' : 'none';
    bar.querySelector('[data-a="edit"]').textContent = edition ? '✔ Terminer la modification' : '✏️ Modifier la page';
  }
  var dt = 0;
  function planifier() { clearTimeout(dt); dt = setTimeout(function () { sauverPage(); }, 600); }
  function sauverPage() {
    var copie = corps.cloneNode(true);
    [].forEach.call(copie.querySelectorAll('input.coche'), function (c) { c.removeAttribute('checked'); });
    S.pages[PAGE] = copie.innerHTML; save();
  }
  corps.addEventListener('input', function () { if (edition) planifier(); });
  bar.addEventListener('click', function (e) {
    var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
    if (a === 'edit') { edition = !edition; majEdition(); if (!edition) { sauverPage(); poserCases(); note('Modifications enregistrées dans ce navigateur.'); } }
    if (a === 'reset') { if (confirm('Rétablir le texte original de cette page ? Les cases cochées sont gardées.')) { delete S.pages[PAGE]; save(); location.reload(); } }
    if (a === 'export') { telecharger('livrable-eurocorp-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(S, null, 2)); note('Export téléchargé.'); }
    if (a === 'page') { var h = '<!doctype html>\n' + document.documentElement.outerHTML; telecharger(PAGE, h, 'text/html'); }
    if (a === 'print') window.print();
  });
  bar.querySelector('[data-a="import"]').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var j = JSON.parse(r.result);
        ['pages', 'coches', 'champs'].forEach(function (k) { var o = j[k] || {}; Object.keys(o).forEach(function (x) { S[k][x] = o[x]; }); });
        save(); note('Import réussi : rechargement.'); setTimeout(function () { location.reload(); }, 700);
      } catch (err) { note('Fichier illisible : ce n\'est pas un export du livrable.'); }
    };
    r.readAsText(f);
  });

  poserCases(); majEdition();
})();
