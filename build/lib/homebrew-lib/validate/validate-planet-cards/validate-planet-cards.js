"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePlanetCards = void 0;
const abstract_validate_1 = require("../abstract-validate/abstract-validate");
/**
 * Get planet cards NSIDs, spawn planet decks and make sure all nsids exist.
 */
class ValidatePlanetCards extends abstract_validate_1.AbstractValidate {
    getCommandName() {
        return "planet-cards";
    }
    getDescription() {
        return "Validate planet cards in the system registry match the planet cards in the decks (and vice versa).";
    }
    getErrors(erros) {
        const registeredNsids = this._getRegisteredPlanetCardNsids();
        const deckNsids = this.getCardNsids("card.planet:");
        const missingFromDeck = this.getSrcMissingFromDst(registeredNsids, deckNsids);
        if (missingFromDeck.length > 0) {
            erros.push(`Planet cards in registry missing from deck: ${missingFromDeck.join(", ")}`);
        }
        const missingFromRegistered = this.getSrcMissingFromDst(deckNsids, registeredNsids);
        if (missingFromRegistered.length > 0) {
            erros.push(`Planet cards in deck missing from registry: ${missingFromRegistered.join(", ")}`);
        }
    }
    _getRegisteredPlanetCardNsids() {
        return new Set(TI4.systemRegistry.rawAllPlanetCardNsids());
    }
}
exports.ValidatePlanetCards = ValidatePlanetCards;
//# sourceMappingURL=validate-planet-cards.js.map