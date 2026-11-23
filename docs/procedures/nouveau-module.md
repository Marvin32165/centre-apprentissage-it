# Procédure — ajouter un module

Pour tout agent (Claude Code, ChatGPT / Codex). Un module = un lot. Règles générales : `AGENTS.md`.

## 0. Préparer
1. `git fetch origin` ; continuer la branche `lot-N` si elle existe, sinon la créer depuis `main`.
2. Ajouter le lot dans `docs/PLAN.md` (avant « Ensuite ») avec les sous-étapes N.1 à N.4 ci-dessous ; commit, push.
3. Lire `docs/gabarit-module.html` (trame et squelette) et un module récent comme exemple de niveau attendu (`modules/materiel-pc.html`). Ne pas lire tout le site.

## N.1 — Page `modules/<id>.html`
- Copier le gabarit, remplacer `gabarit` par `<id>` (`data-module-meta`, `data-module-suite`, `data-quiz`, `data-done` = `module-<id>`), adapter `<title>`, `description`, Open Graph.
- Trame : objectifs · « Je montre » (théorie courte, **un encadré `callout source` par section** avec l'URL officielle) · « On fait ensemble » (labo faisable chez soi : VM Hyper-V, Windows 11 / Server, Jira gratuit) · « Tu fais seul » (mises en situation) · quiz · fiche mémo (`#memo`) · questions pour le tuteur · case « terminé » · suite.
- Chaque `h2` a un `id` stable (il sert à la recherche et aux liens de l'atelier).
- Corrections **toujours** dans `<details class="correction">`.
- Ce qui dépend de l'UMONS : encadré `callout umons`, « à vérifier sur place ».
- Rien d'inventé : une valeur, un code ou un nom non sourcé est retiré ou marqué « à vérifier ». Aucun nom de personne, IP réelle ou mot de passe (le dépôt est public) : adresses en `192.168.x.x`, `10.x`, `172.16.x`, domaines en `.local` ou `example.org`.

## N.2 — Données
- `assets/modules.js` : entrée dans `modules` (`id`, `titre`, `domaine`, `niveau` 1–3, `duree` en minutes = estimation, `prerequis`, `resume`, `tags`, `prepa`, `suite`) ; retirer le sujet de `aVenir` de son domaine s'il y figurait.
- `assets/modules-quiz.js` : quiz `module-<id>`, 6 questions, bonne réponse à des positions variées, explication sourcée.
- `assets/data.js` : `module-<id>` dans les `units` de la rubrique « modules ».
- Si le module couvre un thème « à revoir » de l'atelier : `A.moduleRevoir` dans `assets/atelier-scenarios.js` (pas les moteurs `atelier-*-regles.js`).

## N.3 — Relecture croisée (agent séparé)
Dans une **nouvelle conversation**, de préférence avec l'autre outil (ChatGPT relit Claude, ou l'inverse) :
1. `docs/procedures/relecture-sources.md` sur la page → corriger chaque « faux » et « non vérifié ».
2. `docs/procedures/test-chef.md` avec l'usage « préparer mon stage avec ce module » → corriger ce qui bloque.
Noter le résultat sous N.3 dans `docs/PLAN.md` (« Fait : relecture, n corrections »). Trois tours au plus, ensuite Marvin tranche.

## N.4 — Contrôles et fusion
`npm run index` · `npm run garde` · `npm run controles` (0 problème) · cocher le lot · fusion `--no-ff` dans `main`.
