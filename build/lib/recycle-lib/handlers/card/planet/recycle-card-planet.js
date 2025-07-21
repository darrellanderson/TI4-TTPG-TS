"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardPlanet = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardPlanet extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.planet:")
            .setFaceUp(false)
            .setSnapPointTag("deck-planet");
    }
}
exports.RecycleCardPlanet = RecycleCardPlanet;
//# sourceMappingURL=recycle-card-planet.js.map