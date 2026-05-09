import { toRoman } from "./Romain/toRoman.js";
import { initRomanCanvas, draw } from "./Romain/romanCanvas.js";

const csl = console.log; // je me simplifi la vie

//------------------------------------------
// Version stable grain a modifier 
//------------------------------------------

let canvasStarted = false;

//------------------------------------------
// je recupe le parent de tous les boutons 
//------------------------------------------
const table = document.querySelector("table");

//------------------------------------------
// donné du Jeux
//------------------------------------------
const state = {
  Usines: [],
  Joueur: {}
};

//------------------------------------------
//        RECETTES SIMPLE (fixe)
//------------------------------------------
const recette = {
  0: [{ id: 0, qty: 0 }],

  1: [{ id: 0, qty: 2 }],

  2: [{ id: 1, qty: 2 }],

  3: [{ id: 2, qty: 1 }, { id: 1, qty: 1 }],

  4: [{ id: 3, qty: 1 }, { id: 1, qty: 1 }],

  5: [{ id: 4, qty: 1 }, { id: 1, qty: 1 }],

  6: [{ id: 5, qty: 1 }, { id: 1, qty: 1 }],

  7: [{ id: 6, qty: 1 }, { id: 1, qty: 1 }],

  8: [{ id: 7, qty: 1 }, { id: 1, qty: 1 }],

  9: [{ id: 8, qty: 1 }, { id: 1, qty: 1 }]
};

//------------------------------------------
// j'écoute les boutons et j'identifi le ID
//------------------------------------------
table.addEventListener("click", (e) => {
  const craftBtn = e.target.closest("[data-craft-id]");
  const sellBtn = e.target.closest("[data-sell-id]");

  // 👉 on récupère la ligne du input pour connaitre sa valeur
  const row = e.target.closest("tr");
  const input = row?.querySelector(".demande");
  const valeur = input ? Number(input.value) : 1;

  if (craftBtn) {
    const craftId = Number(craftBtn.dataset.craftId);

    if (consumeRecipe(craftId,valeur)) {
      addStock(craftId, valeur);
      checkAllUnlocks();
    }
  }

  if (sellBtn) {
    const sellId = Number(sellBtn.dataset.sellId);
    sellProduct(sellId, valeur);
  }
});

//------------------------------------------
// j'écoute les input et j'identifi le ID
//------------------------------------------
table.addEventListener("input", (e) => {
  const valeur = Number(e.target.value);
  const id = e.target.dataset.demandeId;

  calculPrevision(id, valeur);
})

//------------------------------------------
//            AJOUTE UN JOUEUR
//------------------------------------------
function addJoueur(pseudo) {
  if(!pseudo) return;
  state.Joueur = {
    nom: pseudo,
    argent: 0.40
  };

  initJoueurHUD();
}

//------------------------------------------
//            AJOUTE AU STOCK
//------------------------------------------
function addStock(id, valeur) {
  if (!state.Usines[id]) return;

  state.Usines[id].stock += valeur;

  updateTable(id, valeur);
  updateStockHUD(id);
}

//------------------------------------------
//            TEMPLATE TABLEAU
//------------------------------------------
function fillRow(tr, id, usine, qty = 1) {
  const benef = gainBenefice(id);
  const investi = calculPrevision(id, qty);

  tr.id = `row-${id}`;

  tr.querySelector(".prod").textContent = toRoman(usine.produit);
  tr.querySelector(".stock").textContent = usine.stock;

  tr.querySelector(".recipe").innerHTML = recette[id]
    ? recette[id].map(r => `
        <span class="prod" style="color:lime;">${r.id}</span>
        <span style="color:white;"> | </span>
        <span class="stock" style="color:red;">${r.qty}</span>
      `).join(" + ")
    : "";

  tr.querySelector(".cout").textContent = `${usine.cout.toFixed(2)}€`;

  const prixEl = tr.querySelector(".prix");
  prixEl.textContent = `${usine.prix.toFixed(2)}€`;
  prixEl.style.color = usine.prix === 0 ? "gray" : "white";

  const benefEl = tr.querySelector(".benef");
  benefEl.textContent = `${Number(benef).toFixed(2)}€`;
  benefEl.style.color = benef == 0 ? "gray" : "white";

  // input
  const input = tr.querySelector(".demande");
  input.value = qty;
  input.dataset.demandeId = id;

  // boutons
  tr.querySelector(".craft-btn").dataset.craftId = id;

  const sellBtn = tr.querySelector(".sell-btn");
  sellBtn.dataset.sellId = id;
  sellBtn.disabled = Number(id) === 0;

  // prévision
  const prev = tr.querySelector(".prevision");
  prev.dataset.previsionId = id;
  prev.textContent = `${Number(investi).toFixed(2)}€`;
}

