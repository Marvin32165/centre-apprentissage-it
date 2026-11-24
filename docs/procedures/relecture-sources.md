# Procédure — relire les faits d'une page contre les sources

Pour tout agent. À faire par un agent **qui n'a pas écrit la page** (nouvelle conversation, idéalement l'autre outil). Inspirée de l'agent `evidence-reviewer` du dépôt `claude-tools`.

Prompt type : « Lis `docs/procedures/relecture-sources.md` et relis `modules/<id>.html`. »

## Ce que tu fais
1. Lis la page indiquée, et seulement elle (plus son quiz dans `assets/modules-quiz.js` ou `assets/prepa.js`).
2. Relève chaque affirmation technique vérifiable : commande et ses options, valeur, nom de rôle ou de service, étape de procédure, définition ITIL, norme, réponse de quiz.
3. Pour chacune, ouvre réellement une source primaire (Microsoft Learn, Cisco, Debian, RFC, AXELOS / ITIL, JEDEC, PCI-SIG, constructeur). Pas de blog, pas de mémoire. Commence par l'URL citée dans l'encadré `callout source` de la section.
4. Vérifie aussi :
   - ce qui dépend de l'UMONS est marqué « à vérifier sur place » et n'est pas présenté comme un fait ;
   - chaque section a son encadré source ;
   - aucune donnée privée (nom de personne, IP publique réelle, mot de passe).

## Ce que tu rends
Un tableau, sans rien modifier dans le dépôt :

| Affirmation (section) | Verdict | URL de la source ouverte | Correction nécessaire |
|---|---|---|---|

- Verdict : **correct**, **faux** ou **non vérifié** (dire quelle preuve manque).
- Ne liste pas les affirmations triviales ; ne donne pas d'avis de style.
- Termine par le nombre de « faux » et de « non vérifié ». Si tout est correct : « Rien à corriger » et le nombre d'affirmations vérifiées.

La correction revient à l'agent qui a écrit la page.
