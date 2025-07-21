"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapToolUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const map_place_frontier_tokens_1 = require("../../lib/map-string-lib/map-place/map-place-frontier-tokens");
const map_place_planet_cards_1 = require("../../lib/map-string-lib/map-place/map-place-planet-cards");
const map_remove_all_non_home_systems_1 = require("../../lib/map-string-lib/map-remove/map-remove-all-non-home-systems");
const map_remove_frontier_tokens_1 = require("../../lib/map-string-lib/map-remove/map-remove-frontier-tokens");
const map_remove_planet_cards_1 = require("../../lib/map-string-lib/map-remove/map-remove-planet-cards");
const map_string_load_1 = require("../../lib/map-string-lib/map-string/map-string-load");
const map_string_save_1 = require("../../lib/map-string-lib/map-string/map-string-save");
const map_string_hyperlanes_1 = require("../../lib/map-string-lib/map-string/map-string-hyperlanes");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const button_ui_1 = require("../button-ui/button-ui");
const draft_start_window_1 = require("../draft/draft-start-ui/draft-start-window");
const horizontal_ui_builder_1 = require("../panel/horizontal-ui-builder");
const label_ui_1 = require("../button-ui/label-ui");
const map_premade_ui_1 = require("../map-premade-ui/map-premade-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
const config_1 = require("../config/config");
const abstract_window_1 = require("../abstract-window/abstract-window");
class MapToolUI extends abtract_ui_1.AbstractUI {
    constructor(scale) {
        const labelUi = new label_ui_1.LabelUI(scale);
        labelUi.getText().setText("Map string:");
        labelUi.getText().setJustification(api_1.TextJustification.Right);
        const buttonPremadeMap = new button_ui_1.ButtonUI(scale);
        buttonPremadeMap.getButton().setText("Use premade map...");
        const buttonSliceDraft = new button_ui_1.ButtonUI(scale);
        buttonSliceDraft.getButton().setText("Use slice draft...");
        const editText = new api_1.TextBox()
            .setFontSize(config_1.CONFIG.FONT_SIZE * scale)
            .setMaxLength(1000);
        const textBoxSize = {
            w: config_1.CONFIG.BUTTON_WIDTH * scale,
            h: config_1.CONFIG.BUTTON_HEIGHT * scale,
        };
        const layoutBox = new api_1.LayoutBox()
            .setChild(editText)
            .setOverrideHeight(textBoxSize.h)
            .setOverrideWidth(textBoxSize.w);
        const textBoxUi = new (class extends abtract_ui_1.AbstractUI {
            constructor() {
                super(layoutBox, textBoxSize);
            }
        })();
        const buttonLoad = new button_ui_1.ButtonUI(scale);
        buttonLoad.getButton().setText("Load map from string");
        const buttonPlacePlanetCards = new button_ui_1.ButtonUI(scale);
        buttonPlacePlanetCards.getButton().setText("Place planet cards");
        const buttonPlaceFrontierTokens = new button_ui_1.ButtonUI(scale);
        buttonPlaceFrontierTokens.getButton().setText("Place frontier tokens");
        const buttonPlaceHyperlanes = new button_ui_1.ButtonUI(scale);
        buttonPlaceHyperlanes.getButton().setText("Place hyperlanes");
        const buttonSave = new button_ui_1.ButtonUI(scale);
        buttonSave.getButton().setText("Save map string");
        const buttonRemovePlanetCards = new button_ui_1.ButtonUI(scale);
        buttonRemovePlanetCards.getButton().setText("Clear planet cards");
        const buttonRemoveFrontierTokens = new button_ui_1.ButtonUI(scale);
        buttonRemoveFrontierTokens.getButton().setText("Clear frontier tokens");
        const buttonClearMap = new button_ui_1.ButtonUI(scale);
        buttonClearMap.getButton().setText("Clear all");
        const left = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([
            buttonPremadeMap,
            labelUi,
            buttonLoad,
            buttonPlacePlanetCards,
            buttonPlaceFrontierTokens,
            buttonPlaceHyperlanes,
        ])
            .build();
        const right = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([
            buttonSliceDraft,
            textBoxUi,
            buttonSave,
            buttonRemovePlanetCards,
            buttonRemoveFrontierTokens,
            buttonClearMap,
        ])
            .build();
        const overall = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([left, right])
            .build();
        super(overall.getWidget(), overall.getSize());
        this._premadeMapWindow = undefined;
        this._onUsePremadeMap = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            const namespaceId = undefined;
            const windowTitle = "Premade Maps";
            const abstractWindow = new abstract_window_1.AbstractWindow(this._createMapPremadeUI, namespaceId, windowTitle);
            this._premadeMapWindow = abstractWindow
                .createWindow([playerSlot])
                .attach();
        }).get();
        this._onUseSliceDraft = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerSlot = player.getSlot();
            new draft_start_window_1.DraftStartWindow().createAndAttachWindow(playerSlot);
        }).get();
        this._onMapStringLoad = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Map string loaded by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            const mapString = this._editText.getText();
            new map_string_load_1.MapStringLoad().load(mapString);
        }).get();
        this._onMapStringSave = new ttpg_darrell_1.ThrottleClickHandler(() => {
            const mapString = new map_string_save_1.MapStringSave().save();
            this._editText.setText(mapString);
        }).get();
        this._onPlacePlanetCards = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Planet cards placed by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            new map_place_planet_cards_1.MapPlacePlanetCards().placePlanetCards();
        }).get();
        this._onPlaceFrontierTokens = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Frontier tokens placed by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            new map_remove_frontier_tokens_1.MapRemoveFrontierTokens().removeFrontierTokens();
            new map_place_frontier_tokens_1.MapPlaceFrontierTokens().placeFrontierTokens();
        }).get();
        this._onRemovePlanetCards = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Planet cards removed by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            new map_remove_planet_cards_1.MapRemovePlanetCards().removePlanetCards();
        }).get();
        this._onRemoveFrontierTokens = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Frontier tokens removed by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            new map_remove_frontier_tokens_1.MapRemoveFrontierTokens().removeFrontierTokens();
        }).get();
        this._onPlaceHyperlanes = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Hyperlanes placed by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            const playerCount = TI4.config.playerCount;
            const mapString = map_string_hyperlanes_1.MapStringHyperlanes.get(playerCount);
            new map_string_load_1.MapStringLoad().load(mapString);
        }).get();
        this._onClearMap = new ttpg_darrell_1.ThrottleClickHandler((_button, player) => {
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `Map cleared by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            new map_remove_planet_cards_1.MapRemovePlanetCards().removePlanetCards();
            new map_remove_frontier_tokens_1.MapRemoveFrontierTokens().removeFrontierTokens();
            new map_remove_all_non_home_systems_1.MapRemoveAllNonHomeSystems().removeAllNonHomeSystems();
            this._editText.setText("");
        }).get();
        this._createMapPremadeUI = (params) => {
            const mapPremadeUi = new map_premade_ui_1.MapPremadeUI(params.scale);
            mapPremadeUi.onMapString.add((mapString) => {
                this._editText.setText(mapString);
                if (this._premadeMapWindow) {
                    this._premadeMapWindow.detach();
                    this._premadeMapWindow = undefined;
                }
            });
            return mapPremadeUi;
        };
        this._editText = editText;
        buttonPremadeMap.getButton().onClicked.add(this._onUsePremadeMap);
        buttonSliceDraft.getButton().onClicked.add(this._onUseSliceDraft);
        buttonLoad.getButton().onClicked.add(this._onMapStringLoad);
        buttonPlacePlanetCards.getButton().onClicked.add(this._onPlacePlanetCards);
        buttonPlaceFrontierTokens
            .getButton()
            .onClicked.add(this._onPlaceFrontierTokens);
        buttonPlaceHyperlanes.getButton().onClicked.add(this._onPlaceHyperlanes);
        buttonSave.getButton().onClicked.add(this._onMapStringSave);
        buttonRemovePlanetCards
            .getButton()
            .onClicked.add(this._onRemovePlanetCards);
        buttonRemoveFrontierTokens
            .getButton()
            .onClicked.add(this._onRemoveFrontierTokens);
        buttonClearMap.getButton().onClicked.add(this._onClearMap);
    }
}
exports.MapToolUI = MapToolUI;
//# sourceMappingURL=map-tool-ui.js.map