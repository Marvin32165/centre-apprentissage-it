/* Atelier hardware — entrée du manuel technique (REFONTE.md § 7.5) :
   couverture (vue éclatée réglable), sommaire en parties A à F et épreuves, index des pièces et des pannes.
   Les parties se remplissent depuis les données : A.fiches (lot 44), scénarios de démontage (lot 43), A.missions (lot 46), A.modeles (lot 47). */
(function () {
  "use strict";
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function deux(n) { return (n < 10 ? "0" : "") + n; }
  var MONTAGES = ["bureautique-intel", "salle-info", "gamer-amd", "station", "mini-itx", "mise-a-niveau"];
  var BIENTOT = {
    A: ["Processeur", "Mémoire vive", "Carte mère", "Alimentation", "Stockage", "Carte graphique", "Boîtier et refroidissement", "Câbles et connecteurs"],
    C: ["Remplacer une barrette de mémoire", "Remplacer un SSD", "Remplacer l'alimentation"],
    E: ["Réceptionner et contrôler un colis", "Intégrer un PC neuf", "Préparer une salle informatique", "Maintenance préventive"],
    F: ["PC de bureau d'entreprise : manuel de service"]
  };

  function couverture() {
    var D = window.IT_ISO_DATA, box = document.querySelector("[data-couverture]");
    if (!D || !box) return;
    var range = document.getElementById("couv-ecart"), nomen = document.querySelector("[data-couv-nomen]");
    var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var t0 = range ? range.value / 100 : 0.6, cv = D.couverture(t0);
    function dessiner(t) { box.innerHTML = D.couverture(t).svg; lier(); }
    function surligner(id, on) {
      box.querySelectorAll('[data-id="' + id + '"], [data-rep="' + id + '"]').forEach(function (n) { n.classList.toggle("is-hl", on); });
      if (nomen) nomen.querySelectorAll('[data-for="' + id + '"]').forEach(function (n) { n.classList.toggle("is-hl", on); });
    }
    function lier() {
      box.querySelectorAll(".iso-rep, .iso-piece[data-id]").forEach(function (g) {
        var id = g.getAttribute("data-rep") || g.getAttribute("data-id");
        g.addEventListener("mouseenter", function () { surligner(id, true); });
        g.addEventListener("mouseleave", function () { surligner(id, false); });
      });
    }
    dessiner(t0);
    if (nomen) {
      var ids = ["psu", "board", "cpu", "cooler", "dimm-a2", "m2-1", "gpu", "fan-front", "bay-ssd", "ioshield"];
      cv.nomenclature.forEach(function (n, i) {
        var li = el("li", { "data-for": ids[i] });
        li.appendChild(el("span", { "class": "mt-rep", "aria-hidden": "true" }, String(n.rep)));
        li.appendChild(el("span", null, n.nom));
        li.addEventListener("mouseenter", function () { surligner(ids[i], true); });
        li.addEventListener("mouseleave", function () { surligner(ids[i], false); });
        nomen.appendChild(li);
      });
    }
    if (range) {
      var anim = null;
      range.addEventListener("input", function () {
        var cible = range.value / 100;
        if (reduit) { dessiner(cible); return; }
        if (anim) cancelAnimationFrame(anim);
        anim = requestAnimationFrame(function () { dessiner(cible); });
      });
    }
  }

  function afficher() {
    var store = window.IT && window.IT.store, A = window.IT_ATELIER;
    couverture();
    if (!store || !A) return;
    function fait(u) { return store.get("done." + u) === "1"; }
    function score(k) { var v = parseInt(store.get("score." + k), 10); return isNaN(v) ? null : v; }

    var som = document.querySelector("[data-sommaire]");
    if (som) {
      som.textContent = "";
      var partie = function (lettre, titre, sous) {
        var sec = el("section", { "class": "mt-partie", "aria-labelledby": "partie-" + lettre });
        var tete = el("div", { "class": "mt-partie-tete" });
        tete.appendChild(el("span", { "class": "mt-lettre", "aria-hidden": "true" }, lettre));
        var t = el("div");
        t.appendChild(el("h2", { id: "partie-" + lettre }, titre));
        if (sous) t.appendChild(el("p", null, sous));
        tete.appendChild(t);
        sec.appendChild(tete);
        var ul = el("ul", { "class": "mt-entrees" });
        sec.appendChild(ul);
        som.appendChild(sec);
        return ul;
      };
      var entree = function (ul, num, titre, href, etat, extra) {
        var li = el("li");
        var a = href ? el("a", { href: href }) : el("span", { "class": "bientot" });
        a.appendChild(el("span", { "class": "mt-e-n" }, num));
        a.appendChild(el("span", { "class": "mt-e-t" }, titre));
        a.appendChild(el("span", { "class": "mt-e-pts", "aria-hidden": "true" }));
        if (!href) a.appendChild(el("span", { "class": "mt-e-etat" }, "bientôt"));
        else if (etat === true) { var ok = el("span", { "class": "mt-e-etat ok" }, "✓"); ok.setAttribute("aria-label", "fait"); a.appendChild(ok); }
        else if (etat) a.appendChild(el("span", { "class": "mt-e-etat" }, etat));
        li.appendChild(a);
        if (extra) li.appendChild(extra);
        ul.appendChild(li);
      };
      var bientot = function (ul, L) { BIENTOT[L].forEach(function (t, i) { entree(ul, L + "-" + deux(i + 1), t, null); }); };

      var pA = partie("A", "Composants", "Une fiche technique par pièce : rôle, caractéristiques, pièges.");
      var fiches = A.fiches ? Object.keys(A.fiches) : [];
      if (fiches.length) fiches.forEach(function (id, i) { entree(pA, "A-" + deux(i + 1), A.fiches[id].titre, "composants.html?c=" + id, fait("atelier-fiche-" + id)); });
      else bientot(pA, "A");

      var pB = partie("B", "Montage", "Six PC à assembler pièce par pièce, du cahier des charges au démarrage.");
      MONTAGES.forEach(function (id, i) {
        var sc = A.scenarios[id];
        if (!sc) return;
        var s = score(id);
        var t = el("a", { "class": "mt-test", href: "montage.html?s=" + id + "&m=test", "aria-label": sc.titre + " en test noté" }, "test" + (s != null ? " " + s : ""));
        entree(pB, "B-" + deux(i + 1), sc.titre, "montage.html?s=" + id, fait(sc.unite) || sc.niveau, t);
      });

      var pC = partie("C", "Démontage et remplacement", "Ouvrir un PC en sécurité, remplacer une pièce, refermer.");
      var dem = Object.keys(A.scenarios).filter(function (id) { return A.scenarios[id].type === "demontage"; });
      if (dem.length) dem.forEach(function (id, i) { var sc = A.scenarios[id]; entree(pC, "C-" + deux(i + 1), sc.titre, "montage.html?s=" + id, fait(sc.unite) || sc.niveau); });
      else bientot(pC, "C");

      var pD = partie("D", "Diagnostic", "Dossiers de pannes : symptôme, examen, mesures, cause.");
      Object.keys(A.pannes || {}).forEach(function (id, i) {
        entree(pD, "D-" + deux(i + 1), A.pannes[id].titre, "pannes.html?p=" + id, store.get("panne." + id) === "1" || null);
      });

      var pE = partie("E", "Missions du stage", "Ce que demande la convention : colis, intégration, salles, maintenance.");
      var mis = A.missions ? Object.keys(A.missions) : [];
      if (mis.length) mis.forEach(function (id, i) { entree(pE, "E-" + deux(i + 1), A.missions[id].titre, "missions.html?m=" + id, fait("atelier-mission-" + id)); });
      else bientot(pE, "E");

      var pF = partie("F", "Annexes", "Modèles de PC d'entreprise, d'après leurs manuels de service publics.");
      var mod = A.modeles ? Object.keys(A.modeles) : [];
      if (mod.length) mod.forEach(function (id, i) { entree(pF, "F-" + deux(i + 1), A.modeles[id].titre, "modeles.html?m=" + id); });
      else bientot(pF, "F");

      var pX = partie("✓", "Épreuves", "Tests notés, seuil de réussite 75 sur 100, bilan imprimable.");
      var s1 = score("evaluation"), s2 = score("pannes-eval");
      entree(pX, "EP-1", "Épreuve des montages", "evaluation.html", fait("atelier-eval") || (s1 != null ? s1 + " / 100" : null));
      entree(pX, "EP-2", "Épreuve des pannes", "pannes-eval.html", fait("atelier-pannes-eval") || (s2 != null ? s2 + " / 100" : null));
      entree(pX, "IDX", "Index des pièces et des pannes", "#index", null);
    }

    /* Index des pièces : nom → procédures de montage dont l'inventaire la contient */
    var ip = document.querySelector("[data-index-pieces]");
    if (ip && A.pieces) {
      var parNom = {};
      Object.keys(A.pieces).forEach(function (pid) {
        var nom = A.pieces[pid].nom.replace(/\s*\(\d+\)$/, "");
        var ch = [];
        MONTAGES.forEach(function (id, i) { var sc = A.scenarios[id]; if (sc && (sc.inventaire || []).indexOf(pid) >= 0) ch.push(i + 1); });
        if (!ch.length) return;
        parNom[nom] = (parNom[nom] || []).concat(ch).filter(function (v, k, a) { return a.indexOf(v) === k; }).sort(function (a, b) { return a - b; });
      });
      var noms = Object.keys(parNom).sort(function (a, b) { return a.localeCompare(b, "fr"); });
      var ul = el("ul", { "class": "index-liste" }), lettre = "";
      noms.forEach(function (n) {
        var L = n.charAt(0).toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        if (L !== lettre) { lettre = L; ul.appendChild(el("li", { "class": "index-lettre", "aria-hidden": "true" }, L)); }
        var li = el("li");
        li.appendChild(el("span", null, n));
        var refs = el("span", { "class": "index-refs" });
        parNom[n].forEach(function (c, k) {
          if (k) refs.appendChild(document.createTextNode(" "));
          refs.appendChild(el("a", { href: "montage.html?s=" + MONTAGES[c - 1], "aria-label": "procédure B-" + deux(c) + " : " + A.scenarios[MONTAGES[c - 1]].titre }, "B-" + deux(c)));
        });
        li.appendChild(refs);
        ul.appendChild(li);
      });
      ip.appendChild(ul);
    }
    /* Index des pannes : cause → dossier */
    var ipn = document.querySelector("[data-index-pannes]");
    if (ipn && A.pannes) {
      var causes = {};
      (A.pannesCauses || []).forEach(function (c) { causes[c.id] = c.nom; });
      var items = Object.keys(A.pannes).map(function (id, i) { return { id: id, n: i + 1, t: A.pannes[id].titre, c: causes[A.pannes[id].cause] || "" }; });
      items.sort(function (a, b) { return a.c.localeCompare(b.c, "fr"); });
      var ul2 = el("ul", { "class": "index-liste pannes" });
      items.forEach(function (x) {
        var li = el("li");
        li.appendChild(el("span", null, x.c));
        var a = el("a", { href: "pannes.html?p=" + x.id, "aria-label": x.c + " : dossier D-" + deux(x.n) + ", " + x.t }, "D-" + deux(x.n));
        var r = el("span", { "class": "index-refs" }); r.appendChild(a);
        li.appendChild(r);
        li.appendChild(el("span", { "class": "index-sous" }, "« " + x.t + " »"));
        ul2.appendChild(li);
      });
      ipn.appendChild(ul2);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", afficher); else afficher();
})();
