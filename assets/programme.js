/* Programme des 10 jours de préparation.
   Lu par assets/app.js pour la navigation, l'accueil et la progression.
   Pour ajouter une page : ajouter une entrée ici, puis créer le fichier. */
window.PROGRAMME = {
  stage: {
    debut: "2026-12-07",
    lieu: "UMONS — Direction des Services Informatiques",
    poste: "Service desk — Support et Services"
  },
  jours: [
    { n: 1,  date: "2026-11-23", fichier: "j01.html", titre: "Le métier de service desk",
      resume: "ITIL en pratique : incident, demande, priorité, escalade, niveaux N1 à N4.", duree: "4 h" },
    { n: 2,  date: "2026-11-24", fichier: "j02.html", titre: "Le téléphone et l'utilisateur",
      resume: "Prendre un appel, questionner, reformuler, calmer, vérifier l'identité, clôturer.", duree: "4 h" },
    { n: 3,  date: "2026-11-25", fichier: "j03.html", titre: "Jira et le ticket parfait",
      resume: "Anatomie d'un ticket, statuts, rédaction, commentaires, base de connaissances.", duree: "4 h 30" },
    { n: 4,  date: "2026-11-26", fichier: "j04.html", titre: "Windows 10/11 côté poste",
      resume: "Les outils de diagnostic, les profils, les mises à jour, la réparation du système.", duree: "5 h" },
    { n: 5,  date: "2026-11-27", fichier: "j05.html", titre: "Le réseau vu de l'utilisateur",
      resume: "ipconfig, DHCP, DNS, Wi-Fi eduroam, lecteurs réseau, imprimantes.", duree: "4 h 30" },
    { n: 6,  date: "2026-11-30", fichier: "j06.html", titre: "Active Directory côté support",
      resume: "Mot de passe, compte verrouillé, groupes, GPO, PowerShell en lecture.", duree: "5 h" },
    { n: 7,  date: "2026-12-01", fichier: "j07.html", titre: "Messagerie, Office et comptes",
      resume: "Outlook, Teams, OneDrive, MFA, boîtes partagées, licences.", duree: "4 h 30" },
    { n: 8,  date: "2026-12-02", fichier: "j08.html", titre: "Dépanner à distance, avec méthode",
      resume: "Assistance rapide, RDP, prise en main, et une méthode de diagnostic qui tient.", duree: "4 h" },
    { n: 9,  date: "2026-12-03", fichier: "j09.html", titre: "Matériel, PC, salles et colis",
      resume: "Installer et intégrer un PC, BIOS/UEFI, BitLocker, salles informatiques, réception.", duree: "5 h" },
    { n: 10, date: "2026-12-04", fichier: "j10.html", titre: "Révision et simulation",
      resume: "Dix appels simulés de bout en bout, quiz final, check-list du premier jour.", duree: "4 h 30" }
  ],
  annexes: [
    { fichier: "outils.html", titre: "Boîte à outils", resume: "Commandes, phrases utiles, modèle de ticket, raccourcis." }
  ]
};
