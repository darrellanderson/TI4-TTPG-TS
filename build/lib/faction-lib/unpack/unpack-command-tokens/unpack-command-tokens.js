"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackCommandTokens = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
class UnpackCommandTokens extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const color = TI4.playerColor.getSlotPlasticColorOrThrow(this.getPlayerSlot());
        // Command tokens in container.
        const commandTokenContainer = this._getCommandTokenContainerOrThrow();
        const commandTokenNsid = this.getFaction().getCommandTokenNsid();
        for (let i = 0; i < 16; i++) {
            const commandToken = ttpg_darrell_1.Spawn.spawnOrThrow(commandTokenNsid);
            commandToken.setOwningPlayerSlot(this.getPlayerSlot());
            commandToken.setTags([`command(${this.getPlayerSlot()})`]);
            commandToken.setPrimaryColor(color);
            commandTokenContainer.insert([commandToken]);
        }
        // Move initial tokens to command sheet.
        const skipContained = true;
        const commandSheet = this._find.findGameObject("sheet:base/command", this.getPlayerSlot(), skipContained);
        if (!commandSheet) {
            throw new Error("Cannot find command sheet");
        }
        const sheetPosArray = [
            // Tactic
            { x: 6.7, y: -2.3, roll: 0 },
            { x: 6.7, y: 0.5, roll: 0 },
            { x: 3.7, y: -1.0, roll: 0 },
            // Fleet
            { x: 4.5, y: 3.8, roll: 180 },
            { x: 2.6, y: 1.8, roll: 180 },
            { x: 1.6, y: 5.4, roll: 180 },
            // Strategy
            { x: -1.3, y: 5.7, roll: 0 },
            { x: -4.3, y: 4.0, roll: 0 },
        ];
        const z = api_1.world.getTableHeight() + 10;
        for (const sheetPos of sheetPosArray) {
            let pos = new api_1.Vector(sheetPos.x, sheetPos.y + 1.5, 0);
            pos = commandSheet.localPositionToWorld(pos);
            pos.z = z;
            const rot = new api_1.Rotator(0, 270, sheetPos.roll);
            const commandToken = commandTokenContainer.takeAt(0, pos);
            if (commandToken) {
                commandToken.setRotation(rot);
                commandToken.snapToGround();
            }
        }
    }
    remove() {
        const commandTokenContainer = this._getCommandTokenContainerOrThrow();
        commandTokenContainer.clear();
        const commandTokenNsid = this.getFaction().getCommandTokenNsid();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === commandTokenNsid &&
                obj.getOwningPlayerSlot() === this.getPlayerSlot()) {
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
            }
        }
    }
    _getCommandTokenContainerOrThrow() {
        const nsid = "container.token.command:base/generic";
        const skipContained = true;
        const container = this._find.findContainer(nsid, this.getPlayerSlot(), skipContained);
        if (!container) {
            throw new Error(`Cannot find container with nsid: ${nsid}`);
        }
        return container;
    }
}
exports.UnpackCommandTokens = UnpackCommandTokens;
//# sourceMappingURL=unpack-command-tokens.js.map