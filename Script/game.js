// game.js
import { state } from "./state.js";
import { recette } from "./recette.js";
import { updateTable, updateStockHUD, updateJoueurHUD, updatePrevisionHUD, updateRow, updateCoutInput } from "./Dom/update_Dom.js";
import { createRow, initStockHUD, createUsine, initJoueurHUD } from "./Dom/create_Dom.js"; 



//------------------------------------------
//            AJOUTE UN JOUEUR
//------------------------------------------
export function addJoueur(pseudo) {
    if(!pseudo) return;
    state.Joueur = {
        nom: pseudo,
        argent: 1
    };

    initJoueurHUD();
}



//------------------------------------------
//            AJOUTE AU STOCK
//------------------------------------------
export function addStock(id, valeur) {
    if (!state.Usines[id]) return;

    state.Usines[id].stock += valeur;

    updateTable(id, valeur);
    updateStockHUD(id);
}



//------------------------------------------
//      DEBLOQUE USINE ID
//------------------------------------------
export function unlockUsines(id) {

    if (state.Usines[id]) return;

    state.Usines[id] = createUsine(id);
    const usine = state.Usines[id];

    createRow(id, usine);
    initStockHUD(id);
}



//------------------------------------------
//      A VENDRE USINE ID
//------------------------------------------
export function acheterUsine(id) {
    const usine = state.Usines[id];
    if (!usine || usine.achete) return false;

    if (state.Joueur.argent < usine.prixAchat) return false;

    state.Joueur.argent -= usine.prixAchat;
    usine.achete = true;

    updateJoueurHUD();

    // Met à jour le tr pour afficher la vraie usine
    updateRow(id, usine);

    return true;
}



//------------------------------------------
//  DETECTION DES STOCK -> DEBLOCAGE USINES
//------------------------------------------
export function checkAllUnlocks() {
    Object.keys(recette).forEach(id => {
        
        if (state.Usines[id]) return;
        
        const recipe = recette[id];

        if (!recipe) return;

        const canUnlock = recipe.every(r => 
        state.Usines[r.id]?.stock >= r.qty
        );

        if (canUnlock) {
            unlockUsines(id);
        }
    });
}



//------------------------------------------
//        VERIFICATION STOCK
//------------------------------------------
export function canConsumeRecipe(id, qtyDemande) {
    const recipe = recette[id];
    if (!recipe) return true;

    return recipe.every(r => {
        const stock = state.Usines[r.id]?.stock || 0;
        const needed = r.qty * qtyDemande;

        return stock >= needed;
    });
}



//------------------------------------------
//        CONSOMMATION RECETTE / PAYE
//------------------------------------------
export function consumeRecipe(id, qtyDemande) {
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
export function gainBenefice(id){
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
//         CALCULE PREVISION
//------------------------------------------
export function calculPrevision(id, qty){
    const recipe = recette[id];
    if (!recipe) return 0;

    const coutUsine = state.Usines[id].cout;
    if (!coutUsine) return 0

    let coutTotal = 0;

    // ⚙️ Plus cout Input quantité
    const inputCout = getInputCout(qty);
    coutTotal += inputCout

    // 🔧 coût des ingrédients
    const cout = coutUsine * qty;
    coutTotal += cout;

    const investissement = coutTotal;

    updatePrevisionHUD(id, investissement);
    return investissement;
}


export function getInputCout(valeur) {
    if (isNaN(valeur) || valeur < 1) return 0;
    return (valeur - 1) * 0.01;
}


//------------------------------------------
//     CALCULE PREVISION INPUT 0.01€
//------------------------------------------
export function coutInput(id, valeur) {
    const inputCout = getInputCout(valeur);
    updateCoutInput(id, inputCout);
}



//------------------------------------------
//                VENTE
//------------------------------------------
export function sellProduct(id, qtySell){
    if(Number(id) === 0) return;

    const usine = state.Usines[id];
    if(!usine || usine.stock <= 0) return;

    usine.stock -= qtySell;
    state.Joueur.argent += usine.prix * qtySell;

    updateStockHUD(id);
    updateTable(id, qtySell);
    updateJoueurHUD(id);
}