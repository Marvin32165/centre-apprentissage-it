/* Données communes : rubriques, dates du stage, unités de progression, quiz.
   Les lots suivants ajoutent leurs identifiants dans `units` et leurs quiz dans IT_QUIZZES. */
window.IT_DATA = {
  stage: {
    debut: "2026-12-07",
    fin: "2027-02-05",
    periodes: "du 7 au 18 décembre 2026, puis du 4 janvier au 5 février 2027, de 8 h 30 à 16 h"
  },
  rubriques: [
    { id: "accueil", titre: "Accueil", href: "index.html" },
    { id: "stage", titre: "Prépa stage", href: "stage/index.html",
      desc: "Dix jours pour arriver prêt au service desk : théorie, labos, mises en situation.",
      units: ["stage-j1", "stage-j2", "stage-j3", "stage-j4", "stage-j5", "stage-j6", "stage-j7", "stage-j8", "stage-j9", "stage-j10"] },
    { id: "modules", titre: "Modules", href: "modules/index.html",
      desc: "Des cours ciblés, du support poste au réseau en passant par Active Directory.", units: [] },
    { id: "themes", titre: "Thèmes", href: "themes.html",
      desc: "Les grands domaines de l'IT, avec des liens vers les modules.", units: [] },
    { id: "atelier", titre: "Atelier hardware", href: "atelier/index.html",
      desc: "Monter, diagnostiquer et réparer un PC virtuel, pièce par pièce.", units: [] }
  ]
};
window.IT_QUIZZES = window.IT_QUIZZES || {};
