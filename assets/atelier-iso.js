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
     o : { t (0–1, écartement), fond (svg dessiné d'abord), avant (svg dessiné après), reperes (true), marge, classe, titre,
         bornes (boîtes ajoutées au cadre), cadrage (boîtes qui seules fixent le cadre : agrandissement), repLong (longueur des lignes d'attache) } */
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
      return { it: it, b: b, p: profondeur(b) + (it.prio || 0) };
    });
    (o.bornes || []).forEach(borne);
    rendus.sort(function (a, b) { return a.p - b.p; });
    var corps = "", axes = "", reps = "", n = 0, cx = (mx + Mx) / 2, cy = (my + My) / 2, K = o.repK || 1, L = (o.repLong || 44) * K;
    function pastille(id, p, lx, ly) {
      return '<g class="iso-rep" data-rep="' + esc(id) + '"><line x1="' + f(p[0]) + '" y1="' + f(p[1]) + '" x2="' + f(lx) + '" y2="' + f(ly) + '"/>' +
        '<circle class="iso-rep-pt" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(2 * K) + '"/><circle cx="' + f(lx) + '" cy="' + f(ly) + '" r="' + f(11 * K) + '"/>' +
        '<text x="' + f(lx) + '" y="' + f(ly + 4 * K) + '"' + (K !== 1 ? ' style="font-size:' + f(12 * K) + 'px"' : "") + ">";
    }
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
        reps += pastille(it.id, p, lx, ly) + esc(it.rep) + "</text></g>";
        mx = Math.min(mx, lx - 14 * K); Mx = Math.max(Mx, lx + 14 * K); my = Math.min(my, ly - 14 * K); My = Math.max(My, ly + 14 * K);
      }
    });
    if (o.cadrage) { mx = 1e9; my = 1e9; Mx = -1e9; My = -1e9; o.cadrage.forEach(borne); }
    (o.notes || []).forEach(function (nt) {
      var p = P(nt.ancre[0], nt.ancre[1], nt.ancre[2]), d = nt.dir || [40, -30], lx = p[0] + d[0] * K, ly = p[1] + d[1] * K;
      reps += pastille(nt.rep, p, lx, ly) + esc(nt.rep) + "</text></g>";
      if (!o.cadrage) { mx = Math.min(mx, lx - 14 * K); Mx = Math.max(Mx, lx + 14 * K); my = Math.min(my, ly - 14 * K); My = Math.max(My, ly + 14 * K); }
    });
    var m = o.marge == null ? 16 : o.marge;
    var vb = [f(mx - m), f(my - m), f(Mx - mx + 2 * m), f(My - my + 2 * m)];
    return '<svg class="iso' + (o.classe ? " " + o.classe : "") + '" viewBox="' + vb.join(" ") + '" role="img"' + (o.titre ? ' aria-label="' + esc(o.titre) + '"' : "") + ">" +
      (o.fond || "") + axes + corps + (o.avant || "") + reps + "</svg>";
  }

  /* Cote : ligne de mesure entre deux points 3D, décalée de `dec` (vecteur 3D), avec traits de rappel, flèches et texte. */
  function cote(a, b, txt, dec, k) {
    dec = dec || [0, 0, 0]; k = k || 1;
    var a2 = [a[0] + dec[0], a[1] + dec[1], a[2] + dec[2]], b2 = [b[0] + dec[0], b[1] + dec[1], b[2] + dec[2]];
    var A = P(a2[0], a2[1], a2[2]), Bp = P(b2[0], b2[1], b2[2]), dx = Bp[0] - A[0], dy = Bp[1] - A[1], n = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / n, uy = dy / n;
    function pointe(q, s) { return '<polygon class="iso-cote-p" points="' + f(q[0]) + "," + f(q[1]) + " " + f(q[0] + s * k * (ux * 7 - uy * 3)) + "," + f(q[1] + s * k * (uy * 7 + ux * 3)) + " " + f(q[0] + s * k * (ux * 7 + uy * 3)) + "," + f(q[1] + s * k * (uy * 7 - ux * 3)) + '"/>'; }
    var mxp = (A[0] + Bp[0]) / 2, myp = (A[1] + Bp[1]) / 2, ang = Math.atan2(dy, dx) * 180 / Math.PI;
    if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
    return '<g class="iso-cote">' + ligne(a, a2, "iso-rappel") + ligne(b, b2, "iso-rappel") +
      '<line x1="' + f(A[0]) + '" y1="' + f(A[1]) + '" x2="' + f(Bp[0]) + '" y2="' + f(Bp[1]) + '"/>' + pointe(A, 1) + pointe(Bp, -1) +
      '<text transform="translate(' + f(mxp) + " " + f(myp) + ") rotate(" + f(ang) + ')" y="' + f(-5 * k) + '"' + (k !== 1 ? ' style="font-size:' + f(11 * k) + 'px;stroke-width:' + f(3 * k) + 'px"' : "") + ">" + esc(txt) + "</text></g>";
  }
  /* Boîte qui englobe une cote (pour le cadrage). */
  function boiteDe(a, b, dec) {
    dec = dec || [0, 0, 0];
    var xs = [a[0], b[0], a[0] + dec[0], b[0] + dec[0]], ys = [a[1], b[1], a[1] + dec[1], b[1] + dec[1]], zs = [a[2], b[2], a[2] + dec[2], b[2] + dec[2]];
    var x = Math.min.apply(null, xs), y = Math.min.apply(null, ys), z = Math.min.apply(null, zs);
    return { x: x, y: y, z: z - 8, w: Math.max.apply(null, xs) - x, d: Math.max.apply(null, ys) - y, h: Math.max.apply(null, zs) - z + 16 };
  }

  window.IT_ISO = { cote: cote, boiteDe: boiteDe, P: P, pts: pts, boite: boite, rect: rect, cercle: cercle, ligne: ligne, cadre: cadre, scene: scene, decale: decale, centre: centre, esc: esc };
})();
