"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutUnitBoxes = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_unit_box_1 = require("./layout-unit-box");
const api_1 = require("@tabletop-playground/api");
const NUM_COLS = 3;
class LayoutUnitBoxes {
    constructor(playerSlot, numCols = NUM_COLS) {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        this._layout.setChildDistance(layout_config_1.LayoutConfig.spacing).setIsVertical(true);
        const units = [
            "war-sun",
            "flagship",
            "dreadnought",
            "cruiser",
            "destroyer",
            "carrier",
            "pds",
            "space-dock",
            "fighter",
            "infantry",
            "mech",
        ];
        let row;
        units.forEach((unit, index) => {
            if (index % numCols === 0) {
                row = new ttpg_darrell_1.LayoutObjects()
                    .setChildDistance(layout_config_1.LayoutConfig.spacing)
                    .setIsVertical(false);
                this._layout.add(row);
            }
            if (row) {
                const unitBox = new layout_unit_box_1.LayoutUnitBox(unit, playerSlot);
                row.add(unitBox.getLayout());
            }
        });
        if (row) {
            const garbageContainer = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/garbage");
            row.add(garbageContainer);
            this._layout.addAfterLayout(() => {
                garbageContainer.setObjectType(api_1.ObjectType.Ground);
            });
        }
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutUnitBoxes = LayoutUnitBoxes;
//# sourceMappingURL=layout-unit-boxes.js.map