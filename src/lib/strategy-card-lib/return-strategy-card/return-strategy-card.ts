import { GameObject, SnapPoint, Vector, world } from "@tabletop-playground/api";
import { Find, NSID, ParsedNSID } from "ttpg-darrell";

export class ReturnStrategyCard {
  private readonly _find: Find = new Find();

  returnOneStrategyCard(obj: GameObject): boolean {
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

  returnAllStrategyCardsRespecingPoliticalStability(): void {
    // If a player has "political stability" they keep their strategy card.
    const strategyCards: Array<GameObject> = [];
    let politicalStabilityOwner: number = -1;
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "card.action:base/political-stability") {
        const pos: Vector = obj.getPosition();
        politicalStabilityOwner = this._find.closestOwnedCardHolderOwner(pos);
      } else if (nsid.startsWith("tile.strategy:")) {
        strategyCards.push(obj);
      }
    }

    for (const obj of strategyCards) {
      const pos: Vector = obj.getPosition();
      const owner: number = this._find.closestOwnedCardHolderOwner(pos);
      if (owner !== politicalStabilityOwner) {
        this.returnOneStrategyCard(obj);
      }
    }
  }
}
