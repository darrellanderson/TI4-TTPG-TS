export type MapStringEntry = {
  tile: number;
  side?: "a" | "b";
  rot?: 0 | 1 | 2 | 3 | 4 | 5;
};

export class MapStringParser {
  static parseEntry(
    raw: string,
    errors: Array<string>
  ): MapStringEntry | undefined {
    const result: MapStringEntry = { tile: -1 };

    const regExp: RegExp = /^([-]?\d+)([abAB]?)(\d?)$/;
    const m: RegExpMatchArray | null = raw.match(regExp);
    const tileStr: string | undefined = m?.[1];
    const sideStr: string | undefined = m?.[2]?.toLowerCase();
    const rotStr: string | undefined = m?.[3];

    if (tileStr === undefined) {
      errors.push(`Invalid tile: ${raw}`);
      return undefined;
    }
    result.tile = parseInt(tileStr);

    if (sideStr === "a" || sideStr === "b") {
      result.side = sideStr;
    }

    const rot = parseInt(rotStr ?? "-1");
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

    return result;
  }

  parse(mapString: string, errors: Array<string>): Array<MapStringEntry> {
    const result: Array<MapStringEntry> = [];

    const rawEntries: Array<string> = mapString
      .split(/[ ,]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    // The first entry *may* be {4} or {4a1} in curly braces to signify
    // non-standard center tile.  If not, use Mecatol Rex (tile 18).
    const firstEntry: string | undefined = rawEntries[0];
    if (firstEntry) {
      const customFirstRegExp: RegExp = /^{(.*)}$/;
      const m: RegExpMatchArray | null = firstEntry.match(customFirstRegExp);
      const strippedFirst: string | undefined = m?.[1];
      if (strippedFirst) {
        rawEntries[0] = strippedFirst;
      } else {
        rawEntries.unshift("18");
      }
    }

    for (const rawEntry of rawEntries) {
      const entry: MapStringEntry | undefined = MapStringParser.parseEntry(
        rawEntry,
        errors
      );
      if (entry) {
        result.push(entry);
      }
    }

    return result;
  }

  parseOrThrow(mapString: string): Array<MapStringEntry> {
    const errors: Array<string> = [];
    const result: Array<MapStringEntry> = this.parse(mapString, errors);
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
    return result;
  }
}
