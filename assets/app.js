/* Prépa stage — comportements communs, sans dépendance.
   - Accueil : décompte, cartes des jours avec progression.
   - Page jour : barre du haut, cases « fait » par bloc, quiz, boutons copier, précédent/suivant.
   La progression est gardée dans le navigateur (localStorage, clé prepa.v1).
   Si le stockage est indisponible, tout reste utilisable. */
(function () {
  'use strict';
  var P = window.PROGRAMME || { jours: [], annexes: [] };
  var CLE = 'prepa.v1';

  function lire() { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return {}; } }
  function ecrire(d) { try { localStorage.setItem(CLE, JSON.stringify(d)); } catch (e) { /* ignoré */ } }
  var etat = lire();
  function etatJour(n) { var k = 'j' + n; etat[k] = etat[k] || { blocs: {}, total: 0 }; return etat[k]; }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var a in (attrs || {})) e.setAttribute(a, attrs[a]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function jourDate(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dateCourte(iso) {
    return jourDate(iso).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function aujourdhui() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  /* ── Boutons « copier » sur les blocs de code ── */
  document.querySelectorAll('pre').forEach(function (pre) {
    var b = el('button', { type: 'button', 'class': 'copier' }, 'Copier');
    b.addEventListener('click', function () {
      var t = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () {
        b.textContent = 'Copié'; setTimeout(function () { b.textContent = 'Copier'; }, 1200);
      }, function () { b.textContent = 'Sélectionne'; });
    });
    pre.appendChild(b);
  });

  /* ── Tableaux défilables sur mobile ── */
  document.querySelectorAll('.page table').forEach(function (t) {
    if (t.parentNode.classList.contains('tableau')) return;
    var w = el('div', { 'class': 'tableau' }); t.parentNode.insertBefore(w, t); w.appendChild(t);
  });

  var n = parseInt(document.body.getAttribute('data-jour'), 10);
  if (document.body.hasAttribute('data-accueil')) accueil();
  else if (n) pageJour(n);
  else barre(document.title.split(' — ')[0], null);

  /* ══ Barre du haut ══ */
  function barre(titre, jauge) {
    var racine = document.body.getAttribute('data-racine') || '../';
    var b = el('div', { 'class': 'barre' });
    b.innerHTML = '<div class="barre-in"><a href="' + racine + 'index.html">← Programme</a>' +
      '<span class="titre">' + titre + '</span><span class="compte"></span></div>' +
      (jauge ? '<div class="jauge"><i></i></div>' : '');
    document.body.insertBefore(b, document.body.firstChild);
    return b;
  }

  /* ══ Page d'un jour ══ */
  function pageJour(n) {
    var j = P.jours.filter(function (x) { return x.n === n; })[0];
    if (!j) return;
    var b = barre('Jour ' + n + ' · ' + j.titre, true);
    var compte = b.querySelector('.compte'), jauge = b.querySelector('.jauge i');
    var ej = etatJour(n);
    var blocs = document.querySelectorAll('section.bloc[id]');
    ej.total = blocs.length;

    function maj() {
      var faits = 0;
      blocs.forEach(function (s) { if (ej.blocs[s.id]) faits++; });
      compte.textContent = faits + '/' + blocs.length;
      jauge.style.width = (blocs.length ? 100 * faits / blocs.length : 0) + '%';
      ecrire(etat);
    }
    blocs.forEach(function (s) {
      var lab = el('label', { 'class': 'valider' });
      var cb = el('input', { type: 'checkbox' });
      cb.checked = !!ej.blocs[s.id];
      s.classList.toggle('fait', cb.checked);
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(cb.checked ? 'Fait' : 'Marquer comme fait'));
      cb.addEventListener('change', function () {
        ej.blocs[s.id] = cb.checked;
        s.classList.toggle('fait', cb.checked);
        lab.lastChild.textContent = cb.checked ? 'Fait' : 'Marquer comme fait';
        maj();
      });
      s.appendChild(lab);
    });
    maj();

    quiz(n, ej);

    /* précédent / suivant */
    var i = P.jours.indexOf(j), av = P.jours[i - 1], ap = P.jours[i + 1];
    var s = el('nav', { 'class': 'suite' });
    if (av) s.appendChild(el('a', { href: av.fichier }, '<small>← Jour ' + av.n + '</small>' + av.titre));
    if (ap) s.appendChild(el('a', { href: ap.fichier, 'class': 'apres' }, '<small>Jour ' + ap.n + ' →</small>' + ap.titre));
    else s.appendChild(el('a', { href: '../outils.html', 'class': 'apres' }, '<small>Annexe →</small>Boîte à outils'));
    document.querySelector('.page').appendChild(s);
  }

  /* ══ Quiz : window.QUIZ = [{ q, c: [...], a: index, why }] ══ */
  function quiz(n, ej) {
    var zone = document.getElementById('quiz-zone');
    if (!zone || !window.QUIZ) return;
    var Q = window.QUIZ, bons = 0, repondus = 0;
    var res = el('p', { 'class': 'score' });
    Q.forEach(function (item, k) {
      var d = el('div', { 'class': 'q' });
      d.appendChild(el('div', { 'class': 'enonce' }, (k + 1) + '. ' + item.q));
      var ordre = item.c.map(function (_, i) { return i; });
      for (var i = ordre.length - 1; i > 0; i--) { var r = Math.floor(Math.random() * (i + 1)); var t = ordre[i]; ordre[i] = ordre[r]; ordre[r] = t; }
      var boutons = [];
      ordre.forEach(function (idx) {
        var bt = el('button', { type: 'button', 'class': 'choix' }, item.c[idx]);
        bt.dataset.i = idx;
        bt.addEventListener('click', function () {
          if (d.classList.contains('repondu')) return;
          d.classList.add('repondu'); repondus++;
          if (idx === item.a) { bt.classList.add('bon'); bons++; }
          else {
            bt.classList.add('faux');
            boutons.forEach(function (o) { if (+o.dataset.i === item.a) o.classList.add('bon'); });
          }
          boutons.forEach(function (o) { o.disabled = true; });
          if (repondus === Q.length) {
            res.textContent = 'Score : ' + bons + ' / ' + Q.length +
              (bons === Q.length ? ' — parfait.' : bons >= Q.length * 0.7 ? ' — solide.' : ' — relis les blocs concernés et refais le quiz.');
            ej.quiz = Math.max(ej.quiz || 0, bons); ej.quizTotal = Q.length; ecrire(etat);
          }
        });
        boutons.push(bt); d.appendChild(bt);
      });
      d.appendChild(el('div', { 'class': 'pourquoi' }, item.why || ''));
      zone.appendChild(d);
    });
    zone.appendChild(res);
    var again = el('button', { type: 'button', 'class': 'btn' }, 'Recommencer le quiz');
    again.addEventListener('click', function () { zone.innerHTML = ''; quiz(n, ej); });
    zone.appendChild(again);
    if (ej.quiz != null) zone.insertBefore(el('p', { 'class': 'chapeau' }, 'Meilleur score : ' + ej.quiz + ' / ' + (ej.quizTotal || Q.length)), zone.firstChild);
  }

  /* ══ Accueil ══ */
  function accueil() {
    var auj = aujourdhui();
    var debut = jourDate(P.stage.debut);
    var jRest = Math.round((debut - auj) / 864e5);
    var faitsTot = 0, totTot = 0;
    P.jours.forEach(function (j) {
      var e = etat['j' + j.n];
      if (e && e.total) { totTot += e.total; faitsTot += Object.keys(e.blocs).filter(function (k) { return e.blocs[k]; }).length; }
    });
    var joursFinis = P.jours.filter(function (j) {
      var e = etat['j' + j.n]; if (!e || !e.total) return false;
      return Object.keys(e.blocs).filter(function (k) { return e.blocs[k]; }).length >= e.total;
    }).length;

    var dc = document.getElementById('decompte');
    if (dc) {
      dc.innerHTML =
        '<div><b>' + (jRest > 0 ? jRest : 0) + '</b><span>' + (jRest > 0 ? 'jours avant le stage' : jRest === 0 ? 'c\'est aujourd\'hui' : 'stage en cours') + '</span></div>' +
        '<div><b>' + joursFinis + ' / ' + P.jours.length + '</b><span>jours terminés</span></div>';
    }

    var liste = document.getElementById('jours');
    if (!liste) return;
    var semaine = null;
    P.jours.forEach(function (j) {
      var d = jourDate(j.date);
      var sem = j.n <= 5 ? 'Semaine 1 — les bases du support' : 'Semaine 2 — les outils et le terrain';
      if (sem !== semaine) { liste.appendChild(el('div', { 'class': 'semaine' }, sem)); semaine = sem; }
      var e = etat['j' + j.n], faits = 0, tot = 0;
      if (e && e.total) { tot = e.total; faits = Object.keys(e.blocs).filter(function (k) { return e.blocs[k]; }).length; }
      var cls = 'jour' + (+d === +auj ? ' aujourdhui' : '') + (tot && faits >= tot ? ' termine' : '');
      var meta = dateCourte(j.date) + ' · ' + j.duree +
        (tot ? ' · ' + faits + '/' + tot + ' blocs' : '') +
        (e && e.quiz != null ? ' · quiz ' + e.quiz + '/' + e.quizTotal : '');
      var a = el('a', { href: 'jours/' + j.fichier, 'class': cls },
        '<span class="num">' + (tot && faits >= tot ? '✓' : j.n) + '</span>' +
        '<span class="corps"><span class="t">' + j.titre + '</span><span class="r">' + j.resume + '</span>' +
        '<span class="m">' + meta + '</span>' +
        (tot ? '<span class="mini"><i style="width:' + (100 * faits / tot) + '%"></i></span>' : '') + '</span>');
      liste.appendChild(a);
    });
    var an = document.getElementById('annexes');
    if (an) P.annexes.forEach(function (x) {
      an.appendChild(el('a', { href: x.fichier, 'class': 'jour' },
        '<span class="num">+</span><span class="corps"><span class="t">' + x.titre + '</span><span class="r">' + x.resume + '</span></span>'));
    });

    var raz = document.getElementById('raz');
    if (raz) raz.addEventListener('click', function () {
      if (raz.dataset.ok) { etat = {}; ecrire(etat); location.reload(); }
      else { raz.dataset.ok = '1'; raz.textContent = 'Toucher encore pour tout effacer'; }
    });
  }
})();
