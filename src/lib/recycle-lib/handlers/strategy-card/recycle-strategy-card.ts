import { GameObject, SnapPoint, Vector } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID, ParsedNSID } from "ttpg-darrell";

export class RecycleStrategyCard extends GarbageHandler {
  private readonly _find: Find = new Find();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("tile.strategy-card:");
  }

  recycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    if (!nsid.startsWith("tile.strategy-card:")) {
      return false;
    }

    const names: Array<string> = [
      "leadership",
      "diplomacy",
      "politics",
      "construction",
      "trade",
      "warfare",
      "technology",
      "imperial",
    ];

    const namesTF: Array<string> = [
      "1-lux",
      "2-noctis",
      "3-tyrannus",
      "4-civitas",
      "5-amicus",
      "6-calamitas",
      "7-magus",
      "8-aeterna",
    ];

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    const nameFirst: string | undefined = parsed?.nameParts[0];
    let strategyCardIndex: number = nameFirst ? names.indexOf(nameFirst) : -1;
    if (strategyCardIndex === -1) {
      strategyCardIndex = nameFirst ? namesTF.indexOf(nameFirst) : -1;
      if (strategyCardIndex === -1) {
        return false; // not a valid strategy card
      }
    }

    const mat: GameObject | undefined = this._find.findGameObject(
      "mat:base/strategy-card"
    );
    if (!mat) {
      return false;
    }

    const snapPoint: SnapPoint | undefined =
      mat.getAllSnapPoints()[strategyCardIndex];
    if (!snapPoint) {
      return false;
    }

    const above: Vector = snapPoint
      .getGlobalPosition()
      .add(new Vector(0, 0, 10));

    const current: Vector = obj.getPosition();
    const dx: number = Math.abs(current.x - above.x);
    const dy: number = Math.abs(current.y - above.y);
    if (dx < 0.1 && dy < 0.1) {
      return true; // already at pos (possibly with tradegoods on top)
    }

    obj.setPosition(above);
    obj.setRotation([0, 0, 0]);
    obj.snapToGround();
    obj.snap();

    return true;
  }
}
