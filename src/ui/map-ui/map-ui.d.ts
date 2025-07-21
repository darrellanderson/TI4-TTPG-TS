import { Color } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export declare class MapUI extends AbstractUI {
    private readonly _mapStringIndexToImageWidget;
    private readonly _hexToTextWidget;
    /**
     * Get a negative tile number that will render as this player slot's color.
     *
     * @param playerSlot
     * @returns
     */
    static playerSlotToColorTileNumber(playerSlot: number): number;
    /**
     * Translate a color tile number to the linked player slot color.
     *
     * @param tileNumber
     * @returns
     */
    static colorTileNumberToColor(tileNumber: number): Color | undefined;
    constructor(mapString: string, hexToLabel: Map<HexType, string>, scale: number);
    update(mapString: string, hexToLabel: Map<HexType, string>): void;
}
