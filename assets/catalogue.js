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
