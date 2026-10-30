// Généré par outils/generer.py depuis data/eurocorp.json — ne pas éditer à la main
window.EURO = {
 "meta": {
  "titre": "EUROCORP — Labo final",
  "groupe": 2,
  "domaine": "eurocorp.lan",
  "netbios": "EUROCORP",
  "reseau_salle": "10.10.28.0/24",
  "passerelle_salle": "10.10.28.254",
  "bloc_prive": "172.17.0.0/16",
  "maj": "2026-10-30"
 },
 "sites": [
  {
   "id": "BRU",
   "nom": "Bruxelles",
   "role": "Hub principal",
   "wan": "10.10.28.111",
   "lan": "172.17.10.0/24",
   "gw": "172.17.10.1",
   "hote": "10.10.28.219 (réseau de salle)"
  },
  {
   "id": "PAR",
   "nom": "Paris",
   "role": "Spoke",
   "wan": "10.10.28.112",
   "lan": "172.17.20.0/24",
   "gw": "172.17.20.1",
   "hote": "10.10.28.233 (réseau de salle)"
  },
  {
   "id": "LON",
   "nom": "Londres",
   "role": "Spoke",
   "wan": "10.10.28.113",
   "lan": "172.17.30.0/24",
   "gw": "172.17.30.1",
   "hote": "10.10.28.224 (réseau de salle)"
  },
  {
   "id": "BER",
   "nom": "Berlin",
   "role": "Spoke",
   "wan": "10.10.28.114",
   "lan": "172.17.40.0/24",
   "gw": "172.17.40.1",
   "hote": "10.10.28.201 (réseau de salle)"
  }
 ],
 "tunnels": [
  {
   "id": "BRU-PAR",
   "reseau": "172.17.20.0/24 ↔ autres LAN",
   "hub": "10.10.28.111",
   "spoke": "10.10.28.112"
  },
  {
   "id": "BRU-LON",
   "reseau": "172.17.30.0/24 ↔ autres LAN",
   "hub": "10.10.28.111",
   "spoke": "10.10.28.113"
  },
  {
   "id": "BRU-BER",
   "reseau": "172.17.40.0/24 ↔ autres LAN",
   "hub": "10.10.28.111",
   "spoke": "10.10.28.114"
  }
 ],
 "plages_lan": [
  {
   "plage": ".1",
   "usage": "Passerelle = OPNsense du site"
  },
  {
   "plage": ".2 – .9",
   "usage": "Équipements réseau (réserve)"
  },
  {
   "plage": ".10 – .49",
   "usage": "Serveurs, IP statiques"
  },
  {
   "plage": ".50 – .99",
   "usage": "Réserve + adresses virtuelles (VIP NLB…)"
  },
  {
   "plage": ".100 – .199",
   "usage": "Clients — pool DHCP"
  },
  {
   "plage": ".200 – .254",
   "usage": "Réserve"
  }
 ],
 "vms": [
  {
   "nom": "BRU-FW01",
   "site": "BRU",
   "role": "OPNsense — hub IPsec",
   "ip": "172.17.10.1",
   "os": "OPNsense",
   "vcpu": 4,
   "ram": 8,
   "disque": 20,
   "mem": "statique",
   "replica": "",
   "statut": "fait"
  },
  {
   "nom": "BRU-DC01",
   "site": "BRU",
   "role": "AD DS + DNS + DHCP (failover)",
   "ip": "172.17.10.10",
   "os": "Windows Server 2025",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "encours"
  },
  {
   "nom": "BRU-IIS01",
   "site": "BRU",
   "role": "IIS — nœud NLB 1",
   "ip": "172.17.10.21",
   "os": "Windows Server 2025",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "BRU-IIS02",
   "site": "BRU",
   "role": "IIS — nœud NLB 2",
   "ip": "172.17.10.22",
   "os": "Windows Server 2025",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "(VIP NLB)",
   "site": "BRU",
   "role": "Adresse virtuelle intranet.eurocorp.lan",
   "ip": "172.17.10.20",
   "os": "—",
   "vcpu": 0,
   "ram": 0,
   "disque": 0,
   "mem": "—",
   "replica": "",
   "statut": "afaire",
   "virtuel": true
  },
  {
   "nom": "BRU-EXCH01",
   "site": "BRU",
   "role": "Exchange Server SE",
   "ip": "172.17.10.30",
   "os": "Windows Server 2025",
   "vcpu": 4,
   "ram": 16,
   "disque": 200,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "BRU-DOCKER01",
   "site": "BRU",
   "role": "Docker — Zabbix (serveur + web + PostgreSQL)",
   "ip": "172.17.10.40",
   "os": "Ubuntu Server 24.04",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "BRU-CLT01",
   "site": "BRU",
   "role": "Client de test (optionnel)",
   "ip": "DHCP",
   "os": "Windows 11",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "PAR-FW01",
   "site": "PAR",
   "role": "OPNsense — spoke (VM actuelle : 2-PARIS-OPNSENSE)",
   "ip": "172.17.20.1",
   "os": "OPNsense",
   "vcpu": 2,
   "ram": 2,
   "disque": 20,
   "mem": "statique",
   "replica": "",
   "statut": "fait"
  },
  {
   "nom": "PAR-DC01",
   "site": "PAR",
   "role": "AD DS + DNS + DHCP (failover)",
   "ip": "172.17.20.10",
   "os": "Windows Server 2025",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "PAR-SQL01",
   "site": "PAR",
   "role": "SQL Server (base de SharePoint)",
   "ip": "172.17.20.20",
   "os": "Windows Server 2025",
   "vcpu": 4,
   "ram": 8,
   "disque": 100,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "PAR-SP01",
   "site": "PAR",
   "role": "SharePoint Server SE",
   "ip": "172.17.20.21",
   "os": "Windows Server 2025",
   "vcpu": 4,
   "ram": 12,
   "disque": 100,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "PAR-CLT01",
   "site": "PAR",
   "role": "Client de test (optionnel)",
   "ip": "DHCP",
   "os": "Windows 11",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "LON-FW01",
   "site": "LON",
   "role": "OPNsense — spoke",
   "ip": "172.17.30.1",
   "os": "OPNsense",
   "vcpu": 2,
   "ram": 4,
   "disque": 40,
   "mem": "statique",
   "replica": "",
   "statut": "fait"
  },
  {
   "nom": "LON-FS01",
   "site": "LON",
   "role": "File Server (Direction, RH, Finance, IT, Commun)",
   "ip": "172.17.30.10",
   "os": "Windows Server 2025",
   "vcpu": 2,
   "ram": 4,
   "disque": 160,
   "mem": "statique",
   "replica": "→ PAR (Hyper-V Replica)",
   "statut": "afaire"
  },
  {
   "nom": "LON-DOCKER01",
   "site": "LON",
   "role": "Docker — Redmine (+ MariaDB, nginx)",
   "ip": "172.17.30.40",
   "os": "Ubuntu Server 24.04",
   "vcpu": 2,
   "ram": 4,
   "disque": 40,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "LON-CLT01",
   "site": "LON",
   "role": "Client de test (optionnel)",
   "ip": "DHCP",
   "os": "Windows 11",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "BER-FW01",
   "site": "BER",
   "role": "OPNsense — spoke",
   "ip": "172.17.40.1",
   "os": "OPNsense",
   "vcpu": 2,
   "ram": 4,
   "disque": 40,
   "mem": "statique",
   "replica": "",
   "statut": "fait"
  },
  {
   "nom": "BER-DOCKER01",
   "site": "BER",
   "role": "Docker — pile Wazuh (indexer, manager, dashboard)",
   "ip": "172.17.40.40",
   "os": "Ubuntu Server 24.04",
   "vcpu": 4,
   "ram": 8,
   "disque": 100,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "BER-DOCKER02",
   "site": "BER",
   "role": "Docker — Greenbone Community Edition",
   "ip": "172.17.40.41",
   "os": "Ubuntu Server 24.04",
   "vcpu": 4,
   "ram": 8,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  },
  {
   "nom": "BER-CLT01",
   "site": "BER",
   "role": "Client de test (optionnel)",
   "ip": "DHCP",
   "os": "Windows 11",
   "vcpu": 2,
   "ram": 4,
   "disque": 60,
   "mem": "statique",
   "replica": "",
   "statut": "afaire"
  }
 ],
 "dns": [
  {
   "nom": "bru-dc01 / par-dc01",
   "type": "A",
   "cible": "172.17.10.10 / 172.17.20.10",
   "pour": "Contrôleurs de domaine"
  },
  {
   "nom": "intranet",
   "type": "A",
   "cible": "172.17.10.20 (VIP NLB)",
   "pour": "IIS derrière NLB"
  },
  {
   "nom": "mail",
   "type": "A",
   "cible": "172.17.10.30",
   "pour": "OWA / Exchange"
  },
  {
   "nom": "autodiscover",
   "type": "CNAME",
   "cible": "mail.eurocorp.lan",
   "pour": "Autodiscover Exchange"
  },
  {
   "nom": "sharepoint",
   "type": "A",
   "cible": "172.17.20.21",
   "pour": "Site intranet SharePoint"
  },
  {
   "nom": "fs01 / files",
   "type": "A / CNAME",
   "cible": "172.17.30.10",
   "pour": "File Server"
  },
  {
   "nom": "zbx01",
   "type": "CNAME",
   "cible": "bru-docker01.eurocorp.lan",
   "pour": "Interface et serveur Zabbix"
  },
  {
   "nom": "helpdesk",
   "type": "CNAME",
   "cible": "lon-docker01.eurocorp.lan",
   "pour": "Redmine"
  },
  {
   "nom": "wazuh",
   "type": "CNAME",
   "cible": "ber-docker01.eurocorp.lan",
   "pour": "Wazuh dashboard / manager"
  },
  {
   "nom": "greenbone",
   "type": "CNAME",
   "cible": "ber-docker02.eurocorp.lan",
   "pour": "Console Greenbone"
  }
 ],
 "flux": [
  {
   "id": "F01",
   "de": "Hôtes WAN (4 OPNsense)",
   "vers": "Hôtes WAN (4 OPNsense)",
   "proto": "UDP 500, UDP 4500, ESP",
   "service": "IPsec site-à-site",
   "pourquoi": "Monter et maintenir les 3 tunnels BRU↔PAR/LON/BER",
   "groupe": "Réseau"
  },
  {
   "id": "F02",
   "de": "Tous les LAN",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "TCP/UDP 53",
   "service": "DNS",
   "pourquoi": "Résolution des noms du domaine et des services",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F03",
   "de": "Tous les LAN",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "TCP/UDP 88, TCP/UDP 464",
   "service": "Kerberos",
   "pourquoi": "Authentification des comptes de domaine",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F04",
   "de": "Tous les LAN",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "TCP/UDP 389, TCP 636, TCP 3268",
   "service": "LDAP / catalogue global",
   "pourquoi": "Annuaire ; Redmine et Exchange interrogent l'AD",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F05",
   "de": "Tous les LAN",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "TCP 445, TCP 135, RPC dynamique",
   "service": "SMB / RPC",
   "pourquoi": "Jonction au domaine, GPO, ouverture de session",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F06",
   "de": "BRU-DC01",
   "vers": "PAR-DC01 (et inverse)",
   "proto": "TCP 135, 389, 445, 3268, RPC dynamique, UDP/TCP 53, 88",
   "service": "Réplication AD",
   "pourquoi": "Garder les deux DC synchronisés (repadmin /replsummary)",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F07",
   "de": "LAN distants (relais OPNsense)",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "UDP 67/68 (relayé en unicast)",
   "service": "DHCP relay",
   "pourquoi": "Les sites distants reçoivent leurs baux depuis le DHCP central",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F08",
   "de": "BRU-DC01",
   "vers": "PAR-DC01 (et inverse)",
   "proto": "TCP 647",
   "service": "DHCP Failover",
   "pourquoi": "Synchroniser les baux entre les deux serveurs DHCP",
   "groupe": "AD / DNS / DHCP"
  },
  {
   "id": "F09",
   "de": "Tous les LAN",
   "vers": "LON-FS01",
   "proto": "TCP 445",
   "service": "SMB",
   "pourquoi": "Accès aux partages Direction/RH/Finance/IT/Commun",
   "groupe": "Services Windows"
  },
  {
   "id": "F10",
   "de": "Tous les LAN",
   "vers": "VIP NLB intranet (BRU-IIS01/02)",
   "proto": "TCP 80, 443",
   "service": "HTTP(S)",
   "pourquoi": "Page intranet publiée derrière NLB",
   "groupe": "Services Windows"
  },
  {
   "id": "F11",
   "de": "Tous les LAN",
   "vers": "BRU-EXCH01",
   "proto": "TCP 443",
   "service": "OWA / Autodiscover",
   "pourquoi": "OWA accessible depuis les quatre sites",
   "groupe": "Services Windows"
  },
  {
   "id": "F12",
   "de": "BRU-EXCH01",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "LDAP, Kerberos, RPC (cf. F03–F05)",
   "service": "Exchange ↔ AD",
   "pourquoi": "Exchange lit et écrit dans l'annuaire",
   "groupe": "Services Windows"
  },
  {
   "id": "F13",
   "de": "Tous les LAN",
   "vers": "PAR-SP01",
   "proto": "TCP 80, 443",
   "service": "SharePoint",
   "pourquoi": "Accès au site intranet et à la bibliothèque documentaire",
   "groupe": "Services Windows"
  },
  {
   "id": "F14",
   "de": "PAR-SP01",
   "vers": "PAR-SQL01",
   "proto": "TCP <port fixe SQL>, UDP 1434",
   "service": "SQL Server",
   "pourquoi": "Bases de contenu et de configuration (même LAN, pas besoin de traverser un tunnel)",
   "groupe": "Services Windows"
  },
  {
   "id": "F15",
   "de": "Hôte Hyper-V Londres (10.10.28.224)",
   "vers": "Hôte Hyper-V Paris (10.10.28.233)",
   "proto": "TCP 80 (Kerberos) ou 443 (certificat), par le réseau de salle",
   "service": "Hyper-V Replica",
   "pourquoi": "Répliquer LON-FS01 vers Paris : la réplication va d’hôte à hôte, pas de VM à VM",
   "groupe": "Virtualisation"
  },
  {
   "id": "F16",
   "de": "Agents Windows/Linux (tous sites)",
   "vers": "BRU-DOCKER01",
   "proto": "TCP 10051",
   "service": "Zabbix (checks actifs)",
   "pourquoi": "L'agent initie la connexion : un seul port à ouvrir vers le hub",
   "groupe": "Supervision"
  },
  {
   "id": "F17",
   "de": "BRU-DOCKER01",
   "vers": "Services supervisés",
   "proto": "TCP 53, 80, 443, 25, 445… (checks simples)",
   "service": "Zabbix (disponibilité de services)",
   "pourquoi": "Tester DNS, IIS, Exchange et applications web critiques",
   "groupe": "Supervision"
  },
  {
   "id": "F18",
   "de": "Postes d'administration",
   "vers": "BRU-DOCKER01",
   "proto": "TCP 80 (443 si TLS)",
   "service": "Frontend Zabbix",
   "pourquoi": "Tableau de bord",
   "groupe": "Supervision"
  },
  {
   "id": "F19",
   "de": "Tous les LAN",
   "vers": "LON-DOCKER01",
   "proto": "TCP 80, 443",
   "service": "Redmine",
   "pourquoi": "Suivi des tâches et incidents (nginx redirige 80 → 443)",
   "groupe": "Supervision"
  },
  {
   "id": "F20",
   "de": "LON-DOCKER01",
   "vers": "BRU-DC01, PAR-DC01",
   "proto": "TCP 389 (636 en prod)",
   "service": "LDAP",
   "pourquoi": "Authentification Redmine par les comptes AD",
   "groupe": "Supervision"
  },
  {
   "id": "F21",
   "de": "Agents Wazuh (Windows/Linux)",
   "vers": "BER-DOCKER01",
   "proto": "TCP 1514, TCP 1515",
   "service": "Wazuh (événements, enrôlement)",
   "pourquoi": "Collecte des événements de sécurité",
   "groupe": "Sécurité"
  },
  {
   "id": "F22",
   "de": "Postes d'administration",
   "vers": "BER-DOCKER01",
   "proto": "TCP 443",
   "service": "Dashboard Wazuh",
   "pourquoi": "Consulter les alertes",
   "groupe": "Sécurité"
  },
  {
   "id": "F23",
   "de": "BER-DOCKER02",
   "vers": "Cibles du scan (Windows, web, Linux)",
   "proto": "ICMP, TCP 445, 135, 22, 80, 443… (étendue du scan)",
   "service": "Greenbone — scan",
   "pourquoi": "Scan authentifié des cibles (SMB pour Windows, SSH pour Linux)",
   "groupe": "Sécurité"
  },
  {
   "id": "F24",
   "de": "Postes d'administration",
   "vers": "BER-DOCKER02",
   "proto": "TCP 443, TCP 9392",
   "service": "Console Greenbone",
   "pourquoi": "Créer targets/tâches et lire les rapports",
   "groupe": "Sécurité"
  },
  {
   "id": "F25",
   "de": "Postes d'administration",
   "vers": "Serveurs Windows",
   "proto": "TCP 3389",
   "service": "RDP",
   "pourquoi": "Administration à distance (source limitée aux postes d'admin)",
   "groupe": "Administration"
  },
  {
   "id": "F26",
   "de": "Postes d'administration",
   "vers": "Hôtes Docker",
   "proto": "TCP 22",
   "service": "SSH",
   "pourquoi": "Administration et copie de fichiers (scp)",
   "groupe": "Administration"
  },
  {
   "id": "F27",
   "de": "Postes d’administration (alias ADMIN_PC)",
   "vers": "OPNsense (WAN, « This Firewall »)",
   "proto": "TCP 443",
   "service": "Interface web OPNsense",
   "pourquoi": "Administrer les pare-feux depuis le réseau de salle, source limitée à ADMIN_PC",
   "groupe": "Administration"
  },
  {
   "id": "F28",
   "de": "Tous les LAN",
   "vers": "Internet via passerelle salle",
   "proto": "TCP/UDP 53, TCP 80, 443",
   "service": "Sortie Internet (si fournie)",
   "pourquoi": "Mises à jour et téléchargement d'images Docker ; passerelle communiquée à part",
   "groupe": "Réseau"
  }
 ],
 "planning": [
  {
   "j": 1,
   "titre": "Analyse du cahier des charges, architecture, plan IP, répartition des rôles",
   "cles": [
    "architecture",
    "plan-ip",
    "roles"
   ]
  },
  {
   "j": 2,
   "titre": "Hyper-V, vSwitch, VM OPNsense, réseaux de sites",
   "cles": [
    "hyperv",
    "opnsense"
   ]
  },
  {
   "j": 3,
   "titre": "IPsec, routage intersite, filtrage, tests de communication",
   "cles": [
    "ipsec",
    "filtrage"
   ]
  },
  {
   "j": 4,
   "titre": "AD DS, DNS, Sites and Services, réplication",
   "cles": [
    "ad",
    "dns",
    "sites"
   ]
  },
  {
   "j": 5,
   "titre": "DHCP, GPO, File Server et droits",
   "cles": [
    "dhcp",
    "gpo",
    "fileserver"
   ]
  },
  {
   "j": 6,
   "titre": "Exchange Server et messagerie interne",
   "cles": [
    "exchange"
   ]
  },
  {
   "j": 7,
   "titre": "IIS/NLB, SharePoint et SQL Server",
   "cles": [
    "iis",
    "sharepoint",
    "sql"
   ]
  },
  {
   "j": 8,
   "titre": "Docker : Redmine et préparation des stacks",
   "cles": [
    "redmine",
    "docker"
   ]
  },
  {
   "j": 9,
   "titre": "Docker : Zabbix, Wazuh et Greenbone",
   "cles": [
    "zabbix",
    "wazuh",
    "greenbone"
   ]
  },
  {
   "j": 10,
   "titre": "Hyper-V Replica, PowerShell, sauvegardes, finalisation",
   "cles": [
    "replica",
    "powershell",
    "sauvegarde"
   ]
  },
  {
   "j": 11,
   "titre": "Tests d'exploitation, diagnostic, incidents fournis par le formateur",
   "cles": [
    "tests"
   ]
  },
  {
   "j": 12,
   "titre": "PRA, corrections finales, audit, soutenance",
   "cles": [
    "pra",
    "soutenance"
   ]
  }
 ],
 "etat": [
  {
   "cle": "architecture",
   "nom": "Architecture & plan IP",
   "statut": "encours",
   "note": "Plan IP du groupe 2 posé (WAN .111–.114, LAN 172.17.10/20/30/40.0/24). Vérifié le 30/10 : DC de Bruxelles en 172.17.10.10, conforme au plan. Écart restant : Exchange en .11 et 8 Go (plan .30 et 16 Go, imposé par l’énoncé)."
  },
  {
   "cle": "hyperv",
   "nom": "Hyper-V : vSwitch et VM",
   "statut": "fait",
   "note": "Hyper-V et vSwitch en place sur les 4 hôtes : WAN externe, LAN de site privé (aucun hôte sur un LAN). Vérifié le 30/10 sur Bruxelles, Londres et Berlin."
  },
  {
   "cle": "opnsense",
   "nom": "OPNsense (4 sites)",
   "statut": "fait",
   "note": "4 OPNsense en service (WAN .111–.114, LAN 172.17.x.1). Pare-feux actifs : alias ADMIN_PC, GRP2_FW, HOTES_HV, LAN_SITES ; Block private networks décoché, Disable reply-to coché. LON et BER en 26.1.11 depuis le 30/10."
  },
  {
   "cle": "ipsec",
   "nom": "IPsec + routage intersite",
   "statut": "fait",
   "note": "3 tunnels IKEv2 vers le hub BRU (AES-256/SHA-256/DH14), règles WAN UDP 500, 4500 et ESP. Ping LAN ↔ LAN validé dans tous les sens le 29/10, transit Paris ↔ Londres ↔ Berlin par Bruxelles."
  },
  {
   "cle": "filtrage",
   "nom": "Règles firewall (matrice de flux)",
   "statut": "encours",
   "note": "Pas de « tout autorisé » sur IPsec : seuls l’admin, le ping et l’IPsec sont ouverts. Reste à ouvrir les flux de services de la matrice et à remplacer « LAN vers any » sur les LAN."
  },
  {
   "cle": "ad",
   "nom": "AD DS + DNS + Sites and Services",
   "statut": "encours",
   "note": "Jour 1 : DC01 installé, domaine eurocorp.lan créé (nom confirmé) ; DC01 pas terminé : DNS, sites et services, rôles à finir."
  },
  {
   "cle": "dhcp",
   "nom": "DHCP + Failover",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "fileserver",
   "nom": "File Server Londres (AGDLP)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "iis",
   "nom": "IIS + NLB (Bruxelles)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "exchange",
   "nom": "Exchange Server SE",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "sharepoint",
   "nom": "SharePoint + SQL Server (Paris)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "redmine",
   "nom": "Redmine (Londres)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "zabbix",
   "nom": "Zabbix (Bruxelles)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "wazuh",
   "nom": "Wazuh (Berlin)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "greenbone",
   "nom": "Greenbone (Berlin)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "replica",
   "nom": "Hyper-V Replica (LON → PAR)",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "powershell",
   "nom": "4 scripts PowerShell",
   "statut": "afaire",
   "note": ""
  },
  {
   "cle": "pra",
   "nom": "Sauvegarde / PRA",
   "statut": "afaire",
   "note": ""
  }
 ],
 "suivi": {
  "preparer.html": {
   "total": 240,
   "faits": [
    "Relever la carte réseau physique de l'hôteGet-NetAdapter : repère le nom de la c",
    "Ouvre PowerShell en administrateur sur l'hôte Hyper-V.",
    "Lance Get-NetAdapter : la liste donne Name, InterfaceDescription, Status et Link",
    "Repère la ligne Status = Up dont l'adresse est dans le réseau de la salle (Get-N",
    "Créer le commutateur externeHyper-V Manager → Virtual Switch Manager → External,",
    "Hyper-V Manager → Virtual Switch Manager… (panneau Actions à droite).",
    "À gauche, New virtual network switch → External → Create Virtual Switch.",
    "Garde cochée « Allow management operating system to share this network adapter »",
    "OK. Une coupure réseau de quelques secondes est normale pendant la création.",
    "Créer le commutateur privé du siteUn commutateur privé n'est relié ni à l'hôte n",
    "Virtual Switch Manager → New virtual network switch → Private → Create Virtual S",
    "OK.",
    "Laisser l'hôte joignable-AllowManagementOS $true garde l'accès réseau de l'hôte ",
    "Dans la fenêtre de création du commutateur externe, ne décoche pas « Allow manag",
    "Après création, vérifie qu'une carte virtuelle « vEthernet (WAN) » apparaît dans",
    "Lister les commutateursAttendu : WAN (External) et LAN-xxx (Private).",
    "PowerShell sur l'hôte : Get-VMSwitch | Format-Table Name, SwitchType.",
    "Compare avec l'attendu : WAN en External, LAN-xxx en Private.",
    "Tester l'accès à la salleDepuis l'hôte : ping 10.10.28.254 doit répondre.",
    "Sur l'hôte, PowerShell : ping 10.10.28.254 (la passerelle de la salle).",
    "Puis le WAN d'un autre site : ping 10.10.28.111 (BRU), .112 (PAR), etc., quand c"
   ]
  },
  "reseau.html": {
   "total": 165,
   "faits": [
    "Deux cartes réseauCarte 1 sur LAN-xxx du site (commutateur privé), carte 2 sur l",
    "Crée la VM (génération 2), puis dans Settings regarde Network Adapter : la carte",
    "Branche cette première carte sur LAN-xxx de ton site (commutateur privé).",
    "Add Hardware → Network Adapter → Add, et branche cette deuxième carte sur le com",
    "Pas de VLAN, pas de mémoire dynamique.",
    "DimensionnerGénération 2 · 2 vCPU · 2 Go de RAM fixe · 20 Go de disque. Désactiv",
    "Settings → Processor : 2 vCPU.",
    "Settings → Security : décoche Enable Secure Boot.",
    "Noter les valeurs du siteWAN de chaque pare-feu : 10.10.28.111 à .114 (Bruxelles",
    "Regarde la page Infrastructure et le tableau « Plan IP » : WAN, LAN, passerelle ",
    "Recopie : WAN 10.10.28.111 à .114 (BRU, PAR, LON, BER), passerelle de la salle 1",
    "Installer depuis l'ISODémarrer sur l'ISO d'OPNsense (image dvd). Se connecter en",
    "Monte l'ISO OPNsense (image dvd) sur la VM et démarre.",
    "À l'écran de connexion de l'installeur : identifiant installer, mot de passe opn",
    "Choisis le clavier, puis Install (UFS) ou ZFS (UFS suffit pour le labo), sélecti",
    "Définis le mot de passe de root à la fin de l'installation (note-le dans Infos.m",
    "À la fin, choisis Halt now (pas Reboot). VM éteinte : retire l'ISO (Settings → D",
    "Attribuer les interfacesÀ la console : Assign interfaces, confirmer que hn0 est ",
    "Dans le menu de la console, tape 1 (Assign interfaces).",
    "« Do you want to configure LAGGs / VLANs now ? » : n.",
    "WAN : saisis le nom de la deuxième interface (hn1) ; LAN : la première (hn0) ; p",
    "Confirme avec y.",
    "Menu 2 (Set interface IP address) : choisis le LAN, « Configure IPv4 via DHCP ? ",
    "Refais le menu 2 pour le WAN : IPv4 manuel, adresse du tableau (10.10.28.11x), m",
    "Premier accès webDepuis une VM du LAN : https://172.17.x.1 (certificat auto-sign",
    "Accepte l'avertissement de certificat (certificat auto-signé).",
    "Connecte-toi : root et le mot de passe choisi à l'installation.",
    "Laisser entrer le réseau de la salleInterfaces → WAN : décocher « Block private ",
    "Menu Interfaces → WAN.",
    "Descends à « Generic configuration ».",
    "Save, puis Apply changes.",
    "Désactiver reply-toFirewall → Settings → Advanced : cocher Disable reply-to. Le ",
    "Menu Firewall → Settings → Advanced.",
    "Coche Disable reply-to (« Disable reply-to on WAN rules »).",
    "Save.",
    "Intégration Hyper-V (déjà incluse)Rien à installer : les services d'intégration ",
    "Sur l'hôte, contrôle les services d'intégration de la VM : Get-VMIntegrationServ",
    "Le pare-feu atteint la salleInterfaces → Diagnostics → Ping vers 10.10.28.254 do",
    "Interfaces → Diagnostics → Ping (ou menu console 7).",
    "Hôte : 10.10.28.254, source WAN. Ping.",
    "Les tunnels et leurs adressesTunnelTrafic chiffré (child)WAN hub (BRU)WAN spokeB",
    "Regarde le tableau des tunnels ci-dessus : chaque tunnel relie le WAN du hub (10",
    "Sur Bruxelles (hub), les trois tunnels : BRU-PAR (vers 10.10.28.112), BRU-LON (.",
    "Chaque tunnel transporte le LAN du spoke vers les trois autres LAN (colonne « Tr",
    "Choisis les algorithmes : IKEv2, AES-256, SHA-256, groupe DH 14 (ou supérieur). ",
    "Identifiants : l'adresse IP WAN de chaque pare-feu.",
    "Rappeler la logique en deux phasesPhase 1 : les deux pare-feu s'identifient et s",
    "Phase 1 (IKE) : les deux pare-feu se reconnaissent (clé) et créent un canal sécu",
    "Phase 2 (CHILD SA) : sur ce canal, ils négocient quels réseaux passent (LAN loca",
    "Tunnel Bruxelles ↔ Paris d'abordSur BRU-FW01 : VPN → IPsec → Connections → nouve",
    "Sur BRU-FW01 : VPN → IPsec → Connections → Add.",
    "Version IKEv2, Local addresses = 10.10.28.111, Remote addresses = 10.10.28.112, ",
    "Local Authentication : Pre-Shared Key, identifiant = IP locale. Remote Authentic",
    "Dans VPN → IPsec → Pre-Shared Keys, ajoute la clé : Local Identifier et Remote I",
    "Active la connexion, Apply.",
    "Ajouter l'enfant (phase 2)Dans la connexion : Children → mode tunnel, réseau loc",
    "Dans la connexion, onglet Children → Add.",
    "Mode Tunnel, Local network = 172.17.10.0/24, Remote network = 172.17.20.0/24 (po",
    "Proposals de chiffrement identiques à l'autre côté. Save, puis Apply.",
    "Faire la même chose sur PAR-FW01, à l'enversLocal = Paris (10.10.28.112, 172.17.",
    "Sur PAR-FW01 : même procédure, mais Local = 10.10.28.112 et réseau local 172.17.",
    "Même clé, mêmes algorithmes, mêmes identifiants (inversés).",
    "Active et applique.",
    "Tunnel Bruxelles ↔ Londres puis ↔ BerlinSeulement quand le premier est validé. L",
    "Une fois le premier tunnel validé par un ping de LAN à LAN, reprends exactement ",
    "Sur BRU-FW01, chaque spoke est une connexion séparée avec son propre enfant et s",
    "Teste chaque tunnel avant de passer au suivant.",
    "Autoriser le trafic dans le tunnelFirewall → Rules → IPsec : règle d'autorisatio",
    "Firewall → Rules → IPsec (onglet qui apparaît quand IPsec est activé).",
    "Save, Apply.",
    "Autoriser le tunnel lui-même sur le WANFirewall → Rules → WAN : UDP 500, UDP 450",
    "Firewall → Rules → WAN → Add.",
    "Règle Pass, protocole UDP, source = l'IP WAN du pare-feu distant, destination = ",
    "Ajoute une règle protocole ESP pour la même source.",
    "Passage par le hubParis ↔ Londres passe par Bruxelles : sur chaque spoke, le rés",
    "Sur chaque spoke, dans l'enfant du tunnel vers Bruxelles : réseau local = son LA",
    "Sur le hub, dans l'enfant de chaque spoke : réseau local = les LAN des trois aut",
    "Sur le hub, ajoute une règle Firewall → Rules → IPsec de « tous les LAN » vers «",
    "Voir l'étatVPN → IPsec → Status Overview : le tunnel doit être Established (phas",
    "VPN → IPsec → Status Overview.",
    "Repère la connexion : état « Established » pour la phase 1 et pour l'enfant.",
    "Clique sur les détails pour voir les octets échangés.",
    "En cas d'échecVPN → IPsec → Log File. Phase 1 qui échoue : clé, identifiants, ad",
    "VPN → IPsec → Log File : lis les dernières lignes au moment de la tentative.",
    "Phase 1 qui échoue : clé, identifiants, adresse distante, algorithmes.",
    "Phase 2 qui échoue : réseaux local et distant inversés ou différents entre les d",
    "Établi mais rien ne passe : règle manquante sur l'interface IPsec, ou sur le WAN",
    "Sur OPNsense, Firewall → NAT → Outbound : mode automatique.",
    "Lire la matrice de fluxChaque ligne ci-dessous est un flux à autoriser, avec la ",
    "Ouvre le tableau des 28 flux : chaque ligne indique la source, la destination, l",
    "Repère les flux qui concernent ton site.",
    "Créer des aliasFirewall → Aliases : un alias par groupe (DC, LAN_ALL, DOCKER) év",
    "Firewall → Aliases → Add.",
    "Nom DC, type Host(s), contenu 172.17.10.10, 172.17.20.10.",
    "Nom LAN_ALL, type Network(s), contenu les quatre LAN.",
    "Écrire les règles flux par fluxFirewall → Rules → IPsec (trafic venant des autre",
    "Firewall → Rules → IPsec pour le trafic venant des autres sites, LAN pour le tra",
    "Pour chaque ligne de la matrice : Pass, protocole, source (alias), destination (",
    "Save, puis Apply à la fin.",
    "Ouvrir le port du failover DHCPEntre les deux serveurs DHCP, le failover utilise",
    "Règle sur l'interface IPsec : TCP 647 entre 172.17.10.10 et 172.17.20.10 (dans l",
    "Lire les journauxFirewall → Log Files → Live View : un blocage inattendu y appar",
    "Firewall → Log Files → Live View.",
    "Filtre sur l'IP source du test.",
    "Repère la ligne bloquée : la règle responsable est affichée."
   ]
  }
 }
};
