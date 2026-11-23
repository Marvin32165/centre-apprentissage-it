/* Atelier « Le Livre du montage » : table des matières (avec pages calculées et coches) et index
   des pièces et des pannes, générés depuis les données de l'atelier. */
(function () {
  "use strict";
  var ROM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function afficher() {
    var store = window.IT && window.IT.store, A = window.IT_ATELIER, Art = window.IT_ATELIER_ART;
    if (!store || !A) return;
    function fait(u) { return store.get("done." + u) === "1"; }
    function score(k) { var v = parseInt(store.get("score." + k), 10); return isNaN(v) ? null : v; }

    var g = document.querySelector("[data-gravure]");
    if (g && Art) g.innerHTML = Art.DEFS + '<svg viewBox="-40 -40 80 80" width="180" height="180" class="at-svg">' + Art.fanFace(0, 0, 36) + '<circle r="39" fill="none" stroke="#1B1713" stroke-width="1.2"/></svg>';

    var ordre = ["bureautique-intel", "salle-info", "gamer-amd", "station", "mini-itx", "mise-a-niveau"];
    var page = 3;
    var tdm = document.querySelector("[data-tdm]");
    if (tdm) {
      tdm.textContent = "";
      function partie(titre) { tdm.appendChild(el("p", { "class": "tdm-partie" }, titre)); var ol = el("ol", { "class": "toc-livre" }); tdm.appendChild(ol); return ol; }
      function ligne(ol, num, titre, href, pg, ok, extra) {
        var li = el("li");
        var a = el("a", { href: href });
        a.appendChild(el("span", { "class": "toc-num" }, num));
        a.appendChild(el("span", { "class": "toc-t" }, titre));
        a.appendChild(el("span", { "class": "toc-pts", "aria-hidden": "true" }));
        a.appendChild(el("span", { "class": "toc-p" }, String(pg)));
        if (ok) a.appendChild(el("span", { "class": "toc-ok", "aria-label": "fait" }, "✓"));
        li.appendChild(a);
        if (extra) li.appendChild(extra);
        ol.appendChild(li);
      }
      var p1 = partie("Première partie · Les montages");
      ordre.forEach(function (id, i) {
        var sc = A.scenarios[id];
        if (!sc) return;
        var s = score(id);
        var t = el("a", { "class": "toc-test", href: "montage.html?s=" + id + "&m=test", "aria-label": sc.titre + " en test noté" }, "test" + (s != null ? " · " + s : ""));
        ligne(p1, ROM[i + 1] + ".", sc.titre, "montage.html?s=" + id, page, fait(sc.unite), t);
        page += 2 + 2 * (sc.etapes || []).length;
      });
      var p2 = partie("Deuxième partie · Les pannes");
      var nP = Object.keys(A.pannes || {}).length;
      ligne(p2, "VII.", "Observations : " + nP + " dossiers de pannes", "pannes.html", page, fait("atelier-pannes"));
      page += 2 * nP;
      var p3 = partie("Troisième partie · Les épreuves");
      var s1 = score("evaluation"), s2 = score("pannes-eval");
      ligne(p3, "VIII.", "Épreuve des montages" + (s1 != null ? " (" + s1 + " / 100)" : ""), "evaluation.html", page, fait("atelier-eval"));
      page += 8;
      ligne(p3, "IX.", "Épreuve des pannes" + (s2 != null ? " (" + s2 + " / 100)" : ""), "pannes-eval.html", page, fait("atelier-pannes-eval"));
      page += 10;
      var p4 = partie("En fin de volume");
      ligne(p4, "", "Index des pièces et des pannes", "#index", page, false);
    }
    var f1 = document.querySelector("[data-folio-index]"), f2 = document.querySelector("[data-folio-index2]");
    if (f1) f1.textContent = String(page);
    if (f2) f2.textContent = String(page + 1);

    /* Index des pièces : nom → chapitres dont l'inventaire la contient */
    var ip = document.querySelector("[data-index-pieces]");
    if (ip && A.pieces) {
      var parNom = {};
      Object.keys(A.pieces).forEach(function (pid) {
        var nom = A.pieces[pid].nom.replace(/\s*\(\d+\)$/, "");
        var ch = [];
        ordre.forEach(function (id, i) { var sc = A.scenarios[id]; if (sc && (sc.inventaire || []).indexOf(pid) >= 0) ch.push(i + 1); });
        if (!ch.length) return;
        parNom[nom] = (parNom[nom] || []).concat(ch).filter(function (v, k, a) { return a.indexOf(v) === k; }).sort(function (a, b) { return a - b; });
      });
      var noms = Object.keys(parNom).sort(function (a, b) { return a.localeCompare(b, "fr"); });
      var dl = el("ul", { "class": "index-liste" });
      var lettre = "";
      noms.forEach(function (n) {
        var L = n.charAt(0).toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        if (L !== lettre) { lettre = L; dl.appendChild(el("li", { "class": "index-lettre", "aria-hidden": "true" }, L)); }
        var li = el("li");
        li.appendChild(el("span", null, n));
        var refs = el("span", { "class": "index-refs" });
        parNom[n].forEach(function (c, k) {
          if (k) refs.appendChild(document.createTextNode(", "));
          refs.appendChild(el("a", { href: "montage.html?s=" + ordre[c - 1], "aria-label": "chapitre " + c + " : " + A.scenarios[ordre[c - 1]].titre }, ROM[c]));
        });
        li.appendChild(refs);
        dl.appendChild(li);
      });
      ip.appendChild(dl);
    }
    /* Index des pannes : titre du dossier et cause */
    var ipn = document.querySelector("[data-index-pannes]");
    if (ipn && A.pannes) {
      var causes = {};
      (A.pannesCauses || []).forEach(function (c) { causes[c.id] = c.nom; });
      var items = Object.keys(A.pannes).map(function (id, i) { return { id: id, n: i + 1, t: A.pannes[id].titre, c: causes[A.pannes[id].cause] || "" }; });
      items.sort(function (a, b) { return a.c.localeCompare(b.c, "fr"); });
      var ul = el("ul", { "class": "index-liste pannes" });
      items.forEach(function (x) {
        var li = el("li");
        li.appendChild(el("span", null, x.c));
        var a = el("a", { href: "pannes.html?p=" + x.id }, "dossier " + x.n);
        a.setAttribute("aria-label", x.c + " : dossier " + x.n + ", " + x.t);
        var r = el("span", { "class": "index-refs" }); r.appendChild(a);
        li.appendChild(r);
        li.appendChild(el("span", { "class": "index-sous" }, "« " + x.t + " »"));
        ul.appendChild(li);
      });
      ipn.appendChild(ul);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", afficher); else afficher();
})();
