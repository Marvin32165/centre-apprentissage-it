/* Révision express (stage/revision.html) : fiches mémo générées (assets/revision.js) et quiz mélangé.
   Chargé avant app.js : le quiz « stage-revision » doit exister quand app.js construit les quiz. */
(function () {
  "use strict";
  var fiches = window.IT_REVISION || [];
  var quizzes = window.IT_QUIZZES || (window.IT_QUIZZES = {});

  /* Fiches : une carte par jour, avec un lien vers la page complète */
  var zone = document.querySelector("[data-revision-fiches]");
  if (zone) {
    fiches.forEach(function (f) {
      var sec = document.createElement("section");
      sec.className = "bloc revision-fiche";
      sec.setAttribute("aria-labelledby", "fiche-j" + f.n);
      var h = document.createElement("h3");
      h.id = "fiche-j" + f.n;
      h.textContent = "Jour " + f.n + " · " + f.court;
      sec.appendChild(h);
      var corps = document.createElement("div");
      corps.innerHTML = f.memo; // contenu généré depuis nos propres pages
      sec.appendChild(corps);
      var p = document.createElement("p");
      var a = document.createElement("a");
      a.href = f.href + "#memo";
      a.textContent = "Revoir le jour " + f.n;
      p.appendChild(a);
      sec.appendChild(p);
      zone.appendChild(sec);
    });
  }

  /* Quiz mélangé : 10 questions tirées dans les quiz stage-j1 à stage-j9 */
  var pool = [];
  for (var n = 1; n <= 9; n++) {
    var q = quizzes["stage-j" + n];
    if (q) q.questions.forEach(function (x) { pool.push({ q: "J" + n + " · " + x.q, options: x.options, reponse: x.reponse, explication: x.explication }); });
  }
  for (var i = pool.length - 1; i > 0; i--) {
    var k = Math.floor(Math.random() * (i + 1)), t = pool[i];
    pool[i] = pool[k]; pool[k] = t;
  }
  quizzes["stage-revision"] = { titre: "Quiz mélangé de la prépa", questions: pool.slice(0, 10) };

  var btn = document.querySelector("[data-revision-tirage]");
  if (btn) btn.addEventListener("click", function () { location.reload(); });
})();
