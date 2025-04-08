import { CardUtil, NSID } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { Card, world } from "@tabletop-playground/api";

export class UpdatorLaws implements IGameDataUpdator {
  private readonly _cardUtil: CardUtil = new CardUtil();

  update(gameData: GameData): void {
    const laws: Array<string> = [];

    const skipContained: boolean = true;
    const allowFaceDown: boolean = false;
    const rejectSnapPointTags: Array<string> = [
      "discard-agenda",
      "active-agenda",
    ];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("card.agenda") &&
        obj instanceof Card &&
        this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
      ) {
        const cardName: string = obj.getCardDetails().name;
        laws.push(cardName);
      }
    }

    gameData.laws = laws;
  }
}