//------------------------------------------
//            INITIATION TABLEAU
//------------------------------------------
function initTable() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  Object.entries(state.Usines).forEach(([id, usine]) => {
    createRow(id, usine);
  });
}

//------------------------------------------
//            UPDATE TABLEAU
//------------------------------------------
function updateTable(id) {

  const tr = document.getElementById(`row-${id}`);

  if (!tr) return;

  const usine = state.Usines[id];

  // 🔥 récupère la valeur actuelle de l'input
  const qty = Number(tr.querySelector(".demande").value) || 1;

  fillRow(tr, id, usine, qty);
}

//------------------------------------------
//            NEW USINE
//------------------------------------------
function createRow(id, usine) {
  const tbody = document.querySelector("tbody");
  const template = document.getElementById("row-template");

  const clone = template.content.cloneNode(true);
  const tr = clone.querySelector("tr");

  fillRow(tr, id, usine, 1);

  tbody.appendChild(clone);
}

//------------------------------------------
//         CALCULE PREVISION
//------------------------------------------
function calculPrevision(id, qty){
  const recipe = recette[id];
  if (!recipe) return 0;

  const coutUsine = state.Usines[id].cout;
  if (!coutUsine) return 0

  let coutTotal = 0;

  // 🔧 coût des ingrédients
  const cout = coutUsine * qty;
  coutTotal += cout;

  const investissement = coutTotal;

  updatePrevisionHUD(id, investissement);
  return investissement;
}

//------------------------------------------
//         UPDATE HUD PREVISION
//------------------------------------------
function updatePrevisionHUD(id, investissement){
 const td = document.querySelector(`[data-prevision-id="${id}"]`);
 if (!td) return;
 td.textContent = `${investissement.toFixed(2)}€`;
}

//------------------------------------------
//       INITIATION HUD STOCK
//------------------------------------------
function initStockHUD(id) {
  const ul = document.querySelector("ul");

  if (document.getElementById(`hud-${id}`)) return;

  const li = document.createElement("li");
  li.id = `hud-${id}`;

  li.innerHTML = `
    Produit: <span class="prod">${toRoman(id)}</span><br />
    Stock: <span class="stock">0</span>
  `;

  ul.appendChild(li);
}

//------------------------------------------
//       UPDATE HUD STOCK
//------------------------------------------
function updateStockHUD(id) {
  const li = document.getElementById(`hud-${id}`);
  if (!li) return;

  li.querySelector(".stock").textContent = state.Usines[id].stock;
}

//------------------------------------------
//     INITIATION HUD JOUEUR + CANVAS
//------------------------------------------
function initJoueurHUD() { 
  const joueur_HUD = document.querySelector(".content-HUD-joueur");

  // 🔥 PSEUDO
  const spanNom = document.createElement("span");
  spanNom.classList.add("pseudo");
  spanNom.textContent = `👤: ${state.Joueur.nom}`;
  
  // 🔥 CANVAS
  const canvas = document.createElement("canvas");
  canvas.id = "romanCanvas";
  canvas.width = 400;
  canvas.height = 50;

  // 🔥 ARGENT
  const spanArgent = document.createElement("span");
  spanArgent.classList.add("argent");
  spanArgent.textContent = `💰: ${state.Joueur.argent.toFixed(2)}€`;
  
  // 🔥 CRÉATION
  joueur_HUD.appendChild(spanNom);
  joueur_HUD.appendChild(canvas);
  joueur_HUD.appendChild(spanArgent);
  
  // 🔥 INITIATION CANVAS
  if (!canvas) return;
  if (initRomanCanvas()) {
    draw();
  }

  updateJoueurHUD();
}

