---
version: alpha
name: mon-projet
description: "Une phrase qui résume l'ambiance du site : à qui il parle, quelle impression il doit laisser. Remplacer toutes les valeurs ci-dessous par celles du projet."

colors:
  primary: "#2457d6"
  on-primary: "#ffffff"
  primary-hover: "#1d47b0"
  ink: "#16181d"
  ink-muted: "#4a4f5a"
  canvas: "#ffffff"
  surface-1: "#f5f6f8"
  hairline: "#e2e4e9"
  semantic-success: "#1a7a43"
  semantic-error: "#c62f2f"

typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1px
  headline:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  button:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  pill: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  caption-text:
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
  divider:
    backgroundColor: "{colors.hairline}"
  alert-success:
    backgroundColor: "{colors.semantic-success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  alert-error:
    backgroundColor: "{colors.semantic-error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
---

## Overview

<!-- 3 à 5 phrases : public visé, ton (sobre, chaleureux, technique…), ce que le site doit faire ressentir, et 1 ou 2 sites de référence pour l'esprit (pas à copier). -->

## Colors

- **Primaire** (`primary`) : uniquement pour l'action principale de chaque écran et les liens. Jamais en décoration.
- **Texte** (`ink`, `ink-muted`) : `ink` pour le texte courant, `ink-muted` pour les informations secondaires.
- **Fonds** (`canvas`, `surface-1`) : alterner pour séparer les sections, sans dégradé.
- **États** (`semantic-*`) : succès et erreur seulement, toujours accompagnés d'un texte ou d'une icône.
- Contraste du texte : au moins 4,5:1 sur son fond.

## Typography

- Police : <!-- nom, et où elle est chargée (Google Fonts, fichier local) ; police de remplacement -->.
- Un seul titre `display` par page. Titres sur 2 lignes maximum.
- Corps de texte à 16 px minimum, lignes de 60 à 75 caractères.

## Layout

- Largeur maximale du contenu : <!-- ex. 1120px -->, marges latérales de `spacing.md` sur mobile.
- Espacements uniquement tirés de l'échelle `spacing` ; `section` entre deux grandes sections.
- Grille : <!-- ex. 12 colonnes en bureau, 1 colonne en mobile -->.

## Elevation & Depth

<!-- Ex. : pas d'ombre ; la profondeur vient des fonds `surface-1` et des bordures `hairline`. -->

## Shapes

<!-- Ex. : `rounded.md` pour boutons et champs, `rounded.lg` pour les cartes ; photos sans arrondi. -->

## Components

<!-- Décrire chaque composant important : boutons, cartes, formulaires, navigation, pied de page. États hover, focus visible, désactivé. -->

## Do's and Don'ts

### Do

- <!-- ex. Une seule action principale par écran. -->

### Don't

- <!-- ex. Pas de texte en majuscules sur plus de 3 mots. -->

## Responsive Behavior

- Points de rupture : <!-- ex. 640px, 1024px -->.
- Zones cliquables d'au moins 44 × 44 px sur mobile.

## Iteration Guide

- Toute nouvelle couleur, taille ou ombre s'ajoute **d'abord ici**, puis dans le code.
- Vérifier le rendu (bureau et mobile) après chaque changement d'interface.
