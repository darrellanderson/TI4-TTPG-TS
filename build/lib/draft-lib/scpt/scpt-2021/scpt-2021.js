"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scpt2021 = void 0;
const abstract_scpt_1 = require("../abstract-scpt/abstract-scpt");
const draft_activity_start_params_1 = require("../../draft-activity-start/draft-activity-start-params");
const milty_1 = require("../../drafts/milty");
class Scpt2021 extends abstract_scpt_1.AbstractScpt {
    getLabel() {
        return "#3 (2021)";
    }
    getQual() {
        return undefined;
    }
    getPrelim() {
        const slices = [
            "30,72,49,79,59",
            "29,66,50,80,31",
            "70,36,40,67,63",
            "73,76,48,45,26",
            "74,69,47,41,61",
            "37,65,46,68,64",
        ];
        const labels = [
            "Malcom In the Middle",
            "Grape Nuts",
            "Old Money",
            "Sonic the Hedgehog",
            "It's the real thing",
            "Vanilla Pizza",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 8,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getSemi() {
        return undefined;
    }
    getFinal() {
        return undefined;
    }
}
exports.Scpt2021 = Scpt2021;
//# sourceMappingURL=scpt-2021.js.map