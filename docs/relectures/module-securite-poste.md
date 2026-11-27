# Relecture des sources — module « Sécurité du poste »

- Page relue : `modules/securite-poste.html` et quiz `module-securite-poste`
- Date : 27/11/2026
- Outil : Claude Code, agent relecteur séparé (n'a pas écrit la page)
- Sources ouvertes : Microsoft Support (en-us et fr-fr), Microsoft Learn (en-us et fr-fr), CISA (page ouverte).

| Affirmation (section) | Verdict | Source ouverte | Correction |
|---|---|---|---|
| Encadré §1 et quiz Q1 : « Microsoft Support, Protect yourself from phishing » | **faux** | redirige vers https://learn.microsoft.com/en-us/defender-endpoint/malware/phishing | Source remplacée (Microsoft Learn, How to protect against phishing attacks). |
| §1 : sept signes d'hameçonnage, vérification par un canal connu, signalement à l'équipe de sécurité | correct | même page (en et fr-fr) | — |
| §2 : Sécurité Windows (Defender, pare-feu, Smart App Control), analyse rapide | correct | Microsoft Support, Rester protégé avec Sécurité Windows | — |
| §2 : « contrôle intelligent des applications » | non vérifié | pages fr-fr gardent « Smart App Control » | Terme anglais conservé seul. |
| Libellé « Protection contre les virus et menaces » (§2, labo, mémo) | non vérifié | pages fr-fr : « Protection contre les virus et les menaces » | Libellé aligné (à confirmer à l'écran). |
| Libellé « Historique de protection » | non vérifié | page dédiée fr-fr : « Historique de la protection » | Libellé aligné. |
| Historique : contenu, deux semaines ; quarantaine, Supprimer / Restaurer ; Autoriser sur l'appareil, dans le doute la quarantaine (§2, cas 2, Q2, Q3) | correct | Microsoft Support fr-fr, Historique de la protection | — |
| Après Restaurer, nouvel événement « Menace trouvée » | **faux** (libellé tronqué) | même page | « Menace trouvée - action nécessaire ». |
| Get-MpComputerStatus, AMRunningMode, propriétés ; tamper protection ; ne pas désactiver l'antivirus (§2, Q4) | correct | Microsoft Learn (Get-MpComputerStatus, MSFT_MpComputerStatus, Defender Antivirus in Windows, Tamper protection) | — |
| §3 : chemin et libellés Windows Update | non vérifié | Microsoft Support fr-fr : « Rechercher des mises à jour Windows », « Télécharger & installer », chemin Windows 11 | Libellés alignés, « (Windows 11) » précisé. |
| §3 : redémarrer pour appliquer ; fin de Windows 10 le 14/10/2025 ; ESU | correct | Microsoft Support fr-fr | — |
| §3 : « garde souvent des mises à jour en attente » | non vérifié | — | Reformulé sans « souvent ». |
| §4 : signes d'un compte compromis (boîte bloquée, règles, éléments envoyés, verrouillages, transfert externe) | correct | Microsoft Learn, Respond to a compromised email account | — |
| §4 : « une signature modifiée » | **faux** | même page (« Suspicious email message signatures ») | « signature de message suspecte (fausse signature bancaire, par exemple) ». |
| §4 : désactiver ou réinitialiser, pas de mot de passe par courriel, nettoyage (cas 1, Q5, mémo) | correct | même page | — |
| §4 et cas 1 : « depuis un appareil sain » | non vérifié | — | Retiré (« selon la procédure de la DSI »). |
| Cas 1 : « signaler toute notification MFA non demandée » | non vérifié | même page (revue des méthodes MFA) | Reformulé : noter les demandes MFA non faites, les administrateurs revoient les méthodes inscrites. |
| Quiz Q5 : « on ne supprime rien » attribué à Microsoft | non vérifié | — | Attribution limitée à ce que dit la source. |
| §5 : clés USB (risques, ne pas brancher, remettre au service désigné, AutoRun, page archivée de 2021) ; cas 3, Q6 | correct | https://www.cisa.gov/news-events/news/using-caution-usb-drives | — |
| §6 : Windows + L | correct | Microsoft Support fr-fr, raccourcis clavier | — |
| Labo : Start-MpScan ; autre antivirus affiché | correct | Microsoft Learn | — |
| Labo : pas d'encadré source | **faux** | règle de la procédure | Encadré ajouté (Get-MpComputerStatus, Start-MpScan, Defender Antivirus in Windows). |

## Bilan de la relecture
- Faux : 4 · Non vérifié : 8 · Correct : 36.

## Test en situation (test-chef.md), 27/11/2026
- Usage : un utilisateur a cliqué sur un lien douteux et Defender affiche une alerte ; vérifier l'état de son propre PC. Rien à signaler : huit critères réussis.
- Remarque commune : la recherche ignorait l'apostrophe typographique ’ (corrigé dans `app.js` et `glossaire-ui.js`).

## Corrections (27/11/2026, Claude Code)
- Toutes les lignes « faux » et « non vérifié » corrigées comme indiqué ; URL de la protection contre les falsifications mise à jour.
