import { Container } from "@tabletop-playground/api";
import { NamespaceId, PlayerSlot } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams, SliceTiles } from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
export declare class BagDraft implements IDraft {
    private readonly _find;
    private _containerNsid;
    isEnabled(): boolean;
    getDraftName(): string;
    getGenerateSlicesParams(): GenerateSlicesParams;
    /**
     * DOES NOT USE THIS FUNCTION, spawns containers with system tiles
     * in each player area.
     *
     * @param namespaceId
     */
    createEmptyDraftState(_namespaceId: NamespaceId): DraftState;
    _getSlices(): Array<SliceTiles>;
    _createContainer(playerSlot: PlayerSlot): Container;
    _fillContainer(container: Container, slice: SliceTiles): void;
    setContainerNsid(nsid: string): this;
    createDraftObjects(): void;
}
