/* Atelier hardware — partie E : missions de la convention de stage (lot 46).
   Faits repris de la prépa (jour 9, relu au lot 17) et des modules « Déploiement et gestion des postes » (lot 37)
   et « Matériel et PC » (lot 21), avec leurs sources primaires. Ce qui dépend de l'UMONS est « à vérifier sur place ».
   Pédagogie : je montre (procédure), on fait ensemble (liste à cocher), tu fais seul (exercice, correction cachée). */
(function () {
  "use strict";
  var A = window.IT_ATELIER;
  if (!A) return;
  var J9 = ["Prépa, jour 9 : salles, colis et inventaire", "../stage/j9.html#salles"];
  var DEP = ["Module « Déploiement et gestion des postes »", "../modules/deploiement-postes.html"];
  var MAT = ["Module « Matériel et PC »", "../modules/materiel-pc.html"];
  var S = {
    autopilot: ["Microsoft Learn : Overview of Windows Autopilot", "https://learn.microsoft.com/en-us/autopilot/overview"],
    scenarios: ["Microsoft Learn : Windows deployment scenarios", "https://learn.microsoft.com/en-us/windows/deployment/windows-deployment-scenarios"],
    cim: ["Microsoft Learn : classe Win32_BIOS (SerialNumber)", "https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-bios"],
    cs: ["Microsoft Learn : classe Win32_ComputerSystem (Manufacturer, Model)", "https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-computersystem"],
    inventaire: ["Microsoft Learn : exemple PowerShell pour relever fabricant, modèle et numéro de série", "https://learn.microsoft.com/en-us/intune/device-enrollment/add-corporate-identifiers"],
    dsreg: ["Microsoft Learn : dsregcmd /status", "https://learn.microsoft.com/en-us/entra/identity/devices/troubleshoot-device-dsregcmd"],
    ups: ["UPS Belgique : déclarer un dommage (exemple de transporteur)", "https://www.ups.com/be/en/support/file-a-claim"],
    upsPhotos: ["UPS Belgique : justificatifs et photos d'un colis endommagé", "https://www.ups.com/be/en/support/file-a-claim/supporting-documents"],
    chaud: ["Dell : surchauffe et nettoyage des aérations", "https://www.dell.com/support/kbdoc/en-ed/000130867/how-to-troubleshoot-a-overheating-shutdown-or-thermal-issue-on-a-dell-pc"],
    statutDisque: ["Microsoft Learn : Get-PhysicalDisk", "https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk"],
    usureDisque: ["Microsoft Learn : définition du compteur Wear", "https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/msft-storagereliabilitycounter"],
    disque: ["Microsoft Learn : Get-StorageReliabilityCounter", "https://learn.microsoft.com/en-us/powershell/module/storage/get-storagereliabilitycounter"],
    batterie: ["Microsoft Learn : options de powercfg (/batteryreport)", "https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options"],
    dellBat: ["Dell : rapport de batterie (Design Capacity, Full Charge Capacity)", "https://www.dell.com/support/kbdoc/en-us/000130117"],
    dellNet: ["Dell : nettoyer son ordinateur", "https://www.dell.com/support/kbdoc/en-us/000124077"],
    secu: ["Dell : sécurité électrique et protection ESD (article 000137973)", "https://www.dell.com/support/kbdoc/en-us/000137973/safety-precautions-when-working-with-electrical-equipment"]
  };

  A.missions = {
    colis: {
      id: "colis", titre: "Réceptionner et contrôler un colis", illus: "colis",
      role: "Un transporteur livre des PC : on contrôle le colis et son contenu selon la procédure de réception, puis on enregistre les appareils.",
      procedure: [
        ["Regarder l'extérieur", "Si le carton est abîmé ou humide, signaler le dommage selon les consignes de réception et noter le numéro de suivi. Signature, réserves et photos à la livraison : à vérifier sur place."],
        ["Comparer au bon de livraison", "Quantité, références et modèles, ligne par ligne, avec la commande."],
        ["Vérifier le contenu", "Appareil, alimentation ou chargeur, câbles, accessoires."],
        ["Relever les numéros de série", "Et les associer au bon de livraison."],
        ["Étiqueter et enregistrer", "Numéro d'inventaire sur l'appareil, enregistrement dans l'outil d'inventaire."],
        ["Ranger et signaler", "En lieu sûr ; tout écart (manquant, abîmé) est signalé à qui de droit."]
      ],
      cases: ["Extérieur du carton contrôlé (photo si dommage)", "Bon de livraison comparé à la commande", "Contenu complet", "Numéros de série relevés", "Étiquette d'inventaire posée", "Inventaire à jour, écarts signalés"],
      exercice: {
        consigne: "Le bon de livraison annonce 10 PC de bureau du même modèle, 10 alimentations externes et 10 claviers. Tu comptes 10 cartons de PC, dont un est enfoncé sur un coin, 10 alimentations et 9 claviers. Le transporteur attend ta signature. Que fais-tu, dans l'ordre ?",
        correction: ["Signaler au responsable la trace sur le carton et l'écart de quantité. Signature et réserves sur le bon : à vérifier sur place selon la procédure de réception.", "Ouvrir et vérifier le carton abîmé (appareil intact ? accessoires ?), relever tous les numéros de série et les associer au bon.", "Étiqueter et enregistrer les 10 PC ; les alimentations sont au complet ; signaler l'écart (1 clavier manquant, 1 carton abîmé) au responsable des commandes.", "Pour un dommage traité par UPS Belgique : conserver le contenu et l'emballage et préparer les photos demandées, dont celle de l'étiquette avec le numéro de suivi. Délais, modalités et personne chargée de la réclamation : à vérifier sur place."]
      },
      umons: ["Qui signe les livraisons et où sont rangés les colis", "L'outil d'inventaire et le format des étiquettes", "À qui signaler un écart et sous quel délai"],
      sources: [J9, S.ups, S.upsPhotos, DEP],
      liens: [["E-02", "missions.html?m=integration", "Intégrer un PC neuf"]]
    },
    integration: {
      id: "integration", titre: "Intégrer un PC neuf", illus: "integration",
      role: "Du carton au bureau de l'utilisateur : inventaire, préparation de Windows, nom, jonction, logiciels, mises à jour, puis remise et test.",
      procedure: [
        ["Inventaire", "Numéro d'inventaire, numéro de série, fabricant et modèle, lieu, utilisateur, état. Le numéro de série et le modèle se lisent sans ouvrir le boîtier : Get-CimInstance Win32_BIOS et Win32_ComputerSystem."],
        ["Préparer Windows", "Selon la méthode de l'organisation : moderne (Windows Autopilot transforme la version du constructeur en poste d'entreprise, sans réimager) ou traditionnelle (application d'une image de référence)."],
        ["Nommer et joindre", "Nom selon la nomenclature de l'organisation ; jonction au domaine, à Microsoft Entra ID ou aux deux ; dsregcmd /status dit lequel (AzureAdJoined, DomainJoined)."],
        ["Logiciels, mises à jour, sécurité", "Applications attendues, mises à jour, chiffrement selon la procédure."],
        ["Remettre et tester", "Test des usages de l'utilisateur avec lui, mise à jour de l'inventaire (état « en service », lieu, utilisateur)."]
      ],
      cases: ["Fiche d'inventaire complète (série et modèle relevés)", "Windows préparé selon la méthode de l'organisation", "Nom conforme et jonction vérifiée (dsregcmd /status)", "Logiciels et mises à jour faits", "Test avec l'utilisateur, inventaire « en service »"],
      exercice: {
        consigne: "Après la préparation d'un poste, dsregcmd /status affiche dans Device State : AzureAdJoined : YES, EnterpriseJoined : NO, DomainJoined : YES. Quel est l'état de jonction du poste ? Quelle commande donne son numéro de série pour l'inventaire ?",
        correction: ["YES / NO / YES = joint hybride (domaine Active Directory et Microsoft Entra). Pour valider la remise, faire aussi les tests prévus par l'établissement (à vérifier sur place).", "Numéro de série : Get-CimInstance Win32_BIOS | Select-Object SerialNumber ; modèle : Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer, Model.", "On reporte les deux dans la fiche d'inventaire avant la remise."]
      },
      umons: ["Méthode de déploiement (image, Autopilot, installation automatisée)", "Nomenclature des noms de machines", "Logiciels de base et procédure de chiffrement", "Formulaire de remise à l'utilisateur"],
      sources: [DEP, S.autopilot, S.scenarios, S.cim, S.cs, S.dsreg, S.inventaire],
      liens: [["E-01", "missions.html?m=colis", "Réceptionner un colis"], ["E-03", "missions.html?m=salle", "Préparer une salle"]]
    },
    salle: {
      id: "salle", titre: "Préparer une salle informatique", illus: "salle",
      role: "Dans cet exercice, une salle de cours a besoin des mêmes logiciels et réglages sur chaque poste. On valide un poste pilote et on applique la méthode de déploiement de l'organisation.",
      procedure: [
        ["Besoin", "Nombre de postes, logiciels des cours, contraintes de la salle."],
        ["Commande et réception", "Voir la mission E-01 pour chaque livraison."],
        ["Poste modèle", "Un poste complet préparé et testé avec les logiciels des cours."],
        ["Déploiement en série", "Le même résultat sur tous les postes, selon la méthode de l'organisation."],
        ["Test et mise en service", "Chaque poste testé (démarrage, session, logiciels, réseau, impression si prévue), puis suivi des premiers jours."]
      ],
      cases: ["Besoin écrit (postes, logiciels)", "Poste modèle testé de bout en bout", "Déploiement en série fait", "Chaque poste testé", "Inventaire à jour (salle comme lieu)"],
      exercice: {
        consigne: "Le jour de la rentrée, un logiciel de cours manque sur les 24 postes d'une salle, déployés la veille à partir du poste modèle. Qu'est-ce que l'étape « poste modèle » aurait dû empêcher, et que fais-tu maintenant ?",
        correction: ["Le poste modèle devait être testé de bout en bout avec les logiciels des cours, avant de multiplier : le manque se voyait sur un seul poste.", "Maintenant : ticket, prévenir l'enseignant, corriger le modèle ou le paquet du logiciel, redéployer ou installer selon la méthode de l'organisation, puis tester un poste avant les autres.", "Noter dans le ticket la cause (étape de test sautée) pour la prochaine salle."]
      },
      umons: ["Salles et calendrier des projets", "Outil de déploiement en série", "Logiciels de cours et qui les valide"],
      sources: [J9, DEP, S.scenarios],
      liens: [["E-02", "missions.html?m=integration", "Intégrer un PC neuf"]]
    },
    maintenance: {
      id: "maintenance", titre: "Maintenance préventive", illus: "maintenance",
      role: "Repérer avant la panne : état des disques, poussière, batterie, mises à jour et inventaire, sur le planning de l'organisation.",
      procedure: [
        ["Disques", "État de santé avec Get-PhysicalDisk ; compteurs de fiabilité (température, erreurs, usure) avec Get-StorageReliabilityCounter."],
        ["Poussière et aérations", "Poussière sur les ailettes et les aérations = surchauffe : nettoyage machine éteinte et débranchée, en suivant la page du constructeur."],
        ["Batterie des portables", "powercfg /batteryreport : comparer la capacité d'origine (Design capacity) et la capacité actuelle (Full charge capacity)."],
        ["Mises à jour", "Système et logiciels selon la politique de l'organisation."],
        ["Inventaire", "Lieu, utilisateur et état à jour ; un poste déplacé sans mise à jour devient introuvable."]
      ],
      cases: ["Santé des disques relevée", "Aérations contrôlées (nettoyage hors tension si besoin)", "Rapport de batterie lu (portables)", "Mises à jour faites", "Inventaire vérifié"],
      exercice: {
        consigne: "Sur un portable, powercfg /batteryreport donne Design capacity 50 000 mWh et Full charge capacity 30 000 mWh. Get-StorageReliabilityCounter affiche Wear à 5. Que notes-tu dans le ticket de maintenance ?",
        correction: ["Batterie : 30 000 / 50 000 = 60 % de la capacité d'origine ; on note la valeur et on suit son évolution. Dell recommande le remplacement sous 40 % de la capacité d'origine ; avant, selon la procédure et la garantie.", "SSD : consigner le compteur Wear à 5 % d'usure estimée. Consulter les autres compteurs et l'état de santé pour compléter le contrôle.", "On note les deux valeurs et la date : la comparaison avec la prochaine maintenance montre l'évolution."]
      },
      umons: ["Planning de maintenance et parc concerné", "Qui nettoie et avec quel matériel", "Procédure de remplacement des batteries"],
      attention: "Nettoyage ou ouverture : machine éteinte, câble secteur débranché, bouton marche maintenu 15 à 20 s, décharge électrostatique avant de toucher (support Dell, article 000137973).",
      sources: [MAT, S.statutDisque, S.disque, S.usureDisque, S.batterie, S.dellBat, S.chaud, S.dellNet, S.secu],
      liens: [["D", "pannes.html", "Diagnostic des pannes"], ["C-02", "montage.html?s=remplacer-ssd", "Remplacer un SSD"]]
    }
  };
})();
