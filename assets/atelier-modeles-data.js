/* Atelier hardware — partie F : annexes, modèles de PC d'entreprise (lots 47 et 49).
   Source unique de chaque annexe : le manuel du constructeur, ouvert et lu le 28/11/2026 (titre, modèle réglementaire, date).
   Aucune position interne n'est inventée : la maquette ne montre que le boîtier coté, son capot et sa façade. */
(function () {
  "use strict";
  var A = window.IT_ATELIER;
  if (!A) return;
  var MAN = ["Dell : OptiPlex Small Form Factor 7010 Owner's Manual (modèle réglementaire D17S, type D17S003, mars 2023, Rev. A00), copie du document Dell publiée par Ingram Micro", "https://inquirecontent2.ingrammicro.com/User-Manual/1077071020.pdf"];
  var HP = ["HP : Maintenance and Service Guide — HP ProDesk 2 SFF G2i Desktop PC (Q41672-001, 1re édition, octobre 2026), copie du manuel HP sur Manualzz", "https://www.manualzz.com/doc/91502421/hp-prodesk-2-sff-g2i-desktop-pc-ids-base-model-maintenanc..."];
  A.modeles = {
    "optiplex-7010-sff": {
      id: "optiplex-7010-sff", titre: "Dell OptiPlex Small Form Factor 7010", constructeur: "Dell", titreCourt: "OptiPlex SFF 7010",
      reperes: ["Capot latéral : deux vis imperdables", "Façade avant : languettes à libérer par le haut", "Châssis"],
      role: "Un PC de bureau compact d'entreprise : même logique qu'une tour, mais un ordre d'accès imposé par le constructeur, et des pièces que l'utilisateur peut changer (CRU) ou non (FRU).",
      dims: { h: 290, w: 92.6, d: 292.8 },
      carac: [["Hauteur", "290,00 mm"], ["Largeur", "92,60 mm"], ["Profondeur", "292,80 mm"], ["Poids", "3,68 kg à 4,87 kg selon la configuration"], ["M.2", "Un emplacement 2230 pour la carte Wi-Fi et Bluetooth, un emplacement 2230/2280 pour le SSD"], ["SSD", "M.2 2230 ou 2280, PCIe NVMe"], ["Outillage", "Tournevis cruciformes n° 0 et n° 1, tournevis Torx T5, pointe en plastique"]],
      composants: ["Capot latéral", "Ensemble disque dur", "Dissipateur et ventilateur", "Barrette de mémoire", "Carte sans fil", "SSD M.2", "Carte mère", "Façade avant", "Bloc d'alimentation", "Châssis", "Carte d'extension", "Lecteur optique", "Processeur", "Haut-parleur"],
      cru: "Le manuel classe les pièces en deux familles. Les CRU (Customer Replaceable Units) peuvent être remplacées par le client en suivant les consignes de sécurité : capot, façade, disques, cage des disques, mémoire, SSD, carte sans fil, carte graphique, pile bouton… Les FRU (Field Replaceable Units) sont réservées aux techniciens de service autorisés : bouton marche, bloc d'alimentation, ventilateur et dissipateur, processeur, carte mère.",
      avant: ["Enregistrer et fermer les fichiers, quitter les applications.", "Arrêter l'ordinateur (Démarrer > Marche/Arrêt > Arrêter).", "Débrancher l'ordinateur et tous les appareils reliés de leurs prises électriques.", "Débrancher les câbles réseau et les périphériques (clavier, souris, écran) ; pour un câble réseau, d'abord côté ordinateur.", "Retirer cartes mémoire et disques optiques ; travailler avec un kit ESD et poser chaque pièce retirée sur un tapis antistatique."],
      procedures: [
        { titre: "Retirer le capot latéral", pre: ["Avant d'intervenir dans l'ordinateur"], etapes: ["Desserrer les deux vis imperdables qui fixent le capot au châssis.", "Faire glisser le capot vers l'arrière de l'ordinateur.", "Soulever le capot."] },
        { titre: "Retirer la façade avant", pre: ["Avant d'intervenir", "Capot latéral"], etapes: ["Dégager une à une les languettes de la façade, en partant du haut.", "Faire pivoter la façade vers l'extérieur et la retirer."] },
        { titre: "Retirer la cage des disques", pre: ["Avant d'intervenir", "Capot latéral", "Façade avant", "Disques 2,5″ et 3,5″ s'il y en a"], etapes: ["Si un lecteur optique est présent, sortir ses câbles des guides de la cage.", "Retirer la vis (6-32) qui libère la cage du châssis.", "Soulever la cage et la détacher de ses points de fixation, la faire pivoter et la poser sur le châssis.", "Débrancher les câbles du lecteur optique s'il y en a un, puis sortir la cage de l'ordinateur."] },
        { titre: "Retirer une barrette de mémoire (CRU)", pre: ["Avant d'intervenir", "Capot latéral", "Façade avant", "Disques s'il y en a", "Cage des disques"], etapes: ["Écarter du bout des doigts les clips aux deux extrémités de l'emplacement.", "Saisir la barrette près d'un clip et la sortir doucement de l'emplacement, en la tenant par les bords sans toucher ses composants."] },
        { titre: "Retirer le SSD M.2 2280 (CRU)", pre: ["Avant d'intervenir", "Capot latéral", "Façade avant", "Disques s'il y en a", "Cage des disques"], etapes: ["Retirer la vis (M2x3,5) qui fixe le SSD à la carte mère.", "Faire glisser et soulever le SSD hors de l'emplacement M.2."] },
        { titre: "Retirer le bloc d'alimentation (FRU)", pre: ["Réservé aux techniciens de service autorisés", "Avant d'intervenir", "Capot latéral", "Façade avant", "Disques s'il y en a", "Cage des disques"], etapes: ["Débrancher les câbles de l'alimentation de leurs connecteurs sur la carte mère.", "Sortir les câbles des guides du châssis.", "Retirer les trois vis qui fixent le bloc au châssis.", "Faire glisser et soulever le bloc hors du châssis."] }
      ],
      comparaison: [["Accès à la mémoire", "Tour de l'atelier : capot, puis la barrette.", "OptiPlex SFF 7010 : capot, façade, disques, cage des disques, puis la barrette."], ["Remplacer l'alimentation", "Tour de l'atelier : procédure C-03.", "OptiPlex SFF 7010 : FRU, réservée aux techniciens autorisés."], ["Fixation du SSD", "Tour de l'atelier : une vis.", "OptiPlex SFF 7010 : une vis M2x3,5 (2280)."]],
      umons: ["Les modèles de PC réellement en service à l'UMONS et leurs manuels", "Qui a le droit de remplacer une FRU (technicien du constructeur, garantie, contrat)", "Où trouver le numéro de service (étiquette) et la page du modèle"],
      sources: [MAN, ["Dell : sécurité électrique et protection ESD (article 000137973)", "https://www.dell.com/support/kbdoc/en-us/000137973/safety-precautions-when-working-with-electrical-equipment"]],
      liens: [["C-01", "montage.html?s=remplacer-ram", "Remplacer une barrette (tour de l'atelier)"], ["C-02", "montage.html?s=remplacer-ssd", "Remplacer un SSD M.2"], ["C-03", "montage.html?s=remplacer-alim", "Remplacer l'alimentation"]]
    },
    "prodesk-2-sff-g2i": {
      id: "prodesk-2-sff-g2i", titre: "HP ProDesk 2 SFF G2i Desktop PC", constructeur: "HP", titreCourt: "ProDesk 2 SFF G2i",
      role: "Ce PC de bureau compact donne accès au SSD sous le conduit du ventilateur. Le manuel HP distingue les interventions que le client peut faire de celles réservées à un service agréé.",
      dims: { h: 95, w: 270, d: 296 }, capotHaut: true,
      reperes: ["Capot supérieur : une vis imperdable", "Façade avant : trois languettes", "Châssis"],
      carac: [["Hauteur", "95 mm"], ["Largeur", "270 mm"], ["Profondeur", "296 mm"], ["Poids", "Environ 4,2 kg"], ["SSD", "PCIe 4 ×4 (tableau 4-7)"], ["Outillage", "Torx T15, cruciforme PH1, tournevis plat (peut parfois remplacer le Torx)"]],
      composants: ["Capot", "Façade", "Conduit du ventilateur", "Bloc d'alimentation", "SSD", "Barrettes de mémoire", "Carte mère", "Dissipateur avec ventilateur"],
      cru: "Le chapitre 4 classe le capot, la façade, le conduit, le SSD, les barrettes et le bloc d'alimentation parmi les pièces remplaçables par le client si le programme HP s'applique dans sa région et que sa garantie le permet. Le chapitre 5 réserve le dissipateur avec ventilateur, la carte mère et les antennes sans fil à un service agréé.",
      avant: ["Arrêter le PC dans le système d'exploitation.", "Débrancher le cordon d'alimentation et les périphériques.", "Prendre les précautions antistatiques du chapitre 3. Repérer les vis et le cheminement des câbles."],
      procedures: [
        { titre: "Retirer le capot (p. 17)", pre: ["Avant d'intervenir"], etapes: ["Desserrer la vis imperdable à l'arrière.", "Glisser le capot vers l'arrière et le soulever."] },
        { titre: "Retirer la façade (p. 17–18)", pre: ["Avant d'intervenir", "Capot"], etapes: ["Soulever les trois languettes, puis écarter la façade en la faisant pivoter."] },
        { titre: "Retirer le conduit du ventilateur (p. 23–24)", pre: ["Avant d'intervenir", "Capot"], etapes: ["Faire coulisser l'arrière du conduit vers l'intérieur.", "Écarter les languettes et soulever le conduit."] },
        { titre: "Retirer une barrette (p. 28–29)", pre: ["Attendre environ 30 s après avoir débranché le secteur", "Capot", "Façade"], etapes: ["Écarter les deux clips jusqu'au basculement de la barrette à 45°.", "Retirer la barrette sans toucher les contacts."] },
        { titre: "Retirer le SSD (p. 25–26)", pre: ["Avant d'intervenir", "Capot", "Conduit du ventilateur"], etapes: ["Retirer la vis cruciforme M2 × 3 mm.", "Sortir le SSD de son connecteur."] },
        { titre: "Retirer le bloc d'alimentation (p. 26–27)", pre: ["Avant d'intervenir", "Capot", "Façade", "Conduit du ventilateur"], etapes: ["Débrancher SYS_PWR, PWRCMD et CPU_PWR de la carte mère.", "Libérer les câbles des clips à l'avant et sur le côté.", "Enlever les trois vis arrière.", "Appuyer sur le levier de libération au fond du châssis. Glisser le bloc vers l'avant et le soulever."] }
      ],
      comparaison: [["Accès à la mémoire", "Tour de l'atelier : capot, puis la barrette.", "ProDesk : retirer le capot et la façade."], ["Remplacer l'alimentation", "Tour de l'atelier : procédure C-03.", "ProDesk : trois câbles côté carte mère et un levier de libération."], ["Accès au SSD", "Tour de l'atelier : capot, puis le SSD.", "ProDesk : retirer aussi le conduit du ventilateur."]],
      umons: ["Le modèle exact en service et la référence de son manuel", "La garantie et les personnes autorisées à intervenir"],
      sources: [HP],
      liens: [["C-01", "montage.html?s=remplacer-ram", "Remplacer une barrette (tour de l'atelier)"], ["C-02", "montage.html?s=remplacer-ssd", "Remplacer un SSD M.2"], ["C-03", "montage.html?s=remplacer-alim", "Remplacer l'alimentation"]]
    }
  };
})();
