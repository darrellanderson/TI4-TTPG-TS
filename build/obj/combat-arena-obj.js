"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatArenaObj = void 0;
exports.delayedCreateCombatArena = delayedCreateCombatArena;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const on_system_activated_1 = require("../event/on-system-activated/on-system-activated");
const unit_plastic_1 = require("../lib/unit-lib/unit-plastic/unit-plastic");
const ACTION_WARP_IN = "*Warp In";
const ACTION_WARP_OUT = "*Warp Out";
class CombatArenaObj {
    constructor(obj) {
        this._onSystemActivatedHandler = (system, _player) => {
            this._setSystemImage(system.getSystemTileNumber());
        };
        this._obj = obj;
        this._img = new api_1.ImageWidget();
        this._addUI();
        TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
        this._obj.onDestroyed.add(() => {
            TI4.events.onSystemActivated.remove(this._onSystemActivatedHandler);
        });
        this._setSystemImage(18);
        this._obj.addCustomAction(ACTION_WARP_IN);
        this._obj.addCustomAction(ACTION_WARP_OUT);
        this._obj.onCustomAction.add((_obj, _player, actionName) => {
            switch (actionName) {
                case ACTION_WARP_IN:
                    this.warpIn();
                    break;
                case ACTION_WARP_OUT:
                    this.warpOut();
                    break;
            }
        });
    }
    _addUI() {
        const extent = this._obj.getExtent(false, false);
        // Inset slightly, will have a white border.
        const d = Math.max(extent.x, extent.y);
        this._img.setImageSize(d * 20, d * 20);
        const ui = new api_1.UIElement();
        ui.position = new api_1.Vector(0, 0, extent.z + 0.02);
        ui.useWidgetSize = true;
        ui.widget = this._img;
        this._obj.addUI(ui);
    }
    _setSystemImage(systemTileNumber) {
        const system = TI4.systemRegistry.getBySystemTileNumber(systemTileNumber);
        if (system) {
            const img = system.getImg();
            const packageId = system.getImgPackageId();
            this._img.setImage(img, packageId);
        }
    }
    _getPlasticsInSystemOrArena() {
        const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
        if (system) {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            const plastics = unit_plastic_1.UnitPlastic.getAll().filter((plastic) => plastic.getHex() === hex);
            // Sort bottom to top so stacks with plastic on top keep order.
            plastics.sort((a, b) => a.getPos().z - b.getPos().z);
            return plastics;
        }
        return [];
    }
    warpIn() {
        const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
        if (system) {
            const z = api_1.world.getTableHeight() + 10;
            const systemTileObj = system.getObj();
            const arenaExtent = this._obj.getExtent(false, false);
            const tileExtent = systemTileObj.getExtent(false, false);
            const plastics = this._getPlasticsInSystemOrArena();
            for (const plastic of plastics) {
                const localPos = systemTileObj.worldPositionToLocal(plastic.getPos());
                localPos.x *= arenaExtent.x / tileExtent.x;
                localPos.y *= arenaExtent.y / tileExtent.y;
                const dst = this._obj.localPositionToWorld(localPos);
                dst.z = z;
                plastic.getObj().setPosition(dst, 1);
                plastic.getObj().snapToGround();
            }
        }
        else {
            ttpg_darrell_1.Broadcast.broadcastAll("Warp in: no active system", ttpg_darrell_1.Broadcast.ERROR);
        }
    }
    warpOut() {
        const system = on_system_activated_1.OnSystemActivated.getLastActivatedSystem();
        if (system) {
            const z = api_1.world.getTableHeight() + 10;
            const plastics = this._getPlasticsInSystemOrArena();
            for (const plastic of plastics) {
                const dst = plastic.getPos(); // already in system tile (even if obj is in arena)
                dst.z = z;
                plastic.getObj().setPosition(dst, 1);
                plastic.getObj().snapToGround();
            }
        }
        else {
            ttpg_darrell_1.Broadcast.broadcastAll("Warp out: no active system", ttpg_darrell_1.Broadcast.ERROR);
        }
    }
}
exports.CombatArenaObj = CombatArenaObj;
function delayedCreateCombatArena(obj, executionReason) {
    if (executionReason !== "unittest") {
        process.nextTick(() => {
            if (obj.isValid()) {
                new CombatArenaObj(obj);
            }
        });
    }
}
delayedCreateCombatArena(api_1.refObject, api_1.GameWorld.getExecutionReason());
//# sourceMappingURL=combat-arena-obj.js.map