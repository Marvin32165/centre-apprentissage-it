// Génère assets/recherche.js (index statique de la recherche rapide, sans fetch).
// À relancer après l'ajout d'une page, d'une section (h2 avec id), d'une commande, d'un module ou d'une panne :
//   node outils/index-recherche.mjs
// Le contrôle des ancres se fait dans docs/recherche.html (et dans outils/verif.mjs).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => fs.readFileSync(path.join(R, f), "utf8");
const texte = (h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["assets/data.js", "assets/modules.js", "assets/atelier-data.js", "assets/atelier-scenarios.js", "assets/atelier-pannes-data.js"]) vm.runInContext(lire(f), ctx, { filename: f });
const W = ctx.window, D = W.IT_DATA, M = W.IT_MODULES, A = W.IT_ATELIER;

const entrees = [];
const ajoute = (g, tag, titre, origine, url, mots = "") => entrees.push({ g, tag, t: titre, o: origine, u: url, m: mots.slice(0, 220) });
const IGNORES = new Set(["plan", "quiz", "memo", "objectifs", "cas", "suite", "sources", "tuteur"]);

// Sections (h2 avec id) des pages de contenu, avec les h3 et le début du texte comme mots-clés
function sections(fichier, origine, tag) {
  const h = lire(fichier);
  const corps = h.slice(h.indexOf("<main"));
  const parts = corps.split(/(?=<h2\b)/);
  for (const p of parts) {
    const m = /^<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/.exec(p);
    if (!m || IGNORES.has(m[1])) continue;
    const titre = texte(m[2].replace(/<span class="duree">[\s\S]*?<\/span>/, "")).replace(/^\d+\.\s+/, "");
    const h3 = [...p.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((x) => texte(x[1]));
    const p1 = /<p>([\s\S]*?)<\/p>/.exec(p);
    ajoute("Notions", tag, titre, origine, fichier + "#" + m[1], h3.join(" · ") + " " + (p1 ? texte(p1[1]) : ""));
  }
}
D.stage.jours.forEach((j) => sections(j.href, `Prépa · jour ${j.n} · ${j.court}`, "jour"));
sections("stage/outils.html", "Prépa · boîte à outils", "outils");
M.modules.forEach((mo) => sections(`modules/${mo.id}.html`, `Module · ${mo.titre.split(" : ")[0]}`, "module"));

// Commandes de la boîte à outils (chaque ligne des blocs de code de la section « Commandes »)
{
  const h = lire("stage/outils.html");
  const sec = h.slice(h.indexOf('<h2 id="commandes"'), h.indexOf("<h2", h.indexOf('<h2 id="commandes"') + 5));
  let groupe = "";
  for (const m of sec.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>|<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)) {
    if (m[1]) { groupe = texte(m[1]); continue; }
    texte(m[2].replace(/\n/g, "¶")).split("¶").map((l) => l.trim()).filter(Boolean).forEach((cmd) => {
      ajoute("Commandes", "cmd", cmd, "Boîte à outils · " + groupe, "stage/outils.html#commandes", groupe);
    });
  }
}

// Modules du catalogue
M.modules.forEach((mo) => {
  const h = Math.round(mo.duree / 60);
  ajoute("Modules", "module", mo.titre, `Module · niveau ${mo.niveau} · ≈ ${h} h`, `modules/${mo.id}.html`, (mo.resume || "") + " " + (mo.tags || []).join(" "));
});
// Domaines (thèmes)
M.domaines.forEach((d) => ajoute("Modules", "thème", d.titre, "Thèmes · domaine", `themes.html?domaine=${d.id}`, d.desc || ""));

// Atelier : montages et dossiers de pannes
Object.values(A.scenarios || {}).forEach((s) => ajoute("Atelier", "montage", s.titre, `Atelier · montage · ${s.niveau || ""}`.replace(/ · $/, ""), `atelier/montage.html?s=${s.id}`, s.client || ""));
const causes = Object.fromEntries((A.pannesCauses || []).map((c) => [c.id, c.nom]));
Object.entries(A.pannes || {}).forEach(([id, p]) => ajoute("Atelier", "panne", p.titre, `Atelier · dossier de panne · ${p.niveau}`, `atelier/pannes.html?p=${id}`, (p.symp ? p.symp.titre + " " : "") + (p.ticket || "") + " " + (causes[p.cause] || "")));
ajoute("Atelier", "page", "Évaluation finale des montages", "Atelier · évaluation", "atelier/evaluation.html", "test noté examen");
ajoute("Atelier", "page", "Évaluation des pannes", "Atelier · évaluation", "atelier/pannes-eval.html", "test noté examen diagnostic");

const sortie = `/* Index de la recherche rapide — fichier GÉNÉRÉ par outils/index-recherche.mjs (ne pas modifier à la main).
   g = groupe, tag = étiquette, t = titre, o = provenance, u = lien depuis la racine, m = mots-clés. */
window.IT_RECHERCHE = ${JSON.stringify(entrees, null, 0).replace(/\},\{/g, "},\n{")};
`;
fs.writeFileSync(path.join(R, "assets/recherche.js"), sortie);
const parGroupe = entrees.reduce((a, e) => ((a[e.g] = (a[e.g] || 0) + 1), a), {});
console.log(`assets/recherche.js : ${entrees.length} entrées`, parGroupe);
