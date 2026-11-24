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

**Changement de rythme (24/11)** : à partir du mercredi 25/11, séances de 3 à 4 h par jour en semaine seulement. Les dates restent (J3 le 25/11 … J10 le 4/12) ; chaque plan horaire est ramené à ≈ 3 h 30 (blocs raccourcis, même contenu ; un labo qui déborde se termine au début de la séance suivante).

## Lot 16 — Relecture des faits : prépa J1 à J5
- [x] 16.1 Relire `stage/j1.html` à `j5.html` avec leurs quiz (`assets/prepa.js`), selon `docs/procedures/relecture-sources.md` ; un rapport par page dans `docs/relectures/`.
  Fait : cinq rapports dans `docs/relectures/stage-j1.md` à `stage-j5.md`, avec les 40 questions de quiz vérifiées. Les constats à traiter restent en 16.2.
- [x] 16.2 Corriger chaque « faux » et traiter chaque « non vérifié » (autre conversation, de préférence l'autre outil) ; noter dans chaque rapport ce qui a été corrigé.
  Fait : les 28 « faux » et 12 « non vérifiés » des J1 à J5 traités par Claude Code (dans l'ordre d'étude : J3, J4, J5, J1, J2), quiz compris ; chaque rapport se termine par son suivi « Corrigé / Justifié ». Justifié : les URL des corrections viennent des rapports de ChatGPT, qui les a ouvertes ; `8.8.8.8` gardé comme exemple signalé.
- [x] 16.3 `npm run controles`, coche, fusion.
  Fait : `npm run controles` = 0 problème, 0 avertissement, 0 échec (29 pages, serveur et `file://`) ; fusion dans `main`.

Reste : rien pour ce lot ; les rapports J1 à J5 restent dans `docs/relectures/` comme trace.

## Lot 17 — Relecture des faits : prépa J6 à J10 et boîte à outils
- [ ] 17.1 Relire `stage/j6.html` à `j10.html` et `stage/outils.html` (même procédure, rapports dans `docs/relectures/`).
- [ ] 17.2 Corrections (autre conversation).
- [ ] 17.3 `npm run controles`, coche, fusion.

## Lot 18 — Module « Dépannage à distance »
Suivre `docs/procedures/nouveau-module.md` (sous-étapes 18.1 à 18.4). Domaine Support, approfondit `stage/j8.html`, à retirer de `aVenir`. Pistes, chacune à sourcer : Assistance rapide et Bureau à distance (Microsoft Learn), consentement et vérification d'identité avant toute prise en main, journalisation dans le ticket, méthode de diagnostic à distance, quand passer sur site. Outil réellement utilisé à l'UMONS : « à vérifier sur place ».
- [ ] 18.1 Page · [ ] 18.2 Données · [ ] 18.3 Relecture croisée · [ ] 18.4 Contrôles et fusion

## Lot 19 — Révision express et progression portable
Justifié : fait avant le lot 17 (relecture réservée à ChatGPT) et le lot 18, parce qu'il ne demande pas de relecture croisée et sert dès maintenant.
- [x] 19.1 Page `stage/revision.html` : les fiches mémo J1 à J9 seules (lues depuis les sections `#memo` des pages, ou dupliquées en données si la lecture en `file://` l'impose, sans `fetch`), puis un quiz mélangé tiré des quiz existants ; lien depuis `stage/index.html` et l'accueil.
  Fait : `stage/revision.html` (9 fiches et quiz de 10 questions tirées dans `stage-j1` à `stage-j9`, bouton « Nouveau tirage ») ; fiches **générées** dans `assets/revision.js` par `outils/revision.mjs` depuis les sections `#memo` (inclus dans `npm run index`, contrôlé par `garde`, protégé par le hook) ; liens depuis `stage/index.html` et l'accueil (fin de prépa et pendant le stage) ; vérifiée en `file://` à 390 px.
- [ ] 19.2 Export et import de la progression : bouton qui télécharge un fichier JSON des clés `it.*` (Blob, sans serveur) et import par `<input type="file">` avec vérification du contenu, message dans la page (jamais `alert`) ; dans le pied de page ou sur l'accueil.
- [ ] 19.3 `npm run index`, `npm run controles` (ajouter les deux parcours à `outils/parcours.mjs`), coche, fusion.

## Lot 20 — Module « Microsoft 365 et messagerie »
`docs/procedures/nouveau-module.md`. Approfondit `stage/j7.html` (Outlook, profils, OST, boîtes partagées, Teams, OneDrive, MFA), sources Microsoft Learn ; la configuration du tenant UMONS est « à vérifier sur place ».
- [ ] 20.1 Page · [ ] 20.2 Données · [ ] 20.3 Relecture croisée · [ ] 20.4 Contrôles et fusion

## Lots 21 à 25
Ils seront détaillés en sous-étapes au début de chaque lot, à partir du tableau ci-dessus. Pour le 22, utiliser les composants tickets existants (`CAS-0N` de `assets/jour.js`) sans toucher aux moteurs de l'atelier. Pour le 25, n'écrire que ce qui est public : aucune procédure interne, aucune IP, aucun nom.

Après le 7/12 : le journal de stage reste privé, **hors de ce dépôt**.
