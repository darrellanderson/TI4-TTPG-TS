"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wekker = exports.WEKKER_SLICE_SHAPE_L = exports.WEKKER_SLICE_SHAPE_R = exports.WEKKER_SLICE_SHAPE = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const draft_state_1 = require("../draft-state/draft-state");
const milty_1 = require("./milty");
exports.WEKKER_SLICE_SHAPE = [
    "<0,0,0>", //home
    "<0,2,-2>", // right-right [0]
    "<0,1,-1>", // right [1]
    "<1,0,-1>", // front [2]
    "<2,-1,-1>", // left-eq [3]
    "<3,-1,-2>", // left-far [4]
];
exports.WEKKER_SLICE_SHAPE_R = [
    "<0,0,0>", //home
    "<0,2,-2>", // right-right
    "<0,1,-1>", // right
    "<1,0,-1>", // front
    "<3,-3,0>",
    "<4,-1,-3>",
];
exports.WEKKER_SLICE_SHAPE_L = [
    "<0,0,0>", //home
    "<2,3,-5>",
    "<0,1,-1>", // right
    "<1,0,-1>", // front
    "<2,-1,-1>", // left-eq
    "<3,-1,-2>", // left-far
];
class Wekker {
    isEnabled() {
        return true;
    }
    getDraftName() {
        return "Wekker Draft";
    }
    getGenerateSlicesParams() {
        return {
            sliceMakeups: [milty_1.MILTY_SLICE_MAKEUP],
            sliceShape: exports.WEKKER_SLICE_SHAPE,
            minAlphaWormholes: new ttpg_darrell_1.WeightedChoice([
                { weight: 1, value: 2 },
                { weight: 1, value: 3 },
            ]).choice(),
            minBetaWormholes: new ttpg_darrell_1.WeightedChoice([
                { weight: 1, value: 2 },
                { weight: 1, value: 3 },
            ]).choice(),
            minLegendary: new ttpg_darrell_1.WeightedChoice([
                { weight: 1, value: 1 },
                { weight: 1, value: 2 },
            ]).choice(),
        };
    }
    /**
     * Create the draft state with slice shapes.
     * Does not generate slices, factions, etc.
     *
     * @param namespaceId
     * @returns
     */
    createEmptyDraftState(namespaceId) {
        const draftState = new draft_state_1.DraftState(namespaceId);
        draftState.setSliceShape(exports.WEKKER_SLICE_SHAPE);
        if (TI4.config.playerCount === 7) {
            draftState.overrideSliceShape(0, exports.WEKKER_SLICE_SHAPE_R);
            draftState.overrideSliceShape(1, exports.WEKKER_SLICE_SHAPE_L);
        }
        else if (TI4.config.playerCount === 8) {
            draftState.overrideSliceShape(0, exports.WEKKER_SLICE_SHAPE_R);
            draftState.overrideSliceShape(1, exports.WEKKER_SLICE_SHAPE_L);
            draftState.overrideSliceShape(2, exports.WEKKER_SLICE_SHAPE_R);
            draftState.overrideSliceShape(3, exports.WEKKER_SLICE_SHAPE_L);
        }
        return draftState;
    }
}
exports.Wekker = Wekker;
//# sourceMappingURL=wekker.js.map