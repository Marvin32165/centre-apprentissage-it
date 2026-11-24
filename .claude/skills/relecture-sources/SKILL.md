---
name: relecture-sources
description: Fait vérifier les faits techniques d'une page contre les sources primaires (Microsoft Learn, Cisco, RFC, ITIL…) par un agent qui ne l'a pas écrite. À utiliser après l'écriture ou la modification d'une page de contenu.
---

Page à relire : $ARGUMENTS

Lance l'agent `relecteur-sources` sur cette page (il suit `docs/procedures/relecture-sources.md`). Ne relis pas la page toi-même : celui qui a écrit défend ce qu'il a écrit.

Quand il rend son tableau :
- corrige chaque « faux » ; pour chaque « non vérifié », trouve la source primaire ou retire / marque « à vérifier » ;
- ne relance l'agent que sur les sections corrigées, trois tours au plus, ensuite Marvin tranche ;
- note le résultat sous la sous-étape en cours dans `docs/PLAN.md`.
