import { PlayerSlot } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CheckBoxUI } from "../button-ui/checkbox-ui";
import { CONFIG } from "../config/config";
import { EditableUI } from "../button-ui/editable-ui";
import { LabelUI } from "../button-ui/label-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class StreamerToolUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(scale: number, _playerSlot: PlayerSlot) {
    const labelTimestamp: LabelUI = new LabelUI(scale);
    labelTimestamp.getText().setText("Game timestamp:");

    const editableTimestamp: EditableUI = new EditableUI(scale);
    editableTimestamp.getEditText().setText(`${TI4.config.timestamp}`);

    const hideMouseCursor: CheckBoxUI = new CheckBoxUI(scale);
    hideMouseCursor.getCheckBox().setText("Hide mouse cursor");

    const useStreamerBuddy: CheckBoxUI = new CheckBoxUI(scale);
    useStreamerBuddy.getCheckBox().setText("Streamer buddy");

    const autoStreamerCamera: CheckBoxUI = new CheckBoxUI(scale);
    autoStreamerCamera.getCheckBox().setText("Auto streamer camera");

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([
        labelTimestamp,
        editableTimestamp,
        hideMouseCursor,
        autoStreamerCamera,
      ])
      .build();

    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
  }
}
