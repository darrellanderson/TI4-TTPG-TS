"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSystems = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_validate_1 = require("../abstract-validate/abstract-validate");
class ValidateSystems extends abstract_validate_1.AbstractValidate {
    getCommandName() {
        return "systems";
    }
    getDescription() {
        return "Verify system tiles have objects";
    }
    getErrors(errors) {
        const tileNumbers = TI4.systemRegistry.getAllSystemTileNumbers();
        const missingTemplateNsids = [];
        for (const tileNumber of tileNumbers) {
            const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
            if (nsid && !ttpg_darrell_1.Spawn.has(nsid)) {
                missingTemplateNsids.push(nsid);
            }
        }
        if (missingTemplateNsids.length > 0) {
            errors.push(`System tiles missing templates: ${missingTemplateNsids.join(", ")}`);
        }
    }
}
exports.ValidateSystems = ValidateSystems;
//# sourceMappingURL=validate-systems.js.map