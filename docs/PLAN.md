# Plan de travail

Un lot = une session Claude Code (nouvelle conversation, modèle Sonnet). Lancer avec :
`Lis CLAUDE.md et docs/PLAN.md, puis fais le lot N.`
Si un lot est coupé par la limite d'utilisation : `Lis CLAUDE.md et docs/PLAN.md, et reprends le lot N là où il s'est arrêté.`

Ordre conseillé : lots 1 à 3 d'abord (la prépa sert avant le 7/12), puis l'atelier.

## Lot 1 — Socle
- [x] Supprimer l'ancien site de `main` (il reste dans l'historique), garder `CLAUDE.md`, `docs/`, `.nojekyll`.
- [x] `assets/style.css` aux couleurs et polices de `CLAUDE.md` (clair et sombre), composants communs : bloc, encadrés (à retenir, astuce, attention, « à l'UMONS — à vérifier sur place », source), code avec bouton copier, tableau, `<details>` de correction, quiz, cases « fait ».
- [x] `assets/app.js` : navigation commune (5 rubriques), progression `it.*`, moteur de quiz, boutons copier.
- [x] `index.html` : présentation, accès aux 5 rubriques, progression globale, décompte jusqu'au 7/12/2026.
- [x] Pages d'entrée propres pour `stage/`, `modules/`, `themes.html`, `atelier/` (« bientôt » là où c'est vide).
- [x] Vérifier sur 390 px et 1280 px de large, sans erreur console.

Reste : rien pour ce lot. Guide des composants dans `docs/composants.html` ; DA enrichie « Asimov » (voir `CLAUDE.md`). Rubriques et `units` de progression à renseigner dans `assets/data.js` aux lots suivants.

## Lot 2 — Prépa stage, jours 1 à 5 (du 23 au 27/11)
Chaque jour : plan horaire (4 à 5 h), théorie, labo faisable chez soi (Hyper-V, VM Windows 11 / Windows Server, Jira Service Management gratuit jusqu'à 3 agents), mises en situation avec réponse cachée, quiz corrigé, fiche mémo, questions pour le tuteur.
- [x] J1 Métier de service desk : ITIL (incident, demande, problème, changement), priorité = impact × urgence, SLA, cycle de vie d'un ticket, escalade, N1 à N4. (Base : jour 1 de la branche `brouillon-prepa`.)
- [x] J2 Téléphone : accueil, questionnement, reformulation, utilisateur difficile, vérification d'identité, ingénierie sociale, clôture.
- [x] J3 Jira : anatomie d'un ticket, statuts, bien rédiger, commentaires internes/publics, base de connaissances.
- [x] J4 Windows 10/11 côté poste : outils de diagnostic, profils, mises à jour, sfc/DISM, WinRE.
- [x] J5 Réseau côté utilisateur : ipconfig, DHCP/APIPA, DNS, ping/tracert/nslookup, eduroam, lecteurs réseau, imprimantes.

Reste : rien pour ce lot. Pages `stage/j1.html` à `j5.html`, quiz dans `assets/prepa.js` (à compléter avec `stage-j6` à `stage-j10` au lot 3) ; les `units` `stage-j1` à `stage-j10` sont déjà dans `assets/data.js`. Points « à vérifier sur place » regroupés en fin de page (questions pour le tuteur).

## Lot 3 — Prépa stage, jours 6 à 10 (du 30/11 au 4/12)
- [x] J6 Active Directory côté support : réinitialiser un mot de passe, déverrouiller un compte, groupes, OU, GPO (gpupdate, gpresult), PowerShell en lecture.
- [x] J7 Messagerie et Microsoft 365 : Outlook (profil, OST, boîte partagée), Teams, OneDrive, MFA.
- [x] J8 Dépannage à distance et méthode : Assistance rapide, RDP, consentement, méthode de diagnostic, incident de sécurité.
- [x] J9 Matériel et PC : composants, BIOS/UEFI, Secure Boot, TPM, BitLocker, déploiement et intégration au domaine, salles informatiques, réception des colis et inventaire.
- [x] J10 Révision : 10 appels simulés de bout en bout, quiz final, check-list du premier jour.
- [x] Page « Boîte à outils » : commandes, phrases utiles au téléphone, modèle de ticket.

Reste : rien pour ce lot. Pages `stage/j6.html` à `j10.html` et `stage/outils.html`, quiz `stage-j6` à `stage-j10` dans `assets/prepa.js`. Pas de `units` pour la boîte à outils ; le lien vers elle est dans `stage/index.html` et `j10.html`.

## Lot 4 — Atelier hardware : moteur et premier scénario
- [x] Scène 2,5D en SVG/CSS (boîtier avec angles de vue, zoom sur la carte mère), au doigt (toucher la pièce puis l'emplacement) et à la souris (glisser-déposer).
- [x] Pièces réalistes : boîtier, carte mère (socket, DIMM, M.2, PCIe, 24 broches, EPS, ventilateurs, façade), CPU, ventirad, pâte, RAM, SSD M.2/SATA, GPU, alimentation et câbles, ventilateurs, entretoises, cache I/O.
- [x] Moteur de règles : compatibilité (socket, DDR4/DDR5, format, puissance et connecteurs, M.2), ordre des étapes (entretoises et cache I/O avant la carte mère, pâte avant le ventirad, RAM en A2/B2, EPS branché), simulation du POST (OK, rien ne s'allume, ventilateurs sans image, LED de debug, bips, surchauffe, pas de disque de démarrage) avec l'explication.
- [x] Scénario 1 « PC bureautique Intel » en mode apprentissage (guidé, indices, explications).

Reste : rien pour ce lot. Moteur dans `assets/atelier-regles.js` (modes `apprentissage` et `test` déjà gérés : le lot 5 branche le mode test, ajoute des scénarios dans `assets/atelier-data.js` et d'autres dispositions de boîtier ; le lot 6 réutilise `simulerPOST` pour les pannes). Page `atelier/montage.html?s=bureautique-intel`, unité de progression `atelier-s1`.

## Lot 5 — Atelier : scénarios et évaluation
- [x] Scénarios : PC de salle informatique, gamer AMD, station de travail, mini-ITX, mise à niveau. Inventaire avec de mauvais choix.
- [x] Modes test (sans aide, noté) et évaluation finale (scénarios enchaînés, rapport avec les points à revoir et des liens vers les modules).

Reste : les liens « à revoir » pointent vers `stage/j9.html` et vers `modules/index.html` (à remplacer par les vrais modules au lot 7). Scénarios dans `assets/atelier-scenarios.js` (`?s=<id>`, `&m=test` pour le test), évaluation dans `atelier/evaluation.html` (4 scénarios, seuil 75). `atelier-s2` à `atelier-s6` et `atelier-eval` sont les `units`. Le moteur gère déjà `depart` (état initial) et `retire` pour le lot 6 (pannes).

## Lot 6 — Atelier : pannes
- [x] PC en panne avec symptômes ; inspecter (visuel, LED, bips, test de l'alimentation, pièce témoin, BIOS), diagnostiquer, remplacer.
- [x] Pannes : RAM, alimentation, EPS oublié, pâte ou ventirad, GPU, disque, pile CMOS, BIOS incompatible, court-circuit d'entretoise, nappes de façade, surchauffe.
- [x] Modes apprentissage, test et évaluation.

Reste : rien pour ce lot. 14 dossiers dans `assets/atelier-pannes-data.js` (données), `assets/atelier-pannes-regles.js` (règles, testables sous Node, réutilisent `simulerPOST`) et `assets/atelier-pannes.js` (interface) ; pages `atelier/pannes.html` (catalogue, `?p=<id>`, `&m=test`) et `atelier/pannes-eval.html` (5 dossiers tirés au sort, seuil 75). `units` `atelier-pannes` (les 14 résolus) et `atelier-pannes-eval`. Les liens « à revoir » pointent vers `stage/j8.html#methode`, `j9.html` et `modules/index.html` (à remplacer au lot 7). Mesures et pièces génériques : à ne pas présenter comme des valeurs constructeur.

