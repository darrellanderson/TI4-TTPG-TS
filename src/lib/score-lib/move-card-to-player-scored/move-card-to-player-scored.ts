import { Card, CardHolder } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class MoveCardToPlayerScored {
  _getPlayerScoringCardHolder(playerSlot: number): CardHolder | undefined {
    const nsid: string = `card-holder:base/player-scoring`;
    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = new Find().findCardHolder(
      nsid,
      playerSlot,
      skipContained
    );
    return cardHolder;
  }

  moveCard(card: Card, playerSlot: number): boolean {
    const cardHolder: CardHolder | undefined =
      this._getPlayerScoringCardHolder(playerSlot);
    if (cardHolder) {
      const length: number = cardHolder.getCards().length;
      cardHolder.insert(card, length);
      return true;
    }
    return false;
  }
}
