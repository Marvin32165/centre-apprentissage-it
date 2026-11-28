# Test en situation : atelier hardware « manuel technique »

- **Procédure** : `docs/procedures/test-chef.md` ; agent de test Claude Code, nouvelle conversation, qui n'a pas fabriqué les pages. Aucun fichier modifié par le test.
- **Date** : 28/11/2026. Chromium (Playwright), 390 px tactile sombre et 1280 px clair (plus 390 clair, 1280 sombre, `file://`).
- **Usage** : « stagiaire au service desk ; lundi : réceptionner une livraison de PC puis remplacer une barrette défectueuse ; préparation le dimanche soir sur téléphone, puis sur ordinateur ».
- **Pages** : `atelier/index.html`, `missions.html?m=colis|integration|salle|maintenance`, `composants.html?c=memoire`, `montage.html?s=remplacer-ram`, `pannes.html?p=ram-defectueuse`.
- **Réserve** : l'état a bougé pendant le test (lots 47-48 en cours) ; constats 1 à 4, 6 et 7 refaits sur l'état de 11:35.

## Critères
1. Labo faisable chez soi : **réussi**. 2. Correction cachée : **réussi** (réserves 3 et 5). 3. Quiz : sans objet (diagnostic et bilan se terminent bien). 4. Liens et recherche : **raté** pour les sections (69 liens internes, 0 cassé). 5. Fiche mémo : sans objet ; impression en clair lisible. 6. Progression après rechargement : **réussi**. 7. 390 px sans défilement horizontal : **réussi**. 8. « À vérifier sur place » : **réussi**.

## Problèmes, du plus grave au moins grave
1. **C-01 à 390 px « à l'aveugle »** : après un toucher sur la planche, le message et « Retirer cette pièce » sont ~1 600 px plus bas ; « Aller à la vue » change une planche hors de l'écran.
2. **« Annuler » après la pose de la barrette** : la barrette retourne au bac, mais l'étape reste « faite » (le bilan final, lui, est juste).
3. **Le sommaire dévoile les causes** : « Index des pannes » classé par cause ; l'arbre du catalogue relie chaque cause à son dossier.
4. **Recherche** : pages trouvées, pas les sections ni les codes (E-01, C-01, A-02, D-01), ni « DDR4 », « double canal », « liste de contrôle ».
5. **Exercice E-01** : les alimentations annoncées ne sont jamais comptées.
6. Mineurs : titres d'onglet identiques (montage, pannes) ; C-01 réussie affichée « 6 / 7 » après rechargement ; ~30 Tab entre le bac et la liste des emplacements ; choix d'intervention vidé après un refus « Danger » ; impression depuis le thème sombre peu lisible (tout le site) ; fiche A-02 à 390 px, deux-points rejetés en début de ligne.

## Suivi (28/11/2026, Claude Code)
1. Message et panneau de la pièce choisie placés sous la planche (téléphone et ordinateur) ; « Aller à la vue » ramène la planche à l'écran.
2. « Annuler » annule d'abord une sélection en cours ; défaire une pose ou un retrait remet « à faire » l'étape concernée et les suivantes (démontage).
3. Index des pannes classé par symptôme, sans la cause ; l'arbre du catalogue n'a plus de liens vers les dossiers (le chemin est tracé seulement dans le corrigé).
4. Index de recherche : codes A, B, C, D, E, F dans les entrées, sections des fiches (caractéristiques, vérifications) et des missions (procédure, liste, exercice), caractéristiques en mots-clés ; ancres de ces pages vérifiées dans le navigateur par un nouveau test de `parcours`.
5. Énoncé : 10 alimentations comptées ; correction : « les alimentations sont au complet ».
6. Titre d'onglet = titre de la procédure ou du dossier ; progression enregistrée après le démarrage et message « Procédure terminée » au rechargement ; choix de cause et d'intervention conservés ; deux-points dans le terme en gras. Justifié : parcours au clavier inchangé (fonctionne) ; impression depuis le thème sombre : concerne tout le site, hors de ce chantier.
