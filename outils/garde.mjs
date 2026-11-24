// Garde-fous rapides (sans navigateur) : règles de AGENTS.md vérifiables par un script.
//   node outils/garde.mjs        (ou npm run garde)
// Lancé par npm run controles, par la CI (audit.yml) et par le hook Git pre-commit (npm run hooks).
// Sortie 1 s'il y a un problème ; chaque problème dit quoi faire.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => fs.readFileSync(path.join(R, f), "utf8");
const problemes = [];
const avertissements = [];
const pb = (f, msg) => problemes.push(`${f} : ${msg}`);

// Fichiers du site et de la documentation (sans node_modules, .git, captures).
const EXCLUS = new Set(["node_modules", ".git", "captures"]);
function fichiers(dir = "") {
  const out = [];
  for (const e of fs.readdirSync(path.join(R, dir), { withFileTypes: true })) {
    if (EXCLUS.has(e.name)) continue;
    const rel = dir ? `${dir}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...fichiers(rel));
    else if (/\.(html|js|mjs|css|md|json|yml)$/.test(e.name) && e.name !== "package-lock.json") out.push(rel);
  }
  return out;
}
const tous = fichiers();
const html = tous.filter((f) => f.endsWith(".html"));
const scriptsSite = tous.filter((f) => /^assets\/.+\.js$/.test(f) && f !== "assets/recherche.js");
const ligne = (txt, i) => txt.slice(0, i).split("\n").length;

// 1. Moteurs de l'atelier : pas de modification sans autorisation écrite dans le plan.
const MOTEURS = ["assets/atelier-regles.js", "assets/atelier-pannes-regles.js"];
const git = (...a) => spawnSync("git", a, { cwd: R, encoding: "utf8" });
const base = ["origin/main", "main"].map((b) => git("merge-base", "HEAD", b)).find((r) => r.status === 0)?.stdout.trim();
if (!base) avertissements.push("moteurs non contrôlés : branche main introuvable (clone superficiel ?)");
else {
  const modifies = git("diff", "--name-only", base, "--", ...MOTEURS).stdout.split("\n").filter(Boolean);
  const plan = lire("docs/PLAN.md");
  for (const f of modifies) {
    if (!plan.includes(`Moteur autorisé : ${f}`))
      pb(f, `moteur modifié depuis main sans la ligne « Moteur autorisé : ${f} » écrite par Marvin dans docs/PLAN.md — annuler (git checkout ${base.slice(0, 7)} -- ${f}) ou poser la question à Marvin`);
  }
}

// 2. Index de recherche à jour.
const idx = spawnSync(process.execPath, ["outils/index-recherche.mjs", "--verifier"], { cwd: R, encoding: "utf8" });
if (idx.status !== 0) pb("assets/recherche.js", "index pas à jour ou généré à la main — lancer npm run index");

// 3. Ressources externes : seulement Google Fonts (la police fait partie de la DA et ne doit pas disparaître).
const HOTES_OK = /^https:\/\/fonts\.(googleapis|gstatic)\.com(\/|$)/;
for (const f of html) {
  const t = lire(f);
  for (const m of t.matchAll(/<(script|link|img|iframe|source|video|audio|embed)\b[^>]*?\b(src|href)\s*=\s*["']((?:https?:)?\/\/[^"']+)/gi))
    if (!HOTES_OK.test(m[3])) pb(f, `ligne ${ligne(t, m.index)} : ressource externe interdite ${m[3]} (seul Google Fonts est permis)`);
  if (!f.startsWith("docs/procedures") && !/fonts\.googleapis\.com\/css2/.test(t)) pb(f, "lien Google Fonts absent (fait partie de la DA, ne pas le retirer)");
}
for (const f of tous.filter((f) => f.endsWith(".css"))) {
  const t = lire(f);
  for (const m of t.matchAll(/(?:@import\s+(?:url\()?|url\()\s*["']?((?:https?:)?\/\/[^"')\s]+)/gi))
    if (!HOTES_OK.test(m[1])) pb(f, `ligne ${ligne(t, m.index)} : ressource externe interdite ${m[1]}`);
}

// 4. Scripts du site : pas d'alert/confirm/prompt, pas de fetch (doit marcher en file://), localStorage préfixé « it. ».
for (const f of scriptsSite) {
  const t = lire(f);
  for (const m of t.matchAll(/(?<![\w.$])(?:window\.)?(alert|confirm|prompt|fetch)\s*\(/g))
    pb(f, `ligne ${ligne(t, m.index)} : ${m[1]}() interdit (AGENTS.md : pas d'alert/confirm, pas de fetch de fichiers locaux)`);
  for (const m of t.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(\s*["'`]([^"'`]+)/g))
    if (!m[1].startsWith("it.")) pb(f, `ligne ${ligne(t, m.index)} : clé localStorage « ${m[1]} » sans le préfixe it.`);
}

// 5. Dépôt public : pas d'IP publique réelle, pas d'adresse e-mail réelle, pas de secret.
const ipOk = (ip) => {
  const [a, b, c, d] = ip.split(".").map(Number);
  if ([a, b, c, d].some((n) => n > 255)) return true; // pas une IP (numéro de version, etc.)
  return a === 10 || a === 127 || a === 0 || a === 255 || a >= 224 ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 192 && b === 0 && c === 2) || (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113) ||
    ["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1", "9.9.9.9"].includes(ip);
};
const mailOk = (m) => /@(.+\.)?(local|example|test|invalid|localhost)$|@(.+\.)?example\.(org|com|net)$|@anthropic\.com$|@users\.noreply\.github\.com$/i.test(m);
const SECRETS = [/ghp_[A-Za-z0-9]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /\bsk-[A-Za-z0-9_-]{20,}/, /\bAKIA[0-9A-Z]{16}\b/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
for (const f of tous) {
  if (f === "outils/garde.mjs") continue;
  const t = lire(f);
  for (const m of t.matchAll(/(?<![\d.])(\d{1,3}(?:\.\d{1,3}){3})(?![\d.]*\d)/g))
    if (!ipOk(m[1])) pb(f, `ligne ${ligne(t, m.index)} : adresse IP publique ${m[1]} — utiliser une plage privée (192.168.x.x, 10.x) ou de documentation (192.0.2.x, RFC 5737)`);
  for (const m of t.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g))
    if (!mailOk(m[0]) && !/^[\w-]+@\d/.test(m[0]) && !/\.(css|js|png|svg)$/.test(m[0])) pb(f, `ligne ${ligne(t, m.index)} : adresse e-mail ${m[0]} — utiliser un domaine fictif (.local, example.org)`);
  for (const re of SECRETS) { const m = re.exec(t); if (m) pb(f, `ligne ${ligne(t, m.index)} : ressemble à un secret — le retirer et le révoquer`); }
}

for (const a of avertissements) console.log(`Avertissement : ${a}`);
if (problemes.length) {
  console.log(`Garde-fous : ${problemes.length} problème(s)`);
  for (const p of problemes) console.log(`  - ${p}`);
  process.exit(1);
}
console.log(`Garde-fous : 0 problème (${tous.length} fichiers, ${html.length} pages)`);
