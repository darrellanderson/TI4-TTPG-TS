import {
  Container,
  GameObject,
  Rotator,
  Vector,
} from "@tabletop-playground/api";
import { Broadcast, HexType, locale, Spawn } from "ttpg-darrell";

import { MapStringEntry, MapStringParser } from "./map-string-parser";
import { System } from "lib/system-lib/system/system";
import { MapStringHex } from "./map-string-hex";

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

  _findOrSpawnSystemTileObj(systemTileNumber: number): GameObject | undefined {
    let systemTileObj: GameObject | undefined = undefined;

    const system: System | undefined =
      TI4.systemRegistry.getBySystemTileNumber(systemTileNumber)[0];
    if (system) {
      // Existing system.
      systemTileObj = system.getObj();
      const container: Container | undefined = systemTileObj.getContainer();
      if (container) {
        container.remove(systemTileObj);
      }
    } else {
      // No system, spawn a new one.
      const nsid: string | undefined =
        TI4.systemRegistry.tileNumberToSystemTileObjNsid(systemTileNumber);
      if (nsid) {
        systemTileObj = Spawn.spawn(nsid);
      }
    }

    return systemTileObj;
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

    const maxStringHex: MapStringHex = new MapStringHex();
    for (let i = 0; i < entries.length; i++) {
      const entry: MapStringEntry | undefined = entries[i];
      if (entry && entry.tile > 0) {
        // Calculate the position and rotation.
        const hex: HexType = maxStringHex.indexToHex(i);
        const pos: Vector = TI4.hex.toPosition(hex);
        const rot: Rotator = new Rotator(
          0,
          entry.rot ? entry.rot * 60 : 0,
          entry.side === "b" ? 180 : 0
        );
        const systemTileObj: GameObject | undefined =
          this._findOrSpawnSystemTileObj(entry.tile);
        if (systemTileObj) {
          systemTileObj.setPosition(pos);
          systemTileObj.setRotation(rot);
        }
      }
    }
    return true;
  }
}
