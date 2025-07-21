"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateSystem = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const command_token_counter_1 = require("../../../lib/command-token-lib/command-token-counter/command-token-counter");
class ActivateSystem {
    constructor() {
        this._actionName = "*Activate System";
        this._customActionHandler = (systemTileObj, player, actionName) => {
            if (actionName === this._actionName) {
                this.moveCommandTokenToSystem(systemTileObj, player);
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
    moveCommandTokenToSystem(systemTileObj, player) {
        const id = systemTileObj.getId();
        const system = TI4.systemRegistry.getBySystemTileObjId(id);
        if (!system) {
            return false;
        }
        const counter = new command_token_counter_1.CommandTokenCounter();
        const playerSlotToCommandTokenCounts = counter.getPlayerSlotToCommandTokenCounts();
        const commandTokenCounts = playerSlotToCommandTokenCounts.get(player.getSlot());
        const token = commandTokenCounts === null || commandTokenCounts === void 0 ? void 0 : commandTokenCounts.tactic.pop();
        if (!token) {
            ttpg_darrell_1.Broadcast.broadcastAll("No command tokens available", ttpg_darrell_1.Broadcast.ERROR);
            return false;
        }
        const pos = systemTileObj.getPosition().add([0, 0, 10]);
        token.setPosition(pos, 1);
        token.snapToGround();
        TI4.events.onSystemActivated.trigger(system, player);
        return true;
    }
}
exports.ActivateSystem = ActivateSystem;
//# sourceMappingURL=activate-system.js.map