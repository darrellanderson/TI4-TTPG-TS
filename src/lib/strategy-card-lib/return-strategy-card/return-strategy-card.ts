import { GameObject, SnapPoint, Vector } from "@tabletop-playground/api";
import { Find, NSID, ParsedNSID } from "ttpg-darrell";

export class ReturnStrategyCard {
  private readonly _find: Find = new Find();

  returnStrategyCard(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    if (!nsid.startsWith("tile.strategy:")) {
      return false;
    }

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      return false;
    }
    const nameFirst: string | undefined = parsed.nameParts[0];
    if (!nameFirst) {
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
    const strategyCardIndex: number = names.indexOf(nameFirst);
    if (strategyCardIndex === -1) {
      return false;
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
