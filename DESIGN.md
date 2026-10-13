---
version: alpha
name: centre-apprentissage-it
description: "Un manuel d'apprentissage IT personnel : papier crème, encre brune, un seul accent terre cuite, sauge pour ce qui est validé. Sobre, éditorial, aéré, pensé pour lire longtemps et pour taper des commandes."

colors:
  primary: "#9C3F1D"
  on-primary: "#ffffff"
  primary-hover: "#83331A"
  primary-ink: "#5A230F"
  primary-soft: "#F1E2D6"
  ink: "#1B1713"
  ink-muted: "#544A40"
  ink-faint: "#6B5F52"
  canvas: "#F3EEE5"
  surface-1: "#F9F6F0"
  surface-2: "#EAE3D7"
  hairline: "#DDD3C3"
  hairline-strong: "#C7B9A4"
  brown: "#6E5139"
  semantic-success: "#3F6140"
  semantic-success-soft: "#E7EDE2"
  semantic-error: "#9A3524"
  semantic-error-soft: "#F6E6E1"
  semantic-warning: "#7C561A"
  semantic-warning-soft: "#F4ECDC"
  terminal: "#1E1915"
  terminal-ink: "#EBE2D6"
  canvas-dark: "#13100D"
  surface-dark: "#1A1612"
  ink-dark: "#EDE6DA"
  primary-dark: "#E3916A"

typography:
  display:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -1px
  headline:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  ui:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: Instrument Sans
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  code:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  sm: 3px
  md: 4px
  lg: 6px
  nav: 9px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 28px
  xl: 56px
  section: 76px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.ui}"
    rounded: "{rounded.nav}"
    padding: 8px 14px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.ui}"
    rounded: "{rounded.nav}"
    padding: 6px 10px
  card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  callout-note:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
  callout-success:
    backgroundColor: "{colors.semantic-success-soft}"
    textColor: "{colors.semantic-success}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
  callout-error:
    backgroundColor: "{colors.semantic-error-soft}"
    textColor: "{colors.semantic-error}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
  callout-warning:
    backgroundColor: "{colors.semantic-warning-soft}"
    textColor: "{colors.semantic-warning}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
  terminal:
    backgroundColor: "{colors.terminal}"
    textColor: "{colors.terminal-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 16px
  nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.ui}"
    height: 60px
  divider:
    backgroundColor: "{colors.hairline}"
  caption-text:
    textColor: "{colors.ink-faint}"
    typography: "{typography.caption}"
---

## Overview

Le Centre d'apprentissage IT est le carnet de travail d'une seule personne qui se forme (réseau, systèmes, virtualisation, sécurité). Il se lit comme un manuel imprimé : papier chaud, longues lignes de texte serif, filets plutôt que boîtes, très peu d'effets. Le ton est direct et tutoyé (« Tu débutes ? »), en français, sans jargon marketing. Le site doit donner une impression de calme et de sérieux, pour étudier longtemps. Esprit : un livre technique bien composé, pas une application SaaS.

## Colors

- **Accent terre cuite** (`primary`) : l'action principale, les liens, l'état courant dans la navigation et la barre de progression de lecture. Jamais en décoration de fond large.
- **Sauge** (`semantic-success`) : réservée à ce qui est validé (module terminé, réponse juste). Le rouge brique (`semantic-error`) et l'ocre (`semantic-warning`) servent aux erreurs et aux mises en garde.
- **Texte** : `ink` pour le texte courant, `ink-muted` pour le secondaire, `ink-faint` pour les légendes seulement (4,9:1 minimum sur `surface-2`).
- **Fonds** : `canvas` (page), `surface-1` (cartes), `surface-2` (zones en retrait). Pas de dégradé hormis le halo terre cuite du bandeau d'accueil et la pastille du logo.
- **Thème sombre** : mêmes teintes en brun profond (`canvas-dark`, `surface-dark`, `ink-dark`, accent `primary-dark`), suivi du système ou choix du visiteur (`localStorage`, clé `cai.theme`). Les couleurs ne sont jamais écrites en dur dans un composant : tout passe par les variables CSS de `assets/theme.css`.
- Contraste du texte : au moins 4,5:1 sur son fond, dans les deux thèmes.

## Typography

- Polices chargées depuis Google Fonts : **Newsreader** (titres et lecture, serif), **Instrument Sans** (interface : navigation, boutons, légendes), **IBM Plex Mono** (commandes et code). Replis : Georgia, system-ui, Consolas.
- Un seul titre `display` (h1) par page. Les titres utilisent `text-wrap: balance`, les paragraphes `text-wrap: pretty`.
- Corps à 16 px minimum, interligne 1,7, largeur de lecture limitée à 42 rem (environ 70 caractères).
- Français : majuscule au premier mot des titres seulement, guillemets « » avec espaces insécables, pas de Title Case.

