import { Card, GameObject } from "@tabletop-playground/api";
import {
  CardUtil,
  DeletedItemsContainer,
  Find,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";

/**
 * Homebrew injection may add new cards to existings decks.
 * Given a new deck nsid, add any missing cards to the corresponding deck.
 */
export class SpawnMissingCards {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  static shouldSpawnMissingCards(deckNsid: string): boolean {
    // Generic technology requires spawning for each player.
    // Ignore tech for now.
    return (
      deckNsid.startsWith("card.action") ||
      deckNsid.startsWith("card.agenda") ||
      deckNsid.startsWith("card.exploration.") ||
      deckNsid.startsWith("card.event") ||
      deckNsid.startsWith("card.faction-reference") ||
      deckNsid.startsWith("card.legendary-planet") ||
      deckNsid.startsWith("card.objective.") ||
      deckNsid.startsWith("card.planet") ||
      deckNsid.startsWith("card.relic")
    );
  }

  static shouldShuffleDeck(deckNsid: string): boolean {
    return (
      deckNsid.startsWith("card.action") ||
      deckNsid.startsWith("card.agenda") ||
      deckNsid.startsWith("card.exploration.") ||
      deckNsid.startsWith("card.objective.") ||
      deckNsid.startsWith("card.relic")
    );
  }

  spawnAndAddMissingCards(deckNsid: string): void {
    const existingDeck: Card | undefined = this._getExistingDeck(deckNsid);
    if (existingDeck) {
      const spawnedDeck: Card | undefined = this._spawnDeck(deckNsid);
      if (spawnedDeck) {
        this._addMissingCards(spawnedDeck, existingDeck);
        if (SpawnMissingCards.shouldShuffleDeck(deckNsid)) {
          spawnedDeck.shuffle();
        }
      }
    }
  }

  _spawnDeck(deckNsid: string): Card | undefined {
    const obj: GameObject | undefined = TI4.spawn.spawn(deckNsid);
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
      // Handle card.exploration.cultural, etc.
      let cardType: string | undefined = parsed.typeParts.slice(1).join("-");
      if (cardType) {
        // Public objectives omit the stage from the deck tag.
        cardType = cardType.replace("-stage-", "-");

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
        const success: boolean = dstDeck.addCards(card);
        if (!success) {
          console.log("Failed to add card to deck", nsid);
        }
      } else {
        // If the card already exists, destroy it.
        DeletedItemsContainer.destroyWithoutCopying(card);
      }
    });
  }
}
