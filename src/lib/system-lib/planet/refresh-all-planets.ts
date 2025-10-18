import { Card, Vector, world } from "@tabletop-playground/api";
import {
  CardUtil,
  Facing,
  GarbageContainer,
  HexType,
  NSID,
} from "ttpg-darrell";

const ALSO_REFRESH_NSIDS: Set<string> = new Set([
  "card.breakthrough:thunders-edge/deorbit-barrage",
  "card.breakthrough:thunders-edge/psychospore",
  "card.breakthrough:thunders-edge/resonance-generator",
  "card.breakthrough:thunders-edge/vaults-of-the-heir",
  "card.breakthrough:thunders-edge/visionaria-select",
]);

const ALSO_RECYCLE_NSIDS: Set<string> = new Set([
  "token.attachment.system:thunders-edge/crimson-sever",
  "card.promissory:thunders-edge/sever",
]);

const DO_NOT_REFRESH_NSIDS: Set<string> = new Set([
  "card.technology.green:thunders-edge/neural-parasite",
  "card.technology.yellow:thunders-edge/planesplitter",
]);

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
  public refresh(alsoRefreshTechAgentRelicUnit: boolean) {
    const systemHexes: Set<HexType> = this._getSystemHexes();

    const startsWithEntries: Array<string> = [
      "card.planet",
      "card.legendary-planet",
      "card.deepwrought-ocean:",
    ];
    if (alsoRefreshTechAgentRelicUnit) {
      startsWithEntries.push("card.leader.agent:");
      startsWithEntries.push("card.relic:");
      startsWithEntries.push("card.technology.");
      startsWithEntries.push("unit:");
    }

    const skipContained: boolean = true;
    const allowFaceDown: boolean = true;
    const rejectSnapPointTags: Array<string> = [
      "deck-legendary-planet",
      "deck-planet",
      "deck-relic",
    ];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      let shouldRefresh: boolean = false;
      if (alsoRefreshTechAgentRelicUnit) {
        shouldRefresh = ALSO_REFRESH_NSIDS.has(nsid);
      }
      for (const startsWith of startsWithEntries) {
        if (nsid.startsWith(startsWith)) {
          shouldRefresh = true;
          break;
        }
      }

      if (DO_NOT_REFRESH_NSIDS.has(nsid)) {
        shouldRefresh = false;
      }

      if (shouldRefresh && !Facing.isFaceUp(obj)) {
        if (obj instanceof Card) {
          if (
            shouldRefresh &&
            this._cardUtil.isLooseCard(
              obj,
              allowFaceDown,
              rejectSnapPointTags
            ) &&
            !Facing.isFaceUp(obj)
          ) {
            const pos: Vector = obj.getPosition();
            const hex: HexType = TI4.hex.fromPosition(pos);
            if (!systemHexes.has(hex)) {
              obj.flipOrUpright();
            }
          }
        } else {
          // Not a card, but should refresh and face down.
          // This happens for units even when on system tiles.
          obj.flipOrUpright();
        }
      }

      if (alsoRefreshTechAgentRelicUnit && ALSO_RECYCLE_NSIDS.has(nsid)) {
        GarbageContainer.tryRecycle(obj, undefined);
      }
    }
  }
}
