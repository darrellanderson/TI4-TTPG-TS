"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scpt2022 = void 0;
const abstract_scpt_1 = require("../abstract-scpt/abstract-scpt");
const draft_activity_start_params_1 = require("../../draft-activity-start/draft-activity-start-params");
const milty_1 = require("../../drafts/milty");
class Scpt2022 extends abstract_scpt_1.AbstractScpt {
    getLabel() {
        return "#4 (2022)";
    }
    getQual() {
        const slices = [
            "39,35,41,66,74",
            "26,30,59,67,49",
            "27,69,78,64,44",
            "43,61,36,40,73",
            "50,37,76,20,68",
            "65,24,46,79,28",
            "42,25,29,47,62",
        ];
        const labels = [
            "Hope",
            "Golden Corral",
            "Tom Hanks",
            "Live Free or Gash Hard",
            "Mama's Drama",
            "Antimassachusetts",
            "Chili Dogs on the Beach",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 8,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getPrelim() {
        const slices = [
            "28,19,25,43,47",
            "34,77,36,41,64",
            "37,60,39,50,67",
            "42,75,78,59,24",
            "76,66,40,62,44",
            "68,73,79,20,65",
            "46,71,63,31,26",
        ];
        const labels = [
            "Twilight Imperium 4th Edition",
            "The Glass House",
            "Custodian's Gambit",
            "Soft Launch",
            "Grand Opening",
            "Between a Rock and a Slow Place",
            "Winslayer's Dugout",
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
        const slices = [
            "48,25,70,67,28",
            "23,64,33,78,65",
            "21,40,69,50,38",
            "35,39,34,44,61",
            "41,26,30,77,73",
            "72,79,32,22,66",
        ];
        const labels = [
            "Rift of the Valkyries",
            "Drunken Sailor",
            "Jeol Ir: The Entertainer",
            "Public Domain Smooth",
            "Mellon Tell Lodorture",
            "In the Hall of the Asteroid King",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 8,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getFinal() {
        const slices = [
            "79,35,34,64,78",
            "27,29,46,44,25",
            "40,37,31,65,41",
            "39,66,69,47,74",
            "48,76,68,20,19",
            "67,28,49,73,26",
        ];
        const labels = [
            "NekroDiesTwice",
            "NerfZerg",
            "Mantis",
            "Jonno",
            "nerdY2K",
            "codytct",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 8,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
}
exports.Scpt2022 = Scpt2022;
//# sourceMappingURL=scpt-2022.js.map