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
- [ ] Scène 2,5D en SVG/CSS (boîtier avec angles de vue, zoom sur la carte mère), au doigt (toucher la pièce puis l'emplacement) et à la souris (glisser-déposer).
- [ ] Pièces réalistes : boîtier, carte mère (socket, DIMM, M.2, PCIe, 24 broches, EPS, ventilateurs, façade), CPU, ventirad, pâte, RAM, SSD M.2/SATA, GPU, alimentation et câbles, ventilateurs, entretoises, cache I/O.
- [ ] Moteur de règles : compatibilité (socket, DDR4/DDR5, format, puissance et connecteurs, M.2), ordre des étapes (entretoises et cache I/O avant la carte mère, pâte avant le ventirad, RAM en A2/B2, EPS branché), simulation du POST (OK, rien ne s'allume, ventilateurs sans image, LED de debug, bips, surchauffe, pas de disque de démarrage) avec l'explication.
- [ ] Scénario 1 « PC bureautique Intel » en mode apprentissage (guidé, indices, explications).

## Lot 5 — Atelier : scénarios et évaluation
- [ ] Scénarios : PC de salle informatique, gamer AMD, station de travail, mini-ITX, mise à niveau. Inventaire avec de mauvais choix.
- [ ] Modes test (sans aide, noté) et évaluation finale (scénarios enchaînés, rapport avec les points à revoir et des liens vers les modules).

## Lot 6 — Atelier : pannes
- [ ] PC en panne avec symptômes ; inspecter (visuel, LED, bips, test de l'alimentation, pièce témoin, BIOS), diagnostiquer, remplacer.
- [ ] Pannes : RAM, alimentation, EPS oublié, pâte ou ventirad, GPU, disque, pile CMOS, BIOS incompatible, court-circuit d'entretoise, nappes de façade, surchauffe.
- [ ] Modes apprentissage, test et évaluation.

## Lot 7 — Thèmes et premiers modules
- [ ] `themes.html` : les thèmes des notes, retravaillés et réorganisés par domaine, avec des liens vers les modules.
- [ ] Gabarit de module et catalogue en données (domaine, niveau, prérequis, durée), recherche et filtres.
- [ ] Premiers modules utiles au stage : support poste Windows, ITIL, réseau de base, Active Directory pour le support.

## Ensuite
Un module par lot, en commençant par les besoins du stage. Ajouter ici les nouveaux lots au fil de l'eau.
