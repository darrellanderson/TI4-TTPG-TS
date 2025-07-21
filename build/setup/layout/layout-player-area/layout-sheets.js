"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutSheets = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutSheets {
    constructor(playerSlot) {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const colorLib = new ttpg_darrell_1.ColorLib();
        const colorsType = colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
        const objColor = colorLib.parseColorOrThrow(colorsType.plastic);
        const leaderSheet = ttpg_darrell_1.Spawn.spawnOrThrow("sheet:pok/leader");
        const factionSheet = ttpg_darrell_1.Spawn.spawnOrThrow("sheet.faction:base/generic");
        const commandSheet = ttpg_darrell_1.Spawn.spawnOrThrow("sheet:base/command");
        leaderSheet.setOwningPlayerSlot(playerSlot);
        leaderSheet.setPrimaryColor(objColor);
        factionSheet.setOwningPlayerSlot(playerSlot);
        commandSheet.setOwningPlayerSlot(playerSlot);
        commandSheet.setPrimaryColor(objColor);
        const leaderLayout = new ttpg_darrell_1.LayoutObjects().add(leaderSheet);
        this._layout
            .setChildDistance(-6)
            .add(leaderLayout)
            .add(factionSheet)
            .add(commandSheet);
        this._layout.addAfterLayout(() => {
            const pos = factionSheet.getPosition();
            const above = pos.add(new api_1.Vector(0, 0, 1));
            factionSheet.setPosition(above);
            leaderSheet.snapToGround();
            factionSheet.snapToGround();
            commandSheet.snapToGround();
            leaderSheet.setObjectType(api_1.ObjectType.Ground);
            factionSheet.setObjectType(api_1.ObjectType.Ground);
            commandSheet.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutSheets = LayoutSheets;
//# sourceMappingURL=layout-sheets.js.map