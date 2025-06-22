import { Card, GameObject } from "@tabletop-playground/api";
import {
  CardUtil,
  DeletedItemsContainer,
  Find,
  NSID,
  ParsedNSID,
  Spawn,
} from "ttpg-darrell";

/**
 * Homebrew injection may add new cards to existings decks.
 * Given a new deck nsid, add any missing cards to the corresponding deck.
 */
export class SpawnMissingCards {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  spawnAndAddMissingCards(deckNsid: string): void {
    const existingDeck: Card | undefined = this._getExistingDeck(deckNsid);
    if (existingDeck) {
      const spawnedDeck: Card | undefined = this._spawnDeck(deckNsid);
      if (spawnedDeck) {
        this._addMissingCards(spawnedDeck, existingDeck);
      }
    }
  }

  _spawnDeck(deckNsid: string): Card | undefined {
    const obj: GameObject | undefined = Spawn.spawn(deckNsid);
    if (obj instanceof Card) {
      return obj;
    } else if (obj) {
      DeletedItemsContainer.destroyWithoutCopying(obj);
    }
  }

  /**
   * Decks are normally stored on snap points of `deck-${type}`
   * where cards have a `card.${type}` nsid prefix.
   *
   * @param deckNsid
   */
  _getExistingDeck(deckNsid: string): Card | undefined {
    const parsed: ParsedNSID | undefined = NSID.parse(deckNsid);
    if (parsed && deckNsid.startsWith("card.")) {
      const cardType: string | undefined = parsed.typeParts[1];
      if (cardType) {
        const snapPointTag: string = `deck-${cardType}`;
        const deck: Card | undefined =
          this._find.findDeckOrDiscard(snapPointTag);
        if (deck) {
          return deck;
        }
      }
    }
  }

  _addMissingCards(srcDeck: Card, dstDeck: Card): void {
    const dstDeckNsids: Set<string> = new Set(NSID.getDeck(dstDeck));
    const spawnedCards: Array<Card> = this._cardUtil.separateDeck(srcDeck);
    spawnedCards.forEach((card: Card): void => {
      const nsid: string = NSID.get(card);
      if (!dstDeckNsids.has(nsid)) {
        // Add the card to the existing deck.
        dstDeck.addCards(card);
      } else {
        // If the card already exists, destroy it.
        DeletedItemsContainer.destroyWithoutCopying(card);
      }
    });
  }
}
