import { Hex, HexType, Shuffle } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import {
  SystemTier,
  SystemTierType,
} from "../../system-lib/system/system-tier";

export type Slice = Array<number>;

export type GenerateSlicesParams = {
  sliceCount: number;
  sliceShape: Array<HexType>;
  minWormholes?: number;
  minLegendary?: number;
};

export class GenerateSlices {
  private readonly _params: GenerateSlicesParams;

  constructor(params: GenerateSlicesParams) {
    this._params = Object.freeze(params);
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

    // Move minimum required systems to the front of the list.
    if (this._params.minWormholes) {
      const promoteSystems: Array<System> = systems.filter(
        (system) => system.getWormholes().length > 0
      );
      for (let i = 0; i < this._params.minWormholes; i++) {
        const promoteSystem: System | undefined = promoteSystems.shift();
        if (promoteSystem) {
          const index: number = systems.indexOf(promoteSystem);
          systems.splice(index, 1);
          systems.unshift(promoteSystem);
        }
      }
    }
    if (this._params.minLegendary) {
      const promoteSystems: Array<System> = systems.filter((system) =>
        system.isLegendary()
      );
      for (let i = 0; i < this._params.minLegendary; i++) {
        const promoteSystem: System | undefined = promoteSystems.shift();
        if (promoteSystem) {
          const index: number = systems.indexOf(promoteSystem);
          systems.splice(index, 1);
          systems.unshift(promoteSystem);
        }
      }
    }

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

  _hasAdjacentAnomalies(slice: Slice): boolean {
    // Slice shape includes home system as first entry.
    if (this._params.sliceShape.length !== slice.length + 1) {
      throw new Error(
        `slice shape (${this._params.sliceShape.length}) and slice length (${slice.length}) mismatch`
      );
    }

    const hexIsAnomalySet: Set<HexType> = new Set();
    for (let i = 0; i < slice.length; i++) {
      const hex: HexType | undefined = this._params.sliceShape[i + 1]; // first is home system
      const tileNumber: number | undefined = slice[i];
      if (hex && tileNumber !== undefined) {
        const system: System | undefined =
          TI4.systemRegistry.getBySystemTileNumber(tileNumber);
        if (system && system.getAnomalies().length > 0) {
          hexIsAnomalySet.add(hex);
        }
      }
    }
    for (const hex of this._params.sliceShape) {
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

  _separateAnomalies(slice: Slice, tryShuffleFirst: boolean = true): Slice {
    // Slice shape includes home system as first entry.
    if (this._params.sliceShape.length !== slice.length + 1) {
      throw new Error(
        `slice shape (${this._params.sliceShape.length}) and slice length (${slice.length}) mismatch`
      );
    }

    slice = [...slice]; // work with a copy

    // First, shuffle a few times and see if we get a good setup.
    // Give up after a reasonable number of tries.
    if (tryShuffleFirst) {
      const shuffle: Shuffle<number> = new Shuffle<number>();
      for (let i = 0; i < 20; i++) {
        if (!this._hasAdjacentAnomalies(slice)) {
          return slice;
        }
        slice = shuffle.shuffle(slice);
      }
    }

    // No luck.  Walk through slice permutations and use the first good one.
    // (This always fixes the same way, hence a few random stabs before this.)
    const inspector = (candidate: Slice): boolean => {
      return !this._hasAdjacentAnomalies(candidate);
    };
    const goodSlice = this._permutator(slice, inspector);
    if (goodSlice) {
      slice = goodSlice;
    }

    return slice;
  }

  _permutator(
    array: Array<number>,
    inspector: (candidate: Slice) => boolean
  ): Array<number> | undefined {
    // https://stackoverflow.com/questions/9960908/permutations-in-javascript
    let result: Array<number> | undefined = undefined;
    const permute = (arr: Slice, m: Array<number> = []) => {
      if (arr.length === 0) {
        const success = inspector(m);
        if (success) {
          result = m;
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr: Array<number> = arr.slice();
          const next: Array<number> = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
          // Stop after first success.
          if (result) {
            break;
          }
        }
      }
    };
    permute(array);
    return result;
  }
}
