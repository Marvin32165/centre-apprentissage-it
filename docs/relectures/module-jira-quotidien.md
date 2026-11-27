# Relecture des sources : modules/jira-quotidien.html

- Page relue : `modules/jira-quotidien.html` (branche `chatgpt-27-11`) et son quiz `module-jira-quotidien` dans `assets/modules-quiz.js`.
- Date : 27/11/2026
- Outil : Claude Code (la page a été rédigée par ChatGPT / Codex)
- Méthode : `docs/procedures/relecture-sources.md`. Chaque verdict repose sur une page Atlassian ouverte pendant la relecture.

| Affirmation (section) | Verdict | URL de la source ouverte | Correction nécessaire |
|---|---|---|---|
| Une file affiche les demandes qui satisfont un filtre (§1) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/what-are-queues/ | — |
| « Une demande peut apparaître dans plusieurs files » (§1) | non vérifié | what-are-queues, how-are-queues-used-in-jira-service-management, sort-requests-within-a-queue | Remplacer par : « Une file montre des demandes selon leur type, leur statut ou une instruction JQL plus précise. » (https://support.atlassian.com/jira-service-management-cloud/docs/create-a-new-queue/) |
| Filtres par type de demande, statut, personne assignée (§1) | correct | what-are-queues | — |
| Tri par colonne (§1) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/sort-requests-within-a-queue/ | — |
| `assignee IS EMPTY` (§1, Q1) | correct | https://support.atlassian.com/jira-software-cloud/docs/jql-operators/ | Ajouter ce lien à l'encadré du §1. |
| `statusCategory != Done` (§1, Q1) | correct | https://support.atlassian.com/jira/kb/how-to-search-using-statuscategory-statuscategorychangeddate-function-with-jql/ | — |
| `ORDER BY created ASC` (§1) | correct | https://support.atlassian.com/jira-software-cloud/docs/jql-keywords/ | Ajouter ce lien. |
| Un SLA mesure le délai par rapport à un objectif (§2) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/what-are-slas-and-how-do-i-view-them-in-my-service-project/ | — |
| Première réponse et résolution mesurées séparément (§2, Q2, cas 1) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/create-an-sla/ | — |
| Conditions de début, pause, fin (§2) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/set-up-sla-conditions/ | Ajouter ce lien à l'encadré du §2. |
| Le calendrier détermine les heures comptées (§2) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/set-up-sla-calendars/ | Ajouter ce lien. |
| Temps restant lisible dans le ticket ou la file ; pause seulement si configurée ; objectif dépassé signalé (§2) | correct | what-are-slas…, set-up-sla-conditions | — |
| Reply to customer / Add internal note (§3, Q3) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/talk-to-the-customer-or-team-members-from-the-new-issue-view/ | — |
| Link work item, types *relates to*, *is blocked by* (§4, Q4) | correct | https://support.atlassian.com/jira-service-management-cloud/docs/link-issues-pages-and-app-content-from-the-issue-view/ | — |
| Une relation a un sens (§4, mémo) | correct | https://support.atlassian.com/jira-cloud-administration/docs/configure-issue-linking/ | Lien facultatif. |
| Base de connaissances liée, visibilité des articles, partage interne / externe (§5, cas 2, Q5) | correct | respond-with-an-article-from-the-issue-view, use-internal-articles-in-the-knowledge-base-panel | — |
| Réponses types personnelles et partagées, variables (§5) | correct | insert-a-canned-response, create-a-canned-response | — |
| Déclencheur, condition, action ; journal d'audit (§6, labo, Q6) | correct | https://support.atlassian.com/cloud-automation/docs/what-are-automation-rules/ , view-execution-data-for-a-rule | — |
| Une offre gratuite existe (labo) | correct | https://support.atlassian.com/jira-cloud-administration/docs/explore-jira-cloud-plans/ (Free : jusqu'à 3 agents) | Ajouter ce lien à l'encadré du labo. |
| Corrigés du labo et quiz Q1 à Q6 | correct | pages ci-dessus | Q1 : « non assigné et non terminé » plus exact que « en cours » (facultatif). |

## Contrôles complémentaires
- « À vérifier sur place » présent ; aucune donnée privée.
- « Mises en situation » sans encadré source : en ajouter un (conditions des SLA, visibilité des articles, liens).

## Bilan
- Affirmations vérifiées : 37 · Faux : 0 · Non vérifié : 1 (plusieurs files).

---

# Test en situation (test-chef.md), 27/11/2026

## modules/jira-quotidien.html — critères 1 et 7 ratés
1. Labo, étape 2 : la correction parle de « la relation choisie dans l'exercice », qui n'en choisit aucune. Attendu : la relation et son sens depuis LAB-2.
2. Labo, étape 3 : le tableau n'a pas de colonne « type » ; la condition « type = Incident d'impression » ne peut pas se trancher.
3. Labo, étape 1 : « En cours, 15 minutes » ne dit pas si c'est restant ou écoulé. Attendu : « 15 min restantes ».
4. À 390 px, le tableau du labo (665 px) défile horizontalement et cache la colonne SLA ; le bloc JQL est coupé.
Le reste (quiz, corrections, progression, recherche, impression A4, liens, UMONS) fonctionne.

## modules/sauvegarde-restauration.html — huit critères réussis
- Ce qui manque pour l'usage : « sauvegarder avant une intervention » n'est pas pratiqué dans le labo (copie vers un support distinct, restauration d'un échantillon ailleurs, contrôle).

## Corrections (27/11/2026, Claude Code)
- « Plusieurs files » remplacé par la phrase sourcée (create-a-new-queue).
- Sources ajoutées : opérateurs et mots-clés JQL, conditions et calendriers SLA, sens des relations, offres Jira Cloud ; encadré source sous les mises en situation.
- Labo : colonne « Type de demande », « 15 min restantes » / « 40 min restantes », relation attendue (*relates to*, lue depuis LAB-2) et correction de l'étape 3 sans conditionnel ; tableau en lignes simples, empilé au téléphone.
- Quiz Q1 : « non assigné et non terminé ».
