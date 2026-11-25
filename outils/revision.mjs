// Génère assets/revision.js : les fiches mémo des jours 1 à 9, copiées depuis la section #memo de chaque page
// (sans fetch : la page de révision marche aussi en file://). À relancer après toute modification d'une fiche mémo :
//   node outils/revision.mjs            (inclus dans npm run index)
//   node outils/revision.mjs --verifier (utilisé par outils/garde.mjs)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => fs.readFileSync(path.join(R, f), "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(lire("assets/data.js"), ctx, { filename: "assets/data.js" });
const fiches = [];
for (const j of ctx.window.IT_DATA.stage.jours) {
  const h = lire(j.href);
  const m = /<h2 id="memo"[^>]*>[\s\S]*?<\/h2>\s*<div class="bloc">([\s\S]*?)<\/div>/.exec(h);
  if (!m) continue; // J10 (révision) n'a pas de fiche mémo
  const memo = m[1].trim();
  fiches.push({ n: j.n, court: j.court, href: j.href.replace(/^stage\//, ""), memo });
}
const sortie = `/* Fiches mémo de la prépa — fichier GÉNÉRÉ par outils/revision.mjs depuis la section #memo des pages de jour (ne pas modifier à la main). */
window.IT_REVISION = ${JSON.stringify(fiches, null, 1)};
`;
const cible = path.join(R, "assets/revision.js");
if (process.argv.includes("--verifier")) {
  const actuel = fs.existsSync(cible) ? fs.readFileSync(cible, "utf8") : "";
  if (actuel !== sortie) { console.error("assets/revision.js n'est pas à jour : lancer npm run index"); process.exit(1); }
  console.log(`assets/revision.js à jour (${fiches.length} fiches)`);
  process.exit(0);
}
fs.writeFileSync(cible, sortie);
console.log(`assets/revision.js : ${fiches.length} fiches`);
