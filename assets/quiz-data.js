/* ══════════════════════════════════════════════════════════════════
   FONDS DE QUESTIONS
   Deux objets, lus par assets/quiz.js :

   QUIZ_BANK — un fonds par module. Il alimente le test de fin de
               module, et sert de réservoir aux examens.
   EXAM_BANK — les examens transversaux. Chacun couvre plusieurs
               modules (parts), tire au sort dans leurs fonds, et
               ajoute ses propres questions de synthèse — celles-ci
               sont toujours posées.

   Format d'une question :
       q    énoncé (HTML autorisé)
       c    propositions, dans l'ordre d'écriture
       a    index de la bonne réponse, ou tableau d'index si
            plusieurs réponses sont attendues
       why  correction commentée
       ref  chapitre à relire

   Les propositions sont mélangées à l'affichage : l'ordre écrit ici
   n'a pas d'importance pour l'apprenant.
   ══════════════════════════════════════════════════════════════════ */

window.QUIZ_BANK = {

/* ════════════════════ PARCOURS 01 · FONDATIONS ════════════════════ */

"reseau-bases": {
    name: "Réseau : les bases",
    file: "reseau-bases.html",
    title: "Test — Réseau : les bases",
    intro: "Douze chapitres, dix questions. Peu de définitions : surtout des situations, des commandes et des sorties à lire.",
    pass: 70,
    questions: [
    {
        q: "Un paquet part de ton PC vers un serveur web sur Internet et traverse trois routeurs. Qu'est-ce qui reste identique d'un bout à l'autre (sans NAT) ?",
        c: ["Les adresses IP source et destination", "Les adresses MAC source et destination", "Les deux", "Aucune des deux"],
        a: 0,
        why: "Les adresses IP restent celles de bout en bout ; chaque routeur refabrique une trame avec de nouvelles adresses MAC pour le tronçon suivant.",
        ref: "Chapitre 02"
    },
    {
        q: "<code>ipconfig</code> affiche <code>Adresse IPv4 : 169.254.12.7</code>. Que s'est-il passé ?",
        c: ["Aucun serveur DHCP n'a répondu : le poste s'est donné une adresse APIPA", "Le serveur DHCP a distribué une adresse de secours", "Le poste est en IPv6", "L'adresse a été fixée à la main"],
        a: 0,
        why: "169.254.0.0/16 est la plage APIPA : Windows se l'attribue seul quand DORA échoue. On cherche du côté du câble, du VLAN, du service DHCP ou d'une étendue pleine.",
        ref: "Chapitre 04"
    },
    {
        q: "PC1 (<code>192.168.1.25/24</code>, passerelle <code>192.168.1.1</code>) envoie un ping à <code>8.8.8.8</code>. Sur quelle adresse fait-il sa requête ARP ?",
        c: ["<code>192.168.1.1</code>, la passerelle", "<code>8.8.8.8</code>", "<code>192.168.1.255</code>", "Aucune : ARP ne sert pas pour un ping"],
        a: 0,
        why: "8.8.8.8 n'est pas sur son réseau : la trame part vers la MAC de la passerelle. On ne fait jamais d'ARP sur une machine distante.",
        ref: "Chapitre 05"
    },
    {
        q: "Un client tente une connexion TCP sur un port ; il envoie <code>SYN</code> et reçoit aussitôt <code>RST</code>. Que conclure ?",
        c: ["La machine répond, mais aucun service n'écoute sur ce port", "Un pare-feu a jeté le paquet en silence", "La machine est éteinte", "La connexion est établie"],
        a: 0,
        why: "RST = « connexion refusée » : l'hôte est joignable, le port est fermé. Un paquet jeté par un pare-feu ne donne aucune réponse : on obtient un délai expiré.",
        ref: "Chapitre 06"
    },
    {
        q: "<code>Test-NetConnection srv-sql -Port 1433</code> renvoie <code>PingSucceeded : True</code> et <code>TcpTestSucceeded : False</code>. Quelles pistes sont cohérentes ?",
        c: ["Le service SQL Server n'écoute pas sur 1433", "Le pare-feu du serveur bloque le port 1433", "Le serveur est éteint", "Le DNS ne résout pas srv-sql"],
        a: [0, 1],
        why: "Le ping répond : la machine est là et le nom est résolu. Reste le service (arrêté, port dynamique d'une instance nommée) ou un pare-feu. Voir le module SQL Server pour le port fixe.",
        ref: "Chapitre 06"
    },
    {
        q: "<code>ping 203.0.113.10</code> répond, mais <code>ping www.exemple.be</code> renvoie « impossible de trouver l'hôte ». Où chercher ?",
        c: ["Le DNS : serveur configuré, nom, cache", "La passerelle par défaut", "Le câble réseau", "Le masque de sous-réseau"],
        a: 0,
        why: "Si l'IP répond, la couche 3 et la passerelle fonctionnent. Seule la traduction du nom échoue : c'est le DNS (nslookup, Resolve-DnsName, ipconfig /flushdns).",
        ref: "Chapitre 07"
    },
    {
        q: "Un poste d'un domaine Active Directory a <code>8.8.8.8</code> comme seul serveur DNS. Quel symptôme est attendu ?",
        c: ["Internet marche, mais l'ouverture de session et les GPO du domaine échouent", "Plus rien ne marche, même Internet", "Tout marche normalement", "Seule la messagerie échoue"],
        a: 0,
        why: "Le DNS public ne connaît ni orion.local ni ses enregistrements SRV (_ldap._tcp…) : le poste ne trouve plus ses contrôleurs de domaine. Les postes d'un domaine n'utilisent que le DNS des DC.",
        ref: "Chapitre 07"
    },
    {
        q: "Les postes du VLAN 20 n'obtiennent pas d'adresse ; le serveur DHCP est dans le VLAN 10 et ses étendues sont correctes. Que manque-t-il le plus probablement ?",
        c: ["Un relais DHCP (<code>ip helper-address</code>) sur l'interface du VLAN 20", "Une réservation par poste", "Une route par défaut sur le serveur DHCP", "Une étendue IPv6"],
        a: 0,
        why: "DHCPDISCOVER est un broadcast : il ne traverse pas le routeur. Le relais le transmet en unicast au serveur, qui choisit l'étendue d'après l'interface d'origine.",
        ref: "Chapitre 08"
    },
    {
        q: "Un routeur a les routes <code>0.0.0.0/0 via A</code>, <code>10.0.0.0/8 via B</code> et <code>10.20.0.0/16 via C</code>. Par où part un paquet pour <code>10.20.3.4</code> ?",
        c: ["C", "B", "A", "Il est réparti entre B et C"],
        a: 0,
        why: "Les trois routes correspondent ; le routeur prend la plus précise, le préfixe le plus long : /16.",
        ref: "Chapitre 09"
    },
    {
        q: "Quelle est la forme abrégée correcte de <code>2001:0db8:0000:0000:0001:0000:0000:0001</code> ?",
        c: ["<code>2001:db8::1:0:0:1</code>", "<code>2001:db8::1::1</code>", "<code>2001:db8:0:0:1::1</code> et <code>2001:db8::1:0:0:1</code> sont toutes deux valides", "<code>2001:db8:1:1</code>"],
        a: 2,
        why: "Le :: ne s'utilise qu'une fois (donc pas « ::1::1 »). Les deux suites de zéros ont la même longueur : les deux formes sont valides ; la RFC 5952 recommande de compresser la première, soit 2001:db8::1:0:0:1.",
        ref: "Chapitre 10"
    }
    ]
},
"depannage-reseau": {
    name: "Dépannage réseau",
    file: "depannage-reseau.html",
    title: "Test — Dépannage réseau",
    intro: "Huit chapitres, dix questions : que fais-tu, et que conclus-tu de ce que tu vois ?",
    pass: 70,
    questions: [
    {
        q: "Un utilisateur dit « Internet ne marche pas ». Quelle est ta première action ?",
        c: ["Délimiter : un poste ou plusieurs ? un service ou tous ? depuis quand, après quel changement ?", "Redémarrer la box", "Réinstaller le pilote réseau", "Changer le câble"],
        a: 0,
        why: "Avant de modifier quoi que ce soit, on délimite : chaque réponse divise l'espace de recherche par deux et évite de casser ce qui marche.",
        ref: "Chapitre 01"
    },
    {
        q: "Sur un routeur, <code>show ip interface brief</code> affiche <code>Gi0/0/2 … administratively down down</code>. Que faut-il faire ?",
        c: ["<code>no shutdown</code> sur l'interface", "Changer le câble", "Ajouter une route statique", "Recharger l'IOS"],
        a: 0,
        why: "« administratively down » = éteinte par configuration. Les interfaces d'un routeur Cisco sont éteintes par défaut.",
        ref: "Chapitre 04"
    },
    {
        q: "Deux PC du VLAN 20, branchés sur deux switchs reliés par un trunk, ne se pinguent pas. Les PC du VLAN 10 se pinguent entre switchs. Quelle commande vérifier en premier ?",
        c: ["<code>show interfaces trunk</code>", "<code>show ip route</code>", "<code>show arp</code>", "<code>show logging</code>"],
        a: 0,
        why: "Le trunk fonctionne pour le VLAN 10 : il manque probablement le VLAN 20 dans la liste des VLAN autorisés et actifs du trunk.",
        ref: "Chapitre 06"
    },
    {
        q: "Dans une capture, tu vois trois SYN vers le port 443 d'un serveur, à 1, 2 puis 4 secondes d'intervalle, sans aucune réponse. Que conclure ?",
        c: ["Le paquet est filtré en route (pare-feu, ACL) ou le serveur est injoignable", "Le service HTTPS est arrêté mais le serveur répond", "Le certificat TLS est expiré", "Le DNS est en panne"],
        a: 0,
        why: "Un service arrêté sur un serveur joignable répond RST. Le silence total signifie que le paquet (ou la réponse) est jeté quelque part.",
        ref: "Chapitre 05"
    },
    {
        q: "Quelle commande Linux affiche les ports en écoute avec le programme qui les tient ?",
        c: ["<code>sudo ss -tulpn</code>", "<code>ip neigh</code>", "<code>ip route get</code>", "<code>dig</code>"],
        a: 0,
        why: "ss -tulpn : TCP, UDP, en écoute (listening), processus, numérique. Il remplace netstat sur une Debian récente.",
        ref: "Chapitre 03"
    },
    {
        q: "<code>show interfaces</code> sur un lien montant : <code>Half-duplex, 100Mb/s</code>, des CRC et des <em>late collisions</em> qui montent. Diagnostic le plus probable ?",
        c: ["Duplex mismatch (un côté forcé, l'autre en auto) ou câble défectueux", "VLAN absent du trunk", "Boucle de spanning tree", "Étendue DHCP pleine"],
        a: 0,
        why: "Les collisions tardives n'existent pas en full-duplex : leur présence, avec des CRC, signe un désaccord de duplex ou un câble abîmé.",
        ref: "Chapitre 06"
    },
    {
        q: "Un poste du domaine refuse les ouvertures de session ; <code>w32tm /query /status</code> montre une heure décalée de 12 minutes par rapport au DC. Pourquoi est-ce bloquant ?",
        c: ["Kerberos refuse les tickets au-delà de 5 minutes d'écart d'horloge par défaut", "DHCP refuse de renouveler le bail", "Le DNS refuse les requêtes", "Le pare-feu bloque NTP"],
        a: 0,
        why: "Kerberos utilise des horodatages pour empêcher le rejeu ; au-delà de la tolérance (5 minutes par défaut), l'authentification échoue.",
        ref: "Chapitre 06"
    },
    {
        q: "Un port de switch est <code>err-disabled</code> pour la raison <code>bpduguard</code> après qu'un utilisateur a branché un petit switch. Quelle est la bonne correction ?",
        c: ["Retirer le petit switch, puis <code>shutdown</code> / <code>no shutdown</code> sur le port", "Désactiver BPDU Guard sur ce port", "Redémarrer le switch d'étage", "Passer le port en trunk"],
        a: 0,
        why: "BPDU Guard a protégé le spanning tree : on retire la cause et on réactive le port. Retirer la protection ouvrirait la porte aux boucles.",
        ref: "Chapitre 07"
    },
    {
        q: "<code>ping -f -l 1472 10.0.0.1</code> répond « Le paquet doit être fragmenté », <code>ping -f -l 1400 10.0.0.1</code> passe. Que montre ce test ?",
        c: ["Le MTU du chemin est inférieur à 1500 octets (tunnel, VPN)", "La machine 10.0.0.1 est éteinte", "Un pare-feu bloque ICMP", "Le DNS ne résout pas 10.0.0.1"],
        a: 0,
        why: "Avec le bit DF, un paquet trop grand pour un lien du chemin est refusé. 1472 + 28 = 1500 : le chemin n'accepte pas 1500 octets, typique d'un tunnel.",
        ref: "Chapitre 06"
    },
    {
        q: "Tu passes un incident au niveau 2. Que doit contenir ta transmission ?",
        c: ["Le symptôme, le périmètre, ce qui a été testé avec les sorties des commandes", "Juste « ça ne marche toujours pas »", "La liste de tout ce que tu as redémarré", "Le nom de l'utilisateur seulement"],
        a: 0,
        why: "Transmettre les tests déjà faits et leurs résultats évite au suivant de tout recommencer. C'est aussi la base d'un ticket bien rempli.",
        ref: "Chapitre 08"
    }
    ]
},


"hyperv": {
    name: "Hyper-V & labo virtuel",
    file: "hyperv.html",
    title: "Test — Hyper-V & labo virtuel",
    intro: "Sept chapitres, huit questions. L'objectif : savoir monter un labo Hyper-V propre et le redéployer sans tout refaire à la main.",
    pass: 70,
    questions: [
    {
        q: "Quel réglage d'une VM Hyper-V est <strong>définitif</strong> une fois la machine créée ?",
        c: ["La génération (1 ou 2)", "La quantité de mémoire vive", "Le nombre de processeurs virtuels", "Le commutateur virtuel connecté"],
        a: 0,
        why: "La génération se fixe à la création et ne peut plus être changée. Mémoire, CPU et carte réseau se modifient à tout moment ; se tromper de génération oblige à recréer la VM.",
        ref: "Chapitre 02"
    },
    {
        q: "Que signifie concrètement le choix « Génération 2 » ?",
        c: ["Un firmware UEFI, avec démarrage sécurisé et disques SCSI", "Un BIOS classique, pour les OS anciens ou 32 bits", "Une VM limitée à 2 processeurs virtuels", "Une VM de deuxième génération d'un disque parent"],
        a: 0,
        why: "Génération 1 = équivalent BIOS, pour les OS anciens. Génération 2 = UEFI : Secure Boot, boot plus rapide, contrôleur SCSI. C'est le défaut pour un labo Windows Server moderne.",
        ref: "Chapitre 02"
    },
    {
        q: "À quoi sert Sysprep avec l'option <code>Generalize</code> ?",
        c: ["À retirer le SID, le nom et les identifiants matériels pour rendre l'installation clonable", "À compresser le disque virtuel pour gagner de la place", "À convertir une VM de génération 1 en génération 2", "À sauvegarder l'état de la VM avant une mise à jour"],
        a: 0,
        why: "Generalize neutralise l'installation : SID unique, nom de machine et identifiants matériels sont retirés. L'image redevient réutilisable pour toutes les VM suivantes.",
        ref: "Chapitre 05"
    },
    {
        q: "Une fois <code>C:\\PARENT\\sysprep.vhdx</code> désigné comme disque parent, que ne faut-il plus jamais faire ?",
        c: ["Le démarrer ou le modifier directement", "En faire une copie de sauvegarde", "Le placer sur un disque SSD", "Le référencer depuis plusieurs VM"],
        a: 0,
        why: "Le disque parent est en lecture seule de fait. Le démarrer ou le modifier casse toutes les VM enfants qui en dépendent — c'est précisément ce que les disques de différenciation ne pardonnent pas.",
        ref: "Chapitre 06"
    },
    {
        q: "Quelle est la vraie limite des disques de différenciation ?",
        c: ["Les performances : chaque lecture peut devoir traverser la chaîne parent/enfant", "Ils ne fonctionnent qu'en génération 1", "Ils sont limités à 4 machines par disque parent", "Ils empêchent l'usage des snapshots"],
        a: 0,
        why: "Ils économisent un disque entier par VM, mais les lectures traversent la chaîne. Pour un labo durable, un disque dynamique classique est un meilleur compromis ; on garde la différenciation pour du jetable.",
        ref: "Chapitre 06"
    },
    {
        q: "Quel commutateur virtuel donne à la VM un accès au réseau physique et à Internet ?",
        c: ["Externe", "Interne", "Privé", "Aucun : il faut un routeur virtuel dédié"],
        a: 0,
        why: "Externe = ponté sur la carte physique (accès réseau et Internet). Interne = la VM parle à l'hôte, pas au réseau physique. Privé = les VM ne parlent qu'entre elles, même l'hôte est exclu.",
        ref: "Chapitre 07"
    },
    {
        q: "Dans la check-list de premier démarrage d'un Windows Server, pourquoi renommer la machine <strong>en dernier</strong> ?",
        c: ["Parce que le renommage déclenche un redémarrage", "Parce que le nom dépend de l'adresse IP choisie", "Parce qu'Active Directory refuse un renommage précoce", "Parce que Sysprep écrase le nom sinon"],
        a: 0,
        why: "Le renommage redémarre la machine : on déroule d'abord l'adressage fixe, le fuseau horaire, IE ESC et la carte réseau, puis on renomme pour ne redémarrer qu'une fois.",
        ref: "Chapitre 04"
    },
    {
        q: "Couper le pare-feu Windows dans un labo : que faut-il retenir ?",
        c: ["C'est un dépannage de TP ; il faut le rallumer avant un Sysprep, car l'état est capturé dans l'image", "C'est la configuration recommandée pour tout serveur de labo comme de production", "Cela n'a aucun effet sur une VM en commutateur privé", "Cela empêche définitivement la jonction au domaine"],
        a: 0,
        why: "Désarmer le pare-feu fait gagner du temps pour déboguer un TP, jamais sur un serveur réel. Et l'état est capturé par Sysprep : une image faite pare-feu éteint reproduit ce défaut sur toutes les VM déployées.",
        ref: "Chapitre 04"
    },
    {
        q: "Avant de tester une GPO risquée sur SRV-FILE01, tu crées un point de contrôle. Qu'est-ce qu'il ne remplace pas ?",
        c: ["Une sauvegarde : il vit sur le même stockage que le disque de la VM", "Un retour en arrière en cas d'erreur de configuration", "Un moyen de figer l'état avant un test", "Un fichier .avhdx"],
        a: 0,
        why: "Le point de contrôle est un fichier de différences à côté du disque : si le stockage de l'hôte meurt, il disparaît avec. Il sert à revenir en arrière dans un lab, pas à protéger des données.",
        ref: "Chapitre 08"
    }]
},

"linux-debian": {
    name: "Linux Debian",
    file: "linux-debian.html",
    title: "Test — Linux Debian",
    intro: "Le module le plus dense du parcours : douze questions sur le terminal, les permissions, les filtres texte, le réseau, les services, les disques et les volumes.",
    pass: 70,
    questions: [
    {
        q: "Pourquoi écrit-on <code>usermod -aG sudo apprenant</code> et jamais <code>usermod -G sudo apprenant</code> ?",
        c: ["Sans <code>-a</code>, la commande remplace tous les groupes secondaires au lieu d'en ajouter un", "Sans <code>-a</code>, la commande échoue avec une erreur de syntaxe", "<code>-a</code> demande une confirmation avant d'écrire", "<code>-a</code> applique le changement immédiatement au lieu du prochain login"],
        a: 0,
        why: "<code>-G</code> remplace la liste des groupes secondaires ; <code>-a</code> (append) ajoute sans effacer. Oublier le <code>-a</code> sort l'utilisateur de tous ses autres groupes. D'où le réflexe : toujours <code>-aG</code>.",
        ref: "Chapitre 07"
    },
    {
        q: "Que renvoie <code>echo $?</code> juste après une commande ?",
        c: ["Son code de sortie : 0 si elle a réussi, autre chose sinon", "Le nombre de lignes qu'elle a affichées", "Son identifiant de processus (PID)", "Le temps d'exécution en millisecondes"],
        a: 0,
        why: "C'est le code de retour de la dernière commande : 0 = succès. C'est exactement ce sur quoi <code>&amp;&amp;</code> et <code>||</code> s'appuient pour enchaîner ou non la commande suivante.",
        ref: "Chapitre 08"
    },
    {
        q: "Quelle différence entre <code>sed</code> et <code>awk</code> ?",
        c: ["<code>sed</code> travaille ligne par ligne, <code>awk</code> travaille en colonnes", "<code>sed</code> lit les fichiers binaires, <code>awk</code> uniquement le texte", "<code>sed</code> est interne au shell, <code>awk</code> est un binaire externe", "<code>sed</code> ne peut pas utiliser d'expressions régulières"],
        a: 0,
        why: "<code>sed 's/avant/après/'</code> opère sur des lignes ; <code>awk</code> découpe en champs (<code>$1</code>, <code>$2</code>…). Et sans <code>-i</code>, <code>sed</code> se contente d'afficher : le fichier n'est pas modifié — le filet de sécurité à garder.",
        ref: "Chapitre 10"
    },
    {
        q: "Une variable créée par <code>formation=Linux</code> n'apparaît pas dans <code>env</code>. Pourquoi ?",
        c: ["Elle n'existe que dans le shell courant tant qu'elle n'est pas exportée", "Le nom est invalide : une variable doit être en majuscules", "<code>env</code> n'affiche que les variables du système, jamais celles de l'utilisateur", "Il manque un <code>sudo</code> pour la rendre visible"],
        a: 0,
        why: "Sans <code>export</code>, la variable reste locale au shell et n'est pas transmise aux processus fils. Pour qu'elle survive à la fermeture du terminal, la ligne <code>export</code> va dans <code>~/.bashrc</code>, suivie d'un <code>source ~/.bashrc</code>.",
        ref: "Chapitre 12"
    },
    {
        q: "<code>ping 8.8.8.8</code> répond, <code>ping www.google.fr</code> échoue. Où chercher ?",
        c: ["Du côté du DNS — la connectivité IP, elle, fonctionne", "Du côté de la passerelle par défaut", "Du côté du câble ou de la carte réseau", "Du côté du pare-feu qui bloque l'ICMP"],
        a: 0,
        why: "Joindre une IP prouve que le routage marche. Seule la résolution de noms échoue : on vérifie <code>/etc/resolv.conf</code> et le serveur DNS déclaré.",
        ref: "Chapitre 15"
    },
    {
        q: "Quelle différence entre <code>systemctl start ssh</code> et <code>systemctl enable ssh</code> ?",
        c: ["<code>start</code> démarre le service maintenant, <code>enable</code> l'active au prochain démarrage", "<code>start</code> l'active définitivement, <code>enable</code> ne fait que l'autoriser", "<code>start</code> agit sur le service, <code>enable</code> sur le socket associé", "Les deux sont équivalentes depuis systemd"],
        a: 0,
        why: "Deux actions distinctes : <code>start</code> agit tout de suite, <code>enable</code> au boot. Pour un service qui doit toujours tourner, il faut les deux — ou <code>enable --now</code>.",
        ref: "Chapitre 17"
    },
    {
        q: "SSH refuse d'utiliser vos clés. Quel droit doit porter le dossier <code>~/.ssh</code> ?",
        c: ["700 — accessible au seul propriétaire", "755 — lisible par tous, modifiable par le propriétaire", "644 — lisible par tous", "777 — accessible à tous, pour éviter les blocages"],
        a: 0,
        why: "SSH refuse un <code>~/.ssh</code> trop permissif : <code>chmod 700 ~/.ssh</code>. C'est une protection, pas un caprice — une clé privée lisible par d'autres n'est plus privée.",
        ref: "Chapitre 15"
    },
    {
        q: "Deux réflexes à avoir avant de valider un <code>rm -rf</code> ?",
        c: ["Relire toute la commande avant d'appuyer sur Entrée", "Vérifier le dossier courant avec <code>pwd</code>", "Lancer d'abord la commande avec <code>sudo</code> pour tester", "Ajouter <code>-y</code> pour confirmer automatiquement"],
        a: [0, 1],
        why: "<code>rm -rf</code> supprime définitivement, sans corbeille ni confirmation. On relit la commande, et on vérifie où l'on se trouve — un chemin relatif lancé depuis le mauvais dossier fait tous les dégâts.",
        ref: "Chapitre 04"
    },
    {
        q: "Dans <code>ls -l</code>, que signifie <code>-rw-r--r--</code> pour un fichier ?",
        c: ["Lecture/écriture pour le propriétaire, lecture seule pour le groupe et les autres", "Lecture seule pour tout le monde, y compris le propriétaire", "Lecture/écriture/exécution pour le propriétaire uniquement", "Un lien symbolique en lecture seule"],
        a: 0,
        why: "Le premier caractère donne le type (<code>-</code> = fichier ordinaire), puis trois triplets : propriétaire <code>rw-</code>, groupe <code>r--</code>, autres <code>r--</code>. Soit 644 en octal.",
        ref: "Chapitre 07"
    },
    {
        q: "Quelles commandes sont <strong>spécifiques à Debian</strong> plutôt qu'universelles sous Unix ?",
        c: ["<code>adduser</code> et <code>addgroup</code>", "<code>useradd</code> et <code>groupadd</code>", "<code>chmod</code> et <code>chown</code>", "<code>passwd</code> et <code>id</code>"],
        a: 0,
        why: "<code>adduser</code>/<code>addgroup</code> sont des scripts Debian conviviaux et interactifs. <code>useradd</code>/<code>groupadd</code> existent partout mais sont plus bruts — avec <code>useradd</code>, il faut lancer <code>passwd</code> soi-même pour activer le compte.",
        ref: "Chapitre 07"
    },
    {
        q: "Pourquoi identifier une partition par son UUID dans <code>/etc/fstab</code> plutôt que par <code>/dev/sdb1</code> ?",
        c: ["Les lettres sdX peuvent changer d'un démarrage à l'autre, l'UUID jamais", "L'UUID est plus rapide à monter", "fstab refuse les noms /dev/sdX", "L'UUID chiffre la partition"],
        a: 0,
        why: "Sur la VM du cours, les lettres ont changé plusieurs fois (ajout de disque, simple redémarrage). L'UUID est écrit dans le système de fichiers lui-même.",
        ref: "Chapitre 21"
    },
    {
        q: "<code>sudo lvextend -l 100%FREE /dev/vg_data/lv_storage</code> est refusé : « New size … not larger than existing size ». Pourquoi ?",
        c: ["Sans le <code>+</code>, 100%FREE est une taille absolue (l'espace libre), plus petite que le volume actuel", "Le VG est plein", "Il faut démonter le volume", "lvextend ne prend que des tailles en Go"],
        a: 0,
        why: "+100%FREE ajoute tout l'espace libre ; 100%FREE fixe la taille à l'espace libre. Puis resize2fs (ou lvextend -r) pour que ext4 voie l'espace.",
        ref: "Chapitre 23"
    }]
},

"subnetting": {
    name: "Réseau & Subnetting",
    file: "subnetting.html",
    title: "Test — Réseau & Subnetting",
    intro: "Dix questions de calcul, à faire de tête. Si tu passes ce test sans papier, le subnetting est acquis.",
    pass: 75,
    questions: [
    {
        q: "Quel est le block size d'un <code>/27</code> ?",
        c: ["32", "27", "64", "16"],
        a: 0,
        why: "Un /27 vaut <code>255.255.255.224</code>. Block size = 256 − 224 = <strong>32</strong>. Les sous-réseaux tombent donc sur 0, 32, 64, 96…",
        ref: "Chapitre 05"
    },
    {
        q: "À quel sous-réseau appartient <code>172.16.20.170/27</code> ?",
        c: ["172.16.20.160/27", "172.16.20.128/27", "172.16.20.170/27", "172.16.20.192/27"],
        a: 0,
        why: "Block size 32 → multiples 0, 32… 160, 192. Comme 160 ≤ 170 &lt; 192 : réseau <strong>172.16.20.160</strong>, broadcast .191, hôtes .161 → .190.",
        ref: "Chapitre 05"
    },
    {
        q: "Combien d'hôtes utilisables dans un <code>/26</code>, et d'où vient le « −2 » ?",
        c: ["62 — on retire l'adresse réseau et l'adresse de broadcast", "64 — aucune adresse n'est réservée", "62 — on retire la passerelle et le serveur DHCP", "60 — on retire réseau, broadcast, passerelle et DNS"],
        a: 0,
        why: "2⁶ − 2 = <strong>62</strong>. Les deux adresses retirées sont l'adresse réseau et le broadcast : elles ne sont attribuables à aucune machine.",
        ref: "Chapitre 03"
    },
    {
        q: "On passe un <code>/24</code> en <code>/26</code>. Combien de sous-réseaux obtient-on ?",
        c: ["4", "2", "6", "8"],
        a: 0,
        why: "On emprunte 2 bits à la partie hôte (24 → 26) → 2² = <strong>4 sous-réseaux</strong>, qui avancent de 64 en 64 : .0, .64, .128, .192.",
        ref: "Chapitre 04"
    },
    {
        q: "En VLSM, dans quel ordre attribue-t-on les blocs ?",
        c: ["Du plus gros besoin au plus petit", "Du plus petit besoin au plus gros", "Dans l'ordre alphabétique des VLAN", "Peu importe, tant qu'il n'y a pas de chevauchement"],
        a: 0,
        why: "Du plus gros au plus petit. En commençant par les petits, les grands blocs ne rentrent plus dans les trous laissés : il faut tout recommencer.",
        ref: "Chapitre 06"
    },
    {
        q: "Quel masque pour une liaison point-à-point entre deux routeurs ?",
        c: ["/30", "/29", "/31 obligatoirement", "/24"],
        a: 0,
        why: "<strong>/30</strong> : 2² − 2 = 2 adresses utilisables, exactement ce qu'il faut pour les deux extrémités, sans gaspiller.",
        ref: "Chapitre 06"
    },
    {
        q: "<code>192.168.4.130/25</code> et <code>192.168.4.90/25</code> peuvent-elles communiquer sans routeur ?",
        c: ["Non : elles sont dans deux sous-réseaux différents (.0/25 et .128/25)", "Oui : elles partagent les trois premiers octets", "Oui : un /25 couvre tout le dernier octet", "Non : un /25 interdit la communication directe entre hôtes"],
        a: 0,
        why: "Block size d'un /25 = 128 → sous-réseaux .0 et .128. L'adresse .90 est dans <code>192.168.4.0/25</code>, l'adresse .130 dans <code>192.168.4.128/25</code>. Adresses voisines, sous-réseaux différents : il faut un routeur.",
        ref: "Chapitre 07"
    },
    {
        q: "À quelle notation CIDR correspond le masque <code>255.255.255.240</code> ?",
        c: ["/28", "/26", "/29", "/30"],
        a: 0,
        why: "240 = <code>11110000</code> → 4 bits à 1 dans le dernier octet, soit 24 + 4 = <strong>/28</strong>. Block size 16, 14 hôtes utilisables.",
        ref: "Chapitre 03"
    },
    {
        q: "Quel masque générique écrire dans une ACL pour viser tout le réseau <code>10.2.104.0/21</code> ?",
        c: ["<code>0.0.7.255</code>", "<code>0.0.0.255</code>", "<code>255.255.248.0</code>", "<code>0.0.8.255</code>"],
        a: 0,
        why: "/21 = 255.255.248.0 ; 255 − 248 = 7 sur le 3e octet, 255 − 0 = 255 sur le 4e : 0.0.7.255. <code>0.0.0.255</code> ne couvrirait qu'un /24 sur les huit.",
        ref: "Chapitre 08"
    },
    {
        q: "Un site reçoit <code>2001:db8:42::/48</code>. Combien de réseaux locaux /64 peut-il créer ?",
        c: ["65 536", "256", "4 096", "Autant que d'hôtes : 2<sup>80</sup>"],
        a: 0,
        why: "Entre /48 et /64, il reste 16 bits : 2<sup>16</sup> = 65 536 réseaux /64. 256 serait le nombre de /56.",
        ref: "Chapitre 09"
    }]
},

/* ═══════════════ PARCOURS 02 · INFRASTRUCTURE WINDOWS ═══════════════ */

"windows-server": {
    name: "Windows Server 2025",
    file: "windows-server.html",
    title: "Test — Windows Server 2025",
    intro: "Treize chapitres, dix questions : surtout des situations du lab Orion, et ce qu'il faut taper ou regarder.",
    pass: 70,
    questions: [
    {
        q: "SRV-FILE01 a <code>8.8.8.8</code> comme DNS. <code>Add-Computer -DomainName orion.local</code> échoue : « le domaine n'existe pas ». Que corriger ?",
        c: ["Mettre le DNS du serveur sur <code>172.16.50.10</code>, le contrôleur de domaine", "Recréer la forêt", "Désactiver le pare-feu de SRV-FILE01", "Renommer le serveur avant la jonction"],
        a: 0,
        why: "Un DNS public ne connaît pas orion.local ni ses enregistrements SRV. Un membre de domaine n'utilise que le DNS des DC.",
        ref: "Chapitre 02"
    },
    {
        q: "Pourquoi Active Directory ne fonctionne-t-il pas sans DNS ?",
        c: ["Les postes trouvent leurs contrôleurs de domaine par des enregistrements SRV publiés dans le DNS", "Le DNS stocke les mots de passe", "Kerberos est un service DNS", "Les GPO sont des enregistrements DNS"],
        a: 0,
        why: "La promotion publie _ldap._tcp, _kerberos._tcp… dans la zone. Sans eux, un poste ne sait pas quel serveur contacter.",
        ref: "Chapitre 03"
    },
    {
        q: "Qu'apporte la promotion de SRV-AD02 par IFM ?",
        c: ["L'annuaire est copié depuis un média local, au lieu d'être entièrement répliqué par le réseau", "SRV-AD02 devient maître de tous les rôles FSMO", "Il n'y a plus besoin de DNS sur SRV-AD02", "La réplication entre DC devient inutile"],
        a: 0,
        why: "IFM fournit une copie de la base ; la réplication ne transfère ensuite que les changements. Utile sur un lien lent.",
        ref: "Chapitre 04"
    },
    {
        q: "L'utilisateur <code>jsmith</code> doit pouvoir créer des comptes dans l'OU Development, et nulle part ailleurs. Que faire ?",
        c: ["Déléguer le contrôle de l'OU Development à jsmith (création et gestion des comptes)", "L'ajouter à Domain Admins", "L'ajouter à Account Operators", "Lui donner le contrôle total sur le domaine"],
        a: 0,
        why: "La délégation donne une tâche précise sur un conteneur précis : jsmith n'est pas administrateur du domaine.",
        ref: "Chapitre 05"
    },
    {
        q: "Un enregistrement DNS a été modifié sur le serveur, mais un poste continue d'utiliser l'ancienne adresse. Que faire sur le poste ?",
        c: ["<code>ipconfig /flushdns</code>", "<code>ipconfig /renew</code>", "<code>gpupdate /force</code>", "<code>arp -d *</code>"],
        a: 0,
        why: "Le poste garde la réponse en cache jusqu'à la fin de son TTL. Vider le cache force une nouvelle résolution.",
        ref: "Chapitre 06"
    },
    {
        q: "Le rôle DHCP est installé, l'étendue créée et active, mais aucun client n'obtient d'adresse. Quelle étape a probablement été oubliée ?",
        c: ["Autoriser le serveur DHCP dans Active Directory", "Créer une zone inverse", "Lier une GPO", "Installer DFS"],
        a: 0,
        why: "Dans un domaine, un serveur DHCP non autorisé ne distribue rien : Add-DhcpServerInDC, puis Get-DhcpServerInDC pour vérifier.",
        ref: "Chapitre 07"
    },
    {
        q: "Un client du domaine obtient <code>172.16.50.100</code> avec le DNS <code>172.16.50.1</code> (la passerelle). Que se passe-t-il ?",
        c: ["Il a une adresse, mais ne trouve pas le domaine : jonction et ouverture de session échouent", "Tout fonctionne", "Il n'a pas d'accès au réseau local", "Il obtient une adresse APIPA"],
        a: 0,
        why: "L'option 6 doit désigner les DC. C'est l'erreur à trouver dans le TP final.",
        ref: "Chapitre 07"
    },
    {
        q: "Un dossier partagé donne <em>Change</em> aux utilisateurs du domaine ; en NTFS, le groupe DEV-GRP a <em>Lecture</em> seulement. Quel est le droit effectif d'un membre de DEV-GRP par le réseau ?",
        c: ["Lecture", "Modification", "Contrôle total", "Aucun"],
        a: 0,
        why: "Par le réseau, on applique le plus restrictif des deux : partage (Change) et NTFS (Read) donnent Read.",
        ref: "Chapitre 08"
    },
    {
        q: "Une GPO de restrictions utilisateur est liée à une OU qui ne contient que des comptes d'<strong>ordinateurs</strong>. Que se passe-t-il ?",
        c: ["Rien : les réglages User s'appliquent aux utilisateurs contenus dans l'OU, et il n'y en a pas", "Elle s'applique à tous les utilisateurs qui ouvrent une session sur ces ordinateurs", "Elle s'applique au domaine entier", "Elle bloque l'ouverture de session"],
        a: 0,
        why: "Une GPO s'applique aux objets du conteneur où elle est liée : la partie User aux utilisateurs, la partie Computer aux ordinateurs (sauf traitement en boucle, hors programme).",
        ref: "Chapitre 10"
    },
    {
        q: "Un poste affiche « aucun serveur d'ouverture de session disponible ». Quelle commande vérifie en premier qu'il trouve un contrôleur de domaine ?",
        c: ["<code>nltest /dsgetdc:orion.local</code>", "<code>repadmin /replsummary</code>", "<code>gpresult /r</code>", "<code>netdom query fsmo</code>"],
        a: 0,
        why: "nltest interroge le DNS (SRV) et contacte le DC trouvé : il valide d'un coup le DNS et la joignabilité. Les autres commandes se lancent sur les DC ou supposent la session ouverte.",
        ref: "Chapitre 12"
    }
    ]
},

"powershell": {
    name: "PowerShell",
    file: "powershell.html",
    title: "Test — PowerShell",
    intro: "Dix chapitres, dix questions : que renvoie ce code, que taper, et pourquoi ça casse.",
    pass: 70,
    questions: [
    {
        q: "Tu ne connais pas la commande qui liste les VM Hyper-V. Quel est le réflexe le plus direct ?",
        c: ["<code>Get-Command -Noun *VM*</code>", "<code>Get-Member VM</code>", "<code>Get-Help -Online</code>", "<code>Find-VM</code>"],
        a: 0,
        why: "Get-Command cherche par verbe ou par nom ; les cmdlets suivent Verbe-Nom, donc *VM* sur le nom les trouve (Get-VM, New-VM…).",
        ref: "Chapitre 01"
    },
    {
        q: "<code>$a = Read-Host \"Nombre\"</code> (on tape 5), puis <code>$a + 3</code>. Qu'affiche PowerShell ?",
        c: ["<code>53</code>", "<code>8</code>", "Une erreur", "<code>5 3</code>"],
        a: 0,
        why: "Read-Host renvoie une chaîne ; l'élément de gauche est une chaîne, donc + concatène. Il faut [int]$a = Read-Host … pour obtenir 8.",
        ref: "Chapitre 02"
    },
    {
        q: "Que vaut <code>\"Pierre\" -eq \"pierre\"</code> ?",
        c: ["<code>$true</code>", "<code>$false</code>", "Une erreur de type", "<code>$null</code>"],
        a: 0,
        why: "Les comparaisons sont insensibles à la casse par défaut ; -ceq tient compte de la casse.",
        ref: "Chapitre 03"
    },
    {
        q: "Quelle boucle convient pour traiter chaque ligne d'un fichier de noms ?",
        c: ["<code>foreach ($nom in Get-Content noms.txt) { … }</code>", "<code>for ($i = 0; $i -le 10; $i++) { … }</code>", "<code>while ($true) { … }</code>", "<code>switch (noms.txt) { … }</code>"],
        a: 0,
        why: "foreach parcourt chaque élément d'une collection ; Get-Content renvoie une ligne par élément.",
        ref: "Chapitre 04"
    },
    {
        q: "<code>Import-Csv comptes.csv</code> d'un fichier enregistré par Excel en français renvoie des objets avec une seule propriété « Prenom;Nom;Login ». Que manque-t-il ?",
        c: ["<code>-Delimiter \";\"</code>", "<code>-Encoding UTF8</code> uniquement", "<code>-NoTypeInformation</code>", "Un en-tête dans le fichier"],
        a: 0,
        why: "Excel en français sépare par des points-virgules ; Import-Csv attend des virgules par défaut.",
        ref: "Chapitre 05"
    },
    {
        q: "Pourquoi <code>Get-Service | Format-Table | Export-Csv services.csv</code> donne-t-il un fichier inutilisable ?",
        c: ["Format-Table transforme les objets en mise en page ; il ne se place qu'en fin de pipeline", "Export-Csv ne lit pas les services", "Il manque -Force", "Get-Service ne renvoie pas d'objets"],
        a: 0,
        why: "Après Format-*, il n'y a plus d'objets métier, seulement des objets de formatage. On exporte directement, ou après Select-Object.",
        ref: "Chapitre 06"
    },
    {
        q: "Un <code>try { Get-Item C:\\inexistant } catch { … }</code> n'entre jamais dans le catch. Pourquoi ?",
        c: ["L'erreur est non bloquante : il faut <code>-ErrorAction Stop</code>", "try/catch n'existe pas en PowerShell", "Il faut un bloc finally", "Get-Item ne produit pas d'erreur"],
        a: 0,
        why: "catch n'attrape que les erreurs bloquantes ; -ErrorAction Stop transforme l'erreur de la cmdlet en erreur bloquante.",
        ref: "Chapitre 07"
    },
    {
        q: "Comment fournir le mot de passe initial des comptes créés par un script, proprement ?",
        c: ["<code>Read-Host -AsSecureString</code> au lancement du script", "L'écrire en clair dans le script", "Le mettre dans le CSV", "Utiliser le mot de passe de l'administrateur"],
        a: 0,
        why: "Le mot de passe ne doit jamais être stocké en clair dans un script ou un fichier versionné ; il est saisi masqué au lancement.",
        ref: "Chapitre 08"
    },
    {
        q: "Une VM du lab vient d'être créée et n'a pas encore d'adresse IP. Comment y exécuter un script depuis l'hôte Hyper-V ?",
        c: ["<code>Invoke-Command -VMName SRV-FILE01 -ScriptBlock { … }</code>", "<code>Enter-PSSession -ComputerName SRV-FILE01</code>", "<code>Test-WSMan SRV-FILE01</code>", "Impossible sans réseau"],
        a: 0,
        why: "PowerShell Direct (-VMName) passe par le bus de la VM, sans réseau. -ComputerName passe par WinRM, donc par le réseau.",
        ref: "Chapitre 09"
    },
    {
        q: "Une cascade de sept <code>elseif</code> compare toutes les combinaisons de pierre-papier-ciseaux. Quelle structure la remplace le mieux ?",
        c: ["Une table de hachage « ce qui bat quoi »", "Une boucle for", "Un tableau de sept chaînes", "Une fonction récursive"],
        a: 0,
        why: "La règle devient une donnée ($bat[$j1] -eq $j2) : une ligne au lieu de sept conditions, et facile à étendre.",
        ref: "Chapitre 10"
    }
    ]
},

"storage-clustering": {
    name: "Stockage & Clustering",
    file: "storage-clustering.html",
    title: "Test — Stockage & Clustering",
    intro: "Du disque au cluster de basculement : onze chapitres, huit questions. Beaucoup de pièges classiques de production.",
    pass: 70,
    questions: [
    {
        q: "Quelle est la différence de fond entre un NAS et un SAN ?",
        c: ["Le NAS livre des fichiers, le SAN livre des blocs", "Le NAS est interne au serveur, le SAN est externe", "Le NAS utilise iSCSI, le SAN utilise SMB", "Le SAN ne sert qu'aux sauvegardes"],
        a: 0,
        why: "NAS = partage de fichiers (SMB/NFS). SAN = livraison de blocs. C'est pour cela qu'un serveur voit un LUN SAN comme un disque local qu'il partitionne et formate lui-même — et c'est ce qui rend le clustering possible.",
        ref: "Chapitre 01"
    },
    {
        q: "Contre quoi le RAID protège-t-il — et contre quoi non ?",
        c: ["Il protège d'une panne de disque, pas de l'effacement, de la corruption ni du vol", "Il protège de tout, y compris de la suppression accidentelle", "Il protège de la corruption logique mais pas de la panne matérielle", "Il remplace la sauvegarde si le nombre de disques est suffisant"],
        a: 0,
        why: "Un RAID n'est pas une sauvegarde : la suppression d'un fichier est répliquée instantanément sur tous les disques. Il traite la disponibilité face à une panne matérielle, rien d'autre.",
        ref: "Chapitre 02"
    },
    {
        q: "Un utilisateur a le Contrôle total en NTFS mais n'accède qu'en lecture via le réseau. Pourquoi ?",
        c: ["Le droit effectif à travers le réseau est le plus restrictif des droits de partage et NTFS", "Les droits NTFS ne s'appliquent pas au trafic SMB", "Il faut redémarrer le service Serveur pour appliquer NTFS", "Le Contrôle total exige d'être administrateur local"],
        a: 0,
        why: "Permissions de partage et permissions NTFS sont deux jeux distincts ; à travers le réseau, c'est <strong>le plus restrictif des deux</strong> qui gagne. C'est la cause n°1 des « pourtant je lui ai donné le contrôle total ».",
        ref: "Chapitre 04"
    },
    {
        q: "Que dit la règle 3-2-1 ?",
        c: ["3 copies des données, sur 2 supports différents, dont 1 hors site", "3 sauvegardes par jour, 2 par semaine, 1 par mois", "3 disques en RAID, 2 serveurs, 1 cluster", "3 ans de rétention, 2 restaurations testées, 1 responsable"],
        a: 0,
        why: "3 copies, 2 supports, 1 hors site. La copie hors site couvre le sinistre local ; et une sauvegarde jamais restaurée n'est pas une sauvegarde, c'est une hypothèse.",
        ref: "Chapitre 06"
    },
    {
        q: "Pourquoi un cluster à deux nœuds a-t-il besoin d'un disque témoin ?",
        c: ["Pour apporter la voix impaire qui départage et éviter le split-brain", "Pour stocker les journaux du cluster", "Pour accélérer le basculement", "Pour héberger la base de données du rôle clusterisé"],
        a: 0,
        why: "À deux nœuds, un incident réseau donne une voix à chacun : égalité, et risque que les deux se déclarent actifs en écrivant sur le même LUN. Le témoin (2 Go suffisent) apporte la voix qui tranche.",
        ref: "Chapitre 09"
    },
    {
        q: "Les deux nœuds voient le même LUN iSCSI. Dans quel état doivent rester ces disques avant que le cluster ne les prenne en charge ?",
        c: ["Offline", "Online et formatés sur les deux nœuds", "Online sur le nœud principal uniquement", "Peu importe : iSCSI gère l'accès concurrent"],
        a: 0,
        why: "Si les deux nœuds écrivent hors du contrôle du cluster, le système de fichiers est corrompu. Tant que le cluster n'a pas pris la main, les disques restent <strong>offline</strong>.",
        ref: "Chapitre 08"
    },
    {
        q: "De quoi un cluster de basculement protège-t-il réellement ?",
        c: ["De la panne d'un nœud", "De la panne du SAN", "D'un fichier supprimé par erreur", "D'un rançongiciel"],
        a: 0,
        why: "Le cluster couvre la panne d'un serveur. Panne du SAN, suppression et chiffrement par rançongiciel frappent le stockage partagé, clusterisé ou non — seules les sauvegardes répondent à ces trois-là.",
        ref: "Chapitre 11"
    },
    {
        q: "Quelle affirmation sur la réplication DFS est correcte ?",
        c: ["Une suppression ou une corruption se réplique elle aussi, fidèlement", "Elle conserve un historique permettant de revenir en arrière", "Elle remplace une sauvegarde si les copies sont sur deux sites", "Elle ne réplique que les fichiers modifiés depuis la dernière sauvegarde"],
        a: 0,
        why: "La réplication est un miroir, pas une machine à remonter le temps : ce qui est détruit d'un côté disparaît de l'autre, rapidement et fidèlement.",
        ref: "Chapitre 05"
    }]
},

"rds": {
    name: "Bureau à distance (RDS)",
    file: "rds.html",
    title: "Test — Bureau à distance (RDS)",
    intro: "Sept chapitres, huit questions : les rôles, le déploiement, et ce qui le fait tenir dans la durée.",
    pass: 70,
    questions: [
    {
        q: "Quel service de rôle exécute réellement les applications des utilisateurs ?",
        c: ["RD Session Host (RDSH)", "RD Connection Broker (RDCB)", "RD Web Access (RDWA)", "RD Licensing"],
        a: 0,
        why: "Le Session Host exécute ; le Broker répartit et reconnecte ; le Web Access publie la liste des ressources.",
        ref: "Chapitre 01"
    },
    {
        q: "Un utilisateur se déconnecte sans fermer sa session, puis se reconnecte. Quel rôle le ramène sur sa session existante ?",
        c: ["Le Connection Broker", "Le Web Access", "La passerelle", "Le serveur de licences"],
        a: 0,
        why: "Le broker garde la trace des sessions et reconnecte l'utilisateur sur l'hôte où sa session tourne encore.",
        ref: "Chapitre 01"
    },
    {
        q: "L'assistant de déploiement échoue sur SRV-RDSH2. Quelle vérification faire d'abord ?",
        c: ["Qu'il est membre du domaine et ajouté au pool de serveurs du Server Manager", "Qu'il a une licence RDS", "Qu'il a un certificat", "Qu'il a WordPad"],
        a: 0,
        why: "Le déploiement s'orchestre à distance : chaque serveur doit être joignable et visible dans le pool avant de lancer l'assistant.",
        ref: "Chapitre 03"
    },
    {
        q: "Une RemoteApp s'ouvre pour certains utilisateurs et pas pour d'autres, dans la même collection. Cause probable ?",
        c: ["Le programme n'est pas installé au même chemin sur tous les hôtes de session", "Le certificat a expiré", "La période de grâce est terminée", "Le DNS du client est faux"],
        a: 0,
        why: "Le broker répartit les utilisateurs entre les hôtes : une application absente d'un hôte ne marche que pour ceux envoyés sur l'autre.",
        ref: "Chapitre 04"
    },
    {
        q: "Combien de temps un déploiement RDS fonctionne-t-il sans serveur de licences configuré ?",
        c: ["120 jours", "30 jours", "180 jours", "Indéfiniment en labo"],
        a: 0,
        why: "La période de grâce dure 120 jours ; ensuite les connexions sont refusées sans CAL délivrée par un serveur de licences activé.",
        ref: "Chapitre 05"
    },
    {
        q: "Des employés se connectent chacun depuis leur PC de bureau, leur portable et leur PC personnel. Quel mode de licence choisir ?",
        c: ["Par utilisateur (Per User)", "Par périphérique (Per Device)", "Aucun : RDS est inclus", "Un mode par appareil et par utilisateur"],
        a: 0,
        why: "Une CAL par personne couvre tous ses appareils ; Per Device conviendrait à des postes partagés par plusieurs personnes.",
        ref: "Chapitre 05"
    },
    {
        q: "Le certificat <code>rdwa.orion.local</code> est créé dans le magasin de SRV-RDCB, mais le portail présente toujours l'ancien. Que manque-t-il ?",
        c: ["L'affecter au déploiement avec <code>Set-RDCertificate</code> (ou Edit Deployment Properties → Certificates)", "Redémarrer le client", "Créer un enregistrement MX", "Passer en licence Per Device"],
        a: 0,
        why: "Créer un certificat ne suffit pas : il doit être affecté à chaque rôle (RDWebAccess, RDPublishing, RDRedirector).",
        ref: "Chapitre 06"
    },
    {
        q: "Comment donner un accès RDS depuis Internet proprement ?",
        c: ["Par une passerelle RD publiée en HTTPS (443), avec un certificat public", "En ouvrant le port 3389 vers les hôtes de session", "En ouvrant le port 3389 vers le broker", "En désactivant NLA"],
        a: 0,
        why: "3389 exposé sur Internet est scanné et attaqué en permanence. La passerelle encapsule RDP dans HTTPS et filtre par CAP/RAP.",
        ref: "Chapitre 07"
    }
    ]
},

"exchange-securite": {
    name: "Exchange & PKI",
    file: "exchange-securite.html",
    title: "Test — Exchange & PKI",
    intro: "Messagerie et cryptographie appliquée. Les deux sens du chiffrement asymétrique sont le cœur du test : si tu les tiens, le reste suit.",
    pass: 70,
    questions: [
    {
        q: "Pour envoyer un message que <strong>seul</strong> le destinataire pourra lire, avec quelle clé chiffre-t-on ?",
        c: ["La clé publique du destinataire", "Sa propre clé privée", "Sa propre clé publique", "La clé privée du destinataire"],
        a: 0,
        why: "Confidentialité : on chiffre avec la clé <strong>publique du destinataire</strong>, lui seul déchiffre avec sa clé privée. C'est le premier des deux sens du chiffrement asymétrique.",
        ref: "Chapitre 03"
    },
    {
        q: "Que prouve un message correctement déchiffré avec la clé <strong>publique</strong> de Marvin ?",
        c: ["Que seul Marvin a pu le produire : c'est une signature numérique", "Que le message est confidentiel", "Que le message n'a pas été lu en chemin", "Que Marvin possède un certificat valide de sa CA"],
        a: 0,
        why: "Seule sa clé privée peut produire quelque chose que sa clé publique ouvre. La signature garantit <strong>qui a écrit</strong> et que rien n'a bougé — elle ne cache rien.",
        ref: "Chapitre 03"
    },
    {
        q: "Quelle commande retire la boîte aux lettres d'un utilisateur <strong>sans</strong> supprimer son compte AD ?",
        c: ["<code>Disable-Mailbox</code>", "<code>Remove-Mailbox</code>", "<code>Set-Mailbox -Disabled</code>", "<code>Remove-ADUser</code>"],
        a: 0,
        why: "<code>Remove-Mailbox</code> supprime aussi le compte AD. Pour ne retirer que la messagerie en conservant l'utilisateur : <code>Disable-Mailbox</code>. La nuance a coûté cher à beaucoup de monde.",
        ref: "Chapitre 02"
    },
    {
        q: "Qu'apporte une <strong>Enterprise Root CA</strong> par rapport à un certificat auto-signé ?",
        c: ["Elle publie sa racine dans AD : tous les postes du domaine lui font confiance sans manipulation", "Elle chiffre plus fortement les communications", "Elle supprime le besoin de renouveler les certificats", "Elle permet de se passer de DNS"],
        a: 0,
        why: "Un auto-signé dit « c'est moi qui le dis ». La CA d'entreprise ajoute une autorité de confiance, et sa publication dans AD fait que chaque poste valide la chaîne sans alerte — Outlook et OWA se connectent silencieusement.",
        ref: "Chapitre 05"
    },
    {
        q: "De quoi Exchange dépend-il pour fonctionner ?",
        c: ["D'Active Directory pour les comptes", "Du DNS pour le routage du courrier (MX)", "D'un serveur SharePoint pour l'archivage", "D'un cluster de basculement obligatoire"],
        a: [0, 1],
        why: "Exchange = AD + DNS + serveur de messagerie. Les boîtes sont liées aux comptes AD, le routage SMTP dépend des enregistrements MX. On prépare toujours l'annuaire avant d'installer Exchange.",
        ref: "Chapitre 01"
    },
    {
        q: "Dans quel ordre se déroule l'obtention d'un certificat serveur pour Exchange ?",
        c: ["Générer la CSR sur Exchange → la faire signer par la CA → assigner le certificat aux services", "Créer le certificat sur la CA → l'exporter → l'importer dans AD", "Assigner un auto-signé → demander sa validation à la CA → le remplacer", "Publier la racine → générer la clé privée sur la CA → l'envoyer à Exchange"],
        a: 0,
        why: "La clé privée ne quitte jamais le serveur : Exchange génère la demande (CSR), la CA la signe, on assigne le certificat obtenu aux services. Comme la racine est dans le magasin de confiance via AD, le client valide sans alerte.",
        ref: "Chapitre 06"
    },
    {
        q: "Que garantit une signature numérique — et que ne garantit-elle pas ?",
        c: ["Elle garantit l'authenticité et l'intégrité, pas la confidentialité", "Elle garantit la confidentialité, pas l'intégrité", "Elle garantit les trois à la fois", "Elle garantit seulement la date d'envoi"],
        a: 0,
        why: "Signer prouve qui a écrit et que rien n'a été modifié. Le contenu reste lisible par tous : pour le cacher, il faut chiffrer en plus, avec la clé publique du destinataire.",
        ref: "Chapitre 03"
    }]
},

"sql-server": {
    name: "SQL Server",
    file: "sql-server.html",
    title: "Test — SQL Server",
    intro: "Dix questions d'administration, choisies parmi les erreurs qui coûtent le plus cher en production : dimensionnement, sauvegardes, droits et diagnostic.",
    pass: 70,
    questions: [
    {
        q: "Le fichier <code>.ldf</code> d'une base grossit. Que ne faut-il surtout pas faire ?",
        c: ["Le supprimer à la main : la base devient irrécupérable", "Sauvegarder le journal des transactions", "Vérifier le mode de récupération de la base", "Regarder si des transactions restent ouvertes"],
        a: 0,
        why: "Le <code>.ldf</code> n'est pas un log Windows qu'on efface quand il gêne : c'est ce qui permet au moteur d'annuler et de rejouer. La bonne réponse est de sauvegarder le journal, ou de revoir le mode de récupération.",
        ref: "Chapitre 01"
    },
    {
        q: "Une base est en mode de récupération FULL mais personne ne sauvegarde le journal. Quelle en est la conséquence ?",
        c: ["Le <code>.ldf</code> grossit jusqu'à saturer le disque", "Les sauvegardes complètes échouent", "La base bascule automatiquement en SIMPLE", "Les performances de lecture s'effondrent"],
        a: 0,
        why: "FULL conserve toutes les transactions jusqu'à une sauvegarde de journal. FULL sans sauvegarde de journal est <strong>pire</strong> que SIMPLE : on a les inconvénients des deux et les garanties d'aucun.",
        ref: "Chapitre 07"
    },
    {
        q: "Pour changer le compte de service de SQL Server, quel outil utiliser ?",
        c: ["Le SQL Server Configuration Manager", "<code>services.msc</code>", "Le Gestionnaire des tâches", "SSMS, onglet Sécurité"],
        a: 0,
        why: "Seul le Configuration Manager pose les ACL NTFS, les droits registre et les appartenances aux groupes locaux qui vont avec. <code>services.msc</code> change le compte sans rien de tout cela — et le service ne redémarre plus.",
        ref: "Chapitre 04"
    },
    {
        q: "Dans la configuration réseau, que doit contenir le champ <strong>TCP Dynamic Ports</strong> ?",
        c: ["Rien : il doit être laissé vide", "La valeur 0", "Le numéro de port fixe choisi", "La valeur 1433"],
        a: 0,
        why: "Un <code>0</code> n'est pas « aucun port dynamique » : c'est la valeur qui <strong>réactive</strong> l'attribution dynamique. Le port redevient variable au prochain redémarrage et la règle de pare-feu ne protège plus rien.",
        ref: "Chapitre 05"
    },
    {
        q: "<code>SERVEUR\\INSTANCE</code> échoue mais <code>SERVEUR,PORT</code> fonctionne. Que faut-il regarder ?",
        c: ["Le SQL Server Browser et l'UDP 1434", "Le moteur de base de données lui-même", "Les droits du login utilisé", "La collation de l'instance"],
        a: 0,
        why: "La forme <code>SERVEUR\\INSTANCE</code> passe par le Browser pour résoudre le port. Si elle seule échoue, c'est un problème de résolution de port, pas de moteur — deux commandes suffisent à trancher.",
        ref: "Chapitre 05"
    },
    {
        q: "Que faut-il faire pour qu'un <code>sp_configure</code> prenne effet ?",
        c: ["Exécuter <code>RECONFIGURE</code>", "Redémarrer le service SQL Server", "Relancer SSMS", "Rien : la valeur est appliquée immédiatement"],
        a: 0,
        why: "<code>sp_configure</code> n'enregistre que la valeur souhaitée ; rien n'est appliqué avant <code>RECONFIGURE</code>. Et pour une option avancée comme <code>max server memory</code>, il faut activer <code>show advanced options</code> ne serait-ce que pour la lire.",
        ref: "Chapitre 06"
    },
    {
        q: "Vous restaurez une base sur une autre instance : les utilisateurs ne voient plus rien. Pourquoi ?",
        c: ["Les users sont venus avec la base, mais leurs logins étaient dans <code>master</code>", "La sauvegarde était corrompue", "La collation de la nouvelle instance est différente", "Le mode de récupération a changé pendant la restauration"],
        a: 0,
        why: "Le <strong>login</strong> vit dans <code>master</code>, le <strong>user</strong> vit dans la base. D'où les utilisateurs orphelins après restauration, recollés par <code>ALTER USER [nom] WITH LOGIN = [nom]</code>.",
        ref: "Chapitre 10"
    },
    {
        q: "Un utilisateur conserve un accès malgré un <code>REVOKE</code>. Quelle règle explique cela ?",
        c: ["<code>REVOKE</code> remet à neutre ; si le droit vient aussi d'un rôle, il est conservé", "<code>REVOKE</code> ne s'applique qu'après redémarrage du service", "<code>REVOKE</code> est ignoré sur les bases en FULL", "<code>REVOKE</code> n'existe que pour les logins, pas pour les users"],
        a: 0,
        why: "Priorité : <code>DENY</code> &gt; <code>GRANT</code> &gt; rien. <code>REVOKE</code> retire seulement l'attribution directe. Et <code>sysadmin</code> passe outre tout, même un <code>DENY</code>.",
        ref: "Chapitre 10"
    },
    {
        q: "Un blocage dure depuis vingt minutes. Quelle est la cause la plus probable ?",
        c: ["Une transaction ouverte et jamais validée", "Un index fragmenté", "Une mémoire insuffisante", "Une sauvegarde en cours"],
        a: 0,
        why: "Le blocage est le mécanisme normal d'isolation ; il devient un incident quand il dure. Presque toujours : une fenêtre SSMS laissée après un <code>BEGIN TRAN</code>, ou une application qui ne fait pas son <code>COMMIT</code>.",
        ref: "Chapitre 12"
    },
    {
        q: "Une base passe en <code>SUSPECT</code>. Quel est le premier réflexe ?",
        c: ["Lire le journal d'erreurs du moteur", "Redémarrer le service SQL Server", "Lancer <code>DBCC CHECKDB ... REPAIR_ALLOW_DATA_LOSS</code>", "Détacher puis rattacher la base"],
        a: 0,
        why: "<code>RECOVERY_PENDING</code> et <code>SUSPECT</code> sont des symptômes de problèmes <em>sous</em> SQL Server : disque plein, volume démonté, fichier supprimé. Redémarrer efface justement les informations qui permettaient de comprendre.",
        ref: "Chapitre 12"
    }]
},

"sharepoint": {
    name: "SharePoint Server SE",
    file: "sharepoint.html",
    title: "Test — SharePoint Server SE",
    intro: "Théorie et pratique : le choix Server vs Online, l'architecture en couches, et la question qui fâche — qui sauvegarde vos données.",
    pass: 70,
    questions: [
    {
        q: "Quelle question tranche réellement entre SharePoint Server et SharePoint Online ?",
        c: ["Qui gère l'infrastructure", "Le nombre d'utilisateurs", "Le volume de documents stockés", "La version de Windows Server disponible"],
        a: 0,
        why: "Server = contrôle et personnalisation maximaux, au prix d'une équipe IT. Online = simplicité et accès partout, au prix d'une moindre flexibilité technique. Tout le reste découle de ce choix.",
        ref: "Chapitre 02"
    },
    {
        q: "Quelle est la hiérarchie logique de SharePoint, du plus large au plus fin ?",
        c: ["Ferme → application web → base de contenu → collection de sites → sites", "Ferme → collection de sites → application web → sites", "Application web → ferme → site → base de contenu", "Collection de sites → ferme → base de contenu → sites"],
        a: 0,
        why: "Cette hiérarchie commande deux décisions concrètes : on <strong>sauvegarde</strong> au niveau de la base de contenu, et on <strong>sécurise</strong> au niveau de la collection de sites.",
        ref: "Chapitre 07"
    },
    {
        q: "Quels sont les trois tiers d'une ferme SharePoint ?",
        c: ["Web Front End → Application → SQL Server", "Client → Web Front End → Active Directory", "Web Front End → Cache → Stockage objet", "Application → Recherche → Sauvegarde"],
        a: 0,
        why: "WFE → Application → SQL Server, ce dernier étant obligatoire. Ces trois tiers se déclinent en 4 topologies ; le point le plus sensible à sauvegarder est toujours la base SQL.",
        ref: "Chapitre 06"
    },
    {
        q: "Dans Microsoft 365, qui est responsable de la sauvegarde de vos contenus ?",
        c: ["Vous — Microsoft garantit la disponibilité du service, pas la restauration de vos données", "Microsoft, intégralement, dans le cadre de l'abonnement", "Microsoft pour Exchange, vous pour SharePoint", "Personne : les données sont répliquées, donc indestructibles"],
        a: 0,
        why: "Cela vaut pour tout M365 : boîtes Exchange, fichiers OneDrive, espaces Teams. Un backup tiers et la règle 3-2-1 sont le filet de sécurité indispensable.",
        ref: "Chapitre 10"
    },
    {
        q: "Quelle commande sauvegarde une <strong>collection de sites</strong> seule ?",
        c: ["<code>Export-SPWeb</code>", "<code>Backup-SPFarm</code>", "<code>Backup-SqlDatabase</code>", "<code>Restore-SPSite</code>"],
        a: 0,
        why: "Trois niveaux : ferme complète (<code>Backup-SPFarm</code>), bases SQL (le plus fiable, <code>Backup-SqlDatabase</code>) et collection de sites (<code>Export-SPWeb</code>).",
        ref: "Chapitre 18"
    },
    {
        q: "Quels sont les prérequis matériels et logiciels d'une installation SharePoint Server SE ?",
        c: ["4 cœurs et 16–24 Go de RAM au minimum", "Windows Server 2019 à 2025 et SQL Server 2019 CU5 ou 2022", "Un cluster de basculement à deux nœuds", "SharePoint Designer installé sur le serveur"],
        a: [0, 1],
        why: "Quatre piliers avant l'installation : matériel, logiciel (dont .NET 4.8), topologie (mono-serveur ou MinRole) et dépendances (AD, DNS, SSL, comptes de service dédiés).",
        ref: "Chapitre 09"
    },
    {
        q: "Où SharePoint se situe-t-il dans le spectre On-site / IaaS / PaaS / SaaS ?",
        c: ["Server couvre On-site et IaaS, Online est du pur SaaS ; le PaaS n'existe pas en natif", "Server est du PaaS, Online du SaaS", "Les deux sont du SaaS, à des niveaux de service différents", "Server est On-site uniquement, Online est du IaaS"],
        a: 0,
        why: "SharePoint occupe les deux extrémités du spectre. Le PaaS ne sert qu'à <em>étendre</em> Online, pas à l'héberger.",
        ref: "Chapitre 04"
    },
    {
        q: "En SharePoint Online, quelles couches Microsoft absorbe-t-il ?",
        c: ["Le bas de la pile : données et infrastructure", "L'interface utilisateur uniquement", "Toutes les couches, y compris la gouvernance des contenus", "Aucune : Online n'est qu'une façade"],
        a: 0,
        why: "Cinq couches, de l'interface à l'infrastructure. En Online, Microsoft prend le bas de la pile ; en Server, vous en restez responsable — d'où le besoin d'une équipe IT.",
        ref: "Chapitre 05"
    }]
},

"dpm": {
    name: "System Center DPM",
    file: "dpm.html",
    title: "Test — System Center DPM",
    intro: "Huit chapitres, dix questions. Elles portent sur ce qui fait échouer une installation DPM et sur la distinction qui décide de ce qu'on pourra restaurer : synchronisation ou point de récupération.",
    pass: 70,
    questions: [
    {
        q: "Dans le TP, où vit la base de DPM, et quel choix le traduit dans l'assistant d'installation ?",
        c: ["Sur un SQL Server distant : <em>Use stand-alone SQL Server</em>", "Sur le serveur DPM, dans une instance SQL Express installée par le setup", "Sur le contrôleur de domaine, avec l'annuaire", "Dans un fichier local du pool de stockage"],
        a: 0,
        why: "La base <code>DPMDB_…</code> est créée sur un serveur SQL séparé. C'est ce qui rend la préparation de SQL — collation, gMSA, SSRS, DPM Support Files, certificat — si importante.",
        ref: "Chapitre 01 · ch. 04"
    },
    {
        q: "Pendant le setup, quel compte crée réellement la base de DPM sur SQL ?",
        c: ["Le compte de la session ouverte sur le serveur DPM, car le script est lancé avec <code>sqlcmd -E</code>", "Le compte saisi dans les champs User Name / Password de l'assistant", "Le compte ordinateur du serveur DPM", "Le gMSA du service SQL"],
        a: 0,
        why: "<code>-E</code> = authentification Windows de la session en cours. Il faut donc être connecté sur DPM avec un compte du domaine <strong>sysadmin</strong> sur SQL, quel que soit le compte saisi dans l'assistant.",
        ref: "Chapitre 04"
    },
    {
        q: "Quelle collation DPM exige-t-il pour l'instance SQL qui porte sa base ?",
        c: ["<code>SQL_Latin1_General_CP1_CI_AS</code>", "<code>French_CI_AS</code>", "<code>Latin1_General_100_CI_AS_SC_UTF8</code>", "N'importe laquelle, tant qu'elle est insensible à la casse"],
        a: 0,
        why: "DPM n'en accepte pas d'autre. Et c'est le seul point de la préparation qui ne se rattrape pas sans réinstaller l'instance : il se choisit à l'installation de SQL.",
        ref: "Chapitre 03"
    },
    {
        q: "Que se passe-t-il quand on ajoute un volume au pool de stockage de DPM ?",
        c: ["DPM le formate (en ReFS) et se le réserve : tout ce qui était dessus est perdu", "DPM y crée un dossier de sauvegarde à côté des fichiers existants", "Le volume est partagé en lecture seule sur le réseau", "Rien tant qu'aucun groupe de protection n'y écrit"],
        a: 0,
        why: "Le message en haut de la fenêtre le dit : les volumes ajoutés sont formatés. Ensuite le volume appartient à DPM — son nom devient un GUID, on n'y dépose rien à la main.",
        ref: "Chapitre 05"
    },
    {
        q: "Les agents sont installés avec succès sur deux serveurs, qui apparaissent dans <em>Unprotected computers with protection agent</em>. Pourquoi « non protégés » ?",
        c: ["Ils ne font encore partie d'aucun groupe de protection", "L'installation de l'agent a échoué en silence", "Il manque un redémarrage des serveurs", "Le pool de stockage est plein"],
        a: 0,
        why: "Un agent permet à DPM de voir le serveur ; c'est le groupe de protection qui décide quoi sauvegarder, où, et à quelle fréquence.",
        ref: "Chapitre 05 · ch. 06"
    },
    {
        q: "Un groupe synchronise toutes les 15 minutes et crée un point de récupération chaque vendredi à 19 h. Que peut-on restaurer un mercredi ?",
        c: ["L'état du vendredi précédent à 19 h : on ne restaure que des points de récupération", "L'état d'il y a au plus 15 minutes, grâce à la synchronisation", "L'état de la veille, la synchronisation créant un point par jour", "Rien avant le vendredi suivant"],
        a: 0,
        why: "La synchronisation tient le réplica à jour, mais ne crée rien de restaurable. Seuls les points de récupération figent une version qu'on peut rendre.",
        ref: "Chapitre 06"
    },
    {
        q: "On restaure un fichier qui existe encore à son emplacement d'origine, sans vouloir rien détruire. Quelle option choisir ?",
        c: ["<em>Create copy</em>", "<em>Overwrite</em>", "<em>Skip</em>", "<em>Recover to an alternate location</em> est obligatoire dans ce cas"],
        a: 0,
        why: "<em>Create copy</em> restaure à côté du fichier existant. <em>Overwrite</em> le remplace, <em>Skip</em> ne restaure rien pour les fichiers déjà présents.",
        ref: "Chapitre 07"
    },
    {
        q: "Erreur 811 « The DPM database was not created ». Quelle est la cause trouvée dans le TP ?",
        c: ["Le <code>sqlcmd</code> ODBC 18 du setup refuse le certificat auto-généré de SQL, faute d'autorité de confiance", "La collation de l'instance SQL est incorrecte", "Le compte ordinateur de DPM n'a pas de login sur SQL", "La catégorie de jobs manquante dans <code>msdb</code>"],
        a: 0,
        why: "Depuis la version 18, le pilote ODBC chiffre toujours et exige un certificat de confiance. Remède : un certificat dédié sur SQL, importé dans les autorités racines de confiance du serveur DPM.",
        ref: "Chapitre 08"
    },
    {
        q: "Dans <code>DpmSetup.log</code>, après l'échec du script, apparaissent les erreurs 14262 et 15151. Comment les traiter ?",
        c: ["Comme des conséquences : c'est le setup qui défait ce qu'il a commencé, la cause est l'erreur d'avant", "Comme la cause : créer la catégorie manquante dans <code>msdb</code>", "Comme un problème de droits à corriger sur le rôle", "En réinstallant SQL Server"],
        a: 0,
        why: "Dans un journal, la cause est la première erreur, pas la plus bavarde. On reproduit l'appel <code>sqlcmd</code> à la main pour faire apparaître le vrai message.",
        ref: "Chapitre 08"
    },
    {
        q: "Avant de créer le gMSA qui fera tourner SQL, quel prérequis doit exister sur le domaine ?",
        c: ["Une clé racine KDS (<code>Add-KdsRootKey</code>)", "Une autorité de certification d'entreprise", "Un second contrôleur de domaine", "Un compte utilisateur portant le même nom"],
        a: 0,
        why: "Sans clé racine KDS, pas de gMSA. En lab, on l'antidate de 10 heures pour l'utiliser tout de suite ; normalement, on attend sa réplication sur tous les DC.",
        ref: "Chapitre 02"
    }]
},

"iis": {
    name: "IIS — Serveur web Windows",
    file: "iis.html",
    title: "Test — IIS, serveur web Windows",
    intro: "Huit chapitres, huit questions. L'objectif : savoir publier plusieurs sites sur un même serveur sans les mélanger, et comprendre ce qui se passe entre le binding et le DNS.",
    pass: 70,
    questions: [
    {
        q: "IIS est installé sans rien cocher de plus que le rôle. On veut maintenant ajouter le FTP. Que faut-il faire ?",
        c: ["Ajouter le service de rôle <em>FTP Server</em> par <em>Add roles and features</em>, sans réinstaller le rôle", "Désinstaller puis réinstaller le rôle Web Server en cochant FTP", "Installer un serveur FTP tiers, IIS ne sait pas faire de FTP", "Activer le FTP dans les <em>Bindings</em> du site par défaut"],
        a: 0,
        why: "Les services de rôle s'ajoutent à tout moment sur un rôle déjà installé. C'est précisément pour ça qu'on installe le rôle nu : on n'active que ce dont on a besoin, quand on en a besoin.",
        ref: "Chapitre 01 · ch. 08"
    },
    {
        q: "Deux sites doivent répondre sur la même IP et le même port 80. Qu'est-ce qui rend cela possible ?",
        c: ["Le <strong>nom d'hôte</strong> du binding : IIS lit l'en-tête <code>Host</code> et aiguille vers le bon site", "Deux pools d'applications distincts", "Deux dossiers physiques distincts", "Le mode <em>Integrated</em> du pipeline managé"],
        a: 0,
        why: "Sans nom d'hôte, deux sites en <code>*:80</code> entrent en conflit. C'est l'en-tête <code>Host</code> de la requête HTTP qui distingue les sites — pools et dossiers séparés sont nécessaires, mais ne font pas l'aiguillage.",
        ref: "Chapitre 06"
    },
    {
        q: "Pourquoi déclare-t-on <code>cafe</code> en <strong>CNAME</strong> vers <code>srv-web01.orion.local</code> plutôt qu'en enregistrement A vers 172.16.50.25 ?",
        c: ["Parce qu'une seule ligne — l'enregistrement A du serveur — est à corriger si l'IP change", "Parce qu'un enregistrement A ne fonctionne pas avec plusieurs sites", "Parce que le CNAME est plus rapide à résoudre", "Parce qu'IIS refuse les requêtes venant d'un enregistrement A"],
        a: 0,
        why: "Le seul A est celui du serveur ; chaque site n'est qu'un alias vers lui. Avec des A multiples, un changement d'IP oblige à reprendre chaque enregistrement, avec le risque d'en oublier un.",
        ref: "Chapitre 06"
    },
    {
        q: "À quoi sert un pool d'applications ?",
        c: ["C'est le processus <code>w3wp.exe</code> qui exécute un site : unité d'isolation et identité d'exécution", "C'est le dossier physique dans lequel sont stockés les fichiers du site", "C'est le regroupement des sites qui partagent un même certificat", "C'est la file d'attente des requêtes HTTP entrantes"],
        a: 0,
        why: "Deux sites dans deux pools ne peuvent pas se planter l'un l'autre et tournent sous des identités différentes. Créer un site crée automatiquement un pool du même nom.",
        ref: "Chapitre 05"
    },
    {
        q: "Un site renvoie 403 alors que les fichiers sont bien présents dans le dossier. Quelle piste vient en premier ?",
        c: ["L'identité du pool d'applications n'a pas la lecture sur le dossier", "Le fichier <code>index.html</code> a un mauvais type MIME", "Le certificat du site a expiré", "Le nom d'hôte n'est pas déclaré dans le DNS"],
        a: 0,
        why: "IIS lit les fichiers sous l'identité du pool (<code>IIS AppPool\\&lt;nom&gt;</code>), pas sous celle de l'administrateur qui les a copiés. Un nom d'hôte absent du DNS ne donnerait aucune réponse du tout, pas un 403.",
        ref: "Chapitre 05 · ch. 07"
    },
    {
        q: "Pourquoi ne pas déposer son site dans <code>C:\\inetpub\\wwwroot</code> ?",
        c: ["Il hérite des réglages et du pool du site par défaut, et ne peut plus être arrêté ni sécurisé séparément", "IIS ne sert pas les fichiers de ce dossier aux clients distants", "Le dossier est en lecture seule pour le pool d'applications", "Le dossier est effacé à chaque redémarrage du service"],
        a: 0,
        why: "Un site = son propre dossier, son propre binding, son propre pool. Mélanger son contenu avec le site par défaut supprime toute possibilité d'isolation.",
        ref: "Chapitre 06"
    },
    {
        q: "Une page du site est vide alors que le HTML se charge : elle est générée par un fichier <code>.js</code>. Que regarder dans IIS ?",
        c: ["Les <strong>MIME Types</strong> et le <strong>Request Filtering</strong>", "Le <em>Default Document</em> du site", "Le <em>Managed Pipeline Mode</em> du pool", "Le <em>Directory Browsing</em>"],
        a: 0,
        why: "Une extension inconnue d'IIS n'est pas servie, et le filtrage des requêtes peut interdire l'extension ou le verbe. Le document par défaut ne joue que sur l'URL qui ne nomme aucune page.",
        ref: "Chapitre 04 · ch. 07"
    },
    {
        q: "Le site FTP du labo est configuré en <em>No SSL</em> avec authentification <em>Basic</em> sur <code>ORION\\Domain Users</code>. Quel est le problème en production ?",
        c: ["Les identifiants de domaine circulent en clair sur le réseau, et tout le domaine peut écrire", "Le FTP ne fonctionne pas sans certificat", "Les comptes du domaine ne peuvent pas servir à l'authentification FTP", "Le port 21 est bloqué par défaut sur Windows Server"],
        a: 0,
        why: "Sans SSL, identifiants et fichiers passent en clair. Et <code>Domain Users</code> contient tout le monde : en production, FTPS, un groupe dédié, et l'écriture limitée au strict nécessaire.",
        ref: "Chapitre 08"
    }]
},

/* ═════════════ PARCOURS 03 · RÉSEAU & TÉLÉPHONIE ═════════════ */

"ccna-reseau": {
    name: "CCNA — Réseau Cisco",
    file: "ccna-reseau.html",
    title: "Test — CCNA, réseau Cisco",
    intro: "Quinze chapitres de configuration et de vérification. Les questions ressemblent à l'examen pratique : que taper, et que conclure d'une sortie show.",
    pass: 70,
    questions: [
    {
        q: "Tu es en <code>R1(config-if)#</code> et tu veux voir l'état des interfaces sans quitter ce mode. Que tapes-tu ?",
        c: ["<code>do show ip interface brief</code>", "<code>show ip interface brief</code>", "<code>end show ip interface brief</code>", "<code>exit show ip interface brief</code>"],
        a: 0,
        why: "<code>show</code> n'existe pas en mode configuration ; le préfixe <code>do</code> l'exécute comme en mode privilégié.",
        ref: "Chapitre 01"
    },
    {
        q: "Pourquoi <code>service password-encryption</code> ne suffit-il pas à protéger les mots de passe ?",
        c: ["Il produit un codage de type 7, réversible en quelques secondes", "Il ne s'applique qu'à la console", "Il désactive SSH", "Il supprime enable secret"],
        a: 0,
        why: "Le type 7 masque à la lecture mais se décode facilement. La vraie protection vient de <code>secret</code> (haché) au lieu de <code>password</code>.",
        ref: "Chapitre 02"
    },
    {
        q: "Un trunk transporte les VLAN 10 et 20. L'admin tape <code>switchport trunk allowed vlan 30</code>. Que se passe-t-il ?",
        c: ["Le trunk ne transporte plus que le VLAN 30 : 10 et 20 sont coupés", "Le VLAN 30 s'ajoute aux deux autres", "La commande est refusée", "Le trunk repasse en access"],
        a: 0,
        why: "Sans <code>add</code>, la liste est remplacée. Pour compléter : <code>switchport trunk allowed vlan add 30</code>.",
        ref: "Chapitre 03"
    },
    {
        q: "Sur un switch de niveau 3, les SVI ont leurs adresses mais les VLAN ne communiquent pas entre eux. Que manque-t-il le plus probablement ?",
        c: ["<code>ip routing</code>", "<code>encapsulation dot1q</code>", "<code>switchport mode trunk</code>", "<code>ip helper-address</code>"],
        a: 0,
        why: "Un switch L3 ne route pas tant que <code>ip routing</code> n'est pas activé. <code>encapsulation dot1q</code> concerne les sous-interfaces d'un routeur.",
        ref: "Chapitre 04"
    },
    {
        q: "Dans le labo, quelle adresse un pool DHCP doit-il donner comme <code>default-router</code> au VLAN 10 ?",
        c: ["L'adresse virtuelle HSRP <code>10.2.119.254</code>", "L'adresse de R-EDGE1 <code>10.2.112.1</code>", "L'adresse de R-EDGE2 <code>10.2.112.2</code>", "L'adresse du serveur DHCP"],
        a: 0,
        why: "Les postes doivent viser l'adresse virtuelle : c'est elle qui survit à la panne d'un routeur. Donner l'adresse réelle de R-EDGE1 annulerait l'intérêt de HSRP.",
        ref: "Chapitre 05"
    },
    {
        q: "Deux routes vers <code>0.0.0.0/0</code> : une statique (AD 1) via 203.0.113.1 et une autre avec la distance 200 via 10.2.104.2. Laquelle est dans la table ?",
        c: ["Celle de distance 1 ; l'autre n'apparaît que si la première disparaît", "Les deux, en partage de charge", "Celle de distance 200, plus récente", "Aucune : elles sont en conflit"],
        a: 0,
        why: "À préfixe égal, la plus petite distance administrative gagne. La route à 200 est une route flottante de secours.",
        ref: "Chapitre 07"
    },
    {
        q: "<code>show ip ospf neighbor</code> n'affiche rien entre deux routeurs reliés. Quelles causes sont possibles ?",
        c: ["L'interface est passive", "Les deux interfaces sont dans des aires différentes", "Les minuteurs Hello/Dead diffèrent", "Le router-id est configuré manuellement"],
        a: [0, 1, 2],
        why: "Passive = pas de Hello ; aire, masque, minuteurs, authentification et MTU doivent concorder. Un router-id manuel est une bonne pratique, pas une cause de panne (s'il est unique).",
        ref: "Chapitre 08"
    },
    {
        q: "<code>show etherchannel summary</code> affiche <code>Po1(SD)</code> et les ports <code>Fa0/23(I)</code>, <code>Fa0/24(I)</code>. Que vérifier ?",
        c: ["La cohérence des deux côtés : modes LACP compatibles et ports configurés à l'identique", "Le serveur DHCP", "La route par défaut", "Le niveau Syslog"],
        a: 0,
        why: "SD = canal en panne, I = port isolé. Deux côtés en <code>passive</code>, ou des ports aux réglages différents (VLAN, duplex, mode), empêchent la formation du canal.",
        ref: "Chapitre 09"
    },
    {
        q: "R-EDGE1 (priorité 110, <code>track 1 decrement 20</code> sur son lien WAN) et R-EDGE2 (priorité 100), tous deux avec <code>preempt</code>. Le lien WAN de R-EDGE1 tombe. Qui devient actif ?",
        c: ["R-EDGE2, car R-EDGE1 tombe à 90", "R-EDGE1 reste actif", "Aucun : les postes perdent la passerelle", "Les deux à la fois"],
        a: 0,
        why: "110 − 20 = 90 &lt; 100 : avec preempt, R-EDGE2 prend la main et les postes sortent par la fibre qui fonctionne.",
        ref: "Chapitre 10"
    },
    {
        q: "Où placer une ACL <strong>étendue</strong> qui empêche les invités (VLAN 40) de joindre le LAN interne ?",
        c: ["En entrée (<code>in</code>) sur la sous-interface du VLAN 40, près de la source", "En sortie sur l'interface WAN", "Sur les lignes VTY", "Près de la destination, sur chaque VLAN interne"],
        a: 0,
        why: "Une ACL étendue se pose près de la source : le trafic interdit est jeté dès son entrée dans le routeur.",
        ref: "Chapitre 12"
    }
    ]
},

"cisco-securite": {
    name: "Cisco IOS — Sécurité, VLAN, STP & ACL",
    file: "cisco-securite.html",
    title: "Test — Cisco IOS, sécurité",
    intro: "Onze chapitres, dix questions : les gestes qui rendent un réseau Cisco sûr, et les pièges qui le cassent sans prévenir.",
    pass: 70,
    questions: [
    {
        q: "Après une heure de configuration, le commutateur redémarre et tout a disparu. Quelle commande avait été oubliée ?",
        c: ["<code>copy running-config startup-config</code>", "<code>show startup-config</code>", "<code>reload</code>", "<code>service password-encryption</code>"],
        a: 0,
        why: "La configuration active vit en RAM (<em>running-config</em>). Seule la copie vers la NVRAM (<em>startup-config</em>) survit au redémarrage.",
        ref: "Chapitre 01"
    },
    {
        q: "Que protège réellement <code>service password-encryption</code> ?",
        c: ["Un regard par-dessus l'épaule sur la configuration affichée", "Un fichier de configuration volé", "Le mot de passe du mode privilégié posé avec <code>enable secret</code>", "Les sessions Telnet"],
        a: 0,
        why: "C'est un encodage de type 7, réversible en une seconde. Les mots de passe réellement protégés sont ceux posés avec <code>secret</code>, qui sont hachés.",
        ref: "Chapitre 02"
    },
    {
        q: "Sur la ligne console, <code>password</code> est configuré mais aucun mot de passe n'est demandé à la connexion. Pourquoi ?",
        c: ["Il manque <code>login</code>", "Il manque <code>enable secret</code>", "Il manque <code>transport input ssh</code>", "Il manque <code>exec-timeout</code>"],
        a: 0,
        why: "<code>password</code> stocke le mot de passe, <code>login</code> demande de s'en servir : les deux sont nécessaires.",
        ref: "Chapitre 02"
    },
    {
        q: "Quelles étapes sont indispensables pour qu'un commutateur accepte des connexions SSH ?",
        c: ["Un nom d'hôte et un nom de domaine", "Une paire de clés RSA (<code>crypto key generate rsa</code>)", "<code>transport input ssh</code> sur les lignes VTY", "Un VLAN 1 actif"],
        a: [0, 1, 2],
        why: "Nom d'hôte et domaine servent à nommer la paire de clés, sans laquelle SSH ne démarre pas ; les lignes VTY doivent ensuite accepter SSH. Le VLAN 1, lui, est justement à neutraliser.",
        ref: "Chapitre 03"
    },
    {
        q: "Un port protégé par <code>port-security</code> (politique par défaut) voit arriver une adresse MAC inconnue. Que se passe-t-il ?",
        c: ["Le port s'éteint et passe en <code>err-disabled</code> jusqu'à une intervention manuelle", "Le port rejette les trames mais reste actif", "Le port apprend la nouvelle adresse à la place de l'ancienne", "Le commutateur redémarre"],
        a: 0,
        why: "La politique par défaut est <code>shutdown</code>. Le port ne revient pas seul : cause levée, puis <code>shutdown</code> / <code>no shutdown</code>.",
        ref: "Chapitre 03"
    },
    {
        q: "Pourquoi ajouter <code>switchport nonegotiate</code> sur un trunk ?",
        c: ["Pour couper DTP : un appareil qui se fait passer pour un commutateur n'obtient plus de trunk", "Pour que le trunk laisse passer tous les VLAN", "Pour changer le VLAN natif", "Pour activer le marquage 802.1Q"],
        a: 0,
        why: "DTP négocie un trunk automatiquement, donc en offre un à qui le demande. <code>nonegotiate</code> fige le trunk par configuration.",
        ref: "Chapitre 04"
    },
    {
        q: "Sur quel type de port active-t-on PortFast et BPDU Guard ?",
        c: ["Un port d'accès relié à un poste, une imprimante ou un serveur", "Un trunk entre deux commutateurs", "Le port qui mène au pont racine", "N'importe quel port, pour accélérer tout le réseau"],
        a: 0,
        why: "PortFast supprime l'attente qui empêche les boucles : il ne va que vers un périphérique terminal. BPDU Guard éteint le port si un commutateur s'y branche.",
        ref: "Chapitre 06"
    },
    {
        q: "Une ACL contient <code>permit any</code>, puis <code>deny host 10.1.1.1</code>. Que devient le trafic de 10.1.1.1 ?",
        c: ["Il passe : la première règle correspond et l'évaluation s'arrête", "Il est bloqué : le <code>deny</code> est plus précis", "Il est bloqué par le <code>deny any</code> implicite", "Cela dépend du sens d'application"],
        a: 0,
        why: "Les règles sont lues dans l'ordre et la première qui correspond décide. Les règles précises se placent avant les générales ; ici le compteur du <code>deny</code> restera à zéro.",
        ref: "Chapitre 07"
    },
    {
        q: "Un <code>traceroute</code> depuis un poste se termine par <code>A</code> au niveau d'un routeur. Qu'est-ce que cela signale ?",
        c: ["Le paquet est refusé par une règle administrative : une ACL", "Le routeur n'a pas de route", "Le délai a expiré", "Le port de destination est fermé"],
        a: 0,
        why: "<code>A</code> = administratively prohibited : la signature d'une ACL. On lit alors son contenu (<code>show access-lists</code>) et son application (<code>show ip interface</code>).",
        ref: "Chapitre 08"
    },
    {
        q: "Après l'activation de DHCP snooping sur un switch, plus aucun poste n'obtient d'adresse. Quelle est la cause la plus probable ?",
        c: ["Le port vers le serveur DHCP n'est pas déclaré <code>ip dhcp snooping trust</code>", "Le serveur DHCP est en panne", "Les postes sont en IPv6", "BPDU Guard a coupé les ports"],
        a: 0,
        why: "Par défaut tous les ports sont non fiables : les réponses DHCP qui arrivent par le lien montant sont jetées tant qu'il n'est pas en <code>trust</code>.",
        ref: "Chapitre 09"
    }]
},

"voip": {
    name: "Téléphonie IP (VoIP / ToIP)",
    file: "voip.html",
    title: "Test — Téléphonie IP",
    intro: "De la voix au paquet : protocoles, codecs, QoS et le grand classique du dépannage — « ça sonne, mais on n'entend rien ».",
    pass: 70,
    questions: [
    {
        q: "Quelle est la différence entre VoIP et ToIP ?",
        c: ["La VoIP transporte la voix ; la ToIP est la centrale téléphonique construite par-dessus", "La VoIP est analogique, la ToIP est numérique", "La VoIP concerne les mobiles, la ToIP les postes fixes", "Ce sont deux noms du même service"],
        a: 0,
        why: "Un appel Discord fait de la VoIP sans faire de la ToIP : il n'y a ni numéro, ni renvoi, ni messagerie unifiée derrière. La ToIP, c'est le service téléphonique complet.",
        ref: "Chapitre 01"
    },
    {
        q: "Pourquoi la QoS n'est-elle pas optionnelle en téléphonie IP ?",
        c: ["Un paquet de voix en retard est perdu : une syllabe ne se répare pas", "Parce que la voix consomme plus de bande passante qu'une vidéo", "Parce que le SIP exige une réservation de bande passante", "Parce que les téléphones IP ne supportent pas la retransmission TCP"],
        a: 0,
        why: "Un fichier qui arrive en retard se répare ; une syllabe non. La voix ne tolère ni la latence, ni la gigue, ni la perte — d'où la priorisation stricte de ce trafic.",
        ref: "Chapitre 02"
    },
    {
        q: "« Ça sonne, on décroche, mais personne n'entend rien. » Que se passe-t-il ?",
        c: ["La signalisation SIP passe, mais le flux RTP est bloqué", "Le codec négocié n'est pas supporté par le poste", "Le trunk SIP de l'opérateur est hors service", "Le PoE ne délivre pas assez de puissance"],
        a: 0,
        why: "SIP monte l'appel, RTP porte la voix — par des chemins différents. Si la sonnerie fonctionne, la signalisation va bien : c'est le RTP qu'un pare-feu ou un NAT bloque. Deux problèmes distincts, deux endroits à regarder.",
        ref: "Chapitre 05"
    },
    {
        q: "Quel arbitrage font G.711 et G.729 ?",
        c: ["G.711 privilégie la qualité, G.729 la bande passante", "G.711 privilégie la bande passante, G.729 la qualité", "G.711 est chiffré, G.729 ne l'est pas", "G.711 fonctionne en LAN, G.729 uniquement en WAN"],
        a: 0,
        why: "Le codec est un arbitrage, jamais un « meilleur choix » absolu : qualité contre débit. On garde G.711 en interne, on économise avec G.729 sur un lien contraint.",
        ref: "Chapitre 06"
    },
    {
        q: "Sur quelles briques repose toute téléphonie IP ?",
        c: ["Les postes, le PBX, le trunk SIP de l'opérateur et la connexion Internet", "Les postes, le switch PoE, le routeur et le pare-feu", "Le PBX, la passerelle analogique, les DECT et le serveur DHCP", "Le codec, le protocole SIP, le RTP et le RTCP"],
        a: 0,
        why: "Quatre briques — et c'est la dernière, la connexion Internet, la moins visible, qui décide de la qualité réellement perçue par les utilisateurs.",
        ref: "Chapitre 06"
    },
    {
        q: "Quel protocole transporte réellement la voix numérisée ?",
        c: ["RTP", "SIP", "RTCP", "SDP"],
        a: 0,
        why: "SIP signale (invite, sonne, raccroche), <strong>RTP</strong> transporte les paquets audio, RTCP remonte les statistiques de qualité (gigue, perte) de ce flux.",
        ref: "Chapitre 05"
    },
    {
        q: "À quoi sert RTCP ?",
        c: ["À remonter les statistiques de qualité du flux RTP", "À chiffrer le flux voix", "À établir l'appel avant RTP", "À convertir les codecs à la volée"],
        a: 0,
        why: "RTCP accompagne RTP et fait remonter gigue, perte et délai. C'est ce qui permet de dire objectivement pourquoi une communication était mauvaise.",
        ref: "Chapitre 05"
    },
    {
        q: "Lors d'un déploiement client, qu'est-ce qui casse le plus souvent le jour J ?",
        c: ["L'acheminement des numéros repris (portabilité)", "L'installation du PBX lui-même", "La configuration des postes", "Le choix du codec"],
        a: 0,
        why: "Les deux dernières étapes de la checklist ne sont pas redondantes : la première valide l'installation, la seconde valide la <strong>portabilité</strong>. Ce qui casse le jour J n'est presque jamais le PBX.",
        ref: "Chapitre 09"
    },
    {
        q: "Un appel fonctionne, mais seul l'un des deux interlocuteurs entend l'autre. Quelle piste examiner en premier ?",
        c: ["Le NAT : une adresse privée annoncée dans le SDP, ou un « SIP ALG » qui réécrit mal", "Le codec", "Le PoE du téléphone", "Le serveur DHCP"],
        a: 0,
        why: "Le son à sens unique est la signature d'un problème de NAT : un des deux flux RTP part vers une adresse injoignable. On le voit dans la capture (adresse <code>c=</code> du SDP, flux RTP dans un seul sens).",
        ref: "Chapitre 09"
    },
    {
        q: "Combien de bande passante, dans chaque sens, prévoir pour 10 appels simultanés en G.711 sur Ethernet ?",
        c: ["≈ 870 kb/s", "640 kb/s", "≈ 310 kb/s", "64 kb/s"],
        a: 0,
        why: "G.711 = 64 kb/s de voix, mais avec les en-têtes IP/UDP/RTP et Ethernet de 50 paquets par seconde, ≈ 87 kb/s par appel et par sens : 10 × 87 ≈ 870 kb/s.",
        ref: "Chapitre 08"
    }]
},

/* ═══════ PARCOURS 04 · VIRTUALISATION, HOMELAB & SÉCURITÉ ═══════ */

"proxmox": {
    name: "Proxmox & Virtualisation",
    file: "proxmox.html",
    title: "Test — Proxmox & Virtualisation",
    intro: "Neuf chapitres sur l'hyperviseur du homelab : VM contre conteneurs, ZFS, réseau, sauvegardes et cluster.",
    pass: 70,
    questions: [
    {
        q: "Sur quoi Proxmox VE est-il construit ?",
        c: ["Debian + KVM + LXC + ZFS", "Red Hat + Xen + Docker", "Ubuntu + VMware ESXi", "Un noyau propriétaire dérivé de FreeBSD"],
        a: 0,
        why: "Gratuit et open source. VM (KVM) quand il faut un OS complet ou non-Linux ; conteneur LXC quand on veut un service Linux léger et rapide.",
        ref: "Chapitre 01"
    },
    {
        q: "Sur quel port et quel protocole s'ouvre l'interface web de Proxmox ?",
        c: ["HTTPS sur le port 8006", "HTTP sur le port 8080", "HTTPS sur le port 443", "HTTP sur le port 8006"],
        a: 0,
        why: "<code>https://ip-du-serveur:8006</code>. Et juste après l'installation, on désactive le dépôt <em>enterprise</em> pour activer <em>no-subscription</em>, sinon les mises à jour échouent.",
        ref: "Chapitre 02"
    },
    {
        q: "Vous voulez faire tourner Docker sur Proxmox. Quel est le bon support ?",
        c: ["Une VM", "Un conteneur LXC privilégié", "Un conteneur LXC unprivileged", "Directement sur l'hôte Proxmox"],
        a: 0,
        why: "Docker dans un LXC pose des problèmes d'imbrication et de droits. On préfère une VM — et on garde les LXC unprivileged pour les services Linux simples.",
        ref: "Chapitre 04"
    },
    {
        q: "Quelle est la différence entre les stockages <code>local</code> et <code>local-lvm</code> ?",
        c: ["<code>local</code> stocke ISO, sauvegardes et templates ; <code>local-lvm</code> stocke les disques de VM/CT", "<code>local</code> est sur SSD, <code>local-lvm</code> sur disque mécanique", "<code>local</code> est partagé dans le cluster, <code>local-lvm</code> non", "Ce sont deux noms du même volume"],
        a: 0,
        why: "Répartition par type de contenu. Pour la résilience et des snapshots instantanés, on monte plutôt un pool <strong>ZFS en miroir</strong> avec compression lz4.",
        ref: "Chapitre 05"
    },
    {
        q: "Qu'est-ce que <code>vmbr0</code> ?",
        c: ["Un switch virtuel qui porte l'IP de l'hôte et relie les VM/CT", "La première carte réseau physique du serveur", "Le pare-feu intégré de Proxmox", "Le pont VPN vers le réseau distant"],
        a: 0,
        why: "Un bridge, c'est-à-dire un switch logiciel. Pour segmenter, on active <code>bridge-vlan-aware</code> et on pose un VLAN Tag par interface — et le port physique côté switch doit être en <strong>trunk</strong>.",
        ref: "Chapitre 06"
    },
    {
        q: "Un snapshot ZFS local compte-t-il comme une sauvegarde ?",
        c: ["Non : il vit sur le même stockage que la donnée qu'il protège", "Oui, s'il est planifié quotidiennement", "Oui, à condition d'activer la compression", "Non, sauf pour les conteneurs LXC"],
        a: 0,
        why: "3 copies, 2 supports, 1 hors site. Un snapshot local disparaît avec le pool. Et on teste une restauration régulièrement, pas seulement le fait que le backup s'exécute.",
        ref: "Chapitre 07"
    },
    {
        q: "Que suppose la haute disponibilité (HA) dans un cluster Proxmox ?",
        c: ["Un stockage partagé et un nombre impair de nœuds (≥ 3) pour garder le quorum", "Deux nœuds identiques et un lien 10 Gb/s", "Un seul nœud, sauvegardé toutes les heures", "Un cluster ZFS répliqué sans quorum"],
        a: 0,
        why: "Le cluster apporte gestion unifiée et migration ; la HA exige du stockage partagé et le quorum. À deux nœuds, on ajoute un <strong>QDevice</strong> témoin — même logique que le disque témoin d'un cluster Windows.",
        ref: "Chapitre 08"
    },
    {
        q: "Quelles pratiques d'exploitation le module recommande-t-il ?",
        c: ["Automatiser avec des API tokens plutôt qu'avec le compte root", "Surveiller l'espace ZFS et lancer des scrubs régulièrement", "Exécuter directement les scripts communautaires trouvés en ligne", "Laisser le dépôt enterprise actif pour la stabilité"],
        a: [0, 1],
        why: "Jamais root pour l'automatisation, et un pool ZFS qui sature se comporte très mal — d'où la surveillance et les scrubs. Un script communautaire se relit <em>avant</em> d'être lancé sur l'hyperviseur.",
        ref: "Chapitre 09"
    }]
},

"docker": {
    name: "Docker & conteneurs",
    file: "docker.html",
    title: "Test — Docker & conteneurs",
    intro: "Huit chapitres, huit questions : ce qu'est un conteneur, et les erreurs qui font perdre des données ou arrêter un service sans le vouloir.",
    pass: 70,
    questions: [
    {
        q: "Qu'est-ce qui distingue un conteneur Docker d'une machine virtuelle ?",
        c: ["C'est un processus isolé qui partage le noyau de l'hôte", "Il embarque son propre noyau, comme une VM plus légère", "Il a besoin d'un hyperviseur de type 1", "Il peut exécuter une architecture CPU différente de celle de l'hôte"],
        a: 0,
        why: "La conteneurisation isole des processus (namespaces, cgroups) sur le noyau de l'hôte : pas d'hyperviseur, pas d'OS virtualisé, et la même architecture que l'hôte.",
        ref: "Chapitre 01"
    },
    {
        q: "Pourquoi le script <code>get-docker.sh</code> est-il à proscrire en production ?",
        c: ["Il exécute en root du code téléchargé et impose la dernière version, y compris majeure", "Il n'installe pas le client <code>docker</code>", "Il ne fonctionne que sur Windows", "Il désactive le démon au redémarrage"],
        a: 0,
        why: "En production : dépôt officiel, version choisie puis bloquée. Le script tout-en-un reste un outil de labo.",
        ref: "Chapitre 03"
    },
    {
        q: "Tu es dans le shell d'un conteneur lancé avec <code>docker run -it</code>. Comment en sortir sans l'arrêter ?",
        c: ["Ctrl+P puis Ctrl+Q", "Ctrl+D", "<code>exit</code>", "Ctrl+C"],
        a: 0,
        why: "Ctrl+D ou <code>exit</code> terminent le processus principal, donc arrêtent le conteneur. Pour y revenir ensuite sans risque : <code>docker exec -it NOM bash</code>.",
        ref: "Chapitre 04"
    },
    {
        q: "<code>docker build -t mon-app</code> échoue avec « requires exactly 1 argument ». Que manque-t-il ?",
        c: ["Le contexte de build, par exemple le point final <code>.</code>", "Le nom du fichier <code>Dockerfile</code> après <code>-t</code>", "L'option <code>-p</code>", "Les droits root"],
        a: 0,
        why: "<code>docker build</code> prend un dossier : le contexte envoyé au démon, seule chose que <code>COPY</code> peut lire. <code>docker build -t mon-app .</code>",
        ref: "Chapitre 05"
    },
    {
        q: "Un Dockerfile contient <code>EXPOSE 5000</code>. Que faut-il encore pour joindre l'application depuis le réseau ?",
        c: ["Publier le port au lancement, par exemple <code>-p 8000:5000</code>", "Rien, <code>EXPOSE</code> suffit", "Passer le conteneur en <code>--privileged</code>", "Reconstruire l'image avec <code>--no-cache</code>"],
        a: 0,
        why: "<code>EXPOSE</code> documente, il ne publie rien. C'est <code>-p hôte:conteneur</code> qui crée le mappage. Attention : ce port publié passe à travers ufw, car Docker écrit ses propres règles iptables avant la chaîne INPUT.",
        ref: "Chapitres 05 et 07"
    },
    {
        q: "Quelle commande peut effacer des données en supprimant aussi les volumes <strong>nommés</strong> inutilisés ?",
        c: ["<code>docker volume prune -a</code>", "<code>docker volume prune</code>", "<code>docker volume ls</code>", "<code>docker volume inspect</code>"],
        a: 0,
        why: "Sans option, <code>prune</code> ne touche qu'aux volumes anonymes inutilisés. Avec <code>-a</code>, les volumes nommés y passent aussi.",
        ref: "Chapitre 06"
    },
    {
        q: "Deux conteneurs doivent se joindre par leur nom. Que faut-il ?",
        c: ["Les attacher à un même réseau créé avec <code>docker network create</code>", "Les laisser sur le bridge par défaut", "Les passer en driver <code>none</code>", "Publier leurs ports avec <code>-p</code>"],
        a: 0,
        why: "Sur un réseau bridge créé, Docker résout les conteneurs par leur nom. Compose fait la même chose automatiquement pour ses services.",
        ref: "Chapitre 07"
    },
    {
        q: "Que fait <code>docker compose down</code>, sans option ?",
        c: ["Il supprime conteneurs et réseau, mais garde les volumes", "Il supprime aussi les volumes et donc les données", "Il met seulement les conteneurs en pause", "Il reconstruit les images"],
        a: 0,
        why: "Les volumes survivent à <code>down</code> : la base est intacte au <code>up</code> suivant. <code>down -v</code> les supprime.",
        ref: "Chapitre 08"
    }]
},

"homelab": {
    name: "Homelab & Self-hosting",
    file: "homelab.html",
    title: "Test — Homelab & Self-hosting",
    intro: "Docker, reverse proxy, DNS local, NAS et accès distant. Une seule erreur dans ce test peut coûter tout un homelab : celle sur le port forwarding.",
    pass: 70,
    questions: [
    {
        q: "Dans Docker, que devient la donnée si l'on supprime un conteneur ?",
        c: ["Elle survit si elle est dans un volume", "Elle est toujours perdue", "Elle est conservée dans l'image", "Elle est automatiquement sauvegardée par Docker"],
        a: 0,
        why: "Image = le modèle figé. Conteneur = l'instance qui tourne. <strong>Volume</strong> = le stockage persistant, qui survit à la suppression du conteneur. C'est le volume qu'il faut sauvegarder.",
        ref: "Chapitre 02"
    },
    {
        q: "À quoi sert <code>restart: unless-stopped</code> dans un <code>docker-compose.yml</code> ?",
        c: ["Le conteneur redémarre automatiquement, sauf s'il a été arrêté volontairement", "Le conteneur ne redémarre jamais tout seul", "Le conteneur redémarre toutes les 24 heures", "Le conteneur est recréé à chaque mise à jour d'image"],
        a: 0,
        why: "C'est ce qui fait repartir les services après un redémarrage de l'hôte, sans relancer ce qu'on avait volontairement stoppé. Avec un dossier par service et le <code>.yml</code> versionné, la stack est reproductible.",
        ref: "Chapitre 02"
    },
    {
        q: "Que fait un reverse proxy dans un homelab ?",
        c: ["Il offre un point d'entrée unique, aiguille par nom de domaine et gère le HTTPS", "Il masque l'adresse IP publique des clients sortants", "Il remplace le pare-feu du routeur", "Il répartit les conteneurs entre plusieurs hôtes"],
        a: 0,
        why: "Sans lui, chaque service vit sur un port différent et sans chiffrement. Nginx Proxy Manager pour débuter, Traefik pour l'auto-découverte. Certificats Let's Encrypt — avec le challenge DNS, aucun port à ouvrir.",
        ref: "Chapitre 03"
    },
    {
        q: "Quel est le principal point de vigilance avec Pi-hole ?",
        c: ["C'est un point unique de défaillance : sans lui, plus de résolution DNS", "Il ralentit la navigation de tout le réseau", "Il ne fonctionne qu'avec une IP dynamique", "Il empêche l'usage d'un reverse proxy"],
        a: 0,
        why: "Pi-hole est DNS + bloqueur de pub + annuaire local. Comme tout le réseau en dépend, il lui faut une <strong>IP fixe</strong> et un DNS de secours déclaré.",
        ref: "Chapitre 04"
    },
    {
        q: "Quel protocole de partage pour quel usage sur un NAS ?",
        c: ["SMB pour les postes de travail, NFS entre serveurs", "NFS pour les postes Windows, SMB entre serveurs Linux", "SMB pour la sauvegarde, NFS pour les médias", "Les deux sont interchangeables sans différence"],
        a: 0,
        why: "SMB/CIFS est le partage universel côté postes ; NFS est plus adapté entre machines Unix. Et le rappel qui vaut partout : RAID = disponibilité, pas sauvegarde.",
        ref: "Chapitre 06"
    },
    {
        q: "Comment accéder à son homelab depuis l'extérieur ?",
        c: ["Par un VPN — WireGuard, ou Tailscale pour le zéro-config", "Par un port forwarding vers le service concerné", "En exposant le NAS sur une IP publique avec un mot de passe fort", "Par RDP direct, en changeant le port par défaut"],
        a: 0,
        why: "Ouvrir un port forwarding direct vers un service est la <strong>cause n°1</strong> de compromission de homelab. Un homelab bien fait est invisible depuis Internet.",
        ref: "Chapitre 08"
    },
    {
        q: "Que faut-il sauvegarder en priorité dans un homelab conteneurisé ?",
        c: ["Les volumes de données et les fichiers <code>docker-compose.yml</code>", "Les images Docker téléchargées", "Les journaux des conteneurs", "Le système d'exploitation de l'hôte"],
        a: 0,
        why: "Les images se retéléchargent, la configuration et les données non. Volumes + fichiers Compose = toute ta stack reconstructible. Et on teste une restauration pour de vrai de temps en temps.",
        ref: "Chapitre 07"
    },
    {
        q: "Par quoi commencer quand on monte son premier homelab ?",
        c: ["Par ce qui apporte une valeur immédiate : Pi-hole, un cloud perso, un tableau de bord", "Par un cluster Kubernetes, pour partir sur de bonnes bases", "Par l'achat d'un serveur rack professionnel", "Par la mise en place de l'accès distant"],
        a: 0,
        why: "Un mini-PC ou un vieux PC sous Proxmox suffit. On commence petit, chaque service ayant son dossier, son <code>docker-compose.yml</code> et son volume à sauvegarder.",
        ref: "Chapitre 01"
    }]
},

"securite": {
    name: "Cybersécurité",
    file: "securite.html",
    title: "Test — Cybersécurité & hygiène",
    intro: "Module défensif. La première question n'est pas technique — et c'est la plus importante du test.",
    pass: 75,
    questions: [
    {
        q: "Que faut-il impérativement avant de scanner ou tester un système qui ne vous appartient pas ?",
        c: ["Une autorisation écrite du propriétaire", "Un VPN pour masquer son adresse", "Un compte utilisateur valide sur la cible", "Rien, tant qu'aucune donnée n'est modifiée"],
        a: 0,
        why: "Sans autorisation, c'est illégal — en Belgique, article 550bis du Code pénal ; en France, articles 323-1 et suivants. Pas d'autorisation = pas de test : on s'entraîne sur ses propres machines ou sur des plateformes prévues pour.",
        ref: "Chapitre 01"
    },
    {
        q: "Que doit contenir un labo de sécurité correctement monté ?",
        c: ["Un attaquant, une cible vulnérable et une isolation réseau totale", "Un attaquant et une cible, connectés au réseau domestique", "Une seule VM contenant Kali et les cibles", "Une machine physique exposée sur Internet pour du trafic réaliste"],
        a: 0,
        why: "Kali pour attaquer, une VM vulnérable pour cible, un réseau interne sans sortie. Et un snapshot « propre » pour repartir de zéro après chaque test.",
        ref: "Chapitre 02"
    },
    {
        q: "Quelles sont les étapes d'un test d'intrusion, dans l'ordre ?",
        c: ["Reconnaissance → Scan → Exploitation → Post-exploitation → Rapport", "Scan → Reconnaissance → Rapport → Exploitation", "Exploitation → Scan → Reconnaissance → Post-exploitation", "Reconnaissance → Exploitation → Scan → Rapport"],
        a: 0,
        why: "Et l'étape finale n'est pas décorative : un test sans rapport de correctifs ne sert à rien. La valeur d'un pentest, c'est ce qu'on corrige ensuite.",
        ref: "Chapitre 03"
    },
    {
        q: "Nmap cartographie ports, services et versions. Quel est l'objectif <strong>défensif</strong> correspondant ?",
        c: ["Réduire la surface : moins de ports ouverts, pas de bannières bavardes, services à jour", "Bloquer tous les scans par une règle de pare-feu", "Changer les ports par défaut de tous les services", "Interdire l'ICMP sur le réseau"],
        a: 0,
        why: "On ne se défend pas en empêchant le scan, mais en n'ayant rien d'intéressant à trouver. Changer les ports ne fait que retarder un scan complet.",
        ref: "Chapitre 04"
    },
    {
        q: "Face au Top 10 OWASP, quelles défenses reviennent systématiquement ?",
        c: ["Valider les entrées et maintenir les composants à jour", "Activer le MFA et appliquer le moindre privilège", "Changer les mots de passe tous les 30 jours", "Masquer le code source de l'application"],
        a: [0, 1],
        why: "Contrôle d'accès, configuration, dépendances, injection, authentification : la défense tient en peu de mots — valider les entrées, mettre à jour, MFA, moindre privilège (et vérifier les droits côté serveur, contre le n° 1 du classement).",
        ref: "Chapitre 05"
    },
    {
        q: "Un client modifie l'URL <code>/facture?id=123</code> en <code>id=124</code> et voit la facture d'un autre client. Quelle catégorie de l'OWASP Top 10:2025 est en cause ?",
        c: ["A01 — Contrôle d'accès défaillant", "A05 — Injection", "A04 — Défaillances cryptographiques", "A09 — Journalisation insuffisante"],
        a: 0,
        why: "Rien n'est injecté : l'application oublie simplement de vérifier, côté serveur, que la facture appartient à l'utilisateur connecté. C'est le n° 1 du classement 2025.",
        ref: "Chapitre 05"
    },
    {
        q: "En quoi consiste le durcissement (hardening) d'un système ?",
        c: ["Mettre à jour, désactiver l'inutile, appliquer le moindre privilège, passer SSH en clés", "Installer un antivirus et activer le pare-feu", "Chiffrer le disque et activer le démarrage sécurisé", "Isoler la machine du réseau"],
        a: 0,
        why: "Antivirus/EDR et fail2ban <em>complètent</em> ces quatre points, ils ne les remplacent pas. Les CIS Benchmarks donnent la checklist détaillée par système.",
        ref: "Chapitre 06"
    },
    {
        q: "Quelles couches composent une défense réseau en profondeur ?",
        c: ["Pare-feu en deny par défaut et réseau segmenté", "Accès distant par VPN et logs centralisés", "Un antivirus sur chaque poste, suffisant à lui seul", "Un mot de passe complexe sur le routeur"],
        a: [0, 1],
        why: "La défense en profondeur, c'est empiler les couches : refuser par défaut, segmenter, passer par un VPN plutôt que d'exposer, et centraliser les journaux pour détecter.",
        ref: "Chapitre 07"
    },
    {
        q: "Quel est le cadre d'usage de tout ce module ?",
        c: ["Uniquement ses propres systèmes, ou avec autorisation écrite", "Tout système accessible publiquement sur Internet", "Tout système d'une entreprise qui vous emploie", "Tout système, tant que les failles sont signalées ensuite"],
        a: 0,
        why: "Le module est défensif : comprendre l'attaque pour protéger. Le savoir offensif engage votre responsabilité — même employé, un test exige un mandat écrit et un périmètre défini.",
        ref: "Chapitre 01"
    }]
},

/* ═══════ PARCOURS 05 · CLOUD, SUPERVISION & MÉTHODE ═══════ */

"monitoring-zabbix": {
    name: "Supervision — Zabbix",
    file: "monitoring-zabbix.html",
    title: "Test — Supervision avec Zabbix",
    intro: "Neuf chapitres, neuf questions. L'objectif : savoir monter une supervision qui remonte vraiment des données, et comprendre ce qui se passe quand elle n'en remonte pas.",
    pass: 70,
    questions: [
    {
        q: "Quels sont les trois objectifs du monitoring ?",
        c: ["Surveiller, être alerté, anticiper", "Sauvegarder, restaurer, archiver", "Installer, configurer, documenter", "Mesurer, facturer, dimensionner"],
        a: 0,
        why: "Surveiller donne l'état réel ; être alerté évite de découvrir le problème par l'utilisateur qui appelle ; anticiper, c'est agir avant la panne — c'est ce troisième objectif qui justifie l'auto-remédiation.",
        ref: "Chapitre 01"
    },
    {
        q: "Dans l'architecture Zabbix, qui stocke les données collectées ?",
        c: ["La base de données Zabbix", "Le serveur Zabbix, en mémoire", "L'agent, sur chaque machine supervisée", "Le proxy Zabbix"],
        a: 0,
        why: "Le serveur décide, la base conserve (configuration et métriques), le frontend affiche, l'agent mesure. Le proxy n'apparaît que pour un site distant ou pour soulager le serveur.",
        ref: "Chapitre 02"
    },
    {
        q: "Les VM du labo se pinguent entre elles mais n'atteignent pas Internet. Qu'est-ce qui manque le plus probablement ?",
        c: ["Le <code>New-NetNat</code> sur l'hôte, ou l'adresse <code>.1</code> sur sa carte <code>LAN-WAN</code>", "Le service Zabbix Agent sur les VM", "L'ouverture du port 10050 dans le pare-feu", "Un second commutateur virtuel externe par VM"],
        a: 0,
        why: "Un commutateur <strong>interne</strong> ne sort nulle part tout seul : c'est le NAT créé sur l'hôte, plus l'adresse de passerelle posée sur sa carte, qui font la sortie. Le problème est côté hôte, pas côté VM.",
        ref: "Chapitre 03"
    },
    {
        q: "Après <code>systemctl start mysql</code>, la commande ne renvoie rien. Que faut-il en conclure ?",
        c: ["Que le démarrage a réussi — une commande Linux qui réussit est généralement silencieuse", "Que la commande a échoué sans message", "Que le service est bien activé au démarrage", "Qu'il faut relancer la commande avec <code>sudo</code>"],
        a: 0,
        why: "Aucune sortie = tout va bien. Pour la preuve, on interroge <code>systemctl status</code> : <code>Loaded: enabled</code>, <code>Active: active (running)</code>.",
        ref: "Chapitre 04"
    },
    {
        q: "Le paquet <code>zabbix-server</code> est installé, la base et l'utilisateur <code>zabbix</code> sont créés, mais le serveur refuse de démarrer. Qu'a-t-on oublié ?",
        c: ["L'import du schéma <code>server.sql.gz</code> dans la base", "D'activer le service avec <code>systemctl enable</code>", "De décommenter <code>listen 8080</code> dans <code>nginx.conf</code>", "De redémarrer <code>php8.5-fpm</code>"],
        a: 0,
        why: "Sans l'import, la base existe mais reste vide, et le serveur ne démarre pas. C'est aussi la seule raison d'être du <code>log_bin_trust_function_creators = 1</code>, qu'on remet à 0 juste après.",
        ref: "Chapitre 05"
    },
    {
        q: "Quelle est la différence entre <em>passive checks</em> et <em>active checks</em> ?",
        c: ["En passif, le serveur interroge l'agent sur le port 10050 ; en actif, l'agent contacte le serveur et lui envoie les valeurs", "En passif l'agent est en lecture seule ; en actif il peut exécuter des scripts", "En passif les données sont stockées localement ; en actif elles partent en base", "Le passif utilise le chiffrement, l'actif non"],
        a: 0,
        why: "La distinction décide du sens des flux à ouvrir : en passif il faut le 10050 entrant sur la machine supervisée, en actif c'est l'agent qui sort — et c'est le <code>Hostname=</code> qui l'identifie.",
        ref: "Chapitre 06"
    },
    {
        q: "Un hôte a été créé sous le nom <code>Zabbix-WS</code> alors que l'agent déclare <code>Hostname=ZABBIX-WS</code>. Que se passe-t-il ?",
        c: ["Les <em>active checks</em> sont refusés par le serveur : la correspondance est sensible à la casse", "Rien, Zabbix ignore la casse des noms d'hôte", "L'agent refuse de démarrer", "Les graphes s'affichent mais les triggers ne se déclenchent jamais"],
        a: 0,
        why: "Le <em>Host name</em> de l'interface et le <code>Hostname=</code> du fichier de configuration doivent être strictement identiques, casse comprise — sinon on cherche longtemps un problème de réseau qui est une majuscule.",
        ref: "Chapitre 07"
    },
    {
        q: "Pourquoi mapper des <strong>groupes</strong> AD plutôt que des comptes un par un dans les réglages LDAP ?",
        c: ["Les droits se gèrent une seule fois par groupe, et un nouvel arrivant obtient son accès automatiquement", "Zabbix ne sait pas authentifier des comptes individuels", "Le mapping par groupe est le seul à chiffrer les échanges LDAP", "Cela évite de créer un compte local Admin"],
        a: 0,
        why: "Sinon l'outil devient un annuaire parallèle : comptes d'anciens collègues toujours actifs, droits jamais revus. C'est la même logique de gestion par groupe que dans Active Directory.",
        ref: "Chapitre 08"
    },
    {
        q: "Dans l'exercice d'auto-remédiation, pourquoi la description du trigger cloné ne doit contenir que <code>{#SERVICE.NAME}</code> ?",
        c: ["Parce que le script la récupère via <code>{TRIGGER.DESCRIPTION}</code> pour former la commande <code>net start</code>", "Parce que Zabbix refuse les descriptions de plus d'une macro", "Parce que c'est ce texte qui s'affiche dans le tableau de bord", "Parce que la description sert de clé unique du trigger"],
        a: 0,
        why: "La description transporte le nom court du service jusqu'au script. Tout texte supplémentaire casserait la commande — et les guillemets autour de la macro sauvent les noms de service contenant des espaces.",
        ref: "Chapitre 09"
    }]
},

"zabbix-windows": {
    name: "Zabbix & serveurs Windows",
    file: "zabbix-windows.html",
    title: "Test — Zabbix & serveurs Windows",
    intro: "Sept chapitres, dix questions. Elles portent sur ce qui casse quand on change de sens ou de réseau : vérifications actives, PSK, noms de services Docker, et les modèles maison.",
    pass: 70,
    questions: [
    {
        q: "En vérifications <strong>actives</strong>, qui ouvre la connexion, et vers quel port ?",
        c: ["L'agent, vers le port 10051 du serveur", "Le serveur, vers le port 10050 de l'agent", "L'agent, vers le port 10050 du serveur", "Le serveur, vers le port 10051 de l'agent"],
        a: 0,
        why: "En actif, l'agent appelle le serveur sur 10051 et lui envoie ses données. Le port 10050 sert aux vérifications passives, où c'est le serveur qui interroge l'agent.",
        ref: "Chapitre 01"
    },
    {
        q: "Un hôte en modèle <em>Windows by Zabbix agent active</em> affiche <em>Active checks : Available</em> et son interface <code>…:10050</code> en <em>Unknown</em>. Que faire ?",
        c: ["Rien : ce modèle ne fait aucune vérification passive, le serveur n'appelle jamais le port 10050", "Ouvrir le port 10050 dans le pare-feu Windows", "Passer l'interface en <em>Connect to : DNS</em>", "Réinstaller l'agent avec le bon port"],
        a: 0,
        why: "Unknown veut dire « jamais interrogé », pas « en panne ». Les données arrivent par les vérifications actives, qui sont bien disponibles.",
        ref: "Chapitre 03"
    },
    {
        q: "Pourquoi le conteneur PostgreSQL n'est-il branché que sur un réseau déclaré <code>internal: true</code> ?",
        c: ["Pour que la base soit injoignable depuis le réseau : seuls les conteneurs du même réseau la voient", "Pour accélérer les échanges entre le serveur et la base", "Parce que PostgreSQL ne sait pas écouter sur deux réseaux", "Pour publier son port 5432 sur la VM"],
        a: 0,
        why: "Un réseau interne n'a aucun accès vers l'extérieur. Le serveur et l'interface sont sur les deux réseaux : le backend pour joindre la base, le frontend pour publier leurs ports.",
        ref: "Chapitre 02"
    },
    {
        q: "<code>docker logs zabbix-server</code> affiche <code>cannot find requested PSK identity \"LAB-APP01-PSK\"</code>. Quelle est la cause la plus probable ?",
        c: ["L'onglet <em>Encryption</em> de l'hôte n'est pas rempli, ou pas avec la même identité", "Le port 10051 n'est pas publié sur la VM", "L'agent n'est pas de la même version que le serveur", "Le conteneur serveur ne résout pas le nom de l'agent"],
        a: 0,
        why: "Le serveur reçoit bien l'agent — la connexion arrive — mais ne connaît pas cette identité. Identité et valeur PSK doivent être identiques des deux côtés.",
        ref: "Chapitre 03"
    },
    {
        q: "Entre un agent Windows et son hôte dans Zabbix, qu'est-ce qui doit correspondre exactement ?",
        c: ["Le nom d'hôte (<code>Hostname=</code> de l'agent)", "L'identité PSK", "La valeur PSK", "L'adresse IP du serveur Windows"],
        a: [0, 1, 2],
        why: "En actif, l'agent s'annonce par son <code>Hostname</code> : le nom dans Zabbix doit être le même. Et le PSK n'est accepté que si identité et valeur concordent. L'IP, elle, n'intervient pas dans l'identification.",
        ref: "Chapitre 03"
    },
    {
        q: "L'agent du serveur Zabbix tourne dans un conteneur <code>zabbix-agent</code> sur le même réseau Compose. Quelle interface donner à l'hôte <code>Zabbix server</code> ?",
        c: ["DNS name <code>zabbix-agent</code>, <em>Connect to : DNS</em>, port 10050", "IP <code>127.0.0.1</code>, port 10050", "L'IP de la VM Ubuntu, port 10050", "L'IP actuelle du conteneur agent, relevée avec <code>docker inspect</code>"],
        a: 0,
        why: "C'est le conteneur serveur qui interroge : son 127.0.0.1, c'est lui-même. Le port de l'agent n'est pas publié sur la VM, et l'IP d'un conteneur change à sa recréation. Le nom de service, lui, reste.",
        ref: "Chapitre 04"
    },
    {
        q: "Un <code>.conf</code> avec un nouveau <code>UserParameter</code> est déposé ; <code>zabbix_agent2.exe -t</code> renvoie bien une valeur, mais l'item reste en <em>Unknown metric</em>. Pourquoi ?",
        c: ["Le service en cours n'a pas relu sa configuration : il faut redémarrer l'agent", "Le timeout de l'item est trop court", "Le modèle n'est pas lié à l'hôte", "Le script doit être dans <code>zabbix_agent2.d\\</code> et non dans <code>scripts\\</code>"],
        a: 0,
        why: "<code>-t</code> relit la configuration à neuf, le service déjà lancé non. Sans redémarrage de l'agent, la nouvelle clé lui est inconnue.",
        ref: "Chapitre 05"
    },
    {
        q: "Sur un item <strong>actif</strong>, le bouton <em>Execute now</em> ne fait rien. Comment forcer une collecte ?",
        c: ["Redémarrer l'agent", "Passer l'item en passif le temps du test", "Augmenter le timeout à 10 s", "Relancer le conteneur <code>zabbix-server</code>"],
        a: 0,
        why: "Un item actif, c'est l'agent qui l'envoie : le serveur ne peut pas le déclencher. Au redémarrage, l'agent récupère sa liste d'items et collecte aussitôt.",
        ref: "Chapitre 05"
    },
    {
        q: "Le modèle Windows Time signale <em>« VM IC Time Synchronization Provider is being used »</em> sur tous les serveurs du domaine. Quelle correction ?",
        c: ["Désactiver le fournisseur VMIC ; le DC sur une source externe en <code>/reliable:yes</code>, les membres en <code>domhier</code>", "Synchroniser chaque serveur directement sur <code>pool.ntp.org</code>", "Laisser l'hôte Hyper-V fournir l'heure à tous, DC compris", "Désactiver le service <code>w32time</code> sur les membres"],
        a: 0,
        why: "Dans un domaine, la référence est le DC, synchronisé sur une source externe ; les membres suivent la hiérarchie du domaine. L'heure de l'hôte Hyper-V court-circuitait cette hiérarchie.",
        ref: "Chapitre 06"
    },
    {
        q: "Un certificat n'est pas découvert par le modèle Windows Certificates. Quelles causes sont possibles ?",
        c: ["Il est dans un magasin de l'utilisateur, pas dans <code>My</code> ou <code>WebHosting</code> de la machine", "Son FriendlyName ne contient pas <code>@</code>", "Il expire dans plus de 15 jours", "Il est auto-signé"],
        a: [0, 1],
        why: "Le script ne lit que les magasins de l'ordinateur local (<code>certlm.msc</code>, pas <code>certmgr.msc</code>) et filtre sur un <code>@</code> dans le FriendlyName. La durée ou l'émetteur n'empêchent pas la découverte : les certificats de test du TP étaient auto-signés.",
        ref: "Chapitre 07"
    }]
},

"azure": {
    name: "Azure — AZ-900",
    file: "azure.html",
    title: "Test — Azure AZ-900",
    intro: "Onze chapitres, dix questions posées comme à l'examen : un scénario, un mot-clé, et des propositions plausibles. L'objectif n'est pas de réciter une définition, mais de choisir le service le plus simple qui répond au besoin.",
    pass: 70,
    questions: [
    {
        q: "Une boutique en ligne doit absorber un pic de trafic pendant deux heures, puis revenir à sa charge normale sans intervention. Quel bénéfice du cloud est en jeu ?",
        c: ["L'élasticité", "La scalabilité", "La haute disponibilité", "La fiabilité"],
        a: 0,
        why: "Scalabilité = <em>je</em> décide d'ajuster. Élasticité = <em>ça</em> s'ajuste tout seul. Le mot « sans intervention » tranche la question.",
        ref: "Chapitre 01"
    },
    {
        q: "Dans un modèle <strong>IaaS</strong>, qui applique les mises à jour du système d'exploitation invité ?",
        c: ["Le client", "Microsoft", "Le client pour Linux, Microsoft pour Windows", "Personne : elles sont automatiques et hors responsabilité"],
        a: 0,
        why: "En IaaS, Azure gère le matériel, l'hyperviseur et le réseau physique ; l'OS invité, le runtime, l'application et les données restent au client. En PaaS, l'OS passe côté Microsoft.",
        ref: "Chapitre 02"
    },
    {
        q: "Quelles affirmations sont exactes sur les resource groups ?",
        c: ["Supprimer un resource group supprime toutes les ressources qu'il contient", "Il regroupe des ressources à cycle de vie commun", "Toutes les ressources d'un resource group doivent être dans la même région", "Un resource group peut contenir des subscriptions"],
        a: [0, 1],
        why: "Ses <em>métadonnées</em> appartiennent à une seule région, mais les ressources qu'il contient peuvent être réparties dans plusieurs. Et la hiérarchie va dans l'autre sens : une subscription contient des resource groups, jamais l'inverse.",
        ref: "Chapitre 03"
    },
    {
        q: "Un traitement doit s'exécuter à chaque fois qu'un fichier est déposé dans un stockage, pendant quelques secondes. Quel service compute ?",
        c: ["Azure Functions", "Une machine virtuelle avec une tâche planifiée", "Azure Kubernetes Service", "Azure Virtual Desktop"],
        a: 0,
        why: "Exécution courte, déclenchée par un événement : c'est la définition du serverless. L'examen attend le service <strong>le plus simple</strong> qui répond au besoin — une VM ou un cluster seraient surdimensionnés.",
        ref: "Chapitre 04"
    },
    {
        q: "Une application web doit router les requêtes selon l'URL et être protégée contre les attaques web courantes. Quel service ?",
        c: ["Application Gateway avec WAF", "Azure Load Balancer", "Traffic Manager", "Un Network Security Group"],
        a: 0,
        why: "Load Balancer = couche 4 (TCP/UDP). Application Gateway = couche 7, comprend le HTTP, route par URL ou nom d'hôte, et peut intégrer un WAF. Dès qu'une question parle d'URL ou de protection web, c'est lui.",
        ref: "Chapitre 05"
    },
    {
        q: "Que garantit le mode de redondance <strong>ZRS</strong> ?",
        c: ["Des copies synchrones réparties entre plusieurs zones d'une même région", "Des copies dans un seul datacenter", "Une réplication vers une région secondaire", "Une lecture possible depuis la région secondaire"],
        a: 0,
        why: "LRS = un datacenter · ZRS = plusieurs zones d'une région · GRS = région secondaire · RA-GRS = GRS avec lecture secondaire. Protection et coût croissent ensemble.",
        ref: "Chapitre 06"
    },
    {
        q: "Une Azure Function doit lire le mot de passe d'une base sans qu'il figure dans le code. Quelle combinaison ?",
        c: ["Une Managed Identity qui lit le secret dans Key Vault", "Une variable d'environnement chiffrée dans le code source", "Un compte de service avec un mot de passe renouvelé tous les mois", "Un NSG limitant l'accès à la base"],
        a: 0,
        why: "Azure gère lui-même les identifiants de la Managed Identity ; Key Vault centralise secrets, clés et certificats. Dès que la question parle de secrets ou de certificats, la réponse est Key Vault.",
        ref: "Chapitre 07"
    },
    {
        q: "Un utilisateur <em>Contributor</em> tente de créer une VM dans une région non approuvée. La création est bloquée. Qu'est-ce qui l'a bloquée ?",
        c: ["Une Azure Policy", "Son rôle RBAC, insuffisant", "Un resource lock de type ReadOnly", "Un tag manquant sur le resource group"],
        a: 0,
        why: "RBAC contrôle les <strong>actions des identités</strong> — il a bien le droit de créer une VM. Policy contrôle les <strong>propriétés des ressources</strong> — la région choisie n'est pas conforme. Les deux se superposent.",
        ref: "Chapitre 08"
    },
    {
        q: "Quel outil pour <strong>estimer</strong> le coût d'une architecture avant de la déployer ?",
        c: ["Le Pricing Calculator", "Cost Management", "Le TCO Calculator", "Azure Advisor"],
        a: 0,
        why: "Avant de déployer : estimer (Pricing Calculator). Après : surveiller (Cost Management, budgets, alertes). Le TCO Calculator sert à autre chose : comparer le coût local à celui d'Azure.",
        ref: "Chapitre 09"
    },
    {
        q: "Une application web est lente. Quel service donne les requêtes, exceptions et dépendances côté applicatif ?",
        c: ["Application Insights", "Azure Advisor", "Service Health", "Cost Management"],
        a: 0,
        why: "Azure Monitor collecte métriques et logs ; Application Insights apporte l'observabilité <em>applicative</em>. Advisor recommande, Service Health signale les incidents Azure — ni l'un ni l'autre ne diagnostiquent votre code.",
        ref: "Chapitre 10"
    }]
},

"scrum": {
    name: "Agile & Scrum",
    file: "scrum.html",
    title: "Test — Agile & Scrum",
    intro: "Neuf chapitres, dix questions. Elles portent surtout sur les distinctions que tout le monde confond : Review et Rétrospective, les deux backlogs, critères d'acceptation et Definition of Done.",
    pass: 70,
    questions: [
    {
        q: "Pourquoi ne peut-on pas s'engager à l'avance, simultanément, sur le budget, le délai et le contenu exact ?",
        c: ["Le triangle d'or : vite, pas cher, bien — on n'en obtient que deux, le troisième varie", "Parce que les clients changent toujours d'avis", "Parce que les estimations en heures sont toujours fausses", "Parce que Scrum interdit les engagements contractuels"],
        a: 0,
        why: "Choisir une méthode, c'est choisir lequel des trois on fait varier. Waterfall fige le contenu et laisse déraper délais et coûts ; l'Agile fige le temps et les moyens et fait varier la quantité livrée.",
        ref: "Chapitre 01"
    },
    {
        q: "Que dit exactement le Manifeste Agile sur la documentation ?",
        c: ["Qu'un logiciel opérationnel prime sur une documentation exhaustive, sans que celle-ci perde toute valeur", "Qu'il ne faut plus documenter", "Que la documentation doit être rédigée après la livraison", "Que la documentation remplace les spécifications"],
        a: 0,
        why: "Contresens le plus fréquent : les éléments de droite gardent de la valeur, ceux de gauche priment. Être Agile ne veut dire ni « ne plus rien documenter », ni « travailler sans plan ».",
        ref: "Chapitre 01"
    },
    {
        q: "Quelle est la différence entre itératif et incrémental ?",
        c: ["Itératif = on repasse pour améliorer ; incrémental = on ajoute des morceaux complets", "Itératif = on ajoute des morceaux ; incrémental = on répète le même sprint", "Ce sont deux mots pour la même chose", "Itératif concerne le produit, incrémental concerne l'équipe"],
        a: 0,
        why: "Le peintre itératif esquisse tout puis repasse dessus ; le peintre incrémental finit un coin, puis le suivant. Scrum fait les deux : chaque sprint ajoute un morceau utilisable et permet de revenir améliorer l'existant.",
        ref: "Chapitre 02"
    },
    {
        q: "Une équipe tient scrupuleusement ses cérémonies, mais personne ne signale jamais les difficultés. Quel pilier est cassé, et avec quelle conséquence ?",
        c: ["La transparence — sans elle, l'inspection n'a rien à examiner et l'adaptation ne se déclenche pas", "L'inspection — les cérémonies n'ont pas lieu assez souvent", "L'adaptation — l'équipe ne change pas assez son produit", "Aucun : tenir les cérémonies suffit"],
        a: 0,
        why: "Les trois piliers forment une boucle indissociable. Une équipe peut cocher toutes les cases de Scrum et travailler très mal : ce sont les valeurs — courage, ouverture — qui rendent la transparence réelle.",
        ref: "Chapitre 02"
    },
    {
        q: "Laquelle des deux réunions de fin de sprint inspecte le <strong>produit</strong>, et avec qui ?",
        c: ["La Sprint Review, avec les parties prenantes", "La Rétrospective, avec les parties prenantes", "La Sprint Review, entre l'équipe Scrum uniquement", "Le Sprint Planning, avec le client"],
        a: 0,
        why: "La Review porte sur le produit — le <em>quoi</em> — avec le client. La Rétrospective porte sur la façon de travailler — le <em>comment</em> — sans lui. « La Review, c'est ce qu'on a fait ; la Rétro, c'est comment on l'a fait. »",
        ref: "Chapitre 03"
    },
    {
        q: "Qui décide de la <strong>quantité</strong> de travail prise dans un sprint ?",
        c: ["L'équipe technique", "Le Product Owner", "Le Scrum Master", "Les parties prenantes, en Review"],
        a: 0,
        why: "Le PO dit ce qui est prioritaire ; l'équipe dit ce qu'elle peut tenir et comment. C'est le même partage que pour l'estimation de l'effort, qui n'appartient qu'à ceux qui feront le travail.",
        ref: "Chapitre 04 · ch. 06"
    },
    {
        q: "Quelles affirmations décrivent correctement le Scrum Master ?",
        c: ["Il lève les obstacles qui ralentissent l'équipe", "Il anime les quatre cérémonies", "Il attribue les tâches aux membres de l'équipe", "Il arbitre les priorités du Product Backlog"],
        a: [0, 1],
        why: "Leader serviteur : au service de l'équipe, du PO et de l'organisation — jamais au-dessus. Distribuer les tâches contredirait l'auto-organisation, et les priorités appartiennent au PO.",
        ref: "Chapitre 04"
    },
    {
        q: "« En tant qu'employé, je veux réinitialiser mon mot de passe et consulter mes demandes. » Que reproches-tu à cette user story ?",
        c: ["Le « et » : ce sont deux besoins distincts, donc deux stories", "Elle ne nomme pas l'utilisateur", "Elle est trop courte pour être estimable", "Elle devrait être écrite du point de vue du système"],
        a: 0,
        why: "Pas de « et » (deux stories), pas de « ou » (une ambiguïté, on retourne voir le PO). Une story = un besoin, un utilisateur, un bénéfice — et c'est le bénéfice qui manque aussi ici.",
        ref: "Chapitre 06"
    },
    {
        q: "Qu'est-ce qui distingue le Product Backlog du Sprint Backlog ?",
        c: ["Le premier contient tout ce qui reste à faire et appartient au PO ; le second est la sélection d'un sprint et appartient à l'équipe", "Le premier est technique, le second fonctionnel", "Le premier est figé, le second évolue", "Le premier appartient à l'équipe, le second au Scrum Master"],
        a: 0,
        why: "Le Product Backlog est la carte du restaurant, le Sprint Backlog ce que tu as commandé ce midi. L'un vit tant que le produit existe, l'autre le temps d'un sprint.",
        ref: "Chapitre 06 · ch. 07"
    },
    {
        q: "Une fonctionnalité remplit tous ses critères d'acceptation mais n'est ni relue ni documentée. Peut-elle être présentée en Review comme terminée ?",
        c: ["Non : elle ne respecte pas la Definition of Done, donc elle retourne au Product Backlog", "Oui : les critères d'acceptation suffisent à déclarer une story terminée", "Oui, à condition que le PO l'accepte", "Non, mais elle peut être comptée dans la vélocité du sprint"],
        a: 0,
        why: "Les critères d'acceptation portent sur le besoin métier, story par story ; la Definition of Done porte sur la qualité du travail et s'applique à tout, sans exception. Tant qu'un critère manque, ce n'est pas terminé.",
        ref: "Chapitre 07"
    }]
},

"redmine": {
    name: "Redmine — helpdesk",
    file: "redmine.html",
    title: "Test — Redmine",
    intro: "Sept chapitres, dix questions. Elles portent sur le modèle de Redmine, sur le piège LDAP de Windows Server 2025, et sur ce qui rend une application en conteneurs exploitable : secrets, sauvegarde, HTTPS.",
    pass: 70,
    questions: [
    {
        q: "Dans Redmine, que définit le <strong>workflow</strong> ?",
        c: ["Les passages de statut permis, par rôle et par tracker", "L'ordre de traitement des demandes", "La liste des modules activés dans un projet", "Les notifications envoyées à chaque changement"],
        a: 0,
        why: "C'est lui qui permet, par exemple, de réserver le passage en <em>Résolu</em> au rôle support. Les droits ne sont pas portés par l'utilisateur mais par son rôle dans le projet.",
        ref: "Chapitre 01"
    },
    {
        q: "Qu'est-ce qui manque nativement à Redmine face à un outil de helpdesk dédié comme GLPI ?",
        c: ["Un portail simplifié pour l'utilisateur", "La gestion de SLA", "L'inventaire du parc", "Le suivi de demandes par statut"],
        a: [0, 1, 2],
        why: "Redmine vient de la gestion de projets de développement. Configuré, il fait un honnête outil de support, mais portail simplifié, SLA et inventaire demandent des plugins.",
        ref: "Chapitre 01"
    },
    {
        q: "Le test du mode LDAP échoue avec <em>« Invalid LDAP Account/Password »</em> contre un DC Windows Server 2025, alors que le compte est bon. Quelle est la cause ?",
        c: ["Le DC exige la signature LDAP, que le LDAP simple de Redmine ne fournit pas", "Le Base DN est mal écrit", "Le compte de service n'est pas administrateur du domaine", "Le port 389 est réservé à LDAPS"],
        a: 0,
        why: "Le message de Redmine vaut pour tout refus ; la vraie réponse du DC était <code>Stronger Auth Needed</code>. Le nouveau paramètre <em>…signing requirements Enforcement</em>, non défini, impose la signature.",
        ref: "Chapitre 03"
    },
    {
        q: "Que fait l'option <em>On-the-fly user creation</em> d'un mode LDAP ?",
        c: ["Elle crée le compte Redmine à la première connexion de l'utilisateur du domaine", "Elle importe tous les comptes de l'AD d'un coup", "Elle crée le compte dans l'AD s'il n'existe pas", "Elle synchronise les mots de passe dans la base de Redmine"],
        a: 0,
        why: "Le mot de passe reste vérifié par le DC à chaque connexion ; Redmine ne crée que le profil, rempli avec les attributs <code>givenName</code>, <code>sN</code> et <code>mail</code>.",
        ref: "Chapitre 03"
    },
    {
        q: "Pour passer cette connexion AD en production, que faut-il changer ?",
        c: ["Passer en LDAPS (port 636, certificat sur le DC)", "Utiliser un compte de service dédié, simple utilisateur du domaine", "Garder le compte Administrateur, plus fiable", "Désactiver la signature LDAP sur tous les DC"],
        a: [0, 1],
        why: "En LDAP simple, les mots de passe du domaine passent en clair : la désactivation de l'<em>Enforcement</em> est une solution de lab. Et lire l'annuaire ne demande aucun droit d'administration.",
        ref: "Chapitre 03"
    },
    {
        q: "Dans le Compose, <code>${MSQL_USER}</code> est écrit au lieu de <code>${MYSQL_USER}</code>. Que se passe-t-il ?",
        c: ["Compose remplace la variable par une chaîne vide, avec un simple avertissement — <code>docker compose config</code> le montre", "Compose refuse de démarrer et signale une erreur de syntaxe", "Compose garde le texte <code>${MSQL_USER}</code> tel quel", "Docker demande la valeur au démarrage"],
        a: 0,
        why: "Aucune erreur bloquante : Redmine tente alors de se connecter sans nom d'utilisateur. <code>docker compose config</code> affiche le résultat du remplacement avant de relancer.",
        ref: "Chapitre 05"
    },
    {
        q: "La base MariaDB existe déjà. On change <code>MYSQL_PASSWORD</code> dans le <code>.env</code> et on relance. Résultat ?",
        c: ["Redmine ne peut plus se connecter : MariaDB ne lit <code>MARIADB_*</code> qu'à la création de la base", "Le mot de passe de la base est mis à jour au redémarrage", "MariaDB recrée la base avec le nouveau mot de passe", "Rien ne change, Redmine garde l'ancien mot de passe en cache"],
        a: 0,
        why: "Sur une base existante, on garde les mêmes valeurs. Changer un mot de passe de base se fait dans la base elle-même, puis dans le <code>.env</code>.",
        ref: "Chapitre 05"
    },
    {
        q: "Pourquoi le script de sauvegarde appelle-t-il <code>mariadb-dump</code> avec <code>--single-transaction</code> ?",
        c: ["Pour obtenir une photo cohérente de la base sans bloquer Redmine", "Pour compresser le dump", "Pour ne sauvegarder qu'une table à la fois", "Pour inclure les pièces jointes dans le dump"],
        a: 0,
        why: "Le dump lit la base dans une seule transaction : cohérent, et l'application continue de tourner. Les pièces jointes, elles, sont dans un volume et s'archivent à part.",
        ref: "Chapitre 06"
    },
    {
        q: "Que signifie la ligne de crontab <code>0 16 * * * …/backup-redmine.sh &gt;&gt; …/backup.log 2&gt;&amp;1</code> ?",
        c: ["Tous les jours à 16 h 00, avec la sortie et les erreurs ajoutées au journal", "Toutes les 16 minutes, sortie écrasée à chaque passage", "Le 16 de chaque mois à minuit", "Tous les jours à 16 h, erreurs ignorées"],
        a: 0,
        why: "Minute 0, heure 16, tous les jours de tous les mois. <code>&gt;&gt;</code> ajoute au fichier, <code>2&gt;&amp;1</code> y envoie aussi les erreurs.",
        ref: "Chapitre 06"
    },
    {
        q: "Derrière nginx, les liens des e-mails de Redmine pointent vers <code>http://localhost:3000/…</code>. Que corriger ?",
        c: ["<em>Host name and path</em> et <em>Protocol</em> dans <strong>Administration &gt; Settings &gt; General</strong>", "Publier à nouveau le port 3000 de Redmine", "Ajouter un second <code>server_name</code> dans nginx", "Supprimer l'en-tête <code>X-Forwarded-Proto</code>"],
        a: 0,
        why: "Redmine ne voit que nginx et ignore son adresse publique. Pour les liens absolus envoyés hors du navigateur — e-mails, webhooks, API — on lui donne le nom public et le protocole HTTPS.",
        ref: "Chapitre 07"
    }]
},

"entretien-recrutement": {
    name: "Entretien de recrutement",
    file: "entretien-recrutement.html",
    title: "Test — Entretien de recrutement",
    intro: "Neuf chapitres, dix questions. Elles portent sur ce qui se décide en une seconde le jour J : à quel niveau répondre, comment formuler un défaut, quoi faire avant de partir, et comment reprendre la main sur son stress.",
    pass: 70,
    questions: [
    {
        q: "Que désignent les cinq lettres de la méthode <strong>STARR</strong> ?",
        c: ["Situation, Tâche(s), Actions, Résultats, Réflexion", "Situation, Talents, Ambitions, Résultats, Rémunération", "Sujet, Tâche(s), Analyse, Réponse, Relance", "Situation, Tâche(s), Actions, Résultats, Remerciements"],
        a: 0,
        why: "Contexte, ce qui était demandé, ce que <em>tu</em> as fait, ce que ça a donné, et le recul : ferais-tu pareil, ou différemment ? Le second R, la Réflexion, est ce qui distingue STARR de la version courte STAR.",
        ref: "Chapitre 02"
    },
    {
        q: "« Qu'avez-vous fait lorsque vous travailliez dans l'entreprise X ? » Comment répondre ?",
        c: ["Uniquement au niveau des Tâches, concret et précis", "En déroulant les cinq étapes du STARR, dans l'ordre", "En commençant par la Situation pour poser le contexte", "Par les Résultats, ce qui intéresse le recruteur"],
        a: 0,
        why: "Une question précise appelle une réponse précise : on cherche à quel niveau du STARR elle se trouve — ici les Tâches, le rôle tenu — et on répond à ce niveau seulement. Les cinq étapes, c'est pour la question large.",
        ref: "Chapitre 02"
    },
    {
        q: "« Dans six mois, qu'aurez-vous mis en place chez nous ? » Quelle construction le cours recommande-t-il ?",
        c: ["L'humilité d'abord (découvrir l'équipe et l'existant), puis des hypothèses annoncées comme telles, avec les actions qui en découlent", "Un plan de transformation détaillé, pour montrer son ambition", "Botter en touche : impossible de répondre sans connaître l'entreprise", "Lister ses réalisations passées, en STARR"],
        a: 0,
        why: "Pas question de tout changer tout de suite : on ne connaît encore ni l'équipe ni le projet. Une fois cette humilité posée, on s'autorise des hypothèses à partir de ce qu'on sait déjà — « j'imagine que vos défis sont là… du coup, je ferais… ».",
        ref: "Chapitre 03"
    },
    {
        q: "Une étude de cas vous est soumise en entretien. Autour de quoi construire la réponse ?",
        c: ["La boucle du management : analyse, objectif, plan d'action, mise en œuvre, contrôle, correction", "La méthode STARR, comme pour toute question", "Les trois réponses au stress : fuir, combattre, se figer", "La check-list avant entretien"],
        a: 0,
        why: "Une étude de cas demande de montrer une démarche, pas une anecdote : on comprend avant d'agir, on fixe un objectif, on planifie, on fait, on vérifie et on corrige — puis la boucle repart.",
        ref: "Chapitre 03"
    },
    {
        q: "« Quel est votre principal défaut ? » Quelle réponse est orientée solution ?",
        c: ["« Actuellement, je travaille sur ma gestion du temps et j'en retire… »", "« J'ai du mal à m'organiser. »", "« Je n'ai pas vraiment de défaut. »", "« Mon ancien chef ne me laissait pas m'organiser. »"],
        a: 0,
        why: "Le défaut est nommé, avec une action en cours et un progrès. « J'ai du mal à m'organiser » fige le problème ; nier tout défaut ne répond pas à la question ; et rejeter la faute sur un ancien employeur cumule deux erreurs.",
        ref: "Chapitre 05"
    },
    {
        q: "Une question vous laisse sans réponse immédiate. Quels réflexes le cours recommande-t-il ?",
        c: ["Reformuler la question pour vérifier qu'on l'a comprise et se donner le temps de réfléchir", "Accepter un moment de silence avant de répondre", "Répondre tout de suite, pour ne pas laisser de blanc", "Glisser vers un sujet qu'on maîtrise mieux"],
        a: [0, 1],
        why: "Reformuler sert deux fois : vérifier la compréhension et gagner du temps. Le silence montre qu'on cherche à répondre au plus juste. Dévier de la question, en revanche, est exactement ce qu'il ne faut jamais faire.",
        ref: "Chapitre 05"
    },
    {
        q: "Que retenir du schéma 7 % mots / 38 % voix / 55 % corps ?",
        c: ["Que la voix et le corps doivent porter le même message que les mots, sinon la réponse ne convainc pas", "Que le contenu des réponses ne compte presque pas en entretien", "Qu'il vaut mieux parler peu et miser sur la gestuelle", "Que ces pourcentages valent pour toute communication"],
        a: 0,
        why: "Ces chiffres viennent d'expériences de Mehrabian sur la perception d'un sentiment quand mots, ton et visage se contredisent. Ils ne disent pas que le fond est accessoire — ils disent que le non-verbal décide si le fond sera cru.",
        ref: "Chapitre 04"
    },
    {
        q: "Quelles sont les trois choses à faire pour clôturer un entretien ?",
        c: ["Confirmer son intérêt et sa motivation (ou non)", "Clarifier la suite de la procédure", "Remercier", "Annoncer ses prétentions salariales"],
        a: [0, 1, 2],
        why: "Intérêt confirmé, suite connue, merci. Le salaire se prépare (check-list du chapitre 01), mais ce n'est pas au moment de partir qu'on l'annonce de soi-même.",
        ref: "Chapitre 06"
    },
    {
        q: "Pourquoi le stress a-t-il tendance à <strong>monter</strong> pendant un entretien ?",
        c: ["Parce que les trois réponses instinctives — fuir, combattre, se figer — y sont impossibles", "Parce que le recruteur cherche à déstabiliser le candidat", "Parce qu'une émotion dure tout l'entretien", "Parce que le stress n'apparaît que chez les candidats mal préparés"],
        a: 0,
        why: "Le stress est un instinct de survie face au danger : <em>flee, fight, freeze</em>. En entretien, aucune de ces sorties n'est possible, donc il s'accumule. D'où l'intérêt d'agir dessus autrement : pensées, émotions, comportements.",
        ref: "Chapitre 07"
    },
    {
        q: "Où peut-on agir pour casser le cercle vicieux du stress ?",
        c: ["Sur n'importe laquelle des trois parts : pensées, émotions ou comportements", "Uniquement sur les pensées, d'où viennent les émotions", "Uniquement sur le corps, par la respiration", "Nulle part : il faut attendre que ça passe"],
        a: 0,
        why: "Les trois parts s'entretiennent : on peut positiver ses pensées (le stress aide à se concentrer), laisser passer l'émotion (environ 90 secondes) ou choisir son attitude (sourire, respiration lente). Agir sur une seule ralentit toute la boucle.",
        ref: "Chapitre 07 · ch. 08"
    }]
},


};


