/* Contrôle des ancres de l'index de recherche (page docs/recherche.html). */
(function () {
  "use strict";
  var btn = document.querySelector("[data-controle]");
  var etat = document.querySelector("[data-controle-etat]");
  var liste = document.querySelector("[data-controle-liste]");
  var idx = window.IT_RECHERCHE || [];
  etat.textContent = idx.length + " entrées dans l'index.";
  btn.addEventListener("click", function () {
    btn.disabled = true;
    liste.textContent = "";
    var pages = {};
    idx.forEach(function (e) {
      var p = e.u.split("#")[0].split("?")[0];
      (pages[p] = pages[p] || []).push(e);
    });
    var noms = Object.keys(pages), i = 0, morts = 0;
    var frame = document.createElement("iframe");
    frame.title = "Page en cours de contrôle";
    frame.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none";
    document.body.appendChild(frame);
    function ligne(e, ok) {
      var tr = document.createElement("tr");
      [e.u, e.t, ok ? "✓" : "✗ ancre ou page introuvable"].forEach(function (t, k) {
        var td = document.createElement("td"); td.textContent = t;
        if (k === 2) td.className = ok ? "fait" : "";
        if (k === 2 && !ok) td.style.color = "var(--red)";
        tr.appendChild(td);
      });
      liste.appendChild(tr);
    }
    function suivant() {
      if (i >= noms.length) {
        frame.remove();
        btn.disabled = false;
        etat.textContent = idx.length + " entrées, " + noms.length + " pages : " + (morts ? morts + " lien(s) mort(s)." : "aucun lien mort.");
        return;
      }
      var p = noms[i++];
      etat.textContent = "Contrôle de " + p + "…";
      frame.onload = function () {
        var doc = null;
        try { doc = frame.contentDocument; } catch (err) { doc = null; }
        pages[p].forEach(function (e) {
          var ancre = e.u.split("#")[1];
          var ok = !!doc && doc.title !== "" && (!ancre || !!doc.getElementById(ancre));
          if (!ok) morts++;
          if (!ok || ancre) ligne(e, ok);
        });
        suivant();
      };
      frame.src = "../" + p;
    }
    suivant();
  });
})();
