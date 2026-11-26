/* Pages de jour (stage/j1.html à j10.html) : trois colonnes et tiroirs, sommaire actif, barre de lecture,
   minuteur de séance (it.seance.jN), matrice impact × urgence, mises en situation en tickets,
   clôture du jour avec tampon RÉSOLU (done.stage-jN, it.cloture.jN), fiche mémo imprimable.
   Le HTML des jours n'est pas modifié : tout est construit ici à partir du contenu existant. */
(function () {
  "use strict";
  var IT = window.IT, DATA = window.IT_DATA;
  var m = /j(\d+)\.html$/.exec(location.pathname);
  if (!IT || !m) return;
  var N = +m[1], el = IT.el, store = IT.store, UNIT = "stage-j" + N;
  var JOURS = (DATA.stage && DATA.stage.jours) || [];
  var main = document.getElementById("contenu");
  var prose = main && main.querySelector(".prose");
  if (!prose) return;
  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("page-jour");

  function txt(node) {
    var c = node.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll(".sec, .duree"), function (n) { n.remove(); });
    return c.textContent.replace(/\s+/g, " ").trim();
  }
  function dateCourte(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function aujourdhui() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

  /* ---------- Ligne de métadonnées sous le chapeau ---------- */
  (function () {
    var lead = prose.querySelector(".lead"), J = JOURS.filter(function (j) { return j.n === N; })[0];
    if (!lead || !J) return;
    var nSrc = prose.querySelectorAll(".callout.source").length;
    var tut = prose.querySelector(".callout.umons[data-titre]");
    var nTut = tut ? tut.querySelectorAll("li").length : 0;
    var items = [["Durée", J.duree.replace("≈ ", "≈\u00a0")], ["Blocs", String(J.blocs)]];
    if (nSrc) items.push(["Sources", nSrc + (nSrc > 1 ? " encadrés" : " encadré")]);
    if (nTut) items.push(["Tuteur", nTut + (nTut > 1 ? " questions" : " question")]);
    var dl = el("dl", { "class": "meta-page", "aria-label": "Repères du jour" });
    items.forEach(function (it) { var d = el("div"); d.appendChild(el("dt", null, it[0])); d.appendChild(el("dd", null, it[1])); dl.appendChild(d); });
    lead.parentNode.insertBefore(dl, lead.nextSibling);
  })();

  /* ---------- Trois colonnes ---------- */
  main.classList.add("jour-grille");
  var gauche = el("nav", { "class": "jour-jours tiroir", id: "tiroir-jours", "aria-label": "Les dix jours de la prépa" });
  var droite = el("aside", { "class": "jour-toc tiroir", id: "tiroir-sommaire", "aria-label": "Sur cette page" });
  main.insertBefore(gauche, prose);
  main.appendChild(droite);

  // Colonne gauche : les dix jours
  gauche.appendChild(el("p", { "class": "label" }, "Prépa · " + JOURS.length + " jours"));
  var ol = el("ol", { "class": "jours-liste" });
  JOURS.forEach(function (j) {
    var fait = IT.isDone("stage-j" + j.n);
    var a = el("a", { href: "j" + j.n + ".html" });
    a.appendChild(el("span", { "class": "jl-n" }, String(j.n).length < 2 ? "0" + j.n : String(j.n)));
    a.appendChild(el("span", { "class": "jl-t" }, j.court));
    if (fait) a.appendChild(el("span", { "class": "jl-fait", "aria-label": "terminé" }, "✓"));
    if (j.n === N) a.setAttribute("aria-current", "page");
    var li = el("li"); li.appendChild(a); ol.appendChild(li);
  });
  gauche.appendChild(ol);
  var outils = el("a", { "class": "jl-outils", href: "outils.html" }, "Boîte à outils");
  gauche.appendChild(outils);

  // Colonne droite : sommaire
  var h2s = Array.prototype.slice.call(prose.querySelectorAll("h2[id]"));
  droite.appendChild(el("p", { "class": "label" }, "Sur cette page"));
  var toc = el("ol", { "class": "toc-liste" });
  var liens = {};
  h2s.forEach(function (h) {
    var a = el("a", { href: "#" + h.id });
    if (h.getAttribute("data-sec")) a.appendChild(el("span", { "class": "toc-sec" }, "§" + h.getAttribute("data-sec")));
    a.appendChild(document.createTextNode(txt(h)));
    liens[h.id] = a;
    var li = el("li"); li.appendChild(a); toc.appendChild(li);
  });
  droite.appendChild(toc);

  /* ---------- Fil d'Ariane et tiroirs (moins de 1100 px) ---------- */
  var fil = el("nav", { "class": "fil", "aria-label": "Fil d'Ariane" });
  fil.appendChild(el("a", { href: "index.html" }, "Prépa stage"));
  fil.appendChild(el("span", { "aria-hidden": "true" }, "›"));
  fil.appendChild(el("span", { "aria-current": "page" }, "Jour " + N));
  var btnJours = el("button", { type: "button", "class": "fil-btn", "aria-controls": "tiroir-jours", "aria-expanded": "false" }, "Les " + JOURS.length + " jours");
  fil.appendChild(btnJours);
  prose.insertBefore(fil, prose.firstChild);

  var bar = document.querySelector(".site-header .bar");
  var btnSom = el("button", { type: "button", "class": "icon-btn sommaire-btn", "aria-controls": "tiroir-sommaire", "aria-expanded": "false", "aria-label": "Sommaire de la page" });
  btnSom.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>';
  if (bar) bar.insertBefore(btnSom, bar.querySelector(".theme-btn"));

  var voile = el("div", { "class": "tiroir-voile", hidden: "" });
  document.body.appendChild(voile);
  var ouvert = null;
  function fermerTiroir() {
    if (!ouvert) return;
    var t = ouvert;
    t.panneau.classList.remove("ouvert");
    t.panneau.removeAttribute("role"); t.panneau.removeAttribute("aria-modal");
    t.btn.setAttribute("aria-expanded", "false");
    voile.hidden = true;
    ouvert = null;
    t.btn.focus();
  }
  function ouvrirTiroir(panneau, btn) {
    fermerTiroir();
    panneau.classList.add("ouvert");
    panneau.setAttribute("role", "dialog"); panneau.setAttribute("aria-modal", "true");
    btn.setAttribute("aria-expanded", "true");
    voile.hidden = false;
    ouvert = { panneau: panneau, btn: btn };
    var cible = panneau.querySelector("[aria-current], a");
    if (cible) cible.focus();
  }
  btnJours.addEventListener("click", function () { ouvrirTiroir(gauche, btnJours); });
  btnSom.addEventListener("click", function () { ouvrirTiroir(droite, btnSom); });
  voile.addEventListener("click", fermerTiroir);
  [gauche, droite].forEach(function (p) {
    p.addEventListener("keydown", function (e) {
      if (!ouvert || ouvert.panneau !== p) return;
      if (e.key === "Escape") { e.preventDefault(); fermerTiroir(); }
      if (e.key === "Tab") {
        var f = p.querySelectorAll("a, button");
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    p.addEventListener("click", function (e) { if (ouvert && e.target.closest("a")) { var t = ouvert; t.panneau.classList.remove("ouvert"); t.panneau.removeAttribute("role"); t.panneau.removeAttribute("aria-modal"); t.btn.setAttribute("aria-expanded", "false"); voile.hidden = true; ouvert = null; } });
  });
  window.addEventListener("resize", function () { if (ouvert && window.innerWidth >= 1100) fermerTiroir(); });

  /* ---------- Sommaire actif et barre de lecture ---------- */
  function majSommaire() {
    var actif = h2s[0] ? h2s[0].id : null;
    h2s.forEach(function (h) { if (h.getBoundingClientRect().top < window.innerHeight * 0.3) actif = h.id; });
    Object.keys(liens).forEach(function (id) {
      if (id === actif) liens[id].setAttribute("aria-current", "location"); else liens[id].removeAttribute("aria-current");
    });
  }
  var header = document.querySelector(".site-header");
  if (header) {
    var rb = el("div", { "class": "read-bar", "aria-hidden": "true" });
    var rbs = el("span");
    rb.appendChild(rbs);
    header.appendChild(rb);
    var attente = false;
    var maj = function () {
      attente = false;
      majSommaire();
      var de = document.documentElement, max = de.scrollHeight - window.innerHeight;
      rbs.style.setProperty("--lu", max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : "0");
    };
    window.addEventListener("scroll", function () { if (!attente) { attente = true; requestAnimationFrame(maj); } }, { passive: true });
    maj();
  }

  /* ---------- Minuteur de séance ---------- */
  var plan = prose.querySelector(".plan-horaire");
  if (plan) (function () {
    var lis = Array.prototype.slice.call(plan.querySelectorAll("li"));
    var blocs = lis.map(function (li) {
      var h = li.querySelector(".h"), d = h ? h.textContent : "";
      var mh = /(\d+)\s*h/.exec(d), mm = /(\d+)\s*min/.exec(d), mhm = /h\s*(\d+)\s*$/.exec(d.trim());
      var min = (mh ? +mh[1] * 60 : 0) + (mm ? +mm[1] : 0) + (!mm && mhm ? +mhm[1] : 0);
      var t = h ? li.textContent.replace(h.textContent, "").trim() : li.textContent.trim();
      return { d: d.trim(), min: min || 30, t: t };
    });
    var CLE = "seance.j" + N;
    var st = { bloc: 0, restant: blocs[0].min * 60, marche: false, depuis: 0, fini: false };
    try { var lu = JSON.parse(store.get(CLE) || "null"); if (lu && typeof lu.bloc === "number" && blocs[lu.bloc]) st = lu; } catch (e) { /* état neuf */ }
    function sauver() { store.set(CLE, JSON.stringify(st)); }
    function restant() { return st.marche ? Math.max(0, st.restant - Math.floor((Date.now() - st.depuis) / 1000)) : st.restant; }
    function fmt(s) { var mn = Math.floor(s / 60), sc = s % 60; return (mn < 10 ? "0" : "") + mn + ":" + (sc < 10 ? "0" : "") + sc; }

    var panneau = el("section", { "class": "seance", "aria-label": "Minuteur de séance" });
    var haut = el("div", { "class": "seance-haut" });
    var info = el("div", { "class": "seance-info" });
    var lbl = el("p", { "class": "seance-lbl" });
    var titre = el("p", { "class": "seance-titre" });
    info.appendChild(lbl); info.appendChild(titre);
    var cmd = el("div", { "class": "seance-cmd" });
    var temps = el("span", { "class": "seance-temps", role: "timer", "aria-label": "Temps restant du bloc" });
    var bGo = el("button", { type: "button", "class": "btn seance-go" });
    var bNext = el("button", { type: "button", "class": "btn seance-next" }, "Bloc suivant");
    cmd.appendChild(temps); cmd.appendChild(bGo); cmd.appendChild(bNext);
    haut.appendChild(info); haut.appendChild(cmd);
    panneau.appendChild(haut);
    var segs = el("ol", { "class": "seance-segs", "aria-label": "Blocs de la séance" });
    var segEls = blocs.map(function (b, i) {
      var li = el("li", { title: b.t });
      li.style.flexGrow = String(b.min);
      li.appendChild(el("span", { "class": "sr-only" }, "Bloc " + (i + 1) + " : " + b.t + ", "));
      li.appendChild(el("span", { "class": "seg-d" }, b.d));
      segs.appendChild(li);
      return li;
    });
    panneau.appendChild(segs);
    var det = el("details", { "class": "seance-plan" });
    det.appendChild(el("summary", null, "Détail du plan"));
    plan.parentNode.insertBefore(panneau, plan);
    det.appendChild(plan);
    panneau.appendChild(det);
    var annonce = el("p", { "class": "sr-only", "aria-live": "polite" });
    panneau.appendChild(annonce);
    var raz = el("button", { type: "button", "class": "seance-raz" }, "Recommencer la séance");
    panneau.appendChild(raz);

    // Pastille flottante (mobile)
    var pastille = el("div", { "class": "seance-pastille", hidden: "" });
    var pT = el("span", { "class": "pt-temps" });
    var pI = el("span", { "class": "pt-info" });
    var pB = el("button", { type: "button", "class": "pt-btn" });
    pastille.appendChild(pT); pastille.appendChild(pI); pastille.appendChild(pB);
    document.body.appendChild(pastille);
    var panneauVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { panneauVisible = e[0].isIntersecting; rendre(); }).observe(panneau);
    }

    var ICON_PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 5v14l12-7z"/></svg>';
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
    function rendre() {
      var r = restant();
      var b = blocs[st.bloc];
      lbl.textContent = st.fini ? "Séance terminée" : "Séance · bloc " + (st.bloc + 1) + " / " + blocs.length;
      titre.textContent = st.fini ? "Les " + blocs.length + " blocs sont faits. Passe à la clôture du jour." : b.t;
      temps.textContent = st.fini ? "00:00" : fmt(r);
      bGo.innerHTML = (st.marche ? ICON_PAUSE : ICON_PLAY) + "<span>" + (st.marche ? "Pause" : (r < b.min * 60 && !st.fini ? "Reprendre" : "Démarrer")) + "</span>";
      bGo.disabled = st.fini; bNext.disabled = st.fini;
      segEls.forEach(function (s, i) {
        s.className = st.fini || i < st.bloc ? "fait" : i === st.bloc ? "courant" : "";
        if (i === st.bloc && !st.fini) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
      });
      lis.forEach(function (li, i) { li.className = st.fini || i < st.bloc ? "fait" : i === st.bloc ? "courant" : ""; });
      var demarree = st.marche || st.bloc > 0 || r < blocs[0].min * 60;
      pastille.hidden = panneauVisible || !demarree || st.fini;
      pT.textContent = fmt(r);
      pI.textContent = "";
      pI.appendChild(document.createTextNode("Bloc " + (st.bloc + 1) + " / " + blocs.length));
      pI.appendChild(el("span", null, b.t));
      pB.innerHTML = st.marche ? ICON_PAUSE : ICON_PLAY;
      pB.setAttribute("aria-label", st.marche ? "Mettre la séance en pause" : "Reprendre la séance");
    }
    function basculer() {
      if (st.fini) return;
      if (st.marche) { st.restant = restant(); st.marche = false; annonce.textContent = "Pause."; }
      else { st.marche = true; st.depuis = Date.now(); annonce.textContent = "Bloc " + (st.bloc + 1) + " en cours : " + blocs[st.bloc].t + "."; }
      sauver(); rendre();
    }
    function suivant(auto) {
      if (st.bloc >= blocs.length - 1) { st.fini = true; st.marche = false; st.restant = 0; annonce.textContent = "Séance terminée."; }
      else {
        st.bloc++; st.restant = blocs[st.bloc].min * 60;
        if (auto) st.marche = false; else if (st.marche) st.depuis = Date.now();
        annonce.textContent = (auto ? "Bloc terminé. " : "") + "Bloc " + (st.bloc + 1) + " : " + blocs[st.bloc].t + ".";
      }
      sauver(); rendre();
    }
    bGo.addEventListener("click", basculer);
    pB.addEventListener("click", basculer);
    bNext.addEventListener("click", function () { suivant(false); });
    raz.addEventListener("click", function () { st = { bloc: 0, restant: blocs[0].min * 60, marche: false, depuis: 0, fini: false }; sauver(); annonce.textContent = "Séance remise à zéro."; rendre(); });
    setInterval(function () {
      if (!st.marche) return;
      if (restant() <= 0) { st.marche = false; suivant(true); return; }
      temps.textContent = fmt(restant()); pT.textContent = temps.textContent;
    }, 1000);
    rendre();
  })();

  /* ---------- Matrice impact × urgence (jour 1) ---------- */
  Array.prototype.forEach.call(prose.querySelectorAll("table"), function (tb) {
    var th0 = tb.querySelector("thead th");
    if (!th0 || !/Impact/.test(th0.textContent) || !/Urgence/.test(th0.textContent)) return;
    var urg = Array.prototype.slice.call(tb.querySelectorAll("thead th")).slice(1).map(function (t) { return t.textContent.trim(); });
    var rows = Array.prototype.slice.call(tb.querySelectorAll("tbody tr"));
    var wrap = tb.closest(".table-wrap") || tb;
    var box = el("div", { "class": "matrice" });
    box.appendChild(el("p", { "class": "matrice-aide" }, "Touche une case : la priorité se lit au croisement de l'impact (lignes) et de l'urgence (colonnes)."));
    var grille = el("div", { "class": "matrice-grille", role: "group", "aria-label": "Matrice impact × urgence" });
    grille.appendChild(el("span"));
    urg.forEach(function (u) { grille.appendChild(el("span", { "class": "matrice-col" }, "Urgence " + u.toLowerCase())); });
    var expl = el("p", { "class": "matrice-expl", "aria-live": "polite" }, "Choisis une case pour lire l'explication.");
    var boutons = [];
    rows.forEach(function (tr) {
      var imp = tr.querySelector("th").textContent.trim();
      grille.appendChild(el("span", { "class": "matrice-lig" }, "Impact " + imp.charAt(0).toLowerCase() + imp.slice(1)));
      Array.prototype.forEach.call(tr.querySelectorAll("td"), function (td, j) {
        var p = td.textContent.trim(), niv = (/P(\d)/.exec(p) || [0, 4])[1];
        var b = el("button", { type: "button", "class": "matrice-case p" + niv, "aria-pressed": "false" }, p);
        b.setAttribute("aria-label", "Impact " + imp + ", urgence " + urg[j] + " : " + p);
        b.addEventListener("click", function () {
          boutons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          expl.textContent = "Impact " + imp.toLowerCase() + " × urgence " + urg[j].toLowerCase() + " → " + p + ".";
        });
        boutons.push(b);
        grille.appendChild(b);
      });
    });
    box.appendChild(grille);
    box.appendChild(expl);
    wrap.parentNode.insertBefore(box, wrap);
    wrap.classList.add("matrice-source");
  });

  /* ---------- Mises en situation en tickets ---------- */
  ["cas", "appels"].forEach(function (id) {
    var h2 = document.getElementById(id);
    if (!h2) return;
    var n = 0, node = h2.nextElementSibling;
    while (node && node.tagName !== "H2") {
      var next = node.nextElementSibling;
      if (node.tagName === "H3") {
        n++;
        var art = el("article", { "class": "ticket-cas" });
        var tete = el("header", { "class": "cas-tete" });
        tete.appendChild(el("span", { "class": "cas-id" }, (id === "appels" ? "APPEL-" : "CAS-") + (n < 10 ? "0" : "") + n));
        tete.appendChild(el("span", { "class": "cas-jour" }, "Jour " + N));
        var statut = el("span", { "class": "cas-statut" }, "À trier");
        tete.appendChild(statut);
        var corps = el("div", { "class": "cas-corps" });
        node.parentNode.insertBefore(art, node);
        art.appendChild(tete); art.appendChild(corps);
        node.textContent = node.textContent.replace(/^\s*(\d+\.\s+|Appel\s+\d+\s+—\s+)/, "");
        corps.appendChild(node);
        var s = next;
        while (s && s.tagName !== "H3" && s.tagName !== "H2") {
          var s2 = s.nextElementSibling;
          if (s.matches("details.correction")) {
            var sm = s.querySelector("summary");
            if (sm && /^Voir la correction$/.test(sm.textContent.trim())) sm.textContent = "J'ai répondu : voir la résolution";
            var lab = el("p", { "class": "cas-resolution" }, "Résolution");
            sm.parentNode.insertBefore(lab, sm.nextSibling);
            (function (d, st) { d.addEventListener("toggle", function () { if (d.open) { st.textContent = "Résolution lue"; st.classList.add("lu"); } }); })(s, statut);
          }
          corps.appendChild(s);
          s = s2;
        }
        next = s;
      }
      node = next;
    }
  });

  /* ---------- Fiche mémo : carte d'aperçu et version imprimable ---------- */
  var memo = document.getElementById("memo");
  var tuteur = prose.querySelector('.callout.umons[data-titre]');
  if (memo) {
    var carte = el("div", { "class": "memo-carte" });
    carte.appendChild(el("p", { "class": "label" }, "Fiche mémo"));
    carte.appendChild(el("p", null, "Une page A4 à garder près du téléphone."));
    var bPrint = el("button", { type: "button", "class": "btn ghost" });
    bPrint.appendChild(IT.icon("print")); bPrint.appendChild(el("span", null, "Aperçu et impression"));
    bPrint.addEventListener("click", function () { window.print(); });
    carte.appendChild(bPrint);
    if (tuteur) {
      var nq = tuteur.querySelectorAll("li").length;
      carte.appendChild(el("a", { "class": "memo-tuteur", href: "#memo" }, nq + " question" + (nq > 1 ? "s" : "") + " pour le tuteur, à poser sur place"));
    }
    droite.appendChild(carte);

    // Version imprimable (masquée à l'écran)
    var fiche = el("section", { "class": "fiche-print", "aria-hidden": "true" });
    var fh = el("header", { "class": "fp-tete" });
    var fht = el("div");
    fht.appendChild(el("p", { "class": "fp-kicker" }, "Fiche mémo · Prépa stage · Jour " + N));
    var h1 = prose.querySelector("h1");
    fht.appendChild(el("p", { "class": "fp-titre" }, h1 ? h1.textContent.trim() : ""));
    fh.appendChild(fht);
    fh.appendChild(el("span", { "class": "stamp" }, "IT"));
    fiche.appendChild(fh);
    var lignes = el("div", { "class": "fp-lignes" });
    var n2 = memo.nextElementSibling;
    while (n2 && n2.tagName !== "H2" && !n2.contains(tuteur) && n2 !== tuteur) {
      Array.prototype.forEach.call(n2.querySelectorAll("li"), function (li) {
        var c = li.cloneNode(true), st = c.querySelector("strong"), k = "";
        if (st && c.firstChild === st && st.nextSibling && st.nextSibling.nodeType === 3 && /^\s*[:=,]/.test(st.nextSibling.nodeValue)) { k = st.textContent; st.remove(); }
        var row = el("div", { "class": "fp-ligne" });
        row.appendChild(el("span", { "class": "fp-k" }, k));
        var v = el("span", { "class": "fp-v" });
        v.innerHTML = c.innerHTML.replace(/^(\s|&nbsp;|\u00a0|\u202f)*[:=,](\s|&nbsp;)*/, "");
        row.appendChild(v);
        lignes.appendChild(row);
      });
      n2 = n2.nextElementSibling;
    }
    fiche.appendChild(lignes);
    var src = main.querySelector(".matrice-source table");
    if (src) {
      var mx = el("div", { "class": "fp-matrice" });
      mx.appendChild(el("p", { "class": "fp-k" }, "Matrice d'exemple · chaque organisation définit la sienne"));
      mx.appendChild(src.cloneNode(true));
      fiche.appendChild(mx);
    }
    if (tuteur) {
      var q = el("div", { "class": "fp-tuteur" });
      q.appendChild(el("p", { "class": "fp-k" }, "À demander au tuteur · à l'UMONS"));
      var lst = tuteur.querySelector("ul, ol");
      if (lst) { var ol2 = el("ol"); ol2.innerHTML = lst.innerHTML; q.appendChild(ol2); }
      fiche.appendChild(q);
    }
    var source = prose.querySelector(".callout.source");
    var pied = el("footer", { "class": "fp-pied" });
    pied.appendChild(el("span", null, source ? "Source : " + source.textContent.replace(/\s+/g, " ").trim() : ""));
    pied.appendChild(el("span", null, "Apprentissage IT"));
    fiche.appendChild(pied);
    main.appendChild(fiche);
    document.body.classList.add("a-fiche");
  }

  /* ---------- Clôture du jour et tampon RÉSOLU ---------- */
  var box = prose.querySelector('input[data-done="' + UNIT + '"]');
  var lab2 = box && box.closest("p, label");
  var clo = el("section", { "class": "cloture", "aria-label": "Clôture du jour" });
  var cTxt = el("div", { "class": "cloture-txt" });
  cTxt.appendChild(el("p", { "class": "cloture-q" }, "Tu as fait le tour du jour " + N + " ?"));
  cTxt.appendChild(el("p", { "class": "cloture-aide" }, memo ? "Quiz, fiche mémo et questions pour le tuteur sont plus haut." : "Relis la check-list avant le premier jour."));
  var bClo = el("button", { type: "button", "class": "btn vert" });
  var tampon = el("div", { "class": "tampon", "aria-hidden": "true" });
  var tamponTxt = el("span", { "class": "tampon-mot" }, "RÉSOLU");
  var tamponDate = el("span", { "class": "tampon-date" });
  tampon.appendChild(tamponTxt); tampon.appendChild(tamponDate);
  var cAnnonce = el("p", { "class": "sr-only", "aria-live": "polite" });
  clo.appendChild(cTxt); clo.appendChild(bClo); clo.appendChild(tampon); clo.appendChild(cAnnonce);
  if (lab2) lab2.parentNode.replaceChild(clo, lab2);
  else { var nav = prose.querySelector(".jours-nav"); prose.insertBefore(clo, nav || null); }
  function rendreCloture(anime) {
    var fait = IT.isDone(UNIT);
    var d = store.get("cloture.j" + N);
    clo.classList.toggle("faite", fait);
    tampon.classList.toggle("pose", fait && anime && !reduit);
    tamponDate.textContent = "Jour " + N + (d ? " · " + dateCourte(d) : "");
    bClo.textContent = fait ? "Rouvrir le jour " + N : "Clôturer le jour " + N;
    bClo.className = fait ? "btn ghost" : "btn vert";
    bClo.setAttribute("aria-pressed", fait ? "true" : "false");
    cTxt.querySelector(".cloture-q").textContent = fait ? "Jour " + N + " résolu" + (d ? " le " + dateCourte(d) : "") + "." : "Tu as fait le tour du jour " + N + " ?";
  }
  bClo.addEventListener("click", function () {
    if (IT.isDone(UNIT)) { store.del("done." + UNIT); store.del("cloture.j" + N); cAnnonce.textContent = "Jour " + N + " rouvert."; }
    else { store.set("done." + UNIT, "1"); store.set("cloture.j" + N, aujourdhui()); cAnnonce.textContent = "Jour " + N + " clôturé : résolu."; }
    rendreCloture(true);
    if (IT.renderProgress) IT.renderProgress();
    var lien = gauche.querySelector('a[aria-current="page"]');
    if (lien) { var f = lien.querySelector(".jl-fait"); if (IT.isDone(UNIT) && !f) lien.appendChild(el("span", { "class": "jl-fait", "aria-label": "terminé" }, "✓")); else if (!IT.isDone(UNIT) && f) f.remove(); }
  });
  rendreCloture(false);
})();
