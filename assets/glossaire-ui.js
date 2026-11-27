/* Glossaire (stage/glossaire.html) : liste alphabétique tirée de assets/glossaire.js,
   recherche locale (français, anglais, définition) et filtre par domaine. Chargé avant app.js. */
(function () {
  "use strict";
  var G = window.IT_GLOSSAIRE, zone = document.querySelector("[data-glossaire]");
  if (!G || !zone) return;
  var D = window.IT_DATA, M = window.IT_MODULES;

  function el(tag, attrs, txt) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (txt != null) n.textContent = txt;
    return n;
  }
  function plat(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[‘’ʼ]/g, "'").toLowerCase(); }
  function nomPage(lien) {
    var f = lien.split("#")[0], m = /^stage\/j(\d+)\.html$/.exec(f);
    if (m && D) { var j = D.stage.jours.filter(function (x) { return x.n === +m[1]; })[0]; return "Jour " + m[1] + (j ? " · " + j.court : ""); }
    m = /^modules\/([\w-]+)\.html$/.exec(f);
    if (m && M) { var mo = M.modules.filter(function (x) { return x.id === m[1]; })[0]; if (mo) return "Module · " + mo.titre.split(" : ")[0]; }
    return f;
  }
  var domaines = {};
  G.domaines.forEach(function (d) { domaines[d.id] = d.titre; });

  /* Outils : recherche, filtres, compteur */
  var outils = el("div", { "class": "g-outils" });
  var lab = el("label", { "for": "g-q", "class": "g-label" }, "Chercher un terme");
  var champ = el("input", { id: "g-q", type: "search", autocomplete: "off", placeholder: "bail, lease, GPO…" });
  outils.appendChild(lab); outils.appendChild(champ);
  var filtres = el("div", { "class": "g-filtres", role: "group", "aria-label": "Filtrer par domaine" });
  var choix = "";
  [{ id: "", titre: "Tous" }].concat(G.domaines).forEach(function (d) {
    var n = G.termes.filter(function (t) { return !d.id || t.d === d.id; }).length;
    var b = el("button", { type: "button", "class": "g-filtre", "data-d": d.id, "aria-pressed": d.id ? "false" : "true" });
    b.appendChild(document.createTextNode(d.titre + " "));
    b.appendChild(el("span", { "class": "g-n" }, String(n)));
    b.addEventListener("click", function () {
      choix = d.id;
      Array.prototype.forEach.call(filtres.children, function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      filtrer();
    });
    filtres.appendChild(b);
  });
  outils.appendChild(filtres);
  var compte = el("p", { "class": "g-compte", role: "status", "aria-live": "polite" });
  outils.appendChild(compte);
  zone.appendChild(outils);

  /* Liste : une lettre = un titre et une liste de définitions */
  var liste = el("div", { "class": "g-liste" }), groupes = [], lettre = null, dl = null;
  G.termes.forEach(function (t) {
    var l = plat(t.en).charAt(0).toUpperCase();
    if (l !== lettre) {
      lettre = l;
      var sec = el("section", { "class": "g-lettre", "aria-label": "Lettre " + l });
      sec.appendChild(el("h3", { "class": "g-l" }, l));
      dl = el("dl");
      sec.appendChild(dl);
      liste.appendChild(sec);
      groupes.push(sec);
    }
    var bloc = el("div", { "class": "g-terme", id: t.id, "data-d": t.d });
    var dt = el("dt");
    dt.appendChild(el("span", { "class": "g-en", lang: "en" }, t.en));
    dt.appendChild(el("span", { "class": "g-fr" }, t.fr));
    var ancre = el("a", { "class": "g-ancre", href: "#" + t.id, "aria-label": "Lien vers « " + t.en + " »" }, "#");
    dt.appendChild(ancre);
    bloc.appendChild(dt);
    var dd = el("dd", { "class": "g-def" });
    dd.appendChild(el("span", { "class": "g-dom" }, domaines[t.d] || t.d));
    dd.appendChild(document.createTextNode(t.def));
    bloc.appendChild(dd);
    var liens = el("dd", { "class": "g-liens" });
    var a1 = el("a", { href: "../" + t.lien }, "Voir sur le site : " + nomPage(t.lien));
    var a2 = el("a", { href: t.url, rel: "noopener" }, "Source : " + t.src);
    liens.appendChild(a1); liens.appendChild(a2);
    bloc.appendChild(liens);
    bloc._texte = plat([t.en, t.fr, t.def].join(" "));
    dl.appendChild(bloc);
  });
  zone.appendChild(liste);
  var vide = el("p", { "class": "g-vide", hidden: "" }, "Aucun terme ne correspond. Essaie le mot anglais, ou retire le filtre de domaine.");
  zone.appendChild(vide);

  function filtrer() {
    var q = plat(champ.value.trim()), n = 0;
    groupes.forEach(function (sec) {
      var visibles = 0;
      Array.prototype.forEach.call(sec.querySelectorAll(".g-terme"), function (b) {
        var ok = (!choix || b.getAttribute("data-d") === choix) && (!q || b._texte.indexOf(q) >= 0);
        b.hidden = !ok;
        if (ok) visibles++;
      });
      sec.hidden = !visibles;
      n += visibles;
    });
    compte.textContent = n + (n > 1 ? " termes" : " terme") + (n < G.termes.length ? " sur " + G.termes.length : "");
    vide.hidden = n > 0;
  }
  var minuterie;
  champ.addEventListener("input", function () { clearTimeout(minuterie); minuterie = setTimeout(filtrer, 120); });
  filtrer();

  /* Arrivée par une ancre (#g-…) : le terme est créé après le chargement, on y va et on le signale. */
  function viser() {
    var id = decodeURIComponent(location.hash.slice(1)), b = id && document.getElementById(id);
    if (!b || !b.classList.contains("g-terme")) return;
    Array.prototype.forEach.call(liste.querySelectorAll(".cible"), function (x) { x.classList.remove("cible"); });
    if (b.hidden) { champ.value = ""; choix = ""; Array.prototype.forEach.call(filtres.children, function (x) { x.setAttribute("aria-pressed", String(!x.getAttribute("data-d"))); }); filtrer(); }
    b.classList.add("cible");
    b.scrollIntoView({ block: "center" });
  }
  window.addEventListener("hashchange", viser);
  window.addEventListener("load", viser);
})();
