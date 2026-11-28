/* Atelier hardware — partie E : missions du stage (lot 46). Données : assets/atelier-missions-data.js (A.missions).
   Page : atelier/missions.html?m=<id>. « Je montre » (procédure), « On fait ensemble » (liste à cocher, gardée dans it.atelier.mission.<id>),
   « Tu fais seul » (exercice, correction cachée), « À vérifier sur place ». Illustrations isométriques dessinées ici. */
(function () {
  "use strict";
  var A = window.IT_ATELIER, I = window.IT_ISO, ID = window.IT_ISO_DATA;
  var host = document.getElementById("mission");
  if (!host || !A || !A.missions || !I || !ID) return;
  var store = (window.IT && window.IT.store) || { get: function () { return null; }, set: function () {} };
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function deux(n) { return (n < 10 ? "0" : "") + n; }
  var ids = Object.keys(A.missions);

  /* ---------- Illustrations ---------- */
  var B = I.boite, Rr = I.rect;
  /* Taille des repères proportionnelle à la planche (même taille à l'écran, comme les fiches). */
  function kDe(b) {
    var mx = 1e9, Mx = -1e9, my = 1e9, My = -1e9;
    [[b.x, b.y, b.z], [b.x + b.w, b.y + b.d, b.z + b.h], [b.x, b.y + b.d, b.z], [b.x + b.w, b.y, b.z + b.h]].forEach(function (c) { var q = I.P(c[0], c[1], c[2]); mx = Math.min(mx, q[0]); Mx = Math.max(Mx, q[0]); my = Math.min(my, q[1]); My = Math.max(My, q[1]); });
    return Math.max(0.3, Math.min(2.5, Math.max(Mx - mx, (My - my) * 1.2) / 600));
  }
  function tour(x, y, w, d, h, etiq) {
    var s = B({ x: x, y: y, z: 0, w: w, d: d, h: h }, { cls: "iso-tole" }) + Rr("y", { x: x + w * 0.12, y: y + d, z: h * 0.12, w: w * 0.76, h: h * 0.76 }, "iso-det");
    s += I.cercle("x", [x + w, y + d * 0.75, h - 30], 6, "iso-bouton-c");
    if (etiq) s += Rr("y", { x: x + w * 0.18, y: y + d, z: h * 0.62, w: w * 0.3, h: h * 0.12 }, "iso-etiquette");
    return s;
  }
  function ecran(x, y, z) { return B({ x: x, y: y, z: z, w: 8, d: 120, h: 75 }, { cls: "iso-plastique" }) + B({ x: x - 10, y: y + 50, z: z - 20, w: 28, d: 20, h: 20 }, { cls: "iso-plastique" }); }
  var ILLUS = {
    colis: function () {
      var c = { x: 0, y: 0, z: 0, w: 420, d: 220, h: 300 };
      var s = B(c, { cls: "iso-carton" }) + Rr("z", { x: 0, y: 100, z: 300, w: 420, d: 22 }, "iso-scotch") + Rr("y", { x: 0, y: 220, z: 230, w: 420, h: 22 }, "iso-scotch");
      s += Rr("y", { x: 40, y: 220, z: 110, w: 140, h: 80 }, "iso-etiquette") + Rr("x", { x: 420, y: 40, z: 60, d: 90, h: 120 }, "iso-det");
      return { svg: I.scene([], { fond: s, bornes: [c], notes: [{ rep: "1", ancre: [110, 220, 150], dir: [-60, 40] }, { rep: "2", ancre: [210, 111, 300], dir: [10, -60] }, { rep: "3", ancre: [420, 85, 120], dir: [60, 20] }], classe: "fiche-iso", titre: "Carton de livraison", marge: 30, repK: kDe(c) }),
        nomen: ["Étiquette du transporteur et numéro de suivi", "Ruban adhésif : intact ou ouvert ?", "Bordereau et bon de livraison"], objet: "Colis" };
    },
    integration: function () {
      var s = tour(0, 0, 400, 190, 420, true) + B({ x: 490, y: 60, z: 0, w: 60, d: 90, h: 10 }, { cls: "iso-plastique" }) + B({ x: 505, y: 95, z: 10, w: 20, d: 20, h: 110 }, { cls: "iso-plastique" }) +
        B({ x: 525, y: -60, z: 100, w: 12, d: 330, h: 200 }, { cls: "iso-plastique" }) + Rr("x", { x: 537, y: -50, z: 112, d: 310, h: 176 }, "iso-ecran-dalle");
      return { svg: I.scene([], { fond: s, bornes: [{ x: 0, y: -60, z: 0, w: 560, d: 330, h: 420 }], notes: [{ rep: "1", ancre: [132, 190, 285], dir: [-70, 20] }, { rep: "2", ancre: [400, 140, 390], dir: [40, -50] }, { rep: "3", ancre: [537, 100, 220], dir: [70, -10] }], classe: "fiche-iso", titre: "PC neuf étiqueté et son écran", marge: 30, repK: kDe({ x: 0, y: -60, z: 0, w: 560, d: 330, h: 420 }) }),
        nomen: ["Étiquette d'inventaire (numéro de l'organisation)", "Bouton marche : premier démarrage et préparation", "Écran : test des usages avec l'utilisateur"], objet: "Poste de travail" };
    },
    salle: function () {
      var s = "", pos = [];
      for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++) pos.push([r * 320, c * 260]);
      pos.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
      pos.forEach(function (p, i) {
        var x = p[0], y = p[1];
        s += B({ x: x + 120, y: y + 150, z: 0, w: 70, d: 40, h: 110 }, { cls: "iso-tole" }) + B({ x: x, y: y, z: 120, w: 200, d: 220, h: 8 }, { cls: i === 0 ? "iso-modele" : "iso-tole" }) + ecran(x + 30, y + 50, 135);
      });
      return { svg: I.scene([], { fond: s, bornes: [{ x: 0, y: 0, z: 0, w: 520, d: 740, h: 240 }], notes: [{ rep: "1", ancre: [100, 110, 128], dir: [-60, -40] }, { rep: "2", ancre: [420, 630, 128], dir: [60, 30] }], classe: "fiche-iso", titre: "Salle de six postes identiques", marge: 30, repK: kDe({ x: 0, y: 0, z: 0, w: 520, d: 740, h: 240 }) }),
        nomen: ["Poste modèle, testé de bout en bout avant le déploiement", "Postes déployés en série, testés un par un"], objet: "Salle informatique" };
    },
    maintenance: function () {
      var dep = {}, b = A.scenarios["bureautique-intel"];
      if (b) b.etapes.forEach(function (e) { (e.solution || []).forEach(function (x) { dep[x[0]] = x[1]; }); });
      return { svg: ID.pc("tour-matx", dep, { ouvert: true, titre: "PC ouvert pour la maintenance : ventilateurs, ventirad, disque" }), nomen: [], objet: "PC de bureau ouvert" };
    }
  };

  function liste() {
    host.textContent = "";
    var h = el("header", { "class": "at-head" });
    h.appendChild(el("p", { "class": "mt-surtitre" }, "Atelier hardware · Partie E"));
    h.appendChild(el("h1", null, "Missions du stage"));
    h.appendChild(el("p", { "class": "mt-chapeau" }, "Les missions matérielles de la convention de stage, en procédures : je montre, on fait ensemble, tu fais seul. Ce qui dépend de l'UMONS est à vérifier sur place."));
    host.appendChild(h);
    var g = el("div", { "class": "fiches-grille" });
    ids.forEach(function (k, i) {
      var m = A.missions[k], a = el("a", { "class": "fiche-carte", href: "missions.html?m=" + k });
      a.appendChild(el("span", { "class": "mt-e-n" }, "E-" + deux(i + 1)));
      a.appendChild(el("span", { "class": "nom" }, m.titre));
      a.appendChild(el("span", { "class": "res" }, m.role));
      if (store.get("done.atelier-mission-" + k) === "1") a.appendChild(el("span", { "class": "mt-e-etat ok" }, "faite ✓"));
      g.appendChild(a);
    });
    host.appendChild(g);
  }

  function mission(m, i) {
    host.textContent = "";
    document.title = m.titre + " — Atelier hardware";
    var code = "E-" + deux(i + 1);
    var h = el("header", { "class": "at-head" });
    h.appendChild(el("p", { "class": "mt-surtitre" }, "Atelier hardware · " + code + " · Mission du stage"));
    h.appendChild(el("h1", null, m.titre));
    h.appendChild(el("p", { "class": "mt-chapeau" }, m.role));
    host.appendChild(h);
    var feuille = el("div", { "class": "mt-feuille" }), txt = el("div", { "class": "mt-texte" }), col = el("div", { "class": "mt-colle mt-avant" });
    feuille.appendChild(txt); feuille.appendChild(col); host.appendChild(feuille);

    var il = ILLUS[m.illus] ? ILLUS[m.illus]() : null;
    if (il) {
      var fig = el("figure", { "class": "mt-planche" });
      fig.innerHTML = il.svg;
      var cart = el("div", { "class": "mt-cartouche", "aria-hidden": "true" });
      [["Planche", code], ["Vue", "Isométrique"], ["Objet", il.objet], ["Mission", "Stage"]].forEach(function (x) { var s = el("span", null, x[0]); s.appendChild(el("b", null, x[1])); cart.appendChild(s); });
      fig.appendChild(cart);
      col.appendChild(fig);
      col.appendChild(el("p", { "class": "mt-fig" })).innerHTML = "<b>FIG. " + code + "</b> · " + il.objet + ".";
      if (il.nomen.length) {
        var t = el("table", { "class": "mt-nomenclature" });
        t.innerHTML = "<thead><tr><th>Rep.</th><th>Désignation</th></tr></thead>";
        var tb = el("tbody");
        il.nomen.forEach(function (n, k) { var tr = el("tr"); var td = el("td"); td.appendChild(el("span", { "class": "mt-rep" }, String(k + 1))); tr.appendChild(td); tr.appendChild(el("td", null, n)); tb.appendChild(tr); });
        t.appendChild(tb); col.appendChild(t);
      }
    }

    function section(id, titre, phase) {
      var s = el("section", { "aria-labelledby": m.id + "-" + id });
      if (phase) s.appendChild(el("p", { "class": "mt-surtitre" }, phase));
      s.appendChild(el("h2", { id: m.id + "-" + id }, titre));
      txt.appendChild(s);
      return s;
    }
    var s1 = section("proc", "La procédure", "I · Je montre");
    var ol = el("ol", { "class": "mt-proc" });
    m.procedure.forEach(function (p) { var li = el("li"); li.appendChild(el("strong", null, p[0])); li.appendChild(document.createTextNode(p[1])); ol.appendChild(li); });
    s1.appendChild(ol);
    if (m.attention) { var at = el("div", { "class": "mt-encadre attention" }); at.appendChild(el("p", { "class": "mt-etiq" }, "Attention")); at.appendChild(el("p", null, m.attention)); s1.appendChild(at); }

    var s2 = section("liste", "La liste de contrôle", "II · On fait ensemble");
    var KEY = "atelier.mission." + m.id, etat = {};
    try { etat = JSON.parse(store.get(KEY) || "{}") || {}; } catch (e) { etat = {}; }
    var ul = el("ul", { "class": "mt-cases" });
    m.cases.forEach(function (c, k) {
      var li = el("li"), idc = "case-" + m.id + "-" + k, cb = el("input", { type: "checkbox", id: idc });
      if (etat[k]) cb.checked = true;
      cb.addEventListener("change", function () { etat[k] = cb.checked; store.set(KEY, JSON.stringify(etat)); });
      li.appendChild(cb); li.appendChild(el("label", { "for": idc }, c));
      ul.appendChild(li);
    });
    s2.appendChild(ul);

    var s3 = section("seul", "L'exercice", "III · Tu fais seul");
    s3.appendChild(el("p", null, m.exercice.consigne));
    var d = el("details", { "class": "correction" });
    d.appendChild(el("summary", null, "J'ai répondu : voir la correction"));
    var ulc = el("ul");
    m.exercice.correction.forEach(function (c) { ulc.appendChild(el("li", null, c)); });
    d.appendChild(ulc);
    s3.appendChild(d);

    var u = el("div", { "class": "mt-encadre remarque" });
    u.appendChild(el("p", { "class": "mt-etiq" }, "À vérifier sur place (UMONS)"));
    var ulu = el("ul");
    m.umons.forEach(function (x) { ulu.appendChild(el("li", null, x)); });
    u.appendChild(ulu);
    txt.appendChild(u);
    var src = el("aside", { "class": "mt-encadre source" });
    src.appendChild(el("p", { "class": "mt-etiq" }, "Sources"));
    var us = el("ul");
    m.sources.forEach(function (x) { var li = el("li"); li.appendChild(el("a", { href: x[1] }, x[0])); us.appendChild(li); });
    src.appendChild(us);
    txt.appendChild(src);
    if (m.liens && m.liens.length) {
      var sl = section("liens", "Voir aussi");
      var ule = el("ul", { "class": "mt-entrees" });
      m.liens.forEach(function (x) { var li = el("li"), a = el("a", { href: x[1] }); a.appendChild(el("span", { "class": "mt-e-n" }, x[0])); a.appendChild(el("span", { "class": "mt-e-t" }, x[2])); li.appendChild(a); ule.appendChild(li); });
      sl.appendChild(ule);
    }

    var DONE = "done.atelier-mission-" + m.id;
    var fait = el("button", { type: "button", "class": "btn", "aria-pressed": store.get(DONE) === "1" ? "true" : "false" }, store.get(DONE) === "1" ? "Mission comprise ✓" : "Mission comprise");
    fait.addEventListener("click", function () { store.set(DONE, "1"); fait.textContent = "Mission comprise ✓"; fait.setAttribute("aria-pressed", "true"); });
    var nav = el("nav", { "class": "fiche-nav", "aria-label": "Missions voisines" });
    if (i > 0) nav.appendChild(el("a", { href: "missions.html?m=" + ids[i - 1], "class": "btn ghost" }, "‹ " + A.missions[ids[i - 1]].titre));
    nav.appendChild(fait);
    if (i < ids.length - 1) nav.appendChild(el("a", { href: "missions.html?m=" + ids[i + 1], "class": "btn ghost" }, A.missions[ids[i + 1]].titre + " ›"));
    host.appendChild(nav);
  }

  var id = new URLSearchParams(location.search).get("m"), i = ids.indexOf(id);
  if (i < 0) liste(); else mission(A.missions[id], i);
})();
