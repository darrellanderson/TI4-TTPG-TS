import { Card, Vector, world } from "@tabletop-playground/api";
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
  public refresh(alsoRefreshTechAgentRelic: boolean) {
    const systemHexes: Set<HexType> = this._getSystemHexes();

    const startsWithEntries: Array<string> = [
      "card.planet",
      "card.legendary-planet",
    ];
    if (alsoRefreshTechAgentRelic) {
      startsWithEntries.push("card.technology.");
      startsWithEntries.push("card.leader.agent:");
      startsWithEntries.push("card.relic:");
    }

    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (obj instanceof Card) {
        const nsid: string = NSID.get(obj);

        let shouldRefresh: boolean = false;
        for (const startsWith of startsWithEntries) {
          if (nsid.startsWith(startsWith)) {
            shouldRefresh = true;
            break;
          }
        }

        if (
          shouldRefresh &&
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
}
