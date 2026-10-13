---
name: design-md
description: Rédige le DESIGN.md du projet (charte graphique écrite : couleurs, polices, espacements, composants, règles) à partir du modèle, après quelques questions. Pour toute interface, suivre ensuite DESIGN.md.
argument-hint: "[sites de référence, couleurs ou logo existants]"
disable-model-invocation: true
---

Informations de départ : $ARGUMENTS

1. **Existant.** Si `DESIGN.md` existe déjà à la racine, le lire et proposer seulement des modifications. Sinon, chercher ce que le projet utilise déjà (variables CSS, configuration Tailwind, thème, polices chargées, logo) : la charte doit décrire ce qui existe avant d'inventer.
2. **Questions.** Me poser au plus 5 questions courtes, en une fois : public visé, impression à donner, couleurs ou logo imposés, sites aimés (pour l'esprit, pas pour les copier), choses à éviter. Attendre mes réponses.
3. **Rédaction.** Écrire `DESIGN.md` à la racine en suivant la structure de [modele.md](modele.md) : en-tête YAML (valeurs) puis sections en prose (règles). Remplacer toutes les valeurs et tous les commentaires `<!-- -->` du modèle. Ne jamais reprendre la palette, la police ou un élément signature d'une marque existante.
4. **Contrôle.** Vérifier le contraste texte / fond (au moins 4,5:1) et que chaque valeur du code existant a sa place dans le fichier. Si possible, lancer `npx @google/design.md lint DESIGN.md` et corriger les erreurs.
5. **Branchement.** Proposer d'ajouter dans `CLAUDE.md` la ligne : « Pour toute interface, suivre DESIGN.md (le lire avant de coder) ». Ne pas l'importer avec `@` : il serait chargé à chaque session.
6. **Fin.** Me résumer en 5 lignes la charte obtenue et les choix que j'ai à confirmer.
