import { random } from "./utilities.js";
import { ten_print } from "./generative/ten_print.js";
import { random_walkers } from "./generative/random_walkers.js";
import { circle_packing } from "./generative/circle_packing.js";
import { chaos_game } from "./generative/chaos_game.js";
import { mozaic } from "./generative/mozaic.js";
import { field } from "./generative/field.js";

const canvasGn = document.createElement("canvas");
canvasGn.width = 175;
canvasGn.height = 250;

export function generate_cover() {
  let rnd = Math.floor(random(0, 6));

  switch(rnd) {
    case 0 :
      return ten_print(canvasGn);
    case 1 :
      return random_walkers(canvasGn);
    case 2 :
      return circle_packing(canvasGn);
    case 3 :
      return chaos_game(canvasGn);
    case 4 : 
      return mozaic(canvasGn);
    case 5 :
        return field(canvasGn);
  }
}

