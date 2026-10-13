import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

export class UnpackCustom extends AbstractUnpack {
  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack() {
    const faction: Faction = this.getFaction();
    const playerSlot: number = this.getPlayerSlot();
    const customUnpackFaction: ((playerSlot: number) => void) | undefined =
      faction.params.customFactionUnpack;
    if (customUnpackFaction) {
      customUnpackFaction(playerSlot);
    }
  }

  remove() {
    const faction: Faction = this.getFaction();
    const playerSlot: number = this.getPlayerSlot();
    const customRemoveFaction: ((playerSlot: number) => void) | undefined =
      faction.params.customFactionRemove;
    if (customRemoveFaction) {
      customRemoveFaction(playerSlot);
    }
  }
}
