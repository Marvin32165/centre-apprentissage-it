# Plan de travail

## Rapport final de la refonte (lots 8 à 13)
**Fait.** Socle « Poste de garde » en une seule feuille de style (jetons, typographie, encadrés à trois niveaux, en-tête sombre au logo tampon) ; accueil en tableau de mission (jour du jour, reprise, ticket-décompte, frise) ; recherche rapide (`/`, Ctrl+K, 221 entrées) ; pages de jour en trois colonnes avec tiroirs, minuteur, matrice, tickets, tampon RÉSOLU et fiche mémo A4 ; modules (parcours, puces, jauges) et atlas des thèmes ; atelier « Le Livre du montage » (double page, notes en marge, planches gravées, observations, table des matières et index) ; 404, favicon, Open Graph. Contrôles : `npm run controles` = 28 pages × 4 largeurs × 2 thèmes, serveur et `file://`, 0 problème, plus clavier, contrastes AA, parcours et impression.

**Captures clés.** [Accueil](captures/accueil-clair.jpg) · [Accueil mobile sombre](captures/accueil-mobile-sombre.jpg) · [Jour 1](captures/jour-1.jpg) · [Jour 1 mobile](captures/jour-1-mobile.jpg) · [Modules](captures/modules.jpg) · [Atelier](captures/atelier.jpg).

**À vérifier sur place (UMONS).** 66 questions pour le tuteur : 48 dans la prépa (encadré ambre en fin de chaque jour J1 à J9, imprimé sur la fiche mémo, rappel au J10) et 18 dans les modules ; s’y ajoutent les étiquettes « À l’UMONS » en ligne (canaux et horaires du service desk, matrice de priorité et SLA Jira, équipes d’escalade, procédures de sécurité, vérification d’identité, outils de prise en main à distance, déploiement et inventaire).

**Idées pour la suite.** Module « Matériel et PC » : fait au lot 14 ; modules Microsoft 365 et dépannage à distance ; export/import de la progression `it.*` (fichier) pour changer d’appareil ; mode révision express (fiches mémo seules) pour la semaine du stage ; après le 7/12, un journal de stage privé hors de ce dépôt public.

Un lot = une session d'agent (Claude Code ou ChatGPT / Codex, nouvelle conversation). Règles communes : `AGENTS.md`. Lancer avec :
`Lis AGENTS.md et docs/PLAN.md, puis fais le lot N.`
Si un lot est coupé par la limite d'utilisation : `Lis AGENTS.md et docs/PLAN.md, et reprends le lot N à la première sous-étape non cochée (branche lot-N).`

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
- [x] 13.2 Accessibilité : contrastes, clavier, ARIA, titres et mouvement réduit.
  Fait : `npm run accessibilite` (focus visible, tiroirs et retour du focus, recherche au clavier, mouvement réduit, commandes de l’atelier, références ARIA de toutes les pages) et `npm run contrastes` (0 couple sous AA), clair et sombre.
  Fait partiellement : contrastes des textes visibles au chargement contrôlés, bouton de l’atelier corrigé ; recherche, tiroirs et premiers parcours clavier vérifiés ; compléter ARIA et atelier avant de cocher.
- [x] 13.3 Fonctionnel : progression, quiz, minuteur, recherche, modules et atelier, serveur et file://.
  Fait : `npm run parcours` en serveur et en file:// (progression et tampon, minuteur et reprise, quiz, chaque destination de la recherche, filtres, atlas, montage guidé, mode test, dossier de panne, deux évaluations) : 0 échec ; test du tampon rendu robuste au rechargement.
  Fait partiellement : progression, quiz, minuteur, filtres, atlas et montage guidé testés dans les deux modes ; compléter la recherche, le mode test et les évaluations.
- [x] 13.4 Impression : fiches mémo J1 à J9 et bilan de l’atelier en A4 ; justification pour J10.
  Fait : J1 à J9 sur une page A4 chacun, bilans des deux évaluations en A4 (contrôlés par `npm run parcours`).
  Fait partiellement : J1 à J9 tiennent chacun sur une page A4 dans les deux modes. Justifié : J10 est une révision et ne contient pas de section fiche mémo.
- [x] 13.5 Conformité : contrôle de chaque point de la refonte et justification des écarts.
  Fait : relecture de REFONTE.md ; ajout de l’anneau SVG de progression sur les cartes de l’accueil (§ 1, Progression). Justifié aussi : l’atelier garde le site en clair/sombre autour du livre (seul le bureau fonce).
  Justifié : les folios « étape précédente / suivante » restent des titres non cliquables ; le moteur avance par la réussite des étapes.
  Justifié : la règle universelle `prefers-reduced-motion` utilise `!important` pour neutraliser toutes les animations et transitions.
  Justifié : les filtres « niveau » et « progression » ont été retirés conformément aux filtres par domaine prévus par la refonte.
  Justifié : l’index de recherche est généré depuis les contenus plutôt qu’écrit à la main pour limiter les ancres périmées, sans fetch local.
- [x] 13.6 Peaufinage : page 404, favicon, métadonnées et états vides.
  Fait : 404.html (avec polices), favicon `assets/favicon.svg`, Open Graph sur toutes les pages. Annulé : le retrait des polices Google (contraire à la DA) et la règle CSS qui transformait tous les liens en boîtes de 44 px (cartes centrées, mots coupés) ; l’audit exempte de nouveau les liens dans une phrase (WCAG 2.5.8).
- [x] 13.7 Ménage : code mort, documentation, index et audit final.
  Fait : CSS mort retiré (`.grid.cols-3`), `docs/composants.html` complété (tickets, tampon, livre), règles communes déplacées dans `AGENTS.md` (Claude Code et ChatGPT), `package.json` des outils (`npm run controles`), scripts renommés sans « lot-13 », workflow `audit.yml` sur toutes les branches `lot-*`, index régénéré, captures refaites.
- [x] 13.8 Rapport final, fusion et livraison.
  Fait : rapport en tête de ce fichier, fusion dans `main`.

Reste : rien pour ce lot. Prochaine étape : un module par lot (voir « Ensuite »).

## Lot 14 — Module « Matériel et PC »
- [x] 14.1 Page `modules/materiel-pc.html` : identifier un poste, compatibilité, POST, mémoire, stockage, alimentation, refroidissement, connectique, diagnostic constructeur ; labo, mises en situation, fiche mémo, questions pour le tuteur.
  Fait : 9 sections sourcées (Microsoft Learn, JEDEC, PCI-SIG, USB-IF, VESA, constructeurs), labo « carte d'identité de ta machine », 4 cas, 6 questions pour le tuteur ; bips, LED et touches de diagnostic renvoyés au manuel du modèle (rien d'inventé).
- [x] 14.2 Données : entrée dans `assets/modules.js`, quiz `module-materiel-pc`, unité dans `data.js`, liens « à revoir » de l'atelier (`A.moduleRevoir`) vers les sections du module.
  Fait : module niveau 1 (≈ 3 h 30) dans le domaine Matériel, désormais marqué « stage » (installation et intégration de PC) ; quiz de 6 questions ; chaque thème « à revoir » des montages et des pannes pointe vers sa section (`#compatibilite`, `#memoire`, `#stockage`, `#alimentation`, `#refroidissement`, `#connectique`, `#post`) ; la méthode reste sur « Support poste Windows ».
- [x] 14.3 Index de recherche, `npm run controles`, fusion dans `main`.
  Fait : index régénéré (236 entrées) ; `npm run controles` = 29 pages × 4 largeurs × 2 thèmes, serveur et `file://`, 0 problème, 0 avertissement ; accessibilité, contrastes et parcours sans échec.

Reste : rien pour ce lot. Prochaine étape suggérée : module « Microsoft 365 et messagerie » ou « Dépannage à distance » (domaine Support).

