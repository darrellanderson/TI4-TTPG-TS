"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTemplateNsids = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_validate_1 = require("../abstract-validate/abstract-validate");
/**
 * Verify all non-deck spawn NSIDs match the resulting object NSIDs.
 * Careful with this, objects may have scripts.
 */
class ValidateTemplateNsids extends abstract_validate_1.AbstractValidate {
    getCommandName() {
        return "template-nsids";
    }
    getDescription() {
        return "Validate spawn registry NSIDs match the NSIDs for the spawned objects (except cards/decks).";
    }
    getErrors(errors) {
        const nsids = ttpg_darrell_1.Spawn.getAllNsids();
        for (const nsid of nsids) {
            const error = this._checkNsid(nsid);
            if (error) {
                errors.push(error);
            }
        }
    }
    /**
     * If the NSID isn't a card, verity the resulting object has that
     * NSID.  Return an error message, or undefined if it matches.
     *
     * @param nsid
     */
    _checkNsid(nsid) {
        if (nsid === "default") {
            return undefined; // Skip the default NSID, it is a special case.
        }
        const obj = ttpg_darrell_1.Spawn.spawn(nsid);
        if (!obj && !nsid.startsWith("table:")) {
            return `NSID "${nsid}" does not spawn an object`;
        }
        if (obj && !(obj instanceof api_1.Card)) {
            const detectedNsid = ttpg_darrell_1.NSID.get(obj);
            if (detectedNsid !== nsid) {
                return `Registered NSID "${nsid}" creates object with NSID "${detectedNsid}"`;
            }
        }
        if (obj) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        }
    }
}
exports.ValidateTemplateNsids = ValidateTemplateNsids;
//# sourceMappingURL=validate-template-nsids.js.map