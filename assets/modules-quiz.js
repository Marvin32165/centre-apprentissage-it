/* Quiz des modules : un quiz par module, identifiant `module-<id>` (moteur dans app.js).
   Ce fichier doit être chargé AVANT app.js. */
window.IT_QUIZZES = window.IT_QUIZZES || {};

window.IT_QUIZZES["module-support-windows"] = { titre: "Quiz : support poste Windows", questions: [
  { q: "Un utilisateur A rencontre une erreur sur un poste ; un utilisateur B n'en a pas sur le même poste. Où est la cause la plus probable ?",
    options: ["Dans le matériel du poste","Dans le disque dur","Dans le profil ou les réglages de A","Dans le câble réseau"], reponse: 2,
    explication: "Le problème suit l'utilisateur, pas le poste : c'est la meilleure piste (profil, droits, licence ou réglages propres au compte), à confirmer, pas une preuve." },
  { q: "Un PC allume ses ventilateurs mais n'affiche aucune image ni logo, écran et câble vérifiés. Quel maillon de la chaîne de démarrage est le plus probablement en cause ?",
    options: ["Le firmware et le POST (matériel de base)","La session Windows","Le profil utilisateur","Les mises à jour"], reponse: 0,
    explication: "Pas d'image avant même le logo constructeur : on est avant Windows, au niveau du firmware et du matériel (mémoire, carte, alimentation)." },
  { q: "Quel événement du journal Système indique que Windows a redémarré sans arrêt propre (Kernel-Power) ?",
    options: ["ID 1000","ID 7036","ID 4740","ID 41"], reponse: 3,
    explication: "L'ID 41 (Kernel-Power) signale un redémarrage sans arrêt propre ; 6008 note l'arrêt inattendu. 1000 est un plantage d'application, 4740 un verrouillage de compte." },
  { q: "Que fais-tu en premier face à un écran bleu ?",
    options: ["Réinstaller Windows","Noter le code d'arrêt, l'heure et ce qui a changé juste avant","Remplacer la mémoire","Désinstaller toutes les applications"], reponse: 1,
    explication: "Le code d'arrêt est la meilleure information. On le note avant toute action, puis on cherche ce qui a changé." },
  { q: "Un disque à 100 % d'utilisation en continu, sans processus évident, avec des erreurs « Disk » dans les journaux. Ta priorité ?",
    options: ["Désactiver l'antivirus","Défragmenter chaque jour","Sauvegarder les données si possible, puis escalader","Ignorer, c'est normal"], reponse: 2,
    explication: "Des erreurs de disque peuvent annoncer une défaillance : on protège les données d'abord et on escalade." },
  { q: "Après avoir testé avec un démarrage minimal (msconfig), que dois-tu faire en fin d'intervention ?",
    options: ["Rien, le poste reste ainsi","Supprimer msconfig","Désactiver Windows Update","Remettre le démarrage normal"], reponse: 3,
    explication: "Un démarrage minimal est un outil de test : on remet les services et les applications de démarrage tels qu'ils étaient (d'où le relevé initial), comme l'indique la procédure Microsoft." }
] };

window.IT_QUIZZES["module-itil"] = { titre: "Quiz : ITIL 4 pour le service desk", questions: [
  { q: "Dans la chaîne de valeur ITIL 4, quelles activités le service desk touche-t-il le plus ?",
    options: ["Impliquer et fournir et soutenir","Planifier et obtenir ou construire","Concevoir et améliorer uniquement","Aucune"], reponse: 0,
    explication: "Le service desk est en première ligne de la relation avec l'utilisateur (impliquer) et du fonctionnement quotidien (fournir et soutenir)." },
  { q: "Pendant un incident majeur, que fait le N1 des nouveaux appels identiques ?",
    options: ["Un diagnostic complet à chaque appel","Les ignore","Promet une heure de résolution","Vérifie que le symptôme est le même, relie le signalement à l'incident en cours et relaie la communication officielle"], reponse: 3,
    explication: "On trace et on relie le signalement selon la procédure, sans refaire le diagnostic, et on n'annonce pas de délai non connu." },
  { q: "Qu'est-ce qu'une erreur connue ?",
    options: ["Un incident résolu","Un problème analysé mais pas encore résolu","Une demande de service","Un changement urgent"], reponse: 1,
    explication: "Définition ITIL 4. On la documente dans la base de connaissances, avec le contournement s'il existe, pour que le N1 puisse le proposer." },
  { q: "Quel type de changement est pré-autorisé, à faible risque et à procédure documentée ?",
    options: ["Normal","Urgent","Standard","Majeur"], reponse: 2,
    explication: "Un changement standard est connu, documenté et autorisé d'avance. Le normal est évalué avant ; l'urgent suit un circuit accéléré." },
  { q: "Le taux de résolution au premier contact monte, mais les tickets rouverts doublent. Que suspectes-tu ?",
    options: ["Une amélioration réelle","Une panne du réseau","Rien de particulier","Des tickets clôturés trop vite"], reponse: 3,
    explication: "Quand un indicateur devient un objectif, on peut l'optimiser au détriment de la qualité. On vérifie les tickets rouverts." },
  { q: "Un responsable te demande de modifier un réglage pour toute une salle, « juste aujourd'hui ». Que fais-tu ?",
    options: ["Tu le fais, tu as les droits","Tu refuses sans expliquer","Tu passes par la demande ou le changement adéquat, avec validation","Tu le fais puis tu notes plus tard"], reponse: 2,
    explication: "Les droits techniques ne valent pas autorisation : un changement touchant beaucoup de postes suit le circuit prévu." }
] };

