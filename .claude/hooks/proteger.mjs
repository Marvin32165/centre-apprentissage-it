// Hook Claude Code (PreToolUse sur Edit|Write) : bloque les fichiers protégés par AGENTS.md.
// En Node plutôt qu'en bash + jq pour marcher aussi sous Windows. Sortie 2 = bloqué, le message est renvoyé à Claude.
import fs from "node:fs";
import path from "node:path";
const entree = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const racine = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const fichier = path.relative(racine, path.resolve(racine, entree.tool_input?.file_path || "")).split(path.sep).join("/");
const plan = (() => { try { return fs.readFileSync(path.join(racine, "docs/PLAN.md"), "utf8"); } catch { return ""; } })();
const regles = [
  [/^assets\/atelier(-pannes)?-regles\.js$/, () => !plan.includes(`Moteur autorisé : ${fichier}`),
    "moteur de l'atelier : ne change pas sans demande explicite de Marvin (ligne « Moteur autorisé : " + fichier + " » dans docs/PLAN.md). Sinon, écris « Question pour Marvin : … » sous le lot."],
  [/^assets\/(recherche|revision)\.js$/, () => true, "fichier généré : lance npm run index au lieu de le modifier."],
  [/^(node_modules|\.git)\//, () => true, "dossier technique, jamais modifié à la main."],
  [/^\.\.\//, () => true, "hors du dépôt : ce dépôt est le seul à modifier (jamais centre-de-notes)."]
];
for (const [motif, bloque, raison] of regles)
  if (motif.test(fichier) && bloque()) { console.error(`Bloqué : ${fichier} — ${raison}`); process.exit(2); }
