import { GameObject, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorSpeaker implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData) {
    const nsid: string = "token:base/speaker";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const speakerToken: GameObject | undefined = this._find.findGameObject(
      nsid,
      owningPlayerSlot,
      skipContained
    );

    if (speakerToken) {
      const pos: Vector = speakerToken.getPosition();
      const owner: number = this._find.closestOwnedCardHolderOwner(pos);
      const colorName: string | undefined =
        TI4.playerColor.getSlotColorName(owner);
      if (colorName) {
        gameData.speaker = colorName;
      }
    }
  }
}
