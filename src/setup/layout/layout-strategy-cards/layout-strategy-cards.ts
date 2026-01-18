import {
  GameObject,
  ObjectType,
  SnapPoint,
  Vector,
} from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

export class LayoutStrategyCards {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const mat: GameObject = TI4.spawn.spawnOrThrow("mat:base/strategy-card");
    mat.setRotation([0, -90, 0]); // mat model is rotated

    const strategyCardNsids: Array<string> = [
      "tile.strategy-card:base/leadership",
      "tile.strategy-card:base/diplomacy",
      "tile.strategy-card:base/politics",
      "tile.strategy-card:base/construction",
      "tile.strategy-card:base/trade",
      "tile.strategy-card:base/warfare",
      "tile.strategy-card:base/technology",
      "tile.strategy-card:base/imperial",
    ];
    const strategyCards: Array<GameObject> = strategyCardNsids.map((nsid) => {
      return TI4.spawn.spawnOrThrow(nsid);
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
    snapPoint: SnapPoint | undefined
  ) {
    if (snapPoint) {
      const above: Vector = snapPoint
        .getGlobalPosition()
        .add(new Vector(0, 0, 10));
      strategyCard.setPosition(above);
      strategyCard.snapToGround();
      strategyCard.snap();
    }
  }
}