## Lot 7 — Thèmes et premiers modules
- [x] `themes.html` : les thèmes des notes, retravaillés et réorganisés par domaine, avec des liens vers les modules.
- [x] Gabarit de module et catalogue en données (domaine, niveau, prérequis, durée), recherche et filtres.
- [x] Premiers modules utiles au stage : support poste Windows, ITIL, réseau de base, Active Directory pour le support.

Reste : rien pour ce lot. Catalogue dans `assets/modules.js` (source unique : domaines, niveaux, modules), rendu par `assets/modules-ui.js` (catalogue filtrable `modules/index.html?domaine=…&q=…`, en-tête et suite de chaque module, page des thèmes), quiz dans `assets/modules-quiz.js`, gabarit dans `docs/gabarit-module.html`. Modules `support-windows`, `itil`, `reseau-base`, `ad-support` (`units` `module-<id>`). Liens « à revoir » de l'atelier : `A.moduleRevoir` dans `atelier-scenarios.js` (le matériel renvoie vers `support-windows` en attendant un module Matériel).
Choix par défaut : les 9 domaines de `themes.html` regroupent les 5 parcours des notes (réseau et Linux, Windows, téléphonie, virtualisation/sécurité, cloud/supervision/méthode) sans copier leur contenu ; les sujets non écrits sont marqués « à venir » ; le catalogue ne liste que les modules existants ; durées en minutes = estimations ; niveau 1 à 3 ; prérequis = modules seulement (la prépa est en « approfondit »). Travail fait sur la branche de session, pas sur `lot-7`.

