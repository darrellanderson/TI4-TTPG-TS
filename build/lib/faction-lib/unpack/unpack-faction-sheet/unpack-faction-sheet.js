"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackFactionSheet = void 0;
const api_1 = require("@tabletop-playground/api");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const ttpg_darrell_1 = require("ttpg-darrell");
const GENERIC_FACTION_SHEET_NSID = "sheet.faction:base/generic";
class UnpackFactionSheet extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const skipContained = true;
        const generic = this._find.findGameObject(GENERIC_FACTION_SHEET_NSID, this.getPlayerSlot(), skipContained);
        if (!generic) {
            throw new Error(`Could not find generic faction sheet for ${this.getPlayerSlot()}`);
        }
        const pos = generic.getPosition().add([0, 0, 10]);
        const nsid = this.getFaction().getFactionSheetNsid();
        const factionSheet = ttpg_darrell_1.Spawn.spawnOrThrow(nsid, pos);
        factionSheet.setOwningPlayerSlot(this.getPlayerSlot());
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(generic);
        factionSheet.snapToGround();
        factionSheet.setObjectType(api_1.ObjectType.Ground);
    }
    remove() {
        const skipContained = true;
        const factionSheet = this._find.findGameObject(this.getFaction().getFactionSheetNsid(), this.getPlayerSlot(), skipContained);
        if (!factionSheet) {
            throw new Error(`Could not find faction sheet for ${this.getPlayerSlot()}`);
        }
        const pos = factionSheet.getPosition().add([0, 0, 10]);
        const nsid = GENERIC_FACTION_SHEET_NSID;
        const generic = ttpg_darrell_1.Spawn.spawnOrThrow(nsid, pos);
        generic.setOwningPlayerSlot(this.getPlayerSlot());
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(factionSheet);
        generic.snapToGround();
        generic.setObjectType(api_1.ObjectType.Ground);
    }
}
exports.UnpackFactionSheet = UnpackFactionSheet;
//# sourceMappingURL=unpack-faction-sheet.js.map