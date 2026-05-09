// create_Dom.js
import { state } from "../state.js";
import { recette } from "../recette.js";
import { toRoman } from "../Romain/toRoman.js";
import { initRomanCanvas, draw } from "../Romain/romanCanvas.js";
import { gainBenefice, calculPrevision, acheterUsine, coutInput  } from "../game.js";
import { updateJoueurHUD } from "./update_Dom.js";



//------------------------------------------
//            INITIATION TABLEAU
//------------------------------------------
export function initTable() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    Object.entries(state.Usines).forEach(([id, usine]) => {
        createRow(id, usine);
    });
}


//------------------------------------------
//       INITIATION HUD STOCK
//------------------------------------------
export function initStockHUD(id) {
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
//     INITIATION HUD JOUEUR + CANVAS
//------------------------------------------
export function initJoueurHUD() { 
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
//            TEMPLATE TABLEAU
//------------------------------------------
export function fillRow(tr, id, usine, qty = 1) {
    const benef = gainBenefice(id);
    const investi = calculPrevision(id, qty);
    const inputCout = coutInput(id);

    tr.id = `row-${id}`;

    tr.querySelector(".prod").textContent = toRoman(usine.produit);
    tr.querySelector(".stock").textContent = usine.stock;

    tr.querySelector(".recipe").innerHTML = recette[id]
        ? recette[id].map(r => `
            <span class="prod" style="color:lime;">${toRoman(r.id)}</span>
            <span style="color:white;"> | </span>
            <span class="stock" style="color:red;">${r.qty}</span>
        `).join(" & ")
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
    input.dataset.demandeId = String(id);

    // inputCout
    const span = tr.querySelector(".input_cout");
    span.dataset.inputCoutId = String(id);
    span.textContent = (inputCout ?? 0).toFixed(2) + "€";

    // boutons
    tr.querySelector(".craft-btn").dataset.craftId = id;

    const sellBtn = tr.querySelector(".sell-btn");
    sellBtn.dataset.sellId = String(id);
    sellBtn.disabled = Number(id) === 0;

    // prévision
    const prev = tr.querySelector(".prevision");
    prev.dataset.previsionId = String(id);
    prev.textContent = `${Number(investi).toFixed(2)}€`;
}


//------------------------------------------
//            CREATE NEW USINE
//------------------------------------------
export function createRow(id, usine) {
    const tbody = document.querySelector("tbody");

    // --- USINE NON ACHETÉE ---
    if (!usine.achete && id !== 0) {
        // td unique qui prend toutes les colonnes
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 10; // remplacer par le nombre de colonnes de ton tableau
        td.textContent = `En vente pour seulement : ${usine.prixAchat.toFixed(2)}€`;
        td.style.textAlign = "center";
        tr.style.cursor = "pointer";
        tr.appendChild(td);

        // clic sur la ligne pour acheter
        tr.addEventListener("click", () => {
            const success = acheterUsine(id);
            if (success) {
                // après achat, on recrée la ligne avec les boutons/infos
                tbody.removeChild(tr);
                createRow(id, state.Usines[id]);
            }
        });

        tbody.appendChild(tr);
        return;
    }

    // --- USINE ACHETÉE ---
    // clone du template habituel
    const template = document.getElementById("row-template");
    const clone = template.content.cloneNode(true);
    const tr = clone.querySelector("tr");

    fillRow(tr, id, usine, 1); // ta fonction existante pour remplir les td

    tbody.appendChild(clone);
}


//------------------------------------------
// CRÉATION + AUTO AJUSTEMENT D’UNE USINES
//------------------------------------------
export function createUsine(id) {
    return {
        produit: id,
        stock: 0,
        cout: +( (Number(id) + 1) * 0.10 ).toFixed(2),
        prix: +( Number(id) * 1.2 ).toFixed(2),
        prixAchat: +( Number(id) * 0.6 ).toFixed(2),
        achete: false
    };
}
