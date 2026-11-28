/* Atelier hardware — partie A : fiches techniques des composants (lot 44, REFONTE.md § 7.5).
   Données : assets/atelier-fiches-data.js (A.fiches). Page : atelier/composants.html?c=<id>.
   Chaque fiche : planche isométrique cotée avec repères et nomenclature, caractéristiques, vérifications, pièges, sources. */
(function () {
  "use strict";
  var A = window.IT_ATELIER, I = window.IT_ISO, ID = window.IT_ISO_DATA;
  var host = document.getElementById("fiche");
  if (!host || !A || !A.fiches || !I || !ID) return;
  var store = (window.IT && window.IT.store) || { get: function () { return null; }, set: function () {} };
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function deux(n) { return (n < 10 ? "0" : "") + n; }
  var ids = Object.keys(A.fiches);
  var id = new URLSearchParams(location.search).get("c");

  /* Planche d'une fiche : la pièce, ses cotes et ses repères. */
  /* Échelle de planche (petites pièces) : tout est multiplié, cotes et repères compris. */
  function echelle(pl) {
    var k = pl.echelle || 1;
    if (k === 1) return pl;
    function bx(b) { return { x: b.x * k, y: b.y * k, z: b.z * k, w: b.w * k, d: b.d * k, h: b.h * k }; }
    function pt(p) { return [p[0] * k, p[1] * k, p[2] * k]; }
    var o = {}; for (var c in pl) o[c] = pl[c];
    o.boite = bx(pl.boite);
    o.extra = (pl.extra || []).map(function (x) { return { type: x.type, piece: x.piece, prio: x.prio, boite: bx(x.boite) }; });
    o.reps = (pl.reps || []).map(function (r) { return { rep: r.rep, nom: r.nom, ancre: pt(r.ancre), dir: r.dir }; });
    o.cotes = (pl.cotes || []).map(function (q) { return { a: pt(q.a), b: pt(q.b), txt: q.txt, dec: pt(q.dec || [0, 0, 0]) }; });
    o.echelle = 1;
    return o;
  }
  function planche(f) {
    var pl = echelle(f.planche), b = pl.boite, piece = pl.piece ? A.pieces[pl.piece] : null;
    var items = [{ id: f.id, boite: b, dessin: function (bb) { return ID.dessin(pl.type, bb, piece); } }];
    (pl.extra || []).forEach(function (x, k) { items.push({ id: f.id + "-x" + k, boite: x.boite, prio: x.prio || 0, dessin: function (bb) { return ID.dessin(x.type, bb, x.piece ? A.pieces[x.piece] : null); } }); });
    var bornes = [b];
    (pl.extra || []).forEach(function (x) { bornes.push(x.boite); });
    (pl.cotes || []).forEach(function (c) { bornes.push(I.boiteDe(c.a, c.b, c.dec)); });
    /* Taille des repères et des cotes proportionnelle à la planche : ils gardent la même taille à l'écran. */
    var mx = 1e9, Mx = -1e9, my = 1e9, My = -1e9;
    bornes.forEach(function (q) {
      [[q.x, q.y, q.z], [q.x + q.w, q.y + q.d, q.z + q.h], [q.x, q.y + q.d, q.z], [q.x + q.w, q.y, q.z + q.h], [q.x + q.w, q.y + q.d, q.z], [q.x, q.y, q.z + q.h]].forEach(function (c) {
        var p = I.P(c[0], c[1], c[2]); mx = Math.min(mx, p[0]); Mx = Math.max(Mx, p[0]); my = Math.min(my, p[1]); My = Math.max(My, p[1]);
      });
    });
    var k = Math.max(0.12, Math.min(2.5, Math.max(Mx - mx, (My - my) * 1.2) / 600));
    var avant = "";
    (pl.cotes || []).forEach(function (c) { avant += I.cote(c.a, c.b, c.txt, c.dec, k); });
    return I.scene(items, { t: 0, avant: avant, bornes: bornes, notes: pl.reps, classe: "fiche-iso", titre: f.titre + " : planche cotée", marge: 30 * k, repK: k });
  }

  function liste() {
    host.textContent = "";
    var h = el("header", { "class": "at-head" });
    h.appendChild(el("p", { "class": "mt-surtitre" }, "Atelier hardware · Partie A"));
    h.appendChild(el("h1", null, "Composants"));
    h.appendChild(el("p", { "class": "mt-chapeau" }, "Une fiche technique par pièce : rôle, caractéristiques à lire, compatibilité, pièges et sources."));
    host.appendChild(h);
    var g = el("div", { "class": "fiches-grille" });
    ids.forEach(function (k, i) {
      var f = A.fiches[k];
      var a = el("a", { "class": "fiche-carte", href: "composants.html?c=" + k });
      var ico = el("span", { "class": "ico", "aria-hidden": "true" });
      ico.innerHTML = I.scene([{ id: k, boite: f.planche.boite, dessin: function (bb) { return ID.dessin(f.planche.type, bb, f.planche.piece ? A.pieces[f.planche.piece] : null); } }], { reperes: false, marge: 4, classe: "at-ico" });
      a.appendChild(ico);
      a.appendChild(el("span", { "class": "mt-e-n" }, "A-" + deux(i + 1)));
      a.appendChild(el("span", { "class": "nom" }, f.titre));
      a.appendChild(el("span", { "class": "res" }, f.role));
      if (store.get("done.atelier-fiche-" + k) === "1") a.appendChild(el("span", { "class": "mt-e-etat ok" }, "lue ✓"));
      g.appendChild(a);
    });
    host.appendChild(g);
  }

  function fiche(f, i) {
    host.textContent = "";
    document.title = f.titre + " — Atelier hardware";
    var code = "A-" + deux(i + 1);
    var h = el("header", { "class": "at-head" });
    h.appendChild(el("p", { "class": "mt-surtitre" }, "Atelier hardware · " + code + " · Fiche technique"));
    h.appendChild(el("h1", null, f.titre));
    h.appendChild(el("p", { "class": "mt-chapeau" }, f.role));
    host.appendChild(h);

    var feuille = el("div", { "class": "mt-feuille" });
    var txt = el("div", { "class": "mt-texte" });
    var col = el("div", { "class": "mt-colle mt-avant" });
    feuille.appendChild(txt); feuille.appendChild(col);
    host.appendChild(feuille);

    /* Planche */
    var fig = el("figure", { "class": "mt-planche", "aria-labelledby": "fig-" + f.id });
    fig.innerHTML = planche(f);
    var cart = el("div", { "class": "mt-cartouche", "aria-hidden": "true" });
    [["Planche", code], ["Vue", "Isométrique"], ["Objet", f.planche.objet || f.titre], ["Cotes", "mm"]].forEach(function (x) { var s = el("span", null, x[0]); s.appendChild(el("b", null, x[1])); cart.appendChild(s); });
    fig.appendChild(cart);
    col.appendChild(fig);
    col.appendChild(el("p", { "class": "mt-fig", id: "fig-" + f.id }, "")).innerHTML = "<b>FIG. " + code + "</b> · " + f.planche.legende;
    if (f.planche.reps && f.planche.reps.length) {
      var t = el("table", { "class": "mt-nomenclature" });
      t.innerHTML = "<caption class=\"sr-only\">Nomenclature de la planche</caption><thead><tr><th>Rep.</th><th>Désignation</th></tr></thead>";
      var tb = el("tbody");
      f.planche.reps.forEach(function (r) {
        var tr = el("tr", { "data-rep": r.rep });
        var td = el("td"); td.appendChild(el("span", { "class": "mt-rep" }, r.rep)); tr.appendChild(td);
        tr.appendChild(el("td", null, r.nom));
        tr.addEventListener("mouseenter", function () { var g = fig.querySelector('.iso-rep[data-rep="' + r.rep + '"]'); if (g) g.classList.add("is-hl"); tr.classList.add("is-hl"); });
        tr.addEventListener("mouseleave", function () { var g = fig.querySelector('.iso-rep[data-rep="' + r.rep + '"]'); if (g) g.classList.remove("is-hl"); tr.classList.remove("is-hl"); });
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      col.appendChild(t);
    }

    /* Texte */
    function section(idSec, titre) {
      var s = el("section", { "aria-labelledby": f.id + "-" + idSec });
      s.appendChild(el("h2", { id: f.id + "-" + idSec }, titre));
      txt.appendChild(s);
      return s;
    }
    var s1 = section("role", "Rôle");
    f.texte.forEach(function (p) { s1.appendChild(el("p", null, p)); });
    var s2 = section("carac", "Caractéristiques à lire");
    var tf = el("table", { "class": "mt-fiche" });
    var tbf = el("tbody");
    f.carac.forEach(function (c) { var tr = el("tr"); tr.appendChild(el("th", { scope: "row" }, c[0])); tr.appendChild(el("td", null, c[1])); tbf.appendChild(tr); });
    tf.appendChild(tbf); s2.appendChild(tf);
    var s3 = section("verif", "Avant de poser : vérifier");
    var ol = el("ol", { "class": "mt-proc" });
    f.verifier.forEach(function (v) { var li = el("li"); li.appendChild(el("strong", null, v[0])); li.appendChild(document.createTextNode(v[1])); ol.appendChild(li); });
    s3.appendChild(ol);
    (f.pieges || []).forEach(function (p) {
      var d = el("div", { "class": "mt-encadre attention" });
      d.appendChild(el("p", { "class": "mt-etiq" }, "Attention"));
      d.appendChild(el("p", null, p));
      txt.appendChild(d);
    });
    if (f.umons) {
      var u = el("div", { "class": "mt-encadre remarque" });
      u.appendChild(el("p", { "class": "mt-etiq" }, "À vérifier sur place"));
      u.appendChild(el("p", null, f.umons));
      txt.appendChild(u);
    }
    if (f.atelier && f.atelier.length) {
      var s4 = section("atelier", "Dans l'atelier");
      var ul = el("ul", { "class": "mt-entrees" });
      f.atelier.forEach(function (x) {
        var li = el("li"), a = el("a", { href: x[1] });
        a.appendChild(el("span", { "class": "mt-e-n" }, x[0]));
        a.appendChild(el("span", { "class": "mt-e-t" }, x[2]));
        li.appendChild(a); ul.appendChild(li);
      });
      s4.appendChild(ul);
    }
    var src = el("aside", { "class": "mt-encadre source" });
    src.appendChild(el("p", { "class": "mt-etiq" }, "Sources"));
    var us = el("ul");
    f.sources.forEach(function (x) { var li = el("li"); var a = el("a", { href: x[1], rel: "noopener" }, x[0]); li.appendChild(a); if (x[2]) li.appendChild(document.createTextNode(" — " + x[2])); us.appendChild(li); });
    src.appendChild(us);
    src.appendChild(el("p", null, "Consultées le 28/11/2026. Les pièces de l'atelier sont génériques : seules les valeurs citées ici viennent des sources."));
    txt.appendChild(src);

    /* Lue + navigation */
    var KEY = "done.atelier-fiche-" + f.id;
    var lu = el("button", { type: "button", "class": "btn", "aria-pressed": store.get(KEY) === "1" ? "true" : "false" }, store.get(KEY) === "1" ? "Fiche lue ✓" : "J'ai lu cette fiche");
    lu.addEventListener("click", function () { store.set(KEY, "1"); lu.textContent = "Fiche lue ✓"; lu.setAttribute("aria-pressed", "true"); });
    var nav = el("nav", { "class": "fiche-nav", "aria-label": "Fiches voisines" });
    if (i > 0) nav.appendChild(el("a", { href: "composants.html?c=" + ids[i - 1], "class": "btn ghost" }, "‹ " + A.fiches[ids[i - 1]].titre));
    nav.appendChild(lu);
    if (i < ids.length - 1) nav.appendChild(el("a", { href: "composants.html?c=" + ids[i + 1], "class": "btn ghost" }, A.fiches[ids[i + 1]].titre + " ›"));
    host.appendChild(nav);
  }

  var i = ids.indexOf(id);
  if (i < 0) liste(); else fiche(A.fiches[id], i);
})();
