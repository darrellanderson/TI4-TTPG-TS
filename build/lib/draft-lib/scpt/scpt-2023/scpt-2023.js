"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scpt2023 = void 0;
const abstract_scpt_1 = require("../abstract-scpt/abstract-scpt");
const draft_activity_start_params_1 = require("../../draft-activity-start/draft-activity-start-params");
const milty_1 = require("../../drafts/milty");
class Scpt2023 extends abstract_scpt_1.AbstractScpt {
    getLabel() {
        return "#5 (2023)";
    }
    getQual() {
        const slices = [
            "30,63,46,67,61",
            "21,66,69,40,80",
            "27,23,48,79,62",
            "35,78,42,26,72",
            "45,75,24,64,50",
            "31,37,49,25,41",
            "65,47,59,39,36",
        ];
        const labels = [
            "Vorhallywood",
            "No Country for Hope's End",
            "Synecdoche, New Albion",
            "Lirta IV: The Voyage Home",
            "Three Little Devils",
            "Gravity's Blindside",
            "More-d'Or",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 7,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getPrelim() {
        const slices = [
            "63,40,72,46,68",
            "45,64,34,62,49",
            "36,25,24,50,41",
            "48,22,66,79,32",
            "39,61,59,43,71",
            "42,26,73,78,21",
            "47,70,65,44,19",
        ];
        const labels = [
            "Gone Girl",
            "Big-Lore, Not Four",
            "DOOT DOOT!",
            "Ginger As She Goes",
            "It's Finger",
            "It's Pronounced Kay All Dree",
            "It's Pronounced Celery",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 7,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getSemi() {
        const slices = [
            "75,59,48,66,39",
            "47,69,79,19,30",
            "64,50,29,42,72",
            "25,37,46,41,71",
            "49,34,26,67,27",
            "45,24,28,38,40",
            "35,78,76,43,65",
        ];
        const labels = [
            "Hope's End Pursuits",
            "Lickin' Good",
            "We'll Always Have Atlas",
            "Ba'kal Good Things",
            "Encounter at Starpoint",
            "Shades of Meh...ar Xull",
            "The Most of Best Worlds",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 7,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
    getFinal() {
        const slices = [
            "77,22,59,67,65",
            "46,25,29,31,45",
            "78,64,74,37,41",
            "61,40,70,68,36",
            "73,39,24,80,71",
            "42,26,72,35,47",
            "49,79,28,62,76",
        ];
        const labels = [
            "Slice 1",
            "Slice 2",
            "Slice 3",
            "Slice 4",
            "Slice 5",
            "Slice 6",
            "Slice 7",
        ];
        return {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: slices.length,
            numFactions: 7,
            config: `${slices.join("|")}&labels=${labels.join("|")}`,
        };
    }
}
exports.Scpt2023 = Scpt2023;
//# sourceMappingURL=scpt-2023.js.map