window.IT_QUIZZES["module-jira-quotidien"] = { titre: "Quiz : Jira Service Management au quotidien", questions: [
  { q: "Quel ticket retient le filtre assignee IS EMPTY AND statusCategory != Done ?",
    options: ["Un ticket non assigné et non terminé", "Un ticket assigné et non terminé", "Un ticket non assigné et terminé", "Tous les tickets créés aujourd’hui"], reponse: 0,
    explication: "Les deux conditions portent sur l’assignation et sur la catégorie de statut. Atlassian, champs JQL : https://support.atlassian.com/jira-service-management-cloud/docs/jql-fields/" },
  { q: "Le SLA de résolution est en pause. Que fais-tu avec le SLA de première réponse ?",
    options: ["Je le considère comme arrêté", "Je change la priorité du ticket", "Je lis son état séparément et j’agis selon son échéance", "J’attends le prochain redémarrage de Jira"], reponse: 2,
    explication: "Deux SLA peuvent mesurer des actions différentes selon leurs propres conditions. Atlassian, lecture des SLA : https://support.atlassian.com/jira-service-management-cloud/docs/what-are-slas-and-how-do-i-view-them-in-my-service-project/" },
  { q: "Où consigner un résultat de diagnostic qui doit rester entre agents ?",
    options: ["Dans le portail public", "Dans une note interne", "Dans la réponse au client", "Dans le titre de la file"], reponse: 1,
    explication: "Le client ne voit pas les notes internes. Atlassian, communiquer depuis le ticket : https://support.atlassian.com/jira-service-management-cloud/docs/talk-to-the-customer-or-team-members-from-the-new-issue-view/" },
  { q: "Deux tickets décrivent vraisemblablement le même incident. Quel geste conserve leur contexte ?",
    options: ["Clôturer automatiquement les deux tickets", "Copier toutes les données dans le portail", "Effacer le premier ticket", "Lier les tickets avec la relation pertinente et garder les éléments propres à chacun"], reponse: 3,
    explication: "Le lien permet de choisir un type de relation entre deux tickets. Atlassian, lier des éléments : https://support.atlassian.com/jira-service-management-cloud/docs/link-issues-pages-and-app-content-from-the-issue-view/" },
  { q: "Tu trouves un guide interne et une réponse type. Comment écris-tu au client ?",
    options: ["J’adapte la réponse type et je garde le guide interne dans la note d’équipe", "Je copie le lien interne dans la réponse publique", "Je publie le texte type sans relecture", "Je déplace le guide sur un espace public"], reponse: 0,
    explication: "La visibilité de l’article détermine son canal de partage. Le texte inséré se relit avec le contexte du ticket. Atlassian : https://support.atlassian.com/jira-service-management-cloud/docs/use-internal-articles-in-the-knowledge-base-panel/" },
  { q: "Quel indice montre pourquoi une automatisation a tourné sans produire l’action prévue ?",
    options: ["Le nom de l’agent seulement", "Le statut de la file seulement", "L’exécution et le détail des étapes dans l’audit, si j’y ai accès", "Le titre de l’article de connaissances"], reponse: 2,
    explication: "L’audit permet à la personne habilitée de consulter le résultat et les étapes d’une exécution. Atlassian : https://support.atlassian.com/cloud-automation/docs/view-execution-data-for-a-rule/" }
] };

window.IT_QUIZZES["module-reseau-base"] = { titre: "Quiz : réseau de base", questions: [
  { q: "Quel est le réseau de la machine 192.168.10.77/26 ?",
    options: ["192.168.10.0","192.168.10.77","192.168.10.128","192.168.10.64"], reponse: 3,
    explication: "/26 = blocs de 64 : 0, 64, 128, 192. Le 77 est dans le bloc 64–127, donc le réseau est 192.168.10.64." },
  { q: "Un poste réglé en DHCP affiche 169.254.12.7. Que cela signifie-t-il ?",
    options: ["Il a une adresse publique","Il n'a pas obtenu d'adresse du DHCP","Son DNS est faux","Sa passerelle est trop lente"], reponse: 1,
    explication: "169.254.0.0/16 est la plage de lien local (APIPA) que Windows s'attribue faute de bail DHCP utilisable ; la cause (câble, VLAN, relais, serveur) reste à trouver." },
  { q: "Le ping d'une adresse répond, mais le ping du nom correspondant donne « hôte introuvable ». Quelle est la piste ?",
    options: ["Le câble","La carte réseau","Le DNS","Le pare-feu du serveur"], reponse: 2,
    explication: "Le réseau fonctionne ; la traduction nom → adresse échoue : serveur DNS du poste, suffixe, cache." },
  { q: "Quel port utilise le protocole des partages de fichiers Windows (SMB) ?",
    options: ["TCP 80","TCP 3389","UDP 53","TCP 445"], reponse: 3,
    explication: "SMB utilise le port TCP 445. 3389 est le bureau à distance, 80 le web, 53 le DNS." },
  { q: "Quelle commande teste à la fois la résolution du nom et la connexion à un port ?",
    options: ["ipconfig /all","tracert nom","Test-NetConnection nom -Port 443","arp -a"], reponse: 2,
    explication: "Avec -Port, Test-NetConnection résout le nom si besoin et essaie la connexion TCP au port indiqué ; une connexion réussie ne prouve pas que l'application répond." },
  { q: "Un poste a l'adresse 192.168.1.50/24 et pour passerelle 192.168.2.1. Pourquoi n'a-t-il pas accès à Internet ?",
    options: ["La passerelle n'est pas dans le réseau du poste","Le masque est faux","Le DNS est absent","Le DHCP est coupé"], reponse: 0,
    explication: "Sa seule sortie étant la route par défaut, la passerelle doit être dans le même réseau que le poste pour être atteinte directement : 192.168.2.1 est hors de 192.168.1.0/24." }
] };

