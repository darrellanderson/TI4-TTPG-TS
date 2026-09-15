import { GameObject, Vector } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";

export class UpdatorBenediction implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData) {
    const nsid: string = "token:twilights-fall/benediction";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const benedictionToken: GameObject | undefined = this._find.findGameObject(
      nsid,
      owningPlayerSlot,
      skipContained
    );

    if (benedictionToken) {
      const pos: Vector = benedictionToken.getPosition();
      const owner: number = this._find.closestOwnedCardHolderOwner(pos);
      const colorName: string | undefined =
        TI4.playerColor.getSlotColorName(owner);
      if (colorName) {
        gameData.speaker = colorName;
      }
    }
  }
}
