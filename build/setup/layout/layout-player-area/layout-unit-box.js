"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutUnitBox = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class LayoutUnitBox {
    constructor(unit, playerSlot) {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const isAnonymousUnitBox = playerSlot === 19;
        const colorLib = new ttpg_darrell_1.ColorLib();
        let objColor = undefined;
        if (isAnonymousUnitBox) {
            objColor = TI4.playerColor.getAnonymousColor();
        }
        else {
            const colorsType = colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
            objColor = colorLib.parseColorOrThrow(colorsType.plastic);
        }
        const source = unit === "mech" ? "pok" : "base";
        const containerNsid = `container.unit:${source}/${unit}`;
        const unitNsid = `unit:${source}/${unit}`;
        const unitTag = `${unit}(${playerSlot})`;
        let tags;
        const unitAttrs = TI4.unitAttrsRegistry
            .defaultUnitAttrsSet()
            .getOrThrow(unit);
        let componentCount = unitAttrs.getComponentCount();
        if (isAnonymousUnitBox) {
            componentCount = 1; // anonymous gets one
        }
        // Create the container.
        const container = ttpg_darrell_1.Spawn.spawnOrThrow(containerNsid);
        container.setOwningPlayerSlot(playerSlot);
        container.setPrimaryColor(objColor);
        container.setRotation([0, 0, 180]); // image on top, flip because using UI instead
        if (container instanceof api_1.Container) {
            tags = container.getContainerTags();
            if (!tags.includes(unitTag)) {
                tags.push(unitTag);
                container.setContainerTags(tags);
            }
            if (isAnonymousUnitBox) {
                container.setType(1); // infinite
            }
        }
        if (container instanceof api_1.Container) {
            const above = container.getPosition().add([0, 0, 10]);
            for (let i = 0; i < componentCount; i++) {
                const platic = ttpg_darrell_1.Spawn.spawnOrThrow(unitNsid, above);
                platic.setOwningPlayerSlot(playerSlot);
                platic.setPrimaryColor(objColor);
                tags = platic.getTags();
                if (!tags.includes(unitTag)) {
                    tags.push(unitTag);
                    platic.setTags(tags);
                }
                container.insert([platic]);
            }
        }
        this._layout.add(container);
        this._layout.addAfterLayout(() => {
            container.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutUnitBox = LayoutUnitBox;
//# sourceMappingURL=layout-unit-box.js.map