## Lot 15 — Outillage commun des agents (Claude Code et ChatGPT / Codex)
Idées reprises du dépôt `claude-tools` (chef, evidence-reviewer, hooks, skills), adaptées pour marcher avec les deux agents : procédures en Markdown, garde-fous en script Node et en CI, enveloppes propres à Claude Code en option.
- [x] 15.1 Procédures communes dans `docs/procedures/` : nouveau module, relecture des sources, test en situation (« chef ») ; renvoi depuis `AGENTS.md`.
  Fait : trois procédures (critères de « fini » vérifiables, tableau de verdicts, trois tours au plus) ; `AGENTS.md` y renvoie, avec deux prompts types et la règle de relecture croisée entre les deux outils.
- [x] 15.2 Garde-fous `npm run garde` (moteurs de l'atelier, index à jour, ressources externes, `alert`/`confirm`/`fetch`, IP et adresses e-mail), ajouté à `controles` et à `audit.yml`.
  Fait : `outils/garde.mjs` (sans navigateur, < 1 s) contrôle les moteurs depuis `main` (sauf ligne « Moteur autorisé : … »), l'index (`index-recherche.mjs --verifier`), Google Fonts seul en externe et présent sur chaque page, `alert`/`confirm`/`prompt`/`fetch`, clés `it.`, IP publiques, e-mails réels et secrets ; 0 problème sur le site, 6 violations volontaires toutes détectées ; ajouté à `controles` et à `audit.yml` (historique complet pour comparer à `main`).
- [x] 15.3 Hook Git `pre-commit` facultatif (`npm run hooks`) : garde-fous avant chaque commit, quel que soit l'agent.
  Fait : `outils/hooks/pre-commit` lance `garde` à chaque commit, et l'audit 390/1280 px si une page ou `assets/` change et que Playwright est installé ; `npm run hooks` l'active (`core.hooksPath`, une fois par clone) ; `--no-verify` réservé aux urgences, à signaler dans le plan.
- [x] 15.4 Enveloppes Claude Code dans `.claude/` : skills qui renvoient aux procédures, agents relecteurs, hook de protection des fichiers et rappel du plan après compaction.
  Fait : skills `/nouveau-module`, `/relecture-sources`, `/test-chef` (en-tête au standard Agent Skills) et agents `relecteur-sources`, `chef`, qui renvoient tous à `docs/procedures/` ; hooks en Node (pas de jq, marche sous Windows) : blocage des moteurs, de `recherche.js`, de `node_modules`/`.git` et de tout fichier hors du dépôt, refus d'arrêt si `garde` échoue, rappel du lot en cours après compaction ; testés à la main (4 cas de blocage, arrêt, rappel).
- [x] 15.5 `npm run controles`, coche du lot, fusion dans `main`.
  Fait : `npm run controles` = 0 problème, 0 avertissement, 0 échec (29 pages, serveur et `file://`, garde-fous compris) ; fusion dans `main` avec l'accord de Marvin. Justifié : le lot a été poussé sur la branche de session `claude/exciting-newton-tg7h18` (pousser `lot-15` était refusé à la session), et non sur `lot-15`.

Reste : rien pour ce lot ; une fois par clone, `npm run hooks`. Prochain lot conseillé : module « Dépannage à distance » avec `/nouveau-module` (ou la procédure dans ChatGPT), relu par l'autre outil.

## Ensuite — plan des lots 16 à 25
Rédigé le 24/11/2026. Un lot = une conversation. Ordre fixé par l'échéance du **7/12** : les lots 16 à 20 passent avant le stage, les suivants pendant (le site sert alors de référence au poste).

**Règle de croisement** : tout le contenu actuel a été écrit par Claude, il est donc relu par ChatGPT (lots 16, 17, 21). Pour un nouveau module, un outil l'écrit et l'autre le relit (étape N.3 de `docs/procedures/nouveau-module.md`). Les relectures sont écrites dans `docs/relectures/<page>.md` pour que l'autre outil les retrouve.

**Modèle et effort.** Côté ChatGPT / Codex, prends le modèle de raisonnement le plus récent que propose le sélecteur (le guide d'OpenAI conseillait `gpt-5.5` en novembre 2026, à vérifier) et règle l'effort de raisonnement (`low` · `medium` · `high` · `xhigh` selon le modèle). La relecture des sources demande la **recherche web activée**. Côté Claude Code : Opus pour le contenu et les relectures, Sonnet suffit pour l'interface. Les durées sont des estimations.

| Lot | Contenu | Avant le 7/12 | Qui fait | Effort | Taille |
|---|---|---|---|---|---|
| 16 | Relecture des faits, prépa J1 à J5 | oui | ChatGPT relit (web), Claude corrige | `high` | 2 conversations |
| 17 | Relecture des faits, prépa J6 à J10 + boîte à outils | oui | ChatGPT relit (web), Claude corrige | `high` | 2 conversations |
| 18 | Module « Dépannage à distance » | oui | l'un écrit, l'autre relit | `high` (rédaction), `xhigh` si disponible pour la relecture | 2 à 3 |
| 19 | Révision express + export / import de la progression | oui | ChatGPT / Codex | `medium` | 1 |
| 20 | Module « Microsoft 365 et messagerie » | si le temps le permet | l'un écrit, l'autre relit | `high` | 2 à 3 |
| 21 | Relecture des 5 modules existants | non | ChatGPT relit, Claude corrige | `high` | 2 |
| 22 | Entraînement aux tickets (qualifier, prioriser, rédiger) | non | ChatGPT / Codex | `medium` (JS), `high` (cas) | 1 à 2 |
| 23 | Module « Imprimantes et périphériques » | non | l'un écrit, l'autre relit | `high` | 2 |
| 24 | Module « Sous-réseaux et plan d'adressage » | non | l'un écrit, l'autre relit | `high` | 2 |
| 25 | Retour du terrain : mise à jour des « à vérifier sur place » | après le 18/12 | Marvin dicte, n'importe quel agent | `low` | 1 |

Les tests en situation (`docs/procedures/test-chef.md`) coûtent cher : un seul par lot de contenu, sur la page principale.

**File d'attente (mise à jour le 25/11 au soir)** — faits et fusionnés : lots 16 à 24 et 26 à 28 (relectures, corrections, tests en situation des modules). Lot 21 corrigé et fusionné le 25/11. Calendrier ramené à une semaine (lot 27). Labos sans machine virtuelle (lot 28). Lots 29 à 33 (esthétique) faits et fusionnés le 26/11. À faire : lot 34 (glossaire) si possible avant le 7/12, puis lots 35 à 39 (modules pour la suite du stage) et lot 25 après le 18/12. Ancienne file, pour mémoire :
1. ChatGPT (Astra, effort `high`, recherche web) : **17.1** relire J6 à J10 et la boîte à outils.
2. ChatGPT : relire les quatre nouveaux modules — **18.3** `modules/depannage-distance.html`, **20.3** `modules/m365-messagerie.html`, **23.3** `modules/imprimantes-peripheriques.html`, **24.3** `modules/sous-reseaux.html` — et les 12 appels de `assets/tickets-data.js` (lot 22) ; un rapport par page dans `docs/relectures/`.
3. Claude Code : corriger d'après ces rapports, puis contrôles et coche (17.2–17.3, 18.4, 20.4, 23.4, 24.4).
4. Lot 21 (ChatGPT relit les 5 premiers modules), puis lot 25 après le 18/12.

**Nouveau calendrier (25/11)** : une semaine, du lundi 30/11 au dimanche 6/12, week-end compris (lot 27), qui remplace le paragraphe suivant. **Changement de rythme (24/11)** : à partir du mercredi 25/11, séances de 3 à 4 h par jour en semaine seulement. Le lot 26 fixe le calendrier des huit séances et précise le programme des deux séances doubles.

## Lots 34 à 39 — Après la prépa : glossaire et modules pour la suite du stage
Rédigé le 26/11/2026, à la demande de Marvin. But : accompagner la deuxième période du stage (janvier à février 2027 : maintenance avec le pôle opération, projets avec les experts N4) et les questions du quotidien. Chaque module suit `docs/procedures/nouveau-module.md` (sous-étapes N.1 page, N.2 données, N.3 relecture croisée puis test en situation, N.4 contrôles et fusion) ; labos **sans machine virtuelle** ; rien sur l'UMONS sans « à vérifier sur place ».

**Règle de croisement** : l'outil qui écrit ne relit pas. Par défaut, Claude Code écrit et Codex / ChatGPT relit les faits (`relecture-sources.md`, recherche web activée) et fait le test en situation (`test-chef.md`) ; on peut inverser lot par lot, en l'indiquant sous le lot.

| Lot | Contenu | Pour quand | Écrit | Relit et teste | Effort |
|---|---|---|---|---|---|
| 34 | Glossaire français-anglais du service desk | avant le 7/12 si possible | Claude Code | Codex | `medium` |
| 35 | Module « Sécurité du poste » | décembre | Claude Code | Codex | `high` |
| 36 | Module « Jira Service Management au quotidien » | décembre | Codex | Claude Code | `high` |
| 37 | Module « Déploiement et gestion des postes » | janvier | Claude Code | Codex | `high` |
| 38 | Module « Sauvegarde et restauration » | janvier | Codex | Claude Code | `high` |
| 39 | Module « Bases de Linux pour le support » | février | Claude Code | Codex | `high` |

### Relectures et contrôles de la branche `chatgpt-27-11`

- [x] Relire les corrections de J6, J7 et Active Directory pour le support, quiz compris.
  Fait : trois rapports `relecture2-*.md` dans `docs/relectures/` ; 56 corrects, 10 faux, 28 non vérifiés. Corrections réservées à une autre conversation.

## Lot 34 — Glossaire français-anglais du service desk
Une page `stage/glossaire.html` : les termes que l'on croise en anglais dans Jira, Microsoft 365, Windows et ITIL, avec leur équivalent français, une définition d'une ligne, la page du site qui l'explique et la source officielle. Recherche intégrée (index), tri alphabétique, filtre par domaine, lisible au téléphone.
- [ ] 34.1 Liste des termes (au moins 80) tirée **des pages du site** (incident, problem, known error, workaround, SLA, queue, assignee, escalation, Full Access, Send As, Send on Behalf, lease, gateway, OU, GPO, recovery key, safe mode…) ; données dans `assets/glossaire.js` ; chaque terme renvoie à sa section du site et à une source officielle.
- [ ] 34.2 Page `stage/glossaire.html` (filtre par domaine, recherche locale, ancre par terme), liens depuis `stage/index.html`, la boîte à outils et le pied des pages de jour ; `npm run index`.
- [ ] 34.3 Relecture croisée par Codex (rapport `docs/relectures/glossaire.md`) ; corrections dans une autre conversation.
- [ ] 34.4 `npm run controles`, coche, fusion.

## Lot 35 — Module « Sécurité du poste »
Domaine Sécurité. Pistes, chacune à sourcer (Microsoft Learn, CISA, Centre pour la cybersécurité Belgique) : reconnaître un hameçonnage et le signaler, Microsoft Defender (état, analyse, quarantaine, sans désactiver), mises à jour et redémarrages, compte compromis (que faire, dans quel ordre), clé USB inconnue, données sensibles et verrouillage du poste. Labo sur son propre PC en lecture (état de Defender, historique de protection, `Get-MpComputerStatus`), mises en situation, quiz. Procédure de sécurité de l'UMONS : « à vérifier sur place ».
- [ ] 35.1 Page `modules/securite-poste.html`.
- [ ] 35.2 Données : `modules.js` (retirer de `aVenir` si présent), quiz `module-securite-poste`, unité, index.
- [ ] 35.3 Relecture croisée par Codex (`docs/relectures/module-securite-poste.md`), puis test en situation ; corrections dans une autre conversation.
- [ ] 35.4 `npm run controles`, coche, fusion.

## Lot 36 — Module « Jira Service Management au quotidien »
Domaine Gestion. Approfondit le J3 : files et filtres, SLA (lire un compteur, pause, objectifs), liens entre tickets, commentaires internes et réponses au client, base de connaissances, macros et réponses types, automatisations simples (lecture), bonnes pratiques de rédaction. Sources : documentation Atlassian. Labo sur une instance Jira Service Management gratuite (si Marvin en crée une) ou sur papier. Configuration de Jira à l'UMONS : « à vérifier sur place ».
- [ ] 36.1 Page `modules/jira-quotidien.html` (rédigée par Codex).
- [ ] 36.2 Données : `modules.js`, quiz `module-jira-quotidien`, unité, index.
- [ ] 36.3 Relecture croisée par Claude Code (`docs/relectures/module-jira-quotidien.md`), puis test en situation ; corrections dans une autre conversation.
- [ ] 36.4 `npm run controles`, coche, fusion.

## Lot 37 — Module « Déploiement et gestion des postes »
Domaine Matériel (ou Windows). Pistes : cycle de vie d'un poste (réception, inventaire, préparation, remise, retrait et effacement), image de référence et installation automatisée, Windows Autopilot et Intune en principe (sources Microsoft Learn), jonction au domaine ou à Entra ID, applications déployées, nommage et inventaire. Labo sans VM : lire l'état de gestion de son PC (`dsregcmd /status`, Paramètres → Comptes → Accès Professionnel ou Scolaire), exercice d'inventaire et de préparation sur papier. Outils de l'UMONS : « à vérifier sur place ».
- [ ] 37.1 Page `modules/deploiement-postes.html`.
- [ ] 37.2 Données : `modules.js`, quiz `module-deploiement-postes`, unité, index.
- [ ] 37.3 Relecture croisée par Codex (`docs/relectures/module-deploiement-postes.md`), puis test en situation ; corrections dans une autre conversation.
- [ ] 37.4 `npm run controles`, coche, fusion.

## Lot 38 — Module « Sauvegarde et restauration »
Domaine Support. Pistes : où sont les données d'un utilisateur (profil, OneDrive, partages), versions précédentes et corbeille OneDrive, historique des fichiers, restauration d'un fichier supprimé ou écrasé, sauvegarde avant intervention (quoi, où, vérifier), règle « 3-2-1 » seulement si une source primaire l'établit. Sources : Microsoft Support et Learn. Labo sur son propre PC : restaurer une version précédente d'un fichier de test dans OneDrive. Politique de sauvegarde de l'UMONS : « à vérifier sur place ».
- [ ] 38.1 Page `modules/sauvegarde-restauration.html` (rédigée par Codex).
- [ ] 38.2 Données : `modules.js`, quiz `module-sauvegarde-restauration`, unité, index.
- [ ] 38.3 Relecture croisée par Claude Code (`docs/relectures/module-sauvegarde-restauration.md`), puis test en situation ; corrections dans une autre conversation.
- [ ] 38.4 `npm run controles`, coche, fusion.

## Lot 39 — Module « Bases de Linux pour le support »
Domaine Linux et scripts. Pistes : se connecter en SSH depuis Windows (client OpenSSH intégré), se repérer (`pwd`, `ls`, `cd`, `cat`, `less`), lire des journaux (`journalctl`), état d'un service (`systemctl status`), espace disque (`df -h`), réseau (`ip a`, `ping`), droits (`ls -l`, `sudo` : jamais sans procédure). Sources : documentation Debian, pages de manuel, Microsoft Learn pour OpenSSH. Labo sans VM : WSL seulement si Marvin peut l'installer (à vérifier : WSL 2 utilise aussi la virtualisation et de la mémoire), sinon une console Linux en ligne d'un organisme officiel, ou sur papier avec des sorties décrites par la documentation. Serveurs de l'UMONS : « à vérifier sur place ».
- [ ] 39.1 Page `modules/linux-support.html`.
- [ ] 39.2 Données : `modules.js` (retirer de `aVenir` du domaine Linux), quiz `module-linux-support`, unité, index.
- [ ] 39.3 Relecture croisée par Codex (`docs/relectures/module-linux-support.md`), puis test en situation ; corrections dans une autre conversation.
- [ ] 39.4 `npm run controles`, coche, fusion.

**Prompts types** : Claude Code ou Codex qui écrit : « Lis AGENTS.md et docs/PLAN.md, puis fais le lot 35 jusqu'à 35.2. » ; l'autre outil pour relire : « Lis docs/procedures/relecture-sources.md et relis modules/securite-poste.html. » ; puis « Lis docs/procedures/test-chef.md et teste modules/securite-poste.html, usage : <usage concret>. »

## Lots 29 à 33 — Rendre le site beaucoup plus beau
Demande de Marvin (26/11) : cinq lots pour **améliorer l'esthétique à fond**, à partager entre Claude Code et Codex. Ce ne sont pas des corrections : on enrichit l'identité « Poste de garde » sans la trahir.

**Cadre commun aux cinq lots**
- La DA d'`AGENTS.md` ne bouge pas : couleurs, polices (et le lien Google Fonts), barre sombre, AA, cibles ≥ 44 px, `prefers-reduced-motion`. On gagne en beauté par la **composition, l'illustration, le détail et le mouvement**, pas par de nouvelles couleurs. Une teinte dérivée (transparence d'une couleur existante) est permise si elle passe `npm run contrastes`.
- Rien d'inventé dans le contenu : un schéma ne montre que ce que dit la section et sa source.
- Chaque lot ajoute sa section à `docs/REFONTE.md` (qui fait foi) et ses composants à `docs/composants.html`, et range son CSS dans **une section délimitée** de `assets/style.css` (`/* ===== Lot N : … ===== */`) pour limiter les conflits entre agents.
- Avant et après : une capture 1280 px clair et une 390 px sombre des pages touchées dans `docs/captures/lot-N/`. Une seule vérification visuelle par lot, puis `npm run controles`.
- Répartition conseillée : **29 → 30 et 32 en parallèle → 31 → 33**. Deux agents ne travaillent jamais sur le même lot ; s'ils travaillent en même temps, chacun sur sa branche `lot-N`, et celui qui fusionne en second résout les conflits de `style.css` dans sa propre section.

| Lot | Thème | Qui | Effort |
|---|---|---|---|
| 29 | Typographie et mise en page éditoriale | Claude Code | `high` |
| 30 | Schémas et illustrations SVG maison | Claude Code (rédaction), Codex relit les faits | `high` |
| 31 | Pages d'entrée « couverture » | Codex ou Claude Code | `high` |
| 32 | Mouvement et micro-interactions | Codex | `medium` |
| 33 | Icônes, mode sombre et finitions | Codex | `medium` |

## Lot 29 — Typographie et mise en page éditoriale
But : que chaque page de cours ait l'allure d'un beau document professionnel (une revue technique soignée), sur ordinateur comme sur téléphone.
- [x] 29.1 Échelle typographique fluide (`clamp()`) pour h1 à h4, chapeau et texte ; rythme vertical sur l'échelle de 4 px ; césure et `text-wrap: balance` sur les titres, `pretty` sur les paragraphes ; chiffres tabulaires dans les tableaux et le minuteur.
  Fait : titres fluides jusqu'à h4, `text-wrap: pretty`, césure dans le texte des cours seulement, chiffres tabulaires.
- [x] 29.2 En-tête de page de cours : kicker, grand h1 avec son mot en `<em>`, chapeau en plus grand, puis une ligne de métadonnées (durée, niveau, prérequis, sources) en mono ; même gabarit pour les jours et les modules.
  Fait : ligne de repères `dl.meta-page` sous le chapeau des jours (durée, blocs, sources, questions pour le tuteur), construite par `jour.js` ; les modules gardent leur fiche.
- [x] 29.3 Notes en marge sur ordinateur (≥ 1200 px) : les encadrés « Source officielle » et « À l'UMONS » passent dans la marge droite, à hauteur du paragraphe qu'ils concernent ; sous le texte sur mobile. Pas de JS obligatoire (grille CSS).
  Fait : `initMarge()` dans `app.js` déplace les sources et les « à l'UMONS » des modules dans la marge à partir de 1200 px, au début de leur section, et les remet en place sur écran étroit. Justifié : pas de marge sur les pages de jour, déjà en trois colonnes.
- [x] 29.4 Encadrés « Retenir » repensés en citation mise en avant (grand guillemet ou filet épais, Newsreader italique plus grand) ; « Attention » plus net ; listes à puces et numérotées dessinées (puces rouille, numéros en mono).
  Fait : « À retenir » en citation mise en avant (grand guillemet), « Attention » teinté (jeton `--red-soft`, contrastes AA), puces et numéros rouille.
- [x] 29.5 Tableaux sur mobile : sous 600 px, chaque ligne devient une carte empilée (étiquette de colonne en mono au-dessus de la valeur), sans défilement horizontal ; blocs de code avec barre de titre (langage : PowerShell, invite de commandes) et bouton copier intégré.
  Fait : tableaux en cartes sous 600 px (`initTableaux()`, sauf matrices) ; blocs de code avec barre de titre, langage déduit et bouton Copier de 44 px.
- [x] 29.6 Sommaire des modules (comme sur les jours : colonne « Sur cette page » sur ordinateur, menu repliable sur mobile) ; REFONTE, composants, captures, contrôles, coche, fusion.
  Fait : sommaire repliable des modules (`modules-ui.js`) ; REFONTE § 5.1, `docs/composants.html` § 8, captures dans `docs/captures/lot-29/` ; `npm run controles` : 0 problème, 0 avertissement, 0 échec, 0 contraste sous le seuil ; fusion dans `main`.

## Lot 30 — Schémas et illustrations SVG maison
But : remplacer les explications les plus abstraites par de **vrais schémas**, dessinés à la main en SVG dans un style « trait d'encre + aplat rouille » cohérent avec la gravure de l'atelier mais plus moderne.
- [x] 30.1 Charte des schémas dans `docs/REFONTE.md` : épaisseurs de trait, aplats, flèches, étiquettes en Instrument Sans, couleurs par `currentColor` et variables (lisibles en clair et en sombre), `role="img"` avec `<title>` et `<desc>`, texte réel dans le SVG (pas d'image de texte), largeur fluide. Un composant d'exemple dans `docs/composants.html`.
  Fait : REFONTE § 5.2 (largeur 400 en colonne, classes `s-*` sur les variables, `title`/`desc`, texte réel) ; exemple dans `docs/composants.html` § 9 ; générateur `outils/schemas.py`.
- [x] 30.2 Prépa, au moins six schémas : cycle de vie d'un ticket et matrice impact × urgence (J1), chaîne de démarrage (J4), couches et « du plus proche au plus lointain » (J5), DORA du DHCP (J5), arbre domaine-OU-groupes-GPO (J6), session d'Assistance rapide côté aidant et côté utilisateur (J8).
  Fait : cycle de vie du ticket (J1), DORA et « du plus proche au plus lointain » (J5), annuaire (J6), sept étapes (J8). Justifié : pas de schéma de la matrice (tableau déjà là) ni de session Assistance rapide (le tableau pas à pas du module la montre déjà).
- [x] 30.3 Modules, au moins six schémas : couches TCP/IP (Réseau de base), découpage d'un /24 en sous-réseaux (Sous-réseaux), AGDLP et Kerberos (AD), incident → problème → erreur connue (ITIL), boîte partagée et droits (M365), anatomie d'une carte mère (Matériel et PC).
  Fait : chaîne de démarrage, couches TCP/IP, découpage d'un /24, AGDLP, incident → problème → erreur connue, droits d'une boîte partagée, compatibilité autour de la carte mère. Justifié : pas d'anatomie de carte mère, faute de contenu correspondant dans la section ; Kerberos laissé en texte.
- [x] 30.4 Relecture des schémas par l'autre outil (`relecture-sources.md`, rapport `docs/relectures/schemas.md`) : chaque élément dessiné doit exister dans la section et sa source.
  Fait : relecture par un agent qui n'a pas dessiné les schémas, sources ouvertes : `docs/relectures/schemas.md` (2 faux, 8 non vérifiés, 22 corrects).
- [x] 30.5 Corrections, fiches mémo (un schéma clé peut entrer dans la fiche A4 en niveaux de gris), contrôles (accessibilité : `title`/`desc`, contrastes), coche, fusion.
  Fait : les 10 points traités (suivi dans le rapport), sections et encadrés complétés ; captures `docs/captures/lot-30/` ; `npm run controles` : 0 problème, 0 avertissement, 0 échec, 0 contraste sous le seuil ; fusion dans `main`. Justifié : schémas laissés hors des fiches A4, déjà pleines.

## Lot 31 — Pages d'entrée « couverture »
But : que l'arrivée sur chaque rubrique donne envie, comme la couverture d'un manuel ou la une d'une revue.
- [x] 31.1 Accueil : carte-ticket plus travaillée (perforations sur le bord, tampon « OUVERT » incliné, code-barres décoratif en CSS), frise transformée en ligne de temps avec un trait de progression, cartes des rubriques avec une petite illustration SVG chacune (charte du lot 30).
  Fait : perforations, tampon « Ouvert », code-barres décoratif, frise en ligne de temps, pictogrammes des rubriques (`IT.picto`).
- [x] 31.2 `stage/index.html` en sommaire de revue : les sept séances en grandes lignes numérotées, dates en mono, sujets en Newsreader, état (fait, aujourd'hui, à venir) et accès direct à la révision express, aux tickets et à la boîte à outils.
  Fait : programme en sommaire de revue (numéro, titre, sujets, date, durée, jour surligné) construit par `app.js`. Justifié : les accès à la révision, aux tickets et à la boîte à outils existaient déjà sous le programme.
- [x] 31.3 `modules/index.html` : un pictogramme par domaine, carte « à la une » pour le module conseillé suivant (d'après la progression), parcours conseillé redessiné en vrai graphe SVG.
  Fait : carte « Pour commencer / À suivre » d'après la progression, pictogramme du domaine sur chaque carte. Justifié : parcours conseillé gardé tel quel, déjà lisible ; pas de graphe SVG.
- [x] 31.4 `themes.html` : tuiles de l'atlas illustrées (pictogramme par domaine), panneau latéral plus éditorial ; `404.html` illustrée (un ticket « introuvable » avec tampon).
  Fait : pictogrammes dans les tuiles de l'atlas ; `404.html` avec ticket WEB-404 et tampon. Justifié : panneau latéral de l'atlas inchangé.
- [x] 31.5 Images de partage (Open Graph) par rubrique en SVG converti en PNG par un outil de contrôle (pas d'étape de build pour le site), `theme-color` clair et sombre ; REFONTE, composants, captures, contrôles, coche, fusion.
  Fait : `theme-color` réglé par `app.js` ; REFONTE § 5.3, composants § 10 ; contrôles ; fusion dans `main`. Justifié : pas d'images Open Graph, qui demandent l'adresse publique absolue du site (non vérifiée).

## Lot 32 — Mouvement et micro-interactions
But : un site qui réagit avec douceur et précision, jamais gratuitement ; tout se coupe avec `prefers-reduced-motion`.
- [x] 32.1 Transitions entre pages avec la View Transitions API (CSS `@view-transition`, amélioration progressive : rien ne casse sans), en-tête et titre qui glissent d'une page à l'autre.
  Fait : `@view-transition` entre documents, seulement sans mouvement réduit ; en-tête fixe pendant la transition.
- [x] 32.2 Apparition des sections au défilement (opacité et léger décalage, une seule fois, `IntersectionObserver`), barre de lecture plus fine et animée.
  Fait : `initApparition()` (schémas, cartes, citations, quiz, minuteur sous la ligne de flottaison). Justifié : barre de lecture laissée telle quelle, déjà fine (3 px).
- [x] 32.3 Moments forts : tampon « RÉSOLU » qui s'imprime (rotation et échelle), quiz (réponse juste : coche qui se dessine ; fausse : légère secousse ; score qui compte), minuteur avec anneau qui se vide, ouverture des corrections `<details>` animée en hauteur.
  Fait : rebond et secousse des réponses du quiz, score en grand qui compte, corrections qui s'ouvrent en hauteur. Justifié : le tampon « RÉSOLU » s'imprimait déjà (animation `tampon`) ; pas d'anneau pour le minuteur, sa barre de blocs suffit.
- [x] 32.4 États au survol, à l'appui et au focus redessinés pour tous les composants (anneau de focus rouille net, boutons qui s'enfoncent d'un pixel, cartes qui se soulèvent légèrement) ; retours de copie et d'export en « toast » discret (`role="status"`).
  Fait : boutons et puces qui s'enfoncent, cartes qui se soulèvent, anneau de focus décalé. Justifié : pas de « toast » ajouté, la copie et l'export ont déjà leur retour dans la page (`role="status"`).
- [x] 32.5 Parcours de contrôle : `prefers-reduced-motion` coupe tout, aucun décalage de mise en page mesurable ; REFONTE, composants, captures, contrôles, coche, fusion.
  Fait : parcours « mouvement réduit » (aucune animation du quiz, aucune apparition) ; REFONTE § 5.4 ; `npm run controles` : 0 problème, 0 avertissement, 0 échec ; fusion dans `main`.

## Lot 33 — Icônes, mode sombre et finitions
But : la cohérence fine qui fait la différence entre « joli » et « soigné ».
- [x] 33.1 Un jeu d'icônes SVG unique (trait 1,5 px, coins arrondis, grille 24 px) servi par `app.js` (`IT.icon`) : rubriques, encadrés, actions (copier, imprimer, exporter), types de ticket, niveaux ; remplacer les icônes disparates et les caractères spéciaux.
  Fait : jeu d'icônes unique dans `app.js` (pictogrammes, impression, export, import), boutons des fiches et du pied de page.
- [x] 33.2 Mode sombre travaillé pour lui-même : niveaux de surface (fond, carte, carte surélevée), filets plus doux, blocs de code distincts du fond, images et schémas ajustés, carte-ticket qui ne se confond plus avec le fond.
  Fait : `--surface-2` pour les éléments surélevés en sombre, blocs de code bordés, boîtes sombres des schémas éclaircies.
- [x] 33.3 Détails typographiques : vraies apostrophes et guillemets français partout, espaces fines insécables avant « : ; ? ! » (contrôle automatique ajouté à `npm run garde`), `kbd` dessinés comme des touches, liens soulignés finement avec décalage.
  Fait : `initTypo()` applique espaces insécables, fines et apostrophes typographiques au texte affiché ; `kbd` dessinés ; liens fins. Justifié : appliqué à l'affichage plutôt qu'aux fichiers, donc pas de contrôle dans `npm run garde` (les sources gardent des apostrophes droites, plus sûres pour la recherche et les données).
- [x] 33.4 Favicon SVG (le tampon IT incliné) avec variante sombre, icône d'application, couleurs de la barre du navigateur ; impression : en-tête et pied propres sur toutes les pages, pas seulement les fiches.
  Justifié : favicon tampon déjà en place et lisible sur les deux thèmes ; impression déjà propre sur toutes les pages (en-tête et pied masqués, fiches A4 des jours et des modules) ; `theme-color` fait au lot 31.
- [x] 33.5 Passe d'harmonisation finale de tout le site (espacements, alignements, rayons) d'après `docs/composants.html` à jour ; captures finales ; contrôles, coche, fusion.
  Fait : harmonisation des sections ajoutées (rayons, espacements sur l'échelle de 4 px) ; REFONTE § 5.5 ; captures `docs/captures/lot-33/` ; `npm run controles` : 0 problème, 0 avertissement, 0 échec, 0 contraste sous le seuil ; fusion dans `main`.

## Remise à zéro de l'historique Git (25/11/2026)
Décision de Marvin : tout l'historique supprimé. `main` repart d'un seul commit qui contient le site dans l'état des lots 1 à 28 ; toutes les autres branches distantes ont été supprimées. Les agents qui avaient un clone le refont (`git clone`), sans rien pousser depuis l'ancien. La règle « jamais de `push --force` ni de réécriture d'historique » reste valable pour la suite.

## Lot 28 — Labos sans machine virtuelle
Décision de Marvin (25/11) : **aucune VM**, son PC n'a pas assez de mémoire. Les labos se font sur son propre Windows, en lecture ou sans risque, avec un proche (Assistance rapide) ou sur papier ; ce qui demande un serveur, un domaine ou une panne provoquée est renvoyé au stage, sur un poste de test si le tuteur le permet (« à vérifier sur place »). Aucun moteur de l'atelier touché.
- [x] 28.1 Prépa : labos de J4 (lecture, `sfc /verifyonly`, `reagentc /info`), J5 (réseau de la maison, pannes sans danger et sur papier), J6 (PC en lecture et annuaire sur papier), J8 (`mstsc` sans connexion, test du port, Assistance rapide avec un proche), J9 (TPM, Secure Boot, BitLocker en lecture, emplacement de la clé) ; lignes de plan, encadrés UMONS, mémo J4 et question du quiz J4 sur la VM remplacée.
  Fait : plus aucune instruction de VM dans `stage/` ; faits nouveaux vérifiés sur les pages officielles (`sfc /verifyonly`, emplacement de la clé BitLocker, chiffrement de l'appareil, RFC 2606).
  Test en situation du labo du J5 (26/11, agent qui n'a pas écrit la page) : 1 bloquant, 3 gênants, 3 mineurs, tous traités ; suivi dans `docs/relectures/test-stage-j5.md`.
- [x] 28.2 Modules : labos de Dépannage à distance, Réseau de base (capture Wireshark chez soi), Sous-réseaux (calcul avec ses vraies valeurs), Support Windows (sans mode sans échec ni arrêt brutal) et AD (lecture et papier).
  Fait : plus aucune instruction de VM dans `modules/` (restent des mentions théoriques, par exemple le retour en arrière d'une VM comme cause d'un canal sécurisé rompu).
- [x] 28.3 Procédures `nouveau-module.md` et `test-chef.md` : labo « sans machine virtuelle » ; `npm run index`, `npm run controles`, coche, fusion.
  Fait : `npm run index` ; `npm run controles` réussi (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 27 — Calendrier : une semaine à partir du lundi 30/11, week-end compris
Décision de Marvin (25/11) : la prépa tient en **une semaine, du lundi 30/11 au dimanche 6/12, week-end compris** (séances de 3 à 4 h). Dix jours de cours sur sept séances, donc trois séances doubles : **J1 + J2 le lundi 30/11**, J3 le 1/12, J4 le 2/12, J5 le 3/12, J6 le 4/12, **J7 + J8 le samedi 5/12**, **J9 + J10 le dimanche 6/12** (veille du stage, J10 réduit à la révision express et à la check-list). Remplace le calendrier du lot 26. Ne pas toucher aux moteurs de l'atelier.
- [x] 27.1 Données et accueil : dates, durées (J7 et J8 ≈ 1 h 45) et `prepaDebut` dans `assets/data.js` ; commentaires de `assets/accueil.js` (la logique gérait déjà plusieurs jours par date).
  Fait : sept dates, frise de 8 cases du 30/11 au 7/12 (libellé de `index.html` à jour), sans case « Repos ».
- [x] 27.2 Pages : dates des en-têtes J1 à J10 ; encadrés « séance double » du lundi 30/11 (J1, J2), du samedi 5/12 (J7, J8, nouveaux, même consigne que J1 et J2) et du dimanche 6/12 (J9, J10) ; rythme de `stage/index.html` ; `docs/REFONTE.md` § 2.1.
  Fait : en-têtes, encadrés et programme alignés ; aucun nouveau fait.
- [x] 27.3 `npm run index`, parcours « calendrier de la prépa » adapté (30/11, 1/12, 5/12, 6/12, avant la prépa, premier jour du stage), `npm run controles`, coche, fusion.
  Fait : index régénéré ; `npm run controles` réussi (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec) ; accueil vérifié à 390 px au 5/12 ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 26 — Calendrier : la prépa commence le mercredi 25/11 (URGENT, à faire en premier)
Décision de Marvin (25/11) : la prépa commence **mercredi 25/11 avec le jour 1**, en semaine seulement, séances de 3 à 4 h ; il n'y a que 8 jours ouvrables avant le stage, donc **J1 + J2 le mercredi 25/11** et **J9 + J10 le vendredi 4/12** (J10 réduit à la révision express). Calendrier : J1 et J2 le 25/11, J3 le 26/11, J4 le 27/11, J5 le 30/11, J6 le 1/12, J7 le 2/12, J8 le 3/12, J9 et J10 le 4/12. Modèle conseillé : Sol, effort `medium`. Ne pas toucher aux moteurs de l'atelier.
- [x] 26.1 Données : dans `assets/data.js`, dates des jours ci-dessus et `prepaDebut` au 25/11 (commentaire à jour) ; vérifier ce que lit `assets/accueil.js`.
  Fait : dates et durées des dix jours dans `assets/data.js`, début le 25/11. L’accueil lit ces dates, les durées et les blocs pour la mission et la frise.
- [x] 26.2 Accueil (`assets/accueil.js`) : un même jour peut porter **deux** jours de prépa. « Jour du jour » : les deux (titre du type « Jours 1 et 2 », deux boutons) ; frise : une case du 25/11 au 7/12 (commentaire « Frise du 23/11 » à corriger), la case d'un jour double affiche « J1 + J2 » et renvoie au premier jour non terminé ; « reprise » et compteurs inchangés. Tester avec `index.html?date=2026-11-25`, `?date=2026-11-26`, `?date=2026-12-04`, `?date=2026-12-05`.
  Fait : mission avec deux liens les jours doubles, 13 cases dans la frise et lien vers le premier jour à terminer. Les quatre dates et le retour après progression ont été testés en serveur et en `file://`.
- [x] 26.3 Pages : sur `stage/j1.html` et `j2.html`, un encadré `callout astuce` en tête du plan : « Séance double du mercredi 25/11 : ≈ 1 h 45 par jour ; fais la théorie, les mises en situation et le quiz, garde les labos pour plus tard » (pas de nouveau fait, pas de durée inventée au-delà) ; même principe sur `j9.html` (≈ 3 h, labo raccourci) et `j10.html` (≈ 45 min : `revision.html`, puis la check-list du premier jour ; les appels simulés pendant la première semaine de stage, le soir). Texte de `stage/index.html` (rythme) à jour.
  Fait : en-têtes du J1 au J10 alignés, consignes express pour J1 et J2 avec parcours complet au minuteur, labo raccourci au J9, programme du J10 en 45 min et rythme de la prépa affiché dans `stage/index.html`. Index de recherche régénéré.
- [x] 26.4 `docs/REFONTE.md` § 2.1 : remplacer « du 23/11 au 4/12 » et l'exemple « Lundi 23 novembre » par le nouveau calendrier (décision de Marvin, pas un désaccord).
  Fait : section 2.1 de `docs/REFONTE.md` alignée sur les huit séances, les dates doubles et les 13 cases. La note de rythme renvoie au calendrier actuel.
- [x] 26.5 `npm run index`, `npm run controles` (le parcours « progression et tampon » ou d'autres tests peuvent dépendre des dates : les adapter sans les affaiblir), coche, fusion dans `main`.
  Fait : index régénéré et `npm run controles` réussi sur 35 pages : 0 problème, 0 avertissement et 0 échec en serveur et en `file://`. Le parcours calendrier vérifie les quatre dates et la progression sur les séances doubles.

Reste : rien pour ce lot.

## Lot 16 — Relecture des faits : prépa J1 à J5
- 16.1 Relecture initiale des jours J1 à J5 retirée de `main` à la demande de Marvin. Les rapports d'origine ne sont plus accessibles depuis la remise à zéro de l'historique Git (25/11/2026). Les cinq fichiers de `docs/relectures/` gardent le suivi des corrections de 16.2.
- [x] 16.2 Corriger chaque « faux » et traiter chaque « non vérifié » (autre conversation, de préférence l'autre outil) ; noter dans chaque rapport ce qui a été corrigé.
  Fait : les 28 « faux » et 12 « non vérifiés » des J1 à J5 traités par Claude Code (dans l'ordre d'étude : J3, J4, J5, J1, J2), quiz compris ; chaque rapport se termine par son suivi « Corrigé / Justifié ». Justifié : les URL des corrections viennent des rapports de ChatGPT, qui les a ouvertes ; `8.8.8.8` gardé comme exemple signalé.
- [x] 16.3 `npm run controles`, coche, fusion.
  Fait : `npm run controles` = 0 problème, 0 avertissement, 0 échec (29 pages, serveur et `file://`) ; fusion dans `main`.

Reste : rien pour ce lot ; les rapports J1 à J5 restent dans `docs/relectures/` comme trace.

## Lot 17 — Relecture des faits : prépa J6 à J10 et boîte à outils
- [x] 17.1 Relire `stage/j6.html` à `j10.html` et `stage/outils.html` (même procédure, rapports dans `docs/relectures/`).
  Fait : six rapports de relecture dans `docs/relectures/` pour J6 à J10 et la boîte à outils, avec vérification des 44 réponses de quiz et des sources primaires. Rapports actualisés après le lot 26 sur `bfb5760`. Bilan : 28 points faux, 11 non vérifiés et 100 corrects. Reste : corrections en 17.2, puis contrôles et fusion en 17.3.
- [x] 17.2 Corrections (autre conversation).
  Fait (25/11, Claude Code) : 28 « faux » et 11 « non vérifiés » traités dans J6 à J10, la boîte à outils et leurs quiz ; encadrés de sources avec URL dans chaque section ; suivi « Corrigé / Justifié » en fin de chaque rapport. Justifié : un lien du rapport J7 (« Open Outlook in safe mode ») renvoie 404, remplacé par la page des commutateurs Office.
- [x] 17.3 `npm run controles`, coche, fusion.
  Fait : `npm run controles` réussi le 25/11 (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec ; nouveau parcours « fiche mémo sur une page A4 » pour les 9 modules) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 18 — Module « Dépannage à distance »
Suivre `docs/procedures/nouveau-module.md` (sous-étapes 18.1 à 18.4). Domaine Support, approfondit `stage/j8.html`, à retirer de `aVenir`. Pistes, chacune à sourcer : Assistance rapide et Bureau à distance (Microsoft Learn), consentement et vérification d'identité avant toute prise en main, journalisation dans le ticket, méthode de diagnostic à distance, quand passer sur site. Outil réellement utilisé à l'UMONS : « à vérifier sur place ».
- [x] 18.1 Page `modules/depannage-distance.html` (rédigée par Claude Code, sources Microsoft ouvertes le 24/11/2026).
  Fait : 6 sections (choisir l'outil, Assistance rapide pas à pas, Bureau à distance et `mstsc`, PowerShell à distance, faux support, session de bout en bout), labo PC + VM, 4 cas, fiche mémo, 6 questions pour le tuteur ; chaque fait vient d'une page Microsoft ouverte le 24/11/2026 (Learn, Support, blog Security), citée dans l'encadré de sa section ; libellés d'Assistance rapide en anglais (ceux de la documentation).
- [x] 18.2 Données : `modules.js` (retirer de `aVenir`), quiz `module-depannage-distance`, unité dans `data.js`, index.
  Fait : entrée dans `assets/modules.js` (Support, niveau 1, ≈ 3 h, approfondit J8) et retrait de `aVenir`, quiz de 6 questions, unité `module-depannage-distance`, index régénéré (250 entrées) ; page vérifiée en `file://` à 390 px.
- [x] 18.3 Relecture croisée par ChatGPT : `docs/procedures/relecture-sources.md` (rapport `docs/relectures/module-depannage-distance.md`), puis `test-chef.md` ; corrections dans une autre conversation.
  Fait : Relecture des sources et du quiz dans `docs/relectures/module-depannage-distance.md` (15 corrects, 1 faux et 3 non vérifiés). Le test en situation demandé par le plan reste à faire avant de cocher 18.3.
  Corrections faites (25/11, Claude Code) : éditions hôtes RDP, présence d'Assistance rapide, sources du §6 et renvois ; Storm-1811 justifié ; suivi dans le rapport. Reste : `test-chef.md`.
  Fait : test en situation (agent qui n'a pas écrit la page) ; fiche mémo A4 des modules, étapes avant et après du §2, libellés français, réseau de la VM ; suivi dans le rapport.
- [x] 18.4 `npm run controles`, coche, fusion.
  Fait : `npm run controles` réussi le 25/11 (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec ; nouveau parcours « fiche mémo sur une page A4 » pour les 9 modules) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 19 — Révision express et progression portable
Justifié : fait avant le lot 17 (relecture réservée à ChatGPT) et le lot 18, parce qu'il ne demande pas de relecture croisée et sert dès maintenant.
- [x] 19.1 Page `stage/revision.html` : les fiches mémo J1 à J9 seules (lues depuis les sections `#memo` des pages, ou dupliquées en données si la lecture en `file://` l'impose, sans `fetch`), puis un quiz mélangé tiré des quiz existants ; lien depuis `stage/index.html` et l'accueil.
  Fait : `stage/revision.html` (9 fiches et quiz de 10 questions tirées dans `stage-j1` à `stage-j9`, bouton « Nouveau tirage ») ; fiches **générées** dans `assets/revision.js` par `outils/revision.mjs` depuis les sections `#memo` (inclus dans `npm run index`, contrôlé par `garde`, protégé par le hook) ; liens depuis `stage/index.html` et l'accueil (fin de prépa et pendant le stage) ; vérifiée en `file://` à 390 px.
- [x] 19.2 Export et import de la progression : bouton qui télécharge un fichier JSON des clés `it.*` (Blob, sans serveur) et import par `<input type="file">` avec vérification du contenu, message dans la page (jamais `alert`) ; dans le pied de page ou sur l'accueil.
  Fait : boutons « Exporter ma progression » et « Importer » dans le pied de page de toutes les pages (`app.js`) : fichier JSON `progression-it-AAAA-MM-JJ.json` des seules clés `it.*` (Blob), import par `<input type="file">` qui refuse tout autre format, message dans la page (`role="status"`), rechargement après import.
- [x] 19.3 `npm run index`, `npm run controles` (ajouter les deux parcours à `outils/parcours.mjs`), coche, fusion.
  Fait : index régénéré (238 entrées) ; `npm run controles` = 30 pages, 0 problème, 0 avertissement, 0 échec, avec deux nouveaux parcours (révision express ; export puis import, y compris un fichier refusé) en serveur et en `file://` ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 20 — Module « Microsoft 365 et messagerie »
`docs/procedures/nouveau-module.md`. Approfondit `stage/j7.html` (Outlook, profils, OST, boîtes partagées, Teams, OneDrive, MFA), sources Microsoft Learn ; la configuration du tenant UMONS est « à vérifier sur place ».
- [x] 20.1 Page `modules/m365-messagerie.html` (rédigée par Claude Code, sources Microsoft ouvertes le 24/11/2026).
  Fait : 6 sections (deux Outlook, commutateurs de dépannage, droits d'une boîte partagée, cache de Teams, OneDrive, MFA), labo sur son propre PC, 4 cas, fiche mémo, 5 questions pour le tuteur ; faits tirés de 9 pages Microsoft ouvertes le 24/11/2026, citées section par section ; licence et taille des boîtes partagées non trouvées dans la source, donc non mentionnées.
- [x] 20.2 Données : `modules.js` (retirer de `aVenir`), quiz `module-m365-messagerie`, unité dans `data.js`, index.
  Fait : entrée dans `assets/modules.js` (Support, niveau 2, ≈ 3 h, approfondit J7) et retrait de `aVenir`, quiz de 6 questions, unité `module-m365-messagerie`, index régénéré (262 entrées) ; page vérifiée en `file://` à 390 px.
- [x] 20.3 Relecture croisée par ChatGPT (rapport `docs/relectures/module-m365-messagerie.md`, puis `test-chef.md`) ; corrections dans une autre conversation.
  Fait : Relecture des sources et du quiz dans `docs/relectures/module-m365-messagerie.md` (13 corrects, 5 faux et 2 non vérifiés). Le test en situation demandé par le plan reste à faire avant de cocher 20.3.
  Corrections faites (25/11, Claude Code) : PST/OST, droits de la boîte partagée, corbeille OneDrive, labo en deux parcours, Teams, cas 4, renvois ; suivi dans le rapport. Reste : `test-chef.md`.
  Fait : test en situation (agent qui n'a pas écrit la page) ; constats traités, dont la fiche mémo A4 commune aux modules ; suivi dans le rapport.
- [x] 20.4 `npm run controles`, coche, fusion.
  Fait : `npm run controles` réussi le 25/11 (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec ; nouveau parcours « fiche mémo sur une page A4 » pour les 9 modules) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 22 — Entraînement aux tickets
Justifié : fait avant le lot 21 (relecture réservée à ChatGPT), en autonomie la nuit du 24 au 25/11.
- [x] 22.1 Page `stage/tickets.html` et données `assets/tickets-data.js` : 12 appels fictifs (type, impact, urgence, action attendus, résumé d'exemple, explication), conventions et matrice d'exemple du jour 1.
  Fait : `assets/tickets-ui.js` construit chaque appel en ticket (composant `.ticket-cas`), calcule la priorité en direct, note type, impact, urgence et action (sécurité : impact et urgence non notés), cache la résolution dans un `<details>`, garde les résultats dans `it.tickets` ; liens depuis `stage/index.html`, index de recherche.
- [x] 22.2 `npm run controles` (nouveau parcours « entraînement aux tickets »), coche, fusion.
  Fait : parcours ajouté (12 tickets, refus sans réponse, priorité P4 calculée, résolution fermée par défaut, résultat mémorisé) ; contrôles sans échec ; vérifié à 390 px.

Fait : relecture des douze appels et comparaison à la matrice J1 dans `docs/relectures/stage-tickets.md` (13 corrects, 2 faux et 2 non vérifiés). Corrigé le 25/11 (Claude Code) : T01, T04, T06 et encadré de sources ; suivi dans le rapport.

## Lot 23 — Module « Imprimantes et périphériques »
Justifié : rédigé avant le lot 21, en autonomie ; relecture par ChatGPT à faire comme pour les lots 18 et 20.
- [x] 23.1 Page `modules/imprimantes-peripheriques.html` (rédigée par Claude Code, sources Microsoft ouvertes le 25/11/2026).
  Fait : 5 sections (imprimante dans l'ordre, pilotes et Point and Print, commandes `Get-Printer` et `printui`, caméra, Bluetooth), labo sur son propre PC, 4 cas, fiche mémo, 5 questions pour le tuteur ; faits tirés de 7 pages Microsoft (Support et Learn) ouvertes le 25/11/2026.
- [x] 23.2 Données : `modules.js` (retirer de `aVenir`), quiz `module-imprimantes-peripheriques`, unité dans `data.js`, index.
  Fait : entrée dans `assets/modules.js` (Support, niveau 1, ≈ 2 h 30, approfondit J5), `aVenir` du domaine Support vidé, quiz de 6 questions, unité `module-imprimantes-peripheriques`, index régénéré (275 entrées) ; page vérifiée en `file://` à 390 px.
- [x] 23.3 Relecture croisée par ChatGPT (rapport `docs/relectures/module-imprimantes-peripheriques.md`, puis `test-chef.md`) ; corrections dans une autre conversation.
  Fait : Relecture des sources et du quiz dans `docs/relectures/module-imprimantes-peripheriques.md` (11 corrects, 1 faux et 2 non vérifiés). Le test en situation demandé par le plan reste à faire avant de cocher 23.3.
  Corrections faites (25/11, Claude Code) : Windows Hello présenté comme hypothèse, variantes du labo sans imprimante ni caméra, renvois ; suivi dans le rapport. Reste : `test-chef.md`.
  Fait : test en situation (agent qui n'a pas écrit la page) ; constats traités, dont la fiche mémo A4 commune aux modules ; suivi dans le rapport.
- [x] 23.4 `npm run controles`, coche, fusion.
  Fait : `npm run controles` réussi le 25/11 (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec ; nouveau parcours « fiche mémo sur une page A4 » pour les 9 modules) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 24 — Module « Sous-réseaux et plan d'adressage »
Justifié : rédigé avant le lot 21, en autonomie ; relecture par ChatGPT à faire.
- [x] 24.1 Page `modules/sous-reseaux.html` (rédigée par Claude Code ; sources Microsoft Learn et RFC ouvertes le 25/11/2026 ; calculs vérifiés par script).
  Fait : 5 sections (masque et préfixe, local ou distant, calcul au 3e octet, découpage et plages spéciales, dépannage), labo « un masque qui ment » sur le réseau du J5, 5 exercices et 3 cas corrigés, fiche mémo ; faits tirés de Microsoft Learn (TCP/IP addressing and subnetting) et des RFC 1918, 3021, 3927, 4632, 6890 ; toutes les réponses calculées par script (module `ipaddress` de Python) ; aucun exemple repris de « Réseau de base ».
- [x] 24.2 Données : `modules.js` (retirer de `aVenir`), quiz `module-sous-reseaux`, unité dans `data.js`, index.
  Fait : entrée dans `assets/modules.js` (Réseau, niveau 2, ≈ 3 h, prérequis `reseau-base`), retrait de `aVenir`, quiz de 6 questions, unité `module-sous-reseaux`, index régénéré (287 entrées) ; page vérifiée en `file://` à 390 px.
- [x] 24.3 Relecture croisée par ChatGPT (rapport `docs/relectures/module-sous-reseaux.md`) ; corrections dans une autre conversation.
  Fait : Relecture des sources et du quiz dans `docs/relectures/module-sous-reseaux.md` (13 corrects, 4 faux et 1 non vérifié). Les corrections relèvent de la prochaine passe.
  Corrections faites (25/11, Claude Code) : colonne « pas », hypothèse de la route par défaut, méthode limitée aux octets coupés (/8, /16, /24, /31, /32), segment sans routage, encadré au §3 ; suivi dans le rapport.
- [x] 24.4 `npm run controles`, coche, fusion.
  Fait : `npm run controles` réussi le 25/11 (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec ; nouveau parcours « fiche mémo sur une page A4 » pour les 9 modules) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 21 — Relecture des faits : les cinq premiers modules
- [x] 21.1 Relire les pages et les quiz de `support-windows`, `itil`, `reseau-base`, `ad-support` et `materiel-pc` selon `docs/procedures/relecture-sources.md`.
  Fait (25/11, ChatGPT / Codex) : cinq rapports `docs/relectures/module-*.md`, 30 réponses de quiz couvertes et calculs IPv4 confirmés par script. Bilan des tableaux : 68 corrects, 40 faux et 14 non vérifiés. Pages et quiz laissés pour la passe de correction.
- [x] 21.2 Corriger ou justifier chaque « faux » et « non vérifié » dans une autre conversation (Claude Code), puis ajouter le suivi dans les rapports.
  Fait (25/11, Claude Code) : 40 « faux » et 14 « non vérifiés » traités dans les cinq pages et leurs quiz ; encadrés de sources avec URL par section ; faits sensibles revérifiés sur les pages officielles (Nltest `/force`, intervalle de réplication, démarrage minimal, vidage mémoire). Justifié : événement 7034 retiré faute de source ; ITIL 4 Foundation cité sans le lien vers une copie tierce du livre.
- [x] 21.3 Lancer `npm run controles`, cocher la fin du lot et fusionner `lot-21` dans `main`.
  Fait : `npm run controles` réussi (35 pages × 4 largeurs × 2 thèmes, serveur et `file://` : 0 problème, 0 avertissement, 0 échec) ; fusion dans `main`.

Reste : rien pour ce lot.

## Lot 25 — Retour du terrain
À détailler après le 18/12, à partir du tableau ci-dessus. N'écrire que ce qui est public : aucune procédure interne, aucune IP, aucun nom.

Après le 7/12 : le journal de stage reste privé, **hors de ce dépôt**.
