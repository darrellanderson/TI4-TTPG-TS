import {
  Hex,
  HexType,
  Shuffle,
  WeightedChoice,
  WeightedChoiceOption,
} from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import {
  SystemSummary,
  SystemSummaryType,
} from "../../system-lib/system/system-summary";

import {
  SystemTier,
  SystemTierType,
} from "../../system-lib/system/system-tier";

export type SliceTiles = ReadonlyArray<number>;
export type SliceShape = ReadonlyArray<HexType>;

export type GenerateSlicesParams = {
  sliceMakeup: ReadonlyArray<SystemTierType>;
  sliceShape: SliceShape;
  minAlphaWormholes?: number;
  minBetaWormholes?: number;
  minLegendary?: number;
};

export class SliceInProgress {
  private readonly _size: number;
  private readonly _remainingMakeup: Array<SystemTierType>;
  private readonly _systems: Array<System> = [];

  constructor(makeup: ReadonlyArray<SystemTierType>) {
    this._size = makeup.length;
    this._remainingMakeup = [...makeup];
  }

  addSystem(system: System) {
    this._systems.push(system);
    if (this._systems.length > this._size) {
      throw new Error("too many systems added");
    }
  }

  getNextRemainingTier(): SystemTierType | undefined {
    return this._remainingMakeup[0];
  }

  getSystems(): Array<System> {
    return [...this._systems];
  }

  hasRemainingTier(tier: SystemTierType): boolean {
    return this._remainingMakeup.includes(tier);
  }

  removeRemainingTier(tier: SystemTierType) {
    const index: number = this._remainingMakeup.indexOf(tier);
    if (index === -1) {
      throw new Error(`system tier (${tier}) not in remaining makeup`);
    }
    this._remainingMakeup.splice(index, 1);
  }
}

export class GenerateSlices {
  private readonly _params: GenerateSlicesParams;
  private readonly _slicesInProgress: Array<SliceInProgress> = [];
  private readonly _blacklistSystemTileNumbers: Set<number> = new Set();

  constructor(params: GenerateSlicesParams) {
    // Slice shape includes home system as first entry.
    if (params.sliceShape.length !== params.sliceMakeup.length + 1) {
      throw new Error("slice shape and makeup mismatch");
    }

    this._params = Object.freeze(params);
  }

  setBlacklistSystemTileNumbers(systemTileNumbers: Array<number>) {
    this._blacklistSystemTileNumbers.clear();
    for (const systemTileNumber of systemTileNumbers) {
      this._blacklistSystemTileNumbers.add(systemTileNumber);
    }
  }

  generateSlices(sliceCount: number): Array<SliceTiles> {
    for (let i = 0; i < sliceCount; i++) {
      const makeup: ReadonlyArray<SystemTierType> =
        new Shuffle<SystemTierType>().shuffle([...this._params.sliceMakeup]);
      this._slicesInProgress.push(new SliceInProgress(makeup));
    }

    // Get all candidate systems, split off promoted.
    const systems: Array<System> = this._getShuffledSystems();
    let promotedSystems: Array<System> =
      this._promoteWormholesAndLegendaries(systems);
    promotedSystems = new Shuffle<System>().shuffle(promotedSystems);

    // Add promoted systems to slices, spread evenly.
    const systemTier = new SystemTier();
    for (const promotedSystem of promotedSystems) {
      const tier: SystemTierType = systemTier.getTier(promotedSystem);
      const shortestSlice: SliceInProgress | undefined =
        this._getShortestSliceWithTier(tier);
      if (shortestSlice) {
        shortestSlice.addSystem(promotedSystem);
        shortestSlice.removeRemainingTier(tier);
      }
    }

    // Add remaining systems to slices.
    const pending: Array<SliceInProgress> = [...this._slicesInProgress];
    while (pending.length > 0) {
      const sliceInProgress: SliceInProgress | undefined = pending.shift()!;
      if (sliceInProgress) {
        const tier: SystemTierType | undefined =
          sliceInProgress.getNextRemainingTier();
        if (tier) {
          // Prefer the tier, but if none left use all systems.
          const systemsForTier: Array<System> = this._getSystemsForTier(
            systems,
            tier
          );

          // Choose and add system.
          this._chooseAndAddNextSystem(sliceInProgress, systemsForTier);
          sliceInProgress.removeRemainingTier(tier);
        }

        // If more to go, put back in pending.
        if (sliceInProgress.getNextRemainingTier()) {
          pending.push(sliceInProgress);
        }
      }
    }

    return this._slicesInProgress.map((sliceInProgress) => {
      const slice: SliceTiles = sliceInProgress
        .getSystems()
        .map((system) => system.getSystemTileNumber());
      return this._separateAnomalies(slice);
    });
  }

