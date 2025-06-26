import { HexType } from "ttpg-darrell";
import { System } from "../../system-lib/system/system";
import { SystemTierType } from "../../system-lib/system/system-tier";
export type SliceTiles = ReadonlyArray<number>;
export type SliceShape = ReadonlyArray<HexType>;
export type SliceMakeup = ReadonlyArray<SystemTierType>;
export type GenerateSlicesParams = {
    sliceMakeups: ReadonlyArray<SliceMakeup>;
    sliceShape: SliceShape;
    minAlphaWormholes?: number;
    minBetaWormholes?: number;
    minLegendary?: number;
};
export declare class SliceInProgress {
    private readonly _size;
    private readonly _remainingMakeup;
    private readonly _systems;
    constructor(makeup: ReadonlyArray<SystemTierType>);
    addSystem(system: System): void;
    getNextRemainingTier(): SystemTierType | undefined;
    getSystems(): Array<System>;
    hasRemainingTier(tier: SystemTierType): boolean;
    removeRemainingTier(tier: SystemTierType): void;
}
export declare class GenerateSlices {
    private readonly _params;
    private readonly _slicesInProgress;
    private readonly _blacklistSystemTileNumbers;
    constructor(params: GenerateSlicesParams);
    setBlacklistSystemTileNumbers(systemTileNumbers: Array<number>): this;
    generateSlices(sliceCount: number): Array<SliceTiles>;
    _getShuffledSystems(): Array<System>;
    _getSystemsForTier(systems: Array<System>, tier: SystemTierType): Array<System>;
    _getShortestSliceWithTier(tier: SystemTierType): SliceInProgress | undefined;
    _chooseAndAddNextSystem(sliceInProgress: SliceInProgress, systems: Array<System>): System;
    _score(sliceInProgress: SliceInProgress, system: System): number;
    /**
     * Promote wormholes and legendaries according to params.  Return them in a
     * new array, removing them from the input systems array.
     *
     * @param systems
     */
    _promoteWormholesAndLegendaries(systems: Array<System>): Array<System>;
    _hasAdjacentAnomalies(slice: SliceTiles): boolean;
    _separateAnomalies(slice: SliceTiles, tryShuffleFirst?: boolean): SliceTiles;
    _permutator(array: Array<number>, inspector: (candidate: Array<number>) => boolean): Array<number> | undefined;
}
