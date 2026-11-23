/* Atelier hardware — illustrations SVG 2,5D des pièces, du boîtier et des vues.
   Chaque dessin est écrit dans sa taille naturelle (w, h) puis ajusté à l'emplacement. */
(function () {
  "use strict";
  var F = {};      /* dessins : nom -> { w, h, fn(w, h, o) } */

  function R(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" ' + (extra || "") + "/>"; }
  function C(x, y, r, fill, extra) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" ' + (extra || "") + "/>"; }
  function T(x, y, size, txt, fill, extra) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" font-family="IBM Plex Mono, Consolas, monospace" ' + (extra || "") + ">" + txt + "</text>"; }
  function L(x1, y1, x2, y2, stroke, sw, extra) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + stroke + '" stroke-width="' + (sw || 1) + '" ' + (extra || "") + "/>"; }
  function def(id, w, h, fn) { F[id] = { w: w, h: h, fn: fn }; }

  /* Défs partagés (insérés une fois dans la page). */
  var DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    '<linearGradient id="g-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6D4CE"/><stop offset=".5" stop-color="#9C9A95"/><stop offset="1" stop-color="#C4C2BC"/></linearGradient>' +
    '<linearGradient id="g-metal-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8B6B0"/><stop offset=".45" stop-color="#E4E2DC"/><stop offset="1" stop-color="#8F8D88"/></linearGradient>' +
    '<linearGradient id="g-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4540"/><stop offset="1" stop-color="#1F1C19"/></linearGradient>' +
    '<linearGradient id="g-pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34402F"/><stop offset="1" stop-color="#1D261D"/></linearGradient>' +
    '<linearGradient id="g-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A7430"/><stop offset=".4" stop-color="#E7CE86"/><stop offset="1" stop-color="#8C6A2B"/></linearGradient>' +
    '<linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0D98C"/><stop offset="1" stop-color="#B58D36"/></linearGradient>' +
    '<linearGradient id="g-case" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A534B"/><stop offset="1" stop-color="#2F2B27"/></linearGradient>' +
    '<linearGradient id="g-tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A645C"/><stop offset="1" stop-color="#47423C"/></linearGradient>' +
    '<radialGradient id="g-hub" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#6B655E"/><stop offset="1" stop-color="#1E1B18"/></radialGradient>' +
    '<filter id="f-ombre" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".38"/></filter>' +
    "</defs></svg>";

  /* Ventilateur de face (80 × 80). */
  function fanFace(cx, cy, r, o) {
    var s = r / 33, g = '<g transform="translate(' + cx + " " + cy + ") scale(" + s + ')">';
    g += C(0, 0, 34, "#14110F");
    for (var i = 0; i < 7; i++) g += '<path transform="rotate(' + (i * 360 / 7) + ')" d="M0 0 C6 -12 16 -26 30 -26 C34 -16 24 -4 0 0 Z" fill="' + (o && o.pale ? "#3C3732" : "#2B2723") + '" stroke="#5B554E" stroke-width=".8"/>';
    g += C(0, 0, 10, "url(#g-hub)") + C(0, 0, 3, "#0C0A09");
    return g + "</g>";
  }

  /* ---- Accessoires ---- */
  function stud(cx, cy, r) {
    return C(cx + 2, cy + 3, r + 1, "rgba(0,0,0,.35)") +
      '<polygon points="' + [0, 1, 2, 3, 4, 5].map(function (k) { var a = Math.PI / 3 * k + Math.PI / 6; return (cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1); }).join(" ") + '" fill="url(#g-brass)" stroke="#6E5321" stroke-width="1"/>' +
      C(cx, cy, r * 0.45, "#2B2218") + C(cx - r * 0.15, cy - r * 0.15, r * 0.18, "rgba(255,255,255,.35)");
  }
  def("entretoises", 120, 60, function () {
    var g = "";
    for (var i = 0; i < 3; i++) {
      var cx = 24 + i * 36;
      g += '<ellipse cx="' + cx + '" cy="48" rx="14" ry="5" fill="rgba(0,0,0,.28)"/>' + R(cx - 10, 20, 20, 26, "url(#g-brass)", 'stroke="#6E5321"') +
        '<ellipse cx="' + cx + '" cy="20" rx="10" ry="4" fill="#EBD590" stroke="#6E5321"/><ellipse cx="' + cx + '" cy="20" rx="4.5" ry="1.8" fill="#2B2218"/>';
    }
    return g;
  });
  def("entretoises-s", 330, 330, function () {
    var pts = [[16, 16], [165, 16], [314, 16], [16, 314], [165, 314], [314, 314], [165, 165], [16, 165]], g = "";
    pts.forEach(function (p) { g += stud(p[0], p[1], 10); });
    return g;
  });
  def("cacheio", 120, 44, function () {
    var g = R(0, 0, 120, 44, "url(#g-metal)", 'rx="2" stroke="#6D6B66"');
    [[8, 7, 28, 30], [42, 7, 14, 14], [42, 24, 14, 13], [62, 7, 16, 30], [84, 7, 30, 12], [84, 24, 30, 13]].forEach(function (c) {
      g += R(c[0], c[1], c[2], c[3], "#17140F", 'rx="2" stroke="#55524D"');
    });
    for (var x = 4; x < 118; x += 6) g += L(x, 0, x + 3, 3, "#6D6B66", 1) + L(x, 44, x + 3, 41, "#6D6B66", 1);
    return g;
  });
  def("pate-i", 120, 36, function () {
    return R(4, 12, 24, 12, "#CFCBC2", 'rx="2" stroke="#6D6B66"') + R(26, 15, 6, 6, "#6D6B66") +
      R(32, 6, 64, 24, "rgba(220,220,216,.55)", 'rx="4" stroke="#6D6B66"') + R(35, 10, 54, 16, "#B9B6AF", 'rx="3"') +
      R(38, 12, 48, 3, "rgba(255,255,255,.55)", 'rx="1.5"') + R(96, 14, 14, 8, "#9C9A95", 'stroke="#6D6B66"') + R(108, 16, 10, 4, "#6D6B66", 'rx="2"');
  });
  def("pate-s", 36, 36, function () {
    return '<ellipse cx="18" cy="20" rx="13" ry="10" fill="rgba(0,0,0,.25)"/><ellipse cx="18" cy="17" rx="12" ry="9" fill="#BEBCB6" stroke="#8D8B85"/><ellipse cx="14" cy="13" rx="5" ry="2.5" fill="rgba(255,255,255,.7)"/>';
  });

  /* ---- Alimentation ---- */
  def("alim-i", 110, 80, function (w, h, o) {
    return '<polygon points="10,22 90,22 104,8 24,8" fill="#53504B"/><polygon points="90,22 104,8 104,62 90,76" fill="#2A2724"/>' +
      R(10, 22, 80, 54, "url(#g-dark)", 'rx="2"') + C(40, 49, 20, "#15120F", 'stroke="#5B554E"') + C(40, 49, 12, "none", 'stroke="#5B554E"') + C(40, 49, 4, "#0C0A09") +
      L(40, 29, 40, 69, "#3B3733", 1) + L(20, 49, 60, 49, "#3B3733", 1) + R(66, 54, 20, 14, "#C8A24A", 'rx="1"') + T(68, 64, 8, (o && o.label) || "", "#1B1713", 'font-weight="700"');
  });
  def("alim-s", 330, 80, function (w, h, o) {
    var g = R(0, 0, 330, 80, "url(#g-dark)", 'rx="5" stroke="#15120F"') + R(0, 66, 330, 14, "rgba(0,0,0,.3)", 'rx="5"');
    g += R(12, 12, 130, 52, "#C9C2B4", 'rx="3"') + T(20, 30, 11, "ALIMENTATION " + ((o && o.fmt) || "ATX"), "#1B1713", 'font-weight="700"') + T(20, 46, 14, (o && o.label) || "", "#9C3F1D", 'font-weight="700"') + T(80, 46, 9, "80+ Bronze", "#544A40");
    g += C(230, 40, 28, "#15120F", 'stroke="#5B554E"');
    for (var r = 8; r <= 24; r += 8) g += C(230, 40, r, "none", 'stroke="#5B554E"');
    g += L(230, 12, 230, 68, "#3B3733") + L(202, 40, 258, 40, "#3B3733");
    for (var k = 0; k < 4; k++) g += R(296, 14 + k * 11, 28, 6, "#0C0A09", 'rx="2"');
    return g;
  });

  /* ---- Ventilateurs ---- */
  def("fan-i", 80, 80, function () {
    return R(2, 4, 76, 76, "rgba(0,0,0,.25)", 'rx="9"') + R(2, 2, 76, 76, "url(#g-dark)", 'rx="8" stroke="#15120F"') +
      [[9, 9], [71, 9], [9, 71], [71, 71]].map(function (p) { return C(p[0], p[1], 3, "#0C0A09"); }).join("") + fanFace(40, 40, 33);
  });
  def("fan-s", 40, 112, function (w, h, o) {
    var g = R(0, 0, 40, 112, "url(#g-dark)", 'rx="5" stroke="#15120F"') + R(0, 0, 6, 112, "rgba(255,255,255,.12)", 'rx="3"');
    g += '<g transform="translate(22 56) scale(.34 1.04) translate(-40 -40)">' + fanFace(40, 40, 33, { pale: true }).replace("scale(1)", "") + "</g>";
    g += '<polygon points="30,100 38,94 38,106" fill="' + "#E3916A" + '"/>';
    return g;
  });

  /* ---- Carte mère ---- */
  def("board", 330, 330, function (w, h, o) {
    var mini = !!(o && o.dimm2);
    var g = R(0, 0, 330, 330, "url(#g-pcb)", 'rx="4" stroke="#0F140F" stroke-width="1.5"');
    /* pistes décoratives */
    for (var i = 0; i < 10; i++) g += L(150 + i * 3, 150, 150 + i * 3, 205, "rgba(255,255,255,.05)", 1);
    /* ports d'E/S */
    [[0, 8, 22, 14, "#3A4E6B"], [0, 26, 22, 14, "#2C2C2C"], [0, 44, 22, 14, "#5C7BA0"], [0, 62, 22, 14, "#5C7BA0"], [0, 80, 22, 14, "#2E86AB"], [0, 98, 22, 14, "#2E86AB"], [0, 116, 22, 12, "#9C9A95"]].forEach(function (p, k) {
      g += R(p[0], p[1] + 6, p[2], p[3], p[4], 'rx="1" stroke="#0C0A09"') + R(p[0] + 3, p[1] + 9, p[2] - 8, p[3] - 6, "#0C0A09");
    });
    /* radiateurs d'alimentation du processeur */
    g += R(40, 28, 150, 22, "url(#g-metal)", 'rx="2" stroke="#6D6B66"') + R(26, 56, 24, 100, "url(#g-metal)", 'rx="2" stroke="#6D6B66"');
    for (var f = 46; f < 188; f += 6) g += L(f, 30, f, 48, "rgba(0,0,0,.25)", 1);
    for (var f2 = 60; f2 < 154; f2 += 6) g += L(28, f2, 48, f2, "rgba(0,0,0,.25)", 1);
    /* socket */
    g += R(56, 56, 88, 88, "#D5D1C8", 'rx="3" stroke="#6D6B66"') + R(62, 62, 76, 76, "#1B1713", 'rx="2"');
    for (var a = 0; a < 9; a++) for (var b = 0; b < 9; b++) g += C(70 + a * 7.5, 70 + b * 7.5, 1.2, "#C8A24A");
    g += '<polygon points="56,144 66,144 56,134" fill="#E3916A"/>' + L(144, 70, 150, 70, "#6D6B66", 3);
    /* DIMM */
    for (var d = 0; d < 4; d++) if (!mini || d % 2) g += R(170 + d * 30, 30, 20, 120, "#14110F", 'rx="2" stroke="#4A4540"') + R(171 + d * 30, 28, 18, 4, "#E8E4DA") + R(171 + d * 30, 148, 18, 4, "#E8E4DA") + R(178 + d * 30, 36, 4, 108, "#2B2723");
    ["A1", "A2", "B1", "B2"].forEach(function (n, k) { if (!mini || k % 2) g += T(171 + k * 30, 166, 9, n, "#D9D4C8", 'class="lbl-zoom"'); });
    /* 24 broches */
    g += R(298, 170, 20, 100, "#E8E4DA", 'rx="2" stroke="#8D8B85"');
    for (var p = 0; p < 12; p++) g += R(302, 175 + p * 8, 5, 5, "#14110F") + R(310, 175 + p * 8, 5, 5, "#14110F");
    g += T(288, 283, 8, "ATX 24", "#D9D4C8", 'class="lbl-zoom"');
    /* EPS, CPU_FAN, SYS_FAN */
    g += R(40, 6, 80, 16, "#14110F", 'rx="2" stroke="#4A4540"')  +
      R(130, 6, 28, 14, "#E8E4DA", 'rx="2" stroke="#8D8B85"') + T(162, 17, 8, "CPU_FAN", "#D9D4C8", 'class="lbl-zoom"') +
      R(2, 146, 14, 30, "#E8E4DA", 'rx="2" stroke="#8D8B85"') + T(20, 164, 8, "SYS1", "#D9D4C8", 'class="lbl-zoom"') +
      R(230, 310, 30, 14, "#E8E4DA", 'rx="2" stroke="#8D8B85"') + T(230, 306, 8, "SYS2", "#D9D4C8", 'class="lbl-zoom"');
    /* M.2 */
    g += R(50, 190, 150, 18, "#0F140F", 'rx="2" stroke="#4A4540"') + R(46, 192, 6, 14, "url(#g-gold)") + C(204, 199, 4, "url(#g-metal)", 'stroke="#6D6B66"') + T(54, 226, 8, "M.2", "#D9D4C8", 'class="lbl-zoom"');
    /* chipset, PCIe, batterie */
    g += R(210, 215, 56, 34, "url(#g-metal)", 'rx="2" stroke="#6D6B66"');
    for (var c = 216; c < 262; c += 6) g += L(c, 217, c, 247, "rgba(0,0,0,.22)", 1);
    g += R(14, 272, 300, 12, "#14110F", 'rx="2" stroke="#4A4540"') + (mini ? "" : R(14, 296, 140, 10, "#14110F", 'rx="2" stroke="#4A4540"')) + T(18, 267, 8, "PCIe x16", "#D9D4C8", 'class="lbl-zoom"') +
      C(200, 296, 11, "url(#g-metal)", 'stroke="#6D6B66"') + C(200, 296, 6, "#B9B6AF");
    /* embases du bord bas */
    g += R(20, 312, 40, 14, "#E8E4DA", 'rx="1" stroke="#8D8B85"') + R(90, 306, 40, 18, "#4A6FA5", 'rx="1" stroke="#2C456B"') + R(160, 312, 50, 12, "#14110F", 'rx="1" stroke="#4A4540"') +
      T(20, 308, 8, "AUDIO", "#D9D4C8", 'class="lbl-zoom"') + T(90, 304, 8, "USB3", "#D9D4C8", 'class="lbl-zoom"') + T(160, 308, 8, "F_PANEL", "#D9D4C8", 'class="lbl-zoom"');
    /* SATA */
    for (var s = 0; s < 4; s++) g += R(286, 296 + (s % 2) * 11, 36, 8, "#14110F", 'rx="1" stroke="#4A4540"') + (s === 1 ? "" : "");
    g += T(278, 290, 8, "SATA", "#D9D4C8", 'class="lbl-zoom"');
    return g;
  });

  /* ---- Processeur, ventirad ---- */
  def("cpu", 70, 70, function (w, h, o) {
    return R(0, 0, 70, 70, "#2E4B3A", 'rx="4" stroke="#14110F"') + R(6, 6, 58, 58, "url(#g-metal)", 'rx="3" stroke="#6D6B66"') +
      R(11, 11, 48, 48, "rgba(255,255,255,.35)", 'rx="2"') + T(14, 34, 8.5, (o && o.label) || "CPU", "#1B1713", 'font-weight="700"') + T(14, 46, 7, (o && o.sub) || "", "#544A40") +
      '<polygon points="0,70 10,70 0,60" fill="#E7CE86"/>';
  });
  def("cooler-i", 90, 90, function () {
    var g = '<polygon points="8,18 70,18 84,6 22,6" fill="#BEBCB6"/><polygon points="70,18 84,6 84,64 70,76" fill="#7E7C77"/>' + R(8, 18, 62, 58, "url(#g-metal)", 'stroke="#6D6B66"');
    for (var x = 12; x < 68; x += 4) g += L(x, 20, x, 74, "rgba(0,0,0,.22)", 1);
    g += [[20, 12], [34, 12], [48, 12], [62, 12]].map(function (p) { return C(p[0], p[1], 3, "#B87333", 'stroke="#7A4A1F"'); }).join("") + R(0, 24, 8, 46, "url(#g-dark)", 'rx="2"');
    return g;
  });
  def("cooler-s", 120, 120, function () {
    var g = R(4, 6, 116, 114, "rgba(0,0,0,.28)", 'rx="8"') + R(0, 0, 116, 114, "url(#g-metal)", 'rx="8" stroke="#6D6B66"');
    for (var y = 8; y < 108; y += 4) g += L(6, y, 110, y, "rgba(0,0,0,.18)", 1);
    g += C(58, 57, 46, "#15120F", 'stroke="#5B554E" stroke-width="2"') + fanFace(58, 57, 42, { pale: true }) +
      [[22, 22], [94, 22], [22, 92], [94, 92]].map(function (p) { return C(p[0], p[1], 3.5, "#B87333", 'stroke="#7A4A1F"'); }).join("");
    return g;
  });

  /* ---- Mémoire ---- */
  def("dimm", 140, 26, function (w, h, o) {
    var ddr5 = o && o.ddr === "DDR5", nx = ddr5 ? 62 : 82, g = R(0, 0, 140, 22, "#17140F", 'rx="2" stroke="#4A4540"') +
      R(4, 2, 132, 16, "url(#g-metal)", 'rx="2" stroke="#6D6B66"');
    for (var x = 8; x < 132; x += 5) g += L(x, 3, x, 17, "rgba(0,0,0,.14)", 1);
    g += R(34, 5, 62, 10, "#E8E4DA", 'rx="1"') + T(38, 13, 7, (o && o.label) || "DDR", "#1B1713", 'font-weight="700"') + R(0, 21, 140, 5, "url(#g-gold)");
    for (var k = 2; k < 138; k += 3) g += L(k, 21, k, 26, "rgba(120,90,30,.5)", .8);
    return g + R(nx, 20, 3, 6, "#14110F");
  });
  def("dimm-s", 20, 120, function (w, h, o) {
    var g = R(1, 4, 20, 120, "rgba(0,0,0,.3)", 'rx="2"') + R(0, 0, 20, 120, "#17140F", 'rx="2" stroke="#4A4540"') + R(3, 6, 14, 108, "url(#g-metal-h)", 'rx="2" stroke="#6D6B66"');
    for (var y = 10; y < 112; y += 6) g += L(3, y, 17, y, "rgba(0,0,0,.2)", 1);
    g += R(0, 0, 20, 4, "#E8E4DA") + R(0, 116, 20, 4, "#E8E4DA") + R(5, 54, 10, 14, o && o.ddr === "DDR5" ? "#C98A7A" : "#7AA6C9", 'rx="1"') + T(7.5, 65, 9, o && o.ddr === "DDR5" ? "5" : "4", "#1B1713", 'font-weight="700"');
    return g;
  });

  /* ---- Stockage ---- */
  def("m2", 150, 22, function () {
    var g = R(0, 0, 150, 22, "#17140F", 'rx="2" stroke="#4A4540"') + R(0, 3, 10, 16, "url(#g-gold)") + R(24, 4, 28, 14, "#2B2723", 'rx="1" stroke="#5B554E"') +
      R(58, 4, 38, 14, "#26231F", 'rx="1" stroke="#5B554E"') + R(100, 4, 38, 14, "#26231F", 'rx="1" stroke="#5B554E"') + T(62, 14, 6, "NAND", "#9A8E7E");
    return g + '<path d="M150 6 a5 5 0 0 0 0 10 Z" fill="#6A645C"/>' + C(144, 11, 3.5, "url(#g-metal)", 'stroke="#6D6B66"');
  });
  def("sata-ssd", 110, 40, function (w, h, o) {
    return R(0, 0, 110, 40, "url(#g-metal)", 'rx="4" stroke="#6D6B66"') + R(8, 8, 74, 24, "#C9C2B4", 'rx="2"') + T(12, 20, 8, (o && o.t1) || "SSD 2,5″ SATA", "#1B1713", 'font-weight="700"') + T(12, 29, 8, (o && o.t2) || "500 Go", "#9C3F1D") +
      R(94, 8, 16, 24, "#14110F") + R(96, 12, 4, 6, "#C8A24A") + R(102, 12, 6, 6, "#C8A24A");
  });

  /* ---- Carte graphique ---- */
  def("gpu", 330, 52, function () {
    var g = R(0, 0, 330, 52, "rgba(0,0,0,.3)", 'rx="5" transform="translate(2 4)"') + R(0, 0, 330, 52, "url(#g-dark)", 'rx="5" stroke="#15120F"') + R(0, 0, 10, 52, "url(#g-metal)") +
      R(14, 4, 306, 4, "#E3916A") + L(16, 46, 316, 46, "#5B554E", 2);
    g += fanFace(96, 28, 20, { pale: true }) + fanFace(206, 28, 20, { pale: true }) + T(252, 32, 9, "GPU", "#9A8E7E", 'font-weight="700"');
    return g;
  });
  def("gpu-i", 140, 64, function () {
    var g = R(0, 6, 140, 52, "url(#g-dark)", 'rx="5" stroke="#15120F"') + R(0, 6, 8, 52, "url(#g-metal)") + R(12, 10, 120, 3, "#E3916A");
    return g + fanFace(46, 34, 17, { pale: true }) + fanFace(98, 34, 17, { pale: true });
  });

  /* ---- Câbles ---- */
  function plug(w, h, color, pins) {
    var g = R(0, 0, w, h, "#17140F", 'rx="2" stroke="#4A4540"');
    var vert = h > w, n = Math.max(2, Math.min(pins || 8, 24));
    if (vert) {
      var rows = Math.ceil(n / 2), step = (h - 8) / rows;
      for (var i = 0; i < rows; i++) g += R(w * 0.18, 5 + i * step, w * 0.26, Math.max(2, step - 2), "#8D8B85") + R(w * 0.56, 5 + i * step, w * 0.26, Math.max(2, step - 2), "#8D8B85");
      g += R(0, 0, w, 3, color);
    } else {
      var cols = Math.ceil(n / 2), st = (w - 8) / cols;
      for (var j = 0; j < cols; j++) g += R(5 + j * st, h * 0.18, Math.max(2, st - 2), h * 0.26, "#8D8B85") + R(5 + j * st, h * 0.56, Math.max(2, st - 2), h * 0.26, "#8D8B85");
      g += R(0, 0, 3, h, color);
    }
    return g;
  }
  def("plug", 30, 16, function (w, h, o) { return plug(w, h, (o && o.couleur) || "#999", o && o.pins); });
  def("cable-i", 110, 40, function (w, h, o) {
    var c = (o && o.couleur) || "#999";
    return '<path d="M4 30 C20 4 34 4 46 20 S70 36 78 20" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="6" stroke-linecap="round" transform="translate(1 2)"/>' +
      '<path d="M4 30 C20 4 34 4 46 20 S70 36 78 20" fill="none" stroke="#2B2723" stroke-width="5" stroke-linecap="round"/><path d="M4 30 C20 4 34 4 46 20 S70 36 78 20" fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 5"/>' +
      '<g transform="translate(76 9)">' + plug(32, 22, c, 8) + "</g>";
  });

  /* ---------- Ajustement dans un emplacement ---------- */
  function fit(id, x, y, w, h, o) {
    var d = F[id];
    if (!d) return "";
    var rot = (w < h) !== (d.w < d.h) && Math.abs(w - h) > 4 && d.w !== d.h;
    var tr = rot ? "translate(" + (x + w) + " " + y + ") rotate(90) scale(" + (h / d.w).toFixed(4) + " " + (w / d.h).toFixed(4) + ")"
      : "translate(" + x + " " + y + ") scale(" + (w / d.w).toFixed(4) + " " + (h / d.h).toFixed(4) + ")";
    return '<g transform="' + tr + '">' + d.fn(d.w, d.h, o || {}) + "</g>";
  }
  function icone(piece) {
    var d = F[piece.art.icon], s = Math.min(84 / d.w, 54 / d.h), w = d.w * s, h = d.h * s;
    return '<svg viewBox="0 0 ' + d.w + " " + d.h + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" aria-hidden="true" focusable="false">' + d.fn(d.w, d.h, piece.o || {}) + "</svg>";
  }
  function pieceScene(piece, x, y, w, h) { return fit(piece.art.scene, x, y, w, h, piece.o); }

  /* ---------- Fonds de scène ---------- */
  function coteFond() {
    var g = R(10, 10, 840, 600, "url(#g-case)", 'rx="16" stroke="#15120F" stroke-width="2"');
    g += R(46, 28, 770, 566, "url(#g-tray)", 'rx="6" stroke="#2B2723"');
    for (var x = 70; x < 800; x += 34) for (var y = 52; y < 590; y += 34) g += C(x, y, 1.6, "rgba(0,0,0,.28)");
    /* ouvertures de passage de câbles */
    g += R(460, 200, 40, 90, "rgba(0,0,0,.35)", 'rx="10"') + R(460, 320, 40, 70, "rgba(0,0,0,.35)", 'rx="10"') + R(400, 495, 120, 14, "rgba(0,0,0,.3)", 'rx="7"');
    /* fentes PCIe à l'arrière */
    for (var s = 0; s < 4; s++) g += R(50, 396 + s * 26, 20, 14, "rgba(0,0,0,.4)", 'rx="2"');
    /* grille avant */
    g += R(812, 20, 30, 580, "rgba(0,0,0,.35)", 'rx="4"');
    g += T(18, 330, 12, "ARRIÈRE", "#BBAF9F", 'transform="rotate(-90 18 330)" text-anchor="middle" letter-spacing="3"') +
      T(842, 330, 12, "AVANT", "#BBAF9F", 'transform="rotate(90 842 330)" text-anchor="middle" letter-spacing="3"');
    return g;
  }

  function faceVue(st, onFaite) {
    var g = R(40, 16, 340, 580, "url(#g-case)", 'rx="12" stroke="#15120F" stroke-width="2"') + R(58, 100, 304, 480, "#17140F", 'rx="6"');
    for (var y = 112; y < 570; y += 10) g += L(66, y, 354, y, "#2B2723", 3);
    for (var x = 74; x < 354; x += 10) g += L(x, 106, x, 574, "#2B2723", 3);
    if (st.placed["fan-front"]) g += fanFace(210, 290, 105, { pale: true }).replace('<g transform', '<g opacity=".55" transform');
    /* panneau d'E/S */
    g += R(58, 36, 304, 50, "#1F1C19", 'rx="4" stroke="#4A4540"') + R(76, 52, 30, 14, "#4A6FA5", 'rx="1"') + R(112, 52, 30, 14, "#4A6FA5", 'rx="1"') +
      C(168, 59, 6, "#14110F", 'stroke="#8D8B85"') + C(190, 59, 6, "#14110F", 'stroke="#8D8B85"') +
      C(252, 59, 4, st.etatPost === "ok" ? "#94B98C" : (st.etatPost ? "#E88D79" : "#3B3733"), 'id="led-pwr"') + T(236, 80, 7, "PWR", "#BBAF9F");
    g += '<g data-bouton="power" style="cursor:pointer" role="button" tabindex="-1" aria-label="Bouton marche">' + C(318, 61, 22, "url(#g-metal)", 'stroke="#15120F" stroke-width="2"') + C(318, 61, 15, "none", 'stroke="#6D6B66" stroke-width="2"') +
      '<path d="M318 49 v11 M311 53 a9 9 0 1 0 14 0" fill="none" stroke="#1B1713" stroke-width="2.4" stroke-linecap="round"/></g>';
    g += T(60, 112, 10, "AVANT", "#BBAF9F", 'letter-spacing="3"');
    return g;
  }

  function arriereVue(st) {
    var pl = st.placed, g = R(40, 16, 340, 580, "url(#g-case)", 'rx="12" stroke="#15120F" stroke-width="2"');
    /* ventilateur arrière */
    g += R(232, 44, 124, 124, "#17140F", 'rx="8" stroke="#4A4540"');
    if (pl["fan-rear"]) g += fanFace(294, 106, 55, { pale: true });
    else for (var y = 52; y < 160; y += 8) g += L(240, y, 348, y, "#2B2723", 3);
    /* cache I/O et ports */
    g += R(60, 44, 160, 130, pl["ioshield"] ? "url(#g-metal)" : "#17140F", 'rx="3" stroke="#6D6B66"');
    if (pl["ioshield"]) {
      g += R(70, 54, 140, 110, "#17140F", 'rx="3"');
      if (pl["board"]) {
        g += R(78, 62, 40, 24, "#2C2C2C", 'rx="2" stroke="#6D6B66"') + R(78, 90, 40, 24, "#3A4E6B", 'rx="2" stroke="#6D6B66"') + T(82, 78, 8, "HDMI", "#D9D4C8") + T(82, 106, 8, "DP", "#D9D4C8") +
          [0, 1].map(function (i) { return R(130 + i * 36, 62, 30, 20, "#5C7BA0", 'rx="1" stroke="#0C0A09"'); }).join("") + [0, 1].map(function (i) { return R(130 + i * 36, 90, 30, 20, "#2E86AB", 'rx="1" stroke="#0C0A09"'); }).join("") +
          R(78, 120, 50, 36, "#9C9A95", 'rx="2" stroke="#0C0A09"') + T(86, 142, 8, "LAN", "#1B1713") + [0, 1, 2].map(function (i) { return C(150 + i * 22, 138, 7, "#4AA064", 'stroke="#0C0A09"'); }).join("");
      }
    } else g += T(76, 114, 10, "ouverture vide", "#9A8E7E");
    /* emplacements d'extension */
    for (var s = 0; s < 4; s++) g += R(60, 188 + s * 24, 160, 14, pl["gpu"] && s < 2 ? "#9C9A95" : "#17140F", 'rx="2" stroke="#4A4540"');
    if (pl["gpu"]) g += R(62, 190, 156, 10, "#6D6B66") + R(80, 220, 44, 20, "#3A4E6B", 'rx="2"') + T(84, 234, 8, "HDMI", "#D9D4C8") + R(130, 220, 44, 20, "#2C2C2C", 'rx="2"');
    /* alimentation */
    g += R(60, 408, 300, 160, "url(#g-dark)", 'rx="6" stroke="#15120F"') + C(300, 488, 56, "#15120F", 'stroke="#5B554E" stroke-width="2"');
    for (var r = 14; r <= 50; r += 12) g += C(300, 488, r, "none", 'stroke="#5B554E"');
    g += L(300, 436, 300, 540, "#3B3733") + L(246, 488, 354, 488, "#3B3733");
    if (!pl["psu"]) g += R(60, 408, 300, 160, "rgba(0,0,0,.55)", 'rx="6"') + T(130, 494, 11, "pas d'alimentation", "#BBAF9F");
    else {
      g += R(88, 440, 80, 56, "#17140F", 'rx="3" stroke="#6D6B66"') + R(98, 456, 60, 24, "#0C0A09", 'rx="2"') + T(96, 434, 8, "SECTEUR", "#BBAF9F");
      g += '<g data-bouton="switch" style="cursor:pointer" role="button" aria-label="Interrupteur de l\'alimentation">' + R(176, 450, 48, 40, "#17140F", 'rx="4" stroke="#6D6B66" stroke-width="2"') +
        R(st.switchOn ? 200 : 180, 454, 20, 32, st.switchOn ? "#94B98C" : "#E88D79", 'rx="3"') + T(182, 446, 9, "O", "#BBAF9F") + T(208, 446, 9, "I", "#BBAF9F") + "</g>";
    }
    return g + T(60, 36, 10, "ARRIÈRE", "#BBAF9F", 'letter-spacing="3"');
  }

  window.IT_ATELIER_ART = { DEFS: DEFS, fit: fit, icone: icone, pieceScene: pieceScene, coteFond: coteFond, faceVue: faceVue, arriereVue: arriereVue, fanFace: fanFace };
})();
