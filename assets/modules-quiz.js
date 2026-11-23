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
