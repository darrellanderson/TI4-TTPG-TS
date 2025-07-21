"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPremadeUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const premade_maps_2p_data_1 = require("../../lib/map-string-lib/data/premade-maps-2p.data");
const premade_maps_3p_data_1 = require("../../lib/map-string-lib/data/premade-maps-3p.data");
const premade_maps_4p_data_1 = require("../../lib/map-string-lib/data/premade-maps-4p.data");
const premade_maps_5p_data_1 = require("../../lib/map-string-lib/data/premade-maps-5p.data");
const premade_maps_6p_data_1 = require("../../lib/map-string-lib/data/premade-maps-6p.data");
const premade_maps_7p_data_1 = require("../../lib/map-string-lib/data/premade-maps-7p.data");
const premade_maps_8p_data_1 = require("../../lib/map-string-lib/data/premade-maps-8p.data");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const button_ui_1 = require("../button-ui/button-ui");
const config_1 = require("../config/config");
const editable_ui_1 = require("../button-ui/editable-ui");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const label_ui_1 = require("../button-ui/label-ui");
const map_ui_1 = require("../map-ui/map-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
class MapPremadeUI extends abtract_ui_1.AbstractUI {
    static _emptyMapString(playerCount) {
        if (playerCount <= 6) {
            return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0";
        }
        return "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0";
    }
    static getPremadeMaps(playerCount) {
        if (playerCount === 2) {
            return premade_maps_2p_data_1.PREMADE_MAPS_2P;
        }
        else if (playerCount === 3) {
            return premade_maps_3p_data_1.PREMADE_MAPS_3P;
        }
        else if (playerCount === 4) {
            return premade_maps_4p_data_1.PREMADE_MAPS_4P;
        }
        else if (playerCount === 5) {
            return premade_maps_5p_data_1.PREMADE_MAPS_5P;
        }
        else if (playerCount === 6) {
            return premade_maps_6p_data_1.PREMADE_MAPS_6P;
        }
        else if (playerCount === 7) {
            return premade_maps_7p_data_1.PREMADE_MAPS_7P;
        }
        else if (playerCount === 8) {
            return premade_maps_8p_data_1.PREMADE_MAPS_8P;
        }
        return [];
    }
    constructor(scale) {
        // Show selected map.
        const playerCount = TI4.config.playerCount;
        const mapString = MapPremadeUI._emptyMapString(playerCount);
        const hexToLabel = new Map();
        const mapUi = new map_ui_1.MapUI(mapString, hexToLabel, scale * 1.5);
        const useMapButton = new button_ui_1.ButtonUI(scale);
        useMapButton.getButton().setText("Use Map");
        useMapButton.getButton().onClicked.add(new ttpg_darrell_1.ThrottleClickHandler((_button, _player) => {
            this.onMapString.trigger(this._mapString);
        }).get());
        useMapButton.getButton().setEnabled(false);
        const filterLabel = new label_ui_1.LabelUI(scale);
        filterLabel.getText().setText("Filter:");
        filterLabel.getText().setJustification(api_1.TextJustification.Right);
        const filter = new editable_ui_1.EditableUI(scale);
        const filterLabelAndFilter = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([filterLabel, filter])
            .build();
        const mapLeft = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([filterLabelAndFilter, mapUi, useMapButton])
            .setHorizontalAlignment(api_1.HorizontalAlignment.Right)
            .build();
        // Show premade maps.
        const premadeMaps = MapPremadeUI.getPremadeMaps(playerCount);
        const premadeMapButtons = premadeMaps.map((premadeMap) => {
            const buttonUi = new button_ui_1.ButtonUI(scale);
            buttonUi
                .getButton()
                .setText(premadeMap.name.replace("[", "\n["))
                .setFontSize(8 * scale);
            buttonUi.getButton().onClicked.add(() => {
                this._mapString = premadeMap.mapString;
                mapUi.update(premadeMap.mapString, hexToLabel);
                useMapButton.getButton().setEnabled(true);
            });
            return buttonUi;
        });
        const premadeMapsList = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .setOverrideHeight(mapLeft.getSize().h)
            .addUIs(premadeMapButtons)
            .build();
        const abstractUi = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([mapLeft, premadeMapsList])
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .build();
        super(abstractUi.getWidget(), abstractUi.getSize());
        this.onMapString = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._mapString = "";
        this._onFilterTextChanged = (_textBox, _player, text) => {
            text = text.toLowerCase();
            this._premadeMapButtons.forEach((button) => {
                const isVisible = button.getText().toLowerCase().includes(text);
                button.setVisible(isVisible);
                const parent = button.getParent();
                if (parent && parent instanceof api_1.LayoutBox) {
                    parent.setVisible(isVisible);
                    const grandParent = parent.getParent();
                    if (grandParent && grandParent instanceof api_1.LayoutBox) {
                        grandParent.setVisible(isVisible);
                    }
                }
            });
        };
        this._mapString = mapString;
        this._premadeMapButtons = premadeMapButtons.map((buttonUi) => {
            return buttonUi.getButton();
        });
        filter.getEditText().onTextChanged.add(this._onFilterTextChanged);
    }
}
exports.MapPremadeUI = MapPremadeUI;
//# sourceMappingURL=map-premade-ui.js.map