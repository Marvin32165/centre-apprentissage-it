/* Fiches mémo de la prépa — fichier GÉNÉRÉ par outils/revision.mjs depuis la section #memo des pages de jour (ne pas modifier à la main). */
window.IT_REVISION = [
 {
  "n": 1,
  "court": "Service desk",
  "href": "j1.html",
  "memo": "<ul>\n  <li><strong>Service desk</strong> = point de contact unique : enregistrer, résoudre, orienter.</li>\n  <li><strong>Incident</strong> : ça marchait, ça ne marche plus → rétablir vite. <strong>Demande</strong> : besoin standard → procédure. <strong>Problème</strong> : cause d'un ou plusieurs incidents (dix appels ≠ dix pannes : on relie les signalements). <strong>Changement</strong> : modification planifiée et approuvée.</li>\n  <li><strong>Priorité = impact × urgence</strong>, pas l'ordre d'arrivée ni la fonction de l'appelant.</li>\n  <li><strong>SLA</strong> : délais de première réponse et de résolution, selon la priorité.</li>\n  <li><strong>Résolu ≠ fermé</strong> (flux d'exercice ; le flux réel est à vérifier) : on prévient toujours l'utilisateur.</li>\n  <li><strong>Escalader</strong> : au bon moment, avec un ticket complet (qui, quoi, depuis quand, testé, impact, pourquoi).</li>\n  <li><strong>Sécurité</strong> et <strong>panne de masse</strong> : escalade immédiate.</li>\n</ul>"
 },
 {
  "n": 2,
  "court": "Téléphone",
  "href": "j2.html",
  "memo": "<ul>\n  <li><strong>Six temps</strong> : accueil, écoute, questionnement, reformulation, action, clôture.</li>\n  <li><strong>Questions ouvertes</strong> pour faire sortir l'information, <strong>fermées</strong> pour la préciser. Qui, quoi, depuis quand, où, combien, ce qui a changé, déjà essayé.</li>\n  <li><strong>Reformuler</strong> avant d'agir : écho, résumé, vérification.</li>\n  <li><strong>Guider</strong> : une action à la fois, décrire ce qu'on voit, pas de jargon.</li>\n  <li><strong>Utilisateur difficile</strong> : laisser parler, reconnaître l'émotion, recentrer, délai honnête, passer la main si les insultes continuent.</li>\n  <li><strong>Jamais de mot de passe</strong> demandé ni accepté ; on vérifie l'identité avant toute action sensible.</li>\n  <li><strong>Ingénierie sociale</strong> : autorité, urgence, pitié, faux prétexte. Pression = on applique la procédure.</li>\n  <li><strong>Clôture</strong> : récapituler, numéro de ticket, délai, « autre chose ? », documenter.</li>\n</ul>"
 },
 {
  "n": 3,
  "court": "Jira",
  "href": "j3.html",
  "memo": "<ul>\n  <li><strong>JSM</strong> : portail (utilisateur) et vue agent (files d'attente, statuts, commentaires).</li>\n  <li><strong>Un ticket</strong> : clé, résumé, description, type, demandeur, responsable, priorité, statut, SLA, liens, historique.</li>\n  <li><strong>Résumé</strong> : quoi, où, quel symptôme. <strong>Description</strong> : symptôme, contexte, impact, déjà essayé, contact, action prévue.</li>\n  <li><strong>Un ticket = un sujet</strong>. Pas de doublon : on relie ou on commente.</li>\n  <li><strong>Public</strong> = ce que voit l'utilisateur. <strong>Interne</strong> = échanges techniques. Vérifier avant d'envoyer.</li>\n  <li><strong>Jamais de mot de passe</strong> ou de code dans un ticket.</li>\n  <li><strong>KB</strong> : titre = symptôme, cause si elle est établie, étapes numérotées, quand escalader, mots-clés. Chercher avant d'écrire.</li>\n</ul>"
 },
 {
  "n": 4,
  "court": "Windows",
  "href": "j4.html",
  "memo": "<ul>\n  <li><strong>Regarder avant de chercher</strong> : Gestionnaire des tâches, Observateur d'événements (<code>eventvwr</code>), Gestionnaire de périphériques (<code>devmgmt.msc</code>), Services (<code>services.msc</code>), <code>msinfo32</code>, <code>winver</code>.</li>\n  <li><strong>Profil</strong> : <code>C:\\Users\\nom</code>. Profil temporaire : l'ancien profil n'est pas effacé ; on vérifie le message, on ne supprime rien, on escalade.</li>\n  <li><strong>Windows Update</strong> : historique, code d'erreur, espace disque, service, utilitaire de résolution.</li>\n  <li><strong>Réparer</strong> : <code>DISM /Online /Cleanup-Image /RestoreHealth</code> puis <code>sfc /scannow</code> (en administrateur), puis redémarrer. <code>chkdsk C: /scan</code> pour le disque.</li>\n  <li><strong>WinRE</strong> : <kbd>Maj</kbd> + Redémarrer ou <code>shutdown /r /o /t 0</code> ; Réparation du démarrage, Restauration, Désinstaller les mises à jour, Invite de commandes. Réinitialiser = dernier recours.</li>\n  <li><strong>Toujours</strong> : sauvegarde avant action destructive ; s'entraîner sur un poste de test, jamais sur un poste en service.</li>\n</ul>"
 },
 {
  "n": 5,
  "court": "Réseau",
  "href": "j5.html",
  "memo": "<ul>\n  <li><strong>IP, masque, passerelle, DNS</strong> : le quatuor de base (<code>ipconfig /all</code>).</li>\n  <li><strong>DHCP</strong> : Discover, Offer, Request, Acknowledge. <strong>169.254.x.x</strong> = pas de DHCP joint.</li>\n  <li><strong>Méthode</strong> : <code>127.0.0.1</code> → <code>ipconfig /all</code> → passerelle → adresse publique → nom (DNS) → <code>tracert</code>.</li>\n  <li><strong>IP qui répond, nom qui ne répond pas</strong> = DNS.</li>\n  <li><strong>Commandes</strong> : <code>ipconfig /release</code>, <code>ipconfig /renew</code>, <code>ipconfig /flushdns</code> (trois commandes), <code>ping</code>, <code>tracert</code>, <code>nslookup</code>, <code>Test-NetConnection</code>.</li>\n  <li><strong>eduroam</strong> : 802.1X, compte institutionnel, identifiant complet, après un changement de mot de passe, mettre à jour le mot de passe enregistré ou oublier le réseau ; profil officiel de l'institution.</li>\n  <li><strong>Lecteurs</strong> : réseau, DNS, droits, mot de passe en cache. <strong>Imprimantes</strong> : file bloquée, spouleur, pilote, matériel.</li>\n  <li><strong>Plusieurs personnes touchées</strong> = escalade immédiate.</li>\n</ul>"
 },
 {
  "n": 6,
  "court": "Active Directory",
  "href": "j6.html",
  "memo": "<ul>\n  <li><strong>OU</strong> = rangement et cible des GPO. <strong>Groupe</strong> = droits. <strong>GPO</strong> = réglages.</li>\n  <li><strong>Mot de passe</strong> : vérifier l'identité, mot de passe temporaire, changement à la prochaine connexion, ne jamais l'écrire dans le ticket.</li>\n  <li><strong>Compte qui se reverrouille</strong> : chercher l'appareil, la session ou la tâche qui a l'ancien mot de passe.</li>\n  <li><strong>Nouveau droit</strong> : validation, ajout au groupe, déconnexion puis reconnexion.</li>\n  <li><strong>GPO</strong> : <code>gpupdate /force</code>, <code>gpresult /r</code> ou <code>/h</code>, comparer avec un poste qui marche.</li>\n  <li><strong>Lecture</strong> : <code>Get-ADUser</code>, <code>Search-ADAccount -LockedOut</code>, <code>whoami /groups</code>.</li>\n  <li><strong>Pas de domaine joignable</strong> : penser DNS et réseau avant l'annuaire.</li>\n</ul>"
 },
 {
  "n": 7,
  "court": "Microsoft 365",
  "href": "j7.html",
  "memo": "<ul>\n  <li><strong>Test n° 1</strong> : « et sur le web ? » Web OK = chercher d'abord sur le poste ; web KO = d'abord compte ou service (mais aussi navigateur, réseau). Une orientation, pas une preuve.</li>\n  <li><strong>Outlook</strong> : mode sans échec, nouveau profil, identifiants en cache, quota. <strong>OST</strong> = copie ; <strong>PST</strong> = fichier local (archive, export ou copie) à ne pas détruire. Boîte pleine : avertissement, puis plus d'envoi, puis plus rien.</li>\n  <li><strong>Boîte partagée</strong> : droits d'abord, délai d'affichage, test sur le web.</li>\n  <li><strong>OneDrive</strong> : icône, espace, nom de fichier, fichier ouvert ; l'accès web montre ce qui est sur le serveur, pas ce qui attend encore d'être synchronisé.</li>\n  <li><strong>MFA</strong> : jamais désactivée à la demande ; réinitialisation après vérification renforcée ; notification inattendue = ne pas approuver + escalade.</li>\n</ul>"
 },
 {
  "n": 8,
  "court": "À distance",
  "href": "j8.html",
  "memo": "<ul>\n  <li><strong>Accord avant la prise en main</strong>, explications pendant, pas de fouille, pas de mot de passe saisi à sa place, fermeture et trace.</li>\n  <li><strong>Assistance rapide</strong> : l'aidant donne le code à 6 chiffres, l'utilisateur le saisit, utilisateur présent ; Store si absente. <strong>RDP</strong> : port 3389, Bureau à distance activé, compte autorisé (administrateurs, « Utilisateurs du Bureau à distance », stratégies).</li>\n  <li><strong>Méthode</strong> : symptôme → cadrage → reproduction → hypothèse → un test à la fois → confirmation → documentation.</li>\n  <li><strong>Sécurité</strong> : signaler vite, limiter, ne rien supprimer, ne pas approuver de MFA inattendue.</li>\n  <li><strong>Faux support</strong> : appel non sollicité + code ou installation = arrêt ; on vérifie toujours le ticket ou on rappelle sur un numéro officiel.</li>\n</ul>"
 },
 {
  "n": 9,
  "court": "Matériel",
  "href": "j9.html",
  "memo": "<ul>\n  <li><strong>Avant d'ouvrir un PC</strong> : éteint, débranché, décharge statique.</li>\n  <li><strong>Pièce témoin</strong> : on change un composant à la fois.</li>\n  <li><strong>UEFI</strong> remplace le BIOS ; <strong>Secure Boot</strong> = démarrage signé ; <strong>TPM 2.0</strong> requis par Windows 11.</li>\n  <li><strong>BitLocker</strong> : la clé de récupération est un secret ; elle doit exister <em>avant</em> de toucher au BIOS ou au matériel.</li>\n  <li><strong>Déploiement</strong> : nom, domaine, bonne OU, logiciels, BitLocker, test, inventaire.</li>\n  <li><strong>Colis</strong> : extérieur, bon de livraison, contenu, numéros de série, étiquette, inventaire.</li>\n</ul>"
 }
];
