/* Atelier hardware — partie D : arbre de diagnostic et instruments dessinés (lot 45).
   L'arbre suit la méthode du module « Matériel et PC » (§ 3 : POST, bips, LED, configuration minimale) :
   on observe d'abord ce que la machine montre, on isole ensuite. Les feuilles renvoient aux causes des dossiers.
   Les instruments (testeur d'alimentation, LED de debug, buzzer, écran) affichent l'observation du moteur des pannes. */
(function () {
  "use strict";
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Une chaîne de questions : « oui » descend, « non » ouvre la branche de ses causes. */
  var ARBRE = [
    { id: "q1", q: "Au bouton marche, une LED ou un ventilateur réagit-il ?", non: "Rien ne s'allume", conseil: "Secteur et interrupteur d'abord, puis nappe de façade, alimentation (testeur), court-circuit sous la carte.", causes: ["facade", "alim", "entretoise"] },
    { id: "q2", q: "Une image apparaît-elle à l'écran ?", non: "Pas d'image", conseil: "Lire la LED de debug et écouter les bips : ils disent où le POST s'arrête (CPU, DRAM, VGA, BOOT).", causes: ["eps", "bios", "cpu", "ram", "gpu-cable", "gpu"],
      sous: [["CPU", ["eps", "bios", "cpu"]], ["DRAM", ["ram"]], ["VGA", ["gpu-cable", "gpu"]]] },
    { id: "q3", q: "Le PC reste-t-il allumé, même sous charge ?", non: "Il s'éteint tout seul", conseil: "Surchauffe probable : ventirad, pâte thermique, poussière. Vérifier la température dans l'UEFI.", causes: ["ventirad", "pate", "poussiere"] },
    { id: "q4", q: "Le démarrage se passe-t-il sans message d'avertissement ?", non: "Message au démarrage", conseil: "Lire le message : réglages perdus, date fausse = pile CMOS.", causes: ["cmos"] },
    { id: "q5", q: "L'UEFI voit-il le disque de démarrage ?", non: "Aucun disque", conseil: "Câbles du disque (données et alimentation) d'abord, puis le disque lui-même (pièce témoin).", causes: ["sata", "ssd"] }
  ];

  /* Rend l'arbre en HTML (lisible sur mobile et au lecteur d'écran). cause : chemin à tracer (corrigé), lien(cause) : URL d'un dossier. */
  function arbre(o) {
    o = o || {};
    var A = window.IT_ATELIER, noms = {};
    ((A && A.pannesCauses) || []).forEach(function (c) { noms[c.id] = c.nom; });
    var fin = -1;
    if (o.cause) ARBRE.forEach(function (n, i) { if (fin < 0 && n.causes.indexOf(o.cause) >= 0) fin = i; });
    var h = '<ol class="arbre' + (o.cause ? " trace" : "") + '">';
    ARBRE.forEach(function (n, i) {
      var passe = fin >= 0 && i < fin, ici = i === fin;
      h += '<li class="arbre-n' + (passe ? " passe" : "") + (ici ? " ici" : "") + '"><p class="arbre-q"><span class="arbre-num">' + (i + 1) + "</span>" + esc(n.q) + "</p>";
      h += '<div class="arbre-non"><p class="arbre-etiq"><span>Non</span> ' + esc(n.non) + "</p><p class=\"arbre-conseil\">" + esc(n.conseil) + "</p><ul>";
      var groupes = n.sous || [[null, n.causes]];
      groupes.forEach(function (g) {
        g[1].forEach(function (c) {
          var lien = o.lien ? o.lien(c) : null, txt = (g[0] ? "LED « " + g[0] + " » : " : "") + (noms[c] || c);
          h += '<li class="' + (o.cause === c ? "cible" : "") + '">' + (lien ? '<a href="' + esc(lien) + '">' + esc(txt) + "</a>" : esc(txt)) + (o.cause === c ? ' <span class="sr-only">(cause de ce dossier)</span>' : "") + "</li>";
        });
      });
      h += "</ul></div>";
      if (i < ARBRE.length - 1) h += '<p class="arbre-oui"><span>Oui</span> question suivante</p>';
      h += "</li>";
    });
    return h + '</ol><p class="arbre-fin">Toujours rien ? Configuration minimale (une barrette, pas de carte d\'extension), puis pièces témoins une par une, puis carte mère.</p>';
  }

  /* ---------- Instruments (vue de face, au trait) ---------- */
  function cadre(w, h, titre, corps) {
    return '<svg class="instrument-svg" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(titre) + '">' + corps + "</svg>";
  }
  function lcd(x, y, w, h, lignes) {
    var s = '<rect class="ins-lcd" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3"/>';
    lignes.forEach(function (t, i) { s += '<text class="ins-lcd-t" x="' + (x + 8) + '" y="' + (y + 18 + i * 16) + '">' + esc(t) + "</text>"; });
    return s;
  }
  function decoupe(t, n) {
    var mots = String(t).split(" "), l = [], c = "";
    mots.forEach(function (m) { if ((c + " " + m).trim().length > n) { l.push(c.trim()); c = m; } else c += " " + m; });
    if (c.trim()) l.push(c.trim());
    return l;
  }
  var INSTR = {
    alim: function (t) {
      var l = decoupe(t, 34).slice(0, 5);
      return cadre(320, 170, "Testeur d'alimentation : " + t,
        '<rect class="ins-boitier" x="4" y="4" width="312" height="162" rx="10"/>' + lcd(18, 18, 284, 96, l) +
        '<text class="ins-etiq" x="18" y="140">TESTEUR D\'ALIMENTATION</text><text class="ins-etiq" x="18" y="156">24 BROCHES · EPS · PCIE · SATA</text>' +
        '<circle class="ins-voyant" cx="290" cy="146" r="7"/>');
    },
    led: function (t, post) {
      var on = post && post.debug, leds = ["CPU", "DRAM", "VGA", "BOOT"], s = '<rect class="ins-boitier" x="4" y="4" width="312" height="110" rx="6"/><text class="ins-etiq" x="18" y="26">LED DE DEBUG DE LA CARTE MÈRE</text>';
      leds.forEach(function (n, i) {
        var x = 30 + i * 72;
        s += '<circle class="ins-led' + (on === n ? " on" : "") + '" cx="' + (x + 10) + '" cy="58" r="10"/><text class="ins-etiq c" x="' + (x + 10) + '" y="92">' + n + "</text>";
      });
      return cadre(320, 118, "LED de debug : " + (on ? "LED « " + on + " » allumée" : "aucune LED de debug allumée"), s);
    },
    bips: function (t) {
      var l = decoupe(t, 34).slice(0, 3);
      return cadre(320, 120, "Buzzer : " + t, '<rect class="ins-boitier" x="4" y="4" width="312" height="112" rx="6"/><circle class="ins-buzzer" cx="44" cy="60" r="26"/><circle class="ins-det" cx="44" cy="60" r="6"/>' +
        '<path class="ins-onde" d="M80 44 q8 16 0 32 M92 36 q14 24 0 48"/>' + lcd(112, 22, 192, 76, l));
    },
    bios: function (t) {
      var l = decoupe(t, 46).slice(0, 6);
      return cadre(320, 150, "Écran UEFI : " + t, '<rect class="ins-ecran" x="4" y="4" width="312" height="142" rx="4"/>' + l.map(function (x, i) { return '<text class="ins-ecran-t" x="16" y="' + (28 + i * 18) + '">' + esc(x) + "</text>"; }).join(""));
    }
  };
  function instrument(id, texte, post) {
    var f = INSTR[id];
    return f ? f(texte, post) : "";
  }

  window.IT_DIAG = { ARBRE: ARBRE, arbre: arbre, instrument: instrument };
})();
