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
    }]
},

"linux-debian": {
    name: "Linux Debian",
    file: "linux-debian.html",
    title: "Test — Linux Debian",
    intro: "Le module le plus dense du parcours : dix questions sur le terminal, les permissions, les filtres texte, le réseau et les services.",
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
    }]
},

"subnetting": {
    name: "Réseau & Subnetting",
    file: "subnetting.html",
    title: "Test — Réseau & Subnetting",
    intro: "Huit questions de calcul, à faire de tête. Si tu passes ce test sans papier, le subnetting est acquis.",
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
    }]
},

/* ═══════════════ PARCOURS 02 · INFRASTRUCTURE WINDOWS ═══════════════ */

"windows-server": {
    name: "Windows Server 2025",
    file: "windows-server.html",
    title: "Test — Windows Server 2025",
    intro: "Annuaire, résolution de noms, partage de fichiers et sécurité : les fondations sur lesquelles s'appuient tous les modules du parcours Windows.",
    pass: 70,
    questions: [
    {
        q: "Quelle est la hiérarchie d'Active Directory, du plus large au plus fin ?",
        c: ["Forêt → domaine → unité d'organisation → objets", "Domaine → forêt → groupe → objets", "Forêt → unité d'organisation → domaine → objets", "Domaine → arbre → forêt → objets"],
        a: 0,
        why: "Forêt → domaine → OU → objets. On applique les GPO et on délègue au niveau de l'<strong>OU</strong>, on autorise via les <strong>groupes</strong> : ce sont deux mécanismes différents.",
        ref: "Chapitre 03"
    },
    {
        q: "Vers quel serveur DNS un contrôleur de domaine doit-il pointer ?",
        c: ["Vers lui-même", "Vers le DNS public de l'opérateur", "Vers 8.8.8.8, pour garantir la résolution Internet", "Vers le serveur DHCP du réseau"],
        a: 0,
        why: "Un DC pointe son DNS vers lui-même : c'est le DNS qui publie les enregistrements de service d'AD. Sans DNS fonctionnel, plus aucune ouverture de session de domaine.",
        ref: "Chapitre 04"
    },
    {
        q: "Que désigne l'acronyme DORA en DHCP ?",
        c: ["Discover, Offer, Request, Acknowledge", "Detect, Open, Register, Assign", "Domain, Object, Role, Access", "Deny, Override, Reset, Allow"],
        a: 0,
        why: "Les quatre étapes de l'obtention d'un bail : le client diffuse un <em>Discover</em>, le serveur propose (<em>Offer</em>), le client demande (<em>Request</em>), le serveur confirme (<em>Acknowledge</em>).",
        ref: "Chapitre 04"
    },
    {
        q: "Quelle est la différence entre DFS Namespace et DFS Replication ?",
        c: ["Le Namespace abstrait le chemin d'accès, la Replication synchronise des copies", "Le Namespace réplique les données, la Replication gère les droits", "Le Namespace ne fonctionne qu'en domaine, la Replication qu'en groupe de travail", "Ce sont deux noms du même service"],
        a: 0,
        why: "DFS-N donne un seul nom logique à l'utilisateur quel que soit le serveur derrière. DFS-R maintient des copies synchronisées pour la disponibilité. Les deux se combinent — mais la réplication n'est <strong>pas</strong> une sauvegarde.",
        ref: "Chapitre 05"
    },
    {
        q: "Quelle cmdlet crée le tout premier contrôleur d'une nouvelle forêt ?",
        c: ["<code>Install-ADDSForest</code>", "<code>Install-ADDSDomainController</code>", "<code>New-ADForest</code>", "<code>Enable-ADDomain</code>"],
        a: 0,
        why: "<code>Install-ADDSForest</code> crée le socle complet (forêt, domaine, premier DC). Pour ajouter un second contrôleur à un domaine existant, c'est <code>Install-ADDSDomainController</code>.",
        ref: "Chapitre 03"
    },
    {
        q: "Que fait exactement <code>sysprep /generalize /oobe</code> dans une chaîne de déploiement par image ?",
        c: ["Il neutralise l'installation pour qu'elle serve de disque parent figé", "Il compresse l'image pour accélérer le déploiement", "Il joint automatiquement la machine au domaine", "Il installe les rôles sélectionnés au premier démarrage"],
        a: 0,
        why: "Image de référence → <code>sysprep /generalize /oobe</code> → disque parent figé → disques différentiels. On déploie en secondes, sans dupliquer le SID et sans recopier un disque entier par machine.",
        ref: "Chapitre 02"
    },
    {
        q: "Sur quoi repose réellement la sécurité d'un serveur ?",
        c: ["Moindre privilège, surface réduite, journalisation et sauvegarde testée, en continu", "L'installation d'un antivirus à jour", "Le chiffrement intégral des disques", "L'application des mises à jour une fois par an"],
        a: 0,
        why: "Ce n'est pas une case à cocher. Et une sauvegarde jamais restaurée n'est pas une sauvegarde : c'est une hypothèse.",
        ref: "Chapitre 06"
    },
    {
        q: "Pourquoi déployer un <strong>second</strong> contrôleur de domaine dans un labo de référence ?",
        c: ["Pour la tolérance de panne de l'authentification", "Pour doubler la capacité de stockage des profils", "Pour séparer les utilisateurs des ordinateurs", "Pour permettre l'installation d'Exchange"],
        a: 0,
        why: "Si le seul DC tombe, plus personne n'ouvre de session. Le second DC n'est pas un luxe : c'est la disponibilité de l'authentification, au même titre que le plan d'adressage écrit et le nommage cohérent (SRV-AD, SRV-FILE).",
        ref: "Chapitre 07"
    }]
},

