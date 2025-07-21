"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiplomacySystem = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class DiplomacySystem {
    constructor() {
        this._actionName = "*Diplomacy System";
        this._customActionHandler = (systemTileObj, player, actionName) => {
            if (actionName === this._actionName) {
                this.diplomacySystem(systemTileObj, player);
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
    diplomacySystem(systemTileObj, player) {
        let success = true;
        const skipPlayerSlots = this._getExistingCommandTokenOwners(systemTileObj);
        skipPlayerSlots.add(player.getSlot());
        const commandTokenContainers = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "container.token.command:base/generic" &&
                obj instanceof api_1.Container &&
                obj.getOwningPlayerSlot() >= 0 &&
                !skipPlayerSlots.has(obj.getOwningPlayerSlot())) {
                commandTokenContainers.push(obj);
            }
        }
        for (const container of commandTokenContainers) {
            let token = undefined;
            if (container.getNumItems() > 0) {
                const r = 2;
                const pos = systemTileObj
                    .getPosition()
                    .add([0, 0, 10])
                    .add([r * Math.random(), r * Math.random(), 0]);
                token = container.takeAt(0, pos);
            }
            if (!token) {
                const playerSlot = container.getOwningPlayerSlot();
                const colorName = TI4.playerColor.getSlotColorName(playerSlot);
                if (colorName) {
                    ttpg_darrell_1.Broadcast.broadcastAll(`No command tokens available for ${colorName}`, ttpg_darrell_1.Broadcast.ERROR);
                }
                success = false;
            }
        }
        return success;
    }
    _getExistingCommandTokenOwners(systemTileObj) {
        const systemPos = systemTileObj.getPosition();
        const systemHex = TI4.hex.fromPosition(systemPos);
        const existingCommandTokenOwners = new Set();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("token.command:")) {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                if (hex === systemHex) {
                    existingCommandTokenOwners.add(obj.getOwningPlayerSlot());
                }
            }
        }
        return existingCommandTokenOwners;
    }
}
exports.DiplomacySystem = DiplomacySystem;
//# sourceMappingURL=diplomacy-system.js.map