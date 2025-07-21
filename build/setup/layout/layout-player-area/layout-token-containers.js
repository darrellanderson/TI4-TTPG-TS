"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutTokenContainers = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_tradegood_containers_1 = require("../layout-fighter-inf-tg-containers/layout-tradegood-containers");
class LayoutTokenContainers {
    constructor(playerSlot) {
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(false);
        const colorLib = new ttpg_darrell_1.ColorLib();
        const colorsType = colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
        const objColor = colorLib.parseColorOrThrow(colorsType.plastic);
        const factionExtrasContainer = ttpg_darrell_1.Spawn.spawnOrThrow("container:base/faction-extras");
        factionExtrasContainer.setOwningPlayerSlot(playerSlot);
        factionExtrasContainer.setPrimaryColor(objColor);
        factionExtrasContainer.setRotation([0, 0, 180]);
        const commandTokenContainer = ttpg_darrell_1.Spawn.spawnOrThrow("container.token.command:base/generic");
        const controlTokenContainer = ttpg_darrell_1.Spawn.spawnOrThrow("container.token.control:base/generic");
        commandTokenContainer.setOwningPlayerSlot(playerSlot);
        commandTokenContainer.setPrimaryColor(objColor);
        commandTokenContainer.setRotation([0, 0, 180]); // floating ui when flipped
        controlTokenContainer.setOwningPlayerSlot(playerSlot);
        controlTokenContainer.setPrimaryColor(objColor);
        controlTokenContainer.setRotation([0, 0, 180]);
        let tags;
        const commandTokenTag = `command(${playerSlot})`;
        if (commandTokenContainer instanceof api_1.Container) {
            tags = commandTokenContainer.getContainerTags();
            if (!tags.includes(commandTokenTag)) {
                tags.push(commandTokenTag);
                commandTokenContainer.setContainerTags(tags);
            }
        }
        const controlTokenTag = `control(${playerSlot})`;
        if (controlTokenContainer instanceof api_1.Container) {
            tags = controlTokenContainer.getContainerTags();
            if (!tags.includes(controlTokenTag)) {
                tags.push(controlTokenTag);
                controlTokenContainer.setContainerTags(tags);
            }
            controlTokenContainer.setType(1);
        }
        const col1 = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(true)
            .add(commandTokenContainer)
            .add(controlTokenContainer);
        const col2 = new layout_tradegood_containers_1.LayoutTradegoodContainers()
            .getLayout()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setIsVertical(true);
        const lower = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .add(col1)
            .add(col2)
            .addAfterLayout(() => {
            commandTokenContainer.setObjectType(api_1.ObjectType.Ground);
            controlTokenContainer.setObjectType(api_1.ObjectType.Ground);
        });
        this._layout
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .setIsVertical(true)
            .add(factionExtrasContainer)
            .add(lower)
            .addAfterLayout(() => {
            factionExtrasContainer.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutTokenContainers = LayoutTokenContainers;
//# sourceMappingURL=layout-token-containers.js.map