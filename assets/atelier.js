/* Atelier hardware — interface : scène, bac de pièces, étapes guidées, démarrage simulé. */
(function () {
  "use strict";
  var A = window.IT_ATELIER, R = window.IT_ATELIER_RULES;
  var host = document.getElementById("atelier");
  if (!host || !A || !R || !window.IT_ISO_DATA) return;

  var params = new URLSearchParams(location.search);
  var P = A.pieces;
  var store = (window.IT && window.IT.store) || { get: function () { return null; }, set: function () {}, del: function () {} };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EVAL = host.getAttribute("data-eval") === "1";
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Un montage = un scénario dans un mode (apprentissage ou test). L'évaluation enchaîne plusieurs montages. */
  function demarrer(scId, ctx) {
  ctx = ctx || {};
  var sc = A.scenarios[scId];
  if (!sc) { host.textContent = "Scénario introuvable."; return; }
  var disp = A.dispositions[sc.disposition];
  var TEST = ctx.mode === "test";
  var KEY = "atelier." + sc.id + (ctx.cle ? "." + ctx.cle : (TEST ? ".test" : ""));

  var st = R.nouvelEtat(sc, TEST ? "test" : "apprentissage");
  st.indices = {}; st.aides = 0;
  var hist = [];
  var sel = null;                 /* { type: "tray", id } ou { type: "slot", id } */
  var vue = "interieur";
  var onglet = "composant";
  var msgTxt = "", msgNiv = "info";
  var postTimer = null, confirmTimer = null, finTimer = null, justDragged = false, fini = false;

  var VUES = [["interieur", "3/4 avant"], ["carte", "Carte mère"], ["arriere", "Arrière"]];
  var CATS = [["composant", "Composants"], ["accessoire", "Accessoires"], ["cable", "Câbles"]];

  /* ---------- Utilitaires ---------- */
  function slotById(id) { return R.slotDef(sc, id); }
  function steps() { return R.etapes(sc, st); }
  function cur() { return R.etapeCourante(sc, st); }

  /* ---------- Sauvegarde ---------- */
  function save() {
    store.set(KEY, JSON.stringify({ placed: st.placed, switchOn: st.switchOn, indices: st.indices, aides: st.aides, erreurs: st.erreurs, errT: st.errT, echecs: st.echecs }));
  }
  function load() {
    var raw = store.get(KEY);
    if (!raw) return;
    try {
      var d = JSON.parse(raw), used = {};
      st.placed = {};
      Object.keys(d.placed || {}).forEach(function (s) {
        var it = d.placed[s];
        if (slotById(s) && sc.inventaire.indexOf(it) >= 0 && !used[it]) { st.placed[s] = it; used[it] = 1; }
      });
      st.switchOn = !!d.switchOn; st.indices = d.indices || {}; st.aides = d.aides || 0; st.erreurs = d.erreurs || 0;
      st.errT = d.errT || {}; st.echecs = d.echecs || [];
    } catch (e) { /* sauvegarde illisible : on repart de zéro */ }
  }

  /* ---------- Squelette « manuel technique » (REFONTE.md § 7) ---------- */
  host.textContent = "";
  var I = window.IT_ISO, ID = window.IT_ISO_DATA, G = ID.GEO[sc.disposition] || ID.GEO["tour-matx"];
  var W = G.boitier.w, Dp = G.boitier.d;
  var num = /-s(\d+)$/.exec(sc.unite || "");
  var code = ctx.eval ? "EP-1." + (ctx.eval.i + 1) : (sc.code || ("B-0" + (num ? num[1] : "1")));
  function deux(n) { return (n < 10 ? "0" : "") + n; }

  var head = el("header", { "class": "at-head" });
  head.innerHTML = '<p class="mt-surtitre"></p><h1></h1><div class="at-badges"></div><div class="progress at-progress" aria-live="polite"></div><p class="at-modes"></p>';
  head.querySelector(".mt-surtitre").textContent = "Atelier hardware · " + code + " · " + (ctx.eval ? "Épreuve des montages, " + (ctx.eval.i + 1) + " / " + ctx.eval.n : (sc.type === "demontage" ? "Procédure de démontage" : "Procédure de montage"));
  head.querySelector("h1").textContent = sc.titre;
  var badges = head.querySelector(".at-badges");
  [[TEST ? "Test noté" : "Apprentissage", "mode"], [sc.niveau, ""], [sc.duree, ""]].forEach(function (b) { badges.appendChild(el("span", { "class": "badge" + (b[1] ? " mode" : "") }, b[0])); });
  if (!ctx.eval) {
    var lm = el("a", { href: "montage.html?s=" + sc.id + (TEST ? "" : "&m=test") }, TEST ? "Passer en mode apprentissage (guidé)" : "Passer en mode test (sans aide, noté)");
    head.querySelector(".at-modes").appendChild(lm);
  }
  host.appendChild(head);

  function cartouche(cells) {
    var c = el("div", { "class": "mt-cartouche", "aria-hidden": "true" });
    cells.forEach(function (x) { var s = el("span", null, x[0]); s.appendChild(el("b", null, x[1])); c.appendChild(s); });
    return c;
  }

  /* Fiche de travail : cahier des charges + planche du boîtier vide */
  var brief = el("div", { "class": "mt-feuille cahier" });
  var cG = el("section", { "class": "mt-texte", "aria-labelledby": "cahier-titre" });
  cG.appendChild(el("p", { "class": "mt-surtitre" }, code + " · Fiche de travail"));
  cG.appendChild(el("h2", { id: "cahier-titre", tabindex: "-1" }, "Cahier des charges"));
  cG.appendChild(el("p", { "class": "at-client" }, sc.brief.client));
  var ulb = el("ul", { "class": "at-besoins" });
  sc.brief.besoin.forEach(function (x) { ulb.appendChild(el("li", null, x)); });
  cG.appendChild(ulb);
  var mat = el("div", { "class": "mt-encadre outillage" });
  mat.appendChild(el("p", { "class": "mt-etiq" }, "Matériel fourni"));
  mat.appendChild(el("p", null, sc.brief.materiel));
  cG.appendChild(mat);
  var srcA = el("aside", { "class": "mt-encadre source" });
  srcA.innerHTML = '<p class="mt-etiq">Source</p><p>Les pièces sont des modèles génériques : leurs caractéristiques sont réalistes mais simplifiées. Référence pour les fiches de processeurs : Intel ARK (ark.intel.com) et AMD ; normes mémoire : JEDEC (DDR4, DDR5) ; exigences de Windows 11 : Microsoft Learn. Théorie : <a href="../stage/j9.html">jour 9 de la prépa</a> (matériel et PC).</p>';
  cG.appendChild(srcA);
  [["source", sc.brief.source, "Source"], ["remarque", sc.brief.umons, "À vérifier sur place"]].forEach(function (x) {
    if (!x[1]) return;
    var a = el("aside", { "class": "mt-encadre " + x[0] });
    a.appendChild(el("p", { "class": "mt-etiq" }, x[2]));
    a.appendChild(el("p", null, x[1]));
    cG.appendChild(a);
  });
  var cD = el("section", { "class": "mt-colle mt-avant", "aria-label": "Planche d'ouverture" });
  var cFig = el("figure", { "class": "mt-planche" });
  var depart0 = {}; Object.keys(sc.depart || {}).forEach(function (k) { depart0[k] = sc.depart[k]; });
  cFig.innerHTML = sceneSVG({ placed: depart0, vue: "interieur", t: 0, titre: "Le boîtier avant l'intervention, vu de trois quarts avant, panneau latéral retiré" });
  cFig.appendChild(cartouche([["Planche", code + ".00"], ["Vue", "3/4 avant"], ["Objet", G.nom], ["Modèle", "Générique"]]));
  cD.appendChild(cFig);
  cD.appendChild(el("p", { "class": "mt-fig" }, "FIG. 0 · Le boîtier avant l'intervention, panneau latéral retiré."));
  var cAct = el("p", { "class": "cahier-actions" });
  var bCommencer = el("button", { type: "button", "class": "btn" }, TEST ? "Commencer le test ›" : "Commencer le montage ›");
  cAct.appendChild(bCommencer);
  cD.appendChild(cAct);
  brief.appendChild(cG); brief.appendChild(cD);
  host.appendChild(brief);

  /* Feuille de procédure : texte à gauche, planche collante à droite (au-dessus sur mobile) */
  var layout = el("div", { "class": "mt-feuille at-layout" });
  var pageG = el("section", { "class": "mt-texte", "aria-label": "Procédure" });
  var pageD = el("section", { "class": "mt-colle mt-avant", "aria-label": "Planche et bac de pièces" });
  layout.appendChild(pageG); layout.appendChild(pageD);
  host.appendChild(layout);
  var corps = el("div", { "class": "mt-corps" });
  var margeIndices = el("div", { "class": "marge-indices" });
  var bCahier = el("button", { type: "button", "class": "btn ghost" }, "Relire le cahier des charges");
  pageG.appendChild(corps);
  var main = el("div", { "class": "at-main" });
  pageD.appendChild(main);
  var fig = el("div", { "class": "mt-legende-zone" });
  var lettreSel = null, dernierEtape = null, ecart = 0;
  function voirCahier(on) {
    brief.hidden = !on; layout.hidden = on;
    if (!on) renderScene();
    var f = on ? brief.querySelector("#cahier-titre") : corps.querySelector("h2");
    if (f) { f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); }
  }
  bCommencer.addEventListener("click", function () { voirCahier(false); });
  bCahier.addEventListener("click", function () { voirCahier(true); });

  /* onglets de vue */
  var tabsVue = el("div", { "class": "at-tabs", role: "tablist", "aria-label": "Angle de vue" });
  VUES.forEach(function (v) {
    var b = el("button", { type: "button", role: "tab", "data-vue": v[0], "class": "at-tab" }, v[1]);
    b.addEventListener("click", function () { setVue(v[0]); });
    tabsVue.appendChild(b);
  });
  main.appendChild(tabsVue);

  var planche = el("figure", { "class": "mt-planche at-planche" });
  var scene = el("div", { "class": "at-scene" });
  planche.appendChild(scene);
  var cart = el("div");
  planche.appendChild(cart);
  main.appendChild(planche);
  var figCap = el("p", { "class": "mt-fig" });
  main.appendChild(figCap);
  var ecartP = el("p", { "class": "mt-ecart" });
  ecartP.innerHTML = '<label for="at-ecart">Vue éclatée</label> <input type="range" id="at-ecart" min="0" max="100" step="10" value="0">';
  var ecartIn = ecartP.querySelector("input");
  ecartIn.addEventListener("input", function () { ecart = ecartIn.value / 100; renderScene(); });
  main.appendChild(ecartP);
  main.appendChild(fig);

  var actions = el("div", { "class": "at-actions" });
  var bUndo = el("button", { type: "button", "class": "btn ghost" }, "Annuler");
  var bHint = el("button", { type: "button", "class": "btn ghost" }, "Indice");
  var bSwitch = el("button", { type: "button", "class": "btn ghost", "aria-pressed": "false" }, "Interrupteur : O");
  var bPower = el("button", { type: "button", "class": "btn" }, "Allumer le PC");
  var bReset = el("button", { type: "button", "class": "btn ghost" }, "Recommencer");
  var bFin = el("button", { type: "button", "class": "btn" }, "Terminer le test");
  bHint.hidden = TEST; bFin.hidden = !TEST;
  [bUndo, bHint, bSwitch, bPower, bFin, bReset].forEach(function (b) { actions.appendChild(b); });
  main.appendChild(actions);

  var msgBox = el("div", { "class": "at-msg mt-encadre", role: "status", "aria-live": "polite" });
  var secEtape = el("section", { "class": "at-etape", "aria-label": "Étape en cours" });
  var secSel = el("section", { "class": "at-sel", "aria-label": "Pièce sélectionnée" });
  var secBac = el("section", { "class": "at-bac", "aria-label": "Bac de pièces" });
  var secListe = el("section", { "class": "at-liste", "aria-label": "Toutes les étapes" });
  corps.appendChild(secEtape); corps.appendChild(msgBox); corps.appendChild(margeIndices); corps.appendChild(secSel); corps.appendChild(secListe); corps.appendChild(bCahier);
  pageD.appendChild(secBac);

  var secPost = el("section", { "class": "at-post bloc", id: "at-post", hidden: "", "aria-label": "Démarrage du PC" });
  host.appendChild(secPost);

  /* ---------- Messages ---------- */
  var ETIQ = { info: "Atelier", ok: "Juste", attention: "Attention", bloque: "Refusé", danger: "Danger" };
  function msg(txt, niv, html) {
    msgTxt = txt; msgNiv = niv || "info";
    msgBox.className = "at-msg mt-encadre " + msgNiv;
    msgBox.textContent = "";
    msgBox.appendChild(el("p", { "class": "mt-etiq" }, ETIQ[msgNiv] || "Atelier"));
    var p = el("p");
    if (html) p.innerHTML = html; else p.textContent = txt;
    msgBox.appendChild(p);
  }

  /* ---------- Vues ---------- */
  function vueDe(v) { return v === "arriere" ? "arriere" : v === "zoom" ? "carte" : "interieur"; }
  function setVue(v) {
    vue = v;
    renderScene();
  }
  function candidatSlots() {
    if (!sel || sel.type !== "tray") return [];
    return R.candidats(sc, st, sel.id);
  }
  function guideSlots() {
    var i = cur(), out = {};
    if (TEST || i >= sc.etapes.length) return out;
    var e = sc.etapes[i];
    if ((st.indices[e.id] || 0) > e.indices.length) (e.solution || []).forEach(function (p) { if (!st.placed[p[0]]) out[p[0]] = p[1]; });
    return out;
  }
  function isCable(s) { return s.accepte[0].indexOf("cab-") === 0; }
  function dispo(s) {
    return (s.requiert || []).every(function (r) { return !!st.placed[r]; });
  }

  /* ---------- Dessin de la maquette isométrique ---------- */
  function rot(b) { var o = {}; for (var k in b) o[k] = b[k]; o.x = W - b.x - b.w; o.y = Dp - b.y - b.d; return o; }
  function contour(b, cls) {
    var x = b.x, y = b.y, z = b.z, X = x + b.w, Y = y + b.d, Z = z + b.h;
    return '<polygon class="' + cls + '" points="' + I.pts([[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]]) + '"/>' +
      '<polygon class="' + cls + '" points="' + I.pts([[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]]) + '"/>' +
      '<polygon class="' + cls + '" points="' + I.pts([[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]]) + '"/>';
  }
  /* Point de départ d'un câble : l'alimentation, un ventilateur, la façade ou la carte mère. */
  function departCable(p) {
    var t = p.type, g = G.slots;
    if (t === "cab-fan") { var f = g[p.source] || g["fan-rear"]; return f ? I.centre(f) : G.sortieAlim; }
    if (t === "cab-facade" || t === "cab-usb3" || t === "cab-audio") return [W - 8, 30, G.boitier.h - 60];
    if (t === "cab-sata-data") return [g.board.x + g.board.w - 8, 12, g.board.z + 40];
    return G.sortieAlim;
  }
  function boutonsFace(o) {
    var c = G.boitier, Hh = c.h, s = "";
    s += I.rect("x", { x: W, y: 24, z: Hh - 70, d: 14, h: 6 }, "iso-trou") + I.rect("x", { x: W, y: 44, z: Hh - 70, d: 14, h: 6 }, "iso-trou");
    var led = o.post === "ok" ? "iso-led ok" : o.post ? "iso-led ko" : "iso-led";
    s += I.cercle("x", [W, 120, Hh - 66], 3, led);
    s += '<g data-bouton="power" class="iso-bouton"><title>Bouton marche</title>' + I.cercle("x", [W, 150, Hh - 66], 9, "iso-bouton-c") + I.cercle("x", [W, 150, Hh - 66], 4, "iso-det") + "</g>";
    return s;
  }
  function arrierePanneau(o) {
    var c = G.boitier, Hh = c.h, s = "", g = G.slots, X = W;
    s += I.boite({ x: 0, y: 0, z: 0, w: W, d: Dp, h: Hh }, { cls: "iso-tole" });
    function r(b, cls) { var q = rot(b); return I.rect("x", { x: X, y: q.y, z: q.z, d: q.d, h: q.h }, cls); }
    s += r(g.ioshield, "iso-metal-f");
    for (var i = 0; i < 4; i++) s += r({ x: 0, y: g.ioshield.y + 6, z: g.ioshield.z + 12 + i * 34, w: 2, d: 30, h: 22 }, "iso-trou");
    if (g["fan-rear"]) { var fr = rot(g["fan-rear"]); s += I.cercle("x", [X, fr.y + fr.d / 2, fr.z + fr.h / 2], fr.h / 2 - 8, "iso-grille"); }
    var ps = rot(g.psu); s += I.rect("x", { x: X, y: ps.y, z: ps.z, d: ps.d, h: ps.h }, "iso-metal-f");
    for (var k = 0; k < 4; k++) s += r({ x: 0, y: g.ioshield.y + 2, z: g.ioshield.z - 26 - k * 20, w: 2, d: 112, h: 12 }, "iso-det");
    var m = rot(g.mains);
    s += '<g data-bouton="switch" class="iso-bouton"><title>Interrupteur de l\'alimentation : ' + (o.switchOn ? "I" : "O") + "</title>" +
      I.rect("x", { x: X, y: m.y - 22, z: m.z + 4, d: 14, h: 18 }, o.switchOn ? "iso-inter on" : "iso-inter") + "</g>";
    return s;
  }
  function itemsPieces(o, cand, guide, rotation) {
    var items = [], avant = "";
    disp.slots.forEach(function (s) {
      var gs = G.slots[s.id];
      if (!gs) return;
      if (rotation ? !gs.arriere : gs.arriere) return;
      var it = o.placed[s.id], p = it && P[it];
      var b = rotation ? rot(gs) : gs, axe = rotation && gs.axe ? [-gs.axe[0], -gs.axe[1], gs.axe[2]] : gs.axe;
      if (p) {
        if (isCable(s)) {
          if (!rotation) avant += ID.cable(departCable(p), b);
          else { var cc = I.centre(b); avant += I.ligne([cc[0], cc[1], cc[2]], [cc[0] + 70, cc[1] + 10, cc[2] - 40], "iso-cable-l"); }
          items.push({ id: s.id, boite: b, cls: "pose" + (o.sel === s.id ? " is-sel" : ""), titre: p.nom, prio: 60, dessin: function (bb) { return I.boite(bb, { cls: "iso-connecteur" }); }, slot: s.id });
        } else {
          items.push({ id: s.id, boite: b, axe: axe, ecart: gs.ecart, prio: gs.prio, cls: "pose" + (o.sel === s.id ? " is-sel" : "") + (o.hl === s.id ? " is-hl" : ""), titre: p.nom, slot: s.id,
            dessin: function (bb) { return ID.dessin(p.type, bb, p); } });
        }
      } else if (cand[s.id] || guide[s.id] || (o.etape && o.etape.indexOf(s.id) >= 0 && dispo(s))) {
        var cls = cand[s.id] ? "iso-cible" : "iso-vide";
        items.push({ id: s.id, boite: b, prio: 2000, cible: !!cand[s.id], titre: s.nom, slot: s.id, cls: cand[s.id] ? "slot-cible" : "slot-vide" + (guide[s.id] ? " guide" : ""),
          dessin: function (bb) { return contour(bb, cls); } });
      }
    });
    return { items: items, avant: avant };
  }
  /* Une planche complète, en texte SVG (utilisée aussi pour la planche d'ouverture). */
  function sceneSVG(o) {
    var rotation = o.vue === "arriere", cand = o.cand || {}, guide = o.guide || {};
    var r = itemsPieces(o, cand, guide, rotation);
    r.items.forEach(function (it) {
      var d = it.dessin;
      it.dessin = function (bb) { return d(bb); };
      it.rep = o.reps && o.reps[it.id] ? o.reps[it.id] : null;
    });
    var fond = rotation ? arrierePanneau(o) : ID.boitier(G);
    var cad = null;
    if (o.vue === "carte") {
      var bo = G.slots.board;
      cad = [{ x: bo.x - 6, y: 0, z: bo.z - 6, w: bo.w + 12, d: 60, h: bo.h + 12 }];
      /* Loupe : quand des emplacements de la carte sont proposés, on cadre sur eux (barrettes voisines, embases). */
      var lp = Object.keys(cand).map(function (id) { return G.slots[id]; }).filter(function (b) { return b && !b.arriere && b.y < 20; });
      if (lp.length) {
        var x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
        lp.forEach(function (b) { x0 = Math.min(x0, b.x); z0 = Math.min(z0, b.z); x1 = Math.max(x1, b.x + b.w); z1 = Math.max(z1, b.z + b.h); });
        var pad = 36;
        cad = [{ x: x0 - pad, y: 0, z: z0 - pad, w: x1 - x0 + 2 * pad, d: 40, h: z1 - z0 + 2 * pad }];
      }
    }
    var svg = I.scene(r.items, { t: o.t || 0, fond: fond, avant: r.avant + (rotation ? "" : boutonsFace(o)), titre: o.titre, classe: "at-iso", bornes: cad || [G.boitier], cadrage: cad, repLong: 34 });
    return svg.replace(/<g class="iso-piece ([^"]*)" data-id="([^"]+)"/g, function (m, cls, id) { return '<g class="iso-piece ' + cls + '" data-id="' + id + '" data-slot="' + id + '"'; });
  }

  /* Petite maquette d'une pièce pour le bac et la fiche. */
  var BOITE_TYPE = {};
  disp.slots.forEach(function (s) { s.accepte.forEach(function (t) { if (!BOITE_TYPE[t] && G.slots[s.id] && !isCable(s)) BOITE_TYPE[t] = G.slots[s.id]; }); });
  function icone(p) {
    var b = BOITE_TYPE[p.type], d;
    if (p.type === "entretoises") {
      d = ""; [[0, 0], [40, 0], [0, 40], [40, 40]].forEach(function (q) { d += I.boite({ x: q[0], y: 0, z: q[1], w: 6, d: 10, h: 6 }, { cls: "iso-laiton" }); });
      return I.scene([{ id: p.id, boite: { x: 0, y: 0, z: 0, w: 46, d: 10, h: 46 }, dessin: function () { return d; } }], { reperes: false, marge: 4, classe: "at-ico" });
    }
    if (!b) {
      var cb = { x: 0, y: 0, z: 0, w: 8, d: 14, h: 26 };
      return I.scene([{ id: p.id, boite: cb, dessin: function (bb) { return I.boite(bb, { cls: "iso-connecteur" }) + ID.cable([60, 40, -10], bb); } }], { reperes: false, marge: 6, classe: "at-ico", bornes: [{ x: 0, y: 0, z: -10, w: 60, d: 40, h: 36 }] });
    }
    var o = { x: 0, y: 0, z: 0, w: b.w, d: b.d, h: b.h };
    if (p.type === "carte-mere") { var f = ID.FORMAT[p.format] || ID.FORMAT.mATX; o.w = f.w; o.h = f.h; }
    if (p.type === "alim" && p.o && p.o.fmt === "SFX") { o.w = 100; o.d = 125; o.h = 63.5; }
    return I.scene([{ id: p.id, boite: o, dessin: function (bb) { return ID.dessin(p.type, bb, p); } }], { reperes: false, marge: 4, classe: "at-ico" });
  }

  /* Les éléments SVG restent inchangés visuellement : un rectangle transparent
     agrandit leur zone de contact à 44 px, selon le zoom et la taille de l'écran. */
  function agrandirZones(svg) {
    var m = svg && svg.getScreenCTM();
    if (!m) return;
    var sx = Math.hypot(m.a, m.b), sy = Math.hypot(m.c, m.d);
    if (!sx || !sy) return;
    var vb = svg.viewBox.baseVal;
    Array.prototype.forEach.call(svg.querySelectorAll('.slot-cible[data-slot], .pose[data-slot], [data-bouton]'), function (g) {
      var b;
      try { b = g.getBBox(); } catch (e) { return; }
      if (!b.width || !b.height || b.x + b.width <= vb.x || b.y + b.height <= vb.y || b.x >= vb.x + vb.width || b.y >= vb.y + vb.height) return;
      g.setAttribute('data-zone-originale', [b.x, b.y, b.width, b.height].join(','));
      var w = Math.min(vb.width, Math.max(b.width, 46 / sx)), h = Math.min(vb.height, Math.max(b.height, 46 / sy));
      var x = Math.max(vb.x, Math.min(b.x + (b.width - w) / 2, vb.x + vb.width - w));
      var y = Math.max(vb.y, Math.min(b.y + (b.height - h) / 2, vb.y + vb.height - h));
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('fill', 'transparent'); r.setAttribute('pointer-events', 'all'); r.setAttribute('class', 'zone-tactile');
      /* La zone passe sous le dessin de la pièce : une pièce dessinée par-dessus (barrette voisine) garde la main. */
      g.insertBefore(r, g.firstChild.nextSibling || null);
    });
  }
  function pointSVG(svg, e) {
    var m = svg && svg.getScreenCTM();
    if (!m) return null;
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(m.inverse());
  }
  function dansRectangle(pt, r) {
    return pt.x >= r.x && pt.x <= r.x + r.width && pt.y >= r.y && pt.y <= r.y + r.height;
  }
  /* Quand les zones agrandies se chevauchent, la cible dessinée la plus proche
     du point touché gagne ; cela évite qu'une barrette masque sa voisine. */
  function cibleAuPoint(svg, e, selecteur) {
    var pt = pointSVG(svg, e), meilleur = null, distance = Infinity, aire = Infinity;
    if (!pt) return null;
    /* D'abord la pièce réellement dessinée sous le point (la plus haute), puis la zone agrandie la plus proche. */
    var dessus = document.elementFromPoint(e.clientX, e.clientY);
    if (dessus && dessus.tagName.toLowerCase() === "polygon") {
      var gd = dessus.closest(selecteur);
      if (gd && svg.contains(gd)) return gd;
    }
    Array.prototype.forEach.call(svg.querySelectorAll(selecteur), function (g) {
      var zone = g.querySelector('.zone-tactile'), raw = (g.getAttribute('data-zone-originale') || '').split(',').map(Number);
      if (!zone || raw.length !== 4) return;
      var r = { x: +zone.getAttribute('x'), y: +zone.getAttribute('y'), width: +zone.getAttribute('width'), height: +zone.getAttribute('height') };
      if (!dansRectangle(pt, r)) return;
      var dx = Math.max(raw[0] - pt.x, 0, pt.x - raw[0] - raw[2]);
      var dy = Math.max(raw[1] - pt.y, 0, pt.y - raw[1] - raw[3]);
      var d = dx * dx + dy * dy, a = raw[2] * raw[3];
      if (d < distance || (d === distance && a < aire)) { meilleur = g; distance = d; aire = a; }
    });
    return meilleur;
  }

  var NOM_VUE = { interieur: "Vue de trois quarts avant, panneau latéral retiré", carte: "La carte mère de près", arriere: "Vue de trois quarts arrière : prises et interrupteur" };
  function legendeSlots() {
    var l = steps(), i = cur();
    var etape = !TEST && i < l.length ? l[i].def : null;
    if (!etape) return [];
    return (etape.slots || []).map(slotById).filter(function (s) {
      if (!s || !G.slots[s.id]) return false;
      var arr = !!G.slots[s.id].arriere;
      return (vue === "arriere") === arr && (st.placed[s.id] || dispo(s));
    });
  }
  function renderScene() {
    var cand = {}, l = steps(), i = cur(), etape = !TEST && i < l.length ? l[i].def : null;
    candidatSlots().forEach(function (s) { cand[s.id] = true; });
    var reps = {};
    if (ecart > 0) nomenSlots().forEach(function (s, k) { reps[s.id] = String(k + 1); });
    else legendeSlots().forEach(function (s, k) { reps[s.id] = String(k + 1); });
    scene.innerHTML = sceneSVG({
      placed: st.placed, vue: vue, t: ecart, cand: cand, guide: guideSlots(), reps: reps,
      sel: sel && sel.type === "slot" ? sel.id : null, hl: lettreSel, etape: etape ? etape.slots : null,
      post: st.post ? st.post.code : null, switchOn: st.switchOn, titre: NOM_VUE[vue]
    });
    Array.prototype.forEach.call(tabsVue.children, function (b) {
      var on = b.getAttribute("data-vue") === vue;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.setAttribute("tabindex", on ? "0" : "-1");
    });
    var nomVue = VUES.filter(function (v) { return v[0] === vue; })[0][1];
    cart.textContent = "";
    cart.appendChild(cartouche([["Planche", code + "." + deux(Math.min(i, l.length - 1) + 1)], ["Vue", nomVue], ["Objet", G.nom], [TEST ? "Mode" : "Étape", TEST ? "Test noté" : (i >= l.length ? "Fin" : (i + 1) + " / " + l.length)]]));
    figCap.innerHTML = "";
    figCap.appendChild(el("b", null, "FIG. " + (Math.min(i, l.length - 1) + 1)));
    figCap.appendChild(document.createTextNode(" · " + NOM_VUE[vue] + (etape ? " — " + etape.titre.toLowerCase() + "." : ".")));
    renderLettres();
    agrandirZones(scene.querySelector("svg"));
    bSwitch.textContent = "Interrupteur : " + (st.switchOn ? "I" : "O");
    bSwitch.setAttribute("aria-pressed", st.switchOn ? "true" : "false");
  }

  /* Nomenclature : les pièces posées visibles dans la vue (hors câbles), dans l'ordre des emplacements. */
  function nomenSlots() {
    return disp.slots.filter(function (s) { return st.placed[s.id] && !isCable(s) && G.slots[s.id] && (vue === "arriere") === !!G.slots[s.id].arriere; });
  }
  function renderNomenclature() {
    var liste = nomenSlots();
    if (!liste.length) return;
    var d = el("details", { "class": "mt-nomen-d" });
    if (ecart > 0) d.open = true;
    d.appendChild(el("summary", null, "Nomenclature de la planche (" + liste.length + " pièce" + (liste.length > 1 ? "s" : "") + ")"));
    var t = el("table", { "class": "mt-nomenclature" });
    t.innerHTML = "<thead><tr><th>Rep.</th><th>Désignation</th><th>Emplacement</th></tr></thead>";
    var tb = el("tbody");
    liste.forEach(function (s, k) {
      var tr = el("tr", { "class": lettreSel === s.id ? "is-hl" : "" });
      var td = el("td");
      var b = el("button", { type: "button", "class": "mt-rep", "aria-label": "Repère " + (k + 1) + " : voir la fiche de " + P[st.placed[s.id]].nom }, String(k + 1));
      b.addEventListener("click", function () { sel = { type: "slot", id: s.id }; lettreSel = s.id; renderAll(); secSel.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" }); });
      td.appendChild(b); tr.appendChild(td);
      tr.appendChild(el("td", null, P[st.placed[s.id]].nom));
      tr.appendChild(el("td", null, s.nom));
      tr.addEventListener("mouseenter", function () { var g = scene.querySelector('[data-id="' + s.id + '"]'); if (g) g.classList.add("is-hl"); });
      tr.addEventListener("mouseleave", function () { var g = scene.querySelector('[data-id="' + s.id + '"]'); if (g && lettreSel !== s.id) g.classList.remove("is-hl"); });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    d.appendChild(t);
    fig.appendChild(d);
  }

  /* ---------- Légende de la planche : repères de l'étape, cliquables ---------- */
  function renderLettres() {
    fig.textContent = "";
    var lettres = ecart > 0 ? [] : legendeSlots();
    if (!lettres.length) { renderNomenclature(); return; }
    var ol = el("ol", { "class": "legende", "aria-label": "Repères de la planche" });
    lettres.forEach(function (s, k) {
      var b = el("button", { type: "button", "class": "leg", "aria-pressed": String(lettreSel === s.id) });
      b.appendChild(el("span", { "class": "mt-rep" }, String(k + 1)));
      b.appendChild(document.createTextNode(s.nom + (st.placed[s.id] ? " — " + P[st.placed[s.id]].nom : "")));
      b.addEventListener("click", function () {
        lettreSel = lettreSel === s.id ? null : s.id;
        renderScene();
        var boutons = fig.querySelectorAll(".leg");
        if (boutons[k]) boutons[k].focus();
      });
      var li = el("li"); li.appendChild(b); ol.appendChild(li);
    });
    fig.appendChild(ol);
    renderNomenclature();
  }
  scene.addEventListener("click", function (e) {
    var g = e.target.closest("[data-slot]");
    if (g && !TEST && !(sel && sel.type === "tray")) {
      var sid = g.getAttribute("data-slot"), l = steps(), i = cur();
      if (i < l.length && (l[i].def.slots || []).indexOf(sid) >= 0) lettreSel = sid;
    }
  });

  /* ---------- Bac de pièces ---------- */
  function renderBac() {
    var restantes = R.restantes(sc, st), guide = guideSlots(), glow = {};
    Object.keys(guide).forEach(function (k) { glow[guide[k]] = true; });
    secBac.textContent = "";
    var h = el("h3", { "class": "petites-caps" }, "Le bac · choisis une pièce");
    secBac.appendChild(h);
    var tabs = el("div", { "class": "at-tabs petit", role: "tablist", "aria-label": "Catégories" });
    CATS.forEach(function (c) {
      var n = restantes.filter(function (id) { return P[id].cat === c[0]; }).length;
      var b = el("button", { type: "button", role: "tab", "class": "at-tab", "aria-selected": onglet === c[0] ? "true" : "false", "aria-controls": "at-grille-pieces", tabindex: onglet === c[0] ? "0" : "-1" }, c[1] + " (" + n + ")");
      b.addEventListener("click", function () { onglet = c[0]; renderBac(); secBac.querySelector('[role="tab"][aria-selected="true"]').focus(); });
      tabs.appendChild(b);
    });
    tabs.addEventListener("keydown", function (e) {
      var delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!delta) return;
      e.preventDefault();
      var i = CATS.map(function (c) { return c[0]; }).indexOf(onglet);
      onglet = CATS[(i + delta + CATS.length) % CATS.length][0];
      renderBac();
      secBac.querySelector('[role="tab"][aria-selected="true"]').focus();
    });
    secBac.appendChild(tabs);
    var grid = el("div", { "class": "at-grid", id: "at-grille-pieces", role: "tabpanel", "aria-label": "Pièces de la catégorie sélectionnée" });
    var liste = restantes.filter(function (id) { return P[id].cat === onglet; });
    if (!liste.length) grid.appendChild(el("p", { "class": "muted" }, "Tout est posé dans cette catégorie."));
    liste.forEach(function (id) {
      var p = P[id];
      var b = el("button", { type: "button", "class": "at-piece" + (glow[id] ? " guide" : ""), "data-id": id, "aria-pressed": sel && sel.type === "tray" && sel.id === id ? "true" : "false" });
      b.innerHTML = '<span class="ico">' + icone(p) + '</span><span class="nom"></span><span class="res"></span>';
      b.querySelector(".nom").textContent = p.nom;
      b.querySelector(".res").textContent = p.resume;
      grid.appendChild(b);
    });
    secBac.appendChild(grid);
  }
  secBac.addEventListener("click", function (e) {
    var b = e.target.closest(".at-piece");
    if (!b) return;
    if (justDragged) { justDragged = false; return; }
    var id = b.getAttribute("data-id");
    if (sel && sel.type === "tray" && sel.id === id) { sel = null; msg("Sélection annulée.", "info"); } else selectTray(id);
    renderAll();
    var piece = Array.prototype.find.call(secBac.querySelectorAll(".at-piece"), function (n) { return n.getAttribute("data-id") === id; });
    if (piece) piece.focus();
  });

  function selectTray(id, opts) {
    sel = { type: "tray", id: id };
    var c = R.candidats(sc, st, id);
    if (c.length) {
      var vues = c.map(function (s) { return vueDe(s.vue); });
      if (vues.indexOf(vue) < 0) vue = vues[0];
    }
    if (!(opts && opts.silent)) msg("« " + P[id].nom + " » sélectionné. Touche l'emplacement en surbrillance, ou choisis-le dans la liste.", "info");
  }

  /* ---------- Panneau de sélection ---------- */
  function renderSel() {
    secSel.textContent = "";
    if (!sel) {
      secSel.className = "at-sel vide";
      secSel.appendChild(el("p", { "class": "muted" }, "Touche une pièce du bac, puis l'emplacement où la poser. À la souris, tu peux aussi la glisser sur la scène. Touche une pièce posée pour la retirer."));
      return;
    }
    secSel.className = "at-sel bloc";
    var p = P[sel.type === "tray" ? sel.id : st.placed[sel.id]];
    var top = el("div", { "class": "at-sel-top" });
    top.innerHTML = '<span class="ico">' + icone(p) + '</span><div><h2></h2><p class="muted"></p></div>';
    top.querySelector("h2").textContent = p.nom;
    top.querySelector("p").textContent = sel.type === "tray" ? "Dans le bac" : "Posée : " + slotById(sel.id).nom;
    secSel.appendChild(top);
    if (p.specs && p.specs.length) {
      var dl = el("dl", { "class": "at-specs" });
      p.specs.forEach(function (s) { dl.appendChild(el("dt", null, s[0])); dl.appendChild(el("dd", null, s[1])); });
      secSel.appendChild(dl);
    }
    if (sel.type === "tray") {
      var c = R.candidats(sc, st, sel.id);
      secSel.appendChild(el("p", { "class": "at-label" }, "Poser sur :"));
      var l = el("div", { "class": "at-cibles" });
      if (!c.length) l.appendChild(el("p", { "class": "muted" }, "Plus d'emplacement libre pour ce type de pièce."));
      c.forEach(function (s) {
        var b = el("button", { type: "button", "class": "btn ghost", "data-cible": s.id }, s.nom);
        b.addEventListener("click", function () { tryPlace(sel.id, s.id); });
        l.appendChild(b);
      });
      secSel.appendChild(l);
      var x = el("button", { type: "button", "class": "btn ghost" }, "Annuler la sélection");
      x.addEventListener("click", function () { sel = null; renderAll(); });
      secSel.appendChild(x);
    } else {
      var rm = el("button", { type: "button", "class": "btn" }, "Retirer cette pièce");
      rm.addEventListener("click", function () { retirer(sel.id); });
      secSel.appendChild(rm);
      var x2 = el("button", { type: "button", "class": "btn ghost" }, "Fermer");
      x2.addEventListener("click", function () { sel = null; renderAll(); });
      secSel.appendChild(x2);
    }
  }

  /* ---------- Étapes ---------- */
  function encadre(cls, etiq, txt) {
    var d = el("div", { "class": "mt-encadre " + cls });
    d.appendChild(el("p", { "class": "mt-etiq" }, etiq));
    d.appendChild(el("p", null, txt));
    return d;
  }
  function renderEtape() {
    if (TEST) { renderTest(); return; }
    var l = steps(), i = cur();
    secEtape.textContent = "";
    var done = l.filter(function (x) { return x.fait; }).length;
    drawProgress(done, l.length);
    habillerEtape(l, i);
    if (i >= l.length) {
      margeIndices.textContent = "";
      secEtape.appendChild(el("p", { "class": "mt-surtitre" }, code + " · Terminé"));
      secEtape.appendChild(el("h2", null, "Fin de la procédure"));
      secEtape.appendChild(el("p", null, "Toutes les étapes sont faites. Tu peux modifier le montage pour voir ce qui change au démarrage, éclater la maquette pour la relire, ou recommencer."));
      return;
    }
    var e = l[i].def, n = st.indices[e.id] || 0;
    secEtape.appendChild(el("p", { "class": "mt-surtitre" }, "Étape " + deux(i + 1) + " / " + deux(l.length)));
    secEtape.appendChild(el("h2", null, e.titre));
    secEtape.appendChild(el("p", { "class": "texte" }, e.texte));
    margeIndices.textContent = "";
    for (var k = 0; k < Math.min(n, e.indices.length); k++) margeIndices.appendChild(encadre("remarque", "Indice " + (k + 1), e.indices[k]));
    if (n > e.indices.length) margeIndices.appendChild(encadre("remarque", "Solution", "Les pièces et les emplacements de l'étape sont surlignés en vert."));
    var row = el("div", { "class": "at-etape-actions" });
    var bi = el("button", { type: "button", "class": "btn ghost" }, n >= e.indices.length + 1 ? "Indice (tout est montré)" : "Indice");
    bi.addEventListener("click", indice);
    var bm = el("button", { type: "button", "class": "btn ghost" }, "Montre-moi");
    bm.addEventListener("click", montre);
    row.appendChild(bi); row.appendChild(bm);
    if (vueDe(e.vue) !== vue) {
      var cible = vueDe(e.vue);
      var bv = el("button", { type: "button", "class": "btn ghost" }, "Aller à la vue « " + VUES.filter(function (v) { return v[0] === cible; })[0][1] + " »");
      bv.addEventListener("click", function () { setVue(cible); renderEtape(); });
      row.appendChild(bv);
    }
    secEtape.appendChild(row);
    var d = el("details", { "class": "correction plus-loin" });
    d.appendChild(el("summary", null, "Pourquoi cette étape ?"));
    d.appendChild(el("p", null, e.pourquoi));
    secEtape.appendChild(d);
  }

  function habillerEtape(l, i) {
    if (dernierEtape !== i) lettreSel = null;
    dernierEtape = i;
  }

  function renderTest() {
    secEtape.textContent = "";
    secListe.hidden = true;
    head.querySelector(".at-progress").textContent = "";
    secEtape.appendChild(el("p", { "class": "mt-surtitre" }, code + " · Test noté"));
    secEtape.appendChild(el("h2", null, "Monte le PC du cahier des charges"));
    secEtape.appendChild(el("p", { "class": "texte" }, "Pas d'indices, pas d'ordre imposé, pas d'alerte : les erreurs se voient au démarrage. Allume le PC autant de fois que nécessaire, puis termine le test."));
    var ul = el("ul", { "class": "at-bareme" });
    ["Démarrage : 40 points (10 de moins par démarrage raté)", "Cahier des charges : 50 points, répartis sur les critères", "Gestes : 10 points (2 de moins par pose refusée)"].forEach(function (t) { ul.appendChild(el("li", null, t)); });
    secEtape.appendChild(ul);
    secEtape.appendChild(el("p", { "class": "muted at-compteurs" }, "Démarrages ratés : " + st.echecs.length + " · Poses refusées : " + st.erreurs));
  }

  function renderListe() {
    if (TEST) return;
    var l = steps(), i = cur();
    secListe.textContent = "";
    secListe.appendChild(el("h3", null, "Déroulé de la procédure"));
    var ol = el("ol", { "class": "mt-proc at-etapes" });
    l.forEach(function (x, k) {
      var li = el("li", { "class": x.fait ? "fait" : (k === i ? "courant" : "") });
      li.appendChild(el("span", { "class": "lbl" }, x.def.titre));
      li.appendChild(el("span", { "class": "sr-only" }, x.fait ? " (faite)" : (k === i ? " (en cours)" : " (à venir)")));
      ol.appendChild(li);
    });
    secListe.appendChild(ol);
  }

  function drawProgress(done, total) {
    var node = head.querySelector(".at-progress");
    node.textContent = "";
    var pct = Math.round(done / total * 100);
    node.appendChild(el("span", null, done + " / " + total + " étapes (" + pct + " %)"));
    var track = el("div", { "class": "track", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct) });
    var fill = el("div", { "class": "fill" });
    fill.style.width = pct + "%";
    track.appendChild(fill);
    node.appendChild(track);
  }

  function indice() {
    if (TEST || fini) return;
    var i = cur(); if (i >= sc.etapes.length) return;
    var e = sc.etapes[i], n = (st.indices[e.id] || 0);
    if (n <= e.indices.length) st.indices[e.id] = n + 1;
    save(); renderAll();
    msg(n < e.indices.length ? "Indice : " + e.indices[n] : "Les pièces et les emplacements de l'étape sont surlignés.", "info");
  }
  function montre() {
    if (TEST || fini) return;
    var i = cur(); if (i >= sc.etapes.length) return;
    var e = sc.etapes[i], noms = [];
    (e.retire || []).forEach(function (r) { if (st.placed[r[0]] === r[1]) R.retirerTout(sc, st, r[0]); });
    (e.solution || []).forEach(function (pr) {
      if (st.placed[pr[0]]) return;
      var r = R.place(sc, st, pr[1], pr[0]);
      if (r.ok) { hist.push({ op: "place", slot: pr[0], item: pr[1] }); noms.push(P[pr[1]].nom); }
    });
    if (e.fn === "interrupteur" && !st.switchOn) { st.switchOn = true; hist.push({ op: "switch", val: false }); }
    st.aides++;
    sel = null; changed();
    if (e.fn === "post-ok") { allumer(); return; }
    msg("Je l'ai fait pour toi : " + (noms.length ? noms.join(", ") : "l'interrupteur sur I") + ". Lis « Pourquoi cette étape ? » puis passe à la suivante.", "ok");
    renderAll();
  }

  /* ---------- Actions de pose ---------- */
  function changed() {
    st.post = null;
    secPost.hidden = true;
    if (postTimer) { clearTimeout(postTimer); postTimer = null; }
    bPower.disabled = false;
    save();
  }
  function tryPlace(itemId, slotId) {
    if (fini) return;
    var avant = cur();
    var r = R.place(sc, st, itemId, slotId);
    var p = P[itemId];
    if (!r.ok) {
      msg(r.msg, r.danger ? "danger" : "bloque");
      save(); renderAll(); shake();
      return;
    }
    hist.push({ op: "place", slot: slotId, item: itemId });
    sel = null;
    changed();
    var apres = cur(), txt;
    if (TEST) { msg("« " + p.nom + " » posé.", "ok"); renderAll(); return; }
    if (r.niveau === "attention" && r.msg) txt = "Posé, mais attention : " + r.msg;
    else txt = "« " + p.nom + " » posé. " + (p.pose || "");
    if (apres > avant && apres < sc.etapes.length) txt += " Étape terminée ✓. Suite : " + sc.etapes[apres].titre + ".";
    else if (apres >= sc.etapes.length) txt += " Toutes les étapes sont faites.";
    msg(txt, r.niveau === "attention" && r.msg ? "attention" : "ok");
    renderAll();
  }
  function retirer(slotId) {
    if (fini) return;
    var it = st.placed[slotId];
    var r = R.remove(sc, st, slotId);
    if (!r.ok) { msg(r.msg, "bloque"); renderAll(); return; }
    hist.push({ op: "remove", slot: slotId, item: it });
    sel = null; changed();
    msg("« " + P[it].nom + " » retiré : il est de nouveau dans le bac.", "info");
    renderAll();
  }
  function annuler() {
    if (fini) return;
    var h = hist.pop();
    if (!h) { msg("Rien à annuler.", "info"); return; }
    if (h.op === "place") delete st.placed[h.slot];
    else if (h.op === "remove") st.placed[h.slot] = h.item;
    else if (h.op === "switch") st.switchOn = h.val;
    sel = null; changed();
    msg("Dernière action annulée.", "info");
    renderAll();
  }
  function basculer() {
    if (fini) return;
    hist.push({ op: "switch", val: st.switchOn });
    st.switchOn = !st.switchOn;
    changed();
    msg("Interrupteur de l'alimentation sur " + (st.switchOn ? "I (marche)." : "O (arrêt)."), "info");
    renderAll();
  }
  function recommencer() {
    if (bReset.getAttribute("data-confirm") !== "1") {
      bReset.setAttribute("data-confirm", "1"); bReset.textContent = "Confirmer ?";
      confirmTimer = setTimeout(function () { bReset.removeAttribute("data-confirm"); bReset.textContent = "Recommencer"; }, 3500);
      return;
    }
    clearTimeout(confirmTimer);
    bReset.removeAttribute("data-confirm"); bReset.textContent = "Recommencer";
    st = R.nouvelEtat(sc, TEST ? "test" : "apprentissage"); st.indices = {}; st.aides = 0; hist = []; sel = null; vue = "interieur";
    store.del(KEY); secPost.hidden = true;
    msg("Montage remis à zéro. Les pièces sont toutes dans le bac.", "info");
    renderAll();
  }
  function shake() {
    if (reduced) return;
    scene.classList.remove("shake"); void scene.offsetWidth; scene.classList.add("shake");
  }

  /* ---------- Clic sur la scène ---------- */
  scene.addEventListener("click", function (e) {
    var bt = e.target.closest("[data-bouton]");
    if (bt) {
      if (bt.getAttribute("data-bouton") === "power") allumer(); else basculer();
      return;
    }
    var g = e.target.closest("[data-slot]");
    if (!g) return;
    var svg = g.ownerSVGElement;
    if (sel && sel.type === "tray") g = cibleAuPoint(svg, e, ".slot-cible") || g;
    else if (g.classList.contains("pose")) g = cibleAuPoint(svg, e, ".pose[data-slot]") || g;
    var id = g.getAttribute("data-slot");
    if (sel && sel.type === "tray" && R.candidats(sc, st, sel.id).some(function (s) { return s.id === id; })) { tryPlace(sel.id, id); return; }
    if (st.placed[id]) {
      sel = { type: "slot", id: id };
      msg("« " + P[st.placed[id]].nom + " » : tu peux la retirer avec le bouton du panneau.", "info");
      renderAll();
    }
  });

  /* ---------- Glisser-déposer (souris et stylet) ---------- */
  secBac.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".at-piece");
    if (!b || e.pointerType === "touch" || e.button !== 0) return;
    var id = b.getAttribute("data-id"), sx = e.clientX, sy = e.clientY, ghost = null, drag = false;
    function move(ev) {
      if (!drag && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
        drag = true;
        selectTray(id, { silent: true });
        renderScene(); renderSel();
        ghost = el("div", { "class": "at-ghost", "aria-hidden": "true" });
        ghost.innerHTML = icone(P[id]);
        document.body.appendChild(ghost);
        document.body.classList.add("at-dragging");
      }
      if (drag) { ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px"; }
    }
    function fin(ev) {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", fin);
      document.removeEventListener("pointercancel", fin);
      if (!drag) return;
      if (ghost) ghost.remove();
      document.body.classList.remove("at-dragging");
      justDragged = true; setTimeout(function () { justDragged = false; }, 60);
      var t = ev.type === "pointerup" ? document.elementFromPoint(ev.clientX, ev.clientY) : null;
      var g = t && t.closest && t.closest("[data-slot]");
      var svg = t && t.closest && t.closest("svg");
      var cible = svg && cibleAuPoint(svg, ev, ".slot-cible");
      if (cible) tryPlace(id, cible.getAttribute("data-slot"));
      else if (g && scene.contains(g)) tryPlace(id, g.getAttribute("data-slot"));
      else { msg("Pièce relâchée hors d'un emplacement. Elle reste sélectionnée.", "info"); renderAll(); }
    }
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", fin);
    document.addEventListener("pointercancel", fin);
  });

  /* ---------- Démarrage simulé ---------- */
  function allumer() {
    if (fini) return;
    var res = R.simulerPOST(sc, st);
    st.post = res;
    if (TEST && res.code !== "ok") { st.echecs.push({ theme: res.theme || null, titre: res.titre }); save(); }
    if (postTimer) clearTimeout(postTimer);
    bPower.disabled = true;
    secPost.hidden = false;
    secPost.textContent = "";
    secPost.appendChild(el("h2", null, "Démarrage du PC"));
    var ecran = el("div", { "class": "at-ecran", role: "log", "aria-label": "Journal du démarrage" });
    secPost.appendChild(ecran);
    var rest = el("div", { "class": "at-post-res" });
    secPost.appendChild(rest);
    renderScene();
    var i = 0, ETAT = { ok: "[  OK  ]", ko: "[ ERREUR ]", avert: "[ AVERT ]", non: "[  --  ]" };
    function suite() {
      if (i < res.etapes.length) {
        var x = res.etapes[i++];
        var ln = el("div", { "class": "ligne " + x.etat });
        ln.appendChild(el("span", { "class": "etat" }, ETAT[x.etat]));
        ln.appendChild(el("span", null, " " + x.nom + (x.etat === "non" ? " — non testé" : "")));
        ecran.appendChild(ln);
        postTimer = setTimeout(suite, reduced ? 0 : 330);
        return;
      }
      resultatPost(res, ecran, rest);
      bPower.disabled = false;
      renderAll();
    }
    secPost.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
    msg("Démarrage en cours…", "info");
    if (TEST) {
      /* Test : pas de journal détaillé, seulement ce qu'on observerait devant la machine. */
      ecran.appendChild(el("div", { "class": "ligne" }, "Mise sous tension…"));
      postTimer = setTimeout(function () { resultatPost(res, ecran, rest); bPower.disabled = false; renderAll(); }, reduced ? 0 : 700);
      return;
    }
    suite();
  }

  function resultatPost(res, ecran, rest) {
    var bon = res.code === "ok";
    if (bon && res.uefi) {
      var u = el("div", { "class": "uefi" });
      u.appendChild(el("p", { "class": "t" }, "UEFI — configuration détectée"));
      res.uefi.forEach(function (r) { u.appendChild(el("p", null, r[0] + " : " + r[1])); });
      ecran.appendChild(u);
    }
    if (TEST && !bon) ecran.appendChild(el("div", { "class": "ligne ko" }, res.ecran));
    rest.appendChild(el("h3", { "class": "at-verdict " + (bon ? "bon" : (res.code === "avert" ? "att" : "faux")) }, TEST && !bon ? "Le démarrage n'est pas correct" : res.titre));
    var dl = el("dl", { "class": "at-sympt" });
    [["Ventilateurs", res.ventilos], ["Écran", res.ecran], ["LED", res.leds]].concat(res.bips ? [["Bips", res.bips]] : []).forEach(function (r) {
      dl.appendChild(el("dt", null, r[0])); dl.appendChild(el("dd", null, r[1]));
    });
    rest.appendChild(dl);
    if (!TEST && (res.explication.length || (res.correction && res.correction.length))) {
      var d = el("details", { "class": "correction" });
      d.appendChild(el("summary", null, bon ? "Voir l'explication" : "Voir l'explication et la correction"));
      res.explication.forEach(function (t) { d.appendChild(el("p", null, t)); });
      if (res.correction && res.correction.length) {
        d.appendChild(el("p", { "class": "at-label" }, "Pour corriger :"));
        var ul = el("ul");
        res.correction.forEach(function (t) { ul.appendChild(el("li", null, t)); });
        d.appendChild(ul);
      }
      rest.appendChild(d);
    }
    if (!TEST && res.remarques && res.remarques.length) {
      rest.appendChild(el("p", { "class": "at-label" }, "Remarques"));
      var ur = el("ul");
      res.remarques.forEach(function (t) { ur.appendChild(el("li", null, t)); });
      rest.appendChild(ur);
    }
    var m = bon ? "Démarrage réussi." : res.titre + ". Ouvre l'explication, corrige puis rallume.";
    var niv = bon ? "ok" : "bloque";
    if (TEST) {
      m = bon ? "Le PC démarre. Vérifie chaque ligne du cahier des charges, puis termine le test." : "Le démarrage a échoué : observe les symptômes, diagnostique, corrige puis rallume.";
      niv = bon ? "ok" : "bloque";
    } else if (bon) {
      var b = R.bilan(sc, st);
      rest.appendChild(el("p", { "class": "at-label" }, "Bilan par rapport au cahier des charges"));
      var ulb = el("ul", { "class": "at-bilan" });
      b.items.forEach(function (x) {
        var li = el("li", { "class": x.ok ? "ok" : "ko" });
        li.appendChild(el("span", { "aria-hidden": "true" }, x.ok ? "✓ " : "✗ "));
        li.appendChild(document.createTextNode(x.label + " — " + x.detail));
        ulb.appendChild(li);
      });
      rest.appendChild(ulb);
      if (b.tout) {
        store.set("done." + sc.unite, "1");
        rest.appendChild(el("p", { "class": "at-reussi" }, "Scénario réussi : le PC démarre et le cahier des charges est respecté."));
        m = "Scénario réussi ✓ Le PC démarre et le cahier des charges est respecté.";
      } else {
        rest.appendChild(el("p", { "class": "muted" }, "Le PC démarre, mais le cahier des charges n'est pas entièrement respecté : modifie le montage et rallume."));
        m = "Le PC démarre, mais le cahier des charges n'est pas entièrement respecté (voir le bilan).";
        niv = "attention";
      }
    }
    msg(m, niv);
    var act = el("div", { "class": "at-etape-actions" });
    var cl = el("button", { type: "button", "class": "btn ghost" }, "Fermer");
    cl.addEventListener("click", function () { secPost.hidden = true; });
    act.appendChild(cl);
    rest.appendChild(act);
  }

  /* ---------- Rendu global ---------- */
  function renderAll() {
    renderEtape(); renderScene(); renderBac(); renderSel(); renderListe();
    bUndo.disabled = !hist.length;
  }

  bUndo.addEventListener("click", annuler);
  bHint.addEventListener("click", indice);
  bSwitch.addEventListener("click", basculer);
  bPower.addEventListener("click", allumer);
  bReset.addEventListener("click", recommencer);
  tabsVue.addEventListener("keydown", function (e) {
    var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!k) return;
    e.preventDefault();
    var i = VUES.map(function (v) { return v[0]; }).indexOf(vue);
    setVue(VUES[(i + k + VUES.length) % VUES.length][0]);
    tabsVue.children[(i + k + VUES.length) % VUES.length].focus();
  });

  /* ---------- Fin du test : note et rapport ---------- */
  function terminer() {
    if (fini) return;
    if (bFin.getAttribute("data-confirm") !== "1") {
      bFin.setAttribute("data-confirm", "1"); bFin.textContent = "Confirmer : terminer ?";
      finTimer = setTimeout(function () { bFin.removeAttribute("data-confirm"); bFin.textContent = "Terminer le test"; }, 3500);
      return;
    }
    clearTimeout(finTimer);
    var post = R.simulerPOST(sc, st), n = R.noter(sc, st, post);
    var seuil = A.evaluation.seuil || 75;
    var rec = {
      id: sc.id, titre: sc.titre, total: n.total, demarrage: n.demarrage, cahier: n.cahier, gestes: n.gestes, seuil: seuil,
      post: { code: post.code, titre: post.titre, explication: post.explication, correction: post.correction },
      items: n.bilan.items.map(function (x) { return { label: x.label, ok: x.ok, detail: x.detail }; }),
      revoir: R.pointsARevoir(sc, st, post, n.bilan), echecs: st.echecs.length, erreurs: st.erreurs
    };
    fini = true;
    if (postTimer) clearTimeout(postTimer);
    store.del(KEY);
    if (ctx.eval) {
      var ev = evalLire() || { i: 0, res: [], demarre: true };
      ev.res[ctx.eval.i] = rec; ev.i = Math.max(ev.i, ctx.eval.i + 1);
      evalEcrire(ev);
    } else {
      var best = parseInt(store.get("score." + sc.id), 10);
      if (isNaN(best) || n.total > best) store.set("score." + sc.id, String(n.total));
      if (n.total >= seuil) store.set("done." + sc.unite, "1");
    }
    [layout, actions, msgBox, secPost, brief].forEach(function (x) { x.hidden = true; });
    var rapport = el("section", { "class": "at-rapport", "aria-label": "Rapport du test" });
    rapport.appendChild(rapportScenario(rec));
    var act = el("div", { "class": "at-etape-actions" });
    if (ctx.eval) {
      var suivant = el("button", { type: "button", "class": "btn" }, ctx.eval.i + 1 < ctx.eval.n ? "Scénario suivant →" : "Voir le rapport final");
      suivant.addEventListener("click", function () { lancerEval(); });
      act.appendChild(suivant);
    } else {
      var again = el("button", { type: "button", "class": "btn" }, "Refaire le test");
      again.addEventListener("click", function () { demarrer(scId, ctx); });
      act.appendChild(again);
      act.appendChild(el("a", { "class": "btn ghost", href: "montage.html?s=" + sc.id }, "Mode apprentissage"));
      act.appendChild(el("a", { "class": "btn ghost", href: "index.html" }, "Retour à l'atelier"));
    }
    rapport.appendChild(act);
    head.after(rapport);
    rapport.setAttribute("tabindex", "-1");
    rapport.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  bFin.addEventListener("click", terminer);

  function redimensionnerScene() {
    if (!scene.isConnected) { window.removeEventListener("resize", redimensionnerScene); return; }
    renderScene();
  }
  window.addEventListener("resize", redimensionnerScene);
  load();
  msg(TEST ? "Test noté : lis le cahier des charges, monte le PC sans aide, allume-le pour vérifier, puis termine le test." : "Bienvenue ! Lis le cahier des charges, puis suis les étapes : touche une pièce du bac, puis son emplacement.", "info");
  renderAll();
  }   /* fin de demarrer */

  /* ---------- Rapport d'un scénario noté ---------- */
  function rapportScenario(rec) {
    var box = el("div", { "class": "at-rap" });
    var ok = rec.total >= rec.seuil;
    box.appendChild(el("p", { "class": "mt-surtitre" }, "Rapport · " + rec.titre));
    var top = el("div", { "class": "at-score" });
    top.appendChild(el("span", { "class": "n" }, String(rec.total)));
    top.appendChild(el("span", { "class": "sur" }, "/ 100"));
    top.appendChild(el("span", { "class": "verdict " + (ok ? "bon" : "faux") }, ok ? "Réussi" : "À retravailler (seuil : " + rec.seuil + ")"));
    box.appendChild(top);
    var dl = el("dl", { "class": "at-sympt" });
    [["Démarrage", rec.demarrage + " / 40" + (rec.echecs ? " (" + rec.echecs + " démarrage(s) raté(s))" : "")], ["Cahier des charges", rec.cahier + " / 50"], ["Gestes", rec.gestes + " / 10" + (rec.erreurs ? " (" + rec.erreurs + " pose(s) refusée(s))" : "")]].forEach(function (r) {
      dl.appendChild(el("dt", null, r[0])); dl.appendChild(el("dd", null, r[1]));
    });
    box.appendChild(dl);
    box.appendChild(el("h3", null, "Cahier des charges"));
    var ul = el("ul", { "class": "at-bilan" });
    rec.items.forEach(function (x) {
      var li = el("li", { "class": x.ok ? "ok" : "ko" });
      li.appendChild(el("span", { "aria-hidden": "true" }, x.ok ? "✓ " : "✗ "));
      li.appendChild(document.createTextNode(x.label + " — " + x.detail));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    box.appendChild(el("h3", null, "Démarrage du PC dans son état final"));
    box.appendChild(el("p", { "class": "at-verdict " + (rec.post.code === "ok" ? "bon" : (rec.post.code === "avert" ? "att" : "faux")) }, rec.post.titre));
    if (rec.post.code !== "ok" && (rec.post.explication.length || (rec.post.correction || []).length)) {
      var d = el("details", { "class": "correction" });
      d.appendChild(el("summary", null, "Voir l'explication et la correction"));
      rec.post.explication.forEach(function (t) { d.appendChild(el("p", null, t)); });
      if ((rec.post.correction || []).length) {
        d.appendChild(el("p", { "class": "at-label" }, "Pour corriger :"));
        var uc = el("ul");
        rec.post.correction.forEach(function (t) { uc.appendChild(el("li", null, t)); });
        d.appendChild(uc);
      }
      box.appendChild(d);
    }
    box.appendChild(blocRevoir(rec.revoir, null));
    return box;
  }

  /* Points à revoir : un conseil et un lien par thème. */
  function blocRevoir(liste, prefixes) {
    var box = el("div", { "class": "at-revoir" });
    box.appendChild(el("h3", null, "Points à revoir"));
    if (!liste.length) { box.appendChild(el("p", null, "Rien à signaler : tous les critères sont atteints et aucune pose n'a été refusée.")); return box; }
    liste.forEach(function (x) {
      var th = A.revoir[x.theme] || A.revoir.choix;
      var c = el("div", { "class": "at-revoir-item" });
      c.appendChild(el("h4", null, th.titre));
      var ul = el("ul");
      x.raisons.forEach(function (r) { ul.appendChild(el("li", null, r)); });
      c.appendChild(ul);
      c.appendChild(el("p", null, th.conseil));
      var p = el("p", { "class": "at-lien" });
      p.appendChild(el("a", { href: th.lien }, th.libelle));
      p.appendChild(document.createTextNode(" · "));
      var m = th.module || A.moduleRevoir.general;
      p.appendChild(el("a", { href: m.href }, m.libelle));
      c.appendChild(p);
      box.appendChild(c);
    });
    return box;
  }

  /* ---------- Évaluation finale ---------- */
  var EV_KEY = "atelier.eval";
  function evalLire() {
    try { var o = JSON.parse(store.get(EV_KEY) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; }
  }
  function evalEcrire(ev) { store.set(EV_KEY, JSON.stringify(ev)); }
  function evalEffacer() {
    store.del(EV_KEY);
    A.evaluation.scenarios.forEach(function (id) { store.del("atelier." + id + ".eval"); });
  }
  function entete(titre, kicker) {
    host.textContent = "";
    var h = el("header", { "class": "at-head" });
    h.appendChild(el("p", { "class": "mt-surtitre" }, kicker));
    h.appendChild(el("h1", null, titre));
    host.appendChild(h);
    window.scrollTo(0, 0);
    return h;
  }
  function lancerEval() {
    var ev = evalLire(), n = A.evaluation.scenarios.length;
    if (!ev || !ev.demarre) { introEval(); return; }
    if (ev.i >= n) { rapportFinal(ev); return; }
    demarrer(A.evaluation.scenarios[ev.i], { mode: "test", cle: "eval", eval: { i: ev.i, n: n } });
  }
  function introEval() {
    var E = A.evaluation;
    entete(E.titre, "Atelier hardware · Évaluation");
    var b = el("div", { "class": "prose" });
    b.appendChild(el("p", { "class": "lead" }, "Quatre montages enchaînés, sans aide et notés. À la fin : un rapport avec ce qu'il faut revoir, et où le réviser."));
    var ol = el("ol");
    E.scenarios.forEach(function (id) {
      var sc = A.scenarios[id];
      ol.appendChild(el("li", null, sc.titre + " — " + sc.niveau + ", " + sc.duree + " en apprentissage"));
    });
    b.appendChild(ol);
    var c = el("div", { "class": "callout retenir" });
    c.appendChild(el("p", null, "Chaque scénario est noté sur 100 : démarrage 40, cahier des charges 50, gestes 10. Il n'y a pas d'indices, pas d'ordre imposé et aucune alerte. Seuil de réussite : " + E.seuil + " de moyenne. Ta progression est enregistrée dans ce navigateur : tu peux fermer la page et reprendre."));
    b.appendChild(c);
    var c2 = el("div", { "class": "callout astuce" });
    c2.appendChild(el("p", null, "Conseil : fais d'abord les scénarios en mode apprentissage (page de l'atelier). Les mêmes montages sont ici sans filet."));
    b.appendChild(c2);
    var act = el("div", { "class": "at-etape-actions" });
    var go = el("button", { type: "button", "class": "btn" }, "Commencer");
    go.addEventListener("click", function () { evalEffacer(); evalEcrire({ i: 0, res: [], demarre: true }); lancerEval(); });
    act.appendChild(go);
    act.appendChild(el("a", { "class": "btn ghost", href: "index.html" }, "Retour à l'atelier"));
    b.appendChild(act);
    host.appendChild(b);
  }
  function rapportFinal(ev) {
    var E = A.evaluation, n = E.scenarios.length;
    var rec = ev.res.filter(Boolean);
    var moy = Math.round(rec.reduce(function (a, r) { return a + r.total; }, 0) / (rec.length || 1));
    var ok = moy >= E.seuil;
    var best = parseInt(store.get("score." + E.id), 10);
    if (isNaN(best) || moy > best) store.set("score." + E.id, String(moy));
    if (ok) store.set("done." + E.unite, "1");
    entete("Rapport de l'évaluation finale", "Atelier hardware · Évaluation");
    var box = el("div", { "class": "at-rap bilan" });
    box.appendChild(el("p", { "class": "mt-surtitre" }, "Bilan"));
    var top = el("div", { "class": "at-score" });
    top.appendChild(el("span", { "class": "n" }, String(moy)));
    top.appendChild(el("span", { "class": "sur" }, "/ 100 de moyenne"));
    top.appendChild(el("span", { "class": "verdict " + (ok ? "bon" : "faux") }, ok ? "Réussi" : "À retravailler (seuil : " + E.seuil + ")"));
    box.appendChild(top);
    var table = el("table", { "class": "at-table" });
    table.innerHTML = "<thead><tr><th>Scénario</th><th>Note</th><th>Démarrage</th><th>Cahier</th><th>Gestes</th></tr></thead>";
    var tb = el("tbody");
    rec.forEach(function (r) {
      var tr = el("tr");
      [r.titre, r.total + " / 100", r.demarrage + " / 40", r.cahier + " / 50", r.gestes + " / 10"].forEach(function (t) { tr.appendChild(el("td", null, t)); });
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    box.appendChild(table);
    /* Points à revoir fusionnés par thème, avec le scénario d'origine. */
    var par = {}, ordre = [];
    rec.forEach(function (r) {
      r.revoir.forEach(function (x) {
        if (!par[x.theme]) { par[x.theme] = []; ordre.push(x.theme); }
        x.raisons.forEach(function (t) { par[x.theme].push(r.titre + " : " + t); });
      });
    });
    box.appendChild(blocRevoir(ordre.map(function (t) { return { theme: t, raisons: par[t] }; }), null));
    var det = el("details", { "class": "correction" });
    det.appendChild(el("summary", null, "Détail de chaque scénario"));
    rec.forEach(function (r) { det.appendChild(rapportScenario(r)); });
    box.appendChild(det);
    var act = el("div", { "class": "at-etape-actions" });
    var again = el("button", { type: "button", "class": "btn" }, "Recommencer l'évaluation");
    again.addEventListener("click", function () { evalEffacer(); evalEcrire({ i: 0, res: [], demarre: true }); lancerEval(); });
    act.appendChild(again);
    var bImp = el("button", { type: "button", "class": "btn ghost" }, "Imprimer le bilan");
    bImp.addEventListener("click", function () { window.print(); });
    act.appendChild(bImp);
    act.appendChild(el("a", { "class": "btn ghost", href: "index.html" }, "Retour à l'atelier"));
    box.appendChild(act);
    host.appendChild(box);
  }

  if (EVAL) lancerEval();
  else demarrer(params.get("s") || host.getAttribute("data-scenario") || "bureautique-intel", { mode: params.get("m") === "test" ? "test" : "apprentissage" });
})();
