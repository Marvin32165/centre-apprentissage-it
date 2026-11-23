/* Atelier hardware — interface : scène, bac de pièces, étapes guidées, démarrage simulé. */
(function () {
  "use strict";
  var A = window.IT_ATELIER, R = window.IT_ATELIER_RULES, Art = window.IT_ATELIER_ART;
  var host = document.getElementById("atelier");
  if (!host || !A || !R || !Art) return;

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
  var vue = "cote";
  var onglet = "composant";
  var msgTxt = "", msgNiv = "info";
  var postTimer = null, confirmTimer = null, finTimer = null, justDragged = false, fini = false;

  var VUES = [["cote", "Côté"], ["zoom", "Zoom carte"], ["face", "Face"], ["arriere", "Arrière"]];
  var CATS = [["composant", "Composants"], ["accessoire", "Accessoires"], ["cable", "Câbles"]];
  var ARR_FIL = { "mains": [20, 604], "mon-board": [6, 80], "mon-gpu": [6, 240] };

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

  /* ---------- Squelette ---------- */
  host.textContent = "";
  host.insertAdjacentHTML("afterbegin", Art.DEFS);

  var head = el("header", { "class": "at-head" });
  var num = /-s(\d+)$/.exec(sc.unite || "");
  head.innerHTML = '<p class="kicker"></p><h1></h1><div class="at-badges"></div><div class="progress at-progress" aria-live="polite"></div><p class="at-modes"></p>';
  head.querySelector(".kicker").textContent = "Atelier hardware" + (ctx.eval ? " · Évaluation finale, scénario " + (ctx.eval.i + 1) + " / " + ctx.eval.n : (num ? " · Scénario " + num[1] : ""));
  head.querySelector("h1").textContent = sc.titre;
  var badges = head.querySelector(".at-badges");
  [[TEST ? "Test noté" : "Apprentissage", "mode"], [sc.niveau, ""], [sc.duree, ""]].forEach(function (b) { badges.appendChild(el("span", { "class": "badge" + (b[1] ? " mode" : "") }, b[0])); });
  if (!ctx.eval) {
    var lm = el("a", { href: "montage.html?s=" + sc.id + (TEST ? "" : "&m=test") }, TEST ? "Passer en mode apprentissage (guidé)" : "Passer en mode test (sans aide, noté)");
    head.querySelector(".at-modes").appendChild(lm);
  }
  host.appendChild(head);

  var brief = el("details", { "class": "bloc at-brief", open: "" });
  brief.innerHTML = '<summary>Cahier des charges</summary><p class="at-client"></p><ul class="at-besoins"></ul><p class="at-materiel"></p>' +
    '<aside class="callout source"><p>Les pièces sont des modèles génériques : leurs caractéristiques sont réalistes mais simplifiées. Référence pour les fiches de processeurs : Intel ARK (ark.intel.com) et AMD ; normes mémoire : JEDEC (DDR4, DDR5) ; exigences de Windows 11 : Microsoft Learn. Théorie : <a href="../stage/j9.html">jour 9 de la prépa</a> (matériel et PC).</p></aside>';
  brief.querySelector(".at-client").textContent = sc.brief.client;
  sc.brief.besoin.forEach(function (b) { brief.querySelector(".at-besoins").appendChild(el("li", null, b)); });
  brief.querySelector(".at-materiel").textContent = sc.brief.materiel;
  [["source", sc.brief.source], ["umons", sc.brief.umons]].forEach(function (x) {
    if (!x[1]) return;
    var a = el("aside", { "class": "callout " + x[0] });
    a.appendChild(el("p", null, x[1]));
    brief.appendChild(a);
  });
  host.appendChild(brief);

  var layout = el("div", { "class": "at-layout" });
  var main = el("div", { "class": "at-main" });
  var side = el("div", { "class": "at-side" });
  layout.appendChild(main); layout.appendChild(side);
  host.appendChild(layout);

  /* onglets de vue */
  var tabsVue = el("div", { "class": "at-tabs", role: "tablist", "aria-label": "Angle de vue" });
  VUES.forEach(function (v) {
    var b = el("button", { type: "button", role: "tab", "data-vue": v[0], "class": "at-tab" }, v[1]);
    b.addEventListener("click", function () { setVue(v[0]); });
    tabsVue.appendChild(b);
  });
  main.appendChild(tabsVue);

  var scene = el("div", { "class": "at-scene" });
  var svgCote = svgEl("cote"), svgFace = svgEl("face"), svgArr = svgEl("arriere");
  function svgEl(id) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "at-svg"); s.setAttribute("data-svg", id); s.setAttribute("role", "img");
    return s;
  }
  scene.appendChild(svgCote); scene.appendChild(svgFace); scene.appendChild(svgArr);
  main.appendChild(scene);

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

  var msgBox = el("p", { "class": "at-msg", role: "status", "aria-live": "polite" });
  main.appendChild(msgBox);

  var secEtape = el("section", { "class": "at-etape bloc", "aria-label": "Étape en cours" });
  var secSel = el("section", { "class": "at-sel", "aria-label": "Pièce sélectionnée" });
  var secBac = el("section", { "class": "at-bac", "aria-label": "Bac de pièces" });
  var secListe = el("section", { "class": "at-liste", "aria-label": "Toutes les étapes" });
  side.appendChild(secEtape); side.appendChild(secSel); side.appendChild(secBac); side.appendChild(secListe);

  var secPost = el("section", { "class": "at-post bloc", id: "at-post", hidden: "", "aria-label": "Démarrage du PC" });
  host.appendChild(secPost);

  /* ---------- Messages ---------- */
  function msg(txt, niv, html) {
    msgTxt = txt; msgNiv = niv || "info";
    msgBox.className = "at-msg " + msgNiv;
    if (html) msgBox.innerHTML = html; else msgBox.textContent = txt;
  }

  /* ---------- Vues ---------- */
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

  /* ---------- Dessin de la scène ---------- */
  function wire(x1, y1, x2, y2, color) {
    var d = "M" + x1 + " " + y1 + " C " + x1 + " " + (y1 + (y2 - y1) * 0.6).toFixed(0) + ", " + (x1 + (x2 - x1) * 0.4).toFixed(0) + " " + y2 + ", " + x2 + " " + y2;
    return '<path d="' + d + '" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="6" stroke-linecap="round" transform="translate(2 3)"/>' +
      '<path d="' + d + '" fill="none" stroke="#2B2723" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 6"/>';
  }
  function isCable(s) { return s.accepte[0].indexOf("cab-") === 0; }
  function dispo(s) {
    return (s.requiert || []).every(function (r) { return !!st.placed[r]; });
  }
  function drawSlots(slots, rotate) {
    var cand = {}, guide = guideSlots(), out = "", pass = [[], [], [], []];
    candidatSlots().forEach(function (s) { cand[s.id] = true; });
    var sorted = slots.slice().sort(function (a, b) { return a.z - b.z; });
    sorted.forEach(function (s) {
      var it = st.placed[s.id], p = it && P[it];
      var sx = s.x, sy = s.y;
      if (!p) {
        if (!TEST && dispo(s) && !cand[s.id]) pass[0].push('<rect class="slot-vide' + (guide[s.id] ? " guide" : "") + '" x="' + sx + '" y="' + sy + '" width="' + s.w + '" height="' + s.h + '" rx="3"/>');
        return;
      }
      var cls = "pose" + (sel && sel.type === "slot" && sel.id === s.id ? " sel" : "");
      var g;
      if (isCable(s)) {
        var f = rotate ? ARR_FIL[s.id] : s.fil;
        pass[1].push(f ? wire(sx + s.w / 2, sy + s.h / 2, f[0], f[1], p.o.couleur) : "");
        g = '<g class="' + cls + '" data-slot="' + s.id + '"><title>' + esc(p.nom) + "</title>" + Art.fit("plug", sx, sy, s.w, s.h, { couleur: p.o.couleur, pins: p.pins }) +
          '<rect x="' + (sx - 4) + '" y="' + (sy - 4) + '" width="' + (s.w + 8) + '" height="' + (s.h + 8) + '" fill="transparent"/></g>';
        pass[3].push(g);
      } else {
        g = '<g class="' + cls + '" data-slot="' + s.id + '"><title>' + esc(p.nom) + "</title>" +
          '<g filter="url(#f-ombre)">' + Art.pieceScene(p, sx, sy, s.w, s.h) + "</g>" +
          (s.id === "fan-rear" || s.id === "fan-front" ? '<text x="' + (sx + s.w / 2) + '" y="' + (sy + s.h + 11) + '" font-size="9" text-anchor="middle" class="lbl-cote" fill="#BBAF9F" font-family="IBM Plex Mono, monospace">←</text>' : "") + "</g>";
        pass[s.z < 5 ? 0 : 2].push(g);
      }
    });
    /* zones de dépôt (au-dessus de tout) */
    sorted.forEach(function (s) {
      if (!cand[s.id]) return;
      var pad = 6;
      out += '<g data-slot="' + s.id + '" class="slot-cible"><title>' + esc(s.nom) + '</title><rect class="slot-hit cand" x="' + (s.x - pad) + '" y="' + (s.y - pad) + '" width="' + (s.w + pad * 2) + '" height="' + (s.h + pad * 2) + '" rx="5"/></g>';
    });
    return pass[0].join("") + pass[1].join("") + pass[2].join("") + pass[3].join("") + out;
  }

  var VB = { cote: "0 0 860 620", zoom: "100 150 350 350", face: "0 0 420 610", arriere: "0 0 420 610" };
  function renderScene() {
    var slotsBoitier = disp.slots.filter(function (s) { return s.vue === "cote" || s.vue === "zoom"; });
    var slotsArr = disp.slots.filter(function (s) { return s.vue === "arriere"; });
    svgCote.setAttribute("viewBox", VB[vue === "zoom" ? "zoom" : "cote"]);
    svgCote.setAttribute("aria-label", vue === "zoom" ? "Zoom sur la carte mère : socket, mémoire, M.2, PCIe, connecteurs" : "Boîtier vu de côté, panneau retiré : arrière à gauche, avant à droite");
    if (vue === "zoom") svgCote.setAttribute("data-zoom", ""); else svgCote.removeAttribute("data-zoom");
    svgCote.innerHTML = Art.coteFond() + drawSlots(slotsBoitier, false);
    svgFace.setAttribute("viewBox", VB.face); svgFace.setAttribute("aria-label", "Face avant du boîtier : grille, panneau d'entrée-sortie et bouton marche");
    svgFace.innerHTML = Art.faceVue({ placed: st.placed, etatPost: st.post ? st.post.code : null });
    svgArr.setAttribute("viewBox", VB.arriere); svgArr.setAttribute("aria-label", "Arrière du boîtier : ventilateur, ports de la carte mère, alimentation et interrupteur");
    svgArr.innerHTML = Art.arriereVue({ placed: st.placed, switchOn: st.switchOn }) + drawSlots(slotsArr, true);
    svgCote.style.display = (vue === "cote" || vue === "zoom") ? "" : "none";
    svgFace.style.display = vue === "face" ? "" : "none";
    svgArr.style.display = vue === "arriere" ? "" : "none";
    Array.prototype.forEach.call(tabsVue.children, function (b) {
      var on = b.getAttribute("data-vue") === vue;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.setAttribute("tabindex", on ? "0" : "-1");
    });
    bSwitch.textContent = "Interrupteur : " + (st.switchOn ? "I" : "O");
    bSwitch.setAttribute("aria-pressed", st.switchOn ? "true" : "false");
  }

  /* ---------- Bac de pièces ---------- */
  function renderBac() {
    var restantes = R.restantes(sc, st), guide = guideSlots(), glow = {};
    Object.keys(guide).forEach(function (k) { glow[guide[k]] = true; });
    secBac.textContent = "";
    var h = el("h2", null, "Bac de pièces");
    secBac.appendChild(h);
    var tabs = el("div", { "class": "at-tabs petit", role: "tablist", "aria-label": "Catégories" });
    CATS.forEach(function (c) {
      var n = restantes.filter(function (id) { return P[id].cat === c[0]; }).length;
      var b = el("button", { type: "button", role: "tab", "class": "at-tab", "aria-selected": onglet === c[0] ? "true" : "false" }, c[1] + " (" + n + ")");
      b.addEventListener("click", function () { onglet = c[0]; renderBac(); });
      tabs.appendChild(b);
    });
    secBac.appendChild(tabs);
    var grid = el("div", { "class": "at-grid" });
    var liste = restantes.filter(function (id) { return P[id].cat === onglet; });
    if (!liste.length) grid.appendChild(el("p", { "class": "muted" }, "Tout est posé dans cette catégorie."));
    liste.forEach(function (id) {
      var p = P[id];
      var b = el("button", { type: "button", "class": "at-piece" + (glow[id] ? " guide" : ""), "data-id": id, "aria-pressed": sel && sel.type === "tray" && sel.id === id ? "true" : "false" });
      b.innerHTML = '<span class="ico">' + Art.icone(p) + '</span><span class="nom"></span><span class="res"></span>';
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
  });

  function selectTray(id, opts) {
    sel = { type: "tray", id: id };
    var c = R.candidats(sc, st, id);
    if (c.length) {
      var vues = c.map(function (s) { return s.vue; });
      if (vues.indexOf(vue) < 0 && !(vue === "zoom" && vues.indexOf("cote") >= 0)) vue = vues[0];
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
    top.innerHTML = '<span class="ico">' + Art.icone(p) + '</span><div><h2></h2><p class="muted"></p></div>';
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
  function renderEtape() {
    if (TEST) { renderTest(); return; }
    var l = steps(), i = cur();
    secEtape.textContent = "";
    var done = l.filter(function (x) { return x.fait; }).length;
    drawProgress(done, l.length);
    if (i >= l.length) {
      secEtape.appendChild(el("p", { "class": "kicker" }, "Scénario terminé"));
      secEtape.appendChild(el("p", null, "Toutes les étapes sont faites. Tu peux modifier le montage pour voir ce qui change au démarrage, ou recommencer."));
      return;
    }
    var e = l[i].def, n = st.indices[e.id] || 0;
    secEtape.appendChild(el("p", { "class": "kicker" }, "Étape " + (i + 1) + " / " + l.length));
    secEtape.appendChild(el("h2", null, e.titre));
    secEtape.appendChild(el("p", null, e.texte));
    var hints = el("ol", { "class": "at-hints" });
    for (var k = 0; k < Math.min(n, e.indices.length); k++) hints.appendChild(el("li", null, e.indices[k]));
    if (n > e.indices.length) hints.appendChild(el("li", { "class": "sol" }, "Les pièces et emplacements concernés sont surlignés."));
    if (hints.children.length) secEtape.appendChild(hints);
    var row = el("div", { "class": "at-etape-actions" });
    var bi = el("button", { type: "button", "class": "btn ghost" }, n >= e.indices.length + 1 ? "Indice (tout est montré)" : "Indice");
    bi.addEventListener("click", indice);
    var bm = el("button", { type: "button", "class": "btn ghost" }, "Montre-moi");
    bm.addEventListener("click", montre);
    row.appendChild(bi); row.appendChild(bm);
    if (e.vue !== vue && !(e.vue === "cote" && vue === "zoom")) {
      var bv = el("button", { type: "button", "class": "btn ghost" }, "Aller à la vue « " + VUES.filter(function (v) { return v[0] === e.vue; })[0][1] + " »");
      bv.addEventListener("click", function () { setVue(e.vue); renderEtape(); });
      row.appendChild(bv);
    }
    secEtape.appendChild(row);
    var d = el("details", { "class": "correction" });
    d.appendChild(el("summary", null, "Pourquoi cette étape ?"));
    d.appendChild(el("p", null, e.pourquoi));
    secEtape.appendChild(d);
  }

  function renderTest() {
    secEtape.textContent = "";
    secListe.hidden = true;
    head.querySelector(".at-progress").textContent = "";
    secEtape.appendChild(el("p", { "class": "kicker" }, "Test noté · sans aide"));
    secEtape.appendChild(el("h2", null, "Monte le PC du cahier des charges"));
    secEtape.appendChild(el("p", null, "Pas d'indices, pas d'ordre imposé, pas d'alerte : les erreurs se voient au démarrage. Allume le PC autant de fois que nécessaire, puis termine le test."));
    var ul = el("ul", { "class": "at-bareme" });
    ["Démarrage : 40 points (10 de moins par démarrage raté)", "Cahier des charges : 50 points, répartis sur les critères", "Gestes : 10 points (2 de moins par pose refusée)"].forEach(function (t) { ul.appendChild(el("li", null, t)); });
    secEtape.appendChild(ul);
    secEtape.appendChild(el("p", { "class": "muted at-compteurs" }, "Démarrages ratés : " + st.echecs.length + " · Poses refusées : " + st.erreurs));
  }

  function renderListe() {
    if (TEST) return;
    var l = steps(), i = cur();
    secListe.textContent = "";
    secListe.appendChild(el("h2", null, "Toutes les étapes"));
    var ol = el("ol", { "class": "at-etapes" });
    l.forEach(function (x, k) {
      var li = el("li", { "class": x.fait ? "fait" : (k === i ? "courante" : "") });
      li.appendChild(el("span", { "class": "pastille", "aria-hidden": "true" }, x.fait ? "✓" : String(k + 1)));
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
    st = R.nouvelEtat(sc, TEST ? "test" : "apprentissage"); st.indices = {}; st.aides = 0; hist = []; sel = null; vue = "cote";
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
        ghost.innerHTML = Art.icone(P[id]);
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
      if (g && scene.contains(g)) tryPlace(id, g.getAttribute("data-slot"));
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
    renderScene(); renderBac(); renderSel(); renderEtape(); renderListe();
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

  load();
  msg(TEST ? "Test noté : lis le cahier des charges, monte le PC sans aide, allume-le pour vérifier, puis termine le test." : "Bienvenue ! Lis le cahier des charges, puis suis les étapes : touche une pièce du bac, puis son emplacement.", "info");
  renderAll();
  }   /* fin de demarrer */

  /* ---------- Rapport d'un scénario noté ---------- */
  function rapportScenario(rec) {
    var box = el("div", { "class": "at-rap" });
    var ok = rec.total >= rec.seuil;
    box.appendChild(el("p", { "class": "kicker" }, "Rapport · " + rec.titre));
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
    h.appendChild(el("p", { "class": "kicker" }, kicker));
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
    var box = el("div", { "class": "at-rap" });
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
    act.appendChild(el("a", { "class": "btn ghost", href: "index.html" }, "Retour à l'atelier"));
    box.appendChild(act);
    host.appendChild(box);
  }

  if (EVAL) lancerEval();
  else demarrer(params.get("s") || host.getAttribute("data-scenario") || "bureautique-intel", { mode: params.get("m") === "test" ? "test" : "apprentissage" });
})();
