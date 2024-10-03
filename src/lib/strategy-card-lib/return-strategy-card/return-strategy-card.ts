import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";
import { RecycleStrategyCard } from "../../recycle-lib/handlers/strategy-card/recycle-strategy-card";

export class ReturnStrategyCard {
  private readonly _find: Find = new Find();
  private readonly _recycleStrateydCard: RecycleStrategyCard =
    new RecycleStrategyCard();

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
      } else if (nsid.startsWith("tile.strategy-card:")) {
        strategyCards.push(obj);
      }
    }

    for (const obj of strategyCards) {
      const pos: Vector = obj.getPosition();
      const owner: number = this._find.closestOwnedCardHolderOwner(pos);
      if (
        owner !== politicalStabilityOwner &&
        this._recycleStrateydCard.canRecycle(obj)
      ) {
        this._recycleStrateydCard.recycle(obj);
      }
    }
  }
}
