# Relecture des sources : modules/sauvegarde-restauration.html

- Page relue : `modules/sauvegarde-restauration.html` et son quiz `module-sauvegarde-restauration` dans `assets/modules-quiz.js` (branche `chatgpt-27-11`)
- Date : 27/11/2026
- Outil : Claude Code (relecture par un autre outil que celui qui a écrit la page)
- Sources ouvertes : Microsoft Support (pages en-us et fr-fr) et Microsoft Learn. Les libellés français ont été comparés aux pages fr-fr.

| Affirmation (section) | Verdict | URL de la source ouverte | Correction nécessaire |
|---|---|---|---|
| Si la sauvegarde des dossiers est activée, Bureau, Documents ou Images peuvent se trouver dans OneDrive (1. Emplacements) | correct | https://support.microsoft.com/fr-fr/onedrive/back-up-your-folders-with-onedrive | Aucune. La page cite « Bureau, Documents, Musique, Images et Vidéos ». |
| Un nuage bleu signale un fichier disponible en ligne uniquement (1. Emplacements) | correct | https://support.microsoft.com/en-us/onedrive/what-do-the-onedrive-icons-mean | Aucune. |
| Sur un partage, les versions précédentes dépendent de ce que le serveur expose et de sa configuration (1 et 3) | correct | https://learn.microsoft.com/en-us/troubleshoot/windows-client/backup-and-storage/most-recent-previous-versions-missing-for-share | Aucune (clichés VSS du serveur, limites MaxShadowCopies et SMB). |
| OneDrive sur le web : sélectionner le fichier puis ouvrir « Historique des versions » (2. OneDrive) | correct | https://support.microsoft.com/fr-fr/onedrive/restore-a-previous-version-of-a-file-stored-in-onedrive | Aucune. |
| Dans le menu de la version voulue, choisir « Restaurer » ; elle devient la version courante (2) | correct | même page | Aucune (menu des points de suspension). |
| L'ancienne version courante reste dans l'historique (2) | correct | https://support.microsoft.com/en-us/onedrive/restore-a-previous-version-of-a-file-stored-in-onedrive | Aucune (« The previous current version becomes the previous version in the list. »). |
| Fichier absent : Corbeille OneDrive sur le web, « Restaurer » (2) | correct | https://support.microsoft.com/fr-fr/onedrive/restore-your-onedrive-files | Aucune. |
| Un fichier en ligne uniquement supprimé depuis le cloud peut être absent de la corbeille de Windows (2, cas 1) | correct | même page | Aucune (Microsoft : ces fichiers « n'apparaissent pas dans la Corbeille »). |
| Fichier partagé par quelqu'un d'autre : identifier l'emplacement et le propriétaire avant d'escalader (2) | correct | même page | Aucune (« uniquement restaurer des fichiers ou des dossiers situés dans votre propre OneDrive »). |
| Présence et durée de conservation selon le compte et les paramètres (2, encadré) | correct | mêmes pages | Aucune (corbeille 30 j personnel, 93 j professionnel sauf réglage ; versions 30 j). |
| L'Historique des fichiers enregistre des versions sur un lecteur externe ou réseau (3) | correct | https://support.microsoft.com/fr-fr/windows/experience/backup-recovery/backup-and-restore-with-file-history | Aucune. |
| Fichier supprimé : dossier parent, « Restaurer les versions précédentes » (3) | correct | même page | Aucune. |
| « Ouvre-la pour contrôler le contenu » (3) | correct | même page | Précision possible : « Ouvrir dans l'historique des fichiers ». |
| Option « Restaurer vers… » pour préserver l'état actuel (3) | **faux** | même page | Libellé Microsoft : « Restaurer sur… » ; « Restaurer » seul remplace définitivement la version actuelle. |
| « Microsoft documente la règle 3-2-1… trois copies, deux types de stockage, une hors site » (4, astuce) | **faux** (imprécis) | https://learn.microsoft.com/en-us/azure/backup/azure-backup-3-2-1-1-0-strategy | La source décrit 3-2-1-1-0 : production + au moins deux sauvegardes, sauvegardes sur deux types de stockage, une sauvegarde hors site, une isolée ou immuable, zéro erreur de restauration. |
| Contrôler une copie en restaurant un échantillon (4, point 3) | correct | même page | Aucune. |
| Labo, étape 2 : téléverser un fichier du même nom crée une nouvelle version (Labo) | non vérifié | aucune source primaire trouvée | Retirer cette variante, garder le dossier OneDrive synchronisé. |
| Correction du labo : A courant, B dans l'historique | correct | page versions OneDrive | Aucune. |
| Quiz Q1 à Q6 | correct | pages ci-dessus | Aucune. |

## Autres contrôles
- UMONS marqué « à vérifier sur place ». Aucune donnée privée.
- Mises en situation, quiz et mémo sans encadré source propre (faits déjà sourcés plus haut) : encadré source conseillé sous « Mises en situation ».

## Bilan
- Faux : 2 · Non vérifié : 1 · Correct : 21 sur 24.

## Test en situation (test-chef.md), 27/11/2026
- Huit critères réussis (labo, corrections, quiz, liens, recherche, mémo A4, progression, 390 px, UMONS).
- Manque pour l'usage : « sauvegarder avant une intervention » n'était pas pratiqué.

## Corrections (27/11/2026, Claude Code)
- « Restaurer sur… » et « Ouvrir dans l'historique des fichiers » (libellés Microsoft fr-fr), avertissement sur « Restaurer » seul.
- Stratégie 3-2-1-1-0 décrite comme dans la source.
- Variante du téléversement par le navigateur retirée (non vérifiée).
- Labo : deux étapes ajoutées (copie avant intervention, restauration et contrôle d'un échantillon) avec ce qu'il faut constater.
- Encadré source ajouté sous les mises en situation.
