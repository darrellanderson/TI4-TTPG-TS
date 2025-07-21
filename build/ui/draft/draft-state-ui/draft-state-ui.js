"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftStateUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const button_ui_1 = require("../../button-ui/button-ui");
const draft_activity_finish_1 = require("../../../lib/draft-lib/draft-activity-finish/draft-activity-finish");
const draft_to_map_string_1 = require("../../../lib/draft-lib/draft-to-map-string/draft-to-map-string");
const faction_ui_1 = require("../faction-ui/faction-ui");
const grid_ui_builder_1 = require("../../panel/grid-ui-builder");
const horizontal_ui_builder_1 = require("../../panel/horizontal-ui-builder");
const map_ui_1 = require("../../map-ui/map-ui");
const seat_ui_1 = require("../seat-ui/seat-ui");
const slice_ui_1 = require("../slice-ui/slice-ui");
const turn_order_mini_1 = require("../../turn-order-mini/turn-order-mini");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const wrapped_clickable_ui_1 = require("../../wrapped-clickable-ui/wrapped-clickable-ui");
const zoomable_ui_1 = require("../../zoomable-ui/zoomable-ui");
const keleres_ui_1 = require("../faction-ui/keleres-ui");
const confirm_button_ui_1 = require("../../button-ui/confirm-button-ui");
const SPACING = 12;
const COLORS = [
    "#F0F0F0", // white
    "#00CFFF", // blue
    "#572780", // purple
    "#D7B700", // yellow
    "#FF1010", // red
    "#00FF00", // green
    "#F46FCD", // pink
    "#FC6A03", // orange
    "#6E260E", // brown
];
class DraftStateUI extends abtract_ui_1.AbstractUI {
    static _createSliceClickHandler(draftState, sliceIndex) {
        const handler = (_button, player) => {
            const playerSlot = player.getSlot();
            const currentSlot = draftState.getSliceIndexToPlayerSlot(sliceIndex);
            if (currentSlot === -1) {
                // If there was a different candidate selected, clear it.
                for (let i = 0; i < draftState.getSlices().length; i++) {
                    if (draftState.getSliceIndexToPlayerSlot(i) === playerSlot) {
                        draftState.setSliceIndexToPlayerSlot(i, -1);
                    }
                }
                // Select this candidate.
                draftState.setSliceIndexToPlayerSlot(sliceIndex, playerSlot);
                DraftStateUI._maybeAdvanceTurn(player);
            }
            else if (currentSlot === playerSlot) {
                draftState.setSliceIndexToPlayerSlot(sliceIndex, -1);
            }
        };
        return new ttpg_darrell_1.ThrottleClickHandler(handler).get();
    }
    static _createFactionClickHandler(draftState, sliceIndex) {
        const handler = (_button, player) => {
            const playerSlot = player.getSlot();
            const currentSlot = draftState.getFactionIndexToPlayerSlot(sliceIndex);
            if (currentSlot === -1) {
                // If there was a different candidate selected, clear it.
                for (let i = 0; i < draftState.getFactions().length; i++) {
                    if (draftState.getFactionIndexToPlayerSlot(i) === playerSlot) {
                        draftState.setFactionIndexToPlayerSlot(i, -1);
                    }
                }
                // Select this candidate.
                draftState.setFactionIndexToPlayerSlot(sliceIndex, playerSlot);
                DraftStateUI._maybeAdvanceTurn(player);
            }
            else if (currentSlot === playerSlot) {
                draftState.setFactionIndexToPlayerSlot(sliceIndex, -1);
            }
        };
        return new ttpg_darrell_1.ThrottleClickHandler(handler).get();
    }
    static _createSeatClickHandler(draftState, sliceIndex) {
        const handler = (_button, player) => {
            const playerSlot = player.getSlot();
            const currentSlot = draftState.getSeatIndexToPlayerSlot(sliceIndex);
            if (currentSlot === -1) {
                // If there was a different candidate selected, clear it.
                for (let i = 0; i < TI4.config.playerCount; i++) {
                    if (draftState.getSeatIndexToPlayerSlot(i) === playerSlot) {
                        draftState.setSeatIndexToPlayerSlot(i, -1);
                    }
                }
                // Select this candidate.
                draftState.setSeatIndexToPlayerSlot(sliceIndex, playerSlot);
                DraftStateUI._maybeAdvanceTurn(player);
            }
            else if (currentSlot === playerSlot) {
                draftState.setSeatIndexToPlayerSlot(sliceIndex, -1);
            }
        };
        return new ttpg_darrell_1.ThrottleClickHandler(handler).get();
    }
    static _createFinishClickHandler(draftState) {
        const handler = (_button, _player) => {
            ttpg_darrell_1.Broadcast.chatAll(`Draft finished by ${_player.getName()}`);
            new draft_activity_finish_1.DraftActivityFinish(draftState).finishAll();
        };
        return new ttpg_darrell_1.ThrottleClickHandler(handler).get();
    }
    static _createCancelClickHandler(draftState) {
        const handler = (_button, _player) => {
            ttpg_darrell_1.Broadcast.chatAll(`Draft cancelled by ${_player.getName()}`);
            draftState.destroy();
        };
        return new ttpg_darrell_1.ThrottleClickHandler(handler).get();
    }
    constructor(draftState, scale) {
        const sliceLabels = draftState.getSliceLabels();
        const zoomableSliceButtons = [];
        const sliceButtons = draftState
            .getSlices()
            .map((slice, index) => {
            const sliceShape = draftState.getSliceShape(-1);
            const color = DraftStateUI._getSliceColorOrThrow(index);
            const sliceUi = new slice_ui_1.SliceUI(slice, sliceShape, color, scale);
            const label = sliceLabels[index];
            if (label) {
                sliceUi.setLabel(label);
            }
            const clickable = new wrapped_clickable_ui_1.WrappedClickableUI(sliceUi, scale);
            clickable
                .getContentButton()
                .onClicked.add(DraftStateUI._createSliceClickHandler(draftState, index));
            const createZoomedUi = DraftStateUI._getCreateZoomedSliceUi(slice, sliceShape, color);
            const zoomableSliceButton = new zoomable_ui_1.ZoomableUI(clickable, scale, createZoomedUi);
            zoomableSliceButtons.push(zoomableSliceButton);
            return clickable;
        });
        const sliceGrid = new grid_ui_builder_1.GridUIBuilder()
            .addUIs(zoomableSliceButtons)
            .setMaxRows(3)
            .setSpacing(SPACING * scale)
            .build();
        const factionButtons = draftState
            .getFactions()
            .map((faction, index) => {
            let clickable;
            if (faction.getNsid().includes("/keleres")) {
                clickable = new keleres_ui_1.KeleresUI(draftState, scale);
            }
            else {
                const factionUi = new faction_ui_1.FactionUI(faction, scale);
                clickable = new wrapped_clickable_ui_1.WrappedClickableUI(factionUi, scale);
            }
            clickable
                .getContentButton()
                .onClicked.add(DraftStateUI._createFactionClickHandler(draftState, index));
            return clickable;
        });
        const factionGrid = new grid_ui_builder_1.GridUIBuilder()
            .addUIs(factionButtons)
            .setMaxRows(9)
            .setSpacing(SPACING * scale)
            .build();
        const speakerSeatIndex = draftState.getSpeakerIndex();
        const seatButtons = [];
        for (let index = 0; index < TI4.config.playerCount; index++) {
            const seatUi = new seat_ui_1.SeatUI(index, speakerSeatIndex, scale);
            const clickable = new wrapped_clickable_ui_1.WrappedClickableUI(seatUi, scale);
            clickable
                .getContentButton()
                .onClicked.add(DraftStateUI._createSeatClickHandler(draftState, index));
            seatButtons.push(clickable);
        }
        const seatGrid = new grid_ui_builder_1.GridUIBuilder()
            .addUIs(seatButtons)
            .setMaxRows(9)
            .setSpacing(SPACING * scale)
            .build();
        const mapStringAndHexToPlayerName = draft_to_map_string_1.DraftToMapString.fromDraftState(draftState);
        const mapString = mapStringAndHexToPlayerName.mapString;
        const hexToLabel = mapStringAndHexToPlayerName.hexToPlayerName;
        const mapUi = new map_ui_1.MapUI(mapString, hexToLabel, scale);
        // Add zoom button.
        const createZoomedMapUi = DraftStateUI._getCreatedZoomedMapUi(draftState);
        const zoomableMapUi = new zoomable_ui_1.ZoomableUI(mapUi, scale, createZoomedMapUi);
        // Turn order.
        const turnOrderMini = new turn_order_mini_1.TurnOrderMini(scale);
        const finishDraftButton = new button_ui_1.ButtonUI(scale);
        finishDraftButton.getButton().setText("Finish");
        finishDraftButton
            .getButton()
            .onClicked.add(DraftStateUI._createFinishClickHandler(draftState));
        const cancelButton = new button_ui_1.ButtonUI(scale);
        cancelButton.getButton().setText("Cancel");
        cancelButton
            .getButton()
            .onClicked.add(DraftStateUI._createCancelClickHandler(draftState));
        const confirmCancelButton = new confirm_button_ui_1.ConfirmButtonUI(cancelButton);
        const finishAndCancelButtons = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(SPACING * scale)
            .addUIs([finishDraftButton, confirmCancelButton])
            .build();
        const mapOverTurnOrder = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(SPACING * scale)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .addUIs([zoomableMapUi, turnOrderMini, finishAndCancelButtons])
            .build();
        const panel = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .addUIs([sliceGrid, factionGrid, seatGrid, mapOverTurnOrder])
            .setPadding(SPACING * scale)
            .setSpacing(SPACING * scale)
            .build();
        super(panel.getWidget(), panel.getSize());
        this._draftState = draftState;
        this._onDraftStateChangedHandler = () => {
            sliceButtons.forEach((button, index) => {
                const playerSlot = draftState.getSliceIndexToPlayerSlot(index);
                button.setOwningPlayerSlot(playerSlot);
            });
            factionButtons.forEach((button, index) => {
                const playerSlot = draftState.getFactionIndexToPlayerSlot(index);
                button.setOwningPlayerSlot(playerSlot);
            });
            seatButtons.forEach((button, index) => {
                const playerSlot = draftState.getSeatIndexToPlayerSlot(index);
                button.setOwningPlayerSlot(playerSlot);
            });
            const newMapStringAndHexToPlayerName = draft_to_map_string_1.DraftToMapString.fromDraftState(draftState);
            const newMapString = newMapStringAndHexToPlayerName.mapString;
            const newHexToLabel = newMapStringAndHexToPlayerName.hexToPlayerName;
            mapUi.update(newMapString, newHexToLabel);
            finishDraftButton.getButton().setEnabled(draftState.isComplete());
        };
        draftState.onDraftStateChanged.add(this._onDraftStateChangedHandler);
        this._onDraftStateChangedHandler();
    }
    destroy() {
        super.destroy();
        this._draftState.onDraftStateChanged.remove(this._onDraftStateChangedHandler);
    }
}
exports.DraftStateUI = DraftStateUI;
DraftStateUI._maybeAdvanceTurn = (player) => {
    const playerSlot = player.getSlot();
    if (TI4.turnOrder.getCurrentTurn() === playerSlot) {
        TI4.turnOrder.nextTurn();
    }
};
DraftStateUI._getCreateZoomedSliceUi = (slice, sliceShape, color) => {
    return (scale) => {
        return new slice_ui_1.SliceUI(slice, sliceShape, color, scale * 3.5);
    };
};
DraftStateUI._getCreatedZoomedMapUi = (draftState) => {
    return (scale) => {
        const mapStringAndHexToPlayerName = draft_to_map_string_1.DraftToMapString.fromDraftState(draftState);
        const mapString = mapStringAndHexToPlayerName.mapString;
        const hexToLabel = mapStringAndHexToPlayerName.hexToPlayerName;
        return new map_ui_1.MapUI(mapString, hexToLabel, scale * 2);
    };
};
DraftStateUI._getSliceColorOrThrow = (index) => {
    const colorString = COLORS[index];
    if (!colorString) {
        throw new Error(`Missing color for index ${index}`);
    }
    return new ttpg_darrell_1.ColorLib().parseColorOrThrow(colorString);
};
//# sourceMappingURL=draft-state-ui.js.map