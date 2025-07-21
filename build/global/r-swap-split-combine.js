"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSwapSplitCombine = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class RSwapSplitCombine extends ttpg_darrell_1.SwapSplitCombine {
    constructor() {
        super([
            {
                src: {
                    nsids: ["token:base/infantry-1", "unit:base/infantry"],
                    count: 3,
                },
                dst: { nsid: "token:base/infantry-3", count: 1 },
                repeat: true,
            },
            {
                src: { nsids: ["token:base/fighter-1", "unit:base/fighter"], count: 3 },
                dst: { nsid: "token:base/fighter-3", count: 1 },
                repeat: true,
            },
            {
                src: { nsids: ["token:base/tradegood-commodity-1"], count: 3 },
                dst: { nsid: "token:base/tradegood-commodity-3", count: 1 },
                requireFaceUp: true,
                repeat: true,
            },
            {
                src: { nsids: ["token:base/tradegood-commodity-1"], count: 3 },
                dst: { nsid: "token:base/tradegood-commodity-3", count: 1 },
                requireFaceDown: true,
                repeat: true,
            },
            {
                src: { nsids: ["token:base/infantry-3"], count: 1 },
                dst: { nsid: "token:base/infantry-1", count: 3 },
                repeat: false,
            },
            {
                src: { nsids: ["token:base/fighter-3"], count: 1 },
                dst: { nsid: "token:base/fighter-1", count: 3 },
                repeat: false,
            },
            {
                src: { nsids: ["token:base/tradegood-commodity-3"], count: 1 },
                dst: { nsid: "token:base/tradegood-commodity-1", count: 3 },
                requireFaceUp: true,
                repeat: false,
            },
            {
                src: { nsids: ["token:base/tradegood-commodity-3"], count: 1 },
                dst: { nsid: "token:base/tradegood-commodity-1", count: 3 },
                requireFaceDown: true,
                repeat: false,
            },
            {
                src: { nsids: ["token:base/fighter-1"], count: 1 },
                dst: { nsid: "unit:base/fighter", count: 1 },
                repeat: false,
            },
            {
                src: { nsids: ["token:base/infantry-1"], count: 1 },
                dst: { nsid: "unit:base/infantry", count: 1 },
                repeat: false,
            },
            {
                src: { nsids: ["unit:base/fighter"], count: 1 },
                dst: { nsid: "token:base/fighter-1", count: 1 },
                repeat: false,
            },
            {
                src: { nsids: ["unit:base/infantry"], count: 1 },
                dst: { nsid: "token:base/infantry-1", count: 1 },
                repeat: false,
            },
        ]);
        this._find = new ttpg_darrell_1.Find();
        this.addOverrideCreate("unit:base/fighter", (player) => {
            return this.getPlastic("fighter", player);
        });
        this.addOverrideCreate("unit:base/infantry", (player) => {
            return this.getPlastic("infantry", player);
        });
        this.addOverrideDestroy("unit:base/fighter", (obj, player) => {
            this.putPlastic("fighter", player, obj);
        });
        this.addOverrideDestroy("unit:base/infantry", (obj, player) => {
            this.putPlastic("infantry", player, obj);
        });
    }
    getPlasticContainer(unit, player) {
        const playerSlot = player.getSlot();
        const nsid = `container.unit:base/${unit}`;
        const skipContained = true;
        const container = this._find.findContainer(nsid, playerSlot, skipContained);
        return container;
    }
    getPlastic(unit, player) {
        const container = this.getPlasticContainer(unit, player);
        let result = undefined;
        if (container && container.getNumItems() > 0) {
            result = container.takeAt(0, [0, 0, 0]);
        }
        return result;
    }
    putPlastic(unit, player, obj) {
        const container = this.getPlasticContainer(unit, player);
        let result = false;
        if (container) {
            container.insert([obj]);
            result = true;
        }
        return result;
    }
}
exports.RSwapSplitCombine = RSwapSplitCombine;
//# sourceMappingURL=r-swap-split-combine.js.map