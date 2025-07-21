"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapStringLoad = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const map_string_parser_1 = require("./map-string-parser");
const map_string_hex_1 = require("./map-string-hex");
class MapStringLoad {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    _parseAndValidateMapString(mapString) {
        const parser = new map_string_parser_1.MapStringParser();
        const invalidEntries = [];
        const entries = parser.parse(mapString, invalidEntries);
        if (invalidEntries.length > 0) {
            ttpg_darrell_1.locale.inject({
                "map-string-load.invalid-map-string-entries": "Invalid map string entries: {invalidEntries}",
            });
            const msg = (0, ttpg_darrell_1.locale)("map-string-load.invalid-map-string-entries", {
                invalidEntries: invalidEntries.join(", "),
            });
            ttpg_darrell_1.Broadcast.chatAll(msg, ttpg_darrell_1.Broadcast.ERROR);
            return undefined;
        }
        return entries;
    }
    _validateSystems(entries) {
        const unknownTiles = [];
        for (const entry of entries) {
            if (entry.tile > 0) {
                const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(entry.tile);
                if (!nsid) {
                    unknownTiles.push(entry.tile);
                }
            }
        }
        if (unknownTiles.length > 0) {
            ttpg_darrell_1.locale.inject({
                "map-string-load.unknown-tiles": "Unknown tiles: {unknownTiles}",
            });
            const msg = (0, ttpg_darrell_1.locale)("map-string-load.unknown-tiles", {
                unknownTiles: unknownTiles.join(", "),
            });
            ttpg_darrell_1.Broadcast.chatAll(msg, ttpg_darrell_1.Broadcast.ERROR);
            return false;
        }
        return true;
    }
    /**
     * Get a snapshot of systems in game (on the table AND in containers).
     * Used to place systems with duplicates support.
     */
    _getTileNumberToSystemsSnapshot() {
        const skipContained = false; // look inside containers
        const systems = TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
        const result = new Map();
        for (const system of systems) {
            const tileNumber = system.getSystemTileNumber();
            let tileSystems = result.get(tileNumber);
            if (!tileSystems) {
                tileSystems = [];
                result.set(tileNumber, tileSystems);
            }
            tileSystems.push(system);
        }
        return result;
    }
    _tryMoveExistingSystemTileObj(systemTileNumber, pos, rot, systemsSnapshot) {
        // The snapshot tracks unused systems.  Check if we have one, if yes
        // remove it from the snapshot and use it.
        const systems = systemsSnapshot.get(systemTileNumber);
        if (!systems) {
            return false; // no systems with that tile number
        }
        const system = systems.pop();
        if (!system) {
            return false; // no systems left with that tile number
        }
        // Found a system.  If inside container take it out.
        const systemTileObj = system.getObj();
        const container = systemTileObj.getContainer();
        if (container) {
            const showAnimation = false;
            const keep = false;
            const success = container.take(systemTileObj, pos, showAnimation, keep);
            if (!success) {
                return false;
            }
        }
        pos.z = api_1.world.getTableHeight() + 10;
        systemTileObj.setObjectType(api_1.ObjectType.Regular);
        systemTileObj.setPosition(pos);
        systemTileObj.setRotation(rot);
        systemTileObj.snapToGround();
        systemTileObj.setObjectType(api_1.ObjectType.Ground);
        return true;
    }
    _trySpawnNewSystemTileObj(systemTileNumber, pos, rot) {
        const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(systemTileNumber);
        if (!nsid) {
            return false;
        }
        const above = pos.add(new api_1.Vector(0, 0, 10));
        const systemTileObj = ttpg_darrell_1.Spawn.spawn(nsid, above, rot);
        if (systemTileObj) {
            systemTileObj.setTags(["system"]);
            systemTileObj.snapToGround();
            systemTileObj.setObjectType(api_1.ObjectType.Ground);
        }
        return systemTileObj !== undefined;
    }
    load(mapString) {
        const nsid = "token:base/custodians";
        const playerSlot = undefined;
        const skipContained = true;
        const custodiansToken = this._find.findGameObject(nsid, playerSlot, skipContained);
        if (custodiansToken) {
            custodiansToken.setPosition([500, 0, api_1.world.getTableHeight() + 10]);
        }
        const success = this._load(mapString);
        if (custodiansToken) {
            custodiansToken.setPosition([0, 0, api_1.world.getTableHeight() + 10]);
            custodiansToken.snapToGround();
        }
        return success;
    }
    _load(mapString) {
        // Parse the map string.
        const entries = this._parseAndValidateMapString(mapString);
        if (!entries) {
            return false;
        }
        if (!this._validateSystems(entries)) {
            return false;
        }
        // Gather existing systems to pull from.
        const systemsSnapshot = this._getTileNumberToSystemsSnapshot();
        const maxStringHex = new map_string_hex_1.MapStringHex();
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry && entry.tile > 0) {
                // Calculate the position and rotation.
                const hex = maxStringHex.indexToHex(i);
                const pos = TI4.hex.toPosition(hex);
                const rot = new api_1.Rotator(0, entry.rot ? entry.rot * 60 : 0, entry.side === "b" ? 180 : 0);
                if (this._tryMoveExistingSystemTileObj(entry.tile, pos, rot, systemsSnapshot)) {
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
exports.MapStringLoad = MapStringLoad;
//# sourceMappingURL=map-string-load.js.map