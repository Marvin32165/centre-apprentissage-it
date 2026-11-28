/* Atelier hardware — partie F : annexes (lot 47). Données : assets/atelier-modeles-data.js. Page : atelier/modeles.html?m=<id>.
   Maquette : le boîtier coté d'après le manuel, capot et façade écartés (aucune position interne inventée). */
(function () {
  "use strict";
  var A = window.IT_ATELIER, I = window.IT_ISO;
  var host = document.getElementById("modele");
  if (!host || !A || !A.modeles || !I) return;
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  var ids = Object.keys(A.modeles), id = new URLSearchParams(location.search).get("m");
  if (ids.indexOf(id) < 0) id = ids[0];
  var m = A.modeles[id], i = ids.indexOf(id), code = "F-0" + (i + 1);
  document.title = m.titre + " — Atelier hardware";

  function mm(valeur) { return valeur.toLocaleString("fr-BE") + " mm"; }
  function maquette(d, capotHaut) {
    /* Repère isométrique : x = profondeur, y = largeur (capot côté y+), z = hauteur. */
    var W = d.d, L = d.w, H = d.h, ecart = 60;
    var s = I.boite({ x: 0, y: 0, z: 0, w: W, d: L, h: H }, { cls: "iso-tole" });
    var departCapot = capotHaut ? [W / 2, L / 2, H] : [W / 2, L, H / 2];
    var finCapot = capotHaut ? [W / 2, L / 2, H + ecart] : [W / 2, L + ecart, H / 2];
    var boiteCapot = capotHaut
      ? { x: 4, y: 4, z: H + ecart, w: W - 8, d: L - 8, h: 2 }
      : { x: 4, y: L + ecart, z: 4, w: W - 8, d: 2, h: H - 8 };
    var cap = I.boite(boiteCapot, { cls: "iso-tole" }) + I.ligne(departCapot, finCapot, "iso-axe");
    var ef = 120, fac = I.boite({ x: W + ef, y: 0, z: 0, w: 8, d: L, h: H }, { cls: "iso-plastique" }) + I.ligne([W, L / 2, H / 2], [W + ef, L / 2, H / 2], "iso-axe");
    var bornes = { x: 0, y: -40, z: -10, w: W + ef + 20, d: L + ecart + 40, h: H + (capotHaut ? ecart : 0) + 40 };
    var k = Math.max(0.3, Math.min(2.5, ((W + L + ecart * 2) * 0.87) / 600));
    var cotes = I.cote([0, 0, H], [W, 0, H], mm(W), [0, -30, 0], k) + I.cote([W, 0, H], [W, L, H], mm(L), [40, 0, 0], k) + I.cote([W, 0, 0], [W, 0, H], mm(H), [0, -30, 0], k);
    return I.scene([], { fond: s + fac, avant: cap + cotes, bornes: [bornes], notes: [{ rep: "1", ancre: finCapot, dir: [40, -40] }, { rep: "2", ancre: [W + ef + 8, L / 2, H * 0.4], dir: [50, 20] }, { rep: "3", ancre: [W / 2, L, H * 0.3], dir: [-60, 40] }], classe: "fiche-iso", titre: m.titre + " : boîtier coté, capot et façade écartés", marge: 30 * k, repK: k });
  }

  host.textContent = "";
  var h = el("header", { "class": "at-head" });
  h.appendChild(el("p", { "class": "mt-surtitre" }, "Atelier hardware · " + code + " · Annexe : modèle d'entreprise"));
  h.appendChild(el("h1", null, m.titre));
  h.appendChild(el("p", { "class": "mt-chapeau" }, m.role));
  host.appendChild(h);
  var feuille = el("div", { "class": "mt-feuille" }), txt = el("div", { "class": "mt-texte" }), col = el("div", { "class": "mt-colle mt-avant" });
  feuille.appendChild(txt); feuille.appendChild(col); host.appendChild(feuille);

  var fig = el("figure", { "class": "mt-planche" });
  fig.innerHTML = maquette(m.dims, m.capotHaut);
  var cart = el("div", { "class": "mt-cartouche", "aria-hidden": "true" });
  [["Planche", code], ["Vue", "Éclatée"], ["Objet", "Boîtier compact"], ["Source", "Manuel " + m.constructeur]].forEach(function (x) { var s = el("span", null, x[0]); s.appendChild(el("b", null, x[1])); cart.appendChild(s); });
  fig.appendChild(cart);
  col.appendChild(fig);
  col.appendChild(el("p", { "class": "mt-fig" })).innerHTML = "<b>FIG. " + code + "</b> · Dimensions du manuel ; capot et façade écartés. Pour les pièces internes, voir les figures du manuel.";
  var t = el("table", { "class": "mt-nomenclature" });
  t.innerHTML = "<thead><tr><th>Rep.</th><th>Désignation</th></tr></thead>";
  var trp = el("tbody");
  m.reperes.forEach(function (texte, j) {
    var ligne = el("tr");
    ligne.appendChild(el("td")).appendChild(el("span", { "class": "mt-rep" }, j + 1));
    ligne.appendChild(el("td", null, texte));
    trp.appendChild(ligne);
  });
  t.appendChild(trp);
  col.appendChild(t);

  function section(sid, titre) { var s = el("section", { "aria-labelledby": "f-" + sid }); s.appendChild(el("h2", { id: "f-" + sid }, titre)); txt.appendChild(s); return s; }
  var s1 = section("carac", "Caractéristiques");
  var tf = el("table", { "class": "mt-fiche" }), tb = el("tbody");
  m.carac.forEach(function (c) { var tr = el("tr"); tr.appendChild(el("th", { scope: "row" }, c[0])); tr.appendChild(el("td", null, c[1])); tb.appendChild(tr); });
  tf.appendChild(tb); s1.appendChild(tf);
  var s2 = section("compo", "Composants principaux (d'après le manuel)");
  var ulc = el("ul", { "class": "mt-colonnes" });
  m.composants.forEach(function (c) { ulc.appendChild(el("li", null, c)); });
  s2.appendChild(ulc);
  var cr = el("div", { "class": "mt-encadre remarque" }); cr.appendChild(el("p", { "class": "mt-etiq" }, "Qui peut intervenir ?")); cr.appendChild(el("p", null, m.cru)); s2.appendChild(cr);
  var s3 = section("avant", "Avant d'intervenir");
  var at = el("div", { "class": "mt-encadre attention" }); at.appendChild(el("p", { "class": "mt-etiq" }, "Attention"));
  var ula = el("ol"); m.avant.forEach(function (a) { ula.appendChild(el("li", null, a)); }); at.appendChild(ula); s3.appendChild(at);
  var s4 = section("proc", "Procédures de retrait");
  m.procedures.forEach(function (p, k) {
    var d = el("details", { "class": "mt-procbloc" + (k === 0 ? "" : "") });
    if (k < 1) d.open = true;
    d.appendChild(el("summary", null, p.titre));
    d.appendChild(el("p", { "class": "mt-pre" }, "Au préalable : " + p.pre.join(" › ")));
    var ol = el("ol", { "class": "mt-proc" });
    p.etapes.forEach(function (e) { ol.appendChild(el("li", null, e)); });
    d.appendChild(ol);
    s4.appendChild(d);
  });
  var s5 = section("compar", "Comparer avec la tour de l'atelier");
  var tc = el("table", { "class": "mt-fiche" });
  tc.innerHTML = "<thead><tr><th>Point</th><th>Tour générique</th><th></th></tr></thead>";
  tc.tHead.rows[0].cells[2].textContent = m.titreCourt;
  var tbc = el("tbody");
  m.comparaison.forEach(function (c) { var tr = el("tr"); tr.appendChild(el("th", { scope: "row" }, c[0])); tr.appendChild(el("td", null, c[1].replace(/^[^:]+: /, ""))); tr.appendChild(el("td", null, c[2].replace(/^[^:]+: /, ""))); tbc.appendChild(tr); });
  tc.appendChild(tbc);
  tc.classList.add("mt-compar");
  var tw = el("div", { "class": "table-wrap" }); tw.appendChild(tc); s5.appendChild(tw);
  var u = el("div", { "class": "mt-encadre remarque" }); u.appendChild(el("p", { "class": "mt-etiq" }, "À vérifier sur place (UMONS)"));
  var ulu = el("ul"); m.umons.forEach(function (x) { ulu.appendChild(el("li", null, x)); }); u.appendChild(ulu); txt.appendChild(u);
  var src = el("aside", { "class": "mt-encadre source" }); src.appendChild(el("p", { "class": "mt-etiq" }, "Sources"));
  var us = el("ul"); m.sources.forEach(function (x) { var li = el("li"); li.appendChild(el("a", { href: x[1] }, x[0])); us.appendChild(li); }); src.appendChild(us);
  src.appendChild(el("p", null, "Manuel lu le 28/11/2026. Les procédures sont résumées en français ; en intervention réelle, on suit le manuel du modèle exact."));
  txt.appendChild(src);
  var sl = section("liens", "Voir aussi");
  var ule = el("ul", { "class": "mt-entrees" });
  m.liens.forEach(function (x) { var li = el("li"), a = el("a", { href: x[1] }); a.appendChild(el("span", { "class": "mt-e-n" }, x[0])); a.appendChild(el("span", { "class": "mt-e-t" }, x[2])); li.appendChild(a); ule.appendChild(li); });
  sl.appendChild(ule);
})();
