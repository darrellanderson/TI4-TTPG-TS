import { Vector, world } from "@tabletop-playground/api";
import { CardUtil, Facing, HexType, NSID } from "ttpg-darrell";

export class RefreshAllPlanets {
  private readonly _cardUtil: CardUtil = new CardUtil();

  _getSystemHexes(): Set<HexType> {
    const hexes: Set<HexType> = new Set();

    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      hexes.add(hex);
    }
    return hexes;
  }

  /**
   * Refresh all planet cards that are not on a system hex or in a card holder.
   */
  public refresh() {
    const systemHexes: Set<HexType> = this._getSystemHexes();

    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        (nsid.startsWith("card.planet") ||
          nsid.startsWith("card.legendary-planet")) &&
        this._cardUtil.isLooseCard(obj, allowFaceDown) &&
        !Facing.isFaceUp(obj)
      ) {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        if (!systemHexes.has(hex)) {
          obj.flipOrUpright();
        }
      }
    }
  }
}
