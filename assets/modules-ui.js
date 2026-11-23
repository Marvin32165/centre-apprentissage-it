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

  function jauge(n) {
    var j = el("span", { "class": "jauge", role: "img", "aria-label": "Niveau " + n + " sur 3" });
    [1, 2, 3].forEach(function (k) { j.appendChild(el("span", { "class": k <= n ? "on" : "" })); });
    return j;
  }
  function court(m) { return m.titre.split(" : ")[0]; }

  /* ---------- Parcours conseillé : <div data-parcours> (généré depuis prerequis et suite) ---------- */
  function parcours(box) {
    var aretes = [];
    function existe(a, b) { return aretes.some(function (x) { return x.de === a && x.vers === b; }); }
    D.modules.forEach(function (m) { m.prerequis.forEach(function (p) { if (mod(p) && !existe(p, m.id)) aretes.push({ de: p, vers: m.id, plein: true }); }); });
    D.modules.forEach(function (m) { (m.suite || []).forEach(function (s) { if (mod(s) && !existe(m.id, s)) aretes.push({ de: m.id, vers: s, plein: false }); }); });
    if (!aretes.length) { box.hidden = true; return; }
    box.textContent = "";
    box.appendChild(el("p", { "class": "label" }, "Parcours conseillé"));
    var cibles = [];
    aretes.forEach(function (x) { if (cibles.indexOf(x.vers) < 0) cibles.push(x.vers); });
    cibles.forEach(function (c) {
      var entrantes = aretes.filter(function (x) { return x.vers === c; });
      var g = el("div", { "class": "parcours-grille" });
      entrantes.forEach(function (x, i) {
        var de = mod(x.de);
        var a = el("a", { "class": "parcours-mod", href: de.id + ".html" }, court(de));
        a.style.gridRow = String(i + 1);
        g.appendChild(a);
        var f = el("span", { "class": "parcours-fleche" + (x.plein ? "" : " suite"), "aria-label": x.plein ? "est un prérequis de" : "se poursuit avec" });
        f.innerHTML = '<svg viewBox="0 0 30 14" width="30" height="14" aria-hidden="true" focusable="false"><path d="M2 7h24M20 2l6 5-6 5" fill="none" stroke="currentColor" stroke-width="1.6"' + (x.plein ? "" : ' stroke-dasharray="3 3"') + "/></svg>";
        f.style.gridRow = String(i + 1);
        g.appendChild(f);
      });
      var cm = mod(c);
      var t = el("a", { "class": "parcours-mod cible", href: cm.id + ".html" }, court(cm));
      t.style.gridRow = "1 / span " + entrantes.length;
      g.appendChild(t);
      box.appendChild(g);
    });
    box.appendChild(el("p", { "class": "parcours-legende" }, "Trait plein : prérequis · pointillé : suite conseillée"));
  }

  /* ---------- Catalogue : modules/index.html ---------- */
  function catalogue(box) {
    var qs = {};
    try { (location.search || "").replace(/^\?/, "").split("&").forEach(function (p) { if (!p) return; var kv = p.split("="); qs[kv[0]] = decodeURIComponent((kv[1] || "").replace(/\+/g, " ")); }); } catch (e) { /* ignoré */ }
    var k = document.querySelector("[data-modules-kicker]");
    if (k) k.textContent = "Modules · " + D.modules.length + " disponible" + (D.modules.length > 1 ? "s" : "");

    var form = el("form", { "class": "filtres", role: "search", "aria-label": "Rechercher dans les modules" });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    var lab = el("label", { "class": "filtre-q" });
    lab.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    lab.appendChild(el("span", { "class": "sr-only" }, "Rechercher un module"));
    var q = el("input", { type: "search", placeholder: "Mot-clé : dns, kerberos, sfc…", autocomplete: "off" });
    lab.appendChild(q);
    form.appendChild(lab);
    var puces = el("div", { "class": "puces", role: "group", "aria-label": "Domaine" });
    var utilises = {};
    D.modules.forEach(function (m) { utilises[m.domaine] = true; });
    var choix = [{ id: "", titre: "Tous" }].concat(D.domaines.filter(function (d) { return utilises[d.id]; }));
    var domaine = qs.domaine && dom(qs.domaine) && utilises[qs.domaine] ? qs.domaine : "";
    var boutons = choix.map(function (d) {
      var b = el("button", { type: "button", "class": "puce", "aria-pressed": String(d.id === domaine) }, d.titre);
      b.addEventListener("click", function () { domaine = d.id; boutons.forEach(function (x, i) { x.setAttribute("aria-pressed", String(choix[i].id === domaine)); }); filtrer(); });
      puces.appendChild(b);
      return b;
    });
    form.appendChild(puces);
    var compte = el("p", { "class": "compte", "aria-live": "polite" });
    var liste = el("div", { "class": "mod-liste" });
    box.textContent = "";
    box.appendChild(form);
    box.appendChild(compte);
    box.appendChild(liste);
    if (qs.q) q.value = qs.q;

    function texte(m) {
      var d = dom(m.domaine);
      return norm([m.titre, m.resume, (m.tags || []).join(" "), d ? d.titre : ""].join(" "));
    }
    function carte(m) {
      var a = el("a", { "class": "card mod-card", href: m.id + ".html" });
      var g = el("div", { "class": "mod-gauche" });
      g.appendChild(jauge(m.niveau));
      g.appendChild(el("span", { "class": "mod-niv" }, "Niv. " + m.niveau));
      g.appendChild(el("span", { "class": "mod-duree" }, duree(m.duree)));
      if (fait(m)) g.appendChild(el("span", { "class": "fait" }, "✓ fait"));
      a.appendChild(g);
      var dr = el("div", { "class": "mod-droite" });
      var d = dom(m.domaine);
      dr.appendChild(el("p", { "class": "kicker" }, d ? d.titre : m.domaine));
      dr.appendChild(el("h2", { "class": "mod-titre" }, m.titre));
      dr.appendChild(el("p", { "class": "mod-resume" }, m.resume));
      var tags = el("p", { "class": "mod-tags" });
      if (m.prerequis.length) tags.appendChild(el("span", { "class": "tag apres" }, "Après : " + m.prerequis.map(function (id) { var x = mod(id); return x ? court(x) : id; }).join(", ")));
      (m.tags || []).slice(0, 5).forEach(function (t) { tags.appendChild(el("span", { "class": "tag" }, t)); });
      dr.appendChild(tags);
      a.appendChild(dr);
      return a;
    }
    function filtrer() {
      var mots = norm(q.value).split(/\s+/).filter(Boolean);
      var res = D.modules.filter(function (m) {
        if (domaine && m.domaine !== domaine) return false;
        var t = texte(m);
        return mots.every(function (w) { return t.indexOf(w) >= 0; });
      });
      liste.textContent = "";
      res.forEach(function (m) { liste.appendChild(carte(m)); });
      var faits = D.modules.filter(fait).length;
      compte.textContent = (res.length ? res.length + " module" + (res.length > 1 ? "s" : "") + " sur " + D.modules.length : "Aucun module ne correspond") + " · " + faits + " terminé" + (faits > 1 ? "s" : "");
      if (!res.length) {
        var v = el("div", { "class": "mod-vide" });
        v.appendChild(el("p", null, "Rien pour cette recherche. Essaie un autre mot-clé ou un autre domaine."));
        var r = el("button", { type: "button", "class": "btn ghost" }, "Tout afficher");
        r.addEventListener("click", function () { q.value = ""; boutons[0].click(); q.focus(); });
        v.appendChild(r);
        liste.appendChild(v);
      }
    }
    q.addEventListener("input", filtrer);
    filtrer();
  }

  /* ---------- En-tête d'un module : <div data-module-meta="id"> ---------- */
  function entete(box) {
    var m = mod(box.getAttribute("data-module-meta"));
    if (!m) return;
    var d = dom(m.domaine);
    var dl = el("dl", { "class": "mod-fiche", "aria-label": "Fiche du module" });
    function ligne(t, contenu, cls) {
      var w = el("div", cls ? { "class": cls } : null);
      w.appendChild(el("dt", null, t));
      var dd = el("dd");
      if (typeof contenu === "string") dd.textContent = contenu; else dd.appendChild(contenu);
      w.appendChild(dd);
      dl.appendChild(w);
    }
    var nv = el("span", { "class": "mod-fiche-niv" });
    nv.appendChild(jauge(m.niveau));
    nv.appendChild(document.createTextNode(niv(m.niveau)));
    ligne("Niveau", nv);
    ligne("Durée", duree(m.duree));
    ligne("Domaine", d ? el("a", { href: root + "themes.html?domaine=" + d.id }, d.titre) : m.domaine);
    var pre;
    if (m.prerequis.length) {
      pre = el("span");
      m.prerequis.forEach(function (id, i) {
        var p = mod(id); if (!p) return;
        if (i) pre.appendChild(document.createTextNode(", "));
        pre.appendChild(el("a", { href: p.id + ".html" }, court(p)));
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

  /* ---------- Thèmes : themes.html = l'atlas (<div id="themes-liste">), sélection dans ?domaine= ---------- */
  function themes(box) {
    var k = document.querySelector("[data-themes-kicker]");
    if (k) k.textContent = "Thèmes · " + D.domaines.length + " domaines";
    var m = /[?&]domaine=([a-z-]+)/.exec(location.search);
    var sel = m && dom(m[1]) ? m[1] : D.domaines[0].id;
    box.textContent = "";
    var grille = el("div", { "class": "atlas-grille", role: "group", "aria-label": "Domaines" });
    var panneau = el("section", { "class": "atlas-panneau", id: "domaine", "aria-live": "polite", tabindex: "-1" });
    box.appendChild(grille);
    box.appendChild(panneau);
    function num(i) { return (i < 9 ? "0" : "") + (i + 1); }
    var tuiles = D.domaines.map(function (d, i) {
      var mods = D.modules.filter(function (x) { return x.domaine === d.id; });
      var dispo = mods.length + (d.liens || []).length, venir = (d.aVenir || []).length;
      var b = el("button", { type: "button", "class": "tuile" + (dispo ? "" : " vide"), "aria-pressed": "false", "aria-controls": "domaine" });
      var tete = el("span", { "class": "tuile-tete" });
      tete.appendChild(el("span", { "class": "tuile-n" }, num(i)));
      if (d.stage) tete.appendChild(el("span", { "class": "badge-stage" }, "STAGE"));
      b.appendChild(tete);
      b.appendChild(el("span", { "class": "tuile-titre" }, d.titre));
      var pips = el("span", { "class": "pips", "aria-hidden": "true" });
      for (var n = 0; n < dispo; n++) pips.appendChild(el("span", { "class": "pip" }));
      for (var v = 0; v < venir; v++) pips.appendChild(el("span", { "class": "pip vide" }));
      b.appendChild(pips);
      b.appendChild(el("span", { "class": "tuile-resume" }, dispo + " disponible" + (dispo > 1 ? "s" : "") + " · " + venir + " à venir"));
      b.addEventListener("click", function () {
        choisir(d.id, true);
        if (window.innerWidth < 1024) panneau.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
      grille.appendChild(b);
      return b;
    });
    function choisir(id, url) {
      sel = id;
      var i = 0;
      D.domaines.forEach(function (d, k) { if (d.id === id) i = k; tuiles[k].setAttribute("aria-pressed", String(d.id === id)); });
      var d = D.domaines[i];
      panneau.textContent = "";
      panneau.appendChild(el("p", { "class": "kicker" }, "Domaine " + num(i) + (d.stage ? " · utile au stage" : "")));
      panneau.appendChild(el("h2", null, d.titre));
      panneau.appendChild(el("p", { "class": "atlas-desc" }, d.desc));
      var mods = D.modules.filter(function (x) { return x.domaine === d.id; });
      if (mods.length) {
        panneau.appendChild(el("h3", { "class": "label" }, "Modules disponibles"));
        mods.forEach(function (x) {
          var a = el("a", { "class": "atlas-mod", href: lien(x) });
          a.appendChild(el("span", { "class": "atlas-mod-t" }, x.titre));
          var meta = el("span", { "class": "atlas-mod-m" });
          meta.appendChild(jauge(x.niveau));
          meta.appendChild(document.createTextNode("Niv. " + x.niveau + " · " + duree(x.duree) + (fait(x) ? " · ✓ fait" : "")));
          a.appendChild(meta);
          panneau.appendChild(a);
        });
      }
      if (d.liens && d.liens.length) {
        panneau.appendChild(el("h3", { "class": "label" }, "Ailleurs sur le site"));
        var ul = el("ul", { "class": "atlas-liens" });
        d.liens.forEach(function (l) { var li = el("li"); li.appendChild(el("a", { href: root + l.href }, l.label)); ul.appendChild(li); });
        panneau.appendChild(ul);
      }
      if (d.aVenir && d.aVenir.length) {
        panneau.appendChild(el("h3", { "class": "label" }, "À venir"));
        var ul3 = el("ul", { "class": "atlas-venir" });
        d.aVenir.forEach(function (t) { ul3.appendChild(el("li", null, t)); });
        panneau.appendChild(ul3);
      }
      if (mods.length) {
        var p = el("p", { "class": "atlas-tout" });
        p.appendChild(el("a", { href: root + "modules/index.html?domaine=" + d.id }, "Voir ce domaine dans le catalogue"));
        panneau.appendChild(p);
      }
      if (url && window.history && history.replaceState) {
        try { history.replaceState(null, "", location.pathname + "?domaine=" + d.id); } catch (e) { /* file:// selon le navigateur */ }
      }
    }
    choisir(sel, false);
  }

  function init() {
    store = window.IT && window.IT.store;
    var c = document.getElementById("catalogue"); if (c) catalogue(c);
    Array.prototype.forEach.call(document.querySelectorAll("[data-parcours]"), parcours);
    Array.prototype.forEach.call(document.querySelectorAll("[data-module-meta]"), entete);
    Array.prototype.forEach.call(document.querySelectorAll("[data-module-suite]"), suite);
    var t = document.getElementById("themes-liste"); if (t) themes(t);
  }
  /* app.js (defer) est chargé avant ce script : window.IT est prêt au DOMContentLoaded. */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
