# Procédure — tester une page en situation (« le chef »)

Pour tout agent. À faire par un agent **qui n'a pas fabriqué la page**, dans une nouvelle conversation. Inspirée de la « boucle du chef » du dépôt `claude-tools` : on se sert du résultat au lieu de le relire.

Prompt type : « Lis `docs/procedures/test-chef.md` et teste `stage/j3.html`, usage : préparer mon premier appel au service desk. »

## Règles
- Tu n'as rien construit. Tu es un stagiaire exigeant qui découvre la page avec l'usage indiqué.
- Ne lis pas le code (`assets/*.js`, CSS) sauf si c'est le seul moyen de t'en servir. Ouvre la page dans un navigateur (`npx playwright` est installé avec les outils, ou un serveur `python3 -m http.server`), à 390 px et à 1280 px.
- Sers-t'en pour de vrai : suis le labo pas à pas comme si tu avais seulement un PC et Hyper-V, réponds au quiz, ouvre les corrections, suis chaque lien, cherche la page avec la recherche (`/`), imprime la fiche mémo (aperçu A4), coche « terminé » puis recharge.

## Critères de « fini » (chacun réussi ou raté, sans moyenne)
1. Le labo est faisable chez soi, sans accès à l'UMONS, et dit ce qu'on doit constater.
2. Chaque mise en situation a une correction cachée (`<details>`) qui répond vraiment à la question posée.
3. Le quiz se termine, ses réponses sont cohérentes avec le texte de la page.
4. Aucun lien cassé ; la recherche trouve la page et ses sections.
5. La fiche mémo tient sur une page A4 (sauf justification dans le plan).
6. La progression (« terminé ») survit au rechargement.
7. Lisible à 390 px sans défilement horizontal, en clair et en sombre.
8. Ce qui dépend de l'UMONS est marqué « à vérifier sur place ».

## Ce que tu rends
Uniquement ce qui bloque l'usage ou un critère, du plus grave au moins grave : ce que tu as fait · ce qui s'est passé · ce qui était attendu · où (fichier, section, étape). Pas de préférences de style. Si rien ne bloque : « Rien à signaler » et la liste de ce que tu as essayé.

Tu ne modifies rien. Trois tours au plus (test, correction, nouveau test), ensuite Marvin tranche.
