import { NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams, SliceShape } from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
export declare const WEKKER_SLICE_SHAPE: SliceShape;
export declare const WEKKER_SLICE_SHAPE_R: SliceShape;
export declare const WEKKER_SLICE_SHAPE_L: SliceShape;
export declare class Wekker implements IDraft {
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
