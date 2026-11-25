# Refonte graphique — cahier des charges

Maquette de référence (canevas, 13 écrans cliquables) : https://claude.ai/artifact/LVdrRmRBrFoEMMCEw12mhZ
Elle montre l'intention. En cas de doute, ce document fait foi. Le contenu des pages ne change pas : seule la présentation change (rien d'inventé, sources, « à vérifier sur place » et corrections cachées restent).

Deux identités dans une même famille :
- **« Poste de garde »** pour toute la plateforme : un outil de service desk professionnel, éditorial et précis.
- **« Le Livre du montage »** pour l'atelier hardware : un manuel illustré ancien (planches gravées, folios, notes en marge).

Mêmes couleurs, même logo, mêmes règles (HTML/CSS/JS natifs, sans build, local + GitHub Pages, `localStorage` `it.*` dans un try/catch, AA, cibles ≥ 44 px, `prefers-reduced-motion` respecté).

## 1. Socle commun

### Feuille de style
- Réécrire `assets/style.css` en **une seule couche**. Supprimer les couches « Asimov » et « Version chaleureuse » (grille, hachures, repères de coin, `!important`, numérotation `N° 01` des cartes, `01 02` du menu).
- Jetons en variables : couleurs de `CLAUDE.md` (clair et sombre, inchangées) + `--bar: #2C1F16` (sombre : `#0E0B08`), `--bar-ink #EDE6DA`, `--bar-soft #BBAF9F`, `--bar-accent #E3916A`.
- Espacements sur une échelle de 4 px (4, 8, 12, 16, 24, 32, 48, 64). Rayons : 4 (petits éléments), 6 (boutons), 10 (cartes, panneaux).
- Ombres : aucune sur les cartes au repos ; une ombre douce seulement pour ce qui flotte (dialogue, minuteur mobile).

### Typographie
- Titres en Newsreader léger (400) et grand : h1 56–64 px sur ordinateur, 32–38 px sur mobile, interlignage 1.04, `letter-spacing -0.025em`. Un mot clé du h1 en `<em>` rouille (italique conservé).
- Texte courant : Newsreader 18,5 px, interligne 1.7, colonne de 46rem maximum.
- Interface (boutons, menus, tableaux, légendes) : Instrument Sans. Étiquettes (kicker, compteurs, dates) : IBM Plex Mono 11–12 px en capitales espacées (0.14em).
- Numéros de section en italique rouille dans le titre : `§1`, `§2`…

### En-tête et pied de page (`app.js`)
- Barre sombre `--bar`, filet de 3 px `--bar-accent` dessous.
- Logo : un tampon carré de 34 px, bordure 1,5 px rouille clair, « IT » en mono, **incliné de −4°**, suivi de « Apprentissage IT » (corriger l'espace qui disparaît aujourd'hui : texte dans un `<span>`, pas un nœud texte dans un conteneur flex).
- Menu : Aujourd'hui · Prépa stage · Modules · Thèmes · Atelier. Instrument Sans 14 px, sans numéros. Lien actif : fond `rgba(237,230,218,.1)` + couleur claire.
- Bouton « Rechercher une notion… » avec `kbd` `/` (ouvre la recherche, § 2.3).
- Bouton de thème : une icône (soleil/lune), `aria-label` explicite, cycle auto → clair → sombre.
- Sur les pages de jour : une barre de lecture de 3 px sous l'en-tête (progression du défilement).
- Pied de page : barre sombre, mono 12 px, deux phrases actuelles.

### Composants
- **Boutons** : principal plein rouille, secondaire contour, hauteur 48 px (44 minimum), Instrument Sans 15 px gras, **pas de capitales**, pas d'ombre décalée.
- **Encadrés** : trois niveaux seulement.
  - *Retenir* (fond surface, filet gauche rouille).
  - *Attention* (filet rouge).
  - *Étiquette en ligne* pour « À l'UMONS — à vérifier sur place » (pastille ambre en contour) et « Source officielle » (pastille neutre). Ce sont des notes discrètes, pas des blocs lourds.
  - L'astuce rejoint *Retenir*.
- **Tableaux** : en-tête en Instrument Sans gras 13 px (plus de capitales mono), lignes séparées par un filet, pas de zèbre.
- **Code** : fond sombre conservé, bouton copier en icône + texte court.
- **Cartes** : fond surface, bordure, rayon 10, survol = bordure rouille.
- **Progression** : barres de 4–6 px vertes ; anneau SVG pour les rubriques (voir accueil).

## 2. Plateforme « Poste de garde »

### 2.1 Accueil = tableau de mission (`index.html`)
- Calculer le **jour du jour** d'après la date. Sept séances, week-end compris : J1 et J2 le 30/11, J3 le 1/12, J4 le 2/12, J5 le 3/12, J6 le 4/12, J7 et J8 le 5/12, J9 et J10 le 6/12. Avant : « Commencer la prépa » ; entre la fin de la prépa et le stage (s'il reste un jour) : « Réviser » ; à partir du 7/12 : « Ton stage a commencé ».
- Colonne gauche :
  - kicker « Mardi 1er décembre · Jour 3 sur 10 » avec une pastille ;
  - h1 « Aujourd'hui, *Jira*, de l'ouverture à la clôture. » ;
  - chapeau du jour ;
  - boutons « Commencer la séance » et « Voir le plan du jour » ;
  - les 30/11, 5/12 et 6/12, titre avec les deux jours et un bouton par jour ;
  - ligne « Reprise : § 2 … », à partir de la dernière section vue (clé `it.reprise`).
