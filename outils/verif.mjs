// Audit automatique des pages (hors site publié) : node outils/verif.mjs [options]
//   --largeurs=390,1280   largeurs à tester (défaut : 390,768,1280,1440)
//   --themes=light,dark   thèmes (défaut : light,dark)
//   --pages=index.html,stage/j1.html   pages précises (défaut : toutes)
//   --captures=dossier    enregistre une capture pleine page par combinaison
//   --file                ouvre en file:// au lieu du serveur local
// Contrôles : erreurs et avertissements console, erreurs JS, débordement horizontal,
// liens internes et ancres morts, cibles tactiles < 44 px (avertissement).
import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const LARGEURS = (args.largeurs || "390,768,1280,1440").split(",").map(Number);
const THEMES = (args.themes || "light,dark").split(",");
const CAPTURES = args.captures ? path.resolve(args.captures) : null;
const IGNORER = ["outils", "node_modules", ".git"];

function toutesLesPages(dir = RACINE) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (IGNORER.includes(e.name)) return [];
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return toutesLesPages(p);
    return e.name.endsWith(".html") ? [path.relative(RACINE, p).split(path.sep).join("/")] : [];
  });
}
const PAGES = args.pages ? args.pages.split(",") : toutesLesPages().sort();

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".json": "application/json" };
function serveur() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let f = path.join(RACINE, u);
      if (f.endsWith("/")) f += "index.html";
      if (!f.startsWith(RACINE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        const p404 = path.join(RACINE, "404.html");
        res.writeHead(404, { "content-type": TYPES[".html"] });
        return res.end(fs.existsSync(p404) ? fs.readFileSync(p404) : "404");
      }
      res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
      res.end(fs.readFileSync(f));
    }).listen(0, () => ok(s));
  });
}

const problemes = [];
const avertissements = [];
function note(liste, page, combi, msg) { liste.push(`${page} [${combi}] ${msg}`); }

const srv = args.file ? null : await serveur();
const base = args.file ? "file://" + RACINE + "/" : `http://localhost:${srv.address().port}/`;
const navigateur = await chromium.launch();
const ancresVues = new Map(); // page -> Set(id)
const liensVus = new Set();

for (const theme of THEMES) {
  for (const largeur of LARGEURS) {
    const ctx = await navigateur.newContext({ viewport: { width: largeur, height: 900 }, colorScheme: theme === "dark" ? "dark" : "light" });
    await ctx.addInitScript((t) => { try { localStorage.setItem("it.theme", t); } catch (e) {} }, theme);
    for (const page of PAGES) {
      const combi = `${largeur}px ${theme}`;
      const p = await ctx.newPage();
      p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") note(problemes, page, combi, `console ${m.type()} : ${m.text()}`); });
      p.on("pageerror", (e) => note(problemes, page, combi, `erreur JS : ${e.message}`));
      p.on("requestfailed", (r) => { const u = r.url(); if (!/fonts\.(googleapis|gstatic)/.test(u)) note(problemes, page, combi, `ressource introuvable : ${u}`); });
      p.on("response", (r) => { if (r.status() >= 400 && !/fonts\.(googleapis|gstatic)|favicon/.test(r.url())) note(problemes, page, combi, `HTTP ${r.status()} : ${r.url()}`); });
      await p.goto(base + page, { waitUntil: "load" });
      await p.waitForTimeout(150);
      const r = await p.evaluate(() => {
        const de = document.documentElement;
        const deborde = de.scrollWidth > window.innerWidth + 1;
        const fautifs = [];
        if (deborde) {
          document.querySelectorAll("body *").forEach((n) => {
            const b = n.getBoundingClientRect();
            if (b.right > window.innerWidth + 1 && b.width > 0 && getComputedStyle(n).position !== "fixed") {
              let anc = n.parentElement, cache = false;
              while (anc && anc !== document.body) { const o = getComputedStyle(anc).overflowX; if (o === "auto" || o === "scroll" || o === "hidden") { cache = true; break; } anc = anc.parentElement; }
              if (!cache) fautifs.push(n.tagName.toLowerCase() + (n.className && typeof n.className === "string" ? "." + n.className.split(" ").join(".") : ""));
            }
          });
        }
        const petites = [];
        document.querySelectorAll("a[href], button, input, select, summary, [tabindex]:not([tabindex='-1'])").forEach((n) => {
          const b = n.getBoundingClientRect(), cs = getComputedStyle(n);
          if (!b.width || cs.visibility === "hidden") return;
          // Lien dans une phrase : exempté (WCAG 2.5.8, exception « en ligne »), sinon toute la mise en page saute.
          const enLigne = n.tagName === "A" && cs.display === "inline" && n.closest("p, li, td, dd, figcaption, blockquote");
          if (enLigne) return;
          const label = (n.type === "radio" || n.type === "checkbox") && n.labels && n.labels[0];
          const cible = label ? label.getBoundingClientRect() : b;
          if (cible.height < 43.5 || cible.width < 43.5) petites.push((n.textContent || n.getAttribute("aria-label") || n.tagName).trim().slice(0, 30) + ` (${Math.round(cible.width)}×${Math.round(cible.height)})`);
        });
        const ids = [...document.querySelectorAll("[id]")].map((n) => n.id);
        const doublons = ids.filter((v, i) => ids.indexOf(v) !== i);
        const liens = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
        const h = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((n) => +n.tagName[1]);
        const sauts = h.filter((v, i) => i > 0 && v > h[i - 1] + 1).length;
        return { deborde, fautifs: [...new Set(fautifs)].slice(0, 6), petites: [...new Set(petites)].slice(0, 8), ids, doublons, liens, nbH1: h.filter((v) => v === 1).length, sauts };
      });
      if (r.deborde) note(problemes, page, combi, `débordement horizontal : ${r.fautifs.join(", ") || "?"}`);
      if (r.doublons.length) note(problemes, page, combi, `id en double : ${[...new Set(r.doublons)].join(", ")}`);
      if (r.nbH1 !== 1) note(problemes, page, combi, `${r.nbH1} h1`);
      if (r.sauts) note(avertissements, page, combi, `${r.sauts} saut(s) de niveau de titre`);
      if (r.petites.length) note(avertissements, page, combi, `cibles < 44 px : ${r.petites.join(" ; ")}`);
      if (!ancresVues.has(page)) ancresVues.set(page, new Set(r.ids));
      r.liens.forEach((h) => liensVus.add(page + "\u0000" + h));
      if (CAPTURES) {
        fs.mkdirSync(CAPTURES, { recursive: true });
        await p.screenshot({ path: path.join(CAPTURES, `${page.replace(/\//g, "_").replace(/\.html$/, "")}-${largeur}-${theme}.png`), fullPage: true });
      }
      await p.close();
    }
    await ctx.close();
  }
}

