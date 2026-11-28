/* Atelier hardware — noyau de dessin isométrique (REFONTE.md § 7.3), sans bibliothèque.
   Repère : x = profondeur (de l'arrière vers l'avant du boîtier), y = largeur (du plateau vers le côté ouvert), z = hauteur.
   Projection isométrique 30° : X = (x − y)·cos30, Y = (x + y)·sin30 − z. Faces visibles : dessus, face y+ (côté ouvert), face x+ (avant).
   Les couleurs viennent des classes CSS (.iso-t, .iso-g, .iso-d…) : la maquette suit le thème clair ou sombre. */
(function () {
  "use strict";
  var C = Math.cos(Math.PI / 6), S = 0.5;

  function f(n) { return Math.round(n * 10) / 10; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Projection d'un point 3D (x, y, z) en coordonnées d'écran. */
  function P(x, y, z) { return [(x - y) * C, (x + y) * S - z]; }
  function pts(list) { return list.map(function (p) { var q = P(p[0], p[1], p[2]); return f(q[0]) + "," + f(q[1]); }).join(" "); }

  /* Une boîte : trois faces visibles, ombrées en trois tons. o.cls : classe de famille ; o.fin : trait fin. */
  function boite(b, o) {
    o = o || {};
    var x = b.x, y = b.y, z = b.z, w = b.w, d = b.d, h = b.h, X = x + w, Y = y + d, Z = z + h;
    var c = o.cls ? " " + o.cls : "";
    var s = "";
    if (!o.sansDessus) s += '<polygon class="iso-t' + c + '" points="' + pts([[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]]) + '"/>';
    s += '<polygon class="iso-g' + c + '" points="' + pts([[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]]) + '"/>';
    s += '<polygon class="iso-d' + c + '" points="' + pts([[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]]) + '"/>';
    return s;
  }
  /* Un rectangle sur une face (détail : port, étiquette, slot). plan : "z" (horizontal), "y" (face côté ouvert), "x" (face avant). */
  function rect(plan, a, cls) {
    var q;
    if (plan === "z") q = [[a.x, a.y, a.z], [a.x + a.w, a.y, a.z], [a.x + a.w, a.y + a.d, a.z], [a.x, a.y + a.d, a.z]];
    else if (plan === "y") q = [[a.x, a.y, a.z], [a.x + a.w, a.y, a.z], [a.x + a.w, a.y, a.z + a.h], [a.x, a.y, a.z + a.h]];
    else q = [[a.x, a.y, a.z], [a.x, a.y + a.d, a.z], [a.x, a.y + a.d, a.z + a.h], [a.x, a.y, a.z + a.h]];
    return '<polygon class="' + (cls || "iso-det") + '" points="' + pts(q) + '"/>';
  }
  /* Un cercle dans un plan (ventilateur, vis) : polygone de 28 côtés. */
  function cercle(plan, c, r, cls) {
    var l = [];
    for (var i = 0; i < 28; i++) {
      var t = i / 28 * Math.PI * 2, u = Math.cos(t) * r, v = Math.sin(t) * r;
      l.push(plan === "z" ? [c[0] + u, c[1] + v, c[2]] : plan === "y" ? [c[0] + u, c[1], c[2] + v] : [c[0], c[1] + u, c[2] + v]);
    }
    return '<polygon class="' + (cls || "iso-det") + '" points="' + pts(l) + '"/>';
  }
  function ligne(a, b, cls) {
    var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]);
    return '<line class="' + (cls || "iso-trait") + '" x1="' + f(p[0]) + '" y1="' + f(p[1]) + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '"/>';
  }
  /* Arêtes d'une boîte en fil de fer (boîtier ouvert) : arêtes du fond pleines, arêtes avant en tirets. */
  function cadre(b, cls) {
    var x = b.x, y = b.y, z = b.z, X = x + b.w, Y = y + b.d, Z = z + b.h, s = "";
    [[[x, y, z], [X, y, z]], [[x, y, z], [x, Y, z]], [[x, y, z], [x, y, Z]], [[x, y, Z], [X, y, Z]], [[x, y, Z], [x, Y, Z]], [[X, y, z], [X, y, Z]]]
      .forEach(function (e) { s += ligne(e[0], e[1], cls || "iso-trait"); });
    [[[X, y, z], [X, Y, z]], [[x, Y, z], [X, Y, z]], [[x, Y, z], [x, Y, Z]], [[X, Y, z], [X, Y, Z]], [[x, Y, Z], [X, Y, Z]], [[X, y, Z], [X, Y, Z]]]
      .forEach(function (e) { s += ligne(e[0], e[1], "iso-arete"); });
    return s;
  }

  /* Profondeur de tri (peintre) : le plus loin d'abord. */
  function profondeur(b) { return (b.x + b.w / 2) + (b.y + b.d / 2) + (b.z + b.h / 2) * 0.6 + (b.prio || 0); }

  /* Décale une boîte le long de son axe de montage (vue éclatée). */
  function decale(b, axe, dist) {
    if (!axe || !dist) return b;
    var o = {}; for (var k in b) o[k] = b[k];
    o.x += axe[0] * dist; o.y += axe[1] * dist; o.z += axe[2] * dist;
    return o;
  }
  function centre(b) { return [b.x + b.w / 2, b.y + b.d / 2, b.z + b.h / 2]; }

  /* Rendu d'une scène.
     items : [{ id, boite, axe, ecart, dessin(b) → svg, cls, rep, titre }]
     o : { t (0–1, écartement), fond (svg dessiné d'abord), avant (svg dessiné après), reperes (true), marge, classe, titre } */
  function scene(items, o) {
    o = o || {};
    var t = o.t || 0, mx = 1e9, my = 1e9, Mx = -1e9, My = -1e9;
    function borne(b) {
      [[b.x, b.y, b.z], [b.x + b.w, b.y, b.z], [b.x, b.y + b.d, b.z], [b.x, b.y, b.z + b.h], [b.x + b.w, b.y + b.d, b.z], [b.x + b.w, b.y, b.z + b.h], [b.x, b.y + b.d, b.z + b.h], [b.x + b.w, b.y + b.d, b.z + b.h]]
        .forEach(function (p) { var q = P(p[0], p[1], p[2]); mx = Math.min(mx, q[0]); Mx = Math.max(Mx, q[0]); my = Math.min(my, q[1]); My = Math.max(My, q[1]); });
    }
    var rendus = items.map(function (it) {
      var b = decale(it.boite, it.axe, (it.ecart || 0) * t);
      borne(b);
      return { it: it, b: b, p: profondeur(b) };
    });
    (o.bornes || []).forEach(borne);
    rendus.sort(function (a, b) { return a.p - b.p; });
    var corps = "", axes = "", reps = "", n = 0, cx = (mx + Mx) / 2, cy = (my + My) / 2, L = o.repLong || 44;
    rendus.forEach(function (r) {
      var it = r.it;
      if (t > 0 && it.axe && it.ecart) axes += ligne(centre(it.boite), centre(r.b), "iso-axe");
      corps += '<g class="iso-piece' + (it.cls ? " " + it.cls : "") + '" data-id="' + esc(it.id) + '"' + (it.titre ? ' aria-label="' + esc(it.titre) + '"' : "") + ">" +
        (it.titre ? "<title>" + esc(it.titre) + "</title>" : "") + (it.dessin ? it.dessin(r.b) : boite(r.b)) + "</g>";
      if (o.reperes !== false && it.rep) {
        n++;
        var c = it.ancre ? it.ancre(r.b) : [r.b.x + r.b.w / 2, r.b.y + r.b.d, r.b.z + r.b.h];
        var p = P(c[0], c[1], c[2]), vx = p[0] - cx, vy = p[1] - cy, nv = Math.sqrt(vx * vx + vy * vy) || 1;
        var dx = it.repDir ? it.repDir[0] : vx / nv * L, dy = it.repDir ? it.repDir[1] : vy / nv * L;
        var lx = p[0] + dx, ly = p[1] + dy;
        reps += '<g class="iso-rep" data-rep="' + esc(it.id) + '"><line x1="' + f(p[0]) + '" y1="' + f(p[1]) + '" x2="' + f(lx) + '" y2="' + f(ly) + '"/>' +
          '<circle class="iso-rep-pt" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="2"/><circle cx="' + f(lx) + '" cy="' + f(ly) + '" r="11"/>' +
          '<text x="' + f(lx) + '" y="' + f(ly + 4) + '">' + esc(it.rep) + "</text></g>";
        mx = Math.min(mx, lx - 14); Mx = Math.max(Mx, lx + 14); my = Math.min(my, ly - 14); My = Math.max(My, ly + 14);
      }
    });
    var m = o.marge == null ? 16 : o.marge;
    var vb = [f(mx - m), f(my - m), f(Mx - mx + 2 * m), f(My - my + 2 * m)];
    return '<svg class="iso' + (o.classe ? " " + o.classe : "") + '" viewBox="' + vb.join(" ") + '" role="img"' + (o.titre ? ' aria-label="' + esc(o.titre) + '"' : "") + ">" +
      (o.fond || "") + axes + corps + (o.avant || "") + reps + "</svg>";
  }

  window.IT_ISO = { P: P, pts: pts, boite: boite, rect: rect, cercle: cercle, ligne: ligne, cadre: cadre, scene: scene, decale: decale, centre: centre, esc: esc };
})();
