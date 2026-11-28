# Relecture des sources : atelier hardware (fiches techniques et démontage)

- **Fichiers relus** : `assets/atelier-fiches-data.js` (8 fiches, `atelier/composants.html?c=<id>`) et `assets/atelier-demontage.js` (consignes de sécurité, C-01 à C-03).
- **Date** : 28/11/2026
- **Outil** : Claude Code, agent de relecture lancé dans une nouvelle conversation (il n'a pas écrit ces fichiers). Sources ouvertes avec WebFetch, PDF lus page par page. Aucun fichier modifié par la relecture.
- **Bilan** : 61 affirmations relues, **47 correctes, 3 fausses (mineures), 11 non vérifiées** ; 1 point de procédure (« à vérifier sur place » manquant dans la fiche Mémoire).

## Sources inaccessibles aux robots (constaté)
Kingston « Memory population rules » (HTTP 403), Crucial (« Request Rejected »), AMD (HTTP 503, trois pages), Noctua (HTTP 429), manuel Gigabyte original (plus de 10 Mo : lu sur la copie manuals.plus, Rev. 1301). Intel ATX 2.2 : copie xdevs.com, document « Copyright 2003-2004 Intel Corporation ».

## Affirmations correctes (résumé)
Processeur : fiche ARK du i5-12400 (6 cœurs / 12 threads, 65 W / 117 W, FCLGA1700, UHD 730, DDR5-4800 ou DDR4-3200, 2 canaux), i5-12400F sans section graphique, suffixe F (Intel 000058567), mise à jour du BIOS (Intel 000092294), tenue par les bords, pâte et CPU_FAN (manuel Gigabyte). Mémoire : DDR4 ≠ DDR5 et détrompeur (Dell 000148441, Gigabyte), rôle de la RAM, double canal A2/B2, vitesse en MT/s (Intel 000095111), barrettes mélangées (Gigabyte, Microsoft événement 41), mdsched.exe. Carte mère : 305 × 244 mm et trous alignés sur le micro-ATX (ATX 2.2 § 3.1 et 3.2), entretoises en trop = court-circuit (ASRock), PCIe x16 et sorties vidéo (Gigabyte, NVIDIA). Alimentation : guide Intel 336521 Rev. 2.1a, ATX12V et SFX12V, rôle des connecteurs, détrompage et câblage différent PCIe / +12 V, 16 broches enfoncé à fond (NVIDIA), événement 41, tension de veille et interrupteur, quatre vis et 150 × 86 × 140 mm (fig. 13-1). Stockage : M.2 2280 et clés B / M (Dell 000144170), SATA 6Gb/s ≈ 600 Mo/s et mêmes câbles (SATA-IO), M.2 SATA à vitesse SATA, NVMe sur PCIe, emplacement M.2 selon le manuel, deux câbles SATA, UEFI et GPT. Carte graphique : écran sur la carte, longueur et épaisseur. Refroidissement : bridage puis arrêt (Intel 000005597), poussière (Dell 000130867). Câbles : F_PANEL, F_AUDIO, F_U32 (Gigabyte). Démontage : toutes les consignes Dell 000137973 (arrêt, secteur, bouton 15 à 20 s, métal non peint 5 s ou bracelet, toutes les quelques minutes, bords, sachet antistatique, ordre après travail), B2 quatrième fente sur la carte de référence, M.2 en biais, 24 broches au bord droit (ATX 2.2 table 3), connecteur mal enfoncé.

## Faux et non vérifiés

| # | Affirmation | Verdict | Source ouverte | Correction |
|---|---|---|---|---|
| 5 | Socket AM5 chez AMD | non vérifié | amd.com en 503 | Retiré de la fiche Processeur (exemple FCLGA1700 du i5-12400) |
| 9 | DIMM pour une tour, SO-DIMM pour un portable | non vérifié | Dell 000148441 n'en parle pas ; Kingston 403 | Retiré : « format des emplacements de la carte (DIMM sur une carte de bureau) » |
| 17 | « un boîtier ATX accepte aussi ces cartes » | faux (mineur) | ATX 2.2 § 3.1 : « many ATX form factor chassis » | « beaucoup de boîtiers ATX » |
| 23 | « EPS 8 broches (4+4), parfois deux », « PCIe 8 broches (6+2) » | non vérifié | Intel 336521 : +12 V 4 et 8 broches, PCIe 2x3 / 2x4 / 12V-2x6 | Fiches : « +12 V 4 ou 8 broches (« EPS » dans le langage courant) », « PCIe 2x3, 2x4 ou 12V-2x6 » |
| 26 | 16 broches mal enfoncé « peut chauffer » | non vérifié | NVIDIA, Intel 336521 : rien sur l'échauffement | Retiré ; gardé « s'enfonce à fond, bien à plat » (NVIDIA) |
| 27 | Condensateurs chargés même débranché | non vérifié | Dell, consignes de sécurité : tensions dangereuses, techniciens formés | Reformulé d'après Dell (fiche Alimentation et C-03) |
| 39 | « indicateurs SMART résumés par Get-PhysicalDisk » | non vérifié | Microsoft Learn : HealthStatus ; Get-StorageReliabilityCounter | Reformulé avec les deux cmdlets |
| 41 | Sauvegarde avant chkdsk /r | non vérifié | Microsoft Learn chkdsk : /r lit chaque secteur, long | Présenté comme « Prudence » + description Microsoft |
| 44 | Air entrant à l'avant, sortant à l'arrière | non vérifié | ATX 2.2 § 5.1 « well-directed airflow » ; 336521 : sortie arrière la plus courante | « Flux bien dirigé (ATX) ; sortie à l'arrière la plus courante » ; l'avant → arrière reste un choix de l'atelier |
| 47 | « air sec en courtes rafales » | non vérifié | Dell 000130867 ne décrit pas la méthode | Retiré : « en suivant la page de nettoyage du constructeur » |
| 48 | La flèche du cadre donne le sens de l'air | non vérifié | Noctua 429 | Retiré : « sens de montage indiqué par le constructeur » |
| 51 | « dans une seule prise » | faux (mineur) | Gigabyte : embases ventilateur identiques | « seulement dans une prise de son type » |
| 52 | Tirer par le connecteur, jamais par les fils | non vérifié | Intel 336521 : forces de retenue seulement | Présenté comme « Bonne pratique » |
| 59 | M.2 tenu par « une seule vis » | faux (mineur) | Gigabyte § 8 : clip sans outil ou vis du dissipateur | « une vis (ou un clip sans outil, selon la carte) » |

## Suivi des corrections (28/11/2026, Claude Code)
Toutes les corrections ci-dessus faites dans `assets/atelier-fiches-data.js` et `assets/atelier-demontage.js`. Fiche Mémoire : « à vérifier sur place » ajouté. Sources ajoutées aux fiches : manuel Gigabyte (copie), ASRock, Intel 000005597 et 000058567, guide Intel 336521 en PDF, NVIDIA RTX 5090, Microsoft (événement 41, GPT, compteurs de fiabilité), consignes de sécurité Dell ; la fiche Carte graphique a désormais des sources primaires. Le module « Matériel et PC » n'est plus cité comme source. Encore à faire : rouvrir AMD (AM5) et Kingston quand ils répondent.