## Layout

- Largeur maximale du site : 1200 px, marges latérales de 28 px en bureau, 16 px au minimum en mobile.
- Page de module : colonne de sommaire de 240 px à gauche (au-dessus de 900 px) et colonne de lecture à droite ; une seule colonne en dessous.
- Sections séparées par un filet (`hairline`), pas par des boîtes. Espacement vertical entre grandes sections : `spacing.section`.
- Navigation fixe en haut (60 px), translucide avec flou, avec lien actif marqué par `aria-current`.

## Elevation & Depth

Presque aucune ombre : la profondeur vient des aplats `surface-1` / `surface-2` et des filets. Une seule ombre portée existe, pour la palette de recherche (Ctrl+K) et les fenêtres qui flottent au-dessus de la page.

## Shapes

Angles discrets : `rounded.md` (4 px) pour les champs et petits éléments, `rounded.lg` (6 px) pour cartes, encadrés et terminaux, `rounded.nav` (9 px) pour les boutons de la barre de navigation. Pas de pilules, pas de coins vifs.

## Components

- **Navigation** : logo pastille (moitié terre cuite, moitié brun) + nom, liens en Instrument Sans 13,5 px, boutons Recherche / Thème. Survol : fond `surface-2`. Page courante : fond `primary-soft`.
- **Cartes de module et de parcours** : fond `surface-1`, filet, pas d'ombre ; le survol change la bordure.
- **Encadrés** (note, succès, erreur, attention) : fond teinté `-soft`, texte de la teinte foncée, jamais de couleur seule : toujours un titre ou un libellé.
- **Terminal** : toujours sombre, même en thème clair, avec un bouton Copier visible au survol et au focus clavier.
- **Focus** : contour de 2 px couleur `primary`, décalage de 2 px, sur tout élément interactif.
- **Mouvement** : transitions de 160 à 260 ms, désactivées sous `prefers-reduced-motion: reduce`.

## Do's and Don'ts

### Do

- Une seule action principale par écran, en terre cuite.
- Réutiliser une variable existante avant d'en créer une.
- Donner à chaque bouton-icône un nom accessible, à chaque champ une étiquette, à chaque image un texte alternatif.
- Garder les cibles tactiles à 44 × 44 px minimum en mobile.

### Don't

- Pas de couleur écrite en dur dans un composant.
- Pas de majuscules sur plus de 3 mots, pas de Title Case.
- Pas d'animation qui ignore `prefers-reduced-motion`.
- Jamais de mot de passe, d'identifiant ou d'IP réelle des notes de cours dans une page.

## Responsive Behavior

- Points de rupture utilisés : 520, 700, 900 et 1100 px.
- En dessous de 900 px, le sommaire de module passe au-dessus du contenu ; la navigation passe à la ligne et les libellés des boutons se réduisent à leur icône.
- Zones cliquables d'au moins 44 × 44 px sur mobile.
- Aucun défilement horizontal de la page : les blocs de code défilent à l'intérieur de leur cadre.

## Iteration Guide

- Toute nouvelle couleur, taille ou ombre s'ajoute **d'abord ici**, puis dans `assets/theme.css`.
- Vérifier le rendu (bureau et mobile, clair et sombre) après chaque changement d'interface.
- Version de l'assets : incrémenter le paramètre `?v=` des fichiers `theme.css`, `app.js`, etc. quand on les modifie, pour contourner le cache.

## Choix à confirmer

Décidés seul, d'après ce que le site utilise déjà (aucune question posée) :

1. **Public et ton** : une seule personne en formation, tutoiement et français conservés tels que dans les pages.
2. **Couleurs et polices** : reprises à l'identique de `assets/theme.css` (aucune nouvelle teinte) ; Newsreader, Instrument Sans et IBM Plex Mono conservées.
3. **Logo** : il n'y a pas de fichier logo ; j'ai décrit la pastille CSS (terre cuite / brun) comme logo officiel.
4. **Sites de référence** : aucun cité, l'esprit « livre technique » est déduit du CSS (commentaire d'en-tête de `theme.css`).
5. **Tailles de titres** (56 px / 32 px) : valeurs approchées, à ajuster si tu veux les figer.
6. **Favicon** : le site n'en a pas ; j'en ajouterai un en SVG dans les couleurs de la pastille.
7. **Ligne `CLAUDE.md`** : le dépôt n'a pas de `CLAUDE.md` ; je n'en crée pas, DESIGN.md se cite avec `@DESIGN.md`.
