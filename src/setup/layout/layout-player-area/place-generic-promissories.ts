import { Card, CardHolder } from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Find } from "ttpg-darrell";

export class PlaceGenericPromissories {
  private readonly _playerSlot: number;

  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor(playerSlot: number) {
    this._playerSlot = playerSlot;
  }

  public place() {
    const cardHolder: CardHolder | undefined = this._getCardHolder();
    const colorName: string | undefined = this._getColorName();
    const deck: Card = this._getPromissoryDeck();

    if (cardHolder && colorName) {
      const cards: Array<Card> = this._getGenericPromissoryCards(
        deck,
        colorName
      );
      this._placeCards(cardHolder, cards);
    }

    DeletedItemsContainer.destroyWithoutCopying(deck);
  }

  _getCardHolder(): CardHolder | undefined {
    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = this._find.findCardHolder(
      "card-holder:base/player-hand",
      this._playerSlot,
      skipContained
    );
    return cardHolder;
  }

  _getColorName(): string | undefined {
    const colorName: string | undefined = TI4.playerColor.getSlotColorName(
      this._playerSlot
    );
    return colorName;
  }

  _getPromissoryDeck(): Card {
    const deck: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.promissory");
    return deck;
  }

  _getGenericPromissoryCards(deck: Card, colorName: string): Array<Card> {
    const result: Array<Card> = [];
    const cardStack: Card | undefined = this._cardUtil.filterCards(
      deck,
      (nsid: string): boolean => {
        return nsid.startsWith(`card.promissory.${colorName}`);
      }
    );
    if (cardStack) {
      const cards: Array<Card> = this._cardUtil.separateDeck(cardStack);
      result.push(...cards);
    }
    return result;
  }

  _placeCards(cardHolder: CardHolder, cards: Array<Card>) {
    for (const card of cards) {
      card.setRotation([0, 0, 180]);
      cardHolder.insert(card, cardHolder.getNumCards());
    }
  }
}
