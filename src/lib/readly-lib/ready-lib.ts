import { Card, world } from "@tabletop-playground/api";
import { CardUtil, Facing, NSID } from "ttpg-darrell";

export class ReadyLib {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _readyNsidPrefixes: Array<string> = [
    "card.leader.agent",
    "card.legendary-planet:",
    "card.planet:",
    "card.relic:",
    "card.technology",
    "unit:",
  ];

  readyAll() {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);

      if (Facing.isFaceUp(obj)) {
        continue; // already face up
      }

      if (obj.isHeld()) {
        continue; // held
      }

      if (obj instanceof Card) {
        const rejectSnapPointTags: Array<string> = [];
        if (nsid.startsWith("card.legendary-planet:")) {
          rejectSnapPointTags[0] = "deck-legendary-planet";
        } else if (nsid.startsWith("card.planet:")) {
          rejectSnapPointTags[0] = "deck-planet";
        } else if (nsid.startsWith("card.relic:")) {
          rejectSnapPointTags[0] = "deck-relic";
        }

        const allowFaceDown: boolean = true;
        const isLooseCard: boolean = this._cardUtil.isLooseCard(
          obj,
          allowFaceDown,
          rejectSnapPointTags
        );
        if (!isLooseCard || obj.getStackSize() > 1) {
          continue; // in deck location and/or has multiple cards
        }
      }

      for (const prefix of this._readyNsidPrefixes) {
        if (nsid.startsWith(prefix)) {
          obj.flipOrUpright();
        }
      }
    }
  }
}
