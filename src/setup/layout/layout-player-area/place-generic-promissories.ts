import { Card, CardHolder } from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Find, Spawn } from "ttpg-darrell";

export class PlaceGenericPromissories {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  public place(playerSlot: number) {
    const deckNsids: Array<string> = Spawn.getAllNsids().filter(
      (nsid: string) => nsid.startsWith("card.promissory")
    );
    const deck: Card = Spawn.spawnMergeDecksOrThrow(deckNsids);

    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = this._find.findCardHolder(
      "card-holder:base/player-hand",
      playerSlot,
      skipContained
    );
    const colorName: string | undefined =
      TI4.playerColor.getSlotColorName(playerSlot);

    if (cardHolder && colorName) {
      const cardStack: Card | undefined = this._cardUtil.filterCards(
        deck,
        (nsid: string): boolean => {
          return nsid.startsWith(`card.promissory.${colorName}`);
        }
      );

      if (cardStack) {
        const cards: Array<Card> = this._cardUtil.separateDeck(cardStack);
        for (const card of cards) {
          card.setRotation([0, 0, 180]);
          cardHolder.insert(card, cardHolder.getNumCards());
        }
      }

      DeletedItemsContainer.destroyWithoutCopying(deck);
    }
  }
}
