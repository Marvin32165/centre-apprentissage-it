# Relecture des sources — module « Déploiement et gestion des postes »

- Page relue : `modules/deploiement-postes.html` et le quiz `module-deploiement-postes`
- Date : 27/11/2026
- Outil : Claude Code, agent de relecture séparé (n'a pas écrit la page)
- Procédure : `docs/procedures/relecture-sources.md`

| Affirmation (section) | Verdict | Source ouverte | Correction |
|---|---|---|---|
| Cycle de vie Autopilot ; réinitialiser, réaffecter, récupérer (§1) | correct | https://learn.microsoft.com/en-us/autopilot/overview | — |
| Trois familles, modernes recommandées ; détails moderne, dynamique, traditionnelle (refresh, replace) (§2, mémo, Q3) | correct | https://learn.microsoft.com/en-us/windows/deployment/windows-deployment-scenarios | — |
| Autopilot part de la version du constructeur, sans image (§2, Q2) | correct | autopilot/overview | — |
| Intune : service cloud ; MDM via Portail d'entreprise ou Autopilot (§3) | correct | https://learn.microsoft.com/fr-fr/intune/fundamentals/what-is-intune | — |
| « Du point de vue de l'utilisateur… se connecter à un réseau et donner ses identifiants » (§3) | **faux** | autopilot/overview | Phrase attribuée par Microsoft au point de vue du professionnel IT : reformulée (« la seule intervention demandée à l'utilisateur… »). |
| Wipe : paramètres d'usine, tout supprimé, cas d'usage (§3, mémo, Q4) | correct | https://learn.microsoft.com/en-us/intune/device-management/actions/wipe | — |
| dsregcmd : compte du domaine, tableau Device State, User State (§4, labo, cas 1, Q1) | correct | https://learn.microsoft.com/en-us/entra/identity/devices/troubleshoot-device-dsregcmd | — |
| Libellés « Comptes → Accès Professionnel ou Scolaire », « Déconnecter » | correct | Microsoft Support fr-fr (compte professionnel ou scolaire) | — |
| « Déconnecter coupe l'accès aux ressources » (§4, cas 2) | non vérifié | https://learn.microsoft.com/en-us/entra/identity/devices/faq | Remplacé : retire la jonction ou l'inscription ; sur un poste joint à Entra, plus d'ouverture de session avec un compte Entra (compte administrateur local nécessaire). FAQ ajoutée aux sources. |
| Get-CimInstance Win32_BIOS / Win32_ComputerSystem (§5, Q5) | correct | Microsoft Learn (Get-CimInstance, Win32_BIOS, Win32_ComputerSystem) | — |
| NIST SP 800-88 Rev. 2 ; suppression insuffisante (§6, Q6) | correct | https://csrc.nist.gov/pubs/sp/800/88/r2/final | — |
| Encadré source absent du labo | non vérifié | règle de la procédure | Encadré ajouté (dsregcmd, Win32_BIOS, compte professionnel, Dell Service Tag). |
| « PC assemblé : numéro vide ou générique » (labo) | non vérifié | Win32_BIOS ; Dell KB 000130711 | Remplacé par « compare à l'étiquette (chez Dell : Service Tag) ; s'il est vide ou différent, note-le tel quel ». |

Remarques suivies : liens Intune mis à jour vers leurs nouvelles adresses ; « Effacer » ajouté comme libellé français de Wipe ; retrait d'Autopilot et d'Entra ID après une réinitialisation mentionné au §6 (source : page Wipe).

## Bilan de la relecture
- Faux : 1 · Non vérifié : 4 · Correct : 24 sur 29.

## Corrections (27/11/2026, Claude Code)
- Toutes les lignes « faux » et « non vérifié » corrigées comme indiqué ci-dessus.

## Test en situation (test-chef.md), 27/11/2026
- Usage : recevoir des PC neufs pour une salle, comprendre leur déploiement et vérifier l'état de gestion d'un poste sans machine virtuelle. Rien à signaler : huit critères réussis.