window.IT_QUIZZES["module-ad-support"] = { titre: "Quiz : Active Directory pour le support", questions: [
  { q: "Quel identifiant ne change PAS quand on renomme un compte ?",
    options: ["Le nom distinctif (DN)","Le SID","Le nom d'affichage","L'adresse de messagerie"], reponse: 1,
    explication: "Le SID est stable : les droits y sont attachés. Le DN et les noms changent." },
  { q: "Un poste du domaine ne trouve plus aucun contrôleur de domaine. Quelle est la première piste ?",
    options: ["Le fond d'écran","La taille du profil","Le DNS du poste","La résolution d'écran"], reponse: 2,
    explication: "Le poste trouve ses DC par le DNS (enregistrements SRV) : Microsoft recommande de vérifier la configuration DNS en premier." },
  { q: "Quel écart d'horloge maximal Kerberos tolère-t-il par défaut ?",
    options: ["5 secondes","5 heures","Aucune limite","5 minutes"], reponse: 3,
    explication: "Par défaut, 5 minutes. Au-delà, l'authentification Kerberos échoue." },
  { q: "On vient d'ajouter un utilisateur à un groupe. Pour que son accès fonctionne, il doit…",
    options: ["Changer de mot de passe","Redémarrer le serveur","Fermer puis rouvrir sa session","Rien"], reponse: 2,
    explication: "Les groupes sont lus à l'ouverture de session : le jeton d'accès en cours ne contient pas la nouvelle appartenance. La nouvelle session doit être ouverte au contact d'un DC qui a reçu la modification." },
  { q: "Dans le modèle AGDLP, où place-t-on les permissions sur un dossier ?",
    options: ["Sur un groupe de domaine local","Sur chaque compte utilisateur","Sur le groupe global directement et jamais ailleurs","Sur l'OU"], reponse: 0,
    explication: "Comptes → groupes globaux → groupes de domaine local → permissions. On n'attribue pas de droit à une personne directement." },
  { q: "Le test « Test-ComputerSecureChannel » répond False. Que fais-tu ?",
    options: ["Tu retires le poste du domaine et le rejoins","Tu redémarres le DC","Tu supprimes le compte utilisateur","Tu notes le poste et son OU et tu escalades"], reponse: 3,
    explication: "La réparation du canal sécurisé demande des droits et une procédure. Retirer et rejoindre le poste sans procédure peut recréer l'objet ordinateur sans son OU ni ses groupes ; on vérifie aussi DNS et connexion au DC avant d'escalader." }
] };

window.IT_QUIZZES["module-materiel-pc"] = { titre: "Quiz : matériel et PC", questions: [
  { q: "Où trouver le numéro de série d'un poste sans retourner la machine ?",
    options: ["Dans Win32_BIOS (SerialNumber), avec Get-CimInstance","Dans le Gestionnaire des tâches","Dans l'adresse IP","Dans le nom d'utilisateur"], reponse: 0,
    explication: "Get-CimInstance Win32_BIOS renvoie SerialNumber, le numéro qu'attend le constructeur pour ouvrir un dossier de garantie (méthode documentée par Dell, par exemple)." },
  { q: "Un utilisateur veut ajouter une barrette DDR4 dans un PC dont la carte mère accepte la DDR5. Que se passe-t-il ?",
    options: ["Elle fonctionne, mais plus lentement","Elle n'entre pas : l'encoche n'est pas au même endroit","Elle fonctionne après une mise à jour du BIOS","Elle fonctionne seulement en simple canal"], reponse: 1,
    explication: "DDR4 et DDR5 ne sont pas interchangeables : le détrompeur diffère. On ne force jamais un connecteur." },
  { q: "Un SSD M.2 NVMe n'est pas détecté dans le slot M.2 d'un vieux portable. Quelle est la cause la plus probable ?",
    options: ["Il faut un câble SATA","Le SSD doit être formaté avant d'être posé","Le slot ne gère que le M.2 SATA, pas le NVMe","Le portable doit être en mode Legacy"], reponse: 2,
    explication: "Un slot M.2 peut être SATA seulement, NVMe seulement, ou les deux : c'est écrit dans le manuel du modèle." },
  { q: "Une tour reste sur un écran noir et émet une série de bips. Que fais-tu de ces bips ?",
    options: ["J'ignore les bips, ils sont normaux","Je les traduis avec un tableau universel","Je réinstalle Windows","Je note le motif exact et je le lis dans le manuel du modèle"], reponse: 3,
    explication: "La signification des bips et des LED dépend du constructeur et du modèle : on note le motif et on le lit dans sa documentation." },
  { q: "Un portable ralentit après quelques minutes d'effort, puis s'éteint net, ventilateur à fond. Hypothèse principale ?",
    options: ["Une surchauffe : le processeur bride puis la protection thermique coupe","Un profil utilisateur abîmé","Un problème de DNS","Une licence Windows expirée"], reponse: 0,
    explication: "Lenteur sous charge puis coupure nette avec un ventilateur qui souffle fort : c'est le schéma de la protection thermique." },
  { q: "Que montre « powercfg /batteryreport » pour juger l'usure d'une batterie ?",
    options: ["La température du processeur","La capacité d'origine et la capacité actuelle à pleine charge","La vitesse du port USB-C","Le numéro de série du chargeur"], reponse: 1,
    explication: "Le rapport compare Design capacity et Full charge capacity, et montre l'historique d'autonomie." }
] };

