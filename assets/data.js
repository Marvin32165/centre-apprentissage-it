/* Données communes : rubriques, dates du stage, unités de progression, quiz.
   Les lots suivants ajoutent leurs identifiants dans `units` et leurs quiz dans IT_QUIZZES. */
window.IT_DATA = {
  stage: {
    debut: "2026-12-07",
    fin: "2027-02-05",
    periodes: "du 7 au 18 décembre 2026, puis du 4 janvier au 5 février 2027, de 8 h 30 à 16 h",
    /* Prépa : sept séances, du lundi 30/11 au dimanche 6/12 (week-end compris), dont trois séances doubles : J1 + J2, J7 + J8, J9 + J10. */
    prepaDebut: "2026-11-30",
    jours: [
      { n: 1, date: "2026-11-30", href: "stage/j1.html", court: "Service desk", sujet: "le métier de <em>service desk</em>", chapeau: "ITIL, priorités, SLA et escalade : le vocabulaire que ton équipe utilisera dès le premier jour.", duree: "≈ 1 h 45", blocs: 6 },
      { n: 2, date: "2026-11-30", href: "stage/j2.html", court: "Téléphone", sujet: "le <em>téléphone</em>", chapeau: "Accueillir, questionner, reformuler, rester calme face à un utilisateur difficile et déjouer l'ingénierie sociale.", duree: "≈ 1 h 45", blocs: 7 },
      { n: 3, date: "2026-12-01", href: "stage/j3.html", court: "Jira", sujet: "<em>Jira</em>, de l'ouverture à la clôture", chapeau: "L'anatomie d'un ticket, ses statuts, une rédaction claire et la base de connaissances.", duree: "≈ 3 h 30", blocs: 7 },
      { n: 4, date: "2026-12-02", href: "stage/j4.html", court: "Windows", sujet: "<em>Windows</em> côté poste", chapeau: "Outils de diagnostic, profils, mises à jour, sfc et DISM, environnement de récupération.", duree: "≈ 3 h 30", blocs: 7 },
      { n: 5, date: "2026-12-03", href: "stage/j5.html", court: "Réseau", sujet: "le <em>réseau</em> côté utilisateur", chapeau: "DHCP, DNS, ping et tracert, eduroam, lecteurs réseau et imprimantes.", duree: "≈ 3 h 30", blocs: 6 },
      { n: 6, date: "2026-12-04", href: "stage/j6.html", court: "Active Directory", sujet: "<em>Active Directory</em> côté support", chapeau: "Mots de passe, comptes verrouillés, groupes, OU et GPO, PowerShell en lecture.", duree: "≈ 3 h 30", blocs: 6 },
      { n: 7, date: "2026-12-05", href: "stage/j7.html", court: "Microsoft 365", sujet: "messagerie et <em>Microsoft 365</em>", chapeau: "Outlook, Teams, OneDrive et MFA : les demandes les plus fréquentes du quotidien.", duree: "≈ 1 h 45", blocs: 6 },
      { n: 8, date: "2026-12-05", href: "stage/j8.html", court: "À distance", sujet: "dépannage à distance et <em>méthode</em>", chapeau: "Assistance rapide, RDP, consentement, méthode de diagnostic et incident de sécurité.", duree: "≈ 1 h 45", blocs: 6 },
      { n: 9, date: "2026-12-06", href: "stage/j9.html", court: "Matériel", sujet: "matériel et <em>PC</em>", chapeau: "BIOS/UEFI, TPM, BitLocker, déploiement, salles informatiques, colis et inventaire.", duree: "≈ 3 h", blocs: 6 },
      { n: 10, date: "2026-12-06", href: "stage/j10.html", court: "Révision", sujet: "<em>révision</em> et répétition générale", chapeau: "Révision express et check-list du premier jour. Les appels simulés sont à faire le soir pendant ta première semaine de stage.", duree: "≈ 45 min", blocs: 2 }
    ]
  },
  rubriques: [
    { id: "accueil", titre: "Accueil", menu: "Aujourd'hui", href: "index.html" },
    { id: "stage", titre: "Prépa stage", href: "stage/index.html",
      desc: "Dix jours pour arriver prêt au service desk : théorie, labos, mises en situation.",
      units: ["stage-j1", "stage-j2", "stage-j3", "stage-j4", "stage-j5", "stage-j6", "stage-j7", "stage-j8", "stage-j9", "stage-j10"] },
    { id: "modules", titre: "Modules", href: "modules/index.html",
      desc: "Des cours ciblés, du support poste au réseau en passant par Active Directory.",
      units: ["module-support-windows", "module-itil", "module-reseau-base", "module-ad-support", "module-materiel-pc", "module-depannage-distance", "module-m365-messagerie", "module-imprimantes-peripheriques", "module-sous-reseaux", "module-jira-quotidien"] },
    { id: "themes", titre: "Thèmes", href: "themes.html",
      desc: "Les grands domaines de l'IT, avec des liens vers les modules.", units: [] },
    { id: "atelier", titre: "Atelier hardware", menu: "Atelier", href: "atelier/index.html",
      desc: "Monter, diagnostiquer et réparer un PC virtuel, pièce par pièce.", units: ["atelier-s1", "atelier-s2", "atelier-s3", "atelier-s4", "atelier-s5", "atelier-s6", "atelier-eval", "atelier-pannes", "atelier-pannes-eval"] }
  ]
};
window.IT_QUIZZES = window.IT_QUIZZES || {};
