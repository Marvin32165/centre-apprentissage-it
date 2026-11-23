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
    if (!window.IT_RECHERCHE) { search.setAttribute("aria-disabled", "true"); search.title = "Recherche bientôt disponible"; }
    bar.appendChild(search);

    var themeBtn = el("button", { type: "button", "class": "icon-btn theme-btn" });
    function refreshThemeBtn() {
      var t = currentTheme(), next = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
      themeBtn.textContent = "";
      themeBtn.appendChild(icon(THEME_ICON[t]));
      themeBtn.setAttribute("aria-label", "Thème " + THEME_LABEL[t] + ". Passer au thème " + THEME_LABEL[next] + ".");
      themeBtn.title = "Thème " + THEME_LABEL[t];
    }
    themeBtn.addEventListener("click", function () {
      var next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
      store.set("theme", next);
      applyTheme(next);
      refreshThemeBtn();
    });
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
    footer.appendChild(fw);
    body.appendChild(footer);
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
    node.appendChild(el("span", null, done + " / " + total + " terminé" + (done > 1 ? "s" : "") + " (" + pct + " %)"));
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
  function parseDate(s) { var p = (s || "").split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) {
    return d.toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function initCountdown() {
    var node = document.querySelector("[data-countdown]");
    if (!node || !DATA.stage.debut) return;
    var start = parseDate(DATA.stage.debut), end = parseDate(DATA.stage.fin);
    var now = new Date(); now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var days = Math.round((start - now) / 86400000);
    var num, lbl;
    if (days > 0) {
      num = "J−" + days;
      lbl = (days === 1 ? "Dernier jour de préparation avant le début du stage : " : "jours avant le début du stage : ") + fmt(start) + ".";
    } else if (now <= end) {
      num = "En cours";
      lbl = "Le stage a commencé le " + fmt(start) + " et se termine le " + fmt(end) + ".";
    } else {
      num = "Terminé";
      lbl = "Le stage s'est terminé le " + fmt(end) + ".";
    }
    node.textContent = "";
    node.appendChild(el("div", { "class": "num" }, num));
    node.appendChild(el("p", { "class": "lbl" }, lbl));
  }

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
      wrap.appendChild(btn);
    });
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
            if (j === qu.reponse) lab.classList.add("bon");
            else if (j === chosen) lab.classList.add("faux");
          });
          fs.appendChild(el("p", { "class": "verdict " + (ok ? "bon" : "faux") }, ok ? "Bonne réponse." : "Pas tout à fait."));
          if (qu.explication) {
            var d = el("details", { "class": "correction" });
            d.appendChild(el("summary", null, "Voir la correction"));
            d.appendChild(el("p", null, qu.explication));
            fs.appendChild(d);
          }
        });
        var txt = score + " / " + quiz.questions.length;
        store.set("quiz." + id, txt);
        box.classList.add("corrige");
        submit.remove();
        out.textContent = "Score : " + txt + ".";
        var retry = el("button", { type: "button", "class": "btn ghost" }, "Recommencer");
        retry.addEventListener("click", function () { render(); box.scrollIntoView({ block: "start" }); });
        out.parentNode.appendChild(retry);
      }
    });
  }

  /* ---------- Démarrage ---------- */
  applyTheme(currentTheme());
  buildChrome();
  initSections();
  initDone();
  renderProgress();
  initCountdown();
  initCopy();
  initQuizzes();

  window.IT = { store: store, el: el, icon: icon, isDone: isDone, renderProgress: renderProgress };
})();
