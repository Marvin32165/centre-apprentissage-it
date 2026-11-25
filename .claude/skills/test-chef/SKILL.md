---
name: test-chef
description: Fait tester une page en situation réelle (labo, quiz, corrections, liens, mobile, impression) par un agent qui ne l'a pas fabriquée. Arguments : la page, puis l'usage concret.
---

Page et usage : $ARGUMENTS

Lance l'agent `chef` avec la page et l'usage concret (pas un adjectif : « préparer mon premier appel », pas « est-ce que c'est bien »). Il suit `docs/procedures/test-chef.md` et ne modifie rien.

Corrige ce qu'il signale comme bloquant, puis relance-le une fois. Trois tours au plus, ensuite Marvin tranche. Note le résultat dans `docs/PLAN.md`.
