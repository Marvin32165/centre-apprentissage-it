/* Entraînement aux tickets (stage/tickets.html) : qualifier un appel fictif (type, impact, urgence, action),
   voir la priorité de la matrice d'exemple du jour 1, rédiger le résumé, puis comparer avec la résolution (cachée dans un <details>).
   Résultats dans localStorage « it.tickets » (accès protégé). */
(function () {
  "use strict";
  var zone = document.querySelector("[data-tickets]");
  var T = window.IT_TICKETS || [];
  if (!zone || !T.length) return;

  var CLE = "it.tickets";
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) { /* stockage indisponible : on continue sans mémoriser */ } }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  var TYPES = [["incident", "Incident"], ["demande", "Demande"], ["probleme", "Problème possible"], ["securite", "Sécurité"]];
  var NIVEAUX = [["faible", "Faible"], ["moyen", "Moyen"], ["eleve", "Élevé"]];
  var NIVEAUX_U = [["faible", "Faible"], ["moyen", "Moyenne"], ["eleve", "Élevée"]];
  var ACTIONS = [["n1", "Je traite au N1"], ["transmettre", "Je transmets à une autre équipe, avec un ticket complet"], ["immediate", "Escalade immédiate (sécurité ou panne de masse)"]];
  var MATRICE = { eleve: { eleve: 1, moyen: 2, faible: 3 }, moyen: { eleve: 2, moyen: 3, faible: 4 }, faible: { eleve: 3, moyen: 4, faible: 4 } };
  var LIB = {}; [TYPES, NIVEAUX, ACTIONS].forEach(function (l) { l.forEach(function (x) { LIB[x[0]] = x[1]; }); });
  var LIBU = {}; NIVEAUX_U.forEach(function (x) { LIBU[x[0]] = x[1]; });
  function prio(i, u) { var p = MATRICE[i] && MATRICE[i][u]; return p ? "P" + p : "—"; }

  var bilan = el("p", { "class": "tk-bilan", role: "status" });
  zone.appendChild(bilan);
  function majBilan() {
    var r = lire(), faits = 0, justes = 0, total = 0;
    T.forEach(function (t) { if (r[t.id]) { faits++; justes += r[t.id].justes; total += r[t.id].total; } });
    bilan.textContent = faits ? "Tickets qualifiés : " + faits + " sur " + T.length + " · réponses justes : " + justes + " sur " + total + "." : "Aucun ticket qualifié pour l'instant : " + T.length + " appels t'attendent.";
  }

  function groupe(form, nom, legende, options) {
    var fs = el("fieldset");
    fs.appendChild(el("legend", null, legende));
    options.forEach(function (o) {
      var lab = el("label", { "class": "opt" });
      var inp = el("input", { type: "radio", name: nom, value: o[0] });
      lab.appendChild(inp); lab.appendChild(el("span", null, o[1]));
      fs.appendChild(lab);
    });
    form.appendChild(fs);
    return fs;
  }

  T.forEach(function (t) {
    var deja = lire()[t.id];
    var art = el("article", { "class": "ticket-cas", id: "ticket-" + t.id.toLowerCase() });
    var tete = el("header", { "class": "cas-tete" });
    tete.appendChild(el("span", { "class": "cas-id" }, t.id));
    tete.appendChild(el("span", { "class": "cas-jour" }, "Entraînement"));
    var statut = el("span", { "class": "cas-statut" + (deja ? " lu" : "") }, deja ? "Déjà qualifié : " + deja.justes + "/" + deja.total : "À trier");
    tete.appendChild(statut);
    var corps = el("div", { "class": "cas-corps" });
    corps.appendChild(el("p", { "class": "tk-appel" }, t.appel));

    var form = el("form", { "class": "tk-form", novalidate: "" });
    var n = t.id;
    groupe(form, n + "-type", "1. De quoi s'agit-il ?", TYPES);
    groupe(form, n + "-impact", "2. Impact (combien de personnes ou quel service ?)", NIVEAUX);
    groupe(form, n + "-urgence", "3. Urgence (à quelle vitesse cela devient-il grave ?)", NIVEAUX_U);
    var sortie = el("p", { "class": "tk-prio", "aria-live": "polite" }, "Priorité selon la matrice d'exemple : —");
    form.appendChild(sortie);
    groupe(form, n + "-action", "4. Que fais-tu ?", ACTIONS);
    var labR = el("label", { "class": "tk-label", "for": n + "-resume" }, "5. Résumé du ticket (quoi, où ou qui, quel symptôme)");
    var resume = el("textarea", { id: n + "-resume", rows: "2", "class": "tk-resume" });
    form.appendChild(labR); form.appendChild(resume);
    var actions = el("div", { "class": "tk-actions" });
    var bValider = el("button", { type: "submit", "class": "btn" }, "Valider");
    var msg = el("p", { "class": "tk-msg", role: "status" });
    actions.appendChild(bValider); actions.appendChild(msg);
    form.appendChild(actions);
    corps.appendChild(form);

    var resultat = el("div", { "class": "tk-resultat", hidden: "" });
    corps.appendChild(resultat);
    art.appendChild(tete); art.appendChild(corps);
    zone.appendChild(art);

    function val(nom) { var c = form.querySelector('input[name="' + nom + '"]:checked'); return c ? c.value : ""; }
    form.addEventListener("change", function () {
      sortie.textContent = "Priorité selon la matrice d'exemple : " + prio(val(n + "-impact"), val(n + "-urgence"));
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var rep = { type: val(n + "-type"), impact: val(n + "-impact"), urgence: val(n + "-urgence"), action: val(n + "-action") };
      var manque = ["type", "action"].concat(t.impact ? ["impact", "urgence"] : []).filter(function (k) { return !rep[k]; });
      if (manque.length) { msg.textContent = "Réponds d'abord aux questions 1 à 4" + (t.impact ? "." : " (1 et 4 suffisent ici)."); return; }
      msg.textContent = "";
      var lignes = [["type", "Type"], ["impact", "Impact"], ["urgence", "Urgence"], ["action", "Action"]];
      var justes = 0, total = 0;
      resultat.textContent = "";
      var ul = el("ul", { "class": "tk-verdicts" });
      lignes.forEach(function (l) {
        var k = l[0], attendu = t[k], L = k === "urgence" ? LIBU : LIB;
        var li;
        if (attendu == null) {
          li = el("li", { "class": "tk-neutre" }, l[1] + " : non noté ici, la procédure de sécurité fixe la priorité.");
        } else {
          total++;
          var ok = rep[k] === attendu;
          if (ok) justes++;
          li = el("li", { "class": ok ? "tk-bon" : "tk-faux" }, (ok ? "✓ " : "✗ ") + l[1] + " : " + (ok ? L[attendu] : "attendu « " + L[attendu] + " », tu as répondu « " + (L[rep[k]] || "rien") + " »") + ".");
        }
        ul.appendChild(li);
      });
      if (t.impact) ul.appendChild(el("li", { "class": "tk-neutre" }, "Priorité attendue : " + prio(t.impact, t.urgence) + " (matrice d'exemple du jour 1)."));
      resultat.appendChild(ul);
      var det = el("details", { "class": "correction" });
      det.appendChild(el("summary", null, "Voir la résolution et un exemple de résumé"));
      det.appendChild(el("p", null, t.explication));
      var ex = el("p");
      ex.appendChild(el("strong", null, "Exemple de résumé : "));
      ex.appendChild(document.createTextNode(t.resume));
      det.appendChild(ex);
      det.appendChild(el("p", null, "Compare avec le tien : dit-il quoi, où ou qui, et quel symptôme, sans jargon ni « urgent !!! » ?"));
      resultat.appendChild(det);
      resultat.hidden = false;
      statut.textContent = "Qualifié : " + justes + "/" + total;
      statut.classList.add("lu");
      var r = lire(); r[t.id] = { justes: justes, total: total }; ecrire(r);
      majBilan();
    });
  });

  var raz = el("button", { type: "button", "class": "btn ghost tk-raz" }, "Effacer mes résultats");
  raz.addEventListener("click", function () { try { localStorage.removeItem(CLE); } catch (e) { /* ignoré */ } location.reload(); });
  zone.appendChild(raz);
  majBilan();
})();
