"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrubAll = scrubAll;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
function scrubAll(preserveThisObj) {
    // Destroy objects inside containers.  Destroying a container destroys the
    // contents "normally", potentially triggering deleted items treatment.
    for (const obj of api_1.world.getAllObjects(false)) {
        if (obj !== preserveThisObj && obj.getContainer()) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        }
    }
    for (const obj of api_1.world.getAllObjects(true)) {
        if (obj !== preserveThisObj) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        }
    }
    for (const line of api_1.world.getDrawingLines()) {
        api_1.world.removeDrawingLineObject(line);
    }
    for (const zone of api_1.world.getAllZones()) {
        zone.destroy();
    }
}
//# sourceMappingURL=scrub-all.js.map