"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutStrategyCards = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutStrategyCards {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const mat = ttpg_darrell_1.Spawn.spawnOrThrow("mat:base/strategy-card");
        mat.setRotation([0, -90, 0]); // mat model is rotated
        const strategyCardNsids = [
            "tile.strategy-card:base/leadership",
            "tile.strategy-card:codex.ordinian/diplomacy",
            "tile.strategy-card:base/politics",
            "tile.strategy-card:pok/construction",
            "tile.strategy-card:base/trade",
            "tile.strategy-card:base/warfare",
            "tile.strategy-card:base/technology",
            "tile.strategy-card:base/imperial",
        ];
        const strategyCards = strategyCardNsids.map((nsid) => {
            return ttpg_darrell_1.Spawn.spawnOrThrow(nsid);
        });
        this._layout.add(mat);
        this._layout.addAfterLayout(() => {
            mat.setObjectType(api_1.ObjectType.Ground);
            const snapPoints = mat.getAllSnapPoints();
            strategyCards.forEach((strategyCard, index) => {
                const snapPoint = snapPoints[index];
                this._placeStrategyCard(strategyCard, snapPoint);
            });
        });
    }
    getLayout() {
        return this._layout;
    }
    _placeStrategyCard(strategyCard, snapPoint) {
        if (snapPoint) {
            const above = snapPoint
                .getGlobalPosition()
                .add(new api_1.Vector(0, 0, 10));
            strategyCard.setPosition(above);
            strategyCard.snapToGround();
            strategyCard.snap();
        }
    }
}
exports.LayoutStrategyCards = LayoutStrategyCards;
//# sourceMappingURL=layout-strategy-cards.js.map