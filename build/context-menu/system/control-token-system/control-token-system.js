"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlTokenSystem = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class ControlTokenSystem {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._actionName = "*Add Control Token";
        this._customActionHandler = (obj, player, actionName) => {
            if (actionName === this._actionName) {
                this.addControlToken(obj, player);
            }
        };
    }
    init() {
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeAddContextMenuItem(obj);
        }
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeAddContextMenuItem(obj);
        });
    }
    _maybeAddContextMenuItem(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("tile.system:")) {
            obj.removeCustomAction(this._actionName);
            obj.addCustomAction(this._actionName);
            obj.onCustomAction.remove(this._customActionHandler);
            obj.onCustomAction.add(this._customActionHandler);
        }
    }
    addControlToken(systemTileObj, player) {
        const container = this._find.findContainer("container.token.control:base/generic", player.getSlot());
        if (!container) {
            return false;
        }
        const pos = systemTileObj.getPosition().add([0, 0, 10]);
        const token = container.takeAt(0, pos);
        if (!token) {
            return false;
        }
        token.snapToGround();
        return true;
    }
}
exports.ControlTokenSystem = ControlTokenSystem;
//# sourceMappingURL=control-token-system.js.map