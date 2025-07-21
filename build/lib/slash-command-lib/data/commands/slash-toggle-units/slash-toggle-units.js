"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashToggleUnits = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class SlashToggleUnits {
    getSlashCommand() {
        return "/toggleunits";
    }
    getDescription() {
        return "Toggle units between their plastic and token versions.";
    }
    isHostOnly() {
        return true;
    }
    run(_argv, _player) {
        // Get all units, even in containers.
        const units = [];
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("unit:")) {
                units.push(obj);
            }
        }
        // Replace with alt version.
        for (const oldUnit of units) {
            const oldNsid = ttpg_darrell_1.NSID.get(oldUnit);
            let newNsid;
            if (oldNsid.endsWith(".token")) {
                newNsid = oldNsid.replace(/\.token$/, "");
            }
            else {
                newNsid = `${oldNsid}.token`;
            }
            const container = oldUnit.getContainer();
            const pos = oldUnit.getPosition();
            const rot = oldUnit.getRotation();
            const color = oldUnit.getPrimaryColor();
            const owner = oldUnit.getOwningPlayerSlot();
            const objType = oldUnit.getObjectType();
            const tags = oldUnit.getTags();
            if (container) {
                const above = container.getPosition().add([0, 0, 10]);
                container.take(oldUnit, above);
            }
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(oldUnit);
            // Plastic/tokens have different heights, spawn above and snap down.
            const newUnit = ttpg_darrell_1.Spawn.spawn(newNsid, pos.add([0, 0, 3]), rot);
            if (newUnit) {
                newUnit.snapToGround();
                newUnit.setPrimaryColor(color);
                newUnit.setOwningPlayerSlot(owner);
                newUnit.setObjectType(objType);
                newUnit.setTags(tags);
                if (container) {
                    container.addObjects([newUnit]);
                }
            }
        }
    }
}
exports.SlashToggleUnits = SlashToggleUnits;
//# sourceMappingURL=slash-toggle-units.js.map