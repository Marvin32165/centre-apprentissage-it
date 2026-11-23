# Plateforme d'apprentissage IT — règles communes des agents

Tout en français. Ce fichier est la règle commune à tous les agents (Claude Code lit `CLAUDE.md`, qui l'importe ; ChatGPT / Codex lisent `AGENTS.md`). Le plan de travail est dans `docs/PLAN.md` : lis-le, fais **uniquement le lot demandé**, coche-le, puis arrête-toi.

## Vision
Plateforme d'apprentissage IT indépendante, appelée à devenir une grande base de connaissances. Priorité : le stage de Marvin, « Service desk – Support et Services » à la DSI de l'UMONS (Mons), à partir du lundi 7/12/2026 (du 7 au 18/12, puis du 4/01 au 5/02/2027, de 8h30 à 16h). Missions de la convention : appels téléphoniques, tickets Jira, dépannage à distance et sur site, projets salles informatiques, réception des colis, installation et intégration de PC ; plus tard, maintenance (pôle opération) et projets avec des experts (N4).

Rubriques : Accueil · Prépa stage · Modules · Thèmes · Atelier hardware (voir `docs/PLAN.md`).

## Dépôts
- Ce dépôt est **public** et le seul à modifier. Rien de privé (mots de passe, IP réelles, noms de personnes).
- `Marvin32165/centre-de-notes` = les notes de Marvin : ne jamais y écrire. Lecture permise seulement pour `assets/theme.css` et la liste des thèmes. Le contenu du nouveau site n'est pas tiré des notes.
- L'ancien site est dans l'historique Git (commit `28e8709`) : ne pas le réutiliser comme base.
- Brouillon réutilisable : branche `brouillon-prepa` (squelette, styles, jour 1 de la prépa). À adapter à la DA, pas à recopier tel quel.

## Direction artistique (celle des notes de Marvin)
Clair : papier `#F3EEE5`, surface `#F9F6F0`, bordure `#DDD3C3`, encre `#1B1713`, encre douce `#544A40`, encre pâle `#6B5F52`, accent rouille `#9C3F1D` (soft `#F1E2D6`), vert `#3F6140`, rouge `#9A3524`, ambre `#7C561A`.
Sombre : papier `#13100D`, surface `#1A1612`, bordure `#312A23`, encre `#EDE6DA`, encre douce `#BBAF9F`, accent `#E3916A`, vert `#94B98C`, rouge `#E88D79`, ambre `#D9AE66`.
Polices : Newsreader (titres, texte), Instrument Sans (interface), IBM Plex Mono (code, étiquettes), via Google Fonts avec repli Georgia / system-ui / Consolas ; IM Fell English et IM Fell English SC pour l'atelier seulement. Le lien Google Fonts fait partie de la DA : **ne pas le retirer** (c'est la seule ressource externe autorisée). Barre sombre `#2C1F16` (sombre : `#0E0B08`).
Identités « Poste de garde » (plateforme) et « Le Livre du montage » (atelier) : le détail (jetons, typographie, composants, pages) est dans `docs/REFONTE.md`, qui fait foi. Composants de référence : `docs/composants.html`. Mobile d'abord, contrastes AA, cibles tactiles ≥ 44 px, `prefers-reduced-motion` respecté.

## Règles techniques
- HTML, CSS et JS natifs, sans dépendance externe ni étape de build (seule exception : les polices Google Fonts ci-dessus). `package.json` ne sert qu'aux outils de contrôle, jamais au site. Une seule feuille de style commune (`assets/style.css`), un script commun (`assets/app.js`), des données dans `assets/*.js`.
- Ça doit marcher sur GitHub Pages **et** en ouvrant les fichiers en local (pas de `fetch` de JSON local).
- Progression en `localStorage`, clés préfixées `it.`, accès dans un try/catch. Jamais de `alert`/`confirm`.
- Contenu : rien d'inventé. La théorie cite sa source officielle (Microsoft Learn, Cisco, Debian, RFC, ITIL, constructeurs) dans un encadré. Ce qui dépend de l'UMONS est marqué « à vérifier sur place ».
- Pédagogie : « je montre, on fait ensemble, tu fais seul ». Les corrections sont toujours cachées (`<details>`).

## Façon de travailler (Marvin a un quota limité)
- Travaille sur une branche `lot-N`, fusionne dans `main` (merge `--no-ff`) seulement quand le lot est terminé et vérifié (`npm run controles` sans problème).
- Économise : ne relis pas les fichiers que tu viens d'écrire, pas d'exploration inutile, une seule vérification visuelle par lot, pas de longs récapitulatifs.
- En fin de lot : coche-le dans `docs/PLAN.md`, note en une ligne ce qui reste, puis donne un résumé de 5 lignes maximum.

## Structure et contrôles
- Pages : `index.html`, `stage/`, `modules/`, `themes.html`, `atelier/`, `404.html` ; documents de travail dans `docs/` (`PLAN.md`, `REFONTE.md`, `composants.html`, `recherche.html`, `captures/`).
- `assets/style.css` est la feuille commune ; `app.js` gère en-tête, thème, navigation, recherche, quiz, progression et `it.reprise` ; `accueil.js`, `jour.js` et `modules-ui.js` pilotent leurs pages ; les données sont dans `data.js`, `prepa.js`, `modules.js`, `modules-quiz.js`, `recherche.js` (généré).
- L'atelier : `atelier.js`, `atelier-pannes.js`, `atelier-art.js`, `atelier-index.js` (affichage) et leurs données ; les moteurs de règles `atelier-regles.js` et `atelier-pannes-regles.js` ne changent pas sans demande explicite.
- Installation des outils (une fois) : `npm install` puis `npx playwright install chromium`. Le site, lui, s'ouvre sans rien installer.
- Commandes : `npm run index` (régénère l'index de recherche après ajout de pages ou de sections `h2[id]`) ; `npm run verif` (audit complet : 4 largeurs, clair et sombre), `npm run verif:local` (même chose en `file://`), `npm run verif:rapide` (390 et 1280 px) ; `npm run accessibilite`, `npm run contrastes`, `npm run parcours` ; `npm run controles` lance tout. Le workflow `.github/workflows/audit.yml` refait ces contrôles sur chaque branche `lot-*`.

## Travailler à plusieurs agents (Claude Code et ChatGPT / Codex)
- **Un seul agent à la fois sur un lot.** Avant de commencer : `git fetch origin` ; si la branche `lot-N` existe, continue-la au lieu d'en créer une autre.
- **Reprise sans perte** : découpe le lot en sous-étapes cochables dans `docs/PLAN.md` ; après chaque sous-étape, coche-la avec une ligne « Fait : … » ou « Justifié : … », commite en français, puis pousse la branche. Un agent qui reprend lit `docs/PLAN.md` et continue à la première case non cochée.
- **Jamais** de `push --force`, de réécriture d'historique ni de commit direct sur `main` hors fusion d'un lot terminé.
- **Désaccord avec ces règles ou avec `docs/REFONTE.md`** (par exemple retirer les polices, changer une couleur, supprimer une fonction) : ne le fais pas ; écris « Question pour Marvin : … » sous le lot dans `docs/PLAN.md` et passe à la suite.
- Messages de commit : une phrase en français qui dit ce qui change ; pas de nom de modèle dans les commits ni dans le code.
- Prompts types :
  - lancer : « Lis AGENTS.md et docs/PLAN.md, puis fais le lot N. »
  - reprendre : « Lis AGENTS.md et docs/PLAN.md, et reprends le lot N à la première sous-étape non cochée (branche lot-N). »
