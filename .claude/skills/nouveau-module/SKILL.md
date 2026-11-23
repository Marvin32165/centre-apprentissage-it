---
name: nouveau-module
description: Ajoute un module à la plateforme (page, données, quiz, relecture croisée, contrôles) en suivant docs/procedures/nouveau-module.md. À utiliser quand Marvin demande un nouveau module ou un lot « module ».
---

Sujet du module : $ARGUMENTS

1. Lis `docs/procedures/nouveau-module.md` : c'est la procédure qui fait foi (commune avec ChatGPT / Codex). Suis-la étape par étape.
2. Ne lis que les fichiers qu'elle cite.
3. À l'étape N.3, lance l'agent `relecteur-sources` puis l'agent `chef` sur la page (contextes séparés). Indique à Marvin qu'une relecture par l'autre outil (ChatGPT) est encore meilleure : prompt dans `AGENTS.md`.
4. Après chaque sous-étape : coche-la dans `docs/PLAN.md` (« Fait : … »), commite en français, pousse.
