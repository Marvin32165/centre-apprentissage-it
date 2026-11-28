/* Atelier hardware — géométrie des maquettes isométriques et dessin des pièces (REFONTE.md § 7.3).
   Dimensions en millimètres, d'après les normes (carte micro-ATX 244 × 244, ATX 305 × 244, mini-ITX 170 × 170 ;
   alimentation ATX 150 × 86 × 140, SFX 125 × 63,5 × 100 ; barrette DIMM ≈ 133 × 31 ; SSD 2,5″ 100 × 70 × 7 ; M.2 2280 : 22 × 80).
   Le reste (positions des embases, du socket, des ventilateurs) est générique : réaliste mais simplifié, pas une carte réelle.
   Repère : x = profondeur (0 = face arrière), y = largeur (0 = plateau de la carte mère), z = hauteur. */
(function () {
  "use strict";
  var I = window.IT_ISO;
  if (!I) return;
  var B = I.boite, R = I.rect, O = I.cercle, L = I.ligne;

  /* ---------- Géométrie des boîtiers ---------- */
  var FORMAT = { ATX: { w: 244, h: 305 }, mATX: { w: 244, h: 244 }, ITX: { w: 170, h: 170 } };

  function tour(nom, H, format) {
    var top = H - 16, bw = FORMAT[format].w, bh = FORMAT[format].h, bz = top - bh;
    var s = {
      standoffs: { x: 20, y: 2, z: bz, w: bw, d: 6, h: bh, axe: [0, 1, 0], ecart: 40 },
      ioshield: { x: -2, y: 10, z: top - 168, w: 2, d: 44, h: 159, axe: [-1, 0, 0], ecart: 70 },
      "fan-rear": { x: 3, y: 60, z: top - 128, w: 25, d: 120, h: 120, axe: [-1, 0, 0], ecart: 90 },
      "fan-front": { x: 372, y: 35, z: 150, w: 25, d: 120, h: 120, axe: [1, 0, 0], ecart: 90 },
      psu: { x: 3, y: 22, z: 3, w: 140, d: 150, h: 86, axe: [-1, 0, 0], ecart: 150 },
      board: { x: 20, y: 8, z: bz, w: bw, d: 2, h: bh, axe: [0, 1, 0], ecart: 70 },
      cpu: { x: 95, y: 10, z: top - 104, w: 45, d: 4, h: 37.5, axe: [0, 1, 0], ecart: 130 },
      paste: { x: 106, y: 14, z: top - 95, w: 23, d: 1, h: 19, axe: [0, 1, 0], ecart: 150 },
      cooler: { x: 68, y: 15, z: top - 135, w: 100, d: 62, h: 100, axe: [0, 1, 0], ecart: 220, prio: 40 },
      "m2-1": { x: 78, y: 10, z: top - 160, w: 80, d: 2.5, h: 22, axe: [0, 1, 0], ecart: 90 },
      gpu: { x: 22, y: 10, z: top - 214, w: 240, d: 112, h: 38, axe: [0, 1, 0], ecart: 170, prio: 30 },
      "con-gpu-pwr": { x: 222, y: 122, z: top - 190, w: 18, d: 6, h: 9, cable: true },
      "con-atx24": { x: 256, y: 10, z: top - 120, w: 6, d: 10, h: 52, cable: true },
      "con-eps": { x: 28, y: 10, z: top - 10, w: 20, d: 10, h: 7, cable: true },
      "h-cpufan": { x: 150, y: 10, z: top - 9, w: 10, d: 6, h: 4, cable: true },
      "h-sys1": { x: 22, y: 10, z: top - 70, w: 4, d: 6, h: 10, cable: true },
      "h-sys2": { x: 200, y: 10, z: bz + 2, w: 10, d: 6, h: 4, cable: true },
      "con-fpanel": { x: 226, y: 10, z: bz + 2, w: 20, d: 6, h: 5, cable: true },
      "con-usb3": { x: 257, y: 10, z: bz + 30, w: 5, d: 8, h: 18, cable: true },
      "con-audio": { x: 40, y: 10, z: bz + 2, w: 14, d: 6, h: 4, cable: true },
      "bay-ssd": { x: 255, y: 60, z: 3, w: 100, d: 70, h: 7, axe: [0, 0, 1], ecart: 80 },
      "sata-data": { x: 249, y: 66, z: 3, w: 6, d: 12, h: 5, cable: true },
      "sata-pwr": { x: 249, y: 82, z: 3, w: 6, d: 22, h: 5, cable: true },
      mains: { x: -5, y: 120, z: 30, w: 6, d: 34, h: 26, cable: true, arriere: true },
      "mon-board": { x: -5, y: 22, z: top - 60, w: 4, d: 18, h: 12, cable: true, arriere: true },
      "mon-gpu": { x: -5, y: 44, z: top - 204, w: 4, d: 18, h: 12, cable: true, arriere: true }
    };
    ["a1", "a2", "b1", "b2"].forEach(function (k, i) {
      s["dimm-" + k] = { x: 188 + i * 10, y: 10, z: top - 148, w: 4, d: 31, h: 133, axe: [0, 1, 0], ecart: 125 };
    });
    /* Barrettes à 45° de l'écartement pour qu'on lise l'ordre A1, A2, B1, B2. */
    return { nom: nom, boitier: { x: 0, y: 0, z: 0, w: 400, d: 190, h: H }, top: top, format: format, slots: s, sortieAlim: [146, 60, 70] };
  }
  var GEO = {
    "tour-matx": tour("Tour micro-ATX", 420, "mATX"),
    "tour-atx": tour("Tour ATX", 470, "ATX")
  };
  /* Compact mini-ITX : boîtier plus court, alimentation SFX, une seule rangée de deux barrettes. */
  (function () {
    var g = tour("Compact mini-ITX", 300, "ITX"), s = g.slots, top = g.top;
    g.boitier = { x: 0, y: 0, z: 0, w: 300, d: 175, h: 300 };
    s.psu = { x: 3, y: 30, z: 3, w: 100, d: 125, h: 63.5, axe: [-1, 0, 0], ecart: 130 };
    s["fan-rear"] = { x: 3, y: 60, z: top - 100, w: 25, d: 92, h: 92, axe: [-1, 0, 0], ecart: 80 };
    s.cooler = { x: 66, y: 15, z: top - 120, w: 92, d: 47, h: 92, axe: [0, 1, 0], ecart: 190, prio: 40 };
    s.cpu = { x: 90, y: 10, z: top - 90, w: 45, d: 4, h: 37.5, axe: [0, 1, 0], ecart: 120 };
    s.paste = { x: 101, y: 14, z: top - 81, w: 23, d: 1, h: 19, axe: [0, 1, 0], ecart: 140 };
    delete s["dimm-a1"]; delete s["dimm-b1"]; delete s["fan-front"]; delete s["h-sys2"];
    s["dimm-a2"].x = 160; s["dimm-b2"].x = 170; s["dimm-a2"].z = s["dimm-b2"].z = top - 140;
    s["m2-1"] = { x: 70, y: 10, z: top - 150, w: 80, d: 2.5, h: 22, axe: [0, 1, 0], ecart: 90 };
    s.gpu = { x: 22, y: 10, z: top - 198, w: 200, d: 112, h: 38, axe: [0, 1, 0], ecart: 150, prio: 30 };
    s["con-gpu-pwr"].x = 190; s["con-gpu-pwr"].z = top - 174;
    s["con-atx24"].x = 182; s["con-usb3"].x = 182; s["con-fpanel"].x = 150;
    s["bay-ssd"] = { x: 185, y: 60, z: 3, w: 100, d: 70, h: 7, axe: [0, 0, 1], ecart: 70 };
    s["sata-data"].x = s["sata-pwr"].x = 179;
    s.mains.y = 100; s.mains.z = 20;
    s["mon-gpu"].z = top - 188;
    g.sortieAlim = [106, 70, 50];
    GEO["compact-itx"] = g;
  })();

  /* ---------- Dessin des pièces ---------- */
  function vis(c, plan) { return O(plan || "y", c, 2.4, "iso-vis"); }
  var D = {
    entretoises: function (b, p) {
      var f = (p && p.format) || "mATX", w = FORMAT[f].w, h = FORMAT[f].h, s = "", top = b.z + b.h;
      var trous = f === "ITX" ? [[10, 10], [160, 10], [10, 160], [160, 160]] :
        [[10, 10], [124, 10], [234, 10], [10, h - 10], [124, h - 10], [234, h - 10], [10, h / 2], [234, h / 2], [124, h / 2]].slice(0, f === "ATX" ? 9 : 6);
      if (f === "mATX") trous = [[6, h - 10], [163, h - 10], [6, h - 166], [163, h - 166], [234, h - 10], [234, h - 166]];
      trous.forEach(function (t) { s += B({ x: b.x + t[0] - 2.5, y: b.y, z: top - t[1] - 2.5, w: 5, d: b.d, h: 5 }, { cls: "iso-laiton" }); });
      return s;
    },
    "cache-io": function (b) {
      var s = B(b, { cls: "iso-metal" });
      for (var i = 0; i < 5; i++) s += R("x", { x: b.x + b.w, y: b.y + 8, z: b.z + 14 + i * 28, d: 28, h: 16 }, "iso-trou");
      return s;
    },
    alim: function (b, p) {
      var s = B(b, { cls: "iso-metal" });
      s += O("z", [b.x + b.w / 2, b.y + b.d / 2, b.z + b.h], Math.min(b.w, b.d) * 0.36, "iso-grille");
      s += O("z", [b.x + b.w / 2, b.y + b.d / 2, b.z + b.h], Math.min(b.w, b.d) * 0.1, "iso-det");
      s += R("y", { x: b.x + 14, y: b.y + b.d, z: b.z + 18, w: b.w * 0.5, h: b.h * 0.42 }, "iso-etiquette");
      return s;
    },
    ventilateur: function (b) {
      var s = B(b, { cls: "iso-plastique" }), plan = b.w < b.d ? "x" : "y";
      var c = plan === "x" ? [b.x + b.w, b.y + b.d / 2, b.z + b.h / 2] : [b.x + b.w / 2, b.y + b.d, b.z + b.h / 2];
      var r = Math.min(b.d, b.h) / 2 - 6;
      s += O(plan, c, r, "iso-grille") + O(plan, c, r * 0.3, "iso-det");
      return s;
    },
    "carte-mere": function (b, p) {
      var f = (p && p.format) || "mATX", top = b.z + b.h, h = FORMAT[f].h, w = FORMAT[f].w;
      var bb = { x: b.x, y: b.y, z: top - h, w: w, d: b.d, h: h }, Y = b.y + b.d, s = B(bb, { cls: "iso-pcb" });
      s += R("y", { x: b.x + 72, y: Y, z: top - 112, w: 54, h: 54 }, "iso-socket");
      for (var i = 0; i < 4; i++) if (f !== "ITX" || i === 1 || i === 3) s += R("y", { x: b.x + 166 + i * 10, y: Y, z: top - 150, w: 6, h: 137 }, "iso-slot");
      s += R("y", { x: b.x + 6, y: Y, z: top - 214 + 34, w: f === "ITX" ? 150 : 200, h: 8 }, "iso-slot");
      if (f !== "ITX") s += R("y", { x: b.x + 6, y: Y, z: top - 214 - 40, w: 120, h: 6 }, "iso-slot");
      s += R("y", { x: b.x + 236 - (244 - w), y: Y, z: top - 122, w: 6, h: 56 }, "iso-slot");
      s += R("y", { x: b.x + 4, y: Y, z: top - 166, w: 30, h: 150 }, "iso-det");
      return s;
    },
    cpu: function (b) {
      return B(b, { cls: "iso-pcb" }) + R("y", { x: b.x + 6, y: b.y + b.d, z: b.z + 5, w: b.w - 12, h: b.h - 10 }, "iso-metal-f");
    },
    pate: function (b) { return R("y", { x: b.x, y: b.y + b.d, z: b.z, w: b.w, h: b.h }, "iso-pate"); },
    ventirad: function (b) {
      var s = B(b, { cls: "iso-metal" }), n = 9;
      for (var i = 1; i < n; i++) s += L([b.x + 4, b.y + b.d, b.z + i * b.h / n], [b.x + b.w - 4, b.y + b.d, b.z + i * b.h / n], "iso-ailette");
      s += O("y", [b.x + b.w / 2, b.y + b.d, b.z + b.h / 2], b.h * 0.42, "iso-grille") + O("y", [b.x + b.w / 2, b.y + b.d, b.z + b.h / 2], b.h * 0.12, "iso-det");
      return s;
    },
    ram: function (b) {
      var s = B(b, { cls: "iso-pcb" });
      for (var i = 0; i < 4; i++) s += R("x", { x: b.x + b.w, y: b.y + 8, z: b.z + 10 + i * 31, d: 16, h: 24 }, "iso-puce");
      s += R("x", { x: b.x + b.w, y: b.y + 1, z: b.z + 70, d: 3, h: 4 }, "iso-trou");
      return s;
    },
    "ssd-m2": function (b) {
      var s = B(b, { cls: "iso-pcb" });
      s += R("y", { x: b.x + 6, y: b.y + b.d, z: b.z + 4, w: 22, h: 14 }, "iso-puce") + R("y", { x: b.x + 34, y: b.y + b.d, z: b.z + 4, w: 30, h: 14 }, "iso-puce");
      return s + vis([b.x + b.w - 2, b.y + b.d, b.z + b.h / 2]);
    },
    "ssd-sata": function (b) { return B(b, { cls: "iso-metal" }) + R("z", { x: b.x + 14, y: b.y + 10, z: b.z + b.h, w: 60, d: 46 }, "iso-etiquette"); },
    "hdd-sata": function (b) { return B(b, { cls: "iso-metal" }) + O("z", [b.x + 50, b.y + 35, b.z + b.h], 26, "iso-det"); },
    gpu: function (b) {
      var s = B(b, { cls: "iso-plastique" });
      s += R("y", { x: b.x + 10, y: b.y + b.d, z: b.z + 6, w: b.w - 30, h: b.h - 12 }, "iso-det");
      s += O("z", [b.x + b.w * 0.3, b.y + b.d / 2, b.z + b.h], 40, "iso-grille") + O("z", [b.x + b.w * 0.72, b.y + b.d / 2, b.z + b.h], 40, "iso-grille");
      s += B({ x: b.x - 2, y: b.y, z: b.z, w: 2, d: b.d + 8, h: b.h }, { cls: "iso-metal" });
      return s;
    },
    connecteur: function (b, t) {
      /* Broches dessinées sur la face visible (côté ouvert) : colonnes × rangées selon le connecteur. */
      var G = { "cab-atx24": [2, 12], "cab-eps": [2, 4], "cab-pcie": [2, 4], "cab-sata-pwr": [1, 1], "cab-sata-data": [1, 1], "cab-facade": [2, 5], "cab-usb3": [2, 10], "cab-audio": [2, 5], "cab-fan": [1, 4] }[t];
      var s = B(b, { cls: "iso-connecteur" });
      if (!G) return s;
      var c = G[0], r = G[1], pw = b.w / (c + 1), ph = b.h / (r + 1), q = Math.min(pw, ph) * 0.55;
      if (c === 1 && r === 1) return s + R("y", { x: b.x + b.w * 0.2, y: b.y + b.d, z: b.z + b.h * 0.3, w: b.w * 0.6, h: b.h * 0.4 }, "iso-broche");
      for (var i = 1; i <= c; i++) for (var j = 1; j <= r; j++) s += R("y", { x: b.x + i * pw - q / 2, y: b.y + b.d, z: b.z + j * ph - q / 2, w: q, h: q }, "iso-broche");
      return s;
    }
  };
  function dessin(type, b, piece) {
    if (D[type]) return D[type](b, piece);
    return /^cab-/.test(type) ? D.connecteur(b, type) : B(b);
  }

  /* Câble : trajet en courbe de la sortie de l'alimentation (ou d'un point donné) jusqu'au connecteur. */
  function cable(depart, b) {
    var a = I.P(depart[0], depart[1], depart[2]), c = I.centre(b), q = I.P(c[0], c[1], c[2]);
    var m = I.P((depart[0] + c[0]) / 2, Math.max(depart[1], c[1]) + 40, (depart[2] + c[2]) / 2);
    return '<path class="iso-cable" d="M' + a[0].toFixed(1) + " " + a[1].toFixed(1) + " Q" + m[0].toFixed(1) + " " + m[1].toFixed(1) + " " + q[0].toFixed(1) + " " + q[1].toFixed(1) + '"/>';
  }

  /* Boîtier ouvert (panneau latéral retiré) : plateau, fond, arêtes. */
  function boitier(g, o) {
    o = o || {};
    var c = g.boitier, s = "";
    s += B({ x: c.x, y: c.y - 4, z: c.z, w: c.w, d: 4, h: c.h }, { cls: "iso-tole", sansDessus: true });
    s += I.rect("z", { x: c.x, y: c.y, z: c.z, w: c.w, d: c.d }, "iso-sol");
    s += I.rect("x", { x: c.x, y: c.y, z: c.z, d: c.d, h: c.h }, "iso-fond");
    s += I.cadre(c, "iso-trait");
    return s;
  }
  function panneau(g, dist) {
    var c = g.boitier;
    return '<g class="iso-piece iso-panneau">' + B({ x: c.x + 6, y: c.y + c.d + dist, z: c.z + 6, w: c.w - 12, d: 3, h: c.h - 12 }, { cls: "iso-tole" }) + "</g>" +
      I.ligne([c.x + c.w / 2, c.y + c.d, c.z + c.h / 2], [c.x + c.w / 2, c.y + c.d + dist, c.z + c.h / 2], "iso-axe");
  }

  /* ---------- Couverture : vue éclatée d'un PC complet ---------- */
  var NOMEN = [
    ["psu", "alim", "Alimentation ATX", "a-alimentation"], ["board", "carte-mere", "Carte mère micro-ATX", "a-carte-mere"],
    ["cpu", "cpu", "Processeur", "a-processeur"], ["cooler", "ventirad", "Ventirad", "a-refroidissement"],
    ["dimm-a2", "ram", "Barrettes de mémoire", "a-memoire"], ["m2-1", "ssd-m2", "SSD M.2 NVMe", "a-stockage"],
    ["gpu", "gpu", "Carte graphique", "a-carte-graphique"], ["fan-front", "ventilateur", "Ventilateurs", "a-refroidissement"],
    ["bay-ssd", "ssd-sata", "SSD SATA 2,5″", "a-stockage"], ["ioshield", "cache-io", "Cache I/O", "a-boitier"]
  ];
  function couverture(t) {
    var g = GEO["tour-matx"], items = [];
    NOMEN.forEach(function (n, i) {
      var s = g.slots[n[0]];
      items.push({ id: n[0], boite: s, axe: s.axe, ecart: s.ecart, rep: String(i + 1), titre: n[2], dessin: function (b) { return dessin(n[1], b); } });
    });
    ["dimm-b2", "fan-rear"].forEach(function (id) {
      var s = g.slots[id];
      items.push({ id: id, boite: s, axe: s.axe, ecart: s.ecart, dessin: function (b) { return dessin(id === "fan-rear" ? "ventilateur" : "ram", b); } });
    });
    var c = g.boitier;
    return {
      svg: I.scene(items, { t: t == null ? 1 : t, fond: boitier(g), classe: "iso-couv", titre: "Vue éclatée d'un PC de bureau : boîtier tour, carte mère, alimentation et composants", bornes: [c] }),
      nomenclature: NOMEN.map(function (n, i) { return { rep: i + 1, nom: n[2], fiche: n[3] }; })
    };
  }

  /* ---------- PC complet (diagnostic, missions, annexes) ----------
     placed : { emplacement: idPiece } ; o.ouvert : panneau latéral retiré ; o.led : "ok" | "ko" | null ; o.tension : sous tension. */
  function pc(dispoId, placed, o) {
    o = o || {};
    var A = window.IT_ATELIER, g = GEO[dispoId] || GEO["tour-matx"], c = g.boitier, W = c.w, H = c.h, items = [], avant = "";
    var d = A && A.dispositions[dispoId] || (A && A.dispositions["tour-matx"]);
    function face() {
      var led = o.led === "ok" ? "iso-led ok" : o.led ? "iso-led ko" : "iso-led";
      return I.rect("x", { x: W, y: 24, z: H - 70, d: 14, h: 6 }, "iso-trou") + I.rect("x", { x: W, y: 44, z: H - 70, d: 14, h: 6 }, "iso-trou") +
        I.cercle("x", [W, 120, H - 66], 3, led) +
        '<g data-bouton="power" class="iso-bouton"><title>Bouton marche</title>' + I.cercle("x", [W, 150, H - 66], 9, "iso-bouton-c") + I.cercle("x", [W, 150, H - 66], 4, "iso-det") + "</g>";
    }
    if (!o.ouvert) {
      var ferme = I.boite({ x: 0, y: -4, z: 0, w: W, d: c.d + 4, h: H }, { cls: "iso-tole" }) +
        I.rect("y", { x: 40, y: c.d, z: 40, w: W - 80, h: H - 80 }, "iso-det") + face();
      return I.scene([], { fond: ferme, bornes: [c], classe: "at-iso pc-iso", titre: o.titre || "PC fermé, vu de trois quarts avant" });
    }
    (d ? d.slots : []).forEach(function (s) {
      var gs = g.slots[s.id], it = placed[s.id], p = it && A.pieces[it];
      if (!gs || !p || gs.arriere) return;
      if (/^cab-/.test(p.type)) {
        var t = p.type, dep = t === "cab-fan" ? (g.slots[p.source] ? I.centre(g.slots[p.source]) : g.sortieAlim)
          : (t === "cab-facade" || t === "cab-usb3" || t === "cab-audio") ? [W - 8, 30, H - 60]
          : t === "cab-sata-data" ? [g.slots.board.x + g.slots.board.w - 8, 12, g.slots.board.z + 40] : g.sortieAlim;
        avant += cable(dep, gs);
        items.push({ id: s.id, boite: gs, prio: 60, titre: p.nom, dessin: function (bb) { return dessin(t, bb, p); } });
      } else items.push({ id: s.id, boite: gs, prio: gs.prio, titre: p.nom, cls: o.hl && o.hl.indexOf(s.id) >= 0 ? "is-hl" : "", dessin: function (bb) { return dessin(p.type, bb, p); } });
    });
    return I.scene(items, { fond: boitier(g), avant: avant + face(), bornes: [c], classe: "at-iso pc-iso", titre: o.titre || "PC ouvert, vu de trois quarts avant, panneau latéral retiré", reperes: false });
  }

  window.IT_ISO_DATA = { pc: pc, GEO: GEO, FORMAT: FORMAT, dessin: dessin, cable: cable, boitier: boitier, panneau: panneau, couverture: couverture };
})();
