import { AbstractUI } from "../abstract-ui/abtract-ui";
import { LabelUI } from "../button-ui/label-ui";
import { CONFIG } from "../config/config";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class StreamerUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(scale: number) {
    const labelX: LabelUI = new LabelUI(scale);

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([labelX])
      .build();

    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
  }
}
