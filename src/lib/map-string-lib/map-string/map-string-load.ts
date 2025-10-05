import {
  Container,
  GameObject,
  GameWorld,
  ObjectType,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, Find, HexType, locale } from "ttpg-darrell";

import { MapStringEntry, MapStringParser } from "./map-string-parser";
import { System } from "../../system-lib/system/system";
import { MapStringHex } from "./map-string-hex";

export class MapStringLoad {
  private readonly _find: Find = new Find();

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
      let tileSystems: Array<System> | undefined = result.get(tileNumber);
      if (!tileSystems) {
        tileSystems = [];
        result.set(tileNumber, tileSystems);
      }
      tileSystems.push(system);
    }
    return result;
  }

  _tryMoveExistingSystemTileObj(
    systemTileNumber: number,
    pos: Vector,
    rot: Rotator,
    systemsSnapshot: Map<number, Array<System>>
  ): GameObject | undefined {
    // The snapshot tracks unused systems.  Check if we have one, if yes
    // remove it from the snapshot and use it.
    const systems: Array<System> | undefined =
      systemsSnapshot.get(systemTileNumber);
    if (!systems) {
      return undefined; // no systems with that tile number
    }
    const system: System | undefined = systems.pop();
    if (!system) {
      return undefined; // no systems left with that tile number
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
        return undefined;
      }
    }
    pos.z = world.getTableHeight() + 10;
    systemTileObj.setObjectType(ObjectType.Regular);
    systemTileObj.setPosition(pos);
    systemTileObj.setRotation(rot);
    systemTileObj.snapToGround();
    systemTileObj.setObjectType(ObjectType.Ground);
    return systemTileObj;
  }

  _trySpawnNewSystemTileObj(
    systemTileNumber: number,
    pos: Vector,
    rot: Rotator
  ): GameObject | undefined {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(systemTileNumber);
    if (!nsid) {
      return undefined;
    }
    const above: Vector = pos.add(new Vector(0, 0, 10));
    const systemTileObj: GameObject | undefined = TI4.spawn.spawn(
      nsid,
      above,
      rot
    );
    if (systemTileObj) {
      systemTileObj.setTags(["system"]);
      systemTileObj.snapToGround();
      systemTileObj.setObjectType(ObjectType.Ground);
    }
    return systemTileObj;
  }

  public load(mapString: string): boolean {
    const nsid: string = "token:base/custodians";
    const playerSlot: number | undefined = undefined;
    const skipContained: boolean = true;
    const custodiansToken: GameObject | undefined = this._find.findGameObject(
      nsid,
      playerSlot,
      skipContained
    );
    if (custodiansToken) {
      custodiansToken.setPosition([500, 0, world.getTableHeight() + 10]);
    }

    const success: boolean = this._load(mapString);

    if (custodiansToken) {
      custodiansToken.setPosition([0, 0, world.getTableHeight() + 10]);
      custodiansToken.snapToGround();
    }

    return success;
  }

  private _load(mapString: string): boolean {
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

    const systemTileObjs: Array<GameObject> = [];
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

        let systemTileObj: GameObject | undefined;
        systemTileObj = this._tryMoveExistingSystemTileObj(
          entry.tile,
          pos,
          rot,
          systemsSnapshot
        );
        if (systemTileObj) {
          systemTileObjs.push(systemTileObj);
          continue; // success, moved an existing tile
        }

        systemTileObj = this._trySpawnNewSystemTileObj(entry.tile, pos, rot);
        if (systemTileObj) {
          systemTileObjs.push(systemTileObj);
          continue; // success, spawned a new tile
        }
      }
    }

    if (GameWorld.getExecutionReason() !== "unittest") {
      // Moving too many things out of a container in the same frame can cause
      // problems with synchronization.  The host sees correct, others do not.
      // Creating objects, however, appears to synchronize correctly.
      // Replace all the moved objects with clones.
      systemTileObjs.forEach((obj: GameObject): void => {
        TI4.systemRegistry.cloneReplace(obj);
      });
    }

    return true;
  }
}
