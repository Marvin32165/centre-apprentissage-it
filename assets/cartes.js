/* ══════════════════════════════════════════════════════════════════
   CARTES DE RÉVISION — complètent les questions des tests (QUIZ_BANK)
   dans la page revision.html. Une carte : m = clé du module,
   f = recto (la question), b = verso (la réponse). HTML autorisé.
   Ajouter une carte ici suffit : elle entre dans la révision au
   prochain chargement, comme une carte nouvelle.
   ══════════════════════════════════════════════════════════════════ */
window.CARTES = [

/* ── Réseau : les bases — ports ── */
{ m: "reseau-bases", f: "Port et protocole de <strong>SSH</strong> ?", b: "TCP 22" },
{ m: "reseau-bases", f: "Port et protocole du <strong>DNS</strong> ?", b: "53, en UDP (et TCP pour les grosses réponses et les transferts de zone)" },
{ m: "reseau-bases", f: "Ports du <strong>DHCP</strong> ?", b: "UDP 67 (serveur) et 68 (client)" },
{ m: "reseau-bases", f: "Port de <strong>HTTPS</strong> ?", b: "TCP 443 (et UDP 443 avec HTTP/3, QUIC)" },
{ m: "reseau-bases", f: "Port de <strong>RDP</strong> (bureau à distance) ?", b: "3389, TCP et UDP" },
{ m: "reseau-bases", f: "Port de <strong>SMB</strong> (partages Windows) ?", b: "TCP 445" },
{ m: "reseau-bases", f: "Ports de <strong>LDAP</strong> et LDAPS ?", b: "389 (LDAP) et 636 (LDAP sur TLS)" },
{ m: "reseau-bases", f: "Port de <strong>Kerberos</strong> ?", b: "88, TCP et UDP" },
{ m: "reseau-bases", f: "Port de <strong>NTP</strong> ?", b: "UDP 123" },
{ m: "reseau-bases", f: "Ports de <strong>SNMP</strong> ?", b: "UDP 161 (requêtes) et 162 (traps)" },
{ m: "reseau-bases", f: "Port de <strong>SQL Server</strong> (instance par défaut) ?", b: "TCP 1433 (et UDP 1434 pour le service Browser des instances nommées)" },
{ m: "reseau-bases", f: "Ports de <strong>WinRM</strong> (PowerShell à distance) ?", b: "5985 (HTTP) et 5986 (HTTPS)" },
{ m: "reseau-bases", f: "Port de <strong>SIP</strong> ?", b: "5060 (UDP/TCP), 5061 en TLS" },
{ m: "reseau-bases", f: "Port de <strong>Syslog</strong> ?", b: "UDP 514" },
{ m: "reseau-bases", f: "Ports de <strong>Zabbix</strong> ?", b: "10050 (agent) et 10051 (serveur, trapper)" },

/* ── Réseau : les bases — notions ── */
{ m: "reseau-bases", f: "Les trois plages d'adresses <strong>privées</strong> IPv4 (RFC 1918) ?", b: "<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>" },
{ m: "reseau-bases", f: "Que signifie une adresse en <code>169.254.x.x</code> sur un poste ?", b: "APIPA : aucun serveur DHCP n'a répondu. Chercher du côté du câble, du VLAN, du service DHCP ou d'une étendue pleine." },
{ m: "reseau-bases", f: "Les quatre messages DHCP, dans l'ordre ?", b: "Discover, Offer, Request, Ack (DORA)" },
{ m: "reseau-bases", f: "À quel moment du bail un client DHCP tente-t-il de le renouveler ?", b: "À 50 % (T1) auprès de son serveur, puis à 87,5 % (T2) auprès de n'importe quel serveur" },
{ m: "reseau-bases", f: "Qu'est-ce qui change à chaque routeur traversé : l'adresse IP ou l'adresse MAC ?", b: "Les adresses <strong>MAC</strong> (nouvelle trame à chaque tronçon). Les IP restent celles de bout en bout, hors NAT." },
{ m: "reseau-bases", f: "Pour joindre une machine d'un autre réseau, sur quelle adresse un poste fait-il sa requête ARP ?", b: "Sur sa <strong>passerelle</strong>, jamais sur la machine distante." },
{ m: "reseau-bases", f: "SYN → RST : que conclure ?", b: "La machine répond mais rien n'écoute sur ce port (« connexion refusée »)." },
{ m: "reseau-bases", f: "SYN → pas de réponse : que conclure ?", b: "Le paquet est jeté en route : pare-feu, routage, machine éteinte (« délai expiré »)." },
{ m: "reseau-bases", f: "Enregistrement DNS qui fait correspondre un nom à une adresse IPv6 ?", b: "AAAA" },
{ m: "reseau-bases", f: "Par quel type d'enregistrement DNS un poste trouve-t-il ses contrôleurs de domaine ?", b: "SRV (par exemple <code>_ldap._tcp.orion.local</code>)" },
{ m: "reseau-bases", f: "Règle de choix d'une route quand plusieurs correspondent ?", b: "Le <strong>préfixe le plus long</strong>, puis la plus petite distance administrative, puis la meilleure métrique." },
{ m: "reseau-bases", f: "Préfixe des adresses IPv6 <strong>lien local</strong> ?", b: "<code>fe80::/10</code> — présente sur chaque interface, ne franchit jamais un routeur" },
{ m: "reseau-bases", f: "Quel protocole remplace ARP en IPv6 ?", b: "NDP (Neighbor Discovery), en ICMPv6 multicast" },
{ m: "reseau-bases", f: "Taille d'un réseau local IPv6 standard ?", b: "/64" },

/* ── Subnetting ── */
{ m: "subnetting", f: "Block size d'un <code>/27</code> ?", b: "32 (masque .224 ; 256 − 224)" },
{ m: "subnetting", f: "Nombre d'hôtes utilisables dans un <code>/26</code> ?", b: "62 (2<sup>6</sup> − 2)" },
{ m: "subnetting", f: "Masque décimal d'un <code>/21</code> ?", b: "<code>255.255.248.0</code>" },
{ m: "subnetting", f: "Masque générique (wildcard) d'un <code>/30</code> ?", b: "<code>0.0.0.3</code>" },
{ m: "subnetting", f: "Plus petit préfixe pour 500 hôtes ?", b: "/23 (510 hôtes)" },
{ m: "subnetting", f: "Combien de /64 dans un /48 ?", b: "65 536 (2<sup>16</sup>)" },

/* ── Dépannage réseau ── */
{ m: "depannage-reseau", f: "Windows : tester le port 443 d'un serveur en une commande ?", b: "<code>Test-NetConnection srv -Port 443</code> → regarder <code>TcpTestSucceeded</code>" },
{ m: "depannage-reseau", f: "Linux : voir les ports en écoute et le programme qui les tient ?", b: "<code>sudo ss -tulpn</code>" },
{ m: "depannage-reseau", f: "Linux : quelle route et quelle adresse source seront utilisées vers 8.8.8.8 ?", b: "<code>ip route get 8.8.8.8</code>" },
{ m: "depannage-reseau", f: "Le ping de l'IP marche, pas celui du nom. Couche en cause ?", b: "Le DNS (nslookup, Resolve-DnsName, ipconfig /flushdns)" },
{ m: "depannage-reseau", f: "Wireshark : filtre d'affichage des ouvertures de connexion TCP ?", b: "<code>tcp.flags.syn == 1 &amp;&amp; tcp.flags.ack == 0</code>" },
{ m: "depannage-reseau", f: "Windows : tester le MTU vers 10.0.0.1 avec 1472 octets, sans fragmentation ?", b: "<code>ping -f -l 1472 10.0.0.1</code> (Linux : <code>ping -M do -s 1472</code>)" },
{ m: "depannage-reseau", f: "Écart d'horloge maximal toléré par Kerberos par défaut ?", b: "5 minutes" },

/* ── CCNA ── */
{ m: "ccna-reseau", f: "IOS : voir l'état de toutes les interfaces en une ligne chacune ?", b: "<code>show ip interface brief</code>" },
{ m: "ccna-reseau", f: "IOS : lancer un <code>show</code> depuis le mode configuration ?", b: "Le préfixer par <code>do</code> : <code>do show running-config</code>" },
{ m: "ccna-reseau", f: "IOS : ajouter le VLAN 30 à un trunk sans retirer les autres ?", b: "<code>switchport trunk allowed vlan add 30</code>" },
{ m: "ccna-reseau", f: "IOS : relayer le DHCP vers un serveur 10.2.120.10 ?", b: "Sur l'interface du VLAN : <code>ip helper-address 10.2.120.10</code>" },
{ m: "ccna-reseau", f: "Distance administrative d'une route statique ? d'OSPF ?", b: "1 et 110 (connecté : 0)" },
{ m: "ccna-reseau", f: "OSPF bloqué en EXSTART/EXCHANGE : cause classique ?", b: "Un MTU différent des deux côtés" },
{ m: "ccna-reseau", f: "HSRP : priorité par défaut, et ce que fait <code>preempt</code> ?", b: "100 ; <code>preempt</code> permet au routeur de meilleure priorité de reprendre la main quand il revient" },
{ m: "ccna-reseau", f: "EtherChannel LACP : quels modes forment un canal ?", b: "active–active ou active–passive (passive–passive ne forme rien)" },
{ m: "ccna-reseau", f: "Où placer une ACL étendue ? une ACL standard ?", b: "Étendue près de la <strong>source</strong> ; standard près de la <strong>destination</strong>" },
{ m: "ccna-reseau", f: "IOS : voir les traductions NAT en cours ?", b: "<code>show ip nat translations</code>" },

/* ── Cisco sécurité ── */
{ m: "cisco-securite", f: "Un traceroute IOS se termine par <code>A</code>. Signification ?", b: "Refusé par une règle administrative : une ACL" },
{ m: "cisco-securite", f: "IOS : lister les ports coupés par port-security ou BPDU Guard ?", b: "<code>show interfaces status err-disabled</code>" },
{ m: "cisco-securite", f: "Comment relever un port <code>err-disabled</code> ?", b: "Retirer la cause, puis <code>shutdown</code> et <code>no shutdown</code> sur le port" },
{ m: "cisco-securite", f: "Appliquer une ACL aux lignes VTY : quelle commande ?", b: "<code>access-class NOM in</code> (sur les interfaces : <code>ip access-group</code>)" },
{ m: "cisco-securite", f: "DHCP snooping : quel port déclarer <code>trust</code> ?", b: "Celui qui mène au vrai serveur DHCP (le lien montant)" },

/* ── VoIP ── */
{ m: "voip", f: "Délai de bouche à oreille recommandé pour la voix (ITU-T G.114) ?", b: "≤ 150 ms" },
{ m: "voip", f: "Débit réel d'un appel G.711 sur Ethernet, par sens ?", b: "≈ 87 kb/s" },
{ m: "voip", f: "« Ça sonne mais personne n'entend » : cause classique ?", b: "SIP passe, RTP est bloqué (pare-feu, NAT, plage RTP non ouverte)" },

/* ── Windows Server ── */
{ m: "windows-server", f: "Créer une forêt <code>orion.local</code> en PowerShell ?", b: "<code>Install-ADDSForest -DomainName orion.local -DomainNetbiosName ORION -InstallDns</code>" },
{ m: "windows-server", f: "Vérifier la réplication entre contrôleurs de domaine ?", b: "<code>repadmin /replsummary</code> (détail : <code>repadmin /showrepl</code>)" },
{ m: "windows-server", f: "Autoriser un serveur DHCP dans AD ?", b: "<code>Add-DhcpServerInDC</code> (vérifier : <code>Get-DhcpServerInDC</code>)" },
{ m: "windows-server", f: "Ordre d'application des GPO ?", b: "Local, Site, Domaine, OU (L-S-D-OU) — la dernière appliquée gagne" },
{ m: "windows-server", f: "Voir les GPO appliquées à l'utilisateur, sur le poste ?", b: "<code>gpresult /r</code> (rapport complet : <code>gpresult /h rapport.html</code>)" },
{ m: "windows-server", f: "Droit effectif par le réseau : partage <em>Change</em> + NTFS <em>Read</em> ?", b: "Read — le plus restrictif des deux" },
{ m: "windows-server", f: "Règle AGDLP ?", b: "Comptes → groupes Globaux → groupes de Domaine Local → Permissions" },
{ m: "windows-server", f: "ID d'événement d'un échec d'ouverture de session ? d'un compte verrouillé ?", b: "4625 ; 4740" },

/* ── PowerShell ── */
{ m: "powershell", f: "Que renvoie toujours <code>Read-Host</code> ?", b: "Une chaîne : <code>\"5\" + 3</code> donne <code>53</code>. Typer : <code>[int]$n = Read-Host</code>" },
{ m: "powershell", f: "Comparaison sensible à la casse ?", b: "<code>-ceq</code> (les opérateurs normaux ignorent la casse)" },
{ m: "powershell", f: "Exécuter un bloc dans une VM Hyper-V sans réseau ?", b: "<code>Invoke-Command -VMName NOM -ScriptBlock { … }</code> (PowerShell Direct)" },
{ m: "powershell", f: "Pourquoi un <code>catch</code> n'attrape-t-il rien ?", b: "L'erreur est non bloquante : ajouter <code>-ErrorAction Stop</code>" },

/* ── Linux ── */
{ m: "linux-debian", f: "Tester <code>/etc/fstab</code> sans redémarrer ?", b: "<code>sudo mount -a</code>" },
{ m: "linux-debian", f: "Agrandir un LV et son ext4 de 5 Go en une commande ?", b: "<code>sudo lvextend -r -L +5G /dev/vg/lv</code>" },
{ m: "linux-debian", f: "État d'un RAID logiciel en un coup d'œil ?", b: "<code>cat /proc/mdstat</code> — <code>[UUU]</code> sain, un <code>_</code> = dégradé" },
{ m: "linux-debian", f: "Rendre un RAID mdadm persistant au démarrage : les trois étapes ?", b: "Ligne ARRAY (<code>mdadm --detail --scan &gt;&gt; mdadm.conf</code>), <code>update-initramfs -u</code>, entrée fstab par UUID" },
{ m: "linux-debian", f: "Champs d'une ligne crontab, dans l'ordre ?", b: "minute, heure, jour du mois, mois, jour de la semaine, commande" },
{ m: "linux-debian", f: "rsync : différence entre <code>/home/</code> et <code>/home</code> en source ?", b: "Avec la barre finale : le contenu ; sans : le dossier lui-même" },

/* ── Hyper-V ── */
{ m: "hyperv", f: "Le seul réglage d'une VM Hyper-V définitif à la création ?", b: "La génération (1 ou 2)" },
{ m: "hyperv", f: "Commutateur où les VM ne parlent qu'entre elles ?", b: "Privé (interne : VM ↔ hôte ; externe : vers le réseau physique)" },
{ m: "hyperv", f: "Un point de contrôle est-il une sauvegarde ?", b: "Non : il vit à côté du disque, sur le même stockage" },
/* ── Linux (compléments) ── */
{ m: "linux-debian", f: "Ajouter un utilisateur au groupe <code>sudo</code> sans lui retirer ses autres groupes ?", b: "<code>sudo usermod -aG sudo nom</code> — sans <code>-a</code>, la liste des groupes est remplacée" },
{ m: "linux-debian", f: "Démarrer un service et l'activer au démarrage, en une commande ?", b: "<code>sudo systemctl enable --now nom</code>" },
{ m: "linux-debian", f: "Droits attendus sur <code>~/.ssh</code> et sur la clé privée ?", b: "700 pour le dossier, 600 pour la clé privée" },
{ m: "linux-debian", f: "Suivre en direct le journal d'un service systemd ?", b: "<code>journalctl -u nom -f</code>" },

/* ── Windows Server (compléments) ── */
{ m: "windows-server", f: "Vérifier depuis un poste qu'il trouve un contrôleur de domaine ?", b: "<code>nltest /dsgetdc:orion.local</code>" },
{ m: "windows-server", f: "Les cinq rôles FSMO, et leur portée ?", b: "Forêt : maître de schéma, maître d'attribution de noms de domaine. Domaine : RID, émulateur PDC, infrastructure" },
{ m: "windows-server", f: "Lister les détenteurs des rôles FSMO ?", b: "<code>netdom query fsmo</code>" },
{ m: "windows-server", f: "Prérequis d'un gMSA, et comment le tester sur le serveur ?", b: "Une clé racine KDS (<code>Add-KdsRootKey</code>) ; test : <code>Test-ADServiceAccount nom</code> → True" },

/* ── RDS ── */
{ m: "rds", f: "Combien de temps un déploiement RDS fonctionne-t-il sans serveur de licences ?", b: "120 jours (période de grâce)" },
{ m: "rds", f: "Quel rôle RDS reconnecte un utilisateur à sa session existante ?", b: "Le Connection Broker (RDCB)" },
{ m: "rds", f: "Port de la passerelle RD (RD Gateway) ?", b: "TCP 443 (HTTPS), plus UDP 3391 en option pour le transport UDP" },
{ m: "rds", f: "CAL <em>Per User</em> ou <em>Per Device</em> ?", b: "Per User : une personne, plusieurs appareils. Per Device : un poste partagé par plusieurs personnes" },
{ m: "rds", f: "Affecter un certificat aux rôles d'un déploiement RDS en PowerShell ?", b: "<code>Set-RDCertificate -Role RDWebAccess …</code> (aussi RDGateway, RDPublishing, RDRedirector)" },

/* ── IIS ── */
{ m: "iis", f: "Quel processus exécute un pool d'applications IIS ?", b: "<code>w3wp.exe</code> (un par pool actif)" },
{ m: "iis", f: "Quel compte autoriser en NTFS pour le pool <code>cafe</code> ?", b: "<code>IIS AppPool\\cafe</code>" },
{ m: "iis", f: "Codes HTTP et couche en cause : 404, 401.3, 403, 500, 503 ?", b: "404 contenu absent, 401.3 droit NTFS manquant (ACL), 403 refus d'IIS lui-même (ex. 403.14 : pas de document par défaut), 500 application ou configuration, 503 pool arrêté" },

/* ── Exchange & PKI ── */
{ m: "exchange-securite", f: "Retirer la boîte aux lettres d'un utilisateur sans supprimer son compte AD ?", b: "<code>Disable-Mailbox</code> (<code>Remove-Mailbox</code> supprime aussi le compte)" },
{ m: "exchange-securite", f: "Chiffrer pour un destinataire / signer : avec quelle clé ?", b: "Chiffrer : clé <strong>publique</strong> du destinataire. Signer : sa propre clé <strong>privée</strong>" },

/* ── SQL Server ── */
{ m: "sql-server", f: "Les trois modes de récupération d'une base ?", b: "SIMPLE, FULL, BULK_LOGGED — seuls FULL et BULK_LOGGED permettent les sauvegardes du journal" },
{ m: "sql-server", f: "Appliquer une valeur posée par <code>sp_configure</code> ?", b: "<code>RECONFIGURE</code> (et <code>show advanced options</code> à 1 pour les options avancées)" },
{ m: "sql-server", f: "Recoller un user orphelin à son login après une restauration ?", b: "<code>ALTER USER [nom] WITH LOGIN = [nom]</code>" },
{ m: "sql-server", f: "Priorité des permissions SQL Server ?", b: "DENY &gt; GRANT &gt; rien ; REVOKE retire seulement une attribution. <code>sysadmin</code> passe outre tout" },
{ m: "sql-server", f: "Port fixe : que mettre dans <em>TCP Dynamic Ports</em> ?", b: "Rien (vide). <code>0</code> réactive le port dynamique ; le port fixe va dans <em>TCP Port</em>" },
{ m: "sql-server", f: "Vérifier l'intégrité physique et logique d'une base ?", b: "<code>DBCC CHECKDB</code> (sans option de réparation en premier diagnostic)" },

/* ── DPM ── */
{ m: "dpm", f: "Collation exigée par DPM pour l'instance SQL de sa base ?", b: "<code>SQL_Latin1_General_CP1_CI_AS</code> — choisie à l'installation de SQL" },
{ m: "dpm", f: "Synchronisation ou point de récupération : lequel se restaure ?", b: "Le point de récupération ; la synchronisation ne fait que tenir le réplica à jour" },

/* ── VoIP (compléments) ── */
{ m: "voip", f: "Débit de la voix seule en G.711 et en G.729 ?", b: "64 kb/s et 8 kb/s (hors en-têtes)" },
{ m: "voip", f: "Marquage DSCP habituel du flux voix (RTP) ?", b: "EF (Expedited Forwarding), valeur 46" },
{ m: "voip", f: "Sur quels ports passe le RTP ?", b: "Une plage UDP dynamique négociée dans le SDP (souvent 10000–20000, selon le PBX)" },

/* ── Proxmox ── */
{ m: "proxmox", f: "Adresse de l'interface web de Proxmox VE ?", b: "<code>https://IP:8006</code>" },
{ m: "proxmox", f: "Lister les VM, puis les conteneurs, en ligne de commande ?", b: "<code>qm list</code> et <code>pct list</code>" },
{ m: "proxmox", f: "Outil de sauvegarde intégré à Proxmox VE ?", b: "<code>vzdump</code> (planifié dans Datacenter → Backup), ou Proxmox Backup Server" },
{ m: "proxmox", f: "Voir l'état du cluster et du quorum ?", b: "<code>pvecm status</code>" },
{ m: "proxmox", f: "<code>local</code> ou <code>local-lvm</code> : qui stocke quoi ?", b: "<code>local</code> : ISO, templates, sauvegardes. <code>local-lvm</code> : disques des VM et conteneurs" },

/* ── Docker ── */
{ m: "docker", f: "Sortir d'un conteneur lancé en <code>-it</code> sans l'arrêter ?", b: "Ctrl+P puis Ctrl+Q" },
{ m: "docker", f: "Ouvrir un shell dans un conteneur qui tourne ?", b: "<code>docker exec -it NOM bash</code> (ou <code>sh</code>)" },
{ m: "docker", f: "Publier le port 5000 du conteneur sur le port 8000 de l'hôte ?", b: "<code>-p 8000:5000</code> (hôte:conteneur)" },
{ m: "docker", f: "<code>docker compose down</code> supprime-t-il les volumes ?", b: "Non ; <code>docker compose down -v</code> les supprime" },
{ m: "docker", f: "Suivre les journaux d'un conteneur en continu ?", b: "<code>docker logs -f NOM</code>" },
{ m: "docker", f: "Voir un Compose avec ses variables <code>${…}</code> remplacées ?", b: "<code>docker compose config</code>" },

/* ── Zabbix ── */
{ m: "monitoring-zabbix", f: "Interroger un agent depuis le serveur Zabbix, en passif ?", b: "<code>zabbix_get -s IP -k agent.ping</code> → 1" },
{ m: "monitoring-zabbix", f: "Tester une clé d'item localement, sur l'agent ?", b: "<code>zabbix_agent2 -t clé</code> (ou <code>zabbix_agentd -t</code>)" },
{ m: "monitoring-zabbix", f: "Les trois maillons de la chaîne d'alerte Zabbix ?", b: "Item (mesure) → trigger (condition) → action (notification ou commande)" },
{ m: "monitoring-zabbix", f: "Ce qui doit être identique, casse comprise, entre l'agent et l'hôte ?", b: "Le <code>Hostname=</code> de l'agent et le <em>Host name</em> de l'hôte" },
{ m: "zabbix-windows", f: "Les quatre paramètres PSK d'un agent ?", b: "<code>TLSConnect=psk</code>, <code>TLSAccept=psk</code>, <code>TLSPSKIdentity</code>, <code>TLSPSKFile</code>" },
{ m: "zabbix-windows", f: "Ajouter une métrique maison à l'agent ?", b: "<code>UserParameter=clé,commande</code> dans un .conf, puis redémarrer l'agent" },
{ m: "zabbix-windows", f: "<em>Execute now</em> fonctionne-t-il sur un item actif ?", b: "Non : il ne vaut que pour les vérifications passives. Redémarrer l'agent force la collecte" },

/* ── Azure ── */
{ m: "azure", f: "LRS, ZRS, GRS, RA-GRS ?", b: "Un datacenter · plusieurs zones d'une région · une région secondaire · GRS avec lecture secondaire" },
{ m: "azure", f: "Scalabilité ou élasticité ?", b: "Scalabilité : on ajuste la capacité. Élasticité : elle s'ajuste toute seule à la charge" },
{ m: "azure", f: "Hiérarchie de gestion Azure, du plus large au plus fin ?", b: "Management groups → subscriptions → resource groups → ressources" },
{ m: "azure", f: "RBAC ou Azure Policy ?", b: "RBAC : ce qu'une identité a le droit de faire. Policy : les propriétés qu'une ressource doit respecter" },
{ m: "azure", f: "Load Balancer ou Application Gateway ?", b: "Load Balancer : couche 4 (TCP/UDP). Application Gateway : couche 7 (URL, nom d'hôte, WAF)" },
{ m: "azure", f: "Pricing Calculator ou business case d'Azure Migrate ?", b: "Pricing Calculator : estimer le coût d'une architecture Azure. Business case d'Azure Migrate (successeur du TCO Calculator) : comparer le coût local à celui d'Azure" },
{ m: "azure", f: "SLA de 99,9 % : indisponibilité tolérée par mois ?", b: "Environ 43 minutes" },

/* ── Scrum ── */
{ m: "scrum", f: "Les trois piliers de Scrum ?", b: "Transparence, inspection, adaptation" },
{ m: "scrum", f: "Les trois responsabilités de l'équipe Scrum ?", b: "Product Owner, Scrum Master, Developers" },
{ m: "scrum", f: "Durée maximale d'un sprint ?", b: "Un mois (souvent deux semaines)" },
{ m: "scrum", f: "Timebox des événements pour un sprint d'un mois (Scrum Guide 2020) ?", b: "Planning 8 h, Daily 15 min, Review 4 h, Rétrospective 3 h (moins pour un sprint plus court)" },
{ m: "scrum", f: "Les trois artefacts et leur engagement ?", b: "Product Backlog → Product Goal ; Sprint Backlog → Sprint Goal ; Incrément → Definition of Done" }
];
