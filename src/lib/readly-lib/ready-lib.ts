import { Card, world } from "@tabletop-playground/api";
import { Facing, NSID } from "ttpg-darrell";

export class ReadyLib {
  private readonly _readyNsidPrefixes: Array<string> = [
    "unit:",
    "card.planet:",
    "card.leader.agent",
    "card.legendary-planet:",
    "card.relic:",
    "card.technology",
  ];

  readyAll() {
    const skipContained = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);

      if (obj.isHeld()) {
        continue;
      }

      if (obj instanceof Card && (obj.isInHolder() || obj.getStackSize() > 1)) {
        continue;
      }

      if (Facing.isFaceUp(obj)) {
        continue;
      }

      for (const prefix of this._readyNsidPrefixes) {
        if (nsid.startsWith(prefix)) {
          obj.flipOrUpright();
        }
      }
    }
  }
}
