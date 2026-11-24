// Hook Claude Code (Stop) : refuse l'arrêt tant que npm run garde échoue (index périmé, moteur modifié, IP publique…).
// Seulement les garde-fous rapides : l'audit complet (npm run controles) reste à lancer en fin de lot.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
const entree = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
if (entree.stop_hook_active) process.exit(0); // déjà relancé une fois : on laisse s'arrêter
const r = spawnSync(process.execPath, ["outils/garde.mjs"], { cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(), encoding: "utf8" });
if (r.status === 0) process.exit(0);
console.error("Les garde-fous échouent, corrige avant de t'arrêter :\n" + (r.stdout + r.stderr).split("\n").slice(-30).join("\n"));
process.exit(2);
