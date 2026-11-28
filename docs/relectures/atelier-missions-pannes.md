# Relecture des sources : missions du stage, dossiers de pannes et arbre de diagnostic

- **Fichiers relus** : `assets/atelier-missions-data.js` (4 missions), `assets/atelier-pannes-data.js` (14 dossiers, `A.pannesSain`, `A.revoir`), tableau `ARBRE` de `assets/atelier-diagnostic.js`.
- **Date** : 28/11/2026
- **Outil** : Claude Code, agent de relecture lancé dans une nouvelle conversation (auteur différent). Aucun fichier modifié par la relecture.
- **Bilan** : 55 affirmations, **30 correctes, 6 fausses, 19 non vérifiées** (dont 2 constats de procédure).
- **Sites bloqués (constaté)** : UPS (Access Denied), HP (503), MSI et Gigabyte (403), ASUS edgeup (403), Noctua (429), TDK-Lambda (403), fiche Energizer CR2032 (404), page ASUS « CPU support » (dynamique), module Microsoft Learn « Diagnose memory problems » (redirigé).

## Correct (résumé)
Intégration : Win32_BIOS (SerialNumber), Win32_ComputerSystem, Autopilot sans réimager, méthode traditionnelle par image, dsregcmd YES / NO / YES = joint hybride. Maintenance : Get-PhysicalDisk (HealthStatus), Get-StorageReliabilityCounter, Wear en pourcentage, powercfg /batteryreport, poussière et surchauffe, nettoyage hors tension (Dell 000124077), consignes Dell 000137973. Pannes : test du trombone (PS_ON#), LED de veille et +5VSB, bloc non réparable (Lenovo), EPS = 12 V du processeur (Intel 336521), ordre CPU / DRAM / VGA / BOOT (ASUS), barrettes une par une, ralentissement puis arrêt (Intel 000005597), petit pois de pâte (Intel 000006710), PCIe x16 = 75 W, deux câbles SATA, pile CR2032 (Dell 000135183), Kerberos et l'horloge, BIOS à mettre à jour pour un processeur récent et Flashback sans processeur (ASRock), ne pas couper pendant la mise à jour (ASUS), 9 emplacements ATX (ATX 2.2), protection de l'alimentation en court-circuit, PWR_SW (ASUS). Arbre : q1 à q5 et phrase de fin.

## Faux et non vérifiés

| Affirmation | Verdict | Source ouverte | Correction faite |
|---|---|---|---|
| ±5 % sur +12 V « norme ATX » (sain, alim-hs) | faux | Intel 336521 Rev. 2.1a, § 4.2.1, tableau 4-2 | +12 V de −7 % à +5 %, +5 V et +3,3 V à ±5 % (pannes, encadré des dossiers, fiche Alimentation) |
| Signal « PS_OK » | faux | Intel 336521, § 4.3.1, tableau 5-1 | Remplacé par PWR_OK |
| « ou avec un aspirateur antistatique » | faux | Dell 000124077 (pas d'aspirateur ni de souffleur) | Air comprimé seulement, d'après Dell |
| Carte graphique « connecteur 6+2 » | faux | Intel 336521, § 3.2 | « connecteur d'alimentation PCIe (8 broches) » ; intervention « câble d'alimentation PCIe » |
| « moins d'entretoises pour une micro-ATX » | faux | ATX 2.2, fig. 2 | « leur nombre dépend du format et de la carte » |
| Kit ATX sous une micro-ATX = court-circuit | faux | ATX 2.2, fig. 2 (emplacements propres à l'ATX hors de la micro-ATX) | Dossier réécrit (entretoise déjà vissée, sans trou en face) ; message du moteur de montage corrigé (Moteur autorisé) |
| UPS, photos et réclamation | non vérifié | UPS bloqué | Formulé « selon la procédure de l'organisation et du transporteur », délais « à vérifier sur place » |
| « en console administrateur » | non vérifié | Microsoft Learn | Retiré |
| Batterie à 60 % = remplacement | non vérifié | Dell 000130117 (sous 40 %) | Seuil Dell cité, source ajoutée |
| Condensateurs chargés | non vérifié | Lenovo : énergie dangereuse | Reformulé d'après Lenovo |
| Orage, cause classique | non vérifié | — | Phrase retirée (le ticket garde l'orage comme récit) |
| LED CPU (EPS, BIOS), LED VGA (câble PCIe) | non vérifié | FAQ ASUS : rien sur ces causes | Présentés comme liens « de la simulation » dans l'encadré des dossiers |
| Diagnostic de mémoire Windows | non vérifié | page Microsoft redirigée | Nom exact « Outil Diagnostics de mémoire Windows (mdsched.exe) », déjà sourcé au lot 44 |
| Micro-creux d'air | non vérifié | Intel 000006710 | Reformulé comme Intel (« transfert de chaleur efficace ») |
| Film plastique des ventirads | non vérifié | Noctua bloqué | Limité au dossier (« dans ce dossier ») ; la notice du ventirad reste la référence |
| Températures au repos (35-45, 30-50, 80 °C) | non vérifié | Intel : pas de plage officielle | Retirées : « stable et loin du maximum », « élevée dès le repos » |
| Bloquer les pales | non vérifié | — | Retiré |
| Pile à 2,0 V | non vérifié | fiche Energizer en 404 | Remplacé par la durée Dell (2 à 3 ans) |
| Message « CMOS checksum error » | non vérifié | — | « par exemple…, le texte dépend du BIOS » |
| Page « CPU Support » avec version minimale | non vérifié | pages illisibles | Reformulé d'après ASRock |
| Tournevis sur PWR_SW | non vérifié | — | Remplacé par « le manuel de la carte donne le brochage de F_PANEL » |
| Lignes parasites | non vérifié | — | Retiré (le ticket les garde comme récit) |
| Pas d'encadré source pour les pannes | constat | — | Encadré des dossiers et du catalogue complété (Intel ATX 3, ASUS, Dell, Intel) |
| Libellé des listes UMONS | constat | — | Affichées sous « À vérifier sur place (UMONS) » |
| Source NIST inutilisée | constat | — | Retirée des missions |

## Suivi (28/11/2026, Claude Code)
Toutes les corrections du tableau faites dans `atelier-pannes-data.js`, `atelier-missions-data.js`, `atelier-pannes.js`, `atelier-fiches-data.js` et dans le message « kit trop grand » de `atelier-regles.js`. Reste ouvert : rouvrir la page UPS dans un navigateur.
