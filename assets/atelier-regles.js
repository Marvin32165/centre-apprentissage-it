/* Atelier hardware — moteur de règles (sans interface, testable sous Node).
   - canPlace / place / canRemove / remove : compatibilité et ordre des étapes
   - simulerPOST : démarrage simulé, symptômes et explications
   - bilan : vérification du cahier des charges
   Modes : « apprentissage » (l'ordre est imposé, des alertes expliquent les choix douteux)
           « test » (l'ordre n'est plus imposé et il n'y a pas d'alerte : les conséquences se voient au POST). */
(function (root) {
  "use strict";
  var A = root.IT_ATELIER;
  var P = A.pieces;
  var RAM_SLOTS = ["dimm-a1", "dimm-a2", "dimm-b1", "dimm-b2"];
  var ORDRE_SOUPLE = { "board|standoffs": 1, "board|ioshield": 1, "cooler|paste": 1 };
  var RAM_ORDRE = ["dimm-a2", "dimm-b2", "dimm-a1", "dimm-b1"];

  function dispo(sc) { return A.dispositions[sc.disposition]; }
  function slotDef(sc, id) {
    var s = dispo(sc).slots;
    for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i];
    return null;
  }
  function inst(st, slot) { var id = st.placed[slot]; return id ? P[id] : null; }
  var FMT = { ATX: "ATX", mATX: "micro-ATX", ITX: "mini-ITX", SFX: "SFX" };
  var RANG = { ITX: 1, mATX: 2, ATX: 3 };
  function bloque(msg, danger, theme) { return { ok: false, niveau: "bloque", msg: msg, danger: !!danger, theme: theme || null }; }
  function attention(msg) { return { ok: true, niveau: "attention", msg: msg }; }
  function ok(msg) { return { ok: true, niveau: "ok", msg: msg || "" }; }
  function ordre(st, msg) { return st.mode === "test" ? { ok: true, niveau: "attention", msg: "", silencieux: true } : bloque(msg, false, "ordre"); }

  /* Un état neuf : le montage de départ (mise à niveau) est déjà posé. */
  function nouvelEtat(sc, mode) {
    var st = { mode: mode || sc.mode || "apprentissage", placed: {}, switchOn: !!sc.departSwitch, hints: 0, erreurs: 0, errT: {}, echecs: [] };
    var dep = sc.depart || {};
    Object.keys(dep).forEach(function (k) { st.placed[k] = dep[k]; });
    return st;
  }

  function typesLabel(sc, s) {
    var noms = { "entretoises": "des entretoises", "cache-io": "le cache I/O", "alim": "une alimentation", "ventilateur": "un ventilateur",
      "carte-mere": "une carte mère", "cpu": "un processeur", "pate": "de la pâte thermique", "ventirad": "un ventirad", "ram": "une barrette de mémoire",
      "ssd-m2": "un SSD M.2", "ssd-sata": "un SSD SATA 2,5″", "gpu": "une carte graphique", "cab-atx24": "le câble 24 broches",
      "cab-eps": "le câble EPS", "cab-pcie": "le câble PCIe", "cab-sata-data": "le câble SATA de données", "cab-sata-pwr": "le câble d'alimentation SATA",
      "cab-fan": "un câble de ventilateur", "cab-facade": "la nappe de façade", "cab-usb3": "le câble USB 3", "cab-audio": "le câble audio",
      "cab-secteur": "le câble secteur", "cab-hdmi": "le câble vidéo", "hdd-sata": "un disque dur 2,5″" };
    return s.accepte.map(function (t) { return noms[t] || t; }).join(" ou ");
  }

  /* ---------- Pose ---------- */
  function canPlace(sc, st, itemId, slotId) {
    var p = P[itemId], s = slotDef(sc, slotId), d = dispo(sc);
    if (!p || !s) return bloque("Pièce ou emplacement inconnu.");
    if (st.placed[slotId]) return bloque("L'emplacement « " + s.nom + " » est déjà occupé. Retire d'abord la pièce.");
    if (s.accepte.indexOf(p.type) < 0) {
      var c = d.confusions[slotId + "|" + p.type];
      return c ? bloque(c, /^Danger/.test(c), "cablage") : bloque("Ça ne va pas ici : « " + s.nom + " » attend " + typesLabel(sc, s) + ". Les connecteurs ont un détrompeur : on ne force jamais.", false, "compat");
    }
    var manque = (s.requiert || []).filter(function (r) { return !st.placed[r]; });
    if (manque.length) {
      var cle = slotId + "|" + manque[0];
      var msg = d.requiertMsg[cle] || ("Il faut d'abord installer : " + slotDef(sc, manque[0]).nom + ".");
      /* Seul l'ordre « souple » est levé en mode test ; le reste est une impossibilité physique. */
      return ORDRE_SOUPLE[cle] ? ordre(st, msg) : bloque(msg, false, "ordre");
    }
    if (p.source && !st.placed[p.source]) {
      return bloque("Ce câble sort de « " + slotDef(sc, p.source).nom + " », qui n'est pas encore installé.", false, "ordre");
    }
    var b = inst(st, "board"), bt = sc.boitier, ex = sc.exige || {};
    switch (p.type) {
      case "entretoises":
        if (bt.formats.indexOf(p.format) < 0) return bloque("Ce kit (" + FMT[p.format] + ") ne correspond pas aux perçages du plateau de ce boîtier, prévu pour : " + bt.formats.map(function (f) { return FMT[f]; }).join(", ") + ".", false, "compat");
        break;
      case "carte-mere":
        if (bt.formats.indexOf(p.format) < 0) return bloque("Cette carte est au format " + FMT[p.format] + " : trop grande pour ce boîtier (" + bt.nom + "). Ses trous de fixation ne correspondent pas aux entretoises et elle dépasse du plateau.", false, "compat");
        var kit = inst(st, "standoffs");
        if (kit && kit.format !== p.format) {
          return bloque(RANG[kit.format] > RANG[p.format]
            ? "Le kit posé est un kit " + FMT[kit.format] + " : des entretoises se retrouveraient sous la carte (format " + FMT[p.format] + ") sans trou en face, et toucheraient ses soudures : court-circuit. Retire le kit et pose celui du format de la carte."
            : "Le kit posé est un kit " + FMT[kit.format] + " : il manque des entretoises pour une carte " + FMT[p.format] + ". Mal soutenue, la carte plierait à l'enfoncement des barrettes. Retire le kit et pose celui du format de la carte.", false, "ordre");
        }
        break;
      case "alim":
        if (bt.alim.indexOf(p.format) < 0) return bloque("Cette alimentation est au format " + FMT[p.format] + " : ce boîtier attend une alimentation " + bt.alim.map(function (f) { return FMT[f]; }).join(" ou ") + ".", false, "compat");
        break;
      case "cpu":
        if (p.socket !== b.socket) return bloque("Ce processeur est prévu pour le socket " + p.socket + ", la carte a un socket " + b.socket + " : le nombre et la position des contacts diffèrent, il ne se pose pas. Ne jamais forcer.", false, "compat");
        if (p.alerte && ex.igpu && st.mode !== "test") return attention(p.alerte);
        break;
      case "ventirad":
        if (p.sockets.indexOf(b.socket) < 0) return bloque("Ce ventirad se fixe sur un socket " + p.sockets.join(" / ") + " : ses fixations ne correspondent pas aux trous du socket " + b.socket + " de la carte.", false, "compat");
        if (bt.hVentirad && p.h > bt.hVentirad) return bloque("Ce ventirad mesure environ " + p.h + " mm : ce boîtier n'accepte que " + bt.hVentirad + " mm de hauteur sous le panneau latéral.", false, "compat");
        break;
      case "ram":
        if (p.ddr !== b.ddr) return bloque("Barrette " + p.ddr + " dans une carte " + b.ddr + " : l'encoche n'est pas au même endroit (détrompeur), la barrette ne rentre pas. DDR4 et DDR5 ne sont pas interchangeables.", false, "memoire");
        if (st.mode !== "test" && slotId !== "dimm-a2" && slotId !== "dimm-b2" && (!st.placed["dimm-a2"] || !st.placed["dimm-b2"])) {
          return attention("Possible, mais ce n'est pas l'emplacement recommandé : la carte conseille A2 puis B2 (2e et 4e depuis le processeur) pour activer le double canal.");
        }
        break;
      case "gpu":
        if (bt.lGpu && p.l > bt.lGpu) return bloque("Cette carte graphique mesure environ " + p.l + " mm : ce boîtier n'accepte que " + bt.lGpu + " mm de longueur de carte.", false, "compat");
        if (p.alerte && ex.sansGpu && st.mode !== "test") return attention(p.alerte);
        break;
      case "cab-pcie":
        if (slotId === "con-gpu-pwr" && !inst(st, "psu").pcie) return bloque("Cette alimentation n'a pas de connecteur PCIe : elle ne peut pas alimenter une carte graphique.", false, "alim");
        break;
      case "cab-fan":
        if (st.mode !== "test") {
          if (slotId === "h-cpufan" && p.fanDe !== "cooler") return attention("Possible, mais CPU_FAN est surveillé pour le ventirad : sans rotation du ventilateur du ventirad, la carte signalera une erreur.");
          if (slotId !== "h-cpufan" && p.fanDe === "cooler") return attention("Possible, mais le ventilateur du ventirad doit aller sur CPU_FAN : la carte y surveille la rotation et signalera une erreur.");
        }
        break;
    }
    return ok(p.pose || "");
  }

  function place(sc, st, itemId, slotId) {
    var r = canPlace(sc, st, itemId, slotId);
    if (r.ok) st.placed[slotId] = itemId;
    else { st.erreurs++; if (r.theme) { st.errT = st.errT || {}; st.errT[r.theme] = (st.errT[r.theme] || 0) + 1; } }
    return r;
  }

  function dependants(sc, st, slotId) {
    return dispo(sc).slots.filter(function (s) {
      var it = st.placed[s.id];
      if (!it) return false;
      if ((s.requiert || []).indexOf(slotId) >= 0) return true;
      return P[it].source === slotId;
    });
  }
  function canRemove(sc, st, slotId) {
    if (!st.placed[slotId]) return bloque("Il n'y a rien à retirer ici.");
    var dep = dependants(sc, st, slotId);
    if (dep.length) return bloque("Retire d'abord : " + dep.map(function (s) { return s.nom; }).join(", ") + ".");
    return ok();
  }
  function remove(sc, st, slotId) {
    var r = canRemove(sc, st, slotId);
    if (r.ok) delete st.placed[slotId];
    return r;
  }

  /* Retire une pièce et tout ce qui en dépend (utilisé par « Montre-moi » quand il faut remplacer une pièce). */
  function retirerTout(sc, st, slotId) {
    dependants(sc, st, slotId).forEach(function (s) { retirerTout(sc, st, s.id); });
    delete st.placed[slotId];
  }

  /* Emplacements libres qui acceptent le type de la pièce. */
  function candidats(sc, st, itemId) {
    var p = P[itemId];
    return dispo(sc).slots.filter(function (s) { return !st.placed[s.id] && s.accepte.indexOf(p.type) >= 0; });
  }
  function restantes(sc, st) {
    var used = {};
    Object.keys(st.placed).forEach(function (k) { used[st.placed[k]] = 1; });
    return sc.inventaire.filter(function (id) { return !used[id]; });
  }

  /* ---------- Configuration ---------- */
  function ramInfo(st) {
    var sticks = RAM_SLOTS.filter(function (s) { return st.placed[s]; });
    var go = 0, canaux = {};
    sticks.forEach(function (s) { go += P[st.placed[s]].go; canaux[s.charAt(5)] = 1; });
    return { n: sticks.length, go: go, doubleCanal: Object.keys(canaux).length >= 2 };
  }
  function stockage(st) {
    var r = [];
    if (st.placed["m2-1"]) r.push(P[st.placed["m2-1"]]);
    if (st.placed["bay-ssd"] && st.placed["sata-data"] && st.placed["sata-pwr"]) r.push(P[st.placed["bay-ssd"]]);
    return r;
  }
  function puissanceEstimee(st) {
    var cpu = inst(st, "cpu"), gpu = inst(st, "gpu");
    return (cpu ? cpu.pmax : 0) + (gpu ? gpu.w : 0) + 75;
  }

  /* ---------- Étapes guidées ---------- */
  var FN = {
    stockage: function (st) { return !!(st.placed["m2-1"] || (st.placed["bay-ssd"] && st.placed["sata-data"] && st.placed["sata-pwr"])); },
    interrupteur: function (st) { return !!st.switchOn; },
    "psu-change": function (st) { return !!(st.placed["psu"] && st.placed["psu"] !== "psu-300"); },
    "video-gpu": function (st) { return !!(st.placed["mon-gpu"] && !st.placed["mon-board"]); },
    "post-ok": function (st) { return !!(st.post && st.post.code === "ok"); }
  };
  function etapeFaite(e, st) {
    var okSlots = (e.slots || []).every(function (s) { return !!st.placed[s]; });
    var okFn = e.fn ? FN[e.fn](st) : true;
    return okSlots && okFn;
  }
  function etapes(sc, st) {
    return sc.etapes.map(function (e) { return { def: e, fait: etapeFaite(e, st) }; });
  }
  function etapeCourante(sc, st) {
    var l = etapes(sc, st);
    for (var i = 0; i < l.length; i++) if (!l[i].fait) return i;
    return l.length;
  }

  /* ---------- POST ---------- */
  function res(code, titre, o) {
    var r = { code: code, titre: titre, ventilos: "immobiles", ecran: "Écran noir, pas de signal", leds: "Aucune LED", debug: null, bips: null, explication: [], correction: [] };
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k];
    return r;
  }

  function simulerPOST(sc, st) {
    var pl = st.placed;
    var psu = inst(st, "psu"), cpu = inst(st, "cpu"), gpu = inst(st, "gpu"), cooler = inst(st, "cooler");
    var ram = ramInfo(st), disques = stockage(st);
    var avertissements = [];

    var tests = [
      ["Alimentation sous tension", function () {
        if (!psu) return res("rien", "Rien ne s'allume : il n'y a pas d'alimentation", { theme: "alim",
          explication: ["Sans alimentation, aucun composant ne reçoit de courant."], correction: ["Installe une alimentation dans le boîtier."] });
        if (!pl["mains"]) return res("rien", "Rien ne s'allume : l'alimentation n'est pas branchée au secteur", { theme: "alim",
          explication: ["Le câble secteur n'est pas branché à l'alimentation : elle ne reçoit pas de courant, donc aucune LED, aucun ventilateur."],
          correction: ["Branche le câble secteur sur l'alimentation (vue Arrière)."] });
        if (!st.switchOn) return res("rien", "Rien ne s'allume : l'interrupteur de l'alimentation est sur O", { theme: "alim",
          explication: ["L'interrupteur à l'arrière de l'alimentation est sur O (arrêt) : elle ne délivre aucune tension, même branchée."],
          correction: ["Mets l'interrupteur de l'alimentation sur I (vue Arrière)."] });
        return null;
      }],
      ["Carte mère alimentée (24 broches)", function () {
        if (!pl["board"]) return res("rien", "Rien ne démarre : il n'y a pas de carte mère", { theme: "ordre",
          explication: ["Sans carte mère, rien ne pilote le démarrage."], correction: ["Installe la carte mère."] });
        if (!pl["standoffs"]) return res("rien", "Rien ne s'allume : court-circuit sous la carte mère", { theme: "ordre",
          leds: "Aucune LED, l'alimentation se met en protection",
          explication: ["Sans entretoises, des soudures de la carte touchent le plateau métallique : l'alimentation détecte le court-circuit et se met en protection."],
          correction: ["Éteins, débranche, retire la carte mère et pose les entretoises avant de la revisser."] });
        if (!pl["con-atx24"]) return res("rien", "Rien ne s'allume : le 24 broches n'est pas branché", { theme: "cablage",
          explication: ["Le câble 24 broches amène à la carte mère ses tensions principales, dont celle qui allume la LED de veille. Sans lui, la carte reste totalement éteinte."],
          correction: ["Branche le câble 24 broches ATX sur le bord droit de la carte mère."] });
        return null;
      }],
      ["Bouton marche reconnu", function () {
        if (!pl["con-fpanel"]) return res("rien", "Rien ne se passe quand j'appuie sur le bouton", { theme: "cablage",
          leds: "LED de veille de la carte mère allumée, la façade ne réagit pas",
          explication: ["Le bouton marche n'est relié à aucune broche de la carte : la nappe de façade (F_PANEL) n'est pas branchée. La carte est alimentée en veille mais ne reçoit jamais l'ordre de démarrer."],
          correction: ["Branche la nappe de façade sur F_PANEL.", "Pour tester sans nappe : on peut toucher les deux broches PWR_SW avec un tournevis isolé."] });
        return null;
      }],
      ["Alimentation du processeur (EPS)", function () {
        if (!pl["con-eps"]) return res("debug", "Les ventilateurs s'arrêtent aussitôt, la LED CPU de debug reste allumée", { theme: "cablage",
          ventilos: "démarrent une seconde puis s'arrêtent (ou ne démarrent pas)", leds: "LED de debug « CPU » allumée fixe", debug: "CPU",
          explication: ["Le processeur est alimenté en 12 V par le câble EPS, pas par le 24 broches. Sans lui, la carte détecte un défaut côté CPU et ne démarre pas."],
          correction: ["Branche le câble EPS 4+4 sur le connecteur près du processeur."] });
        if (psu && puissanceEstimee(st) > psu.w) return res("rien", "Le PC coupe aussitôt : l'alimentation est trop faible", { theme: "alim",
          leds: "Démarre puis coupe, protection de l'alimentation",
          explication: ["La consommation maximale estimée (≈ " + puissanceEstimee(st) + " W : processeur + carte graphique + le reste) dépasse la puissance de l'alimentation (" + psu.w + " W). Elle se met en protection."],
          correction: ["Choisis une alimentation plus puissante, ou retire la carte graphique inutile."] });
        return null;
      }],
      ["Processeur détecté", function () {
        if (!cpu) return res("debug", "Les ventilateurs tournent mais il n'y a pas d'image", { theme: "choix",
          ventilos: "tournent", ecran: "Pas de signal", leds: "LED de debug « CPU » allumée fixe", debug: "CPU",
          explication: ["Aucun processeur n'est installé : la carte s'allume mais ne trouve rien à démarrer."], correction: ["Installe un processeur compatible."] });
        return null;
      }],
      ["Mémoire détectée", function () {
        if (!ram.n) return res("bips", "Pas d'image, bips répétés", { theme: "memoire",
          ventilos: "tournent", ecran: "Pas de signal", leds: "LED de debug « DRAM » allumée fixe", debug: "DRAM",
          bips: "Bips répétés (le code exact dépend du constructeur : voir le manuel de la carte mère)",
          explication: ["Le POST teste la mémoire avant la vidéo. Aucune barrette n'est détectée : la carte le signale par des bips et par la LED DRAM."], correction: ["Installe au moins une barrette compatible, bien enfoncée (« clic » des clips)."] });
        return null;
      }],
      ["Refroidissement du processeur", function () {
        if (!cooler) return res("surchauffe", "Le PC démarre puis s'éteint : surchauffe", { theme: "refroidissement",
          ventilos: "tournent quelques secondes", ecran: "Éventuellement une image, puis extinction", leds: "Allumées puis extinction", bips: "Éventuellement un bip d'alerte",
          explication: ["Sans ventirad, le processeur monte vite en température : il ralentit puis la carte coupe l'alimentation pour le protéger."], correction: ["Installe un ventirad, avec de la pâte thermique."] });
        if (!pl["paste"]) return res("surchauffe", "Le PC démarre puis ralentit et s'éteint : surchauffe", { theme: "refroidissement",
          ventilos: "tournent à fond", ecran: "Image possible, puis extinction", leds: "Allumées puis extinction", bips: "Éventuellement un bip d'alerte",
          explication: ["Sans pâte thermique, le contact entre processeur et ventirad est mauvais : la chaleur ne passe pas. Le processeur atteint sa température critique, ralentit puis la carte coupe."],
          correction: ["Retire le ventirad, dépose une petite noisette de pâte thermique sur le processeur, puis remets le ventirad."] });
        if (cooler.tdp && cpu && cpu.tdp && cooler.tdp < cpu.tdp) return res("surchauffe", "Le PC démarre puis ralentit et s'éteint : ventirad sous-dimensionné", {
          ventilos: "tournent à fond", ecran: "Image possible, puis extinction", leds: "Allumées puis extinction", bips: "Éventuellement un bip d'alerte", theme: "refroidissement",
          explication: ["Le ventirad (environ " + cooler.tdp + " W de dissipation) est prévu pour moins de chaleur que ce processeur n'en produit (" + cpu.tdp + " W de puissance de base, bien plus en turbo). La chaleur s'accumule, le processeur ralentit puis la carte coupe."],
          correction: ["Choisis un ventirad dont la capacité dépasse la puissance du processeur (fiche du processeur et du ventirad)."] });
        return null;
      }],
      ["Ventilateur du processeur (CPU_FAN)", function () {
        var br = pl["h-cpufan"] && P[pl["h-cpufan"]].fanDe === "cooler";
        if (!br) {
          avertissements.push("« CPU Fan Error » : le ventilateur du ventirad n'est pas détecté sur CPU_FAN.");
          return { avert: true };
        }
        return null;
      }],
      ["Sortie vidéo", function () {
        var m = !!pl["mon-board"], g = !!pl["mon-gpu"];
        if (gpu) {
          if (gpu.pcie && !pl["con-gpu-pwr"]) return res("debug", "Pas d'image : la carte graphique n'est pas alimentée", { theme: "cablage",
            ventilos: "tournent (ceux de la carte graphique restent immobiles)", ecran: "Pas de signal", leds: "LED de debug « VGA » allumée fixe", debug: "VGA",
            explication: ["Cette carte graphique a besoin d'un câble d'alimentation PCIe 6+2 en plus du port PCIe. Sans lui, elle ne démarre pas."], correction: ["Branche le câble PCIe 6+2 sur la carte graphique."] });
          if (!g && m) return res("sans-image", "Les ventilateurs tournent, mais pas d'image", { theme: "video",
            ventilos: "tournent", ecran: "Pas de signal", leds: "LED de debug « VGA » allumée", debug: "VGA",
            explication: ["Avec une carte graphique dédiée installée, l'image sort par la carte graphique ; la sortie vidéo de la carte mère est en général désactivée. L'écran est branché au mauvais endroit."],
            correction: ["Branche le câble vidéo sur la carte graphique (vue Arrière)."] });
          if (!g) return res("sans-image", "Les ventilateurs tournent, mais pas d'image", { theme: "video",
            ventilos: "tournent", ecran: "Pas de signal", leds: "Normales",
            explication: ["Aucun écran n'est relié au PC."], correction: ["Branche le câble vidéo (vue Arrière)."] });
          return null;
        }
        if (!cpu.igpu) return res("sans-image", "Les ventilateurs tournent, mais pas d'image", { theme: "video",
          ventilos: "tournent", ecran: "Pas de signal", leds: "LED de debug « VGA » allumée", debug: "VGA",
          explication: ["Ce processeur (suffixe F) n'a pas de graphique intégré et il n'y a pas de carte graphique : aucune sortie vidéo ne fonctionne."],
          correction: ["Remplace le processeur par un modèle avec graphique intégré, ou ajoute une carte graphique."] });
        if (!m) return res("sans-image", "Les ventilateurs tournent, mais pas d'image", { theme: "video",
          ventilos: "tournent", ecran: "Pas de signal", leds: "Normales",
          explication: ["Aucun écran n'est branché sur la sortie vidéo de la carte mère, qui exploite le graphique du processeur."],
          correction: ["Branche le câble vidéo sur la carte mère (vue Arrière)."] });
        return null;
      }],
      ["Stockage détecté", function () {
        if (!disques.length) {
          var sataSansCable = pl["bay-ssd"] && (!pl["sata-data"] || !pl["sata-pwr"]);
          return res("pas-disque", "L'UEFI s'affiche, mais aucun disque de démarrage", { theme: "stockage",
            ventilos: "tournent", ecran: "UEFI : « aucun périphérique de démarrage »", leds: "Normales",
            explication: [sataSansCable ? "Le SSD SATA est posé mais il lui manque le câble de données ou le câble d'alimentation : il n'est pas détecté."
              : "Aucun disque n'est installé : l'UEFI n'a rien sur quoi démarrer."],
            correction: [sataSansCable ? "Branche les deux câbles du SSD SATA (données ET alimentation)." : "Installe un SSD (M.2 ou SATA)."] });
        }
        return null;
      }]
    ];

    var etapesLog = [], r = null;
    for (var i = 0; i < tests.length; i++) {
      if (r) { etapesLog.push({ nom: tests[i][0], etat: "non" }); continue; }
      var t = tests[i][1]();
      if (!t) etapesLog.push({ nom: tests[i][0], etat: "ok" });
      else if (t.avert) etapesLog.push({ nom: tests[i][0], etat: "avert" });
      else { etapesLog.push({ nom: tests[i][0], etat: "ko" }); r = t; }
    }

    if (!r) {
      var remarques = [];
      remarques.push(ram.doubleCanal ? "Mémoire en double canal." : "Mémoire en simple canal : performances réduites. Utilise A2 et B2 avec deux barrettes.");
      var fanSlots = ["fan-rear", "fan-front"].filter(function (id) { return slotDef(sc, id); });
      if (!fanSlots.every(function (id) { return pl[id]; })) remarques.push("Il manque un ventilateur : le flux d'air avant → arrière n'est pas complet.");
      if (!(pl["con-usb3"] && pl["con-audio"])) remarques.push("Les ports USB 3 ou audio de la façade ne sont pas branchés.");
      var disque = disques[0];
      if (avertissements.length) {
        r = res("avert", "Le PC démarre avec un avertissement", { theme: "cablage",
          ventilos: "tournent", ecran: "Message : « CPU Fan Error », appuyer sur F1 pour continuer", leds: "Normales",
          explication: ["Le POST s'est bien déroulé, mais la carte mère n'a pas détecté de rotation sur CPU_FAN : " + avertissements.join(" ") + " Sur beaucoup de cartes, le démarrage s'arrête jusqu'à ce que tu appuies sur F1."],
          correction: ["Branche le câble du ventilateur du ventirad sur CPU_FAN (et non sur un connecteur SYS_FAN)."] });
        r.remarques = remarques;
      } else {
        r = res("ok", "Le PC démarre : l'écran UEFI s'affiche", {
          ventilos: "tournent", ecran: "Écran UEFI affiché", leds: "Normales",
          explication: ["Le POST est réussi : alimentation, processeur, mémoire, vidéo et stockage sont détectés. Prochaine étape dans la vraie vie : installer le système depuis une clé USB, vérifier la date et l'heure et activer ce que Windows 11 exige (démarrage UEFI, Secure Boot, TPM 2.0)."],
          correction: [] });
        r.remarques = remarques;
      }
      r.uefi = [
        ["Processeur", cpu.nom],
        ["Mémoire", ram.go + " Go (" + ram.n + " barrette" + (ram.n > 1 ? "s" : "") + ", " + (ram.doubleCanal ? "double" : "simple") + " canal)"],
        ["Stockage", disque.nom],
        ["Vidéo", gpu ? "Carte graphique dédiée" : "Graphique intégré au processeur"]
      ];
    }
    r.etapes = etapesLog;
    return r;
  }

  /* ---------- Bilan du cahier des charges ---------- */
  function item(id, label, ok, detail, theme) { return { id: id, label: label, ok: !!ok, detail: detail, theme: theme }; }
  function fansOk(sc, st) {
    var pairs = [["fan-rear", "h-sys1"], ["fan-front", "h-sys2"]].filter(function (p) { return slotDef(sc, p[0]); });
    return pairs.every(function (p) { return st.placed[p[0]] && st.placed[p[1]]; });
  }
  function critere(c, sc, st) {
    var pl = st.placed, ram = ramInfo(st), d = stockage(st), psu = inst(st, "psu"), cpu = inst(st, "cpu"), gpu = inst(st, "gpu");
    switch (c.t) {
      case "ram": return item("ram", "Au moins " + c.min + " Go de mémoire", ram.go >= c.min, ram.go + " Go installés", "memoire");
      case "canal": return item("canal", "Mémoire en double canal", ram.doubleCanal, ram.doubleCanal ? "Barrettes sur les deux canaux" : "Une barrette, ou deux barrettes sur le même canal", "memoire");
      case "ssd": return item("ssd", "SSD d'au moins " + c.min + " Go" + (c.type === "ssd-sata" ? " (SATA, issu du stock)" : c.type === "ssd-m2" ? " (M.2 NVMe)" : ""),
        d.length > 0 && d[0].ssd !== false && d[0].go >= c.min && (!c.type || d[0].type === c.type), d.length ? d[0].nom : "Aucun disque détecté", "stockage");
      case "disques": return item("disques", c.min + " disques détectés", d.length >= c.min, d.length + " disque(s) détecté(s)", "stockage");
      case "gpu": return c.val
        ? item("gpu", "Carte graphique dédiée installée, alimentée et reliée à l'écran", gpu && pl["con-gpu-pwr"] && pl["mon-gpu"] && !pl["mon-board"], gpu ? (pl["con-gpu-pwr"] ? (pl["mon-gpu"] && !pl["mon-board"] ? "Carte posée, alimentée, écran sur la carte" : "Écran mal branché") : "Câble PCIe manquant") : "Aucune carte graphique", "video")
        : item("gpu", "Pas de carte graphique dédiée", !gpu, gpu ? "Une carte graphique est installée" : "Le graphique intégré est utilisé", "choix");
      case "facade": return item("facade", "Ports USB et audio de la façade branchés", pl["con-usb3"] && pl["con-audio"] && pl["con-fpanel"], "Nappe, USB 3 et audio", "cablage");
      case "air": return item("air", "Flux d'air avant → arrière", fansOk(sc, st), "Ventilateurs posés et branchés", "refroidissement");
      case "marge": {
        var est = puissanceEstimee(st);
        return item("marge", "Alimentation avec environ 25 % de marge", psu && psu.w >= est * 1.25, psu ? "≈ " + est + " W au maximum, alimentation de " + psu.w + " W" : "Pas d'alimentation", "alim");
      }
      case "amd": return item("amd", "Processeur AMD", cpu && /^AM/.test(cpu.socket), cpu ? cpu.nom : "Pas de processeur", "choix");
      case "coeurs": return item("coeurs", "Processeur d'au moins " + c.min + " cœurs", cpu && cpu.coeurs >= c.min, cpu ? cpu.coeurs + " cœurs" : "Pas de processeur", "choix");
    }
    return item(c.t, c.t, false, "Critère inconnu", "choix");
  }
  function bilan(sc, st) {
    var pl = st.placed, l;
    if (sc.criteres) l = sc.criteres.map(function (c) { return critere(c, sc, st); });
    else {
      var ram = ramInfo(st), d = stockage(st);
      l = [
        item("ram", "16 Go de mémoire au minimum", ram.go >= 16, ram.go + " Go installés", "memoire"),
        item("canal", "Mémoire en double canal", ram.doubleCanal, ram.doubleCanal ? "Barrettes sur les deux canaux" : "Une barrette, ou deux barrettes sur le même canal", "memoire"),
        item("ssd", "SSD d'au moins 256 Go", d.length > 0 && d[0].go >= 256, d.length ? d[0].go + " Go" : "Aucun disque détecté", "stockage"),
        item("gpu", "Pas de carte graphique dédiée", !pl["gpu"], pl["gpu"] ? "Une carte graphique est installée" : "Le graphique intégré est utilisé", "choix"),
        item("facade", "Ports USB et audio de la façade branchés", pl["con-usb3"] && pl["con-audio"] && pl["con-fpanel"], "Nappe, USB 3 et audio", "cablage"),
        item("air", "Flux d'air avant → arrière", pl["fan-front"] && pl["fan-rear"] && pl["h-sys1"] && pl["h-sys2"], "Deux ventilateurs posés et branchés", "refroidissement")
      ];
    }
    return { items: l, tout: l.every(function (x) { return x.ok; }) };
  }

  /* ---------- Note du mode test (sur 100) ----------
     Démarrage 40 : réussi du premier coup = 40, −10 par démarrage raté avant (mini 10) ; avec avertissement = 20 au plus.
     Cahier des charges 50 : proportionnel aux critères atteints.
     Gestes 10 : −2 par pose refusée (pièce incompatible, mauvais ordre). */
  function noter(sc, st, post) {
    var b = bilan(sc, st), echecs = (st.echecs || []).length;
    var dem = post.code === "ok" ? Math.max(40 - 10 * echecs, 10) : (post.code === "avert" ? Math.min(20, Math.max(40 - 10 * echecs, 10)) : 0);
    var nOk = b.items.filter(function (x) { return x.ok; }).length;
    var cahier = Math.round(50 * nOk / b.items.length);
    var gestes = Math.max(0, 10 - 2 * (st.erreurs || 0));
    return { total: dem + cahier + gestes, demarrage: dem, cahier: cahier, gestes: gestes, bilan: b };
  }

  /* Points à revoir : regroupés par thème (voir IT_ATELIER.revoir). */
  function pointsARevoir(sc, st, post, bil) {
    var par = {}, ordre = [];
    function add(theme, raison) {
      theme = theme || "choix";
      if (!par[theme]) { par[theme] = []; ordre.push(theme); }
      if (par[theme].indexOf(raison) < 0) par[theme].push(raison);
    }
    bil.items.forEach(function (x) { if (!x.ok) add(x.theme, x.label + " (" + x.detail + ")"); });
    if (post.code !== "ok") add(post.theme, "Au démarrage : " + post.titre);
    (st.echecs || []).forEach(function (e) { add(e.theme, "Démarrage raté en cours de route : " + e.titre); });
    Object.keys(st.errT || {}).forEach(function (t) { add(t, st.errT[t] + " pose(s) refusée(s) (pièce incompatible ou mauvais ordre)"); });
    return ordre.map(function (t) { return { theme: t, raisons: par[t] }; });
  }

  root.IT_ATELIER_RULES = {
    slotDef: slotDef, nouvelEtat: nouvelEtat, canPlace: canPlace, place: place, canRemove: canRemove, remove: remove,
    candidats: candidats, restantes: restantes, ramInfo: ramInfo, stockage: stockage, puissanceEstimee: puissanceEstimee,
    etapes: etapes, etapeCourante: etapeCourante, simulerPOST: simulerPOST, bilan: bilan, noter: noter, pointsARevoir: pointsARevoir, retirerTout: retirerTout, RAM_ORDRE: RAM_ORDRE
  };
})(typeof window !== "undefined" ? window : global);
