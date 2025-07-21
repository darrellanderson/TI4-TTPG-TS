"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scpt2024 = void 0;
const abstract_scpt_1 = require("../abstract-scpt/abstract-scpt");
const draft_activity_start_params_1 = require("../../draft-activity-start/draft-activity-start-params");
const milty_1 = require("../../drafts/milty");
class Scpt2024 extends abstract_scpt_1.AbstractScpt {
    getLabel() {
        return "#6 (2024)";
    }
    getQual() {
        const slices = [
            "32,66,68,63,39",
            "26,76,49,19,41",
            "64,35,65,22,79",
            "50,37,45,61,36",
            "25,73,78,59,62",
            "72,75,80,21,40",
        ];
        const labels = [
            "101 Dal Boothas",
            "Will",
            "Tharma $AMPERSAND Breg",
            "Yellow Slice Because It Has 2 Reds",
            "Give Me Integrated or Give Me Death",
            "Devil Went Down to Velnor",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 6,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getPrelim() {
        const slices = [
            "33,62,41,25,32",
            "44,36,19,40,72",
            "45,70,35,64,78",
            "50,74,65,26,63",
            "69,21,23,79,48",
            "38,59,42,39,24",
        ];
        const labels = [
            "Corneeqticut",
            "Lorxembourg",
            "Siigney",
            "Vorhalabama",
            "Düssaudorf",
            "New South Vails",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 6,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getSemi() {
        const slices = [
            "64,32,42,70,67", // 3
            "23,79,75,62,50", // 2
            "68,49,36,25,63", // 1
            "20,27,59,40,41", // 6
            "39,66,19,48,76", // 4
            "26,74,78,24,43", // 5
        ];
        const labels = [
            "SLICE",
            "SLICE",
            "SLICE",
            "SLICE",
            "SLICE",
            "SLICE",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 6,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getFinal() {
        const slices = [
            "34,22,67,77,66",
            "41,32,47,59,69",
            "35,25,44,73,49",
            "40,75,42,24,26",
            "39,76,62,43,64",
            "27,50,72,79,65",
        ];
        const labels = [
            "Slice 1",
            "Slice 2",
            "Slice 3",
            "Slice 4",
            "Slice 5",
            "Slice 6",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 6,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
}
exports.Scpt2024 = Scpt2024;
//# sourceMappingURL=scpt-2024.js.map