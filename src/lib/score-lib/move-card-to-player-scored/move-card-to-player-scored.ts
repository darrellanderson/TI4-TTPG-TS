import { Card, CardHolder, world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

export class MoveCardToPlayerScored {
  _getPlayerScoringCardHolder(playerSlot: number): CardHolder | undefined {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (obj instanceof CardHolder) {
        const nsid: string = NSID.get(obj);
        if (nsid === "card-holder:base/player-scoring") {
          const ownerStr: string = obj.getSavedData("owner");
          const owner: number = parseInt(ownerStr);
          if (owner === playerSlot) {
            return obj;
          }
        }
      }
    }
  }

  moveCard(card: Card, playerSlot: number): boolean {
    const cardHolder: CardHolder | undefined =
      this._getPlayerScoringCardHolder(playerSlot);
    if (cardHolder) {
      cardHolder.insert(card, 0);
      return true;
    }
    return false;
  }
}