window.IT_QUIZZES["module-depannage-distance"] = { titre: "Quiz : dépannage à distance", questions: [
  { q: "Dans Assistance rapide, qui génère le code de sécurité à 6 chiffres ?",
    options: ["L'utilisateur aidé", "Le support (celui qui aide)", "Microsoft, par SMS", "Le serveur de l'organisation"], reponse: 1,
    explication: "Le support choisit « Aider quelqu'un » (Help someone) et obtient un code à durée limitée, qu'il donne à l'utilisateur ; celui-ci le saisit et autorise la connexion." },
  { q: "Un utilisateur veut que tu te connectes en Bureau à distance à son PC en Windows 11 Famille. Que sais-tu ?",
    options: ["Ça marche si le pare-feu est désactivé", "Il faut seulement connaître le nom du PC", "Une édition Famille ne peut pas recevoir de connexion Bureau à distance", "Il faut passer par le port 443"], reponse: 2,
    explication: "Le poste hôte doit être en édition Pro, Entreprise ou Éducation ; le poste depuis lequel on se connecte peut être de n'importe quelle édition, Famille comprise." },
  { q: "Pendant une session Assistance rapide avec contrôle, de quels droits disposes-tu ?",
    options: ["Des mêmes droits que l'utilisateur", "Des droits d'administrateur du domaine", "Des droits d'administrateur local", "D'aucun droit, tu ne fais que regarder"], reponse: 0,
    explication: "Le support a les mêmes droits que l'utilisateur ; certaines invites UAC doivent être validées par l'utilisateur lui-même." },
  { q: "Après une session Assistance rapide, où se trouve la trace de ce qui a été fait ?",
    options: ["Dans un journal sur le poste de l'utilisateur", "Dans un journal sur ton poste", "Dans le ticket, que tu complètes toi-même", "Dans l'Observateur d'événements du serveur"], reponse: 2,
    explication: "Assistance rapide ne crée aucun journal sur les postes et Microsoft ne garde que des données minimales : le ticket est la trace de la session." },
  { q: "Test-NetConnection -Port 3389 renvoie TcpTestSucceeded : False, mais le ping du poste répond. Conclusion ?",
    options: ["Le poste est éteint", "Le poste est joignable, mais pas le Bureau à distance (désactivé, pare-feu, stratégie)", "Le DNS est en panne", "Il faut relancer mstsc plusieurs fois"], reponse: 1,
    explication: "Le port 3389 ne répond pas : inutile d'insister avec mstsc. On passe par l'outil prévu, sur place, ou on escalade." },
  { q: "Quelqu'un « du support informatique » a fait saisir à une employée un code dans Assistance rapide, puis a pris le contrôle. Que fais-tu ?",
    options: ["Rien, c'était peut-être un collègue", "Tu traites l'appel comme un incident de sécurité et tu escalades immédiatement", "Tu lui demandes son mot de passe pour vérifier le compte", "Tu réinstalles Assistance rapide"], reponse: 1,
    explication: "C'est le scénario du faux support décrit par Microsoft en 2024 : incident de sécurité, escalade selon la procédure, ticket détaillé (heure, ce qui a été accepté)." }
]};

