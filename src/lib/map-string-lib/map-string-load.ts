import { Broadcast, locale, Spawn } from "ttpg-darrell";
import { MapStringEntry, MapStringParser } from "./map-string-parser";

export class MapStringLoad {
  _parseAndValidateMapString(
    mapString: string
  ): Array<MapStringEntry> | undefined {
    const parser: MapStringParser = new MapStringParser();
    const invalidEntries: Array<string> = [];
    const entries: Array<MapStringEntry> = parser.parse(
      mapString,
      invalidEntries
    );
    if (invalidEntries.length > 0) {
      locale.inject({
        "map-string-load.invalid-map-string-entries":
          "Invalid map string entries: {invalidEntries}",
      });
      const msg: string = locale("map-string-load.invalid-map-string-entries", {
        invalidEntries: invalidEntries.join(", "),
      });
      Broadcast.chatAll(msg, Broadcast.ERROR);
      return undefined;
    }
    return entries;
  }

  _validateSystems(entries: Array<MapStringEntry>): boolean {
    const unknownTiles: Array<number> = [];
    for (const entry of entries) {
      const nsid: string | undefined =
        TI4.systemRegistry.tileNumberToSystemTileObjNsid(entry.tile);
      if (!nsid) {
        unknownTiles.push(entry.tile);
      }
    }
    if (unknownTiles.length > 0) {
      locale.inject({
        "map-string-load.unknown-tiles": "Unknown tiles: {unknownTiles}",
      });
      const msg: string = locale("map-string-load.unknown-tiles", {
        unknownTiles: unknownTiles.join(", "),
      });
      Broadcast.chatAll(msg, Broadcast.ERROR);
      return false;
    }
    return true;
  }

  _validateTemplates(entries: Array<MapStringEntry>): boolean {
    const unknownTiles: Array<number> = [];
    for (const entry of entries) {
      const nsid: string | undefined =
        TI4.systemRegistry.tileNumberToSystemTileObjNsid(entry.tile);
      if (nsid && !Spawn.has(nsid)) {
        unknownTiles.push(entry.tile);
      }
    }
    if (unknownTiles.length > 0) {
      locale.inject({
        "map-string-load.unknown-templates":
          "Unknown templates: {unknownTiles}",
      });
      const msg: string = locale("map-string-load.unknown-templates", {
        unknownTiles: unknownTiles.join(", "),
      });
      Broadcast.chatAll(msg, Broadcast.ERROR);
      return false;
    }
    return true;
  }

  public load(mapString: string): boolean {
    // Parse the map string.
    const entries: Array<MapStringEntry> | undefined =
      this._parseAndValidateMapString(mapString);
    if (!entries) {
      return false;
    }
    if (!this._validateSystems(entries) || !this._validateTemplates(entries)) {
      return false;
    }

    // TODO

    return true;
  }
}
