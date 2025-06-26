import { Color } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { SliceTiles } from "../../../lib/draft-lib/generate-slices/generate-slices";
export declare class SliceUI extends AbstractUI {
    private readonly _labelText;
    private readonly _defaultFontSize;
    constructor(slice: SliceTiles, sliceShape: ReadonlyArray<HexType>, sliceColor: Color, scale: number);
    setLabel(label: string): void;
}
