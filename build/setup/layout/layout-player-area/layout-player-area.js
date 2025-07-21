"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutPlayerArea = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_mats_1 = require("./layout-mats");
const layout_sheets_1 = require("./layout-sheets");
const layout_token_containers_1 = require("./layout-token-containers");
const layout_unit_boxes_1 = require("./layout-unit-boxes");
const place_generic_promissories_1 = require("./place-generic-promissories");
const layout_row_troves_and_status_pad_1 = require("./layout-row-troves-and-status-pad");
class LayoutPlayerArea {
    constructor(playerSlot) {
        const innerLayout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .setIsVertical(true)
            .setVerticalAlignment(api_1.VerticalAlignment.Top);
        // Status pad alone at very top, gives players' a little space too.
        const trovesAndStatusPad = new layout_row_troves_and_status_pad_1.LayoutRowTrovesAndStatusPad(playerSlot).getLayout();
        // Center top to bottom.
        const layoutUnitBoxes = new layout_unit_boxes_1.LayoutUnitBoxes(playerSlot).getLayout();
        const extraSpaceBetweenBoxesAndSheets = new ttpg_darrell_1.LayoutObjects().setOverrideWidth(3);
        const layoutSheets = new layout_sheets_1.LayoutSheets(playerSlot).getLayout();
        const layoutTokenContainers = new layout_token_containers_1.LayoutTokenContainers(playerSlot).getLayout();
        const topRow = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .add(layoutUnitBoxes)
            .add(extraSpaceBetweenBoxesAndSheets) // for extra leaders, alliance cards, etc
            .add(layoutSheets)
            .add(layoutTokenContainers);
        const layoutMats = new layout_mats_1.LayoutMats(playerSlot).getLayout();
        const cardHolder = ttpg_darrell_1.Spawn.spawnOrThrow("card-holder:base/player-hand");
        cardHolder.setOwningPlayerSlot(playerSlot);
        if (cardHolder instanceof api_1.CardHolder) {
            cardHolder.setHiddenCardsType(api_1.HiddenCardsType.Back);
        }
        innerLayout
            .add(trovesAndStatusPad)
            .add(topRow)
            .add(layoutMats)
            .add(cardHolder);
        innerLayout.addAfterLayout(() => {
            cardHolder.setObjectType(api_1.ObjectType.Ground);
            const player = api_1.world.getPlayerBySlot(playerSlot);
            if (player && cardHolder instanceof api_1.CardHolder) {
                player.setHandHolder(cardHolder);
            }
        });
        // Inner layout must be complete to measure size correctly.
        const colorLib = new ttpg_darrell_1.ColorLib();
        const colorsType = colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
        const color = colorLib.parseColorOrThrow(colorsType.widget);
        const padding = layout_config_1.LayoutConfig.spacingWide;
        this._layout = new ttpg_darrell_1.LayoutBorder(innerLayout, padding)
            .setColor(color)
            .setOutlineWidth(1)
            .setTag(`player-area-${playerSlot}`);
        this._layout.addAfterLayout(() => {
            new place_generic_promissories_1.PlaceGenericPromissories(playerSlot).place();
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutPlayerArea = LayoutPlayerArea;
//# sourceMappingURL=layout-player-area.js.map