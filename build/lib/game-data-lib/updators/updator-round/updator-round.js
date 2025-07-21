"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorRound = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorRound {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        const owningPlaayerSlot = undefined;
        const skipContained = true;
        const mat1 = this._find.findGameObject("mat:base/objective-1", owningPlaayerSlot, skipContained);
        const mat2 = this._find.findGameObject("mat:base/objective-2", owningPlaayerSlot, skipContained);
        const mats = [mat1, mat2].filter((m) => m !== undefined);
        const snapPoints = [];
        mats.forEach((mat) => {
            mat.getAllSnapPoints().forEach((snapPoint) => {
                const tags = snapPoint.getTags();
                if ((tags.includes("card-objective-1") &&
                    !tags.includes("deck-objective-1")) ||
                    (tags.includes("card-objective-2") &&
                        !tags.includes("deck-objective-2"))) {
                    snapPoints.push(snapPoint);
                }
            });
        });
        let round = -1;
        snapPoints.forEach((snapPoint) => {
            const obj = snapPoint.getSnappedObject();
            if (obj) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                if (nsid.startsWith("card.objective.public")) {
                    round += 1;
                }
            }
        });
        gameData.round = Math.max(round, 0);
    }
}
exports.UpdatorRound = UpdatorRound;
//# sourceMappingURL=updator-round.js.map