"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeColorUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const button_ui_1 = require("../button-ui/button-ui");
const color_choice_button_1 = require("./color-choice-button");
const config_1 = require("../config/config");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const label_ui_1 = require("../button-ui/label-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
class ChangeColorUI extends abtract_ui_1.AbstractUI {
    static _getAllColorNames() {
        return Object.keys(ttpg_darrell_1.COLORS);
    }
    static _getClickHandler(targetPlayerSlot, colorName, colorHex) {
        return (_button, player) => {
            TI4.events.onPlayerChangedColor.trigger(targetPlayerSlot, colorName, colorHex, player);
        };
    }
    static _getColorRow(colorName, targetPlayerSlot, scale) {
        // Disable if color in use.
        const inUseColorNames = new Set();
        TI4.playerSeats.getAllSeats().forEach((playerSeat) => {
            const playerSlot = playerSeat.playerSlot;
            if (playerSlot !== targetPlayerSlot) {
                const inUseColorName = TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
                inUseColorNames.add(inUseColorName);
            }
        });
        const isEnabled = !inUseColorNames.has(colorName);
        const nameUi = new label_ui_1.LabelUI(scale);
        nameUi.getText().setText(colorName);
        if (!isEnabled) {
            nameUi.getText().setTextColor([0, 0, 0, 1]);
        }
        const uis = [nameUi];
        const colorLib = new ttpg_darrell_1.ColorLib();
        const numColors = colorLib.getColorsLengthOrThrow(colorName);
        for (let i = 0; i < numColors; i++) {
            const colorsType = colorLib.getColorsByNameOrThrow(colorName, i);
            const colorHex = colorsType.widget;
            const colorUi = new color_choice_button_1.ColorChoiceButton(colorHex, scale);
            colorUi
                .getContentButton()
                .onClicked.add(ChangeColorUI._getClickHandler(targetPlayerSlot, colorName, colorHex));
            // Only allow colors not already in use.
            colorUi.getContentButton().setEnabled(isEnabled);
            uis.push(colorUi);
        }
        return new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
    }
    constructor(targetPlayerSlot, scale) {
        const uis = [];
        const colorNames = ChangeColorUI._getAllColorNames();
        for (const colorName of colorNames) {
            uis.push(ChangeColorUI._getColorRow(colorName, targetPlayerSlot, scale));
        }
        const cancelButton = new button_ui_1.ButtonUI(scale);
        cancelButton.getButton().setText("Cancel");
        uis.push(cancelButton);
        const abstractUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(uis)
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this._cancelButton = cancelButton.getButton();
    }
    getCancelButton() {
        return this._cancelButton;
    }
}
exports.ChangeColorUI = ChangeColorUI;
//# sourceMappingURL=change-color-ui.js.map