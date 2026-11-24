/* Quiz des modules : un quiz par module, identifiant `module-<id>` (moteur dans app.js).
   Ce fichier doit être chargé AVANT app.js. */
window.IT_QUIZZES = window.IT_QUIZZES || {};

window.IT_QUIZZES["module-support-windows"] = { titre: "Quiz : support poste Windows", questions: [
  { q: "Un utilisateur A rencontre une erreur sur un poste ; un utilisateur B n'en a pas sur le même poste. Où est la cause la plus probable ?",
    options: ["Dans le matériel du poste","Dans le disque dur","Dans le profil ou les réglages de A","Dans le câble réseau"], reponse: 2,
    explication: "Le problème suit l'utilisateur, pas le poste : profil, droits ou réglages propres au compte." },
  { q: "Un PC allume ses ventilateurs mais n'affiche aucune image. Quel maillon de la chaîne de démarrage est le plus probablement en cause ?",
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
    explication: "Un démarrage minimal est un outil de test : il faut le défaire pour ne pas laisser des services désactivés." }
] };

window.IT_QUIZZES["module-itil"] = { titre: "Quiz : ITIL 4 pour le service desk", questions: [
  { q: "Dans la chaîne de valeur ITIL 4, quelles activités le service desk touche-t-il le plus ?",
    options: ["Impliquer et fournir et soutenir","Planifier et obtenir ou construire","Concevoir et améliorer uniquement","Aucune"], reponse: 0,
    explication: "Le service desk est en première ligne de la relation avec l'utilisateur (impliquer) et du fonctionnement quotidien (fournir et soutenir)." },
  { q: "Pendant un incident majeur, que fait le N1 des nouveaux appels identiques ?",
    options: ["Un diagnostic complet à chaque appel","Les ignore","Promet une heure de résolution","Les rattache à l'incident en cours et relaie la communication officielle"], reponse: 3,
    explication: "On évite de multiplier les tickets et on n'annonce pas de délai non connu." },
  { q: "Qu'est-ce qu'une erreur connue ?",
    options: ["Un incident résolu","Un problème dont la cause est identifiée et pour lequel un contournement ou une correction existe","Une demande de service","Un changement urgent"], reponse: 1,
    explication: "On la documente dans la base de connaissances pour que le N1 propose le contournement." },
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

window.IT_QUIZZES["module-reseau-base"] = { titre: "Quiz : réseau de base", questions: [
  { q: "Quel est le réseau de la machine 192.168.10.77/26 ?",
    options: ["192.168.10.0","192.168.10.77","192.168.10.128","192.168.10.64"], reponse: 3,
    explication: "/26 = blocs de 64 : 0, 64, 128, 192. Le 77 est dans le bloc 64–127, donc le réseau est 192.168.10.64." },
  { q: "Un poste affiche 169.254.12.7. Que cela signifie-t-il ?",
    options: ["Il a une adresse publique","Il n'a pas obtenu d'adresse du DHCP","Son DNS est faux","Sa passerelle est trop lente"], reponse: 1,
    explication: "169.254.0.0/16 est la plage de lien local (APIPA) que Windows s'attribue quand le DHCP ne répond pas." },
  { q: "Le ping d'une adresse répond, mais pas celui du nom correspondant. Quelle est la piste ?",
    options: ["Le câble","La carte réseau","Le DNS","Le pare-feu du serveur"], reponse: 2,
    explication: "Le réseau fonctionne ; la traduction nom → adresse échoue." },
  { q: "Quel port utilise le protocole des partages de fichiers Windows (SMB) ?",
    options: ["TCP 80","TCP 3389","UDP 53","TCP 445"], reponse: 3,
    explication: "SMB utilise le port TCP 445. 3389 est le bureau à distance, 80 le web, 53 le DNS." },
  { q: "Quelle commande teste à la fois la résolution du nom et la connexion à un port ?",
    options: ["ipconfig /all","tracert nom","Test-NetConnection nom -Port 443","arp -a"], reponse: 2,
    explication: "Test-NetConnection résout le nom, teste la joignabilité et essaie la connexion TCP au port indiqué." },
  { q: "Un poste a l'adresse 192.168.1.50/24 et pour passerelle 192.168.2.1. Pourquoi n'a-t-il pas accès à Internet ?",
    options: ["La passerelle n'est pas dans le réseau du poste","Le masque est faux","Le DNS est absent","Le DHCP est coupé"], reponse: 0,
    explication: "La passerelle doit être dans le même réseau que le poste pour être atteinte directement." }
] };

window.IT_QUIZZES["module-ad-support"] = { titre: "Quiz : Active Directory pour le support", questions: [
  { q: "Quel identifiant ne change PAS quand on renomme un compte ?",
    options: ["Le nom distinctif (DN)","Le SID","Le nom d'affichage","L'adresse de messagerie"], reponse: 1,
    explication: "Le SID est stable : les droits y sont attachés. Le DN et les noms changent." },
  { q: "Un poste du domaine ne trouve plus aucun contrôleur de domaine. Quelle est la première piste ?",
    options: ["Le fond d'écran","La taille du profil","Le DNS du poste","La résolution d'écran"], reponse: 2,
    explication: "Le poste trouve ses DC par le DNS (enregistrements SRV). Un DNS erroné est la cause n° 1." },
  { q: "Quel écart d'horloge maximal Kerberos tolère-t-il par défaut ?",
    options: ["5 secondes","5 heures","Aucune limite","5 minutes"], reponse: 3,
    explication: "Par défaut, 5 minutes. Au-delà, l'authentification Kerberos échoue." },
  { q: "On vient d'ajouter un utilisateur à un groupe. Pour que son accès fonctionne, il doit…",
    options: ["Changer de mot de passe","Redémarrer le serveur","Fermer puis rouvrir sa session","Rien"], reponse: 2,
    explication: "Les groupes sont lus à l'ouverture de session : le jeton d'accès en cours ne contient pas la nouvelle appartenance." },
  { q: "Dans le modèle AGDLP, où place-t-on les permissions sur un dossier ?",
    options: ["Sur un groupe de domaine local","Sur chaque compte utilisateur","Sur le groupe global directement et jamais ailleurs","Sur l'OU"], reponse: 0,
    explication: "Comptes → groupes globaux → groupes de domaine local → permissions. On n'attribue pas de droit à une personne directement." },
  { q: "Le test « Test-ComputerSecureChannel » répond False. Que fais-tu ?",
    options: ["Tu retires le poste du domaine et le rejoins","Tu redémarres le DC","Tu supprimes le compte utilisateur","Tu notes le poste et son OU et tu escalades"], reponse: 3,
    explication: "La réparation du canal sécurisé demande des droits et une procédure : retirer le poste du domaine ferait perdre ses OU et ses groupes." }
] };

window.IT_QUIZZES["module-materiel-pc"] = { titre: "Quiz : matériel et PC", questions: [
  { q: "Où trouver le numéro de série d'un poste sans retourner la machine ?",
    options: ["Dans Win32_BIOS (SerialNumber) ou msinfo32","Dans le Gestionnaire des tâches","Dans l'adresse IP","Dans le nom d'utilisateur"], reponse: 0,
    explication: "Get-CimInstance Win32_BIOS renvoie SerialNumber, le numéro qu'attend le constructeur pour la garantie ; msinfo32 l'affiche aussi sur beaucoup de modèles." },
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
    explication: "Le support choisit « Help someone » et obtient un code à durée limitée, qu'il donne à l'utilisateur ; celui-ci le saisit et autorise la connexion." },
  { q: "Un utilisateur veut que tu te connectes en Bureau à distance à son PC en Windows 11 Famille. Que sais-tu ?",
    options: ["Ça marche si le pare-feu est désactivé", "Il faut seulement connaître le nom du PC", "Une édition Famille ne peut pas recevoir de connexion Bureau à distance", "Il faut passer par le port 443"], reponse: 2,
    explication: "Le poste hôte doit être en édition Pro ; seul le poste depuis lequel on se connecte peut être de n'importe quelle édition." },
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
    explication: "L'accès total permet d'ouvrir et de lire la boîte, pas d'envoyer : pour répondre depuis l'adresse de la boîte, il faut aussi Envoyer en tant que." },
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
