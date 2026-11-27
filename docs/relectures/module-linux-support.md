# Relecture des sources — modules/linux-support.html

- Page relue : `modules/linux-support.html` et son quiz `module-linux-support`
- Date : 27/11/2026
- Outil : Claude Code, agent relecteur séparé (n'a pas écrit la page)
- Pages de manuel Debian trixie (openssh-client, systemd, coreutils, iproute2, iputils-ping, sudo), POSIX (The Open Group), Microsoft Learn.

| Affirmation (section) | Verdict | Source ouverte | Correction |
|---|---|---|---|
| « Windows 10 et 11 disposent d'un client OpenSSH » (1) | **faux** (imprécis) | https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh-overview | Fonctionnalité à la demande depuis Windows 10 version 1809, pas toujours installée ; source ajoutée. |
| Chiffrement, `ssh -V`, `Get-WindowsCapability`, première connexion et empreinte, comparer l'empreinte (1) | correct | Microsoft Learn (OpenSSH first use) ; ssh(1) | Encadré : ssh(1) cité aussi pour la vérification de l'empreinte. |
| `pwd`, `ls -l`, `ls -a`, `cd`, `cat`, `less` (2) | correct | pages de manuel Debian ; POSIX ls | — |
| Debian utilise systemd ; unité `ssh.service` (3, 4, Q2) | correct (non sourcé) | wiki.debian.org/systemd ; liste des fichiers d'openssh-server | Sources ajoutées. |
| Options de `journalctl` (`-u`, `-b`, `-p`, `-n`, `-e`, `-f`) ; accès au journal du système (3) | correct | journalctl(1) | — |
| `systemctl status` ; Loaded, Active ; start, stop, restart (4) | correct | systemctl(1) | — |
| `df -h`, `ip a`, `ping -c`, ping Windows (4 par défaut) (5) | correct | df(1), ip(8), ping(8), Microsoft Learn ping | — |
| « dix caractères » au début de `ls -l` (6) | **faux** (incomplet) | POSIX ls | Onzième caractère facultatif (méthode d'accès supplémentaire, par exemple `+`) mentionné. |
| Type de fichier, trois classes de droits, `-rw-r-----`, `sudo` (6, Q4, Q6) | correct | POSIX ls ; chmod(1) ; sudo(8) | — |
| WSL 2 dans une machine virtuelle légère (labo) | correct | Microsoft Learn, What is WSL? | — |
| Sortie d'exemple : ligne `total` absente | **faux** (plausibilité) | POSIX ls | `total 24` ajouté. |
| Sortie d'exemple : « ● » pour un service en échec | **faux** (plausibilité) | systemctl(1) | « × » ; ligne Loaded au format de la documentation. |
| Correction : « OpenSSH_for_Windows_… » | non vérifié | — | Retiré (« affiche le numéro de version d'OpenSSH »). |
| Correction : « il ne reste que 4,0 Go » | **faux** (unité) | df(1) | Sans objet après la correction du test en situation (disque à 100 %, 0 disponible). |
| Quiz Q1 : comparaison de l'empreinte attribuée à Microsoft Learn | **faux** (source) | ssh(1), VERIFYING HOST KEYS | Explication corrigée. |
| Mises en situation, quiz Q2, Q3, Q5 | correct | pages ci-dessus | — |

## Bilan de la relecture
- Faux : 6 · Non vérifié : 1 · Correct : 44.

## Test en situation (test-chef.md), 27/11/2026
Usage : un expert demande de se connecter à un serveur Linux et de dire pourquoi un service ne marche plus, avec un PC Windows sans machine virtuelle. Huit critères réussis, mais deux points bloquaient l'usage :
1. Les commandes Linux portaient l'étiquette « Invite de commandes ou PowerShell » et rien ne disait qu'elles se tapent sur le serveur.
2. Le labo ne montrait pas la ligne de journal qui explique la panne.

## Corrections (27/11/2026, Claude Code)
- Relecture : toutes les lignes « faux » et « non vérifié » corrigées comme indiqué.
- Test : blocs étiquetés « PowerShell · sur ton PC » ou « Linux · sur le serveur (SSH) », phrase de transition au §2 ; sortie d'exemple complétée par trois lignes de `journalctl` (« No space left on device ») et `df -h` à 100 % ; question et correction désignent la ligne qui explique l'échec et le lien avec le disque plein.