- Colonne droite : **carte-ticket sombre** « Ticket STAGE-0712 · ● Ouvert » :
  - le décompte en mono 96 px rouille clair avec « jours avant le premier appel » ;
  - une grille 2×2 : Où / Poste / Début / Horaires ;
  - la progression de la prépa.
- **Frise** du 30/11 au 7/12 (8 cases, défilement horizontal sur mobile) :
  - jour courant plein rouille ;
  - jours faits avec ✓ ;
  - séance double dans une seule case, avec un lien vers le premier jour à terminer et un ✓ quand les deux sont faits ;
  - jours sans séance hachurés « Repos » (aucun dans le calendrier actuel) ;
  - 7/12 en case sombre « Stage ».
- « Toute la plateforme » : 4 cartes (Prépa, Modules, Thèmes, Atelier) avec leur compteur réel. La carte Atelier a le fond « papier ligné » et le titre en italique *Le Livre du montage*.
- « Comment on apprend ici » : trois colonnes numérotées en chiffres romains italiques rouille.

### 2.2 Pages de jour (`stage/j1.html` à `j10.html`)
- **Trois colonnes** à partir de 1100 px :
  - à gauche, les 10 jours (état : courant, fait ✓) et un lien vers la boîte à outils ;
  - au centre, le texte (46rem max) ;
  - à droite, « Sur cette page » avec la section active surlignée (IntersectionObserver) et la carte « Fiche mémo · Aperçu et impression ».
- En dessous de 1100 px : une seule colonne. Les deux panneaux deviennent des tiroirs ouverts depuis l'en-tête (sommaire) et depuis le fil d'Ariane (jours).
- **Minuteur de séance** : le plan horaire devient un panneau sombre.
  - Contenu : bloc courant, temps restant en mono 40 px, boutons Démarrer / Pause / Bloc suivant, et 6 segments (faits en vert, courant en rouille).
  - Les durées sont lues dans le plan horaire existant (`.plan-horaire .h`).
  - État dans `it.seance.jN`.
  - Sur mobile, le minuteur devient une pastille flottante en bas de l'écran.
- **Matrice impact × urgence (J1)** : 3×3 boutons, priorité colorée par intensité (P1 rouge, P2 rouille, P3 rouille clair, P4 neutre), explication sous la grille au clic.
- **Mises en situation en tickets** :
  - en-tête de ticket : `CAS-01`, canal, demandeur, statut « À trier » ;
  - énoncé ;
  - bouton « J'ai répondu : voir la résolution », un `<details>` restylé, avec « Résolution » en vert.
- **Clôture du jour** : en bas de page, encadré pointillé et bouton vert « Clôturer le jour N ». Quand le jour est fait, un **tampon RÉSOLU** apparaît : double bordure rouille, incliné de −12°, avec la date, sans animation si mouvement réduit. Il remplace les cases « fait » actuelles pour l'unité du jour.
- Numéros de section `§N` dans les h2.

### 2.3 Recherche rapide (`/` ou Ctrl+K, et bouton de l'en-tête)
- Dialogue centré de 680 px sur un voile sombre. Champ en 19 px. Résultats groupés : **Commandes** (mono), **Notions**, **Modules**, **Atelier**.
- Pour chaque résultat : une étiquette (cmd, jour, module, panne), un titre et une provenance. Navigation ↑↓ et Entrée, Échap pour fermer.
- Index écrit à la main dans `assets/recherche.js` (pas de `fetch`) : titres et `id` des h2 de chaque page, commandes de la boîte à outils, modules (`modules.js`), dossiers de pannes. Prévoir un **contrôle dans `docs/`** qui liste les ancres mortes.
- Raccourci global seulement si le focus n'est pas dans un champ.

### 2.4 Fiche mémo imprimable
- `@media print` sur les pages de jour : on n'imprime que la section « Fiche mémo », mise en page A4 en noir et blanc.
- Contenu de la page imprimée :
  - en-tête « Fiche mémo · Prépa stage · Jour N », h1 et logo tampon ;
  - lignes à deux colonnes (étiquette mono rouille / texte) ;
  - matrice en niveaux de gris ;
  - encadré ambre « À demander au tuteur » ;
  - pied de page avec la source.
- Le bouton « Aperçu et impression » appelle `window.print()`.

