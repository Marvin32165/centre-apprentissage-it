# Test en situation — stage/j5.html (labo sans machine virtuelle)

Test du 26/11/2026 selon `docs/procedures/test-chef.md`, par un agent qui n'a pas écrit la page. Usage : stagiaire sur Windows 11 Famille, sans VM, en Wi-Fi sur sa box, page suivie à 1280 px puis relue à 390 px. Critères 2 à 8 réussis ; critère 1 (labo) raté.

| Constat | Gravité | Suivi |
|---|---|---|
| Repères muets sur les étapes 3 à 5 (sauts de `tracert`, serveur DNS qui répond, `TcpTestSucceeded`) et sur l'exercice papier (phrase à l'utilisateur, panne 3 incomplète) | bloquant | **Corrigé** : repères « Chemin », « DNS », « Port », panne 3 complète, une phrase type à l'utilisateur pour chaque panne. |
| Étape 2 (`ipconfig /release`, `/renew`) sans consigne de droits ni plan de secours ; une seule coupure annoncée | gênant | **Corrigé** : Wi-Fi qui tombe, Terminal administrateur si Windows le demande, désactiver puis réactiver le Wi-Fi ou redémarrer si `/renew` échoue ; deux coupures annoncées. |
| Le labo ne dit pas d'utiliser PowerShell | gênant | **Corrigé** : ouvrir le Terminal (PowerShell) au début du labo. |
| Repère « Nom introuvable » assimilé à la panne 3 | gênant | **Corrigé** : comparaison avec `example.org` qui se résout ; avec un DNS faux, aucun nom ne se résoudrait. |
| Fiche imprimée : valeurs qui commencent par « : » | mineur | **Corrigé** : la typographie (espace insécable) s'appliquait avant la construction de la fiche ; `initTypo` passe maintenant après les autres scripts, et la fiche retire aussi l'espace insécable (jours et modules). |
| Circuits d'escalade des cas 1 et 4 non marqués | mineur | **Corrigé** : « circuit d'escalade à vérifier sur place ». |
| Liens eduroam.org en 403 pour un robot | mineur | **Justifié** : protection anti-robots de Cloudflare, liens à confirmer à la main. |
