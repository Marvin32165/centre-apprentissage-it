# Plateforme d'apprentissage IT

Tout en français. Le plan de travail est dans `docs/PLAN.md` : lis-le, fais **uniquement le lot demandé**, coche-le, puis arrête-toi.

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
Polices : Newsreader, Instrument Sans, IBM Plex Mono et IM Fell English si elles sont déjà installées ; sinon Georgia, system-ui et Consolas ou monospace. Aucune police distante n’est chargée. Barre sombre `#2C1F16` (sombre : `#0E0B08`).
Identités « Poste de garde » (plateforme) et « Le Livre du montage » (atelier) : le détail (jetons, typographie, composants, pages) est dans `docs/REFONTE.md`, qui fait foi. Composants de référence : `docs/composants.html`. Mobile d'abord, contrastes AA, cibles tactiles ≥ 44 px, `prefers-reduced-motion` respecté.

## Règles techniques
- HTML, CSS et JS natifs, sans dépendance externe ni étape de build. Une seule feuille de style commune (`assets/style.css`), un script commun (`assets/app.js`), des données dans `assets/*.js`.
- Ça doit marcher sur GitHub Pages **et** en ouvrant les fichiers en local (pas de `fetch` de JSON local).
- Progression en `localStorage`, clés préfixées `it.`, accès dans un try/catch. Jamais de `alert`/`confirm`.
- Contenu : rien d'inventé. La théorie cite sa source officielle (Microsoft Learn, Cisco, Debian, RFC, ITIL, constructeurs) dans un encadré. Ce qui dépend de l'UMONS est marqué « à vérifier sur place ».
- Pédagogie : « je montre, on fait ensemble, tu fais seul ». Les corrections sont toujours cachées (`<details>`).

## Façon de travailler (Marvin a un quota limité)
- Travaille sur une branche `lot-N`, fusionne dans `main` seulement quand le lot est terminé et vérifié (pages ouvertes sans erreur console).
- Économise : ne relis pas les fichiers que tu viens d'écrire, pas d'exploration inutile, une seule vérification visuelle par lot, pas de longs récapitulatifs.
- En fin de lot : coche-le dans `docs/PLAN.md`, note en une ligne ce qui reste, puis donne un résumé de 5 lignes maximum.

## Structure et contrôles
- Pages : `index.html`, `stage/`, `modules/`, `themes.html`, `atelier/` et `404.html` ; documents de travail dans `docs/`.
- `assets/style.css` est la feuille commune ; `app.js` gère la navigation, la recherche, les quiz et la progression ; `accueil.js`, `jour.js` et `modules-ui.js` pilotent leurs interfaces.
- L'atelier utilise `atelier.js`, `atelier-pannes.js`, `atelier-art.js`, `atelier-index.js`, ses données et les moteurs de règles séparés ; ne pas modifier les règles sans demande explicite.
- `node outils/index-recherche.mjs` régénère l'index après ajout de pages ou sections ; `node outils/verif.mjs` vérifie les pages, avec `--file` pour le mode local. Playwright est nécessaire aux contrôles, pas au site.
- Les scripts `outils/accessibilite-lot-13.mjs`, `outils/contrastes-lot-13.mjs` et `outils/parcours-lot-13.mjs` complètent les vérifications au navigateur.