window.IT_QUIZZES["module-m365-messagerie"] = { titre: "Quiz : Microsoft 365 et messagerie", questions: [
  { q: "Une utilisatrice lit la boîte partagée du secrétariat mais ne peut pas répondre depuis son adresse. Quel droit lui manque probablement ?",
    options: ["Envoyer en tant que (Send As)", "Accès total (Full Access)", "Une licence Teams", "Le mode mis en cache"], reponse: 0,
    explication: "L'accès total permet d'ouvrir et de lire la boîte, pas d'envoyer : pour répondre depuis l'adresse de la boîte, il faut aussi un droit d'envoi : Envoyer en tant que, ou Envoyer de la part de si l'organisation a fait ce choix." },
  { q: "Outlook classique se ferme au démarrage, mais fonctionne avec outlook.exe /safe. Quelle piste ?",
    options: ["Le compte est bloqué", "Le serveur Exchange est en panne", "Un complément (add-in) est suspect", "Le disque est plein"], reponse: 2,
    explication: "Le mode sans échec désactive les compléments COM : s'il fonctionne ainsi, un complément est la piste principale." },
  { q: "Que fait « Libérer de l'espace » sur un fichier OneDrive ?",
    options: ["Il supprime le fichier partout", "Il garde le fichier en ligne seulement, sans occuper le disque", "Il compresse le fichier", "Il le déplace dans la corbeille"], reponse: 1,
    explication: "Le fichier repasse en ligne seulement (nuage bleu) et reste dans OneDrive ; supprimer, au contraire, le supprime partout." },
  { q: "Des messages manquent dans un canal Teams. Faut-il vider le cache de Teams ?",
    options: ["Oui, c'est la première chose à faire", "Oui, et réinstaller Teams", "Non : Microsoft le déconseille, le cache contient les journaux de diagnostic", "Non, il faut réinitialiser OneDrive"], reponse: 2,
    explication: "Pour des messages manquants, un historique qui ne charge pas ou des notifications fausses, on ne vide pas le cache : on vérifie sur le web et on escalade." },
  { q: "OneDrive ne synchronise plus. Que fait onedrive.exe /reset ?",
    options: ["Il supprime les fichiers locaux et en ligne", "Il remet les paramètres de OneDrive à zéro, sans perte de données, puis resynchronise", "Il désinstalle OneDrive", "Il change le mot de passe du compte"], reponse: 1,
    explication: "Microsoft précise qu'on ne perd aucune donnée ; les dossiers de synchronisation sélective sont à re-sélectionner." },
  { q: "Laquelle de ces méthodes Microsoft classe-t-il comme résistante à l'hameçonnage ?",
    options: ["Le code par SMS", "Le code par courriel", "Une clé de sécurité FIDO2", "L'appel vocal"], reponse: 2,
    explication: "Windows Hello Entreprise, FIDO2 (clés et passkeys) et l'authentification par certificat sont résistants à l'hameçonnage ; SMS, courriel et applications d'authentification classiques y restent exposés." }
]};

window.IT_QUIZZES["module-sauvegarde-restauration"] = { titre: "Quiz : Sauvegarde et restauration", questions: [
  { q: "Un document OneDrive existe encore mais a été écrasé. Où chercher son ancien contenu ?",
    options: ["Dans les paramètres d’affichage", "Dans l’historique des versions du fichier", "Dans la corbeille de Windows d’emblée", "Dans les mises à jour Windows"], reponse: 1,
    explication: "L’historique donne accès aux versions précédentes du document. Microsoft Support : https://support.microsoft.com/en-us/onedrive/restore-a-previous-version-of-a-file-stored-in-onedrive" },
  { q: "Un fichier OneDrive en ligne uniquement a été supprimé. Où vérifier d’abord ?",
    options: ["Dans le gestionnaire des tâches", "Dans les propriétés de l’imprimante", "Dans le BIOS", "Dans la corbeille web de son emplacement d’origine"], reponse: 3,
    explication: "Les fichiers supprimés depuis le cloud peuvent être absents de la corbeille de Windows. Microsoft Support : https://support.microsoft.com/en-us/onedrive/restore-your-onedrive-files" },
  { q: "Que devient la version courante B quand tu restaures A depuis l’historique OneDrive ?",
    options: ["A devient courante et B reste dans l’historique", "B disparaît immédiatement", "A est seulement placée dans la corbeille", "Toutes les versions sont effacées"], reponse: 0,
    explication: "La version sélectionnée devient courante et l’ancienne version courante passe dans l’historique. Microsoft Support : https://support.microsoft.com/en-us/onedrive/restore-a-previous-version-of-a-file-stored-in-onedrive" },
  { q: "Avec l’Historique des fichiers, où chercher un fichier supprimé ?",
    options: ["Dans une nouvelle session Windows", "Dans l’historique du navigateur", "Dans une version du dossier qui contenait le fichier, si elle existe", "Dans la liste des applications installées"], reponse: 2,
    explication: "Sélectionne une version du dossier parent antérieure à la suppression. Microsoft Support : https://support.microsoft.com/en-us/windows/experience/backup-recovery/backup-and-restore-with-file-history" },
  { q: "Le dossier Bureau semble dans OneDrive avant une réinstallation. Que vérifies-tu ?",
    options: ["Que le fond d’écran est enregistré", "Que les fichiers attendus s’ouvrent sur le web et que les autres données locales sont protégées", "Que l’utilisateur a fermé le site", "Que la date de Windows a changé"], reponse: 1,
    explication: "Les fichiers du dossier sauvegardé sont accessibles après synchronisation. Compare avec le périmètre à sauver. Microsoft Support : https://support.microsoft.com/en-us/onedrive/back-up-your-folders-with-onedrive" },
  { q: "Quel résultat vérifie qu’une copie de sauvegarde est exploitable ?",
    options: ["L’outil est installé", "Le ticket est affecté", "Le dossier de destination a un nom", "Un échantillon restauré s’ouvre et son contenu correspond"], reponse: 3,
    explication: "Le succès du traitement de sauvegarde ne dispense pas de tester la restauration. Microsoft Learn : https://learn.microsoft.com/en-us/azure/backup/azure-backup-3-2-1-1-0-strategy" }
] };

