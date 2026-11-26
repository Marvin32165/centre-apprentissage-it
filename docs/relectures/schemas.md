# Relecture des sources — les 12 schémas SVG (lot 30)

Pages : `stage/j1`, `j5` (2), `j6`, `j8` ; `modules/support-windows`, `reseau-base`, `sous-reseaux`, `ad-support`, `itil`, `m365-messagerie`, `materiel-pc`. Relecture du 26/11/2026 par un agent relecteur de Claude Code qui n'a pas dessiné les schémas (nouvelle conversation), sources ouvertes. Critères : (1) le schéma ne dit rien de plus que sa section et sa source ; (2) chaque fait est exact d'après la source primaire.

**Bilan : 2 faux, 8 non vérifiés, 22 corrects (32 affirmations).** Points corrects, pour mémoire : états et fermeture du cycle de ticket (Atlassian), quatre messages DHCP et bail (RFC 2131 § 3.1), six étapes et commandes du « plus proche au plus lointain » (Microsoft, RFC 1122), OU et groupes (Microsoft), sept étapes (CompTIA A+ 5.1), maillons 2 à 4 du démarrage (Microsoft), couches TCP/IP (RFC 1122 § 1.1.3), découpage du /24 (Microsoft), AGDLP (Microsoft, étendues des groupes), erreur connue dans la base de connaissances (Atlassian), droits de la boîte partagée (Microsoft), mémoire et M.2 (Dell).

| Affirmation | Verdict | URL | Correction |
|---|---|---|---|
| fig-annuaire : GPO « fond d'écran, lecteurs » liée à l'OU des ordinateurs | faux | https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing | Exemple côté ordinateur (pare-feu) ; flèche OU → groupe étiquetée « comptes membres ». |
| fig-compatibilite : « cinq vérifications dans la fiche de la carte mère » | faux | (la section dit « carte mère et pièce ») | « dans les fiches de la carte mère et des pièces ». |
| fig-cycle-ticket : les attentes reviennent « toujours » à En cours | non vérifié | https://confluence.atlassian.com/display/SERVICEDESKSERVER/Automating+your+service+project | Retirer « toujours », préciser « schéma d'exercice ». |
| fig-cycle-ticket : réouverture d'un ticket résolu | correct, source absente | même page | Ajouter la source dans l'encadré de J1 § 3. |
| fig-proche-lointain : « on s'arrête à la première qui échoue » | non vérifié | page `tracert` de Microsoft | « le premier échec oriente la recherche (un indice, pas une preuve) ». |
| fig-dora : « diffusion » absent de la section | correct, hors section | RFC 2131 § 3.1 | Écrire « en diffusion » dans l'étape Discover de J5. |
| fig-sept-etapes : boucle « non concluant » absente du texte | correct, hors section | CompTIA A+ 220-1101, 5.1 | Phrase ajoutée dans J8 § 3, avec « ou on escalade ». |
| fig-demarrage : maillons 1 (alimentation) et 5 (session) sans source | non vérifié | page Microsoft du démarrage (PreBoot à Kernel) | Symptômes présentés comme repères d'orientation ; réserve « écran et câble vérifiés » remise. |
| fig-couches : « Accès réseau » | non vérifié | RFC 1122 § 1.1.3 (« link layer ») | « Liaison (accès réseau) » dans le schéma et le tableau. |
| fig-probleme : « plusieurs incidents » ; « la correction viendra plus tard » | non vérifié | https://support.atlassian.com/jira-service-management-cloud/docs/what-is-the-itil-problem-management-process/ | « un ou plusieurs incidents » ; « la correction, si elle est prévue, viendra plus tard ». |
| fig-boite-partagee : flèches en chaîne (progression) | correct sur le fond | https://learn.microsoft.com/en-us/exchange/collaboration-exo/shared-mailboxes | Chaque droit relié directement à la boîte. |
| fig-compatibilite : DIMM ou SO-DIMM ; graphique « intégré ? » | non vérifié | — | Voir suivi. |
| fig-agdlp : encadré du § 5 sans source sur les groupes ; sigle | correct, source absente | https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups | Source ajoutée ; AGDLP présenté comme une convention. |

## Suivi des corrections (Claude Code, 26/11/2026)
- fig-annuaire, fig-compatibilite (légende), fig-cycle-ticket, fig-proche-lointain, fig-probleme, fig-boite-partagee, fig-couches, fig-agdlp, fig-demarrage : **Corrigé** — schémas régénérés par `outils/schemas.py`, textes des sections et encadrés de sources complétés (J1, J5, J6, J8, Réseau de base, AD, Matériel et PC).
- fig-compatibilite, DIMM ou SO-DIMM et graphique intégré : **Justifié** — ces deux points sont dans le texte de la section ; l'encadré renvoie désormais aux pages Intel et Dell ouvertes par le relecteur et aux fiches constructeurs (Intel ARK, AMD).
- Matrice impact × urgence de J1 : pas de schéma, le tableau existant suffit.
