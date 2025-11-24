import { Card, CardDetails, world } from "@tabletop-playground/api";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { CardUtil, NSID } from "ttpg-darrell";

export class UpdatorGalacticEvents implements IGameDataUpdator {
  update(gameData: GameData): void {
    gameData.galacticEvents = [];

    const cardUtil: CardUtil = new CardUtil();
    const skipContained: boolean = true;
    const allowFaceDown: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("card.event:") &&
        obj instanceof Card &&
        cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        const cardDetails: CardDetails = obj.getCardDetails();
        const name: string = cardDetails.name;
        if (name.length > 0) {
          gameData.galacticEvents.push(name);
        }
      }
    }
  }
}