window.IT_QUIZZES["module-imprimantes-peripheriques"] = { titre: "Quiz : imprimantes et périphériques", questions: [
  { q: "Une imprimante ne répond plus. Quelle est la première étape conseillée par Microsoft, après l'utilitaire automatique ?",
    options: ["Réinstaller Windows", "Éteindre et débrancher l'imprimante 30 secondes, puis la rallumer", "Supprimer le spouleur", "Changer de pilote"], reponse: 1,
    explication: "On commence par le plus simple : redémarrer l'imprimante, puis vérifier la connexion, avant de supprimer et réinstaller, changer de pilote ou vider le spouleur." },
  { q: "Pourquoi un utilisateur standard ne peut-il plus installer seul le pilote d'une imprimante depuis un serveur d'impression ?",
    options: ["Son compte est bloqué", "Depuis août 2021, Point and Print demande par défaut des droits d'administrateur", "Le serveur est en panne", "Le Bluetooth est coupé"], reponse: 1,
    explication: "Après la faille CVE-2021-34481, Microsoft a imposé par défaut des droits d'administrateur pour installer ou mettre à jour un pilote par Point and Print." },
  { q: "Un problème est apparu après la mise à jour d'un pilote. Que permet « Restaurer le pilote » ?",
    options: ["Revenir au pilote précédent (droits d'administrateur requis)", "Supprimer le périphérique définitivement", "Télécharger un pilote sur un site tiers", "Désactiver Windows Update"], reponse: 0,
    explication: "Le retour au pilote précédent règle souvent un souci apparu après une mise à jour ; il demande des droits d'administrateur." },
  { q: "Quelle commande liste les imprimantes installées, sans droits d'administrateur ?",
    options: ["net stop spooler", "Get-Printer", "ipconfig /all", "rundll32 printui.dll,PrintUIEntry /dl"], reponse: 1,
    explication: "Get-Printer (PowerShell) liste les imprimantes ; avec -ComputerName, celles d'un autre ordinateur. /dl, lui, supprime une imprimante locale." },
  { q: "Windows Hello reconnaît le visage de l'utilisateur, mais Teams ne trouve pas la caméra. Piste principale ?",
    options: ["La caméra est cassée", "Le pilote est absent", "L'autorisation « applications de bureau » de la caméra est coupée", "Le Bluetooth est désactivé"], reponse: 2,
    explication: "Windows Hello fonctionne même quand l'accès des applications est coupé : c'est la première hypothèse, pas une certitude. On vérifie Confidentialité et sécurité → Caméra (dont le réglage des applications de bureau), puis la caméra choisie dans Teams." },
  { q: "Un casque Bluetooth en mode appairage n'apparaît pas dans la liste des nouveaux appareils. Que peut-on essayer ?",
    options: ["Passer la découverte des appareils Bluetooth en mode Avancé", "Réinstaller Teams", "Vider le spouleur", "Changer d'adresse IP"], reponse: 0,
    explication: "Microsoft indique que la découverte des appareils Bluetooth peut devoir passer en mode Avancé ; on vérifie aussi que le Bluetooth est activé et que l'appareil est bien en mode appairage." }
]};

window.IT_QUIZZES["module-sous-reseaux"] = { titre: "Quiz : sous-réseaux et plan d'adressage", questions: [
  { q: "Quel masque correspond au préfixe /23 ?",
    options: ["255.255.255.0", "255.255.254.0", "255.255.252.0", "255.255.255.128"], reponse: 1,
    explication: "23 bits à 1 : 255.255 puis 11111110 dans le 3e octet, soit 254. Le pas est de 2 dans le 3e octet, 510 hôtes utilisables." },
  { q: "Quelle est l'adresse de réseau de 172.16.5.200/20 ?",
    options: ["172.16.5.0", "172.16.0.0", "172.16.4.0", "172.16.5.192"], reponse: 1,
    explication: "/20 = 255.255.240.0 : pas de 16 dans le 3e octet ; 5 est dans 0–15, donc réseau 172.16.0.0 et diffusion 172.16.15.255 (15 dans le 3e octet, 255 dans le 4e)." },
  { q: "Combien d'hôtes utilisables dans un /27 ?",
    options: ["32", "30", "62", "14"], reponse: 1,
    explication: "5 bits d'hôte : 2⁵ = 32 adresses, moins l'adresse de réseau et la diffusion : 30." },
  { q: "Avec le masque 255.255.255.192, 192.168.123.71 et 192.168.123.133 sont…",
    options: ["dans le même réseau", "dans des réseaux différents : ils passent par la passerelle", "tous deux des adresses de diffusion", "invalides"], reponse: 1,
    explication: "C'est l'exemple de Microsoft : en /26, le premier est dans le réseau .64, le second dans le réseau .128." },
  { q: "Un poste joint le réseau local mais aucun réseau distant. Quel réglage soupçonnes-tu d'abord ?",
    options: ["Le masque", "La passerelle par défaut", "Le nom du poste", "La carte graphique"], reponse: 1,
    explication: "Local OK, distant KO : la passerelle (absente, fausse ou hors du réseau du poste) est la première piste." },
  { q: "Laquelle de ces plages est une plage privée de la RFC 1918 ?",
    options: ["100.64.0.0/10", "169.254.0.0/16", "172.16.0.0/12", "127.0.0.0/8"], reponse: 2,
    explication: "Les plages privées sont 10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16. 100.64/10 est l'espace partagé, 169.254/16 le lien local, 127/8 la boucle locale." }
]};

