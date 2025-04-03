import { Broadcast, PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CheckBoxUI } from "../button-ui/checkbox-ui";
import { CONFIG } from "../config/config";
import { EditableUI } from "../button-ui/editable-ui";
import { LabelUI } from "../button-ui/label-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { CheckBox, Player, TextBox, world } from "@tabletop-playground/api";

export class StreamerToolUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  readonly _editableTimestampCommitted = (
    textBox: TextBox,
    _player: Player,
    _text: string,
    _usingEnter: boolean
  ): void => {
    textBox.setText(`${TI4.config.timestamp}`);
  };

  constructor(scale: number, playerSlot: PlayerSlot) {
    const player: Player | undefined = world.getPlayerBySlot(playerSlot);

    const labelTimestamp: LabelUI = new LabelUI(scale);
    labelTimestamp.getText().setText("Game timestamp:");

    const editableTimestamp: EditableUI = new EditableUI(scale);
    editableTimestamp.getEditText().setText(`${TI4.config.timestamp}`);

    const hideMouseCursor: CheckBoxUI = new CheckBoxUI(scale);
    hideMouseCursor.getCheckBox().setText("Hide mouse cursor");
    if (player) {
      hideMouseCursor
        .getCheckBox()
        .setIsChecked(TI4.hideMouseCursor.hasHideCursor(player));
    }
    hideMouseCursor
      .getCheckBox()
      .onCheckStateChanged.add(
        (
          _checkBox: CheckBox,
          clickingPlayer: Player,
          isChecked: boolean
        ): void => {
          if (isChecked) {
            TI4.hideMouseCursor.addHideCursor(clickingPlayer);
          } else {
            TI4.hideMouseCursor.removeHideCursor(clickingPlayer);
          }
        }
      );

    const useStreamerBuddy: CheckBoxUI = new CheckBoxUI(scale);
    useStreamerBuddy.getCheckBox().setText("Streamer buddy");
    useStreamerBuddy
      .getCheckBox()
      .setIsChecked(TI4.useStreamerBuddy.getUseStreamerBuddy());
    useStreamerBuddy
      .getCheckBox()
      .onCheckStateChanged.add(
        (
          _checkBox: CheckBox,
          clickingPlayer: Player,
          isChecked: boolean
        ): void => {
          const playerName: string = TI4.playerName.getByPlayer(clickingPlayer);
          const msg: string = `Streamer buddy ${isChecked ? "enabled" : "disabled"} by ${playerName}`;
          Broadcast.chatAll(msg);
          TI4.useStreamerBuddy.setUseStreamerBuddy(isChecked);
        }
      );

    const autoStreamerCamera: CheckBoxUI = new CheckBoxUI(scale);
    autoStreamerCamera.getCheckBox().setText("Auto move camera");
    autoStreamerCamera
      .getCheckBox()
      .setIsChecked(TI4.autoStreamerCamera.hasStreamerPlayerSlot(playerSlot));
    autoStreamerCamera
      .getCheckBox()
      .onCheckStateChanged.add(
        (
          _checkBox: CheckBox,
          clickingPlayer: Player,
          isChecked: boolean
        ): void => {
          const clickingPlayerSlot: PlayerSlot = clickingPlayer.getSlot();
          if (isChecked) {
            TI4.autoStreamerCamera.addStreamerPlayerSlot(clickingPlayerSlot);
          } else {
            TI4.autoStreamerCamera.removeStreamerPlayerSlot(clickingPlayerSlot);
          }
        }
      );

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        labelTimestamp,
        editableTimestamp,
        hideMouseCursor,
        useStreamerBuddy,
        autoStreamerCamera,
      ])
      .build();

    super(ui.getWidget(), ui.getSize());
    this._ui = ui;

    editableTimestamp
      .getEditText()
      .onTextCommitted.add(this._editableTimestampCommitted);
  }

  destroy(): void {
    this._ui.destroy();
  }
}