"powershell": {
    name: "PowerShell & Automatisation",
    file: "powershell.html",
    title: "Test — PowerShell & Automatisation",
    intro: "Six chapitres pour scripter ce que les autres font à la souris : VM, réseau, promotion de domaine et comptes de service.",
    pass: 70,
    questions: [
    {
        q: "Comment saisir un mot de passe dans un script sans jamais l'écrire en clair ?",
        c: ["<code>Read-Host -AsSecureString</code>", "<code>Read-Host -Hidden</code>", "<code>Get-Credential -Plain</code>", "En le stockant dans une variable au début du script"],
        a: 0,
        why: "<code>Read-Host -AsSecureString</code> masque la saisie et renvoie un objet sécurisé. Un mot de passe en clair dans un <code>.ps1</code> se retrouve dans l'historique, les sauvegardes et le dépôt de code.",
        ref: "Chapitre 04"
    },
    {
        q: "Qu'apporte un compte de service géré de groupe (gMSA) ?",
        c: ["Active Directory génère et renouvelle son mot de passe automatiquement", "Il permet de se connecter en interactif sur tous les serveurs", "Il supprime le besoin de droits NTFS sur les dossiers", "Il chiffre les communications du service"],
        a: 0,
        why: "Le gMSA règle le cauchemar des mots de passe de comptes de service : AD les gère et les renouvelle seul. Plus de mot de passe connu, donc plus de mot de passe à changer à la main tous les ans.",
        ref: "Chapitre 05"
    },
    {
        q: "À propos de <code>Add-KdsRootKey</code>, qu'est-ce qui est vrai ?",
        c: ["Elle ne s'exécute qu'une fois par forêt", "Elle doit être relancée sur chaque serveur utilisant un gMSA", "Elle crée le compte gMSA lui-même", "Elle remplace <code>Install-ADDSForest</code>"],
        a: 0,
        why: "Une seule fois par forêt. Le décalage <code>-10h</code> (<code>-EffectiveTime</code> dans le passé) évite d'attendre les 10 heures de propagation avant de pouvoir créer le premier gMSA.",
        ref: "Chapitre 05"
    },
    {
        q: "Dans le labo, comment sont créées les VM serveurs pour aller vite ?",
        c: ["Un VHDX différentiel sur le disque parent SYSPREP, en <code>New-VM -Generation 2</code>", "Une installation complète depuis l'ISO pour chaque machine", "Un export/import de la première VM", "Une copie manuelle du disque dur virtuel"],
        a: 0,
        why: "Switch privé → VHDX différentiel sur le parent SYSPREP → <code>New-VM -Generation 2</code> → mémoire statique. Le client Windows 11, lui, part d'un disque neuf avec TPM et Secure Boot.",
        ref: "Chapitre 02"
    },
    {
        q: "Comment créer une centaine d'utilisateurs AD sans répéter la commande ?",
        c: ["Boucler sur un <code>Import-Csv</code> décrivant les utilisateurs", "Copier-coller la commande cent fois dans le script", "Utiliser <code>New-ADUser -Bulk</code>", "Passer par l'interface graphique, plus rapide en masse"],
        a: 0,
        why: "Un CSV décrit les utilisateurs, une boucle <code>foreach</code> appelle <code>New-ADUser</code> pour chaque ligne. Le fichier devient la source de vérité, rejouable et relisible.",
        ref: "Chapitre 04"
    },
    {
        q: "Quelle convention de nommage suivent les cmdlets PowerShell ?",
        c: ["Verbe-Nom, au singulier (<code>Get-Service</code>, <code>New-VM</code>)", "Nom-Verbe, au pluriel (<code>Services-Get</code>)", "Un acronyme de trois lettres suivi d'un chiffre", "Le nom de l'outil graphique équivalent"],
        a: 0,
        why: "Verbe-Nom singulier : <code>Get-</code>, <code>New-</code>, <code>Set-</code>, <code>Remove-</code>… C'est ce qui rend les commandes devinables, et <code>Get-Command -Verb Get</code> exploitable.",
        ref: "Chapitre 01"
    },
    {
        q: "Qu'est-ce qui circule dans un pipeline PowerShell ?",
        c: ["Des objets, avec leurs propriétés", "Du texte brut, comme sous Unix", "Des tableaux de chaînes uniquement", "Des références de fichiers"],
        a: 0,
        why: "C'est la différence de fond avec un shell Unix : le pipeline transporte des <strong>objets</strong>. D'où <code>Get-Service | Where-Object Status -eq 'Running' | Select-Object Name</code> sans le moindre découpage de texte.",
        ref: "Chapitre 01"
    },
    {
        q: "Comment vérifier qu'un gMSA est bien utilisable depuis un serveur ?",
        c: ["<code>Test-ADServiceAccount</code> doit renvoyer <code>True</code>", "<code>Get-ADUser</code> doit afficher le compte", "Il faut ouvrir une session interactive avec ce compte", "Le compte doit apparaître dans <code>services.msc</code>"],
        a: 0,
        why: "<code>Test-ADServiceAccount</code> vérifie que la machine est autorisée à récupérer le mot de passe géré. Un gMSA ne sert jamais à ouvrir une session interactive.",
        ref: "Chapitre 05"
    }]
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
    intro: "Cinq chapitres, six questions : les rôles, la collection, la RemoteApp et le certificat qui fait taire l'alerte du navigateur.",
    pass: 70,
    questions: [
    {
        q: "Quel rôle RDS <strong>exécute</strong> réellement les sessions des utilisateurs ?",
        c: ["RDSH — Remote Desktop Session Host", "RDCB — Connection Broker", "RDWA — Web Access", "RD Gateway"],
        a: 0,
        why: "Le trio de base : le <strong>RDSH exécute</strong>, le <strong>RDCB répartit</strong> les connexions, le <strong>RDWA publie</strong> le portail. La Gateway ajoute l'accès sécurisé depuis l'extérieur.",
        ref: "Chapitre 01"
    },
    {
        q: "Dans un déploiement session-based, qu'est-ce qu'une collection ?",
        c: ["L'unité de publication et de contrôle d'accès", "Un groupe de serveurs de licences", "L'ensemble des profils utilisateurs itinérants", "Le pool d'adresses IP réservées aux sessions"],
        a: 0,
        why: "La collection regroupe des Session Hosts et définit ce qui est publié (bureau complet ou RemoteApp) et à qui. C'est là que se pose le contrôle d'accès.",
        ref: "Chapitre 04"
    },
    {
        q: "Où s'exécute une application publiée en RemoteApp ?",
        c: ["Sur le serveur RDSH, même si la fenêtre paraît locale", "Sur le poste client, téléchargée à la connexion", "Sur le Connection Broker", "Sur le Web Access, en HTML5"],
        a: 0,
        why: "La RemoteApp donne l'illusion d'une application locale alors qu'elle tourne sur le RDSH. Idéal pour distribuer une seule appli métier sans publier tout un bureau.",
        ref: "Chapitre 04"
    },
    {
        q: "Pourquoi un certificat auto-signé sur le Web Access déclenche-t-il une alerte ?",
        c: ["La chaîne de confiance ne remonte à aucune autorité connue du client", "Il utilise un algorithme de chiffrement obsolète", "Il expire au bout de 24 heures", "Il ne couvre pas le port 443"],
        a: 0,
        why: "Le client ne peut pas remonter jusqu'à une racine qu'il connaît. En production, on déploie un certificat signé par la CA d'entreprise, distribué par GPO — la même logique de PKI que pour Exchange.",
        ref: "Chapitre 05"
    },
    {
        q: "Dans la topologie du labo, pourquoi deux Session Hosts et un seul Broker ?",
        c: ["Le travail des utilisateurs s'exécute sur les RDSH : c'est là que la panne se voit", "Le Broker ne supporte pas la redondance", "Les licences RDS sont comptées par Broker", "Le Broker doit rester sur le contrôleur de domaine"],
        a: 0,
        why: "On double là où le travail s'exécute. Le Broker reste unique dans le labo — mais comme il est le point de passage de toutes les connexions, c'est la machine à surveiller en premier.",
        ref: "Chapitre 02"
    },
    {
        q: "Que signifie « session-based » par opposition au VDI ?",
        c: ["Plusieurs utilisateurs se partagent le même serveur et son OS", "Chaque utilisateur reçoit sa propre machine virtuelle", "Les sessions sont limitées à une heure", "Les applications tournent dans le navigateur uniquement"],
        a: 0,
        why: "En session-based, plusieurs sessions cohabitent sur un même Windows Server — c'est le modèle le plus courant, et le plus économe. Le VDI donne une VM complète par utilisateur.",
        ref: "Chapitre 01"
    }]
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

/* ═════════════ PARCOURS 03 · RÉSEAU & TÉLÉPHONIE ═════════════ */

"ccna-reseau": {
    name: "CCNA — Réseau Cisco",
    file: "ccna-reseau.html",
    title: "Test — CCNA, réseau Cisco",
    intro: "Neuf chapitres de configuration : OSI, VLAN, routage, NAT et ACL. Les questions collent au format de l'examen pratique.",
    pass: 70,
    questions: [
    {
        q: "Dans quel ordre se lisent les couches OSI, de la 1 à la 7 ?",
        c: ["Physique · Liaison · Réseau · Transport · Session · Présentation · Application", "Application · Présentation · Session · Transport · Réseau · Liaison · Physique", "Physique · Réseau · Liaison · Transport · Session · Application · Présentation", "Liaison · Physique · Transport · Réseau · Session · Présentation · Application"],
        a: 0,
        why: "Le moyen mnémotechnique du module : <em>Pour Le Réseau Tout Se Passe Automatiquement</em>. C'est la grille de lecture de tout problème réseau — on diagnostique du bas vers le haut.",
        ref: "Chapitre 01"
    },
    {
        q: "Quelle est la différence entre un port access et un port trunk ?",
        c: ["Access = un seul VLAN pour un terminal ; trunk = tous les VLAN, marqués en dot1q", "Access = plus rapide ; trunk = plus lent mais redondant", "Access = vers un routeur ; trunk = vers un PC", "Access = non chiffré ; trunk = chiffré"],
        a: 0,
        why: "Sans trunk, deux PC du même VLAN branchés sur deux switches différents ne se parleraient pas : le marquage 802.1Q permet de transporter plusieurs VLAN sur un seul lien.",
        ref: "Chapitre 03"
    },
    {
        q: "En router-on-a-stick, qu'est-ce qui sert de passerelle à un VLAN ?",
        c: ["L'adresse IP de sa sous-interface sur le routeur", "L'adresse IP du switch", "La première adresse du VLAN, quelle que soit la machine", "Le serveur DHCP du VLAN"],
        a: 0,
        why: "Une sous-interface par VLAN (<code>interface g0/0/0.10</code> + <code>encapsulation dot1q 10</code>), chacune portant la passerelle. Sur un switch L3, ce rôle revient aux interfaces VLAN (SVI).",
        ref: "Chapitre 04"
    },
    {
        q: "À quoi sert <code>ip dhcp excluded-address 172.16.0.1 172.16.0.20</code> ?",
        c: ["À empêcher le serveur DHCP de distribuer cette plage", "À réserver ces adresses à des baux permanents", "À interdire ces adresses sur le réseau", "À créer un second pool DHCP"],
        a: 0,
        why: "On exclut ce qui est adressé en fixe : passerelle, serveurs, imprimantes. Sans cela, le DHCP distribuerait des adresses déjà utilisées — et le conflit se voit tout de suite.",
        ref: "Chapitre 05"
    },
    {
        q: "Que faut-il retenir de l'évaluation d'une ACL Cisco ?",
        c: ["Les règles sont lues dans l'ordre, avec un deny implicite en fin de liste", "Les règles les plus spécifiques sont évaluées en premier, quel que soit l'ordre", "Une ACL sans règle autorise tout", "Le deny implicite ne s'applique qu'aux ACL étendues"],
        a: 0,
        why: "L'ordre des règles fait tout : la première qui correspond décide. Et ce qui n'est pas explicitement autorisé est refusé par le <em>deny</em> implicite final.",
        ref: "Chapitre 08"
    },
    {
        q: "Qu'est-ce que le PAT (NAT overload) ?",
        c: ["Toutes les adresses privées sortent derrière une seule adresse publique, distinguées par le port", "Une adresse privée est traduite en une adresse publique fixe", "Un pool d'adresses publiques partagé à la demande", "Une traduction d'adresses limitée au trafic UDP"],
        a: 0,
        why: "C'est le NAT « de la box ». NAT statique = une privée ↔ une publique fixe ; NAT dynamique = un pool partagé ; PAT = tout le monde derrière une seule, le port faisant la distinction.",
        ref: "Chapitre 08"
    },
    {
        q: "Quand passe-t-on du routage statique au routage dynamique ?",
        c: ["Dès que le réseau grandit : les routeurs s'échangent les routes et s'adaptent aux pannes", "Dès qu'on utilise des VLAN", "Uniquement si l'on possède plusieurs opérateurs", "Jamais : le statique est toujours préférable pour la maîtrise"],
        a: 0,
        why: "Statique = maîtrise totale mais maintenance manuelle : parfait pour un petit réseau et la route par défaut. Dynamique (OSPF, EIGRP) : indispensable dès que le réseau grandit. HSRP ajoute une passerelle virtuelle redondante.",
        ref: "Chapitre 07"
    },
    {
        q: "Dans quel ordre monte-t-on un projet réseau complet ?",
        c: ["Adressage → sécurité → VLAN → routage → services → bordure (NAT/ACL)", "VLAN → adressage → bordure → routage → services → sécurité", "Services → VLAN → adressage → sécurité → routage → bordure", "Bordure → routage → VLAN → adressage → services → sécurité"],
        a: 0,
        why: "C'est la séquence de l'exercice final, et celle de l'examen pratique CCNA. On ne configure jamais un VLAN avant d'avoir écrit son plan d'adressage.",
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
        why: "Sans autorisation, c'est illégal — en France, articles 323-1 et suivants du Code pénal. Pas d'autorisation = pas de test : on s'entraîne sur ses propres machines ou sur des plateformes prévues pour.",
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
        why: "Injection, XSS, authentification cassée, mauvaise configuration, composants obsolètes : la défense tient en peu de mots — valider les entrées, mettre à jour, MFA, moindre privilège.",
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
}

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
    intro: "Le socle : un labo virtuel, un terminal Linux et un plan d'adressage. Vingt questions tirées au sort dans les trois modules, plus des questions de synthèse qui les font se rencontrer.",
    parts: ["hyperv", "linux-debian", "subnetting"],
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
    intro: "Le plus large des examens : annuaire, automatisation, stockage, sessions, messagerie, base de données et intranet. Vingt-huit questions puisées dans sept modules.",
    parts: ["windows-server", "powershell", "storage-clustering", "rds", "exchange-securite", "sql-server", "sharepoint"],
    draw: 28,
    pass: 70,
    questions: [
    {
        q: "Le gMSA revient dans plusieurs modules du parcours. Quel problème résout-il, et où l'utilise-t-on ?",
        c: ["Il supprime les mots de passe de comptes de service à gérer : AD les renouvelle, pour SQL Server comme pour les services applicatifs", "Il permet une ouverture de session interactive partagée entre administrateurs", "Il remplace les certificats pour l'authentification des services", "Il n'existe que pour SQL Server"],
        a: 0,
        why: "AD génère et renouvelle le mot de passe seul. On le déclare dans l'assistant d'installation de SQL Server pour qu'il pose les bonnes ACL, et on le vérifie avec <code>Test-ADServiceAccount</code>.",
        ref: "PowerShell ch. 05 · SQL Server ch. 03"
    },
    {
        q: "RDS Web Access et Exchange affichent tous deux une alerte de certificat. Quelle correction traite les deux cas ?",
        c: ["Faire signer les certificats par la CA d'entreprise, dont la racine est publiée dans AD", "Régénérer des certificats auto-signés avec une durée plus longue", "Ajouter une exception dans le navigateur de chaque poste", "Désactiver la vérification de révocation"],
        a: 0,
        why: "Même logique de PKI dans les deux modules : l'auto-signé dit « c'est moi qui le dis ». Une Enterprise Root CA publie sa racine dans AD, donc tous les postes du domaine valident la chaîne sans manipulation.",
        ref: "Exchange ch. 05 · RDS ch. 05"
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
        ref: "Stockage ch. 11 · SQL Server ch. 14 · Windows Server ch. 05"
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
        ref: "SQL Server ch. 10 · Windows Server ch. 03 · ch. 06"
    }]
},

"reseau": {
    short: "Examen 03 · Réseau & téléphonie",
    title: "Examen — Parcours 03 · Réseau & téléphonie",
    label: "Examen de parcours",
    intro: "Du plan d'adressage à la voix qui passe : subnetting, configuration Cisco et téléphonie IP. Vingt questions, dont plusieurs cas de dépannage.",
    parts: ["subnetting", "ccna-reseau", "voip"],
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
        ref: "VoIP ch. 05 · CCNA ch. 08"
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
        ref: "CCNA ch. 09 · VoIP ch. 09"
    }]
},

"virtualisation": {
    short: "Examen 04 · Virtualisation & homelab",
    title: "Examen — Parcours 04 · Virtualisation, homelab & sécurité",
    label: "Examen de parcours",
    intro: "Son propre hyperviseur, ses propres services, et de quoi les défendre. Vingt questions sur Proxmox, le self-hosting et la sécurité.",
    parts: ["proxmox", "homelab", "securite"],
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

"final": {
    short: "Examen final",
    title: "Examen final — les quinze modules",
    label: "Examen de synthèse",
    intro: "Quarante questions tirées dans l'ensemble du centre d'apprentissage, plus les principes qui traversent tous les parcours. C'est le test à repasser une fois les quatre examens de parcours validés.",
    parts: ["hyperv", "linux-debian", "subnetting", "windows-server", "powershell", "storage-clustering", "rds", "exchange-securite", "sql-server", "sharepoint", "ccna-reseau", "voip", "proxmox", "homelab", "securite"],
    draw: 40,
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
        ref: "Linux ch. 15 · Windows Server ch. 04"
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
        ref: "Exchange ch. 04 · RDS ch. 05 · Homelab ch. 03"
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
