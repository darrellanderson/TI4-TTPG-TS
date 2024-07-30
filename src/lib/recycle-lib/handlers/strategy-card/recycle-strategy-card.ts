import { GameObject, SnapPoint, Vector } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID, ParsedNSID } from "ttpg-darrell";

export class RecycleStrategyCard extends GarbageHandler {
  private readonly _find: Find = new Find();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("tile.strategy:");
  }

  recycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    if (!nsid.startsWith("tile.strategy:")) {
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

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    const nameFirst: string | undefined = parsed?.nameParts[0];
    const strategyCardIndex: number = nameFirst ? names.indexOf(nameFirst) : -1;
    if (strategyCardIndex === -1) {
      return false; // not a valid strategy card
    }

    const mat: GameObject | undefined =
      this._find.findGameObject("mat:base/strategy");
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

    obj.setPosition(above);
    obj.snapToGround();
    obj.snap();

    return true;
  }
}
