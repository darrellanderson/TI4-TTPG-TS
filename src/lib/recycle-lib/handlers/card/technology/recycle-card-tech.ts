import { Card, GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";

export class RecycleCardTech extends GarbageHandler {
  private readonly _find: Find = new Find();

  constructor() {
    super();
  }

  canRecycle(obj: GameObject): boolean {
    return obj instanceof Card && NSID.get(obj).startsWith("card.technology");
  }

  recycle(card: GameObject): boolean {
    if (card instanceof Card) {
      // Per-player tech deck mat.
      const deckTag: string = "deck-tech";
      const discardTag = undefined;
      const shuffleDiscard = undefined;
      const playerSlot: number = card.getOwningPlayerSlot();
      const deck: Card | undefined = this._find.findDeckOrDiscard(
        deckTag,
        discardTag,
        shuffleDiscard,
        playerSlot,
      );
      if (deck) {
        return deck.addCards(card);
      }
    }
    return false;
  }
}
