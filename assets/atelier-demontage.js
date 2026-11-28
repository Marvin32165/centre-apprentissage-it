/* Atelier hardware — partie C : démontage et remplacement (lot 43).
   Le PC de départ est le PC bureautique monté (procédure B-01) ; on l'ouvre en sécurité, on remplace une pièce, on referme.
   Règles de sécurité (moteur, `sc.securite`) : secteur débranché et bracelet antistatique avant de toucher une pièce interne.
   Source des consignes : support Dell, article 000137973 (voir SOURCE_SECU). */
(function () {
  "use strict";
  var A = window.IT_ATELIER;
  if (!A || !A.scenarios["bureautique-intel"]) return;
  var P = A.pieces, S = A.scenarios, base = S["bureautique-intel"];

  function clone(id, nouveau, o) {
    var c = JSON.parse(JSON.stringify(P[id]));
    c.id = nouveau;
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) c[k] = o[k];
    P[nouveau] = c;
  }
  clone("ram-ddr4-b", "ram-ddr4-hs", { nom: "Barrette DDR4-3200 8 Go (défectueuse)", resume: "DDR4, 8 Go, signalée en erreur", defectueuse: true });
  clone("ram-ddr4-b", "ram-ddr4-neuve", { nom: "Barrette DDR4-3200 8 Go (neuve)", resume: "DDR4, 8 Go, même référence" });
  clone("ssd-nvme", "ssd-nvme-hs", { nom: "SSD M.2 NVMe 500 Go (en fin de vie)", resume: "M.2 NVMe, 500 Go, à remplacer", defectueuse: true });
  clone("psu-450", "psu-450-hs", { nom: "Alimentation ATX 450 W (en panne)", resume: "ATX, 450 W, ne démarre plus", defectueuse: true });
  clone("psu-450", "psu-450-neuve", { nom: "Alimentation ATX 450 W (neuve)", resume: "ATX, 450 W, même modèle" });

  /* Le PC monté : toutes les poses de la procédure B-01. */
  function monte() {
    var d = {};
    base.etapes.forEach(function (e) { (e.solution || []).forEach(function (s) { d[s[0]] = s[1]; }); });
    return d;
  }
  function depart(remplace) {
    var d = monte();
    Object.keys(remplace).forEach(function (k) { d[k] = remplace[k]; });
    return d;
  }
  function inventaire(dep, ajout) {
    var l = Object.keys(dep).map(function (k) { return dep[k]; });
    return l.concat(ajout).filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  var SOURCE_SECU = "Consignes de sécurité : support Dell, « Electrical Safety for Dell Product Repair: ESD Protection and Precautions » (dell.com/support, article 000137973, modifié le 27/07/2026, consulté le 28/11/2026) : arrêt complet, câble secteur débranché, bouton marche maintenu 15 à 20 s pour vider l'énergie résiduelle ; toucher au moins 5 s une partie métallique non peinte ou porter un bracelet antistatique relié à une masse métallique, recommencer toutes les quelques minutes ; tenir barrettes, cartes et processeurs par les bords ; après le travail : vis, pièces, périphériques, puis secteur, mise sous tension et vérification. Bloc d'alimentation : consignes de sécurité Dell (dell_emc_safety_english_us.pdf) : tensions dangereuses, intervention réservée aux techniciens formés.";
  var UMONS = "À vérifier sur place : la procédure de l'UMONS pour une pièce défectueuse (ticket, étiquetage, retour au fournisseur sous garantie, destruction des données d'un disque).";

  /* Étapes communes */
  var E = {
    debrancher: { id: "debrancher", titre: "Éteindre et débrancher le secteur", slots: [], fn: "debranche", vue: "arriere",
      texte: "Le PC est éteint mais branché. Mets l'interrupteur de l'alimentation sur O, puis retire le câble secteur à l'arrière (touche la prise, puis « Retirer cette pièce »). En vrai, on maintient ensuite le bouton marche 15 à 20 secondes pour vider l'énergie résiduelle.",
      indices: ["Passe en vue « Arrière » : l'interrupteur et la prise sont sur l'alimentation, en bas.", "Le bouton « Interrupteur » sous la planche bascule I / O ; le câble secteur se retire comme une pièce."],
      attention: "Jamais de travail dans un PC relié au secteur : éteint, il reçoit encore une tension de veille. Le bloc d'alimentation lui-même ne s'ouvre pas : il peut produire des tensions dangereuses.",
      pourquoi: "On ne travaille jamais dans un PC relié au secteur : PC éteint, l'alimentation fournit encore une tension de veille à la carte mère (c'est elle qui permet au bouton marche de fonctionner). Le constructeur demande de débrancher le câble secteur puis de maintenir le bouton marche 15 à 20 secondes pour vider la charge restante.",
      solution: [] },
    esd: { id: "esd", titre: "Mettre le bracelet antistatique", slots: [], fn: "esd", vue: "cote",
      texte: "Avant de toucher une pièce, mets-toi au potentiel du boîtier : bracelet antistatique relié à une masse métallique, ou contact d'au moins 5 secondes avec une partie métallique non peinte (le panneau d'entrées-sorties à l'arrière, par exemple).",
      indices: ["Le bouton « Bracelet antistatique » est sous la planche."],
      outillage: ["Bracelet antistatique relié à une masse métallique", "Tournevis cruciforme"],
      pourquoi: "Une décharge électrostatique, même trop faible pour être sentie, peut abîmer un composant. Le bracelet relié à une masse (ou le contact avec une partie métallique non peinte, à refaire toutes les quelques minutes) met le technicien au même potentiel que le boîtier. Les pièces se tiennent ensuite par les bords.",
      solution: [] },
    rebrancher: { id: "rebrancher", titre: "Refermer et rebrancher le secteur", slots: ["mains"], vue: "arriere",
      texte: "Le travail est fini : les vis et les pièces retirées sont remises, le panneau aussi, puis le câble secteur se rebranche à l'arrière.",
      indices: ["Onglet « Câbles » du bac : le câble secteur. Vue « Arrière »."],
      pourquoi: "L'ordre du constructeur après une intervention : remettre les vis, réinstaller les pièces retirées, rebrancher les périphériques, puis seulement le secteur, et enfin allumer et vérifier.",
      solution: [["mains", "cab-secteur"]] },
    interrupteur: { id: "interrupteur", titre: "Interrupteur sur I", slots: [], fn: "interrupteur", vue: "arriere",
      texte: "Remets l'interrupteur de l'alimentation sur I.", indices: ["Bouton « Interrupteur » sous la planche."],
      pourquoi: "Sur O (quand le bloc a un interrupteur), l'alimentation ne fournit rien, même pas la tension de veille : le bouton marche de la façade resterait sans effet.",
      solution: [] },
    demarrage: { id: "demarrage", titre: "Allumer et vérifier", slots: [], fn: "post-ok", vue: "face",
      texte: "Appuie sur le bouton marche (ou « Allumer le PC ») et vérifie que le démarrage se passe bien.",
      indices: ["Bouton « Allumer le PC » sous la planche, ou bouton rond sur la façade."],
      pourquoi: "Le contrôle après intervention fait partie du travail : le PC démarre, la nouvelle pièce est détectée. On le note dans le ticket.",
      solution: [] }
  };
  function suite(ids, propres) {
    return ids.map(function (id) { return JSON.parse(JSON.stringify(propres[id] || E[id])); });
  }

  /* ---------- C-01 : remplacer une barrette de mémoire ---------- */
  var d1 = depart({ "dimm-b2": "ram-ddr4-hs" });
  S["remplacer-ram"] = {
    id: "remplacer-ram", code: "C-01", unite: "atelier-c1", type: "demontage", securite: true, memo: true,
    titre: "Remplacer une barrette de mémoire", niveau: "Débutant", duree: "≈ 15 min", mode: "apprentissage",
    disposition: "tour-matx", boitier: base.boitier, exige: base.exige,
    depart: d1, departSwitch: true, inventaire: inventaire(d1, ["ram-ddr4-neuve"]),
    brief: {
      client: "Ticket : un PC de bureau plante plusieurs fois par jour. Le diagnostic mémoire de Windows a signalé des erreurs, et un test barrette par barrette désigne celle de l'emplacement B2. Une barrette neuve de même référence est arrivée.",
      besoin: ["Ouvrir le PC en sécurité (secteur débranché, bracelet antistatique)", "Remplacer la barrette de l'emplacement B2 par la neuve", "Garder la mémoire en double canal (16 Go)", "Refermer, rebrancher et vérifier le démarrage"],
      materiel: "Le PC bureautique monté en B-01, une barrette DDR4-3200 8 Go neuve. Outillage : tournevis cruciforme, bracelet antistatique.",
      source: SOURCE_SECU, umons: UMONS
    },
    criteres: [{ t: "securite" }, { t: "piece", slot: "dimm-b2", id: "ram-ddr4-neuve", label: "Barrette neuve en B2", theme: "memoire" }, { t: "ram", min: 16 }, { t: "canal" }],
    etapes: suite(["debrancher", "esd", "retirer", "poser", "rebrancher", "interrupteur", "demarrage"], {
      retirer: { id: "retirer", titre: "Retirer la barrette défectueuse", slots: [], vide: ["dimm-b2"], vue: "zoom", outillage: ["Bracelet antistatique", "Sachet antistatique pour la barrette retirée", "Étiquette « défectueuse »"],
        texte: "Écarte les clips de l'emplacement B2 : la barrette se soulève. Tiens-la par les bords et retire-la (touche-la sur la planche, puis « Retirer cette pièce »).",
        indices: ["Vue « Carte mère » : B2 est la quatrième fente en partant du processeur.", "La barrette défectueuse porte la mention « défectueuse » dans sa fiche."],
        pourquoi: "On manipule une barrette par ses bords, sans toucher les contacts dorés. La barrette défectueuse s'étiquette et se met de côté (sachet antistatique) pour le retour au fournisseur.",
        solution: [] },
      poser: { id: "poser", titre: "Poser la barrette neuve", slots: ["dimm-b2"], attendu: [["dimm-b2", "ram-ddr4-neuve"]], vue: "zoom",
        texte: "Pose la barrette neuve dans le même emplacement B2 : encoche alignée, appui aux deux extrémités jusqu'au « clic » des clips.",
        indices: ["Onglet « Composants » du bac : la barrette « (neuve) »."],
        pourquoi: "Même emplacement, même référence : la mémoire reste en double canal (A2 et B2) et les deux barrettes fonctionnent à la même fréquence.",
        solution: [["dimm-b2", "ram-ddr4-neuve"]] }
    })
  };

  /* ---------- C-02 : remplacer le SSD M.2 ---------- */
  var d2 = depart({ "m2-1": "ssd-nvme-hs" });
  S["remplacer-ssd"] = {
    id: "remplacer-ssd", code: "C-02", unite: "atelier-c2", type: "demontage", securite: true, memo: true,
    titre: "Remplacer un SSD M.2", niveau: "Intermédiaire", duree: "≈ 15 min", mode: "apprentissage",
    disposition: "tour-matx", boitier: base.boitier, exige: base.exige,
    depart: d2, departSwitch: true, inventaire: inventaire(d2, ["ssd-nvme-1to"]),
    brief: {
      client: "Ticket : l'état SMART du SSD d'un PC de bureau annonce une fin de vie. Les données ont été sauvegardées. Un SSD M.2 NVMe de 1 To le remplace ; Windows sera réinstallé par déploiement.",
      besoin: ["Ouvrir le PC en sécurité", "Retirer le SSD M.2 en fin de vie (une vis à son extrémité)", "Poser le SSD de 1 To", "Refermer, rebrancher et vérifier que le disque est détecté"],
      materiel: "Le PC bureautique monté, un SSD M.2 NVMe 1 To. Outillage : petit tournevis cruciforme, bracelet antistatique.",
      source: SOURCE_SECU, umons: UMONS
    },
    criteres: [{ t: "securite" }, { t: "piece", slot: "m2-1", id: "ssd-nvme-1to", label: "SSD de 1 To en place", theme: "stockage" }, { t: "ssd", min: 1000, type: "ssd-m2" }],
    etapes: suite(["debrancher", "esd", "retirer", "poser", "rebrancher", "interrupteur", "demarrage"], {
      retirer: { id: "retirer", titre: "Retirer le SSD en fin de vie", slots: [], vide: ["m2-1"], vue: "zoom", outillage: ["Petit tournevis cruciforme", "Bracelet antistatique"],
        texte: "Dévisse la petite vis au bout du SSD : il se relève en biais. Tire-le doucement hors du connecteur M.2.",
        indices: ["Vue « Carte mère » : le connecteur M.2 est sous le processeur, souvent caché par le ventirad ou la carte graphique."],
        pourquoi: "Un SSD M.2 tient par son connecteur et une vis (ou un clip sans outil, selon la carte). Un disque qui part contient des données : il suit la procédure de destruction ou d'effacement de l'établissement.",
        solution: [] },
      poser: { id: "poser", titre: "Poser le SSD de 1 To", slots: ["m2-1"], attendu: [["m2-1", "ssd-nvme-1to"]], vue: "zoom",
        texte: "Insère le SSD neuf en biais dans le connecteur M.2, rabats-le et revisse.",
        indices: ["Onglet « Composants » : SSD M.2 NVMe 1 To."],
        pourquoi: "Le format M.2 2280 (22 × 80 mm) doit correspondre à l'emplacement de la vis. Aucun câble : le M.2 NVMe passe par le bus PCIe de la carte.",
        solution: [["m2-1", "ssd-nvme-1to"]] }
    })
  };

  /* ---------- C-03 : remplacer l'alimentation ---------- */
  var d3 = depart({ psu: "psu-450-hs" });
  var CAB_ALIM = ["con-atx24", "con-eps"];
  S["remplacer-alim"] = {
    id: "remplacer-alim", code: "C-03", unite: "atelier-c3", type: "demontage", securite: true, memo: true,
    titre: "Remplacer l'alimentation", niveau: "Intermédiaire", duree: "≈ 20 min", mode: "apprentissage",
    disposition: "tour-matx", boitier: base.boitier, exige: base.exige,
    depart: d3, departSwitch: true, inventaire: inventaire(d3, ["psu-450-neuve"]),
    brief: {
      client: "Ticket : un PC ne s'allume plus du tout, aucun ventilateur ne tourne. Le testeur d'alimentation confirme que le bloc est en panne. Un bloc neuf du même modèle est arrivé.",
      besoin: ["Ouvrir le PC en sécurité", "Débrancher les câbles qui sortent de l'alimentation, puis la retirer", "Poser l'alimentation neuve et rebrancher ses câbles", "Refermer, rebrancher et vérifier le démarrage"],
      materiel: "Le PC bureautique monté, une alimentation ATX 450 W neuve. Outillage : tournevis cruciforme, bracelet antistatique.",
      source: SOURCE_SECU, umons: UMONS
    },
    criteres: [{ t: "securite" }, { t: "piece", slot: "psu", id: "psu-450-neuve", label: "Alimentation neuve en place", theme: "alim" }],
    etapes: suite(["debrancher", "esd", "cables", "retirer", "poser", "recabler", "rebrancher", "interrupteur", "demarrage"], {
      cables: { id: "cables", titre: "Débrancher les câbles de l'alimentation", slots: [], vide: CAB_ALIM, vue: "zoom",
        texte: "Retire un par un les câbles qui sortent de l'alimentation : le 24 broches de la carte mère et l'EPS du processeur (ce PC n'a pas de disque SATA). Appuie sur le loquet de chaque connecteur avant de tirer.",
        indices: ["Le moteur refuse de retirer l'alimentation tant qu'un de ses câbles est branché : il te dit lequel.", "Vue « Carte mère » : le 24 broches au bord droit de la carte, l'EPS en haut, près du processeur."],
        pourquoi: "Bonne pratique : chaque connecteur a un loquet ; on appuie dessus et on tire par le connecteur, pas par les fils. Prendre une photo du câblage avant de débrancher aide à tout remettre.",
        solution: [] },
      retirer: { id: "retirer", titre: "Retirer l'alimentation en panne", slots: [], vide: ["psu"], vue: "cote", outillage: ["Tournevis cruciforme"],
        attention: "Le bloc d'alimentation ne s'ouvre pas : il peut produire des tensions dangereuses, et seuls des techniciens formés interviennent dedans (consignes de sécurité Dell).",
        texte: "Dévisse les quatre vis à l'arrière du boîtier et sors l'alimentation.",
        indices: ["Touche l'alimentation sur la planche, puis « Retirer cette pièce »."],
        pourquoi: "Une alimentation en panne ne s'ouvre pas au service desk : elle peut produire des tensions dangereuses (consignes de sécurité Dell). Elle se remplace en entier.",
        solution: [] },
      poser: { id: "poser", titre: "Poser l'alimentation neuve", slots: ["psu"], attendu: [["psu", "psu-450-neuve"]], vue: "cote",
        texte: "Glisse l'alimentation neuve à sa place et revisse-la.",
        indices: ["Onglet « Composants » : l'alimentation « (neuve) »."],
        pourquoi: "Même format (ATX), même puissance, mêmes connecteurs : rien d'autre ne change dans le PC.",
        solution: [["psu", "psu-450-neuve"]] },
      recabler: { id: "recabler", titre: "Rebrancher ses câbles", slots: CAB_ALIM, vue: "zoom",
        texte: "Rebranche le 24 broches et l'EPS, jusqu'au clic du loquet.",
        indices: ["Onglet « Câbles » du bac.", "Le câble EPS va près du processeur, le 24 broches au bord de la carte."],
        pourquoi: "Un connecteur mal enfoncé est une cause classique de panne après intervention : on vérifie chaque loquet.",
        solution: [["con-atx24", "cab-atx24"], ["con-eps", "cab-eps"]] }
    })
  };

  /* Thème « à revoir » propre au démontage. */
  if (A.revoir) A.revoir.securite = { titre: "Sécurité de l'intervention", conseil: "Avant d'ouvrir : arrêt complet, câble secteur débranché, bouton marche maintenu 15 à 20 s ; avant de toucher une pièce : bracelet antistatique relié à une masse ou contact avec une partie métallique non peinte ; le secteur se rebranche en dernier.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" };
})();
