# Test en situation — montage B-01 et annexe F

**28/11/2026 — Chromium.** Usage : monter son premier PC en simulation sur téléphone, puis comparer le montage à deux PC compacts documentés. Essai à 390 px avec entrées tactiles et à 1280 px, en fichier local. Aucun accès au matériel de l'UMONS.

## Blocages relevés

| Où | Geste | Résultat observé | Résultat attendu |
|---|---|---|---|
| B-01, 390 px, apprentissage et test | Sélectionner le second ventilateur puis toucher sa cible sur la planche. | La cible et la zone tactile du bouton marche se recouvrent. Le bouton marche lance le POST avant la pose. En mode test, ce démarrage peut coûter des points. | La pose prend la priorité si une pièce est sélectionnée et qu'une cible valable est touchée. Les commandes sous la planche permettent toujours de démarrer. |
| F, recherche rapide | Taper « procédures de retrait » avec `/`. | Les références F-01 et F-02 trouvent leurs fiches, la section n'apparaît pas. | La recherche ouvre la section de retrait au bon modèle et permet aussi de trouver les caractéristiques et la comparaison. |
| F, tableau de comparaison à 390 px | Lire la dernière colonne. | Le tableau demande un défilement horizontal de 20 px. | Les trois colonnes tiennent dans la largeur de lecture. |
| B-01, résultat du test, aperçu A4 | Imprimer le rapport noté. | Une deuxième page blanche suit le rapport. | Le rapport seul tient sur une page A4. |

## Corrections et résultat de la reprise

- **B-01** — la pose passe avant les commandes du châssis lorsqu'une cible est touchée. Le tracé d'une cible prime aussi sur un rectangle tactile voisin. Les 15 étapes ont été jouées à 390 et 1280 px, avec rechargement après la carte mère, puis démarrage simulé réussi. En mode test, le montage complet a obtenu **100/100** aux deux largeurs. Les explications et le corrigé restent repliés jusqu'à leur ouverture. La progression et le score survivent au rechargement.
- **F-01 et F-02** — les procédures ont été ouvertes, les cotes comparées au tableau et les manuels consultés. Les liens internes fonctionnent. La recherche retrouve les modèles, leurs sections et celles de B-01. Un lien mène du montage terminé à la comparaison, et un autre permet de changer de modèle. Les en-têtes du tableau se replient à 390 px. Les résumés de procédure mesurent au moins 44 px. Le modèle et les droits d'intervention à l'UMONS sont marqués « à vérifier sur place ».
- **Impression** — le rapport B-01 tient sur une page A4 aux deux largeurs. L'annexe est un manuel de consultation : quatre pages A4 pour l'exemplaire HP avec ses six procédures ouvertes. Les commandes de navigation sont retirées du rapport imprimé.
- **Reprises** — aucun défilement horizontal de page, aucune erreur JavaScript et aucun échec du parcours à 390 px en sombre ni à 1280 px en clair.

[Capture du montage à 390 px](../captures/lot-49/b-01-mobile.jpg) · [Capture de l'annexe HP à 1280 px](../captures/lot-49/f-02-bureau.jpg)
