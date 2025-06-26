import { HexType, NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
export declare const NUCLEUS_SLICE_SHAPE: ReadonlyArray<HexType>;
export declare const NUCLEUS_SLICE_SHAPE_ALT: ReadonlyArray<HexType>;
export declare const NUCLEUS_MAP_STRING: string;
export declare class NucleusDraft implements IDraft {
    isEnabled(): boolean;
    getDraftName(): string;
    getGenerateSlicesParams(): GenerateSlicesParams;
    createEmptyDraftState(namespaceId: NamespaceId): DraftState;
    _getNucleusMapStringIndexes(): Array<number>;
    /**
     * Choose a handful of random wormhole location sets, use the
     * one with the largest "smallest distance between two wormholes".
     * Don't check too many, or results will be too similar.
     *
     * As a side effect, remove the chosen map string indexes from the
     * input array.
     */
    _getScattered(mapStringIndexes: Array<number>, want: number, iterations?: number): Array<number>;
    _getAvailableWormholes(): Array<number>;
    _getNonWormholeRedSystems(): Array<number>;
    _getNonWormholeBlueSystems(): Array<number>;
    _fillEntriesOrThrow(fillIndexes: Array<number>, fillWith: Array<number>, entries: Array<number>): void;
}
