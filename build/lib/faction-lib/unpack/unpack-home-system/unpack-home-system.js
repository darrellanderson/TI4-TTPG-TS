"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackHomeSystem = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const map_home_system_locations_1 = require("../../../map-string-lib/map-home-system-locations/map-home-system-locations");
class UnpackHomeSystem extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    _findGenericHomeSystemTileOrThrow() {
        return new map_home_system_locations_1.MapHomeSystemLocations().findOrSpawnGenericHomeSystemOrThrow(this.getPlayerSlot());
    }
    _findFactionSheetOrThrow() {
        const factionSheetNsid = this.getFaction().getFactionSheetNsid();
        const obj = this._find.findGameObject(factionSheetNsid, this.getPlayerSlot(), true);
        if (!obj) {
            throw new Error(`Could not find faction sheet for ${this.getPlayerSlot()}`);
        }
        return obj;
    }
    _spawnGenericHomeSystemTileOrThrow() {
        return new map_home_system_locations_1.MapHomeSystemLocations().findOrSpawnGenericHomeSystemOrThrow(this.getPlayerSlot());
    }
    _getHomeSystemTileNsid() {
        const home = this.getFaction().getHomeSystemTileNumber();
        const homeSystemTileNsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(home);
        if (!homeSystemTileNsid) {
            throw new Error(`Could not find home system tile for ${home}`);
        }
        return homeSystemTileNsid;
    }
    _spawnHomeSystemTile() {
        const homeSystemTileNsid = this._getHomeSystemTileNsid();
        const obj = ttpg_darrell_1.Spawn.spawnOrThrow(homeSystemTileNsid);
        obj.setOwningPlayerSlot(this.getPlayerSlot());
        return obj;
    }
    _findHomeSystemTileOrThrow() {
        const homeSystemTileNsid = this._getHomeSystemTileNsid();
        const obj = this._find.findGameObject(homeSystemTileNsid, undefined, true);
        if (!obj) {
            throw new Error(`Could not find home system tile for ${this.getPlayerSlot()}`);
        }
        return obj;
    }
    _getSurrogateSystemTileNsid() {
        const surrogate = this.getFaction().getHomeSurrogateTileNumber();
        return TI4.systemRegistry.tileNumberToSystemTileObjNsid(surrogate);
    }
    _spawnSurrogateSystemTile() {
        const surrogateSystemTileNsid = this._getSurrogateSystemTileNsid();
        if (!surrogateSystemTileNsid) {
            return undefined;
        }
        const obj = ttpg_darrell_1.Spawn.spawnOrThrow(surrogateSystemTileNsid);
        obj.setOwningPlayerSlot(this.getPlayerSlot());
        return obj;
    }
    _findSurrogateSystemTile() {
        let result = undefined;
        const surrogateSystemTileNsid = this._getSurrogateSystemTileNsid();
        if (surrogateSystemTileNsid) {
            result = this._find.findGameObject(surrogateSystemTileNsid, undefined, true);
        }
        return result;
    }
    unpack() {
        // Get generic home system tile.
        const genericHomeSystemTile = this._findGenericHomeSystemTileOrThrow();
        // Get faction sheet (for surrogate, but always do for code exercise in all cases).
        const factionSheet = this._findFactionSheetOrThrow();
        const homeSystemTileObj = this._spawnHomeSystemTile();
        const surrogatSystemTileeObj = this._spawnSurrogateSystemTile();
        const homePos = genericHomeSystemTile.getPosition().add([0, 0, 10]);
        const factionSheetPos = factionSheet.getPosition().add([0, 0, 10]);
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(genericHomeSystemTile);
        if (surrogatSystemTileeObj) {
            surrogatSystemTileeObj.setPosition(homePos);
            surrogatSystemTileeObj.snapToGround();
            surrogatSystemTileeObj.setObjectType(api_1.ObjectType.Ground);
            homeSystemTileObj.setPosition(factionSheetPos);
            homeSystemTileObj.snapToGround();
            // Do not lock, player wants to move it somewhere.
        }
        else {
            homeSystemTileObj.setPosition(homePos);
            homeSystemTileObj.snapToGround();
            homeSystemTileObj.setObjectType(api_1.ObjectType.Ground);
        }
    }
    remove() {
        const homeSystemTileObj = this._findHomeSystemTileOrThrow();
        const surrogatSystemTileeObj = this._findSurrogateSystemTile();
        let pos;
        if (surrogatSystemTileeObj) {
            pos = surrogatSystemTileeObj.getPosition().add([0, 0, 10]);
        }
        else {
            pos = homeSystemTileObj.getPosition().add([0, 0, 10]);
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(homeSystemTileObj);
        if (surrogatSystemTileeObj) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(surrogatSystemTileeObj);
        }
        const genericHomeSystemTile = this._spawnGenericHomeSystemTileOrThrow();
        genericHomeSystemTile.setPosition(pos);
        genericHomeSystemTile.snapToGround();
    }
}
exports.UnpackHomeSystem = UnpackHomeSystem;
//# sourceMappingURL=unpack-home-system.js.map