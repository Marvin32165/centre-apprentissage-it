/* Modules et thèmes : catalogue filtrable, en-tête et suite d'un module, page des thèmes.
   Lit window.IT_MODULES (assets/modules.js). Aucun fetch : marche aussi en file://. */
(function () {
  "use strict";
  var D = window.IT_MODULES;
  if (!D) return;
  var root = document.body.getAttribute("data-root") || "";
  var store = window.IT && window.IT.store;

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function norm(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function parId(liste, id) { for (var i = 0; i < liste.length; i++) if (String(liste[i].id) === String(id)) return liste[i]; return null; }
  function mod(id) { return parId(D.modules, id); }
  function dom(id) { return parId(D.domaines, id); }
  function niv(n) { var x = parId(D.niveaux, n); return x ? x.titre : "Niveau " + n; }
  function fait(m) { return !!store && store.get("done.module-" + m.id) === "1"; }
  function duree(min) {
    var h = Math.floor(min / 60), r = min % 60;
    return h ? "≈ " + h + " h" + (r ? " " + (r < 10 ? "0" : "") + r : "") : "≈ " + min + " min";
  }
  function lien(m, ancre) { return root + "modules/" + m.id + ".html" + (ancre || ""); }

  /* ---------- Catalogue : modules/index.html ---------- */
  function catalogue(box) {
    var qs = {};
    try { (location.search || "").replace(/^\?/, "").split("&").forEach(function (p) { if (!p) return; var kv = p.split("="); qs[kv[0]] = decodeURIComponent((kv[1] || "").replace(/\+/g, " ")); }); } catch (e) { /* ignoré */ }

    var form = el("form", { "class": "filtres", role: "search", "aria-label": "Rechercher dans les modules" });
    form.addEventListener("submit", function (e) { e.preventDefault(); });

    function champ(id, libelle, ctrl) {
      var w = el("div", { "class": "champ" });
      w.appendChild(el("label", { "for": id }, libelle));
      w.appendChild(ctrl);
      form.appendChild(w);
      return ctrl;
    }
    var q = champ("f-q", "Recherche", el("input", { id: "f-q", type: "search", placeholder: "Mot-clé : dns, kerberos, sfc…", autocomplete: "off" }));
    var sd = el("select", { id: "f-d" });
    sd.appendChild(el("option", { value: "" }, "Tous les domaines"));
    var utilises = {};
    D.modules.forEach(function (m) { utilises[m.domaine] = true; });
    D.domaines.forEach(function (d) { if (utilises[d.id]) sd.appendChild(el("option", { value: d.id }, d.titre)); });
    champ("f-d", "Domaine", sd);
    var sn = el("select", { id: "f-n" });
    sn.appendChild(el("option", { value: "" }, "Tous les niveaux"));
    D.niveaux.forEach(function (n) { sn.appendChild(el("option", { value: String(n.id) }, n.titre)); });
    champ("f-n", "Niveau", sn);
    var ss = el("select", { id: "f-s" });
    [["", "Tous"], ["afaire", "À faire"], ["fait", "Terminés"]].forEach(function (o) { ss.appendChild(el("option", { value: o[0] }, o[1])); });
    champ("f-s", "Progression", ss);

    var bas = el("div", { "class": "filtres-bas" });
    var compte = el("p", { "class": "compte", "aria-live": "polite" });
    var raz = el("button", { type: "button", "class": "btn ghost" }, "Tout afficher");
    bas.appendChild(compte);
    bas.appendChild(raz);
    form.appendChild(bas);

    var liste = el("div", { "class": "grid cols-2 mod-liste" });
    box.textContent = "";
    box.appendChild(form);
    box.appendChild(liste);

    if (qs.q) q.value = qs.q;
    if (qs.domaine && dom(qs.domaine)) sd.value = qs.domaine;
    if (qs.niveau && parId(D.niveaux, qs.niveau)) sn.value = qs.niveau;

    function texte(m) {
      var d = dom(m.domaine);
      return norm([m.titre, m.resume, (m.tags || []).join(" "), d ? d.titre : ""].join(" "));
    }
    function carte(m) {
      var a = el("a", { "class": "card mod-card", href: m.id + ".html" });
      var d = dom(m.domaine);
      var meta = el("p", { "class": "mod-meta" });
      [d ? d.titre : m.domaine, niv(m.niveau), duree(m.duree)].forEach(function (t, i) {
        if (i) meta.appendChild(el("span", { "aria-hidden": "true" }, " · "));
        meta.appendChild(el("span", null, t));
      });
      a.appendChild(meta);
      a.appendChild(el("h3", null, m.titre));
      a.appendChild(el("p", null, m.resume));
      var pre = el("p", { "class": "mod-pre" });
      if (m.prerequis.length) {
        pre.appendChild(el("strong", null, "Prérequis : "));
        pre.appendChild(document.createTextNode(m.prerequis.map(function (id) { var p = mod(id); return p ? p.titre.split(" : ")[0] : id; }).join(", ")));
      } else {
        pre.appendChild(el("strong", null, "Prérequis : "));
        pre.appendChild(document.createTextNode("aucun module"));
      }
      a.appendChild(pre);
      var etat = el("p", { "class": "mod-etat" });
      if (fait(m)) { etat.className = "mod-etat fait"; etat.textContent = "✓ terminé"; } else { etat.textContent = "À faire"; }
      a.appendChild(etat);
      return a;
    }
    function filtrer() {
      var mots = norm(q.value).split(/\s+/).filter(Boolean);
      var res = D.modules.filter(function (m) {
        if (sd.value && m.domaine !== sd.value) return false;
        if (sn.value && String(m.niveau) !== sn.value) return false;
        if (ss.value === "fait" && !fait(m)) return false;
        if (ss.value === "afaire" && fait(m)) return false;
        var t = texte(m);
        return mots.every(function (w) { return t.indexOf(w) >= 0; });
      });
      liste.textContent = "";
      res.forEach(function (m) { liste.appendChild(carte(m)); });
      var aucun = !res.length;
      compte.textContent = aucun ? "Aucun module ne correspond." : res.length + " module" + (res.length > 1 ? "s" : "") + " sur " + D.modules.length;
      if (aucun) liste.appendChild(el("p", { "class": "mod-vide" }, "Essaie un autre mot-clé, ou affiche tous les modules."));
      var actif = !!(q.value || sd.value || sn.value || ss.value);
      raz.hidden = !actif;
    }
    [q, sd, sn, ss].forEach(function (c) { c.addEventListener("input", filtrer); c.addEventListener("change", filtrer); });
    raz.addEventListener("click", function () { q.value = ""; sd.value = ""; sn.value = ""; ss.value = ""; filtrer(); q.focus(); });
    filtrer();
  }

  /* ---------- En-tête d'un module : <div data-module-meta="id"> ---------- */
  function entete(box) {
    var m = mod(box.getAttribute("data-module-meta"));
    if (!m) return;
    var d = dom(m.domaine);
    var dl = el("dl", { "class": "specs", "aria-label": "Fiche du module" });
    function ligne(t, contenu) {
      var w = el("div");
      w.appendChild(el("dt", null, t));
      var dd = el("dd");
      if (typeof contenu === "string") dd.textContent = contenu; else dd.appendChild(contenu);
      w.appendChild(dd);
      dl.appendChild(w);
    }
    ligne("Domaine", d ? d.titre : m.domaine);
    ligne("Niveau", niv(m.niveau));
    ligne("Durée", duree(m.duree));
    var pre;
    if (m.prerequis.length) {
      pre = el("span");
      m.prerequis.forEach(function (id, i) {
        var p = mod(id); if (!p) return;
        if (i) pre.appendChild(document.createTextNode(", "));
        pre.appendChild(el("a", { href: p.id + ".html" }, p.titre.split(" : ")[0]));
      });
    } else pre = "Aucun module";
    ligne("Prérequis", pre);
    box.textContent = "";
    box.appendChild(dl);
    if (m.prepa && m.prepa.length) {
      var p = el("p", { "class": "mod-prepa" });
      p.appendChild(el("strong", null, "Approfondit la prépa stage : "));
      m.prepa.forEach(function (l, i) {
        if (i) p.appendChild(document.createTextNode(" · "));
        p.appendChild(el("a", { href: root + l.href }, l.label));
      });
      p.appendChild(document.createTextNode(". Ce module ne recopie pas ces jours : il va plus loin."));
      box.appendChild(p);
    }
  }

  /* ---------- Suite d'un module : <div data-module-suite="id"> ---------- */
  function suite(box) {
    var m = mod(box.getAttribute("data-module-suite"));
    if (!m) return;
    var ids = [];
    (m.suite || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
    D.modules.forEach(function (x) { if (x.prerequis.indexOf(m.id) >= 0 && ids.indexOf(x.id) < 0) ids.push(x.id); });
    var nav = el("nav", { "class": "jours-nav", "aria-label": "Suite" });
    nav.appendChild(el("a", { "class": "btn ghost", href: "index.html" }, "← Tous les modules"));
    ids.forEach(function (id) {
      var s = mod(id);
      if (s) nav.appendChild(el("a", { "class": "btn ghost", href: s.id + ".html" }, "Ensuite : " + s.titre.split(" : ")[0] + " →"));
    });
    box.textContent = "";
    box.appendChild(nav);
  }

  /* ---------- Thèmes : themes.html (<div id="themes-liste">) ---------- */
  function themes(box) {
    box.textContent = "";
    D.domaines.forEach(function (d, i) {
      var s = el("section", { "class": "bloc theme", id: d.id });
      s.appendChild(el("p", { "class": "theme-num" }, "Domaine " + (i < 9 ? "0" : "") + (i + 1)));
      s.appendChild(el("h2", null, d.titre));
      s.appendChild(el("p", null, d.desc));
      var mods = D.modules.filter(function (m) { return m.domaine === d.id; });
      if (mods.length) {
        s.appendChild(el("h3", null, "Modules disponibles"));
        var ul = el("ul", { "class": "theme-modules" });
        mods.forEach(function (m) {
          var li = el("li");
          li.appendChild(el("a", { href: lien(m) }, m.titre));
          li.appendChild(el("span", { "class": "duree" }, niv(m.niveau).split(" · ")[0] + " · " + duree(m.duree)));
          if (fait(m)) li.appendChild(el("span", { "class": "fait" }, "✓ terminé"));
          ul.appendChild(li);
        });
        s.appendChild(ul);
        s.appendChild(el("p", { "class": "theme-tout" })).appendChild(el("a", { href: root + "modules/index.html?domaine=" + d.id }, "Voir ce domaine dans le catalogue"));
      }
      if (d.liens && d.liens.length) {
        s.appendChild(el("h3", null, "Ailleurs sur le site"));
        var ul2 = el("ul");
        d.liens.forEach(function (l) { var li = el("li"); li.appendChild(el("a", { href: root + l.href }, l.label)); ul2.appendChild(li); });
        s.appendChild(ul2);
      }
      if (d.aVenir && d.aVenir.length) {
        s.appendChild(el("h3", null, "À venir"));
        var ul3 = el("ul", { "class": "a-venir" });
        d.aVenir.forEach(function (t) { ul3.appendChild(el("li", null, t)); });
        s.appendChild(ul3);
      }
      box.appendChild(s);
    });
  }

  function init() {
    store = window.IT && window.IT.store;
    var c = document.getElementById("catalogue"); if (c) catalogue(c);
    Array.prototype.forEach.call(document.querySelectorAll("[data-module-meta]"), entete);
    Array.prototype.forEach.call(document.querySelectorAll("[data-module-suite]"), suite);
    var t = document.getElementById("themes-liste"); if (t) themes(t);
  }
  /* app.js (defer) est chargé avant ce script : window.IT est prêt au DOMContentLoaded. */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
