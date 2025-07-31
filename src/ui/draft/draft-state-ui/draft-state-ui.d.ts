import { Button, Color, ContentButton, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { SliceShape, SliceTiles } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { CreateZoomedUiType } from "../../zoomable-ui/zoomable-ui";
export declare class DraftStateUI extends AbstractUI {
    private readonly _draftState;
    private readonly _onDraftStateChangedHandler;
    static _maybeAdvanceTurn: (player: Player) => void;
    static _createSliceClickHandler(draftState: DraftState, sliceIndex: number): (_button: ContentButton, player: Player) => void;
    static _createFactionClickHandler(draftState: DraftState, sliceIndex: number): (_button: ContentButton, player: Player) => void;
    static _createSeatClickHandler(draftState: DraftState, sliceIndex: number): (_button: ContentButton, player: Player) => void;
    static _createOpaqueClickHandler(draftState: DraftState, opaqueIndex: number): (_button: ContentButton, player: Player) => void;
    static _createFinishClickHandler(draftState: DraftState): (button: Button, player: Player) => void;
    static _createCancelClickHandler(draftState: DraftState): (button: Button, player: Player) => void;
    static _getCreateZoomedSliceUi: (slice: SliceTiles, sliceShape: SliceShape, color: Color) => CreateZoomedUiType;
    static _createZoomedOpaqueUi: (draftState: DraftState, opaque: string) => CreateZoomedUiType;
    static _getCreatedZoomedMapUi: (draftState: DraftState) => CreateZoomedUiType;
    static _getSliceColorOrThrow: (index: number) => Color;
    constructor(draftState: DraftState, scale: number);
    destroy(): void;
}