  _getShuffledSystems(): Array<System> {
    let systems: Array<System> =
      TI4.systemRegistry.getAllDraftableSystemsFilteredByConfigSources();
    systems = systems.filter((system) => {
      const tileNumber: number = system.getSystemTileNumber();
      return !this._blacklistSystemTileNumbers.has(tileNumber);
    });
    systems = new Shuffle<System>().shuffle(systems);
    return systems;
  }

  _getSystemsForTier(
    systems: Array<System>,
    tier: SystemTierType
  ): Array<System> {
    const systemTier = new SystemTier();
    let result: Array<System> = systems.filter(
      (system) => systemTier.getTier(system) === tier
    );
    // Try to use the requested tier, but if none left use all systems.
    if (result.length === 0) {
      result = systems;
    }
    if (result.length === 0) {
      throw new Error(`no systems for tier ${tier}`);
    }
    return result;
  }

  _getShortestSliceWithTier(tier: SystemTierType): SliceInProgress | undefined {
    let shortestSlice: SliceInProgress | undefined = undefined;
    for (const sliceInProgress of this._slicesInProgress) {
      if (sliceInProgress.hasRemainingTier(tier)) {
        if (
          !shortestSlice ||
          sliceInProgress.getSystems().length <
            shortestSlice.getSystems().length
        ) {
          shortestSlice = sliceInProgress;
        }
      }
    }
    return shortestSlice;
  }

  _chooseAndAddNextSystem(
    sliceInProgress: SliceInProgress,
    systems: Array<System>
  ): void {
    const options: WeightedChoiceOption<System>[] = systems.map(
      (system): WeightedChoiceOption<System> => {
        return { weight: this._score(sliceInProgress, system), value: system };
      }
    );
    const system: System = new WeightedChoice<System>(options).choice();
    sliceInProgress.addSystem(system);
  }

  _score(sliceInProgress: SliceInProgress, system: System): number {
    const systems: Array<System> = [...sliceInProgress.getSystems()];
    systems.push(system);

    const summary: SystemSummaryType = new SystemSummary(
      systems
    ).getSummaryRaw();

    // Make some setups extremely unlikely.
    if (summary.legendary.length > 1) {
      return 0.001;
    }
    if (summary.wormholes.length > 1) {
      return 0.001;
    }

    const avgOptInf: number = summary.optInfluence / systems.length;
    const avgOptRes: number = summary.optResources / systems.length;

    // Milty draft requires:
    // - mininf = 4.0,
    // - minres = 2.5,
    // - mintot = 9.0,
    // - maxtot = 13.0
    const minAvgOptInf: number = 4 / 5;
    const minAvgOptRes: number = 2.5 / 5;
    const minAvgTot: number = 9 / 5;
    const maxAvgTot: number = 13 / 5;
    const targetOptInf: number = 1.354; // 4/(4+2.5)*11/5
    const targetOptRes: number = 0.846; // 2.5/(4+2.5)*11/5

    const weightMinInf: number = Math.min(1, avgOptInf / minAvgOptInf);
    const weightMinRes: number = Math.min(1, avgOptRes / minAvgOptRes);
    const weightMinTot: number = Math.min(
      1,
      (avgOptInf + avgOptRes) / minAvgTot
    );

    const weightMaxTot: number = avgOptInf + avgOptRes > maxAvgTot ? 0.001 : 1;

    const weightTargetInf: number =
      1 / (Math.abs(avgOptInf - targetOptInf) + 1);
    const weightTargetRes: number =
      1 / (Math.abs(avgOptRes - targetOptRes) + 1);

    const score: number =
      100 *
      weightMinInf *
      weightMinRes *
      weightMinTot *
      weightMaxTot *
      weightTargetInf *
      weightTargetRes;

    return score;
  }

  /**
   * Promote wormholes and legendaries according to params.  Return them in a
   * new array, removing them from the input systems array.
   *
   * @param systems
   */
  _promoteWormholesAndLegendaries(systems: Array<System>): Array<System> {
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

    return promoted;
  }

  _hasAdjacentAnomalies(slice: SliceTiles): boolean {
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

  _separateAnomalies(
    slice: SliceTiles,
    tryShuffleFirst: boolean = true
  ): SliceTiles {
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
        slice = shuffle.shuffle([...slice]);
      }
    }

    // No luck.  Walk through slice permutations and use the first good one.
    // (This always fixes the same way, hence a few random stabs before this.)
    const inspector = (candidate: SliceTiles): boolean => {
      return !this._hasAdjacentAnomalies(candidate);
    };
    const goodSlice = this._permutator([...slice], inspector);
    if (goodSlice) {
      slice = goodSlice;
    }

    return slice;
  }

  _permutator(
    array: Array<number>,
    inspector: (candidate: Array<number>) => boolean
  ): Array<number> | undefined {
    // https://stackoverflow.com/questions/9960908/permutations-in-javascript
    let result: Array<number> | undefined = undefined;
    const permute = (arr: Array<number>, m: Array<number> = []) => {
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
