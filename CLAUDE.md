# Instructions Claude — Centre d'apprentissage IT

Contexte technique du repo, à relire avant toute intervention sur ce projet
(évite de redécouvrir le style CSS, l'arborescence et la logique à chaque fois).

## Stack

100 % HTML/CSS/JS statique, **aucune dépendance** ni build. `index.html` s'ouvre directement.

```powershell
# Serveur local optionnel pendant l'édition
python -m http.server 8080
```

## Structure

```
perso/
├── index.html                  Portail : héro + grille de modules + ressources + méthode
├── README.md                   Intro publique (visiteurs GitHub)
├── CLAUDE.md                   Ce fichier
├── assets/
│   ├── theme.css               Design system partagé (TOUT le style est ici)
│   ├── app.js                  Barre de progression + sommaire actif (partagé)
│   ├── search-index.js         Index de recherche full-text (généré, cf. section Recherche)
│   └── search.js                Logique de la barre de recherche du portail
└── modules/
    ├── proxmox.html            Proxmox VE : VM/LXC, ZFS, snapshots/backup, réseau, cluster, HA
    ├── windows-server.html     AD, SYSPREP, DNS/DHCP, DFS, sécurité, Core
    ├── powershell.html         Labo VM Hyper-V, AD, serveur de fichiers, GMSA
    ├── ccna-reseau.html        CCNA : OSI, VLAN, routage, VLSM, NAT, ACL
    ├── subnetting.html         Réseau & subnetting : binaire, CIDR, VLSM, exercices
    ├── securite.html           Cybersécurité / hacking éthique : Kali, pentest, hardening
    ├── homelab.html            Homelab & self-hosting : Docker, reverse proxy, Pi-hole, backup
    ├── exchange-securite.html  Exchange 2019 + PKI + crypto asymétrique + AD CS
    ├── rds.html                Bureau à distance (RDSH/RDCB/RDWA, RemoteApp)
    ├── linux-debian.html       Debian : terminal, permissions, redirections, grep/sed/awk, réseau, APT, SSH, systemd (22 chapitres)
    ├── sharepoint.html         SharePoint Server SE (théorie + pratique, guide complet)
    └── _template.html          Gabarit de démarrage pour un nouveau module
```

Le fil rouge des labos Microsoft reste l'environnement **`orion.local`**
(domaine + plans d'adressage IP), reproductible en VM chez soi.

## Ajouter un module (≈ 2 min)

1. **Copier le gabarit**
   ```powershell
   Copy-Item modules/_template.html modules/mon-module.html
   ```
2. **Choisir une couleur** via l'attribut `data-domain` sur `<body>` :
   `server` (bleu) · `ps` (violet) · `exch` (cyan) · `rds` (ambre) · `sp` (vert) ·
   `net` (bleu ciel) · `linux` (rouge Debian) · `px` (orange Proxmox) ·
   `sub` (indigo) · `sec` (rouge sécurité) · `lab` (teal homelab).
   Pour une nouvelle couleur, ajoute une ligne `body[data-domain="xxx"] { --accent:…; }` dans `assets/theme.css`.
3. **Remplir** le héro, le sommaire (`.toc`) et les chapitres (`<section class="chapter">`).
   Chaque chapitre a un `id` qui doit correspondre au lien du sommaire.
4. **Référencer** le module : ajouter une carte dans `index.html`, juste avant la carte
   « Ajouter un module » :
   ```html
   <a class="mod" data-c="px" href="modules/mon-module.html">
       <div class="mod__top">
           <div class="mod__icon">PVE</div>
           <span class="mod__status">5 chapitres</span>
       </div>
       <div class="mod__title">Mon nouveau module</div>
       <p class="mod__desc">Une phrase de description.</p>
       <div class="mod__tags"><span class="tg">tag</span></div>
       <div class="mod__go">Ouvrir le module →</div>
   </a>
   ```

## Composants disponibles (classes CSS)

| Composant | Classe | Usage |
|---|---|---|
| Bloc terminal | `.terminal` + `.terminal__code` | Code / commandes (coloration via `.c .k .p .s`) |
| Encadré « À retenir » | `.takeaway` (`--warn` pour alerte) | Point clé à mémoriser |
| Astuce | `.tip` | Bonne pratique / piège |
| Étapes numérotées | `.steps` / `.step` | Procédure pas à pas |
| Cartes 2 colonnes | `.cards` / `.card` | Comparaison A vs B |
| Tableau | `.table-wrap` + `<table>` | Données structurées |
| Plan réseau | `.net` / `.node` | Topologie (nom · IP · rôle) |
| Frise | `.timeline` | Historique / évolution |
| Ressources externes | `.resources` / `.res` | Cartes de liens (chaînes, sites) |

Coloration du code dans `.terminal__code` :
`<span class="c">` commentaire · `<span class="k">` cmdlet/mot-clé · `<span class="p">` paramètre · `<span class="s">` chaîne.

## Notes de style

- Les notes brutes (cours, scripts, exercices) ne sont **plus versionnées sur ce dépôt public** —
  elles vivent uniquement dans la copie locale `ancien centre apprentissage/notes-personnelles/`
  (backup hors Git). Les modules dans `modules/` en sont la **synthèse pédagogique**, réécrite
  dans le gabarit du portail (pas de copier-coller de mise en page externe).
- Pour porter un contenu externe en thème sombre (ex. ancien guide Linux) : réécrire en variables
  CSS du thème portail (`--ink`, `--border`, `--accent`, `--font-mono`, etc.), pas de couleurs
  codées en dur.

## Recherche full-text

`assets/search-index.js` est généré à partir des chapitres de tous les modules (titre + texte
brut de chaque `<section class="chapter" id="...">`). À régénérer après toute modification de
contenu de module, via le script PowerShell de génération (extraction regex des sections,
strip HTML, échappement JS) — redemander ce script si besoin plutôt que de le réécrire à la main.