### 2.5 Modules (`modules/index.html`)
- Grand h1, puis à droite le **parcours conseillé** : Réseau de base → AD pour le support (prérequis, trait plein) et Support poste Windows ⇢ AD (suite, pointillé). Le parcours est généré depuis `prerequis` et `suite`.
- Filtres en **puces** (Tous + domaines ayant des modules) plus un champ de recherche. Le compteur est en `aria-live`.
- Cartes de module :
  - colonne gauche : **jauge de niveau** à 3 barres croissantes, « Niv. N », durée en mono ;
  - colonne droite : domaine (kicker), titre en 23 px, résumé, pastille « Après : … » si prérequis, 5 mots-clés.

### 2.6 Thèmes (`themes.html`) = l'atlas
- Une grille de 9 tuiles (3 colonnes, 2 sur tablette, 1 sur mobile). Chaque tuile montre :
  - le numéro ;
  - la pastille sombre « STAGE » pour Support, Réseau, Windows et annuaire, Gestion ;
  - le titre ;
  - des **pastilles** : un carré plein rouille par contenu disponible (modules + liens), un carré pointillé par sujet à venir ;
  - le résumé « N disponibles · N à venir ».
- Les tuiles sans contenu ont une bordure pointillée et un fond transparent.
- Panneau latéral (sous la grille sur mobile) : le domaine sélectionné, avec description, modules disponibles, « ailleurs sur le site » et « à venir » (puces pointillées). Sélection gardée dans l'URL (`?domaine=`).

## 3. Atelier « Le Livre du montage »

Ajout de police (atelier seulement) : **IM Fell English** et **IM Fell English SC** (Google Fonts, repli Georgia), pour les titres, lettrines, petites capitales, folios et légendes. Le texte courant reste en Newsreader.

### 3.1 Habillage commun
- **Fond « bureau »** : dégradé radial `#3B2A1E` → `#1E150F`.
- **Le livre ouvert** : deux pages `#F7F1E6`, une ombre portée, une ombre douce de reliure au centre et un filet de pli.
- Sur mobile : une seule page plein écran, la planche au-dessus du texte.
- **Page de gauche (texte)** :
  - titre courant en petites capitales (« Chap. I — PC bureautique Intel » / « Étape 6 sur 15 ») au-dessus d'un filet ;
  - titre de l'étape en IM Fell 38 px ;
  - **lettrine** rouille sur 3 lignes ;
  - texte justifié, césure ;
  - ornement ✣ entre deux filets ;
  - « Pour aller plus loin » en italique.
- **Notes en marge** (colonne de 112 px à droite du texte) : indices et verdicts. Elles ont un filet supérieur rouille (vert si juste, rouge si erreur) et une étiquette en petites capitales (Indice, Juste, Erreur, LED de debug…). Elles **remplacent les encadrés** dans l'atelier.
- **Page de droite (planche)** :
  - « Planche VI » ;
  - la scène SVG retravaillée en gravure : traits 1–1,6 px encre, **hachures** en `<pattern>` (45°, encre, opacité 0,25–0,35), aplats de surlignage `#E3B49A` ;
  - **lettres A, B, C…** dans des cercles rouille ;
  - légende « Fig. N. — … » en italique ;
  - **légende cliquable** : toucher une lettre surligne la pièce, et l'inverse.
- **Le bac** : les pièces en cartes gravées (contour encre, petite gravure, nom, caractéristique en italique). Pièce choisie : bordure verte ou rouge, et la note en marge explique.
- **Folios** en bas de page (numéros de page calculés : 2 par étape) et liens « ‹ étape précédente » / « étape suivante › » en italique.
- **Tourner la page** : rotation 3D CSS de la page droite (0,7 s), puis le contenu change. Désactivé si mouvement réduit.

### 3.2 Pages
- `atelier/index.html` = **frontispice + table des matières** :
  - gauche : « Le Livre du montage », sous-titre, gravure de ventilateur, « — i — » ;
  - droite : table en trois parties (I–VI montages, VII pannes, VIII–IX épreuves) plus l'index, avec points de conduite et numéros de page, et une coche pour ce qui est fait.
- `atelier/montage.html` : le moteur existant (`atelier.js`, `atelier-art.js`, règles) est **gardé** ; seuls l'habillage et le dessin des pièces changent. Le cahier des charges devient la première double page du chapitre. Le mode test garde le même habillage, sans notes en marge.
- `atelier/pannes.html` = **« Observations »** :
  - gauche : citation du ticket en italique (filet rouille), contexte, puis « Examen · choisis tes outils », une liste de lignes à cocher (○ → ✓) dont chaque observation s'écrit en marge ;
  - droite : planche du symptôme (LED de debug, écran, etc.), « Diagnostic · quelle est la cause ? » (✓ vert ou ✗ rouge barré), et un **rabat de papier** coin plié « Soulever le rabat : pourquoi ? » qui révèle l'explication.
- Évaluations : même livre. Le rapport final est une page « Bilan » imprimable.
- Index des pièces et des pannes en fin de livre (généré depuis les données).

## 4. Ordre et vérification
Lots 8 à 12 de `docs/PLAN.md`. Chaque lot :
- se vérifie en 390 et 1280 px, en clair et en sombre (le livre garde ses pages claires en sombre, seul le bureau fonce) ;
- doit s'ouvrir sans erreur console ;
- garde la navigation au clavier.
