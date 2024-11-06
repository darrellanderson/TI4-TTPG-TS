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
      if (entry.tile > 0) {
        const nsid: string | undefined =
          TI4.systemRegistry.tileNumberToSystemTileObjNsid(entry.tile);
        if (!nsid) {
          unknownTiles.push(entry.tile);
        }
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

  /**
   * Get a snapshot of systems in game (on the table AND in containers).
   * Used to place systems with duplicates support.
   */
  _getTileNumberToSystemsSnapshot(): Map<number, Array<System>> {
    const skipContained: boolean = false; // look inside containers
    const systems: Array<System> =
      TI4.systemRegistry.getAllSystemsWithObjs(skipContained);

    const result: Map<number, Array<System>> = new Map();
    for (const system of systems) {
      const tileNumber = system.getSystemTileNumber();
      let systems: Array<System> | undefined = result.get(tileNumber);
      if (!systems) {
        systems = [];
        result.set(tileNumber, systems);
      }
      systems.push(system);
    }
    return result;
  }

  _tryMoveExistingSystemTileObj(
    systemTileNumber: number,
    pos: Vector,
    rot: Rotator,
    systemsSnapshot: Map<number, Array<System>>
  ): boolean {
    // The snapshot tracks unused systems.  Check if we have one, if yes
    // remove it from the snapshot and use it.
    const systems: Array<System> | undefined =
      systemsSnapshot.get(systemTileNumber);
    if (!systems) {
      return false; // no systems with that tile number
    }
    const system: System | undefined = systems.pop();
    if (!system) {
      return false; // no systems left with that tile number
    }

    // Found a system.  If inside container take it out.
    const systemTileObj: GameObject = system.getObj();
    const container: Container | undefined = systemTileObj.getContainer();
    if (container) {
      const showAnimation: boolean = false;
      const keep: boolean = false;
      const success: boolean = container.take(
        systemTileObj,
        pos,
        showAnimation,
        keep
      );
      if (!success) {
        return false;
      }
    }
    systemTileObj.setPosition(pos);
    systemTileObj.setRotation(rot);
    return true;
  }

  _trySpawnNewSystemTileObj(
    systemTileNumber: number,
    pos: Vector,
    rot: Rotator
  ): boolean {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(systemTileNumber);
    if (!nsid) {
      return false;
    }
    const systemTileObj: GameObject | undefined = Spawn.spawn(nsid, pos, rot);
    return systemTileObj !== undefined;
  }

  public load(mapString: string): boolean {
    // Parse the map string.
    const entries: Array<MapStringEntry> | undefined =
      this._parseAndValidateMapString(mapString);
    if (!entries) {
      return false;
    }

    if (!this._validateSystems(entries)) {
      return false;
    }

    // Gather existing systems to pull from.
    const systemsSnapshot: Map<
      number,
      Array<System>
    > = this._getTileNumberToSystemsSnapshot();

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

        if (
          !this._tryMoveExistingSystemTileObj(
            entry.tile,
            pos,
            rot,
            systemsSnapshot
          )
        ) {
          continue; // success, moved an existing tile
        }

        if (this._trySpawnNewSystemTileObj(entry.tile, pos, rot)) {
          continue; // success, spawned a new tile
        }
      }
    }
    return true;
  }
}
