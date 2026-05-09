// update_Dom.js
import { state } from "../state.js";
import { fillRow, initJoueurHUD } from "./create_Dom.js";



//------------------------------------------
//            UPDATE TABLEAU
//------------------------------------------
export function updateTable(id) {

    const tr = document.getElementById(`row-${id}`);

    if (!tr) return;

    const usine = state.Usines[id];

    // 🔥 récupère la valeur actuelle de l'input
    const qty = Number(tr.querySelector(".demande").value) || 1;

    fillRow(tr, id, usine, qty);
}



//------------------------------------------
//         UPDATE HUD PREVISION
//------------------------------------------
export function updatePrevisionHUD(id, investissement){
    const td = document.querySelector(`[data-prevision-id="${id}"]`);
    if (!td) return;
    td.textContent = `${investissement.toFixed(2)}€`;
}



//------------------------------------------
//         UPDATE HUD COUT INPUT
//------------------------------------------
export function updateCoutInput(id, valeur) {
    const span = document.querySelector(
        `[data-input-cout-id="${id}"]`
    );
    if (!span) return;
    span.textContent = `${Number(valeur).toFixed(2)}€`;
}



//------------------------------------------
//       UPDATE HUD STOCK
//------------------------------------------
export function updateStockHUD(id) {
    const li = document.getElementById(`hud-${id}`);
    if (!li) return;

    li.querySelector(".stock").textContent = state.Usines[id].stock;
}



//------------------------------------------
//            UPDATE HUD JOUEUR
//------------------------------------------
export function updateJoueurHUD(id) {
    const spanArgent = document.querySelector(".argent");

    if (spanArgent) {
        spanArgent.textContent = `💰: ${state.Joueur.argent.toFixed(2)}€`;
    }
}



//------------------------------------------
//      Met à jour le tr après achat
//------------------------------------------
export function updateRow(id, usine) {
    const tr = document.getElementById(`row-${id}`);
    if (!tr) return;

    tr.innerHTML = ""; // Vide le tr actuel
    fillRow(tr, id, usine, 1); // Remplit avec toutes les colonnes et boutons
}