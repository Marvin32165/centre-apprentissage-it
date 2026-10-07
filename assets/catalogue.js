/* Catalogue du site publié : parcours, prérequis et liens entre modules.
   Généré par site/outils/publie.js — ne pas éditer à la main. */
window.CATALOGUE = {
  "parcours": [
    {
      "id": "fondations",
      "num": "01",
      "title": "Fondations",
      "exam": "fondations",
      "desc": "Le réseau d'abord — des trames aux pages web —, un plan d'adressage qui tient debout, un labo à soi, un terminal maîtrisé et une méthode de dépannage. Le socle de tout le reste.",
      "modules": [
        "reseau-bases",
        "subnetting",
        "hyperv",
        "linux-debian",
        "depannage-reseau"
      ]
    },
    {
      "id": "windows",
      "num": "02",
      "title": "Infrastructure Windows",
      "exam": "windows",
      "desc": "De l'annuaire Active Directory aux services qui s'appuient dessus : fichiers, sessions, web, messagerie, bases et intranet — et leur sauvegarde.",
      "modules": [
        "windows-server",
        "powershell",
        "storage-clustering",
        "rds",
        "iis",
        "exchange-securite",
        "sql-server",
        "sharepoint",
        "dpm"
      ]
    },
    {
      "id": "reseau",
      "num": "03",
      "title": "Réseau & téléphonie",
      "exam": "reseau",
      "desc": "Après le subnetting : configurer de vrais équipements Cisco, les sécuriser, puis faire passer la voix sur ce réseau.",
      "modules": [
        "ccna-reseau",
        "cisco-securite",
        "voip"
      ]
    },
    {
      "id": "virtualisation",
      "num": "04",
      "title": "Virtualisation, homelab & sécurité",
      "exam": "virtualisation",
      "desc": "Le prolongement personnel : son propre hyperviseur, ses conteneurs, ses services, et de quoi les défendre.",
      "modules": [
        "proxmox",
        "docker",
        "homelab",
        "securite"
      ]
    },
    {
      "id": "cloud",
      "num": "05",
      "title": "Cloud, supervision & méthode",
      "exam": "cloud",
      "desc": "Ce qui vient après l'infrastructure : la surveiller, la porter dans le cloud, organiser le travail autour d'elle — et décrocher le poste qui va avec.",
      "modules": [
        "monitoring-zabbix",
        "zabbix-windows",
        "azure",
        "scrum",
        "redmine",
        "entretien-recrutement"
      ]
    }
  ],
  "modules": {
    "reseau-bases": {
      "title": "Réseau : les bases",
      "short": "Réseau",
      "icon": "IP",
      "desc": "Le point d'entrée : équipements, OSI et TCP/IP, Ethernet et MAC, IPv4, ARP, TCP/UDP et ports, DNS, DHCP, routage et NAT, IPv6, VLAN et Wi-Fi — chaque notion avec la commande qui la rend visible, et une requête web suivie dans Wireshark.",
      "level": 1,
      "duree": "5 h",
      "chapters": 12,
      "prereq": [],
      "related": [
        "subnetting",
        "depannage-reseau",
        "ccna-reseau"
      ]
    },
    "hyperv": {
      "title": "Hyper-V & labo virtuel",
      "short": "Hyper-V",
      "icon": "HV",
      "desc": "Créer et régler des VM Windows Server, configurer le serveur au premier démarrage, fabriquer une image Sysprep, déployer en série par disques de différenciation, choisir son commutateur virtuel, et se servir des points de contrôle sans les prendre pour des sauvegardes.",
      "level": 1,
      "duree": "2 h",
      "chapters": 8,
      "prereq": [],
      "related": [
        "proxmox",
        "windows-server"
      ]
    },
    "linux-debian": {
      "title": "Linux Debian",
      "short": "Linux Debian",
      "icon": "LX",
      "desc": "Du premier login root à l'administration d'un serveur : fichiers, permissions et lecture de ls -l, redirections et filtres texte, réseau et SSH, APT, processus et systemd, disques et fstab, RAID logiciel, LVM, sauvegardes tar/rsync/cron — avec les pièges réellement rencontrés en TP.",
      "level": 1,
      "duree": "6 h",
      "chapters": 25,
      "prereq": [],
      "related": [
        "docker",
        "proxmox",
        "monitoring-zabbix",
        "securite"
      ]
    },
    "subnetting": {
      "title": "Réseau & Subnetting",
      "short": "Subnetting",
      "icon": "/24",
      "desc": "Le module qui fait enfin « cliquer » les sous-réseaux : binaire, masques, CIDR, VLSM pas à pas, calcul mental, masques génériques, découpage IPv6 — et des générateurs d'exercices illimités qui corrigent en expliquant.",
      "level": 1,
      "duree": "2 h 30",
      "chapters": 10,
      "prereq": [
        "reseau-bases"
      ],
      "related": [
        "ccna-reseau",
        "cisco-securite",
        "azure"
      ]
    },
    "depannage-reseau": {
      "title": "Dépannage réseau",
      "short": "Dépannage",
      "icon": "?!",
      "desc": "La méthode par couches, les commandes de diagnostic Windows, Linux et Cisco, la lecture de captures, les signatures d'une douzaine de pannes classiques et six scénarios de panne interactifs.",
      "level": 2,
      "duree": "3 h",
      "chapters": 8,
      "prereq": [
        "reseau-bases",
        "subnetting"
      ],
      "utile": [
        "linux-debian"
      ],
      "related": [
        "ccna-reseau",
        "cisco-securite",
        "monitoring-zabbix",
        "redmine"
      ]
    },
    "windows-server": {
      "title": "Windows Server 2025",
      "short": "Windows Server",
      "icon": "WS",
      "desc": "Le domaine orion.local brique par brique : préparation des serveurs, forêt AD, second DC par IFM, OU, groupes et délégation, DNS, DHCP autorisé, partages et NTFS, DFS Namespace, GPO, sécurité des comptes et LAPS, dépannage d'AD, et le TP final guidé avec son erreur volontaire.",
      "level": 2,
      "duree": "6 h",
      "chapters": 13,
      "prereq": [
        "hyperv"
      ],
      "utile": [
        "reseau-bases"
      ],
      "related": [
        "powershell",
        "azure"
      ]
    },
    "powershell": {
      "title": "PowerShell & Automatisation",
      "short": "PowerShell",
      "icon": "PS",
      "desc": "Le langage à partir des exercices du cours — variables et types, conditions, boucles, tableaux et objets, pipeline, fonctions et erreurs — puis le lab Orion en script, les comptes AD depuis un CSV, l'administration à distance et les projets du cours corrigés.",
      "level": 2,
      "duree": "5 h",
      "chapters": 10,
      "prereq": [
        "hyperv",
        "windows-server"
      ],
      "related": [
        "sql-server",
        "iis"
      ]
    },
    "storage-clustering": {
      "title": "Stockage & Clustering",
      "short": "Stockage & clustering",
      "icon": "SAN",
      "desc": "DAS/NAS/SAN, RAID et pools de stockage, permissions NTFS et droits effectifs, partages, quotas FSRM, DFS et sauvegardes — puis le montage complet d'un SAN iSCSI et d'un cluster de basculement à deux nœuds avec rôle Serveur de fichiers.",
      "level": 2,
      "duree": "3 h",
      "chapters": 12,
      "prereq": [
        "windows-server"
      ],
      "related": [
        "sql-server",
        "proxmox"
      ]
    },
    "rds": {
      "title": "Bureau à distance (RDS)",
      "short": "RDS",
      "icon": "RDS",
      "desc": "Les rôles RDS, un déploiement session-based sur le lab Orion (Server Manager ou PowerShell), collections et RemoteApp, licences et période de grâce, certificat créé, affecté et approuvé, et la passerelle pour l'accès externe.",
      "level": 2,
      "duree": "2 h 30",
      "chapters": 7,
      "prereq": [
        "windows-server"
      ],
      "related": [
        "iis",
        "exchange-securite"
      ]
    },
    "iis": {
      "title": "IIS — Serveur web Windows",
      "short": "IIS",
      "icon": "IIS",
      "desc": "Publier des sites depuis un Windows Server du domaine : rôle Web Server, console IIS Manager, pools d'applications, bindings et noms d'hôte, alias CNAME dans le DNS, déploiement de deux sites et service FTP.",
      "level": 2,
      "duree": "2 h",
      "chapters": 9,
      "prereq": [
        "windows-server",
        "powershell"
      ],
      "related": [
        "rds",
        "exchange-securite",
        "homelab"
      ]
    },
    "exchange-securite": {
      "title": "Exchange & PKI",
      "short": "Exchange & PKI",
      "icon": "EX",
      "desc": "Messagerie Exchange 2019, gestion des boîtes aux lettres, PKI et chaîne de confiance, chiffrement asymétrique, certificats et AD CS.",
      "level": 3,
      "duree": "1 h 30",
      "chapters": 7,
      "prereq": [
        "windows-server"
      ],
      "related": [
        "iis",
        "securite"
      ]
    },
    "sql-server": {
      "title": "SQL Server",
      "short": "SQL Server",
      "icon": "SQL",
      "desc": "Administrer une instance SQL Server : installation, compte de service géré, réseau et pare-feu, mémoire et tempdb, création et dimensionnement des bases, sauvegarde et restauration, droits au moindre privilège, maintenance et Agent, diagnostic des blocages, supervision, cluster et Always On.",
      "level": 2,
      "duree": "4 h",
      "chapters": 15,
      "prereq": [
        "windows-server",
        "storage-clustering"
      ],
      "related": [
        "sharepoint",
        "powershell"
      ]
    },
    "sharepoint": {
      "title": "SharePoint Server SE",
      "short": "SharePoint",
      "icon": "SP",
      "desc": "Le guide complet : théorie (Server vs Online, licences, architecture physique et logique) et pratique (SQL Server, installation, ferme, premier site, droits, workflows, PowerShell, sauvegarde).",
      "level": 3,
      "duree": "4 h",
      "chapters": 19,
      "prereq": [
        "windows-server",
        "sql-server"
      ],
      "related": [
        "iis"
      ]
    },
    "dpm": {
      "title": "System Center DPM",
      "short": "DPM",
      "icon": "DPM",
      "desc": "La sauvegarde de la suite System Center : base sur un SQL Server distant sous gMSA, pool de stockage, agents, groupe de protection — synchronisation ou point de récupération —, restauration, et le diagnostic de l'erreur 811 jusqu'au certificat refusé.",
      "level": 3,
      "duree": "2 h 30",
      "chapters": 9,
      "prereq": [
        "windows-server",
        "sql-server"
      ],
      "utile": [
        "powershell"
      ],
      "related": [
        "zabbix-windows",
        "redmine",
        "exchange-securite"
      ]
    },
    "ccna-reseau": {
      "title": "CCNA — Réseau Cisco",
      "short": "CCNA",
      "icon": "NET",
      "desc": "La topologie d'entreprise du cours, brique par brique : IOS et SSH, VLAN et trunks, inter-VLAN, DHCP et relais, VLSM, routes statiques et flottantes, OSPF, spanning tree et EtherChannel, HSRP, NAT, ACL, NTP/Syslog, IPv6 — chaque étape prouvée par sa commande show.",
      "level": 2,
      "duree": "8 h",
      "chapters": 15,
      "prereq": [
        "reseau-bases",
        "subnetting"
      ],
      "utile": [
        "depannage-reseau"
      ],
      "related": [
        "cisco-securite",
        "voip"
      ]
    },
    "cisco-securite": {
      "title": "Cisco IOS — Sécurité, VLAN, STP & ACL",
      "short": "Cisco sécurité",
      "icon": "ACL",
      "desc": "IOS, sécurisation de base, SSH et port-security, VLAN et trunk, inter-VLAN, spanning tree avec PortFast et BPDU Guard, ACL et leur dépannage (ping, traceroute, compteurs), DHCP snooping et DAI, les TP du cours en labs guidés et les commandes à taper par cœur.",
      "level": 2,
      "duree": "5 h 30",
      "chapters": 11,
      "prereq": [
        "subnetting"
      ],
      "utile": [
        "ccna-reseau"
      ],
      "related": [
        "securite",
        "voip"
      ]
    },
    "voip": {
      "title": "Téléphonie IP (VoIP / ToIP)",
      "short": "VoIP",
      "icon": "SIP",
      "desc": "VoIP et ToIP, PoE et QoS, la voix en chiffres (délai, gigue, débit par codec), SIP, RTP et RTCP, VLAN voix, codecs et architecture d'un standard, dépannage d'un appel dans Wireshark, PBX 3CX en labo et checklist de déploiement.",
      "level": 1,
      "duree": "3 h",
      "chapters": 11,
      "prereq": [
        "reseau-bases"
      ],
      "utile": [
        "ccna-reseau"
      ],
      "related": [
        "cisco-securite"
      ]
    },
    "proxmox": {
      "title": "Proxmox & Virtualisation",
      "short": "Proxmox",
      "icon": "PVE",
      "desc": "Le cœur du métier : Proxmox VE, VM (KVM) vs conteneurs LXC, stockage ZFS, snapshots &amp; backups, réseau (bridges/VLAN), cluster et haute disponibilité.",
      "level": 2,
      "duree": "2 h 30",
      "chapters": 10,
      "prereq": [],
      "utile": [
        "linux-debian"
      ],
      "related": [
        "hyperv",
        "storage-clustering"
      ]
    },
    "docker": {
      "title": "Docker & conteneurs",
      "short": "Docker",
      "icon": "DK",
      "desc": "Conteneur ou VM, images et registre, installation propre de docker-ce, cycle de vie des conteneurs, Dockerfile, volumes persistants, réseau bridge et mappage de ports, puis une application entière décrite avec Docker Compose.",
      "level": 2,
      "duree": "3 h",
      "chapters": 9,
      "prereq": [
        "linux-debian"
      ],
      "related": [
        "proxmox",
        "iis"
      ]
    },
    "homelab": {
      "title": "Homelab & Self-hosting",
      "short": "Homelab",
      "icon": "LAB",
      "desc": "Monter son labo maison et héberger ses propres services : Docker &amp; Compose, reverse proxy, DNS local (Pi-hole), *arr / médias, sauvegardes et accès distant sécurisé.",
      "level": 1,
      "duree": "1 h 30",
      "chapters": 9,
      "prereq": [
        "linux-debian"
      ],
      "utile": [
        "proxmox",
        "docker"
      ],
      "related": [
        "securite"
      ]
    },
    "securite": {
      "title": "Cybersécurité",
      "short": "Cybersécurité",
      "icon": "SEC",
      "desc": "Fondamentaux offensifs et défensifs, en labo isolé : Kali, méthodologie de pentest, reconnaissance, hardening, pare-feu, VPN et hygiène numérique. Usage éthique.",
      "level": 1,
      "duree": "1 h 30",
      "chapters": 8,
      "prereq": [
        "linux-debian",
        "subnetting"
      ],
      "related": [
        "cisco-securite",
        "exchange-securite"
      ]
    },
    "monitoring-zabbix": {
      "title": "Supervision — Zabbix",
      "short": "Zabbix",
      "icon": "ZBX",
      "desc": "Monter un serveur Zabbix de zéro sur Ubuntu (MySQL, Nginx), y raccorder un Windows Server par agent, lire ce qui remonte — puis laisser Zabbix redémarrer seul les services arrêtés et nettoyer les fichiers temporaires.",
      "level": 2,
      "duree": "3 h",
      "chapters": 10,
      "prereq": [
        "linux-debian",
        "hyperv",
        "windows-server"
      ],
      "related": [
        "azure"
      ]
    },
    "zabbix-windows": {
      "title": "Zabbix & serveurs Windows",
      "short": "Zabbix & Windows",
      "icon": "ZBW",
      "desc": "Zabbix à la place de SCOM : la pile en Docker Compose, des agents Windows en vérifications actives chiffrées par PSK, l'agent du serveur en conteneur, puis des modèles maison pour l'heure du domaine et l'expiration des certificats.",
      "level": 2,
      "duree": "2 h 30",
      "chapters": 8,
      "prereq": [
        "monitoring-zabbix",
        "docker"
      ],
      "utile": [
        "windows-server"
      ],
      "related": [
        "dpm",
        "redmine"
      ]
    },
    "azure": {
      "title": "Azure — AZ-900",
      "short": "Azure",
      "icon": "AZ",
      "desc": "Les fondamentaux du cloud Microsoft, dans l'ordre de l'examen : concepts et CapEx/OpEx, IaaS/PaaS/SaaS et responsabilité partagée, régions et hiérarchie ARM, compute, réseau, stockage, Entra ID et RBAC, gouvernance, coûts et SLA, monitoring.",
      "level": 2,
      "duree": "4 h",
      "chapters": 12,
      "prereq": [
        "subnetting"
      ],
      "utile": [
        "windows-server"
      ],
      "related": [
        "monitoring-zabbix"
      ]
    },
    "scrum": {
      "title": "Agile & Scrum",
      "short": "Scrum",
      "icon": "AGL",
      "desc": "Le seul module qui parle de la façon de travailler : triangle d'or et Waterfall, Manifeste Agile, sprint et trois piliers, les quatre cérémonies, les trois rôles, backlogs, user stories et Definition of Done, puis Kanban.",
      "level": 1,
      "duree": "3 h",
      "chapters": 10,
      "prereq": [],
      "related": []
    },
    "redmine": {
      "title": "Redmine — helpdesk",
      "short": "Redmine",
      "icon": "RDM",
      "desc": "Redmine à la place de SCSM : un outil de tickets en Docker Compose, branché sur l'Active Directory en LDAP (et le piège de Windows Server 2025), puis rendu exploitable — secrets dans un .env, sauvegarde par cron, HTTPS derrière nginx.",
      "level": 2,
      "duree": "2 h 30",
      "chapters": 8,
      "prereq": [
        "docker"
      ],
      "utile": [
        "linux-debian",
        "windows-server"
      ],
      "related": [
        "zabbix-windows",
        "dpm",
        "scrum",
        "homelab"
      ]
    },
    "entretien-recrutement": {
      "title": "Entretien de recrutement",
      "short": "Entretien",
      "icon": "JOB",
      "desc": "Le module du jour J : se préparer, raconter son expérience avec la méthode STARR, reconnaître le type de question, tenir sa posture, conclure — et faire de son stress un allié, respiration à l'appui.",
      "level": 1,
      "duree": "1 h 30",
      "chapters": 9,
      "prereq": [],
      "related": [
        "scrum"
      ]
    }
  },
  "public": true
};
