import { HexType } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { Faction } from "../../faction-lib/faction/faction";
import { SliceShape, SliceTiles } from "../generate-slices/generate-slices";
export type MapStringAndHexToPlayerName = {
    mapString: string;
    hexToPlayerName: Map<HexType, string>;
};
export declare class DraftToMapString {
    private readonly _defaultSliceShape;
    private readonly _seatIndexToSliceShape;
    private readonly _seatIndexToAnchorHex;
    static fromDraftState(draftState: DraftState): MapStringAndHexToPlayerName;
    constructor(sliceShape: SliceShape);
    overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this;
    _getSliceShape(seatIndex: number): SliceShape;
    buildMapString(seatIndexToSliceTiles: Map<number, SliceTiles>, seatIndexToFaction: Map<number, Faction>, seatIndexToPlayerName: Map<number, string>, seatIndexToOpaque: Map<number, string>, opaqueType: string | null): MapStringAndHexToPlayerName;
    _fillMissingMapStringEntries(mapStringEntries: Array<string>): void;
    _addBaseMap(oldMap: string, baseMap: string): string;
}
