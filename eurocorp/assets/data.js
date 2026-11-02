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
   "statut": "encours",
   "reel": {
    "vmhv": "DC-BXL",
    "_source": "Relevé le 30/10 : la VM du DC de Bruxelles s'appelle DC-BXL dans Hyper-V, IP 172.17.10.10 conforme au plan."
   }
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
   "statut": "encours",
   "reel": {
    "ip": "172.17.10.11",
    "ram": "8",
    "_source": "Relevé le 30/10 (IP vue par Hyper-V) : Exchange en .11 avec 8 Go."
   }
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
   "role": "OPNsense — spoke",
   "ip": "172.17.20.1",
   "os": "OPNsense",
   "vcpu": 2,
   "ram": 2,
   "disque": 20,
   "mem": "statique",
   "replica": "",
   "statut": "fait",
   "reel": {
    "vmhv": "2-PARIS-OPNSENSE",
    "_source": "Nom de la VM OPNsense de Paris relevé le 29/10."
   }
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
   "statut": "encours"
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
   "proto": "TCP 1433, UDP 1434",
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
   "statut": "encours",
   "note": "VM créée (relevée le 30/10 en 172.17.10.11 avec 8 Go). L'énoncé impose 16 Go (§6.3) : à corriger avant l'installation. Plan : 172.17.10.30."
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
   "statut": "encours",
   "note": "Déployé le 30/10 sur LON-DOCKER01 : compose, certificat, nginx, démarrage, compte admin, API REST, compte LDAP (suivi commun). Reste : test de connexion LDAP, projet EUROCORP et trackers (énoncé §9.2), sauvegarde et restauration."
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
    "Puis le WAN d'un autre site : ping 10.10.28.111 (BRU), .112 (PAR), etc., quand c",
    "Créer la VMGénération 2 · RAM selon l'inventaire, mémoire dynamique décochée · c",
    "Hyper-V Manager → New → Virtual Machine : nom (BRU-DOCKER01 par exemple), Généra",
    "Mémoire de démarrage = RAM de l'inventaire, case mémoire dynamique décochée.",
    "Réseau : LAN-xxx du site.",
    "Disque virtuel de 60 Go (ou la taille de l'inventaire).",
    "ISO d'Ubuntu Server 24.04 en média d'installation.",
    "Désactiver le démarrage sécuriséSettings → Security → décocher Enable Secure Boo",
    "Clic droit sur la VM → Settings → Security.",
    "Décoche « Enable Secure Boot » (ou choisis le modèle « Microsoft UEFI Certificat",
    "OK.#3",
    "Installer Ubuntu ServerDémarrer sur l'ISO. À l'écran réseau, passer l'interface ",
    "Démarre la VM, choisis « Try or Install Ubuntu Server ».",
    "Langue : English. Clavier : Belgian ou celui de ton poste.",
    "Type d'installation : Ubuntu Server (pas minimized).",
    "Réseau : sélectionne l'interface → Edit IPv4 → Manual : sous-réseau du site (par",
    "Proxy : vide. Miroir : par défaut.",
    "Stockage : disque entier, sans LVM chiffré.",
    "Profil : nom, nom du serveur (bru-docker01), utilisateur, mot de passe.",
    "Coche Install OpenSSH server et ne choisis pas de snap en plus.",
    "Quand l'installation finit, « Reboot Now » et retire l'ISO.",
    "Installer Docker (dépôt officiel)Comme dans ton cours Docker, partie 3 :Le paque",
    "Connecte-toi en SSH.",
    "Copie le bloc de commandes ci-dessous ligne par ligne (il ajoute la clé GPG de D",
    "Active le démarrage automatique : sudo systemctl enable --now docker.",
    "Enregistrer le nom dans le DNSUn enregistrement A par VM Docker sur le contrôleu",
    "Sur un contrôleur de domaine : Add-DnsServerResourceRecordA -ZoneName eurocorp.l",
    "Ou via DNS Manager → zone eurocorp.lan → New Host (A).",
    "docker compose version : affiche la version du plugin Compose.",
    "ip a : l'IP du plan est portée par la bonne interface.",
    "ping -c2 172.17.10.1 : la passerelle OPNsense répond.",
    "ping -c2 172.17.10.10 : le contrôleur de domaine répond.",
    "Crée les commutateurs : WAN (externe) et le privé de ton site (section 1).",
    "Crée la VM OPNsense avec deux cartes (WAN, LAN du site).",
    "Affecte les interfaces et l'adresse LAN, puis ouvre l'interface web depuis une V",
    "Monte le tunnel IPsec de ton site et teste un ping LAN à LAN."
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
    "Repère la ligne bloquée : la règle responsable est affichée.",
    "Décoche Block private networks. Laisse Block bogon networks coché.",
    "Un ping réel de LAN à LANUn tunnel « établi » ne prouve rien : depuis une VM de ",
    "Reviens à Paris et teste Bruxelles."
   ]
  },
  "docker.html": {
   "total": 196,
   "faits": [
    "Docker est installé sur la VMVoir Préparer, section 5. docker compose version do",
    "Connecte-toi en SSH à la VM Docker.",
    "docker --version et docker compose version.",
    "Si la commande est absente : retourne à la page Préparer, section « Créer les VM",
    "Protéger le .envGit ne conserve pas ce droit : à refaire après chaque git clone.",
    "sudo chmod 600 .env : lecture et écriture pour le propriétaire seulement.",
    "Vérifie : ls -l .env affiche -rw-------.",
    "Variables du .envVariableRôleComment la choisirMYSQL_DATABASEBase de RedmineLibr",
    "Nom DNSAlias helpdesk (CNAME) vers lon-docker01.eurocorp.lan, ou enregistrement ",
    "Sur un contrôleur de domaine : Add-DnsServerResourceRecordA -ZoneName eurocorp.l#2",
    "Pour un alias : Add-DnsServerResourceRecordCName vers le nom de la VM.#2",
    "Le compose (Redmine + MariaDB + nginx)Trois services sur le réseau redmine-netwo",
    "Copie 05-Docker/redmine/docker-compose.yml dans ~/redmine/.",
    "Lis-le : trois services sur le réseau redmine-network — db (MariaDB), redmine (s",
    "Vérifie les volumes nommés : base et pièces jointes.",
    "Certificat auto-signé pour nginxLe navigateur ne fait pas confiance à un certifi",
    "Génère la clé privée : openssl genrsa -out nginx/certs/redmine.key 4096.",
    "Crée le certificat avec le bloc ci-dessous (openssl req -x509 …) : nom helpdesk.",
    "Vérifie : openssl x509 -in nginx/certs/redmine.crt -noout -subject -dates.",
    "Configuration de nginx",
    "Crée nginx/conf.d/redmine.conf avec le contenu ci-dessous.",
    "Le premier bloc renvoie le HTTP vers HTTPS (301) ; le second écoute en 443, prés",
    "client_max_body_size 100M autorise les grosses pièces jointes.",
    "DémarrerAu premier démarrage, un « Can't connect to server on 'db' » est normal ",
    "sudo chmod 600 .env.",
    "sudo docker compose config | grep -i password : aucune valeur vide.",
    "sudo docker compose up -d puis sudo docker ps.",
    "Première connexionhttps://helpdesk.eurocorp.lan → Sign in avec le compte par déf",
    "Ouvre l'URL du service dans un navigateur.#2",
    "Connecte-toi avec le compte par défaut de l'application (indiqué dans l'étape).#2",
    "Change tout de suite le mot de passe et note-le dans Infos.md.#2",
    "Activer l'APIAdministration → Settings → Integration : REST web service (et, si ",
    "Connecté en administrateur : Administration → Settings → API (ou Integration sel",
    "Coche Enable REST web service ; Save.",
    "La clé API personnelle est dans My account → API access key.",
    "Crée dans l'AD un compte de service dédié, simple utilisateur (lecture de l'annu",
    "Redmine : Administration → LDAP authentication → New, remplis le tableau ci-dess",
    "Coche On-the-fly user creation.",
    "curl -kI https://helpdesk.eurocorp.lan : HTTP/1.1 200 ou 302."
   ]
  },
  "marche.html": {
   "total": 2797,
   "faits": [
    "Fiche de BRU-DC01RôleAD DS + DNS + DHCP (failover)SystèmeWindows Server 2025Adre",
    "Créer la VM depuis le disque parentComment. Hyper-V Manager → New → Virtual Mach",
    "IP fixe, puis renommer la machine (en dernier)Comment. ncpa.cpl → IPv4 : 172.17.",
    "Détail · IP fixe et DNS sur lui-mêmeAdresse 172.17.10.10, masque /24, passerelle",
    "Détail · Choisir le nomeurocorp.lan (NetBIOS EUROCORP). Déjà créé le jour 1 ; la",
    "Détail · Les serveurs ont une IP fixeLe serveur DHCP lui-même n'est jamais en DH",
    "Fiche de BRU-EXCH01RôleExchange Server SESystèmeWindows Server 2025Adresse IP172",
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
    "Puis le WAN d'un autre site : ping 10.10.28.111 (BRU), .112 (PAR), etc., quand c",
    "OK.#2",
    "Détail · Deux cartes réseauCarte 1 sur LAN-xxx du site (commutateur privé), cart",
    "Crée la VM (génération 2), puis dans Settings regarde Network Adapter : la carte",
    "Branche cette première carte sur LAN-xxx de ton site (commutateur privé).",
    "Add Hardware → Network Adapter → Add, et branche cette deuxième carte sur le com",
    "Pas de VLAN, pas de mémoire dynamique.",
    "Détail · DimensionnerGénération 2 · 2 vCPU · 2 Go de RAM fixe · 20 Go de disque.",
    "Settings → Processor : 2 vCPU.",
    "Settings → Security : décoche Enable Secure Boot.",
    "Détail · Noter les valeurs du siteWAN de chaque pare-feu : 10.10.28.111 à .114 (",
    "Regarde la page Infrastructure et le tableau « Plan IP » : WAN, LAN, passerelle ",
    "Recopie : WAN 10.10.28.111 à .114 (BRU, PAR, LON, BER), passerelle de la salle 1",
    "Détail · Les tunnels et leurs adressesTunnelTrafic chiffré (child)WAN hub (BRU)W",
    "Regarde le tableau des tunnels ci-dessus : chaque tunnel relie le WAN du hub (10",
    "Sur Bruxelles (hub), les trois tunnels : BRU-PAR (vers 10.10.28.112), BRU-LON (.",
    "Chaque tunnel transporte le LAN du spoke vers les trois autres LAN (colonne « Tr",
    "Choisis les algorithmes : IKEv2, AES-256, SHA-256, groupe DH 14 (ou supérieur). ",
    "Identifiants : l'adresse IP WAN de chaque pare-feu.",
    "Détail · Rappeler la logique en deux phasesPhase 1 : les deux pare-feu s'identif",
    "Phase 1 (IKE) : les deux pare-feu se reconnaissent (clé) et créent un canal sécu",
    "Phase 2 (CHILD SA) : sur ce canal, ils négocient quels réseaux passent (LAN loca",
    "Détail · Lire la matrice de fluxChaque ligne ci-dessous est un flux à autoriser,",
    "Ouvre le tableau des 28 flux : chaque ligne indique la source, la destination, l",
    "Repère les flux qui concernent ton site.",
    "Détail · Créer des aliasFirewall → Aliases : un alias par groupe (DC, LAN_ALL, D",
    "Firewall → Aliases → Add.",
    "Nom DC, type Host(s), contenu 172.17.10.10, 172.17.20.10.",
    "Nom LAN_ALL, type Network(s), contenu les quatre LAN.",
    "Détail · Installer depuis l'ISODémarrer sur l'ISO d'OPNsense (image dvd). Se con",
    "Monte l'ISO OPNsense (image dvd) sur la VM et démarre.",
    "À l'écran de connexion de l'installeur : identifiant installer, mot de passe opn",
    "Choisis le clavier, puis Install (UFS) ou ZFS (UFS suffit pour le labo), sélecti",
    "Définis le mot de passe de root à la fin de l'installation (note-le dans Infos.m",
    "À la fin, choisis Halt now (pas Reboot). VM éteinte : retire l'ISO (Settings → D",
    "Détail · Attribuer les interfacesÀ la console : Assign interfaces, confirmer que",
    "Dans le menu de la console, tape 1 (Assign interfaces).",
    "« Do you want to configure LAGGs / VLANs now ? » : n.",
    "WAN : saisis le nom de la deuxième interface (hn1) ; LAN : la première (hn0) ; p",
    "Confirme avec y.",
    "Menu 2 (Set interface IP address) : choisis le LAN, « Configure IPv4 via DHCP ? ",
    "Refais le menu 2 pour le WAN : IPv4 manuel, adresse du tableau (10.10.28.11x), m",
    "Détail · Tunnel Bruxelles ↔ Paris d'abordSur BRU-FW01 : VPN → IPsec → Connection",
    "Sur BRU-FW01 : VPN → IPsec → Connections → Add.",
    "Version IKEv2, Local addresses = 10.10.28.111, Remote addresses = 10.10.28.112, ",
    "Local Authentication : Pre-Shared Key, identifiant = IP locale. Remote Authentic",
    "Dans VPN → IPsec → Pre-Shared Keys, ajoute la clé : Local Identifier et Remote I",
    "Active la connexion, Apply.",
    "Détail · Ajouter l'enfant (phase 2)Dans la connexion : Children → mode tunnel, r",
    "Dans la connexion, onglet Children → Add.",
    "Mode Tunnel, Local network = 172.17.10.0/24, Remote network = 172.17.20.0/24 (po",
    "Proposals de chiffrement identiques à l'autre côté. Save, puis Apply.",
    "Détail · Faire la même chose sur PAR-FW01, à l'enversLocal = Paris (10.10.28.112",
    "Sur PAR-FW01 : même procédure, mais Local = 10.10.28.112 et réseau local 172.17.",
    "Même clé, mêmes algorithmes, mêmes identifiants (inversés).",
    "Active et applique.",
    "Détail · Tunnel Bruxelles ↔ Londres puis ↔ BerlinSeulement quand le premier est ",
    "Une fois le premier tunnel validé par un ping de LAN à LAN, reprends exactement ",
    "Sur BRU-FW01, chaque spoke est une connexion séparée avec son propre enfant et s",
    "Teste chaque tunnel avant de passer au suivant.",
    "Détail · Écrire les règles flux par fluxFirewall → Rules → IPsec (trafic venant ",
    "Firewall → Rules → IPsec pour le trafic venant des autres sites, LAN pour le tra",
    "Pour chaque ligne de la matrice : Pass, protocole, source (alias), destination (",
    "Save, puis Apply à la fin.",
    "Détail · Premier accès webDepuis une VM du LAN : https://172.17.x.1 (certificat ",
    "Accepte l'avertissement de certificat (certificat auto-signé).",
    "Connecte-toi : root et le mot de passe choisi à l'installation.",
    "Détail · Laisser entrer le réseau de la salleInterfaces → WAN : décocher « Block",
    "Menu Interfaces → WAN.",
    "Descends à « Generic configuration ».",
    "Décoche Block private networks. Laisse Block bogon networks coché.",
    "Save, puis Apply changes.",
    "Détail · Désactiver reply-toFirewall → Settings → Advanced : cocher Disable repl",
    "Menu Firewall → Settings → Advanced.",
    "Coche Disable reply-to (« Disable reply-to on WAN rules »).",
    "Save.",
    "Détail · Intégration Hyper-V (déjà incluse)Rien à installer : les services d'int",
    "Sur l'hôte, contrôle les services d'intégration de la VM : Get-VMIntegrationServ",
    "Détail · Autoriser le trafic dans le tunnelFirewall → Rules → IPsec : règle d'au",
    "Firewall → Rules → IPsec (onglet qui apparaît quand IPsec est activé).",
    "Save, Apply.",
    "Détail · Autoriser le tunnel lui-même sur le WANFirewall → Rules → WAN : UDP 500",
    "Firewall → Rules → WAN → Add.",
    "Règle Pass, protocole UDP, source = l'IP WAN du pare-feu distant, destination = ",
    "Ajoute une règle protocole ESP pour la même source.",
    "Détail · Passage par le hubParis ↔ Londres passe par Bruxelles : sur chaque spok",
    "Sur chaque spoke, dans l'enfant du tunnel vers Bruxelles : réseau local = son LA",
    "Sur le hub, dans l'enfant de chaque spoke : réseau local = les LAN des trois aut",
    "Sur le hub, ajoute une règle Firewall → Rules → IPsec de « tous les LAN » vers «",
    "Détail · Ouvrir le port du failover DHCPEntre les deux serveurs DHCP, le failove",
    "Règle sur l'interface IPsec : TCP 647 entre 172.17.10.10 et 172.17.20.10 (dans l",
    "Détail · Le pare-feu atteint la salleInterfaces → Diagnostics → Ping vers 10.10.",
    "Interfaces → Diagnostics → Ping (ou menu console 7).",
    "Hôte : 10.10.28.254, source WAN. Ping.",
    "Détail · Voir l'étatVPN → IPsec → Status Overview : le tunnel doit être Establis",
    "VPN → IPsec → Status Overview.",
    "Repère la connexion : état « Established » pour la phase 1 et pour l'enfant.",
    "Clique sur les détails pour voir les octets échangés.",
    "Détail · Un ping réel de LAN à LANUn tunnel « établi » ne prouve rien : depuis u",
    "Reviens à Paris et teste Bruxelles.",
    "Détail · En cas d'échecVPN → IPsec → Log File. Phase 1 qui échoue : clé, identif",
    "VPN → IPsec → Log File : lis les dernières lignes au moment de la tentative.",
    "Phase 1 qui échoue : clé, identifiants, adresse distante, algorithmes.",
    "Phase 2 qui échoue : réseaux local et distant inversés ou différents entre les d",
    "Établi mais rien ne passe : règle manquante sur l'interface IPsec, ou sur le WAN",
    "Détail · Lire les journauxFirewall → Log Files → Live View : un blocage inattend",
    "Firewall → Log Files → Live View.",
    "Filtre sur l'IP source du test.",
    "Repère la ligne bloquée : la règle responsable est affichée.",
    "Attribue l'adresse du plan : New-NetIPAddress -InterfaceAlias \"Ethernet\" -IPAddr",
    "Domaine DNS : eurocorp.lan. Nom NetBIOS : EUROCORP.",
    "Détail · Installer le rôle et créer la forêtLe mot de passe de restauration (DSR",
    "Installe les rôles : Install-WindowsFeature AD-Domain-Services, DNS -IncludeMana",
    "Promeus : Install-ADDSForest -DomainName \"eurocorp.lan\" -DomainNetbiosName \"EURO",
    "Saisis le mot de passe DSRM (mode de restauration des services d'annuaire) quand",
    "La machine redémarre seule : reconnecte-toi avec EUROCORP\\Administrator.",
    "Relever la carte réseau physique de l'hôteGet-NetAdapter : repère le nom de la c#2",
    "Ouvre PowerShell en administrateur sur l'hôte Hyper-V.#2",
    "Lance Get-NetAdapter : la liste donne Name, InterfaceDescription, Status et Link#2",
    "Repère la ligne Status = Up dont l'adresse est dans le réseau de la salle (Get-N#2",
    "Créer le commutateur externeHyper-V Manager → Virtual Switch Manager → External,#2",
    "Hyper-V Manager → Virtual Switch Manager… (panneau Actions à droite).#2",
    "À gauche, New virtual network switch → External → Create Virtual Switch.#2",
    "Garde cochée « Allow management operating system to share this network adapter »#2",
    "OK. Une coupure réseau de quelques secondes est normale pendant la création.#2",
    "Créer le commutateur privé du siteUn commutateur privé n'est relié ni à l'hôte n#2",
    "Virtual Switch Manager → New virtual network switch → Private → Create Virtual S#2",
    "OK.#3",
    "Laisser l'hôte joignable-AllowManagementOS $true garde l'accès réseau de l'hôte #2",
    "Dans la fenêtre de création du commutateur externe, ne décoche pas « Allow manag#2",
    "Après création, vérifie qu'une carte virtuelle « vEthernet (WAN) » apparaît dans#2",
    "Lister les commutateursAttendu : WAN (External) et LAN-xxx (Private).#2",
    "PowerShell sur l'hôte : Get-VMSwitch | Format-Table Name, SwitchType.#2",
    "Compare avec l'attendu : WAN en External, LAN-xxx en Private.#2",
    "Tester l'accès à la salleDepuis l'hôte : ping 10.10.28.254 doit répondre.#2",
    "Sur l'hôte, PowerShell : ping 10.10.28.254 (la passerelle de la salle).#2",
    "Puis le WAN d'un autre site : ping 10.10.28.111 (BRU), .112 (PAR), etc., quand c#2",
    "OK.#4",
    "Détail · Deux cartes réseauCarte 1 sur LAN-xxx du site (commutateur privé), cart#2",
    "Crée la VM (génération 2), puis dans Settings regarde Network Adapter : la carte#2",
    "Branche cette première carte sur LAN-xxx de ton site (commutateur privé).#2",
    "Add Hardware → Network Adapter → Add, et branche cette deuxième carte sur le com#2",
    "Pas de VLAN, pas de mémoire dynamique.#2",
    "Détail · DimensionnerGénération 2 · 2 vCPU · 2 Go de RAM fixe · 20 Go de disque.#2",
    "Settings → Processor : 2 vCPU.#2",
    "Settings → Security : décoche Enable Secure Boot.#2",
    "Détail · Noter les valeurs du siteWAN de chaque pare-feu : 10.10.28.111 à .114 (#2",
    "Regarde la page Infrastructure et le tableau « Plan IP » : WAN, LAN, passerelle #2",
    "Recopie : WAN 10.10.28.111 à .114 (BRU, PAR, LON, BER), passerelle de la salle 1#2",
    "Détail · Les tunnels et leurs adressesTunnelTrafic chiffré (child)WAN hub (BRU)W#2",
    "Regarde le tableau des tunnels ci-dessus : chaque tunnel relie le WAN du hub (10#2",
    "Sur Bruxelles (hub), les trois tunnels : BRU-PAR (vers 10.10.28.112), BRU-LON (.#2",
    "Chaque tunnel transporte le LAN du spoke vers les trois autres LAN (colonne « Tr#2",
    "Choisis les algorithmes : IKEv2, AES-256, SHA-256, groupe DH 14 (ou supérieur). #2",
    "Identifiants : l'adresse IP WAN de chaque pare-feu.#2",
    "Détail · Rappeler la logique en deux phasesPhase 1 : les deux pare-feu s'identif#2",
    "Phase 1 (IKE) : les deux pare-feu se reconnaissent (clé) et créent un canal sécu#2",
    "Phase 2 (CHILD SA) : sur ce canal, ils négocient quels réseaux passent (LAN loca#2",
    "Détail · Lire la matrice de fluxChaque ligne ci-dessous est un flux à autoriser,#2",
    "Ouvre le tableau des 28 flux : chaque ligne indique la source, la destination, l#2",
    "Repère les flux qui concernent ton site.#2",
    "Détail · Créer des aliasFirewall → Aliases : un alias par groupe (DC, LAN_ALL, D#2",
    "Firewall → Aliases → Add.#2",
    "Nom DC, type Host(s), contenu 172.17.10.10, 172.17.20.10.#2",
    "Nom LAN_ALL, type Network(s), contenu les quatre LAN.#2",
    "Détail · Installer depuis l'ISODémarrer sur l'ISO d'OPNsense (image dvd). Se con#2",
    "Monte l'ISO OPNsense (image dvd) sur la VM et démarre.#2",
    "À l'écran de connexion de l'installeur : identifiant installer, mot de passe opn#2",
    "Choisis le clavier, puis Install (UFS) ou ZFS (UFS suffit pour le labo), sélecti#2",
    "Définis le mot de passe de root à la fin de l'installation (note-le dans Infos.m#2",
    "À la fin, choisis Halt now (pas Reboot). VM éteinte : retire l'ISO (Settings → D#2",
    "Détail · Attribuer les interfacesÀ la console : Assign interfaces, confirmer que#2",
    "Dans le menu de la console, tape 1 (Assign interfaces).#2",
    "« Do you want to configure LAGGs / VLANs now ? » : n.#2",
    "WAN : saisis le nom de la deuxième interface (hn1) ; LAN : la première (hn0) ; p#2",
    "Confirme avec y.#2",
    "Menu 2 (Set interface IP address) : choisis le LAN, « Configure IPv4 via DHCP ? #2",
    "Refais le menu 2 pour le WAN : IPv4 manuel, adresse du tableau (10.10.28.11x), m#2",
    "Détail · Tunnel Bruxelles ↔ Paris d'abordSur BRU-FW01 : VPN → IPsec → Connection#2",
    "Sur BRU-FW01 : VPN → IPsec → Connections → Add.#2",
    "Version IKEv2, Local addresses = 10.10.28.111, Remote addresses = 10.10.28.112, #2",
    "Local Authentication : Pre-Shared Key, identifiant = IP locale. Remote Authentic#2",
    "Dans VPN → IPsec → Pre-Shared Keys, ajoute la clé : Local Identifier et Remote I#2",
    "Active la connexion, Apply.#2",
    "Détail · Ajouter l'enfant (phase 2)Dans la connexion : Children → mode tunnel, r#2",
    "Dans la connexion, onglet Children → Add.#2",
    "Mode Tunnel, Local network = 172.17.10.0/24, Remote network = 172.17.20.0/24 (po#2",
    "Proposals de chiffrement identiques à l'autre côté. Save, puis Apply.#2",
    "Détail · Faire la même chose sur PAR-FW01, à l'enversLocal = Paris (10.10.28.112#2",
    "Sur PAR-FW01 : même procédure, mais Local = 10.10.28.112 et réseau local 172.17.#2",
    "Même clé, mêmes algorithmes, mêmes identifiants (inversés).#2",
    "Active et applique.#2",
    "Détail · Tunnel Bruxelles ↔ Londres puis ↔ BerlinSeulement quand le premier est #2",
    "Une fois le premier tunnel validé par un ping de LAN à LAN, reprends exactement #2",
    "Sur BRU-FW01, chaque spoke est une connexion séparée avec son propre enfant et s#2",
    "Teste chaque tunnel avant de passer au suivant.#2",
    "Détail · Écrire les règles flux par fluxFirewall → Rules → IPsec (trafic venant #2",
    "Firewall → Rules → IPsec pour le trafic venant des autres sites, LAN pour le tra#2",
    "Pour chaque ligne de la matrice : Pass, protocole, source (alias), destination (#2",
    "Save, puis Apply à la fin.#2",
    "Détail · Premier accès webDepuis une VM du LAN : https://172.17.x.1 (certificat #2",
    "Accepte l'avertissement de certificat (certificat auto-signé).#2",
    "Connecte-toi : root et le mot de passe choisi à l'installation.#2",
    "Détail · Laisser entrer le réseau de la salleInterfaces → WAN : décocher « Block#2",
    "Menu Interfaces → WAN.#2",
    "Descends à « Generic configuration ».#2",
    "Décoche Block private networks. Laisse Block bogon networks coché.#2",
    "Save, puis Apply changes.#2",
    "Détail · Désactiver reply-toFirewall → Settings → Advanced : cocher Disable repl#2",
    "Menu Firewall → Settings → Advanced.#2",
    "Coche Disable reply-to (« Disable reply-to on WAN rules »).#2",
    "Save.#2",
    "Détail · Intégration Hyper-V (déjà incluse)Rien à installer : les services d'int#2",
    "Sur l'hôte, contrôle les services d'intégration de la VM : Get-VMIntegrationServ#2",
    "Détail · Autoriser le trafic dans le tunnelFirewall → Rules → IPsec : règle d'au#2",
    "Firewall → Rules → IPsec (onglet qui apparaît quand IPsec est activé).#2",
    "Save, Apply.#2",
    "Détail · Autoriser le tunnel lui-même sur le WANFirewall → Rules → WAN : UDP 500#2",
    "Firewall → Rules → WAN → Add.#2",
    "Règle Pass, protocole UDP, source = l'IP WAN du pare-feu distant, destination = #2",
    "Ajoute une règle protocole ESP pour la même source.#2",
    "Détail · Passage par le hubParis ↔ Londres passe par Bruxelles : sur chaque spok#2",
    "Sur chaque spoke, dans l'enfant du tunnel vers Bruxelles : réseau local = son LA#2",
    "Sur le hub, dans l'enfant de chaque spoke : réseau local = les LAN des trois aut#2",
    "Sur le hub, ajoute une règle Firewall → Rules → IPsec de « tous les LAN » vers «#2",
    "Détail · Ouvrir le port du failover DHCPEntre les deux serveurs DHCP, le failove#2",
    "Règle sur l'interface IPsec : TCP 647 entre 172.17.10.10 et 172.17.20.10 (dans l#2",
    "Détail · Le pare-feu atteint la salleInterfaces → Diagnostics → Ping vers 10.10.#2",
    "Interfaces → Diagnostics → Ping (ou menu console 7).#2",
    "Hôte : 10.10.28.254, source WAN. Ping.#2",
    "Détail · Voir l'étatVPN → IPsec → Status Overview : le tunnel doit être Establis#2",
    "VPN → IPsec → Status Overview.#2",
    "Repère la connexion : état « Established » pour la phase 1 et pour l'enfant.#2",
    "Clique sur les détails pour voir les octets échangés.#2",
    "Détail · Un ping réel de LAN à LANUn tunnel « établi » ne prouve rien : depuis u#2",
    "Reviens à Paris et teste Bruxelles.#2",
    "Détail · En cas d'échecVPN → IPsec → Log File. Phase 1 qui échoue : clé, identif#2",
    "VPN → IPsec → Log File : lis les dernières lignes au moment de la tentative.#2",
    "Phase 1 qui échoue : clé, identifiants, adresse distante, algorithmes.#2",
    "Phase 2 qui échoue : réseaux local et distant inversés ou différents entre les d#2",
    "Établi mais rien ne passe : règle manquante sur l'interface IPsec, ou sur le WAN#2",
    "Détail · Lire les journauxFirewall → Log Files → Live View : un blocage inattend#2",
    "Firewall → Log Files → Live View.#2",
    "Filtre sur l'IP source du test.#2",
    "Repère la ligne bloquée : la règle responsable est affichée.#2",
    "Relever la carte réseau physique de l'hôteGet-NetAdapter : repère le nom de la c#3",
    "Ouvre PowerShell en administrateur sur l'hôte Hyper-V.#3",
    "Lance Get-NetAdapter : la liste donne Name, InterfaceDescription, Status et Link#3",
    "Repère la ligne Status = Up dont l'adresse est dans le réseau de la salle (Get-N#3",
    "Créer le commutateur externeHyper-V Manager → Virtual Switch Manager → External,#3",
    "Hyper-V Manager → Virtual Switch Manager… (panneau Actions à droite).#3",
    "À gauche, New virtual network switch → External → Create Virtual Switch.#3",
    "Garde cochée « Allow management operating system to share this network adapter »#3",
    "OK. Une coupure réseau de quelques secondes est normale pendant la création.#3",
    "Créer le commutateur privé du siteUn commutateur privé n'est relié ni à l'hôte n#3",
    "Virtual Switch Manager → New virtual network switch → Private → Create Virtual S#3",
    "OK.#5",
    "Laisser l'hôte joignable-AllowManagementOS $true garde l'accès réseau de l'hôte #3",
    "Dans la fenêtre de création du commutateur externe, ne décoche pas « Allow manag#3",
    "Après création, vérifie qu'une carte virtuelle « vEthernet (WAN) » apparaît dans#3",
    "Lister les commutateursAttendu : WAN (External) et LAN-xxx (Private).#3",
    "PowerShell sur l'hôte : Get-VMSwitch | Format-Table Name, SwitchType.#3",
    "Compare avec l'attendu : WAN en External, LAN-xxx en Private.#3",
    "Tester l'accès à la salleDepuis l'hôte : ping 10.10.28.254 doit répondre.#3",
    "Sur l'hôte, PowerShell : ping 10.10.28.254 (la passerelle de la salle).#3",
    "Puis le WAN d'un autre site : ping 10.10.28.111 (BRU), .112 (PAR), etc., quand c#3",
    "OK.#6",
    "Détail · Deux cartes réseauCarte 1 sur LAN-xxx du site (commutateur privé), cart#3",
    "Crée la VM (génération 2), puis dans Settings regarde Network Adapter : la carte#3",
    "Branche cette première carte sur LAN-xxx de ton site (commutateur privé).#3",
    "Add Hardware → Network Adapter → Add, et branche cette deuxième carte sur le com#3",
    "Pas de VLAN, pas de mémoire dynamique.#3",
    "Détail · DimensionnerGénération 2 · 2 vCPU · 2 Go de RAM fixe · 20 Go de disque.#3",
    "Settings → Processor : 2 vCPU.#3",
    "Settings → Security : décoche Enable Secure Boot.#3",
    "Détail · Noter les valeurs du siteWAN de chaque pare-feu : 10.10.28.111 à .114 (#3",
    "Regarde la page Infrastructure et le tableau « Plan IP » : WAN, LAN, passerelle #3",
    "Recopie : WAN 10.10.28.111 à .114 (BRU, PAR, LON, BER), passerelle de la salle 1#3",
    "Détail · Les tunnels et leurs adressesTunnelTrafic chiffré (child)WAN hub (BRU)W#3",
    "Regarde le tableau des tunnels ci-dessus : chaque tunnel relie le WAN du hub (10#3",
    "Sur Bruxelles (hub), les trois tunnels : BRU-PAR (vers 10.10.28.112), BRU-LON (.#3",
    "Chaque tunnel transporte le LAN du spoke vers les trois autres LAN (colonne « Tr#3",
    "Choisis les algorithmes : IKEv2, AES-256, SHA-256, groupe DH 14 (ou supérieur). #3",
    "Identifiants : l'adresse IP WAN de chaque pare-feu.#3",
    "Détail · Rappeler la logique en deux phasesPhase 1 : les deux pare-feu s'identif#3",
    "Phase 1 (IKE) : les deux pare-feu se reconnaissent (clé) et créent un canal sécu#3",
    "Phase 2 (CHILD SA) : sur ce canal, ils négocient quels réseaux passent (LAN loca#3",
    "Détail · Lire la matrice de fluxChaque ligne ci-dessous est un flux à autoriser,#3",
    "Ouvre le tableau des 28 flux : chaque ligne indique la source, la destination, l#3",
    "Repère les flux qui concernent ton site.#3",
    "Détail · Créer des aliasFirewall → Aliases : un alias par groupe (DC, LAN_ALL, D#3",
    "Firewall → Aliases → Add.#3",
    "Nom DC, type Host(s), contenu 172.17.10.10, 172.17.20.10.#3",
    "Nom LAN_ALL, type Network(s), contenu les quatre LAN.#3",
    "Détail · Installer depuis l'ISODémarrer sur l'ISO d'OPNsense (image dvd). Se con#3",
    "Monte l'ISO OPNsense (image dvd) sur la VM et démarre.#3",
    "À l'écran de connexion de l'installeur : identifiant installer, mot de passe opn#3",
    "Choisis le clavier, puis Install (UFS) ou ZFS (UFS suffit pour le labo), sélecti#3",
    "Définis le mot de passe de root à la fin de l'installation (note-le dans Infos.m#3",
    "À la fin, choisis Halt now (pas Reboot). VM éteinte : retire l'ISO (Settings → D#3",
    "Détail · Attribuer les interfacesÀ la console : Assign interfaces, confirmer que#3",
    "Dans le menu de la console, tape 1 (Assign interfaces).#3",
    "« Do you want to configure LAGGs / VLANs now ? » : n.#3",
    "WAN : saisis le nom de la deuxième interface (hn1) ; LAN : la première (hn0) ; p#3",
    "Confirme avec y.#3",
    "Menu 2 (Set interface IP address) : choisis le LAN, « Configure IPv4 via DHCP ? #3",
    "Refais le menu 2 pour le WAN : IPv4 manuel, adresse du tableau (10.10.28.11x), m#3",
    "Détail · Tunnel Bruxelles ↔ Paris d'abordSur BRU-FW01 : VPN → IPsec → Connection#3",
    "Sur BRU-FW01 : VPN → IPsec → Connections → Add.#3",
    "Version IKEv2, Local addresses = 10.10.28.111, Remote addresses = 10.10.28.112, #3",
    "Local Authentication : Pre-Shared Key, identifiant = IP locale. Remote Authentic#3",
    "Dans VPN → IPsec → Pre-Shared Keys, ajoute la clé : Local Identifier et Remote I#3",
    "Active la connexion, Apply.#3",
    "Détail · Ajouter l'enfant (phase 2)Dans la connexion : Children → mode tunnel, r#3",
    "Dans la connexion, onglet Children → Add.#3",
    "Mode Tunnel, Local network = 172.17.10.0/24, Remote network = 172.17.20.0/24 (po#3",
    "Proposals de chiffrement identiques à l'autre côté. Save, puis Apply.#3",
    "Détail · Faire la même chose sur PAR-FW01, à l'enversLocal = Paris (10.10.28.112#3",
    "Sur PAR-FW01 : même procédure, mais Local = 10.10.28.112 et réseau local 172.17.#3",
    "Même clé, mêmes algorithmes, mêmes identifiants (inversés).#3",
    "Active et applique.#3",
    "Détail · Tunnel Bruxelles ↔ Londres puis ↔ BerlinSeulement quand le premier est #3",
    "Une fois le premier tunnel validé par un ping de LAN à LAN, reprends exactement #3",
    "Sur BRU-FW01, chaque spoke est une connexion séparée avec son propre enfant et s#3",
    "Teste chaque tunnel avant de passer au suivant.#3",
    "Détail · Écrire les règles flux par fluxFirewall → Rules → IPsec (trafic venant #3",
    "Firewall → Rules → IPsec pour le trafic venant des autres sites, LAN pour le tra#3",
    "Pour chaque ligne de la matrice : Pass, protocole, source (alias), destination (#3",
    "Save, puis Apply à la fin.#3",
    "Détail · Premier accès webDepuis une VM du LAN : https://172.17.x.1 (certificat #3",
    "Accepte l'avertissement de certificat (certificat auto-signé).#3",
    "Connecte-toi : root et le mot de passe choisi à l'installation.#3",
    "Détail · Laisser entrer le réseau de la salleInterfaces → WAN : décocher « Block#3",
    "Menu Interfaces → WAN.#3",
    "Descends à « Generic configuration ».#3",
    "Décoche Block private networks. Laisse Block bogon networks coché.#3",
    "Save, puis Apply changes.#3",
    "Détail · Désactiver reply-toFirewall → Settings → Advanced : cocher Disable repl#3",
    "Menu Firewall → Settings → Advanced.#3",
    "Coche Disable reply-to (« Disable reply-to on WAN rules »).#3",
    "Save.#3",
    "Détail · Intégration Hyper-V (déjà incluse)Rien à installer : les services d'int#3",
    "Sur l'hôte, contrôle les services d'intégration de la VM : Get-VMIntegrationServ#3",
    "Détail · Autoriser le trafic dans le tunnelFirewall → Rules → IPsec : règle d'au#3",
    "Firewall → Rules → IPsec (onglet qui apparaît quand IPsec est activé).#3",
    "Save, Apply.#3",
    "Détail · Autoriser le tunnel lui-même sur le WANFirewall → Rules → WAN : UDP 500#3",
    "Firewall → Rules → WAN → Add.#3",
    "Règle Pass, protocole UDP, source = l'IP WAN du pare-feu distant, destination = #3",
    "Ajoute une règle protocole ESP pour la même source.#3",
    "Détail · Passage par le hubParis ↔ Londres passe par Bruxelles : sur chaque spok#3",
    "Sur chaque spoke, dans l'enfant du tunnel vers Bruxelles : réseau local = son LA#3",
    "Sur le hub, dans l'enfant de chaque spoke : réseau local = les LAN des trois aut#3",
    "Sur le hub, ajoute une règle Firewall → Rules → IPsec de « tous les LAN » vers «#3",
    "Détail · Ouvrir le port du failover DHCPEntre les deux serveurs DHCP, le failove#3",
    "Règle sur l'interface IPsec : TCP 647 entre 172.17.10.10 et 172.17.20.10 (dans l#3",
    "Détail · Le pare-feu atteint la salleInterfaces → Diagnostics → Ping vers 10.10.#3",
    "Interfaces → Diagnostics → Ping (ou menu console 7).#3",
    "Hôte : 10.10.28.254, source WAN. Ping.#3",
    "Détail · Voir l'étatVPN → IPsec → Status Overview : le tunnel doit être Establis#3",
    "VPN → IPsec → Status Overview.#3",
    "Repère la connexion : état « Established » pour la phase 1 et pour l'enfant.#3",
    "Clique sur les détails pour voir les octets échangés.#3",
    "Détail · Un ping réel de LAN à LANUn tunnel « établi » ne prouve rien : depuis u#3",
    "Reviens à Paris et teste Bruxelles.#3",
    "Détail · En cas d'échecVPN → IPsec → Log File. Phase 1 qui échoue : clé, identif#3",
    "VPN → IPsec → Log File : lis les dernières lignes au moment de la tentative.#3",
    "Phase 1 qui échoue : clé, identifiants, adresse distante, algorithmes.#3",
    "Phase 2 qui échoue : réseaux local et distant inversés ou différents entre les d#3",
    "Établi mais rien ne passe : règle manquante sur l'interface IPsec, ou sur le WAN#3",
    "Détail · Lire les journauxFirewall → Log Files → Live View : un blocage inattend#3",
    "Firewall → Log Files → Live View.#3",
    "Filtre sur l'IP source du test.#3",
    "Repère la ligne bloquée : la règle responsable est affichée.#3",
    "Détail · Docker est installé sur la VMVoir Préparer, section 5. docker compose v#2",
    "Connecte-toi en SSH à la VM Docker.#2",
    "docker --version et docker compose version.#2",
    "Si la commande est absente : retourne à la page Préparer, section « Créer les VM#2",
    "Détail · Variables du .envVariableRôleComment la choisirMYSQL_DATABASEBase de Re",
    "Détail · Nom DNSAlias helpdesk (CNAME) vers lon-docker01.eurocorp.lan, ou enregi",
    "Sur un contrôleur de domaine : Add-DnsServerResourceRecordA -ZoneName eurocorp.l#2",
    "Pour un alias : Add-DnsServerResourceRecordCName vers le nom de la VM.#2",
    "Détail · Protéger le .envGit ne conserve pas ce droit : à refaire après chaque g#2",
    "sudo chmod 600 .env : lecture et écriture pour le propriétaire seulement.#2",
    "Vérifie : ls -l .env affiche -rw-------.#2",
    "Détail · Le compose (Redmine + MariaDB + nginx)Trois services sur le réseau redm",
    "Copie 05-Docker/redmine/docker-compose.yml dans ~/redmine/.",
    "Lis-le : trois services sur le réseau redmine-network — db (MariaDB), redmine (s",
    "Vérifie les volumes nommés : base et pièces jointes.",
    "Détail · Certificat auto-signé pour nginxLe navigateur ne fait pas confiance à u",
    "Génère la clé privée : openssl genrsa -out nginx/certs/redmine.key 4096.",
    "Crée le certificat avec le bloc ci-dessous (openssl req -x509 …) : nom helpdesk.",
    "Vérifie : openssl x509 -in nginx/certs/redmine.crt -noout -subject -dates.",
    "Détail · Configuration de nginx",
    "Crée nginx/conf.d/redmine.conf avec le contenu ci-dessous.",
    "Le premier bloc renvoie le HTTP vers HTTPS (301) ; le second écoute en 443, prés",
    "client_max_body_size 100M autorise les grosses pièces jointes.",
    "Détail · DémarrerAu premier démarrage, un « Can't connect to server on 'db' » es",
    "sudo chmod 600 .env.",
    "sudo docker compose config | grep -i password : aucune valeur vide.",
    "sudo docker compose up -d puis sudo docker ps.",
    "Détail · Première connexionhttps://helpdesk.eurocorp.lan → Sign in avec le compt",
    "Ouvre l'URL du service dans un navigateur.#2",
    "Connecte-toi avec le compte par défaut de l'application (indiqué dans l'étape).#2",
    "Change tout de suite le mot de passe et note-le dans Infos.md.#2",
    "Détail · Activer l'APIAdministration → Settings → Integration : REST web service",
    "Connecté en administrateur : Administration → Settings → API (ou Integration sel",
    "Coche Enable REST web service ; Save.",
    "La clé API personnelle est dans My account → API access key.",
    "Crée dans l'AD un compte de service dédié, simple utilisateur (lecture de l'annu",
    "Redmine : Administration → LDAP authentication → New, remplis le tableau ci-dess",
    "Coche On-the-fly user creation.",
    "curl -kI https://helpdesk.eurocorp.lan : HTTP/1.1 200 ou 302.",
    "Relever la carte réseau physique de l'hôteGet-NetAdapter : repère le nom de la c#4",
    "Ouvre PowerShell en administrateur sur l'hôte Hyper-V.#4",
    "Lance Get-NetAdapter : la liste donne Name, InterfaceDescription, Status et Link#4",
    "Repère la ligne Status = Up dont l'adresse est dans le réseau de la salle (Get-N#4",
    "Créer le commutateur externeHyper-V Manager → Virtual Switch Manager → External,#4",
    "Hyper-V Manager → Virtual Switch Manager… (panneau Actions à droite).#4",
    "À gauche, New virtual network switch → External → Create Virtual Switch.#4",
    "Garde cochée « Allow management operating system to share this network adapter »#4",
    "OK. Une coupure réseau de quelques secondes est normale pendant la création.#4",
    "Créer le commutateur privé du siteUn commutateur privé n'est relié ni à l'hôte n#4",
    "Virtual Switch Manager → New virtual network switch → Private → Create Virtual S#4",
    "OK.#7",
    "Laisser l'hôte joignable-AllowManagementOS $true garde l'accès réseau de l'hôte #4",
    "Dans la fenêtre de création du commutateur externe, ne décoche pas « Allow manag#4",
    "Après création, vérifie qu'une carte virtuelle « vEthernet (WAN) » apparaît dans#4",
    "Lister les commutateursAttendu : WAN (External) et LAN-xxx (Private).#4",
    "PowerShell sur l'hôte : Get-VMSwitch | Format-Table Name, SwitchType.#4",
    "Compare avec l'attendu : WAN en External, LAN-xxx en Private.#4",
    "Tester l'accès à la salleDepuis l'hôte : ping 10.10.28.254 doit répondre.#4",
    "Sur l'hôte, PowerShell : ping 10.10.28.254 (la passerelle de la salle).#4",
    "Puis le WAN d'un autre site : ping 10.10.28.111 (BRU), .112 (PAR), etc., quand c#4",
    "OK.#8",
    "Détail · Deux cartes réseauCarte 1 sur LAN-xxx du site (commutateur privé), cart#4",
    "Crée la VM (génération 2), puis dans Settings regarde Network Adapter : la carte#4",
    "Branche cette première carte sur LAN-xxx de ton site (commutateur privé).#4",
    "Add Hardware → Network Adapter → Add, et branche cette deuxième carte sur le com#4",
    "Pas de VLAN, pas de mémoire dynamique.#4",
    "Détail · DimensionnerGénération 2 · 2 vCPU · 2 Go de RAM fixe · 20 Go de disque.#4",
    "Settings → Processor : 2 vCPU.#4",
    "Settings → Security : décoche Enable Secure Boot.#4",
    "Détail · Noter les valeurs du siteWAN de chaque pare-feu : 10.10.28.111 à .114 (#4",
    "Regarde la page Infrastructure et le tableau « Plan IP » : WAN, LAN, passerelle #4",
    "Recopie : WAN 10.10.28.111 à .114 (BRU, PAR, LON, BER), passerelle de la salle 1#4",
    "Détail · Les tunnels et leurs adressesTunnelTrafic chiffré (child)WAN hub (BRU)W#4",
    "Regarde le tableau des tunnels ci-dessus : chaque tunnel relie le WAN du hub (10#4",
    "Sur Bruxelles (hub), les trois tunnels : BRU-PAR (vers 10.10.28.112), BRU-LON (.#4",
    "Chaque tunnel transporte le LAN du spoke vers les trois autres LAN (colonne « Tr#4",
    "Choisis les algorithmes : IKEv2, AES-256, SHA-256, groupe DH 14 (ou supérieur). #4",
    "Identifiants : l'adresse IP WAN de chaque pare-feu.#4",
    "Détail · Rappeler la logique en deux phasesPhase 1 : les deux pare-feu s'identif#4",
    "Phase 1 (IKE) : les deux pare-feu se reconnaissent (clé) et créent un canal sécu#4",
    "Phase 2 (CHILD SA) : sur ce canal, ils négocient quels réseaux passent (LAN loca#4",
    "Détail · Lire la matrice de fluxChaque ligne ci-dessous est un flux à autoriser,#4",
    "Ouvre le tableau des 28 flux : chaque ligne indique la source, la destination, l#4",
    "Repère les flux qui concernent ton site.#4",
    "Détail · Créer des aliasFirewall → Aliases : un alias par groupe (DC, LAN_ALL, D#4",
    "Firewall → Aliases → Add.#4",
    "Nom DC, type Host(s), contenu 172.17.10.10, 172.17.20.10.#4",
    "Nom LAN_ALL, type Network(s), contenu les quatre LAN.#4",
    "Détail · Installer depuis l'ISODémarrer sur l'ISO d'OPNsense (image dvd). Se con#4",
    "Monte l'ISO OPNsense (image dvd) sur la VM et démarre.#4",
    "À l'écran de connexion de l'installeur : identifiant installer, mot de passe opn#4",
    "Choisis le clavier, puis Install (UFS) ou ZFS (UFS suffit pour le labo), sélecti#4",
    "Définis le mot de passe de root à la fin de l'installation (note-le dans Infos.m#4",
    "À la fin, choisis Halt now (pas Reboot). VM éteinte : retire l'ISO (Settings → D#4",
    "Détail · Attribuer les interfacesÀ la console : Assign interfaces, confirmer que#4",
    "Dans le menu de la console, tape 1 (Assign interfaces).#4",
    "« Do you want to configure LAGGs / VLANs now ? » : n.#4",
    "WAN : saisis le nom de la deuxième interface (hn1) ; LAN : la première (hn0) ; p#4",
    "Confirme avec y.#4",
    "Menu 2 (Set interface IP address) : choisis le LAN, « Configure IPv4 via DHCP ? #4",
    "Refais le menu 2 pour le WAN : IPv4 manuel, adresse du tableau (10.10.28.11x), m#4",
    "Détail · Tunnel Bruxelles ↔ Paris d'abordSur BRU-FW01 : VPN → IPsec → Connection#4",
    "Sur BRU-FW01 : VPN → IPsec → Connections → Add.#4",
    "Version IKEv2, Local addresses = 10.10.28.111, Remote addresses = 10.10.28.112, #4",
    "Local Authentication : Pre-Shared Key, identifiant = IP locale. Remote Authentic#4",
    "Dans VPN → IPsec → Pre-Shared Keys, ajoute la clé : Local Identifier et Remote I#4",
    "Active la connexion, Apply.#4",
    "Détail · Ajouter l'enfant (phase 2)Dans la connexion : Children → mode tunnel, r#4",
    "Dans la connexion, onglet Children → Add.#4",
    "Mode Tunnel, Local network = 172.17.10.0/24, Remote network = 172.17.20.0/24 (po#4",
    "Proposals de chiffrement identiques à l'autre côté. Save, puis Apply.#4",
    "Détail · Faire la même chose sur PAR-FW01, à l'enversLocal = Paris (10.10.28.112#4",
    "Sur PAR-FW01 : même procédure, mais Local = 10.10.28.112 et réseau local 172.17.#4",
    "Même clé, mêmes algorithmes, mêmes identifiants (inversés).#4",
    "Active et applique.#4",
    "Détail · Tunnel Bruxelles ↔ Londres puis ↔ BerlinSeulement quand le premier est #4",
    "Une fois le premier tunnel validé par un ping de LAN à LAN, reprends exactement #4",
    "Sur BRU-FW01, chaque spoke est une connexion séparée avec son propre enfant et s#4",
    "Teste chaque tunnel avant de passer au suivant.#4",
    "Détail · Écrire les règles flux par fluxFirewall → Rules → IPsec (trafic venant #4",
    "Firewall → Rules → IPsec pour le trafic venant des autres sites, LAN pour le tra#4",
    "Pour chaque ligne de la matrice : Pass, protocole, source (alias), destination (#4",
    "Save, puis Apply à la fin.#4",
    "Détail · Premier accès webDepuis une VM du LAN : https://172.17.x.1 (certificat #4",
    "Accepte l'avertissement de certificat (certificat auto-signé).#4",
    "Connecte-toi : root et le mot de passe choisi à l'installation.#4",
    "Détail · Laisser entrer le réseau de la salleInterfaces → WAN : décocher « Block#4",
    "Menu Interfaces → WAN.#4",
    "Descends à « Generic configuration ».#4",
    "Décoche Block private networks. Laisse Block bogon networks coché.#4",
    "Save, puis Apply changes.#4",
    "Détail · Désactiver reply-toFirewall → Settings → Advanced : cocher Disable repl#4",
    "Menu Firewall → Settings → Advanced.#4",
    "Coche Disable reply-to (« Disable reply-to on WAN rules »).#4",
    "Save.#4",
    "Détail · Intégration Hyper-V (déjà incluse)Rien à installer : les services d'int#4",
    "Sur l'hôte, contrôle les services d'intégration de la VM : Get-VMIntegrationServ#4",
    "Détail · Autoriser le trafic dans le tunnelFirewall → Rules → IPsec : règle d'au#4",
    "Firewall → Rules → IPsec (onglet qui apparaît quand IPsec est activé).#4",
    "Save, Apply.#4",
    "Détail · Autoriser le tunnel lui-même sur le WANFirewall → Rules → WAN : UDP 500#4",
    "Firewall → Rules → WAN → Add.#4",
    "Règle Pass, protocole UDP, source = l'IP WAN du pare-feu distant, destination = #4",
    "Ajoute une règle protocole ESP pour la même source.#4",
    "Détail · Passage par le hubParis ↔ Londres passe par Bruxelles : sur chaque spok#4",
    "Sur chaque spoke, dans l'enfant du tunnel vers Bruxelles : réseau local = son LA#4",
    "Sur le hub, dans l'enfant de chaque spoke : réseau local = les LAN des trois aut#4",
    "Sur le hub, ajoute une règle Firewall → Rules → IPsec de « tous les LAN » vers «#4",
    "Détail · Ouvrir le port du failover DHCPEntre les deux serveurs DHCP, le failove#4",
    "Règle sur l'interface IPsec : TCP 647 entre 172.17.10.10 et 172.17.20.10 (dans l#4",
    "Détail · Le pare-feu atteint la salleInterfaces → Diagnostics → Ping vers 10.10.#4",
    "Interfaces → Diagnostics → Ping (ou menu console 7).#4",
    "Hôte : 10.10.28.254, source WAN. Ping.#4",
    "Détail · Voir l'étatVPN → IPsec → Status Overview : le tunnel doit être Establis#4",
    "VPN → IPsec → Status Overview.#4",
    "Repère la connexion : état « Established » pour la phase 1 et pour l'enfant.#4",
    "Clique sur les détails pour voir les octets échangés.#4",
    "Détail · Un ping réel de LAN à LANUn tunnel « établi » ne prouve rien : depuis u#4",
    "Reviens à Paris et teste Bruxelles.#4",
    "Détail · En cas d'échecVPN → IPsec → Log File. Phase 1 qui échoue : clé, identif#4",
    "VPN → IPsec → Log File : lis les dernières lignes au moment de la tentative.#4",
    "Phase 1 qui échoue : clé, identifiants, adresse distante, algorithmes.#4",
    "Phase 2 qui échoue : réseaux local et distant inversés ou différents entre les d#4",
    "Établi mais rien ne passe : règle manquante sur l'interface IPsec, ou sur le WAN#4",
    "Détail · Lire les journauxFirewall → Log Files → Live View : un blocage inattend#4",
    "Firewall → Log Files → Live View.#4",
    "Filtre sur l'IP source du test.#4",
    "Repère la ligne bloquée : la règle responsable est affichée.#4",
    "Créer la VM Ubuntu Server 24.04Comment. Hyper-V → New VM : génération 2, 4 Go fi#2",
    "IP fixe sous UbuntuComment. Éditer le fichier de /etc/netplan/ :network: version#2",
    "Enregistrement DNS de la machineComment. Sur un DC : DNS Manager → zone eurocorp#2",
    "Installer Docker et le plugin ComposeComment. Ajouter le dépôt officiel Docker, #2",
    "Détail · Démarrer et contrôlerTout doit être « Up ». Un conteneur qui redémarre #2",
    "docker compose up -d : crée et démarre les conteneurs en arrière-plan.#2",
    "docker compose ps : tous doivent être « Up » (ou « healthy » quand un contrôle d#2",
    "Installer AD DS et DNS, créer la forêtComment. Server Manager → Add roles → Acti"
   ]
  },
  "identite.html": {
   "total": 146,
   "faits": [
    "Attribue l'adresse du plan : New-NetIPAddress -InterfaceAlias \"Ethernet\" -IPAddr",
    "Choisir le nomeurocorp.lan (NetBIOS EUROCORP). Déjà créé le jour 1 ; la suite se",
    "Domaine DNS : eurocorp.lan. Nom NetBIOS : EUROCORP.",
    "Installer le rôle et créer la forêtLe mot de passe de restauration (DSRM) est de",
    "Installe les rôles : Install-WindowsFeature AD-Domain-Services, DNS -IncludeMana",
    "Promeus : Install-ADDSForest -DomainName \"eurocorp.lan\" -DomainNetbiosName \"EURO",
    "Saisis le mot de passe DSRM (mode de restauration des services d'annuaire) quand",
    "La machine redémarre seule : reconnecte-toi avec EUROCORP\\Administrator."
   ]
  }
 },
 "enonce": {
  "source": "Labo final ASOV — document étudiant, version 2026 (labo-microsoft/ressources/00_Labo-Final-ASOV.pdf)",
  "regles": [
   {
    "ref": "§4.1",
    "cibles": [
     "site:BRU"
    ],
    "champ": "wan",
    "egal": "10.10.28.111",
    "texte": "WAN de Bruxelles attribué au groupe 2"
   },
   {
    "ref": "§4.1",
    "cibles": [
     "site:PAR"
    ],
    "champ": "wan",
    "egal": "10.10.28.112",
    "texte": "WAN de Paris attribué au groupe 2"
   },
   {
    "ref": "§4.1",
    "cibles": [
     "site:LON"
    ],
    "champ": "wan",
    "egal": "10.10.28.113",
    "texte": "WAN de Londres attribué au groupe 2"
   },
   {
    "ref": "§4.1",
    "cibles": [
     "site:BER"
    ],
    "champ": "wan",
    "egal": "10.10.28.114",
    "texte": "WAN de Berlin attribué au groupe 2"
   },
   {
    "ref": "§4.2",
    "cibles": [
     "site:*"
    ],
    "champ": "lan",
    "dans": "172.17.0.0/16",
    "texte": "Plage réservée au groupe 2 : 172.17.0.0/16"
   },
   {
    "ref": "§4.2",
    "cibles": [
     "site:BRU"
    ],
    "champ": "lan",
    "egal": "172.17.10.0/24",
    "niveau": "exemple",
    "texte": "Exemple de découpage de l'énoncé : Bruxelles 172.17.10.0/24"
   },
   {
    "ref": "§4.2",
    "cibles": [
     "site:PAR"
    ],
    "champ": "lan",
    "egal": "172.17.20.0/24",
    "niveau": "exemple",
    "texte": "Exemple de découpage de l'énoncé : Paris 172.17.20.0/24"
   },
   {
    "ref": "§4.2",
    "cibles": [
     "site:LON"
    ],
    "champ": "lan",
    "egal": "172.17.30.0/24",
    "niveau": "exemple",
    "texte": "Exemple de découpage de l'énoncé : Londres 172.17.30.0/24"
   },
   {
    "ref": "§4.2",
    "cibles": [
     "site:BER"
    ],
    "champ": "lan",
    "egal": "172.17.40.0/24",
    "niveau": "exemple",
    "texte": "Exemple de découpage de l'énoncé : Berlin 172.17.40.0/24"
   },
   {
    "ref": "§4.2",
    "cibles": [
     "vm:*"
    ],
    "champ": "ip",
    "dans": "172.17.0.0/16",
    "texte": "Adresses internes dans la plage du groupe 2 (172.17.0.0/16)"
   },
   {
    "ref": "§3.1",
    "cibles": [
     "vm:*"
    ],
    "champ": "ip",
    "horsde": "10.10.28.0/24",
    "texte": "Aucun serveur métier sur le réseau de salle 10.10.28.0/24"
   },
   {
    "ref": "§6.3",
    "cibles": [
     "vm:BRU-EXCH01"
    ],
    "champ": "ram",
    "min": 16,
    "texte": "Exchange : 16 Go de RAM, serveur Windows Server 2025 dédié à Bruxelles"
   },
   {
    "ref": "§1, §5.1",
    "cibles": [
     "vm:BRU-DC01",
     "vm:PAR-DC01",
     "vm:BRU-IIS01",
     "vm:BRU-IIS02",
     "vm:BRU-EXCH01",
     "vm:PAR-SQL01",
     "vm:PAR-SP01",
     "vm:LON-FS01"
    ],
    "champ": "os",
    "contient": "Windows Server 2025",
    "texte": "Serveurs Windows en Windows Server 2025 (forêt et niveau fonctionnel 2025)"
   },
   {
    "ref": "§8",
    "cibles": [
     "vm:BRU-DOCKER01"
    ],
    "champ": "nom",
    "egal": "BRU-DOCKER01",
    "texte": "VM Docker imposée : Zabbix Server + frontend + base"
   },
   {
    "ref": "§8",
    "cibles": [
     "vm:LON-DOCKER01"
    ],
    "champ": "nom",
    "egal": "LON-DOCKER01",
    "texte": "VM Docker imposée : Redmine + base"
   },
   {
    "ref": "§8",
    "cibles": [
     "vm:BER-DOCKER01"
    ],
    "champ": "nom",
    "egal": "BER-DOCKER01",
    "texte": "VM Docker imposée : pile Wazuh"
   },
   {
    "ref": "§8",
    "cibles": [
     "vm:BER-DOCKER02"
    ],
    "champ": "nom",
    "egal": "BER-DOCKER02",
    "texte": "VM Docker imposée : Greenbone Community Edition"
   },
   {
    "ref": "§8",
    "cibles": [
     "vm:BRU-DOCKER01",
     "vm:LON-DOCKER01",
     "vm:BER-DOCKER01",
     "vm:BER-DOCKER02"
    ],
    "champ": "os",
    "contient": "24.04",
    "niveau": "recommandé",
    "texte": "Ubuntu Server 24.04 LTS recommandé pour les hôtes Docker"
   },
   {
    "ref": "§2",
    "cibles": [
     "site:*"
    ],
    "champ": "ram_total",
    "max": 64,
    "texte": "Chaque hôte Hyper-V a 64 Go de RAM"
   },
   {
    "ref": "§2",
    "cibles": [
     "site:*"
    ],
    "champ": "disque_total",
    "max": 1000,
    "niveau": "indicatif",
    "texte": "Chaque hôte a environ 1 To de SSD (VHDX dynamiques recommandés)"
   }
  ],
  "imposes": [
   {
    "ref": "§5.1",
    "texte": "Au moins deux contrôleurs de domaine : un à Bruxelles, un à Paris",
    "vms": [
     "BRU-DC01",
     "PAR-DC01"
    ]
   },
   {
    "ref": "§6.1",
    "texte": "File Server à Londres (Direction, RH, Finance, IT, Commun ; AGDLP)",
    "vms": [
     "LON-FS01"
    ]
   },
   {
    "ref": "§6.2",
    "texte": "Deux serveurs IIS distincts à Bruxelles derrière une adresse virtuelle NLB",
    "vms": [
     "BRU-IIS01",
     "BRU-IIS02",
     "(VIP NLB)"
    ]
   },
   {
    "ref": "§6.3",
    "texte": "Exchange Server SE sur un serveur dédié à Bruxelles",
    "vms": [
     "BRU-EXCH01"
    ]
   },
   {
    "ref": "§7",
    "texte": "SharePoint SE et une instance SQL Server dédiée, à Paris (deux serveurs dédiés)",
    "vms": [
     "PAR-SP01",
     "PAR-SQL01"
    ]
   },
   {
    "ref": "§8",
    "texte": "Zabbix sur BRU-DOCKER01, Redmine sur LON-DOCKER01, Wazuh sur BER-DOCKER01, Greenbone sur BER-DOCKER02",
    "vms": [
     "BRU-DOCKER01",
     "LON-DOCKER01",
     "BER-DOCKER01",
     "BER-DOCKER02"
    ]
   },
   {
    "ref": "§4.3",
    "texte": "Un OPNsense par site ; Bruxelles est le hub des tunnels IPsec",
    "vms": [
     "BRU-FW01",
     "PAR-FW01",
     "LON-FW01",
     "BER-FW01"
    ]
   },
   {
    "ref": "§10.2",
    "texte": "Hyper-V Replica d'au moins une VM critique : le File Server de Londres vers Paris ou Bruxelles",
    "vms": [
     "LON-FS01"
    ]
   }
  ]
 },
 "tests": [
  {
   "id": "T01",
   "test": "Ping LAN à LAN BRU-PAR",
   "action": "`ping 172.17.20.1` depuis un serveur du LAN de Bruxelles",
   "attendu": "réponse",
   "ref": "§4.3",
   "resultat": {
    "statut": "ok",
    "obtenu": "réponse — ping LAN ↔ LAN validé dans tous les sens",
    "date": "2026-10-29",
    "par": "relevé du 29/10"
   }
  },
  {
   "id": "T02",
   "test": "Ping LAN à LAN BRU-LON",
   "action": "`ping 172.17.30.1` depuis Bruxelles",
   "attendu": "réponse",
   "ref": "§4.3",
   "resultat": {
    "statut": "ok",
    "obtenu": "réponse — ping LAN ↔ LAN validé dans tous les sens",
    "date": "2026-10-29",
    "par": "relevé du 29/10"
   }
  },
  {
   "id": "T03",
   "test": "Ping LAN à LAN BRU-BER",
   "action": "`ping 172.17.40.1` depuis Bruxelles",
   "attendu": "réponse",
   "ref": "§4.3",
   "resultat": {
    "statut": "ok",
    "obtenu": "réponse — ping LAN ↔ LAN validé dans tous les sens",
    "date": "2026-10-29",
    "par": "relevé du 29/10"
   }
  },
  {
   "id": "T04",
   "test": "Paris vers Londres (par Bruxelles)",
   "action": "`ping 172.17.30.1` depuis Paris",
   "attendu": "réponse",
   "ref": "§4.3",
   "resultat": {
    "statut": "ok",
    "obtenu": "réponse — transit Paris ↔ Londres ↔ Berlin par Bruxelles validé",
    "date": "2026-10-29",
    "par": "relevé du 29/10"
   }
  },
  {
   "id": "T05",
   "test": "Flux autorisé",
   "action": "`Test-NetConnection <cible> -Port 389` (flux F04)",
   "attendu": "`TcpTestSucceeded : True`",
   "ref": "§4.3"
  },
  {
   "id": "T06",
   "test": "Flux bloqué",
   "action": "un port hors matrice",
   "attendu": "`False`",
   "ref": "§4.3"
  },
  {
   "id": "T07",
   "test": "DNS",
   "action": "`nslookup bru-dc01.eurocorp.lan` depuis chaque site",
   "attendu": "l'IP du serveur",
   "ref": "§5.2"
  },
  {
   "id": "T08",
   "test": "Réplication AD",
   "action": "`Test-EuroCorpAD.ps1`",
   "attendu": "aucune anomalie",
   "ref": "§5.1"
  },
  {
   "id": "T09",
   "test": "DHCP",
   "action": "un client sans IP fixe obtient une adresse de .100–.199",
   "attendu": "adresse reçue",
   "ref": "§5.3"
  },
  {
   "id": "T10",
   "test": "Failover DHCP",
   "action": "arrêter le DHCP principal, renouveler le bail d'un client",
   "attendu": "adresse reçue du partenaire",
   "ref": "§5.3"
  },
  {
   "id": "T11",
   "test": "Partage de fichiers",
   "action": "accès à un partage selon le groupe de l'utilisateur",
   "attendu": "accès conforme aux droits",
   "ref": "§6.1"
  },
  {
   "id": "T12",
   "test": "Site web (NLB)",
   "action": "arrêter un nœud, recharger la page",
   "attendu": "le site répond encore",
   "ref": "§6.2"
  },
  {
   "id": "T13",
   "test": "Messagerie",
   "action": "envoyer un courrier entre deux boîtes",
   "attendu": "reçu",
   "ref": "§6.3"
  },
  {
   "id": "T14",
   "test": "SharePoint",
   "action": "ouvrir le site de la ferme",
   "attendu": "page affichée",
   "ref": "§7"
  },
  {
   "id": "T15",
   "test": "Zabbix",
   "action": "hôte de chaque site visible, données reçues",
   "attendu": "valeurs récentes",
   "ref": "§9.1"
  },
  {
   "id": "T16",
   "test": "Redmine",
   "action": "connexion HTTPS, création d'un ticket",
   "attendu": "ticket créé",
   "ref": "§9.2"
  },
  {
   "id": "T17",
   "test": "Sauvegarde Redmine",
   "action": "exécuter `backup-redmine.sh`",
   "attendu": "3 fichiers non vides",
   "ref": "§8.1"
  },
  {
   "id": "T18",
   "test": "Restauration Redmine",
   "action": "restaurer sur une copie",
   "attendu": "ticket retrouvé",
   "ref": "§8.1"
  },
  {
   "id": "T19",
   "test": "Wazuh + Sysmon",
   "action": "provoquer un événement, le retrouver dans Wazuh",
   "attendu": "alerte vue",
   "ref": "§9.3"
  },
  {
   "id": "T20",
   "test": "Greenbone",
   "action": "scan d'une seule cible",
   "attendu": "rapport produit",
   "ref": "§9.4"
  },
  {
   "id": "T21",
   "test": "Basculement Replica",
   "action": "test de basculement de LON-FS01",
   "attendu": "VM démarre à Paris",
   "ref": "§10.2"
  },
  {
   "id": "T22",
   "test": "Niveau fonctionnel",
   "action": "`(Get-ADForest).ForestMode` et `(Get-ADDomain).DomainMode`",
   "attendu": "`Windows2025Forest` et `Windows2025Domain`",
   "ref": "§5.1"
  },
  {
   "id": "T23",
   "test": "Site AD de chaque contrôleur",
   "action": "`nltest /dsgetsite` sur BRU-DC01 et PAR-DC01",
   "attendu": "BRU puis PAR",
   "ref": "§5.1"
  },
  {
   "id": "T24",
   "test": "OWA depuis les quatre sites",
   "action": "ouvrir `https://mail.eurocorp.lan/owa` depuis un poste de chaque site",
   "attendu": "page de connexion, puis la boîte",
   "ref": "§6.3"
  },
  {
   "id": "T25",
   "test": "Alerte Zabbix",
   "action": "arrêter un service surveillé (site IIS ou DNS)",
   "attendu": "problème dans Monitoring → Problems, résolu au redémarrage",
   "ref": "§9.1"
  },
  {
   "id": "T26",
   "test": "Suivi dans Redmine",
   "action": "projet EUROCORP : tâches assignées aux membres, un incident documenté",
   "attendu": "un tiers comprend l'état du projet",
   "ref": "§9.2"
  },
  {
   "id": "T27",
   "test": "Scan authentifié Greenbone",
   "action": "tâche avec identifiants sur un serveur Windows",
   "attendu": "rapport avec vulnérabilités et remédiations",
   "ref": "§9.4"
  },
  {
   "id": "T28",
   "test": "Retour Replica (failback)",
   "action": "Planned Failover vers Paris puis retour vers Londres",
   "attendu": "réplication de nouveau Londres → Paris, état Normal",
   "ref": "§10.2"
  }
 ]
};
