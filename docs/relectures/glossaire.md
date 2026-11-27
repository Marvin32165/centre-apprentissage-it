# Relecture des sources : glossaire du service desk

- Page relue : `stage/glossaire.html` et ses données `assets/glossaire.js` (80 termes)
- Date : 27/11/2026
- Outil : Claude Code, agent de relecture séparé (nouvelle conversation, n'a pas écrit la page). Aucun fichier modifié par la relecture.

## Contrôles généraux
- Liens du site : corrects pour les 80 termes (ancres existantes, terme traité dans la section liée).
- Encadré UMONS et encadré source présents ; aucune donnée privée.
- Équivalents français Microsoft comparés aux pages fr-fr ; pas de documentation Atlassian en français (404).

## Tableau (résumé fidèle du rapport)

| Terme(s) | Verdict | Source ouverte | Correction |
|---|---|---|---|
| Change, Incident, Priority, Urgency, Service request, Workaround | correct | Atlassian (change, incidents, impact et urgence, demandes, problèmes) | — |
| Problem, Knowledge base, Queue, Domain controller, Remote Desktop, Port, Loopback | correct, source à préciser | Atlassian what-are-problems, what-is-a-knowledge-base, what-are-queues ; Microsoft Learn modèle logique d'AD, port d'écoute RDP, SMB | Sources remplacées ou complétées ; loopback : plage 127.0.0.0/8. |
| Event Viewer, Safe mode, Stop error, sfc, Task Manager, GPO, OU, Kerberos, SID, messagerie (Full Access, Send As, Send on Behalf, mode mis en cache, fichiers à la demande, PST/OST, MFA, correspondance de nombres), Quick Assist, Ransomware, réseau (bail DHCP, DNS, lien local, NAT, préfixe, adresses privées), BitLocker, Secure Boot | correct | Microsoft Learn / Support (en et fr-fr), RFC, IANA, CISA | — |
| VLAN | correct, source insuffisante | Cisco, configuration des VLAN | Source IEEE remplacée par Cisco. |
| Access token, Secure channel | **faux** (définition) | Microsoft Learn access-tokens ; troubleshoot-broken-secure-channel | Définitions réécrites. |
| Clean boot, Firmware, Shared mailbox, Tech support scam, UPN | **faux** (équivalent français) | pages Microsoft fr-fr | « démarrage en mode minimal », « microprogramme (micrologiciel) », « boîte aux lettres partagée », « escroquerie au support technique », « nom principal d'utilisateur ». |
| Driver, FCR, Internal comment, Phishing, POST, Print spooler, Service desk, SLA, Ticket, User profile | **faux** (source citée hors sujet) | sources de remplacement ouvertes (Microsoft Learn, Atlassian, Dell) | Sources et, si besoin, définitions remplacées. |
| Dual channel, Escalation, Impact, Known error, Major incident, Resolved / Closed, Service tag, TPM, WinRE | non vérifié (définition) | pages citées | Définitions alignées sur les sources ouvertes. |
| Broadcast address, Default gateway, Subnet mask, IP address, Delegation, DNS resolver cache, Mapped drive, Memory dump, Replication, Security group, Hop, Ping | non vérifié (équivalent français seul) | pages Microsoft fr-fr | Contrôlés à la correction : « cache du programme de résolution DNS », « fichier de vidage de mémoire », « tronçon (saut) » ; les autres libellés correspondent aux pages fr-fr (lecteur réseau : terme du site, page fr-fr de `net use` non traduite). |

## Bilan de la relecture
- Faux : 17 · Non vérifié : 21 · Correct : 42.

## Corrections (27/11/2026, Claude Code)
- Tous les « faux » et « non vérifié » ont été corrigés dans `assets/glossaire.js` selon les propositions du rapport ; les sources que le relecteur n'avait pas pu lire (FCR, service desk) ont été ouvertes avant d'être citées (Atlassian, *First Call Resolution* et *IT service portal*).
- Encadré source de la page mis à jour (Cisco ajouté, PeopleCert, IEEE et ASUS retirés).
