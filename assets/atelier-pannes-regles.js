/* Atelier hardware — lot 6 : règles des pannes (sans interface, testables sous Node).
   Un « run » est l'état d'une panne en cours : PC (placed), défaut actif, carnet de bord, diagnostics posés, interventions tentées.
   Le démarrage passe par IT_ATELIER_RULES.simulerPOST (lot 4) ; seules les pièces défectueuses ont des symptômes écrits à la main. */
(function (root) {
  "use strict";
  var A = root.IT_ATELIER, R = root.IT_ATELIER_RULES;
  var SC = function () { return A.scenarios["bureautique-intel"]; };
  function copie(o) { var r = {}; Object.keys(o || {}).forEach(function (k) { r[k] = o[k]; }); return r; }
  function nomOutil(id) { var o = A.pannesOutils.filter(function (x) { return x.id === id; })[0]; return o ? o.nom : id; }
  function causeNom(id) { var c = A.pannesCauses.filter(function (x) { return x.id === id; })[0]; return c ? c.nom : id; }

  function nouveau(p, mode) {
    var placed = copie(A.pannesBases[p.base]);
    (p.retire || []).forEach(function (s) { delete placed[s]; });
    Object.keys(p.place || {}).forEach(function (s) { placed[s] = p.place[s]; });
    return { id: p.id, mode: mode || "apprentissage", placed: placed, defaut: true, flag: p.flag || null, hors: false,
      vu: [], vuAvantDiag: [], journal: [], diag: [], interFausses: [], erreursSecu: 0, temoinsInutiles: 0, allume: 0, indices: 0, resolu: false, abandon: false };
  }

  /* ---------- Démarrage ---------- */
  function post(p, run) {
    var st = { mode: "test", placed: run.placed, switchOn: true, hints: 0, erreurs: 0, errT: {}, echecs: [] };
    var base = R.simulerPOST(SC(), st);
    if (!run.flag) return base;
    var s = p.symp, r = { code: "ok", titre: "", ventilos: "immobiles", ecran: "Écran noir, pas de signal", leds: "Aucune LED", debug: null, bips: null, explication: [], correction: [] };
    Object.keys(s).forEach(function (k) { if (k !== "etapesPlus") r[k] = s[k]; });
    var hit = false;
    r.etapes = base.etapes.map(function (e) {
      if (hit) return { nom: e.nom, etat: "non" };
      if (p.ko && e.nom === p.ko) { hit = true; return { nom: e.nom, etat: "ko" }; }
      return { nom: e.nom, etat: e.etat === "avert" ? "ok" : e.etat };
    }).concat(s.etapesPlus || []);
    return r;
  }
  /* L'UEFI n'est atteinte que si le POST va au moins jusqu'à la vidéo. */
  var UEFI_OK = { ok: 1, avert: 1, surchauffe: 1, "pas-disque": 1 };

  function allumer(p, run) { run.allume++; return post(p, run); }

  /* ---------- Outils ---------- */
  function sain(id) { return A.pannesSain[id]; }
  function texteObs(p, run, id) { return (run.defaut && p.obs[id]) || sain(id); }

  /* Retourne { ok, niveau, texte }. niveau : "ok" | "bloque" | "danger". */
  function outil(p, run, id, arg) {
    var def = A.pannesOutils.filter(function (x) { return x.id === id; })[0];
    if (!def) return { ok: false, niveau: "bloque", texte: "Outil inconnu." };
    if (def.hors && !run.hors) {
      run.erreursSecu++;
      return { ok: false, niveau: "danger", texte: "Danger : on n'ouvre pas et on ne touche pas aux composants sous tension. Mets d'abord le PC hors tension : interrupteur de l'alimentation sur O et câble secteur débranché." };
    }
    if (!def.hors && run.hors) return { ok: false, niveau: "bloque", texte: "Le PC est hors tension : rebranche-le (câble secteur, interrupteur sur I) pour cet outil." };
    var t;
    if (id === "visuel" || id === "ventirad" || id === "alim") t = texteObs(p, run, id);
    else if (id === "bios") {
      var po = post(p, run);
      if (run.defaut && !UEFI_OK[po.code]) t = p.obs.bios || "Impossible : le PC n'arrive pas jusqu'à l'UEFI (pas d'image).";
      else t = texteObs(p, run, "bios");
    } else if (id === "led") {
      var pl = post(p, run);
      t = "Ventilateurs : " + pl.ventilos + ". LED : " + pl.leds + (pl.debug ? " (LED de debug « " + pl.debug + " »)" : "") + ".";
    } else if (id === "bips") {
      var pb = post(p, run);
      t = pb.bips ? "Bips : " + pb.bips + "." : "Aucun bip n'est émis.";
    } else if (id === "temoin") {
      t = temoin(p, run, arg);
    }
    if (run.vu.indexOf(id) < 0) run.vu.push(id);
    if (!run.diag.length && run.vuAvantDiag.indexOf(id) < 0) run.vuAvantDiag.push(id);
    return { ok: true, niveau: "ok", texte: t };
  }
  function temoin(p, run, cible) {
    var nom = (A.pannesTemoins.filter(function (x) { return x[0] === cible; })[0] || [0, cible])[1];
    if (!run.defaut) return nom + " : le PC fonctionne déjà normalement, rien à comparer.";
    if (p.temoinTxt && p.temoinTxt[cible]) return nom + " : " + p.temoinTxt[cible];
    if (cible === p.temoin) return nom + " : le PC démarre normalement. Le symptôme a disparu : la pièce d'origine est défectueuse.";
    if (cible === "gpu" && !A.pannesBases[p.base].gpu) return "Ce PC n'a pas de carte graphique dédiée : rien à remplacer.";
    run.temoinsInutiles++;
    return nom + " : aucun changement, le symptôme est exactement le même. Cette pièce n'est probablement pas en cause.";
  }

  /* ---------- Diagnostic et intervention ---------- */
  function diagnostiquer(p, run, cause) {
    run.diag.push(cause);
    return { ok: cause === p.cause };
  }
  function reparer(p, run) {
    var base = A.pannesBases[p.base];
    (p.retire || []).forEach(function (s) { run.placed[s] = base[s]; });
    Object.keys(p.place || {}).forEach(function (s) { run.placed[s] = base[s]; });
    run.flag = null; run.defaut = false; run.resolu = true;
  }
  function intervenir(p, run, inter) {
    var def = A.pannesInter[inter];
    if (!def) return { ok: false, niveau: "bloque", texte: "Intervention inconnue." };
    if (!run.hors) {
      run.erreursSecu++;
      return { ok: false, niveau: "danger", texte: "Danger : on n'intervient jamais sur un PC sous tension. Mets-le hors tension (interrupteur sur O, câble secteur débranché) avant de toucher quoi que ce soit." };
    }
    if (inter === p.fix) {
      reparer(p, run);
      return { ok: true, niveau: "ok", texte: def.nom + " : fait. Le PC peut être remis sous tension." };
    }
    run.interFausses.push(inter);
    var t = def.piece ? "« " + def.nom + " » : fait, mais le PC se comporte exactement comme avant. Cette pièce n'était pas en cause : une pièce a été remplacée pour rien." : "« " + def.nom + " » : fait, sans effet. Le symptôme est toujours là : ce n'était pas la cause.";
    return { ok: false, niveau: "bloque", texte: t };
  }
  function abandonner(run) { run.abandon = true; }

  /* ---------- Note sur 100 ----------
     Diagnostic 40 (−15 par mauvais diagnostic avant le bon, mini 10), réparation 30 (−10 par intervention inutile, mini 10),
     observation utile 20 (outils clés consultés avant le diagnostic), sécurité 10 (−5 par geste sous tension). */
  function noter(p, run) {
    var i = run.diag.indexOf(p.cause);
    var diag = i < 0 ? 0 : Math.max(40 - 15 * i, 10);
    var rep = run.resolu ? Math.max(30 - 10 * run.interFausses.length, 10) : 0;
    var utiles = p.utile.filter(function (u) { return run.vuAvantDiag.indexOf(u) >= 0; });
    var obs = Math.round(20 * utiles.length / p.utile.length);
    var secu = Math.max(0, 10 - 5 * run.erreursSecu);
    return { total: diag + rep + obs + secu, diagnostic: diag, reparation: rep, observation: obs, securite: secu, utiles: utiles };
  }
  function pointsARevoir(p, run, n) {
    var par = {}, ordre = [];
    function add(t, r) { if (!par[t]) { par[t] = []; ordre.push(t); } par[t].push(r); }
    var i = run.diag.indexOf(p.cause);
    if (i < 0) add(p.theme, "Diagnostic non trouvé : la cause était « " + causeNom(p.cause) + " ».");
    else if (i > 0) add(p.theme, i + " diagnostic(s) erroné(s) avant le bon (« " + causeNom(p.cause) + " »).");
    if (!run.resolu) add(p.theme, "Panne non résolue.");
    if (run.interFausses.length) add(p.theme, "Intervention(s) inutile(s) : " + run.interFausses.map(function (x) { return A.pannesInter[x].nom; }).join(" ; ") + ".");
    if (n.utiles.length < p.utile.length) add("methode", "Outils clés non consultés avant le diagnostic : " + p.utile.filter(function (u) { return n.utiles.indexOf(u) < 0; }).map(nomOutil).join(", ") + ".");
    if (run.temoinsInutiles > 1) add("methode", run.temoinsInutiles + " pièces témoins essayées pour rien : observe d'abord, teste ensuite.");
    if (run.erreursSecu) add("securite", run.erreursSecu + " geste(s) sous tension : mets toujours le PC hors tension avant d'ouvrir.");
    return ordre.map(function (t) { return { theme: t, raisons: par[t] }; });
  }

  /* Tirage de n pannes distinctes (évaluation). */
  function tirage(n) {
    var ids = Object.keys(A.pannes), r = [];
    while (r.length < n && ids.length) r.push(ids.splice(Math.floor(Math.random() * ids.length), 1)[0]);
    return r;
  }

  root.IT_PANNES = { nouveau: nouveau, post: post, allumer: allumer, outil: outil, diagnostiquer: diagnostiquer, intervenir: intervenir, abandonner: abandonner,
    noter: noter, pointsARevoir: pointsARevoir, tirage: tirage, causeNom: causeNom, nomOutil: nomOutil, UEFI_OK: UEFI_OK };
})(typeof window !== "undefined" ? window : global);
