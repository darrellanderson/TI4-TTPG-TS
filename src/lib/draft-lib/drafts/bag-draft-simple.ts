import { Shuffle } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import { SystemTier } from "../../system-lib/system/system-tier";
import { SliceTiles } from "../generate-slices/generate-slices";
import { BagDraft } from "./bag-draft";

/**
 * Bag draft just pick 2 red 3 blue system tiles.
 */
export class BagDraftSimple extends BagDraft {
  _getSlices(): Array<SliceTiles> {
    const systems: Array<System> = TI4.systemRegistry
      .getAllSystemsWithObjs()
      .filter((system: System): boolean => {
        return !system.isExcludeFromDraft();
      });

    const systemTier: SystemTier = new SystemTier();
    const red: Array<System> = systems.filter((system: System): boolean => {
      return systemTier.getTier(system) === "red";
    });
    const blue: Array<System> = systems.filter((system: System): boolean => {
      return systemTier.getTier(system) !== "red";
    });

    new Shuffle<System>().shuffle(red);
    new Shuffle<System>().shuffle(blue);

    const result: Array<SliceTiles> = [];

    for (let i = 0; i < TI4.config.playerCount; i++) {
      const sliceTiles: SliceTiles = [
        blue.pop()!.getSystemTileNumber(),
        blue.pop()!.getSystemTileNumber(),
        blue.pop()!.getSystemTileNumber(),
        red.pop()!.getSystemTileNumber(),
        red.pop()!.getSystemTileNumber(),
      ];
      result.push(sliceTiles);
    }

    return result;
  }
}
