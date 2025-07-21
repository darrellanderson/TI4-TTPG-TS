"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamerToolUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../abstract-ui/abtract-ui");
const checkbox_ui_1 = require("../button-ui/checkbox-ui");
const config_1 = require("../config/config");
const editable_ui_1 = require("../button-ui/editable-ui");
const label_ui_1 = require("../button-ui/label-ui");
const vertical_ui_builder_1 = require("../panel/vertical-ui-builder");
class StreamerToolUI extends abtract_ui_1.AbstractUI {
    constructor(scale, playerSlot) {
        const player = api_1.world.getPlayerBySlot(playerSlot);
        const labelTimestamp = new label_ui_1.LabelUI(scale);
        labelTimestamp.getText().setText("Game timestamp:");
        const editableTimestamp = new editable_ui_1.EditableUI(scale);
        editableTimestamp.getEditText().setText(`${TI4.config.timestamp}`);
        const hideMouseCursor = new checkbox_ui_1.CheckBoxUI(scale);
        hideMouseCursor.getCheckBox().setText("Hide mouse cursor");
        if (player) {
            hideMouseCursor
                .getCheckBox()
                .setIsChecked(TI4.hideMouseCursor.hasHideCursor(player));
        }
        hideMouseCursor
            .getCheckBox()
            .onCheckStateChanged.add((_checkBox, clickingPlayer, isChecked) => {
            if (isChecked) {
                TI4.hideMouseCursor.addHideCursor(clickingPlayer);
            }
            else {
                TI4.hideMouseCursor.removeHideCursor(clickingPlayer);
            }
        });
        const whisperSpy = new checkbox_ui_1.CheckBoxUI(scale);
        whisperSpy.getCheckBox().setText("Whisper spy");
        if (player) {
            whisperSpy.getCheckBox().setIsChecked(TI4.whisperSpy.hasReportTo(player));
        }
        whisperSpy
            .getCheckBox()
            .onCheckStateChanged.add((_checkBox, clickingPlayer, isChecked) => {
            if (isChecked) {
                TI4.whisperSpy.addReportTo(clickingPlayer);
            }
            else {
                TI4.whisperSpy.removeReportTo(clickingPlayer);
            }
        });
        const useStreamerBuddy = new checkbox_ui_1.CheckBoxUI(scale);
        useStreamerBuddy.getCheckBox().setText("Streamer buddy");
        useStreamerBuddy
            .getCheckBox()
            .setIsChecked(TI4.useStreamerBuddy.getUseStreamerBuddy());
        useStreamerBuddy
            .getCheckBox()
            .onCheckStateChanged.add((_checkBox, clickingPlayer, isChecked) => {
            const playerName = TI4.playerName.getByPlayer(clickingPlayer);
            const msg = `Streamer buddy ${isChecked ? "enabled" : "disabled"} by ${playerName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            TI4.useStreamerBuddy.setUseStreamerBuddy(isChecked);
        });
        const autoStreamerCamera = new checkbox_ui_1.CheckBoxUI(scale);
        autoStreamerCamera.getCheckBox().setText("Auto move camera");
        autoStreamerCamera
            .getCheckBox()
            .setIsChecked(TI4.autoStreamerCamera.hasStreamerPlayerSlot(playerSlot));
        autoStreamerCamera
            .getCheckBox()
            .onCheckStateChanged.add((_checkBox, clickingPlayer, isChecked) => {
            const clickingPlayerSlot = clickingPlayer.getSlot();
            if (isChecked) {
                TI4.autoStreamerCamera.addStreamerPlayerSlot(clickingPlayerSlot);
            }
            else {
                TI4.autoStreamerCamera.removeStreamerPlayerSlot(clickingPlayerSlot);
            }
        });
        const ui = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([
            labelTimestamp,
            editableTimestamp,
            hideMouseCursor,
            whisperSpy,
            useStreamerBuddy,
            autoStreamerCamera,
        ])
            .build();
        super(ui.getWidget(), ui.getSize());
        this._editableTimestampCommitted = (textBox, _player, _text, _usingEnter) => {
            textBox.setText(`${TI4.config.timestamp}`);
        };
        this._ui = ui;
        editableTimestamp
            .getEditText()
            .onTextCommitted.add(this._editableTimestampCommitted);
    }
    destroy() {
        this._ui.destroy();
    }
}
exports.StreamerToolUI = StreamerToolUI;
//# sourceMappingURL=streamer-tool-ui.js.map