// Liens internes et ancres (les ancres des pages non chargées sont lues dans le HTML statique)
function idsStatiques(fichier) {
  if (ancresVues.has(fichier)) return ancresVues.get(fichier);
  const f = path.join(RACINE, fichier);
  if (!fs.existsSync(f)) return null;
  return new Set([...fs.readFileSync(f, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}
for (const cle of liensVus) {
  const [page, href] = cle.split("\u0000");
  if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) continue;
  const [chemin, ancre] = href.split("#");
  const cible = chemin ? path.posix.normalize(path.posix.join(path.posix.dirname(page), chemin.split("?")[0])) : page;
  const fichier = cible.endsWith("/") ? cible + "index.html" : cible;
  if (!fs.existsSync(path.join(RACINE, fichier))) { note(problemes, page, "lien", `lien mort : ${href}`); continue; }
  if (ancre && fichier.endsWith(".html")) {
    const ids = idsStatiques(fichier);
    if (ids && !ids.has(ancre)) note(problemes, page, "lien", `ancre morte : ${href}`);
  }
}

// Index de recherche : chaque lien doit mener à une page et une ancre existantes
{
  const ctxR = { window: {} };
  (await import("node:vm")).runInNewContext(fs.readFileSync(path.join(RACINE, "assets/recherche.js"), "utf8"), ctxR);
  for (const e of ctxR.window.IT_RECHERCHE || []) {
    const [chemin, ancre] = e.u.split("#");
    const fichier = chemin.split("?")[0];
    if (!fs.existsSync(path.join(RACINE, fichier))) { note(problemes, "assets/recherche.js", "index", `page introuvable : ${e.u}`); continue; }
    /* Pages de l'atelier construites en JavaScript : leurs ancres sont vérifiées dans le navigateur par outils/parcours.mjs. */
    if (ancre && /^atelier\/(composants|missions)\.html$/.test(fichier)) continue;
    if (ancre && !idsStatiques(fichier).has(ancre)) note(problemes, "assets/recherche.js", "index", `ancre morte : ${e.u}`);
  }
}

await navigateur.close();
srv?.close();
console.log(`${PAGES.length} pages × ${LARGEURS.length} largeurs × ${THEMES.length} thèmes (${args.file ? "file://" : "serveur"})`);
console.log(`Problèmes : ${problemes.length}`); problemes.forEach((m) => console.log("  ✗ " + m));
console.log(`Avertissements : ${avertissements.length}`); avertissements.slice(0, args.tout ? 9999 : 40).forEach((m) => console.log("  · " + m));
process.exit(problemes.length || avertissements.length ? 1 : 0);
