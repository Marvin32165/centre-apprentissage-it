/* Atelier hardware — lot 6 : pannes.
   Une panne = un PC monté (état de base) + un défaut appliqué (slots retirés / remplacés, ou drapeau).
   - Les pannes de câblage et de montage passent par `simulerPOST` (assets/atelier-regles.js) : le défaut est un état de montage.
   - Les pannes de pièce défectueuse (mémoire, alimentation…) ont des symptômes écrits ici (`symp`), car le moteur ne modélise pas la mort d'une pièce.
   Les pièces et les mesures sont des modèles génériques : réalistes, mais simplifiées. */
(function () {
  "use strict";
  var A = window.IT_ATELIER = window.IT_ATELIER || {};

  /* ---------- PC de départ ---------- */
  var BUREAU = { standoffs: "entretoises-matx", ioshield: "cache-io", psu: "psu-450", "fan-rear": "fan-120-a", "fan-front": "fan-120-b",
    board: "mb-b660-matx", cpu: "cpu-12400", paste: "pate-thermique", cooler: "cooler-tower", "dimm-a2": "ram-ddr4-a", "dimm-b2": "ram-ddr4-b",
    "m2-1": "ssd-nvme", "con-atx24": "cab-atx24", "con-eps": "cab-eps", "h-cpufan": "cab-fan-cpu", "h-sys1": "cab-fan-rear", "h-sys2": "cab-fan-front",
    "con-fpanel": "cab-facade", "con-usb3": "cab-usb3", "con-audio": "cab-audio", mains: "cab-secteur", "mon-board": "cab-hdmi" };
  function copie(o) { var r = {}; Object.keys(o).forEach(function (k) { r[k] = o[k]; }); return r; }
  var GAMER = copie(BUREAU);
  GAMER.gpu = "gpu-8pin"; GAMER["con-gpu-pwr"] = "cab-pcie"; GAMER["mon-gpu"] = "cab-hdmi"; delete GAMER["mon-board"];
  var SATA = copie(BUREAU);
  delete SATA["m2-1"]; SATA["bay-ssd"] = "ssd-sata"; SATA["sata-data"] = "cab-sata-data"; SATA["sata-pwr"] = "cab-sata-pwr";
  A.pannesBases = { bureau: BUREAU, gamer: GAMER, sata: SATA };

  /* ---------- Outils d'inspection ---------- */
  A.pannesOutils = [
    { id: "visuel", nom: "Inspection visuelle et mesures simples", hors: true, aide: "Boîtier ouvert, PC hors tension : câbles, pièces enfichées, pile, traces." },
    { id: "ventirad", nom: "Démonter le ventirad", hors: true, aide: "Voir l'état du dessus du processeur et de la plaque du ventirad." },
    { id: "led", nom: "Observer les LED", hors: false, aide: "LED de la carte mère et LED de debug (CPU, DRAM, VGA, BOOT) pendant le démarrage." },
    { id: "bips", nom: "Écouter les bips", hors: false, aide: "Le buzzer de la carte mère signale certaines pannes avant l'image." },
    { id: "alim", nom: "Tester l'alimentation", hors: true, aide: "Testeur d'alimentation ou test du trombone, sur l'alimentation débranchée des composants." },
    { id: "temoin", nom: "Pièce témoin", hors: true, aide: "Remplacer UNE pièce par une pièce qui fonctionne, pour voir si le symptôme disparaît." },
    { id: "bios", nom: "Consulter l'UEFI", hors: false, aide: "Écran de configuration : composants détectés, température, date et heure." }
  ];
  A.pannesTemoins = [
    ["ram", "Barrette de mémoire témoin"], ["alim", "Alimentation témoin"], ["cpu", "Processeur témoin"],
    ["gpu", "Carte graphique témoin"], ["ssd", "SSD témoin"], ["pile", "Pile CMOS neuve"], ["ventirad", "Ventirad témoin"]
  ];

  /* ---------- Causes (diagnostic) et interventions (réparation) ----------
     Chaque cause a une intervention qui la corrige. Les deux dernières sont des fausses pistes fréquentes. */
  A.pannesCauses = [
    { id: "ram", nom: "Mémoire défectueuse", inter: "remplacer-ram" },
    { id: "alim", nom: "Alimentation défectueuse", inter: "remplacer-alim" },
    { id: "eps", nom: "Câble EPS du processeur non branché", inter: "brancher-eps" },
    { id: "pate", nom: "Pâte thermique absente", inter: "pate" },
    { id: "ventirad", nom: "Ventirad mal monté (film protecteur laissé)", inter: "remonter-ventirad" },
    { id: "poussiere", nom: "Refroidissement encrassé (poussière)", inter: "nettoyer" },
    { id: "gpu-cable", nom: "Carte graphique non alimentée (câble PCIe)", inter: "brancher-pcie" },
    { id: "gpu", nom: "Carte graphique défectueuse", inter: "remplacer-gpu" },
    { id: "sata", nom: "Câble de données SATA absent", inter: "brancher-sata" },
    { id: "ssd", nom: "SSD défectueux", inter: "remplacer-ssd" },
    { id: "cmos", nom: "Pile CMOS usée", inter: "remplacer-pile" },
    { id: "bios", nom: "BIOS trop ancien pour le processeur", inter: "maj-bios" },
    { id: "entretoise", nom: "Court-circuit : entretoise en trop sous la carte mère", inter: "refaire-entretoises" },
    { id: "facade", nom: "Nappe de façade non branchée", inter: "brancher-facade" },
    { id: "cpu", nom: "Processeur défectueux", inter: "remplacer-cpu" },
    { id: "carte-mere", nom: "Carte mère défectueuse", inter: "remplacer-carte-mere" }
  ];
  A.pannesInter = {
    "remplacer-ram": { nom: "Remplacer la mémoire", piece: true },
    "remplacer-alim": { nom: "Remplacer l'alimentation", piece: true },
    "brancher-eps": { nom: "Brancher le câble EPS 4+4 au processeur" },
    "pate": { nom: "Déposer de la pâte thermique et remonter le ventirad" },
    "remonter-ventirad": { nom: "Retirer le film du ventirad, vérifier la pâte et le remonter" },
    "nettoyer": { nom: "Nettoyer la poussière (grilles, ventirad, ventilateurs)" },
    "brancher-pcie": { nom: "Brancher le câble d'alimentation PCIe à la carte graphique" },
    "remplacer-gpu": { nom: "Remplacer la carte graphique", piece: true },
    "brancher-sata": { nom: "Brancher le câble de données SATA" },
    "remplacer-ssd": { nom: "Remplacer le SSD", piece: true },
    "remplacer-pile": { nom: "Remplacer la pile CMOS (CR2032)", piece: true },
    "maj-bios": { nom: "Mettre à jour le BIOS" },
    "refaire-entretoises": { nom: "Reposer la carte avec les bonnes entretoises" },
    "brancher-facade": { nom: "Brancher la nappe de façade sur F_PANEL" },
    "remplacer-cpu": { nom: "Remplacer le processeur", piece: true },
    "remplacer-carte-mere": { nom: "Remplacer la carte mère", piece: true }
  };

  /* ---------- Observations par défaut (PC sain) ---------- */
  A.pannesSain = {
    visuel: "Rien d'anormal : câbles enfichés à fond, pièces bien en place, aucune trace de brûlure ni de liquide, pas de poussière gênante.",
    ventirad: "Le dessus du processeur et la plaque du ventirad sont propres, avec un film de pâte fin et régulier. Le ventirad est bien à plat.",
    alim: "Testeur : +12 V = 12,1 V, +5 V = 5,0 V, +3,3 V = 3,3 V, signal PWR_OK présent. Toutes les tensions sont dans les tolérances du guide Intel des alimentations ATX (version 3, rév. 2.1a) : +12 V de −7 % à +5 %, +5 V et +3,3 V à ±5 %. L'alimentation est saine.",
    bios: "L'UEFI s'affiche : processeur, mémoire et disque reconnus, température du processeur stable et loin de son maximum, date et heure exactes."
  };

  /* ---------- Les pannes ---------- */
  var P = A.pannes = {};
  function panne(id, o) { o.id = id; o.obs = o.obs || {}; P[id] = o; }

  panne("ram-defectueuse", {
    niveau: "Débutant", base: "bureau", theme: "memoire", cause: "ram", fix: "remplacer-ram", flag: "ram", ko: "Mémoire détectée",
    titre: "Pas d'image au démarrage, le PC bipe",
    ticket: "« Ce matin, quand j'appuie sur le bouton, les ventilateurs tournent mais l'écran reste noir, et j'entends des bips. Hier, tout marchait. »",
    contexte: "PC de bureau de trois ans, deux barrettes de mémoire DDR4. Personne n'a ouvert le boîtier.",
    symp: { code: "bips", titre: "Pas d'image, bips répétés", ventilos: "tournent", ecran: "Pas de signal", leds: "LED de debug « DRAM » allumée fixe", debug: "DRAM",
      bips: "Bips répétés (le code exact dépend du constructeur : voir le manuel de la carte mère)", theme: "memoire",
      explication: ["Le POST teste la mémoire avant d'initialiser la vidéo. Quand elle ne répond pas, la carte signale l'erreur par la LED DRAM et par des bips, et l'image n'apparaît jamais."],
      correction: ["Remplacer la mémoire défectueuse."] },
    temoin: "ram",
    obs: { visuel: "Les deux barrettes sont enfoncées à fond, clips fermés, contacts propres. Une barrette peut être défectueuse sans que rien ne se voie.",
      bios: "Impossible : sans mémoire initialisée, le PC n'arrive pas jusqu'à l'UEFI. Il n'y a aucune image." },
    utile: ["led", "bips", "temoin"],
    indices: ["Ce sont des signaux que la carte envoie elle-même : regarde les LED et écoute les bips.", "Une LED « DRAM » allumée fixe désigne la mémoire. Reste à savoir si c'est la barrette ou son emplacement.", "Isoler : on remplace une pièce par une pièce témoin, une seule à la fois."],
    pourquoi: "Les LED de debug et les bips sont le premier outil : ils indiquent l'étape du POST où le démarrage s'arrête (CPU, DRAM, VGA, BOOT). Avec DRAM allumée, on isole : barrettes retirées puis remises une par une dans un emplacement connu bon, ou barrette témoin. Une panne mémoire intermittente se cherche aussi avec un outil de test (l'Outil Diagnostics de mémoire Windows, mdsched.exe, ou MemTest86) quand le PC démarre encore.",
    reel: "Le code des bips et la signification des LED dépendent du constructeur de la carte mère : on lit toujours le manuel de la carte (sa version PDF est sur le site du constructeur)."
  });

  panne("alim-hs", {
    niveau: "Débutant", base: "bureau", theme: "alim", cause: "alim", fix: "remplacer-alim", flag: "alim", ko: "Alimentation sous tension",
    titre: "Le PC ne s'allume plus du tout",
    ticket: "« Plus rien ne se passe quand j'appuie sur le bouton : aucune lumière, aucun bruit. Il y a eu un orage cette nuit. La prise murale fonctionne, j'y ai branché une lampe. »",
    contexte: "PC de bureau de quatre ans. Câble secteur branché, interrupteur à l'arrière sur I (vérifié par l'utilisateur).",
    symp: { code: "rien", titre: "Rien ne s'allume : l'alimentation ne délivre aucune tension", ventilos: "immobiles", ecran: "Écran noir, pas de signal", leds: "Aucune LED, pas même la LED de veille de la carte mère", debug: null, bips: null, theme: "alim",
      explication: ["Sans courant, aucun composant ne démarre : pas de LED, pas de ventilateur."],
      correction: ["Remplacer l'alimentation (jamais l'ouvrir : un bloc d'alimentation contient des niveaux de tension et d'énergie dangereux, et aucune pièce réparable)."] },
    temoin: "alim",
    obs: { visuel: "Câble secteur enfoncé, interrupteur sur I, 24 broches et EPS en place, aucune trace extérieure. Rien d'évident ne se voit.",
      alim: "Testeur : +12 V = 0 V, +5 V = 0 V, +3,3 V = 0 V, PWR_OK absent. Au test du trombone (PS_ON# relié à une masse), le ventilateur de l'alimentation ne démarre pas : elle est morte.",
      bios: "Impossible : le PC ne s'allume pas." },
    utile: ["alim", "temoin"],
    indices: ["Aucune LED, même pas celle de veille : le courant n'arrive même pas à la carte mère.", "Câble, prise, interrupteur : tout est vérifié. Reste la pièce qui fabrique les tensions.", "Mesure ses tensions avec un testeur, ou remplace-la par une alimentation témoin."],
    pourquoi: "On remonte la chaîne depuis la prise : prise murale, câble secteur, interrupteur de l'alimentation, alimentation, puis carte mère. Quand la LED de veille de la carte mère est éteinte, l'alimentation (ou son câble 24 broches) est la première suspecte. Un testeur donne la preuve : les tensions doivent rester dans les tolérances du guide Intel ATX 3 : +12 V de −7 % à +5 %, +5 V et +3,3 V à ±5 %.",
    reel: "Une alimentation ne se répare pas et ne s'ouvre pas : on la remplace en respectant la puissance et les connecteurs de l'ancienne."
  });

  panne("eps-oublie", {
    niveau: "Débutant", base: "bureau", theme: "cablage", cause: "eps", fix: "brancher-eps", retire: ["con-eps"],
    titre: "Un PC fraîchement monté qui ne démarre pas",
    ticket: "« Mon collègue a monté ce PC hier soir. On a appuyé sur le bouton : les ventilateurs partent une seconde et tout s'arrête. Il ne démarre jamais. »",
    contexte: "PC jamais démarré. Montage fait à la main, sans notice.",
    obs: { visuel: "Le connecteur EPS (4+4 broches) près du processeur est vide. Le câble EPS pend à côté de l'alimentation, non branché. Le 24 broches est bien en place." },
    utile: ["visuel", "led"],
    indices: ["Observe ce que disent les LED de debug.", "La LED « CPU » est allumée fixe : le problème est du côté du processeur.", "Qui alimente le processeur en 12 V ? Regarde si ce câble est branché."],
    pourquoi: "Le processeur est alimenté en 12 V par le câble EPS (4+4 ou 8 broches), pas par le 24 broches. Sans lui, la carte détecte un défaut côté CPU et ne démarre pas. C'est la panne de montage la plus fréquente : un coup d'œil dans le boîtier suffit à la voir.",
    reel: "Avant d'incriminer une pièce, on vérifie toujours les branchements : c'est gratuit et rapide."
  });

  panne("pate-oubliee", {
    niveau: "Intermédiaire", base: "bureau", theme: "refroidissement", cause: "pate", fix: "pate", retire: ["paste"],
    titre: "Le PC s'éteint tout seul après quelques minutes",
    ticket: "« Le PC neuf démarre, puis le ventilateur du processeur s'emballe, et au bout de quelques minutes tout s'éteint. »",
    contexte: "PC monté il y a deux jours à partir de pièces séparées. Le ventirad est bien vissé.",
    obs: { visuel: "Ventirad visible, vis serrées, ventilateur branché sur CPU_FAN, rien d'anormal. La pâte n'est pas visible sans démonter le ventirad.",
      ventirad: "Le dessus du processeur est sec et nu : aucune pâte thermique. La plaque du ventirad est propre, elle aussi sans pâte.",
      bios: "Accessible un instant : la température du processeur grimpe à plus de 90 °C en quelques secondes, ventilateur du ventirad à fond, puis le PC s'arrête." },
    utile: ["bios", "ventirad"],
    indices: ["Les ventilateurs tournent à fond : le PC essaie de refroidir quelque chose.", "Dans l'UEFI, regarde la température du processeur.", "Le ventirad est bien fixé : que se passe-t-il entre le processeur et lui ? Démonte-le pour voir."],
    pourquoi: "La pâte thermique assure un transfert de chaleur efficace entre le processeur et le ventirad (Intel). Sans elle, la chaleur ne passe pas, le processeur atteint sa température critique, ralentit puis la carte coupe le PC pour le protéger.",
    reel: "D'après Intel, une noisette de la taille d'un petit pois au centre du processeur suffit."
  });

  panne("ventirad-film", {
    niveau: "Intermédiaire", base: "bureau", theme: "refroidissement", cause: "ventirad", fix: "remonter-ventirad", flag: "ventirad", ko: "Refroidissement du processeur",
    titre: "Un PC neuf qui s'éteint en 20 secondes",
    ticket: "« J'ai monté mon PC moi-même. Il démarre, le ventilateur du processeur hurle, et il s'éteint au bout de vingt à trente secondes. »",
    contexte: "Pièces neuves. Le ventirad est livré avec sa pâte déjà appliquée. Il est visiblement posé et vissé.",
    symp: { code: "surchauffe", titre: "Le PC démarre puis s'éteint en quelques secondes : surchauffe", ventilos: "tournent à fond", ecran: "Image possible, puis extinction", leds: "Allumées puis extinction", debug: null, bips: "Éventuellement un bip d'alerte", theme: "refroidissement",
      explication: ["La chaleur du processeur ne passe pas dans le ventirad : le processeur monte vite en température, ralentit puis la carte coupe l'alimentation pour le protéger."],
      correction: ["Démonter le ventirad, retirer le film protecteur de sa plaque, vérifier la pâte et le remonter en serrant en croix."] },
    obs: { visuel: "Ventirad en place, vis serrées, ventilateur branché sur CPU_FAN. Rien d'anormal ne se voit de l'extérieur.",
      ventirad: "Un film plastique transparent protège encore la plaque du ventirad : il n'a pas été retiré. La pâte est restée sur le film, pas sur le processeur.",
      bios: "Accessible environ vingt secondes : la température du processeur dépasse 95 °C, ventilateur du ventirad à fond, puis arrêt de protection." },
    utile: ["bios", "ventirad"],
    indices: ["Le ventirad est bien vissé et le ventilateur tourne à fond. Pourtant le processeur chauffe : regarde la température dans l'UEFI.", "La chaleur doit passer du processeur vers le ventirad : qu'y a-t-il entre eux ?", "Démonte le ventirad et regarde sa plaque."],
    pourquoi: "Dans ce dossier, le ventirad neuf avait un film plastique sur sa plaque : il doit être retiré avant la pose. Resté en place, il isole thermiquement le ventirad du processeur. Même symptôme que « pas de pâte » : seule l'inspection de la plaque les distingue.",
    reel: "Lis la notice du ventirad : elle dit s'il y a un film à retirer, si la pâte est déjà posée et dans quel ordre serrer les vis."
  });

  panne("poussiere", {
    niveau: "Débutant", base: "bureau", theme: "refroidissement", cause: "poussiere", fix: "nettoyer", flag: "poussiere", ko: "Refroidissement du processeur",
    titre: "Le PC est bruyant et s'éteint pendant les visioconférences",
    ticket: "« Depuis quelques semaines, mon PC fait un bruit d'avion et il s'éteint quand je suis en visio ou que j'ouvre un gros fichier. Il a cinq ans. »",
    contexte: "PC posé par terre, près d'une moquette, jamais nettoyé. Il démarre normalement.",
    symp: { code: "surchauffe", titre: "Le PC démarre mais surchauffe dès qu'on le sollicite", ventilos: "tournent à fond, très bruyants", ecran: "Image normale, puis extinction brutale en charge", leds: "Normales", debug: null, bips: null, theme: "refroidissement",
      explication: ["La poussière bouche la grille avant et les ailettes du ventirad : l'air ne circule plus, la chaleur s'accumule. Au repos ça tient, en charge le processeur surchauffe et la carte coupe le PC."],
      correction: ["Nettoyer : grilles, ventirad et ventilateurs, PC éteint et débranché."] },
    obs: { visuel: "La grille avant et les ailettes du ventirad sont bouchées par un feutre de poussière ; les pales du ventilateur arrière en sont chargées.",
      ventirad: "La plaque du ventirad est propre, la pâte est en bon état. En revanche, les ailettes sont obstruées par la poussière.",
      bios: "Température du processeur élevée dès le repos et qui monte vite en charge, ventilateurs à pleine vitesse." },
    utile: ["visuel", "bios"],
    indices: ["Un PC qui ne chauffe qu'en charge, après des années : pense à l'usure, pas au montage.", "Regarde dans le boîtier, ouvert et hors tension.", "Qu'est-ce qui obstrue le passage de l'air ?"],
    pourquoi: "Un PC qui a travaillé des années au ras du sol accumule de la poussière sur les grilles et les ailettes : le débit d'air chute. Le symptôme apparaît d'abord en charge (visioconférence, gros calculs). Le nettoyage coûte moins cher que n'importe quelle pièce.",
    reel: "On nettoie PC éteint et débranché, à l'air comprimé, comme l'indique Dell, qui déconseille l'aspirateur et le souffleur (ils créent de l'électricité statique)."
  });

  panne("gpu-cable-oublie", {
    niveau: "Débutant", base: "gamer", theme: "cablage", cause: "gpu-cable", fix: "brancher-pcie", retire: ["con-gpu-pwr"],
    titre: "Une carte graphique neuve, mais pas d'image",
    ticket: "« Je viens d'installer ma nouvelle carte graphique. Le PC s'allume mais l'écran dit « pas de signal ». L'écran est branché sur la carte graphique. »",
    contexte: "Carte graphique ajoutée hier dans un PC qui marchait. Écran branché sur la carte graphique.",
    obs: { visuel: "La carte graphique est bien enfoncée dans le port PCIe, mais son connecteur d'alimentation PCIe (8 broches) est vide : le câble PCIe de l'alimentation est resté non branché." },
    utile: ["visuel", "led"],
    indices: ["Regarde la LED de debug : elle désigne la vidéo.", "Une carte graphique puissante a besoin de plus d'énergie que le port PCIe ne peut en fournir.", "Vérifie le connecteur d'alimentation de la carte."],
    pourquoi: "Le port PCIe x16 ne fournit qu'une partie de l'énergie (jusqu'à 75 W d'après la spécification PCI Express) : une carte plus gourmande a besoin d'un câble d'alimentation en plus. Sans lui, elle ne démarre pas, et la LED VGA reste allumée.",
    reel: "Le câble PCIe ressemble au câble EPS du processeur : on ne force jamais un connecteur, le détrompeur est là pour éviter l'erreur."
  });

  panne("gpu-hs", {
    niveau: "Intermédiaire", base: "gamer", theme: "video", cause: "gpu", fix: "remplacer-gpu", flag: "gpu", ko: "Sortie vidéo",
    titre: "PC de jeu : tout s'allume, mais l'écran reste noir",
    ticket: "« Mon PC de jeu s'allume, les ventilateurs tournent, mais l'écran est noir. Avant, j'avais parfois des lignes bizarres à l'image. »",
    contexte: "PC de jeu de quatre ans, carte graphique dédiée. Écran branché sur la carte graphique, câble testé sur un autre PC.",
    symp: { code: "sans-image", titre: "Les ventilateurs tournent, mais pas d'image", ventilos: "tournent (ceux de la carte graphique aussi)", ecran: "Pas de signal", leds: "LED de debug « VGA » allumée fixe", debug: "VGA", bips: null, theme: "video",
      explication: ["La carte graphique ne produit plus d'image : le démarrage atteint l'étape vidéo et y reste."],
      correction: ["Remplacer la carte graphique."] },
    temoin: "gpu",
    obs: { visuel: "Carte graphique enfoncée, câble PCIe branché, ventilateurs de la carte en rotation, câble d'écran bien enfiché. Rien d'anormal à l'œil nu.",
      bios: "Impossible : l'écran ne reçoit aucune image, même pour l'UEFI." },
    utile: ["led", "temoin"],
    indices: ["Le câble d'écran fonctionne ailleurs : il ne s'agit pas du câble. Observe les LED.", "La LED « VGA » désigne l'étape vidéo.", "Câbles et branchements sont corrects : essaie une carte graphique témoin."],
    pourquoi: "Câble d'écran, écran, câble d'alimentation de la carte et enfichage sont vérifiés : reste la carte elle-même. La LED VGA va dans le même sens, et une carte témoin le confirme.",
    reel: "Autre test, si le processeur a un graphique intégré : retirer la carte graphique et brancher l'écran sur la sortie de la carte mère. Si l'image revient, la carte graphique est en cause."
  });

  panne("sata-donnees", {
    niveau: "Débutant", base: "sata", theme: "stockage", cause: "sata", fix: "brancher-sata", retire: ["sata-data"],
    titre: "« Aucun périphérique de démarrage » après un changement de SSD",
    ticket: "« Après le remplacement du SSD par un technicien, le PC affiche « aucun périphérique de démarrage ». Il s'allume pourtant très bien. »",
    contexte: "PC de bureau avec un SSD SATA 2,5″ neuf, système réinstallé la veille.",
    obs: { visuel: "Le SSD SATA est bien fixé dans son support et son câble d'alimentation SATA est branché, mais le câble de données SATA n'est relié à aucune extrémité : il pend dans le boîtier.",
      bios: "L'UEFI est accessible : la liste des disques est vide, aucun disque n'est détecté." },
    utile: ["bios", "visuel"],
    indices: ["Le PC démarre : ce n'est pas une panne d'alimentation ni de mémoire. Regarde dans l'UEFI si le disque apparaît.", "Un SSD SATA demande deux câbles.", "Vérifie les deux câbles du SSD : données et alimentation."],
    pourquoi: "Un SSD SATA demande deux câbles : l'alimentation (de l'alimentation du PC) et les données (vers un port SATA de la carte mère). Il suffit qu'un seul manque pour que le disque soit invisible dans l'UEFI. Un SSD M.2 NVMe, lui, n'a pas de câble.",
    reel: "Quand « aucun périphérique de démarrage » apparaît, la première question est : le disque est-il visible dans l'UEFI ? Non → matériel ou câblage ; oui → ordre de démarrage ou système."
  });

  panne("ssd-hs", {
    niveau: "Intermédiaire", base: "bureau", theme: "stockage", cause: "ssd", fix: "remplacer-ssd", flag: "ssd", ko: "Stockage détecté",
    titre: "Écran bleu, puis « aucun périphérique de démarrage »",
    ticket: "« Hier, un écran bleu puis le PC a redémarré en boucle. Aujourd'hui, il affiche « aucun périphérique de démarrage ». »",
    contexte: "PC de bureau de trois ans avec un SSD M.2 NVMe. Aucune modification récente.",
    symp: { code: "pas-disque", titre: "L'UEFI s'affiche, mais aucun disque de démarrage", ventilos: "tournent", ecran: "UEFI : « aucun périphérique de démarrage »", leds: "Normales", debug: null, bips: null, theme: "stockage",
      explication: ["Le POST se déroule normalement (alimentation, processeur, mémoire, vidéo), mais le SSD n'est plus détecté : il n'y a rien sur quoi démarrer."],
      correction: ["Remplacer le SSD (puis réinstaller ou restaurer le système depuis une sauvegarde)."] },
    temoin: "ssd",
    obs: { visuel: "Le SSD M.2 est en place, la vis de fixation aussi, aucune trace visible.",
      bios: "L'UEFI s'affiche, mais la section stockage est vide, même après avoir réenfoncé le SSD et réinitialisé les réglages." },
    utile: ["bios", "temoin"],
    indices: ["Le PC démarre jusqu'à un message de disque : le reste du matériel va bien.", "Dans l'UEFI, le disque apparaît-il ? Même après l'avoir réenfoncé ?", "Un SSD témoin dira si c'est le SSD ou son connecteur."],
    pourquoi: "Un SSD qui disparaît de l'UEFI après avoir été réenfoncé est en défaut matériel (contrôleur ou mémoire flash). L'historique (écran bleu, redémarrages en boucle) va dans ce sens. Un témoin confirme que le connecteur M.2 est sain.",
    reel: "Avant de remplacer, on demande si les données sont sauvegardées : si elles sont importantes, on ne fait aucune écriture sur le disque et on suit la procédure de récupération du service."
  });

  panne("pile-cmos", {
    niveau: "Débutant", base: "bureau", theme: "cmos", cause: "cmos", fix: "remplacer-pile", flag: "cmos",
    titre: "Heure fausse et message avant Windows à chaque démarrage",
    ticket: "« À chaque démarrage, un message demande d'appuyer sur F1, et l'heure de Windows est fausse. Mes réglages du BIOS disparaissent quand je débranche le PC. »",
    contexte: "PC de bureau de huit ans, jamais ouvert, qui reste débranché le week-end.",
    symp: { code: "avert", titre: "Le PC démarre avec un avertissement : réglages perdus (pile CMOS)", ventilos: "tournent", ecran: "Message d'avertissement (par exemple « CMOS checksum error », le texte dépend du BIOS), F1 pour continuer", leds: "Normales", debug: null, bips: null, theme: "cmos",
      explication: ["Le PC démarre, mais la mémoire CMOS (réglages du BIOS, date et heure) n'est plus alimentée quand le PC est débranché : la pile de la carte mère est usée."],
      correction: ["Remplacer la pile CMOS (modèle CR2032 sur la plupart des cartes), puis refaire les réglages et la date."],
      etapesPlus: [{ nom: "Réglages mémorisés (pile CMOS)", etat: "avert" }] },
    temoin: "pile",
    obs: { visuel: "Une pile ronde CR2032 est en place sur la carte mère, sans fuite visible. Elle a plus de trois ans ; d'après Dell, une pile CMOS dure en général deux à trois ans.",
      bios: "L'UEFI affiche une date par défaut et des réglages d'usine rechargés,  avec un message d'avertissement sur les réglages." },
    utile: ["visuel", "bios"],
    indices: ["Le PC démarre : le matériel principal va bien. Qu'est-ce qui est mémorisé quand le PC est débranché ?", "Date, heure et réglages du BIOS sont mémorisés par une petite pile de la carte mère.", "Mesure sa tension ou essaie une pile neuve."],
    pourquoi: "La pile CMOS (souvent une CR2032) alimente l'horloge et la mémoire des réglages de la carte quand le PC est débranché. Elle dure plusieurs années. Usée, la carte oublie la date et ses réglages à chaque extinction : d'où l'heure fausse et le message au démarrage. Dans un domaine, l'heure fausse peut aussi gêner l'authentification (Kerberos tolère un écart limité) : à vérifier sur place.",
    reel: "On remplace la pile PC éteint et débranché ; on note les réglages éventuels du BIOS (ordre de démarrage, mode de stockage) avant, car ils seront perdus."
  });

  panne("bios-ancien", {
    niveau: "Avancé", base: "bureau", theme: "cmos", cause: "bios", fix: "maj-bios", flag: "bios", ko: "Processeur détecté",
    titre: "Carte mère du stock : tout s'allume, aucune image",
    ticket: "« On a monté un PC avec une carte du stock. Ventilateurs et LED s'allument, mais aucune image, jamais. Les pièces sont neuves. »",
    contexte: "Carte mère du stock, livrée avec un BIOS ancien. Dans l'exercice, le processeur monté est plus récent que ce BIOS (voir la liste de compatibilité du constructeur de la carte).",
    symp: { code: "debug", titre: "Les ventilateurs tournent mais pas d'image : processeur non reconnu", ventilos: "tournent", ecran: "Pas de signal", leds: "LED de debug « CPU » allumée fixe", debug: "CPU", bips: null, theme: "cmos",
      explication: ["Le BIOS de la carte ne contient pas encore le support de ce processeur : la carte ne sait pas l'initialiser et reste bloquée à l'étape CPU, sans afficher d'image."],
      correction: ["Mettre à jour le BIOS (fonction USB BIOS Flashback sans processeur si la carte l'a, ou avec un processeur plus ancien compatible)."] },
    temoinTxt: { cpu: "Avec un processeur plus ancien, compatible avec ce BIOS, le PC démarre. Ce n'est donc pas le processeur d'origine qui est en panne : c'est la carte qui ne le reconnaît pas encore." },
    obs: { visuel: "Processeur bien posé, ventirad en place, EPS branché. L'étiquette de la carte indique une version de BIOS ancienne ; d'après la documentation du constructeur, ce processeur demande une version plus récente.",
      bios: "Impossible : le PC ne produit aucune image." },
    utile: ["led", "visuel"],
    indices: ["Les LED désignent le processeur, et pourtant il est bien posé et alimenté.", "Pièces neuves, montage correct : cherche du côté de la compatibilité logicielle.", "La carte vient du stock : quelle est la version de son BIOS ? Que dit la liste de compatibilité du constructeur ?"],
    pourquoi: "Chaque version de BIOS prend en charge une liste de processeurs. Une carte restée en stock peut avoir un BIOS antérieur à la sortie du processeur monté : elle ne le reconnaît pas. Pour prendre en charge les processeurs récents, une carte a souvent besoin d'une mise à jour du BIOS (ASRock) ; la documentation de la carte indique les processeurs pris en charge. Les symptômes ressemblent à ceux d'un processeur mort.",
    reel: "On ne coupe jamais le courant pendant une mise à jour de BIOS : elle peut rendre la carte inutilisable. On utilise uniquement le fichier officiel du constructeur."
  });

  panne("entretoise", {
    niveau: "Avancé", base: "bureau", theme: "ordre", cause: "entretoise", fix: "refaire-entretoises", flag: "entretoise", ko: "Carte mère alimentée (24 broches)",
    titre: "Un claquement, puis plus rien : un PC tout juste monté",
    ticket: "« On a monté le PC et on a appuyé sur le bouton. Un petit claquement, puis plus rien : aucune LED, aucun ventilateur. »",
    contexte: "Montage de la veille, dans un boîtier livré avec des entretoises déjà vissées sur le plateau.",
    symp: { code: "rien", titre: "Rien ne s'allume : court-circuit sous la carte mère", ventilos: "immobiles", ecran: "Écran noir, pas de signal", leds: "Aucune LED, l'alimentation se met en protection", debug: null, bips: null, theme: "ordre",
      explication: ["Une entretoise placée sous la carte, en face d'aucun trou, touche les soudures de la face arrière : court-circuit. L'alimentation le détecte et se met en protection."],
      correction: ["Retirer la carte, ne garder que les entretoises en face de ses trous, la reposer et la revisser."] },
    obs: { visuel: "Vu de côté, une entretoise déjà vissée sur le plateau se trouve sous la carte à un endroit où elle n'a pas de trou : elle touche le circuit imprimé.",
      alim: "Testeur : tensions correctes à vide, PWR_OK présent : l'alimentation est saine quand elle n'est pas raccordée à la carte. Le défaut vient d'ailleurs." },
    utile: ["alim", "visuel"],
    indices: ["Un claquement, puis plus rien : une protection a coupé. L'alimentation est-elle en cause ? Teste-la.", "L'alimentation est saine : le court-circuit vient de ce qu'elle alimente. Regarde sous la carte mère.", "Compare la position de chaque entretoise avec les trous de la carte."],
    pourquoi: "Les entretoises tiennent la carte à distance du plateau, uniquement en face de ses trous de fixation (leur nombre dépend du format et de la carte). Une entretoise sans trou en face touche la carte, et peut provoquer un court-circuit : l'alimentation se met en protection. Tester l'alimentation seule permet de l'écarter.",
    reel: "Méthode éprouvée : monter la carte hors boîtier sur son carton, avec processeur, mémoire et vidéo. Si elle démarre, le défaut vient du montage dans le boîtier."
  });

  panne("facade-nappe", {
    niveau: "Débutant", base: "bureau", theme: "cablage", cause: "facade", fix: "brancher-facade", retire: ["con-fpanel"],
    titre: "Le bouton marche ne fait rien",
    ticket: "« Le PC est monté mais quand j'appuie sur le bouton marche, il ne se passe rien. Pourtant une petite LED est allumée sur la carte mère. »",
    contexte: "PC monté ce matin. L'alimentation est branchée, interrupteur sur I.",
    obs: { visuel: "La nappe de façade (PWR_SW, RESET_SW, LED) n'est pas branchée sur les broches F_PANEL de la carte : elle pend dans le boîtier." },
    utile: ["led", "visuel"],
    indices: ["Une LED de la carte est allumée : elle est alimentée. L'alimentation va donc bien.", "Le bouton marche de la façade doit être relié à la carte : par quoi ?", "Regarde les broches F_PANEL, en bas de la carte."],
    pourquoi: "Le bouton marche n'est qu'un interrupteur qui ferme deux broches (PWR_SW) de F_PANEL. Si la nappe n'est pas branchée, la carte ne reçoit jamais l'ordre de démarrer : la LED de veille s'allume (la carte est alimentée) mais rien ne se passe.",
    reel: "Le manuel de la carte donne le brochage de F_PANEL (PWR_SW, LED, HDD) : c'est lui qu'on suit pour rebrancher la nappe."
  });

  /* ---------- Évaluation ---------- */
  A.pannesEval = { id: "pannes-eval", unite: "atelier-pannes-eval", titre: "Évaluation : pannes", seuil: 75, n: 5 };
  A.pannesUnite = "atelier-pannes";

  /* ---------- Thèmes « à revoir » propres aux pannes ---------- */
  A.revoir = A.revoir || {};
  A.revoir.methode = { titre: "Méthode de diagnostic", conseil: "Observer d'abord (symptômes, LED, bips), faire une hypothèse, changer une seule chose à la fois, tester avec une pièce témoin, puis vérifier que la panne a disparu. Ne conclure à la carte mère ou au processeur qu'après avoir écarté tout le reste.", lien: "../stage/j8.html#methode", libelle: "Prépa, jour 8 : la méthode de diagnostic" };
  A.revoir.securite = { titre: "Sécurité avant d'ouvrir un PC", conseil: "PC éteint, interrupteur de l'alimentation sur O et câble secteur débranché, électricité statique déchargée (partie métallique du boîtier ou bracelet antistatique), composants tenus par les bords. On n'ouvre jamais une alimentation.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" };
  A.revoir.cmos = { titre: "BIOS/UEFI : pile, version, compatibilité", conseil: "La pile CMOS (CR2032) mémorise date, heure et réglages. Une carte peut avoir un BIOS trop ancien pour un processeur récent : le constructeur publie la liste de compatibilité. Une mise à jour de BIOS ne se coupe jamais en cours.", lien: "../stage/j9.html#demarrage", libelle: "Prépa, jour 9 : BIOS/UEFI" };
  A.revoir.methode.module = A.moduleRevoir.methode;
  A.revoir.securite.module = A.moduleRevoir.demarrage;
  A.revoir.cmos.module = { href: "../modules/materiel-pc.html#compatibilite", libelle: "Module « Matériel et PC » : compatibilité et version du BIOS" };
})();