window.IT_QUIZZES["module-securite-poste"] = { titre: "Quiz : sécurité du poste", questions: [
  { q: "Un courriel demande de « valider ton compte » ; le texte du lien affiche le site de l'université, mais l'adresse réelle mène ailleurs. Que conclure ?",
    options: ["Rien : c'est courant", "C'est un signe d'hameçonnage : on ne clique pas et on signale", "Il suffit de vérifier l'orthographe", "On clique pour voir si la page ressemble au vrai site"], reponse: 1,
    explication: "Microsoft cite en premier signe un lien dont la destination réelle ne correspond pas à l'adresse affichée. On vérifie par un canal connu et on signale à l'équipe de sécurité (Microsoft Learn, How to protect against phishing attacks)." },
  { q: "Dans l'historique de protection, un fichier est « mis en quarantaine ». Qu'est-ce que cela veut dire ?",
    options: ["Il a été supprimé définitivement", "Il a été envoyé à Microsoft", "Il est bloqué mais pas encore supprimé ; on peut le supprimer ou le restaurer", "Il est autorisé jusqu'au redémarrage"], reponse: 2,
    explication: "Une menace mise en quarantaine est bloquée, pas encore supprimée, et ne devrait plus présenter de risque ; les actions possibles sont Supprimer ou Restaurer (Microsoft Support, Historique de protection)." },
  { q: "Un utilisateur « sûr à 100 % » te demande d'autoriser un fichier bloqué par Defender. Que fais-tu ?",
    options: ["Je choisis « Autoriser sur l'appareil »", "Je désactive la protection en temps réel quelques minutes", "Je laisse en quarantaine, je note tout dans le ticket et j'escalade à la sécurité", "Je lui dis de le renommer"], reponse: 2,
    explication: "Microsoft conseille la quarantaine en cas de doute : « Autoriser sur l'appareil » expose les données si c'était une vraie menace. La décision revient à l'équipe de sécurité, et on ne désactive pas l'antivirus." },
  { q: "Dans la sortie de Get-MpComputerStatus, AMRunningMode vaut « Passive mode ». Qu'est-ce que cela signifie ?",
    options: ["Defender tourne, mais un autre produit est l'antivirus principal", "Defender est désactivé par un virus", "Les définitions sont périmées", "Le poste n'a jamais été analysé"], reponse: 0,
    explication: "Normal : Defender est l'antivirus actif. Passive mode : Defender tourne mais n'est pas l'antivirus principal, sur un poste inscrit à Defender for Endpoint (Microsoft Learn, Microsoft Defender Antivirus in Windows)." },
  { q: "Une utilisatrice a saisi son mot de passe sur une page douteuse il y a vingt minutes. Quelle est ta première action ?",
    options: ["Lui envoyer un nouveau mot de passe par courriel", "Signaler tout de suite l'incident selon la procédure de sécurité", "Attendre de voir si des courriels bizarres partent", "Supprimer le message reçu pour qu'elle ne clique plus"], reponse: 1,
    explication: "C'est un incident de sécurité : on signale immédiatement. Microsoft rappelle de ne jamais envoyer le nouveau mot de passe par courriel, car l'attaquant peut avoir accès à la boîte (Microsoft Learn, Responding to a compromised email account). On ne supprime rien : l'équipe de sécurité examinera les messages envoyés et les journaux." },
  { q: "On t'apporte une clé USB trouvée dans un auditoire. Que recommande la CISA ?",
    options: ["La brancher sur un poste isolé pour trouver le propriétaire", "La formater avant de la rendre", "Ne pas la brancher et la remettre au service désigné (sécurité ou informatique)", "La brancher si l'antivirus est à jour"], reponse: 2,
    explication: "La CISA demande de ne pas brancher une clé inconnue et de remettre une clé trouvée aux personnes désignées, sans la brancher pour voir son contenu ou identifier son propriétaire (CISA, Using Caution with USB Drives)." }
] };

