import { HexType } from "ttpg-darrell";
/**
 * Translate between map string index and hex position.
 *
 * Adapted from Somberlord's JavaScript code.
 */
export declare class MapStringHex {
    static _firstIndexInRing(radius: number): number;
    static _indexToRing(index: number): number;
    /**
     * Translate a hex position to a map string index.
     *
     * @param hex
     * @returns
     */
    hexToIndex(hex: HexType): number;
    /**
     * Translate a map string index to a hex position.
     *
     * @param index
     * @returns
     */
    indexToHex(index: number): HexType;
}
