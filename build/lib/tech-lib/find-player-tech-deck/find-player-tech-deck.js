"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPlayerTechDeck = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class FindPlayerTechDeck {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    _getTechDeck(playerSlot, errors) {
        const snapPoint = this._find.findSnapPointByTag("deck-technology", playerSlot);
        if (!snapPoint) {
            errors.push("Missing tech deck (no snap point)");
            return undefined;
        }
        const snapped = snapPoint.getSnappedObject();
        if (!snapped) {
            errors.push("Missing tech deck (no snapped object)");
            return undefined;
        }
        if (!(snapped instanceof api_1.Card)) {
            errors.push("Missing tech deck (not a card)");
            return undefined;
        }
        return snapped;
    }
    getTechDeck(playerSlot) {
        const errors = [];
        return this._getTechDeck(playerSlot, errors);
    }
    getTechDeckOrThrow(playerSlot) {
        const errors = [];
        const techDeck = this._getTechDeck(playerSlot, errors);
        if (!techDeck) {
            throw new Error(errors.join(", "));
        }
        return techDeck;
    }
}
exports.FindPlayerTechDeck = FindPlayerTechDeck;
//# sourceMappingURL=find-player-tech-deck.js.map