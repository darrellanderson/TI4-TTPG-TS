"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagDraft = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const generate_slices_1 = require("../generate-slices/generate-slices");
const milty_1 = require("./milty");
class BagDraft {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._containerNsid = "container:base/bag-draft";
    }
    isEnabled() {
        return true;
    }
    getDraftName() {
        return "Bag Draft";
    }
    getGenerateSlicesParams() {
        return new milty_1.Milty().getGenerateSlicesParams();
    }
    /**
     * DOES NOT USE THIS FUNCTION, spawns containers with system tiles
     * in each player area.
     *
     * @param namespaceId
     */
    createEmptyDraftState(_namespaceId) {
        throw new Error("Method not implemented.");
    }
    _getSlices() {
        return new generate_slices_1.GenerateSlices(this.getGenerateSlicesParams()).generateSlices(TI4.config.playerCount);
    }
    _createContainer(playerSlot) {
        const cardHolder = this._find.findCardHolderBySlot(playerSlot);
        if (!cardHolder) {
            throw new Error("Card holder not found");
        }
        const pos = TI4.playerSeats.getDealPosition(playerSlot);
        const above = pos.add([0, 0, 10]);
        const nsid = this._containerNsid;
        const container = ttpg_darrell_1.Spawn.spawn(nsid, above);
        if (!container || !(container instanceof api_1.Container)) {
            throw new Error("Container not created or not a Container");
        }
        container.snapToGround();
        return container;
    }
    _fillContainer(container, slice) {
        const tileSet = new Set(slice);
        const skipContained = false;
        const systems = TI4.systemRegistry
            .getAllSystemsWithObjs(skipContained)
            .filter((system) => {
            return tileSet.has(system.getSystemTileNumber());
        });
        if (systems.length !== slice.length) {
            throw new Error("missing systems");
        }
        systems.forEach((system) => {
            const obj = system.getObj();
            const containedIn = obj.getContainer();
            if (containedIn) {
                const pos = containedIn.getPosition().add([0, 0, 10]);
                containedIn.take(obj, pos);
            }
            container.addObjects([obj]);
        });
    }
    setContainerNsid(nsid) {
        this._containerNsid = nsid;
        return this;
    }
    createDraftObjects() {
        const slices = this._getSlices();
        slices.forEach((slice, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(seatIndex);
            const container = this._createContainer(playerSlot);
            this._fillContainer(container, slice);
        });
    }
}
exports.BagDraft = BagDraft;
//# sourceMappingURL=bag-draft.js.map