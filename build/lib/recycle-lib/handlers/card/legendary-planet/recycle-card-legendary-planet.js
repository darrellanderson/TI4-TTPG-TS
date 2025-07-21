"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardLegendaryPlanet = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardLegendaryPlanet extends ttpg_darrell_1.SimpleCardGarbageHandler {
    constructor() {
        super();
        this.setCardNsidPrefix("card.legendary-planet:")
            .setFaceUp(false)
            .setSnapPointTag("deck-legendary-planet");
    }
}
exports.RecycleCardLegendaryPlanet = RecycleCardLegendaryPlanet;
//# sourceMappingURL=recycle-card-legendary-planet.js.map