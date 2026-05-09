// main.js
/* 
  import { state } from "./state.js";
  import { initEvents } from "./events.js";
  import { unlockUsines, addJoueur } from "./game.js";
  import { toRoman } from "./Romain/toRoman.js";
  import { initRomanCanvas, draw } from "./Romain/romanCanvas.js"; 
*/
import * as Game from "./index.js";


//------------------------------------------
// unlock de base
//------------------------------------------
/*
  Game.state.Usines[0] = Game.createUsine(0);
  Game.state.Usines[0].achete = true; // déjà achetée
  Game.createRow(0, Game.state.Usines[0]);
  Game.initStockHUD(0); 
*/
Game.unlockUsines(0);
Game.addJoueur('TEST');
Game.initEvents();

/* TEST $$$$$ USINE */
function tricheUsine(id){
  for (let i = 1; i <= id; i++) {
    Game.unlockUsines(i); // 🔥
  }
}
// tricheUsine(10); // 0 a 10 MAX

