import { Card, CardHolder, GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";

import { Faction } from "../../faction-lib/faction/faction";

export class RecycleCardPromissory extends GarbageHandler {
  private readonly _find: Find = new Find();

  constructor() {
    super();
  }

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return obj instanceof Card && nsid.startsWith("card.promissory:");
  }

  recycle(obj: GameObject): boolean {
    if (!(obj instanceof Card)) {
      return false;
    }
    const nsid: string = NSID.get(obj);

    const playerSlotToFaction: Map<number, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();
    for (const [playerSlot, faction] of playerSlotToFaction) {
      for (const factionPromissoryNsid of faction.getPromissoryNsids()) {
        // Card may be ".omega" or some such, so check if prefix.
        if (nsid.startsWith(factionPromissoryNsid)) {
          return this._sendToCardHolder(obj, playerSlot);
        }
      }
    }
    return false;
  }

  _sendToCardHolder(card: Card, playerSlot: number): boolean {
    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = this._find.findCardHolderBySlot(
      playerSlot,
      skipContained
    );
    if (cardHolder) {
      return cardHolder.insert(card, 0);
    }
    return false;
  }
}
