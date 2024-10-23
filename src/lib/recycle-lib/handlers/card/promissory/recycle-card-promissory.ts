import { Card, GameObject } from "@tabletop-playground/api";
import { CardUtil, GarbageHandler, NSID } from "ttpg-darrell";

import { Faction } from "../../../../faction-lib/faction/faction";

export class RecycleCardPromissory extends GarbageHandler {
  private readonly _cardUtil: CardUtil = new CardUtil();

  constructor() {
    super();
  }

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return obj instanceof Card && nsid.startsWith("card.promissory");
  }

  recycle(obj: GameObject): boolean {
    if (obj instanceof Card) {
      const nsid: string = NSID.get(obj);

      // Generic promissory are "card.promissory.<color>:" prefixed.
      const genericPrefix: string = "card.promissory.";
      if (nsid.startsWith(genericPrefix)) {
        const colorName: string | undefined = nsid
          .substring(genericPrefix.length)
          .split(":")[0];
        if (colorName) {
          const playerSlots: Array<number> = TI4.playerSeats
            .getAllSeats()
            .map((seat) => seat.playerSlot);
          for (const playerSlot of playerSlots) {
            const seatColorName: string | undefined =
              TI4.playerColor.getSlotColorName(playerSlot);
            if (colorName === seatColorName) {
              return this._cardUtil.dealToHolder(obj, playerSlot);
            }
          }
        }
      }

      // Faction promissory.
      const playerSlotToFaction: Map<number, Faction> =
        TI4.factionRegistry.getPlayerSlotToFaction();
      for (const [playerSlot, faction] of playerSlotToFaction) {
        for (const factionPromissoryNsid of faction.getPromissoryNsids()) {
          // Card may be ".omega" or some such, so check if prefix.
          if (nsid.startsWith(factionPromissoryNsid)) {
            return this._cardUtil.dealToHolder(obj, playerSlot);
          }
        }
      }
    }
    return false;
  }
}
