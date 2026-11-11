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
      // These are generally homebrew scripts, catch (but report!) any errors
      // so the full unpack process can complete if this step fails.
      try {
        customUnpackFaction(playerSlot);
      } catch (error) {
        console.error(`UnpackCustom (${faction.getAbbr()}) error:`, error);
      }
    }
  }

  remove() {
    const faction: Faction = this.getFaction();
    const playerSlot: number = this.getPlayerSlot();
    const customRemoveFaction: ((playerSlot: number) => void) | undefined =
      faction.params.customFactionRemove;
    if (customRemoveFaction) {
      // These are generally homebrew scripts, catch (but report!) any errors
      // so the full remove process can complete if this step fails.
      try {
        customRemoveFaction(playerSlot);
      } catch (error) {
        console.error(`UnpackCustom (${faction.getAbbr()}) error:`, error);
      }
    }
  }
}
