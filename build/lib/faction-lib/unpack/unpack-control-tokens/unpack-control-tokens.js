"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackControlTokens = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const scoreboard_1 = require("../../../score-lib/scoreboard/scoreboard");
class UnpackControlTokens extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const color = TI4.playerColor.getSlotPlasticColorOrThrow(this.getPlayerSlot());
        // Control token in container.
        const controlTokenContainer = this._getControlTokenContainerOrThrow();
        const controlTokenNsid = this.getFaction().getControlTokenNsid();
        const controlToken = ttpg_darrell_1.Spawn.spawnOrThrow(controlTokenNsid);
        controlToken.setOwningPlayerSlot(this.getPlayerSlot());
        controlToken.setTags([`control(${this.getPlayerSlot()})`]);
        controlToken.setPrimaryColor(color);
        controlTokenContainer.insert([controlToken]);
        // Control token on scoreboard.
        const scoreboard = new scoreboard_1.Scoreboard();
        const pos = scoreboard.scoreToPos(0, this.getPlayerSlot());
        const rot = scoreboard.getControlTokenRotation();
        if (!pos || !rot) {
            throw new Error("Cannot find scoreboard control token position and/or rotation");
        }
        pos.z = api_1.world.getTableHeight() + 10;
        const scoreboardToken = ttpg_darrell_1.Spawn.spawnOrThrow(controlTokenNsid, pos, rot);
        scoreboardToken.setOwningPlayerSlot(this.getPlayerSlot());
        scoreboardToken.setTags([`control(${this.getPlayerSlot()})`]);
        scoreboardToken.setPrimaryColor(color);
        scoreboardToken.snapToGround();
    }
    remove() {
        const controlTokenContainer = this._getControlTokenContainerOrThrow();
        controlTokenContainer.clear();
        const controlTokenNsid = this.getFaction().getControlTokenNsid();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === controlTokenNsid &&
                obj.getOwningPlayerSlot() === this.getPlayerSlot()) {
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
            }
        }
    }
    _getControlTokenContainerOrThrow() {
        const nsid = "container.token.control:base/generic";
        const skipContained = true;
        const container = this._find.findContainer(nsid, this.getPlayerSlot(), skipContained);
        if (!container) {
            throw new Error(`Cannot find container with nsid: ${nsid}`);
        }
        return container;
    }
}
exports.UnpackControlTokens = UnpackControlTokens;
//# sourceMappingURL=unpack-control-tokens.js.map