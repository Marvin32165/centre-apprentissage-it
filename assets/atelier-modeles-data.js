/* Atelier hardware — partie F : annexes, modèles de PC d'entreprise (lot 47).
   Source unique de chaque annexe : le manuel du constructeur, ouvert et lu le 28/11/2026 (titre, modèle réglementaire, date).
   Aucune position interne n'est inventée : la maquette ne montre que le boîtier coté, son capot et sa façade. */
(function () {
  "use strict";
  var A = window.IT_ATELIER;
  if (!A) return;
  var MAN = ["Dell : OptiPlex Small Form Factor 7010 Owner's Manual (modèle réglementaire D17S, type D17S003, mars 2023, Rev. A00), copie du document Dell publiée par Ingram Micro", "https://inquirecontent2.ingrammicro.com/User-Manual/1077071020.pdf"];
  A.modeles = {
    "optiplex-7010-sff": {
      id: "optiplex-7010-sff", titre: "Dell OptiPlex Small Form Factor 7010",
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
    }
  };
})();