window.IT_QUIZZES["module-deploiement-postes"] = { titre: "Quiz : déploiement et gestion des postes", questions: [
  { q: "Dans dsregcmd /status, un poste affiche AzureAdJoined : YES, EnterpriseJoined : NO, DomainJoined : YES. Quel est son état ?",
    options: ["Joint au domaine seulement", "Joint à Microsoft Entra seulement", "Inscrit à Microsoft Entra (Workplace Joined)", "Joint hybride : domaine et Microsoft Entra"], reponse: 3,
    explication: "YES / NO / YES correspond à « Microsoft Entra hybrid joined » dans le tableau de Microsoft (Troubleshoot devices by using the dsregcmd command)." },
  { q: "Selon Microsoft, qu'est-ce qui distingue Windows Autopilot d'un déploiement traditionnel par image ?",
    options: ["Il part de la version de Windows installée par le constructeur et la transforme, sans image à maintenir", "Il impose de réinstaller Windows depuis une clé USB", "Il ne fonctionne qu'avec Windows Famille", "Il remplace l'inventaire"], reponse: 0,
    explication: "Autopilot utilise la version de Windows préinstallée par le constructeur et la transforme en poste d'entreprise (réglages, applications, édition), au lieu de réimager (Overview of Windows Autopilot)." },
  { q: "Dans la classification de Microsoft, le scénario « refresh » (effacer et recharger) consiste à…",
    options: ["Mettre Windows à jour sans rien effacer", "Sauvegarder l'état de l'utilisateur, effacer le disque, réinstaller, puis restaurer cet état", "Transférer l'utilisateur sur un nouveau PC", "Activer l'édition Entreprise par abonnement"], reponse: 1,
    explication: "Refresh, ou « wipe and load » : on redéploie un appareil en sauvegardant l'état de l'utilisateur, en effaçant le disque puis en restaurant cet état (Windows deployment scenarios). Le transfert vers un nouveau PC, c'est « replace »." },
  { q: "Que fait l'action « Wipe » de Microsoft Intune ?",
    options: ["Elle supprime seulement les applications de l'entreprise", "Elle verrouille l'écran à distance", "Elle remet l'appareil aux paramètres d'usine en supprimant toutes les données, applications et configurations", "Elle met à jour Windows"], reponse: 2,
    explication: "Wipe réinitialise l'appareil aux paramètres d'usine et supprime toutes les données personnelles et professionnelles, les applications et les configurations (Wipe devices with Microsoft Intune) : jamais sans procédure ni sauvegarde vérifiée." },
  { q: "Quelle commande donne le numéro de série d'un poste pour l'inventaire ?",
    options: ["ipconfig /all", "Get-CimInstance Win32_BIOS | Select-Object SerialNumber", "whoami /groups", "dsregcmd /status"], reponse: 1,
    explication: "La classe Win32_BIOS expose la propriété SerialNumber ; le modèle et le fabricant sont dans Win32_ComputerSystem (Microsoft Learn)." },
  { q: "Un poste doit être recyclé. Supprimer les fichiers de l'utilisateur et vider la corbeille suffit-il ?",
    options: ["Oui, si la corbeille est vide", "Oui, après un redémarrage", "Non : il faut assainir le support selon la procédure, avec une technique adaptée à la sensibilité des données", "Non, il faut seulement retirer le compte de l'utilisateur"], reponse: 2,
    explication: "Le NIST (SP 800-88 Rev. 2) définit l'assainissement comme rendre l'accès aux données infaisable pour un niveau d'effort donné, avec une technique choisie selon la sensibilité des informations ; une simple suppression ne le garantit pas." }
] };

window.IT_QUIZZES["module-linux-support"] = { titre: "Quiz : bases de Linux pour le support", questions: [
  { q: "À la première connexion SSH à un serveur, le client affiche une empreinte et demande « yes/no ». Que se passe-t-il si tu réponds yes ?",
    options: ["Le mot de passe est enregistré", "Le serveur est ajouté à la liste des hôtes connus de ton poste", "La connexion devient non chiffrée", "Le serveur redémarre"], reponse: 1,
    explication: "Répondre yes ajoute le serveur à la liste des hôtes SSH connus du client Windows ; on compare d'abord l'empreinte avec celle donnée par l'équipe du serveur (Microsoft Learn, Get started with OpenSSH for Windows)." },
  { q: "Quelle commande affiche seulement les 50 derniers messages du service ssh depuis le démarrage en cours ?",
    options: ["journalctl -u ssh.service -b -n 50", "systemctl restart ssh.service", "cat /var/log -n 50", "ls -l ssh.service"], reponse: 0,
    explication: "-u filtre sur une unité, -b sur le démarrage en cours, -n limite aux entrées les plus récentes (journalctl(1), Debian)." },
  { q: "systemctl status affiche « Active: failed ». Que fais-tu au service desk ?",
    options: ["sudo systemctl restart, puis je ferme le ticket", "Je supprime les journaux pour faire de la place", "Je note l'état, l'heure et les dernières lignes du journal, et je transmets à l'équipe du serveur", "Rien : c'est normal"], reponse: 2,
    explication: "systemctl status montre l'état et les dernières lignes du journal ; démarrer ou redémarrer un service change le serveur pour tous : on lit et on transmet (systemctl(1), Debian)." },
  { q: "Que signifie la ligne -rw-r----- au début d'une sortie de ls -l ?",
    options: ["Un répertoire que tout le monde peut modifier", "Un fichier ordinaire : le propriétaire lit et écrit, le groupe lit, les autres n'ont aucun droit", "Un lien symbolique exécutable", "Un fichier caché"], reponse: 1,
    explication: "Premier caractère : type (- fichier ordinaire) ; puis trois groupes rwx pour le propriétaire, le groupe et les autres (POSIX ls ; chmod(1), Debian)." },
  { q: "df -h indique 98 % pour /srv. Qu'est-ce que cela veut dire ?",
    options: ["Le processeur est chargé à 98 %", "Le réseau perd 98 % des paquets", "Le système de fichiers monté sur /srv est presque plein", "La mémoire vive est presque pleine"], reponse: 2,
    explication: "df affiche l'espace utilisé et disponible par système de fichiers ; -h en tailles lisibles (df(1), Debian)." },
  { q: "Pourquoi ne lance-t-on pas une commande avec sudo « pour aller plus vite » ?",
    options: ["Parce que sudo est payant", "Parce que sudo exécute la commande en tant que root (ou un autre utilisateur), avec des effets sur tout le système", "Parce que sudo efface l'historique", "Parce que sudo ne marche qu'en SSH"], reponse: 1,
    explication: "sudo permet à un utilisateur autorisé d'exécuter une commande en tant que superutilisateur ou autre utilisateur, selon la politique de sécurité (sudo(8), Debian) : jamais sans procédure." }
] };
