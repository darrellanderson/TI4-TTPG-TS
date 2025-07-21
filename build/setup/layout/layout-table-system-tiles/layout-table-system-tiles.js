"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutTableSystemTiles = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutTableSystemTiles {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const custudiansToken = ttpg_darrell_1.Spawn.spawnOrThrow("token:base/custodians");
        this._layout.addAfterLayout(() => {
            let tileNumber;
            let pos;
            let rot;
            tileNumber = 18;
            pos = new api_1.Vector(0, 0, 0);
            rot = new api_1.Rotator(0, 0, 0);
            this._moveSystemTileFromContainer(tileNumber, pos, rot);
            tileNumber = 82;
            pos = TI4.hex.toPosition("<0,-6,6>");
            rot = new api_1.Rotator(0, 0, 180);
            this._moveSystemTileFromContainer(tileNumber, pos, rot);
            // Place custodians token.
            custudiansToken.setPosition([0, 0, api_1.world.getTableHeight() + 10]);
            custudiansToken.snapToGround();
        });
    }
    getLayout() {
        return this._layout;
    }
    _moveSystemTileFromContainer(tileNumber, pos, rot) {
        const above = new api_1.Vector(pos.x, pos.y, api_1.world.getTableHeight() + 10);
        const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
        if (nsid) {
            const skipContained = false;
            const obj = this._find.findGameObject(nsid, undefined, skipContained);
            if (obj) {
                const container = obj.getContainer();
                if (container) {
                    if (container.take(obj, above, false)) {
                        obj.setRotation(rot);
                        obj.snapToGround();
                        obj.setObjectType(api_1.ObjectType.Ground);
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
exports.LayoutTableSystemTiles = LayoutTableSystemTiles;
//# sourceMappingURL=layout-table-system-tiles.js.map