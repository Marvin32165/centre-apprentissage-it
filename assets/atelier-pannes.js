/* Atelier hardware — lot 6 : pannes. Interface : catalogue, dossier de panne (apprentissage ou test noté), évaluation. */
(function () {
  "use strict";
  var A = window.IT_ATELIER, T = window.IT_PANNES, Art = window.IT_ATELIER_ART;
  var host = document.getElementById("pannes");
  if (!host || !A || !T || !Art) return;

  var params = new URLSearchParams(location.search);
  var store = (window.IT && window.IT.store) || { get: function () { return null; }, set: function () {}, del: function () {} };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EVAL = host.getAttribute("data-eval") === "1";
  var SEUIL = A.pannesEval.seuil;
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function entete(titre, kicker) {
    host.textContent = "";
    var h = el("header", { "class": "at-head" });
    h.appendChild(el("p", { "class": "kicker" }, kicker));
    h.appendChild(el("h1", null, titre));
    host.appendChild(h);
    window.scrollTo(0, 0);
    return h;
  }
  function trier(liste) { return liste.slice().sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); }); }

  /* ---------- Progression ---------- */
  function marquerPanne(id) {
    store.set("panne." + id, "1");
    var tout = Object.keys(A.pannes).every(function (k) { return store.get("panne." + k) === "1"; });
    if (tout) store.set("done." + A.pannesUnite, "1");
  }

  /* ---------- Catalogue ---------- */
  function catalogue() {
    entete("Pannes : diagnostiquer et réparer", "Atelier hardware · Pannes");
    var b = el("div", { "class": "prose" });
    b.appendChild(el("p", { "class": "lead" }, "Un utilisateur décrit un symptôme. Tu inspectes le PC, tu poses un diagnostic, puis tu répares ou tu remplaces la bonne pièce. Les pièces et les mesures sont des modèles génériques."));
    var c = el("div", { "class": "callout retenir" });
    c.appendChild(el("p", null, "Deux modes : « apprentissage » (indices, explications, corrigé caché) et « test noté » (sans aide, sur 100 : diagnostic 40, réparation 30, observation utile 20, sécurité 10). Avant toute intervention, mets le PC hors tension."));
    b.appendChild(c);
    host.appendChild(b);
    var g = el("div", { "class": "grid cols-3" });
    Object.keys(A.pannes).forEach(function (id, i) {
      var p = A.pannes[id], fait = store.get("panne." + id) === "1", best = parseInt(store.get("score.panne." + id), 10);
      var card = el("div", { "class": "card" });
      card.appendChild(el("p", { "class": "kicker" }, "Dossier " + (i + 1) + " · " + p.niveau));
      card.appendChild(el("h3", null, p.titre));
      card.appendChild(el("p", { "class": "muted" }, p.contexte));
      var l = el("p", { "class": "at-liens" });
      l.appendChild(el("a", { "class": "btn", href: "pannes.html?p=" + id }, "Apprentissage"));
      l.appendChild(el("a", { "class": "btn ghost", href: "pannes.html?p=" + id + "&m=test" }, "Test noté"));
      card.appendChild(l);
      var t = [];
      if (!isNaN(best)) t.push("Meilleur test : " + best + " / 100");
      if (fait) t.push("Résolue ✓");
      card.appendChild(el("p", { "class": "muted at-score-ligne" }, t.join(" · ")));
      g.appendChild(card);
    });
    host.appendChild(g);
    var ev = el("div", { "class": "card" });
    ev.appendChild(el("h3", null, "Évaluation : cinq pannes tirées au sort"));
    ev.appendChild(el("p", null, "Cinq dossiers enchaînés, sans aide, notés sur 100. À la fin : un rapport des points à revoir."));
    ev.appendChild(el("p", { "class": "at-liens" })).appendChild(el("a", { "class": "btn", href: "pannes-eval.html" }, "Commencer l'évaluation"));
    host.appendChild(el("h2", null, "Évaluation"));
    host.appendChild(ev);
  }

  /* ---------- Un dossier de panne ---------- */
  function dossier(id, ctx) {
    ctx = ctx || {};
    var p = A.pannes[id];
    if (!p) { host.textContent = "Panne introuvable."; return; }
    var TEST = ctx.mode === "test";
    var KEY = "atelier.panne." + id + (ctx.cle ? "." + ctx.cle : (TEST ? ".test" : ""));
    var run = T.nouveau(p, TEST ? "test" : "apprentissage");
    var post = null, fini = false, finTimer = null, giveTimer = null, postTimer = null;

    function save() { store.set(KEY, JSON.stringify(run)); }
    function load() {
      var raw = store.get(KEY);
      if (!raw) return;
      try {
        var d = JSON.parse(raw);
        if (d && d.id === id && d.placed) { Object.keys(run).forEach(function (k) { if (d[k] !== undefined) run[k] = d[k]; }); }
      } catch (e) { /* sauvegarde illisible : on repart de zéro */ }
    }

    /* Squelette */
    host.textContent = "";
    host.insertAdjacentHTML("afterbegin", Art.DEFS);
    var num = Object.keys(A.pannes).indexOf(id) + 1;
    var head = el("header", { "class": "at-head" });
    head.innerHTML = '<p class="kicker"></p><h1></h1><div class="at-badges"></div><p class="at-modes"></p>';
    head.querySelector(".kicker").textContent = "Atelier hardware · Pannes" + (ctx.eval ? " · Évaluation, dossier " + (ctx.eval.i + 1) + " / " + ctx.eval.n : " · Dossier " + num);
    head.querySelector("h1").textContent = p.titre;
    [[TEST ? "Test noté" : "Apprentissage", true], [p.niveau, false]].forEach(function (b) { head.querySelector(".at-badges").appendChild(el("span", { "class": "badge" + (b[1] ? " mode" : "") }, b[0])); });
    if (!ctx.eval) head.querySelector(".at-modes").appendChild(el("a", { href: "pannes.html?p=" + id + (TEST ? "" : "&m=test") }, TEST ? "Passer en mode apprentissage (indices)" : "Passer en mode test (sans aide, noté)"));
    host.appendChild(head);

    var ticket = el("section", { "class": "bloc pn-ticket", "aria-label": "Ticket reçu" });
    ticket.appendChild(el("p", { "class": "kicker" }, "Ticket reçu au service desk"));
    ticket.appendChild(el("p", { "class": "at-client" }, p.ticket));
    ticket.appendChild(el("p", { "class": "muted" }, "Contexte : " + p.contexte));
    var src = el("aside", { "class": "callout source" });
    src.appendChild(el("p", null, "Les LED de debug, les bips et la liste des processeurs compatibles dépendent de la carte mère : la source de référence est son manuel et la page de support du constructeur. Tolérances des tensions d'une alimentation : spécification ATX (±5 % sur +12 V, +5 V, +3,3 V). Théorie : jour 9 de la prépa (matériel et PC) et jour 8 (méthode de diagnostic)."));
    ticket.appendChild(src);
    host.appendChild(ticket);

    var layout = el("div", { "class": "at-layout" });
    var main = el("div", { "class": "at-main" }), side = el("div", { "class": "at-side" });
    layout.appendChild(main); layout.appendChild(side); host.appendChild(layout);

    var scene = el("div", { "class": "at-scene pn-scene" });
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "at-svg"); svg.setAttribute("viewBox", "0 0 420 610"); svg.setAttribute("role", "img");
    scene.appendChild(svg); main.appendChild(scene);

    var actions = el("div", { "class": "at-actions" });
    var bTension = el("button", { type: "button", "class": "btn ghost", "aria-pressed": "false" });
    var bPower = el("button", { type: "button", "class": "btn" }, "Appuyer sur le bouton marche");
    var bHint = el("button", { type: "button", "class": "btn ghost" }, "Indice");
    var bGive = el("button", { type: "button", "class": "btn ghost" }, TEST ? "Terminer le test" : "Voir la solution");
    [bTension, bPower].concat(TEST ? [] : [bHint]).concat([bGive]).forEach(function (b) { actions.appendChild(b); });
    main.appendChild(actions);
    var msgBox = el("p", { "class": "at-msg", role: "status", "aria-live": "polite" });
    main.appendChild(msgBox);
    var secPost = el("section", { "class": "at-post bloc", hidden: "", "aria-label": "Démarrage du PC" });
    main.appendChild(secPost);

    var secOutils = el("section", { "class": "bloc pn-outils", "aria-label": "Outils d'inspection" });
    var secCarnet = el("section", { "class": "pn-carnet-box", "aria-label": "Carnet de bord" });
    var secDiag = el("section", { "class": "bloc pn-diag", "aria-label": "Diagnostic et intervention" });
    var secIndices = el("section", { "class": "pn-indices", "aria-label": "Indices" });
    var secCorrige = el("section", { "class": "pn-corrige", "aria-label": "Corrigé" });
    [secOutils, secCarnet, secDiag, secIndices, secCorrige].forEach(function (s) { side.appendChild(s); });

    function msg(t, niv) { msgBox.className = "at-msg " + (niv || "info"); msgBox.textContent = t; }

    /* Scène : face avant du PC, bouton marche et LED. */
    function renderScene() {
      var etat = (!run.hors && post) ? post.code : null;
      svg.setAttribute("aria-label", "Face avant du PC. " + (run.hors ? "Hors tension, câble secteur débranché." : "Sous tension."));
      svg.innerHTML = Art.faceVue({ placed: run.placed, etatPost: etat === "avert" ? "x" : etat }) +
        (run.hors ? '<rect x="40" y="16" width="340" height="580" rx="12" fill="rgba(0,0,0,.45)"/><text x="210" y="320" text-anchor="middle" font-size="17" font-family="IBM Plex Mono, monospace" fill="#EDE6DA" letter-spacing="2">HORS TENSION</text><text x="210" y="344" text-anchor="middle" font-size="11" font-family="IBM Plex Mono, monospace" fill="#BBAF9F">interrupteur sur O, câble débranché</text>' : "");
      bTension.textContent = run.hors ? "Rebrancher (interrupteur sur I)" : "Mettre hors tension (O + débrancher)";
      bTension.setAttribute("aria-pressed", run.hors ? "true" : "false");
    }

    /* Outils */
    function renderOutils() {
      secOutils.textContent = "";
      secOutils.appendChild(el("h2", null, "Outils d'inspection"));
      secOutils.appendChild(el("p", { "class": "muted pn-note" }, "Ouvrir le boîtier, tester ou remplacer une pièce : PC hors tension. Observer les LED, les bips ou l'UEFI : PC sous tension."));
      var l = el("div", { "class": "pn-outils-liste" });
      A.pannesOutils.forEach(function (o) {
        if (o.id === "temoin") return;
        var b = el("button", { type: "button", "class": "btn ghost pn-outil", "data-outil": o.id });
        b.appendChild(el("span", { "class": "n" }, o.nom));
        b.appendChild(el("span", { "class": "aide" }, o.aide + (o.hors ? " (hors tension)" : " (sous tension)")));
        b.addEventListener("click", function () { utiliser(o.id); });
        l.appendChild(b);
      });
      secOutils.appendChild(l);
      var row = el("div", { "class": "pn-temoin" });
      var lab = el("label", { "for": "pn-temoin-sel" }, "Pièce témoin (hors tension)");
      var sel = el("select", { id: "pn-temoin-sel" });
      A.pannesTemoins.forEach(function (t) { sel.appendChild(el("option", { value: t[0] }, t[1])); });
      var go = el("button", { type: "button", "class": "btn ghost" }, "Essayer");
      go.addEventListener("click", function () { utiliser("temoin", sel.value); });
      row.appendChild(lab); row.appendChild(sel); row.appendChild(go);
      secOutils.appendChild(row);
    }
    function utiliser(id, arg) {
      if (fini) return;
      var r = T.outil(p, run, id, arg);
      save();
      if (!r.ok) { msg(r.texte, r.niveau); return; }
      var nom = T.nomOutil(id) + (id === "temoin" ? " (" + (A.pannesTemoins.filter(function (t) { return t[0] === arg; })[0] || [0, arg])[1] + ")" : "");
      run.journal.push({ o: nom, t: r.texte });
      save(); msg(nom + " : résultat ajouté au carnet de bord.", "info"); renderCarnet();
    }
    function renderCarnet() {
      secCarnet.textContent = "";
      secCarnet.appendChild(el("h2", null, "Carnet de bord"));
      if (!run.journal.length) { secCarnet.appendChild(el("p", { "class": "muted" }, "Rien noté pour l'instant. Allume le PC pour voir le symptôme, puis utilise les outils.")); return; }
      var ol = el("ol", { "class": "pn-carnet", "aria-live": "polite" });
      run.journal.slice().reverse().forEach(function (e) {
        var li = el("li");
        li.appendChild(el("strong", null, e.o));
        li.appendChild(el("span", null, e.t));
        ol.appendChild(li);
      });
      secCarnet.appendChild(ol);
    }

    /* Diagnostic et intervention */
    function renderDiag() {
      secDiag.textContent = "";
      secDiag.appendChild(el("h2", null, "Diagnostic et réparation"));
      var d1 = el("div", { "class": "pn-champ" });
      d1.appendChild(el("label", { "for": "pn-cause" }, "Cause de la panne"));
      var s1 = el("select", { id: "pn-cause" });
      s1.appendChild(el("option", { value: "" }, "Choisir une cause…"));
      trier(A.pannesCauses).forEach(function (c) { s1.appendChild(el("option", { value: c.id }, c.nom)); });
      var b1 = el("button", { type: "button", "class": "btn" }, "Poser ce diagnostic");
      b1.addEventListener("click", function () {
        if (fini) return;
        if (!s1.value) { msg("Choisis d'abord une cause dans la liste.", "bloque"); return; }
        var r = T.diagnostiquer(p, run, s1.value);
        save();
        if (TEST) msg("Diagnostic enregistré : « " + T.causeNom(s1.value) + " ». Passe à la réparation, ou continue d'inspecter.", "info");
        else if (r.ok) msg("Diagnostic confirmé ✓ « " + T.causeNom(s1.value) + " ». Passe à la réparation.", "ok");
        else msg("Ce n'est pas la bonne piste. Retourne observer : relis le carnet de bord, essaie un autre outil ou demande un indice.", "attention");
        renderDiag();
      });
      d1.appendChild(s1); d1.appendChild(b1);
      secDiag.appendChild(d1);
      if (run.diag.length) secDiag.appendChild(el("p", { "class": "muted" }, "Dernier diagnostic posé : " + T.causeNom(run.diag[run.diag.length - 1]) + "."));
      var d2 = el("div", { "class": "pn-champ" });
      d2.appendChild(el("label", { "for": "pn-inter" }, "Intervention (PC hors tension)"));
      var s2 = el("select", { id: "pn-inter" });
      s2.appendChild(el("option", { value: "" }, "Choisir une intervention…"));
      trier(Object.keys(A.pannesInter).map(function (k) { return { id: k, nom: A.pannesInter[k].nom }; })).forEach(function (c) { s2.appendChild(el("option", { value: c.id }, c.nom)); });
      var b2 = el("button", { type: "button", "class": "btn" }, "Intervenir");
      b2.addEventListener("click", function () {
        if (fini) return;
        if (!run.diag.length) { msg("Pose d'abord un diagnostic : on ne remplace pas une pièce au hasard.", "bloque"); return; }
        if (!s2.value) { msg("Choisis d'abord une intervention dans la liste.", "bloque"); return; }
        var r = T.intervenir(p, run, s2.value);
        save(); post = null;
        msg(r.texte + (r.ok ? " Rebranche le PC et allume-le pour vérifier." : ""), r.ok ? "ok" : r.niveau);
        renderAll();
      });
      d2.appendChild(s2); d2.appendChild(b2);
      secDiag.appendChild(d2);
      if (run.interFausses.length) secDiag.appendChild(el("p", { "class": "muted at-compteurs" }, "Interventions sans effet : " + run.interFausses.length));
    }

    /* Indices et corrigé (apprentissage) */
    function renderIndices() {
      secIndices.textContent = "";
      if (TEST || !run.indices) return;
      var ol = el("ol", { "class": "at-hints" });
      for (var k = 0; k < Math.min(run.indices, p.indices.length); k++) ol.appendChild(el("li", null, p.indices[k]));
      secIndices.appendChild(el("p", { "class": "at-label" }, "Indices"));
      secIndices.appendChild(ol);
    }
    function renderCorrige() {
      secCorrige.textContent = "";
      if (TEST || !(run.resolu || run.abandon)) return;
      var d = el("details", { "class": "correction", open: "" });
      d.appendChild(el("summary", null, "Corrigé de ce dossier"));
      d.appendChild(el("p", null, "Cause : " + T.causeNom(p.cause) + ". Intervention : " + A.pannesInter[p.fix].nom + "."));
      var po = T.post(p, T.nouveau(p, "apprentissage"));
      d.appendChild(el("p", { "class": "at-label" }, "Ce qui se passait au démarrage"));
      (po.explication || []).forEach(function (t) { d.appendChild(el("p", null, t)); });
      var jr = el("div", { "class": "at-ecran" }), ETAT = { ok: "[  OK  ]", ko: "[ ERREUR ]", avert: "[ AVERT ]", non: "[  --  ]" };
      po.etapes.forEach(function (x) {
        var ln = el("div", { "class": "ligne " + x.etat });
        ln.appendChild(el("span", { "class": "etat" }, ETAT[x.etat]));
        ln.appendChild(el("span", null, " " + x.nom + (x.etat === "non" ? " — non testé" : "")));
        jr.appendChild(ln);
      });
      d.appendChild(jr);
      d.appendChild(el("p", { "class": "at-label" }, "Comment on la trouve"));
      d.appendChild(el("p", null, p.pourquoi));
      d.appendChild(el("p", { "class": "at-label" }, "Dans la vraie vie"));
      d.appendChild(el("p", null, p.reel));
      secCorrige.appendChild(d);
      var nav = el("div", { "class": "at-etape-actions" });
      var ids = Object.keys(A.pannes), suivant = ids[(ids.indexOf(id) + 1) % ids.length];
      nav.appendChild(el("a", { "class": "btn", href: "pannes.html?p=" + suivant }, "Dossier suivant"));
      nav.appendChild(el("a", { "class": "btn ghost", href: "pannes.html?p=" + id + "&m=test" }, "Refaire en test noté"));
      nav.appendChild(el("a", { "class": "btn ghost", href: "pannes.html" }, "Tous les dossiers"));
      secCorrige.appendChild(nav);
    }

    /* Démarrage */
    function allumer() {
      if (fini) return;
      if (run.hors) { msg("Le PC est hors tension : rebranche-le d'abord (interrupteur sur I, câble secteur branché).", "bloque"); return; }
      post = T.allumer(p, run); save();
      if (postTimer) clearTimeout(postTimer);
      secPost.hidden = false; secPost.textContent = "";
      secPost.appendChild(el("h2", null, "Démarrage du PC"));
      var ecran = el("div", { "class": "at-ecran", role: "log", "aria-label": "Ce qu'on observe au démarrage" });
      secPost.appendChild(ecran);
      var rest = el("div", { "class": "at-post-res" });
      secPost.appendChild(rest);
      renderScene();
      ecran.appendChild(el("div", { "class": "ligne" }, "Mise sous tension…"));
      var bon = post.code === "ok", res = post;
      postTimer = setTimeout(function () {
        if (bon && res.uefi) {
          var u = el("div", { "class": "uefi" });
          u.appendChild(el("p", { "class": "t" }, "UEFI — configuration détectée"));
          res.uefi.forEach(function (r) { u.appendChild(el("p", null, r[0] + " : " + r[1])); });
          ecran.appendChild(u);
        } else ecran.appendChild(el("div", { "class": "ligne " + (res.code === "avert" ? "avert" : "ko") }, res.ecran));
        var dl = el("dl", { "class": "at-sympt" });
        [["Ventilateurs", res.ventilos], ["Écran", res.ecran]].forEach(function (r) { dl.appendChild(el("dt", null, r[0])); dl.appendChild(el("dd", null, r[1])); });
        rest.appendChild(dl);
        rest.appendChild(el("p", { "class": "muted" }, "Pour aller plus loin : observer les LED, écouter les bips, consulter l'UEFI (outils d'inspection)."));
        run.journal.push({ o: "Allumer le PC", t: bon ? "Le PC démarre normalement." : "Ventilateurs : " + res.ventilos + ". Écran : " + res.ecran + "." });
        save(); renderCarnet();
        if (bon && run.resolu) {
          msg("Le PC démarre normalement : la panne est réparée ✓", "ok");
          if (TEST) terminer(true); else termine();
        } else if (bon) msg("Le PC démarre normalement, mais la panne devrait être là : relis le dossier.", "attention");
        else msg("Symptôme constaté : " + res.titre + ". Note-le, puis inspecte.", "info");
      }, reduced ? 0 : 600);
      secPost.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
      msg("Démarrage en cours…", "info");
    }
    function termine() {
      marquerPanne(id);
      renderAll();
    }

    /* Fin d'un test noté : note et rapport */
    function terminer(resolu) {
      if (fini) return;
      if (!resolu && bGive.getAttribute("data-confirm") !== "1") {
        bGive.setAttribute("data-confirm", "1"); bGive.textContent = "Confirmer : terminer ?";
        finTimer = setTimeout(function () { bGive.removeAttribute("data-confirm"); bGive.textContent = "Terminer le test"; }, 3500);
        return;
      }
      clearTimeout(finTimer);
      fini = true;
      var n = T.noter(p, run);
      var rec = { id: id, titre: p.titre, total: n.total, diagnostic: n.diagnostic, reparation: n.reparation, observation: n.observation, securite: n.securite,
        resolu: run.resolu, cause: T.causeNom(p.cause), fix: A.pannesInter[p.fix].nom, revoir: T.pointsARevoir(p, run, n),
        explication: T.post(p, T.nouveau(p, "test")).explication, pourquoi: p.pourquoi, reel: p.reel };
      store.del(KEY);
      if (ctx.eval) {
        var ev = evalLire() || { i: 0, res: [], demarre: true };
        ev.res[ctx.eval.i] = rec; ev.i = Math.max(ev.i, ctx.eval.i + 1); evalEcrire(ev);
      } else {
        var best = parseInt(store.get("score.panne." + id), 10);
        if (isNaN(best) || n.total > best) store.set("score.panne." + id, String(n.total));
        if (run.resolu && n.total >= SEUIL) marquerPanne(id);
      }
      [layout, actions, msgBox, ticket].forEach(function (x) { x.hidden = true; });
      var rap = el("section", { "class": "at-rapport", "aria-label": "Rapport du test", tabindex: "-1" });
      rap.appendChild(rapportPanne(rec));
      var act = el("div", { "class": "at-etape-actions" });
      if (ctx.eval) {
        var sv = el("button", { type: "button", "class": "btn" }, ctx.eval.i + 1 < ctx.eval.n ? "Dossier suivant →" : "Voir le rapport final");
        sv.addEventListener("click", lancerEval);
        act.appendChild(sv);
      } else {
        var again = el("button", { type: "button", "class": "btn" }, "Refaire le test");
        again.addEventListener("click", function () { dossier(id, ctx); });
        act.appendChild(again);
        act.appendChild(el("a", { "class": "btn ghost", href: "pannes.html?p=" + id }, "Mode apprentissage"));
        act.appendChild(el("a", { "class": "btn ghost", href: "pannes.html" }, "Tous les dossiers"));
      }
      rap.appendChild(act);
      head.after(rap);
      rap.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }

    /* Actions */
    bTension.addEventListener("click", function () {
      if (fini) return;
      run.hors = !run.hors; post = null; save();
      if (run.hors) secPost.hidden = true;
      msg(run.hors ? "PC hors tension : interrupteur sur O, câble secteur débranché. Tu peux ouvrir et intervenir." : "PC rebranché, interrupteur sur I. Tu peux l'allumer.", "info");
      renderScene();
    });
    bPower.addEventListener("click", allumer);
    scene.addEventListener("click", function (e) { if (e.target.closest("[data-bouton=power]")) allumer(); });
    bHint.addEventListener("click", function () {
      if (fini) return;
      if (run.indices < p.indices.length) { run.indices++; save(); }
      renderIndices();
      msg(run.indices ? "Indice : " + p.indices[Math.min(run.indices, p.indices.length) - 1] : "", "info");
    });
    bGive.addEventListener("click", function () {
      if (TEST) { terminer(false); return; }
      if (bGive.getAttribute("data-confirm") !== "1") {
        bGive.setAttribute("data-confirm", "1"); bGive.textContent = "Confirmer : voir la solution ?";
        giveTimer = setTimeout(function () { bGive.removeAttribute("data-confirm"); bGive.textContent = "Voir la solution"; }, 3500);
        return;
      }
      clearTimeout(giveTimer);
      bGive.removeAttribute("data-confirm"); bGive.textContent = "Voir la solution";
      T.abandonner(run); save(); renderAll();
      msg("Solution affichée dans le corrigé. Lis-la, puis refais le dossier en test noté.", "info");
    });
    function renderAll() { renderScene(); renderCarnet(); renderDiag(); renderIndices(); renderCorrige(); }

    load();
    renderOutils();
    msg(TEST ? "Test noté : sans aide. Observe, diagnostique, répare, puis rallume le PC pour vérifier." : "Dossier en apprentissage : lis le ticket, allume le PC pour voir le symptôme, puis inspecte. Demande un indice si tu bloques.", "info");
    renderAll();
  }

  /* ---------- Rapport d'un dossier noté ---------- */
  function rapportPanne(rec) {
    var box = el("div", { "class": "at-rap" }), ok = rec.total >= SEUIL;
    box.appendChild(el("p", { "class": "kicker" }, "Rapport · " + rec.titre));
    var top = el("div", { "class": "at-score" });
    top.appendChild(el("span", { "class": "n" }, String(rec.total)));
    top.appendChild(el("span", { "class": "sur" }, "/ 100"));
    top.appendChild(el("span", { "class": "verdict " + (ok ? "bon" : "faux") }, ok ? "Réussi" : "À retravailler (seuil : " + SEUIL + ")"));
    box.appendChild(top);
    var dl = el("dl", { "class": "at-sympt" });
    [["Diagnostic", rec.diagnostic + " / 40"], ["Réparation", rec.reparation + " / 30" + (rec.resolu ? "" : " (panne non résolue)")], ["Observation utile", rec.observation + " / 20"], ["Sécurité", rec.securite + " / 10"]].forEach(function (r) {
      dl.appendChild(el("dt", null, r[0])); dl.appendChild(el("dd", null, r[1]));
    });
    box.appendChild(dl);
    var d = el("details", { "class": "correction" });
    d.appendChild(el("summary", null, "Corrigé : la cause et la réparation"));
    d.appendChild(el("p", null, "Cause : " + rec.cause + ". Intervention : " + rec.fix + "."));
    (rec.explication || []).forEach(function (t) { d.appendChild(el("p", null, t)); });
    d.appendChild(el("p", null, rec.pourquoi));
    d.appendChild(el("p", null, rec.reel));
    box.appendChild(d);
    box.appendChild(blocRevoir(rec.revoir));
    return box;
  }
  function blocRevoir(liste) {
    var box = el("div", { "class": "at-revoir" });
    box.appendChild(el("h3", null, "Points à revoir"));
    if (!liste.length) { box.appendChild(el("p", null, "Rien à signaler : bon diagnostic, bonne réparation, méthode et sécurité respectées.")); return box; }
    liste.forEach(function (x) {
      var th = A.revoir[x.theme] || A.revoir.methode;
      var c = el("div", { "class": "at-revoir-item" });
      c.appendChild(el("h4", null, th.titre));
      var ul = el("ul");
      x.raisons.forEach(function (r) { ul.appendChild(el("li", null, r)); });
      c.appendChild(ul);
      c.appendChild(el("p", null, th.conseil));
      var l = el("p", { "class": "at-lien" });
      l.appendChild(el("a", { href: th.lien }, th.libelle));
      l.appendChild(document.createTextNode(" · "));
      var m = th.module || A.moduleRevoir.general;
      l.appendChild(el("a", { href: m.href }, m.libelle));
      c.appendChild(l);
      box.appendChild(c);
    });
    return box;
  }

  /* ---------- Évaluation : cinq pannes tirées au sort ---------- */
  var EV_KEY = "atelier.pannes.eval";
  function evalLire() { try { var o = JSON.parse(store.get(EV_KEY) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function evalEcrire(ev) { store.set(EV_KEY, JSON.stringify(ev)); }
  function evalEffacer() {
    var ev = evalLire();
    store.del(EV_KEY);
    ((ev && ev.ids) || []).forEach(function (id) { store.del("atelier.panne." + id + ".eval"); });
  }
  function lancerEval() {
    var ev = evalLire();
    if (!ev || !ev.demarre || !ev.ids) { introEval(); return; }
    var valides = ev.ids.every(function (id) { return A.pannes[id]; });
    if (!valides) { evalEffacer(); introEval(); return; }
    if (ev.i >= ev.ids.length) { rapportFinal(ev); return; }
    dossier(ev.ids[ev.i], { mode: "test", cle: "eval", eval: { i: ev.i, n: ev.ids.length } });
  }
  function commencerEval() { evalEffacer(); evalEcrire({ i: 0, res: [], demarre: true, ids: T.tirage(A.pannesEval.n) }); lancerEval(); }
  function introEval() {
    entete("Évaluation : pannes", "Atelier hardware · Évaluation des pannes");
    var b = el("div", { "class": "prose" });
    b.appendChild(el("p", { "class": "lead" }, "Cinq dossiers de panne tirés au sort, enchaînés, sans aide et notés. À la fin : un rapport avec ce qu'il faut revoir, et où le réviser."));
    var c = el("div", { "class": "callout retenir" });
    c.appendChild(el("p", null, "Chaque dossier est noté sur 100 : diagnostic 40, réparation 30, observation utile 20, sécurité 10. Pas d'indices ni de corrigé pendant le test. Seuil de réussite : " + SEUIL + " de moyenne. Ta progression est enregistrée dans ce navigateur : tu peux fermer la page et reprendre."));
    b.appendChild(c);
    var c2 = el("div", { "class": "callout astuce" });
    c2.appendChild(el("p", null, "Conseil : passe d'abord les dossiers en mode apprentissage. Mets toujours le PC hors tension avant d'ouvrir ou de remplacer une pièce."));
    b.appendChild(c2);
    var act = el("div", { "class": "at-etape-actions" });
    var go = el("button", { type: "button", "class": "btn" }, "Commencer");
    go.addEventListener("click", commencerEval);
    act.appendChild(go);
    act.appendChild(el("a", { "class": "btn ghost", href: "pannes.html" }, "Retour aux dossiers"));
    b.appendChild(act);
    host.appendChild(b);
  }
  function rapportFinal(ev) {
    var E = A.pannesEval, rec = ev.res.filter(Boolean);
    var moy = Math.round(rec.reduce(function (a, r) { return a + r.total; }, 0) / (rec.length || 1)), ok = moy >= E.seuil;
    var best = parseInt(store.get("score." + E.id), 10);
    if (isNaN(best) || moy > best) store.set("score." + E.id, String(moy));
    if (ok) store.set("done." + E.unite, "1");
    entete("Rapport de l'évaluation des pannes", "Atelier hardware · Évaluation des pannes");
    var box = el("div", { "class": "at-rap" });
    var top = el("div", { "class": "at-score" });
    top.appendChild(el("span", { "class": "n" }, String(moy)));
    top.appendChild(el("span", { "class": "sur" }, "/ 100 de moyenne"));
    top.appendChild(el("span", { "class": "verdict " + (ok ? "bon" : "faux") }, ok ? "Réussi" : "À retravailler (seuil : " + E.seuil + ")"));
    box.appendChild(top);
    var table = el("table", { "class": "at-table" });
    table.innerHTML = "<thead><tr><th>Dossier</th><th>Note</th><th>Diagnostic</th><th>Réparation</th><th>Observation</th><th>Sécurité</th></tr></thead>";
    var tb = el("tbody");
    rec.forEach(function (r) {
      var tr = el("tr");
      [r.titre, r.total + " / 100", r.diagnostic + " / 40", r.reparation + " / 30", r.observation + " / 20", r.securite + " / 10"].forEach(function (t) { tr.appendChild(el("td", null, t)); });
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    var wrap = el("div", { "class": "table-wrap" }); wrap.appendChild(table); box.appendChild(wrap);
    var par = {}, ordre = [];
    rec.forEach(function (r) {
      r.revoir.forEach(function (x) {
        if (!par[x.theme]) { par[x.theme] = []; ordre.push(x.theme); }
        x.raisons.forEach(function (t) { par[x.theme].push(r.titre + " : " + t); });
      });
    });
    box.appendChild(blocRevoir(ordre.map(function (t) { return { theme: t, raisons: par[t] }; })));
    var det = el("details", { "class": "correction" });
    det.appendChild(el("summary", null, "Détail de chaque dossier"));
    rec.forEach(function (r) { det.appendChild(rapportPanne(r)); });
    box.appendChild(det);
    var act = el("div", { "class": "at-etape-actions" });
    var again = el("button", { type: "button", "class": "btn" }, "Recommencer l'évaluation");
    again.addEventListener("click", commencerEval);
    act.appendChild(again);
    act.appendChild(el("a", { "class": "btn ghost", href: "pannes.html" }, "Retour aux dossiers"));
    box.appendChild(act);
    host.appendChild(box);
  }

  if (EVAL) lancerEval();
  else if (params.get("p")) dossier(params.get("p"), { mode: params.get("m") === "test" ? "test" : "apprentissage" });
  else catalogue();
})();
