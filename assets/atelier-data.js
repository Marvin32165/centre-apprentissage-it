/* Atelier hardware — catalogue de pièces, disposition de la scène et scénarios.
   Les pièces sont des modèles génériques : caractéristiques réalistes mais simplifiées.
   Les lots 5 et 6 ajoutent des scénarios et des pannes dans `scenarios`. */
(function () {
  "use strict";
  var A = window.IT_ATELIER = window.IT_ATELIER || {};

  /* ---------- Pièces ---------- */
  var P = A.pieces = {};
  function add(id, o) { o.id = id; P[id] = o; }

  /* Accessoires */
  add("entretoises-matx", {
    nom: "Kit d'entretoises micro-ATX", type: "entretoises", cat: "accessoire",
    art: { icon: "entretoises", scene: "entretoises-s" },
    resume: "6 entretoises en laiton et leurs vis",
    specs: [["Format", "micro-ATX"], ["Contenu", "6 entretoises + vis"]],
    pose: "Les entretoises surélèvent la carte mère : sans elles, les soudures de la carte toucheraient le plateau métallique et provoqueraient un court-circuit. Elles se placent en face des trous de la carte (ici, format micro-ATX)."
  });
  add("cache-io", {
    nom: "Cache I/O (plaque arrière)", type: "cache-io", cat: "accessoire",
    art: { icon: "cacheio", scene: "cacheio" },
    resume: "Obture l'arrière autour des ports",
    specs: [["Rôle", "Protège et ferme l'arrière du boîtier"], ["Pose", "De l'intérieur, avant la carte mère"]],
    pose: "Le cache I/O se clipse de l'intérieur, avant la carte mère, et ses bords sont coupants. Beaucoup de cartes récentes l'ont déjà intégré : ce n'est pas le cas ici."
  });
  add("pate-thermique", {
    nom: "Pâte thermique (seringue)", type: "pate", cat: "accessoire",
    art: { icon: "pate-i", scene: "pate-s" },
    resume: "Améliore le contact processeur / ventirad",
    specs: [["Quantité", "Une petite noisette suffit"]],
    pose: "Dépose une petite noisette de pâte au centre du processeur : la pression du ventirad l'étale en film mince. Plus de pâte ne refroidit pas mieux."
  });

  /* Composants */
  add("psu-450", {
    nom: "Alimentation ATX 450 W", type: "alim", cat: "composant", format: "ATX", w: 450, pcie: 1,
    art: { icon: "alim-i", scene: "alim-s" }, o: { label: "450 W" },
    resume: "ATX, 450 W, 24 broches + EPS + PCIe + SATA",
    specs: [["Format", "ATX"], ["Puissance", "450 W"], ["Connecteurs", "24 broches, EPS 4+4, PCIe 6+2, SATA"]],
    pose: "L'alimentation se fixe par l'arrière avec 4 vis. Son ventilateur se tourne vers une grille d'aération si le boîtier en a une. Elle fournit toutes les tensions de la machine."
  });
  add("psu-300", {
    nom: "Alimentation ATX 300 W", type: "alim", cat: "composant", format: "ATX", w: 300, pcie: 0,
    art: { icon: "alim-i", scene: "alim-s" }, o: { label: "300 W" },
    resume: "ATX, 300 W, sans connecteur PCIe",
    specs: [["Format", "ATX"], ["Puissance", "300 W"], ["Connecteurs", "24 broches, EPS 4+4, SATA (pas de PCIe)"]],
    pose: "Une alimentation de 300 W suffit pour un PC de bureau sans carte graphique, mais elle n'a pas de connecteur PCIe : impossible d'alimenter une carte graphique puissante."
  });
  add("fan-120-a", {
    nom: "Ventilateur 120 mm (1/2)", type: "ventilateur", cat: "composant",
    art: { icon: "fan-i", scene: "fan-s" },
    resume: "Boîtier, 3 ou 4 broches",
    specs: [["Taille", "120 mm"], ["Connecteur", "4 broches (PWM)"]],
    pose: "Une flèche sur le côté du ventilateur indique le sens de l'air. À l'avant : entrée d'air ; à l'arrière : sortie d'air. L'air traverse le boîtier d'avant en arrière."
  });
  add("fan-120-b", {
    nom: "Ventilateur 120 mm (2/2)", type: "ventilateur", cat: "composant",
    art: { icon: "fan-i", scene: "fan-s" },
    resume: "Boîtier, 3 ou 4 broches",
    specs: [["Taille", "120 mm"], ["Connecteur", "4 broches (PWM)"]],
    pose: "Une flèche sur le côté du ventilateur indique le sens de l'air. À l'avant : entrée d'air ; à l'arrière : sortie d'air. L'air traverse le boîtier d'avant en arrière."
  });
  add("mb-b660-matx", {
    nom: "Carte mère B660 (micro-ATX, DDR4)", type: "carte-mere", cat: "composant",
    format: "mATX", socket: "LGA1700", ddr: "DDR4",
    art: { icon: "board", scene: "board" },
    resume: "LGA 1700, micro-ATX, DDR4, 1 × M.2",
    specs: [["Socket", "LGA 1700"], ["Format", "micro-ATX"], ["Mémoire", "DDR4, 4 emplacements"], ["Stockage", "1 × M.2 NVMe, 4 × SATA"], ["Vidéo", "HDMI et DisplayPort (graphique du processeur)"], ["Diagnostic", "4 LED de debug (CPU, DRAM, VGA, BOOT), buzzer"]],
    pose: "Présente la carte en alignant ses ports avec le cache I/O, puis visse-la sur chaque entretoise. Les vis se serrent sans excès."
  });
  add("mb-z790-atx", {
    nom: "Carte mère Z790 (ATX, DDR5)", type: "carte-mere", cat: "composant",
    format: "ATX", socket: "LGA1700", ddr: "DDR5",
    art: { icon: "board", scene: "board" },
    resume: "LGA 1700, ATX, DDR5",
    specs: [["Socket", "LGA 1700"], ["Format", "ATX"], ["Mémoire", "DDR5"]],
    pose: "Carte mère ATX."
  });
  add("cpu-12400", {
    nom: "Intel Core i5-12400", type: "cpu", cat: "composant",
    socket: "LGA1700", pmax: 117, igpu: true,
    art: { icon: "cpu", scene: "cpu" }, o: { label: "i5-12400", sub: "LGA1700" },
    resume: "LGA 1700, 6 cœurs, 65 W, graphique intégré",
    specs: [["Socket", "LGA 1700"], ["Cœurs / threads", "6 / 12"], ["Puissance de base", "65 W (jusqu'à 117 W en turbo)"], ["Graphique intégré", "oui (UHD 730)"], ["Mémoire", "DDR4 ou DDR5 selon la carte"]],
    pose: "Soulève le levier du socket, aligne le triangle du processeur avec celui du socket, pose-le sans forcer, puis rabaisse le levier. On ne touche jamais aux contacts."
  });
  add("cpu-12400f", {
    nom: "Intel Core i5-12400F", type: "cpu", cat: "composant",
    socket: "LGA1700", pmax: 117, igpu: false,
    art: { icon: "cpu", scene: "cpu" }, o: { label: "i5-12400F", sub: "LGA1700" },
    resume: "LGA 1700, 6 cœurs, 65 W, sans graphique intégré",
    specs: [["Socket", "LGA 1700"], ["Cœurs / threads", "6 / 12"], ["Puissance de base", "65 W (jusqu'à 117 W en turbo)"], ["Graphique intégré", "non (suffixe F)"]],
    alerte: "Le suffixe F signifie « sans graphique intégré ». Sans carte graphique dédiée, ce PC n'aura pas d'image, et le cahier des charges ne prévoit pas de carte graphique.",
    pose: "Même pose que tout processeur LGA : triangle contre triangle, sans forcer."
  });
  add("cpu-r5-7600", {
    nom: "AMD Ryzen 5 7600", type: "cpu", cat: "composant",
    socket: "AM5", pmax: 88, igpu: true,
    art: { icon: "cpu", scene: "cpu" }, o: { label: "Ryzen 5", sub: "AM5" },
    resume: "Socket AM5, 6 cœurs, 65 W, DDR5 uniquement",
    specs: [["Socket", "AM5"], ["Cœurs / threads", "6 / 12"], ["TDP", "65 W"], ["Mémoire", "DDR5 uniquement"]],
    pose: "Processeur AMD."
  });
  add("cooler-tower", {
    nom: "Ventirad tour (LGA 1700)", type: "ventirad", cat: "composant", sockets: ["LGA1700"],
    art: { icon: "cooler-i", scene: "cooler-s" },
    resume: "Dissipateur + ventilateur, sans pâte pré-appliquée",
    specs: [["Fixation", "LGA 1700"], ["Ventilateur", "120 mm, 4 broches (PWM)"], ["Pâte", "non pré-appliquée"]],
    pose: "Le ventirad se visse sur la plaque arrière, par petits tours en croix, pour une pression régulière sur le processeur. Son ventilateur se branche sur CPU_FAN."
  });
  add("cooler-am5", {
    nom: "Ventirad AMD (AM5)", type: "ventirad", cat: "composant", sockets: ["AM5"],
    art: { icon: "cooler-i", scene: "cooler-s" },
    resume: "Dissipateur pour socket AM5",
    specs: [["Fixation", "AM5"]],
    pose: "Ventirad AMD."
  });
  add("ram-ddr4-a", {
    nom: "Barrette DDR4-3200 8 Go (1/2)", type: "ram", cat: "composant", ddr: "DDR4", go: 8,
    art: { icon: "dimm", scene: "dimm-s" }, o: { label: "DDR4 8 Go", ddr: "DDR4" },
    resume: "DDR4, 8 Go",
    specs: [["Type", "DDR4-3200 UDIMM"], ["Capacité", "8 Go"]],
    pose: "Ouvre les clips, aligne l'encoche de la barrette avec le détrompeur de l'emplacement, puis appuie aux deux extrémités jusqu'au « clic » des clips."
  });
  add("ram-ddr4-b", {
    nom: "Barrette DDR4-3200 8 Go (2/2)", type: "ram", cat: "composant", ddr: "DDR4", go: 8,
    art: { icon: "dimm", scene: "dimm-s" }, o: { label: "DDR4 8 Go", ddr: "DDR4" },
    resume: "DDR4, 8 Go",
    specs: [["Type", "DDR4-3200 UDIMM"], ["Capacité", "8 Go"]],
    pose: "Ouvre les clips, aligne l'encoche de la barrette avec le détrompeur de l'emplacement, puis appuie aux deux extrémités jusqu'au « clic » des clips."
  });
  add("ram-ddr5-a", {
    nom: "Barrette DDR5-5600 16 Go", type: "ram", cat: "composant", ddr: "DDR5", go: 16,
    art: { icon: "dimm", scene: "dimm-s" }, o: { label: "DDR5 16 Go", ddr: "DDR5" },
    resume: "DDR5, 16 Go",
    specs: [["Type", "DDR5-5600 UDIMM"], ["Capacité", "16 Go"]],
    pose: "Barrette DDR5."
  });
  add("ssd-nvme", {
    nom: "SSD M.2 NVMe 500 Go", type: "ssd-m2", cat: "composant", go: 500,
    art: { icon: "m2", scene: "m2" },
    resume: "M.2 NVMe, 500 Go, sans câble",
    specs: [["Format", "M.2 2280, PCIe NVMe"], ["Capacité", "500 Go"]],
    pose: "Insère le SSD dans le connecteur M.2 en biais, rabats-le puis fixe-le avec la petite vis à l'autre extrémité. Aucun câble à brancher."
  });
  add("ssd-sata", {
    nom: "SSD SATA 2,5″ 500 Go", type: "ssd-sata", cat: "composant", go: 500,
    art: { icon: "sata-ssd", scene: "sata-ssd" },
    resume: "SATA, 500 Go, demande 2 câbles",
    specs: [["Format", "2,5″ SATA"], ["Capacité", "500 Go"]],
    pose: "Un SSD SATA se fixe dans son support, puis demande deux câbles : données (vers la carte mère) et alimentation (vers l'alimentation)."
  });
  add("gpu-8pin", {
    nom: "Carte graphique dédiée (1 × 8 broches)", type: "gpu", cat: "composant", w: 160, pcie: 1,
    art: { icon: "gpu-i", scene: "gpu" },
    resume: "PCIe x16, environ 160 W",
    specs: [["Interface", "PCIe x16"], ["Consommation", "environ 160 W"], ["Alimentation", "1 × 8 broches (PCIe)"]],
    alerte: "Le cahier des charges ne prévoit pas de carte graphique : le processeur a un graphique intégré. Une carte dédiée coûte plus cher, consomme plus et n'apporte rien en bureautique.",
    pose: "La carte graphique s'enfonce dans le port PCIe x16 jusqu'au « clic » du loquet, puis se visse à l'arrière du boîtier. Ses sorties vidéo se trouvent à l'arrière."
  });

  /* Câbles et branchements */
  function cable(id, nom, type, source, couleur, pose, extra) {
    var o = { nom: nom, type: type, cat: "cable", source: source,
      art: { icon: "cable-i", scene: "plug" }, o: { couleur: couleur }, resume: "Câble", specs: [], pose: pose };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    add(id, o);
  }
  cable("cab-atx24", "Câble 24 broches ATX", "cab-atx24", "psu", "#C8A24A",
    "Le connecteur 24 broches alimente la carte mère. Il n'entre que dans un sens (détrompeur) et se clipse avec un petit loquet : appuie franchement.", { resume: "Alimentation → carte mère", pins: 24 });
  cable("cab-eps", "Câble EPS 4+4 (processeur)", "cab-eps", "psu", "#4A7AB5",
    "Le câble EPS alimente le processeur en 12 V. Sans lui, la carte mère s'allume parfois sans pouvoir démarrer.", { resume: "Alimentation → processeur", pins: 8 });
  cable("cab-pcie", "Câble PCIe 6+2 (carte graphique)", "cab-pcie", "psu", "#3D9A8B",
    "Le câble PCIe alimente une carte graphique. Il ressemble au câble EPS mais ne se branche jamais sur le connecteur du processeur.", { resume: "Alimentation → carte graphique", pins: 8 });
  cable("cab-sata-data", "Câble SATA (données)", "cab-sata-data", null, "#B5473A",
    "Le câble de données relie le disque au port SATA de la carte mère. Il est fourni avec la carte mère.", { resume: "Disque → carte mère", pins: 7 });
  cable("cab-sata-pwr", "Câble d'alimentation SATA", "cab-sata-pwr", "psu", "#3A3A3A",
    "Le câble d'alimentation SATA vient de l'alimentation. Sans lui, un SSD SATA n'est pas détecté.", { resume: "Alimentation → disque", pins: 15 });
  cable("cab-fan-cpu", "Câble du ventilateur du ventirad", "cab-fan", "cooler", "#8A8A82",
    "Le ventilateur du ventirad se branche sur le connecteur CPU_FAN, que la carte mère surveille : s'il n'y tourne pas, elle signale une erreur au démarrage.", { resume: "Ventirad → CPU_FAN", pins: 4, fanDe: "cooler" });
  cable("cab-fan-rear", "Câble du ventilateur arrière", "cab-fan", "fan-rear", "#8A8A82",
    "Les ventilateurs du boîtier se branchent sur les connecteurs SYS_FAN (ou CHA_FAN) de la carte mère.", { resume: "Ventilateur arrière → SYS_FAN", pins: 4, fanDe: "fan-rear" });
  cable("cab-fan-front", "Câble du ventilateur avant", "cab-fan", "fan-front", "#8A8A82",
    "Les ventilateurs du boîtier se branchent sur les connecteurs SYS_FAN (ou CHA_FAN) de la carte mère.", { resume: "Ventilateur avant → SYS_FAN", pins: 4, fanDe: "fan-front" });
  cable("cab-facade", "Nappe de façade (bouton, LED)", "cab-facade", null, "#A35FA5",
    "Ces petits fils relient le bouton marche, le bouton reset et les LED de la façade aux broches F_PANEL de la carte mère. Les boutons n'ont pas de polarité ; les LED, si.", { resume: "Façade → F_PANEL", pins: 10 });
  cable("cab-usb3", "Câble USB 3 de façade", "cab-usb3", null, "#3C6FB5",
    "Le câble USB 3 de façade se branche sur l'embase USB 3 de la carte mère (détrompeur). Sans lui, les ports USB de l'avant ne fonctionnent pas.", { resume: "Façade → embase USB 3", pins: 20 });
  cable("cab-audio", "Câble audio HD de façade", "cab-audio", null, "#4AA064",
    "Le câble audio HD relie la prise casque et le micro de la façade à la carte mère.", { resume: "Façade → embase audio", pins: 9 });
  cable("cab-secteur", "Câble secteur", "cab-secteur", "psu", "#4A4A4A",
    "Le câble secteur se branche à l'arrière de l'alimentation, puis sur une prise.", { resume: "Prise → alimentation", pins: 3 });
  cable("cab-hdmi", "Câble HDMI vers l'écran", "cab-hdmi", null, "#5A5A5A",
    "Le câble vidéo se branche sur la bonne sortie : celle de la carte mère si le graphique est intégré au processeur, celle de la carte graphique si le PC en a une.", { resume: "Écran → PC", pins: 19 });

  /* ---------- Disposition de la scène (boîtier tour micro-ATX) ---------- */
  var D = A.dispositions = {};
  var CAB = [390, 545];                         /* sortie des câbles de l'alimentation */
  D["tour-matx"] = {
    nom: "Boîtier tour micro-ATX",
    cote: { box: [0, 0, 860, 620] },
    zoom: { box: [100, 150, 350, 350] },
    slots: [
      { id: "standoffs", nom: "Plateau (entretoises)", accepte: ["entretoises"], x: 110, y: 160, w: 330, h: 330, z: 1, vue: "cote" },
      { id: "ioshield", nom: "Ouverture arrière (cache I/O)", accepte: ["cache-io"], x: 66, y: 172, w: 44, h: 118, z: 2, vue: "cote" },
      { id: "fan-rear", nom: "Ventilateur arrière", accepte: ["ventilateur"], x: 58, y: 38, w: 40, h: 112, z: 2, vue: "cote", flux: "sortie" },
      { id: "fan-front", nom: "Ventilateur avant", accepte: ["ventilateur"], x: 774, y: 180, w: 36, h: 150, z: 2, vue: "cote", flux: "entrée" },
      { id: "psu", nom: "Emplacement de l'alimentation", accepte: ["alim"], x: 60, y: 505, w: 330, h: 80, z: 2, vue: "cote" },
      { id: "board", nom: "Carte mère", accepte: ["carte-mere"], x: 110, y: 160, w: 330, h: 330, z: 3, vue: "cote",
        requiert: ["standoffs", "ioshield"] },
      { id: "cpu", nom: "Socket du processeur", accepte: ["cpu"], x: 170, y: 220, w: 80, h: 80, z: 4, vue: "zoom", requiert: ["board"] },
      { id: "paste", nom: "Dessus du processeur (pâte)", accepte: ["pate"], x: 192, y: 242, w: 36, h: 36, z: 5, vue: "zoom", requiert: ["cpu"] },
      { id: "cooler", nom: "Ventirad", accepte: ["ventirad"], x: 150, y: 200, w: 120, h: 120, z: 6, vue: "zoom", requiert: ["cpu", "paste"] },
      { id: "dimm-a1", nom: "DIMM A1", court: "A1", accepte: ["ram"], x: 280, y: 190, w: 20, h: 120, z: 4, vue: "zoom", requiert: ["board"] },
      { id: "dimm-a2", nom: "DIMM A2", court: "A2", accepte: ["ram"], x: 310, y: 190, w: 20, h: 120, z: 4, vue: "zoom", requiert: ["board"] },
      { id: "dimm-b1", nom: "DIMM B1", court: "B1", accepte: ["ram"], x: 340, y: 190, w: 20, h: 120, z: 4, vue: "zoom", requiert: ["board"] },
      { id: "dimm-b2", nom: "DIMM B2", court: "B2", accepte: ["ram"], x: 370, y: 190, w: 20, h: 120, z: 4, vue: "zoom", requiert: ["board"] },
      { id: "m2-1", nom: "Connecteur M.2", accepte: ["ssd-m2"], x: 160, y: 350, w: 150, h: 18, z: 4, vue: "zoom", requiert: ["board"] },
      { id: "gpu", nom: "Port PCIe x16", accepte: ["gpu"], x: 116, y: 398, w: 330, h: 52, z: 6, vue: "zoom", requiert: ["board"] },
      { id: "con-gpu-pwr", nom: "Alimentation de la carte graphique", accepte: ["cab-pcie"], x: 392, y: 386, w: 44, h: 12, z: 8, vue: "zoom", requiert: ["gpu", "psu"], fil: CAB },
      { id: "con-atx24", nom: "Connecteur 24 broches", accepte: ["cab-atx24"], x: 408, y: 330, w: 20, h: 100, z: 8, vue: "zoom", requiert: ["board", "psu"], fil: CAB },
      { id: "con-eps", nom: "Connecteur EPS (processeur)", accepte: ["cab-eps"], x: 150, y: 166, w: 80, h: 16, z: 8, vue: "zoom", requiert: ["board", "psu"], fil: CAB },
      { id: "h-cpufan", nom: "CPU_FAN", accepte: ["cab-fan"], x: 240, y: 166, w: 28, h: 14, z: 8, vue: "zoom", requiert: ["board"], fil: [210, 250] },
      { id: "h-sys1", nom: "SYS_FAN1", accepte: ["cab-fan"], x: 112, y: 306, w: 14, h: 30, z: 8, vue: "zoom", requiert: ["board"], fil: [78, 150] },
      { id: "h-sys2", nom: "SYS_FAN2", accepte: ["cab-fan"], x: 340, y: 470, w: 30, h: 14, z: 8, vue: "zoom", requiert: ["board"], fil: [792, 340] },
      { id: "con-fpanel", nom: "F_PANEL (façade)", accepte: ["cab-facade"], x: 270, y: 472, w: 50, h: 12, z: 8, vue: "zoom", requiert: ["board"], fil: [800, 560] },
      { id: "con-usb3", nom: "Embase USB 3", accepte: ["cab-usb3"], x: 200, y: 466, w: 40, h: 18, z: 8, vue: "zoom", requiert: ["board"], fil: [800, 540] },
      { id: "con-audio", nom: "Embase audio HD", accepte: ["cab-audio"], x: 130, y: 472, w: 40, h: 14, z: 8, vue: "zoom", requiert: ["board"], fil: [800, 575] },
      { id: "bay-ssd", nom: "Support de disque 2,5″", accepte: ["ssd-sata"], x: 520, y: 424, w: 120, h: 40, z: 3, vue: "cote" },
      { id: "sata-data", nom: "SATA : données", accepte: ["cab-sata-data"], x: 646, y: 422, w: 22, h: 16, z: 8, vue: "cote", requiert: ["bay-ssd", "board"], fil: [428, 470] },
      { id: "sata-pwr", nom: "SATA : alimentation", accepte: ["cab-sata-pwr"], x: 646, y: 446, w: 30, h: 16, z: 8, vue: "cote", requiert: ["bay-ssd", "psu"], fil: CAB },
      { id: "mains", nom: "Prise de l'alimentation", accepte: ["cab-secteur"], x: 92, y: 448, w: 72, h: 44, z: 8, vue: "arriere", requiert: ["psu"] },
      { id: "mon-board", nom: "Sortie vidéo de la carte mère", accepte: ["cab-hdmi"], x: 78, y: 62, w: 40, h: 24, z: 8, vue: "arriere", requiert: ["board", "ioshield"] },
      { id: "mon-gpu", nom: "Sortie vidéo de la carte graphique", accepte: ["cab-hdmi"], x: 80, y: 220, w: 44, h: 20, z: 8, vue: "arriere", requiert: ["gpu"] }
    ],
    /* Messages quand une pièce ne peut pas se poser faute d'une autre (ordre des étapes). */
    requiertMsg: {
      "board|standoffs": "Pas encore : pose d'abord les entretoises. Posée directement sur le plateau, la carte mère toucherait le métal et ferait un court-circuit.",
      "board|ioshield": "Pas encore : pose d'abord le cache I/O. Une fois la carte vissée, on ne peut plus le clipser.",
      "cpu|board": "Il faut d'abord installer la carte mère : le socket du processeur est sur la carte.",
      "paste|cpu": "La pâte se dépose sur le processeur : installe-le d'abord.",
      "cooler|cpu": "Le ventirad se fixe sur le processeur : installe-le d'abord.",
      "cooler|paste": "Pas encore : dépose d'abord la pâte thermique sur le processeur. Un ventirad posé sans pâte refroidit mal, et le processeur chauffe.",
      "con-atx24|psu": "Il n'y a pas encore d'alimentation : le câble en sort.",
      "con-eps|psu": "Il n'y a pas encore d'alimentation : le câble en sort.",
      "sata-data|bay-ssd": "Il faut d'abord un SSD SATA dans son support.",
      "sata-pwr|bay-ssd": "Il faut d'abord un SSD SATA dans son support.",
      "mains|psu": "Il n'y a pas encore d'alimentation.",
      "mon-board|ioshield": "Il faut d'abord le cache I/O : il fait partie de la sortie arrière.",
      "mon-gpu|gpu": "Il n'y a pas de carte graphique : cette sortie n'existe pas.",
      "con-gpu-pwr|gpu": "Il n'y a pas de carte graphique à alimenter."
    },
    /* Confusions classiques entre câbles (on ne force jamais). */
    confusions: {
      "con-eps|cab-pcie": "Danger : le câble PCIe (carte graphique) ressemble au câble EPS (processeur), mais ses fils ne sont pas câblés de la même façon. Ne force jamais un connecteur : le détrompeur est là pour ça. Cherche le câble « EPS 4+4 ».",
      "con-gpu-pwr|cab-eps": "Danger : le câble EPS (processeur) ressemble au câble PCIe (carte graphique) mais ne se branche pas ici. Cherche le câble « PCIe 6+2 ».",
      "con-atx24|cab-eps": "Ce connecteur à 24 broches n'accepte que le câble 24 broches ATX. Le câble EPS va près du processeur.",
      "con-eps|cab-atx24": "Le câble 24 broches ne va pas ici. Le connecteur près du processeur reçoit le câble EPS 4+4."
    }
  };

  /* ---------- Scénarios ---------- */
  A.scenarios = A.scenarios || {};
  A.scenarios["bureautique-intel"] = {
    id: "bureautique-intel", unite: "atelier-s1",
    titre: "PC bureautique Intel", niveau: "Débutant", duree: "≈ 30 min", mode: "apprentissage",
    disposition: "tour-matx",
    boitier: { nom: "Tour micro-ATX", formats: ["mATX", "ITX"], alim: ["ATX"] },
    brief: {
      client: "Un service administratif commande un PC de bureau pour Windows 11 : tableur, navigateur, visioconférence. Le budget est serré.",
      besoin: [
        "16 Go de mémoire au minimum, en double canal",
        "Un SSD d'au moins 256 Go",
        "Pas de carte graphique dédiée : le graphique intégré au processeur suffit",
        "Ports USB et audio de la façade utilisables",
        "Refroidissement correct : un flux d'air de l'avant vers l'arrière"
      ],
      materiel: "Tu disposes d'un boîtier tour micro-ATX et du contenu du bac : certaines pièces sont les bonnes, d'autres ne conviennent pas. À toi de choisir."
    },
    inventaire: ["entretoises-matx", "cache-io", "pate-thermique",
      "psu-450", "psu-300", "fan-120-a", "fan-120-b",
      "mb-b660-matx", "mb-z790-atx",
      "cpu-12400", "cpu-12400f", "cpu-r5-7600",
      "cooler-tower", "cooler-am5",
      "ram-ddr4-a", "ram-ddr4-b", "ram-ddr5-a",
      "ssd-nvme", "ssd-sata", "gpu-8pin",
      "cab-atx24", "cab-eps", "cab-pcie", "cab-sata-data", "cab-sata-pwr",
      "cab-fan-cpu", "cab-fan-rear", "cab-fan-front",
      "cab-facade", "cab-usb3", "cab-audio", "cab-secteur", "cab-hdmi"],
    etapes: [
      { id: "entretoises", titre: "Poser les entretoises", slots: ["standoffs"], vue: "cote",
        texte: "Le plateau du boîtier est en métal. Choisis le kit d'entretoises adapté au format de la carte et pose-le sur le plateau.",
        indices: ["Cherche dans l'onglet « Accessoires » du bac.", "Il n'y a qu'un kit : il correspond au format micro-ATX de la carte."],
        pourquoi: "Les entretoises tiennent la carte mère à quelques millimètres du plateau. Sans elles, les soudures de la face arrière touchent le métal : court-circuit possible, et l'alimentation se met en protection ou la carte est endommagée. Chaque format (ATX, micro-ATX, mini-ITX) a ses trous : on ne pose que les entretoises en face des trous de la carte.",
        solution: [["standoffs", "entretoises-matx"]] },
      { id: "ioshield", titre: "Clipser le cache I/O", slots: ["ioshield"], vue: "cote",
        texte: "Le cache I/O ferme l'arrière du boîtier autour des ports. Il se pose avant la carte mère.",
        indices: ["Onglet « Accessoires ». Regarde l'ouverture arrière, à gauche de la carte."],
        pourquoi: "Une fois la carte vissée, les ports bloquent l'accès : le cache doit être en place avant. Ses petites languettes assurent aussi le contact électrique avec le boîtier. Beaucoup de cartes récentes ont leur cache déjà intégré, il faut alors vérifier.",
        solution: [["ioshield", "cache-io"]] },
      { id: "alim", titre: "Fixer l'alimentation", slots: ["psu"], vue: "cote",
        texte: "Installe l'alimentation. Pour ce PC de bureau, 450 W suffisent largement. Vérifie aussi son format et ses connecteurs.",
        indices: ["Deux alimentations ATX sont dans le bac : regarde leurs caractéristiques.", "Une alimentation sans connecteur PCIe ne pourrait pas servir à un PC avec carte graphique : celle de 450 W est plus polyvalente."],
        pourquoi: "On choisit l'alimentation selon la consommation maximale (processeur + carte graphique + le reste) avec de la marge, selon son format (ATX ici) et ses connecteurs : 24 broches, EPS pour le processeur, PCIe pour une carte graphique, SATA pour les disques.",
        solution: [["psu", "psu-450"]] },
      { id: "ventilateurs", titre: "Monter les ventilateurs", slots: ["fan-rear", "fan-front"], vue: "cote",
        texte: "Pose un ventilateur à l'arrière (sortie d'air) et un à l'avant (entrée d'air).",
        indices: ["Les deux ventilateurs sont identiques : un à gauche (arrière), un à droite (avant)."],
        pourquoi: "L'air frais entre par l'avant, traverse le boîtier et sort par l'arrière. Un flux d'air régulier évite que la chaleur stagne autour du processeur, de la mémoire et des disques. La flèche gravée sur le cadre du ventilateur donne le sens de l'air.",
        solution: [["fan-rear", "fan-120-a"], ["fan-front", "fan-120-b"]] },
      { id: "carte", titre: "Installer la carte mère", slots: ["board"], vue: "cote",
        texte: "Choisis la carte mère compatible avec le boîtier (format) et le processeur prévu, puis pose-la.",
        indices: ["Le boîtier est un micro-ATX : une carte ATX est trop grande.", "Pour le choix du processeur, retiens le socket LGA 1700 et le type de mémoire : DDR4 ou DDR5 ?"],
        pourquoi: "Quatre choses doivent concorder : le format de la carte et du boîtier, le socket du processeur, le type de mémoire (DDR4 ou DDR5, non interchangeables) et les connecteurs (M.2, SATA, PCIe). Une carte ATX ne rentre pas dans un boîtier micro-ATX.",
        solution: [["board", "mb-b660-matx"]] },
      { id: "cpu", titre: "Poser le processeur", slots: ["cpu"], vue: "zoom",
        texte: "Installe un processeur compatible avec le socket de la carte. Le cahier des charges demande un graphique intégré : lis bien les caractéristiques.",
        indices: ["Le socket de la carte est LGA 1700.", "Un processeur dont le nom finit par « F » n'a pas de graphique intégré."],
        pourquoi: "Un processeur ne se pose que sur le socket pour lequel il est conçu : nombre et position des contacts. Chez Intel, le suffixe F désigne un modèle sans graphique intégré : sans carte graphique, il n'y a aucune sortie vidéo. Vérifier la fiche officielle (Intel ARK) évite l'erreur.",
        solution: [["cpu", "cpu-12400"]] },
      { id: "pate", titre: "Déposer la pâte thermique", slots: ["paste"], vue: "zoom",
        texte: "Dépose la pâte thermique sur le dessus du processeur, avant le ventirad.",
        indices: ["Onglet « Accessoires »."],
        pourquoi: "Même polie, la surface du processeur et la plaque du ventirad ont des micro-creux remplis d'air, mauvais conducteur de chaleur. La pâte les comble. Ici le ventirad n'a pas de pâte pré-appliquée : on la dépose avant de le poser.",
        solution: [["paste", "pate-thermique"]] },
      { id: "ventirad", titre: "Fixer le ventirad", slots: ["cooler"], vue: "zoom",
        texte: "Pose le ventirad compatible avec le socket LGA 1700.",
        indices: ["Le ventirad AMD est fait pour une autre fixation."],
        pourquoi: "Le ventirad est fixé par un système propre à chaque socket. Il se serre en croix, par petits tours, pour presser uniformément la pâte. Un ventirad mal serré ou sans pâte fait chauffer le processeur, qui ralentit puis coupe la machine.",
        solution: [["cooler", "cooler-tower"]] },
      { id: "ram", titre: "Installer la mémoire", slots: ["dimm-a2", "dimm-b2"], vue: "zoom",
        texte: "Installe les deux barrettes compatibles avec la carte, dans les emplacements recommandés pour le double canal : A2 et B2.",
        indices: ["Une seule barrette DDR5 ne convient pas à une carte DDR4.", "Les emplacements recommandés sont ceux marqués A2 et B2 (les 2e et 4e depuis le processeur)."],
        pourquoi: "DDR4 et DDR5 ont leur encoche à un endroit différent : elles ne sont pas interchangeables. Le double canal (deux barrettes sur deux canaux, ici A et B) double la largeur du bus mémoire. Le manuel de la carte indique les emplacements à utiliser en priorité : en général A2 puis B2 avec deux barrettes.",
        solution: [["dimm-a2", "ram-ddr4-a"], ["dimm-b2", "ram-ddr4-b"]] },
      { id: "stockage", titre: "Installer le SSD", slots: [], fn: "stockage", vue: "zoom",
        texte: "Installe un SSD. Le SSD M.2 NVMe se pose directement sur la carte, sans câble.",
        indices: ["Le SSD SATA demandera deux câbles de plus : données et alimentation."],
        pourquoi: "Un SSD M.2 NVMe se branche directement sur la carte, et passe par le bus PCIe : plus rapide et sans câble. Un SSD SATA fonctionne aussi, mais exige un câble de données ET un câble d'alimentation.",
        solution: [["m2-1", "ssd-nvme"]] },
      { id: "alim-cartes", titre: "Brancher l'alimentation à la carte", slots: ["con-atx24", "con-eps"], vue: "zoom",
        texte: "Branche le câble 24 broches ATX et le câble EPS du processeur.",
        indices: ["Ne confonds pas EPS (processeur) et PCIe (carte graphique) : prends « EPS 4+4 »."],
        pourquoi: "Le 24 broches apporte les tensions principales à la carte mère. Le connecteur EPS (4+4) apporte le 12 V au processeur. Un EPS oublié est une cause classique de « le PC ne démarre pas ».",
        solution: [["con-atx24", "cab-atx24"], ["con-eps", "cab-eps"]] },
      { id: "ventilos-cables", titre: "Brancher les ventilateurs", slots: ["h-cpufan", "h-sys1", "h-sys2"], vue: "zoom",
        texte: "Branche le ventilateur du ventirad sur CPU_FAN, et les ventilateurs du boîtier sur SYS_FAN1 et SYS_FAN2.",
        indices: ["Le câble du ventirad va sur CPU_FAN, en haut à côté du connecteur EPS."],
        pourquoi: "La carte mère pilote la vitesse des ventilateurs selon la température. Elle surveille CPU_FAN : si elle n'y détecte aucune rotation, elle signale une erreur au démarrage (« CPU Fan Error »).",
        solution: [["h-cpufan", "cab-fan-cpu"], ["h-sys1", "cab-fan-rear"], ["h-sys2", "cab-fan-front"]] },
      { id: "facade", titre: "Brancher la façade", slots: ["con-fpanel", "con-usb3", "con-audio"], vue: "zoom",
        texte: "Branche la nappe de façade (bouton marche, LED), le câble USB 3 et le câble audio. Ils se trouvent sur le bord bas de la carte.",
        indices: ["Sans la nappe de façade, le bouton marche ne fait rien."],
        pourquoi: "Le bouton marche n'est qu'un interrupteur qui ferme deux broches de F_PANEL. Si ce câble n'est pas branché, le PC ne reçoit jamais l'ordre de démarrer. Les câbles USB 3 et audio donnent vie aux prises de l'avant.",
        solution: [["con-fpanel", "cab-facade"], ["con-usb3", "cab-usb3"], ["con-audio", "cab-audio"]] },
      { id: "branchements", titre: "Brancher le secteur et l'écran", slots: ["mains", "mon-board"], fn: "interrupteur", vue: "arriere",
        texte: "Dans la vue « Arrière » : branche le câble secteur et le câble vidéo (sur la sortie de la carte mère), puis mets l'interrupteur de l'alimentation sur I.",
        indices: ["Le graphique est intégré au processeur : l'écran se branche sur la carte mère, pas sur une carte graphique.", "Touche l'interrupteur sur l'alimentation (ou le bouton « Interrupteur I/O »)."],
        pourquoi: "Sans secteur ou avec l'interrupteur sur O, l'alimentation ne délivre rien : aucune LED, aucun ventilateur. L'écran se branche sur la sortie vidéo qui produit l'image : celle de la carte mère quand le graphique est intégré au processeur, celle de la carte graphique quand il y en a une.",
        solution: [["mains", "cab-secteur"], ["mon-board", "cab-hdmi"]] },
      { id: "demarrage", titre: "Allumer le PC", slots: [], fn: "post-ok", vue: "face",
        texte: "Appuie sur le bouton marche (vue « Face ») ou sur « Allumer le PC ». Observe le démarrage et lis le diagnostic.",
        indices: ["Si le PC ne démarre pas, relis le résultat et reprends l'étape concernée."],
        pourquoi: "Au démarrage, la carte mère exécute le POST (Power-On Self-Test) : elle vérifie l'alimentation, le processeur, la mémoire et la vidéo avant de passer à l'UEFI puis au système.",
        solution: [] }
    ]
  };
})();