## Lot 8 — Refonte : socle commun
Lire `docs/REFONTE.md` (§ 1) avant de commencer ; la maquette de référence y est liée.
- [x] Réécrire `assets/style.css` en une seule couche (jetons, typographie, composants) ; supprimer les couches « Asimov » et « chaleureuse ».
- [x] En-tête et pied de page dans `assets/app.js` : logo tampon incliné (corriger l'espace de « Apprentissage IT »), menu sans numéros, bouton de recherche (inactif jusqu'au lot 9), bouton de thème en icône.
- [x] Encadrés ramenés à trois niveaux, boutons sans capitales, tableaux et `<details>` restylés ; mettre à jour `docs/composants.html`.
- [x] Mettre à jour la section « Direction artistique » de `CLAUDE.md` : renvoyer vers `docs/REFONTE.md`, retirer la mention du skin Asimov.
- [x] Vérifier toutes les pages existantes en 390 et 1280 px, clair et sombre, sans erreur console.

Reste : rien pour ce lot. Recherche de l'en-tête inactive (`aria-disabled`) tant que `window.IT_RECHERCHE` n'existe pas (lot 9) ; les h2 « N. Titre » deviennent « §N » par `app.js` ; audit `outils/verif.mjs` (Playwright, `node_modules` lié localement, ignoré par Git) ; atelier, modules et thèmes gardent un style provisoire jusqu'aux lots 11–12.

## Lot 9 — Refonte : accueil et recherche
- [x] `index.html` en tableau de mission : jour du jour calculé, reprise (`it.reprise`), carte-ticket du décompte, frise du 23/11 au 7/12, 4 cartes de rubriques, « Comment on apprend ici » (`REFONTE.md` § 2.1).
- [x] Recherche rapide (`/`, Ctrl+K, bouton) avec index `assets/recherche.js` et page de contrôle des ancres dans `docs/` (§ 2.3).

Reste : rien pour ce lot. Jours de la prépa dans `IT_DATA.stage.jours` (`assets/data.js`), accueil rendu par `assets/accueil.js` (date forçable par `?date=AAAA-MM-JJ` pour tester) ; index `assets/recherche.js` **généré** par `node outils/index-recherche.mjs` (à relancer après tout ajout de page ou de section), chargé par `app.js` à la première ouverture ; contrôle des ancres dans `docs/recherche.html` (via un serveur) et dans `outils/verif.mjs`. `it.reprise` est écrit par `app.js` sur les pages de jour.

## Lot 10 — Refonte : pages de jour
- [x] Mise en page 3 colonnes et tiroirs mobiles, sommaire actif, barre de lecture, `§N` dans les h2 (§ 2.2) — par le CSS et `app.js`, en touchant le moins possible au HTML des jours.
- [x] Minuteur de séance (`it.seance.jN`), pastille flottante sur mobile.
- [x] Mises en situation en tickets, matrice interactive du J1, clôture du jour avec tampon RÉSOLU.
- [x] Fiche mémo imprimable (`@media print`, § 2.4) ; tester l'aperçu d'impression du J1.

