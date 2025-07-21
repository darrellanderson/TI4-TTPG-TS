"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleStrategyCard = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleStrategyCard extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super(...arguments);
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        return nsid.startsWith("tile.strategy-card:");
    }
    recycle(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (!nsid.startsWith("tile.strategy-card:")) {
            return false;
        }
        const names = [
            "leadership",
            "diplomacy",
            "politics",
            "construction",
            "trade",
            "warfare",
            "technology",
            "imperial",
        ];
        const parsed = ttpg_darrell_1.NSID.parse(nsid);
        const nameFirst = parsed === null || parsed === void 0 ? void 0 : parsed.nameParts[0];
        const strategyCardIndex = nameFirst ? names.indexOf(nameFirst) : -1;
        if (strategyCardIndex === -1) {
            return false; // not a valid strategy card
        }
        const mat = this._find.findGameObject("mat:base/strategy-card");
        if (!mat) {
            return false;
        }
        const snapPoint = mat.getAllSnapPoints()[strategyCardIndex];
        if (!snapPoint) {
            return false;
        }
        const above = snapPoint
            .getGlobalPosition()
            .add(new api_1.Vector(0, 0, 10));
        const current = obj.getPosition();
        const dx = Math.abs(current.x - above.x);
        const dy = Math.abs(current.y - above.y);
        if (dx < 0.1 && dy < 0.1) {
            return true; // already at pos (possibly with tradegoods on top)
        }
        obj.setPosition(above);
        obj.setRotation([0, 0, 0]);
        obj.snapToGround();
        obj.snap();
        return true;
    }
}
exports.RecycleStrategyCard = RecycleStrategyCard;
//# sourceMappingURL=recycle-strategy-card.js.map