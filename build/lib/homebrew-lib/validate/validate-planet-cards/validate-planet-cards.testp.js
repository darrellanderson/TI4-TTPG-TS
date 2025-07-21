"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_planet_cards_1 = require("./validate-planet-cards");
function go() {
    const errors = [];
    new validate_planet_cards_1.ValidatePlanetCards().getErrors(errors);
    console.log("Errors:\n", errors.join("\n"));
}
process.nextTick(go);
//# sourceMappingURL=validate-planet-cards.testp.js.map