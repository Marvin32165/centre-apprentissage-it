/* Atelier hardware — données des fiches techniques (partie A, lot 44).
   Règle : chaque valeur chiffrée vient d'une source ouverte le 28/11/2026 (liste `sources` de la fiche) ou du module
   « Matériel et PC » (relu contre ses sources au lot 21). Les pièces de l'atelier restent génériques.
   Planche : boîte 3D de la pièce (mm), repères (`reps` : ancre 3D, direction de la ligne d'attache), cotes (`cotes`). */
(function () {
  "use strict";
  var A = window.IT_ATELIER;
  if (!A) return;
  var MP = "../modules/materiel-pc.html";
  var SRC = {
    module: ["Module « Matériel et PC » de la plateforme", MP, "faits relus contre leurs sources (lot 21)"],
    ark12400: ["Intel : fiche du Core i5-12400", "https://www.intel.com/content/www/us/en/products/sku/134586/specifications.html", "cœurs, puissance, socket, graphique, mémoire"],
    ark12400f: ["Intel : fiche du Core i5-12400F", "https://www.intel.com/content/www/us/en/products/sku/134587/specifications.html", "aucune section « graphique »"],
    intelBios: ["Intel : processeurs et mise à jour du BIOS de la carte", "https://www.intel.com/content/www/us/en/support/articles/000092294/processors.html"],
    dellRam: ["Dell : types de mémoire", "https://www.dell.com/support/kbdoc/en-us/000148441/what-is-ram"],
    kingston: ["Kingston : règles de remplissage de la mémoire", "https://www.kingston.com/en/memory/memory-population-rules"],
    intelMem: ["Intel : vitesse de la mémoire", "https://www.intel.com/content/www/us/en/support/articles/000095111/processors.html"],
    atx22: ["Intel : ATX Specification, version 2.2 (§ 3.1 Board Size)", "https://xdevs.com/doc/_PC_HW/Form_factors/atx2_2.pdf", "copie du document Intel"],
    intelPsu: ["Intel : ATX Version 3 Multi Rail Desktop Platform Power Supply Design Guide (doc. 336521)", "https://www.intel.com/content/www/us/en/content-details/336521/atx-version-3-multi-rail-desktop-platform-power-supply-design-guide.html"],
    dellM2: ["Dell : différences entre les cartes M.2 (tailles et clés)", "https://www.dell.com/support/kbdoc/en-us/000144170/how-to-distinguish-the-differences-between-m-2-cards"],
    sataio: ["SATA-IO : « Fast Just Got Faster: SATA 6Gb/s » (27/05/2009)", "https://www.sata-io.org/sites/default/files/documents/SATA-6Gbs-Fast-Just-Got-Faster_1.pdf"],
    dellChaud: ["Dell : surchauffe et nettoyage des aérations", "https://www.dell.com/support/kbdoc/en-ed/000130867/how-to-troubleshoot-a-overheating-shutdown-or-thermal-issue-on-a-dell-pc"],
    dellSecu: ["Dell : sécurité électrique et protection ESD (article 000137973)", "https://www.dell.com/support/kbdoc/en-us/000137973/safety-precautions-when-working-with-electrical-equipment"]
  };
  function L(code, s, titre) { return [code, "montage.html?s=" + s, titre]; }

  A.fiches = {
    processeur: {
      id: "processeur", titre: "Processeur",
      role: "Le processeur exécute les programmes ; il se pose dans le socket de la carte mère et se refroidit par un ventirad.",
      texte: [
        "Le processeur (CPU) se reconnaît à sa référence, qui renvoie à une fiche du constructeur : nombre de cœurs, puissance, socket, graphique intégré, mémoire acceptée. Avant tout achat ou remplacement, c'est cette fiche qu'on lit, avec celle de la carte mère.",
        "Exemple réel : la fiche Intel du Core i5-12400 donne 6 cœurs et 12 threads, une puissance de base de 65 W (jusqu'à 117 W en turbo), le socket FCLGA1700, un graphique intégré Intel UHD Graphics 730 et deux canaux de mémoire."
      ],
      carac: [["Socket", "FCLGA1700 (i5-12400) ; doit être celui de la carte mère"], ["Cœurs / threads", "6 / 12 (i5-12400)"], ["Puissance", "Base 65 W, turbo maximal 117 W (i5-12400)"], ["Graphique intégré", "Intel UHD Graphics 730 (i5-12400) ; absent de la fiche du i5-12400F"], ["Mémoire", "DDR5 jusqu'à 4800 MT/s ou DDR4 jusqu'à 3200 MT/s, 2 canaux (i5-12400)"]],
      verifier: [["Le socket", " : le même sur le processeur et la carte mère (par exemple LGA 1700 chez Intel, AM5 chez AMD)."], ["La liste de compatibilité", " de la carte : un processeur récent peut demander une mise à jour du BIOS."], ["Le graphique", " : sans carte graphique dédiée, il faut un processeur à graphique intégré, et l'écran se branche sur la carte mère."], ["Le refroidissement", " : un ventirad prévu pour la puissance du processeur, avec de la pâte thermique."]],
      pieges: ["Chez Intel, un suffixe F (i5-12400F) désigne ici un modèle sans graphique intégré : sa fiche n'a aucune section graphique. Sans carte graphique, pas d'image.", "On tient un processeur par les bords, après s'être déchargé (bracelet ou partie métallique non peinte)."],
      atelier: [L("B-01", "bureautique-intel", "PC bureautique Intel : choisir le processeur à graphique intégré"), L("B-03", "gamer-amd", "PC gamer AMD : socket AM5")],
      sources: [SRC.ark12400, SRC.ark12400f, SRC.intelBios, SRC.dellSecu, SRC.module],
      planche: { type: "cpu", piece: "cpu-12400", objet: "Processeur", boite: { x: 0, y: 0, z: 0, w: 45, d: 4, h: 37.5 },
        legende: "Processeur en boîtier LGA vu de trois quarts, capot métallique dessus.",
        reps: [{ rep: "1", nom: "Capot métallique (dissipateur intégré), qui reçoit la pâte thermique", ancre: [22, 4, 19], dir: [44, -34] }, { rep: "2", nom: "Substrat : les contacts sont dessous, les broches sont dans le socket (LGA)", ancre: [44, 2, 2], dir: [40, 26] }] }
    },
    memoire: {
      id: "memoire", titre: "Mémoire vive",
      role: "La mémoire vive (RAM) garde les programmes et les données en cours d'utilisation ; elle s'efface à l'arrêt.",
      texte: [
        "Une barrette se choisit par son type (DDR4 ou DDR5), son format (DIMM pour une tour, SO-DIMM pour un portable ou un mini-PC), sa capacité et sa vitesse. Le type est fixé par la carte mère.",
        "Deux barrettes identiques sur deux canaux différents donnent le double canal : plus de bande passante possible. Les emplacements à remplir en premier sont indiqués dans le manuel de la carte mère."
      ],
      carac: [["Type", "DDR4 ou DDR5 : fixé par la carte mère, non interchangeables"], ["Format", "DIMM (tour), SO-DIMM (portable, mini-PC)"], ["Capacité", "En Go par barrette ; on additionne les barrettes"], ["Vitesse", "En MT/s ; la vitesse retenue dépend du contrôleur et du remplissage"], ["Canaux", "Double canal : deux barrettes sur deux canaux (manuel de la carte)"]],
      verifier: [["Le type", " : DDR4 ou DDR5, comme la carte mère."], ["Le format", " : DIMM ou SO-DIMM."], ["Les emplacements", " à remplir en premier (dans l'atelier : A2 puis B2)."], ["Après la pose", " : capacité vue par le système, test avec l'Outil Diagnostics de mémoire Windows (mdsched.exe) en cas de doute."]],
      pieges: ["DDR4 et DDR5 n'ont pas l'encoche au même endroit : la barrette n'entre pas. Ne jamais forcer.", "Des barrettes mélangées (marques, vitesses, tailles) peuvent fonctionner, mais c'est une source d'instabilité à tester en premier."],
      umons: "Les modèles de PC de l'UMONS et leur mémoire (soudée ou non sur les portables) : sur la page du modèle chez le constructeur.",
      atelier: [L("B-01", "bureautique-intel", "Poser deux barrettes en double canal"), L("C-01", "remplacer-ram", "Remplacer une barrette défectueuse")],
      sources: [SRC.dellRam, SRC.kingston, SRC.intelMem, SRC.module],
      planche: { type: "ram", piece: "ram-ddr4-a", objet: "Barrette DIMM", boite: { x: 0, y: 0, z: 0, w: 4, d: 31, h: 133 },
        legende: "Barrette DIMM de trois quarts : puces, encoche et contacts.",
        reps: [{ rep: "1", nom: "Puces de mémoire", ancre: [4, 16, 53], dir: [48, -20] }, { rep: "2", nom: "Encoche (détrompeur) : sa place dépend du type, DDR4 ou DDR5", ancre: [4, 2, 72], dir: [-48, 30] }, { rep: "3", nom: "Contacts dorés : on ne les touche pas", ancre: [4, 1, 115], dir: [-52, -10] }] }
    },
    "carte-mere": {
      id: "carte-mere", titre: "Carte mère",
      role: "La carte mère relie tout : processeur, mémoire, stockage, cartes d'extension, alimentation et ports.",
      texte: [
        "Sa fiche technique dit ce qu'elle accepte : socket du processeur (et liste de compatibilité), type de mémoire, emplacements M.2 (NVMe, SATA, longueurs), format, sorties vidéo. C'est la première fiche à lire avant de commander une pièce.",
        "Le format fixe la taille et les trous de fixation. D'après la spécification Intel, une carte ATX complète mesure 305 × 244 mm, et les trous ATX tombent, autant que possible, en face de ceux des cartes micro-ATX, plus petites : un boîtier ATX accepte aussi ces cartes."
      ],
      carac: [["Format", "ATX : 305 × 244 mm (spécification Intel 2.2) ; micro-ATX et mini-ITX plus petits"], ["Socket", "Un seul type de processeur (LGA 1700, AM5…)"], ["Mémoire", "DDR4 ou DDR5, nombre d'emplacements"], ["Stockage", "Emplacements M.2 (NVMe ou SATA, longueurs) et ports SATA"], ["Extension", "Ports PCIe, dont un x16 pour la carte graphique"], ["Vidéo", "Sorties reliées au graphique du processeur (cas courant)"]],
      verifier: [["Le format", " : la carte entre dans le boîtier, les entretoises sont en face de ses trous."], ["Le socket", " et la liste de compatibilité des processeurs (mise à jour du BIOS si besoin)."], ["La mémoire", " : DDR4 ou DDR5."], ["Le cache I/O", " : déjà intégré à la carte, ou à clipser avant de la poser."]],
      pieges: ["Une entretoise sans trou en face touche les soudures de la carte : court-circuit possible. On ne pose que celles qui correspondent aux trous."],
      atelier: [L("B-02", "salle-info", "PC de salle informatique"), L("B-05", "mini-itx", "PC mini-ITX : petite carte, contraintes de place")],
      sources: [SRC.atx22, SRC.intelBios, SRC.module],
      planche: { type: "carte-mere", piece: "mb-z790-atx", objet: "Carte mère ATX", boite: { x: 0, y: 0, z: 0, w: 244, d: 2, h: 305 },
        legende: "Carte mère ATX à plat : socket, mémoire, port PCIe x16, connecteur d'alimentation et ports arrière.",
        cotes: [{ a: [0, 2, 0], b: [244, 2, 0], txt: "244 mm", dec: [0, 0, -24] }, { a: [244, 2, 0], b: [244, 2, 305], txt: "305 mm", dec: [26, 0, 0] }],
        reps: [{ rep: "1", nom: "Socket du processeur", ancre: [99, 2, 220], dir: [-60, -50] }, { rep: "2", nom: "Emplacements de mémoire (DIMM)", ancre: [186, 2, 250], dir: [50, -50] }, { rep: "3", nom: "Port PCIe x16 (carte graphique)", ancre: [100, 2, 129], dir: [-70, 30] }, { rep: "4", nom: "Connecteur d'alimentation 24 broches", ancre: [239, 2, 210], dir: [60, 0] }, { rep: "5", nom: "Ports arrière (sous le cache I/O)", ancre: [19, 2, 220], dir: [-60, -10] }] }
    },
    alimentation: {
      id: "alimentation", titre: "Alimentation",
      role: "Le bloc d'alimentation transforme le courant du secteur en tensions continues pour la carte mère, le processeur, la carte graphique et les disques.",
      texte: [
        "Un bloc se choisit par sa puissance (avec de la marge sur la consommation maximale), son format (ATX pour une tour, SFX plus compact) et ses connecteurs. Intel publie le guide de conception des alimentations de bureau (ATX version 3, document 336521) que suivent les constructeurs.",
        "Une alimentation trop faible ou fatiguée donne des arrêts sous charge et des redémarrages sans écran bleu ; l'événement 41 (Kernel-Power) du journal Système dit seulement que Windows ne s'est pas arrêté proprement."
      ],
      carac: [["ATX 24 broches", "La carte mère"], ["EPS 8 broches (4+4), parfois deux", "Le processeur, près du socket"], ["PCIe 8 broches (6+2) ou 16 broches 12V-2x6", "La carte graphique dédiée, selon le modèle"], ["SATA (alimentation)", "Les disques SATA, certains accessoires"], ["Format", "ATX (tour) ou SFX (compact)"]],
      verifier: [["La puissance", " : consommation maximale du processeur et de la carte graphique, plus le reste, avec de la marge."], ["Le format", " : ATX ou SFX, selon le boîtier."], ["Les connecteurs", " : EPS pour le processeur, PCIe pour la carte graphique."], ["L'interrupteur", " à l'arrière : sur I avant d'allumer, sur O avant d'intervenir."]],
      pieges: ["On n'ouvre jamais un bloc d'alimentation : des condensateurs y gardent une charge dangereuse même débranché. Un bloc suspect se remplace en entier.", "Le câble PCIe ressemble au câble EPS mais n'est pas câblé pareil : on ne force jamais un connecteur. Un connecteur 16 broches doit être enfoncé à fond."],
      atelier: [L("C-03", "remplacer-alim", "Remplacer l'alimentation"), L("B-03", "gamer-amd", "PC gamer : dimensionner l'alimentation")],
      sources: [SRC.intelPsu, SRC.module],
      planche: { type: "alim", piece: "psu-450", objet: "Bloc ATX", boite: { x: 0, y: 0, z: 0, w: 140, d: 150, h: 86 },
        legende: "Bloc d'alimentation ATX de trois quarts : ventilateur dessus, étiquette sur le flanc.",
        reps: [{ rep: "1", nom: "Ventilateur, à tourner vers une grille d'aération du boîtier", ancre: [70, 75, 86], dir: [10, -60] }, { rep: "2", nom: "Étiquette : puissance et tensions de sortie", ancre: [50, 150, 40], dir: [-60, 30] }] }
    },
    stockage: {
      id: "stockage", titre: "Stockage",
      role: "Le disque garde le système, les programmes et les données quand le PC est éteint : disque dur, SSD SATA ou SSD NVMe.",
      texte: [
        "Un SSD M.2 se décrit par sa taille, écrite en chiffres : d'après Dell, les deux premiers donnent la largeur et les suivants la longueur, en millimètres. Un 2280 mesure donc 22 × 80 mm. La clé (encoche du connecteur) indique les bus possibles : clé M pour le PCIe x4 (SSD rapides), clé B surtout pour les SSD SATA.",
        "Le SATA 6Gb/s (révision 3.0) offre environ 600 Mo/s au maximum, d'après SATA-IO, avec les mêmes câbles et connecteurs que le SATA 3Gb/s. Un SSD M.2 qui passe par le bus SATA reste à la vitesse du SATA, quel que soit son format."
      ],
      carac: [["Taille M.2", "2280 = 22 mm de large, 80 mm de long (Dell)"], ["Clé M", "PCIe x4 ou SATA ; SSD rapides (Dell)"], ["Clé B", "PCIe x2 ou SATA ; SSD SATA le plus souvent (Dell)"], ["SATA 6Gb/s", "≈ 600 Mo/s au maximum (SATA-IO)"], ["NVMe", "Passe par le bus PCIe, sans câble, dans un emplacement M.2 qui le gère"], ["Disque dur", "Mécanique : sensible aux chocs, plus lent"]],
      verifier: [["L'emplacement M.2", " : NVMe, SATA ou les deux, et les longueurs acceptées (manuel de la carte)."], ["Un disque SATA", " : deux câbles, données et alimentation."], ["L'état du disque", " : indicateurs SMART résumés par Get-PhysicalDisk."], ["Le démarrage UEFI", " : disque système en GPT."]],
      pieges: ["Un disque qui part contient des données : il suit la procédure d'effacement ou de destruction de l'établissement.", "Sur un disque mourant, sauvegarde d'abord : pas de réparation longue (chkdsk /r) sur des données uniques sans copie."],
      umons: "Procédure de l'UMONS pour un disque remplacé (effacement, destruction, retour au fournisseur) : à vérifier sur place.",
      atelier: [L("C-02", "remplacer-ssd", "Remplacer un SSD M.2"), L("B-04", "station", "Station de travail : deux disques")],
      sources: [SRC.dellM2, SRC.sataio, SRC.module],
      planche: { type: "ssd-m2", piece: "ssd-nvme", objet: "SSD M.2 2280", boite: { x: 0, y: 0, z: 0, w: 80, d: 2.5, h: 22 },
        legende: "SSD M.2 2280 cotés : 22 mm de large, 80 mm de long.",
        cotes: [{ a: [0, 2.5, 0], b: [80, 2.5, 0], txt: "80 mm", dec: [0, 0, -14] }, { a: [80, 2.5, 0], b: [80, 2.5, 22], txt: "22 mm", dec: [14, 0, 0] }],
        reps: [{ rep: "1", nom: "Contacts et clé du connecteur M.2", ancre: [1, 2.5, 11], dir: [-44, -24] }, { rep: "2", nom: "Puces (contrôleur et mémoire flash)", ancre: [17, 2.5, 11], dir: [-10, -50] }, { rep: "3", nom: "Encoche de la vis de fixation", ancre: [78, 2.5, 11], dir: [40, -40] }] }
    },
    "carte-graphique": {
      id: "carte-graphique", titre: "Carte graphique",
      role: "La carte graphique dédiée calcule l'image quand le graphique intégré ne suffit pas ; l'écran se branche alors sur elle.",
      texte: [
        "Elle s'enfonce dans le port PCIe x16 de la carte mère et reçoit souvent un câble d'alimentation en plus : 8 broches (6+2) ou 16 broches 12V-2x6 selon le modèle. Sa longueur doit tenir dans le boîtier.",
        "Avec une carte dédiée, l'écran se branche sur ses sorties, pas sur celles de la carte mère."
      ],
      carac: [["Port", "PCIe x16 de la carte mère"], ["Alimentation", "Câble PCIe 8 broches (6+2) ou 16 broches 12V-2x6, selon le modèle"], ["Taille", "Longueur et épaisseur (emplacements occupés) à comparer au boîtier"], ["Sorties", "Sur l'équerre arrière de la carte"]],
      verifier: [["La longueur", " maximale acceptée par le boîtier."], ["L'alimentation", " : puissance et connecteurs PCIe disponibles."], ["Le branchement de l'écran", " sur la carte dédiée."]],
      pieges: ["Le câble PCIe et le câble EPS se ressemblent : on suit le détrompeur, on ne force jamais.", "Un connecteur 16 broches mal enfoncé peut chauffer : il s'enfonce à fond."],
      atelier: [L("B-03", "gamer-amd", "PC gamer AMD : poser et alimenter la carte"), L("B-06", "mise-a-niveau", "Mise à niveau : ajouter une carte graphique")],
      sources: [SRC.module],
      planche: { type: "gpu", piece: "gpu-8pin", objet: "Carte graphique", boite: { x: 0, y: 0, z: 0, w: 240, d: 112, h: 38 },
        extra: [{ type: "cab-pcie", boite: { x: 200, y: 112, z: 14, w: 18, d: 6, h: 10 } }],
        legende: "Carte graphique dédiée : refroidissement, équerre arrière et prise d'alimentation PCIe.",
        reps: [{ rep: "1", nom: "Contacts PCIe x16 (côté carte mère)", ancre: [100, 4, 38], dir: [-30, -50] }, { rep: "2", nom: "Ventilateurs du refroidissement", ancre: [168, 56, 38], dir: [40, -50] }, { rep: "3", nom: "Équerre arrière et sorties vidéo", ancre: [-1, 100, 38], dir: [-50, -20] }, { rep: "4", nom: "Prise d'alimentation PCIe", ancre: [209, 118, 24], dir: [50, 30] }] }
    },
    refroidissement: {
      id: "refroidissement", titre: "Boîtier et refroidissement",
      role: "Le boîtier porte les pièces et organise le flux d'air ; le ventirad évacue la chaleur du processeur.",
      texte: [
        "L'air frais entre par l'avant, traverse le boîtier et sort par l'arrière. Le ventirad se pose sur le processeur avec de la pâte thermique, et son ventilateur se branche sur l'embase CPU_FAN.",
        "Un processeur trop chaud réduit sa fréquence pour se protéger (il « bride »), puis coupe la machine net s'il chauffe encore. Les aérations bouchées par la poussière en sont une cause classique."
      ],
      carac: [["Formats acceptés", "Carte mère et alimentation (fiche du boîtier)"], ["Hauteur de ventirad", "Maximum donné par le boîtier"], ["Longueur de carte graphique", "Maximum donné par le boîtier"], ["Flux d'air", "Entrée à l'avant, sortie à l'arrière"], ["Ventilateur du processeur", "Sur l'embase CPU_FAN de la carte"]],
      verifier: [["Les dimensions", " : hauteur du ventirad, longueur de la carte graphique."], ["La pâte thermique", " entre le processeur et le ventirad."], ["Le sens des ventilateurs", " : la flèche sur le cadre donne le sens de l'air."]],
      pieges: ["Nettoyage des aérations : machine éteinte et débranchée, air sec en courtes rafales. Le démontage du ventilateur ou le changement de pâte suivent le manuel du modèle et la garantie."],
      atelier: [L("B-01", "bureautique-intel", "Ventilateurs, pâte et ventirad"), L("B-05", "mini-itx", "Ventirad bas pour boîtier compact")],
      sources: [SRC.dellChaud, SRC.module],
      planche: { type: "ventirad", piece: "cooler-tower", objet: "Ventirad", boite: { x: 0, y: 0, z: 0, w: 100, d: 62, h: 100 },
        legende: "Ventirad à ailettes avec son ventilateur.",
        reps: [{ rep: "1", nom: "Ailettes : la chaleur s'y répand", ancre: [10, 62, 88], dir: [-50, -30] }, { rep: "2", nom: "Ventilateur (câble vers CPU_FAN)", ancre: [50, 62, 50], dir: [-60, 30] }, { rep: "3", nom: "Base, posée sur la pâte thermique du processeur", ancre: [100, 4, 4], dir: [40, 30] }] }
    },
    cables: {
      id: "cables", titre: "Câbles et connecteurs",
      role: "Les câbles de l'alimentation et de la façade relient les pièces à la carte mère ; chacun a un détrompeur.",
      texte: [
        "L'alimentation fournit le 24 broches (carte mère), l'EPS (processeur), le PCIe (carte graphique) et le SATA (disques). La façade du boîtier se relie à la carte mère par la nappe F_PANEL (bouton marche, LED), l'embase USB 3 et l'embase audio.",
        "Chaque connecteur n'entre que dans un sens et dans une seule prise : si ça résiste, ce n'est pas la bonne."
      ],
      carac: [["24 broches", "Alimentation de la carte mère"], ["EPS 8 broches (4+4)", "Processeur"], ["PCIe 8 broches (6+2)", "Carte graphique"], ["SATA alimentation / données", "Disque SATA : les deux sont nécessaires"], ["F_PANEL", "Bouton marche et LED de la façade"]],
      verifier: [["Le loquet", " de chaque connecteur : enclenché."], ["Le bon câble", " : EPS au processeur, PCIe à la carte graphique."], ["La nappe de façade", " : sans elle, le bouton marche ne fait rien."]],
      pieges: ["On débranche en appuyant sur le loquet et en tirant par le connecteur, jamais par les fils.", "On ne force jamais un connecteur : le détrompeur est là pour ça."],
      atelier: [L("B-01", "bureautique-intel", "Brancher l'alimentation, la façade et les ventilateurs"), L("C-03", "remplacer-alim", "Débrancher et rebrancher les câbles")],
      sources: [SRC.intelPsu, SRC.module],
      planche: { type: "cab-atx24", objet: "Connecteurs", boite: { x: 0, y: 0, z: 0, w: 10, d: 20, h: 52 },
        extra: [{ type: "cab-eps", boite: { x: 40, y: 0, z: 0, w: 10, d: 20, h: 20 } }, { type: "cab-pcie", boite: { x: 75, y: 0, z: 0, w: 10, d: 20, h: 20 } }, { type: "cab-sata-pwr", boite: { x: 110, y: 0, z: 0, w: 6, d: 22, h: 5 } }, { type: "cab-sata-data", boite: { x: 135, y: 0, z: 0, w: 6, d: 12, h: 5 } }, { type: "cab-facade", boite: { x: 160, y: 0, z: 0, w: 6, d: 10, h: 12 } }],
        legende: "Les connecteurs à reconnaître, de gauche à droite.",
        reps: [{ rep: "1", nom: "24 broches (carte mère)", ancre: [5, 10, 52], dir: [-30, -40] }, { rep: "2", nom: "EPS 4+4 (processeur)", ancre: [45, 10, 20], dir: [-10, -50] }, { rep: "3", nom: "PCIe 6+2 (carte graphique)", ancre: [80, 10, 20], dir: [10, -50] }, { rep: "4", nom: "SATA alimentation", ancre: [113, 11, 5], dir: [20, -50] }, { rep: "5", nom: "SATA données", ancre: [138, 6, 5], dir: [30, -45] }, { rep: "6", nom: "Nappe de façade (F_PANEL)", ancre: [163, 5, 12], dir: [40, -40] }] }
    }
  };
})();
