import { Hex, HexType, Shuffle } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import {
  SystemTier,
  SystemTierType,
} from "../../system-lib/system/system-tier";

export type Slice = Array<number>;

export type GenerateSlicesParams = {
  sliceCount: number;
  sliceMakeup: ReadonlyArray<SystemTierType>;
  sliceShape: ReadonlyArray<HexType>;
  minAlphaWormholes?: number;
  minBetaWormholes?: number;
  minLegendary?: number;
};

export type TierToSystems = Map<SystemTierType, Array<System>>;

export class SliceInProgress {
  private readonly _size: number;
  private readonly _remainingMakeup: Array<SystemTierType>;
  private readonly _systems: Array<System> = [];

  constructor(makeup: ReadonlyArray<SystemTierType>) {
    this._size = makeup.length;
    this._remainingMakeup = new Shuffle<SystemTierType>().shuffle([...makeup]);
  }

  addSystemOrThrow(system: System) {
    const tier: SystemTierType = new SystemTier().getTier(system);
    const index: number = this._remainingMakeup.indexOf(tier);
    if (index === -1) {
      throw new Error(`system tier (${tier}) not in remaining makeup`);
    }
    this._remainingMakeup.splice(index, 1);
    this._systems.push(system);
    if (this._systems.length > this._size) {
      throw new Error("too many systems added");
    }
  }

  canAdd(system: System): boolean {
    const tier: SystemTierType = new SystemTier().getTier(system);
    return (
      this._remainingMakeup.includes(tier) && this._systems.length < this._size
    );
  }

  getRemainingMakeup(): Array<SystemTierType> {
    return this._remainingMakeup;
  }

  getSystems(): Array<System> {
    return this._systems;
  }
}

export class GenerateSlices {
  private readonly _params: GenerateSlicesParams;
  private readonly _slicesInProgress: Array<SliceInProgress> = [];

  constructor(params: GenerateSlicesParams) {
    this._params = Object.freeze(params);

    for (let i = 0; i < this._params.sliceCount; i++) {
      this._slicesInProgress.push(
        new SliceInProgress(this._params.sliceMakeup)
      );
    }
  }

  generateSlices() {
    // Implementation
  }

  _getShuffledSystems(): Array<System> {
    let systems: Array<System> =
      TI4.systemRegistry.getAllDraftableSystemsFilteredByConfigSources();
    systems = new Shuffle<System>().shuffle(systems);
    return systems;
  }

  _getTierToSystems(systems: Array<System>): TierToSystems {
    const tierToSystems: TierToSystems = new Map<
      SystemTierType,
      Array<System>
    >();
    tierToSystems.set("high", []);
    tierToSystems.set("med", []);
    tierToSystems.set("low", []);
    tierToSystems.set("red", []);

    // Split systems into tiers.
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

  /**
   * Promote wormholes and legendaries according to params.
   * Return them in a tier-to-systems map, also removing them
   * from the input systems array.
   *
   * @param systems
   */
  _promoteWormholesAndLegendaries(systems: Array<System>): TierToSystems {
    // Move candidates from input systems to promoted.
    let count: number;
    let promoteCandidates: Array<System>;
    const promoted: Array<System> = [];
    const doPromotion = () => {
      for (let i = 0; i < count; i++) {
        const system = promoteCandidates.shift();
        if (system) {
          const index = systems.indexOf(system);
          if (index !== -1) {
            systems.splice(index, 1);
            promoted.push(system);
          }
        }
      }
    };

    count = this._params.minAlphaWormholes || 0;
    promoteCandidates = systems.filter((system) =>
      system.getWormholes().includes("alpha")
    );
    doPromotion();

    count = this._params.minBetaWormholes || 0;
    promoteCandidates = systems.filter((system) =>
      system.getWormholes().includes("beta")
    );
    doPromotion();

    count = this._params.minLegendary || 0;
    promoteCandidates = systems.filter((system) => system.isLegendary());
    doPromotion();

    return this._getTierToSystems(promoted);
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
