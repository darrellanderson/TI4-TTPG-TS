import { Card } from "@tabletop-playground/api";
import { DeletedItemsContainer, NSID, Spawn } from "ttpg-darrell";

/**
 * Get planet cards NSIDs, spawn planet decks and make sure all nsids exist.
 */
export class ValidatePlanetCards {
  getErrors(erros: Array<string>): void {
    const registeredNsids: Set<string> = this._getRegisteredPlanetCardNsids();

    const deck: Card | undefined = this._getDeckPlanetCards();
    if (deck) {
      const deckNsids: Set<string> = this._getDeckPlanetCardNsids(deck);

      const missingFromDeck: Array<string> = this._getSrcMissingFromDst(
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

      const missingFromRegistered: Array<string> = this._getSrcMissingFromDst(
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

      DeletedItemsContainer.destroyWithoutCopying(deck);
    }
  }

  _getRegisteredPlanetCardNsids(): Set<string> {
    return new Set<string>(TI4.systemRegistry.rawAllPlanetCardNsids());
  }

  _getDeckPlanetCards(): Card | undefined {
    const deckNsids: Array<string> = Spawn.getAllNsids().filter(
      (nsid: string): boolean => {
        return nsid.startsWith("card.planet:");
      }
    );
    const deck: Card | undefined = Spawn.spawnMergeDecks(deckNsids);
    return deck;
  }

  _getDeckPlanetCardNsids(deck: Card): Set<string> {
    const nsids: Array<string> = NSID.getDeck(deck);
    return new Set<string>(nsids);
  }

  _getSrcMissingFromDst(src: Set<string>, dst: Set<string>): Array<string> {
    const missing: Set<string> = new Set<string>();
    for (const nsid of src) {
      if (!dst.has(nsid)) {
        missing.add(nsid);
      }
    }
    return Array.from(missing);
  }
}
