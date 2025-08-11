import { NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams, SliceShape } from "../generate-slices/generate-slices";
import { SystemTierType } from "../../system-lib/system/system-tier";
import { IDraft } from "./idraft";
export declare const MINOR_FACTIONS_SLICE_MAKEUPS: ReadonlyArray<ReadonlyArray<SystemTierType>>;
export declare const MINOR_FACTIONS_SHAPE: SliceShape;
export declare const MINOR_FACTIONS_SHAPE_ALT: SliceShape;
export declare class MinorFactionsDraft implements IDraft {
    isEnabled(): boolean;
    getDraftName(): string;
    getGenerateSlicesParams(): GenerateSlicesParams;
    /**
     * Create the draft state with slice shapes.
     * Does not generate slices, factions, etc.
     *
     * @param namespaceId
     * @returns
     */
    createEmptyDraftState(namespaceId: NamespaceId): DraftState;
}
