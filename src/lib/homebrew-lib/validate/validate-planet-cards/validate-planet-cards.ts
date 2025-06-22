import { AbstractValidate } from "../abstract-validate/abstract-validate";

/**
 * Get planet cards NSIDs, spawn planet decks and make sure all nsids exist.
 */
export class ValidatePlanetCards extends AbstractValidate {
  getCommandName(): string {
    return "planet-cards";
  }

  getDescription(): string {
    return "Validate planet cards in the system registry match the planet cards in the decks (and vice versa).";
  }

  getErrors(erros: Array<string>): void {
    const registeredNsids: Set<string> = this._getRegisteredPlanetCardNsids();
    const deckNsids: Set<string> = this.getCardNsids("card.planet:");

    const missingFromDeck: Array<string> = this.getSrcMissingFromDst(
      registeredNsids,
      deckNsids
    );
    if (missingFromDeck.length > 0) {
      erros.push(
        `Planet cards in registry missing from deck: ${missingFromDeck.join(
          ", "
        )}`
      );
    }

    const missingFromRegistered: Array<string> = this.getSrcMissingFromDst(
      deckNsids,
      registeredNsids
    );
    if (missingFromRegistered.length > 0) {
      erros.push(
        `Planet cards in deck missing from registry: ${missingFromRegistered.join(
          ", "
        )}`
      );
    }
  }

  _getRegisteredPlanetCardNsids(): Set<string> {
    return new Set<string>(TI4.systemRegistry.rawAllPlanetCardNsids());
  }
}
