/* Plateforme d'apprentissage IT — script commun (aucune dépendance) */
(function () {
  "use strict";

  var PREFIX = "it.";
  var DATA = window.IT_DATA || { rubriques: [], stage: {} };
  var body = document.body;
  var root = body.getAttribute("data-root") || "";

  /* ---------- Stockage (toujours dans un try/catch) ---------- */
  var store = {
    get: function (k) { try { return localStorage.getItem(PREFIX + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(PREFIX + k, v); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(PREFIX + k); } catch (e) { /* ignoré */ } }
  };

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Icônes (SVG en ligne, décoratives) ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(name) {
    var span = document.createElement("span");
    span.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
    return span.firstChild;
  }

  /* ---------- Thème : auto / clair / sombre ---------- */
  var THEMES = ["auto", "light", "dark"];
  var THEME_LABEL = { auto: "automatique (suit le système)", light: "clair", dark: "sombre" };
  var THEME_ICON = { auto: "auto", light: "sun", dark: "moon" };
  function currentTheme() { var t = store.get("theme"); return THEMES.indexOf(t) >= 0 ? t : "auto"; }
  function applyTheme(t) {
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }

  /* ---------- En-tête, navigation, pied de page ---------- */
  function buildChrome() {
    var current = body.getAttribute("data-nav") || "";

    var skip = el("a", { "class": "skip", href: "#contenu" }, "Aller au contenu");
    var header = el("header", { "class": "site-header" });
    var bar = el("div", { "class": "wrap bar" });

    var brand = el("a", { "class": "brand", href: root + "index.html", "aria-label": "Apprentissage IT, accueil" });
    brand.appendChild(el("span", { "class": "stamp", "aria-hidden": "true" }, "IT"));
    var name = el("span", { "class": "brand-name", "aria-hidden": "true" }, "Apprentissage ");
    name.appendChild(el("span", { "class": "it" }, "IT"));
    brand.appendChild(name);
    bar.appendChild(brand);

    var nav = el("nav", { "class": "site-nav", id: "menu-principal", "aria-label": "Rubriques" });
    DATA.rubriques.forEach(function (r) {
      var a = el("a", { href: root + r.href }, r.menu || r.titre);
      if (r.id === current) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    bar.appendChild(nav);

    var search = el("button", { type: "button", "class": "search-btn", "data-recherche": "", "aria-label": "Rechercher une notion (raccourci : barre oblique)", "aria-keyshortcuts": "/ Control+K" });
    search.appendChild(icon("search"));
    search.appendChild(el("span", { "class": "txt" }, "Rechercher une notion…"));
    search.appendChild(el("kbd", null, "/"));
    bar.appendChild(search);

    var themeBtn = el("button", { type: "button", "class": "icon-btn theme-btn" });
    var themeLigne = el("button", { type: "button", "class": "theme-ligne" });
    function refreshThemeBtn() {
      var t = currentTheme(), next = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
      var label = "Thème " + THEME_LABEL[t] + ". Passer au thème " + THEME_LABEL[next] + ".";
      themeBtn.textContent = "";
      themeBtn.appendChild(icon(THEME_ICON[t]));
      themeBtn.setAttribute("aria-label", label);
      themeBtn.title = "Thème " + THEME_LABEL[t];
      themeLigne.textContent = "";
      themeLigne.appendChild(icon(THEME_ICON[t]));
      themeLigne.appendChild(el("span", null, "Thème : " + THEME_LABEL[t]));
      themeLigne.setAttribute("aria-label", label);
    }
    function cycleTheme() {
      var next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
      store.set("theme", next);
      applyTheme(next);
      refreshThemeBtn();
    }
    themeBtn.addEventListener("click", cycleTheme);
    themeLigne.addEventListener("click", cycleTheme);
    nav.appendChild(themeLigne);
    refreshThemeBtn();
    bar.appendChild(themeBtn);

    var menuBtn = el("button", { type: "button", "class": "icon-btn menu-btn", "aria-controls": "menu-principal", "aria-expanded": "false", "aria-label": "Ouvrir le menu" });
    menuBtn.appendChild(icon("menu"));
    function setMenu(open) {
      header.classList.toggle("menu-ouvert", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      menuBtn.textContent = "";
      menuBtn.appendChild(icon(open ? "close" : "menu"));
    }
    menuBtn.addEventListener("click", function () { setMenu(!header.classList.contains("menu-ouvert")); });
    header.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("menu-ouvert")) { setMenu(false); menuBtn.focus(); }
    });
    bar.appendChild(menuBtn);

    header.appendChild(bar);
    body.insertBefore(header, body.firstChild);
    body.insertBefore(skip, body.firstChild);

    var footer = el("footer", { "class": "site-footer" });
    var fw = el("div", { "class": "wrap" });
    fw.appendChild(el("p", null, "Apprentissage IT — contenu libre, sans compte ni suivi."));
    fw.appendChild(el("p", null, "Ta progression reste dans ce navigateur."));
    fw.appendChild(progressionPortable());
    footer.appendChild(fw);
    body.appendChild(footer);
  }

  /* ---------- Progression portable : exporter / importer les clés it.* dans un fichier JSON ----------
     Sans serveur ni requête réseau, donc utilisable en file:// ; jamais d'alert : le résultat s'affiche dans le pied de page. */
  function progressionPortable() {
    var bloc = el("div", { "class": "pied-progression" });
    var statut = el("p", { "class": "pied-statut", role: "status", "aria-live": "polite" });
    var bExport = el("button", { type: "button", "class": "pied-btn" }, "Exporter ma progression");
    var bImport = el("button", { type: "button", "class": "pied-btn" }, "Importer");
    var fichier = el("input", { type: "file", accept: "application/json,.json", hidden: "", "aria-label": "Fichier de progression à importer" });
    function cles() {
      var out = {};
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(PREFIX) === 0) out[k] = localStorage.getItem(k);
        }
      } catch (e) { return null; }
      return out;
    }
    bExport.addEventListener("click", function () {
      var c = cles();
      if (!c) { statut.textContent = "Le stockage du navigateur est inaccessible : rien à exporter."; return; }
      var n = Object.keys(c).length;
      var donnees = { format: "apprentissage-it", version: 1, date: new Date().toISOString(), cles: c };
      var url = URL.createObjectURL(new Blob([JSON.stringify(donnees, null, 1)], { type: "application/json" }));
      var a = el("a", { href: url, download: "progression-it-" + new Date().toISOString().slice(0, 10) + ".json" });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      statut.textContent = n + " élément" + (n > 1 ? "s" : "") + " exporté" + (n > 1 ? "s" : "") + ". Garde le fichier pour l'importer sur un autre appareil.";
    });
    bImport.addEventListener("click", function () { fichier.click(); });
    fichier.addEventListener("change", function () {
      var f = fichier.files && fichier.files[0];
      if (!f) return;
      var lecteur = new FileReader();
      lecteur.onload = function () {
        var d;
        try { d = JSON.parse(lecteur.result); } catch (e) { d = null; }
        if (!d || d.format !== "apprentissage-it" || !d.cles || typeof d.cles !== "object") {
          statut.textContent = "Ce fichier n'est pas un export de progression de ce site : rien n'a été modifié.";
          fichier.value = ""; return;
        }
        var n = 0, ok = true;
        Object.keys(d.cles).forEach(function (k) {
          var v = d.cles[k];
          if (k.indexOf(PREFIX) !== 0 || typeof v !== "string") return;
          try { localStorage.setItem(k, v); n++; } catch (e) { ok = false; }
        });
        fichier.value = "";
        statut.textContent = ok ? n + " élément" + (n > 1 ? "s" : "") + " importé" + (n > 1 ? "s" : "") + ". Mise à jour de la page…" : "Import incomplet : le stockage du navigateur a refusé certains éléments.";
        if (ok) setTimeout(function () { location.reload(); }, 900);
      };
      lecteur.readAsText(f);
    });
    bloc.appendChild(bExport); bloc.appendChild(bImport); bloc.appendChild(fichier); bloc.appendChild(statut);
    return bloc;
  }

  /* ---------- Numéros de section : « 1. Titre » devient « §1 Titre » ---------- */
  function initSections() {
    var hs = document.querySelectorAll("main h2");
    Array.prototype.forEach.call(hs, function (h) {
      var first = h.firstChild;
      if (!first || first.nodeType !== 3) return;
      var m = /^\s*(\d+)\.\s+/.exec(first.nodeValue);
      if (!m) return;
      first.nodeValue = first.nodeValue.slice(m[0].length);
      var sec = el("span", { "class": "sec" }, "§" + m[1]);
      h.insertBefore(sec, first);
      h.setAttribute("data-sec", m[1]);
    });
  }

  /* ---------- Progression ---------- */
  function isDone(id) { return store.get("done." + id) === "1"; }

  function initDone() {
    var boxes = document.querySelectorAll("input[data-done]");
    Array.prototype.forEach.call(boxes, function (box) {
      var id = box.getAttribute("data-done");
      box.checked = isDone(id);
      box.addEventListener("change", function () {
        if (box.checked) store.set("done." + id, "1"); else store.del("done." + id);
        renderProgress();
      });
    });
  }

  /* Pastille « terminé » à côté d'un jour : <span data-fait="id"></span> */
  function renderFait() {
    var nodes = document.querySelectorAll("[data-fait]");
    Array.prototype.forEach.call(nodes, function (n) {
      n.textContent = "";
      n.className = "";
      if (isDone(n.getAttribute("data-fait"))) { n.className = "fait"; n.textContent = "✓ terminé"; }
    });
  }

  function rubriqueStats(r) {
    var units = r.units || [];
    var n = 0;
    units.forEach(function (id) { if (isDone(id)) n++; });
    return { done: n, total: units.length };
  }

  function drawProgress(node, done, total) {
    node.textContent = "";
    if (!total) { node.appendChild(el("span", null, "Contenu à venir")); return; }
    var pct = Math.round((done / total) * 100);
    var fmt = node.getAttribute("data-progress-format");
    node.appendChild(el("span", null, fmt ? fmt.replace("{d}", done).replace("{t}", total) : done + " / " + total + " terminé" + (done > 1 ? "s" : "") + " (" + pct + " %)"));
    var track = el("div", { "class": "track", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct) });
    var fill = el("div", { "class": "fill" });
    fill.style.width = pct + "%";
    track.appendChild(fill);
    node.appendChild(track);
  }

  function renderProgress() {
    renderFait();
    var nodes = document.querySelectorAll("[data-progress]");
    Array.prototype.forEach.call(nodes, function (node) {
      var key = node.getAttribute("data-progress");
      var done = 0, total = 0;
      DATA.rubriques.forEach(function (r) {
        if (key === "all" || key === r.id) { var s = rubriqueStats(r); done += s.done; total += s.total; }
      });
      drawProgress(node, done, total);
    });
  }

  /* ---------- Décompte jusqu'au début du stage ---------- */
  /* ---------- Boutons copier ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = el("textarea", { "aria-hidden": "true" });
      ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error("copie impossible"));
    });
  }
  function initCopy() {
    var pres = document.querySelectorAll("pre[data-copy]");
    Array.prototype.forEach.call(pres, function (pre) {
      var wrap = el("div", { "class": "code-block" });
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var code = pre.innerText;
      var langage = /\b[A-Z][a-z]+-[A-Z][A-Za-z]+\b|\$[A-Za-z_]/.test(code) ? "PowerShell" : "Invite de commandes ou PowerShell";
      if (pre.getAttribute("data-langage")) langage = pre.getAttribute("data-langage");
      var barre = el("div", { "class": "code-titre" });
      barre.appendChild(el("span", { "class": "code-points", "aria-hidden": "true" }));
      barre.appendChild(el("span", { "class": "code-langage" }, langage));
      var btn = el("button", { type: "button", "class": "copy-btn", "aria-label": "Copier le code" });
      var lbl = el("span", null, "Copier");
      btn.appendChild(icon("copy"));
      btn.appendChild(lbl);
      var timer;
      btn.addEventListener("click", function () {
        copyText(pre.innerText.replace(/\n$/, "")).then(function () {
          lbl.textContent = "Copié"; btn.classList.add("ok");
        }, function () {
          lbl.textContent = "Échec";
        }).then(function () {
          clearTimeout(timer);
          timer = setTimeout(function () { lbl.textContent = "Copier"; btn.classList.remove("ok"); }, 1800);
        });
      });
      barre.appendChild(btn);
      wrap.insertBefore(barre, pre);
    });
  }

  function mouvementReduit() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }

  /* ---------- Apparition douce au défilement (schémas, cartes, citations) ----------
     Rien n'est masqué si le mouvement est réduit, sans IntersectionObserver, ou pour les outils de contrôle automatisés (qui lisent la page sans défiler). */
  function initApparition() {
    if (mouvementReduit() || !("IntersectionObserver" in window) || navigator.webdriver) return;
    var cibles = document.querySelectorAll("main .schema, main .card, main .callout.retenir, main .quiz, main .seance");
    var h = window.innerHeight || 800;
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("revele"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(cibles, function (c) {
      if (c.getBoundingClientRect().top < h) return;
      c.classList.add("a-reveler");
      io.observe(c);
    });
  }

  /* ---------- Tableaux : sur mobile, chaque ligne devient une carte (étiquettes tirées de l'en-tête) ---------- */
  function initTableaux() {
    var tables = document.querySelectorAll("main .table-wrap > table");
    Array.prototype.forEach.call(tables, function (t) {
      var ths = t.querySelectorAll("thead th");
      if (!ths.length || t.querySelector("tbody th")) return;
      var noms = Array.prototype.map.call(ths, function (th) { return th.textContent.replace(/\s+/g, " ").trim(); });
      Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr) {
        Array.prototype.forEach.call(tr.children, function (td, i) { if (noms[i]) td.setAttribute("data-label", noms[i]); });
      });
      t.parentNode.classList.add("empile");
    });
  }

  /* ---------- Notes en marge : sur grand écran, les sources et les « à vérifier sur place » d'un module passent dans la marge ---------- */
  function initMarge() {
    var main = document.querySelector("main");
    if (!main || !document.querySelector("[data-module-suite]") || !window.matchMedia) return;
    var notes = Array.prototype.slice.call(main.querySelectorAll(".prose > .callout.source, .prose > .callout.umons:not([data-titre])"));
    var places = notes.map(function (n) { var c = document.createComment("note"); n.parentNode.insertBefore(c, n); return c; });
    var mq = window.matchMedia("(min-width: 75rem)");
    function appliquer() {
      notes.forEach(function (n, i) {
        if (mq.matches) {
          var h = places[i].previousElementSibling;
          while (h && h.tagName !== "H2") h = h.previousElementSibling;
          if (!h) return;
          var cible = h.nextElementSibling;
          while (cible && cible.classList.contains("en-marge")) cible = cible.nextElementSibling;
          h.parentNode.insertBefore(n, cible);
          n.classList.add("en-marge");
        } else {
          places[i].parentNode.insertBefore(n, places[i].nextSibling);
          n.classList.remove("en-marge");
        }
      });
    }
    appliquer();
    if (mq.addEventListener) mq.addEventListener("change", appliquer); else if (mq.addListener) mq.addListener(appliquer);
  }

  /* ---------- Moteur de quiz ----------
     Données : window.IT_QUIZZES[id] = { titre, questions: [{ q, options: [..], reponse: index, explication }] }
     Balisage : <div data-quiz="id"></div>
     La correction (explication) reste dans un <details> fermé. */
  function initQuizzes() {
    var all = window.IT_QUIZZES || {};
    var boxes = document.querySelectorAll("[data-quiz]");
    Array.prototype.forEach.call(boxes, function (box) {
      var id = box.getAttribute("data-quiz");
      var quiz = all[id];
      if (!quiz) return;
      box.classList.add("quiz");
      render();

      function render() {
        box.textContent = "";
        box.classList.remove("corrige");
        if (quiz.titre) box.appendChild(el("h3", null, quiz.titre));
        var form = el("form", { novalidate: "" });
        quiz.questions.forEach(function (qu, i) {
          var fs = el("fieldset");
          fs.appendChild(el("legend", null, (i + 1) + ". " + qu.q));
          qu.options.forEach(function (opt, j) {
            var label = el("label", { "class": "opt" });
            var input = el("input", { type: "radio", name: "q" + i, value: String(j) });
            label.appendChild(input);
            label.appendChild(el("span", null, opt));
            fs.appendChild(label);
          });
          form.appendChild(fs);
        });
        var actions = el("div", { "class": "actions" });
        var submit = el("button", { type: "submit", "class": "btn" }, "Corriger");
        var out = el("p", { "class": "score", "aria-live": "polite" });
        var prev = store.get("quiz." + id);
        if (prev) out.textContent = "Dernier score : " + prev + ".";
        actions.appendChild(submit);
        actions.appendChild(out);
        form.appendChild(actions);
        form.addEventListener("submit", function (e) { e.preventDefault(); correct(form, submit, out); });
        box.appendChild(form);
      }

      function correct(form, submit, out) {
        var score = 0, missing = 0;
        var sets = form.querySelectorAll("fieldset");
        quiz.questions.forEach(function (qu, i) {
          if (!form.querySelector('input[name="q' + i + '"]:checked')) missing++;
        });
        if (missing) { out.textContent = "Réponds à toutes les questions (" + missing + " restante" + (missing > 1 ? "s" : "") + ")."; return; }
        quiz.questions.forEach(function (qu, i) {
          var fs = sets[i];
          var chosen = +form.querySelector('input[name="q' + i + '"]:checked').value;
          var ok = chosen === qu.reponse;
          if (ok) score++;
          var labels = fs.querySelectorAll(".opt");
          Array.prototype.forEach.call(labels, function (lab, j) {
            lab.querySelector("input").disabled = true;
            if (j === chosen) lab.classList.add(ok ? "bon" : "faux");
          });
          fs.appendChild(el("p", { "class": "verdict " + (ok ? "bon" : "faux") }, ok ? "Bonne réponse." : "Pas tout à fait."));
          var d = el("details", { "class": "correction" });
          d.appendChild(el("summary", null, "Voir la correction"));
          d.appendChild(el("p", null, "Réponse : " + qu.options[qu.reponse]));
          if (qu.explication) d.appendChild(el("p", null, qu.explication));
          fs.appendChild(d);
        });
        var txt = score + " / " + quiz.questions.length;
        store.set("quiz." + id, txt);
        box.classList.add("corrige");
        submit.remove();
        out.textContent = "Score : " + txt + ".";
        var grand = el("p", { "class": "score-grand", "aria-hidden": "true" });
        var gN = el("span", { "class": "score-n" }, String(score));
        grand.appendChild(gN); grand.appendChild(document.createTextNode(" / " + quiz.questions.length));
        out.parentNode.insertBefore(grand, out);
        if (!mouvementReduit() && score > 0) {
          var t0 = null;
          var pas = function (t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 700); gN.textContent = String(Math.round(score * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(pas); };
          gN.textContent = "0"; requestAnimationFrame(pas);
        }
        var retry = el("button", { type: "button", "class": "btn ghost" }, "Recommencer");
        retry.addEventListener("click", function () { render(); box.scrollIntoView({ block: "start" }); });
        out.parentNode.appendChild(retry);
      }
    });
  }

  /* ---------- Reprise : dernière section vue sur une page de jour (it.reprise) ---------- */
  function titreSection(h) {
    var c = h.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll(".sec, .duree"), function (n) { n.remove(); });
    var t = c.textContent.replace(/\s+/g, " ").trim();
    if (t.length > 42) t = t.slice(0, 40).replace(/\s\S*$/, "") + "…";
    return (h.getAttribute("data-sec") ? "§" + h.getAttribute("data-sec") + " " : "") + "« " + t + " »";
  }
  function initReprise() {
    var m = /stage\/j(\d+)\.html$/.exec(location.pathname);
    if (!m || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        store.set("reprise", JSON.stringify({ jour: +m[1], url: "stage/j" + m[1] + ".html#" + e.target.id, titre: titreSection(e.target) }));
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll("main h2[id]"), function (h) { io.observe(h); });
  }

  /* ---------- Recherche rapide (/, Ctrl+K, bouton de l'en-tête) ----------
     Index : assets/recherche.js (généré par outils/index-recherche.mjs), chargé à la première ouverture. */
  var R = null;
  var GROUPES = ["Commandes", "Notions", "Modules", "Atelier"];
  var EXEMPLES = ["dns", "mot de passe", "bips", "gpupdate", "priorité"];
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function chargerIndex(cb) {
    if (window.IT_RECHERCHE) return cb(true);
    var sc = el("script", { src: root + "assets/recherche.js" });
    sc.onload = function () { cb(!!window.IT_RECHERCHE); };
    sc.onerror = function () { cb(false); };
    document.head.appendChild(sc);
  }
  function construireRecherche() {
    var voile = el("div", { "class": "rech-voile", hidden: "" });
    var dlg = el("div", { "class": "rech", role: "dialog", "aria-modal": "true", "aria-label": "Rechercher dans la plateforme" });
    var champ = el("div", { "class": "rech-champ" });
    champ.appendChild(icon("search"));
    var lab = el("label", { "class": "sr-only", "for": "rech-q" }, "Rechercher une commande, une notion, un module ou une panne");
    var input = el("input", { id: "rech-q", type: "search", role: "combobox", "aria-expanded": "true", "aria-controls": "rech-res", "aria-autocomplete": "list", autocomplete: "off", spellcheck: "false", placeholder: "Une commande, une notion, une panne…" });
    var fermer = el("button", { type: "button", "class": "rech-fermer", "aria-label": "Fermer la recherche" }, "Échap");
    champ.appendChild(lab); champ.appendChild(input); champ.appendChild(fermer);
    var res = el("div", { "class": "rech-res", id: "rech-res", role: "listbox", "aria-label": "Résultats" });
    var statut = el("p", { "class": "sr-only", "aria-live": "polite" });
    var pied = el("p", { "class": "rech-pied", "aria-hidden": "true" });
    pied.innerHTML = "<span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>Entrée</kbd> ouvrir</span><span class=\"rech-local\">Index local, sans réseau</span>";
    dlg.appendChild(champ); dlg.appendChild(res); dlg.appendChild(pied); dlg.appendChild(statut);
    voile.appendChild(dlg);
    body.appendChild(voile);
    R = { voile: voile, input: input, res: res, statut: statut, fermer: fermer, options: [], actif: -1, opener: null };
    input.addEventListener("input", rendreResultats);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); activer(R.actif + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter" && R.actif >= 0 && R.options[R.actif]) { e.preventDefault(); R.options[R.actif].click(); }
    });
    voile.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); fermerRecherche(); }
      else if (e.key === "Tab") {
        var focusables = Array.prototype.filter.call(dlg.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]:not([tabindex="-1"])'), function (n) { return n.getClientRects().length; });
        if (!focusables.length) { e.preventDefault(); return; }
        var position = focusables.indexOf(document.activeElement);
        if (e.shiftKey && position <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
        else if (!e.shiftKey && (position < 0 || position === focusables.length - 1)) { e.preventDefault(); focusables[0].focus(); }
      }
    });
    voile.addEventListener("mousedown", function (e) { if (e.target === voile) fermerRecherche(); });
    fermer.addEventListener("click", fermerRecherche);
  }
  function activer(i) {
    var n = R.options.length;
    if (!n) { R.actif = -1; R.input.removeAttribute("aria-activedescendant"); return; }
    i = (i + n) % n;
    R.options.forEach(function (o, k) { o.setAttribute("aria-selected", k === i ? "true" : "false"); });
    R.actif = i;
    R.input.setAttribute("aria-activedescendant", R.options[i].id);
    R.options[i].scrollIntoView({ block: "nearest" });
  }
  function rendreResultats() {
    var q = norm(R.input.value.trim());
    R.res.textContent = ""; R.options = []; R.actif = -1;
    if (!q) {
      var vide = el("div", { "class": "rech-vide" });
      vide.appendChild(el("p", null, "Tape une commande, une notion, un module ou une panne. Par exemple :"));
      var ex = el("p", { "class": "rech-exemples" });
      EXEMPLES.forEach(function (x) {
        var b = el("button", { type: "button", "class": "rech-ex" }, x);
        b.addEventListener("click", function () { R.input.value = x; rendreResultats(); R.input.focus(); });
        ex.appendChild(b);
      });
      vide.appendChild(ex);
      R.res.appendChild(vide);
      R.statut.textContent = "";
      activer(-1);
      return;
    }
    var mots = q.split(/\s+/);
    var trouves = (window.IT_RECHERCHE || []).map(function (e) {
      var t = norm(e.t), hay = t + " " + norm(e.o) + " " + norm(e.m);
      for (var i = 0; i < mots.length; i++) if (hay.indexOf(mots[i]) < 0) return null;
      return { e: e, s: t.indexOf(q) === 0 ? 0 : t.indexOf(q) >= 0 ? 1 : mots.every(function (m) { return t.indexOf(m) >= 0; }) ? 2 : 3 };
    }).filter(Boolean);
    var total = 0;
    GROUPES.forEach(function (g, gi) {
      var liste = trouves.filter(function (x) { return x.e.g === g; }).sort(function (a, b) { return a.s - b.s; }).slice(0, g === "Notions" ? 8 : 6);
      if (!liste.length) return;
      var grp = el("div", { role: "group", "aria-labelledby": "rech-g" + gi });
      grp.appendChild(el("p", { "class": "rech-groupe", id: "rech-g" + gi }, g));
      liste.forEach(function (x) {
        var o = el("a", { "class": "rech-item", role: "option", id: "rech-o" + R.options.length, href: root + x.e.u, tabindex: "-1", "aria-selected": "false" });
        o.appendChild(el("span", { "class": "rech-tag" }, x.e.tag));
        var txt = el("span", { "class": "rech-txt" });
        txt.appendChild(el("span", { "class": "rech-titre" + (x.e.g === "Commandes" ? " cmd" : "") }, x.e.t));
        txt.appendChild(el("span", { "class": "rech-orig" }, x.e.o));
        o.appendChild(txt);
        var idx = R.options.length;
        o.addEventListener("mousemove", function () { if (R.actif !== idx) activer(idx); });
        o.addEventListener("click", function () { fermerRecherche(true); });
        R.options.push(o);
        grp.appendChild(o);
        total++;
      });
      R.res.appendChild(grp);
    });
    if (!total) {
      var rien = el("div", { "class": "rech-vide" });
      rien.appendChild(el("p", null, "Rien pour « " + R.input.value.trim() + " ». Essaie « dns », « bips » ou « mot de passe »."));
      R.res.appendChild(rien);
    }
    R.statut.textContent = total ? total + " résultat" + (total > 1 ? "s" : "") : "Aucun résultat";
    activer(0);
  }
  function ouvrirRecherche(opener) {
    if (!R) construireRecherche();
    if (!R.voile.hidden) return;
    R.opener = opener || document.activeElement;
    R.voile.hidden = false;
    document.documentElement.classList.add("rech-ouverte");
    R.input.focus();
    chargerIndex(function (ok) {
      if (!ok) { R.res.textContent = ""; R.res.appendChild(el("p", { "class": "rech-vide" }, "L'index de recherche n'a pas pu être chargé.")); return; }
      rendreResultats();
    });
  }
  function fermerRecherche(navigation) {
    if (!R || R.voile.hidden) return;
    R.voile.hidden = true;
    document.documentElement.classList.remove("rech-ouverte");
    if (navigation !== true && R.opener && R.opener.focus) R.opener.focus();
  }
  function initRecherche() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-recherche]"), function (b) {
      b.addEventListener("click", function () { ouvrirRecherche(b); });
    });
    document.addEventListener("keydown", function (e) {
      var t = e.target, tag = t && t.tagName;
      var saisie = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable);
      if (saisie || e.altKey) return;
      if ((e.key === "/" && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K"))) {
        e.preventDefault();
        ouvrirRecherche(document.activeElement);
      }
    });
  }

  /* ---------- Démarrage ---------- */
  applyTheme(currentTheme());
  buildChrome();
  initSections();
  initDone();
  renderProgress();
  initCopy();
  initTableaux();
  initMarge();
  initQuizzes();
  initApparition();
  initReprise();
  initRecherche();

  window.IT = { store: store, el: el, icon: icon, isDone: isDone, renderProgress: renderProgress };
})();
