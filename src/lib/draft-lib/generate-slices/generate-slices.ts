import { Hex, HexType, Shuffle } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import {
  SystemTier,
  SystemTierType,
} from "../../system-lib/system/system-tier";

export class GenerateSlices {
  private readonly _count: number;
  private readonly _sliceShape: Array<HexType>;

  constructor(count: number, sliceShape: Array<HexType>) {
    this._count = count;
    this._sliceShape = [...sliceShape];
  }

  generateSlices() {
    // Implementation
  }

  _getTierToShuffledSystems(): Map<SystemTierType, Array<System>> {
    const tierToSystems = new Map<SystemTierType, Array<System>>();
    tierToSystems.set("high", []);
    tierToSystems.set("med", []);
    tierToSystems.set("low", []);
    tierToSystems.set("red", []);

    let systems: Array<System> =
      TI4.systemRegistry.getAllDraftableSystemsFilteredByConfigSources();
    systems = new Shuffle<System>().shuffle(systems);

    const systemTier = new SystemTier();
    for (const system of systems) {
      const tier = systemTier.getTier(system);
      const entries: Array<System> | undefined = tierToSystems.get(tier);
      if (entries) {
        entries.push(system);
      }
    }
    return tierToSystems;
  }

  _hasAdjacentAnomalies(slice: Array<number>): boolean {
    // Slice shape includes home system as first entry.
    if (this._sliceShape.length !== slice.length + 1) {
      throw new Error(
        `slice shape (${this._sliceShape.length}) and slice length (${slice.length}) mismatch`
      );
    }

    const hexIsAnomalySet: Set<HexType> = new Set();
    for (let i = 0; i < slice.length; i++) {
      const hex: HexType | undefined = this._sliceShape[i + 1]; // first is home system
      const tileNumber: number | undefined = slice[i];
      if (hex && tileNumber !== undefined) {
        const system: System | undefined =
          TI4.systemRegistry.getBySystemTileNumber(tileNumber);
        if (system && system.getAnomalies().length > 0) {
          hexIsAnomalySet.add(hex);
        }
      }
    }
    for (const hex of this._sliceShape) {
      if (!hexIsAnomalySet.has(hex)) {
        continue;
      }
      for (const adj of Hex.neighbors(hex)) {
        if (hexIsAnomalySet.has(adj)) {
          return true;
        }
      }
    }
    return false;
  }
}