/* ══════════════════════════════════════════════════════════════════
   EXAMENS TRANSVERSAUX
   Chaque examen tire au sort dans les fonds des modules qu'il couvre,
   et ajoute ses propres questions de synthèse — celles-là sont
   toujours posées : c'est là que se joue le lien entre modules.
   ══════════════════════════════════════════════════════════════════ */

window.EXAM_BANK = {

"fondations": {
    short: "Examen 01 · Fondations",
    title: "Examen — Parcours 01 · Fondations",
    label: "Examen de parcours",
    intro: "Le socle : le réseau et son dépannage, un plan d'adressage, un labo virtuel et un terminal Linux. Vingt questions tirées au sort dans les cinq modules, plus des questions de synthèse qui les font se rencontrer.",
    parts: ["reseau-bases", "subnetting", "hyperv", "linux-debian", "depannage-reseau"],
    draw: 20,
    pass: 70,
    questions: [
    {
        q: "Vous montez une VM Debian sous Hyper-V qui doit accéder à Internet et à votre plan d'adressage fixe. Quels choix sont cohérents ?",
        c: ["Un commutateur virtuel externe", "Une adresse IP statique hors de la plage DHCP", "Un commutateur virtuel privé", "Une adresse attribuée par DHCP, plus simple à maintenir"],
        a: [0, 1],
        why: "Externe = ponté sur la carte physique, donc Internet. Et un serveur ne reste jamais en DHCP : son adresse doit être prévisible, et choisie hors de la plage distribuée pour éviter tout conflit.",
        ref: "Hyper-V ch. 07 · Linux ch. 14"
    },
    {
        q: "Depuis une VM Debian fraîchement installée, <code>ping 8.8.8.8</code> échoue et <code>ip a</code> ne montre aucune adresse sur <code>ens33</code>. Par quoi commencer ?",
        c: ["Vérifier la configuration d'interface et le commutateur virtuel auquel la VM est rattachée", "Reconfigurer <code>/etc/resolv.conf</code>", "Réinstaller le système", "Changer le codec réseau de la carte virtuelle"],
        a: 0,
        why: "Pas d'adresse du tout = le problème est en amont du DNS : configuration d'interface, ou VM branchée sur un commutateur privé qui ne mène nulle part. <code>resolv.conf</code> ne se regarde que si l'IP fonctionne mais pas les noms.",
        ref: "Hyper-V ch. 07 · Linux ch. 14"
    },
    {
        q: "Vous devez adresser un labo : 3 serveurs, 20 postes, et une liaison entre deux routeurs. Quel découpage de <code>192.168.10.0/24</code> est correct ?",
        c: ["Un /27 pour les postes, un /29 pour les serveurs, un /30 pour la liaison", "Un /24 pour tout le monde, plus simple", "Un /30 pour les postes, un /27 pour la liaison", "Trois /25, un par usage"],
        a: 0,
        why: "On sert du plus gros au plus petit : 20 postes → /27 (30 hôtes), 3 serveurs → /29 (6 hôtes), liaison point-à-point → /30 (2 hôtes). Trois /25 ne rentreraient même pas dans un /24.",
        ref: "Subnetting ch. 06"
    },
    {
        q: "Sur le disque parent SYSPREP d'Hyper-V et sur un <code>rm -rf</code> sous Linux, quel réflexe est commun ?",
        c: ["Relire avant d'agir : les deux opérations sont irréversibles et silencieuses", "Toujours lancer la commande en tant qu'administrateur", "Faire un snapshot après l'opération", "Vérifier l'espace disque disponible"],
        a: 0,
        why: "Démarrer un disque parent casse toutes les VM enfants ; <code>rm -rf</code> supprime sans corbeille ni confirmation. Deux contextes, un même réflexe : relire avant de valider.",
        ref: "Hyper-V ch. 06 · Linux ch. 04"
    },
    {
        q: "Un service SSH doit survivre au redémarrage d'une VM du labo. Que faut-il faire ?",
        c: ["<code>systemctl enable ssh</code> en plus de <code>systemctl start ssh</code>", "<code>systemctl start ssh</code> suffit", "Ajouter la commande dans <code>~/.bashrc</code>", "Configurer un snapshot Hyper-V au démarrage"],
        a: 0,
        why: "<code>start</code> agit maintenant, <code>enable</code> au prochain démarrage. Pour un service qui doit toujours tourner, il faut les deux — ou <code>enable --now</code>.",
        ref: "Linux ch. 17"
    }]
},

"windows": {
    short: "Examen 02 · Infrastructure Windows",
    title: "Examen — Parcours 02 · Infrastructure Windows",
    label: "Examen de parcours",
    intro: "Le plus large des examens : annuaire, automatisation, stockage, sessions, web, messagerie, base de données, intranet et sauvegarde. Trente questions puisées dans neuf modules.",
    parts: ["windows-server", "powershell", "storage-clustering", "rds", "iis", "exchange-securite", "sql-server", "sharepoint", "dpm"],
    draw: 30,
    pass: 70,
    questions: [
    {
        q: "Le gMSA revient dans plusieurs modules du parcours. Quel problème résout-il, et où l'utilise-t-on ?",
        c: ["Il supprime les mots de passe de comptes de service à gérer : AD les renouvelle, pour SQL Server comme pour les services applicatifs", "Il permet une ouverture de session interactive partagée entre administrateurs", "Il remplace les certificats pour l'authentification des services", "Il n'existe que pour SQL Server"],
        a: 0,
        why: "AD génère et renouvelle le mot de passe seul. On le déclare dans l'assistant d'installation de SQL Server pour qu'il pose les bonnes ACL, et on le vérifie avec <code>Test-ADServiceAccount</code>.",
        ref: "SQL Server ch. 03 · PowerShell ch. 08"
    },
    {
        q: "RDS Web Access et Exchange affichent tous deux une alerte de certificat. Quelle correction traite les deux cas ?",
        c: ["Faire signer les certificats par la CA d'entreprise, dont la racine est publiée dans AD", "Régénérer des certificats auto-signés avec une durée plus longue", "Ajouter une exception dans le navigateur de chaque poste", "Désactiver la vérification de révocation"],
        a: 0,
        why: "Même logique de PKI dans les deux modules : l'auto-signé dit « c'est moi qui le dis ». Une Enterprise Root CA publie sa racine dans AD, donc tous les postes du domaine valident la chaîne sans manipulation.",
        ref: "Exchange ch. 05 · RDS ch. 06"
    },
    {
        q: "Un utilisateur accède en lecture seule à un partage clusterisé alors que ses droits NTFS sont en Contrôle total, et son login SQL ne voit aucune donnée dans la base restaurée. Quel principe commun explique ces deux symptômes ?",
        c: ["Deux jeux de droits se superposent : le plus restrictif l'emporte côté partage, et le login ne vaut rien sans user côté base", "Les deux services nécessitent un redémarrage pour appliquer les droits", "Le compte est bloqué par une GPO", "Le cluster et SQL Server ignorent les droits NTFS"],
        a: 0,
        why: "Côté fichiers : partage et NTFS sont distincts, le plus restrictif gagne à travers le réseau. Côté SQL : le login vit dans <code>master</code>, le user dans la base — une restauration ailleurs laisse des utilisateurs orphelins.",
        ref: "Stockage ch. 04 · SQL Server ch. 10"
    },
    {
        q: "Cluster de basculement, réplication DFS, groupe de disponibilité Always On : que garantissent-ils tous les trois ?",
        c: ["La disponibilité face à une panne de serveur, jamais un retour en arrière sur les données", "Une protection complète, sauvegardes comprises", "Une protection contre les rançongiciels", "Une restauration au point dans le temps"],
        a: 0,
        why: "Une base corrompue, une table supprimée ou un chiffrement par rançongiciel se répliquent fidèlement. Seule une sauvegarde permet de revenir en arrière : les deux approches sont complémentaires, jamais alternatives.",
        ref: "Stockage ch. 11 · SQL Server ch. 14 · Windows Server ch. 09"
    },
    {
        q: "Où se sauvegarde en priorité un environnement SharePoint, et pourquoi ?",
        c: ["Au niveau des bases SQL de contenu — c'est là que vivent les données et c'est la méthode la plus fiable", "Au niveau des serveurs Web Front End", "Au niveau des collections de sites uniquement", "Sur les postes des utilisateurs, via la synchronisation"],
        a: 0,
        why: "La hiérarchie logique commande : on sauvegarde au niveau de la base de contenu, on sécurise au niveau de la collection de sites. Le point le plus sensible d'une ferme reste toujours SQL Server.",
        ref: "SharePoint ch. 06 · ch. 07 · ch. 18"
    },
    {
        q: "Quel principe traverse tout le parcours Windows en matière de droits ?",
        c: ["Le moindre privilège : <code>db_datareader</code>/<code>db_datawriter</code> plutôt que <code>sysadmin</code>, un gMSA plutôt qu'un compte admin du domaine", "Le contrôle total, quitte à restreindre plus tard", "Un compte administrateur partagé, documenté dans un coffre", "L'attribution des droits directement aux utilisateurs, sans groupes"],
        a: 0,
        why: "L'erreur la plus fréquente en entreprise est d'ajouter <code>sysadmin</code> pour résoudre un simple problème de permission. Même logique côté AD : on autorise via les groupes, on délègue au niveau de l'OU.",
        ref: "SQL Server ch. 10 · Windows Server ch. 05 · ch. 11"
    },
    {
        q: "Le setup DPM échoue en erreur 811 : le client SQL (ODBC 18) refuse le certificat auto-généré du serveur SQL. Quel mécanisme déjà rencontré dans le parcours est en jeu ?",
        c: ["La chaîne de confiance : un client n'accepte qu'un certificat rattaché à une autorité qu'il connaît", "Le moindre privilège : le compte du setup n'est pas sysadmin", "Le quorum : le serveur SQL n'a pas de témoin", "La délégation Kerberos du gMSA"],
        a: 0,
        why: "Même cause qu'une alerte de certificat sur RDS Web Access ou Exchange : un auto-signé dit « c'est moi qui le dis ». On fait approuver le certificat par le client — ici, importé dans les autorités racines de confiance du serveur DPM.",
        ref: "DPM ch. 08 · Exchange ch. 04"
    }]
},

"reseau": {
    short: "Examen 03 · Réseau & téléphonie",
    title: "Examen — Parcours 03 · Réseau & téléphonie",
    label: "Examen de parcours",
    intro: "Du plan d'adressage à la voix qui passe : subnetting, configuration et sécurisation Cisco, téléphonie IP. Vingt questions, dont plusieurs cas de dépannage.",
    parts: ["subnetting", "ccna-reseau", "cisco-securite", "voip"],
    draw: 20,
    pass: 70,
    questions: [
    {
        q: "Vous déployez de la téléphonie IP sur un réseau Cisco existant. Quelles décisions vont ensemble ?",
        c: ["Un VLAN dédié à la voix, avec une QoS qui priorise ce trafic", "Un plan VLSM dimensionné sur le nombre de postes à raccorder", "Un seul VLAN commun données et voix, plus simple à router", "Une priorisation du trafic de données pour éviter la congestion"],
        a: [0, 1],
        why: "La voix se sépare et se priorise : un VLAN dédié, une QoS stricte. Et comme tout segment, il se dimensionne au VLSM — un /24 pour douze postes, c'est du gaspillage.",
        ref: "VoIP ch. 02 · CCNA ch. 03 · Subnetting ch. 06"
    },
    {
        q: "Après l'ajout d'une ACL sur le routeur de bordure, les téléphones sonnent mais aucune voix ne passe. Quelle est la cause la plus probable ?",
        c: ["L'ACL laisse passer la signalisation SIP mais bloque le flux RTP", "Le codec négocié n'est plus supporté", "Le VLAN voix a été supprimé", "Le PoE ne délivre plus assez de puissance"],
        a: 0,
        why: "SIP monte l'appel, RTP porte la voix, par des chemins et des ports différents. Une ACL évaluée dans l'ordre avec son deny implicite final laisse très bien passer l'un sans l'autre.",
        ref: "VoIP ch. 05 · CCNA ch. 12"
    },
    {
        q: "Sur le routeur qui sert le VLAN voix en DHCP, que faut-il impérativement exclure du pool ?",
        c: ["Les adresses fixes : passerelle, PBX, serveurs", "Les adresses de broadcast uniquement", "Rien : le DHCP détecte les conflits automatiquement", "La totalité de la première moitié du sous-réseau"],
        a: 0,
        why: "<code>ip dhcp excluded-address</code> protège tout ce qui est adressé en fixe. Sans cela, le serveur distribue une adresse déjà utilisée — et le conflit se voit immédiatement sur le poste concerné.",
        ref: "CCNA ch. 05"
    },
    {
        q: "Vous devez dimensionner un VLAN pour 60 téléphones IP. Quel masque choisir ?",
        c: ["/26 — 62 hôtes utilisables", "/27 — 30 hôtes utilisables", "/25 — 126 hôtes utilisables, avec de la marge", "/24 — pour ne jamais avoir à y revenir"],
        a: 0,
        why: "Le plus petit masque qui couvre le besoin : 2⁶ − 2 = 62 ≥ 60. Un /27 ne suffit pas, un /25 gaspille la moitié de l'espace — c'est exactement le raisonnement VLSM.",
        ref: "Subnetting ch. 06 · CCNA ch. 06"
    },
    {
        q: "Un projet réseau complet avec téléphonie s'enchaîne dans quel ordre ?",
        c: ["Adressage → sécurité → VLAN → routage → services (DHCP/DNS) → bordure (NAT/ACL) → téléphonie", "Téléphonie → VLAN → adressage → routage → bordure", "VLAN → routage → adressage → services → sécurité", "Bordure → services → adressage → VLAN → routage"],
        a: 0,
        why: "La séquence de l'exercice final CCNA, avec la voix posée sur un réseau déjà segmenté, routé et priorisé. On ne configure jamais un VLAN avant d'avoir écrit son plan d'adressage.",
        ref: "CCNA ch. 15 · VoIP ch. 09"
    }]
},

"virtualisation": {
    short: "Examen 04 · Virtualisation & homelab",
    title: "Examen — Parcours 04 · Virtualisation, homelab & sécurité",
    label: "Examen de parcours",
    intro: "Son propre hyperviseur, ses conteneurs, ses services, et de quoi les défendre. Vingt questions sur Proxmox, Docker, le self-hosting et la sécurité.",
    parts: ["proxmox", "docker", "homelab", "securite"],
    draw: 20,
    pass: 70,
    questions: [
    {
        q: "Vous hébergez une dizaine de services Docker sur un Proxmox. Quelle architecture est correcte ?",
        c: ["Une VM dédiée à Docker, exposée derrière un reverse proxy, accessible de l'extérieur par VPN", "Un conteneur LXC privilégié pour Docker, avec un port forwarding par service", "Docker installé directement sur l'hôte Proxmox", "Une VM par conteneur Docker, pour l'isolation maximale"],
        a: 0,
        why: "Docker va dans une VM, pas dans un LXC ni sur l'hyperviseur. Un reverse proxy donne le point d'entrée unique et le HTTPS ; l'accès distant passe par un VPN, jamais par du port forwarding.",
        ref: "Proxmox ch. 04 · Homelab ch. 03 · ch. 08"
    },
    {
        q: "Snapshot ZFS local, RAID en miroir, réplication entre deux nœuds : que manque-t-il ?",
        c: ["Une copie hors site, testée en restauration", "Un troisième disque dans le miroir", "Un QDevice pour le quorum", "Une compression lz4 sur le pool"],
        a: 0,
        why: "3 copies, 2 supports, 1 hors site. Snapshot, RAID et réplication vivent tous sur la même infrastructure : une suppression, une corruption ou un rançongiciel les traverse tous les trois.",
        ref: "Proxmox ch. 07 · Homelab ch. 07 · Sécurité ch. 07"
    },
    {
        q: "Quelles pratiques réduisent réellement la surface d'attaque d'un homelab ?",
        c: ["Aucun port ouvert vers un service, accès uniquement par VPN", "Automatisation par API tokens plutôt qu'avec le compte root", "Changer les ports par défaut de chaque service exposé", "Installer un antivirus sur l'hyperviseur"],
        a: [0, 1],
        why: "Réduire la surface, c'est n'avoir rien à trouver : pas de service exposé, pas de compte privilégié utilisé pour l'automatisation. Changer un port ne fait que retarder un scan complet.",
        ref: "Homelab ch. 08 · Proxmox ch. 09 · Sécurité ch. 04"
    },
    {
        q: "Vous voulez tester un outil offensif découvert dans une vidéo. Où et comment ?",
        c: ["Dans un labo isolé, sur vos propres VM, avec un snapshot propre pour repartir de zéro", "Sur un service exposé de votre homelab, pour un test réaliste", "Sur une cible publique, en signalant les failles ensuite", "Sur le réseau de votre employeur, puisque vous y avez un compte"],
        a: 0,
        why: "Pas d'autorisation = pas de test. Le labo se compose d'un attaquant, d'une cible vulnérable et d'une isolation réseau totale — et on relit toujours un script communautaire avant de le lancer.",
        ref: "Sécurité ch. 01 · ch. 02 · Proxmox ch. 09"
    },
    {
        q: "Segmenter un homelab en VLAN sur Proxmox : que faut-il côté hôte et côté switch ?",
        c: ["<code>bridge-vlan-aware</code> sur <code>vmbr0</code>, un VLAN Tag par interface, et un port en trunk côté switch", "Un bridge par VLAN, et un port access par bridge côté switch", "Rien côté switch : Proxmox gère le marquage seul", "Un routeur virtuel dédié par VLAN"],
        a: 0,
        why: "<code>vmbr0</code> est un switch virtuel : on l'active en VLAN-aware, on tague par interface, et le lien physique doit transporter tous les VLAN — donc en trunk, exactement comme entre deux switches Cisco.",
        ref: "Proxmox ch. 06 · CCNA ch. 03"
    }]
},

"cloud": {
    short: "Examen 05 · Cloud, supervision & méthode",
    title: "Examen — Parcours 05 · Cloud, supervision & méthode",
    label: "Examen de parcours",
    intro: "Superviser un parc, porter une infrastructure dans le cloud, organiser le travail et le support autour des deux — et savoir le raconter en entretien. Vingt questions tirées dans les six modules, plus des questions de synthèse qui les font se rencontrer.",
    parts: ["monitoring-zabbix", "zabbix-windows", "azure", "scrum", "redmine", "entretien-recrutement"],
    draw: 20,
    pass: 70,
    questions: [
    {
        q: "Zabbix parle d'items, de triggers et d'actions ; Azure Monitor de métriques, d'alertes et d'action groups. Qu'est-ce que cette symétrie dit de la supervision ?",
        c: ["La mécanique est toujours la même : mesurer, évaluer une condition, déclencher une notification ou une action", "Azure Monitor est une réécriture de Zabbix par Microsoft", "Les deux produits ne sont comparables que sur les graphes", "Azure Monitor supervise le cloud, Zabbix ne supervise que Linux"],
        a: 0,
        why: "Les produits changent, la chaîne ne change pas : une valeur collectée, une condition évaluée, une notification ou une action déclenchée. Savoir lire cette chaîne dans un outil permet de la retrouver dans l'autre.",
        ref: "Zabbix ch. 02 · ch. 09 · Azure ch. 10"
    },
    {
        q: "Un même réflexe de sécurité traverse <code>AllowKey=system.run[*]</code> côté Zabbix et le RBAC côté Azure. Lequel ?",
        c: ["Le moindre privilège : n'autoriser que ce qui est nécessaire, au périmètre le plus étroit possible", "Chiffrer systématiquement les communications", "Journaliser toutes les actions administratives", "Séparer les environnements de test et de production"],
        a: 0,
        why: "<code>[*]</code> autorise toutes les commandes sur tout le parc ; un rôle posé sur une subscription couvre tout ce qu'elle contient. Dans les deux cas on restreint : <code>system.run[net start *]</code>, ou le rôle au bon scope.",
        ref: "Zabbix ch. 09 · Azure ch. 07"
    },
    {
        q: "Une équipe d'exploitation reçoit des incidents de façon imprévisible, alertés par la supervision. Quelle organisation de travail lui convient le mieux, et pourquoi ?",
        c: ["Kanban : on ne peut pas demander à une panne d'attendre le prochain sprint", "Scrum : les sprints de deux semaines cadrent les incidents", "Scrum sans rétrospective, pour gagner du temps", "Aucune méthode : l'exploitation ne se planifie pas"],
        a: 0,
        why: "Scrum convient au travail planifiable par cycles ; Kanban au travail qui arrive de façon imprévisible — un flux continu, avec une limite de travail en cours pour ne pas tout commencer en même temps.",
        ref: "Scrum ch. 08 · Zabbix ch. 01"
    },
    {
        q: "Un SLA à 99,9 % et un seuil d'alerte Zabbix mesurent-ils la même chose ?",
        c: ["Non : le SLA est un engagement contractuel de disponibilité, le seuil est une condition que vous choisissez pour être prévenu", "Oui : les deux expriment la disponibilité d'un service", "Non : le SLA se mesure en minutes, le seuil en pourcentage", "Oui, à condition d'aligner le seuil sur le SLA"],
        a: 0,
        why: "Un SLA n'améliore rien par lui-même — 99,9 % laisse déjà 43 minutes d'indisponibilité par mois, et des services en série multiplient leurs disponibilités. C'est l'architecture, et la supervision qui la surveille, qui font la disponibilité réelle.",
        ref: "Azure ch. 09 · Zabbix ch. 01"
    },
    {
        q: "Vous proposez d'automatiser le redémarrage des services arrêtés. L'équipe travaille en Scrum. Où cette demande entre-t-elle, et qui décide de sa priorité ?",
        c: ["Elle devient un élément du Product Backlog, et c'est le Product Owner qui l'ordonne", "Elle s'ajoute au Sprint Backlog en cours, puisqu'elle est urgente", "Le Scrum Master arbitre car c'est un obstacle technique", "L'équipe technique la traite directement, sans passer par le backlog"],
        a: 0,
        why: "Tout ce qui reste à faire sur le produit entre dans le Product Backlog, ordonné par le PO. Ajouter du contenu au sprint en cours contourne l'objectif du sprint — si l'urgence est réelle, on renégocie le contenu avec le PO, on ne se sert pas soi-même.",
        ref: "Scrum ch. 06 · ch. 07"
    },
    {
        q: "En entretien, vous racontez un projet mené en équipe Scrum avec la méthode STARR. Quelle étape du STARR fait le même travail que la Rétrospective ?",
        c: ["La Réflexion : ce qu'on referait pareil, ce qu'on ferait différemment la prochaine fois", "La Situation : le contexte du projet", "Les Résultats : ce que le sprint a livré", "Les Actions : ce que chacun a fait pendant le sprint"],
        a: 0,
        why: "La Rétrospective inspecte la façon de travailler et décide d'un changement pour le sprint suivant ; la Réflexion du STARR fait le même travail sur votre propre expérience. Ce qui a été livré relève plutôt des Résultats — l'équivalent de la Sprint Review.",
        ref: "Entretien ch. 02 · Scrum ch. 03"
    },
    {
        q: "On veut qu'un problème détecté par Zabbix devienne un ticket du helpdesk sans saisie manuelle. Quelle fonctionnalité de Redmine, ouverte dans le TP, le rend possible ?",
        c: ["L'API REST (<em>Enable REST web service</em>), avec une clé API dans l'en-tête <code>X-Redmine-API-Key</code>", "La connexion LDAP à l'Active Directory", "Le module Gantt", "La création de comptes à la volée"],
        a: 0,
        why: "L'API permet à un script ou à un autre outil de lire et de créer des tickets. C'est la suite logique de la chaîne mesurer / alerter / agir : l'alerte devient une demande suivie jusqu'à sa résolution.",
        ref: "Redmine ch. 02 · Zabbix &amp; Windows ch. 01"
    },
    {
        q: "Les Compose de Zabbix et de Redmine appliquent la même règle aux mots de passe. Laquelle ?",
        c: ["Ils sortent du Compose dans un <code>.env</code> en 600, que Compose lit tout seul et qui ne va jamais dans Git", "Ils sont écrits en dur dans le Compose, protégé en 600", "Ils sont passés en argument à <code>docker compose up</code>", "Ils sont stockés dans le volume de la base"],
        a: 0,
        why: "Le Compose peut alors être copié, montré ou versionné sans livrer les secrets. <code>docker compose config</code> vérifie le remplacement des <code>${VARIABLE}</code> avant de relancer.",
        ref: "Zabbix &amp; Windows ch. 02 · Redmine ch. 05"
    }]
},

"final": {
    short: "Examen final",
    title: "Examen final — les vingt-cinq modules",
    label: "Examen de synthèse",
    intro: "Quarante-cinq questions tirées dans l'ensemble du centre d'apprentissage, plus les principes qui traversent tous les parcours. C'est le test à repasser une fois les cinq examens de parcours validés.",
    parts: ["reseau-bases", "subnetting", "hyperv", "linux-debian", "depannage-reseau", "windows-server", "powershell", "storage-clustering", "rds", "iis", "exchange-securite", "sql-server", "sharepoint", "dpm", "ccna-reseau", "cisco-securite", "voip", "proxmox", "docker", "homelab", "securite", "monitoring-zabbix", "zabbix-windows", "azure", "scrum", "redmine", "entretien-recrutement"],
    draw: 45,
    pass: 75,
    questions: [
    {
        q: "Quelle affirmation sur les sauvegardes est vraie dans <strong>tous</strong> les modules du centre ?",
        c: ["Une sauvegarde jamais restaurée n'est pas une sauvegarde, c'est une hypothèse", "Une réplication à deux sites dispense de sauvegarder", "Un RAID correctement dimensionné remplace une sauvegarde", "Un snapshot quotidien équivaut à une sauvegarde hors site"],
        a: 0,
        why: "La règle 3-2-1 revient dans Stockage, SQL Server, SharePoint, Proxmox et Homelab, toujours avec la même conclusion : seule une restauration réellement effectuée — et chronométrée — prouve quoi que ce soit.",
        ref: "Principe transversal"
    },
    {
        q: "Le DNS apparaît dans presque tous les modules. Quels symptômes trahissent un problème de résolution plutôt que de connectivité ?",
        c: ["<code>ping</code> vers une IP fonctionne mais pas vers un nom", "Plus aucune ouverture de session sur un domaine Active Directory", "Aucune adresse IP n'est attribuée à l'interface", "Le câble réseau n'est pas détecté"],
        a: [0, 1],
        why: "Sous Linux, joindre une IP mais pas un nom pointe <code>/etc/resolv.conf</code>. Sous Windows, sans DNS fonctionnel, AD ne publie plus ses enregistrements de service : plus d'authentification du tout.",
        ref: "Linux ch. 15 · Windows Server ch. 03 · ch. 06"
    },
    {
        q: "Quel raisonnement de quorum est commun aux clusters Windows et Proxmox ?",
        c: ["Il faut un nombre impair de voix ; à deux nœuds, on ajoute un témoin (disque témoin ou QDevice)", "Il faut toujours un nombre pair de nœuds pour équilibrer la charge", "Le quorum se calcule sur la capacité disque, pas sur le nombre de nœuds", "Le quorum n'est nécessaire qu'au-delà de cinq nœuds"],
        a: 0,
        why: "Deux nœuds, deux voix, égalité : chacun peut se croire seul survivant et écrire sur le stockage partagé — c'est le split-brain. Le témoin apporte la voix impaire qui départage, sous Windows comme sous Proxmox.",
        ref: "Stockage ch. 09 · Proxmox ch. 08"
    },
    {
        q: "Le moindre privilège se décline dans plusieurs modules. Quelles applications sont correctes ?",
        c: ["Un compte applicatif en <code>db_datareader</code>/<code>db_datawriter</code> plutôt qu'en <code>sysadmin</code>", "Un API token Proxmox plutôt que le compte root pour l'automatisation", "Un compte administrateur du domaine comme compte de service, pour éviter les blocages", "Le contrôle total NTFS pour tous les utilisateurs d'un partage"],
        a: [0, 1],
        why: "Même principe, trois contextes : SQL Server, Proxmox, Active Directory. L'erreur classique est d'élever les droits pour « débloquer » — le blocage revient, avec une surface d'attaque en plus.",
        ref: "SQL Server ch. 10 · Proxmox ch. 09 · Sécurité ch. 06"
    },
    {
        q: "Un certificat auto-signé déclenche une alerte sur RDS Web Access, sur Exchange et sur un service du homelab. Quelle est la racine du problème ?",
        c: ["Le client ne peut remonter la chaîne de confiance jusqu'à une autorité qu'il connaît", "L'algorithme de chiffrement est trop faible", "Le certificat ne couvre pas le bon port", "La clé privée a été générée sur le mauvais serveur"],
        a: 0,
        why: "Un auto-signé dit « c'est moi qui le dis ». La réponse est la même partout : une autorité reconnue signe à sa place — CA d'entreprise publiée dans AD en interne, Let's Encrypt côté homelab.",
        ref: "Exchange ch. 04 · RDS ch. 06 · Homelab ch. 03"
    },
    {
        q: "Face à un incident (SQL Server qui ne répond plus, base en SUSPECT, cluster qui a basculé), quel est le premier geste ?",
        c: ["Lire les journaux avant de toucher quoi que ce soit", "Redémarrer le service pour rétablir au plus vite", "Restaurer la dernière sauvegarde", "Réinstaller le composant en cause"],
        a: 0,
        why: "Redémarrer efface précisément ce qui permettait de comprendre — sessions, compteurs, cache — et allonge souvent l'interruption. Le symptôme disparaît parfois ; la cause revient.",
        ref: "SQL Server ch. 12 · ch. 13"
    },
    {
        q: "Quel réflexe de dimensionnement revient du subnetting au stockage en passant par SQL Server ?",
        c: ["Évaluer le besoin réel avant de choisir, plutôt que d'accepter la valeur par défaut", "Prévoir systématiquement le double de la capacité estimée", "Commencer petit et agrandir au fil de l'eau", "Aligner tous les dimensionnements sur le composant le plus gros"],
        a: 0,
        why: "Un /24 posé partout, une base créée sur les tailles de <code>model</code>, un fichier de journal « Limited to 2 097 152 Mo » : ce sont des absences de choix. Une valeur par défaut se remarque le jour où la charge arrive.",
        ref: "Subnetting ch. 06 · SQL Server ch. 07 · Stockage ch. 02"
    }]
}

};
