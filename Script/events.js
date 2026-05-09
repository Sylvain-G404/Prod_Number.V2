// events.js
import {
    consumeRecipe,
    sellProduct,
    addStock,
    checkAllUnlocks,
    calculPrevision,
    coutInput
} from "./game.js";



export function initEvents() {
    //------------------------------------------
    // je recupe le parent de tous les boutons 
    //------------------------------------------
    const table = document.querySelector("table");

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
    if (!e.target.matches(".demande")) return;
    const valeur = Number(e.target.value);
    const id = e.target.dataset.demandeId;

    calculPrevision(id, valeur);
    coutInput(id, valeur);
    })
}