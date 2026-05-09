// index.js - export global

// State
export { state } from "./state.js";

// Recettes
export { recette } from "./recette.js";

// Game
export {
    unlockUsines,
    addJoueur,
    canConsumeRecipe,
    consumeRecipe,
    gainBenefice,
    sellProduct,
    addStock,
    checkAllUnlocks,
    calculPrevision,
    acheterUsine
} from "./game.js";

// DOM
export {
    fillRow,
    createUsine,
    createRow,
    initStockHUD,
    initTable,
    initJoueurHUD
} from "./Dom/create_Dom.js";

export {
    updateTable,
    updatePrevisionHUD,
    updateStockHUD,
    updateJoueurHUD
} from "./Dom/update_Dom.js";

// Events
export { initEvents } from "./events.js";

// Roman
export { toRoman } from "./Romain/toRoman.js";
export { initRomanCanvas, draw } from "./Romain/romanCanvas.js";