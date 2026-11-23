/* Atelier hardware — scénarios du lot 5, évaluation finale et thèmes « à revoir ».
   Les étapes sont bâties à partir de celles du scénario 1 (assets/atelier-data.js), avec des remplacements par scénario.
   Chaque inventaire mélange de bonnes pièces et de mauvais choix : c'est voulu. */
(function () {
  "use strict";
  var A = window.IT_ATELIER;
  var base = A.scenarios["bureautique-intel"];
  var S = A.scenarios;

  /* ---------- Étapes : base + remplacements ---------- */
  var E = {};
  base.etapes.forEach(function (e) { E[e.id] = e; });
  var NEW = {
    gpu: {
      id: "gpu", titre: "Installer la carte graphique", slots: ["gpu", "con-gpu-pwr"], vue: "zoom",
      texte: "Enfonce la carte graphique dans le port PCIe x16, puis branche son câble d'alimentation PCIe 6+2.",
      indices: ["Le câble PCIe ressemble au câble EPS : ne les confonds pas, et ne force jamais.", "La carte graphique reçoit de l'énergie par le port PCIe et par un câble d'alimentation."],
      pourquoi: "Le port PCIe x16 fournit une partie de l'énergie (jusqu'à 75 W d'après la spécification PCI Express) ; une carte plus gourmande a besoin d'un câble d'alimentation en plus. Le câble PCIe n'est pas câblé comme l'EPS du processeur : le détrompeur est là pour éviter l'erreur.",
      solution: [["gpu", "gpu-8pin"], ["con-gpu-pwr", "cab-pcie"]]
    }
  };
  function suite(ids, over) {
    return ids.map(function (id) {
      var e = JSON.parse(JSON.stringify(E[id] || NEW[id]));
      var o = over && over[id];
      if (o) Object.keys(o).forEach(function (k) { e[k] = o[k]; });
      return e;
    });
  }
  var BASE_IDS = ["entretoises", "ioshield", "alim", "ventilateurs", "carte", "cpu", "pate", "ventirad", "ram", "stockage", "alim-cartes", "ventilos-cables", "facade", "branchements", "demarrage"];
  function avecGpu(ids) { var c = ids.slice(); c.splice(c.indexOf("alim-cartes") + 1, 0, "gpu"); return c; }
  var CABLES = ["cab-atx24", "cab-eps", "cab-pcie", "cab-sata-data", "cab-sata-pwr", "cab-fan-cpu", "cab-fan-rear", "cab-fan-front", "cab-facade", "cab-usb3", "cab-audio", "cab-secteur", "cab-hdmi"];
  var CABLES_ITX = CABLES.filter(function (c) { return c !== "cab-fan-front"; });
  var POURQUOI_ALIM_GPU = "On choisit l'alimentation selon la consommation maximale (processeur en turbo + carte graphique + environ 75 W pour le reste), son format et ses connecteurs (24 broches, EPS, PCIe). Une règle pratique courante consiste à garder environ 25 % de marge ; ce n'est pas une norme, mais une alimentation qui travaille à sa limite chauffe, vieillit mal et ne permet aucune évolution.";
  var SOLUTION_CABLES_FIXES = [["con-atx24", "cab-atx24"], ["con-eps", "cab-eps"]];

  /* ---------- Scénario 2 : poste de salle informatique ---------- */
  S["salle-info"] = {
    id: "salle-info", unite: "atelier-s2", titre: "PC de salle informatique", niveau: "Intermédiaire", duree: "≈ 30 min", mode: "apprentissage",
    disposition: "tour-matx",
    boitier: { nom: "Tour micro-ATX", formats: ["mATX", "ITX"], alim: ["ATX"], lGpu: 400, hVentirad: 165 },
    exige: { igpu: true, sansGpu: true },
    brief: {
      client: "Une salle de travaux pratiques compte vingt postes identiques. Tu prépares le poste modèle : Windows 11, bureautique et logiciels de cours, pas de calcul lourd.",
      besoin: [
        "16 Go de mémoire au minimum, en double canal",
        "SSD SATA d'au moins 256 Go : le stock en contient déjà, on ne commande pas de SSD M.2",
        "Pas de carte graphique dédiée : le graphique du processeur suffit",
        "Ports USB et audio de la façade utilisables (casques en TP)",
        "Flux d'air de l'avant vers l'arrière",
        "Alimentation avec environ 25 % de marge"
      ],
      materiel: "Boîtier tour micro-ATX et un bac de pièces de stock : plusieurs sont inadaptées (mauvais format, mauvais socket, disque mécanique…). Lis les fiches avant de choisir.",
      source: "Windows 11 exige notamment un démarrage UEFI avec Secure Boot et un TPM 2.0 (Microsoft Learn, « Configuration requise pour Windows 11 »). Théorie des salles informatiques : jour 9 de la prépa.",
      umons: "La façon dont les salles sont préparées (image système, outil de déploiement, standardisation du matériel) n'est pas décrite ici : à vérifier sur place avec ton tuteur."
    },
    criteres: [{ t: "ram", min: 16 }, { t: "canal" }, { t: "ssd", min: 256, type: "ssd-sata" }, { t: "gpu", val: false }, { t: "facade" }, { t: "air" }, { t: "marge" }],
    inventaire: ["entretoises-matx", "entretoises-atx", "cache-io", "pate-thermique", "psu-450", "psu-300", "psu-sfx-450", "fan-120-a", "fan-120-b",
      "mb-b660-matx", "mb-z790-atx", "cpu-12100", "cpu-12100f", "cpu-12400", "cpu-r5-7600", "cooler-tower", "cooler-boxed", "cooler-am5",
      "ram-ddr4-a", "ram-ddr4-b", "ram-ddr5-a", "ssd-sata", "hdd-sata"].concat(CABLES),
    etapes: suite(BASE_IDS, {
      entretoises: { texte: "Le plateau est en métal. Plusieurs kits sont dans le bac : choisis celui qui correspond au format de la carte (le boîtier est un micro-ATX).",
        indices: ["Onglet « Accessoires ». Le kit doit correspondre au format de la carte.", "Une carte ATX ne rentre pas dans une tour micro-ATX : prends le kit micro-ATX."] },
      alim: { texte: "Installe une alimentation de format ATX (le boîtier est une tour ATX), avec de la marge sur la consommation du poste.",
        indices: ["Le format SFX est celui des petits boîtiers : il ne convient pas à une tour ATX.", "Sans carte graphique, 300 W suffiraient ; 450 W laissent plus de marge."],
        solution: [["psu", "psu-450"]] },
      carte: { texte: "Choisis la carte mère compatible avec le boîtier (format), puis avec le processeur et la mémoire prévus.",
        indices: ["Le boîtier est un micro-ATX : une carte ATX est trop grande.", "Une carte DDR5 n'accepte pas la mémoire DDR4 du stock."] },
      cpu: { texte: "Installe un processeur compatible avec le socket de la carte et doté d'un graphique intégré. Pour des postes de TP, quatre cœurs suffisent.",
        indices: ["Le suffixe F signifie « sans graphique intégré ».", "Le Ryzen du bac est un processeur AMD : il se pose sur un autre socket."],
        solution: [["cpu", "cpu-12100"]] },
      ventirad: { texte: "Pose un ventirad compatible avec le socket LGA 1700 : plusieurs modèles du bac peuvent convenir, mais pas tous.",
        indices: ["Un ventirad AMD ne se fixe pas sur un socket Intel."] },
      stockage: { texte: "Le stock contient des SSD SATA 2,5″ à réutiliser : installe-en un avec ses deux câbles (données et alimentation). Un disque dur ne répond pas au cahier des charges.",
        indices: ["Support de disque 2,5″, puis câble de données et câble d'alimentation SATA.", "Un disque dur mécanique n'est pas un SSD : lis les caractéristiques."],
        pourquoi: "Un SSD SATA se fixe dans son support et demande deux câbles : données (vers la carte mère) et alimentation (vers l'alimentation). Sur un poste de salle, un SSD démarre le système et ouvre les logiciels bien plus vite qu'un disque dur, et il résiste mieux aux chocs.",
        solution: [["bay-ssd", "ssd-sata"], ["sata-data", "cab-sata-data"], ["sata-pwr", "cab-sata-pwr"]] }
    })
  };

  /* ---------- Scénario 3 : gamer AMD ---------- */
  S["gamer-amd"] = {
    id: "gamer-amd", unite: "atelier-s3", titre: "PC gamer AMD", niveau: "Intermédiaire", duree: "≈ 40 min", mode: "apprentissage",
    disposition: "tour-atx",
    boitier: { nom: "Tour ATX", formats: ["ATX", "mATX", "ITX"], alim: ["ATX"], lGpu: 400, hVentirad: 165 },
    exige: {},
    brief: {
      client: "Un lycéen veut un PC pour jouer en 1080p et monter des vidéos. Il tient à un processeur AMD, avec de quoi évoluer.",
      besoin: [
        "Processeur AMD",
        "32 Go de mémoire DDR5, en double canal",
        "SSD M.2 NVMe d'au moins 1 To",
        "Carte graphique dédiée, alimentée, avec l'écran branché dessus",
        "Alimentation avec environ 25 % de marge",
        "Ports USB et audio de la façade ; flux d'air avant → arrière"
      ],
      materiel: "Tour ATX et un bac de pièces mélangées : processeurs AMD de deux générations, cartes Intel et AMD, mémoire DDR4 et DDR5, plusieurs alimentations."
    },
    criteres: [{ t: "amd" }, { t: "ram", min: 32 }, { t: "canal" }, { t: "ssd", min: 1000, type: "ssd-m2" }, { t: "gpu", val: true }, { t: "marge" }, { t: "facade" }, { t: "air" }],
    inventaire: ["entretoises-atx", "entretoises-matx", "entretoises-itx", "cache-io", "pate-thermique", "psu-300", "psu-450", "psu-650", "fan-120-a", "fan-120-b",
      "mb-b650-atx", "mb-z790-atx", "mb-b660-matx", "cpu-r5-7600", "cpu-r5-5600", "cpu-12400", "cooler-am5", "cooler-tower",
      "ram-ddr5-a", "ram-ddr5-b", "ram-ddr5-32", "ram-ddr4-a", "ram-ddr4-b", "ssd-nvme-1to", "ssd-nvme", "gpu-8pin"].concat(CABLES),
    etapes: suite(avecGpu(BASE_IDS), {
      entretoises: { texte: "Choisis le kit d'entretoises qui correspond à la carte ATX : elle a plus de trous qu'une carte micro-ATX.",
        indices: ["Une carte ATX a neuf trous de fixation : prends le kit ATX."], solution: [["standoffs", "entretoises-atx"]] },
      alim: { texte: "Choisis l'alimentation : ce PC aura une carte graphique dédiée. Vérifie les connecteurs PCIe et fais une estimation de consommation.",
        indices: ["L'alimentation de 300 W n'a pas de connecteur PCIe.", "Consommation maximale : processeur + carte graphique + environ 75 W. Garde environ 25 % de marge."],
        pourquoi: POURQUOI_ALIM_GPU, solution: [["psu", "psu-650"]] },
      carte: { texte: "Choisis la carte mère : processeur AMD récent (socket AM5), mémoire DDR5, format ATX.",
        indices: ["Les Ryzen de série 7000 se posent sur un socket AM5.", "La carte Z790 est conçue pour des processeurs Intel."], solution: [["board", "mb-b650-atx"]] },
      cpu: { texte: "Installe le processeur AMD compatible avec le socket de la carte.",
        indices: ["Le Ryzen 5 5600 est un processeur AM4 : un autre socket."], solution: [["cpu", "cpu-r5-7600"]] },
      ventirad: { texte: "Pose le ventirad qui se fixe sur le socket AM5.",
        indices: ["Le ventirad Intel du bac est prévu pour LGA 1700."], solution: [["cooler", "cooler-am5"]] },
      ram: { texte: "Installe deux barrettes DDR5 de 16 Go en A2 et B2 : 32 Go en double canal.",
        indices: ["Une seule barrette de 32 Go donnerait la capacité mais pas le double canal.", "La DDR4 n'a pas la même encoche que la DDR5."],
        solution: [["dimm-a2", "ram-ddr5-a"], ["dimm-b2", "ram-ddr5-b"]] },
      stockage: { texte: "Installe le SSD M.2 NVMe qui répond au cahier des charges (1 To).",
        indices: ["Le SSD de 500 Go est trop petit : lis la capacité sur la fiche."], solution: [["m2-1", "ssd-nvme-1to"]] },
      branchements: { slots: ["mains", "mon-gpu"], texte: "Dans la vue « Arrière » : branche le câble secteur et le câble vidéo sur la carte graphique, puis mets l'interrupteur de l'alimentation sur I.",
        indices: ["Avec une carte graphique dédiée, l'écran se branche sur la carte graphique, pas sur la carte mère."],
        solution: [["mains", "cab-secteur"], ["mon-gpu", "cab-hdmi"]] }
    })
  };

  /* ---------- Scénario 4 : station de travail ---------- */
  S["station"] = {
    id: "station", unite: "atelier-s4", titre: "Station de travail", niveau: "Avancé", duree: "≈ 45 min", mode: "apprentissage",
    disposition: "tour-atx",
    boitier: { nom: "Tour ATX", formats: ["ATX", "mATX", "ITX"], alim: ["ATX"], lGpu: 400, hVentirad: 165 },
    exige: {},
    brief: {
      client: "Un bureau d'études commande une station de travail pour de la modélisation 3D et du calcul : beaucoup de cœurs, beaucoup de mémoire, deux disques.",
      besoin: [
        "Processeur d'au moins 16 cœurs",
        "64 Go de mémoire DDR5, en double canal",
        "Deux disques : un SSD M.2 NVMe pour le système et un SSD SATA pour les données",
        "Carte graphique dédiée, alimentée, avec l'écran branché dessus",
        "Alimentation avec environ 25 % de marge ; refroidissement à la hauteur du processeur",
        "Ports USB et audio de la façade ; flux d'air avant → arrière"
      ],
      materiel: "Tour ATX et un bac fourni : processeurs de 4 à 16 cœurs, plusieurs ventirads et alimentations, mémoire DDR4 et DDR5. Le processeur le plus puissant est aussi celui qui chauffe et consomme le plus."
    },
    criteres: [{ t: "coeurs", min: 16 }, { t: "ram", min: 64 }, { t: "canal" }, { t: "disques", min: 2 }, { t: "gpu", val: true }, { t: "marge" }, { t: "facade" }, { t: "air" }],
    inventaire: ["entretoises-atx", "entretoises-matx", "cache-io", "pate-thermique", "psu-300", "psu-450", "psu-650", "fan-120-a", "fan-120-b",
      "mb-z790-atx", "mb-b660-matx", "mb-b650-atx", "cpu-12900k", "cpu-12700", "cpu-12400", "cpu-r5-7600", "cooler-tower", "cooler-boxed", "cooler-lp",
      "ram-ddr5-a", "ram-ddr5-b", "ram-ddr5-c", "ram-ddr5-d", "ram-ddr4-a", "ram-ddr4-b", "ssd-nvme-1to", "ssd-nvme", "ssd-sata", "hdd-sata", "gpu-8pin"].concat(CABLES),
    etapes: suite(avecGpu(BASE_IDS), {
      entretoises: { texte: "Choisis le kit d'entretoises qui correspond à la carte ATX.", indices: ["Une carte ATX a neuf trous de fixation : prends le kit ATX."], solution: [["standoffs", "entretoises-atx"]] },
      alim: { texte: "Choisis l'alimentation : estime la consommation maximale de la machine, avec le processeur en turbo.",
        indices: ["Le processeur le plus puissant peut atteindre 241 W en turbo. Avec la carte graphique (environ 160 W) et environ 75 W pour le reste : environ 476 W.", "Une alimentation de 450 W serait donc sous la consommation maximale."],
        pourquoi: POURQUOI_ALIM_GPU, solution: [["psu", "psu-650"]] },
      carte: { texte: "Choisis la carte mère : processeur Intel LGA 1700, mémoire DDR5 avec quatre emplacements, format ATX.",
        indices: ["Il faut accueillir quatre barrettes DDR5 : la carte DDR4 ne convient pas.", "La carte AM5 est pour des processeurs AMD."], solution: [["board", "mb-z790-atx"]] },
      cpu: { texte: "Installe le processeur qui répond au cahier des charges : 16 cœurs au minimum.",
        indices: ["Compte les cœurs sur les fiches : un seul modèle du bac atteint 16.", "Le graphique intégré existe mais le client veut une carte dédiée."], solution: [["cpu", "cpu-12900k"]] },
      ventirad: { texte: "Choisis un ventirad compatible LGA 1700, assez bas pour passer sous le panneau, et capable d'évacuer la chaleur du processeur.",
        indices: ["Compare la capacité de dissipation du ventirad à la puissance de base du processeur (125 W).", "Le ventirad d'entrée de gamme et le low-profile sont prévus pour des processeurs de 65 W."],
        pourquoi: "Un ventirad se choisit sur trois critères : la fixation (socket), la hauteur disponible sous le panneau et la capacité de dissipation, qui doit dépasser la puissance du processeur. Sous-dimensionné, il laisse la température monter : le processeur ralentit, puis la carte coupe l'alimentation.",
        solution: [["cooler", "cooler-tower"]] },
      ram: { slots: ["dimm-a1", "dimm-a2", "dimm-b1", "dimm-b2"], texte: "Installe quatre barrettes DDR5 de 16 Go : 64 Go, deux par canal.",
        indices: ["Avec quatre barrettes, tous les emplacements sont utilisés : deux par canal, donc le double canal."],
        solution: [["dimm-a2", "ram-ddr5-a"], ["dimm-b2", "ram-ddr5-b"], ["dimm-a1", "ram-ddr5-c"], ["dimm-b1", "ram-ddr5-d"]] },
      stockage: { slots: ["m2-1", "bay-ssd", "sata-data", "sata-pwr"], fn: null, texte: "Installe deux disques : un SSD M.2 NVMe pour le système et un SSD SATA pour les données, avec ses deux câbles.",
        indices: ["Le disque dur mécanique n'est pas un SSD : le cahier des charges demande un SSD SATA.", "Le SSD SATA demande un câble de données ET un câble d'alimentation."],
        solution: [["m2-1", "ssd-nvme-1to"], ["bay-ssd", "ssd-sata"], ["sata-data", "cab-sata-data"], ["sata-pwr", "cab-sata-pwr"]] },
      branchements: { slots: ["mains", "mon-gpu"], texte: "Dans la vue « Arrière » : branche le câble secteur et le câble vidéo sur la carte graphique, puis mets l'interrupteur de l'alimentation sur I.",
        indices: ["Avec une carte graphique dédiée, l'écran se branche sur la carte graphique."], solution: [["mains", "cab-secteur"], ["mon-gpu", "cab-hdmi"]] }
    })
  };

  /* ---------- Scénario 5 : mini-ITX ---------- */
  S["mini-itx"] = {
    id: "mini-itx", unite: "atelier-s5", titre: "PC mini-ITX", niveau: "Avancé", duree: "≈ 35 min", mode: "apprentissage",
    disposition: "compact-itx",
    boitier: { nom: "Boîtier compact mini-ITX", formats: ["ITX"], alim: ["SFX"], lGpu: 170, hVentirad: 70 },
    exige: { igpu: true, sansGpu: true },
    brief: {
      client: "Un point d'accueil veut un PC discret et peu encombrant. Le boîtier est un petit modèle mini-ITX : pas de carte graphique, peu de place, un seul ventilateur d'extraction.",
      besoin: [
        "16 Go de mémoire DDR4 au minimum, en double canal",
        "SSD M.2 NVMe d'au moins 256 Go (pas de câble dans ce petit boîtier)",
        "Pas de carte graphique dédiée",
        "Ports USB et audio de la façade branchés",
        "Ventilateur d'extraction arrière posé et branché",
        "Alimentation avec environ 25 % de marge"
      ],
      materiel: "Boîtier compact : plateau mini-ITX, alimentation SFX uniquement, ventirad de 70 mm de hauteur au plus, carte graphique courte seulement. Beaucoup de pièces du bac sont trop grandes."
    },
    criteres: [{ t: "ram", min: 16 }, { t: "canal" }, { t: "ssd", min: 256, type: "ssd-m2" }, { t: "gpu", val: false }, { t: "facade" }, { t: "air" }, { t: "marge" }],
    inventaire: ["entretoises-itx", "entretoises-matx", "cache-io", "pate-thermique", "psu-sfx-450", "psu-450", "fan-120-a",
      "mb-b660-itx", "mb-b660-matx", "cpu-12400", "cpu-12400f", "cooler-lp", "cooler-tower", "cooler-boxed",
      "ram-ddr4-a", "ram-ddr4-b", "ram-ddr5-a", "ssd-nvme", "ssd-sata", "gpu-8pin"].concat(CABLES_ITX),
    etapes: suite(BASE_IDS, {
      entretoises: { texte: "Ce boîtier compact n'a qu'un petit plateau mini-ITX : choisis le kit d'entretoises de ce format.",
        indices: ["Une carte mini-ITX n'a que quatre trous de fixation."], solution: [["standoffs", "entretoises-itx"]] },
      alim: { texte: "Installe l'alimentation : un boîtier compact n'accepte que le format SFX.",
        indices: ["Le format ATX est trop grand pour ce boîtier."], solution: [["psu", "psu-sfx-450"]] },
      ventilateurs: { slots: ["fan-rear"], texte: "Pose le ventilateur arrière (sortie d'air) : ce petit boîtier n'a qu'un seul ventilateur.",
        indices: ["Un seul ventilateur, à l'arrière. L'air entre par les grilles et sort par ce ventilateur."], solution: [["fan-rear", "fan-120-a"]] },
      carte: { texte: "Choisis la carte mini-ITX compatible avec le processeur et la mémoire prévus.",
        indices: ["Le boîtier n'accepte que le format mini-ITX : une carte micro-ATX est trop grande."], solution: [["board", "mb-b660-itx"]] },
      cpu: { texte: "Installe un processeur LGA 1700 avec graphique intégré (pas de carte graphique dans ce PC).",
        indices: ["Le suffixe F signifie « sans graphique intégré »."], solution: [["cpu", "cpu-12400"]] },
      ventirad: { texte: "Pose un ventirad compatible LGA 1700 et assez bas pour ce boîtier : 70 mm de hauteur au maximum.",
        indices: ["Le ventirad tour mesure environ 155 mm : il ne passera pas.", "Cherche la hauteur dans les caractéristiques de chaque ventirad."],
        pourquoi: "Dans un boîtier compact, la hauteur sous le panneau latéral est limitée. Un ventirad low-profile (environ 47 mm) passe, mais dissipe moins de chaleur : il suffit pour un processeur de 65 W, pas pour un modèle plus puissant.",
        solution: [["cooler", "cooler-lp"]] },
      ram: { slots: ["dimm-a2", "dimm-b2"], texte: "Cette carte n'a que deux emplacements mémoire, un par canal : installe deux barrettes DDR4.",
        indices: ["Un emplacement par canal : deux barrettes donnent le double canal.", "La DDR5 ne rentre pas dans une carte DDR4."],
        solution: [["dimm-a2", "ram-ddr4-a"], ["dimm-b2", "ram-ddr4-b"]] },
      stockage: { texte: "Installe le SSD M.2 NVMe : il n'a pas de câble, ce qui compte dans un boîtier compact.",
        indices: ["Il n'y a pas de support 2,5″ dans ce boîtier : le SSD SATA n'a pas de place."], solution: [["m2-1", "ssd-nvme"]] },
      "ventilos-cables": { slots: ["h-cpufan", "h-sys1"], texte: "Branche le ventilateur du ventirad sur CPU_FAN et le ventilateur du boîtier sur SYS_FAN1.",
        indices: ["Le câble du ventirad va sur CPU_FAN."], solution: [["h-cpufan", "cab-fan-cpu"], ["h-sys1", "cab-fan-rear"]] }
    })
  };
  S["mini-itx"].etapes.forEach(function (e) {
    /* Pas de support 2,5″ ni de second ventilateur dans ce boîtier. */
    e.solution = (e.solution || []).filter(function (p) { return p[0] !== "bay-ssd" && p[0] !== "h-sys2"; });
  });

  /* ---------- Scénario 6 : mise à niveau ---------- */
  var DEPART = { standoffs: "entretoises-matx", ioshield: "cache-io", psu: "psu-300", "fan-rear": "fan-120-a", "fan-front": "fan-120-b",
    board: "mb-b660-matx", cpu: "cpu-12400", paste: "pate-thermique", cooler: "cooler-tower", "dimm-a2": "ram-ddr4-a",
    "bay-ssd": "hdd-sata", "sata-data": "cab-sata-data", "sata-pwr": "cab-sata-pwr", "con-atx24": "cab-atx24", "con-eps": "cab-eps",
    "h-cpufan": "cab-fan-cpu", "h-sys1": "cab-fan-rear", "h-sys2": "cab-fan-front", "con-fpanel": "cab-facade", "con-usb3": "cab-usb3",
    "con-audio": "cab-audio", mains: "cab-secteur", "mon-board": "cab-hdmi" };
  S["mise-a-niveau"] = {
    id: "mise-a-niveau", unite: "atelier-s6", titre: "Mise à niveau d'un PC", niveau: "Intermédiaire", duree: "≈ 25 min", mode: "apprentissage",
    disposition: "tour-matx",
    boitier: { nom: "Tour micro-ATX", formats: ["mATX", "ITX"], alim: ["ATX"], lGpu: 400, hVentirad: 165 },
    exige: {},
    depart: DEPART, departSwitch: true,
    brief: {
      client: "Un PC de bureau de cinq ans démarre lentement : 8 Go de mémoire, un disque dur mécanique. Son propriétaire voudrait aussi y jouer un peu. On garde la carte mère et le processeur : le PC ci-dessous est déjà monté et fonctionne.",
      besoin: [
        "16 Go de mémoire, en double canal",
        "Un SSD M.2 NVMe d'au moins 500 Go comme disque de démarrage ; le disque dur est conservé pour les données (deux disques)",
        "Une carte graphique dédiée, alimentée, avec l'écran branché dessus",
        "Alimentation avec environ 25 % de marge : vérifie si celle d'origine convient"
      ],
      materiel: "Le montage actuel est déjà posé. Pour retirer une pièce, retire d'abord ce qui en dépend (câbles). Le bac contient les pièces à ajouter, mais aussi des pièces qui ne conviennent pas.",
      source: "Dans la vraie vie : on éteint le PC, on coupe l'interrupteur, on débranche le secteur et on se décharge de l'électricité statique (toucher le boîtier métallique) avant d'ouvrir."
    },
    criteres: [{ t: "ram", min: 16 }, { t: "canal" }, { t: "ssd", min: 500, type: "ssd-m2" }, { t: "disques", min: 2 }, { t: "gpu", val: true }, { t: "marge" }],
    inventaire: Object.keys(DEPART).map(function (k) { return DEPART[k]; }).concat(["ram-ddr4-b", "ram-ddr5-a", "ssd-nvme", "ssd-sata", "psu-450", "psu-650", "gpu-8pin", "cab-pcie"]),
    etapes: [
      { id: "memoire", titre: "Ajouter de la mémoire", slots: ["dimm-b2"], vue: "zoom",
        texte: "Le PC a une barrette DDR4 de 8 Go en A2. Ajoute une barrette identique sur l'autre canal pour avoir 16 Go en double canal.",
        indices: ["Le PC est en DDR4 : la barrette DDR5 du bac ne rentre pas.", "L'emplacement conseillé pour la seconde barrette est B2."],
        pourquoi: "Une mise à niveau mémoire se fait avec le même type (DDR4 ici) et, de préférence, des barrettes identiques sur les deux canaux (A2 et B2) : la bande passante double. On vérifie le type et le nombre d'emplacements libres sur la fiche de la carte mère.",
        solution: [["dimm-b2", "ram-ddr4-b"]] },
      { id: "ssd", titre: "Ajouter un SSD M.2", slots: ["m2-1"], vue: "zoom",
        texte: "Ajoute le SSD M.2 NVMe sur la carte, sans câble. Il deviendra le disque de démarrage ; le disque dur reste en place pour les données.",
        indices: ["Le SSD SATA n'a pas de place : le support 2,5″ est déjà occupé par le disque dur."],
        pourquoi: "Un SSD M.2 NVMe se pose directement sur la carte, sans câble, et passe par le bus PCIe. Dans la vraie vie, il faudra ensuite installer ou cloner le système dessus, puis choisir ce disque comme disque de démarrage dans l'UEFI.",
        solution: [["m2-1", "ssd-nvme"]] },
      { id: "alim", titre: "Remplacer l'alimentation", slots: ["psu", "con-atx24", "con-eps", "sata-pwr", "mains"], fn: "psu-change", vue: "cote",
        retire: [["psu", "psu-300"]],
        texte: "L'alimentation de 300 W n'a pas de connecteur PCIe et serait trop juste avec une carte graphique. Retire les câbles qui en sortent, remplace-la par une alimentation adaptée, puis rebranche tout.",
        indices: ["Retire d'abord les câbles (24 broches, EPS, SATA, secteur) : une alimentation ne peut pas être retirée tant que des câbles en dépendent.", "Estime la consommation : processeur en turbo (117 W) + carte graphique (160 W) + environ 75 W, avec environ 25 % de marge."],
        pourquoi: POURQUOI_ALIM_GPU + " Remplacer une alimentation oblige à débrancher tous ses câbles puis à les remettre : c'est une opération courante lors d'une mise à niveau.",
        solution: [["psu", "psu-450"], ["con-atx24", "cab-atx24"], ["con-eps", "cab-eps"], ["sata-pwr", "cab-sata-pwr"], ["mains", "cab-secteur"]] },
      { id: "gpu", titre: "Installer la carte graphique", slots: ["gpu", "con-gpu-pwr", "mon-gpu"], fn: "video-gpu", vue: "zoom",
        retire: [["mon-board", "cab-hdmi"]],
        texte: "Installe la carte graphique et son câble PCIe, puis déplace le câble vidéo de la carte mère vers la carte graphique (vue « Arrière »).",
        indices: ["Avec une carte graphique dédiée, l'écran se branche sur la carte graphique : débranche-le de la carte mère.", "Le câble PCIe n'est pas le câble EPS."],
        pourquoi: "Quand une carte graphique dédiée est installée, c'est elle qui produit l'image : la sortie vidéo de la carte mère est en général désactivée. Il faut donc déplacer le câble d'écran, sinon l'écran reste noir alors que le PC tourne.",
        solution: [["gpu", "gpu-8pin"], ["con-gpu-pwr", "cab-pcie"], ["mon-gpu", "cab-hdmi"]] },
      { id: "demarrage", titre: "Allumer le PC", slots: [], fn: "post-ok", vue: "face",
        texte: "Allume le PC (vue « Face » ou bouton « Allumer le PC ») et vérifie la nouvelle configuration dans le rapport.",
        indices: ["Si l'écran reste noir : le câble vidéo est-il sur la carte graphique ? Le câble PCIe est-il branché ?"],
        pourquoi: "Après une mise à niveau, on vérifie que le PC démarre et que les nouvelles pièces sont détectées (mémoire, disques, carte graphique) dans l'UEFI avant de remonter le boîtier.",
        solution: [] }
    ]
  };

  /* ---------- Évaluation finale : scénarios enchaînés, en mode test ---------- */
  A.evaluation = {
    id: "evaluation", unite: "atelier-eval", titre: "Évaluation finale", seuil: 75,
    scenarios: ["salle-info", "gamer-amd", "mini-itx", "mise-a-niveau"]
  };

  /* ---------- Points à revoir : thème → conseil et lien ---------- */
  A.revoir = {
    compat: { titre: "Compatibilité des pièces", conseil: "Avant de poser une pièce, vérifie : socket du processeur et de la carte, format de la carte et du boîtier, hauteur du ventirad, longueur de la carte graphique, format de l'alimentation. Les fiches des constructeurs (Intel ARK, AMD) donnent le socket.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    memoire: { titre: "Mémoire : DDR4 / DDR5, capacité, double canal", conseil: "DDR4 et DDR5 ne sont pas interchangeables (l'encoche diffère). Deux barrettes sur les deux canaux (A2 et B2 en premier) donnent le double canal. Sans mémoire détectée, le POST s'arrête (bips ou LED DRAM).", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    alim: { titre: "Alimentation : puissance, connecteurs, secteur", conseil: "Estime la consommation maximale (processeur en turbo + carte graphique + reste), garde une marge (règle pratique : environ 25 %), vérifie les connecteurs (EPS, PCIe) et le format (ATX, SFX), puis le câble secteur et l'interrupteur.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    refroidissement: { titre: "Refroidissement : pâte, ventirad, flux d'air", conseil: "Pâte sur le processeur avant le ventirad ; capacité de dissipation du ventirad supérieure à la puissance du processeur ; air de l'avant vers l'arrière ; ventilateur du ventirad sur CPU_FAN.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    stockage: { titre: "Stockage : M.2, SATA et câbles", conseil: "Un SSD M.2 NVMe se pose sans câble. Un disque SATA demande deux câbles : données et alimentation. Un SSD est bien plus rapide qu'un disque dur mécanique.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    cablage: { titre: "Câblage : 24 broches, EPS, PCIe, façade", conseil: "Le 24 broches alimente la carte, l'EPS le processeur, le PCIe la carte graphique ; la nappe de façade fait fonctionner le bouton marche. On ne force jamais un connecteur : le détrompeur est là pour ça.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    video: { titre: "Sortie vidéo : graphique intégré ou carte dédiée", conseil: "Sans carte dédiée, l'écran se branche sur la carte mère, avec un processeur doté d'un graphique intégré (pas de suffixe F chez Intel). Avec une carte dédiée, l'écran se branche dessus.", lien: "../stage/j9.html#demarrage", libelle: "Prépa, jour 9 : démarrage, BIOS/UEFI" },
    ordre: { titre: "Ordre de montage", conseil: "Entretoises du bon format et cache I/O avant la carte mère ; carte avant le processeur ; pâte avant le ventirad ; une pièce ne se branche que si ce dont elle dépend est en place.", lien: "../stage/j9.html#composants", libelle: "Prépa, jour 9 : les composants" },
    choix: { titre: "Respect du cahier des charges", conseil: "Relis le besoin du client ligne par ligne avant de choisir : nombre de cœurs, capacité, graphique intégré ou carte dédiée, type de disque. Chaque pièce répond à une ligne du cahier des charges.", lien: "../stage/j9.html#salles", libelle: "Prépa, jour 9 : salles informatiques" }
  };

  /* Module du site qui approfondit chaque thème (lot 14 : module « Matériel et PC »). */
  var MP = "../modules/materiel-pc.html", LIB = "Module « Matériel et PC » : ";
  A.moduleRevoir = {
    demarrage: { href: MP + "#post", libelle: LIB + "avant Windows, POST et configuration minimale" },
    methode: { href: "../modules/support-windows.html#axes", libelle: "Module « Support poste Windows » : quatre axes pour localiser une panne" },
    general: { href: MP, libelle: "Module « Matériel et PC »" }
  };
  var sections = {
    compat: ["compatibilite", "compatibilité des pièces"], memoire: ["memoire", "la mémoire"], alim: ["alimentation", "l'alimentation"],
    cablage: ["alimentation", "les connecteurs d'alimentation"], refroidissement: ["refroidissement", "le refroidissement"],
    stockage: ["stockage", "le stockage"], video: ["connectique", "écrans et sorties vidéo"], ordre: ["post", "configuration minimale"], choix: ["compatibilite", "compatibilité des pièces"]
  };
  Object.keys(sections).forEach(function (k) { if (A.revoir[k]) A.revoir[k].module = { href: MP + "#" + sections[k][0], libelle: LIB + sections[k][1] }; });
})();