//------------------------------------------
//            UPDATE HUD JOUEUR
//------------------------------------------
function updateJoueurHUD(id) {
  const spanArgent = document.querySelector(".argent");

  if (spanArgent) {
    spanArgent.textContent = `💰: ${state.Joueur.argent.toFixed(2)}€`;
  }
}

//------------------------------------------
// CRÉATION + AUTO AJUSTEMENT D’UNE USINES
//------------------------------------------
function createUsine(id) {
  return {
    produit: id,
    stock: 0,
    cout: +( (Number(id) + 1) * 0.10 ).toFixed(2),
    prix: +( Number(id) * 1.2).toFixed(2)
  };
}

//------------------------------------------
//  DETECTION DES STOCK -> DEBLOCAGE USINES
//------------------------------------------
function checkAllUnlocks() {
  Object.keys(recette).forEach(id => {
    
    if (state.Usines[id]) return;
    
    const recipe = recette[id];

    if (!recipe) return;

    const canUnlock = recipe.every(r => 
      state.Usines[r.id]?.stock >= r.qty
    );

    if (canUnlock) {
      unlockUsines(Number(id));
    }
  });
}

//------------------------------------------
//      DEBLOQUE USINES ID
//------------------------------------------
function unlockUsines(id) {

  if (state.Usines[id]) return;

  state.Usines[id] = createUsine(id);

  initStockHUD(id);

  createRow(id, state.Usines[id]);
}

//------------------------------------------
//        VERIFICATION STOCK
//------------------------------------------
function canConsumeRecipe(id, qtyDemande) {
  const recipe = recette[id];
  if (!recipe) return true;

  return recipe.every(r => {
    const stock = state.Usines[r.id]?.stock || 0;
    const needed = r.qty * qtyDemande;

    return stock >= needed;
  });
}

//------------------------------------------
//        CONSOMMATION RECETTE
//------------------------------------------
function consumeRecipe(id, qtyDemande) {
  if (!canConsumeRecipe(id, qtyDemande)) return false;

  const recipe = recette[id];
  const cost = state.Usines[id].cout || 0;
  const coutTotal = cost * qtyDemande;

  if (state.Joueur.argent < coutTotal) return false;

  state.Joueur.argent -= coutTotal;
  updateJoueurHUD();

  recipe.forEach(r => {
    state.Usines[r.id].stock -= r.qty * qtyDemande;

    // sécurité anti négatif
    if (state.Usines[r.id].stock < 0) {
      state.Usines[r.id].stock = 0;
    }

    updateTable(r.id,qtyDemande);
    updateStockHUD(r.id);
  });

  return true;
}
//------------------------------------------
//              BÉNÉFICE
//------------------------------------------
function gainBenefice(id){
  const recipe = recette[id];
  if (!recipe) return 0;

  const usine = state.Usines[id];
  if (!usine) return 0

  const prixVente = state.Usines[id].prix;
  if (prixVente <= 0) return 0;

  let coutTotal = 0;

  // 🔧 coût des ingrédients
  recipe.forEach(r => {
    const cout = state.Usines[r.id].cout * r.qty;
    coutTotal += cout;
  });

  // 🔥 AJOUT du coût de fabrication du produit lui-même
  coutTotal += usine.cout;

  const benefice = Number(prixVente - coutTotal).toFixed(2);

  return benefice;
}

//------------------------------------------
//                VENTE
//------------------------------------------
function sellProduct(id, qtySell){
  if(Number(id) === 0) return;

  const usine = state.Usines[id];
  if(!usine || usine.stock <= 0) return;

  usine.stock -= qtySell;
  state.Joueur.argent += usine.prix * qtySell;

  updateStockHUD(id);
  updateTable(id, qtySell);
  updateJoueurHUD(id);
}

//------------------------------------------
// unlock de base
//------------------------------------------
unlockUsines(0);
addJoueur('TEST');


/* TEST $$$$$ USINE */
function tricheUsine(id){
  for (let i = 1; i <= id; i++) {
    unlockUsines(i); // 🔥
  }
}
// tricheUsine(9); // 0 a 9 MAX
  
