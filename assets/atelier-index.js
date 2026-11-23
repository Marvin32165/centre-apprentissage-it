/* Atelier hardware : affiche le meilleur score de chaque test sur la page d'entrée. */
(function () {
  "use strict";
  function afficher() {
    var store = window.IT && window.IT.store;
    if (!store) return;
    Array.prototype.forEach.call(document.querySelectorAll("[data-score]"), function (n) {
      var sc = parseInt(store.get("score." + n.getAttribute("data-score")), 10);
      var fait = store.get("done." + n.getAttribute("data-unit")) === "1";
      var t = [];
      if (!isNaN(sc)) t.push("Meilleur test : " + sc + " / 100");
      if (fait) t.push("Réussi ✓");
      n.textContent = t.join(" · ");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", afficher); else afficher();
})();
