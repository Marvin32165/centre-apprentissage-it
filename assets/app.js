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
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    /* Pictogrammes (grille 24, trait 1,5 par CSS) : rubriques et domaines */
    stage: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1.5-1.5 2.5-3.5 2.5H13"/>',
    support: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1.5-1.5 2.5-3.5 2.5H13"/>',
    modules: '<path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12"/><path d="M9 8h6"/>',
    themes: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    atelier: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    reseau: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>',
    windows: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4.5a3 3 0 0 1 0 6M21 20a5 5 0 0 0-3.5-4.8"/>',
    gestion: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    materiel: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    securite: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    linux: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
    virtualisation: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.6-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z"/>',
    telephone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    ticket: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"/><path d="M14 5v2M14 11v2M14 17v2"/>',
    fenetre: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
    courriel: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    ecran: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M9 10l2 2 4-4"/>',
    revision: '<path d="M9 5h10M9 12h10M9 19h10"/><path d="M4 5l1.2 1.2L7 4.5M4 12l1.2 1.2L7 11.5M4 19l1.2 1.2L7 18.5"/>',
    print: '<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>'
  };
  function picto(name) { var w = el("span", { "class": "picto", "aria-hidden": "true" }); if (ICONS[name]) w.appendChild(icon(name)); return w; }
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
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bar").trim() || "#2C1F16");
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
    var bExport = el("button", { type: "button", "class": "pied-btn" });
    bExport.appendChild(icon("download")); bExport.appendChild(el("span", null, "Exporter ma progression"));
    var bImport = el("button", { type: "button", "class": "pied-btn" });
    bImport.appendChild(icon("upload")); bImport.appendChild(el("span", null, "Importer"));
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
  /* ---------- Lot 40.4 : coloration syntaxique sobre (PowerShell, invite de commandes) ---------- */
  var RE_JETON = /("[^"]*"?|'[^']*'?|\s+|[|(){};]|[^\s|(){};"']+)/g;
  function jeton(cls, txt) { return cls ? el("span", { "class": "tk-" + cls }, txt) : document.createTextNode(txt); }
  function colorerMot(frag, mot, cls) {
    // %variable% (invite de commandes) ou $env:NOM au milieu d'un chemin
    var re = /%\w+%|\$[\w:]+/g, m, i = 0;
    while ((m = re.exec(mot))) {
      if (m.index > i) frag.appendChild(jeton(cls, mot.slice(i, m.index)));
      frag.appendChild(jeton("var", m[0]));
      i = m.index + m[0].length;
    }
    if (i < mot.length) frag.appendChild(jeton(cls, mot.slice(i)));
  }
  function colorerLigne(ligne) {
    var frag = document.createDocumentFragment(), attend = true, prec = "", table = false, m;
    if (/^\s*(#|REM\b|::)/i.test(ligne)) { frag.appendChild(jeton("com", ligne)); return frag; }
    RE_JETON.lastIndex = 0;
    while ((m = RE_JETON.exec(ligne))) {
      var t = m[0];
      if (/^\s+$/.test(t)) { frag.appendChild(jeton(null, t)); continue; }
      if (t.charAt(0) === "\"" || t.charAt(0) === "'") { colorerMot(frag, t, "str"); attend = false; continue; }
      if (/^[|(){};]$/.test(t)) {
        // Dans une table @{ clé=valeur; … }, ni « { » ni « ; » n'annoncent une commande.
        if (t === "{" && prec === "@") table = true; else if (t === "}" && table) table = false;
        frag.appendChild(jeton("op", t)); attend = /[|({;]/.test(t) && !table; prec = t; continue;
      }
      prec = t;
      if (attend && !/^[-$@]/.test(t)) colorerMot(frag, t, "cmd");
      else if (/^\$/.test(t)) frag.appendChild(jeton("var", t));
      else if (/^-[A-Za-z]/.test(t)) frag.appendChild(jeton("param", t));
      else if (/^\/[A-Za-z?]/.test(t)) {
        var k = t.indexOf(":");
        if (k > 1 && k < t.length - 1) { frag.appendChild(jeton("param", t.slice(0, k + 1))); colorerMot(frag, t.slice(k + 1), null); }
        else frag.appendChild(jeton("param", t));
      }
      else if (/^[A-Z][a-z]+-[A-Z][A-Za-z]+$/.test(t)) frag.appendChild(jeton("cmd", t));
      else if (t === "@") frag.appendChild(jeton("op", t));
      else colorerMot(frag, t, null);
      attend = false;
    }
    return frag;
  }
  function colorerCode(pre) {
    var code = pre.querySelector("code") || pre;
    if (code.children.length) return;
    var lignes = code.textContent.replace(/\n$/, "").split("\n");
    code.textContent = "";
    lignes.forEach(function (l, i) {
      var s = el("span", { "class": "ln" + (l.trim() ? "" : " vide") });
      s.appendChild(colorerLigne(l));
      code.appendChild(s);
      if (i < lignes.length - 1) code.appendChild(document.createTextNode("\n"));
    });
    pre.classList.add("colore");
  }
  function initCopy() {
    var pres = document.querySelectorAll("pre[data-copy]"), legendeFaite = false;
    Array.prototype.forEach.call(pres, function (pre) {
      var wrap = el("div", { "class": "code-block" });
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var code = pre.innerText;
      var langage = /\b[A-Z][a-z]+-[A-Z][A-Za-z]+\b|\$[A-Za-z_]/.test(code) ? "PowerShell" : "Invite de commandes ou PowerShell";
      if (pre.getAttribute("data-langage")) langage = pre.getAttribute("data-langage");
      if (/PowerShell|commandes/.test(langage)) colorerCode(pre);
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
      if (pre.classList.contains("colore") && !legendeFaite) {
        legendeFaite = true;
        var lg = el("p", { "class": "code-legende" });
        [["cmd", "commande"], ["param", "paramètre"], ["str", "texte entre guillemets"], ["var", "variable"]].forEach(function (c) {
          lg.appendChild(el("span", { "class": "tk-" + c[0] }, c[1]));
        });
        wrap.appendChild(lg);
      }
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

  /* ---------- Couvertures : pictogrammes des rubriques, programme de la prépa, couleur de la barre du navigateur ---------- */
  function initCouvertures() {
    Array.prototype.forEach.call(document.querySelectorAll("main .card.rub[href]"), function (c) {
      var h = c.getAttribute("href"), n = /stage\//.test(h) ? "stage" : /modules\//.test(h) ? "modules" : /themes/.test(h) ? "themes" : /atelier\//.test(h) ? "atelier" : null;
      if (n && !c.querySelector(".picto")) c.insertBefore(picto(n), c.firstChild);
    });
    var ul = document.querySelector("main ul.plan-jours"), J = DATA.stage && DATA.stage.jours;
    if (ul && J) {
      var d = new Date(), auj = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
      ul.classList.add("programme");
      Array.prototype.forEach.call(ul.children, function (li) {
        var a = li.querySelector("a"), m = a && /j(\d+)\.html/.exec(a.getAttribute("href"));
        if (!m) return;
        var j = J.filter(function (x) { return x.n === +m[1]; })[0];
        var reste = li.textContent.split(a.textContent).slice(1).join(a.textContent).replace(/\s+/g, " ").trim();
        var fait = li.querySelector("[data-fait]");
        li.textContent = "";
        li.appendChild(el("span", { "class": "prog-n", "aria-hidden": "true" }, (j && j.n < 10 ? "0" : "") + m[1]));
        var corps = el("span", { "class": "prog-corps" });
        var t = el("span", { "class": "prog-titre" }); a.textContent = a.textContent.replace(/^./, function (c) { return c.toUpperCase(); }); t.appendChild(el("span", { "class": "sr-only" }, "Jour " + m[1] + " : ")); t.appendChild(a);
        corps.appendChild(t);
        if (reste) corps.appendChild(el("span", { "class": "prog-desc" }, reste.replace(/^\(|\)$/g, "")));
        li.appendChild(corps);
        var meta = el("span", { "class": "prog-meta" });
        if (j) {
          var dt = j.date.split("-"), date = new Date(+dt[0], +dt[1] - 1, +dt[2]);
          meta.appendChild(el("span", { "class": "prog-date" }, date.toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "numeric" }).replace(".", "")));
          meta.appendChild(el("span", { "class": "prog-duree" }, j.duree));
          if (j.date === auj) li.classList.add("auj");
        }
        if (fait) meta.appendChild(fait);
        li.appendChild(meta);
      });
    }
    var tc = document.querySelector('meta[name="theme-color"]');
    if (!tc) { tc = el("meta", { name: "theme-color" }); document.head.appendChild(tc); }
    tc.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bar").trim() || "#2C1F16");
  }

  /* ---------- Typographie française, appliquée au texte affiché (jamais au code) :
     espace insécable avant « : » et « » », fine insécable avant « ; ? ! », insécable après « « », apostrophe typographique. ---------- */
  function initTypo() {
    var main = document.querySelector("main");
    if (!main || !document.createTreeWalker) return;
    var exclus = /^(CODE|PRE|KBD|SAMP|SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|svg|text|title|desc)$/;
    var w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        for (var p = n.parentNode; p && p !== main; p = p.parentNode) if (exclus.test(p.nodeName) || (p.classList && p.classList.contains("no-typo"))) return NodeFilter.FILTER_REJECT;
        return /[:;?!»«']/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var noeuds = [], n;
    while ((n = w.nextNode())) noeuds.push(n);
    noeuds.forEach(function (t) {
      t.nodeValue = t.nodeValue
        .replace(/[ \u00a0]+([:»])/g, "\u00a0$1")
        .replace(/[ \u00a0]+([;?!])/g, "\u202f$1")
        .replace(/«[ \u00a0]+/g, "«\u00a0")
        .replace(/([A-Za-zÀ-ÿ])'([A-Za-zÀ-ÿ])/g, "$1\u2019$2");
    });
  }

  /* ---------- Lot 40 : pages de cours illustrées (bandeau gravé, phases, ornements) ---------- */
  var ROMAINS = { "je montre": "I", "on fait ensemble": "II", "tu fais seul": "III" };
  var PICTO_JOUR = { 1: "stage", 2: "telephone", 3: "ticket", 4: "fenetre", 5: "reseau", 6: "windows", 7: "courriel", 8: "ecran", 9: "materiel", 10: "revision" };
  function initCours() {
    var main = document.querySelector("main"), prose = main && main.querySelector(".prose");
    if (!prose) return;
    var mj = /stage\/j(\d+)\.html$/.exec(location.pathname), meta = document.querySelector("[data-module-meta]");
    var num = null, nom = null, legende = "";
    if (mj) { num = (+mj[1] < 10 ? "0" : "") + mj[1]; nom = PICTO_JOUR[+mj[1]]; legende = "Jour"; }
    else if (meta && window.IT_MODULES) {
      var mods = window.IT_MODULES.modules, id = meta.getAttribute("data-module-meta");
      for (var i = 0; i < mods.length; i++) if (mods[i].id === id) { num = "M" + (i < 9 ? "0" : "") + (i + 1); nom = mods[i].domaine; legende = "Module"; }
    }
    if (!num) return;
    document.body.classList.add("page-cours");
    var h1 = prose.querySelector("h1"), kicker = h1 && h1.previousElementSibling;
    var b = el("div", { "class": "bandeau", "aria-hidden": "true" });
    var paths = ICONS[nom] || ICONS.modules;
    b.innerHTML = '<svg class="bandeau-svg" viewBox="0 0 720 150" preserveAspectRatio="xMinYMid meet" focusable="false">'
      + '<defs><pattern id="bd-h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" class="bd-hachure"/></pattern></defs>'
      + '<text class="bd-leg" x="4" y="20">' + legende.toUpperCase() + '</text>'
      + '<text class="bd-num" x="0" y="138">' + num + '</text>'
      + '<line class="bd-filet" x1="250" y1="75" x2="560" y2="75"/><line class="bd-filet fin" x1="250" y1="81" x2="560" y2="81"/>'
      + '<circle class="bd-rond-h" cx="640" cy="75" r="62" fill="url(#bd-h)"/><circle class="bd-rond" cx="640" cy="75" r="62"/><circle class="bd-rond fin" cx="640" cy="75" r="54"/>'
      + '<g class="bd-picto" transform="translate(604 39) scale(3)">' + paths + '</g>'
      + '<text class="bd-orn" x="405" y="62" text-anchor="middle">✣</text></svg>';
    prose.insertBefore(b, kicker && kicker.classList.contains("kicker") ? kicker : h1);
    // Les filets partent après le numéro : leur départ dépend de sa largeur réelle (« 05 » contre « M04 »).
    function placerFilets() {
      var t = b.querySelector(".bd-num"), w = 0;
      try { w = t.getComputedTextLength(); } catch (e) { w = 0; }
      if (!w) w = num.length * 80;
      var x1 = Math.min(Math.round(w + 30), 470);
      Array.prototype.forEach.call(b.querySelectorAll(".bd-filet"), function (l) { l.setAttribute("x1", x1); });
      b.querySelector(".bd-orn").setAttribute("x", Math.round((x1 + 560) / 2));
    }
    placerFilets();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placerFilets);
    // Lettrine seulement si le chapeau commence par une lettre (pas par « « » ni un chiffre).
    var lead = prose.querySelector(":scope > .lead");
    if (lead && /^\s*\p{L}/u.test(lead.textContent)) document.body.classList.add("lettrine");
    Array.prototype.forEach.call(prose.querySelectorAll(".phase"), function (ph) {
      var r = ROMAINS[ph.textContent.trim().toLowerCase()];
      if (r) { ph.setAttribute("data-romain", r); ph.classList.add("phase-bande"); }
    });
    ["quiz", "memo"].forEach(function (id) {
      var h = document.getElementById(id);
      if (h && h.tagName === "H2") h.parentNode.insertBefore(el("p", { "class": "ornement-sep", "aria-hidden": "true" }, "✣  ✣  ✣"), h);
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
  initCouvertures();
  initCours();
  initDone();
  renderProgress();
  initCopy();
  initTableaux();
  initMarge();
  initQuizzes();
  initApparition();
  initReprise();
  initRecherche();
  /* Après les autres scripts différés (jour.js, modules-ui.js…), qui construisent encore du texte. */
  if (document.readyState === "complete") initTypo(); else document.addEventListener("DOMContentLoaded", initTypo);

  window.IT = { store: store, el: el, icon: icon, picto: picto, isDone: isDone, renderProgress: renderProgress };
})();
