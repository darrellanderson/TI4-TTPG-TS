import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";

export class UnpackFactionExtras extends AbstractUnpack {
  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack() {
    const faction: Faction = this.getFaction();
    const nsids: Array<string> = faction.getExtras();
    for (const nsid of nsids) {
      const count: number = faction.getExtraCount(nsid);
      // TODO XXX create extra
    }

    // TODO XXX unpack faction extras
  }

  remove() {
    // TODO XXX remove faction extras
  }
}
