/* Accueil = tableau de mission : jour du jour, reprise, décompte, frise, compteurs.
   La date du jour peut être forcée pour tester : index.html?date=2026-11-25 */
(function () {
  "use strict";
  var IT = window.IT, DATA = window.IT_DATA, S = DATA.stage;
  if (!IT || !S || !S.jours) return;
  var el = IT.el;

  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function jourLong(d) { var t = d.toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" }); return t.charAt(0).toUpperCase() + t.slice(1); }
  function html(node, s) { node.innerHTML = s; return node; } // textes internes de data.js uniquement

  var force = /[?&]date=(\d{4}-\d{2}-\d{2})/.exec(location.search);
  var now = force ? parse(force[1]) : new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var debutPrepa = parse(S.prepaDebut), debutStage = parse(S.debut), finStage = parse(S.fin);
  var J = S.jours, dernier = parse(J[J.length - 1].date);
  var jourDuJour = null;
  J.forEach(function (j) { if (j.date === iso(today)) jourDuJour = j; });
  var prochain = null;
  J.forEach(function (j) { if (!prochain && parse(j.date) > today) prochain = j; });
  var faits = J.filter(function (j) { return IT.isDone("stage-j" + j.n); }).length;

  /* ---------- Reprise (dernière section vue sur une page de jour) ---------- */
  var reprise = null;
  try { reprise = JSON.parse(IT.store.get("reprise") || "null"); } catch (e) { reprise = null; }

  /* ---------- Colonne gauche ---------- */
  var m = document.querySelector("[data-mission]");
  if (m) {
    var kicker, h1, chapeau, actions = [], infos = [];
    if (today < debutPrepa) {
      kicker = "La prépa commence le " + jourLong(debutPrepa).toLowerCase() + " · 10 jours";
      h1 = "Bientôt, " + J[0].sujet + ".";
      chapeau = J[0].chapeau;
      actions = [["Commencer la prépa", J[0].href, true], ["Voir le programme", "stage/index.html"]];
    } else if (jourDuJour) {
      kicker = jourLong(today) + " · Jour " + jourDuJour.n + " sur " + J.length;
      h1 = "Aujourd'hui, " + jourDuJour.sujet + ".";
      chapeau = jourDuJour.chapeau + " " + jourDuJour.duree.replace("≈", "Environ") + ", en " + jourDuJour.blocs + " blocs.";
      actions = [[IT.isDone("stage-j" + jourDuJour.n) ? "Revoir la séance" : "Commencer la séance", jourDuJour.href, true], ["Voir le plan du jour", jourDuJour.href + "#plan"]];
      infos.push(jourDuJour.blocs + " blocs · " + jourDuJour.duree);
    } else if (today < dernier && prochain) {
      kicker = jourLong(today) + " · Repos";
      h1 = "Aujourd'hui, <em>repos</em>.";
      chapeau = "Prochaine séance le " + jourLong(parse(prochain.date)).toLowerCase() + " : jour " + prochain.n + ", " + prochain.sujet.replace(/<[^>]+>/g, "") + ". Tu peux aussi reprendre un jour pas encore terminé.";
      actions = [["Voir le jour " + prochain.n, prochain.href, true], ["Voir le programme", "stage/index.html"]];
    } else if (today < debutStage) {
      kicker = jourLong(today) + " · Prépa terminée";
      h1 = "Aujourd'hui, on <em>révise</em>.";
      chapeau = "Les dix jours sont derrière toi. Relis les fiches mémo de la révision express, refais les appels simulés du jour 10 et garde la boîte à outils sous la main.";
      actions = [["Révision express", "stage/revision.html", true], ["Jour 10 : appels simulés", "stage/j10.html"]];
    } else {
      kicker = jourLong(today) + (today <= finStage ? " · Stage en cours" : " · Stage terminé");
      h1 = today <= finStage ? "Ton <em>stage</em> a commencé." : "Ton <em>stage</em> est terminé.";
      chapeau = "Service desk à la DSI de l'UMONS, " + S.periodes + ".";
      actions = [["Boîte à outils", "stage/outils.html", true], ["Révision express", "stage/revision.html"]];
    }
    m.textContent = "";
    var k = el("p", { "class": "kicker point" }, kicker);
    m.appendChild(k);
    m.appendChild(html(el("h1"), h1));
    m.appendChild(el("p", { "class": "lead" }, chapeau));
    var pa = el("p", { "class": "mission-actions" });
    actions.forEach(function (a) {
      var b = el("a", { "class": a[2] ? "btn" : "btn ghost", href: a[1] }, a[0]);
      if (a[2]) b.appendChild(IT.icon("arrow"));
      pa.appendChild(b);
      pa.appendChild(document.createTextNode(" "));
    });
    m.appendChild(pa);
    if (reprise && reprise.url && reprise.titre) {
      var r = el("span", null, "Reprise : ");
      r.appendChild(el("a", { href: reprise.url }, "jour " + reprise.jour + ", " + reprise.titre));
      infos.push(r);
    }
    if (infos.length) {
      var pi = el("p", { "class": "mission-infos" });
      infos.forEach(function (x) { pi.appendChild(typeof x === "string" ? el("span", null, x) : x); });
      m.appendChild(pi);
    }
  }

  /* ---------- Carte-ticket ---------- */
  var t = document.querySelector("[data-ticket]");
  if (t) {
    var n = Math.round((debutStage - today) / 86400000);
    var num = t.querySelector(".ticket-num"), lbl = t.querySelector(".ticket-lbl"), etat = t.querySelector(".ticket-etat");
    if (n > 0) {
      num.textContent = String(n);
      lbl.textContent = (n === 1 ? "jour" : "jours") + " avant le premier appel";
    } else if (today <= finStage) {
      num.textContent = "J+" + (-n);
      lbl.textContent = "le stage a commencé le lundi 7 décembre";
      etat.textContent = "● En cours";
    } else {
      num.textContent = "✓";
      lbl.textContent = "stage terminé le " + jourLong(finStage).toLowerCase();
      etat.textContent = "● Résolu";
    }
  }

  /* ---------- Frise du 23/11 au 7/12 ---------- */
  var f = document.querySelector("[data-frise]");
  if (f) {
    var parDate = {};
    J.forEach(function (j) { parDate[j.date] = j; });
    for (var d = new Date(debutPrepa); d <= debutStage; d.setDate(d.getDate() + 1)) {
      var cle = iso(d), j = parDate[cle];
      var jj = d.toLocaleDateString("fr-BE", { weekday: "short" }).replace(".", "") + " " + d.getDate();
      var li = el("li");
      var estAuj = cle === iso(today);
      var node, cls = "case";
      if (j) {
        var fait = IT.isDone("stage-j" + j.n);
        node = el("a", { href: j.href });
        cls += (estAuj ? " auj" : "") + (fait ? " fait" : "");
        node.appendChild(el("span", { "class": "case-date" }, jj));
        node.appendChild(el("span", { "class": "case-n" }, "J" + j.n + (fait ? " ✓" : "")));
        node.appendChild(el("span", { "class": "case-sujet" }, j.court));
        node.setAttribute("aria-label", jj + " : jour " + j.n + ", " + j.court + (fait ? ", terminé" : "") + (estAuj ? ", aujourd'hui" : ""));
      } else if (cle === S.debut) {
        node = el("div");
        cls += " stage" + (estAuj ? " auj" : "");
        node.appendChild(el("span", { "class": "case-date" }, jj));
        node.appendChild(el("span", { "class": "case-n" }, "Stage"));
        node.appendChild(el("span", { "class": "case-sujet" }, "Premier jour"));
      } else {
        node = el("div");
        cls += " repos";
        node.appendChild(el("span", { "class": "case-date" }, jj));
        node.appendChild(el("span", { "class": "case-n", "aria-hidden": "true" }, "—"));
        node.appendChild(el("span", { "class": "case-sujet" }, "Repos"));
      }
      if (estAuj) node.setAttribute("aria-current", "date");
      node.className = cls;
      li.appendChild(node);
      f.appendChild(li);
    }
  }

  /* ---------- Compteurs des rubriques ---------- */
  var M = window.IT_MODULES;
  function units(id) { var r = DATA.rubriques.filter(function (x) { return x.id === id; })[0]; return (r && r.units) || []; }
  function compte(id) { return units(id).filter(function (u) { return IT.isDone(u); }).length; }
  var textes = {
    stage: faits + " / " + J.length + " jours",
    modules: compte("modules") + " / " + units("modules").length,
    themes: (M && M.domaines ? M.domaines.length : 0) + " domaines",
    atelier: compte("atelier") + " / " + units("atelier").length
  };
  var ratios = {
    stage: [faits, J.length],
    modules: [compte("modules"), units("modules").length],
    atelier: [compte("atelier"), units("atelier").length]
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-compteur]"), function (n) {
    var k = n.getAttribute("data-compteur");
    n.textContent = textes[k] || "";
    var r = ratios[k];
    if (!r || !r[1]) return;
    /* Anneau de progression de la rubrique (décoratif : le compteur texte donne la valeur). */
    var pct = Math.round(r[0] / r[1] * 100);
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "anneau"); svg.setAttribute("viewBox", "0 0 36 36"); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<circle class="anneau-fond" cx="18" cy="18" r="15.9155"/><circle class="anneau-val" cx="18" cy="18" r="15.9155" stroke-dasharray="' + pct + ' 100" transform="rotate(-90 18 18)"/>';
    n.parentNode.insertBefore(svg, n);
  });
})();
