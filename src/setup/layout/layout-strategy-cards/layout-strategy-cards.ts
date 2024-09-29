import {
  GameObject,
  ObjectType,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutStrategyCards {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const mat: GameObject = Spawn.spawnOrThrow("mat:base/strategy-card");
    mat.setRotation([0, -90, 0]); // mat model is rotated

    const strategyCardNsids: Array<string> = [
      "tile.strategy-card:base/leadership",
      "tile.strategy-card:codex.ordinian/diplomacy",
      "tile.strategy-card:base/politics",
      "tile.strategy-card:pok/construction",
      "tile.strategy-card:base/trade",
      "tile.strategy-card:base/warfare",
      "tile.strategy-card:base/technology",
      "tile.strategy-card:base/imperial",
    ];
    const strategyCards: Array<GameObject> = strategyCardNsids.map((nsid) => {
      return Spawn.spawnOrThrow(nsid);
    });

    this._layout.add(mat);

    this._layout.addAfterLayout(() => {
      mat.setObjectType(ObjectType.Ground);

      const snapPoints: Array<SnapPoint> = mat.getAllSnapPoints();
      strategyCards.forEach((strategyCard, index) => {
        const snapPoint: SnapPoint | undefined = snapPoints[index];
        this._placeStrategyCard(strategyCard, snapPoint);
      });
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }

  _placeStrategyCard(
    strategyCard: GameObject,
    snapPoint: SnapPoint | undefined,
  ) {
    if (snapPoint) {
      const above: Vector = snapPoint
        .getGlobalPosition()
        .add(new Vector(0, 0, 1));
      strategyCard.setPosition(above);
      strategyCard.snapToGround();
      strategyCard.snap();
    }
  }
}
