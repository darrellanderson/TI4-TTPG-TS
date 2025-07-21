"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milty = exports.MILTY_SLICE_SHAPE_ALT = exports.MILTY_SLICE_SHAPE = exports.MILTY_SLICE_MAKEUP = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const draft_state_1 = require("../draft-state/draft-state");
exports.MILTY_SLICE_MAKEUP = [
    "high",
    "med",
    "low",
    "red",
    "red",
];
exports.MILTY_SLICE_SHAPE = [
    "<0,0,0>", // home system
    "<1,-1,0>", // left
    "<1,0,-1>", // front
    "<0,1,-1>", // right
    "<2,-1,-1>", // left-eq
    "<2,0,-2>", // front-far
];
// 7p seat index 3,
// 8p seat index 3 and 7
exports.MILTY_SLICE_SHAPE_ALT = [
    "<0,0,0>", // home system
    "<1,-1,0>", // left
    "<2,0,-2>", // front (pushed forward)
    "<1,0,-1>", // right (pushed forward)
    "<2,-1,-1>", // left-eq
    "<3,-1,-2>", // front-far (pushed forward)
];
class Milty {
    isEnabled() {
        return true;
    }
    getDraftName() {
        return "Milty Draft";
    }
    getGenerateSlicesParams() {
        return {
            sliceMakeups: [exports.MILTY_SLICE_MAKEUP],
            sliceShape: exports.MILTY_SLICE_SHAPE,
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
        draftState.setSliceShape(exports.MILTY_SLICE_SHAPE);
        if (TI4.config.playerCount === 7) {
            draftState.overrideSliceShape(3, exports.MILTY_SLICE_SHAPE_ALT);
        }
        else if (TI4.config.playerCount === 8) {
            draftState.overrideSliceShape(3, exports.MILTY_SLICE_SHAPE_ALT);
            draftState.overrideSliceShape(7, exports.MILTY_SLICE_SHAPE_ALT);
        }
        return draftState;
    }
}
exports.Milty = Milty;
//# sourceMappingURL=milty.js.map