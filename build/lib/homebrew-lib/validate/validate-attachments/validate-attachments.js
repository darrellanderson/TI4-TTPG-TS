"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateAttachments = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_validate_1 = require("../abstract-validate/abstract-validate");
class ValidateAttachments extends abstract_validate_1.AbstractValidate {
    getCommandName() {
        return "attachments";
    }
    getDescription() {
        return "Verify attachment objects exist";
    }
    getErrors(errors) {
        const missingTemplateNsids = [];
        let nsids;
        nsids = this._getPlanetAttachmentNsids();
        for (const nsid of nsids) {
            if (!ttpg_darrell_1.Spawn.has(nsid)) {
                missingTemplateNsids.push(nsid);
            }
        }
        nsids = this._getSystemAttachmentNsids();
        for (const nsid of nsids) {
            if (!ttpg_darrell_1.Spawn.has(nsid)) {
                missingTemplateNsids.push(nsid);
            }
        }
        if (missingTemplateNsids.length > 0) {
            errors.push(`Attachments missing templates: ${missingTemplateNsids.join(", ")}`);
        }
    }
    _getPlanetAttachmentNsids() {
        return TI4.planetAttachmentRegistry.getAllNsids();
    }
    _getSystemAttachmentNsids() {
        return TI4.systemAttachmentRegistry.getAllNsids();
    }
}
exports.ValidateAttachments = ValidateAttachments;
//# sourceMappingURL=validate-attachments.js.map