Reste : rien pour ce lot. Tout est dans `assets/jour.js` (ajouté aux dix pages, contenu HTML inchangé) : colonnes et tiroirs (< 1100 px : sommaire depuis l'en-tête, jours depuis le fil d'Ariane), minuteur `it.seance.jN` (durées lues dans `.plan-horaire .h`), matrice générée depuis le tableau impact × urgence, tickets `CAS-0N` (et `APPEL-0N` au J10), clôture `done.stage-jN` + `it.cloture.jN` (date du tampon), fiche A4 construite depuis la section `#memo` (aperçu d'impression du J1 vérifié : une page). Le J10 n'a pas de fiche mémo : l'impression y reste celle de la page. Sur mobile, le bouton de thème passe dans le menu.

## Lot 11 — Refonte : modules et thèmes
- [x] `modules/index.html` : parcours conseillé généré, filtres en puces, cartes avec jauge de niveau (§ 2.5) ; restyler l'en-tête des pages de module.
- [x] `themes.html` en atlas : tuiles à pastilles, panneau du domaine, `?domaine=` (§ 2.6).

Reste : rien pour ce lot. `assets/modules-ui.js` génère le parcours (`prerequis` = trait plein, `suite` = pointillé), les puces (domaines ayant des modules, `?domaine=` et `?q=` lus), les cartes à jauge, la fiche d'en-tête des modules et l'atlas (`?domaine=` mis à jour par `history.replaceState`) ; pastille STAGE = champ `stage: true` des domaines dans `assets/modules.js`. Filtres niveau et progression retirés (non prévus par la refonte) ; le compteur indique les modules terminés.

## Lot 12 — Refonte : atelier « Le Livre du montage »
- [x] Habillage livre commun (bureau, double page, titres courants, lettrines, notes en marge, folios, page qui tourne, version mobile) — `REFONTE.md` § 3.1. Le moteur de l'atelier ne change pas.
- [x] Frontispice et table des matières (`atelier/index.html`).
- [x] Planches gravées : restyler `assets/atelier-art.js` (traits, hachures, lettres et légende cliquable) et le bac.
- [x] Observations de pannes (examen en marge, diagnostic, rabat), évaluations et bilan imprimable, index final.

Reste : rien pour ce lot. Règles inchangées ; seul l'affichage a bougé : `atelier.js` construit la double page (cahier des charges = première double page, notes en marge, lettres et légende de la planche, folios, page qui tourne), `atelier-pannes.js` les « Observations » (examen à cocher, observations en marge, diagnostic ✓/✗, rabat), `atelier-art.js` remplace les dégradés par des hachures (les aplats sombres sont regravés par le CSS `.livre .at-svg`), `atelier-index.js` génère table des matières et index. Les liens « étape précédente / suivante » des folios sont des titres non cliquables (le moteur avance par la réussite des étapes). Bilan des évaluations imprimable (bouton « Imprimer le bilan »). Correction au passage : un reste de commentaire cassait `#atelier [hidden]` depuis le lot 8.

## Lot 13 — Vérification finale et peaufinage
- [x] 13.1 Audit complet : serveur et file://, quatre largeurs, deux thèmes, corrections et captures.
  Fait : audit GitHub Actions, 27 pages × 4 largeurs × 2 thèmes sur serveur et en file://, zéro problème et avertissement ; six captures conservées.
- [ ] 13.2 Accessibilité : contrastes, clavier, ARIA, titres et mouvement réduit.
- [ ] 13.3 Fonctionnel : progression, quiz, minuteur, recherche, modules et atelier, serveur et file://.
- [ ] 13.4 Impression : fiches mémo J1 à J9 et bilan de l’atelier en A4 ; justification pour J10.
- [ ] 13.5 Conformité : contrôle de chaque point de la refonte et justification des écarts.
- [ ] 13.6 Peaufinage : page 404, favicon, métadonnées et états vides.
- [ ] 13.7 Ménage : code mort, documentation, index et audit final.
- [ ] 13.8 Rapport final, fusion et livraison.

## Ensuite
Un module par lot, en commençant par les besoins du stage. Ajouter ici les nouveaux lots au fil de l'eau.
