import { MapStringEntry } from "./map-string-parser";

export class MapStringFormat {
  _formatEntry(entry: MapStringEntry, index: number): string {
    const parts: Array<string> = [entry.tile.toString()];
    if (entry.side !== undefined) {
      parts.push(entry.side);
      // Can only have rotation if side is present.
      if (entry.rot !== undefined) {
        parts.push(entry.rot.toString());
      }
    }
    const s: string = parts.join("");
    if (index === 0) {
      return `{${s}}`;
    }
    return s;
  }

  format(entries: Array<MapStringEntry>): string {
    return entries
      .map((entry, index) => this._formatEntry(entry, index))
      .join(" ")
      .toUpperCase();
  }
}
