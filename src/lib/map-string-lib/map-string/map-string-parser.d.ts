export type MapStringEntry = {
    tile: number;
    side?: "a" | "b";
    rot?: 0 | 1 | 2 | 3 | 4 | 5;
};
/**
 * A map string is a text representation of system tile layout.
 * Normally "18" is assumed to be the center, then the first
 * map string entry is above it and winding clockwise.  Once back
 * to the "north" line bump out to the next ring and continue.
 *
 * A map string may have a first entry in curly braces {} to
 * override 18 as the center tile.
 *
 * Adapted from Dotlogix's JavaScript.
 */
export declare class MapStringParser {
    private readonly _entryRegExp;
    private readonly _overrideFirstRegExp;
    /**
     * Parse a single map string entry, "<number><side><rotation>".
     * Number is required, side and rotation are optional.
     *
     * @param raw
     * @returns
     */
    parseEntry(raw: string): MapStringEntry | undefined;
    /**
     * Parse a map string, a space or comma separated list of entries.
     * Add any invalid entries to the invalidEntries array.
     *
     * @param mapString
     * @param invalidEntries
     * @returns
     */
    parse(mapString: string, invalidEntries: Array<string>): Array<MapStringEntry>;
    /**
     * Parse a map string, throw an error if any entries are invalid.
     *
     * @param mapString
     * @returns
     */
    parseOrThrow(mapString: string): Array<MapStringEntry>;
}
