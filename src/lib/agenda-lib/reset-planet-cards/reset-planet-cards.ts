import { Card, GameObject, world } from "@tabletop-playground/api";
import { CardUtil, Facing, HexType, NSID } from "ttpg-darrell";
import { Vector } from "ttpg-mock";

export class ResetPlanetCards {
  private readonly _cardUtil: CardUtil = new CardUtil();

  reset(): void {
    // Planet cards on system hexes remain.
    const systemHexes: Set<HexType> = new Set();
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs()) {
      const obj: GameObject = system.getObj();
      if (!obj.getContainer()) {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        systemHexes.add(hex);
      }
    }

    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const isCandidate: boolean =
        nsid.startsWith("card.planet:") ||
        nsid.startsWith("card.legendary-planet:");
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);

      if (
        obj instanceof Card &&
        isCandidate &&
        this._cardUtil.isLooseCard(obj, allowFaceDown) &&
        !Facing.isFaceUp(obj) &&
        !systemHexes.has(hex)
      ) {
        obj.flipOrUpright();
      }
    }
  }
}
