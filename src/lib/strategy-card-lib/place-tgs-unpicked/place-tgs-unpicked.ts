import { GameObject, Rotator, Vector, world } from "@tabletop-playground/api";
import { Atop, NSID } from "ttpg-darrell";

export class PlaceTgsUnpicked {
  _getUnpickedStrategyCards(): Array<GameObject> {
    const strategyCards: Array<GameObject> = [];
    let strategyCardMat: GameObject | undefined = undefined;

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("tile.strategy-card:")) {
        strategyCards.push(obj);
      } else if (nsid === "mat:base/strategy-card") {
        strategyCardMat = obj;
      }
    }

    if (!strategyCardMat) {
      return [];
    }

    const atop: Atop = new Atop(strategyCardMat);
    return strategyCards.filter((strategyCard: GameObject) => {
      const pos: Vector = strategyCard.getPosition();
      return atop.isAtop(pos);
    });
  }

  _placeTradeGood(strategyCard: GameObject): boolean {
    const noiseD = 1;
    const noise = new Vector(
      Math.random() * noiseD * 2 - noiseD,
      Math.random() * noiseD * 2 - noiseD,
      5 // above
    );
    const pos: Vector = strategyCard.getPosition().add(noise);
    const rot: Rotator = new Rotator(0, 0, 180);

    const tradeGood: GameObject | undefined = TI4.spawn.spawn(
      "token:base/tradegood-commodity-1",
      pos,
      rot
    );

    if (tradeGood) {
      tradeGood.snapToGround();
    }
    return tradeGood !== undefined;
  }

  placeTgsUnpicked(): void {
    // Gather relevant objects.
    const strategyCards: Array<GameObject> = this._getUnpickedStrategyCards();
    for (const strategyCard of strategyCards) {
      this._placeTradeGood(strategyCard);
    }
  }
}
