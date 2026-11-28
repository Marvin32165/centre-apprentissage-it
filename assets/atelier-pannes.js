/* Atelier hardware — partie D : diagnostic des pannes. Interface « manuel de service » (lot 45) : catalogue et arbre,
   dossier de panne (apprentissage ou test noté) avec maquette du PC et instruments dessinés, évaluation. */
(function () {
  "use strict";
  var A = window.IT_ATELIER, T = window.IT_PANNES;
  var host = document.getElementById("pannes");
  if (!host || !A || !T || !window.IT_ISO_DATA) return;

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
    h.appendChild(el("p", { "class": "mt-surtitre" }, kicker));
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
    entete("Diagnostic des pannes", "Atelier hardware · Partie D");
    var ch = el("p", { "class": "mt-chapeau" }, "Un utilisateur décrit un symptôme. Tu observes, tu mesures, tu poses un diagnostic, puis tu répares la bonne pièce. Pièces et mesures : modèles génériques.");
    host.appendChild(ch);
    var feuille = el("div", { "class": "mt-feuille" });
    var g = el("div", { "class": "mt-texte" }), d = el("div", { "class": "mt-colle" });
    feuille.appendChild(g); feuille.appendChild(d);
    host.appendChild(feuille);
    g.appendChild(el("h2", { id: "arbre" }, "Arbre de diagnostic"));
    g.appendChild(el("p", null, "La méthode du service desk : observer ce que la machine montre avant d'ouvrir, puis isoler. Chaque question ouvre ses causes ; chaque cause renvoie à un dossier."));
    var ar = el("div", { "class": "arbre-zone" });
    var parCause = {};
    Object.keys(A.pannes).forEach(function (pid) { parCause[A.pannes[pid].cause] = pid; });
    ar.innerHTML = window.IT_DIAG ? window.IT_DIAG.arbre({ lien: function (c) { return parCause[c] ? "pannes.html?p=" + parCause[c] : null; } }) : "";
    g.appendChild(ar);
    var sec = el("div", { "class": "mt-encadre source" });
    sec.appendChild(el("p", { "class": "mt-etiq" }, "Méthode et sources"));
    sec.appendChild(el("p", null, "Méthode du module « Matériel et PC » (§ 3 : POST, bips, LED, configuration minimale, d'après ASUS) ; guide Intel ATX 3 (rév. 2.1a) pour l'alimentation ; les codes de bips et de LED dépendent de la carte mère : on lit son manuel. Deux modes : apprentissage (indices, corrigé caché) et test noté sur 100 (diagnostic 40, réparation 30, observation utile 20, sécurité 10)."));
    g.appendChild(sec);
    d.appendChild(el("h2", { id: "dossiers" }, "Quatorze dossiers"));
    var ul = el("ul", { "class": "mt-entrees" });
    Object.keys(A.pannes).forEach(function (pid, i) {
      var p = A.pannes[pid], fait = store.get("panne." + pid) === "1", best = parseInt(store.get("score.panne." + pid), 10);
      var li = el("li"), a = el("a", { href: "pannes.html?p=" + pid });
      a.appendChild(el("span", { "class": "mt-e-n" }, "D-" + (i < 9 ? "0" : "") + (i + 1)));
      a.appendChild(el("span", { "class": "mt-e-t" }, p.titre));
      a.appendChild(el("span", { "class": "mt-e-pts", "aria-hidden": "true" }));
      a.appendChild(el("span", { "class": "mt-e-etat" + (fait ? " ok" : "") }, fait ? "✓" : p.niveau));
      a.setAttribute("aria-label", "Dossier " + (i + 1) + " : " + p.titre + ", " + p.niveau + (fait ? ", résolu" : ""));
      li.appendChild(a);
      var t = el("a", { "class": "mt-test", href: "pannes.html?p=" + pid + "&m=test", "aria-label": "Dossier " + (i + 1) + " en test noté" }, "test" + (!isNaN(best) ? " " + best : ""));
      li.appendChild(t);
      ul.appendChild(li);
    });
    d.appendChild(ul);
    var ep = el("div", { "class": "mt-encadre outillage" });
    ep.appendChild(el("p", { "class": "mt-etiq" }, "Épreuve des pannes"));
    ep.appendChild(el("p", null, "Cinq dossiers tirés au sort, sans aide, notés sur 100, puis un bilan des points à revoir."));
    ep.appendChild(el("p")).appendChild(el("a", { "class": "btn", href: "pannes-eval.html" }, "Commencer l'évaluation"));
    d.appendChild(ep);
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

    /* Squelette « manuel de service » : fiche d'intervention à gauche, planche et instruments à droite */
    host.textContent = "";
    var num = Object.keys(A.pannes).indexOf(id) + 1, code = ctx.eval ? "EP-2." + (ctx.eval.i + 1) : "D-" + (num < 10 ? "0" : "") + num;
    var head = el("header", { "class": "at-head" });
    head.innerHTML = '<p class="mt-surtitre"></p><h1></h1><div class="at-badges"></div><p class="at-modes"></p>';
    head.querySelector(".mt-surtitre").textContent = "Atelier hardware · " + code + " · " + (ctx.eval ? "Épreuve des pannes, dossier " + (ctx.eval.i + 1) + " / " + ctx.eval.n : "Dossier de panne");
    head.querySelector("h1").textContent = p.titre;
    [[TEST ? "Test noté" : "Apprentissage", true], [p.niveau, false]].forEach(function (b) { head.querySelector(".at-badges").appendChild(el("span", { "class": "badge" + (b[1] ? " mode" : "") }, b[0])); });
    if (!ctx.eval) head.querySelector(".at-modes").appendChild(el("a", { href: "pannes.html?p=" + id + (TEST ? "" : "&m=test") }, TEST ? "Passer en mode apprentissage (indices)" : "Passer en mode test (sans aide, noté)"));
    host.appendChild(head);

    var layout = el("div", { "class": "mt-feuille at-layout pn-layout" });
    var pageG = el("section", { "class": "mt-texte", "aria-label": "Fiche d'intervention" });
    var pageD = el("section", { "class": "mt-colle", "aria-label": "Planche et instruments" });
    layout.appendChild(pageG); layout.appendChild(pageD); host.appendChild(layout);
    var corps = pageG;
    var ticket = el("section", { "class": "pn-ticket", "aria-label": "Ticket reçu" });
    ticket.appendChild(el("p", { "class": "mt-surtitre" }, code + " · Ticket reçu"));
    ticket.appendChild(el("blockquote", { "class": "pn-citation" }, p.ticket));
    ticket.appendChild(el("p", null, p.contexte));
    var src = el("aside", { "class": "mt-encadre source" });
    src.appendChild(el("p", { "class": "mt-etiq" }, "Source"));
    src.appendChild(el("p", null, "Les LED de debug, les bips et la liste des processeurs compatibles dépendent de la carte mère : la source de référence est son manuel et la page de support du constructeur. Sources : guide Intel des alimentations ATX version 3, rév. 2.1a (tolérances : +12 V de −7 % à +5 %, +5 V et +3,3 V à ±5 % ; signaux PWR_OK et PS_ON#) ; ASUS, FAQ des LED de diagnostic (Q-LED : CPU, DRAM, VGA, BOOT) ; Dell : surchauffe, nettoyage, pile CMOS ; Intel : protection thermique et pâte thermique. Les liens entre une panne et une LED précise sont ceux de la simulation : sur une vraie carte, on lit son manuel."));
    ticket.appendChild(src);
    corps.appendChild(ticket);

    var main = el("div", { "class": "at-main" });
    pageD.appendChild(main);
    var planche = el("figure", { "class": "mt-planche at-planche" });
    var scene = el("div", { "class": "at-scene pn-scene" });
    planche.appendChild(scene);
    var cart = el("div");
    planche.appendChild(cart);
    main.appendChild(planche);
    var figCap = el("p", { "class": "mt-fig" });
    main.appendChild(figCap);
    var instr = el("div", { "class": "pn-instrument", "aria-live": "polite" });
    main.appendChild(instr);

    var actions = el("div", { "class": "at-actions" });
    var bTension = el("button", { type: "button", "class": "btn ghost", "aria-pressed": "false" });
    var bPower = el("button", { type: "button", "class": "btn" }, "Appuyer sur le bouton marche");
    var bHint = el("button", { type: "button", "class": "btn ghost" }, "Indice");
    var bGive = el("button", { type: "button", "class": "btn ghost" }, TEST ? "Terminer le test" : "Voir la solution");
    [bTension, bPower].concat(TEST ? [] : [bHint]).concat([bGive]).forEach(function (b) { actions.appendChild(b); });
    main.appendChild(actions);
    var msgBox = el("div", { "class": "at-msg mt-encadre", role: "status", "aria-live": "polite" });
    var secPost = el("section", { "class": "at-post bloc", hidden: "", "aria-label": "Démarrage du PC" });
    main.appendChild(secPost);

    var secOutils = el("section", { "class": "pn-outils", "aria-label": "Examen" });
    var secCarnet = el("section", { "class": "pn-carnet-box", "aria-label": "Carnet de bord" });
    var secDiag = el("section", { "class": "pn-diag", "aria-label": "Diagnostic et intervention" });
    var secIndices = el("section", { "class": "pn-indices", "aria-label": "Indices" });
    var secCorrige = el("section", { "class": "pn-corrige", "aria-label": "Corrigé" });
    corps.appendChild(msgBox); corps.appendChild(secOutils); corps.appendChild(secIndices); corps.appendChild(secCarnet);
    pageD.appendChild(secDiag); pageD.appendChild(secCorrige);

    var ETIQ = { info: "Atelier", ok: "Juste", attention: "Attention", bloque: "Refusé", danger: "Danger" };
    function msg(t, niv) {
      niv = niv || "info";
      msgBox.className = "at-msg mt-encadre " + niv; msgBox.textContent = "";
      msgBox.appendChild(el("p", { "class": "mt-etiq" }, ETIQ[niv] || "Atelier"));
      msgBox.appendChild(el("p", null, t));
    }

    /* Scène : le PC fermé, ouvert dès qu'on l'inspecte hors tension. */
    var DISPO = p.base === "gamer" ? "tour-atx" : "tour-matx";
    var OUVRE = { visuel: 1, ventirad: 1, alim: 1, temoin: 1 };
    function renderScene() {
      var etat = (!run.hors && post) ? post.code : null;
      var ouvert = run.hors && run.vu.some(function (v) { return OUVRE[v]; });
      scene.innerHTML = window.IT_ISO_DATA.pc(DISPO, run.placed, { ouvert: ouvert, led: etat ? (etat === "ok" ? "ok" : "ko") : null,
        titre: ouvert ? "PC ouvert, hors tension : inspection" : (run.hors ? "PC fermé, hors tension" : "PC fermé, sous tension") });
      cart.textContent = "";
      var c = el("div", { "class": "mt-cartouche", "aria-hidden": "true" });
      [["Dossier", code], ["État", run.hors ? "Hors tension" : "Sous tension"], ["Boîtier", ouvert ? "Ouvert" : "Fermé"], ["Mode", TEST ? "Test" : "Apprentissage"]].forEach(function (x) { var sp = el("span", null, x[0]); sp.appendChild(el("b", null, x[1])); c.appendChild(sp); });
      cart.appendChild(c);
      figCap.innerHTML = "<b>FIG. " + code + "</b> · " + (ouvert ? "Boîtier ouvert, PC hors tension (interrupteur sur O, câble secteur débranché)." : run.hors ? "PC hors tension : l'inspection ouvre le boîtier." : "PC sous tension, boîtier fermé : bouton marche et LED en façade.");
      bTension.textContent = run.hors ? "Rebrancher (interrupteur sur I)" : "Mettre hors tension (O + débrancher)";
      bTension.setAttribute("aria-pressed", run.hors ? "true" : "false");
    }

    /* Outils */
    function renderOutils() {
      secOutils.textContent = "";
      secOutils.appendChild(el("h2", null, "Examen · choisis tes instruments"));
      secOutils.appendChild(el("p", { "class": "pn-note" }, "Ouvrir le boîtier, tester ou remplacer une pièce : PC hors tension. Observer les LED, les bips ou l'UEFI : PC sous tension."));
      var l = el("div", { "class": "pn-outils-liste" });
      A.pannesOutils.forEach(function (o) {
        if (o.id === "temoin") return;
        var vu = run.journal.some(function (j) { return j.o === T.nomOutil(o.id); });
        var b = el("button", { type: "button", "class": "pn-outil" + (vu ? " vu" : ""), "data-outil": o.id, "aria-pressed": String(vu) });
        b.appendChild(el("span", { "class": "coche", "aria-hidden": "true" }, vu ? "✓" : "○"));
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
      var dessinI = window.IT_DIAG ? window.IT_DIAG.instrument(id, r.texte, post || T.post(p, run)) : "";
      instr.innerHTML = dessinI ? '<figure class="pn-instr">' + dessinI + '<figcaption class="mt-fig"><b>' + nom + "</b> · " + r.texte.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) + "</figcaption></figure>" : "";
      save(); msg(nom + " : observation notée au carnet de bord.", "info"); renderCarnet(); renderOutils(); renderScene();
    }
    function renderCarnet() {
      secCarnet.textContent = "";
      secCarnet.appendChild(el("h2", null, "Carnet de bord"));
      if (!run.journal.length) { secCarnet.appendChild(el("p", { "class": "pn-note" }, "Rien noté pour l'instant. Allume le PC pour voir le symptôme, puis examine.")); return; }
      var ol = el("ol", { "class": "pn-carnet", "aria-label": "Observations" });
      run.journal.slice().reverse().forEach(function (e) {
        var li = el("li");
        li.appendChild(el("span", { "class": "pn-carnet-o" }, e.o));
        li.appendChild(document.createTextNode(e.t));
        ol.appendChild(li);
      });
      secCarnet.appendChild(ol);
    }

    /* Diagnostic et intervention */
    function renderDiag() {
      secDiag.textContent = "";
      secDiag.appendChild(el("h2", null, "Diagnostic · quelle est la cause ?"));
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
      if (run.diag.length && TEST) secDiag.appendChild(el("p", { "class": "muted" }, "Dernier diagnostic posé : " + T.causeNom(run.diag[run.diag.length - 1]) + "."));
      else if (run.diag.length) {
        var ul = el("ul", { "class": "diag-liste" });
        run.diag.forEach(function (c) {
          var ok = c === p.cause;
          var li = el("li", { "class": ok ? "juste" : "faux" });
          li.appendChild(el("span", { "class": "marque", "aria-hidden": "true" }, ok ? "✓" : "✗"));
          li.appendChild(el("span", { "class": "diag-nom" }, T.causeNom(c)));
          li.appendChild(el("span", { "class": "sr-only" }, ok ? " : juste" : " : fausse piste"));
          ul.appendChild(li);
        });
        secDiag.appendChild(ul);
      }
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
      for (var k = 0; k < Math.min(run.indices, p.indices.length); k++) {
        var n = el("div", { "class": "mt-encadre remarque" });
        n.appendChild(el("p", { "class": "mt-etiq" }, "Indice " + (k + 1)));
        n.appendChild(el("p", null, p.indices[k]));
        secIndices.appendChild(n);
      }
    }
    function renderCorrige() {
      secCorrige.textContent = "";
      if (TEST || !(run.resolu || run.abandon)) return;
      var d = el("details", { "class": "correction rabat" });
      d.appendChild(el("summary", null, "Corrigé : la cause et le chemin dans l'arbre"));
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
      if (window.IT_DIAG) {
        d.appendChild(el("p", { "class": "at-label" }, "Le chemin dans l'arbre de diagnostic"));
        var az = el("div", { "class": "arbre-zone" });
        az.innerHTML = window.IT_DIAG.arbre({ cause: p.cause });
        d.appendChild(az);
      }
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
    box.appendChild(el("p", { "class": "mt-surtitre" }, "Rapport · " + rec.titre));
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
    entete("Épreuve des pannes", "Atelier hardware · EP-2 · Épreuve");
    var b = el("div", { "class": "mt-texte ep-intro" });
    b.appendChild(el("p", { "class": "mt-chapeau" }, "Cinq dossiers de panne tirés au sort, enchaînés, sans aide et notés. À la fin : un rapport avec ce qu'il faut revoir, et où le réviser."));
    var c = el("div", { "class": "mt-encadre outillage" });
    c.appendChild(el("p", { "class": "mt-etiq" }, "Barème"));
    c.appendChild(el("p", null, "Chaque dossier est noté sur 100 : diagnostic 40, réparation 30, observation utile 20, sécurité 10. Pas d'indices ni de corrigé pendant le test. Seuil de réussite : " + SEUIL + " de moyenne. Ta progression est enregistrée dans ce navigateur : tu peux fermer la page et reprendre."));
    b.appendChild(c);
    var c2 = el("div", { "class": "mt-encadre remarque" });
    c2.appendChild(el("p", { "class": "mt-etiq" }, "Conseil"));
    c2.appendChild(el("p", null, "Passe d'abord les dossiers en mode apprentissage. Mets toujours le PC hors tension avant d'ouvrir ou de remplacer une pièce."));
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
    var box = el("div", { "class": "at-rap bilan" });
    box.appendChild(el("p", { "class": "titre-courant" })).appendChild(el("span", null, "Bilan"));
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
    var bImp = el("button", { type: "button", "class": "btn ghost" }, "Imprimer le bilan");
    bImp.addEventListener("click", function () { window.print(); });
    act.appendChild(bImp);
    act.appendChild(el("a", { "class": "btn ghost", href: "pannes.html" }, "Retour aux dossiers"));
    box.appendChild(act);
    host.appendChild(box);
  }

  if (EVAL) lancerEval();
  else if (params.get("p")) dossier(params.get("p"), { mode: params.get("m") === "test" ? "test" : "apprentissage" });
  else catalogue();
})();
