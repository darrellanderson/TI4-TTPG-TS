"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllPlayersTechsUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const label_ui_1 = require("../button-ui/label-ui");
const config_1 = require("../config/config");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
const MAX_NAME_LENGTH = 20;
class AllPlayersTechsUI extends abtract_ui_1.AbstractUI {
    static getTechNameToColor() {
        const colorLib = new ttpg_darrell_1.ColorLib();
        const techColorToColor = new Map();
        techColorToColor.set("blue", colorLib.parseColorOrThrow("#00D0FE"));
        techColorToColor.set("green", colorLib.parseColorOrThrow("#008000"));
        techColorToColor.set("red", colorLib.parseColorOrThrow("#FE0101"));
        techColorToColor.set("yellow", colorLib.parseColorOrThrow("#e5e500"));
        techColorToColor.set("unit-upgrade", colorLib.parseColorOrThrow("#ffffff"));
        techColorToColor.set("none", colorLib.parseColorOrThrow("#ffffff"));
        const techNameToColor = new Map();
        TI4.techRegistry.getAllTechs().map((tech) => {
            const techColor = tech.getColor();
            const color = techColorToColor.get(techColor);
            if (color !== undefined) {
                techNameToColor.set(tech.getName(), color);
            }
        });
        return techNameToColor;
    }
    constructor(scale, gameData) {
        var _a, _b;
        const techColorToColor = AllPlayersTechsUI.getTechNameToColor();
        const cols = [];
        for (let seatIndex = 0; seatIndex < TI4.config.playerCount; seatIndex++) {
            const player = gameData.players[seatIndex];
            const rows = [];
            // Add header with player name.
            const playerName = (_a = player === null || player === void 0 ? void 0 : player.steamName) !== null && _a !== void 0 ? _a : "";
            const playerNameUi = new label_ui_1.LabelUI(scale);
            playerNameUi.getText().setText(playerName);
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const color = api_1.world.getSlotColor(playerSlot);
            playerNameUi.getText().setTextColor(color);
            rows.push(playerNameUi);
            // Add techs.
            const techNames = (_b = player === null || player === void 0 ? void 0 : player.technologies) !== null && _b !== void 0 ? _b : [];
            techNames.forEach((techName) => {
                const techUi = new label_ui_1.LabelUI(scale);
                // Apply color before potentially truncating the name.
                const playerColor = techColorToColor.get(techName);
                if (playerColor) {
                    techUi.getText().setTextColor(playerColor);
                }
                // Truncate the name if it is too long.
                if (techName.length > MAX_NAME_LENGTH) {
                    techName = techName.substring(0, MAX_NAME_LENGTH - 3) + "...";
                }
                techUi.getText().setText(techName);
                rows.push(techUi);
            });
            const col = new vertical_ui_builder_1.VerticalUIBuilder()
                .setSpacing(0 * scale)
                .addUIs(rows)
                .build();
            cols.push(col);
        }
        const abstractUi = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(cols)
            .build();
        const border = new api_1.Border()
            .setColor(config_1.CONFIG.DARKER)
            .setChild(abstractUi.getWidget());
        const box = new api_1.LayoutBox()
            .setOverrideWidth(abstractUi.getSize().w)
            .setOverrideHeight(abstractUi.getSize().h)
            .setChild(border);
        super(box, abstractUi.getSize());
    }
}
exports.AllPlayersTechsUI = AllPlayersTechsUI;
//# sourceMappingURL=all-players-techs-ui.js.map