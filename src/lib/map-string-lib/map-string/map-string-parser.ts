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
export class MapStringParser {
  private readonly _entryRegExp: RegExp = /^([-]?\d+)([abAB]?)([012345]?)$/;
  private readonly _overrideFirstRegExp: RegExp = /^{(.*)}$/;

  /**
   * Parse a single map string entry, "<number><side><rotation>".
   * Number is required, side and rotation are optional.
   *
   * @param raw
   * @returns
   */
  parseEntry(raw: string): MapStringEntry | undefined {
    const result: MapStringEntry = { tile: -1 };

    const m: RegExpMatchArray | null = raw.match(this._entryRegExp);
    const tileStr: string | undefined = m?.[1];
    const sideStr: string | undefined = m?.[2]?.toLowerCase();
    const rotStr: string | undefined = m?.[3];

    // If the regex matched tileStr will be defined.
    if (tileStr === undefined) {
      return undefined;
    }
    result.tile = parseInt(tileStr);

    if (sideStr === "a" || sideStr === "b") {
      result.side = sideStr;
    }

    if (rotStr) {
      const rot = parseInt(rotStr);
      if (
        rot === 0 ||
        rot === 1 ||
        rot === 2 ||
        rot === 3 ||
        rot === 4 ||
        rot === 5
      ) {
        result.rot = rot;
      }
    }

    return result;
  }

  /**
   * Parse a map string, a space or comma separated list of entries.
   * Add any invalid entries to the invalidEntries array.
   *
   * @param mapString
   * @param invalidEntries
   * @returns
   */
  parse(
    mapString: string,
    invalidEntries: Array<string>
  ): Array<MapStringEntry> {
    const result: Array<MapStringEntry> = [];

    const rawEntries: Array<string> = mapString
      .split(/[ ,]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    // The first entry *may* be {4} or {4a1} in curly braces to signify
    // non-standard center tile.  If not, use Mecatol Rex (tile 18).
    const firstEntry: string | undefined = rawEntries[0];
    if (firstEntry) {
      const m: RegExpMatchArray | null = firstEntry.match(
        this._overrideFirstRegExp
      );
      const strippedFirst: string | undefined = m?.[1];
      if (strippedFirst) {
        rawEntries[0] = strippedFirst;
      } else {
        rawEntries.unshift("18");
      }
    }

    for (const rawEntry of rawEntries) {
      const entry: MapStringEntry | undefined = this.parseEntry(rawEntry);
      if (entry) {
        result.push(entry);
      } else {
        invalidEntries.push(rawEntry);
      }
    }

    return result;
  }

  /**
   * Parse a map string, throw an error if any entries are invalid.
   *
   * @param mapString
   * @returns
   */
  parseOrThrow(mapString: string): Array<MapStringEntry> {
    const invalidEntries: Array<string> = [];
    const result: Array<MapStringEntry> = this.parse(mapString, invalidEntries);
    if (invalidEntries.length > 0) {
      throw new Error(
        `Invalid map string entries: ${invalidEntries.join(", ")}`
      );
    }
    return result;
  }
}
