# 🏭 Roman Factory Game

Un petit jeu de gestion/production basé sur un système de crafting et d’usines, développé en JavaScript vanilla.

Le joueur produit, vend et débloque progressivement des usines en utilisant des recettes.

---

## 🎮 Concept du jeu

Le joueur commence avec une seule usine (niveau 0) et doit :

- Produire des ressources
- Consommer des recettes pour fabriquer de nouveaux produits
- Vendre les produits pour gagner de l’argent
- Débloquer progressivement de nouvelles usines

Chaque produit possède :

- un coût de fabrication
- un prix de vente
- un stock
- une recette (dépendance à d’autres produits)

---

## ⚙️ Fonctionnalités

### 🏭 Système d’usines

- Création dynamique d’usines avec createUsine(id)
- Affichage en tableau HTML
- Usines non achetées : tr unique “En vente : X €” cliquable
- Usines achetées : tr complet avec boutons Craft / Sell
- Déblocage automatique basé sur les ressources (checkAllUnlocks())

### 🔁 Système de crafting

- Recettes définies dans un objet central
- Consommation automatique des ressources
- Vérification des conditions avant fabrication

### 💰 Économie

- Chaque produit a un coût (cout) et un prix (prix)
- Calcul automatique du bénéfice via gainBenefice(id)
- Dévoile des nouvelles usines possible par stock disponible puis via l'achat

### 🧑 Joueur

- Nom de joueur
- Argent (wallet)
- HUD dynamique

### 📊 Interface

- Tableau des usines mis à jour dynamiquement
- Boutons Craft / Sell activés seulement si l’usine est achetée
- Ligne “À VENDRE” grisée, tr cliquable pour acheter l’usine

### 📊 Canvas

- Canvas pour affichage visuel via initRomanCanvas() et draw()

---

## 📁 Structure du projet

```bash
Prod_Number.V2
|   index.html
|   README.md
|   structure.txt
|
+---Assets
|   \---Image
|           infini1.png
|           infini2.png
|           infini3.png
|
+---ScreenCite
|       Screenshot 2026-05-04 at 18-38-10 Production de Nombre(s).png
|       Screenshot 2026-05-04 at 18-38-33 Production de Nombre(s).png
|       Screenshot 2026-05-05 at 05-15-00 Production de Nombre(s).png
|       Screenshot 2026-05-05 at 05-15-09 Production de Nombre(s).png
|       Screenshot 2026-05-05 at 08-20-09 Production de Nombre(s).png
|       Screenshot 2026-05-05 at 08-20-20 Production de Nombre(s).png
|       Screenshot 2026-05-05 at 17-15-24 Production de Nombre(s).png
|       Screenshot 2026-05-05 at 17-15-31 Production de Nombre(s).png
|       Screenshot 2026-05-09 at 05-35-13 Production de Nombre(s).png
|       Screenshot 2026-05-09 at 05-35-58 Production de Nombre(s).png
|
+---Script
|   |   events.js
|   |   game.js
|   |   index.js
|   |   main copy.js
|   |   main.js
|   |   partition.js
|   |   recette.js
|   |   state.js
|   |
|   +---Dom
|   |       create_Dom.js
|   |       update_Dom.js
|   |
|   \---Romain
|           romanCanvas.js
|           toRoman.js
|
\---Style
    |   main.css
    |
    \---Fonts
        \---arcade-classic-pizzadude
                ARCADECLASSIC.TTF
                pizzadudedotdk.txt
```

## 🧠 Architecture du projet

### State global

```js
state = {
  Usines: [],
  Joueur: {},
};
```

### Recettes

- Les recettes définissent les dépendances entre produits :

- `id` → identifiant du produit requis
- `qty` → quantité nécessaire

```js
recette = {
1: [{ id: 0, qty: 2 }],
2: [{ id: 1, qty: 2 }],
...
}
```

## 🔁 Fonctions principales

### 🎯 Gameplay

- consumeRecipe(id) → consomme les ressources pour fabriquer
- addStock(id, amount) → ajoute du stock
- sellProduct(id) → vend un produit
- checkAllUnlocks() → débloque les nouvelles usines

### 🏗️ Usines

- createUsine(id) → crée une usine
- unlockUsines(id) → débloque une usine
- gainBenefice(id) → calcule le profit

### 🖥️ Interface

- initTable() → initialise le tableau HTML
- updateTable(id) → met à jour une ligne
- initStockHUD(id) → affiche le stock
- updateStockHUD(id) → met à jour le HUD stock
- initJoueurHUD() → HUD joueur
- updateJoueurHUD() → mise à jour argent

### 📦 Canvas

- Le projet inclut un canvas pour afficher des éléments visuels via :

- initRomanCanvas()
- draw()

## 🚀 Lancement

- Cloner le projet
- Ouvrir index.html dans un navigateur
- Jouer 🎮

## 🧪 Mode debug

- Une fonction de triche permet de débloquer rapidement les usines :

- tricheUsine(?); ? de 1 a 10 // Pour l'instant

## ⚠️ Points techniques

- DOM manipulé dynamiquement
- State global centralisé
- Logique métier + UI encore couplées
- Structure optimisable pour version scalable

## 📈 Améliorations possibles

- Optimiser les mises à jour DOM // ✅ FAIT
- Débloquage des Usine pars l'argent / Plutôt que part les Stock Disponible // ✅ FAIT
- Séparer logique et UI (architecture MVC ou ECS) // ✅ FAIT
- Ajouter un système de sauvegarde ⏳
- Ajouter des animations canvas ⏳
- Refactor state en Map ou objets typés ⏳
- Refactor Recette fait a la main pour l'instant ⏳
- Add systhème de livraison / Ajoue du temps "???" / animation... ⏳
- Une taxe style / Gain par minute devisé par 2 ou multiplié par 2 / tout les heurs .?. ⏳
- Frais d'entretien de Usine / Usure Usine .?. ⏳
- Input = craft en groupe donc +0.01€ par unité craft ⏳

- ✅ Séparer logique et UI (architecture MVC/ECS) — 09/05/26 : la logique métier est dans game.js et l’UI dans create_Dom.js / update_Dom.js.
- ✅ Optimiser les mises à jour DOM — 09/05/26 : seule la ligne concernée est recréée ou mise à jour au lieu de tout le tableau.
- ✅ Débloquage des Usines par l’argent — 09/05/26 : les lignes “À VENDRE : X €” sont créées dynamiquement et cliquables.
- ⏳ Ajouter un système de sauvegarde — sauvegarde automatique ou manuel de l’état du joueur et des usines.
- ⏳ Ajouter des animations Canvas — pour rendre visuellement les productions ou ventes plus dynamiques.
- ⏳ Refactor du state en Map ou objets typés — amélioration des performances et lisibilité du code.
- ⏳ Refactor des recettes — actuellement écrites à la main, pourraient être générées ou importées depuis un fichier JSON.
- ⏳ Système de livraison / délai de production — introduire un temps de fabrication et des animations associées.
- ⏳ Taxe ou gain par minute — modifier le revenu du joueur automatiquement toutes les heures ou chaque intervalle de temps.
- ⏳ Frais d’entretien / usure des usines — coût récurrent pour maintenir les usines.
- ⏳ Craft en groupe — input pour produire plusieurs unités en même temps avec un coût ajusté (+0,01 € par unité).

## 👨‍💻 Auteur $ KiirrA $

- Projet personnel — apprentissage JavaScript / game dev / DOM manipulation

---
