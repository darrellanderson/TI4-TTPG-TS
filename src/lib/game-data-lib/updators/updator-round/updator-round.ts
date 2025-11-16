import { Find, NSID } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GameObject, SnapPoint } from "@tabletop-playground/api";

export class UpdatorRound implements IGameDataUpdator {
  private readonly _find: Find = new Find();

  update(gameData: GameData): void {
    const owningPlaayerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const mat1: GameObject | undefined = this._find.findGameObject(
      "mat:base/objective-1",
      owningPlaayerSlot,
      skipContained
    );
    const mat2: GameObject | undefined = this._find.findGameObject(
      "mat:base/objective-2",
      owningPlaayerSlot,
      skipContained
    );
    const mats: Array<GameObject> = [mat1, mat2].filter((m) => m !== undefined);

    const snapPoints: Array<SnapPoint> = [];
    mats.forEach((mat: GameObject): void => {
      mat.getAllSnapPoints().forEach((snapPoint: SnapPoint): void => {
        const tags: Array<string> = snapPoint.getTags();
        if (
          (tags.includes("card-objective-1") &&
            !tags.includes("deck-objective-1") &&
            !tags.includes("snap-extra")) ||
          (tags.includes("card-objective-2") &&
            !tags.includes("deck-objective-2") &&
            !tags.includes("snap-extra"))
        ) {
          snapPoints.push(snapPoint);
        }
      });
    });

    let round: number = -1;
    snapPoints.forEach((snapPoint: SnapPoint): void => {
      const obj: GameObject | undefined = snapPoint.getSnappedObject();
      if (obj) {
        const nsid: string = NSID.get(obj);
        if (nsid.startsWith("card.objective.")) {
          round += 1;
        }
      }
    });

    gameData.round = Math.max(round, 0);
  }
}
