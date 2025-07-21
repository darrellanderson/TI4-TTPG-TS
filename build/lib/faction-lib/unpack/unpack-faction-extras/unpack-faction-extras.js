"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackFactionExtras = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
class UnpackFactionExtras extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const extrasContainer = this._getFactionExtrasContainerOrThrow();
        const faction = this.getFaction();
        const nsids = faction.getExtras();
        for (const nsid of nsids) {
            const count = faction.getExtraCount(nsid);
            for (let i = 0; i < count; i++) {
                const obj = ttpg_darrell_1.Spawn.spawnOrThrow(nsid);
                extrasContainer.insert([obj]);
            }
        }
    }
    remove() {
        const extrasContainer = this._getFactionExtrasContainerOrThrow();
        const above = extrasContainer.getPosition().add([0, 0, 10]);
        const items = extrasContainer.getItems();
        for (const item of items) {
            extrasContainer.take(item, above);
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(item);
        }
    }
    _getFactionExtrasContainerOrThrow() {
        const skipContained = true;
        const extrasContainer = this._find.findContainer("container:base/faction-extras", this.getPlayerSlot(), skipContained);
        if (!extrasContainer) {
            throw new Error("Faction extras container not found");
        }
        return extrasContainer;
    }
}
exports.UnpackFactionExtras = UnpackFactionExtras;
//# sourceMappingURL=unpack-faction-extras.js.map