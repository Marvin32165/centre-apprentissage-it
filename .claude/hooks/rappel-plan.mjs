// Hook Claude Code (SessionStart après compaction) : redonne le lot en cours et les derniers commits.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
const racine = process.env.CLAUDE_PROJECT_DIR || process.cwd();
let plan = "";
try { plan = fs.readFileSync(path.join(racine, "docs/PLAN.md"), "utf8"); } catch {}
const lots = plan.split(/(?=^## )/m).filter((l) => l.startsWith("## Lot ") && l.includes("- [ ]"));
console.log("Rappel après résumé : règles dans AGENTS.md, plan dans docs/PLAN.md.");
if (lots.length) console.log("Lot en cours :\n" + lots[0].trim().split("\n").filter((l) => /^## |^- \[/.test(l)).join("\n"));
try { console.log("Derniers commits :\n" + execSync("git log --oneline -5", { cwd: racine, encoding: "utf8" })); } catch {}
